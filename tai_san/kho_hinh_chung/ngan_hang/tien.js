// ngan_hang/tien.js — 1.0 — tiền giản lược (không chân dung, không mẫu tờ tiền thật): tờ tiền, xấp tiền chồng thành cọc, chồng xu mọc dần, túi tiền.
// Gọi: KHO.xap_tien_dong_xu({ loai, so, nhan, menh_gia, don_vi, khoa_mau, kieu, co, mau, vao, moc_hien, nhip, tre, tinh, hat }); bí danh KHO.tien.
//   loai 'chong_xu' (mặc định) | 'xap_tien' | 'to_tien' | 'tui_tien';
//   so: số đồng xu (hoặc số xấp) mỗi chồng — một số hoặc mảng (nhiều chồng đứng cạnh nhau, ví dụ [2, 4, 7] như cột biểu đồ); to_tien: số tờ xếp lệch (mặc định 1);
//   nhan: chữ dưới mỗi chồng (chuỗi hoặc mảng, 22 px; ví dụ 'Năm 1'), hoặc chữ dưới túi tiền / tờ tiền;
//   menh_gia: chữ mệnh giá trên tờ tiền (mặc định '100.000'), don_vi: chữ đơn vị (mặc định 'đồng'); trên túi tiền là ký hiệu (mặc định 'đ');
//   khoa_mau: khoá màu chính (mặc định chong_xu, tui_tien → canh_bao; xap_tien, to_tien → tot);
//   kieu 'phang' | 'net_tay'; co: tỉ lệ; vao: giây bắt đầu (-1 hiện đủ); moc_hien: mảng giây bắt đầu mọc của từng chồng (tính từ lúc hình xuất hiện, như vao);
//   nhip: giây giữa hai đồng xu / hai xấp rơi xuống (mặc định 0,07 / 0,14); tre: giây lệch giữa hai chồng (mặc định 0,25); tinh: true hiện đủ.
// Kích thước chuẩn: gốc toạ độ ở giữa chân (mặt đất), hình nằm phía trên (y âm). Đồng xu rộng 96, dày 11; xấp tiền rộng 240, dày 26;
// tờ tiền 260×130 (gốc ở tâm tờ, không ở chân); túi tiền cao 230. Các chồng cách nhau 130 (xu) hoặc 290 (xấp).
// Trả về { el, seek(t), moc }: moc { day, dinh (đỉnh chồng cao nhất), dinh_chong: [[x,y] đỉnh từng chồng], tam, trai, phai, rong, cao } — đã nhân co.
// Chuyển động: từng đồng xu, từng xấp rơi xuống nảy nhẹ bằng lò xo, chồng mọc dần theo nhịp; sau đó đồng trên cùng loé sáng định kỳ, túi tiền lắc nhẹ.
// Dựng mới (bản 2D). Chiều cao chồng theo xuong_html/n86_tien_gui_casa/trang.html:239 (chong(n): n tầng chồng lên nhau).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;

  function boVe(g, tay, m, hat0) {
    let hat = hat0;
    const defs = K.svg('defs', null, g), dsMau = {};
    const gach = (mau, mo, goc = 35, buoc = 7) => {
      const k = mau + mo + goc + buoc;
      if (!dsMau[k]) {
        const id = `kho-ti-g${++demId}`;
        const p = K.svg('pattern', { id, width: buoc, height: buoc, patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${goc})` }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: buoc, stroke: mau, 'stroke-width': 1.6, opacity: mo }, p);
        dsMau[k] = `url(#${id})`;
      }
      return dsMau[k];
    };
    const da = (cha, pts, o = {}) => {
      const net = o.net === undefined ? m.vien : o.net, day = o.day || 2.5;
      if (!tay) {
        const d = o.d || 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
        return K.svg('path', { d, fill: o.to || 'none', stroke: net || 'none', 'stroke-width': day, 'stroke-linejoin': 'round' }, cha);
      }
      const nhom = K.svg('g', null, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.6, dong: true }), fill: o.to }, nhom);
      if (o.gach) K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.6, dong: true }), fill: gach(o.gach[0], o.gach[1]) }, nhom);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.0, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, nhom);
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.6, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.4, opacity: 0.45, 'stroke-linecap': 'round' }, nhom);
      }
      return nhom;
    };
    const elip = (cx, cy, rx, ry, n = 28, a0 = 0, a1 = Math.PI * 2) => { const p = []; for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return p; };
    return { da, gach, defs, elip, hat: () => hat++ };
  }

  // Lấy mẫu một chuỗi Bézier bậc ba [đầu, c1, c2, cuối, c1, c2, cuối, ...] thành dãy điểm (để vẽ nét tay theo đường cong).
  function layDiem(p, n) {
    const ra = [p[0]];
    for (let i = 1; i + 2 < p.length; i += 3) {
      const a = p[i - 1], b = p[i], c = p[i + 1], d = p[i + 2];
      for (let k = 1; k <= n; k++) { const t = k / n, u = 1 - t; ra.push([u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0], u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1]]); }
    }
    return ra;
  }

  K.xap_tien_dong_xu = function (opt) {
    opt = Object.assign({ loai: 'chong_xu', kieu: 'phang', co: 1 }, opt || {});
    const loai = ['chong_xu', 'xap_tien', 'to_tien', 'tui_tien'].includes(opt.loai) ? opt.loai : 'chong_xu';
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', co = opt.co;
    const khoa = opt.khoa_mau || (loai === 'chong_xu' || loai === 'tui_tien' ? 'canh_bao' : 'tot');
    const goc = m[khoa] || m.canh_bao;
    const g = K.svg('g', { class: 'kho-tien' });
    const khoi = K.svg('g', { transform: `scale(${co})` }, g);
    const B = boVe(khoi, tay, m, opt.hat || 71);
    const ng = K.ngauNhien((opt.hat || 71) + 3);
    const dsSo = [].concat(opt.so == null ? (loai === 'chong_xu' ? [6] : loai === 'xap_tien' ? [4] : [1]) : opt.so).map((x) => Math.max(0, Math.round(x)));
    const dsNhan = [].concat(opt.nhan == null ? [] : opt.nhan);
    const bong = (cha, cx, cy, rx, ry) => (tay ? B.da(cha, B.elip(cx, cy, rx, ry, 24), { net: null, gach: [m.chu, 0.3] }) : K.svg('ellipse', { cx, cy, rx, ry, fill: '#000', opacity: 0.12 }, cha));
    const nhanDuoi = (cha, s, x, y) => {
      if (!s) return null;
      const mauChu = K.tuongPhan(m.chu_phu, m.nen) >= 4.5 ? m.chu_phu : m.chu;
      return K.chu(cha, s, { x, y, co: 22, dam: 600, mau: mauChu, neo: 'middle' });
    };
    const vatThe = [];        // { el, t0 (giây tương đối), cao rơi, chong }
    const dinhChong = [];
    let rong = 0, cao = 0, nhapNhay = null, lac = null;
    const vangSang = K.tron(goc, '#FFFFFF', 0.25), vangToi = K.tron(goc, m.chu, 0.3), vangVien = K.tron(goc, m.chu, 0.55);

    const tre = opt.tre != null ? opt.tre : 0.25;
    const vao = opt.vao > 0 ? opt.vao : 0;
    const batDau = (j) => (opt.moc_hien && opt.moc_hien[j] != null ? opt.moc_hien[j] - vao : 0.1 + j * tre);

    if (loai === 'chong_xu') {
      const RX = 48, RY = 16, DAY = 11, KC = 130, nhip = opt.nhip != null ? opt.nhip : 0.07;
      const n = dsSo.length, x0 = -((n - 1) * KC) / 2;
      rong = (n - 1) * KC + RX * 2;
      dsSo.forEach((so, j) => {
        const cx = x0 + j * KC, chong = K.svg('g', null, khoi);
        bong(chong, cx + 6, 2, RX + 10, RY);
        for (let i = 0; i < so; i++) {
          const lech = (ng(j * 50 + i) - 0.5) * 6, y = -i * DAY, xu = K.svg('g', null, chong);
          const cxx = cx + lech;
          // thân đồng xu: nửa dưới elip + hai cạnh
          const than = B.elip(cxx, y - DAY / 2, RX, RY, 18, 0, Math.PI).concat(B.elip(cxx, y - DAY / 2 - DAY, RX, RY, 18, Math.PI, 0));
          B.da(xu, than, { to: vangToi, net: vangVien, day: 2, gach: tay ? [vangVien, 0.45] : null });
          if (!tay) for (let k = 1; k < 6; k++) { const a = (k / 6) * Math.PI; K.svg('line', { x1: cxx + RX * Math.cos(a), y1: y - DAY / 2 + RY * Math.sin(a) - DAY + 2, x2: cxx + RX * Math.cos(a), y2: y - DAY / 2 + RY * Math.sin(a) - 2, stroke: vangVien, 'stroke-width': 1.2, opacity: 0.45 }, xu); }
          // mặt trên
          B.da(xu, B.elip(cxx, y - DAY * 1.5, RX, RY, 28), { to: vangSang, net: vangVien, day: 2 });
          B.da(xu, B.elip(cxx, y - DAY * 1.5, RX * 0.68, RY * 0.68, 24), { to: 'none', net: vangVien, day: 1.4 });
          vatThe.push({ el: xu, t0: batDau(j) + i * nhip, roi: 90 });
        }
        const yDinh = -so * DAY - DAY * 0.5 - RY;
        dinhChong.push([cx, so ? yDinh : 0]);
        cao = Math.max(cao, -yDinh);
        const nh = nhanDuoi(khoi, dsNhan[j], cx, 44);
        if (nh) vatThe.push({ el: nh, t0: batDau(j), roi: 0, chu: true });
      });
      // loé sáng trên đồng xu cao nhất
      const jMax = dsSo.indexOf(Math.max(...dsSo));
      if (dsSo[jMax] > 0) {
        const [cx, yd] = dinhChong[jMax];
        nhapNhay = K.svg('path', { d: 'M0 -14 L4 -4 L14 0 L4 4 L0 14 L-4 4 L-14 0 L-4 -4 Z', fill: '#FFFFFF', stroke: vangVien, 'stroke-width': 1 }, khoi);
        nhapNhay.t0 = batDau(jMax) + dsSo[jMax] * nhip + 0.4; nhapNhay.x = cx + 22; nhapNhay.y = yd + RY - 6;
      }
    } else if (loai === 'xap_tien') {
      const W = 240, D = 26, DX = 30, DY = -18, KC = 290, nhip = opt.nhip != null ? opt.nhip : 0.14;
      const nen = K.tron(goc, m.giay, 0.55), nenToi = K.tron(goc, m.giay, 0.2), vien = K.tron(goc, m.chu, 0.55), bang = m.nhan;
      const n = dsSo.length, x0 = -((n - 1) * KC) / 2;
      rong = (n - 1) * KC + W + DX;
      dsSo.forEach((so, j) => {
        const cx = x0 + j * KC, chong = K.svg('g', null, khoi);
        bong(chong, cx + 16, 0, W * 0.62, 18);
        for (let i = 0; i < so; i++) {
          const lech = (ng(j * 50 + i) - 0.5) * 16, x = cx - W / 2 + lech - DX / 2, y = -i * D, xap = K.svg('g', null, chong);
          // mặt trước (cạnh xấp: các mép tờ)
          B.da(xap, [[x, y], [x + W, y], [x + W, y - D], [x, y - D]], { to: nenToi, net: vien, day: 2, gach: tay ? [vien, 0.35] : null });
          for (let k = 1; k < 4; k++) (tay ? B.da(xap, [[x + 6, y - (D * k) / 4], [x + W - 6, y - (D * k) / 4]], { net: vien, day: 1 }) : K.svg('line', { x1: x + 4, y1: y - (D * k) / 4, x2: x + W - 4, y2: y - (D * k) / 4, stroke: vien, 'stroke-width': 1, opacity: 0.4 }, xap));
          // mặt bên phải
          B.da(xap, [[x + W, y], [x + W + DX, y + DY], [x + W + DX, y + DY - D], [x + W, y - D]], { to: K.tron(nenToi, m.chu, 0.15), net: vien, day: 2 });
          // mặt trên: tờ tiền nhìn nghiêng
          const tren = [[x, y - D], [x + W, y - D], [x + W + DX, y - D + DY], [x + DX, y - D + DY]];
          B.da(xap, tren, { to: nen, net: vien, day: 2 });
          B.da(xap, [[x + 14, y - D - 3], [x + W - 8, y - D - 3], [x + W + DX - 14, y - D + DY + 3], [x + DX + 8, y - D + DY + 3]], { to: 'none', net: vien, day: 1.2 });
          // đai giấy quấn giữa xấp
          const bx = x + W * 0.42;
          B.da(xap, [[bx, y], [bx + 34, y], [bx + 34, y - D], [bx, y - D]], { to: bang, net: vien, day: 1.5 });
          B.da(xap, [[bx, y - D], [bx + 34, y - D], [bx + 34 + DX, y - D + DY], [bx + DX, y - D + DY]], { to: K.tron(bang, '#FFFFFF', 0.2), net: vien, day: 1.5 });
          // vòng tròn mệnh giá trên mặt trên
          B.da(xap, B.elip(x + W * 0.78 + DX / 2, y - D + DY / 2, 16, 6, 18), { to: 'none', net: vien, day: 1.2 });
          vatThe.push({ el: xap, t0: batDau(j) + i * nhip, roi: 140 });
        }
        const yDinh = -so * D + DY;
        dinhChong.push([cx, so ? yDinh : 0]);
        cao = Math.max(cao, -yDinh);
        const nh = nhanDuoi(khoi, dsNhan[j], cx, 44);
        if (nh) vatThe.push({ el: nh, t0: batDau(j), roi: 0, chu: true });
      });
    } else if (loai === 'to_tien') {
      const W = 260, H = 130, so = Math.min(5, Math.max(1, dsSo[0] || 1));
      const nen = K.tron(goc, m.giay, 0.62), vien = K.tron(goc, m.chu, 0.55), dam = K.tron(goc, m.chu, 0.15);
      const mauChu = K.tuongPhan(K.tron(goc, m.chu, 0.45), nen) >= 4.5 ? K.tron(goc, m.chu, 0.45) : K.tron(goc, m.chu, 0.75);
      rong = W; cao = H;
      for (let i = so - 1; i >= 0; i--) {
        const to = K.svg('g', { transform: `translate(${i * 14} ${-i * 10}) rotate(${(-i * 4).toFixed(1)})` }, khoi);
        if (!tay) K.svg('rect', { x: -W / 2 + 6, y: -H / 2 + 8, width: W, height: H, rx: 8, fill: '#000', opacity: 0.12 }, to);
        B.da(to, [[-W / 2, -H / 2], [W / 2, -H / 2], [W / 2, H / 2], [-W / 2, H / 2]], { to: nen, net: vien, day: 2.5, d: `M${-W / 2 + 8} ${-H / 2} H${W / 2 - 8} Q${W / 2} ${-H / 2} ${W / 2} ${-H / 2 + 8} V${H / 2 - 8} Q${W / 2} ${H / 2} ${W / 2 - 8} ${H / 2} H${-W / 2 + 8} Q${-W / 2} ${H / 2} ${-W / 2} ${H / 2 - 8} V${-H / 2 + 8} Q${-W / 2} ${-H / 2} ${-W / 2 + 8} ${-H / 2} Z` });
        B.da(to, [[-W / 2 + 10, -H / 2 + 10], [W / 2 - 10, -H / 2 + 10], [W / 2 - 10, H / 2 - 10], [-W / 2 + 10, H / 2 - 10]], { to: 'none', net: vien, day: 1.2 });
        // hoa văn sóng và huy hiệu tròn (không chân dung)
        let d = '';
        for (let x = 0; x <= 110; x += 6) d += (x ? ' L' : 'M') + (-W / 2 + 20 + x) + ' ' + (H / 2 - 30 + Math.sin(x / 9) * 6).toFixed(1);
        K.svg('path', { d, fill: 'none', stroke: vien, 'stroke-width': 1.4, opacity: 0.6 }, to);
        B.da(to, B.elip(W / 2 - 62, 0, 40, 40, 30), { to: dam, net: vien, day: 2 });
        B.da(to, B.elip(W / 2 - 62, 0, 30, 30, 26), { to: 'none', net: K.tron(nen, '#FFFFFF', 0.4), day: 1.5 });
        if (i === 0) {
          K.chu(to, opt.menh_gia != null ? opt.menh_gia : '100.000', { x: -W / 2 + 22, y: -H / 2 + 46, co: 30, dam: 800, mau: mauChu });
          K.chu(to, opt.don_vi != null ? opt.don_vi : 'đồng', { x: -W / 2 + 22, y: -H / 2 + 74, co: 22, dam: 600, mau: mauChu });
          K.chu(to, 'đ', { x: W / 2 - 62, y: 13, co: 36, dam: 800, mau: K.chuTren(dam, '#FFFFFF', m.chu), neo: 'middle' });
        }
        vatThe.push({ el: to, goc: to.getAttribute('transform'), t0: (opt.moc_hien && opt.moc_hien[0] != null ? opt.moc_hien[0] - vao : 0.05) + (so - 1 - i) * 0.12, roi: 60, xoay: true });
      }
      dinhChong.push([0, -H / 2]);
      if (dsNhan[0]) { const nh = nhanDuoi(khoi, dsNhan[0], 0, H / 2 + 44); vatThe.push({ el: nh, t0: 0.3, roi: 0, chu: true }); }
    } else {
      // túi tiền
      const nen = K.tron(goc, m.giay, 0.5), vien = K.tron(goc, m.chu, 0.55), toi = K.tron(goc, m.chu, 0.2);
      rong = 220; cao = 230;
      lac = K.svg('g', null, khoi);
      bong(lac, 6, 2, 100, 16);
      const DTUI = 'M-34 -150 C-120 -120 -130 -40 -100 -12 C-80 4 80 4 100 -12 C130 -40 120 -120 34 -150 Z';
      const tui = layDiem([[-34, -150], [-120, -120], [-130, -40], [-100, -12], [-80, 4], [80, 4], [100, -12], [130, -40], [120, -120], [34, -150]], 10);
      B.da(lac, tui, { to: nen, net: vien, day: 3, d: DTUI, gach: tay ? [vien, 0.25] : null });
      if (!tay) K.svg('path', { d: 'M-70 -110 C-96 -80 -96 -40 -78 -20', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 8, opacity: 0.35, 'stroke-linecap': 'round' }, lac);
      // cổ túi và dây buộc
      B.da(lac, [[-34, -150], [-46, -172], [-60, -194], [-32, -184], [-12, -198], [8, -186], [30, -199], [58, -192], [46, -172], [34, -150]], { to: nen, net: vien, day: 3 });
      B.da(lac, [[-40, -158], [40, -158], [40, -146], [-40, -146]], { to: toi, net: vien, day: 2 });
      const kh = opt.menh_gia != null ? opt.menh_gia : 'đ';
      const coKH = K.coVua(kh, 150, 84, 800, 28);
      K.chu(lac, kh, { x: 0, y: -58 + coKH * 0.32, co: coKH, dam: 800, mau: K.tuongPhan(toi, nen) >= 4.5 ? toi : vien, neo: 'middle' });
      dinhChong.push([0, -200]);
      vatThe.push({ el: lac, t0: opt.moc_hien && opt.moc_hien[0] != null ? opt.moc_hien[0] - vao : 0.05, roi: 0, nay: true });
      if (dsNhan[0]) { const nh = nhanDuoi(khoi, dsNhan[0], 0, 44); vatThe.push({ el: nh, t0: 0.4, roi: 0, chu: true }); }
    }

    const tinh = opt.tinh || (opt.vao != null && opt.vao < 0);
    const H0 = loai === 'to_tien' ? 0 : -cao / 2;
    return {
      el: g,
      seek(t) {
        const s = tinh ? 1e6 : t - vao;
        for (const v of vatThe) {
          const tau = s - v.t0;
          if (v.chu) { v.el.style.opacity = K.eo3(K.tienDo(tau, 0, 0.35)).toFixed(3); continue; }
          if (v.nay) {
            const p = K.spr(tau, 0.5, 0.55), lacG = tau > 0.8 ? Math.sin((tau - 0.8) * 2.2) * 2.2 : 0;
            v.el.setAttribute('transform', `rotate(${lacG.toFixed(2)} 0 0) scale(${Math.max(0, p).toFixed(4)})`);
            v.el.style.opacity = K.cl(tau / 0.1).toFixed(3);
            continue;
          }
          const p = K.spr(tau, 0.32, 0.6), y = (1 - p) * -v.roi;
          const xoay = v.xoay ? `rotate(${((1 - p) * -8).toFixed(2)})` : '';
          v.el.setAttribute('transform', `translate(0 ${y.toFixed(2)}) ${xoay} ${v.goc || ''}`);
          v.el.style.opacity = tau <= 0 ? 0 : K.cl(tau / 0.08).toFixed(3);
        }
        if (nhapNhay) {
          const tau = s - nhapNhay.t0, chu = 3.2, ph = tau > 0 ? (tau % chu) / chu : 1;
          const a = ph < 0.18 ? Math.sin((ph / 0.18) * Math.PI) : 0;
          nhapNhay.style.opacity = a.toFixed(3);
          nhapNhay.setAttribute('transform', `translate(${nhapNhay.x} ${nhapNhay.y}) scale(${(0.6 + 0.6 * a).toFixed(3)})`);
        }
      },
      moc: {
        day: [0, 0], dinh: [dinhChong.reduce((a, b) => (b[1] < a[1] ? b : a), [0, 0])[0] * co, Math.min(0, ...dinhChong.map((d) => d[1])) * co],
        dinh_chong: dinhChong.map(([x, y]) => [x * co, y * co]), tam: [0, H0 * co], trai: [(-rong / 2) * co, H0 * co], phai: [(rong / 2) * co, H0 * co], rong: rong * co, cao: cao * co,
      },
    };
  };
  K.tien = K.xap_tien_dong_xu;
})();
