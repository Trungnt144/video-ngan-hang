// chung/thanh_chia_doan.js — 1.0 — thanh ngang dài chia đoạn theo tỉ lệ (đã dùng / còn lại, gốc / lãi): đoạn mọc dần nối tiếp,
// số và nhãn trên từng đoạn tự né nhau khi đoạn hẹp (đưa ra ngoài, xếp tầng, có đường dẫn), ray nền và vạch trần nét đứt.
// Nguồn gom: xuong_dai/n82_han_muc_quay_vong/src/Chung.tsx:264-273 (Ray: nền nhạt dài bằng hạn mức, vạch trần nét đứt; Thanh).
// Kích thước chuẩn: thanh từ (0,0) tới (rong, cao), rong mặc định 1200, cao 64; nhãn số phía trên (y âm), nhãn tên phía dưới.
// KHO.thanh_ngang_chia_doan({ kieu, mau, rong, cao, tong, doan, tran, tieu_de, dinh_dang, vao, tinh })
//   tong       giá trị ứng với cả chiều dài (mặc định tổng các đoạn)
//   doan       [{ gia_tri | khoa: [{ t, gia_tri }], nhan, so, mau: 'nhan'|'nhan_phu'|'tot'|'xau'|'canh_bao'|'chu_phu',
//                 to: 'dac' | 'nhat', hien }]   to 'nhat' cho phần "còn lại"; khoa cho đoạn đổi độ dài theo t (rút vốn, trả nợ)
//   so         chữ số trên đoạn; bỏ trống thì dùng dinh_dang(gia_tri) nếu có
//   tran       { gia_tri, nhan }  vạch trần nét đứt (hạn mức); gia_tri mặc định = tong
//   tieu_de    chữ ở góc trên trái thanh
//   vao, hien  giây bắt đầu; -1 hoặc tinh: true thì hiện đủ ngay
// Trả { el, seek(t), moc: { dau, cuoi, doan: [[x,y]], ranh: [x], tran } }; moc.doan, moc.ranh cập nhật theo t.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let DEM = 0;

  function defsTrong(g) {
    let d = g.querySelector(':scope > defs');
    if (!d) { d = K.svg('defs'); g.insertBefore(d, g.firstChild); }
    return d;
  }
  function locTay(g, hat, doRun, vung) {
    const id = 'kho-tcd-nt-' + (++DEM);
    const f = K.svg('filter', { id, filterUnits: 'userSpaceOnUse', x: vung[0], y: vung[1], width: vung[2], height: vung[3] }, defsTrong(g));
    K.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.04, numOctaves: 2, seed: hat, result: 'n' }, f);
    K.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: doRun * 2, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
    return `url(#${id})`;
  }
  function gachCheo(g, mau, goc = 45, buoc = 10, day = 2.6, mo = 0.85) {
    const id = 'kho-tcd-gc-' + (++DEM);
    const p = K.svg('pattern', { id, patternUnits: 'userSpaceOnUse', width: buoc, height: buoc, patternTransform: `rotate(${goc})` }, defsTrong(g));
    K.svg('line', { x1: 1, y1: 0, x2: 1, y2: buoc, stroke: mau, 'stroke-width': day, opacity: mo, 'stroke-linecap': 'round' }, p);
    return `url(#${id})`;
  }
  function noiSuy(khoa, t) {
    if (t <= khoa[0].t) return khoa[0].gia_tri;
    for (let i = 1; i < khoa.length; i++) if (t <= khoa[i].t) {
      const a = khoa[i - 1], b = khoa[i];
      return K.lerp(a.gia_tri, b.gia_tri, K.eio((t - a.t) / Math.max(1e-6, b.t - a.t)));
    }
    return khoa[khoa.length - 1].gia_tri;
  }
  function xepTang(ds, khe = 24) {
    const cuoi = [];
    return ds.map((k) => {
      if (k.tang != null) { cuoi[k.tang] = Math.max(cuoi[k.tang] == null ? -1e9 : cuoi[k.tang], k.b); return k.tang; }
      let L = 0;
      while (cuoi[L] != null && cuoi[L] + khe > k.a) L++;
      cuoi[L] = k.b;
      return L;
    });
  }
  const BO_DEM_CHU = {};
  const doChu = (s, co, dam) => { const k = s + '|' + co + '|' + dam; return BO_DEM_CHU[k] != null ? BO_DEM_CHU[k] : (BO_DEM_CHU[k] = K.doChu(s, co, dam)); };

  K.thanh_ngang_chia_doan = function (opt) {
    const o = Object.assign({ kieu: 'phang', rong: 1200, cao: 64, doan: [], vao: 0 }, opt || {});
    const m = K.layMau(o), tay = o.kieu === 'net_tay';
    const tinh = o.tinh || o.vao === -1, vao = tinh ? -1e6 : o.vao;
    const W = o.rong, H = o.cao, R = tay ? 3 : Math.min(12, H * 0.22);
    const hat = o.hat || 17;
    const giaTriCuoi = (d) => (d.khoa ? d.khoa[d.khoa.length - 1].gia_tri : d.gia_tri || 0);
    const tong = o.tong || o.doan.reduce((s, d) => s + Math.max(giaTriCuoi(d), d.khoa ? Math.max(...d.khoa.map((k) => k.gia_tri)) : 0), 0) || 1;
    const xCua = (v) => (v / tong) * W;
    const CO_SO = 30, CO_NHAN = 28, H_TANG = 42;
    const g = K.svg('g', { class: 'kho-thanh-chia-doan' });

    // lịch hiện
    let tk = vao + 0.45;
    const hien = o.doan.map((d) => (d.hien != null && !tinh ? d.hien : (tk += 0.75) - 0.75));

    const lopNen = K.svg('g', null, g);
    const lopDoan = K.svg('g', null, g);
    const lopNet = K.svg('g', tay ? { filter: locTay(g, hat, 1.5, [-200, -400, W + 400, H + 800]) } : null, g);
    const lopChu = K.svg('g', null, g);

    // ray nền
    if (!tay) K.svg('rect', { x: 0, y: 4, width: W, height: H, rx: R, fill: '#000000', opacity: m.toi ? 0.3 : 0.06 }, lopNen);
    const ray = K.svg('rect', { x: 0, y: 0, width: W, height: H, rx: R, fill: tay ? K.rgba(m.chu_phu, 0.08) : m.nen_phu, stroke: tay ? 'none' : K.rgba(m.vien, 0.15), 'stroke-width': 2 }, lopNen);
    const vienRay = tay ? K.svg('path', { d: K.duongTay([[0, 0], [W, 0], [W, H], [0, H]], { hat, lech: 1.4, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.8 }, lopNet) : null;
    const vienRay2 = tay ? K.svg('path', { d: K.duongTay([[2, 2], [W - 1, 1], [W - 2, H - 1], [1, H + 1]], { hat: hat + 3, lech: 1.8, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 1.3, opacity: 0.45 }, lopNet) : null;
    const clipId = 'kho-tcd-cl-' + (++DEM);
    const clip = K.svg('clipPath', { id: clipId }, defsTrong(g));
    K.svg('rect', { x: 0, y: 0, width: W, height: H, rx: R }, clip);
    lopDoan.setAttribute('clip-path', `url(#${clipId})`);

    // đoạn
    const doan = o.doan.map((d, i) => {
      const mau = m[d.mau || (d.to === 'nhat' ? 'chu_phu' : 'nhan')] || d.mau;
      const nhat = d.to === 'nhat';
      const nhom = K.svg('g', null, lopDoan);
      const nen = K.svg('rect', { x: 0, y: 0, width: 0, height: H, fill: tay ? K.rgba(mau, nhat ? 0.1 : 0.32) : nhat ? K.rgba(mau, 0.16) : mau }, nhom);
      const gach = tay ? K.svg('rect', { x: 0, y: 0, width: 0, height: H, fill: gachCheo(g, mau, nhat ? -40 : 40 + i * 20, nhat ? 14 : 10, nhat ? 1.8 : 2.6, nhat ? 0.5 : 0.85) }, nhom) : null;
      // vạch ngăn giữa các đoạn
      const ranh = K.svg('line', { x1: 0, y1: tay ? -4 : 0, x2: 0, y2: tay ? H + 4 : H, stroke: tay ? m.chu : m.the, 'stroke-width': tay ? 2.4 : 3 }, tay ? lopNet : nhom);
      const cSo = K.chu(lopChu, '', { x: 0, y: 0, co: CO_SO, dam: 800, mau: m.chu, neo: 'middle' });
      const cNhan = d.nhan ? K.chu(lopChu, d.nhan, { x: 0, y: 0, co: CO_NHAN, dam: 600, mau: m.chu, neo: 'middle' }) : null;
      const dSo = K.svg('line', { stroke: m.chu_phu, 'stroke-width': 2, opacity: 0 }, lopChu);
      const dNhan = K.svg('line', { stroke: m.chu_phu, 'stroke-width': 2, opacity: 0 }, lopChu);
      const chuTrong = tay ? m.chu : nhat ? m.chu : K.chuTren(mau, '#FFFFFF', m.chu);
      return { d, mau, nhat, nhom, nen, gach, ranh, cSo, cNhan, dSo, dNhan, chuTrong, t0: hien[i] };
    });

    // trần và tiêu đề
    let tran = null;
    if (o.tran) {
      const x = xCua(o.tran.gia_tri != null ? o.tran.gia_tri : tong);
      const ln = K.svg('line', { x1: x, y1: H + 22, x2: x, y2: -26, stroke: m.chu, 'stroke-width': 3, 'stroke-dasharray': '10 7' }, tay ? lopNet : lopNen);
      const c = o.tran.nhan ? K.chu(lopChu, o.tran.nhan, { x: x - 10, y: -18, co: CO_NHAN, dam: 700, mau: m.chu, neo: 'end' }) : null;
      tran = { x, ln, c, w: o.tran.nhan ? doChu(o.tran.nhan, CO_NHAN, 700) : 0 };
    }
    const cTieuDe = o.tieu_de ? K.chu(lopChu, o.tieu_de, { x: 0, y: -18, co: CO_NHAN + 2, dam: 700, mau: m.chu }) : null;
    const wTieuDe = o.tieu_de ? doChu(o.tieu_de, CO_NHAN + 2, 700) : 0;

    const kq = {
      el: g,
      moc: { dau: [0, H / 2], cuoi: [W, H / 2], doan: [], ranh: [], tran: tran ? [tran.x, -26] : null },
      seek(t) {
        const aRay = tinh ? 1 : K.eo3(K.tienDo(t, vao, 0.45));
        const wRay = W * (tinh ? 1 : K.eio(K.tienDo(t, vao, 0.6)));
        ray.setAttribute('width', wRay.toFixed(2));
        lopNen.setAttribute('opacity', aRay.toFixed(3));
        if (vienRay) { K.veDan(vienRay, tinh ? 1 : K.eio(K.tienDo(t, vao, 0.8))); K.veDan(vienRay2, tinh ? 1 : K.eio(K.tienDo(t, vao + 0.15, 0.8))); }
        if (tran) { const a = tinh ? 1 : K.eo3(K.tienDo(t, vao + 0.4, 0.4)); tran.ln.setAttribute('opacity', a.toFixed(3)); if (tran.c) tran.c.setAttribute('opacity', a.toFixed(3)); }
        if (cTieuDe) cTieuDe.setAttribute('opacity', (tinh ? 1 : K.eo3(K.tienDo(t, vao + 0.2, 0.4))).toFixed(3));

        // bố trí theo t
        let x = 0;
        const tren = [], duoi = [];
        if (cTieuDe) tren.push({ a: 0, b: wTieuDe, tang: 0, co_dinh: true });
        if (tran && tran.c) tren.push({ a: tran.x - 10 - tran.w, b: tran.x + 10, tang: 0, co_dinh: true });
        const hang = doan.map((s) => {
          const p = tinh ? 1 : K.eio(K.tienDo(t, s.t0, 0.7));
          const v = (s.d.khoa ? noiSuy(s.d.khoa, t) : s.d.gia_tri) * p;
          const w = xCua(v), x0 = x; x += w;
          const so = s.d.so != null ? s.d.so : o.dinh_dang ? o.dinh_dang(v) : '';
          return { s, p, v, x0, w, cx: x0 + w / 2, so };
        });
        hang.forEach((h) => {
          const s = h.s;
          s.nen.setAttribute('x', h.x0.toFixed(2)); s.nen.setAttribute('width', Math.max(0, h.w).toFixed(2));
          if (s.gach) { s.gach.setAttribute('x', h.x0.toFixed(2)); s.gach.setAttribute('width', Math.max(0, h.w).toFixed(2)); }
          const xR = h.x0 + h.w;
          s.ranh.setAttribute('x1', xR.toFixed(2)); s.ranh.setAttribute('x2', xR.toFixed(2));
          s.ranh.setAttribute('opacity', h.p > 0.02 && xR < W - 2 ? 1 : 0);
          s.nhom.setAttribute('opacity', h.p > 0 ? 1 : 0);
          // số: trong đoạn nếu vừa
          const aChu = tinh ? 1 : K.eo3(K.tienDo(t, s.t0 + 0.45, 0.35));
          s.cSo.textContent = h.so;
          const wSo = h.so ? doChu(h.so, CO_SO, 800) : 0;
          h.soTrong = h.so && wSo + 28 <= h.w;
          h.wSo = wSo;
          const wNhan = s.d.nhan ? doChu(s.d.nhan, CO_NHAN, 600) : 0;
          h.wNhan = wNhan;
          if (h.so && !h.soTrong) tren.push({ h, loai: 'so', a: h.cx - wSo / 2, b: h.cx + wSo / 2 });
          if (s.d.nhan) duoi.push({ h, a: h.cx - wNhan / 2, b: h.cx + wNhan / 2 });
          s.cSo.setAttribute('opacity', h.so ? aChu.toFixed(3) : 0);
          if (s.cNhan) s.cNhan.setAttribute('opacity', aChu.toFixed(3));
        });
        // giữ nhãn trong khung [−40, W+40]
        const kep = (k) => { const w = k.b - k.a; if (k.a < -40) { k.a = -40; k.b = k.a + w; } if (k.b > W + 40) { k.b = W + 40; k.a = k.b - w; } };
        tren.forEach((k) => !k.co_dinh && kep(k)); duoi.forEach(kep);
        // dàn ngang: giữ một hàng, đẩy nhãn sang hai bên cho khỏi chồng; chỉ lên tầng khi đụng tiêu đề, trần hoặc quá chật
        const danNgang = (ds, coDinh) => {
          const ds2 = ds.filter((k) => !k.co_dinh).sort((p, q) => (p.a + p.b) - (q.a + q.b));
          const KHE = 26;
          for (let i = 1; i < ds2.length; i++) { const w = ds2[i].b - ds2[i].a; if (ds2[i].a < ds2[i - 1].b + KHE) { ds2[i].a = ds2[i - 1].b + KHE; ds2[i].b = ds2[i].a + w; } }
          for (let i = ds2.length - 1; i >= 0; i--) {
            const w = ds2[i].b - ds2[i].a, tran = i === ds2.length - 1 ? W + 40 : ds2[i + 1].a - KHE;
            if (ds2[i].b > tran) { ds2[i].b = tran; ds2[i].a = tran - w; }
          }
          const cuoi = [];
          coDinh.forEach((k) => (cuoi.push(k)));
          ds2.forEach((k) => {
            let L = 0;
            const dung = (L) => coDinh.concat(ds2.filter((q) => q !== k && q.tang === L)).some((q) => (q.tang || 0) === L && q.a < k.b + 20 && k.a < q.b + 20);
            k.tang = undefined;
            while (dung(L) && L < 6) L++;
            k.tang = L;
          });
        };
        danNgang(tren, tren.filter((k) => k.co_dinh));
        danNgang(duoi, []);
        // tầng trên: số đặt ở tầng ≥ tầng 0; tầng 0 có thể có tiêu đề và trần
        hang.forEach((h) => {
          const s = h.s;
          if (h.soTrong) {
            s.cSo.setAttribute('x', h.cx.toFixed(2)); s.cSo.setAttribute('y', (H / 2 + CO_SO * 0.36).toFixed(2));
            s.cSo.setAttribute('fill', s.chuTrong); s.dSo.setAttribute('opacity', 0);
          } else if (h.so) {
            const k = tren.find((q) => q.h === h && q.loai === 'so');
            const y = -18 - k.tang * H_TANG;
            s.cSo.setAttribute('x', ((k.a + k.b) / 2).toFixed(2)); s.cSo.setAttribute('y', y.toFixed(2));
            s.cSo.setAttribute('fill', m.chu);
            const lech = Math.abs((k.a + k.b) / 2 - h.cx) > 6 || k.tang > 0;
            s.dSo.setAttribute('x1', h.cx.toFixed(2)); s.dSo.setAttribute('y1', '-4'); s.dSo.setAttribute('x2', ((k.a + k.b) / 2).toFixed(2)); s.dSo.setAttribute('y2', (y + 8).toFixed(2));
            s.dSo.setAttribute('opacity', lech ? (0.7 * s.cSo.getAttribute('opacity')).toFixed(3) : 0);
          }
          if (s.cNhan) {
            const k = duoi.find((q) => q.h === h);
            const y = H + 38 + k.tang * H_TANG;
            s.cNhan.setAttribute('x', ((k.a + k.b) / 2).toFixed(2)); s.cNhan.setAttribute('y', y.toFixed(2));
            const lech = Math.abs((k.a + k.b) / 2 - h.cx) > 6 || k.tang > 0;
            s.dNhan.setAttribute('x1', h.cx.toFixed(2)); s.dNhan.setAttribute('y1', (H + 4).toFixed(2)); s.dNhan.setAttribute('x2', ((k.a + k.b) / 2).toFixed(2)); s.dNhan.setAttribute('y2', (y - 26).toFixed(2));
            s.dNhan.setAttribute('opacity', lech ? (0.7 * s.cNhan.getAttribute('opacity')).toFixed(3) : 0);
          }
        });
        // tiêu đề và trần đẩy lên nếu tầng 0 có số đè (đã cố định tầng 0 nên số tự lên tầng trên)
        kq.moc.doan = hang.map((h) => [h.cx, H / 2]);
        kq.moc.ranh = hang.map((h) => h.x0 + h.w);
      },
    };
    kq.seek(tinh ? 0 : vao);
    return kq;
  };
})();
