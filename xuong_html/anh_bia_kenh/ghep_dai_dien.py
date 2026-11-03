"""Ghép nền ảnh đại diện kênh YouTube (800×800) từ ảnh thật: cùng ảnh nền và cách chỉnh màu với ảnh bìa (ghep_nen.py).

Chạy: python3 ghep_dai_dien.py [ra.png]   (mặc định nen_dai_dien_800.png cạnh file này)
Ảnh đại diện hiện thành hình tròn ở 98 px (trang kênh), 48 px (bình luận), 36 px: vật chính phải nằm trong vòng tròn nội tiếp
và đơn giản; tia sét vàng đặt giữa bằng khuon_dai_dien.html.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

import ghep_nen as g

N = 800
ANH = g.ANH / "px_cot_dien_mat_troi_lan.jpg"
# vùng cắt vuông trên ảnh gốc (3840×2561): cạnh 2250 điểm ảnh, mặt trời (0,42; 0,775) rơi gần giữa khung, hai cột điện hai bên
CANH, X0, Y0 = 2250, 800, 311


def lap():
    im = Image.open(ANH).convert("RGB").crop((X0, Y0, X0 + CANH, Y0 + CANH)).resize((N, N), Image.LANCZOS)
    a = g.chinh_mau(np.asarray(im, float), do_sang=0.44, tuoi=1.30)
    yy, xx = np.mgrid[0:N, 0:N].astype(float)
    r = np.hypot(xx - N / 2, yy - N / 2) / (N / 2)
    # quầng nắng sau tia sét, tối dần ra mép vòng tròn
    nang = np.exp(-(r / 0.55) ** 2)
    a = a + nang[..., None] * np.array([255, 226, 150], float) * 0.38
    v = g.smooth((r - 0.62) / 0.5)
    a = a * (1 - 0.55 * v[..., None]) + g.TOI * 0.55 * v[..., None]
    sang = np.clip(a - 205, 0, None)
    hao = np.asarray(Image.fromarray(np.clip(sang * 3, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(18)), float) / 3
    return np.clip(a + hao * 0.5, 0, 255).astype(np.uint8)


if __name__ == "__main__":
    ra = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name("nen_dai_dien_800.png")
    Image.fromarray(lap()).save(ra)
    print("đã ghi", ra)
