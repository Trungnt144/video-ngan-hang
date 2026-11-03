# soat_khung_mp4.py — cắt khung từ chính file mp4 đã kết xuất và ghép thành bảng ảnh 4×4 để soát trước khi giao.
# Lý do: khung `npx remotion still` không lộ lỗi do trạng thái đi qua nhiều khung (90_bai_hoc.md, 26/10/2026).
# Dùng ffmpeg kèm Remotion (thiếu bộ lọc fps/select/tile nên cắt từng khung bằng -ss), ghép bằng Pillow.
# Chạy:
#   python3 scripts/soat_khung_mp4.py xuong_dai/<ten>/node_modules/@remotion/compositor-darwin-arm64 \
#       <file.mp4> <thu_muc_ra> <so_giay_moi_khung>
# Ra: t_<giây>.jpg từng khung và bang_<n>.jpg (16 khung một bảng, góc trái có mốc thời gian).
import sys, os, subprocess
from PIL import Image, ImageDraw
D, video, out, buoc = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
env = dict(os.environ, DYLD_LIBRARY_PATH=D)
os.makedirs(out, exist_ok=True)
dur = float(subprocess.run([D + "/ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0", video], capture_output=True, text=True, env=env).stdout)
ts, t = [], 1.0
# Lấy độ dài luồng hình, không lấy độ dài file: tiếng có thể dài hơn hình (N69 28/10/2026: file 241,1 giây, hình 241,0 giây, cắt ở 241,0 lỗi).
while t < dur - 0.3: ts.append(t); t += buoc
fs = []
for t in ts:
    f = f"{out}/t_{t:05.1f}.jpg"
    subprocess.run([D + "/ffmpeg", "-v", "error", "-ss", str(t), "-i", video, "-frames:v", "1", "-vf", "scale=480:-2", "-y", f], env=env, check=True)
    fs.append((t, f))
C, R = 4, 4
for k in range(0, len(fs), C * R):
    g = fs[k:k + C * R]
    w, h = Image.open(g[0][1]).size
    s = Image.new("RGB", (C * w, R * h), "white"); d = ImageDraw.Draw(s)
    for j, (t, f) in enumerate(g):
        x, y = (j % C) * w, (j // C) * h
        s.paste(Image.open(f), (x, y)); d.rectangle([x, y, x + 52, y + 16], fill="black"); d.text((x + 4, y + 2), f"{int(t)//60}:{int(t)%60:02d}", fill="yellow")
    s.save(f"{out}/bang_{k // (C * R) + 1}.jpg", quality=82)
print(len(fs), "khung")
