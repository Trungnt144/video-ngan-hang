// xem_mau/xap_tien_dong_xu.js — ô mẫu tiền: chồng xu mọc dần như cột biểu đồ (có nhãn năm), cọc xấp tiền hai chồng, tờ tiền xếp lệch, túi tiền.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'xap_tien_dong_xu',
  khung: 'svg',
  moc: [0.6, 1.4, 4.0],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    const dat = (h, x, y, chu, yChu) => {
      h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h);
      if (chu) K.chu(g, chu, { x, y: yChu, co: 24, dam: 600, mau: m.chu_phu, neo: 'middle' });
      return h;
    };
    K.chu(g, 'Tiền giản lược — số tiền là ví dụ giả định', { x: 60, y: 76, co: 36, dam: 700, mau: m.chu });
    K.svg('line', { x1: 60, y1: 882, x2: 1860, y2: 882, stroke: m.vien, 'stroke-width': 3, opacity: 0.3 }, g);
    dat(K.xap_tien_dong_xu({ kieu, loai: 'chong_xu', co: 1.5, so: [3, 6, 10, 15], nhan: ['Năm 1', 'Năm 2', 'Năm 3', 'Năm 4'], vao: 0 }), 400, 880, 'chong_xu · co 1,5 · so [3, 6, 10, 15]', 1010);
    dat(K.xap_tien_dong_xu({ kieu, loai: 'xap_tien', co: 1.15, so: [3, 7], nhan: ['Gốc', 'Gốc + lãi'], vao: 0.3 }), 1110, 880, 'xap_tien · co 1,15 · so [3, 7]', 1010);
    dat(K.xap_tien_dong_xu({ kieu, loai: 'to_tien', co: 1.3, so: 3, menh_gia: '500.000', vao: 0.5 }), 1300, 300, 'to_tien · co 1,3 · so 3', 450);
    dat(K.xap_tien_dong_xu({ kieu, loai: 'tui_tien', co: 1.2, nhan: 'Tiền lãi', vao: 0.8 }), 1690, 880, 'tui_tien · co 1,2', 1010);
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
