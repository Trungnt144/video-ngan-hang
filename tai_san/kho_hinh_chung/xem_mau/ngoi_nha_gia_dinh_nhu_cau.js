// xem_mau/ngoi_nha_gia_dinh_nhu_cau.js — ô mẫu 1.1 (ít chữ) khuôn ngôi nhà gia đình và các nhu cầu: ví dụ giả định một cặp vợ chồng chủ cửa hàng tạp hoá và hai con.
// Bốn thành viên (bố mẹ tầng 1 có nhãn, hai con tầng 2 không nhãn), bốn nhu cầu hai mỗi bên chỉ có vật và thẻ (vay kinh doanh, vay mua nhà, kiều hối, tiết kiệm);
// tô sáng "Vay mua nhà" ở giây 7,2; gom thẻ ở giây 10 (không có nhãn khung). Ba thời điểm: nhà và người vừa hiện, đang hiện nhu cầu thứ ba kèm thẻ, đủ cả và một nhu cầu tô sáng.
// Chữ nhìn thấy nhiều nhất một khung: 12 tiếng, mọi chữ ≥ 28 px.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'ngoi_nha_gia_dinh_nhu_cau',
  khung: 'html',
  moc: [1.6, 5.5, 8.0],
  mau: { phang: 'MAU-61', net_tay: 'MAU-57', toi_gian: 'MAU-22' },
  tao({ kieu, san, K }) {
    const a = K.ngoi_nha_gia_dinh_nhu_cau({
      kieu,
      thanh_vien: [{ vai: 'bo', ten: 'Bố', tang: 1 }, { vai: 'me', ten: 'Mẹ', tang: 1 }, { vai: 'con_lon', tang: 2 }, { vai: 'con_nho', tang: 2 }],
      nhu_cau: [
        { vat: 'cua_hang', cua: 0, the: { chu: 'Vay kinh doanh', bieu_tuong: 'kinh_doanh' }, moc: 2.0, moc_the: 2.8 },
        { vat: 'nha', cua: 1, the: { chu: 'Vay mua nhà', bieu_tuong: 'nha' }, moc: 3.0 },
        { vat: 'kieu_hoi', cua: 2, the: { chu: 'Kiều hối', bieu_tuong: 'kieu_hoi' }, moc: 4.0 },
        { vat: 'tiet_kiem', cua: 3, the: { chu: 'Tiết kiệm', bieu_tuong: 'tiet_kiem' }, moc: 5.8 },
      ],
      to: [{ nhu_cau: 1, moc: 7.2 }], gom: { moc: 10 },
      x: 960, y: 560, co: 1, vao: 0.2,
    });
    san.appendChild(a.el);
    return { seek(t) { a.seek(t); } };
  },
});
