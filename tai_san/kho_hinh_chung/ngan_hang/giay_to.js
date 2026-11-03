// ngan_hang/giay_to.js — 1.0 — giấy tờ ngân hàng: hợp đồng tín dụng, khế ước nhận nợ, sổ tiết kiệm, chứng chỉ tiền gửi, giấy chứng nhận nhà đất; trượt vào, dòng hiện dần, tô sáng điều khoản, ký, đóng dấu, xếp chồng.
// Gọi: KHO.hop_dong_giay_to({ loai, tieu_de, phu_de, dong, to_sang, ben, dau, chong, truot, kieu, co, mau, vao, moc_hien, moc_to_sang, moc_ky, moc_dau, tinh, hat }); bí danh KHO.giay_to.
//   loai 'hop_dong_tin_dung' (mặc định, tờ 480×660) | 'khe_uoc' (480×600, dải đầu trang) | 'so_tiet_kiem' (bìa sổ 380×520) | 'chung_chi_tien_gui' (ngang 680×460, viền hoa văn)
//        | 'giay_chung_nhan_nha_dat' (480×660, nền hồng nhạt, sơ đồ thửa đất);
//   tieu_de, phu_de: chữ (mặc định theo loại; phu_de false thì bỏ); dong: mảng dòng nội dung — chuỗi là dòng chữ 28 px (phần trước dấu ':' in nhạt), null là vạch giả lập chữ;
//        bỏ trống thì dùng vạch theo loại. Tờ tự cao thêm khi nhiều dòng;
//   to_sang: số thứ tự dòng (hoặc mảng) được tô sáng như bút dạ; ben: mảng { nhan, ten } các bên ký (mặc định theo loại; [] là không ký);
//   dau: chữ trên con dấu (mặc định theo loại, không tên ngân hàng thật; false là không dấu); chong: số tờ xếp chồng phía sau (0–4);
//   truot: 'trai' | 'phai' | 'duoi' | 'tren' | false (hướng trượt vào, mặc định 'duoi'); dien_tich: chữ trong sơ đồ thửa đất (giấy chứng nhận);
//   kieu 'phang' | 'net_tay'; co: tỉ lệ; vao: giây bắt đầu (-1 hiện đủ); moc_hien: mảng giây hiện từng dòng (tính từ lúc hình xuất hiện, như vao);
//   moc_to_sang, moc_ky, moc_dau: giây tô sáng, bắt đầu ký, đóng dấu (mặc định nối tiếp nhau); tinh: true hiện đủ; hat: hạt giống nét tay và chữ ký.
// Kích thước chuẩn: gốc toạ độ ở tâm tờ giấy; hợp đồng rộng 480, cao 660 đơn vị. Chữ nội dung 28, nhãn 22 ở co = 1; chữ vòng con dấu 18 (trang trí, gắn data-chong).
// Trả về { el, seek(t), moc }: moc { tam, tren, duoi, trai, phai, tieu_de, dong: [[x,y] đầu mỗi dòng], to_sang (mép phải dòng tô sáng), ky: [[x,y] mỗi chữ ký], dau, rong, cao } — đã nhân co.
// Chuyển động: tờ trượt vào kèm xoay nhẹ, tiêu đề hiện, từng dòng mở dần từ trái, vệt bút dạ chạy qua dòng tô sáng, chữ ký vẽ dần, con dấu nện xuống làm tờ giấy nảy nhẹ.
// Gom từ xuong_html/n87_chung_chi_tien_gui/trang.html:112-153 (soBia, staple, hopDong, orn, guil, chungChi): ghim kẹp, dòng giả chữ, hai chữ ký, bìa sổ có nhãn, viền hoa văn và vòng tròn góc; đổi sang SVG, màu theo bảng, thêm khế ước, giấy chứng nhận, dấu, tô sáng.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;

  // Bộ vẽ hình khối: phẳng là nét sạch; nét tay là nét chì đôi lệch hạt giống, tô loang, gạch chéo (cùng cách với toa_nha_ngan_hang.js).
  function boVe(g, tay, m, hat0) {
    let hat = hat0;
    const defs = K.svg('defs', null, g), dsMau = {};
    const gach = (mau, mo, goc = 35, buoc = 8) => {
      const k = mau + mo + goc + buoc;
      if (!dsMau[k]) {
        const id = `kho-gt-g${++demId}`;
        const p = K.svg('pattern', { id, width: buoc, height: buoc, patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${goc})` }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: buoc, stroke: mau, 'stroke-width': 1.8, opacity: mo }, p);
        dsMau[k] = `url(#${id})`;
      }
      return dsMau[k];
    };
    const da = (cha, pts, o = {}) => {
      const net = o.net === undefined ? m.vien : o.net, day = o.day || 3;
      if (!tay) {
        const d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
        return K.svg('path', { d, fill: o.to || 'none', stroke: net || 'none', 'stroke-width': day, 'stroke-linejoin': 'round', 'stroke-dasharray': o.dut || null }, cha);
      }
      const nhom = K.svg('g', null, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: o.to, opacity: o.mo_to != null ? o.mo_to : 1 }, nhom);
      if (o.gach) K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: gach(o.gach[0], o.gach[1]) }, nhom);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.3, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.85, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.dut || null }, nhom);
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 2, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.4, opacity: 0.45, 'stroke-linecap': 'round' }, nhom);
      }
      return nhom;
    };
    const cn = (cha, x, y, w, h, o = {}) => {
      if (!tay) return K.svg('rect', { x, y, width: w, height: h, rx: o.bo || 0, fill: o.to || 'none', stroke: o.net === undefined ? m.vien : (o.net || 'none'), 'stroke-width': o.day || 3, 'stroke-dasharray': o.dut || null }, cha);
      return da(cha, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o);
    };
    const tron = (cha, cx, cy, r, o = {}) => {
      if (!tay) return K.svg('circle', { cx, cy, r, fill: o.to || 'none', stroke: o.net === undefined ? m.vien : (o.net || 'none'), 'stroke-width': o.day || 3 }, cha);
      const pts = [], n = Math.max(14, Math.round(r / 2.2));
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      return da(cha, pts, o);
    };
    // đường hở (vạch, nét): phẳng một nét, nét tay hai lượt
    const vach = (cha, pts, o = {}) => {
      const mau = o.mau || m.vien, day = o.day || 3;
      if (!tay) return K.svg('path', { d: 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'), fill: 'none', stroke: mau, 'stroke-width': day, 'stroke-linecap': 'round', opacity: o.mo != null ? o.mo : null }, cha);
      const nhom = K.svg('g', { opacity: o.mo != null ? o.mo : null }, cha);
      K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.1 }), fill: 'none', stroke: mau, 'stroke-width': day * 0.9, 'stroke-linecap': 'round' }, nhom);
      K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.8 }), fill: 'none', stroke: mau, 'stroke-width': day * 0.4, opacity: 0.5, 'stroke-linecap': 'round' }, nhom);
      return nhom;
    };
    return { da, cn, tron, vach, gach, defs, hat: () => hat++ };
  }

  // Đường cong mượt qua dãy điểm (Catmull-Rom đổi sang Bézier bậc ba).
  function duongMuot(pts) {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }
  // Chữ ký giả: chữ hoa vòng lớn, các nét nhỏ dần có vòng ngược, rồi nét đuôi vắt chéo; sinh từ hạt giống; rộng w, quanh gốc.
  function duongChuKy(hat, w) {
    const ng = K.ngauNhien(hat), x0 = -w * 0.46, pts = [];
    // chữ hoa: đi lên, vòng trái, xuống
    pts.push([x0, 14], [x0 + w * 0.06, -18], [x0 + w * 0.14, -40 - ng(1) * 8], [x0 + w * 0.2, -24], [x0 + w * 0.1, 0], [x0 + w * 0.04, 16], [x0 + w * 0.16, 10]);
    // các nét nhỏ: lên xuống, cao dần thấp, thỉnh thoảng một vòng ngược
    let x = x0 + w * 0.18;
    const n = 5 + Math.floor(ng(2) * 3), buoc = (w * 0.62) / n;
    for (let i = 0; i < n; i++) {
      const cao = (12 + ng(10 + i) * 18) * (1 - i / (n * 1.6));
      if (ng(20 + i) > 0.62) { pts.push([x + buoc * 0.5, -cao * 1.4], [x + buoc * 0.15, -cao * 0.9], [x + buoc * 0.45, 6]); }
      else pts.push([x + buoc * 0.45, -cao], [x + buoc * 0.75, 4 + ng(30 + i) * 6]);
      x += buoc;
    }
    // đuôi: kéo xuống rồi vắt dài sang phải dưới chân chữ
    pts.push([x + w * 0.04, -6], [x - w * 0.02, 18], [x - w * 0.3, 30], [x0 + w * 0.12, 26 + ng(40) * 6]);
    let d = duongMuot(pts);
    d += ' ' + duongMuot([[x0 + w * 0.08, 30], [x0 + w * 0.45, 22 + ng(41) * 6], [w * 0.5, 10 - ng(42) * 8]]).replace(/^M/, 'M');
    return d;
  }

  const MAC_DINH = {
    hop_dong_tin_dung: { W: 480, H: 660, tieu_de: 'HỢP ĐỒNG TÍN DỤNG', phu_de: 'Số: 01/2026/HĐTD', vach: 6, ben: [{ nhan: 'BÊN CHO VAY', ten: 'Ngân hàng A' }, { nhan: 'BÊN VAY', ten: 'Khách hàng B' }], dau: 'NGÂN HÀNG A' },
    khe_uoc: { W: 480, H: 600, tieu_de: 'KHẾ ƯỚC NHẬN NỢ', phu_de: 'Kèm theo hợp đồng tín dụng', vach: 5, ben: [{ nhan: 'NGÂN HÀNG', ten: 'Ngân hàng A' }, { nhan: 'BÊN NHẬN NỢ', ten: 'Khách hàng B' }], dau: 'NGÂN HÀNG A' },
    so_tiet_kiem: { W: 380, H: 520, tieu_de: 'SỔ TIẾT KIỆM', phu_de: 'Ngân hàng A', vach: 0, ben: [], dau: false },
    chung_chi_tien_gui: { W: 680, H: 460, tieu_de: 'CHỨNG CHỈ TIỀN GỬI', phu_de: 'Ngân hàng A (giả định)', vach: 3, ben: [{ nhan: 'ĐẠI DIỆN NGÂN HÀNG', ten: '' }], dau: 'NGÂN HÀNG A' },
    giay_chung_nhan_nha_dat: { W: 480, H: 660, tieu_de: 'GIẤY CHỨNG NHẬN', phu_de: 'Quyền sử dụng đất, quyền sở hữu nhà ở và tài sản gắn liền với đất', vach: 2, ben: [{ nhan: 'CƠ QUAN CẤP', ten: '' }], dau: 'CƠ QUAN CẤP GIẤY' },
  };

  K.hop_dong_giay_to = function (opt) {
    opt = Object.assign({ loai: 'hop_dong_tin_dung', kieu: 'phang', co: 1, chong: 0, truot: 'duoi' }, opt || {});
    const loai = MAC_DINH[opt.loai] ? opt.loai : 'hop_dong_tin_dung', md = MAC_DINH[loai];
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co, hat0 = opt.hat || 61;
    const tieuDe = opt.tieu_de != null ? opt.tieu_de : md.tieu_de;
    const phuDe = opt.phu_de === false ? '' : (opt.phu_de != null ? opt.phu_de : md.phu_de);
    const ben = opt.ben != null ? opt.ben : md.ben;
    const chuDau = opt.dau === false ? '' : (opt.dau != null ? opt.dau : md.dau);
    const dsDong = Array.isArray(opt.dong) ? opt.dong : Array.from({ length: md.vach }, () => null);
    const toSang = new Set([].concat(opt.to_sang == null ? [] : opt.to_sang));
    const ngDong = K.ngauNhien(hat0 + 7);

    // màu: giấy luôn sáng, mực luôn tối, kể cả khi bảng nền tối
    const giay = loai === 'giay_chung_nhan_nha_dat' ? K.tron(m.giay, m.xau, 0.1) : m.giay;
    const muc = K.tuongPhan(giay, m.chu) >= 7 ? m.chu : (m.toi ? m.nen : '#1A1A1A');
    let mucPhu = K.tron(muc, giay, 0.32);
    if (K.tuongPhan(mucPhu, giay) < 4.6) mucPhu = K.tron(muc, giay, 0.15);
    const mauDau = m.xau, mauKy = K.tron(m.nhan_phu, muc, 0.35);
    const mauToSang = m.canh_bao;
    const W = md.W;
    const pad = loai === 'chung_chi_tien_gui' ? 70 : loai === 'giay_chung_nhan_nha_dat' ? 50 : 44;
    const rongND = W - pad * 2;

    // ---------- dàn trang: tính trước chiều cao ----------
    const coTieuDe = Math.max(28, K.coVua(tieuDe, rongND, loai === 'chung_chi_tien_gui' ? 38 : 34, 800, 28));
    const dongTieuDe = K.xuongDong(tieuDe, rongND, coTieuDe, 800);
    const dongPhuDe = phuDe ? K.xuongDong(phuDe, rongND, 22, 500) : [];
    const dongND = dsDong.map((d) => (typeof d === 'string' && d ? K.xuongDong(d, rongND, 28, 600) : null));
    const caoDong = dongND.map((l) => (l ? l.length * 36 + 8 : 30));
    const tongND = caoDong.reduce((a, b) => a + b, 0);
    const caoKy = ben.length ? 156 : 0;
    let yDau = { hop_dong_tin_dung: 96, khe_uoc: 84, so_tiet_kiem: 0, chung_chi_tien_gui: 92, giay_chung_nhan_nha_dat: 84 }[loai];
    const caoTieuDe = dongTieuDe.length * coTieuDe * 1.12 + (dongPhuDe.length ? dongPhuDe.length * 28 + 10 : 0);
    const caoSoDo = loai === 'giay_chung_nhan_nha_dat' ? 170 : 0;
    let H = md.H;
    if (loai !== 'so_tiet_kiem') H = Math.max(md.H, Math.ceil(yDau + caoTieuDe + 26 + caoSoDo + tongND + 24 + caoKy + 40));

    // ---------- khung ----------
    const g = K.svg('g', { class: 'kho-giay-to' });
    const khoi = K.svg('g', { transform: `scale(${co})` }, g);
    const B = boVe(khoi, tay, m, hat0);
    const nhomChong = K.svg('g', null, khoi);
    const to = K.svg('g', null, khoi);          // tờ chính: trượt vào
    const nhomNay = K.svg('g', null, to);       // nảy khi đóng dấu
    const giayG = K.svg('g', { transform: `translate(${-W / 2} ${-H / 2})` }, nhomNay);
    const X = (x) => x - W / 2, Y = (y) => y - H / 2;      // đổi toạ độ trang sang toạ độ tâm

    // bóng dưới tờ
    const bongTo = (cha, x, y, w, h) => (tay ? B.cn(cha, x + 10, y + 12, w, h, { net: null, gach: [muc, 0.22] }) : K.svg('rect', { x: x + 6, y: y + 12, width: w, height: h, rx: 6, fill: '#000', opacity: 0.13 }, cha));

    // tờ xếp chồng phía sau
    const dsChong = [];
    const soChong = Math.max(0, Math.min(4, opt.chong | 0));
    for (let k = soChong; k >= 1; k--) {
      const goc = (ngDong(40 + k) - 0.5) * 7, dx = (ngDong(50 + k) - 0.5) * 18 + 6 * k, dy = -8 * k;
      const ng = K.svg('g', null, nhomChong);
      const trong = K.svg('g', { transform: `translate(${dx.toFixed(1)} ${dy}) rotate(${goc.toFixed(2)})` }, ng);
      bongTo(trong, -W / 2, -H / 2, W, H);
      B.cn(trong, -W / 2, -H / 2, W, H, { to: K.tron(giay, muc, 0.04 * k), net: muc, day: 2.5, bo: loai === 'so_tiet_kiem' ? 10 : 3 });
      for (let i = 0; i < 4; i++) B.vach(trong, [[-W / 2 + pad, -H / 2 + 70 + i * 30], [-W / 2 + pad + rongND * (0.5 + ngDong(60 + k * 4 + i) * 0.4), -H / 2 + 70 + i * 30]], { mau: muc, day: 6, mo: 0.18 });
      dsChong.push({ el: ng, k });
    }

    bongTo(giayG, 0, 0, W, H);
    const tieuDeG = K.svg('g', null, giayG);
    let yCon = yDau;           // con trỏ dọc trong trang
    let mocTieuDe = [0, 0], mocDau = null;
    const kyViTri = [];

    // ---------- trang trí theo loại ----------
    if (loai === 'so_tiet_kiem') {
      const bia = K.tron(m.nhan_phu, muc, 0.35), gay = K.tron(bia, muc, 0.35);
      B.cn(giayG, 0, 0, W, H, { to: bia, net: muc, day: 3, bo: 12 });
      B.cn(giayG, 0, 0, W * 0.08, H, { to: gay, net: null, bo: 6 });
      if (!tay) K.svg('rect', { x: W * 0.08, y: 0, width: 3, height: H, fill: '#FFFFFF', opacity: 0.18 }, giayG);
      // nhãn trên bìa
      const nx = W * 0.17, nw = W * 0.7;
      const coT = Math.max(28, K.coVua(tieuDe, nw - 28, 36, 800, 28));
      const dT = K.xuongDong(tieuDe, nw - 28, coT, 800);
      const nh = 36 + dT.length * coT * 1.12 + (phuDe ? 34 : 0) + 14;
      B.cn(giayG, nx, H * 0.15, nw, nh, { to: m.giay, net: muc, day: 2.5, bo: 6 });
      dT.forEach((d, i) => K.chu(tieuDeG, d, { x: nx + nw / 2, y: H * 0.15 + 22 + coT * 0.92 + i * coT * 1.12, co: coT, dam: 800, mau: muc, neo: 'middle' }));
      if (phuDe) K.chu(tieuDeG, phuDe, { x: nx + nw / 2, y: H * 0.15 + 22 + dT.length * coT * 1.12 + 26, co: 22, dam: 600, mau: mucPhu, neo: 'middle' });
      mocTieuDe = [X(nx + nw / 2), Y(H * 0.15 + nh / 2)];
      // hoa văn ép nhũ dưới nhãn
      const hv = K.svg('g', { opacity: 0.5 }, giayG);
      for (let i = 0; i < 2; i++) B.vach(hv, [[W * 0.32, H * (0.66 + i * 0.07)], [W * 0.72, H * (0.66 + i * 0.07)]], { mau: K.tron(bia, '#FFFFFF', 0.55), day: 4 });
      yCon = H * 0.15 + nh + 30;
      // nội dung (nếu có) nằm trên tấm giấy dán dưới nhãn
      if (dongND.some((l) => l)) {
        const caoTam = tongND + 30;
        B.cn(giayG, nx - 10, yCon, nw + 20, caoTam, { to: m.giay, net: muc, day: 2, bo: 4 });
        yCon += 18;
      }
    } else {
      // tờ giấy
      const boGoc = loai === 'chung_chi_tien_gui' ? 8 : 3;
      if (loai === 'hop_dong_tin_dung' || loai === 'khe_uoc') {
        // góc gấp trên phải
        B.da(giayG, [[0, 0], [W - 34, 0], [W, 34], [W, H], [0, H]], { to: giay, net: muc, day: 2.5 });
        B.da(giayG, [[W - 34, 0], [W - 34, 34], [W, 34]], { to: K.tron(giay, muc, 0.12), net: muc, day: 2 });
      } else B.cn(giayG, 0, 0, W, H, { to: giay, net: loai === 'chung_chi_tien_gui' ? m.nhan : muc, day: loai === 'chung_chi_tien_gui' ? 9 : 2.5, bo: boGoc });

      if (loai === 'hop_dong_tin_dung') {
        // ghim kẹp và quốc hiệu giả lập bằng hai vạch
        const ghim = K.svg('g', { transform: 'translate(30 26) rotate(-28)' }, giayG);
        B.cn(ghim, -23, -6, 46, 12, { to: K.tron(m.nen_phu, '#FFFFFF', 0.3), net: muc, day: 1.8, bo: 3 });
        B.vach(giayG, [[W / 2 - 120, 44], [W / 2 + 120, 44]], { mau: muc, day: 7, mo: 0.55 });
        B.vach(giayG, [[W / 2 - 80, 64], [W / 2 + 80, 64]], { mau: muc, day: 6, mo: 0.3 });
      } else if (loai === 'khe_uoc') {
        B.cn(giayG, 18, 18, W - 70, 48, { to: K.tron(giay, m.nhan, 0.18), net: null, bo: 4 });
        B.vach(giayG, [[36, 42], [180, 42]], { mau: muc, day: 7, mo: 0.45 });
        B.vach(giayG, [[W - 200, 42], [W - 72, 42]], { mau: muc, day: 7, mo: 0.3 });
      } else if (loai === 'chung_chi_tien_gui') {
        B.cn(giayG, 16, 16, W - 32, H - 32, { to: 'none', net: m.nhan, day: 2.5, bo: 4, dut: '3 6' });
        const hoaVan = (x, y, s) => { const gg = K.svg('g', { transform: `translate(${x} ${y})` }, giayG); [s * 0.42, s * 0.28, s * 0.14].forEach((r) => B.tron(gg, s / 2, s / 2, r, { to: 'none', net: m.nhan, day: 2.5 })); B.vach(gg, [[s / 2, s * 0.06], [s / 2, s * 0.94]], { mau: m.nhan, day: 1.5 }); B.vach(gg, [[s * 0.06, s / 2], [s * 0.94, s / 2]], { mau: m.nhan, day: 1.5 }); };
        const s = 56;
        hoaVan(26, 26, s); hoaVan(W - 26 - s, 26, s); hoaVan(26, H - 26 - s, s); hoaVan(W - 26 - s, H - 26 - s, s);
        // dải sóng hoa văn
        const song = K.svg('g', { opacity: 0.8 }, giayG);
        for (let i = 0; i < 3; i++) {
          let d = '';
          for (let x = 0; x <= W - 220; x += 8) d += (x ? ' L' : 'M') + (110 + x) + ' ' + (52 + Math.sin(x / 13 + i * 1.7) * 11).toFixed(1);
          K.svg('path', { d, fill: 'none', stroke: m.nhan, 'stroke-width': 1.6 }, song);
        }
      } else if (loai === 'giay_chung_nhan_nha_dat') {
        B.cn(giayG, 14, 14, W - 28, H - 28, { to: 'none', net: m.xau, day: 3, bo: 2 });
        B.cn(giayG, 22, 22, W - 44, H - 44, { to: 'none', net: m.xau, day: 1.2, bo: 2 });
        const song = K.svg('g', { opacity: 0.7 }, giayG);
        for (let i = 0; i < 2; i++) {
          let d = '';
          for (let x = 0; x <= W - 120; x += 8) d += (x ? ' L' : 'M') + (60 + x) + ' ' + (50 + Math.sin(x / 11 + i * 2.1) * 9).toFixed(1);
          K.svg('path', { d, fill: 'none', stroke: m.xau, 'stroke-width': 1.5 }, song);
        }
      }

      // tiêu đề và phụ đề
      const cx = W / 2;
      dongTieuDe.forEach((d, i) => K.chu(tieuDeG, d, { x: cx, y: yCon + coTieuDe * 0.9 + i * coTieuDe * 1.12, co: coTieuDe, dam: 800, mau: loai === 'chung_chi_tien_gui' && K.tuongPhan(m.nhan, giay) >= 4.5 ? m.nhan : muc, neo: 'middle', gian: loai === 'chung_chi_tien_gui' ? 2 : null }));
      mocTieuDe = [X(cx), Y(yCon + coTieuDe * 0.6)];
      yCon += dongTieuDe.length * coTieuDe * 1.12;
      if (dongPhuDe.length) {
        yCon += 6;
        dongPhuDe.forEach((d, i) => K.chu(tieuDeG, d, { x: cx, y: yCon + 22 + i * 28, co: 22, dam: 500, mau: mucPhu, neo: 'middle' }));
        yCon += dongPhuDe.length * 28 + 4;
      }
      yCon += 26;
      // sơ đồ thửa đất
      if (loai === 'giay_chung_nhan_nha_dat') {
        const sx = pad + 10, sw = rongND - 20, sh = 150;
        B.cn(giayG, sx, yCon, sw, sh, { to: K.tron(giay, '#FFFFFF', 0.5), net: muc, day: 1.6, bo: 2 });
        const thua = [[sx + sw * 0.22, yCon + sh * 0.2], [sx + sw * 0.7, yCon + sh * 0.12], [sx + sw * 0.8, yCon + sh * 0.82], [sx + sw * 0.28, yCon + sh * 0.88]];
        B.da(giayG, thua, { to: K.rgba(m.tot, 0.25), net: m.tot, day: 3, gach: tay ? [m.tot, 0.5] : null });
        const dt = opt.dien_tich != null ? opt.dien_tich : '80 m²';
        if (dt) { const e = K.chu(tieuDeG, dt, { x: sx + sw * 0.5, y: yCon + sh * 0.5 + 10, co: 28, dam: 700, mau: muc, neo: 'middle' }); e.setAttribute('stroke', giay); e.setAttribute('stroke-width', 7); e.setAttribute('stroke-linejoin', 'round'); e.setAttribute('paint-order', 'stroke'); }
        yCon += sh + 22;
      }
    }

    giayG.appendChild(tieuDeG);   // chữ tiêu đề nằm trên mọi mảng trang trí

    // ---------- dòng nội dung ----------
    const nhomDong = K.svg('g', null, giayG);
    const dsHang = [], mocDong = [];
    let mocToSang = null;
    const xND = loai === 'so_tiet_kiem' ? W * 0.17 + 4 : pad, rND = loai === 'so_tiet_kiem' ? W * 0.7 - 8 : rongND;
    dsDong.forEach((d, i) => {
      const cao = caoDong[i], y0 = yCon;
      const hang = K.svg('g', null, nhomDong);
      const idc = `kho-gt-c${++demId}`;
      const cp = K.svg('clipPath', { id: idc }, B.defs);
      const cr = K.svg('rect', { x: xND - 8, y: y0 - 6, width: 0, height: cao + 4 }, cp);
      const trong = K.svg('g', { 'clip-path': `url(#${idc})` }, hang);
      let rongThat;
      if (dongND[i]) {
        const ls = dongND[i];
        rongThat = Math.max(...ls.map((l) => K.doChu(l, 28, 600)));
        // vệt bút dạ (dưới chữ)
        if (toSang.has(i)) {
          const vt = K.svg('g', null, hang);
          hang.insertBefore(vt, trong);
          const vr = tay ? B.cn(vt, xND - 8, y0 - 2, rongThat + 16, cao - 6, { to: K.rgba(mauToSang, 0.38), net: null, gach: [mauToSang, 0.5] })
            : K.svg('rect', { x: xND - 8, y: y0 - 2, width: rongThat + 16, height: cao - 6, rx: 4, fill: K.rgba(mauToSang, 0.36), transform: `skewX(-6)` }, vt);
          dsHang.vet = dsHang.vet || [];
          dsHang.vet.push({ i, el: vt, x: xND - 8 });
          mocToSang = [X(xND + rongThat + 12), Y(y0 + cao / 2 - 4)];
        }
        ls.forEach((l, j) => {
          const e = K.chu(trong, '', { x: xND, y: y0 + 27 + j * 36, co: 28, dam: 600, mau: muc });
          const hai = j === 0 ? l.indexOf(':') : -1;
          if (hai > 0) {
            const a = K.svg('tspan', { fill: mucPhu, 'font-weight': 500 }, e); a.textContent = l.slice(0, hai + 1);
            const b = K.svg('tspan', null, e); b.textContent = l.slice(hai + 1);
          } else e.textContent = l;
        });
      } else {
        rongThat = rND * (0.55 + ngDong(i) * 0.4);
        if (toSang.has(i)) {
          const vt = K.svg('g', null, hang); hang.insertBefore(vt, trong);
          if (tay) B.cn(vt, xND - 8, y0 - 1, rongThat + 16, 22, { to: K.rgba(mauToSang, 0.38), net: null, gach: [mauToSang, 0.5] });
          else K.svg('rect', { x: xND - 8, y: y0 - 1, width: rongThat + 16, height: 22, rx: 4, fill: K.rgba(mauToSang, 0.4) }, vt);
          dsHang.vet = dsHang.vet || []; dsHang.vet.push({ i, el: vt, x: xND - 8 });
          mocToSang = [X(xND + rongThat + 12), Y(y0 + 10)];
        }
        if (tay) B.vach(trong, [[xND, y0 + 10], [xND + rongThat, y0 + 10]], { mau: muc, day: 3.5, mo: 0.6 });
        else K.svg('rect', { x: xND, y: y0 + 5, width: rongThat, height: 10, rx: 5, fill: muc, opacity: 0.22 }, trong);
      }
      dsHang.push({ cr, rong: rongThat + 20, hang });
      mocDong.push([X(xND), Y(y0 + 14)]);
      yCon += cao;
    });

    // ---------- chữ ký ----------
    const nhomKy = K.svg('g', null, giayG), dsKy = [];
    if (ben.length) {
      const yK = H - caoKy - 28;
      const x0 = loai === 'chung_chi_tien_gui' || loai === 'giay_chung_nhan_nha_dat' ? W / 2 : pad, x1 = W - pad;
      const rongO = (x1 - x0) / ben.length;
      ben.forEach((b, i) => {
        const cx = x0 + rongO * (i + 0.5);
        const o = K.svg('g', null, nhomKy);
        const nhanBen = b && b.nhan ? b.nhan : '';
        if (nhanBen) {
          const coN = Math.max(22, Math.min(22, K.coVua(nhanBen, rongO - 12, 22, 700, 22)));
          K.xuongDong(nhanBen, rongO - 12, coN, 700).slice(0, 2).forEach((l, j) => K.chu(o, l, { x: cx, y: yK + 22 + j * 26, co: coN, dam: 700, mau: muc, neo: 'middle' }));
        }
        const ky = K.svg('path', { d: duongChuKy(hat0 + 100 + i * 17, Math.min(150, rongO - 30)), transform: `translate(${cx} ${yK + 90})`, fill: 'none', stroke: mauKy, 'stroke-width': tay ? 3 : 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1 }, nhomKy);
        ky.style.strokeDasharray = '1 1';
        const ten = b && b.ten ? b.ten : '';
        const tenEl = ten ? K.chu(o, ten, { x: cx, y: yK + 148, co: 22, dam: 600, mau: mucPhu, neo: 'middle' }) : null;
        dsKy.push({ ky, tenEl });
        kyViTri.push([X(cx), Y(yK + 90)]);
      });
    }

    // ---------- con dấu ----------
    let dau = null, nhomDau = null;
    if (chuDau) {
      const rongChu = K.doChu(chuDau, 18, 700) + 24;
      const rChu = Math.max(44, rongChu / (Math.PI * 1.5 * 0.85));   // chữ chạy trên cung 270° phía trên
      const R = rChu + 20;
      const viTri = kyViTri.length ? [kyViTri[0][0] + W / 2 - 42, kyViTri[0][1] + H / 2 + 10] : [W - pad - R, yCon + R + 10];
      if (loai === 'so_tiet_kiem' && !kyViTri.length) { viTri[0] = W * 0.7; viTri[1] = Math.min(H - R - 16, yCon + R); }
      nhomDau = K.svg('g', { transform: `translate(${viTri[0].toFixed(1)} ${viTri[1].toFixed(1)})`, 'data-chong': '' }, giayG);
      dau = K.svg('g', null, nhomDau);
      const trongDau = K.svg('g', { transform: 'rotate(-14)', opacity: tay ? 0.85 : 0.88 }, dau);
      B.tron(trongDau, 0, 0, R, { to: tay ? K.rgba(mauDau, 0.06) : 'none', net: mauDau, day: 4.5 });
      B.tron(trongDau, 0, 0, rChu - 9, { to: 'none', net: mauDau, day: 1.8 });
      // sao giữa
      const sao = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, r = i % 2 ? (rChu - 9) * 0.24 : (rChu - 9) * 0.6; sao.push([r * Math.cos(a), r * Math.sin(a)]); }
      B.da(trongDau, sao, { to: mauDau, net: tay ? mauDau : null, day: 1.5 });
      const idp = `kho-gt-p${++demId}`;
      const ca = rChu * Math.cos(0.75 * Math.PI), sa = rChu * Math.sin(0.75 * Math.PI);
      K.svg('path', { id: idp, d: `M${ca.toFixed(2)} ${sa.toFixed(2)} A${rChu} ${rChu} 0 1 1 ${(-ca).toFixed(2)} ${sa.toFixed(2)}`, fill: 'none' }, B.defs);
      const tx = K.svg('text', { 'font-family': K.PHONG, 'font-size': 18, 'font-weight': 700, fill: mauDau, 'text-anchor': 'middle', 'letter-spacing': 1 }, trongDau);
      const tp = K.svg('textPath', { href: `#${idp}`, startOffset: '50%' }, tx);
      tp.textContent = chuDau;
      // hai chấm hai bên chân dấu
      K.svg('circle', { cx: 0, cy: rChu * 0.98, r: 3.5, fill: mauDau }, trongDau);
      mocDau = [X(viTri[0]), Y(viTri[1])];
    }

    // ---------- lịch chuyển động ----------
    const tinh = opt.tinh || (opt.vao != null && opt.vao < 0), vao = opt.vao > 0 ? opt.vao : 0;
    const rel = (x) => (x == null ? null : x - vao);         // mốc người gọi tính từ lúc hình xuất hiện
    const tHien = dsHang.map((_, i) => (opt.moc_hien && opt.moc_hien[i] != null ? rel(opt.moc_hien[i]) : 0.75 + i * 0.16));
    const hetDong = dsHang.length ? Math.max(...tHien) + 0.4 : 0.7;
    const tToSang = opt.moc_to_sang != null ? rel(opt.moc_to_sang) : hetDong + 0.2;
    const tKy = opt.moc_ky != null ? rel(opt.moc_ky) : (toSang.size ? tToSang + 0.6 : hetDong + 0.2);
    const tDau = opt.moc_dau != null ? rel(opt.moc_dau) : tKy + (dsKy.length ? 0.55 * dsKy.length + 0.45 : 0.2);
    const huong = { trai: [-1, 0], phai: [1, 0], duoi: [0, 1], tren: [0, -1] }[opt.truot] || null;

    return {
      el: g,
      seek(t) {
        const s = tinh ? 1e6 : t - vao;
        // tờ trượt vào
        const p = huong ? K.eo3(K.tienDo(s, 0, 0.6)) : K.eo3(K.tienDo(s, 0, 0.35));
        const dx = huong ? (1 - p) * huong[0] * 260 : 0, dy = huong ? (1 - p) * huong[1] * 220 : (1 - p) * 20;
        to.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)}) rotate(${((1 - p) * (huong && huong[0] < 0 ? -6 : 6)).toFixed(2)})`);
        to.style.opacity = K.cl(s / 0.18).toFixed(3);
        dsChong.forEach(({ el, k }) => {
          const pc = K.eo3(K.tienDo(s, -0.05 + (soChong - k) * 0.06, 0.55));
          el.setAttribute('transform', `translate(${(huong ? (1 - pc) * huong[0] * 240 : 0).toFixed(1)} ${(huong ? (1 - pc) * huong[1] * 200 : 0).toFixed(1)})`);
          el.style.opacity = K.cl((s + 0.05) / 0.2).toFixed(3);
        });
        // tiêu đề
        const pt = K.eo3(K.tienDo(s, 0.3, 0.4));
        tieuDeG.style.opacity = pt.toFixed(3);
        tieuDeG.setAttribute('transform', `translate(0 ${((1 - pt) * 8).toFixed(1)})`);
        // dòng mở dần từ trái
        dsHang.forEach((h, i) => { h.cr.setAttribute('width', (h.rong * K.eio(K.tienDo(s, tHien[i], 0.42))).toFixed(1)); });
        (dsHang.vet || []).forEach((v) => {
          const pv = K.eio(K.tienDo(s, tToSang, 0.45));
          v.el.setAttribute('transform', `translate(${v.x.toFixed(1)} 0) scale(${Math.max(0.0001, pv).toFixed(4)} 1) translate(${(-v.x).toFixed(1)} 0)`);
          v.el.style.opacity = pv > 0 ? 1 : 0;
        });
        // chữ ký
        dsKy.forEach((k, i) => {
          const pk = K.eio(K.tienDo(s, tKy + i * 0.55, 0.75));
          k.ky.style.strokeDashoffset = (1 - pk).toFixed(4);
          k.ky.style.visibility = pk <= 0 ? 'hidden' : 'visible';
          if (k.tenEl) k.tenEl.style.opacity = K.eo3(K.tienDo(s, tKy + i * 0.55 + 0.5, 0.3)).toFixed(3);
        });
        // con dấu: nện xuống, tờ nảy nhẹ
        if (dau) {
          const pd = K.tienDo(s, tDau, 0.2), e = K.eo3(pd);
          const tl = 1 + (1 - e) * 0.6;
          dau.setAttribute('transform', `scale(${tl.toFixed(4)})`);
          dau.style.opacity = (pd <= 0 ? 0 : K.cl(pd * 2.2)).toFixed(3);
          const tau = s - tDau - 0.2;
          const nay = tau > 0 && tau < 0.6 ? Math.sin(tau * 26) * Math.exp(-tau * 9) * 4 : 0;
          nhomNay.setAttribute('transform', `translate(0 ${nay.toFixed(2)})`);
        }
      },
      moc: {
        tam: [0, 0], tren: [0, (-H / 2) * co], duoi: [0, (H / 2) * co], trai: [(-W / 2) * co, 0], phai: [(W / 2) * co, 0],
        tieu_de: [mocTieuDe[0] * co, mocTieuDe[1] * co], dong: mocDong.map(([x, y]) => [x * co, y * co]),
        to_sang: mocToSang ? [mocToSang[0] * co, mocToSang[1] * co] : null, ky: kyViTri.map(([x, y]) => [x * co, y * co]),
        dau: mocDau ? [mocDau[0] * co, mocDau[1] * co] : null, rong: W * co, cao: H * co,
      },
    };
  };
  K.giay_to = K.hop_dong_giay_to;
})();
