// xem_mau/khuon_canh_mo_dau_cau_hoi.js — ô mẫu cảnh mở đầu: 0–6 s biến thể câu hỏi (câu dài xuống dòng), từ 6 s biến thể gạch nửa câu niềm tin sai.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_canh_mo_dau_cau_hoi',
  khung: 'html',
  moc: [1.0, 4.2, 12.5],
  tao({ kieu, san, K }) {
    const a = K.khuon_canh_mo_dau_cau_hoi({
      kieu, ten_loat: 'Chuyện nghề Ngân hàng · Thuật ngữ cho người mới', thuat_ngu: 'Khế ước nhận nợ',
      cau: 'Đã ký hợp đồng tín dụng rồi, sao mỗi lần nhận tiền lại phải ký thêm một khế ước nhận nợ?',
    });
    const b = K.khuon_canh_mo_dau_cau_hoi({
      kieu, bien_the: 'gach_nua_cau', ten_loat: 'Chuyện nghề Ngân hàng · Ân hạn',
      cau_dau: 'Đang trong thời gian ân hạn là', cau_sai: 'không phải trả đồng nào cho ngân hàng.',
      cau_dung: 'Ân hạn thường chỉ hoãn trả gốc, lãi vẫn phải trả theo kỳ.',
    });
    san.appendChild(a.el); san.appendChild(b.el);
    return {
      seek(t) {
        a.el.style.display = t < 6 ? '' : 'none'; b.el.style.display = t < 6 ? 'none' : '';
        if (t < 6) a.seek(t); else b.seek(t - 6);
      },
    };
  },
});
