// xem_mau/nhan_gia_dinh.js — ô mẫu nhãn "ví dụ giả định": biến thể góc khung, ba con số kèm nhãn (đếm lên, chuỗi sẵn, số thường), nhãn rời chữ khác.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'nhan_gia_dinh',
  khung: 'html',
  moc: [0.25, 0.7, 2.4],
  tao({ kieu, san, K }) {
    const m = K.mau, ds = [];
    const them = (o) => { const h = K.nhan_gia_dinh(Object.assign({ kieu }, o)); san.appendChild(h.el); ds.push(h); return h; };
    K.html('div', { style: `position:absolute;left:120px;top:84px;font:700 52px ${K.PHONG};color:${m.chu};` }, san, 'Khoản vay mua nhà');
    them({ bien_the: 'goc' });
    // thẻ nền chứa các con số
    K.html('div', { style: `position:absolute;left:100px;top:180px;width:1100px;height:640px;border-radius:24px;background:${m.the};box-shadow:0 8px 30px rgba(0,0,0,.08);` }, san);
    them({ bien_the: 'kem_so', x: 160, y: 230, nhan_so: 'Số tiền vay', gia_tri: 500e6, nen_so: m.the, vao: 0.1 });
    them({ bien_the: 'kem_so', x: 160, y: 420, nhan_so: 'Lãi suất ưu đãi năm đầu', so: '9%/năm', nen_so: m.the, mau_so: 'chu', vao: 0.3 });
    them({ bien_the: 'kem_so', x: 160, y: 610, nhan_so: 'Lãi tháng đầu', gia_tri: 3750000, dang: 'so', don_vi: 'đồng', buoc_dem: 1, nen_so: m.the, co_so: 72, vao: 0.5 });
    them({ x: 1300, y: 300, chu: 'số liệu minh hoạ', vao: 0.2 });
    them({ x: 1300, y: 400, chu: 'Ngân hàng A · ví dụ giả định', vao: 0.4, co: 26 });
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
