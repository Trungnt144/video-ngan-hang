// xem_mau/khuon_trich_van_ban_phap_luat.js — ô mẫu thẻ trích văn bản pháp luật: 0–9 s thẻ đủ đầu trang, khổ rộng, tô hai cụm;
// từ 9 s thẻ khổ hẹp 1180 px (chừa chỗ cho hình bên phải), tên văn bản dài xuống dòng, tô ba cụm. Văn bản công khai thật:
// Thông tư 39/2016/TT-NHNN, khoản 1 Điều 2 (đối chiếu thuvienphapluat.vn, luatvietnam.vn ngày 29/10/2026).
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_trich_van_ban_phap_luat',
  khung: 'html',
  moc: [4.2, 8.6, 17.5],
  tao({ kieu, san, K }) {
    const chung = {
      so_hieu: 'Thông tư 39/2016/TT-NHNN', hieu_luc: 'Hiệu lực từ 15/03/2017', co_quan: 'Ngân hàng Nhà nước Việt Nam',
      ten: 'Quy định về hoạt động cho vay của tổ chức tín dụng, chi nhánh ngân hàng nước ngoài đối với khách hàng',
      dieu: 'Điều 2. Giải thích từ ngữ',
      doan: '1. Cho vay là hình thức cấp tín dụng, theo đó tổ chức tín dụng giao hoặc cam kết giao cho khách hàng một khoản tiền để sử dụng vào mục đích xác định trong một thời gian nhất định theo thỏa thuận với nguyên tắc có hoàn trả cả gốc và lãi.',
      nguon: 'Trích nguyên văn khoản 1 Điều 2. Thông tư đã được sửa đổi, bổ sung: tra bản hợp nhất mới nhất trước khi dùng.',
    };
    const a = K.khuon_trich_van_ban_phap_luat(Object.assign({ kieu, dong_nho: 'Văn bản pháp luật', tieu_de: 'Pháp luật định nghĩa “cho vay” thế nào?',
      to_sang: ['giao hoặc cam kết giao', 'có hoàn trả cả gốc và lãi'] }, chung));
    const b = K.khuon_trich_van_ban_phap_luat(Object.assign({ kieu, dong_nho: 'Mục đích sử dụng vốn', rong: 1180, y: 70,
      to_sang: ['mục đích xác định', { chu: 'thời gian nhất định' }, 'hoàn trả cả gốc và lãi'], nguon: null }, chung, { nguon: 'Trích nguyên văn, có thể đọc toàn văn tại Cơ sở dữ liệu quốc gia về văn bản pháp luật.' }));
    san.appendChild(a.el); san.appendChild(b.el);
    const T2 = 9;
    return {
      seek(t) {
        a.el.style.display = t < T2 ? '' : 'none'; b.el.style.display = t < T2 ? 'none' : '';
        if (t < T2) a.seek(t); else b.seek(t - T2);
      },
    };
  },
});
