// ngan_hang/khuon_vi_du_tinh_tien.js — 1.0 — khuôn ví dụ tính tiền từng bước: mỗi bước một dòng (nhãn, biểu thức, kết quả), biểu thức hiện dần
// từng mảnh, số kết quả chạy tới giá trị cuối, dòng kết quả cuối được tô sáng; nhãn "ví dụ giả định" luôn có ở góc thẻ.
// Tham số: buoc [{ nhan, bieu_thuc (chuỗi, tách theo dấu cách; hoặc mảng { t, nhan: true } để tô mảnh), ket_qua (số, chạy tới), ket_qua_chu (chuỗi
//   hiện sẵn, thay ket_qua), dang 'tien' (KHO.soTien, mặc định) | 'so' (KHO.so + don_vi) | 'phan_tram', don_vi, thap_phan, buoc_dem }];
//   to_sang (chỉ số bước tô sáng, mặc định bước cuối; -1 không tô); tieu_de (chữ lớn trên thẻ); dong_nho (dòng nhỏ có vạch nhấn, như khuôn mở đầu);
//   gia_thiet (dòng dữ kiện đầu thẻ); chu_thich (dòng chú thích cuối thẻ); chu_gia_dinh ('ví dụ giả định'); kieu 'phang' | 'net_tay'; mau;
//   x, y, rong (vùng đặt, mặc định 140, 90, 1640: cùng lề khuôn mở đầu); co_bieu_thuc (40); co_ket_qua (48, dòng tô sáng 60);
//   vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay); moc_hien (mảng giây bắt đầu từng bước, tính từ lúc hình xuất hiện); moc_ket (giây tô sáng).
// Mẫu cách vẽ dần: N82 PhepTinh (xuong_dai/n82_han_muc_quay_vong/src/Chung.tsx:96-113, mảnh hiện lần lượt); dựng lại cho HTML. Cần nhan_gia_dinh.
// Trả về { el, seek(t), moc: { x, y, rong, moc_buoc: [giây từng bước], to_sang: giây tô sáng, xong } }.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // ---------- hàm nội bộ (đề xuất gom vào kho_nen.js: dùng lại ở mọi khuôn nhóm A) ----------
  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }
  // Điểm viền hộp bo góc (chiều kim đồng hồ), cạnh chia đoạn khoảng `buoc` px để nét tay run đều.
  function diemHop(x, y, w, h, r, buoc) {
    const d = [];
    const canh = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / buoc)); for (let i = 0; i < n; i++) d.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); };
    const nG = Math.max(3, Math.round(r / 7)), goc = (cx, cy, a0) => { for (let i = 0; i < nG; i++) { const a = a0 + (Math.PI / 2) * i / nG; d.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } };
    canh(x + r, y, x + w - r, y); goc(x + w - r, y + r, -Math.PI / 2);
    canh(x + w, y + r, x + w, y + h - r); goc(x + w - r, y + h - r, 0);
    canh(x + w - r, y + h, x + r, y + h); goc(x + r, y + h - r, Math.PI / 2);
    canh(x, y + h - r, x, y + r); goc(x + r, y + r, Math.PI);
    return d;
  }
  // Gạch chéo 45° tô kín một hộp (bút chì).
  function gachHop(x, y, w, h, buoc, hat) {
    let d = '';
    for (let c = buoc / 2, i = 0; c < w + h; c += buoc, i++) {
      d += K.duongTay([[x + Math.max(0, c - h), y + Math.min(h, c)], [x + Math.min(w, c), y + Math.max(0, c - w)]], { hat: hat + i, lech: 1.1 }) + ' ';
    }
    return d;
  }
  // Vòng khoanh bút chì quanh một hình elip, vượt quá điểm đầu một chút.
  function vongTay(cx, cy, rx, ry, hat) {
    const v = [];
    for (let i = 0; i <= 36; i++) { const a = -Math.PI * 0.95 + (i / 36) * Math.PI * 2.12; v.push([cx + Math.cos(a) * rx * (1 + 0.025 * Math.sin(i * 1.7)), cy + Math.sin(a) * ry]); }
    return K.duongTay(v, { hat, lech: 2 });
  }
  // Lớp SVG phủ kín phần tử cha (cha phải position relative/absolute), không nhận chuột.
  function lopSvg(cha) {
    const s = K.svg('svg', { style: 'position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none;' });
    cha.insertBefore(s, cha.firstChild);
    return s;
  }
  // Vẽ lại phần trang trí phụ thuộc kích thước khi kích thước phần tử đổi (đo một lần sau khi gắn vào trang; không phải trạng thái khung).
  function khiDoiCo(el, fn) {
    const w = el.offsetWidth, h = el.offsetHeight;
    if (!w) return;
    const k = w + 'x' + h;
    if (el._kho_co !== k) { el._kho_co = k; fn(w, h); }
  }
  // Viền thẻ bút chì: bóng lệch, nền loang, hai lượt nét.
  function veVienTay(svg, w, h, r, m, nenThe, hat) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    K.svg('path', { d: K.duongTay(diemHop(9, 11, w, h, r, 140), { hat: hat + 3, lech: 3, dong: true }) + 'Z', fill: K.rgba(m.chu, 0.07), stroke: 'none' }, svg);
    K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, r, 140), { hat, lech: 2.4, dong: true }) + 'Z', fill: nenThe, stroke: 'none' }, svg);
    K.svg('path', { d: K.duongTay(diemHop(0, 0, w, h, r, 120), { hat: hat + 1, lech: 1.8, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    K.svg('path', { d: K.duongTay(diemHop(2, -2, w - 3, h + 2, r, 160), { hat: hat + 2, lech: 2.2, dong: true }), fill: 'none', stroke: m.chu, 'stroke-width': 1.2, 'stroke-opacity': 0.45, 'stroke-linecap': 'round' }, svg);
  }
  function datTu(cha, chuoi, kieuSpan) {
    const ds = [];
    String(chuoi || '').split(/\s+/).filter(Boolean).forEach((w) => {
      if (cha.childNodes.length) cha.appendChild(document.createTextNode(' '));
      ds.push(K.html('span', { style: 'display:inline-block;' + (kieuSpan || '') }, cha, w));
    });
    return ds;
  }
  function hienTu(s, t, t0, cao) {
    const a = K.eo3(K.tienDo(t, t0, 0.3)), y = Math.round((1 - K.eob(K.tienDo(t, t0, 0.4), 1.2)) * (cao || 18));
    s.style.opacity = a.toFixed(3); s.style.transform = `translateY(${y}px)`;
  }
  // Đầu trang chung của nhóm khuôn: dòng nhỏ có vạch nhấn (giống khuôn mở đầu) và tiêu đề lớn.
  function dauTrang(cha, m, nen, dongNho, tieuDe, coTD) {
    const mauPhu = duTuongPhan(m.chu_phu, nen, 4.6), mauChu = duTuongPhan(m.chu, nen, 7);
    const khoi = K.html('div', { style: 'position:relative;' }, cha);
    let loat = null, vach = null, td = null, tu = [];
    if (dongNho) {
      loat = K.html('div', { style: 'display:flex;align-items:center;gap:18px;white-space:nowrap;margin-bottom:18px;' }, khoi);
      vach = K.html('div', { style: `width:56px;height:6px;border-radius:3px;background:${m.nhan};flex:none;` }, loat);
      K.html('div', { style: `font-weight:600;font-size:28px;letter-spacing:0.04em;color:${mauPhu};` }, loat, dongNho);
    }
    if (tieuDe) {
      td = K.html('div', { style: `font-weight:800;font-size:${coTD}px;line-height:${Math.round(coTD * 1.2)}px;color:${mauChu};letter-spacing:-0.01em;` }, khoi);
      tu = datTu(td, tieuDe);
    }
    if (!dongNho && !tieuDe) khoi.style.display = 'none';
    return {
      el: khoi, so_tu: tu.length,
      seek(t, t0) {
        if (loat) { loat.style.opacity = K.eo3(K.tienDo(t, t0, 0.4)).toFixed(3); vach.style.width = Math.round(8 + 48 * K.eio(K.tienDo(t, t0, 0.6))) + 'px'; }
        tu.forEach((s, i) => hienTu(s, t, t0 + 0.2 + i * 0.045, 22));
      },
    };
  }

  const TOAN_TU = /^[×x÷:+\-−=()%]+$/;

  K.khuon_vi_du_tinh_tien_tung_buoc = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay';
    const tinh = !!(opt.tinh || opt.vao === -1), vao = tinh ? -100 : (opt.vao || 0);
    const X = opt.x != null ? opt.x : 140, Y = opt.y != null ? opt.y : 90, W = opt.rong || 1640;
    const nenThe = tay ? K.tron(m.the, m.giay, 0.5) : m.the;
    const mauChu = duTuongPhan(m.chu, nenThe, 7), mauPhu = duTuongPhan(m.chu_phu, nenThe, 4.6), mauNhan = duTuongPhan(m.nhan, nenThe, 4.5);
    const nenSang = tay ? nenThe : K.tron(nenThe, m.nhat, 0.85);
    const mauKq = duTuongPhan(m.nhan, nenSang, 4.5), mauPhuSang = duTuongPhan(m.chu_phu, nenSang, 4.6);
    const ds = opt.buoc || [];
    const iSang = opt.to_sang != null ? opt.to_sang : ds.length - 1;
    const coBT = opt.co_bieu_thuc || 40, coKQ = opt.co_ket_qua || 48, coKQS = Math.round(coKQ * 1.25);
    const PAD = 44, padHang = 24, coSo = 56;

    function dinhDang(b, n) {
      if (b.dang === 'so') return K.so(n, b.thap_phan || 0) + (b.don_vi ? ' ' + b.don_vi : '');
      if (b.dang === 'phan_tram') return K.so(n, b.thap_phan || 0) + '%';
      return K.soTien(n, b.don_vi || 'đồng');
    }
    const chuoiCuoi = ds.map((b) => (b.ket_qua_chu != null ? String(b.ket_qua_chu) : (b.ket_qua != null ? dinhDang(b, b.ket_qua) : '')));

    // cột kết quả: đủ rộng cho chuỗi dài nhất, không quá 42% bề ngang trong thẻ
    const rongTrong = W - PAD * 2 - padHang * 2;
    const rongDau = Math.ceil(K.doChu('=', coBT, 600)) + 16;
    let rongKQ = 0;
    // cộng chỗ cho hai chữ số: số đang chạy có thể dài hơn số cuối (1,07 tỷ so với 1,2 tỷ)
    ds.forEach((b, i) => { const c = i === iSang ? coKQS : coKQ; rongKQ = Math.max(rongKQ, K.doChu(chuoiCuoi[i], c, 800) + (typeof b.ket_qua === 'number' && b.ket_qua_chu == null ? K.doChu('00', c, 800) : 0)); });
    rongKQ = Math.min(Math.round(rongTrong * 0.42), Math.max(320, Math.ceil(rongKQ + rongDau + 36)));
    const coThat = ds.map((b, i) => K.coVua(chuoiCuoi[i], rongKQ - rongDau - (i === iSang ? 36 : 12), i === iSang ? coKQS : coKQ, 800, 32));

    const el = K.html('div', { class: 'kho-vi-du-tinh-tien', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;font-family:${K.PHONG};` });
    const dau = dauTrang(el, m, m.nen, opt.dong_nho, opt.tieu_de, opt.co_tieu_de || 60);
    if (opt.dong_nho || opt.tieu_de) dau.el.style.marginBottom = '36px';

    // ----- thẻ -----
    const the = K.html('div', { 'data-hop': '1', style: `position:relative;box-sizing:border-box;padding:${PAD - 8}px ${PAD}px ${PAD}px;border-radius:26px;` +
      (tay ? '' : `background:${nenThe};box-shadow:0 14px 40px rgba(0,0,0,${m.toi ? 0.35 : 0.07}),0 2px 6px rgba(0,0,0,${m.toi ? 0.2 : 0.04});`) }, el);
    const svgThe = tay ? lopSvg(the) : null;

    // hàng đầu thẻ: dữ kiện bên trái, nhãn giả định bên phải
    const dauThe = K.html('div', { style: 'position:relative;display:flex;align-items:flex-start;justify-content:space-between;gap:28px;padding:0 0 18px;' }, the);
    const gt = K.html('div', { style: `flex:1 1 auto;min-width:0;font-weight:600;font-size:30px;line-height:40px;color:${mauPhu};padding-top:4px;` }, dauThe, opt.gia_thiet || '');
    const ngd = K.nhan_gia_dinh({ kieu: tay ? 'net_tay' : 'phang', mau: opt.mau, chu: opt.chu_gia_dinh || 'ví dụ giả định', vao: vao + 0.45, x: 0, y: 0 });
    const oNgd = K.html('div', { style: `position:relative;flex:none;width:${ngd.moc.rong}px;height:${ngd.moc.cao}px;` }, dauThe);
    oNgd.appendChild(ngd.el);
    const vachDau = K.html('div', { style: `position:relative;height:0;border-top:2px ${tay ? 'dashed' : 'solid'} ${K.rgba(m.chu, tay ? 0.35 : 0.1)};margin:0 0 10px;` }, the);

    // ----- các bước -----
    const hang = ds.map((b, i) => {
      const sang = i === iSang;
      const h = K.html('div', { style: `position:relative;display:flex;align-items:center;gap:28px;padding:${padHang - 4}px ${padHang}px;margin-top:${i ? 6 : 0}px;border-radius:18px;` }, the);
      let nenH = null, svgNen = null, vach = null;
      if (sang) {
        nenH = K.html('div', { style: `position:absolute;left:0;top:0;right:0;bottom:0;border-radius:18px;overflow:hidden;${tay ? '' : `background:${nenSang};`}` }, h);
        if (tay) svgNen = K.svg('svg', { style: 'position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;' }, nenH);
        else vach = K.html('div', { style: `position:absolute;left:0;top:0;bottom:0;width:8px;background:${m.nhan};` }, nenH);
      }
      const cNhan = sang ? mauPhuSang : mauPhu, cChu = sang ? duTuongPhan(m.chu, nenSang, 7) : mauChu, cOp = sang ? duTuongPhan(m.nhan, nenSang, 4.5) : mauNhan;
      // số thứ tự
      const so = K.html('div', { 'data-hop': '1', style: `position:relative;flex:none;width:${coSo}px;height:${coSo}px;border-radius:50%;display:flex;align-items:center;justify-content:center;` +
        `font-weight:700;font-size:28px;line-height:1;` + (tay ? `color:${cChu};` : `background:${m.nhan};color:${K.chuTren(m.nhan, '#FFFFFF', m.chu)};`) }, h);
      if (tay) {
        const s = lopSvg(so), r = coSo / 2, v = [];
        for (let k = 0; k <= 24; k++) { const a = -Math.PI / 2 + (k / 24) * Math.PI * 2.1; v.push([r + Math.cos(a) * (r - 2), r + Math.sin(a) * (r - 2)]); }
        K.svg('path', { d: K.duongTay(v, { hat: 40 + i, lech: 1.6 }), fill: K.rgba(m.nhat, 0.8), stroke: m.chu, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, s);
      }
      K.html('span', { style: 'position:relative;' }, so, String(i + 1));
      // nhãn và biểu thức
      const giua = K.html('div', { style: 'position:relative;flex:1 1 auto;min-width:0;' }, h);
      const nh = K.html('div', { style: `font-weight:600;font-size:28px;line-height:36px;color:${cNhan};` }, giua, b.nhan || '');
      const bt = K.html('div', { style: `margin-top:6px;font-weight:600;font-size:${coBT}px;line-height:${Math.round(coBT * 1.3)}px;color:${cChu};font-variant-numeric:tabular-nums;` }, giua);
      let manh = [];
      if (Array.isArray(b.bieu_thuc)) {
        b.bieu_thuc.forEach((p) => {
          if (bt.childNodes.length) bt.appendChild(document.createTextNode(' '));
          manh.push(K.html('span', { style: `display:inline-block;${p.nhan ? `color:${cOp};font-weight:700;` : ''}` }, bt, p.t));
        });
      } else manh = datTu(bt, b.bieu_thuc);
      manh.forEach((s) => { if (TOAN_TU.test(s.textContent)) { s.style.color = cOp; s.style.fontWeight = 700; } });
      if (!b.bieu_thuc) bt.style.display = 'none';
      // kết quả
      const kq = K.html('div', { 'data-hop': '1', style: `position:relative;flex:none;width:${rongKQ}px;display:flex;justify-content:flex-end;align-items:baseline;gap:${sang ? 40 : 16}px;white-space:nowrap;` }, h);
      const bang = K.html('span', { style: `position:relative;font-weight:600;font-size:${coBT}px;color:${cNhan};` }, kq, '=');
      const soKQ = K.html('span', { style: `position:relative;font-weight:800;font-size:${coThat[i]}px;line-height:${Math.round(coThat[i] * 1.2)}px;color:${sang ? mauKq : cChu};font-variant-numeric:tabular-nums;letter-spacing:-0.01em;` }, kq, chuoiCuoi[i]);
      let gachKQ = null, svgKQ = null, vongKQ = null;
      if (sang) {
        if (tay) { svgKQ = lopSvg(kq); vongKQ = K.svg('path', { fill: 'none', stroke: m.nhan, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, svgKQ); }
        else gachKQ = K.html('div', { style: `position:absolute;right:0;bottom:-12px;height:7px;width:0;border-radius:4px;background:${m.nhan};` }, kq);
      }
      return { b, i, sang, h, nenH, svgNen, vach, manh, nh, bang, soKQ, gachKQ, svgKQ, vongKQ, kq };
    });

    let ct = null;
    if (opt.chu_thich) ct = K.html('div', { style: `position:relative;margin-top:22px;padding:0 ${padHang}px;font-weight:500;font-size:26px;line-height:36px;color:${mauPhu};` }, the, opt.chu_thich);

    // ----- mốc thời gian -----
    const tThe = vao + 0.15 + (dau.so_tu ? Math.min(0.6, dau.so_tu * 0.045) : 0);
    const mh = opt.moc_hien || [];
    const tBuoc = hang.map((r, i) => (tinh ? -100 : (mh[i] != null ? mh[i] : tThe + 0.75 + i * 1.7)));
    const tKQ = hang.map((r, i) => tBuoc[i] + 0.2 + r.manh.length * 0.07 + 0.1);
    const cuoiDem = tKQ.length ? tKQ[tKQ.length - 1] + 0.8 : tThe + 0.5;
    const tSang = tinh ? -100 : (opt.moc_ket != null ? opt.moc_ket : (iSang >= 0 ? Math.max(cuoiDem, tKQ[iSang] + 0.8) + 0.15 : cuoiDem));
    const xong = tinh ? 0 : tSang + 0.75;

    function veTrangTri() {
      if (tay) khiDoiCo(the, (w, h) => veVienTay(svgThe, w, h, 26, m, nenThe, 61));
      hang.forEach((r) => {
        if (!r.sang) return;
        if (tay) khiDoiCo(r.h, (w, h) => {
          while (r.svgNen.firstChild) r.svgNen.removeChild(r.svgNen.firstChild);
          K.svg('path', { d: gachHop(0, 0, w, h, 15, 200), fill: 'none', stroke: m.nhan, 'stroke-width': 1.8, 'stroke-opacity': 0.32, 'stroke-linecap': 'round' }, r.svgNen);
          const wk = K.doChu(chuoiCuoi[r.i], coThat[r.i], 800), hk = r.kq.offsetHeight;
          r.vongKQ.setAttribute('d', vongTay(r.kq.offsetWidth - wk / 2, hk / 2 + 2, wk / 2 + 20, hk / 2 + 16, 88));
          r.vongKQ._kho_dai = null;
        });
      });
    }

    function seek(t) {
      veTrangTri();
      dau.seek(t, vao);
      const aT = K.eo3(K.tienDo(t, tThe, 0.45));
      the.style.opacity = aT.toFixed(3); the.style.transform = `translateY(${Math.round((1 - aT) * 28)}px)`;
      gt.style.opacity = K.eo3(K.tienDo(t, tThe + 0.2, 0.4)).toFixed(3);
      ngd.seek(t);
      vachDau.style.opacity = aT.toFixed(3);
      hang.forEach((r, i) => {
        const t0 = tBuoc[i], a = K.eo3(K.tienDo(t, t0, 0.35));
        r.h.style.opacity = a.toFixed(3);
        r.h.style.transform = `translateX(${Math.round((1 - K.spr(t - t0, 0.45, 0.7)) * -26)}px)`;
        r.manh.forEach((s, j) => hienTu(s, t, t0 + 0.2 + j * 0.07));
        const aB = K.eo3(K.tienDo(t, tKQ[i] - 0.05, 0.25));
        r.bang.style.opacity = aB.toFixed(3); r.soKQ.style.opacity = aB.toFixed(3);
        const b = r.b;
        if (b.ket_qua_chu == null && typeof b.ket_qua === 'number' && b.dem !== false) {
          const p = K.eio(K.tienDo(t, tKQ[i], 0.8));
          const v = Math.abs(b.ket_qua);
          const buoc = b.buoc_dem || Math.max(1, Math.pow(10, Math.floor(Math.log10(v || 1)) - 2));
          r.soKQ.textContent = p >= 1 ? chuoiCuoi[i] : dinhDang(b, Math.round((b.ket_qua * p) / buoc) * buoc);
        }
        if (r.sang) {
          const p = K.eio(K.tienDo(t, tSang, 0.5)), tho = 0.9 + 0.1 * Math.cos((t - xong) * 2.2) * K.tienDo(t, xong, 0.6);
          r.nenH.style.clipPath = `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0 round 18px)`;
          r.nenH.style.opacity = (p > 0 ? tho : 0).toFixed(3);
          if (r.gachKQ) r.gachKQ.style.width = Math.round(K.doChu(chuoiCuoi[i], coThat[i], 800) * K.eio(K.tienDo(t, tSang + 0.2, 0.5))) + 'px';
          if (r.vongKQ && r.vongKQ.getAttribute('d')) K.veDan(r.vongKQ, K.eio(K.tienDo(t, tSang + 0.2, 0.6)));
        }
      });
      if (ct) ct.style.opacity = K.eo3(K.tienDo(t, tSang + 0.3, 0.5)).toFixed(3);
    }

    return { el, seek, moc: { x: X, y: Y, rong: W, moc_buoc: tBuoc, to_sang: tSang, xong } };
  };
})();
