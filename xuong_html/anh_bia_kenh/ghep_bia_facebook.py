"""Nền ảnh bìa Facebook (1640×624, tỉ lệ 2,63:1) cắt từ nền ảnh bìa YouTube (nen_2560x1440.png) để hai ảnh cùng một bộ ảnh và cách chỉnh màu.

Chạy: python3 ghep_nen.py && python3 ghep_bia_facebook.py   (ra nen_facebook_1640x624.png cạnh file này)
Cắt dải rộng 2560 và cao 975 quanh y=720 (hai đầu dải là phần ảnh nhà máy mờ dần vào trời và sàn), thu về 1640×624 (hệ số 0,64):
bảy ảnh giữ nguyên thứ tự và tỉ lệ so với bản YouTube. Chữ phủ bằng khuon_bia.html?kho=facebook (xuat_bia.mjs --facebook).
Facebook hiện ảnh bìa Trang 820×312 trên máy tính (nên tải 1640×624), 640×360 trên điện thoại: điện thoại cắt hai bên, chỉ giữ khoảng giữa
rộng 1109 của ảnh 1640 (từ x 265 đến 1374).
"""
from pathlib import Path

from PIL import Image

W, H = 1640, 624
Y0 = 720 - round(H / 0.64 / 2)          # 975 điểm ảnh nguồn quanh y=720

ra = Path(__file__).with_name("nen_facebook_1640x624.png")
im = Image.open(Path(__file__).with_name("nen_2560x1440.png")).convert("RGB")
im.crop((0, Y0, 2560, Y0 + round(H / 0.64))).resize((W, H), Image.LANCZOS).save(ra)
print("đã ghi", ra)
