# Tăng tốc giọng VieNeu (public/giong_goc/c1.wav) lên TOC_DO lần, giữ cao độ, ghi public/giong/c1.wav,
# rồi sinh src/thoi_gian.json: mốc từng câu và mốc các từ khoá (khung toàn cục, 30 khung/giây).
# Blender (canh3d/dung_blender.py) và Remotion (src/Video.tsx) cùng đọc file này nên hình, viền, nhãn khớp lời.
# Chạy lại sau mỗi lần đọc lại giọng:  python3 -I tao_thoi_gian.py
import json
import math
import os
import subprocess
from pathlib import Path

GOC = Path(__file__).resolve().parent
FF = GOC / "node_modules" / "@remotion" / "compositor-darwin-arm64"
TOC_DO = 1.2  # Trung chốt 26/10/2026 (thẻ D-09b), giữ cho D-11
FPS, DAU, CUOI = 30, 30, 45  # 1 giây máy quay lượn trước giọng, 1,5 giây giữ cuối
ENV = {**os.environ, "DYLD_LIBRARY_PATH": str(FF)}
# từ khoá -> (câu, chữ đầu của cụm); mốc lấy theo đầu chữ đó
TU_KHOA = {"xe": (0, "xe"), "apollo": (0, "Apollo"), "banh": (1, "bánh"), "dong_co": (1, "động"),
           "pin": (1, "pin"), "lop": (2, "Lốp"), "luoi": (2, "lưới"), "vau": (2, "vấu")}

(GOC / "public" / "giong").mkdir(exist_ok=True)
ra_wav = GOC / "public" / "giong" / "c1.wav"
subprocess.run([str(FF / "ffmpeg"), "-v", "error", "-y", "-i", str(GOC / "public" / "giong_goc" / "c1.wav"),
                "-af", f"atempo={TOC_DO}", str(ra_wav)], env=ENV, check=True)
giay = float(subprocess.run([str(FF / "ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(ra_wav)],
                            capture_output=True, text=True, env=ENV, check=True).stdout)
khung = lambda t: DAU + round(t / TOC_DO * FPS)

moc = json.loads((GOC / "public" / "giong_goc" / "c1.moc_cau.json").read_text(encoding="utf-8"))["cau"]
text = json.loads((GOC.parent.parent / "kich_ban" / "2026.10.26.canh_thu_d11_lrv_v2.chuong.json").read_text(encoding="utf-8"))[0]["text"]
cau_chu = [c.strip() + "." for c in text.split(". ") if c.strip()]
cau_chu[-1] = cau_chu[-1].rstrip(".") + "."
assert len(cau_chu) == len(moc), (len(cau_chu), len(moc))
cau = [{"f": khung(m["bd"]), "het": khung(m["kt"]), "chu": c} for m, c in zip(moc, cau_chu)]

tu = json.loads((GOC / "public" / "giong_goc" / "moc_tu.json").read_text(encoding="utf-8"))["chuong"]["1"]
moc_tu = {}
for ten, (i, chu) in TU_KHOA.items():
    ds = tu[i]["tu"]
    moc_tu[ten] = khung(next(w["bd"] for w in ds if w["chu"].lower().startswith(chu.lower())))

tong = DAU + math.ceil(giay * FPS) + CUOI
(GOC / "src" / "thoi_gian.json").write_text(json.dumps({"fps": FPS, "tong": tong, "toc_do": TOC_DO, "cau": cau, "tu": moc_tu},
                                                       ensure_ascii=False, indent=1), encoding="utf-8")
print(f"tổng {tong} khung = {tong / FPS:.1f} giây; câu {[c['f'] for c in cau]}; từ khoá {moc_tu}")
