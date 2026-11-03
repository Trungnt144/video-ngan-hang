# -*- coding: utf-8 -*-
"""Đổi tên thư mục sản phẩm của video đã lên kênh thành "yyyy.mm.dd.<tiêu đề YouTube>" (Trung chốt 30/10/2026).

Mỗi thư mục, theo thứ tự:
1. Đổi tên file video bằng doi_ten_file.py (file thành "<tiêu đề>.mp4").
2. Bản xem nhanh của bảng video (du_lieu/bang_video/xem_nhanh/<thư mục>.json, .mp4): đổi tên theo thư mục mới,
   sửa trường "nguon" sang tên file mới, để bảng video không mã hoá lại.
3. git mv thư mục (phần ngoài git đi theo).
4. Sửa tham chiếu tên thư mục cũ và tên file video cũ trong mọi file chữ của Media (bỏ qua .git, node_modules,
   _luu_tru, xuong_thu_hyperframes, các bảng đối chiếu _bang_*.tsv, sổ lệnh của bảng video do máy chủ giữ trong bộ nhớ).
   Tên thư mục cũ chỉ thay khi đứng riêng hoặc trước "/", không thay khi là đầu tên file khác (…_v1.md, ….tien_do.md).
5. Ghi bảng đối chiếu san_pham/_bang_doi_ten_thu_muc_2026.10.30.tsv.
6. Video đã lưu trữ Drive (có du_lieu/luu_tru_drive/<thư mục cũ>.json; thêm 01/11/2026 sau khi 32 video điện
   lưu trữ từ 29/10 bị sót đổi tên): đổi tên thư mục Drive và thư mục con san_pham/<cũ> bên trong bằng rclone moveto,
   git mv file kê khai, chép kê khai mới lên Drive (_ke_khai.json), cuối lượt sinh lại MUC_LUC.md (luu_tru.py lam-moi).
   Bước 4 đã đổi tên thư mục bên trong kê khai (trường ten, drive, đường dẫn file).

Chạy từ gốc Media: python3 -I skills/viet-chu-dang-video/scripts/doi_ten_thu_muc.py <thư mục>... [--chay-that]
"""
import json
import os
import re
import subprocess
import sys
import time
import unicodedata
from pathlib import Path

CHAY = "--chay-that" in sys.argv
DS = [a.rstrip("/").split("/")[-1] for a in sys.argv[1:] if not a.startswith("--")]
BANG = Path("san_pham/_bang_doi_ten_thu_muc_2026.10.30.tsv")
LUU_TRU = Path("du_lieu/luu_tru_drive")
DRIVE = "drive_ai:Media/luu_tru_video"
XEM_NHANH = Path("du_lieu/bang_video/xem_nhanh")
DOI_TEN_FILE = Path(__file__).resolve().parent / "doi_ten_file.py"
MAU_NGAY = re.compile(r"^(\d{4}\.\d{2}\.\d{2})\.(.+)$")
BO_THU_MUC = {".git", "node_modules", "_luu_tru", "xuong_thu_hyperframes", "xem_nhanh", "__pycache__"}
BO_FILE = {"du_lieu/bang_video/so_lenh.json"}
DUOI_CHU = {".md", ".json", ".jsonl", ".txt", ".tsv", ".py", ".mjs", ".js", ".ts", ".tsx", ".html", ".bak", ".sh", ".csv", ".yaml", ".yml"}


def ten_an_toan(t):  # giống doi_ten_file.py
    t = unicodedata.normalize("NFC", t).replace(":", " -").replace("/", "-")
    return re.sub(r"\s+", " ", t).strip().rstrip(".")


def tieu_de(tm):
    yt = (Path("san_pham") / tm / "tai_nguyen/dang_bai/youtube.md").read_text(encoding="utf-8")
    return re.search(r"#### youtube_dai · tieu_de\n\n```text\n(.+?)\n```", yt, re.S).group(1).strip()


def file_chu():
    for goc, cac_tm, cac_file in os.walk("."):
        # .claude/worktrees/ là bản checkout riêng của phiên khác, thư mục ở đó còn tên cũ (sửa nhầm 01/11/2026)
        cac_tm[:] = [d for d in cac_tm if d not in BO_THU_MUC and not (goc == "./.claude" and d == "worktrees")]
        for f in cac_file:
            p = Path(goc, f)  # Path bỏ tiền tố "./": dạng san_pham/<thư mục>/…
            rel = str(p)
            if p.suffix.lower() in DUOI_CHU and rel not in BO_FILE and not f.startswith("_bang_") and p.stat().st_size < 50_000_000:
                yield p


cap = []  # (cũ, mới)
for tm in DS:
    m = MAU_NGAY.match(tm)
    assert m and (Path("san_pham") / tm).is_dir(), tm
    moi = m.group(1) + "." + ten_an_toan(tieu_de(tm))
    assert "/" not in moi and "\\" not in moi and not (Path("san_pham") / moi).exists(), moi
    if moi != tm:
        cap.append((tm, moi))
for cu, moi in cap:
    print(f"{cu}  →  {moi}")
if not CHAY:
    print(f"\nChạy thử: {len(cap)} thư mục. Thêm --chay-that để đổi.")
    sys.exit(0)

def git_mv(a, b):
    # thử lại khi phiên khác đang giữ khoá chỉ mục git (.git/index.lock), lỗi 128 gặp 01/11/2026
    for lan in range(6):
        if subprocess.run(["git", "mv", str(a), str(b)]).returncode == 0:
            return
        time.sleep(5)
    sys.exit(f"DỪNG: git mv {a} → {b} lỗi sau 6 lần thử")


co_luu_tru = False
tat_ca_file = list(file_chu())
moi_bang = not BANG.exists()
for cu, moi in cap:
    # 1. tên file video
    kq = subprocess.run([sys.executable, "-I", str(DOI_TEN_FILE), cu, "--chay-that"], capture_output=True, text=True)
    if kq.returncode:
        sys.exit(f"DỪNG ở {cu}: doi_ten_file.py lỗi\n{kq.stdout}{kq.stderr}")
    doi_file = re.findall(r"^" + re.escape(cu) + r": (.+?)  →  (.+)$", kq.stdout, re.M)
    # 2. xem nhanh
    meta = XEM_NHANH / (cu + ".json")
    if meta.exists():
        d = json.loads(meta.read_text(encoding="utf-8"))
        for a, b in doi_file:
            if d.get("nguon") == a:
                d["nguon"] = b
        (XEM_NHANH / (moi + ".json")).write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
        meta.unlink()
        if (XEM_NHANH / (cu + ".mp4")).exists():
            os.rename(XEM_NHANH / (cu + ".mp4"), XEM_NHANH / (moi + ".mp4"))
    # 3. thư mục
    git_mv(f"san_pham/{cu}", f"san_pham/{moi}")
    # 4. tham chiếu
    mau = re.compile(re.escape(cu) + r"(?![\w-])(?!\.\w)")
    da_sua = []
    for p in tat_ca_file:
        if str(p).startswith(f"san_pham/{cu}/"):
            p = Path(f"san_pham/{moi}") / p.relative_to(f"san_pham/{cu}")
        try:
            s = p.read_text(encoding="utf-8")
        except (UnicodeDecodeError, FileNotFoundError):
            continue
        if cu not in s and not any(a in s for a, _ in doi_file):
            continue
        s2 = mau.sub(lambda _: moi, s)
        for a, b in doi_file:
            s2 = s2.replace(a, b)
        if s2 != s:
            p.write_text(s2, encoding="utf-8")
            da_sua.append(str(p))
    tat_ca_file = [Path(f"san_pham/{moi}") / p.relative_to(f"san_pham/{cu}") if str(p).startswith(f"san_pham/{cu}/") else p
                   for p in tat_ca_file]
    # 5. bảng đối chiếu
    with BANG.open("a", encoding="utf-8") as f:
        if moi_bang:
            f.write("thu_muc_cu\tthu_muc_moi\tfile_video_cu\tfile_video_moi\n")
            moi_bang = False
        for a, b in doi_file or [("", "")]:
            f.write(f"{cu}\t{moi}\t{a}\t{b}\n")
    # 6. bản lưu trữ Drive
    kk = LUU_TRU / (cu + ".json")
    luu = kk.exists()
    if luu:
        for a, b in [(f"{DRIVE}/{cu}", f"{DRIVE}/{moi}"), (f"{DRIVE}/{moi}/san_pham/{cu}", f"{DRIVE}/{moi}/san_pham/{moi}")]:
            subprocess.run(["rclone", "moveto", a, b], check=True)
        git_mv(kk, LUU_TRU / (moi + ".json"))
        subprocess.run(["rclone", "copyto", str(LUU_TRU / (moi + ".json")), f"{DRIVE}/{moi}/_ke_khai.json"], check=True)
        co_luu_tru = True
    print(f"XONG {cu} → {moi} · {len(doi_file)} file video · sửa {len(da_sua)} file"
          + (" · đã đổi tên bản lưu trữ Drive" if luu else "")
          + f": {', '.join(da_sua)}")
if co_luu_tru:
    subprocess.run([sys.executable, "-I", str(Path(__file__).resolve().parents[2] / "luu-tru-drive/scripts/luu_tru.py"), "lam-moi"], check=True)
