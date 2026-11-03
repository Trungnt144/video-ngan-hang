"""Trang so sánh hình thu nhỏ để Trung chọn một lượt (bảng phong cách mục 0b quy tắc 8: mỗi video 2 phương án, mỗi lô 6–8 video một trang).

  python3 trang_so_sanh.py <cấu hình.json> <trang ra.html>

Mỗi hình hiện ở ba cỡ: đủ cỡ 1280×720, cỡ laptop 320×180 và cỡ điện thoại 168×94 (cỡ hiển thị trên màn hình; ảnh nguồn nét
hơn, trình duyệt tự thu nhỏ như YouTube làm), kèm nhãn thời lượng giả ở góc dưới phải. Ảnh nhúng thẳng vào trang (JPG 1600×900)
nên trang mở được ở bất cứ đâu, không phụ thuộc thư mục xem_truoc/.

Cấu hình (đường dẫn ảnh tính từ thư mục chứa file cấu hình):
{
  "tieu_de": "...", "gioi_thieu": ["đoạn văn", ...],
  "nhom": [ { "ten": "...", "mo_ta": "...", "kieu": "day_du" (ba cỡ) | "nho" (chỉ laptop và điện thoại),
              "hinh": [ { "anh": "xem_truoc/<chu_de>/A.png", "nhan": "N97 · phương án A", "thoi_luong": "4:07",
                          "ghi": ["dòng mô tả", ...], "phong_to": [x, y, w, h] (vùng phóng 1:1 trên khung 1280×720, tuỳ chọn) } ] } ],
  "cau_hoi": ["câu hỏi sẽ hỏi bằng bảng chọn", ...]
}
"""
import base64
import html
import io
import json
import os
import sys

from PIL import Image


def nhung(anh, co=(1600, 900), vung=None):
    a = Image.open(anh).convert("RGB")
    if vung:
        k = a.width / 1280
        x, y, w, h = vung
        a = a.crop((int(x * k), int(y * k), int((x + w) * k), int((y + h) * k)))
        co = (int(w * 2), int(h * 2)) if a.width >= w * 2 else a.size
    a = a.resize(co, Image.LANCZOS)
    b = io.BytesIO()
    a.save(b, "JPEG", quality=86, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()


def o_hinh(src, rong, cao, tg, lop):
    return (f'<div class="o {lop}" style="width:{rong}px;height:{cao}px"><img src="{src}" alt="">'
            f'<span class="tg">{html.escape(tg)}</span></div>')


def the_hinh(h, goc, kieu):
    duong = os.path.join(goc, h["anh"])
    src = nhung(duong)
    tg = h.get("thoi_luong", "5:00")
    co = []
    if kieu == "day_du":
        co.append(f'<figure class="lon"><div class="cuon">{o_hinh(src, 1280, 720, tg, "c1280")}</div><figcaption>Đủ cỡ 1280×720</figcaption></figure>')
    co.append(f'<figure>{o_hinh(src, 320, 180, tg, "c320")}<figcaption>Cỡ laptop 320×180</figcaption></figure>')
    co.append(f'<figure>{o_hinh(src, 168, 94, tg, "c168")}<figcaption>Cỡ điện thoại 168×94</figcaption></figure>')
    if h.get("phong_to"):
        co.append(f'<figure><img class="phong" src="{nhung(duong, vung=h["phong_to"])}" alt=""><figcaption>Phóng to vùng hình vẽ</figcaption></figure>')
    ghi = "".join(f"<li>{html.escape(g)}</li>" for g in h.get("ghi", []))
    return (f'<article class="the"><h3>{html.escape(h["nhan"])}</h3>'
            f'<div class="hang {"day" if kieu == "day_du" else ""}">{"".join(co)}</div>'
            + (f"<ul>{ghi}</ul>" if ghi else "") + "</article>")


def main(cau_hinh, ra):
    ch = json.load(open(cau_hinh, encoding="utf-8"))
    goc = os.path.dirname(os.path.abspath(cau_hinh))
    phan = []
    for n in ch["nhom"]:
        the = "".join(the_hinh(h, goc, n.get("kieu", "day_du")) for h in n["hinh"])
        phan.append(f'<section><h2>{html.escape(n["ten"])}</h2>'
                    + (f'<p class="mo">{html.escape(n["mo_ta"])}</p>' if n.get("mo_ta") else "") + f'<div class="luoi">{the}</div></section>')
    gt = "".join(f"<p>{html.escape(p)}</p>" for p in ch.get("gioi_thieu", []))
    hoi = "".join(f"<li>{html.escape(c)}</li>" for c in ch.get("cau_hoi", []))
    trang = f"""<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(ch["tieu_de"])}</title>
<style>
  :root {{ --nen: #f3f4f6; --the: #ffffff; --chu: #1f2328; --phu: #57606a; --vien: #d0d7de; --nhan: #0d4d47; }}
  @media (prefers-color-scheme: dark) {{ :root {{ --nen: #16181d; --the: #1f232a; --chu: #e6edf3; --phu: #9aa4af; --vien: #353b45; --nhan: #5fd0c4; }} }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: var(--nen); color: var(--chu); font: 16px/1.55 -apple-system, "Segoe UI", "Be Vietnam Pro", sans-serif; }}
  main {{ max-width: 1400px; margin: 0 auto; padding: 24px 16px 64px; }}
  h1 {{ font-size: 26px; margin: 0 0 8px; }} h2 {{ font-size: 21px; margin: 40px 0 6px; color: var(--nhan); }} h3 {{ font-size: 17px; margin: 0 0 10px; }}
  .gt p, .mo {{ color: var(--phu); max-width: 900px; margin: 6px 0; }}
  .luoi {{ display: grid; gap: 18px; }}
  .the {{ background: var(--the); border: 1px solid var(--vien); border-radius: 12px; padding: 16px; }}
  .hang {{ display: flex; flex-wrap: wrap; gap: 18px; align-items: flex-start; }}
  figure {{ margin: 0; }} figcaption {{ font-size: 13px; color: var(--phu); margin-top: 4px; }}
  figure.lon {{ flex: 1 1 100%; min-width: 0; }}
  .cuon {{ overflow-x: auto; }}
  .o {{ position: relative; border-radius: 6px; overflow: hidden; flex: none; background: #000; }}
  .o img {{ width: 100%; height: 100%; display: block; }}
  .o .tg {{ position: absolute; right: 4%; bottom: 5%; background: rgba(0,0,0,.8); color: #fff; font: 600 12px/1 sans-serif; padding: 3px 4px; border-radius: 3px; }}
  .c1280 .tg {{ font-size: 20px; padding: 4px 7px; }} .c168 .tg {{ font-size: 10px; padding: 2px 3px; }}
  img.phong {{ max-width: 100%; max-height: 420px; width: auto; border-radius: 6px; border: 1px solid var(--vien); display: block; }}
  ul {{ margin: 12px 0 0; padding-left: 20px; color: var(--phu); }}
  ol.hoi {{ background: var(--the); border: 1px solid var(--vien); border-radius: 12px; padding: 16px 16px 16px 36px; }}
</style></head>
<body><main>
<h1>{html.escape(ch["tieu_de"])}</h1><div class="gt">{gt}</div>
{"".join(phan)}
{f'<h2>Các điểm cần chốt</h2><ol class="hoi">{hoi}</ol>' if hoi else ""}
</main></body></html>"""
    os.makedirs(os.path.dirname(os.path.abspath(ra)), exist_ok=True)
    open(ra, "w", encoding="utf-8").write(trang)
    print(f"Trang so sánh: {ra} · {os.path.getsize(ra) / 1e6:.1f} MB")


if __name__ == "__main__":
    main(*sys.argv[1:])
