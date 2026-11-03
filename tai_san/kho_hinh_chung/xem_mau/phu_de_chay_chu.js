// xem_mau/phu_de_chay_chu.js — ô mẫu phụ đề chạy chữ: câu dài chia hai dòng (không tách "500 triệu đồng"), câu ngắn một dòng ở hộp thứ hai đặt cao hơn.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'phu_de_chay_chu',
  khung: 'html',
  moc: [0.9, 5.2, 9.6],
  tao({ kieu, san, K }) {
    // mốc từ chia đều theo ký tự khi câu không có trường tu (đúng như phụ đề nhận câu thiếu mốc từ)
    const cau = [
      { chu: 'Khế ước nhận nợ là giấy xác nhận từng lần bạn nhận tiền vay.', t: 0.2, den: 3.4 },
      { chu: 'Ví dụ, hợp đồng tín dụng cho vay 500 triệu đồng, lãi suất thả nổi, ưu đãi sáu tháng đầu, và mỗi lần giải ngân lại ký một khế ước nhận nợ riêng.', t: 3.8, den: 10.5 },
    ];
    // định dạng thoi_gian.json có trường tu (mốc từng từ), dạng chuong[].cau[]
    const chuong = [{ cau: [
      { chu: 'Ân hạn là thời gian chưa phải trả gốc.', t: 0.4, den: 2.6, tu: [
        { chu: 'Ân', t: 0.4, den: 0.62 }, { chu: 'hạn', t: 0.62, den: 0.9 }, { chu: 'là', t: 0.9, den: 1.05 }, { chu: 'thời', t: 1.05, den: 1.3 },
        { chu: 'gian', t: 1.3, den: 1.55 }, { chu: 'chưa', t: 1.55, den: 1.8 }, { chu: 'phải', t: 1.8, den: 2.0 }, { chu: 'trả', t: 2.0, den: 2.2 }, { chu: 'gốc.', t: 2.2, den: 2.6 }] },
      { chu: 'Lãi suất thả nổi đổi theo từng kỳ điều chỉnh.', t: 3.0, den: 6.0 },
      { chu: 'Tháng 12 năm 2026, lãi cộng biên độ 3,5%.', t: 6.4, den: 10.4 },
    ] }];
    const nen = K.html('div', { style: `position:absolute;left:120px;top:110px;width:1680px;height:360px;border-radius:24px;background:${K.mau.nen_phu};` }, san);
    K.html('div', { style: `position:absolute;left:60px;top:44px;font:700 46px ${K.PHONG};color:${K.mau.chu_phu};` }, nen, 'Vùng hình của cảnh (phụ đề nằm ở dải dưới 900–1080)');
    const a = K.phu_de_chay_chu({ kieu, cau });
    const b = K.phu_de_chay_chu({ kieu, chuong, day: 720 });
    san.appendChild(a.el); san.appendChild(b.el);
    return { seek(t) { a.seek(t); b.seek(t); } };
  },
});
