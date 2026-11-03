#!/bin/bash
# ghep_am_thanh.sh — ghép MP4 hình (không tiếng) với giọng đọc và/hoặc nhạc nền thành MP4 có tiếng.
#
# Việc làm, theo thứ tự:
#   1. Giọng (WAV hoặc MP3): đổi về 48 kHz stereo, tuỳ chọn dời --giong-tre giây, cắt hoặc đệm lặng cho đúng độ dài video.
#   2. Nhạc nền: lặp nếu ngắn hơn video, cắt đúng độ dài video, hạ --nhac-db dB, mờ dần --mo-dan giây cuối.
#   3. Hạ nhạc dưới giọng: bộ nén sidechain (giọng điều khiển bộ nén của nhạc), nhạc tự nhỏ đi lúc có giọng, to lại ở quãng nghỉ.
#   4. Trộn giọng với nhạc, chuẩn độ to tổng −14 LUFS (loudnorm hai lượt: đo rồi chỉnh tuyến tính), đỉnh thật tối đa −2 dBTP.
#   5. Giữ nguyên luồng hình (-c:v copy), mã hoá tiếng AAC 192 kbit/s, đặt moov ở đầu file (faststart).
#   6. Kiểm: file ra có, có luồng tiếng, độ dài lệch video dưới 0,15 giây, đo lại độ to thực của file ra.
#
# Dùng: bash ghep_am_thanh.sh <video.mp4> <ra.mp4> [--giong FILE] [--nhac FILE]
#         [--nhac-db -10] [--mo-dan 2] [--giong-tre 0] [--chuan-lufs -14] [--khong-ha-nhac]
#   Cần ít nhất một trong --giong, --nhac.
#   --nhac-db     độ to nền của nhạc so với bản gốc, dB (mặc định −10); bộ nén sidechain hạ thêm khi có giọng
#   --mo-dan      số giây mờ dần cuối nhạc (mặc định 2)
#   --giong-tre   dời giọng muộn đi N giây (mặc định 0)
#   --chuan-lufs  độ to đích, LUFS (mặc định −14)
#   --khong-ha-nhac  không dùng bộ nén sidechain, nhạc giữ nguyên độ to nền
# Biến môi trường FFMPEG: đường dẫn ffmpeg (mặc định ffmpeg của xuong_thu_hyperframes tính theo vị trí script,
# rồi đường dẫn tuyệt đối cũ, rồi ffmpeg trong PATH).
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

VIDEO=""; RA=""; GIONG=""; NHAC=""; NHAC_DB="-10"; MO_DAN="2"; GIONG_TRE="0"; LUFS="-14"; HA_NHAC=1
while [ $# -gt 0 ]; do
  case "$1" in
    --giong) GIONG="${2:?thiếu giá trị cho --giong}"; shift 2 ;;
    --nhac) NHAC="${2:?thiếu giá trị cho --nhac}"; shift 2 ;;
    --nhac-db) NHAC_DB="${2:?}"; shift 2 ;;
    --mo-dan) MO_DAN="${2:?}"; shift 2 ;;
    --giong-tre) GIONG_TRE="${2:?}"; shift 2 ;;
    --chuan-lufs) LUFS="${2:?}"; shift 2 ;;
    --khong-ha-nhac) HA_NHAC=0; shift ;;
    -h|--help) huong_dan; exit 0 ;;
    -*) loi "tuỳ chọn không biết: $1" ;;
    *) if [ -z "$VIDEO" ]; then VIDEO="$1"; elif [ -z "$RA" ]; then RA="$1"; else loi "thừa tham số: $1"; fi; shift ;;
  esac
done
[ -n "$VIDEO" ] && [ -n "$RA" ] || { huong_dan; exit 2; }
[ -n "$GIONG" ] || [ -n "$NHAC" ] || loi "cần ít nhất một trong --giong, --nhac"
[ -f "$VIDEO" ] || loi "không thấy video: $VIDEO"
[ -z "$GIONG" ] || [ -f "$GIONG" ] || loi "không thấy file giọng: $GIONG"
[ -z "$NHAC" ] || [ -f "$NHAC" ] || loi "không thấy file nhạc: $NHAC"
[ "$VIDEO" != "$RA" ] || loi "file ra phải khác file video"

# Độ dài (giây) của một file, đọc từ dòng Duration của ffmpeg (không cần ffprobe)
do_dai() {
  { "$FF" -hide_banner -i "$1" 2>&1 || true; } | sed -n 's/^.*Duration: \([0-9][0-9]*\):\([0-9][0-9]\):\([0-9.][0-9.]*\).*$/\1 \2 \3/p' | head -1 \
    | awk '{ printf "%.3f", $1*3600 + $2*60 + $3 }'
}
D="$(do_dai "$VIDEO")"
[ -n "$D" ] && awk -v d="$D" 'BEGIN{exit !(d>0)}' || loi "không đọc được độ dài video: $VIDEO"
echo "video: $VIDEO (${D} s)"
if [ -n "$GIONG" ]; then
  DG="$(do_dai "$GIONG")"; echo "giọng: $GIONG (${DG:-?} s)"
  awk -v g="${DG:-0}" -v t="$GIONG_TRE" -v d="$D" 'BEGIN{ if (g + t > d + 0.15) printf "CANH BAO: giọng dài %.2f s (kể cả dời %.2f s) hơn video %.2f s, phần dư bị cắt\n", g+t, t, d > "/dev/stderr" }'
fi
[ -z "$NHAC" ] || echo "nhạc: $NHAC ($(do_dai "$NHAC") s, nối lặp nếu ngắn hơn video)"

# Mờ dần không dài hơn video
MO="$(awk -v m="$MO_DAN" -v d="$D" 'BEGIN{ if (m > d) m = d; printf "%.3f", m }')"
ST="$(awk -v m="$MO" -v d="$D" 'BEGIN{ printf "%.3f", d - m }')"
TRE_MS="$(awk -v t="$GIONG_TRE" 'BEGIN{ printf "%d", t*1000 }')"

# Đầu vào: 0 = video; sau đó giọng, nhạc. Nhạc ngắn hơn video thì nạp cùng file đủ số lần rồi nối bằng concat,
# filter cắt lại bằng atrim. Không dùng -stream_loop -1: ffmpeg 6.0 treo không thoát khi nhạc dài đúng bằng
# video (90_bai_hoc.md ngày 29/10/2026).
IN=(-i "$VIDEO"); IDX=1; IG=""; IM=""; NHAN_NHAC=""; SO_LAN=1
if [ -n "$GIONG" ]; then IN+=(-i "$GIONG"); IG=$IDX; IDX=$((IDX+1)); fi
if [ -n "$NHAC" ]; then
  DN="$(do_dai "$NHAC")"
  SO_LAN="$(awk -v d="$D" -v n="${DN:-0}" 'BEGIN{ k = 1; if (n > 0) { k = int(d / n); if (k * n < d) k++ }; if (k < 1) k = 1; if (k > 50) k = 50; print k }')"
  IM=$IDX
  for ((k = 0; k < SO_LAN; k++)); do IN+=(-i "$NHAC"); NHAN_NHAC+="[$((IM+k)):a]"; done
fi

FMT="aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo"
NOI_NHAC=""; [ "$SO_LAN" -gt 1 ] && NOI_NHAC="concat=n=$SO_LAN:v=0:a=1,"
G_GIONG="[$IG:a]$FMT,adelay=${TRE_MS}|${TRE_MS},apad=whole_dur=$D,atrim=0:$D,asetpts=PTS-STARTPTS"
G_NHAC="$NHAN_NHAC${NOI_NHAC}$FMT,atrim=0:$D,asetpts=PTS-STARTPTS,volume=${NHAC_DB}dB,afade=t=out:st=$ST:d=$MO"
if [ -n "$IG" ] && [ -n "$IM" ]; then
  if [ "$HA_NHAC" = 1 ]; then
    BASE="$G_GIONG,asplit=2[v1][v2];$G_NHAC[m];[m][v2]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=500[md];[v1][md]amix=inputs=2:duration=longest:normalize=0[mix]"
  else
    BASE="$G_GIONG[v1];$G_NHAC[md];[v1][md]amix=inputs=2:duration=longest:normalize=0[mix]"
  fi
elif [ -n "$IG" ]; then
  BASE="$G_GIONG[mix]"
else
  BASE="$G_NHAC[mix]"
fi
TP="-2"; LRA="11"

# Lượt 1: đo độ to của bản trộn
echo "đo độ to (lượt 1)..."
JSON="$("$FF" -hide_banner -nostats "${IN[@]}" -filter_complex "$BASE;[mix]loudnorm=I=$LUFS:TP=$TP:LRA=$LRA:print_format=json[o]" -map "[o]" -vn -t "$D" -f null - 2>&1 || true)"
lay() { printf '%s\n' "$JSON" | grep "\"$1\"" | head -1 | sed 's/^.*: *"\([^"]*\)".*$/\1/'; }
MI="$(lay input_i)"; MTP="$(lay input_tp)"; MLRA="$(lay input_lra)"; MTH="$(lay input_thresh)"; MOFF="$(lay target_offset)"
[ -n "$MI" ] && [ -n "$MTP" ] && [ -n "$MLRA" ] && [ -n "$MTH" ] && [ -n "$MOFF" ] || { printf '%s\n' "$JSON" | tail -20 >&2; loi "lượt đo độ to không ra số (xem log ở trên)"; }
echo "  bản trộn thô: ${MI} LUFS, đỉnh thật ${MTP} dBTP"
case "$MI" in -inf|inf|nan) loi "bản trộn không có tín hiệu (độ to $MI): kiểm file giọng, nhạc" ;; esac

# Lượt 2: chuẩn tuyến tính theo số đo, ghép với hình
mkdir -p "$(dirname "$RA")"
TAM="${RA%.mp4}.dang_ghep.mp4"
rm -f "$TAM"
echo "ghép (lượt 2)..."
"$FF" -y -hide_banner -loglevel error -nostats "${IN[@]}" \
  -filter_complex "$BASE;[mix]loudnorm=I=$LUFS:TP=$TP:LRA=$LRA:measured_I=$MI:measured_TP=$MTP:measured_LRA=$MLRA:measured_thresh=$MTH:offset=$MOFF:linear=true,aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo[a]" \
  -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 192k -ar 48000 -t "$D" -movflags +faststart "$TAM"
mv -f "$TAM" "$RA"

# Kiểm file ra
[ -s "$RA" ] || loi "không ra file: $RA"
THONG_TIN="$("$FF" -hide_banner -i "$RA" 2>&1 || true)"
printf '%s\n' "$THONG_TIN" | grep -q "Audio:" || loi "file ra không có luồng tiếng: $RA"
printf '%s\n' "$THONG_TIN" | grep -q "Video:" || loi "file ra không có luồng hình: $RA"
DR="$(do_dai "$RA")"
awk -v a="$D" -v b="$DR" 'BEGIN{ d = a - b; if (d < 0) d = -d; exit !(d < 0.15) }' || loi "độ dài file ra ${DR} s lệch video ${D} s quá 0,15 giây"
KT="$("$FF" -hide_banner -nostats -i "$RA" -vn -af "loudnorm=I=$LUFS:TP=$TP:LRA=$LRA:print_format=json" -f null - 2>&1 || true)"
JSON="$KT"; DO_I="$(lay input_i)"; DO_TP="$(lay input_tp)"
BYTES="$(wc -c < "$RA" | tr -d ' ')"
echo "xong: $RA"
echo "  dài ${DR} s (video ${D} s), $((BYTES/1024)) KB, độ to thực ${DO_I} LUFS (đích ${LUFS}), đỉnh thật ${DO_TP} dBTP"
awk -v i="$DO_I" -v t="$LUFS" 'BEGIN{ d = i - t; if (d < 0) d = -d; if (d > 1.0) print "CANH BAO: độ to lệch đích " d " LU (do giới hạn đỉnh hoặc quãng động quá rộng)" > "/dev/stderr" }'
