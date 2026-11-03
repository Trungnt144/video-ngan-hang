// chung/nhan_gia_dinh.js — 1.0 — nhãn nhỏ "ví dụ giả định" gắn cạnh mọi con số giả định: nhãn rời, nhãn góc khung, nhãn đi kèm một con số.
// Tham số: chu ('ví dụ giả định'); bien_the 'nhan' (đặt ở x, y) | 'goc' (cố định góc trên phải, cach_phai 64, cach_tren 56) | 'kem_so' (con số lớn kèm nhãn);
//   x, y (góc trên trái, toạ độ khung 1920×1080); co (24, cỡ chữ nhãn); kieu 'phang' | 'net_tay'; mau; vao (giây bắt đầu hiện, mặc định 0); tinh (true: hiện đủ ngay).
//   Riêng 'kem_so': so (chuỗi hiện sẵn) hoặc gia_tri (số, đếm lên trong dem_giay 0,9 s) với dang 'tien' (KHO.soTien) | 'so' (KHO.so) và don_vi;
//   nhan_so (dòng chữ nhỏ trên con số, ví dụ "Số tiền vay"); co_so (64); mau_so (khoá màu của con số: 'nhan' mặc định).
// Chọn kiểu từ 7 bản lô 1: viền đứt nét bo tròn (gần N82 NhanMinhHoa, N122 NhanGiaDinh), chữ thường cỡ 24 màu chu_phu.
//   Lý do: viền đứt nét tự nói "không phải số thật"; không tô khối đặc như N96 #so_gia_dinh, N108 .tag nên không tranh mắt với con số chính;
//   đọc được trên cả nền sáng và tối; chữ thường gọn hơn chữ in hoa N122 ("SỐ LIỆU GIẢ ĐỊNH") ở cỡ nhỏ.
// Trả về { el, seek(t), moc: { x, y, rong, cao, nhan: [x, y, rong, cao] } }.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1; p += 0.05) { const m = K.tron(mau, dich, p); if (K.tuongPhan(m, nen) >= nguong) return m; }
    return dich;
  }

  // Dựng một viên nhãn (HTML) có viền phẳng hoặc viền bút chì. Trả về { el, rong, cao }.
  function vienNhan(m, kieu, chu, co, hat) {
    const DAM = 600, padX = Math.round(co * 0.75), padY = Math.round(co * 0.34);
    const rong = Math.ceil(K.doChu(chu, co, DAM) + padX * 2 + co * 0.9 + co * 0.36 + 6), cao = Math.round(co * 1.3) + padY * 2;
    const nen = kieu === 'net_tay' ? K.tron(m.giay, m.nhat, 0.75) : m.the, mauChu = duTuongPhan(m.chu_phu, nen, 4.6);
    const el = K.html('div', {
      'data-hop': '1',
      style: `position:absolute;left:0;top:0;width:${rong}px;height:${cao}px;box-sizing:border-box;display:flex;align-items:center;` +
        `padding:0 ${padX}px;gap:${Math.round(co * 0.36)}px;font:${DAM} ${co}px/${Math.round(co * 1.3)}px ${K.PHONG};color:${mauChu};white-space:nowrap;` +
        (kieu === 'phang' ? `background:${K.rgba(nen, 0.94)};border:2px dashed ${K.rgba(mauChu, 0.7)};border-radius:${cao / 2}px;box-shadow:0 3px 10px rgba(0,0,0,${m.toi ? 0.3 : 0.06});` : ''),
    });
    if (kieu === 'net_tay') {
      const s = K.svg('svg', { width: rong, height: cao, style: 'position:absolute;left:0;top:0;overflow:visible;' });
      el.appendChild(s);
      const r = cao / 2, diem = [];
      for (let i = 0; i <= 16; i++) { const a = Math.PI / 2 + Math.PI * i / 16; diem.push([r + Math.cos(a) * (r - 2), r - Math.sin(a) * (r - 2)]); }
      for (let i = 0; i <= 16; i++) { const a = -Math.PI / 2 + Math.PI * i / 16; diem.push([rong - r + Math.cos(a) * (r - 2), r - Math.sin(a) * (r - 2)]); }
      // nền loang màu nhấn nhạt, viền bút chì hai lượt: một lượt liền mảnh, một lượt đứt nét
      K.svg('path', { d: K.duongTay(diem, { hat, lech: 2.2, dong: true }) + 'Z', fill: K.rgba(m.nhat, 0.75), stroke: 'none' }, s);
      K.svg('path', { d: K.duongTay(diem, { hat: hat + 1, lech: 1.3, dong: true }), fill: 'none', stroke: mauChu, 'stroke-width': 1.2, 'stroke-opacity': 0.55, 'stroke-linecap': 'round' }, s);
      K.svg('path', { d: K.duongTay(diem, { hat: hat + 2, lech: 1.0, dong: true }), fill: 'none', stroke: mauChu, 'stroke-width': 2, 'stroke-dasharray': '9 6', 'stroke-linecap': 'round' }, s);
    }
    // dấu tròn nhỏ "≈" ở đầu nhãn: báo đây là số ước, không phải số thật
    const dau = K.html('span', { style: `position:relative;flex:none;width:${Math.round(co * 0.9)}px;height:${Math.round(co * 0.9)}px;border-radius:50%;` +
      `border:2px solid ${mauChu};display:flex;align-items:center;justify-content:center;font-size:${Math.round(co * 0.72)}px;line-height:1;font-weight:700;box-sizing:border-box;` }, el, '≈');
    dau.setAttribute('data-chong', '1');
    K.html('span', { style: 'position:relative;' }, el, chu);
    return { el, rong, cao };
  }

  K.nhan_gia_dinh = function (opt) {
    opt = opt || {};
    const m = K.layMau(opt), kieu = opt.kieu === 'net_tay' ? 'net_tay' : 'phang';
    const chu = opt.chu != null ? opt.chu : 'ví dụ giả định', co = Math.max(22, opt.co || 24), bt = opt.bien_the || 'nhan';
    const vao = opt.tinh || opt.vao === -1 ? -100 : (opt.vao || 0);
    const v = vienNhan(m, kieu, chu, co, opt.hat || 5);
    let x = opt.x || 0, y = opt.y || 0;
    if (bt === 'goc') { x = 1920 - (opt.cach_phai != null ? opt.cach_phai : 64) - v.rong; y = opt.cach_tren != null ? opt.cach_tren : 56; }
    const el = K.html('div', { class: 'kho-nhan-gia-dinh', style: `position:absolute;left:${x}px;top:${y}px;` });

    let soEl = null, nhanSoEl = null, rong = v.rong, cao = v.cao, nhanX = 0, nhanY = 0;
    if (bt === 'kem_so') {
      const coSo = opt.co_so || 64, mauSo = m[opt.mau_so || 'nhan'] || m.nhan;
      const nenSo = opt.nen_so || m.nen, mauSoDoc = duTuongPhan(mauSo, nenSo, 4.5);
      let dongTren = 0;
      if (opt.nhan_so) {
        nhanSoEl = K.html('div', { style: `position:absolute;left:0;top:0;font:600 ${Math.max(28, Math.round(coSo * 0.45))}px/1.25 ${K.PHONG};color:${duTuongPhan(m.chu_phu, nenSo, 4.6)};white-space:nowrap;` }, el, opt.nhan_so);
        dongTren = Math.round(Math.max(28, Math.round(coSo * 0.45)) * 1.25) + 6;
      }
      const chuoiCuoi = opt.so != null ? String(opt.so) : dinhDang(opt.gia_tri || 0);
      const rongSo = Math.ceil(K.doChu(chuoiCuoi, coSo, 800));
      soEl = K.html('div', { style: `position:absolute;left:0;top:${dongTren}px;font:800 ${coSo}px/1.1 ${K.PHONG};color:${mauSoDoc};white-space:nowrap;font-variant-numeric:tabular-nums;` }, el, chuoiCuoi);
      nhanX = rongSo + Math.round(co * 0.8); nhanY = dongTren + Math.round(coSo * 1.1 / 2 - v.cao / 2);
      rong = nhanX + v.rong; cao = dongTren + Math.round(coSo * 1.1);
    }
    function dinhDang(n) {
      if (opt.dang === 'so') return K.so(n, opt.thap_phan || 0) + (opt.don_vi ? ' ' + opt.don_vi : '');
      return K.soTien(n, opt.don_vi || 'đồng');
    }
    v.el.style.left = nhanX + 'px'; v.el.style.top = nhanY + 'px';
    v.el.style.transformOrigin = '0 50%';
    el.appendChild(v.el);

    function seek(t) {
      const u = t - vao;
      if (soEl) {
        const a = K.eo3(K.tienDo(u, 0, 0.35));
        soEl.style.opacity = a.toFixed(3); soEl.style.transform = `translateY(${Math.round((1 - a) * 18)}px)`;
        if (nhanSoEl) { nhanSoEl.style.opacity = a.toFixed(3); }
        if (opt.so == null && opt.gia_tri != null) {
          const p = K.eio(K.tienDo(u, 0.1, opt.dem_giay || 0.9));
          const buoc = opt.buoc_dem || (Math.abs(opt.gia_tri) >= 1e7 ? 1e6 : 1);
          soEl.textContent = dinhDang(Math.round(opt.gia_tri * p / buoc) * buoc);
        }
      }
      const tre = soEl ? 0.35 : 0;
      const s = K.spr(u - tre, 0.4, 0.62), a = K.eo3(K.tienDo(u, tre, 0.2));
      v.el.style.opacity = a.toFixed(3);
      // chỉ dịch theo số nguyên điểm ảnh: phóng to thu nhỏ chữ làm Chrome vẽ chữ khác nhau tuỳ khung trước (lỗi hàm không thuần)
      v.el.style.transform = `translateX(${Math.round((1 - s) * -14)}px)`;
    }
    return { el, seek, moc: { x, y, rong, cao, nhan: [x + nhanX, y + nhanY, v.rong, v.cao] } };
  };
})();
