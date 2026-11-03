#!/usr/bin/env python3
"""Gắn hình thu nhỏ (thumbnail) cho video đã có trên kênh, theo sổ trạng thái của skill dang-youtube.

Với mỗi thư mục sản phẩm trong san_pham/, lấy file `*hinh_thu_nho*.jpg` có số phiên bản lớn nhất, tìm mã video
của thư mục đó trong so_trang_thai.jsonl (trạng thái da_tai hoặc da_co), rồi gọi thumbnails.set của YouTube Data API
(50 đơn vị hạn mức mỗi lần). Mặc định chỉ chạy thử. Kết quả ghi vào so_thumbnail.jsonl; lần sau bỏ qua cặp
(mã video, file) đã gắn thành công.

Chạy từ gốc Media: python3 -I skills/dang-youtube/scripts/gan_thumbnail.py [--chay-that] [thư_mục_sản_phẩm ...]
"""
import argparse
import datetime as dt
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

GOC_MEDIA = Path(__file__).resolve().parents[3]
SO_TRANG_THAI = GOC_MEDIA / "du_lieu" / "dang_youtube" / "so_trang_thai.jsonl"
SO_THUMBNAIL = GOC_MEDIA / "du_lieu" / "dang_youtube" / "so_thumbnail.jsonl"
KHOA_MAC_DINH = Path.home() / ".config" / "dang-youtube"
KENH_MAC_DINH = "UCMo-VX6bf8_SNu8tUa5wiMw"
TOI_DA_BYTE = 2 * 1024 * 1024  # giới hạn của thumbnails.set
PHIEN_BAN = re.compile(r"_v(\d+)\.jpg$")


def doc_jsonl(duong_dan):
    if not duong_dan.exists():
        return []
    return [json.loads(d) for d in duong_dan.read_text(encoding="utf-8").splitlines() if d.strip()]


def lay_access_token(khoa):
    cs = json.loads((khoa / "client_secrets.json").read_text(encoding="utf-8"))
    cs = cs.get("web") or cs.get("installed")
    tk = json.loads((khoa / "request.token").read_text(encoding="utf-8"))
    du_lieu = urllib.parse.urlencode({"client_id": cs["client_id"], "client_secret": cs["client_secret"],
                                      "refresh_token": tk["refresh_token"], "grant_type": "refresh_token"}).encode()
    return json.load(urllib.request.urlopen(cs.get("token_uri", "https://oauth2.googleapis.com/token"), du_lieu))["access_token"]


def kenh_cua_token(at):
    yc = urllib.request.Request("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
                                headers={"Authorization": "Bearer " + at})
    return [c["id"] for c in json.load(urllib.request.urlopen(yc)).get("items", [])]


def anh_moi_nhat(thu_muc):
    ung_vien = []
    for f in thu_muc.glob("*hinh_thu_nho*.jpg"):
        m = PHIEN_BAN.search(f.name)
        ung_vien.append((int(m.group(1)) if m else 0, f))
    return max(ung_vien)[1] if ung_vien else None


def ma_video_theo_thu_muc():
    """Thư mục sản phẩm -> mã video của lần tải/ghi nhận gần nhất."""
    kq = {}
    for b in doc_jsonl(SO_TRANG_THAI):
        if b.get("trang_thai") in ("da_tai", "da_co") and b.get("videoId"):
            kq[str(Path(b["file"]).parent)] = b["videoId"]
    return kq


def dat_thumbnail(at, ma_video, anh):
    yc = urllib.request.Request(
        "https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=" + ma_video,
        data=anh.read_bytes(), method="POST",
        headers={"Authorization": "Bearer " + at, "Content-Type": "image/jpeg"})
    with urllib.request.urlopen(yc) as r:
        return json.load(r)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("thu_muc", nargs="*", help="thư mục sản phẩm (mặc định: mọi thư mục có hình thu nhỏ)")
    ap.add_argument("--chay-that", action="store_true", help="gắn thật (mặc định chỉ chạy thử)")
    ap.add_argument("--khoa", default=str(KHOA_MAC_DINH))
    ap.add_argument("--kenh", default=KENH_MAC_DINH)
    a = ap.parse_args()

    ma_theo_thu_muc = ma_video_theo_thu_muc()
    da_gan = {(b["videoId"], b["anh"]) for b in doc_jsonl(SO_THUMBNAIL) if b.get("trang_thai") == "da_gan"}
    thu_muc = [Path(t).resolve() for t in a.thu_muc] or sorted((GOC_MEDIA / "san_pham").glob("2026.*"))

    viec, bo_qua = [], []
    for t in thu_muc:
        anh = anh_moi_nhat(t)
        if anh is None:
            continue
        ma = ma_theo_thu_muc.get(str(t))
        if ma is None:
            bo_qua.append("%s: video chưa có trên kênh (sẽ gắn khi tải lô)" % t.name)
        elif (ma, str(anh)) in da_gan:
            bo_qua.append("%s: đã gắn %s" % (t.name, anh.name))
        elif anh.stat().st_size > TOI_DA_BYTE:
            bo_qua.append("%s: %s quá 2 MB" % (t.name, anh.name))
        else:
            viec.append((t, ma, anh))

    for d in bo_qua:
        print("BỎ QUA", d)
    for t, ma, anh in viec:
        print("%s  %s  <-  %s" % ("GẮN " if a.chay_that else "THỬ ", ma, anh.name))
    print("%d video cần gắn, %d bỏ qua, hạn mức dự kiến %d đơn vị" % (len(viec), len(bo_qua), 50 * len(viec)))
    if not a.chay_that or not viec:
        return 0

    at = lay_access_token(Path(a.khoa))
    if a.kenh not in kenh_cua_token(at):
        print("DỪNG: token không thuộc kênh %s" % a.kenh)
        return 2
    loi = 0
    for t, ma, anh in viec:
        ban_ghi = {"videoId": ma, "anh": str(anh), "thoi_gian": dt.datetime.now().isoformat(timespec="seconds")}
        try:
            dat_thumbnail(at, ma, anh)
            ban_ghi["trang_thai"] = "da_gan"
            print("xong", ma, t.name)
        except urllib.error.HTTPError as e:
            ban_ghi["trang_thai"] = "loi"
            ban_ghi["ghi_chu"] = e.read().decode("utf-8", "replace")[:400]
            print("LỖI", ma, t.name, e.code, ban_ghi["ghi_chu"][:200])
            loi += 1
        with SO_THUMBNAIL.open("a", encoding="utf-8") as f:
            f.write(json.dumps(ban_ghi, ensure_ascii=False) + "\n")
        if ban_ghi["trang_thai"] == "loi" and "quota" in ban_ghi.get("ghi_chu", "").lower():
            print("DỪNG: hết hạn mức")
            return 1
    return 1 if loi else 0


if __name__ == "__main__":
    sys.exit(main())
