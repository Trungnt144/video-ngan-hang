"""Mô phỏng ảnh bìa Trang Facebook trên app điện thoại (iPhone, đo từ ảnh chụp màn hình Trung gửi 29/10/2026) để kiểm chữ bị che.

Chạy: python3 mo_phong_facebook.py <ảnh bìa 1640×624.jpg> <ảnh đại diện.jpg> <ra.jpg> ["Tên Trang"]   (tên mặc định "Chuyện nghề Điện")

App hiện ảnh bìa gần như 1:1 so với ảnh 1640×624 (hệ số 0,995), bám mép trên, cắt hai bên: thấy x từ 354 đến 1274 và y từ 0 đến khoảng 560,
phần dưới bị tờ nền trắng bo góc phủ từ y=560. Che trên ảnh bìa:
- thanh trạng thái và đảo động (Dynamic Island) tới y≈115, lớp tối mờ từ mép trên tới y≈330 làm chữ trắng xỉn đi;
- nút quay lại (x 55, y 200), chia sẻ (x 655), tìm kiếm (x 750), thêm (x 850) trên ảnh chụp, tức x 409, 1009, 1104, 1204 trên ảnh bìa;
- ảnh đại diện hình tròn đè giữa: tâm (460, 497), đường kính khoảng 390 kể cả viền trắng, tức che x 619–1009 trên ảnh bìa từ y=303 trở xuống.
Vùng còn dùng được cho chữ: x 440–975, y 120–300 của ảnh bìa (không tính lớp tối mờ).
"""
import sys

from PIL import Image, ImageDraw, ImageFont

W = 920
X0, S = 354, 0.995          # vị trí cắt trên ảnh bìa và hệ số phóng của app
SHEET_Y = 560               # tờ nền trắng bắt đầu từ đây
AV_C, AV_R, RING = (460, 497), 188, 9

cover = Image.open(sys.argv[1]).convert("RGB")
av = Image.open(sys.argv[2]).convert("RGB")
H = 1000
img = Image.new("RGB", (W, H), "#ffffff")
vung = cover.crop((X0, 0, X0 + round(W / S), round(SHEET_Y / S) + 60)).resize((W, SHEET_Y + 60), Image.LANCZOS)
img.paste(vung, (0, 0))

# lớp tối mờ phía trên (thanh trạng thái, nút)
scrim = Image.new("L", (W, SHEET_Y), 0)
d = ImageDraw.Draw(scrim)
for y in range(330):
    d.line((0, y, W, y), fill=round(150 * (1 - y / 330) ** 1.3))
img.paste(Image.new("RGB", (W, SHEET_Y), "#000000"), (0, 0), scrim)

d = ImageDraw.Draw(img)
ft = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 38)
d.text((97, 54), "00:08", fill="#ffffff", font=ft)
d.rounded_rectangle((778, 56, 832, 92), 10, fill="#ffffff")
for cx in (655, 750, 850):                                  # nút chia sẻ, tìm kiếm, thêm
    d.ellipse((cx - 27, 173, cx + 27, 227), outline="#ffffff", width=5)
d.line((70, 182, 50, 202, 70, 222), fill="#ffffff", width=6)   # mũi tên quay lại

# tờ nền trắng bo góc
d.rounded_rectangle((0, SHEET_Y, W, H + 100), 56, fill="#ffffff")
# ảnh đại diện tròn có viền trắng
cx, cy = AV_C
d.ellipse((cx - AV_R - RING, cy - AV_R - RING, cx + AV_R + RING, cy + AV_R + RING), fill="#ffffff")
m = Image.new("L", (AV_R * 8, AV_R * 8), 0)
ImageDraw.Draw(m).ellipse((0, 0, AV_R * 8 - 1, AV_R * 8 - 1), fill=255)
m = m.resize((AV_R * 2, AV_R * 2), Image.LANCZOS)
img.paste(av.resize((AV_R * 2, AV_R * 2), Image.LANCZOS), (cx - AV_R, cy - AV_R), m)
d.text((220, 715), sys.argv[4] if len(sys.argv) > 4 else "Chuyện nghề Điện", fill="#111111", font=ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 54))
img.crop((0, 0, W, 800)).save(sys.argv[3], quality=92)
print("đã ghi", sys.argv[3])
