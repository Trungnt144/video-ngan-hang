"""Vẽ biểu tượng ứng dụng "Media Project" (1024×1024 PNG), cùng Bộ màu 7 của trang bảng theo dõi video
(màu MB: nền trắng, viền xanh #141ED2, nhấn đỏ #EB2D4B; Trung chọn 02/11/2026).

Cách dùng: python3 ve_bieu_tuong.py <file_ra.png>
Hình: ô vuông bo góc theo khuôn biểu tượng macOS, nền trắng, viền xanh MB, dải đỏ MB ở cạnh dưới (giống đầu trang);
bên trong ba hàng, mỗi hàng một vạch màu (xanh, đỏ, xanh), một ô hình có nút phát và hai dòng chữ.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

N = 1024
SS = 2  # vẽ to gấp đôi rồi thu nhỏ cho mép mịn
W = N * SS


def tron(a, b, t):
    return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(3))


XANH, DO = (20, 30, 210), (235, 45, 75)


def ve(ra):
    s = lambda v: round(v * SS)
    # khuôn biểu tượng macOS: ô 824 đặt giữa khung 1024, bo góc ~185
    x0, y0k, x1, y1k, r = 100, 100, 924, 924, 185
    anh = Image.new("RGBA", (W, W), (0, 0, 0, 0))

    # bóng đổ của ô
    bong = Image.new("L", (W, W), 0)
    ImageDraw.Draw(bong).rounded_rectangle([s(x0), s(y0k + 18), s(x1), s(y1k + 18)], radius=s(r), fill=90)
    bong = bong.filter(ImageFilter.GaussianBlur(s(18)))
    anh.paste((0, 0, 0, 255), (0, 0), bong)

    # lớp ngoài xanh, dải đỏ ở cạnh dưới, rồi lòng trắng thụt vào: viền xanh 34, dải đỏ 70
    vien, dai = 34, 70
    khuon = Image.new("L", (W, W), 0)
    ImageDraw.Draw(khuon).rounded_rectangle([s(x0), s(y0k), s(x1), s(y1k)], radius=s(r), fill=255)
    lop = Image.new("RGBA", (W, W), XANH + (255,))
    ImageDraw.Draw(lop).rectangle([0, s(y1k - dai - 40), W, W], fill=DO + (255,))
    ImageDraw.Draw(lop).rounded_rectangle([s(x0 + vien), s(y0k + vien), s(x1 - vien), s(y1k - dai)],
                                          radius=s(r - vien), fill=(255, 255, 255, 255))
    anh.paste(lop, (0, 0), khuon)

    d = ImageDraw.Draw(anh)
    bx0, bx1, by0 = 205, 819, 205
    for i, mau in enumerate([XANH, DO, XANH]):
        y0 = by0 + 18 + i * 168
        y1 = y0 + 128
        # vạch màu bên trái
        d.rounded_rectangle([s(bx0), s(y0), s(bx0 + 18), s(y1)], radius=s(9), fill=mau + (255,))
        # ô hình có nút phát
        tx0, tx1 = bx0 + 42, bx0 + 236
        d.rounded_rectangle([s(tx0), s(y0), s(tx1), s(y1)], radius=s(18), fill=tron(mau, (255, 255, 255), 0.85) + (255,))
        cx, cy = (tx0 + tx1) / 2 + 6, (y0 + y1) / 2
        d.polygon([(s(cx - 22), s(cy - 30)), (s(cx - 22), s(cy + 30)), (s(cx + 30), s(cy))], fill=mau + (255,))
        # hai dòng chữ
        d.rounded_rectangle([s(tx1 + 32), s(y0 + 24), s(bx1), s(y0 + 52)], radius=s(14), fill=(15, 15, 15, 255))
        d.rounded_rectangle([s(tx1 + 32), s(y0 + 76), s(bx1 - 90), s(y0 + 100)], radius=s(12), fill=tron(mau, (255, 255, 255), 0.45) + (255,))

    anh.resize((N, N), Image.LANCZOS).save(ra)


if __name__ == "__main__":
    ve(sys.argv[1])
