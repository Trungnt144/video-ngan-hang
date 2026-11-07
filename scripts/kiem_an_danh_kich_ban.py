#!/usr/bin/env python3
"""Kiểm ẩn danh kịch bản lô video KCN (N206–N221): không còn từ cấm của hồ sơ nội bộ RM MB.

Chạy: python3 -I scripts/kiem_an_danh_kich_ban.py <file hoặc thư mục> [...]
  Không truyền gì thì quét mọi file .md, .json, .html trong san_pham/2026.11.03.*/tai_nguyen/kich_ban/
  và san_pham/2026.11.03.kich_ban_16_video_tham_dinh_kcn/.
Danh sách từ cấm: mọi file `_noi_bo_tu_cam*.md` trong RM MB/research/2026-10-28_bds-khu-cong-nghiep/
(ngoài git, KHÔNG chép vào Media). Cách đọc danh sách giống script/kiem_an_danh.py của cẩm nang:
một từ mỗi dòng; các dòng sau tiêu đề có chữ "tên tỉnh" là tên tỉnh.
Hai phép kiểm:
1. Từ cấm (tên dự án, chủ đầu tư, mã số thuế, huyện, xã): số lần xuất hiện phải bằng 0.
2. Tên tỉnh của hồ sơ nội bộ không được nằm cùng đoạn với nhãn "Dự án A, B…".
Kết quả chỉ in từ đã che (hai chữ đầu và độ dài) để từ cấm không lọt vào nhật ký phiên.
Mã thoát 1 nếu còn vi phạm, 2 nếu không đọc được danh sách từ cấm.
"""
import re
import sys
from pathlib import Path

MEDIA = Path(__file__).resolve().parent.parent
NGHIEN_CUU = MEDIA.parent / "RM MB" / "research" / "2026-10-28_bds-khu-cong-nghiep"
NHAN = re.compile(r"Dự án [A-Z]\b")
DUOI = {".md", ".json", ".html", ".txt"}


def doc_tu_cam():
    tu, tinh = set(), set()
    files = sorted(NGHIEN_CUU.glob("_noi_bo_tu_cam*.md"))
    for f in files:
        dang_tinh = False
        for dong in f.read_text(encoding="utf-8").splitlines():
            if dong.lstrip().startswith("#"):
                dang_tinh = bool(re.search(r"tên tỉnh", dong, re.I))
                continue
            chu = re.sub(r"^[\s\-*\d.]+", "", dong).strip().strip("`").strip()
            chu = re.split(r"\s+[—(]", chu)[0].strip()
            if len(chu) < 3:
                continue
            (tinh if dang_tinh else tu).add(chu)
    return files, tu, tinh


def che(t):
    return f"{t[:2]}…({len(t)} ký tự)"


def nguon_quet(doi_so):
    if doi_so:
        goc = [Path(a) for a in doi_so]
    else:
        goc = sorted(MEDIA.glob("san_pham/2026.11.03.*/tai_nguyen/kich_ban"))
        goc += sorted(MEDIA.glob("san_pham/2026.11.03.kich_ban_16_video_tham_dinh_kcn"))
    for g in goc:
        cac_file = [g] if g.is_file() else sorted(p for p in g.rglob("*") if p.is_file() and p.suffix in DUOI)
        for f in cac_file:
            yield f, f.read_text(encoding="utf-8", errors="ignore")


def main():
    files, tu, tinh = doc_tu_cam()
    if not tu:
        print(f"Không đọc được danh sách từ cấm ở {NGHIEN_CUU}")
        sys.exit(2)
    # So khớp đúng dấu, không phân biệt hoa thường (danh sách đã có cả dạng có dấu và không dấu)
    mau_tu = [(t, re.compile(r"(?<!\w)" + re.escape(t) + r"(?!\w)", re.I)) for t in tu]
    mau_tinh = [(t, re.compile(r"(?<!\w)" + re.escape(t) + r"(?!\w)", re.I)) for t in tinh]
    loi, so_file = 0, 0
    for f, nd in nguon_quet(sys.argv[1:]):
        so_file += 1
        ten = f.relative_to(MEDIA) if f.is_relative_to(MEDIA) else f
        for t, m in mau_tu:
            for kq in m.finditer(nd):
                loi += 1
                dong = nd.count("\n", 0, kq.start()) + 1
                print(f"TỪ CẤM  {ten}:{dong}  {che(t)}")
        for doan in re.split(r"\n\s*\n|</p>|</li>|</tr>", nd):
            nhan = NHAN.search(doan)
            if nhan:
                for t, m in mau_tinh:
                    if m.search(doan):
                        loi += 1
                        print(f"TỈNH GẦN NHÃN  {ten}: {che(t)} cùng đoạn với {nhan.group(0)}")
    print(f"Danh sách: {len(files)} file, {len(tu)} từ cấm, {len(tinh)} tên tỉnh. Đã quét {so_file} file. Vi phạm: {loi}")
    sys.exit(1 if loi else 0)


if __name__ == "__main__":
    main()
