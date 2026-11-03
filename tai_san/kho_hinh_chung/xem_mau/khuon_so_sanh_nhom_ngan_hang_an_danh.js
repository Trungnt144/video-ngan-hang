// xem_mau/khuon_so_sanh_nhom_ngan_hang_an_danh.js — ô mẫu khuôn so sánh ba nhóm ngân hàng ẩn danh, bố cục 'cot': cơ cấu thu nhập theo nhóm
// (số ví dụ giả định), ba chỉ tiêu, một ô "chưa có số"; tô sáng dòng 1 từ 3,2 tới 3,95 giây, tô sáng nhóm 3 từ giây 4.
// Ba thời điểm: 1,85 (đang hiện dòng 2), 3,5 (hiện đủ, dòng 1 đang tô), 4,6 (đang tô sáng nhóm 3).
// Bố cục 'chung_truc' chưa có ảnh mẫu riêng: ô mẫu chỉ một khung (đã soát bằng hai lượt chụp thử ngày 02/11/2026: 6 dòng lãi suất, 0 lỗi).
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_so_sanh_nhom_ngan_hang_an_danh',
  khung: 'html',
  moc: [1.85, 3.5, 4.6],
  mau: { phang: 'MAU-55', net_tay: 'MAU-57' },
  tao({ kieu, san, K }) {
    const a = K.khuon_so_sanh_nhom_ngan_hang_an_danh({
      kieu, bo_cuc: 'cot',
      dong_nho: 'Thuật ngữ ngân hàng', tieu_de: 'Thu nhập đến từ đâu, theo nhóm ngân hàng',
      nhom: [{ ten: 'Nhóm nhà nước', phu: '4 ngân hàng' }, { ten: 'Nhóm cổ phần lớn', phu: 'quy mô tài sản lớn' }, { ten: 'Nhóm cổ phần vừa và nhỏ' }],
      chi_tieu: [
        { ten: 'Thu nhập lãi thuần', don_vi: '%', khoang: [[75, 85], [62, 78], [70, 90]], thang: [0, 100] },
        { ten: 'Thu nhập dịch vụ', don_vi: '%', khoang: [[8, 12], [10, 18], [4.5, 10]], thang: [0, 100] },
        { ten: 'Ngoại hối và chứng khoán', don_vi: '%', khoang: [[4, 8], [3, 10], null], thang: [0, 100] },
      ],
      nguon: 'Nguồn: số liệu ví dụ giả định, chỉ để minh hoạ khuôn',
      vao: 0, moc_hien: [1, 1.6, 2.2],
      to_dong: { chi_so: 0, moc: 3.2, het: 3.95 },
      to_nhom: { chi_so: 2, moc: 4 },
    });
    san.appendChild(a.el);
    return { seek(t) { a.seek(t); } };
  },
});
