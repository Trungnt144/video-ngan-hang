# N199 (đợt C): nghe lại câu đã đọc ở hai lề cắt 0,05 và 0,4 giây (theo soát độc lập), in chữ Whisper nghe được.
# Dùng: .venv_vieneu/bin/python xuong_html/n199_hoat_dong_huy_dong_von/n199_hai_le.py <chương>:<câu> ...
import sys, json, soundfile as sf, soxr, mlx_whisper
from pathlib import Path
G = Path(__file__).resolve().parent / "am_thanh"
for a in sys.argv[1:]:
    c, i = map(int, a.split(":"))
    x, sr = sf.read(str(G / f"c{c}.wav"))
    if x.ndim > 1: x = x.mean(1)
    m = json.loads((G / f"c{c}.moc_cau.json").read_text())["cau"][i - 1]
    for le in (0.05, 0.4):
        seg = x[int(max(0, m["bd"] - le) * sr): int((m["kt"] + le) * sr)]
        r = mlx_whisper.transcribe(soxr.resample(seg, sr, 16000).astype("float32"), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="vi")
        print(f"c{c} câu {i} lề {le}: {r['text'].strip()}", flush=True)
