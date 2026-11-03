// canh.js — N301 Vốn lưu động ròng là gì (Net Working Capital - NWC)
// Chuẩn hình video ngang: mỗi chương một hình chính chuyển động theo số liệu, tối đa 12 từ trên hình.
// Không thẻ chữ dày, không bảng chữ nhỏ. Cỡ chữ nhãn >= 36px, số liệu >= 48px.
// KB-02 · CL-14 mô phỏng đồ họa hạt và bể chứa · BC-06 bảng kẻ lưới toàn khung · MAU-58 · NH09.
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
const eo = K.eo3, eio = K.eio, cl = K.cl, lerp = K.lerp;
const sv = (tag, a, cha) => K.svg(tag, a, cha);
const hm = (tag, a, cha, chu) => K.html(tag, a, cha, chu);
const DAI = { x: 100, y: 808, w: 1720, h: 84 };   // dải dưới: tiến độ và các chấm chương

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

// ---------- quản lý cảnh ----------
N.canh = [];
function taoCanh(c) {
  const ch = CH[c - 1];
  const root = hm('div', { class: 'canh', 'data-chuong': c }, stage);
  const cv = hm('canvas', { class: 'lop', width: 1920, height: 1080 }, root);
  const gS = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, root);
  const cv2 = hm('canvas', { class: 'lop', width: 1920, height: 1080 }, root);
  const gH = hm('div', { class: 'lop' }, root);
  const gT = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'pointer-events:none;' }, root);
  const S = {
    c, root, cv, ctx: cv.getContext('2d'), ctx2: cv2.getContext('2d'),
    svg: gS, html: gH, top: gT, t0: ch.t, t1: c === CH.length ? KT : ch.den,
    items: [], ves: [], ve2d: []
  };
  S.item = (el, a, b, o) => {
    o = o || {};
    S.items.push({
      el, a, b: b == null ? null : b, nobob: !!o.nobob, ph: S.items.length * 1.7,
      d: o.d == null ? 0.3 : o.d, dy: o.dy == null ? 0 : o.dy,
      svg: el instanceof SVGElement,
      base: o.base != null ? o.base : (el instanceof SVGElement ? (el.getAttribute('transform') || '') : '')
    });
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
  const dy = it.dy * (1 - eo((t - it.a) / 0.45)) + (it.nobob || DO_HINH ? 0 : 3.5 * Math.sin(6.2832 * t / 3.2 + it.ph));
  if (it.svg) {
    it.el.setAttribute('opacity', op.toFixed(3));
    it.el.setAttribute('transform', `${it.base} translate(0,${dy.toFixed(1)})`.trim());
  } else {
    it.el.style.opacity = op.toFixed(3);
    it.el.style.transform = `translateY(${dy.toFixed(1)}px)`;
  }
}

const hien = (t, a, b, d) => (t < a || (b != null && t >= b)) ? 0 : K.hienAn(t, a, b, d == null ? 0.3 : d);

// nhãn "ví dụ giả định" góc trên phải (kho nhan_gia_dinh)
function nhanGD(S, vao, het) {
  const n = K.nhan_gia_dinh({ bien_the: 'goc', chu: 'ví dụ giả định', co: 28, cach_tren: 34, cach_phai: 60, vao, mau: { the: M.the, chu_phu: M.chu, toi: false } });
  S.root.appendChild(n.el);
  const b = het != null ? het : S.t1 - 0.05;
  S.ves.push((t) => {
    n.seek(t);
    n.el.style.opacity = K.hienAn(t, vao, b, 0.3).toFixed(3);
    n.el.style.visibility = t >= vao && t < b ? 'visible' : 'hidden';
  });
}

// ---------- chữ lớn trực quan ----------
function dong(S, txt, x, y, w, co, mau, a, b, o) {
  o = o || {};
  co = Math.max(co || 40, 36);
  const e = hm('div', { class: 'dong', style: `left:${x}px;top:${y}px;width:${w}px;font-size:${co}px;line-height:1.15;color:${mau || M.chu};text-align:${o.can || 'left'};font-weight:${o.dam || 800};letter-spacing:0.5px;${o.css || ''}` }, S.html, txt);
  return S.item(e, a, b, Object.assign({ dy: 10 }, o));
}

const giua = (S, txt, cx, y, w, co, mau, a, b, o) => dong(S, txt, cx - w / 2, y, w, co, mau, a, b, Object.assign({ can: 'center' }, o || {}));

function hop(S, txt, cx, cy, w, h, co, vien, nen, mau, a, b, o) {
  o = o || {};
  co = Math.max(co || 44, 36);
  const e = hm('div', { class: 'hop', 'data-hop': '1', style: `left:${Math.round(cx - w / 2)}px;top:${Math.round(cy - h / 2)}px;width:${w}px;height:${h}px;font-size:${co}px;line-height:1.15;border:${o.net || 4}px ${o.dut ? 'dashed' : 'solid'} ${vien};background:${nen};color:${mau || M.chu};border-radius:${o.bo == null ? 16 : o.bo}px;font-weight:${o.dam || 800};white-space:nowrap;box-shadow:0 4px 16px rgba(0,0,0,0.06);${o.css || ''}` }, S.html, txt);
  return S.item(e, a, b, Object.assign({ dy: 10 }, o));
}

const tieuDe = (S, txt, a, b, o) => giua(S, txt, 960, 118, 1400, 56, (o && o.mau) || M.chu, a, b, Object.assign({ dam: 800 }, o || {}));

function soChay(S, x, y, w, co, mau, a, b, f, o) {
  const e = dong(S, f(a), x, y, w, Math.min(co || 36, 38), mau, a, b, Object.assign({ dam: 800, can: 'left' }, o || {}));
  S.ves.push((t) => { const s = f(t); if (e.textContent !== s) e.textContent = s; });
  return e;
}

// ---------- hình phẳng (SVG) ----------
function vat(S, x, y, s, a, b, o) {
  o = o || {};
  const ngoai = sv('g', { transform: `translate(${x},${y}) scale(${s})` }, o.top ? S.top : (o.cha || S.svg));
  const g = sv('g', {}, ngoai);
  if (o.pos) S.ves.push((t) => {
    const [px, py, ps, r] = o.pos(t);
    ngoai.setAttribute('transform', `translate(${px.toFixed(1)},${py.toFixed(1)}) scale(${(ps == null ? s : ps).toFixed(3)})${r ? ` rotate(${r.toFixed(2)})` : ''}`);
  });
  S.item(g, a, b, Object.assign({ nobob: true, d: 0.3, dy: 10 }, o));
  return g;
}

// bể chứa chất lỏng (kho binh_chua_muc_nuoc)
function be(S, cx, day, o) {
  const W = o.rong || 280, H = o.cao || 420;
  const b = K.binh_chua_muc_nuoc(Object.assign({ kieu: 'phang', rong: W, cao: H, nhan_muc: false, vach_chia: true, khoa_mau: 'nhan', canh_bao_vuot: false }, o));
  const g = vat(S, cx, day, 1, o.a, o.b, { dy: 0 });
  g.appendChild(b.el);
  S.ves.push((t) => b.seek(t));
  const yMuc = (u) => day - u * (H - 16);
  return { b, cx, day, W, H, x0: cx - W / 2, x1: cx + W / 2, top: day - H, mat: (t) => yMuc(b.mucTai(t)), yMuc };
}

// vẽ hạt tiền vàng / xanh
function cham(ctx, x, y, r, mau, vien) {
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fillStyle = mau; ctx.fill();
  if (vien) { ctx.lineWidth = 2.5; ctx.strokeStyle = vien; ctx.stroke(); }
}

function hcn(ctx, x, y, w, h, r, mau, vien, day) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (mau) { ctx.fillStyle = mau; ctx.fill(); }
  if (vien) { ctx.lineWidth = day || 3; ctx.strokeStyle = vien; ctx.stroke(); }
}

function voi(ctx, x, y0, y1, w, mau, op) {
  ctx.save(); ctx.globalAlpha = op;
  hcn(ctx, x - w / 2 - 6, -20, w + 12, y1 + 20, 6, K.rgba(mau, 0.28), mau, 4);
  hcn(ctx, x - w / 2 - 12, y1 - 16, w + 24, 18, 6, mau);
  ctx.restore();
}

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

// ---------- lớp cố định: bảng lưới, dải dưới ----------
let LOP;
function taoLop() {
  const root = hm('div', { class: 'lop', id: 'bang' }, stage);
  const g = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, root);
  for (let lx = 0; lx <= 1920; lx += 60) sv('line', { x1: lx, y1: 0, x2: lx, y2: 1080, stroke: lx % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': lx % 300 === 0 ? 2 : 1.2 }, g);
  for (let ly = 0; ly <= 1080; ly += 60) sv('line', { x1: 0, y1: ly, x2: 1920, y2: ly, stroke: ly % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': ly % 300 === 0 ? 2 : 1.2 }, g);
  sv('rect', { x: DAI.x, y: DAI.y, width: DAI.w, height: DAI.h, rx: 14, fill: M.the, stroke: M.nhat, 'stroke-width': 3 }, g);
  const cham = [];
  for (let i = 0; i < CH.length; i++) cham.push(sv('circle', { cx: 1480 + i * 30, cy: DAI.y + DAI.h / 2, r: 8, fill: M.the, stroke: M.phu, 'stroke-width': 3 }, g));
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
    ch.setAttribute('r', nay && !DO_HINH ? (10 + 2 * Math.sin(t * 3.5)).toFixed(2) : 8);
  });
}

// =========================================================================
// CHƯƠNG 1 · NGHỊCH LÝ CÓ LÃI NHƯNG CẠN TIỀN (0 – 31.8s)
// =========================================================================
N.canh1 = function (S) {
  const c = 1;
  const a0 = C(c, 1) + 0.2;
  nhanGD(S, a0, S.t1 - 0.1);
  tieuDe(S, 'LÃI NHƯNG CẠN TIỀN?', a0, a0 + 3.8, { mau: M.chu });

  // Bình tiền mặt bên trái: mức nước rút dần về 0đ
  const B = be(S, 520, 740, { rong: 280, cao: 420, a: a0, muc_dau: 0.85, muc: 0.02, dai_vao: 18, vao: a0 + 2, khoa_mau: 'do' });
  hop(S, 'TIỀN MẶT: 0 ĐỒNG', 520, 260, 520, 72, 44, M.do, '#FEE2E2', M.do, C(c, 2), null);

  // Cột lợi nhuận bên phải: báo lãi +15 tỷ nhưng bị kẹt công nợ
  hop(S, 'BÁO LÃI: +15 TỶ', 1400, 260, 500, 72, 44, M.xanh, '#DCFCE7', M.xanh, C(c, 3), C(c, 4) - 0.1);
  hop(S, 'KẸT CÔNG NỢ', 1400, 680, 500, 74, 44, M.vang, '#FEF3C7', M.gtcgChu, C(c, 4), null);

  S.ve2d.push((ctx, t) => {
    const op = hien(t, a0, S.t1 - 0.05);
    voi(ctx, 1400, 40, 180, 40, M.vang, op);
    roi(ctx, t, {
      n: 60, a: a0 + 0.5, nhip: 4,
      tu: (i) => [1400 + (hash(i, 1) - 0.5) * 30, 180],
      den: (i) => [1400 + (hash(i, 2) - 0.5) * 260, 620],
      tan: false, r: 9, mau: () => M.vang
    });
    if (t > C(c, 2)) {
      ctx.save();
      ctx.strokeStyle = M.do; ctx.lineWidth = 4; ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -t * 40;
      ctx.beginPath(); ctx.moveTo(520, 720); ctx.lineTo(140, 720); ctx.stroke();
      ctx.restore();
    }
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.chu, a0, null, (t) => {
    const p = Math.max(0, 1 - (t - a0) / 16);
    return `Tiền mặt: ${(p * 10).toFixed(0)}đ`;
  });
};

// =========================================================================
// CHƯƠNG 2 · CẮT ĐÔI BẢNG CÂN ĐỐI KẾ TOÁN (31.8 – 73.4s)
// =========================================================================
N.canh2 = function (S) {
  const c = 2;
  const a = C(c, 1) - 0.2;
  nhanGD(S, a, S.t1 - 0.1);
  tieuDe(S, 'BẢNG CÂN ĐỐI', a, a + 1.2, { mau: M.chu });

  // Hai cột Tài sản và Nguồn vốn (100 đồng)
  hop(S, 'TÀI SẢN: 100đ', 540, 230, 520, 74, 46, M.nhan, M.the, M.nhan, a + 1.2, C(c, 2) - 0.1);
  hop(S, 'NGUỒN VỐN: 100đ', 1380, 230, 520, 74, 46, M.nhan, M.the, M.nhan, a + 1.4, C(c, 2) - 0.1);

  hop(S, 'Ngắn: 60đ', 540, 410, 480, 68, 42, M.nhan, '#E0F2FE', M.nhan, C(c, 2), null);
  hop(S, 'Dài: 40đ', 540, 630, 480, 68, 42, M.phu, '#F1F5F9', M.chu, C(c, 3), null);

  hop(S, 'Nợ ngắn: 40đ', 1380, 410, 480, 68, 42, M.do, '#FEE2E2', M.do, C(c, 4), null);
  hop(S, 'Vốn dài: 60đ', 1380, 630, 480, 68, 42, M.xanh, '#DCFCE7', M.xanh, C(c, 4) + 2, null);

  S.ve2d.push((ctx, t) => {
    ctx.save();
    ctx.strokeStyle = M.vang; ctx.lineWidth = 4; ctx.setLineDash([12, 8]);
    ctx.lineDashOffset = -t * 30;
    ctx.beginPath(); ctx.moveTo(760, 230); ctx.lineTo(1140, 230); ctx.stroke();
    ctx.strokeStyle = M.phu; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(720, 520); ctx.lineTo(1200, 520); ctx.stroke();
    ctx.restore();

    const a2 = C(c, 2);
    if (t > a2) {
      for (let i = 0; i < 16; i++) {
        const u = ((t * 0.8 + i * 0.2) % 1);
        const x = 540 + 140 * Math.cos(u * 6.2832);
        const y = 410 + 40 * Math.sin(u * 6.2832);
        cham(ctx, x, y, 7, M.nhan);
      }
    }
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.chu, a, null, () => '100đ = 100đ');
};

// =========================================================================
// CHƯƠNG 3 · HAI CÁCH TÍNH VỐN LƯU ĐỘNG RÒNG (73.4 – 112.0s)
// =========================================================================
N.canh3 = function (S) {
  const c = 3;
  const a = C(c, 1) - 0.2;
  nhanGD(S, a, S.t1 - 0.1);
  tieuDe(S, 'CÁCH TÍNH NWC', a, a + 3.5, { mau: M.chu });

  hop(S, 'TÀI SẢN NGẮN: 60đ', 440, 320, 500, 72, 44, M.nhan, '#E0F2FE', M.nhan, a + 0.3, C(c, 3) - 0.1);
  hop(S, 'NỢ NGẮN: 40đ', 440, 480, 500, 72, 44, M.do, '#FEE2E2', M.do, C(c, 2), C(c, 3) - 0.1);

  hop(S, 'NWC = +20 ĐỒNG', 1300, 380, 620, 110, 58, M.xanh, '#DCFCE7', M.xanh, C(c, 3), null, { dam: 900 });
  hop(S, 'DƯ THANH KHOẢN', 1300, 540, 540, 72, 44, M.xanh, M.the, M.xanh, C(c, 4), null);

  S.ve2d.push((ctx, t) => {
    if (t > C(c, 3)) {
      ctx.save();
      ctx.strokeStyle = M.xanh; ctx.lineWidth = 6; ctx.setLineDash([14, 10]);
      ctx.lineDashOffset = -t * 45;
      ctx.beginPath(); ctx.moveTo(680, 380); ctx.lineTo(1020, 380); ctx.stroke();
      ctx.restore();

      ctx.save();
      const r = 160 + 10 * Math.sin(t * 5);
      ctx.strokeStyle = K.rgba(M.xanh, 0.4); ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(1300, 380, r, 0, 6.2832); ctx.stroke();
      ctx.restore();
    }
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.xanh, C(c, 3), null, () => '60 − 40 = +20đ');
};

// =========================================================================
// CHƯƠNG 4 · ĐỆM AN TOÀN THANH KHOẢN (112.0 – 149.1s)
// =========================================================================
N.canh4 = function (S) {
  const c = 4;
  const a = C(c, 1) - 0.2;
  nhanGD(S, a, S.t1 - 0.1);
  tieuDe(S, 'ĐỆM THANH KHOẢN', a, a + 3.5, { mau: M.chu });

  const B = be(S, 960, 740, { rong: 340, cao: 440, a, muc_dau: 0.85, muc: 0.35, dai_vao: 8, vao: a + 1, khoa_mau: 'xanh' });

  hop(S, 'TRẢ NỢ 40đ', 420, 440, 480, 76, 46, M.do, '#FEE2E2', M.do, a + 1.2, C(c, 3) - 0.1);
  hop(S, 'DƯ 20 ĐỒNG', 1500, 440, 480, 76, 48, M.xanh, '#DCFCE7', M.xanh, C(c, 2), null);

  S.ve2d.push((ctx, t) => {
    const my = B.mat(t);
    ctx.save();
    ctx.fillStyle = K.rgba(M.xanh, 0.2);
    ctx.beginPath();
    ctx.arc(960, my, 80 + 12 * Math.sin(t * 4), 0, 6.2832);
    ctx.fill();
    ctx.restore();

    ctx.save();
    const dy = 5 * Math.sin(t * 3.5);
    hcn(ctx, B.x0 - 20, B.day + dy, B.W + 40, 24, 8, M.xanh);
    ctx.restore();
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.xanh, a, null, () => 'Đệm an toàn: +20đ');
};

// =========================================================================
// CHƯƠNG 5 · CẠM BẪY LẤY NGẮN NUÔI DÀI (149.1 – 195.2s)
// =========================================================================
N.canh5 = function (S) {
  const c = 5;
  const a = C(c, 1) - 0.2;
  nhanGD(S, a, S.t1 - 0.1);
  tieuDe(S, 'LẤY NGẮN NUÔI DÀI', a, a + 3.5, { mau: M.do });

  hop(S, 'NỢ NGẮN: 70đ', 500, 280, 480, 76, 46, M.do, '#FEE2E2', M.do, a + 0.5, C(c, 3) - 0.1);

  hop(S, 'NWC = −10 ĐỒNG', 1420, 280, 540, 84, 54, M.do, '#FEE2E2', M.do, C(c, 3), null, { dam: 900 });
  hop(S, 'NGUY CƠ VỠ NỢ', 1420, 420, 500, 74, 46, M.do, M.the, M.do, C(c, 4), null);

  const h = K.nha_xuong({ loai: 'nha_xuong', co: 0.8, nhan: '', vao: a + 0.2 });
  const g = vat(S, 960, 680, 1, a + 0.2, null, { dy: 0 });
  g.appendChild(h.el);
  S.ves.push((t) => h.seek(t));

  S.ve2d.push((ctx, t) => {
    if (t > C(c, 3)) {
      ctx.save();
      const r = 160 + 18 * Math.sin(t * 8);
      ctx.strokeStyle = K.rgba(M.do, 0.45); ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(1420, 280, r, 0, 6.2832); ctx.stroke();
      ctx.restore();
    }
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.do, a, null, () => 'Báo động: NWC âm');
};

// =========================================================================
// CHƯƠNG 6 · PHÂN BIỆT NWC VÀ WCR (195.2 – 227.7s)
// =========================================================================
N.canh6 = function (S) {
  const c = 6;
  const a = C(c, 1) - 0.2;
  nhanGD(S, a, S.t1 - 0.1);
  tieuDe(S, 'NWC VÀ WCR', a, a + 3.5, { mau: M.chu });

  hop(S, 'NWC: VỐN SẴN CÓ', 520, 280, 500, 76, 44, M.xanh, '#DCFCE7', M.xanh, a + 0.3, C(c, 3) - 0.1);
  hop(S, 'WCR: VỐN CẦN', 1400, 280, 500, 76, 44, M.nhan, '#E0F2FE', M.nhan, C(c, 2), null);

  hop(S, 'CHU KỲ KINH DOANH', 960, 680, 520, 74, 44, M.chu, M.the, M.chu, C(c, 3), null);

  S.ve2d.push((ctx, t) => {
    const cx = 960, cy = 500, rx = 280, ry = 90;
    ctx.save();
    ctx.strokeStyle = M.luoi2; ctx.lineWidth = 3; ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.2832); ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const u = ((t * 0.4 + i / 8) % 1);
      const x = cx + rx * Math.cos(u * 6.2832);
      const y = cy + ry * Math.sin(u * 6.2832);
      cham(ctx, x, y, 9, M.vang, '#B45309');
    }
    ctx.restore();
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.chu, a, null, () => 'NWC vs WCR');
};

// =========================================================================
// CHƯƠNG 7 · NGÂN HÀNG THẨM ĐỊNH NWC (227.7 – 272.9s)
// =========================================================================
N.canh7 = function (S) {
  const c = 7;
  const a = C(c, 1) - 0.2;
  nhanGD(S, a, S.t1 - 0.1);
  tieuDe(S, 'THẨM ĐỊNH TÍN DỤNG', a, a + 3.5, { mau: M.chu });

  const nh = K.toa_nha_ngan_hang({ loai: 'tru_so', nhan: '', co: 0.8, vao: a + 0.2 });
  const g = vat(S, 960, 680, 1, a + 0.2, null, { dy: 0 });
  g.appendChild(nh.el);
  S.ves.push((t) => nh.seek(t));

  hop(S, 'NWC > 0 : DUYỆT VAY', 440, 360, 540, 76, 44, M.xanh, '#DCFCE7', M.xanh, a + 1, C(c, 4) - 0.1);
  hop(S, 'NWC < 0 : CẢNH BÁO', 1480, 360, 540, 76, 44, M.do, '#FEE2E2', M.do, C(c, 4), null);

  S.ve2d.push((ctx, t) => {
    if (t > a + 1.2 && t < C(c, 4)) {
      for (let i = 0; i < 10; i++) {
        const u = ((t * 0.9 + i * 0.1) % 1);
        const x = lerp(960, 300, u);
        const y = 480 - 80 * Math.sin(Math.PI * u);
        cham(ctx, x, y, 8, M.xanh);
      }
    }
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.chu, a, null, () => 'Tiêu chí xét vay');
};

// =========================================================================
// CHƯƠNG 8 · BA NGUYÊN TẮC VÀNG VÀ TỔNG KẾT (272.9 – 308.0s)
// =========================================================================
N.canh8 = function (S) {
  const c = 8;
  const a = C(c, 1) - 0.2;
  nhanGD(S, a, KT - 0.1);
  tieuDe(S, 'BA NGUYÊN TẮC', a, a + 2.0, { mau: M.chu });

  hop(S, '1. CÂN ĐỐI KỲ HẠN', 420, 360, 500, 74, 44, M.nhan, '#E0F2FE', M.nhan, a + 2.2, a + 6);
  hop(S, '2. THU HỒI NỢ', 960, 360, 500, 74, 44, M.vang, '#FEF3C7', M.gtcgChu, a + 6, a + 11);
  hop(S, '3. ĐỆM NWC AN TOÀN', 1500, 360, 540, 74, 44, M.xanh, '#DCFCE7', M.xanh, a + 11, KT);

  S.ve2d.push((ctx, t) => {
    if (t >= KT) return;
    const ang = 0.08 * Math.sin(t * 2.5);
    ctx.save();
    ctx.translate(960, 560);
    ctx.rotate(ang);
    ctx.strokeStyle = M.phu; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-320, 0); ctx.lineTo(320, 0); ctx.stroke();
    cham(ctx, -320, 20, 18, M.nhan);
    cham(ctx, 320, 20, 18, M.xanh);
    ctx.restore();
  });

  soChay(S, 140, DAI.y + 24, 600, 36, M.chu, a, KT, () => 'Dòng tiền bền vững');
};

// =========================================================================
// PHỤ ĐỀ, LOGO, MÀN HÌNH KẾT
// =========================================================================
let phuDe, logo, ket;
function taoPhuDe() {
  const chp = CH.map((c) => Object.assign({}, c, { cau: c.cau.slice() }));
  chp[chp.length - 1].cau.pop();
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
}

// =========================================================================
// HÀM SEEK(T) — TÍNH TOÁN THEO THỜI GIAN
// =========================================================================
let scaleNow = 1;
// Máy đo hình (scripts/do_chat_luong_hinh.mjs) đặt window.__do_hinh = true trước khi nạp trang: tắt lắc khung hình, nhãn nhấp nhô,
// nền trôi và chấm chương phập phồng, để chỉ đo chuyển động của chính hình. Xuất video không đặt cờ này nên không đổi gì.
const DO_HINH = window.__do_hinh === true;
window.__ho_tro_do_hinh = true;
function seek(t) {
  t = Math.max(0, Math.min(DUR, t));
  const tr = DO_HINH ? '' : `translate(${(4 * Math.sin(2 * Math.PI * t / 13) + 2 * Math.sin(2 * Math.PI * t / 4.7)).toFixed(2)}px,${(3 * Math.sin(2 * Math.PI * t / 17) + 2 * Math.sin(2 * Math.PI * t / 3.9 + 1.1)).toFixed(2)}px) scale(${(1 + 0.005 * (1 - Math.cos(2 * Math.PI * t / 11))).toFixed(5)})`;
  veLop(t, tr);

  for (let c = 1; c <= CH.length; c++) {
    const S = N.canh[c];
    if (!S) continue;
    const a = c === 1 ? -1 : CH[c - 1].t - 0.3;
    const b = c === CH.length ? KT : CH[c].t - 0.3 + 0.001;
    const on = t >= a && t < b;
    S.root.style.display = on ? 'block' : 'none';
    if (on) {
      S.root.style.transformOrigin = '960px 450px';
      S.root.style.transform = tr;
      for (const it of S.items) veItem(it, S, t);
      for (const f of S.ves) f(t);
      S.ctx.clearRect(0, 0, 1920, 1080);
      S.ctx2.clearRect(0, 0, 1920, 1080);
      for (const f of S.ve2d) { S.ctx2.save(); f(S.ctx2, t); S.ctx2.restore(); }
    }
  }

  phuDe.seek(t); logo.seek(t); ket.seek(t);
  phuDe.el.style.visibility = t >= KT - 0.05 ? 'hidden' : 'visible';
}

window.seek = seek;
N.seek = seek;

// =========================================================================
// TỰ KIỂM CHẤT LƯỢNG (kiemTra, demTu, chuHienThi)
// =========================================================================
function doMo(el) {
  let m = 1;
  for (let e = el; e && e !== stage.parentElement; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none') return 0;
    m *= parseFloat(s.opacity || 1);
  }
  return m;
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

window.demTu = function (t) { if (t != null) seek(t); return demTu(); };

window.kiemTra = function (t) {
  seek(t);
  const loi = [];
  for (const l of K.kiemChu(stage, { tl: scaleNow })) {
    if (l.loai !== 'chu_de_chu' && !(l.loai === 'tran_khung' && /^[₫$%?≠=><−+]$/.test(l.chu || ''))) loi.push(l);
  }
  const gr = stage.getBoundingClientRect();
  const ds = chuNodes();
  for (const { n, chu, r } of ds) {
    const el = n.parentElement;
    const co = parseFloat(getComputedStyle(el).fontSize);
    if (co < 25.5 && !el.closest('.kho-nhan-gia-dinh') && !el.closest('[data-kho-kenh]')) {
      loi.push({ loai: 'chu_nho', chu: chu.slice(0, 30), co });
    }
    const day = (r.bottom - gr.top) / scaleNow;
    if (!el.closest('.kho-phu-de') && !el.closest('[data-kho-kenh]') && day > 895) {
      loi.push({ loai: 'chu_vao_dai_phu_de', chu: chu.slice(0, 30), day: Math.round(day) });
    }
  }
  const dt = demTu();
  if (dt.so > 12) loi.push({ loai: 'qua_12_tu', so: dt.so, chu: dt.chu.join(' | ') });
  return loi;
};

// =========================================================================
// KHỞI ĐỘNG
// =========================================================================
function fit() {
  scaleNow = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `scale(${scaleNow})`;
}

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
  fit();
  window.addEventListener('resize', fit);
  taoLop();
  for (let c = 1; c <= CH.length; c++) {
    taoCanh(c);
    if (N[`canh${c}`]) N[`canh${c}`](N.canh[c]);
  }
  taoPhuDe();
  taoLogoKet();
  seek(FIXED != null ? FIXED : 0);
  window.__san_sang = true;
  t0 = performance.now();
  requestAnimationFrame(tick);
};

})();
