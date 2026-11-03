#!/bin/bash
# cat_khung_xem.sh — cắt N khung đều từ một MP4 thành ảnh lẻ và ghép 1–2 ảnh lưới để xem một lần.
#
# Mục đích: Claude xem video bằng ảnh. Một ảnh lưới (mặc định 3 cột × 4 hàng = 12 khung, ngang 1566 điểm ảnh, vừa
# giới hạn đọc ảnh) cho thấy cả nhịp của video trong một lần Read; ảnh lẻ cỡ gốc dùng để soi chữ, dấu tiếng Việt, mép khung.
#
# Dùng: bash cat_khung_xem.sh <video.mp4> <thu_muc_ra> [N] [--moc 1.5,3,7.25] [--tien-to v1] [--cot 3] [--khong-anh-le]
#   N              số khung cắt đều (mặc định 12). Khung thứ i lấy ở giây D×(i+0,5)/N (tránh khung đen đầu và cuối).
#   --moc a,b,c    cắt đúng các giây này thay cho cắt đều (N bị bỏ qua).
#   --tien-to TEN  tiền tố tên file (mặc định tên video bỏ đuôi).
#   --cot C        số cột của lưới (mặc định 3; số hàng tự tính, mỗi lưới tối đa 12 ô, hơn 12 khung thì chia đúng 2 lưới).
#   --khong-anh-le không lưu ảnh lẻ cỡ gốc (chỉ giữ lưới).
# Ra:  <thu_muc_ra>/<tien_to>_<giay>.png    ảnh lẻ cỡ gốc (giây viết dạng 003.50)
#      <thu_muc_ra>/<tien_to>_luoi_1.jpg    ảnh lưới (và _luoi_2.jpg nếu có), mỗi ô có nhãn giây góc trái trên
#      <thu_muc_ra>/<tien_to>_luoi_1.txt    thứ tự ô → giây
# Tối đa 24 khung (2 lưới × 12). Biến môi trường FFMPEG: đường dẫn ffmpeg.
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
FF_XUONG="$DIR/../../xuong_thu_hyperframes/bin/ffmpeg"
FF_CU="$HOME/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg"
if [ -n "${FFMPEG:-}" ]; then FF="$FFMPEG"
elif [ -x "$FF_XUONG" ]; then FF="$FF_XUONG"
elif [ -x "$FF_CU" ]; then FF="$FF_CU"
else FF="$(command -v ffmpeg || true)"; fi
[ -n "$FF" ] && [ -x "$FF" ] || { echo "LOI: không tìm thấy ffmpeg (đặt biến FFMPEG)" >&2; exit 2; }
loi() { echo "LOI: $*" >&2; exit 2; }
huong_dan() { awk 'NR > 1 && /^#/ { sub(/^# ?/, ""); print; next } NR > 1 { exit }' "$0" >&2; }

VIDEO=""; RA=""; N=""; MOC=""; TIENTO=""; COT=3; LE=1
while [ $# -gt 0 ]; do
  case "$1" in
    --moc) MOC="${2:?thiếu giá trị cho --moc}"; shift 2 ;;
    --tien-to) TIENTO="${2:?}"; shift 2 ;;
    --cot) COT="${2:?}"; shift 2 ;;
    --khong-anh-le) LE=0; shift ;;
    -h|--help) huong_dan; exit 0 ;;
    -*) loi "tuỳ chọn không biết: $1" ;;
    *) if [ -z "$VIDEO" ]; then VIDEO="$1"; elif [ -z "$RA" ]; then RA="$1"; elif [ -z "$N" ]; then N="$1"; else loi "thừa tham số: $1"; fi; shift ;;
  esac
done
[ -n "$VIDEO" ] && [ -n "$RA" ] || { huong_dan; exit 2; }
[ -f "$VIDEO" ] || loi "không thấy video: $VIDEO"
N="${N:-12}"
case "$N" in ''|*[!0-9]*) loi "N phải là số nguyên dương" ;; esac
[ "$N" -ge 1 ] && [ "$N" -le 24 ] || loi "N từ 1 đến 24"
case "$COT" in ''|*[!0-9]*) loi "--cot phải là số nguyên dương" ;; esac
[ "$COT" -ge 1 ] || loi "--cot phải từ 1"
[ -n "$TIENTO" ] || { TIENTO="$(basename "$VIDEO")"; TIENTO="${TIENTO%.*}"; }
mkdir -p "$RA"
TAM="$(mktemp -d "${TMPDIR:-/tmp}/cat_khung.XXXXXX")"
trap 'rm -rf "$TAM"' EXIT

# Độ dài và kích thước video, đọc từ ffmpeg (không cần ffprobe)
THONG_TIN="$("$FF" -hide_banner -i "$VIDEO" 2>&1 || true)"
D="$(printf '%s\n' "$THONG_TIN" | sed -n 's/^.*Duration: \([0-9][0-9]*\):\([0-9][0-9]\):\([0-9.][0-9.]*\).*$/\1 \2 \3/p' | head -1 | awk '{ printf "%.3f", $1*3600 + $2*60 + $3 }')"
KT="$(printf '%s\n' "$THONG_TIN" | grep -E "Stream .*Video:" | head -1 | grep -oE '[0-9]{2,5}x[0-9]{2,5}' | head -1)"
[ -n "$D" ] && [ -n "$KT" ] || loi "không đọc được độ dài hoặc kích thước video"
RONG="${KT%x*}"; CAO="${KT#*x}"

# Danh sách giây cần cắt
if [ -n "$MOC" ]; then
  GIAYS="$(printf '%s' "$MOC" | tr ',' ' ')"
else
  GIAYS="$(awk -v d="$D" -v n="$N" 'BEGIN{ for (i = 0; i < n; i++) printf "%.3f ", d*(i+0.5)/n }')"
fi
SO=0; for g in $GIAYS; do SO=$((SO+1)); done
[ "$SO" -ge 1 ] && [ "$SO" -le 24 ] || loi "số mốc phải từ 1 đến 24 (đang có $SO)"

# Cắt từng khung: ảnh lẻ cỡ gốc và ảnh nhỏ có nhãn giây
FONT=""
for f in "/System/Library/Fonts/Supplemental/Arial Bold.ttf" "/System/Library/Fonts/Helvetica.ttc" "/Library/Fonts/Arial Unicode.ttf"; do
  [ -f "$f" ] && { FONT="$f"; break; }
done
# Mỗi lưới tối đa 12 ô; hơn 12 khung thì chia đều thành đúng 2 lưới
if [ "$SO" -le 12 ]; then PER="$SO"; else PER=$(( (SO + 1) / 2 )); fi
HANG=$(( (PER + COT - 1) / COT ))
# Bề rộng mỗi ô sao cho cả lưới ngang tối đa 1566 điểm ảnh (giới hạn đọc ảnh), chia hết cho 2
OW=$(( ((1566 - 8 - 4 * (COT - 1)) / COT) / 2 * 2 )); [ "$OW" -le "$RONG" ] || OW="$RONG"   # trừ lề 4 + khoảng cách 4 của bộ lọc tile
i=0
for g in $GIAYS; do
  i=$((i+1)); NN="$(printf '%02d' "$i")"
  if awk -v g="$g" -v d="$D" 'BEGIN{ exit !(g < 0 || g > d) }'; then loi "mốc $g s ngoài video (dài $D s)"; fi
  NHAN="$(awk -v g="$g" 'BEGIN{ printf "%.2f s", g }')"
  TEN_GIAY="$(awk -v g="$g" 'BEGIN{ printf "%06.2f", g }')"
  "$FF" -y -hide_banner -loglevel error -ss "$g" -i "$VIDEO" -frames:v 1 "$TAM/g_$NN.png"
  [ -s "$TAM/g_$NN.png" ] || loi "không cắt được khung ở $g s"
  if [ -n "$FONT" ]; then
    LOC="scale=$OW:-2,drawtext=fontfile='$FONT':text='$NHAN':x=8:y=8:fontsize=$((OW/22)):fontcolor=white:box=1:boxcolor=black@0.65:boxborderw=5"
  else
    LOC="scale=$OW:-2"
  fi
  "$FF" -y -hide_banner -loglevel error -i "$TAM/g_$NN.png" -vf "$LOC" "$TAM/n_$NN.png"
  if [ "$LE" = 1 ]; then cp "$TAM/g_$NN.png" "$RA/${TIENTO}_${TEN_GIAY}.png"; fi
  echo "$NN $g" >> "$TAM/ds.txt"
done

# Ghép lưới: lưới 1 gồm khung 1..PER, lưới 2 (nếu có) gồm các khung còn lại
LUOI=1; BAT_DAU=1
while [ "$BAT_DAU" -le "$SO" ]; do
  KET=$(( BAT_DAU + PER - 1 )); [ "$KET" -le "$SO" ] || KET="$SO"
  SL=$(( KET - BAT_DAU + 1 ))
  H=$(( (SL + COT - 1) / COT ))
  C="$COT"; [ "$SL" -ge "$COT" ] || C="$SL"
  OUT="$RA/${TIENTO}_luoi_${LUOI}.jpg"
  "$FF" -y -hide_banner -loglevel error -framerate 1 -start_number "$BAT_DAU" -i "$TAM/n_%02d.png" -frames:v "$SL" \
    -vf "tile=${C}x${H}:padding=4:margin=4:color=0x202020" -frames:v 1 -q:v 3 "$OUT"
  [ -s "$OUT" ] || loi "không ghép được lưới $LUOI"
  awk -v a="$BAT_DAU" -v b="$KET" 'NR >= a && NR <= b { printf "ô %d: %s s\n", NR - a + 1, $2 }' "$TAM/ds.txt" > "$RA/${TIENTO}_luoi_${LUOI}.txt"
  echo "lưới $LUOI: $OUT ($SL khung, $C cột × $H hàng)"
  LUOI=$((LUOI+1)); BAT_DAU=$((KET+1))
done
[ "$LE" = 0 ] || echo "ảnh lẻ cỡ gốc ${RONG}x${CAO}: $RA/${TIENTO}_<giây>.png ($SO ảnh)"
