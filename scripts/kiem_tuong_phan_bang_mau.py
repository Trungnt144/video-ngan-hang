# Kiểm tương phản các bảng màu bộ biến thể D-09b (26/10/2026).
# Chạy: python3 scripts/kiem_tuong_phan_bang_mau.py tai_san/so_tay_gu/dung/d09b_bien_the/bang_mau_goc.json
# Ngưỡng: chữ/nền >= 7:1; chữ trên thẻ >= 7:1; màu nhấn (bộ phận trọng tâm)/nền >= 3:1 (chuẩn WCAG cho thành phần đồ hoạ);
# độ khác màu CIEDE2000 giữa màu bộ phận và nền >= 20, giữa màu nhấn và mọi màu bộ phận >= 15.
import json, math, sys
def h2r(h): h=h.lstrip('#'); return [int(h[i:i+2],16)/255 for i in (0,2,4)]
def lin(c): return c/12.92 if c<=0.04045 else ((c+0.055)/1.055)**2.4
def lum(h): r,g,b=[lin(c) for c in h2r(h)]; return 0.2126*r+0.7152*g+0.0722*b
def cr(a,b): la,lb=sorted([lum(a),lum(b)],reverse=True); return (la+0.05)/(lb+0.05)
def lab(h):
    r,g,b=[lin(c) for c in h2r(h)]
    X=(0.4124*r+0.3576*g+0.1805*b)/0.95047; Y=0.2126*r+0.7152*g+0.0722*b; Z=(0.0193*r+0.1192*g+0.9505*b)/1.08883
    f=lambda t: t**(1/3) if t>0.008856 else 7.787*t+16/116
    return 116*f(Y)-16, 500*(f(X)-f(Y)), 200*(f(Y)-f(Z))
def de00(a,b):
    L1,a1,b1=lab(a);L2,a2,b2=lab(b)
    C1=math.hypot(a1,b1);C2=math.hypot(a2,b2);Cb=(C1+C2)/2
    G=0.5*(1-math.sqrt(Cb**7/(Cb**7+25**7)));a1p=(1+G)*a1;a2p=(1+G)*a2
    C1p=math.hypot(a1p,b1);C2p=math.hypot(a2p,b2)
    h1=math.degrees(math.atan2(b1,a1p))%360;h2=math.degrees(math.atan2(b2,a2p))%360
    dL=L2-L1;dC=C2p-C1p
    dh=0 if C1p*C2p==0 else (h2-h1 if abs(h2-h1)<=180 else h2-h1-360 if h2>h1 else h2-h1+360)
    dH=2*math.sqrt(C1p*C2p)*math.sin(math.radians(dh/2))
    Lb=(L1+L2)/2;Cbp=(C1p+C2p)/2
    hb=(h1+h2)/2 if abs(h1-h2)<=180 else (h1+h2+360)/2 if h1+h2<360 else (h1+h2-360)/2
    if C1p*C2p==0: hb=h1+h2
    T=1-0.17*math.cos(math.radians(hb-30))+0.24*math.cos(math.radians(2*hb))+0.32*math.cos(math.radians(3*hb+6))-0.2*math.cos(math.radians(4*hb-63))
    SL=1+0.015*(Lb-50)**2/math.sqrt(20+(Lb-50)**2);SC=1+0.045*Cbp;SH=1+0.015*Cbp*T
    RT=-2*math.sqrt(Cbp**7/(Cbp**7+25**7))*math.sin(math.radians(60*math.exp(-((hb-275)/25)**2)))
    return math.sqrt((dL/SL)**2+(dC/SC)**2+(dH/SH)**2+RT*(dC/SC)*(dH/SH))
def mix(a,b,t):
    A=h2r(a);B=h2r(b); return '#'+''.join(f'{round((x*(1-t)+y*t)*255):02X}' for x,y in zip(A,B))

BANG=json.load(open(sys.argv[1]))
VAT=['vang','cam_vang','ngoc','ngoc_sang','dong']
for ma,p in BANG.items():
    n=p['nen']; d=p['do']
    r=dict(
      chu_nen=cr(p['chu'],n), chu_the=cr(p['chu_the'],p['the']), do_nen=cr(d,n), do_the=cr(d,p['the']),
      vien_nen=cr(p['vien'],n),
      de_vat_nen=min(de00(p[k],n) for k in VAT), yeu=min(VAT,key=lambda k:de00(p[k],n)), de_do_nen=de00(d,n),
      de_do_vat=min(de00(d,p[k]) for k in VAT), cap_gan=min((de00(p[a],p[b]),a+'/'+b) for i,a in enumerate(VAT) for b in VAT[i+1:]))
    loi=[]
    if r['chu_nen']<7: loi.append('chữ/nền<7')
    if r['chu_the']<7: loi.append('chữ thẻ<7')
    if r['do_nen']<3: loi.append('nhấn/nền<3')
    if r['de_vat_nen']<20: loi.append('vật gần nền')
    if r['de_do_vat']<15: loi.append('nhấn gần vật')
    print(f"{ma:3} {p['ten'][:22]:22} chữ/nền {r['chu_nen']:5.1f} chữ/thẻ {r['chu_the']:5.1f} nhấn/nền {r['do_nen']:4.2f} viền/nền {r['vien_nen']:4.2f} ΔE vật-nền≥{r['de_vat_nen']:4.0f}({r['yeu']}) ΔE nhấn-nền {r['de_do_nen']:4.0f} ΔE nhấn-vật≥{r['de_do_vat']:4.0f} cặp gần {r['cap_gan'][0]:3.0f} {r['cap_gan'][1]:18} {' '.join(loi) or 'ĐẠT'}")
