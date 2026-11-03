// xem_mau/so_do_to_chuc_ngan_hang.js — ô mẫu sơ đồ tổ chức: bộ soạn sẵn 'ngan_hang_thuong_mai' có thu_gon (Khối hỗ trợ), hiện theo năm tầng,
// mạng lưới 5 chi nhánh × 3 phòng giao dịch ở giây 9,4, ba tuyến bảo vệ ở giây 10,6 (tắt ở 13), đường đi của một khoản vay
// (Chi nhánh → Quản lý rủi ro → Vận hành) từ giây 13,2. Chữ, số chi nhánh là ví dụ giả định, không theo ngân hàng nào.
// Ba thời điểm: hai tầng trên vừa hiện · đủ cây, mạng lưới và ba tuyến · khoản vay đang chạy từ Quản lý rủi ro sang Vận hành.
// Kiểu 'vien' không có trong lượt chụp chuẩn; xem bằng xem_mau.html?hinh=so_do_to_chuc_ngan_hang&kieu=vien.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'so_do_to_chuc_ngan_hang',
  khung: 'html',
  moc: [3.3, 12.4, 16.4],
  mau: { phang: 'MAU-56', net_tay: 'MAU-59', vien: 'MAU-56' },
  tao({ kieu, san, K }) {
    const a = K.so_do_to_chuc_ngan_hang({
      kieu, mau_san: 'ngan_hang_thuong_mai', thu_gon: true,
      tieu_de: 'Bộ máy một ngân hàng thương mại', dong_nho: 'Thuật ngữ ngân hàng',
      moc_tang: [1, 2.5, 4, 6, 8],
      mang_luoi: { cha: 'chi_nhanh', so_chi_nhanh: 5, so_pgd_moi_chi_nhanh: 3, moc: 9.4 },
      tuyen: { moc: 10.6, het: 13 },
      duong_di: [{ ids: ['chi_nhanh', 'qlrr', 'van_hanh'], moc: 13.2, nhan: 'Một khoản vay đi qua' }],
      x: 60, y: 140, rong: 1800, cao: 800, vao: 0,
    });
    san.appendChild(a.el);
    return { seek(t) { a.seek(t); } };
  },
});
