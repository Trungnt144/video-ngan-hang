# N199: ghép ảnh tĩnh thành bảng 2 cột (mỗi ảnh 960x540) để xem nhanh. Dùng: python3 -I n199_bang.py <ra.jpg> <a.png> ...
import sys, subprocess, os
FF = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../xuong_thu_hyperframes/bin/ffmpeg')
ra, ds = sys.argv[1], sys.argv[2:]
n = len(ds)
cmd = [FF, '-v', 'error', '-y']
for f in ds: cmd += ['-i', f]
fc = ''.join(f'[{i}:v]scale=960:540[v{i}];' for i in range(n))
if n == 1:
    fc += '[v0]copy[o]'
else:
    lay = '|'.join(f'{(i % 2) * 960}_{(i // 2) * 540}' for i in range(n))
    fc += ''.join(f'[v{i}]' for i in range(n)) + f'xstack=inputs={n}:layout={lay}:fill=black[o]'
subprocess.run(cmd + ['-filter_complex', fc, '-map', '[o]', '-frames:v', '1', '-q:v', '4', ra], check=True)
print(ra)
