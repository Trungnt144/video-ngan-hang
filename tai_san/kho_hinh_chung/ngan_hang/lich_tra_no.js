// ngan_hang/lich_tra_no.js — 1.0 — biểu đồ cột chồng gốc và lãi theo từng kỳ trả nợ: gốc cuối kỳ, gốc đều (lãi giảm dần), niên kim (tổng đều), ân hạn gốc N kỳ đầu.
// Gọi: KHO.bieu_do_cot_lich_tra_no(opt) → { el (<g> SVG), seek(t), moc, lich }. Hàm tính dùng riêng: KHO.tinhLichTraNo(opt) → mảng kỳ.
// Kích thước chuẩn: khung rong × cao (mặc định 1300 × 620 đơn vị), gốc toạ độ ở góc trên trái khung; trang video tự đặt transform.
// Tham số:
//   kieu 'phang' | 'net_tay'; mau (ghi đè bảng màu); khoa_goc (mặc định 'nhan'), khoa_lai (mặc định 'canh_bao');
//   so_ky (số kỳ, mặc định 12); so_tien (số tiền vay, đồng); lai_nam (lãi suất năm, 0,12 hoặc 12 đều hiểu là 12 %); ky_thang (số tháng mỗi kỳ, mặc định 1);
//   kieu_tra 'goc_cuoi_ky' | 'goc_deu' | 'nien_kim'; an_han (số kỳ đầu chỉ trả lãi, mặc định 0); lich (mảng kỳ tự tính sẵn, nếu có thì bỏ qua các tham số tính);
//   rong, cao; tieu_de (chữ đậm dòng đầu, tuỳ chọn); chu_thich (dòng phụ, ví dụ "Vay 120 triệu, 12 tháng, 12 %/năm (ví dụ giả định)");
//   nhan_goc 'Gốc', nhan_lai 'Lãi'; nhan_truc_x 'Kỳ'; don_vi (chia số tiền, mặc định 1e6) và ten_don_vi ('triệu đồng');
//   to_an_han (mặc định true khi an_han > 0) và nhan_an_han (mặc định "Ân hạn gốc N kỳ");
//   hien_ky (số thứ tự kỳ 1..so_ky để hiện thẻ số liệu kỳ đó, tuỳ chọn), vao_hien_ky (giây hiện thẻ, mặc định sau cột cuối);
//   vao (giây bắt đầu, -1 hiện đủ), tinh (true hiện đủ), nhip (giây giữa hai cột, mặc định 0,14), moc_hien (mảng giây mọc từng cột, ghi đè nhip), hat (hạt giống nét tay).
// Điểm neo (moc): goc_truc [x,y] gốc hai trục; dinh_cot [[x,y],...] đỉnh từng cột; chu_giai [x,y]; an_han {x,y,w,h} hoặc null; the [x,y] (thẻ số liệu, nếu có).
// Dựng mới 29/10/2026 cho lô 2 (N79 trả gốc trả lãi, N80 ân hạn, N105 lãi suất thả nổi).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // ---------- hàm nội bộ (đề xuất gom vào kho_nen.js) ----------
  let demId = 0;
  const idMoi = (goc) => `kho-ltn-${goc}-${++demId}`;
  const thoiGian = (opt) => (opt.tinh || (opt.vao != null && opt.vao < 0)) ? () => 1e6 : (t) => t - (opt.vao || 0);
  // Bước chia trục "đẹp": 1, 2, 2,5, 5 × 10^k sao cho có khoảng muonCo vạch.
  const buocDep = (max, muonCo = 5) => {
    const tho = max / muonCo, mu = Math.pow(10, Math.floor(Math.log10(tho)));
    for (const h of [1, 2, 2.5, 5, 10]) if (h * mu >= tho) return h * mu;
    return 10 * mu;
  };
  const soLe = (buoc) => (Math.abs(buoc - Math.round(buoc)) < 1e-9 ? 0 : (Math.abs(buoc * 10 - Math.round(buoc * 10)) < 1e-9 ? 1 : 2));
  // Hình chữ nhật nét tay (đa giác kín bốn góc, mỗi cạnh chia đôi cho nét run đều).
  const chuNhatTay = (x, y, w, h, hat, lech) => K.duongTay([[x, y + h], [x, y + h / 2], [x, y], [x + w / 2, y], [x + w, y], [x + w, y + h / 2], [x + w, y + h], [x + w / 2, y + h]], { hat, lech, dong: true });

  // ---------- tính lịch trả nợ ----------
  // KHO.tinhLichTraNo({ so_ky, so_tien, lai_nam, kieu_tra, an_han, ky_thang }) → [{ ky, du_no_dau, goc, lai, tong, du_no_cuoi, an_han }]
  // Lãi kỳ = dư nợ đầu kỳ × lãi suất năm × số tháng mỗi kỳ / 12. Kỳ cuối dồn phần lẻ để tổng gốc đúng bằng số tiền vay.
  K.tinhLichTraNo = function (o) {
    o = o || {};
    const n = Math.max(1, Math.round(o.so_ky || 12)), P = o.so_tien != null ? o.so_tien : 120e6;
    let r = o.lai_nam != null ? o.lai_nam : 0.12;
    if (r > 1) r = r / 100;
    const i = r * (o.ky_thang || 1) / 12, kieu = o.kieu_tra || 'goc_deu';
    const N = Math.max(0, Math.min(n - 1, Math.round(o.an_han || 0)));
    const conLai = n - N;
    const nienKim = i > 0 ? P * i / (1 - Math.pow(1 + i, -conLai)) : P / conLai;
    const ra = [];
    let du = P;
    for (let k = 1; k <= n; k++) {
      const lai = du * i;
      let goc = 0;
      if (k > N) {
        if (kieu === 'goc_cuoi_ky') goc = k === n ? du : 0;
        else if (kieu === 'nien_kim') goc = k === n ? du : nienKim - lai;
        else goc = k === n ? du : P / conLai;
      }
      ra.push({ ky: k, du_no_dau: du, goc, lai, tong: goc + lai, du_no_cuoi: du - goc, an_han: k <= N });
      du -= goc;
    }
    return ra;
  };

  K.bieu_do_cot_lich_tra_no = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', hat = opt.hat || 31;
    const lich = opt.lich || K.tinhLichTraNo(opt);
    const n = lich.length, N = lich.filter((k) => k.an_han).length;
    const W = opt.rong || 1300, H = opt.cao || 620;
    const DV = opt.don_vi || 1e6, tenDV = opt.ten_don_vi || 'triệu đồng';
    const mauGoc = m[opt.khoa_goc || 'nhan'] || m.nhan, mauLai = m[opt.khoa_lai || 'canh_bao'] || m.canh_bao;
    const nhanGoc = opt.nhan_goc || 'Gốc', nhanLai = opt.nhan_lai || 'Lãi';
    const T = thoiGian(opt);

    const g = K.svg('g', { class: 'kho-lich-tra-no' });
    const defs = K.svg('defs', null, g);

    // ----- bố cục dọc -----
    let y = 0;
    let tieuDe = null, chuThich = null;
    if (opt.tieu_de) { tieuDe = K.chu(g, opt.tieu_de, { x: 0, y: y + 32, co: 32, dam: 700, mau: m.chu }); y += 46; }
    if (opt.chu_thich) { chuThich = K.chu(g, opt.chu_thich, { x: 0, y: y + 26, co: 24, dam: 500, mau: m.chu_phu }); y += 38; }
    const yDonVi = y + 30;
    const plotTop = y + 54, plotBot = H - 52;
    const coSoY = 24, coSoX = 24;

    // ----- trục y -----
    const maxTong = Math.max(...lich.map((k) => k.tong)) / DV;
    const buoc = buocDep(maxTong * 1.04, 4), le = soLe(buoc);
    const yMax = Math.ceil((maxTong * 1.04) / buoc) * buoc;
    // độ rộng nhãn trục y để đặt lề trái
    const nhanY = [];
    for (let v = 0; v <= yMax + 1e-9; v += buoc) nhanY.push(v);
    const rongNhanY = Math.max(...nhanY.map((v) => K.doChu(K.so(v, le), coSoY, 600)));
    const plotLeft = Math.ceil(rongNhanY + 22), plotRight = W - 8;
    const sy = (v) => plotBot - (v / yMax) * (plotBot - plotTop);
    const buocX = (plotRight - plotLeft) / n, rongCot = Math.min(buocX * 0.64, 90);
    const cx = (k) => plotLeft + buocX * (k + 0.5);

    // ----- vùng ân hạn (dưới cột) -----
    const coAnHan = N > 0 && opt.to_an_han !== false;
    let vungAH = null, nhanAH = null, hopAH = null;
    if (coAnHan) {
      const x0 = plotLeft + 2, x1 = plotLeft + buocX * N, ya = plotTop - 6;
      hopAH = { x: x0, y: ya, w: x1 - x0, h: plotBot - ya };
      vungAH = K.svg('g', null, g);
      if (!tay) {
        K.svg('rect', { x: x0, y: ya, width: x1 - x0, height: plotBot - ya, rx: 8, fill: K.rgba(m.nhan_phu, 0.12), stroke: K.rgba(m.nhan_phu, 0.55), 'stroke-width': 2, 'stroke-dasharray': '10 7' }, vungAH);
      } else {
        const id = idMoi('ah');
        const pt = K.svg('pattern', { id, width: 12, height: 12, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(-35)' }, defs);
        K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 12, stroke: m.nhan_phu, 'stroke-width': 1.6, opacity: 0.35 }, pt);
        K.svg('path', { d: chuNhatTay(x0, ya, x1 - x0, plotBot - ya, hat + 2, 1.2), fill: `url(#${id})` }, vungAH);
        K.svg('path', { d: chuNhatTay(x0, ya, x1 - x0, plotBot - ya, hat + 3, 1.8), fill: 'none', stroke: m.nhan_phu, 'stroke-width': 2.2, 'stroke-dasharray': '9 7', 'stroke-linecap': 'round' }, vungAH);
      }
      const chuAH = opt.nhan_an_han || `Ân hạn gốc ${N} kỳ`;
      const coAH = K.coVua(chuAH, x1 - x0 - 30, 26, 700, 22);
      nhanAH = K.chu(g, chuAH, { x: (x0 + x1) / 2, y: ya + 34, co: coAH, dam: 700, mau: K.chuTren(K.tron(m.nen, m.nhan_phu, 0.12), '#FFFFFF', m.chu), neo: 'middle' });
    }

    // ----- lưới, trục -----
    const luoi = K.svg('g', null, g);
    const nhanTrucY = [];
    nhanY.forEach((v, j) => {
      const yy = sy(v);
      if (j > 0) {
        if (!tay) K.svg('line', { x1: plotLeft, y1: yy, x2: plotRight, y2: yy, stroke: m.chu_phu, 'stroke-opacity': 0.22, 'stroke-width': 1.5 }, luoi);
        else K.svg('path', { d: K.duongTay([[plotLeft, yy], [(plotLeft + plotRight) / 2, yy], [plotRight, yy]], { hat: hat + 10 + j, lech: 1 }), fill: 'none', stroke: m.chu_phu, 'stroke-opacity': 0.35, 'stroke-width': 1.4, 'stroke-dasharray': '3 7', 'stroke-linecap': 'round' }, luoi);
      }
      nhanTrucY.push(K.chu(g, K.so(v, le), { x: plotLeft - 14, y: yy + 8, co: coSoY, dam: 600, mau: m.chu_phu, neo: 'end' }));
    });
    const nhanDonVi = K.chu(g, tenDV, { x: 0, y: yDonVi, co: 22, dam: 600, mau: m.chu_phu });
    const truc = K.svg('path', {
      d: tay ? K.duongTay([[plotLeft, plotTop - 10], [plotLeft, (plotTop + plotBot) / 2], [plotLeft, plotBot], [(plotLeft + plotRight) / 2, plotBot], [plotRight, plotBot]], { hat: hat + 5, lech: 1.3 })
        : `M${plotLeft} ${plotTop - 10} L${plotLeft} ${plotBot} L${plotRight} ${plotBot}`,
      fill: 'none', stroke: m.chu, 'stroke-width': tay ? 2.6 : 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1,
    }, g);
    truc.style.strokeDasharray = '1 1';
    // nhãn kỳ: thưa bớt khi nhiều kỳ
    const thua = n <= 16 ? 1 : n <= 30 ? 2 : n <= 60 ? 6 : 12;
    const nhanX = [];
    lich.forEach((k, j) => {
      if ((j + 1) % thua !== 0 && j !== 0) return;
      nhanX.push(K.chu(g, String(k.ky), { x: cx(j), y: plotBot + 34, co: coSoX, dam: 600, mau: m.chu_phu, neo: 'middle' }));
    });
    const tenTrucX = K.chu(g, opt.nhan_truc_x || 'Kỳ', { x: plotLeft - 14, y: plotBot + 34, co: coSoX, dam: 700, mau: m.chu, neo: 'end' });

    // ----- chú giải -----
    const chuGiai = K.svg('g', null, g);
    const coCG = 28, rGoc = K.doChu(nhanGoc, coCG, 600), rLai = K.doChu(nhanLai, coCG, 600);
    const xCG = W - (28 + 10 + rGoc + 34 + 28 + 10 + rLai) - 4, yCG = tieuDe ? 32 : (chuThich ? 26 : yDonVi);
    const oCG = (x, mau, chu, h2) => {
      if (!tay) K.svg('rect', { x, y: yCG - 22, width: 28, height: 28, rx: 6, fill: mau }, chuGiai);
      else {
        K.svg('path', { d: chuNhatTay(x, yCG - 22, 28, 28, h2, 1.2), fill: K.rgba(mau, 0.55) }, chuGiai);
        K.svg('path', { d: chuNhatTay(x, yCG - 22, 28, 28, h2 + 1, 1.4), fill: 'none', stroke: m.chu, 'stroke-width': 2, 'stroke-linecap': 'round' }, chuGiai);
      }
      K.chu(chuGiai, chu, { x: x + 38, y: yCG, co: coCG, dam: 600, mau: m.chu });
    };
    oCG(xCG, mauGoc, nhanGoc, hat + 40);
    oCG(xCG + 28 + 10 + rGoc + 34, mauLai, nhanLai, hat + 42);

    // ----- cột -----
    const tangCot = K.svg('g', null, g);
    const cot = lich.map((k, j) => {
      const x = cx(j) - rongCot / 2, y0 = plotBot, yG = sy(k.goc / DV), yT = sy(k.tong / DV);
      const nhom = K.svg('g', null, tangCot);
      const veKhoi = (ya, yb, mau, hh) => {
        if (yb - ya < 0.5) return;
        if (!tay) {
          K.svg('rect', { x, y: ya, width: rongCot, height: yb - ya, fill: mau }, nhom);
        } else {
          const id = idMoi('c');
          const pt = K.svg('pattern', { id, width: 8, height: 8, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(40)' }, defs);
          K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 8, stroke: mau, 'stroke-width': 2, opacity: 0.55 }, pt);
          K.svg('path', { d: chuNhatTay(x, ya, rongCot, yb - ya, hh, 1), fill: K.rgba(mau, 0.42) }, nhom);
          K.svg('path', { d: chuNhatTay(x, ya, rongCot, yb - ya, hh + 1, 1), fill: `url(#${id})` }, nhom);
          K.svg('path', { d: chuNhatTay(x, ya, rongCot, yb - ya, hh + 2, 1.5), fill: 'none', stroke: m.chu, 'stroke-width': 2.2, 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke' }, nhom);
        }
      };
      // gốc nằm dưới, lãi chồng trên
      veKhoi(yG, y0, mauGoc, hat + 100 + j * 5);
      veKhoi(yT, yG, mauLai, hat + 300 + j * 5);
      if (!tay) {
        // mép trên bo nhẹ và vạch sáng giữa hai khối
        if (k.goc > 0 && k.lai > 0) K.svg('line', { x1: x, y1: yG, x2: x + rongCot, y2: yG, stroke: m.nen, 'stroke-width': 2 }, nhom);
        K.svg('rect', { x: x - 1, y: yT - 1, width: rongCot + 2, height: y0 - yT + 1, rx: 5, fill: 'none', stroke: K.rgba('#000000', 0.08), 'stroke-width': 1 }, nhom);
      }
      return { nhom, yT, x: cx(j) };
    });

    // ----- thẻ số liệu một kỳ -----
    let the = null, mocThe = null, theDuong = null;
    const kyHien = opt.hien_ky ? Math.max(1, Math.min(n, Math.round(opt.hien_ky))) : 0;
    if (kyHien) {
      const k = lich[kyHien - 1], c = cot[kyHien - 1];
      const dong = [
        [`${opt.nhan_truc_x || 'Kỳ'} ${k.ky}`, 28, 800, m.chu],
        [`${nhanGoc}: ${K.so(k.goc / DV, 1)}`, 26, 600, m.chu],
        [`${nhanLai}: ${K.so(k.lai / DV, 1)}`, 26, 600, m.chu],
        [`Tổng: ${K.so(k.tong / DV, 1)} ${tenDV.replace(' đồng', '')}`, 26, 700, m.chu],
      ];
      const rongThe = Math.ceil(Math.max(...dong.map(([s, co, d]) => K.doChu(s, co, d)))) + 40, caoThe = 30 + dong.length * 36;
      const benPhai = c.x + rongCot / 2 + 24 + rongThe <= plotRight;
      const tx = benPhai ? c.x + rongCot / 2 + 24 : c.x - rongCot / 2 - 24 - rongThe;
      const tyMin = coAnHan ? plotTop + 50 : plotTop;
      const ty = K.cl(c.yT - caoThe / 2, tyMin, plotBot - caoThe - 8);
      theDuong = K.svg('path', { d: `M${benPhai ? tx : tx + rongThe} ${ty + caoThe / 2} L${c.x} ${c.yT}`, fill: 'none', stroke: m.chu, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, g);
      the = K.svg('g', { 'data-hop': '' }, g);
      if (!tay) {
        K.svg('rect', { x: tx + 3, y: ty + 6, width: rongThe, height: caoThe, rx: 12, fill: '#000', opacity: 0.1 }, the);
        K.svg('rect', { x: tx, y: ty, width: rongThe, height: caoThe, rx: 12, fill: m.the, stroke: K.rgba(m.vien, 0.25), 'stroke-width': 1.5 }, the);
        K.svg('rect', { x: tx, y: ty + 14, width: 6, height: caoThe - 28, rx: 3, fill: mauGoc }, the);
      } else {
        K.svg('path', { d: chuNhatTay(tx, ty, rongThe, caoThe, hat + 500, 1.2), fill: m.giay }, the);
        K.svg('path', { d: chuNhatTay(tx, ty, rongThe, caoThe, hat + 501, 1.8), fill: 'none', stroke: m.chu, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, the);
      }
      dong.forEach(([s, co, d, mau], j) => K.chu(the, s, { x: tx + 22, y: ty + 44 + j * 36, co, dam: d, mau: K.chuTren(tay ? m.giay : m.the, '#FFFFFF', mau) }));
      mocThe = [tx + rongThe / 2, ty + caoThe / 2];
    }

    // ----- thời điểm -----
    const nhip = opt.nhip != null ? opt.nhip : 0.14;
    const batDauCot = (j) => (opt.moc_hien && opt.moc_hien[j] != null ? opt.moc_hien[j] - (opt.vao > 0 ? opt.vao : 0) : 0.45 + j * nhip);
    const xongCot = batDauCot(n - 1) + 0.5;
    const vaoThe = opt.vao_hien_ky != null ? opt.vao_hien_ky - (opt.vao > 0 ? opt.vao : 0) : xongCot + 0.2;
    const vaoAH = coAnHan ? batDauCot(0) + 0.05 : 0;

    return {
      el: g,
      lich,
      seek(t) {
        const s = T(t);
        const pTruc = K.eio(K.tienDo(s, 0, 0.45));
        truc.style.strokeDashoffset = (1 - pTruc).toFixed(4);
        const pChu = K.eo3(K.tienDo(s, 0.15, 0.4)).toFixed(3);
        luoi.style.opacity = pChu;
        [...nhanTrucY, ...nhanX, tenTrucX, nhanDonVi].forEach((e) => (e.style.opacity = pChu));
        if (tieuDe) tieuDe.style.opacity = K.eo3(K.tienDo(s, 0, 0.35)).toFixed(3);
        if (chuThich) chuThich.style.opacity = K.eo3(K.tienDo(s, 0.1, 0.35)).toFixed(3);
        chuGiai.style.opacity = K.eo3(K.tienDo(s, 0.3, 0.4)).toFixed(3);
        cot.forEach((c, j) => {
          const p = K.spr(s - batDauCot(j), 0.45, 0.62);
          c.nhom.setAttribute('transform', `translate(0 ${plotBot}) scale(1 ${Math.max(0.0001, p).toFixed(4)}) translate(0 ${-plotBot})`);
          c.nhom.style.opacity = p <= 0.001 ? 0 : '';
        });
        if (vungAH) {
          const p = K.eo3(K.tienDo(s, vaoAH, 0.4));
          vungAH.style.opacity = p.toFixed(3);
          nhanAH.style.opacity = K.eo3(K.tienDo(s, vaoAH + batDauCot(Math.max(0, N - 1)) - batDauCot(0) + 0.3, 0.35)).toFixed(3);
        }
        if (the) {
          const p = K.eo3(K.tienDo(s, vaoThe, 0.35));
          the.style.opacity = p.toFixed(3);
          the.setAttribute('transform', `translate(0 ${((1 - p) * 12).toFixed(2)})`);
          theDuong.style.opacity = (p * 0.8).toFixed(3);
          // cột được chọn nhấp nháy nhẹ sau khi thẻ hiện (hàm thuần của t)
          const c = cot[kyHien - 1];
          const nhay = p >= 1 ? 0.9 + 0.1 * Math.cos((s - vaoThe - 0.35) * 2.6) : 1;
          if (s > vaoThe) {
            cot.forEach((cc, j) => { if (j !== kyHien - 1) cc.nhom.style.opacity = (1 - 0.45 * p).toFixed(3); });
            c.nhom.style.opacity = nhay.toFixed(3);
          }
        }
      },
      moc: {
        goc_truc: [plotLeft, plotBot],
        dinh_cot: cot.map((c) => [c.x, c.yT]),
        chu_giai: [xCG, yCG],
        an_han: hopAH,
        the: mocThe,
      },
    };
  };
})();
