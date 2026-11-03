#!/usr/bin/env python3
"""Thêm (hoặc sửa) dòng "Xem cả loạt: <đường dẫn danh sách phát>" vào ô youtube_dai · mo_ta của youtube.md.

Danh sách lấy từ du_lieu/dang_youtube/danh_sach_phat_<kênh>.json (Trung chốt 02/11/2026): danh sách loại
"nghiep_vu" chứa mã video, đã có playlistId (do skills/dang-youtube/scripts/danh_sach_phat.py ghi khi tạo).
Dòng đặt ngay trên dòng hashtag, sau mốc chương và khối "Xem tiếp:", cách một dòng trống. Đã có dòng đúng thì bỏ qua.

Chạy từ gốc Media:
  python3 -I skills/viet-chu-dang-video/scripts/them_xem_ca_loat.py <thư mục video>... [--ghi]
  python3 -I skills/viet-chu-dang-video/scripts/them_xem_ca_loat.py --kenh ngan_hang [--ghi]   (mọi video đã lên kênh có trong file cấu hình)
Mặc định chỉ in việc sẽ làm. Sau khi ghi: kiem_chu_dang.py, rồi xuat_ke_khai.py ... --ghi và cap_nhat_youtube.py để đẩy mô tả lên kênh.
"""
import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chung  # noqa: E402

MAU_HASHTAG = re.compile(r"^\s*(#\S+\s*)+$")
MAU_DONG = re.compile(r"^Xem cả loạt:.*$", re.M)


def sua_mo_ta(mo_ta, url):
    dong = "Xem cả loạt: " + url
    if MAU_DONG.search(mo_ta):
        return MAU_DONG.sub(dong, mo_ta, count=1)
    dong_cu = mo_ta.split("\n")
    vi_tri = next((i for i, d in enumerate(dong_cu) if MAU_HASHTAG.match(d)), None)
    if vi_tri is None:
        raise ValueError("không thấy dòng hashtag trong mô tả")
    return "\n".join(dong_cu[:vi_tri] + [dong, ""] + dong_cu[vi_tri:])


def xu_ly(youtube_md, ghi):
    ds = chung.doc_chu_dang(youtube_md)
    tt = ds["thong_tin"]
    kenh = chung.kenh_video(tt, ds["thu_muc"])
    _, nghiep_vu = chung.danh_sach_phat(tt.get("ma_youtube"), kenh)
    ten = chung.tuong_doi(ds["thu_muc"])
    if not nghiep_vu:
        return "BỎ QUA %s: chưa có trong danh sách nghiệp vụ nào" % ten
    if not nghiep_vu.get("playlistId"):
        return "CHỜ    %s: danh sách \"%s\" chưa tạo trên kênh" % (ten, nghiep_vu["tieu_de"])
    url = "https://www.youtube.com/playlist?list=" + nghiep_vu["playlistId"]
    f = ds["dang_bai"] / "youtube.md"
    chu = f.read_text(encoding="utf-8")
    o = next((m for m in chung.MAU_O.finditer(chu) if (m.group(1), m.group(2)) == ("youtube_dai", "mo_ta")), None)
    if not o:
        return "BỎ QUA %s: không có ô youtube_dai · mo_ta" % ten
    moi = sua_mo_ta(o.group(4), url)
    if moi == o.group(4):
        return "ĐÃ CÓ  %s" % ten
    if ghi:
        f.write_text(chu[:o.start(4)] + moi + chu[o.end(4):], encoding="utf-8")
    return "%s %s → %s" % ("ĐÃ GHI" if ghi else "SẼ GHI", ten, nghiep_vu["tieu_de"])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("thu_muc", nargs="*")
    ap.add_argument("--kenh", help="lấy mọi video của kênh có trong file cấu hình danh sách phát, ví dụ ngan_hang")
    ap.add_argument("--ghi", action="store_true")
    a = ap.parse_args()
    files = [chung.tuyet_doi(t) for t in a.thu_muc]
    if a.kenh:
        for f in sorted((chung.GOC_MEDIA / "san_pham").glob("*/tai_nguyen/dang_bai/youtube.md")):
            tt = chung.doc_chu_dang(f)["thong_tin"]
            # chỉ video đã lên kênh: thư mục bản nháp có thể đang do phiên khác sửa
            if (chung.kenh_video(tt, f.parents[2]) == a.kenh and chung.ma_da_tai(tt.get("ma_youtube"))
                    and chung.danh_sach_phat(tt.get("ma_youtube"), a.kenh)[0]):
                files.append(f)
    if not files:
        raise SystemExit("chưa chọn thư mục video nào")
    for f in files:
        print(xu_ly(f, a.ghi))


if __name__ == "__main__":
    main()
