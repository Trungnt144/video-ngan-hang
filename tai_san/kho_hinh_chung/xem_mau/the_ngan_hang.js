// xem_mau/the_ngan_hang.js — ô mẫu thẻ ngân hàng trơn: thẻ tín dụng màu nhấn, thẻ ghi nợ nghiêng, thẻ hạng vàng lật sang mặt sau ở giây 1,6.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'the_ngan_hang',
  khung: 'svg',
  moc: [0.35, 1.9, 3.4],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    const dat = (h, x, y, chu) => { h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h); K.chu(g, chu, { x, y: y + 260, co: 24, dam: 600, mau: m.chu_phu, neo: 'middle' }); };
    K.chu(g, 'Thẻ ngân hàng trơn — không logo, không tên hãng thẻ thật', { x: 60, y: 76, co: 36, dam: 700, mau: m.chu });
    dat(K.the_ngan_hang({ kieu, vao: 0 }), 400, 480, 'mặc định · thẻ tín dụng');
    dat(K.the_ngan_hang({ kieu, vao: 0.25, loai_the: 'THẺ GHI NỢ', khoa_mau: 'nhan_phu', nghieng: -6, so_cuoi: '8051', ten_chu_the: 'NGUYEN VAN A' }), 960, 480, 'ghi nợ · nhan_phu · nghiêng −6°');
    dat(K.the_ngan_hang({ kieu, vao: 0.5, khoa_mau: 'canh_bao', nhan_hang: 'Hạng vàng', hang_the: 'Hãng thẻ X', lat: 1.6 }), 1520, 480, 'hạng vàng · lật sang mặt sau ở 1,6 s');
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
