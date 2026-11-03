#!/bin/sh
# Xuất HTML thành MP4 có nhoè chuyển động kiểu màn trập: chụp FPS×N khung/giây bằng xuat_mp4.mjs,
# với mỗi khung ra lấy M khung phụ đầu (M/N là độ mở màn trập; 4/8 = 180 độ) trộn đều bằng tmix.
# Dùng: sh xuat_nhoe.sh <trang.html> <so_giay> <ra.mp4> [fps=60] [n=8] [m=4] [kich_thuoc=1920x1080] [song_song=2]
set -e
TRANG="$1"; GIAY="$2"; RA="$3"; FPS="${4:-60}"; N="${5:-8}"; M="${6:-4}"; KT="${7:-1920x1080}"; SS="${8:-2}"
DIR="$(cd "$(dirname "$0")" && pwd)"
# Thứ tự tìm FFmpeg: biến FFMPEG, rồi xuong_thu_hyperframes/bin/ffmpeg tính theo vị trí script (xuong_html/cong_cu/../../), cuối cùng đường dẫn tuyệt đối cũ
FF_XUONG="$DIR/../../xuong_thu_hyperframes/bin/ffmpeg"
FF_CU="$HOME/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg"
if [ -n "$FFMPEG" ]; then FF="$FFMPEG"; elif [ -x "$FF_XUONG" ]; then FF="$FF_XUONG"; else FF="$FF_CU"; fi
export FFMPEG="$FF"
export PATH="$HOME/.local/bin:$PATH"
TAM="${RA%.mp4}_tho_${FPS}x${N}.mp4"
node "$DIR/xuat_mp4.mjs" "$TRANG" "$GIAY" --fps $((FPS*N)) --kich-thuoc "$KT" --ra "$TAM" --crf 16 --preset veryfast --song-song "$SS" --cho-ms "${CHO_MS:-0}"
"$FF" -y -v error -i "$TAM" -vf "tmix=frames=$M,select='eq(mod(n\,$N)\,$((M-1)))',setpts=N/($FPS*TB)" -r "$FPS" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p "$RA"
rm -f "$TAM"
[ -s "$RA" ] || { echo "LOI: không ra file $RA" >&2; exit 1; }
echo "xong: $RA"
