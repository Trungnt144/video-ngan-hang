// ngan_hang/nha_xuong.js — 1.0 — doanh nghiệp: nhà xưởng mái răng cưa có ống khói nhả khói, cửa cuốn, khối văn phòng kèm biển tên; biến thể văn phòng công ty nhiều tầng.
// Gọi: KHO.doanh_nghiep_nha_xuong({ loai, nhan, khoi, mo_cua, kieu, co, mau, vao, tinh, hat }); bí danh KHO.nha_xuong.
//   loai 'nha_xuong' (mặc định, rộng 520, cao 340 tính cả ống khói) | 'van_phong' (rộng 340, cao 440);
//   nhan: chữ biển tên, mặc định 'Công ty B' (không dùng tên doanh nghiệp thật); khoi: true (mặc định) ống khói nhả khói;
//   mo_cua: giây cửa cuốn bắt đầu kéo lên (tính từ lúc hình xuất hiện, như vao; bỏ trống là cửa đóng);
//   kieu 'phang' | 'net_tay'; co: tỉ lệ; vao: giây bắt đầu mọc (-1 hiện đủ); tinh: true hiện đủ; hat: hạt giống nét tay.
// Kích thước chuẩn: gốc toạ độ ở giữa chân công trình (mặt đất), công trình nằm phía trên (y âm). Nhà xưởng cao 200 tới đỉnh mái, ống khói cao 340.
// Trả về { el, seek(t), moc }: moc { day, dinh, tam, trai, phai, cua (cửa cuốn hoặc cửa chính), bien (tâm biển tên), ong_khoi (miệng ống khói) } — đã nhân co.
// Chuyển động: mọc lên từ đất bằng lò xo, mái và biển rơi vào sau; sau đó khói bốc lên lặp chu kỳ 2,4 giây (văn phòng đứng yên, có vệt sáng tĩnh trên kính); cửa cuốn kéo lên ở mo_cua.
// Dựng mới; cách dựng khối và nét tay theo ngan_hang/toa_nha_ngan_hang.js (cùng nhóm, cùng tỉ lệ để đặt cạnh nhau).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;

  function boVe(g, tay, m, hat0) {
    let hat = hat0;
    const defs = K.svg('defs', null, g), dsMau = {};
    const gach = (mau, mo, goc = 35, buoc = 8) => {
      const k = mau + mo + goc + buoc;
      if (!dsMau[k]) {
        const id = `kho-nx-g${++demId}`;
        const p = K.svg('pattern', { id, width: buoc, height: buoc, patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${goc})` }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: buoc, stroke: mau, 'stroke-width': 1.8, opacity: mo }, p);
        dsMau[k] = `url(#${id})`;
      }
      return dsMau[k];
    };
    const da = (cha, pts, o = {}) => {
      const net = o.net === undefined ? m.vien : o.net, day = o.day || 3;
      if (!tay) {
        const d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
        return K.svg('path', { d, fill: o.to || 'none', stroke: net || 'none', 'stroke-width': day, 'stroke-linejoin': 'round' }, cha);
      }
      const nhom = K.svg('g', null, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: o.to }, nhom);
      if (o.gach) K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: gach(o.gach[0], o.gach[1]) }, nhom);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.3, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.85, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, nhom);
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 2, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.4, opacity: 0.45, 'stroke-linecap': 'round' }, nhom);
      }
      return nhom;
    };
    const cn = (cha, x, y, w, h, o = {}) => {
      if (!tay && o.bo) return K.svg('rect', { x, y, width: w, height: h, rx: o.bo, fill: o.to || 'none', stroke: o.net === undefined ? m.vien : (o.net || 'none'), 'stroke-width': o.day || 3 }, cha);
      return da(cha, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o);
    };
    const vach = (cha, x1, y1, x2, y2, mau, day, mo) => (tay
      ? K.svg('path', { d: K.duongTay([[x1, y1], [x2, y2]], { hat: hat++, lech: 0.9 }), fill: 'none', stroke: mau, 'stroke-width': day, opacity: mo, 'stroke-linecap': 'round' }, cha)
      : K.svg('line', { x1, y1, x2, y2, stroke: mau, 'stroke-width': day, opacity: mo, 'stroke-linecap': 'round' }, cha));
    return { da, cn, vach, gach, defs };
  }

  // Cắt đa giác lồi theo hình chữ nhật [x0,x1]×[y0,y1] (Sutherland–Hodgman), thay cho clip-path khi nhóm cha đang co giãn.
  function catHCN(da, x0, y0, x1, y1) {
    const canh = [[(p) => p[0] >= x0, (a, b) => [x0, a[1] + ((b[1] - a[1]) * (x0 - a[0])) / (b[0] - a[0])]],
      [(p) => p[0] <= x1, (a, b) => [x1, a[1] + ((b[1] - a[1]) * (x1 - a[0])) / (b[0] - a[0])]],
      [(p) => p[1] >= y0, (a, b) => [a[0] + ((b[0] - a[0]) * (y0 - a[1])) / (b[1] - a[1]), y0]],
      [(p) => p[1] <= y1, (a, b) => [a[0] + ((b[0] - a[0]) * (y1 - a[1])) / (b[1] - a[1]), y1]]];
    let ra = da;
    for (const [trong, giao] of canh) {
      const vao = ra; ra = [];
      for (let i = 0; i < vao.length; i++) {
        const a = vao[i], b = vao[(i + 1) % vao.length];
        if (trong(b)) { if (!trong(a)) ra.push(giao(a, b)); ra.push(b); } else if (trong(a)) ra.push(giao(a, b));
      }
      if (!ra.length) break;
    }
    return ra;
  }

  K.doanh_nghiep_nha_xuong = function (opt) {
    opt = Object.assign({ loai: 'nha_xuong', kieu: 'phang', co: 1, nhan: 'Công ty B', khoi: true }, opt || {});
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co, xuong = opt.loai !== 'van_phong';
    const g = K.svg('g', { class: 'kho-nha-xuong' });
    const khoi = K.svg('g', { transform: `scale(${co})` }, g);
    const B = boVe(khoi, tay, m, opt.hat || 41);
    const tuong = m.the, tuongToi = K.tron(m.the, m.nen_phu, 0.7), kinh = K.tron(m.nhat, m.the, 0.25);
    const ton = K.tron(m.nhan_phu, m.the, 0.35), tonToi = K.tron(m.nhan_phu, m.chu, 0.2);
    const bong = (cha, x, y, w, h) => (tay ? B.cn(cha, x, y, w, h, { net: null, gach: [m.chu, 0.28] }) : K.svg('rect', { x, y, width: w, height: h, fill: '#000', opacity: 0.08 }, cha));
    const dat = K.svg('ellipse', { cx: 0, cy: 2, rx: xuong ? 290 : 210, ry: 10, fill: '#000', opacity: 0.1 }, khoi);
    const nhomKhoi = K.svg('g', null, khoi);      // khói (sau ống khói)
    const nhomThan = K.svg('g', null, khoi);
    const nhomMai = K.svg('g', null, khoi);
    const nhomBien = K.svg('g', null, khoi);
    let W, H, cua, bien, ongKhoi = null, cuaCuon = null, vetSang = null, denCua = null;
    const dsKhoi = [];

    const bienChu = (cx, cy, w, h, nen) => {
      const mauChu = K.chuTren(nen, '#FFFFFF', m.chu);
      const coLon = Math.min(34, h * 0.7), coChu = K.coVua(opt.nhan, w - 24, coLon, 700, 22);
      if (K.doChu(opt.nhan, coChu, 700) <= w - 24) return K.chu(nhomBien, opt.nhan, { x: cx, y: cy + coChu * 0.36, co: coChu, dam: 700, mau: mauChu, neo: 'middle' });
      const co2 = Math.max(22, Math.min(coLon, Math.floor((h - 4) / 2.2)));
      return K.chuNhieuDong(nhomBien, opt.nhan, { x: cx, y: cy - co2 * 0.55 + co2 * 0.36, co: co2, dam: 700, mau: mauChu, neo: 'middle', rong: w - 24, gian_dong: 1.1 });
    };

    if (xuong) {
      W = 520; H = 340;
      // ống khói (vẽ trước thân để chân khuất sau mái)
      const ok = K.svg('g', null, nhomThan);
      B.cn(ok, -198, -340, 36, 170, { to: tuongToi });
      B.cn(ok, -202, -340, 44, 14, { to: tonToi, bo: 2 });
      for (const y of [-300, -262]) B.cn(ok, -198, y, 36, 12, { to: m.nhan, net: null });
      ongKhoi = [-180, -344];
      // xưởng chính
      bong(nhomThan, 60, -180, 60, 180);
      B.cn(nhomThan, -250, -180, 370, 180, { to: tuong });
      // biển tên trên mặt xưởng
      B.cn(nhomThan, -236, -168, 220, 46, { to: m.nhan, bo: 5 });
      bien = [-126, -145];
      // cửa cuốn
      B.cn(nhomThan, -224, -110, 160, 110, { to: tuongToi });
      // không dùng clip-path dưới nhóm đang co giãn (Chrome kẻ khác nhau tuỳ khung trước, hỏng tính thuần): cửa cuốn co lại về phía trên
      K.svg('rect', { x: -216, y: -102, width: 144, height: 102, fill: K.tron(m.chu, m.nen_phu, 0.55) }, nhomThan);   // lòng xưởng tối
      denCua = K.svg('rect', { x: -216, y: -30, width: 144, height: 30, fill: m.canh_bao, opacity: 0 }, nhomThan);
      // cửa cuốn vẽ lại theo chiều cao (đổi hình học, không dùng transform: transform trên nhóm này làm Chrome kẻ lại vùng bên cạnh khác đi, hỏng tính thuần)
      const gCua = K.svg('g', null, nhomThan), mauCua = K.tron(ton, m.the, 0.3);
      const laCua = K.svg('path', { fill: mauCua, stroke: m.vien, 'stroke-width': tay ? 2.2 : 2.5, 'stroke-linejoin': 'round' }, gCua);
      const laCua2 = tay ? K.svg('path', { fill: 'none', stroke: m.vien, 'stroke-width': 1, opacity: 0.45 }, gCua) : null;
      const nan = Array.from({ length: 8 }, () => K.svg('path', { fill: 'none', stroke: m.vien, 'stroke-width': 1.5, opacity: 0.45, 'stroke-linecap': 'round' }, gCua));
      const tay2 = K.svg('rect', { x: -160, width: 32, height: 8, rx: 2, fill: tonToi }, gCua);
      const hatCua = (opt.hat || 41) + 500;
      cuaCuon = (h) => {
        const pts = [[-216, -102], [-72, -102], [-72, -102 + h], [-216, -102 + h]];
        laCua.setAttribute('d', tay ? K.duongTay(pts, { hat: hatCua, lech: 1.1, dong: true }) : 'M' + pts.map((q) => q.join(' ')).join(' L') + ' Z');
        if (laCua2) laCua2.setAttribute('d', K.duongTay(pts, { hat: hatCua + 1, lech: 1.8, dong: true }));
        nan.forEach((e, i) => { const y = -102 + (i + 1) * 11.3; e.setAttribute('d', y < -102 + h - 4 ? (tay ? K.duongTay([[-214, y], [-74, y]], { hat: hatCua + 2 + i, lech: 0.9 }) : `M-214 ${y.toFixed(1)} L-74 ${y.toFixed(1)}`) : ''); });
        tay2.setAttribute('y', (-102 + h - 14).toFixed(2));
      };
      cua = [-144, -55];
      // cửa sổ cao trên tường xưởng
      for (const x of [10, 54]) B.cn(nhomThan, x, -164, 34, 40, { to: kinh, day: 2.5 });
      B.cn(nhomThan, 0, -96, 98, 96, { to: tuongToi });
      B.cn(nhomThan, 8, -88, 82, 88, { to: kinh, day: 2.5 });
      B.vach(nhomThan, 49, -88, 49, 0, m.vien, 2, 0.6);
      // khối văn phòng bên phải
      bong(nhomThan, 230, -130, 20, 130);
      B.cn(nhomThan, 120, -134, 130, 134, { to: tuong });
      B.cn(nhomThan, 114, -146, 142, 16, { to: tuongToi, bo: 3 });
      for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) B.cn(nhomThan, 134 + c * 38, -118 + r * 44, 28, 30, { to: kinh, day: 2, bo: 2 });
      B.cn(nhomThan, 168, -32, 34, 32, { to: m.nhan_phu, day: 2 });
      // thùng hàng trước xưởng
      B.cn(nhomThan, -52, -40, 40, 40, { to: K.tron(m.canh_bao, m.the, 0.45), day: 2.5 });
      B.cn(nhomThan, -40, -72, 30, 32, { to: K.tron(m.canh_bao, m.the, 0.6), day: 2.5 });
      B.vach(nhomThan, -52, -20, -12, -20, m.vien, 1.5, 0.5);
      B.cn(nhomThan, -262, -10, 524, 10, { to: tuongToi, bo: 2 });
      // mái răng cưa: 4 răng, mặt kính đứng hướng bắc
      const x0 = -256, buoc = 94;
      for (let i = 0; i < 4; i++) {
        const a = x0 + i * buoc, b = a + buoc;
        B.da(nhomMai, [[a, -180], [a, -208], [b, -180]], { to: ton, gach: tay ? [m.chu, 0.22] : null });
        B.da(nhomMai, [[a, -208], [a + 10, -206], [a + 10, -184], [a, -182]], { to: kinh, day: 2 });
      }
      B.cn(nhomMai, -258, -184, 382, 8, { to: tonToi, bo: 2 });
      // cụm khói: 4 cụm, mỗi cụm 3 vòng
      for (let k = 0; k < 4; k++) {
        const cum = K.svg('g', null, nhomKhoi);
        [[-10, 0, 16], [8, -6, 13], [0, -16, 11]].forEach(([dx, dy, r]) => (tay
          ? B.da(cum, Array.from({ length: 16 }, (_, i) => [dx + r * Math.cos((i / 16) * Math.PI * 2), dy + r * Math.sin((i / 16) * Math.PI * 2)]), { to: K.tron(m.nen_phu, '#FFFFFF', 0.4), net: m.chu_phu, day: 1.6 })
          : K.svg('circle', { cx: dx, cy: dy, r, fill: K.tron(m.nen_phu, m.chu_phu, 0.3) }, cum)));
        dsKhoi.push(cum);
      }
    } else {
      W = 340; H = 440;
      bong(nhomThan, 100, -400, 60, 400);
      B.cn(nhomThan, -160, -400, 320, 400, { to: tuong });
      // mặt kính: lưới 5 tầng × 4 ô, giữa có vây đứng
      for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) B.cn(nhomThan, -140 + c * 72, -380 + r * 58, 56, 42, { to: kinh, day: 2, bo: 2 });
      for (const x of [-148, -76, -4, 68, 140]) B.cn(nhomThan, x, -392, 8, 300, { to: tuongToi, net: null });
      // vệt sáng: đa giác cắt bằng tính toán theo khung mặt kính (không clip-path, xem ghi chú cửa cuốn)
      // vệt sáng tĩnh trên kính (bản động làm ảnh chụp lại không trùng ở mép đa giác)
      const vs = catHCN([[-40, -520], [10, -520], [-150, -60], [-200, -60]].map(([x, y]) => [x + 120, y]), -160, -400, 160, -90);
      K.svg('path', { d: 'M' + vs.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L') + ' Z', fill: '#FFFFFF', opacity: tay ? 0.16 : 0.2 }, nhomThan);
      // tầng trệt: sảnh kính, mái che
      B.cn(nhomThan, -160, -90, 320, 90, { to: tuongToi });
      B.cn(nhomThan, -60, -78, 120, 78, { to: kinh, day: 2.5 });
      B.vach(nhomThan, 0, -78, 0, 0, m.vien, 2, 0.6);
      for (const x of [-140, 84]) B.cn(nhomThan, x, -70, 56, 50, { to: kinh, day: 2, bo: 2 });
      B.cn(nhomThan, -84, -98, 168, 14, { to: m.nhan_phu, bo: 3 });
      cua = [0, -40];
      B.cn(nhomThan, -176, -10, 352, 10, { to: tuongToi, bo: 2 });
      // bồn cây hai bên
      for (const x of [-196, 196]) {
        B.cn(nhomThan, x - 18, -26, 36, 26, { to: tuongToi, day: 2 });
        B.da(nhomThan, Array.from({ length: 14 }, (_, i) => [x + 24 * Math.cos((i / 14) * Math.PI * 2), -48 + 22 * Math.sin((i / 14) * Math.PI * 2)]), { to: m.tot, day: 2 });
      }
      // biển tên trên nóc
      B.cn(nhomMai, -150, -440, 300, 48, { to: m.nhan, bo: 6 });
      bien = [0, -416];
    }
    const nhanEl = bienChu(bien[0], bien[1], xuong ? 220 : 300, xuong ? 46 : 48, m.nhan);

    const tinh = opt.tinh || (opt.vao != null && opt.vao < 0), vao = opt.vao > 0 ? opt.vao : 0;
    const tMo = opt.mo_cua != null ? opt.mo_cua - vao : null;
    // độ mờ: hiện đủ thì bỏ hẳn thuộc tính (opacity 1 ghi trong style làm Chrome tách lớp, kẻ mép khác nhau tuỳ khung trước)
    const snap = (p) => (Math.abs(1 - p) < 0.003 ? 1 : p);   // lò xo gần đứng yên thì chốt 1, để khung sau không vẽ lại
    const mo = (el, v) => { el.style.opacity = v >= 0.999 ? '' : v.toFixed(3); };
    return {
      el: g,
      seek(t) {
        const s = tinh ? 1e6 : t - vao;
        const pThan = snap(K.spr(s, 0.55, 0.62));
        nhomThan.setAttribute('transform', `scale(1 ${Math.max(0, pThan).toFixed(4)})`);
        mo(nhomThan, K.cl(s / 0.1));
        dat.style.opacity = (0.1 * K.cl(s / 0.3)).toFixed(3);
        const pMai = snap(K.spr(s - 0.32, 0.4, 0.55));
        nhomMai.setAttribute('transform', `translate(0 ${((1 - pMai) * -50).toFixed(2)})`);
        mo(nhomMai, K.cl((s - 0.32) / 0.12));
        const pb = K.eo3(K.tienDo(s, 0.45, 0.4));
        mo(nhomBien, pb);
        nhomBien.setAttribute('transform', `translate(0 ${((1 - pb) * 8).toFixed(2)})`);
        // khói: mỗi cụm đi từ miệng ống lên cao, to dần, mờ dần; lệch pha đều nhau
        dsKhoi.forEach((cum, k) => {
          if (!opt.khoi || !ongKhoi) { cum.style.opacity = 0; cum.setAttribute('transform', ''); return; }
          const chu = 2.4, tau = s - 0.9;
          if (tau < 0) { cum.style.opacity = 0; cum.setAttribute('transform', ''); return; }
          const ph = (((tau / chu) + k / dsKhoi.length) % 1);
          const vongDau = tau / chu < k / dsKhoi.length ? 0 : 1;      // chưa tới lượt cụm này ở vòng đầu
          const x = ongKhoi[0] + ph * 46 + Math.sin(ph * 5 + k) * 6, y = ongKhoi[1] - 10 - ph * 120, tl = 0.6 + ph * 1.1;
          cum.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${tl.toFixed(3)})`);
          cum.style.opacity = (vongDau * Math.min(1, ph / 0.12) * (1 - ph) * 0.9).toFixed(3);
        });
        if (cuaCuon) {
          const p = tMo == null ? 0 : K.eio(K.tienDo(s, tMo, 1.2));
          cuaCuon(102 * (1 - p * 0.86));
          denCua.style.opacity = (p * 0.45).toFixed(3);
        }
        if (vetSang) {
          const chu = 6, p = (((s - 0.8) % chu) + chu) % chu / chu, dx = -100 + p * 640;
          const da = catHCN([[-40 + dx, -520], [10 + dx, -520], [-150 + dx, -60], [-200 + dx, -60]], -160, -400, 160, -90);
          vetSang.setAttribute('d', da.length > 2 ? 'M' + da.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L') + ' Z' : '');
          vetSang.style.opacity = s < 0.8 ? 0 : '';
        }
      },
      moc: {
        day: [0, 0], dinh: [0, -H * co], tam: [0, (-H * co) / 2], trai: [(-W * co) / 2, (-H * co) / 2], phai: [(W * co) / 2, (-H * co) / 2],
        cua: [cua[0] * co, cua[1] * co], bien: [bien[0] * co, bien[1] * co], ong_khoi: ongKhoi ? [ongKhoi[0] * co, ongKhoi[1] * co] : null,
      },
      nhan: nhanEl,
    };
  };
  K.nha_xuong = K.doanh_nghiep_nha_xuong;
})();
