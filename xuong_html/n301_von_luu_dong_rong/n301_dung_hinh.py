# N199: so khung liên tiếp (10 khung/giây) của thư mục do n199_dung_hinh.mjs chụp, báo đoạn đứng hình theo cách của freezedetect (n=-60dB, d=1,5 giây).
# Dùng: python3 -I n199_dung_hinh.py <thư mục>
import sys, glob
from PIL import Image, ImageChops, ImageStat
fs = sorted(glob.glob(sys.argv[1].rstrip('/') + '/k*.jpg'))
prev, run0, runs, dif = None, None, [], []
for i, f in enumerate(fs):
    im = Image.open(f).convert('L')
    if prev is not None:
        d = ImageStat.Stat(ImageChops.difference(im, prev)).mean[0] / 255
        dif.append(d)
        if d <= 0.001:
            if run0 is None: run0 = i - 1
        else:
            if run0 is not None: runs.append((run0, i - 1)); run0 = None
    prev = im
if run0 is not None: runs.append((run0, len(fs) - 1))
dai = [(a / 10, b / 10) for a, b in runs if (b - a) / 10 >= 1.5]
print(f"{len(fs)} khung, độ lệch trung bình nhỏ nhất {min(dif):.5f} (ngưỡng 0,001), trung vị {sorted(dif)[len(dif)//2]:.5f}")
print("đoạn dưới ngưỡng:", [(a / 10, b / 10) for a, b in runs][:20])
print("đoạn đứng hình từ 1,5 giây:", dai if dai else "không có (0 đoạn)")
