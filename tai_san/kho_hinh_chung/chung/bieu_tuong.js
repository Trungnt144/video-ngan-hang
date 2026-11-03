// chung/bieu_tuong.js — 1.0 — bộ biểu tượng cơ bản: dấu tích, dấu gạch chéo, dấu hỏi, dấu chấm than, mũi tên thẳng, mũi tên cong, vòng khoanh; đều vẽ dần theo t.
// Gọi: KHO.bo_bieu_tuong_co_ban({ loai, ... }) hoặc bí danh KHO.dau_tich, KHO.dau_gach, KHO.dau_hoi, KHO.dau_cham_than, KHO.mui_ten, KHO.mui_ten_cong, KHO.vong_khoanh.
// Tham số chung: loai 'tich'|'gach'|'hoi'|'cham_than'|'mui_ten'|'mui_ten_cong'|'vong_khoanh'; kieu 'phang'|'net_tay'; co (tỉ lệ, mặc định 1);
//   mau (ghi đè bảng màu); khoa_mau (khoá màu của nét: tot, xau, nhan, nhan_phu, canh_bao, chu...); vao (giây bắt đầu vẽ, mặc định 0; -1 hiện đủ);
//   tinh (true hiện đủ); dai (giây vẽ nét, mặc định 0,5 với dấu, 0,7 với mũi tên và vòng khoanh); hat (hạt giống nét tay); nhan (chữ kèm); co_chu (cỡ chữ nhãn, mặc định 30).
//   Dấu (tich, gach, hoi, cham_than): vẽ trong ô 100×100 quanh gốc; nen true (đĩa nền nhạt, mặc định) | 'dac' (đĩa đặc, dấu màu sáng) | false. Nhãn đặt dưới dấu.
//   Mũi tên: tu [x,y], den [x,y] theo toạ độ cảnh (không dời gốc); cong (độ võng so với chiều dài, mặc định 0 với mui_ten, 0,28 với mui_ten_cong, âm thì võng phía kia);
//     net_dut (true: nét đứt); hai_dau (true: đầu mũi tên ở cả hai đầu); day (độ dày nét, mặc định 6×co). Nhãn đặt ở giữa, lệch về phía võng.
//   Vòng khoanh: hop {x,y,w,h} hoặc [x,y,w,h] theo toạ độ cảnh; le (khoảng hở quanh hộp, mặc định 18). Nhãn đặt phía trên vòng.
// Trả về { el, seek(t), moc }: dấu → moc { tam, dinh, day, trai, phai, nhan }; mũi tên → { dau, cuoi, giua, nhan }; vòng khoanh → { tam, tren, duoi, trai, phai, nhan }.
// Gom từ xuong_html/n87_chung_chi_tien_gui/trang.html:104-105 (check, cross); cách vẽ dần theo xuong_dai/n82_han_muc_quay_vong/src/Chung.tsx:184-203.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // ---------- hàm nội bộ (đề xuất gom vào kho_nen.js) ----------
  // Vẽ dần bằng pathLength=1: không cần đo chiều dài, chạy được khi phần tử chưa gắn vào trang.
  const chuanBiVe = (p) => { p.setAttribute('pathLength', '1'); p.style.strokeDasharray = '1 1'; return p; };
  const veDan = (p, u) => { u = K.cl(u); p.style.strokeDashoffset = (1 - u).toFixed(4); p.style.opacity = u <= 0.001 ? 0 : ''; };
  let demId = 0;
  const idMoi = (goc) => `kho-bt-${goc}-${++demId}`;
  // Thời điểm vào: trả về hàm t → t đã dời (hiện đủ khi tinh).
  const thoiGian = (opt) => (opt.tinh || (opt.vao != null && opt.vao < 0)) ? () => 1e6 : (t) => t - (opt.vao || 0);

  const KHOA_MAC_DINH = { tich: 'tot', gach: 'xau', hoi: 'nhan', cham_than: 'canh_bao', mui_ten: 'chu', mui_ten_cong: 'chu', vong_khoanh: 'nhan' };

  // ---------- các dấu trong ô 100×100 ----------
  // Mỗi dấu: danh sách nét (điểm cho nét tay, d cho kiểu phẳng) và chấm tròn (nếu có).
  const DAU = {
    tich: { net: [{ d: 'M-24 3 L-7 20 L26 -18', diem: [[-24, 3], [-7, 20], [26, -18]] }] },
    gach: { net: [{ d: 'M-18 -18 L18 18', diem: [[-18, -18], [18, 18]] }, { d: 'M18 -18 L-18 18', diem: [[18, -18], [-18, 18]] }] },
    hoi: {
      net: [{ d: 'M-15 -15 A15 15 0 0 1 15 -15 C15 -4 0 -3 0 9', diem: (() => { const a = []; for (let i = 0; i <= 8; i++) { const g = Math.PI + (Math.PI * i) / 8; a.push([15 * Math.cos(g), -15 + 15 * Math.sin(g)]); } return a.concat([[12, -5], [4, 0], [0, 4], [0, 9]]); })() }],
      cham: [0, 25],
    },
    cham_than: { net: [{ d: 'M0 -29 L0 8', diem: [[0, -29], [0, -10], [0, 8]] }], cham: [0, 25] },
  };

  function taoDau(opt) {
    const m = K.layMau(opt), loai = opt.loai, co = opt.co || 1, tay = opt.kieu === 'net_tay', hat = opt.hat || 11;
    const mauNet = m[opt.khoa_mau || KHOA_MAC_DINH[loai]] || m.chu;
    const nen = opt.nen === undefined ? true : opt.nen;
    const mauDau = nen === 'dac' ? (K.tuongPhan(mauNet, '#FFFFFF') >= 2.2 ? '#FFFFFF' : m.chu) : mauNet;
    const g = K.svg('g', { class: 'kho-bieu-tuong' });
    const khoi = K.svg('g', { transform: `scale(${co})` }, g);
    const nay = K.svg('g', null, khoi); // nhóm nảy khi vào
    const dai = opt.dai || 0.5;
    // đĩa nền
    let dia = null;
    if (nen) {
      dia = K.svg('g', null, nay);
      if (!tay) {
        K.svg('circle', { cx: 0, cy: 4, r: 46, fill: '#000', opacity: 0.08 }, dia);
        K.svg('circle', { cx: 0, cy: 0, r: 46, fill: nen === 'dac' ? mauNet : K.rgba(mauNet, 0.14), stroke: nen === 'dac' ? 'none' : K.rgba(mauNet, 0.45), 'stroke-width': 3 }, dia);
      } else {
        const vong = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; vong.push([46 * Math.cos(a), 46 * Math.sin(a)]); }
        const id = idMoi('gach');
        const defs = K.svg('defs', null, dia);
        const pt = K.svg('pattern', { id, width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 9, stroke: mauNet, 'stroke-width': 2.2, opacity: nen === 'dac' ? 0.75 : 0.35 }, pt);
        K.svg('path', { d: K.duongTay(vong, { hat: hat + 3, lech: 1.1, dong: true }), fill: K.rgba(mauNet, nen === 'dac' ? 0.55 : 0.12) }, dia);
        K.svg('path', { d: K.duongTay(vong, { hat: hat + 4, lech: 1.1, dong: true }), fill: `url(#${id})` }, dia);
        K.svg('path', { d: K.duongTay(vong, { hat: hat + 5, lech: 1.8, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4, opacity: 0.8, 'stroke-linecap': 'round' }, dia);
      }
    }
    // nét dấu
    const dn = DAU[loai], netVe = [];
    dn.net.forEach((n, i) => {
      if (!tay) netVe.push([chuanBiVe(K.svg('path', { d: n.d, fill: 'none', stroke: mauDau, 'stroke-width': 11, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, nay))]);
      else netVe.push([
        chuanBiVe(K.svg('path', { d: K.duongTay(n.diem, { hat: hat + 20 + i, lech: 1.8 }), fill: 'none', stroke: mauDau, 'stroke-width': 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, nay)),
        chuanBiVe(K.svg('path', { d: K.duongTay(n.diem, { hat: hat + 40 + i, lech: 2.6 }), fill: 'none', stroke: mauDau, 'stroke-width': 3.5, opacity: 0.5, 'stroke-linecap': 'round' }, nay)),
      ]);
    });
    let cham = null;
    if (dn.cham) {
      cham = K.svg('g', { transform: `translate(${dn.cham[0]} ${dn.cham[1]})` }, nay);
      const chamTrong = K.svg('g', null, cham);
      if (!tay) K.svg('circle', { r: 7, fill: mauDau }, chamTrong);
      else K.svg('path', { d: K.duongTay([[-5, -4], [5, -5], [6, 4], [-4, 6]], { hat: hat + 60, lech: 1, dong: true }), fill: mauDau, stroke: mauDau, 'stroke-width': 2 }, chamTrong);
      cham = chamTrong;
    }
    // nhãn
    let nhan = null;
    const coChu = opt.co_chu || 30, yNhan = 50 * co + coChu + 8;
    if (opt.nhan) nhan = K.chu(g, opt.nhan, { x: 0, y: yNhan, co: coChu, dam: 700, mau: m.chu, neo: 'middle' });
    const T = thoiGian(opt);
    const hd = 50 * co;
    return {
      el: g,
      seek(t) {
        const s = T(t);
        const pNay = K.spr(s, 0.4, 0.6);
        nay.setAttribute('transform', `scale(${(0.55 + 0.45 * pNay).toFixed(4)})`);
        nay.style.opacity = K.cl(s / 0.12).toFixed(3);
        const u = K.eio(K.tienDo(s, nen ? 0.12 : 0, dai));
        const soNet = netVe.length;
        netVe.forEach((ps, i) => ps.forEach((p) => veDan(p, u * soNet - i)));
        if (cham) { const pc = K.spr(s - (nen ? 0.12 : 0) - dai * 0.85, 0.3, 0.55); cham.setAttribute('transform', `scale(${Math.max(0, pc).toFixed(4)})`); }
        if (nhan) { const pn = K.eo3(K.tienDo(s, 0.25, 0.35)); nhan.style.opacity = pn.toFixed(3); nhan.setAttribute('transform', `translate(0 ${((1 - pn) * 10).toFixed(2)})`); }
      },
      moc: { tam: [0, 0], dinh: [0, -hd], day: [0, hd], trai: [-hd, 0], phai: [hd, 0], nhan: [0, yNhan] },
    };
  }

  // ---------- mũi tên ----------
  function taoMuiTen(opt) {
    const m = K.layMau(opt), co = opt.co || 1, tay = opt.kieu === 'net_tay', hat = opt.hat || 17;
    const mauNet = m[opt.khoa_mau || KHOA_MAC_DINH[opt.loai]] || m.chu;
    const [x1, y1] = opt.tu || [0, 0], [x2, y2] = opt.den || [300, 0];
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    const nx = uy, ny = -ux; // pháp tuyến (với mũi tên trái → phải: hướng lên)
    const cong = opt.cong != null ? opt.cong : (opt.loai === 'mui_ten_cong' ? 0.28 : 0);
    const cx = (x1 + x2) / 2 + nx * cong * L, cy = (y1 + y2) / 2 + ny * cong * L; // điểm điều khiển bậc hai
    const day = opt.day || 6 * co, dau = Math.max(16, 22 * co * (day / (6 * co)) ** 0.5);
    const Q = (s) => [(1 - s) * (1 - s) * x1 + 2 * (1 - s) * s * cx + s * s * x2, (1 - s) * (1 - s) * y1 + 2 * (1 - s) * s * cy + s * s * y2];
    // hướng tiếp tuyến ở hai đầu
    const tc = (ax, ay, bx, by) => { const l = Math.hypot(bx - ax, by - ay) || 1; return [(bx - ax) / l, (by - ay) / l]; };
    const [ex, ey] = tc(cx, cy, x2, y2), [sx, sy] = tc(cx, cy, x1, y1);
    const lui = dau * 0.75;
    const a1 = opt.hai_dau ? [x1 - sx * lui, y1 - sy * lui] : [x1, y1];
    const a2 = [x2 - ex * lui, y2 - ey * lui];
    const g = K.svg('g', { class: 'kho-mui-ten' });
    // đường thân: chia điểm để vẽ nét tay
    const diem = []; const N = Math.max(4, Math.round(L / 40));
    for (let i = 0; i <= N; i++) diem.push(Q(i / N));
    diem[0] = a1; diem[N] = a2;
    const dThan = tay ? K.duongTay(diem, { hat, lech: 1.4 }) : `M${a1[0].toFixed(1)} ${a1[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${a2[0].toFixed(1)} ${a2[1].toFixed(1)}`;
    const cs = { fill: 'none', stroke: mauNet, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    let than, thanPhu = null, mat = null;
    if (opt.net_dut) {
      // nét đứt: hiện dần bằng mặt nạ (mask) để không đụng mẫu gạch
      const id = idMoi('mn');
      const defs = K.svg('defs', null, g);
      const mk = K.svg('mask', { id, maskUnits: 'userSpaceOnUse', x: Math.min(x1, x2, cx) - 100, y: Math.min(y1, y2, cy) - 100, width: Math.abs(x2 - x1) + Math.abs(cx - (x1 + x2) / 2) * 2 + 200, height: Math.abs(y2 - y1) + Math.abs(cy - (y1 + y2) / 2) * 2 + 200 }, defs);
      mat = chuanBiVe(K.svg('path', { d: dThan, fill: 'none', stroke: '#fff', 'stroke-width': day * 3, 'stroke-linecap': 'round' }, mk));
      than = K.svg('path', Object.assign({ d: dThan, 'stroke-dasharray': `${day * 2.2} ${day * 2}`, mask: `url(#${id})` }, cs), g);
    } else {
      than = chuanBiVe(K.svg('path', Object.assign({ d: dThan }, cs), g));
      if (tay) thanPhu = chuanBiVe(K.svg('path', { d: K.duongTay(diem, { hat: hat + 9, lech: 2.2 }), fill: 'none', stroke: mauNet, 'stroke-width': day * 0.45, opacity: 0.5, 'stroke-linecap': 'round' }, g));
    }
    // đầu mũi tên
    const taoDauMT = (px, py, dx, dy) => {
      const gd = K.svg('g', { transform: `translate(${px} ${py}) rotate(${(Math.atan2(dy, dx) * 180) / Math.PI})` }, g);
      const tr = K.svg('g', null, gd);
      if (!tay) K.svg('path', { d: `M${dau * 0.25} 0 L${-dau * 0.95} ${-dau * 0.62} Q${-dau * 0.7} 0 ${-dau * 0.95} ${dau * 0.62} Z`, fill: mauNet, stroke: mauNet, 'stroke-width': day * 0.5, 'stroke-linejoin': 'round' }, tr);
      else {
        K.svg('path', { d: K.duongTay([[-dau, -dau * 0.65], [dau * 0.1, 0], [-dau, dau * 0.65]], { hat: hat + 30, lech: 1.3 }), fill: 'none', stroke: mauNet, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, tr);
        K.svg('path', { d: K.duongTay([[-dau * 0.9, -dau * 0.55], [dau * 0.05, 0.5], [-dau * 0.9, dau * 0.6]], { hat: hat + 31, lech: 2 }), fill: 'none', stroke: mauNet, 'stroke-width': day * 0.45, opacity: 0.5, 'stroke-linecap': 'round' }, tr);
      }
      return tr;
    };
    const dauCuoi = taoDauMT(x2, y2, ex, ey);
    const dauDau = opt.hai_dau ? taoDauMT(x1, y1, sx, sy) : null;
    // nhãn ở giữa, lệch về phía võng
    const giua = Q(0.5);
    const coChu = opt.co_chu || 30;
    const huong = cong >= 0 ? 1 : -1;
    const lech = coChu * 0.9 + day;
    const pnx = nx * huong, pny = ny * huong;
    const viTriNhan = [giua[0] + pnx * lech, giua[1] + pny * lech + (pny > 0.3 ? coChu * 0.7 : pny < -0.3 ? 0 : coChu * 0.35)];
    let nhan = null;
    if (opt.nhan) {
      const neo = Math.abs(pnx) < 0.5 ? 'middle' : pnx > 0 ? 'start' : 'end';
      nhan = K.chu(g, opt.nhan, { x: viTriNhan[0], y: viTriNhan[1], co: coChu, dam: 700, mau: m.chu, neo });
      nhan.setAttribute('stroke', m.nen); nhan.setAttribute('stroke-width', 8); nhan.setAttribute('stroke-linejoin', 'round'); nhan.setAttribute('paint-order', 'stroke');
    }
    const T = thoiGian(opt), dai = opt.dai || 0.7;
    return {
      el: g,
      seek(t) {
        const s = T(t), u = K.eio(K.tienDo(s, 0, dai));
        if (mat) { veDan(mat, u); than.style.opacity = u <= 0.001 ? 0 : ''; } else veDan(than, u);
        if (thanPhu) veDan(thanPhu, u);
        const pd = K.spr(s - dai * 0.8, 0.3, 0.6);
        dauCuoi.setAttribute('transform', `scale(${Math.max(0, pd).toFixed(4)})`);
        if (dauDau) dauDau.setAttribute('transform', `scale(${Math.max(0, K.spr(s, 0.3, 0.6)).toFixed(4)})`);
        if (nhan) nhan.style.opacity = K.eo3(K.tienDo(s, dai * 0.5, 0.35)).toFixed(3);
      },
      moc: { dau: [x1, y1], cuoi: [x2, y2], giua, nhan: viTriNhan },
    };
  }

  // ---------- vòng khoanh ----------
  function taoVongKhoanh(opt) {
    const m = K.layMau(opt), co = opt.co || 1, tay = opt.kieu === 'net_tay', hat = opt.hat || 23;
    const mauNet = m[opt.khoa_mau || KHOA_MAC_DINH.vong_khoanh] || m.nhan;
    const h = Array.isArray(opt.hop) ? { x: opt.hop[0], y: opt.hop[1], w: opt.hop[2], h: opt.hop[3] } : (opt.hop || { x: -100, y: -40, w: 200, h: 80 });
    const le = opt.le != null ? opt.le : 18;
    const cx = h.x + h.w / 2, cy = h.y + h.h / 2, rx = h.w / 2 + le + h.h * 0.35, ry = h.h / 2 + le * 0.9 + h.h * 0.12;
    const day = opt.day || 6 * co;
    const g = K.svg('g', { class: 'kho-vong-khoanh' });
    // vòng hơi xoáy: bắt đầu ở góc trên trái, đi hết một vòng rồi vượt thêm một đoạn, bán kính co nhẹ như khoanh tay
    const diem = (vuot, coRut, lechGoc) => {
      const a = [], n = 64, a0 = -Math.PI * 0.62 + lechGoc;
      for (let i = 0; i <= n; i++) {
        const p = i / n, goc = a0 + p * Math.PI * 2 * (1 + vuot), k = 1 + coRut * (0.5 - p);
        a.push([cx + rx * k * Math.cos(goc), cy + ry * k * Math.sin(goc)]);
      }
      return a;
    };
    const toD = (a) => 'M' + a.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
    const cs = { fill: 'none', stroke: mauNet, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    const vong = [];
    if (!tay) vong.push(chuanBiVe(K.svg('path', Object.assign({ d: toD(diem(0, 0, 0)) + ' Z' }, cs), g)));
    else {
      vong.push(chuanBiVe(K.svg('path', Object.assign({ d: K.duongTay(diem(0.14, 0.09, 0).filter((_, i) => i % 2 === 0), { hat, lech: 2.2 }) }, cs, { 'stroke-width': day * 0.85 }), g)));
      vong.push(chuanBiVe(K.svg('path', { d: K.duongTay(diem(0.1, 0.12, 0.08).filter((_, i) => i % 2 === 0), { hat: hat + 5, lech: 3 }), fill: 'none', stroke: mauNet, 'stroke-width': day * 0.4, opacity: 0.55, 'stroke-linecap': 'round' }, g)));
    }
    const coChu = opt.co_chu || 30;
    const viTriNhan = [cx, cy - ry - 18];
    let nhan = null;
    if (opt.nhan) {
      nhan = K.chu(g, opt.nhan, { x: viTriNhan[0], y: viTriNhan[1], co: coChu, dam: 700, mau: mauNet, neo: 'middle' });
      nhan.setAttribute('stroke', m.nen); nhan.setAttribute('stroke-width', 8); nhan.setAttribute('stroke-linejoin', 'round'); nhan.setAttribute('paint-order', 'stroke');
    }
    const T = thoiGian(opt), dai = opt.dai || 0.7;
    return {
      el: g,
      seek(t) {
        const s = T(t), u = K.eio(K.tienDo(s, 0, dai));
        vong.forEach((p) => veDan(p, u));
        if (nhan) nhan.style.opacity = K.eo3(K.tienDo(s, dai * 0.7, 0.35)).toFixed(3);
      },
      moc: { tam: [cx, cy], tren: [cx, cy - ry], duoi: [cx, cy + ry], trai: [cx - rx, cy], phai: [cx + rx, cy], nhan: viTriNhan },
    };
  }

  K.bo_bieu_tuong_co_ban = function (opt) {
    opt = Object.assign({ kieu: 'phang', loai: 'tich' }, opt || {});
    if (DAU[opt.loai]) return taoDau(opt);
    if (opt.loai === 'mui_ten' || opt.loai === 'mui_ten_cong') return taoMuiTen(opt);
    if (opt.loai === 'vong_khoanh') return taoVongKhoanh(opt);
    throw new Error('KHO.bo_bieu_tuong_co_ban: không có loại ' + opt.loai);
  };
  const biDanh = { dau_tich: 'tich', dau_gach: 'gach', dau_hoi: 'hoi', dau_cham_than: 'cham_than', mui_ten: 'mui_ten', mui_ten_cong: 'mui_ten_cong', vong_khoanh: 'vong_khoanh' };
  for (const ten in biDanh) K[ten] = (opt) => K.bo_bieu_tuong_co_ban(Object.assign({}, opt, { loai: biDanh[ten] }));
})();
