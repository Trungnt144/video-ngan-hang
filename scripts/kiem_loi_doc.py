#!/usr/bin/env python3
"""Kiểm lời đọc VieNeu (trường 'doc' trong *.chuong.json) theo từ điển cách đọc.

Chạy trước khi đọc giọng:
  python3 -I scripts/kiem_loi_doc.py <file.chuong.json> [...] [--tu-dien tai_san/giong_doc/tu_dien_doc/ngan_hang.json]

Báo LỖI khi lời đọc còn chữ viết tắt nguyên dạng (CIC, L/C…), chữ in hoa từ hai chữ cái trở lên
chưa có trong từ điển, hoặc cách viết bị cấm ('sai'). Báo CẢNH BÁO với mẫu trong 'sai_chung'.
Thoát mã 1 nếu có lỗi. Từ điển do Trung chốt 30/10/2026; chữ mới thì thêm vào từ điển trước.
"""
import json
import os
import re
import sys

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TU_DIEN_MAC_DINH = os.path.join(GOC, 'tai_san/giong_doc/tu_dien_doc/ngan_hang.json')


def doc_chuong(duong):
    d = json.load(open(duong, encoding='utf-8'))
    ds = d if isinstance(d, list) else d.get('chuong', [])
    return [(x.get('id', i + 1), x.get('doc') or '') for i, x in enumerate(ds) if isinstance(x, dict)]


def kiem(duong, td):
    loi, canh_bao = [], []
    da_biet = {m['chu'] for m in td['muc']}
    for ma, doc in doc_chuong(duong):
        if not doc:
            canh_bao.append(f'chương {ma}: không có trường doc')
            continue
        for m in td['muc']:
            # chữ tiếng Anh đọc nguyên dạng (doc trùng chu, ví dụ 'Oracle') thì không báo
            if m['chu'] != m['doc'] and re.search(r'(?<![\w/])' + re.escape(m['chu']) + r'(?![\w/])', doc):
                loi.append(f'chương {ma}: còn "{m["chu"]}" nguyên dạng, phải viết "{m["doc"]}"')
            for s in m.get('sai', []):
                if re.search(r'(?<!\w)' + re.escape(s) + r'(?!\w)', doc, re.IGNORECASE):
                    loi.append(f'chương {ma}: "{s}" là cách đọc bị cấm của {m["chu"]}, phải viết "{m["doc"]}"')
        for w in set(re.findall(r'\b[A-Z][A-Z0-9/&\-]*[A-Z0-9]\b', doc)):
            if w not in da_biet and sum(c.isupper() for c in w) >= 2:
                loi.append(f'chương {ma}: "{w}" chưa có trong từ điển cách đọc; thêm vào từ điển (hỏi Trung nếu chưa rõ)')
        for s in td.get('sai_chung', []):
            if s in doc:
                canh_bao.append(f'chương {ma}: có "{s}"; năm trong số hiệu văn bản đọc gọn (hai nghìn hai mươi tư)')
    return loi, canh_bao


def main(args):
    td_duong = TU_DIEN_MAC_DINH
    if '--tu-dien' in args:
        i = args.index('--tu-dien')
        td_duong = args[i + 1]
        args = args[:i] + args[i + 2:]
    if not args:
        print(__doc__)
        return 2
    td = json.load(open(td_duong, encoding='utf-8'))
    tong_loi = 0
    for f in args:
        loi, cb = kiem(f, td)
        tong_loi += len(loi)
        print(f'== {f}: {len(loi)} lỗi, {len(cb)} cảnh báo')
        for x in loi:
            print('  LỖI', x)
        for x in cb:
            print('  CẢNH BÁO', x)
    return 1 if tong_loi else 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
