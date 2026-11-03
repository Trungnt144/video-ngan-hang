// chung/bieu_do_duong.js — 1.0 — biểu đồ đường vẽ dần (lãi suất theo thời gian): trục, lưới, nhãn %, nhiều đường thẳng hoặc bậc thang,
// dải tô giữa hai đường (biên độ), vùng tô theo trục ngang (thời gian ưu đãi), mốc đánh dấu kỳ điều chỉnh, nhãn cuối đường.
// Gọi: KHO.bieu_do_duong_lai_suat(opt) → { el (<g> SVG), seek(t), moc }. Hàm dựng dữ liệu lãi thả nổi: KHO.laiSuatThaNoi(opt).
// Kích thước chuẩn: khung rong × cao (mặc định 1400 × 620 đơn vị), gốc toạ độ ở góc trên trái khung; trang video tự đặt transform.
// Tham số:
//   kieu 'phang' | 'net_tay'; mau (ghi đè bảng màu); rong, cao; tieu_de, chu_thich (dòng đầu và dòng phụ, tuỳ chọn);
//   truc_x { min, max, buoc, ten ('Tháng'), dinh_dang (hàm số → chữ) }; truc_y { min, max, buoc, don_vi ('%'), thap_phan (1), ten (chữ trên trục, tuỳ chọn) };
//     thiếu min, max, buoc thì tự tính từ dữ liệu.
//   duong: [{ ten, diem [[x,y],...], khoa_mau ('nhan'), bac_thang (true: giữ giá trị tới điểm sau), net_dut, day (độ dày, mặc định 6),
//            cham (true: chấm tròn ở mỗi điểm dữ liệu), nhan_cuoi ('ten_gia_tri' mặc định | 'ten' | 'gia_tri' | false), vao (giây bắt đầu vẽ), dai (giây vẽ) }]
//   dai_to: [{ duoi (chỉ số đường dưới), tren (chỉ số đường trên), tu, den (khoảng x tô, mặc định phần hai đường cùng có), khoa_mau, nhan (chữ trong dải, ví dụ "Biên độ 3,5%"), x_nhan (vị trí x đặt nhãn) }]
//   thap_phan_gia_tri (số chữ số thập phân ở nhãn cuối đường, mặc định 1);
//   vung: [{ tu, den (theo trục x), nhan, khoa_mau ('nhan_phu'), vao }] vùng tô dọc như thời gian lãi ưu đãi cố định.
//   moc_dieu_chinh: [{ x, duong (chỉ số đường đặt dấu, mặc định 0), nhan (tuỳ chọn) }]; nhan_moc (chữ chú giải dấu mốc, mặc định "Kỳ điều chỉnh lãi suất").
//   chu_giai (true: hiện chú giải các đường ở dòng đầu; mặc định chỉ hiện chú giải dấu mốc khi có mốc);
//   vao (giây bắt đầu, -1 hiện đủ), tinh (true hiện đủ), dai_ve (giây vẽ mỗi đường, mặc định 2,4), nhip (giây lệch giữa các đường, mặc định 0,35); hat (hạt giống nét tay).
// Điểm neo (moc): goc_truc [x,y]; diem(x, y) hàm đổi toạ độ dữ liệu → toạ độ khung; cuoi [[x,y],...] điểm cuối từng đường; vung_ve {x,y,w,h} vùng vẽ.
// Mẫu gốc: xuong_dai/lai_13_thang/src/Chung.tsx:126-141 (BIEU, Y_BIEU: lưới mảnh, toạ độ lãi theo kỳ hạn); dựng lại thành khuôn tham số 29/10/2026.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // ---------- hàm nội bộ (đề xuất gom vào kho_nen.js) ----------
  let demId = 0;
  const idMoi = (goc) => `kho-bdd-${goc}-${++demId}`;
  const thoiGian = (opt) => (opt.tinh || (opt.vao != null && opt.vao < 0)) ? () => 1e6 : (t) => t - (opt.vao || 0);
  const buocDep = (khoang, muonCo = 5) => {
    const tho = khoang / muonCo, mu = Math.pow(10, Math.floor(Math.log10(tho)));
    for (const h of [1, 2, 2.5, 5, 10]) if (h * mu >= tho) return h * mu;
    return 10 * mu;
  };
  // Chia đoạn dài thành nhiều đoạn ngắn để nét tay run đều.
  const chiaNho = (pts, dai = 46) => {
    const ra = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.round(L / dai));
      for (let j = 1; j <= n; j++) ra.push([x0 + (x1 - x0) * j / n, y0 + (y1 - y0) * j / n]);
    }
    return ra;
  };
  const dPhang = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

  // Giá trị một đường tại x (bậc thang: giữ giá trị điểm trước; thẳng: nội suy).
  const giaTri = (d, x) => {
    const p = d.diem;
    if (x <= p[0][0]) return p[0][1];
    for (let i = 1; i < p.length; i++) {
      if (x < p[i][0]) return d.bac_thang ? p[i - 1][1] : K.lerp(p[i - 1][1], p[i][1], (x - p[i - 1][0]) / (p[i][0] - p[i - 1][0]));
    }
    return p[p.length - 1][1];
  };
  // Dãy điểm dữ liệu để vẽ đường trong [a, b], gồm cả các điểm gãy B cho trước.
  const dayDiem = (d, a, b, B) => {
    const xs = [...new Set([a, b, ...d.diem.map((p) => p[0]), ...(B || [])])].filter((x) => x >= a && x <= b).sort((u, v) => u - v);
    const ra = [];
    xs.forEach((x, i) => {
      if (d.bac_thang && i > 0) ra.push([x, giaTri(d, xs[i - 1])]);
      ra.push([x, giaTri(d, x)]);
    });
    return ra;
  };

  // ---------- dữ liệu lãi suất thả nổi ----------
  // KHO.laiSuatThaNoi({ co_so: [[tháng, %], ...], bien_do: 3.5, ky_dieu_chinh: 3, tu: 0, den: 24, uu_dai: { den: 6, lai: 7.5 } })
  // → { co_so: diem (bậc thang), tha_noi: diem (bậc thang), moc: [tháng điều chỉnh], bang: [{ tu, den, co_so, lai }] }.
  // Lãi kỳ = lãi cơ sở tại ngày điều chỉnh + biên độ, giữ nguyên tới ngày điều chỉnh sau. Trong thời gian ưu đãi giữ lãi ưu đãi.
  K.laiSuatThaNoi = function (o) {
    o = o || {};
    const cs = (o.co_so || [[0, 5]]).slice().sort((a, b) => a[0] - b[0]);
    const tu = o.tu != null ? o.tu : cs[0][0], den = o.den != null ? o.den : 24, ky = o.ky_dieu_chinh || 3, bd = o.bien_do != null ? o.bien_do : 3.5;
    const coSo = (m) => { let v = cs[0][1]; for (const [x, y] of cs) if (x <= m + 1e-9) v = y; return v; };
    const batDau = o.uu_dai ? o.uu_dai.den : tu;
    const bang = [];
    if (o.uu_dai) bang.push({ tu, den: o.uu_dai.den, co_so: coSo(tu), lai: o.uu_dai.lai, uu_dai: true });
    for (let m = batDau; m < den - 1e-9; m += ky) bang.push({ tu: m, den: Math.min(den, m + ky), co_so: coSo(m), lai: +(coSo(m) + bd).toFixed(4) });
    const thaNoi = bang.map((b) => [b.tu, b.lai]).concat([[den, bang[bang.length - 1].lai]]);
    const coSoDiem = cs.filter(([x]) => x >= tu && x < den).map(([x, y]) => [x, y]);
    if (!coSoDiem.length || coSoDiem[0][0] > tu) coSoDiem.unshift([tu, coSo(tu)]);
    coSoDiem.push([den, coSo(den)]);
    return { co_so: coSoDiem, tha_noi: thaNoi, moc: bang.filter((b) => !b.uu_dai).map((b) => b.tu), bang };
  };

  K.bieu_do_duong_lai_suat = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', hat = opt.hat || 53;
    const W = opt.rong || 1400, H = opt.cao || 620;
    const ds = (opt.duong || []).map((d, i) => Object.assign({ khoa_mau: i === 0 ? 'nhan' : 'nhan_phu', day: 6, nhan_cuoi: 'ten_gia_tri' }, d));
    const tx = Object.assign({ ten: 'Tháng' }, opt.truc_x || {}), ty = Object.assign({ don_vi: '%', thap_phan: 1 }, opt.truc_y || {});
    const T = thoiGian(opt);
    const tatCa = ds.flatMap((d) => d.diem);
    if (tx.min == null) tx.min = Math.min(...tatCa.map((p) => p[0]));
    if (tx.max == null) tx.max = Math.max(...tatCa.map((p) => p[0]));
    if (tx.buoc == null) tx.buoc = buocDep(tx.max - tx.min, 8);
    if (ty.buoc == null) ty.buoc = buocDep(Math.max(...tatCa.map((p) => p[1])) - Math.min(...tatCa.map((p) => p[1])) || 1, 4);
    if (ty.min == null) ty.min = Math.floor(Math.min(...tatCa.map((p) => p[1])) / ty.buoc - 0.5) * ty.buoc;
    if (ty.max == null) ty.max = Math.ceil(Math.max(...tatCa.map((p) => p[1])) / ty.buoc + 0.3) * ty.buoc;
    const dinhX = tx.dinh_dang || ((v) => K.so(v));
    const dinhY = (v) => K.so(v, ty.thap_phan) + ty.don_vi;
    const mauDuong = (d) => m[d.khoa_mau] || m.nhan;

    const g = K.svg('g', { class: 'kho-bieu-do-duong' });
    const defs = K.svg('defs', null, g);

    // ----- bố cục -----
    let y = 0, tieuDe = null, chuThich = null;
    if (opt.tieu_de) { tieuDe = K.chu(g, opt.tieu_de, { x: 0, y: y + 32, co: 32, dam: 700, mau: m.chu }); y += 46; }
    if (opt.chu_thich) { chuThich = K.chu(g, opt.chu_thich, { x: 0, y: y + 26, co: 24, dam: 500, mau: m.chu_phu }); y += 38; }
    const yHangPhu = y + 30;
    const plotTop = y + 56, plotBot = H - 52;
    const coSo = 24;
    const nhanYGT = [];
    for (let v = ty.min; v <= ty.max + 1e-9; v += ty.buoc) nhanYGT.push(+v.toFixed(6));
    const plotLeft = Math.ceil(Math.max(...nhanYGT.map((v) => K.doChu(dinhY(v), coSo, 600))) + 22);
    // nhãn cuối đường: chữ, cỡ, lề phải
    const coCuoi = 26;
    const chuCuoi = ds.map((d) => {
      const v = d.diem[d.diem.length - 1][1], gt = K.so(v, opt.thap_phan_gia_tri != null ? opt.thap_phan_gia_tri : 1) + ty.don_vi;
      return d.nhan_cuoi === false ? null : d.nhan_cuoi === 'ten' ? [d.ten] : d.nhan_cuoi === 'gia_tri' ? [gt] : [d.ten, gt];
    });
    const rongCuoi = Math.max(0, ...chuCuoi.filter(Boolean).map((a) => Math.max(...a.map((s) => K.doChu(s, coCuoi, 700)))));
    const plotRight = W - (rongCuoi ? rongCuoi + 34 : 12);
    const sx = (v) => plotLeft + (v - tx.min) / (tx.max - tx.min) * (plotRight - plotLeft);
    const sy = (v) => plotBot - (v - ty.min) / (ty.max - ty.min) * (plotBot - plotTop);
    const P = (p) => [sx(p[0]), sy(p[1])];

    // ----- vùng tô dọc -----
    const tangVung = K.svg('g', null, g);
    const vung = (opt.vung || []).map((v, i) => {
      const x0 = sx(v.tu), x1 = sx(v.den), mau = m[v.khoa_mau || 'nhan_phu'] || m.nhan_phu;
      const nhom = K.svg('g', null, tangVung);
      if (!tay) K.svg('rect', { x: x0, y: plotTop, width: x1 - x0, height: plotBot - plotTop, fill: K.rgba(mau, 0.13) }, nhom);
      else {
        const id = idMoi('v');
        const pt = K.svg('pattern', { id, width: 12, height: 12, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-35)' }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 12, stroke: mau, 'stroke-width': 1.6, opacity: 0.4 }, pt);
        K.svg('rect', { x: x0, y: plotTop, width: x1 - x0, height: plotBot - plotTop, fill: `url(#${id})` }, nhom);
      }
      let nhan = null;
      if (v.nhan) {
        const co = K.coVua(v.nhan, x1 - x0 - 24, 26, 700, 22);
        nhan = K.chu(nhom, v.nhan, { x: (x0 + x1) / 2, y: plotTop + 34, co, dam: 700, mau: K.chuTren(K.tron(m.nen, mau, 0.13), '#FFFFFF', m.chu), neo: 'middle' });
      }
      return { nhom, vao: v.vao != null ? v.vao - (opt.vao > 0 ? opt.vao : 0) : 0.35 + i * 0.2 };
    });

    // ----- lưới, trục, nhãn -----
    const luoi = K.svg('g', null, g), chuTruc = [];
    nhanYGT.forEach((v, j) => {
      const yy = sy(v);
      if (j > 0) {
        if (!tay) K.svg('line', { x1: plotLeft, y1: yy, x2: plotRight, y2: yy, stroke: m.chu_phu, 'stroke-opacity': 0.22, 'stroke-width': 1.5 }, luoi);
        else K.svg('path', { d: K.duongTay(chiaNho([[plotLeft, yy], [plotRight, yy]], 120), { hat: hat + j, lech: 1 }), fill: 'none', stroke: m.chu_phu, 'stroke-opacity': 0.35, 'stroke-width': 1.4, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }, luoi);
      }
      chuTruc.push(K.chu(g, dinhY(v), { x: plotLeft - 14, y: yy + 8, co: coSo, dam: 600, mau: m.chu_phu, neo: 'end' }));
    });
    for (let v = tx.min; v <= tx.max + 1e-9; v += tx.buoc) {
      const xx = sx(v);
      K.svg('line', { x1: xx, y1: plotBot, x2: xx, y2: plotBot + 8, stroke: m.chu, 'stroke-width': 2 }, luoi);
      chuTruc.push(K.chu(g, dinhX(+v.toFixed(6)), { x: xx, y: plotBot + 36, co: coSo, dam: 600, mau: m.chu_phu, neo: 'middle' }));
    }
    const rongSo0 = K.doChu(dinhX(tx.min), coSo, 600) / 2;
    chuTruc.push(K.chu(g, tx.ten, { x: plotLeft - 12 - rongSo0, y: plotBot + 36, co: coSo, dam: 700, mau: m.chu, neo: 'end' }));
    if (ty.ten) chuTruc.push(K.chu(g, ty.ten, { x: 0, y: yHangPhu, co: 22, dam: 600, mau: m.chu_phu }));
    const truc = K.svg('path', {
      d: tay ? K.duongTay(chiaNho([[plotLeft, plotTop - 10], [plotLeft, plotBot], [plotRight, plotBot]], 90), { hat: hat + 30, lech: 1.3 }) : `M${plotLeft} ${plotTop - 10} L${plotLeft} ${plotBot} L${plotRight} ${plotBot}`,
      fill: 'none', stroke: m.chu, 'stroke-width': 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1,
    }, g);
    truc.style.strokeDasharray = '1 1';

    // ----- thời điểm từng đường -----
    const daiVe = opt.dai_ve || 2.4, nhip = opt.nhip != null ? opt.nhip : 0.35;
    const lechVao = opt.vao > 0 ? opt.vao : 0;
    const tg = ds.map((d, i) => ({ a: d.vao != null ? d.vao - lechVao : 0.5 + i * nhip, d: d.dai || daiVe }));
    // x dữ liệu đã vẽ tới ở giây s
    const xVe = (i, s) => K.lerp(tx.min, tx.max, K.eio(K.tienDo(s, tg[i].a, tg[i].d)));

    // ----- dải tô giữa hai đường -----
    const tangDai = K.svg('g', null, g);
    const dai = (opt.dai_to || []).map((b) => {
      const dd = ds[b.duoi], dt = ds[b.tren], mau = m[b.khoa_mau || dt.khoa_mau] || m.nhan;
      const B = [...dd.diem.map((p) => p[0]), ...dt.diem.map((p) => p[0])];
      const a = Math.max(dd.diem[0][0], dt.diem[0][0], b.tu != null ? b.tu : -Infinity), e = Math.min(dd.diem[dd.diem.length - 1][0], dt.diem[dt.diem.length - 1][0], b.den != null ? b.den : Infinity);
      const tren = dayDiem(dt, a, e, B).map(P), duoi = dayDiem(dd, a, e, B).map(P).reverse();
      const id = idMoi('k');
      const clip = K.svg('clipPath', { id }, defs);
      const cr = K.svg('rect', { x: plotLeft, y: plotTop - 20, width: 0, height: plotBot - plotTop + 40 }, clip);
      const nhom = K.svg('g', { 'clip-path': `url(#${id})` }, tangDai);
      if (!tay) K.svg('path', { d: dPhang(tren.concat(duoi)) + ' Z', fill: K.rgba(mau, 0.18) }, nhom);
      else {
        const idp = idMoi('p');
        const pt = K.svg('pattern', { id: idp, width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(40)' }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 9, stroke: mau, 'stroke-width': 2, opacity: 0.5 }, pt);
        K.svg('path', { d: dPhang(tren.concat(duoi)) + ' Z', fill: K.rgba(mau, 0.14) }, nhom);
        K.svg('path', { d: dPhang(tren.concat(duoi)) + ' Z', fill: `url(#${idp})` }, nhom);
      }
      let nhan = null, xn = 0;
      if (b.nhan) {
        xn = b.x_nhan != null ? b.x_nhan : (a + e) / 2;
        const yt = sy(giaTri(dt, xn)), yd = sy(giaTri(dd, xn)), co = K.cl((yd - yt) * 0.45, 22, 28);
        const rong = K.doChu(b.nhan, co, 700) + 24;
        nhan = K.svg('g', { 'data-hop': '' }, g);
        const bx = sx(xn) - rong / 2, by = (yt + yd) / 2 - co * 0.8, bh = co * 1.6;
        if (!tay) K.svg('rect', { x: bx, y: by, width: rong, height: bh, rx: bh / 2, fill: m.the, stroke: K.rgba(mau, 0.7), 'stroke-width': 1.5 }, nhan);
        else K.svg('path', { d: K.duongTay(chiaNho([[bx, by], [bx + rong, by], [bx + rong, by + bh], [bx, by + bh]], 60), { hat: hat + 3, lech: 1.2, dong: true }), fill: m.giay, stroke: m.chu, 'stroke-width': 2, 'stroke-linejoin': 'round' }, nhan);
        K.chu(nhan, b.nhan, { x: sx(xn), y: (yt + yd) / 2 + co * 0.36, co, dam: 700, mau: K.chuTren(m.the, '#FFFFFF', m.chu), neo: 'middle' });
      }
      return { cr, nhan, xn, i: b.tren };
    });

    // ----- các đường -----
    const tangDuong = K.svg('g', null, g);
    const duong = ds.map((d, i) => {
      const mau = mauDuong(d), pts = dayDiem(d, d.diem[0][0], d.diem[d.diem.length - 1][0]).map(P);
      const id = idMoi('d');
      const clip = K.svg('clipPath', { id }, defs);
      const cr = K.svg('rect', { x: plotLeft - 20, y: -2000, width: 0, height: 4000 }, clip);
      const nhom = K.svg('g', { 'clip-path': `url(#${id})` }, tangDuong);
      const dut = d.net_dut ? `${d.day * 2.2} ${d.day * 1.8}` : null;
      if (!tay) {
        K.svg('path', { d: dPhang(pts), fill: 'none', stroke: m.nen, 'stroke-width': d.day + 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', opacity: 0.85 }, nhom);
        K.svg('path', { d: dPhang(pts), fill: 'none', stroke: mau, 'stroke-width': d.day, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': dut }, nhom);
      } else {
        const nho = chiaNho(pts, 40);
        K.svg('path', { d: K.duongTay(nho, { hat: hat + 100 + i, lech: 1.3 }), fill: 'none', stroke: mau, 'stroke-width': d.day * 0.8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': dut }, nhom);
        K.svg('path', { d: K.duongTay(nho, { hat: hat + 140 + i, lech: 2.2 }), fill: 'none', stroke: mau, 'stroke-width': d.day * 0.35, opacity: 0.55, 'stroke-linecap': 'round', 'stroke-dasharray': dut }, nhom);
      }
      if (d.cham) d.diem.forEach((p, j) => {
        const [x, yy] = P(p);
        if (!tay) K.svg('circle', { cx: x, cy: yy, r: d.day + 2, fill: m.the, stroke: mau, 'stroke-width': 3 }, nhom);
        else K.svg('path', { d: K.duongTay([[x - 6, yy - 4], [x + 5, yy - 6], [x + 7, yy + 4], [x - 4, yy + 6]], { hat: hat + 200 + j, lech: 1, dong: true }), fill: mau, stroke: m.chu, 'stroke-width': 1.6 }, nhom);
      });
      // đầu bút đang vẽ
      const dau = K.svg('g', null, g);
      if (!tay) { K.svg('circle', { r: d.day + 5, fill: mau, stroke: m.the, 'stroke-width': 3 }, dau); }
      else { K.svg('circle', { r: d.day + 3, fill: mau, opacity: 0.85 }, dau); K.svg('circle', { r: d.day + 7, fill: 'none', stroke: m.chu, 'stroke-width': 1.6, opacity: 0.7 }, dau); }
      const vong = K.svg('circle', { r: d.day + 5, fill: 'none', stroke: mau, 'stroke-width': 2.5 }, dau);
      return { cr, dau, vong, mau };
    });

    // ----- mốc điều chỉnh -----
    const tangMoc = K.svg('g', null, g);
    const moc = (opt.moc_dieu_chinh || []).map((mc, j) => {
      const i = mc.duong || 0, d = ds[i], x = sx(mc.x), yy = sy(giaTri(d, mc.x)), mau = mauDuong(d);
      const nhom = K.svg('g', null, tangMoc);
      K.svg('line', { x1: x, y1: plotTop, x2: x, y2: plotBot, stroke: m.chu_phu, 'stroke-width': 1.6, 'stroke-dasharray': '4 6', opacity: 0.55 }, nhom);
      const kc = K.svg('g', { transform: `translate(${x} ${yy})` }, nhom);
      const thoi = K.svg('g', null, kc);
      if (!tay) K.svg('rect', { x: -9, y: -9, width: 18, height: 18, transform: 'rotate(45)', fill: m.the, stroke: mau, 'stroke-width': 3.5 }, thoi);
      else K.svg('path', { d: K.duongTay([[0, -12], [12, 0], [0, 12], [-12, 0]], { hat: hat + 300 + j, lech: 1, dong: true }), fill: m.giay, stroke: m.chu, 'stroke-width': 2.4 }, thoi);
      let nhan = null;
      if (mc.nhan) nhan = K.chu(nhom, mc.nhan, { x, y: plotBot - 14, co: 22, dam: 600, mau: m.chu_phu, neo: 'middle' });
      return { nhom, thoi, nhan, x: mc.x, i };
    });

    // ----- nhãn cuối đường (đẩy cách nhau khi gần) -----
    const nhanCuoi = [];
    const viTri = ds.map((d, i) => ({ i, y: sy(d.diem[d.diem.length - 1][1]) })).filter((v) => chuCuoi[v.i]).sort((a, b) => a.y - b.y);
    const caoNhan = (i) => chuCuoi[i].length * 30;
    for (let k = 1; k < viTri.length; k++) {
      const can = (caoNhan(viTri[k - 1].i) + caoNhan(viTri[k].i)) / 2 + 8;
      if (viTri[k].y - viTri[k - 1].y < can) viTri[k].y = viTri[k - 1].y + can;
    }
    viTri.forEach((v) => {
      const d = ds[v.i], dong = chuCuoi[v.i], mau = mauDuong(d);
      const mauChu = K.tuongPhan(mau, m.nen) >= 4.5 ? mau : m.chu;
      const nhom = K.svg('g', null, g);
      const y0 = v.y - (dong.length - 1) * 15;
      dong.forEach((s, j) => K.chu(nhom, s, { x: plotRight + 22, y: y0 + j * 30 + 9, co: j === dong.length - 1 && dong.length > 1 ? coCuoi : coCuoi - (dong.length > 1 ? 4 : 0), dam: j === dong.length - 1 ? 800 : 600, mau: j === dong.length - 1 ? mauChu : m.chu }));
      nhanCuoi[v.i] = nhom;
    });

    // ----- chú giải dòng đầu -----
    const muc = [];
    if (opt.chu_giai) ds.forEach((d) => muc.push({ loai: 'duong', d, chu: d.ten }));
    if (moc.length) muc.push({ loai: 'moc', chu: opt.nhan_moc || 'Kỳ điều chỉnh lãi suất' });
    let chuGiai = null;
    if (muc.length) {
      chuGiai = K.svg('g', null, g);
      const coCG = 26, rong = muc.map((u) => 46 + K.doChu(u.chu, coCG, 600));
      const tong = rong.reduce((a, b) => a + b, 0) + 28 * (muc.length - 1);
      const rongTieuDe = tieuDe ? K.doChu(opt.tieu_de, 32, 700) : 0;
      const yCG = tieuDe && rongTieuDe + 40 < W - tong ? 30 : yHangPhu;
      let x = W - tong;
      muc.forEach((u, k) => {
        if (u.loai === 'duong') {
          const mau = mauDuong(u.d);
          K.svg('line', { x1: x, y1: yCG - 9, x2: x + 34, y2: yCG - 9, stroke: mau, 'stroke-width': u.d.day, 'stroke-linecap': 'round', 'stroke-dasharray': u.d.net_dut ? `${u.d.day * 1.6} ${u.d.day * 1.4}` : null }, chuGiai);
        } else {
          K.svg('rect', { x: x + 9, y: yCG - 18, width: 16, height: 16, transform: `rotate(45 ${x + 17} ${yCG - 10})`, fill: m.the, stroke: mauDuong(ds[moc[0].i]), 'stroke-width': 3 }, chuGiai);
        }
        K.chu(chuGiai, u.chu, { x: x + 46, y: yCG, co: coCG, dam: 600, mau: m.chu });
        x += rong[k] + 28;
      });
    }

    const tCuoi = Math.max(...tg.map((v) => v.a + v.d));
    return {
      el: g,
      seek(t) {
        const s = T(t);
        truc.style.strokeDashoffset = (1 - K.eio(K.tienDo(s, 0, 0.45))).toFixed(4);
        const pChu = K.eo3(K.tienDo(s, 0.15, 0.4)).toFixed(3);
        luoi.style.opacity = pChu;
        chuTruc.forEach((e) => (e.style.opacity = pChu));
        if (tieuDe) tieuDe.style.opacity = K.eo3(K.tienDo(s, 0, 0.35)).toFixed(3);
        if (chuThich) chuThich.style.opacity = K.eo3(K.tienDo(s, 0.1, 0.35)).toFixed(3);
        if (chuGiai) chuGiai.style.opacity = K.eo3(K.tienDo(s, 0.3, 0.4)).toFixed(3);
        vung.forEach((v) => (v.nhom.style.opacity = K.eo3(K.tienDo(s, v.vao, 0.45)).toFixed(3)));
        duong.forEach((u, i) => {
          const xv = xVe(i, s), px = sx(xv);
          u.cr.setAttribute('width', Math.max(0, px - plotLeft + 20).toFixed(2));
          const xong = s >= tg[i].a + tg[i].d;
          u.dau.setAttribute('transform', `translate(${px.toFixed(2)} ${sy(giaTri(ds[i], xv)).toFixed(2)})`);
          // sau khi vẽ xong: đầu bút thu nhỏ thành chấm cuối, vòng sáng lan ra theo nhịp (hàm thuần của t)
          const sau = s - tg[i].a - tg[i].d;
          u.dau.style.opacity = s <= tg[i].a ? 0 : 1;
          const chu = xong ? ((sau % 2.2) + 2.2) % 2.2 / 2.2 : 0;
          u.vong.setAttribute('r', ((ds[i].day + 5) * (1 + 1.4 * chu)).toFixed(2));
          u.vong.style.opacity = xong ? (0.7 * (1 - chu)).toFixed(3) : 0;
          if (nhanCuoi[i]) {
            const p = K.eo3(K.tienDo(s, tg[i].a + tg[i].d - 0.1, 0.35));
            nhanCuoi[i].style.opacity = p.toFixed(3);
            nhanCuoi[i].setAttribute('transform', `translate(${((1 - p) * -10).toFixed(2)} 0)`);
          }
        });
        dai.forEach((b) => {
          const px = sx(xVe(b.i, s));
          b.cr.setAttribute('width', Math.max(0, px - plotLeft).toFixed(2));
          if (b.nhan) b.nhan.style.opacity = K.eo3(K.tienDo(s, tg[b.i].a + tg[b.i].d * K.cl((b.xn - tx.min) / (tx.max - tx.min) + 0.08), 0.35)).toFixed(3);
        });
        moc.forEach((u) => {
          // mốc hiện khi đầu bút đã vượt qua nó: tiến độ theo quãng x đã vượt (6 % chiều ngang trục), hàm thuần của t
          const xv = xVe(u.i, s);
          const p = s <= tg[u.i].a ? 0 : (xv >= tx.max - 1e-6 ? 1 : K.cl((xv - u.x) / ((tx.max - tx.min) * 0.06)));
          u.nhom.style.opacity = K.eo3(p).toFixed(3);
          u.thoi.setAttribute('transform', `scale(${(0.4 + 0.6 * K.eob(p)).toFixed(4)})`);
        });
      },
      moc: {
        goc_truc: [plotLeft, plotBot],
        diem: (x, yy) => [sx(x), sy(yy)],
        cuoi: ds.map((d) => P(d.diem[d.diem.length - 1])),
        vung_ve: { x: plotLeft, y: plotTop, w: plotRight - plotLeft, h: plotBot - plotTop },
        t_xong: tCuoi + (opt.vao > 0 ? opt.vao : 0),
      },
    };
  };
})();
