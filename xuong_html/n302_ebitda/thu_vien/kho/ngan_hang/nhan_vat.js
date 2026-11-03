// ngan_hang/nhan_vat.js — 1.1 — bộ nhân vật dáng chung kiểu đồ hoạ giải thích (đầu tròn, thân khối, không vẽ mặt): khách hàng, cán bộ tín dụng, giao dịch viên, chủ doanh nghiệp; bốn tư thế.
// Gọi: KHO.khach_hang_ca_nhan({ vai, tu_the, huong, toc, nhan, kieu, co, mau, vao, moc_tu_the, tinh, hat }); bí danh KHO.nhan_vat.
//   vai 'khach_hang' (áo thun có cổ, túi đeo chéo) | 'can_bo_tin_dung' (sơ mi, cà vạt, kẹp hồ sơ) | 'giao_dich_vien' (áo vest, thẻ tên, tóc dài) | 'chu_doanh_nghiep' (com lê, cà vạt, cặp tài liệu);
//   tu_the 'dung' | 'chi_tay' (tay trước chỉ về phía huong, chớp tay định kỳ) | 'cam_giay' (hai tay cầm tờ giấy trước ngực) | 'suy_nghi' (tay chống cằm, đầu nghiêng);
//   huong 1 (quay phải, mặc định) | -1 (quay trái); toc 'ngan' | 'dai' (mặc định theo vai); nhan: chữ dưới chân (ví dụ 'Khách hàng'), không bắt buộc;
//   kieu 'phang' | 'net_tay'; co: tỉ lệ; vao: giây xuất hiện (mặc định 0; -1 hiện đủ); moc_tu_the: giây bắt đầu chuyển từ đứng sang tư thế (mặc định vao + 0,35); tinh: true hiện đủ.
// Kích thước chuẩn: gốc toạ độ ở giữa hai bàn chân (mặt đất), nhân vật cao 362 đơn vị (đỉnh đầu y = −362).
// Trả về { el, seek(t), moc }: moc { day, dinh, dau (tâm đầu), nguc, tay (bàn tay trước, theo tư thế cuối), dau_chi (đầu ngón chỉ với chi_tay), giay (tâm tờ giấy với cam_giay), nhan, tren_dau (chỗ đặt bong bóng lời) } — đã nhân co và hướng.
// Chuyển động: hiện bằng lò xo từ chân, thở nhẹ (thân trên nâng hạ chu kỳ 3,2 giây), tay chuyển vào tư thế, chi_tay chớp tay mỗi 2,4 giây.
// Gom từ xuong_html/n87_chung_chi_tien_gui/trang.html:102 (person: đầu tròn, thân khối), nâng cấp thành bộ nhân vật có trang phục, tư thế.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;

  function boVe(g, tay, m, hat0) {
    let hat = hat0;
    const da = (cha, pts, o = {}) => {
      const net = o.net === undefined ? m.vien : o.net, day = o.day || 3;
      if (!tay) {
        const d = o.d || 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
        return K.svg('path', { d, fill: o.to || 'none', stroke: net || 'none', 'stroke-width': day, 'stroke-linejoin': 'round' }, cha);
      }
      const nhom = K.svg('g', null, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.7, dong: true }), fill: o.to }, nhom);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.1, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.85, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, nhom);
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.8, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.4, opacity: 0.45, 'stroke-linecap': 'round' }, nhom);
      }
      return nhom;
    };
    const tron = (cha, cx, cy, r, o = {}) => {
      if (!tay) return K.svg('circle', { cx, cy, r, fill: o.to || 'none', stroke: o.net === undefined ? m.vien : (o.net || 'none'), 'stroke-width': o.day || 3 }, cha);
      const pts = []; const n = Math.max(12, Math.round(r / 2.2));
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      return da(cha, pts, o);
    };
    // đường cong kín cho kiểu phẳng (tóc, thân) — kiểu nét tay lấy mẫu điểm của đường đó
    const congKin = (cha, d, pts, o = {}) => da(cha, pts, Object.assign({}, o, { d }));
    return { da, tron, congKin, hat: () => hat++ };
  }

  // giải hai đoạn xương (vai → khuỷu → bàn tay): trả về khuỷu
  function khuyu(S, H, a, b, chieu) {
    let dx = H[0] - S[0], dy = H[1] - S[1], d = Math.hypot(dx, dy);
    const dMax = a + b - 0.5; if (d > dMax) { dx *= dMax / d; dy *= dMax / d; d = dMax; }
    const goc = Math.atan2(dy, dx), A = Math.acos(K.cl((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    return [S[0] + a * Math.cos(goc + chieu * A), S[1] + a * Math.sin(goc + chieu * A)];
  }

  // tư thế: vị trí bàn tay phải (R, phía trước khi huong = 1) và trái (L), kèm chiều gập khuỷu
  const TU_THE = {
    dung: { R: [58, -150, -1], L: [-58, -150, 1], nghieng: 0 },
    chi_tay: { R: [176, -262, 1], L: [-58, -150, 1], nghieng: 0 },
    cam_giay: { R: [50, -196, -1], L: [-50, -196, 1], nghieng: 0 },
    suy_nghi: { R: [16, -290, -1], L: [6, -196, 1], nghieng: -7 },
  };
  const VAI_TOC = { khach_hang: 'ngan', can_bo_tin_dung: 'ngan', giao_dich_vien: 'dai', chu_doanh_nghiep: 'ngan' };
  const S_R = [46, -262], S_L = [-46, -262], A_TREN = 64, A_DUOI = 62;

  K.khach_hang_ca_nhan = function (opt) {
    opt = Object.assign({ vai: 'khach_hang', tu_the: 'dung', huong: 1, kieu: 'phang', co: 1 }, opt || {});
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co, huong = opt.huong < 0 ? -1 : 1, vai = opt.vai;
    const toc = opt.toc || VAI_TOC[vai] || 'ngan';
    const tt = TU_THE[opt.tu_the] || TU_THE.dung;
    const g = K.svg('g', { class: 'kho-nhan-vat' });
    const khoi = K.svg('g', { transform: `scale(${co * huong} ${co})` }, g);
    const hien = K.svg('g', null, khoi);
    const B = boVe(hien, tay, m, opt.hat || 51);

    // ---------- bảng trang phục ----------
    const toi = K.tron(m.chu_phu, m.chu, 0.45);          // quần, com lê
    const mauToc = K.tron(m.chu, m.da, m.toi ? 0.55 : 0.12);
    const nau = K.tron(m.canh_bao, m.chu, 0.4);          // da thuộc: túi, cặp, kẹp
    const tp = {
      khach_hang: { ao: m.nhan_phu, tay_ao: m.nhan_phu, quan: toi },
      can_bo_tin_dung: { ao: m.the, tay_ao: m.the, quan: toi, ca_vat: m.nhan },
      giao_dich_vien: { ao: m.nhan, tay_ao: m.nhan, quan: toi, so_mi: m.the, the_ten: true },
      chu_doanh_nghiep: { ao: toi, tay_ao: toi, quan: toi, so_mi: m.the, ca_vat: m.nhan },
    }[vai] || { ao: m.nhan_phu, tay_ao: m.nhan_phu, quan: toi };
    const giayDep = K.tron(m.vien, m.chu_phu, 0.25);

    // bóng dưới chân
    K.svg('ellipse', { cx: 0, cy: 2, rx: 62, ry: 9, fill: '#000', opacity: 0.1 }, hien);
    // ---------- chân ----------
    B.da(hien, [[-42, -154], [42, -154], [42, -118], [-42, -118]], { to: tp.quan });
    B.da(hien, [[-40, -124], [-4, -124], [-6, -14], [-36, -14]], { to: tp.quan });
    B.da(hien, [[4, -124], [40, -124], [36, -14], [6, -14]], { to: tp.quan });
    B.da(hien, [[-40, -18], [-6, -18], [-2, -6], [-4, 0], [-44, 0], [-46, -8]], { to: giayDep });
    B.da(hien, [[6, -18], [40, -18], [50, -8], [48, 0], [4, 0], [2, -6]], { to: giayDep });

    // ---------- thân trên (thở) ----------
    const than = K.svg('g', null, hien);
    // tóc dài phía sau đầu
    const tocSau = K.svg('g', null, than);
    if (toc === 'dai') B.da(tocSau, [[-44, -334], [-48, -300], [-50, -262], [-30, -258], [30, -258], [50, -262], [48, -300], [44, -334], [0, -352]], { to: mauToc });
    // thân
    const ptsThan = [[-56, -258], [-50, -276], [-34, -282], [34, -282], [50, -276], [56, -258], [48, -146], [-48, -146]];
    B.da(than, ptsThan, { to: tp.ao });
    if (!tay) K.svg('path', { d: 'M20 -272 L44 -270 L40 -150 L30 -150 Z', fill: '#000', opacity: 0.07 }, than);
    else K.svg('path', { d: K.duongTay([[26, -270], [42, -152]], { hat: 77, lech: 1 }) + ' ' + K.duongTay([[34, -268], [48, -170]], { hat: 78, lech: 1 }), stroke: m.vien, 'stroke-width': 1.6, opacity: 0.35, fill: 'none' }, than);
    // cổ
    B.da(than, [[-11, -300], [11, -300], [11, -280], [-11, -280]], { to: m.da });
    // cổ áo, cà vạt, thẻ tên
    if (tp.so_mi) {
      B.da(than, [[-22, -282], [22, -282], [0, -228]], { to: tp.so_mi, day: 2.5 });
      B.da(than, [[-22, -282], [-8, -282], [-2, -236], [-30, -262]], { to: K.tron(tp.ao, '#FFFFFF', 0.12), day: 2.5 });
      B.da(than, [[22, -282], [8, -282], [2, -236], [30, -262]], { to: K.tron(tp.ao, '#FFFFFF', 0.12), day: 2.5 });
    } else {
      B.da(than, [[-18, -284], [0, -268], [-6, -258], [-24, -276]], { to: K.tron(tp.ao, '#FFFFFF', 0.3), day: 2.5 });
      B.da(than, [[18, -284], [0, -268], [6, -258], [24, -276]], { to: K.tron(tp.ao, '#FFFFFF', 0.3), day: 2.5 });
    }
    if (tp.ca_vat) B.da(than, [[-6, -276], [6, -276], [10, vai === 'can_bo_tin_dung' ? -196 : -232], [0, vai === 'can_bo_tin_dung' ? -184 : -222], [-10, vai === 'can_bo_tin_dung' ? -196 : -232]], { to: tp.ca_vat, day: 2.5 });
    if (vai === 'can_bo_tin_dung') { K.svg('line', { x1: 0, y1: -180, x2: 0, y2: -150, stroke: m.vien, 'stroke-width': 1.6, opacity: 0.35 }, than); B.da(than, [[22, -244], [42, -244], [42, -222], [22, -222]], { to: K.tron(m.the, m.nen_phu, 0.4), day: 2 }); }
    if (tp.the_ten) { B.da(than, [[-44, -240], [-18, -240], [-18, -224], [-44, -224]], { to: m.the, day: 2 }); K.svg('line', { x1: -40, y1: -232, x2: -22, y2: -232, stroke: m.nhan, 'stroke-width': 3 }, than); }
    // túi đeo chéo của khách hàng
    let tuiDeo = null;
    if (vai === 'khach_hang') {
      tuiDeo = K.svg('g', null, than);
      K.svg('path', { d: tay ? K.duongTay([[-40, -276], [10, -214], [58, -164]], { hat: 81, lech: 1 }) : 'M-40 -276 L58 -164', stroke: nau, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, tuiDeo);
      B.da(tuiDeo, [[36, -170], [84, -170], [86, -122], [34, -122]], { to: nau });
      B.da(tuiDeo, [[36, -170], [84, -170], [80, -148], [40, -148]], { to: K.tron(nau, '#000000', 0.15), day: 2.5 });
    }
    // đầu: vẽ sau thân để cổ nằm dưới cằm, không đè lên mặt (sửa 1.1)
    const dau = K.svg('g', null, than);
    B.tron(dau, 0, -324, 38, { to: m.da });
    if (!tay) K.svg('path', { d: 'M24 -346 A38 38 0 0 1 24 -302 A34 34 0 0 0 24 -346 Z', fill: '#000', opacity: 0.06 }, dau);
    // tóc trước: chỏm tóc, rẽ về phía trước
    B.da(dau, [[-40, -318], [-42, -340], [-30, -358], [-8, -366], [16, -364], [34, -354], [42, -336], [40, -320], [28, -338], [6, -344], [-18, -340], [-32, -330]], { to: mauToc });
    // ---------- hai tay (vẽ lại mỗi khung theo tư thế) ----------
    const vePath = (cha, w, mau) => K.svg('path', { fill: 'none', stroke: mau, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cha);
    const taoTay = (cha) => {
      const nhom = K.svg('g', null, cha);
      const vien = vePath(nhom, 30, m.vien), ao = vePath(nhom, 24, tp.tay_ao);
      const phu = tay ? vePath(nhom, 1.4, m.vien) : null;
      if (phu) phu.setAttribute('opacity', 0.5);
      return { nhom, vien, ao, phu };
    };
    const tayL = taoTay(than);
    // tờ giấy (cam_giay), kẹp hồ sơ, cặp
    let toGiay = null;
    if (opt.tu_the === 'cam_giay') {
      toGiay = K.svg('g', null, than);
      B.da(toGiay, [[-56, -78], [56, -78], [56, 78], [-56, 78]], { to: m.giay });
      for (let i = 0; i < 5; i++) K.svg('line', { x1: -38, y1: -46 + i * 22, x2: i === 4 ? 6 : 38, y2: -46 + i * 22, stroke: m.chu_phu, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.45 }, toGiay);
      K.svg('rect', { x: -38, y: -66, width: 50, height: 9, rx: 3, fill: m.nhan, opacity: 0.85 }, toGiay);
    }
    const tayR = taoTay(than);
    const banTay = (cha) => B.tron(cha, 0, 0, 13, { to: m.da, day: 2.5 });
    const gL = K.svg('g', null, than), gR = K.svg('g', null, than);
    let vatL = null;
    if (vai === 'can_bo_tin_dung' && opt.tu_the !== 'cam_giay') {
      vatL = K.svg('g', null, gL);
      const kep = K.svg('g', { transform: 'rotate(-8) translate(-30 -6)' }, vatL);
      B.da(kep, [[0, 0], [52, 0], [52, 66], [0, 66]], { to: nau });
      B.da(kep, [[6, 8], [46, 8], [46, 60], [6, 60]], { to: m.giay, day: 2 });
      B.da(kep, [[16, -5], [36, -5], [36, 6], [16, 6]], { to: K.tron(m.chu_phu, '#FFFFFF', 0.3), day: 2 });
      for (let i = 0; i < 3; i++) K.svg('line', { x1: 12, y1: 22 + i * 12, x2: 40, y2: 22 + i * 12, stroke: m.chu_phu, 'stroke-width': 3, opacity: 0.5 }, kep);
    }
    if (vai === 'chu_doanh_nghiep') {
      vatL = K.svg('g', null, gL);
      K.svg('path', { d: 'M-14 6 L-14 -4 Q-14 -10 -8 -10 L8 -10 Q14 -10 14 -4 L14 6', fill: 'none', stroke: m.vien, 'stroke-width': 5, 'stroke-linecap': 'round' }, vatL);
      B.da(vatL, [[-40, 4], [40, 4], [40, 58], [-40, 58]], { to: nau });
      K.svg('line', { x1: -40, y1: 22, x2: 40, y2: 22, stroke: m.vien, 'stroke-width': 2.5, opacity: 0.55 }, vatL);
      B.da(vatL, [[-6, 16], [6, 16], [6, 28], [-6, 28]], { to: m.canh_bao, day: 2 });
    }
    banTay(gL); banTay(gR);
    let ngon = null;
    if (opt.tu_the === 'chi_tay') ngon = K.svg('path', { d: 'M6 -4 L26 -6', stroke: m.da, 'stroke-width': 8, 'stroke-linecap': 'round', fill: 'none' }, gR);
    if (ngon) { const vn = K.svg('path', { d: 'M6 -4 L26 -6', stroke: m.vien, 'stroke-width': 13, 'stroke-linecap': 'round', fill: 'none' }); gR.insertBefore(vn, ngon); }

    // nhãn dưới chân (không lật theo hướng)
    let nhanEl = null;
    const coChu = opt.co_chu || 30, yNhan = 12 * co + coChu + 8;
    if (opt.nhan) nhanEl = K.chu(g, opt.nhan, { x: 0, y: yNhan, co: coChu, dam: 700, mau: m.chu, neo: 'middle' });

    const tinh = opt.tinh || (opt.vao != null && opt.vao < 0), vao = opt.vao || 0;
    const mocTT = opt.moc_tu_the != null ? opt.moc_tu_the : vao + 0.35;
    const D = TU_THE.dung;
    const capNhatTay = (tt2, S, H, chieu) => {
      const E = khuyu(S, H, A_TREN, A_DUOI, chieu);
      const d = tay ? K.duongTay([S, E, H], { hat: 90 + (S[0] > 0 ? 1 : 0), lech: 0.8 }) : `M${S[0].toFixed(1)} ${S[1].toFixed(1)} L${E[0].toFixed(1)} ${E[1].toFixed(1)} L${H[0].toFixed(1)} ${H[1].toFixed(1)}`;
      tt2.vien.setAttribute('d', d); tt2.ao.setAttribute('d', d); if (tt2.phu) tt2.phu.setAttribute('d', d);
    };
    const tron2 = (a, b, p) => [K.lerp(a[0], b[0], p), K.lerp(a[1], b[1], p)];
    const kq = {
      el: g,
      seek(t) {
        const s = tinh ? 1e6 : t - vao;
        const pv = K.spr(s, 0.5, 0.6);
        hien.setAttribute('transform', `scale(${(0.86 + 0.14 * pv).toFixed(4)} ${(0.8 + 0.2 * pv).toFixed(4)})`);
        hien.style.opacity = K.cl(s / 0.15).toFixed(3);
        // thở
        const tho = tinh ? 0 : -1.6 * (1 - Math.cos((2 * Math.PI * Math.max(0, s)) / 3.2));
        // tư thế
        const pt = tinh ? 1 : K.eio(K.tienDo(t, mocTT, 0.5));
        let HR = tron2(D.R, tt.R, pt), HL = tron2(D.L, tt.L, pt);
        const chieuR = pt < 0.5 ? D.R[2] : tt.R[2], chieuL = pt < 0.5 ? D.L[2] : tt.L[2];
        if (opt.tu_the === 'chi_tay' && !tinh) {
          const q = (((t - mocTT - 0.5) % 2.4) + 2.4) % 2.4 / 2.4;
          const chop = t > mocTT + 0.5 && q < 0.35 ? Math.sin((q / 0.35) * Math.PI * 2) * 10 : 0;
          HR = [HR[0], HR[1] - chop];
        }
        const nghieng = tt.nghieng * pt;
        than.setAttribute('transform', `translate(0 ${tho.toFixed(2)})`);
        dau.setAttribute('transform', `rotate(${nghieng.toFixed(2)} 0 -296)`);
        tocSau.setAttribute('transform', `rotate(${nghieng.toFixed(2)} 0 -296)`);
        capNhatTay(tayR, S_R, HR, chieuR); capNhatTay(tayL, S_L, HL, chieuL);
        gR.setAttribute('transform', `translate(${HR[0].toFixed(1)} ${HR[1].toFixed(1)})`);
        gL.setAttribute('transform', `translate(${HL[0].toFixed(1)} ${HL[1].toFixed(1)})`);
        if (toGiay) { const cx = (HR[0] + HL[0]) / 2, cy = (HR[1] + HL[1]) / 2 - 22; toGiay.setAttribute('transform', `translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${(-4 * pt).toFixed(2)})`); toGiay.style.opacity = K.cl((pt - 0.3) / 0.4).toFixed(3); }
        if (ngon) ngon.parentNode && (ngon.style.opacity = pt > 0.8 ? 1 : 0, ngon.previousSibling.style.opacity = pt > 0.8 ? 1 : 0);
        if (nhanEl) nhanEl.style.opacity = K.eo3(K.tienDo(s, 0.3, 0.35)).toFixed(3);
      },
      moc: {
        day: [0, 0], dinh: [0, -362 * co], dau: [0, -324 * co], nguc: [0, -230 * co],
        tay: [tt.R[0] * co * huong, tt.R[1] * co], dau_chi: [(tt.R[0] + 28) * co * huong, (tt.R[1] - 6) * co],
        giay: [0, -218 * co], nhan: [0, yNhan], tren_dau: [40 * co * huong, -400 * co],
      },
    };
    return kq;
  };
  K.nhan_vat = K.khach_hang_ca_nhan;
})();
