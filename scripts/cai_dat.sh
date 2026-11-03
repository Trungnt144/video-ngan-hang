#!/usr/bin/env bash
# Kiểm và cài môi trường của project VideoNganHang.
#   bash scripts/cai_dat.sh kiem   chỉ kiểm, không cài gì (mặc định)
#   bash scripts/cai_dat.sh cai    cài phần thiếu (npm install, venv Python VieNeu)
# Không tải trình duyệt, không đụng tới ~/.hermes, ~/.claude, ~/.config.
set -u
GOC="$(cd "$(dirname "$0")/.." && pwd)"
CHE_DO="${1:-kiem}"
export PATH="$HOME/.local/bin:$HOME/.hermes/bin:$PATH"
THIEU=0

dat()  { printf '  [có]   %s\n' "$1"; }
thieu() { printf '  [THIẾU] %s\n' "$1"; THIEU=$((THIEU+1)); }

echo "Project: $GOC (chế độ: $CHE_DO)"

echo "== Công cụ hệ thống"
command -v node >/dev/null && dat "node $(node -v)" || thieu "node (cần 20 trở lên)"
command -v npm  >/dev/null && dat "npm $(npm -v)" || thieu "npm"
command -v python3 >/dev/null && dat "python3 $(python3 -V 2>&1 | cut -d' ' -f2)" || thieu "python3"
command -v uv >/dev/null && dat "uv $(uv --version | cut -d' ' -f2)" || thieu "uv (Hermes có ở ~/.hermes/bin/uv)"
if ls "$HOME/Library/Caches/ms-playwright/" 2>/dev/null | grep -q '^chromium-1234$'; then dat "Chromium 1234 (Playwright)"; else thieu "Chromium 1234 ở ~/Library/Caches/ms-playwright/ (playwright-core ghim 1.62.0, không tự tải)"; fi

echo "== Thư viện Node"
for d in xuong_html/cong_cu xuong_thu_hyperframes xuong xuong_dai/n65_loi_ich_mai_nha; do
  if [ -d "$GOC/$d/node_modules" ]; then dat "$d/node_modules"
  else
    thieu "$d/node_modules"
    if [ "$CHE_DO" = "cai" ]; then
      echo "         -> npm install trong $d"
      ( cd "$GOC/$d" && npm install --no-audit --no-fund ) || echo "         npm install lỗi ở $d"
    fi
  fi
done

echo "== ffmpeg (bản ffmpeg-static trong xuong_thu_hyperframes)"
if [ -x "$GOC/xuong_thu_hyperframes/bin/ffmpeg" ] && "$GOC/xuong_thu_hyperframes/bin/ffmpeg" -version >/dev/null 2>&1; then dat "xuong_thu_hyperframes/bin/ffmpeg"; else thieu "xuong_thu_hyperframes/bin/ffmpeg (cài xong thư viện Node ở trên là có)"; fi

echo "== Python giọng VieNeu (.venv_vieneu)"
if [ -x "$GOC/.venv_vieneu/bin/python" ]; then dat ".venv_vieneu"
else
  thieu ".venv_vieneu"
  if [ "$CHE_DO" = "cai" ] && command -v uv >/dev/null; then
    echo "         -> tạo venv Python 3.11 và cài gói (khoảng 1,5 GB, mất vài phút)"
    ( cd "$GOC" && uv venv --python 3.11 .venv_vieneu && \
      uv pip install --python .venv_vieneu/bin/python "vieneu==3.8.3" "onnxruntime==1.22.1" mlx-whisper soxr jiwer soundfile ) \
      || echo "         cài .venv_vieneu lỗi"
  fi
fi

echo "== Tuỳ chọn (không bắt buộc)"
[ -d "$GOC/xuong/public/tiles" ] && dat "xuong/public/tiles (ô bản đồ)" || echo "  [chưa] xuong/public/tiles: chỉ cần cho video bản đồ; tải bằng scripts/tai_tile_eox.py"
[ -x "$GOC/.venv_nhac/bin/python" ] && dat ".venv_nhac (chấm nhạc)" || echo "  [chưa] .venv_nhac: chỉ cần khi chấm nhạc mới (08_giong_am_thanh_phu_de.md)"
[ -f "$HOME/.config/dang-youtube/ngan_hang/request.token" ] && dat "khoá YouTube kênh Ngân hàng" || echo "  [chưa] khoá YouTube kênh Ngân hàng: chỉ cần khi tải lên"

if [ "$THIEU" -gt 0 ] && [ "$CHE_DO" != "cai" ]; then
  echo; echo "Còn $THIEU mục thiếu. Chạy: bash scripts/cai_dat.sh cai"
fi
exit 0
