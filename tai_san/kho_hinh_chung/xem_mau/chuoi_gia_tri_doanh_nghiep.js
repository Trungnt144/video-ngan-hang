// xem_mau/chuoi_gia_tri_doanh_nghiep.js — ô mẫu 1.1 (ít chữ) chuỗi giá trị doanh nghiệp: bốn khâu mặc định chỉ có hình (mua nguyên liệu, sản xuất, bán hàng, nhận tiền),
// hạt chạy trên mũi tên, mỗi khâu 1 thẻ nghiệp vụ (một thẻ chỉ có biểu tượng, chu: false), khoảng trống vốn từ khâu 1 tới khâu 4 có thẻ lấp, đường tiền không nhãn,
// tô sáng khâu Sản xuất ở giây 8. Ba thời điểm: các khâu vừa hiện (2,6), khoảng trống vốn hiện (5,7), đủ thẻ và một khâu tô sáng (8,8).
// Khung cuối 12 tiếng. Chữ là ví dụ giả định.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'chuoi_gia_tri_doanh_nghiep',
  khung: 'html',
  mau: { phang: 'MAU-60', net_tay: 'MAU-59', toi_gian: 'MAU-22' },
  moc: [2.6, 5.7, 8.8],
  tao({ kieu, san, K }) {
    const a = K.chuoi_gia_tri_doanh_nghiep({
      kieu,
      khau: [
        { hinh: 'nguyen_lieu', moc: 0.5, the: [{ chu: 'L/C', bieu_tuong: 'thanh_toan_quoc_te', khoa_mau: 'nhan_phu', moc: 6.8 }] },
        { hinh: 'san_xuat', moc: 0.9, the: [{ chu: false, bieu_tuong: 'nha_may', moc: 7.0, moc_to: 8.2 }] },
        { hinh: 'ban_hang', moc: 1.3, the: [{ chu: 'Bảo lãnh', bieu_tuong: 'bao_lanh', khoa_mau: 'nhan_phu', moc: 7.2 }] },
        { hinh: 'nhan_tien', moc: 1.7, the: [{ chu: 'Tiền gửi', bieu_tuong: 'tiet_kiem', khoa_mau: 'tot', moc: 7.4 }] },
      ],
      noi: [{ chay: true }, { chay: true }, { chay: true, hat: 'tien' }],
      khoang_trong: { tu: 0, den: 3, nhan: 'Khoảng trống vốn', moc: 4.6, lap: { chu: 'Vay vốn lưu động', bieu_tuong: 'vay', moc: 6.0 } },
      dong_tien: { moc: 6.4 },
      to: [{ khau: 1, moc: 8, het: 9.5 }],
      x: 80, y: 250, rong: 1760, vao: 0,
    });
    san.appendChild(a.el);
    return { seek(t) { a.seek(t); } };
  },
});
