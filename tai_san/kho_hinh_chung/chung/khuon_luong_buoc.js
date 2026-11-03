// chung/khuon_luong_buoc.js — 1.0 — khuôn luồng các bước: các ô bước nối bằng mũi tên, ô hiện lần lượt theo mốc lời đọc và ô đang nói
// được làm sáng (viền màu nhấn, nền nhạt, nhấc lên); xếp ngang (tới 5 bước) hoặc dọc; khi xong, nét mũi tên chạy nhẹ theo chiều luồng.
// Tham số: buoc (mảng bước: chuỗi hoặc { ten, mo_ta (dòng giải thích), vai (chip nhỏ: ai làm, ví dụ 'Khách hàng') });
//   bo_cuc 'ngang' (mặc định khi tới 5 bước) | 'doc'; sang_het (true: khi xong mọi ô cùng sáng; mặc định giữ sáng ô cuối);
//   dong_nho, tieu_de (đầu trang như khuôn mở đầu); kieu 'phang' | 'net_tay'; mau; x, y, rong (mặc định 140, 90, 1640);
//   vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay, sáng ô cuối); moc_hien (mảng giây hiện và làm sáng từng bước).
// Dựng mới (ví dụ thủ tục giải ngân, xử lý tài sản bảo đảm, chuyển tiền).
// Trả về { el, seek(t), moc: { x, y, rong, moc_buoc: [giây từng bước], xong } }.
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

  K.khuon_luong_cac_buoc = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 140, Y = opt.y != null ? opt.y : 90, W = opt.rong || 1640;
    const ds = (opt.buoc || []).map((b) => (typeof b === 'string' ? { ten: b } : b));
    const N = ds.length, ngang = opt.bo_cuc ? opt.bo_cuc === 'ngang' : N <= 5;
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the, nenSang = tay ? nenThe : K.tron(m.the, m.nhat, 0.7);
    const mauChu = duTuongPhan(m.chu, nenSang, 7), mauPhu = duTuongPhan(m.chu_phu, nenSang, 4.6), mauNhan = duTuongPhan(m.nhan, nenSang, 4.5);
    // số tròn kiểu phẳng: ô đã qua màu chữ phụ, ô đang sáng màu nhấn; cả hai đậm tới khi chữ trắng đạt tương phản 4,5 (nền sáng)
    const soDam = m.toi ? m.nhan : duTuongPhan(m.nhan, '#FFFFFF', 4.5), soMo = m.toi ? K.tron(m.nhan, m.the, 0.55) : duTuongPhan(K.tron(m.chu_phu, m.nhan, 0.25), '#FFFFFF', 4.5);
    const GAP = ngang ? 72 : 50, coTen = ngang ? (N >= 5 ? 30 : 34) : 34, SO = 52;

    const el = K.html('div', { class: 'kho-luong-buoc', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;font-family:${K.PHONG};` });
    const dau = dauTrang(el, m, m.nen, opt.dong_nho, opt.tieu_de, opt.co_tieu_de || 60);
    if (opt.dong_nho || opt.tieu_de) dau.el.style.marginBottom = ngang ? '48px' : '36px';

    const hang = K.html('div', { style: `position:relative;display:flex;flex-direction:${ngang ? 'row' : 'column'};align-items:stretch;gap:${GAP}px;padding:12px 0;` }, el);
    const svg = lopSvg(hang);
    const lopVien = K.svg('g', null, svg), lopMui = K.svg('g', null, svg);
    const idBong = 'kho-lb-bong-' + Math.round(K.ngauNhien(9)(W + N * 17) * 1e9);
    if (!tay) {
      const fb = K.svg('filter', { id: idBong, x: '-10%', y: '-10%', width: '120%', height: '140%' }, K.defs(svg));
      K.svg('feDropShadow', { dx: 0, dy: 8, stdDeviation: 12, 'flood-color': '#000000', 'flood-opacity': m.toi ? 0.35 : 0.08 }, fb);
    }

    const o = ds.map((b, i) => {
      const box = K.html('div', { 'data-hop': '1', style: `position:relative;${ngang ? 'flex:1 1 0;min-width:0;' : ''}box-sizing:border-box;padding:${ngang ? '26px 26px 28px' : '16px 30px 16px 28px'};` +
        `border-radius:20px;${ngang ? '' : 'display:flex;align-items:flex-start;gap:26px;'}` }, hang);
      const so = K.html('div', { 'data-hop': '1', style: `position:relative;flex:none;width:${SO}px;height:${SO}px;border-radius:50%;display:flex;align-items:center;justify-content:center;` +
        `font-weight:800;font-size:26px;line-height:1;box-sizing:border-box;` }, box);
      const sSo = K.svg('svg', { width: SO, height: SO, style: 'position:absolute;left:0;top:0;overflow:visible;' }, so);
      let soNen = null;
      if (tay) {
        const v = []; for (let k = 0; k <= 24; k++) { const a = -Math.PI / 2 + (k / 24) * Math.PI * 2.1; v.push([SO / 2 + Math.cos(a) * (SO / 2 - 2), SO / 2 + Math.sin(a) * (SO / 2 - 2)]); }
        soNen = K.svg('path', { d: K.duongTay(v, { hat: 500 + i, lech: 1.5 }), fill: K.rgba(m.nhan, 0.18), stroke: m.chu, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, sSo);
      } else soNen = K.svg('circle', { cx: SO / 2, cy: SO / 2, r: SO / 2, fill: m.nhan }, sSo);
      const soChu = K.html('span', { style: 'position:relative;' }, so, String(i + 1));
      const khoi = K.html('div', { style: `position:relative;${ngang ? 'margin-top:20px;' : 'flex:1 1 auto;min-width:0;'}` }, box);
      const ten = K.html('div', { style: `font-weight:800;font-size:${coTen}px;line-height:${Math.round(coTen * 1.25)}px;color:${mauChu};` }, khoi, b.ten || '');
      let moTa = null, vai = null;
      if (b.mo_ta) moTa = K.html('div', { style: `margin-top:8px;font-weight:500;font-size:28px;line-height:38px;color:${mauPhu};` }, khoi, b.mo_ta);
      if (b.vai) {
        vai = K.html('div', { 'data-hop': '1', style: `display:inline-block;margin-top:14px;padding:4px 16px 5px;border-radius:18px;white-space:nowrap;font-weight:600;font-size:24px;line-height:30px;` +
          `color:${duTuongPhan(m.chu_phu, nenSang, 4.6)};border:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, 0.2)};` }, khoi, b.vai);
      }
      return { box, so, soNen, soChu, i, nen: null, vienSang: null, gach: null, mui: null };
    });

    // ----- mốc thời gian -----
    const tThe = vao + 0.2 + (dau.so_tu ? Math.min(0.6, dau.so_tu * 0.045) : 0);
    const mh = opt.moc_hien || [];
    const tB = o.map((r, i) => (tinh ? -100 + i * 0.01 : (mh[i] != null ? mh[i] : tThe + 0.3 + i * 1.3)));
    const xong = tinh ? 0 : (tB.length ? tB[tB.length - 1] + 0.9 : tThe + 0.5);

    // ô và mũi tên vẽ trong SVG sau khi đo vị trí các ô (sau khi gắn vào trang)
    function veTrangTri() {
      khiDoiCo(hang, () => {
        while (lopVien.firstChild) lopVien.removeChild(lopVien.firstChild);
        while (lopMui.firstChild) lopMui.removeChild(lopMui.firstChild);
        o.forEach((r) => {
          const x = r.box.offsetLeft, y = r.box.offsetTop, w = r.box.offsetWidth, h = r.box.offsetHeight;
          const g = K.svg('g', { transform: `translate(${x} ${y})` }, lopVien);
          r.g = g;
          if (tay) {
            const v = diemHop(0, 0, w, h, 18, 110);
            r.nen = K.svg('path', { d: K.duongTay(v, { hat: 520 + r.i, lech: 2.2, dong: true }) + 'Z', fill: nenThe }, g);
            r.gach = K.svg('path', { d: gachHop(6, 6, w - 12, h - 12, 16, 540 + r.i * 30), fill: 'none', stroke: m.nhan, 'stroke-width': 1.6, 'stroke-opacity': 0.22, 'stroke-linecap': 'round' }, g);
            K.svg('path', { d: K.duongTay(v, { hat: 560 + r.i, lech: 1.6, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, g);
            r.vienSang = K.svg('path', { d: K.duongTay(diemHop(-5, -5, w + 10, h + 10, 22, 100), { hat: 580 + r.i, lech: 2.4, dong: true }), fill: 'none', stroke: m.nhan, 'stroke-width': 3.5, 'stroke-linecap': 'round' }, g);
          } else {
            r.nen = K.svg('rect', { x: 0, y: 0, width: w, height: h, rx: 20, fill: nenThe, filter: `url(#${idBong})` }, g);
            r.vienSang = K.svg('rect', { x: 1.5, y: 1.5, width: w - 3, height: h - 3, rx: 19, fill: 'none', stroke: m.nhan, 'stroke-width': 3 }, g);
          }
        });
        // mũi tên giữa hai ô liền nhau
        o.forEach((r, i) => {
          if (i === N - 1) return;
          const a = r.box, b = o[i + 1].box;
          let p0, p1;
          if (ngang) { const y = a.offsetTop + Math.min(a.offsetHeight, b.offsetHeight) * 0.5; p0 = [a.offsetLeft + a.offsetWidth + 10, y]; p1 = [b.offsetLeft - 12, y]; }
          else { const x = a.offsetLeft + 28 + SO / 2; p0 = [x, a.offsetTop + a.offsetHeight + 8]; p1 = [x, b.offsetTop - 10]; }
          const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, nx = -uy, ny = ux, k = 13;
          const dau = [[p1[0] - ux * k + nx * k * 0.8, p1[1] - uy * k + ny * k * 0.8], p1, [p1[0] - ux * k - nx * k * 0.8, p1[1] - uy * k - ny * k * 0.8]];
          const net = { fill: 'none', stroke: duTuongPhan(m.chu_phu, m.nen, 3), 'stroke-width': tay ? 3.2 : 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
          const than = K.svg('path', Object.assign({ d: tay ? K.duongTay([p0, [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2], p1], { hat: 600 + i, lech: 1.4 }) : `M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]}` }, net), lopMui);
          const muiDau = K.svg('path', Object.assign({ d: tay ? K.duongTay(dau, { hat: 620 + i, lech: 0.8 }) : `M${dau[0][0]} ${dau[0][1]} L${dau[1][0]} ${dau[1][1]} L${dau[2][0]} ${dau[2][1]}` }, net), lopMui);
          r.mui = { than, muiDau, L };
        });
      });
    }

    function seek(t) {
      veTrangTri();
      dau.seek(t, vao);
      const sauXong = K.tienDo(t, xong, 0.6);
      o.forEach((r, i) => {
        const t0 = tB[i], a = K.eo3(K.tienDo(t, t0, 0.4));
        const vaoSang = K.eo3(K.tienDo(t, t0 + 0.1, 0.35));
        const roi = i < N - 1 ? K.eo3(K.tienDo(t, tB[i + 1] + 0.1, 0.35)) : 0;
        const sang = opt.sang_het ? Math.max(vaoSang * (1 - roi), sauXong) : vaoSang * (1 - roi);
        const nhac = Math.round(-10 * sang) + Math.round((1 - K.spr(t - t0, 0.5, 0.65)) * 34);
        r.box.style.opacity = a.toFixed(3);
        r.box.style.transform = `translateY(${nhac}px)`;
        if (r.g) {
          r.g.setAttribute('opacity', a.toFixed(3));
          r.g.setAttribute('transform', `translate(${r.box.offsetLeft} ${r.box.offsetTop + nhac})`);
          if (!tay) r.nen.setAttribute('fill', K.tron(nenThe, nenSang, sang));
          else r.gach.setAttribute('opacity', sang.toFixed(3));
          r.vienSang.setAttribute('opacity', sang.toFixed(3));
        }
        // số: ô đã qua mờ đi một chút, ô đang sáng đậm màu nhấn
        if (!tay) { const f = K.tron(soMo, soDam, sang); r.soNen.setAttribute('fill', f); r.soChu.style.color = K.chuTren(f, '#FFFFFF', m.chu); }
        else { r.soNen.setAttribute('fill', K.rgba(m.nhan, (0.12 + 0.4 * sang).toFixed(3))); r.soChu.style.color = mauChu; }
        if (r.mui) {
          // mũi tên vẽ từ ô này sang ô sau ngay trước khi ô sau hiện
          const p = K.eio(K.tienDo(t, tB[i + 1] - 0.35, 0.35));
          K.veDan(r.mui.than, p);
          r.mui.muiDau.setAttribute('opacity', K.cl((p - 0.8) / 0.2).toFixed(3));
          // khi xong: nét thân chạy nhẹ theo chiều luồng (gạch đứt trượt), vẫn là hàm của t
          if (sauXong > 0) { r.mui.than.style.strokeDasharray = '14 10'; r.mui.than.style.strokeDashoffset = (-((t - xong) * 28) % 24).toFixed(2); r.mui.than.setAttribute('stroke-opacity', (1 - 0.25 * sauXong).toFixed(3)); }
          else r.mui.than.setAttribute('stroke-opacity', '1');
        }
      });
    }

    return { el, seek, moc: { x: X, y: Y, rong: W, moc_buoc: tB, xong } };
  };
})();
