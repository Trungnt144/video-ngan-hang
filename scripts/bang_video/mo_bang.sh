#!/bin/bash
# mo_bang.sh — mở bảng theo dõi video, máy chủ chạy ngầm (biểu tượng "Media Project" trên màn hình nền gọi file này).
# Máy chủ đang chạy thì chỉ mở trang. Chưa chạy thì bật ngầm, chờ tới khi trả lời, rồi mở trang.
# Nhật ký máy chủ: du_lieu/bang_video/may_chu.log. Tắt: nút "Tắt máy chủ" trên trang.
# Ứng dụng mở từ Finder không nạp hồ sơ dòng lệnh nên phải tự thêm đường dẫn tới node và claude.
export PATH="$HOME/.local/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
GOC="$(cd "$(dirname "$0")/../.." && pwd)"
CONG="${BANG_VIDEO_CONG:-4580}"
URL="http://localhost:$CONG/"
LOG="$GOC/du_lieu/bang_video/may_chu.log"

# CHI_MO=1 (chay.sh dùng): máy chủ do nơi khác bật, chỉ chờ nó trả lời rồi mở trang
if [ -n "${CHI_MO:-}" ]; then
  for _ in $(seq 1 40); do curl -s -o /dev/null --max-time 1 "$URL" && break; sleep 0.25; done
elif ! curl -s -o /dev/null --max-time 2 "$URL"; then
  mkdir -p "$(dirname "$LOG")"
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') bật từ biểu tượng ===" >> "$LOG"
  cd "$GOC" || exit 1
  nohup node scripts/bang_video/may_chu.mjs >> "$LOG" 2>&1 &
  disown
  for _ in $(seq 1 40); do
    curl -s -o /dev/null --max-time 1 "$URL" && break
    sleep 0.25
  done
  if ! curl -s -o /dev/null --max-time 2 "$URL"; then
    osascript -e "display alert \"Không bật được bảng video\" message \"Máy chủ không trả lời sau 10 giây. Xem nhật ký: $LOG\"" >/dev/null
    exit 1
  fi
fi
# Mở trong một cửa sổ Chrome riêng (hồ sơ riêng, kiểu cửa sổ ứng dụng không thanh địa chỉ).
# Không dùng `open "$URL"`: máy thường có Chrome chạy ẩn do Puppeteer/Remotion bật khi kết xuất,
# trang rơi vào bản ẩn đó và không hiện ra (Trung gặp 27/10/2026). `open -n` buộc mở bản Chrome mới;
# hồ sơ riêng đã chạy thì Chrome chuyển yêu cầu sang cửa sổ đó.
HO_SO="$HOME/Library/Application Support/BangVideoChrome"
if [ -d "/Applications/Google Chrome.app" ]; then
  open -na "Google Chrome" --args --user-data-dir="$HO_SO" --no-first-run --no-default-browser-check --app="$URL"
else
  open -a Safari "$URL"
fi
