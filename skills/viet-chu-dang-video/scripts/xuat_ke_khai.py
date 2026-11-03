#!/usr/bin/env python3
"""Chuyển chữ đăng YouTube video dài (tai_nguyen/dang_bai/youtube.md) của một hay nhiều video sang file mà skill dang-youtube dùng.

Video chưa lên kênh  → thêm vào file kê khai lô  du_lieu/dang_youtube/lo_<yyyy.mm.dd>_<tên>.json (chay_lo.py đọc).
Video đã lên kênh    → thêm vào file cập nhật    du_lieu/dang_youtube/cap_nhat_<yyyy.mm.dd>_<tên>.json (cap_nhat_youtube.py đọc).
"Đã lên kênh" tra theo thong_tin.ma_youtube trong du_lieu/dang_youtube/so_trang_thai.jsonl.

Chạy từ gốc Media:
  python3 -I skills/viet-chu-dang-video/scripts/xuat_ke_khai.py <thư mục video>... --ten <tên lô> [--ghi]
Mặc định chỉ in kết quả; thêm --ghi mới ghi file. Video có chữ đăng còn lỗi bảng kiểm thì bị bỏ qua.
"""
import argparse
import datetime as dt
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chung  # noqa: E402
import kiem_chu_dang  # noqa: E402

THU_MUC_DANG = chung.GOC_MEDIA / "du_lieu" / "dang_youtube"
MAC_DINH = {"categoryId": "28", "language": "vi", "privacyStatus": "private", "notify": False}


def tim_thumbnail(thu_muc, thong_tin):
    if thong_tin.get("thumbnail"):
        return thong_tin["thumbnail"]
    anh = [p for p in Path(thu_muc).iterdir() if p.suffix.lower() in (".jpg", ".jpeg", ".png") and "hinh_thu_nho" in p.stem]
    return chung.tuong_doi(sorted(anh)[-1]) if anh else ""


def chuyen(duong_dan):
    kq = kiem_chu_dang.kiem(duong_dan)
    if kq["loi"]:
        return None, "còn %d lỗi bảng kiểm, chạy kiem_chu_dang.py rồi sửa" % len(kq["loi"])
    ds = chung.doc_chu_dang(duong_dan)
    o, tt, thu_muc = ds["o"], ds["thong_tin"], ds["thu_muc"]
    if ("youtube_dai", "tieu_de") not in o:
        return None, "không có tai_nguyen/dang_bai/youtube.md"
    for khoa in ("ma_youtube", "madeForKids", "containsSyntheticMedia"):
        if khoa not in tt:
            return None, "thong_tin thiếu %s" % khoa
    muc = {
        "ma": tt["ma_youtube"],
        "title": o[("youtube_dai", "tieu_de")].strip(),
        "description": o.get(("youtube_dai", "mo_ta"), "").strip(),
        "tags": chung.tach_the(o.get(("youtube_dai", "the"), "")),
        "_nguon": chung.tuong_doi(ds["dang_bai"] / "youtube.md"),
    }
    video_id = chung.ma_da_tai(tt["ma_youtube"])
    if video_id:
        # Kênh Ngân hàng dùng danh mục 27 Giáo dục (các lô từ 31/10/2026), kênh Điện 28
        danh_muc = "27" if chung.kenh_video(tt, thu_muc) == "ngan_hang" else MAC_DINH["categoryId"]
        muc.update({"videoId": video_id, "categoryId": danh_muc, "language": MAC_DINH["language"]})
        return ("cap_nhat", muc), None
    ngang = chung.tim_video(thu_muc).get("youtube")
    if not ngang:
        return None, "chưa lên kênh và không thấy video YouTube ngang ngoài cùng thư mục"
    muc.update({"file": chung.tuong_doi(ngang), "madeForKids": tt["madeForKids"],
                "containsSyntheticMedia": tt["containsSyntheticMedia"]})
    ten_ds, nghiep_vu = chung.danh_sach_phat(tt["ma_youtube"], chung.kenh_video(tt, thu_muc))
    if ten_ds is None:
        ten_ds = tt.get("playlistTitles") or []
    elif not nghiep_vu:
        print("NHẮC %s: chưa có trong danh sách nghiệp vụ nào của du_lieu/dang_youtube/danh_sach_phat_*.json" % tt["ma_youtube"])
    if ten_ds:
        muc["playlistTitles"] = ten_ds
    anh = tim_thumbnail(thu_muc, tt)
    if anh:
        muc["thumbnail"] = anh
    return ("lo", muc), None


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("thu_muc", nargs="+", help="thư mục video (hoặc thư mục dang_bai, hoặc youtube.md)")
    ap.add_argument("--ten", required=True, help="tên lô, không dấu, ví dụ dien_mat_troi")
    ap.add_argument("--ghi", action="store_true", help="ghi file vào du_lieu/dang_youtube/")
    a = ap.parse_args()
    ngay = dt.date.today().strftime("%Y.%m.%d")
    nhom = {"lo": [], "cap_nhat": []}
    for f in a.thu_muc:
        ket_qua, ly_do = chuyen(f)
        if not ket_qua:
            print("BỎ QUA %s: %s" % (f, ly_do))
            continue
        loai, muc = ket_qua
        nhom[loai].append(muc)
        print("%-9s %s  %s%s" % (loai, muc["ma"], muc["title"], ("  (videoId %s)" % muc["videoId"]) if "videoId" in muc else ""))
    ghi_chu = "Sinh bằng viet-chu-dang-video/xuat_ke_khai.py ngày %s. Trung duyệt trước khi chạy." % ngay
    files_ra = {
        "lo": (THU_MUC_DANG / ("lo_%s_%s.json" % (ngay, a.ten)),
               {"lo": "%s_%s" % (ngay, a.ten), "_ghi_chu": ghi_chu + " publishAt chưa đặt: Trung chọn giờ đăng.",
                "mac_dinh": MAC_DINH, "video": nhom["lo"]}),
        "cap_nhat": (THU_MUC_DANG / ("cap_nhat_%s_%s.json" % (ngay, a.ten)),
                     {"cap_nhat": "%s_%s" % (ngay, a.ten), "_ghi_chu": ghi_chu + " Chỉ sửa tiêu đề, mô tả, thẻ, danh mục, ngôn ngữ; giữ nguyên chế độ riêng tư và giờ đăng.",
                      "video": nhom["cap_nhat"]}),
    }
    for loai, (duong_dan, du_lieu) in files_ra.items():
        if not nhom[loai]:
            continue
        if not a.ghi:
            print("\n(chạy thử) sẽ ghi %s: %d video" % (chung.tuong_doi(duong_dan), len(nhom[loai])))
            continue
        if duong_dan.exists():
            raise SystemExit("đã có %s, đổi --ten để khỏi ghi đè" % duong_dan)
        duong_dan.parent.mkdir(parents=True, exist_ok=True)
        duong_dan.write_text(json.dumps(du_lieu, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print("\nĐã ghi %s: %d video" % (chung.tuong_doi(duong_dan), len(nhom[loai])))
    if nhom["lo"]:
        print("Tải lô: python3 -I skills/dang-youtube/scripts/chay_lo.py %s" % chung.tuong_doi(files_ra["lo"][0]))
    if nhom["cap_nhat"]:
        print("Cập nhật video đã lên kênh: python3 -I skills/viet-chu-dang-video/scripts/cap_nhat_youtube.py %s" % chung.tuong_doi(files_ra["cap_nhat"][0]))


if __name__ == "__main__":
    main()
