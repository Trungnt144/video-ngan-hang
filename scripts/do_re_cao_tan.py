# Đo lớp tiếng rè cao tần nổi lên giữa bài nhạc (27/10/2026). Biến đổi Fourier từng đoạn 5 giây, tính tỉ lệ năng lượng
# dải trên 10 kHz và trên 16 kHz so với toàn dải; so mỗi đoạn với trung vị cả bài (bỏ đoạn nhỏ hơn trung vị 15 dB).
# max10/max16: mức tăng lớn nhất (dB); bad_s: giây bắt đầu các đoạn tăng >=4 dB (trên 10 kHz) hoặc >=8 dB (trên 16 kHz).
# Mốc so sánh: NH02 Your Breath (có rè, Trung nghe thấy) cho 7,9 / 14,5; NH09 Coffee or Tea (không rè) cho 2,9 / 7,1.
# Ngưỡng loại đang dùng: max10 >= 5 hoặc max16 >= 8. Lưu ý: trống, chũm chọe vào giữa bài cũng làm số tăng, nên số vượt
# ngưỡng là "nghi rè, phải nghe lại", số dưới ngưỡng là sạch.
# Chạy: .venv_vieneu/bin/python scripts/do_re_cao_tan.py xuong_dai/may_bien_ap/node_modules/@remotion/compositor-darwin-arm64/ffmpeg <file.mp3>...
import sys, subprocess, numpy as np, os, io, wave, json
FF=os.path.abspath(sys.argv[1]); SR=44100
for f in sys.argv[2:]:
    raw=subprocess.run([FF,"-v","quiet","-i",os.path.abspath(f),"-ac","1","-ar",str(SR),"-c:a","pcm_s16le","-f","wav","-"],capture_output=True,cwd=os.path.dirname(FF),env={**os.environ,"DYLD_LIBRARY_PATH":os.path.dirname(FF)}).stdout
    w=wave.open(io.BytesIO(raw)); x=np.frombuffer(w.readframes(10**9),np.int16).astype(np.float32)/32768
    seg=5*SR; n=len(x)//seg; r10=[];r16=[];lv=[]
    for i in range(n):
        s=x[i*seg:(i+1)*seg]; S=np.abs(np.fft.rfft(s*np.hanning(len(s))))**2; fr=np.fft.rfftfreq(len(s),1/SR)
        tot=S.sum()+1e-12
        r10.append(10*np.log10(S[fr>10000].sum()/tot+1e-12)); r16.append(10*np.log10(S[fr>16000].sum()/tot+1e-12))
        lv.append(10*np.log10((s**2).mean()+1e-12))
    r10=np.array(r10);r16=np.array(r16);lv=np.array(lv)
    ok=lv>np.median(lv)-15  # bỏ đoạn gần lặng
    m10=np.median(r10[ok]);m16=np.median(r16[ok])
    d10=r10-m10;d16=r16-m16
    bad=[i*5 for i in range(n) if ok[i] and (d10[i]>=4 or d16[i]>=8)]
    peak=int(np.max(np.abs(x))*1000)/1000
    print(json.dumps(dict(file=os.path.basename(f),max10=round(float(d10[ok].max()),1),max16=round(float(d16[ok].max()),1),med16=round(float(m16),1),bad_s=bad,peak=peak)))
