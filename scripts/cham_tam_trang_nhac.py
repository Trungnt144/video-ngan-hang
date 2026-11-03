# Chấm tâm trạng và tiết tấu nhạc nền (27/10/2026).
# Tâm trạng: mô hình CLAP laion/clap-htsat-unfused so đoạn nhạc (bản larger_clap_music cho mọi bài cùng một véc-tơ, đã thử 27/10/2026) với câu mô tả từng nhóm, lấy 3 đoạn 10 giây (20%, 50%, 80% bài).
# Tiết tấu: librosa ước nhịp (BPM) và mật độ khởi âm (số nốt bắt đầu mỗi giây).
# Có lời hay không: CLAP so "có giọng hát" với "không lời"; chỉ là gợi ý, phải nghe lại.
# Chạy: .venv_nhac/bin/python scripts/cham_tam_trang_nhac.py tai_san/nhac_nen/*.mp3 > tai_san/nhac_nen/cham_tam_trang.jsonl
import sys, json, os, numpy as np, librosa, torch
from transformers import ClapModel, ClapProcessor

NHOM = {
    "VUI": "cheerful upbeat happy background music",
    "TAP": "calm focused background music for concentration",
    "TRAM": "serious dark documentary background music",
    "BUON": "sad melancholic emotional music",
    "HOI": "tense suspenseful thriller music",
    "HUNG": "epic heroic powerful orchestral music",
}
LOI = ["music with a singing voice and lyrics", "instrumental music without vocals"]

model = ClapModel.from_pretrained("laion/clap-htsat-unfused").eval()
proc = ClapProcessor.from_pretrained("laion/clap-htsat-unfused")
def vec(o):
    o = o if torch.is_tensor(o) else o.pooler_output
    return o / o.norm(dim=-1, keepdim=True)


with torch.no_grad():
    t = proc(text=list(NHOM.values()) + LOI, return_tensors="pt", padding=True)
    te = vec(model.get_text_features(**t))

for f in sys.argv[1:]:
    y, sr = librosa.load(f, sr=48000, mono=True)
    dur = len(y) / sr
    doan = [y[int(p * len(y)): int(p * len(y)) + 10 * sr] for p in (0.2, 0.5, 0.8)]
    with torch.no_grad():
        a = proc(audios=doan, sampling_rate=48000, return_tensors="pt")
        ae = vec(model.get_audio_features(**a))
        s = (ae @ te.T).mean(0) * 30
    p = torch.softmax(s[: len(NHOM)], 0).numpy()
    pl = torch.softmax(s[len(NHOM):], 0).numpy()
    y22 = librosa.resample(y, orig_sr=sr, target_sr=22050)
    env = librosa.onset.onset_strength(y=y22, sr=22050)
    bpm = float(np.atleast_1d(librosa.feature.tempo(onset_envelope=env, sr=22050))[0])
    on = len(librosa.onset.onset_detect(onset_envelope=env, sr=22050)) / dur
    diem = {k: round(float(v), 3) for k, v in zip(NHOM, p)}
    xep = sorted(diem, key=diem.get, reverse=True)
    print(json.dumps(dict(file=os.path.basename(f), dai=round(dur, 1), bpm=round(bpm), khoi_am_moi_giay=round(on, 2),
                          nhom_1=xep[0], nhom_2=xep[1], diem=diem, co_loi=round(float(pl[0]), 2)), ensure_ascii=False), flush=True)
