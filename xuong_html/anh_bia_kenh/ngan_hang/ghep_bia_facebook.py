"""Nền ảnh bìa Facebook (1640×624) của kênh Ngân hàng, cắt từ nền YouTube trong thư mục này, cùng cách cắt với ../ghep_bia_facebook.py.

Chạy: python3 ngan_hang/ghep_nen.py && python3 ngan_hang/ghep_bia_facebook.py   (ra ngan_hang/nen_facebook_1640x624.png)
"""
from pathlib import Path

from PIL import Image

W, H = 1640, 624
Y0 = 720 - round(H / 0.64 / 2)

ra = Path(__file__).with_name("nen_facebook_1640x624.png")
im = Image.open(Path(__file__).with_name("nen_2560x1440.png")).convert("RGB")
im.crop((0, Y0, 2560, Y0 + round(H / 0.64))).resize((W, H), Image.LANCZOS).save(ra)
print("đã ghi", ra)
