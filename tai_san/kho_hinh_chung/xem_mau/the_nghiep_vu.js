// xem_mau/the_nghiep_vu.js — ô mẫu thẻ nghiệp vụ: hàng thẻ đơn (có dòng phụ, thẻ tô sáng ở giây 2,2), nhóm lưới 3 cột sáu thẻ hiện lần lượt,
// một hàng kiểu 'vien' (CL-03) cố định, và bảng toàn bộ biểu tượng ở chân. Chữ là ví dụ.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'the_nghiep_vu',
  khung: 'html',
  mau: { phang: 'MAU-60', net_tay: 'MAU-59' },
  moc: [0.45, 2.6, 4.2],
  tao({ kieu, san, K }) {
    const m = K.mau, ds = [];
    const tieuDe = K.html('div', { style: `position:absolute;left:80px;top:48px;font:700 40px ${K.PHONG};color:${m.chu};` }, san, 'Thẻ nghiệp vụ — ví dụ chữ');
    const them = (h) => { san.appendChild(h.el); ds.push(h); return h; };
    them(K.the_nghiep_vu({ kieu, chu: 'Cho vay mua nhà', phu: 'trả dần 15–20 năm', bieu_tuong: 'nha', x: 80, y: 190, neo: 'trai', vao: 0 }));
    them(K.the_nghiep_vu({ kieu, chu: 'Thẻ tín dụng', bieu_tuong: 'the', khoa_mau: 'nhan_phu', x: 560, y: 190, neo: 'trai', vao: 0.2, moc_to: 2.2 }));
    them(K.the_nghiep_vu({ kieu, chu: 'Bảo hiểm qua ngân hàng', phu: 'không bắt buộc khi vay', bieu_tuong: 'bao_hiem', khoa_mau: 'tot', x: 940, y: 190, neo: 'trai', vao: 0.4 }));
    them(K.the_nghiep_vu({ kieu, chu: 'Kiều hối', bieu_tuong: 'kieu_hoi', khoa_mau: 'canh_bao', x: 1480, y: 190, neo: 'trai', vao: 0.6, het: 3.6 }));
    them(K.nhom_the_nghiep_vu({ kieu, huong: 'luoi', cot: 3, x: 80, y: 300, vao: 1.0, nhip: 0.3, the: [
      { chu: 'Cho vay ngắn hạn', phu: 'bổ sung vốn lưu động', bieu_tuong: 'vay' },
      { chu: 'Cho vay đầu tư dự án', bieu_tuong: 'nha_may' },
      { chu: 'Bảo lãnh', phu: 'dự thầu, thực hiện hợp đồng', bieu_tuong: 'bao_lanh', khoa_mau: 'nhan_phu' },
      { chu: 'Thanh toán quốc tế', bieu_tuong: 'thanh_toan_quoc_te', khoa_mau: 'nhan_phu' },
      { chu: 'Mua bán ngoại tệ', bieu_tuong: 'ngoai_hoi', khoa_mau: 'canh_bao' },
      { chu: 'Chi lương qua tài khoản', bieu_tuong: 'luong', khoa_mau: 'tot', moc_to: 3.2 },
    ] }));
    K.html('div', { style: `position:absolute;left:80px;top:556px;font:600 22px ${K.PHONG};color:${m.chu_phu};` }, san, "Kiểu 'vien' (nét viền mảnh, CL-03):");
    them(K.nhom_the_nghiep_vu({ kieu: 'vien', huong: 'ngang', x: 80, y: 596, tinh: true, the: [
      { chu: 'Khối khách hàng cá nhân', bieu_tuong: 'nguoi' }, { chu: 'Khối doanh nghiệp', bieu_tuong: 'nha_may', khoa_mau: 'nhan_phu' }, { chu: 'Thẩm định', bieu_tuong: 'tham_dinh', khoa_mau: 'chu' },
    ] }));
    // bảng biểu tượng
    const svg = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, san);
    const dsBT = K.BIEU_TUONG_NGHIEP_VU, cot = 10;
    dsBT.forEach((ten, i) => {
      const x = 150 + (i % cot) * 180, y = 730 + Math.floor(i / cot) * 112;
      const g = K.svg('g', { transform: `translate(${x} ${y})` }, svg);
      K.svg('circle', { r: 30, fill: m.the, stroke: K.rgba(m.chu, 0.25), 'stroke-width': 2 }, g);
      g.appendChild(K.bieu_tuong_nghiep_vu(ten, { co: 0.85, mau_net: m.chu }));
      K.chu(g, ten, { x: 0, y: 52, co: 18, dam: 600, mau: m.chu_phu, neo: 'middle' });
    });
    void tieuDe;
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
