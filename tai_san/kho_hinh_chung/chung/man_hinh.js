// chung/man_hinh.js — 1.0 — màn hình ứng dụng mô phỏng trong khung điện thoại hoặc khung trình duyệt: thẻ số dư (hoặc thẻ tín dụng), dòng chi tiết, danh sách giao dịch, nút bấm, thông báo trượt xuống.
// Gọi: KHO.man_hinh_ung_dung({ khung, mau_san, tieu_de, the, so_du, chi_tiet, nhan_dong, dong, nut, thong_bao, dia_chi, nhan_mo_phong, x, y, co, kieu, mau, vao, moc_hien, moc_thong_bao, giu_thong_bao, moc_bam, tinh, hat }); bí danh KHO.man_hinh.
//   khung 'dien_thoai' (mặc định, thân 440 × ≥860) | 'trinh_duyet' (1100 × ≥620, hai cột);
//   mau_san: nội dung soạn sẵn 'tai_khoan' | 'sao_ke_the' (N116) | 'khoan_vay' | 'trong' — các trường dưới ghi đè từng phần;
//   tieu_de: chữ thanh tiêu đề; the: { ten, so } vẽ thẻ số dư thành thẻ tín dụng (chip, số thẻ che), false thì thẻ thường;
//   so_du: { nhan, gia_tri, ghi_chu } (ghi_chu nên là 'Ví dụ giả định'); chi_tiet: mảng [nhãn, giá trị]; nhan_dong: tiêu đề danh sách;
//   dong: mảng { trai, phu, phai, loai: 'thu' | 'chi' | 'tot' | 'xau' | 'canh_bao' } (thu → màu tot, chi → màu xau); nut: chữ nút, false là không nút;
//   thong_bao: { chu, loai: 'canh_bao' | 'tot' | 'xau' | 'nhan' } trượt từ trên xuống ở moc_thong_bao, giữ giu_thong_bao giây rồi trượt lên (bỏ trống là giữ mãi), false là không; dia_chi: chữ thanh địa chỉ (khung trình duyệt);
//   nhan_mo_phong: chữ nhãn 'Giao diện mô phỏng' (false là bỏ); x, y: góc trên trái trong sân khấu 1920×1080; co: tỉ lệ;
//   kieu 'phang' | 'net_tay'; vao: giây bắt đầu (-1 hiện đủ); moc_hien: mảng giây hiện từng mục theo thứ tự trên xuống; moc_bam: giây nút bị bấm (null là không bấm); tinh: true hiện đủ.
// el là phần tử HTML đặt tuyệt đối (khuôn giao diện nhiều chữ); hình khối vẽ trong một lớp SVG phía sau, chữ là HTML để xuống dòng tự nhiên; mỗi ô chữ gắn data-hop.
// Trả về { el, seek(t), moc }: moc theo toạ độ sân khấu { tam, tren, duoi, trai, phai, so_du, nut, thong_bao, dong: [mép phải từng dòng], chi_tiet: [...], rong, cao }.
// Chuyển động: khung nảy lên bằng lò xo, các mục hiện lần lượt từ trên xuống, nút sáng nhịp nhẹ 2 giây một lần, thông báo trượt xuống, nút lún khi bấm có vòng lan.
// Gom từ xuong_html/n87_chung_chi_tien_gui/trang.html:108 (phone: viền dày, góc bo 30, màn hình sáng, bóng đổ) và xuong_html/2026.10.28_cic_la_gi/trang.html:311-322
// (khung trình duyệt: thanh tiêu đề ba chấm, ô địa chỉ bo tròn, nhãn "giao diện mô phỏng", ô nhập, nút); đổi thành nội dung theo tham số, màu theo bảng.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});

  const SAN = {
    tai_khoan: { tieu_de: 'Tài khoản thanh toán', so_du: { nhan: 'Số dư khả dụng', gia_tri: '12.500.000 đ', ghi_chu: 'Ví dụ giả định' }, chi_tiet: [], nhan_dong: 'Giao dịch gần đây',
      dong: [{ trai: 'Lương tháng 10', phu: '05/11 · nhận', phai: '+15.000.000 đ', loai: 'thu' }, { trai: 'Tiền điện', phu: '06/11 · chuyển', phai: '−820.000 đ', loai: 'chi' }, { trai: 'Siêu thị', phu: '07/11 · thẻ', phai: '−450.000 đ', loai: 'chi' }],
      nut: 'Chuyển tiền', dia_chi: 'nganhang-a.vn/tai-khoan' },
    sao_ke_the: { tieu_de: 'Sao kê thẻ tín dụng', the: { ten: 'Thẻ tín dụng A', so: '•••• 1234' }, so_du: { nhan: 'Dư nợ sao kê kỳ này', gia_tri: '8.450.000 đ', ghi_chu: 'Ví dụ giả định' },
      chi_tiet: [['Thanh toán tối thiểu', '422.500 đ'], ['Hạn thanh toán', '15/11/2026']], nhan_dong: 'Giao dịch trong kỳ',
      dong: [{ trai: 'Siêu thị', phu: '21/10', phai: '1.250.000 đ' }, { trai: 'Vé máy bay', phu: '25/10', phai: '3.900.000 đ' }],
      nut: 'Thanh toán', dia_chi: 'nganhang-a.vn/the-tin-dung/sao-ke' },
    khoan_vay: { tieu_de: 'Khoản vay của tôi', so_du: { nhan: 'Dư nợ gốc còn lại', gia_tri: '420.000.000 đ', ghi_chu: 'Ví dụ giả định' },
      chi_tiet: [['Kỳ trả tiếp theo', '05/12/2026'], ['Số tiền kỳ này', '9.850.000 đ']], nhan_dong: 'Các kỳ đã trả',
      dong: [{ trai: 'Kỳ 11', phu: '05/11 · đã trả', phai: '9.900.000 đ', loai: 'tot' }, { trai: 'Kỳ 10', phu: '05/10 · đã trả', phai: '9.950.000 đ', loai: 'tot' }],
      nut: 'Trả nợ ngay', dia_chi: 'nganhang-a.vn/khoan-vay' },
    trong: { tieu_de: 'Ứng dụng', so_du: null, chi_tiet: [], dong: [], nut: false, dia_chi: 'nganhang-a.vn' },
  };

  // điểm của hình chữ nhật bo góc (để vẽ nét tay)
  function diemBo(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    const p = [], goc = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
    for (const [cx, cy, a0] of goc) for (let i = 0; i <= 4; i++) { const a = ((a0 + i * 22.5) * Math.PI) / 180; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return p;
  }

  K.man_hinh_ung_dung = function (opt) {
    opt = opt || {};
    const san = SAN[opt.mau_san] || SAN.tai_khoan;
    const o = Object.assign({}, san, opt);
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', dt = o.khung !== 'trinh_duyet', co = opt.co || 1;
    let hat = opt.hat || 81;
    const mauDoc = (c, nen) => { let x = c, k = 0; while (K.tuongPhan(x, nen) < 4.5 && k < 6) { x = K.tron(x, m.chu, 0.25); k++; } return x; };
    const nenMH = m.the, chu = mauDoc(m.chu, nenMH), chuPhu = mauDoc(m.chu_phu, nenMH);
    const than = m.toi ? K.tron(m.the, '#000000', 0.45) : K.tron(m.chu, m.nen_phu, 0.12);

    // ---------- kích thước khung ----------
    const W = dt ? 440 : 1100, VIEN = dt ? 14 : 0, TB = dt ? 0 : 64;       // viền thân máy, cao thanh trình duyệt
    const SW = W - 2 * VIEN;
    const PAD = dt ? 24 : 48;
    const nhanMP = o.nhan_mo_phong === false ? '' : (o.nhan_mo_phong || 'Giao diện mô phỏng');

    // ---------- dàn trang: tính trước toạ độ (trong màn hình) ----------
    const mucs = [];            // { y, h, x, w, loai, du }
    let yT, yP;                 // con trỏ cột trái, cột phải
    const xT = PAD, wT = dt ? SW - 2 * PAD : 440;
    const xP = dt ? PAD : PAD + 440 + 48, wP = dt ? wT : SW - xP - PAD;
    if (dt) { yT = 44; mucs.push({ loai: 'thanh', x: 0, y: 44, w: SW, h: 70 }); yT = 44 + 70 + 18; }
    else { yT = TB + 40; }
    const them = (cot, mc) => { if (cot === 'T') { mc.x = xT; mc.w = wT; mc.y = yT; yT += mc.h + mc.cach; } else { mc.x = xP; mc.w = wP; mc.y = yP; yP += mc.h + mc.cach; } mucs.push(mc); return mc; };
    if (!dt) {
      const dTD = K.xuongDong(o.tieu_de || '', wT, 36, 800);
      them('T', { loai: 'tieu_de_lon', h: dTD.length * 44, cach: 22, dong: dTD });
    }
    if (o.so_du) {
      const coGT = Math.max(30, K.coVua(o.so_du.gia_tri || '', wT - 48, dt ? 44 : 48, 800, 30));
      them('T', { loai: 'so_du', h: o.the ? 196 : 160, cach: 20, coGT });
    }
    (o.chi_tiet || []).forEach((ct, i) => {
      const rongPhai = K.doChu(ct[1], 28, 700) + 16, dTr = K.xuongDong(ct[0], wT - rongPhai - 8, 24, 500);
      them('T', { loai: 'chi_tiet', h: Math.max(56, dTr.length * 30 + 22), cach: 0, du: ct, dTr, rongPhai, chot: i === o.chi_tiet.length - 1 });
    });
    if ((o.chi_tiet || []).length) yT += 18;
    yP = dt ? yT : TB + 40;
    if ((o.dong || []).length && o.nhan_dong) them('P', { loai: 'nhan_dong', h: 34, cach: 8 });
    (o.dong || []).forEach((d) => {
      // số tiền nằm cùng dòng nhãn nếu vừa; nhãn dài thì số tiền xuống dòng phụ (bên phải)
      const rongPhai = K.doChu(d.phai || '', 28, 700) + 16, motDong = K.doChu(d.trai || '', 28, 600) <= wP - rongPhai - 12;
      const dTr = K.xuongDong(d.trai || '', motDong ? wP - rongPhai - 12 : wP, 28, 600);
      const xuong = !motDong;
      them('P', { loai: 'dong', h: dTr.length * 34 + (d.phu || xuong ? 34 : 0) + 22, cach: 0, du: d, dTr, rongPhai, xuong });
    });
    if (dt) yT = yP + 20;
    let mucNut = null;
    if (o.nut) mucNut = them('T', { loai: 'nut', h: 72, cach: 24 });
    const caoND = Math.max(yT, dt ? yP : yP + 24);
    const SH = Math.max(dt ? 832 : 556, caoND + (dt ? 30 : 24));
    const H = SH + 2 * VIEN;
    const HE = H + (nhanMP && dt ? 62 : 0);   // phần tử gồm cả nhãn mô phỏng dưới máy
    // nút điện thoại dính đáy màn hình nếu còn chỗ
    if (mucNut && dt) mucNut.y = SH - 72 - 34;

    const X0 = opt.x != null ? opt.x : (dt ? 1380 : 410), Y0 = opt.y != null ? opt.y : (dt ? 100 : 180);
    const el = K.html('div', { class: 'kho-man-hinh', style: `position:absolute;left:${X0}px;top:${Y0}px;width:${W}px;height:${HE}px;font-family:${K.PHONG};transform-origin:0 0;` });
    const khoi = K.html('div', { style: `position:absolute;left:0;top:0;width:${W}px;height:${HE}px;transform-origin:${W / 2}px ${H}px;` }, el);
    const sv = K.svg('svg', { width: W, height: HE, style: 'position:absolute;left:0;top:0;overflow:visible;' });
    khoi.appendChild(sv);
    const loc = tay ? K.locNetTay(sv, { hat: hat + 3, do_run: 1.4, tan_so: 0.035 }) : null;
    const defs = K.defs(sv);
    let demG = 0;
    const gach = (mau, mo) => {
      const id = `kho-mh-g${hat}-${++demG}`;
      const p = K.svg('pattern', { id, width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(40)' }, defs);
      K.svg('line', { x1: 0, y1: 0, x2: 0, y2: 9, stroke: mau, 'stroke-width': 1.8, opacity: mo }, p);
      return `url(#${id})`;
    };
    // hộp bo góc: phẳng nét sạch, nét tay hai nét chì lệch + tô loang (tuỳ chọn gạch chéo)
    const hop = (cha, x, y, w, h, r, o2 = {}) => {
      if (!tay) return K.svg('rect', { x, y, width: w, height: h, rx: r, fill: o2.to || 'none', stroke: o2.net || 'none', 'stroke-width': o2.day || 2 }, cha);
      const pts = diemBo(x, y, w, h, r), nh = K.svg('g', null, cha);
      if (o2.to && o2.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: o2.to }, nh);
      if (o2.gach) K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 0.8, dong: true }), fill: gach(o2.gach, 0.35) }, nh);
      const net = o2.net || (o2.to && o2.to !== 'none' ? m.vien : null);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.2, dong: true }), fill: 'none', stroke: net, 'stroke-width': (o2.day || 2) * 1.1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, nh);
        K.svg('path', { d: K.duongTay(pts, { hat: hat++, lech: 1.9, dong: true }), fill: 'none', stroke: net, 'stroke-width': 1, opacity: 0.45 }, nh);
      }
      return nh;
    };
    const vach = (cha, x1, y1, x2, y2, mau, day, mo) => (tay
      ? K.svg('path', { d: K.duongTay([[x1, y1], [x2, y2]], { hat: hat++, lech: 1 }), fill: 'none', stroke: mau, 'stroke-width': day, opacity: mo, 'stroke-linecap': 'round' }, cha)
      : K.svg('line', { x1, y1, x2, y2, stroke: mau, 'stroke-width': day, opacity: mo, 'stroke-linecap': 'round' }, cha));
    const chuDiv = (cha, x, y, w, s, css) => K.html('div', { style: `position:absolute;left:${x}px;top:${y}px;width:${w}px;line-height:1.2;${css || ''}` }, cha, s);

    // ---------- thân máy hoặc khung trình duyệt ----------
    const ox = VIEN, oy = VIEN;           // gốc màn hình trong phần tử
    const gKhung = K.svg('g', null, sv);
    if (!tay) K.svg('rect', { x: 8, y: 18, width: W - 4, height: H - 6, rx: dt ? 52 : 22, fill: '#000', opacity: 0.14 }, gKhung);
    else hop(gKhung, 12, 20, W - 4, H - 4, dt ? 52 : 22, { gach: m.chu });
    if (dt) {
      hop(gKhung, 0, 0, W, H, 54, { to: than, net: m.vien, day: 3 });
      hop(gKhung, ox, oy, SW, SH, 42, { to: nenMH, net: tay ? m.vien : null, day: 1.5 });
      hop(gKhung, W / 2 - 46, oy + 12, 92, 24, 12, { to: than });                 // tai thỏ
    } else {
      hop(gKhung, 0, 0, W, H, 22, { to: nenMH, net: m.vien, day: 3 });
      if (!tay) K.svg('path', { d: `M0 ${TB} L0 22 Q0 0 22 0 L${W - 22} 0 Q${W} 0 ${W} 22 L${W} ${TB} Z`, fill: m.nen_phu, stroke: m.vien, 'stroke-width': 3 }, gKhung);
      else hop(gKhung, 0, 0, W, TB, 20, { to: m.nen_phu, net: m.vien, day: 2.5 });
      [m.xau, m.canh_bao, m.tot].forEach((c, i) => K.svg('circle', { cx: 32 + i * 28, cy: TB / 2, r: 8, fill: c, opacity: 0.85 }, gKhung));
      hop(gKhung, 132, 12, W - 132 - 300, TB - 24, (TB - 24) / 2, { to: nenMH, net: tay ? m.vien : null, day: 1.5 });
    }
    // chữ trên khung (luôn hiện cùng khung)
    const lopChuKhung = K.html('div', { style: 'position:absolute;left:0;top:0;' }, khoi);
    if (dt) {
      chuDiv(lopChuKhung, ox + 34, oy + 10, 90, '9:41', `font-size:22px;font-weight:700;color:${chu};`);
      [0, 1, 2].forEach((i) => K.svg('rect', { x: ox + SW - 70 + i * 10, y: oy + 26 - i * 4, width: 6, height: 8 + i * 4, rx: 1.5, fill: chu }, gKhung));
      K.svg('rect', { x: ox + SW - 36, y: oy + 18, width: 22, height: 12, rx: 3, fill: 'none', stroke: chu, 'stroke-width': 2 }, gKhung);
    } else {
      const dc = K.html('div', { 'data-hop': '1', style: `position:absolute;left:156px;top:16px;width:${W - 132 - 300 - 48}px;height:32px;overflow:hidden;white-space:nowrap;font-size:24px;font-weight:600;line-height:32px;color:${chu};` }, lopChuKhung, o.dia_chi || '');
      dc.textContent = o.dia_chi || '';
      if (nhanMP) {
        const rong = Math.ceil(K.doChu(nhanMP, 22, 700)) + 36;
        hop(gKhung, W - rong - 24, 14, rong, 36, 18, { to: m.nhat, net: tay ? m.vien : null, day: 1.5 });
        chuDiv(lopChuKhung, W - rong - 24, 19, rong, nhanMP, `font-size:22px;font-weight:700;text-align:center;color:${mauDoc(m.chu, m.nhat)};white-space:nowrap;`).setAttribute('data-hop', '1');
      }
    }
    if (dt && nhanMP) {
      const rong = Math.ceil(K.doChu(nhanMP, 22, 700)) + 40;
      hop(gKhung, (W - rong) / 2, H + 18, rong, 38, 19, { to: m.nhat, net: tay ? m.vien : null, day: 1.5 });
      chuDiv(lopChuKhung, (W - rong) / 2, H + 24, rong, nhanMP, `font-size:22px;font-weight:700;text-align:center;color:${mauDoc(m.chu, m.nhat)};white-space:nowrap;`).setAttribute('data-hop', '1');
    }
    if (loc) gKhung.setAttribute('filter', loc);

    // ---------- các mục nội dung ----------
    const dsMuc = [], mocDong = [], mocCT = [];
    let mocSoDu = null, mocNut = null, nutG = null, nutC = null, vongBam = null;
    for (const mc of mucs) {
      const g = K.svg('g', null, sv), c = K.html('div', { style: 'position:absolute;left:0;top:0;' }, khoi);
      const x = ox + mc.x, y = oy + mc.y;
      if (mc.loai === 'thanh') {
        chuDiv(c, ox + PAD + 34, y + 14, SW - 2 * PAD - 34, o.tieu_de || '', `font-size:30px;font-weight:800;color:${chu};white-space:nowrap;overflow:hidden;`).setAttribute('data-hop', '1');
        vach(g, ox + PAD + 4, y + 33, ox + PAD + 16, y + 21, chu, 4, 1); vach(g, ox + PAD + 4, y + 33, ox + PAD + 16, y + 45, chu, 4, 1);
        vach(g, ox + 16, y + mc.h, ox + SW - 16, y + mc.h, m.vien, 1.5, 0.18);
      } else if (mc.loai === 'tieu_de_lon') {
        mc.dong.forEach((d, i) => chuDiv(c, x, y + i * 44, mc.w, d, `font-size:36px;font-weight:800;color:${chu};white-space:nowrap;`));
      } else if (mc.loai === 'so_du') {
        const nen = o.the ? K.tron(m.nhan, m.chu, 0.25) : m.nhan, chuThe = K.chuTren(nen, '#FFFFFF', m.toi ? m.nen : '#111111');
        hop(g, x, y, mc.w, mc.h, 22, { to: nen, net: tay ? m.vien : null, day: 2, gach: tay ? chuThe : null });
        if (!tay) K.svg('circle', { cx: x + mc.w - 40, cy: y + 10, r: 90, fill: '#FFFFFF', opacity: 0.1 }, g);
        const hopChu = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x}px;top:${y}px;width:${mc.w}px;height:${mc.h}px;` }, c);
        let yy = 20;
        if (o.the) {
          hop(g, x + 24, y + 22, 52, 38, 7, { to: K.tron(m.canh_bao, '#FFFFFF', 0.35), net: chuThe, day: 1.2 });
          vach(g, x + 24, y + 41, x + 76, y + 41, chuThe, 1.2, 0.5);
          chuDiv(hopChu, 92, 26, mc.w - 116, o.the.ten || '', `font-size:22px;font-weight:700;color:${chuThe};white-space:nowrap;`);
          if (o.the.so) chuDiv(hopChu, 24, mc.h - 42, mc.w - 48, o.the.so, `font-size:22px;font-weight:600;color:${chuThe};text-align:right;white-space:nowrap;letter-spacing:.08em;`);
          yy = 72;
        }
        chuDiv(hopChu, 24, yy, mc.w - 48, o.so_du.nhan || '', `font-size:22px;font-weight:500;color:${chuThe};opacity:.92;white-space:nowrap;`);
        chuDiv(hopChu, 24, yy + 30, mc.w - 48, o.so_du.gia_tri || '', `font-size:${mc.coGT}px;font-weight:800;color:${chuThe};white-space:nowrap;letter-spacing:-0.01em;`);
        if (o.so_du.ghi_chu) chuDiv(hopChu, 24, yy + 36 + mc.coGT * 1.15, mc.w - 48, o.so_du.ghi_chu, `font-size:22px;font-weight:500;color:${chuThe};opacity:.92;white-space:nowrap;`);
        mocSoDu = [x + mc.w / 2, y + mc.h / 2];
      } else if (mc.loai === 'chi_tiet') {
        const hopChu = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x}px;top:${y}px;width:${mc.w}px;height:${mc.h}px;` }, c);
        mc.dTr.forEach((d, i) => chuDiv(hopChu, 0, 14 + i * 30, mc.w - mc.rongPhai - 4, d, `font-size:24px;font-weight:500;color:${chuPhu};white-space:nowrap;`));
        chuDiv(hopChu, 0, 12, mc.w, mc.du[1], `font-size:28px;font-weight:700;color:${chu};text-align:right;white-space:nowrap;`);
        if (!mc.chot) vach(g, x, y + mc.h, x + mc.w, y + mc.h, m.vien, 1.5, 0.15);
        mocCT.push([x + mc.w, y + mc.h / 2]);
      } else if (mc.loai === 'nhan_dong') {
        chuDiv(c, x, y, mc.w, o.nhan_dong, `font-size:22px;font-weight:700;color:${chuPhu};text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;`);
      } else if (mc.loai === 'dong') {
        const d = mc.du, khoa = { thu: 'tot', chi: 'xau' }[d.loai] || d.loai, mauP = khoa && m[khoa] ? mauDoc(m[khoa], nenMH) : chu;
        // biểu tượng tròn bên trái
        const r = 0;
        const hopChu = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x}px;top:${y}px;width:${mc.w}px;height:${mc.h}px;` }, c);
        const yPhu = 12 + mc.dTr.length * 34 + 2;
        mc.dTr.forEach((l, i) => chuDiv(hopChu, r, 12 + i * 34, mc.xuong ? mc.w : mc.w - mc.rongPhai, l, `font-size:28px;font-weight:600;color:${chu};white-space:nowrap;`));
        if (d.phu) chuDiv(hopChu, r, yPhu + (mc.xuong ? 4 : 0), mc.w - mc.rongPhai - 4, d.phu, `font-size:22px;font-weight:500;color:${chuPhu};white-space:nowrap;`);
        chuDiv(hopChu, 0, mc.xuong ? yPhu - 2 : 12, mc.w, d.phai || '', `font-size:28px;font-weight:700;color:${mauP};text-align:right;white-space:nowrap;`);
        vach(g, x, y + mc.h, x + mc.w, y + mc.h, m.vien, 1.5, 0.15);
        mocDong.push([x + mc.w, y + 30]);
      } else if (mc.loai === 'nut') {
        const nen = m.nhan, chuNut = K.chuTren(nen, '#FFFFFF', m.toi ? m.nen : '#111111');
        nutG = K.svg('g', null, g);
        vongBam = K.svg('circle', { cx: x + mc.w / 2, cy: y + mc.h / 2, r: 10, fill: 'none', stroke: nen, 'stroke-width': 4, opacity: 0 }, g);
        hop(nutG, x, y, mc.w, mc.h, mc.h / 2, { to: nen, net: tay ? m.vien : null, day: 2 });
        nutC = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x}px;top:${y}px;width:${mc.w}px;height:${mc.h}px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:700;color:${chuNut};white-space:nowrap;transform-origin:50% 50%;` }, c, o.nut);
        mocNut = [x + mc.w / 2, y + mc.h / 2];
      }
      if (mc.loai !== 'thanh') dsMuc.push({ g, c, loai: mc.loai });
      else { gKhung.appendChild(g); lopChuKhung.appendChild(c); }
    }
    // net tay: lọc run cho hình khối nội dung (chữ HTML không bị lọc)
    if (loc) dsMuc.forEach((d) => d.g.setAttribute('filter', loc));

    // ---------- thông báo ----------
    let tb = null, mocTB = null;
    if (o.thong_bao) {
      const khoaTB = ['canh_bao', 'tot', 'xau', 'nhan'].includes(o.thong_bao.loai) ? o.thong_bao.loai : 'canh_bao';
      const wTB = SW - 24, dTB = K.xuongDong(o.thong_bao.chu || '', wTB - 96, 24, 600), hTB = Math.max(84, dTB.length * 30 + 44);
      const xTB = ox + 12, yTB = oy + (dt ? 52 : TB + 16);
      // lớp cắt theo màn hình (không di chuyển) chứa lớp thông báo (di chuyển)
      const catTB = K.html('div', { 'data-chong': '1', style: `position:absolute;left:0;top:0;width:${W}px;height:${HE}px;clip-path:inset(${dt ? oy : TB}px ${dt ? VIEN : 0}px ${HE - (dt ? oy + SH : H)}px ${dt ? VIEN : 0}px round ${dt ? 42 : 0}px);` }, khoi);
      const cT = K.html('div', { style: 'position:absolute;left:0;top:0;' }, catTB);
      const svT = K.svg('svg', { width: W, height: HE, style: 'position:absolute;left:0;top:0;overflow:visible;' }); cT.appendChild(svT);
      const gT = K.svg('g', null, svT);
      const nenTB = K.tron(m.the, m[khoaTB], 0.16);
      if (!tay) K.svg('rect', { x: xTB + 4, y: yTB + 8, width: wTB, height: hTB, rx: 20, fill: '#000', opacity: 0.16 }, gT);
      hop(gT, xTB, yTB, dt ? wTB : 520, hTB, 20, { to: nenTB, net: m[khoaTB], day: 2.5 });
      K.svg('circle', { cx: xTB + 40, cy: yTB + hTB / 2, r: 18, fill: m[khoaTB] }, gT);
      K.svg('path', { d: `M${xTB + 40} ${yTB + hTB / 2 - 9} L${xTB + 40} ${yTB + hTB / 2 + 2}`, stroke: K.chuTren(m[khoaTB]), 'stroke-width': 4, 'stroke-linecap': 'round' }, gT);
      K.svg('circle', { cx: xTB + 40, cy: yTB + hTB / 2 + 9, r: 2.6, fill: K.chuTren(m[khoaTB]) }, gT);
      const hopChu = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${xTB + 72}px;top:${yTB + 22}px;width:${(dt ? wTB : 520) - 96}px;height:${hTB - 40}px;` }, cT);
      dTB.forEach((l, i) => chuDiv(hopChu, 0, i * 30, (dt ? wTB : 520) - 96, l, `font-size:24px;font-weight:600;color:${mauDoc(m.chu, nenTB)};white-space:nowrap;`));
      if (tay) gT.setAttribute('filter', K.locNetTay(svT, { hat: hat + 3, do_run: 1.4, tan_so: 0.035 }));
      tb = { g: gT, c: cT, h: hTB + (dt ? 52 : TB + 16) };
      mocTB = [xTB + (dt ? wTB : 520) / 2, yTB + hTB / 2];
    }

    // ---------- lịch ----------
    const tinh = opt.tinh || (opt.vao != null && opt.vao < 0), vao = opt.vao > 0 ? opt.vao : 0;
    const tMuc = dsMuc.map((_, i) => (opt.moc_hien && opt.moc_hien[i] != null ? opt.moc_hien[i] - vao : 0.45 + i * 0.14));
    const hetMuc = dsMuc.length ? Math.max(...tMuc) + 0.35 : 0.5;
    const tTB = opt.moc_thong_bao != null ? opt.moc_thong_bao - vao : hetMuc + 0.6;
    const tBam = opt.moc_bam != null ? opt.moc_bam - vao : null;
    const dat = (d, p) => {
      const tr = `translate(0 ${((1 - p) * 16).toFixed(2)})`;
      d.g.setAttribute('transform', tr); d.g.style.opacity = K.cl(p).toFixed(3);
      d.c.style.transform = `translateY(${((1 - p) * 16).toFixed(2)}px)`; d.c.style.opacity = K.cl(p).toFixed(3);
    };
    const sc = (x, y) => [X0 + x * co, Y0 + y * co];

    return {
      el,
      seek(t) {
        const s = tinh ? 1e6 : t - vao;
        const pk = K.spr(s, 0.5, 0.7);
        khoi.style.transform = `translateY(${((1 - pk) * 90).toFixed(2)}px) scale(${(0.94 + 0.06 * pk).toFixed(4)})`;
        khoi.style.opacity = K.cl(s / 0.2).toFixed(3);
        el.style.transform = co !== 1 ? `scale(${co})` : '';
        dsMuc.forEach((d, i) => dat(d, K.eo3(K.tienDo(s, tMuc[i], 0.35))));
        if (nutG) {
          // nhịp sáng nhẹ sau khi hiện; lún khi bấm
          const sauHien = s - hetMuc;
          const nhip = sauHien > 0 && tBam == null ? 0.5 - 0.5 * Math.cos((sauHien % 2) / 2 * Math.PI * 2) : 0;
          let lun = 1, pv = 0;
          if (tBam != null) { const tb2 = s - tBam; lun = tb2 > 0 && tb2 < 0.3 ? 1 - 0.06 * Math.sin((tb2 / 0.3) * Math.PI) : 1; pv = K.tienDo(s, tBam, 0.6); }
          const cx = mocNut[0], cy = mocNut[1];
          nutG.setAttribute('transform', `translate(${cx} ${cy}) scale(${(lun + nhip * 0.025).toFixed(4)}) translate(${-cx} ${-cy})`);
          nutC.style.transform = `scale(${(lun + nhip * 0.025).toFixed(4)})`;
          vongBam.setAttribute('r', (10 + K.eo3(pv) * 120).toFixed(1));
          vongBam.style.opacity = (pv > 0 && pv < 1 ? (1 - pv) * 0.6 : 0).toFixed(3);
        }
        if (tb) {
          const giu = opt.giu_thong_bao, ra = giu != null ? K.eio(K.tienDo(s, tTB + giu, 0.4)) : 0;   // giu_thong_bao: giây giữ rồi trượt lên
          const p = K.spr(s - tTB, 0.45, 0.68) * (1 - ra);
          const dy = (1 - p) * -(tb.h + 20);
          tb.c.style.transform = `translateY(${dy.toFixed(2)}px)`;
          const mo = s - tTB <= 0 ? 0 : K.cl((s - tTB) / 0.15);
          tb.c.style.opacity = mo.toFixed(3);
        }
      },
      moc: {
        tam: sc(W / 2, H / 2), tren: sc(W / 2, 0), duoi: sc(W / 2, H), trai: sc(0, H / 2), phai: sc(W, H / 2),
        so_du: mocSoDu ? sc(...mocSoDu) : null, nut: mocNut ? sc(...mocNut) : null, thong_bao: mocTB ? sc(...mocTB) : null,
        dong: mocDong.map((p) => sc(...p)), chi_tiet: mocCT.map((p) => sc(...p)), rong: W * co, cao: HE * co,
      },
    };
  };
  K.man_hinh = K.man_hinh_ung_dung;
})();
