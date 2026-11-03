// xem_mau/toa_nha_ngan_hang.js — ô mẫu toà nhà ngân hàng: trụ sở, chi nhánh, hội sở cạnh nhau, mọc lên lệch nhịp.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'toa_nha_ngan_hang',
  khung: 'svg',
  moc: [0.35, 1.0, 3.5],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    K.svg('line', { x1: 60, y1: 922, x2: 1860, y2: 922, stroke: m.vien, 'stroke-width': 3, opacity: 0.35 }, g);
    const dat = (h, x, y, chu) => {
      h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h);
      K.chu(g, chu, { x, y: y + 60, co: 30, dam: 600, mau: m.chu_phu, neo: 'middle' });
      return h;
    };
    dat(K.toa_nha_ngan_hang({ kieu, loai: 'tru_so', nhan: 'Ngân hàng A', vao: 0 }), 400, 920, 'Trụ sở (loai: tru_so)');
    dat(K.toa_nha_ngan_hang({ kieu, loai: 'chi_nhanh', nhan: 'Ngân hàng B · Chi nhánh Đống Đa', vao: 0.3 }), 960, 920, 'Chi nhánh (loai: chi_nhanh)');
    dat(K.toa_nha_ngan_hang({ kieu, loai: 'hoi_so', nhan: 'Hội sở Ngân hàng C', vao: 0.6 }), 1500, 920, 'Hội sở (loai: hoi_so)');
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
