// xem_mau/khach_hang_ca_nhan.js — ô mẫu bộ nhân vật: bốn vai × bốn tư thế, hai hướng.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'khach_hang_ca_nhan',
  khung: 'svg',
  moc: [0.3, 0.75, 3.2],
  tao({ kieu, san, K }) {
    const g = K.svg('g', null, san), ds = [];
    const dat = (o, x, y) => { const h = K.khach_hang_ca_nhan(Object.assign({ kieu }, o)); h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h); };
    const X = [250, 720, 1190, 1660];
    dat({ vai: 'khach_hang', tu_the: 'chi_tay', nhan: 'Khách hàng · chỉ tay', vao: 0 }, X[0], 452);
    dat({ vai: 'can_bo_tin_dung', tu_the: 'dung', nhan: 'Cán bộ tín dụng · đứng', vao: 0.1 }, X[1], 452);
    dat({ vai: 'giao_dich_vien', tu_the: 'cam_giay', nhan: 'Giao dịch viên · cầm giấy', vao: 0.2 }, X[2], 452);
    dat({ vai: 'chu_doanh_nghiep', tu_the: 'suy_nghi', nhan: 'Chủ doanh nghiệp · suy nghĩ', vao: 0.3 }, X[3], 452);
    dat({ vai: 'khach_hang', tu_the: 'suy_nghi', huong: -1, toc: 'dai', nhan: 'Người vay · hướng trái', vao: 0.15 }, X[0], 960);
    dat({ vai: 'can_bo_tin_dung', tu_the: 'chi_tay', huong: -1, nhan: 'Thẩm định · chỉ tay', vao: 0.25 }, X[1], 960);
    dat({ vai: 'giao_dich_vien', tu_the: 'dung', nhan: 'Giao dịch viên · đứng', vao: 0.35 }, X[2], 960);
    dat({ vai: 'chu_doanh_nghiep', tu_the: 'cam_giay', nhan: 'Công ty B · cầm hợp đồng', vao: 0.45 }, X[3], 960);
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
