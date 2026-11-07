// ngan_hang/toa_nha_ngan_hang.js — 1.0 — toà nhà ngân hàng không nhận diện thương hiệu: trụ sở cột kiểu cổ điển, chi nhánh mặt phố, hội sở cao tầng; mọc lên từ đáy.
// Gọi: KHO.toa_nha_ngan_hang({ loai, nhan, kieu, co, mau, vao, tinh, hat })
//   loai 'tru_so' (mặc định, rộng 440, cao 400) | 'chi_nhanh' (rộng 360, cao 260) | 'hoi_so' (rộng 440, cao 640);
//   nhan: chữ trên biển, mặc định 'Ngân hàng A' (không dùng tên ngân hàng thật); kieu 'phang' | 'net_tay'; co: tỉ lệ (mặc định 1);
//   vao: giây bắt đầu mọc (mặc định 0; -1 hiện đủ); tinh: true hiện đủ; hat: hạt giống nét tay.
// Kích thước chuẩn: gốc toạ độ ở giữa chân toà nhà (mặt đất), toà nhà nằm phía trên (y âm). Trụ sở cao 400 đơn vị.
// Trả về { el, seek(t), moc }: moc { day, dinh, tam, trai, phai, cua, bien } (đã nhân co); bien là tâm biển chữ.
// Sau khi vào: hội sở có vệt sáng lướt qua mặt kính, các loại khác đứng yên.
// Gom từ xuong_html/n87_chung_chi_tien_gui/trang.html:103 (building): khối mái dốc, hai hàng cửa sổ, cửa chính giữa; nâng thành ba loại.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;

  // Bộ vẽ hình khối dùng chung trong file: kiểu phẳng là nét sạch, kiểu nét tay là nét chì đôi, tô loang, gạch chéo.
  function boVe(g, tay, m, hat0) {
    let hat = hat0;
    const defs = K.svg('defs', null, g), dsMau = {};
    const gach = (mau, mo, goc = 35, buoc = 8) => {
      const k = mau + mo + goc + buoc;
      if (!dsMau[k]) {
        const id = `kho-tn-g${++demId}`;
        const p = K.svg('pattern', { id, width: buoc, height: buoc, patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${goc})` }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: buoc, stroke: mau, 'stroke-width': 1.8, opacity: mo }, p);
        dsMau[k] = `url(#${id})`;
      }
      return dsMau[k];
    };
    // da(cha, điểm, { to, net, day, gach: [màu, độ mờ], bo })
    const da = (cha, pts, o = {}) => {
      const net = o.net === undefined ? m.vien : o.net, day = o.day || 3;
      if (!tay) {
        const d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
        return K.svg('path', { d, fill: o.to || 'none', stroke: net || 'none', 'stroke-width': day, 'stroke-linejoin': 'round' }, cha);
      }
      const nhom = K.svg('g', null, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: o.to, opacity: o.mo_to != null ? o.mo_to : 0.9 }, nhom);
      if (o.gach) K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: gach(o.gach[0], o.gach[1]) }, nhom);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.3, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.85, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, nhom);
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 2, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.4, opacity: 0.45, 'stroke-linecap': 'round' }, nhom);
      }
      return nhom;
    };
    const cn = (cha, x, y, w, h, o = {}) => {
      if (!tay && o.bo) return K.svg('rect', { x, y, width: w, height: h, rx: o.bo, fill: o.to || 'none', stroke: o.net === undefined ? m.vien : (o.net || 'none'), 'stroke-width': o.day || 3 }, cha);
      return da(cha, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o);
    };
    return { da, cn, gach, defs };
  }

  K.toa_nha_ngan_hang = function (opt) {
    opt = Object.assign({ loai: 'tru_so', kieu: 'phang', co: 1, nhan: 'Ngân hàng A' }, opt || {});
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co, loai = opt.loai;
    const g = K.svg('g', { class: 'kho-toa-nha' });
    const khoi = K.svg('g', { transform: `scale(${co})` }, g);
    const B = boVe(khoi, tay, m, opt.hat || 31);
    const tuong = m.the, tuongToi = K.tron(m.the, m.nen_phu, 0.7), kinh = K.tron(m.nhat, m.the, 0.25);
    const bong = (cha, x, y, w, h) => (tay ? B.cn(cha, x, y, w, h, { net: null, gach: [m.chu, 0.28] }) : K.svg('rect', { x, y, width: w, height: h, fill: '#000', opacity: 0.08 }, cha));
    const nhomThan = K.svg('g', null, khoi);   // thân: mọc lên theo chiều cao
    const nhomMai = K.svg('g', null, khoi);    // mái: rơi xuống sau cùng
    const nhomBien = K.svg('g', null, khoi);   // biển chữ
    let H, W, cua, bien, rongBien, kinhClip = null, vetSang = null;
    // mặt đất mờ dưới chân
    const dat = K.svg('ellipse', { cx: 0, cy: 2, rx: 0, ry: 10, fill: '#000', opacity: 0.1 });
    khoi.insertBefore(dat, nhomThan);

    const bienChu = (cx, cy, w, h, nen) => {
      const mauChu = nen ? K.chuTren(nen, '#FFFFFF', m.chu) : m.chu;
      const coLon = Math.min(34, h * 0.68), coChu = K.coVua(opt.nhan, w - 24, coLon, 700, 22);
      if (K.doChu(opt.nhan, coChu, 700) <= w - 24) return K.chu(nhomBien, opt.nhan, { x: cx, y: cy + coChu * 0.36, co: coChu, dam: 700, mau: mauChu, neo: 'middle' });
      // dài quá: hai dòng, cỡ 22 trở lên
      const co2 = Math.max(22, Math.min(coLon, Math.floor((h - 4) / 2.2)));
      const e = K.chuNhieuDong(nhomBien, opt.nhan, { x: cx, y: cy - co2 * 0.55 + co2 * 0.36, co: co2, dam: 700, mau: mauChu, neo: 'middle', rong: w - 24, gian_dong: 1.1 });
      return e;
    };

    if (loai === 'chi_nhanh') {
      W = 360; H = 260;
      bong(nhomThan, -170, -232, 340, 232);
      B.cn(nhomThan, -170, -236, 340, 236, { to: tuong });
      B.cn(nhomThan, -180, -260, 360, 26, { to: tuongToi, bo: 4 });          // tường chắn mái
      B.cn(nhomThan, -150, -214, 300, 52, { to: m.nhan, bo: 6 });              // biển
      bien = [0, -188]; rongBien = 300;
      // mái hiên kẻ sọc
      const hien = K.svg('g', null, nhomThan);
      for (let i = 0; i < 6; i++) B.da(hien, [[-160 + i * 53.3, -150], [-160 + (i + 1) * 53.3, -150], [-160 + (i + 1) * 53.3 + 4, -126], [-160 + i * 53.3 + 4, -126]], { to: i % 2 ? m.the : m.nhan_phu, day: 2.5 });
      // cửa kính và hai ô kính
      B.cn(nhomThan, -150, -116, 92, 104, { to: kinh });
      B.cn(nhomThan, 58, -116, 92, 104, { to: kinh });
      B.cn(nhomThan, -40, -120, 80, 120, { to: tuongToi });
      B.cn(nhomThan, -32, -112, 30, 112, { to: kinh, day: 2.5 });
      B.cn(nhomThan, 2, -112, 30, 112, { to: kinh, day: 2.5 });
      [[-150, -116], [58, -116]].forEach(([x, y]) => K.svg('path', { d: `M${x + 18} ${y + 70} L${x + 60} ${y + 18}`, stroke: '#FFFFFF', 'stroke-width': 6, opacity: 0.55, 'stroke-linecap': 'round' }, nhomThan));
      cua = [0, -60];
      B.cn(nhomThan, -180, -12, 360, 12, { to: tuongToi, bo: 3 });             // bậc thềm
      dat.setAttribute('rx', 200);
    } else if (loai === 'hoi_so') {
      W = 440; H = 640;
      // tháp
      const thap = K.svg('g', null, nhomThan);
      bong(thap, 40, -600, 90, 440);
      B.cn(thap, -130, -604, 260, 444, { to: tuongToi });
      const hangKinh = K.svg('g', null, thap);
      for (let r = 0; r < 10; r++) for (let c = 0; c < 5; c++) B.cn(hangKinh, -112 + c * 46, -588 + r * 42, 34, 30, { to: kinh, day: 2, bo: 2 });
      // vệt sáng lướt qua mặt kính (cắt theo khung tháp)
      const idc = `kho-tn-c${++demId}`;
      const cp = K.svg('clipPath', { id: idc }, B.defs);
      K.svg('rect', { x: -130, y: -604, width: 260, height: 444 }, cp);
      kinhClip = K.svg('g', { 'clip-path': `url(#${idc})` }, thap);
      vetSang = K.svg('path', { d: 'M-60 -700 L0 -700 L-200 -60 L-260 -60 Z', fill: '#FFFFFF', opacity: tay ? 0.18 : 0.22 }, kinhClip);
      // đỉnh tháp
      B.cn(thap, -142, -628, 284, 26, { to: m.nhan_phu, bo: 4 });
      B.cn(thap, -20, -640, 40, 14, { to: tuongToi, bo: 3 });
      // khối đế
      bong(nhomThan, 120, -160, 90, 160);
      B.cn(nhomThan, -210, -160, 420, 160, { to: tuong });
      B.cn(nhomThan, -220, -176, 440, 50, { to: m.nhan, bo: 6 });               // biển đế
      bien = [0, -151]; rongBien = 420;
      for (const x of [-180, -120, 90, 150]) B.cn(nhomThan, x, -108, 34, 80, { to: kinh, day: 2.5, bo: 2 });
      B.cn(nhomThan, -48, -116, 96, 116, { to: tuongToi });
      B.cn(nhomThan, -40, -108, 38, 108, { to: kinh, day: 2.5 });
      B.cn(nhomThan, 2, -108, 38, 108, { to: kinh, day: 2.5 });
      cua = [0, -58];
      B.cn(nhomThan, -226, -12, 452, 12, { to: tuongToi, bo: 3 });
      dat.setAttribute('rx', 250);
    } else {
      // trụ sở cột kiểu cổ điển
      W = 440; H = 400;
      B.cn(nhomThan, -220, -12, 440, 12, { to: tuongToi, bo: 2 });
      B.cn(nhomThan, -205, -24, 410, 12, { to: tuongToi, bo: 2 });
      B.cn(nhomThan, -190, -36, 380, 12, { to: tuong, bo: 2 });
      B.cn(nhomThan, -170, -250, 340, 214, { to: tuongToi });                  // tường sau hàng cột
      cua = [0, -95];
      B.cn(nhomThan, -34, -160, 68, 124, { to: m.nhan_phu, bo: tay ? 0 : 4 });
      K.svg('line', { x1: 0, y1: -156, x2: 0, y2: -40, stroke: m.vien, 'stroke-width': 2.5, opacity: 0.6 }, nhomThan);
      for (const x of [-112, 112]) { B.cn(nhomThan, x - 20, -186, 40, 64, { to: kinh, day: 2.5 }); K.svg('line', { x1: x, y1: -186, x2: x, y2: -122, stroke: m.vien, 'stroke-width': 2, opacity: 0.6 }, nhomThan); B.cn(nhomThan, x - 20, -106, 40, 50, { to: kinh, day: 2.5 }); }
      for (const x of [-158, -66, 66, 158]) {
        bong(nhomThan, x + 4, -232, 12, 186);
        B.cn(nhomThan, x - 16, -236, 32, 192, { to: tuong });
        if (!tay) for (const dx of [-7, 0, 7]) K.svg('line', { x1: x + dx, y1: -226, x2: x + dx, y2: -54, stroke: m.vien, 'stroke-width': 1.5, opacity: 0.25 }, nhomThan);
        B.cn(nhomThan, x - 22, -48, 44, 12, { to: tuong, bo: 2 });
        B.cn(nhomThan, x - 22, -250, 44, 14, { to: tuong, bo: 2 });
      }
      B.cn(nhomThan, -200, -300, 400, 50, { to: tuong, bo: tay ? 0 : 3 });       // diềm có biển chữ
      bien = [0, -275]; rongBien = 380;
      // mái tam giác
      B.da(nhomMai, [[-212, -300], [0, -392], [212, -300]], { to: m.nhan, gach: tay ? [m.chu, 0.25] : null });
      B.da(nhomMai, [[-160, -310], [0, -378], [160, -310]], { to: K.tron(m.nhan, '#FFFFFF', 0.25), net: null });
      if (tay) K.svg('circle', { cx: 0, cy: -335, r: 15, fill: 'none', stroke: m.vien, 'stroke-width': 2.5 }, nhomMai);
      else K.svg('circle', { cx: 0, cy: -335, r: 15, fill: m.the, stroke: m.vien, 'stroke-width': 2.5 }, nhomMai);
      B.cn(nhomMai, -218, -306, 436, 10, { to: tuongToi, bo: 2 });
      dat.setAttribute('rx', 250);
    }
    const nhanEl = bienChu(bien[0], bien[1], rongBien, loai === 'tru_so' ? 46 : 50, loai === 'tru_so' ? tuong : m.nhan);

    const tinh = opt.tinh || (opt.vao != null && opt.vao < 0), vao = opt.vao || 0;
    return {
      el: g,
      seek(t) {
        const s = tinh ? 1e6 : t - vao;
        const pThan = K.spr(s, 0.55, 0.62);
        nhomThan.setAttribute('transform', `scale(1 ${Math.max(0, pThan).toFixed(4)})`);
        nhomThan.style.opacity = K.cl(s / 0.1).toFixed(3);
        dat.style.opacity = (0.1 * K.cl(s / 0.3)).toFixed(3);
        const pMai = K.spr(s - 0.32, 0.4, 0.55);
        nhomMai.setAttribute('transform', `translate(0 ${((1 - pMai) * -60).toFixed(2)})`);
        nhomMai.style.opacity = K.cl((s - 0.32) / 0.12).toFixed(3);
        const pb = K.eo3(K.tienDo(s, 0.45, 0.4));
        nhomBien.style.opacity = pb.toFixed(3);
        nhomBien.setAttribute('transform', `translate(0 ${((1 - pb) * 8).toFixed(2)})`);
        if (vetSang) { const chu = 6, p = (((s - 0.8) % chu) + chu) % chu / chu; vetSang.setAttribute('transform', `translate(${(-120 + p * 760).toFixed(1)} 0)`); vetSang.style.opacity = s < 0.8 ? 0 : ''; }
      },
      moc: { day: [0, 0], dinh: [0, -H * co], tam: [0, (-H * co) / 2], trai: [(-W * co) / 2, (-H * co) / 2], phai: [(W * co) / 2, (-H * co) / 2], cua: [cua[0] * co, cua[1] * co], bien: [bien[0] * co, bien[1] * co] },
      nhan: nhanEl,
    };
  };
})();
