# toc_do_giong.py — đo tốc độ nói và kéo giãn giọng VieNeu về tốc độ đích (08_giong_am_thanh_phu_de.md mục 0c)
#
# VieNeu không có tham số tốc độ, mỗi giọng đọc một nhịp riêng (đo 27/10/2026: 3,2 đến 5,0 âm tiết mỗi giây có
# tiếng). Đo bằng âm tiết chứ không bằng ký tự: thuật ngữ phiên âm (xi-li-côn) ít chữ cái mỗi âm tiết nên tính
# theo ký tự thì đoạn nhiều thuật ngữ bị đo là chậm và bị kéo quá tay (Hải Đăng: ký tự lệch 11% giữa hai đoạn,
# âm tiết lệch 6%). Đo tốc độ trên phần có tiếng của các câu vừa đọc, rồi kéo giãn bằng bộ lọc atempo của ffmpeg: đổi thời
# lượng, giữ cao độ. Máy không có ffmpeg cài riêng; dùng bản đi kèm Remotion, phải chạy trong thư mục chứa nó
# vì các thư viện .dylib nằm cạnh (chạy từ thư mục khác thì ffmpeg chết vì không nạp được libavdevice.dylib).
# Bản đó bị lược bớt, không có bộ ghi pcm_f32le, nên trao đổi bằng WAV 16 bit.
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

GOC = Path(__file__).resolve().parent.parent
SR = 48000


def tim_ffmpeg():
    co = shutil.which("ffmpeg")
    if co:
        return Path(co)
    for p in [GOC / "xuong/node_modules/@remotion/compositor-darwin-arm64/ffmpeg",
              *sorted(GOC.glob("xuong_dai/*/node_modules/@remotion/compositor-darwin-arm64/ffmpeg"))]:
        if p.exists():
            return p
    raise SystemExit("Không tìm thấy ffmpeg (cần npm install trong xuong/ hoặc một dự án xuong_dai/)")


def cat_lang(x, nguong_db=-40, dem=0.08):
    # phần có tiếng của một câu: bỏ khoảng lặng hai đầu, chừa 0,08 giây
    khung = 480
    e = np.array([np.sqrt(np.mean(x[i:i + khung] ** 2) + 1e-12) for i in range(0, len(x), khung)])
    co = np.where(20 * np.log10(e) > nguong_db)[0]
    if not len(co):
        return x
    return x[max(0, co[0] * khung - int(dem * SR)):min(len(x), (co[-1] + 1) * khung + int(dem * SR))]


def do_toc_do(cac_cau, cac_am, chuan):
    # số âm tiết (sau khi chuẩn hoá: số đổi thành chữ, gạch nối thành dấu cách) chia cho số giây có tiếng
    am_tiet = sum(len(chuan(s).split()) for s in cac_cau)
    giay = sum(len(cat_lang(x)) for x in cac_am) / SR
    return am_tiet / giay


def keo_gian(x, he_so, ffmpeg=None):
    # he_so > 1 là đọc nhanh hơn. atempo nhận 0,5–2,0 mỗi tầng; ngoài khoảng đó thì nối nhiều tầng
    if abs(he_so - 1) < 0.005:
        return x
    ffmpeg = ffmpeg or tim_ffmpeg()
    tang, r = [], he_so
    while r > 2.0:
        tang.append(2.0)
        r /= 2.0
    while r < 0.5:
        tang.append(0.5)
        r /= 0.5
    tang.append(r)
    with tempfile.TemporaryDirectory() as t:
        vao, ra = Path(t) / "vao.wav", Path(t) / "ra.wav"
        sf.write(vao, x, SR, subtype="PCM_16")
        subprocess.run([str(ffmpeg), "-v", "error", "-y", "-i", str(vao), "-af", ",".join(f"atempo={v:.5f}" for v in tang),
                        "-ar", str(SR), str(ra)], check=True, cwd=ffmpeg.parent)
        return sf.read(ra, dtype="float32")[0]
