// chung/so_do_to_chuc.js — 1.1 (03/11/2026: bộ soạn sẵn đặt ALCO, Hội đồng rủi ro, Hội đồng quản lý vốn dưới Tổng giám đốc; ủy ban của Hội đồng quản trị chỉ còn quản lý rủi ro, nhân sự — theo Thông tư 83/2025/TT-NHNN Điều 6 khoản 2, khoản 4) — sơ đồ tổ chức (cây từ trên xuống) cho video về bộ máy ngân hàng: hộp chữ HTML có dải màu theo nhóm,
// đường nối gấp khúc vuông góc kiểu sơ đồ tổ chức (thanh ngang chung cho các con) vẽ dần, hiện theo tầng hoặc từng nút; ba lớp hiệu ứng:
// đường đi của một việc qua nhiều bộ phận (chấm chạy theo đường nối, đánh số thứ tự), ba tuyến bảo vệ (vùng màu nhạt sau từng nhóm nút),
// mạng lưới chi nhánh, phòng giao dịch (chấm toả xuống từ một nút). Có bộ soạn sẵn 'ngan_hang_thuong_mai' (tên khối, phòng phổ biến,
// không theo sơ đồ thật của ngân hàng nào). Dùng cho N202 (cơ cấu tổ chức), N203 (khoản vay đi qua bộ phận nào), N197, N204, N205.
// Gọi: KHO.so_do_to_chuc_ngan_hang({ kieu, mau, mau_san, thu_gon, bo, ten_moi, phu_moi, nut, tieu_de, dong_nho, chu_thich,
//        moc_tang, duong_di, tuyen, mang_luoi, to, hang_khoi, x, y, rong, cao, vao, tinh });   bí danh KHO.so_do_to_chuc.
//   kieu 'phang' (nền thẻ, dải màu đầu hộp) | 'net_tay' (nền giấy, nét chì đôi) | 'vien' (chỉ nét viền mảnh 2 px, nền trong, chữ đậm; CL-03);
//   x, y, rong, cao: vùng vẽ trong sân khấu 1920×1080 (mặc định 60, 140, 1800, 800). Tiêu đề, dòng nhỏ đặt ngay trên vùng nếu đủ chỗ,
//     không thì chiếm đầu vùng. Không vẽ dưới y + cao (chừa dải phụ đề 960–1080 khi dùng mặc định).
//   nut: [{ id, ten, phu (dòng nhỏ), cha (id), tang (0..5, mặc định suy từ cha), nhom: 'quan_tri' | 'kiem_soat' | 'dieu_hanh' | 'khoi' |
//     'mang_luoi' | 'cong_ty_con' | 'uy_ban' (mỗi nhóm một màu dải), ben: 'trai' | 'phai' (nút nhánh bên, đặt ngang hàng nút `canh`,
//     mặc định canh = cha: nối ngang từ cạnh bên của cha; canh khác cha: nối qua thanh ngang của cha như con thường),
//     net: 'dut' (quan hệ gián tiếp), moc (giây hiện, ghi đè moc_tang), khoa_mau (ghi đè màu nhóm), bieu_tuong (tên trong
//     KHO.BIEU_TUONG_NGHIEP_VU), rong (bề ngang tối đa của hộp) }]. Có mau_san thì nut gộp theo id vào bộ soạn sẵn (trùng id: ghi đè trường).
//   mau_san 'ngan_hang_thuong_mai': id dhdcd, hdqt, uy_ban, bks, ktnb, tgd, cty_con, khcn, sme, dnl, dctc, nguon_von, qlrr, van_hanh,
//     cntt, tckt, nhan_su, phap_che, xu_ly_no, chi_nhanh, pgd; thu_gon: true gộp cntt, tckt, nhan_su, phap_che thành 'ho_tro' (Khối hỗ trợ);
//     bo: ['dctc', ...] bỏ nút (bỏ luôn các nút con của nó); ten_moi, phu_moi: { id: 'chữ' } ghi đè tên, dòng nhỏ.
//   chu_thich: dòng nhỏ góc dưới phải (bộ soạn sẵn mặc định 'Tên gọi mỗi ngân hàng có thể khác'; false là không vẽ).
//   moc_tang: [giây bắt đầu hiện từng tầng] (mặc định vao + 0,3 + 0,9 × tầng); nút trong tầng hiện lần lượt trái sang phải.
//   hang_khoi: 1 | 2 ép số hàng của tầng nhiều nút (mặc định tự chọn: một hàng thu cỡ nếu hộp còn rộng ≥ 170 px, không thì hai hàng).
//   duong_di: [{ ids: [...], moc, nhan, dai_moi_buoc (giây chạy giữa hai nút, 1,4), het }] tô sáng lần lượt các nút, chấm chạy theo đường nối,
//     nhãn góc trên phải liệt kê thứ tự; nút khác mờ đi trong lúc chạy.
//   tuyen: { moc, het, nhan: [3 chữ], ids: [[...], [...], [...]] } ba vùng màu nhạt sau ba nhóm nút kèm chú giải góc dưới trái
//     (bộ soạn sẵn có sẵn nhan và ids).
//   mang_luoi: { cha (id, nên ở tầng cuối), so_chi_nhanh (3–8), so_pgd_moi_chi_nhanh (0–4), moc, nhan } chấm chi nhánh toả xuống từ nút cha,
//     mỗi chấm toả tiếp các chấm phòng giao dịch nhỏ hơn.
//   to: [{ id, moc, het }] tô sáng một nút, làm mờ nút khác.  vao: giây bắt đầu; tinh: true hiện đủ cây ngay (hiệu ứng vẫn theo mốc).
// Trả về { el, seek(t), moc: { nut: { id: { x, y, w, h, tam, tren, duoi } }, tang: [y đỉnh từng tầng], mang_luoi: { chi_nhanh: [[x, y]],
//   pgd: [[x, y]] }, xong } } — toạ độ sân khấu. el là HTML phủ cả sân khấu (hợp đồng mục 7): hộp chữ HTML có data-hop, đường nối SVG.
// Bố cục tính bằng số (K.doChu, K.xuongDong), không đo DOM. Phụ thuộc: kho_nen, the_nghiep_vu (chỉ KHO.bieu_tuong_nghiep_vu, không bắt buộc).
// Bộ soạn sẵn không thu_gon (12 khối, hai hàng) cao hơn vùng 800 px khoảng 10 px: dùng thu_gon hoặc bo bớt nút.
// Giới hạn: con nằm cách cha hơn một tầng chỉ đi qua tầng giữa bằng lối trống khi tầng giữa là nhóm nhiều nút của cùng cha.
// Dựng mới (03/11/2026, lô N196–N205). Không tên, logo, sơ đồ thật của ngân hàng nào; chữ là tham số.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }
  function diemHop(x, y, w, h, r, buoc) {
    const d = [];
    const canh = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / buoc)); for (let i = 0; i < n; i++) d.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); };
    const nG = Math.max(3, Math.round(r / 6)), goc = (cx, cy, a0) => { for (let i = 0; i < nG; i++) { const a = a0 + (Math.PI / 2) * i / nG; d.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    canh(x + r, y, x + w - r, y); goc(x + w - r, y + r, -Math.PI / 2);
    canh(x + w, y + r, x + w, y + h - r); goc(x + w - r, y + h - r, 0);
    canh(x + w - r, y + h, x + r, y + h); goc(x + r, y + h - r, Math.PI / 2);
    canh(x, y + h - r, x, y + r); goc(x + r, y + r, Math.PI);
    return d;
  }
  function diemTron(cx, cy, r, n) { const d = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; d.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return d; }
  // chia đường gấp khúc thành đoạn ngắn để nét tay run đều
  function chiaNho(pts, buoc) {
    const ra = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / buoc));
      for (let k = 1; k <= n; k++) ra.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
    }
    return ra;
  }
  // bỏ điểm trùng và điểm giữa thẳng hàng (kể cả đoạn đi rồi quay lại trên cùng một đường)
  function gon(pts) {
    let a = [];
    for (const p of pts) { const q = a[a.length - 1]; if (!q || Math.abs(q[0] - p[0]) > 0.01 || Math.abs(q[1] - p[1]) > 0.01) a.push([p[0], p[1]]); }
    let doi = true;
    while (doi) {
      doi = false;
      for (let i = 1; i < a.length - 1; i++) {
        const [p, q, r] = [a[i - 1], a[i], a[i + 1]];
        if ((Math.abs(p[0] - q[0]) < 0.01 && Math.abs(q[0] - r[0]) < 0.01) || (Math.abs(p[1] - q[1]) < 0.01 && Math.abs(q[1] - r[1]) < 0.01)) { a.splice(i, 1); doi = true; break; }
      }
    }
    return a;
  }
  const daiDuong = (pts) => { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; };
  function diemTren(pts, s) {
    let con = Math.max(0, s);
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (con <= l || i === pts.length - 1) { const u = l ? K.cl(con / l) : 0; return [K.lerp(pts[i - 1][0], pts[i][0], u), K.lerp(pts[i - 1][1], pts[i][1], u)]; }
      con -= l;
    }
    return pts[pts.length - 1];
  }
  const dPath = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  function veDanL(path, L, p) { path.style.strokeDasharray = `${L.toFixed(1)} ${L.toFixed(1)}`; path.style.strokeDashoffset = (L * (1 - K.cl(p))).toFixed(2); }

  // ---------- bộ soạn sẵn ----------
  const MAU_SAN = {
    ngan_hang_thuong_mai: {
      nut: [
        { id: 'dhdcd', ten: 'Đại hội đồng cổ đông', nhom: 'quan_tri' },
        { id: 'hdqt', ten: 'Hội đồng quản trị', cha: 'dhdcd', nhom: 'quan_tri' },
        { id: 'uy_ban', ten: 'Các ủy ban giúp việc', phu: 'quản lý rủi ro, nhân sự', cha: 'hdqt', ben: 'trai', nhom: 'uy_ban', rong: 600 },
        { id: 'bks', ten: 'Ban kiểm soát', phu: 'do cổ đông bầu, giám sát độc lập', cha: 'dhdcd', ben: 'phai', canh: 'hdqt', nhom: 'kiem_soat' },
        { id: 'ktnb', ten: 'Kiểm toán nội bộ', phu: 'thuộc Ban kiểm soát', cha: 'bks', nhom: 'kiem_soat' },
        { id: 'tgd', ten: 'Tổng giám đốc', phu: 'Ban điều hành; các hội đồng: rủi ro, ALCO, quản lý vốn', cha: 'hdqt', nhom: 'dieu_hanh' },
        { id: 'cty_con', ten: 'Công ty con', phu: 'chứng khoán, bảo hiểm, cho thuê tài chính, quản lý quỹ, tài chính tiêu dùng, quản lý nợ và khai thác tài sản', cha: 'tgd', ben: 'trai', net: 'dut', nhom: 'cong_ty_con', rong: 640 },
        { id: 'khcn', ten: 'Khách hàng cá nhân', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'nguoi' },
        { id: 'sme', ten: 'Doanh nghiệp vừa và nhỏ', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'kinh_doanh' },
        { id: 'dnl', ten: 'Doanh nghiệp lớn', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'nha_may' },
        { id: 'dctc', ten: 'Định chế tài chính', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'ngan_hang' },
        { id: 'nguon_von', ten: 'Nguồn vốn và thị trường tài chính', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'dau_tu' },
        { id: 'qlrr', ten: 'Quản lý rủi ro', phu: 'thẩm định, phê duyệt', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'tham_dinh' },
        { id: 'van_hanh', ten: 'Vận hành', phu: 'tác nghiệp, giải ngân, thanh toán', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'giai_ngan' },
        { id: 'cntt', ten: 'Công nghệ và ngân hàng số', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'ngan_hang_dien_tu' },
        { id: 'tckt', ten: 'Tài chính kế toán', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'bao_cao' },
        { id: 'nhan_su', ten: 'Nhân sự', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'nguoi' },
        { id: 'phap_che', ten: 'Pháp chế và tuân thủ', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'hop_dong' },
        { id: 'xu_ly_no', ten: 'Xử lý nợ', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'canh_bao' },
        { id: 'chi_nhanh', ten: 'Chi nhánh', phu: 'bán hàng, phục vụ khách', cha: 'tgd', tang: 4, nhom: 'mang_luoi', bieu_tuong: 'ngan_hang' },
        { id: 'pgd', ten: 'Phòng giao dịch', phu: 'thuộc chi nhánh', cha: 'chi_nhanh', ben: 'phai', nhom: 'mang_luoi', bieu_tuong: 'kinh_doanh' },
      ],
      gop: ['cntt', 'tckt', 'nhan_su', 'phap_che'],
      ho_tro: { id: 'ho_tro', ten: 'Khối hỗ trợ', phu: 'công nghệ, kế toán, nhân sự, pháp chế', cha: 'tgd', nhom: 'khoi', bieu_tuong: 'bao_cao' },
      tuyen: {
        nhan: ['Tuyến 1: đơn vị kinh doanh tự kiểm soát rủi ro', 'Tuyến 2: quản lý rủi ro, tuân thủ', 'Tuyến 3: kiểm toán nội bộ'],
        ids: [['khcn', 'sme', 'dnl', 'dctc', 'nguon_von', 'chi_nhanh', 'pgd'], ['qlrr', 'phap_che'], ['ktnb']],
      },
      chu_thich: 'Tên gọi mỗi ngân hàng có thể khác',
    },
  };
  K.MAU_SAN_SO_DO_TO_CHUC = Object.keys(MAU_SAN);

  function mauNhom(m, n) {
    if (n.khoa_mau && m[n.khoa_mau]) return m[n.khoa_mau];
    switch (n.nhom) {
      case 'quan_tri': return m.nhan;
      case 'uy_ban': return K.tron(m.nhan, m.chu_phu, 0.5);
      case 'kiem_soat': return m.canh_bao;
      case 'dieu_hanh': return m.nhan_phu;
      case 'khoi': return m.tot;
      case 'mang_luoi': return K.tron(m.tot, m.nhan, 0.5);
      case 'cong_ty_con': return m.chu_phu;
      default: return m.nhan;
    }
  }

  K.so_do_to_chuc_ngan_hang = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu || 'phang', tay = kieu === 'net_tay', vien = kieu === 'vien';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? 0 : (opt.vao || 0);
    const RX = opt.x != null ? opt.x : 60, RY = opt.y != null ? opt.y : 140, RW = opt.rong || 1800, RH = opt.cao || 800;
    const nenThe = vien ? m.nen : (tay ? K.tron(m.the, m.giay, m.toi ? 0.12 : 0.5) : m.the);
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6);
    const mauChuNen = duTuongPhan(m.chu, m.nen, 7), mauPhuNen = duTuongPhan(m.chu_phu, m.nen, 4.6);
    const mauNoi = vien ? K.tron(m.chu, m.nen, 0.25) : tay ? m.chu : K.tron(m.chu_phu, m.nen, 0.15);
    const coIconFn = typeof K.bieu_tuong_nghiep_vu === 'function';

    // ----- danh sách nút -----
    const san = opt.mau_san ? MAU_SAN[opt.mau_san] : null;
    if (opt.mau_san && !san) throw new Error('so_do_to_chuc: không có bộ soạn sẵn ' + opt.mau_san);
    let ds = san ? san.nut.map((n) => Object.assign({}, n)) : [];
    if (san && opt.thu_gon) {
      const gop = new Set(san.gop), i = ds.findIndex((n) => gop.has(n.id));
      ds = ds.filter((n) => !gop.has(n.id));
      ds.splice(i < 0 ? ds.length : i, 0, Object.assign({}, san.ho_tro));
    }
    for (const n of opt.nut || []) { const c = ds.find((x) => x.id === n.id); if (c) Object.assign(c, n); else ds.push(Object.assign({}, n)); }
    const bo = new Set(opt.bo || []);
    for (let doi = true; doi;) { doi = false; for (const n of ds) if (!bo.has(n.id) && n.cha && bo.has(n.cha)) { bo.add(n.id); doi = true; } }
    ds = ds.filter((n) => !bo.has(n.id));
    const theoId = {};
    ds.forEach((n, i) => {
      if (!n.id) throw new Error('so_do_to_chuc: nút ' + i + ' thiếu id');
      if (opt.ten_moi && opt.ten_moi[n.id] != null) n.ten = opt.ten_moi[n.id];
      if (opt.phu_moi && opt.phu_moi[n.id] != null) n.phu = opt.phu_moi[n.id];
      n.thu_tu = i; theoId[n.id] = n;
    });
    ds.forEach((n) => {
      if (n.cha && !theoId[n.cha]) n.cha = null;
      if (n.ben) { if (!n.canh || !theoId[n.canh]) n.canh = n.cha; if (!n.canh) n.ben = null; }
      n.mc = mauNhom(m, n);
    });
    const tangCua = (n, sau = 0) => {
      if (sau > 20) throw new Error('so_do_to_chuc: cha con vòng lặp ở ' + n.id);
      if (n.tang != null) return n.tang;
      if (n.ben) return tangCua(theoId[n.canh], sau + 1);
      if (!n.cha) return 0;
      return tangCua(theoId[n.cha], sau + 1) + 1;
    };
    ds.forEach((n) => { n.r = tangCua(n); });
    const soTang = ds.length ? Math.max(...ds.map((n) => n.r)) + 1 : 0;
    // con "thường" (không phải nhánh bên nối ngang): đi qua thanh ngang của cha
    const laBenNgang = (n) => n.ben && n.canh === n.cha;

    // ----- cỡ hộp -----
    const CO_TU_DO = { coT: 28, lhT: 34, coP: 21, lhP: 26, padX: 22, wMin: 230, wMax: 520, icon: 34 };
    function doHop(n, cfg, wCo) {
      const icon = n.bieu_tuong && coIconFn && cfg.icon ? cfg.icon : 0;
      const iconTren = icon && cfg.iconTren;
      const iconW = icon && !iconTren ? icon + 12 : 0;
      let w = wCo;
      if (w == null) {
        const tw = Math.max(K.doChu(n.ten || '', cfg.coT, 800), n.phu ? K.doChu(n.phu, cfg.coP, 600) : 0);
        w = K.cl(Math.ceil(tw) + cfg.padX * 2 + iconW + 4, cfg.wMin, n.rong || cfg.wMax);
      }
      const trong = w - cfg.padX * 2 - iconW - 4;
      const dongT = K.xuongDong(n.ten || '', trong, cfg.coT, 800), dongP = n.phu ? K.xuongDong(n.phu, trong, cfg.coP, 600) : [];
      const caoChu = dongT.length * cfg.lhT + dongP.length * cfg.lhP;
      const caoNoi = iconTren ? caoChu + icon + 6 : Math.max(caoChu, icon);
      return { w, h: Math.ceil(caoNoi + 16 + 13), dongT, dongP, caoChu, icon, iconTren, iconW, cfg };
    }

    // nhóm con nhiều nút cùng tầng của một cha → khối hàng đều (một hoặc hai hàng)
    const conTrucTiep = {};   // id cha → con ở tầng ngay dưới (không kể nhánh bên nối ngang)
    const conSau = {};        // id cha → con ở tầng sâu hơn
    ds.forEach((n) => {
      if (!n.cha || laBenNgang(n) || n.ben) return;
      const p = theoId[n.cha];
      if (n.r === p.r + 1) (conTrucTiep[p.id] = conTrucTiep[p.id] || []).push(n);
      else if (n.r > p.r + 1) (conSau[p.id] = conSau[p.id] || []).push(n);
    });
    const G_KHOI = 16, LOI = 46;   // khoảng giữa hai hộp trong khối hàng; bề ngang lối trống cho đường đi xuống
    const nhomHang = {};      // id cha → { con, hang: [[n...]], w, lane }
    for (const pid in conTrucTiep) {
      const con = conTrucTiep[pid];
      if (con.length < 4) continue;
      const canLoi = !!conSau[pid];
      const thu = (soHang) => {
        const hang = []; const moi = Math.ceil(con.length / soHang);
        for (let i = 0; i < con.length; i += moi) hang.push(con.slice(i, i + moi));
        const nMax = Math.max(...hang.map((h) => h.length));
        const coLoi = canLoi || soHang > 1;
        const w = (RW - (nMax - 1) * G_KHOI - (coLoi ? LOI - G_KHOI : 0)) / nMax;
        return { hang, w: Math.floor(w), coLoi };
      };
      let chon = null;
      const motHang = thu(1);
      const cfg1 = { coT: 22, lhT: 28, coP: 20, lhP: 25, padX: 10, icon: 30, iconTren: true };
      const ok1 = motHang.w >= 170 && con.every((n) => { const k = doHop(n, cfg1, motHang.w); return k.dongT.length <= 3 && k.dongP.length <= 3; });
      if (opt.hang_khoi === 1 || (opt.hang_khoi !== 2 && ok1)) chon = Object.assign(motHang, { cfg: cfg1 });
      else {
        const hai = thu(2);
        chon = Object.assign(hai, { cfg: { coT: 24, lhT: 30, coP: 20, lhP: 25, padX: 14, icon: 34, iconTren: hai.w < 280 } });
      }
      chon.con = con;
      con.forEach((n) => { n.kt = doHop(n, chon.cfg, chon.w); n.nhomCha = pid; });
      chon.hBox = Math.max(...con.map((n) => n.kt.h));
      con.forEach((n) => { n.kt.h = chon.hBox; });
      nhomHang[pid] = chon;
    }
    ds.forEach((n) => { if (!n.kt) n.kt = doHop(n, CO_TU_DO); n.w = n.kt.w; n.h = n.kt.h; });

    // ----- tiêu đề -----
    const coTD = opt.co_tieu_de || 52, lhTD = Math.round(coTD * 1.2);
    const dongTD = opt.tieu_de ? K.xuongDong(opt.tieu_de, RW * 0.6, coTD, 800) : [];
    const caoDau = (opt.dong_nho ? 44 : 0) + dongTD.length * lhTD;
    let dauTren = RY, cayTren = RY;
    if (caoDau) { if (RY - 18 - caoDau >= 12) dauTren = RY - 18 - caoDau; else cayTren = RY + caoDau + 26; }
    const cayDuoi = RY + RH;

    // ----- chiều cao tầng -----
    const ml = opt.mang_luoi && theoId[opt.mang_luoi.cha] ? opt.mang_luoi : null;
    const soCN = ml ? K.cl(Math.round(ml.so_chi_nhanh || 5), 1, 8) : 0, soPGD = ml ? K.cl(Math.round(ml.so_pgd_moi_chi_nhanh != null ? ml.so_pgd_moi_chi_nhanh : 3), 0, 4) : 0;
    const caoML = ml ? (soPGD ? 116 : 70) : 0;
    const caoHop = []; let soKheTrong = 0;
    for (let r = 0; r < soTang; r++) {
      let h = 0, khe = 0;
      ds.filter((n) => n.r === r).forEach((n) => {
        if (n.nhomCha && nhomHang[n.nhomCha]) { const g = nhomHang[n.nhomCha]; const hh = g.hang.length * g.hBox; if (hh > h) { h = hh; khe = g.hang.length - 1; } }
        else h = Math.max(h, n.h);
      });
      caoHop.push(h); soKheTrong += khe;
    }
    const tongHop = caoHop.reduce((a, b) => a + b, 0);
    const soKhe = Math.max(1, soTang - 1 + soKheTrong);
    const KHE = K.cl((cayDuoi - cayTren - tongHop - caoML) / soKhe, 24, 64);
    const tangY = [], tangH = [];
    let yy = cayTren;
    for (let r = 0; r < soTang; r++) {
      const g = Object.values(nhomHang).find((g) => g.con[0].r === r);
      const h = g ? Math.max(caoHop[r], g.hang.length * g.hBox + (g.hang.length - 1) * KHE) : caoHop[r];
      tangY.push(yy); tangH.push(h); yy += h + KHE;
    }
    if (yy - KHE + caoML > cayDuoi + 1) console.warn('so_do_to_chuc: cây cao hơn vùng vẽ ' + Math.round(yy - KHE + caoML - cayDuoi) + ' px; nên thu_gon, bo bớt nút hoặc tăng cao');

    // ----- vị trí ngang -----
    const tamVung = RX + RW / 2;
    const KHE_TU_DO = 40, KHE_BEN = 72;
    const datTam = (n, x) => { n.x = x; };
    for (let r = 0; r < soTang; r++) {
      const hangNay = ds.filter((n) => n.r === r);
      const khoi = [];   // các khối để dồn khi chồng: { ds: [nút], trai, phai }
      if (r === 0) {
        const goc = hangNay.filter((n) => !n.ben);
        const tong = goc.reduce((a, n) => a + n.w, 0) + KHE_TU_DO * 2 * Math.max(0, goc.length - 1);
        let x = tamVung - tong / 2;
        goc.forEach((n) => { datTam(n, x + n.w / 2); x += n.w + KHE_TU_DO * 2; khoi.push({ ds: [n] }); });
      }
      // con của từng cha (theo thứ tự x của cha)
      const cha = [...new Set(hangNay.filter((n) => n.cha && !n.ben).map((n) => n.cha))].map((id) => theoId[id]).sort((a, b) => a.x - b.x);
      for (const p of cha) {
        const con = hangNay.filter((n) => n.cha === p.id && !n.ben);
        const g = nhomHang[p.id];
        if (g && g.con[0].r === r) {
          g.loi = [];
          g.hang.forEach((h, k) => {
            const tach = Math.ceil(h.length / 2);
            const coLoi = g.coLoi;
            const tong = h.length * g.w + (h.length - 1) * G_KHOI + (coLoi ? LOI - G_KHOI : 0);
            let x = tamVung - tong / 2;
            h.forEach((n, i) => {
              if (coLoi && i === tach) { const phaiTruoc = x - G_KHOI; g.loi[k] = phaiTruoc + LOI / 2; x = phaiTruoc + LOI; }
              datTam(n, x + g.w / 2); n.hangCon = k; x += g.w + G_KHOI;
            });
            if (coLoi && g.loi[k] == null) g.loi[k] = x - G_KHOI + LOI / 2;
          });
          khoi.push({ ds: con, codinh: true });
        } else {
          const tong = con.reduce((a, n) => a + n.w, 0) + KHE_TU_DO * (con.length - 1);
          let x = p.x - tong / 2;
          con.forEach((n) => { datTam(n, x + n.w / 2); x += n.w + KHE_TU_DO; });
          khoi.push({ ds: con });
        }
      }
      // nhánh bên: đặt cạnh nút `canh`, nhiều nút cùng phía thì xếp ra xa dần
      const ben = hangNay.filter((n) => n.ben).sort((a, b) => a.thu_tu - b.thu_tu);
      for (let lan = 0; lan < 4; lan++) for (const n of ben) {
        if (n.x != null) continue;
        const a = theoId[n.canh];
        if (a.x == null) continue;
        const cungPhia = ben.filter((b) => b !== n && b.canh === n.canh && b.ben === n.ben && b.x != null);
        let mep = n.ben === 'trai' ? a.x - a.w / 2 : a.x + a.w / 2;
        cungPhia.forEach((b) => { mep = n.ben === 'trai' ? Math.min(mep, b.x - b.w / 2) : Math.max(mep, b.x + b.w / 2); });
        datTam(n, n.ben === 'trai' ? mep - KHE_BEN - n.w / 2 : mep + KHE_BEN + n.w / 2);
        const kh = khoi.find((k) => k.ds.includes(a));
        if (kh) kh.ds.push(n); else khoi.push({ ds: [n] });
      }
      hangNay.forEach((n) => { if (n.x == null) { datTam(n, tamVung); khoi.push({ ds: [n] }); } });
      // dồn khối chồng nhau, rồi kéo vào trong vùng
      khoi.forEach((k) => { k.trai = Math.min(...k.ds.map((n) => n.x - n.w / 2)); k.phai = Math.max(...k.ds.map((n) => n.x + n.w / 2)); });
      khoi.sort((a, b) => a.trai - b.trai);
      for (let i = 1; i < khoi.length; i++) {
        const lech = khoi[i - 1].phai + 30 - khoi[i].trai;
        if (lech > 0 && !khoi[i].codinh) { khoi[i].ds.forEach((n) => { n.x += lech; }); khoi[i].trai += lech; khoi[i].phai += lech; }
      }
      if (khoi.length) {
        const phai = Math.max(...khoi.map((k) => k.phai)), trai = Math.min(...khoi.map((k) => k.trai));
        let dich = 0;
        if (phai > RX + RW) dich = RX + RW - phai;
        if (trai + dich < RX) dich = RX - trai;
        if (dich) hangNay.forEach((n) => { if (!(n.nhomCha && nhomHang[n.nhomCha])) n.x += dich; });
      }
      // toạ độ dọc
      hangNay.forEach((n) => {
        const g = n.nhomCha && nhomHang[n.nhomCha];
        if (g) { n.top = tangY[r] + n.hangCon * (g.hBox + KHE); }
        else n.top = tangY[r] + (tangH[r] - n.h) / 2;
        n.x = Math.round(n.x - n.w / 2) + n.w / 2; n.top = Math.round(n.top);   // mép hộp trùng điểm ảnh
        n.cy = n.top + n.h / 2; n.bottom = n.top + n.h;
      });
    }

    // ----- đường nối (điểm thô, giữ nguyên số để so tiền tố) -----
    const busTang = (r) => tangY[r] - KHE / 2;
    ds.forEach((n) => {
      if (!n.cha) { n.noi = null; return; }
      const p = theoId[n.cha];
      if (laBenNgang(n)) {
        const trai = n.x < p.x;
        n.noi = [[trai ? p.x - p.w / 2 : p.x + p.w / 2, p.cy], [trai ? n.x + n.w / 2 : n.x - n.w / 2, n.cy]];
        n.noiNgang = true;
        return;
      }
      const pts = [[p.x, p.bottom]];
      let cx = p.x;
      const g = nhomHang[p.id];
      const quaLoi = (k) => { const b = g.hang.length > k ? tangY[g.con[0].r] + k * (g.hBox + KHE) - KHE / 2 : 0; pts.push([cx, b], [g.loi[k], b]); cx = g.loi[k]; };
      if (g && n.nhomCha === p.id) {
        for (let k = 0; k < n.hangCon; k++) quaLoi(k);
        const b = n.top - KHE / 2;
        pts.push([cx, b], [n.x, b], [n.x, n.top]);
      } else {
        if (g && n.r > g.con[0].r) for (let k = 0; k < g.hang.length; k++) quaLoi(k);
        const b = busTang(n.r);
        pts.push([cx, b], [n.x, b], [n.x, n.top]);
      }
      n.noi = pts;
    });
    // đường từ gốc tới tâm một nút (đi xuyên tâm các nút trung gian)
    function tuGoc(n) {
      const chuoi = []; for (let c = n; c; c = c.cha ? theoId[c.cha] : null) chuoi.unshift(c);
      const pts = [[chuoi[0].x, chuoi[0].cy]];
      for (let i = 1; i < chuoi.length; i++) { const c = chuoi[i]; pts.push(...c.noi.map((q) => [q[0], q[1]])); pts.push([c.x, c.cy]); }
      return pts;
    }
    function duongGiua(a, b) {
      const A = tuGoc(a), B = tuGoc(b);
      let k = 0; while (k < A.length && k < B.length && Math.abs(A[k][0] - B[k][0]) < 0.01 && Math.abs(A[k][1] - B[k][1]) < 0.01) k++;
      if (k === 0) return gon([[a.x, a.top], [b.x, b.top]]);
      return gon(A.slice(k - 1).reverse().slice(1).concat(B.slice(k, B.length - 1)));
    }

    // ----- thời điểm hiện -----
    const mocTang = (r) => (tinh ? -100 : (opt.moc_tang && opt.moc_tang[r] != null ? opt.moc_tang[r] : vao + 0.3 + 0.9 * r));
    for (let r = 0; r < soTang; r++) {
      const hangNay = ds.filter((n) => n.r === r && !n.ben).sort((a, b) => a.top - b.top || a.x - b.x);
      const nhip = Math.min(0.08, 0.7 / Math.max(1, hangNay.length));
      hangNay.forEach((n, i) => { n.t0 = n.moc != null ? n.moc : mocTang(r) + i * nhip; });
    }
    for (let lan = 0; lan < 4; lan++) ds.forEach((n) => { if (n.ben && n.t0 == null) { const a = theoId[n.canh]; if (a.t0 != null) n.t0 = n.moc != null ? n.moc : a.t0 + 0.35; } });
    ds.forEach((n) => { if (n.t0 == null) n.t0 = mocTang(n.r); n.tHop = n.t0 + (n.noi && !tinh ? 0.3 : 0); });

    // ----- phần tử -----
    const el = K.html('div', { class: 'kho-so-do-to-chuc', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;font-family:${K.PHONG};pointer-events:none;` });
    const svg = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const gTuyen = K.svg('g', null, svg), gNoi = K.svg('g', null, svg), gML = K.svg('g', null, svg), gVet = K.svg('g', null, svg), gHopTay = K.svg('g', null, svg);
    const lop = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);
    const svgTren = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const lopTren = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);

    // tiêu đề
    let dau = null;
    if (caoDau) {
      dau = K.html('div', { style: `position:absolute;left:${RX}px;top:${dauTren}px;` }, lop);
      if (opt.dong_nho) {
        const loat = K.html('div', { style: 'display:flex;align-items:center;gap:18px;white-space:nowrap;height:34px;margin-bottom:10px;' }, dau);
        dau.vach = K.html('div', { style: `width:56px;height:6px;border-radius:3px;background:${m.nhan};flex:none;` }, loat);
        K.html('div', { style: `font-weight:600;font-size:28px;line-height:34px;letter-spacing:0.04em;color:${mauPhuNen};` }, loat, opt.dong_nho);
        dau.loat = loat;
      }
      dau.td = dongTD.map((s) => K.html('div', { style: `font-weight:800;font-size:${coTD}px;line-height:${lhTD}px;color:${mauChuNen};letter-spacing:-0.01em;white-space:nowrap;` }, dau, s));
    }

    // đường nối
    ds.forEach((n, i) => {
      if (!n.noi) return;
      const pts = gon(n.noi);
      n.L = daiDuong(pts);
      const dut = n.net === 'dut';
      const day = vien ? 2 : tay ? 2.6 : 3;
      const d = tay ? K.duongTay(chiaNho(pts, 46), { hat: 300 + i * 13, lech: 1.3 }) : dPath(pts);
      if (tay) n.L = n.L * 1.06 + 12;
      n.duong = K.svg('path', { d, fill: 'none', stroke: mauNoi, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': dut ? '10 9' : null }, gNoi);
      if (tay && !dut) n.duong2 = K.svg('path', { d: K.duongTay(chiaNho(pts, 52), { hat: 700 + i * 13, lech: 1.6 }), fill: 'none', stroke: K.rgba(m.chu, 0.45), 'stroke-width': 1.4, 'stroke-linecap': 'round' }, gNoi);
    });

    // hộp
    ds.forEach((n, i) => {
      const x0 = Math.round(n.x - n.w / 2), y0 = Math.round(n.top), kt = n.kt, cfg = kt.cfg;
      n.div = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x0.toFixed(1)}px;top:${y0.toFixed(1)}px;width:${n.w}px;height:${n.h}px;box-sizing:border-box;border-radius:14px;transform-origin:50% 50%;` +
        (tay ? '' : vien ? `border:2px ${n.net === 'dut' ? 'dashed' : 'solid'} ${n.mc};` :
          `background:${nenThe};border:2px ${n.net === 'dut' ? 'dashed' : 'solid'} ${K.rgba(n.mc, 0.55)};box-shadow:0 8px 20px ${K.rgba('#000000', m.toi ? 0.35 : 0.09)};`) }, lop);
      if (!tay && !vien) K.html('div', { style: `position:absolute;left:14px;right:14px;top:0;height:7px;border-radius:0 0 6px 6px;background:${n.mc};` }, n.div);
      // khối chữ (và biểu tượng) căn giữa hộp
      const caoNoi = kt.iconTren ? kt.caoChu + kt.icon + 6 : Math.max(kt.caoChu, kt.icon);
      const top0 = 16 + (n.h - 16 - 13 - caoNoi) / 2;
      const rongNoi = kt.iconW + Math.max(...kt.dongT.map((s) => K.doChu(s, cfg.coT, 800)), ...kt.dongP.map((s) => K.doChu(s, cfg.coP, 600)));
      const canhGiua = !kt.icon || kt.iconTren;
      const xChu = canhGiua ? 0 : (n.w - rongNoi) / 2 + kt.iconW;
      if (kt.icon) {
        const ix = kt.iconTren ? n.w / 2 : (n.w - rongNoi) / 2 + kt.icon / 2, iy = kt.iconTren ? top0 + kt.icon / 2 : top0 + caoNoi / 2;
        const s = K.svg('svg', { width: n.w, height: n.h, style: 'position:absolute;left:0;top:0;overflow:visible;' }, n.div);
        const mauIc = vien ? duTuongPhan(n.mc, m.nen, 3) : duTuongPhan(n.mc, nenThe, 3);
        const ic = K.bieu_tuong_nghiep_vu(n.bieu_tuong, { co: kt.icon / 48, mau_net: mauIc, day: 3.4 });
        const gi = K.svg('g', { transform: `translate(${ix.toFixed(1)} ${iy.toFixed(1)})` }, s); gi.appendChild(ic);
      }
      const khoiChu = K.html('div', { style: `position:absolute;left:${canhGiua ? cfg.padX : xChu.toFixed(1)}px;${canhGiua ? `right:${cfg.padX}px;text-align:center;` : ''}top:${(top0 + (kt.iconTren ? kt.icon + 6 : (caoNoi - kt.caoChu) / 2)).toFixed(1)}px;` }, n.div);
      kt.dongT.forEach((s) => K.html('div', { style: `font-weight:800;font-size:${cfg.coT}px;line-height:${cfg.lhT}px;color:${mauChu};white-space:nowrap;` }, khoiChu, s));
      kt.dongP.forEach((s) => K.html('div', { style: `font-weight:600;font-size:${cfg.coP}px;line-height:${cfg.lhP}px;color:${mauPhu};white-space:nowrap;` }, khoiChu, s));
      // nét tay: bóng loang, nền giấy, viền chì đôi, dải màu
      if (tay) {
        n.g = K.svg('g', null, gHopTay);
        const hat = 1000 + i * 17;
        K.svg('path', { d: K.duongTay(diemHop(x0 + 6, y0 + 8, n.w, n.h, 14, 90), { hat: hat + 1, lech: 2, dong: true }) + 'Z', fill: K.rgba(n.mc, m.toi ? 0.35 : 0.22) }, n.g);
        K.svg('path', { d: K.duongTay(diemHop(x0, y0, n.w, n.h, 14, 90), { hat: hat + 2, lech: 1.8, dong: true }) + 'Z', fill: nenThe }, n.g);
        K.svg('path', { d: K.duongTay(diemHop(x0, y0, n.w, n.h, 14, 70), { hat: hat + 3, lech: 1.7, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-dasharray': n.net === 'dut' ? '12 9' : null }, n.g);
        K.svg('path', { d: K.duongTay(diemHop(x0 + 1.5, y0 - 1, n.w - 2, n.h + 1, 14, 80), { hat: hat + 4, lech: 2.2, dong: true }), fill: 'none', stroke: K.rgba(m.chu, 0.4), 'stroke-width': 1.3, 'stroke-linecap': 'round' }, n.g);
        K.svg('path', { d: K.duongTay([[x0 + 18, y0 + 9], [x0 + n.w / 2, y0 + 11], [x0 + n.w - 18, y0 + 8]], { hat: hat + 5, lech: 1.2 }), fill: 'none', stroke: n.mc, 'stroke-width': 7, 'stroke-linecap': 'round' }, n.g);
        // vòng tô sáng nét tay
        n.vong = K.svg('path', { d: K.duongTay(diemHop(x0 - 9, y0 - 9, n.w + 18, n.h + 18, 20, 60), { hat: hat + 6, lech: 2.2 }), fill: 'none', stroke: m.nhan, 'stroke-width': 4.5, 'stroke-linecap': 'round', style: 'display:none' }, svgTren);
        n.vongL = 2 * (n.w + n.h + 36) * 1.08 + 20;
      }
    });

    // ----- ba tuyến bảo vệ -----
    let tuyen = null;
    if (opt.tuyen) {
      const tt = Object.assign({}, san ? san.tuyen : {}, opt.tuyen);
      const ids = (tt.ids || []).map((a) => (a || []).filter((id) => theoId[id]));
      const nhan = tt.nhan || ['Tuyến 1', 'Tuyến 2', 'Tuyến 3'];
      const mauT = [m.tot, m.canh_bao, m.xau];
      const t0 = tt.moc != null ? tt.moc : (tinh ? -100 : vao + 0.3 + 0.9 * soTang + 1);
      tuyen = { t0, het: tt.het, vung: [], chu: null };
      ids.forEach((a, k) => {
        if (!a.length) return;
        const g = K.svg('g', { opacity: 0 }, gTuyen);
        const PAD = 15;
        a.forEach((id, j) => {
          const n = theoId[id], x = n.x - n.w / 2 - PAD, y = n.top - PAD, w = n.w + PAD * 2, h = n.h + PAD * 2;
          if (tay) K.svg('path', { d: K.duongTay(diemHop(x, y, w, h, 22, 70), { hat: 2000 + k * 50 + j, lech: 2.4, dong: true }) + 'Z', fill: mauT[k % 3] }, g);
          else K.svg('rect', { x, y, width: w, height: h, rx: 22, fill: mauT[k % 3] }, g);
        });
        tuyen.vung.push({ g, k, mo: m.toi ? 0.34 : 0.26 });
      });
      // chú giải góc dưới trái
      const dong = nhan.slice(0, 3).map((s, k) => ({ s, k, w: K.doChu(s, 22, 700) }));
      const wCG = Math.ceil(Math.max(...dong.map((d) => d.w))) + 28 + 16 + 36;
      const hCG = dong.length * 34 + 26;
      const nenCG = vien ? m.nen : tay ? nenThe : K.tron(m.nen, m.the, 0.6);
      const cg = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${RX}px;top:${cayDuoi - hCG}px;width:${wCG}px;height:${hCG}px;box-sizing:border-box;padding:13px 18px;border-radius:14px;` +
        (vien ? `border:2px solid ${K.rgba(m.chu, 0.5)};` : tay ? `background:${K.rgba(nenThe, 0.95)};border:2px dashed ${K.rgba(m.chu, 0.6)};` : `background:${nenCG};border:2px solid ${K.rgba(m.chu, 0.15)};`) }, lop);
      const mauCG = duTuongPhan(m.chu, nenCG, 7);
      dong.forEach((d) => {
        const h = K.html('div', { style: 'display:flex;align-items:center;gap:16px;height:34px;white-space:nowrap;' }, cg);
        K.html('div', { style: `width:28px;height:22px;border-radius:7px;flex:none;background:${K.rgba(mauT[d.k], m.toi ? 0.55 : 0.45)};border:2px solid ${mauT[d.k]};box-sizing:border-box;` }, h);
        K.html('div', { style: `font-weight:700;font-size:22px;line-height:30px;color:${mauCG};` }, h, d.s);
      });
      tuyen.chu = cg; tuyen.wCG = wCG; tuyen.hCG = hCG;
    }

    // ----- mạng lưới chi nhánh, phòng giao dịch -----
    let mangLuoi = null;
    const mocML = { chi_nhanh: [], pgd: [] };
    if (ml) {
      const c = theoId[ml.cha];
      const t0 = tinh ? -100 : (ml.moc != null ? ml.moc : c.tHop + 1);
      const mcML = mauNhom(m, { nhom: 'mang_luoi' });
      const buocCN = soPGD ? Math.max(118, soPGD * 32 + 34) : 96;
      let S = Math.min(RW * 0.5, soCN * buocCN);
      if (tuyen) S = Math.min(S, 2 * (c.x - (RX + tuyen.wCG + 40)));
      S = Math.max(S, soCN * 60);
      const busY = c.bottom + 22, y1 = c.bottom + 50, y2 = y1 + 13 + 36 + 8;
      mangLuoi = { t0, cn: [], nhan: null };
      for (let i = 0; i < soCN; i++) {
        const x = c.x - S / 2 + S * (i + 0.5) / soCN;
        const pts = gon([[c.x, c.bottom], [c.x, busY], [x, busY], [x, y1 - 13]]);
        const g = K.svg('g', null, gML);
        const duong = K.svg('path', { d: tay ? K.duongTay(chiaNho(pts, 30), { hat: 3000 + i, lech: 1 }) : dPath(pts), fill: 'none', stroke: mauNoi, 'stroke-width': vien ? 1.8 : 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
        const cham = K.svg('g', { transform: `translate(${x.toFixed(1)} ${y1})` }, g);
        if (vien) K.svg('circle', { r: 12, fill: 'none', stroke: mcML, 'stroke-width': 2.4 }, cham);
        else if (tay) K.svg('path', { d: K.duongTay(diemTron(0, 0, 13, 14), { hat: 3100 + i, lech: 1.2, dong: true }) + 'Z', fill: K.tron(mcML, m.giay, m.toi ? 0.1 : 0.35), stroke: m.chu, 'stroke-width': 2 }, cham);
        else K.svg('circle', { r: 13, fill: mcML, stroke: K.tron(mcML, m.chu, 0.35), 'stroke-width': 2 }, cham);
        const cn = { x, y: y1, g, duong, L: daiDuong(pts) * (tay ? 1.06 : 1) + 4, cham, t: t0 + i * 0.14, pgd: [] };
        mocML.chi_nhanh.push([x, y1]);
        for (let j = 0; j < soPGD; j++) {
          const px = x + (j - (soPGD - 1) / 2) * 30;
          const pp = [[x, y1 + 13], [px, y2 - 8]];
          const gp = K.svg('g', null, g);
          const dp = K.svg('path', { d: dPath(pp), fill: 'none', stroke: mauNoi, 'stroke-width': vien ? 1.4 : 1.8, 'stroke-linecap': 'round' }, gp);
          if (vien) K.svg('circle', { cx: px, cy: y2, r: 7, fill: 'none', stroke: mcML, 'stroke-width': 2 }, gp);
          else K.svg('circle', { cx: px, cy: y2, r: 8, fill: tay ? K.tron(mcML, m.giay, m.toi ? 0.3 : 0.55) : K.tron(mcML, m.nen, 0.35), stroke: tay ? m.chu : 'none', 'stroke-width': 1.6 }, gp);
          cn.pgd.push({ g: gp, d: dp, L: daiDuong(pp) + 2, t: cn.t + 0.3 + j * 0.07 });
          mocML.pgd.push([px, y2]);
        }
        mangLuoi.cn.push(cn);
      }
      const chuNhan = ml.nhan != null ? ml.nhan : `Ví dụ: ${soCN} chi nhánh, ${soCN * soPGD} phòng giao dịch`;
      if (chuNhan) {
        const wN = Math.ceil(K.doChu(chuNhan, 22, 700)) + 6;
        let xN = c.x + S / 2 + 30;
        if (xN + wN > RX + RW) xN = c.x - S / 2 - 30 - wN;
        mangLuoi.nhan = K.html('div', { style: `position:absolute;left:${xN.toFixed(1)}px;top:${Math.min(y1 - 15, cayDuoi - 64)}px;width:${wN}px;font-weight:700;font-size:22px;line-height:30px;white-space:nowrap;color:${mauPhuNen};` }, lop, chuNhan);
      }
      mangLuoi.xong = t0 + soCN * 0.14 + 0.3 + soPGD * 0.07 + 0.6;
    }

    // ----- chú thích góc dưới phải -----
    const chuThich = opt.chu_thich === false ? null : (opt.chu_thich || (san ? san.chu_thich : null));
    let ctEl = null;
    if (chuThich) {
      const w = Math.ceil(K.doChu(chuThich, 20, 600)) + 4;
      ctEl = K.html('div', { style: `position:absolute;left:${RX + RW - w}px;top:${cayDuoi - 28}px;width:${w}px;font-weight:600;font-style:italic;font-size:20px;line-height:28px;white-space:nowrap;color:${mauPhuNen};` }, lop, chuThich);
    }

    // ----- đường đi qua các bộ phận -----
    const dsDuong = (opt.duong_di || []).map((dd, q) => {
      const ids = (dd.ids || []).filter((id) => theoId[id]);
      const dai = dd.dai_moi_buoc || 1.4, t0 = dd.moc != null ? dd.moc : vao + 0.3 + 0.9 * soTang + 2;
      const doan = [];
      for (let i = 1; i < ids.length; i++) doan.push(duongGiua(theoId[ids[i - 1]], theoId[ids[i]]));
      const pts = doan.length ? [].concat(...doan.map((p, i) => (i ? p.slice(1) : p))) : [];   // không gộp: giữ đoạn quay lại để quãng đi khớp Ls
      const Ls = doan.map(daiDuong);
      const tBuoc = doan.map((_, i) => t0 + 0.6 + i * (dai + 0.5));
      const den = ids.map((_, i) => (i === 0 ? t0 : tBuoc[i - 1] + dai));
      const vet = pts.length ? K.svg('path', { d: dPath(pts), fill: 'none', stroke: m.nhan, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, gVet) : null;
      const cham = K.svg('g', { opacity: 0 }, svgTren);
      K.svg('circle', { r: 20, fill: K.rgba(m.nhan, 0.25) }, cham);
      K.svg('circle', { r: 12, fill: m.nhan, stroke: K.chuTren(m.nhan, '#FFFFFF', '#141414'), 'stroke-width': 3 }, cham);
      // số thứ tự trên góc hộp
      const huy = ids.map((id, i) => {
        const n = theoId[id];
        const nenH = m.nhan, mauH = K.chuTren(nenH, '#FFFFFF', '#141414');
        const b = K.html('div', { 'data-hop': '1', 'data-chong': '1', style: `position:absolute;left:${(n.x - n.w / 2 - 16).toFixed(1)}px;top:${(n.top - 16).toFixed(1)}px;width:38px;height:38px;border-radius:50%;box-sizing:border-box;` +
          `background:${nenH};border:3px solid ${m.nen};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:21px;line-height:24px;color:${mauH};opacity:0;` }, lopTren, String(i + 1));
        return b;
      });
      // nhãn góc trên phải
      let nhanEl = null, muc = [];
      const chuN = dd.nhan || '';
      const tenBuoc = ids.map((id, i) => `${i + 1}. ${theoId[id].ten}`);
      const nenN = vien ? m.nen : tay ? nenThe : m.the;
      const mauNChu = duTuongPhan(m.chu, nenN, 7), mauNPhu = duTuongPhan(m.chu_phu, nenN, 4.6), mauNNhan = duTuongPhan(m.nhan, nenN, 4.6);
      const muiTen = '  →  ';
      const wBuoc = tenBuoc.reduce((a, s) => a + K.doChu(s, 22, 700), 0) + (tenBuoc.length - 1) * K.doChu(muiTen, 22, 700);
      const coBuoc = wBuoc <= RW * 0.55;
      const wN = Math.ceil(Math.max(chuN ? K.doChu(chuN, 26, 800) : 0, coBuoc ? wBuoc : 0)) + 44;
      if (chuN || coBuoc) {
        const hN = 22 + (chuN ? 34 : 0) + (coBuoc ? 30 : 0);
        nhanEl = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${RX + RW - wN}px;top:${caoDau ? dauTren + 4 : RY}px;width:${wN}px;height:${hN}px;box-sizing:border-box;padding:10px 20px;border-radius:14px;opacity:0;` +
          (vien ? `border:2px solid ${m.nhan};` : tay ? `background:${K.rgba(nenThe, 0.96)};border:2px dashed ${m.nhan};` : `background:${nenN};border:2px solid ${K.rgba(m.nhan, 0.7)};box-shadow:0 8px 20px ${K.rgba('#000000', m.toi ? 0.35 : 0.1)};`) }, lopTren);
        if (chuN) K.html('div', { style: `font-weight:800;font-size:26px;line-height:34px;color:${mauNChu};white-space:nowrap;` }, nhanEl, chuN);
        if (coBuoc) {
          const h = K.html('div', { style: 'white-space:nowrap;font-weight:700;font-size:22px;line-height:30px;' }, nhanEl);
          tenBuoc.forEach((s, i) => {
            if (i) K.html('span', { style: `color:${mauNPhu};white-space:pre;` }, h, muiTen);
            muc.push(K.html('span', { style: `color:${mauNPhu};` }, h, s));
          });
        }
      }
      return { ids, dai, t0, het: dd.het, doan, Ls, Ltong: daiDuong(pts), tBuoc, den, pts, vet, cham, huy, nhanEl, muc, mauNNhan, mauNPhu, ket: (tBuoc.length ? tBuoc[tBuoc.length - 1] + dai : t0) + 0.4 };
    });

    const dsTo = (opt.to || []).filter((x) => theoId[x.id]);

    let xong = Math.max(0, ...ds.map((n) => n.tHop + 0.45));
    if (mangLuoi) xong = Math.max(xong, mangLuoi.xong);
    if (tuyen) xong = Math.max(xong, tuyen.t0 + 0.6 * 3 + 0.5);
    dsDuong.forEach((d) => { xong = Math.max(xong, d.ket); });
    if (tinh && !dsDuong.length && !tuyen) xong = 0;

    // ----- seek -----
    function seek(t) {
      if (dau) {
        const a = tinh ? 1 : K.eo3(K.tienDo(t, vao, 0.5));
        dau.style.opacity = a.toFixed(3); dau.style.transform = `translateY(${((1 - a) * 14).toFixed(2)}px)`;
        if (dau.vach) dau.vach.style.width = Math.round(8 + 48 * (tinh ? 1 : K.eio(K.tienDo(t, vao, 0.6)))) + 'px';
      }
      // mức tô sáng và làm mờ
      const sang = {}; let mo = 0;
      dsTo.forEach((x) => {
        const p = K.eo3(K.tienDo(t, x.moc, 0.35)) * (x.het != null ? 1 - K.eo3(K.tienDo(t, x.het, 0.35)) : 1);
        if (p > 0) { sang[x.id] = Math.max(sang[x.id] || 0, p); mo = Math.max(mo, p); }
      });
      dsDuong.forEach((d) => {
        const ra = d.het != null ? 1 - K.eo3(K.tienDo(t, d.het, 0.4)) : 1;
        const p = K.eo3(K.tienDo(t, d.t0, 0.4)) * ra;
        if (p > 0) mo = Math.max(mo, p * 0.85);
        d.ids.forEach((id, i) => { const q = K.eo3(K.tienDo(t, d.den[i], 0.3)) * ra; if (q > 0) sang[id] = Math.max(sang[id] || 0, q); });
      });
      ds.forEach((n) => {
        const tt = t - n.tHop;
        const a = tinh ? 1 : K.eo3(K.tienDo(tt, 0, 0.35));
        const sc = tinh ? 1 : 0.86 + 0.14 * K.spr(tt, 0.5, 0.66);
        const s = sang[n.id] || 0;
        const mo2 = 1 - 0.62 * mo * (1 - s);
        const ss = sc * (1 + 0.05 * s);
        // đã yên thì bỏ hẳn opacity, transform: trình duyệt vẽ lại y hệt dù khung trước đó ra sao
        const op = a * mo2;
        n.div.style.opacity = op >= 0.9995 ? '' : op.toFixed(3);
        n.div.style.transform = Math.abs(ss - 1) < 0.0005 ? '' : `scale(${ss.toFixed(4)})`;
        if (!tay) { n.div.style.outline = s > 0.001 ? `${(4.5 * s).toFixed(1)}px solid ${K.rgba(m.nhan, 0.95)}` : 'none'; n.div.style.outlineOffset = '5px'; }
        if (n.g) { n.g.setAttribute('opacity', (a * mo2).toFixed(3)); n.g.setAttribute('transform', `translate(${n.x} ${n.cy}) scale(${ss.toFixed(4)}) translate(${-n.x} ${-n.cy})`); }
        if (n.vong) { n.vong.style.display = s > 0.001 ? '' : 'none'; if (s > 0.001) veDanL(n.vong, n.vongL, s); }
        if (n.duong) {
          const p = tinh ? 1 : K.eio(K.tienDo(t, n.t0, 0.45));
          const mn = 1 - 0.5 * mo;
          const hien = p > 0.001 ? 1 : 0;
          if (n.net === 'dut') n.duong.setAttribute('opacity', (p * mn).toFixed(3));
          else { veDanL(n.duong, n.L, p); n.duong.setAttribute('opacity', (mn * hien).toFixed(3)); }
          if (n.duong2) { veDanL(n.duong2, n.L, p); n.duong2.setAttribute('opacity', (mn * hien).toFixed(3)); }
        }
      });
      if (tuyen) {
        const ra = tuyen.het != null ? 1 - K.eo3(K.tienDo(t, tuyen.het, 0.4)) : 1;
        tuyen.vung.forEach((v, i) => v.g.setAttribute('opacity', (v.mo * K.eo3(K.tienDo(t, tuyen.t0 + i * 0.6, 0.45)) * ra).toFixed(3)));
        const a = K.eo3(K.tienDo(t, tuyen.t0, 0.4)) * ra;
        tuyen.chu.style.opacity = a.toFixed(3); tuyen.chu.style.transform = `translateY(${((1 - a) * 12).toFixed(2)}px)`;
      }
      if (mangLuoi) {
        const mn = 1 - 0.5 * mo;
        mangLuoi.cn.forEach((c) => {
          const p = K.eio(K.tienDo(t, c.t, 0.4));
          veDanL(c.duong, c.L, p);
          c.g.setAttribute('opacity', (p > 0.001 ? mn : 0).toFixed(3));
          const b = K.eob(K.tienDo(t, c.t + 0.3, 0.35));
          c.cham.setAttribute('opacity', K.cl(b * 3).toFixed(3));
          c.cham.setAttribute('transform', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) scale(${Math.max(0.001, b).toFixed(4)})`);
          c.pgd.forEach((q) => {
            const pq = K.eio(K.tienDo(t, q.t, 0.3));
            veDanL(q.d, q.L, pq);
            q.g.setAttribute('opacity', pq > 0.001 ? 1 : 0);
          });
        });
        if (mangLuoi.nhan) mangLuoi.nhan.style.opacity = (K.eo3(K.tienDo(t, mangLuoi.xong - 0.5, 0.4)) * mn).toFixed(3);
      }
      if (ctEl) ctEl.style.opacity = (tinh ? 1 : K.eo3(K.tienDo(t, Math.max(...ds.map((n) => n.tHop)), 0.5))).toFixed(3);
      dsDuong.forEach((d) => {
        const ra = d.het != null ? 1 - K.eo3(K.tienDo(t, d.het, 0.4)) : 1;
        const a = K.eo3(K.tienDo(t, d.t0, 0.4)) * ra;
        if (d.nhanEl) { d.nhanEl.style.opacity = a.toFixed(3); d.nhanEl.style.transform = `translateY(${((1 - a) * -10).toFixed(2)}px)`; }
        d.muc.forEach((s, i) => { const q = K.tienDo(t, d.den[i], 0.25); s.style.color = q > 0.5 ? d.mauNNhan : d.mauNPhu; });
        d.huy.forEach((b, i) => { const q = K.tienDo(t, d.den[i], 0.3); b.style.opacity = (K.eo3(q) * ra).toFixed(3); b.style.transform = `scale(${(0.4 + 0.6 * K.eob(q)).toFixed(4)})`; });
        // quãng đã đi
        let s = 0, dangChay = false;
        d.doan.forEach((_, i) => { const p = K.eio(K.tienDo(t, d.tBuoc[i], d.dai)); s += d.Ls[i] * p; if (p > 0 && p < 1) dangChay = true; });
        if (d.vet) { veDanL(d.vet, d.Ltong + 1, s / (d.Ltong || 1)); d.vet.setAttribute('opacity', (0.8 * ra * (s > 0 ? 1 : 0)).toFixed(3)); }
        if (d.pts.length) {
          const q = diemTren(d.pts, s);
          d.cham.setAttribute('transform', `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)})`);
          const daBat = t >= d.tBuoc[0] - 0.15;
          d.cham.setAttribute('opacity', (daBat ? (dangChay ? 1 : 0.85) : 0) * ra);
        }
      });
    }

    // ----- điểm neo -----
    const mocNut = {};
    ds.forEach((n) => { const x0 = n.x - n.w / 2; mocNut[n.id] = { x: x0, y: n.top, w: n.w, h: n.h, tam: [n.x, n.cy], tren: [n.x, n.top], duoi: [n.x, n.bottom] }; });
    return { el, seek, moc: { nut: mocNut, tang: tangY.slice(), mang_luoi: mocML, duong_di: dsDuong.map((d) => ({ bat_dau: d.t0, ket_thuc: d.ket })), xong } };
  };
  K.so_do_to_chuc = K.so_do_to_chuc_ngan_hang;
})();
