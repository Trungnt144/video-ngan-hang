// chung/khuon_cong_thuc.js — 1.0 — khuôn công thức tách từng ký hiệu: vế trái, dấu bằng, vế phải là phân số (tử số trên, mẫu số dưới)
// hoặc một dãy số hạng; mỗi số hạng là một ô có màu riêng, hiện lần lượt theo lời đọc, có thể đổi chữ thành số (thay số vào công thức),
// tô sáng từng ô, cuối cùng hiện kết quả và vế so sánh với ngưỡng (ví dụ CAR ≥ 8%).
// Dùng cho: CAR = vốn tự có / RWA; vốn tự có = cấp 1 + cấp 2 − giảm trừ; dự phòng = (dư nợ − giá trị tài sản bảo đảm khấu trừ) × tỉ lệ; RWA = tài sản × hệ số; LDR...
// Gọi: KHO.khuon_cong_thuc_tach_ky_hieu({ ten, tu, mau, ket_qua, so_sanh, dong_nho, tieu_de, kieu, mau_sac, x, y, rong, co, vao, tinh,
//                                         moc_hien, moc_so, moc_ket_qua, moc_so_sanh });  bí danh KHO.khuon_cong_thuc.
//   ten: vế trái — chuỗi hoặc { chu, phu, so } (ví dụ 'CAR');
//   tu: mảng ký hiệu của tử số (hoặc của cả vế phải khi không có mau). Phần tử là dấu ('+', '−', '×', '÷', '(', ')') hoặc số hạng:
//       chuỗi, hoặc { chu, phu (dòng giải thích nhỏ dưới ô), so (chữ thay vào khi đổi sang số), khoa_mau (mặc định xoay vòng nhan, nhan_phu, tot, canh_bao),
//                     to (giây bắt đầu tô sáng ô), het_to (giây thôi tô), moc_so (giây đổi sang số riêng ô này) };
//   mau: mảng ký hiệu của mẫu số (bỏ trống thì vế phải là một dãy, không có gạch phân số);
//   ket_qua: chữ kết quả (ví dụ '12,5%'), hiện sau dấu bằng thứ hai; so_sanh: { dau: '≥', chu: '8%', phu: 'mức tối thiểu' };
//   dong_nho, tieu_de: dòng nhỏ và tiêu đề phía trên (tuỳ chọn); co: cỡ chữ ô (mặc định 44, tự thu nhỏ cả khối khi vượt rong);
//   x, y, rong: góc trên trái và bề ngang khối trong sân khấu 1920×1080 (mặc định 140, 300, 1640); khối căn giữa trong bề ngang này;
//   kieu 'phang' | 'net_tay'; mau_sac: ghi đè màu (giống opt.mau của các hình khác; tên khác vì 'mau' là mẫu số);
//   vao: giây bắt đầu; tinh: true hiện đủ; moc_hien: mảng giây hiện từng số hạng theo thứ tự ten, tu, mau (dấu hiện cùng số hạng đứng trước nó);
//   moc_so: giây bắt đầu đổi chữ sang số cho mọi ô có so (lệch nhau 0,2 giây); moc_ket_qua, moc_so_sanh: giây hiện kết quả, vế so sánh.
// Trả về { el, seek(t), moc: { x, y, rong, cao, ti_le, o: [{ chu, x, y, w, h }] (toạ độ sân khấu, theo thứ tự ten, tu, mau, ket_qua, so_sanh), xong } }.
// Phần tử el là HTML đặt tuyệt đối trong sân khấu (hợp đồng mục 7); ô có data-hop. Bố cục tính bằng số đo chữ, không đo DOM.
// Dựng mới (02/11/2026, lô N168–N180).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  const DAU = new Set(['+', '-', '−', '×', '÷', '(', ')', '=', '≥', '≤', '<', '>', '/']);
  const KHOA = ['nhan', 'nhan_phu', 'tot', 'canh_bao'];

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

  K.khuon_cong_thuc_tach_ky_hieu = function (opt) {
    opt = opt || {};
    const m = K.layMau({ mau: opt.mau_sac }), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 140, Y = opt.y != null ? opt.y : 300, RONG = opt.rong || 1640;
    const co = opt.co || 44, pad = Math.round(co * 0.55), chipH = Math.round(co * 1.75), gap = Math.round(co * 0.32), rr = Math.round(co * 0.3);
    const coPhu = Math.max(22, Math.round(co * 0.56)), coDau = Math.round(co * 1.1);
    const nenKhoi = tay ? K.tron(m.the, m.giay, 0.5) : m.the;

    const chuanHoa = (v) => (typeof v === 'string' && DAU.has(v.trim()) ? { dau: v.trim() === '-' ? '−' : v.trim() } : (typeof v === 'string' ? { chu: v } : Object.assign({}, v)));
    const tu = (opt.tu || []).map(chuanHoa), mauSo = (opt.mau || []).map(chuanHoa), phanSo = mauSo.length > 0;
    const ten = opt.ten != null ? chuanHoa(opt.ten) : null;
    let iMau = 0;
    const soHang = [];  // mọi ô số hạng theo thứ tự hiện
    const doO = (o, vai) => {
      o.vai = vai;
      o.w = Math.ceil(Math.max(K.doChu(o.chu || '', co, 700), o.so ? K.doChu(o.so, co, 800) : 0)) + pad * 2;
      o.wPhu = o.phu ? Math.ceil(K.doChu(o.phu, coPhu, 600)) + 8 : 0;
      o.wDat = Math.max(o.w, o.wPhu);
      if (vai === 'so_hang') o.khoa = o.khoa_mau || KHOA[iMau++ % KHOA.length];
      soHang.push(o);
    };
    const doDau = (o) => { o.w = Math.ceil(K.doChu(o.dau, coDau, 600)) + Math.round(co * 0.2); o.wDat = o.w; };
    if (ten) doO(ten, 'ten');
    tu.forEach((o) => (o.dau ? doDau(o) : doO(o, 'so_hang')));
    mauSo.forEach((o) => (o.dau ? doDau(o) : doO(o, 'so_hang')));
    const kq = opt.ket_qua != null ? { chu: String(opt.ket_qua), vai: 'ket_qua' } : null;
    if (kq) doO(kq, 'ket_qua');
    const ss = opt.so_sanh ? { chu: opt.so_sanh.chu, phu: opt.so_sanh.phu, vai: 'so_sanh' } : null;
    if (ss) doO(ss, 'so_sanh');
    const dau1 = { dau: '=' }, dau2 = { dau: '=' }, dauSS = ss ? { dau: opt.so_sanh.dau || '≥' } : null;
    [dau1, dau2].concat(dauSS ? [dauSS] : []).forEach(doDau);

    const rongDay = (ds) => ds.reduce((s, o) => s + o.wDat, 0) + gap * Math.max(0, ds.length - 1);
    const wTu = rongDay(tu), wMau = rongDay(mauSo);
    const wThan = phanSo ? Math.max(wTu, wMau) + Math.round(co * 0.6) : wTu;
    const chuoi = [];
    if (ten) chuoi.push(ten, dau1);
    chuoi.push({ than: true, wDat: wThan });
    if (kq) chuoi.push(dau2, kq);
    if (ss) chuoi.push(dauSS, ss);
    const tongW = rongDay(chuoi);
    const tl = Math.min(1, RONG / tongW);

    // ----- chiều dọc -----
    const coPhuTu = tu.some((o) => o.phu), coPhuMau = mauSo.some((o) => o.phu), coPhuDong = [ten, kq, ss].some((o) => o && o.phu);
    const hPhu = coPhu + 14;
    const khe = Math.round(co * 0.38);  // khoảng từ gạch phân số tới ô
    let yC;
    const caoTren = phanSo ? khe + chipH + (coPhuTu ? hPhu : 0) : chipH / 2;
    const caoDuoi = phanSo ? khe + chipH + (coPhuMau ? hPhu : 0) : chipH / 2 + (coPhuTu ? hPhu : 0);
    const caoDuoiDong = chipH / 2 + (coPhuDong ? hPhu : 0);
    let yDau = 0;
    const el = K.html('div', { class: 'kho-cong-thuc', style: `position:absolute;left:${X}px;top:${Y}px;width:${RONG}px;font-family:${K.PHONG};` });
    let dongNho = null, tieuDe = null, vach = null;
    if (opt.dong_nho) {
      dongNho = K.html('div', { style: 'position:absolute;left:0;top:0;display:flex;align-items:center;gap:18px;white-space:nowrap;' }, el);
      vach = K.html('div', { style: `width:56px;height:6px;border-radius:3px;background:${m.nhan};flex:none;` }, dongNho);
      K.html('div', { style: `font-weight:600;font-size:28px;line-height:36px;letter-spacing:0.04em;color:${duTuongPhan(m.chu_phu, m.nen, 4.6)};` }, dongNho, opt.dong_nho);
      yDau += 54;
    }
    if (opt.tieu_de) {
      const coTD = K.coVua(opt.tieu_de, RONG, opt.co_tieu_de || 56, 800, 32);
      tieuDe = K.html('div', { style: `position:absolute;left:0;top:${yDau}px;width:${RONG}px;white-space:nowrap;font-weight:800;font-size:${coTD}px;line-height:${Math.round(coTD * 1.25)}px;color:${duTuongPhan(m.chu, m.nen, 7)};` }, el, opt.tieu_de);
      yDau += Math.round(coTD * 1.25) + 40;
    }
    yC = Math.max(caoTren, chipH / 2);
    const caoKhoi = yC + Math.max(caoDuoi, caoDuoiDong);

    // khối công thức, thu nhỏ theo tl, căn giữa trong RONG
    const kh = K.html('div', { style: `position:absolute;left:${Math.round((RONG - tongW * tl) / 2)}px;top:${yDau}px;width:${tongW}px;height:${Math.ceil(caoKhoi)}px;transform-origin:0 0;transform:scale(${tl.toFixed(4)});` }, el);
    const svg = K.svg('svg', { width: tongW, height: Math.ceil(caoKhoi), style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;' }, kh);

    // ----- đặt vị trí -----
    const datDay = (ds, x0, yTren) => { let x = x0; ds.forEach((o) => { o.x = x + (o.wDat - o.w) / 2; o.y = o.dau ? yTren + chipH / 2 : yTren; x += o.wDat + gap; }); };
    let x = 0, thanX = 0;
    chuoi.forEach((o) => {
      if (o.than) {
        thanX = x;
        if (phanSo) {
          datDay(tu, x + (wThan - wTu) / 2, yC - khe - chipH - (coPhuTu ? hPhu : 0));
          datDay(mauSo, x + (wThan - wMau) / 2, yC + khe);
        } else datDay(tu, x, yC - chipH / 2);
      } else { o.x = x + (o.wDat - o.w) / 2; o.y = o.dau ? yC : yC - chipH / 2; }
      x += o.wDat + gap;
    });

    // ----- dựng phần tử -----
    const mauO = (o) => {
      if (o.vai === 'ten') return { nen: tay ? nenKhoi : m.chu, vien: m.chu, chu: tay ? m.chu : K.chuTren(m.chu, '#FFFFFF', m.nen) };
      if (o.vai === 'ket_qua') { const c = m.nhan; return { nen: tay ? nenKhoi : c, vien: c, chu: tay ? duTuongPhan(c, nenKhoi, 4.5) : K.chuTren(c, '#FFFFFF', m.chu) }; }
      if (o.vai === 'so_sanh') { const c = m.tot; return { nen: nenKhoi, vien: c, chu: duTuongPhan(m.chu, nenKhoi, 7) }; }
      const c = m[o.khoa] || m.nhan, nen = tay ? nenKhoi : K.tron(c, m.the, m.toi ? 0.72 : 0.84);
      return { nen, vien: c, chu: duTuongPhan(m.chu, nen, 7) };
    };
    const tatCa = [];
    const veO = (o, hat) => {
      const mm = mauO(o); o.mm = mm;
      o.div = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${chipH}px;box-sizing:border-box;border-radius:${rr}px;` +
        (tay ? '' : `background:${mm.nen};border:3px solid ${mm.vien};`) + 'overflow:visible;' }, kh);
      const kieuChu = `position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;white-space:nowrap;font-size:${co}px;line-height:${chipH}px;color:${mm.chu};`;
      o.sChu = K.html('div', { style: kieuChu + 'font-weight:700;' }, o.div, o.chu || '');
      if (o.so) o.sSo = K.html('div', { style: kieuChu + 'font-weight:800;opacity:0;' }, o.div, o.so);
      if (o.phu) o.sPhu = K.html('div', { style: `position:absolute;left:${o.x + o.w / 2 - o.wPhu / 2}px;top:${o.y + chipH + 8}px;width:${o.wPhu}px;text-align:center;white-space:nowrap;font-weight:600;font-size:${coPhu}px;line-height:${coPhu + 6}px;color:${duTuongPhan(m.chu_phu, m.nen, 4.6)};` }, kh, o.phu);
      o.g = K.svg('g', null, svg);
      if (tay) {
        K.svg('path', { d: K.duongTay(diemHop(o.x, o.y, o.w, chipH, rr, 90), { hat, lech: 1.8, dong: true }) + 'Z', fill: mm.nen }, o.g);
        if (o.vai === 'so_hang' || o.vai === 'ket_qua') {
          let d = '';
          for (let c = 10, i = 0; c < o.w + chipH; c += 13, i++) d += K.duongTay([[o.x + Math.max(0, c - chipH), o.y + Math.min(chipH, c)], [o.x + Math.min(o.w, c), o.y + Math.max(0, c - o.w)]], { hat: hat + 10 + i, lech: 1 }) + ' ';
          K.svg('path', { d, fill: 'none', stroke: mm.vien, 'stroke-width': 1.5, opacity: 0.3, 'stroke-linecap': 'round' }, o.g);
        }
        K.svg('path', { d: K.duongTay(diemHop(o.x, o.y, o.w, chipH, rr, 80), { hat: hat + 1, lech: 1.6, dong: true }), fill: 'none', stroke: mm.vien, 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, o.g);
        // vòng khoanh khi tô sáng
        const v = [];
        for (let i = 0; i <= 36; i++) { const a = -Math.PI * 0.95 + (i / 36) * Math.PI * 2.12; v.push([o.x + o.w / 2 + Math.cos(a) * (o.w / 2 + 18), o.y + chipH / 2 + Math.sin(a) * (chipH / 2 + 16)]); }
        o.vong = K.svg('path', { d: K.duongTay(v, { hat: hat + 3, lech: 2 }), fill: 'none', stroke: m.nhan, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg);
      }
      tatCa.push(o);
    };
    const veDau = (o) => {
      o.div = K.html('div', { style: `position:absolute;left:${o.x}px;top:${o.y - chipH / 2}px;width:${o.w}px;height:${chipH}px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:${coDau}px;color:${duTuongPhan(m.chu, m.nen, 7)};` }, kh, o.dau);
      tatCa.push(o);
    };
    let hat = (opt.hat || 500);
    chuoi.forEach((o) => { if (o.than) { tu.forEach((p) => (p.dau ? veDau(p) : veO(p, hat += 7))); mauSo.forEach((p) => (p.dau ? veDau(p) : veO(p, hat += 7))); } else if (o.dau) veDau(o); else veO(o, hat += 7); });
    let gachPS = null;
    if (phanSo) {
      gachPS = tay
        ? K.svg('path', { d: K.duongTay([[thanX + 6, yC], [thanX + wThan / 2, yC + 2], [thanX + wThan - 6, yC - 1]], { hat: hat + 50, lech: 1.6 }), fill: 'none', stroke: m.chu, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, svg)
        : K.svg('rect', { x: thanX, y: yC - 3, width: wThan, height: 6, rx: 3, fill: m.chu }, svg);
    }

    // ----- mốc thời gian -----
    const mh = opt.moc_hien || [];
    const thuTu = soHang.filter((o) => o.vai === 'ten' || o.vai === 'so_hang');
    thuTu.forEach((o, i) => { o.t0 = tinh ? -100 : (mh[i] != null ? mh[i] : vao + 0.3 + i * 0.5); });
    const tCuoiSH = thuTu.length ? thuTu[thuTu.length - 1].t0 : vao;
    // dấu hiện cùng số hạng đứng ngay trước nó (dấu mở ngoặc: cùng số hạng ngay sau)
    const ganDau = (ds, tMacDinh) => ds.forEach((o, i) => {
      if (!o.dau) return;
      let t = tMacDinh;
      if (o.dau === '(') { const sau = ds.slice(i + 1).find((p) => !p.dau); if (sau) t = sau.t0 - 0.1; }
      else { const truoc = ds.slice(0, i).reverse().find((p) => !p.dau); if (truoc) t = truoc.t0 + 0.25; }
      o.t0 = t;
    });
    ganDau(tu, ten ? ten.t0 + 0.3 : vao + 0.3); ganDau(mauSo, vao + 0.3);
    dau1.t0 = ten ? ten.t0 + 0.25 : -100;
    const tGach = tinh ? -100 : (mauSo.length ? Math.min(...mauSo.filter((o) => !o.dau).map((o) => o.t0)) - 0.25 : 0);
    const tKQ = kq ? (tinh ? -100 : (opt.moc_ket_qua != null ? opt.moc_ket_qua : tCuoiSH + 1.0)) : null;
    if (kq) { kq.t0 = tKQ; dau2.t0 = tKQ - 0.15; }
    const tSS = ss ? (tinh ? -100 : (opt.moc_so_sanh != null ? opt.moc_so_sanh : (kq ? tKQ : tCuoiSH) + 0.8)) : null;
    if (ss) { ss.t0 = tSS; dauSS.t0 = tSS - 0.15; }
    let k = 0;
    soHang.forEach((o) => { if (o.so) { o.tSo = o.moc_so != null ? o.moc_so : (opt.moc_so != null ? opt.moc_so + 0.2 * k++ : null); if (tinh && o.tSo != null && opt.moc_so != null) o.tSo = -100; } });
    const xong = tinh ? 0 : Math.max(tCuoiSH, tKQ || 0, tSS || 0) + 0.6;

    function seek(t) {
      if (dongNho) { dongNho.style.opacity = K.eo3(K.tienDo(t, vao, 0.4)).toFixed(3); vach.style.width = Math.round(8 + 48 * K.eio(K.tienDo(t, vao, 0.6))) + 'px'; }
      if (tieuDe) { tieuDe.style.opacity = K.eo3(K.tienDo(t, vao + 0.1, 0.4)).toFixed(3); tieuDe.style.transform = `translateY(${Math.round((1 - K.eo3(K.tienDo(t, vao + 0.1, 0.5))) * 20)}px)`; }
      tatCa.forEach((o) => {
        const tt = t - o.t0, a = K.eo3(K.tienDo(tt, 0, 0.3));
        const dy = (1 - K.spr(tt, 0.5, 0.68)) * 26, sc = 0.9 + 0.1 * K.eo3(K.tienDo(tt, 0, 0.35));
        // tô sáng
        let to = 0;
        if (o.to != null) to = K.eo3(K.tienDo(t, o.to, 0.35)) * (o.het_to != null ? 1 - K.eo3(K.tienDo(t, o.het_to, 0.35)) : 1);
        const nhac = to * 8;
        o.div.style.opacity = a.toFixed(3);
        o.div.style.transform = `translateY(${(dy - nhac).toFixed(2)}px) scale(${sc.toFixed(4)})`;
        if (o.g) { o.g.setAttribute('opacity', a.toFixed(3)); o.g.setAttribute('transform', `translate(0 ${(dy - nhac).toFixed(2)})`); }
        if (o.sPhu) { o.sPhu.style.opacity = K.eo3(K.tienDo(tt, 0.25, 0.35)).toFixed(3); }
        if (!tay && o.vai) o.div.style.boxShadow = to > 0.001 ? `0 0 0 ${(7 * to).toFixed(1)}px ${K.rgba(m.nhan, 0.35)}` : 'none';
        if (o.vong) { o.vong.style.display = to > 0.001 ? '' : 'none'; if (to > 0.001) K.veDan(o.vong, K.eio(K.tienDo(t, o.to, 0.6)) * (o.het_to != null ? 1 - K.tienDo(t, o.het_to, 0.3) : 1)); }
        // đổi chữ sang số
        if (o.sSo) {
          const p = o.tSo == null ? 0 : K.eio(K.tienDo(t, o.tSo, 0.4));
          o.sChu.style.opacity = (1 - p).toFixed(3); o.sChu.style.transform = `translateY(${(-p * 18).toFixed(1)}px)`;
          o.sSo.style.opacity = p.toFixed(3); o.sSo.style.transform = `translateY(${((1 - p) * 18).toFixed(1)}px)`;
        }
      });
      if (gachPS) {
        const p = K.eio(K.tienDo(t, tGach, 0.45));
        if (tay) { gachPS.style.display = p > 0 ? '' : 'none'; if (p > 0) K.veDan(gachPS, p); }
        else gachPS.setAttribute('width', (wThan * p).toFixed(1));
      }
    }

    const oSanKhau = soHang.map((o) => ({ chu: o.chu, x: X + (RONG - tongW * tl) / 2 + o.x * tl, y: Y + yDau + o.y * tl, w: o.w * tl, h: chipH * tl }));
    return { el, seek, moc: { x: X, y: Y, rong: RONG, cao: yDau + caoKhoi * tl, ti_le: tl, o: oSanKhau, xong } };
  };
  K.khuon_cong_thuc = K.khuon_cong_thuc_tach_ky_hieu;
})();
