// xem_mau/khuon_vi_du_tinh_tien_tung_buoc.js — ô mẫu khuôn ví dụ tính tiền: 0–7,5 s tiền lãi tháng đầu khoản vay 1,2 tỷ đồng lãi 9%/năm;
// từ 7,5 s tổng lãi kỳ ân hạn 3 tháng (nhãn bước dài, dữ kiện dài để thấy xuống dòng, kết quả 0 đồng).
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_vi_du_tinh_tien_tung_buoc',
  khung: 'html',
  moc: [3.4, 7.2, 14.8],
  tao({ kieu, san, K }) {
    const a = K.khuon_vi_du_tinh_tien_tung_buoc({
      kieu, dong_nho: 'Ví dụ tính tiền', tieu_de: 'Tiền lãi tháng đầu của khoản vay',
      gia_thiet: 'Khoản vay 1,2 tỷ đồng · lãi suất 9%/năm · trả lãi hằng tháng',
      buoc: [
        { nhan: 'Số tiền vay (dư nợ gốc ban đầu)', bieu_thuc: 'Ngân hàng A giải ngân', ket_qua: 1.2e9 },
        { nhan: 'Tiền lãi một năm', bieu_thuc: '1,2 tỷ × 9%', ket_qua: 108e6 },
        { nhan: 'Tiền lãi tháng đầu', bieu_thuc: '108 triệu ÷ 12 tháng', ket_qua: 9e6 },
      ],
      chu_thich: 'Cách tính rút gọn để dễ theo dõi. Ngân hàng thường tính lãi theo số ngày thực tế của kỳ.',
    });
    const b = K.khuon_vi_du_tinh_tien_tung_buoc({
      kieu, dong_nho: 'Ví dụ tính tiền · Ân hạn', tieu_de: 'Tổng tiền lãi trong kỳ ân hạn 3 tháng',
      gia_thiet: 'Khoản vay 1,2 tỷ đồng · lãi suất 9%/năm · ân hạn gốc 3 tháng đầu, tiền lãi vẫn trả hằng tháng như bình thường',
      buoc: [
        { nhan: 'Tiền lãi mỗi tháng trong thời gian ân hạn (gốc chưa trả nên dư nợ giữ nguyên 1,2 tỷ đồng)', bieu_thuc: '1,2 tỷ × 9% ÷ 12', ket_qua: 9e6 },
        { nhan: 'Tiền gốc phải trả trong kỳ ân hạn', bieu_thuc: 'Ưu đãi: hoãn trả gốc', ket_qua: 0 },
        { nhan: 'Tổng tiền lãi phải trả trong 3 tháng ân hạn', bieu_thuc: '9 triệu × 3 tháng', ket_qua: 27e6 },
      ],
    });
    san.appendChild(a.el); san.appendChild(b.el);
    const T2 = 7.5;
    return {
      seek(t) {
        a.el.style.display = t < T2 ? '' : 'none'; b.el.style.display = t < T2 ? 'none' : '';
        if (t < T2) a.seek(t); else b.seek(t - T2);
      },
    };
  },
});
