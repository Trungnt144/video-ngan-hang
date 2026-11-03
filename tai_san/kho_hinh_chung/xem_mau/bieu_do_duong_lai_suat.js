// xem_mau/bieu_do_duong_lai_suat.js — ô mẫu biểu đồ đường lãi suất: lãi thả nổi bậc thang (ưu đãi 6 tháng, điều chỉnh 3 tháng, dải biên độ, mốc điều chỉnh)
// và biểu đồ đường thường có chấm dữ liệu (lãi huy động và lãi cho vay theo tháng).
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'bieu_do_duong_lai_suat',
  khung: 'svg',
  moc: [1.4, 2.6, 6.0],
  tao({ kieu, san, K }) {
    const g = K.svg('g', null, san), ds = [];
    const dat = (h, x, y) => { h.el.setAttribute('transform', `translate(${x} ${y})`); g.appendChild(h.el); ds.push(h); return h; };
    const tn = K.laiSuatThaNoi({ co_so: [[0, 4.8], [5, 5.0], [10, 5.4], [14, 5.9], [19, 5.5], [22, 5.2]], bien_do: 3.5, ky_dieu_chinh: 3, tu: 0, den: 24, uu_dai: { den: 6, lai: 7.5 } });
    dat(K.bieu_do_duong_lai_suat({
      kieu, rong: 1780, cao: 590, vao: 0.1,
      tieu_de: 'Lãi suất thả nổi = lãi cơ sở + biên độ', chu_thich: 'Ưu đãi cố định 6 tháng, sau đó điều chỉnh 3 tháng một lần (ví dụ giả định)',
      truc_x: { min: 0, max: 24, buoc: 3, ten: 'Tháng' }, truc_y: { min: 3, max: 10, buoc: 1, thap_phan: 0 },
      duong: [
        { ten: 'Lãi cơ sở', diem: tn.co_so, bac_thang: true, khoa_mau: 'nhan_phu', net_dut: true, day: 5 },
        { ten: 'Lãi thả nổi', diem: tn.tha_noi, bac_thang: true, khoa_mau: 'nhan', day: 7 },
      ],
      dai_to: [{ duoi: 0, tren: 1, tu: 6, nhan: 'Biên độ 3,5%', x_nhan: 13.5 }],
      vung: [{ tu: 0, den: 6, nhan: 'Ưu đãi cố định 7,5%', khoa_mau: 'canh_bao' }],
      moc_dieu_chinh: tn.moc.map((x) => ({ x, duong: 1 })),
      chu_giai: true,
    }), 70, 30);
    dat(K.bieu_do_duong_lai_suat({
      kieu, rong: 1100, cao: 400, vao: 0.6, dai_ve: 2.0,
      chu_thich: 'Lãi huy động và lãi cho vay bình quân (ví dụ giả định)',
      truc_x: { min: 1, max: 12, buoc: 1, ten: 'Tháng' }, truc_y: { min: 4, max: 12, buoc: 2, thap_phan: 0 },
      duong: [
        { ten: 'Cho vay', diem: [[1, 9.6], [2, 9.4], [3, 9.3], [4, 9.0], [5, 8.8], [6, 8.9], [7, 9.1], [8, 9.4], [9, 9.6], [10, 9.5], [11, 9.7], [12, 9.8]], cham: true, khoa_mau: 'xau', day: 5 },
        { ten: 'Huy động', diem: [[1, 5.2], [2, 5.1], [3, 5.0], [4, 4.8], [5, 4.7], [6, 4.8], [7, 5.0], [8, 5.2], [9, 5.4], [10, 5.4], [11, 5.5], [12, 5.6]], cham: true, khoa_mau: 'tot', day: 5 },
      ],
    }), 70, 660);
    return { seek(t) { ds.forEach((h) => h.seek(t)); } };
  },
});
