# N303 (07/11/2026): lập mốc thời gian cho trang.html và nhip.json.
#   Có giọng thật (am_thanh/c<id>.wav, c<id>.moc_cau.json, tuỳ chọn moc_tu.json): ghi thoi_gian.json (kèm man_hinh_ket), nhip.json (quy cách pha máy LM-03), chèn mốc và dữ kiện vào trang.html.
#   Chưa có giọng (hoặc --uoc): mốc ƯỚC TÍNH theo 21 ký tự lời đọc mỗi giây, chỉ ghi thoi_gian.json và chèn vào trang; KHÔNG ghi nhip.json.
# Chạy lại sau mỗi lần đọc lại giọng:  python3 -I n303_tao_nhip.py [--uoc]
import json, re, sys, wave
from pathlib import Path

GOC = Path(__file__).resolve().parent
MA = "n303"
SP = GOC.parent.parent / "san_pham" / "2026.11.07.Tai_san_ngan_han_la_gi" / "tai_nguyen" / "kich_ban"
KICH_BAN = SP / "2026.11.07.tai_san_ngan_han_v1.chuong.json"
DU_KIEN = SP / "2026.11.07.tai_san_ngan_han_v1.du_kien.json"
NHAC = "am_thanh/n303_nhac_noi.wav"  # NH06 Pop Track 03 (Lily J, Mixkit 729) nối lặp có mờ chéo, làm bằng n303_noi_nhac.sh
DAU = 0.5
CUOI = 0.7
DAU_RIENG = {1: 1.2}
CUOI_RIENG = {}
KY_TU_GIAY = 21.0
NGHI_CAU = 0.30
CHUONG_MIN, CHUONG_MAX = 14.0, 60.0
KET = 10.0  # màn hình kết kênh (kho logo_ten_kenh), không lời, không phụ đề


def cat_cau(s):
    return [c.strip() for c in re.split(r"(?<=[.!?])\s+", s.strip()) if c.strip()]


def do_dai(f):
    with wave.open(str(f)) as w:
        return w.getnframes() / w.getframerate()


def gop_chuong(ra):
    nhom, cur, d = [], [], 0.0
    for i, c in enumerate(ra, 1):
        dai = c["den"] - c["t"]
        if cur and d >= CHUONG_MIN:
            nhom.append(cur); cur, d = [], 0.0
        if cur and d + dai > CHUONG_MAX:
            nhom.append(cur); cur, d = [], 0.0
        cur.append(i); d += dai
    if cur:
        if nhom and d + KET < CHUONG_MIN:
            nhom[-1] += cur
        else:
            nhom.append(cur)
    return nhom


chuong = json.loads(KICH_BAN.read_text(encoding="utf-8"))
f_tu = GOC / "am_thanh" / "moc_tu.json"
MOC_TU = json.loads(f_tu.read_text(encoding="utf-8"))["chuong"] if f_tu.exists() else {}
co_giong = all((GOC / "am_thanh" / f"c{c['id']}.wav").exists() and (GOC / "am_thanh" / f"c{c['id']}.moc_cau.json").exists() for c in chuong)
uoc = ("--uoc" in sys.argv) or not co_giong

ra, giong, t = [], [], 0.0
for c in chuong:
    chu = cat_cau(c["text"])
    doc = cat_cau(c["doc"])
    dau = DAU_RIENG.get(c["id"], DAU)
    t_giong = t + dau
    if uoc:
        assert len(chu) == len(doc), f"chương {c['id']}: {len(chu)} câu phụ đề, {len(doc)} câu lời đọc"
        cau, u = [], 0.0
        for x, d in zip(chu, doc):
            dai_c = len(d) / KY_TU_GIAY
            cau.append({"chu": x, "t": round(t_giong + u, 3), "den": round(t_giong + u + dai_c, 3)})
            u += dai_c + NGHI_CAU
        dai = dau + u + CUOI_RIENG.get(c["id"], CUOI)
    else:
        wav = GOC / "am_thanh" / f"c{c['id']}.wav"
        moc = json.loads((GOC / "am_thanh" / f"c{c['id']}.moc_cau.json").read_text(encoding="utf-8"))["cau"]
        assert len(moc) == len(chu), f"chương {c['id']}: giọng {len(moc)} câu, phụ đề {len(chu)} câu"
        cau = [{"chu": x, "t": round(t_giong + m["bd"], 3), "den": round(t_giong + m["kt"], 3)} for x, m in zip(chu, moc)]
        for x in MOC_TU.get(str(c["id"]), []):
            cau[x["cau"]]["tu"] = [{"chu": w["chu"], "t": round(t_giong + w["bd"], 3), "den": round(t_giong + w["kt"], 3)} for w in x["tu"]]
        dai = dau + do_dai(wav) + CUOI_RIENG.get(c["id"], CUOI)
        giong.append({"tep": f"am_thanh/c{c['id']}.wav", "t": round(t_giong, 3)})
    ra.append({"id": c["id"], "ten": c["ten"], "t": round(t, 3), "den": round(t + dai, 3), "cau": cau})
    t += dai
# Quy tắc 30/10/2026: màn hình kết bắt đầu đúng lúc câu kêu gọi đăng ký kênh (câu cuối lời đọc) bắt đầu.
HET = ra[-1]["cau"][-1]["t"]
TONG = round(max(HET + KET, t), 3)

tg = {"thoi_luong_giay": TONG, "uoc_tinh": uoc, "man_hinh_ket": {"t": HET, "den": TONG}, "chuong": ra}
(GOC / "thoi_gian.json").write_text(json.dumps(tg, ensure_ascii=False, indent=1), encoding="utf-8")

GOP = gop_chuong(ra)
pm = []
for i, g in enumerate(GOP, 1):
    a, b = ra[g[0] - 1], ra[g[-1] - 1]
    ten = " · ".join(ra[k - 1]["ten"] for k in g)
    if i == len(GOP):
        ten += " · Màn hình kết"
    pm.append({"id": str(i), "ten": ten, "t": a["t"], "den": TONG if i == len(GOP) else b["den"]})
if not uoc:
    nhip_cu = json.loads((GOC / "nhip.json").read_text(encoding="utf-8")) if (GOC / "nhip.json").exists() else {}
    nhip = {
        "ten": f"{MA}_tai_san_ngan_han",
        "ngay": "2026-11-07",
        "ghi_chu": "N303 Tài sản ngắn hạn là gì, CL-05 đồ thị và thanh số liệu SVG, BC-07 chia đôi đối chiếu, MAU-33, NH06. Sinh bằng n303_tao_nhip.py; trường 'nhip' (storyboard) viết tay, giữ nguyên khi chạy lại.",
        "kho": "1920x1080",
        "thoi_luong_giay": TONG,
        "fps_xem_truoc": 10,
        "fps_cuoi": 30,
        "giong": giong,
        "nhac": NHAC,
        "nhac_db": -16.0,
        "mo_dan": 2,
        "chuong": pm,
        "nhip": nhip_cu.get("nhip", []),
    }
    (GOC / "nhip.json").write_text(json.dumps(nhip, ensure_ascii=False, indent=1), encoding="utf-8")

trang = GOC / "trang.html"
if trang.exists():
    s = trang.read_text(encoding="utf-8")
    moi = '<!--THOI_GIAN_BAT_DAU--><script type="application/json" id="thoi_gian">' + json.dumps(tg, ensure_ascii=False) + "</script><!--THOI_GIAN_KET_THUC-->"
    s, n1 = re.subn(r"<!--THOI_GIAN_BAT_DAU-->.*?<!--THOI_GIAN_KET_THUC-->", lambda m: moi, s, flags=re.S)
    dk = json.dumps(json.loads(DU_KIEN.read_text(encoding="utf-8")), ensure_ascii=False)
    moi_dk = '<!--DU_KIEN_BAT_DAU--><script type="application/json" id="du_kien">' + dk + "</script><!--DU_KIEN_KET_THUC-->"
    s, n2 = re.subn(r"<!--DU_KIEN_BAT_DAU-->.*?<!--DU_KIEN_KET_THUC-->", lambda m: moi_dk, s, flags=re.S)
    assert n1 == 1 and n2 == 1, f"không tìm thấy dấu trong trang.html ({n1}, {n2})"
    trang.write_text(s, encoding="utf-8")
print(f"{MA}: {'ước tính' if uoc else 'giọng thật'} · {len(ra)} chương kịch bản → {len(pm)} chặng pha máy · màn kết {HET:.2f}–{TONG:.2f} s · tổng {TONG:.2f} s")
