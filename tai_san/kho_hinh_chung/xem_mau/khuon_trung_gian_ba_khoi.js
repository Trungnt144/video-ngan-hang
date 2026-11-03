// xem_mau/khuon_trung_gian_ba_khoi.js — ô mẫu bản 1.1 (ít chữ) khuôn trung gian ba khối: người gửi, ngân hàng, người vay (doanh nghiệp); gốc 100 sang phải,
// lãi vay 9 về ngân hàng, lãi tiền gửi 5 về người gửi, chênh lệch 4 rơi xuống và tách 2 + 1 + 1; sau đó lưới 12 người vay nhỏ và một khoản mất vốn.
// Chữ và số là ví dụ giả định (100, 9, 5, 4), không phải số liệu thật. Chỉ hai nhãn tên và các số: tối đa 12 tiếng mỗi khung.
// Ba thời điểm: gốc vừa sang ngân hàng; chênh lệch đã tách; mất vốn với lưới.
// Thêm ?bien_the=hai_khoi vào địa chỉ trang để xem bản hai khối (bỏ ben_vay, dùng cho N199 huy động vốn): gốc 100 vào, lãi tiền gửi 5 về.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_trung_gian_ba_khoi',
  khung: 'html',
  moc: [2.0, 8.8, 13.0],
  mau: { phang: 'MAU-54', net_tay: 'MAU-59', toi_gian: 'MAU-22' },
  tao({ kieu, san, K }) {
    const haiKhoi = new URLSearchParams(location.search).get('bien_the') === 'hai_khoi';
    const a = haiKhoi
      ? K.khuon_trung_gian_ba_khoi({
        kieu,
        ben_gui: { ten: 'Người gửi', hinh: 'nguoi' },
        ngan_hang: { loai: 'tru_so' },
        goc: { so: '100', moc_vao: 1.0 },
        lai_gui: { so: '5', moc: 2.4 },
        y: 430, vao: 0,
      })
      : K.khuon_trung_gian_ba_khoi({
        kieu,
        ben_gui: { ten: 'Người gửi', hinh: 'nguoi' },
        ngan_hang: { loai: 'tru_so' },
        ben_vay: { ten: 'Người vay', hinh: 'doanh_nghiep' },
        goc: { so: '100', moc_vao: 1.0, moc_ra: 2.2 },
        lai_vay: { so: '9', moc: 3.4 },
        lai_gui: { so: '5', moc: 4.4 },
        chenh_lech: { so: '4', moc: 5.4, tach: [{ gia_tri: 2 }, { gia_tri: 1 }, { gia_tri: 1 }], moc_tach: 7.0 },
        nhieu_ben_vay: { so: 12, moc: 9.0 },
        mat_von: { moc: 11.0 },
        y: 430, vao: 0, tinh: false,
      });
    san.appendChild(a.el);
    return { seek(t) { a.seek(t); } };
  },
});
