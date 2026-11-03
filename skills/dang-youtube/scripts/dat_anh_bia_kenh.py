#!/usr/bin/env python3
"""Đặt ảnh bìa (banner) cho kênh YouTube Chuyện nghề Điện bằng YouTube Data API.

Dùng khoá và token của skill dang-youtube (~/.config/dang-youtube/client_secrets.json, request.token; token có phạm vi
youtube.force-ssl). Không dùng yutu vì yutu đăng nhập bằng địa chỉ quay về mà khoá OAuth chưa khai (xem
skills/viet-chu-dang-video/scripts/cap_nhat_youtube.py). Hai bước API: channelBanners.insert tải ảnh lên và trả địa chỉ ảnh,
channels.update (part=brandingSettings) gắn địa chỉ đó làm ảnh bìa.

Mặc định chỉ chạy thử: kiểm file ảnh, kiểm token thuộc đúng kênh, đọc ảnh bìa hiện tại, không ghi gì lên YouTube.
Thêm --chay-that khi Trung đã duyệt ảnh. Chạy từ gốc Media:
  python3 -I skills/dang-youtube/scripts/dat_anh_bia_kenh.py san_pham/<thư mục>/<ảnh>.jpg [--chay-that]

An toàn:
- Dừng nếu token thuộc kênh khác Chuyện nghề Điện (UCMo-VX6bf8_SNu8tUa5wiMw).
- channels.update ghi đè cả phần brandingSettings, nên script đọc phần hiện có và gửi lại nguyên (tên kênh, mô tả, từ khoá...),
  chỉ đổi địa chỉ ảnh bìa.
- Trước khi ghi, lưu phần brandingSettings cũ và địa chỉ ảnh bìa cũ vào du_lieu/dang_youtube/so_bia_kenh.jsonl để đặt lại được.
- Đọc lại sau khi ghi và so địa chỉ ảnh bìa.
Giới hạn của YouTube: ảnh JPG hoặc PNG, tối đa 6 MB, tối thiểu 2048×1152, tỉ lệ 16:9.
"""
import argparse
import datetime as dt
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

KHOA = Path.home() / ".config" / "dang-youtube"
KENH = "UCMo-VX6bf8_SNu8tUa5wiMw"  # Chuyện nghề Điện
API = "https://www.googleapis.com/youtube/v3/"
TAI_LEN = "https://www.googleapis.com/upload/youtube/v3/channelBanners/insert?uploadType=media"
GOC_MEDIA = Path(__file__).resolve().parents[3]
SO_BIA = GOC_MEDIA / "du_lieu" / "dang_youtube" / "so_bia_kenh.jsonl"


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
        raise RuntimeError("HTTP %s: %s" % (e.code, e.read().decode("utf-8", "replace")[:600]))


def tai_anh_len(ma, duong_dan):
    kieu = "image/png" if duong_dan.suffix.lower() == ".png" else "image/jpeg"
    yc = urllib.request.Request(TAI_LEN, method="POST", data=duong_dan.read_bytes(),
                                headers={"Authorization": "Bearer " + ma, "Content-Type": kieu})
    try:
        return json.load(urllib.request.urlopen(yc, timeout=120))["url"]
    except urllib.error.HTTPError as e:
        raise RuntimeError("HTTP %s: %s" % (e.code, e.read().decode("utf-8", "replace")[:600]))


def doc_kenh(ma):
    ds = goi(ma, "GET", "channels?part=snippet,brandingSettings&id=" + KENH).get("items", [])
    if not ds:
        raise RuntimeError("YouTube không trả về kênh %s" % KENH)
    return ds[0]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("anh")
    ap.add_argument("--chay-that", action="store_true")
    a = ap.parse_args()

    anh = Path(a.anh)
    if not anh.is_absolute():
        anh = GOC_MEDIA / anh
    if not anh.is_file() or anh.suffix.lower() not in (".jpg", ".jpeg", ".png"):
        raise SystemExit("DỪNG: không thấy file ảnh JPG hoặc PNG: %s" % anh)
    dung_luong = anh.stat().st_size
    if dung_luong > 6 * 1024 * 1024:
        raise SystemExit("DỪNG: ảnh %.1f MB, YouTube nhận tối đa 6 MB" % (dung_luong / 1048576))
    try:
        from PIL import Image
        rong, cao = Image.open(anh).size
        if rong < 2048 or cao < 1152 or abs(rong / cao - 16 / 9) > 0.02:
            raise SystemExit("DỪNG: ảnh %d×%d, YouTube cần tối thiểu 2048×1152 và tỉ lệ 16:9" % (rong, cao))
        print("Ảnh: %s · %d×%d · %.2f MB" % (anh.name, rong, cao, dung_luong / 1048576))
    except ImportError:
        print("Ảnh: %s · %.2f MB (không kiểm được kích thước vì thiếu Pillow)" % (anh.name, dung_luong / 1048576))

    ma = lay_ma_truy_cap()
    kenh = [i["id"] for i in goi(ma, "GET", "channels?part=id&mine=true").get("items", [])]
    if KENH not in kenh:
        raise SystemExit("DỪNG: token thuộc kênh %s, không phải Chuyện nghề Điện %s" % (kenh, KENH))
    cu = doc_kenh(ma)
    bs_cu = cu.get("brandingSettings", {})
    bia_cu = bs_cu.get("image", {}).get("bannerExternalUrl", "")
    print("Kênh: %s (%s) · ảnh bìa hiện tại: %s" % (cu["snippet"]["title"], KENH, bia_cu or "chưa có"))
    if not a.chay_that:
        print("\nChạy thử, chưa ghi gì lên YouTube. Trung duyệt ảnh rồi thêm --chay-that.")
        return

    ban_ghi = {"thoi_gian": dt.datetime.now().isoformat(timespec="seconds"), "kenh": KENH, "file": str(anh.relative_to(GOC_MEDIA)) if anh.is_relative_to(GOC_MEDIA) else str(anh),
               "branding_cu": bs_cu, "bia_cu": bia_cu}
    url_moi = tai_anh_len(ma, anh)
    print("Đã tải ảnh lên, địa chỉ ảnh bìa mới: %s" % url_moi)
    ban_ghi["bia_moi"] = url_moi
    thuong_hieu = {"channel": bs_cu.get("channel", {}), "image": {"bannerExternalUrl": url_moi}}
    goi(ma, "PUT", "channels?part=brandingSettings", {"id": KENH, "brandingSettings": thuong_hieu})
    sau = doc_kenh(ma).get("brandingSettings", {})
    bia_sau = sau.get("image", {}).get("bannerExternalUrl", "")
    ban_ghi["bia_sau_khi_doc_lai"] = bia_sau
    ban_ghi["channel_giu_nguyen"] = sau.get("channel", {}) == bs_cu.get("channel", {})
    SO_BIA.parent.mkdir(parents=True, exist_ok=True)
    with SO_BIA.open("a", encoding="utf-8") as f:
        f.write(json.dumps(ban_ghi, ensure_ascii=False) + "\n")
    print("Đọc lại: ảnh bìa %s · phần thông tin kênh (tên, mô tả, từ khoá) %s" % (
        "ĐÃ ĐỔI" if bia_sau and bia_sau != bia_cu else "CHƯA ĐỔI (YouTube có thể cập nhật chậm vài phút)",
        "giữ nguyên" if ban_ghi["channel_giu_nguyen"] else "KHÁC TRƯỚC, xem so_bia_kenh.jsonl"))


if __name__ == "__main__":
    try:
        main()
    except RuntimeError as e:
        sys.exit("LỖI: %s" % e)
