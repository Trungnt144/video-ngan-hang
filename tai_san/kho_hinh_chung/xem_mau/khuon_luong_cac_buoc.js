// xem_mau/khuon_luong_cac_buoc.js — ô mẫu luồng các bước: 0–8,5 s xếp ngang năm bước thủ tục giải ngân (có chip ai làm);
// từ 8,5 s xếp dọc bốn bước điều chỉnh lãi suất thả nổi, dòng giải thích dài để thấy xuống dòng.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_luong_cac_buoc',
  khung: 'html',
  moc: [3.0, 8.2, 15.5],
  tao({ kieu, san, K }) {
    const a = K.khuon_luong_cac_buoc({
      kieu, dong_nho: 'Thủ tục giải ngân', tieu_de: 'Từ lúc đề nghị tới lúc tiền về tài khoản bên bán',
      buoc: [
        { ten: 'Đề nghị giải ngân', mo_ta: 'Nộp giấy đề nghị kèm chứng từ', vai: 'Khách hàng' },
        { ten: 'Kiểm tra hồ sơ', mo_ta: 'Đối chiếu chứng từ với mục đích vay', vai: 'Ngân hàng' },
        { ten: 'Ký khế ước nhận nợ', mo_ta: 'Ghi số tiền, ngày nhận, lãi suất, hạn trả', vai: 'Hai bên' },
        { ten: 'Chuyển tiền', mo_ta: 'Thường chuyển thẳng cho bên bán hàng', vai: 'Ngân hàng' },
        { ten: 'Bổ sung chứng từ', mo_ta: 'Nộp hoá đơn sau khi thanh toán (nếu có)', vai: 'Khách hàng' },
      ],
    });
    const b = K.khuon_luong_cac_buoc({
      kieu, bo_cuc: 'doc', dong_nho: 'Lãi suất thả nổi', tieu_de: 'Mỗi kỳ điều chỉnh diễn ra thế nào', rong: 1300,
      buoc: [
        { ten: 'Đến kỳ điều chỉnh', mo_ta: 'Thường 3 hoặc 6 tháng một lần, ghi trong hợp đồng tín dụng' },
        { ten: 'Lấy lãi suất cơ sở', mo_ta: 'Ví dụ lãi suất tiết kiệm 12 tháng do chính ngân hàng công bố, thay đổi theo thị trường' },
        { ten: 'Cộng biên độ', mo_ta: 'Biên độ giữ nguyên suốt thời hạn vay, ví dụ 3,5%/năm (ví dụ giả định)' },
        { ten: 'Báo lịch trả nợ mới', mo_ta: 'Số tiền trả mỗi kỳ được tính lại theo lãi suất mới' },
      ],
      sang_het: true,
    });
    san.appendChild(a.el); san.appendChild(b.el);
    const T2 = 8.5;
    return {
      seek(t) {
        a.el.style.display = t < T2 ? '' : 'none'; b.el.style.display = t < T2 ? 'none' : '';
        if (t < T2) a.seek(t); else b.seek(t - T2);
      },
    };
  },
});
