#!/usr/bin/env python3
"""Tải một lô video lên YouTube bằng youtubeuploader theo file kê khai.

Mặc định chỉ chạy thử (kiểm file kê khai, in lệnh sẽ chạy); thêm --chay-that mới tải.
Chạy:  python3 -I skills/dang-youtube/scripts/chay_lo.py <file_ke_khai.json> [--chay-that]
Chạy từ gốc Media. Đường dẫn file trong kê khai tính từ gốc Media nếu không tuyệt đối.
"""
import argparse
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

GOC_MEDIA = Path(__file__).resolve().parents[3]
SO_MAC_DINH = GOC_MEDIA / "du_lieu" / "dang_youtube" / "so_trang_thai.jsonl"
KHOA_MAC_DINH = Path.home() / ".config" / "dang-youtube"

DUOI_VIDEO = {".mp4", ".mov", ".m4v", ".mkv", ".webm"}
DUOI_ANH = {".jpg", ".jpeg", ".png"}
DUOI_PHU_DE = {".srt", ".vtt", ".sbv"}
CHE_DO = {"private", "unlisted", "public"}
# Kênh Chuyện nghề Điện. Token OAuth cấp cho kênh khác thì script dừng (28/10/2026 lô đầu lên nhầm kênh cá nhân).
KENH_MAC_DINH = "UCMo-VX6bf8_SNu8tUa5wiMw"
TRANG_THAI_XONG = {"da_tai", "da_co"}
MOC_THOI_GIAN = re.compile(r"^\s*((\d{1,2}):)?(\d{1,2}):(\d{2})\b")


def doc_so(duong_dan):
    muc = []
    if duong_dan.exists():
        for dong in duong_dan.read_text(encoding="utf-8").splitlines():
            if dong.strip():
                muc.append(json.loads(dong))
    return muc


def ghi_so(duong_dan, ban_ghi):
    duong_dan.parent.mkdir(parents=True, exist_ok=True)
    with duong_dan.open("a", encoding="utf-8") as f:
        f.write(json.dumps(ban_ghi, ensure_ascii=False) + "\n")


def ghi_so_no(ma, video_id, ten_lo, che_do):
    """Sửa dòng Trạng thái của mục <mã> trong so_no_cong_viec.md (thêm 01/11/2026: sổ nợ ghi chậm
    việc tải lên làm phiên điều phối chia nhầm 36 video đã lên kênh). Mã không phải N<số> thì bỏ qua."""
    ma = str(ma).upper()
    p = GOC_MEDIA / "so_no_cong_viec.md"
    if not re.fullmatch(r"N\d+", ma) or not p.is_file():
        return False
    dong = p.read_text(encoding="utf-8").split("\n")
    trong_muc = False
    for i, d in enumerate(dong):
        if d.startswith("### "):
            trong_muc = d.startswith("### %s " % ma)
        elif trong_muc and d.startswith("| Trạng thái"):
            dong[i] = "| Trạng thái | **Đã tải lên** %s, chế độ %s (lô %s): https://youtu.be/%s |" % (
                dt.date.today().strftime("%d/%m/%Y"), che_do, ten_lo, video_id)
            p.write_text("\n".join(dong), encoding="utf-8")
            return True
    return False


def tuyet_doi(p):
    p = Path(os.path.expanduser(p))
    return p if p.is_absolute() else GOC_MEDIA / p


def doc_thoi_diem(chuoi):
    """Đọc giờ đăng dạng ISO 8601 có múi giờ, ví dụ 2026-11-03T19:00:00+07:00."""
    t = dt.datetime.fromisoformat(chuoi.replace("Z", "+00:00"))
    if t.tzinfo is None:
        raise ValueError("thiếu múi giờ (thêm +07:00)")
    return t


def kiem_chuong(mo_ta):
    """Trả về danh sách cảnh báo về mốc chương trong mô tả (YouTube cần ≥3 mốc, mốc đầu 00:00, mỗi chương ≥10 giây)."""
    moc = []
    for dong in mo_ta.splitlines():
        m = MOC_THOI_GIAN.match(dong)
        if m:
            gio = int(m.group(2) or 0)
            moc.append(gio * 3600 + int(m.group(3)) * 60 + int(m.group(4)))
    if not moc:
        return []
    canh_bao = []
    if moc[0] != 0:
        canh_bao.append("mốc chương đầu phải là 00:00")
    if len(moc) < 3:
        canh_bao.append("cần ít nhất 3 mốc chương")
    for a, b in zip(moc, moc[1:]):
        if b - a < 10:
            canh_bao.append("có chương ngắn hơn 10 giây hoặc mốc không tăng dần")
            break
    return canh_bao


def kiem_muc(v, mac_dinh, bay_gio):
    """Gộp giá trị mặc định vào một mục, trả về (mục đã gộp, lỗi, cảnh báo)."""
    m = dict(mac_dinh)
    m.update(v)
    loi, canh_bao = [], []

    if not str(m.get("ma", "")).strip():
        loi.append("thiếu mã video (ma)")
    f = tuyet_doi(m.get("file", ""))
    if not m.get("file") or not f.is_file():
        loi.append("không thấy file video: %s" % m.get("file"))
    elif f.suffix.lower() not in DUOI_VIDEO:
        loi.append("đuôi file video không hợp lệ: %s" % f.suffix)
    m["_file"] = f

    tieu_de = m.get("title", "")
    if not tieu_de.strip():
        loi.append("thiếu tiêu đề")
    if len(tieu_de) > 100:
        loi.append("tiêu đề %d ký tự, tối đa 100" % len(tieu_de))
    mo_ta = m.get("description", "")
    so_byte = len(mo_ta.encode("utf-8"))
    if so_byte > 5000:
        loi.append("mô tả %d byte, tối đa 5000" % so_byte)
    for ten, gia_tri in (("tiêu đề", tieu_de), ("mô tả", mo_ta)):
        if "<" in gia_tri or ">" in gia_tri:
            loi.append("%s có ký tự < hoặc >, YouTube không nhận" % ten)
    canh_bao += kiem_chuong(mo_ta)

    the = m.get("tags", [])
    tong_the = sum(len(t) + (2 if " " in t else 0) for t in the) + max(len(the) - 1, 0)
    if tong_the > 500:
        loi.append("thẻ dài %d ký tự, tối đa 500" % tong_the)

    if m.get("thumbnail"):
        a = tuyet_doi(m["thumbnail"])
        if not a.is_file():
            loi.append("không thấy thumbnail: %s" % m["thumbnail"])
        elif a.suffix.lower() not in DUOI_ANH:
            loi.append("thumbnail phải là JPG hoặc PNG")
        elif a.stat().st_size > 50 * 1024 * 1024:
            loi.append("thumbnail quá 50 MB")
        m["_thumbnail"] = a
    if m.get("phu_de"):
        p = tuyet_doi(m["phu_de"])
        if not p.is_file():
            loi.append("không thấy phụ đề: %s" % m["phu_de"])
        elif p.suffix.lower() not in DUOI_PHU_DE:
            loi.append("phụ đề phải là .srt, .vtt hoặc .sbv")
        m["_phu_de"] = p

    che_do = m.get("privacyStatus")
    if che_do not in CHE_DO:
        loi.append("privacyStatus phải là private, unlisted hoặc public")
    if m.get("publishAt"):
        if che_do != "private":
            loi.append("publishAt chỉ dùng được khi privacyStatus là private")
        try:
            t = doc_thoi_diem(m["publishAt"])
            if t < bay_gio + dt.timedelta(minutes=15):
                loi.append("giờ đăng phải sau thời điểm chạy ít nhất 15 phút")
        except ValueError as e:
            loi.append("publishAt sai định dạng: %s" % e)

    # Hai trường khai báo thay chủ kênh: bắt buộc ghi rõ trong file kê khai Trung đã duyệt.
    for khoa in ("madeForKids", "containsSyntheticMedia"):
        if not isinstance(m.get(khoa), bool):
            loi.append("%s phải ghi rõ true hoặc false trong file kê khai" % khoa)
    if not isinstance(m.get("notify", False), bool):
        loi.append("notify phải là true hoặc false")
    return m, loi, canh_bao


def kenh_cua_token(khoa):
    """Làm mới token rồi hỏi API kênh nào đang được cấp quyền; trả về danh sách (mã kênh, tên kênh)."""
    import urllib.parse
    import urllib.request
    cs = json.loads((khoa / "client_secrets.json").read_text(encoding="utf-8"))
    cs = cs.get("web") or cs.get("installed")
    tk = json.loads((khoa / "request.token").read_text(encoding="utf-8"))
    du_lieu = urllib.parse.urlencode({"client_id": cs["client_id"], "client_secret": cs["client_secret"],
                                      "refresh_token": tk["refresh_token"], "grant_type": "refresh_token"}).encode()
    at = json.load(urllib.request.urlopen(cs.get("token_uri", "https://oauth2.googleapis.com/token"), du_lieu))["access_token"]
    yc = urllib.request.Request("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
                                headers={"Authorization": "Bearer " + at})
    return [(c["id"], c["snippet"]["title"]) for c in json.load(urllib.request.urlopen(yc)).get("items", [])]


def tao_meta(m):
    meta = {
        "title": m["title"],
        "description": m.get("description", ""),
        "tags": m.get("tags", []),
        "categoryId": str(m.get("categoryId", "")),
        "privacyStatus": m["privacyStatus"],
        "madeForKids": m["madeForKids"],
        "containsSyntheticMedia": m["containsSyntheticMedia"],
        "language": m.get("language", "vi"),
    }
    for khoa in ("publishAt", "playlistTitles", "playlistIds", "localizations", "license", "embeddable"):
        if m.get(khoa) not in (None, "", []):
            meta[khoa] = m[khoa]
    return meta


def lenh_tai(cong_cu, m, file_meta, file_ket_qua, khoa):
    lenh = [cong_cu, "-filename", str(m["_file"]), "-metaJSON", str(file_meta),
            "-metaJSONout", str(file_ket_qua), "-secrets", str(khoa / "client_secrets.json"),
            "-cache", str(khoa / "request.token"), "-quiet",
            "-notify=%s" % ("true" if m.get("notify", False) else "false")]
    if m.get("_thumbnail"):
        lenh += ["-thumbnail", str(m["_thumbnail"])]
    if m.get("_phu_de"):
        lenh += ["-caption", str(m["_phu_de"])]
    return lenh


def chay(lenh, thu_muc):
    """Chạy lệnh, in đầu ra ngay khi có (để thấy đường dẫn đăng nhập lần đầu), trả về (mã thoát, toàn bộ đầu ra)."""
    tien_trinh = subprocess.Popen(lenh, cwd=thu_muc, stdout=subprocess.PIPE,
                                  stderr=subprocess.STDOUT, text=True)
    dau_ra = []
    for dong in tien_trinh.stdout:
        print("    " + dong.rstrip())
        dau_ra.append(dong)
    return tien_trinh.wait(), "".join(dau_ra)


def phan_loai_loi(dau_ra):
    if "quotaExceeded" in dau_ra:
        return "hoan", "hết hạn mức dự án trong ngày; chạy lại sau 0 giờ giờ Thái Bình Dương (14 hoặc 15 giờ Việt Nam)"
    if "uploadLimitExceeded" in dau_ra:
        return "hoan", "kênh đã chạm giới hạn số video trong 24 giờ; chạy lại sau 24 giờ"
    if "invalid_grant" in dau_ra:
        return "loi", "token hết hạn hoặc bị thu hồi; xoá request.token rồi chạy lại để đăng nhập"
    return "loi", "lỗi khác, xem đầu ra ở trên"


def main():
    ap = argparse.ArgumentParser(description="Tải lô video lên YouTube theo file kê khai")
    ap.add_argument("ke_khai", help="file kê khai JSON")
    ap.add_argument("--chay-that", action="store_true", help="tải thật (mặc định chỉ chạy thử)")
    ap.add_argument("--toi-da", type=int, default=5, help="số video tối đa tải trong ngày (mặc định 5)")
    ap.add_argument("--khoa", default=str(KHOA_MAC_DINH), help="thư mục chứa client_secrets.json và request.token")
    ap.add_argument("--so", default=str(SO_MAC_DINH), help="sổ trạng thái JSONL")
    ap.add_argument("--kenh", default=KENH_MAC_DINH, help="mã kênh YouTube phải khớp với token (mặc định Chuyện nghề Điện)")
    a = ap.parse_args()

    ke_khai = json.loads(Path(a.ke_khai).read_text(encoding="utf-8"))
    ten_lo = ke_khai.get("lo", Path(a.ke_khai).stem)
    mac_dinh = ke_khai.get("mac_dinh", {})
    so = Path(a.so)
    khoa = Path(os.path.expanduser(a.khoa))
    bay_gio = dt.datetime.now(dt.timezone.utc)

    so_cu = doc_so(so)
    ma_xong = {r["ma"] for r in so_cu if r.get("trang_thai") in TRANG_THAI_XONG}
    file_xong = {r.get("file") for r in so_cu if r.get("trang_thai") in TRANG_THAI_XONG}
    hom_nay = dt.date.today().isoformat()
    da_tai_hom_nay = sum(1 for r in so_cu if r.get("trang_thai") == "da_tai" and r.get("thoi_gian", "").startswith(hom_nay))

    cac_muc, co_loi, ma_da_gap = [], False, set()
    print("Lô %s: %d video trong file kê khai" % (ten_lo, len(ke_khai.get("video", []))))
    for v in ke_khai.get("video", []):
        m, loi, canh_bao = kiem_muc(v, mac_dinh, bay_gio)
        ma = m.get("ma")
        if ma in ma_da_gap:
            loi.append("mã %s lặp lại trong file kê khai" % ma)
        ma_da_gap.add(ma)
        bo_qua = ma in ma_xong or str(m["_file"]) in file_xong
        nhan = "BỎ QUA (đã có trong sổ)" if bo_qua else ("LỖI" if loi else "SẼ TẢI")
        print("\n[%s] %s — %s" % (ma, nhan, m.get("title", "")[:70]))
        print("    chế độ %s, giờ đăng %s, trẻ em %s, nội dung AI %s, thumbnail %s, phụ đề %s" % (
            m.get("privacyStatus"), m.get("publishAt", "—"), m.get("madeForKids"),
            m.get("containsSyntheticMedia"), "có" if m.get("_thumbnail") else "không",
            "có" if m.get("_phu_de") else "không"))
        for x in loi:
            print("    LỖI: " + x)
        for x in canh_bao:
            print("    CẢNH BÁO: " + x)
        if loi and not bo_qua:
            co_loi = True
        if not bo_qua:
            cac_muc.append(m)

    con_lai = max(a.toi_da - da_tai_hom_nay, 0)
    print("\nHôm nay đã tải %d video; giới hạn --toi-da %d; lượt này tải tối đa %d." % (da_tai_hom_nay, a.toi_da, con_lai))
    if co_loi:
        print("Có lỗi trong file kê khai. Sửa xong mới chạy thật.")
        return 2

    cong_cu = shutil.which("youtubeuploader") or str(Path.home() / ".local" / "bin" / "youtubeuploader")
    if not a.chay_that:
        tmp = Path(tempfile.gettempdir())
        for m in cac_muc[:con_lai]:
            print("\nLệnh cho [%s]:\n    %s" % (m["ma"], " ".join(lenh_tai(cong_cu, m, tmp / "meta.json", tmp / "ket_qua.json", khoa))))
        print("\nChạy thử xong, chưa tải gì. Thêm --chay-that để tải.")
        return 0

    if not (khoa / "client_secrets.json").is_file():
        print("Chưa có %s. Làm bước tạo khoá OAuth trong SKILL.md trước." % (khoa / "client_secrets.json"))
        return 2

    # Không có token thì youtubeuploader tự đăng nhập rồi tải luôn, trước khi kiểm kênh được: bắt đăng nhập riêng.
    if not (khoa / "request.token").is_file():
        print("DỪNG: chưa có %s. Chạy dang_nhap.py --khoa %s --kenh %s trước." % (khoa / "request.token", khoa, a.kenh))
        return 2
    kenh = kenh_cua_token(khoa)
    print("Token đang cấp quyền cho kênh: %s" % kenh)
    if not any(k[0] == a.kenh for k in kenh):
        print("DỪNG: token không thuộc kênh %s. Đăng nhập lại và chọn đúng kênh, rồi chạy lại." % a.kenh)
        return 2

    tmp = Path(tempfile.mkdtemp(prefix="dang_youtube_"))
    for m in cac_muc[:con_lai]:
        file_meta, file_ket_qua = tmp / ("%s.meta.json" % m["ma"]), tmp / ("%s.ket_qua.json" % m["ma"])
        file_meta.write_text(json.dumps(tao_meta(m), ensure_ascii=False, indent=2), encoding="utf-8")
        print("\n=== Tải [%s] %s" % (m["ma"], m["title"]))
        ma_thoat, dau_ra = chay(lenh_tai(cong_cu, m, file_meta, file_ket_qua, khoa), khoa)
        ban_ghi = {"ma": m["ma"], "lo": ten_lo, "file": str(m["_file"]), "privacy_yeu_cau": m["privacyStatus"],
                   "publishAt": m.get("publishAt"), "thoi_gian": dt.datetime.now().isoformat(timespec="seconds")}
        # youtubeuploader ghi file kết quả ngay sau khi video lên, trước bước thumbnail và phụ đề:
        # có file kết quả nghĩa là video đã nằm trên kênh, phải ghi sổ để lần sau không tải trùng.
        if file_ket_qua.is_file():
            kq = json.loads(file_ket_qua.read_text(encoding="utf-8"))
            ban_ghi.update({"trang_thai": "da_tai", "videoId": kq.get("id"),
                            "privacy_nhan": (kq.get("status") or {}).get("privacyStatus")})
            if ma_thoat != 0:
                ban_ghi["ghi_chu"] = "video đã lên nhưng bước sau lỗi (thumbnail hoặc phụ đề): " + phan_loai_loi(dau_ra)[1]
            ghi_so(so, ban_ghi)
            print("    Đã ghi sổ: https://youtu.be/%s (chế độ nhận về: %s)" % (ban_ghi["videoId"], ban_ghi["privacy_nhan"]))
            if ghi_so_no(m["ma"], ban_ghi["videoId"], ten_lo, ban_ghi["privacy_nhan"]):
                print("    Đã sửa dòng Trạng thái của %s trong so_no_cong_viec.md" % m["ma"].upper())
            if m["privacyStatus"] != "private" and ban_ghi["privacy_nhan"] == "private":
                print("    DỪNG LÔ: yêu cầu %s nhưng YouTube trả về private, có thể dự án API đang bị khoá riêng tư." % m["privacyStatus"])
                return 1
            if ma_thoat != 0:
                print("    DỪNG LÔ: " + ban_ghi["ghi_chu"])
                return 1
            continue
        trang_thai, ly_do = phan_loai_loi(dau_ra)
        ban_ghi.update({"trang_thai": trang_thai, "ghi_chu": ly_do})
        ghi_so(so, ban_ghi)
        print("    DỪNG LÔ: " + ly_do)
        return 1
    print("\nXong lượt này. Sổ trạng thái: %s" % so)
    return 0


if __name__ == "__main__":
    sys.exit(main())
