# -*- coding: utf-8 -*-
"""Đổi tên file video ngoài cùng thư mục sản phẩm theo tiêu đề trên YouTube (Trung chốt 29/10/2026).
Bản YouTube: "<tiêu đề>.mp4"; bản Facebook (liên kết cứng): "<tiêu đề> (Facebook).mp4".
Sửa tham chiếu đang dùng: nguon_goc.md, dang_bai/*.md, kich_ban/*.md của video; du_lieu/dang_youtube/lo_*.json, so_trang_thai.jsonl.
Ghi bảng đối chiếu san_pham/_bang_doi_ten_theo_kenh_2026.10.29.tsv. Chạy từ gốc Media: python3 -I doi_ten_file.py <thư mục>... [--chay-that]"""
import os, re, sys, unicodedata
from pathlib import Path

CHAY = "--chay-that" in sys.argv
DS = [a for a in sys.argv[1:] if not a.startswith("--")]
BANG = Path("san_pham/_bang_doi_ten_theo_kenh_2026.10.29.tsv")
MAU_FB = re.compile(r"_(facebook|reels)\d*_v\d+|\((facebook|reels)\d*\)$", re.I)


def ten_an_toan(t):
    t = unicodedata.normalize("NFC", t).replace(":", " -").replace("/", "-")
    return re.sub(r"\s+", " ", t).strip().rstrip(".")


doi = []  # (thư mục, tên cũ, tên mới)
for tm in DS:
    d = Path("san_pham") / tm
    yt = (d / "tai_nguyen/dang_bai/youtube.md").read_text(encoding="utf-8")
    tieu_de = re.search(r"#### youtube_dai · tieu_de\n\n```text\n(.+?)\n```", yt, re.S).group(1).strip()
    goc = ten_an_toan(tieu_de)
    mp4 = sorted(p for p in d.iterdir() if p.is_file() and p.suffix.lower() == ".mp4")
    for p in mp4:
        moi = goc + (" (Facebook)" if MAU_FB.search(p.stem) else "") + ".mp4"
        if p.name != moi:
            doi.append((tm, p.name, moi))
    ten_moi = [m for t, _, m in doi if t == tm]
    assert len(ten_moi) == len(set(ten_moi)), (tm, ten_moi)

for tm, cu, moi in doi:
    print(f"{tm}: {cu}  →  {moi}")
if not CHAY:
    print(f"\nChạy thử: {len(doi)} file. Thêm --chay-that để đổi.")
    sys.exit(0)

# 1. đổi tên file (liên kết cứng vẫn giữ: đổi tên không đổi inode)
for tm, cu, moi in doi:
    a, b = Path("san_pham") / tm / cu, Path("san_pham") / tm / moi
    assert not b.exists(), b
    os.rename(a, b)

# 2. sửa tham chiếu
def thay(p, cap):
    s = p.read_text(encoding="utf-8")
    s2 = s
    for cu, moi in cap:
        s2 = s2.replace(cu, moi)
    if s2 != s:
        p.write_text(s2, encoding="utf-8")
        return 1
    return 0

so_file = 0
for tm in DS:
    cap = [(c, m) for t, c, m in doi if t == tm]
    g = Path("san_pham") / tm / "tai_nguyen"
    for p in [g / "nguon_goc.md", *sorted((g / "dang_bai").glob("*.md")), *sorted((g / "kich_ban").glob("*.md"))]:
        if p.exists():
            so_file += thay(p, cap)
cap_tat_ca = [(f"{t}/{c}", f"{t}/{m}") for t, c, m in doi]
for p in [*sorted(Path("du_lieu/dang_youtube").glob("lo_*.json")), Path("du_lieu/dang_youtube/so_trang_thai.jsonl")]:
    so_file += thay(p, cap_tat_ca)

# 3. bảng đối chiếu
moi_bang = not BANG.exists()
with BANG.open("a", encoding="utf-8") as f:
    if moi_bang:
        f.write("thu_muc\tten_cu\tten_moi\n")
    for tm, cu, moi in doi:
        f.write(f"{tm}\t{cu}\t{moi}\n")
print(f"\nĐã đổi {len(doi)} file, sửa tham chiếu trong {so_file} file, ghi {BANG}.")
