// canh.js — N303 Tài sản ngắn hạn là gì (4 chương, ~1 phút ngang 1920x1080)
// KB-02 · CL-05 đồ thị và thanh số liệu SVG/Canvas · CT1 · BC-07 chia đôi đối chiếu · MAU-33 (nền sáng #F4F8F7, không tên/logo ngân hàng) · NH06.
// Tuân thủ chuẩn hình video ngang bản 2 (03/11/2026):
// - Mỗi chương vẽ đúng đại lượng trong câu cơ chế (nhip.json); không dùng bể/vòi/hạt mẫu cũ, không biểu tượng trang trí.
// - Chuyển động là sự thay đổi của chính đại lượng đang nói (cột dâng/hạ, thanh thời gian kéo tới mốc 12 tháng, ngăn bị khóa, cầu lọc dòng tiền).
// - Chữ trên hình <= 12 từ cùng lúc (ngoài phụ đề và nhãn giả định); cỡ chữ >= 36 px; tương phản >= 4,5:1.
(function () {
'use strict';
const K = window.KHO;
const N = (window.N = {});
const stage = document.getElementById('stage');
K.datMau('MAU-33');
const M = {
  nen: '#F4F8F7',
  luoi: '#DFECE9',
  luoi2: '#C5DBD7',
  the: '#FFFFFF',
  chu: '#08242A',
  chu2: '#2C4E55',
  nhan: '#005A57',      // xanh cổ vịt đậm (tương phản > 7:1 trên nền trắng/sáng)
  nhanNhat: '#DCF0EE',
  xanh: '#145E3D',      // xanh lá đậm cho tiền mặt / thực thu (> 7:1)
  xanhNhat: '#E2F5EB',
  vang: '#7D4300',      // vàng hổ phách đậm cho phải thu / dài hạn (> 6.5:1 trên nền #FFF4DE)
  vangNen: '#FFF4DE',
  cam: '#8F2D09',       // cam đất đậm cho tồn kho (> 6.5:1 trên nền #FFF0E8)
  camNen: '#FFF0E8',
  do: '#8E1912',        // đỏ đậm cho nợ đến hạn / thiếu hụt (> 6.5:1 trên nền #FFECEB)
  doNen: '#FFECEB',
  xam: '#3F5056',       // xám đậm cho khoản bị đóng băng
  xamNen: '#E4EAEB',
  viền: '#9AB5B0',
  phu: '#4E6E74',
  nhat: '#C5DBD7',
};
const TG = JSON.parse(document.getElementById('thoi_gian').textContent);
const CH = TG.chuong, DUR = TG.thoi_luong_giay, KT = TG.man_hinh_ket.t;
const C = (c, i) => CH[c - 1].cau[i - 1].t;
const E = (c, i) => CH[c - 1].cau[i - 1].den;
const eo = K.eo3, eio = K.eio, cl = K.cl, lerp = K.lerp;
const sv = (tag, a, cha) => K.svg(tag, a, cha);
const hm = (tag, a, cha, chu) => K.html(tag, a, cha, chu);
const KHUNG_MIEN = [];

// Máy đo hình đặt window.__do_hinh = true trước khi nạp trang
const DO_HINH = window.__do_hinh === true;
window.__ho_tro_do_hinh = true;

// ---------- khung cảnh ----------
N.canh = [];
function taoCanh(c) {
  const ch = CH[c - 1];
  const root = hm('div', { class: 'canh', 'data-chuong': c }, stage);
  const cv = hm('canvas', { class: 'lop', width: 1920, height: 1080 }, root);
  const gS = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, root);
  const cv2 = hm('canvas', { class: 'lop', width: 1920, height: 1080 }, root);
  const gH = hm('div', { class: 'lop' }, root);
  const gT = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080', style: 'pointer-events:none;' }, root);
  const S = { c, root, cv, ctx: cv.getContext('2d'), ctx2: cv2.getContext('2d'), svg: gS, html: gH, top: gT, t0: ch.t, t1: c === CH.length ? KT : ch.den, items: [], ves: [], ve2d: [] };
  S.item = (el, a, b, o) => {
    o = o || {};
    S.items.push({ el, a, b: b == null ? null : b, nobob: true, ph: S.items.length * 1.7, d: o.d == null ? 0.25 : o.d, dy: o.dy == null ? 0 : o.dy,
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
  const dy = it.dy * (1 - eo((t - it.a) / 0.4));
  if (it.svg) {
    it.el.setAttribute('opacity', op.toFixed(3));
    it.el.setAttribute('transform', `${it.base} translate(0,${dy.toFixed(1)})`.trim());
  } else {
    it.el.style.opacity = op.toFixed(3);
    it.el.style.transform = `translateY(${dy.toFixed(1)}px)`;
  }
}
const hien = (t, a, b, d) => (t < a || (b != null && t >= b)) ? 0 : K.hienAn(t, a, b, d == null ? 0.25 : d);
const tienDo = (t, a, b) => cl((t - a) / Math.max(0.01, b - a));

function nhanGD(S, vao, het) {
  const n = K.nhan_gia_dinh({ bien_the: 'goc', chu: 'ví dụ giả định', co: 28, cach_tren: 34, cach_phai: 60, vao, mau: { the: M.the, chu_phu: M.chu, toi: false } });
  S.root.appendChild(n.el);
  const b = het != null ? het : S.t1 - 0.05;
  S.ves.push((t) => { n.seek(t); n.el.style.opacity = K.hienAn(t, vao, b, 0.25).toFixed(3); n.el.style.visibility = t >= vao && t < b ? 'visible' : 'hidden'; });
}

function dong(S, txt, x, y, w, co, mau, a, b, o) {
  o = o || {};
  if (o.vua) { const r = K.doChu(txt, co, o.dam || 700); if (r > w - 6) co = Math.max(o.coMin || 34, Math.floor(co * (w - 6) / r)); }
  const e = hm('div', { class: 'dong', style: `left:${x}px;top:${y}px;width:${w}px;font-size:${co}px;color:${mau || M.chu};text-align:${o.can || 'left'};font-weight:${o.dam || 800};line-height:1.16;${o.css || ''}` }, S.html, txt);
  return S.item(e, a, b, Object.assign({ dy: 8 }, o));
}
const giua = (S, txt, cx, y, w, co, mau, a, b, o) => dong(S, txt, Math.round(cx - w / 2), y, w, co, mau, a, b, Object.assign({ can: 'center', vua: true }, o || {}));
function soChay(S, cx, y, w, co, mau, a, b, f, o) {
  const e = giua(S, f(a), cx, y, w, co, mau, a, b, Object.assign({ dam: 800 }, o || {}));
  S.ves.push((t) => { const s = f(t); if (e.textContent !== s) e.textContent = s; });
  return e;
}

function hcn(ctx, x, y, w, h, r, mau, vien, day) {
  if (w <= 0 || h <= 0) return;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(r, w / 2, h / 2));
  if (mau) { ctx.fillStyle = mau; ctx.fill(); }
  if (vien) { ctx.lineWidth = day || 3.5; ctx.strokeStyle = vien; ctx.stroke(); }
}
function muiNgang(ctx, x0, x1, y, mau, day) {
  if (Math.abs(x1 - x0) < 6) return;
  const dir = x1 >= x0 ? 1 : -1;
  ctx.save();
  ctx.strokeStyle = mau; ctx.fillStyle = mau; ctx.lineWidth = day || 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - dir * 16, y - 10); ctx.lineTo(x1 - dir * 16, y + 10); ctx.closePath(); ctx.fill();
  ctx.restore();
}

// ---------- lớp cố định: bảng lưới ----------
let LOP;
function taoLop() {
  const root = hm('div', { class: 'lop', id: 'bang' }, stage);
  const g = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, root);
  for (let x = 0; x <= 1920; x += 60) sv('line', { x1: x, y1: 0, x2: x, y2: 1080, stroke: x % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': x % 300 === 0 ? 2 : 1.2 }, g);
  for (let y = 0; y <= 1080; y += 60) sv('line', { x1: 0, y1: y, x2: 1920, y2: y, stroke: y % 300 === 0 ? M.luoi2 : M.luoi, 'stroke-width': y % 300 === 0 ? 2 : 1.2 }, g);
  LOP = { root };
}
function veLop(t, tr) {
  LOP.root.style.transformOrigin = '960px 450px';
  LOP.root.style.transform = tr;
  const op = 1 - eo(cl((t - (KT - 0.35)) / 0.3));
  LOP.root.style.opacity = op.toFixed(3);
  LOP.root.style.visibility = op <= 0.002 ? 'hidden' : 'visible';
}

// ======================= Chương 1 · Định nghĩa tài sản ngắn hạn và mốc 12 tháng =======================
// Câu cơ chế: Tổng tài sản 100 tỷ đồng đặt trên trục thời gian có vạch ranh giới 12 tháng:
// phần thu hồi trong vòng 12 tháng là tài sản ngắn hạn 60 tỷ đồng, phần thu hồi trên 12 tháng là tài sản dài hạn 40 tỷ đồng.
N.canh1 = function (S) {
  const c = 1;
  const t1 = C(c, 1), e1 = E(c, 1); // 1.20 - 7.06s: 60 tỷ tài sản ngắn hạn vs 25 tỷ nợ đến hạn
  const t2 = C(c, 2), e2 = E(c, 2); // 7.31 - 17.56s: VAS 21 & TT 99/2025, trục thời gian chu kỳ kinh doanh / 12 tháng
  const t3 = C(c, 3), e3 = E(c, 3); // 17.81 - 26.19s: Tổng tài sản 100 tỷ tách thành 60 tỷ (<=12 tháng) và 40 tỷ (>12 tháng)
  nhanGD(S, 0.4, S.t1 - 0.05);

  S.ve2d.push((ctx, t) => {
    // Giai đoạn câu 1 (0 -> t2): Đối chiếu cột Tài sản ngắn hạn 60 tỷ và Nợ đến hạn 25 tỷ
    if (t < t2) {
      const p60 = eio(tienDo(t, 0.3, 3.6));
      const p25 = eio(tienDo(t, 2.2, 5.8));
      const pMui = eio(tienDo(t, 3.8, e1 - 0.4));
      const dayY = 720, maxH = 460;
      const h60 = maxH * Math.max(0.38, p60);
      const h25 = (maxH * 25 / 60) * Math.max(0.45, p25);

      // Đường đáy gióng chung
      ctx.save();
      ctx.strokeStyle = M.nhat; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(280, dayY + 3); ctx.lineTo(1640, dayY + 3); ctx.stroke();
      ctx.restore();

      // Cột trái: Tài sản ngắn hạn 60 tỷ
      hcn(ctx, 380, dayY - h60, 360, h60, 18, M.nhanNhat, M.nhan, 5);

      // Cột phải: Nợ đến hạn 25 tỷ
      if (p25 > 0.01) {
        hcn(ctx, 1180, dayY - h25, 360, h25, 18, M.doNen, M.do, 5);
      }

      // Mũi tên đối chiếu khả năng trả nợ giữa 2 cột
      if (pMui > 0.02) {
        const wMui = 380 * pMui;
        muiNgang(ctx, 770, 770 + wMui, dayY - 120, M.do, 6);
      }
      return;
    }

    // Giai đoạn câu 2 & câu 3 (t2 -> hết chương 1):
    // Trục thời gian 12 tháng (x: 360 -> 1720 ở câu 3, x: 240 -> 1700 ở câu 2), vạch ranh giới Mốc 12 tháng tại x = 1140.
    const xTruc0 = t < t3 ? 240 : 370, xMoc12 = 1140, xTruc1 = 1720, yTruc = 665;
    const pTruc = eio(tienDo(t, t2, t2 + 2.8));
    const pThanhNgan = eio(tienDo(t, t2 + 0.8, e2 - 0.8)); // giãn liên tục suốt câu 2

    // Trục thời gian ngang & vạch ranh giới 12 tháng (không vẽ mảng nền mờ không nhãn)
    const wTrucHien = (xTruc1 - xTruc0) * Math.max(0.25, pTruc);
    muiNgang(ctx, xTruc0, xTruc0 + wTrucHien, yTruc, M.chu, 6);
    if (pTruc > 0.25) {
      ctx.save();
      ctx.strokeStyle = M.do; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(xMoc12, 195); ctx.lineTo(xMoc12, yTruc + 20); ctx.stroke();
      ctx.restore();
    }

    if (t < t3) {
      // Câu 2: Thanh Ngắn hạn ≤ 12 tháng nằm trọn bên trái vạch Mốc 12 tháng, chữ nằm chính giữa thanh
      const wNganFull = xMoc12 - xTruc0 - 20;
      const wNganHan = wNganFull * lerp(0.68, 1, pThanhNgan);
      hcn(ctx, xTruc0 + 8, 330, wNganHan, 180, 18, M.nhanNhat, M.nhan, 5);
    } else {
      // Câu 3: Khối Tổng 100 tỷ ở bên trái (x: 130..320, y: 245..605) nối bằng ngoặc nhọn sang 2 thanh Ngắn hạn 60 tỷ và Dài hạn 40 tỷ
      const p40 = eio(tienDo(t, t3 + 0.2, e3 - 1.0));
      hcn(ctx, 130, 245, 190, 360, 18, M.the, M.chu, 4.5);

      // Ngoặc tách từ khối 100 tỷ sang 2 thanh 60 tỷ và 40 tỷ
      ctx.save();
      ctx.strokeStyle = M.chu; ctx.lineWidth = 4.5; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(324, 425); ctx.lineTo(352, 425);
      ctx.moveTo(352, 325); ctx.lineTo(352, 530);
      ctx.moveTo(352, 325); ctx.lineTo(378, 325);
      ctx.moveTo(352, 530); ctx.lineTo(378, 530);
      ctx.stroke();
      ctx.restore();

      // Thanh trên: Ngắn hạn 60 tỷ (nằm gọn trước vạch 12 tháng: x = 380..1128)
      const w60 = 1128 - 380;
      hcn(ctx, 380, 245, w60, 160, 18, M.nhanNhat, M.nhan, 5);

      // Thanh dưới: Dài hạn 40 tỷ (kéo vượt qua vạch 12 tháng tới x = 1690)
      const w40Full = 1690 - 380;
      const w40 = w40Full * lerp(0.54, 1, p40);
      hcn(ctx, 380, 450, w40, 155, 18, M.vangNen, M.vang, 5);
    }
  });

  // Nhãn câu 1 (0.4 -> t2 - 0.08): 11 từ
  giua(S, 'Tài sản ngắn hạn', 560, 195, 400, 42, M.nhan, 0.4, t2 - 0.08, { dam: 800 });
  soChay(S, 560, 585, 320, 66, M.nhan, 0.4, t2 - 0.08, (t) => `${Math.round(60 * eio(tienDo(t, 0.3, 3.6)))} tỷ`);
  giua(S, 'Nợ đến hạn', 1360, 455, 360, 42, M.do, 2.2, t2 - 0.08, { dam: 800 });
  soChay(S, 1360, 595, 320, 62, M.do, 2.2, t2 - 0.08, (t) => `${Math.round(25 * eio(tienDo(t, 2.2, 5.8)))} tỷ`);
  giua(S, '?', 960, 530, 120, 56, M.do, 3.9, t2 - 0.08, { dam: 800 });

  // Nhãn câu 2 (t2 -> t3 - 0.08): 4 + 3 + 5 = 12 từ, khớp chính xác du_kien.json ("Thông tư 99/2025 · VAS 21")
  giua(S, 'Ngắn hạn ≤ 12 tháng', 560, 392, 560, 46, M.nhan, t2 + 0.8, t3 - 0.08, { dam: 800 });
  giua(S, 'Mốc 12 tháng', 1140, 132, 360, 42, M.do, t2 + 0.6, t3 - 0.08, { dam: 800 });
  dong(S, 'Thông tư 99/2025 · VAS 21', 240, 725, 680, 38, M.chu, t2 + 0.4, t3 - 0.08, { dam: 800, css: 'white-space:nowrap;' });

  // Nhãn câu 3 (t3 -> hết chương 1): 2 + 2 + 4 + 4 = 12 từ
  giua(S, '100 tỷ', 225, 396, 175, 46, M.chu, t3 + 0.1, S.t1 - 0.05, { dam: 800 });
  giua(S, '12 tháng', 1140, 132, 300, 42, M.do, t3 + 0.1, S.t1 - 0.05, { dam: 800 });
  soChay(S, 754, 298, 620, 50, M.nhan, t3 + 0.1, S.t1 - 0.05, (t) => `Ngắn hạn ${Math.round(60 * eio(tienDo(t, t3, t3 + 1.4)))} tỷ`);
  soChay(S, 730, 500, 560, 50, M.vang, t3 + 0.2, S.t1 - 0.05, (t) => `Dài hạn ${Math.round(40 * eio(tienDo(t, t3 + 0.2, e3 - 1.0)))} tỷ`);
};

// ======================= Chương 2 · Ba nhóm tài sản ngắn hạn theo độ thanh khoản (26.89 – 44.64s) =======================
// Câu cơ chế: Tài sản ngắn hạn 60 tỷ đồng chia thành 3 nhóm xếp theo độ thanh khoản (tốc độ đổi thành tiền) giảm dần từ cao xuống thấp:
// Tiền 10 tỷ đồng ở bậc thanh khoản cao nhất, Phải thu 20 tỷ đồng ở bậc giữa, Tồn kho 30 tỷ đồng có quy mô lớn nhất nhưng ở bậc thanh khoản thấp nhất (chậm nhất).
N.canh2 = function (S) {
  const c = 2;
  const t1 = C(c, 1), e1 = E(c, 1); // 27.39 - 31.83s: 60 tỷ chia 3 nhóm theo tốc độ đổi thành tiền giảm dần
  const t2 = C(c, 2), e2 = E(c, 2); // 32.08 - 35.42s: Tiền 10 tỷ (bậc thanh khoản cao nhất)
  const t3 = C(c, 3), e3 = E(c, 3); // 35.67 - 39.46s: Phải thu 20 tỷ (bậc giữa)
  const t4 = C(c, 4), e4 = E(c, 4); // 39.71 - 43.94s: Tồn kho 30 tỷ (quy mô rộng nhất nhưng bậc thanh khoản thấp nhất - Chậm)
  nhanGD(S, t1 - 0.2, S.t1 - 0.05);

  function muiDocXuong(ctx, x0, y0, x1, y1, mau) {
    ctx.save();
    ctx.strokeStyle = mau; ctx.fillStyle = mau; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    const ang = Math.atan2(y1 - y0, x1 - x0);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 18 * Math.cos(ang - 0.5), y1 - 18 * Math.sin(ang - 0.5));
    ctx.lineTo(x1 - 18 * Math.cos(ang + 0.5), y1 - 18 * Math.sin(ang + 0.5));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  S.ve2d.push((ctx, t) => {
    // Ở câu 1: Thanh 60 tỷ chia 3 phần (Tiền | Phải thu | Tồn kho) ở trên, bên dưới là mũi tên dốc xuống "Thanh khoản giảm dần"
    if (t < t2) {
      const pBar = eio(tienDo(t, S.t0 + 0.15, e1 - 0.5));
      const x0 = 330, yBar = 230, hBar = 135, wAll = 1380 * lerp(0.55, 1, pBar);
      const gap = 14;
      const w1 = wAll * (10 / 60), w2 = wAll * (20 / 60), w3 = wAll * (30 / 60);

      // Khối 60 tỷ bên trái nối ngoặc vào thanh 3 đoạn
      hcn(ctx, 130, yBar, 175, hBar, 16, M.the, M.nhan, 4.5);
      hcn(ctx, x0, yBar, Math.max(40, w1 - gap), hBar, 16, M.xanhNhat, M.xanh, 5);
      hcn(ctx, x0 + w1 + gap * 0.5, yBar, Math.max(60, w2 - gap), hBar, 16, M.vangNen, M.vang, 5);
      hcn(ctx, x0 + w1 + w2 + gap, yBar, Math.max(80, w3 - gap), hBar, 16, M.camNen, M.cam, 5);

      // Đường dốc bậc thang biểu diễn độ thanh khoản giảm dần từ trái sang phải
      const xEnd = lerp(650, 1680, pBar), yEnd = lerp(490, 620, pBar);
      muiDocXuong(ctx, 340, 450, xEnd, yEnd, M.nhan);
      return;
    }

    // Câu 2, 3, 4: Bậc thang thanh khoản hạ dần từ trái sang phải (chiều cao = độ thanh khoản giảm dần; bề rộng = quy mô 10 : 20 : 30 tỷ)
    const yDay = 690;
    ctx.save();
    ctx.strokeStyle = M.nhat; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(160, yDay + 3); ctx.lineTo(1760, yDay + 3); ctx.stroke();
    ctx.restore();

    const steps = [
      // Bậc 1 (Tiền 10 tỷ): bề rộng 300px (tỉ lệ 10), chiều cao thanh khoản cao nhất 420px
      { x: 190, w: 300, h: 420, mau: M.xanh, nen: M.xanhNhat, p: eio(tienDo(t, t2, e2 - 0.4)) },
      // Bậc 2 (Phải thu 20 tỷ): bề rộng 450px (tỉ lệ 20), chiều cao thanh khoản hạ xuống 280px
      { x: 580, w: 450, h: 280, mau: M.vang, nen: M.vangNen, p: eio(tienDo(t, t3, e3 - 0.4)) },
      // Bậc 3 (Tồn kho 30 tỷ): bề rộng 600px (tỉ lệ 30), chiều cao thanh khoản thấp nhất 150px
      { x: 1120, w: 600, h: 150, mau: M.cam, nen: M.camNen, p: eio(tienDo(t, t4, e4 - 0.5)) },
    ];

    steps.forEach((st) => {
      if (st.p <= 0.01) return;
      const hCur = st.h * lerp(0.45, 1, st.p);
      hcn(ctx, st.x, yDay - hCur, st.w, hCur, 18, st.nen, st.mau, 5);
    });

    // Mũi tên dốc xuống nối đỉnh 3 bậc thang thể hiện tốc độ đổi thành tiền giảm dần từ Tiền -> Phải thu -> Tồn kho
    const pSlope = eio(tienDo(t, t2 + 0.2, e4 - 0.5));
    const xTip = lerp(520, 1420, pSlope);
    const yTip = lerp(240, 495, pSlope);
    muiDocXuong(ctx, 340, 215, xTip, yTip, M.nhan);
  });

  // Nhãn Câu 1 (t0 -> t2 - 0.08): 2 + 1 + 2 + 2 + 4 = 11 từ (mọi hộp đều có tên khoản mục, mũi tên dốc xuống có nhãn rõ chiều)
  giua(S, '60 tỷ', 218, 270, 165, 44, M.nhan, S.t0 + 0.15, t2 - 0.08, { dam: 800 });
  giua(S, 'Tiền', 435, 272, 200, 42, M.xanh, S.t0 + 0.2, t2 - 0.08, { dam: 800 });
  giua(S, 'Phải thu', 785, 272, 320, 42, M.vang, S.t0 + 0.3, t2 - 0.08, { dam: 800 });
  giua(S, 'Tồn kho', 1360, 272, 360, 42, M.cam, S.t0 + 0.4, t2 - 0.08, { dam: 800 });
  giua(S, 'Thanh khoản giảm dần', 980, 445, 640, 44, M.nhan, S.t0 + 0.4, t2 - 0.08, { dam: 800 });

  // Nhãn Câu 2, 3, 4:
  // Bậc 1: Tiền 10 tỷ (3 từ)
  soChay(S, 340, 560, 280, 46, M.xanh, t2 + 0.1, S.t1 - 0.05, (t) => `Tiền ${Math.round(10 * eio(tienDo(t, t2, e2 - 0.4)))} tỷ`);
  // Bậc 2: Phải thu 20 tỷ (4 từ)
  soChay(S, 805, 560, 420, 46, M.vang, t3 + 0.1, S.t1 - 0.05, (t) => `Phải thu ${Math.round(20 * eio(tienDo(t, t3, e3 - 0.4)))} tỷ`);
  // Bậc 3: Tồn kho 30 tỷ (4 từ)
  soChay(S, 1420, 588, 540, 46, M.cam, t4 + 0.1, S.t1 - 0.05, (t) => `Tồn kho ${Math.round(30 * eio(tienDo(t, t4, e4 - 0.5)))} tỷ`);

  // Nhãn trên đường mũi tên dốc xuống: ở câu 2 & câu 3 hiện "Thanh khoản giảm dần" (4 từ -> tổng 7 và 11 từ); sang câu 4 hiện "Chậm" ở đầu mũi tên thấp nhất (1 từ -> tổng 3+4+4+1 = 12 từ)
  giua(S, 'Thanh khoản giảm dần', 920, 250, 620, 44, M.nhan, t2 + 0.15, t4 - 0.08, { dam: 800 });
  giua(S, 'Chậm', 1540, 445, 220, 44, M.cam, t4 + 0.15, S.t1 - 0.05, { dam: 800 });
};

// ======================= Chương 3 · Bẫy thanh khoản: 60 tỷ sổ sách chỉ còn 10 tỷ trả nợ (44.64 – 62.15s) =======================
// Câu cơ chế: Cột tài sản ngắn hạn 60 tỷ đồng (gồm tồn kho 30 tỷ, phải thu 20 tỷ, tiền 10 tỷ) đặt đối diện cột nợ đến hạn 25 tỷ đồng;
// khi tồn kho 30 tỷ và phải thu 20 tỷ bị đóng băng (khóa), chỉ còn tiền mặt 10 tỷ đồng thấp hơn nợ đến hạn 25 tỷ đồng, tạo khoảng thiếu hụt −15 tỷ đồng.
N.canh3 = function (S) {
  const c = 3;
  const t1 = C(c, 1), e1 = E(c, 1); // 45.14 - 49.59s: 60 tỷ tài sản ngắn hạn vs 25 tỷ nợ đến hạn
  const t2 = C(c, 2), e2 = E(c, 2); // 49.84 - 54.74s: 30 tỷ tồn kho ế + 20 tỷ phải thu quá hạn bị khóa, chỉ còn Tiền 10 tỷ
  const t3 = C(c, 3), e3 = E(c, 3); // 54.99 - 61.45s: Tiền mặt 10 tỷ vs Nợ đến hạn 25 tỷ -> Thiếu −15 tỷ (khớp đúng hiệu chiều cao)
  nhanGD(S, t1 - 0.2, S.t1 - 0.05);

  S.ve2d.push((ctx, t) => {
    const yDay = 700;
    ctx.save();
    ctx.strokeStyle = M.nhat; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(200, yDay + 3); ctx.lineTo(1720, yDay + 3); ctx.stroke();
    ctx.restore();

    // Câu 1 (t < t2): Cột Tài sản ngắn hạn 60 tỷ (cao 480px) đối diện cột Nợ đến hạn 25 tỷ (cao 200px)
    if (t < t2) {
      const p1 = eio(tienDo(t, S.t0 + 0.15, e1 - 0.5));
      const h60 = 480 * lerp(0.45, 1, p1);
      const h25 = 200 * lerp(0.45, 1, p1);
      hcn(ctx, 320, yDay - h60, 420, h60, 18, M.nhanNhat, M.nhan, 5);
      hcn(ctx, 1180, yDay - h25, 420, h25, 18, M.doNen, M.do, 5);
      return;
    }

    // Câu 2 (t2 <= t < t3): Cột 60 tỷ tách thành 3 ngăn tỉ lệ (1 tỷ = 8px):
    // Tồn kho 30 tỷ (240px) và Phải thu 20 tỷ (160px) bị xám hóa, trượt sang phải và gom vào ngoặc "Khóa", chỉ còn Tiền 10 tỷ (80px) ở đáy
    if (t < t3) {
      const pKhoa30 = eio(tienDo(t, t2, t2 + 2.2));
      const pKhoa20 = eio(tienDo(t, t2 + 1.4, e2 - 0.4));
      const xCol = 480, wCol = 460;
      const h10 = 80, h20 = 160, h30 = 240;

      // Ngăn đáy: Tiền 10 tỷ (giữ nguyên vị trí)
      hcn(ctx, xCol, yDay - h10, wCol, h10, 14, M.xanhNhat, M.xanh, 5);

      // Ngăn giữa: Phải thu 20 tỷ (xám hóa và trượt sang phải 90px)
      const dx20 = 90 * pKhoa20, y20 = yDay - h10 - h20 - 8;
      hcn(ctx, xCol + dx20, y20, wCol, h20, 14, pKhoa20 > 0.25 ? M.xamNen : M.vangNen, pKhoa20 > 0.25 ? M.xam : M.vang, 4.5);

      // Ngăn trên: Tồn kho 30 tỷ (xám hóa và trượt sang phải 90px)
      const dx30 = 90 * pKhoa30, y30 = y20 - h30 - 8;
      hcn(ctx, xCol + dx30, y30, wCol, h30, 14, pKhoa30 > 0.25 ? M.xamNen : M.camNen, pKhoa30 > 0.25 ? M.xam : M.cam, 4.5);

      // Dấu X đỏ và ngoặc "Khóa" bên phải 2 ngăn bị đóng băng
      if (pKhoa30 > 0.2) {
        ctx.save();
        ctx.strokeStyle = M.do; ctx.lineWidth = 5; ctx.lineCap = 'round';
        const xRight = xCol + dx30 + wCol + 24;
        ctx.beginPath();
        ctx.moveTo(xRight, y30 + 16);
        ctx.lineTo(xRight + 22, y30 + 16);
        ctx.lineTo(xRight + 22, y20 + h20 - 16);
        ctx.lineTo(xRight, y20 + h20 - 16);
        ctx.stroke();
        ctx.restore();
      }
      return;
    }

    // Câu 3 (t >= t3): Đối chiếu trực tiếp Tiền mặt 10 tỷ (cao 140px) và Nợ đến hạn 25 tỷ (cao 350px) theo tỉ lệ chính xác 1 tỷ = 14px.
    // Khối đỏ "Thiếu −15 tỷ" cao đúng 210px (= 350px - 140px) lấp chính xác khoảng chênh chiều cao từ đỉnh Tiền 10 tỷ (y=560) lên đỉnh Nợ 25 tỷ (y=350).
    const scale3 = 14; // 1 tỷ = 14px -> 10 tỷ = 140px (y: 560..700), 25 tỷ = 350px (y: 350..700), 15 tỷ = 210px (y: 350..560)
    const h10 = 10 * scale3, h25 = 25 * scale3, h15 = 15 * scale3;
    const pThieu = eio(tienDo(t, t3, e3 - 0.8));

    // Cột trái: Tiền mặt 10 tỷ (x: 240..660, y: 560..700)
    hcn(ctx, 240, yDay - h10, 420, h10, 16, M.xanhNhat, M.xanh, 5);

    // Cột phải: Nợ đến hạn 25 tỷ (x: 1260..1680, y: 350..700)
    hcn(ctx, 1260, yDay - h25, 420, h25, 18, M.doNen, M.do, 5);

    // Hai đường gióng ngang nét đứt tại mức 10 tỷ (y=560) và mức 25 tỷ (y=350) + khối Thiếu −15 tỷ cao đúng bằng khoảng chênh (210px)
    const h15Cur = h15 * lerp(0.45, 1, pThieu);
    const yTop10 = yDay - h10; // 560
    const yTop25 = yDay - h25; // 350
    ctx.save();
    ctx.lineWidth = 3.5; ctx.setLineDash([10, 8]);
    ctx.strokeStyle = M.xanh;
    ctx.beginPath(); ctx.moveTo(660, yTop10); ctx.lineTo(1260, yTop10); ctx.stroke();
    ctx.strokeStyle = M.do;
    ctx.beginPath(); ctx.moveTo(660, yTop25); ctx.lineTo(1260, yTop25); ctx.stroke();
    ctx.restore();

    hcn(ctx, 750, yTop10 - h15Cur, 420, h15Cur, 18, M.doNen, M.do, 5);
  });

  // Nhãn Câu 1 (t0 -> t2 - 0.08): 6 + 5 = 11 từ
  giua(S, 'Tài sản ngắn hạn', 530, 155, 440, 42, M.nhan, S.t0 + 0.2, t2 - 0.08, { dam: 800 });
  soChay(S, 530, 430, 360, 60, M.nhan, S.t0 + 0.2, t2 - 0.08, (t) => `${Math.round(60 * eio(tienDo(t, S.t0 + 0.15, e1 - 0.5)))} tỷ`);
  giua(S, 'Nợ đến hạn', 1390, 430, 400, 42, M.do, S.t0 + 0.3, t2 - 0.08, { dam: 800 });
  soChay(S, 1390, 575, 360, 58, M.do, S.t0 + 0.3, t2 - 0.08, (t) => `${Math.round(25 * eio(tienDo(t, S.t0 + 0.15, e1 - 0.5)))} tỷ`);

  // Nhãn Câu 2 (t2 -> t3 - 0.08): 4 + 4 + 3 + 1 = 12 từ (mọi ngăn đều có đủ tên và số tỷ)
  giua(S, 'Tồn kho 30 tỷ', 800, 290, 420, 44, M.chu, t2 + 0.1, t3 - 0.08, { dam: 800 });
  giua(S, 'Phải thu 20 tỷ', 800, 505, 420, 44, M.chu, t2 + 0.2, t3 - 0.08, { dam: 800 });
  giua(S, 'Tiền 10 tỷ', 710, 635, 380, 42, M.xanh, t2 + 0.1, t3 - 0.08, { dam: 800 });
  giua(S, 'Khóa', 1155, 385, 200, 46, M.do, t2 + 0.4, t3 - 0.08, { dam: 800 });

  // Nhãn Câu 3 (t3 -> hết chương 3): 4 + 3 + 5 = 12 từ, khớp chính xác "−15 tỷ" trong du_kien.json
  giua(S, 'Tiền mặt 10 tỷ', 450, 604, 400, 44, M.xanh, t3 + 0.1, S.t1 - 0.05, { dam: 800 });
  soChay(S, 960, 428, 390, 50, M.do, t3 + 0.15, S.t1 - 0.05, (t) => `Thiếu −${Math.round(15 * eio(tienDo(t, t3, e3 - 0.8)))} tỷ`);
  giua(S, 'Nợ đến hạn 25 tỷ', 1470, 500, 400, 44, M.do, t3 + 0.1, S.t1 - 0.05, { dam: 800 });
};

// ======================= Chương 4 · Ngân hàng thẩm định: lọc hàng ế và nợ quá hạn ra dòng tiền thực (62.15 – 75.54s) =======================
// Câu cơ chế: Từ cột sổ sách 60 tỷ đồng, ngân hàng dùng bộ lọc vòng quay tồn kho và tuổi nợ phải thu
// để trừ đi phần hàng ế và nợ quá hạn, chỉ giữ lại phần thực thu hồi tạo thành cột tiền thực 10 tỷ đồng thấp hơn hẳn cột sổ sách.
N.canh4 = function (S) {
  const c = 4;
  const t1 = C(c, 1), e1 = E(c, 1); // 62.65 - 69.25s: Luật TCTD 2024, cột Sổ sách 60 tỷ và thanh lọc Vòng quay, tuổi nợ
  const t2 = C(c, 2), e2 = E(c, 2); // 69.50 - 75.29s: Phép trừ chiều cao cột: Sổ sách 60 tỷ (480px) − Hàng ế, quá hạn (360px) = Tiền thực 10 tỷ (120px)
  nhanGD(S, t1 - 0.2, S.t1 - 0.05);

  S.ve2d.push((ctx, t) => {
    const yDay = 680; // Cột Sổ sách 60 tỷ cao 480px (y: 200..680); khối Hàng ế, quá hạn cao 360px (y: 200..560); cột Tiền thực 10 tỷ cao 120px (y: 560..680)
    const h60 = 480, hLoai = 360, hThuc = 120;

    ctx.save();
    ctx.strokeStyle = M.nhat; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(140, yDay + 3); ctx.lineTo(1760, yDay + 3); ctx.stroke();
    ctx.restore();

    // Câu 1 (t < t2): Cột Sổ sách 60 tỷ thống nhất ở bên trái + thanh kẹp lọc "Vòng quay, tuổi nợ" nối trực tiếp vào vạch cắt ngang cột
    if (t < t2) {
      const pCol = eio(tienDo(t, S.t0 + 0.15, t1 + 2.2));
      const pScan = eio(tienDo(t, t1 + 1.0, e1 - 0.4));
      const xL = 260, wL = 400;
      const hCur = h60 * lerp(0.5, 1, pCol);

      hcn(ctx, xL, yDay - hCur, wL, hCur, 18, M.nhanNhat, M.nhan, 5);

      if (pScan > 0.02) {
        const yScan = lerp(240, yDay - hThuc, pScan);
        ctx.save();
        ctx.strokeStyle = M.do; ctx.lineWidth = 5; ctx.setLineDash([12, 8]);
        ctx.beginPath(); ctx.moveTo(xL - 24, yScan); ctx.lineTo(xL + wL + 24, yScan); ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = M.do; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(840, 385); ctx.lineTo(760, 385); ctx.lineTo(760, yScan);
        ctx.stroke();
        ctx.restore();
        muiNgang(ctx, 760, xL + wL + 12, yScan, M.do, 5);
        hcn(ctx, 840, 310, 560, 150, 18, M.the, M.nhan, 5);
      }
      return;
    }

    // Câu 2 (t >= t2): Phép trừ trực quan trên chiều cao cột (480px − 360px = 120px), mỗi khối là một hình thống nhất có nhãn nằm gọn bên trong
    const pSub = eio(tienDo(t, t2, e2 - 0.8));
    const xL = 150, wL = 350;

    // 1. Cột trái: Sổ sách 60 tỷ (cao 480px, y: 200..680)
    hcn(ctx, xL, yDay - h60, wL, h60, 18, M.nhanNhat, M.nhan, 5);

    // 2. Khối giữa bị trừ: Hàng ế, quá hạn (cao 360px, y: 200..560, tách từ phần trên của cột 60 tỷ)
    const xM = lerp(540, 670, pSub), wM = 390;
    hcn(ctx, xM, yDay - h60, wM, hLoai, 18, M.xamNen, M.do, 5);

    // 3. Cột phải: Tiền thực 10 tỷ (cao 120px, y: 560..680, gióng ngang đúng phần còn lại ở đáy cột 60 tỷ)
    const xR = 1230, wR = 460;
    const hThucCur = hThuc * lerp(0.5, 1, pSub);
    ctx.save();
    ctx.strokeStyle = M.xanh; ctx.lineWidth = 3.5; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.moveTo(xL + wL, yDay - hThuc); ctx.lineTo(xR, yDay - hThuc); ctx.stroke();
    ctx.restore();
    hcn(ctx, xR, yDay - hThucCur, wR, hThucCur, 16, M.xanhNhat, M.xanh, 5);
  });

  // Nhãn Câu 1 (t0 -> t2 - 0.08): 4 + 4 + 4 = 12 từ
  giua(S, 'Sổ sách 60 tỷ', 460, 415, 360, 44, M.nhan, S.t0 + 0.2, t2 - 0.08, { dam: 800 });
  giua(S, 'Vòng quay, tuổi nợ', 1120, 358, 520, 44, M.nhan, t1 + 1.0, t2 - 0.08, { dam: 800 });
  dong(S, 'Luật 32/2024 · Điều 94', 260, 725, 560, 38, M.chu, S.t0 + 0.3, t2 - 0.08, { dam: 800, css: 'white-space:nowrap;' });

  // Nhãn Câu 2 (t2 -> hết chương 4): 4 + 4 + 4 = 12 từ (mọi nhãn nằm chính giữa khối của mình)
  giua(S, 'Sổ sách 60 tỷ', 325, 415, 330, 42, M.nhan, t2 + 0.05, S.t1 - 0.05, { dam: 800 });
  giua(S, '−', 585, 350, 100, 64, M.do, t2 + 0.1, S.t1 - 0.05, { dam: 800 });
  giua(S, 'Hàng ế, quá hạn', 865, 355, 360, 42, M.do, t2 + 0.1, S.t1 - 0.05, { dam: 800 });
  giua(S, '=', 1145, 588, 100, 64, M.xanh, t2 + 0.2, S.t1 - 0.05, { dam: 800 });
  soChay(S, 1460, 594, 420, 44, M.xanh, t2 + 0.2, S.t1 - 0.05, (t) => `Tiền thực ${Math.round(10 * eio(tienDo(t, t2, e2 - 0.8)))} tỷ`);
};

// ---------- phụ đề, logo, màn hình kết ----------
let phuDe, logo, ket, quet, quetBang;
function taoPhuDe() {
  const chp = CH.map((c) => Object.assign({}, c, { cau: c.cau.slice() }));
  chp[chp.length - 1].cau.pop();
  phuDe = K.phu_de_chay_chu({ chuong: chp, mau: { the: '#08242A', chu: '#FFFFFF', nhan: '#64E3DC' }, day: 1014, co: 38 });
  const hopPD = phuDe.el.querySelector('[data-hop]');
  if (hopPD) { hopPD.style.background = 'rgba(8,36,42,0.93)'; hopPD.style.border = 'none'; hopPD.style.borderRadius = '10px'; }
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
  const tr = DO_HINH ? '' : `translate(${(4 * Math.sin(2 * Math.PI * t / 13)).toFixed(2)}px,${(2.5 * Math.sin(2 * Math.PI * t / 17)).toFixed(2)}px)`;
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
      const op = Math.min(cl((t - a) / 0.25), cl((b - t) / 0.25));
      S.ctx2.save(); S.ctx2.globalAlpha = c === 1 ? 1 : op;
      for (const f of S.ve2d) { S.ctx2.save(); f(S.ctx2, t); S.ctx2.restore(); }
      S.ctx2.restore();
    }
  }
  const vet = document.getElementById('vet');
  if (vet) vet.style.transform = DO_HINH ? '' : `translate(${(50 * Math.sin(2 * Math.PI * t / 9)).toFixed(1)}px,${(35 * Math.sin(2 * Math.PI * t / 7 + 0.8)).toFixed(1)}px)`;
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
