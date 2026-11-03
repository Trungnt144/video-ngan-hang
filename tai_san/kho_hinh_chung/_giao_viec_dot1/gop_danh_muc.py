# Gộp khối JSON báo cáo của tác tử vào danh_muc.json; đặt da_duyet cho hình Claude đã tự duyệt.
# python3 gop_danh_muc.py <file báo cáo> <ten1,ten2,...> [lời ghi duyệt]
import json, re, sys, os
os.chdir('/Users/macbooktrungnt/Documents/VideoNganHang')
bc = open(sys.argv[1], encoding='utf-8').read()
chon = sys.argv[2].split(',')
DUYET = sys.argv[3] if len(sys.argv) > 3 else 'Claude duyệt ảnh mẫu theo lệnh Trung chiều 29/10/2026 (chuyển qua phiên điều phối); Trung xem lại anh_mau/ khi rảnh.'
khoi = {}
for m in re.finditer(r'```json\s*(\{.*?\})\s*```', bc, re.S):
    try:
        x = json.loads(m.group(1))
    except Exception as e:
        print('lỗi JSON', e, m.group(1)[:80]); continue
    khoi[x['ten']] = x
p = 'tai_san/kho_hinh_chung/danh_muc.json'
d = json.load(open(p, encoding='utf-8'))
for h in d['hinh']:
    if h['ten'] in chon:
        x = khoi.get(h['ten'])
        if not x: print('không thấy khối', h['ten']); continue
        for k in ('file', 'can', 'phien_ban', 'tham_so', 'nguon_gom'):
            if x.get(k): h[k] = x[k]
        if x.get('moc'): h['moc'] = x['moc']
        gc = x.get('ghi_chu', '')
        if x.get('loi_con_lai'): gc += ' Lỗi còn lại: ' + x['loi_con_lai']
        h['ghi_chu'] = gc.strip()
        h['trang_thai'] = 'da_duyet'
        h['duyet'] = DUYET
        print('đã gộp', h['ten'], h['phien_ban'])
json.dump(d, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
