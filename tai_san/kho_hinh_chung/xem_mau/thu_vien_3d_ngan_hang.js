// xem_mau/thu_vien_3d_ngan_hang.js — ô mẫu thư viện mô hình 3D ngân hàng: tám mô hình tiêu biểu trên đế sa bàn tròn, mọc lần lượt bằng lò xo,
// máy quay lượn chậm, cân đòn dao động nhẹ, hạt tiền chạy theo ống từ ngân hàng tới nhà; nhãn HTML chiếu theo vị trí mô hình.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'thu_vien_3d_ngan_hang',
  khung: 'html',
  moc: [0.9, 2.2, 4.5],
  tao({ kieu, san, K }) {
    const m = K.mau;
    const c = K.thu_vien_3d_ngan_hang({ kieu, vao: 0 });
    san.appendChild(c.el);
    const MH = c.MH, B = c.B;
    const ds = [
      ['nganHang', 'Ngân hàng', 0.72], ['nha', 'Nhà ở', 0.72], ['ket', 'Két sắt', 1], ['xapTien', 'Tiền mặt', 1.3],
      ['canDon', 'Cân đòn', 0.62], ['oto', 'Ô tô', 0.85], ['soDangKy', 'Sổ đăng ký', 1.2], ['khien', 'Bảo đảm', 0.9],
    ];
    const vat = ds.map(([ten, nhan, co], i) => {
      const a = Math.PI + (i / ds.length) * Math.PI * 2, R = 3.9;
      const o = c.them(MH[ten](), R * Math.sin(a), 0, R * Math.cos(a));
      o.userData.s0 = co;
      o.rotation.y = ten === 'oto' ? -0.5 : ten === 'nha' ? 0.35 : 0;
      o.userData.caoNhan = (o.userData.cao || 1.3) * co;
      const the = K.html('div', { 'data-hop': '', style: `position:absolute;left:0;top:0;font:700 26px ${K.PHONG};color:${m.chu};background:${K.rgba(m.the, 0.92)};padding:4px 14px;border-radius:${kieu === 'net_tay' ? 4 : 20}px;border:2px solid ${K.rgba(m.vien, kieu === 'net_tay' ? 0.8 : 0.15)};white-space:nowrap;transform:translate(-50%,0);` }, san, nhan);
      return { o, the, a: 0.25 + i * 0.22, cao: o.userData.caoNhan };
    });
    // ống và hạt tiền chạy từ ngân hàng tới nhà
    const p0 = vat[0].o.position, p1 = vat[1].o.position;
    const ong = MH.ongDut([[p0.x, 0.15, p0.z], [(p0.x + p1.x) / 2 + 0.8, 0.15, (p0.z + p1.z) / 2 + 0.8], [p1.x, 0.15, p1.z]], 0.06, c.MAU.bong, 12);
    c.scene.add(ong.g);
    const hat = MH.hat(6, 0.16, c.MAU.cam); c.scene.add(hat);
    const tieuDe = K.html('div', { style: `position:absolute;left:80px;top:46px;font:800 40px ${K.PHONG};color:${m.chu};` }, san, 'Thư viện mô hình 3D: 8 trong 30 mô hình');
    const phu = K.html('div', { style: `position:absolute;left:80px;top:100px;font:500 26px ${K.PHONG};color:${m.chu_phu};` }, san, 'Đế sa bàn, đèn ba điểm, máy quay theo khoá thời gian; màu lấy từ bảng màu của kho');
    c.themMay(0, { az: -18, el: 28, kc: 25, ty: 0.6, deY: 1000 }, { ta: 0, tb: 6, dAz: 22 });
    c.capNhat((s) => {
      vat.forEach((v) => B.datDuoi(v.o, K.spr(s - v.a, 0.45, 0.6)));
      const can = vat[4].o;
      can.userData.dat(0.12 * Math.sin(s * 1.6) * K.cl((s - 1.2) / 0.5));
      ong.g.visible = s > 0.6;
      B.datHat(hat, ong.cong, s, 0.35, K.cl((s - 1.0) / 0.4));
    });
    return {
      seek(t) {
        c.seek(t);
        vat.forEach((v) => {
          const p = c.chieu(v.o.position.clone().setY(v.cao + 0.15));
          const pn = K.eo3(K.tienDo(t, v.a + 0.25, 0.3));
          v.the.style.left = p.x.toFixed(1) + 'px';
          v.the.style.top = (p.y - 52).toFixed(1) + 'px';
          v.the.style.opacity = pn.toFixed(3);
        });
        tieuDe.style.opacity = K.eo3(K.tienDo(t, 0, 0.4)).toFixed(3);
        phu.style.opacity = K.eo3(K.tienDo(t, 0.1, 0.4)).toFixed(3);
      },
    };
  },
});
