// xem_mau/khuon_cong_thuc_tach_ky_hieu.js — ô mẫu khuôn công thức: 0–6,5 s phân số CAR = vốn tự có / (RWA ba phần), đổi chữ sang số, kết quả, so với 8%;
// từ 6,5 s công thức dãy có ngoặc (dự phòng cụ thể), dòng giải thích dưới ô, tô sáng một ô. Số là ví dụ giả định.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khuon_cong_thuc_tach_ky_hieu',
  khung: 'html',
  moc: [2.0, 5.0, 10.6],
  tao({ kieu, san, K }) {
    const a = K.khuon_cong_thuc_tach_ky_hieu({
      kieu, dong_nho: 'Công thức', tieu_de: 'Hệ số an toàn vốn (ví dụ giả định)', y: 200,
      ten: { chu: 'CAR', phu: 'hệ số an toàn vốn' },
      tu: [{ chu: 'Vốn tự có', so: '20.000 tỷ', phu: 'cấp 1 + cấp 2 − giảm trừ' }],
      mau: [{ chu: 'RWA tín dụng', so: '140.000 tỷ' }, '+', { chu: 'RWA thị trường', so: '6.000 tỷ' }, '+', { chu: 'RWA hoạt động', so: '14.000 tỷ' }],
      ket_qua: '12,5%', so_sanh: { dau: '≥', chu: '8%', phu: 'mức tối thiểu' }, moc_so: 2.8,
    });
    const b = K.khuon_cong_thuc_tach_ky_hieu({
      kieu, dong_nho: 'Công thức dãy có ngoặc', tieu_de: 'Dự phòng cụ thể của một khoản vay', y: 260, vao: 0,
      ten: 'Dự phòng cụ thể',
      tu: ['(', { chu: 'Dư nợ gốc', phu: 'số tiền khách còn nợ' }, '−', { chu: 'Giá trị tài sản khấu trừ', phu: 'theo tỉ lệ của từng loại tài sản', to: 2.7 }, ')', '×', { chu: 'Tỉ lệ trích', phu: 'theo nhóm nợ' }],
    });
    san.appendChild(a.el); san.appendChild(b.el);
    const T2 = 6.5;
    return { seek(t) { a.el.style.display = t < T2 ? '' : 'none'; b.el.style.display = t < T2 ? 'none' : ''; if (t < T2) a.seek(t); else b.seek(t - T2); } };
  },
});
