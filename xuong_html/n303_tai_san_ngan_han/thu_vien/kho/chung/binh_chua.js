// chung/binh_chua.js — 1.0 — bình chứa có mực chất lỏng dâng, rút theo tham số thời gian; vạch trần (hạn mức) có nhãn; nhãn mực hiện giá trị; vượt trần thì đổi màu cảnh báo.
// Dùng cho hạn mức tín dụng, dư nợ đã dùng, quỹ dự phòng, room tín dụng, dự trữ bắt buộc.
// Gọi: KHO.binh_chua_muc_nuoc(opt) → { el (<g> SVG), seek(t), moc, mucTai(t) }.
// Kích thước chuẩn: bình rong × cao (mặc định 220 × 380 đơn vị), gốc toạ độ ở giữa đáy bình; nhãn bên phải bình (hoặc bên trái khi ben_nhan 'trai').
// Tham số:
//   kieu 'phang' | 'net_tay'; mau (ghi đè bảng màu); khoa_mau (màu chất lỏng, mặc định 'nhan'); rong, cao;
//   muc (mực sau khi đổ vào, 0..1, mặc định 0,5); muc_dau (mực lúc bắt đầu, mặc định 0: bình đổ đầy dần khi vào); dai_vao (giây đổ vào, mặc định 1,2);
//   chuyen: [{ luc (giây, tính từ lúc hình xuất hiện), muc (0..1, được quá 1 một chút để tràn), dai (giây, mặc định 0,9) }] các lần dâng, rút tiếp theo;
//   tran (0..1, vạch trần, tuỳ chọn), nhan_tran (chữ vạch trần, ví dụ "Hạn mức 500 triệu"); canh_bao_vuot (mặc định true: vượt trần thì chất lỏng ngả sang màu xau);
//   gia_tri_toi_da (giá trị ứng với mực 1, để tính nhãn), dinh_dang (hàm số → chữ, mặc định KHO.soTien bỏ chữ "đồng"), nhan_muc (mẫu chữ nhãn mực, {gt} là giá trị, {pt} là phần trăm;
//     mặc định "{gt}" khi có gia_tri_toi_da, ngược lại "{pt}"; false để ẩn); ten (tên bình dưới đáy, tuỳ chọn); vach_chia (true: vạch chia trên thành bình, mặc định true);
//   ben_nhan 'phai' | 'trai'; vao (giây bắt đầu, -1 hiện đủ), tinh (true hiện đủ); hat (hạt giống nét tay).
// Điểm neo (moc): day [0,0]; mieng [0,-cao]; mat_nuoc(t) → [x,y] giữa mặt chất lỏng ở giây t; tran [x,y] đầu vạch trần phía nhãn (hoặc null); ten [x,y].
// Dựng mới 29/10/2026 (bản N100 gắn trạng thái toàn cục, khó tách).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // ---------- hàm nội bộ (đề xuất gom vào kho_nen.js) ----------
  let demId = 0;
  const idMoi = (goc) => `kho-bc-${goc}-${++demId}`;
  const thoiGian = (opt) => (opt.tinh || (opt.vao != null && opt.vao < 0)) ? () => 1e6 : (t) => t - (opt.vao || 0);
  // Đường viền bình: miệng loe nhẹ, đáy bo tròn. Trả về mảng điểm (để vẽ nét tay) và chuỗi d (kiểu phẳng).
  const vienBinh = (w, h, r) => {
    const x0 = -w / 2, x1 = w / 2, yt = -h;
    const d = `M${x0 - 10} ${yt} L${x0} ${yt + 14} L${x0} ${-r} Q${x0} 0 ${x0 + r} 0 L${x1 - r} 0 Q${x1} 0 ${x1} ${-r} L${x1} ${yt + 14} L${x1 + 10} ${yt}`;
    const pts = [[x0 - 10, yt], [x0, yt + 14]];
    for (let k = 1; k <= 6; k++) pts.push([x0, yt + 14 + (h - 14 - r) * k / 6]);
    for (let k = 1; k <= 4; k++) { const a = Math.PI - (Math.PI / 2) * k / 4; pts.push([x0 + r + r * Math.cos(a), -r + r * Math.sin(a)]); }
    for (let k = 1; k <= 4; k++) pts.push([x0 + r + (w - 2 * r) * k / 4, 0]);
    for (let k = 1; k <= 4; k++) { const a = Math.PI / 2 - (Math.PI / 2) * k / 4; pts.push([x1 - r + r * Math.cos(a), -r + r * Math.sin(a)]); }
    for (let k = 1; k <= 6; k++) pts.push([x1, -r - (h - 14 - r) * k / 6]);
    pts.push([x1 + 10, yt]);
    return { d, pts };
  };

  K.binh_chua_muc_nuoc = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', hat = opt.hat || 71;
    const W = opt.rong || 220, H = opt.cao || 380, R = Math.min(34, W * 0.16);
    const mauLong = m[opt.khoa_mau || 'nhan'] || m.nhan, mauVuot = m.xau;
    const phai = opt.ben_nhan !== 'trai', dau = phai ? 1 : -1, neo = phai ? 'start' : 'end';
    const T = thoiGian(opt);
    const coTran = opt.tran != null;
    const yMuc = (u) => -u * (H - 16); // mực 1 = sát miệng (chừa 16 đơn vị)

    const g = K.svg('g', { class: 'kho-binh-chua' });
    const defs = K.svg('defs', null, g);
    const vb = vienBinh(W, H, R);
    // vùng cắt: lòng bình
    const idClip = idMoi('lb');
    const clip = K.svg('clipPath', { id: idClip }, defs);
    K.svg('path', { d: `M${-W / 2} ${-H - 40} L${-W / 2} ${-R} Q${-W / 2} 0 ${-W / 2 + R} 0 L${W / 2 - R} 0 Q${W / 2} 0 ${W / 2} ${-R} L${W / 2} ${-H - 40} Z` }, clip);

    // bóng đổ dưới đáy
    if (!tay) K.svg('ellipse', { cx: 0, cy: 8, rx: W * 0.58, ry: 12, fill: '#000', opacity: 0.1 }, g);
    else K.svg('path', { d: K.duongTay([[-W * 0.6, 8], [-W * 0.2, 12], [W * 0.2, 11], [W * 0.6, 7]], { hat: hat + 1, lech: 1.5 }), fill: 'none', stroke: m.chu, 'stroke-width': 1.6, opacity: 0.35, 'stroke-linecap': 'round' }, g);
    // nền lòng bình (kính)
    const longBinh = K.svg('g', { 'clip-path': `url(#${idClip})` }, g);
    if (!tay) K.svg('rect', { x: -W / 2, y: -H, width: W, height: H, fill: K.rgba(m.the, 0.55) }, longBinh);
    else {
      const id = idMoi('kg');
      const pt = K.svg('pattern', { id, width: 14, height: 14, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(60)' }, defs);
      K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 14, stroke: m.chu_phu, 'stroke-width': 1, opacity: 0.18 }, pt);
      K.svg('rect', { x: -W / 2, y: -H, width: W, height: H, fill: `url(#${id})` }, longBinh);
    }
    // chất lỏng: thân + mặt sóng + bọt nổi
    const long = K.svg('g', null, longBinh);
    const than = K.svg('path', { fill: K.rgba(mauLong, tay ? 0.45 : 0.85) }, long);
    let gach = null, thanGach = null;
    if (tay) {
      const id = idMoi('gl');
      const pt = K.svg('pattern', { id, width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(35)' }, defs);
      gach = K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 9, stroke: mauLong, 'stroke-width': 2, opacity: 0.6 }, pt);
      thanGach = K.svg('path', { fill: `url(#${id})` }, long);
    }
    const mat = K.svg('path', { fill: 'none', stroke: tay ? m.chu : K.tron(mauLong, '#FFFFFF', 0.45), 'stroke-width': tay ? 2.4 : 5, 'stroke-linecap': 'round', opacity: tay ? 0.85 : 0.9 }, long);
    const ng = K.ngauNhien(hat + 5);
    const bot = [];
    for (let i = 0; i < 7; i++) bot.push({ e: K.svg('circle', { r: 3 + ng(i * 3) * 5, fill: 'none', stroke: tay ? m.chu : '#FFFFFF', 'stroke-width': tay ? 1.4 : 2, opacity: 0.5 }, long), x: (ng(i * 3 + 1) - 0.5) * (W - 40), v: 40 + ng(i * 3 + 2) * 50, l: ng(i * 3 + 7) });
    // vạch chia trên thành bình
    if (opt.vach_chia !== false) {
      const vc = K.svg('g', null, g);
      for (let k = 1; k < 10; k++) {
        const yy = yMuc(k / 10), dai = k % 5 === 0 ? 26 : 14;
        K.svg('line', { x1: -W / 2 + 4, y1: yy, x2: -W / 2 + 4 + dai, y2: yy, stroke: m.chu_phu, 'stroke-width': tay ? 1.6 : 2, opacity: 0.6, 'stroke-linecap': 'round' }, vc);
      }
    }
    // thành bình
    if (!tay) {
      K.svg('path', { d: vb.d, fill: 'none', stroke: m.vien, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
      // vệt sáng kính
      K.svg('path', { d: `M${W / 2 - 22} ${-H + 40} L${W / 2 - 22} ${-R - 20}`, stroke: '#FFFFFF', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.55 }, g);
      K.svg('path', { d: `M${W / 2 - 36} ${-H + 40} L${W / 2 - 36} ${-H + 110}`, stroke: '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0.45 }, g);
    } else {
      K.svg('path', { d: K.duongTay(vb.pts, { hat: hat + 10, lech: 1.6 }), fill: 'none', stroke: m.chu, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
      K.svg('path', { d: K.duongTay(vb.pts, { hat: hat + 11, lech: 2.6 }), fill: 'none', stroke: m.chu, 'stroke-width': 1.4, opacity: 0.5, 'stroke-linecap': 'round' }, g);
    }

    // vạch trần
    let tran = null, nhanTran = null, mocTran = null;
    const yTran = coTran ? yMuc(opt.tran) : 0;
    if (coTran) {
      tran = K.svg('g', null, g);
      const x1 = dau * (W / 2 + 26);
      const xa = phai ? -W / 2 - 14 : W / 2 + 14;
      if (!tay) K.svg('line', { x1: xa, y1: yTran, x2: x1, y2: yTran, stroke: m.canh_bao, 'stroke-width': 4, 'stroke-dasharray': '14 9', 'stroke-linecap': 'round' }, tran);
      else K.svg('path', { d: K.duongTay([[xa, yTran], [(xa + x1) / 2, yTran], [x1, yTran]], { hat: hat + 20, lech: 1.4 }), fill: 'none', stroke: m.canh_bao, 'stroke-width': 3.4, 'stroke-dasharray': '12 9', 'stroke-linecap': 'round' }, tran);
      mocTran = [x1, yTran];
      if (opt.nhan_tran) nhanTran = K.chu(tran, opt.nhan_tran, { x: x1 + dau * 10, y: yTran + 9, co: 26, dam: 700, mau: K.tuongPhan(m.canh_bao, m.nen) >= 4.5 ? m.canh_bao : m.chu, neo });
    }

    // nhãn mực
    const gtMax = opt.gia_tri_toi_da, dinh = opt.dinh_dang || ((v) => K.soTien(v).replace(/ đồng$/, ''));
    const mau = opt.nhan_muc === false ? null : (opt.nhan_muc || (gtMax != null ? '{gt}' : '{pt}'));
    const chuMuc = (u) => mau.replace('{gt}', gtMax != null ? dinh(gtMax >= 1e8 ? Math.round(u * gtMax / 1e6) * 1e6 : Math.round(u * gtMax)) : '').replace('{pt}', Math.round(u * 100) + '%');
    let nhanMuc = null, chuNhanMuc = null, keNhan = null;
    if (mau) {
      nhanMuc = K.svg('g', null, g);
      keNhan = K.svg('line', { stroke: m.chu, 'stroke-width': 2, 'stroke-linecap': 'round' }, nhanMuc);
      chuNhanMuc = K.chu(nhanMuc, chuMuc(opt.muc != null ? opt.muc : 0.5), { x: 0, y: 0, co: 30, dam: 800, mau: m.chu, neo });
    }
    // tên bình
    let ten = null;
    if (opt.ten) {
      const co = K.coVua(opt.ten, Math.max(W + 140, 300), 30, 700, 24);
      ten = K.chu(g, opt.ten, { x: 0, y: 48, co, dam: 700, mau: m.chu, neo: 'middle' });
    }

    // ----- mực theo thời gian (hàm thuần) -----
    const muc0 = opt.muc_dau != null ? opt.muc_dau : 0, muc1 = opt.muc != null ? opt.muc : 0.5, daiVao = opt.dai_vao != null ? opt.dai_vao : 1.2;
    const lechVao = opt.vao > 0 ? opt.vao : 0;
    const chuyen = (opt.chuyen || []).map((c) => ({ a: c.luc - lechVao, u: c.muc, d: c.dai || 0.9 })).sort((p, q) => p.a - q.a);
    const mucTai = (s) => {
      let u = K.lerp(muc0, muc1, K.eio(K.tienDo(s, 0.3, daiVao)));
      let truoc = muc1;
      for (const c of chuyen) { if (s <= c.a) break; u = K.lerp(truoc, c.u, K.eio(K.tienDo(s, c.a, c.d))); truoc = c.u; }
      return u;
    };
    // tốc độ đổi mực (để sóng mạnh lên khi đang dâng, rút)
    const tocDo = (s) => Math.abs(mucTai(s + 0.04) - mucTai(s - 0.04)) / 0.08;
    const matSong = (yy, s, bienDo) => {
      const pts = [];
      for (let k = 0; k <= 16; k++) {
        const x = -W / 2 - 4 + (W + 8) * k / 16;
        pts.push([x, yy + Math.sin(x * 0.045 + s * 3.1) * bienDo + Math.sin(x * 0.09 - s * 2.3) * bienDo * 0.4]);
      }
      return pts;
    };

    return {
      el: g,
      mucTai: (t) => mucTai(T(t)),
      seek(t) {
        const s = T(t);
        const hien = K.eo3(K.tienDo(s, 0, 0.35));
        g.style.opacity = hien.toFixed(3);
        const u = mucTai(s), yy = yMuc(u);
        const bienDo = 2.5 + Math.min(9, tocDo(s) * 14);
        const song = matSong(yy, s, bienDo);
        const dSong = song.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(2)}`).join(' ');
        const dThan = dSong + ` L${W / 2 + 4} 4 L${-W / 2 - 4} 4 Z`;
        than.setAttribute('d', dThan);
        if (tay) thanGach.setAttribute('d', dThan);
        mat.setAttribute('d', tay ? K.duongTay(song, { hat: hat + 30, lech: 0.8 }) : dSong);
        const vuot = coTran && opt.canh_bao_vuot !== false ? K.cl((u - opt.tran) / 0.04) : 0;
        const mauHien = K.tron(mauLong, mauVuot, vuot);
        than.setAttribute('fill', K.rgba(mauHien, tay ? 0.45 : 0.85));
        if (gach) gach.setAttribute('stroke', mauHien);
        if (!tay) mat.setAttribute('stroke', K.tron(mauHien, '#FFFFFF', 0.45));
        long.style.opacity = u <= 0.002 ? 0 : 1;
        bot.forEach((b) => {
          const cao = -yy;
          if (cao < 30) { b.e.style.opacity = 0; return; }
          const quang = ((s * b.v + b.l * 400) % (cao + 20) + (cao + 20)) % (cao + 20);
          b.e.setAttribute('cx', (b.x + Math.sin(s * 2 + b.l * 6) * 4).toFixed(1));
          b.e.setAttribute('cy', (-quang + 6).toFixed(1));
          b.e.style.opacity = (0.5 * K.cl(quang / 20) * K.cl((cao - quang) / 20)).toFixed(3);
        });
        if (tran) {
          tran.style.opacity = K.eo3(K.tienDo(s, 0.2, 0.4)).toFixed(3);
          const nhay = vuot > 0 ? 0.55 + 0.45 * Math.abs(Math.cos(s * 4)) : 1;
          if (nhanTran) nhanTran.style.opacity = nhay.toFixed(3);
        }
        if (nhanMuc) {
          const xa = dau * (W / 2 - 6), xb = dau * (W / 2 + 26);
          let yn = yy;
          // tránh đè nhãn trần: đẩy nhãn mực xuống (hoặc lên khi sát đáy) nếu gần
          if (nhanTran && Math.abs(yn - yTran) < 46) yn = yn >= yTran ? yTran + 46 : yTran - 46;
          yn = Math.min(yn, -24);
          keNhan.setAttribute('x1', xa); keNhan.setAttribute('y1', yy.toFixed(2)); keNhan.setAttribute('x2', xb); keNhan.setAttribute('y2', yn.toFixed(2));
          chuNhanMuc.setAttribute('x', xb + dau * 10); chuNhanMuc.setAttribute('y', (yn + 10).toFixed(2));
          chuNhanMuc.textContent = chuMuc(Math.max(0, u));
          chuNhanMuc.setAttribute('fill', vuot > 0.5 && K.tuongPhan(mauVuot, m.nen) >= 4.5 ? mauVuot : m.chu);
          nhanMuc.style.opacity = (K.eo3(K.tienDo(s, 0.35, 0.3)) * (u > 0.005 ? 1 : 0)).toFixed(3);
        }
        if (ten) ten.style.opacity = K.eo3(K.tienDo(s, 0.15, 0.35)).toFixed(3);
      },
      moc: {
        day: [0, 0],
        mieng: [0, -H],
        mat_nuoc: (t) => [0, yMuc(mucTai(T(t)))],
        tran: mocTran,
        ten: ten ? [0, 48] : null,
      },
    };
  };
})();
