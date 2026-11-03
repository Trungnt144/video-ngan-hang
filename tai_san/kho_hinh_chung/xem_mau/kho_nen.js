// xem_mau/kho_nen.js — ô mẫu của nền móng: phông năm độ đậm có dấu, mười hai bảng màu, đường vẽ dần, nét tay.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'kho_nen',
  khung: 'svg',
  moc: [0.4, 1.2, 3.0],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san);
    const loc = kieu === 'net_tay' ? K.locNetTay(san, { hat: 3 }) : null;
    [[400, 'Regular'], [500, 'Medium'], [600, 'SemiBold'], [700, 'Bold'], [800, 'ExtraBold']].forEach(([w, ten], i) =>
      K.chu(g, `${ten} ${w}: Hợp đồng tín dụng, khế ước nhận nợ, ân hạn — ĐỦ DẤU: Ặ Ỡ Ữ Ỷ ẫ ự`, { x: 80, y: 110 + i * 62, co: 40, dam: w, mau: m.chu }));
    const ma = Object.keys(K.BANG), khoa = ['nen', 'nen_phu', 'chu', 'nhan', 'nhan_phu', 'tot', 'xau', 'canh_bao'];
    ma.forEach((k, i) => {
      const x = 80 + (i % 6) * 300, y = 450 + Math.floor(i / 6) * 150, b = K.BANG[k];
      K.svg('rect', { x, y, width: 280, height: 130, rx: 10, fill: b.nen, stroke: m.vien, 'stroke-opacity': 0.25 }, g);
      khoa.forEach((kh, j) => K.svg('rect', { x: x + 12 + j * 32, y: y + 62, width: 28, height: 52, rx: 4, fill: b[kh] }, g));
      K.chu(g, k, { x: x + 14, y: y + 32, co: 22, dam: 700, mau: b.chu });
      K.chu(g, b.ten, { x: x + 14, y: y + 54, co: 15, dam: 500, mau: b.chu_phu });
    });
    const duong = K.svg('path', { d: kieu === 'net_tay' ? K.duongTay([[80, 820], [500, 760], [900, 860], [1300, 760], [1840, 830]], { hat: 5 }) : 'M80 820 C 500 740, 900 900, 1840 800',
      fill: 'none', stroke: m.nhan, 'stroke-width': 8, 'stroke-linecap': 'round', filter: loc }, g);
    const so = K.chu(g, '', { x: 80, y: 940, co: 46, dam: 700, mau: m.chu });
    return {
      el: g,
      seek(t) {
        K.veDan(duong, K.eio(K.tienDo(t, 0.2, 2)));
        so.textContent = `KHO.so: ${K.so(1234567.5, 1)} · KHO.soTien: ${K.soTien(1.2e9)} · ${K.soTien(500e6)} · tiến độ ${Math.round(K.tienDo(t, 0.2, 2) * 100)}%`;
      },
    };
  },
});
