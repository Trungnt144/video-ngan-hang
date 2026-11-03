// xem_mau/nha_o.js — ô mẫu nhà ở: nhà phố, căn hộ chung cư tô sáng một căn, toà đang xây có giàn giáo và cần cẩu, nhà mái dốc vẽ dần nét.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'nha_o',
  khung: 'svg',
  moc: [0.5, 1.6, 4.5],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    K.svg('line', { x1: 60, y1: 902, x2: 1860, y2: 902, stroke: m.vien, 'stroke-width': 3, opacity: 0.35 }, g);
    const dat = (h, x, y, chu) => {
      h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h);
      K.chu(g, chu, { x, y: y + 110, co: 24, dam: 600, mau: m.chu_phu, neo: 'middle' });
      return h;
    };
    K.chu(g, 'Nhà ở — tài sản bảo đảm và mục đích vay', { x: 60, y: 76, co: 36, dam: 700, mau: m.chu });
    dat(K.nha_o({ kieu, loai: 'nha_pho', co: 1.2, nhan: 'Nhà phố', vao: 0 }), 230, 900, 'nha_pho · co 1,2');
    dat(K.nha_o({ kieu, loai: 'can_ho', to_sang: [5, 3], nhan: 'Căn hộ thế chấp: tầng 5', vao: 0.25 }), 690, 900, 'can_ho · to_sang [5, 3]');
    dat(K.nha_o({ kieu, loai: 'dang_xay', co: 0.9, so_tang: 7, tang_xong: 3, nhan: 'Dự án đang xây', vao: 0.4 }), 1270, 900, 'dang_xay · co 0,9');
    dat(K.nha_o({ kieu, loai: 'nha_don', nhan: 'Nhà riêng', vao: 0.3 }), 1690, 900, 'nha_don');
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
