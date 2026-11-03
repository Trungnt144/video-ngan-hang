# quet_khung_hong.py — quét MỌI khung của file mp4 để tìm khung hỏng ngẫu nhiên khi Remotion kết xuất WebGL.
#
# Lỗi cần bắt (90_bai_hoc.md, 27/10/2026): thỉnh thoảng một khung bị ghi ra với lớp chữ lặp thành lưới 3×3
# và mất hình 3D. `remotion still` không bị, bảng soát 3 giây một khung (soat_khung_mp4.py) không bắt được.
#
# Cách dò: rã mp4 thành ảnh xám 160×90 bằng ffmpeg kèm Remotion, tính độ chênh trung bình giữa các khung.
# Khung i bị đánh dấu khi nó lệch hẳn cả khung trước lẫn khung sau (cả hai > ngưỡng), trong khi khung trước
# và khung sau lại gần nhau (độ chênh của chúng < nửa độ chênh nhỏ hơn). Chuyển cảnh thật không bị đánh dấu,
# vì sau chuyển cảnh khung i+1 vẫn giống khung i.
#
# Cách dùng (chạy ở gốc Media/):
#   .venv_vieneu/bin/python scripts/quet_khung_hong.py <file.mp4> [--nguong 4] [--ffmpeg <thư mục>]
# --ffmpeg: thư mục chứa ffmpeg và ffprobe của Remotion; bỏ trống thì tự lấy thư mục đầu tiên tìm thấy ở
#   xuong_dai/*/node_modules/@remotion/compositor-darwin-arm64.
# Ra màn hình: số khung, từng khung nghi hỏng (số khung tính từ 0, đúng số khung của Remotion; giây; độ chênh
# với khung trước, khung sau, và giữa khung trước với khung sau), tổng số khung nghi hỏng.
# Mã thoát 0 khi không có khung nghi hỏng, 1 khi có.
#
# Cách thay khung hỏng mà không kết xuất lại cả video (trong xuong_dai/<tên>/):
#   1. Rã video thành ảnh:  <ffmpeg> -i out/video.mp4 -q:v 2 khung/k%05d.jpg   (k00001.jpg là khung 0)
#   2. Kết xuất lại từng khung hỏng N:  npx remotion still <MaThanhPhan> khung/k<N+1, 5 chữ số>.jpg \
#        --frame=N --jpeg-quality=95
#   3. Ghép lại, giữ nguyên tiếng của bản cũ:
#        <ffmpeg> -framerate 30 -i khung/k%05d.jpg -i out/video.mp4 -map 0:v -map 1:a -c:v libx264 \
#          -pix_fmt yuv420p -crf 18 -c:a copy out/video_sua.mp4
#   4. Quét lại file mới bằng script này.
# Mọi lệnh ffmpeg kèm Remotion cần biến môi trường DYLD_LIBRARY_PATH=<thư mục ffmpeg>.
import argparse, glob, os, subprocess, sys, tempfile, shutil
import numpy as np
from PIL import Image

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def tim_ffmpeg():
    for d in sorted(glob.glob(os.path.join(GOC, "xuong_dai/*/node_modules/@remotion/compositor-darwin-arm64"))):
        if os.path.isfile(os.path.join(d, "ffmpeg")):
            return d
    sys.exit("Không tìm thấy ffmpeg của Remotion; truyền --ffmpeg <thư mục>")


def main():
    p = argparse.ArgumentParser(description="Quét mọi khung mp4 tìm khung hỏng ngẫu nhiên")
    p.add_argument("mp4")
    p.add_argument("--nguong", type=float, default=4.0, help="độ chênh tối thiểu với khung trước và sau (thang 0-255)")
    p.add_argument("--ffmpeg", help="thư mục chứa ffmpeg, ffprobe của Remotion")
    a = p.parse_args()
    d = a.ffmpeg or tim_ffmpeg()
    env = {**os.environ, "DYLD_LIBRARY_PATH": d}

    r = subprocess.run([f"{d}/ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                        "stream=r_frame_rate", "-of", "csv=p=0", a.mp4], capture_output=True, text=True, env=env)
    t, m = ((r.stdout.strip().split() or ["30/1"])[0].strip(",") or "30/1").split("/")
    fps = float(t) / float(m)

    tmp = tempfile.mkdtemp()
    try:
        subprocess.run([f"{d}/ffmpeg", "-v", "error", "-i", a.mp4, "-s", "160x90", "-q:v", "3",
                        f"{tmp}/k%05d.jpg"], env=env, check=True)
        fs = sorted(glob.glob(f"{tmp}/k*.jpg"))
        k = np.stack([np.asarray(Image.open(f).convert("L"), np.uint8) for f in fs]).astype(np.int16)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    print("file", a.mp4)
    print("số khung", len(k), "·", round(fps, 3), "khung/giây")
    ch = lambda i, j: float(np.abs(k[i] - k[j]).mean())
    n = 0
    for i in range(1, len(k) - 1):
        tr, sa = ch(i, i - 1), ch(i, i + 1)
        if tr > a.nguong and sa > a.nguong:
            ts = ch(i - 1, i + 1)
            if ts < min(tr, sa) / 2:
                print(f"khung nghi hỏng {i} (giây {i / fps:.2f}): chênh khung trước {tr:.1f}, khung sau {sa:.1f}, trước-sau {ts:.1f}")
                n += 1
    print("tổng khung nghi hỏng", n)
    sys.exit(1 if n else 0)


if __name__ == "__main__":
    main()
