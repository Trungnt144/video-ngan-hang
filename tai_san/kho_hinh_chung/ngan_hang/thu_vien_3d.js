// ngan_hang/thu_vien_3d.js — 1.0 — thư viện mô hình 3D rút gọn lĩnh vực ngân hàng (Three.js): khoảng 30 mô hình gốc ở giữa đáy
// (nhà, toà ngân hàng, người, văn phòng, phiếu, giấy tờ, két, sổ tiết kiệm, xấp tiền, hộp khoá, ổ khoá, cân đòn, căn hộ đang xây, ô tô, máy móc,
// thùng hàng, hoá đơn, giấy có giá, cuộn, cờ, thước, con dấu, sổ đăng ký, khiên, kính lúp, dấu hỏi, dấu nhân, dấu tích, biển cảnh báo, cột, ống,
// ống nét đứt, hạt chạy dọc ống), cùng đế sa bàn tròn, đèn ba điểm, máy quay theo khoá thời gian.
// Gọi: KHO.thu_vien_3d_ngan_hang(opt) → { el (khối HTML chứa canvas), seek(t), moc, T, scene, cam, renderer, de, B, MH, them, themMay, capNhat, chieu, diem }.
//   B là bộ dựng của cảnh: B.hop, B.tru, B.cau3, B.mesh, B.langTru, B.vien, B.nhom, B.vl, B.datHat, B.datS, B.datDuoi, B.sang, B.MAU; B.MH (= MH) là thư viện mô hình.
//   Danh sách tên mô hình: KHO.MO_HINH_3D_NGAN_HANG.
// Tham số: kieu 'phang' (vật liệu mờ chuẩn, bóng mềm) | 'net_tay' (vật liệu ba bậc sáng, mọi khối có viền màu chữ, cả khung qua bộ lọc nét run);
//   mau (ghi đè bảng màu); mau3d (ghi đè màu 3D theo khoá: trang, xamNhat, bong, xamDam, than, xanh, cam, vang, vangVien, do, doDam, xamVua, xamCua, camNhat, bang, vangNhat, kinh, vien);
//   rong, cao (cỡ canvas, mặc định 1920 × 1080); x, y (vị trí khối trong sân khấu, mặc định 0, 0); de (true: có đế sa bàn tròn bán kính 6, mặc định true);
//   fov (góc nhìn dọc, mặc định 24); kc_he (hệ số khoảng cách máy quay, mặc định 1,26); vao (giây bắt đầu; t trong seek trừ đi vao trước khi gọi các hàm cập nhật).
// Máy quay: them_may / themMay(t, { az, el, kc, tx, ty, tz, lx, ly, deY }, troi { ta, tb, dAz, day }) như N96; không khai thì đứng ở az 0, el 30, kc 26.
// Hàm cập nhật: capNhat((s) => {...}) với s là giây đã trừ vao; mọi hàm cập nhật phải thuần theo s.
// Màu: mọi màu 3D tính từ KHO.layMau theo bảng (trang = giay, xanh = nhan_phu, cam = nhan, vang = nhat, do = xau, than = chu...), ghi đè bằng opt.mau3d.
// Gom từ xuong_html/n96_tai_san_bao_dam/canh/chung.js: 118-465 (vật liệu, khối, thư viện MH, giữ nguyên hình dạng), 82-116 (dựng cảnh, đèn, đế), 466-500 (máy quay);
// đổi N96.MAU thành màu theo bảng, bỏ trạng thái toàn cục (mỗi lời gọi một cảnh riêng). Cần chung/thu_vien/three.min.js nạp trước.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  K.MO_HINH_3D_NGAN_HANG = ['nha', 'nganHang', 'nguoi', 'vanPhong', 'phieu', 'giay', 'ket', 'so', 'xapTien', 'hopKhoa', 'oKhoa', 'canDon', 'canHo', 'oto', 'mayTien',
    'thung', 'hoaDon', 'giayCoGia', 'cuon', 'coBay', 'thuoc', 'conDau', 'soDangKy', 'khien', 'kinhLup', 'dauHoi', 'dauX', 'dauTich', 'canhBao', 'cot', 'ong', 'ongDut', 'hat'];
  let demId = 0;

  // Màu 3D từ bảng màu của kho.
  K.mau3d = function (opt) {
    const m = K.layMau(opt);
    const xamDam = m.toi ? K.tron(m.chu_phu, m.nen, 0.45) : K.tron(m.chu_phu, m.chu, 0.25);
    const M = {
      nen: m.nen, sang: m.nen_phu, trang: m.giay, xamNhat: K.tron(m.giay, m.chu_phu, 0.3), bong: K.tron(m.giay, m.chu_phu, 0.6), xamDam, than: m.chu,
      xanh: m.nhan_phu, cam: m.nhan, vang: m.nhat, vangVien: K.tron(m.nhat, m.chu, 0.35), do: m.xau, doDam: K.tron(m.xau, m.chu, 0.2),
      xamVua: K.tron(m.chu_phu, m.giay, 0.15), xamCua: K.tron(xamDam, m.giay, 0.15), camNhat: K.tron(m.nhan, m.giay, 0.3), bang: K.tron(m.nhan, m.giay, 0.45),
      vangNhat: K.tron(m.nhat, m.giay, 0.4), kinh: K.tron(m.nhan_phu, m.giay, 0.7), vien: K.tron(m.chu_phu, m.chu, 0.2),
    };
    return Object.assign(M, (opt && opt.mau3d) || {});
  };

  // Bộ dựng mô hình cho một cảnh: thân hàm gom nguyên từ N96 (dòng 118-465), chỉ đổi màu và kiểu vật liệu.
  K.boDung3D = function (THREE, MAU, kieu) {
    const N = {};
    const T = THREE;
    const TAY = kieu === 'net_tay';
    let bac = null;
    const bacToon = () => {
      if (bac) return bac;
      const d = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
      bac = new T.DataTexture(d, 3, 1, T.RGBAFormat);
      bac.minFilter = T.NearestFilter; bac.magFilter = T.NearestFilter; bac.needsUpdate = true;
      return bac;
    };
    N.MAU = MAU;
  const boVl = {};
  function vl(hex, rieng) {
    if (!rieng && boVl[hex]) return boVl[hex];
    const m = TAY
      ? new T.MeshToonMaterial({ color: new T.Color(hex), gradientMap: bacToon() })
      : new T.MeshStandardMaterial({ color: new T.Color(hex), roughness: 0.82, metalness: 0.0 });
    if (!rieng) boVl[hex] = m;
    return m;
  }
  N.vl = vl;
  let vlVien;
  function vien(mesh, mau) {
    if (!vlVien) vlVien = new T.LineBasicMaterial({ color: new T.Color(TAY ? MAU.than : MAU.vien) });
    const l = new T.LineSegments(new T.EdgesGeometry(mesh.geometry, 28), mau ? new T.LineBasicMaterial({ color: new T.Color(mau) }) : vlVien);
    mesh.add(l); return mesh;
  }
  N.vien = vien;
  function mesh(geo, m, x = 0, y = 0, z = 0, coVien = false) {
    const o = new T.Mesh(geo, typeof m === 'string' ? vl(m) : m);
    o.position.set(x, y, z); o.castShadow = true; o.receiveShadow = true;
    if (coVien || TAY) vien(o, typeof coVien === 'string' && !TAY ? coVien : null);
    return o;
  }
  N.mesh = mesh;
  // Hộp đặt đáy tại y.
  N.hop = (w, h, d, m, x = 0, y = 0, z = 0, coVien = true) => mesh(new T.BoxGeometry(w, h, d), m, x, y + h / 2, z, coVien);
  N.tru = (r1, r2, h, m, x = 0, y = 0, z = 0, seg = 24) => mesh(new T.CylinderGeometry(r1, r2, h, seg), m, x, y + h / 2, z);
  N.cau3 = (r, m, x = 0, y = 0, z = 0) => mesh(new T.SphereGeometry(r, 20, 14), m, x, y, z);
  function langTru(w, h, d, m) { // lăng trụ tam giác (mái), đáy ở y=0, sống mái chạy theo trục z
    const sh = new T.Shape(); sh.moveTo(-w / 2, 0); sh.lineTo(w / 2, 0); sh.lineTo(0, h); sh.lineTo(-w / 2, 0);
    const g = new T.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2);
    return mesh(g, m, 0, 0, 0, true);
  }
  N.langTru = langTru;
  N.nhom = (...ds) => { const g = new T.Group(); ds.forEach((d) => d && g.add(d)); return g; };

  // ---------- Thư viện mô hình rút gọn (gốc ở giữa đáy) ----------
  const MH = (N.MH = {});
  MH.nha = (o = {}) => {
    const g = new T.Group(); const mai = o.mai || MAU.cam;
    g.add(N.hop(2.0, 1.9, 1.6, o.than || MAU.trang));
    const r = langTru(2.4, 1.05, 1.9, mai); r.position.y = 1.9; g.add(r);
    g.add(N.hop(0.26, 0.55, 0.26, MAU.xamNhat, 0.55, 2.05, -0.2));
    const kinh = MAU.xamDam;
    [[-0.5, 1.25], [0.5, 1.25], [-0.5, 0.55]].forEach(([x, y]) => g.add(N.hop(0.42, 0.42, 0.04, kinh, x, y, 0.8, false)));
    g.add(N.hop(0.44, 0.8, 0.05, mai, 0.5, 0, 0.8, false));
    g.userData.cao = 2.95;
    return g;
  };
  MH.nganHang = () => {
    const g = new T.Group(); const t = MAU.trang;
    g.add(N.hop(3.3, 0.25, 2.1, MAU.xamNhat));
    g.add(N.hop(2.9, 1.55, 1.3, t, 0, 0.25, -0.3));
    for (let i = 0; i < 4; i++) g.add(N.tru(0.15, 0.17, 1.55, t, -1.2 + i * 0.8, 0.25, 0.75));
    g.add(N.hop(3.4, 0.28, 2.1, t, 0, 1.8));
    const p = langTru(3.4, 0.75, 2.0, t); p.position.y = 2.08; g.add(p);
    g.add(N.hop(1.5, 0.22, 0.04, MAU.xamNhat, 0, 1.83, 1.06, false));
    g.add(N.hop(0.6, 0.9, 0.05, MAU.xamDam, 0, 0.25, 0.36, false));
    g.userData.cao = 2.85;
    return g;
  };
  MH.nguoi = (o = {}) => {
    const g = new T.Group(); const m = o.mau || MAU.xamVua;
    const than = new T.Group();
    than.add(N.tru(0.2, 0.3, 0.95, m));
    than.add(N.cau3(0.23, m, 0, 1.2, 0));
    if (o.cong) { than.rotation.x = 0.32; than.position.z = -0.05; }
    g.add(than);
    g.userData.cao = 1.45;
    return g;
  };
  MH.vanPhong = () => {
    const g = new T.Group();
    g.add(N.hop(1.5, 2.7, 1.3, MAU.trang));
    for (let i = 0; i < 4; i++) g.add(N.hop(1.52, 0.16, 1.32, MAU.xanh, 0, 0.5 + i * 0.55, 0, false));
    g.add(N.hop(0.5, 0.5, 0.06, MAU.xamDam, 0, 0, 0.66, false));
    g.userData.cao = 2.7;
    return g;
  };
  MH.phieu = (mau = MAU.trang, dai = MAU.xanh) => { // phiếu lương đứng
    const g = new T.Group();
    const p = N.hop(0.85, 1.1, 0.05, mau); g.add(p);
    g.add(N.hop(0.85, 0.22, 0.06, dai, 0, 0.82, 0, false));
    for (let i = 0; i < 3; i++) g.add(N.hop(0.55, 0.06, 0.06, MAU.bong, -0.05, 0.22 + i * 0.18, 0.01, false));
    g.rotation.x = -0.12;
    return g;
  };
  MH.giay = () => { // tờ giấy tờ pháp lý vàng, đứng
    const g = new T.Group();
    g.add(N.hop(0.8, 1.05, 0.05, MAU.vang));
    g.children[0].children[0].material = new T.LineBasicMaterial({ color: new T.Color(MAU.vangVien) });
    for (let i = 0; i < 4; i++) g.add(N.hop(0.5, 0.05, 0.06, MAU.vangVien, 0, 0.25 + i * 0.17, 0.01, false));
    return g;
  };
  MH.ket = () => {
    const g = new T.Group();
    g.add(N.hop(1.3, 1.4, 1.1, MAU.xamDam));
    g.add(N.hop(1.05, 1.15, 0.05, MAU.xamCua, 0, 0.12, 0.56, false));
    const d = N.tru(0.18, 0.18, 0.08, MAU.xamNhat); d.rotation.x = Math.PI / 2; d.position.set(0.15, 0.75, 0.6); g.add(d);
    g.add(N.hop(0.08, 0.35, 0.08, MAU.xamNhat, -0.32, 0.55, 0.62, false));
    g.userData.cao = 1.4;
    return g;
  };
  MH.so = (mau = MAU.cam) => { // sổ tiết kiệm đứng
    const g = new T.Group();
    g.add(N.hop(0.75, 1.0, 0.16, mau));
    g.add(N.hop(0.68, 0.94, 0.12, MAU.trang, 0.05, 0.03, 0, false));
    g.add(N.hop(0.4, 0.08, 0.17, MAU.vang, 0, 0.7, 0, false));
    return g;
  };
  MH.xapTien = () => {
    const g = new T.Group();
    for (let i = 0; i < 5; i++) g.add(N.hop(0.95, 0.1, 0.5, i % 2 ? MAU.camNhat : MAU.cam, (i % 2) * 0.04, i * 0.1, 0));
    g.add(N.hop(0.2, 0.52, 0.52, MAU.trang, 0, 0, 0, false));
    return g;
  };
  MH.hopKhoa = () => {
    const g = new T.Group();
    g.add(N.hop(1.3, 0.95, 1.0, MAU.xamNhat));
    g.add(N.hop(1.36, 0.12, 1.06, MAU.bong, 0, 0.95));
    const k = MH.oKhoa(0.7); k.position.set(0, 0.2, 0.55); g.add(k);
    return g;
  };
  MH.oKhoa = (s = 1) => {
    const g = new T.Group();
    g.add(N.hop(0.6, 0.5, 0.25, MAU.xamDam));
    const v = mesh(new T.TorusGeometry(0.2, 0.055, 8, 20, Math.PI), MAU.bong, 0, 0.5, 0); g.add(v);
    g.scale.setScalar(s);
    return g;
  };
  MH.canDon = () => {
    const g = new T.Group();
    g.add(N.hop(1.2, 0.15, 0.8, MAU.xamNhat));
    g.add(N.tru(0.09, 0.11, 2.5, MAU.bong, 0, 0.15));
    const don = new T.Group(); don.position.y = 2.65; g.add(don);
    const thanh = N.hop(3.6, 0.12, 0.14, MAU.xamDam, 0, -0.06, 0); don.add(thanh);
    const dia = [];
    for (const s of [-1, 1]) {
      const d = new T.Group();
      d.add(N.tru(0.03, 0.03, 1.15, MAU.bong, 0, 0, 0, 6));
      const da = N.tru(0.7, 0.62, 0.08, MAU.xamNhat, 0, -0.05); d.add(da);
      d.userData.s = s; dia.push(d); g.add(d);
    }
    g.userData.don = don; g.userData.dia = dia;
    // Đặt góc nghiêng: đĩa luôn thẳng đứng dưới đầu đòn, đáy đĩa ở toạ độ y tương đối.
    g.userData.dat = (goc) => {
      don.rotation.z = goc;
      for (const d of dia) {
        const x = d.userData.s * 1.7 * Math.cos(goc), y = 2.65 + d.userData.s * 1.7 * Math.sin(goc);
        d.position.set(x, y - 1.15, 0);
      }
    };
    g.userData.dat(0);
    g.userData.cao = 2.8;
    return g;
  };
  MH.canHo = (soTang = 6) => {
    const g = new T.Group(); const tang = [];
    for (let i = 0; i < soTang; i++) {
      const f = new T.Group(); f.position.y = i * 0.5;
      f.add(N.hop(1.8, 0.46, 1.5, MAU.trang));
      f.add(N.hop(1.82, 0.14, 1.52, MAU.cam, 0, 0.18, 0, false));
      g.add(f); tang.push(f);
    }
    const gian = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(2.1, soTang * 0.5 + 0.3, 1.8)), new T.LineBasicMaterial({ color: new T.Color(MAU.xamDam) }));
    gian.position.y = (soTang * 0.5 + 0.3) / 2; g.add(gian);
    // cần cẩu
    const cc = new T.Group(); cc.position.set(1.55, 0, -0.5);
    const hc = soTang * 0.5 + 1.3;
    cc.add(N.hop(0.18, hc, 0.18, MAU.xamVua));
    cc.add(N.hop(2.8, 0.14, 0.14, MAU.xamVua, -0.9, hc, 0));
    cc.add(N.hop(0.4, 0.3, 0.3, MAU.xamDam, 0.65, hc - 0.3, 0));
    cc.add(N.tru(0.02, 0.02, 1.0, MAU.xamDam, -1.6, hc - 1.0, 0, 6));
    g.add(cc);
    g.userData.tang = tang; g.userData.gian = gian; g.userData.cao = hc;
    return g;
  };
  MH.oto = () => {
    const g = new T.Group();
    g.add(N.hop(2.2, 0.55, 1.05, MAU.cam, 0, 0.25));
    g.add(N.hop(1.2, 0.5, 0.95, MAU.trang, -0.15, 0.8));
    for (const [x, z] of [[-0.7, 0.5], [0.7, 0.5], [-0.7, -0.5], [0.7, -0.5]]) {
      const b = N.tru(0.26, 0.26, 0.18, MAU.xamDam, 0, 0, 0, 16); b.rotation.x = Math.PI / 2; b.position.set(x, 0.26, z); g.add(b);
    }
    return g;
  };
  MH.mayTien = () => {
    const g = new T.Group();
    g.add(N.hop(0.3, 0.5, 0.6, MAU.xamDam, -0.85, 0));
    g.add(N.hop(0.3, 0.5, 0.6, MAU.xamDam, 0.85, 0));
    g.add(N.hop(2.3, 0.3, 0.75, MAU.bong, 0, 0.5));
    g.add(N.hop(0.65, 0.8, 0.75, MAU.cam, -0.8, 0.8));
    g.add(N.hop(0.35, 0.45, 0.5, MAU.xamNhat, 0.85, 0.8));
    const tc = N.tru(0.12, 0.12, 1.1, MAU.xamNhat, 0, 0, 0, 12); tc.rotation.z = Math.PI / 2; tc.position.set(0.05, 1.12, 0); g.add(tc);
    return g;
  };
  MH.thung = () => {
    const g = new T.Group(); const c = 0.75;
    [[-0.4, 0, 0], [0.4, 0, 0], [0, c, 0], [-0.4, 0, -0.8], [0.4, 0, -0.8]].forEach(([x, y, z]) => {
      g.add(N.hop(c, c, c, MAU.cam, x, y, z));
      g.add(N.hop(0.14, c + 0.01, c + 0.01, MAU.bang, x, y, z, false));
    });
    return g;
  };
  MH.hoaDon = () => {
    const g = new T.Group();
    for (let i = 0; i < 6; i++) { const p = N.hop(0.9, 0.08, 1.1, i % 2 ? MAU.vang : MAU.vangNhat, 0, i * 0.08, 0); p.rotation.y = (i % 3 - 1) * 0.08; g.add(p); }
    const d = MH.giay(); d.position.set(0.1, 0.48, -0.3); d.rotation.x = -0.25; g.add(d);
    g.add(N.hop(0.95, 0.1, 0.16, MAU.cam, 0, 0.2, 0.5, false));
    return g;
  };
  MH.giayCoGia = () => {
    const g = MH.giay();
    const n = N.tru(0.16, 0.16, 0.06, MAU.cam, 0, 0, 0, 20); n.rotation.x = Math.PI / 2; n.position.set(0.22, 0.2, 0.05); g.add(n);
    g.scale.setScalar(1.15);
    return g;
  };
  MH.cuon = () => {
    const g = new T.Group();
    const c = N.tru(0.26, 0.26, 1.3, MAU.vang, 0, 0, 0, 20); c.rotation.z = Math.PI / 2; c.position.y = 0.26; g.add(c);
    const c2 = N.tru(0.27, 0.27, 0.12, MAU.cam, 0, 0, 0, 20); c2.rotation.z = Math.PI / 2; c2.position.y = 0.26; g.add(c2);
    const tam = N.hop(1.2, 0.04, 0.9, MAU.vang, 0, 0, 0.6); g.add(tam);
    return g;
  };
  MH.coBay = () => {
    const g = new T.Group();
    g.add(N.tru(0.04, 0.04, 1.7, MAU.xamDam, 0, 0, 0, 8));
    g.add(N.hop(0.8, 0.5, 0.04, MAU.cam, 0.42, 1.15, 0));
    return g;
  };
  MH.thuoc = () => {
    const g = new T.Group();
    const b = N.hop(0.32, 2.0, 0.1, MAU.vang); g.add(b);
    for (let i = 0; i < 9; i++) g.add(N.hop(i % 2 ? 0.1 : 0.18, 0.04, 0.11, MAU.vangVien, -0.08, 0.15 + i * 0.21, 0.01, false));
    return g;
  };
  MH.conDau = () => {
    const g = new T.Group();
    g.add(N.tru(0.38, 0.38, 0.22, MAU.vangVien, 0, 0, 0, 24));
    g.add(N.tru(0.1, 0.14, 0.55, MAU.xamDam, 0, 0.22, 0, 12));
    g.add(N.cau3(0.2, MAU.xamDam, 0, 0.88, 0));
    return g;
  };
  MH.soDangKy = () => {
    const g = new T.Group();
    g.add(N.hop(1.0, 1.25, 0.22, MAU.vang));
    g.add(N.hop(0.9, 1.17, 0.18, MAU.trang, 0.06, 0.04, 0, false));
    g.add(N.hop(0.18, 1.26, 0.24, MAU.vangVien, -0.42, 0, 0, false));
    return g;
  };
  MH.khien = () => {
    const sh = new T.Shape();
    sh.moveTo(0, 0); sh.quadraticCurveTo(0.7, 0.25, 0.75, 1.0); sh.lineTo(0.75, 1.45); sh.quadraticCurveTo(0.35, 1.35, 0, 1.6);
    sh.quadraticCurveTo(-0.35, 1.35, -0.75, 1.45); sh.lineTo(-0.75, 1.0); sh.quadraticCurveTo(-0.7, 0.25, 0, 0);
    const geo = new T.ExtrudeGeometry(sh, { depth: 0.22, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 2 });
    geo.translate(0, 0.05, -0.11);
    const g = new T.Group(); g.add(mesh(geo, MAU.xanh, 0, 0, 0, true));
    const geo2 = new T.ExtrudeGeometry(sh, { depth: 0.05, bevelEnabled: false }); geo2.scale(0.6, 0.6, 1); geo2.translate(0, 0.35, 0.16);
    g.add(mesh(geo2, MAU.trang));
    return g;
  };
  MH.kinhLup = () => {
    const g = new T.Group();
    const v = mesh(new T.TorusGeometry(0.5, 0.08, 10, 32), MAU.xamDam, 0, 0, 0); g.add(v);
    const k = mesh(new T.CylinderGeometry(0.46, 0.46, 0.03, 32), MAU.kinh, 0, 0, 0); k.rotation.x = Math.PI / 2; g.add(k);
    const c = N.tru(0.07, 0.08, 0.8, MAU.xamDam, 0, 0, 0, 10); c.position.set(0.55, -0.55, 0); c.rotation.z = Math.PI / 4; g.add(c);
    return g;
  };
  MH.dauHoi = () => {
    const pts = [[-0.45, 1.25], [-0.35, 1.55], [0, 1.7], [0.38, 1.55], [0.45, 1.22], [0.25, 0.95], [0, 0.78], [0, 0.5]].map(([x, y]) => new T.Vector3(x, y, 0));
    const g = new T.Group();
    g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 48, 0.11, 10), MAU.than));
    g.add(N.cau3(0.13, MAU.than, 0, 0.18, 0));
    return g;
  };
  MH.dauX = (s = 1, mau = MAU.doDam) => {
    const g = new T.Group();
    const a = N.hop(1.2, 0.2, 0.2, mau, 0, -0.1, 0, false); a.rotation.z = Math.PI / 4; g.add(a);
    const b = N.hop(1.2, 0.2, 0.2, mau, 0, -0.1, 0, false); b.rotation.z = -Math.PI / 4; g.add(b);
    g.scale.setScalar(s); return g;
  };
  MH.dauTich = (s = 1) => {
    const g = new T.Group();
    const a = N.hop(0.5, 0.18, 0.18, MAU.xanh, -0.25, -0.1, 0, false); a.rotation.z = -Math.PI / 4; a.position.set(-0.22, -0.05, 0); g.add(a);
    const b = N.hop(1.0, 0.18, 0.18, MAU.xanh, 0, -0.1, 0, false); b.rotation.z = Math.PI / 4; b.position.set(0.22, 0.12, 0); g.add(b);
    g.scale.setScalar(s); return g;
  };
  MH.canhBao = () => {
    const sh = new T.Shape(); sh.moveTo(-0.7, 0); sh.lineTo(0.7, 0); sh.lineTo(0, 1.2); sh.lineTo(-0.7, 0);
    const geo = new T.ExtrudeGeometry(sh, { depth: 0.16, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.04, bevelSegments: 2 }); geo.translate(0, 0.06, -0.08);
    const g = new T.Group(); g.add(mesh(geo, MAU.doDam));
    g.add(N.hop(0.12, 0.45, 0.05, MAU.trang, 0, 0.42, 0.14, false));
    g.add(N.hop(0.12, 0.12, 0.05, MAU.trang, 0, 0.2, 0.14, false));
    const chan = N.tru(0.05, 0.05, 0.7, MAU.xamDam, 0, 0, -0.05, 8); g.add(chan);
    g.children[0].position.y = 0.7; g.children[1].position.y += 0.7; g.children[2].position.y += 0.7;
    return g;
  };
  MH.cot = (mau, w = 0.85, d = 0.85) => { // cột cao 1 đơn vị, đặt chiều cao bằng scale.y
    const g = new T.Group(); const m = mesh(new T.BoxGeometry(w, 1, d), mau, 0, 0.5, 0, true); g.add(m); g.userData.khoi = m; return g;
  };
  // Ống theo đường cong; trả {g, cong}.
  MH.ong = (pts, r, mau, rieng) => {
    const cong = new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(...p)));
    const m = typeof mau === 'string' ? vl(mau, rieng) : mau;
    const o = mesh(new T.TubeGeometry(cong, 80, r, 10), m);
    return { g: o, cong, vl: m };
  };
  MH.ongDut = (pts, r, mau, so = 9, rieng) => {
    const cong = new T.CatmullRomCurve3(pts.map((p) => new T.Vector3(...p)));
    const g = new T.Group(); const m = typeof mau === 'string' ? vl(mau, rieng) : mau;
    for (let i = 0; i < so; i++) {
      const a = i / so, b = a + 0.6 / so; const ds = [];
      for (let k = 0; k <= 6; k++) ds.push(cong.getPointAt(a + (b - a) * k / 6));
      g.add(mesh(new T.TubeGeometry(new T.CatmullRomCurve3(ds), 8, r, 8), m));
    }
    return { g, cong, vl: m };
  };
  // Hạt chạy dọc đường cong: vị trí tính thẳng từ t.
  MH.hat = (so, r, mau) => {
    const g = new T.Group(); const ds = [];
    const m = vl(mau);
    for (let i = 0; i < so; i++) { const h = N.cau3(r, m); h.castShadow = false; g.add(h); ds.push(h); }
    g.userData.ds = ds;
    return g;
  };
  N.datHat = (hatG, cong, t, tocDo, an = 1) => {
    const ds = hatG.userData.ds; const n = ds.length;
    for (let i = 0; i < n; i++) {
      const u = (((i / n + t * tocDo) % 1) + 1) % 1;
      ds[i].position.copy(cong.getPointAt(u));
      const s = an * Math.min(1, u / 0.06, (1 - u) / 0.06);
      ds[i].scale.setScalar(Math.max(s, 0.0001));
      ds[i].visible = s > 0.01;
    }
  };

  // Đặt tỉ lệ hiện của một vật (mọc lên từ đế). s ≈ 0 thì ẩn hẳn.
  N.datS = (o, s, sx) => {
    o.visible = s > 0.002;
    const v = Math.max(s, 0.0001);
    if (sx === 'y') o.scale.set(1, v, 1);
    else o.scale.setScalar(v);
  };
  N.datDuoi = (o, s, ...goc) => { // tỉ lệ nhân thêm vào tỉ lệ gốc lưu trong userData.s0
    const s0 = o.userData.s0 == null ? 1 : o.userData.s0;
    o.visible = s > 0.002; o.scale.setScalar(Math.max(s * s0, 0.0001));
  };
  // Độ phát sáng (0..1) cho vật liệu riêng.
  N.sang = (m, a, mau) => { m.emissive.set(mau || m.color); m.emissiveIntensity = a; };

    return N;
  };

  K.thu_vien_3d_ngan_hang = function (opt) {
    opt = opt || {};
    const T = window.THREE;
    if (!T) throw new Error('thu_vien_3d_ngan_hang: chưa nạp chung/thu_vien/three.min.js');
    const W = opt.rong || 1920, H = opt.cao || 1080, FOV = opt.fov || 24, KC_HE = opt.kc_he || 1.26, tay = opt.kieu === 'net_tay';
    const m = K.layMau(opt), MAU = K.mau3d(opt);
    const B = K.boDung3D(T, MAU, opt.kieu);
    const el = K.html('div', { class: 'kho-3d', style: `position:absolute;left:${opt.x || 0}px;top:${opt.y || 0}px;width:${W}px;height:${H}px;` });
    const canvas = K.html('canvas', { width: W, height: H, style: `width:${W}px;height:${H}px;display:block;` }, el);
    if (tay) {
      // bộ lọc nét run cho cả khung 3D (hạt cố định, khung nào cũng như nhau)
      const s = K.svg('svg', { width: 0, height: 0, style: 'position:absolute;width:0;height:0;' });
      el.appendChild(s);
      const id = `kho-3d-tay-${++demId}`;
      const f = K.svg('filter', { id, x: '-2%', y: '-2%', width: '104%', height: '104%' }, K.svg('defs', null, s));
      K.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.04, numOctaves: 2, seed: opt.hat || 4, result: 'n' }, f);
      K.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 4.2, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
      canvas.style.filter = `url(#${id})`;
    }
    // ----- dựng cảnh (gom từ N96 dòng 82-116) -----
    const r = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    r.setPixelRatio(1);
    r.setSize(W, H, false);
    r.setClearColor(0x000000, 0);
    r.shadowMap.enabled = true;
    r.shadowMap.type = T.PCFSoftShadowMap;
    const sc = new T.Scene();
    const cam = new T.PerspectiveCamera(FOV, W / H, 1, 300);
    sc.add(new T.HemisphereLight(0xffffff, new T.Color(MAU.xamDam), tay ? 0.75 : 0.62));
    const chinh = new T.DirectionalLight(0xffffff, tay ? 0.5 : 0.62);
    chinh.position.set(-9, 16, 11);
    chinh.castShadow = true;
    chinh.shadow.mapSize.set(2048, 2048);
    const sh = chinh.shadow.camera; sh.left = -11; sh.right = 11; sh.top = 11; sh.bottom = -11; sh.near = 1; sh.far = 60;
    chinh.shadow.bias = -0.0008; chinh.shadow.radius = 4;
    sc.add(chinh); sc.add(chinh.target);
    const vienSang = new T.DirectionalLight(0xffffff, 0.28); vienSang.position.set(6, 8, -12); sc.add(vienSang);
    let de = null;
    if (opt.de !== false) {
      de = new T.Group();
      const mTren = B.vl(MAU.trang), mThanh = B.vl(MAU.xamNhat);
      const tru = new T.Mesh(new T.CylinderGeometry(6, 6.15, 0.5, 96, 1), [mThanh, mTren, mThanh]);
      tru.position.y = -0.25; tru.receiveShadow = true; tru.castShadow = true;
      de.add(tru);
      const mep = new T.Mesh(new T.TorusGeometry(6.0, 0.045, 8, 128), B.vl(MAU.bong));
      mep.rotation.x = Math.PI / 2; mep.position.y = 0.0; de.add(mep);
      if (tay) { const l = new T.LineSegments(new T.EdgesGeometry(tru.geometry, 28), new T.LineBasicMaterial({ color: new T.Color(m.chu) })); l.position.copy(tru.position); de.add(l); }
      sc.add(de);
    }
    const san = new T.Mesh(new T.PlaneGeometry(80, 80), new T.ShadowMaterial({ opacity: tay ? 0.1 : 0.16 }));
    san.rotation.x = -Math.PI / 2; san.position.y = -0.5; san.receiveShadow = true; sc.add(san);

    // ----- máy quay theo khoá thời gian (gom từ N96 dòng 466-500) -----
    const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
    const lerp = (a, b, u) => a + (b - a) * u;
    const eo = (u) => { u = clamp(u); return u * u * (3 - 2 * u); };
    const WC = 5.83 / 0.6;
    const tat = (t) => (t <= 0 ? 0 : t > 2 ? 1 : 1 - (1 + WC * t) * Math.exp(-WC * t));
    const MAY = [];
    const camNhap = new T.PerspectiveCamera(FOV, W / H, 1, 300);
    const datCam = (c3, c) => {
      const a = (c.az * Math.PI) / 180, e = (c.el * Math.PI) / 180;
      c3.position.set(c.tx + c.kc * Math.cos(e) * Math.sin(a), c.ty + c.kc * Math.sin(e), c.tz + c.kc * Math.cos(e) * Math.cos(a));
      c3.lookAt(c.tx, c.ty, c.tz);
    };
    const mepDe = (p) => {
      datCam(camNhap, p); camNhap.updateMatrixWorld(); camNhap.updateProjectionMatrix();
      let mx = -1e9; const v = new T.Vector3();
      for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; v.set(6.15 * Math.sin(a), -0.5, 6.15 * Math.cos(a)).project(camNhap); mx = Math.max(mx, ((1 - v.y) / 2) * H); }
      return mx;
    };
    const tuThe = (k, t) => {
      const p = Object.assign({ az: 0, el: 30, kc: 26, tx: 0, ty: 1, tz: 0, lx: 0, ly: 0 }, k.p);
      const tr = k.troi;
      p.kc *= KC_HE;
      if (tr) { const u = eo((t - tr.ta) / (tr.tb - tr.ta)); p.az += (tr.dAz || 0) * u; p.kc /= 1 + ((tr.day || 1) - 1) * u; }
      if (p.deY != null) p.ly = p.deY - mepDe(p);
      return p;
    };
    const KEYS = ['az', 'el', 'kc', 'tx', 'ty', 'tz', 'lx', 'ly'];
    const datMay = (t) => {
      const ds = MAY.length ? MAY.slice().sort((a, b) => a.t - b.t) : [{ t: 0, p: {} }];
      let c = tuThe(ds[0], t);
      for (let i = 1; i < ds.length && ds[i].t <= t; i++) {
        const p = tuThe(ds[i], t); const u = tat(t - ds[i].t);
        for (const k of KEYS) c[k] = lerp(c[k], p[k], u);
      }
      datCam(cam, c);
      cam.setViewOffset(W, H, -c.lx, -c.ly, W, H);
      cam.updateMatrixWorld(); cam.updateProjectionMatrix();
      return c;
    };
    const chieu = (v3) => { const v = v3.clone().project(cam); return { x: ((v.x + 1) / 2) * W + (opt.x || 0), y: ((1 - v.y) / 2) * H + (opt.y || 0) }; };
    const diem = (o, x = 0, y = 0, z = 0) => { o.updateMatrixWorld(true); return chieu(o.localToWorld(new T.Vector3(x, y, z))); };

    const capNhatDs = [];
    const lechVao = opt.vao > 0 ? opt.vao : 0;
    const ra = {
      el, T, scene: sc, cam, renderer: r, de, B, MH: B.MH, MAU,
      // Thêm một vật vào cảnh ở (x, y, z), trả lại vật.
      them(o, x = 0, y = 0, z = 0) { o.position.set(x, y, z); sc.add(o); return o; },
      themMay(t, p, troi) { MAY.push({ t, p, troi }); },
      capNhat(fn) { capNhatDs.push(fn); },
      chieu, diem,
      seek(t) {
        const s = opt.tinh || (opt.vao != null && opt.vao < 0) ? 1e6 : t - lechVao;
        for (const fn of capNhatDs) fn(s);
        ra.may = datMay(s >= 1e6 ? 1e3 : s);
        sc.updateMatrixWorld(true);
        r.render(sc, cam);
      },
      moc: { tam_de: () => chieu(new T.Vector3(0, 0, 0)), mep_truoc_de: () => chieu(new T.Vector3(0, -0.5, 6.15)) },
    };
    ra.them_may = ra.themMay;
    return ra;
  };
})();
