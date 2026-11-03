# so_khung.py — so từng cặp ảnh cùng cỡ, in số điểm ảnh lệch rõ (một kênh màu chênh quá ngưỡng).
# Trình chạy pha máy dùng để biết một chương có đổi hình hay không: khung mẫu kết xuất bằng mã mới
# so với khung cùng số trong bộ đệm chương. PSNR trung bình cả khung bỏ sót đổi nhỏ (đổi màu một nhãn
# 200×40 điểm ảnh vẫn trên 37 dB), nên đếm điểm ảnh lệch thay vì lấy trung bình.
#
# Chạy: .venv_vieneu/bin/python scripts/pha_may/so_khung.py [--nguong 24] <ảnh a> <ảnh b> [<ảnh a> <ảnh b> ...]
# In mỗi cặp một dòng: "<số điểm lệch> <ảnh a>". Ảnh khác cỡ hoặc thiếu file in -1.
import argparse, os
import numpy as np
from PIL import Image

p = argparse.ArgumentParser()
p.add_argument("--nguong", type=int, default=24, help="chênh tối thiểu của một kênh (0-255) để tính là lệch")
p.add_argument("anh", nargs="+")
a = p.parse_args()
for x, y in zip(a.anh[0::2], a.anh[1::2]):
    if not (os.path.isfile(x) and os.path.isfile(y)):
        print(-1, x)
        continue
    u = np.asarray(Image.open(x).convert("RGB"), np.int16)
    v = np.asarray(Image.open(y).convert("RGB"), np.int16)
    if u.shape != v.shape:
        print(-1, x)
        continue
    print(int((np.abs(u - v).max(axis=2) > a.nguong).sum()), x)
