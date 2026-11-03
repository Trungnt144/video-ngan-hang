#!/bin/bash
# tao_ung_dung.sh — đóng gói biểu tượng "Media Project" (mở bảng theo dõi video) thành ứng dụng macOS đặt trên màn hình nền.
# Bấm đúp ứng dụng = chạy scripts/bang_video/mo_bang.sh (máy chủ chạy ngầm, mở trang).
# Chạy lại file này khi đổi hình biểu tượng hoặc chuyển thư mục Media.
# Cách dùng: bash scripts/bang_video/ung_dung/tao_ung_dung.sh [thư_mục_đích, mặc định ~/Desktop]
set -euo pipefail
NOI_MA="$(cd "$(dirname "$0")" && pwd)"
MO_BANG="$(cd "$NOI_MA/.." && pwd)/mo_bang.sh"
DICH="${1:-$HOME/Desktop}"
APP="$DICH/Media Project.app"
TAM="$(mktemp -d)"
trap 'rm -rf "$TAM"' EXIT

# 1. hình biểu tượng → bộ ảnh các cỡ → file .icns
python3 "$NOI_MA/ve_bieu_tuong.py" "$TAM/goc.png"
mkdir "$TAM/AppIcon.iconset"
for c in 16 32 128 256 512; do
  sips -z $c $c "$TAM/goc.png" --out "$TAM/AppIcon.iconset/icon_${c}x${c}.png" >/dev/null
  sips -z $((c * 2)) $((c * 2)) "$TAM/goc.png" --out "$TAM/AppIcon.iconset/icon_${c}x${c}@2x.png" >/dev/null
done
iconutil -c icns "$TAM/AppIcon.iconset" -o "$TAM/AppIcon.icns"
cp "$TAM/goc.png" "$NOI_MA/bieu_tuong_1024.png"

# 2. khung ứng dụng: osacompile dựng một ứng dụng AppleScript chuẩn của macOS (file chạy là Mach-O,
#    Launch Services mở được; khung tự viết với file chạy là script bash bị từ chối, lỗi -10669 ngày 27/10/2026)
rm -rf "$APP"
osacompile -o "$APP" -e "do shell script \"/bin/bash \" & quoted form of \"$MO_BANG\""
cp "$TAM/AppIcon.icns" "$APP/Contents/Resources/applet.icns"
rm -f "$APP/Contents/Resources/Assets.car"
/usr/libexec/PlistBuddy -c "Delete :CFBundleIconName" "$APP/Contents/Info.plist" 2>/dev/null || true
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier vn.trung.media.bangvideo" "$APP/Contents/Info.plist" 2>/dev/null \
  || /usr/libexec/PlistBuddy -c "Add :CFBundleIdentifier string vn.trung.media.bangvideo" "$APP/Contents/Info.plist"
/usr/libexec/PlistBuddy -c "Add :LSUIElement bool true" "$APP/Contents/Info.plist" 2>/dev/null || true
# ký tạm trên máy để macOS cho chạy, rồi báo Finder vẽ lại biểu tượng
codesign --force --deep --sign - "$APP" >/dev/null 2>&1 || true
touch "$APP"
echo "Đã tạo: $APP"
