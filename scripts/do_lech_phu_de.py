# Đo độ lệch phụ đề chạy chữ so với tiếng (module 10 mục 19). Viết cho đoạn thử BESS chương 3; đo video khác thì sửa đường dẫn.
# Chạy từ gốc Media: .venv_vieneu/bin/python scripts/do_lech_phu_de.py <thư mục tạm có c3_clip.wav (tiếng mp4, 16 kHz một kênh)>
import json, sys, difflib
import numpy as np, soundfile as sf, mlx_whisper
sys.path.insert(0, "scripts")
from sinh_giong_vieneu import chuan
S = sys.argv[1]
tg = json.load(open("xuong_dai/bess/src/thoi_gian.json"))
c = [x for x in tg["chuong"] if x["id"] == 3][0]
FPS = 30
# mốc tô đỏ từng từ (giây trong đoạn thử, đoạn thử bắt đầu từ khung đầu chương 3)
hl = [(w["chu"], w["f"] / FPS) for cau in c["cau"] for w in cau["tu_moc"]]
# A. Mốc bắt đầu câu theo năng lượng âm của tiếng giọng (không dùng Whisper)
y, sr = sf.read("xuong_dai/bess/public/giong/c3.wav", dtype="float32")
lech_voice = (c["cau"][0]["f_tieng"] - c["cau"][0]["tu"]) / FPS
win = int(0.01 * sr)
rms = np.sqrt(np.convolve(y**2, np.ones(win) / win, mode="same"))
nguong = 0.05 * rms.max()
A = []
for cau in c["cau"]:
    t0 = cau["tu"] / FPS - 0.15  # tìm từ trước mốc câu 0,15 giây
    i = int(max(0, t0) * sr)
    while rms[i] < nguong: i += 1
    A.append((cau["chu"][:25], lech_voice + i / sr, cau["tu_moc"][0]["f"] / FPS))
print("A. Bắt đầu câu: tiếng (năng lượng) vs chữ đỏ đầu câu")
la = []
for ten, t_am, t_chu in A:
    la.append(t_chu - t_am); print(f"  {ten:27s} tiếng {t_am:6.3f}  chữ {t_chu:6.3f}  lệch {1000*(t_chu-t_am):+5.0f} ms")
# B. Whisper nghe lại cả đoạn mp4 (có nhạc nền, một lượt, không cắt theo câu)
r = mlx_whisper.transcribe(np.asarray(sf.read(f"{S}/c3_clip.wav", dtype="float32")[0]), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="vi", word_timestamps=True)
W = []
for s in r["segments"]:
    for w in s["words"]:
        for x in chuan(w["word"]).split(): W.append((x, w["start"]))
H = []
for chu, t in hl:
    xs = chuan(chu).split()
    if xs: H.append((xs[0], t, chu))
m = difflib.SequenceMatcher(None, [h[0] for h in H], [w[0] for w in W], autojunk=False)
lb = []
for blk in m.get_matching_blocks():
    for k in range(blk.size):
        h, w = H[blk.a + k], W[blk.b + k]
        lb.append(h[1] - w[1])
lb = np.array(lb)
print(f"B. Từng từ: {len(lb)}/{len(H)} từ khớp chữ; lệch chữ trừ tiếng (ms): trung vị {1000*np.median(lb):+.0f}, trung bình {1000*lb.mean():+.0f}, "
      f"trị tuyệt đối trung vị {1000*np.median(abs(lb)):.0f}, phân vị 90 {1000*np.percentile(abs(lb),90):.0f}, lớn nhất {1000*abs(lb).max():.0f}; "
      f"lệch ≤ 1 khung (33 ms): {np.mean(abs(lb)<=0.034):.0%}, ≤ 100 ms: {np.mean(abs(lb)<=0.1):.0%}")
json.dump({"A": A, "B_lech": lb.tolist()}, open(f"{S}/do_lech.json", "w"), ensure_ascii=False)
for blk in m.get_matching_blocks():
    for k in range(blk.size):
        h, w = H[blk.a + k], W[blk.b + k]
        if abs(h[1]-w[1]) > 0.1: print(f"  lệch lớn: {h[2]:12s} chữ {h[1]:.3f} tiếng {w[1]:.3f} ({1000*(h[1]-w[1]):+.0f} ms)")
print("Whisper đoạn:", r["text"])
# B'. Bỏ từ đứng sau chỗ nghỉ (đầu câu, sau dấu phẩy): Whisper nghe cả đoạn kéo mốc từ đó lùi về cuối từ trước
sau_nghi, truoc = set(), None
idx = 0
for cau in c["cau"]:
    for j, w in enumerate(cau["tu_moc"]):
        if chuan(w["chu"]).split():
            if j == 0 or (truoc and truoc[-1] in ",.;:"): sau_nghi.add(idx)
            idx += 1
        truoc = w["chu"]
lb2 = np.array([H[b.a+k][1]-W[b.b+k][1] for b in m.get_matching_blocks() for k in range(b.size) if b.a+k not in sau_nghi])
print(f"B'. {len(lb2)} từ giữa câu: trị tuyệt đối trung vị {1000*np.median(abs(lb2)):.0f} ms, trung bình {1000*np.mean(lb2):+.0f}, phân vị 90 {1000*np.percentile(abs(lb2),90):.0f}, lớn nhất {1000*abs(lb2).max():.0f}; ≤ 1 khung {np.mean(abs(lb2)<=0.034):.0%}, ≤ 100 ms {np.mean(abs(lb2)<=0.1):.0%}")
