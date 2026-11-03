// chung/khuon_checklist.js — 1.0 — khuôn danh sách điều cần lưu ý: mỗi dòng một ô vuông, dòng hiện dần, dấu tích (hoặc gạch, chấm than, hỏi)
// vẽ dần vào ô theo mốc lời đọc; chữ dòng chuyển từ màu phụ sang màu chính khi được đánh dấu; có một hoặc hai cột.
// Tham số: muc (mảng dòng: chuỗi hoặc { chu, phu (dòng giải thích nhỏ), dau: 'tich' (mặc định) | 'gach' | 'cham_than' | 'hoi', khoa_mau });
//   cot (1 hoặc 2 cột, mặc định 1; 2 khi hơn 5 dòng); dong_nho, tieu_de (đầu trang như khuôn mở đầu); kieu 'phang' | 'net_tay'; mau;
//   x, y, rong (mặc định 140, 90, 1640); co_chu (36, cỡ chữ dòng); vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay);
//   moc_hien (mảng giây hiện từng dòng); moc_dau (mảng giây vẽ dấu từng dòng; mặc định 0,6 s sau khi dòng hiện).
// Dựng mới. Cần bo_bieu_tuong_co_ban (chung/bieu_tuong.js): dấu vẽ bằng KHO.bo_bieu_tuong_co_ban với nen false.
// Trả về { el, seek(t), moc: { x, y, rong, moc_dong: [giây từng dòng], moc_dau: [giây từng dấu], xong } }.
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

  K.khuon_checklist_dieu_can_luu_y = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 140, Y = opt.y != null ? opt.y : 90, W = opt.rong || 1640;
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the;
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6);
    const mauCho = duTuongPhan(K.tron(m.chu, m.chu_phu, 0.75), nenThe, 4.6);
    const ds = (opt.muc || []).map((x) => (typeof x === 'string' ? { chu: x } : x));
    const soCot = opt.cot || (ds.length > 5 ? 2 : 1);
    const co = opt.co_chu || 36, lh = Math.round(co * 1.28), O = 56;
    const KHOA = { tich: 'tot', gach: 'xau', cham_than: 'canh_bao', hoi: 'nhan' };

    const el = K.html('div', { class: 'kho-checklist', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;font-family:${K.PHONG};` });
    const dau = dauTrang(el, m, m.nen, opt.dong_nho, opt.tieu_de, opt.co_tieu_de || 60);
    if (opt.dong_nho || opt.tieu_de) dau.el.style.marginBottom = '36px';

    const the = K.html('div', { 'data-hop': '1', style: `position:relative;box-sizing:border-box;padding:22px 48px 26px;border-radius:24px;` +
      (tay ? '' : `background:${nenThe};box-shadow:0 14px 40px rgba(0,0,0,${m.toi ? 0.35 : 0.07}),0 2px 6px rgba(0,0,0,${m.toi ? 0.2 : 0.04});`) }, el);
    const svgThe = tay ? lopSvg(the) : null;
    const luoi = K.html('div', { style: `position:relative;display:grid;grid-template-columns:repeat(${soCot}, minmax(0, 1fr));column-gap:64px;` }, the);
    const soHang = Math.ceil(ds.length / soCot);

    const dong = ds.map((d, i) => {
      // xếp theo cột: hết cột trái mới sang cột phải
      const c = Math.floor(i / soHang), h = i % soHang;
      const loai = d.dau || 'tich', mauDau = m[d.khoa_mau || KHOA[loai]] || m.tot;
      const r = K.html('div', { style: `position:relative;grid-column:${c + 1};grid-row:${h + 1};display:flex;align-items:flex-start;gap:28px;padding:22px 4px;` +
        `border-top:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, h ? (tay ? 0.25 : 0.08) : 0)};` }, luoi);
      // ô vuông
      const o = K.html('div', { style: `position:relative;flex:none;width:${O}px;height:${O}px;margin-top:${Math.round((lh - O) / 2)}px;` }, r);
      const s = K.svg('svg', { width: O, height: O, style: 'position:absolute;left:0;top:0;overflow:visible;' }, o);
      let nenO = null, vienO = null;
      if (tay) {
        const v = diemHop(4, 4, O - 8, O - 8, 6, 14);
        nenO = K.svg('path', { d: K.duongTay(v, { hat: 400 + i, lech: 1.6, dong: true }) + 'Z', fill: K.rgba(mauDau, 0.16), stroke: 'none' }, s);
        vienO = K.svg('path', { d: K.duongTay(v, { hat: 410 + i, lech: 1.3, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
      } else {
        nenO = K.svg('rect', { x: 3, y: 3, width: O - 6, height: O - 6, rx: 12, fill: K.rgba(mauDau, 0.14), opacity: 0 }, s);
        vienO = K.svg('rect', { x: 3, y: 3, width: O - 6, height: O - 6, rx: 12, fill: 'none', stroke: K.rgba(m.chu, 0.3), 'stroke-width': 3 }, s);
      }
      let bt = null;
      if (K.bo_bieu_tuong_co_ban) {
        const g = K.svg('g', { transform: `translate(${O / 2 + (loai === 'tich' ? 4 : 0)} ${O / 2 - (loai === 'tich' ? 4 : (loai === 'gach' ? 0 : 2))})` }, s);
        bt = K.bo_bieu_tuong_co_ban({ loai, kieu: tay ? 'net_tay' : 'phang', co: loai === 'tich' ? 0.95 : (loai === 'gach' ? 0.78 : 0.62), nen: false, khoa_mau: d.khoa_mau || KHOA[loai], mau: opt.mau, hat: 430 + i * 3, dai: 0.4 });
        g.appendChild(bt.el);
      }
      // chữ
      const khoi = K.html('div', { style: 'position:relative;flex:1 1 auto;min-width:0;' }, r);
      const chu = K.html('div', { style: `font-weight:700;font-size:${co}px;line-height:${lh}px;color:${mauCho};` }, khoi, d.chu || '');
      let phu = null;
      if (d.phu) phu = K.html('div', { style: `margin-top:6px;font-weight:500;font-size:28px;line-height:38px;color:${mauPhu};` }, khoi, d.phu);
      return { r, o, nenO, vienO, bt, chu, phu, i };
    });

    // ----- mốc thời gian -----
    const tThe = vao + 0.15 + (dau.so_tu ? Math.min(0.6, dau.so_tu * 0.045) : 0);
    const mh = opt.moc_hien || [], md = opt.moc_dau || [];
    const tDong = dong.map((r, i) => (tinh ? -100 : (mh[i] != null ? mh[i] : tThe + 0.6 + i * 1.1)));
    const tDau = dong.map((r, i) => (tinh ? -100 : (md[i] != null ? md[i] : tDong[i] + 0.6)));
    const xong = tinh ? 0 : (tDau.length ? Math.max(...tDau) + 0.7 : tThe + 0.5);

    function seek(t) {
      if (tay) khiDoiCo(the, (w, h) => veVienTay(svgThe, w, h, 24, m, nenThe, 470));
      dau.seek(t, vao);
      const aT = K.eo3(K.tienDo(t, tThe, 0.45));
      the.style.opacity = aT.toFixed(3); the.style.transform = `translateY(${Math.round((1 - aT) * 28)}px)`;
      dong.forEach((r, i) => {
        const t0 = tDong[i], a = K.eo3(K.tienDo(t, t0, 0.35));
        r.r.style.opacity = a.toFixed(3);
        r.r.style.transform = `translateX(${Math.round((1 - K.spr(t - t0, 0.45, 0.7)) * -26)}px)`;
        const pD = K.tienDo(t, tDau[i], 0.45);
        if (r.bt) r.bt.seek(t - tDau[i]);
        r.chu.style.color = K.tron(mauCho, mauChu, K.eo3(pD));
        if (!tay) {
          r.nenO.setAttribute('opacity', K.eo3(pD).toFixed(3));
          // ô nảy nhẹ khi dấu vào: chỉ đổi kích thước hình chữ nhật (không phóng chữ)
          const nay = Math.round(4 * Math.sin(Math.PI * K.cl(pD * 1.6)) * (pD < 1 ? 1 : 0) * 10) / 10;
          r.vienO.setAttribute('x', (3 - nay).toFixed(1)); r.vienO.setAttribute('y', (3 - nay).toFixed(1));
          r.vienO.setAttribute('width', (O - 6 + 2 * nay).toFixed(1)); r.vienO.setAttribute('height', (O - 6 + 2 * nay).toFixed(1));
        } else {
          r.nenO.setAttribute('opacity', (0.4 + 0.6 * K.eo3(pD)).toFixed(3));
        }
      });
    }

    return { el, seek, moc: { x: X, y: Y, rong: W, moc_dong: tDong, moc_dau: tDau, xong } };
  };
})();
