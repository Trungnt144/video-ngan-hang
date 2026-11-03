// chung/truc_thoi_gian.js — 1.0 — trục thời gian vẽ dần (mốc có nhãn trên/dưới, đoạn tô màu, ngoặc gom đoạn, thanh kéo dài theo t)
// và KHO.lich_thang (lịch một tháng: đánh dấu ngày đến hạn, tô dải ngày quá hạn, khoanh ngày).
// Nguồn gom: xuong_dai/no_nhom_1_den_5/src/Canh5678.tsx:57 (DaiLich), Canh1234.tsx:64 (LichIcon) và :146-170 (lưới lịch tháng 3).
// Kích thước chuẩn: trục nằm ngang từ (0,0) tới (rong,0), rong mặc định 1400; nhãn mốc ở phía trên (y âm), đoạn và ngoặc ở phía dưới.
// KHO.truc_thoi_gian({ kieu, mau, rong, tu, den, vach, moc, doan, ngoac, thanh, vao, tinh })
//   tu, den       giá trị đầu và cuối trục (ví dụ 0 và 36 tháng)
//   vach          { buoc: 6, nhan: (v) => `${v}`, gia_tri: [..] } vạch chia nhỏ dưới trục; bỏ trống thì không có
//   moc           [{ gia_tri, nhan, nhan_phu, manh: true|false, mau: 'nhan', vach_doc: true, hien }]   nhãn tự xếp tầng khi chật
//   doan          [{ tu, den, nhan, mau: 'nhan'|'nhan_phu'|'tot'|'xau'|'canh_bao', tang, hien }]          dải màu dưới trục
//   ngoac         [{ tu, den, nhan, vi_tri: 'duoi'|'tren', tang, hien }]                                      ngoặc gom đoạn
//   thanh         { tu, khoa: [{ t, gia_tri }], nhan, mau }   thanh dày phủ trục kéo dài tới giá trị nội suy tại t
//   vao           giây bắt đầu vẽ trục (mặc định 0); -1 hoặc tinh: true thì hiện đủ ngay
//   hien          (mỗi mục) giây mục đó hiện; bỏ trống thì lần lượt sau trục
// Trả { el, seek(t), moc: { dau, cuoi, cac_moc: [[x,y]], doan: [[x,y]], dinh_thanh }, xCua(v) }.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let DEM = 0;

  // ---------- tiện ích nội bộ (đề xuất gom vào kho_nen) ----------
  function defsTrong(g) {
    let d = g.querySelector(':scope > defs');
    if (!d) { d = K.svg('defs'); g.insertBefore(d, g.firstChild); }
    return d;
  }
  // Bộ lọc nét run theo hệ toạ độ của hình (userSpaceOnUse): đường thẳng ngang không bị mất như khi dùng objectBoundingBox.
  function locTay(g, hat, doRun, vung) {
    const id = 'kho-ttg-nt-' + (++DEM);
    const f = K.svg('filter', { id, filterUnits: 'userSpaceOnUse', x: vung[0], y: vung[1], width: vung[2], height: vung[3] }, defsTrong(g));
    K.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.04, numOctaves: 2, seed: hat, result: 'n' }, f);
    K.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: doRun * 2, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
    return `url(#${id})`;
  }
  // Mẫu gạch chéo bút chì để tô vùng ở kiểu net_tay.
  function gachCheo(g, mau, goc = 45, buoc = 10, day = 2.6, mo = 0.85) {
    const id = 'kho-ttg-gc-' + (++DEM);
    const p = K.svg('pattern', { id, patternUnits: 'userSpaceOnUse', width: buoc, height: buoc, patternTransform: `rotate(${goc})` }, defsTrong(g));
    K.svg('line', { x1: 1, y1: 0, x2: 1, y2: buoc, stroke: mau, 'stroke-width': day, opacity: mo, 'stroke-linecap': 'round' }, p);
    return `url(#${id})`;
  }
  // Đường thẳng thành chuỗi điểm cách nhau khoảng b để duongTay làm run.
  function chamThang(x1, y1, x2, y2, b = 90) {
    const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / b));
    const a = [];
    for (let i = 0; i <= n; i++) a.push([K.lerp(x1, x2, i / n), K.lerp(y1, y2, i / n)]);
    return a;
  }
  // Vòng khoanh tay: elip vẽ hơn một vòng một chút, đầu cuối không khép.
  function vongKhoanh(cx, cy, rx, ry, hat, lech = 2.2) {
    const pts = [], N = 26, a0 = -2.2;
    for (let i = 0; i <= N; i++) {
      const a = a0 + (i / N) * (Math.PI * 2 + 0.55);
      const k = 1 + 0.05 * Math.sin(i * 1.7);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return K.duongTay(pts, { hat, lech });
  }
  // Nội suy mảng khoá [{t, gia_tri}] tại t (đoạn giữa hai khoá dùng eio).
  function noiSuy(khoa, t) {
    if (!khoa || !khoa.length) return 0;
    if (t <= khoa[0].t) return khoa[0].gia_tri;
    for (let i = 1; i < khoa.length; i++) {
      if (t <= khoa[i].t) {
        const a = khoa[i - 1], b = khoa[i];
        return K.lerp(a.gia_tri, b.gia_tri, K.eio((t - a.t) / Math.max(1e-6, b.t - a.t)));
      }
    }
    return khoa[khoa.length - 1].gia_tri;
  }
  // Xếp tầng các khoảng [a,b] sao cho cùng tầng không chồng nhau (cách nhau ít nhất khe).
  function xepTang(ds, khe = 24) {
    const cuoi = [];
    return ds.map((k) => {
      if (k.tang != null) { cuoi[k.tang] = Math.max(cuoi[k.tang] || -1e9, k.b); return k.tang; }
      let L = 0;
      while (cuoi[L] != null && cuoi[L] + khe > k.a) L++;
      cuoi[L] = k.b;
      return L;
    });
  }

  K.truc_thoi_gian = function (opt) {
    const o = Object.assign({ kieu: 'phang', rong: 1400, tu: 0, den: 12, vao: 0, moc: [], doan: [], ngoac: [] }, opt || {});
    const m = K.layMau(o), tay = o.kieu === 'net_tay';
    const tinh = o.tinh || o.vao === -1, vao = tinh ? -1e6 : o.vao;
    const W = o.rong, xCua = (v) => ((v - o.tu) / (o.den - o.tu)) * W;
    const g = K.svg('g', { class: 'kho-truc-thoi-gian' });
    const hat = o.hat || 11;
    const CO = 30, CO_PHU = 24, CO_VACH = 24;

    // ----- lịch hiện mặc định -----
    const T_TRUC = 1.0;
    let tk = vao + T_TRUC * 0.6;
    const hienMoc = o.moc.map((k) => (k.hien != null && !tinh ? k.hien : (tk += 0.35) - 0.35));
    tk += 0.2;
    const hienDoan = o.doan.map((k) => (k.hien != null && !tinh ? k.hien : (tk += 0.5) - 0.5));
    const hienNgoac = o.ngoac.map((k) => (k.hien != null && !tinh ? k.hien : (tk += 0.5) - 0.5));

    // ----- bố cục: tầng nhãn mốc phía trên -----
    const coPhu = o.moc.some((k) => k.nhan_phu);
    const H_MOC = coPhu ? 76 : 48;
    const nhanMoc = o.moc.map((k) => {
      const x = xCua(k.gia_tri);
      const w = Math.max(k.nhan ? K.doChu(k.nhan, CO, 700) : 0, k.nhan_phu ? K.doChu(k.nhan_phu, CO_PHU, 500) : 0);
      const cx = K.cl(x, w / 2 - 50, W - w / 2 + 50);
      return { x, cx, w, a: cx - w / 2, b: cx + w / 2 };
    });
    const thuTu = nhanMoc.map((n, i) => i).sort((i, j) => nhanMoc[i].x - nhanMoc[j].x);
    const tangSx = xepTang(thuTu.map((i) => ({ a: nhanMoc[i].a, b: nhanMoc[i].b, tang: o.moc[i].tang })), 28);
    thuTu.forEach((i, k) => (nhanMoc[i].tang = tangSx[k]));
    const soTangMoc = nhanMoc.length ? Math.max(...nhanMoc.map((n) => n.tang)) + 1 : 0;
    const yNhanMoc = (L) => -34 - L * H_MOC; // đáy khối nhãn

    // ----- bố cục phía dưới: vạch, rồi đoạn và ngoặc dưới -----
    const coVach = !!o.vach;
    const yDuoi0 = coVach ? 76 : 34;
    const H_DUOI = 92;
    const mucDuoi = [];
    o.doan.forEach((d, i) => {
      const x1 = xCua(d.tu), x2 = xCua(d.den), w = d.nhan ? K.doChu(d.nhan, CO_PHU + 4, 600) : 0, cx = (x1 + x2) / 2;
      mucDuoi.push({ loai: 'doan', i, a: Math.min(x1, cx - w / 2), b: Math.max(x2, cx + w / 2), tang: d.tang });
    });
    o.ngoac.forEach((d, i) => {
      if (d.vi_tri === 'tren') return;
      const x1 = xCua(d.tu), x2 = xCua(d.den), w = d.nhan ? K.doChu(d.nhan, CO_PHU + 4, 600) : 0, cx = (x1 + x2) / 2;
      mucDuoi.push({ loai: 'ngoac', i, a: Math.min(x1, cx - w / 2), b: Math.max(x2, cx + w / 2), tang: d.tang });
    });
    // đoạn trước, ngoặc sau, mỗi nhóm theo vị trí x
    mucDuoi.sort((p, q) => (p.loai === q.loai ? p.a - q.a : p.loai === 'doan' ? -1 : 1));
    const tangDuoi = xepTang(mucDuoi, 30);
    mucDuoi.forEach((k, j) => (k.tang = tangDuoi[j]));
    const soTangDuoi = mucDuoi.length ? Math.max(...mucDuoi.map((k) => k.tang)) + 1 : 0;
    const ngoacTren = o.ngoac.map((d, i) => ({ d, i })).filter((k) => k.d.vi_tri === 'tren');
    const yNgoacTren0 = yNhanMoc(soTangMoc) - 18;
    const yTrenCung = yNgoacTren0 - ngoacTren.length * 80 - (o.thanh && o.thanh.nhan ? 60 : 0);
    const yDuoiCung = yDuoi0 + soTangDuoi * H_DUOI;
    const vung = [-120, yTrenCung - 80, W + 280, yDuoiCung - yTrenCung + 200];

    // ----- lớp -----
    const lopNen = K.svg('g', null, g);
    const lopNet = K.svg('g', tay ? { filter: locTay(g, hat, 1.6, vung) } : null, g);
    const lopChu = K.svg('g', null, g);
    const lopThanh = K.svg('g', null, g);

    // ----- trục -----
    const dayTruc = tay ? 3.4 : 5;
    const truc = K.svg('path', {
      d: tay ? K.duongTay(chamThang(0, 0, W + 40, 0, 110), { hat, lech: 1.3 }) : `M0 0 H${W + 40}`,
      fill: 'none', stroke: m.chu, 'stroke-width': dayTruc, 'stroke-linecap': 'round', opacity: tay ? 0.9 : 0.85,
    }, lopNet);
    const truc2 = tay ? K.svg('path', { d: K.duongTay(chamThang(4, 2, W - 6, 1, 130), { hat: hat + 1, lech: 1.6 }), fill: 'none', stroke: m.chu, 'stroke-width': 1.6, opacity: 0.45 }, lopNet) : null;
    const muiTen = K.svg('path', { d: tay ? `M${W + 28} -11 L${W + 48} 0 L${W + 29} 12` : `M${W + 30} -12 L${W + 50} 0 L${W + 30} 12`, fill: 'none', stroke: m.chu, 'stroke-width': dayTruc, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.85 }, lopNet);

    // ----- vạch chia -----
    const vach = [];
    if (coVach) {
      const gt = o.vach.gia_tri || (() => { const a = []; for (let v = o.tu; v <= o.den + 1e-9; v += o.vach.buoc || 1) a.push(+v.toFixed(6)); return a; })();
      const nhanV = o.vach.nhan || ((v) => K.so(v));
      gt.forEach((v, i) => {
        const x = xCua(v);
        const ln = K.svg('line', { x1: x, y1: -9, x2: x, y2: 11, stroke: m.chu_phu, 'stroke-width': tay ? 2.2 : 3, 'stroke-linecap': 'round' }, lopNet);
        const s = nhanV(v, i);
        const c = s ? K.chu(lopChu, s, { x, y: 50, co: CO_VACH, dam: 500, mau: m.chu_phu, neo: 'middle' }) : null;
        vach.push({ ln, c, p: i / Math.max(1, gt.length - 1) });
      });
    }

    // ----- đoạn tô màu (dưới trục) -----
    const doan = o.doan.map((d, i) => {
      const k = mucDuoi.find((q) => q.loai === 'doan' && q.i === i);
      const x1 = xCua(d.tu), x2 = xCua(d.den), y = yDuoi0 + k.tang * H_DUOI;
      const mau = m[d.mau || 'nhan'] || d.mau;
      const nhom = K.svg('g', null, lopNen);
      const yCot = coVach ? 64 : 10;
      const cot = K.svg('rect', { x: x1, y: yCot, width: x2 - x1, height: Math.max(0, y - yCot), fill: K.rgba(mau, 0.1) }, nhom);
      const vien = [x1, x2].map((x) => K.svg('line', { x1: x, y1: yCot, x2: x, y2: y, stroke: mau, 'stroke-width': 2, 'stroke-dasharray': '6 6', opacity: 0.7 }, nhom));
      const dai = K.svg('rect', { x: x1, y, width: x2 - x1, height: 28, rx: tay ? 3 : 7, fill: tay ? K.rgba(mau, 0.28) : mau }, nhom);
      const gach = tay ? K.svg('rect', { x: x1, y, width: x2 - x1, height: 28, fill: gachCheo(g, mau, 40 + i * 25) }, nhom) : null;
      const vienTay = tay ? K.svg('path', { d: K.duongTay([[x1, y], [x2, y], [x2, y + 28], [x1, y + 28]], { hat: hat + 10 + i, lech: 1.2, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.2, opacity: 0.85 }, lopNet) : null;
      const c = d.nhan ? K.chu(lopChu, d.nhan, { x: (x1 + x2) / 2, y: y + 28 + 34, co: CO_PHU + 4, dam: 600, mau: m.chu, neo: 'middle' }) : null;
      return { d, x1, x2, y, nhom, cot, vien, dai, gach, vienTay, c, t0: hienDoan[i] };
    });

    // ----- ngoặc -----
    const nhanNgoac = (x1, x2, y, huong) => {
      // huong 1: ngoặc dưới (mở lên), -1: ngoặc trên (mở xuống)
      const h = 16 * huong, xm = (x1 + x2) / 2;
      return `M${x1} ${y} Q${x1} ${y + h} ${x1 + 16} ${y + h} L${xm - 14} ${y + h} Q${xm} ${y + h} ${xm} ${y + h * 1.8} Q${xm} ${y + h} ${xm + 14} ${y + h} L${x2 - 16} ${y + h} Q${x2} ${y + h} ${x2} ${y}`;
    };
    const ngoac = o.ngoac.map((d, i) => {
      const x1 = xCua(d.tu), x2 = xCua(d.den), tren = d.vi_tri === 'tren';
      let y;
      if (tren) y = yNgoacTren0 - ngoacTren.findIndex((q) => q.i === i) * 80;
      else { const k = mucDuoi.find((q) => q.loai === 'ngoac' && q.i === i); y = yDuoi0 + k.tang * H_DUOI; }
      const huong = tren ? -1 : 1;
      const p = K.svg('path', { d: tay ? K.duongTay(chamThang(x1, y, x1, y + 14 * huong, 20).concat(chamThang(x1, y + 16 * huong, x2, y + 16 * huong, 70)).concat([[x2, y]]), { hat: hat + 30 + i, lech: 1.1 }) : nhanNgoac(x1, x2, y, huong),
        fill: 'none', stroke: m.chu, 'stroke-width': tay ? 2.6 : 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, lopNet);
      const nhon = tay ? K.svg('path', { d: `M${(x1 + x2) / 2 - 10} ${y + 16 * huong} L${(x1 + x2) / 2} ${y + 28 * huong} L${(x1 + x2) / 2 + 10} ${y + 16 * huong}`, fill: 'none', stroke: m.chu, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, lopNet) : null;
      const c = d.nhan ? K.chu(lopChu, d.nhan, { x: (x1 + x2) / 2, y: tren ? y - 40 : y + 62, co: CO_PHU + 4, dam: 700, mau: m.chu, neo: 'middle' }) : null;
      return { p, nhon, c, t0: hienNgoac[i] };
    });

    // ----- mốc -----
    const moc = o.moc.map((k, i) => {
      const n = nhanMoc[i], x = n.x, manh = !!k.manh, mau = m[k.mau || (manh ? 'nhan' : 'chu')] || k.mau;
      const nhom = K.svg('g', null, g); // trên lớp nét để chấm đè lên trục
      const doc = k.vach_doc ? K.svg('line', { x1: x, y1: yNhanMoc(n.tang) + 12, x2: x, y2: yDuoiCung - 30, stroke: mau, 'stroke-width': tay ? 2.4 : 3, 'stroke-dasharray': '10 8', opacity: 0.75 }, lopNen) : null;
      const yb = yNhanMoc(n.tang);
      const noi = n.tang > 0 || Math.abs(n.cx - x) > 4 ? K.svg('path', { d: `M${x} -16 L${x} ${yb + 10}`, stroke: m.chu_phu, 'stroke-width': 2, fill: 'none', opacity: 0.7 }, lopNen) : null;
      const r = manh ? 16 : 12;
      const vong = manh ? K.svg('circle', { cx: x, cy: 0, r: r + 8, fill: 'none', stroke: mau, 'stroke-width': 3 }, nhom) : null;
      const cham = tay
        ? K.svg('path', { d: vongKhoanh(x, 0, r, r, hat + 50 + i, 0.9), fill: manh ? K.rgba(mau, 0.75) : m.giay, stroke: m.chu, 'stroke-width': 2.8 }, nhom)
        : K.svg('circle', { cx: x, cy: 0, r, fill: manh ? mau : m.the, stroke: m.chu, 'stroke-width': 4 }, nhom);
      const ch = K.svg('g', null, lopChu);
      const cChinh = k.nhan ? K.chu(ch, k.nhan, { x: n.cx, y: k.nhan_phu ? yb - 32 : yb, co: CO, dam: 700, mau: manh ? (K.tuongPhan(mau, m.nen) >= 4.5 ? mau : m.chu) : m.chu, neo: 'middle' }) : null;
      const cPhu = k.nhan_phu ? K.chu(ch, k.nhan_phu, { x: n.cx, y: yb, co: CO_PHU, dam: 500, mau: m.chu_phu, neo: 'middle' }) : null;
      return { x, nhom, doc, noi, vong, cham, ch, cChinh, cPhu, t0: hienMoc[i], r };
    });

    // ----- thanh kéo dài theo t -----
    let thanh = null;
    if (o.thanh) {
      const th = o.thanh, mau = m[th.mau || 'nhan'] || th.mau;
      const x0 = xCua(th.tu != null ? th.tu : o.tu);
      const net = K.svg('line', { x1: x0, y1: 0, x2: x0, y2: 0, stroke: tay ? K.rgba(mau, 0.75) : mau, 'stroke-width': tay ? 10 : 12, 'stroke-linecap': 'round' }, lopThanh);
      const dau = K.svg('circle', { cx: x0, cy: 0, r: 13, fill: mau, stroke: tay ? m.chu : '#FFFFFF', 'stroke-width': 4 }, lopThanh);
      const yN = yTrenCung + 44;
      const noi = th.nhan ? K.svg('line', { x1: x0, y1: -20, x2: x0, y2: yN + 12, stroke: mau, 'stroke-width': 2.5, 'stroke-dasharray': '5 6' }, lopThanh) : null;
      const c = th.nhan ? K.chu(lopThanh, th.nhan, { x: x0, y: yN, co: CO_PHU + 4, dam: 700, mau: K.tuongPhan(mau, m.nen) >= 4.5 ? mau : m.chu, neo: 'middle' }) : null;
      const wNhan = th.nhan ? K.doChu(th.nhan, CO_PHU + 4, 700) : 0;
      thanh = { th, x0, net, dau, noi, c, wNhan, yN };
    }

    const hienG = (el, a) => el && el.setAttribute('opacity', a.toFixed(3));
    const ketQua = {
      el: g,
      xCua,
      moc: {
        dau: [0, 0], cuoi: [W, 0],
        cac_moc: moc.map((k) => [k.x, 0]),
        doan: doan.map((d) => [(d.x1 + d.x2) / 2, d.y + 14]),
        tren_cung: [0, yTrenCung], duoi_cung: [0, yDuoiCung],
        dinh_thanh: thanh ? [thanh.x0, 0] : null,
      },
      seek(t) {
        const pT = tinh ? 1 : K.eio(K.tienDo(t, vao, T_TRUC));
        K.veDan(truc, pT);
        if (truc2) K.veDan(truc2, K.eio(K.tienDo(t, vao + 0.2, T_TRUC)));
        hienG(muiTen, K.tienDo(pT, 0.85, 0.15));
        vach.forEach((v) => { const a = K.tienDo(pT, v.p * 0.92, 0.08); hienG(v.ln, a); hienG(v.c, a); });
        moc.forEach((k) => {
          const s = K.spr(t - k.t0, 0.45), a = K.cl(s * 1.5);
          k.nhom.setAttribute('transform', `translate(${k.x} 0) scale(${Math.max(0.001, s).toFixed(4)}) translate(${-k.x} 0)`);
          hienG(k.nhom, a);
          const aC = K.eo3(K.tienDo(t, k.t0 + 0.1, 0.35));
          hienG(k.ch, aC); k.ch.setAttribute('transform', `translate(0 ${(8 * (1 - aC)).toFixed(2)})`);
          hienG(k.noi, aC * 0.7); hienG(k.doc, aC * 0.75);
          if (k.vong) { const nhip = 0.5 + 0.5 * Math.sin((t - k.t0) * 3); k.vong.setAttribute('r', (k.r + 7 + 3 * nhip).toFixed(2)); hienG(k.vong, a * (0.35 + 0.3 * nhip)); }
        });
        doan.forEach((d) => {
          const p = K.eio(K.tienDo(t, d.t0, 0.7)), w = (d.x2 - d.x1) * p;
          d.dai.setAttribute('width', w.toFixed(2)); if (d.gach) d.gach.setAttribute('width', w.toFixed(2));
          d.cot.setAttribute('width', w.toFixed(2));
          hienG(d.nhom, K.cl(p * 4));
          d.vien[1].setAttribute('opacity', (0.7 * K.tienDo(p, 0.9, 0.1)).toFixed(3));
          if (d.vienTay) K.veDan(d.vienTay, p);
          hienG(d.c, K.eo3(K.tienDo(t, d.t0 + 0.4, 0.4)));
        });
        ngoac.forEach((n) => {
          const p = K.eio(K.tienDo(t, n.t0, 0.6));
          K.veDan(n.p, p); hienG(n.nhon, K.tienDo(p, 0.6, 0.3));
          hienG(n.c, K.eo3(K.tienDo(t, n.t0 + 0.35, 0.4)));
        });
        if (thanh) {
          const th = thanh.th, v = tinh ? th.khoa[th.khoa.length - 1].gia_tri : noiSuy(th.khoa, t);
          const x = xCua(v), a = tinh ? 1 : K.eo3(K.tienDo(t, th.khoa[0].t - 0.3, 0.3));
          thanh.net.setAttribute('x2', x.toFixed(2)); thanh.dau.setAttribute('cx', x.toFixed(2));
          hienG(lopThanh, a);
          if (thanh.c) {
            const cx = K.cl(x, thanh.wNhan / 2 - 50, W - thanh.wNhan / 2 + 50);
            thanh.c.setAttribute('x', cx.toFixed(2));
            thanh.noi.setAttribute('x1', x.toFixed(2)); thanh.noi.setAttribute('x2', x.toFixed(2));
          }
          ketQua.moc.dinh_thanh = [x, 0];
        }
      },
    };
    ketQua.seek(tinh ? 0 : vao);
    return ketQua;
  };

  // ======================================================================
  // KHO.lich_thang — lịch một tháng. Gốc toạ độ: góc trên trái của tấm lịch. Cỡ ô o (mặc định 104), rộng 7*o + 2*le.
  // { kieu, mau, thang: 'Tháng 3', nam, thu_ngay_1: 0..6 (0 = thứ Hai), so_ngay: 31, o: 104,
  //   danh_dau: [{ ngay, mau: 'nhan'|'xau'|'tot'|'canh_bao', nhan: 'đến hạn', hien }],
  //   dai: [{ tu, den, mau: 'xau', vao, moi_ngay: 0.12 }]   tô lần lượt từng ngày (đếm ngày quá hạn)
  //   khoanh: [{ ngay, hien, mau }], vao, tinh }
  // Trả { el, seek(t), moc: { goc, cuoi, rong, cao }, oNgay(d) → [x,y] tâm ô, soNgayDaTo(t, i) → số ngày của dải i đã tô }.
  // ======================================================================
  K.lich_thang = function (opt) {
    const o = Object.assign({ kieu: 'phang', thang: 'Tháng 3', thu_ngay_1: 4, so_ngay: 31, o: 104, danh_dau: [], dai: [], khoanh: [], vao: 0 }, opt || {});
    const m = K.layMau(o), tay = o.kieu === 'net_tay';
    const tinh = o.tinh || o.vao === -1, vao = tinh ? -1e6 : o.vao;
    const S = o.o, LE = 22, Y_THU = 110, Y_LUOI = 128;
    const soHang = Math.ceil((o.thu_ngay_1 + o.so_ngay) / 7);
    const RONG = 7 * S + 2 * LE, CAO = Y_LUOI + soHang * S + LE;
    const g = K.svg('g', { class: 'kho-lich-thang' });
    const hat = o.hat || 21;
    const oNgay = (d) => { const i = d - 1 + o.thu_ngay_1; return [LE + (i % 7) * S + S / 2, Y_LUOI + Math.floor(i / 7) * S + S / 2]; };

    const toan = K.svg('g', null, g);
    // bóng và tấm lịch
    if (!tay) K.svg('rect', { x: 6, y: 12, width: RONG, height: CAO, rx: 18, fill: '#000000', opacity: m.toi ? 0.35 : 0.08 }, toan);
    const nenTam = K.svg('rect', { x: 0, y: 0, width: RONG, height: CAO, rx: tay ? 4 : 18, fill: tay ? m.giay : m.the, stroke: tay ? 'none' : m.vien, 'stroke-opacity': 0.18, 'stroke-width': 2 }, toan);
    // dải đầu lịch
    const mauDau = m.nhan;
    const dau = K.svg('path', { d: tay ? '' : `M0 18 Q0 0 18 0 H${RONG - 18} Q${RONG} 0 ${RONG} 18 V72 H0 Z`, fill: mauDau }, toan);
    const lopNet = K.svg('g', tay ? { filter: locTay(g, hat, 1.5, [-40, -60, RONG + 80, CAO + 120]) } : null, toan);
    if (tay) {
      K.svg('rect', { x: 0, y: 0, width: RONG, height: 72, fill: K.rgba(mauDau, 0.3) }, toan);
      K.svg('rect', { x: 0, y: 0, width: RONG, height: 72, fill: gachCheo(g, mauDau, 35, 9, 2.4, 0.7) }, toan);
      toan.appendChild(lopNet);
      K.svg('path', { d: K.duongTay([[0, 0], [RONG, 0], [RONG, CAO], [0, CAO]], { hat, lech: 1.6, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 3 }, lopNet);
      K.svg('path', { d: K.duongTay(chamThang(0, 72, RONG, 72, 120), { hat: hat + 1, lech: 1.2 }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4 }, lopNet);
    }
    // vòng gáy lịch
    [0.25, 0.75].forEach((f) => {
      const x = RONG * f;
      K.svg('rect', { x: x - 7, y: -16, width: 14, height: 36, rx: 7, fill: tay ? 'none' : m.chu, stroke: tay ? m.chu : 'none', 'stroke-width': 2.6 }, tay ? lopNet : toan);
    });
    const cTieuDe = K.chu(toan, o.thang + (o.nam ? ' ' + o.nam : ''), { x: RONG / 2, y: 50, co: 34, dam: 800, mau: tay ? m.chu : K.chuTren(mauDau, '#FFFFFF', m.chu), neo: 'middle' });
    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].forEach((s, c) => K.chu(toan, s, { x: LE + c * S + S / 2, y: Y_THU, co: 24, dam: 600, mau: c === 6 ? m.xau : m.chu_phu, neo: 'middle' }));

    // ô ngày
    const danhDau = {};
    o.danh_dau.forEach((d, i) => (danhDau[d.ngay] = Object.assign({ i }, d)));
    let tk = vao + 0.5 + soHang * 0.08;
    const ngay = [];
    for (let d = 1; d <= o.so_ngay; d++) {
      const [cx, cy] = oNgay(d), x = cx - S / 2 + 4, y = cy - S / 2 + 4, w = S - 8;
      const hang = Math.floor((d - 1 + o.thu_ngay_1) / 7);
      const nhom = K.svg('g', null, toan);
      const nen = K.svg('rect', { x, y, width: w, height: w, rx: tay ? 2 : 10, fill: tay ? 'none' : m.nen_phu, 'fill-opacity': tay ? 0 : 0.55 }, nhom);
      const to = K.svg('rect', { x, y, width: w, height: w, rx: tay ? 2 : 10, fill: 'none', opacity: 0 }, nhom);
      const gach = tay ? K.svg('rect', { x, y, width: w, height: w, fill: 'none', opacity: 0 }, nhom) : null;
      if (tay) K.svg('path', { d: K.duongTay([[x, y], [x + w, y], [x + w, y + w], [x, y + w]], { hat: hat + 100 + d, lech: 1.1, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 1.6, opacity: 0.55 }, lopNet);
      const so = K.chu(nhom, String(d), { x: x + 12, y: y + 34, co: 28, dam: 600, mau: m.chu });
      const dd = danhDau[d];
      let nhan = null;
      if (dd && dd.nhan) {
        const co = Math.max(22, K.coVua(dd.nhan, w - 10, 22, 700, 22));
        nhan = K.chu(nhom, dd.nhan, { x: x + w / 2, y: y + w - 12, co, dam: 700, mau: m.chu, neo: 'middle' });
      }
      ngay.push({ d, nhom, nen, to, gach, so, nhan, t0: vao + 0.35 + hang * 0.08, dd, tDd: dd ? (dd.hien != null && !tinh ? dd.hien : (tk += 0.4) - 0.4) : 0 });
    }
    const dai = o.dai.map((d) => ({ d, t0: d.vao != null && !tinh ? d.vao : (tk += 0.3) - 0.3, buoc: d.moi_ngay || 0.12, mau: m[d.mau || 'xau'] || d.mau }));
    const khoanh = o.khoanh.map((k, i) => {
      const [cx, cy] = oNgay(k.ngay), mau = m[k.mau || 'nhan'] || k.mau;
      const p = K.svg('path', { d: vongKhoanh(cx, cy, S * 0.6, S * 0.56, hat + 200 + i, tay ? 2.4 : 1.2), fill: 'none', stroke: mau, 'stroke-width': tay ? 4 : 5, 'stroke-linecap': 'round' }, g);
      return { p, t0: k.hien != null && !tinh ? k.hien : (tk += 0.5) - 0.5 };
    });
    // mẫu gạch chéo cho mỗi màu tô (tạo một lần lúc dựng)
    const mauGach = {};
    if (tay) o.danh_dau.map((d) => m[d.mau || 'nhan'] || d.mau).concat(dai.map((a) => a.mau)).forEach((c) => { if (!mauGach[c]) mauGach[c] = gachCheo(g, c, 40, 9, 2.4, 0.8); });
    // dải ngày nào đang tô ở ngày d
    const soNgayDaTo = (t, i) => { const a = dai[i]; if (!a) return 0; const n = a.d.den - a.d.tu + 1; return tinh ? n : K.cl(Math.floor((t - a.t0) / a.buoc) + 1, 0, n); };

    const ketQua = {
      el: g,
      oNgay,
      soNgayDaTo,
      moc: { goc: [0, 0], cuoi: [RONG, CAO], rong: RONG, cao: CAO, tieu_de: [RONG / 2, 36] },
      seek(t) {
        const s = tinh ? 1 : K.spr(t - vao, 0.5);
        toan.setAttribute('transform', `translate(${RONG / 2} ${CAO / 2}) scale(${(0.94 + 0.06 * s).toFixed(4)}) translate(${-RONG / 2} ${-CAO / 2})`);
        toan.setAttribute('opacity', K.cl(s * 1.4).toFixed(3));
        ngay.forEach((n) => {
          const a = tinh ? 1 : K.eo3(K.tienDo(t, n.t0, 0.3));
          n.nhom.setAttribute('opacity', a.toFixed(3));
          let mau = null, muc = 0;
          if (n.dd) { const p = tinh ? 1 : K.eo3(K.tienDo(t, n.tDd, 0.35)); if (p > 0) { mau = m[n.dd.mau || 'nhan'] || n.dd.mau; muc = p; } }
          dai.forEach((a2, i) => {
            if (n.d >= a2.d.tu && n.d <= a2.d.den) {
              const k = n.d - a2.d.tu, p = tinh ? 1 : K.eo3(K.tienDo(t, a2.t0 + k * a2.buoc, 0.25));
              if (p > 0 && !(n.dd && muc > 0)) { mau = a2.mau; muc = p; }
            }
          });
          if (mau) {
            n.to.setAttribute('fill', tay ? K.rgba(mau, 0.3) : mau);
            n.to.setAttribute('opacity', (tay ? muc : muc * 0.9).toFixed(3));
            if (n.gach) { n.gach.setAttribute('fill', mauGach[mau]); n.gach.setAttribute('opacity', muc.toFixed(3)); }
            const chuMau = tay ? m.chu : K.chuTren(mau, '#FFFFFF', m.chu);
            n.so.setAttribute('fill', muc > 0.5 ? chuMau : m.chu); n.so.setAttribute('font-weight', muc > 0.5 ? 800 : 600);
            if (n.nhan) n.nhan.setAttribute('fill', muc > 0.5 ? chuMau : m.chu);
          } else {
            n.to.setAttribute('opacity', 0); if (n.gach) n.gach.setAttribute('opacity', 0);
            n.so.setAttribute('fill', m.chu); n.so.setAttribute('font-weight', 600);
            if (n.nhan) n.nhan.setAttribute('fill', m.chu);
          }
          if (n.nhan) n.nhan.setAttribute('opacity', muc.toFixed(3));
        });
        khoanh.forEach((k) => { const p = tinh ? 1 : K.eio(K.tienDo(t, k.t0, 0.6)); K.veDan(k.p, p); k.p.setAttribute('opacity', p > 0 ? 1 : 0); });
      },
    };
    ketQua.seek(tinh ? 0 : vao);
    return ketQua;
  };
})();
