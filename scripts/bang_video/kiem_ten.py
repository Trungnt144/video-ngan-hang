# kiem_ten.py — kiểm tên video trên bảng video khớp tiêu đề YouTube trong chữ đăng
#
# Lập 01/11/2026 sau lỗi 52 video đổi tiêu đề trên kênh mà bảng vẫn hiện tên lúc viết kịch bản (AGENTS.md quy ước
# sản phẩm 2). Nguồn tiêu đề duy nhất là ô `youtube_dai · tieu_de` của `tai_nguyen/dang_bai/youtube.md`; bảng chỉ được
# hiện tên khác khi Trung sửa tay trên bảng (ghi_de.json).
#
# Dùng (máy chủ bảng phải đang chạy, cổng 4580 hoặc BANG_VIDEO_CONG):
#   python3 -I scripts/bang_video/kiem_ten.py [thư mục sản phẩm ...]
# Không truyền thư mục thì kiểm mọi video. Mã thoát 1 khi có video lệch.
import json, os, re, sys, unicodedata, urllib.request

GOC = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CONG = os.environ.get('BANG_VIDEO_CONG', '4580')
MAU = re.compile(r'#### youtube_dai · tieu_de\n\n```text\n(.*)\n```')


def nfc(s):
    return unicodedata.normalize('NFC', s or '').strip()


try:
    du_lieu = json.load(urllib.request.urlopen(f'http://localhost:{CONG}/api/du_lieu', timeout=30))
except OSError as e:
    sys.exit(f'Không gọi được máy chủ bảng video ở cổng {CONG} ({e}). Bật bằng biểu tượng Media Project rồi chạy lại.')

chon = {nfc(os.path.basename(p.rstrip('/'))) for p in sys.argv[1:]}
lech = so = 0
for v in du_lieu.get('videos', []):
    tm = nfc(v['thu_muc'])
    if chon and tm not in chon:
        continue
    p = os.path.join(GOC, 'san_pham', v['thu_muc'], 'tai_nguyen/dang_bai/youtube.md')
    try:
        m = MAU.search(open(p, encoding='utf-8').read())
    except OSError:
        continue
    if not m:
        continue
    so += 1
    if v.get('ten_da_sua'):
        print(f'SỬA TAY  {tm}: bảng "{v["ten"]}" (Trung sửa trên bảng), chữ đăng "{m.group(1)}"')
    elif nfc(v['ten']) != nfc(m.group(1)):
        lech += 1
        print(f'LỆCH     {tm}: bảng "{v["ten"]}", chữ đăng "{m.group(1)}"')
print(f'\nĐã kiểm {so} video có youtube.md, {lech} video lệch.')
sys.exit(1 if lech else 0)
