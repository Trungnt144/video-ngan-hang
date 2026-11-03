// xem_mau/truc_thoi_gian.js — ô mẫu: trục khoản vay 36 tháng (ân hạn, trả góp, ngoặc thời hạn vay, thanh "Hôm nay" chạy theo t),
// trục khế ước dày mốc (nhãn tự xếp tầng, ngoặc phía trên) và lịch tháng có ngày đến hạn, dải ngày quá hạn, vòng khoanh.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'truc_thoi_gian',
  khung: 'svg',
  moc: [1.2, 3.4, 8.5],
  tao({ kieu, san, K }) {
    const m = K.mau;
    const a = K.truc_thoi_gian({
      kieu, rong: 1440, tu: 0, den: 36,
      vach: { buoc: 6, nhan: (v) => (v === 0 ? '0' : `${v} tháng`) },
      moc: [
        { gia_tri: 0, nhan: 'Giải ngân', nhan_phu: 'ngày 15/3' },
        { gia_tri: 6, nhan: 'Hết ân hạn', nhan_phu: 'bắt đầu trả gốc' },
        { gia_tri: 36, nhan: 'Đáo hạn', nhan_phu: 'trả hết nợ', manh: true, vach_doc: true },
      ],
      doan: [
        { tu: 0, den: 6, nhan: 'Thời gian ân hạn', mau: 'canh_bao' },
        { tu: 6, den: 36, nhan: 'Trả góp gốc và lãi hằng tháng', mau: 'nhan' },
      ],
      ngoac: [{ tu: 0, den: 36, nhan: 'Thời hạn vay 36 tháng' }],
      thanh: { tu: 0, khoa: [{ t: 3.6, gia_tri: 0 }, { t: 6.5, gia_tri: 15 }], nhan: 'Hôm nay' },
    });
    a.el.setAttribute('transform', 'translate(200 236)');
    san.appendChild(a.el);

    const b = K.truc_thoi_gian({
      kieu, rong: 880, tu: 0, den: 12, vao: 1.6, hat: 31,
      moc: [
        { gia_tri: 0, nhan: 'Ký hợp đồng' },
        { gia_tri: 2, nhan: 'Khế ước 1' },
        { gia_tri: 3, nhan: 'Khế ước 2' },
        { gia_tri: 12, nhan: 'Hết hạn mức', manh: true, mau: 'xau' },
      ],
      doan: [{ tu: 0, den: 12, nhan: 'Thời hạn duy trì hạn mức', mau: 'nhan_phu' }],
      ngoac: [{ tu: 2, den: 3, nhan: 'Rút vốn nhiều lần', vi_tri: 'tren' }],
    });
    b.el.setAttribute('transform', 'translate(120 860)');
    san.appendChild(b.el);

    const c = K.lich_thang({
      kieu, thang: 'Tháng 2', thu_ngay_1: 0, so_ngay: 28, o: 96, vao: 1.0, hat: 41,
      danh_dau: [{ ngay: 15, nhan: 'đến hạn', mau: 'nhan', hien: 2.4 }],
      dai: [{ tu: 16, den: 26, mau: 'xau', vao: 3.6, moi_ngay: 0.25 }],
      khoanh: [{ ngay: 15, hien: 2.8 }],
    });
    c.el.setAttribute('transform', 'translate(1182 538)');
    san.appendChild(c.el);
    const dem = K.chu(san, '', { x: 1150, y: 1040, co: 30, dam: 700, mau: m.xau, neo: 'end' });
    dem.setAttribute('opacity', 0);

    return {
      seek(t) {
        a.seek(t); b.seek(t); c.seek(t);
        const n = c.soNgayDaTo(t, 0);
        dem.textContent = n > 0 ? `Quá hạn ${n} ngày` : '';
        dem.setAttribute('opacity', n > 0 ? 1 : 0);
      },
    };
  },
});
