// ngan_hang/khuon_bang_can_doi.js — 1.0 — khuôn bảng cân đối kế toán của ngân hàng: hai cột Tài sản và Nguồn vốn, mỗi cột chồng các ngăn
// cao theo giá trị; ngăn hiện lần lượt, tô sáng được, giá trị đổi theo thời gian (ngăn co giãn, số chạy); dải "ngoại bảng" phía dưới đường kẻ
// có các thẻ cam kết, một thẻ có thể bay lên nhập vào một ngăn trong bảng (bảo lãnh thành khoản cho vay bắt buộc).
// Dùng cho: ngăn chứng khoán tách khỏi ngăn cho vay; vốn chủ sở hữu bên nguồn vốn; tiền gửi so với trái phiếu phát hành; khoản nợ đi khỏi bảng sang VAMC;
// cam kết ngoại bảng; tài sản nhân hệ số rủi ro. Không tên, màu nhận diện của ngân hàng thật.
// Gọi: KHO.khuon_bang_can_doi_ngan_hang({ ten_bang, ten_trai, ten_phai, tai_san, nguon_von, ngoai_bang, ten_ngoai_bang, don_vi, dinh_dang, thang,
//        hien_so, hien_tong, kieu, mau, x, y, rong, cao, vao, tinh, moc_trai, moc_phai, moc_ngoai_bang });  bí danh KHO.bang_can_doi.
//   tai_san, nguon_von: mảng ngăn từ trên xuống: { ten, gia_tri, phu (dòng nhỏ khi ngăn đủ cao), so (chữ thay số), khoa_mau (mặc định xoay vòng),
//       khoa: [{ t, gia_tri, dai }] (giây đổi giá trị, dài mặc định 0,8 giây; gia_tri 0 là ngăn biến mất), moc (giây hiện riêng), to, het_to (giây tô sáng) };
//   ten_bang: dòng trên cùng (mặc định 'Bảng cân đối kế toán'; ví dụ 'Ngân hàng A · Bảng cân đối kế toán'; false bỏ);
//   ten_trai, ten_phai: đầu cột (mặc định 'Tài sản', 'Nguồn vốn'); don_vi: chữ sau số (ví dụ 'nghìn tỷ đồng'); dinh_dang: hàm số → chữ;
//   thang: giá trị ứng với chiều cao thân bảng (mặc định tổng lớn hơn của hai cột lúc đầu); hien_so (mặc định true); hien_tong: dòng tổng cuối mỗi cột;
//   ngoai_bang: mảng thẻ { ten, gia_tri hoặc so, phu, khoa_mau, moc, to, len: { moc, den: 'tên ngăn đích', dai } }; ten_ngoai_bang: nhãn dải ngoại bảng;
//   x, y, rong, cao: góc trên trái, bề ngang khối, chiều cao thân bảng (mặc định căn giữa, 90, 1240, 500); chừa hai bên khoảng 320 px cho nhãn ngăn mỏng;
//   kieu 'phang' | 'net_tay'; vao: giây bắt đầu; tinh: true hiện đủ; moc_trai, moc_phai: mảng giây hiện từng ngăn; moc_ngoai_bang: giây hiện dải ngoại bảng.
// Trả về { el, seek(t), moc: { x, y, rong, cao, cot_trai, cot_phai, ngoai_bang: [hộp thẻ], vi_tri(ten, t) → hộp ngăn {x, y, w, h} trong sân khấu, xong } }.
// Ngăn thấp dưới 24 px đưa tên ra ngoài cột (tối đa 300 px, xuống hai dòng) (bên trái cột trái, bên phải cột phải); nhiều ngăn mỏng liền nhau thì gộp lại cho khỏi đè nhãn.
// Phần tử el là HTML đặt tuyệt đối (hợp đồng mục 7); ô có data-hop. Bố cục tính bằng số, không đo DOM.
// Dựng mới (02/11/2026, lô N168–N180).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  const KHOA_TRAI = ['nhan', 'nhan_phu', 'tot', 'canh_bao', 'xau'];
  const KHOA_PHAI = ['nhan_phu', 'canh_bao', 'tot', 'nhan', 'xau'];

  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }
  function diemHop(x, y, w, h, r, buoc) {
    const d = [];
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    const canh = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / buoc)); for (let i = 0; i < n; i++) d.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); };
    const nG = Math.max(2, Math.round(r / 7)), goc = (cx, cy, a0) => { for (let i = 0; i < nG; i++) { const a = a0 + (Math.PI / 2) * i / nG; d.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    canh(x + r, y, x + w - r, y); goc(x + w - r, y + r, -Math.PI / 2);
    canh(x + w, y + r, x + w, y + h - r); goc(x + w - r, y + h - r, 0);
    canh(x + w - r, y + h, x + r, y + h); goc(x + r, y + h - r, Math.PI / 2);
    canh(x, y + h - r, x, y + r); goc(x + r, y + r, Math.PI);
    return d;
  }
  const giaTriLuc = (n, t) => {
    let v = n.gia_tri || 0;
    (n.khoa || []).forEach((k) => { v = K.lerp(v, k.gia_tri, K.eio(K.tienDo(t, k.t, k.dai != null ? k.dai : 0.8))); });
    return v;
  };

  K.khuon_bang_can_doi_ngan_hang = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const W = opt.rong || 1240, X = opt.x != null ? opt.x : Math.round((1920 - W) / 2), Y = opt.y != null ? opt.y : 90;
    const CAO = opt.cao || 500, GAP = 36, wCot = (W - GAP) / 2, KE = 6;
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the;
    const mauChuNen = duTuongPhan(m.chu, m.nen, 7), mauPhuNen = duTuongPhan(m.chu_phu, m.nen, 4.6);
    const dd = opt.dinh_dang || ((v) => K.so(v, Math.abs(v) < 10 && v % 1 ? 1 : 0) + (opt.don_vi ? ' ' + opt.don_vi : ''));
    const hienSo = opt.hien_so !== false;
    const chuanNgan = (ds, khoa) => (ds || []).map((n, i) => Object.assign({}, typeof n === 'string' ? { ten: n, gia_tri: 1 } : n, { khoa_mau: (n && n.khoa_mau) || khoa[i % khoa.length] }));
    const trai = chuanNgan(opt.tai_san, KHOA_TRAI), phai = chuanNgan(opt.nguon_von, KHOA_PHAI);
    const tong = (ds, t) => ds.reduce((s, n) => s + Math.max(0, t == null ? (n.gia_tri || 0) : giaTriLuc(n, t)), 0);
    const THANG = opt.thang || Math.max(tong(trai), tong(phai), 1e-9);

    // ----- chiều dọc -----
    let y = 0;
    const yTenBang = y; if (opt.ten_bang !== false) y += 58;
    const yDauCot = y; y += 66;
    const yThan = y; y += CAO;
    const yTong = y; if (opt.hien_tong) y += 58;
    const nb = (opt.ngoai_bang || []).map((n) => Object.assign({}, typeof n === 'string' ? { ten: n } : n));
    const yNB = y + 34; let hNB = 0;
    if (nb.length) { hNB = 40 + 132; y = yNB + hNB; }
    const CAO_KHOI = y;

    const el = K.html('div', { class: 'kho-bang-can-doi', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;height:${CAO_KHOI}px;font-family:${K.PHONG};` });
    const svg = K.svg('svg', { width: W, height: CAO_KHOI, style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;' }, el);
    const svgKhung = K.svg('g', null, svg), svgNgan = K.svg('g', null, svg);
    const lopHtml = K.html('div', { style: 'position:absolute;left:0;top:0;width:100%;height:100%;' }, el);
    const svgTren = K.svg('svg', { width: W, height: CAO_KHOI, style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;' }, el);

    // ----- tên bảng -----
    let tenBang = null;
    if (opt.ten_bang !== false) {
      const s = opt.ten_bang || 'Bảng cân đối kế toán';
      tenBang = K.html('div', { style: `position:absolute;left:0;top:${yTenBang}px;width:${W}px;text-align:center;white-space:nowrap;font-weight:700;font-size:${K.coVua(s, W, 32, 700, 22)}px;line-height:44px;color:${mauPhuNen};letter-spacing:0.02em;` }, lopHtml, s);
    }
    // ----- khung hai cột -----
    const cot = [0, 1].map((j) => {
      const cx = j * (wCot + GAP);
      const ten = j ? (opt.ten_phai || 'Nguồn vốn') : (opt.ten_trai || 'Tài sản');
      const g = K.svg('g', null, svgKhung);
      if (!tay) {
        const idB = 'kho-bcd-b' + j + '-' + Math.round(W + CAO + j);
        const f = K.svg('filter', { id: idB, x: '-10%', y: '-10%', width: '120%', height: '125%' }, K.defs(svg));
        K.svg('feDropShadow', { dx: 0, dy: 10, stdDeviation: 14, 'flood-color': '#000', 'flood-opacity': m.toi ? 0.35 : 0.08 }, f);
        K.svg('rect', { x: cx, y: yDauCot, width: wCot, height: CAO + 66 + (opt.hien_tong ? 58 : 0) + 8, rx: 18, fill: nenThe, filter: `url(#${idB})` }, g);
        K.svg('rect', { x: cx, y: yDauCot, width: wCot, height: 66, rx: 18, fill: m.chu }, g);
        K.svg('rect', { x: cx, y: yDauCot + 40, width: wCot, height: 26, fill: m.chu }, g);
      } else {
        K.svg('path', { d: K.duongTay(diemHop(cx + 8, yDauCot + 10, wCot, CAO + 74 + (opt.hien_tong ? 58 : 0), 18, 140), { hat: 610 + j, lech: 2.6, dong: true }) + 'Z', fill: K.rgba(m.chu, 0.07) }, g);
        K.svg('path', { d: K.duongTay(diemHop(cx, yDauCot, wCot, CAO + 74 + (opt.hien_tong ? 58 : 0), 18, 140), { hat: 620 + j, lech: 2, dong: true }) + 'Z', fill: nenThe }, g);
        K.svg('path', { d: K.duongTay(diemHop(cx, yDauCot, wCot, CAO + 74 + (opt.hien_tong ? 58 : 0), 18, 110), { hat: 630 + j, lech: 1.8, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, g);
        K.svg('path', { d: K.duongTay([[cx + 14, yDauCot + 64], [cx + wCot / 2, yDauCot + 66], [cx + wCot - 14, yDauCot + 63]], { hat: 640 + j, lech: 1.4 }), fill: 'none', stroke: m.chu, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      }
      const mauDau = tay ? m.chu : K.chuTren(m.chu, '#FFFFFF', m.nen);
      const dau = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${cx}px;top:${yDauCot}px;width:${wCot}px;height:66px;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${K.coVua(ten, wCot - 40, 34, 800, 22)}px;color:${mauDau};white-space:nowrap;` }, lopHtml, ten);
      const sTong = opt.hien_tong ? K.html('div', { 'data-hop': '1', style: `position:absolute;left:${cx}px;top:${yTong + 4}px;width:${wCot}px;height:54px;box-sizing:border-box;padding:0 24px;display:flex;align-items:center;justify-content:space-between;white-space:nowrap;font-weight:800;font-size:28px;color:${duTuongPhan(m.chu, nenThe, 7)};border-top:3px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, 0.5)};` }, lopHtml) : null;
      let sTongSo = null;
      if (sTong) { K.html('span', null, sTong, 'Tổng'); sTongSo = K.html('span', null, sTong, ''); }
      return { j, cx, g, dau, sTong, sTongSo, ds: j ? phai : trai };
    });

    // ----- ngăn -----
    const ds = [];
    cot.forEach((c) => c.ds.forEach((n, i) => {
      const mc = m[n.khoa_mau] || m.nhan;
      const nen = tay ? nenThe : K.tron(mc, m.the, m.toi ? 0.7 : 0.8);
      const mauChu = duTuongPhan(m.chu, nen, 7), mauPhu = duTuongPhan(m.chu_phu, nen, 4.6);
      const o = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${c.cx + 12}px;width:${wCot - 24}px;box-sizing:border-box;border-radius:10px;overflow:visible;` +
        (tay ? '' : `background:${nen};border-left:10px solid ${mc};`) }, lopHtml);
      const dong = K.html('div', { style: `position:absolute;left:${tay ? 18 : 14}px;right:18px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center;` }, o);
      const hang = K.html('div', { style: 'display:flex;align-items:baseline;justify-content:space-between;gap:16px;white-space:nowrap;' }, dong);
      const sTen = K.html('div', { style: `font-weight:700;color:${mauChu};overflow:visible;` }, hang, n.ten || '');
      const sSo = K.html('div', { style: `font-weight:800;color:${duTuongPhan(mc, nen, 4.5)};` }, hang, '');
      const sPhu = n.phu ? K.html('div', { style: `font-weight:600;color:${mauPhu};white-space:nowrap;margin-top:4px;` }, dong, n.phu) : null;
      // nhãn ngoài cột cho ngăn mỏng
      const ngoai = K.html('div', { style: `position:absolute;width:max-content;max-width:300px;font-weight:700;font-size:22px;line-height:27px;color:${mauChuNen};` + (c.j ? 'text-align:left;' : 'text-align:right;') }, lopHtml, '');
      const gN = K.svg('g', null, svgNgan);
      const vien = K.svg('path', { fill: 'none', stroke: m.nhan, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svgTren);
      ds.push({ n, c, i, mc, nen, o, sTen, sSo, sPhu, ngoai, gN, vien, hat: 700 + c.j * 50 + i * 7 });
    }));

    // ----- ngoại bảng -----
    let dai = null, nhanNB = null;
    const the = [];
    if (nb.length) {
      dai = K.svg('path', { d: tay ? K.duongTay([[0, yNB], [W / 2, yNB + 2], [W, yNB - 1]], { hat: 690, lech: 1.6 }) : `M0 ${yNB} L${W} ${yNB}`, fill: 'none', stroke: m.chu, 'stroke-width': 3, 'stroke-dasharray': '14 10', opacity: 0.55 }, svgKhung);
      const s = opt.ten_ngoai_bang || 'Ngoại bảng (thuyết minh báo cáo tài chính)';
      nhanNB = K.html('div', { style: `position:absolute;left:0;top:${yNB + 6}px;white-space:nowrap;font-weight:600;font-size:24px;line-height:30px;letter-spacing:0.02em;color:${mauPhuNen};` }, lopHtml, s);
      const n = nb.length, gapT = 22, wT = Math.min(340, (W - gapT * (n - 1)) / n), x0 = (W - (wT * n + gapT * (n - 1))) / 2, yT = yNB + 44, hT = 120;
      nb.forEach((d, i) => {
        const mc = m[d.khoa_mau || KHOA_PHAI[i % KHOA_PHAI.length]] || m.nhan;
        const x = x0 + i * (wT + gapT);
        const o = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x}px;top:${yT}px;width:${wT}px;height:${hT}px;box-sizing:border-box;padding:14px 18px;border-radius:14px;display:flex;flex-direction:column;justify-content:center;gap:6px;` +
          (tay ? '' : `background:${nenThe};border:3px dashed ${mc};`) }, lopHtml);
        const coT = K.coVua(d.ten || '', wT - 40, 28, 700, 20);
        K.html('div', { style: `font-weight:700;font-size:${coT}px;line-height:${coT + 6}px;color:${duTuongPhan(m.chu, nenThe, 7)};white-space:nowrap;` }, o, d.ten || '');
        const giaTri = d.so != null ? d.so : (d.gia_tri != null && hienSo ? dd(d.gia_tri) : (d.phu || ''));
        if (giaTri) K.html('div', { style: `font-weight:800;font-size:${K.coVua(giaTri, wT - 40, 26, 800, 18)}px;line-height:32px;color:${duTuongPhan(mc, nenThe, 4.5)};white-space:nowrap;` }, o, giaTri);
        const g = K.svg('g', null, svgTren);
        if (tay) {
          K.svg('path', { d: K.duongTay(diemHop(0, 0, wT, hT, 14, 60), { hat: 720 + i * 3, lech: 1.6, dong: true }) + 'Z', fill: nenThe }, g);
          K.svg('path', { d: K.duongTay(diemHop(0, 0, wT, hT, 14, 60), { hat: 721 + i * 3, lech: 1.6, dong: true }), fill: 'none', stroke: mc, 'stroke-width': 3, 'stroke-dasharray': '12 8', 'stroke-linecap': 'round' }, g);
          lopHtml.insertBefore(o, lopHtml.firstChild); // chữ nằm trên nền vẽ tay: nền ở svgTren nên đưa nền xuống dưới bằng cách đặt g vào svg dưới
          svgNgan.appendChild(g);
        }
        the.push({ d, o, g, x, y: yT, w: wT, h: hT, mc });
      });
    }

    // ----- mốc -----
    const mT = opt.moc_trai || [], mP = opt.moc_phai || [];
    const tCot = tinh ? -100 : vao + 0.3;
    ds.forEach((d) => {
      const mm = d.c.j ? mP : mT;
      d.t0 = tinh ? -100 : (d.n.moc != null ? d.n.moc : (mm[d.i] != null ? mm[d.i] : tCot + 0.6 + d.i * 0.45 + d.c.j * (0.45 * trai.length + 0.3)));
    });
    const tCuoiNgan = ds.length ? Math.max(...ds.map((d) => d.t0)) : tCot;
    const tNB = tinh ? -100 : (opt.moc_ngoai_bang != null ? opt.moc_ngoai_bang : tCuoiNgan + 0.9);
    the.forEach((h, i) => { h.t0 = tinh ? -100 : (h.d.moc != null ? h.d.moc : tNB + 0.4 + i * 0.35); });
    const xong = tinh ? 0 : Math.max(tCuoiNgan, the.length ? the[the.length - 1].t0 : 0) + 0.6;

    // hộp ngăn lúc t (toạ độ trong khối)
    function hopNgan(t) {
      const out = new Map();
      cot.forEach((c) => {
        let yy = yThan + 4;
        c.ds.forEach((n) => {
          const v = Math.max(0, giaTriLuc(n, t)), h = (v / THANG) * (CAO - 8);
          out.set(n, { x: c.cx + 12, y: yy + (h > KE ? KE / 2 : 0), w: wCot - 24, h: Math.max(0, h - (h > KE ? KE : h)), v });
          yy += h;
        });
      });
      return out;
    }

    function seek(t) {
      const aCot = K.eo3(K.tienDo(t, vao, 0.4));
      if (tenBang) tenBang.style.opacity = aCot.toFixed(3);
      cot.forEach((c) => {
        const a = K.eo3(K.tienDo(t, tCot + c.j * 0.15, 0.4)), dy = (1 - K.spr(t - tCot - c.j * 0.15, 0.5, 0.7)) * 24;
        c.g.setAttribute('opacity', a.toFixed(3)); c.g.setAttribute('transform', `translate(0 ${dy.toFixed(2)})`);
        c.dau.style.opacity = a.toFixed(3); c.dau.style.transform = `translateY(${dy.toFixed(2)}px)`;
        if (c.sTong) {
          c.sTong.style.opacity = K.eo3(K.tienDo(t, tCuoiNgan + 0.4, 0.4)).toFixed(3);
          c.sTongSo.textContent = dd(tong(c.ds, t));
        }
      });
      const hop = hopNgan(t);
      // nhãn ngoài: tránh đè bằng cách dồn xuống khi hai nhãn quá gần
      const yNgoaiCuoi = [-1e9, -1e9];
      ds.forEach((d) => {
        const b = hop.get(d.n), tt = t - d.t0;
        const a = K.eo3(K.tienDo(tt, 0, 0.35)) * (b.h > 0.5 ? 1 : K.cl(b.h / 0.5));
        const dx = (1 - K.spr(tt, 0.45, 0.7)) * (d.c.j ? 26 : -26);
        let to = 0;
        if (d.n.to != null) to = K.eo3(K.tienDo(t, d.n.to, 0.35)) * (d.n.het_to != null ? 1 - K.eo3(K.tienDo(t, d.n.het_to, 0.35)) : 1);
        d.o.style.top = b.y.toFixed(1) + 'px'; d.o.style.height = b.h.toFixed(1) + 'px';
        d.o.style.opacity = a.toFixed(3); d.o.style.transform = `translateX(${(dx).toFixed(2)}px) scale(${(1 + 0.012 * to).toFixed(4)})`;
        if (!tay) d.o.style.boxShadow = to > 0.001 ? `0 0 0 ${(5 * to).toFixed(1)}px ${K.rgba(m.nhan, 0.85)}` : 'none';
        // cỡ chữ theo chiều cao ngăn
        const trong = b.h >= 24;
        const co = Math.min(K.cl(Math.round(b.h * 0.5), 20, 30), Math.max(16, Math.floor(b.h - 6)));
        const coTen = Math.min(co, K.coVua(d.n.ten || '', (wCot - 24) * 0.6, co, 700, 15));
        d.sTen.style.fontSize = coTen + 'px'; d.sTen.style.lineHeight = Math.round(coTen * 1.2) + 'px';
        d.sSo.style.fontSize = Math.max(15, co - 2) + 'px';
        const chuSo = d.n.so != null ? d.n.so : (hienSo && d.n.gia_tri != null ? dd(b.v) : '');
        d.sSo.textContent = chuSo;
        if (d.sPhu) { const coPhu = 22; d.sPhu.style.fontSize = coPhu + 'px'; d.sPhu.style.display = b.h >= coTen * 1.2 + coPhu * 1.3 + 22 ? '' : 'none'; }
        d.sTen.parentElement.parentElement.style.visibility = trong ? 'visible' : 'hidden';
        // nhãn ngoài cột
        if (!trong && b.h > 0.5) {
          let yy = b.y + b.h / 2 - 15;
          const chuNgoai = d.n.ten + (chuSo ? ' · ' + chuSo : ''), haiDong = K.doChu(chuNgoai, 22, 700) > 300;
          if (haiDong) yy -= 13;
          if (yy < yNgoaiCuoi[d.c.j] + 4) yy = yNgoaiCuoi[d.c.j] + 4;
          yNgoaiCuoi[d.c.j] = yy + (haiDong ? 54 : 27);
          d.ngoai.textContent = chuNgoai;
          d.ngoai.style.top = yy.toFixed(1) + 'px';
          if (d.c.j) { d.ngoai.style.left = (d.c.cx + wCot + 16) + 'px'; d.ngoai.style.right = ''; }
          else { d.ngoai.style.right = (W - d.c.cx + 16) + 'px'; d.ngoai.style.left = ''; }
          d.ngoai.style.opacity = a.toFixed(3); d.ngoai.style.display = '';
        } else d.ngoai.style.display = 'none';
        // nét tay: nền gạch và viền theo hộp hiện tại
        while (d.gN.firstChild) d.gN.removeChild(d.gN.firstChild);
        if (tay && b.h > 2) {
          d.gN.setAttribute('opacity', a.toFixed(3)); d.gN.setAttribute('transform', `translate(${dx.toFixed(2)} 0)`);
          let gd = '';
          for (let cc = 10, i = 0; cc < b.w + b.h; cc += 15, i++) gd += K.duongTay([[b.x + Math.max(0, cc - b.h), b.y + Math.min(b.h, cc)], [b.x + Math.min(b.w, cc), b.y + Math.max(0, cc - b.w)]], { hat: d.hat + i, lech: 1 }) + ' ';
          K.svg('path', { d: gd, fill: 'none', stroke: d.mc, 'stroke-width': 1.6, opacity: 0.34, 'stroke-linecap': 'round' }, d.gN);
          K.svg('path', { d: K.duongTay(diemHop(b.x, b.y, b.w, b.h, 8, 90), { hat: d.hat + 90, lech: 1.4, dong: true }), fill: 'none', stroke: d.mc, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, d.gN);
        }
        if (tay && to > 0.001 && b.h > 2) {
          d.vien.setAttribute('d', K.duongTay(diemHop(b.x - 8, b.y - 6, b.w + 16, b.h + 12, 12, 70), { hat: d.hat + 95, lech: 2, dong: true }));
          d.vien._kho_dai = null; d.vien.style.display = ''; K.veDan(d.vien, K.eio(K.tienDo(t, d.n.to, 0.6)) * (d.n.het_to != null ? 1 - K.tienDo(t, d.n.het_to, 0.3) : 1));
        } else d.vien.style.display = 'none';
      });
      // ngoại bảng
      if (dai) {
        const p = K.eio(K.tienDo(t, tNB, 0.6));
        dai.setAttribute('opacity', (0.55 * p).toFixed(3)); nhanNB.style.opacity = p.toFixed(3);
      }
      the.forEach((h) => {
        const tt = t - h.t0, a = K.eo3(K.tienDo(tt, 0, 0.35));
        let dx = 0, dy = (1 - K.spr(tt, 0.5, 0.68)) * 24, sc = 1, mo = a;
        if (h.d.len && h.d.len.den) {
          const dich = ds.find((d) => d.n.ten === h.d.len.den);
          if (dich) {
            const daiLen = h.d.len.dai || 1.0, p = K.eio(K.tienDo(t, h.d.len.moc, daiLen));
            const b = hopNgan(Math.max(t, h.d.len.moc + daiLen)).get(dich.n);
            const tx = b.x + b.w / 2 - (h.x + h.w / 2), ty = b.y + b.h / 2 - (h.y + h.h / 2);
            dx = tx * p; dy = dy * (1 - p) + ty * p - Math.sin(Math.PI * p) * 80; sc = 1 - 0.35 * p;
            mo = a * (1 - K.tienDo(t, h.d.len.moc + daiLen * 0.8, daiLen * 0.25));
          }
        }
        let to = 0;
        if (h.d.to != null) to = K.eo3(K.tienDo(t, h.d.to, 0.35));
        const tf = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${(sc * (1 + 0.04 * to)).toFixed(4)})`;
        h.o.style.opacity = mo.toFixed(3); h.o.style.transform = tf; h.o.style.display = mo < 0.005 ? 'none' : '';
        if (!tay) h.o.style.boxShadow = to > 0.001 ? `0 0 0 ${(6 * to).toFixed(1)}px ${K.rgba(h.mc, 0.4)}` : 'none';
        if (h.g && tay) { h.g.setAttribute('opacity', mo.toFixed(3)); h.g.setAttribute('transform', `translate(${(h.x + dx + h.w * (1 - sc) / 2).toFixed(2)} ${(h.y + dy + h.h * (1 - sc) / 2).toFixed(2)}) scale(${sc.toFixed(4)})`); }
      });
    }

    const raSan = (b) => ({ x: X + b.x, y: Y + b.y, w: b.w, h: b.h });
    return {
      el, seek,
      moc: {
        x: X, y: Y, rong: W, cao: CAO_KHOI,
        cot_trai: { x: X, y: Y + yDauCot, w: wCot, h: CAO + 66 }, cot_phai: { x: X + wCot + GAP, y: Y + yDauCot, w: wCot, h: CAO + 66 },
        ngoai_bang: the.map((h) => ({ x: X + h.x, y: Y + h.y, w: h.w, h: h.h })),
        vi_tri(ten, t) { const d = ds.find((q) => q.n.ten === ten); return d ? raSan(hopNgan(t == null ? 1e6 : t).get(d.n)) : null; },
        xong,
      },
    };
  };
  K.bang_can_doi = K.khuon_bang_can_doi_ngan_hang;
})();
