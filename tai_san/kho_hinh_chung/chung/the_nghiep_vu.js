// chung/the_nghiep_vu.js — 1.0 — thẻ nghiệp vụ: thẻ chữ nhỏ có đĩa biểu tượng bên trái (vay, tiết kiệm, thẻ, chuyển tiền, kiều hối, bảo hiểm, ngoại hối...),
// hiện bằng lò xo, tô sáng theo mốc (nhấc lên, viền đậm), ẩn theo mốc; kèm hàm xếp nhiều thẻ thành hàng, cột, lưới và hàm vẽ riêng một biểu tượng.
// Dùng cho: gói sản phẩm của cán bộ tín dụng doanh nghiệp, cá nhân; nhãn mảng kinh doanh; nhãn khối; các cách phân loại khoản vay; đầu việc.
// Là phần tử nền của chuoi_gia_tri_doanh_nghiep và ngoi_nha_gia_dinh_nhu_cau.
// Gọi: KHO.the_nghiep_vu({ chu, phu, bieu_tuong, khoa_mau, kieu, x, y, neo, co, rong_chu, vao, moc_to, het_to, het, tinh, hat, mau });
//   chu: chữ chính (đậm 26 px ở co 1, tự xuống dòng trong rong_chu, mặc định 300 px); phu: dòng nhỏ 20 px (không bắt buộc);
//   bieu_tuong: tên trong KHO.BIEU_TUONG_NGHIEP_VU (danh sách dưới), false là không đĩa biểu tượng; khoa_mau: khoá màu của đĩa và viền (mặc định 'nhan');
//   kieu 'phang' (nền thẻ, viền mảnh, bóng mềm) | 'net_tay' (nền giấy, viền chì đôi, đĩa tô loang) | 'vien' (chỉ nét viền mảnh, nền trong, cho CL-03);
//   x, y: toạ độ sân khấu 1920×1080; neo 'tam' (mặc định: x, y là tâm thẻ) | 'trai' (x là mép trái, y là giữa) | 'trai_tren' (góc trên trái);
//   co: tỉ lệ (mặc định 1); vao: giây hiện (-1 hiện đủ); moc_to, het_to: giây bắt đầu, thôi tô sáng; het: giây ẩn; tinh: true hiện đủ; hat: hạt giống nét tay.
// Trả về { el, seek(t), moc: { x, y, w, h, tam, trai, phai, tren, duoi, xong } } — toạ độ sân khấu. el là div đặt tuyệt đối (hợp đồng mục 7), có data-hop.
// KHO.the_nghiep_vu.do(opt) → { w, h } tính trước kích thước (không tạo phần tử), để khuôn khác dàn bố cục.
// KHO.nhom_the_nghiep_vu({ the: [opt...], x, y, huong: 'ngang' | 'doc' | 'luoi', cot, khoang, rong_deu, canh: 'trai' | 'giua', kieu, khoa_mau, co, vao, nhip, moc_hien, tinh })
//   xếp nhiều thẻ: (x, y) là góc trên trái cả nhóm (canh 'giua': x là tâm ngang); mỗi thẻ kế thừa kieu, khoa_mau, co của nhóm nếu không tự khai;
//   moc_hien: mảng giây hiện từng thẻ (mặc định vao + i × nhip, nhip 0,25); rong_deu: true cho mọi thẻ cùng bề ngang (mặc định với 'doc', 'luoi').
//   Trả về { el, seek(t), moc: { the: [moc từng thẻ], x, y, w, h, xong } }.
// KHO.bieu_tuong_nghiep_vu(ten, { co, mau_net, day }) → <g> SVG biểu tượng nét trong ô 48 × 48 quanh gốc (dùng riêng trong cảnh SVG).
// Biểu tượng: vay, huy_dong, tiet_kiem, the, chuyen_tien, kieu_hoi, bao_hiem, ngoai_hoi, thanh_toan_quoc_te, bao_lanh, hop_dong, tai_khoan,
//   ngan_hang_dien_tu, nha, o_to, hoc, kinh_doanh, luong, tham_dinh, giai_ngan, bao_cao, dau_tu, nguoi, nha_may, ngan_hang, kho_hang, canh_bao, dong_ho.
// Dựng mới (03/11/2026, rà lô N196–N205). Không logo, không tên sản phẩm thương mại của ngân hàng nào; chữ là tham số.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // Biểu tượng nét trong ô 48 × 48, gốc ở tâm (−24..24). Chỉ đường nét, không tô (trừ chấm nhỏ).
  const BT = {
    vay: 'M-22 -10 H6 V10 H-22 Z M-12 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M11 0 H22 M16 -5 L22 0 L16 5',
    huy_dong: 'M-18 -2 V18 H18 V-2 M0 -21 V8 M-7 1 L0 8 L7 1',
    tiet_kiem: 'M-14 12 a14 5 0 1 0 28 0 a14 5 0 1 0 -28 0 M-14 12 V17 M14 12 V17 M-14 17 a14 5 0 0 0 28 0 M-14 0 a14 5 0 1 0 28 0 a14 5 0 1 0 -28 0 M-14 0 V7 M14 0 V7 M-14 -12 a14 5 0 1 0 28 0 a14 5 0 1 0 -28 0 M-14 -12 V-5 M14 -12 V-5',
    the: 'M-22 -14 H22 V14 H-22 Z M-22 -6 H22 M-16 6 H-4',
    chuyen_tien: 'M-20 -7 H18 M11 -14 L18 -7 L11 0 M20 7 H-18 M-11 0 L-18 7 L-11 14',
    kieu_hoi: 'M-20 -4 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M-20 -4 H8 M-6 -18 C-13 -10 -13 2 -6 10 M-6 -18 C1 -10 1 2 -6 10 M10 12 L21 21 M21 13 V21 H13',
    bao_hiem: 'M0 -22 L18 -15 V0 C18 12 9 19 0 22 C-9 19 -18 12 -18 0 V-15 Z M-8 0 L-2 6 L9 -6',
    ngoai_hoi: 'M-20 -6 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 M-2 8 a11 11 0 1 0 22 0 a11 11 0 1 0 -22 0 M-13 -6 H-5 M5 8 H13 M9 4 V12',
    thanh_toan_quoc_te: 'M-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0 M-18 0 H18 M0 -18 C-10 -8 -10 8 0 18 M0 -18 C10 -8 10 8 0 18 M-15 -9 H15 M-15 9 H15',
    bao_lanh: 'M-16 -22 H8 L16 -14 V22 H-16 Z M8 -22 V-14 H16 M-10 -10 H4 M-10 -2 H8 M-3 12 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0',
    hop_dong: 'M-16 -22 H8 L16 -14 V22 H-16 Z M8 -22 V-14 H16 M-10 -8 H10 M-10 0 H10 M-10 8 H4',
    tai_khoan: 'M-20 -12 H16 V18 H-20 Z M-20 -12 L10 -21 V-12 M6 0 H20 V8 H6 Z',
    ngan_hang_dien_tu: 'M-11 -22 H11 V22 H-11 Z M-4 16 H4 M-11 -15 H11 M-11 10 H11 M-5 -4 L-1 0 L6 -7',
    nha: 'M-21 -2 L0 -20 L21 -2 M-15 -7 V20 H15 V-7 M-5 20 V8 H5 V20',
    o_to: 'M-22 8 V0 L-14 -2 L-8 -12 H8 L14 -2 L22 0 V8 H-22 M-17 8 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M7 8 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0 M-12 -2 H14',
    hoc: 'M-22 -6 L0 -16 L22 -6 L0 4 Z M-12 -2 V10 C-6 16 6 16 12 10 V-2 M22 -6 V8',
    kinh_doanh: 'M-20 -18 H20 L22 -6 H-22 Z M-22 -6 C-22 0 -11 0 -11 -6 C-11 0 0 0 0 -6 C0 0 11 0 11 -6 C11 0 22 0 22 -6 M-18 -2 V20 H18 V-2 M-6 20 V8 H6 V20',
    luong: 'M-20 -12 H20 V14 H-20 Z M-20 -12 L0 4 L20 -12',
    tham_dinh: 'M-18 -6 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M3 3 L20 20',
    giai_ngan: 'M-20 -21 H20 V-3 H-20 Z M-4 -12 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0 M0 3 V22 M-7 15 L0 22 L7 15',
    bao_cao: 'M-21 20 H21 M-14 20 V4 M-4 20 V-8 M6 20 V-2 M16 20 V-16',
    dau_tu: 'M-20 14 L-6 0 L2 8 L20 -12 M10 -12 H20 V-2 M-20 21 H20',
    nguoi: 'M-8 -10 a8 8 0 1 0 16 0 a8 8 0 1 0 -16 0 M-16 21 C-16 5 16 5 16 21',
    nha_may: 'M-22 20 V-2 L-10 -10 V-2 L2 -10 V-2 L14 -10 V-21 H20 V20 Z M-15 10 H-7 M1 10 H9',
    ngan_hang: 'M-21 -8 L0 -20 L21 -8 Z M-16 -4 V14 M-6 -4 V14 M6 -4 V14 M16 -4 V14 M-22 19 H22',
    kho_hang: 'M-20 20 V0 H0 V20 Z M0 20 V0 H20 V20 Z M-10 0 V-20 H10 V0 M-10 10 H-10 M-14 6 H-6 M6 6 H14 M-4 -14 H4',
    canh_bao: 'M0 -20 L21 18 H-21 Z M0 -6 V6 M0 11 V12',
    dong_ho: 'M-20 0 a20 20 0 1 0 40 0 a20 20 0 1 0 -40 0 M0 -12 V0 L9 7',
  };
  K.BIEU_TUONG_NGHIEP_VU = Object.keys(BT);

  K.bieu_tuong_nghiep_vu = function (ten, o) {
    o = o || {};
    const co = o.co || 1, g = K.svg('g', { transform: co !== 1 ? `scale(${co})` : null });
    const d = BT[ten];
    if (!d) throw new Error('bieu_tuong_nghiep_vu: không có biểu tượng ' + ten);
    K.svg('path', { d, fill: 'none', stroke: o.mau_net || K.mau.chu, 'stroke-width': o.day || 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  };

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

  // Kích thước tính bằng số (không đo DOM).
  function kichThuoc(opt) {
    const co = opt.co || 1, coC = 26 * co, coP = 20 * co, lhC = 32 * co, lhP = 26 * co;
    const coIcon = opt.bieu_tuong === false || opt.bieu_tuong == null ? 0 : 56 * co;
    const rongToiDa = (opt.rong_chu || 300) * co;
    const dongC = K.xuongDong(opt.chu || '', rongToiDa, coC, 800), dongP = opt.phu ? K.xuongDong(opt.phu, rongToiDa, coP, 600) : [];
    const rongChu = Math.max(...dongC.map((s) => K.doChu(s, coC, 800)), ...(dongP.length ? dongP.map((s) => K.doChu(s, coP, 600)) : [0]));
    const padX = 20 * co, padY = 12 * co, gap = coIcon ? 14 * co : 0, padL = coIcon ? 12 * co : padX;
    const caoChu = dongC.length * lhC + dongP.length * lhP;
    const w = Math.ceil(padL + coIcon + gap + rongChu + padX + 2);
    const h = Math.ceil(Math.max(coIcon, caoChu) + padY * 2);
    return { w, h, co, coC, coP, lhC, lhP, coIcon, dongC, dongP, padL, gap, caoChu };
  }

  K.the_nghiep_vu = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu || 'phang', tay = kieu === 'net_tay', vien = kieu === 'vien';
    const tinh = !!(opt.tinh || opt.vao === -1), t0 = tinh ? -100 : (opt.vao || 0);
    const kt = kichThuoc(opt);
    const w = Math.max(kt.w, opt.rong_deu || 0), h = Math.max(kt.h, opt.cao_deu || 0), co = kt.co;
    const neo = opt.neo || 'tam';
    const x0 = neo === 'tam' ? (opt.x || 0) - w / 2 : (opt.x || 0);
    const y0 = neo === 'trai_tren' ? (opt.y || 0) : (opt.y || 0) - h / 2;
    const mc = m[opt.khoa_mau || 'nhan'] || m.nhan;
    const nenThe = vien ? m.nen : (tay ? K.tron(m.the, m.giay, m.toi ? 0.12 : 0.5) : m.the);
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6);
    const r = 16 * co;

    const el = K.html('div', { class: 'kho-the-nghiep-vu', 'data-hop': '1', style: `position:absolute;left:${x0.toFixed(1)}px;top:${y0.toFixed(1)}px;width:${w}px;height:${h}px;box-sizing:border-box;` +
      `font-family:${K.PHONG};transform-origin:50% 60%;border-radius:${r}px;` +
      (tay ? '' : vien ? `border:${(2 * co).toFixed(1)}px solid ${mc};` : `background:${nenThe};border:${(2 * co).toFixed(1)}px solid ${K.rgba(mc, 0.5)};box-shadow:0 ${(8 * co).toFixed(0)}px ${(20 * co).toFixed(0)}px ${K.rgba('#000000', m.toi ? 0.35 : 0.1)};`) });
    // lớp SVG: viền nét tay, đĩa biểu tượng
    const pad = 12;
    const svg = K.svg('svg', { width: w + pad * 2, height: h + pad * 2, style: `position:absolute;left:${-pad}px;top:${-pad}px;overflow:visible;pointer-events:none;` }, el);
    const g = K.svg('g', { transform: `translate(${pad} ${pad})` }, svg);
    let vienTay = null;
    if (tay) {
      const hat = opt.hat || 31;
      K.svg('path', { d: K.duongTay(diemHop(5 * co, 7 * co, w, h, r, 60), { hat: hat + 1, lech: 1.8, dong: true }) + 'Z', fill: K.rgba(m.chu, m.toi ? 0.18 : 0.07) }, g);
      K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, r, 60), { hat: hat + 2, lech: 1.6, dong: true }) + 'Z', fill: nenThe }, g);
      vienTay = K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, r, 50), { hat: hat + 3, lech: 1.5, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4 * co, 'stroke-linecap': 'round' }, g);
    }
    if (kt.coIcon) {
      const cx = kt.padL + kt.coIcon / 2, cy = h / 2, rr = kt.coIcon / 2;
      const gi = K.svg('g', null, g);
      let mauNet;
      if (vien) { K.svg('circle', { cx, cy, r: rr - 1.5 * co, fill: 'none', stroke: mc, 'stroke-width': 2 * co }, gi); mauNet = duTuongPhan(mc, m.nen, 3); }
      else if (tay) {
        const to = K.tron(mc, m.giay, m.toi ? 0.1 : 0.45);
        K.svg('path', { d: K.duongTay(diemTron(cx, cy, rr, 18), { hat: (opt.hat || 31) + 5, lech: 1.4, dong: true }) + 'Z', fill: to, stroke: m.chu, 'stroke-width': 2 * co }, gi);
        mauNet = K.chuTren(to, '#FFFFFF', '#1A1A1A');
      } else { K.svg('circle', { cx, cy, r: rr, fill: mc }, gi); mauNet = K.chuTren(mc, '#FFFFFF', '#141414'); }
      const ic = K.bieu_tuong_nghiep_vu(opt.bieu_tuong, { co: (kt.coIcon / 48) * 0.62, mau_net: mauNet, day: 3.6 });
      const gic = K.svg('g', { transform: `translate(${cx} ${cy})` }, gi);
      gic.appendChild(ic);
      if (tay) gi.setAttribute('filter', K.locNetTay(svg, { hat: (opt.hat || 31) % 9 + 1, do_run: 1.2 }));
    }
    // chữ
    const xChu = kt.padL + kt.coIcon + kt.gap;
    const khoiChu = K.html('div', { style: `position:absolute;left:${xChu}px;top:${((h - kt.caoChu) / 2).toFixed(1)}px;right:${(18 * co).toFixed(0)}px;` }, el);
    kt.dongC.forEach((s) => K.html('div', { style: `font-weight:800;font-size:${kt.coC}px;line-height:${kt.lhC}px;color:${mauChu};white-space:nowrap;` }, khoiChu, s));
    kt.dongP.forEach((s) => K.html('div', { style: `font-weight:600;font-size:${kt.coP}px;line-height:${kt.lhP}px;color:${mauPhu};white-space:nowrap;` }, khoiChu, s));

    const xong = tinh ? 0 : t0 + 0.6;
    function seek(t) {
      const tt = t - t0;
      let a = tinh ? 1 : K.eo3(K.tienDo(tt, 0, 0.3));
      const sc = tinh ? 1 : 0.7 + 0.3 * K.spr(tt, 0.5, 0.62);
      if (opt.het != null) a *= 1 - K.eo3(K.tienDo(t, opt.het, 0.35));
      let to = 0;
      if (opt.moc_to != null) to = K.eo3(K.tienDo(t, opt.moc_to, 0.35)) * (opt.het_to != null ? 1 - K.eo3(K.tienDo(t, opt.het_to, 0.35)) : 1);
      el.style.opacity = a.toFixed(3);
      el.style.transform = `translate(0px, ${(-8 * co * to).toFixed(2)}px) scale(${(sc * (1 + 0.04 * to)).toFixed(4)})`;
      if (tay) { vienTay.setAttribute('stroke', K.tron(m.chu, mc, to)); vienTay.setAttribute('stroke-width', (2.4 + 2.6 * to) * co); }
      else if (vien) el.style.borderWidth = ((2 + 2 * to) * co).toFixed(2) + 'px';
      else {
        el.style.borderColor = K.tron(K.tron(nenThe, mc, 0.5), mc, to);
        el.style.borderWidth = ((2 + 1.5 * to) * co).toFixed(2) + 'px';
        el.style.boxShadow = `0 ${((8 + 10 * to) * co).toFixed(1)}px ${((20 + 14 * to) * co).toFixed(1)}px ${K.rgba(to > 0.01 ? mc : '#000000', m.toi ? 0.35 : 0.1 + 0.18 * to)}`;
      }
    }
    return { el, seek, moc: { x: x0, y: y0, w, h, tam: [x0 + w / 2, y0 + h / 2], trai: [x0, y0 + h / 2], phai: [x0 + w, y0 + h / 2], tren: [x0 + w / 2, y0], duoi: [x0 + w / 2, y0 + h], xong } };
  };
  K.the_nghiep_vu.do = function (opt) { const k = kichThuoc(opt || {}); return { w: k.w, h: k.h }; };

  K.nhom_the_nghiep_vu = function (opt) {
    opt = opt || {};
    const ds = (opt.the || []).map((o) => Object.assign({ kieu: opt.kieu, khoa_mau: opt.khoa_mau, co: opt.co, rong_chu: opt.rong_chu, mau: opt.mau }, o));
    const huong = opt.huong || 'ngang', khoang = opt.khoang != null ? opt.khoang : 16;
    const cot = huong === 'ngang' ? ds.length : huong === 'doc' ? 1 : (opt.cot || 2);
    const kt = ds.map((o) => K.the_nghiep_vu.do(o));
    const deu = opt.rong_deu != null ? opt.rong_deu : huong !== 'ngang';
    const wMax = Math.max(0, ...kt.map((k) => k.w)), hMax = Math.max(0, ...kt.map((k) => k.h));
    const soHang = Math.ceil(ds.length / cot);
    const rongCot = []; for (let c = 0; c < cot; c++) rongCot.push(deu ? wMax : Math.max(0, ...kt.filter((_, i) => i % cot === c).map((k) => k.w)));
    const W = rongCot.reduce((a, b) => a + b, 0) + khoang * (cot - 1), H = soHang * hMax + khoang * (soHang - 1);
    const X = opt.canh === 'giua' ? (opt.x || 0) - W / 2 : (opt.x || 0), Y = opt.y || 0;
    const tinh = !!(opt.tinh || opt.vao === -1), vao = opt.vao || 0, nhip = opt.nhip != null ? opt.nhip : 0.25;
    const el = K.html('div', { class: 'kho-nhom-the-nghiep-vu', style: 'position:absolute;left:0;top:0;width:0;height:0;' });
    const the = ds.map((o, i) => {
      const c = i % cot, hg = Math.floor(i / cot);
      let x = X; for (let k = 0; k < c; k++) x += rongCot[k] + khoang;
      const y = Y + hg * (hMax + khoang);
      const vaoI = tinh ? -1 : (o.vao != null ? o.vao : (opt.moc_hien && opt.moc_hien[i] != null ? opt.moc_hien[i] : vao + i * nhip));
      const h = K.the_nghiep_vu(Object.assign({}, o, { x, y: y + hMax / 2, neo: 'trai', vao: vaoI, tinh: tinh || o.tinh, rong_deu: deu ? rongCot[c] : 0, cao_deu: hMax }));
      el.appendChild(h.el);
      return h;
    });
    return { el, seek(t) { the.forEach((h) => h.seek(t)); }, moc: { the: the.map((h) => h.moc), x: X, y: Y, w: W, h: H, xong: Math.max(0, ...the.map((h) => h.moc.xong)) } };
  };
})();
