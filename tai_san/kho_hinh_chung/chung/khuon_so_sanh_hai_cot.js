// chung/khuon_so_sanh_hai_cot.js — 1.0 — khuôn so sánh: hai cột (hai thẻ đặt cạnh nhau) hoặc bảng 3–4 cột có cột nhãn hàng;
// đầu cột hiện trước, các hàng hiện dần theo mốc lời đọc, ô có thể kèm dấu tích, gạch, hỏi, chấm than (bộ biểu tượng cơ bản), hàng có thể tô sáng.
// Tham số: cot (mảng 2–4 đầu cột: chuỗi hoặc { ten, phu (dòng nhỏ dưới tên), khoa_mau (khoá màu; mặc định theo thứ tự nhan, chu, canh_bao, tot) });
//   hang (mảng hàng: { nhan (nhãn hàng, cột trái; bỏ trống thì không có cột nhãn), o: [ô theo từng cột: chuỗi, hoặc { chu, dau: 'tich' | 'gach' | 'hoi' | 'cham_than' }] });
//   to_sang (mảng chỉ số hàng tô sáng); rong_nhan (bề ngang cột nhãn, mặc định 300); dong_nho, tieu_de (đầu trang như khuôn mở đầu);
//   kieu 'phang' | 'net_tay'; mau; x, y, rong (mặc định 140, 90, 1640); co_o (32, cỡ chữ ô); vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay);
//   moc_cot (giây hiện đầu cột); moc_hien (mảng giây hiện từng hàng); moc_to (giây bắt đầu tô hàng to_sang).
// Dựng mới. Cần bo_bieu_tuong_co_ban (chung/bieu_tuong.js) khi có ô kèm dấu.
// Trả về { el, seek(t), moc: { x, y, rong, cot: giây đầu cột, moc_hang: [giây từng hàng], xong } }.
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

  K.khuon_so_sanh_hai_cot = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 140, Y = opt.y != null ? opt.y : 90, W = opt.rong || 1640;
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the;
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6);
    const cot = (opt.cot || []).slice(0, 4).map((c) => (typeof c === 'string' ? { ten: c } : c));
    const nC = Math.max(1, cot.length), hang = opt.hang || [];
    const coNhan = hang.some((h) => h.nhan);
    const coO = opt.co_o || (nC >= 4 ? 28 : 32), lhO = Math.round(coO * 1.3);
    const toSang = new Set(opt.to_sang || []);
    const KHOA = ['nhan', 'chu', 'canh_bao', 'tot'];   // cột 2 mặc định màu chữ chính: hai cột khác nhau rõ ở mọi bảng màu

    const el = K.html('div', { class: 'kho-so-sanh', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;font-family:${K.PHONG};` });
    const dau = dauTrang(el, m, m.nen, opt.dong_nho, opt.tieu_de, opt.co_tieu_de || 60);
    if (opt.dong_nho || opt.tieu_de) dau.el.style.marginBottom = '40px';

    const GAPC = 28, rongNhan = coNhan ? (opt.rong_nhan || 300) : 0;
    const luoi = K.html('div', { style: `position:relative;display:grid;grid-template-columns:${coNhan ? rongNhan + 'px ' : ''}repeat(${nC}, minmax(0, 1fr));column-gap:${GAPC}px;row-gap:0;` }, el);
    const svgLuoi = lopSvg(luoi);
    const svgNen = K.svg('g', null, svgLuoi), svgTo = K.svg('g', null, svgLuoi);
    const idBong = 'kho-ss-bong-' + Math.round(K.ngauNhien(7)(W + nC * 13 + (opt.hang || []).length * 101) * 1e9);
    const fb = K.svg('filter', { id: idBong, x: '-10%', y: '-10%', width: '120%', height: '130%' }, K.defs(svgLuoi));
    K.svg('feDropShadow', { dx: 0, dy: 10, stdDeviation: 14, 'flood-color': '#000000', 'flood-opacity': m.toi ? 0.35 : 0.07 }, fb);

    // ----- đầu cột -----
    // phẳng: đầu cột nền màu, chữ trắng; nền được làm đậm tới khi chữ trắng đạt tương phản 4,5
    const mauCot = cot.map((c, j) => { const g = m[c.khoa_mau || KHOA[j % KHOA.length]] || m.nhan; return tay ? g : (m.toi ? g : duTuongPhan(g, '#FFFFFF', 4.5)); });
    if (coNhan) K.html('div', { style: 'position:relative;' }, luoi);
    const dauCot = cot.map((c, j) => {
      const mc = mauCot[j];
      const o = K.html('div', { 'data-hop': '1', style: `position:relative;box-sizing:border-box;padding:24px 30px 22px;border-radius:20px 20px 0 0;` +
        (tay ? '' : `background:${mc};`) }, luoi);
      const mauTen = tay ? duTuongPhan(mc, nenThe, 4.5) : K.chuTren(mc, '#FFFFFF', m.chu);
      const ten = K.html('div', { style: `position:relative;font-weight:800;font-size:${nC >= 4 ? 32 : 38}px;line-height:${nC >= 4 ? 40 : 48}px;color:${mauTen};` }, o, c.ten || '');
      let phu = null;
      if (c.phu) phu = K.html('div', { style: `position:relative;margin-top:4px;font-weight:600;font-size:26px;line-height:34px;color:${tay ? mauPhu : mauTen};opacity:${tay ? 1 : 0.92};` }, o, c.phu);
      let gach = null;
      if (tay) gach = K.svg('path', { fill: 'none', stroke: mc, 'stroke-width': 4, 'stroke-linecap': 'round' }, svgTo);
      return { o, ten, phu, gach, j };
    });

    // ----- các hàng -----
    const hangEl = hang.map((h, i) => {
      const cuoi = i === hang.length - 1, sang = toSang.has(i);
      const r = { i, sang, o: [], dau: [], nhan: null };
      if (coNhan) {
        r.nhan = K.html('div', { 'data-hop': '1', style: `position:relative;display:flex;align-items:center;box-sizing:border-box;padding:20px 20px 20px 0;` +
          `font-weight:700;font-size:${Math.max(26, coO - 4)}px;line-height:${Math.round(Math.max(26, coO - 4) * 1.3)}px;color:${duTuongPhan(m.chu_phu, m.nen, 4.6)};` +
          `border-top:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, i ? (tay ? 0.25 : 0.1) : 0)};` }, luoi, h.nhan || '');
      }
      for (let j = 0; j < nC; j++) {
        const v = (h.o || [])[j];
        const d = v && typeof v === 'object' ? v : { chu: v == null ? '' : String(v) };
        const o = K.html('div', { 'data-hop': '1', style: `position:relative;display:flex;align-items:center;gap:16px;box-sizing:border-box;padding:20px 30px ${cuoi ? 26 : 20}px;` +
          '' }, luoi);
        const lop = K.html('div', { style: `position:absolute;left:${tay ? 0 : 18}px;right:${tay ? 0 : 18}px;top:0;height:0;border-top:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, i ? (tay ? 0.25 : 0.1) : 0)};` }, o);
        let bt = null;
        if (d.dau && K.bo_bieu_tuong_co_ban) {
          const s = K.svg('svg', { width: 50, height: 50, style: 'position:relative;flex:none;overflow:visible;' }, o);
          const gg = K.svg('g', { transform: 'translate(25 25)' }, s);
          bt = K.bo_bieu_tuong_co_ban({ loai: d.dau, kieu: tay ? 'net_tay' : 'phang', co: 0.5, mau: opt.mau, hat: 300 + i * 10 + j });
          gg.appendChild(bt.el);
        }
        const chu = K.html('div', { style: `position:relative;flex:1 1 auto;min-width:0;font-weight:600;font-size:${coO}px;line-height:${lhO}px;color:${mauChu};` }, o, d.chu || '');
        r.o.push({ o, chu, bt, lop });
      }
      return r;
    });

    // ----- mốc thời gian -----
    const tCot = tinh ? -100 : (opt.moc_cot != null ? opt.moc_cot : vao + 0.2 + (dau.so_tu ? Math.min(0.6, dau.so_tu * 0.045) : 0));
    const mh = opt.moc_hien || [];
    const tHang = hangEl.map((r, i) => (tinh ? -100 : (mh[i] != null ? mh[i] : tCot + 0.9 + i * 1.0)));
    const tTo = tinh ? -100 : (opt.moc_to != null ? opt.moc_to : (tHang.length ? tHang[tHang.length - 1] : tCot) + 0.9);
    const xong = tinh ? 0 : (toSang.size ? tTo + 0.6 : (tHang.length ? tHang[tHang.length - 1] + 0.7 : tCot + 0.6));

    // vẽ nền cột nét tay, gạch chân đầu cột, hình tô hàng (đo sau khi gắn vào trang)
    const toHinh = [];
    function veTrangTri() {
      khiDoiCo(luoi, () => {
        while (svgNen.firstChild) svgNen.removeChild(svgNen.firstChild);
        toHinh.length = 0;
        dauCot.forEach((dc, j) => {
          const cuoiO = hangEl.length ? hangEl[hangEl.length - 1].o[j].o : dc.o;
          const x = dc.o.offsetLeft, y = dc.o.offsetTop, w = dc.o.offsetWidth, h = cuoiO.offsetTop + cuoiO.offsetHeight - y;
          if (!tay) {
            // thân cột phẳng: một hình chữ nhật bo góc có bóng, vẽ sau lưới để ô không cần nền riêng
            K.svg('rect', { x, y, width: w, height: h, rx: 20, fill: nenThe, filter: `url(#${idBong})` }, svgNen);
          } else {
            const g = K.svg('g', { transform: `translate(${x} ${y})` }, svgNen);
            veVienTay(g, w, h, 20, m, nenThe, 200 + j * 7);
            K.svg('path', { d: gachHop(4, 4, w - 8, dc.o.offsetHeight - 4, 14, 230 + j * 20), fill: 'none', stroke: mauCot[j], 'stroke-width': 1.6, 'stroke-opacity': 0.28, 'stroke-linecap': 'round' }, g);
            const yy = y + dc.o.offsetHeight - 6;
            dc.gach.setAttribute('d', K.duongTay([[x + 26, yy], [x + w / 2, yy + 2], [x + w - 26, yy - 1]], { hat: 260 + j, lech: 1.6 }));
            dc.gach._kho_dai = null;
          }
        });
        hangEl.forEach((r) => {
          if (!r.sang) return;
          const dauO = r.nhan || r.o[0].o, cuoiO = r.o[r.o.length - 1].o;
          const x = dauO.offsetLeft - (r.nhan ? 14 : 0), y = dauO.offsetTop + 4, w = cuoiO.offsetLeft + cuoiO.offsetWidth - x, h = dauO.offsetHeight - 8;
          const hinh = tay
            ? K.svg('path', { d: K.duongTay(diemHop(x - 6, y, w + 12, h, 14, 120), { hat: 280 + r.i, lech: 2.2, dong: true }), fill: 'none', stroke: m.nhan, 'stroke-width': 3, 'stroke-linecap': 'round' }, svgTo)
            : K.svg('rect', { x: x - 6, y, width: w + 12, height: h, rx: 14, fill: 'none', stroke: m.nhan, 'stroke-width': 4 }, svgTo);
          toHinh.push(hinh);
        });
      });
    }

    function seek(t) {
      veTrangTri();
      dau.seek(t, vao);
      dauCot.forEach((dc, j) => {
        const t0 = tCot + j * 0.15, a = K.eo3(K.tienDo(t, t0, 0.4));
        dc.o.style.opacity = a.toFixed(3);
        dc.o.style.transform = `translateY(${Math.round((1 - K.spr(t - t0, 0.5, 0.65)) * 30)}px)`;
        if (dc.gach && dc.gach.getAttribute('d')) K.veDan(dc.gach, K.eio(K.tienDo(t, t0 + 0.25, 0.5)));
      });
      // nền cột (nét tay) hiện cùng đầu cột
      svgNen.setAttribute('opacity', K.eo3(K.tienDo(t, tCot, 0.5)).toFixed(3));
      hangEl.forEach((r, i) => {
        const t0 = tHang[i];
        const a = K.eo3(K.tienDo(t, t0, 0.35)), dx = Math.round((1 - K.spr(t - t0, 0.45, 0.7)) * -22);
        if (r.nhan) { r.nhan.style.opacity = a.toFixed(3); r.nhan.style.transform = `translateX(${dx}px)`; }
        r.o.forEach((c, j) => {
          const aj = K.eo3(K.tienDo(t, t0 + 0.12 * j, 0.35));
          c.chu.style.opacity = aj.toFixed(3);
          c.chu.style.transform = `translateX(${Math.round((1 - K.spr(t - t0 - 0.12 * j, 0.45, 0.7)) * -22)}px)`;
          c.lop.style.opacity = a.toFixed(3);
          c.o.style.opacity = K.eo3(K.tienDo(t, tCot + j * 0.15, 0.4)).toFixed(3);
          // ô của hàng chưa hiện vẫn giữ nền cột (phẳng) để thẻ cột không thủng; chỉ chữ và dấu chờ mốc
          if (c.bt) c.bt.seek(t - (t0 + 0.12 * j + 0.05));
        });
      });
      const pT = K.eio(K.tienDo(t, tTo, 0.5));
      toHinh.forEach((h) => {
        if (tay) K.veDan(h, pT);
        else { h.setAttribute('opacity', (pT * (0.85 + 0.15 * Math.cos((t - xong) * 2.4) * K.tienDo(t, xong, 0.5))).toFixed(3)); }
      });
    }

    return { el, seek, moc: { x: X, y: Y, rong: W, cot: tCot, moc_hang: tHang, xong } };
  };
})();
