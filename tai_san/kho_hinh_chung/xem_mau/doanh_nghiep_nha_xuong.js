// xem_mau/doanh_nghiep_nha_xuong.js — ô mẫu doanh nghiệp: nhà xưởng nhả khói, văn phòng công ty, nhà xưởng tên dài có cửa cuốn kéo lên.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'doanh_nghiep_nha_xuong',
  khung: 'svg',
  moc: [0.4, 1.6, 4.2],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    K.svg('line', { x1: 60, y1: 902, x2: 1860, y2: 902, stroke: m.vien, 'stroke-width': 3, opacity: 0.35 }, g);
    const dat = (h, x, y, chu) => {
      h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h);
      K.chu(g, chu, { x, y: y + 64, co: 26, dam: 600, mau: m.chu_phu, neo: 'middle' });
      return h;
    };
    K.chu(g, 'Doanh nghiệp đi vay — nhà xưởng và văn phòng công ty', { x: 60, y: 76, co: 36, dam: 700, mau: m.chu });
    dat(K.doanh_nghiep_nha_xuong({ kieu, loai: 'nha_xuong', co: 1.2, nhan: 'Công ty B', vao: 0 }), 540, 900, 'nha_xuong · co 1,2');
    dat(K.doanh_nghiep_nha_xuong({ kieu, loai: 'van_phong', co: 1.05, nhan: 'Công ty C', vao: 0.3 }), 1250, 900, 'van_phong · co 1,05');
    dat(K.doanh_nghiep_nha_xuong({ kieu, loai: 'nha_xuong', co: 0.72, nhan: 'Công ty TNHH Sản xuất Bao bì D', vao: 0.6, mo_cua: 1.8 }), 1690, 900, 'tên dài · mo_cua 1,8');
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
