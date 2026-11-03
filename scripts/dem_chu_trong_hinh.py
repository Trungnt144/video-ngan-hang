#!/usr/bin/env python3
"""Kiểm quy tắc ít chữ (C2, C3, C4 trong tai_san/so_tay_gu/mau_kich_ban.json) trên video hoặc ảnh tĩnh.

Cắt khung từ MP4 mỗi --moi giây (hoặc lấy mọi ảnh .png/.jpg trong thư mục), đọc chữ bằng Vision
của macOS (dem_chu_trong_hinh.swift), bỏ dải phụ đề y 900–1080, rồi đếm:
  C2  tổng số từ trong khung ≤ 12 (khung trích luật được 20, chỉ một khung)
  C3  mỗi dòng chữ ≤ 6 từ
  C4  không dòng nào trùng 6 tiếng liên tiếp của lời đọc (khi có --loi)
Đếm theo tiếng (chữ cách nhau bởi dấu cách). Nhãn "ví dụ giả định" không tính. Con số tính một từ.

  python3 scripts/dem_chu_trong_hinh.py <video.mp4 | thư mục ảnh> [--moi 2] [--loi loi_doc.txt] [--bo-qua "cụm 1;cụm 2"]

Thoát mã 1 khi có khung phạm quy tắc. Ảnh lưới ghép nhiều khung không dùng được (vị trí dải phụ đề sai).
"""
import argparse, glob, json, os, re, shutil, subprocess, sys, tempfile

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
QT = json.load(open(os.path.join(GOC, 'tai_san/so_tay_gu/mau_kich_ban.json')))['it_chu']
Y_PHU_DE = QT['dai_phu_de_y'][0] / 1080  # dải phụ đề bắt đầu ở y 900 trên khung 1080
BO_QUA_MAC_DINH = ['ví dụ giả định']

def tu(s): return re.findall(r'[\wÀ-ỹ%.,]+', s.lower())

def tim_ffmpeg():
    # Theo xuong_html/cong_cu/cat_khung_xem.sh: biến FFMPEG, bản trong xuong_thu_hyperframes, rồi ffmpeg của máy.
    for p in (os.environ.get('FFMPEG'), os.path.join(GOC, 'xuong_thu_hyperframes/bin/ffmpeg'), shutil.which('ffmpeg')):
        if p and os.access(p, os.X_OK): return p
    sys.exit('Không tìm thấy ffmpeg (đặt biến FFMPEG)')

def cat_khung(video, moi, thu_muc):
    subprocess.run([tim_ffmpeg(), '-v', 'error', '-i', video, '-vf', f'fps=1/{moi},scale=1920:1080', os.path.join(thu_muc, 'k_%04d.png')], check=True)
    return sorted(glob.glob(os.path.join(thu_muc, 'k_*.png')))

def doc_chu(anh):
    kq = []
    for i in range(0, len(anh), 40):
        r = subprocess.run(['swift', os.path.join(GOC, 'scripts/dem_chu_trong_hinh.swift')] + anh[i:i + 40], capture_output=True, text=True)
        kq += [json.loads(d) for d in r.stdout.splitlines() if d.startswith('{')]
    return kq

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('nguon'); ap.add_argument('--moi', type=float, default=2)
    ap.add_argument('--loi', help='file lời đọc (.txt, .md)'); ap.add_argument('--bo-qua', default='')
    a = ap.parse_args()
    bo_qua = [x.strip().lower() for x in a.bo_qua.split(';') if x.strip()] + BO_QUA_MAC_DINH
    tam = tempfile.mkdtemp(prefix='dem_chu_')
    anh = sorted(glob.glob(os.path.join(a.nguon, '*.png')) + glob.glob(os.path.join(a.nguon, '*.jpg'))) if os.path.isdir(a.nguon) else cat_khung(a.nguon, a.moi, tam)
    loi_doc = ' '.join(tu(open(a.loi).read())) if a.loi else ''
    pham, khung_luat, tong = [], 0, []
    for i, k in enumerate(doc_chu(anh)):
        moc = f"{i * a.moi:.0f}s" if not os.path.isdir(a.nguon) else os.path.basename(k['tep'])
        dong = [d['chu'] for d in k.get('dong', []) if (d['y_tren'] + d['y_duoi']) / 2 < Y_PHU_DE]
        for b in bo_qua: dong = [re.sub(re.escape(b), '', d, flags=re.I).strip() for d in dong]
        dong = [d for d in dong if tu(d)]
        so = sum(len(tu(d)) for d in dong); tong.append(so)
        loi = []
        gioi_han = 12
        if so > 12 and any(re.search(r'\b(Điều|Khoản|Thông tư|Nghị định)\b', d) for d in dong):
            khung_luat += 1; gioi_han = 20
        if so > gioi_han: loi.append(f"C2 {so} từ")
        loi += [f"C3 dòng {len(tu(d))} từ: \"{d}\"" for d in dong if len(tu(d)) > 6]
        if loi_doc:
            for d in dong:
                w = tu(d)
                if any(' '.join(w[j:j + 6]) in loi_doc for j in range(len(w) - 5)): loi.append(f"C4 trùng lời đọc: \"{d}\"")
        if loi: pham.append((moc, loi))
    print(f"Đã đọc {len(tong)} khung ({khung_luat} khung trích luật, giới hạn 20 từ, tối đa một cảnh) · số từ ngoài phụ đề: trung bình {sum(tong) / max(1, len(tong)):.1f}, lớn nhất {max(tong or [0])}")
    for moc, l in pham: print(f"  {moc}: " + ' · '.join(l))
    print('Kết quả:', 'ĐẠT' if not pham else f'{len(pham)} khung phạm quy tắc ít chữ')
    sys.exit(1 if pham else 0)

if __name__ == '__main__':
    main()
