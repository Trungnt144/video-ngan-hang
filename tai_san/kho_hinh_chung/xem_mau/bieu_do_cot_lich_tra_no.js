// xem_mau/bieu_do_cot_lich_tra_no.js — ô mẫu biểu đồ lịch trả nợ: bốn kiểu trả (gốc đều có ân hạn 3 kỳ kèm thẻ số liệu, niên kim, gốc cuối kỳ, niên kim có ân hạn), 12 kỳ.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'bieu_do_cot_lich_tra_no',
  khung: 'svg',
  moc: [0.9, 2.2, 5.0],
  tao({ kieu, san, K }) {
    const g = K.svg('g', null, san), ds = [];
    const chung = { kieu, so_ky: 12, so_tien: 120e6, lai_nam: 12, rong: 860, cao: 470 };
    const dat = (o, x, y) => { const h = K.bieu_do_cot_lich_tra_no(Object.assign({}, chung, o)); h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h); return h; };
    dat({ kieu_tra: 'goc_deu', an_han: 3, hien_ky: 4, tieu_de: 'Gốc đều, ân hạn gốc 3 kỳ', chu_thich: 'Vay 120 triệu, 12 tháng, lãi 12%/năm (ví dụ giả định)', vao: 0.1 }, 70, 50);
    dat({ kieu_tra: 'nien_kim', tieu_de: 'Niên kim: tổng trả đều mỗi kỳ', chu_thich: 'Vay 120 triệu, 12 tháng, lãi 12%/năm (ví dụ giả định)', hien_ky: 12, vao: 0.3 }, 990, 50);
    dat({ kieu_tra: 'goc_cuoi_ky', tieu_de: 'Gốc trả một lần cuối kỳ', chu_thich: 'Khế ước nhận nợ 120 triệu (ví dụ giả định)', khoa_goc: 'nhan_phu', vao: 0.6 }, 70, 570);
    dat({ kieu_tra: 'nien_kim', an_han: 3, nhan_an_han: 'Ân hạn: chỉ trả lãi', tieu_de: 'Niên kim sau ân hạn 3 kỳ', chu_thich: 'Lãi suất thả nổi giữ 12%/năm (ví dụ giả định)', vao: 0.8 }, 990, 570);
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
