// xem_mau/net_tay_but_chi.js — ô mẫu chất liệu bút chì trên giấy kem (net_tay) và bút dạ trên giấy trắng (phang):
// nền giấy, tiêu đề viết dần, tờ khế ước vẽ dần, mũi tên, chữ nhiều dòng viết dần, vòng khoanh và gạch chân.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'net_tay_but_chi',
  khung: 'svg',
  moc: [1.0, 3.4, 9.5],
  tao({ kieu, san, K }) {
    const ds = [];
    const them = (h) => { san.appendChild(h.el); ds.push(h); return h; };
    them(K.net_tay_but_chi({ kieu, ke_dong: 0, le_do: kieu === 'net_tay' ? null : null }));
    them(K.chu_viet_dan({ kieu, chu: 'Khế ước nhận nợ là gì?', x: 120, y: 150, co: 68, dam: 800, vao: 0.15 }));
    // tờ khế ước
    them(K.but_chi_ve({ kieu, net: [[[160, 260], [520, 260], [520, 760], [160, 760]]], dong: true, day: 6, vao: 1.3, dai: 1.0 }));
    them(K.chu_viet_dan({ kieu, chu: 'Khế ước', x: 340, y: 330, co: 40, dam: 700, neo: 'middle', vao: 2.2 }));
    them(K.but_chi_ve({ kieu, net: [[[200, 400], [480, 400]], [[200, 460], [470, 460]], [[200, 520], [430, 520]], [[200, 580], [460, 580]]], day: 4, khoa_mau: 'chu_phu', vao: 2.6, dai: 0.8, but: true }));
    them(K.but_chi_ve({ kieu, net: [[[360, 680], [380, 668], [400, 690], [430, 660], [470, 690]]], day: 4, khoa_mau: 'nhan', vao: 3.55, dai: 0.4 }));
    // mũi tên
    them(K.but_chi_ve({ kieu, net: [[[570, 500], [680, 470], [770, 480]], [[742, 456], [772, 480], [740, 502]]], day: 6, khoa_mau: 'nhan', vao: 3.9, dai: 0.7 }));
    // chữ nhiều dòng
    const doan = them(K.chu_viet_dan({ kieu, chu: 'Mỗi lần giải ngân là một khế ước: ghi số tiền, kỳ hạn, lãi suất thả nổi bằng lãi cơ sở cộng biên độ (ví dụ giả định).', x: 820, y: 360, co: 42, dam: 600, rong: 960, vao: 4.4, toc_do: 0.03 }));
    const [xc, yc] = doan.moc.cuoi;
    them(K.but_chi_ve({ kieu, net: [[[822, yc + 24], [(822 + xc) / 2, yc + 20], [xc, yc + 25]]], day: 5, khoa_mau: 'nhan', vao: doan.t_xong + 0.15, dai: 0.5 }));
    them(K.but_chi_ve({ kieu, net: [(() => { const a = []; for (let i = 0; i <= 26; i++) { const g = -2.2 + (i / 26) * Math.PI * 2.15; a.push([1460 + 310 * Math.cos(g), 862 + 80 * Math.sin(g)]); } return a; })()], day: 5, khoa_mau: 'xau', vao: 6.0, dai: 0.8 }));
    them(K.chu_viet_dan({ kieu, chu: 'Ưu đãi hết hạn sau 6 tháng', x: 1460, y: 875, co: 38, dam: 700, neo: 'middle', vao: 7.0, toc_do: 0.03 }));
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
