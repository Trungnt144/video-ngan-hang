// xem_mau/man_hinh_ung_dung.js — ô mẫu màn hình ứng dụng: điện thoại sao kê thẻ tín dụng (N116) có thông báo nhắc hạn; khung trình duyệt khoản vay, tiêu đề dài, nút bị bấm.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'man_hinh_ung_dung',
  khung: 'html',
  moc: [0.8, 2.2, 4.5],
  tao({ kieu, san, K }) {
    const a = K.man_hinh_ung_dung({ kieu, mau_san: 'sao_ke_the', x: 70, y: 60, vao: 0,
      thong_bao: { chu: 'Nhắc hạn: thanh toán dư nợ thẻ trước ngày 15/11 để không bị tính lãi', loai: 'canh_bao' }, moc_thong_bao: 2.0 });
    const b = K.man_hinh_ung_dung({ kieu, khung: 'trinh_duyet', mau_san: 'khoan_vay', x: 620, y: 170, vao: 0.4,
      tieu_de: 'Khoản vay mua nhà ở — lãi suất thả nổi sau thời gian ưu đãi',
      dong: [{ trai: 'Kỳ 11 (gốc 3.500.000 đ, lãi 6.400.000 đ)', phu: '05/11/2026 · đã trả', phai: '9.900.000 đ', loai: 'tot' },
        { trai: 'Kỳ 10', phu: '05/10/2026 · đã trả', phai: '9.950.000 đ', loai: 'tot' },
        { trai: 'Kỳ 9', phu: '05/09/2026 · trả chậm 3 ngày', phai: '9.990.000 đ', loai: 'canh_bao' }],
      moc_bam: 3.0 });
    san.appendChild(a.el); san.appendChild(b.el);
    return { seek(t) { a.seek(t); b.seek(t); } };
  },
});
