# N199: nghe lại bằng Whisper (mlx) từng câu chọn của giọng đã đọc, in chữ nghe được và xác suất các từ cần soi.
# Dùng: .venv_vieneu/bin/python xuong_html/n199_hoat_dong_huy_dong_von/n199_nghe_lai.py <chương>:<câu 1-based> ... [--soi thứ,lãi]
import sys, json, soundfile as sf, soxr, mlx_whisper
from pathlib import Path
G = Path(__file__).resolve().parent / "am_thanh"
soi = []
args = [a for a in sys.argv[1:]]
if "--soi" in args:
    k = args.index("--soi"); soi = args[k + 1].split(","); args = args[:k] + args[k + 2:]
for a in args:
    c, i = map(int, a.split(":"))
    x, sr = sf.read(str(G / f"c{c}.wav"))
    if x.ndim > 1: x = x.mean(1)
    m = json.loads((G / f"c{c}.moc_cau.json").read_text())["cau"][i - 1]
    seg = x[int(max(0, m["bd"] - 0.15) * sr): int((m["kt"] + 0.15) * sr)]
    r = mlx_whisper.transcribe(soxr.resample(seg, sr, 16000).astype("float32"), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="vi", word_timestamps=True)
    ws = [(w["word"].strip(), round(w["probability"], 2)) for s in r["segments"] for w in s.get("words", [])]
    print(f"c{c} câu {i}: {r['text'].strip()}")
    print("   soi:", [w for w in ws if any(q in w[0].lower() for q in soi)])
