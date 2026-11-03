// ngan_hang/khuon_trich_van_ban_phap_luat.js — 1.0 — khuôn thẻ trích văn bản pháp luật: số hiệu, tên văn bản, cơ quan ban hành, ngày hiệu lực,
// điều khoản, đoạn trích nguyên văn; các cụm cần chú ý được tô sáng vẽ dần lần lượt, phần chữ còn lại dịu xuống để mắt dồn vào cụm tô sáng.
// Tham số: so_hieu ('Thông tư 39/2016/TT-NHNN'); ten (tên văn bản, xuống dòng được); co_quan (cơ quan ban hành); hieu_luc ('Hiệu lực từ 15/03/2017');
//   dieu ('Điều 2. Giải thích từ ngữ'); doan (chuỗi hoặc mảng đoạn trích); to_sang (mảng cụm cần tô: chuỗi trùng nguyên văn trong doan, hoặc
//   { chu, moc } với moc là giây bắt đầu tô); nguon (dòng ghi nguồn cuối thẻ); dong_nho, tieu_de (đầu trang như khuôn mở đầu);
//   kieu 'phang' | 'net_tay'; mau; x, y, rong (mặc định 140, 90, 1640); co_trich (36, cỡ chữ đoạn trích); diu (true: chữ ngoài cụm tô dịu xuống, mặc định true);
//   vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay); moc_hien (mảng giây tô từng cụm, thay cho moc trong to_sang).
// Gom từ xuong_html/n96_tai_san_bao_dam/trang.html:51-59 (.the-luat: thẻ tiêu đề, hàng khoản có nền tô khi đang đọc); dựng lại thành khuôn có tham số.
// Trả về { el, seek(t), moc: { x, y, rong, to_sang: [giây từng cụm], xong } }.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // ---------- hàm nội bộ (đề xuất gom vào kho_nen.js: dùng lại ở mọi khuôn nhóm A) ----------
  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }
  // Điểm viền hộp bo góc (chiều kim đồng hồ), cạnh chia đoạn khoảng `buoc` px để nét tay run đều.
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
  // Gạch chéo 45° tô kín một hộp (bút chì).
  function gachHop(x, y, w, h, buoc, hat) {
    let d = '';
    for (let c = buoc / 2, i = 0; c < w + h; c += buoc, i++) {
      d += K.duongTay([[x + Math.max(0, c - h), y + Math.min(h, c)], [x + Math.min(w, c), y + Math.max(0, c - w)]], { hat: hat + i, lech: 1.1 }) + ' ';
    }
    return d;
  }
  // Vòng khoanh bút chì quanh một hình elip, vượt quá điểm đầu một chút.
  function vongTay(cx, cy, rx, ry, hat) {
    const v = [];
    for (let i = 0; i <= 36; i++) { const a = -Math.PI * 0.95 + (i / 36) * Math.PI * 2.12; v.push([cx + Math.cos(a) * rx * (1 + 0.025 * Math.sin(i * 1.7)), cy + Math.sin(a) * ry]); }
    return K.duongTay(v, { hat, lech: 2 });
  }
  // Lớp SVG phủ kín phần tử cha (cha phải position relative/absolute), không nhận chuột.
  function lopSvg(cha) {
    const s = K.svg('svg', { style: 'position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;' });
    cha.insertBefore(s, cha.firstChild);
    return s;
  }
  // Vẽ lại phần trang trí phụ thuộc kích thước khi kích thước phần tử đổi (đo một lần sau khi gắn vào trang; không phải trạng thái khung).
  function khiDoiCo(el, fn) {
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!w) return;
    const k = w + 'x' + h;
    if (el._kho_co !== k) { el._kho_co = k; fn(w, h); }
  }
  // Viền thẻ bút chì: bóng lệch, nền loang, hai lượt nét.
  function veVienTay(svg, w, h, r, m, nenThe, hat) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    K.svg('path', { d: K.duongTay(diemHop(9, 11, w, h, r, 140), { hat: hat + 3, lech: 3, dong: true }) + 'Z', fill: K.rgba(m.chu, 0.07), stroke: 'none' }, svg);
    K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, r, 140), { hat, lech: 2.4, dong: true }) + 'Z', fill: nenThe, stroke: 'none' }, svg);
    K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, r, 120), { hat: hat + 1, lech: 1.8, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    K.svg('path', { d: K.duongTay(diemHop(2, -2, w - 3, h + 2, r, 160), { hat: hat + 2, lech: 2.2, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 1.2, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }, svg);
  }
  function datTu(cha, chuoi, kieuSpan) {
    const ds = [];
    String(chuoi || '').split(/\s+/).filter(Boolean).forEach((w) => {
      if (cha.childNodes.length) cha.appendChild(document.createTextNode(' '));
      ds.push(K.html('span', { style: 'display:inline-block;' + (kieuSpan || '') }, cha, w));
    });
    return ds;
  }
  function hienTu(s, t, t0, cao) {
    const a = K.eo3(K.tienDo(t, t0, 0.3)), y = Math.round((1 - K.eob(K.tienDo(t, t0, 0.4), 1.2)) * (cao || 18));
    s.style.opacity = a.toFixed(3); s.style.transform = `translateY(${y}px)`;
  }
  // Đầu trang chung của nhóm khuôn: dòng nhỏ có vạch nhấn (giống khuôn mở đầu) và tiêu đề lớn.
  function dauTrang(cha, m, nen, dongNho, tieuDe, coTD) {
    const mauPhu = duTuongPhan(m.chu_phu, nen, 4.6), mauChu = duTuongPhan(m.chu, nen, 7);
    const khoi = K.html('div', { style: 'position:relative;' }, cha);
    let loat = null, vach = null, td = null, tu = [];
    if (dongNho) {
      loat = K.html('div', { style: 'display:flex;align-items:center;gap:18px;white-space:nowrap;margin-bottom:18px;' }, khoi);
      vach = K.html('div', { style: `width:56px;height:6px;border-radius:3px;background:${m.nhan};flex:none;` }, loat);
      K.html('div', { style: `font-weight:600;font-size:28px;letter-spacing:0.04em;color:${mauPhu};` }, loat, dongNho);
    }
    if (tieuDe) {
      td = K.html('div', { style: `font-weight:800;font-size:${coTD}px;line-height:${Math.round(coTD * 1.2)}px;color:${mauChu};letter-spacing:-0.01em;` }, khoi);
      tu = datTu(td, tieuDe);
    }
    if (!dongNho && !tieuDe) khoi.style.display = 'none';
    return {
      el: khoi, so_tu: tu.length,
      seek(t, t0) {
        if (loat) { loat.style.opacity = K.eo3(K.tienDo(t, t0, 0.4)).toFixed(3); vach.style.width = Math.round(8 + 48 * K.eio(K.tienDo(t, t0, 0.6))) + 'px'; }
        tu.forEach((s, i) => hienTu(s, t, t0 + 0.2 + i * 0.045, 22));
      },
    };
  }

  // Biểu tượng văn bản 72×88: trang giấy gấp góc, dải dấu, các dòng chữ. Trả về các đường để vẽ dần.
  function bieuTuongVanBan(svg, m, tay, hat) {
    const W = 72, H = 88, g = 18, ds = [];
    const vien = [[0, 0], [W - g, 0], [W, g], [W, H], [0, H]];
    if (tay) {
      K.svg('path', { d: K.duongTay(vien, { hat, lech: 1.4, dong: true }) + 'Z', fill: K.rgba(m.nhat, 0.7), stroke: 'none' }, svg);
      ds.push(K.svg('path', { d: K.duongTay(vien, { hat: hat + 1, lech: 1.2, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg));
      ds.push(K.svg('path', { d: K.duongTay([[W - g, 0], [W - g, g], [W, g]], { hat: hat + 2, lech: 1 }), fill: 'none', stroke: m.chu, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, svg));
    } else {
      K.svg('path', { d: `M4 6 L${W - g + 4} 6 L${W + 4} ${g + 6} L${W + 4} ${H + 6} L4 ${H + 6}Z`, fill: 'rgba(0,0,0,0.08)' }, svg);
      ds.push(K.svg('path', { d: `M0 0 L${W - g} 0 L${W} ${g} L${W} ${H} L0 ${H}Z`, fill: m.giay, stroke: m.vien, 'stroke-opacity': 0.25, 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg));
      K.svg('path', { d: `M${W - g} 0 L${W - g} ${g} L${W} ${g}Z`, fill: m.nhat, stroke: m.vien, 'stroke-opacity': 0.25, 'stroke-width': 2, 'stroke-linejoin': 'round' }, svg);
    }
    [[12, 30, 46], [12, 42, 46], [12, 54, 34]].forEach(([x, y, w], i) => {
      ds.push(K.svg('path', { d: tay ? K.duongTay([[x, y], [x + w, y]], { hat: hat + 5 + i, lech: 1 }) : `M${x} ${y} L${x + w} ${y}`, fill: 'none', stroke: m.chu, 'stroke-opacity': 0.45, 'stroke-width': 4, 'stroke-linecap': 'round' }, svg));
    });
    // dấu tròn ở góc dưới: văn bản chính thức (không chữ, không biểu trưng cơ quan thật)
    ds.push(K.svg('circle', { cx: 52, cy: 72, r: 9, fill: 'none', stroke: m.nhan, 'stroke-width': 3 }, svg));
    return ds;
  }

  K.khuon_trich_van_ban_phap_luat = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 140, Y = opt.y != null ? opt.y : 90, W = opt.rong || 1640;
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.giay;
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6), mauNhan = duTuongPhan(m.nhan, nenThe, 4.5);
    const nenTo = tay ? K.rgba(m.nhan, 0.2) : m.nhat;
    const mauDiu = K.tron(mauChu, mauPhu, 0.7);
    const co = opt.co_trich || 36, lh = Math.round(co * 1.5);
    const diu = opt.diu !== false;

    const el = K.html('div', { class: 'kho-trich-van-ban', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;font-family:${K.PHONG};` });
    const dau = dauTrang(el, m, m.nen, opt.dong_nho, opt.tieu_de, opt.co_tieu_de || 56);
    if (opt.dong_nho || opt.tieu_de) dau.el.style.marginBottom = '34px';

    const the = K.html('div', { 'data-hop': '1', style: `position:relative;box-sizing:border-box;padding:46px 52px 40px;border-radius:22px;` +
      (tay ? '' : `background:${nenThe};box-shadow:0 14px 40px rgba(0,0,0,${m.toi ? 0.35 : 0.08}),0 2px 6px rgba(0,0,0,${m.toi ? 0.2 : 0.04});overflow:hidden;`) }, el);
    const svgThe = tay ? lopSvg(the) : null;
    if (!tay) K.html('div', { style: `position:absolute;left:0;top:0;right:0;height:10px;background:${m.nhan};` }, the);

    // ----- đầu thẻ: biểu tượng, số hiệu, hiệu lực, tên văn bản -----
    const dauThe = K.html('div', { style: 'position:relative;display:flex;align-items:flex-start;gap:30px;' }, the);
    const oBT = K.html('div', { style: 'position:relative;flex:none;width:72px;height:88px;margin-top:4px;' }, dauThe);
    const svgBT = K.svg('svg', { width: 72, height: 88, style: 'position:absolute;left:0;top:0;overflow:visible;' }, oBT);
    const duongBT = bieuTuongVanBan(svgBT, m, tay, 31);
    const tt = K.html('div', { style: 'position:relative;flex:1 1 auto;min-width:0;' }, dauThe);
    const hang1 = K.html('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px;' }, tt);
    let soHieu = null;
    if (opt.so_hieu) {
      soHieu = K.html('div', { 'data-hop': '1', style: `position:relative;flex:none;height:50px;line-height:50px;padding:0 22px;border-radius:25px;white-space:nowrap;font-weight:700;font-size:30px;` +
        (tay ? `color:${mauNhan};` : `background:${m.nhan};color:${K.chuTren(m.nhan, '#FFFFFF', m.chu)};`) }, hang1);
      if (tay) {
        const w = Math.ceil(K.doChu(opt.so_hieu, 30, 700)) + 64, s = lopSvg(soHieu), v = [];
        soHieu.style.width = w + 'px'; soHieu.style.boxSizing = 'border-box'; soHieu.style.textAlign = 'center';
        for (let i = 0; i <= 36; i++) { const a = -Math.PI * 0.92 + (i / 36) * Math.PI * 2.08; v.push([w / 2 + Math.cos(a) * (w / 2 + 4), 25 + Math.sin(a) * 31]); }
        K.svg('path', { d: K.duongTay(v, { hat: 33, lech: 2 }), fill: 'none', stroke: m.nhan, 'stroke-width': 3, 'stroke-linecap': 'round' }, s);
      }
      K.html('span', { style: 'position:relative;' }, soHieu, opt.so_hieu);
    }
    let hieuLuc = null;
    if (opt.hieu_luc) hieuLuc = K.html('div', { 'data-hop': '1', style: `flex:none;height:46px;line-height:42px;box-sizing:border-box;padding:0 18px;border-radius:23px;white-space:nowrap;` +
      `font-weight:600;font-size:26px;color:${mauPhu};border:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, tay ? 0.45 : 0.18)};` }, hang1, opt.hieu_luc);
    let coQuan = null;
    if (opt.co_quan) coQuan = K.html('div', { style: `flex:0 1 auto;font-weight:600;font-size:26px;line-height:34px;color:${mauPhu};` }, hang1, opt.co_quan);
    const ten = K.html('div', { style: `margin-top:14px;font-weight:700;font-size:32px;line-height:42px;color:${mauChu};` }, tt, opt.ten || '');
    if (!opt.ten) ten.style.display = 'none';

    const vachNgang = K.html('div', { style: `position:relative;height:0;margin:30px 0 0;border-top:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, tay ? 0.35 : 0.1)};` }, the);
    const dieu = K.html('div', { style: `position:relative;margin-top:26px;font-weight:800;font-size:32px;line-height:42px;color:${mauNhan};` }, the, opt.dieu || '');
    if (!opt.dieu) dieu.style.display = 'none';

    // ----- đoạn trích -----
    const trich = K.html('div', { style: `position:relative;margin-top:16px;padding-left:38px;` }, the);
    const svgTo = K.svg('svg', { style: 'position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;' }, trich);
    let vachDoc = null;
    if (tay) vachDoc = K.svg('path', { fill: 'none', stroke: m.nhan, 'stroke-width': 4, 'stroke-linecap': 'round' }, svgTo);
    else vachDoc = K.html('div', { style: `position:absolute;left:0;top:6px;bottom:6px;width:6px;border-radius:3px;background:${m.nhan};` }, trich);
    const doan = Array.isArray(opt.doan) ? opt.doan : [opt.doan || ''];
    const cum = (opt.to_sang || []).map((c, i) => ({ chu: typeof c === 'string' ? c : c.chu, moc: typeof c === 'object' && c.moc != null ? c.moc : (opt.moc_hien || [])[i] }));
    const doanEl = [], mauTuDo = [];
    // Mỗi từ một span nội dòng, dấu cách là nút chữ riêng: bộ kiểm chữ đo từng từ (khung bao của nút chữ trải hai dòng phủ cả dòng, báo nhầm chữ đè).
    function themTu(cha, chuoi, ds) {
      const phan = String(chuoi).split(/(\s+)/);
      phan.forEach((w) => { if (!w) return; if (/^\s+$/.test(w)) cha.appendChild(document.createTextNode(' ')); else ds.push(K.html('span', null, cha, w)); });
    }
    doan.forEach((d, i) => {
      const p = K.html('div', { style: `position:relative;margin-top:${i ? 18 : 0}px;font-weight:500;font-size:${co}px;line-height:${lh}px;color:${mauChu};` }, trich);
      // tách đoạn theo các cụm tô (lần xuất hiện đầu, theo thứ tự trong đoạn)
      let con = String(d);
      const viTri = [];
      cum.forEach((c, k) => { if (c.el) return; const j = con.indexOf(c.chu); if (j >= 0) viTri.push([j, k]); });
      viTri.sort((a, b) => a[0] - b[0]);
      let dau0 = 0;
      viTri.forEach(([j, k]) => {
        if (j < dau0) return;
        if (j > dau0) themTu(p, con.slice(dau0, j), mauTuDo);
        cum[k].el = K.html('span', { style: 'position:relative;' }, p);
        themTu(cum[k].el, cum[k].chu, []);
        dau0 = j + cum[k].chu.length;
      });
      if (dau0 < con.length) themTu(p, con.slice(dau0), mauTuDo);
      doanEl.push(p);
    });
    const ds = cum.filter((c) => c.el);
    let nguon = null;
    if (opt.nguon) nguon = K.html('div', { style: `position:relative;margin-top:26px;font-weight:500;font-size:24px;line-height:32px;color:${mauPhu};` }, the, opt.nguon);

    // ----- mốc thời gian -----
    const tThe = vao + 0.15 + (dau.so_tu ? Math.min(0.6, dau.so_tu * 0.045) : 0);
    const tDoan = tThe + 1.0;
    let tCuoi = tDoan + doan.length * 0.25 + 0.5;
    ds.forEach((c, i) => {
      c.t = tinh ? -100 : (c.moc != null ? c.moc : tCuoi + 0.2);
      c.dai = 0.35 + K.doChu(c.chu, co, 500) / 1500;
      tCuoi = Math.max(tCuoi, c.t + c.dai + 0.6);
    });
    const tDiu = ds.length ? Math.min(...ds.map((c) => c.t)) : 1e9;
    const xong = tinh ? 0 : tCuoi;

    // đo vị trí từng dòng của cụm tô (sau khi gắn vào trang), dựng hình chữ nhật tô và nét gạch chân
    function veTrangTri() {
      if (tay) khiDoiCo(the, (w, h) => veVienTay(svgThe, w, h, 22, m, nenThe, 71));
      khiDoiCo(trich, (w, h) => {
        if (tay) vachDoc.setAttribute('d', K.duongTay([[3, 6], [2, h / 2], [4, h - 6]], { hat: 75, lech: 1.6 }));
        if (tay) vachDoc._kho_dai = null;
        doanEl.forEach((p) => { p.style.transform = ''; });   // đo khi chưa dịch (seek đặt lại ngay sau)
        const goc = trich.getBoundingClientRect();
        ds.forEach((c, k) => {
          (c.hinh || []).forEach((x) => x.remove());
          c.hinh = []; c.dong = [];
          const rs = Array.from(c.el.getClientRects()).filter((r) => r.width > 2);
          rs.forEach((r, j) => {
            const x = Math.round(r.left - goc.left) - 6, y = Math.round(r.top - goc.top) + Math.round(lh * 0.08), w = Math.round(r.width) + 12, hh = Math.round(lh * 0.84);
            const nen = K.svg('rect', { x, y, width: 0, height: hh, rx: tay ? 3 : 8, fill: nenTo, filter: tay ? K.locNetTay(svgTo, { hat: 80 + j, do_run: 2.6, tan_so: 0.05 }) : null }, svgTo);
            svgTo.insertBefore(nen, svgTo.firstChild);
            let gach = null;
            if (tay) {
              gach = K.svg('path', { d: K.duongTay([[x + 4, y + hh - 2], [x + w / 2, y + hh + 1], [x + w - 4, y + hh - 3]], { hat: 90 + k * 7 + j, lech: 1.8 }), fill: 'none', stroke: m.nhan, 'stroke-width': 3, 'stroke-linecap': 'round' }, svgTo);
            }
            c.hinh.push(nen); if (gach) c.hinh.push(gach);
            c.dong.push({ nen, gach, w });
          });
        });
      });
    }

    function seek(t) {
      veTrangTri();
      dau.seek(t, vao);
      const aT = K.eo3(K.tienDo(t, tThe, 0.45));
      the.style.opacity = aT.toFixed(3); the.style.transform = `translateY(${Math.round((1 - aT) * 28)}px)`;
      duongBT.forEach((p, i) => { if (p.tagName === 'path' && tay) K.veDan(p, K.eio(K.tienDo(t, tThe + 0.15 + i * 0.08, 0.4))); else p.style.opacity = K.eo3(K.tienDo(t, tThe + 0.15 + i * 0.08, 0.3)).toFixed(3); });
      const hien = (e, t0) => { if (!e) return; const a = K.eo3(K.tienDo(t, t0, 0.35)); e.style.opacity = a.toFixed(3); e.style.transform = `translateY(${Math.round((1 - a) * 14)}px)`; };
      if (soHieu) { const a = K.eo3(K.tienDo(t, tThe + 0.35, 0.3)); soHieu.style.opacity = a.toFixed(3); soHieu.style.transform = `translateX(${Math.round((1 - K.spr(t - tThe - 0.35, 0.45, 0.6)) * -24)}px)`; }
      hien(hieuLuc, tThe + 0.5); hien(coQuan, tThe + 0.55); hien(ten, tThe + 0.6); hien(dieu, tThe + 0.85);
      vachNgang.style.opacity = K.eo3(K.tienDo(t, tThe + 0.7, 0.4)).toFixed(3);
      doanEl.forEach((p, i) => hien(p, tDoan + i * 0.25));
      const pV = K.eio(K.tienDo(t, tDoan, 0.6));
      if (tay) { if (vachDoc.getAttribute('d')) K.veDan(vachDoc, pV); } else { vachDoc.style.transform = `scaleY(${pV.toFixed(3)})`; vachDoc.style.transformOrigin = '50% 0'; }
      // chữ ngoài cụm tô dịu xuống khi bắt đầu tô
      const pD = diu ? K.eio(K.tienDo(t, tDiu, 0.5)) : 0;
      const mauNgoai = K.tron(mauChu, mauDiu, pD);
      mauTuDo.forEach((s) => { s.style.color = mauNgoai; });
      ds.forEach((c) => {
        const p = K.eio(K.tienDo(t, c.t, c.dai));
        c.el.style.color = mauChu;
        const tong = (c.dong || []).reduce((s, d) => s + d.w, 0);
        let qua = 0;
        (c.dong || []).forEach((d) => {
          const q = K.cl((p * tong - qua) / d.w); qua += d.w;
          const tho = 0.88 + 0.12 * Math.cos((t - xong) * 2) * K.tienDo(t, xong, 0.6);
          d.nen.setAttribute('width', (d.w * q).toFixed(1));
          d.nen.setAttribute('opacity', tho.toFixed(3));
          if (d.gach) K.veDan(d.gach, K.cl((q - 0.15) / 0.85));
        });
      });
      if (nguon) nguon.style.opacity = K.eo3(K.tienDo(t, tDoan + 0.6, 0.5)).toFixed(3);
    }

    return { el, seek, moc: { x: X, y: Y, rong: W, to_sang: ds.map((c) => c.t), xong } };
  };
})();
