"""Ghép bản dọc ba tầng (BC-14) từ video ngang đã xong: tiêu đề hai dòng đứng yên, hình ngang ở giữa, phụ đề nghiêng ở dưới.

python3 -I ghep_ba_tang.py <video ngang> <thoi_gian.json> <tu giây> <tới giây> <dòng 1> <dòng 2> <file ra> [mau_nen] [--doc <video dọc 1080x1920>]

--doc: dùng video dọc đã dựng lại khổ 1080x1920 (nội dung trong x 90–990, y 600–1240) làm hình,
tiếng vẫn lấy từ video ngang; phụ đề đặt ở y 1270, lệch trái để tránh cột nút bấm bên phải của Facebook.
"""
import json, os, subprocess, sys, tempfile

FF = os.path.expanduser('~/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg')
PHONG = os.path.expanduser('~/Library/Fonts')
ANTON = os.path.join(PHONG, 'anton.ttf')
DUOI = 2.5          # giây giữ khung cuối kèm lời mời xem bản đầy đủ
CAT_DAY = 900       # bỏ dải phụ đề cũ 900–1080 của khung ngang
# Ứng dụng Facebook trên điện thoại cao cắt khoảng 60 điểm ảnh mỗi bên khung 1080 (đo 02/11/2026),
# nên hình và chữ nằm trong x 90–990.
RONG = 900
Y_HINH = 660
Y_PHU_DE = Y_HINH + round(RONG * CAT_DAY / 1920 / 2) * 2 + 70

thamso = sys.argv[1:]
doc = None
if '--doc' in thamso:
    i = thamso.index('--doc'); doc = thamso[i + 1]; del thamso[i:i + 2]
video, tg, t0, t1, dong1, dong2, ra = thamso[:7]
t0, t1 = float(t0), float(t1)
nen = thamso[7] if len(thamso) > 7 else '0x001640'
X_PHU_DE = 540
if doc:
    Y_PHU_DE, X_PHU_DE = 1270, 495


def chia_cum(tu):
    """Chia các từ của một câu thành cụm 4–8 từ, ưu tiên ngắt sau dấu câu."""
    cum, hien = [], []
    for w in tu:
        hien.append(w)
        dau = w['chu'][-1] in ',.:;?!'
        if len(hien) >= 8 or (dau and len(hien) >= 4):
            cum.append(hien); hien = []
    if hien:
        if cum and len(hien) <= 2:
            cum[-1] += hien
        else:
            cum.append(hien)
    return cum


def ngat_dong(tu):
    """Vị trí từ bắt đầu dòng 2 (None nếu một dòng đủ), chia đều theo số ký tự."""
    s = ' '.join(w for w, _ in tu)
    if len(s) <= 17:
        return None
    dem, tot, vt = 0, None, None
    for i, (w, _) in enumerate(tu[:-1]):
        dem += len(w) + 1
        lech = abs(dem - len(s) / 2)
        if tot is None or lech < tot:
            tot, vt = lech, i + 1
    return vt


def to_chu(tu, k):
    """Cả cụm màu trắng, chỉ chữ thứ k (đang đọc) tô vàng; không đổi cỡ nên dòng đứng yên."""
    vt = ngat_dong(tu)
    ra = []
    for i, (w, _) in enumerate(tu):
        if i == vt:
            ra.append(r'\N')
        elif i:
            ra.append(' ')
        ra.append(f'{{\\1c&H00F2FF&}}{w}{{\\1c&HFFFFFF&}}' if i == k else w)
    return ''.join(ra)


def gio(x):
    x = max(0.0, x)
    return f'{int(x // 3600)}:{int(x % 3600 // 60):02d}:{x % 60:05.2f}'


cum = []
for ch in json.load(open(tg))['chuong']:
    for cau in ch['cau']:
        for c in chia_cum(cau['tu']):
            if c[0]['t'] >= t0 and c[-1]['den'] <= t1:
                bd = c[0]['t'] - t0 - 0.05
                cum.append([bd, c[-1]['den'] - t0 + 0.35, [(w['chu'], round((w['t'] - t0 - bd) * 1000)) for w in c]])
for a, b in zip(cum, cum[1:]):
    a[1] = min(a[1], b[0])

dai = t1 - t0
cum.append([dai + 0.2, dai + DUOI, [(w, 0) for w in 'Xem bản đầy đủ trên YouTube'.split()]])
ass = ['[Script Info]', 'ScriptType: v4.00+', 'WrapStyle: 2', 'PlayResX: 1080', 'PlayResY: 1920', '',
       '[V4+ Styles]',
       'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
       'Style: PD,Montserrat SemiBold,87,&H00FFFFFF,&H00FFFFFF,&H00301000,&H80000000,0,1,0,0,100,100,0,0,1,6,2,8,90,90,0,1',
       '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
for a, b, tu in cum:
    moc = [a + ms / 1000 for _, ms in tu] + [b]
    moc[0] = a
    for k in range(len(tu)):
        if moc[k + 1] > moc[k]:
            ass.append(f'Dialogue: 0,{gio(moc[k])},{gio(moc[k + 1])},PD,,0,0,0,,{{\\pos({X_PHU_DE},{Y_PHU_DE})}}{to_chu(tu, k)}')

tam = tempfile.mkdtemp()
open(os.path.join(tam, 'pd.ass'), 'w').write('\n'.join(ass) + '\n')
open(os.path.join(tam, 't1.txt'), 'w').write(dong1)
open(os.path.join(tam, 't2.txt'), 'w').write(dong2)

tong = dai + DUOI
co = min(84, int(RONG / (0.43 * max(len(dong1), len(dong2)))))
chu = (f"drawtext=fontfile={ANTON}:textfile=t1.txt:fontsize={co}:fontcolor=0xFFF200:borderw=5:bordercolor=0x111111:x=(w-tw)/2:y=345,"
       f"drawtext=fontfile={ANTON}:textfile=t2.txt:fontsize={co}:fontcolor=0xE8202A:borderw=5:bordercolor=white:x=(w-tw)/2:y={345 + int(co * 1.35)},"
       f"subtitles=pd.ass:fontsdir={PHONG}[v];")
tieng = f"[0:a]apad=pad_dur={DUOI},atrim=0:{tong},afade=t=out:st={tong - 1.5}:d=1.5[a]"
if doc:
    loc = f"[1:v]tpad=stop_mode=clone:stop_duration={DUOI}," + chu + tieng
    vao = ['-ss', str(t0), '-to', str(t1), '-i', os.path.abspath(video), '-ss', str(t0), '-to', str(t1), '-i', os.path.abspath(doc)]
else:
    loc = (f"color=c={nen}:s=1080x1920:r=30:d={tong}[bg];"
           f"[0:v]crop=1920:{CAT_DAY}:0:0,scale={RONG}:-2,tpad=stop_mode=clone:stop_duration={DUOI}[h];"
           f"[bg][h]overlay=(W-w)/2:{Y_HINH}:shortest=1," + chu + tieng)
    vao = ['-ss', str(t0), '-to', str(t1), '-i', os.path.abspath(video)]
subprocess.run([FF, '-v', 'error', '-y', *vao,
                '-filter_complex', loc, '-map', '[v]', '-map', '[a]', '-r', '30',
                '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
                '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', os.path.abspath(ra)],
               cwd=tam, check=True)
print(ra, round(tong, 2), 'giây,', len(cum), 'cụm phụ đề')
