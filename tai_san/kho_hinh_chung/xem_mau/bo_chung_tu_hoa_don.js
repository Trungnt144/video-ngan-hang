// xem_mau/bo_chung_tu_hoa_don.js — ô mẫu bộ chứng từ mô phỏng, bản 1.2: hoá đơn kích thước cố định (rong 820 px) bên trái, dưới nó một hộp trống viền mảnh
// thay cho "hình khác" của trang video (tờ không được che hộp); bên phải chồng bốn tờ khai bốn quý (co 0,5, hai cột), mọi ô trơn, ô "Thuế phải nộp" quý 1 và quý 4 được tô.
// Hoá đơn có một số do ô mẫu truyền vào (tiền thuế 10.000.000, ví dụ giả định) nên hiện nhãn "Ví dụ giả định"; mã số thuế bên mua không truyền nên là vạch được khoanh.
// Khung cuối 11 tiếng: "Mô phỏng" (2), "Ví dụ giả định" (4), tiền thuế (1), "Sai mã số thuế" (4). Nhóm tờ khai tắt nhãn "Mô phỏng" vì khung đã có một nhãn và tờ khai không có chữ.
// Ô mẫu tự kiểm bằng mã: mọi phần tử của tài sản nằm trong x 0–1920, y 0–950 và không chạm hộp "hình khác"; sai thì console.error (bộ chụp tính là lỗi).
(window.KHO_MAU = window.KHO_MAU || []).push({
  ten: 'bo_chung_tu_hoa_don',
  khung: 'html',
  moc: [2.7, 4.4, 7.8],
  mau: { phang: 'MAU-40', net_tay: 'MAU-57', toi_gian: 'MAU-22' },
  tao({ kieu, san, K }) {
    const m = K.mau;
    const net = kieu === 'toi_gian' ? { day: 2 } : undefined;
    // hình khác giả định của trang video
    const HOP = { x: 40, y: 720, w: 820, h: 220 };
    K.html('div', { style: `position:absolute;left:${HOP.x}px;top:${HOP.y}px;width:${HOP.w}px;height:${HOP.h}px;box-sizing:border-box;border:2px dashed ${K.rgba(m.chu, 0.45)};border-radius:12px;` }, san);

    const hd = K.bo_chung_tu_hoa_don({ loai: 'hoa_don_gtgt', kieu, net, x: 40, y: 40, rong: 820, vao: 0,
      tien_thue: '10.000.000',
      to_sang: [{ truong: 'tien_thue.gia_tri', moc: 3.0 }],
      sai: [{ truong: 'ben_mua.mst.gia_tri', moc: 3.4, nhan: 'Sai mã số thuế' }],
      dau: { moc: 5.0 } });
    const tk = K.bo_chung_tu_hoa_don({ loai: 'chong', xep: 'hang', cot: 2, kieu, net, co: 0.5, x: 1220, y: 40, gian: 24, lech: 18, nhan_mo_phong: false,
      moc_hien: [2.6, 2.9, 3.2, 3.5],
      to: [0, 1, 2, 3].map((i) => ({ loai: 'to_khai_gtgt', to_sang: i === 0 || i === 3 ? [{ truong: 'chi_tieu.4', moc: 6.3 + i * 0.1 }] : [] })) });
    san.appendChild(hd.el); san.appendChild(tk.el);

    const kiem = () => {
      const g = san.getBoundingClientRect();
      for (const goc of [hd.el, tk.el]) for (const e of goc.querySelectorAll('*')) {
        if (e.closest('defs, clipPath, pattern')) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 0.5 && r.height < 0.5) continue;
        const x0 = r.left - g.left, y0 = r.top - g.top, x1 = r.right - g.left, y1 = r.bottom - g.top;
        if (x0 < -0.5 || y0 < -0.5 || x1 > 1920.5 || y1 > 950.5) { console.error(`bo_chung_tu_hoa_don: phần tử ${e.tagName} vượt khung 1920×950 (x ${x0.toFixed(0)}–${x1.toFixed(0)}, y ${y0.toFixed(0)}–${y1.toFixed(0)})`); return; }
        if (x1 > HOP.x && x0 < HOP.x + HOP.w && y1 > HOP.y && y0 < HOP.y + HOP.h) { console.error(`bo_chung_tu_hoa_don: phần tử ${e.tagName} chạm hộp hình khác (y ${y0.toFixed(0)}–${y1.toFixed(0)})`); return; }
      }
    };
    return { seek(t) { hd.seek(t); tk.seek(t); kiem(); } };
  },
});
