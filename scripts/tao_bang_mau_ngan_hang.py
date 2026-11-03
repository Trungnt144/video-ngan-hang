#!/usr/bin/env python3
"""Dựng bảng màu MAU-32 trở đi từ màu thương hiệu các ngân hàng Việt Nam (Trung chốt 29/10/2026).

Nguồn: tai_san/so_tay_gu/mau_ngan_hang_nguon.json (mỗi ngân hàng: ma, ngan_hang, url, chu_dao, phu, chu,
nguon, tin_cay; lấy từ website ngân hàng ngày 29/10/2026). Mỗi ngân hàng một bảng đủ khoá của kho hình chung:
màu chủ đạo làm màu nhấn; ngân hàng màu chủ đạo đậm thì nền tối pha từ màu đó, còn lại nền sáng pha nhạt.
Script chỉnh độ sáng tới khi chữ trên nền đạt tương phản ≥ 7 và màu nhấn trên nền ≥ 3.

  python3 scripts/tao_bang_mau_ngan_hang.py           ghi he_truc_dung.json (mục mau) và kho_nen.js (K.BANG)
  python3 scripts/tao_bang_mau_ngan_hang.py --xep     ghi như trên rồi xếp lại cột mau của xep_video trong mau_kich_ban.json

Chỉ dùng màu, không dùng tên, logo ngân hàng trên hình.
"""
import json, os, re, sys

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P_NGUON = os.path.join(GOC, 'tai_san/so_tay_gu/mau_ngan_hang_nguon.json')
P_TRUC = os.path.join(GOC, 'tai_san/so_tay_gu/he_truc_dung.json')
P_KHO = os.path.join(GOC, 'tai_san/kho_hinh_chung/chung/kho_nen.js')
P_MAU_KB = os.path.join(GOC, 'tai_san/so_tay_gu/mau_kich_ban.json')
DAU, CUOI = '    // --- bảng màu ngân hàng: sinh bởi scripts/tao_bang_mau_ngan_hang.py, không sửa tay ---', '    // --- hết bảng màu ngân hàng ---'

def rgb(h): h = h.lstrip('#'); return [int(h[i:i + 2], 16) for i in (0, 2, 4)]
def hx(c): return '#' + ''.join(f'{max(0, min(255, round(x))):02X}' for x in c)
def tron(a, b, t): return hx([x + (y - x) * t for x, y in zip(rgb(a), rgb(b))])
def do_sang(h):
    def kenh(c): c /= 255; return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = (kenh(x) for x in rgb(h)); return 0.2126 * r + 0.7152 * g + 0.0722 * b
def tuong_phan(a, b): x, y = sorted((do_sang(a), do_sang(b)), reverse=True); return (x + 0.05) / (y + 0.05)
def bao_hoa(h):
    c = rgb(h); return (max(c) - min(c)) / 255

def nhom_sac(h):
    """Nhóm sắc độ 30° của màu (0–11), để hai video liền nhau không cùng tông."""
    r, g, b = (x / 255 for x in rgb(h)); mx, mn = max(r, g, b), min(r, g, b)
    if mx == mn: return -1
    if mx == r: hue = ((g - b) / (mx - mn)) % 6
    elif mx == g: hue = (b - r) / (mx - mn) + 2
    else: hue = (r - g) / (mx - mn) + 4
    return int(hue * 60 // 30)

def ep(mau, nen, nguong, toi):
    """Đẩy màu về phía trắng (nền tối) hoặc đen (nền sáng) tới khi đạt tương phản."""
    dich = '#FFFFFF' if toi else '#000000'
    for i in range(41):
        m = tron(mau, dich, i / 40)
        if tuong_phan(m, nen) >= nguong: return m
    return dich

def dung_bang(n):
    chinh = n['chu_dao']
    phu = [p for p in (n.get('phu') or []) if p and p.upper() != chinh.upper() and bao_hoa(p) > 0.15] or [tron(chinh, '#FFFFFF', 0.45)]
    toi = do_sang(chinh) < 0.06
    if toi:
        nen = tron(chinh, '#000000', 0.62); nen_phu = tron(chinh, '#000000', 0.45); the = tron(chinh, '#000000', 0.35)
        chu = ep('#FFFFFF', nen, 7, True); chu_phu = ep(tron(chinh, '#FFFFFF', 0.6), nen, 4.5, True)
        nhan = ep(phu[0], nen, 3, True); nhan_phu = ep(tron(chinh, '#FFFFFF', 0.35), nen, 3, True)
        nhat = tron(chinh, '#000000', 0.2); tot, xau, canh_bao = '#7FD1A0', '#F0604D', '#F2C14E'; giay = '#F4F2EC'
    else:
        nen = tron(chinh, '#FFFFFF', 0.94); nen_phu = tron(chinh, '#FFFFFF', 0.86); the = '#FFFFFF'
        chu_goc = n.get('chu') if n.get('chu') and do_sang(n['chu']) < 0.1 else tron(chinh, '#000000', 0.78)
        chu = ep(chu_goc, nen, 7, False); chu_phu = ep(tron(chu, nen, 0.35), nen, 4.5, False)
        nhan = ep(chinh, nen, 3, False); nhan_phu = ep(phu[0], nen, 3, False)
        nhat = tron(chinh, '#FFFFFF', 0.78); tot, xau, canh_bao = '#2E8B57', '#C8452F', '#D9912B'; giay = '#FFFFFF'
    return {'ten': n['ngan_hang'], 'toi': toi, 'nen': nen, 'nen_phu': nen_phu, 'the': the, 'chu': chu, 'chu_phu': chu_phu, 'vien': chu,
            'nhan': nhan, 'nhan_phu': nhan_phu, 'nhat': nhat, 'tot': tot, 'xau': xau, 'canh_bao': canh_bao, 'giay': giay, 'da': '#E8B48F'}

def main():
    nguon = [n for n in json.load(open(P_NGUON)) if n.get('chu_dao')]
    bang = {n['ma']: dung_bang(n) for n in nguon}
    # 1. he_truc_dung.json
    truc = json.load(open(P_TRUC))
    truc['mau'] = [m for m in truc['mau'] if not m.get('ngan_hang')]
    for n in nguon:
        b = bang[n['ma']]
        cl = ['CL-05', 'CL-06', 'CL-07', 'CL-09', 'CL-12', 'CL-13', 'CL-14', 'CL-15', 'CL-16'] if b['toi'] else ['CL-05', 'CL-06', 'CL-07', 'CL-09', 'CL-10', 'CL-13', 'CL-14', 'CL-15', 'CL-16']
        truc['mau'].append({'ma': n['ma'], 'ten': f"Màu {n['ngan_hang']}", 'nen': 'toi' if b['toi'] else 'sang',
            'mo_ta': f"Màu thương hiệu {n['ngan_hang']}: nền {b['nen']}, chữ {b['chu']}, nhấn {b['nhan']} (gốc {n['chu_dao']}), nhấn phụ {b['nhan_phu']}. Chỉ dùng màu, không tên, logo.",
            'chat_lieu': cl, 'd_nguon': [], 'hex': {'nen': b['nen'], 'chu': b['chu'], 'nhan': [b['nhan']], 'phu': [b['nhan_phu'], b['nhat']]},
            'mau_nguon': n['url'], 'do_tu': f"lấy từ website ngân hàng 29/10/2026 ({n.get('nguon', '')[:160]}); tin cậy {n.get('tin_cay')}",
            'trang_thai': 'nhap', 'gia_tri_moi': True, 'ngan_hang': n['ngan_hang'], 'linh_vuc': ['tai_chinh'],
            'nhom_nhac_hop': ['TAP', 'TRAM', 'HOI'] if b['toi'] else ['TAP', 'VUI'], 'nhom_nhac_tranh': ['BUON']})
    open(P_TRUC, 'w').write(json.dumps(truc, ensure_ascii=False, indent=2) + '\n')
    # 2. kho_nen.js
    js = open(P_KHO).read()
    js = re.sub(re.escape(DAU) + r'.*?' + re.escape(CUOI) + r'\n', '', js, flags=re.S)
    dong = [DAU]
    for ma, b in bang.items():
        dong.append(f"    '{ma}': {{ ten: '{b['ten']}', toi: {str(b['toi']).lower()}, " + ', '.join(f"{k}: '{b[k]}'" for k in b if k not in ('ten', 'toi')) + ' },')
    dong.append(CUOI)
    moc = '  };\n  K.MA_MAC_DINH'
    assert js.count(moc) == 1, 'không thấy chỗ chèn trong kho_nen.js'
    js = js.replace(moc, '\n'.join(dong) + '\n' + moc)
    open(P_KHO, 'w').write(js)
    print(f"Đã ghi {len(bang)} bảng ({', '.join(bang)})")
    for n in nguon:
        b = bang[n['ma']]
        print(f"  {n['ma']} {n['ngan_hang']:<22} {'tối ' if b['toi'] else 'sáng'} nền {b['nen']} chữ {b['chu']} ({tuong_phan(b['chu'], b['nen']):.1f}) nhấn {b['nhan']} ({tuong_phan(b['nhan'], b['nen']):.1f}) tin cậy {n.get('tin_cay')}")
    if '--xep' in sys.argv: xep(nguon, bang, truc)

def xep(nguon, bang, truc):
    """Gán màu ngân hàng cho mọi video trong xep_video: hợp chất liệu, hợp nhóm nhạc, bảng ít dùng trước,
    không lặp trong 8 video liền nhau, nhóm sắc độ của màu nhấn khác 2 video trước (thứ tự loạt); ưu tiên tin cậy cao.
    Chỉ đổi trường mau, đọc file từ đĩa."""
    d = json.load(open(P_MAU_KB))
    mau = {m['ma']: m for m in truc['mau']}
    nhac = {x['ma']: x for x in json.load(open(os.path.join(GOC, 'tai_san/nhac_nen/so_nhac.json')))}
    diem_tin = {'cao': 0, 'vua': 1, 'thap': 2}
    tin = {n['ma']: diem_tin.get(n.get('tin_cay'), 2) for n in nguon}
    mnh = d['luat_da_dang'].get('mau_ngan_hang', {})
    nhay_cam = set(mnh.get('khong_dung_mau_mb', []))
    chi_dung = set(mnh.get('chi_dung') or bang)  # Trung chốt 29/10/2026: loạt này chỉ dùng 10 bảng trong chi_dung
    tran = -(-len(d['xep_video']) // len(chi_dung)) + 1
    da_dung, gan = {}, []
    for i, v in enumerate(d['xep_video']):
        ung = []
        for ma in bang:
            if ma not in chi_dung: continue
            m = mau[ma]
            if v['cl'] not in m['chat_lieu']: continue
            if nhac[v['nh']]['nhom'] in m['nhom_nhac_tranh']: continue
            if ma in gan[-min(8, len(chi_dung) // 3):] or da_dung.get(ma, 0) >= (tran + 1 if bang[ma]['toi'] else tran): continue  # nền tối ít bảng, chất liệu hạt sáng cần nền tối
            if gan and gan[-1] in bang and nhom_sac(bang[gan[-1]]['nhan']) == nhom_sac(bang[ma]['nhan']): continue
            if len(gan) > 1 and gan[-2] in bang and nhom_sac(bang[gan[-2]]['nhan']) == nhom_sac(bang[ma]['nhan']): continue
            if v['ma'] in nhay_cam and 'MB' == m['ngan_hang'].split()[0]: continue
            if v['bc'] == 'BC-13' and m['nen'] == 'toi': continue
            ung.append((da_dung.get(ma, 0), tin[ma], (int(ma[4:]) * 7 + i * 13) % 97, ma))
        if not ung: print('  Không có màu ngân hàng hợp cho', v['ma'], '— giữ', v['mau']); gan.append(v['mau']); continue
        ung.sort(); ma = ung[0][3]
        v['mau'] = ma; da_dung[ma] = da_dung.get(ma, 0) + 1; gan.append(ma)
    json.dump(d, open(P_MAU_KB, 'w'), ensure_ascii=False, indent=1)
    print('Đã xếp lại màu cho', len(d['xep_video']), 'video;', len(da_dung), 'bảng được dùng')

if __name__ == '__main__':
    main()
