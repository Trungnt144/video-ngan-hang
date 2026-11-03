// chung/so_do_dong_tien.js — 1.0 — sơ đồ dòng tiền giữa các bên: mỗi bên là một hộp tên (hoặc chỉ nhãn, để trang tự đặt hình minh hoạ),
// mỗi dòng là một mũi tên thẳng hoặc cong vẽ dần, có nhãn (việc gì, bao nhiêu tiền) và hạt tiền chạy dọc theo mũi tên.
// Dùng cho: hai ngân hàng cho vay qua đêm; ngân hàng và VAMC đổi nợ lấy trái phiếu đặc biệt; máy ATM → NAPAS → ngân hàng phát hành;
// một giao dịch thẻ tách thành phần của chủ thẻ, cửa hàng, ngân hàng thanh toán, ngân hàng phát hành, hãng thẻ; ba bên góp tiền vào một ưu đãi;
// quan hệ ba bên (bảo lãnh, L/C). Thay cho mục đề xuất khuon_quan_he_ba_ben và dong_tien_chay.
// Gọi: KHO.so_do_dong_tien_cac_ben({ nut, dong, kieu, mau, vao, tinh });  bí danh KHO.so_do_dong_tien.
//   nut: mảng bên { id, ten, phu (dòng nhỏ), x, y (TÂM hộp trong sân khấu 1920×1080), rong (mặc định theo chữ, 200–380), khoa_mau (dải màu đầu hộp,
//        mặc định chu), chi_nhan (true: không vẽ hộp, chỉ một nhãn tên — trang tự vẽ toà nhà, người... tại x, y), moc (giây hiện), to, het_to (giây tô sáng) };
//   dong: mảng dòng { tu, den (id bên), nhan (chữ việc), so (chữ số tiền), khoa_mau (mặc định nhan), cong (độ cong −1..1, mặc định 0; tự đặt 0,22 khi có dòng ngược chiều),
//        moc (giây bắt đầu vẽ), dai (giây vẽ, mặc định 0,7), het (giây ẩn dòng), chay (hạt tiền chạy, mặc định true), so_hat (3), chu_ky (giây một vòng, 1,8),
//        day (độ dày nét, 5), net ('lien' | 'dut'), vi_tri_nhan (0..1 trên đường, mặc định 0,5), lech_nhan (px lệch khỏi đường, mặc định 40; âm là phía kia) };
//   kieu 'phang' | 'net_tay'; vao: giây bắt đầu; tinh: true hiện đủ (hạt tiền vẫn chạy theo t).
// Trả về { el, seek(t), moc: { nut: { id: { x, y, w, h, tam } }, dong: [{ dau, cuoi, giua }], xong } } — toạ độ sân khấu.
// Phần tử el là HTML phủ cả sân khấu (hợp đồng mục 7): hộp và nhãn là HTML có data-hop, mũi tên và hạt tiền là SVG. Không đo DOM để dàn trang.
// Dựng mới (02/11/2026, lô N168–N180).
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
  // giao của tia từ tâm hộp theo hướng (dx, dy) với viền hộp nới thêm `nl`
  function raVien(n, dx, dy, nl) {
    const hw = n.w / 2 + nl, hh = n.h / 2 + nl, L = Math.hypot(dx, dy) || 1;
    dx /= L; dy /= L;
    const k = Math.min(Math.abs(dx) > 1e-6 ? hw / Math.abs(dx) : 1e9, Math.abs(dy) > 1e-6 ? hh / Math.abs(dy) : 1e9);
    return [n.x + dx * k, n.y + dy * k];
  }

  K.so_do_dong_tien_cac_ben = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the;
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6);

    const el = K.html('div', { class: 'kho-so-do-dong-tien', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;font-family:${K.PHONG};pointer-events:none;` });
    const svg = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const gNen = K.svg('g', null, svg), gDong = K.svg('g', null, svg), gHat = K.svg('g', null, svg);
    const lop = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);
    const svgTren = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);

    // ----- các bên -----
    const nut = (opt.nut || []).map((n0, i) => {
      const n = Object.assign({}, n0);
      const coT = 30, coP = 22;
      const rongChu = Math.max(K.doChu(n.ten || '', coT, 800), n.phu ? K.doChu(n.phu, coP, 600) : 0);
      n.w = n.rong || K.cl(Math.ceil(rongChu) + 60, 200, 380);
      const dongT = K.xuongDong(n.ten || '', n.w - 44, coT, 800), dongP = n.phu ? K.xuongDong(n.phu, n.w - 44, coP, 600) : [];
      if (n.chi_nhan) { n.w = Math.min(n.w, K.cl(Math.ceil(rongChu) + 60, 120, 380)); n.h = 22 + dongT.length * 38 + (dongP.length ? dongP.length * 28 + 2 : 0); }
      else n.h = 40 + dongT.length * 38 + (dongP.length ? dongP.length * 28 + 4 : 0) + 8;
      const mc = m[n.khoa_mau || 'chu'] || m.chu;
      n.mc = mc;
      const x0 = n.x - n.w / 2, y0 = n.y - n.h / 2;
      n.div = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x0}px;top:${y0}px;width:${n.w}px;height:${n.h}px;box-sizing:border-box;border-radius:${n.chi_nhan ? 999 : 18}px;` +
        `display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:${n.chi_nhan ? '8px 20px' : '14px 22px 8px'};${n.chi_nhan && dongT.length === 1 ? 'white-space:nowrap;' : ''}` +
        (tay ? '' : (n.chi_nhan ? `background:${K.rgba(nenThe, 0.92)};border:2px solid ${K.rgba(m.chu, 0.25)};` : `background:${nenThe};border:3px solid ${K.rgba(mc, 0.55)};box-shadow:0 10px 26px ${K.rgba('#000000', m.toi ? 0.35 : 0.1)};`)) }, lop);
      if (!n.chi_nhan && !tay) K.html('div', { style: `position:absolute;left:18px;right:18px;top:0;height:7px;border-radius:0 0 6px 6px;background:${mc};` }, n.div);
      K.html('div', { style: `font-weight:800;font-size:${coT}px;line-height:38px;color:${mauChu};` }, n.div, n.ten || '');
      if (n.phu) K.html('div', { style: `margin-top:2px;font-weight:600;font-size:${coP}px;line-height:28px;color:${mauPhu};` }, n.div, n.phu);
      n.g = K.svg('g', null, gNen);
      if (tay) {
        const r = n.chi_nhan ? Math.min(n.h / 2, 30) : 18;
        if (!n.chi_nhan) K.svg('path', { d: K.duongTay(diemHop(x0 + 7, y0 + 9, n.w, n.h, r, 120), { hat: 800 + i * 11, lech: 2.4, dong: true }) + 'Z', fill: K.rgba(m.chu, 0.07) }, n.g);
        K.svg('path', { d: K.duongTay(diemHop(x0, y0, n.w, n.h, r, 120), { hat: 801 + i * 11, lech: 2, dong: true }) + 'Z', fill: nenThe }, n.g);
        K.svg('path', { d: K.duongTay(diemHop(x0, y0, n.w, n.h, r, 100), { hat: 802 + i * 11, lech: 1.8, dong: true }), fill: 'none', stroke: n.chi_nhan ? K.rgba(m.chu, 0.5) : m.chu, 'stroke-width': n.chi_nhan ? 2 : 2.8, 'stroke-linecap': 'round' }, n.g);
        if (!n.chi_nhan && n.khoa_mau) K.svg('path', { d: K.duongTay([[x0 + 22, y0 + 10], [x0 + n.w / 2, y0 + 12], [x0 + n.w - 22, y0 + 9]], { hat: 803 + i * 11, lech: 1.2 }), fill: 'none', stroke: mc, 'stroke-width': 6, 'stroke-linecap': 'round' }, n.g);
        const v = [];
        for (let k = 0; k <= 36; k++) { const a = -Math.PI * 0.95 + (k / 36) * Math.PI * 2.12; v.push([n.x + Math.cos(a) * (n.w / 2 + 22), n.y + Math.sin(a) * (n.h / 2 + 20)]); }
        n.vong = K.svg('path', { d: K.duongTay(v, { hat: 804 + i * 11, lech: 2 }), fill: 'none', stroke: m.nhan, 'stroke-width': 4, 'stroke-linecap': 'round' }, svgTren);
      }
      n.t0 = tinh ? -100 : (n.moc != null ? n.moc : vao + 0.2 + i * 0.3);
      return n;
    });
    const theoId = Object.fromEntries(nut.map((n) => [n.id, n]));

    // ----- các dòng -----
    const dsDong = (opt.dong || []).map((d0, i, all) => {
      const d = Object.assign({}, d0);
      const a = theoId[d.tu], b = theoId[d.den];
      if (!a || !b) throw new Error(`so_do_dong_tien: dòng ${i} trỏ tới bên không có (${d.tu} → ${d.den})`);
      const nguoc = all.some((e) => e.tu === d.den && e.den === d.tu);
      const cong = d.cong != null ? d.cong : (nguoc ? 0.22 : 0);
      const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
      const cx = (a.x + b.x) / 2 + nx * cong * L, cy = (a.y + b.y) / 2 + ny * cong * L;
      const s = raVien(a, cx - a.x, cy - a.y, 14), e = raVien(b, cx - b.x, cy - b.y, 20);
      const mc = m[d.khoa_mau || 'nhan'] || m.nhan, day = d.day || 5;
      d.mc = mc; d.a = a; d.b = b;
      d.dPath = `M${s[0].toFixed(1)} ${s[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${e[0].toFixed(1)} ${e[1].toFixed(1)}`;
      d.g = K.svg('g', null, gDong);
      d.duong = K.svg('path', { d: d.dPath, fill: 'none', stroke: 'none' }, d.g);   // đường đo (không vẽ)
      let dVe = d.dPath;
      if (tay) {
        const pts = [];
        for (let k = 0; k <= 16; k++) { const u = k / 16, v = 1 - u; pts.push([v * v * s[0] + 2 * v * u * cx + u * u * e[0], v * v * s[1] + 2 * v * u * cy + u * u * e[1]]); }
        dVe = K.duongTay(pts, { hat: 900 + i * 7, lech: 1.4 });
      }
      d.ve = K.svg('path', { d: dVe, fill: 'none', stroke: mc, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-dasharray': d.net === 'dut' ? `${day * 3} ${day * 2.4}` : null }, d.g);
      d.dau_mt = K.svg('path', { d: `M0 0 L${-day * 4.2} ${-day * 2.4} L${-day * 3.2} 0 L${-day * 4.2} ${day * 2.4} Z`, fill: mc, stroke: tay ? m.chu : 'none', 'stroke-width': tay ? 1.5 : 0, 'stroke-linejoin': 'round' }, d.g);
      d.L = null;
      // hạt tiền
      d.hat = [];
      const soHat = d.chay === false ? 0 : (d.so_hat != null ? d.so_hat : 3);
      for (let k = 0; k < soHat; k++) {
        const g = K.svg('g', null, gHat);
        K.svg('circle', { r: 13, fill: tay ? K.tron(m.canh_bao, m.giay, 0.3) : m.canh_bao, stroke: tay ? m.chu : K.tron(m.canh_bao, '#000000', 0.35), 'stroke-width': 2 }, g);
        K.chu(g, 'đ', { x: 0, y: 6, co: 18, dam: 800, neo: 'middle', mau: K.chuTren(m.canh_bao, '#FFFFFF', '#141414') });
        d.hat.push(g);
      }
      // nhãn
      if (d.nhan || d.so) {
        d.nhanEl = K.html('div', { 'data-hop': '1', style: `position:absolute;left:0;top:0;transform-origin:50% 50%;box-sizing:border-box;padding:8px 18px;border-radius:14px;white-space:nowrap;text-align:center;` +
          (tay ? `background:${K.rgba(nenThe, 0.94)};border:2px dashed ${K.rgba(mc, 0.8)};` : `background:${nenThe};border:2px solid ${K.rgba(mc, 0.6)};box-shadow:0 6px 16px ${K.rgba('#000000', m.toi ? 0.3 : 0.08)};`) }, lop);
        if (d.nhan) K.html('div', { style: `font-weight:700;font-size:24px;line-height:30px;color:${mauChu};` }, d.nhanEl, d.nhan);
        if (d.so) K.html('div', { style: `font-weight:800;font-size:26px;line-height:32px;color:${duTuongPhan(mc, nenThe, 4.5)};` }, d.nhanEl, d.so);
        const coN = d.nhan ? 24 : 0, coS = d.so ? 26 : 0;
        d.wNhan = Math.max(d.nhan ? K.doChu(d.nhan, coN, 700) : 0, d.so ? K.doChu(d.so, coS, 800) : 0) + 40;
        d.hNhan = 16 + (d.nhan ? 30 : 0) + (d.so ? 32 : 0);
      }
      d.cong_dung = cong;
      return d;
    });
    dsDong.forEach((d, i) => {
      d.t0 = tinh ? -100 : (d.moc != null ? d.moc : Math.max(d.a.t0, d.b.t0) + 0.5 + i * 0.7);
      d.dai_ve = d.dai || 0.7;
    });
    const xong = tinh ? 0 : Math.max(nut.length ? Math.max(...nut.map((n) => n.t0)) : 0, dsDong.length ? Math.max(...dsDong.map((d) => d.t0 + d.dai_ve)) : 0) + 0.5;

    // đo chiều dài một lần sau khi đã gắn vào trang (đo trước khi gắn có thể ra 0 nên không giữ số 0)
    function doDai(d) { if (!d.L) { try { d.L = d.duong.getTotalLength(); } catch (e) { d.L = 0; } } return d.L; }
    function diem(d, p) {
      const L = doDai(d);
      if (!L) return { x: 0, y: 0, goc: 0 };
      const q = d.duong.getPointAtLength(K.cl(p) * L), q2 = d.duong.getPointAtLength(Math.min(L, K.cl(p) * L + 1)), q1 = d.duong.getPointAtLength(Math.max(0, K.cl(p) * L - 1));
      return { x: q.x, y: q.y, goc: Math.atan2(q2.y - q1.y, q2.x - q1.x) };
    }

    function seek(t) {
      nut.forEach((n) => {
        const tt = t - n.t0, a = K.eo3(K.tienDo(tt, 0, 0.35)), sc = 0.85 + 0.15 * K.spr(tt, 0.5, 0.65);
        let to = 0;
        if (n.to != null) to = K.eo3(K.tienDo(t, n.to, 0.35)) * (n.het_to != null ? 1 - K.eo3(K.tienDo(t, n.het_to, 0.35)) : 1);
        const s = sc * (1 + 0.05 * to);
        n.div.style.opacity = a.toFixed(3); n.div.style.transform = `scale(${s.toFixed(4)})`;
        if (!tay) n.div.style.outline = to > 0.001 ? `${(5 * to).toFixed(1)}px solid ${K.rgba(m.nhan, 0.9)}` : 'none';
        if (!tay) n.div.style.outlineOffset = '6px';
        n.g.setAttribute('opacity', a.toFixed(3));
        n.g.setAttribute('transform', `translate(${n.x} ${n.y}) scale(${s.toFixed(4)}) translate(${-n.x} ${-n.y})`);
        if (n.vong) { n.vong.style.display = to > 0.001 ? '' : 'none'; if (to > 0.001) K.veDan(n.vong, K.eio(K.tienDo(t, n.to, 0.6)) * (n.het_to != null ? 1 - K.tienDo(t, n.het_to, 0.3) : 1)); }
      });
      dsDong.forEach((d) => {
        const p = K.eio(K.tienDo(t, d.t0, d.dai_ve));
        const an = d.het != null ? 1 - K.eo3(K.tienDo(t, d.het, 0.35)) : 1;
        d.g.setAttribute('opacity', an.toFixed(3));
        // nét liền vẽ dần; nét đứt hiện mờ dần và trôi theo chiều dòng
        if (d.net === 'dut') { d.ve.style.strokeDashoffset = (-(t - d.t0) * 40).toFixed(1); d.ve.setAttribute('opacity', p.toFixed(3)); } else K.veDan(d.ve, p);
        const tip = diem(d, p);
        d.dau_mt.setAttribute('transform', `translate(${tip.x.toFixed(1)} ${tip.y.toFixed(1)}) rotate(${(tip.goc * 180 / Math.PI).toFixed(2)})`);
        d.dau_mt.setAttribute('opacity', p > 0.02 ? 1 : 0);
        // hạt tiền chạy sau khi vẽ xong
        const ck = d.chu_ky || 1.8, tChay = t - (d.t0 + d.dai_ve);
        d.hat.forEach((g, k) => {
          if (tChay <= 0 || an < 0.01) { g.setAttribute('opacity', 0); return; }
          const f = ((tChay / ck + k / d.hat.length) % 1 + 1) % 1;
          const q = diem(d, 0.04 + f * 0.86);
          const vao2 = K.cl(tChay / 0.4);
          g.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)})`);
          g.setAttribute('opacity', (Math.sin(Math.PI * f) * 1.4 > 1 ? 1 : Math.sin(Math.PI * f) * 1.4) * vao2 * an);
        });
        if (d.nhanEl) {
          const vt = d.vi_tri_nhan != null ? d.vi_tri_nhan : 0.5, q = diem(d, vt);
          let nx = -Math.sin(q.goc), ny = Math.cos(q.goc);
          // mặc định đặt nhãn về phía lồi của đường cong; đường thẳng thì phía trên (hoặc bên phải nếu đường gần dọc)
          if (d.cong_dung !== 0) { const s = d.cong_dung > 0 ? 1 : -1; nx *= s; ny *= s; } else if (ny > 0.01 || (Math.abs(ny) <= 0.01 && nx < 0)) { nx = -nx; ny = -ny; }
          const lech = d.lech_nhan != null ? d.lech_nhan : 40;
          const kc = lech + Math.abs(nx) * d.wNhan / 2 + Math.abs(ny) * d.hNhan / 2;
          const sgn = lech < 0 ? -1 : 1;
          const cx = q.x + nx * kc * sgn, cy = q.y + ny * kc * sgn;
          const a = K.eo3(K.tienDo(t, d.t0 + d.dai_ve * 0.6, 0.35)) * an;
          d.nhanEl.style.left = (cx - d.wNhan / 2).toFixed(1) + 'px'; d.nhanEl.style.top = (cy - d.hNhan / 2).toFixed(1) + 'px';
          d.nhanEl.style.width = d.wNhan + 'px';
          d.nhanEl.style.opacity = a.toFixed(3);
          d.nhanEl.style.transform = `scale(${(0.9 + 0.1 * K.spr(t - d.t0 - d.dai_ve * 0.6, 0.45, 0.7)).toFixed(4)})`;
        }
      });
    }

    const mocNut = {};
    nut.forEach((n) => { mocNut[n.id] = { x: n.x - n.w / 2, y: n.y - n.h / 2, w: n.w, h: n.h, tam: [n.x, n.y] }; });
    return {
      el, seek,
      moc: {
        nut: mocNut,
        // đọc sau khi el đã gắn vào trang
        get dong() { return dsDong.map((d) => { const a = diem(d, 0), b = diem(d, 1), c = diem(d, 0.5); return { dau: [a.x, a.y], cuoi: [b.x, b.y], giua: [c.x, c.y] }; }); },
        xong,
      },
    };
  };
  K.so_do_dong_tien = K.so_do_dong_tien_cac_ben;
})();
