// N302 EBITDA: helpers, captions, logo and validation from n199; scenes replaced.
(function () {
'use strict';
const K = window.KHO;
const N = (window.N = {});
const stage = document.getElementById('stage');
K.datMau('MAU-21');
const M = {
 nen:'#0B1527',luoi:'#14243C',luoi2:'#1B304C',the:'#102039',chu:'#F4F1EA',chu2:'#B8C6D9',nhan:'#FFD166',phu:'#55D6BE',
 von:'#F4F1EA',kkh:'#55D6BE',ckh:'#FFD166',gtcg:'#EEA465',gtcgChu:'#FFD166',vay:'#B8A4FF',do:'#FF7886',doChu:'#FF7886',
 xanh:'#55D6BE',vang:'#FFD166',lai:'#FFD166',nhat:'#294261',giay:'#102039',giayVach:'#294261',xam:'#9AA9B8'
};
const V = JSON.parse(document.getElementById('du_kien').textContent).gia_tri;
const TG = JSON.parse(document.getElementById('thoi_gian').textContent);
const CH = TG.chuong, DUR = TG.thoi_luong_giay, KT = TG.man_hinh_ket.t;
const C = (c, i) => CH[c - 1].cau[i - 1].t;
const E = (c, i) => CH[c - 1].cau[i - 1].den;
const eo = K.eo3, eio = K.eio, cl = K.cl, lerp = K.lerp, eob = K.eob;
const sv = (tag, a, cha) => K.svg(tag, a, cha);
const hm = (tag, a, cha, chu) => K.html(tag, a, cha, chu);
const KHUNG_MIEN = [];
const DAI = { x: 100, y: 808, w: 1720, h: 84 };   // dải dưới: bộ đếm trái, đồ thị nhỏ phải

// ---------- tiện ích thời gian ----------
const norm = (s) => s.toLowerCase().replace(/[.,:;!?]+$/g, '');
function TU(c, i, tu, nth) {
  const cau = CH[c - 1].cau[i - 1];
  let k = nth || 0;
  const can = tu.toLowerCase().split(' ');
  const ws = cau.tu || [];
  for (let j = 0; j < ws.length; j++) {
    let ok = true;
    for (let q = 0; q < can.length; q++) if (!ws[j + q] || norm(ws[j + q].chu) !== can[q]) { ok = false; break; }
    if (ok && k-- === 0) return ws[j].t;
  }
  return cau.t;
}
const hash = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7 + 0.13) * 43758.5453; return x - Math.floor(x); };

// ---------- cảnh ----------
N.canh = [];
function taoCanh(c) {
  const ch = CH[c - 1];
  const root = hm('div', { class: 'canh', 'data-chuong': c }, stage);
  const cv = hm('canvas', { class: 'lop', width: 1920, height: 1080 }, root);
  const gS = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, root);
  const cv2 = hm('canvas', { class: 'lop', width: 1920, height: 1080 }, root);
  const gH = hm('div', { class: 'lop' }, root);
  const gT = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'pointer-events:none;' }, root);
  const S = { c, root, cv, ctx: cv.getContext('2d'), ctx2: cv2.getContext('2d'), svg: gS, html: gH, top: gT, t0: ch.t, t1: c === CH.length ? KT : ch.den, items: [], ves: [], ve2d: [], ve2dTren: [] };
  S.item = (el, a, b, o) => {
    o = o || {};
    S.items.push({ el, a, b: b == null ? null : b, nobob: !!o.nobob, ph: S.items.length * 1.7, d: o.d == null ? 0.3 : o.d, dy: o.dy == null ? 0 : o.dy,
      svg: el instanceof SVGElement, base: o.base != null ? o.base : (el instanceof SVGElement ? (el.getAttribute('transform') || '') : '') });
    return el;
  };
  N.canh[c] = S;
  return S;
}
function veItem(it, S, t) {
  const b = it.b == null ? S.t1 - 0.05 : it.b;
  const op = K.hienAn(t, it.a, b, it.d) * (it.el.__mo ? it.el.__mo(t) : 1);
  const an = op <= 0.002;
  it.el.style.visibility = an ? 'hidden' : 'visible';
  if (an) return;
  const dy = it.dy * (1 - eo((t - it.a) / 0.45)) + (it.nobob || DO_HINH ? 0 : 3 * Math.sin(6.2832 * t / 3.6 + it.ph));
  if (it.svg) {
    it.el.setAttribute('opacity', op.toFixed(3));
    it.el.setAttribute('transform', `${it.base} translate(0,${dy.toFixed(1)})`.trim());
  } else {
    it.el.style.opacity = op.toFixed(3);
    it.el.style.transform = `translateY(${dy.toFixed(1)}px)`;
  }
}
// độ hiện của một đoạn [a, b) (dùng cho vẽ canvas)
const hien = (t, a, b, d) => (t < a || (b != null && t >= b)) ? 0 : K.hienAn(t, a, b, d == null ? 0.3 : d);
// nhãn "ví dụ giả định" góc trên phải (kho nhan_gia_dinh)
function nhanGD(S, vao, het) {
  const n = K.nhan_gia_dinh({ bien_the: 'goc', chu: 'ví dụ giả định', co: 28, cach_tren: 34, cach_phai: 60, vao, mau: { the: M.the, chu_phu: M.chu, toi: true } });
  S.root.appendChild(n.el);
  const b = het != null ? het : S.t1 - 0.05;
  S.ves.push((t) => { n.seek(t); n.el.style.opacity = K.hienAn(t, vao, b, 0.3).toFixed(3); n.el.style.visibility = t >= vao && t < b ? 'visible' : 'hidden'; });
}

// ---------- chữ ----------
const CHU_DAM = {};  // màu chữ đậm hơn màu hình cho đủ 4,5:1
function dong(S, txt, x, y, w, co, mau, a, b, o) {
  o = o || {};
  if (CHU_DAM[mau]) mau = CHU_DAM[mau];
  if (o.vua) { const r = K.doChu(txt, co, o.dam || 700); if (r > w - 6) co = Math.max(o.coMin || 36, Math.floor(co * (w - 6) / r)); }
  const e = hm('div', { class: 'dong', style: `left:${x}px;top:${y}px;width:${w}px;font-size:${co}px;color:${mau || M.chu};text-align:${o.can || 'left'};font-weight:${o.dam || 700};text-wrap:balance;${o.css || ''}` }, S.html, txt);
  return S.item(e, a, b, Object.assign({ dy: 12 }, o));
}
const giua = (S, txt, cx, y, w, co, mau, a, b, o) => dong(S, txt, cx - w / 2, y, w, co, mau, a, b, Object.assign({ can: 'center', vua: true }, o || {}));
function hop(S, txt, cx, cy, w, h, co, vien, nen, mau, a, b, o) {
  o = o || {};
  const e = hm('div', { class: 'hop', 'data-hop': '1', style: `left:${Math.round(cx - w / 2)}px;top:${Math.round(cy - h / 2)}px;width:${w}px;height:${h}px;font-size:${co}px;line-height:1.15;border:${o.net || 4}px ${o.dut ? 'dashed' : 'solid'} ${vien};background:${nen};color:${mau || M.chu};border-radius:${o.bo == null ? 16 : o.bo}px;white-space:${o.xuong ? 'normal' : 'nowrap'};${o.css || ''}` }, S.html, txt);
  return S.item(e, a, b, Object.assign({ dy: 10 }, o));
}
// tiêu đề cảnh (giữa trên)
const tieuDe = (S, txt, a, b, o) => giua(S, txt, 960, 118, 1300, 60, (o && o.mau) || M.chu, a, b, Object.assign({ dam: 800 }, o || {}));
// số chạy (chữ đổi theo t)
function soChay(S, x, y, w, co, mau, a, b, f, o) {
  const e = dong(S, f(a), x, y, w, co, mau, a, b, Object.assign({ dam: 800, can: 'left' }, o || {}));
  S.ves.push((t) => { const s = f(t); if (e.textContent !== s) e.textContent = s; });
  return e;
}

// ---------- hình phẳng (SVG) ----------
function vat(S, x, y, s, a, b, o) {
  o = o || {};
  const ngoai = sv('g', { transform: `translate(${x},${y}) scale(${s})` }, o.top ? S.top : (o.cha || S.svg));
  const g = sv('g', {}, ngoai);
  if (o.pos) S.ves.push((t) => { const [px, py, ps, r] = o.pos(t); ngoai.setAttribute('transform', `translate(${px.toFixed(1)},${py.toFixed(1)}) scale(${(ps == null ? s : ps).toFixed(3)})${r ? ` rotate(${r.toFixed(2)})` : ''}`); });
  S.item(g, a, b, Object.assign({ nobob: true, d: 0.3, dy: 14 }, o));
  return g;
}
// mũi tên phẳng vẽ dần (lớp trên cùng): pts [[x,y],...]
function mui(S, pts, t0, d, b, o) {
  o = o || {};
  const mau = o.mau || M.chu, w = o.w || 6;
  const g = sv('g', {}, o.duoi ? S.svg : S.top);
  const dd = o.cong ? `M${pts[0].join(' ')} Q${pts[1].join(' ')} ${pts[2].join(' ')}` : 'M' + pts.map((q) => q.join(' ')).join(' L');
  const p = sv('path', { d: dd, fill: 'none', stroke: mau, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': '1 1' }, g);
  const [x1, y1] = pts[pts.length - 1], [x0, y0] = pts[pts.length - 2], ang = Math.atan2(y1 - y0, x1 - x0), L = o.dau || 20;
  const dau = sv('path', { d: `M${x1 - L * Math.cos(ang - 0.5)} ${y1 - L * Math.sin(ang - 0.5)} L${x1} ${y1} L${x1 - L * Math.cos(ang + 0.5)} ${y1 - L * Math.sin(ang + 0.5)}`, fill: 'none', stroke: mau, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  S.ves.push((t) => { const u = eo((t - t0) / d); p.style.strokeDashoffset = (1 - u).toFixed(4); dau.style.opacity = u > 0.92 ? 1 : 0; });
  S.item(g, t0 - 0.01, b, { nobob: true, d: 0.2 });
  return g;
}
// bể chứa (kho binh_chua_muc_nuoc), gốc giữa đáy tại (cx, day)
function be(S, cx, day, o) {
  const W = o.rong || 300, H = o.cao || 420;
  const b = K.binh_chua_muc_nuoc(Object.assign({ kieu: 'phang', rong: W, cao: H, nhan_muc: false, vach_chia: true, khoa_mau: 'nhan_phu', canh_bao_vuot: false }, o));
  const g = vat(S, cx, day, 1, o.a, o.b, { dy: 0 });
  g.appendChild(b.el);
  S.ves.push((t) => b.seek(t));
  const yMuc = (u) => day - u * (H - 16);
  return { b, cx, day, W, H, x0: cx - W / 2, x1: cx + W / 2, top: day - H, mat: (t) => yMuc(b.mucTai(t)), yMuc };
}
// toà ngân hàng (kho toa_nha_ngan_hang), biển trống
function toa(S, x, y, co, loai, a, b, o) {
  const h = K.toa_nha_ngan_hang({ loai: loai || 'tru_so', nhan: '', co, vao: a });
  const g = vat(S, x, y, 1, a, b, Object.assign({ dy: 0 }, o || {}));
  g.appendChild(h.el);
  S.ves.push((t) => h.seek(t));
  return h;
}

// ---------- vẽ hạt (canvas) ----------
function cham(ctx, x, y, r, mau, vien) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fillStyle = mau; ctx.fill();
  if (vien) { ctx.lineWidth = 2; ctx.strokeStyle = vien; ctx.stroke(); }
}
// hạt rơi từ nguồn tới đích theo trọng lực: ts = a + i / nhip; thời gian rơi T = sqrt(2 dy / g); sau khi chạm thì nảy tắt dần rồi nằm yên (giu) hoặc biến mất
function roi(ctx, t, o) {
  const g = o.g || 2400, r = o.r || 9;
  for (let i = 0; i < o.n; i++) {
    const ts = o.a + (o.lich ? o.lich(i) : i / o.nhip);
    if (ts > t) { if (o.lich) continue; else break; }
    const [x0, y0] = o.tu(i), [x1, y1] = o.den(i, ts);
    const T = Math.sqrt(2 * Math.max(8, y1 - y0) / g), u = t - ts;
    let x, y;
    if (u < T) { x = x0 + (x1 - x0) * (u / T); y = y0 + 0.5 * g * u * u; }
    else {
      if (o.tan) continue;
      const v = u - T; x = x1; y = y1 - 16 * Math.exp(-7 * v) * Math.abs(Math.sin(13 * v));
    }
    const m = o.mau(i, t);
    if (m) cham(ctx, x, y, r, m, o.vien);
  }
}
// đường cong nhỏ vẽ dần trong dải dưới: f(u) trong [0,1] → [0,1]; vẽ tới tiến độ p
function doThi(ctx, x, y, w, h, p, f, mau, o) {
  o = o || {};
  if (p <= 0) return;
  ctx.save();
  ctx.lineWidth = o.day || 5; ctx.strokeStyle = mau; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (o.dut) ctx.setLineDash(o.dut);
  ctx.beginPath();
  const n = 120;
  for (let k = 0; k <= n * p; k++) { const u = k / n; const X = x + w * u, Y = y + h - h * f(u); if (k === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y); }
  ctx.stroke();
  const u = p, X = x + w * u, Y = y + h - h * f(u);
  ctx.setLineDash([]);
  cham(ctx, X, Y, 8, mau);
  ctx.restore();
}
// khung đồ thị nhỏ ở dải dưới (trục mảnh)
function khungDoThi(ctx, x, y, w, h, op) {
  ctx.save(); ctx.globalAlpha = op; ctx.strokeStyle = M.phu; ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke(); ctx.restore();
}
function hcn(ctx, x, y, w, h, r, mau, vien, day) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (mau) { ctx.fillStyle = mau; ctx.fill(); }
  if (vien) { ctx.lineWidth = day || 3; ctx.strokeStyle = vien; ctx.stroke(); }
}
// ống dẫn thẳng đứng (vòi) vẽ canvas
function voi(ctx, x, y0, y1, w, mau, op) {
  ctx.save(); ctx.globalAlpha = op;
  hcn(ctx, x - w / 2 - 6, -20, w + 12, y1 + 20, 6, K.rgba(mau, 0.28), mau, 4);
  hcn(ctx, x - w / 2 - 12, y1 - 16, w + 24, 18, 6, mau);
  ctx.restore();
}

// ---------- lớp cố định: bảng lưới, dải dưới ----------
let LOP;
function taoLop() {
  const root = hm('div', { class: 'lop', id: 'bang' }, stage);
  const g = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, root);
  for (let x = 0; x <= 1920; x += 120) sv('line', { x1: x, y1: 0, x2: x, y2: 1080, stroke: x % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': x % 300 === 0 ? 2 : 1.2 }, g);
  for (let y = 0; y <= 1080; y += 120) sv('line', { x1: 0, y1: y, x2: 1920, y2: y, stroke: y % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': y % 300 === 0 ? 2 : 1.2 }, g);
  sv('rect', { x: DAI.x, y: DAI.y, width: DAI.w, height: DAI.h, rx: 14, fill: 'none', stroke: M.nhat, 'stroke-width': 1 }, g);
  const cham = [];
  for (let i = 0; i < CH.length; i++) cham.push(sv('circle', { cx: 1500 + i * 28, cy: DAI.y + DAI.h / 2, r: 7, fill: M.the, stroke: M.phu, 'stroke-width': 3 }, g));
  LOP = { root, cham };
}
function veLop(t, tr) {
  LOP.root.style.transformOrigin = '960px 450px';
  LOP.root.style.transform = tr;
  const op = 1 - eo(cl((t - (KT - 0.35)) / 0.3));
  LOP.root.style.opacity = op.toFixed(3);
  LOP.root.style.visibility = op <= 0.002 ? 'hidden' : 'visible';
  let c = 1; for (let i = 0; i < CH.length; i++) if (t >= CH[i].t - 0.3) c = i + 1;
  LOP.cham.forEach((ch, i) => {
    const nay = i + 1 === c, qua = i + 1 < c;
    ch.setAttribute('fill', nay ? M.nhan : qua ? M.phu : M.the);
    ch.setAttribute('r', nay && !DO_HINH ? (9 + 1.5 * Math.sin(t * 3)).toFixed(2) : 7);
  });
}
// vùng đồ thị nhỏ trong dải dưới
const DT = { x: 620, y: DAI.y + 12, w: 820, h: 60 };


// N302 scenes added chapter by chapter.
// N302 motion: repeated tokens illustrate the same arithmetic, not cumulative new money.
const nfmt = (v,d=0) => v.toLocaleString('vi-VN',{minimumFractionDigits:d,maximumFractionDigits:d});
const active = (t,a,b) => t>=a && t<b;
function flow(ctx,t,a,b,points,color,rate=12,r=11) {
 if(!active(t,a,b))return;
 rate=Math.min(rate,4); // keep tokens visibly separate along paths
 const len=[];let total=0;
 for(let i=1;i<points.length;i++){const l=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);len.push(l);total+=l;}
 ctx.strokeStyle=M.nhat;ctx.lineWidth=3;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
 const dur=3.5;
 for(let j=0;j<Math.ceil(rate*dur);j++){
  const u=((t-a-j/rate)%dur+dur)%dur;if(t-a<j/rate)continue;
  let dist=u/dur*total,k=0;while(k<len.length-1&&dist>len[k]){dist-=len[k];k++;}
  const p=dist/len[k],x=lerp(points[k][0],points[k+1][0],p),y=lerp(points[k][1],points[k+1][1],p);
  cham(ctx,x,y,r,color);
 }
}
function value(S,key,label,cx,y,a,b,color,co=98){
 giua(S,label,cx,y,580,42,color||M.chu,a,b,{nobob:true});
 return giua(S,nfmt(V[key])+' tỷ',cx,y+64,580,co,color||M.chu,a,b,{nobob:true});
}
function gridTokens(ctx,x,y,cols,n,color,t,a,sz=19){
 for(let i=0;i<n;i++){
  const at=a+i*0.025;if(t<at)continue;
  const u=eo((t-at)/0.65),col=i%cols,row=Math.floor(i/cols);
  hcn(ctx,x+col*sz,y+row*sz+(1-u)*70,sz-5,sz-5,4,color);
 }
}
function outlineTank(ctx,x,y,w,h,color){hcn(ctx,x,y,w,h,22,M.the,M.nhat,3);ctx.strokeStyle=color;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x+18,y+h);ctx.lineTo(x+w-18,y+h);ctx.stroke();}
N.canh1=function(S){
 const a=S.t0,b=S.t1;
 nhanGD(S,a);
 value(S,'EBITDA','EBITDA',520,205,a,b,M.phu,112);
 giua(S,'Tiền',1400,205,500,42,M.chu,a,b,{nobob:true});
 giua(S,'?',1400,270,500,112,M.do,a,b,{nobob:true});
 giua(S,'≠',960,432,300,114,M.vang,a,b,{nobob:true});
 const labels=['Sức sinh lời','Sức sinh lời','Tiền thực tế','Tiền thực tế'];
 for(let j=0;j<labels.length;j++){
  const st=a+3+j*(b-a-3)/4,en=j===3?b:a+3+(j+1)*(b-a-3)/4;
  giua(S,labels[j],960,696,600,46,M.vang,st,en,{nobob:true,d:0.14});
 }
 S.ve2d.push((ctx,t)=>{
  outlineTank(ctx,330,410,380,250,M.phu);outlineTank(ctx,1210,410,380,250,M.do);
  gridTokens(ctx,365,450,10,V.EBITDA,M.phu,t,a,30);
  flow(ctx,t,a,b,[[520,580],[800,580],[960,650]],M.vang,12,12);
  flow(ctx,t,a,b,[[1080,580],[1400,580]],M.do,4,10);
 });
};

N.canh2=function(S){
 const a=S.t0,b=S.t1;
 // A balance scale progressively isolates the excluded categories; no numbers until example.
 const names=['Lãi vay','Thuế thu nhập','Khấu hao','Phân bổ'];
 giua(S,'EBITDA',960,180,900,88,M.vang,a,b,{nobob:true});
 for(let j=0;j<4;j++)giua(S,names[j],535+j*280,674,280,34,M.phu,a,b,{nobob:true});
 S.ve2d.push((ctx,t)=>{
  const j=t<C(2,2)?0:t<C(2,3)?2:t<C(2,5)?3:t<C(2,9)?0:1;
  hcn(ctx,370,355,1180,235,28,M.the,M.nhat,3);
  for(let k=0;k<4;k++){
   const xx=420+k*280;
   hcn(ctx,xx,400,230,140,18,k===j?M.phu:M.nhat);
   flow(ctx,t,a,b,[[xx+115,440],[xx+115,330],[960,315]],k===j?M.vang:M.phu,3,11);
  }
  flow(ctx,t,a,b,[[470,620],[1450,620]],M.vang,16,12);
 });
};

N.canh3=function(S){
 const a=S.t0,b=S.t1;nhanGD(S,a);
 const cuts=[a,C(3,5),C(3,6),C(3,7),b];
 for(const [j,key,lab,x] of [[0,'doanh_thu','Doanh thu',430],[1,'chi_phi_chua_DA','Chi phí',960],[2,'EBITDA','EBITDA',1490]]){
  value(S,key,lab,x,210,j===0?a:j===1?C(3,2):C(3,4),cuts[1],j===2?M.phu:j===1?M.do:M.vang,88);
 }
 const phases=[['EBIT','20 − 8 = 12',1],['Lợi nhuận sau thuế','12 − 4 − 2 = 6',2],['EBITDA','6 + 2 + 4 + 8 = 20',3]];
 // Numbers are formatted exclusively from V, not hard-coded display data.
 phases[0][1]=`${V.EBITDA} − ${V.khau_hao_phan_bo} = ${V.EBIT}`;
 phases[1][1]=`${V.EBIT} − ${V.lai_vay} − ${V.thue_thu_nhap} = ${V.loi_nhuan_sau_thue}`;
 phases[2][1]=`${V.loi_nhuan_sau_thue} + ${V.thue_thu_nhap} + ${V.lai_vay} + ${V.khau_hao_phan_bo} = ${V.EBITDA}`;
 for(const [lab,expr,j] of phases){
  giua(S,lab,960,175,1500,54,M.chu,cuts[j],cuts[j+1],{nobob:true});
  giua(S,expr,960,267,1600,90,M.vang,cuts[j],cuts[j+1],{nobob:true});
  giua(S,'tỷ đồng',960,688,600,40,M.chu2,cuts[j],cuts[j+1],{nobob:true});
 }
 S.ve2d.push((ctx,t)=>{
  const j=t<cuts[1]?0:t<cuts[2]?1:t<cuts[3]?2:3;
  if(j===0){
   gridTokens(ctx,270,445,10,V.doanh_thu,M.vang,t,a,30);
   gridTokens(ctx,800,445,10,V.chi_phi_chua_DA,M.do,t,C(3,2),30);
   gridTokens(ctx,1330,445,10,V.EBITDA,M.phu,t,C(3,4),30);
   flow(ctx,t,a,b,[[400,765],[1460,765]],M.phu,4,12);
  }else{
   const nums=j===1?[V.EBITDA,-V.khau_hao_phan_bo]:j===2?[V.EBIT,-V.lai_vay,-V.thue_thu_nhap]:[V.loi_nhuan_sau_thue,V.thue_thu_nhap,V.lai_vay,V.khau_hao_phan_bo];
   const w=1150/nums.length;
   for(let k=0;k<nums.length;k++){
    const x=360+k*w,hh=Math.abs(nums[k])*10;
    hcn(ctx,x,620-hh,w-50,hh,14,nums[k]<0?M.do:k===0?M.phu:M.vang);
    flow(ctx,t,cuts[j],cuts[j+1],[[x+20,645],[x+w-65,645]],nums[k]<0?M.do:M.phu,1.2,11);
   }
  }
 });
};

N.canh4=function(S){
 const a=S.t0,b=S.t1;nhanGD(S,a);
 giua(S,'Biên EBITDA',960,165,1400,60,M.chu,a,b,{nobob:true});
 giua(S,`${V.EBITDA} / ${V.doanh_thu} = ${V.bien_EBITDA}%`,960,255,1450,105,M.vang,a,b,{nobob:true});
 giua(S,'Cùng ngành',960,722,900,42,M.chu2,C(4,8),b,{nobob:true});
 S.ve2d.push((ctx,t)=>{
  const x0=310,y0=445,w=1300,h=195;
  hcn(ctx,x0,y0,w,h,24,M.the,M.nhat,3);
  for(let i=0;i<V.doanh_thu;i++){
   const x=x0+25+(i%20)*63,y=y0+20+Math.floor(i/20)*33;
   hcn(ctx,x,y,44,19,5,i<V.EBITDA?M.phu:M.nhat);
  }
  // Each five-unit group contains one EBITDA unit and four expense units.
  for(let j=0;j<20;j++){
   const u=((t-a)*0.18+j/20)%1;
   const x=310+1300*u,y=668+(j%5)*7;
   cham(ctx,x,y,11,j%5===0?M.phu:M.xam);
  }
 });
};

N.canh5=function(S){
 const a=S.t0,b=S.t1,cut=C(5,4);nhanGD(S,a);
 giua(S,'Nợ ròng / EBITDA',960,160,1450,54,M.chu,a,b,{nobob:true});
 giua(S,`${V.no_rong} / ${V.EBITDA} = ${nfmt(V.no_rong_EBITDA,1)} lần`,960,250,1500,100,M.vang,a,cut,{nobob:true});
 giua(S,`${V.no_rong} / ${V.EBITDA_giam} = ${V.ty_so_sau_giam} lần`,960,250,1500,100,M.do,cut,b,{nobob:true});
 giua(S,`${V.no_vay} − ${V.tien} = ${V.no_rong} tỷ`,960,715,1300,52,M.chu2,a,cut,{nobob:true});
 giua(S,'Không đo thời gian',960,715,1450,42,M.chu2,cut,b,{nobob:true});
 S.ve2d.push((ctx,t)=>{
  const eb=t<cut?V.EBITDA:lerp(V.EBITDA,V.EBITDA_giam,eo((t-cut)/1.4));
  // Debt is grouped in units of EBITDA: two full groups plus half, then five.
  const unitW=eb*21,start=360,base=655;
  for(let i=0;i<V.no_rong;i++){
   const group=Math.floor(i/eb),q=i%eb;
   const x=start+(i%25)*47,yy=base-Math.floor(i/25)*72;
   hcn(ctx,x,yy,34,48,8,M.vang);
  }
  ctx.strokeStyle=M.phu;ctx.lineWidth=5;
  const length=V.no_rong*21,yy=425;
  ctx.beginPath();ctx.moveTo(start,yy);ctx.lineTo(start+length,yy);ctx.stroke();
  for(let x=start;x<=start+length+1;x+=unitW){ctx.beginPath();ctx.moveTo(x,yy-15);ctx.lineTo(x,yy+25);ctx.stroke();}
  flow(ctx,t,a,b,[[360,480],[1410,480]],t<cut?M.phu:M.do,4,13);
 });
};

N.canh6=function(S){
 const a=S.t0,b=S.t1,cut=C(6,5);nhanGD(S,a);
 giua(S,'Định giá giả định',960,165,1400,54,M.chu,a,cut,{nobob:true});
 giua(S,`${V.EBITDA} × ${V.boi_so_gia_dinh} = ${V.EV} tỷ`,960,260,1500,100,M.vang,a,cut,{nobob:true});
 giua(S,'Vốn chủ sở hữu',960,165,1400,54,M.chu,cut,b,{nobob:true});
 giua(S,`${V.EV} − ${V.no_rong} = ${V.von_chu_so_huu} tỷ`,960,260,1500,100,M.phu,cut,b,{nobob:true});
 S.ve2d.push((ctx,t)=>{
  const xx=360,yy=440,w=1180/5;
  for(let j=0;j<V.boi_so_gia_dinh;j++){
   const q=eo((t-a-j*0.5)/1.5),dx=(1-q)*(j%2?-100:100);
   const color=t<cut?M.vang:j<2?M.do:j===2?M.vang:M.phu;
   hcn(ctx,xx+j*w+dx,yy,210,200,20,M.the,M.nhat,3);
   gridTokens(ctx,xx+j*w+24+dx,yy+40,5,V.EBITDA,color,t,a+j*0.5,34);
  }
  if(t>=cut){
   // Split the middle 20 block equally: 50 debt / 50 equity.
   hcn(ctx,360+2*w+24,yy+40,5*34-5,2*34-5,4,M.do);
   hcn(ctx,360+2*w+24,yy+40+2*34,5*34-5,2*34-5,4,M.phu);
  }
  flow(ctx,t,a,b,[[360,700],[1540,700]],t<cut?M.vang:M.phu,4,13);
 });
};

N.canh7=function(S){
 const a=S.t0,b=S.t1;nhanGD(S,a);
 const amounts=[V.EBITDA,-V.thue_thu_nhap,-V.lai_vay,-V.chi_mua_may,-V.tang_VLD_hoat_dong];
 const labels=['EBITDA','Thuế và lãi','Đầu tư','Vốn lưu động','Thiếu hụt'];
 const starts=[a,C(7,3),C(7,4),C(7,5),C(7,6)];
 giua(S,'EBITDA → tiền',960,150,1500,56,M.chu,a,b,{nobob:true});
 const netEl=soChay(S,300,245,1320,100,M.vang,a,b,(t)=>{
  let val=V.EBITDA;
  // Taxes and interest together arrive with sentence 3, equipment with 4, working capital with 5.
  val-=(V.thue_thu_nhap+V.lai_vay)*eo((t-C(7,3))/1.7);
  val-=V.chi_mua_may*eo((t-C(7,4))/1.7);
  val-=V.tang_VLD_hoat_dong*eo((t-C(7,5))/1.7);
  return nfmt(val)+' tỷ';
 },{can:'center',nobob:true});
 S.ves.push(t=>{netEl.style.color=t>C(7,5)+1.3?M.do:M.vang;});
 const groups=[['EBITDA',a,C(7,3)],['Thuế + lãi',C(7,3),C(7,4)],['Đầu tư',C(7,4),C(7,5)],['Vốn lưu động',C(7,5),C(7,7)],['Trước trả gốc',C(7,7),b]];
 for(const [l,x,y] of groups)giua(S,l,960,758,1400,40,M.chu2,x,y,{nobob:true,d:0.14});
 for(let i=0;i<amounts.length;i++){const st=i===0?a:i<3?C(7,3):i===3?C(7,4):C(7,5);giua(S,(amounts[i]>0?'':'−')+nfmt(Math.abs(amounts[i])),395+i*285,699,190,38,i===0?M.phu:M.do,st,b,{nobob:true});}
 S.ve2d.push((ctx,t)=>{
  const zero=650,scale=10,x0=300,step=285;
  ctx.strokeStyle=M.chu2;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(250,zero);ctx.lineTo(1660,zero);ctx.stroke();
  let prev=0;
  for(let i=0;i<amounts.length;i++){
   const start=i===0?a:i<3?C(7,3):i===3?C(7,4):C(7,5);
   const q=eo((t-start)/1.7),val=amounts[i]*q,next=prev+val;
   const xx=x0+i*step,top=zero-Math.max(prev,next)*scale,hh=Math.abs(val)*scale;
   if(q>0){
    hcn(ctx,xx,top,190,Math.max(2,hh),12,i===0?M.phu:M.do);
    flow(ctx,t,start,b,[[xx+95,top+15],[xx+95,Math.min(705,top+hh+35)]],i===0?M.phu:M.do,1.6,10);
   }
   if(i<amounts.length-1){ctx.strokeStyle=M.nhat;ctx.setLineDash([9,8]);ctx.beginPath();ctx.moveTo(xx+190,zero-next*scale);ctx.lineTo(xx+step,zero-next*scale);ctx.stroke();ctx.setLineDash([]);}
   prev=next;
  }
  flow(ctx,t,a,b,[[300,400],[1600,400]],M.vang,4,12);
 });
};

N.canh8=function(S){
 const a=S.t0,b=S.t1;
 giua(S,'EBITDA điều chỉnh',960,165,1400,64,M.vang,a,b,{nobob:true});
 giua(S,'Đối chiếu',960,711,1200,48,M.chu2,a,b,{nobob:true});
 S.ve2d.push((ctx,t)=>{
  // Two reports: original earnings and adjusted bridge; a magnifier follows each adjustment.
  for(const xx of [440,1100]){
   hcn(ctx,xx,335,380,315,20,M.the,M.nhat,3);
   for(let j=0;j<5;j++){
    const yy=385+j*45;
    hcn(ctx,xx+35,yy,180,14,5,M.chu2);
    hcn(ctx,xx+255,yy,85,14,5,j===2?M.vang:M.phu);
   }
  }
  const p=((t-a)/8)%1,cy=380+220*p;
  ctx.strokeStyle=M.vang;ctx.lineWidth=8;ctx.beginPath();ctx.arc(1375,cy,49,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(1410,cy+35);ctx.lineTo(1455,cy+80);ctx.stroke();
  flow(ctx,t,a,b,[[820,495],[1100,495]],M.vang,1.5,13);
  flow(ctx,t,a,b,[[1100,600],[960,660],[820,600]],M.phu,2,12);
 });
};

N.canh9=function(S){
 const a=S.t0,b=S.t1;
 giua(S,'Đọc cùng nhau',960,150,1400,60,M.chu,a,b,{nobob:true});
 const xx=[430,960,1490],labs=['Lợi nhuận','Dòng tiền','Nợ vay'];
 for(let j=0;j<3;j++)giua(S,labs[j],xx[j],659,500,44,[M.vang,M.phu,M.do][j],a,b,{nobob:true});
 const fac=K.nha_xuong({loai:'nha_xuong',nhan:'',khoi:true,kieu:'phang',co:0.65,vao:a});
 const g=vat(S,960,616,1,a,b,{nobob:true,dy:0});g.appendChild(fac.el);S.ves.push(t=>fac.seek(t));
 S.ve2d.push((ctx,t)=>{
  // Profit bars at left, cash reservoir and debt calendar at right.
  for(let j=0;j<3;j++)hcn(ctx,290+j*90,610-(j+1)*64,60,(j+1)*64,9,M.vang);
  hcn(ctx,1360,365,240,245,20,M.the,M.nhat,3);
  for(let row=0;row<3;row++)for(let k=0;k<4;k++)hcn(ctx,1390+k*48,415+row*55,28,28,6,M.do);
  flow(ctx,t,a,b,[[520,515],[740,515]],M.vang,2,13);
  flow(ctx,t,a,b,[[1160,515],[1360,515]],M.phu,2,13);
  flow(ctx,t,a,b,[[520,730],[1360,730]],M.phu,4,12);
 });
};


// ---------- phụ đề, logo, màn hình kết ----------
let phuDe, logo, ket, quet, quetBang;
function taoPhuDe() {
  const chp = CH.map((c) => Object.assign({}, c, { cau: c.cau.slice() }));
  chp[chp.length - 1].cau.pop();   // câu kêu gọi cuối nằm dưới màn hình kết, không có phụ đề
  phuDe = K.phu_de_chay_chu({ chuong: chp, mau: { the: '#001627', chu: '#FFFFFF', nhan: '#7FC4F5' }, day: 1014, co: 38 });
  const hopPD = phuDe.el.querySelector('[data-hop]');
  if (hopPD) { hopPD.style.background = 'rgba(0,22,39,0.92)'; hopPD.style.border = 'none'; hopPD.style.borderRadius = '10px'; }
  stage.appendChild(phuDe.el);
}
function taoLogoKet() {
  logo = K.logo_goc({ kieu: 'phang', vao: 0, ra: 3.6 });
  stage.appendChild(logo.el); logo.el.setAttribute('data-kho-kenh', 'logo');
  const mk = TG.man_hinh_ket;
  ket = K.man_hinh_ket_kenh({ kieu: 'phang', vao: mk.t, dai: mk.den - mk.t });
  stage.appendChild(ket.el); ket.el.setAttribute('data-kho-kenh', 'ket');
  quet = hm('div', { 'data-kho-kenh': 'ket', style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;pointer-events:none;' }, stage);
  quetBang = hm('div', { style: 'position:absolute;top:-100px;left:-400px;width:360px;height:1300px;transform:rotate(18deg);background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.18),rgba(255,255,255,0));' }, quet);
}

// Máy đo hình (scripts/do_chat_luong_hinh.mjs) đặt window.__do_hinh = true trước khi nạp trang: tắt lắc khung hình, nhãn nhấp nhô,
// nền trôi và chấm chương phập phồng, để chỉ đo chuyển động của chính hình. Xuất video không đặt cờ này nên không đổi gì.
const DO_HINH = window.__do_hinh === true;
window.__ho_tro_do_hinh = true;
// ---------- seek ----------
let scaleNow = 1;
function seek(t) {
  t = Math.max(0, Math.min(DUR, t));
  const tr = DO_HINH ? '' : `translate(${(5 * Math.sin(2 * Math.PI * t / 13) + 2 * Math.sin(2 * Math.PI * t / 4.7)).toFixed(2)}px,${(3 * Math.sin(2 * Math.PI * t / 17) + 2 * Math.sin(2 * Math.PI * t / 3.9 + 1.1)).toFixed(2)}px) scale(${(1 + 0.005 * (1 - Math.cos(2 * Math.PI * t / 11))).toFixed(5)})`;
  veLop(t, tr);
  for (let c = 1; c <= CH.length; c++) {
    const S = N.canh[c];
    const a = c === 1 ? -1 : CH[c - 1].t - 0.3, b = c === CH.length ? KT : CH[c].t - 0.3 + 0.001;
    const on = t >= a && t < b;
    S.root.style.display = on ? 'block' : 'none';
    if (on) {
      S.root.style.transformOrigin = '960px 450px'; S.root.style.transform = tr;
      for (const it of S.items) veItem(it, S, t);
      for (const f of S.ves) f(t);
      S.ctx.clearRect(0, 0, 1920, 1080);
      S.ctx2.clearRect(0, 0, 1920, 1080);
      // chuyển chương: cảnh mờ vào 0,3 giây đầu, mờ ra 0,3 giây cuối
      const op = Math.min(cl((t - a) / 0.3), cl((b - t) / 0.3));
      // hạt vẽ trên lớp canvas phía trên hình SVG (bể, toà nhà), dưới lớp chữ HTML
      S.ctx2.save(); S.ctx2.globalAlpha = c === 1 ? 1 : op;
      for (const f of S.ve2d) { S.ctx2.save(); f(S.ctx2, t); S.ctx2.restore(); }
      S.ctx2.restore();
    }
  }
  const vet = document.getElementById('vet');
  if (vet) vet.style.transform = DO_HINH ? '' : `translate(${(60 * Math.sin(2 * Math.PI * t / 9)).toFixed(1)}px,${(40 * Math.sin(2 * Math.PI * t / 7 + 0.8)).toFixed(1)}px)`;
  phuDe.seek(t); logo.seek(t); ket.seek(t);
  phuDe.el.style.visibility = t >= KT - 0.05 ? 'hidden' : 'visible';
  quet.style.display = t >= KT ? 'block' : 'none';
  quetBang.style.transform = `translateX(${(((t - KT) * 130) % 2600).toFixed(1)}px) rotate(18deg)`;
  for (const s of phuDe.el.querySelectorAll('span')) if (s.style.opacity === '0.45') s.style.opacity = '0.85';
}
window.seek = seek;
N.seek = seek;

// ---------- tự kiểm ----------
function doMo(el) {
  let m = 1;
  for (let e = el; e && e !== stage.parentElement; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none') return 0;
    m *= parseFloat(s.opacity || 1);
    if (e instanceof SVGElement && e.getAttribute('opacity') != null) m *= parseFloat(e.getAttribute('opacity'));
  }
  return m;
}
function tiLe(el) {
  if (el instanceof SVGElement && el.getScreenCTM) { const m = el.getScreenCTM(); return m ? Math.hypot(m.a, m.b) / scaleNow : 1; }
  let s = 1;
  for (let e = el; e && e !== stage; e = e.parentElement) {
    const tr = getComputedStyle(e).transform;
    if (tr && tr !== 'none') { const m = new DOMMatrix(tr); s *= Math.hypot(m.a, m.b); }
  }
  return s;
}
function chuNodes() {
  const out = [], w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const chu = n.textContent.trim();
    if (!chu || !n.parentElement) continue;
    if (doMo(n.parentElement) < 0.2) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect();
    if (r.width === 0) continue;
    out.push({ n, chu, r });
  }
  return out;
}
function laTu(el) { return !(el.closest('.kho-phu-de') || el.closest('[data-kho-kenh="ket"]') || el.closest('.kho-nhan-gia-dinh')); }
function demTu() {
  const chu = [];
  for (const { n } of chuNodes()) {
    const el = n.parentElement;
    if (!laTu(el) || el.closest('[data-kho-kenh="logo"]') || doMo(el) < 0.35) continue;
    chu.push(n.textContent.replace(/\s+/g, ' ').trim());
  }
  const tu = chu.join(' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
  return { so: tu.length, chu };
}
function chuMo() {
  const ra = new Map(), w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const chu = n.textContent.trim(), el = n.parentElement;
    if (!chu || !el || !/[\p{L}\p{N}]/u.test(chu) || el.closest('.kho-phu-de') || el.closest('[data-kho-kenh="ket"]')) continue;
    const m = doMo(el);
    if (m > 0.05 && m < 0.9) ra.set(el, chu);
  }
  return ra;
}
window.kiemTra = function (t) {
  seek(t);
  const loi = [];
  for (const l of K.kiemChu(stage, { tl: scaleNow })) if (l.loai !== 'chu_de_chu' && !(l.loai === 'tran_khung' && /^[₫$%?≠]$/.test(l.chu || ''))) loi.push(l);
  const gr = stage.getBoundingClientRect();
  const KHOI = '[data-hop],.dong,.hv,.kho-phu-de';
  const ds = chuNodes().map((x) => {
    const rg = document.createRange(); rg.selectNodeContents(x.n);
    const rs = Array.from(rg.getClientRects()).filter((r) => r.width > 1).map((r) => ({ x: (r.left - gr.left) / scaleNow, y: (r.top - gr.top) / scaleNow, w: r.width / scaleNow, h: r.height / scaleNow }));
    return Object.assign(x, { rs, khoi: x.n.parentElement.closest(KHOI) || x.n.parentElement });
  });
  for (let i = 0; i < ds.length; i++) for (let j = i + 1; j < ds.length; j++) {
    const a = ds[i], b = ds[j];
    if (a.khoi === b.khoi || a.khoi.contains(b.khoi) || b.khoi.contains(a.khoi)) continue;
    let de = false;
    for (const p of a.rs) for (const q of b.rs) {
      const ox = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x);
      const oy = Math.min(p.y + p.h * 0.85, q.y + q.h * 0.85) - Math.max(p.y + p.h * 0.15, q.y + q.h * 0.15);
      if (ox > 4 && oy > 6) de = true;
    }
    if (de) loi.push({ loai: 'chu_de_chu', a: a.chu.slice(0, 40), b: b.chu.slice(0, 40) });
  }
  for (const { n, chu, r } of ds) {
    const el = n.parentElement;
    const co = parseFloat(getComputedStyle(el).fontSize) * tiLe(el);
    if (co < 25.5 && !/^[₫$%≥<?]$/.test(chu) && !(chu === '≈' && el.closest('.kho-nhan-gia-dinh')) && !el.closest('[data-lat]') && !el.closest('[data-kho-kenh]')) loi.push({ loai: 'chu_nho', chu: chu.slice(0, 40), co: +co.toFixed(1) });
    const day = (r.bottom - gr.top) / scaleNow;
    if (!el.closest('.kho-phu-de') && !el.closest('[data-kho-kenh]') && day > 890) loi.push({ loai: 'chu_vao_dai_phu_de', chu: chu.slice(0, 40), day: Math.round(day) });
    const x0 = (r.left - gr.left) / scaleNow, y0 = (r.top - gr.top) / scaleNow;
    if (t < 4 && !el.closest('[data-kho-kenh]') && x0 < 480 && y0 < 100) loi.push({ loai: 'chu_vung_logo', chu: chu.slice(0, 40) });
  }
  const mo = chuMo();
  if (mo.size) {
    seek(t + 0.6);
    const mo2 = chuMo();
    seek(t);
    for (const [el, chu] of mo) if (mo2.has(el)) loi.push({ loai: 'chu_mo_con_lai', chu: chu.slice(0, 40), do_duc: +doMo(el).toFixed(2) });
  }
  const dt = demTu();
  if (dt.so > (KHUNG_MIEN.some(([a, b]) => t >= a && t < b) ? 13 : 12)) loi.push({ loai: 'qua_12_tu', so: dt.so, chu: dt.chu.join(' | ').slice(0, 160) });
  stage.querySelectorAll('.canh > svg.lop > g').forEach((v) => {
    if (doMo(v) < 0.2) return;
    const r = v.getBoundingClientRect();
    if (!r.height) return;
    const day = (r.bottom - gr.top) / scaleNow;
    if (day > 892) loi.push({ loai: 'hinh_vao_dai_phu_de', day: Math.round(day) });
  });
  if (t >= KT) {
    const S = N.canh[CH.length];
    if (S.root.style.display !== 'none' || LOP.root.style.visibility !== 'hidden') loi.push({ loai: 'hinh_con_sau_man_ket' });
  }
  return loi;
};
window.demTu = function (t) { if (t != null) seek(t); return demTu(); };
window.chuHienThi = function (t) {
  seek(t);
  const ds = [];
  for (const { n } of chuNodes()) {
    if (!laTu(n.parentElement)) continue;
    const el = n.parentElement.closest('[data-hop],.dong,.hv') || n.parentElement;
    const s = el.textContent.replace(/\s+/g, ' ').trim();
    if (s && !ds.includes(s)) ds.push(s);
  }
  return ds;
};
window.__khungTrichLuat = () => false;

// ---------- khởi động ----------
function fit() { scaleNow = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `scale(${scaleNow})`; }
const QS = new URLSearchParams(location.search);
const FIXED = window.__DUYET_DONG_BO ? 0 : (QS.has('t') ? parseFloat(QS.get('t')) : null);
let t0 = 0;
function tick() {
  const t = FIXED != null ? FIXED : Math.min((performance.now() - t0) / 1000, DUR);
  seek(t);
  if (FIXED == null && t < DUR) requestAnimationFrame(tick);
}
N.start = async function () {
  await K.napPhong();
  await document.fonts.ready;
  fit(); addEventListener('resize', fit);
  hm('div', { id: 'vet' }, stage);
  taoLop();
  for (let c = 1; c <= CH.length; c++) { const S = taoCanh(c); N['canh' + c](S); }
  taoPhuDe(); taoLogoKet();
  t0 = performance.now();
  window.__san_sang = true;
  seek(FIXED != null ? FIXED : 0);
  if (FIXED == null) requestAnimationFrame(tick);
};
})();
