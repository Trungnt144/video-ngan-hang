#!/usr/bin/env python3
"""Soi hình thu nhỏ của các video vượt trội trên YouTube theo từ khoá, để học cách ghi chữ và chọn ảnh.

    python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten dien --tu "điện mặt trời" --tu "điện gió" [--so 30]
    python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten dien --nhom dien          (lấy bộ từ khoá trong tu_khoa.json)
    python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten kenh_x --kenh https://www.youtube.com/@abc   (video vượt trội của một kênh)

Không cần khoá API: tìm video và đọc danh sách video của kênh bằng yt-dlp, đọc chữ và đếm mặt người trên hình bằng
Vision của macOS (doc_hinh.swift). Chỉ lấy video dài (từ 120 giây), bỏ Shorts và phát trực tiếp.

Độ vượt trội = lượt xem của video chia trung vị lượt xem video thứ 31–100 của chính kênh đó (bỏ 30 video mới nhất vì
lượt xem chưa đủ ngày) (cách 1of10, vidIQ gọi
là outlier). Độ vượt trội 3 nghĩa là video được xem gấp ba một video bình thường của kênh: hình thu nhỏ và tiêu đề của
nó đáng học hơn video có nhiều lượt xem chỉ vì kênh lớn. Giới hạn: kết quả tìm kiếm của YouTube đã nghiêng về video
nhiều lượt xem; yt-dlp không trả ngày đăng ở chế độ nhanh nên video cũ có lợi thế; kênh dưới 40 video, trung vị dưới 100 lượt xem hoặc dưới 1.000 người đăng ký bị bỏ.
Cột lượt xem trên người đăng ký (tren_dk) là thước đo phụ.

Kết quả vào du_lieu/soi_hinh_thu_nho/<ngày>_<tên>/ (ngoài git): anh/ (hình thu nhỏ), ket_qua.json, bang.md (bảng
xếp hạng và so sánh nhóm vượt trội với nhóm thường), luoi_vuot_troi.jpg, luoi_thuong.jpg (bảng ảnh để Claude xem).
"""
import argparse, datetime, json, os, re, statistics, subprocess, sys, time, unicodedata, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont, ImageStat

THU_MUC = os.path.dirname(os.path.abspath(__file__))
GOC = os.path.abspath(os.path.join(THU_MUC, '..', '..', '..'))
RA_CHUNG = os.path.join(GOC, 'du_lieu', 'soi_hinh_thu_nho')
BO_NHO_KENH = os.path.join(RA_CHUNG, '_kenh.json')  # trung vị lượt xem từng kênh, dùng lại trong 7 ngày
YT = ['yt-dlp', '--no-warnings', '--ignore-config', '--extractor-args', 'youtube:lang=vi', '--flat-playlist', '-J']


def ytdlp(dich, so):
    r = subprocess.run(YT + ['--playlist-end', str(so), dich], capture_output=True, text=True, timeout=180)
    if r.returncode != 0:
        raise RuntimeError((r.stderr.strip().splitlines() or ['yt-dlp lỗi'])[-1])
    return [e for e in json.loads(r.stdout).get('entries') or [] if e]


def video_dai(e):
    return (e.get('duration') or 0) >= 120 and e.get('live_status') not in ('is_live', 'is_upcoming') and e.get('view_count')


def trung_vi_kenh(kenh_id, bo_nho):
    """Trung vị lượt xem video thứ 31–100 của kênh (bỏ 30 video mới nhất vì lượt xem chưa đủ ngày, kênh báo đăng
    hàng chục video mỗi ngày) và số người đăng ký."""
    o = bo_nho.get(kenh_id)
    if o and time.time() - o['luc'] < 7 * 86400 and o.get('nguoi_dk') is not None:
        return o
    try:
        # không truyền lang=vi: với giao diện tiếng Việt yt-dlp không đọc được số người đăng ký
        r = subprocess.run(['yt-dlp', '--no-warnings', '--ignore-config', '--flat-playlist', '-J', '--playlist-end', '100', f'https://www.youtube.com/channel/{kenh_id}/videos'],
                           capture_output=True, text=True, timeout=180)
        d = json.loads(r.stdout)
    except Exception as loi:
        print(f'  bỏ kênh {kenh_id}: {loi}', file=sys.stderr)
        return None
    ds = [e['view_count'] for e in (d.get('entries') or [])[30:] if e and e.get('view_count')]
    o = {'luc': time.time(), 'trung_vi': statistics.median(ds) if len(ds) >= 10 else None, 'so_video': len(ds),
         'nguoi_dk': d.get('channel_follower_count')}
    bo_nho[kenh_id] = o
    return o


def tai_anh(vid, ra):
    for ten in ('hq720.jpg', 'mqdefault.jpg'):
        try:
            with urllib.request.urlopen(f'https://i.ytimg.com/vi/{vid}/{ten}', timeout=20) as r:
                open(ra, 'wb').write(r.read())
            return True
        except Exception:
            continue
    return False


def bo_dau(s):
    s = unicodedata.normalize('NFD', s.lower().replace('đ', 'd'))
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')


def tu(s):
    return re.findall(r'[0-9a-z]+', bo_dau(s))


def do_anh(p):
    im = Image.open(p).convert('RGB').resize((320, 180))
    hsv = ImageStat.Stat(im.convert('HSV'))
    l = ImageStat.Stat(im.convert('L'))
    return {'sang': round(l.mean[0]), 'tuong_phan': round(l.stddev[0]), 'bao_hoa': round(hsv.mean[1])}


def bang_anh(muc, ra, tieu_de):
    W, H, C = 400, 225, 5
    hang = (len(muc) + C - 1) // C
    nen = Image.new('RGB', (W * C, 40 + hang * (H + 46)), (20, 20, 20))
    d = ImageDraw.Draw(nen)
    try:
        f = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Unicode.ttf', 15)
        f2 = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Unicode.ttf', 20)
    except Exception:
        f = f2 = ImageFont.load_default()
    d.text((8, 8), tieu_de, fill='white', font=f2)
    for i, m in enumerate(muc):
        x, y = (i % C) * W, 40 + (i // C) * (H + 46)
        try:
            im = Image.open(m['anh']).convert('RGB')
            im.thumbnail((W, H))
            nen.paste(im, (x, y))
        except Exception:
            pass
        d.rectangle([x, y, x + 150, y + 22], fill='black')
        d.text((x + 4, y + 3), f"#{i + 1} ×{m['vuot_troi']:.1f} · {m['luot_xem'] // 1000}k", fill='yellow', font=f)
        d.text((x + 4, y + H + 4), m['tieu_de'][:46], fill='white', font=f)
        d.text((x + 4, y + H + 24), m['kenh'][:46], fill=(160, 160, 160), font=f)
    nen.save(ra, quality=85)


def tom_tat(nhom):
    n = len(nhom) or 1
    tv = lambda xs: statistics.median(xs) if xs else 0
    return {
        'so_video': len(nhom),
        'co_mat_nguoi_%': round(100 * sum(1 for m in nhom if m['mat']) / n),
        'mat_to_%': round(100 * sum(1 for m in nhom if m['mat_lon'] >= 0.03) / n),
        'co_chu_%': round(100 * sum(1 for m in nhom if m['so_tu']) / n),
        'so_tu_trung_vi': tv([m['so_tu'] for m in nhom if m['so_tu']]),
        'chu_trung_tieu_de_%': round(100 * tv([m['trung_tieu_de'] for m in nhom if m['so_tu']])),
        'dien_tich_chu_%': round(100 * tv([m['dien_tich_chu'] for m in nhom if m['so_tu']])),
        'co_so_tren_hinh_%': round(100 * sum(1 for m in nhom if any(c.isdigit() for c in ' '.join(m['chu']))) / n),
        'co_dau_hoi_%': round(100 * sum(1 for m in nhom if '?' in ' '.join(m['chu'])) / n),
        'sang': tv([m['sang'] for m in nhom]), 'tuong_phan': tv([m['tuong_phan'] for m in nhom]),
        'bao_hoa': tv([m['bao_hoa'] for m in nhom]),
    }


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--ten', required=True, help='tên lượt soi, không dấu')
    ap.add_argument('--tu', action='append', default=[], help='từ khoá tìm trên YouTube (lặp được)')
    ap.add_argument('--nhom', help='nhóm từ khoá trong tu_khoa.json cùng thư mục')
    ap.add_argument('--kenh', action='append', default=[], help='đường dẫn kênh: soi các video của kênh')
    ap.add_argument('--so', type=int, default=30, help='số kết quả mỗi từ khoá (mặc định 30)')
    a = ap.parse_args()
    tu_khoa = list(a.tu)
    if a.nhom:
        tu_khoa += json.load(open(os.path.join(THU_MUC, 'tu_khoa.json'), encoding='utf8'))[a.nhom]
    if not tu_khoa and not a.kenh:
        ap.error('cần --tu, --nhom hoặc --kenh')

    ra = os.path.join(RA_CHUNG, f"{datetime.date.today():%Y.%m.%d}_{a.ten}")
    os.makedirs(os.path.join(ra, 'anh'), exist_ok=True)
    bo_nho = json.load(open(BO_NHO_KENH)) if os.path.exists(BO_NHO_KENH) else {}

    video = {}
    nguon = [(f'ytsearch{a.so}:{k}', k) for k in tu_khoa] + [(u.rstrip('/') + '/videos', u) for u in a.kenh]
    for dich, nhan in nguon:
        try:
            ds = ytdlp(dich, a.so if not dich.endswith('/videos') else 60)
        except Exception as loi:
            print(f'Bỏ "{nhan}": {loi}', file=sys.stderr)
            continue
        for e in filter(video_dai, ds):
            e.setdefault('channel_id', e.get('channel_id') or nhan)
            video.setdefault(e['id'], dict(e, tu_khoa=nhan))
        print(f'"{nhan}": {len(ds)} kết quả, cộng dồn {len(video)} video dài')

    kenh = {e['channel_id'] for e in video.values() if e.get('channel_id')}
    print(f'Đo trung vị lượt xem {len(kenh)} kênh...')
    with ThreadPoolExecutor(4) as ex:
        tv = dict(zip(kenh, ex.map(lambda k: trung_vi_kenh(k, bo_nho), kenh)))
    json.dump(bo_nho, open(BO_NHO_KENH, 'w'), ensure_ascii=False)

    muc = []
    for e in video.values():
        o = tv.get(e.get('channel_id')) or {}
        t = o.get('trung_vi')
        if not t or t < 100 or (o.get('nguoi_dk') is not None and o['nguoi_dk'] < 1000):
            continue
        muc.append({'id': e['id'], 'tieu_de': e.get('title') or '', 'kenh': e.get('channel') or '', 'luot_xem': e['view_count'],
                    'trung_vi_kenh': t, 'vuot_troi': round(e['view_count'] / t, 2), 'nguoi_dk': o['nguoi_dk'],
                    'tren_dk': round(e['view_count'] / o['nguoi_dk'], 2) if o.get('nguoi_dk') else None, 'thoi_luong': e.get('duration'),
                    'tu_khoa': e['tu_khoa'], 'anh': os.path.join(ra, 'anh', f"{e['id']}.jpg"),
                    'link': f"https://www.youtube.com/watch?v={e['id']}"})
    with ThreadPoolExecutor(8) as ex:
        co = list(ex.map(lambda m: os.path.exists(m['anh']) or tai_anh(m['id'], m['anh']), muc))
    muc = [m for m, c in zip(muc, co) if c]

    r = subprocess.run(['swift', os.path.join(THU_MUC, 'doc_hinh.swift')] + [m['anh'] for m in muc], capture_output=True, text=True)
    doc = {}
    for dong in r.stdout.splitlines():
        try:
            o = json.loads(dong)
            doc[o['tep']] = o
        except Exception:
            pass
    for m in muc:
        o = doc.get(m['anh'], {})
        m['chu'] = [c for c in o.get('chu', []) if bo_dau(c) != bo_dau(m['kenh'])]
        w = tu(' '.join(m['chu']))
        m['so_tu'] = len(w)
        tt = set(tu(m['tieu_de']))
        m['trung_tieu_de'] = round(sum(1 for x in w if x in tt) / len(w), 2) if w else 0
        m['dien_tich_chu'] = round(o.get('dien_tich_chu', 0), 3)
        m['mat'], m['mat_lon'] = o.get('mat', 0), round(o.get('mat_lon', 0), 3)
        m.update(do_anh(m['anh']))

    muc.sort(key=lambda m: -m['vuot_troi'])
    tren = [m for m in muc if m['vuot_troi'] >= 2]
    thuong = [m for m in muc if m['vuot_troi'] < 1]
    json.dump(muc, open(os.path.join(ra, 'ket_qua.json'), 'w'), ensure_ascii=False, indent=1)
    bang_anh(muc[:30], os.path.join(ra, 'luoi_vuot_troi.jpg'), f'{a.ten}: 30 video vượt trội nhất (×lượt xem so với trung vị kênh)')
    bang_anh(thuong[:30], os.path.join(ra, 'luoi_thuong.jpg'), f'{a.ten}: video dưới mức trung vị kênh (đối chứng)')

    st, sn = tom_tat(tren), tom_tat(thuong)
    d = [f'# Soi hình thu nhỏ: {a.ten} ({datetime.date.today():%d/%m/%Y})', '',
         f'Từ khoá: {", ".join(tu_khoa) or "—"} · Kênh: {", ".join(a.kenh) or "—"} · {len(muc)} video dài có đủ số liệu, {len(kenh)} kênh.', '',
         '## So sánh nhóm vượt trội (từ ×2) với nhóm thường (dưới ×1)', '',
         '| Chỉ số | Vượt trội | Thường |', '|---|---|---|']
    ten_cs = {'so_video': 'Số video', 'co_mat_nguoi_%': 'Có mặt người (%)', 'mat_to_%': 'Mặt to, từ 3% diện tích hình (%)',
              'co_chu_%': 'Có chữ (%)', 'so_tu_trung_vi': 'Số từ trên hình (trung vị, hình có chữ)',
              'chu_trung_tieu_de_%': 'Tỉ lệ từ trên hình trùng tiêu đề (trung vị, %)', 'dien_tich_chu_%': 'Diện tích chữ (trung vị, %)',
              'co_so_tren_hinh_%': 'Có con số trên hình (%)', 'co_dau_hoi_%': 'Có dấu hỏi (%)', 'sang': 'Độ sáng 0–255',
              'tuong_phan': 'Độ tương phản (độ lệch chuẩn độ sáng)', 'bao_hoa': 'Độ bão hoà màu 0–255'}
    d += [f'| {ten_cs[k]} | {st[k]} | {sn[k]} |' for k in ten_cs]
    d += ['', 'Mẫu nhỏ thì chênh lệch chỉ là gợi ý, không phải kết luận. Đọc chữ bằng máy có thể sót chữ cách điệu.', '',
          '## 40 video vượt trội nhất', '', '| # | ×vượt trội | Lượt xem | Xem/đăng ký | Kênh | Tiêu đề | Chữ trên hình | Mặt |', '|---|---|---|---|---|---|---|---|']
    for i, m in enumerate(muc[:40], 1):
        d.append(f"| {i} | {m['vuot_troi']} | {m['luot_xem']:,} | {m['tren_dk']} | {m['kenh']} | [{m['tieu_de'][:70]}]({m['link']}) | {' / '.join(m['chu'])[:80]} | {m['mat']} |")
    open(os.path.join(ra, 'bang.md'), 'w', encoding='utf8').write('\n'.join(d) + '\n')
    print(f'Xong: {ra}\n  {len(tren)} video vượt trội từ ×2, {len(thuong)} video dưới trung vị kênh')


if __name__ == '__main__':
    main()
