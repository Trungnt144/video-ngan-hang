// chung/khuon_canh_ket.js — 1.0 — khuôn cảnh kết "tóm lại": dòng tên loạt, tiêu đề, hai đến bốn ý cần nhớ hiện dần thành thẻ có số,
// dòng trỏ sang video tiếp theo; khung cuối đứng yên vẫn có chuyển động nhẹ (mũi tên nhích, vòng quanh số thở).
// Tham số: y_chinh (mảng 2–4 câu ý cần nhớ); tieu_de ('Tóm lại'); ten_loat (dòng nhỏ có vạch nhấn, như khuôn mở đầu);
//   tro_sang (chuỗi tên video tiếp theo, hoặc { nhan: 'Xem tiếp', ten }); kieu 'phang' | 'net_tay'; mau;
//   x, y, rong, cao (vùng đặt, mặc định 0, 0, 1920, 900: chừa dải phụ đề); co_y (cỡ chữ ý, 36; tự hạ tới 30 khi một ý quá 5 dòng);
//   vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay); moc_hien (mảng giây hiện từng ý); moc_tro (giây hiện dòng trỏ).
// Dựng mới, cùng ngôn ngữ hình với chung/khuon_canh_mo_dau.js (lề 7,3%, dòng tên loạt 28 px, chữ 800, màu nhấn, chữ mọc từng từ).
// Trả về { el, seek(t), moc: { x, y, rong, cao, moc_y: [giây từng ý], tro: giây dòng trỏ, xong } }.
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

  K.khuon_canh_ket_tom_lai = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x || 0, Y = opt.y || 0, W = opt.rong || 1920, H = opt.cao || 900;
    const LE = Math.round(W * 0.073), rongTrong = W - LE * 2;
    const nen = m.nen, nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the;
    const mauChuThe = duTuongPhan(m.chu, nenThe, 7);
    const ds = (opt.y_chinh || []).slice(0, 4), n = Math.max(1, ds.length);
    const GAP = 32, PADT = 34, rongThe = Math.floor((rongTrong - GAP * (n - 1)) / n);
    let coY = opt.co_y || 36;
    while (coY > 30 && ds.some((s) => K.xuongDong(s, rongThe - PADT * 2 - 8, coY, 700).length > 5)) coY -= 2;

    const el = K.html('div', { class: 'kho-canh-ket', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;height:${H}px;font-family:${K.PHONG};` });
    // dòng tên loạt cố định ở trên (như khuôn mở đầu); tiêu đề, thẻ và dòng trỏ căn giữa theo chiều dọc trong phần còn lại
    const khoiLoat = K.html('div', { style: `position:absolute;left:${LE}px;top:${Math.round(H * 0.1)}px;width:${rongTrong}px;` }, el);
    const loat = dauTrang(khoiLoat, m, nen, opt.ten_loat, null, 0);
    const tren = Math.round(H * 0.1) + 70;
    const khoi = K.html('div', { style: `position:absolute;left:${LE}px;top:${tren}px;width:${rongTrong}px;height:${H - tren - 20}px;display:flex;flex-direction:column;justify-content:center;` }, el);
    const dau = dauTrang(khoi, m, nen, null, opt.tieu_de != null ? opt.tieu_de : 'Tóm lại', opt.co_tieu_de || 72);

    // ----- các thẻ ý -----
    const hangThe = K.html('div', { style: `position:relative;margin-top:44px;display:flex;align-items:stretch;gap:${GAP}px;` }, khoi);
    const the = ds.map((s, i) => {
      const th = K.html('div', { 'data-hop': '1', style: `position:relative;flex:0 0 ${rongThe}px;box-sizing:border-box;padding:${PADT + 6}px ${PADT}px ${PADT}px;border-radius:22px;` +
        (tay ? '' : `background:${nenThe};box-shadow:0 12px 34px rgba(0,0,0,${m.toi ? 0.35 : 0.07}),0 2px 6px rgba(0,0,0,${m.toi ? 0.2 : 0.04});overflow:hidden;`) }, hangThe);
      const svg = tay ? lopSvg(th) : null;
      if (!tay) K.html('div', { style: `position:absolute;left:0;top:0;right:0;height:8px;background:${m.nhan};` }, th);
      // số tròn
      const so = K.html('div', { 'data-hop': '1', style: `position:relative;width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;` +
        `font-weight:800;font-size:36px;line-height:1;` + (tay ? `color:${mauChuThe};` : `background:${m.nhan};color:${K.chuTren(m.nhan, '#FFFFFF', m.chu)};`) }, th);
      let vong = null;
      const sSo = K.svg('svg', { width: 72, height: 72, style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;' });
      so.appendChild(sSo);
      if (tay) {
        K.svg('path', { d: gachHop(14, 14, 44, 44, 8, 120 + i * 9), fill: 'none', stroke: m.nhan, 'stroke-width': 1.6, 'stroke-opacity': 0.35, 'stroke-linecap': 'round' }, sSo);
        const v = []; for (let k = 0; k <= 28; k++) { const a = -Math.PI / 2 + (k / 28) * Math.PI * 2.1; v.push([36 + Math.cos(a) * 33, 36 + Math.sin(a) * 33]); }
        vong = K.svg('path', { d: K.duongTay(v, { hat: 130 + i, lech: 1.6 }), fill: 'none', stroke: m.nhan, 'stroke-width': 3, 'stroke-linecap': 'round' }, sSo);
      } else vong = K.svg('circle', { cx: 36, cy: 36, r: 36, fill: 'none', stroke: m.nhan, 'stroke-width': 2, 'stroke-opacity': 0 }, sSo);
      K.html('span', { style: 'position:relative;' }, so, String(i + 1));
      const chu = K.html('div', { style: `position:relative;margin-top:26px;font-weight:700;font-size:${coY}px;line-height:${Math.round(coY * 1.3)}px;color:${mauChuThe};` }, th);
      const tu = datTu(chu, s);
      return { th, svg, so, vong, tu, i };
    });

    // ----- dòng trỏ sang video khác -----
    const tro = typeof opt.tro_sang === 'string' ? { ten: opt.tro_sang } : (opt.tro_sang || null);
    let hangTro = null, muiTro = null, pillTro = null, svgPill = null;
    if (tro && tro.ten) {
      hangTro = K.html('div', { style: 'position:relative;margin-top:48px;display:flex;align-items:center;gap:24px;' }, khoi);
      K.html('div', { style: `flex:none;font-weight:600;font-size:30px;letter-spacing:0.02em;color:${duTuongPhan(m.chu_phu, nen, 4.6)};white-space:nowrap;` }, hangTro, tro.nhan || 'Xem tiếp');
      const oMui = K.html('div', { style: 'position:relative;flex:none;width:78px;height:40px;' }, hangTro);
      const sm = K.svg('svg', { width: 78, height: 40, style: 'position:absolute;left:0;top:0;overflow:visible;' }, oMui);
      muiTro = K.svg('g', null, sm);
      const net = { fill: 'none', stroke: m.nhan, 'stroke-width': tay ? 4 : 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
      K.svg('path', Object.assign({ d: tay ? K.duongTay([[4, 21], [38, 19], [70, 20]], { hat: 140, lech: 1.4 }) : 'M4 20 L70 20' }, net), muiTro);
      K.svg('path', Object.assign({ d: tay ? K.duongTay([[54, 6], [71, 20], [55, 34]], { hat: 141, lech: 1.2 }) : 'M54 6 L71 20 L54 34' }, net), muiTro);
      const nenPill = tay ? K.tron(nen, m.giay, 0.6) : K.tron(m.the, m.nhat, 0.6);
      pillTro = K.html('div', { 'data-hop': '1', style: `position:relative;flex:0 1 auto;min-width:0;box-sizing:border-box;padding:14px 34px 16px;border-radius:40px;` +
        `font-weight:800;font-size:38px;line-height:48px;color:${duTuongPhan(m.chu, nenPill, 7)};` +
        (tay ? '' : `background:${nenPill};border:3px solid ${m.nhan};`) }, hangTro);
      if (tay) svgPill = lopSvg(pillTro);
      K.html('span', { style: 'position:relative;' }, pillTro, tro.ten);
    }

    // ----- mốc thời gian -----
    const mh = opt.moc_hien || [];
    const tDau = vao, tThe0 = vao + 0.35 + Math.min(0.6, dau.so_tu * 0.045);
    const tY = the.map((r, i) => (tinh ? -100 : (mh[i] != null ? mh[i] : tThe0 + 0.5 + i * 1.1)));
    const tTro = tinh ? -100 : (opt.moc_tro != null ? opt.moc_tro : (tY.length ? tY[tY.length - 1] : tThe0) + 0.4 + (the.length ? the[the.length - 1].tu.length * 0.05 : 0) + 0.6);
    const xong = tinh ? 0 : (hangTro ? tTro + 0.8 : (tY.length ? tY[tY.length - 1] + 1.2 : tThe0));

    function veTrangTri() {
      the.forEach((r) => { if (tay) khiDoiCo(r.th, (w, h) => veVienTay(r.svg, w, h, 22, m, nenThe, 150 + r.i * 5)); });
      if (svgPill) khiDoiCo(pillTro, (w, h) => {
        while (svgPill.firstChild) svgPill.removeChild(svgPill.firstChild);
        K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, h / 2, 90), { hat: 170, lech: 2, dong: true }) + 'Z', fill: K.rgba(m.nhat, 0.75), stroke: 'none' }, svgPill);
        K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, h / 2, 80), { hat: 171, lech: 1.6, dong: true }), fill: 'none', stroke: m.nhan, 'stroke-width': 3, 'stroke-linecap': 'round' }, svgPill);
      });
    }

    function seek(t) {
      veTrangTri();
      loat.seek(t, tDau); dau.seek(t, tDau);
      const sauXong = K.tienDo(t, xong, 0.6);
      the.forEach((r, i) => {
        const t0 = tY[i], a = K.eo3(K.tienDo(t, t0, 0.4));
        r.th.style.opacity = a.toFixed(3);
        r.th.style.transform = `translateY(${Math.round((1 - K.spr(t - t0, 0.5, 0.62)) * 40)}px)`;
        const aS = K.eob(K.tienDo(t, t0 + 0.15, 0.4), 1.4);
        r.so.style.opacity = K.cl(aS).toFixed(3);
        r.tu.forEach((s, j) => hienTu(s, t, t0 + 0.3 + j * 0.05, 16));
        // thở nhẹ sau khi xong: vòng quanh số lan ra rồi mờ đi, mỗi thẻ lệch pha
        const pha = ((t - xong - i * 0.35) % 2.4 + 2.4) % 2.4 / 2.4;
        if (tay) {
          K.veDan(r.vong, K.eio(K.tienDo(t, t0 + 0.2, 0.5)));
          r.vong.setAttribute('stroke-opacity', (1 - 0.35 * sauXong * Math.sin(pha * Math.PI)).toFixed(3));
        } else {
          r.vong.setAttribute('r', (36 + 14 * pha).toFixed(2));
          r.vong.setAttribute('stroke-opacity', (0.55 * (1 - pha) * sauXong).toFixed(3));
        }
      });
      if (hangTro) {
        const a = K.eo3(K.tienDo(t, tTro, 0.4));
        hangTro.style.opacity = a.toFixed(3);
        hangTro.style.transform = `translateX(${Math.round((1 - K.spr(t - tTro, 0.5, 0.65)) * -36)}px)`;
        const nhich = 7 * Math.max(0, Math.sin((t - xong) * 3.2)) * sauXong;
        muiTro.setAttribute('transform', `translate(${(-24 * (1 - K.eo3(K.tienDo(t, tTro + 0.15, 0.4))) + nhich).toFixed(2)} 0)`);
      }
    }

    return { el, seek, moc: { x: X, y: Y, rong: W, cao: H, moc_y: tY, tro: tTro, xong } };
  };
})();
