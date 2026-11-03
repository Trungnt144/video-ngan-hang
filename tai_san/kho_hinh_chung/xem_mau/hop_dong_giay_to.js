// xem_mau/hop_dong_giay_to.js — ô mẫu giấy tờ ngân hàng: hợp đồng tín dụng có chữ thật, tô sáng, ký, đóng dấu; khế ước xếp chồng; giấy chứng nhận nhà đất; sổ tiết kiệm; chứng chỉ tiền gửi.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'hop_dong_giay_to',
  khung: 'svg',
  moc: [0.9, 3.3, 6.5],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    const dat = (h, x, y, chu, yChu) => {
      h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h);
      K.chu(g, chu, { x, y: yChu, co: 24, dam: 600, mau: m.chu_phu, neo: 'middle' });
      return h;
    };
    K.chu(g, 'Giấy tờ ngân hàng — năm loại (số liệu là ví dụ giả định)', { x: 60, y: 76, co: 36, dam: 700, mau: m.chu });
    dat(K.hop_dong_giay_to({ kieu, loai: 'hop_dong_tin_dung', vao: 0,
      dong: ['Bên vay: Khách hàng B', 'Số tiền vay: 500 triệu đồng', 'Thời hạn: 12 tháng', 'Lãi suất thả nổi: lãi cơ sở cộng biên độ 3,5%/năm', 'Mục đích sử dụng vốn: mua nhà ở', null],
      to_sang: 3 }), 280, 505, 'hop_dong_tin_dung · co 1', 935);
    dat(K.hop_dong_giay_to({ kieu, loai: 'khe_uoc', co: 0.8, chong: 2, truot: 'phai', vao: 0.4,
      dong: ['Số tiền nhận nợ: 200 triệu đồng', 'Ngày nhận nợ: 05/11/2026', 'Hạn trả cuối: 05/11/2027', null], to_sang: 0 }), 770, 520, 'khe_uoc · chong 2 · co 0,8', 850);
    dat(K.hop_dong_giay_to({ kieu, loai: 'giay_chung_nhan_nha_dat', co: 0.8, truot: 'tren', vao: 0.8, dien_tich: 'Thửa 125 · 80 m²' }), 1185, 520, 'giay_chung_nhan_nha_dat · co 0,8', 850);
    dat(K.hop_dong_giay_to({ kieu, loai: 'so_tiet_kiem', co: 0.7, truot: 'trai', vao: 1.1 }), 1560, 330, 'so_tiet_kiem · co 0,7', 545);
    dat(K.hop_dong_giay_to({ kieu, loai: 'chung_chi_tien_gui', co: 0.62, vao: 1.3 }), 1660, 770, 'chung_chi_tien_gui · co 0,62', 960);
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
