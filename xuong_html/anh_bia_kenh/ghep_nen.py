"""Ghép nền ảnh bìa kênh YouTube từ ảnh thật: ảnh đường dây truyền tải làm nền cả khung, sáu ảnh nhà máy xếp ba tấm mỗi bên,
mép nghiêng hoà mờ vào nhau, cân cùng mặt bằng sáng, giữ màu gốc từng ảnh. Khoảng giữa để trống cho tên kênh.

Chạy: python3 ghep_nen.py [ra.png]   (mặc định nen_2560x1440.png cạnh file này)
Khổ 2560×1440 (khổ YouTube khuyến nghị). Vùng an toàn mọi thiết bị: 1546×423 ở giữa (x 507–2053, y 508–931).
Máy tính chỉ thấy dải 2560×423 ở giữa; TV thấy cả khung. Ảnh để ở tai_san/anh_that/ (ghi nguồn ở so_anh.md).
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

W, H = 2560, 1440
GOC = Path(__file__).resolve().parents[2]
ANH = GOC / "tai_san" / "anh_that"
K = 0.33            # độ nghiêng mép ảnh: lệch ngang K điểm ảnh cho mỗi điểm ảnh theo chiều dọc (tính quanh y=720)
F = 70              # bề rộng vùng hoà mờ giữa hai ảnh

# Nền: ảnh truyền tải đặt cho mặt trời rơi vào (sx, sy); s là tỉ lệ phóng ảnh gốc
NEN = dict(f="px_cot_dien_mat_troi_lan.jpg", s=0.80, mt=(0.42, 0.775), sx=1280, sy=870)

# Sáu tấm nhà máy. b0, b1: biên trái, phải tại y=720 (điểm giữa vùng hoà mờ); fx, fy: điểm trên ảnh gốc (0–1) đặt vào tâm tấm; hh: chiều cao ảnh khi vẽ
# Tấm trái vẽ từ ngoài vào, tấm phải vẽ từ ngoài vào: tấm vẽ sau chỉ hoà mờ ở mép phía trong nền / phía tấm bên cạnh.
TRAI = [
    dict(f="px_tau_lng_bon_cau_hoang_hon.jpg",           b0=None, b1=330,  fx=0.27, fy=0.50, hh=640),
    dict(f="px_nha_may_nhiet_dien_thap_lam_mat.jpg",     b0=330,  b1=640,  fx=0.55, fy=0.50, hh=640),
    dict(f="px_dien_hat_nhan_thap_lam_mat.jpg",          b0=640,  b1=960,  fx=0.73, fy=0.46, hh=600),
]
PHAI = [   # liệt kê từ ngoài vào trong: tấm cuối cùng nằm sát khoảng giữa
    dict(f="px_thuy_dien_meo_vac_xa_lu.jpg",             b0=2235, b1=None, fx=0.58, fy=0.50, hh=640),
    dict(f="px_ninh_thuan_nha_may_pv.jpg",               b0=1910, b1=2235, fx=0.55, fy=0.55, hh=700),
    dict(f="px_tuabin_dong_lua_vn.jpg",                  b0=1600, b1=1910, fx=0.48, fy=0.34, hh=800),
]

# Chỉnh màu (28/10/2026, Trung chê bản ánh xạ xanh phủ hết màu ảnh gốc): giữ nguyên màu từng ảnh, chỉ cân độ sáng, tăng độ tươi
# và pha một chút xanh chàm vào vùng tối để bảy ảnh cùng một mặt bằng sáng, không thay màu.
DO_SANG = 0.50                          # độ sáng trung bình mục tiêu của mỗi ảnh (0–1)
BONG = np.array([0.06, 0.12, 0.26])     # màu pha vào vùng tối
TOI = np.array([14, 24, 46], float)     # màu của vùng tối nhất (viền khung, sàn): xanh chàm rất đậm, gần trung tính

YY, XX = np.mgrid[0:H, 0:W].astype(float)


def smooth(t):
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def chinh_mau(a, do_sang=DO_SANG, tuoi=1.0):
    """a: mảng float 0–255 (h, w, 3), vùng ngoài ảnh là 0. Cân độ sáng về do_sang, đường cong chữ S nhẹ, tăng độ tươi, pha bóng chàm."""
    x = a / 255.0
    L = x[..., 0] * 0.299 + x[..., 1] * 0.587 + x[..., 2] * 0.114
    co = L > 0.004
    tb = float(L[co].mean()) if co.any() else do_sang
    g = np.clip(np.log(do_sang) / np.log(max(tb, 0.05)), 0.7, 1.35)      # gamma đưa độ sáng trung bình về mục tiêu
    x = np.clip(x, 0, 1) ** g
    x = x + 0.22 * (smooth(x) - x)                                       # đường cong chữ S nhẹ
    L = x[..., 0] * 0.299 + x[..., 1] * 0.587 + x[..., 2] * 0.114
    bao_hoa = (x.max(-1) - x.min(-1))[..., None]
    x = L[..., None] + (x - L[..., None]) * (1.10 + 0.40 * (1 - bao_hoa)) * tuoi  # tăng độ tươi, ưu tiên màu còn nhạt
    x = x + (BONG - x) * (0.14 * (1 - smooth(L / 0.55)))[..., None]      # pha chàm vào vùng tối
    return np.clip(x * 255, 0, 255)


def dat_anh(f, hh, diem_goc, vi_tri, do_sang=DO_SANG, tuoi=1.0):
    """Vẽ ảnh cao hh điểm ảnh sao cho điểm diem_goc=(fx, fy) của ảnh rơi vào vi_tri=(x, y); phần khung ngoài ảnh nối bằng hàng mép nhoè.
    Trả về mảng (H, W, 3) và mặt nạ phủ ngang (1 nơi ảnh phủ tới)."""
    im = Image.open(ANH / f).convert("RGB")
    s = hh / im.height
    im = im.resize((round(im.width * s), hh), Image.LANCZOS)
    ox, oy = round(vi_tri[0] - diem_goc[0] * im.width), round(vi_tri[1] - diem_goc[1] * im.height)
    x0, x1 = max(ox, 0), min(ox + im.width, W)
    if x1 <= x0:
        raise SystemExit(f"{f}: ảnh nằm ngoài khung")
    a = np.asarray(im, float)[:, x0 - ox:x1 - ox]
    # cắt phần thừa theo chiều dọc rồi nối thêm hàng mép nếu thiếu
    if oy < 0:
        a = a[-oy:]
    if oy + im.height > H:
        a = a[:H - max(oy, 0)]
    tren = np.repeat(a[:10].mean(0, keepdims=True), max(oy, 0), axis=0)
    duoi = np.repeat(a[-10:].mean(0, keepdims=True), max(H - max(oy, 0) - len(a), 0), axis=0)
    dai = np.concatenate([tren, a, duoi], 0)
    nhoe = np.asarray(Image.fromarray(dai.astype(np.uint8)).filter(ImageFilter.GaussianBlur(40)), float)
    d = np.minimum(np.abs(np.arange(H)[:, None] - max(oy, 0)), np.abs(np.arange(H)[:, None] - (max(oy, 0) + len(a)))).astype(float)
    ngoai = (np.arange(H)[:, None] < max(oy, 0)) | (np.arange(H)[:, None] >= max(oy, 0) + len(a))
    mo = np.where(ngoai, 1.0, 1 - smooth(d / 100))
    dai = dai * (1 - mo[..., None]) + nhoe * mo[..., None]
    cv = np.zeros((H, W, 3), float)
    cv[:, x0:x1] = dai
    ma = np.zeros((H, W))
    ma[:, x0:x1] = 1
    return chinh_mau(cv, do_sang, tuoi), ma


def ve_nen():
    t = NEN
    cv, _ = dat_anh(t["f"], round(Image.open(ANH / t["f"]).height * t["s"]), t["mt"], (t["sx"], t["sy"]), do_sang=0.40, tuoi=1.35)
    return cv * 0.85


def ve_tam(nen, t, vao_trong):
    """vao_trong: 'phai' nếu tấm là tấm trong cùng bên trái (mép phải hoà mờ lên nền), 'ngoai' nếu còn tấm kế bên đè lên mép phải."""
    b0, b1 = t["b0"], t["b1"]
    cx = ((b0 if b0 is not None else 0) + (b1 if b1 is not None else W)) / 2
    cv, ma = dat_anh(t["f"], t["hh"], (t["fx"], t["fy"]), (cx, 720 + t.get("dy", 0)))
    dx = (YY - 720) * K
    a = np.ones((H, W))
    x = XX - dx
    if b0 is not None:        # mép trái: luôn hoà mờ (lên nền hoặc lên tấm bên cạnh)
        a *= smooth((x - (b0 - F / 2)) / F)
    if b1 is not None:        # mép phải
        if vao_trong == "phai":
            a *= 1 - smooth((x - (b1 - F / 2)) / F)       # tấm trái trong cùng: mờ dần lên nền
        else:
            a *= 1 - smooth((x - (b1 + F)) / 3)             # cắt cứng ở chỗ tấm kế bên đã đặc hẳn
    # tấm phải vẽ từ ngoài vào: mép phải hoà mờ lên tấm ngoài vừa vẽ; mép trái của tấm trong cùng hoà mờ lên nền
    a *= smooth((YY - 260) / 280) * smooth((1150 - YY) / 260)
    a *= ma
    return nen * (1 - a[..., None]) + cv * a[..., None]


def lap():
    nen = ve_nen()
    for i, t in enumerate(TRAI):
        nen = ve_tam(nen, t, "phai" if i == len(TRAI) - 1 else "ngoai")
    # tấm phải: vẽ từ ngoài vào, mép phải hoà mờ lên tấm vừa vẽ, trừ tấm ngoài cùng
    for i, t in enumerate(PHAI):
        nen = ve_tam_phai(nen, t, ngoai_cung=(i == 0), trong_cung=(i == len(PHAI) - 1))
    return nen


def ve_tam_phai(nen, t, ngoai_cung, trong_cung):
    b0, b1 = t["b0"], t["b1"]
    cx = ((b0 if b0 is not None else 0) + (b1 if b1 is not None else W)) / 2
    cv, ma = dat_anh(t["f"], t["hh"], (t["fx"], t["fy"]), (cx, 720 + t.get("dy", 0)))
    x = XX - (YY - 720) * K
    a = np.ones((H, W))
    if b1 is not None:                       # mép phải: hoà mờ lên tấm vẽ trước
        a *= 1 - smooth((x - (b1 - F / 2)) / F)
    if trong_cung:                           # mép trái của tấm trong cùng: hoà mờ lên nền
        a *= smooth((x - (b0 - F / 2)) / F)
    elif b0 is not None:                     # tấm giữa: cắt cứng ở chỗ tấm trong cùng đã đặc hẳn
        a *= smooth((x - (b0 - F)) / 3)
    a *= smooth((YY - 260) / 280) * smooth((1150 - YY) / 260)
    a *= ma
    return nen * (1 - a[..., None]) + cv * a[..., None]


def phan_chieu(nen, ym=935, n=470):
    """Sàn bóng dưới dải chính: ảnh lật dọc, nhoè nhẹ, mờ dần. Chỉ thấy ở khung đầy đủ (TV), không ảnh hưởng dải máy tính và điện thoại."""
    guong = nen[ym - n:ym][::-1]
    guong = np.asarray(Image.fromarray(np.clip(guong, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(7)), float)
    k = ((1 - np.arange(n) / n) ** 1.6 * 0.42)[:, None, None]
    nen = nen.copy()
    nen[ym:ym + n] = nen[ym:ym + n] * (1 - k) + guong * k
    return nen


def duong_sang():
    """Đường sáng mảnh dọc các mép ghép giữa các tấm ảnh, nghiêng theo mép; trả về (h, w) giá trị 0–1."""
    bien = [t["b1"] for t in TRAI] + [t["b0"] for t in PHAI]
    x = XX - (YY - 720) * K
    d = np.min([np.abs(x - b) for b in bien], axis=0)
    loi = np.exp(-(d / 1.6) ** 2)
    quang = 0.30 * np.exp(-(d / 16.0) ** 2)
    doc = smooth((YY - 240) / 260) * smooth((1200 - YY) / 260)
    return np.clip(loi + quang, 0, 1) * doc


def hoan_thien(nen):
    nen = phan_chieu(nen)
    # toả sáng: vùng sáng nhoè rộng cộng thêm
    sang = np.clip(nen - 205, 0, None)
    hao = np.asarray(Image.fromarray(np.clip(sang * 3, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(36)), float) / 3
    nen = nen + hao * 0.55
    # tối viền nhẹ
    vx = 0.38 * smooth((np.abs(XX - W / 2) - 950) / 380)
    vy = 0.62 * smooth((np.abs(YY - 720) - 300) / 460)
    v = 1 - (1 - vx) * (1 - vy)
    nen = nen * (1 - v[..., None]) + TOI * v[..., None]
    # đường sáng ở mép ghép (cộng sáng, trắng hơi ấm)
    nen = nen + duong_sang()[..., None] * np.array([255, 248, 232], float) * 0.55
    # nắng ấm ở chân trời giữa khung: điểm hy vọng, hợp màu tia sét vàng của kênh
    r = np.hypot(XX - 1280, (YY - 885) * 1.25)
    nang = 0.55 * np.exp(-(r / 230) ** 2) + 0.55 * np.exp(-(r / 55) ** 2)
    nen = nen + nang[..., None] * np.array([255, 232, 170], float) * 0.6
    return np.clip(nen, 0, 255).astype(np.uint8)


if __name__ == "__main__":
    ra = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("nen_2560x1440.png")
    out = Image.fromarray(hoan_thien(lap()))
    out = out.filter(ImageFilter.UnsharpMask(radius=1.6, percent=40, threshold=2))
    out.save(ra)
    print("đã ghi", ra, out.size)
