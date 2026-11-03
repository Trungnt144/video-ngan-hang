// ngan_hang/khuon_nhom_an_danh.js — 1.0 — khuôn so sánh ba nhóm ngân hàng ẩn danh: số dạng khoảng (từ a tới b) theo nhóm ngân hàng nhà nước,
// nhóm cổ phần lớn, nhóm cổ phần vừa và nhỏ; không nêu tên ngân hàng nào (quy tắc của loạt video). Mỗi chỉ tiêu một dòng, mỗi nhóm một thanh khoảng
// (đoạn a–b đầu tròn trên ray nhạt) trên CÙNG một thang của dòng, nhãn "a–b%". Thanh mọc từ giữa ra hai đầu; tô sáng một nhóm làm mờ hai nhóm kia.
// Dùng cho: N197 cơ cấu thu nhập theo nhóm; N199 tỉ trọng nguồn vốn theo nhóm; N201 khoảng lãi suất tiền gửi, cho vay; N89, N103, N104, N111...
// Gọi: KHO.khuon_so_sanh_nhom_ngan_hang_an_danh(opt);  bí danh KHO.so_sanh_nhom_an_danh.
//   nhom: ba nhóm { ten, phu (dòng phụ), khoa_mau (khoá màu), toa_nha ('tru_so' | 'hoi_so' | 'chi_nhanh': loại toà nhà làm biểu tượng) };
//         mặc định 'Nhóm nhà nước', 'Nhóm cổ phần lớn', 'Nhóm cổ phần vừa và nhỏ'; luôn đúng ba nhóm (thiếu thì lấy mặc định, thừa thì bỏ).
//   chi_tieu: tối đa 6 dòng { ten, phu (dòng phụ; mặc định 'Thang a–b%' khi cần), don_vi (mặc định opt.don_vi hoặc '%'), thap_phan (mặc định theo số),
//         khoang: [ba phần tử theo nhóm: [a, b] | số (một giá trị) | { tu, den, chu (nhãn tự viết) } | null (hiện 'chưa có số')],
//         thang: [thấp, cao] (mặc định tự chọn từ 0 tới số tròn trên giá trị lớn nhất) };
//   bo_cuc 'cot' (mặc định: ba cột nhóm, các dòng xếp dọc, thanh nằm ngang trong ô) | 'chung_truc' (mỗi dòng một trục ngang chung, ba thanh ba màu
//         chồng theo hàng, chú giải màu nhóm ở đầu: thấy ngay nhóm nào cao hơn);
//   dong_nho (dòng nhỏ tên loạt, có vạch nhấn), tieu_de (chữ lớn), co_tieu_de (60); nguon (dòng nguồn ở chân); ghi_chu (chú thích cố định, mặc định
//         'Số dạng khoảng theo nhóm, không nêu tên ngân hàng'; '' để ẩn); bieu_tuong (toà nhà nhỏ đầu nhóm: mặc định có ở 'cot', không ở 'chung_truc');
//   rong_ten (bề ngang cột tên chỉ tiêu: 'cot' 330, 'chung_truc' theo tên dài nhất 300–460);
//   x, y, rong (vùng đặt, mặc định 140, 90, 1640), day (mép dưới, mặc định 940, không quá 960 để chừa phụ đề); kieu 'phang' | 'net_tay'; mau;
//   vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay); moc_cot (giây hiện đầu nhóm); moc_hien (mảng giây hiện từng dòng);
//   to_nhom: { chi_so, moc, het } hoặc mảng (tô sáng nhóm, hai nhóm kia mờ); to_dong: { chi_so, moc, het } hoặc mảng (tô sáng dòng, dòng khác mờ nhẹ).
// Nhiều dòng thì tự thu cỡ chữ, cỡ thanh (chữ không dưới 20 px). Bố cục tính bằng số (KHO.doChu, KHO.xuongDong), không đo DOM.
// Trả về { el, seek(t), moc: { tieu_de: hộp, nhom: [hộp đầu nhóm], dong: [hộp dòng], o: [[{ x, y, w, h, dau, cuoi, giua } theo dòng × nhóm]],
//   chan: hộp dòng nguồn, moc_cot, moc_hang: [giây], xong } } — toạ độ sân khấu 1920×1080; dau, cuoi là hai đầu thanh khoảng (null khi chưa có số).
// Phần tử el là HTML phủ sân khấu (hợp đồng mục 7): chữ là HTML có data-hop, thẻ, ray, thanh là SVG. Cần kho_nen, toa_nha_ngan_hang (khi bieu_tuong).
// Dựng mới 02/11/2026 (lượt rà lô N196–N205).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;

  // ---------- hàm nội bộ ----------
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
  function gachHop(x, y, w, h, buoc, hat) {
    let d = '';
    for (let c = buoc / 2, i = 0; c < w + h; c += buoc, i++) {
      d += K.duongTay([[x + Math.max(0, c - h), y + Math.min(h, c)], [x + Math.min(w, c), y + Math.max(0, c - w)]], { hat: hat + i, lech: 1.1 }) + ' ';
    }
    return d;
  }
  // Viền thẻ bút chì quanh hộp (x, y, w, h): bóng loang lệch, nền, hai lượt nét.
  function theTay(cha, x, y, w, h, r, m, nen, hat) {
    K.svg('path', { d: K.duongTay(diemHop(x + 9, y + 11, w, h, r, 140), { hat: hat + 3, lech: 3, dong: true }) + 'Z', fill: K.rgba(m.chu, 0.07) }, cha);
    K.svg('path', { d: K.duongTay(diemHop(x, y, w, h, r, 140), { hat, lech: 2.4, dong: true }) + 'Z', fill: nen }, cha);
    K.svg('path', { d: K.duongTay(diemHop(x, y, w, h, r, 120), { hat: hat + 1, lech: 1.8, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cha);
    K.svg('path', { d: K.duongTay(diemHop(x + 2, y - 2, w - 3, h + 2, r, 160), { hat: hat + 2, lech: 2.2, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 1.2, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }, cha);
  }
  // Đường ngang nét tay từ x0 tới x1 (chia đoạn ~60 px).
  function ngangTay(x0, x1, y, hat, lech) {
    const n = Math.max(2, Math.round(Math.abs(x1 - x0) / 60)), pts = [];
    for (let k = 0; k <= n; k++) pts.push([x0 + (x1 - x0) * k / n, y]);
    return K.duongTay(pts, { hat, lech: lech != null ? lech : 1 });
  }
  function tronTay(r, hat) {
    const pts = [];
    for (let k = 0; k < 14; k++) { const a = (k / 14) * Math.PI * 2; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
    return K.duongTay(pts, { hat, lech: Math.max(0.6, r * 0.08), dong: true }) + 'Z';
  }
  // Hiện dần một đường có chiều dài ước tính L (đường gần thẳng, không đo DOM).
  function hienDan(path, L, p) {
    path.style.strokeDasharray = `${L.toFixed(1)} ${L.toFixed(1)}`;
    path.style.strokeDashoffset = (L * (1 - K.cl(p))).toFixed(2);
  }
  function soLe(v) { const s = String(v); const i = s.indexOf('.'); return i < 0 || /e/i.test(s) ? 0 : Math.min(2, s.length - i - 1); }
  function buocTron(x) {
    if (!(x > 0)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(x))), f = x / p;
    return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * p;
  }
  function tronTren(x) { if (x <= 0) return 0; const b = buocTron(x / 4); return Math.ceil(x / b - 1e-9) * b; }
  function hienTu(s, t, t0, cao) {
    const a = K.eo3(K.tienDo(t, t0, 0.3)), y = Math.round((1 - K.eob(K.tienDo(t, t0, 0.4), 1.2)) * (cao || 18));
    s.style.opacity = a.toFixed(3); s.style.transform = `translateY(${y}px)`;
  }
  // Chuẩn hoá một khoảng: [a, b] | số | { tu, den, chu } | null.
  function chuanKhoang(k) {
    if (k == null) return null;
    if (typeof k === 'number') return isFinite(k) ? { a: k, b: k } : null;
    if (Array.isArray(k)) { if (k[0] == null || k[1] == null) return null; return { a: Math.min(k[0], k[1]), b: Math.max(k[0], k[1]) }; }
    if (typeof k === 'object') { const a = k.tu, b = k.den != null ? k.den : k.tu; if (a == null) return null; return { a: Math.min(a, b), b: Math.max(a, b), chu: k.chu }; }
    return null;
  }
  const NHOM_MAC_DINH = [{ ten: 'Nhóm nhà nước', toa_nha: 'tru_so' }, { ten: 'Nhóm cổ phần lớn', toa_nha: 'hoi_so' }, { ten: 'Nhóm cổ phần vừa và nhỏ', toa_nha: 'chi_nhanh' }];
  const CO_TOA = { tru_so: [440, 400], hoi_so: [440, 640], chi_nhanh: [360, 260] };
  const UU_TIEN = ['nhan', 'canh_bao', 'tot', 'nhan_phu', 'xau', 'chu'];
  const khoangMau = (a, b) => { const x = K.hex(a), y = K.hex(b); return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]); };
  // Ba màu nhóm khác nhau rõ trên nền thẻ: nhóm có khoa_mau dùng đúng khoá, nhóm còn lại chọn lần lượt theo UU_TIEN, bỏ màu gần màu đã chọn.
  function mauNhom(m, nhom, nen) {
    const ra = nhom.map((n) => (n.khoa_mau && m[n.khoa_mau] ? m[n.khoa_mau] : null));
    nhom.forEach((n, j) => {
      if (ra[j]) return;
      const daCo = ra.filter(Boolean);
      for (const k of UU_TIEN) { const v = m[k]; if (v && daCo.every((c) => khoangMau(c, v) > 90) && K.tuongPhan(v, nen) >= 1.6) { ra[j] = v; break; } }
      if (!ra[j]) ra[j] = m.nhan;
    });
    return ra.map((c) => duTuongPhan(c, nen, 3));
  }
  function dsTo(v) { if (v == null) return []; if (typeof v === 'number') return [{ chi_so: v }]; return (Array.isArray(v) ? v : [v]).filter((h) => h && h.chi_so != null); }

  K.khuon_so_sanh_nhom_ngan_hang_an_danh = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 140, Y = opt.y != null ? opt.y : 90, W = opt.rong || 1640, DAY = Math.min(opt.day || 940, 960);
    const chungTruc = opt.bo_cuc === 'chung_truc';
    // toà nhà nhỏ đầu nhóm: mặc định có ở 'cot'; ở 'chung_truc' mặc định không (biểu tượng chỉ cao 50 px, nét dưới 1 px), chú giải dùng mẫu thanh màu
    const bieuTuong = (chungTruc ? opt.bieu_tuong === true : opt.bieu_tuong !== false) && typeof K.toa_nha_ngan_hang === 'function';
    const nenThe = tay ? K.tron(m.the, m.giay, m.toi ? 0.08 : 0.5) : m.the;   // bộ nền tối: giấy pha nhẹ để thẻ không thành xám
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6);
    const chuNen = duTuongPhan(m.chu, m.nen, 7), phuNen = duTuongPhan(m.chu_phu, m.nen, 4.6);
    const id0 = 'kho-nhom-' + (++demId);

    // ----- dữ liệu -----
    const nhom = [0, 1, 2].map((j) => { const n = (opt.nhom || [])[j]; return Object.assign({}, NHOM_MAC_DINH[j], typeof n === 'string' ? { ten: n } : (n || {})); });
    const mauN = mauNhom(m, nhom, nenThe);
    if ((opt.chi_tieu || []).length > 6) console.warn('khuon_so_sanh_nhom_ngan_hang_an_danh: tối đa 6 chỉ tiêu, bỏ phần thừa');
    const chiTieu = (opt.chi_tieu || []).slice(0, 6).map((c0) => {
      const c = Object.assign({}, c0);
      c.dv = c.don_vi != null ? c.don_vi : (opt.don_vi != null ? opt.don_vi : '%');
      c.kh = [0, 1, 2].map((j) => chuanKhoang((c.khoang || [])[j]));
      const so = []; c.kh.forEach((k) => { if (k) so.push(k.a, k.b); });
      c.tp = c.thap_phan;   // không khai thì mỗi số giữ đúng số chữ số lẻ của nó (8–12%, 4,5–10%)
      if (Array.isArray(c.thang) && c.thang[1] > c.thang[0]) { c.lo = c.thang[0]; c.hi = c.thang[1]; }
      else if (!so.length) { c.lo = 0; c.hi = 100; }
      else {
        const nho = Math.min(...so), lon = Math.max(...so);
        c.lo = nho >= 0 ? 0 : -tronTren(-nho);
        c.hi = lon <= 0 ? 0 : tronTren(lon * 1.08);
        if (c.hi <= c.lo) c.hi = c.lo + 1;
      }
      const dvChu = c.dv ? (/^[%‰]/.test(c.dv) ? c.dv : ' ' + c.dv) : '';
      c.dvChu = dvChu;
      c.nhan = c.kh.map((k) => {
        if (!k) return null;
        if (k.chu) return k.chu;
        const f = (v) => K.so(v, c.tp != null ? c.tp : soLe(v));
        return (k.a === k.b ? f(k.a) : (k.a < 0 ? `${f(k.a)} đến ${f(k.b)}` : `${f(k.a)}–${f(k.b)}`)) + dvChu;
      });
      c.chuThang = `Thang ${K.so(c.lo, soLe(c.lo))}–${K.so(c.hi, soLe(c.hi))}${dvChu}`;
      return c;
    });
    const nD = chiTieu.length;

    const el = K.html('div', { class: 'kho-nhom-an-danh', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;font-family:${K.PHONG};pointer-events:none;` });
    const svgNen = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const defs = K.defs(svgNen);
    const gThe = K.svg('g', null, svgNen), gThanh = K.svg('g', null, svgNen);
    const lop = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);
    const svgTren = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const idBong = id0 + '-bong';
    const fb = K.svg('filter', { id: idBong, x: '-10%', y: '-10%', width: '120%', height: '130%' }, defs);
    K.svg('feDropShadow', { dx: 0, dy: 10, stdDeviation: 14, 'flood-color': '#000000', 'flood-opacity': m.toi ? 0.35 : 0.07 }, fb);
    const dongChu = (cha, chu, co, dam, lh, mau, them) => K.html('div', { style: `font-weight:${dam};font-size:${co}px;line-height:${lh}px;color:${mau};white-space:nowrap;${them || ''}` }, cha, chu);

    // ----- đầu trang: dòng nhỏ có vạch nhấn, tiêu đề lớn -----
    let coTD = opt.co_tieu_de || 60;
    let dongTD = opt.tieu_de ? K.xuongDong(opt.tieu_de, W, coTD, 800) : [];
    if (!opt.co_tieu_de && dongTD.length > 2) { coTD = 52; dongTD = K.xuongDong(opt.tieu_de, W, coTD, 800); }
    const lhTD = Math.round(coTD * 1.2);
    const hDau = (opt.dong_nho ? 52 : 0) + dongTD.length * lhTD;
    const dauEl = K.html('div', { style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;` }, lop);
    let loat = null, vach = null; const tuTD = [];
    if (opt.dong_nho) {
      loat = K.html('div', { style: 'display:flex;align-items:center;gap:18px;white-space:nowrap;height:34px;margin-bottom:18px;' }, dauEl);
      vach = K.html('div', { style: `width:56px;height:6px;border-radius:3px;background:${m.nhan};flex:none;` }, loat);
      K.html('div', { style: `font-weight:600;font-size:28px;line-height:34px;letter-spacing:0.04em;color:${phuNen};` }, loat, opt.dong_nho);
    }
    dongTD.forEach((d) => {
      const dv = K.html('div', { style: `font-weight:800;font-size:${coTD}px;line-height:${lhTD}px;color:${chuNen};letter-spacing:-0.01em;white-space:nowrap;` }, dauEl);
      d.split(' ').forEach((w, k) => { if (k) dv.appendChild(document.createTextNode(' ')); tuTD.push(K.html('span', { style: 'display:inline-block;' }, dv, w)); });
    });

    // ----- chân: chú thích cố định và nguồn -----
    const ghiChu = opt.ghi_chu === '' || opt.ghi_chu === false ? '' : (opt.ghi_chu || 'Số dạng khoảng theo nhóm, không nêu tên ngân hàng');
    const nguon = opt.nguon || '';
    const CO_GC = 22, CO_NG = 20, LH_C = 30;
    const wGC = ghiChu ? K.doChu(ghiChu, CO_GC, 600) + 26 : 0, wNG = nguon ? K.doChu(nguon, CO_NG, 500) : 0;
    const motHang = !ghiChu || !nguon || wGC + wNG + 48 <= W;
    const dongNG = nguon ? (motHang ? [nguon] : K.xuongDong(nguon, W, CO_NG, 500)) : [];
    const hChan = (ghiChu || nguon) ? (motHang ? LH_C : LH_C + 4 + dongNG.length * 28) : 0;

    // ----- khung chung: vùng đầu nhóm và vùng các dòng -----
    // cột tên chỉ tiêu: 'cot' 330; 'chung_truc' nới theo tên dài nhất (300–460) vì trục còn rộng và dòng thấp
    const rongTen = opt.rong_ten || (chungTruc ? Math.round(K.cl(Math.max(0, ...chiTieu.map((c) => K.doChu(c.ten || '', 30, 700))) + 24, 300, 460)) : 330);
    const yNhom = Y + hDau + (hDau ? 34 : 0);
    const moc = { tieu_de: { x: X, y: Y, w: W, h: hDau }, nhom: [], dong: [], o: [], chan: null };
    const nhomEl = [];            // theo nhóm: { o (div), t0, toa, phan: [phần tử thuộc nhóm để làm mờ] }
    const dongEl = [];            // theo dòng: { ten (div), ke: [đường kẻ], o: [{...}] }
    const dsVienNhom = [], dsVienDong = [];
    let yDong, hDong, cuoiDong;

    // Toà nhà nhỏ đầu nhóm: vẽ trong lớp SVG chung (gThanh), toạ độ sân khấu; mờ và dịch bằng thuộc tính SVG, không đặt trong khối HTML
    // có độ mờ CSS (Chrome vẽ lại nét mảnh dưới 1 px khác nhau tuỳ thứ tự khung, bộ kiểm hàm thuần bắt lỗi ở lượt chụp 02/11/2026).
    const taoToa = (j, hop, coHop) => {
      if (!bieuTuong) return null;
      const loai = CO_TOA[nhom[j].toa_nha] ? nhom[j].toa_nha : NHOM_MAC_DINH[j].toa_nha, [tw, th] = CO_TOA[loai];
      const co = Math.min(coHop[0] / tw, coHop[1] / th);
      const goc = K.svg('g', null, gThanh);
      const toa = K.toa_nha_ngan_hang({ loai, nhan: '', kieu: tay ? 'net_tay' : 'phang', co, mau: Object.assign({}, opt.mau || {}, { nhan: mauN[j] }), hat: 61 + j * 17, vao: 0, tinh });
      goc.appendChild(toa.el);
      return { goc, toa, x: hop[0] + coHop[0] / 2, y: hop[1] + coHop[1] };
    };

    if (!chungTruc) {
      // ===== bố cục 'cot': ba cột nhóm =====
      const GT = 24, GAP = 24, colX0 = X + rongTen + GT, cw = (X + W - colX0 - 2 * GAP) / 3;
      const colX = [0, 1, 2].map((j) => colX0 + j * (cw + GAP));
      const PAD = 20, ICW = bieuTuong ? 84 : 0, ICH = 76, textW = cw - 2 * PAD - (ICW ? ICW + 14 : 0);
      const coTN = nhom.some((n) => K.doChu(n.ten || '', 30, 800) > textW && K.doChu(n.ten || '', 28, 800) <= textW) ? 28 : 30, lhTN = coTN === 28 ? 36 : 38;
      const dauN = nhom.map((n) => ({ ten: K.xuongDong(n.ten || '', textW, coTN, 800), phu: n.phu ? K.xuongDong(n.phu, textW, 22, 600) : [] }));
      const noiDung = Math.max(ICW ? ICH + 4 : 0, ...dauN.map((d) => d.ten.length * lhTN + (d.phu.length ? 4 + d.phu.length * 28 : 0)));
      const hH = noiDung + 48;
      yDong = yNhom + hH;
      const conLai = DAY - (hChan ? hChan + 26 : 0) - 14 - yDong;
      hDong = nD ? Math.min(170, conLai / nD) : 0;
      cuoiDong = yDong + hDong * nD;
      const sc = K.cl((hDong - 80) / 80);
      const coTen = Math.round(26 + 4 * sc), lhTen = Math.round(coTen * 1.22), coPhu = Math.round(20 + 2 * sc), lhPhu = Math.round(coPhu * 1.3);
      const coNhan = Math.round(26 + 4 * sc), lhNhan = Math.round(coNhan * 1.2), day = Math.round(14 + 6 * sc), rCap = Math.round(day / 2);
      const mauRay = tay ? K.rgba(m.chu, 0.14) : K.tron(nenThe, m.chu, m.toi ? 0.16 : 0.1);

      // thẻ cột và đầu nhóm
      nhom.forEach((n, j) => {
        const x = colX[j], y = yNhom, h = cuoiDong - yNhom, mc = mauN[j];
        const g = K.svg('g', null, gThe);
        const nenDau = tay ? nenThe : K.tron(nenThe, mc, m.toi ? 0.16 : 0.1);
        if (!tay) {
          const cid = `${id0}-cl${j}`, cp = K.svg('clipPath', { id: cid }, defs);
          K.svg('rect', { x, y, width: cw, height: h, rx: 20 }, cp);
          K.svg('rect', { x, y, width: cw, height: h, rx: 20, fill: nenThe, filter: `url(#${idBong})` }, g);
          const gc = K.svg('g', { 'clip-path': `url(#${cid})` }, g);
          K.svg('rect', { x, y, width: cw, height: hH, fill: nenDau }, gc);
          K.svg('rect', { x, y, width: cw, height: 8, fill: mc }, gc);
          K.svg('line', { x1: x, y1: y + hH, x2: x + cw, y2: y + hH, stroke: K.rgba(m.chu, 0.14), 'stroke-width': 2 }, g);
        } else {
          theTay(g, x, y, cw, h, 20, m, nenThe, 200 + j * 7);
          K.svg('path', { d: gachHop(x + 4, y + 4, cw - 8, hH - 6, 14, 230 + j * 20), fill: 'none', stroke: mc, 'stroke-width': 1.6, 'stroke-opacity': 0.3, 'stroke-linecap': 'round' }, g);
          K.svg('path', { d: ngangTay(x + 22, x + cw - 22, y + hH, 260 + j, 1.4), fill: 'none', stroke: mc, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
        }
        for (let i = 1; i < nD; i++) {
          const yy = yDong + i * hDong;
          if (tay) K.svg('path', { d: ngangTay(x + 18, x + cw - 18, yy, 300 + j * 10 + i, 1), fill: 'none', stroke: K.rgba(m.chu, 0.3), 'stroke-width': 1.4, 'stroke-linecap': 'round' }, g);
          else K.svg('line', { x1: x + 16, y1: yy, x2: x + cw - 16, y2: yy, stroke: K.rgba(m.chu, 0.1), 'stroke-width': 2 }, g);
        }
        const o = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x}px;top:${y}px;width:${cw}px;height:${hH}px;box-sizing:border-box;` }, lop);
        const tenC = duTuongPhan(m.chu, nenDau, 7), phuC = duTuongPhan(m.chu_phu, nenDau, 4.6);
        const toa = taoToa(j, [x + PAD, y + 8 + (hH - 8 - ICH) / 2 - 2], [ICW, ICH]);
        const d = dauN[j], hT = d.ten.length * lhTN + (d.phu.length ? 4 + d.phu.length * 28 : 0);
        const khoi = K.html('div', { style: `position:absolute;left:${PAD + (ICW ? ICW + 14 : 0)}px;top:${(8 + (hH - 8 - hT) / 2).toFixed(1)}px;width:${textW}px;` }, o);
        d.ten.forEach((s) => dongChu(khoi, s, coTN, 800, lhTN, tenC));
        if (d.phu.length) { const p = K.html('div', { style: 'margin-top:4px;' }, khoi); d.phu.forEach((s) => dongChu(p, s, 22, 600, 28, phuC)); }
        nhomEl.push({ o, g, toa, phan: [] });
        moc.nhom.push({ x, y, w: cw, h: hH, the: { x, y, w: cw, h } });
        // khung tô sáng nhóm
        const vx = x - 9, vy = y - 9, vw = cw + 18, vh = h + 18;
        const v = tay
          ? K.svg('path', { d: K.duongTay(diemHop(vx, vy, vw, vh, 26, 110), { hat: 340 + j, lech: 2.2, dong: true }), fill: 'none', stroke: m.nhan, 'stroke-width': 4, 'stroke-linecap': 'round' }, svgTren)
          : K.svg('rect', { x: vx, y: vy, width: vw, height: vh, rx: 26, fill: 'none', stroke: mc, 'stroke-width': 5 }, svgTren);
        v._L = 2 * (vw + vh) * 1.04;
        dsVienNhom.push(v);
      });

      // các dòng chỉ tiêu
      chiTieu.forEach((c, i) => {
        const y = yDong + i * hDong;
        const phu = c.phu != null ? c.phu : c.chuThang;
        const lt = K.xuongDong(c.ten || '', rongTen - 16, coTen, 700), lp = phu ? K.xuongDong(phu, rongTen - 16, coPhu, 500) : [];
        const hT = lt.length * lhTen + (lp.length ? 2 + lp.length * lhPhu : 0);
        const ten = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${X}px;top:${y}px;width:${rongTen}px;height:${hDong}px;` }, lop);
        const khoi = K.html('div', { style: `position:absolute;left:0;top:${((hDong - hT) / 2).toFixed(1)}px;` }, ten);
        lt.forEach((s) => dongChu(khoi, s, coTen, 700, lhTen, chuNen));
        if (lp.length) { const p = K.html('div', { style: 'margin-top:2px;' }, khoi); lp.forEach((s) => dongChu(p, s, coPhu, 500, lhPhu, phuNen)); }
        const ke = [];
        if (i > 0) ke.push(tay ? K.svg('path', { d: ngangTay(X, X + rongTen, y, 360 + i, 1), fill: 'none', stroke: K.rgba(m.chu, 0.3), 'stroke-width': 1.4 }, gThe)
          : K.svg('line', { x1: X, y1: y, x2: X + rongTen, y2: y, stroke: K.rgba(m.chu, 0.14), 'stroke-width': 2 }, gThe));
        const r = { ten, ke, o: [] };
        moc.dong.push({ x: X, y, w: W, h: hDong });
        moc.o.push([]);
        nhom.forEach((n, j) => {
          const mc = mauN[j], ox = colX[j] + 12, ow = cw - 24;
          const cx0 = colX[j] + 26, cw0 = cw - 52, x0 = cx0 + rCap, x1 = cx0 + cw0 - rCap;
          const khoiH = lhNhan + 10 + 2 * rCap, top = y + (hDong - khoiH) / 2, yT = top + lhNhan + 10 + rCap;
          const kh = c.kh[j], X_ = (v) => x0 + K.cl((v - c.lo) / (c.hi - c.lo)) * (x1 - x0);
          const o = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${ox}px;top:${y + 4}px;width:${ow}px;height:${hDong - 8}px;` }, lop);
          const g = K.svg('g', null, gThanh);
          const ray = tay ? K.svg('path', { d: ngangTay(x0, x1, yT, 400 + i * 10 + j, 0.8), fill: 'none', stroke: mauRay, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-dasharray': kh ? null : `${day * 0.2} ${day * 1.6}` }, g)
            : K.svg('line', { x1: x0, y1: yT, x2: x1, y2: yT, stroke: mauRay, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-dasharray': kh ? null : `0.1 ${day * 1.8}` }, g);
          const cell = { o, g, ray, kh, yT, nhan: null, thanh: null };
          if (kh) {
            const xa = X_(kh.a), xb = X_(kh.b), giua = (xa + xb) / 2;
            cell.xa = xa; cell.xb = xb; cell.giua = giua;
            cell.thanh = veThanh(g, giua, xa, xb, yT, day, rCap, mc, 500 + i * 10 + j);
            const wN = K.doChu(c.nhan[j], coNhan, 800) + 4;
            const lx = K.cl(giua - wN / 2, cx0, cx0 + cw0 - wN) - ox;
            cell.nhan = K.html('div', { style: `position:absolute;left:${lx.toFixed(1)}px;top:${(top - y - 4).toFixed(1)}px;font-weight:800;font-size:${coNhan}px;line-height:${lhNhan}px;color:${mauChu};white-space:nowrap;` }, o, c.nhan[j]);
            moc.o[i].push({ x: ox, y: y + 4, w: ow, h: hDong - 8, dau: [xa, yT], cuoi: [xb, yT], giua: [giua, yT] });
          } else {
            const coC = coPhu + 2, lhC = Math.round(coC * 1.3), wN = K.doChu('chưa có số', coC, 500);
            cell.nhan = K.html('div', { style: `position:absolute;left:${((ow - wN) / 2 - 12).toFixed(1)}px;top:${(yT - y - 4 - lhC / 2 - 2).toFixed(1)}px;padding:2px 12px;border-radius:999px;background:${nenThe};font-weight:500;font-style:italic;font-size:${coC}px;line-height:${lhC}px;color:${mauPhu};white-space:nowrap;` }, o, 'chưa có số');
            moc.o[i].push({ x: ox, y: y + 4, w: ow, h: hDong - 8, dau: null, cuoi: null, giua: [(x0 + x1) / 2, yT] });
          }
          r.o.push(cell);
          nhomEl[j].phan.push(cell);
        });
        dongEl.push(r);
        const vx = X - 14, vy = y + 2, vw = W + 28, vh = hDong - 4;
        const v = tay
          ? K.svg('path', { d: K.duongTay(diemHop(vx, vy, vw, vh, 16, 110), { hat: 380 + i, lech: 2, dong: true }), fill: 'none', stroke: m.nhan, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, svgTren)
          : K.svg('rect', { x: vx, y: vy, width: vw, height: vh, rx: 16, fill: 'none', stroke: m.nhan, 'stroke-width': 4 }, svgTren);
        v._L = 2 * (vw + vh) * 1.04;
        dsVienDong.push(v);
      });
    } else {
      // ===== bố cục 'chung_truc': mỗi dòng một trục chung, ba thanh ba màu =====
      // chú giải nhóm
      const ICW = bieuTuong ? 58 : 0, ICH = 50, SW = 44, HC = 66;
      let coPhuOn = true;
      const doChip = (n, coPhu) => 36 + (ICW ? ICW + 12 : 0) + SW + 14 + K.doChu(n.ten || '', 26, 700) + (coPhu && n.phu ? 12 + K.doChu(n.phu, 22, 600) : 0);
      let rongChip = nhom.map((n) => doChip(n, true));
      if (rongChip.reduce((a, b) => a + b, 0) + 40 > W) { coPhuOn = false; rongChip = nhom.map((n) => doChip(n, false)); }
      let xc = X;
      nhom.forEach((n, j) => {
        const mc = mauN[j], w = rongChip[j];
        const o = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${xc}px;top:${yNhom}px;width:${w}px;height:${HC}px;box-sizing:border-box;border-radius:999px;` +
          (tay ? '' : `background:${nenThe};border:2px solid ${K.rgba(mc, 0.55)};box-shadow:0 6px 16px ${K.rgba('#000000', m.toi ? 0.3 : 0.07)};`) }, lop);
        const g = K.svg('g', null, gThe);
        if (tay) {
          K.svg('path', { d: K.duongTay(diemHop(xc, yNhom, w, HC, HC / 2, 90), { hat: 600 + j, lech: 1.6, dong: true }) + 'Z', fill: nenThe }, g);
          K.svg('path', { d: K.duongTay(diemHop(xc, yNhom, w, HC, HC / 2, 80), { hat: 601 + j, lech: 1.6, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
        }
        let lx = 18;
        const toa = taoToa(j, [xc + lx, yNhom + (HC - ICH) / 2 - 3], [ICW, ICH]);
        if (toa) lx += ICW + 12;
        const sw = K.svg('svg', { width: SW, height: 20, style: `position:absolute;left:${lx}px;top:${HC / 2 - 10 - 2}px;overflow:visible;` }, o);
        if (tay) {
          K.svg('path', { d: ngangTay(7, SW - 7, 10, 640 + j, 0.6), fill: 'none', stroke: K.rgba(mc, 0.8), 'stroke-width': 12, 'stroke-linecap': 'round' }, sw);
          K.svg('path', { d: ngangTay(4, SW - 4, 4, 650 + j, 0.6) + ' ' + ngangTay(4, SW - 4, 16, 660 + j, 0.6), fill: 'none', stroke: m.chu, 'stroke-width': 1.5, 'stroke-linecap': 'round' }, sw);
        } else {
          K.svg('line', { x1: 7, y1: 10, x2: SW - 7, y2: 10, stroke: mc, 'stroke-width': 12, 'stroke-linecap': 'round' }, sw);
          K.svg('circle', { cx: 7, cy: 10, r: 8, fill: mc, stroke: nenThe, 'stroke-width': 2.5 }, sw);
          K.svg('circle', { cx: SW - 7, cy: 10, r: 8, fill: mc, stroke: nenThe, 'stroke-width': 2.5 }, sw);
        }
        lx += SW + 14;
        const hang = K.html('div', { style: `position:absolute;left:${lx}px;top:${(HC - 34) / 2 - 2}px;display:flex;align-items:baseline;gap:12px;white-space:nowrap;` }, o);
        K.html('div', { style: `font-weight:700;font-size:26px;line-height:34px;color:${mauChu};` }, hang, n.ten || '');
        if (coPhuOn && n.phu) K.html('div', { style: `font-weight:600;font-size:22px;line-height:34px;color:${mauPhu};` }, hang, n.phu);
        nhomEl.push({ o, g, toa, phan: [] });
        moc.nhom.push({ x: xc, y: yNhom, w, h: HC });
        const vx = xc - 8, vy = yNhom - 8, vw = w + 16, vh = HC + 16;
        const v = tay
          ? K.svg('path', { d: K.duongTay(diemHop(vx, vy, vw, vh, vh / 2, 90), { hat: 670 + j, lech: 2, dong: true }), fill: 'none', stroke: m.nhan, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, svgTren)
          : K.svg('rect', { x: vx, y: vy, width: vw, height: vh, rx: vh / 2, fill: 'none', stroke: mc, 'stroke-width': 4 }, svgTren);
        v._L = 2 * (vw + vh) * 1.04;
        dsVienNhom.push(v);
        xc += w + 20;
      });

      yDong = yNhom + HC + 22;
      const conLai = DAY - (hChan ? hChan + 26 : 0) - 14 - yDong;
      hDong = nD ? Math.min(190, conLai / nD) : 0;
      cuoiDong = yDong + hDong * nD;
      const coVach = hDong >= 3 * 30 + 50;
      const laneH = Math.min(44, (hDong - 16 - (coVach ? 30 : 0)) / 3);
      const sc = K.cl((hDong - 80) / 90);
      const coTen = Math.round(26 + 4 * sc), lhTen = Math.round(coTen * 1.22), coPhu = Math.round(20 + 2 * sc), lhPhu = Math.round(coPhu * 1.3);
      const coNhan = Math.round(K.cl(laneH * 0.66, 20, 28)), lhNhan = Math.min(Math.round(coNhan * 1.2), Math.floor(laneH) + 2);
      const day = Math.round(K.cl(laneH * 0.4, 12, 18)), rCap = Math.round(day / 2);
      const mauRay = tay ? K.rgba(m.chu, 0.12) : K.tron(nenThe, m.chu, m.toi ? 0.13 : 0.08);
      const datTruoc = Math.max(60, ...chiTieu.map((c) => Math.max(0, ...c.nhan.map((s) => (s ? K.doChu(s, coNhan, 800) : 0))))) + 18;
      const ax0 = X + rongTen + 30 + rCap, ax1 = X + W - 24 - datTruoc - rCap;

      // thẻ chung
      const gT = K.svg('g', null, gThe);
      if (tay) theTay(gT, X - 16, yDong, W + 32, cuoiDong - yDong, 20, m, nenThe, 700);
      else K.svg('rect', { x: X - 16, y: yDong, width: W + 32, height: cuoiDong - yDong, rx: 20, fill: nenThe, filter: `url(#${idBong})` }, gT);
      nhomEl.forEach((ne) => { ne.gThe = gT; });

      chiTieu.forEach((c, i) => {
        const y = yDong + i * hDong;
        const phu = c.phu != null ? c.phu : (coVach ? '' : c.chuThang);
        const lt = K.xuongDong(c.ten || '', rongTen - 16, coTen, 700), lp = phu ? K.xuongDong(phu, rongTen - 16, coPhu, 500) : [];
        const hT = lt.length * lhTen + (lp.length ? 2 + lp.length * lhPhu : 0);
        const ten = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${X + 8}px;top:${y}px;width:${rongTen}px;height:${hDong}px;` }, lop);
        const khoi = K.html('div', { style: `position:absolute;left:0;top:${((hDong - hT) / 2).toFixed(1)}px;` }, ten);
        lt.forEach((s) => dongChu(khoi, s, coTen, 700, lhTen, mauChu));
        if (lp.length) { const p = K.html('div', { style: 'margin-top:2px;' }, khoi); lp.forEach((s) => dongChu(p, s, coPhu, 500, lhPhu, mauPhu)); }
        const ke = [];
        const gD = K.svg('g', null, gThe);
        if (i > 0) ke.push(tay ? K.svg('path', { d: ngangTay(X + 4, X + W - 4, y, 720 + i, 1), fill: 'none', stroke: K.rgba(m.chu, 0.3), 'stroke-width': 1.4 }, gD)
          : K.svg('line', { x1: X, y1: y, x2: X + W, y2: y, stroke: K.rgba(m.chu, 0.1), 'stroke-width': 2 }, gD));
        // vạch chia thang và trục
        const top = y + 8 + (hDong - 16 - (coVach ? 30 : 0) - 3 * laneH) / 2, bot = top + 3 * laneH;
        const X_ = (v) => ax0 + K.cl((v - c.lo) / (c.hi - c.lo)) * (ax1 - ax0);
        const buoc = buocTron((c.hi - c.lo) / 4), tpV = Math.max(soLe(buoc), soLe(c.lo));
        const vach = [];
        for (let v = Math.ceil(c.lo / buoc - 1e-9) * buoc; v <= c.hi + 1e-9; v += buoc) vach.push(+v.toFixed(6));
        vach.forEach((v, k) => {
          const xv = X_(v);
          if (tay) K.svg('path', { d: K.duongTay([[xv, top], [xv, (top + bot) / 2], [xv, bot]], { hat: 740 + i * 10 + k, lech: 0.8 }), fill: 'none', stroke: K.rgba(m.chu, 0.18), 'stroke-width': 1.4, 'stroke-dasharray': '6 6' }, gD);
          else K.svg('line', { x1: xv, y1: top, x2: xv, y2: bot, stroke: K.rgba(m.chu, v === 0 ? 0.28 : 0.1), 'stroke-width': 2 }, gD);
        });
        if (tay) K.svg('path', { d: ngangTay(ax0 - rCap, ax1 + rCap, bot, 760 + i, 1), fill: 'none', stroke: K.rgba(m.chu, 0.5), 'stroke-width': 2, 'stroke-linecap': 'round' }, gD);
        else K.svg('line', { x1: ax0 - rCap, y1: bot, x2: ax1 + rCap, y2: bot, stroke: K.rgba(m.chu, 0.3), 'stroke-width': 2 }, gD);
        const nhanVach = [];
        if (coVach) {
          const hv = K.html('div', { style: `position:absolute;left:${ax0 - 60}px;top:${bot + 2}px;width:${ax1 - ax0 + 120}px;height:28px;` }, lop);
          vach.forEach((v, k) => {
            const s = K.so(v, tpV) + (k === vach.length - 1 ? c.dvChu : '');
            const wv = K.doChu(s, 20, 500);
            nhanVach.push(K.html('div', { style: `position:absolute;left:${(X_(v) - (ax0 - 60) - wv / 2).toFixed(1)}px;top:0;font-weight:500;font-size:20px;line-height:26px;color:${mauPhu};white-space:nowrap;` }, hv, s));
          });
          nhanVach.hop = hv;
        }
        ke.push(gD);
        const r = { ten, ke, o: [], vach: nhanVach.hop || null };
        moc.dong.push({ x: X, y, w: W, h: hDong });
        moc.o.push([]);
        nhom.forEach((n, j) => {
          const mc = mauN[j], ly = top + j * laneH, yT = ly + laneH / 2, kh = c.kh[j];
          const ox = ax0 - rCap - 6, ow = ax1 - ax0 + 2 * rCap + datTruoc + 6;
          const o = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${ox}px;top:${ly.toFixed(1)}px;width:${ow}px;height:${laneH.toFixed(1)}px;` }, lop);
          const g = K.svg('g', null, gThanh);
          const ray = tay ? K.svg('path', { d: ngangTay(ax0, ax1, yT, 800 + i * 10 + j, 0.6), fill: 'none', stroke: mauRay, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-dasharray': kh ? null : `${day * 0.2} ${day * 1.6}` }, g)
            : K.svg('line', { x1: ax0, y1: yT, x2: ax1, y2: yT, stroke: mauRay, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-dasharray': kh ? null : `0.1 ${day * 1.8}` }, g);
          const cell = { o, g, ray, kh, yT, nhan: null, thanh: null };
          if (kh) {
            const xa = X_(kh.a), xb = X_(kh.b), giua = (xa + xb) / 2;
            cell.thanh = veThanh(g, giua, xa, xb, yT, day, rCap, mc, 900 + i * 10 + j);
            cell.nhan = K.html('div', { style: `position:absolute;left:${(xb + rCap + 10 - ox).toFixed(1)}px;top:${((laneH - lhNhan) / 2).toFixed(1)}px;font-weight:800;font-size:${coNhan}px;line-height:${lhNhan}px;color:${mauChu};white-space:nowrap;` }, o, c.nhan[j]);
            moc.o[i].push({ x: ox, y: ly, w: ow, h: laneH, dau: [xa, yT], cuoi: [xb, yT], giua: [giua, yT] });
          } else {
            const co = Math.max(20, coNhan - 4), wN = K.doChu('chưa có số', co, 500);
            cell.nhan = K.html('div', { style: `position:absolute;left:${((ax0 + ax1) / 2 - ox - wN / 2 - 12).toFixed(1)}px;top:${((laneH - Math.min(laneH, co * 1.25)) / 2).toFixed(1)}px;padding:0 12px;border-radius:999px;background:${nenThe};font-weight:500;font-style:italic;font-size:${co}px;line-height:${Math.min(Math.floor(laneH), Math.round(co * 1.25))}px;color:${mauPhu};white-space:nowrap;` }, o, 'chưa có số');
            moc.o[i].push({ x: ox, y: ly, w: ow, h: laneH, dau: null, cuoi: null, giua: [(ax0 + ax1) / 2, yT] });
          }
          r.o.push(cell);
          nhomEl[j].phan.push(cell);
        });
        dongEl.push(r);
        const vx = X - 10, vy = y + 3, vw = W + 20, vh = hDong - 6;
        const v = tay
          ? K.svg('path', { d: K.duongTay(diemHop(vx, vy, vw, vh, 14, 110), { hat: 860 + i, lech: 2, dong: true }), fill: 'none', stroke: m.nhan, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, svgTren)
          : K.svg('rect', { x: vx, y: vy, width: vw, height: vh, rx: 14, fill: 'none', stroke: m.nhan, 'stroke-width': 4 }, svgTren);
        v._L = 2 * (vw + vh) * 1.04;
        dsVienDong.push(v);
      });
    }

    // Thanh khoảng: phẳng là đoạn đầu tròn có hai chấm đầu; nét tay là vệt màu loang, hai nét chì mép, hai vòng chì đầu. Mọc từ giữa ra hai đầu.
    // Thanh khoảng: đoạn đầu tròn dày `day` trên ray; phẳng có chấm nhỏ màu nền đánh dấu hai đầu (ẩn khi khoảng quá hẹp);
    // nét tay là vệt màu loang, hai nét chì mép, hai vòng chì ở đầu. Mọc từ giữa ra hai đầu.
    function veThanh(g, giua, xa, xb, y, day, rCap, mc, hat) {
      const t = { giua, xa, xb, y, hep: xb - xa < day * 1.2 };
      if (!tay) {
        t.doan = K.svg('line', { x1: giua, y1: y, x2: giua, y2: y, stroke: mc, 'stroke-width': day, 'stroke-linecap': 'round' }, g);
        t.cap = [0, 1].map(() => K.svg('circle', { cx: giua, cy: y, r: Math.max(2.5, day * 0.2).toFixed(1), fill: nenThe }, g));
      } else {
        t.nua = [xa, xb].map((xe, k) => {
          const L = Math.abs(xe - giua) * 1.05 + 6;
          const ps = [
            K.svg('path', { d: ngangTay(giua, xe, y, hat * 3 + k, 0.7), fill: 'none', stroke: K.rgba(mc, 0.8), 'stroke-width': day, 'stroke-linecap': 'round' }, g),
            K.svg('path', { d: ngangTay(giua, xe, y - day / 2, hat * 3 + k + 7, 0.9), fill: 'none', stroke: m.chu, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g),
            K.svg('path', { d: ngangTay(giua, xe, y + day / 2, hat * 3 + k + 13, 0.9), fill: 'none', stroke: m.chu, 'stroke-width': 1.6, 'stroke-linecap': 'round' }, g),
          ];
          return { ps, L };
        });
        t.cap = [0, 1].map((k) => K.svg('path', { d: tronTay(rCap + 1, hat + 40 + k), fill: mc, stroke: m.chu, 'stroke-width': 1.8, transform: `translate(${giua} ${y})` }, g));
      }
      return t;
    }

    // ----- chân -----
    let chanEl = null, chanGC = null, chanNG = null;
    if (hChan) {
      const yC = cuoiDong + 26;
      chanEl = K.html('div', { style: `position:absolute;left:${X}px;top:${yC}px;width:${W}px;height:${hChan}px;` }, lop);
      if (ghiChu) {
        chanGC = K.html('div', { style: `position:absolute;left:0;top:0;display:flex;align-items:center;gap:12px;white-space:nowrap;` }, chanEl);
        K.html('div', { style: `width:14px;height:14px;border-radius:4px;background:${m.nhan};flex:none;` }, chanGC);
        K.html('div', { style: `font-weight:600;font-size:${CO_GC}px;line-height:${LH_C}px;color:${phuNen};` }, chanGC, ghiChu);
      }
      if (nguon) {
        chanNG = K.html('div', { style: motHang && ghiChu ? 'position:absolute;right:0;top:0;text-align:right;' : `position:absolute;left:0;top:${ghiChu ? LH_C + 4 : 0}px;` }, chanEl);
        dongNG.forEach((s) => dongChu(chanNG, s, CO_NG, 500, motHang ? LH_C : 28, phuNen));
      }
      moc.chan = { x: X, y: yC, w: W, h: hChan };
    }

    // ----- mốc thời gian -----
    const tCot = tinh ? -100 : (opt.moc_cot != null ? opt.moc_cot : vao + 0.3 + Math.min(0.6, tuTD.length * 0.045));
    const mh = opt.moc_hien || [];
    const tDong = chiTieu.map((c, i) => (tinh ? -100 : (mh[i] != null ? mh[i] : tCot + 0.9 + i * 0.7)));
    const hetDong = tDong.length ? tDong[tDong.length - 1] + 0.15 + 0.24 + 0.65 : tCot + 0.6;
    const toN = dsTo(opt.to_nhom).map((h) => ({ j: h.chi_so, t0: tinh && h.moc == null ? -100 : (h.moc != null ? h.moc : hetDong + 0.5), het: h.het }));
    const toD = dsTo(opt.to_dong).map((h) => ({ i: h.chi_so, t0: tinh && h.moc == null ? -100 : (h.moc != null ? h.moc : hetDong + 0.5), het: h.het }));
    const xong = tinh ? 0 : Math.max(hetDong, ...toN.map((h) => h.t0 + 0.5), ...toD.map((h) => h.t0 + 0.5));
    nhomEl.forEach((ne, j) => { ne.t0 = tCot + j * 0.15; if (ne.toa) ne.toa.vao = ne.t0 + 0.05; });
    const muc = (t, h) => K.eo3(K.tienDo(t, h.t0, 0.4)) * (h.het != null ? 1 - K.eo3(K.tienDo(t, h.het, 0.4)) : 1);

    function seek(t) {
      // đầu trang
      if (loat) { loat.style.opacity = K.eo3(K.tienDo(t, vao, 0.4)).toFixed(3); vach.style.width = Math.round(8 + 48 * K.eio(K.tienDo(t, vao, 0.6))) + 'px'; }
      tuTD.forEach((s, k) => hienTu(s, t, vao + 0.2 + k * 0.045, 22));
      // mức làm mờ theo nhóm và theo dòng
      const moN = [1, 1, 1], vienN = [0, 0, 0];
      toN.forEach((h) => { const p = muc(t, h); if (h.j >= 0 && h.j < 3) vienN[h.j] = Math.max(vienN[h.j], p); for (let j = 0; j < 3; j++) if (j !== h.j) moN[j] *= 1 - 0.72 * p; });
      const moD = chiTieu.map(() => 1), vienD = chiTieu.map(() => 0);
      toD.forEach((h) => { const p = muc(t, h); if (h.i >= 0 && h.i < nD) vienD[h.i] = Math.max(vienD[h.i], p); for (let i = 0; i < nD; i++) if (i !== h.i) moD[i] *= 1 - 0.55 * p; });
      // đầu nhóm và thẻ
      nhomEl.forEach((ne, j) => {
        const a = K.eo3(K.tienDo(t, ne.t0, 0.4)), dy = Math.round((1 - K.spr(t - ne.t0, 0.5, 0.65)) * 30);
        ne.o.style.opacity = (a * moN[j]).toFixed(3);
        ne.o.style.transform = `translateY(${dy}px)`;
        if (ne.g) { ne.g.setAttribute('opacity', a.toFixed(3)); ne.g.setAttribute('transform', `translate(0 ${dy})`); }
        if (ne.toa) {
          ne.toa.toa.seek(t - ne.toa.vao);
          ne.toa.goc.setAttribute('transform', `translate(${ne.toa.x.toFixed(1)} ${(ne.toa.y + dy).toFixed(1)})`);
          ne.toa.goc.setAttribute('opacity', (a * moN[j]).toFixed(3));
        }
      });
      if (chungTruc && nhomEl[0] && nhomEl[0].gThe) nhomEl[0].gThe.setAttribute('opacity', K.eo3(K.tienDo(t, tCot + 0.3, 0.5)).toFixed(3));
      // dòng
      dongEl.forEach((r, i) => {
        const t0 = tDong[i], a = K.eo3(K.tienDo(t, t0, 0.35)), dx = Math.round((1 - K.spr(t - t0, 0.45, 0.7)) * -22);
        r.ten.style.opacity = (a * moD[i]).toFixed(3); r.ten.style.transform = `translateX(${dx}px)`;
        r.ke.forEach((k) => k.setAttribute('opacity', a.toFixed(3)));
        if (r.vach) r.vach.style.opacity = (a * moD[i]).toFixed(3);
        r.o.forEach((c, j) => {
          const tb = t0 + 0.15 + j * 0.12, mo = moD[i] * moN[j];
          c.ray.setAttribute('opacity', (a * (0.4 + 0.6 * mo)).toFixed(3));
          c.g.setAttribute('opacity', mo.toFixed(3));
          const an = K.eo3(K.tienDo(t, tb + (c.kh ? 0.35 : 0.1), 0.3));
          c.nhan.style.opacity = (an * mo).toFixed(3);
          c.nhan.style.transform = `translateY(${Math.round((1 - K.eob(K.tienDo(t, tb + 0.35, 0.4), 1.2)) * 12)}px)`;
          if (!c.thanh) return;
          const p = K.eio(K.tienDo(t, tb, 0.65)), th = c.thanh;
          const xa = K.lerp(th.giua, th.xa, p), xb = K.lerp(th.giua, th.xb, p), hien = t >= tb ? 1 : 0;
          if (!tay) {
            th.doan.setAttribute('x1', xa.toFixed(1)); th.doan.setAttribute('x2', xb.toFixed(1)); th.doan.setAttribute('opacity', hien);
            const hienCap = th.hep ? 0 : hien * K.eo3(K.tienDo(t, tb + 0.45, 0.25));
            th.cap[0].setAttribute('cx', xa.toFixed(1)); th.cap[1].setAttribute('cx', xb.toFixed(1));
            th.cap.forEach((cp) => cp.setAttribute('opacity', hienCap.toFixed(3)));
          } else {
            th.nua.forEach((n) => n.ps.forEach((ps) => { hienDan(ps, n.L, p); ps.setAttribute('opacity', hien); }));
            th.cap[0].setAttribute('transform', `translate(${xa.toFixed(1)} ${th.y})`); th.cap[1].setAttribute('transform', `translate(${xb.toFixed(1)} ${th.y})`);
            th.cap.forEach((cp) => cp.setAttribute('opacity', hien));
          }
        });
      });
      // khung tô sáng
      dsVienNhom.forEach((v, j) => {
        const h = toN.filter((x) => x.j === j)[0];
        if (!h) { v.setAttribute('opacity', 0); return; }
        if (tay) { hienDan(v, v._L, K.eio(K.tienDo(t, h.t0, 0.6))); v.setAttribute('opacity', vienN[j] > 0.001 ? (h.het != null ? 1 - K.eo3(K.tienDo(t, h.het, 0.4)) : 1).toFixed(3) : 0); }
        else v.setAttribute('opacity', vienN[j].toFixed(3));
      });
      dsVienDong.forEach((v, i) => {
        const h = toD.filter((x) => x.i === i)[0];
        if (!h) { v.setAttribute('opacity', 0); return; }
        if (tay) { hienDan(v, v._L, K.eio(K.tienDo(t, h.t0, 0.6))); v.setAttribute('opacity', vienD[i] > 0.001 ? (h.het != null ? 1 - K.eo3(K.tienDo(t, h.het, 0.4)) : 1).toFixed(3) : 0); }
        else v.setAttribute('opacity', vienD[i].toFixed(3));
      });
      if (chanEl) chanEl.style.opacity = K.eo3(K.tienDo(t, tCot + 0.4, 0.5)).toFixed(3);
    }

    moc.moc_cot = tCot; moc.moc_hang = tDong; moc.xong = xong;
    return { el, seek, moc };
  };
  K.so_sanh_nhom_an_danh = K.khuon_so_sanh_nhom_ngan_hang_an_danh;
})();
