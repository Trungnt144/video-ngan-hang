# Đo nhạc nền (26/10/2026): độ dài, độ to trung bình (dBFS), khoảng động, đoạn mở đầu nhỏ, trọng tâm phổ (độ sáng âm, Hz),
# tỉ lệ năng lượng dưới 150 Hz, nhịp ước (BPM, có thể lệch nửa hoặc gấp đôi), chênh độ to giữa các khúc 10 giây.
# Cần numpy. ffmpeg dùng bản đi kèm Remotion (bản rút gọn: chỉ xuất được WAV, không có bộ lọc ebur128).
# Chạy: python3 scripts/do_nhac_nen.py xuong_dai/may_bien_ap/node_modules/@remotion/compositor-darwin-arm64/ffmpeg tai_san/nhac_nen/*.mp3
import sys, subprocess, numpy as np, os, json, io, wave
FF = os.path.abspath(sys.argv[1]); files = sys.argv[2:]
SR = 22050
out = []
for f in files:
    raw = subprocess.run([FF, "-v", "quiet", "-i", os.path.abspath(f), "-ac", "1", "-ar", str(SR), "-c:a", "pcm_s16le", "-f", "wav", "-"], capture_output=True, cwd=os.path.dirname(FF), env={**os.environ, "DYLD_LIBRARY_PATH": os.path.dirname(FF)}).stdout
    wv = wave.open(io.BytesIO(raw)); raw = wv.readframes(10**9)
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    dur = len(x) / SR
    # RMS theo cửa sổ 0,4 s
    w = int(0.4 * SR); n = len(x) // w
    r = np.sqrt((x[: n * w].reshape(n, w) ** 2).mean(1) + 1e-12)
    rms_db = 20 * np.log10(np.sqrt((x ** 2).mean()))
    loud = r > 10 ** (-40 / 20)
    p90, p10 = np.percentile(20 * np.log10(r[loud]), [90, 10])
    # khoảng lặng/nhỏ ở đầu: thời điểm RMS đạt 50% mức trung vị
    med = np.median(r[loud]); intro = np.argmax(r > 0.5 * med) * 0.4
    # phổ: trọng tâm phổ (độ sáng âm) và tâm năng lượng dưới 150 Hz (độ nặng bass)
    hop = 512; win = 2048
    frames = np.lib.stride_tricks.sliding_window_view(x, win)[::hop] * np.hanning(win)
    S = np.abs(np.fft.rfft(frames, axis=1)); fr = np.fft.rfftfreq(win, 1 / SR)
    cen = (S * fr).sum(1) / (S.sum(1) + 1e-9); centroid = float(np.median(cen[S.sum(1) > np.percentile(S.sum(1), 20)]))
    bass = float((S[:, fr < 150] ** 2).sum() / (S ** 2).sum())
    # nhịp: hàm khởi âm (spectral flux) rồi tự tương quan
    flux = np.maximum(0, np.diff(np.log1p(S), axis=0)).sum(1)
    flux = flux - np.convolve(flux, np.ones(16) / 16, "same"); flux = np.maximum(flux, 0)
    fps = SR / hop
    ac = np.correlate(flux, flux, "full")[len(flux) - 1:]
    lag = np.arange(len(ac)) / fps
    bpms = 60 / lag[1:]; acv = ac[1:]
    m = (bpms >= 70) & (bpms <= 180)
    # ưu tiên quanh 120 (trọng số log-gauss) để tránh nhầm nửa/đôi nhịp
    wgt = np.exp(-0.5 * (np.log2(bpms[m] / 120) / 0.9) ** 2)
    bpm = float(bpms[m][np.argmax(acv[m] * wgt)])
    # độ đều của năng lượng theo thời gian (biến thiên khúc 10 s)
    seg = int(10 / 0.4); k = len(r) // seg
    segdb = 20 * np.log10(r[: k * seg].reshape(k, seg).mean(1))
    out.append(dict(file=os.path.basename(f), dur=round(dur, 1), rms=round(float(rms_db), 1), dyn=round(float(p90 - p10), 1), intro=round(float(intro), 1), centroid=int(centroid), bass=round(bass, 3), bpm=round(bpm), segspread=round(float(segdb.max() - segdb.min()), 1)))
for o in out: print(json.dumps(o, ensure_ascii=False))
