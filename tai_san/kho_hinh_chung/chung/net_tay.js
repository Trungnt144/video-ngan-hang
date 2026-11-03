// chung/net_tay.js — 1.0 — chất liệu CL-10 "bút chì trên giấy kem": nền giấy có vân, nét bút chì vẽ dần theo đường kèm đầu bút, chữ viết dần bằng vùng cắt kèm đầu bút.
// Bốn hàm dùng lại cho mọi hình khác:
//   KHO.net_tay_but_chi(opt)  nền giấy (cảnh nền).                         → { el (<g> SVG), seek(t), moc }
//   KHO.but_chi_ve(opt)       vẽ dần một hay nhiều nét theo điểm, có đầu bút. → { el, seek(t), moc, t_xong }
//   KHO.chu_viet_dan(opt)     viết dần chữ (một hay nhiều dòng), có đầu bút.  → { el, seek(t), moc, t_xong }
//   KHO.dau_but(opt)          vẽ riêng cây bút (đầu bút ở gốc toạ độ).       → <g>
// Kiểu vẽ: 'net_tay' (CL-10: giấy kem có vân hạt và loang, bút chì gỗ, nét than chì run hai lượt) | 'phang' (giấy trắng sạch có ô lưới mờ, bút dạ, nét sạch đầu tròn).
// Tham số chung: kieu; mau (ghi đè bảng màu); vao (giây bắt đầu, -1 hiện đủ); tinh (true hiện đủ); hat (hạt giống nét tay).
// net_tay_but_chi: rong, cao (mặc định 1920 × 1080, gốc ở góc trên trái); van (vân giấy, mặc định true); toi_vien (tối nhẹ bốn mép, mặc định true);
//   ke_dong (khoảng cách dòng kẻ ngang, 0 là không kẻ; mặc định 0); le_do (x của đường lề dọc màu nhấn, tuỳ chọn); o_luoi (cỡ ô lưới mờ ở kiểu phẳng, mặc định 48, 0 là tắt).
// but_chi_ve: net (mảng nét, mỗi nét là mảng điểm [[x,y],...]) hoặc diem (một nét); dong (true: khép kín từng nét); khoa_mau ('chu'); day (độ dày, mặc định 5);
//   dai (tổng giây vẽ, mặc định theo chiều dài: 900 đơn vị mỗi giây); but (true: hiện cây bút, mặc định true); lech (độ run nét tay, mặc định 1,8).
// chu_viet_dan: chu; x, y (đường chân chữ dòng đầu); co (cỡ, mặc định 44); dam (600); rong (bề rộng tối đa để xuống dòng, tuỳ chọn); gian_dong (1,3);
//   neo ('start' | 'middle'); khoa_mau ('chu'); toc_do (giây mỗi ký tự, mặc định 0,045); but (true).
// Điểm neo: nền → { tam, rong, cao }; nét → { dau [x,y], cuoi [x,y] }; chữ → { hop {x,y,w,h}, cuoi [x,y] }. t_xong: giây (tính từ lúc hình xuất hiện) nét hoặc chữ vẽ xong.
// Dựng mới 29/10/2026.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // ---------- hàm nội bộ (đề xuất gom vào kho_nen.js) ----------
  let demId = 0;
  const idMoi = (goc) => `kho-nt2-${goc}-${++demId}`;
  const thoiGian = (opt) => (opt.tinh || (opt.vao != null && opt.vao < 0)) ? () => 1e6 : (t) => t - (opt.vao || 0);
  // Độ dài gấp khúc và điểm ở tỉ lệ p (0..1) của nó.
  const doDai = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  const diemTai = (pts, p) => {
    const L = doDai(pts) * K.cl(p);
    let d = 0;
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (d + l >= L && l > 0) { const u = (L - d) / l; return [K.lerp(pts[i - 1][0], pts[i][0], u), K.lerp(pts[i - 1][1], pts[i][1], u)]; }
      d += l;
    }
    return pts[pts.length - 1].slice();
  };
  const chiaNho = (pts, dai = 40) => {
    const ra = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / dai));
      for (let j = 1; j <= n; j++) ra.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n]);
    }
    return ra;
  };
  const chuanBiVe = (p) => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1 1'; return p; };
  const veDan = (p, u) => { u = K.cl(u); p.style.strokeDashoffset = (1 - u).toFixed(4); p.style.opacity = u <= 0.001 ? 0 : ''; };

  // ---------- cây bút: đầu bút ở gốc toạ độ, thân chếch lên phải ----------
  K.dau_but = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co || 1;
    const g = K.svg('g', { class: 'kho-dau-but' });
    const xoay = K.svg('g', { transform: `scale(${co}) rotate(-58)` }, g); // trục bút nằm dọc theo trục x dương sau khi xoay
    // bóng bút trên giấy
    K.svg('path', { d: 'M6 10 L250 34 L252 52 L10 18 Z', fill: '#000', opacity: 0.08, transform: 'rotate(12)' }, xoay);
    if (tay) {
      const go = K.tron(m.giay, m.canh_bao, 0.35), than = m.canh_bao, thanToi = K.tron(m.canh_bao, m.chu, 0.25), dai = K.tron(m.xau, '#FFFFFF', 0.45);
      K.svg('path', { d: 'M0 0 L14 -4 L14 4 Z', fill: m.chu }, xoay);                              // ruột chì
      K.svg('path', { d: 'M14 -4 L46 -13 L46 13 L14 4 Z', fill: go }, xoay);                        // gỗ vót
      K.svg('path', { d: 'M46 -13 L52 -9 L58 -13 L64 -9 L70 -13 L70 13 L64 9 L58 13 L52 9 L46 13 Z', fill: go }, xoay);
      K.svg('rect', { x: 64, y: -13, width: 170, height: 26, fill: than }, xoay);                    // thân lục giác: ba mặt
      K.svg('rect', { x: 64, y: -13, width: 170, height: 8, fill: K.tron(than, '#FFFFFF', 0.3) }, xoay);
      K.svg('rect', { x: 64, y: 5, width: 170, height: 8, fill: thanToi }, xoay);
      K.svg('rect', { x: 234, y: -14, width: 24, height: 28, fill: m.chu_phu }, xoay);              // đai kim loại
      K.svg('line', { x1: 242, y1: -14, x2: 242, y2: 14, stroke: m.chu, 'stroke-width': 1.5, opacity: 0.5 }, xoay);
      K.svg('line', { x1: 250, y1: -14, x2: 250, y2: 14, stroke: m.chu, 'stroke-width': 1.5, opacity: 0.5 }, xoay);
      K.svg('path', { d: 'M258 -14 L272 -14 Q280 -14 280 -6 L280 6 Q280 14 272 14 L258 14 Z', fill: dai }, xoay); // tẩy
      K.svg('path', { d: 'M0 0 L46 -13 L280 -14 L280 14 L46 13 Z', fill: 'none', stroke: m.chu, 'stroke-width': 2, 'stroke-linejoin': 'round', opacity: 0.75 }, xoay);
    } else {
      const nap = m.nhan, than = m.the;
      K.svg('path', { d: 'M0 0 Q2 -6 10 -7 L22 -9 L22 9 L10 7 Q2 6 0 0 Z', fill: m.chu }, xoay);    // ngòi dạ
      K.svg('path', { d: 'M22 -12 L44 -16 L44 16 L22 12 Z', fill: K.tron(than, m.chu, 0.15) }, xoay);
      K.svg('rect', { x: 44, y: -17, width: 150, height: 34, rx: 6, fill: than, stroke: K.rgba(m.vien, 0.35), 'stroke-width': 2 }, xoay);
      K.svg('rect', { x: 52, y: -13, width: 134, height: 7, rx: 3.5, fill: '#FFFFFF', opacity: 0.6 }, xoay);
      K.svg('rect', { x: 190, y: -19, width: 80, height: 38, rx: 9, fill: nap }, xoay);              // nắp
      K.svg('rect', { x: 200, y: -14, width: 56, height: 6, rx: 3, fill: '#FFFFFF', opacity: 0.35 }, xoay);
    }
    return g;
  };

  // vị trí bút: hiện khi đang vẽ, nhấc lên và mờ đi sau khi xong (hàm thuần của s)
  const datBut = (but, s, a, b, xy) => {
    if (!but) return;
    if (s <= a - 0.15) { but.style.opacity = 0; return; }
    const vao = K.eo3(K.tienDo(s, a - 0.15, 0.15)), ra = K.eo3(K.tienDo(s, b, 0.22));
    const nhac = 26 * (1 - vao) + 60 * ra;
    const rung = s > a && s < b ? Math.sin(s * 37) * 1.2 : 0;
    but.style.opacity = (vao * (1 - ra)).toFixed(3);
    but.setAttribute('transform', `translate(${(xy[0] + nhac * 0.6).toFixed(2)} ${(xy[1] - nhac + rung).toFixed(2)}) rotate(${(Math.sin(s * 9) * 2).toFixed(2)})`);
  };

  // ---------- nền giấy ----------
  K.net_tay_but_chi = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', W = opt.rong || 1920, H = opt.cao || 1080, hat = opt.hat || 5;
    const g = K.svg('g', { class: 'kho-giay' });
    const defs = K.svg('defs', null, g);
    K.svg('rect', { x: 0, y: 0, width: W, height: H, fill: tay ? m.giay : m.giay }, g);
    if (tay && opt.van !== false) {
      // loang màu lớn (giấy không đều tông) và hạt giấy mịn; hạt giống cố định nên khung nào cũng như nhau
      const [r, gg, b] = K.hex(m.chu).map((v) => (v / 255).toFixed(3));
      const fl = idMoi('loang');
      const f1 = K.svg('filter', { id: fl, x: 0, y: 0, width: W, height: H, filterUnits: 'userSpaceOnUse' }, defs);
      K.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.0028, numOctaves: 3, seed: hat }, f1);
      K.svg('feColorMatrix', { type: 'matrix', values: `0 0 0 0 ${r} 0 0 0 0 ${gg} 0 0 0 0 ${b} 0.9 0 0 0 -0.38` }, f1);
      K.svg('rect', { x: 0, y: 0, width: W, height: H, filter: `url(#${fl})`, opacity: 0.22 }, g);
      const fh = idMoi('hat');
      const f2 = K.svg('filter', { id: fh, x: 0, y: 0, width: W, height: H, filterUnits: 'userSpaceOnUse' }, defs);
      K.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.9, numOctaves: 2, seed: hat + 1 }, f2);
      K.svg('feColorMatrix', { type: 'matrix', values: `0 0 0 0 ${r} 0 0 0 0 ${gg} 0 0 0 0 ${b} 1.4 0 0 0 -0.62` }, f2);
      K.svg('rect', { x: 0, y: 0, width: W, height: H, filter: `url(#${fh})`, opacity: 0.35 }, g);
      // sợi giấy: vài nét mảnh rải rác
      const ng = K.ngauNhien(hat + 9), soi = K.svg('g', { opacity: 0.12 }, g);
      for (let i = 0; i < 70; i++) {
        const x = ng(i * 4) * W, y = ng(i * 4 + 1) * H, a = ng(i * 4 + 2) * Math.PI, l = 8 + ng(i * 4 + 3) * 22;
        K.svg('path', { d: `M${x.toFixed(1)} ${y.toFixed(1)} q${(Math.cos(a) * l / 2).toFixed(1)} ${(Math.sin(a) * l / 2 + 3).toFixed(1)} ${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}`, fill: 'none', stroke: m.chu, 'stroke-width': 0.9 }, soi);
      }
    }
    if (!tay && (opt.o_luoi == null || opt.o_luoi > 0)) {
      const o = opt.o_luoi || 48, id = idMoi('luoi');
      const pt = K.svg('pattern', { id, width: o, height: o, patternUnits: 'userSpaceOnUse' }, defs);
      K.svg('path', { d: `M${o} 0 L0 0 L0 ${o}`, fill: 'none', stroke: m.nhan_phu, 'stroke-width': 1, opacity: 0.18 }, pt);
      K.svg('rect', { x: 0, y: 0, width: W, height: H, fill: `url(#${id})` }, g);
    }
    if (opt.ke_dong > 0) {
      const ke = K.svg('g', null, g);
      for (let y = opt.ke_dong * 2; y < H - 10; y += opt.ke_dong) {
        if (tay) K.svg('path', { d: K.duongTay(chiaNho([[0, y], [W, y]], 160), { hat: hat + y, lech: 0.6 }), fill: 'none', stroke: m.nhan_phu, 'stroke-width': 1.3, opacity: 0.35 }, ke);
        else K.svg('line', { x1: 0, y1: y, x2: W, y2: y, stroke: m.nhan_phu, 'stroke-width': 1.3, opacity: 0.3 }, ke);
      }
    }
    if (opt.le_do != null) K.svg('line', { x1: opt.le_do, y1: 0, x2: opt.le_do, y2: H, stroke: m.nhan, 'stroke-width': 2, opacity: 0.45 }, g);
    if (opt.toi_vien !== false) {
      const id = idMoi('vien');
      const rg = K.svg('radialGradient', { id, cx: '50%', cy: '48%', r: '75%' }, defs);
      K.svg('stop', { offset: '0.55', 'stop-color': m.chu, 'stop-opacity': 0 }, rg);
      K.svg('stop', { offset: '1', 'stop-color': m.chu, 'stop-opacity': tay ? 0.2 : 0.07 }, rg);
      K.svg('rect', { x: 0, y: 0, width: W, height: H, fill: `url(#${id})` }, g);
    }
    return { el: g, seek() {}, moc: { tam: [W / 2, H / 2], rong: W, cao: H } };
  };

  // ---------- nét vẽ dần có đầu bút ----------
  K.but_chi_ve = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', hat = opt.hat || 13;
    const mau = m[opt.khoa_mau || 'chu'] || m.chu, day = opt.day || 5, T = thoiGian(opt);
    const ds = (opt.net || [opt.diem || [[0, 0], [200, 0]]]).map((n) => (opt.dong ? n.concat([n[0]]) : n));
    const g = K.svg('g', { class: 'kho-but-chi-ve' });
    const tong = ds.reduce((a, n) => a + doDai(n), 0) || 1;
    const dai = opt.dai || Math.max(0.3, tong / 900), nghi = 0.08;
    const tgVe = dai - nghi * (ds.length - 1) > 0.1 ? dai - nghi * (ds.length - 1) : dai;
    let a = 0;
    const net = ds.map((n, i) => {
      const nho = chiaNho(n, 36), d = tay ? null : n.map(([x, y], j) => `${j ? 'L' : 'M'}${x} ${y}`).join(' ');
      const ps = tay
        ? [chuanBiVe(K.svg('path', { d: K.duongTay(nho, { hat: hat + i * 7, lech: opt.lech || 1.8 }), fill: 'none', stroke: mau, 'stroke-width': day * 0.75, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.9 }, g)),
           chuanBiVe(K.svg('path', { d: K.duongTay(nho, { hat: hat + i * 7 + 3, lech: (opt.lech || 1.8) * 1.5 }), fill: 'none', stroke: mau, 'stroke-width': day * 0.35, 'stroke-linecap': 'round', opacity: 0.45 }, g))]
        : [chuanBiVe(K.svg('path', { d, fill: 'none', stroke: mau, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g))];
      const len = tgVe * doDai(n) / tong, r = { ps, n, a, b: a + len };
      a += len + nghi;
      return r;
    });
    const tXong = net[net.length - 1].b;
    const but = opt.but === false ? null : K.dau_but({ kieu: opt.kieu, mau: opt.mau, co: opt.co_but || 0.8 });
    if (but) g.appendChild(but);
    const lechVao = opt.vao > 0 ? opt.vao : 0;
    return {
      el: g,
      t_xong: tXong + lechVao,
      seek(t) {
        const s = T(t);
        let xy = net[0].n[0];
        net.forEach((u) => {
          const p = K.tienDo(s, u.a, u.b - u.a);
          u.ps.forEach((pp) => veDan(pp, p));
          if (s >= u.a) xy = diemTai(u.n, p);
        });
        datBut(but, s, 0, tXong, xy);
      },
      moc: { dau: ds[0][0].slice(), cuoi: ds[ds.length - 1][ds[ds.length - 1].length - 1].slice() },
    };
  };

  // ---------- chữ viết dần ----------
  K.chu_viet_dan = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), T = thoiGian(opt);
    const co = opt.co || 44, dam = opt.dam || 600, gd = opt.gian_dong || 1.3, x0 = opt.x || 0, y0 = opt.y || 0, neo = opt.neo || 'start';
    const mau = m[opt.khoa_mau || 'chu'] || m.chu, tocDo = opt.toc_do || 0.045;
    const dong = opt.rong ? K.xuongDong(opt.chu || '', opt.rong, co, dam) : [String(opt.chu || '')];
    const g = K.svg('g', { class: 'kho-chu-viet-dan' });
    const id = idMoi('cv');
    const clip = K.svg('clipPath', { id }, K.svg('defs', null, g));
    const nhom = K.svg('g', { 'clip-path': `url(#${id})` }, g);
    let a = 0;
    const ds = dong.map((s, i) => {
      const w = K.doChu(s, co, dam), y = y0 + i * co * gd, x = neo === 'middle' ? x0 - w / 2 : x0;
      K.chu(nhom, s, { x, y, co, dam, mau });
      const r = K.svg('rect', { x: x - 4, y: y - co * 1.05, width: 0, height: co * 1.45 }, clip);
      const len = Math.max(0.25, s.length * tocDo), u = { r, x, y, w, a, b: a + len };
      a += len + 0.1;
      return u;
    });
    const tXong = ds[ds.length - 1].b;
    const but = opt.but === false ? null : K.dau_but({ kieu: opt.kieu, mau: opt.mau, co: opt.co_but || Math.min(1, co / 52) });
    if (but) g.appendChild(but);
    const rongMax = Math.max(...ds.map((u) => u.w));
    const xHop = neo === 'middle' ? x0 - rongMax / 2 : x0;
    const lechVao = opt.vao > 0 ? opt.vao : 0;
    return {
      el: g,
      t_xong: tXong + lechVao,
      seek(t) {
        const s = T(t);
        let xy = [ds[0].x, ds[0].y - co * 0.3];
        ds.forEach((u) => {
          const p = K.tienDo(s, u.a, u.b - u.a);
          u.r.setAttribute('width', (p >= 1 ? u.w + 12 : u.w * p + 4).toFixed(2));
          // đầu bút lượn lên xuống theo nét chữ trong lúc viết
          if (s >= u.a) xy = [u.x + u.w * p, u.y - co * 0.3 + Math.sin(p * u.w * 0.21) * co * 0.22];
        });
        datBut(but, s, 0, tXong, xy);
      },
      moc: { hop: { x: xHop, y: y0 - co, w: rongMax, h: co * gd * (ds.length - 1) + co * 1.3 }, cuoi: [ds[ds.length - 1].x + ds[ds.length - 1].w, ds[ds.length - 1].y] },
    };
  };
})();
