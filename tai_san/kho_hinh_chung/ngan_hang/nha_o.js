// ngan_hang/nha_o.js — 1.1 — nhà ở: nhà phố nhiều tầng, căn hộ chung cư (tô sáng một căn), toà nhà đang xây có giàn giáo và cần cẩu, nhà mái dốc đơn giản vẽ dần nét.
// Gọi: KHO.nha_o({ loai, to_sang, so_tang, tang_xong, nhan, kieu, co, mau, vao, nhip, tinh, hat }).
//   loai 'nha_pho' (mặc định, rộng 200, cao 430) | 'can_ho' (rộng 360, cao 520) | 'dang_xay' (rộng 360, cao 520, cần cẩu cao 640) | 'nha_don' (rộng 300, cao 240);
//   to_sang: [tầng, cột] căn hộ được tô sáng (can_ho; tầng đếm từ 1 ở dưới, cột từ 1 bên trái), nhấp nháy viền nhẹ sau khi hiện;
//   so_tang: số tầng của toà đang xây (mặc định 7, 3–9); tang_xong: số tầng đã xây tường (mặc định 3); các tầng mọc lần lượt;
//   nhan: chữ nhỏ dưới chân (22 px), không bắt buộc; kieu 'phang' | 'net_tay'; co: tỉ lệ;
//   vao: giây bắt đầu (-1 hiện đủ); nhip: giây giữa hai tầng mọc (đang xây, mặc định 0,22); tinh: true hiện đủ; hat: hạt giống nét tay.
// Kích thước chuẩn: gốc toạ độ ở giữa chân nhà (mặt đất), nhà nằm phía trên (y âm). Cùng tỉ lệ với toa_nha_ngan_hang và doanh_nghiep_nha_xuong.
// Trả về { el, seek(t), moc }: moc { day, dinh, tam, trai, phai, cua, can (tâm căn tô sáng), moc_cau (móc cần cẩu) } — đã nhân co.
// Chuyển động: mọc lên từ đất bằng lò xo (nhà đơn: vẽ dần nét rồi tô màu); toà đang xây mọc từng tầng, móc cẩu lên xuống chu kỳ 4 giây; căn tô sáng có viền nhấp nháy.
// Gom nét nhà mái dốc từ xuong_html/2026.10.28_trich_lap_du_phong/trang.html:186-191 (c2_nha: mái, tường, cửa, cửa sổ vẽ dần bằng pathLength); các loại khác dựng mới theo cách của toa_nha_ngan_hang.js.
// Ghi chú tính thuần: không dùng clip-path, không transform co giãn trên nhóm con đang đổi; chuyển động bằng đổi hình học hoặc độ mờ (bài học khi dựng nha_xuong.js).
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
        const id = `kho-no-g${++demId}`;
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
    const tron = (cha, cx, cy, r, o = {}) => da(cha, Array.from({ length: 16 }, (_, i) => [cx + r * Math.cos((i / 16) * Math.PI * 2), cy + r * Math.sin((i / 16) * Math.PI * 2)]), o);
    return { da, cn, vach, tron, gach, defs };
  }

  K.nha_o = function (opt) {
    opt = Object.assign({ loai: 'nha_pho', kieu: 'phang', co: 1 }, opt || {});
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co;
    const loai = ['nha_pho', 'can_ho', 'dang_xay', 'nha_don'].includes(opt.loai) ? opt.loai : 'nha_pho';
    const g = K.svg('g', { class: 'kho-nha-o' });
    const khoi = K.svg('g', { transform: `scale(${co})` }, g);
    const B = boVe(khoi, tay, m, opt.hat || 91);
    const tuong = m.the, tuongToi = K.tron(m.the, m.nen_phu, 0.7), kinh = K.tron(m.nhat, m.the, 0.25);
    const beTong = K.tron(m.nen_phu, m.chu_phu, 0.25), cay = m.tot;
    const bong = (cha, x, y, w, h) => (tay ? B.cn(cha, x, y, w, h, { net: null, gach: [m.chu, 0.28] }) : K.svg('rect', { x, y, width: w, height: h, fill: '#000', opacity: 0.08 }, cha));
    const dat = K.svg('ellipse', { cx: 0, cy: 2, rx: 0, ry: 10, fill: '#000', opacity: 0.1 }, khoi);
    const nhomThan = K.svg('g', null, khoi), nhomMai = K.svg('g', null, khoi), nhomTren = K.svg('g', null, khoi);
    let giao = null, W, H, cua = [0, -40], can = null, vienCan = null, mocCau = null, day = null, moc = null, dsTang = [], dsNet = [], dsTo = [];

    if (loai === 'nha_pho') {
      W = 200; H = 430;
      bong(nhomThan, 70, -380, 30, 380);
      B.cn(nhomThan, -100, -380, 200, 380, { to: tuong });
      // tầng trệt: cửa kính và mái hiên
      B.cn(nhomThan, -84, -86, 168, 86, { to: tuongToi });
      B.cn(nhomThan, -76, -78, 152, 78, { to: kinh, day: 2.5 });
      for (const x of [-38, 0, 38]) B.vach(nhomThan, x, -78, x, 0, m.vien, 2, 0.6);
      B.cn(nhomThan, -100, -100, 200, 14, { to: m.nhan, bo: 3 });
      cua = [0, -40];
      // tầng 2–4: cửa sổ, ban công, chậu cây
      for (let f = 0; f < 3; f++) {
        const y = -190 - f * 92;
        B.cn(nhomThan, -70, y, 140, 66, { to: kinh, day: 2.5, bo: 2 });
        B.vach(nhomThan, 0, y, 0, y + 66, m.vien, 2, 0.6);
        B.cn(nhomThan, -84, y + 64, 168, 8, { to: tuongToi, bo: 2 });
        for (let k = 0; k < 9; k++) B.vach(nhomThan, -80 + k * 20, y + 46, -80 + k * 20, y + 64, m.vien, 1.8, 0.55);
        B.vach(nhomThan, -84, y + 46, 84, y + 46, m.nhan_phu, 3, 1);
        if (f !== 1) B.tron(nhomThan, f ? -64 : 62, y + 40, 12, { to: cay, day: 2 });
      }
      // tum và lan can mái
      B.cn(nhomMai, -106, -392, 212, 14, { to: tuongToi, bo: 3 });
      B.cn(nhomMai, -40, -430, 80, 40, { to: tuong });
      B.da(nhomMai, [[-50, -428], [50, -428], [40, -440], [-40, -440]], { to: m.nhan });
      B.cn(nhomMai, -14, -420, 28, 30, { to: kinh, day: 2 });
      dat.setAttribute('rx', 130);
    } else if (loai === 'can_ho') {
      W = 360; H = 520;
      const tang = 8, hT = 48;
      bong(nhomThan, 120, -480, 50, 480);
      B.cn(nhomThan, -170, -480, 340, 480, { to: tuong });
      B.cn(nhomThan, -170, -480, 34, 480, { to: tuongToi, net: null });
      // sảnh
      B.cn(nhomThan, -60, -64, 120, 64, { to: kinh, day: 2.5 });
      B.vach(nhomThan, 0, -64, 0, 0, m.vien, 2, 0.6);
      B.cn(nhomThan, -80, -76, 160, 12, { to: m.nhan_phu, bo: 3 });
      cua = [0, -32];
      for (const x of [-130, 90]) B.cn(nhomThan, x, -56, 40, 40, { to: kinh, day: 2, bo: 2 });
      // các tầng căn hộ: 4 căn mỗi tầng, ban công xen kẽ
      const ts = opt.to_sang || null;
      for (let f = 0; f < tang; f++) for (let c = 0; c < 4; c++) {
        const x = -150 + c * 78, y = -96 - (f + 1) * hT + 8, laCan = ts && ts[0] === f + 1 && ts[1] === c + 1;
        B.cn(nhomThan, x, y, 62, 32, { to: laCan ? K.tron(m.canh_bao, m.the, 0.45) : kinh, day: 2, bo: 2 });
        if ((f + c) % 2 === 0) B.cn(nhomThan, x - 4, y + 29, 70, 7, { to: tuongToi, day: 1.8, bo: 2 });
        if (laCan) can = [x + 31, y + 16];
      }
      for (let f = 1; f < tang; f++) B.vach(nhomThan, -170, -96 - f * hT, 170, -96 - f * hT, m.vien, 1.5, 0.25);
      // mái: bể nước, lan can
      B.cn(nhomMai, -176, -492, 352, 14, { to: tuongToi, bo: 3 });
      B.cn(nhomMai, 60, -520, 60, 28, { to: m.nhan_phu, bo: 4 });
      B.cn(nhomMai, -120, -512, 90, 20, { to: tuongToi, bo: 3 });
      if (can) {
        vienCan = K.svg('rect', { x: can[0] - 41, y: can[1] - 25, width: 82, height: 50, rx: 8, fill: 'none', stroke: m.canh_bao, 'stroke-width': 4 }, nhomTren);
      }
      dat.setAttribute('rx', 210);
    } else if (loai === 'dang_xay') {
      W = 360; H = 520;
      const tong = Math.max(3, Math.min(9, opt.so_tang || 7)), xong = Math.max(0, Math.min(tong, opt.tang_xong != null ? opt.tang_xong : 3)), hT = 54;
      H = 40 + tong * hT;
      B.cn(nhomThan, -176, -14, 352, 14, { to: beTong, bo: 2 });            // móng
      for (let f = 0; f < tong; f++) {
        const y0 = -14 - (f + 1) * hT, tg = K.svg('g', null, nhomThan);
        if (f < xong) {
          B.cn(tg, -160, y0, 320, hT, { to: tuong });
          for (let c = 0; c < 4; c++) B.cn(tg, -144 + c * 76, y0 + 12, 56, 30, { to: kinh, day: 2, bo: 2 });
        } else {
          // khung bê tông: cột và sàn, chưa có tường
          for (const x of [-160, -84, -8, 68, 144]) B.cn(tg, x, y0 + 8, 16, hT - 8, { to: beTong, day: 2 });
          if (f === xong) B.cn(tg, -150, y0 + 22, 90, hT - 22, { to: K.tron(m.canh_bao, m.the, 0.55), day: 2 });   // tường đang xây dở
        }
        B.cn(tg, -168, y0, 336, 9, { to: f < xong ? tuongToi : beTong, day: 2 });
        dsTang.push(tg);
      }
      // giàn giáo phía trước nửa phải: ống đứng, ống ngang, thanh chéo
      const gg = K.svg('g', null, nhomThan); giao = gg;
      const mauGiao = K.tron(m.canh_bao, m.chu, 0.25);
      const yTop = -14 - tong * hT - 20;
      for (const x of [20, 80, 140, 184]) B.vach(gg, x, 0, x, yTop, mauGiao, 3.2, 1);
      for (let f = 0; f <= tong; f++) B.vach(gg, 14, -14 - f * hT, 190, -14 - f * hT, mauGiao, 3, 1);
      for (let f = 0; f < tong; f++) B.vach(gg, f % 2 ? 80 : 140, -14 - f * hT, f % 2 ? 140 : 80, -14 - (f + 1) * hT, mauGiao, 2, 0.8);
      // cần cẩu tháp bên trái
      const cc = K.svg('g', null, nhomMai), mauCau = m.canh_bao, cao = H + 120;
      for (const x of [-232, -212]) B.vach(cc, x, 0, x, -cao, mauCau, 4, 1);
      for (let k = 0; k * 30 < cao; k++) B.vach(cc, -232, -k * 30, -212, -(k + 1) * 30, mauCau, 2, 0.9);
      B.cn(cc, -244, -cao - 16, 44, 18, { to: mauCau, bo: 2 });
      B.vach(cc, -300, -cao - 8, 120, -cao - 8, mauCau, 6, 1);                // cần
      B.vach(cc, -222, -cao - 46, 120, -cao - 8, mauCau, 2, 0.9);
      B.vach(cc, -222, -cao - 46, -300, -cao - 8, mauCau, 2, 0.9);
      B.vach(cc, -222, -cao - 16, -222, -cao - 46, mauCau, 3, 1);
      B.cn(cc, -306, -cao - 4, 30, 22, { to: beTong, day: 2 });              // đối trọng
      day = K.svg('line', { x1: 80, y1: -cao - 8, x2: 80, y2: -cao + 40, stroke: m.vien, 'stroke-width': 2 }, cc);
      moc = K.svg('path', { d: '', fill: 'none', stroke: m.vien, 'stroke-width': 3, 'stroke-linecap': 'round' }, cc);
      mocCau = [80, -cao + 120];   // móc ở giữa hành trình
      day._cao = cao;
      dat.setAttribute('rx', 260);
      H = cao + 16;
    } else {
      // nhà mái dốc đơn giản: nét vẽ dần rồi tô
      W = 300; H = 240;
      const net = (d, to) => {
        if (to) { const f = K.svg('path', { d, fill: to, stroke: 'none' }, nhomThan); dsTo.push(f); }
        const p = K.svg('path', { d: tay ? d : d, fill: 'none', stroke: m.vien, 'stroke-width': 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', pathLength: 1 }, nhomThan);
        p.style.strokeDasharray = '1 1'; dsNet.push(p); return p;
      };
      const P = (pts, dong) => (tay ? K.duongTay(pts, { hat: 91 + dsNet.length * 3, lech: 1.4, dong }) : 'M' + pts.map((q) => q.join(' ')).join(' L') + (dong ? ' Z' : ''));
      net(P([[-120, -150], [0, -240], [120, -150]], false), null);
      net(P([[-100, -165], [-100, 0], [100, 0], [100, -165]], false), null);
      dsTo.push(K.svg('path', { d: 'M-100 -165 L0 -240 L100 -165 L100 0 L-100 0 Z', fill: tuong }, nhomThan));
      nhomThan.insertBefore(dsTo[dsTo.length - 1], nhomThan.firstChild.nextSibling);
      net(P([[-25, 0], [-25, -70], [25, -70], [25, 0]], false), m.nhan);
      net(P([[50, -120], [80, -120], [80, -90], [50, -90]], true), kinh);
      net(P([[-80, -120], [-50, -120], [-50, -90], [-80, -90]], true), kinh);
      cua = [0, -35];
      dat.setAttribute('rx', 160);
    }
    let nhanEl = null;
    if (opt.nhan) nhanEl = K.chu(khoi, opt.nhan, { x: 0, y: 44 / Math.min(1, co || 1), co: 22 / Math.min(1, co || 1), dam: 600, mau: K.tuongPhan(m.chu_phu, m.nen) >= 4.5 ? m.chu_phu : m.chu, neo: 'middle' });

    const tinh = opt.tinh || (opt.vao != null && opt.vao < 0), vao = opt.vao > 0 ? opt.vao : 0;
    const nhip = opt.nhip != null ? opt.nhip : 0.22;
    const snap = (p) => (Math.abs(1 - p) < 0.003 ? 1 : p);
    const mo = (el, v) => { el.style.opacity = v >= 0.999 ? '' : Math.max(0, v).toFixed(3); };
    return {
      el: g,
      seek(t) {
        const s = tinh ? 1e6 : t - vao;
        dat.style.opacity = (0.1 * K.cl(s / 0.3)).toFixed(3);
        if (nhanEl) mo(nhanEl, K.eo3(K.tienDo(s, 0.4, 0.35)));
        if (loai === 'nha_don') {
          dsNet.forEach((p, i) => { const q = K.eio(K.tienDo(s, i * 0.18, 0.5)); p.style.strokeDashoffset = (1 - q).toFixed(4); p.style.visibility = q <= 0 ? 'hidden' : 'visible'; });
          const pt = K.eo3(K.tienDo(s, dsNet.length * 0.18 + 0.1, 0.4));
          dsTo.forEach((f) => mo(f, pt));
          return;
        }
        if (loai === 'dang_xay') {
          mo(nhomThan, K.cl(s / 0.1));
          dsTang.forEach((tg, f) => {
            // tầng được đặt xuống từ trên (như cẩu thả xuống): chỉ dịch và ẩn hiện, không độ mờ (độ mờ nhóm làm ảnh chụp lại lệch mép)
            const tau = s - (0.1 + f * nhip), q = snap(K.spr(tau, 0.3, 0.7));
            tg.style.visibility = tau <= 0 ? 'hidden' : '';
            tg.setAttribute('transform', q === 1 ? '' : `translate(0 ${((1 - q) * -40).toFixed(2)})`);
          });
          const tC = 0.1 + dsTang.length * nhip;
          mo(giao, K.eo3(K.tienDo(s, 0.1 + Math.min(3, dsTang.length) * nhip, 0.4)));   // giàn giáo hiện sau vài tầng đầu
          mo(nhomMai, K.eo3(K.tienDo(s, tC - 0.3, 0.4)));
          // móc cẩu: hạ xuống, nâng lên, chu kỳ 4 giây
          const cao = day._cao, ph = s > tC ? ((s - tC) % 4) / 4 : 0, dai = 60 + 90 * (0.5 - 0.5 * Math.cos(ph * Math.PI * 2));
          const yM = -cao - 8 + dai;
          day.setAttribute('y2', yM.toFixed(1));
          moc.setAttribute('d', `M80 ${yM.toFixed(1)} L80 ${(yM + 10).toFixed(1)} Q80 ${(yM + 22).toFixed(1)} 70 ${(yM + 18).toFixed(1)}`);
          return;
        }
        const pThan = snap(K.spr(s, 0.55, 0.62));
        nhomThan.setAttribute('transform', pThan === 1 ? '' : `scale(1 ${Math.max(0, pThan).toFixed(4)})`);
        mo(nhomThan, K.cl(s / 0.1));
        const pMai = snap(K.spr(s - 0.32, 0.4, 0.55));
        nhomMai.setAttribute('transform', pMai === 1 ? '' : `translate(0 ${((1 - pMai) * -40).toFixed(2)})`);
        mo(nhomMai, K.cl((s - 0.32) / 0.12));
        if (vienCan) {
          const tau = s - 0.9, a = tau < 0 ? 0 : Math.min(1, tau / 0.3) * (0.55 + 0.45 * Math.cos(tau * Math.PI));
          vienCan.setAttribute('stroke-opacity', a.toFixed(3));   // độ mờ nét, không độ mờ nhóm
        }
      },
      moc: {
        day: [0, 0], dinh: [0, -H * co], tam: [0, (-H * co) / 2], trai: [(-W * co) / 2, (-H * co) / 2], phai: [(W * co) / 2, (-H * co) / 2],
        cua: [cua[0] * co, cua[1] * co], can: can ? [can[0] * co, can[1] * co] : null, moc_cau: mocCau ? [mocCau[0] * co, mocCau[1] * co] : null,
      },
      nhan: nhanEl,
    };
  };
})();
