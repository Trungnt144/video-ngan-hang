// xem_mau/so_do_dong_tien_cac_ben.js — ô mẫu sơ đồ dòng tiền: hai ngân hàng cho vay qua đêm và trả lại (hai đường cong ngược chiều, hạt tiền chạy),
// hàng dưới ba bên của một giao dịch thẻ (chủ thẻ chỉ là nhãn, nét đứt, đường cong lên); tô sáng Ngân hàng B ở giây 4,4.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'so_do_dong_tien_cac_ben',
  khung: 'html',
  moc: [1.4, 3.6, 6.2],
  tao({ kieu, san, K }) {
    const a = K.so_do_dong_tien_cac_ben({
      kieu,
      nut: [
        { id: 'a', ten: 'Ngân hàng A', phu: 'thừa tiền cuối ngày', x: 420, y: 330, khoa_mau: 'tot' },
        { id: 'b', ten: 'Ngân hàng B', phu: 'thiếu tiền cuối ngày', x: 1500, y: 330, khoa_mau: 'xau', to: 4.4 },
        { id: 'ct', ten: 'Chủ thẻ', x: 300, y: 860, chi_nhan: true },
        { id: 'ch', ten: 'Cửa hàng', x: 960, y: 860, khoa_mau: 'nhan_phu' },
        { id: 'ph', ten: 'Ngân hàng phát hành', phu: 'nhận phí trao đổi', x: 1600, y: 860, khoa_mau: 'nhan' },
      ],
      dong: [
        { tu: 'a', den: 'b', nhan: 'Cho vay qua đêm', so: '500 tỷ đồng', khoa_mau: 'tot' },
        { tu: 'b', den: 'a', nhan: 'Trả gốc và lãi', so: 'hôm sau', khoa_mau: 'nhan_phu' },
        { tu: 'ct', den: 'ch', nhan: 'Quẹt thẻ', so: '1 triệu đồng', net: 'dut' },
        { tu: 'ch', den: 'ph', nhan: 'Phí chiết khấu', so: 'ví dụ 1–2%', cong: -0.25, khoa_mau: 'canh_bao' },
      ],
    });
    san.appendChild(a.el);
    return { seek(t) { a.seek(t); } };
  },
});
