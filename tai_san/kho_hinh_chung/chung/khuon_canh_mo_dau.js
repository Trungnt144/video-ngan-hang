// chung/khuon_canh_mo_dau.js — 1.0 — khuôn cảnh mở đầu nhận diện loạt: câu hỏi hoặc câu niềm tin chữ lớn, tên thuật ngữ, dòng nhỏ tên loạt;
// biến thể gạch nửa câu niềm tin sai rồi hiện câu đúng.
// Tham số: bien_the 'cau_hoi' (mặc định) | 'gach_nua_cau'; cau (câu hỏi, biến thể cau_hoi); cau_dau, cau_sai, cau_dung (biến thể gạch: phần giữ,
//   phần bị gạch, câu thay); thuat_ngu (tên thuật ngữ, có thể bỏ trống); ten_loat (dòng nhỏ trên cùng, ví dụ "Chuyện nghề Ngân hàng · Thuật ngữ 12");
//   nhan_sai ('Hiểu lầm thường gặp', nhãn nhỏ của biến thể gạch); kieu 'phang' | 'net_tay'; mau; x, y, rong, cao (vùng đặt, mặc định 0, 0, 1920, 900:
//   chừa dải phụ đề); co (cỡ chữ câu lớn tối đa, 84; tự hạ tới 56 khi quá 3 dòng); vao (giây bắt đầu, 0); tinh (true: hiện đủ ngay);
//   moc_hien { loat, thuat_ngu, cau, gach, dung } giây tính từ lúc hình xuất hiện (bỏ trống thì tự tính theo vao).
// Dựng mới. Trả về { el, seek(t), moc: { cau: [x, y, rong, cao], thuat_ngu: [x, y], xong } } (xong: giây mọi phần đã hiện).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const m = K.tron(mau, dich, p); if (K.tuongPhan(m, nen) >= nguong) return m; }
    return dich;
  }
  // Đường gạch chéo tô bóng trong một hình tròn (nét bút chì).
  function gachTron(cx, cy, r, buoc, hat) {
    let d = '';
    for (let k = -r + buoc / 2, i = 0; k < r; k += buoc, i++) {
      const nua = Math.sqrt(Math.max(0, r * r - k * k)) * 0.96;
      const ux = Math.SQRT1_2, uy = -Math.SQRT1_2, px = cx + k * Math.SQRT1_2, py = cy + k * Math.SQRT1_2;
      d += K.duongTay([[px - ux * nua, py - uy * nua], [px + ux * nua, py + uy * nua]], { hat: hat + i, lech: 1.2 }) + ' ';
    }
    return d;
  }
  // Chia chuỗi thành các span từ (inline-block để dịch được); trả về mảng span.
  function datTu(cha, chuoi, kieuSpan) {
    const ds = [];
    String(chuoi || '').split(/\s+/).filter(Boolean).forEach((w) => {
      if (cha.childNodes.length) cha.appendChild(document.createTextNode(' '));
      const s = K.html('span', { style: 'display:inline-block;' + (kieuSpan || '') }, cha, w);
      ds.push(s);
    });
    return ds;
  }

  K.khuon_canh_mo_dau_cau_hoi = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu === 'net_tay' ? 'net_tay' : 'phang', gach = opt.bien_the === 'gach_nua_cau';
    const X = opt.x || 0, Y = opt.y || 0, W = opt.rong || 1920, H = opt.cao || 900;
    const vao = opt.tinh || opt.vao === -1 ? -100 : (opt.vao || 0);
    const nen = m.nen;
    const mauChu = duTuongPhan(m.chu, nen, 7), mauPhu = duTuongPhan(m.chu_phu, nen, 4.6), mauNhan = duTuongPhan(m.nhan, nen, 4.5);
    const mauSai = duTuongPhan(m.xau, nen, 4.5), mauDung = duTuongPhan(gach ? m.tot : m.nhan, nen, 4.5);

    const LE = Math.round(W * 0.073), coTrang = !gach;       // lề trái; biến thể câu hỏi chừa bên phải cho hình trang trí
    const rongCau = Math.round(W - LE * 2 - (coTrang ? W * 0.2 : 0));
    const cauDay = gach ? `${opt.cau_dau || ''} ${opt.cau_sai || ''}` : (opt.cau || '');
    let co = opt.co || 84;
    while (co > 56 && K.xuongDong(cauDay, rongCau, co, 800).length > 3) co -= 4;
    const soDong = K.xuongDong(cauDay, rongCau, co, 800).length, lh = Math.round(co * 1.2);
    const coDung = Math.round(co * 0.8), dongDung = gach ? K.xuongDong(opt.cau_dung || '', rongCau - coDung, coDung, 800).length : 0;
    const coThe = 40, caoThe = opt.thuat_ngu || gach ? coThe + 34 + 30 : 0;
    const caoKhoi = caoThe + soDong * lh + (gach ? 34 + dongDung * Math.round(coDung * 1.22) : 0);
    const tren = Math.max(Math.round(H * 0.2), Math.round((H - caoKhoi) / 2 + H * 0.03));

    const el = K.html('div', { class: 'kho-mo-dau', style: `position:absolute;left:${X}px;top:${Y}px;width:${W}px;height:${H}px;font-family:${K.PHONG};` });

    // ----- trang trí nền (SVG, không chữ) -----
    const nenSvg = K.svg('svg', { width: W, height: H, style: 'position:absolute;left:0;top:0;overflow:visible;' });
    el.appendChild(nenSvg);
    const loc = kieu === 'net_tay' ? K.locNetTay(nenSvg, { hat: 21, do_run: 1.8, tan_so: 0.03 }) : null;
    const tc = [Math.round(W * 0.82), Math.round(tren + caoKhoi * 0.45)], tr = Math.round(Math.min(H * 0.3, 250));
    const trangTri = K.svg('g', { filter: loc }, nenSvg);
    let vongTron = null, dauHoi = null, cham = [];
    if (coTrang) {
      if (kieu === 'phang') {
        vongTron = K.svg('circle', { cx: tc[0], cy: tc[1], r: tr, fill: m.nhat }, trangTri);
        K.svg('circle', { cx: tc[0], cy: tc[1], r: tr + 34, fill: 'none', stroke: m.nhan, 'stroke-width': 3, 'stroke-opacity': 0.35, 'stroke-dasharray': '4 14', 'stroke-linecap': 'round' }, trangTri);
      } else {
        vongTron = K.svg('path', { d: gachTron(tc[0], tc[1], tr, 16, 300), fill: 'none', stroke: m.nhan, 'stroke-width': 2.2, 'stroke-opacity': 0.5, 'stroke-linecap': 'round' }, trangTri);
        const vong = []; for (let i = 0; i <= 40; i++) { const a = (i / 40) * Math.PI * 2.08; vong.push([tc[0] + Math.cos(a) * tr, tc[1] + Math.sin(a) * tr]); }
        K.svg('path', { d: K.duongTay(vong, { hat: 77, lech: 3 }), fill: 'none', stroke: m.chu, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, trangTri);
      }
      // dấu hỏi lớn vẽ bằng đường (không phải chữ) để không đè chữ
      const s = tr / 120;
      const dq = `M${tc[0] - 52 * s} ${tc[1] - 52 * s} C ${tc[0] - 52 * s} ${tc[1] - 118 * s}, ${tc[0] + 56 * s} ${tc[1] - 118 * s}, ${tc[0] + 56 * s} ${tc[1] - 58 * s}` +
        ` C ${tc[0] + 56 * s} ${tc[1] - 18 * s}, ${tc[0]} ${tc[1] - 10 * s}, ${tc[0]} ${tc[1] + 30 * s}`;
      dauHoi = K.svg('path', { d: dq, fill: 'none', stroke: kieu === 'phang' ? m.nhan : m.chu, 'stroke-width': 26 * s, 'stroke-linecap': 'round' }, trangTri);
      cham = [K.svg('circle', { cx: tc[0], cy: tc[1] + 78 * s, r: 15 * s, fill: kieu === 'phang' ? m.nhan : m.chu }, trangTri)];
    }

    // ----- dòng tên loạt -----
    const loat = K.html('div', { style: `position:absolute;left:${LE}px;top:${Math.round(H * 0.1)}px;display:flex;align-items:center;gap:18px;white-space:nowrap;` }, el);
    const vach = K.html('div', { style: `width:56px;height:6px;border-radius:3px;background:${m.nhan};` }, loat);
    K.html('div', { style: `font-weight:600;font-size:28px;letter-spacing:0.04em;color:${mauPhu};` }, loat, opt.ten_loat || '');
    if (!opt.ten_loat) loat.style.display = 'none';

    // ----- khối chữ chính -----
    const khoi = K.html('div', { style: `position:absolute;left:${LE}px;top:${tren}px;width:${rongCau}px;` }, el);
    let the = null, theSvg = null, theVien = null;
    if (opt.thuat_ngu || gach) {
      const chuThe = gach ? (opt.nhan_sai || 'Hiểu lầm thường gặp') : opt.thuat_ngu;
      const mauNenThe = gach ? m.xau : m.nhan;
      const rongThe = Math.ceil(K.doChu(chuThe, coThe, 700)) + 56;
      if (kieu === 'phang') {
        the = K.html('div', { 'data-hop': '1', style: `position:relative;display:inline-block;height:${coThe + 34}px;box-sizing:border-box;padding:0 28px;border-radius:${(coThe + 34) / 2}px;` +
          `background:${mauNenThe};color:${K.chuTren(mauNenThe, '#FFFFFF', m.chu)};font-weight:700;font-size:${coThe}px;line-height:${coThe + 34}px;white-space:nowrap;` }, khoi, chuThe);
      } else {
        the = K.html('div', { 'data-hop': '1', style: `position:relative;display:inline-block;height:${coThe + 34}px;width:${rongThe}px;box-sizing:border-box;padding:0 28px;` +
          `color:${gach ? mauSai : mauNhan};font-weight:700;font-size:${coThe}px;line-height:${coThe + 34}px;white-space:nowrap;` }, khoi);
        theSvg = K.svg('svg', { width: rongThe, height: coThe + 34, style: 'position:absolute;left:0;top:0;overflow:visible;' });
        the.appendChild(theSvg);
        const h = coThe + 34, vong = [];
        for (let i = 0; i <= 36; i++) { const a = -Math.PI * 0.9 + (i / 36) * Math.PI * 2.1; vong.push([rongThe / 2 + Math.cos(a) * (rongThe / 2 + 6), h / 2 + Math.sin(a) * (h / 2 + 4)]); }
        theVien = K.svg('path', { d: K.duongTay(vong, { hat: 91, lech: 2 }), fill: 'none', stroke: gach ? m.xau : m.nhan, 'stroke-width': 3, 'stroke-linecap': 'round' }, theSvg);
        K.html('span', { style: 'position:relative;' }, the, chuThe);
      }
      the.style.marginBottom = '30px';
    }
    const cauEl = K.html('div', { style: `position:relative;font-weight:800;font-size:${co}px;line-height:${lh}px;color:${mauChu};letter-spacing:-0.01em;` }, khoi);
    const tuDau = datTu(cauEl, gach ? opt.cau_dau : opt.cau);
    const tuSai = gach ? datTu(cauEl, opt.cau_sai) : [];
    const tuCau = tuDau.concat(tuSai);
    // lớp gạch (SVG trong khối câu, toạ độ theo offsetLeft/offsetTop: không đổi theo transform)
    const lopGach = K.svg('svg', { width: rongCau, height: soDong * lh, style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;' });
    cauEl.appendChild(lopGach);
    const locGach = kieu === 'net_tay' ? K.locNetTay(lopGach, { hat: 13, do_run: 1.6, tan_so: 0.04 }) : null;
    const gachDuong = [];
    let dungEl = null, tuDung = [], muiDung = null;
    if (gach) {
      dungEl = K.html('div', { style: `position:relative;margin-top:34px;padding-left:${Math.round(coDung * 1.1)}px;font-weight:800;font-size:${coDung}px;line-height:${Math.round(coDung * 1.22)}px;color:${mauDung};` }, khoi);
      muiDung = K.html('span', { style: `position:absolute;left:0;top:0;display:inline-block;color:${mauDung};` }, dungEl, '→');
      tuDung = datTu(dungEl, opt.cau_dung);
      // muiDung là ký tự đầu dòng: nằm ngoài dòng chữ, không đè chữ
      muiDung.remove(); dungEl.insertBefore(muiDung, dungEl.firstChild);
    }
    // gạch chân câu hỏi (biến thể câu hỏi)
    const gachChan = K.svg('path', { fill: 'none', stroke: m.nhan, 'stroke-width': kieu === 'phang' ? 8 : 5, 'stroke-linecap': 'round', filter: locGach }, lopGach);

    // ----- mốc thời gian -----
    const mh = opt.moc_hien || {};
    const tLoat = mh.loat != null ? mh.loat : vao, tThe = mh.thuat_ngu != null ? mh.thuat_ngu : vao + 0.3;
    const tCau = mh.cau != null ? mh.cau : vao + 0.6, nhipTu = 0.055;
    const tGach = mh.gach != null ? mh.gach : tCau + tuCau.length * nhipTu + 1.4;
    const tDung = mh.dung != null ? mh.dung : tGach + 0.7;
    const xong = gach ? tDung + tuDung.length * nhipTu + 0.4 : tCau + tuCau.length * nhipTu + 0.9;

    function hienTu(s, t0) {
      const a = K.eo3(K.tienDo(t, t0, 0.32)), y = Math.round((1 - K.eob(K.tienDo(t, t0, 0.42), 1.2)) * 26);
      s.style.opacity = a.toFixed(3); s.style.transform = `translateY(${y}px)`;
    }
    let t = 0;
    // nhóm span theo dòng (offsetTop) → các đoạn [x0, x1, y]
    function doanTheoDong(ds) {
      const dong = [];
      ds.forEach((s) => {
        const y = s.offsetTop, x0 = s.offsetLeft, x1 = x0 + s.offsetWidth;
        const d = dong.find((v) => Math.abs(v[2] - y) < 4);
        if (d) { d[0] = Math.min(d[0], x0); d[1] = Math.max(d[1], x1); } else dong.push([x0, x1, y]);
      });
      return dong;
    }

    function seek(tt) {
      t = tt;
      const aL = K.eo3(K.tienDo(t, tLoat, 0.4));
      loat.style.opacity = aL.toFixed(3); vach.style.width = Math.round(8 + 48 * K.eio(K.tienDo(t, tLoat, 0.6))) + 'px';
      if (the) {
        const a = K.eo3(K.tienDo(t, tThe, 0.3));
        the.style.opacity = a.toFixed(3); the.style.transform = `translateX(${Math.round((1 - K.spr(t - tThe, 0.45, 0.6)) * -30)}px)`;
        if (theVien) K.veDan(theVien, K.eio(K.tienDo(t, tThe + 0.15, 0.6)));
      }
      tuCau.forEach((s, i) => hienTu(s, tCau + i * nhipTu));
      // trang trí: hiện cùng câu, sau đó thở nhẹ (đổi thuộc tính hình, không phóng chữ)
      if (coTrang) {
        const a = K.eo3(K.tienDo(t, tCau, 0.6));
        trangTri.setAttribute('opacity', a.toFixed(3));
        if (kieu === 'phang') vongTron.setAttribute('r', (tr * (0.9 + 0.1 * K.spr(t - tCau, 0.6, 0.55)) + 4 * Math.sin((t - tCau) * 1.6) * a).toFixed(2));
        else K.veDan(vongTron, K.eio(K.tienDo(t, tCau + 0.1, 1.2)));
        K.veDan(dauHoi, K.eio(K.tienDo(t, tCau + 0.25, 0.7)));
        const nhay = 1 + 0.12 * Math.max(0, Math.sin((t - tCau - 1.2) * 2.4)) * K.tienDo(t, tCau + 1.2, 0.3);
        cham.forEach((c) => c.setAttribute('r', (15 * (tr / 120) * nhay * K.eob(K.tienDo(t, tCau + 0.85, 0.35))).toFixed(2)));
      }
      // gạch chân câu hỏi dưới dòng cuối / gạch ngang phần sai
      if (!gach) {
        const dong = doanTheoDong(tuCau), cuoi = dong[dong.length - 1];
        if (cuoi) {
          const y = cuoi[2] + lh - Math.round(co * 0.08), x1 = Math.min(cuoi[1], cuoi[0] + Math.max(260, (cuoi[1] - cuoi[0]) * 0.55));
          const d = kieu === 'phang' ? `M${cuoi[0] + 4} ${y} L${x1} ${y}` : K.duongTay([[cuoi[0], y + 2], [(cuoi[0] + x1) / 2, y - 3], [x1, y + 1]], { hat: 17, lech: 2 });
          if (gachChan.getAttribute('d') !== d) { gachChan.setAttribute('d', d); gachChan._kho_dai = null; }
          K.veDan(gachChan, K.eio(K.tienDo(t, tCau + tuCau.length * nhipTu + 0.1, 0.55)));
        }
      } else {
        gachChan.style.display = 'none';
        const dong = doanTheoDong(tuSai);
        while (gachDuong.length < dong.length) gachDuong.push(K.svg('path', { fill: 'none', stroke: m.xau, 'stroke-width': kieu === 'phang' ? 9 : 6, 'stroke-linecap': 'round', filter: locGach }, lopGach));
        let tong = 0; dong.forEach((v) => { tong += v[1] - v[0]; });
        let daQua = 0;
        const p = K.eio(K.tienDo(t, tGach, 0.45 + 0.25 * dong.length));
        dong.forEach((v, i) => {
          const y = v[2] + Math.round(lh * 0.56);
          const d = kieu === 'phang' ? `M${v[0] - 6} ${y} L${v[1] + 6} ${y - 4}` : K.duongTay([[v[0] - 8, y + 3], [(v[0] + v[1]) / 2, y - 2], [v[1] + 8, y - 5]], { hat: 50 + i, lech: 2.4 });
          const g = gachDuong[i];
          if (g.getAttribute('d') !== d) { g.setAttribute('d', d); g._kho_dai = null; }
          const w = v[1] - v[0];
          K.veDan(g, K.cl((p * tong - daQua) / w)); daQua += w;
        });
        const mo = K.tienDo(t, tGach + 0.2, 0.4);
        tuSai.forEach((s) => { s.style.color = K.tron(mauChu, mauSai, mo); if (mo > 0) s.style.opacity = (1 - 0.35 * mo).toFixed(3); });
        tuDung.forEach((s, i) => hienTu(s, tDung + 0.15 + i * nhipTu));
        const aM = K.eo3(K.tienDo(t, tDung, 0.3));
        muiDung.style.opacity = aM.toFixed(3); muiDung.style.transform = `translateX(${Math.round((1 - aM) * -24 + 4 * Math.sin((t - tDung) * 2.2) * K.tienDo(t, xong, 0.5))}px)`;
      }
    }

    return {
      el, seek,
      moc: { cau: [X + LE, Y + tren + caoThe, rongCau, soDong * lh], thuat_ngu: [X + LE, Y + tren], trang_tri: coTrang ? [X + tc[0], Y + tc[1], tr] : null, xong },
    };
  };
})();
