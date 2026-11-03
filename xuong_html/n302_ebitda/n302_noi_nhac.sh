#!/bin/bash
# N302 (chép từ N198, gốc N154): nối lặp nhạc NH00 Close Up (Michael Ramir C., Mixkit 1167, 95,1 giây) có mờ chéo 4 giây cho đủ độ dài video (08_giong_am_thanh_phu_de.md mục 7).
# Bài không có đoạn đầu nhỏ nên không cắt; mỗi lần lặp mờ chéo 4 giây (chu kỳ 120,8 giây). Dùng: bash n302_noi_nhac.sh <so_giay_video>
set -e
cd "$(dirname "$0")"
FF=../../xuong_thu_hyperframes/bin/ffmpeg
BAI=../../tai_san/nhac_nen/mixkit-close-up-1167.mp3
N=$(python3 -c "import math,sys; print(max(2, math.ceil((float(sys.argv[1]) + 4) / 91.1)))" "$1")
IN=""; FG=""
for ((i=0;i<N;i++)); do IN="$IN -i $BAI"; done
PREV="[0:a]"
for ((i=1;i<N;i++)); do
  OUT="[x$i]"; [ $i -eq $((N-1)) ] && OUT="[y]"
  FG="$FG$PREV[$i:a]acrossfade=d=4:c1=tri:c2=tri$OUT;"
  PREV="[x$i]"
done
$FF -v error -y $IN -filter_complex "${FG%;}" -map "[y]" -t "$1" -ar 48000 am_thanh/n302_nhac_noi.wav
echo "đã ghi am_thanh/n302_nhac_noi.wav ($1 giây, $N lần lặp)"
