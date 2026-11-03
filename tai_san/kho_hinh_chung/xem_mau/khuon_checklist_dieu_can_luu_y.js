// xem_mau/khuon_checklist_dieu_can_luu_y.js — ô mẫu danh sách điều cần lưu ý: 0–6,5 s một cột bốn dòng có dòng giải thích, đủ bốn loại dấu
// (tích, chấm than, hỏi, gạch); từ 6,5 s hai cột bảy dòng (hồ sơ giải ngân), có dòng chữ dài xuống dòng.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_checklist_dieu_can_luu_y',
  khung: 'html',
  moc: [2.6, 6.2, 15.6],
  tao({ kieu, san, K }) {
    const a = K.khuon_checklist_dieu_can_luu_y({
      kieu, dong_nho: 'Điều cần lưu ý', tieu_de: 'Trước khi ký hợp đồng tín dụng, hãy kiểm tra',
      muc: [
        { chu: 'Lãi suất áp dụng và cách điều chỉnh', phu: 'Cố định trong bao lâu, sau đó thả nổi theo lãi suất cơ sở nào, cộng biên độ bao nhiêu' },
        { chu: 'Phí trả nợ trước hạn', dau: 'cham_than', phu: 'Nhiều hợp đồng tính phí theo phần trăm số tiền trả trước hạn' },
        { chu: 'Thời gian ân hạn có miễn lãi không?', dau: 'hoi' },
        { chu: 'Ký khi chưa đọc hết các điều khoản', dau: 'gach' },
      ],
    });
    const b = K.khuon_checklist_dieu_can_luu_y({
      kieu, dong_nho: 'Mục đích sử dụng vốn', tieu_de: 'Hồ sơ giải ngân thường cần',
      muc: [
        'Giấy đề nghị giải ngân', 'Khế ước nhận nợ đã ký',
        'Hợp đồng mua bán hoặc hoá đơn chứng minh đúng mục đích sử dụng vốn',
        'Chứng từ thanh toán cho bên bán', 'Giấy tờ tài sản bảo đảm đã đăng ký', 'Ưu đãi lãi suất đã ghi trong khế ước',
        { chu: 'Chứng từ không khớp mục đích vay', dau: 'gach' },
      ],
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
