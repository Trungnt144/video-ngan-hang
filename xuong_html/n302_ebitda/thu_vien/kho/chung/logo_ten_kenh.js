// chung/logo_ten_kenh.js — 1.1 (chữ mặc định màn hình kết rút còn 11 tiếng cả khung, 30/10/2026) — logo và tên kênh: (1) góc logo cảnh mở (logo tròn nhỏ góc trên trái kèm tên kênh, 3–4 giây đầu);
// (2) màn hình kết 10 giây (logo, tên kênh, lời mời đăng ký, hai ô trống 16:9 để gắn thẻ video tiếp theo của YouTube).
// Quyết định Trung 29/10/2026 (file kế hoạch chạy đêm 29/10 mục 1): logo ở cảnh mở và màn hình kết, không đặt logo suốt video.
// Ảnh logo nhúng sẵn ở chung/logo/logo_kenh_ngan_hang_anh.js (KHO.ANH_LOGO.ngan_hang); file này bọc KHO.napPhong để chờ cả ảnh logo giải mã,
// nên trang nào đã chờ napPhong trước khi chụp thì không phải sửa gì thêm.
//
// KHO.logo_goc(opt) — tham số: ten_kenh ('Chuyện nghề Ngân hàng'); anh (data URL hoặc đường dẫn, mặc định KHO.ANH_LOGO.ngan_hang);
//   hien_ten (true); x, y (40, 24: góc trên trái của logo); co (đường kính logo, 60); vao (giây bắt đầu, 0); ra (giây đã ẩn xong, 3.6);
//   kieu 'phang' | 'net_tay'; mau. Trả về { el, seek(t), moc: { x, y, rong, cao, xong, het } }.
//   Vùng chiếm ở mặc định: x 40–khoảng 450, y 24–84 (thẻ tên y 33–76). Dòng tên loạt của khuon_canh_mo_dau_cau_hoi nằm ở y 90 trở xuống nên không đè;
//   khi có logo góc thì dòng tên loạt nên bỏ chữ "Chuyện nghề Ngân hàng" (đã có ở logo), chỉ ghi "Thuật ngữ · …".
// KHO.man_hinh_ket_kenh(opt) — tham số: ten_kenh; anh; loi_moi ('Đăng ký kênh'); nhan_o (['Xem tiếp', 'Xem thêm'],
//   chuỗi rỗng thì bỏ nhãn); nen (true: tô kín khung bằng màu nền); vao (0); dai (10); kieu; mau.
//   Bố cục 1920×1080: hàng logo và tên kênh căn giữa ở trên (y 96–296), hai ô trống 800×450 ở y 400–850 (x 120 và 1000).
//   Ô trống để Trung đặt phần tử "Video" của màn hình kết YouTube đè lên; logo tròn là chỗ đặt phần tử "Đăng ký".
//   Trả về { el, seek(t), moc: { logo: [cx, cy, d], o: [[x, y, w, h], [x, y, w, h]], xong } }.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  const TEN = 'Chuyện nghề Ngân hàng';

  // Chờ ảnh logo giải mã cùng lúc chờ phông (mọi trang dùng kho đều chờ napPhong trước khi chụp khung đầu).
  // Ảnh logo giải mã sẵn ngay khi nạp file (file ảnh nhúng nạp trước file này), để thẻ <img> tạo sau dùng lại bản đã giải mã.
  const anhCho = [];
  if (K.ANH_LOGO && K.ANH_LOGO.ngan_hang) { const im = new Image(); im.src = K.ANH_LOGO.ngan_hang; anhCho.push(im); }
  if (K.napPhong && !K.napPhong._co_logo) {
    const cu = K.napPhong;
    K.napPhong = function () { return Promise.all([cu.apply(K, arguments)].concat(anhCho.map((im) => (im.decode ? im.decode().catch(() => {}) : null)))).then(() => undefined); };
    K.napPhong._co_logo = true;
  }
  function anhLogo(cha, d, src, vien, mauVien) {
    const khung = K.html('div', { style: `position:absolute;left:0;top:0;width:${d}px;height:${d}px;border-radius:50%;overflow:hidden;` +
      `box-shadow:0 0 0 ${vien}px ${mauVien};` }, cha);
    const im = K.html('img', { src, alt: '', draggable: 'false', style: `display:block;width:${d}px;height:${d}px;` }, khung);
    anhCho.push(im);
    return khung;
  }
  function nguonAnh(opt) { return opt.anh || (K.ANH_LOGO && K.ANH_LOGO.ngan_hang) || ''; }
  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }
  // Điểm viền hộp vuông góc, mỗi cạnh chia đoạn khoảng `buoc` px để nét tay run đều.
  function diemHCN(x, y, w, h, buoc) {
    const d = [];
    const canh = (x0, y0, x1, y1) => { const n = Math.max(1, Math.round(Math.hypot(x1 - x0, y1 - y0) / buoc)); for (let i = 0; i < n; i++) d.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); };
    canh(x, y, x + w, y); canh(x + w, y, x + w, y + h); canh(x + w, y + h, x, y + h); canh(x, y + h, x, y);
    d.push([x, y]);
    return d;
  }

  // ---------------- góc logo cảnh mở ----------------
  K.logo_goc = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu || 'phang';
    const X = opt.x != null ? opt.x : 40, Y = opt.y != null ? opt.y : 24, D = opt.co || 60;
    const vao = opt.vao || 0, ra = opt.ra != null ? opt.ra : 3.6;
    const ten = opt.ten_kenh || TEN, hienTen = opt.hien_ten !== false;
    const coTen = Math.round(D * 0.4), mauNenTen = m.the, mauTen = duTuongPhan(m.chu, m.the, 4.5);
    const rongTen = hienTen ? Math.ceil(K.doChu(ten, coTen, 700)) + 44 : 0, caoTen = Math.round(D * 0.72);
    const el = K.html('div', { class: 'kho-logo-goc', style: `position:absolute;left:${X}px;top:${Y}px;width:${D + (hienTen ? 14 + rongTen : 0)}px;height:${D}px;font-family:${K.PHONG};pointer-events:none;` });
    const vongLogo = K.html('div', { style: `position:absolute;left:0;top:0;width:${D}px;height:${D}px;transform-origin:50% 50%;` }, el);
    anhLogo(vongLogo, D, nguonAnh(opt), 3, kieu === 'net_tay' ? m.vien : '#FFFFFF');
    let vienTay = null;
    if (kieu === 'net_tay') {
      vienTay = K.svg('svg', { width: D + 16, height: D + 16, style: 'position:absolute;left:-8px;top:-8px;overflow:visible;' }, vongLogo);
      const v = []; for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + (i / 40) * Math.PI * 2.08; v.push([D / 2 + 8 + Math.cos(a) * (D / 2 + 5), D / 2 + 8 + Math.sin(a) * (D / 2 + 5)]); }
      K.svg('path', { d: K.duongTay(v, { hat: 31, lech: 1.4 }), fill: 'none', stroke: m.vien, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, vienTay);
    }
    let theTen = null, chuTen = null, gach = null;
    if (hienTen) {
      theTen = K.html('div', { 'data-hop': '', style: `position:absolute;left:${D + 14}px;top:${Math.round((D - caoTen) / 2)}px;width:${rongTen}px;height:${caoTen}px;` +
        `border-radius:${Math.round(caoTen / 2)}px;background:${K.rgba(mauNenTen, 0.92)};overflow:hidden;` +
        (kieu === 'net_tay' ? '' : `box-shadow:0 4px 14px ${K.rgba('#000000', m.toi ? 0.35 : 0.12)};`) }, el);
      chuTen = K.html('div', { style: `position:absolute;left:22px;top:0;line-height:${caoTen}px;font-size:${coTen}px;font-weight:700;color:${mauTen};white-space:nowrap;` }, theTen, ten);
      if (kieu === 'net_tay') {
        const s = K.svg('svg', { width: rongTen + 8, height: caoTen + 8, style: `position:absolute;left:${D + 10}px;top:${Math.round((D - caoTen) / 2) - 4}px;overflow:visible;` }, el);
        gach = K.svg('path', { d: K.duongTay(diemHCN(4, 4, rongTen, caoTen, 26), { hat: 33, lech: 1.3 }), fill: 'none', stroke: m.vien, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, s);
      }
    }
    return {
      el,
      moc: { x: X, y: Y, rong: D + (hienTen ? 14 + rongTen : 0), cao: D, xong: vao + 0.9, het: ra },
      seek(t) {
        const u = t - vao, mo = K.hienAn(t, vao, ra, 0.35);
        el.style.opacity = mo.toFixed(3);
        el.style.visibility = mo <= 0.001 ? 'hidden' : 'visible';
        const s = 0.55 + 0.45 * K.spr(u, 0.5, 0.6);
        const nhay = u > 0.8 ? 1 + 0.03 * Math.sin((u - 0.8) * 2.2) * K.cl((ra - t) / 0.6) : 1;
        vongLogo.style.transform = `scale(${(s * nhay).toFixed(4)})`;
        if (theTen) {
          const p = K.eo3((u - 0.25) / 0.55);
          theTen.style.clipPath = `inset(0 ${((1 - p) * 100).toFixed(2)}% 0 0 round ${Math.round(caoTen / 2)}px)`;
          chuTen.style.transform = `translateX(${(-18 * (1 - p)).toFixed(2)}px)`;
          if (gach) K.veDan(gach, K.eio((u - 0.3) / 0.7));
        }
        el.style.transform = `translateY(${(-6 * (1 - K.cl((ra - t) / 0.35))).toFixed(2)}px)`;
      },
    };
  };

  // ---------------- màn hình kết 10 giây ----------------
  K.man_hinh_ket_kenh = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu || 'phang';
    const vao = opt.vao || 0, dai = opt.dai || 10;
    const ten = opt.ten_kenh || TEN;
    const loiMoi = opt.loi_moi != null ? opt.loi_moi : 'Đăng ký kênh';
    const nhanO = opt.nhan_o || ['Xem tiếp', 'Xem thêm'];
    const W = 1920, H = 1080;
    const el = K.html('div', { class: 'kho-ket-kenh', style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;font-family:${K.PHONG};overflow:hidden;` +
      (opt.nen !== false ? `background:${m.nen};` : '') });
    const lop = K.svg('svg', { width: W, height: H, style: 'position:absolute;left:0;top:0;overflow:visible;' }, el);

    // hàng logo + tên kênh, căn giữa
    const D = 168, coTen = K.coVua(ten, 1000, 76, 800, 48), coMoi = 32;
    const rongTen = Math.max(K.doChu(ten, coTen, 800), loiMoi ? K.doChu(loiMoi, coMoi, 500) : 0);
    const rongHang = D + 44 + rongTen, xHang = Math.round((W - rongHang) / 2), yHang = 112;
    const mauTen = duTuongPhan(m.chu, m.nen, 4.5), mauMoi = duTuongPhan(m.chu_phu, m.nen, 4.5), mauNhan = duTuongPhan(m.chu_phu, m.nen, 4.5);
    const vongLogo = K.html('div', { style: `position:absolute;left:${xHang}px;top:${yHang}px;width:${D}px;height:${D}px;transform-origin:50% 50%;` }, el);
    // vòng sáng sau logo (phẳng) hoặc vòng bút chì (nét tay)
    const cx = xHang + D / 2, cy = yHang + D / 2;
    let vongSang = null, vongTay = null;
    if (kieu === 'phang') {
      vongSang = K.svg('circle', { cx, cy, r: D / 2 + 14, fill: 'none', stroke: m.nhan, 'stroke-width': 4 }, lop);
    } else {
      const v = []; for (let i = 0; i <= 48; i++) { const a = -Math.PI * 0.6 + (i / 48) * Math.PI * 2.1; v.push([cx + Math.cos(a) * (D / 2 + 14), cy + Math.sin(a) * (D / 2 + 12)]); }
      vongTay = K.svg('path', { d: K.duongTay(v, { hat: 41, lech: 2 }), fill: 'none', stroke: m.nhan, 'stroke-width': 3.2, 'stroke-linecap': 'round' }, lop);
    }
    anhLogo(vongLogo, D, nguonAnh(opt), 5, kieu === 'net_tay' ? m.vien : '#FFFFFF');
    const khoiChu = K.html('div', { style: `position:absolute;left:${xHang + D + 44}px;top:${yHang}px;width:${Math.ceil(rongTen) + 4}px;height:${D}px;display:flex;flex-direction:column;justify-content:center;` }, el);
    const dongTen = K.html('div', { style: `font-size:${coTen}px;font-weight:800;line-height:${Math.round(coTen * 1.15)}px;color:${mauTen};white-space:nowrap;` }, khoiChu);
    const tuTen = ten.split(/\s+/).map((w, i) => K.html('span', { style: 'display:inline-block;' }, dongTen, w + (i < ten.split(/\s+/).length - 1 ? ' ' : '')));
    const kc = kieu === 'net_tay' ? 30 : 14;   // nét tay chừa chỗ cho nét gạch dưới tên kênh
    const dongMoi = loiMoi ? K.html('div', { style: `margin-top:${kc}px;font-size:${coMoi}px;font-weight:500;line-height:${Math.round(coMoi * 1.25)}px;color:${mauMoi};white-space:nowrap;` }, khoiChu, loiMoi) : null;
    let gachTen = null;
    if (kieu === 'net_tay') {
      const hTen = Math.round(coTen * 1.15), hKhoi = hTen + (loiMoi ? kc + Math.round(coMoi * 1.25) : 0);
      const yG = yHang + (D - hKhoi) / 2 + hTen + (loiMoi ? 12 : 6);
      gachTen = K.svg('path', { d: K.duongTay([[xHang + D + 44, yG], [xHang + D + 44 + K.doChu(ten, coTen, 800) * 0.5, yG + 3], [xHang + D + 44 + K.doChu(ten, coTen, 800), yG - 2]], { hat: 43, lech: 1.6 }),
        fill: 'none', stroke: m.nhan, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, lop);
    }

    // hai ô trống 16:9 cho phần tử Video của YouTube
    const OW = 800, OH = 450, OY = 400, OX = [120, 1000];
    const o = OX.map((x, i) => {
      const g = K.svg('g', null, lop);
      const nenO = K.svg('rect', { x, y: OY, width: OW, height: OH, rx: kieu === 'phang' ? 18 : 6, fill: m.nen_phu || K.tron(m.nen, m.chu, 0.08) }, g);
      let vien;
      if (kieu === 'phang') {
        vien = K.svg('rect', { x, y: OY, width: OW, height: OH, rx: 18, fill: 'none', stroke: K.rgba(m.chu_phu, 0.55), 'stroke-width': 3, 'stroke-dasharray': '18 12' }, g);
      } else {
        vien = K.svg('path', { d: K.duongTay(diemHCN(x, OY, OW, OH, 40), { hat: 51 + i * 7, lech: 2.2 }), fill: 'none', stroke: m.vien, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, g);
      }
      // nút phát mờ ở giữa ô (phần tử YouTube sẽ đè lên)
      const px = x + OW / 2, py = OY + OH / 2;
      const nut = K.svg('g', { opacity: 0.35 }, g);
      K.svg('circle', { cx: px, cy: py, r: 44, fill: 'none', stroke: m.chu_phu, 'stroke-width': 4 }, nut);
      K.svg('path', { d: `M${px - 14} ${py - 22} L${px + 24} ${py} L${px - 14} ${py + 22} Z`, fill: m.chu_phu }, nut);
      const nhan = nhanO[i] ? K.html('div', { style: `position:absolute;left:${x}px;top:${OY - 52}px;width:${OW}px;font-size:28px;font-weight:600;line-height:36px;color:${mauNhan};white-space:nowrap;` }, el, nhanO[i]) : null;
      return { g, nenO, vien, nut, nhan, x };
    });

    const T = { logo: 0.15, ten: 0.4, moi: 0.95, o: 1.0, nhan: 1.4 };
    return {
      el,
      moc: { logo: [cx, cy, D], o: OX.map((x) => [x, OY, OW, OH]), xong: vao + 2.2, het: vao + dai },
      seek(t) {
        const u = t - vao;
        el.style.opacity = K.eo3(u / 0.4).toFixed(3);
        el.style.visibility = u < 0 ? 'hidden' : 'visible';
        // logo lò xo vào, sau đó nhấp nhô nhẹ
        const s = 0.4 + 0.6 * K.spr(u - T.logo, 0.6, 0.55);
        const nho = u > 1.2 ? Math.sin((u - 1.2) * 1.3) * 5 : 0;
        vongLogo.style.transform = `translateY(${nho.toFixed(2)}px) scale(${s.toFixed(4)})`;
        if (vongSang) {
          const p = K.eo3((u - T.logo - 0.25) / 0.6);
          vongSang.setAttribute('r', (D / 2 + 14 + 2 * Math.sin(Math.max(0, u - 1.2) * 1.3)).toFixed(2));
          vongSang.setAttribute('cy', (cy + nho).toFixed(2));
          vongSang.setAttribute('opacity', (p * (0.75 + 0.25 * Math.sin(Math.max(0, u - 1.2) * 2.6))).toFixed(3));
        }
        if (vongTay) { K.veDan(vongTay, K.eio((u - T.logo - 0.2) / 0.8)); vongTay.setAttribute('transform', `translate(0 ${nho.toFixed(2)})`); }
        // tên kênh mọc từng từ, lời mời hiện sau
        tuTen.forEach((sp, i) => {
          const p = K.eo3((u - T.ten - i * 0.09) / 0.4);
          sp.style.opacity = p.toFixed(3);
          sp.style.transform = `translateY(${(22 * (1 - p)).toFixed(2)}px)`;
        });
        if (gachTen) K.veDan(gachTen, K.eio((u - T.ten - 0.5) / 0.6));
        if (dongMoi) { const p = K.eo3((u - T.moi) / 0.45); dongMoi.style.opacity = p.toFixed(3); dongMoi.style.transform = `translateY(${(12 * (1 - p)).toFixed(2)}px)`; }
        // hai ô: hiện lần lượt; viền nét đứt chạy chậm (phẳng) hoặc vẽ dần (nét tay)
        o.forEach((k, i) => {
          const a = T.o + i * 0.18, p = K.eo3((u - a) / 0.5);
          const sc = 0.94 + 0.06 * K.spr(u - a, 0.5, 0.7);
          k.g.setAttribute('opacity', p.toFixed(3));
          k.g.setAttribute('transform', `translate(${(k.x + OW / 2) * (1 - sc)} ${(OY + OH / 2) * (1 - sc)}) scale(${sc.toFixed(4)})`);
          if (kieu === 'phang') k.vien.setAttribute('stroke-dashoffset', (-Math.max(0, u - a) * 14).toFixed(2));
          else K.veDan(k.vien, K.eio((u - a) / 0.9));
          if (k.nhan) { const q = K.eo3((u - T.nhan - i * 0.18) / 0.4); k.nhan.style.opacity = q.toFixed(3); k.nhan.style.transform = `translateY(${(10 * (1 - q)).toFixed(2)}px)`; }
        });
      },
    };
  };
})();
