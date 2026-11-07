#!/usr/bin/env python3
"""Gộp 16 kịch bản video thẩm định dự án khu công nghiệp (lô N206–N221) thành một file PDF để Trung đọc duyệt.

Chạy: python3 scripts/gop_kich_ban_pdf.py   (không dùng -I vì PyMuPDF nằm trong thư viện của người dùng)
Chỉ gộp và trình bày, không sửa nội dung kịch bản. Chạy lại được khi kịch bản đổi.

Đầu vào : san_pham/2026.11.03.<chủ đề>/tai_nguyen/kich_ban/2026.11.03.<chủ đề>_v1.md
          (bảng mã → chủ đề đọc từ du_lieu/lo_giao_viec/vidmoi_lo_n206_n221_giao_viec.md)
Đầu ra  : san_pham/2026.11.03.kich_ban_16_video_tham_dinh_kcn/
            2026.11.03.kich_ban_16_video_tham_dinh_kcn_v1.md    (markdown đã ghép)
            2026.11.03.kich_ban_16_video_tham_dinh_kcn_v1.html  (pandoc, CSS nhúng sẵn)
            2026.11.03.kich_ban_16_video_tham_dinh_kcn_v1.pdf   (Chrome không giao diện)
            2026.11.03.kich_ban_16_video_tham_dinh_kcn_v1.txt   (chữ tách từ PDF, để kiểm ẩn danh)
Cần     : pandoc, Google Chrome, PyMuPDF (fitz).
Số trang trong mục lục: Chrome không hỗ trợ target-counter, nên script in PDF, đọc số trang
của từng video từ chính PDF, rồi in lại cho tới khi số trang ổn định.
"""
import html
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import fitz  # PyMuPDF

MEDIA = Path(__file__).resolve().parent.parent
GIAO_VIEC = MEDIA / "du_lieu" / "lo_giao_viec" / "vidmoi_lo_n206_n221_giao_viec.md"
THU_MUC_RA = MEDIA / "san_pham" / "2026.11.03.kich_ban_16_video_tham_dinh_kcn"
TEN = "2026.11.03.kich_ban_16_video_tham_dinh_kcn_v1"
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

THU_TU = ["N216", "N217", "N211", "N215", "N212", "N221", "N206", "N207",
          "N208", "N220", "N210", "N218", "N219", "N213", "N214", "N209"]

TEN_BIA = "Kịch bản 16 video thẩm định dự án khu công nghiệp — kênh Chuyện nghề Ngân hàng"
DONG_BIA = "Bản 1, ngày 03/11/2026, chờ Trung duyệt"
GHI_CHU_BIA = ("Kịch bản đã được soát độc lập, đã sửa mọi lỗi nặng và lỗi vừa, đã kiểm ẩn danh; "
               "mọi số tiền là ví dụ giả định trên một khu công nghiệp mẫu 300 ha.")

def doc_ma_chu_de():
    ket = {}
    for dong in GIAO_VIEC.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\|\s*(N2\d\d)\s*\|\s*([a-z0-9_]+)\s*\|", dong)
        if m:
            ket[m.group(1)] = m.group(2)
    thieu = [m for m in THU_TU if m not in ket]
    if thieu:
        sys.exit(f"Thiếu mã trong bảng chủ đề: {thieu}")
    return ket


def tach_muc(van_ban):
    """Trả (dòng H1, {tên mục H2: nội dung}) của một file kịch bản."""
    dong = van_ban.splitlines()
    h1 = next(d for d in dong if d.startswith("# "))
    muc, ten, buf = {}, None, []
    for d in dong:
        if d.startswith("## "):
            if ten is not None:
                muc[ten] = "\n".join(buf).strip("\n")
            ten, buf = d[3:].strip(), []
        elif ten is not None:
            buf.append(d)
    if ten is not None:
        muc[ten] = "\n".join(buf).strip("\n")
    return h1[2:].strip(), muc


def tim_muc(muc, tien_to):
    for k, v in muc.items():
        if k.startswith(tien_to):
            return v
    sys.exit(f"Thiếu mục '{tien_to}'")


def giay_sang_phut(s):
    return f"{s // 60}:{s % 60:02d}"


def doc_video(ma, chu_de):
    f = MEDIA / "san_pham" / f"2026.11.03.{chu_de}" / "tai_nguyen" / "kich_ban" / f"2026.11.03.{chu_de}_v1.md"
    if not f.exists():
        sys.exit(f"Không thấy {f}")
    van_ban = f.read_text(encoding="utf-8")
    tieu_de_h1, muc = tach_muc(van_ban)
    # tiêu đề phương án 1
    dong_td = [d for d in tim_muc(muc, "Tiêu đề").splitlines() if re.match(r"^1\.\s", d)]
    if not dong_td:
        sys.exit(f"{ma}: không thấy phương án 1")
    td1 = re.sub(r"^1\.\s*", "", dong_td[0])
    td1 = re.sub(r"\s*\(\d+ ký tự[^)]*\)\s*$", "", td1)
    # độ dài ước, đọc từ mục "Độ dài ước" của chính file
    dai = tim_muc(muc, "Độ dài ước")
    kq = re.findall(r"khoảng (\d+) giây \(", dai)
    if len(kq) != 1:
        sys.exit(f"{ma}: không đọc được độ dài ước ({kq}) trong: {dai[:200]}")
    giay = int(kq[0])
    so_chuong = len(re.findall(r"^### Chương", van_ban, re.M))
    # điểm cần Trung quyết
    diem = []
    nd = tim_muc(muc, "Điểm cần Trung quyết")
    if not re.match(r"\s*Không có", nd):
        cur = None
        for d in nd.splitlines():
            m = re.match(r"^(\d+)\.\s+(.*)$", d)
            if m:
                cur = [m.group(1), [m.group(2)]]
                diem.append(cur)
            elif d.strip() and cur is not None:
                cur[1].append(d.strip())
    return {"ma": ma, "chu_de": chu_de, "file": f, "van_ban": van_ban, "h1": tieu_de_h1,
            "td1": td1, "giay": giay, "so_chuong": so_chuong, "diem": diem,
            "khong_co": not diem}


def la_ghi_chu(diem):
    return "không cần quyết" in " ".join(diem[1])[:80].lower()


def dung_md(videos, trang):
    """Ghép markdown. trang: {khoá: số trang} cho mục lục."""
    out = []
    # --- bìa
    out.append(f'<div class="bia">\n<div class="bia-kenh">Chuyện nghề Ngân hàng</div>\n'
               f'<h1 class="bia-ten">{html.escape(TEN_BIA)}</h1>\n'
               f'<p class="bia-ban">{html.escape(DONG_BIA)}</p>\n'
               f'<p class="bia-ghi">{html.escape(GHI_CHU_BIA)}</p>\n</div>\n')
    # --- mục lục
    muc_luc = [("tong-quan", "Bảng tổng quan 16 video"),
               ("diem-quyet", "Các điểm cần Trung quyết")]
    for v in videos:
        muc_luc.append((v["ma"].lower(), v["h1"]))
    rows = []
    for k, ten in muc_luc:
        rows.append(f'<tr><td class="ml-ten"><a href="#{k}">{html.escape(ten)}</a></td>'
                    f'<td class="ml-so">{trang.get(k, "")}</td></tr>')
    out.append('::: {.chung .muc-luc}\n\n# Mục lục {.khong-dem #muc-luc}\n\n'
               '<table class="ml">\n' + "\n".join(rows) + "\n</table>\n\n:::\n")
    # --- bảng tổng quan
    out.append("::: {.chung .tong-quan}\n\n# Bảng tổng quan 16 video {#tong-quan}\n\n"
               "Thứ tự theo thứ tự phát hành. Độ dài ước đọc từ mục \"Độ dài ước\" của từng kịch bản "
               "(số giây lời đọc cộng 10 giây màn hình kết).\n")
    out.append("| Thứ tự | Mã | Tiêu đề (phương án 1) | Độ dài ước | Số chương | Điểm cần quyết |")
    out.append("|:-:|:-:|---|:-:|:-:|:-:|")
    tong_diem = 0
    for i, v in enumerate(videos, 1):
        n = len([d for d in v["diem"] if not la_ghi_chu(d)])
        tong_diem += n
        v["n_quyet"] = n
        out.append(f"| {i} | {v['ma']} | {v['td1']} | {giay_sang_phut(v['giay'])} | {v['so_chuong']} | {n} |")
    tong_giay = sum(v["giay"] for v in videos)
    out.append(f"| | | **Tổng** | **{giay_sang_phut(tong_giay)}** | **{sum(v['so_chuong'] for v in videos)}** | **{tong_diem}** |")
    out.append("\nĐiểm cần quyết không tính ghi chú ghi rõ \"không cần quyết\" "
               "(vẫn in nguyên văn ở phần sau).\n\n:::\n")
    # --- điểm cần Trung quyết
    co = [v for v in videos if not v["khong_co"]]
    khong = [v["ma"] for v in videos if v["khong_co"]]
    out.append("::: {.chung .diem-quyet}\n\n# Các điểm cần Trung quyết {#diem-quyet}\n")
    out.append("Gom nguyên văn mục \"Điểm cần Trung quyết\" của từng kịch bản, theo thứ tự phát hành; "
               "mã video đứng trước mỗi điểm. Video ghi \"Không có\" không liệt kê: "
               + ", ".join(khong) + ".\n")
    for v in co:
        for so, dong in v["diem"]:
            dau = f"**{v['ma']} · điểm {so}.** "
            out.append(dau + "\\\n".join(dong) + "\n")
    out.append(":::\n")
    # --- phần chính
    for v in videos:
        ma = v["ma"]
        than = v["van_ban"].splitlines()
        i = next(k for k, d in enumerate(than) if d.startswith("# "))
        than[i] = than[i] + f" {{#{ma.lower()}}}"
        out.append(f"::: {{.video .p{ma.lower()}}}\n\n" + "\n".join(than).strip("\n") + "\n\n:::\n")
    return "\n".join(out) + "\n"


def css_trang():
    r = ["""
@page { size: A4; margin: 20mm 17mm 20mm 17mm;
  @top-left { content: "Kịch bản 16 video thẩm định KCN · Chuyện nghề Ngân hàng"; font: 8pt var(--phong); color: #777; }
  @top-right { content: ""; }
  @bottom-left { content: "Bản 1 · 03/11/2026 · chờ Trung duyệt"; font: 8pt var(--phong); color: #777; }
  @bottom-right { content: "Trang " counter(page); font: 8pt var(--phong); color: #777; }
}
@page bia { margin: 0;
  @top-left { content: none; } @bottom-left { content: none; } @bottom-right { content: none; } }
"""]
    for ma in THU_TU:
        r.append(f'@page p{ma.lower()} {{ @top-left {{ content: "{ma} · Kịch bản video thẩm định KCN"; '
                 f'font: bold 8.5pt var(--phong); color: #444; }} }}')
        r.append(f'.p{ma.lower()} {{ page: p{ma.lower()}; }}')
    return "\n".join(r)


CSS_CHINH = """
:root { --phong: "Be Vietnam Pro", "Noto Sans", "Helvetica Neue", "Aptos", "Arial", sans-serif; --mau: #1d2a3a; --xam: #666; }
* { box-sizing: border-box; }
html { font-family: var(--phong); color: var(--mau); font-size: 11pt; line-height: 1.5; }
body { margin: 0; }
h1, h2, h3 { font-family: var(--phong); line-height: 1.25; break-after: avoid; }
h1 { font-size: 17pt; margin: 0 0 10pt; padding-bottom: 5pt; border-bottom: 2pt solid #1f4e79; color: #12365a; }
h2 { font-size: 13pt; margin: 16pt 0 6pt; color: #1f4e79; border-bottom: 0.5pt solid #b8c4d2; padding-bottom: 2pt; }
h3 { font-size: 11.5pt; margin: 13pt 0 5pt; color: #12365a; background: #eef3f9; padding: 3pt 6pt; border-left: 3pt solid #1f4e79; }
p { margin: 0 0 6pt; orphans: 3; widows: 3; }
ol, ul { margin: 0 0 8pt; padding-left: 18pt; }
li { margin-bottom: 3pt; }
blockquote { margin: 0 0 8pt 20pt; padding: 1pt 0 1pt 8pt; border-left: 1.5pt solid #c3cad3;
  font-size: 9pt; color: var(--xam); line-height: 1.4; break-inside: avoid; }
blockquote p { margin: 0; }
code { font-family: "Menlo", "Courier New", monospace; font-size: 0.82em; background: #f1f3f5; padding: 0 2pt; overflow-wrap: anywhere; }
table { border-collapse: collapse; width: 100%; font-size: 8.5pt; line-height: 1.35; margin: 6pt 0 10pt; }
th, td { border: 0.5pt solid #b8c4d2; padding: 3pt 4pt; vertical-align: top; text-align: left; overflow-wrap: anywhere; word-break: break-word; }
th { background: #e6edf5; }
tr { break-inside: avoid; }
/* bìa */
.bia { page: bia; height: 297mm; padding: 70mm 26mm 0 26mm; break-after: page; background: #f4f7fb; border-left: 14mm solid #1f4e79; }
.bia-kenh { font-size: 12pt; letter-spacing: 1.5pt; text-transform: uppercase; color: #1f4e79; margin-bottom: 14mm; }
.bia h1.bia-ten { font-size: 25pt; border: 0; line-height: 1.25; margin: 0 0 14mm; color: #12365a; padding: 0; }
.bia-ban { font-size: 14pt; font-weight: bold; margin-bottom: 14mm; }
.bia-ghi { font-size: 11pt; color: #444; border-top: 0.5pt solid #9aa8b8; padding-top: 6mm; max-width: 130mm; }
/* trang chung */
.chung { page: chung; }
.chung h1 { break-before: page; }
.muc-luc h1 { break-before: auto; }
table.ml { font-size: 10.5pt; border: 0; }
table.ml td { border: 0; border-bottom: 0.5pt dotted #aab; padding: 4pt 2pt; }
table.ml td.ml-so { text-align: right; width: 14mm; font-variant-numeric: tabular-nums; }
table.ml a { color: inherit; text-decoration: none; }
.tong-quan table td:nth-child(3) { width: 47%; }
.diem-quyet p { margin-bottom: 9pt; padding-bottom: 6pt; border-bottom: 0.5pt solid #dde3ea; }
/* mỗi video một trang mới */
.video { break-before: page; }
.video > h1 { margin-top: 0; }
.video > p:first-of-type { font-size: 9.5pt; color: var(--xam); }
.video table { font-size: 8pt; table-layout: fixed; }
.video table th:nth-child(1), .video table td:nth-child(1) { width: 14mm; }
.video table th:nth-child(3), .video table td:nth-child(3) { width: 42%; }
"""


def chay(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        sys.exit(f"Lệnh lỗi: {cmd[0]}\n{r.stderr[-1500:]}")
    return r


def md_sang_html(md):
    than = chay(["pandoc", "-f", "commonmark_x", "-t", "html5", "--wrap=none"], input=md).stdout
    return ("<!doctype html>\n<html lang=\"vi\"><head><meta charset=\"utf-8\">\n"
            f"<title>{html.escape(TEN_BIA)}</title>\n<style>\n{css_trang()}\n{CSS_CHINH}\n</style></head>\n"
            f"<body>\n{than}\n</body></html>\n")


def html_sang_pdf(f_html, f_pdf):
    with tempfile.TemporaryDirectory(prefix="gop_kb_chrome_") as tmp:
        chay([CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
              f"--user-data-dir={tmp}", f"--print-to-pdf={f_pdf}", f"file://{f_html}"], timeout=300)
    if not f_pdf.exists() or f_pdf.stat().st_size < 1000:
        sys.exit("Chrome không ra được PDF")


def chuan(s):
    return re.sub(r"\s+", " ", s).strip()


def tim_trang(f_pdf, videos):
    """Số trang (1 = bìa) nơi mỗi mục bắt đầu, đọc từ PDF."""
    doc = fitz.open(f_pdf)
    txt = [chuan(p.get_text()) for p in doc]
    ket = {}
    # bỏ qua trang mục lục: trang chứa "Mục lục" ở đầu
    bat_dau = 1
    while bat_dau < len(txt) and "Mục lục" in txt[bat_dau][:200]:
        bat_dau += 1
    for k, ten in [("tong-quan", "Bảng tổng quan 16 video"), ("diem-quyet", "Các điểm cần Trung quyết")]:
        for i in range(bat_dau, len(txt)):
            if k == "tong-quan" and ten in txt[i][:260]:
                ket[k] = i + 1
                break
            if k == "diem-quyet" and ten in txt[i][:260] and "Gom nguyên văn" in txt[i]:
                ket[k] = i + 1
                break
    for v in videos:
        mau = chuan(v["h1"])[:60]
        for i in range(bat_dau, len(txt)):
            if mau in txt[i][:400]:
                ket[v["ma"].lower()] = i + 1
                break
    thieu = [k for k in ["tong-quan", "diem-quyet"] + [v["ma"].lower() for v in videos] if k not in ket]
    if thieu:
        sys.exit(f"Không tìm thấy trang của: {thieu}")
    return ket, len(doc)


def main():
    ma_cd = doc_ma_chu_de()
    videos = [doc_video(m, ma_cd[m]) for m in THU_TU]
    THU_MUC_RA.mkdir(parents=True, exist_ok=True)
    f_md, f_html, f_pdf, f_txt = (THU_MUC_RA / f"{TEN}{e}" for e in (".md", ".html", ".pdf", ".txt"))
    trang = {}
    so_trang = 0
    for lan in range(4):
        md = dung_md(videos, trang)
        f_md.write_text(md, encoding="utf-8")
        f_html.write_text(md_sang_html(md), encoding="utf-8")
        html_sang_pdf(f_html, f_pdf)
        moi, so_trang = tim_trang(f_pdf, videos)
        print(f"Lần in {lan + 1}: {so_trang} trang")
        if moi == trang:
            break
        trang = moi
    else:
        sys.exit("Số trang mục lục chưa ổn định sau 4 lần in")
    # chữ tách từ PDF, để kiểm ẩn danh và kiểm dấu
    doc = fitz.open(f_pdf)
    f_txt.write_text("\n\f\n".join(p.get_text() for p in doc), encoding="utf-8")
    print(f"PDF: {f_pdf} ({so_trang} trang)")
    for v in videos:
        print(f"  {v['ma']}: {giay_sang_phut(v['giay'])} · {v['so_chuong']} chương · "
              f"{v['n_quyet']} điểm quyết · trang {trang[v['ma'].lower()]}")


if __name__ == "__main__":
    main()
