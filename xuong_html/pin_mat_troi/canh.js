// canh.js — pin_mat_troi, khuôn trang ảnh nền Muse (08/11/2026). Dòng thời gian thử 16 giây, chưa có giọng.
// Mỗi cảnh: KHO.nenAnh.canh(id) cho lớp ảnh và lớp cơ chế; cơ chế vẽ bằng toạ độ S.vung('<tên vùng neo>') của phiếu,
// không ghi cứng điểm ảnh, để khi Muse gửi ảnh mới (hoặc phiếu dời vùng) chỉ cần nhúng lại phiếu.
// Mọi giá trị là hàm thuần của t (hợp đồng skill dung-video-html): window.seek(t).
(function () {
  'use strict';
  const K = window.KHO;
  const N = (window.N = {});
  const stage = document.getElementById('stage');
  const NA = K.nenAnh;
  const DUR = 16;
  const cl = K.cl, eio = K.eio, lerp = K.lerp;
  const MAU = () => NA.phieu().mau_co_che;
  const CANH = []; // { el, tu, den, seek }

  // ---------- cảnh 1 (0–4 giây): tấm pin nguyên tấm, dùng lại hero.webp ----------
  function canhHero() {
    const el = K.html('div', { class: 'canh' }, stage);
    const S = NA.canh('nen_hero', el, { may_quay: [{ t: 0, s: 1 }, { t: 4, s: 1.06, tam: 'mat_tam_pin' }] });
    K.html('div', { class: 'day-phu-de' }, el);
    const nhan = K.html('div', { class: 'nhan' }, S.ngoai, 'Tấm pin mặt trời');
    const v = S.vung('mat_tam_pin');
    return { el, tu: 0, den: 4, seek(t) {
      S.seek(t);
      const [x, y] = S.raManHinh([v.cx, v.y1 + 40], t);
      nhan.style.left = x + 'px'; nhan.style.top = y + 'px';
      nhan.style.opacity = K.hienAn(t, 0.6, 4, 0.4);
    } };
  }

  // ---------- cảnh 2 (4–16 giây): mặt cắt, bốn biến thể, lớp cơ chế theo vùng neo ----------
  function canhMatCat() {
    const el = K.html('div', { class: 'canh' }, stage);
    const T0 = 4;
    const S = NA.canh('nen_mat_cat', el, {
      lich: [
        { t: T0, bien_the: 'nguyen_ven' },
        { t: T0 + 3, bien_the: 'nong_cam', mo: 0.8 },
        { t: T0 + 6, bien_the: 'mep_khung_xanh_dien', mo: 0.8 },
        { t: T0 + 9, bien_the: 'kinh_anh_tim', mo: 0.8 },
      ],
      may_quay: [{ t: T0, s: 1 }, { t: T0 + 9, s: 1 }, { t: T0 + 11.5, s: 1.5, tam: 'lop_phu_be_mat' }],
    });
    K.html('div', { class: 'day-phu-de' }, el);
    const M = MAU();
    const kinh = S.vung('kinh'), si = S.vung('de_silicon'), mep = S.vung('mep_khung'), phu = S.vung('lop_phu_be_mat'), khung = S.vung('khung_nhom');
    const NG = K.ngauNhien(7);

    // (a) nắng và nhiệt: điểm bẫy (vòng cam) hiện dần trong đế silicon
    const gBay = K.svg('g', {}, S.svg);
    const bay = [];
    for (let i = 0; i < 18; i++) {
      const c = K.svg('circle', { cx: si.x1 + 40 + NG(i) * (si.w - 80), cy: si.y1 + 25 + NG(i + 50) * (si.h - 50), r: 11, fill: 'none', stroke: M.nang_va_nhiet, 'stroke-width': 5 }, gBay);
      bay.push(c);
    }
    // (b) điện áp cao: ion natri đi từ kính xuống tế bào, chỉ trong vùng mep_khung
    const gIon = K.svg('g', {}, S.svg);
    const ion = [];
    for (let i = 0; i < 14; i++) {
      const x = mep.x1 + 20 + NG(i + 100) * (mep.w - 40);
      const c = K.svg('circle', { cx: x, cy: kinh.y1, r: 9, fill: M.dien_ap_cao, stroke: '#FFFFFF', 'stroke-width': 2.5 }, gIon);
      ion.push({ c, x, tre: NG(i + 200) * 1.6 });
    }
    const muiTen = K.svg('path', { d: `M ${khung.x2 + 30} ${kinh.y1 + 10} L ${khung.x2 + 30} ${si.y1 + 40}`, stroke: M.dien_ap_cao, 'stroke-width': 7, fill: 'none', 'marker-end': 'url(#mt_dien)' }, gIon);
    const defs = K.defs(S.svg);
    const mk = K.svg('marker', { id: 'mt_dien', viewBox: '0 0 10 10', refX: 5, refY: 5, markerWidth: 4, markerHeight: 4, orient: 'auto' }, defs);
    K.svg('path', { d: 'M0,0 L10,5 L0,10 z', fill: M.dien_ap_cao }, mk);
    // (c) tia cực tím: vạch tím đi xuống tới lớp phủ, liên kết đứt dần (gạch tím trên lớp phủ mờ đi)
    const gUv = K.svg('g', {}, S.svg);
    const tia = [], lk = [];
    for (let i = 0; i < 7; i++) {
      const x = phu.x1 + 110 + i * ((phu.w - 220) / 6);
      tia.push({ el: K.svg('line', { x1: x, y1: kinh.y1 - 90, x2: x, y2: kinh.y1 - 90, stroke: M.tia_cuc_tim, 'stroke-width': 6, 'stroke-linecap': 'round' }, gUv), x, tre: i * 0.12 });
      lk.push(K.svg('rect', { x: x - 26, y: phu.y1 + 3, width: 52, height: phu.h - 6, rx: 3, fill: '#FFFFFF' }, gUv));
    }
    const nhan = K.html('div', { class: 'nhan' }, S.ngoai, '');
    const CHU = [[T0, 'Mặt cắt tấm pin'], [T0 + 3, 'Nắng và nhiệt: điểm bẫy trong đế'], [T0 + 6, 'Điện áp cao: ion natri ở mép khung'], [T0 + 9, 'Tia cực tím: lớp thụ động']];

    return { el, tu: T0, den: DUR, seek(t) {
      S.seek(t);
      // điểm bẫy: 7–10 giây
      const pB = cl((t - (T0 + 3.3)) / 2) * (1 - cl((t - (T0 + 5.8)) / 0.4));
      bay.forEach((c, i) => c.setAttribute('opacity', cl(pB * 18 - i)));
      // ion: 10–13 giây
      const tI = t - (T0 + 6.3);
      gIon.setAttribute('opacity', cl(tI / 0.3) * (1 - cl((t - (T0 + 8.8)) / 0.4)));
      ion.forEach((o) => { const p = eio(cl((tI - o.tre) / 1.2)); o.c.setAttribute('cy', lerp(kinh.y1 + 10, si.y1 + 20, p)); });
      // tia cực tím: 13–16 giây
      const tU = t - (T0 + 9.3);
      gUv.setAttribute('opacity', cl(tU / 0.3));
      tia.forEach((o, i) => { const p = eio(cl((tU - o.tre) / 0.8)); o.el.setAttribute('y2', lerp(kinh.y1 - 90, phu.y1, p)); lk[i].setAttribute('opacity', 1 - 0.85 * cl((tU - o.tre - 0.8) / 1.2)); });
      // nhãn đặt theo toạ độ màn hình (không phóng theo máy quay)
      let cu = CHU[0]; for (const c of CHU) if (c[0] <= t) cu = c;
      nhan.textContent = cu[1];
      const [x, y] = S.raManHinh([kinh.cx, kinh.y1 - 110], t);
      nhan.style.left = cl(x, 420, 1500) + 'px'; nhan.style.top = Math.max(y, 90) + 'px';
      nhan.style.opacity = K.hienAn(t, cu[0] + 0.2, null, 0.3);
    } };
  }

  function seek(t) {
    t = cl(t, 0, DUR);
    for (const c of CANH) {
      const on = t >= c.tu && (t < c.den || (c.den === DUR && t <= DUR));
      c.el.style.display = on ? 'block' : 'none';
      if (on) c.seek(t);
    }
  }
  window.seek = seek;

  function fit() { const s = Math.min(innerWidth / 1920, innerHeight / 1080); stage.style.transform = `scale(${s})`; }
  const QS = new URLSearchParams(location.search);
  const FIXED = QS.has('t') ? parseFloat(QS.get('t')) : null;
  N.start = async function () {
    await K.napPhong();
    await NA.nap();
    fit(); addEventListener('resize', fit);
    CANH.push(canhHero(), canhMatCat());
    window.__san_sang = true;
    if (FIXED != null) { seek(FIXED); return; }
    const t0 = performance.now();
    const tick = () => { const t = (performance.now() - t0) / 1000; seek(t); if (t < DUR) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  };
})();
