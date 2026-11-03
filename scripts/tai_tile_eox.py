#!/usr/bin/env python3
"""Tải sẵn tile EOX Sentinel-2 cloudless 2016 (CC BY 4.0) về xuong/public/tiles/s2_2016/{z}/{x}/{y}.jpg.

Chạy lại được: bỏ qua tile đã có và là ảnh JPEG hoàn chỉnh. Tối đa 3 luồng, tổng không quá 5 yêu cầu mỗi giây.
Thứ tự: Bắc Bộ trước (mọi độ phóng đại), rồi phần còn lại của Việt Nam.
Dùng: python3 scripts/tai_tile_eox.py [bac_bo|ca_nuoc]   (mặc định ca_nuoc: Bắc Bộ trước rồi cả nước)
"""
import math, os, sys, threading, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

GOC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "xuong", "public", "tiles", "s2_2016")
GOC = os.path.normpath(GOC)
URL = "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg"
VN = (102.1, 8.3, 109.6, 23.5)
BAC_BO = (104.8, 19.8, 107.6, 22.2)
ZMAX = 13
GIOI_HAN = 5.0  # yêu cầu mỗi giây, tổng các luồng
LUONG = 3

def o(lon, lat, z):
    n = 2 ** z
    return int((lon + 180) / 360 * n), int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)

def danh_sach(b):
    for z in range(0, ZMAX + 1):
        x0, y1 = o(b[0], b[1], z); x1, y0 = o(b[2], b[3], z)
        for x in range(x0, x1 + 1):
            for y in range(y0, y1 + 1):
                yield z, x, y

def hop_le(d):
    """Ảnh hoàn chỉnh: JPEG (đủ đầu và đuôi) hoặc PNG (đủ đầu và khối IEND). Tile một màu của EOX là PNG 116 byte đặt tên .jpg."""
    return (len(d) > 100 and d[:2] == b"\xff\xd8" and d[-2:] == b"\xff\xd9") or (len(d) > 60 and d[:8] == b"\x89PNG\r\n\x1a\n" and d[-8:-4] == b"IEND")

def la_jpeg(p):
    try:
        with open(p, "rb") as f:
            d = f.read()
        return hop_le(d)
    except OSError:
        return False

khoa = threading.Lock(); lan_cuoi = [0.0]
def cho_nhip():
    with khoa:
        t = time.time(); cho = lan_cuoi[0] + 1.0 / GIOI_HAN - t
        if cho > 0: time.sleep(cho)
        lan_cuoi[0] = time.time()

dem = {"tai": 0, "co_san": 0, "loi": 0}
nhat_ky = open(os.path.join(GOC, "..", "tai_tile_loi.log"), "a", encoding="utf-8") if os.path.isdir(os.path.join(GOC, "..")) else None

def tai(t):
    z, x, y = t
    p = os.path.join(GOC, str(z), str(x), f"{y}.jpg")
    if la_jpeg(p):
        dem["co_san"] += 1; return
    os.makedirs(os.path.dirname(p), exist_ok=True)
    for lan in range(4):
        cho_nhip()
        try:
            req = urllib.request.Request(URL.format(z=z, x=x, y=y), headers={"User-Agent": "Media-xuong-tai-tile/1.0 (CC BY 4.0, tai cham 5 req/s)"})
            with urllib.request.urlopen(req, timeout=30) as r:
                d = r.read()
            if hop_le(d):
                with open(p + ".tmp", "wb") as f: f.write(d)
                os.replace(p + ".tmp", p); dem["tai"] += 1; return
            raise ValueError("không phải ảnh hoàn chỉnh (%d byte)" % len(d))
        except Exception as e:
            err = str(e)
            time.sleep(2 * (lan + 1))
    dem["loi"] += 1
    with khoa:
        nhat_ky.write(f"{z}/{x}/{y}\t{err}\n"); nhat_ky.flush()

def chay(ds, ten):
    ds = list(ds); t0 = time.time()
    print(f"{ten}: {len(ds)} tile", flush=True)
    with ThreadPoolExecutor(LUONG) as ex:
        for i, _ in enumerate(ex.map(tai, ds), 1):
            if i % 2000 == 0: print(f"  {i}/{len(ds)} tải {dem['tai']} có sẵn {dem['co_san']} lỗi {dem['loi']} {int(time.time()-t0)}s", flush=True)
    print(f"{ten} xong: tải {dem['tai']} có sẵn {dem['co_san']} lỗi {dem['loi']} {int(time.time()-t0)}s", flush=True)

if __name__ == "__main__":
    os.makedirs(GOC, exist_ok=True)
    nhat_ky = open(os.path.join(GOC, "..", "tai_tile_loi.log"), "a", encoding="utf-8")
    cheDo = sys.argv[1] if len(sys.argv) > 1 else "ca_nuoc"
    chay(danh_sach(BAC_BO), "Bắc Bộ")
    if cheDo == "ca_nuoc":
        bb = set(danh_sach(BAC_BO))
        chay((t for t in danh_sach(VN) if t not in bb), "Phần còn lại của Việt Nam")
