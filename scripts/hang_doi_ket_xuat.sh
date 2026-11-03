#!/bin/bash
# Hàng đợi kết xuất dùng chung cho mọi tác tử dựng video chạy song song (Trung chốt 27/10/2026).
#
# Cách dùng:
#   scripts/hang_doi_ket_xuat.sh [--nhanh] <ma_video> <lệnh kết xuất ...>
#   ví dụ: scripts/hang_doi_ket_xuat.sh n30 npx remotion render DuBao out/n30_du.mp4
#          scripts/hang_doi_ket_xuat.sh --nhanh n30 npx remotion still src/index.ts DuBao out/k120.jpg --frame=120
#
# Cách hoạt động:
#   - Có SO_LUOT (mặc định 2) chỗ dài và SO_NHANH (mặc định 1) chỗ nhanh. Mỗi chỗ là một thư mục
#     du_lieu/hang_doi_ket_xuat/cho_<n> hoặc nhanh_<n>; lệnh mkdir tạo thư mục là thao tác nguyên tử,
#     nên hai tác tử không chiếm cùng một chỗ.
#   - Chỗ nhanh (thêm 28/10/2026, sổ nợ N58) dành cho lượt dưới 30 giây: ảnh tĩnh, ảnh soát, ảnh lưới.
#     Lượt có `--nhanh`, hoặc lệnh chứa "remotion still", "anh_soat", "anh_luoi", tự vào chỗ nhanh;
#     chỗ nhanh bận mà còn chỗ dài trống thì lấy chỗ dài. Lượt dài không bao giờ lấy chỗ nhanh.
#     Lượt nhanh chạy quá 60 giây thì bị ghi cảnh báo (nên chạy như lượt dài).
#   - Hết chỗ thì chờ (lượt dài 20 giây, lượt nhanh 3 giây) rồi thử lại. Chỗ của tiến trình đã chết
#     (máy khởi động lại, tác tử bị ngắt) được thu hồi tự động.
#   - Chạy lệnh qua chay_ket_xuat_co_don.py: TMPDIR riêng, dọn đúng cây con và Chrome
#     chạy ẩn của lượt đó khi xong/lỗi/bị ngắt; giữ chỗ tới khi dọn xong rồi trả chỗ.
#   - Ghi một dòng vào du_lieu/hang_doi_ket_xuat/nhat_ky.tsv: mã video, giờ vào hàng, số giây chờ,
#     số giây chạy, mã thoát, lệnh, loại hàng (dai/nhanh). Mã thoát của script là mã thoát của lệnh.
#   - Muốn tắt lượt kết xuất của mình: đọc PID trong cho_<n>/thong_tin (dòng pid=), chỉ tắt PID đó.
#     PID này là trình giám sát; nó dọn cả Chrome tự tách nhóm.
#     Không dùng pkill hay killall theo tên chung.
#
# Xem hàng đợi:  scripts/hang_doi_ket_xuat.sh --xem

set -u
GOC="$(cd "$(dirname "$0")/.." && pwd)"
THU_MUC="$GOC/du_lieu/hang_doi_ket_xuat"
SO_LUOT="${SO_LUOT:-2}"
SO_NHANH="${SO_NHANH:-1}"
mkdir -p "$THU_MUC"

if [ "${1:-}" = "--xem" ]; then
  for d in "$THU_MUC"/cho_* "$THU_MUC"/nhanh_*; do
    [ -d "$d" ] && { echo "== $(basename "$d")"; cat "$d/thong_tin" 2>/dev/null; }
  done
  echo "== 10 lượt gần nhất"; tail -n 10 "$THU_MUC/nhat_ky.tsv" 2>/dev/null
  exit 0
fi

NHANH=""
if [ "${1:-}" = "--nhanh" ]; then NHANH=1; shift; fi

# Chốt chặn (29/10/2026, skill luu-tru-drive): thư mục dựng có tài nguyên đang nằm trên Drive (đã gỡ khỏi máy)
# thì dừng và in lệnh tải về, thay vì để Remotion báo lỗi thiếu thư viện. Bỏ qua bằng LUU_TRU_BO_QUA=1.
REL="${PWD#$GOC/}"
case "$REL" in
  xuong_dai/*|xuong_html/*)
    XD=$(echo "$REL" | cut -d/ -f1-2)
    KK=$(grep -l "\"$XD\"" "$GOC"/du_lieu/luu_tru_drive/*.json 2>/dev/null | head -1)
    if [ -n "$KK" ] && [ -z "${LUU_TRU_BO_QUA:-}" ] && grep -q -E '"trang_thai": "(da_bo_may|tai_ve_mot_phan)"' "$KK"; then
      echo "DỪNG: tài nguyên dựng của $XD đang nằm trên Drive (kê khai du_lieu/luu_tru_drive/$(basename "$KK")). Tải về trước:" >&2
      echo "  cd $GOC && python3 -I skills/luu-tru-drive/scripts/luu_tru.py tai-ve $(basename "$KK" .json)" >&2
      exit 3
    fi;;
esac

if [ $# -lt 2 ]; then
  echo "Cách dùng: $0 [--nhanh] <ma_video> <lệnh ...>   hoặc   $0 --xem" >&2
  exit 2
fi

MA="$1"; shift
case "$*" in
  *"remotion still"*|*anh_soat*|*anh_luoi*) NHANH=1 ;;
esac
VAO=$(date +%s)
CHO=""

# Thu hồi chỗ của tiến trình đã chết.
thu_hoi() {
  local d="$1" pid
  pid=$(sed -n 's/^pid_giu=//p' "$d/thong_tin" 2>/dev/null)
  if [ -n "$pid" ] && ! kill -0 "$pid" 2>/dev/null; then rm -rf "$d"; fi
}

# Thử chiếm một chỗ trong danh sách tên chỗ; thành công thì đặt CHO.
thu_chiem() {
  local d
  for d in "$@"; do
    [ -d "$d" ] && thu_hoi "$d"
    if mkdir "$d" 2>/dev/null; then
      CHO="$d"
      return 0
    fi
  done
  return 1
}

DS_DAI=(); for n in $(seq 1 "$SO_LUOT"); do DS_DAI+=("$THU_MUC/cho_$n"); done
DS_NHANH=(); for n in $(seq 1 "$SO_NHANH"); do DS_NHANH+=("$THU_MUC/nhanh_$n"); done

while [ -z "$CHO" ]; do
  if [ -n "$NHANH" ]; then
    thu_chiem "${DS_NHANH[@]}" "${DS_DAI[@]}" && break
    sleep 3
  else
    thu_chiem "${DS_DAI[@]}" && break
    sleep 20
  fi
done
printf 'ma=%s\npid_giu=%s\nbat_dau=%s\nlenh=%s\n' "$MA" "$$" "$(date '+%H:%M:%S')" "$*" > "$CHO/thong_tin"
HANG=dai; [ -n "$NHANH" ] && HANG=nhanh

CHAY=$(date +%s)
CON=""
tra_cho() {
  if [ -n "$CON" ]; then
    kill -TERM "$CON" 2>/dev/null
    wait "$CON" 2>/dev/null || true
  fi
  rm -rf "$CHO"
}
trap 'tra_cho; exit 130' INT TERM HUP

echo "[hàng đợi] $MA vào $(basename "$CHO") sau $((CHAY - VAO)) giây chờ" >&2
python3 "$GOC/scripts/chay_ket_xuat_co_don.py" "$@" &
CON=$!
echo "pid=$CON" >> "$CHO/thong_tin"
wait "$CON"
MA_THOAT=$?
CON=""
XONG=$(date +%s)
rm -rf "$CHO"
trap - INT TERM HUP

printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$MA" "$(date -r "$VAO" '+%m/%d %H:%M:%S')" "$((CHAY - VAO))" "$((XONG - CHAY))" "$MA_THOAT" "$*" "$HANG" >> "$THU_MUC/nhat_ky.tsv"
echo "[hàng đợi] $MA xong: chờ $((CHAY - VAO)) giây, chạy $((XONG - CHAY)) giây, mã thoát $MA_THOAT" >&2
if [ "$HANG" = nhanh ] && [ $((XONG - CHAY)) -gt 60 ]; then
  echo "[hàng đợi] cảnh báo: lượt nhanh của $MA chạy $((XONG - CHAY)) giây, lần sau chạy như lượt dài (bỏ --nhanh)" >&2
fi
exit "$MA_THOAT"
