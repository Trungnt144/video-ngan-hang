// xem_mau/bo_bieu_tuong_co_ban.js — ô mẫu bộ biểu tượng: bốn dấu (đĩa nhạt và đĩa đặc), mũi tên thẳng, cong, nét đứt hai đầu, vòng khoanh quanh chữ.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'bo_bieu_tuong_co_ban',
  khung: 'svg',
  moc: [0.45, 1.5, 4.0],
  tao({ kieu, san, K }) {
    const m = K.mau, g = K.svg('g', null, san), ds = [];
    const dat = (h, x, y) => { h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h); return h; };
    K.chu(g, 'Bộ biểu tượng cơ bản — vẽ dần theo lời đọc', { x: 80, y: 90, co: 40, dam: 700, mau: m.chu });
    // hàng dấu: đĩa nhạt
    const nhanDau = [['tich', 'Đủ điều kiện'], ['gach', 'Không đạt'], ['hoi', 'Chưa rõ'], ['cham_than', 'Lưu ý ân hạn']];
    nhanDau.forEach(([loai, nhan], i) => dat(K.bo_bieu_tuong_co_ban({ loai, kieu, co: 1.3, nhan, vao: 0.1 + i * 0.25 }), 190 + i * 260, 250));
    // hàng dấu: đĩa đặc và không đĩa
    dat(K.dau_tich({ kieu, co: 0.9, nen: 'dac', vao: 1.1 }), 190, 500);
    dat(K.dau_gach({ kieu, co: 0.9, nen: 'dac', vao: 1.2 }), 320, 500);
    dat(K.dau_tich({ kieu, co: 0.9, nen: false, vao: 1.3 }), 450, 500);
    dat(K.dau_gach({ kieu, co: 0.9, nen: false, vao: 1.4 }), 580, 500);
    dat(K.dau_cham_than({ kieu, co: 0.9, nen: 'dac', vao: 1.5 }), 710, 500);
    dat(K.dau_hoi({ kieu, co: 0.9, nen: 'dac', khoa_mau: 'nhan_phu', vao: 1.6 }), 840, 500);
    // mũi tên
    dat(K.mui_ten({ kieu, tu: [1080, 230], den: [1500, 230], nhan: 'Giải ngân', vao: 0.5 }), 0, 0);
    dat(K.mui_ten_cong({ kieu, tu: [1500, 330], den: [1080, 330], cong: 0.22, khoa_mau: 'nhan', nhan: 'Trả nợ gốc và lãi', vao: 1.0 }), 0, 0);
    dat(K.mui_ten({ kieu, tu: [1640, 180], den: [1640, 520], khoa_mau: 'xau', nhan: 'Quá hạn', vao: 1.3 }), 0, 0);
    dat(K.mui_ten({ kieu, tu: [1080, 560], den: [1500, 560], net_dut: true, hai_dau: true, khoa_mau: 'chu_phu', nhan: 'Đối chiếu', cong: 0.12, vao: 1.6 }), 0, 0);
    // vòng khoanh quanh một cụm chữ
    K.chu(g, 'Lãi suất thả nổi', { x: 160, y: 800, co: 44, dam: 700, mau: m.chu });
    const rong = K.doChu('Lãi suất thả nổi', 44, 700);
    K.chu(g, '= lãi cơ sở + biên độ', { x: 160 + rong + 90, y: 800, co: 44, dam: 700, mau: m.chu });
    dat(K.vong_khoanh({ kieu, hop: [160, 760, rong, 54], nhan: 'Ưu đãi hết hạn', vao: 1.9 }), 0, 0);
    K.chu(g, 'Khế ước nhận nợ ghi rõ mức biên độ (ví dụ giả định)', { x: 160, y: 900, co: 30, dam: 500, mau: m.chu_phu });
    dat(K.vong_khoanh({ kieu, hop: [1240, 760, 420, 120], khoa_mau: 'xau', le: 14, vao: 2.4 }), 0, 0);
    K.chu(g, 'Phí trả nợ trước hạn', { x: 1450, y: 832, co: 36, dam: 700, mau: m.chu, neo: 'middle' });
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
