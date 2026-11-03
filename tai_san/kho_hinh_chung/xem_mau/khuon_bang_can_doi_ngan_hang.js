// xem_mau/khuon_bang_can_doi_ngan_hang.js — ô mẫu bảng cân đối ngân hàng: hai cột chồng ngăn theo giá trị (ví dụ giả định), ngăn chứng khoán tô sáng,
// hai ngăn mỏng đưa nhãn ra ngoài cột, dòng tổng, dải ngoại bảng ba thẻ; thẻ bảo lãnh bay lên nhập vào ngăn cho vay ở giây 7,6.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_bang_can_doi_ngan_hang',
  khung: 'html',
  moc: [2.0, 5.0, 9.4],
  tao({ kieu, san, K }) {
    const a = K.khuon_bang_can_doi_ngan_hang({
      kieu, ten_bang: 'Ngân hàng A · Bảng cân đối kế toán (ví dụ giả định)', don_vi: 'nghìn tỷ', thang: 600, hien_tong: true,
      tai_san: [
        { ten: 'Tiền mặt, tiền gửi NHNN', gia_tri: 45 },
        { ten: 'Tiền gửi, cho vay TCTD khác', gia_tri: 60 },
        { ten: 'Cho vay khách hàng', gia_tri: 365, khoa: [{ t: 8.2, gia_tri: 375 }] },
        { ten: 'Chứng khoán', gia_tri: 90, phu: 'kinh doanh, đầu tư', to: 4.0, het_to: 5.8 },
        { ten: 'Tài sản khác', gia_tri: 20 },
      ],
      nguon_von: [
        { ten: 'Tiền gửi khách hàng', gia_tri: 400 },
        { ten: 'Tiền gửi, vay TCTD khác', gia_tri: 70 },
        { ten: 'Giấy tờ có giá phát hành', gia_tri: 40 },
        { ten: 'Nợ khác', gia_tri: 15, khoa: [{ t: 8.2, gia_tri: 25 }] },
        { ten: 'Vốn chủ sở hữu', gia_tri: 55 },
      ],
      ngoai_bang: [
        { ten: 'Bảo lãnh', gia_tri: 45, len: { moc: 7.6, den: 'Cho vay khách hàng' } },
        { ten: 'Thư tín dụng', gia_tri: 30 },
        { ten: 'Cam kết cho vay', gia_tri: 25 },
      ],
    });
    san.appendChild(a.el);
    return { seek(t) { a.seek(t); } };
  },
});
