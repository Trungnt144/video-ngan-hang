"""Tạo bản nghe để duyệt giọng; chưa kết xuất hình, không phải bản nháp video."""
from pathlib import Path
import json, subprocess
D=Path(__file__).resolve().parent;R=D.parent.parent
cfg=json.loads((D/'nhip.json').read_text()); args=[str(R/'xuong_thu_hyperframes/bin/ffmpeg'),'-v','error','-y']
filters=[]; inputs=[]
for i,voice in enumerate(cfg['giong']):
 args+=['-i',str(D/voice['tep'])];ms=round(voice['t']*1000)
 filters.append(f'[{i}:a]adelay={ms}|{ms}[v{i}]');inputs.append(f'[v{i}]')
filters.append(''.join(inputs)+f'amix=inputs={len(inputs)}:normalize=0:duration=longest,apad,atrim=duration={cfg["thoi_luong_giay"]},loudnorm=I=-16:TP=-1.5:LRA=7[v]')
out=R/'san_pham/2026.11.03.EBITDA_la_gi/tai_nguyen/ban_nhap/2026.11.03.ebitda_giong_duyet.m4a'
args+=['-filter_complex',';'.join(filters),'-map','[v]','-c:a','aac','-b:a','192k',str(out)]
subprocess.run(args,check=True);print(out)
