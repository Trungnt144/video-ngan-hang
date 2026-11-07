# N303 (07/11/2026): đọc lại riêng vài câu, lấy chữ từ .chuong.json hiện tại,
# giữ lần đọc Whisper nghe ra cụm bắt buộc (tham số 4, biểu thức chính quy, tuỳ chọn) và sai ký tự thấp nhất, ghép vào c<id>.wav,
# dời mốc câu sau trong c<id>.moc_cau.json, cập nhật c<id>.thongtin_vieneu.json và mốc từng từ moc_tu.json.
# Dùng:  .venv_vieneu/bin/python xuong_html/n303_tai_san_ngan_han/n303_doc_lai.py <chương> <câu,câu> [số lần tối đa] [cụm phải nghe ra]
import json, re, sys
from pathlib import Path

GOC = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(GOC / "scripts"))
import jiwer, mlx_whisper, numpy as np, soundfile as sf, soxr
from vieneu import Vieneu
from sinh_giong_vieneu import SR, chuan, tach_cau
from toc_do_giong import keo_gian, tim_ffmpeg
from moc_tung_tu import can_tu

KB = GOC / "san_pham/2026.11.07.Tai_san_ngan_han_la_gi/tai_nguyen/kich_ban/2026.11.07.tai_san_ngan_han_v1.chuong.json"
RA = GOC / "xuong_html/n303_tai_san_ngan_han/am_thanh"

c_id = int(sys.argv[1]); so_cau = sorted({int(x) for x in sys.argv[2].split(",")}, reverse=True)
toi_da = int(sys.argv[3]) if len(sys.argv) > 3 else 5
NGHE_DUNG = re.compile(sys.argv[4], re.I) if len(sys.argv) > 4 else None
ch = json.loads((GOC / "tai_san/cau_hinh_giong.json").read_text(encoding="utf-8-sig"))["vieneu"]
thay = [tuple(x) for x in ch["chuan_hoa_nghe_lai"]]
c = next(x for x in json.loads(KB.read_text(encoding="utf-8")) if x["id"] == c_id)
cau_doc, cau_text = tach_cau(c["doc"]), tach_cau(c["text"])
f_wav, f_moc, f_tt = (RA / f"c{c_id}{d}" for d in (".wav", ".moc_cau.json", ".thongtin_vieneu.json"))
y, sr = sf.read(f_wav, dtype="float32"); assert sr == SR
moc = json.loads(f_moc.read_text(encoding="utf-8")); tt = json.loads(f_tt.read_text(encoding="utf-8"))
f_tu = RA / "moc_tu.json"; mt = json.loads(f_tu.read_text(encoding="utf-8"))
tu_ch = {x["cau"]: x for x in mt["chuong"][str(c_id)]}
assert len(moc["cau"]) == len(cau_doc) == len(cau_text)
he_so = tt.get("he_so_keo", 1.0); ffmpeg = tim_ffmpeg()
tts = Vieneu()

def nghe(x):
    r = mlx_whisper.transcribe(soxr.resample(x, SR, 16000), path_or_hf_repo=ch["mo_hinh_nghe_lai"], language="vi", word_timestamps=True)
    return r["text"].strip(), [w for s in r["segments"] for w in s.get("words", [])]

for so in so_cau:
    i = so - 1; s = cau_doc[i]
    tot = None
    for lan in range(1, toi_da + 1):
        x = np.asarray(tts.infer(s, voice=tt["giong"]), dtype=np.float32).flatten()
        h, tu = nghe(x)
        sai = jiwer.cer(chuan(s), chuan(h, thay))
        dung = NGHE_DUNG is None or bool(NGHE_DUNG.search(h))
        if dung and NGHE_DUNG is not None:
            h2, _ = nghe(np.pad(x, (int(0.4 * SR), int(0.4 * SR))))
            dung = bool(NGHE_DUNG.search(h2))
            if not dung: h = h + "  || đệm: " + h2
        print(f"  c{c_id} câu {so} lần {lan}: cụm {'đúng' if dung else 'SAI'}, sai {sai:.0%} — {h}", flush=True)
        k = (not dung, sai)
        if tot is None or k < tot[0]:
            tot = (k, x, h, tu, lan)
        if dung and sai <= ch["nguong_sai_ky_tu"] + 0.08:
            break
    (khong_dung, sai), x0, h, tu0, lan_tot = tot
    x = keo_gian(x0, he_so, ffmpeg); co = len(x) / len(x0)
    tu0 = [{**w, "start": w["start"] * co, "end": w["end"] * co} for w in tu0]
    bd, kt = int(round(moc["cau"][i]["bd"] * SR)), int(round(moc["cau"][i]["kt"] * SR))
    lech = (len(x) - (kt - bd)) / SR
    y = np.concatenate([y[:bd], x, y[kt:]])
    moc["cau"][i] = {"cau": s, "bd": moc["cau"][i]["bd"], "kt": round(moc["cau"][i]["bd"] + len(x) / SR, 3)}
    for m in moc["cau"][i + 1:]:
        m["bd"], m["kt"] = round(m["bd"] + lech, 3), round(m["kt"] + lech, 3)
    b0 = moc["cau"][i]["bd"]
    tu_ch[i] = {"cau": i, "tu": [{**w, "bd": round(b0 + w["bd"], 3), "kt": round(b0 + w["kt"], 3)} for w in can_tu(tu0, s, cau_text[i], len(x) / SR, thay)]}
    for j in tu_ch:
        if j > i:
            tu_ch[j]["tu"] = [{**w, "bd": round(w["bd"] + lech, 3), "kt": round(w["kt"] + lech, 3)} for w in tu_ch[j]["tu"]]
    tt["tung_cau"][i] = {"cau": s, "whisper": h, "ty_le_sai": round(sai, 3), "so_lan_doc": lan_tot, "lan_duoc_giu": lan_tot,
                         "doc_lai_rieng": True, "cum_nghe_dung": not khong_dung}
    print(f"c{c_id} câu {so}: giữ lần {lan_tot}, cụm {'đúng' if not khong_dung else 'SAI'}, dài thêm {lech:+.2f} giây", flush=True)

moc["doc"] = c["doc"]; moc["giay"] = round(len(y) / SR, 3); tt["thoi_luong_giay"] = moc["giay"]; tt["so_ky_tu"] = len(c["doc"])
sf.write(f_wav, y, SR, subtype="PCM_16")
f_moc.write_text(json.dumps(moc, ensure_ascii=False, indent=1), encoding="utf-8")
f_tt.write_text(json.dumps(tt, ensure_ascii=False, indent=1), encoding="utf-8")
mt["chuong"][str(c_id)] = [tu_ch[k] for k in sorted(tu_ch)]
f_tu.write_text(json.dumps(mt, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"Chương {c_id}: {moc['giay']:.1f} giây")
