#!/bin/bash
# chay.sh — bật bảng theo dõi video Media rồi mở trang trong trình duyệt.
# Dừng máy chủ: Ctrl+C trong cửa sổ dòng lệnh này (lệnh Claude đang chạy sẽ dừng theo).
# Đổi cổng: BANG_VIDEO_CONG=4581 bash scripts/bang_video/chay.sh
cd "$(dirname "$0")/../.." || exit 1
CONG="${BANG_VIDEO_CONG:-4580}"
if curl -s -o /dev/null "http://localhost:$CONG/"; then
  echo "Máy chủ đã chạy sẵn ở cổng $CONG, chỉ mở trang."
  exec bash scripts/bang_video/mo_bang.sh
fi
# mở trang bằng mo_bang.sh (cửa sổ Chrome riêng) khi máy chủ đã trả lời
CHI_MO=1 bash scripts/bang_video/mo_bang.sh &
exec node scripts/bang_video/may_chu.mjs
