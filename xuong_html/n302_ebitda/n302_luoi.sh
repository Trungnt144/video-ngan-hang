#!/bin/bash
# N302: ghép 4 ảnh tĩnh thành ảnh lưới 2x2 rộng 1920 px, không nhãn (python3 hệ thống có thể thiếu PIL nên dùng ffmpeg).
# Dùng: bash n302_luoi.sh <ra.jpg> <a.png> <b.png> <c.png> <d.png>
set -e
FF="$(cd "$(dirname "$0")" && pwd)/../../xuong_thu_hyperframes/bin/ffmpeg"
"$FF" -v error -y -i "$2" -i "$3" -i "$4" -i "$5" -filter_complex "[0:v]scale=960:540[a];[1:v]scale=960:540[b];[2:v]scale=960:540[c];[3:v]scale=960:540[d];[a][b][c][d]xstack=inputs=4:layout=0_0|960_0|0_540|960_540[o]" -map "[o]" -frames:v 1 -q:v 2 "$1"
echo "đã ghi $1"
