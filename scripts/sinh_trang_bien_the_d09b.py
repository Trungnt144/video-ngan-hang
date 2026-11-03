# Sinh trang xem trước bộ biến thể D-09b (bảng màu, ảnh 3D, nghe thử nhạc, ma trận) từ phụ lục và bang_mau_goc.json.
# Chạy: python3 scripts/sinh_trang_bien_the_d09b.py san_pham/yyyy.mm.dd.bo_bien_the_d09b_mau_nhac/yyyy.mm.dd.bo_bien_the_d09b_mau_nhac_v<n>.html
import json, base64, re, html, sys
G='/Users/macbooktrungnt/Documents/VideoNganHang/'
exec(open(G+'scripts/kiem_tuong_phan_bang_mau.py').read().split('BANG=json.load')[0])
B=json.load(open(G+'tai_san/so_tay_gu/dung/d09b_bien_the/bang_mau_goc.json'))
md=open(G+'tai_san/so_tay_gu/dung/d09b_bien_the_mau_nhac.md').read()
# bảng màu: tính cách + hợp chủ đề từ phụ lục
tc={}
for l in md.splitlines():
    m=re.match(r'\| (M\d) \|',l)
    if m and l.count('|')==13: c=[x.strip() for x in l.split('|')]; tc[m.group(1)]=(c[11],c[12])
nhac=[]
for l in md.splitlines():
    m=re.match(r'\| (N\d\d|\(gốc\)) \|',l)
    if m: c=[x.strip() for x in l.split('|')]; nhac.append(dict(ma=c[1],ten=c[2],file=c[3].strip('`'),dai=c[4],bpm=c[5],to=c[6],al=c[7],sang=c[8],gc=c[9]))
mt=[]
for l in md.splitlines():
    if re.match(r'\| M\d [^|]',l): c=[x.strip() for x in l.split('|')]; mt.append((c[1],c[2:12]))
mt=mt[-8:]
def img(p): return 'data:image/jpeg;base64,'+base64.b64encode(open(G+'tai_san/so_tay_gu/dung/d09b_bien_the/anh/'+p,'rb').read()).decode()
def md2h(s): return html.escape(s).replace("**","").replace("`","")
O=[]
O.append('''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bộ biến thể D-09b</title><style>
:root{--nen:#f6f5f2;--the:#fff;--chu:#22252a;--phu:#5d636b;--vien:#e2dfd8;--h:#d9f2e3;--hc:#1d6b43;--c:#fdf0cf;--cc:#7a5a06;--k:#fbdcdc;--kc:#9b2226}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:16px/1.55 -apple-system,"Segoe UI",Roboto,sans-serif}
main{max-width:1240px;margin:0 auto;padding:28px 16px 60px}h1{font-size:30px;margin:0 0 6px}h2{font-size:22px;margin:40px 0 12px;padding-top:8px;border-top:1px solid var(--vien)}
p.dan{color:var(--phu);max-width:860px}table{border-collapse:collapse;width:100%;background:var(--the);border-radius:10px;overflow:hidden;font-size:14px}
th,td{padding:8px 10px;border-bottom:1px solid var(--vien);text-align:left;vertical-align:top}th{background:#efece6;font-weight:600}
.cuon{overflow-x:auto}.luoi{display:grid;grid-template-columns:repeat(auto-fill,minmax(560px,1fr));gap:18px}
.bm{background:var(--the);border:1px solid var(--vien);border-radius:12px;padding:16px}.bm h3{margin:0 0 2px;font-size:18px}.bm .tc{color:var(--phu);font-size:14px;margin:0 0 10px}
.o{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}.o div{flex:1 1 60px;min-width:60px;border-radius:6px;border:1px solid rgba(0,0,0,.12);height:46px;position:relative}
.o span{position:absolute;bottom:-17px;left:0;font-size:11px;color:var(--phu);white-space:nowrap}.o{padding-bottom:16px}
.so{font-size:13px;color:var(--phu);margin:6px 0 10px}.so b{color:var(--chu)}.ba{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.ba img{width:100%;border-radius:6px;display:block;cursor:zoom-in}
.mt td,.mt th{text-align:center;font-weight:600;white-space:nowrap}.mt td:first-child,.mt th:first-child{text-align:left}
.H{background:var(--h);color:var(--hc)}.C{background:var(--c);color:var(--cc)}.K{background:var(--k);color:var(--kc)}
audio{width:230px;height:34px}.tt{font-size:12px;color:var(--phu);max-width:260px}.tt.loi{color:var(--kc);font-weight:600}.toi{display:inline-block;font-size:11px;padding:1px 7px;border-radius:9px;background:#22252a;color:#fff;margin-left:6px;vertical-align:2px}
#phong{position:fixed;inset:0;background:rgba(0,0,0,.85);display:none;align-items:center;justify-content:center;z-index:9}#phong img{max-width:96vw;max-height:92vh}
@media(max-width:640px){.luoi{grid-template-columns:1fr}h1{font-size:24px}}
</style></head><body><main>
<h1>Bộ biến thể D-09b: 8 bảng màu × 10 bài nhạc</h1>
<p class="dan">Lập ngày 26/10/2026. Mọi tổ hợp giữ nguyên cách dựng của thẻ D-09b (mức chi tiết kỹ thuật, vỏ xuyên thấu, giọng 1,2 lần); chỉ đổi màu và nhạc. Gọi một tổ hợp là "D-09b · M3 · N09". Không nói mã nào thì vẫn là bảng gốc M0 với "Close Up". Ảnh là khung hình kết xuất thật từ mã video máy biến áp, bấm vào ảnh để phóng to. Nút nghe thử chạy được khi mở trang từ thư mục <code>san_pham/</code> trên máy.</p>
<h2>Biên bản quyết định</h2><div class="cuon"><table><tr><th>Nội dung đã chốt</th><th>Khác đề xuất ban đầu</th><th>Ảnh hưởng</th></tr>''')
for l in md.split('## Trung chốt ngày 26/10/2026')[1].split('## Cách dùng')[0].splitlines():
    if l.startswith('| ') and not l.startswith('| Nội dung') : c=[x.strip() for x in l.split('|')][1:4]; O.append('<tr>'+''.join(f'<td>{md2h(x)}</td>' for x in c)+'</tr>')
O.append('</table></div>')
O.append('<h2>9 bảng màu (M0 gốc + 8 bảng mới)</h2><p class="dan">Ngưỡng kiểm: chữ/nền ≥ 7:1; màu nhấn (bộ phận đang nói, nhãn, gạch phụ đề)/nền ≥ 3:1. Bảng gốc M0 chỉ đạt 2,5:1 ở màu nhấn; tám bảng mới đều đạt. Ba ảnh mỗi bảng: vỏ xuyên thấu · cuộn dây trọng tâm tô màu nhấn · thẻ số liệu và phụ đề.</p><div class="luoi">')
ten_o=[('nen','nền'),('vang','ấm chính'),('cam_vang','ấm phụ'),('ngoc','lạnh'),('ngoc_sang','lạnh nhạt'),('dong','kim loại màu'),('do','nhấn'),('chu','chữ')]
for ma,p in B.items():
    t=tc.get(ma,('',''))
    O.append(f'<div class="bm"><h3>{ma} · {html.escape(p["ten"])}{"<span class=toi>nền tối</span>" if p["toi"] else ""}</h3><p class="tc">{md2h(t[0])}{" · Hợp: "+md2h(t[1]) if t[1] and ma!="M0" else ""}</p><div class="o">')
    for k,n in ten_o: O.append(f'<div style="background:{p[k]}" title="{n} {p[k]}"><span>{n} {p[k]}</span></div>')
    O.append(f'</div><div class="so">Chữ/nền <b>{cr(p["chu"],p["nen"]):.1f}:1</b> · Nhấn/nền <b>{cr(p["do"],p["nen"]):.1f}:1</b> · Nhấn khác màu bộ phận gần nhất <b>{min(de00(p["do"],p[k]) for k in ["vang","cam_vang","ngoc","ngoc_sang","dong"]):.0f}</b> đơn vị</div><div class="ba">')
    for k in (900,1260,1850): O.append(f'<img loading="lazy" src="{img(f"{ma}_k{k}.jpeg")}" alt="{ma} khung {k}">')
    O.append('</div></div>')
O.append('</div><h2>10 bài nhạc (cùng nhóm "Close Up")</h2><p class="dan">Nguồn Mixkit, giấy phép Mixkit Stock Music Free License: dùng được cho YouTube, mạng xã hội, quảng cáo trực tuyến; không dùng cho truyền hình, đĩa, trò chơi. "Âm lượng" là mức đặt trong Remotion để bài nghe to ngang "Close Up" ở 0,16. Nhịp là ước tính bằng máy.</p><p class="dan">Nghe thử: bấm nút ▶ trên từng dòng; bấm bài khác thì bài đang phát tự dừng. N01 và N05 bắt đầu phát từ giây 8 và giây 12 để bỏ đoạn mở đầu rất nhỏ. Dòng chữ dưới nút cho biết bài đang phát hay không mở được file. Không có tiếng mà dòng chữ báo "đang phát" thì kiểm tra loa máy và tab Chrome có bị tắt tiếng không.</p><div class="cuon"><table><tr><th>Mã</th><th>Bài, tác giả</th><th>Nghe thử</th><th>Dài</th><th>Nhịp ước</th><th>Âm lượng</th><th>Tính chất, lưu ý</th></tr>')
for n in nhac: n['bd']={'mixkit-curiosity-480.mp3':'#t=12','mixkit-motivating-mornings-33.mp3':'#t=8'}.get(n['file'],''); n['gc2']=md2h(re.sub(r'`[^`]*`','',n['gc'])); O.append(f'<tr><td><b>{html.escape(n["ma"])}</b></td><td>{html.escape(n["ten"])}</td><td><audio controls preload="metadata" data-file="{n["file"]}" src="../tai_san/nhac_nen/{n["file"]}{n["bd"]}"></audio><div class="tt"></div></td><td>{n["dai"]}</td><td>{n["bpm"]}</td><td>{n["al"]}</td><td>{n["gc2"]}</td></tr>')
O.append('</table></div><h2>Ma trận 8 × 10</h2><p class="dan"><span class="H" style="padding:1px 6px;border-radius:4px">H</span> hợp · <span class="C" style="padding:1px 6px;border-radius:4px">C</span> cân nhắc · <span class="K" style="padding:1px 6px;border-radius:4px">K</span> không nên · ★ đề xuất đầu tiên. Tổng 52 H, 22 C, 6 K. Chấm theo tính cách bảng màu và số đo nhạc, chưa nghe bằng tai: Trung nghe thử rồi sửa ô sai.</p><div class="cuon"><table class="mt"><tr><th>Bảng \\ Nhạc</th>'+''.join(f'<th>N{i:02d}</th>' for i in range(1,11))+'</tr>')
for ten,cells in mt: O.append(f'<tr><td>{html.escape(ten)}</td>'+''.join(f'<td class="{c[0]}">{html.escape(c)}</td>' for c in cells)+'</tr>')
O.append('</table></div>')
ly=md.split('Lý do các ô C và K:')[1].split('## Cách đề xuất')[0].strip().splitlines()
bo=lambda x: md2h(re.sub(r"^\d+\. ","",x))
O.append('<p class="dan"><b>Lý do các ô C và K</b></p><ol>'+''.join('<li>'+bo(x)+'</li>' for x in ly if x.strip())+'</ol>')
O.append('''<h2>Lưu ý trước khi dùng</h2><ol>
<li>Video máy biến áp chỉ dùng vài ô màu (thép xám, đồng, gông, nhấn), nên màu ấm chính của M2 (xanh lá) và M7 (chanh) gần như không lộ trong ảnh; hai màu này chỉ thấy rõ ở video nhiều bộ phận màu như bánh răng, cánh quạt.</li>
<li>Ba bảng nền tối M6–M8 là ngoại lệ so với luật "không nền tối" của D-09b; chỉ dùng khi Trung chọn rõ mã.</li>
<li>N02 Your Breath có đoạn gần lặng (chênh độ to 28 dB giữa các khúc), phải chọn đoạn; N05 Curiosity bỏ 12 giây đầu.</li>
<li>Mã dựng: chép <code>xuong_dai/bang_mau_d09b/src/BangMau.ts</code>, chọn bảng bằng <code>--props='{"bang":"M6"}'</code>; không viết mã màu cứng trong mã cảnh.</li></ol>
<div id="phong" onclick="this.style.display='none'"><img alt=""></div>
<script>
const GOC='file:///Users/macbooktrungnt/Documents/VideoNganHang/tai_san/nhac_nen/';
document.querySelectorAll('audio').forEach(a=>{const tt=a.nextElementSibling;let thuGoc=false;
 a.addEventListener('loadedmetadata',()=>{tt.className='tt';tt.textContent='Sẵn sàng, dài '+Math.floor(a.duration/60)+':'+String(Math.round(a.duration%60)).padStart(2,'0')});
 a.addEventListener('play',()=>{document.querySelectorAll('audio').forEach(b=>{if(b!==a)b.pause()});tt.className='tt';tt.textContent='Đang phát'});
 a.addEventListener('pause',()=>{if(tt.textContent==='Đang phát')tt.textContent='Đã dừng'});
 a.addEventListener('error',()=>{const t=(a.src.split('#')[1]||'');if(!thuGoc&&location.protocol==='file:'){thuGoc=true;a.src=GOC+a.dataset.file+(t?'#'+t:'');return}
  tt.className='tt loi';tt.textContent='Không mở được file '+a.dataset.file+'. Trang phải mở từ thư mục san_pham/ trên máy Mac (lệnh open), không mở trong app Claude hay trên điện thoại. Hoặc nghe thẳng file trong tai_san/nhac_nen/.'})});
document.querySelectorAll('.ba img').forEach(i=>i.onclick=()=>{const p=document.getElementById('phong');p.querySelector('img').src=i.src;p.style.display='flex'})</script>
</main></body></html>''')
open(sys.argv[1],'w').write('\n'.join(O)); print('ok')
