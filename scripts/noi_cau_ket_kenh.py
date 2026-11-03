# noi_cau_ket_kenh.py — nối câu kêu gọi đăng ký kênh vào chương cuối của video đã đọc giọng xong
# (quy tắc kế hoạch loạt thuật ngữ ngân hàng mục 1, Trung chốt 30/10/2026), không đọc lại cả chương.
#
# Bước 1, đọc riêng câu kêu gọi với đúng hệ số kéo của chương cuối (xem he_so_keo trong c<id>.thongtin_vieneu.json):
#   .venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban <tạm>/cta.chuong.json --ra <tạm>/ra --giong "Quốc Tuấn" --he-so-keo <hệ số>
#   (cta.chuong.json: [{"id": <id chương cuối>, "text": CAU, "doc": CAU}])
# Bước 2:  python3 scripts/noi_cau_ket_kenh.py --am-thanh xuong_html/<dự án>/am_thanh --cta <tạm>/ra --kich-ban <..._v1.chuong.json>
#   - chép c<id>.wav, c<id>.moc_cau.json, moc_tu.json cũ vào am_thanh/truoc_cau_ket/ (chỉ lần đầu)
#   - c<id>.wav = giọng cũ + KHOANG giây lặng + câu kêu gọi; mốc câu, mốc từ dời theo
#   - thêm câu vào "text" và "doc" chương cuối của .chuong.json
# Bước 3: trong <mã>_tao_nhip.py cho man_hinh_ket bắt đầu ở mốc đầu câu kêu gọi, dài 10 giây; chạy lại tạo nhịp.
import argparse, json, shutil, wave
from pathlib import Path

CAU = "Đăng ký kênh Chuyện nghề Ngân hàng để biết thêm nhiều nội dung thú vị về ngân hàng và đi vay."
KHOANG = 0.8  # giây lặng giữa câu nội dung cuối và câu kêu gọi

p = argparse.ArgumentParser()
p.add_argument("--am-thanh", required=True)
p.add_argument("--cta", required=True)
p.add_argument("--kich-ban", required=True)
a = p.parse_args()
am, cta, kb = Path(a.am_thanh), Path(a.cta), Path(a.kich_ban)

chuong = json.loads(kb.read_text(encoding="utf-8"))
cuoi = chuong[-1]
cid = cuoi["id"]
if cuoi["text"].rstrip().endswith(CAU):
    raise SystemExit(f"chương {cid} đã có câu kêu gọi, không nối lần hai")

luu = am / "truoc_cau_ket"
luu.mkdir(exist_ok=True)
for ten in (f"c{cid}.wav", f"c{cid}.moc_cau.json", f"c{cid}.thongtin_vieneu.json", "moc_tu.json"):
    if not (luu / ten).exists():
        shutil.copy2(am / ten, luu / ten)

with wave.open(str(luu / f"c{cid}.wav")) as w:
    tham = w.getparams()
    cu = w.readframes(w.getnframes())
with wave.open(str(cta / f"c{cid}.wav")) as w:
    assert (w.getnchannels(), w.getsampwidth(), w.getframerate()) == (tham.nchannels, tham.sampwidth, tham.framerate), "khác định dạng âm thanh"
    moi = w.readframes(w.getnframes())
lang = b"\x00" * (int(round(KHOANG * tham.framerate)) * tham.sampwidth * tham.nchannels)
with wave.open(str(am / f"c{cid}.wav"), "wb") as w:
    w.setparams(tham)
    w.writeframes(cu + lang + moi)
lech = len(cu + lang) / (tham.sampwidth * tham.nchannels * tham.framerate)

mc = json.loads((luu / f"c{cid}.moc_cau.json").read_text(encoding="utf-8"))
mn = json.loads((cta / f"c{cid}.moc_cau.json").read_text(encoding="utf-8"))
so_cau_cu = len(mc["cau"])
mc["cau"] += [{**x, "bd": round(x["bd"] + lech, 3), "kt": round(x["kt"] + lech, 3)} for x in mn["cau"]]
mc["doc"] = mc["doc"].rstrip() + " " + CAU
mc["giay"] = round(lech + mn["giay"], 3)
(am / f"c{cid}.moc_cau.json").write_text(json.dumps(mc, ensure_ascii=False, indent=1), encoding="utf-8")

mt = json.loads((luu / "moc_tu.json").read_text(encoding="utf-8"))
tn = json.loads((cta / "moc_tu.json").read_text(encoding="utf-8"))["chuong"].get(str(cid), [])
ds = mt["chuong"].setdefault(str(cid), [])
for x in tn:
    ds.append({"cau": so_cau_cu + x["cau"], "tu": [{**w, "bd": round(w["bd"] + lech, 3), "kt": round(w["kt"] + lech, 3)} for w in x["tu"]]})
(am / "moc_tu.json").write_text(json.dumps(mt, ensure_ascii=False, indent=1), encoding="utf-8")

cuoi["text"] = cuoi["text"].rstrip() + " " + CAU
cuoi["doc"] = cuoi["doc"].rstrip() + " " + CAU
kb.write_text(json.dumps(chuong, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"chương {cid}: câu kêu gọi bắt đầu ở {lech:.3f} giây trong chương, chương dài {mc['giay']:.3f} giây")
