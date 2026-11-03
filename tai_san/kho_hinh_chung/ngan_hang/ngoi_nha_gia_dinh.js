// ngan_hang/ngoi_nha_gia_dinh.js — 1.1 — khuôn "một gia đình, nhiều nhu cầu": mặt cắt ngôi nhà mái dốc hai tầng (thấy sàn, tường cắt, cửa sổ, đồ đạc tối thiểu),
// các thành viên đứng trong nhà (đầu tròn, thân khối, không vẽ mặt, cùng dáng với nhan_vat.js), quanh nhà hai bên là các nhu cầu: vật nhỏ trong vòng tròn,
// chữ nhu cầu, đường nối nét đứt vẽ dần từ thành viên đi lên trên đầu người, ra cửa sổ ở tường cắt rồi tới vật, sau đó thẻ nghiệp vụ (KHO.the_nghiep_vu) hiện cạnh vật.
// Tô sáng một nhu cầu làm mờ các nhu cầu khác; khung "cả gia đình" cuối cảnh: vòng bao quanh nhà, các thẻ trượt về xếp thành một cột gọn bên phải.
// Dùng cho: N205 (nghiệp vụ cơ bản của cán bộ tín dụng cá nhân: một cặp vợ chồng chủ cửa hàng tạp hoá và các nhu cầu), N201, N198 (hộ gia đình vay mua nhà).
// Gọi: KHO.ngoi_nha_gia_dinh_nhu_cau({ kieu, tieu_de, dong_nho, thanh_vien, nhu_cau, to, gom, x, y, co, vao, moc_nguoi, tinh, mau, hat });  bí danh KHO.ngoi_nha_gia_dinh.
//   kieu 'phang' | 'net_tay' | 'toi_gian' (1.1); net: { day, mau } chỉ cho toi_gian; chu: false tắt mọi chữ (1.1); tieu_de: chữ lớn góc trên trái (46 px, trong dải y 0–130); dong_nho: dòng nhỏ trên tiêu đề có vạch nhấn (ví dụ 'Ví dụ giả định');
//   thanh_vien: [{ vai: 'bo' | 'me' | 'con_lon' | 'con_nho' | 'ong' | 'ba', ten (nhãn 28 px trên đầu, chỉ hiện khi truyền), tang: 1 | 2, moc (giây hiện, tuỳ chọn) }]
//     — người lớn cao khoảng 150, trẻ con 95–115, ông bà hơi còng có gậy hoặc búi tóc; tóc, áo khác nhau; mỗi tầng tối đa 4 người, xếp đều theo chiều ngang;
//   nhu_cau: tối đa 8 mục [{ chu, vat, cua (chỉ số thành viên), the (opt của KHO.the_nghiep_vu: chu, phu, bieu_tuong...), moc (giây bắt đầu vẽ đường),
//     moc_the (giây hiện thẻ, mặc định moc + 0,8), ben: 'trai' | 'phai' (mặc định theo vị trí thành viên, cân hai bên, tối đa 4 mỗi bên), khoa_mau (mặc định xoay vòng nhan, tot, canh_bao, nhan_phu) }];
//     vat: 'cua_hang' | 'nha' | 'o_to' | 'hoc' | 'kieu_hoi' | 'tiet_kiem' | 'bao_hiem' | 'the' | 'sua_nha' | 'chua_benh';
//   to: [{ nhu_cau (chỉ số), moc, het }] tô sáng (vòng sáng, thẻ nhấc lên, quầng dưới chân thành viên), các nhu cầu khác mờ còn 25%;
//   gom: { moc, nhan (chỉ hiện khi truyền, ví dụ 'Ngân hàng tính hiệu quả trên cả gia đình') } — nhu cầu mờ đi, vòng bao quanh nhà, thẻ trượt về một cột trong khung bên phải;
//   x, y: tâm hộp tường của nhà trên sân khấu (mặc định 960, 560); co: tỉ lệ (chữ không xuống dưới 28 px dù co nhỏ); vao: giây bắt đầu; tinh: true hiện đủ ngay.
// Kích thước ở co 1: tường rộng 560, mỗi tầng cao 270 (thông thuỷ 251), mái cao 140, mái đua 24; vật nhu cầu là vòng tròn bán kính 52 cách tường 100;
//   cột chữ và thẻ ở ngoài vòng (bên trái căn phải, bên phải căn trái). Bố cục tính bằng số; dải y 0–130 để tiêu đề, y 960–1080 để phụ đề.
// Trả về { el, seek(t), moc } — toạ độ sân khấu 1920×1080:
//   moc.nha { hop: {x,y,w,h}, mai: { dinh, trai, phai }, san: [y mặt sàn tầng 1, tầng 2], tran: [y trần tầng 1, tầng 2], tam };
//   moc.thanh_vien [{ chan, dau, tam, dinh, tang, cao }]; moc.nhu_cau [{ tam, r, ben, chu: {x,y,w,h}, the (moc của thẻ), duong: [[x,y]...] }];
//   moc.gom { hop: {x,y,w,h}, the: [{x,y,w,h}] } hoặc null; moc.xong (giây hiện xong, chưa tính tô sáng và gom).
// KHO.ngoi_nha_gia_dinh_nhu_cau.bo_cuc(opt) → cùng các toạ độ trên (nha, thanh_vien, nhu_cau, gom) mà không tạo phần tử, để N205 dựng bản 3D cùng vị trí.
// KHO.ngoi_nha_gia_dinh_nhu_cau.BO_CUC → bố cục mặc định (nhà ở 960, 560, chưa có thành viên, nhu cầu) và các hằng số kích thước.
// Phần tử el là HTML phủ cả sân khấu (hợp đồng mục 7): chữ HTML (nhãn thành viên, chữ nhu cầu, khung gom có data-hop), hình SVG. Không đo DOM để dàn trang.
// 1.1 (03/11/2026, bản "ít chữ"): mặc định không chữ nào — tiêu đề, dòng nhỏ, nhãn thành viên, chữ nhu cầu, thẻ, nhãn khung gom chỉ hiện khi truyền chữ vào
//   (1.0 gom có nhãn mặc định, nay bỏ). Mỗi nhãn nhận false để tắt (tieu_de, dong_nho, ten, chu, the, gom.nhan); cờ chung chu: false tắt mọi chữ (thẻ còn đĩa biểu tượng).
//   Chữ tự vẽ ≥ 28 px trên màn hình: nhãn thành viên 28 px (1.0: 20), dòng nhỏ 28 px (1.0: 22); thẻ gọi KHO.the_nghiep_vu với co ≥ 1,08 (chữ chính ≥ 28 px),
//   dòng phụ của thẻ bị bỏ khi dưới 28 px (cần the.co ≥ 1,4 để giữ). Kiểu mới kieu: 'toi_gian' — khối phẳng màu từ bộ màu, không bóng, không đồ đạc, không cửa sổ:
//   nhà là khối mặt cắt (mái, phòng, tường cắt, sàn), người là đầu tròn và thân bo, vật nhu cầu là khối đơn giản, thẻ kiểu 'vien'; nét theo net: { day (0), mau ('chu') }.
//   Toạ độ bo_cuc so với 1.0: nha và thanh_vien không đổi; nhu_cau (tam, chu, the, duong) đổi vì thẻ to hơn 8% và bỏ dòng phụ (chiều cao khối mỗi nhu cầu đổi),
//   duong còn đổi vài px khi có nhãn thành viên (nhãn 28 px rộng hơn); gom đổi theo cỡ thẻ.
// Dựng mới (03/11/2026, rà lô N196–N205). Không tên, logo ngân hàng; chữ là tham số.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;

  // ---------- hằng số hình học (co = 1, gốc ở tâm hộp tường) ----------
  const W = 560, TW = 16, HF = 270, MAI = 140, DUA = 24, R_VAT = 52, KHE = 100, CO_CHU = 28, LH_CHU = 36, RONG_CHU_NC = 340;
  const L = -W / 2, R = W / 2, T = -HF, DAY = HF;
  const SAN = [DAY - 12, -7], TRAN = [7, T + 12];       // mặt sàn và trần: [tầng 1, tầng 2]
  const VONG_MAU = ['nhan', 'tot', 'canh_bao', 'nhan_phu'];
  const VAI = {
    bo: { cao: 152, ao: 'nhan', toc: 'ngan' },
    me: { cao: 146, ao: 'xau', toc: 'dai', vay: true },
    con_lon: { cao: 116, ao: 'tot', toc: 'mai', tre: true, balo: true },
    con_nho: { cao: 94, ao: 'canh_bao', toc: 'buoc', tre: true, vay: true },
    ong: { cao: 140, ao: 'nhan_phu', toc: 'hoi', cong: 9, gay: true },
    ba: { cao: 136, ao: 'tim', toc: 'bui', cong: 7, vay: true },
  };

  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }

  // ---------- bộ vẽ hai kiểu (phẳng / nét tay) ----------
  function boVe(tay, m, hat0, defs, tg) {
    let hat = hat0;
    const vienTG = (net, day) => (tg ? [tg.day > 0 ? tg.mau : 'none', tg.day > 0 ? tg.day : 0] : [net || 'none', day]);
    const dsMau = {};
    const gach = (mau, mo, goc = 40, buoc = 9) => {
      const k = mau + mo + goc + buoc;
      if (!dsMau[k]) {
        const id = `kho-nn-g${++demId}`;
        const p = K.svg('pattern', { id, width: buoc, height: buoc, patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${goc})` }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: buoc, stroke: mau, 'stroke-width': 1.8, opacity: mo }, p);
        dsMau[k] = `url(#${id})`;
      }
      return dsMau[k];
    };
    const da = (cha, pts, o = {}) => {
      const net = o.net === undefined ? m.vien : o.net, day = o.day || 2.6, lech = o.lech != null ? o.lech : 1;
      if (!tay) {
        const d = 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L') + ' Z';
        const [sv, sw] = vienTG(net, day);
        return K.svg('path', { d, fill: o.to || 'none', stroke: sv, 'stroke-width': sw, 'stroke-linejoin': 'round' }, cha);
      }
      const nhom = K.svg('g', null, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.6 * lech, dong: true }), fill: o.to }, nhom);
      if (o.gach) K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.6 * lech, dong: true }), fill: gach(o.gach[0], o.gach[1]) }, nhom);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.1 * lech, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.85, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, nhom);
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.7 * lech, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.4, opacity: 0.45, 'stroke-linecap': 'round' }, nhom);
      }
      return nhom;
    };
    const cn = (cha, x, y, w, h, o = {}) => {
      if (!tay && o.bo) { const [sv, sw] = vienTG(o.net === undefined ? m.vien : o.net, o.day || 2.6); return K.svg('rect', { x, y, width: w, height: h, rx: o.bo, fill: o.to || 'none', stroke: sv, 'stroke-width': sw }, cha); }
      return da(cha, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], o);
    };
    const elip = (cha, cx, cy, rx, ry, o = {}) => {
      if (!tay) { const [sv, sw] = vienTG(o.net === undefined ? m.vien : o.net, o.day || 2.6); return K.svg('ellipse', { cx, cy, rx, ry, fill: o.to || 'none', stroke: sv, 'stroke-width': sw }, cha); }
      const n = Math.max(12, Math.round(Math.max(rx, ry) / 2.4)), pts = [];
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
      return da(cha, pts, Object.assign({ lech: 0.7 }, o));
    };
    const tron = (cha, cx, cy, r, o = {}) => elip(cha, cx, cy, r, r, o);
    const vach = (cha, pts, mau, day, o = {}) => {
      const d = tay ? K.duongTay(pts, { hat: hat++, lech: o.lech != null ? o.lech : 0.8 }) : 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
      return K.svg('path', { d, fill: 'none', stroke: mau, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: o.mo != null ? o.mo : null }, cha);
    };
    return { da, cn, elip, tron, vach, gach };
  }
  const cung = (cx, cy, r, a0, a1, n) => { const d = []; for (let i = 0; i <= n; i++) { const a = ((a0 + (a1 - a0) * i / n) * Math.PI) / 180; d.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } return d; };
  const hcnXoay = (cx, cy, w, h, goc) => { const a = (goc * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a); return [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]].map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]); };

  // ---------- bảng màu của khuôn ----------
  function bangMau(m, tay) {
    const giay = (c, p) => (tay ? K.tron(c, m.giay, m.toi ? 0.1 : p) : c);
    return {
      phong1: giay(K.tron(m.the, m.canh_bao, m.toi ? 0.08 : 0.07), 0.45),
      phong2: giay(K.tron(m.the, m.nhat, m.toi ? 0.35 : 0.4), 0.4),
      cat: tay ? K.tron(m.the, m.giay, m.toi ? 0.15 : 0.6) : K.tron(m.chu_phu, m.nen_phu, 0.25),
      mai: K.tron(m.xau, m.chu, m.toi ? 0.1 : 0.18),
      gac: giay(K.tron(m.the, m.nen_phu, 0.55), 0.35),
      kinh: K.tron(m.nhat, m.nhan, m.toi ? 0.3 : 0.22),
      go: K.tron(m.canh_bao, m.chu, m.toi ? 0.25 : 0.45),
      sang: m.toi ? K.tron(m.the, m.chu, 0.78) : m.the,
      vai: K.tron(m.nhan_phu, m.the, 0.25),
      cay: m.tot,
      da: m.da,
      tocToi: K.tron(m.toi ? m.nen : m.chu, m.da, 0.15),
      tocBac: K.tron(m.chu_phu, m.giay, 0.5),
      quan: m.toi ? K.tron(m.nhan_phu, m.nen, 0.3) : K.tron(m.chu_phu, m.chu, 0.45),
      giayDep: K.tron(m.vien, m.chu_phu, 0.25),
    };
  }

  // ---------- một người cỡ nhỏ, gốc ở giữa hai bàn chân ----------
  function veNguoi(cha, cfg, m, C, B) {
    const H = cfg.cao, tre = !!cfg.tre;
    const rH = tre ? H * 0.155 : H * 0.105, yH = -H + rH, yS = yH + rH + 4, yHip = yS + -yS * 0.44, wS = H * (tre ? 0.15 : 0.138);
    const ao = cfg.ao === 'tim' ? K.tron(m.nhan, m.xau, 0.5) : m[cfg.ao] || m.nhan;
    const toc = cfg.toc === 'hoi' || cfg.toc === 'bui' ? C.tocBac : C.tocToi;
    const g = K.svg('g', null, cha);
    K.svg('ellipse', { cx: 0, cy: 1, rx: wS * 1.5, ry: 4, fill: '#000', opacity: 0.12 }, g);
    const yK = yHip + -yHip * 0.5;
    if (cfg.vay) {
      B.cn(g, -wS * 0.62, yK - 4, wS * 0.42, -yK - 1, { to: C.quan, day: 2 });
      B.cn(g, wS * 0.2, yK - 4, wS * 0.42, -yK - 1, { to: C.quan, day: 2 });
    } else B.da(g, [[-wS * 0.86, yHip - 4], [wS * 0.86, yHip - 4], [wS * 0.8, -5], [2, -5], [0, yHip + -yHip * 0.22], [-2, -5], [-wS * 0.8, -5]], { to: C.quan, day: 2.2 });
    B.da(g, [[-wS * 0.86, -7], [-1, -7], [-1, 0], [-wS * 1.0, 0]], { to: C.giayDep, day: 2 });
    B.da(g, [[1, -7], [wS * 0.86, -7], [wS * 1.05, 0], [1, 0]], { to: C.giayDep, day: 2 });
    const tren = K.svg('g', { transform: cfg.cong ? `rotate(${cfg.cong} 0 ${yHip.toFixed(1)})` : null }, g);
    if (cfg.vay) B.da(tren, [[-wS * 0.86, yHip - 8], [wS * 0.86, yHip - 8], [wS * 1.15, yK], [-wS * 1.15, yK]], { to: K.tron(ao, m.vien, 0.18), day: 2.2 });
    if (cfg.balo) B.cn(tren, -wS - 7, yS + 5, 11, (yHip - yS) * 0.78, { to: m.nhan_phu, day: 2, bo: 3 });
    // tóc phía sau đầu
    if (cfg.toc === 'dai') B.da(tren, cung(0, yH, rH + 3, 160, 380, 12).concat([[rH * 1.08, yS + 18], [-rH * 1.08, yS + 18]]), { to: toc, day: 2 });
    if (cfg.toc === 'buoc') { B.tron(tren, -rH - 2, yH - rH * 0.3, rH * 0.42, { to: toc, day: 2 }); B.tron(tren, rH + 2, yH - rH * 0.3, rH * 0.42, { to: toc, day: 2 }); }
    if (cfg.toc === 'bui') B.tron(tren, -rH * 0.5, yH - rH * 1.02, rH * 0.46, { to: toc, day: 2 });
    // tay sau, thân, tay trước
    const tayAo = (huong) => {
      const pts = [[huong * (wS - 3), yS + 6], [huong * (wS + 5), (yS + yHip) / 2 + 2], [huong * (wS + 3), yHip + 4]];
      B.vach(tren, pts, m.vien, wS * 0.52 + 2.6, { lech: 0.4 });
      B.vach(tren, pts, ao, wS * 0.52, { lech: 0.4 });
      B.tron(tren, huong * (wS + 3), yHip + 6, wS * 0.24, { to: C.da, day: 1.8 });
    };
    tayAo(-1);
    B.cn(tren, -rH * 0.3, yS - 7, rH * 0.6, 9, { to: C.da, day: 1.8 });
    B.da(tren, [[-wS, yS + 6], [-wS + 5, yS], [wS - 5, yS], [wS, yS + 6], [wS * 0.88, yHip], [-wS * 0.88, yHip]], { to: ao, day: 2.4 });
    B.da(tren, [[-wS * 0.32, yS], [0, yS + 7], [wS * 0.32, yS]], { to: K.tron(ao, '#FFFFFF', 0.35), day: 1.6 });
    tayAo(1);
    // đầu, tóc trước
    B.tron(tren, 0, yH, rH, { to: C.da, day: 2.2 });
    const vien = (dd) => cung(0, yH, rH + 1.5, 178, 362, 14).concat(dd);
    if (cfg.toc === 'ngan' || cfg.toc === 'dai' || cfg.toc === 'buoc' || cfg.toc === 'bui')
      B.da(tren, vien([[rH * 1.0, yH + 0.02 * rH], [rH * 0.5, yH - 0.32 * rH], [0, yH - 0.4 * rH], [-rH * 0.5, yH - 0.32 * rH], [-rH * 1.0, yH + 0.02 * rH]]), { to: toc, day: 2 });
    else if (cfg.toc === 'mai') B.da(tren, vien([[rH, yH + 0.08 * rH], [rH * 0.35, yH - 0.18 * rH], [-rH * 0.15, yH - 0.02 * rH], [-rH * 0.65, yH - 0.34 * rH], [-rH, yH]]), { to: toc, day: 2 });
    else if (cfg.toc === 'hoi') {
      B.da(tren, [[-rH * 1.04, yH - 0.3 * rH], [-rH * 0.72, yH - 0.4 * rH], [-rH * 0.66, yH + 0.42 * rH], [-rH * 1.0, yH + 0.32 * rH]], { to: toc, day: 1.8 });
      B.da(tren, [[rH * 1.04, yH - 0.3 * rH], [rH * 0.72, yH - 0.4 * rH], [rH * 0.66, yH + 0.42 * rH], [rH * 1.0, yH + 0.32 * rH]], { to: toc, day: 1.8 });
    }
    // gậy của ông: từ bàn tay trước (sau khi còng) xuống đất
    const a = ((cfg.cong || 0) * Math.PI) / 180, xoay = (x, y) => [x * Math.cos(a) - (y - yHip) * Math.sin(a), x * Math.sin(a) + (y - yHip) * Math.cos(a) + yHip];
    if (cfg.gay) { const h = xoay(wS + 3, yHip + 6); B.vach(g, [[h[0], h[1] - 4], [h[0] + 7, 0]], C.go, 4.5, { lech: 0.3 }); B.vach(g, [[h[0] - 6, h[1] - 6], [h[0] + 2, h[1] - 8]], C.go, 4.5, { lech: 0.3 }); }
    const dau = xoay(0, yH), dinh = xoay(0, -H);
    return { g, dau, dinh, nguc: xoay(0, (yS + yHip) / 2), vai: yS + 6, wS, cao: H };
  }

  // ---------- vật nhu cầu trong vòng (±34 quanh gốc) ----------
  function veVat(cha, ten, mc, C, m, B) {
    const ve = {
      cua_hang() {
        B.cn(cha, -30, -8, 60, 38, { to: C.sang });
        B.cn(cha, -26, -32, 52, 13, { to: K.tron(mc, m.vien, 0.3), bo: 2 });
        for (let i = 0; i < 4; i++) B.da(cha, [[-34 + i * 17, -19], [-17 + i * 17, -19], [-17 + i * 17, -6], [-25.5 + i * 17, -2], [-34 + i * 17, -6]], { to: i % 2 ? C.sang : mc, day: 2 });
        B.cn(cha, -24, 4, 24, 14, { to: C.kinh, day: 2 });
        B.cn(cha, 8, 4, 16, 26, { to: C.go, day: 2 });
        B.tron(cha, -18, 22, 4, { to: m.xau, day: 1.6 }); B.tron(cha, -8, 22, 4, { to: m.tot, day: 1.6 });
      },
      nha() {
        B.cn(cha, 12, -26, 9, 16, { to: C.mai, day: 2 });
        B.cn(cha, -24, -6, 48, 34, { to: C.sang });
        B.da(cha, [[-33, -4], [0, -31], [33, -4]], { to: C.mai });
        B.cn(cha, -7, 10, 14, 18, { to: C.go, day: 2 });
        B.cn(cha, 11, 2, 9, 9, { to: C.kinh, day: 2 }); B.cn(cha, -20, 2, 9, 9, { to: C.kinh, day: 2 });
      },
      o_to() {
        B.da(cha, [[-34, 14], [-34, 1], [-24, -3], [-13, -17], [13, -17], [24, -3], [34, 1], [34, 14]], { to: mc });
        B.da(cha, [[-10, -13], [-2, -13], [-2, -4], [-18, -4]], { to: C.kinh, day: 2 });
        B.da(cha, [[2, -13], [10, -13], [18, -4], [2, -4]], { to: C.kinh, day: 2 });
        for (const x of [-18, 18]) { B.tron(cha, x, 15, 9, { to: K.tron(m.vien, m.chu_phu, 0.2) }); B.tron(cha, x, 15, 3.5, { to: C.sang, day: 1.4 }); }
      },
      hoc() {
        B.da(cha, [[-30, 12], [0, 18], [30, 12], [30, 28], [0, 34], [-30, 28]], { to: C.sang });
        B.vach(cha, [[0, 18], [0, 34]], m.vien, 2.2);
        B.da(cha, [[-17, -9], [17, -9], [15, 4], [-15, 4]], { to: K.tron(m.vien, mc, 0.15) });
        B.da(cha, [[-32, -15], [0, -28], [32, -15], [0, -2]], { to: K.tron(m.vien, mc, 0.25) });
        B.vach(cha, [[0, -15], [24, -12], [24, 2]], mc, 3);
        B.tron(cha, 24, 4, 3.5, { to: mc, day: 1.4 });
      },
      kieu_hoi() {
        B.cn(cha, -30, -2, 52, 32, { to: C.sang });
        B.vach(cha, [[-30, -2], [-4, 16], [22, -2]], m.vien, 2.4);
        B.da(cha, [[6, -32], [34, -22], [6, -10], [12, -21]], { to: mc, day: 2.2 });
        B.vach(cha, [[12, -21], [34, -22]], m.vien, 1.8);
        for (let i = 0; i < 3; i++) B.tron(cha, -24 + i * 9, -18 + i * 1.5, 1.8, { to: m.vien, net: null });
      },
      tiet_kiem() {
        B.cn(cha, -18, 16, 8, 12, { to: K.tron(mc, m.vien, 0.2), day: 2 }); B.cn(cha, 10, 16, 8, 12, { to: K.tron(mc, m.vien, 0.2), day: 2 });
        B.elip(cha, 0, 6, 29, 20, { to: mc });
        B.da(cha, [[-12, -10], [-6, -22], [2, -12]], { to: K.tron(mc, m.vien, 0.2), day: 2 });
        B.elip(cha, 28, 6, 6, 7, { to: K.tron(mc, C.sang, 0.4), day: 2 });
        B.vach(cha, [[-8, -9], [8, -9]], m.vien, 3);
        B.tron(cha, 0, -24, 8, { to: m.canh_bao, day: 2 });
      },
      bao_hiem() {
        B.da(cha, [[0, -32], [26, -22], [26, 2], [16, 20], [0, 30], [-16, 20], [-26, 2], [-26, -22]], { to: mc });
        B.vach(cha, [[-12, -1], [-3, 9], [13, -10]], K.chuTren(mc, '#FFFFFF', m.vien), 5);
      },
      the() {
        B.cn(cha, -32, -21, 64, 42, { to: mc, bo: 6 });
        B.cn(cha, -32, -11, 64, 9, { to: K.tron(m.vien, mc, 0.2), net: null });
        B.cn(cha, -24, 4, 14, 11, { to: m.canh_bao, day: 1.8, bo: 2 });
        B.vach(cha, [[2, 10], [24, 10]], K.chuTren(mc, '#FFFFFF', m.vien), 3);
      },
      sua_nha() {
        B.cn(cha, -30, -4, 40, 32, { to: C.sang });
        B.da(cha, [[-36, -2], [-10, -24], [16, -2]], { to: C.mai });
        B.cn(cha, -18, 10, 12, 18, { to: C.go, day: 2 });
        B.da(cha, hcnXoay(16, 6, 7, 44, 40), { to: C.go, day: 2 });
        B.da(cha, hcnXoay(27, -8, 26, 11, 40), { to: K.tron(m.vien, m.chu_phu, 0.2), day: 2 });
      },
      chua_benh() {
        B.cn(cha, -10, -24, 20, 12, { to: 'none', day: 3 });
        B.cn(cha, -30, -14, 60, 42, { to: C.sang, bo: 5 });
        B.cn(cha, -5, -6, 10, 26, { to: m.xau, day: 1.8 });
        B.cn(cha, -13, 2, 26, 10, { to: m.xau, day: 1.8 });
      },
    };
    (ve[ten] || ve.nha)();
  }

  // ---------- kiểu toi_gian: người đầu tròn, thân bo; cùng tỉ lệ, cùng điểm neo với veNguoi ----------
  function veNguoiTG(cha, cfg, m, C, B) {
    const H = cfg.cao, tre = !!cfg.tre;
    const rH = tre ? H * 0.155 : H * 0.105, yH = -H + rH, yS = yH + rH + 4, yHip = yS + -yS * 0.44, wS = H * (tre ? 0.15 : 0.138);
    const ao = cfg.ao === 'tim' ? K.tron(m.nhan, m.xau, 0.5) : m[cfg.ao] || m.nhan;
    const g = K.svg('g', null, cha);
    B.cn(g, -wS * 0.78, yHip - wS * 0.4, wS * 1.56, -yHip + wS * 0.4, { to: C.quan, bo: wS * 0.45 });
    const tren = K.svg('g', { transform: cfg.cong ? `rotate(${cfg.cong} 0 ${yHip.toFixed(1)})` : null }, g);
    B.cn(tren, -wS, yS, wS * 2, yHip - yS + wS * 0.3, { to: ao, bo: wS * 0.7 });
    B.tron(tren, 0, yH, rH, { to: C.da });
    const a = ((cfg.cong || 0) * Math.PI) / 180, xoay = (x, y) => [x * Math.cos(a) - (y - yHip) * Math.sin(a), x * Math.sin(a) + (y - yHip) * Math.cos(a) + yHip];
    return { g, dau: xoay(0, yH), dinh: xoay(0, -H), nguc: xoay(0, (yS + yHip) / 2), vai: yS + 6, wS, cao: H };
  }
  // vật nhu cầu dạng khối đơn giản (±34 quanh gốc), không chữ, không chi tiết trang trí
  function veVatTG(cha, ten, mc, C, m, B) {
    const toi = K.tron(m.chu, mc, 0.25);
    const ve = {
      cua_hang() { B.cn(cha, -28, -8, 56, 36, { to: C.sang }); B.cn(cha, -33, -22, 66, 15, { to: mc, bo: 3 }); B.cn(cha, 6, 6, 14, 22, { to: C.go }); },
      nha() { B.cn(cha, -24, -4, 48, 32, { to: C.sang }); B.da(cha, [[-33, -2], [0, -31], [33, -2]], { to: C.mai }); B.cn(cha, -7, 10, 14, 18, { to: C.go }); },
      o_to() { B.cn(cha, -34, -4, 68, 20, { to: mc, bo: 7 }); B.cn(cha, -18, -18, 36, 18, { to: mc, bo: 6 }); B.tron(cha, -18, 16, 8, { to: toi }); B.tron(cha, 18, 16, 8, { to: toi }); },
      hoc() { B.cn(cha, -27, 12, 54, 18, { to: C.sang, bo: 3 }); B.cn(cha, -16, -8, 32, 14, { to: toi }); B.da(cha, [[-32, -13], [0, -27], [32, -13], [0, 1]], { to: toi }); },
      kieu_hoi() { B.cn(cha, -30, -4, 52, 32, { to: C.sang }); B.da(cha, [[-30, -4], [-4, 14], [22, -4]], { to: K.tron(C.sang, mc, 0.35) }); B.da(cha, [[6, -32], [34, -22], [6, -10], [12, -21]], { to: mc }); },
      tiet_kiem() { [18, 6, -6, -18].forEach((y, i) => B.cn(cha, -22 + (i % 2) * 3, y, 44, 11, { to: i % 2 ? K.tron(m.canh_bao, C.sang, 0.3) : m.canh_bao, bo: 5.5 })); },
      bao_hiem() { B.da(cha, [[0, -32], [26, -22], [26, 2], [16, 20], [0, 30], [-16, 20], [-26, 2], [-26, -22]], { to: mc }); },
      the() { B.cn(cha, -32, -20, 64, 40, { to: mc, bo: 6 }); B.cn(cha, -32, -10, 64, 9, { to: toi }); },
      sua_nha() { B.cn(cha, -30, -2, 40, 30, { to: C.sang }); B.da(cha, [[-36, 0], [-10, -24], [16, 0]], { to: C.mai }); B.da(cha, hcnXoay(18, 6, 8, 46, 40), { to: C.go }); B.da(cha, hcnXoay(28, -8, 26, 12, 40), { to: toi }); },
      chua_benh() { B.cn(cha, -30, -16, 60, 42, { to: C.sang, bo: 6 }); B.cn(cha, -5, -9, 10, 28, { to: m.xau }); B.cn(cha, -14, 0, 28, 10, { to: m.xau }); },
    };
    (ve[ten] || ve.nha)();
  }

  // ---------- hình học đường nối ----------
  function lamTron(pts, r) {
    const out = [pts[0]];
    for (let i = 1; i < pts.length - 1; i++) {
      const a = pts[i - 1], p = pts[i], b = pts[i + 1];
      const d1 = Math.hypot(p[0] - a[0], p[1] - a[1]), d2 = Math.hypot(b[0] - p[0], b[1] - p[1]);
      const rr = Math.min(r, d1 / 2, d2 / 2);
      if (rr < 0.5) { out.push(p); continue; }
      const p1 = [p[0] - ((p[0] - a[0]) / d1) * rr, p[1] - ((p[1] - a[1]) / d1) * rr], p2 = [p[0] + ((b[0] - p[0]) / d2) * rr, p[1] + ((b[1] - p[1]) / d2) * rr];
      for (let k = 0; k <= 4; k++) { const u = k / 4, v = 1 - u; out.push([v * v * p1[0] + 2 * v * u * p[0] + u * u * p2[0], v * v * p1[1] + 2 * v * u * p[1] + u * u * p2[1]]); }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  function lamDay(pts, buoc) {
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / buoc));
      for (let k = 1; k <= n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
    }
    return out;
  }
  const bezier = (p0, p1, p2, p3, n) => { const d = []; for (let i = 1; i <= n; i++) { const u = i / n, v = 1 - u; d.push([v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0], v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1]]); } return d; };
  function catDuong(pts, cum, len) {
    if (len >= cum[cum.length - 1]) return pts.slice();
    const out = [pts[0]];
    for (let i = 1; i < pts.length; i++) {
      if (cum[i] <= len) { out.push(pts[i]); continue; }
      const u = (len - cum[i - 1]) / Math.max(1e-6, cum[i] - cum[i - 1]);
      out.push([pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * u, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * u]);
      break;
    }
    return out;
  }

  // ---------- bố cục tính bằng số ----------
  function tinhBoCuc(opt) {
    opt = opt || {};
    const co = opt.co || 1, X = opt.x != null ? opt.x : 960, Y = opt.y != null ? opt.y : 560;
    const P = (lx, ly) => [+(X + lx * co).toFixed(1), +(Y + ly * co).toFixed(1)];
    const kieuThe = opt.kieu === 'net_tay' ? 'net_tay' : opt.kieu === 'toi_gian' ? 'vien' : 'phang';
    const khongChu = opt.chu === false;
    const coNC = Math.max(28 / co, CO_CHU), lhNC = (coNC * LH_CHU) / CO_CHU, coNhan = Math.max(28, 28 * co);

    // thành viên
    const tv = (opt.thanh_vien || []).map((v, i) => Object.assign({}, v, { i, cfg: VAI[v.vai] || VAI.bo, tang: v.tang === 2 ? 2 : 1 }));
    [1, 2].forEach((f) => {
      const ds = tv.filter((v) => v.tang === f), n = ds.length, Wi = W - 2 * TW;
      ds.forEach((v, k) => { v.lx = L + TW + (Wi * (k + 1)) / (n + 1); v.ly = SAN[f - 1]; v.khoang = Wi / (n + 1); });
    });
    tv.forEach((v) => {
      v.wNhan = v.ten && !khongChu ? (Math.ceil(K.doChu(v.ten, coNhan, 700)) + 26) / co : 0;
      const H = v.cfg.cao, tre = !!v.cfg.tre, rH = tre ? H * 0.155 : H * 0.105, yHip = -H + 2 * rH + 4 + (H - 2 * rH - 4) * 0.44;
      const a = ((v.cfg.cong || 0) * Math.PI) / 180, xoay = (x, y) => [x * Math.cos(a) - (y - yHip) * Math.sin(a), x * Math.sin(a) + (y - yHip) * Math.cos(a) + yHip];
      v.dauL = xoay(0, -H + rH); v.dinhL = xoay(0, -H); v.wS = H * (tre ? 0.15 : 0.138); v.ngucL = xoay(0, -H * 0.55);
    });

    // nhu cầu, thẻ
    const nc = (opt.nhu_cau || []).slice(0, 8).map((n, i) => Object.assign({}, n, { i, mk: n.khoa_mau || VONG_MAU[i % VONG_MAU.length], v: tv[n.cua] || tv[0] || null }));
    const theOpt = (n) => {
      const o = Object.assign({ kieu: kieuThe, khoa_mau: n.mk, rong_chu: 280, mau: opt.mau }, n.the || {});
      o.co = Math.max(o.co || co * 1.08, 1.08);           // chữ chính của thẻ 26 × co ≥ 28 px
      if (o.phu && 20 * o.co < 27.5) delete o.phu;       // dòng phụ dưới 28 px thì bỏ
      if (khongChu) { o.chu = ''; delete o.phu; }
      return o;
    };
    const wThe = Math.max(0, ...nc.map((n) => (n.the ? K.the_nghiep_vu.do(theOpt(n)).w : 0)));
    nc.forEach((n) => {
      n.kt = n.the ? K.the_nghiep_vu.do(Object.assign(theOpt(n), { rong_deu: wThe })) : { w: 0, h: 0 };
      n.kt.w = Math.max(n.kt.w, wThe);
      n.dongChu = khongChu || !n.chu ? [] : K.xuongDong(n.chu, RONG_CHU_NC, coNC, 700);
      n.wChu = Math.max(0, ...n.dongChu.map((s) => K.doChu(s, coNC, 700)));
      n.wCot = Math.max(n.kt.w / co, n.wChu);
      n.hb = Math.max(n.dongChu.length * lhNC + (n.the ? (n.dongChu.length ? 10 : 0) + n.kt.h / co : 0), 2 * R_VAT);
    });
    // chia bên: theo ben, rồi theo vị trí thành viên, cân hai bên
    const tran = Math.min(4, Math.max(1, Math.ceil(nc.length / 2)));
    const dem = { trai: 0, phai: 0 };
    nc.filter((n) => n.ben === 'trai' || n.ben === 'phai').forEach((n) => { if (dem[n.ben] >= 4) n.ben = n.ben === 'trai' ? 'phai' : 'trai'; dem[n.ben]++; });
    nc.filter((n) => n.ben !== 'trai' && n.ben !== 'phai').forEach((n) => {
      let b = n.v && n.v.lx > 1 ? 'phai' : n.v && n.v.lx < -1 ? 'trai' : (n.i % 2 ? 'phai' : 'trai');
      if (dem[b] >= tran || dem[b] >= 4) b = b === 'trai' ? 'phai' : 'trai';
      n.ben = b; dem[b]++;
    });

    // đường trong nhà: chân đường bên cạnh vai, đi lên làn trên đầu, ra cửa sổ tường cắt
    const demTV = {};
    nc.forEach((n) => {
      const v = n.v, dir = n.ben === 'trai' ? -1 : 1;
      if (!v) { n.trong = null; return; }
      const k = `${v.i}_${n.ben}`, j = (demTV[k] = (demTV[k] || 0) + 1) - 1;
      const xDung = v.lx + dir * Math.min(Math.max(v.wNhan / 2 + 10, v.wS + 16) + j * 10, v.khoang / 2 - 6 + j * 6);
      n.trong = { dir, j, xs: v.lx + v.ngucL[0] + dir * (v.wS + 11), ys: v.ly + v.ngucL[1] + j * 10, xDung, tang: v.tang };
      n.diDai = dir < 0 ? xDung - L : R - xDung;
    });
    [1, 2].forEach((f) => {
      const ds = nc.filter((n) => n.trong && n.trong.tang === f).sort((a, b) => a.diDai - b.diDai || a.i - b.i);
      const nL = ds.length, gap = nL > 1 ? Math.min(11, 33 / (nL - 1)) : 0;
      ds.forEach((n, k) => { n.trong.lan = TRAN[f - 1] + 14 + (nL - 1) * gap - k * gap; });
    });
    nc.forEach((n) => { n.yRa = n.trong ? n.trong.lan : 0; });

    // xếp chỗ mỗi bên theo thứ tự độ cao lối ra (đỡ chéo đường)
    const lo = Math.max(-380, (140 - Y) / co), hi = Math.min(380, (950 - Y) / co);
    ['trai', 'phai'].forEach((ben) => {
      const ds = nc.filter((n) => n.ben === ben).sort((a, b) => a.yRa - b.yRa || a.i - b.i);
      if (!ds.length) return;
      const tong = ds.reduce((s, n) => s + n.hb, 0), k = ds.length;
      const gap = k > 1 ? K.cl((hi - lo - tong) / (k - 1), 24, 70) : 0, cao = tong + gap * (k - 1);
      let y = K.cl(-cao / 2, lo, Math.max(lo, hi - cao));
      const dir = ben === 'trai' ? -1 : 1, xc = dir * (W / 2 + KHE + R_VAT);
      ds.forEach((n) => {
        n.yTren = y; n.xc = xc; n.yc = y + n.hb / 2;
        const cotGan = xc + dir * (R_VAT + 20);   // mép cột phía nhà
        n.cot = dir < 0 ? { x0: cotGan - n.wCot, x1: cotGan } : { x0: cotGan, x1: cotGan + n.wCot };
        y += n.hb + gap;
      });
    });

    // đường đầy đủ (toạ độ cục bộ) và toạ độ sân khấu
    nc.forEach((n) => {
      const dir = n.ben === 'trai' ? -1 : 1, xTuong = dir < 0 ? L : R, mep = [n.xc - dir * R_VAT, n.yc];
      let pts;
      if (n.trong) {
        const tr = n.trong;
        const goc = lamTron([[tr.xs, tr.ys], [tr.xDung, tr.ys], [tr.xDung, tr.lan], [xTuong, tr.lan]], 10);
        const ngoai = bezier([xTuong, tr.lan], [xTuong + dir * 50, tr.lan], [mep[0] - dir * 40, mep[1]], mep, 24);
        pts = goc.concat(ngoai);
      } else pts = [[xTuong, 0]].concat(bezier([xTuong, 0], [xTuong + dir * 50, 0], [mep[0] - dir * 40, mep[1]], mep, 24));
      n.duong = pts;
      const hThe = n.kt.h, wT = n.kt.w;
      const yThe = Y + (n.yc - (n.dongChu.length * lhNC + (n.dongChu.length ? 10 : 0) + hThe / co) / 2 + n.dongChu.length * lhNC + (n.dongChu.length ? 10 : 0)) * co;
      const xThe = dir < 0 ? X + n.cot.x1 * co - wT : X + n.cot.x0 * co;
      n.oThe = n.the ? { x: +xThe.toFixed(1), y: +yThe.toFixed(1), w: wT, h: hThe, tam: [+(xThe + wT / 2).toFixed(1), +(yThe + hThe / 2).toFixed(1)] } : null;
      const xChu = dir < 0 ? X + (n.cot.x1 - n.wChu) * co : X + n.cot.x0 * co;
      n.oChu = n.dongChu.length ? { x: +xChu.toFixed(1), y: +(Y + (n.yc - (n.dongChu.length * lhNC + (n.the ? 10 + hThe / co : 0)) / 2) * co).toFixed(1), w: +(n.wChu * co).toFixed(1), h: +(n.dongChu.length * lhNC * co).toFixed(1) } : null;
    });

    // khung gom: cột thẻ bên phải
    let gom = null;
    if (opt.gom) {
      const ds = nc.filter((n) => n.the), nhan = !khongChu && opt.gom.nhan ? opt.gom.nhan : '';
      const sum = ds.reduce((s, n) => s + n.kt.h, 0), khoang = 12;
      const dongN = K.xuongDong(nhan, Math.max(300, wThe) , 28, 800);
      const hDau = dongN.length * 36;
      const hDau2 = hDau ? hDau + 16 : 0, toiDa = 950 - 150 - 48 - hDau2;
      const sc = Math.max(0.999, Math.min(1, toiDa / Math.max(1, sum + khoang * (ds.length - 1))));   // không thu thẻ dưới 28 px
      const pw = Math.ceil(Math.max(wThe * sc, Math.max(...dongN.map((s) => K.doChu(s, 28, 800)))) + 48);
      const ph = Math.ceil(24 + hDau2 + (sum + khoang * Math.max(0, ds.length - 1)) * sc + 24);
      const px = 1860 - pw, py = K.cl(Y - ph / 2, 150, 950 - ph);
      let yy = py + 24 + hDau2;
      const vt = {};
      ds.forEach((n) => { vt[n.i] = { x: px + 24, y: +yy.toFixed(1), w: +(n.kt.w * sc).toFixed(1), h: +(n.kt.h * sc).toFixed(1), sc }; yy += (n.kt.h + khoang) * sc; });
      gom = { hop: { x: px, y: +py.toFixed(1), w: pw, h: ph }, nhan, dongN, sc, vt };
    }

    return {
      co, X, Y, P, tv, nc, wThe, theOpt, gom, khongChu, coNC, lhNC, coNhan,
      xuat: {
        nha: {
          hop: { x: +(X + L * co).toFixed(1), y: +(Y + T * co).toFixed(1), w: W * co, h: 2 * HF * co },
          mai: { dinh: P(0, T - MAI), trai: P(L - DUA, T), phai: P(R + DUA, T) },
          san: SAN.map((s) => +(Y + s * co).toFixed(1)), tran: TRAN.map((s) => +(Y + s * co).toFixed(1)), tam: [X, Y],
        },
        thanh_vien: tv.map((v) => ({ chan: P(v.lx, v.ly), dau: P(v.lx + v.dauL[0], v.ly + v.dauL[1]), dinh: P(v.lx + v.dinhL[0], v.ly + v.dinhL[1]), tam: P(v.lx + v.ngucL[0], v.ly + v.ngucL[1]), tang: v.tang, cao: +(v.cfg.cao * co).toFixed(1) })),
        nhu_cau: nc.map((n) => ({ tam: P(n.xc, n.yc), r: R_VAT * co, ben: n.ben, chu: n.oChu, the: n.oThe, duong: n.duong.filter((_, k) => k % 3 === 0 || k === n.duong.length - 1).map((p) => P(p[0], p[1])) })),
        gom: gom ? { hop: gom.hop, the: nc.filter((n) => gom.vt[n.i]).map((n) => { const o = gom.vt[n.i]; return { x: o.x, y: o.y, w: o.w, h: o.h }; }) } : null,
      },
    };
  }

  K.ngoi_nha_gia_dinh_nhu_cau = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = ['net_tay', 'toi_gian'].includes(opt.kieu) ? opt.kieu : 'phang', tay = kieu === 'net_tay', tg = kieu === 'toi_gian';
    const netTG = tg ? { day: (opt.net && opt.net.day) || 0, mau: m[(opt.net && opt.net.mau) || 'chu'] || m.chu } : null;
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const bc = tinhBoCuc(opt), co = bc.co, X = bc.X, Y = bc.Y, C = bangMau(m, tay);
    const nenThe = tay ? K.tron(m.the, m.giay, m.toi ? 0.12 : 0.5) : m.the;
    const mauChuNen = duTuongPhan(m.chu, m.nen, 7), mauPhuNen = duTuongPhan(m.chu_phu, m.nen, 4.6);

    const el = K.html('div', { class: 'kho-ngoi-nha-gia-dinh', style: `position:absolute;left:0;top:0;width:1920px;height:1080px;font-family:${K.PHONG};pointer-events:none;` });
    const svg = K.svg('svg', { width: 1920, height: 1080, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);
    const defs = K.svg('defs', null, svg);
    const goc = K.svg('g', { transform: `translate(${X} ${Y}) scale(${co})` }, svg);
    const B = boVe(tay, m, opt.hat || 211, defs, netTG);
    const gNha = K.svg('g', null, goc), gNen = K.svg('g', null, gNha), gDo = K.svg('g', null, gNha), gCat = K.svg('g', null, gNha);
    const gDuong = K.svg('g', null, goc), gNguoi = K.svg('g', null, goc), gVat = K.svg('g', null, goc), gGom = K.svg('g', null, goc);
    const lop = K.html('div', { style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, el);

    // ----- nhà: mái, gác, phòng, đồ đạc, tường cắt -----
    if (tg) {
      B.da(gNen, [[L - DUA, T + 3], [0, T - MAI], [R + DUA, T + 3]], { to: C.mai });
      B.cn(gNen, L, T, W, HF, { to: C.phong2 }); B.cn(gNen, L, 0, W, HF, { to: C.phong1 });
      [[L, T, TW, 2 * HF], [R - TW, T, TW, 2 * HF], [L, T, W, 12], [L, -7, W, 14], [L - 14, DAY - 12, W + 28, 14]].forEach((r) => B.cn(gCat, r[0], r[1], r[2], r[3], { to: C.cat }));
    } else {
    const xOng = 150, yOngDuoi = T - MAI * (1 - xOng / (W / 2 + DUA)) + 12;
    B.cn(gNen, xOng, T - MAI + 18, 32, yOngDuoi - (T - MAI + 18), { to: C.mai });
    B.da(gNen, [[L - DUA, T + 3], [0, T - MAI], [R + DUA, T + 3]], { to: C.mai, day: 3 });
    B.da(gNen, [[L + 30, T], [0, T - MAI + 34], [R - 30, T]], { to: C.gac, day: 2.4 });
    B.tron(gNen, 0, T - 40, 16, { to: C.kinh, day: 2.4 });
    B.vach(gNen, [[-16, T - 40], [16, T - 40]], m.vien, 1.8, { mo: 0.7 }); B.vach(gNen, [[0, T - 56], [0, T - 24]], m.vien, 1.8, { mo: 0.7 });
    B.cn(gNen, L, T, W, HF, { to: C.phong2, net: null });
    B.cn(gNen, L, 0, W, HF, { to: C.phong1, net: null });
    // tầng 1: cửa ra vào, cửa sổ, bàn, chậu cây
    const s1 = SAN[0], s2 = SAN[1];
    const cuaSo = (x, y, w, h) => { B.cn(gDo, x, y, w, h, { to: C.kinh, day: 2.4 }); B.vach(gDo, [[x + w / 2, y], [x + w / 2, y + h]], m.vien, 2, { mo: 0.75 }); B.vach(gDo, [[x, y + h / 2], [x + w, y + h / 2]], m.vien, 2, { mo: 0.75 }); B.cn(gDo, x - 6, y + h, w + 12, 6, { to: C.cat, day: 1.8 }); };
    B.cn(gDo, 152, s1 - 162, 72, 162, { to: C.go });
    B.cn(gDo, 162, s1 - 150, 52, 60, { to: K.tron(C.go, '#FFFFFF', 0.15), day: 1.8 });
    B.tron(gDo, 212, s1 - 78, 4.5, { to: m.canh_bao, day: 1.6 });
    cuaSo(-236, s1 - 186, 96, 84);
    B.cn(gDo, -66, s1 - 68, 132, 11, { to: C.go, bo: 3 });
    B.cn(gDo, -56, s1 - 57, 9, 57, { to: C.go, day: 2 }); B.cn(gDo, 47, s1 - 57, 9, 57, { to: C.go, day: 2 });
    B.cn(gDo, -10, s1 - 90, 20, 22, { to: K.tron(m.nhan_phu, m.the, 0.3), day: 2 });
    B.tron(gDo, 0, s1 - 100, 13, { to: C.cay, day: 2 });
    // tầng 2: giường, bàn học, đèn, cửa sổ giữa
    cuaSo(-48, s2 - 192, 96, 84);
    B.cn(gDo, -258, s2 - 86, 13, 86, { to: C.go, day: 2.2 });
    B.cn(gDo, -250, s2 - 40, 150, 24, { to: C.go });
    B.cn(gDo, -246, s2 - 54, 144, 16, { to: C.sang, day: 2 });
    B.cn(gDo, -240, s2 - 66, 36, 14, { to: C.sang, day: 2, bo: 5 });
    B.cn(gDo, -196, s2 - 58, 96, 20, { to: C.vai, day: 2, bo: 4 });
    B.cn(gDo, -250, s2 - 16, 8, 16, { to: C.go, day: 1.8 }); B.cn(gDo, -110, s2 - 16, 8, 16, { to: C.go, day: 1.8 });
    B.cn(gDo, 116, s2 - 76, 134, 10, { to: C.go, bo: 2 });
    B.cn(gDo, 124, s2 - 66, 8, 66, { to: C.go, day: 2 }); B.cn(gDo, 234, s2 - 66, 8, 66, { to: C.go, day: 2 });
    B.cn(gDo, 130, s2 - 98, 9, 22, { to: m.nhan, day: 1.6 }); B.cn(gDo, 141, s2 - 94, 9, 18, { to: m.tot, day: 1.6 }); B.cn(gDo, 152, s2 - 100, 9, 24, { to: m.canh_bao, day: 1.6 });
    B.vach(gDo, [[226, s2 - 76], [218, s2 - 108]], m.vien, 3);
    B.da(gDo, [[206, s2 - 108], [230, s2 - 108], [224, s2 - 124], [212, s2 - 124]], { to: m.canh_bao, day: 2 });
    // tường cắt, sàn (gạch chéo khi nét tay), cửa sổ ở tường cắt cho đường nối đi ra
    const cat = (x, y, w, h) => B.cn(gCat, x, y, w, h, tay ? { to: C.cat, gach: [m.chu, 0.3], day: 2.4 } : { to: C.cat, day: 2.4 });
    cat(L, T, TW, 2 * HF); cat(R - TW, T, TW, 2 * HF);
    cat(L, T, W, 12); cat(L, -7, W, 14); cat(L - 14, DAY - 12, W + 28, 14);
    [0, 1].forEach((f) => [L, R - TW].forEach((x) => {
      const y = TRAN[f] + 4, h = 58;
      B.cn(gCat, x - 1, y, TW + 2, h, { to: C.kinh, day: 2 });
      B.vach(gCat, [[x + TW / 2, y + 2], [x + TW / 2, y + h - 2]], m.vien, 1.6, { mo: 0.7 });
    }));
    K.svg('ellipse', { cx: 0, cy: DAY + 6, rx: W / 2 + 70, ry: 9, fill: '#000', opacity: 0.1 }, gNha);
    gNha.insertBefore(gNha.lastChild, gNha.firstChild);
    }

    // ----- thành viên -----
    const tv = bc.tv.map((v, k) => {
      const g = K.svg('g', null, gNguoi);
      const quang = K.svg('ellipse', { cx: 0, cy: 2, rx: v.wS * 2.2, ry: 7, fill: m.nhan, opacity: 0 }, g);
      const ve = (tg ? veNguoiTG : veNguoi)(g, v.cfg, m, C, boVe(tay, m, (opt.hat || 211) + 40 + k * 37, defs, netTG));
      let nhanEl = null;
      if (v.ten && !bc.khongChu) {
        const nen = tay ? K.tron(m.the, m.giay, m.toi ? 0.12 : 0.5) : m.the;
        const xT = X + (v.lx + v.dinhL[0]) * co, yT = Y + (v.ly + v.dinhL[1] - 5) * co, cN = bc.coNhan, hN = cN + 10;
        nhanEl = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${(xT - (v.wNhan * co) / 2).toFixed(1)}px;top:${(yT - hN).toFixed(1)}px;width:${(v.wNhan * co).toFixed(1)}px;height:${hN}px;` +
          `box-sizing:border-box;border-radius:${hN / 2}px;background:${nen};border:2px ${tay ? 'dashed' : 'solid'} ${tg ? 'transparent' : K.rgba(m.chu, 0.35)};text-align:center;` +
          `font-weight:700;font-size:${cN}px;line-height:${cN + 6}px;color:${duTuongPhan(m.chu, nen, 7)};white-space:nowrap;` }, lop, v.ten);
      }
      const t0 = tinh ? -100 : (v.moc != null ? v.moc : vao + 0.55 + k * 0.18);
      return { v, g, quang, ve, nhanEl, t0 };
    });

    // ----- nhu cầu: đường, vật, chữ, thẻ -----
    const nc = bc.nc.map((n, k) => {
      const mc = m[n.mk] || m.nhan;
      const t0 = tinh ? -100 : (n.moc != null ? n.moc : vao + 1.8 + k * 1.1);
      const tThe = tinh ? -100 : (n.moc_the != null ? n.moc_the : t0 + 0.8);
      // đường nối
      const gD = K.svg('g', null, gDuong);
      const pts = tay ? lamDay(n.duong, 26) : lamDay(n.duong, 8);
      const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const duong = K.svg('path', { fill: 'none', stroke: mc, 'stroke-width': 3.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': tay ? '11 8' : '9 7' }, gD);
      const cham0 = K.svg('circle', { cx: n.duong[0][0], cy: n.duong[0][1], r: 5, fill: mc, stroke: tg ? 'none' : m.vien, 'stroke-width': 1.6 }, gD);
      const chamCuoi = K.svg('circle', { cx: n.duong[n.duong.length - 1][0], cy: n.duong[n.duong.length - 1][1], r: 5, fill: mc, stroke: tg ? 'none' : m.vien, 'stroke-width': 1.6 }, gD);
      // vật trong vòng
      const gV = K.svg('g', null, gVat);
      const gV2 = K.svg('g', null, gV);
      const vongSang = K.svg('circle', { cx: 0, cy: 0, r: R_VAT + 11, fill: 'none', stroke: mc, 'stroke-width': 5, opacity: 0 }, gV2);
      const nenVong = tg ? K.tron(m.nen_phu, mc, 0.28) : tay ? K.tron(K.tron(m.the, m.giay, m.toi ? 0.1 : 0.45), mc, m.toi ? 0.2 : 0.14) : K.tron(m.the, mc, m.toi ? 0.22 : 0.14);
      B.tron(gV2, 0, 0, R_VAT, { to: nenVong, net: mc, day: 3.4 });
      (tg ? veVatTG : veVat)(K.svg('g', null, gV2), n.vat, mc, C, m, B);
      // chữ nhu cầu
      const dir = n.ben === 'trai' ? -1 : 1;
      const oc = n.oChu || { x: 0, y: 0 };
      const chuEl = K.html('div', { style: `position:absolute;left:${oc.x}px;top:${oc.y}px;width:${(n.wChu * co + 2).toFixed(1)}px;text-align:${dir < 0 ? 'right' : 'left'};` +
        `font-weight:700;font-size:${(bc.coNC * co).toFixed(1)}px;line-height:${(bc.lhNC * co).toFixed(1)}px;color:${mauChuNen};` }, lop);
      n.dongChu.forEach((s) => K.html('div', { style: 'white-space:nowrap;' }, chuEl, s));
      // thẻ nghiệp vụ (bọc một lớp để trượt về cột gom)
      let the = null, boc = null;
      if (n.the) {
        boc = K.html('div', { style: `position:absolute;left:0;top:0;width:0;height:0;transform-origin:${n.oThe.x}px ${n.oThe.y}px;` }, null);
        const toDau = (opt.to || []).find((o) => o.nhu_cau === n.i);
        the = K.the_nghiep_vu(Object.assign(bc.theOpt(n), {
          x: n.oThe.x, y: n.oThe.y, neo: 'trai_tren', rong_deu: bc.wThe, vao: tThe, tinh,
          moc_to: toDau ? toDau.moc : null, het_to: toDau ? (toDau.het != null ? toDau.het : (opt.gom ? opt.gom.moc : null)) : null,
          hat: (opt.hat || 211) + 300 + k * 13,
        }));
        boc.appendChild(the.el);
      }
      return { n, mc, t0, tThe, gD, pts, cum, duong, cham0, chamCuoi, gV, gV2, vongSang, chuEl, the, boc, dir };
    });

    // ----- khung gom -----
    let gomEl = null, vongNha = null, muiTen = null, dauMT = null;
    const gom = bc.gom, tGom = opt.gom ? (opt.gom.moc != null ? opt.gom.moc : vao + 1.8 + nc.length * 1.1 + 2) : null;
    if (gom) {
      gomEl = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${gom.hop.x}px;top:${gom.hop.y}px;width:${gom.hop.w}px;height:${gom.hop.h}px;box-sizing:border-box;border-radius:22px;` +
        `padding:22px 24px;background:${nenThe};border:3px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.nhan, 0.75)};${tg ? '' : `box-shadow:0 14px 34px ${K.rgba('#000000', m.toi ? 0.4 : 0.12)};`}` }, lop);
      gom.dongN.forEach((s) => K.html('div', { style: `font-weight:800;font-size:28px;line-height:36px;color:${duTuongPhan(m.chu, nenThe, 7)};white-space:nowrap;` }, gomEl, s));
      const x0 = L - 40, y0 = T - MAI - 12, x1 = R + 40, y1 = DAY + 24, r = 40;
      const vp = [[(x0 + x1) / 2, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0], [(x0 + x1) / 2, y0]];
      vongNha = K.svg('path', { d: tay ? K.duongTay(lamDay(lamTron(vp, r), 40), { hat: 977, lech: 1.6 }) : 'M' + lamTron(vp, r).map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'), fill: 'none', stroke: m.nhan, 'stroke-width': 4.5, 'stroke-linecap': 'round' }, gGom);
      const xa = x1 + 8, xb = (gom.hop.x - X) / co - 16, ym = 0;
      muiTen = K.svg('path', { d: `M${xa} ${ym} L${xb - 14} ${ym}`, fill: 'none', stroke: m.nhan, 'stroke-width': 5, 'stroke-linecap': 'round' }, gGom);
      dauMT = K.svg('path', { d: `M${xb} ${ym} L${xb - 20} ${ym - 12} L${xb - 20} ${ym + 12} Z`, fill: m.nhan }, gGom);
    }
    // thẻ đặt sau khung gom để nằm trên khung
    nc.forEach((o) => { if (o.boc) lop.appendChild(o.boc); });

    // ----- tiêu đề -----
    let dauEl = null, vachEl = null, tdEl = null;
    const dn = !bc.khongChu && opt.dong_nho, td = !bc.khongChu && opt.tieu_de;
    if (dn || td) {
      dauEl = K.html('div', { style: 'position:absolute;left:80px;top:30px;width:1100px;' }, lop);
      if (dn) {
        const hang = K.html('div', { style: 'display:flex;align-items:center;gap:14px;height:36px;white-space:nowrap;' }, dauEl);
        vachEl = K.html('div', { style: `width:44px;height:5px;border-radius:3px;background:${m.nhan};flex:none;` }, hang);
        K.html('div', { style: `font-weight:600;font-size:28px;letter-spacing:0.03em;color:${mauPhuNen};` }, hang, dn);
      }
      if (td) tdEl = K.html('div', { style: `margin-top:${dn ? 2 : 24}px;font-weight:800;font-size:46px;line-height:56px;letter-spacing:-0.01em;color:${mauChuNen};white-space:nowrap;` }, dauEl, td);
    }

    const xong = tinh ? 0 : Math.max(vao + 0.9, ...tv.map((o) => o.t0 + 0.6), ...nc.map((o) => (o.the ? o.tThe + 0.6 : o.t0 + 1)));
    const nhuCauTo = opt.to || [];
    const baoTo = (o, t) => K.eo3(K.tienDo(t, o.moc, 0.35)) * (o.het != null ? 1 - K.eo3(K.tienDo(t, o.het, 0.35)) : 1);

    function seek(t) {
      // nhà
      const pn = tinh ? 1 : K.tienDo(t, vao, 0.55);
      gNha.setAttribute('opacity', K.eo3(pn / 0.6).toFixed(3));
      gNha.setAttribute('transform', `translate(0 ${((1 - K.eob(pn)) * 26).toFixed(2)})`);
      gDo.setAttribute('opacity', (tinh ? 1 : K.eo3(K.tienDo(t, vao + 0.3, 0.4))).toFixed(3));
      if (dauEl) {
        const a = tinh ? 1 : K.eo3(K.tienDo(t, vao, 0.4));
        dauEl.style.opacity = a.toFixed(3);
        dauEl.style.transform = `translate(0px, ${((1 - a) * 12).toFixed(2)}px)`;
        if (vachEl) vachEl.style.width = Math.round(8 + 36 * (tinh ? 1 : K.eio(K.tienDo(t, vao, 0.6)))) + 'px';
      }
      // mức tô sáng, mờ
      const tap = nc.map((o) => Math.max(0, ...nhuCauTo.filter((x) => x.nhu_cau === o.n.i).map((x) => baoTo(x, t))));
      const mo = nc.map((o, k) => Math.max(0, ...nhuCauTo.filter((x) => x.nhu_cau !== o.n.i).map((x) => baoTo(x, t))) * (1 - tap[k]));
      const pg = tGom != null ? K.eo3(K.tienDo(t, tGom, 0.5)) : 0;
      // thành viên
      tv.forEach((o) => {
        const s = t - o.t0, pv = tinh ? 1 : K.spr(s, 0.5, 0.6);
        o.g.setAttribute('transform', `translate(${o.v.lx.toFixed(1)} ${o.v.ly.toFixed(1)}) scale(${(0.86 + 0.14 * pv).toFixed(4)} ${(0.8 + 0.2 * pv).toFixed(4)})`);
        o.g.setAttribute('opacity', (tinh ? 1 : K.cl(s / 0.15)).toFixed(3));
        let q = 0, mq = m.nhan;
        nc.forEach((c, k) => { if (c.n.v === o.v && tap[k] > q) { q = tap[k]; mq = c.mc; } });
        o.quang.setAttribute('opacity', (0.55 * q * (1 - pg)).toFixed(3)); o.quang.setAttribute('fill', mq);
        if (o.nhanEl) o.nhanEl.style.opacity = (tinh ? 1 : K.eo3(K.tienDo(s, 0.25, 0.35))).toFixed(3);
      });
      // nhu cầu
      nc.forEach((o, k) => {
        const giu = (1 - 0.75 * mo[k]) * (1 - 0.88 * pg);
        const p = tinh ? 1 : K.eio(K.tienDo(t, o.t0, 0.6));
        const phan = catDuong(o.pts, o.cum, p * o.cum[o.cum.length - 1]);
        o.duong.setAttribute('d', p <= 0.001 ? 'M0 0' : tay ? K.duongTay(phan, { hat: 600 + k * 17, lech: 1.3 }) : 'M' + phan.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join(' L'));
        o.duong.setAttribute('stroke-width', (3.2 + 1.8 * tap[k]).toFixed(2));
        o.duong.style.strokeDashoffset = (-(Math.max(0, t - o.t0 - 0.6)) * 10 * tap[k]).toFixed(1);
        o.cham0.setAttribute('opacity', p > 0.001 ? 1 : 0); o.chamCuoi.setAttribute('opacity', p > 0.98 ? 1 : 0);
        o.gD.setAttribute('opacity', giu.toFixed(3));
        const sv = t - o.t0 - 0.42, pv = tinh ? 1 : K.spr(sv, 0.45, 0.6);
        const sc = (0.4 + 0.6 * pv) * (1 + 0.09 * tap[k]);
        o.gV.setAttribute('transform', `translate(${o.n.xc.toFixed(1)} ${o.n.yc.toFixed(1)})`);
        o.gV2.setAttribute('transform', `scale(${sc.toFixed(4)})`);
        o.gV.setAttribute('opacity', ((tinh ? 1 : K.cl(sv / 0.12)) * giu).toFixed(3));
        o.vongSang.setAttribute('opacity', (tap[k] * (1 - pg)).toFixed(3));
        const pc = tinh ? 1 : K.eo3(K.tienDo(t, o.t0 + 0.6, 0.35));
        o.chuEl.style.opacity = (pc * giu).toFixed(3);
        o.chuEl.style.transform = `translate(${((1 - pc) * 14 * o.dir).toFixed(2)}px, 0px)`;
        if (o.the) {
          o.the.seek(t);
          let tr = 'none', doMo = 1 - 0.75 * mo[k];
          if (gom && gom.vt[o.n.i]) {
            const vt = gom.vt[o.n.i], idx = Object.keys(gom.vt).indexOf(String(o.n.i));
            const pk = K.eio(K.tienDo(t, tGom + 0.25 + idx * 0.08, 0.7));
            doMo = K.lerp(doMo, 1, pg);
            if (pk > 0) tr = `translate(${((vt.x - o.n.oThe.x) * pk).toFixed(2)}px, ${((vt.y - o.n.oThe.y) * pk).toFixed(2)}px) scale(${K.lerp(1, vt.sc, pk).toFixed(4)})`;
          }
          o.boc.style.transform = tr;
          o.boc.style.opacity = doMo.toFixed(3);
        }
      });
      // khung gom
      if (gom) {
        const a = K.eo3(K.tienDo(t, tGom, 0.4));
        gomEl.style.opacity = a.toFixed(3);
        gomEl.style.transform = `translate(${((1 - a) * 30).toFixed(2)}px, 0px)`;
        const pv = K.eio(K.tienDo(t, tGom + 0.2, 0.8));
        vongNha.setAttribute('opacity', pv > 0.001 ? 1 : 0); K.veDan(vongNha, pv);
        const pm = K.eio(K.tienDo(t, tGom + 0.6, 0.4));
        muiTen.setAttribute('opacity', pm > 0.001 ? 1 : 0); K.veDan(muiTen, pm);
        dauMT.setAttribute('opacity', pm > 0.95 ? 1 : 0);
      }
    }

    const mocNC = bc.xuat.nhu_cau.map((x, k) => Object.assign({}, x, { the: nc[k].the ? nc[k].the.moc : null }));
    return { el, seek, moc: Object.assign({}, bc.xuat, { nhu_cau: mocNC, xong, gom_luc: tGom }) };
  };

  K.ngoi_nha_gia_dinh_nhu_cau.bo_cuc = function (opt) { return tinhBoCuc(opt || {}).xuat; };
  Object.defineProperty(K.ngoi_nha_gia_dinh_nhu_cau, 'BO_CUC', {
    get() { return Object.assign(tinhBoCuc({}).xuat, { hang_so: { rong_tuong: W, day_tuong: TW, cao_tang: HF, cao_mai: MAI, mai_dua: DUA, ban_kinh_vat: R_VAT, cach_tuong: KHE } }); },
  });
  K.ngoi_nha_gia_dinh = K.ngoi_nha_gia_dinh_nhu_cau;
})();
