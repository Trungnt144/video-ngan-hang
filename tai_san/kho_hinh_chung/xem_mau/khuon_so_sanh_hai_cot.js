// xem_mau/khuon_so_sanh_hai_cot.js — ô mẫu khuôn so sánh: 0–6,5 s hai cột lãi suất cố định và thả nổi, ô kèm dấu, tô hàng cuối;
// từ 6,5 s bảng có cột nhãn và ba cột (hợp đồng tín dụng, khế ước nhận nợ, lịch trả nợ), ô chữ dài để thấy xuống dòng.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_so_sanh_hai_cot',
  khung: 'html',
  moc: [2.6, 6.0, 12.8],
  tao({ kieu, san, K }) {
    const a = K.khuon_so_sanh_hai_cot({
      kieu, dong_nho: 'So sánh', tieu_de: 'Lãi suất cố định hay thả nổi?',
      cot: [{ ten: 'Lãi suất cố định', phu: 'Giữ nguyên trong thời gian đã thỏa thuận' }, { ten: 'Lãi suất thả nổi', phu: 'Điều chỉnh định kỳ theo lãi suất cơ sở' }],
      hang: [
        { o: [{ chu: 'Số tiền trả mỗi kỳ dễ dự tính', dau: 'tich' }, { chu: 'Số tiền trả mỗi kỳ thay đổi sau mỗi lần điều chỉnh', dau: 'cham_than' }] },
        { o: [{ chu: 'Thường cao hơn lúc mới vay', dau: 'cham_than' }, { chu: 'Thường thấp hơn trong thời gian ưu đãi', dau: 'tich' }] },
        { o: [{ chu: 'Không hưởng lợi khi lãi suất thị trường giảm', dau: 'gach' }, { chu: 'Có lợi khi lãi suất giảm, chịu thiệt khi tăng', dau: 'hoi' }] },
      ],
      to_sang: [2],
    });
    const b = K.khuon_so_sanh_hai_cot({
      kieu, dong_nho: 'Ba loại giấy tờ của một khoản vay', y: 90,
      cot: ['Hợp đồng tín dụng', 'Khế ước nhận nợ', { ten: 'Lịch trả nợ', khoa_mau: 'tot' }],
      hang: [
        { nhan: 'Ký khi nào', o: ['Một lần, khi ngân hàng đồng ý cho vay', 'Mỗi lần nhận tiền giải ngân', 'Kèm khế ước hoặc hợp đồng'] },
        { nhan: 'Ghi những gì', o: ['Hạn mức, thời hạn, lãi suất, tài sản bảo đảm, quyền và nghĩa vụ hai bên', 'Số tiền nhận, ngày nhận, lãi suất, hạn trả', 'Ngày và số tiền gốc, lãi từng kỳ'] },
        { nhan: 'Có mấy bản', o: [{ chu: 'Một hợp đồng', dau: 'tich' }, { chu: 'Có thể nhiều khế ước', dau: 'cham_than' }, 'Lập lại khi lãi suất thả nổi thay đổi'] },
      ],
      to_sang: [1],
    });
    san.appendChild(a.el); san.appendChild(b.el);
    const T2 = 6.5;
    return {
      seek(t) {
        a.el.style.display = t < T2 ? '' : 'none'; b.el.style.display = t < T2 ? 'none' : '';
        if (t < T2) a.seek(t); else b.seek(t - T2);
      },
    };
  },
});
