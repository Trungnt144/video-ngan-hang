#!/usr/bin/env python3
"""Sửa tiêu đề, mô tả, thẻ của video ĐÃ lên kênh YouTube, theo file cập nhật do xuat_ke_khai.py sinh.

Gọi thẳng YouTube Data API bằng khoá và token của skill dang-youtube (~/.config/dang-youtube/client_secrets.json,
request.token; token có phạm vi youtube.force-ssl, kiểm 28/10/2026). Không dùng yutu: yutu đăng nhập bằng địa chỉ
quay về http://localhost:8216 mà khoá OAuth chưa khai, Google báo redirect_uri_mismatch (28/10/2026).

Mặc định chỉ chạy thử: in việc sẽ làm, không gọi YouTube. Thêm --chay-that khi Trung đã duyệt file cập nhật.
Chạy từ gốc Media:
  python3 -I skills/viet-chu-dang-video/scripts/cap_nhat_youtube.py du_lieu/dang_youtube/cap_nhat_<...>.json [--chay-that] [--chi <mã>]

An toàn:
- Kiểm token thuộc kênh Chuyện nghề Điện và video thuộc kênh đó trước khi sửa; sai thì dừng.
- Chỉ gửi phần snippet (videos.update part=snippet), nên chế độ riêng tư, giờ đăng, nhãn trẻ em, nhãn AI giữ nguyên.
  Các trường snippet khác (ngôn ngữ) lấy từ video hiện tại gửi lại, vì API xoá trường snippet không gửi kèm.
- Hẹn giờ công khai (thêm 29/10/2026, Trung duyệt): video nào trong file có trường "publishAt" (ISO 8601 kèm múi giờ,
  ví dụ "2026-10-29T14:00:00+07:00") thì gửi thêm phần status: riêng tư kèm giờ đăng, tới giờ YouTube tự công khai.
  Các trường status khác (giấy phép, nhúng, nhãn trẻ em, nhãn AI) lấy từ video hiện tại gửi lại.
- Đọc lại sau khi sửa; mỗi video ghi một dòng vào du_lieu/dang_youtube/so_cap_nhat.jsonl (kèm tiêu đề, mô tả, thẻ cũ).
"""
import argparse
import datetime as dt
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chung  # noqa: E402

KHOA = Path.home() / ".config" / "dang-youtube"
KENH = "UCMo-VX6bf8_SNu8tUa5wiMw"  # Chuyện nghề Điện
API = "https://www.googleapis.com/youtube/v3/"
SO_CAP_NHAT = chung.GOC_MEDIA / "du_lieu" / "dang_youtube" / "so_cap_nhat.jsonl"


def lay_ma_truy_cap():
    cs = json.loads((KHOA / "client_secrets.json").read_text(encoding="utf-8"))
    cs = cs.get("web") or cs.get("installed")
    tk = json.loads((KHOA / "request.token").read_text(encoding="utf-8"))
    du_lieu = urllib.parse.urlencode({"client_id": cs["client_id"], "client_secret": cs["client_secret"],
                                      "refresh_token": tk["refresh_token"], "grant_type": "refresh_token"}).encode()
    return json.load(urllib.request.urlopen(cs.get("token_uri", "https://oauth2.googleapis.com/token"), du_lieu, timeout=30))["access_token"]


def goi(ma, phuong_thuc, duong, du_lieu=None):
    yc = urllib.request.Request(API + duong, method=phuong_thuc, headers={"Authorization": "Bearer " + ma},
                                data=json.dumps(du_lieu).encode() if du_lieu is not None else None)
    if du_lieu is not None:
        yc.add_header("Content-Type", "application/json; charset=utf-8")
    try:
        return json.load(urllib.request.urlopen(yc, timeout=60))
    except urllib.error.HTTPError as e:
        raise RuntimeError("HTTP %s: %s" % (e.code, e.read().decode("utf-8", "replace")[:400]))


def doc_video(ma, video_id):
    ds = goi(ma, "GET", "videos?part=snippet,status&id=" + video_id).get("items", [])
    if not ds:
        raise RuntimeError("YouTube không trả về video %s" % video_id)
    return ds[0]


def cung_gio(a, b):
    """So hai mốc ISO 8601 (YouTube trả đuôi Z)."""
    if not a or not b:
        return a == b
    doi = lambda s: dt.datetime.fromisoformat(s.replace("Z", "+00:00"))  # noqa: E731
    return doi(a) == doi(b)


def main():
    global KHOA, KENH
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("file")
    ap.add_argument("--chay-that", action="store_true")
    ap.add_argument("--chi", help="chỉ sửa video có mã này")
    ap.add_argument("--khoa", default=str(KHOA), help="thư mục khoá của kênh (kênh khác kênh Điện, skill dang-youtube)")
    ap.add_argument("--kenh", default=KENH, help="mã kênh mà token và video phải thuộc về (mặc định Chuyện nghề Điện)")
    a = ap.parse_args()
    KHOA, KENH = Path(a.khoa).expanduser(), a.kenh
    du_lieu = json.loads(chung.tuyet_doi(a.file).read_text(encoding="utf-8"))
    ds = [v for v in du_lieu.get("video", []) if not a.chi or v.get("ma") == a.chi]
    if not ds:
        raise SystemExit("không có video nào để sửa")

    loi, hop_le = 0, []
    for v in ds:
        if len(v["title"]) > 100 or len(v["description"].encode("utf-8")) > 5000 or chung.do_dai_the_api(v["tags"]) > 500:
            print("BỎ QUA %s: vượt giới hạn YouTube, chạy lại kiem_chu_dang.py" % v["ma"])
            loi += 1
            continue
        if v.get("publishAt") and dt.datetime.fromisoformat(v["publishAt"]) <= dt.datetime.now(dt.timezone.utc):
            print("BỎ QUA %s: giờ công khai %s đã qua" % (v["ma"], v["publishAt"]))
            loi += 1
            continue
        hop_le.append(v)
        print("%s (%s): \"%s\" · mô tả %d byte · %d thẻ%s" % (v["ma"], v["videoId"], v["title"], len(v["description"].encode("utf-8")),
              len(v["tags"]), " · công khai lúc " + v["publishAt"] if v.get("publishAt") else ""))
    if not a.chay_that:
        print("\nChạy thử, chưa gọi YouTube. Trung duyệt file cập nhật rồi thêm --chay-that.")
        return

    ma = lay_ma_truy_cap()
    kenh = [i["id"] for i in goi(ma, "GET", "channels?part=id&mine=true").get("items", [])]
    if KENH not in kenh:
        raise SystemExit("DỪNG: token thuộc kênh %s, không phải kênh %s" % (kenh, KENH))

    for v in hop_le:
        ban_ghi = {"ma": v["ma"], "videoId": v["videoId"], "thoi_gian": dt.datetime.now().isoformat(timespec="seconds"),
                   "nguon": v.get("_nguon", "")}
        try:
            truoc = doc_video(ma, v["videoId"])
            if truoc["snippet"]["channelId"] != KENH:
                raise RuntimeError("video thuộc kênh khác (%s)" % truoc["snippet"]["channelId"])
            cu = truoc["snippet"]
            snippet = {"title": v["title"], "description": v["description"], "tags": v["tags"],
                       "categoryId": v.get("categoryId") or cu.get("categoryId", "28")}
            for khoa in ("defaultLanguage", "defaultAudioLanguage"):
                gt = cu.get(khoa) or v.get("language")
                if gt:
                    snippet[khoa] = gt
            goi(ma, "PUT", "videos?part=snippet", {"id": v["videoId"], "snippet": snippet})
            muon_che_do, muon_gio = truoc["status"].get("privacyStatus"), truoc["status"].get("publishAt")
            if v.get("publishAt"):
                status = {k: truoc["status"][k] for k in ("license", "embeddable", "publicStatsViewable",
                          "selfDeclaredMadeForKids", "containsSyntheticMedia") if k in truoc["status"]}
                status.update({"privacyStatus": "private", "publishAt": v["publishAt"]})
                goi(ma, "PUT", "videos?part=status", {"id": v["videoId"], "status": status})
                muon_che_do, muon_gio = "private", v["publishAt"]
                ban_ghi["gio_cong_khai"] = v["publishAt"]
            for lan in range(4):  # đọc ngay sau khi sửa có thể còn bản cũ (gặp 29/10/2026 với publishAt): chờ rồi đọc lại
                time.sleep(3 * lan)
                sau = doc_video(ma, v["videoId"])
                ok = (sau["snippet"]["title"] == v["title"] and sau["snippet"].get("description", "") == v["description"]
                      and sorted(sau["snippet"].get("tags", [])) == sorted(v["tags"])  # YouTube tự xếp thẻ theo chữ cái
                      and sau["status"].get("privacyStatus") == muon_che_do
                      and cung_gio(sau["status"].get("publishAt"), muon_gio))
                if ok:
                    break
            ban_ghi.update({"tieu_de_cu": cu["title"], "mo_ta_cu": cu.get("description", ""), "the_cu": cu.get("tags", []),
                            "tieu_de_moi": sau["snippet"]["title"], "che_do_truoc": truoc["status"].get("privacyStatus"),
                            "che_do_sau": sau["status"].get("privacyStatus"), "trang_thai": "da_sua" if ok else "can_xem_lai"})
            print("%s %s: \"%s\" → \"%s\", chế độ %s → %s, giờ công khai %s" % ("XONG" if ok else "XEM LẠI", v["ma"], cu["title"],
                  sau["snippet"]["title"], truoc["status"].get("privacyStatus"), sau["status"].get("privacyStatus"),
                  sau["status"].get("publishAt") or "không"))
            if not ok:
                loi += 1
        except Exception as e:  # noqa: BLE001
            ban_ghi.update({"trang_thai": "loi", "loi": str(e)})
            print("LỖI %s: %s" % (v["ma"], e))
            loi += 1
        with SO_CAP_NHAT.open("a", encoding="utf-8") as f:
            f.write(json.dumps(ban_ghi, ensure_ascii=False) + "\n")
    sys.exit(1 if loi else 0)


if __name__ == "__main__":
    main()
