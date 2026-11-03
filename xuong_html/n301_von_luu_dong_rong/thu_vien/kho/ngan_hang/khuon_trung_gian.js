// ngan_hang/khuon_trung_gian.js — 1.1 — khuôn ngân hàng làm trung gian giữa người gửi và người vay: ba khối xếp ngang (người gửi trái, ngân hàng giữa,
// người vay phải), tiền gốc chảy sang phải, lãi chảy ngược về, phần chênh lệch rơi xuống một khối dưới ngân hàng và tách thành các phần;
// tuỳ chọn thay người vay đơn lẻ bằng lưới nhiều người vay nhỏ (chia nhỏ rủi ro) và một khoản vay mất vốn (ngân hàng vẫn trả đủ người gửi).
// Dùng cho: N201 vì sao người ta vay, vì sao ngân hàng cho vay; N198 hoạt động cho vay; N199 huy động vốn (bỏ ben_vay: chỉ hai khối).
// 1.1 (03/11/2026, "ít chữ"): mặc định KHÔNG có chữ nào. Bản 1.0 tự điền tên 'Người gửi', 'Ngân hàng', 'Người vay', 'Chênh lệch', '<so> khoản vay nhỏ',
//   'Một khoản vay không trả được', 'Vẫn trả đủ lãi cho người gửi', biển 'Ngân hàng', 'Công ty'; bản 1.1 bỏ hết, nhãn chỉ hiện khi người gọi truyền chữ.
//   Lời gọi 1.0 có truyền chữ vẫn ra đúng chữ đó. Mọi nhãn nhận false để tắt; chu: false tắt mọi chữ (kể cả số). Chữ tự vẽ tối thiểu 28 px
//   (tên 30, dòng phụ 28, nhãn dòng 28, số 36–44). Thêm kiểu 'toi_gian' và tham số net. Dòng tiền, nhãn tên vẽ trong khuôn (không qua
//   so_do_dong_tien_cac_ben nữa, vì bản đó có chữ 22–26 px và hạt tiền chữ 'đ' 18 px); mũi tên nối vào cạnh hình thay vì nhãn tên.
// Gọi: KHO.khuon_trung_gian_ba_khoi({ kieu, mau, net, chu, ben_gui, ngan_hang, ben_vay, goc, lai_vay, lai_gui, chenh_lech, nhieu_ben_vay, mat_von, y, x_ben, co_hinh, vao, tinh });
//   kieu 'phang' | 'net_tay' | 'toi_gian' (khối phẳng màu bộ màu, không bóng, không chi tiết trang trí, không chữ trên vật; người, ngân hàng,
//        nhà xưởng, nhà, đồng xu tự vẽ cùng tỉ lệ và gốc chân với hình của kho; ngân hàng luôn dáng trụ sở); net { day (mặc định 0 = không viền),
//        mau (khoá màu, mặc định 'chu') } — viền của khối ở kiểu toi_gian; chu: false tắt mọi chữ.
//   ben_gui  { ten, phu, hinh: 'nguoi' (mặc định) | 'doanh_nghiep' | 'nha' | 'ca_hai', vai, toc, tu_the, bien (chữ biển nhà xưởng; mặc định biển trơn) }  bỏ trống = không có khối;
//   ngan_hang { ten, phu, loai: 'tru_so' (mặc định) | 'chi_nhanh' | 'hoi_so', bien (chữ biển toà nhà; mặc định biển trơn) }; false = không có khối;
//   ben_vay  { ten, phu, hinh: 'nguoi' | 'doanh_nghiep' (mặc định) | 'nha' | 'ca_hai' (người và nhà xưởng), vai, toc, tu_the, bien };
//   goc      { so, nhan (dòng người gửi → ngân hàng), nhan_ra, so_ra (dòng ngân hàng → người vay, mặc định như nhan, so), moc_vao, moc_ra };
//   lai_vay  { so, nhan, moc } (người vay → ngân hàng); lai_gui { so, nhan, moc } (ngân hàng → người gửi); gốc cong lên trên, lãi cong xuống dưới;
//   chenh_lech { so, nhan, phu, moc, loai_tien: 'chong_xu' (mặc định) | 'xap_tien',
//                tach: [{ nhan, gia_tri (số, định tỉ lệ thanh chia), so (chữ hiện; mặc định KHO.so(gia_tri), false để tắt), khoa_mau }], moc_tach, nhip_tach (0,5) };
//   nhieu_ben_vay { so (4–12), moc, nhan (chữ trên lưới), hinh: 'tron' (mặc định: người, nhà xưởng, nhà xen kẽ) | 'nguoi' | 'doanh_nghiep' | 'nha' };
//   mat_von  { moc, chi_so (người vay nào trong lưới, mặc định 0 là ô trên cùng bên trái), nhan (chữ cạnh chỗ đứt), nhan_gui (chữ trên người gửi) };
//            người gửi được khoanh vòng màu tot, dòng ngân hàng → người gửi vẫn chạy;
//   y: tâm theo chiều cao của hàng hình (mặc định 430; chân hình ở y + 130); x_ben: mảng hoành độ tâm từng khối có mặt
//   (mặc định 330, 960, 1590 cho ba khối; 560, 1360 cho hai khối); co_hinh: tỉ lệ hình (mặc định 1, hình cao khoảng 260);
//   vao: giây bắt đầu (mặc định 0); tinh: true hiện đủ trạng thái cuối (hạt tiền vẫn chạy theo t).
// Mặc định thời điểm: hình vào lúc vao, vao + 0,25, vao + 0,5; gốc vào vao + 1; gốc ra vao + 2,2; lãi vay vao + 3,4; lãi gửi vao + 4,4;
//   chênh lệch vao + 5,4; tách vao + 7; nhiều người vay vao + 9; mất vốn vao + 11. Bố cục chừa y 0–140 cho tiêu đề và y 960–1080 cho phụ đề.
// Trả về { el, seek(t), moc }: moc { gui, ngan_hang, vay: { tam, dinh, chan, nhan: { x, y, w, h } | null }, chenh_lech: { x, y, w, h }, tach: [{ x, y, w, h }],
//   luoi: [[x, y] tâm từng người vay nhỏ], dong: [{ dau, cuoi, giua }] (thứ tự: gốc vào, gốc ra, lãi vay, lãi gửi, dòng nào có), xong } — toạ độ sân khấu.
// Phần tử el là HTML phủ cả sân khấu: <svg> hình | <svg> dòng tiền, viền nét tay | lớp chữ HTML (data-hop) | <svg> hạt tiền, đồng xu, dấu gạch.
// Cần nạp trước: kho_nen, khach_hang_ca_nhan, toa_nha_ngan_hang, doanh_nghiep_nha_xuong, nha_o, xap_tien_dong_xu (hai kiểu phang, net_tay; toi_gian chỉ cần kho_nen).
// Dựng mới 02/11/2026 (lô N196–N205); 1.1 sửa 03/11/2026 theo phản hồi của N201, N198.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }
  const qd = (a, c, b, u) => { const v = 1 - u; return [v * v * a[0] + 2 * v * u * c[0] + u * u * b[0], v * v * a[1] + 2 * v * u * c[1] + u * u * b[1]]; };
  const qg = (a, c, b, u) => Math.atan2(2 * (1 - u) * (c[1] - a[1]) + 2 * u * (b[1] - c[1]), 2 * (1 - u) * (c[0] - a[0]) + 2 * u * (b[0] - c[0]));
  const mauQ = (a, c, b, n) => { const p = []; for (let k = 0; k <= n; k++) p.push(qd(a, c, b, k / n)); return p; };
  const mauC = (a, c1, c2, b, n) => {
    const p = [];
    for (let k = 0; k <= n; k++) { const u = k / n, v = 1 - u; p.push([0, 1].map((j) => v * v * v * a[j] + 3 * v * v * u * c1[j] + 3 * v * u * u * c2[j] + u * u * u * b[j])); }
    return p;
  };
  // đường gấp khúc có độ dài cộng dồn, để đặt hạt tiền theo quãng đường (tính bằng số, không đo DOM)
  function doDuong(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, L: cum[cum.length - 1] }; }
  function diemTren(dd, f) {
    const s = K.cl(f) * dd.L; let i = 1;
    while (i < dd.cum.length - 1 && dd.cum[i] < s) i++;
    const d0 = dd.cum[i - 1], d1 = dd.cum[i], p = d1 > d0 ? (s - d0) / (d1 - d0) : 0, a = dd.pts[i - 1], b = dd.pts[i];
    return [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
  }
  function diemHopTay(x, y, w, h, r) {
    const d = [], buoc = 90;
    const canh = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / buoc)); for (let i = 0; i < n; i++) d.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); };
    const goc = (cx, cy, a0) => { for (let i = 0; i < 3; i++) { const a = a0 + (Math.PI / 2) * i / 3; d.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    canh(x + r, y, x + w - r, y); goc(x + w - r, y + r, -Math.PI / 2);
    canh(x + w, y + r, x + w, y + h - r); goc(x + w - r, y + h - r, 0);
    canh(x + w - r, y + h, x + r, y + h); goc(x + r, y + h - r, Math.PI / 2);
    canh(x, y + h - r, x, y + r); goc(x + r, y + r, Math.PI);
    return d;
  }

  // ---------- hình tối giản (kiểu toi_gian): khối phẳng, gốc toạ độ ở chân, cùng kích thước chuẩn với hình của kho ----------
  // người 150×362, trụ sở ngân hàng 440×400, nhà xưởng 520×340, nhà phố 200×430. Nét viền theo net (không co giãn theo co).
  function hinhToiGian(loai, o, m, net, tinh) {
    const co = o.co, g = K.svg('g'), khoi = K.svg('g', { transform: `scale(${co})` }, g), than = K.svg('g', null, khoi);
    const vien = net.day > 0 ? (m[net.mau || 'chu'] || m.chu) : null;
    const ve = (tag, a, to) => K.svg(tag, Object.assign({ fill: to, stroke: vien, 'stroke-width': vien ? net.day : null, 'vector-effect': vien ? 'non-scaling-stroke' : null, 'stroke-linejoin': 'round' }, a), than);
    const nhat = (c, p) => K.tron(c, m.the, p);
    let W, H;
    if (loai === 'nguoi') {
      W = 150; H = 362;
      const chan = K.tron(m.chu_phu, m.chu, 0.35), ao = m[o.khoa_ao || 'nhan_phu'] || m.nhan_phu;
      ve('rect', { x: -46, y: -124, width: 40, height: 124, rx: 14 }, chan);
      ve('rect', { x: 6, y: -124, width: 40, height: 124, rx: 14 }, chan);
      ve('path', { d: 'M-75 -96 L-75 -192 Q-75 -252 -15 -252 L15 -252 Q75 -252 75 -192 L75 -96 Q75 -82 61 -82 L-61 -82 Q-75 -82 -75 -96 Z' }, ao);
      ve('circle', { cx: 0, cy: -310, r: 50 }, m.da);
    } else if (loai === 'ngan_hang') {
      W = 440; H = 400;
      ve('rect', { x: -220, y: -34, width: 440, height: 34 }, K.tron(m.nhan, m.chu, 0.3));
      ve('rect', { x: -190, y: -250, width: 380, height: 216 }, nhat(m.nhan, 0.78));
      [-132, -44, 44, 132].forEach((cx) => ve('rect', { x: cx - 22, y: -250, width: 44, height: 216 }, m.the));
      ve('rect', { x: -206, y: -284, width: 412, height: 34 }, nhat(m.nhan, 0.4));
      ve('path', { d: 'M-222 -284 L0 -400 L222 -284 Z' }, m.nhan);
    } else if (loai === 'doanh_nghiep') {
      W = 520; H = 340;
      ve('rect', { x: -206, y: -340, width: 46, height: 170 }, K.tron(m.chu_phu, m.the, 0.25));
      ve('path', { d: 'M-260 -196 L-260 -252 L-130 -196 L-130 -252 L0 -196 L0 -252 L130 -196 L130 -252 L260 -196 Z' }, m.nhan_phu);
      ve('rect', { x: -260, y: -198, width: 520, height: 198 }, nhat(m.nhan_phu, 0.78));
      ve('rect', { x: -62, y: -124, width: 124, height: 124 }, K.tron(m.nhan_phu, m.chu, 0.15));
    } else {   // nha
      W = 200; H = 430;
      ve('rect', { x: -100, y: -326, width: 200, height: 326 }, nhat(m.canh_bao, 0.72));
      ve('path', { d: 'M-118 -326 L0 -430 L118 -326 Z' }, m.nhan);
      ve('rect', { x: -32, y: -112, width: 64, height: 112 }, K.tron(m.canh_bao, m.chu, 0.25));
    }
    const vao = o.vao || 0;
    return {
      el: g, W: W * co, H: H * co,
      seek(t) {
        const s = tinh ? 1e6 : t - vao, p = K.spr(s, 0.5, 0.65);
        than.setAttribute('transform', Math.abs(p - 1) < 0.002 ? '' : `scale(1 ${Math.max(0, p).toFixed(4)})`);
        g.setAttribute('opacity', K.cl(s / 0.12).toFixed(3));
      },
    };
  }
  // chồng xu tối giản: mỗi đồng là một đĩa (elip), các chồng cách nhau 110, đồng rơi xuống lần lượt
  function xuToiGian(so, o, m, net, tinh) {
    const g = K.svg('g'), khoi = K.svg('g', { transform: `scale(${o.co})` }, g), ds = [];
    const vien = net.day > 0 ? (m[net.mau || 'chu'] || m.chu) : null;
    const toi = K.tron(m.canh_bao, m.chu, 0.25);
    so.forEach((n, j) => {
      const x = (j - (so.length - 1) / 2) * 110;
      for (let k = 0; k < n; k++) {
        const e = K.svg('g', null, khoi);
        K.svg('ellipse', { cx: x, cy: -14 - k * 14, rx: 48, ry: 15, fill: k === n - 1 ? m.canh_bao : toi, stroke: vien, 'stroke-width': vien ? net.day : null, 'vector-effect': vien ? 'non-scaling-stroke' : null }, e);
        ds.push({ e, t0: (o.vao || 0) + j * 0.2 + k * 0.08 });
      }
    });
    return {
      el: g,
      seek(t) {
        ds.forEach((d) => {
          const s = tinh ? 1e6 : t - d.t0, p = K.cl(s / 0.22);
          d.e.setAttribute('transform', p >= 1 ? '' : `translate(0 ${(-(1 - K.eo3(p)) * 60).toFixed(1)})`);
          d.e.setAttribute('opacity', K.cl(s / 0.08).toFixed(3));
        });
      },
    };
  }

  K.khuon_trung_gian_ba_khoi = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt);
    const kieu = ['net_tay', 'toi_gian'].includes(opt.kieu) ? opt.kieu : 'phang', tay = kieu === 'net_tay', tg = kieu === 'toi_gian';
    const net = Object.assign({ day: 0, mau: 'chu' }, opt.net || {});
    const tatChu = opt.chu === false;
    const C = (v) => (tatChu || v == null || v === false || v === '' ? null : String(v));   // chữ của một nhãn, null là không hiện
    const tinh = !!(opt.tinh || (opt.vao != null && opt.vao < 0));
    const vao = tinh ? 0 : (opt.vao || 0);
    const T = (x, md) => (tinh ? -100 : (x != null ? x : md));
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the;
    const nenChu = tg ? m.nen : nenThe;                    // nền dưới chữ: toi_gian chữ đặt thẳng trên nền khung
    const mauChu = duTuongPhan(m.chu, nenChu, 7), mauPhu = duTuongPhan(m.chu_phu, nenChu, 4.6);
    const Y = opt.y != null ? opt.y : 430, yDat = Y + 130, coHinh = opt.co_hinh || 1, MUC = 260 * coHinh;
    const bongDo = m.toi ? 0.35 : 0.1;

    const el = K.html('div', { class: 'kho-khuon-trung-gian', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;font-family:${K.PHONG};pointer-events:none;` });
    const lopSvg = () => K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const svgHinh = lopSvg();
    const gHinh = K.svg('g', null, svgHinh), gNhanh = K.svg('g', null, svgHinh), gLuoi = K.svg('g', null, svgHinh);
    const svgGiua = lopSvg();
    const gDong = K.svg('g', null, svgGiua);
    const lop = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);
    const svgTren = lopSvg();
    const gHat = K.svg('g', null, svgTren);

    // ----- khối có mặt và hoành độ -----
    const dsKhoi = [];
    if (opt.ben_gui) dsKhoi.push('gui');
    if (opt.ngan_hang !== false) dsKhoi.push('nh');
    if (opt.ben_vay) dsKhoi.push('vay');
    const xMacDinh = { 1: [960], 2: [560, 1360], 3: [330, 960, 1590] }[dsKhoi.length] || [];
    const X = {};
    dsKhoi.forEach((k, i) => { X[k] = (opt.x_ben && opt.x_ben[i] != null) ? opt.x_ben[i] : xMacDinh[i]; });
    const cauHinh = { gui: opt.ben_gui || {}, nh: opt.ngan_hang || {}, vay: opt.ben_vay || {} };
    const tHien = {};
    dsKhoi.forEach((k, i) => { tHien[k] = T(null, vao + i * 0.25); });

    // ----- một hình quanh gốc (chân) -----
    function motHinh(loai, o) {
      const chung = { kieu, mau: opt.mau, vao: o.vao, tinh, hat: o.hat };
      const muc = o.muc;
      const bien = C(o.bien) || '';      // biển trơn khi không truyền chữ
      if (loai === 'nguoi') {
        const co = muc / 362;
        if (tg) return hinhToiGian('nguoi', { co, vao: o.vao, khoa_ao: o.khoa_ao }, m, net, tinh);
        const r = K.khach_hang_ca_nhan(Object.assign({}, chung, { vai: o.vai || 'khach_hang', toc: o.toc, tu_the: o.tu_the || 'dung', huong: o.huong || 1, co }));
        return { el: r.el, seek: r.seek, H: 362 * co, W: 130 * co };
      }
      if (loai === 'doanh_nghiep') {
        const co = Math.min(muc / 340, (o.rong_toi_da || 340) / 520);
        if (tg) return hinhToiGian('doanh_nghiep', { co, vao: o.vao }, m, net, tinh);
        const r = K.doanh_nghiep_nha_xuong(Object.assign({}, chung, { loai: 'nha_xuong', nhan: bien, khoi: o.khoi !== false, co }));
        return { el: r.el, seek: r.seek, H: 340 * co, W: 520 * co };
      }
      if (loai === 'nha') {
        const co = muc / 430;
        if (tg) return hinhToiGian('nha', { co, vao: o.vao }, m, net, tinh);
        const r = K.nha_o(Object.assign({}, chung, { loai: 'nha_pho', co }));
        return { el: r.el, seek: r.seek, H: 430 * co, W: 200 * co };
      }
      // ngân hàng
      const l = tg ? 'tru_so' : (['tru_so', 'chi_nhanh', 'hoi_so'].includes(o.loai) ? o.loai : 'tru_so');
      const kt = { tru_so: [440, 400], chi_nhanh: [360, 260], hoi_so: [440, 640] }[l];
      const co = Math.min(muc * 1.06 / kt[1], 320 / kt[0]);
      if (tg) return hinhToiGian('ngan_hang', { co, vao: o.vao }, m, net, tinh);
      const r = K.toa_nha_ngan_hang(Object.assign({}, chung, { loai: l, nhan: bien, co }));
      return { el: r.el, seek: r.seek, H: kt[1] * co, W: kt[0] * co };
    }
    function taoKhoi(k) {
      const c = cauHinh[k], x = X[k];
      const boc = K.svg('g', null, gHinh), ds = [];
      const loai = k === 'nh' ? 'ngan_hang' : (c.hinh || (k === 'vay' ? 'doanh_nghiep' : 'nguoi'));
      const huong = k === 'vay' ? -1 : 1;
      const dat = (h, dx) => { h.el.setAttribute('transform', `translate(${dx.toFixed(1)} 0)`); boc.appendChild(h.el); ds.push(h); return h; };
      let W, H;
      if (loai === 'ca_hai') {
        const a = motHinh('nguoi', { muc: MUC * 0.84, vai: c.vai || 'chu_doanh_nghiep', toc: c.toc, tu_the: c.tu_the, huong, vao: tHien[k], hat: 31, khoa_ao: 'nhan' });
        const b = motHinh('doanh_nghiep', { muc: MUC * 0.84, rong_toi_da: 230 * coHinh, bien: c.bien, vao: tHien[k] + 0.15, hat: 37 });
        const lech = huong > 0 ? -1 : 1;     // người đứng phía ngân hàng
        dat(a, lech * (b.W / 2 + 6)); dat(b, -lech * (a.W / 2 + 10));
        W = a.W + b.W + 16; H = Math.max(a.H, b.H);
      } else {
        const h = motHinh(loai, { muc: MUC, vai: c.vai || 'khach_hang', toc: c.toc || (k === 'gui' ? 'dai' : 'ngan'), tu_the: c.tu_the, huong, loai: c.loai, bien: c.bien,
          vao: tHien[k], hat: k === 'gui' ? 11 : k === 'nh' ? 21 : 41, khoa_ao: k === 'vay' ? 'nhan' : 'nhan_phu' });
        dat(h, 0); W = h.W; H = h.H;
      }
      return { k, x, boc, ds, W, H, seek(t) { ds.forEach((h) => h.seek(t)); } };
    }
    const KHOI = {};
    dsKhoi.forEach((k) => { KHOI[k] = taoKhoi(k); });

    // ----- công cụ vẽ -----
    function duong(cha, a, c, b, o) {
      let d;
      if (tay) d = K.duongTay(mauQ(a, c, b, 14), { hat: o.hat || 950, lech: 1.2 });
      else d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${c[0].toFixed(1)} ${c[1].toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
      return K.svg('path', { d, fill: 'none', stroke: o.mau, 'stroke-width': o.day || 3, 'stroke-linecap': 'round', 'stroke-dasharray': o.dut || null, opacity: o.mo != null ? o.mo : null }, cha);
    }
    function veTuDiem(cha, pts, o) {
      const d = tay ? K.duongTay(pts, { hat: o.hat || 960, lech: 1.2 }) : pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' ');
      return K.svg('path', { d, fill: 'none', stroke: o.mau, 'stroke-width': o.day || 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cha);
    }
    function dauMuiTen(cha, mc, day) {
      return K.svg('path', { d: `M0 0 L${-day * 4.2} ${-day * 2.4} L${-day * 3.2} 0 L${-day * 4.2} ${day * 2.4} Z`, fill: mc, stroke: tay ? m.chu : 'none', 'stroke-width': tay ? 1.5 : 0, 'stroke-linejoin': 'round' }, cha);
    }
    function hatTien(cha, r, mc) {
      const g = K.svg('g', { opacity: 0 }, cha);
      if (tg) K.svg('circle', { r, fill: mc }, g);
      else {
        K.svg('circle', { r, fill: tay ? K.tron(mc, m.giay, 0.3) : mc, stroke: tay ? m.chu : K.tron(mc, '#000000', 0.35), 'stroke-width': 2 }, g);
        K.svg('circle', { r: r * 0.5, fill: 'none', stroke: K.tron(mc, '#000000', 0.3), 'stroke-width': 2 }, g);
      }
      return g;
    }
    function chayHat(g, viTri, tChay, ck, lech, pDau, pCuoi, an) {
      if (tChay <= 0 || an < 0.01) { g.setAttribute('opacity', 0); return; }
      const f = ((tChay / ck + lech) % 1 + 1) % 1, q = viTri(pDau + f * (pCuoi - pDau));
      g.setAttribute('transform', `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)})`);
      g.setAttribute('opacity', (Math.min(1, Math.sin(Math.PI * f) * 1.4) * K.cl(tChay / 0.4) * an).toFixed(3));
    }
    // hộp chứa chữ: phang nền CSS có bóng; net_tay viền bút chì đôi; toi_gian nền phẳng (mau_nen) hoặc không nền
    function hop(x, y, w, h, mc, hat, o) {
      o = o || {};
      const bo = o.bo != null ? o.bo : 16;
      let css = '';
      if (tg) { if (o.nen_tg) css = `background:${o.nen_tg};` + (net.day > 0 ? `border:${net.day}px solid ${m[net.mau] || m.chu};` : ''); }
      else if (!tay) css = `background:${nenThe};border:${o.vien_mong ? 2 : 3}px solid ${K.rgba(mc, o.vien_mong ? 0.35 : 0.6)};box-shadow:0 10px 26px ${K.rgba('#000000', bongDo)};`;
      const div = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;width:${w.toFixed(1)}px;height:${h.toFixed(1)}px;box-sizing:border-box;` +
        `border-radius:${bo}px;transform-origin:50% 50%;` + css }, lop);
      let g = null;
      if (tay) {
        g = K.svg('g', null, svgGiua);
        K.svg('path', { d: K.duongTay(diemHopTay(x + 7, y + 9, w, h, Math.min(bo, h / 2)), { hat, lech: 2.2, dong: true }) + 'Z', fill: K.rgba(m.chu, 0.08) }, g);
        K.svg('path', { d: K.duongTay(diemHopTay(x, y, w, h, Math.min(bo, h / 2)), { hat: hat + 1, lech: 1.8, dong: true }) + 'Z', fill: nenThe }, g);
        K.svg('path', { d: K.duongTay(diemHopTay(x, y, w, h, Math.min(bo, h / 2)), { hat: hat + 2, lech: 1.6, dong: true }), fill: 'none', stroke: o.vien_mong ? K.rgba(m.chu, 0.5) : m.chu, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
        if (o.dai) K.svg('path', { d: K.duongTay([[x + 20, y + 9], [x + w / 2, y + 11], [x + w - 20, y + 8]], { hat: hat + 3, lech: 1.1 }), fill: 'none', stroke: mc, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
      } else if (o.dai && !tg) K.html('div', { style: `position:absolute;left:16px;right:16px;top:0;height:7px;border-radius:0 0 6px 6px;background:${mc};` }, div);
      return { div, g, x, y, w, h };
    }
    function hienHop(h, t, t0, t1) {
      const tt = t - t0, a = K.eo3(K.tienDo(tt, 0, 0.35)) * (t1 != null ? 1 - K.eo3(K.tienDo(t, t1, 0.35)) : 1);
      const s = 0.88 + 0.12 * K.spr(tt, 0.5, 0.65);
      const tf = Math.abs(s - 1) < 0.004 ? 'none' : `scale(${s.toFixed(4)})`;   // đứng yên thì bỏ co giãn để chữ vẽ như nhau mọi thứ tự chụp
      h.div.style.opacity = a.toFixed(3); h.div.style.transform = tf;
      if (h.g) { h.g.setAttribute('opacity', a.toFixed(3)); const cx = h.x + h.w / 2, cy = h.y + h.h / 2; h.g.setAttribute('transform', tf === 'none' ? '' : `translate(${cx} ${cy}) scale(${s.toFixed(4)}) translate(${-cx} ${-cy})`); }
    }
    // nhãn hai dòng (chữ việc 28 px, chữ số 36 px), canh giữa tại (cx, cy)
    const CO_N = 28, CO_S = 36, CO_TEN = 30, CO_PHU = 28;
    function nhanHaiDong(nhan, so, cx, cy, mc, hat, oo) {
      oo = oo || {};
      const dong = [];
      if (nhan) K.xuongDong(nhan, oo.rong || 360, CO_N, 700).forEach((s) => dong.push({ s, co: CO_N, dam: 700, lh: 36, mau: mauChu }));
      if (so) dong.push({ s: so, co: CO_S, dam: 800, lh: 44, mau: duTuongPhan(mc, nenChu, 4.5) });
      if (!dong.length) return null;
      const w = Math.ceil(Math.max(...dong.map((d) => K.doChu(d.s, d.co, d.dam)))) + (tg ? 12 : 44), h = dong.reduce((s, d) => s + d.lh, 0) + (tg ? 4 : 16);
      const y0 = oo.duoi ? cy : (oo.tren ? cy - h : cy - h / 2);
      const H = hop(cx - w / 2, y0, w, h, mc, hat, { bo: 14, vien_mong: false });
      if (!tg && !tay) H.div.style.border = `2px solid ${K.rgba(mc, 0.6)}`;
      H.div.style.textAlign = 'center'; H.div.style.paddingTop = (tg ? 2 : 8) + 'px';
      dong.forEach((d) => K.html('div', { style: `white-space:nowrap;font-weight:${d.dam};font-size:${d.co}px;line-height:${d.lh}px;color:${d.mau};` }, H.div, d.s));
      return H;
    }

    // ----- nhãn tên dưới chân mỗi khối -----
    const NHAN = {};
    dsKhoi.forEach((k, i) => {
      const c = cauHinh[k], ten = C(c.ten), phu = C(c.phu);
      if (!ten && !phu) return;
      const dongT = ten ? K.xuongDong(ten, 340, CO_TEN, 800) : [], dongP = phu ? K.xuongDong(phu, 340, CO_PHU, 600) : [];
      const w = Math.ceil(Math.max(...dongT.map((s) => K.doChu(s, CO_TEN, 800)), ...dongP.map((s) => K.doChu(s, CO_PHU, 600)))) + (tg ? 12 : 48);
      const h = dongT.length * 38 + dongP.length * 34 + (tg ? 4 : 18);
      const H = hop(X[k] - w / 2, yDat + 12, w, h, m.chu, 1100 + i * 11, { bo: Math.min(h / 2, 30), vien_mong: true });
      H.div.style.textAlign = 'center'; H.div.style.paddingTop = (tg ? 2 : 9) + 'px';
      dongT.forEach((s) => K.html('div', { style: `white-space:nowrap;font-weight:800;font-size:${CO_TEN}px;line-height:38px;color:${mauChu};` }, H.div, s));
      dongP.forEach((s) => K.html('div', { style: `white-space:nowrap;font-weight:600;font-size:${CO_PHU}px;line-height:34px;color:${mauPhu};` }, H.div, s));
      H.t0 = T(null, tHien[k] + 0.3);
      NHAN[k] = H;
    });
    const dayNhan = (k) => (NHAN[k] ? NHAN[k].y + NHAN[k].h : yDat + 12);

    // ----- lưới nhiều người vay (tính chỗ trước để dòng lãi vay tránh nhánh của lưới) -----
    const nv = opt.nhieu_ben_vay && KHOI.vay ? opt.nhieu_ben_vay : null;
    const mv = opt.mat_von && KHOI.vay ? opt.mat_von : null;
    const tNhieu = nv ? T(nv.moc, vao + 9) : null, tMat = mv ? T(mv.moc, vao + 11) : null;
    let luoiCho = null;
    if (nv) {
      const so = K.cl(Math.round(nv.so || 8), 4, 12);
      const hang = so <= 8 ? 2 : 3, cot = Math.ceil(so / hang);
      const dx = Math.min(100, 440 / cot), dy = 100;
      const o = [];
      // lưới lệch sang phải một chút so với người vay đơn lẻ để điểm chia của nhánh nằm bên phải chỗ dòng lãi vay bắt đầu
      const xLuoi = Math.min(X.vay + 50, 1860 - ((cot - 1) / 2) * dx - 50);
      for (let i = 0; i < so; i++) {
        const r = Math.floor(i / cot), c = i % cot, soCotHang = r === hang - 1 ? so - cot * (hang - 1) : cot;
        o.push({ i, hang: r, cx: xLuoi + (c - (soCotHang - 1) / 2) * dx, chan: yDat - 10 - (hang - 1 - r) * dy });
      }
      const traiLuoi = Math.min(...o.map((d) => d.cx)) - 50;
      luoiCho = { so, hang, o, traiLuoi, xLuoi, S: null };
      const yRay0 = o[0].chan + 3, yRayN = o[o.length - 1].chan + 3;
      luoiCho.S = [traiLuoi - 44, (yRay0 + yRayN) / 2 - 20];
    }

    // ----- dòng tiền: gốc cong lên ở hàng trên, lãi cong xuống ở hàng dưới; nối cạnh hình -----
    const go = opt.goc || null, lv = opt.lai_vay || null, lg = opt.lai_gui || null;
    const yG = Y - 20, yL = Y + 62;
    const canh = (k, phai) => X[k] + (phai ? 1 : -1) * (KHOI[k].W / 2 + 18);
    const DONG = [];
    function themDong(tu, den, o) {
      const phai = X[den] > X[tu];
      let sx = canh(tu, phai), ex = canh(den, !phai);
      if (o.x_tu != null) sx = o.x_tu;
      const y = o.tren ? yG : yL, L = Math.abs(ex - sx);
      const s = [sx, y], e = [ex, y], c = [(sx + ex) / 2, y + (o.tren ? -1 : 1) * (o.co_nguoc ? 0.25 : 0.14) * L];
      const mc = m[o.khoa] || m.nhan;
      const g = K.svg('g', null, gDong);
      const ve = duong(g, s, c, e, { mau: mc, day: 5, hat: 900 + DONG.length * 7 });
      const mt = dauMuiTen(g, mc, 5);
      const hat = [0, 1, 2].map(() => hatTien(gHat, 12, m.canh_bao));
      const dinh = qd(s, c, e, 0.5);
      const nh = nhanHaiDong(C(o.nhan), C(o.so), dinh[0], o.tren ? dinh[1] - 16 : dinh[1] + 16, mc, 1200 + DONG.length * 9, { tren: o.tren, duoi: !o.tren, rong: Math.max(200, L - 20) });
      const d = { s, c, e, g, ve, mt, hat, nh, t0: o.moc, het: o.het };
      DONG.push(d);
      return d;
    }
    const coGN = KHOI.gui && KHOI.nh, coNV = KHOI.nh && KHOI.vay;
    if (go && coGN) themDong('gui', 'nh', { tren: true, co_nguoc: !!lg, nhan: go.nhan, so: go.so, khoa: 'nhan', moc: T(go.moc_vao, vao + 1.0) });
    if (go && coNV) themDong('nh', 'vay', { tren: true, co_nguoc: !!lv, nhan: go.nhan_ra != null ? go.nhan_ra : go.nhan, so: go.so_ra != null ? go.so_ra : go.so, khoa: 'nhan',
      moc: T(go.moc_ra, vao + 2.2), het: nv ? (tinh ? -99 : tNhieu + 0.2) : null });
    if (lv && coNV) themDong('vay', 'nh', { tren: false, co_nguoc: !!go, nhan: lv.nhan, so: lv.so, khoa: 'tot', moc: T(lv.moc, vao + 3.4),
      x_tu: luoiCho ? Math.min(canh('vay', false), luoiCho.S[0] - 24) : null, het: mv && !nv ? (tinh ? -99 : tMat) : null });
    if (lg && coGN) themDong('nh', 'gui', { tren: false, co_nguoc: !!go, nhan: lg.nhan, so: lg.so, khoa: 'tot', moc: T(lg.moc, vao + 4.4) });

    // ----- khối chênh lệch dưới ngân hàng -----
    const cl = opt.chenh_lech && KHOI.nh ? opt.chenh_lech : null;
    let CL = null;
    if (cl) {
      const tCL = T(cl.moc, vao + 5.4);
      const yHop = dayNhan('nh') + 46;
      const nhan = C(cl.nhan), so = C(cl.so), phu = C(cl.phu);
      const coN = 30, coS = 44;
      const rongD1 = (nhan ? K.doChu(nhan, coN, 700) : 0) + (so ? (nhan ? 16 : 0) + K.doChu(so, coS, 800) : 0);
      const dongP = phu ? K.xuongDong(phu, 380, CO_PHU, 600) : [];
      const rongP = dongP.length ? Math.max(...dongP.map((s) => K.doChu(s, CO_PHU, 600))) : 0;
      const coTach = Array.isArray(cl.tach) && cl.tach.length > 0;
      const rongChu = Math.ceil(Math.max(rongD1, rongP, coTach ? 200 : 0, 120));
      const rongXu = 120;
      const h1 = nhan || so ? 56 : 0;
      const w = rongChu + 48 + rongXu, h = 16 + h1 + dongP.length * 34 + (coTach ? 24 : 0) + 18 + (h1 || dongP.length ? 0 : 50);
      const x = X.nh - w / 2;
      const H = hop(x, yHop, w, h, m.canh_bao, 1300, { dai: true, nen_tg: K.tron(m.canh_bao, m.nen, 0.84) });
      const nenHop = tg ? K.tron(m.canh_bao, m.nen, 0.84) : nenThe;
      const noi = K.html('div', { style: `position:absolute;left:24px;top:16px;width:${rongChu}px;` }, H.div);
      if (h1) {
        const d1 = K.html('div', { style: `display:flex;align-items:baseline;gap:16px;white-space:nowrap;height:${h1}px;` }, noi);
        if (nhan) K.html('span', { style: `font-weight:700;font-size:${coN}px;line-height:${h1}px;color:${duTuongPhan(m.chu, nenHop, 7)};` }, d1, nhan);
        if (so) K.html('span', { style: `font-weight:800;font-size:${coS}px;line-height:${h1}px;color:${duTuongPhan(m.canh_bao, nenHop, 4.5)};` }, d1, so);
      }
      dongP.forEach((s) => K.html('div', { style: `font-weight:600;font-size:${CO_PHU}px;line-height:34px;color:${duTuongPhan(m.chu_phu, nenHop, 4.6)};white-space:nowrap;` }, noi, s));
      // đồng xu trong hộp, phía phải
      const xuTt = { kieu, mau: opt.mau, vao: T(null, tCL + 0.45), tinh, hat: 81, nhip: 0.09 };
      const xu = tg ? xuToiGian([3, 5], { co: 0.5, vao: T(null, tCL + 0.45) }, m, net, tinh)
        : K.xap_tien_dong_xu(Object.assign(xuTt, { loai: cl.loai_tien === 'xap_tien' ? 'xap_tien' : 'chong_xu', so: cl.loai_tien === 'xap_tien' ? [2] : [3, 5], co: cl.loai_tien === 'xap_tien' ? 0.42 : 0.5 }));
      const gXu = K.svg('g', null, svgTren);
      xu.el.setAttribute('transform', `translate(${(x + w - 24 - rongXu / 2).toFixed(1)} ${(yHop + h - 18).toFixed(1)})`);
      gXu.appendChild(xu.el);
      // mũi tên rơi xuống từ ngân hàng
      const a0 = [X.nh, dayNhan('nh') + 8], a1 = [X.nh, yHop - 10], am = [X.nh, (a0[1] + a1[1]) / 2];
      const gRoi = K.svg('g', null, svgGiua);
      const duongRoi = duong(gRoi, a0, am, a1, { mau: m.canh_bao, day: 5, hat: 1290 });
      const muiRoi = dauMuiTen(gRoi, m.canh_bao, 4);
      const hatRoi = [0, 1].map(() => hatTien(gHat, 10, m.canh_bao));
      // thanh chia và các phần tách
      let thanh = null, dsTach = [];
      const tTach = coTach ? T(cl.moc_tach, vao + 7.0) : null, nhip = cl.nhip_tach != null ? cl.nhip_tach : 0.5;
      if (coTach) {
        const tong = cl.tach.reduce((s, p) => s + Math.max(0, +p.gia_tri || 0), 0) || 1;
        const xt = x + 24, yt = yHop + h - 18 - 12, wt = rongChu;
        const KHOA = ['nhan_phu', 'xau', 'tot', 'canh_bao', 'nhan'];
        thanh = { nen: K.html('div', { style: `position:absolute;left:24px;top:${(yt - yHop).toFixed(1)}px;width:${wt}px;height:12px;border-radius:6px;background:${K.rgba(m.chu, 0.12)};overflow:hidden;` }, H.div) };
        let tichLuy = 0;
        const coTS = 34;
        const ds = cl.tach.map((p, i) => {
          const mc = m[p.khoa_mau || KHOA[i % KHOA.length]] || m.nhan;
          const chuSo = p.so === false ? null : C(p.so != null ? p.so : K.so(+p.gia_tri || 0));
          const dongN = C(p.nhan) ? K.xuongDong(C(p.nhan), 280, CO_N, 700) : [];
          const rongC = Math.max(0, ...dongN.map((s) => K.doChu(s, CO_N, 700)), chuSo ? K.doChu(chuSo, coTS, 800) : 0);
          const wi = Math.max(tg ? 90 : 110, Math.ceil(rongC) + 40);
          const hi = 16 + dongN.length * 36 + (chuSo ? 42 : 0) + 10 + (dongN.length || chuSo ? 0 : 30);
          const doan = K.html('div', { style: `position:absolute;top:0;height:12px;left:${(wt * tichLuy / tong).toFixed(1)}px;width:${(wt * Math.max(0, +p.gia_tri || 0) / tong).toFixed(1)}px;background:${mc};transform-origin:0 50%;` }, thanh.nen);
          const giua = xt + wt * (tichLuy + Math.max(0, +p.gia_tri || 0) / 2) / tong;
          tichLuy += Math.max(0, +p.gia_tri || 0);
          return { mc, chuSo, dongN, wi, hi, doan, giua };
        });
        const gian = 20, tongW = ds.reduce((s, d) => s + d.wi, 0) + gian * (ds.length - 1);
        const hMax = Math.max(...ds.map((d) => d.hi));
        let xc = K.cl(X.nh - tongW / 2, 40, 1880 - tongW);
        const yTach = yHop + h + 36;
        dsTach = ds.map((d, i) => {
          const nenO = K.tron(d.mc, m.nen, 0.82);
          const hp = hop(xc, yTach, d.wi, hMax, d.mc, 1400 + i * 10, { dai: true, nen_tg: nenO });
          const nenChuO = tg ? nenO : nenThe;
          Object.assign(hp.div.style, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingTop: tg ? '0' : '6px' });
          d.dongN.forEach((s) => K.html('div', { style: `font-weight:700;font-size:${CO_N}px;line-height:36px;color:${duTuongPhan(m.chu, nenChuO, 7)};white-space:nowrap;` }, hp.div, s));
          if (d.chuSo) K.html('div', { style: `font-weight:800;font-size:${coTS}px;line-height:42px;color:${duTuongPhan(d.mc, nenChuO, 4.5)};` }, hp.div, d.chuSo);
          const p0 = [d.giua, yHop + h + 4], p1 = [xc + d.wi / 2, yTach - 6], kc = (p1[1] - p0[1]) * 0.6;
          const gn = K.svg('g', null, svgGiua);
          const dn = veTuDiem(gn, mauC(p0, [p0[0], p0[1] + kc], [p1[0], p1[1] - kc], p1, 14), { mau: d.mc, day: 3.5, hat: 1450 + i * 7 });
          xc += d.wi + gian;
          return { hop: hp, doan: d.doan, duongNoi: dn, gNoi: gn, t0: T(null, tTach + i * nhip) };
        });
      }
      CL = { H, tCL, xu, gXu, duongRoi, muiRoi, hatRoi, a0, am, a1, thanh, dsTach, tTach };
    }

    // ----- lưới nhiều người vay -----
    let LUOI = null;
    if (luoiCho) {
      const vay = KHOI.vay, kieuNho = nv.hinh || 'tron', vong = ['nguoi', 'doanh_nghiep', 'nha'];
      const ds = luoiCho.o.map((d) => {
        const loai = kieuNho === 'tron' ? vong[(d.i + d.hang) % 3] : kieuNho;
        const t0 = T(null, tNhieu + 0.45 + d.i * 0.06);
        const h = motHinh(loai, { muc: loai === 'doanh_nghiep' ? 62 : 76, rong_toi_da: 84, bien: null, khoi: false, vai: 'khach_hang', toc: d.i % 2 ? 'dai' : 'ngan', huong: -1,
          vao: t0, hat: 500 + d.i * 3, khoa_ao: d.i % 2 ? 'nhan' : 'nhan_phu' });
        const boc = K.svg('g', { transform: `translate(${d.cx.toFixed(1)} ${d.chan.toFixed(1)})` }, gLuoi);
        boc.appendChild(h.el);
        return { h, boc, cx: d.cx, chan: d.chan, hang: d.hang, tam: [d.cx, d.chan - h.H / 2], t0 };
      });
      const dinhLuoi = Math.min(...ds.map((d) => d.chan - d.h.H));
      // một thân từ ngân hàng tới điểm chia bên trái lưới, rồi mỗi hàng một nhánh chạy dọc chân hàng đó (người vay đứng trên nhánh)
      const S = luoiCho.S, hangDs = [];
      ds.forEach((d) => { (hangDs[d.hang] = hangDs[d.hang] || []).push(d); });
      const yRay = hangDs.map((h) => h[0].chan + 3);
      const p0 = [canh('nh', true), Y - 10];
      const cThan = [(p0[0] + S[0]) / 2, Math.min(p0[1], S[1]) - 36];
      const ptsThan = mauQ(p0, cThan, S, 18);
      const gThan = K.svg('g', null, gNhanh);
      const than = veTuDiem(gThan, ptsThan, { mau: m.nhan, day: 5, hat: 1590 });
      const nhanhRay = (r) => mauC(S, [S[0] + 34, S[1]], [S[0] + 10, yRay[r]], [S[0] + 54, yRay[r]], 12);
      const nhanhHang = hangDs.map((h, r) => {
        const pts = nhanhRay(r).concat([[Math.max(...h.map((d) => d.cx)) + 30, yRay[r]]]);
        const g = K.svg('g', null, gNhanh);
        return { g, path: veTuDiem(g, pts, { mau: m.nhan, day: 3, hat: 1600 + r * 5 }), t0: T(null, tNhieu + 1.0 + r * 0.12) };
      });
      const nhanh = ds.map((d, i) => {
        const pts = ptsThan.concat(nhanhRay(d.hang).slice(1));
        if (d.cx > S[0] + 54) pts.push([d.cx, yRay[d.hang]]);
        return { dd: doDuong(pts), hat: hatTien(gHat, 8, m.canh_bao), t0: T(null, tNhieu + 1.6 + i * 0.05) };
      });
      const chuL = C(nv.nhan);
      const chuLuoi = chuL ? nhanHaiDong(chuL, null, luoiCho.xLuoi, Math.max(150, dinhLuoi - 14), m.nhan, 1650, { tren: true, rong: 440 }) : null;
      LUOI = { ds, nhanh, chuLuoi, dinhLuoi, than, gThan, nhanhHang, tThan: T(null, tNhieu + 0.5) };
    }

    // ----- mất vốn -----
    let MV = null;
    if (mv) {
      const nh = KHOI.nh;
      let tamNguon, hNguon, mucTieuMo;
      if (LUOI) {
        const d = LUOI.ds[K.cl(Math.round(mv.chi_so || 0), 0, LUOI.ds.length - 1)];
        tamNguon = [d.cx, d.chan - d.h.H * 0.55]; hNguon = d.h.H; mucTieuMo = d.boc;
      } else { const v = KHOI.vay; tamNguon = [v.x, yDat - v.H * 0.55]; hNguon = v.H; mucTieuMo = v.boc; }
      const s = [tamNguon[0] - 26, tamNguon[1] - hNguon * 0.2];
      const e = nh ? [X.nh + nh.W / 2 + 16, yDat - nh.H * 0.62] : [s[0] - 300, s[1]];
      const c = [(s[0] + e[0]) / 2, Math.min(s[1], e[1]) - 70];
      const g = K.svg('g', null, svgGiua);
      const mo = duong(g, s, c, e, { mau: m.xau, day: 4, dut: '3 12', mo: 0.45, hat: 1700 });        // nửa sau: chấm mờ, tiền không về
      const ve = duong(g, s, c, e, { mau: m.xau, day: 5, dut: '16 11', hat: 1701 });               // nửa đầu: nét đứt màu xấu
      // K.veDan ghi đè mẫu đứt, nên phần hiện của nét đứt điều khiển bằng mặt nạ: một đường trắng cùng hình, vẽ dần
      K._dem_trung_gian = (K._dem_trung_gian || 0) + 1;
      const idMat = 'kho-tg-mv-' + K._dem_trung_gian;
      const matNa = K.svg('mask', { id: idMat, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1080 }, K.defs(svgGiua));
      const mk = K.svg('path', { d: ve.getAttribute('d'), fill: 'none', stroke: '#FFFFFF', 'stroke-width': 20, 'stroke-linecap': 'butt' }, matNa);
      ve.setAttribute('mask', `url(#${idMat})`);
      const giua = qd(s, c, e, 0.5);
      const gX = K.svg('g', null, svgTren);
      if (tay) K.svg('path', { d: K.duongTay(diemHopTay(-26, -26, 52, 52, 24), { hat: 1710, lech: 1.4, dong: true }) + 'Z', fill: nenThe, stroke: m.xau, 'stroke-width': 3 }, gX);
      else K.svg('circle', { r: 26, fill: tg ? m.nen : nenThe, stroke: m.xau, 'stroke-width': 3 }, gX);
      K.svg('path', { d: tay ? K.duongTay([[-13, -13], [13, 13]], { hat: 1711, lech: 1 }) + ' ' + K.duongTay([[13, -13], [-13, 13]], { hat: 1712, lech: 1 }) : 'M-13 -13 L13 13 M13 -13 L-13 13',
        fill: 'none', stroke: m.xau, 'stroke-width': 6, 'stroke-linecap': 'round' }, gX);
      const gXV = K.svg('g', { transform: `translate(${tamNguon[0].toFixed(1)} ${tamNguon[1].toFixed(1)})` }, svgTren);
      const r = Math.max(22, hNguon * 0.36);
      const gachVay = K.svg('path', { d: tay ? K.duongTay([[-r, -r], [r, r]], { hat: 1713, lech: 1.4 }) + ' ' + K.duongTay([[r, -r], [-r, r]], { hat: 1714, lech: 1.4 }) : `M${-r} ${-r} L${r} ${r} M${r} ${-r} L${-r} ${r}`,
        fill: 'none', stroke: m.xau, 'stroke-width': 7, 'stroke-linecap': 'round' }, gXV);
      const hatMat = hatTien(gHat, 9, m.xau);
      // vòng khoanh người gửi: ngân hàng vẫn trả đủ cho người gửi
      let vong = null;
      if (KHOI.gui) {
        const kg = KHOI.gui, cx = kg.x, cy = (yDat - kg.H + dayNhan('gui')) / 2, rx = Math.max(kg.W, NHAN.gui ? NHAN.gui.w : 0) / 2 + 70, ry = (dayNhan('gui') - (yDat - kg.H)) / 2 + 30;
        const pts = []; for (let k = 0; k <= 40; k++) { const a = -Math.PI / 2 + (k / 40) * Math.PI * 2.08; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
        vong = K.svg('path', { d: tay ? K.duongTay(pts, { hat: 1720, lech: 2 }) : pts.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' '), fill: 'none', stroke: m.tot, 'stroke-width': 5, 'stroke-linecap': 'round' }, svgGiua);
      }
      const chu = C(mv.nhan);
      let cn = null;
      if (chu) {
        const wUoc = Math.ceil(Math.max(...K.xuongDong(chu, 440, CO_N, 700).map((x) => K.doChu(x, CO_N, 700)))) + 44;
        let cx = giua[0];
        const cy = Math.max(150, Math.min(giua[1], c[1]) - 30);
        if (LUOI && LUOI.chuLuoi) { const L = LUOI.chuLuoi; if (cy > L.y - 80 && cy - 80 < L.y + L.h && cx + wUoc / 2 > L.x - 16) cx = L.x - 16 - wUoc / 2; }
        cn = nhanHaiDong(chu, null, cx, cy, m.xau, 1730, { tren: true, rong: 440 });
      }
      const chuGui = C(mv.nhan_gui);
      const cg = chuGui && KHOI.gui ? nhanHaiDong(chuGui, null, X.gui, Math.max(150, yDat - KHOI.gui.H - 40), m.tot, 1740, { tren: true, rong: 380 }) : null;
      MV = { mo, ve, mk, gX, gXV, gachVay, hatMat, s, c, e, cn, cg, vong, mucTieuMo };
    }

    // ----- thời điểm xong -----
    const ketThuc = Object.keys(tHien).map((k) => tHien[k] + 1.2).concat(DONG.map((d) => d.t0 + 1.4));
    if (CL) { ketThuc.push(CL.tCL + 1.6); if (CL.dsTach.length) ketThuc.push(CL.dsTach[CL.dsTach.length - 1].t0 + 0.8); }
    if (LUOI) ketThuc.push(LUOI.nhanh[LUOI.nhanh.length - 1].t0 + 1.2, LUOI.ds[LUOI.ds.length - 1].t0 + 1);
    if (MV) ketThuc.push(tMat + 3.4);
    const xong = tinh ? 0 : Math.max(...ketThuc);

    function seek(t) {
      dsKhoi.forEach((k) => {
        const kh = KHOI[k];
        kh.seek(t);
        let s = 1, a = 1;
        if (k === 'vay' && LUOI) { const p = K.eio(K.tienDo(t, tNhieu, 0.6)); s = 1 - 0.45 * p; a = 1 - p; }
        if (k === 'vay' && MV && !LUOI) a = 1 - 0.6 * K.eo3(K.tienDo(t, tMat + 0.9, 0.5));
        kh.boc.setAttribute('transform', `translate(${kh.x} ${yDat}) scale(${s.toFixed(4)})`);
        kh.boc.setAttribute('opacity', a.toFixed(3));
        kh.boc.style.display = a < 0.005 ? 'none' : '';
        if (NHAN[k]) hienHop(NHAN[k], t, NHAN[k].t0);
      });
      DONG.forEach((d) => {
        const p = K.eio(K.tienDo(t, d.t0, 0.7)), an = d.het != null ? 1 - K.eo3(K.tienDo(t, d.het, 0.35)) : 1;
        d.g.setAttribute('opacity', an.toFixed(3));
        K.veDan(d.ve, p);
        const q = qd(d.s, d.c, d.e, p);
        d.mt.setAttribute('transform', `translate(${q[0].toFixed(1)} ${q[1].toFixed(1)}) rotate(${(qg(d.s, d.c, d.e, Math.max(0.01, p)) * 180 / Math.PI).toFixed(2)})`);
        d.mt.setAttribute('opacity', p > 0.02 ? 1 : 0);
        d.hat.forEach((g, i) => chayHat(g, (u) => qd(d.s, d.c, d.e, u), t - d.t0 - 0.7, 1.8, i / 3, 0.04, 0.9, an));
        if (d.nh) hienHop(d.nh, t, d.t0 + 0.42, d.het);
      });
      if (CL) {
        const p = K.eio(K.tienDo(t, CL.tCL, 0.45));
        K.veDan(CL.duongRoi, p);
        const tip = qd(CL.a0, CL.am, CL.a1, p);
        CL.muiRoi.setAttribute('transform', `translate(${tip[0].toFixed(1)} ${tip[1].toFixed(1)}) rotate(90)`);
        CL.muiRoi.setAttribute('opacity', p > 0.02 ? 1 : 0);
        CL.hatRoi.forEach((g, i) => chayHat(g, (u) => qd(CL.a0, CL.am, CL.a1, u), t - CL.tCL - 0.45, 1.4, i / 2, 0.05, 0.85, 1));
        hienHop(CL.H, t, CL.tCL + 0.3);
        CL.xu.seek(t);
        CL.gXu.setAttribute('opacity', K.eo3(K.tienDo(t, CL.tCL + 0.35, 0.3)).toFixed(3));
        if (CL.thanh) CL.thanh.nen.style.opacity = K.eo3(K.tienDo(t, CL.tTach - 0.2, 0.3)).toFixed(3);
        CL.dsTach.forEach((d) => {
          const pd = K.eio(K.tienDo(t, d.t0, 0.45));
          d.doan.style.transform = pd >= 1 ? 'none' : `scaleX(${pd.toFixed(4)})`;
          K.veDan(d.duongNoi, K.eio(K.tienDo(t, d.t0 + 0.1, 0.35)));
          d.gNoi.setAttribute('opacity', pd > 0.001 ? 1 : 0);
          hienHop(d.hop, t, d.t0 + 0.3);
        });
      }
      if (LUOI) {
        LUOI.ds.forEach((d) => {
          d.h.seek(t);
          const a = K.eo3(K.tienDo(t, d.t0, 0.25));
          d.boc.setAttribute('opacity', (MV && MV.mucTieuMo === d.boc ? a * (1 - 0.6 * K.eo3(K.tienDo(t, tMat + 0.9, 0.5))) : a).toFixed(3));
        });
        const pt = K.eio(K.tienDo(t, LUOI.tThan, 0.5));
        K.veDan(LUOI.than, pt); LUOI.gThan.setAttribute('opacity', pt > 0.001 ? 1 : 0);
        LUOI.nhanhHang.forEach((n) => { const p = K.eio(K.tienDo(t, n.t0, 0.6)); K.veDan(n.path, p); n.g.setAttribute('opacity', p > 0.001 ? 0.9 : 0); });
        LUOI.nhanh.forEach((n, i) => chayHat(n.hat, (u) => diemTren(n.dd, u), t - n.t0, 2.6, (i * 0.37) % 1, 0.02, 0.97, 1));
        if (LUOI.chuLuoi) hienHop(LUOI.chuLuoi, t, T(null, tNhieu + 0.9));
      }
      if (MV) {
        K.veDan(MV.mk, K.eio(K.tienDo(t, tMat, 0.6)) * 0.46);
        MV.mo.setAttribute('opacity', (0.45 * K.eo3(K.tienDo(t, tMat + 0.5, 0.4))).toFixed(3));
        const g0 = qd(MV.s, MV.c, MV.e, 0.5), sx = 0.6 + 0.4 * K.spr(t - tMat - 0.5, 0.45, 0.6);
        MV.gX.setAttribute('opacity', K.eo3(K.tienDo(t, tMat + 0.5, 0.3)).toFixed(3));
        MV.gX.setAttribute('transform', `translate(${g0[0].toFixed(1)} ${g0[1].toFixed(1)})` + (Math.abs(sx - 1) < 0.002 ? '' : ` scale(${sx.toFixed(4)})`));
        K.veDan(MV.gachVay, K.eio(K.tienDo(t, tMat + 0.9, 0.5)));
        MV.gXV.setAttribute('opacity', K.tienDo(t, tMat + 0.9, 0.05) > 0 ? 1 : 0);
        chayHat(MV.hatMat, (u) => qd(MV.s, MV.c, MV.e, u), t - tMat - 0.8, 1.6, 0, 0.03, 0.42, 1);
        if (MV.vong) { const pv = K.eio(K.tienDo(t, tMat + 0.9, 0.6)), an = tinh ? 1 : 1 - K.eo3(K.tienDo(t, tMat + 3.4, 0.4)); K.veDan(MV.vong, pv); MV.vong.setAttribute('opacity', (pv > 0.001 ? an : 0).toFixed(3)); }
        if (MV.cn) hienHop(MV.cn, t, T(null, tMat + 0.7));
        if (MV.cg) hienHop(MV.cg, t, T(null, tMat + 1.1));
      }
    }

    const mocKhoi = (k) => {
      const kh = KHOI[k];
      if (!kh) return null;
      return { tam: [kh.x, yDat - kh.H / 2], dinh: [kh.x, yDat - kh.H], chan: [kh.x, yDat], nhan: NHAN[k] ? { x: NHAN[k].x, y: NHAN[k].y, w: NHAN[k].w, h: NHAN[k].h } : null };
    };
    return {
      el, seek,
      moc: {
        gui: mocKhoi('gui'), ngan_hang: mocKhoi('nh'), vay: mocKhoi('vay'),
        chenh_lech: CL ? { x: CL.H.x, y: CL.H.y, w: CL.H.w, h: CL.H.h } : null,
        tach: CL ? CL.dsTach.map((d) => ({ x: d.hop.x, y: d.hop.y, w: d.hop.w, h: d.hop.h })) : [],
        luoi: LUOI ? LUOI.ds.map((d) => d.tam) : [],
        dong: DONG.map((d) => ({ dau: d.s, cuoi: d.e, giua: qd(d.s, d.c, d.e, 0.5) })),
        xong,
      },
    };
  };
})();
