// canh.js — N199 Hoạt động huy động vốn của ngân hàng là gì: mười một cảnh trên một bảng kẻ lưới toàn khung, mỗi đồng là một hạt.
// KB-02 · CL-14 mô phỏng và bề mặt toán · CT1 · BC-06 đồ thị và bảng số toàn khung · MAU-58 (chỉ lấy màu, không tên, không logo) · NH09.
// Khung chung (chữ, hộp, vật, mũi tên, phụ đề, logo, màn hình kết, seek, kiemTra, demTu, chuHienThi) chép từ xuong_html/n198_hoat_dong_cho_vay/canh.js,
// đổi sang nền sáng MAU-58 và bố cục bảng BC-06 (lưới toàn khung, vùng mô phỏng y 110–800, dải dưới y 808–892 có bộ đếm và đồ thị nhỏ).
// Mô phỏng hạt: mỗi hạt có giây sinh, điểm xuất phát, điểm đến; vị trí tính theo trọng lực mỗi khung (hàm thuần của t, không lưu trạng thái giữa các khung).
// Bể chứa dùng kho binh_chua_muc_nuoc (thân bể, vạch chia, mực chất lỏng); hạt chạm mặt chất lỏng tính từ mucTai(t) của bể.
// Mọi số trên hình khớp du_kien.json; ví dụ 100 đồng có nhãn "ví dụ giả định". Chữ của khung đã qua ẩn hẳn (visibility hidden), không để mờ.
(function () {
'use strict';
const K = window.KHO;
const N = (window.N = {});
const stage = document.getElementById('stage');
K.datMau('MAU-58');
const M = {
  nen: '#F0F6FA', luoi: '#DCE8F2', luoi2: '#C7DDEE', the: '#FFFFFF', chu: '#001627', chu2: '#3E5A75', nhan: '#0165B3', phu: '#6290B5',
  von: '#001627', kkh: '#6290B5', ckh: '#0165B3', gtcg: '#C9762B', gtcgChu: '#8F4E12', vay: '#7A5BA6', do: '#C0392B', doChu: '#B03A2A',
  xanh: '#2E8B57', vang: '#D9912B', lai: '#D9912B', nhat: '#C7DDEE', giay: '#FFFFFF', giayVach: '#C7D3DE', xam: '#9AA9B8',
};
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
  const dy = it.dy * (1 - eo((t - it.a) / 0.45)) + (it.nobob ? 0 : 3 * Math.sin(6.2832 * t / 3.6 + it.ph));
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
  const n = K.nhan_gia_dinh({ bien_the: 'goc', chu: 'ví dụ giả định', co: 28, cach_tren: 34, cach_phai: 60, vao, mau: { the: M.the, chu_phu: M.chu, toi: false } });
  S.root.appendChild(n.el);
  const b = het != null ? het : S.t1 - 0.05;
  S.ves.push((t) => { n.seek(t); n.el.style.opacity = K.hienAn(t, vao, b, 0.3).toFixed(3); n.el.style.visibility = t >= vao && t < b ? 'visible' : 'hidden'; });
}

// ---------- chữ ----------
const CHU_DAM = { '#6290B5': '#3C6A90', '#2E8B57': '#1E6B40', '#0165B3': '#015A9E', '#C9762B': '#8F4E12' };  // màu chữ đậm hơn màu hình cho đủ 4,5:1
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
  for (let x = 0; x <= 1920; x += 60) sv('line', { x1: x, y1: 0, x2: x, y2: 1080, stroke: x % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': x % 300 === 0 ? 2 : 1.2 }, g);
  for (let y = 0; y <= 1080; y += 60) sv('line', { x1: 0, y1: y, x2: 1920, y2: y, stroke: y % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': y % 300 === 0 ? 2 : 1.2 }, g);
  sv('rect', { x: DAI.x, y: DAI.y, width: DAI.w, height: DAI.h, rx: 14, fill: M.the, stroke: M.nhat, 'stroke-width': 3 }, g);
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
    ch.setAttribute('r', nay ? (9 + 1.5 * Math.sin(t * 3)).toFixed(2) : 7);
  });
}
// vùng đồ thị nhỏ trong dải dưới
const DT = { x: 620, y: DAI.y + 12, w: 820, h: 60 };

// ======================= Chương 1 · Một trăm đồng của ngân hàng =======================
N.canh1 = function (S) {
  const c = 1;
  const a0 = C(c, 1) + 0.2, nhip = 100 / Math.max(4, C(c, 2) + 1.2 - a0);
  const B = be(S, 960, 760, { rong: 340, cao: 500, a: 0.3, muc_dau: 0, muc: 0.9, dai_vao: 100 / nhip + 0.6, vao: a0 + 0.35 });
  const XV = 960, YV = 150;
  nhanGD(S, C(c, 1) + 0.3, C(c, 4) - 0.05);
  // 100 hạt rơi từ vòi xuống mặt chất lỏng
  S.ve2d.push((ctx, t) => {
    const op = hien(t, 0.2, S.t1 - 0.05);
    voi(ctx, XV, 60, YV, 46, M.nhan, op);
    roi(ctx, t, { n: 100, a: a0, nhip, tu: (i) => [XV + (hash(i, 1) - 0.5) * 30, YV], den: (i, ts) => [XV + (hash(i, 2) - 0.5) * 220, B.mat(ts + 0.45) - 4], tan: true, r: 10, mau: (i) => i < 10 ? M.von : M.nhan });
    // câu 2: lớp đáy 10% xanh đậm (vốn chủ)
    const p = hien(t, C(c, 2) - 0.1, C(c, 3) + 0.2);
    if (p > 0) {
      ctx.save(); ctx.globalAlpha = 0.85 * p; hcn(ctx, B.x0 + 6, B.yMuc(0.1), B.W - 12, B.day - B.yMuc(0.1) - 6, 18, M.von); ctx.restore();
      ctx.save(); ctx.globalAlpha = p; ctx.setLineDash([10, 8]); ctx.strokeStyle = M.the; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(B.x0 + 6, B.yMuc(0.1)); ctx.lineTo(B.x1 - 6, B.yMuc(0.1)); ctx.stroke(); ctx.restore();
    }
    // câu 3: hạt đi ra theo vòng cung về bên phải, kèm hạt lãi
    const a3 = C(c, 3) + 0.6;
    if (t > a3 && t < C(c, 4) + 0.5) {
      for (let i = 0; i < 26; i++) {
        const ts = a3 + i * 0.12; if (t < ts) break;
        const u = cl((t - ts) / 1.6);
        const x = lerp(B.x1 - 30, 1840, u), y = B.top + 40 - 200 * Math.sin(Math.PI * u);
        cham(ctx, x, y, i % 4 === 3 ? 7 : 10, i % 4 === 3 ? M.lai : M.nhan);
      }
    }
    // câu 4: ba mũi tên nét đứt từ ngoài khung chỉ vào bể (tiền đến từ đâu)
    const o4 = hien(t, C(c, 4) + 0.2, S.t1 - 0.05);
    if (o4 > 0) {
      ctx.save(); ctx.globalAlpha = o4; ctx.strokeStyle = M.phu; ctx.lineWidth = 6; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 40;
      [[200, 300], [240, 720], [1020, 820]].forEach(([x, y], i) => {
        const g = eo(cl((t - C(c, 4) - 0.2 - i * 0.3) / 0.8));
        const tx = i === 2 ? B.x1 + 30 : B.x0 - 30, ty = i === 2 ? B.day - 160 : B.top + 120 + i * 220;
        const ex = lerp(x, tx, g), ey = lerp(y, ty, g);
        ctx.beginPath(); ctx.moveTo(i === 2 ? 1500 : x, i === 2 ? 760 : y); ctx.lineTo(i === 2 ? lerp(1500, tx, g) : ex, i === 2 ? lerp(760, ty, g) : ey); ctx.stroke();
      });
      ctx.restore();
    }
    // dải dưới: mực theo thời gian
    khungDoThi(ctx, DT.x, DT.y, DT.w, DT.h, op);
    const pp = cl((t - a0) / (C(c, 4) + 2 - a0));
    doThi(ctx, DT.x, DT.y, DT.w, DT.h, pp, (u) => cl(u * (C(c, 4) + 2 - a0) * nhip / 100), M.nhan);
  });
  giua(S, '100 đồng nguồn vốn', 1440, 300, 700, 60, M.nhan, C(c, 1) + 0.6, C(c, 2) - 0.1, { dam: 800 });
  soChay(S, 140, DAI.y + 14, 420, 48, M.chu, a0, null, (t) => {
    let n = 0; for (let i = 0; i < 100; i++) { const ts = a0 + i / nhip; if (ts + 0.45 <= t) n++; }
    return n + ' đồng';
  });
  dong(S, '10 · của chủ', B.x1 + 40, B.yMuc(0.05) - 40, 520, 50, M.von, C(c, 2) + 0.2, C(c, 3), { dam: 800 });
  dong(S, '90 · nhận từ người khác', B.x1 + 40, B.yMuc(0.55) - 40, 640, 50, M.nhan, C(c, 3) - 0.05, C(c, 4), { dam: 800, css: 'white-space:nowrap;' });
  dong(S, 'trả lại: gốc + lãi', 1360, 640, 520, 54, M.chu, TU(c, 3, 'trả') - 0.1, C(c, 4), { dam: 800 });
  giua(S, 'huy động vốn?', 1440, 360, 700, 72, M.nhan, C(c, 4) + 0.3, null, { dam: 800 });
};

// ======================= Chương 2 · Huy động vốn là gì =======================
N.canh2 = function (S) {
  const c = 2;
  const a = C(c, 1) - 0.2, b2 = C(c, 3) + 0.1;
  const kh = K.khuon_trung_gian_ba_khoi({ kieu: 'toi_gian', ben_gui: { ten: 'Người gửi' }, ngan_hang: { loai: 'tru_so' }, goc: { so: '100', moc_vao: TU(c, 1, 'nhận') }, lai_gui: { so: '100 + 5', moc: TU(c, 2, 'gốc') - 0.3 }, y: 430, vao: a });
  nhanGD(S, C(c, 1));
  const wrap = hm('div', { class: 'lop' }, S.html);
  wrap.appendChild(kh.el);
  S.item(wrap, a, b2, { nobob: true });
  S.ves.push((t) => kh.seek(t));
  dong(S, 'Luật 32/2024 · Điều 4 khoản 27', DAI.x + 40, DAI.y + 18, 760, 42, M.chu2, C(c, 2), b2, { dam: 700 });
  // câu 3–5: hai cột hạt trên trục 0–100
  const X0 = 520, Y0 = 690, HC = 500;       // gốc trục, cao ứng với 100
  const cot = [{ x: 700, n: 10, mau: M.von, a: TU(c, 4, 'vốn') }, { x: 1250, n: 90, mau: M.nhan, a: TU(c, 5, 'vốn') }];
  const cols = 10, r = 11, step = 25;
  const slot = (k, i) => [cot[k].x - (cols - 1) * step / 2 + (i % cols) * step, Y0 - 14 - Math.floor(i / cols) * step * (HC / 100 / (step / cols)) / (HC / 100 / (step / cols))];
  S.ve2d.push((ctx, t) => {
    const op = hien(t, C(c, 3) - 0.1, S.t1 - 0.05);
    if (op <= 0) return;
    ctx.save(); ctx.globalAlpha = op;
    ctx.strokeStyle = M.chu; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(X0, Y0 - HC - 20); ctx.lineTo(X0, Y0); ctx.lineTo(1540, Y0); ctx.stroke();
    for (let v = 0; v <= 100; v += 25) { const y = Y0 - HC * v / 100; ctx.strokeStyle = M.luoi2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, y); ctx.lineTo(1540, y); ctx.stroke(); }
    ctx.restore();
    // dải dưới: thanh 100 đồng chia hai đoạn 10 | 90
    const g10 = eo(cl((t - cot[0].a) / 0.8)), g90 = eo(cl((t - cot[1].a) / 1.2));
    hcn(ctx, DT.x, DT.y + 10, DT.w * 0.1 * g10, 40, 8, M.von);
    hcn(ctx, DT.x + DT.w * 0.1 + 4, DT.y + 10, (DT.w * 0.9 - 4) * g90, 40, 8, M.nhan);
    cot.forEach((k, kk) => {
      const nhipK = k.n / 1.6;
      roi(ctx, t, { n: k.n, a: k.a, nhip: nhipK, tu: (i) => [k.x + (hash(i, 3 + kk) - 0.5) * 60, 150], den: (i) => { const col = i % cols, row = Math.floor(i / cols); return [k.x - (cols - 1) * step / 2 + col * step, Y0 - 14 - row * step]; }, r, mau: () => k.mau });
    });
  });
  const op3 = C(c, 3) + 0.2;
  dong(S, '10', 640, Y0 - 14 - 25 - 90, 120, 52, M.von, TU(c, 4, 'vốn') + 0.8, null, { can: 'center', dam: 800 });
  dong(S, '90', 1190, Y0 - 14 - 9 * 25 - 90, 120, 52, M.nhan, TU(c, 5, 'vốn') + 1.2, null, { can: 'center', dam: 800 });
  giua(S, 'vốn chủ sở hữu', 700, Y0 + 16, 360, 40, M.von, TU(c, 4, 'vốn'), null, { dam: 800 });
  giua(S, 'vốn huy động · nợ phải trả', 1250, Y0 + 16, 560, 40, M.nhan, TU(c, 5, 'vốn'), null, { dam: 800 });
  tieuDe(S, 'nguồn vốn = 2 phần', op3, C(c, 4) - 0.05);
};

// ======================= Chương 3 · Nguồn thứ nhất: tiền gửi =======================
N.canh3 = function (S) {
  const c = 3;
  const L = { x: 260, y: 250, w: 600, h: 440 }, R = { x: 1060, y: 250, w: 600, h: 440 };
  const aL = C(c, 2) - 0.1, aR = C(c, 3) - 0.1, P = 6.0;
  tieuDe(S, 'tiền gửi · nguồn lớn nhất', C(c, 1) + 0.1, C(c, 2) - 0.05, { mau: M.nhan });
  S.ve2d.push((ctx, t) => {
    const o1 = hien(t, S.t0 - 0.3, aL + 0.3);
    if (o1 > 0) {
      ctx.save(); ctx.globalAlpha = o1;
      for (let i = 0; i < 60; i++) {
        const g = eio(cl((t - S.t0 + 0.2 - hash(i, 8) * 1.2) / 1.4));
        const x = lerp(960 + (hash(i, 1) - 0.5) * 1500, 960 + (hash(i, 2) - 0.5) * 520, g) + 12 * Math.sin(t * 1.3 + i);
        const y = lerp(900, 470 + (hash(i, 3) - 0.5) * 300, g) + 10 * Math.cos(t * 1.1 + i);
        cham(ctx, x, y, 11, i % 3 ? M.ckh : M.kkh);
      }
      ctx.restore();
    }
    const oL = hien(t, aL, S.t1 - 0.05), oR = hien(t, aR, S.t1 - 0.05);
    // buồng trái: cửa mở bên phải; hạt đi bước ngẫu nhiên (tổng các sóng), một phần đi ra rồi quay lại
    if (oL > 0) {
      ctx.save(); ctx.globalAlpha = oL;
      hcn(ctx, L.x, L.y, L.w, L.h, 24, 'rgba(98,144,181,0.10)', M.kkh, 5);
      ctx.fillStyle = M.nen; ctx.fillRect(L.x + L.w - 6, L.y + 150, 14, 140);
      for (let i = 0; i < 40; i++) {
        const f1 = 0.6 + hash(i, 1) * 0.9, f2 = 0.5 + hash(i, 2) * 0.8, p1 = hash(i, 3) * 6.28, p2 = hash(i, 4) * 6.28;
        let x = L.x + 40 + (L.w - 80) * (0.5 + 0.32 * Math.sin(f1 * t + p1) + 0.16 * Math.sin(2.3 * f2 * t + p2));
        let y = L.y + 40 + (L.h - 80) * (0.5 + 0.3 * Math.cos(f2 * t + p2) + 0.18 * Math.sin(1.7 * f1 * t + p1));
        // chu kỳ rút: 30% số hạt có lúc đi qua cửa ra ngoài
        if (i % 10 < 3) {
          const ph = ((t + hash(i, 5) * 7) % 7) / 7;
          if (ph > 0.6) { const u = Math.sin(Math.PI * (ph - 0.6) / 0.4); x = lerp(x, L.x + L.w + 120, u); y = lerp(y, L.y + 220, u); }
        }
        cham(ctx, x, y, 11, M.kkh);
      }
      ctx.restore();
    }
    // buồng phải: hạt xếp hàng nằm yên; vòng đồng hồ chạy hết thì hạt lãi xuất hiện
    if (oR > 0) {
      ctx.save(); ctx.globalAlpha = oR;
      hcn(ctx, R.x, R.y, R.w, R.h, 24, 'rgba(1,101,179,0.08)', M.ckh, 5);
      const u = ((t - aR) % P) / P;
      for (let i = 0; i < 40; i++) {
        const col = i % 8, row = Math.floor(i / 8);
        cham(ctx, R.x + 90 + col * 60, R.y + 150 + row * 56 + 2 * Math.sin(t * 2 + i), 11, M.ckh);
      }
      const nl = Math.floor(u * 10);
      for (let k = 0; k < nl; k++) cham(ctx, R.x + 90 + k * 46, R.y + 110, 8, M.lai);
      ctx.lineWidth = 10; ctx.strokeStyle = M.luoi2; ctx.beginPath(); ctx.arc(R.x + R.w - 70, R.y + 70, 40, 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = M.ckh; ctx.beginPath(); ctx.arc(R.x + R.w - 70, R.y + 70, 40, -1.5708, -1.5708 + 6.2832 * u); ctx.stroke();
      ctx.restore();
    }
    // câu 4: thanh lãi suất dưới mỗi buồng
    const o4 = hien(t, C(c, 4) - 0.1, S.t1 - 0.05);
    if (o4 > 0) {
      ctx.save(); ctx.globalAlpha = o4;
      const g = eo(cl((t - C(c, 4)) / 0.8));
      hcn(ctx, L.x + 40, L.y + L.h + 30, (L.w - 80) * 0.08 * g + 4, 30, 8, M.kkh);
      hcn(ctx, R.x + 40, R.y + R.h + 30, (R.w - 80) * 0.85 * g + 4, 30, 8, M.ckh);
      ctx.restore();
    }
    // dải dưới: số hạt trong mỗi buồng theo thời gian
    const op = hien(t, aL, S.t1 - 0.05);
    khungDoThi(ctx, DT.x, DT.y, DT.w, DT.h, op);
    const p = cl((t - aL) / (S.t1 - aL));
    doThi(ctx, DT.x, DT.y, DT.w, DT.h, p, (u) => 0.55 + 0.25 * Math.sin(u * 40) * Math.cos(u * 17), M.kkh, { day: 4 });
    if (t > aR) doThi(ctx, DT.x, DT.y, DT.w, DT.h, p, (u) => u < (aR - aL) / (S.t1 - aL) ? 0 : 0.85, M.ckh, { day: 4 });
  });
  giua(S, 'không kỳ hạn', L.x + L.w / 2, 168, 600, 52, M.chu, aL, null, { dam: 800 });
  giua(S, 'rút lúc nào cũng được', L.x + L.w / 2, L.y + L.h + 30, 600, 42, M.chu2, aL + 0.6, C(c, 3) - 0.05);
  giua(S, 'có kỳ hạn · tiết kiệm', R.x + R.w / 2, 168, 640, 52, M.ckh, aR, C(c, 4) - 0.05, { dam: 800 });
  giua(S, 'có kỳ hạn', R.x + R.w / 2, 168, 640, 52, M.ckh, C(c, 4) - 0.05, null, { dam: 800 });
  giua(S, 'ví dụ 6 tháng', R.x + R.w / 2, R.y + R.h + 30, 600, 42, M.chu2, TU(c, 3, 'sáu') - 0.3, C(c, 4) - 0.05);
  nhanGD(S, TU(c, 3, 'sáu') - 0.3, C(c, 4) - 0.05);
  dong(S, 'lãi thấp', L.x + 40, L.y + L.h + 72, 300, 40, M.chu2, C(c, 4) + 0.3, null);
  dong(S, 'lãi cao hơn', R.x + 40, R.y + R.h + 72, 400, 40, M.ckh, C(c, 4) + 0.6, null);
};

// ======================= Chương 4 · Nguồn thứ hai: giấy tờ có giá =======================
N.canh4 = function (S) {
  const c = 4;
  const X0 = 300, X1 = 1640, YA = 700;
  const ngan = { x0: X0, x1: X0 + 300, y: 350, mau: '#E0A060', a: C(c, 2) }, dai = { x0: X0, x1: X0 + 1080, y: 580, mau: M.gtcg, a: C(c, 3) };
  tieuDe(S, 'giấy tờ có giá', C(c, 1) + 0.2, C(c, 2) - 0.05);
  dong(S, 'Điều 107', DAI.x + 40, DAI.y + 18, 400, 42, M.chu2, C(c, 1) + 0.6, C(c, 2) - 0.05);
  S.ve2d.push((ctx, t) => {
    const op = hien(t, C(c, 1) + 0.2, S.t1 - 0.05);
    if (op <= 0) return;
    ctx.save(); ctx.globalAlpha = op;
    // trục thời gian
    ctx.strokeStyle = M.chu; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X0, YA); ctx.lineTo(X1, YA); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X1 - 18, YA - 12); ctx.lineTo(X1, YA); ctx.lineTo(X1 - 18, YA + 12); ctx.stroke();
    for (let k = 0; k <= 10; k++) { const x = X0 + k * 120; ctx.beginPath(); ctx.moveTo(x, YA - 10); ctx.lineTo(x, YA + 10); ctx.stroke(); }
    // điểm "bây giờ" chạy dọc trục, lặp
    ctx.restore();
    [ngan, dai].forEach((k, kk) => {
      const o = hien(t, k.a - 0.1, S.t1 - 0.05);
      if (o <= 0) return;
      ctx.save(); ctx.globalAlpha = o;
      const g = eo(cl((t - k.a) / 1.0));
      const x1 = lerp(k.x0, k.x1, g);
      hcn(ctx, k.x0, k.y - 50, x1 - k.x0, 100, 14, kk ? 'rgba(201,118,43,0.12)' : 'rgba(224,160,96,0.12)', k.mau, 4);
      // khối hạt giữ suốt kỳ hạn
      const nCol = Math.max(1, Math.floor((x1 - k.x0 - 30) / 30));
      for (let i = 0; i < nCol * 2; i++) cham(ctx, k.x0 + 24 + (i % nCol) * 30, k.y - 16 + Math.floor(i / nCol) * 32, 10, k.mau);
      // hạt lãi nhỏ rơi xuống trục theo chu kỳ; trái phiếu nhiều hơn
      const n = kk ? 6 : 2;
      for (let j = 0; j < n; j++) {
        const ph = ((t - k.a) * 0.6 + j / n) % 1;
        const xx = k.x0 + 40 + (x1 - k.x0 - 80) * ((j + 0.5) / n), yy = k.y + 50 + ph * (YA - k.y - 60);
        if (t > k.a + 1) cham(ctx, xx, yy, 7, M.lai);
      }
      ctx.restore();
    });
    // câu 4: viền đậm quanh khối trái phiếu
    const o4 = hien(t, C(c, 4) + 0.3, S.t1 - 0.05);
    if (o4 > 0) { ctx.save(); ctx.globalAlpha = o4; ctx.setLineDash([16, 10]); hcn(ctx, dai.x0 - 14, dai.y - 64, dai.x1 - dai.x0 + 28, 128, 20, null, M.chu, 6); ctx.restore(); }
    // dải dưới: lãi suất tăng theo kỳ hạn
    khungDoThi(ctx, DT.x, DT.y, DT.w, DT.h, op);
    doThi(ctx, DT.x, DT.y, DT.w, DT.h, cl((t - C(c, 2)) / (S.t1 - C(c, 2))), (u) => 0.2 + 0.7 * Math.sqrt(u), M.gtcg, { day: 4 });
  });
  dong(S, 'chứng chỉ tiền gửi', ngan.x0 + 330, ngan.y - 30, 560, 46, M.gtcgChu, ngan.a + 0.3, null, { dam: 800 });
  dong(S, 'trái phiếu · vài năm', dai.x0, dai.y - 118, 600, 46, M.gtcgChu, dai.a + 0.5, null, { dam: 800 });
  hop(S, 'vốn cấp 2', dai.x1 + 170, dai.y, 240, 66, 40, M.chu, M.the, M.chu, TU(c, 4, 'vốn cấp hai') - 0.2, null);
};

// ======================= Chương 5 · Nguồn thứ ba: tiền đi vay =======================
N.canh5 = function (S) {
  const c = 5;
  const NH = [960, 700];
  tieuDe(S, 'tiền đi vay', C(c, 1) + 0.1, C(c, 2) - 0.05);
  toa(S, NH[0], NH[1], 0.62, 'tru_so', C(c, 1) - 0.1, null);
  const ben = [[300, 690], [470, 690], [640, 690]];
  ben.forEach((p, i) => toa(S, p[0], p[1], 0.32, 'chi_nhanh', C(c, 2) + i * 0.15, null));
  const nhnn = [1420, 470];
  toa(S, nhnn[0], nhnn[1], 0.42, 'tru_so', TU(c, 3, 'ngân hàng nhà nước') - 0.3, null);
  S.ve2d.push((ctx, t) => {
    // liên ngân hàng: hạt đi qua lại nhanh theo nhịp ngày đêm (chu kỳ 2 giây)
    const o2 = hien(t, C(c, 2) + 0.3, S.t1 - 0.05);
    if (o2 > 0) {
      ctx.save(); ctx.globalAlpha = o2;
      for (let i = 0; i < 18; i++) {
        const b = ben[i % 3], ph = ((t * 0.5 + i / 18) % 1), di = Math.floor(t * 0.5 + i / 18) % 2 === 0;
        const u = di ? ph : 1 - ph;
        const x = lerp(b[0] + 40, NH[0] - 120, u), y = lerp(b[1] - 90, NH[1] - 150, u) - 110 * Math.sin(Math.PI * u);
        cham(ctx, x, y, 9, M.vay);
      }
      // mặt trời, mặt trăng quay quanh
      const ang = t * Math.PI;
      const sx = 470 + 140 * Math.cos(ang), sy = 400 + 50 * Math.sin(ang);
      const ngay = Math.sin(ang) < 0;
      cham(ctx, sx, sy, 22, ngay ? M.vang : M.phu);
      ctx.restore();
    }
    // tái cấp vốn: một dòng hạt từ toà Ngân hàng Nhà nước khi "cần tiền gấp"
    const a3 = TU(c, 3, 'ngân hàng nhà nước');
    const o3 = hien(t, a3 - 0.2, S.t1 - 0.05);
    if (o3 > 0) {
      ctx.save(); ctx.globalAlpha = o3;
      for (let i = 0; i < 16; i++) {
        const u = ((t - a3) * 0.55 + i / 16) % 1;
        if (t - a3 < i / 16 / 0.55) continue;
        const x = lerp(nhnn[0] - 100, NH[0] + 140, u), y = lerp(nhnn[1] - 80, NH[1] - 160, u) - 60 * Math.sin(Math.PI * u);
        cham(ctx, x, y, 10, M.ckh);
      }
      ctx.restore();
    }
    // nước ngoài (quả cầu) và ủy thác (hộp có khoá)
    const aG = TU(c, 4, 'nước ngoài'), aU = TU(c, 4, 'ủy thác');
    const oG = hien(t, aG - 0.2, S.t1 - 0.05), oU = hien(t, aU - 0.2, S.t1 - 0.05);
    const G = [1720, 300], U = [1720, 620];
    if (oG > 0) {
      ctx.save(); ctx.globalAlpha = oG;
      ctx.lineWidth = 5; ctx.strokeStyle = M.ckh; ctx.beginPath(); ctx.arc(G[0], G[1], 56, 0, 6.2832); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(G[0], G[1], 24 + 20 * Math.abs(Math.sin(t)), 56, 0, 0, 6.2832); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(G[0] - 56, G[1]); ctx.lineTo(G[0] + 56, G[1]); ctx.stroke();
      for (let i = 0; i < 8; i++) { const u = ((t - aG) * 0.5 + i / 8) % 1; if (t - aG < i / 8 / 0.5) continue; cham(ctx, lerp(G[0] - 70, NH[0] + 160, u), lerp(G[1] + 30, NH[1] - 200, u) - 80 * Math.sin(Math.PI * u), 9, M.vay); }
      ctx.restore();
    }
    if (oU > 0) {
      ctx.save(); ctx.globalAlpha = oU;
      hcn(ctx, U[0] - 60, U[1] - 40, 120, 90, 12, M.the, M.chu, 5);
      ctx.lineWidth = 6; ctx.strokeStyle = M.chu; ctx.beginPath(); ctx.arc(U[0], U[1] - 40, 26, Math.PI, 0); ctx.stroke();
      for (let i = 0; i < 8; i++) { const u = ((t - aU) * 0.5 + i / 8) % 1; if (t - aU < i / 8 / 0.5) continue; cham(ctx, lerp(U[0] - 70, NH[0] + 160, u), lerp(U[1], NH[1] - 120, u) - 40 * Math.sin(Math.PI * u), 9, M.xanh); }
      ctx.restore();
    }
    // dải dưới: số dư vay liên ngân hàng lên xuống từng ngày
    const op = hien(t, C(c, 2), S.t1 - 0.05);
    khungDoThi(ctx, DT.x, DT.y, DT.w, DT.h, op);
    doThi(ctx, DT.x, DT.y, DT.w, DT.h, cl((t - C(c, 2)) / (S.t1 - C(c, 2))), (u) => 0.45 + 0.35 * Math.sin(u * 31) * (0.6 + 0.4 * Math.sin(u * 7)), M.vay, { day: 4 });
  });
  giua(S, 'liên ngân hàng · qua đêm', 470, 200, 560, 44, M.vay, C(c, 2) + 0.5, C(c, 4) - 0.05, { dam: 800 });
  giua(S, 'Ngân hàng Nhà nước · tái cấp vốn', 1420, 160, 640, 44, M.ckh, TU(c, 3, 'ngân hàng nhà nước'), C(c, 4) - 0.05, { dam: 800 });
  giua(S, 'nước ngoài', 1720, 380, 300, 40, M.vay, TU(c, 4, 'nước ngoài') - 0.1, null, { dam: 800 });
  giua(S, 'ủy thác', 1720, 690, 300, 40, M.xanh, TU(c, 4, 'ủy thác') - 0.1, null, { dam: 800 });
  dong(S, 'Điều 108', DAI.x + 40, DAI.y + 18, 400, 42, M.chu2, C(c, 4), null);
};

// ======================= Chương 6 · Mọi nguồn gộp lại =======================
const NGUON = [
  { ten: 'không kỳ hạn', so: 20, mau: M.kkh, tu: 'tiền gửi không kỳ hạn' },
  { ten: 'có kỳ hạn', so: 50, mau: M.ckh, tu: 'tiền gửi có kỳ hạn' },
  { ten: 'giấy tờ có giá', so: 10, mau: M.gtcg, tu: 'giấy tờ có giá' },
  { ten: 'đi vay', so: 10, mau: M.vay, tu: 'đi vay' },
  { ten: 'vốn chủ sở hữu', so: 10, mau: M.von, tu: 'vốn chủ sở hữu' },
];
N.canh6 = function (S) {
  const c = 6;
  const a1 = C(c, 1);
  const XS = [640, 790, 960, 1080, 1180];
  NGUON.forEach((k, i) => { k.x = XS[i]; k.w = 10 + 2.2 * k.so; k.a = TU(c, 2, k.tu) - 0.2; });
  const v0 = NGUON[0].a + 0.5;
  const B = be(S, 900, 770, { rong: 600, cao: 450, a: a1 - 0.2, muc_dau: 0.02, muc: 0.86, dai_vao: Math.max(2, E(c, 2) + 0.4 - v0), vao: v0, chuyen: [{ luc: C(c, 4) + 0.8 - v0, muc: 0.62, dai: 3 }] });
  nhanGD(S, a1 + 0.2);
  tieuDe(S, '100 đồng', a1 + 0.2, C(c, 2) - 0.05, { mau: M.nhan });
  const ra = [{ ten: 'cho vay', y: 400, mau: M.ckh }, { ten: 'đầu tư', y: 540, mau: M.gtcg }, { ten: 'chi trả', y: 680, mau: M.xanh }];
  const a4 = C(c, 4);
  S.ve2d.push((ctx, t) => {
    const op = hien(t, a1 - 0.2, S.t1 - 0.05);
    const s5 = hien(t, C(c, 5), S.t1 - 0.05);
    NGUON.forEach((k, i) => {
      const o = hien(t, k.a - 0.4, S.t1 - 0.05) * op;
      if (o <= 0) return;
      const sang = s5 > 0 && i < 2;
      voi(ctx, k.x, 110, 230, k.w, k.mau, o);
      if (sang) { ctx.save(); ctx.globalAlpha = s5 * (0.4 + 0.3 * Math.sin(t * 5)); hcn(ctx, k.x - k.w / 2 - 16, 100, k.w + 32, 150, 12, null, M.nhan, 6); ctx.restore(); }
      // dòng hạt tỉ lệ theo số đồng
      const nhip = k.so * 0.55;
      ctx.save(); ctx.globalAlpha = o;
      roi(ctx, t, { n: Math.ceil((S.t1 - k.a) * nhip), a: k.a, nhip, tu: (j) => [k.x + (hash(j, i + 7) - 0.5) * k.w * 0.7, 232], den: (j, ts) => [k.x + (hash(j, i + 9) - 0.5) * (k.w + 30), B.mat(ts + 0.3)], tan: true, r: 8, mau: () => k.mau });
      ctx.restore();
    });
    // câu 4: ba ống ra bên phải
    const o4 = hien(t, a4 - 0.1, S.t1 - 0.05);
    if (o4 > 0) {
      ctx.save(); ctx.globalAlpha = o4;
      ra.forEach((d, i) => {
        hcn(ctx, B.x1 + 8, d.y - 18, 230, 36, 10, M.the, d.mau, 4);
        hcn(ctx, 1460, d.y - 56, 280, 112, 18, 'rgba(255,255,255,0.9)', d.mau, 5);
        for (let j = 0; j < 10; j++) {
          const ts = a4 + 0.3 + i * 0.4 + j * 0.35; if (t < ts) continue;
          const u = ((t - ts) * 0.5) % 1;
          cham(ctx, lerp(B.x1 - 20, 1470, u), d.y + 3 * Math.sin(u * 20 + j), 9, d.mau);
        }
        const nTich = Math.min(16, Math.floor(Math.max(0, t - a4 - 1.2 - i * 0.4) * 2.2));
        for (let j = 0; j < nTich; j++) cham(ctx, 1495 + (j % 8) * 30, d.y + 20 + Math.floor(j / 8) * 22, 7, d.mau);
      });
      ctx.restore();
    }
    // dải dưới: thanh xếp chồng 100 đồng
    if (op > 0) {
      ctx.save(); ctx.globalAlpha = op;
      let x = DT.x; const wDong = DT.w / 100;
      NGUON.forEach((k, i) => {
        const o = hien(t, k.a, S.t1 - 0.05);
        const nay = t >= k.a && t < (NGUON[i + 1] ? NGUON[i + 1].a : E(c, 2));
        hcn(ctx, x + 2, DT.y + (nay ? 4 : 14), k.so * wDong - 4, nay ? 56 : 36, 8, o > 0 ? k.mau : M.nhat);
        x += k.so * wDong;
      });
      ctx.restore();
    }
  });
  // số trên mỗi vòi (giữ), tên vòi chỉ hiện lúc đang đọc
  NGUON.forEach((k, i) => {
    const het = Math.min(k.a + 1.7, E(c, 2) + 0.4);
    const wT = Math.ceil(K.doChu(k.ten, 40, 800)) + 28, xT = i === 4 ? 1230 + wT / 2 : k.x;
    giua(S, k.ten, xT, i === 4 ? 250 : (i % 2 ? 196 : 140), wT, 40, k.mau === M.gtcg ? M.gtcgChu : k.mau, k.a + 0.1, het, { dam: 800, css: 'background:rgba(255,255,255,0.94);border-radius:10px;padding:2px 0;' });
    giua(S, String(k.so), k.x, 250, 100, 44, k.mau === M.gtcg ? M.gtcgChu : k.mau, het, a4 - 0.05, { dam: 800, css: 'background:rgba(255,255,255,0.92);border-radius:10px;' });
  });
  ra.forEach((d) => giua(S, d.ten, 1600, d.y - 50, 270, 42, d.mau === M.gtcg ? M.gtcgChu : d.mau, TU(c, 4, d.ten === 'chi trả' ? 'trả' : d.ten === 'đầu tư' ? 'mua' : 'cho khách vay') - 0.1, null, { dam: 800 }));
  giua(S, 'tiền gửi lớn nhất', 380, 420, 420, 46, M.nhan, C(c, 5) + 0.3, null, { dam: 800 });
};

// ======================= Chương 7 · Nguồn nào đắt, nguồn nào rẻ =======================
N.canh7 = function (S) {
  const c = 7;
  const X0 = 360, Y0 = 740, PX = 12, PY = 58;    // 12 px mỗi đồng, 58 px mỗi phần trăm
  const cot = [
    { so: 20, lai: 0.5, mau: M.kkh, nhan: '0,5%', ten: 'không kỳ hạn', tu: 'không kỳ hạn' },
    { so: 50, lai: 7, mau: M.ckh, nhan: '7%', ten: 'có kỳ hạn', tu: 'có kỳ hạn' },
    { so: 10, lai: 8, mau: M.gtcg, nhan: '8%', ten: 'giấy tờ', tu: 'giấy tờ' },
    { so: 10, lai: 6, mau: M.vay, nhan: '6%', ten: 'đi vay', tu: 'đi vay' },
  ];
  let x = X0; cot.forEach((k) => { k.x = x + 8; k.w = k.so * PX - 16; x += k.so * PX + 30; k.a = TU(c, 2, k.tu) - 0.2; k.h = k.lai * PY; });
  tieuDe(S, 'giá của mỗi nguồn', C(c, 1) - 0.25, C(c, 2) + 0.7);
  nhanGD(S, C(c, 2), C(c, 4) - 0.05);
  const a3 = C(c, 3), a6 = C(c, 6);
  const cao = (k, t) => k.lai === 6 && t > a6 ? k.h * (1 + 0.22 * Math.sin((t - a6) * 4.2) * Math.min(1, (t - a6))) : k.h;
  S.ve2d.push((ctx, t) => {
    const op = hien(t, C(c, 1), S.t1 - 0.05);
    if (op <= 0) return;
    ctx.save(); ctx.globalAlpha = op;
    ctx.strokeStyle = M.chu; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(X0 - 20, Y0 - 9 * PY - 30); ctx.lineTo(X0 - 20, Y0); ctx.lineTo(x + 40, Y0); ctx.stroke();
    for (let v = 2; v <= 8; v += 2) { const y = Y0 - v * PY; ctx.strokeStyle = M.luoi2; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0 - 20, y); ctx.lineTo(x + 40, y); ctx.stroke(); }
    cot.forEach((k, i) => {
      const o = hien(t, k.a - 0.1, S.t1 - 0.05);
      hcn(ctx, k.x, Y0 - 9 * PY, k.w, 9 * PY, 6, null, M.luoi2, 2);
      if (o <= 0) return;
      const g = eo(cl((t - k.a) / 0.9));
      const h = cao(k, t) * g;
      hcn(ctx, k.x, Y0 - h, k.w, h, 6, K.rgba(k.mau, 0.18), k.mau, 4);
      // hạt lấp diện tích cột (diện tích = tiền lãi)
      const step = 22, nc = Math.max(1, Math.floor(k.w / step)), nr = Math.max(1, Math.floor(h / step));
      for (let q = 0; q < nc * nr; q++) {
        const cx = k.x + step / 2 + (q % nc) * step + (k.w - nc * step) / 2, cy = Y0 - step / 2 - Math.floor(q / nc) * step;
        let dx = 0, dy = 0;
        if (i === 0 && t > C(c, 4)) { const ph = ((t * 0.7 + hash(q, 1)) % 1); if (ph > 0.55) { const u = Math.sin(Math.PI * (ph - 0.55) / 0.45); dx = -u * 60 * hash(q, 2); dy = -u * 220 * hash(q, 3); } }
        cham(ctx, cx + dx, cy + dy, 7, k.mau);
      }
      // câu 3: ô diện tích bay về bộ đếm
      if (t > a3) {
        for (let j = 0; j < 6; j++) {
          const ts = a3 + 0.2 + i * 0.25 + j * 0.12, u = cl((t - ts) / 1.1);
          if (t < ts || u >= 1) continue;
          cham(ctx, lerp(k.x + k.w / 2, 300, eio(u)), lerp(Y0 - h / 2, DAI.y + 40, eio(u)) - 120 * Math.sin(Math.PI * u), 9, M.lai);
        }
      }
    });
    ctx.restore();
    // dải dưới: chi phí cộng dồn tới 5
    khungDoThi(ctx, DT.x, DT.y, DT.w, DT.h, op);
    doThi(ctx, DT.x, DT.y, DT.w, DT.h, cl((t - a3) / 2.2), (u) => u, M.lai, { day: 4 });
  });
  // tên cột: hiện từ lúc lời đọc tới, giữ tới hết câu 3; từ câu 4 chỉ còn tên cột đang nói (giữ 12 tiếng)
  const a4 = C(c, 4), a5 = C(c, 5);
  const ten = (k, a, b) => giua(S, k.ten, k.x + k.w / 2, Y0 + 12, Math.max(200, k.w + 50), 36, k.mau, a, b, { dam: 800 });
  cot.forEach((k, i) => {
    ten(k, k.a, a4);
    const het = cot[i + 1] ? cot[i + 1].a + 0.25 : a3 + 0.2;
    giua(S, k.nhan, k.x + k.w / 2, Y0 - k.h * (k.lai === 6 ? 1.24 : 1) - 70, 200, 46, k.mau, k.a + 0.15, Math.max(het, k.a + 1.9), { dam: 800 });
  });
  ten(cot[0], a4, a5); ten(cot[1], a5, a6); ten(cot[3], a6, null);
  giua(S, 'lãi suất năm', 360, 160, 380, 40, M.chu2, C(c, 2) + 0.4, cot[2].a);
  soChay(S, 140, DAI.y + 14, 440, 48, M.chu, a3, null, (t) => '≈ ' + (5 * eio(cl((t - a3) / 2.2))).toFixed(1).replace('.', ',') + ' đồng');
  giua(S, 'rẻ · dễ rút', cot[0].x + cot[0].w / 2, 300, 360, 44, M.chu, C(c, 4) + 0.2, C(c, 5) - 0.05, { dam: 800 });
  giua(S, 'đắt hơn · ổn định', cot[1].x + cot[1].w / 2, 170, 460, 44, M.ckh, C(c, 5) + 0.2, C(c, 6) - 0.05, { dam: 800 });
  giua(S, 'theo thị trường', 1720, 420, 360, 44, M.vay, C(c, 6) + 0.3, null, { dam: 800 });
};

// ======================= Chương 8 · Không được dùng hết để cho vay =======================
N.canh8 = function (S) {
  const c = 8;
  const B = be(S, 520, 720, { rong: 320, cao: 460, a: C(c, 1) - 0.2, muc_dau: 0.85, muc: 0.85, vao: -1 });
  tieuDe(S, 'không dùng hết', C(c, 1) + 0.1, C(c, 2) - 0.05);
  const HOP = [900, 640];
  toa(S, HOP[0], HOP[1] + 60, 0.36, 'tru_so', C(c, 2), C(c, 4) - 0.05);
  const a2 = TU(c, 2, 'một phần'), a4 = C(c, 4), a6 = C(c, 6);
  const CT = { x: 1180, xd: 1440, w: 170, y0: 740, h: 520 };  // cột tiền gửi, cột dư nợ
  S.ve2d.push((ctx, t) => {
    const op = hien(t, C(c, 1) - 0.2, S.t1 - 0.05);
    // hạt trong bể (tiền gửi)
    const oB = hien(t, C(c, 1) - 0.2, a4 + 0.4);
    if (oB > 0) {
      ctx.save(); ctx.globalAlpha = oB;
      const top = B.mat(t);
      for (let i = 0; i < 100; i++) {
        const col = i % 10, row = Math.floor(i / 10);
        let x = B.x0 + 30 + col * 29, y = B.day - 26 - row * ((B.day - top - 30) / 10);
        // 3 hạt rơi qua ống xuống Ngân hàng Nhà nước
        if (i >= 97) {
          const ts = a2 + (i - 97) * 0.5, u = cl((t - ts) / 1.2);
          if (t > ts) { x = lerp(x, HOP[0], eio(u)); y = lerp(y, HOP[1] - 40, eio(u)) - 140 * Math.sin(Math.PI * u); }
          if (u < 1) cham(ctx, x, y, 10, t > ts ? M.do : M.nhan);   // tới toà Ngân hàng Nhà nước thì vào trong, không còn đứng lơ lửng
        } else cham(ctx, x + 2 * Math.sin(t * 2 + i), y, 10, M.nhan);
      }
      ctx.restore();
    }
    // cột tiền gửi và cột dư nợ, vạch 85%
    const o4 = hien(t, a4 - 0.1, S.t1 - 0.05);
    if (o4 > 0) {
      ctx.save(); ctx.globalAlpha = o4;
      const g = eo(cl((t - a4) / 0.8));
      hcn(ctx, CT.x, CT.y0 - CT.h * g, CT.w, CT.h * g, 8, K.rgba(M.nhan, 0.18), M.nhan, 4);
      const ld = (0.62 + 0.18 * eio(cl((t - a4 - 0.6) / 2.5)) + 0.025 * Math.sin(t * 1.7)) * g;
      hcn(ctx, CT.xd, CT.y0 - CT.h * ld, CT.w, CT.h * ld, 8, K.rgba(M.ckh, 0.55), M.ckh, 4);
      const nr = Math.floor(CT.h * ld / 26);
      for (let q = 0; q < nr * 6; q++) cham(ctx, CT.xd + 20 + (q % 6) * 26, CT.y0 - 14 - Math.floor(q / 6) * 26, 8, M.the);
      const y85 = CT.y0 - CT.h * 0.85;
      ctx.strokeStyle = M.do; ctx.lineWidth = 6;
      if (t > a6 + 0.4) ctx.setLineDash([18, 12]);
      if (t > C(c, 5)) { ctx.beginPath(); ctx.moveTo(CT.x - 60, y85); ctx.lineTo(CT.xd + CT.w + 30, y85); ctx.stroke(); }
      ctx.restore();
    }
    // dải dưới: tỷ lệ dư nợ / tiền gửi dưới đường 85% (đồ thị lùi sang phải, không cắt chữ "Thông tư 22/2019 · Điều 20")
    const D8 = { x: 900, y: DT.y, w: 540, h: DT.h };
    khungDoThi(ctx, D8.x, D8.y, D8.w, D8.h, op);
    if (t > a4) {
      ctx.save(); ctx.globalAlpha = op; ctx.strokeStyle = M.do; ctx.lineWidth = 3; ctx.setLineDash([12, 8]);
      ctx.beginPath(); ctx.moveTo(D8.x, D8.y + D8.h * 0.15); ctx.lineTo(D8.x + D8.w, D8.y + D8.h * 0.15); ctx.stroke(); ctx.restore();
      doThi(ctx, D8.x, D8.y, D8.w, D8.h, cl((t - a4) / (S.t1 - a4)), (u) => 0.6 + 0.18 * Math.sin(u * 12) * 0.5 + 0.12 * u, M.ckh, { day: 4 });
    }
  });
  giua(S, 'dự trữ bắt buộc', 1050, 420, 460, 48, M.do, a2 - 0.3, C(c, 3) - 0.05, { dam: 800 });
  giua(S, '3% · tiền gửi VND dưới 12 tháng', 1060, 420, 720, 44, M.doChu, C(c, 3), a4 - 0.05, { dam: 800 });
  soChay(S, 140, DAI.y + 14, 420, 48, M.chu, a2, a4 - 0.05, (t) => { let n = 0; for (let i = 0; i < 3; i++) if (t > a2 + i * 0.5 + 1.2) n++; return n + ' / 100'; });
  giua(S, 'tiền gửi', CT.x + CT.w / 2, CT.y0 + 6, 240, 38, M.nhan, a4, a6 + 0.2, { dam: 800 });
  giua(S, 'dư nợ', CT.xd + CT.w / 2, CT.y0 + 6, 240, 38, M.ckh, a4 + 0.3, a6 + 0.2, { dam: 800 });
  giua(S, 'dư nợ = tiền khách còn nợ', 1395, 130, 760, 46, M.chu, TU(c, 4, 'dư nợ'), C(c, 5) - 0.05, { dam: 800 });
  dong(S, 'tối đa 85%', CT.x - 330, CT.y0 - CT.h * 0.85 - 30, 290, 46, M.doChu, C(c, 5) + 0.4, null, { dam: 800 });
  dong(S, 'Thông tư 22/2019 · Điều 20', DAI.x + 40, DAI.y + 18, 760, 42, M.chu2, C(c, 5) + 0.4, a6 - 0.05);
  giua(S, 'Thông tư 50/2026 · từ 01/12/2026: cách tính mới', 1300, 130, 960, 44, M.doChu, a6 + 0.3, null, { dam: 800 });
};

// ======================= Chương 9 · Thời hạn và bảo hiểm tiền gửi =======================
N.canh9 = function (S) {
  const c = 9;
  const X0 = 220, X1 = 1700, YA = 470, PN = 70;   // 70 px mỗi năm
  const a2 = C(c, 2), a3 = C(c, 3), a4 = C(c, 4);
  tieuDe(S, 'thời hạn', C(c, 1) + 0.1, a2 - 0.05);
  S.ve2d.push((ctx, t) => {
    const op = hien(t, C(c, 1), a4 - 0.05);
    if (op > 0) {
      ctx.save(); ctx.globalAlpha = op;
      ctx.strokeStyle = M.chu; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X0, YA); ctx.lineTo(X1, YA); ctx.stroke();
      for (let k = 0; k <= 20; k++) { const x = X0 + k * PN; ctx.lineWidth = k % 5 ? 2 : 4; ctx.beginPath(); ctx.moveTo(x, YA - (k % 5 ? 8 : 14)); ctx.lineTo(x, YA + (k % 5 ? 8 : 14)); ctx.stroke(); }
      ctx.strokeStyle = M.do; ctx.lineWidth = 4; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(X0 + PN, YA - 260); ctx.lineTo(X0 + PN, YA + 260); ctx.stroke(); ctx.setLineDash([]);
      // nguồn ngắn hạn: các khối nhỏ dưới mốc 1 năm, tự làm mới (trượt) theo chu kỳ
      const o2 = hien(t, a2 - 0.1, a4 - 0.05);
      for (let r = 0; r < 4; r++) for (let k = 0; k < 10; k++) {
        const ph = ((t * 0.35 + hash(r * 10 + k, 1)) % 1);
        const x = X0 + 6 + ph * (PN - 12), y = YA - 70 - r * 44 - (k % 2) * 18;
        const chuyen = t > a3 + 0.4 && (r * 10 + k) % 10 < 4;
        let xx = x, yy = y;
        if (chuyen) { const u = eio(cl((t - a3 - 0.4 - ((r * 10 + k) % 10) * 0.12) / 1.4)); xx = lerp(x, X0 + 120 + ((r * 10 + k) % 16) * 60, u); yy = lerp(y, YA + 90 + (r % 2) * 50, u); }
        ctx.globalAlpha = op * o2; cham(ctx, xx, yy, 9, chuyen ? M.ckh : M.kkh);
      }
      // khoản cho vay dài: thanh dưới trục
      ctx.globalAlpha = op * o2;
      [[3, 12], [5, 20], [2, 8]].forEach(([a, n], i) => hcn(ctx, X0 + a * PN * 0.2, YA + 70 + i * 50, n * PN * eo(cl((t - a2 - 0.5 - i * 0.2) / 1)), 34, 10, K.rgba(M.ckh, 0.16), M.ckh, 4));
      ctx.restore();
    }
    // bảo hiểm tiền gửi: cột hạt người gửi, khiên phủ tới mức 350 triệu
    const o4 = hien(t, a4 - 0.1, S.t1 - 0.05);
    if (o4 > 0) {
      ctx.save(); ctx.globalAlpha = o4;
      const CX = 960, Y0 = 740, HM = 420;
      const g = eo(cl((t - a4) / 1));
      for (let q = 0; q < 80; q++) {
        const col = q % 8, row = Math.floor(q / 8), y = Y0 - 16 - row * 52;
        const trong = Y0 - y <= HM;
        if (row / 10 > g) continue;
        cham(ctx, CX - 4 * 26 + col * 30 + 2 * Math.sin(t * 2 + q), y, 11, trong ? M.ckh : M.xam);
      }
      const gk = eo(cl((t - C(c, 5)) / 0.9));
      if (gk > 0) {
        ctx.lineWidth = 8; ctx.strokeStyle = M.xanh; ctx.fillStyle = K.rgba(M.xanh, 0.12);
        ctx.beginPath();
        const w = 170, top = Y0 - HM * gk;
        ctx.moveTo(CX - w, Y0 + 10); ctx.lineTo(CX - w, top); ctx.quadraticCurveTo(CX, top - 50, CX + w, top); ctx.lineTo(CX + w, Y0 + 10); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = M.xanh; ctx.lineWidth = 5; ctx.setLineDash([12, 8]); ctx.beginPath(); ctx.moveTo(CX - 260, Y0 - HM); ctx.lineTo(CX + 260, Y0 - HM); ctx.stroke();
      }
      ctx.restore();
    }
    // dải dưới: phần vốn ngắn hạn dùng cho vay dài, dưới đường 40%
    const od = hien(t, a3, a4 - 0.05);
    if (od > 0) {
      khungDoThi(ctx, DT.x, DT.y, DT.w, DT.h, od);
      ctx.save(); ctx.globalAlpha = od; ctx.strokeStyle = M.do; ctx.lineWidth = 3; ctx.setLineDash([12, 8]);
      ctx.beginPath(); ctx.moveTo(DT.x, DT.y + DT.h * 0.2); ctx.lineTo(DT.x + DT.w, DT.y + DT.h * 0.2); ctx.stroke(); ctx.restore();
      doThi(ctx, DT.x, DT.y, DT.w, DT.h, cl((t - a3) / (a4 - a3)), (u) => 0.4 + 0.3 * u + 0.05 * Math.sin(u * 20), M.ckh, { day: 4 });
    }
  });
  [[1, '1 năm'], [10, '10 năm'], [20, '20 năm']].forEach(([n, chu]) => giua(S, chu, X0 + n * PN, YA + 18, 180, 32, M.chu2, C(c, 1) + 0.3, a3 - 0.05));
  dong(S, 'ngắn hạn', X0 + PN + 20, YA - 240, 300, 42, M.kkh, a2 + 0.2, a4 - 0.05, { dam: 800 });
  dong(S, 'cho vay dài', X0 + 1180, YA + 220, 300, 42, M.ckh, a2 + 0.8, a3 - 0.05, { dam: 800 });
  giua(S, 'tối đa 40% · cho vay > 1 năm', 1100, 140, 900, 50, M.chu, a3 + 0.3, a4 - 0.05, { dam: 800 });
  giua(S, 'từ 01/07/2026', 1100, 215, 500, 42, M.chu2, a3 + 0.6, a4 - 0.05);
  tieuDe(S, 'bảo hiểm tiền gửi', a4 + 0.1, C(c, 5) - 0.05, { mau: M.xanh });
  giua(S, '≤ 350 triệu · mỗi người · mỗi ngân hàng', 960, 120, 1100, 52, M.xanh, C(c, 5) + 0.6, null, { dam: 800 });
  giua(S, 'gốc + lãi', 1330, 420, 300, 44, M.chu, TU(c, 5, 'gồm') - 0.1, null, { dam: 800 });
  dong(S, 'Thông tư 05/2026', DAI.x + 40, DAI.y + 18, 520, 42, M.chu2, C(c, 5) + 0.6, null);
};

// ======================= Chương 10 · Huy động quyết định lợi nhuận =======================
N.canh10 = function (S) {
  const c = 10;
  const B = be(S, 960, 690, { rong: 300, cao: 380, a: C(c, 1) - 0.2, muc_dau: 0.7, muc: 0.7, vao: -1 });
  const a2 = C(c, 2), a3 = C(c, 3), a4 = C(c, 4), a5 = C(c, 5);
  tieuDe(S, 'huy động → lợi nhuận', C(c, 1) + 0.1, a2 - 0.05);
  const O = [{ ten: 'lương', x: 1360 }, { ten: 'dự phòng', x: 1540 }, { ten: 'lợi nhuận', x: 1720 }];
  S.ve2d.push((ctx, t) => {
    const op = hien(t, C(c, 1) - 0.2, a4 + 0.8);
    if (op > 0) {
      ctx.save(); ctx.globalAlpha = op;
      // vào: tiền lãi nhận về từ khách vay (trái); ra: tiền lãi trả cho nguồn vốn (phải trên)
      for (let i = 0; i < 18; i++) {
        const u = ((t * 0.45 + i / 18) % 1);
        cham(ctx, lerp(250, B.x0 + 20, u), 380 - 40 * Math.sin(Math.PI * u) + 10 * Math.sin(i), 10, M.xanh);
      }
      const o2 = hien(t, a2 - 0.1, a4 + 0.8);
      ctx.globalAlpha = op * o2;
      for (let i = 0; i < 13; i++) {
        const u = ((t * 0.45 + i / 13) % 1);
        cham(ctx, lerp(B.x1 - 10, 1500, u), 330 - 80 * Math.sin(Math.PI * u), 10, M.lai);
      }
      // phần còn lại rơi vào ba ô
      const o3 = hien(t, a3 - 0.1, a4 + 0.8);
      ctx.globalAlpha = op * o3;
      O.forEach((d, i) => {
        hcn(ctx, d.x - 75, 600, 150, 110, 14, M.the, M.xanh, 4);
        for (let j = 0; j < 5; j++) {
          const u = ((t - a3) * 0.5 + j / 5 + i * 0.13) % 1;
          if (t - a3 < 0.3 + i * 0.2) continue;
          cham(ctx, lerp(B.x1 - 20, d.x, u), lerp(560, 650, u) - 120 * Math.sin(Math.PI * u), 8, M.xanh);
        }
      });
      ctx.restore();
    }
    // câu 4: 10 hạt có kỳ hạn đổi thành không kỳ hạn; câu 5: điện thoại có hạt rơi vào
    const o4 = hien(t, a4 - 0.1, S.t1 - 0.05);
    if (o4 > 0) {
      ctx.save(); ctx.globalAlpha = o4;
      const doi = eo(cl((t - a4 - 0.8) / 1.5));
      for (let q = 0; q < 70; q++) {
        const col = q % 10, row = Math.floor(q / 10);
        const la = q < 20 || (q < 30 && doi > (q - 20) / 10);
        const X = B.x0 + 26 + col * 27, Y = B.day - 24 - row * 34 + 2 * Math.sin(t * 2 + q);
        if (q >= 20 && q < 30 && t > a4 + 0.6) { ctx.save(); ctx.globalAlpha = o4 * (0.35 + 0.25 * Math.sin(t * 6 + q)); cham(ctx, X, Y, 17, M.vang); ctx.restore(); }
        cham(ctx, X, Y, 10, la ? M.kkh : M.ckh);
      }
      ctx.restore();
      khungDoThi(ctx, DT.x, DT.y, DT.w, DT.h, o4);
      doThi(ctx, DT.x, DT.y, DT.w, DT.h, cl((t - a4 - 0.8) / 1.5), (u) => 0.85 - 0.45 * u, M.ckh, { day: 4 });
    }
    const o5 = hien(t, a5 - 0.1, S.t1 - 0.05);
    if (o5 > 0) {
      ctx.save(); ctx.globalAlpha = o5;
      const PX = 1480, PY = 220;
      hcn(ctx, PX, PY, 220, 400, 30, M.the, M.chu, 7);
      hcn(ctx, PX + 22, PY + 50, 176, 110, 12, K.rgba(M.kkh, 0.25));
      for (let j = 0; j < 12; j++) { const u = ((t - a5) * 0.6 + j / 12) % 1; if (t - a5 < j / 12 / 0.6) continue; cham(ctx, PX + 110 + 40 * Math.sin(j * 2.1), lerp(PY - 120, PY + 120, u), 9, M.kkh); }
      ctx.restore();
    }
  });
  dong(S, 'lãi từ khách vay', 150, 220, 420, 44, M.xanh, C(c, 1) + 0.4, a4 - 0.05, { dam: 800 });
  dong(S, 'chi phí vốn', 1250, 370, 360, 44, M.vang === M.lai ? '#8F5A0E' : M.chu, a2 + 0.3, a4 - 0.05, { dam: 800 });
  O.forEach((d, i) => giua(S, d.ten, d.x, 720, 200, 36, M.xanh, TU(c, 3, d.ten === 'lương' ? 'trả lương' : d.ten === 'dự phòng' ? 'trích dự phòng' : 'tạo lợi nhuận') + 0.1, a4 + 0.8, { dam: 800 }));
  soChay(S, 140, DAI.y + 14, 460, 48, M.chu, a4 + 0.3, null, (t) => (5 - 0.65 * eio(cl((t - a4 - 0.8) / 1.5))).toFixed(2).replace('.', ',').replace(/0$/, '').replace(/,$/, '') + ' đồng / năm');
  nhanGD(S, a4 + 0.2);
  giua(S, 'quà', 1360, 260, 160, 44, M.chu, TU(c, 5, 'tặng quà') - 0.1, null, { dam: 800 });
  giua(S, 'miễn phí chuyển tiền', 1590, 640, 480, 42, M.chu, TU(c, 5, 'miễn phí') - 0.1, null, { dam: 800 });
};

// ======================= Chương 11 · Tóm lại =======================
N.canh11 = function (S) {
  const c = 11;
  const a2 = C(c, 2), a3 = C(c, 3);
  const B = be(S, 960, 740, { rong: 420, cao: 440, a: C(c, 1) - 0.2, muc_dau: 0.75, muc: 0.75, vao: -1 });
  const V = [{ ten: 'tiền gửi', x: 840, mau: M.ckh, w: 70 }, { ten: 'giấy tờ có giá', x: 960, mau: M.gtcg, w: 30 }, { ten: 'đi vay', x: 1080, mau: M.vay, w: 30 }];
  S.ve2d.push((ctx, t) => {
    const op = hien(t, C(c, 1) - 0.2, S.t1 - 0.05);
    if (op <= 0) return;
    V.forEach((k, i) => {
      voi(ctx, k.x, 110, 230, k.w, k.mau, op);
      ctx.save(); ctx.globalAlpha = op;
      roi(ctx, t, { n: Math.ceil((S.t1 - S.t0 + 1) * (6 + k.w / 6)), a: S.t0 - 0.3, nhip: 6 + k.w / 6, tu: (j) => [k.x + (hash(j, i + 20) - 0.5) * k.w * 0.6, 232], den: (j) => [k.x + (hash(j, i + 22) - 0.5) * (k.w + 30), B.mat(0)], tan: true, r: 8, mau: () => k.mau });
      ctx.restore();
    });
    const o3 = hien(t, a3 - 0.1, S.t1 - 0.05);
    if (o3 > 0) {
      ctx.save(); ctx.globalAlpha = o3;
      ctx.strokeStyle = M.do; ctx.lineWidth = 6; ctx.setLineDash([16, 10]);
      ctx.beginPath(); ctx.moveTo(B.x0 - 40, B.yMuc(0.15)); ctx.lineTo(B.x1 + 40, B.yMuc(0.15)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(B.x0 - 40, B.yMuc(0.85 * 0.75)); ctx.lineTo(B.x1 + 40, B.yMuc(0.85 * 0.75)); ctx.stroke();
      ctx.setLineDash([]); ctx.lineWidth = 8; ctx.strokeStyle = M.ckh;
      ctx.beginPath(); ctx.arc(B.x0 - 230, 540, 50, 0, 6.2832); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(B.x0 - 230, 540); ctx.lineTo(B.x0 - 230 + 36 * Math.cos(t * 2), 540 + 36 * Math.sin(t * 2)); ctx.stroke();
      ctx.restore();
    }
  });
  giua(S, 'nhận tiền · trả lãi', 1520, 330, 620, 56, M.nhan, C(c, 1) + 0.2, a2 - 0.05, { dam: 800 });
  V.forEach((k, i) => giua(S, k.ten, [620, 960, 1300][i], 238, [300, 340, 300][i], 40, k.mau === M.gtcg ? M.gtcgChu : k.mau, TU(c, 2, k.ten) - 0.1, a3 - 0.05, { dam: 800, css: 'background:rgba(255,255,255,0.92);border-radius:10px;' }));
  dong(S, 'dự trữ', B.x1 + 60, B.yMuc(0.15) - 64, 300, 42, M.doChu, a3 + 0.2, null, { dam: 800 });
  dong(S, 'tỷ lệ cho vay', B.x1 + 60, B.yMuc(0.64) - 64, 360, 42, M.doChu, a3 + 0.4, null, { dam: 800 });
  giua(S, 'thời hạn', B.x0 - 230, 610, 300, 42, M.ckh, a3 + 0.6, null, { dam: 800 });
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

// ---------- seek ----------
let scaleNow = 1;
function seek(t) {
  t = Math.max(0, Math.min(DUR, t));
  const tr = `translate(${(5 * Math.sin(2 * Math.PI * t / 13) + 2 * Math.sin(2 * Math.PI * t / 4.7)).toFixed(2)}px,${(3 * Math.sin(2 * Math.PI * t / 17) + 2 * Math.sin(2 * Math.PI * t / 3.9 + 1.1)).toFixed(2)}px) scale(${(1 + 0.005 * (1 - Math.cos(2 * Math.PI * t / 11))).toFixed(5)})`;
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
  if (vet) vet.style.transform = `translate(${(60 * Math.sin(2 * Math.PI * t / 9)).toFixed(1)}px,${(40 * Math.sin(2 * Math.PI * t / 7 + 0.8)).toFixed(1)}px)`;
  phuDe.seek(t); logo.seek(t); ket.seek(t);
  phuDe.el.style.visibility = t >= KT - 0.05 ? 'hidden' : 'visible';
  quet.style.display = t >= KT ? 'block' : 'none';
  quetBang.style.transform = `translateX(${(((t - KT) * 130) % 2600).toFixed(1)}px) rotate(18deg)`;
  for (const s of phuDe.el.querySelectorAll('span')) if (s.style.opacity === '0.45') s.style.opacity = '0.65';
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
const FIXED = QS.has('t') ? parseFloat(QS.get('t')) : null;
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
