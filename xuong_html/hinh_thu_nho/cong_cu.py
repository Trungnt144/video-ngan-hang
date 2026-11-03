"""Công cụ ảnh cho khuôn hình thu nhỏ (xuat.mjs gọi).

  python3 cong_cu.py jpg <bản gốc.png> <bản tải lên.jpg>
      Bảng phong cách hình thu nhỏ mục 4 quy tắc 1: thu về 1920×1080 bằng Lanczos, hệ màu sRGB, JPG chất lượng cao nhất
      mà file vẫn dưới 2 MB (bắt đầu 100, hạ từng nấc 2); hạ tới 85 vẫn vượt thì xuất 1280×720 ở chất lượng 100.
  python3 cong_cu.py luoi <ra.jpg> <thời lượng, ví dụ 2:37> <ảnh.png> ...
      Bảng soát: các hình xếp hai cột rộng 800, hàng cuối là cỡ thật trên điện thoại (168×94) có nhãn thời lượng giả.
  python3 cong_cu.py luoi_nh <ra.jpg> <thời lượng> <ảnh.png> ...
      Bảng soát kênh Ngân hàng: mỗi hình một hàng, rộng 800 cạnh bản 320×180 (laptop) và 168×94 (điện thoại) có nhãn thời lượng giả.
  python3 cong_cu.py co_nho <ảnh.png>
      Lưu hai bản thu nhỏ <ảnh>_320.png và <ảnh>_168.png cạnh ảnh gốc (bảng phong cách mục 0b quy tắc 2).
  python3 cong_cu.py cat_net <ảnh vào.png> <ảnh ra.png> <x,y,w,h vùng thô trên khung 1920×1080> [lề=24]
      Cắt gọn hình vẽ chụp bằng lay_hinh.mjs: trong vùng thô, tìm khung bao các điểm ảnh khác màu nền (màu góc trái trên
      của vùng) rồi cắt theo khung đó cộng lề, để hình vẽ chiếm trọn chỗ trên hình thu nhỏ (mục 0b quy tắc 9, cắt gọn).
  python3 cong_cu.py tuong_phan <nền.png> <hệ số chụp> '<json các dòng {chu, mau "rgb(...)", hop [x,y,w,h] trên khung 1280×720}>'
      Tỉ lệ tương phản WCAG giữa màu chữ và nền trong hộp mỗi dòng; lấy mức mà 95% điểm ảnh nền đạt (bỏ 5% chi tiết lẻ),
      in "Dòng 1 «…» 7,8:1; …", dòng dưới 4,5:1 thêm chữ THẤP.
"""
import io
import json
import re
import sys

from PIL import Image, ImageDraw

GIOI_HAN = 2 * 1000 * 1000  # YouTube: tối đa 2 MB; lấy mốc thập phân cho chắc


def jpg(vao, ra):
    goc = Image.open(vao).convert("RGB")
    for co in ((1920, 1080), (1280, 720)):
        anh = goc if goc.size == co else goc.resize(co, Image.LANCZOS)
        cac_muc = range(100, 84, -2) if co == (1920, 1080) else (100,)
        for q in cac_muc:
            b = io.BytesIO()
            anh.save(b, "JPEG", quality=q, subsampling=0, optimize=True)
            if b.tell() < GIOI_HAN:
                open(ra, "wb").write(b.getvalue())
                print(f"Bản tải lên: {ra} · {co[0]}×{co[1]} · chất lượng {q} · {b.tell() / 1e6:.2f} MB")
                return
    sys.exit("Không xuất được JPG dưới 2 MB")


def jpg_doc(vao, ra):
    # bìa dọc Reels, Shorts, TikTok: 1080×1920, chất lượng cao nhất mà file dưới 2 MB
    anh = Image.open(vao).convert("RGB")
    if anh.size != (1080, 1920):
        anh = anh.resize((1080, 1920), Image.LANCZOS)
    for q in range(100, 80, -2):
        b = io.BytesIO()
        anh.save(b, "JPEG", quality=q, subsampling=0, optimize=True)
        if b.tell() < GIOI_HAN:
            open(ra, "wb").write(b.getvalue())
            print(f"Bìa dọc: {ra} · 1080×1920 · chất lượng {q} · {b.tell() / 1e6:.2f} MB")
            return
    sys.exit("Không xuất được JPG dưới 2 MB")


def luoi_doc(ra, tg, *vao):
    # mỗi hình một hàng: cả khung 9:16, phần còn lại khi Facebook cắt 4:5 (bảng tin) và 1:1, cỡ lưới điện thoại 3 cột (khoảng 120 điểm ảnh)
    hang = []
    for v in vao:
        a = Image.open(v).convert("RGB").resize((1080, 1920), Image.LANCZOS)
        ca = a.resize((360, 640), Image.LANCZOS)
        c45 = a.crop((0, 285, 1080, 1635)).resize((360, 450), Image.LANCZOS)
        c11 = a.crop((0, 420, 1080, 1500)).resize((360, 360), Image.LANCZOS)
        nho = a.resize((120, 213), Image.LANCZOS)
        hang.append((ca, c45, c11, nho))
    pad = 16
    w = pad + sum(x.width + pad for x in hang[0])
    bang = Image.new("RGB", (w, len(hang) * (640 + pad) + pad), (24, 24, 24))
    for i, ds in enumerate(hang):
        x = pad
        for x_anh in ds:
            bang.paste(x_anh, (x, pad + i * (640 + pad)))
            x += x_anh.width + pad
    bang.save(ra, quality=90)
    print(f"Bảng soát bìa dọc: {ra} (cả khung · cắt 4:5 · cắt 1:1 · cỡ lưới điện thoại)")


def luoi(ra, tg, *vao):
    hinh = [Image.open(v).convert("RGB") for v in vao]
    cot, w, h, pad = 2, 800, 450, 8
    hang = (len(hinh) + 1) // cot
    nho_h = 94 + 2 * pad
    bang = Image.new("RGB", (cot * w + (cot + 1) * pad, hang * (h + pad) + pad + nho_h), (24, 24, 24))
    for i, a in enumerate(hinh):
        bang.paste(a.resize((w, h), Image.LANCZOS), (pad + (i % cot) * (w + pad), pad + (i // cot) * (h + pad)))
    y = hang * (h + pad) + pad
    for i, a in enumerate(hinh):
        n = a.resize((168, 94), Image.LANCZOS)
        d = ImageDraw.Draw(n)
        rong = 6 * len(tg) + 6
        d.rectangle((164 - rong, 78, 164, 91), fill=(0, 0, 0))
        d.text((167 - rong, 79), tg, fill=(255, 255, 255))
        x = pad + i * (168 + pad)
        if x + 168 <= bang.width:
            bang.paste(n, (x, y))
    bang.save(ra, quality=90)
    print(f"Bảng soát: {ra}")


def nho(a, co, tg=None):
    n = a.resize(co, Image.LANCZOS)
    if tg:
        d = ImageDraw.Draw(n)
        rong = 6 * len(tg) + 6
        d.rectangle((co[0] - 4 - rong, co[1] - 16, co[0] - 4, co[1] - 3), fill=(0, 0, 0))
        d.text((co[0] - 1 - rong, co[1] - 15), tg, fill=(255, 255, 255))
    return n


def co_nho(vao):
    a = Image.open(vao).convert("RGB")
    goc = vao.rsplit(".", 1)[0]
    for co in ((320, 180), (168, 94)):
        nho(a, co).save(f"{goc}_{co[0]}.png")


def luoi_nh(ra, tg, *vao):
    pad, w, h = 12, 800, 450
    bang = Image.new("RGB", (w + 320 + 168 + 4 * pad, len(vao) * (h + pad) + pad), (24, 24, 24))
    for i, v in enumerate(vao):
        a = Image.open(v).convert("RGB")
        y = pad + i * (h + pad)
        bang.paste(a.resize((w, h), Image.LANCZOS), (pad, y))
        bang.paste(nho(a, (320, 180), tg), (2 * pad + w, y))
        bang.paste(nho(a, (168, 94), tg), (3 * pad + w + 320, y))
    bang.save(ra, quality=90)
    print(f"Bảng soát: {ra}")


def cat_net(vao, ra, vung, le="24"):
    a = Image.open(vao).convert("RGB")
    k = a.width / 1920
    x, y, w, h = (int(float(v) * k) for v in vung.split(","))
    v = a.crop((x, y, x + w, y + h))
    nho = v.resize((max(1, w // 4), max(1, h // 4)))
    r0 = nho.getpixel((0, 0))
    W, H = nho.size
    diem = [(i % W, i // W) for i, p in enumerate(nho.getdata()) if sum(abs(p[j] - r0[j]) for j in range(3)) > 30]
    if not diem:
        sys.exit("Không thấy nét vẽ trong vùng")
    l = int(float(le) * k)
    x0 = max(0, min(p[0] for p in diem) * 4 - l); x1 = min(w, (max(p[0] for p in diem) + 1) * 4 + l)
    y0 = max(0, min(p[1] for p in diem) * 4 - l); y1 = min(h, (max(p[1] for p in diem) + 1) * 4 + l)
    v.crop((x0, y0, x1, y1)).save(ra)
    print(f"Cắt gọn: {ra} · {x1 - x0}×{y1 - y0} (vùng nét trên khung 1920: {(x + x0) / k:.0f},{(y + y0) / k:.0f},{(x1 - x0) / k:.0f},{(y1 - y0) / k:.0f})")


def do_sang(c):
    c = c / 255
    return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4


def tuong_phan(nen, he_so, dong):
    a = Image.open(nen).convert("RGB")
    k = float(he_so)
    kq = []
    for i, d in enumerate(json.loads(dong), 1):
        r, g, b = map(int, re.findall(r"\d+", d["mau"])[:3])
        lc = 0.2126 * do_sang(r) + 0.7152 * do_sang(g) + 0.0722 * do_sang(b)
        x, y, w, h = d["hop"]
        vung = a.crop((int(x * k), int(y * k), int((x + w) * k), int((y + h) * k))).resize((max(1, int(w / 2)), max(1, int(h / 2))))
        tl = []
        for pr, pg, pb in vung.getdata():
            ln = 0.2126 * do_sang(pr) + 0.7152 * do_sang(pg) + 0.0722 * do_sang(pb)
            tl.append((max(lc, ln) + 0.05) / (min(lc, ln) + 0.05))
        tl.sort()
        muc = tl[int(len(tl) * 0.05)] if tl else 0
        so = f"{muc:.1f}".replace(".", ",")
        kq.append(f"Dòng {i} «{d['chu'][:18]}» {so}:1" + (" THẤP" if muc < 4.5 else ""))
    print("; ".join(kq))


if __name__ == "__main__":
    {"jpg": jpg, "jpg_doc": jpg_doc, "luoi_doc": luoi_doc, "luoi": luoi, "luoi_nh": luoi_nh, "co_nho": co_nho, "tuong_phan": tuong_phan, "cat_net": cat_net}[sys.argv[1]](*sys.argv[2:])
