// xem_mau/khuon_canh_ket_tom_lai.js — ô mẫu cảnh kết: 0–8 s ba ý ngắn (video ân hạn) và dòng trỏ sang video lãi suất thả nổi, khung 7,5 s là
// lúc giữ khung cuối 2 giây; từ 8 s bốn ý dài (video khế ước nhận nợ) để thấy xuống dòng, tên video tiếp theo dài.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_canh_ket_tom_lai',
  khung: 'html',
  moc: [2.3, 7.5, 16.5],
  tao({ kieu, san, K }) {
    const a = K.khuon_canh_ket_tom_lai({
      kieu, ten_loat: 'Chuyện nghề Ngân hàng · Ân hạn',
      y_chinh: ['Ân hạn thường chỉ hoãn trả gốc, không miễn lãi.', 'Thời gian ân hạn ghi rõ trong hợp đồng tín dụng.', 'Hết ân hạn, số tiền trả mỗi kỳ sẽ tăng lên.'],
      tro_sang: 'Lãi suất thả nổi là gì?',
    });
    const b = K.khuon_canh_ket_tom_lai({
      kieu, ten_loat: 'Chuyện nghề Ngân hàng · Khế ước nhận nợ', tieu_de: 'Điều cần nhớ về khế ước nhận nợ',
      y_chinh: [
        'Mỗi lần nhận tiền vay là một lần ký khế ước nhận nợ, ghi số tiền, ngày nhận và lãi suất áp dụng.',
        'Khế ước nhận nợ là một phần không tách rời của hợp đồng tín dụng.',
        'Ngày đến hạn trả nợ tính theo từng khế ước, không phải theo ngày ký hợp đồng.',
        'Ưu đãi lãi suất có thể khác nhau giữa các lần nhận nợ.',
      ],
      tro_sang: { nhan: 'Video tiếp theo', ten: 'Lịch trả nợ: trả gốc đều hay trả góp đều, cách nào nhẹ hơn?' },
    });
    san.appendChild(a.el); san.appendChild(b.el);
    const T2 = 8;
    return {
      seek(t) {
        a.el.style.display = t < T2 ? '' : 'none'; b.el.style.display = t < T2 ? 'none' : '';
        if (t < T2) a.seek(t); else b.seek(t - T2);
      },
    };
  },
});
