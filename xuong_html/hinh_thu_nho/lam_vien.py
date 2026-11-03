"""Làm gọn viền và làm nét ảnh người, vật đã tách nền bằng tach_nen.swift, trước khi ghép lên hình thu nhỏ (trường "phu_anh").

  python3 lam_vien.py <ảnh gốc .jpg> <ảnh tách nền .png> <ảnh ra .png> [--co 0.45] [--net 0.6] [--nen_sang 228 [--vung x0,y0,x1,y1]]

Mặt nạ của Vision có mép mềm rộng, và điểm ảnh ở mép còn lẫn màu nền cũ (trời sáng thành viền trắng mờ khi ghép lên nền khác).
Công cụ:
1. lấy màu từ ảnh gốc (định vị ảnh tách nền trong ảnh gốc bằng so khớp mẫu), không dùng màu đã nhân độ đục của Vision;
2. thu hẹp dải mép mềm quanh ngưỡng --co (0–1, cao hơn thì viền ăn vào trong nhiều hơn), rồi khử răng cưa 1 điểm ảnh;
3. thay màu ở vùng mép bằng màu loang ra từ phần đặc bên trong, xoá màu nền cũ dính ở mép và ở các sợi tóc;
4. làm nét toàn bộ bằng mặt nạ làm nét, độ mạnh --net.
Tuỳ chọn --nen_sang N: ảnh chụp trên phông trắng, Vision hay giữ lại mảng phông lọt vào kẽ (giữa bàn tay và đầu, dưới cằm);
bỏ các mảng điểm ảnh có cả ba kênh màu từ N trở lên, mảng nào rộng từ 40 điểm ảnh (vệt sáng nhỏ trên áo, trên da được giữ).
--vung giới hạn việc bỏ phông trong một khung (tỉ lệ 0–1 theo bề rộng, bề cao ảnh tách nền), ví dụ 0,0,1,0.36 chỉ xét vùng đầu và tay, để áo sáng màu không bị khoét.
Ảnh ra cùng cỡ ảnh tách nền, ghi đè lên chỗ cũ được (giữ bản cũ nếu cần so).
"""
import sys

import cv2
import numpy as np

doi, tuy, ds = [], {}, sys.argv[1:]
while ds:
    x = ds.pop(0)
    if x.startswith('--'):
        tuy[x] = ds.pop(0)
    else:
        doi.append(x)
if len(doi) != 3:
    sys.exit(__doc__)
co = float(tuy.get('--co', 0.45))
net = float(tuy.get('--net', 0.6))

goc = cv2.imread(doi[0], cv2.IMREAD_COLOR)
tach = cv2.imread(doi[1], cv2.IMREAD_UNCHANGED)
if goc is None or tach is None or tach.shape[2] != 4:
    sys.exit('Không đọc được ảnh gốc hoặc ảnh tách nền (cần PNG có kênh trong suốt)')

# 1. định vị: so khớp một mảng đặc ở giữa ảnh tách nền với ảnh gốc
a = tach[:, :, 3].astype(np.float32) / 255
h, w = a.shape
ys, xs = np.where(a > 0.99)
cy, cx = int(np.median(ys)), int(np.median(xs))
r = min(120, cy, cx, h - cy - 1, w - cx - 1)
mau = tach[cy - r:cy + r, cx - r:cx + r, :3]
kq = cv2.matchTemplate(goc, mau, cv2.TM_SQDIFF_NORMED)
_, _, (mx, my), _ = cv2.minMaxLoc(kq)
ox, oy = mx - (cx - r), my - (cy - r)
if ox < 0 or oy < 0 or ox + w > goc.shape[1] or oy + h > goc.shape[0]:
    sys.exit(f'Không định vị được ảnh tách nền trong ảnh gốc (lệch {ox},{oy})')
rgb = goc[oy:oy + h, ox:ox + w].astype(np.float32)

if '--nen_sang' in tuy:
    sang = (rgb.min(2) >= float(tuy['--nen_sang'])).astype(np.uint8)
    if '--vung' in tuy:
        x0, y0, x1, y1 = [float(v) for v in tuy['--vung'].split(',')]
        khung = np.zeros_like(sang)
        khung[int(y0 * h):int(y1 * h), int(x0 * w):int(x1 * w)] = 1
        sang *= khung
    n, nhan, tk, _ = cv2.connectedComponentsWithStats(sang, 8)
    bo = np.isin(nhan, [i for i in range(1, n) if tk[i, cv2.CC_STAT_AREA] >= 40])
    bo = cv2.dilate(bo.astype(np.uint8), np.ones((3, 3), np.uint8)) > 0
    a = np.where(bo, 0, a)

# 2. thu hẹp mép mềm quanh ngưỡng co, khử răng cưa
t = np.clip((a - (co - 0.15)) / 0.3, 0, 1)
a2 = t * t * (3 - 2 * t)
a2 = cv2.GaussianBlur(a2, (0, 0), 1.2)

# 3. loang màu phần đặc ra vùng mép
dac = (a > 0.98).astype(np.float32)
dac = cv2.erode(dac, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
loang = np.zeros_like(rgb)
for s in (3, 8, 20):
    m = cv2.GaussianBlur(dac, (0, 0), s)[..., None]
    c = cv2.GaussianBlur(rgb * dac[..., None], (0, 0), s) / np.maximum(m, 1e-4)
    loang = np.where((loang.sum(2, keepdims=True) == 0) & (m > 0.02), c, loang)
mep = ((a2 > 0) & (a2 < 0.995) & (dac == 0))[..., None]
rgb = np.where(mep & (loang.sum(2, keepdims=True) > 0), loang, rgb)

# 4. làm nét
mo = cv2.GaussianBlur(rgb, (0, 0), 1.6)
rgb = np.clip(rgb + net * (rgb - mo), 0, 255)

ra = np.dstack([rgb, a2[..., None] * 255]).round().astype(np.uint8)
cv2.imwrite(doi[2], ra)
print(f'{doi[2]} · {w}×{h} · vị trí trong ảnh gốc ({ox}, {oy}) · ngưỡng mép {co} · làm nét {net}')
