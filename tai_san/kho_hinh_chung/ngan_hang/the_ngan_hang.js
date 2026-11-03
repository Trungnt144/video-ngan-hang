// ngan_hang/the_ngan_hang.js — 1.0 — thẻ ngân hàng trơn: không logo, không tên hãng thẻ thật, không tên ngân hàng thật; mặt trước và mặt sau.
// Gọi: KHO.the_ngan_hang({ kieu, loai_the, ten_ngan_hang, hang_the, so_cuoi, ten_chu_the, han, nhan_hang, khoa_mau, mat_sau, lat, co, nghieng, vao, tinh, hat, mau }).
//   loai_the: chữ góc phải trên (mặc định 'THẺ TÍN DỤNG'; ví dụ 'THẺ GHI NỢ', 'THẺ TRẢ TRƯỚC'); ten_ngan_hang: góc trái trên (mặc định 'Ngân hàng A', false bỏ);
//   hang_the: chữ trong ô góc phải dưới thay cho logo hãng thẻ (mặc định 'Hãng thẻ', false bỏ); nhan_hang: chữ hạng thẻ nhỏ dưới loai_the (ví dụ 'Vàng'), mặc định không có;
//   so_cuoi: bốn số cuối (mặc định '1234', số đầu che bằng chấm); ten_chu_the (mặc định 'TÊN CHỦ THẺ'); han (mặc định '12/29');
//   khoa_mau: khoá màu thân thẻ (mặc định 'nhan'; ví dụ 'canh_bao' cho thẻ vàng, 'nhan_phu', 'chu' cho thẻ tối);
//   mat_sau: true vẽ mặt sau ngay từ đầu; lat: giây bắt đầu lật sang mặt sau (0,6 giây), lat_lai: giây lật về mặt trước;
//   co: tỉ lệ; nghieng: độ xoay cố định; kieu 'phang' | 'net_tay'; vao: giây xuất hiện (-1 hoặc tinh: true hiện đủ); hat: hạt giống nét tay.
// Kích thước chuẩn: 520 × 328 (tỉ lệ thẻ thật 85,6 × 54 mm), gốc ở tâm thẻ.
// Trả về { el, seek(t), moc }: moc { tam, chip, so_the, tren, duoi, trai, phai, rong, cao } — đã nhân co (chưa tính nghieng).
// Chuyển động: trượt lên và xoay về thẳng bằng lò xo khi vào; kiểu phẳng có vệt sáng lướt qua một lần; lật bằng co giãn trục ngang.
// Dựng mới (02/11/2026, lô N176–N179).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  const W = 520, H = 328, R = 24;
  let demId = 0;

  function hcnTay(x, y, w, h, r, hat, lech) {
    const d = [], buoc = 70;
    const canh = (x0, y0, x1, y1) => { const k = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / buoc)); for (let i = 0; i < k; i++) d.push([x0 + (x1 - x0) * i / k, y0 + (y1 - y0) * i / k]); };
    const goc = (cx, cy, a0) => { for (let i = 0; i < 4; i++) { const a = a0 + (Math.PI / 2) * i / 4; d.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    canh(x + r, y, x + w - r, y); goc(x + w - r, y + r, -Math.PI / 2);
    canh(x + w, y + r, x + w, y + h - r); goc(x + w - r, y + h - r, 0);
    canh(x + w - r, y + h, x + r, y + h); goc(x + r, y + h - r, Math.PI / 2);
    canh(x, y + h - r, x, y + r); goc(x + r, y + r, Math.PI);
    return K.duongTay(d, { hat, lech: lech || 1.8, dong: true });
  }

  K.the_ngan_hang = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co || 1, hat = opt.hat || 41;
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const mauThan = m[opt.khoa_mau || 'nhan'] || m.nhan;
    const nenThan = tay ? K.tron(m.giay, mauThan, 0.12) : mauThan;
    const mauChu = tay ? m.chu : K.chuTren(mauThan, '#FFFFFF', '#141414');
    const mauChuPhu = tay ? m.chu_phu : K.rgba(mauChu, 0.78);
    const id = 'kho-the-' + (++demId);

    const el = K.svg('g', { class: 'kho-the' });
    const xoay = K.svg('g', null, el);       // trượt, xoay khi vào
    const lat = K.svg('g', null, xoay);      // co giãn trục ngang khi lật
    const truoc = K.svg('g', null, lat), sau = K.svg('g', null, lat);
    const defs = K.svg('defs', null, el);
    const cat = K.svg('clipPath', { id: id + '-cat' }, defs);
    K.svg('rect', { x: -W / 2, y: -H / 2, width: W, height: H, rx: R }, cat);

    // ---------- thân thẻ (dùng chung hai mặt) ----------
    function than(cha, hatT) {
      if (!tay) {
        const gr = K.svg('linearGradient', { id: id + '-gr' + hatT, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
        K.svg('stop', { offset: 0, 'stop-color': K.tron(mauThan, '#FFFFFF', 0.14) }, gr);
        K.svg('stop', { offset: 1, 'stop-color': K.tron(mauThan, '#000000', 0.22) }, gr);
        K.svg('rect', { x: -W / 2 + 6, y: -H / 2 + 12, width: W, height: H, rx: R, fill: '#000', opacity: m.toi ? 0.4 : 0.16 }, cha);
        K.svg('rect', { x: -W / 2, y: -H / 2, width: W, height: H, rx: R, fill: `url(#${id}-gr${hatT})` }, cha);
        // hoa văn sóng mờ, không mô phỏng thương hiệu nào
        const g = K.svg('g', { 'clip-path': `url(#${id}-cat)`, opacity: 0.16 }, cha);
        for (let i = 0; i < 3; i++) K.svg('path', { d: `M${-W / 2 - 20} ${40 + i * 34} C ${-60} ${-60 + i * 30}, ${80} ${150 + i * 20}, ${W / 2 + 20} ${-20 + i * 36}`, fill: 'none', stroke: mauChu, 'stroke-width': 10 - i * 2 }, g);
      } else {
        K.svg('path', { d: hcnTay(-W / 2 + 8, -H / 2 + 10, W, H, R, hatT + 5, 2.2) + 'Z', fill: K.rgba(m.chu, 0.08) }, cha);
        K.svg('path', { d: hcnTay(-W / 2, -H / 2, W, H, R, hatT, 1.6) + 'Z', fill: nenThan }, cha);
        const g = K.svg('g', { 'clip-path': `url(#${id}-cat)` }, cha);
        let d = '';
        for (let c = -H, i = 0; c < W; c += 16, i++) d += K.duongTay([[-W / 2 + c, H / 2], [-W / 2 + c + H, -H / 2]], { hat: hatT + 20 + i, lech: 1.2 }) + ' ';
        K.svg('path', { d, fill: 'none', stroke: mauThan, 'stroke-width': 1.6, opacity: 0.35, 'stroke-linecap': 'round' }, g);
        K.svg('path', { d: hcnTay(-W / 2, -H / 2, W, H, R, hatT + 1, 1.8), fill: 'none', stroke: m.chu, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cha);
        K.svg('path', { d: hcnTay(-W / 2 + 2, -H / 2 - 2, W - 2, H + 2, R, hatT + 2, 2.4), fill: 'none', stroke: m.chu, 'stroke-width': 1.2, opacity: 0.45 }, cha);
      }
    }

    // ---------- mặt trước ----------
    than(truoc, hat);
    const chuTr = (s, x, y, o) => K.chu(truoc, s, Object.assign({ x, y, mau: mauChu }, o));
    if (opt.ten_ngan_hang !== false) chuTr(opt.ten_ngan_hang || 'Ngân hàng A', -W / 2 + 34, -H / 2 + 56, { co: K.coVua(opt.ten_ngan_hang || 'Ngân hàng A', 250, 30, 800, 20), dam: 800 });
    const loai = opt.loai_the || 'THẺ TÍN DỤNG';
    chuTr(loai, W / 2 - 34, -H / 2 + 52, { co: K.coVua(loai, 200, 22, 700, 16), dam: 700, neo: 'end', gian: '0.06em', mau: mauChuPhu });
    if (opt.nhan_hang) chuTr(opt.nhan_hang, W / 2 - 34, -H / 2 + 82, { co: 22, dam: 600, neo: 'end', mau: mauChuPhu });
    // chip
    const CX = -W / 2 + 46, CY = -36, CW = 74, CH = 56;
    const mauChip = tay ? K.tron(m.canh_bao, m.giay, 0.35) : K.tron(m.canh_bao, '#FFFFFF', 0.35);
    if (!tay) K.svg('rect', { x: CX, y: CY, width: CW, height: CH, rx: 10, fill: mauChip, stroke: K.tron(mauChip, '#000000', 0.35), 'stroke-width': 1.5 }, truoc);
    else K.svg('path', { d: hcnTay(CX, CY, CW, CH, 10, hat + 30, 1.1) + 'Z', fill: mauChip, stroke: m.chu, 'stroke-width': 2 }, truoc);
    const net = K.tron(mauChip, '#000000', 0.45);
    [[CX + CW / 3, CY, CX + CW / 3, CY + CH], [CX + 2 * CW / 3, CY, CX + 2 * CW / 3, CY + CH], [CX, CY + CH / 2, CX + CW / 3, CY + CH / 2], [CX + 2 * CW / 3, CY + CH / 2, CX + CW, CY + CH / 2]]
      .forEach(([a, b, c, d]) => K.svg('line', { x1: a, y1: b, x2: c, y2: d, stroke: net, 'stroke-width': 1.6 }, truoc));
    // biểu tượng chạm (bốn cung)
    const gC = K.svg('g', { transform: `translate(${CX + CW + 40} ${CY + CH / 2})` }, truoc);
    for (let i = 0; i < 4; i++) {
      const r = 9 + i * 8;
      K.svg('path', { d: `M${r * Math.cos(-0.75)} ${r * Math.sin(-0.75)} A ${r} ${r} 0 0 1 ${r * Math.cos(0.75)} ${r * Math.sin(0.75)}`, fill: 'none', stroke: mauChu, 'stroke-width': 3.2, 'stroke-linecap': 'round', opacity: 0.85 }, gC);
    }
    // số thẻ, tên, hạn
    const soThe = '••••  ••••  ••••  ' + (opt.so_cuoi || '1234');
    chuTr(soThe, -W / 2 + 34, 62, { co: 34, dam: 600, gian: '0.04em' });
    const tenCT = opt.ten_chu_the || 'TÊN CHỦ THẺ';
    chuTr(tenCT, -W / 2 + 34, H / 2 - 34, { co: K.coVua(tenCT, 250, 24, 600, 16), dam: 600, gian: '0.06em' });
    chuTr('HẠN', 6, H / 2 - 62, { co: 16, dam: 600, mau: mauChuPhu, gian: '0.08em' });
    chuTr(opt.han || '12/29', 6, H / 2 - 34, { co: 24, dam: 600 });
    if (opt.hang_the !== false) {
      const s = opt.hang_the || 'Hãng thẻ', w = Math.min(150, Math.max(104, K.doChu(s, 20, 700) + 28));
      const gx = W / 2 - 34 - w, gy = H / 2 - 26 - 46;
      if (!tay) K.svg('rect', { x: gx, y: gy, width: w, height: 46, rx: 12, fill: K.rgba(mauChu, 0.16), stroke: K.rgba(mauChu, 0.6), 'stroke-width': 2 }, truoc);
      else K.svg('path', { d: hcnTay(gx, gy, w, 46, 12, hat + 40, 1.1) + 'Z', fill: 'none', stroke: m.chu, 'stroke-width': 2 }, truoc);
      chuTr(s, gx + w / 2, gy + 30, { co: K.coVua(s, w - 20, 20, 700, 14), dam: 700, neo: 'middle' });
    }
    // vệt sáng lướt (kiểu phẳng)
    let vet = null;
    if (!tay) {
      const gs = K.svg('g', { 'clip-path': `url(#${id}-cat)` }, truoc);
      vet = K.svg('rect', { x: -60, y: -H, width: 70, height: H * 2, fill: '#FFFFFF', opacity: 0, transform: 'rotate(20)' }, gs);
    }

    // ---------- mặt sau ----------
    than(sau, hat + 60);
    const mauBang = tay ? m.chu : K.tron(mauThan, '#000000', 0.75);
    if (!tay) K.svg('rect', { x: -W / 2, y: -H / 2 + 40, width: W, height: 62, fill: mauBang, 'clip-path': `url(#${id}-cat)` }, sau);
    else K.svg('path', { d: K.duongTay([[-W / 2 + 4, -H / 2 + 40], [W / 2 - 4, -H / 2 + 40], [W / 2 - 4, -H / 2 + 102], [-W / 2 + 4, -H / 2 + 102]], { hat: hat + 70, lech: 1.2, dong: true }) + 'Z', fill: mauBang, opacity: 0.85 }, sau);
    const kx = -W / 2 + 34, ky = -H / 2 + 128, kw = 300, kh = 50;
    K.svg('rect', { x: kx, y: ky, width: kw, height: kh, rx: 4, fill: tay ? m.giay : '#F4F2EC', stroke: tay ? m.chu : 'none', 'stroke-width': 2 }, sau);
    for (let i = 0; i < 6; i++) K.svg('line', { x1: kx + 6, y1: ky + 8 + i * 7, x2: kx + kw - 6, y2: ky + 8 + i * 7, stroke: '#9AA0A8', 'stroke-width': 1, opacity: 0.5 }, sau);
    K.svg('rect', { x: kx + kw + 8, y: ky, width: 84, height: kh, rx: 4, fill: '#FFFFFF', stroke: tay ? m.chu : 'none', 'stroke-width': 2 }, sau);
    K.chu(sau, '•••', { x: kx + kw + 50, y: ky + 34, co: 26, dam: 700, neo: 'middle', mau: '#141414' });
    K.chu(sau, 'Mã bảo mật', { x: kx + kw + 50, y: ky + kh + 26, co: 16, dam: 600, neo: 'middle', mau: mauChuPhu });
    for (let i = 0; i < 3; i++) K.svg('rect', { x: -W / 2 + 34, y: H / 2 - 96 + i * 20, width: [380, 330, 260][i], height: 8, rx: 4, fill: mauChu, opacity: 0.35 }, sau);

    const mat = !!opt.mat_sau;
    const tLat = opt.lat != null ? opt.lat : null, tLatLai = opt.lat_lai != null ? opt.lat_lai : null;

    function seek(t) {
      const tt = t - vao;
      // vào
      const p = tinh ? 1 : K.spr(tt, 0.55, 0.7), a = tinh ? 1 : K.eo3(K.tienDo(tt, 0, 0.3));
      const goc = (opt.nghieng || 0) + (1 - p) * -8, dy = (1 - p) * 60;
      xoay.setAttribute('transform', `translate(0 ${dy.toFixed(2)}) rotate(${goc.toFixed(2)})`);
      el.setAttribute('opacity', a.toFixed(3));
      // lật: góc 0 → π; nửa đầu hiện mặt đang có, nửa sau mặt kia
      let phi = mat ? Math.PI : 0;
      if (tLat != null) phi += Math.PI * K.eio(K.tienDo(t, tLat, 0.6)) * (mat ? -1 : 1);
      if (tLatLai != null) phi -= Math.PI * K.eio(K.tienDo(t, tLatLai, 0.6)) * (mat ? -1 : 1);
      const sx = Math.cos(phi);
      lat.setAttribute('transform', `scale(${(Math.max(0.002, Math.abs(sx)) * co).toFixed(4)} ${co})`);
      const sauHien = sx < 0;
      truoc.style.display = sauHien ? 'none' : ''; sau.style.display = sauHien ? '' : 'none';
      if (vet) {
        const q = tinh ? 1 : K.tienDo(tt, 0.5, 0.9);
        vet.setAttribute('x', (-W * 0.9 + q * W * 1.8).toFixed(1));
        vet.setAttribute('opacity', (0.22 * Math.sin(Math.PI * q)).toFixed(3));
      }
    }

    return {
      el, seek,
      moc: { tam: [0, 0], chip: [(CX + CW / 2) * co, (CY + CH / 2) * co], so_the: [(-W / 2 + 34) * co, 62 * co], tren: [0, -H / 2 * co], duoi: [0, H / 2 * co],
        trai: [-W / 2 * co, 0], phai: [W / 2 * co, 0], rong: W * co, cao: H * co },
    };
  };
})();
