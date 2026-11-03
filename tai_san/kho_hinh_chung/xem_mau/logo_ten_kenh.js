// xem_mau/logo_ten_kenh.js — ô mẫu logo và tên kênh: 0–5 s góc logo cảnh mở trên một cảnh mở đầu giả (dòng tên loạt ở chỗ khuôn mở đầu đặt,
// câu hỏi lớn) để thấy logo không đè; từ 5 s màn hình kết 10 giây (logo, tên kênh, lời mời, hai ô trống cho thẻ video YouTube).
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'logo_ten_kenh',
  khung: 'html',
  moc: [1.4, 7.6, 14.5],
  tao({ kieu, san, K }) {
    const m = K.mau;
    const canh = K.html('div', { style: `position:absolute;left:0;top:0;width:1920px;height:1080px;font-family:${K.PHONG};` }, san);
    K.html('div', { style: `position:absolute;left:140px;top:90px;font-size:28px;font-weight:600;letter-spacing:0.04em;color:${m.chu_phu};white-space:nowrap;` }, canh, 'Thuật ngữ · Dự trữ bắt buộc');
    K.html('div', { style: `position:absolute;left:140px;top:300px;width:1100px;font-size:84px;font-weight:800;line-height:100px;color:${m.chu};` }, canh, 'Vì sao ngân hàng không được cho vay hết tiền gửi?');
    const a = K.logo_goc({ kieu, vao: 0.2, ra: 3.8 });
    canh.appendChild(a.el);
    const b = K.man_hinh_ket_kenh({ kieu, vao: 5 });
    san.appendChild(b.el);
    return {
      seek(t) {
        canh.style.display = t < 5 ? '' : 'none';
        a.seek(t); b.seek(t);
      },
    };
  },
});
