// xem_mau/thanh_ngang_chia_doan.js — ô mẫu: hạn mức đã dùng / còn lại có vạch trần; hạn mức quay vòng đổi theo t;
// gốc / lãi / phí có đoạn rất hẹp (số và nhãn tự đưa ra ngoài, xếp tầng); lãi suất thả nổi = cơ sở + biên độ.
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'thanh_ngang_chia_doan',
  khung: 'svg',
  moc: [1.0, 4.2, 8.0],
  tao({ kieu, san, K }) {
    const ds = [];
    const dat = (h, x, y) => { h.el.setAttribute('transform', `translate(${x} ${y})`); san.appendChild(h.el); ds.push(h); };
    const tr = (v) => `${K.so(Math.round(v))} triệu`;
    dat(K.thanh_ngang_chia_doan({
      kieu, rong: 1500, cao: 72, tong: 500, tieu_de: 'Hạn mức tín dụng (ví dụ giả định)',
      doan: [
        { gia_tri: 300, so: '300 triệu', nhan: 'Đã sử dụng', mau: 'nhan' },
        { gia_tri: 200, so: '200 triệu', nhan: 'Còn được rút', to: 'nhat' },
      ],
      tran: { nhan: 'Hạn mức 500 triệu' },
    }), 210, 150);
    dat(K.thanh_ngang_chia_doan({
      kieu, rong: 1500, cao: 72, tong: 500, vao: 0.8, hat: 23, tieu_de: 'Rút vốn, trả bớt, rút lại', dinh_dang: tr,
      doan: [
        { khoa: [{ t: 3, gia_tri: 300 }, { t: 4.6, gia_tri: 120 }, { t: 6.4, gia_tri: 420 }], nhan: 'Dư nợ', mau: 'xau' },
        { khoa: [{ t: 3, gia_tri: 200 }, { t: 4.6, gia_tri: 380 }, { t: 6.4, gia_tri: 80 }], nhan: 'Hạn mức còn lại', to: 'nhat', mau: 'tot' },
      ],
      tran: { nhan: 'Trần 500 triệu' },
    }), 210, 400);
    dat(K.thanh_ngang_chia_doan({
      kieu, rong: 1500, cao: 72, vao: 1.6, hat: 29, tieu_de: 'Tổng phải trả',
      doan: [
        { gia_tri: 1000, so: '1 tỷ đồng', nhan: 'Tiền gốc', mau: 'nhan' },
        { gia_tri: 18, so: '18 triệu', nhan: 'Tiền lãi', mau: 'canh_bao' },
        { gia_tri: 2, so: '2 triệu', nhan: 'Phí', mau: 'xau' },
      ],
    }), 210, 660);
    dat(K.thanh_ngang_chia_doan({
      kieu, rong: 1000, cao: 64, vao: 2.4, hat: 37, tieu_de: 'Lãi suất thả nổi 10%/năm',
      doan: [
        { gia_tri: 6.5, so: '6,5%', nhan: 'Lãi suất cơ sở', mau: 'nhan_phu' },
        { gia_tri: 3.5, so: '3,5%', nhan: 'Biên độ cố định', mau: 'nhan' },
      ],
    }), 210, 920);
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
