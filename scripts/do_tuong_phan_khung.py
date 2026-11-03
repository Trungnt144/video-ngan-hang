# do_tuong_phan_khung.py — đo độ tương phản giữa vật chính và nền ngay trên khung cắt từ mp4 (hoặc ảnh still).
# Lý do: bộ kiểm bảng màu (kiem_tuong_phan_bang_mau.py) chỉ đo các cặp màu khai trong bảng; video hiệu ứng che gió
# (26/10/2026) dùng vỏ trắng làm vật chính trên nền kem, chỉ đạt 1,13:1 mà không bộ kiểm nào bắt được.
# Chạy:
#   python3 scripts/do_tuong_phan_khung.py <ảnh.jpg> <x,y vật>:<x,y nền> [<x,y vật>:<x,y nền> ...]
# Toạ độ tính theo điểm ảnh của chính ảnh đưa vào (ảnh soát 1920×1080 hoặc ảnh thu nhỏ đều được).
# Mỗi điểm lấy trung bình ô 5×5. Ngưỡng thẻ D-09b: vật chính trên nền ≥ 3:1 (chữ ≥ 7:1 kiểm riêng bằng bộ kiểm bảng màu).
import sys
from PIL import Image

NGUONG = 3.0


def do_sang(rgb):
    def kenh(c):
        c = c / 255
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (kenh(c) for c in rgb)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def mau_tai(anh, x, y):
    w, h = anh.size
    o = [anh.getpixel((min(w - 1, max(0, x + i)), min(h - 1, max(0, y + j)))) for i in range(-2, 3) for j in range(-2, 3)]
    return tuple(sum(p[k] for p in o) / len(o) for k in range(3))


anh = Image.open(sys.argv[1]).convert("RGB")
dat = True
for cap in sys.argv[2:]:
    a, b = cap.split(":")
    va, vb = (tuple(int(v) for v in s.split(",")) for s in (a, b))
    ma, mb = mau_tai(anh, *va), mau_tai(anh, *vb)
    la, lb = sorted([do_sang(ma), do_sang(mb)])
    ti = (lb + 0.05) / (la + 0.05)
    ok = ti >= NGUONG
    dat &= ok
    hx = lambda m: "#%02X%02X%02X" % tuple(round(v) for v in m)
    print(f"vật {va} {hx(ma)}  nền {vb} {hx(mb)}  tương phản {ti:.2f}:1  {'đạt' if ok else 'KHÔNG ĐẠT'}")
sys.exit(0 if dat else 1)
