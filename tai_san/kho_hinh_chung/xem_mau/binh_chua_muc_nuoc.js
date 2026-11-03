// xem_mau/binh_chua_muc_nuoc.js — ô mẫu bình chứa: hạn mức tín dụng (dâng, rút khi trả nợ), room tín dụng vượt trần, quỹ dự phòng rủi ro, dự trữ bắt buộc theo phần trăm.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'binh_chua_muc_nuoc',
  khung: 'svg',
  moc: [0.9, 2.6, 5.0],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    const dat = (h, x, y) => { h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h); return h; };
    K.chu(g, 'Hạn mức như một chiếc bình: dùng bao nhiêu, còn bao nhiêu (ví dụ giả định)', { x: 80, y: 90, co: 36, dam: 700, mau: m.chu });
    dat(K.binh_chua_muc_nuoc({ kieu, ten: 'Hạn mức tín dụng', tran: 0.8, nhan_tran: 'Hạn mức 500 triệu', gia_tri_toi_da: 625e6, nhan_muc: 'Đã dùng {gt}',
      muc: 0.42, chuyen: [{ luc: 1.9, muc: 0.7 }, { luc: 3.4, muc: 0.3, dai: 1.0 }], vao: 0.1 }), 190, 790);
    dat(K.binh_chua_muc_nuoc({ kieu, ten: 'Room tín dụng', tran: 0.75, nhan_tran: 'Trần tăng trưởng', nhan_muc: '{pt}', muc: 0.5, chuyen: [{ luc: 2.0, muc: 0.86, dai: 1.3 }], khoa_mau: 'nhan_phu', vao: 0.3, rong: 200, cao: 360 }), 770, 790);
    dat(K.binh_chua_muc_nuoc({ kieu, ten: 'Quỹ dự phòng rủi ro', gia_tri_toi_da: 2e9, muc: 0.6, khoa_mau: 'tot', vao: 0.5 }), 1280, 790);
    dat(K.binh_chua_muc_nuoc({ kieu, ten: 'Dự trữ bắt buộc', nhan_muc: 'Tỷ lệ {pt}', muc: 0.03, muc_dau: 0, vach_chia: true, khoa_mau: 'canh_bao', rong: 140, cao: 300, vao: 0.7 }), 1660, 790);
    K.chu(g, 'Mực dâng khi giải ngân, rút khi trả nợ; vượt vạch trần thì chuyển màu cảnh báo.', { x: 80, y: 1000, co: 28, dam: 500, mau: m.chu_phu });
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
