# -*- coding: utf-8 -*-
"""
Xuất kho phong cách (phong cách viết kịch bản + phong cách dựng video) ra Excel.

NGUỒN SỰ THẬT là file markdown:
    Media\\tai_san\\so_tay_gu\\00_muc_luc.md

Script này CHỈ ĐỌC file markdown đó, tách 3 bảng:
    "Bảng 1" — phong cách viết kịch bản (ngăn A)
    "Bảng 2" — phong cách dựng video   (ngăn B)
    "Bảng 3" — bảng kết hợp kịch bản × dựng
rồi ghi ra file Excel 4 trang (3 bảng + 1 trang hướng dẫn đọc):
    Media\\tai_san\\kho_phong_cach.xlsx

Từ 27/10/2026 script còn đọc hệ trục dựng ở tai_san/so_tay_gu/he_truc_dung.json và thêm 5 trang:
    Truc CL, Truc CT, Truc BC, Truc MAU (kèm mã hex tô màu ô), Cach lam LM
(chất liệu hình có cột cách làm, cột hợp khi / không hợp khi; giá trị mới học từ repo mẫu ghi trạng thái nháp, chưa chấm điểm).
Chạy với --ra <đường dẫn .xlsx> để ghi ra chỗ khác (mặc định ghi đè tai_san/kho_phong_cach.xlsx),
--bo-qua-truc để chỉ xuất ba bảng cũ như trước.

KHÔNG sửa gì trên file Excel — mọi thay đổi phải sửa ở file markdown nguồn
rồi chạy lại script này. Chạy lại sẽ GHI ĐÈ file Excel cũ.

Cách chạy (từ đâu cũng được, script tự tính đường dẫn theo vị trí của chính nó):
    python xuat_kho_phong_cach_excel.py

Viết ngày 2026-07-28 theo cùng lối với xuat_so_dang_ky_excel.py — hai script
cố ý giống nhau để sửa một cái là biết cách sửa cái kia.
"""

import argparse
import json
import re
import sys
from datetime import datetime
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

# Windows đôi khi mở cửa sổ dòng lệnh ở bảng mã cp1252 (không có dấu tiếng
# Việt) — ép thông báo in ra dùng UTF-8 để không vỡ chữ hoặc lỗi khi in.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except AttributeError:
    pass  # Python cũ không có reconfigure() thì bỏ qua, vẫn chạy được

# ---------------------------------------------------------------------------
# Đường dẫn: script nằm ở Media\scripts\, nguồn markdown ở Media\tai_san\so_tay_gu\
# ---------------------------------------------------------------------------
THU_MUC_SCRIPT = Path(__file__).resolve().parent
THU_MUC_MEDIA = THU_MUC_SCRIPT.parent
FILE_NGUON_MD = THU_MUC_MEDIA / "tai_san" / "so_tay_gu" / "00_muc_luc.md"
FILE_DICH_XLSX = THU_MUC_MEDIA / "tai_san" / "kho_phong_cach.xlsx"
FILE_TRUC_JSON = THU_MUC_MEDIA / "tai_san" / "so_tay_gu" / "he_truc_dung.json"

# (tiêu đề cần tìm trong markdown, tên trang tính trong Excel)
# Tên trang tính KHÔNG dấu: Excel cho phép dấu nhưng vài công cụ đọc lại vỡ chữ.
CAC_BANG = [
    ("Bảng 1", "A - Phong cach kich ban"),
    ("Bảng 2", "B - Phong cach dung"),
    ("Bảng 3", "Bang ket hop"),
]


def lam_sach_o(gia_tri: str) -> str:
    """Bỏ cú pháp markdown khỏi nội dung ô để Excel đọc như chữ thường.

    Làm 3 việc, theo đúng thứ tự này:
      1. [chữ hiện](đường/dẫn.md)  ->  chữ hiện        (bỏ phần đường dẫn)
      2. **đậm** và *nghiêng*      ->  đậm, nghiêng    (bỏ dấu sao)
      3. `mã`                      ->  mã              (bỏ dấu huyền ngược)
      4. <br> (xuống dòng markdown) -> xuống dòng thật
    """
    s = str(gia_tri)
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)  # link markdown
    s = s.replace("<br>", "\n").replace("<br/>", "\n")
    s = re.sub(r"\*{1,3}", "", s)  # dấu sao của **đậm** / *nghiêng*
    s = s.replace("`", "")
    return s.strip()


def doc_bang_markdown_theo_tieu_de(noi_dung_md: str, tieu_de_can_tim: str):
    """Tìm heading (dòng bắt đầu bằng '## ') chứa tieu_de_can_tim, rồi đọc
    bảng markdown (định dạng bảng dùng ký tự '|') ĐẦU TIÊN xuất hiện sau
    heading đó. Trả về (danh_sach_cot, danh_sach_dong)."""

    dong = noi_dung_md.splitlines()

    # 1. Tìm vị trí dòng heading khớp tiêu đề
    vi_tri_heading = None
    for i, d in enumerate(dong):
        if d.strip().startswith("## ") and tieu_de_can_tim in d:
            vi_tri_heading = i
            break
    if vi_tri_heading is None:
        raise ValueError(f"Không tìm thấy heading chứa '{tieu_de_can_tim}' trong file markdown.")

    # 2. Từ sau heading, tìm dòng đầu tiên bắt đầu bằng '|' (dòng tiêu đề bảng)
    vi_tri_bat_dau_bang = None
    for i in range(vi_tri_heading + 1, len(dong)):
        if dong[i].strip().startswith("|"):
            vi_tri_bat_dau_bang = i
            break
        # Gặp heading '## ' kế tiếp mà chưa thấy bảng nào -> mục này không có bảng
        if dong[i].strip().startswith("## "):
            break
    if vi_tri_bat_dau_bang is None:
        raise ValueError(f"Không tìm thấy bảng markdown nào sau heading '{tieu_de_can_tim}'.")

    # 3. Đọc liên tục các dòng bắt đầu bằng '|' cho tới khi hết bảng
    dong_bang = []
    for i in range(vi_tri_bat_dau_bang, len(dong)):
        d = dong[i].strip()
        if not d.startswith("|"):
            break
        dong_bang.append(d)

    if len(dong_bang) < 3:
        raise ValueError(
            f"Bảng sau heading '{tieu_de_can_tim}' có ít hơn 1 dòng dữ liệu — "
            "kiểm tra lại file markdown nguồn."
        )

    def tach_dong_thanh_cot(dong_bang_1_dong: str):
        # Bỏ ký tự '|' đầu/cuối rồi tách theo '|', bỏ khoảng trắng thừa từng ô
        noi_dung = dong_bang_1_dong.strip()
        if noi_dung.startswith("|"):
            noi_dung = noi_dung[1:]
        if noi_dung.endswith("|"):
            noi_dung = noi_dung[:-1]
        return [lam_sach_o(o) for o in noi_dung.split("|")]

    cot_tieu_de = tach_dong_thanh_cot(dong_bang[0])

    # Dòng thứ 2 là dòng gạch phân cách kiểu |---|---|... — bỏ qua
    dong_du_lieu_tho = dong_bang[2:]

    danh_sach_dong = []
    for d in dong_du_lieu_tho:
        cac_o = tach_dong_thanh_cot(d)
        # Phòng trường hợp lệch số cột (hiếm) — bù ô trống hoặc cắt bớt cho khớp
        if len(cac_o) < len(cot_tieu_de):
            cac_o += [""] * (len(cot_tieu_de) - len(cac_o))
        elif len(cac_o) > len(cot_tieu_de):
            cac_o = cac_o[: len(cot_tieu_de)]
        danh_sach_dong.append(cac_o)

    return cot_tieu_de, danh_sach_dong


# --- định dạng dùng chung ----------------------------------------------------
MAU_NEN_TIEU_DE = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
CHU_TIEU_DE = Font(bold=True, color="FFFFFF", size=11)
CAN_LE_TIEU_DE = Alignment(horizontal="center", vertical="center", wrap_text=True)
CAN_LE_O_THUONG = Alignment(horizontal="left", vertical="top", wrap_text=True)


def ghi_mot_trang_tinh(workbook: Workbook, ten_trang: str, cot_tieu_de, danh_sach_dong, ngay_xuat: str,
                       nguon_ghi_chu: str = None):
    trang = workbook.create_sheet(title=ten_trang)

    # Dòng 1: ghi ngày xuất + nhắc không sửa tay (nguon_ghi_chu thay câu mặc định cho các trang đọc từ JSON)
    o_ghi_chu = trang.cell(
        row=1,
        column=1,
        value=nguon_ghi_chu or f"Ngày xuất: {ngay_xuat}  ·  File này sinh tự động từ tai_san\\so_tay_gu\\00_muc_luc.md — "
              "sửa ở đó rồi chạy lại scripts\\xuat_kho_phong_cach_excel.py, đừng sửa trên Excel.",
    )
    o_ghi_chu.font = Font(italic=True, size=9, color="666666")

    # Dòng 2: dòng tiêu đề cột
    DONG_TIEU_DE = 2
    for idx_cot, ten_cot in enumerate(cot_tieu_de, start=1):
        o = trang.cell(row=DONG_TIEU_DE, column=idx_cot, value=ten_cot)
        o.font = CHU_TIEU_DE
        o.fill = MAU_NEN_TIEU_DE
        o.alignment = CAN_LE_TIEU_DE

    # Dòng dữ liệu
    for idx_dong, mot_dong in enumerate(danh_sach_dong, start=DONG_TIEU_DE + 1):
        for idx_cot, gia_tri in enumerate(mot_dong, start=1):
            o = trang.cell(row=idx_dong, column=idx_cot, value=gia_tri)
            o.alignment = CAN_LE_O_THUONG

    # Cố định dòng tiêu đề và cột đầu (cột mã) khi cuộn — bảng rộng, không cố
    # định cột mã thì cuộn sang phải là không biết đang đọc phong cách nào
    trang.freeze_panes = trang.cell(row=DONG_TIEU_DE + 1, column=2).coordinate

    # Độ rộng cột: cột đầu (mã/tên) hẹp, các cột mô tả rộng vừa phải.
    # Vì đã bật xuống dòng trong ô (wrap_text) nên không cần cột quá rộng.
    so_cot = len(cot_tieu_de)
    for idx_cot in range(1, so_cot + 1):
        do_dai_lon_nhat = len(str(cot_tieu_de[idx_cot - 1]))
        for mot_dong in danh_sach_dong:
            gia_tri = mot_dong[idx_cot - 1] if idx_cot - 1 < len(mot_dong) else ""
            do_dai_dong_nay = max((len(p) for p in str(gia_tri).split("\n")), default=0)
            do_dai_lon_nhat = max(do_dai_lon_nhat, do_dai_dong_nay)
        do_rong = min(max(do_dai_lon_nhat + 2, 12), 55)
        trang.column_dimensions[get_column_letter(idx_cot)].width = do_rong

    # Chiều cao dòng: tiêu đề nhỉnh hơn; dòng dữ liệu để Excel tự giãn theo
    # nội dung (không đặt height thì Excel tự tính khi có wrap_text)
    trang.row_dimensions[DONG_TIEU_DE].height = 30

    return len(danh_sach_dong)


TEN_KHO = {"doc": "dọc 1080×1920", "ngang": "ngang 1920×1080"}
TEN_MUC_LM = {"san": "sẵn", "cong_cu": "công cụ", "chua": "chưa"}
TEN_TT_LM = {"co": "có", "mot_phan": "một phần (làm tay)", "chua": "chưa cài"}
RE_HEX = re.compile(r"^#[0-9A-Fa-f]{6}$")


def ten_trang_thai(v):
    """Ô trạng thái của chất liệu, bố cục: đã duyệt, nháp, hoặc — khi chưa ghi."""
    return {"duyet": "đã duyệt", "nhap": "nháp"}.get(v.get("trang_thai"), "—")


def to_mau_o_hex(o):
    """Ô chứa đúng một mã hex thì tô nền ô bằng màu đó, chữ đen hoặc trắng tuỳ độ sáng."""
    v = str(o.value or "")
    if RE_HEX.match(v):
        r, g, b = (int(v[i:i + 2], 16) for i in (1, 3, 5))
        o.fill = PatternFill(start_color=v[1:].upper(), end_color=v[1:].upper(), fill_type="solid")
        o.font = Font(color="000000" if 0.299 * r + 0.587 * g + 0.114 * b > 140 else "FFFFFF")


def doc_cac_trang_truc(truc: dict):
    """Từ he_truc_dung.json dựng danh sách (tên trang, cột, dòng, cột hex cần tô màu)."""
    cl = {c["ma"]: c for c in truc["chat_lieu"]}
    trang = []

    cot = ["Mã", "Tên", "Mô tả", "Khổ", "Mức chi tiết", "Nhịp, phụ đề", "Có mã dựng", "Chỗ mã dựng",
           "Cách làm (mức)", "Thời gian máy theo mức chi tiết", "Không hợp", "Hợp Media (0–3)", "Mẫu nguồn",
           "Thẻ D gốc hoặc gần nhất", "Trạng thái", "Hợp khi (chất liệu mới, chưa chấm điểm)", "Không hợp khi (chất liệu mới)"]
    dong = []
    for x in truc["chat_lieu"]:
        dong.append([x["ma"], x["ten"], x["mo_ta"], ", ".join(TEN_KHO[k] for k in x["kho"]), ", ".join(x["muc_chi_tiet"]),
                     x["nhip_phu_de"], "có" if x["ma_dung"] == "co" else "chưa", x["ma_dung_o"],
                     "; ".join("%s (%s)" % (e["ma"], TEN_MUC_LM[e["muc"]]) for e in x.get("cach_lam", [])),
                     "\n".join("%s: %s" % (k, v) for k, v in x["thoi_gian"].items()), x["khong_hop"],
                     x.get("hop_media", ""), ", ".join(x.get("mau_nguon", [])), ", ".join(x["d_nguon"]),
                     ten_trang_thai(x), x.get("goi_y_dung_khi", ""), x.get("khong_hop_khi", "")])
    trang.append(("Truc CL - chat lieu", cot, dong, []))

    cot = ["Mã", "Tên", "Mô tả"]
    dong = [[x["ma"], x["ten"], x["mo_ta"]] for x in truc["muc_chi_tiet"]]
    trang.append(("Truc CT - muc chi tiet", cot, dong, []))

    cot = ["Mã", "Tên", "Mô tả", "Khổ", "Đi với chất liệu", "Thẻ D gốc hoặc gần nhất", "Trạng thái", "Mẫu nguồn"]
    dong = [[x["ma"], x["ten"], x["mo_ta"], ", ".join(TEN_KHO[k] for k in x["kho"]),
             ", ".join("%s %s" % (c, cl[c]["ten"]) for c in x["chat_lieu"]), ", ".join(x["d_nguon"]),
             ten_trang_thai(x), ", ".join(x.get("mau_nguon", []))] for x in truc["bo_cuc"]]
    trang.append(("Truc BC - bo cuc", cot, dong, []))

    cot = ["Mã", "Tên", "Nền", "Mô tả", "Hex nền", "Hex chữ", "Hex nhấn 1", "Hex nhấn 2", "Hex phụ 1", "Hex phụ 2", "Hex phụ 3",
           "Đi với chất liệu", "Lĩnh vực", "Nhóm nhạc hợp", "Nhóm nhạc tránh", "Trạng thái", "Mẫu nguồn", "Cách đo"]
    dong = []
    for x in truc["mau"]:
        hx = x.get("hex") or {}
        nhan, phu = (hx.get("nhan") or []) + [""] * 2, (hx.get("phu") or []) + [""] * 3
        dong.append([x["ma"], x["ten"], "tối" if x["nen"] == "toi" else "sáng", x["mo_ta"], hx.get("nen", ""), hx.get("chu", ""),
                     nhan[0], nhan[1], phu[0], phu[1], phu[2], ", ".join(x["chat_lieu"]),
                     ", ".join(truc["linh_vuc"][v] for v in x.get("linh_vuc", [])),
                     ", ".join(truc["nhom_nhac"][g] for g in x["nhom_nhac_hop"]),
                     ", ".join(truc["nhom_nhac"][g] for g in x["nhom_nhac_tranh"]),
                     "đã duyệt" if x["trang_thai"] == "duyet" else "nháp", x.get("mau_nguon", ""), x.get("do_tu", "")])
    trang.append(("Truc MAU - mau", cot, dong, [4, 5, 6, 7, 8, 9, 10]))

    cot = ["Mã", "Tên", "Chỗ", "Trạng thái", "Khổ làm được", "Khổ đã chạy thật", "Giây máy mỗi giây video (nhỏ)",
           "Giây máy mỗi giây video (lớn)", "Đơn vị", "Thời gian máy", "Chi phí dựng mới", "Ghi chú", "Nguồn số đo",
           "Chất liệu làm được (mức)"]
    dong = []
    for x in truc["cach_lam"]:
        t = x["thoi_gian_may"]
        lam_duoc = [c["ma"] + " (" + TEN_MUC_LM[e["muc"]] + ")" for c in truc["chat_lieu"] for e in c.get("cach_lam", []) if e["ma"] == x["ma"]]
        dong.append([x["ma"], x["ten"], x["cho"], TEN_TT_LM[x["trang_thai"]], ", ".join(TEN_KHO[k] for k in x["kho"]),
                     ", ".join(TEN_KHO[k] for k in x["kho_da_chay"]) or "chưa", "" if t.get("min") is None else t["min"],
                     "" if t.get("max") is None else t["max"], t["don_vi"] + (" (ước)" if t.get("uoc") else ""), t["ghi"],
                     x["chi_phi_dung_moi"], x["ghi_chu"], t["nguon"], "; ".join(lam_duoc)])
    trang.append(("Cach lam LM", cot, dong, []))
    return trang


def ghi_trang_huong_dan(workbook: Workbook, ngay_xuat: str, so_kich_ban: int, so_dung: int, ten_trang_truc=None):
    """Trang đầu tiên: giải thích kho này là gì, đọc thế nào. Viết cho người
    không làm nghề media đọc — đây là lý do file Excel tồn tại."""
    trang = workbook.create_sheet(title="Cach doc", index=0)

    CHU_TIEU_DE_LON = Font(bold=True, size=14, color="1F4E78")
    CHU_MUC = Font(bold=True, size=11, color="1F4E78")
    CAN_LE_DOAN = Alignment(horizontal="left", vertical="top", wrap_text=True)

    noi_dung = [
        ("tieu_de", "KHO PHONG CÁCH — xưởng media của Thành Trung Nguyễn"),
        ("thuong", f"Ngày xuất: {ngay_xuat}. Kho hiện có {so_kich_ban} phong cách viết kịch bản "
                   f"và {so_dung} phong cách dựng video."),
        ("trong", ""),
        ("muc", "Kho này để làm gì"),
        ("thuong", "Mỗi lần làm một video, có hai chỗ anh được chọn thay vì để Claude tự quyết: "
                   "chọn LỐI VIẾT trước khi viết chữ nào, và chọn TÔNG DỰNG sau khi chữ đã chốt. "
                   "Kho này là danh sách các lựa chọn có sẵn ở hai chỗ đó."),
        ("trong", ""),
        ("muc", "Bốn trang trong file này"),
        ("thuong", "A - Phong cach kich ban  →  các lối VIẾT: mở đầu bằng gì, bảy cảnh đi theo "
                   "đường nào, giọng văn ra sao. Mã dạng KB-01, KB-02..."),
        ("thuong", "B - Phong cach dung  →  các tông DỰNG: màu, kiểu chữ, nhịp cắt, cách chữ "
                   "chạy, âm thanh. Mã dạng D-01, D-02..."),
        ("thuong", "Bang ket hop  →  lối viết nào ghép được với tông dựng nào, ghép thì phải "
                   "chỉnh gì. Bốn mức: Rất hợp / Hợp / Cân nhắc / Không nên."),
        ("thuong", "Cach doc  →  chính là trang anh đang đọc."),
        ("trong", ""),
        ("muc", "Đọc theo thứ tự nào"),
        ("thuong", "1. Xem trang A, đọc cột 'Nói ngắn gọn là gì' của từng dòng — đó là câu tóm "
                   "tắt một dòng, đọc hết 3 dòng mất chưa tới một phút."),
        ("thuong", "2. Đọc tiếp cột 'KHÔNG hợp với' — cột này quan trọng ngang cột 'Hợp với'. "
                   "Loại trừ thường nhanh hơn chọn."),
        ("thuong", "3. Chốt được lối viết rồi thì sang trang 'Bang ket hop', dóng hàng của lối "
                   "đó sang cột của tông dựng để biết cặp ấy ghép được tới đâu."),
        ("thuong", "4. Muốn biết kỹ một phong cách thì mở file thẻ chi tiết — tên file ghi ở "
                   "cột cuối cùng, nằm trong thư mục tai_san\\so_tay_gu\\."),
        ("trong", ""),
    ] + ([
        ("muc", "Các trang tiếp theo: hệ trục dựng (từ 27/10/2026)"),
        ("thuong", "Từ video mở việc ngày 27/10/2026, cách dựng không chọn một mã D gộp mà chọn một tổ hợp năm trục: chất liệu hình (CL), mức chi tiết (CT), "
                   "bố cục khung hình (BC), tông màu (MAU) và nhạc (NH, Claude tự chọn). Các trang: " + "; ".join(ten_trang_truc) + "."),
        ("thuong", "Trang 'Cach lam LM' liệt kê bảy cách làm ra hình (Remotion, HTML một trang, HyperFrames, Blender...) kèm thời gian máy đã đo; "
                   "cột 'Cách làm (mức)' ở trang chất liệu cho biết chất liệu nào làm được bằng cách nào: sẵn = đã có mã dựng cho đúng chất liệu, "
                   "công cụ = mới có công cụ chung, chưa = chưa có cả công cụ. Ô màu ở trang 'Truc MAU' tô đúng mã hex đo từ khung hình mẫu. "
                   "Giá trị ghi nháp là giá trị học từ repo mẫu ngày 27/10/2026, chưa dựng thật và chưa chấm điểm: Claude đánh giá theo nội dung từng video, đọc cột 'Hợp khi' và 'Không hợp khi'. "
                   "Bản gốc của các trang này là file he_truc_dung.json, không phải Excel."),
        ("trong", ""),
    ] if ten_trang_truc else []) + [
        ("muc", "Ba điều cần biết trước khi dùng"),
        ("thuong", "· Cột 'Trạng thái' cho biết thẻ đã được anh duyệt chưa. Thẻ 'nháp' vẫn dùng "
                   "được nhưng chưa qua tay anh lần nào."),
        ("thuong", "· Kho còn mỏng và cố ý mỏng — anh đã chọn làm giàu dần. Mục 'Kho đang thiếu "
                   "gì' ở cuối file 00_muc_luc.md liệt kê ba chỗ trống đáng bù trước."),
        ("thuong", "· FILE EXCEL NÀY KHÔNG PHẢI BẢN GỐC. Bản gốc là file chữ "
                   "tai_san\\so_tay_gu\\00_muc_luc.md. Sửa trên Excel thì lần xuất sau sẽ mất."),
    ]

    dong_hien_tai = 1
    for kieu, chu in noi_dung:
        if kieu == "trong":
            dong_hien_tai += 1
            continue
        o = trang.cell(row=dong_hien_tai, column=1, value=chu)
        o.alignment = CAN_LE_DOAN
        if kieu == "tieu_de":
            o.font = CHU_TIEU_DE_LON
        elif kieu == "muc":
            o.font = CHU_MUC
        dong_hien_tai += 1

    trang.column_dimensions["A"].width = 110
    return dong_hien_tai


def main():
    ap = argparse.ArgumentParser(description="Xuất kho phong cách (3 bảng markdown + hệ trục dựng) ra Excel")
    ap.add_argument("--ra", help="Đường dẫn file .xlsx đầu ra (mặc định ghi đè tai_san/kho_phong_cach.xlsx)")
    ap.add_argument("--bo-qua-truc", action="store_true", help="Không thêm các trang hệ trục dựng (chỉ ba bảng cũ)")
    args = ap.parse_args()
    file_dich = Path(args.ra).expanduser().resolve() if args.ra else FILE_DICH_XLSX

    if not FILE_NGUON_MD.exists():
        print(f"LỖI: không tìm thấy file nguồn markdown: {FILE_NGUON_MD}")
        sys.exit(1)

    noi_dung_md = FILE_NGUON_MD.read_text(encoding="utf-8")
    ngay_xuat = datetime.now().strftime("%Y-%m-%d %H:%M")

    workbook = Workbook()
    workbook.remove(workbook.active)  # xóa trang mặc định rỗng do openpyxl tạo

    so_dong_theo_bang = {}
    for tieu_de_md, ten_trang in CAC_BANG:
        cot, dong = doc_bang_markdown_theo_tieu_de(noi_dung_md, tieu_de_md)
        so_dong_theo_bang[ten_trang] = ghi_mot_trang_tinh(workbook, ten_trang, cot, dong, ngay_xuat)

    # Các trang hệ trục dựng đọc từ he_truc_dung.json (nếu có file và không tắt)
    so_dong_truc = {}
    if not args.bo_qua_truc and FILE_TRUC_JSON.exists():
        truc = json.loads(FILE_TRUC_JSON.read_text(encoding="utf-8"))
        ghi_chu_truc = (f"Ngày xuất: {ngay_xuat}  ·  Trang này sinh tự động từ tai_san/so_tay_gu/he_truc_dung.json "
                        f"(phiên bản {truc['phien_ban']}) — sửa ở đó rồi chạy lại scripts/xuat_kho_phong_cach_excel.py, đừng sửa trên Excel.")
        for ten_trang, cot, dong, cot_hex in doc_cac_trang_truc(truc):
            so_dong_truc[ten_trang] = ghi_mot_trang_tinh(workbook, ten_trang, cot, dong, ngay_xuat, nguon_ghi_chu=ghi_chu_truc)
            for idx_cot in cot_hex:  # tô nền ô theo mã hex
                for r in range(3, 3 + len(dong)):
                    to_mau_o_hex(workbook[ten_trang].cell(row=r, column=idx_cot + 1))

    # Trang hướng dẫn ghi sau cùng nhưng chèn lên vị trí đầu (index=0), vì cần
    # biết số lượng phong cách của hai bảng kia để ghi vào phần giới thiệu
    ghi_trang_huong_dan(
        workbook,
        ngay_xuat,
        so_dong_theo_bang["A - Phong cach kich ban"],
        so_dong_theo_bang["B - Phong cach dung"],
        list(so_dong_truc) or None,
    )

    file_dich.parent.mkdir(parents=True, exist_ok=True)
    workbook.save(file_dich)

    print("Đã xuất file Excel thành công:", file_dich)
    for ten_trang, so_dong in {**so_dong_theo_bang, **so_dong_truc}.items():
        print(f"- Trang '{ten_trang}': {so_dong} dòng dữ liệu")
    print("- Trang 'Cach doc': hướng dẫn đọc cho Trung")


if __name__ == "__main__":
    main()
