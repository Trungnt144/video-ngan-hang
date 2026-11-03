"""Ghép nền ảnh bìa kênh "Chuyện nghề Ngân hàng" (29/10/2026): trụ sở Ngân hàng Nhà nước làm nền giữa khung, sáu toà trụ sở
ngân hàng thương mại xếp ba tấm mỗi bên (trái: Vietcombank, BIDV, Agribank; phải: MB, Techcombank, VPBank), cùng cách ghép
và chỉnh màu với ảnh bìa kênh Điện (../ghep_nen.py: mép nghiêng hoà mờ, cân độ sáng, giữ màu gốc). Trung chốt qua bảng chọn
29/10/2026: giữ nguyên logo trên mặt toà, dùng cả ảnh CC BY-SA kèm ghi công.

Chạy: python3 ngan_hang/ghep_nen.py   (trong xuong_html/anh_bia_kenh/; ra ngan_hang/nen_2560x1440.png)
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import ghep_nen as g  # noqa: E402  dùng lại hàm ghép của ảnh bìa kênh Điện, thay bộ ảnh bằng biến toàn cục

g.NEN = dict(f="nh_ngan_hang_nha_nuoc_pd.jpg", s=0.62, mt=(0.636, 0.55), sx=1280, sy=1150, troi=0.20)   # troi: phần trên ảnh gốc (tỉ lệ chiều cao) thay bằng trời dải màu
g.TRAI = [
    dict(f="nh_vietcombank_tru_so_trung_gui.jpg", b0=None, b1=330,  fx=0.685, fy=0.625, hh=690, dy=-20),
    dict(f="tg_thap_bidv_hoang_hon.jpg",         b0=330,  b1=640,  fx=0.53, fy=0.36, hh=1500, dy=168),
    dict(f="nh_agribank_tru_so_chinh_trung_gui.jpg", b0=640,  b1=960,  fx=0.59, fy=0.68, hh=560, dy=-20),
]
g.PHAI = [   # từ ngoài vào trong
    dict(f="px_thap_vpbank_lang_ha_dem.jpg",     b0=2235, b1=None, fx=0.40, fy=0.20, hh=1620, dy=190),
    dict(f="nh_techcombank_quang_trung_doc.jpg", b0=1910, b1=2235, fx=0.76, fy=0.20, hh=1560, dy=76),
    dict(f="tg_mb_grand_tower.jpg",              b0=1600, b1=1910, fx=0.47, fy=0.24, hh=1380, dy=153),
]
W, H, XX, YY, smooth = g.W, g.H, g.XX, g.YY, g.smooth


TROI = (np.array([22, 70, 140], float), np.array([150, 200, 236], float))   # màu trời ở đỉnh khung và ở chân trời (y=1050)


def ve_nen():
    """Trời xanh dải màu phủ cả khung, toà Ngân hàng Nhà nước đặt giữa, mép trái phải hoà mờ vào trời."""
    t = g.NEN
    k = smooth(YY / 1050)[..., None]
    troi = TROI[0] * (1 - k) + TROI[1] * k
    im = Image.open(g.ANH / t["f"]).convert("RGB")
    im = im.resize((round(im.width * t["s"]), round(im.height * t["s"])), Image.LANCZOS)
    ox, oy = round(t["sx"] - t["mt"][0] * im.width), round(t["sy"] - t["mt"][1] * im.height)
    cv = np.zeros((H, W, 3))
    ma = np.zeros((H, W))
    x0, x1, y0, y1 = max(ox, 0), min(ox + im.width, W), max(oy, 0), min(oy + im.height, H)
    cv[y0:y1, x0:x1] = np.asarray(im, float)[y0 - oy:y1 - oy, x0 - ox:x1 - ox]
    xr = np.arange(W)[None, :] - ox
    ma[y0:y1, x0:x1] = 1
    ma *= smooth(xr / 160) * smooth((im.width - xr) / 160)                       # hoà mờ hai mép trái, phải
    ma *= smooth((YY - (oy + t["troi"] * im.height)) / 140)                       # bỏ phần trời của ảnh gốc, giữ từ mái trở xuống
    cv = g.chinh_mau(cv, do_sang=0.50, tuoi=1.15)
    return troi * (1 - ma[..., None]) + cv * ma[..., None]


def hoan_thien(nen):
    """Như ảnh bìa kênh Điện nhưng bỏ nắng chân trời; thay bằng quầng sáng xanh ngọc nhạt sau chữ."""
    nen = g.phan_chieu(nen)
    sang = np.clip(nen - 205, 0, None)
    hao = np.asarray(Image.fromarray(np.clip(sang * 3, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(36)), float) / 3
    nen = nen + hao * 0.5
    vx = 0.38 * smooth((np.abs(XX - W / 2) - 950) / 380)
    vy = 0.62 * smooth((np.abs(YY - 720) - 300) / 460)
    v = 1 - (1 - vx) * (1 - vy)
    nen = nen * (1 - v[..., None]) + g.TOI * v[..., None]
    nen = nen + g.duong_sang()[..., None] * np.array([255, 252, 236], float) * 0.55
    return np.clip(nen, 0, 255).astype(np.uint8)


if __name__ == "__main__":
    ra = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("nen_2560x1440.png")
    g.ve_nen = ve_nen
    out = Image.fromarray(hoan_thien(g.lap())).filter(ImageFilter.UnsharpMask(radius=1.6, percent=40, threshold=2))
    out.save(ra)
    print("đã ghi", ra, out.size)
