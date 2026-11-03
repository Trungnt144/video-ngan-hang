#!/usr/bin/env python3
"""Kiểm và sinh bản đọc cho bảng mẫu kịch bản loạt video ngân hàng.

Nguồn sự thật: tai_san/so_tay_gu/mau_kich_ban.json. Script đối chiếu mọi mã với
he_truc_dung.json, sổ nhạc, thư viện thủ pháp, kho hình chung; kiểm luật đa dạng
(hai video liền nhau khác chất liệu, khác 3 video trước ở ít nhất hai trục, nhạc
không lặp trong 6 video, nhạc rè thấp); rồi ghi:
  tai_san/so_tay_gu/mau_kich_ban.md
  san_pham/2026.10.29.bang_phan_loai_mau_kich_ban/..._v1.html (đường dẫn ở trường trang_html)

  python3 scripts/sinh_mau_kich_ban.py            kiểm rồi ghi
  python3 scripts/sinh_mau_kich_ban.py --kiem     chỉ kiểm, không ghi
"""
import collections, html, json, os, sys

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def doc(p): return json.load(open(os.path.join(GOC, p)))

D = doc('tai_san/so_tay_gu/mau_kich_ban.json')
H = doc('tai_san/so_tay_gu/he_truc_dung.json')
NHAC = {x['ma']: x for x in doc('tai_san/nhac_nen/so_nhac.json')}
TP = {x['ma']: x for x in doc('tai_san/thu_phap/thu_vien_thu_phap.json')['thu_phap']}
KHO = {x['ten']: x for x in doc('tai_san/kho_hinh_chung/danh_muc.json')['hinh']}
CL = {x['ma']: x for x in H['chat_lieu']}
CT = {x['ma']: x for x in H['muc_chi_tiet']}
BC = {x['ma']: x for x in H['bo_cuc']}
MAU = {x['ma']: x for x in H['mau']}
KB_NHAC = H['nhom_nhac_theo_kb']
NHOM = H['nhom_nhac']
MK = {m['ma']: m for m in D['mau_kich_ban']}
TRANG = os.path.join(GOC, D['trang_html'])
THU_MUC_ANH = os.path.join(os.path.dirname(TRANG), 'anh')

# Màu cho ô màu trên trang. MAU-20…31 lấy trường hex; MAU-09…17 lấy từ BangMau.ts (M0…M8:
# nền, chữ, ngọc, vàng, đỏ); MAU-01…08, 18, 19 chưa có mã hex trong dữ liệu nên ước từ mô tả.
MAU_D09B = {
 'MAU-09': ['#F4F1EA', '#2B2B2B', '#1FB5A8', '#FFC93C', '#FF6B4A'], 'MAU-10': ['#EAF2FA', '#1C2A3B', '#2F6FE4', '#FFC02E', '#E83A5F'],
 'MAU-11': ['#F1F5E8', '#1F2B1C', '#1597B8', '#8CCB3F', '#F0532D'], 'MAU-12': ['#FBF0EC', '#2C2133', '#7C6CE8', '#FFA06B', '#D6286A'],
 'MAU-13': ['#F5EDDF', '#22303A', '#1F6C9C', '#F2BE45', '#D2394F'], 'MAU-14': ['#F5F1FF', '#231B3A', '#3A7BFF', '#FFD23F', '#EF2D56'],
 'MAU-15': ['#0E1A2B', '#F2F6FB', '#22CCE6', '#FFC93C', '#FF4D8D'], 'MAU-16': ['#16181B', '#F3F3F0', '#46B6F0', '#D6F03A', '#FF3D7F'],
 'MAU-17': ['#1A1530', '#F6F1FF', '#5EE0BC', '#FFD166', '#FF4FA3']}
MAU_UOC = {
 'MAU-01': ['#000000', '#FFFFFF', '#FF443D', '#F5C542'], 'MAU-02': ['#0A0A12', '#FFFFFF', '#4FC3F7', '#FFB74D'],
 'MAU-03': ['#FFFFFF', '#222222', '#FF7A1A', '#1ABC9C'], 'MAU-04': ['#050505', '#FFFFFF', '#9E9E9E', '#FF5252'],
 'MAU-05': ['#07060F', '#EDEAF7', '#2A1F5C', '#F5B041', '#E74C3C'], 'MAU-06': ['#050505', '#FFFFFF', '#2EC4B6', '#FF6B8B', '#B5B35C'],
 'MAU-07': ['#4A5048', '#E8E6E1', '#2F80ED'], 'MAU-08': ['#87CEEB', '#4CAF50', '#8D6E63'],
 'MAU-18': ['#111111', '#E0E0E0', '#4CAF50', '#2196F3', '#FF4F7B'], 'MAU-19': ['#6F7F80', '#F2F2F2', '#2DE1C2', '#E53935']}

def mau_hex(ma):
    m = MAU[ma]
    if 'hex' in m:
        h = m['hex']; return [h['nen'], h['chu']] + h.get('nhan', []) + h.get('phu', [])
    return MAU_D09B.get(ma) or MAU_UOC.get(ma, ['#CCCCCC'])

def re_thap(ma):
    r = NHAC[ma].get('re') or {}; l = D['luat_da_dang']['nhac_re_thap']
    return (r.get('max10', 99) < l['max10_duoi'] and r.get('max16', 99) < l['max16_duoi']
            and ma not in l['luon_loai'] and not NHAC[ma].get('co_the_co_loi'))

loi, canh_bao = [], []

# 1. Mã tham chiếu trong từng mẫu kịch bản
for m in D['mau_kich_ban']:
    for k in m['kb']:
        if k not in KB_NHAC: loi.append(f"{m['ma']}: không có lối viết {k}")
    for bang, ds in ((CL, m['chat_lieu']), (BC, m['bo_cuc']), (CT, m['muc_chi_tiet']), (MAU, m['mau']), (TP, m['thu_phap']), (KHO, m['kho_hinh'])):
        for x in ds:
            if x not in bang: loi.append(f"{m['ma']}: không có mã {x}")
    for n in m['nhac']['goi_y']:
        if n not in NHAC: loi.append(f"{m['ma']}: không có bài {n}")
        elif not re_thap(n): loi.append(f"{m['ma']}: bài {n} không thuộc nhóm rè thấp")
    for a in m['anh_mau']:
        if not os.path.exists(os.path.join(THU_MUC_ANH, a['tep'])): loi.append(f"{m['ma']}: thiếu ảnh {a['tep']}")
    if not 5 <= len(m['thu_phap']) <= 8: canh_bao.append(f"{m['ma']}: {len(m['thu_phap'])} thủ pháp (nên 5–8)")

# 2. Tổ hợp từng video: hợp lệ theo hệ trục
def dieu_kien_loai(v):
    nen = MAU[v['mau']]['nen']
    for l in H['luat_loai_tru']:
        dk = l['dieu_kien']; khop = True
        if 'bo_cuc' in dk and dk['bo_cuc'] != v['bc']: khop = False
        if 'chat_lieu' in dk and v['cl'] not in (dk['chat_lieu'] if isinstance(dk['chat_lieu'], list) else [dk['chat_lieu']]): khop = False
        if 'muc_chi_tiet' in dk and dk['muc_chi_tiet'] != v['ct']: khop = False
        if 'mau_nen' in dk and dk['mau_nen'] != nen: khop = False
        if khop: return l['ly_do']

for v in D['xep_video']:
    t = v['ma']
    for bang, x in ((CL, v['cl']), (CT, v['ct']), (BC, v['bc']), (MAU, v['mau']), (NHAC, v['nh']), (MK, v['mau_kich_ban'])):
        if x not in bang: loi.append(f"{t}: không có mã {x}")
    if v['kb'] not in KB_NHAC: loi.append(f"{t}: không có lối viết {v['kb']}")
    if loi: continue
    chi_dung = D['luat_da_dang'].get('mau_ngan_hang', {}).get('chi_dung')
    if chi_dung and v['mau'] not in chi_dung: loi.append(f"{t}: màu {v['mau']} ngoài 10 bảng ngân hàng Trung chốt")
    if 'ngang' not in CL[v['cl']]['kho']: loi.append(f"{t}: {v['cl']} không dùng cho khổ ngang")
    if v['cl'] not in BC[v['bc']]['chat_lieu']: loi.append(f"{t}: bố cục {v['bc']} không nhận chất liệu {v['cl']}")
    if 'ngang' not in BC[v['bc']]['kho']: loi.append(f"{t}: bố cục {v['bc']} không dùng cho khổ ngang")
    if v['cl'] not in MAU[v['mau']]['chat_lieu']: loi.append(f"{t}: màu {v['mau']} không ghi hợp chất liệu {v['cl']}")
    if v['ct'] not in CL[v['cl']]['muc_chi_tiet']: loi.append(f"{t}: {v['cl']} không có mức {v['ct']}")
    ly_do = dieu_kien_loai(v)
    if ly_do: loi.append(f"{t}: phạm luật loại trừ: {ly_do}")
    nhom = NHAC[v['nh']]['nhom']
    if nhom in MAU[v['mau']].get('nhom_nhac_tranh', []): loi.append(f"{t}: nhạc nhóm {nhom} thuộc nhóm tránh của {v['mau']}")
    if not re_thap(v['nh']): loi.append(f"{t}: bài {v['nh']} không thuộc nhóm rè thấp")
    mk = MK[v['mau_kich_ban']]
    if v['cl'] not in mk['chat_lieu']: canh_bao.append(f"{t}: {v['cl']} ngoài danh sách chất liệu của {mk['ma']}")
    if v['kb'] not in mk['kb']: canh_bao.append(f"{t}: {v['kb']} ngoài danh sách lối viết của {mk['ma']}")
    if v['bc'] not in mk['bo_cuc']: canh_bao.append(f"{t}: {v['bc']} ngoài danh sách bố cục của {mk['ma']}")

# 3. Luật đa dạng theo thứ tự chạy, nối tiếp lịch sử lô trước
TRUC = D['luat_da_dang']['truc_tinh']
chuoi = D['luat_da_dang']['lich_su_lo_truoc'] + D['xep_video']
so_cu = len(D['luat_da_dang']['lich_su_lo_truoc'])
khac_min = {}
CACH_LAP = {}
for i in range(so_cu, len(chuoi)):
    v = chuoi[i]
    if chuoi[i - 1]['cl'] == v['cl']: loi.append(f"{v['ma']}: cùng chất liệu {v['cl']} với video liền trước {chuoi[i-1]['ma']}")
    for u in chuoi[i - 3:i]:
        so = sum(u[k] != v[k] for k in TRUC)
        khac_min[v['ma']] = min(khac_min.get(v['ma'], 9), so)
        if so < 2: loi.append(f"{v['ma']}: chỉ khác {u['ma']} ở {so} trục")
    cua_so = D['luat_da_dang']['nhac_khong_lap_trong']
    truoc = [j for j in range(i) if chuoi[j]['nh'] == v['nh']]
    if truoc:
        cach = i - truoc[-1]; CACH_LAP[v['ma']] = (cach, chuoi[truoc[-1]]['ma'])
        if cach <= D['luat_da_dang'].get('nhac_cach_toi_thieu', 0): loi.append(f"{v['ma']}: nhạc {v['nh']} chỉ cách {chuoi[truoc[-1]]['ma']} {cach} video")
        elif cach <= cua_so: canh_bao.append(f"{v['ma']}: nhạc {v['nh']} lặp với {chuoi[truoc[-1]]['ma']} trong {cua_so} video")
    if v.get('mau_kich_ban') == 'MK-03' and NHAC[v['nh']]['tiet_tau'] != 'VUA': loi.append(f"{v['ma']}: video giảng công thức cần nhạc tiết tấu vừa")

# 4. Thứ tự chạy thật theo từng phiên: đủ 45 video, hai video liền nhau khác chất liệu
THEO_MA = {v['ma']: v for v in D['xep_video']}
hang = {k: x for k, x in D['luat_da_dang'].get('hang_phien', {}).items() if not k.startswith('_')}
if hang:
    tat_ca = [m for x in hang.values() for m in x]
    if sorted(tat_ca) != sorted(THEO_MA): loi.append('hang_phien không khớp đúng danh sách xep_video')
    for ten, x in hang.items():
        for u, v in zip(x, x[1:]):
            if u in THEO_MA and v in THEO_MA and THEO_MA[u]['cl'] == THEO_MA[v]['cl']:
                loi.append(f"Phiên {ten}: {u} và {v} liền nhau cùng chất liệu {THEO_MA[v]['cl']}")

PHIEN = {m: ten.split()[0] for ten, x in hang.items() for m in x}

def dem(truc): return collections.Counter(v[truc] for v in D['xep_video'])

def in_ket_qua():
    print(f"Mẫu kịch bản: {len(D['mau_kich_ban'])} · video xếp: {len(D['xep_video'])}")
    for truc in ('mau_kich_ban', 'kb', 'cl', 'bc', 'mau', 'nh'):
        print(f"  {truc}: " + ', '.join(f"{k}×{n}" for k, n in sorted(dem(truc).items())))
    print(f"Số trục khác nhỏ nhất so với 3 video trước: {min(khac_min.values()) if khac_min else '—'}")
    for x in loi: print('LỖI   ', x)
    for x in canh_bao: print('NHẮC  ', x)
    print('Kết quả:', 'ĐẠT' if not loi else f'{len(loi)} lỗi')

e = html.escape
def lap(ma):
    c = CACH_LAP.get(ma)
    return f"cách {c[0]} video (sau {c[1]})" if c else 'lần đầu trong loạt'

def ten_nhac(n): x = NHAC[n]; return f"{n} {x['ten']}"
def mo_ta_nhac(n):
    x = NHAC[n]; r = x.get('re') or {}
    return f"{NHOM.get(x['nhom'], x['nhom'])}, tiết tấu {x['tiet_tau'].lower()}, {x['bpm']} BPM, dài {round(x['dai_giay'])} giây, rè {r.get('max10')}/{r.get('max16')} dB"

def ghi_md():
    L = ["# Mẫu kịch bản và tổ hợp gợi ý cho loạt video thuật ngữ ngân hàng", "",
         f"> Bản đọc sinh từ `mau_kich_ban.json` bằng `python3 scripts/sinh_mau_kich_ban.py` — sửa file JSON, không sửa file này. Phiên bản {D['phien_ban']} · {D['cap_nhat']}. Trang cho Trung xem: `{D['trang_html']}`.", "",
         "## 1. Quy tắc ít chữ (Trung chốt 29/10/2026)", "", D['it_chu']['_ghi_chu'], "", "| Mã | Quy tắc | Cách kiểm |", "|---|---|---|"]
    L += [f"| {q['ma']} | {q['noi_dung']} | {q['kiem']} |" for q in D['it_chu']['quy_tac']]
    L += ["", D['it_chu'].get('so_do_mau', ''), "", f"Lệnh kiểm: `{D['it_chu']['lenh_kiem']}`", "", f"## 2. {len(D['mau_kich_ban'])} mẫu kịch bản", ""]
    for m in D['mau_kich_ban']:
        L += [f"### {m['ma']} {m['ten']}", "", f"**Dấu hiệu:** {m['dau_hieu']}", "", "**Dàn chương mẫu:**", ""]
        L += [f"{i}. {c}" for i, c in enumerate(m['dan_chuong'], 1)]
        L += ["", "| Trục | Gợi ý |", "|---|---|",
              f"| Lối viết | {', '.join(m['kb'])} |",
              f"| Chất liệu | {', '.join(c + ' ' + CL[c]['ten'] for c in m['chat_lieu'])} |",
              f"| Bố cục | {', '.join(b + ' ' + BC[b]['ten'] for b in m['bo_cuc'])} |",
              f"| Mức chi tiết | {', '.join(m['muc_chi_tiet'])} |",
              f"| Bảng màu | {', '.join(x + ' ' + MAU[x]['ten'] for x in m['mau'])} |",
              f"| Nhạc | nhóm {', '.join(NHOM[g] for g in m['nhac']['nhom'])}; {m['nhac']['tiet_tau']}; {m['nhac']['bpm']} BPM; gợi ý {', '.join(ten_nhac(n) for n in m['nhac']['goi_y'])} |",
              f"| Nhịp cắt | {m['nhip_cat']} |",
              f"| Thủ pháp | {'; '.join(t + ' ' + TP[t]['ten'] for t in m['thu_phap'])} |",
              f"| Kho hình chung | {', '.join(m['kho_hinh'])} |", "", "**Lỗi hay gặp:**", ""]
        L += [f"- {x}" for x in m['loi_hay_gap']] + [""]
    L += ["## 3. Xếp mẫu và tổ hợp cho các video còn lại", "",
          "Thứ tự theo mục 4 kế hoạch loạt. Luật: hai video liền nhau khác chất liệu; mỗi video khác 3 video trước ở ít nhất hai trục (CL, CT, BC, MAU, NH); nhạc dùng lại bài cũ rè thấp (max10 < 4, max16 < 6), không tải thêm, mỗi bài cách ít nhất 3 video (bảng nhắm 6), video giảng công thức nhịp vừa. Dòng Biến tấu chép thẳng vào đầu kịch bản rồi thêm phần sau chữ \"Khác\".", "",
          "| # | Mã | Video | Lô | Phiên | Mẫu | Dòng Biến tấu | Lặp nhạc | Mở đầu | Hình chính |", "|---|---|---|---|---|---|---|---|---|---|"]
    for i, v in enumerate(D['xep_video'], 1):
        L.append(f"| {i} | {v['ma']} | {v['ten']} | {v['lo']} | {PHIEN.get(v['ma'], '')} | {v['mau_kich_ban']} | Khổ ngang · {v['kb']} · {v['cl']} · {v['ct']} · {v['bc']} · {v['mau']} · {v['nh']} | {lap(v['ma'])} | {v['mo_dau']} | {v['hinh_chinh']} |")
    L += ["", "## 4. Đếm theo trục", ""]
    for truc, ten in (('mau_kich_ban', 'Mẫu'), ('kb', 'Lối viết'), ('cl', 'Chất liệu'), ('mau', 'Bảng màu'), ('nh', 'Nhạc')):
        L.append(f"- {ten}: " + ', '.join(f"{k} ×{n}" for k, n in sorted(dem(truc).items())))
    open(os.path.join(GOC, 'tai_san/so_tay_gu/mau_kich_ban.md'), 'w').write('\n'.join(L) + '\n')

CSS = """
@font-face{font-family:BVP;src:url(../../tai_san/kho_hinh_chung/chung/phong/BeVietnamPro-Regular.ttf)}
@font-face{font-family:BVP;font-weight:600;src:url(../../tai_san/kho_hinh_chung/chung/phong/BeVietnamPro-SemiBold.ttf)}
@font-face{font-family:BVP;font-weight:800;src:url(../../tai_san/kho_hinh_chung/chung/phong/BeVietnamPro-ExtraBold.ttf)}
:root{--nen:#F6F4EF;--the:#FFFFFF;--chu:#1E2328;--phu:#5E6670;--vien:#E2DED5;--nhan:#2C6E8F;--nhan2:#C4502F;--chip:#EEF3F6}
@media (prefers-color-scheme:dark){:root:not([data-theme=light]){--nen:#15181B;--the:#1F2327;--chu:#ECEDEE;--phu:#A3ABB3;--vien:#343A40;--nhan:#6CB4D6;--nhan2:#F08A66;--chip:#283039}}
:root[data-theme=dark]{--nen:#15181B;--the:#1F2327;--chu:#ECEDEE;--phu:#A3ABB3;--vien:#343A40;--nhan:#6CB4D6;--nhan2:#F08A66;--chip:#283039}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:16px/1.55 BVP,-apple-system,"Helvetica Neue",Arial,sans-serif}
main{max-width:1280px;margin:0 auto;padding:28px 16px 80px}h1{font-size:30px;line-height:1.25;margin:0 0 6px;font-weight:800}
h2{font-size:22px;margin:44px 0 14px;font-weight:800}h3{font-size:19px;margin:0;font-weight:800}.phu{color:var(--phu)}
.tom{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:18px 0}.o{background:var(--the);border:1px solid var(--vien);border-radius:10px;padding:12px}
.o b{display:block;font-size:26px;font-weight:800;color:var(--nhan)}
table{border-collapse:collapse;width:100%;font-size:14px}th,td{border-bottom:1px solid var(--vien);padding:7px 8px;text-align:left;vertical-align:top}th{font-weight:600;color:var(--phu);position:sticky;top:0;background:var(--nen)}
.cuon{overflow-x:auto;border:1px solid var(--vien);border-radius:10px;background:var(--the)}
.luoi{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(560px,100%),1fr));gap:18px}
.the{background:var(--the);border:1px solid var(--vien);border-radius:14px;padding:18px;display:flex;flex-direction:column;gap:12px}
.dau{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.ma{font-weight:800;color:var(--nhan2);font-size:15px}
.anh{display:grid;grid-template-columns:1fr 1fr;gap:8px}.anh figure{margin:0}.anh img{width:100%;border-radius:8px;border:1px solid var(--vien);display:block;cursor:zoom-in}
.anh figcaption{font-size:12px;color:var(--phu);margin-top:3px}
.nhan{font-size:12px;font-weight:600;color:var(--phu);text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px}
.chips{display:flex;flex-wrap:wrap;gap:6px}.chip{background:var(--chip);border-radius:999px;padding:2px 10px;font-size:13px}
.mau{display:flex;flex-wrap:wrap;gap:10px}.bang{display:flex;flex-direction:column;gap:3px;font-size:12px}.o_mau{display:flex;border-radius:6px;overflow:hidden;border:1px solid var(--vien);height:26px;width:120px}.o_mau span{flex:1}
ol,ul{margin:0;padding-left:20px}li{margin:2px 0}.tp li{font-size:14px}.nho{font-size:13px}
.quytac td:first-child{font-weight:800;color:var(--nhan2);white-space:nowrap}
.tron{display:inline-block;width:14px;height:14px;border-radius:4px;border:1px solid var(--vien);vertical-align:-2px;margin-right:2px}
.dem{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px}.cot{display:flex;align-items:center;gap:6px;font-size:13px;margin:2px 0}.cot i{display:block;height:10px;background:var(--nhan);border-radius:3px}
.xep{min-width:1180px}.xep td:nth-child(2),.xep td:nth-child(5),.xep td:nth-child(6),.xep td:nth-child(9),.xep td:nth-child(10){white-space:nowrap}
#phong{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;padding:16px;z-index:9}#phong img{max-width:100%;max-height:100%}
.chu_y{border-left:4px solid var(--nhan2);padding:8px 12px;background:var(--the);border-radius:6px}
"""

def o_mau(ma):
    return ''.join(f'<span style="background:{c}"></span>' for c in mau_hex(ma)[:5])

def ghi_html():
    P = []
    xv = D['xep_video']
    P.append(f"""<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mẫu kịch bản loạt ngân hàng</title><style>{CSS}</style></head><body><main>
<h1>Bảng phân loại mẫu kịch bản và phong cách gợi ý</h1>
<p class="phu">Loạt video thuật ngữ ngân hàng, kênh Chuyện nghề Ngân hàng · bản {D['phien_ban']} · {D['cap_nhat']} · nguồn dữ liệu <code>tai_san/so_tay_gu/mau_kich_ban.json</code></p>
<div class="tom"><div class="o"><b>{len(D['mau_kich_ban'])}</b>mẫu kịch bản theo dạng nội dung</div><div class="o"><b>{len(xv)}</b>video còn lại đã xếp mẫu và tổ hợp (lô 3 tới cuối loạt)</div>
<div class="o"><b>{len(dem('cl'))}</b>chất liệu được dùng, hai video liền nhau không trùng</div><div class="o"><b>{len(dem('mau'))}</b>bảng màu, <b style="display:inline;font-size:inherit">{len(dem('nh'))}</b> bài nhạc rè thấp</div>
<div class="o"><b>{'ĐẠT' if not loi else str(len(loi))+' lỗi'}</b>kiểm bằng máy: hợp lệ hệ trục, khác 3 video trước ở ≥ {min(khac_min.values())} trục</div></div>
<p class="chu_y">Ảnh trong mỗi thẻ là ảnh lưới đã duyệt của lô 1, lô 2 và ảnh mẫu kho hình chung, để xem <b>chất liệu và bố cục</b>. Nhiều ảnh còn nhiều chữ hơn quy tắc mới ở mục 1: khi dựng giữ chất liệu, bỏ chữ theo quy tắc C1–C8.</p>
<h2>1. Quy tắc ít chữ (Trung chốt 29/10/2026)</h2>
<p>{e(D['it_chu']['_ghi_chu'])}</p><div class="cuon"><table class="quytac"><tr><th>Mã</th><th>Quy tắc</th><th>Cách kiểm</th></tr>""")
    for q in D['it_chu']['quy_tac']:
        P.append(f"<tr><td>{q['ma']}</td><td>{e(q['noi_dung'])}</td><td>{e(q['kiem'])}</td></tr>")
    P.append(f"</table></div><p class='nho'>{e(D['it_chu'].get('so_do_mau', ''))}</p><p class='nho'>Lệnh: <code>{e(D['it_chu']['lenh_kiem'])}</code></p><h2>2. {len(D['mau_kich_ban'])} mẫu kịch bản</h2><div class='luoi'>")
    for m in D['mau_kich_ban']:
        dung = [v['ma'] for v in xv if v['mau_kich_ban'] == m['ma']]
        anh = ''.join(f"<figure><img loading='lazy' src='anh/{a['tep']}' alt='{e(a['chu_thich'])}'><figcaption>{e(a['chu_thich'])}</figcaption></figure>" for a in m['anh_mau'])
        mau = ''.join(f"<div class='bang'><div class='o_mau'>{o_mau(x)}</div>{x} {e(MAU[x]['ten'])}</div>" for x in m['mau'])
        nhac = ''.join(f"<li><b>{e(ten_nhac(n))}</b><br><span class='phu nho'>{e(mo_ta_nhac(n))}</span></li>" for n in m['nhac']['goi_y'])
        tp = ''.join(f"<li><b>{t}</b> {e(TP[t]['ten'])}</li>" for t in m['thu_phap'])
        P.append(f"""<section class="the" id="{m['ma']}"><div class="dau"><span class="ma">{m['ma']}</span><h3>{e(m['ten'])}</h3></div>
<div class="anh">{anh}</div>
<div><div class="nhan">Dấu hiệu nhận biết</div>{e(m['dau_hieu'])}</div>
<div><div class="nhan">Dàn chương mẫu</div><ol class="nho">{''.join(f'<li>{e(c)}</li>' for c in m['dan_chuong'])}</ol></div>
<div><div class="nhan">Lối viết · chất liệu · bố cục · mức chi tiết</div><div class="chips">{''.join(f'<span class=chip>{k}</span>' for k in m['kb'])}{''.join(f'<span class=chip>{c} {e(CL[c]["ten"])}</span>' for c in m['chat_lieu'])}{''.join(f'<span class=chip>{b} {e(BC[b]["ten"])}</span>' for b in m['bo_cuc'])}<span class=chip>{' / '.join(m['muc_chi_tiet'])}</span></div></div>
<div><div class="nhan">Bảng màu</div><div class="mau">{mau}</div></div>
<div><div class="nhan">Nhạc: {e(', '.join(NHOM[g] for g in m['nhac']['nhom']))} · {e(m['nhac']['tiet_tau'])} · {m['nhac']['bpm']} BPM</div><ul class="nho">{nhac}</ul></div>
<div><div class="nhan">Nhịp cắt cảnh</div>{e(m['nhip_cat'])}</div>
<div><div class="nhan">Thủ pháp hoạt hoạ</div><ul class="tp">{tp}</ul></div>
<div><div class="nhan">Hình kho chung dùng được</div><div class="chips">{''.join(f'<span class=chip>{k}{"" if KHO[k]["trang_thai"]=="da_duyet" else " (đề xuất, chưa dựng)"}</span>' for k in m['kho_hinh'])}</div></div>
<div><div class="nhan">Lỗi hay gặp</div><ul class="nho">{''.join(f'<li>{e(x)}</li>' for x in m['loi_hay_gap'])}</ul></div>
<div class="phu nho">Video được xếp mẫu này: {', '.join(dung) or '—'}</div></section>""")
    P.append("""</div><h2>3. Xếp mẫu và tổ hợp cho các video còn lại</h2>
<p class="nho">Thứ tự theo mục 4 kế hoạch loạt. Luật: hai video liền nhau khác chất liệu; mỗi video khác 3 video trước ở ít nhất hai trục; nhạc dùng lại bài cũ rè thấp (max10 &lt; 4 dB, max16 &lt; 6 dB), không tải thêm, mỗi bài cách ít nhất 3 video (bảng nhắm 6), video giảng công thức dùng nhịp vừa; cột Lặp nhạc đếm theo thứ tự loạt, tính cả lô 2. Phiên dựng chép cột tổ hợp vào dòng Biến tấu đầu kịch bản. Cột Phiên theo kế hoạch chạy đêm 29/10/2026 (A nh-cho-vay, B nh-tai-san-bd, C nh-no-xau, D nh-tien-gui, E kho-hinh-chung, F pha-may-html).</p>
<div class="cuon"><table class="xep"><tr><th>#</th><th>Mã</th><th>Video</th><th>Lô</th><th>Phiên</th><th>Mẫu</th><th>Lối viết</th><th>Chất liệu</th><th>Bố cục</th><th>Màu</th><th>Nhạc</th><th>Lặp nhạc</th><th>Mở đầu</th><th>Hình chính chuyển động</th></tr>""")
    for i, v in enumerate(xv, 1):
        P.append(f"<tr><td>{i}</td><td><b>{v['ma']}</b></td><td>{e(v['ten'])}</td><td>{v['lo']}</td><td>{e(PHIEN.get(v['ma'], ''))}</td><td><a href='#{v['mau_kich_ban']}'>{v['mau_kich_ban']}</a></td><td>{v['kb']}</td>"
                 f"<td>{v['cl']}<br><span class='phu'>{e(CL[v['cl']]['ten'])} · {v['ct']}</span></td><td>{v['bc']}</td>"
                 f"<td><span class='o_mau' style='width:70px;height:16px;display:inline-flex'>{o_mau(v['mau'])}</span><br>{v['mau']}</td>"
                 f"<td>{e(ten_nhac(v['nh']))}<br><span class='phu'>{NHAC[v['nh']]['bpm']} BPM, tiết tấu {NHAC[v['nh']]['tiet_tau'].lower()}</span></td><td>{lap(v['ma'])}</td><td>{e(v['mo_dau'])}</td><td>{e(v['hinh_chinh'])}</td></tr>")
    P.append("</table></div><h2>4. Độ rải theo trục</h2><div class='dem'>")
    for truc, ten in (('mau_kich_ban', 'Mẫu kịch bản'), ('cl', 'Chất liệu'), ('mau', 'Bảng màu'), ('nh', 'Nhạc'), ('kb', 'Lối viết'), ('bc', 'Bố cục')):
        c = dem(truc); mx = max(c.values())
        P.append(f"<div class='o'><div class='nhan'>{ten}</div>" + ''.join(f"<div class='cot'><span style='width:62px'>{k}</span><i style='width:{n/mx*160:.0f}px'></i>{n}</div>" for k, n in sorted(c.items())) + "</div>")
    P.append("</div>")
    nh = [m for m in H['mau'] if m.get('ngan_hang')]
    if nh:
        nguon = {n['ma']: n for n in doc('tai_san/so_tay_gu/mau_ngan_hang_nguon.json')}
        P.append(f"<h2>Bảng màu ngân hàng Việt Nam ({len(nh)} bảng)</h2><p class='nho'>Trung chốt 29/10/2026: mỗi ngân hàng Việt Nam một bộ màu lấy từ website của ngân hàng, ưu tiên cho các video còn lại, được dùng cả màu MB. Chỉ dùng màu; tên và logo ngân hàng vẫn không đưa lên hình. Màu nhấn đã chỉnh độ sáng cho đủ tương phản trên nền (chữ ≥ 7, nhấn ≥ 3). Mã dùng trong trang dựng: <code>KHO.datMau('MAU-xx')</code>.</p><div class='dem'>")
        for m in nh:
            n = nguon.get(m['ma'], {}); dung = [v['ma'] for v in xv if v['mau'] == m['ma']]
            goc = ''.join(f'<span style="background:{c}"></span>' for c in [n.get('chu_dao')] + (n.get('phu') or []) if c)
            P.append(f"<div class='o'><b style='font-size:16px;color:var(--chu)'>{m['ma']} {e(m['ngan_hang'])}</b><div class='bang'>Màu gốc trên website<div class='o_mau'>{goc}</div>Bảng dựng ({'nền tối' if m['nen']=='toi' else 'nền sáng'})<div class='o_mau'>{o_mau(m['ma'])}</div></div>"
                     f"<div class='phu nho'>Tin cậy {e(str(n.get('tin_cay')))} · <a href='{e(n.get('url',''))}'>trang nguồn</a><br>{e((n.get('nguon') or '')[:140])}</div><div class='nho'>Video: {', '.join(dung) or 'chưa xếp'}</div></div>")
        P.append("</div>")
    if canh_bao:
        P.append("<h2>5. Điểm cần để ý khi dựng</h2><ul class='nho'>" + ''.join(f"<li>{e(x)}</li>" for x in canh_bao) + "</ul>")
    P.append("""<div id="phong" onclick="this.style.display='none'"><img alt=""></div>
<script>document.querySelectorAll('.anh img').forEach(function(i){i.onclick=function(){var p=document.getElementById('phong');p.firstChild.src=i.src;p.style.display='flex'}})</script>
</main></body></html>""")
    os.makedirs(os.path.dirname(TRANG), exist_ok=True)
    open(TRANG, 'w').write('\n'.join(P))

in_ket_qua()
if '--kiem' not in sys.argv:
    if loi: sys.exit('Còn lỗi, chưa ghi file.')
    ghi_md(); ghi_html()
    print('Đã ghi', os.path.relpath(TRANG, GOC), 'và tai_san/so_tay_gu/mau_kich_ban.md')
sys.exit(1 if loi else 0)
