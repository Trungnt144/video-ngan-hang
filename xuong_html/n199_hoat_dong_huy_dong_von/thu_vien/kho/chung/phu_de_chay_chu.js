// chung/phu_de_chay_chu.js — 1.0 — phụ đề chạy chữ hai dòng ở dải dưới khung (900–1080), tô màu từ đang đọc theo mốc thời gian từng từ.
// Tham số: cau [{chu, t, den, tu:[{chu,t,den}]}] (nhận cả bd/kt thay t/den) hoặc chuong [{cau:[...]}] theo thoi_gian.json của video;
//   kieu 'phang' | 'net_tay'; mau (ghi đè khoá màu); co 38 (cỡ chữ, tự hạ tới co_toi_thieu 32 khi dòng quá rộng); rong 1720 (bề ngang tối đa);
//   rong_mot_dong 1560 (rộng hơn thì chia hai dòng); day 1040 (mép dưới hộp, toạ độ khung); lech 0 (giây cộng vào t trước khi tra mốc:
//   trang gọi seek(t) với t tính từ lúc phụ đề có mặt, nếu mốc trong file là giờ video thì đặt lech bằng giờ video lúc gắn phụ đề).
// Gom từ xuong_html/2026.10.28_cic_la_gi/trang.html:1087-1146 (chiaDong, dungPhuDe, vePhuDe); bỏ mã màu cứng #09233D, #6657FC → khoá chu, nhan.
// Trả về { el, seek(t), moc: { tren, day, trang } }: tren là mép trên dải phụ đề (900) để trang tránh đặt hình đè lên.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  // Đẩy màu chữ ra xa nền tới khi tương phản đạt ngưỡng (nên gom vào kho_nen.js: KHO.duTuongPhan).
  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const m = K.tron(mau, dich, p); if (K.tuongPhan(m, nen) >= nguong) return m; }
    return dich;
  }

  const DON_VI = /^(đồng|USD|%|triệu|tỷ|nghìn|ngàn|tháng|năm|ngày|lần|điểm)[,.;:!?]?$/i;
  const SO_TRUOC = /^(tháng|năm|ngày|trong|tối|nhóm|điều|khoản|số|kỳ|lần)$/i;

  // Gom từ của một câu; câu thiếu mốc từ thì chia đều thời lượng câu theo số ký tự.
  function tuCua(c) {
    const t0 = c.t != null ? c.t : c.bd, t1 = c.den != null ? c.den : c.kt;
    if (c.tu && c.tu.length) return c.tu.map((w) => ({ chu: w.chu, t: w.t != null ? w.t : w.bd, den: w.den != null ? w.den : w.kt }));
    const ds = String(c.chu).split(/\s+/).filter(Boolean), tong = ds.reduce((s, w) => s + w.length + 1, 0);
    let dem = 0;
    return ds.map((w) => { const a = t0 + (t1 - t0) * dem / tong; dem += w.length + 1; return { chu: w, t: a, den: t0 + (t1 - t0) * dem / tong }; });
  }

  K.phu_de_chay_chu = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu === 'net_tay' ? 'net_tay' : 'phang';
    const CO = opt.co || 38, CO_MIN = opt.co_toi_thieu || 32, RONG = opt.rong || 1720, RONG1 = opt.rong_mot_dong || 1560;
    const DAY = opt.day != null ? opt.day : 1040, LECH = opt.lech || 0, DAM = 600;
    const doDong = (ws, co) => K.doChu(ws.map((w) => w.chu).join(' '), co, DAM);

    // ----- chia dòng: tối đa hai dòng, cân độ dài, không tách số khỏi đơn vị, không tách "Ngân hàng" khỏi "A" -----
    function catDuoc(ws, k) {
      const truoc = ws[k - 1].chu, sau = ws[k].chu;
      if (/\d/.test(truoc) && !/[,.:;]$/.test(truoc)) return false;
      if (/^\d/.test(sau) && SO_TRUOC.test(truoc)) return false;
      if (/^[A-ZĐ][,.]?$/.test(sau)) return false;
      if (/^(triệu|tỷ|nghìn|ngàn)$/i.test(truoc) && DON_VI.test(sau)) return false;
      return true;
    }
    function chiaDong(ws) {
      if (doDong(ws, CO) <= RONG1 || ws.length < 4) return [ws];
      let tot = null;
      for (let k = 2; k <= ws.length - 2; k++) {
        if (!catDuoc(ws, k)) continue;
        const la = doDong(ws.slice(0, k), CO), lb = doDong(ws.slice(k), CO);
        const truoc = ws[k - 1].chu;
        const diem = Math.abs(la - lb) - (/,$/.test(truoc) ? 260 : 0) - (/[:;]$/.test(truoc) ? 180 : 0);
        if (!tot || diem < tot.diem) tot = { diem, k };
      }
      return tot ? [ws.slice(0, tot.k), ws.slice(tot.k)] : [ws];
    }
    // một trang hai dòng còn quá rộng ở cỡ tối thiểu thì cắt trang ở dấu phẩy gần giữa (không có phẩy thì cắt giữa)
    function chiaTrang(ws) {
      const dong = chiaDong(ws);
      const rongNhat = Math.max(...dong.map((d) => doDong(d, CO_MIN)));
      if (rongNhat <= RONG || ws.length < 6) return [ws];
      const tong = ws.reduce((s, w) => s + w.chu.length + 1, 0);
      let tot = null, dem = 0;
      for (let k = 2; k < ws.length - 2; k++) {
        dem += ws[k - 1].chu.length + 1;
        if (!catDuoc(ws, k)) continue;
        const diem = Math.abs(dem - tong / 2) - (/[,;:]$/.test(ws[k - 1].chu) ? tong * 0.3 : 0);
        if (!tot || diem < tot.diem) tot = { diem, k };
      }
      const k = tot ? tot.k : Math.floor(ws.length / 2);
      return chiaTrang(ws.slice(0, k)).concat(chiaTrang(ws.slice(k)));
    }

    const dsCau = opt.cau || [].concat(...(opt.chuong || []).map((c) => c.cau || []));
    const TRANG = [];
    for (const c of dsCau) {
      const ws = tuCua(c), cDen = c.den != null ? c.den : c.kt;
      const trang = chiaTrang(ws);
      trang.forEach((tw, j) => {
        const dong = chiaDong(tw);
        const rongNhat = Math.max(...dong.map((d) => doDong(d, CO)));
        const co = rongNhat > RONG ? Math.max(CO_MIN, Math.floor(CO * RONG / rongNhat)) : CO;
        TRANG.push({ t: tw[0].t, den: j === trang.length - 1 ? cDen : trang[j + 1][0].t, dong, co });
      });
    }
    TRANG.sort((a, b) => a.t - b.t);

    // ----- dựng DOM -----
    const nenHop = kieu === 'net_tay' ? m.giay : m.the;
    const mauChu = duTuongPhan(m.chu, nenHop, 7), mauDang = duTuongPhan(m.nhan, nenHop, 4.5);
    const el = K.html('div', { class: 'kho-phu-de', style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;pointer-events:none;' });
    const hop = K.html('div', {
      'data-hop': '1',
      style: `position:absolute;left:960px;bottom:${1080 - DAY}px;box-sizing:border-box;padding:9px 38px 12px;` +
        `font-family:${K.PHONG};font-weight:${DAM};text-align:center;color:${mauChu};opacity:0;` +
        (kieu === 'phang'
          ? `background:${K.rgba(m.the, 0.93)};border-radius:16px;border:1px solid ${K.rgba(m.chu, 0.1)};border-bottom:4px solid ${m.nhan};`
          : 'background:transparent;'),
    }, el);
    let nenGiay = null, gach = null, svg = null;
    if (kieu === 'net_tay') {
      svg = K.svg('svg', { style: 'position:absolute;left:0;top:0;overflow:visible;pointer-events:none;' });
      hop.appendChild(svg);
      nenGiay = K.svg('path', { fill: K.rgba(m.giay, 0.9), stroke: m.chu, 'stroke-width': 1.6, 'stroke-opacity': 0.55, 'stroke-linejoin': 'round' }, svg);
      gach = K.svg('path', { fill: 'none', stroke: m.nhan, 'stroke-width': 4.5, 'stroke-linecap': 'round', opacity: 0.9 }, svg);
      gach.setAttribute('filter', K.locNetTay(svg, { hat: 11, do_run: 1.3, tan_so: 0.05 }));
    }
    const dongEl = [0, 1].map(() => K.html('div', { style: 'position:relative;white-space:nowrap;' }, hop));

    let khoa = -1, spans = [], hopRong = 0, hopCao = 0;
    function dungTrang(i) {
      if (khoa === i) return;
      khoa = i;
      const p = TRANG[i], dong = p.dong.length === 1 ? [null, p.dong[0]] : p.dong;
      spans = [];
      dong.forEach((d, j) => {
        const L = dongEl[j];
        L.style.display = d ? 'block' : 'none';
        L.style.fontSize = p.co + 'px'; L.style.lineHeight = Math.round(p.co * 1.32) + 'px';
        L.textContent = '';
        if (d) d.forEach((w, k) => {
          if (k) L.appendChild(document.createTextNode(' '));
          const s = K.html('span', { style: 'position:relative;' }, L, w.chu); s._w = w; spans.push(s);
        });
      });
      // khung giấy nét tay đo theo bề ngang chữ (đo bằng canvas, cùng kết quả mọi lần)
      const rongChu = Math.max(...p.dong.map((d) => doDong(d, p.co)));
      hopRong = Math.ceil(rongChu) + 84; hopCao = Math.round(p.co * 1.32) * p.dong.length + 21;
      hop.style.width = hopRong + 'px'; hop.style.left = (960 - Math.round(hopRong / 2)) + 'px';
      if (kieu === 'net_tay') {
        svg.setAttribute('width', hopRong); svg.setAttribute('height', hopCao);
        const ng = K.ngauNhien(31 + i), W = hopRong, H = hopCao;
        const diem = [[2, 4 + ng(1) * 4], [W * 0.33, ng(2) * 5], [W * 0.66, 3 + ng(3) * 4], [W - 2, ng(4) * 5],
          [W - 4 + ng(5) * 4, H - 3], [W * 0.5, H - ng(6) * 4], [ng(7) * 4, H - 2]];
        nenGiay.setAttribute('d', K.duongTay(diem, { hat: 40 + i, lech: 1.4, dong: true }) + ' Z');
      }
    }

    function seek(tNgoai) {
      const t = tNgoai + LECH;
      let i = -1;
      for (let k = 0; k < TRANG.length; k++) if (TRANG[k].t - 0.05 <= t) i = k;
      if (i < 0) { hop.style.opacity = 0; return; }
      const p = TRANG[i], ke = TRANG[i + 1], het = Math.min(ke ? ke.t - 0.05 : 1e9, p.den + 1.0);
      if (t >= het) { hop.style.opacity = 0; return; }
      dungTrang(i);
      hop.style.opacity = Math.min(K.eo3((t - (p.t - 0.05)) / 0.12), 1 - K.eo3((t - (het - 0.2)) / 0.2)).toFixed(3);
      let dang = null;
      spans.forEach((s, k) => {
        const w = s._w, nx = spans[k + 1] ? spans[k + 1]._w.t : w.den + 0.2;
        if (t < w.t) { s.style.opacity = 0.45; s.style.color = mauChu; }
        else if (t < Math.max(nx, w.den)) { s.style.opacity = 1; s.style.color = mauDang; dang = s; }
        else { s.style.opacity = 1; s.style.color = mauChu; }
      });
      if (kieu === 'net_tay') {
        if (dang) {
          // gạch chân bút chì dưới từ đang đọc, vẽ dần trong thời lượng của từ
          const r0 = hop.getBoundingClientRect(), r = dang.getBoundingClientRect(), tl = r0.width / (hop.offsetWidth || 1) || 1;
          const x0 = (r.left - r0.left) / tl, x1 = (r.right - r0.left) / tl, y = (r.bottom - r0.top) / tl - 4;
          const k = spans.indexOf(dang), d = K.duongTay([[x0 - 2, y + 1], [(x0 + x1) / 2, y + 2.5], [x1 + 3, y]], { hat: 60 + k, lech: 1.1 });
          if (gach.getAttribute('d') !== d) { gach.setAttribute('d', d); gach._kho_dai = null; }
          const w = dang._w;
          K.veDan(gach, K.eo3(K.tienDo(t, w.t, Math.max(0.12, (w.den - w.t) * 0.9))));
          gach.style.display = '';
        } else gach.style.display = 'none';
      }
    }

    return { el, seek, moc: { tren: 900, day: DAY, trang: TRANG.length } };
  };
})();
