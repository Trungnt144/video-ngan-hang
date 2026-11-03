// ngan_hang/chuoi_gia_tri.js — 1.1 — chuỗi giá trị doanh nghiệp: các khâu kinh doanh chạy ngang từ trái sang phải (mặc định Mua nguyên liệu → Sản xuất →
// Bán hàng → Nhận tiền), mỗi khâu một ô có hình nhỏ SVG, số thứ tự, tên, dòng phụ; mũi tên vẽ dần giữa các khâu (nhãn, hạt chạy tuỳ chọn);
// dưới mỗi khâu một cột thẻ nghiệp vụ (vẽ bằng KHO.the_nghiep_vu); dải "khoảng trống vốn" là dấu ngoặc ngang từ khâu này tới khâu kia, nhãn ở giữa,
// thẻ lấp khoảng trống bay vào; đường tiền dưới cùng (tiền ra ở khâu đầu, về ở khâu cuối); tô sáng một khâu làm mờ các khâu khác.
// Dùng cho: N204 nghiệp vụ cơ bản của cán bộ tín dụng doanh nghiệp, N201 khoảng trống vốn, N198 vay vốn lưu động, N203 doanh nghiệp bao bì, N196 nhà cung cấp → doanh nghiệp → khách hàng.
// Gọi: KHO.chuoi_gia_tri_doanh_nghiep({ kieu, tieu_de, dong_nho, khau, noi, khoang_trong, dong_tien, to, x, y, rong, day, y_tieu_de, vao, tinh, hat, mau });
//   bí danh KHO.chuoi_gia_tri.
//   kieu 'phang' (CL-09, CL-16) | 'net_tay' (CL-10) | 'toi_gian' (từ 1.1; CL-04, CL-15 giấy cắt, CL-05 nét mảnh với net.day 2); net, chu, so_thu_tu: xem mục 1.1 cuối khối; tieu_de: chữ tiêu đề 40 px ở (x, y_tieu_de, mặc định 44); dong_nho: nhãn nhỏ cạnh tiêu đề ("Ví dụ giả định");
//   khau: mảng 3–6 khâu { ten, phu, hinh, khoa_mau (mặc định 'nhan'), moc (giây hiện), the: [opt của KHO.the_nghiep_vu, dùng moc thay vao; moc_to, het_to, het giữ nguyên] };
//     hinh: 'nguyen_lieu' | 'san_xuat' (bánh răng quay theo t) | 'ban_hang' (xe tải, bánh xe quay) | 'nhan_tien' (xấp tiền, đồng xu rơi vào chồng xu) | 'kho_hang'
//       | 'xuat_khau' (tàu chở container nhấp nhô) | 'nha_cung_cap' | 'khach_hang' | tên một biểu tượng trong KHO.BIEU_TUONG_NGHIEP_VU (vẽ đĩa có biểu tượng);
//     bỏ trống khau → bốn khâu mặc định ở trên;
//   noi: mảng n−1 phần tử cho mũi tên giữa khâu i và i+1: null (mũi tên trơn) | false (không mũi tên) | chuỗi (nhãn) | { nhan, moc, dai, chay (hạt chạy),
//     hat: 'hang' (thùng nhỏ, mặc định) | 'tien' (đồng xu), khoa_mau (mặc định 'chu_phu') }; nhãn đặt trên hàng khâu, nối xuống mũi tên bằng nét chấm;
//   khoang_trong: { tu, den (chỉ số khâu), nhan, phu, moc, dai, khoa_mau (mặc định 'canh_bao'), ben: 'duoi' (mặc định, ngay dưới hàng khâu) | 'tren',
//     lap: { chu, phu, bieu_tuong, khoa_mau (mặc định 'tot'), moc } } — thẻ lấp bay vào giữa dấu ngoặc, dấu ngoặc đổi sang màu thẻ lấp;
//   dong_tien: { nhan, moc, dai, chieu: 'xuoi' (mặc định: ra ở khâu đầu, về ở khâu cuối) | 'nguoc' (thu ở khâu cuối, quay về khâu đầu),
//     nhan_ra, nhan_ve (nhãn nhỏ ở hai chân), khoa_mau (mặc định 'tot') } — chạy dưới cùng, hạt tiền chạy theo chiều;
//   to: [{ khau, moc, het }] tô sáng khâu (nhấc lên, viền màu nhan) và làm mờ khâu khác cùng cột thẻ của chúng;
//   x, y: góc trên trái khuôn (mặc định 80, 150; tiêu đề nằm trên y); rong: bề ngang (mặc định 1760); day: y đáy tối đa (mặc định 950, chừa phụ đề);
//   vao: giây bắt đầu; tinh: true hiện đủ ngay (bánh răng, hạt vẫn chạy theo t); hat: hạt giống nét tay.
// Bố cục tính bằng số: khâu chia đều bề ngang, khoảng cách theo số khâu; cỡ thẻ cố định để chữ ≥ 28 px (bản 1.0 thu co khi cột dài, 1.1 bỏ);
//   cột hẹp dưới 270 px thì thẻ bỏ đĩa biểu tượng.
// Trả về { el, seek(t), moc: { khau: [{ x, y, w, h, tam, tren, duoi }], the: [[moc từng thẻ]], noi: [{ dau, cuoi, giua } | null], khoang_trong: { trai, phai, giua } | null,
//   lap: moc thẻ lấp | null, dong_tien: { dau, cuoi, giua } | null, co_the, xong } } — toạ độ sân khấu 1920×1080.
// el là HTML phủ cả sân khấu (hợp đồng mục 7): ô khâu, nhãn là HTML có data-hop; hình nhỏ, mũi tên, dấu ngoặc, hạt là SVG. Không đo DOM để dàn trang.
// Dựng mới (03/11/2026, rà lô N196–N205). Không tên, logo doanh nghiệp hay ngân hàng thật; chữ là tham số.
// 1.1 (03/11/2026, bản "ít chữ"; lời gọi 1.0 vẫn chạy, chữ truyền vào vẫn hiện):
//   ĐỔI MẶC ĐỊNH: bốn khâu mặc định không còn tên (chỉ hiện tên khi truyền ten); số thứ tự trên ô khâu mặc định tắt (so_thu_tu: true để bật);
//     tiêu đề, dòng nhỏ, nhãn chỉ hiện khi truyền chữ. Mọi chữ tự vẽ ≥ 28 px: dòng phụ khâu, nhãn mũi tên, dòng phụ khoảng trống, nhãn đường tiền, dòng nhỏ,
//     số thứ tự lên 28 px; thẻ nghiệp vụ dùng co ≥ 1,08 (chữ chính 28 px), ≥ 1,4 khi có thẻ có dòng phụ (dòng phụ 28 px); không thu co dưới mức đó nữa
//     (co_the: số lớn hơn để phóng thêm). Mỗi khâu chừa chỗ cho 1–2 thẻ ở cỡ đó; cột dài hơn chỗ còn lại thì báo console.warn.
//   THÊM: kieu 'toi_gian' (khối phẳng màu từ bộ màu, không bóng đổ, không dải sáng, không chi tiết, không chữ trên vật; thùng, nhà xưởng, xe, xấp tiền là khối đơn giản;
//     không bánh răng, không vân gỗ); net: { day (mặc định 0 = không viền), mau (khoá màu, mặc định 'chu') } — viền cho hình, ô khâu, nhãn ở kiểu toi_gian;
//     chu: false tắt mọi chữ (chỉ còn hình; thẻ thành ô có đĩa biểu tượng); tắt từng nhãn bằng false: khau[i].ten, khau[i].phu, noi[i].nhan,
//     khoang_trong.nhan, khoang_trong.phu, khoang_trong.lap.chu, the[j].chu, dong_tien.nhan, nhan_ra, nhan_ve, tieu_de, dong_nho.
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
    const nG = Math.max(3, Math.round(r / 7)), goc = (cx, cy, a0) => { for (let i = 0; i < nG; i++) { const a = a0 + (Math.PI / 2) * i / nG; d.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    canh(x + r, y, x + w - r, y); goc(x + w - r, y + r, -Math.PI / 2);
    canh(x + w, y + r, x + w, y + h - r); goc(x + w - r, y + h - r, 0);
    canh(x + w - r, y + h, x + r, y + h); goc(x + r, y + h - r, Math.PI / 2);
    canh(x, y + h - r, x, y + r); goc(x + r, y + r, Math.PI);
    return d;
  }
  // chiều dài đường gấp khúc (tính bằng số, không đo DOM)
  const daiDuong = (pts) => { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; };
  // điểm ở phần f (0..1) của đường gấp khúc, kèm góc
  function diemTren(pts, f) {
    const L = daiDuong(pts); let con = K.cl(f) * L;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (con <= l || i === pts.length - 1) { const u = l ? K.cl(con / l) : 0; return { x: a[0] + (b[0] - a[0]) * u, y: a[1] + (b[1] - a[1]) * u, goc: Math.atan2(b[1] - a[1], b[0] - a[0]) }; }
      con -= l;
    }
    return { x: pts[0][0], y: pts[0][1], goc: 0 };
  }
  // vẽ dần với chiều dài đã tính trước
  function veDanL(p, L, q) { p.style.visibility = q <= 0.001 ? 'hidden' : 'visible'; p.style.strokeDasharray = `${L.toFixed(1)} ${L.toFixed(1)}`; p.style.strokeDashoffset = (L * (1 - K.cl(q))).toFixed(2); }
  // đường gấp khúc có bo góc (kiểu phẳng)
  function duongBo(pts, r) {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
      const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1), rr = Math.min(r, l1 / 2, l2 / 2);
      const a = [x1 - (x1 - x0) / l1 * rr, y1 - (y1 - y0) / l1 * rr], b = [x1 + (x2 - x1) / l2 * rr, y1 + (y2 - y1) / l2 * rr];
      d += ` L${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${x1.toFixed(1)} ${y1.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    }
    const z = pts[pts.length - 1];
    return d + ` L${z[0].toFixed(1)} ${z[1].toFixed(1)}`;
  }
  // chia đoạn thẳng thành nhiều điểm để nét tay run đều
  function chiaDiem(pts, buoc) {
    const ra = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / buoc));
      for (let k = 1; k <= n; k++) ra.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]);
    }
    return ra;
  }
  function banhRang(R, r, n) {
    const pts = [], w1 = (Math.PI / n) * 0.62, w2 = (Math.PI / n) * 0.36;
    for (let k = 0; k < n; k++) {
      const a = (k / n) * Math.PI * 2;
      pts.push([r, a - w1], [R, a - w2], [R, a + w2], [r, a + w1]);
    }
    return 'M' + pts.map(([rr, a]) => `${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)}`).join(' L') + ' Z';
  }

  // ---------- hình nhỏ của từng khâu (ô 170 × 104 quanh gốc, mặt đất ở y = 46) ----------
  const HINH = ['nguyen_lieu', 'san_xuat', 'ban_hang', 'nhan_tien', 'kho_hang', 'xuat_khau', 'nha_cung_cap', 'khach_hang'];
  function boVe(m, tay) {
    const fl = (c) => (tay ? K.tron(c, m.giay, m.toi ? 0.18 : 0.42) : c);
    const nt = (c) => (tay ? m.chu : K.tron(c, '#000000', 0.32));
    const sw = tay ? 2.6 : 2;
    const S = {
      fl, nt, sw,
      r: (g, x, y, w, h, c, rx) => K.svg('rect', { x, y, width: w, height: h, rx: rx != null ? rx : 3, fill: fl(c), stroke: nt(c), 'stroke-width': sw, 'stroke-linejoin': 'round' }, g),
      p: (g, d, c) => K.svg('path', { d, fill: fl(c), stroke: nt(c), 'stroke-width': sw, 'stroke-linejoin': 'round' }, g),
      c: (g, cx, cy, r, c) => K.svg('circle', { cx, cy, r, fill: fl(c), stroke: nt(c), 'stroke-width': sw }, g),
      e: (g, cx, cy, rx, ry, c) => K.svg('ellipse', { cx, cy, rx, ry, fill: fl(c), stroke: nt(c), 'stroke-width': sw }, g),
      l: (g, d, c, day) => K.svg('path', { d, fill: 'none', stroke: nt(c), 'stroke-width': day || sw * 0.85, 'stroke-linecap': 'round' }, g),
      bong: (g, rx) => K.svg('ellipse', { cx: 0, cy: 48, rx, ry: 6, fill: K.rgba(m.chu, m.toi ? 0.22 : 0.09) }, g),
    };
    return S;
  }
  function veHinh(g, hinh, m, tay) {
    const S = boVe(m, tay);
    const go = K.tron(m.canh_bao, m.the, 0.12), go2 = K.tron(m.canh_bao, m.the, 0.3);
    const thung = (x, y, w, h, c) => { S.r(g, x, y, w, h, c, 3); S.l(g, `M${x} ${y + h / 3} H${x + w} M${x} ${y + 2 * h / 3} H${x + w} M${x + 6} ${y} V${y + h} M${x + w - 6} ${y} V${y + h}`, c, 1.6); };
    if (hinh === 'nguyen_lieu') {
      S.bong(g, 82);
      thung(-74, -4, 68, 50, go);
      thung(-64, -42, 48, 38, go2);
      const bao = K.tron(m.nhan_phu, m.the, 0.25);
      S.p(g, 'M14 46 Q0 46 3 28 Q6 2 22 -12 L17 -22 Q36 -30 55 -22 L50 -12 Q66 2 69 28 Q72 46 58 46 Z', bao);
      S.l(g, 'M20 -13 Q36 -8 52 -13', bao, 3);
      S.l(g, 'M24 14 Q36 18 48 14', bao, 1.6);
      return null;
    }
    if (hinh === 'san_xuat') {
      S.bong(g, 90);
      const tuong = K.tron(m.nhan, m.the, 0.45);
      S.r(g, 10, -50, 13, 44, K.tron(m.chu_phu, m.the, 0.25), 2);
      S.r(g, -86, -8, 110, 54, tuong, 2);
      S.p(g, 'M-86 -8 L-86 -32 L-58 -8 L-58 -32 L-30 -8 L-30 -32 L-2 -8 L-2 -32 L24 -8 Z', m.nhan);
      [-76, -54, -32].forEach((x) => S.r(g, x, 6, 16, 14, K.tron(m.giay, m.nhan, 0.2), 2));
      S.r(g, -6, 18, 22, 28, K.tron(tuong, '#000000', 0.35), 2);
      const g1 = K.svg('g', null, g), g2 = K.svg('g', null, g);
      S.p(g1, banhRang(28, 21, 9), m.canh_bao); S.c(g1, 0, 0, 8, m.the);
      S.p(g2, banhRang(17, 12, 6), m.nhan_phu); S.c(g2, 0, 0, 5, m.the);
      return (tt) => {
        const a = tt * 40;
        g1.setAttribute('transform', `translate(42 20) rotate(${a.toFixed(2)})`);
        g2.setAttribute('transform', `translate(68 -10) rotate(${(-a * 9 / 6 + 30).toFixed(2)})`);
      };
    }
    if (hinh === 'ban_hang') {
      S.bong(g, 92);
      S.l(g, 'M-100 -20 H-88 M-104 -2 H-90 M-100 16 H-88', m.chu_phu, 3);
      const thung2 = K.tron(m.nhan_phu, m.the, 0.2);
      S.r(g, -82, -38, 100, 62, thung2, 4);
      thung(-50, -22, 34, 30, go);
      S.p(g, 'M20 24 V-18 H50 L74 4 V24 Z', m.nhan);
      S.p(g, 'M27 -11 H47 L62 3 H27 Z', K.tron(m.giay, m.nhan, 0.2));
      S.r(g, -86, 22, 164, 8, K.tron(m.chu_phu, m.the, 0.2), 2);
      const banh = K.tron(m.chu_phu, m.nen, 0.3), b = [];
      [-52, 46].forEach((x) => { const gb = K.svg('g', null, g); S.c(gb, 0, 0, 14, banh); S.c(gb, 0, 0, 5, m.the); S.l(gb, 'M0 -10 V10 M-10 0 H10', m.the, 2); b.push([gb, x]); });
      return (tt) => { b.forEach(([gb, x]) => gb.setAttribute('transform', `translate(${x} 34) rotate(${(tt * 120).toFixed(1)})`)); };
    }
    if (hinh === 'nhan_tien') {
      S.bong(g, 86);
      const giay = m.tot;
      [[-82, 24], [-78, 10], [-74, -4]].forEach(([x, y]) => {
        S.r(g, x, y, 92, 22, giay, 3);
        S.l(g, `M${x + 8} ${y + 5} H${x + 84} V${y + 17} H${x + 8} Z`, K.tron(giay, m.the, 0.4), 1.4);
        S.c(g, x + 46, y + 11, 6, K.tron(giay, m.the, 0.45));
      });
      const xu = m.canh_bao;
      for (let j = 0; j < 5; j++) S.e(g, 46, 40 - j * 8, 24, 7, xu);
      const gx = K.svg('g', null, g);
      S.c(gx, 0, 0, 13, xu); S.c(gx, 0, 0, 7, K.tron(xu, m.the, 0.35));
      return (tt) => {
        const f = ((tt / 1.5) % 1 + 1) % 1;
        const yDen = 40 - 4 * 8 - 14;
        const y = f < 0.6 ? K.lerp(-62, yDen, K.ei3(f / 0.6)) : yDen;
        const sx = Math.max(0.25, Math.abs(Math.cos(f * 9)));
        const a = tt <= 0 ? 0 : f < 0.1 ? f / 0.1 : f < 0.62 ? 1 : 1 - K.cl((f - 0.62) / 0.12);
        gx.setAttribute('transform', `translate(46 ${y.toFixed(1)}) scale(${sx.toFixed(3)} 1)`);
        gx.setAttribute('opacity', a.toFixed(3));
      };
    }
    if (hinh === 'kho_hang') {
      S.bong(g, 92);
      const tuong = K.tron(m.nhan_phu, m.the, 0.45);
      S.r(g, -74, -12, 148, 58, tuong, 2);
      S.p(g, 'M-86 -10 L0 -48 L86 -10 Z', m.nhan_phu);
      S.c(g, 0, -26, 7, K.tron(m.giay, m.nhan, 0.2));
      S.r(g, -40, 0, 80, 46, K.tron(tuong, '#000000', 0.42), 2);
      thung(-34, 22, 32, 24, go); thung(2, 22, 32, 24, go2); thung(-16, 0, 32, 22, go2);
      return null;
    }
    if (hinh === 'xuat_khau') {
      const nuoc = K.svg('g', null, g);
      S.l(nuoc, 'M-92 44 q11 -6 23 0 t23 0 t23 0 t23 0 t23 0 t23 0 t23 0 t23 0', m.nhan, 2.6);
      S.l(nuoc, 'M-70 52 q11 -5 22 0 t22 0 t22 0 t22 0 t22 0 t22 0', K.tron(m.nhan, m.the, 0.4), 2);
      const tau = K.svg('g', null, g);
      const mauCont = [m.canh_bao, m.tot, m.nhan_phu, m.xau];
      [-72, -42, -12, 18].forEach((x, i) => { S.r(tau, x, -16, 28, 24, mauCont[i], 2); S.l(tau, `M${x + 9} -14 V6 M${x + 19} -14 V6`, mauCont[i], 1.4); });
      [-58, -28].forEach((x, i) => { S.r(tau, x, -40, 28, 24, mauCont[(i + 1) % 4], 2); S.l(tau, `M${x + 9} -38 V-18 M${x + 19} -38 V-18`, mauCont[(i + 1) % 4], 1.4); });
      S.r(tau, 52, -42, 22, 50, K.tron(m.giay, m.nhan, 0.15), 2);
      S.r(tau, 56, -36, 14, 8, m.nhan, 1);
      S.p(tau, 'M-84 8 H86 L68 38 H-70 Z', m.nhan);
      S.l(tau, 'M-78 18 H80', m.the, 3);
      return (tt) => {
        const b = Math.sin(tt * 1.8) * 2.5, q = Math.sin(tt * 1.8 + 0.7) * 1.2;
        tau.setAttribute('transform', `translate(0 ${b.toFixed(2)}) rotate(${q.toFixed(2)})`);
        nuoc.setAttribute('transform', `translate(${(((tt * 14) % 23) - 11.5).toFixed(2)} 0)`);
      };
    }
    if (hinh === 'nha_cung_cap') {
      S.bong(g, 90);
      const tuong = K.tron(m.tot, m.the, 0.5);
      S.r(g, -82, -10, 94, 56, tuong, 2);
      S.p(g, 'M-90 -8 L-35 -46 L20 -8 Z', m.tot);
      S.r(g, -48, 14, 24, 32, K.tron(tuong, '#000000', 0.4), 2);
      S.r(g, -74, 4, 18, 16, K.tron(m.giay, m.nhan, 0.2), 2);
      S.r(g, -14, 4, 18, 16, K.tron(m.giay, m.nhan, 0.2), 2);
      thung(20, 18, 32, 28, go); thung(54, 18, 32, 28, go2); thung(37, -10, 32, 28, go);
      return null;
    }
    if (hinh === 'khach_hang') {
      S.bong(g, 86);
      S.p(g, 'M-6 46 Q-6 0 22 0 Q50 0 50 46 Z', m.nhan_phu);
      S.c(g, 22, -20, 14, m.da);
      S.p(g, 'M-60 46 Q-60 6 -30 6 Q0 6 0 46 Z', m.nhan);
      S.c(g, -30, -16, 16, m.da);
      S.r(g, 50, 14, 30, 32, m.canh_bao, 3);
      S.l(g, 'M57 14 Q65 -2 73 14', m.canh_bao, 3);
      return null;
    }
    // biểu tượng của thẻ nghiệp vụ trên đĩa
    S.c(g, 0, 0, 44, m.nhan);
    const ic = K.bieu_tuong_nghiep_vu(hinh, { co: 1.25, mau_net: tay ? m.chu : K.chuTren(m.nhan, '#FFFFFF', '#141414'), day: 3.4 });
    g.appendChild(ic);
    return null;
  }

  // Kiểu toi_gian: khối phẳng, màu thẳng từ bộ màu, viền theo net (mặc định không viền), không chi tiết trang trí.
  function veHinhToiGian(g, hinh, m, net) {
    const nv = net.day > 0 ? { stroke: m[net.mau] || m.chu, 'stroke-width': net.day, 'stroke-linejoin': 'round' } : {};
    const r = (cha, x, y, w, h, c, rx) => K.svg('rect', Object.assign({ x, y, width: w, height: h, rx: rx != null ? rx : 3, fill: c }, nv), cha);
    const p = (cha, d, c) => K.svg('path', Object.assign({ d, fill: c }, nv), cha);
    const c = (cha, cx, cy, rr, mau) => K.svg('circle', Object.assign({ cx, cy, r: rr, fill: mau }, nv), cha);
    if (hinh === 'nguyen_lieu') {
      r(g, -74, -4, 68, 50, m.canh_bao); r(g, -64, -42, 48, 36, m.canh_bao);
      p(g, 'M14 46 Q0 46 3 28 Q6 2 22 -12 L17 -22 Q36 -30 55 -22 L50 -12 Q66 2 69 28 Q72 46 58 46 Z', m.nhan_phu);
      return null;
    }
    if (hinh === 'san_xuat') {
      r(g, 22, -50, 16, 46, m.chu_phu, 2);
      r(g, -80, -8, 140, 54, m.nhan, 2);
      p(g, 'M-80 -8 L-80 -34 L-45 -8 L-45 -34 L-10 -8 L-10 -34 L25 -8 L25 -34 L60 -8 Z', K.tron(m.nhan, m.chu, 0.35));
      return null;
    }
    if (hinh === 'ban_hang') {
      r(g, -82, -38, 100, 64, m.nhan_phu, 4);
      p(g, 'M22 26 V-18 H50 L74 4 V26 Z', m.nhan);
      c(g, -50, 32, 14, m.chu); c(g, 46, 32, 14, m.chu);
      return null;
    }
    if (hinh === 'nhan_tien') {
      [[-82, 24], [-76, 4], [-70, -16]].forEach(([x, y], i) => r(g, x, y, 96, 18, i % 2 ? K.tron(m.tot, m.the, 0.3) : m.tot, 3));
      const gx = K.svg('g', null, g);
      c(gx, 0, 0, 16, m.canh_bao);
      return (tt) => {
        const f = ((tt / 1.6) % 1 + 1) % 1, y = f < 0.6 ? K.lerp(-60, 30, K.ei3(f / 0.6)) : 30;
        const a = tt <= 0 ? 0 : f < 0.1 ? f / 0.1 : f < 0.62 ? 1 : 1 - K.cl((f - 0.62) / 0.14);
        gx.setAttribute('transform', `translate(52 ${y.toFixed(1)})`); gx.setAttribute('opacity', a.toFixed(3));
      };
    }
    if (hinh === 'kho_hang') {
      r(g, -74, -12, 148, 58, K.tron(m.nhan_phu, m.the, 0.4), 2);
      p(g, 'M-86 -10 L0 -48 L86 -10 Z', m.nhan_phu);
      r(g, -36, 4, 72, 42, m.chu_phu, 2);
      return null;
    }
    if (hinh === 'xuat_khau') {
      const tau = K.svg('g', null, g);
      [m.canh_bao, m.tot, m.xau].forEach((mau, i) => r(tau, -66 + i * 38, -18, 34, 26, mau, 2));
      r(tau, 52, -40, 22, 48, m.chu_phu, 2);
      p(tau, 'M-84 8 H86 L68 40 H-70 Z', m.nhan);
      return (tt) => tau.setAttribute('transform', `translate(0 ${(Math.sin(tt * 1.8) * 2.5).toFixed(2)})`);
    }
    if (hinh === 'nha_cung_cap') {
      r(g, -82, -10, 94, 56, K.tron(m.tot, m.the, 0.4), 2);
      p(g, 'M-90 -8 L-35 -46 L20 -8 Z', m.tot);
      r(g, 22, 16, 30, 30, m.canh_bao); r(g, 56, 16, 30, 30, m.canh_bao); r(g, 39, -16, 30, 30, m.canh_bao);
      return null;
    }
    if (hinh === 'khach_hang') {
      p(g, 'M-6 46 Q-6 0 22 0 Q50 0 50 46 Z', m.nhan_phu); c(g, 22, -20, 15, m.da);
      p(g, 'M-60 46 Q-60 6 -30 6 Q0 6 0 46 Z', m.nhan); c(g, -30, -16, 17, m.da);
      return null;
    }
    c(g, 0, 0, 44, m.nhan);
    g.appendChild(K.bieu_tuong_nghiep_vu(hinh, { co: 1.25, mau_net: K.chuTren(m.nhan, '#FFFFFF', '#141414'), day: 3.4 }));
    return null;
  }

  // 1.1: bốn khâu mặc định chỉ có hình, không tên
  const MAC_DINH = [{ hinh: 'nguyen_lieu' }, { hinh: 'san_xuat' }, { hinh: 'ban_hang' }, { hinh: 'nhan_tien' }];

  K.chuoi_gia_tri_doanh_nghiep = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu || 'phang', tay = kieu === 'net_tay', toi = kieu === 'toi_gian';
    const net = Object.assign({ day: 0, mau: 'chu' }, opt.net || {}), mauNet = m[net.mau] || m.chu;
    const coChu = opt.chu !== false;
    const chu = (v) => (coChu && v !== false && v != null && v !== '' ? String(v) : null);  // chữ hiện hay không
    const kieuThe = toi ? 'phang' : kieu;   // thẻ nghiệp vụ không có kiểu toi_gian: dùng phang rồi bỏ bóng đổ
    const vienToi = toi && net.day > 0 ? `border:${net.day}px solid ${mauNet};` : '';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 80, Y = opt.y != null ? opt.y : 150, W = opt.rong || 1760, DAY = opt.day != null ? opt.day : 950;
    const hat0 = opt.hat || 61;
    const nenThe = tay ? K.tron(m.the, m.giay, m.toi ? 0.12 : 0.5) : m.the, nenKhau = toi ? m.nen_phu : nenThe;
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6);
    const mauChuK = duTuongPhan(m.chu, nenKhau, 7), mauPhuK = duTuongPhan(m.chu_phu, nenKhau, 4.6);
    const mauChuNen = duTuongPhan(m.chu, m.nen, 7), mauPhuNen = duTuongPhan(m.chu_phu, m.nen, 4.6);
    const mauKhoa = (k, md) => m[k || md] || m[md];

    const khau = (opt.khau && opt.khau.length ? opt.khau : MAC_DINH).map((k) => Object.assign({}, k));
    const n = khau.length;
    const gap = n > 1 ? K.cl(Math.round(W * 0.3 / n), 56, 140) : 0;
    const wK = (W - gap * (n - 1)) / n;
    khau.forEach((k, i) => { k.x = X + i * (wK + gap); k.cx = k.x + wK / 2; });

    // ----- phần tử gốc và các lớp -----
    const el = K.html('div', { class: 'kho-chuoi-gia-tri', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;font-family:${K.PHONG};pointer-events:none;` });
    const svgDuoi = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const lop = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);
    const svgTren = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const lopThe = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);
    const locTay = tay ? K.locNetTay(svgTren, { hat: (hat0 % 9) + 1, do_run: 1.3 }) : null;

    // ----- tiêu đề -----
    let tieuDe = null, dongNho = null;
    const yTD = opt.y_tieu_de != null ? opt.y_tieu_de : 44;
    const tdChu = chu(opt.tieu_de), dnChu = chu(opt.dong_nho);
    if (tdChu) {
      tieuDe = K.html('div', { style: `position:absolute;left:${X}px;top:${yTD}px;font-weight:800;font-size:40px;line-height:52px;white-space:nowrap;color:${mauChuNen};` }, lop, tdChu);
    }
    if (dnChu) {
      const xN = X + (tdChu ? K.doChu(tdChu, 40, 800) + 28 : 0);
      const wN = Math.ceil(K.doChu(dnChu, 28, 600)) + 40;
      dongNho = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${xN.toFixed(1)}px;top:${yTD + 4}px;width:${wN}px;height:44px;box-sizing:border-box;border-radius:22px;` +
        `border:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu_phu, 0.6)};text-align:center;font-weight:600;font-size:28px;line-height:40px;white-space:nowrap;color:${mauPhuNen};` }, lop, dnChu);
    }

    // ----- nhãn mũi tên (đo trước để biết dải trên hàng khâu) -----
    const noiVao = opt.noi || [];
    const noi = [];
    for (let i = 0; i < n - 1; i++) {
      let o = noiVao[i];
      if (o === false) { noi.push(null); continue; }
      if (typeof o === 'string') o = { nhan: o };
      o = Object.assign({}, o || {});
      o.loai_hat = o.hat === 'tien' ? 'tien' : 'hang';
      o.nhan = chu(o.nhan);
      if (o.nhan) {
        o.dong = K.xuongDong(o.nhan, wK + gap - 52, 28, 700);
        o.cw = Math.ceil(Math.max(...o.dong.map((s) => K.doChu(s, 28, 700)))) + 32;
        o.ch = o.dong.length * 36 + 14;
      }
      noi.push(o);
    }
    const dayNhanNoi = noi.some((o) => o && o.nhan) ? Math.max(...noi.map((o) => (o && o.nhan ? o.ch : 0))) + 16 : 0;

    // ----- khoảng trống vốn: đo trước -----
    let kt = null;
    if (opt.khoang_trong) {
      kt = Object.assign({}, opt.khoang_trong);
      kt.tu = K.cl(kt.tu != null ? kt.tu : 0, 0, n - 1); kt.den = K.cl(kt.den != null ? kt.den : n - 1, kt.tu, n - 1);
      kt.ben = kt.ben === 'tren' ? 'tren' : 'duoi';
      kt.x1 = khau[kt.tu].x + 22; kt.x2 = khau[kt.den].x + wK - 22; kt.xm = (kt.x1 + kt.x2) / 2;
      const span = kt.x2 - kt.x1;
      kt.mc = mauKhoa(kt.khoa_mau, 'canh_bao');
      const rongToiDa = Math.min(760, span - 40);
      const nN = chu(kt.nhan), nP = chu(kt.phu);
      kt.dongN = nN ? K.xuongDong(nN, rongToiDa - 44, 32, 800) : [];
      kt.dongP = nP ? K.xuongDong(nP, rongToiDa - 44, 28, 600) : [];
      kt.coChip = kt.dongN.length + kt.dongP.length > 0;
      kt.cw = kt.coChip ? Math.ceil(Math.max(0, ...kt.dongN.map((s) => K.doChu(s, 32, 800)), ...kt.dongP.map((s) => K.doChu(s, 28, 600)))) + 48 : 0;
      kt.ch = kt.coChip ? kt.dongN.length * 40 + kt.dongP.length * 34 + 22 : 0;
      if (kt.lap) {
        kt.lap = Object.assign({ khoa_mau: 'tot' }, kt.lap);
        const lc = chu(kt.lap.chu), lp = lc ? chu(kt.lap.phu) : null;
        kt.lapOpt = { chu: lc || '', phu: lp || undefined, bieu_tuong: kt.lap.bieu_tuong || 'vay', co: lp ? 1.4 : 1.08, rong_chu: kt.lap.rong_chu || 300 };
        const d = K.the_nghiep_vu.do(kt.lapOpt);
        kt.lw = d.w; kt.lh = d.h;
        kt.canh = kt.coChip && kt.cw + 28 + kt.lw <= span - 20;
        kt.khoiH = !kt.coChip ? kt.lh : kt.canh ? Math.max(kt.ch, kt.lh) : kt.ch + 16 + kt.lh;
      } else kt.khoiH = kt.ch;
    }

    // ----- dàn dọc -----
    let yc = Y;
    if (kt && kt.ben === 'tren') {
      kt.khoiY = yc; kt.yL = yc + kt.khoiH + 22; kt.yT = kt.yL + 24; yc = kt.yT + 12;
    }
    const yNhanNoi = yc; yc += dayNhanNoi;
    const padT = 16, artH = 104, coT = 30, coP = 28, lhT = 38, lhP = 34;
    khau.forEach((k) => { const tn = chu(k.ten), tp = chu(k.phu); k.dongT = tn ? K.xuongDong(tn, wK - 32, coT, 800) : []; k.dongP = tp ? K.xuongDong(tp, wK - 32, coP, 600) : []; });
    const soT = Math.max(...khau.map((k) => k.dongT.length)), soP = Math.max(...khau.map((k) => k.dongP.length));
    const hK = padT + artH + (soT + soP ? 10 + soT * lhT + (soP ? soP * lhP + 2 : 0) : 0) + 16;
    const soThuTu = coChu && opt.so_thu_tu === true;
    const yK = yc; yc += hK;
    const yArrow = yK + padT + artH / 2;
    const sArt = Math.min(1, (wK - 100) / 170);
    if (kt && kt.ben === 'duoi') {
      kt.yT = yc + 14; kt.yL = kt.yT + 24; kt.khoiY = kt.yL + 22; yc = kt.khoiY + kt.khoiH + 8;
    }
    const yThe = yc + 24;
    const dt = opt.dong_tien ? Object.assign({ chieu: 'xuoi' }, opt.dong_tien) : null;
    let yDt = DAY - 24; const gioiHanThe = dt ? yDt - 58 : DAY;

    // ----- thời điểm -----
    khau.forEach((k, i) => { k.t0 = tinh ? -100 : (k.moc != null ? k.moc : vao + 0.3 + i * 0.45); });
    const tKhauCuoi = tinh ? -100 : Math.max(...khau.map((k) => k.t0));
    noi.forEach((o, i) => { if (o) { o.t0 = tinh ? -100 : (o.moc != null ? o.moc : Math.max(khau[i].t0, khau[i + 1].t0) + 0.3); o.dai = o.dai || 0.5; } });

    // ----- cột thẻ: thu co để vừa -----
    const rongCot = Math.min(wK, 420), coBT = rongCot >= 270;
    const dsThe = khau.map((k) => (k.the || []).map((o) => Object.assign({}, o)));
    dsThe.forEach((c) => c.forEach((o) => { o.chu = chu(o.chu) || ''; o.phu = o.chu ? chu(o.phu) || undefined : undefined; }));
    const coPhu = dsThe.some((c) => c.some((o) => o.phu));
    // 1.1: chữ thẻ ≥ 28 px — chữ chính 26 × co, dòng phụ 20 × co
    const coThe = Math.max(coPhu ? 1.4 : 1.08, opt.co_the || 0);
    const chuanBi = (o, co) => {
      const bt = coBT || !o.chu ? (o.bieu_tuong != null ? o.bieu_tuong : 'vay') : false;
      const coDinh = bt === false ? 40 * co + 4 : 104 * co + 4;
      return { chu: o.chu, phu: o.phu, bieu_tuong: bt, co, rong_chu: Math.max(60, (rongCot - coDinh) / co) };
    };
    const caoCot = (co) => Math.max(0, ...dsThe.map((c) => c.reduce((s, o) => s + K.the_nghiep_vu.do(chuanBi(o, co)).h, 0) + Math.max(0, c.length - 1) * 14 * co));
    // 1.1: đường tiền nằm ngay dưới cột thẻ dài nhất (không dồn xuống đáy khi ít thẻ)
    if (dt) yDt = Math.min(DAY - 24, (dsThe.some((c) => c.length) ? yThe + caoCot(coThe) : yThe - 24) + 82);
    if (yThe + caoCot(coThe) > gioiHanThe && typeof console !== 'undefined') console.warn(`chuoi_gia_tri: cột thẻ vượt đáy ${gioiHanThe} px ở co ${coThe}; bớt thẻ hoặc bớt dòng phụ`);

    // ----- ô khâu -----
    const r = 22;
    khau.forEach((k, i) => {
      const mc = mauKhoa(k.khoa_mau, 'nhan');
      k.mc = mc;
      k.div = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${k.x.toFixed(1)}px;top:${yK}px;width:${wK.toFixed(1)}px;height:${hK}px;box-sizing:border-box;border-radius:${r}px;transform-origin:50% 50%;` +
        (tay ? '' : toi ? `background:${nenKhau};${vienToi}` : `background:${nenThe};border:3px solid ${K.rgba(mc, 0.5)};box-shadow:0 10px 26px ${K.rgba('#000000', m.toi ? 0.35 : 0.1)};`) }, lop);
      if (!tay && !toi) K.html('div', { style: `position:absolute;left:22px;right:22px;top:0;height:7px;border-radius:0 0 6px 6px;background:${mc};` }, k.div);
      const nenSo = tay ? K.tron(mc, m.giay, m.toi ? 0.1 : 0.45) : mc;
      if (soThuTu) K.html('div', { 'data-hop': '1', style: `position:absolute;left:12px;top:14px;width:48px;height:48px;border-radius:24px;box-sizing:border-box;text-align:center;` +
        `font-weight:800;font-size:28px;line-height:${tay ? 44 : 48}px;color:${K.chuTren(nenSo, '#FFFFFF', '#141414')};background:${nenSo};${tay ? `border:2px solid ${m.chu};` : ''}` }, k.div, String(i + 1));
      const khoi = K.html('div', { style: `position:absolute;left:12px;right:12px;top:${padT + artH + 10}px;text-align:center;` }, k.div);
      k.dongT.forEach((s) => K.html('div', { style: `font-weight:800;font-size:${coT}px;line-height:${lhT}px;color:${mauChuK};white-space:nowrap;` }, khoi, s));
      k.dongP.forEach((s, j) => K.html('div', { style: `margin-top:${j ? 0 : 2}px;font-weight:600;font-size:${coP}px;line-height:${lhP}px;color:${mauPhuK};white-space:nowrap;` }, khoi, s));
      // thân ô kiểu nét tay
      k.gThan = K.svg('g', null, svgDuoi);
      if (tay) {
        K.svg('path', { d: K.duongTay(diemHop(k.x + 7, yK + 9, wK, hK, r, 90), { hat: hat0 + i * 13, lech: 2.2, dong: true }) + 'Z', fill: K.rgba(m.chu, m.toi ? 0.2 : 0.08) }, k.gThan);
        K.svg('path', { d: K.duongTay(diemHop(k.x, yK, wK, hK, r, 90), { hat: hat0 + i * 13 + 1, lech: 1.8, dong: true }) + 'Z', fill: nenThe }, k.gThan);
        k.vienTay = K.svg('path', { d: K.duongTay(diemHop(k.x, yK, wK, hK, r, 70), { hat: hat0 + i * 13 + 2, lech: 1.6, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.8, 'stroke-linecap': 'round' }, k.gThan);
        K.svg('path', { d: K.duongTay(diemHop(k.x + 2, yK + 1.5, wK - 3, hK - 2, r, 70), { hat: hat0 + i * 13 + 3, lech: 1.8, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 1.3, opacity: 0.5, 'stroke-linecap': 'round' }, k.gThan);
        K.svg('path', { d: K.duongTay([[k.x + 64, yK + 12], [k.cx, yK + 14], [k.x + wK - 24, yK + 11]], { hat: hat0 + i * 13 + 4, lech: 1.2 }), fill: 'none', stroke: mc, 'stroke-width': 6, 'stroke-linecap': 'round' }, k.gThan);
      }
      // hình nhỏ
      k.gArt = K.svg('g', { filter: locTay }, svgTren);
      const gTrong = K.svg('g', null, k.gArt);
      k.artSeek = toi ? veHinhToiGian(gTrong, k.hinh || 'nguyen_lieu', m, net) : veHinh(gTrong, k.hinh || 'nguyen_lieu', m, tay);
      k.ax = k.cx; k.ay = yK + padT + artH / 2;
      k.by = yK + hK / 2;
    });

    // ----- mũi tên giữa các khâu -----
    const gNoi = K.svg('g', null, svgTren), gHat = K.svg('g', null, svgTren);
    noi.forEach((o, i) => {
      if (!o) return;
      const a = [khau[i].x + wK + 10, yArrow], b = [khau[i + 1].x - 12, yArrow];
      o.a = a; o.b = b; o.pts = [a, b]; o.L = daiDuong(o.pts) * 1.08 + 6;
      o.mc = mauKhoa(o.khoa_mau, 'chu_phu');
      const mcNet = tay ? m.chu : o.mc;
      o.g = K.svg('g', null, gNoi);
      o.ve = K.svg('path', { d: tay ? K.duongTay(chiaDiem(o.pts, 30), { hat: hat0 + 200 + i, lech: 1.2 }) : `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`, fill: 'none', stroke: mcNet, 'stroke-width': 5, 'stroke-linecap': 'round' }, o.g);
      o.mui = K.svg('path', { d: 'M0 0 L-20 -12 L-15 0 L-20 12 Z', fill: tay ? K.tron(o.mc, m.giay, 0.3) : o.mc, stroke: tay ? m.chu : 'none', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, o.g);
      o.hat = [];
      if (o.chay) {
        for (let k = 0; k < 2; k++) {
          const gh = K.svg('g', null, gHat);
          if (toi) K.svg(o.loai_hat === 'tien' ? 'circle' : 'rect', o.loai_hat === 'tien' ? { r: 11, fill: m.canh_bao } : { x: -9, y: -9, width: 18, height: 18, rx: 2, fill: m.canh_bao }, gh);
          else if (o.loai_hat === 'tien') { K.svg('circle', { r: 11, fill: m.canh_bao, stroke: K.tron(m.canh_bao, '#000000', 0.35), 'stroke-width': 2 }, gh); K.svg('circle', { r: 5, fill: K.tron(m.canh_bao, m.the, 0.4) }, gh); }
          else { K.svg('rect', { x: -9, y: -9, width: 18, height: 18, rx: 2, fill: K.tron(m.canh_bao, m.the, 0.12), stroke: tay ? m.chu : K.tron(m.canh_bao, '#000000', 0.35), 'stroke-width': 2 }, gh); K.svg('path', { d: 'M-9 0 H9', stroke: K.tron(m.canh_bao, '#000000', 0.35), 'stroke-width': 1.5 }, gh); }
          o.hat.push(gh);
        }
      }
      if (o.nhan) {
        const xm = (a[0] + b[0]) / 2, yB = yNhanNoi + dayNhanNoi - 12;
        o.nhanEl = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${(xm - o.cw / 2).toFixed(1)}px;top:${(yB - o.ch).toFixed(1)}px;width:${o.cw}px;height:${o.ch}px;box-sizing:border-box;` +
          `border-radius:12px;text-align:center;padding-top:7px;transform-origin:50% 100%;` +
          (tay ? `background:${K.rgba(nenThe, 0.95)};border:2px dashed ${K.rgba(m.chu, 0.7)};` : toi ? `background:${nenThe};${vienToi}` : `background:${nenThe};border:2px solid ${K.rgba(o.mc, 0.55)};box-shadow:0 6px 14px ${K.rgba('#000000', m.toi ? 0.3 : 0.08)};`) }, lop);
        o.dong.forEach((s) => K.html('div', { style: `font-weight:700;font-size:28px;line-height:36px;color:${mauChu};white-space:nowrap;` }, o.nhanEl, s));
        o.chi = K.svg('path', { d: `M${xm} ${yB + 4} L${xm} ${yArrow - 12}`, fill: 'none', stroke: K.rgba(m.chu, 0.45), 'stroke-width': 2.4, 'stroke-dasharray': '2 7', 'stroke-linecap': 'round' }, o.g);
      }
    });

    // ----- cột thẻ -----
    // gọi KHO.the_nghiep_vu; kiểu toi_gian bỏ bóng đổ của thẻ sau mỗi lần seek
    function goiThe(o) {
      const h = K.the_nghiep_vu(o);
      if (!toi) return h;
      const s0 = h.seek;
      h.seek = (t) => { s0(t); h.el.style.boxShadow = 'none'; };
      return h;
    }
    const cot = khau.map((k, i) => {
      const wrap = K.html('div', { style: 'position:absolute;left:0;top:0;width:0;height:0;' }, lopThe);
      const gCot = K.svg('g', null, svgDuoi);
      let y = yThe;
      const x = k.cx - rongCot / 2;
      const the = dsThe[i].map((o, j) => {
        const cb = chuanBi(o, coThe);
        const vaoThe = tinh ? -1 : (o.moc != null ? o.moc : k.t0 + 0.9 + j * 0.3);
        // thẻ không chữ: ô vừa đĩa biểu tượng, đặt giữa cột
        const wRieng = o.chu ? 0 : K.the_nghiep_vu.do(cb).w;
        const h = goiThe(Object.assign({}, o, cb, { kieu: kieuThe, x: o.chu ? x : k.cx - wRieng / 2, y, neo: 'trai_tren', rong_deu: o.chu ? rongCot : 0, vao: vaoThe, tinh: tinh || o.tinh, hat: hat0 + 300 + i * 10 + j, mau: opt.mau }));
        wrap.appendChild(h.el);
        y += h.moc.h + 14 * coThe;
        h.t0 = tinh ? -100 : vaoThe;
        return h;
      });
      let guide = null;
      if (the.length) {
        guide = K.svg('path', { d: `M${k.cx} ${yK + hK + 6} L${k.cx} ${yThe - 6}`, fill: 'none', stroke: K.rgba(m.chu, m.toi ? 0.3 : 0.22), 'stroke-width': 2.4, 'stroke-dasharray': '2 8', 'stroke-linecap': 'round' }, gCot);
      }
      return { wrap, gCot, the, guide };
    });

    // ----- khoảng trống vốn -----
    let ktDraw = null;
    if (kt) {
      kt.t0 = tinh ? -100 : (kt.moc != null ? kt.moc : tKhauCuoi + 1.0);
      kt.dai = kt.dai || 0.9;
      const huong = Math.sign(kt.yT - kt.yL); // phía chân ngoặc (về phía hàng khâu)
      const yN = kt.yL - huong * 14;
      const nua = (xe, sgn) => [[kt.xm, yN], [kt.xm + sgn * 16, kt.yL], [xe, kt.yL], [xe, kt.yT]];
      const gK = K.svg('g', null, svgTren);
      kt.nua = [nua(kt.x1, -1), nua(kt.x2, 1)].map((pts, k) => {
        const d = tay ? K.duongTay(chiaDiem(pts, 40), { hat: hat0 + 400 + k, lech: 1.4 }) : duongBo(pts, 12);
        const p = K.svg('path', { d, fill: 'none', stroke: kt.mc, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, gK);
        let p2 = null;
        if (tay) p2 = K.svg('path', { d: K.duongTay(chiaDiem(pts, 40), { hat: hat0 + 410 + k, lech: 1.8 }), fill: 'none', stroke: kt.mc, 'stroke-width': 2, opacity: 0.55, 'stroke-linecap': 'round' }, gK);
        return { p, p2, L: daiDuong(pts) * 1.08 + 6 };
      });
      // nhãn
      kt.chip = kt.coChip ? K.html('div', { 'data-hop': '1', style: `position:absolute;left:0;top:0;width:${kt.cw}px;height:${kt.ch}px;box-sizing:border-box;border-radius:16px;text-align:center;padding-top:10px;` +
        (tay ? `background:${K.rgba(nenThe, 0.96)};border:3px dashed ${kt.mc};` : toi ? `background:${nenThe};border:3px solid ${kt.mc};` : `background:${nenThe};border:3px solid ${kt.mc};box-shadow:0 8px 20px ${K.rgba('#000000', m.toi ? 0.32 : 0.1)};`) }, lop) : null;
      kt.dongN.forEach((s) => K.html('div', { style: `font-weight:800;font-size:32px;line-height:40px;color:${mauChu};white-space:nowrap;` }, kt.chip, s));
      kt.dongP.forEach((s) => K.html('div', { style: `font-weight:600;font-size:28px;line-height:34px;color:${mauPhu};white-space:nowrap;` }, kt.chip, s));
      // vị trí chip và thẻ lấp
      const yGiua = kt.khoiY + kt.khoiH / 2;
      if (kt.lap) {
        kt.mLap = mauKhoa(kt.lap.khoa_mau, 'tot');
        kt.tLap = tinh ? -100 : (kt.lap.moc != null ? kt.lap.moc : kt.t0 + 1.6);
        let lx, ly;
        if (!kt.coChip) { kt.chipX1 = kt.xm; kt.chipY = yGiua; lx = kt.xm; ly = yGiua; }
        else if (kt.canh) {
          const tong = kt.cw + 28 + kt.lw;
          kt.chipX1 = kt.xm - tong / 2; kt.chipY = yGiua - kt.ch / 2;
          lx = kt.chipX1 + kt.cw + 28 + kt.lw / 2; ly = yGiua;
        } else {
          kt.chipX1 = kt.xm - kt.cw / 2;
          if (kt.ben === 'duoi') { kt.chipY = kt.khoiY; ly = kt.khoiY + kt.ch + 16 + kt.lh / 2; } else { ly = kt.khoiY + kt.lh / 2; kt.chipY = kt.khoiY + kt.lh + 16; }
          lx = kt.xm;
        }
        kt.chipX0 = kt.xm - kt.cw / 2;
        kt.lapBoc = K.html('div', { style: 'position:absolute;left:0;top:0;width:0;height:0;' }, lopThe);
        kt.lapThe = goiThe(Object.assign({}, kt.lap, kt.lapOpt, { kieu: kieuThe, x: lx, y: ly, neo: 'tam', vao: tinh ? -1 : kt.tLap, tinh, hat: hat0 + 450, mau: opt.mau }));
        kt.lapBoc.appendChild(kt.lapThe.el);
      } else {
        kt.chipX0 = kt.chipX1 = kt.xm - kt.cw / 2;
        kt.chipY = yGiua - kt.ch / 2;
      }
      ktDraw = gK;
    }

    // ----- đường tiền dưới cùng -----
    if (dt) {
      dt.t0 = tinh ? -100 : (dt.moc != null ? dt.moc : tKhauCuoi + 1.2);
      dt.dai = dt.dai || 1.2;
      dt.mc = mauKhoa(dt.khoa_mau, 'tot');
      const xF = khau[0].cx, xL = khau[n - 1].cx, yTop = yDt - 44;
      dt.pts = dt.chieu === 'nguoc' ? [[xL, yTop], [xL, yDt], [xF, yDt], [xF, yTop]] : [[xF, yTop], [xF, yDt], [xL, yDt], [xL, yTop]];
      dt.L = daiDuong(dt.pts) * 1.08 + 6;
      dt.g = K.svg('g', null, svgTren);
      dt.ve = K.svg('path', { d: tay ? K.duongTay(chiaDiem(dt.pts, 50), { hat: hat0 + 500, lech: 1.4 }) : duongBo(dt.pts, 18), fill: 'none', stroke: tay ? m.chu : dt.mc, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, dt.g);
      if (tay) dt.ve2 = K.svg('path', { d: K.duongTay(chiaDiem(dt.pts, 50), { hat: hat0 + 501, lech: 1.6 }), fill: 'none', stroke: dt.mc, 'stroke-width': 3, opacity: 0.8, 'stroke-linecap': 'round' }, dt.g);
      dt.mui = K.svg('path', { d: 'M0 0 L-20 -12 L-15 0 L-20 12 Z', fill: tay ? K.tron(dt.mc, m.giay, 0.3) : dt.mc, stroke: tay ? m.chu : 'none', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, dt.g);
      dt.hat = [];
      for (let k = 0; k < 3; k++) {
        const gh = K.svg('g', null, gHat);
        if (toi) K.svg('circle', { r: 12, fill: m.canh_bao }, gh);
        else {
          K.svg('circle', { r: 12, fill: tay ? K.tron(m.canh_bao, m.giay, 0.3) : m.canh_bao, stroke: tay ? m.chu : K.tron(m.canh_bao, '#000000', 0.35), 'stroke-width': 2 }, gh);
          K.svg('circle', { r: 5, fill: K.tron(m.canh_bao, m.the, 0.4) }, gh);
        }
        dt.hat.push(gh);
      }
      const chip = (chuNhan, cx, cy, canh) => {
        const w = Math.ceil(K.doChu(chuNhan, 28, 700)) + 36, h = 46;
        const x0 = canh === 'trai' ? cx - w : canh === 'phai' ? cx : cx - w / 2;
        const e = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x0.toFixed(1)}px;top:${(cy - h / 2).toFixed(1)}px;width:${w}px;height:${h}px;box-sizing:border-box;border-radius:20px;text-align:center;` +
          `font-weight:700;font-size:28px;line-height:${tay ? 40 : 42}px;white-space:nowrap;color:${mauChu};` +
          (tay ? `background:${K.rgba(nenThe, 0.96)};border:2px dashed ${K.rgba(m.chu, 0.7)};` : toi ? `background:${nenThe};${vienToi || `border:2px solid ${dt.mc};`}` : `background:${nenThe};border:2px solid ${K.rgba(dt.mc, 0.7)};`) }, lopThe, chuNhan);
        return e;
      };
      dt.chip = chu(dt.nhan) ? chip(chu(dt.nhan), (xF + xL) / 2, yDt, 'giua') : null;
      const xRa = dt.chieu === 'nguoc' ? xL : xF, xVe = dt.chieu === 'nguoc' ? xF : xL;
      const phiaRa = xRa < xVe ? 'trai' : 'phai', phiaVe = xVe > xRa ? 'phai' : 'trai';
      dt.chipRa = chu(dt.nhan_ra) ? chip(chu(dt.nhan_ra), xRa + (phiaRa === 'trai' ? -16 : 16), yDt - 16, phiaRa) : null;
      dt.chipVe = chu(dt.nhan_ve) ? chip(chu(dt.nhan_ve), xVe + (phiaVe === 'trai' ? -16 : 16), yDt - 16, phiaVe) : null;
    }

    // ----- tô sáng -----
    const dsTo = (opt.to || []).map((e) => Object.assign({}, e));
    const mucTo = (e, t) => (e.moc == null ? 1 : K.eo3(K.tienDo(t, e.moc, 0.4))) * (e.het != null ? 1 - K.eo3(K.tienDo(t, e.het, 0.4)) : 1);

    const tCuoi = [tKhauCuoi + 0.6];
    noi.forEach((o) => o && tCuoi.push(o.t0 + o.dai + 0.4));
    cot.forEach((c) => c.the.forEach((h) => tCuoi.push(h.moc.xong)));
    if (kt) { tCuoi.push(kt.t0 + kt.dai + 0.5); if (kt.lap) tCuoi.push(kt.tLap + 0.8); }
    if (dt) tCuoi.push(dt.t0 + dt.dai + 0.4);
    const xong = tinh ? 0 : Math.max(...tCuoi);

    function seek(t) {
      const aTD = tinh ? 1 : K.eo3(K.tienDo(t, vao, 0.4));
      if (tieuDe) { tieuDe.style.opacity = aTD.toFixed(3); tieuDe.style.transform = `translateY(${((1 - aTD) * 14).toFixed(2)}px)`; }
      if (dongNho) dongNho.style.opacity = (tinh ? 1 : K.eo3(K.tienDo(t, vao + 0.25, 0.4))).toFixed(3);
      // mức tô và mờ từng khâu
      const sang = khau.map(() => 0), mo = khau.map(() => 0);
      dsTo.forEach((e) => { const v = mucTo(e, t); khau.forEach((_, i) => { if (i === e.khau) sang[i] = Math.max(sang[i], v); else mo[i] = Math.max(mo[i], v); }); });
      khau.forEach((k, i) => {
        const tt = t - k.t0;
        const a = K.eo3(K.tienDo(tt, 0, 0.35)), sc0 = 0.86 + 0.14 * K.spr(tt, 0.5, 0.65), dy0 = (1 - K.eo3(K.tienDo(tt, 0, 0.45))) * 24;
        const s = sang[i], dim = 1 - 0.62 * mo[i] * (1 - s);
        const sc = sc0 * (1 + 0.035 * s), dy = dy0 - 10 * s;
        k.div.style.opacity = (a * dim).toFixed(3);
        k.div.style.transform = `translate(0px, ${dy.toFixed(2)}px) scale(${sc.toFixed(4)})`;
        if (toi) {
          k.div.style.boxShadow = s > 0.001 ? `0 0 0 ${(5 * s).toFixed(1)}px ${m.nhan}` : 'none';
        } else if (!tay) {
          k.div.style.borderColor = K.tron(K.tron(nenThe, k.mc, 0.5), m.nhan, s);
          k.div.style.borderWidth = (3 + 2.5 * s).toFixed(2) + 'px';
          k.div.style.boxShadow = `0 ${(10 + 12 * s).toFixed(1)}px ${(26 + 16 * s).toFixed(1)}px ${K.rgba(s > 0.01 ? m.nhan : '#000000', m.toi ? 0.35 : 0.1 + 0.2 * s)}`;
        } else {
          k.vienTay.setAttribute('stroke', K.tron(m.chu, m.nhan, s));
          k.vienTay.setAttribute('stroke-width', (2.8 + 3 * s).toFixed(2));
        }
        k.gThan.setAttribute('opacity', (a * dim).toFixed(3));
        k.gThan.setAttribute('transform', `translate(${k.cx.toFixed(1)} ${(k.by + dy).toFixed(2)}) scale(${sc.toFixed(4)}) translate(${(-k.cx).toFixed(1)} ${(-k.by).toFixed(1)})`);
        const ax = k.cx + sc * (k.ax - k.cx), ay = k.by + sc * (k.ay - k.by) + dy;
        k.gArt.setAttribute('opacity', (a * dim).toFixed(3));
        k.gArt.setAttribute('transform', `translate(${ax.toFixed(2)} ${ay.toFixed(2)}) scale(${(sc * sArt).toFixed(4)})`);
        if (k.artSeek) k.artSeek(Math.max(0, tt));
        // cột thẻ
        const c = cot[i];
        c.wrap.style.opacity = dim.toFixed(3);
        c.the.forEach((h) => h.seek(t));
        if (c.guide) c.guide.setAttribute('opacity', (K.eo3(K.tienDo(t, c.the[0].t0 - 0.2, 0.4)) * dim).toFixed(3));
      });
      const moChung = 1 - 0.4 * Math.max(0, ...mo.map((v, i) => v * (1 - sang[i])));
      noi.forEach((o, i) => {
        if (!o) return;
        const p = K.eio(K.tienDo(t, o.t0, o.dai));
        o.g.setAttribute('opacity', moChung.toFixed(3));
        veDanL(o.ve, o.L, p);
        const tip = diemTren(o.pts, p);
        o.mui.setAttribute('transform', `translate(${tip.x.toFixed(1)} ${tip.y.toFixed(1)}) rotate(${(tip.goc * 180 / Math.PI).toFixed(2)})`);
        o.mui.setAttribute('opacity', p > 0.02 ? 1 : 0);
        const tChay = t - (o.t0 + o.dai);
        o.hat.forEach((gh, k) => {
          if (tChay <= 0) { gh.setAttribute('opacity', 0); return; }
          const f = ((tChay / 1.6 + k / o.hat.length) % 1 + 1) % 1, q = diemTren(o.pts, 0.08 + f * 0.7);
          gh.setAttribute('transform', `translate(${q.x.toFixed(1)} ${(q.y - 22).toFixed(1)})`);
          gh.setAttribute('opacity', (Math.min(1, Math.sin(Math.PI * f) * 1.6) * K.cl(tChay / 0.4) * moChung).toFixed(3));
        });
        if (o.nhanEl) {
          const an = K.eo3(K.tienDo(t, o.t0 + o.dai * 0.5, 0.35));
          o.nhanEl.style.opacity = (an * moChung).toFixed(3);
          o.nhanEl.style.transform = `scale(${(0.9 + 0.1 * K.spr(t - o.t0 - o.dai * 0.5, 0.45, 0.7)).toFixed(4)})`;
          o.chi.setAttribute('opacity', an.toFixed(3));
        }
      });
      if (kt) {
        const p = K.eio(K.tienDo(t, kt.t0, kt.dai));
        const pLap = kt.lap ? K.eio(K.tienDo(t, kt.tLap, 0.5)) : 0;
        const mauNgoac = kt.lap ? K.tron(kt.mc, kt.mLap, pLap) : kt.mc;
        kt.nua.forEach((h) => { veDanL(h.p, h.L, p); h.p.setAttribute('stroke', mauNgoac); if (h.p2) { veDanL(h.p2, h.L, p); h.p2.setAttribute('stroke', mauNgoac); } });
        const aChip = K.eo3(K.tienDo(t, kt.t0 + kt.dai * 0.5, 0.4));
        const xChip = K.lerp(kt.chipX0, kt.chipX1, kt.lap && kt.canh ? K.eio(K.tienDo(t, kt.tLap - 0.15, 0.5)) : (kt.lap ? 1 : 0));
        const yChip = kt.chipY;
        if (kt.chip) {
          kt.chip.style.left = xChip.toFixed(1) + 'px';
          kt.chip.style.top = yChip.toFixed(1) + 'px';
          kt.chip.style.opacity = aChip.toFixed(3);
          kt.chip.style.transform = `scale(${(0.9 + 0.1 * K.spr(t - kt.t0 - kt.dai * 0.5, 0.45, 0.7)).toFixed(4)})`;
        }
        if (kt.lap) {
          kt.lapThe.seek(t);
          const bay = tinh ? 1 : K.eob(K.tienDo(t, kt.tLap, 0.7), 1.2);
          kt.lapBoc.style.transform = `translate(0px, ${((1 - bay) * (kt.ben === 'tren' ? -90 : 90)).toFixed(2)}px)`;
        }
      }
      if (dt) {
        const p = K.eio(K.tienDo(t, dt.t0, dt.dai));
        veDanL(dt.ve, dt.L, p); if (dt.ve2) veDanL(dt.ve2, dt.L, p);
        const tip = diemTren(dt.pts, p);
        dt.mui.setAttribute('transform', `translate(${tip.x.toFixed(1)} ${tip.y.toFixed(1)}) rotate(${(tip.goc * 180 / Math.PI).toFixed(2)})`);
        dt.mui.setAttribute('opacity', p > 0.02 ? 1 : 0);
        const tChay = t - (dt.t0 + dt.dai);
        dt.hat.forEach((gh, k) => {
          if (tChay <= 0) { gh.setAttribute('opacity', 0); return; }
          const f = ((tChay / 3.2 + k / dt.hat.length) % 1 + 1) % 1, q = diemTren(dt.pts, 0.04 + f * 0.88);
          gh.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
          gh.setAttribute('opacity', (Math.min(1, Math.sin(Math.PI * f) * 2) * K.cl(tChay / 0.4)).toFixed(3));
        });
        const aC = K.eo3(K.tienDo(t, dt.t0 + dt.dai * 0.6, 0.4));
        [dt.chip, dt.chipRa, dt.chipVe].forEach((e) => { if (e) e.style.opacity = aC.toFixed(3); });
      }
    }

    const mocKhau = khau.map((k) => ({ x: k.x, y: yK, w: wK, h: hK, tam: [k.cx, yK + hK / 2], tren: [k.cx, yK], duoi: [k.cx, yK + hK] }));
    return {
      el, seek,
      moc: {
        khau: mocKhau,
        the: cot.map((c) => c.the.map((h) => h.moc)),
        noi: noi.map((o) => (o ? { dau: o.a, cuoi: o.b, giua: [(o.a[0] + o.b[0]) / 2, yArrow] } : null)),
        khoang_trong: kt ? { trai: [kt.x1, kt.yT], phai: [kt.x2, kt.yT], giua: [kt.xm, kt.yL] } : null,
        lap: kt && kt.lap ? kt.lapThe.moc : null,
        dong_tien: dt ? { dau: dt.pts[0], cuoi: dt.pts[3], giua: [(dt.pts[1][0] + dt.pts[2][0]) / 2, yDt] } : null,
        co_the: coThe,
        xong,
      },
    };
  };
  K.chuoi_gia_tri = K.chuoi_gia_tri_doanh_nghiep;
  K.chuoi_gia_tri_doanh_nghiep.HINH = HINH;
})();
