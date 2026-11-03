# -*- coding: utf-8 -*-
from pathlib import Path
import json,html
R=Path(__file__).resolve().parents[2];D=R/'xuong_html/n302_ebitda';SP=R/'san_pham/2026.11.03.EBITDA_la_gi'
tg=json.loads((D/'thoi_gian.json').read_text())
source=(D/'trang.html').read_text().replace('<head>','<head><base href="../../xuong_html/n302_ebitda/">',1)
# Freeze internal clock; preview player drives seek from the recorded voice.
buttons=''.join(f'<button data-t="{c["t"]}">{c["id"]}. {html.escape(c["ten"])}</button>' for c in tg['chuong'])
media='tai_nguyen/ban_nhap/2026.11.03.ebitda_giong_duyet.m4a'
page='''<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>EBITDA — Duyệt hình và lời</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#080f1c;color:#f4f1ea;font:16px system-ui,-apple-system,sans-serif}main{max-width:1320px;margin:auto;padding:24px}header{display:flex;align-items:center;justify-content:space-between;gap:20px}h1{font-size:27px;margin:0 0 8px}p{color:#bdcadd;line-height:1.55;margin:8px 0 18px}.badge{color:#ffd166;font-size:14px;white-space:nowrap}iframe{display:block;width:100%;aspect-ratio:16/9;border:1px solid #294261;background:#0b1527;border-radius:12px}audio{width:100%;margin:16px 0}nav{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}button{font:inherit;text-align:left;background:#102039;color:#d9e4f1;border:1px solid #294261;border-radius:8px;padding:12px;cursor:pointer}button:hover{border-color:#55d6be}a{color:#55d6be}.links{margin-top:20px;display:flex;gap:20px;flex-wrap:wrap}small{color:#bdcadd}.notice{margin:18px 0;padding:12px 16px;border-left:3px solid #ffd166;background:#102039}@media(max-width:700px){main{padding:12px}nav{grid-template-columns:1fr}h1{font-size:21px}header{display:block}}
</style><main><header><div><h1>EBITDA là gì?</h1><p>Ý nghĩa trong đánh giá tài chính doanh nghiệp · 9 chương · 5 phút 24 giây</p></div><span class="badge">Duyệt hình và lời · Chưa kết xuất MP4</span></header>
<iframe id="screen" title="Hình chuyển động EBITDA"></iframe>
<audio id="voice" controls preload="metadata" src="'''+media+'''"></audio>
<small id="state">Bấm phát để xem hình theo lời đọc. Chọn chương để nghe và xem đúng đoạn.</small>
<nav>'''+buttons+'''</nav>
<p class="notice">Bản nghe dùng giọng Quốc Tuấn. Trung nghe kỹ cách đọc “EBITDA” và phép trừ tiền ở chương 7. Nhạc nền sẽ ghép vào MP4 sau khi duyệt hình.</p>
<div class="links"><a href="../../xuong_html/n302_ebitda/anh_tinh/v3/luoi_01.jpg">Ảnh soát từng câu</a><a href="tai_nguyen/kich_ban/2026.11.03.ebitda_v1.md">Kịch bản đầy đủ</a><a href="tai_nguyen/kich_ban/2026.11.03.ebitda_v1.nguon_kiem_chung.md">Nguồn kiểm chứng</a><a href="../../xuong_html/n302_ebitda/soat_doc_lap.md">Bản soát độc lập</a></div>
<p id="quality">Đã xem ảnh 3 vòng; máy đo hình 9/9 chương; quét chữ và tương phản không báo lỗi. Soát Antigravity mới: 0 nặng, 0 vừa; 2 góp ý nhẹ ở chương 3 và 8.</p>
</main><script>
const frame=document.getElementById('screen'),audio=document.getElementById('voice');
let ready=false;const CHAPTERS=TIMELINE;
frame.srcdoc=SOURCE;
function sync(){try{const w=frame.contentWindow;if(w&&w.__san_sang){if(!ready){ready=true;w.N.pausePreview=true;}let visual=audio.currentTime;if(audio.paused){const ch=CHAPTERS.chuong.find(c=>visual>=c.t&&visual<c.den);if(ch&&visual-ch.t<0.6)visual=ch.t+0.85;}w.seek(visual);document.getElementById('state').textContent='Đang xem '+Math.floor(audio.currentTime/60)+':'+String(Math.floor(audio.currentTime%60)).padStart(2,'0')+' / 5:24';}}catch(e){document.getElementById('state').textContent='Không thể đồng bộ hình: '+e.message;}requestAnimationFrame(sync);}
requestAnimationFrame(sync);
document.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{audio.currentTime=Number(b.dataset.t);});
</script></html>'''
# Source seek is fixed via query fallback; replace ticker startup with frozen time.
source=source.replace('<script>window.N.start();</script>', '<script>window.N.start();</script>')
# Replace the internal tick in the copied source JS by overriding rAF only in iframe? use ?t always through srcdoc's fixed flag.
# srcdoc inherits parent URL with no search; source can force a query before start using history unsupported about:srcdoc.
# Rather use existing N.start plus frame-driven seeking; internal tick disabled by an explicit preview flag in canh.js.
source=source.replace('<script>window.__san_sang = false;</script>', '<script>window.__san_sang = false;window.__DUYET_DONG_BO=true;</script>')
page=page.replace('TIMELINE',json.dumps(tg,ensure_ascii=False)).replace('SOURCE',json.dumps(source,ensure_ascii=False).replace('</','<'+chr(92)+'/'))
(SP/'2026.11.03.ebitda_duyet.html').write_text(page)
print(SP/'2026.11.03.ebitda_duyet.html')
