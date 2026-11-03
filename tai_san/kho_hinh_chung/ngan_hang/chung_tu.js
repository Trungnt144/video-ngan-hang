// ngan_hang/chung_tu.js — 1.2 — bộ chứng từ MÔ PHỎNG: hoá đơn giá trị gia tăng, tờ khai thuế giá trị gia tăng, chồng nhiều tờ (bốn tờ khai bốn quý);
// tờ trượt vào, các dòng hiện dần, tô sáng ô bằng vệt bút dạ, khoanh ô sai kèm nhãn bên lề, dấu tròn đóng xuống, số chạy.
// 1.2 (03/11/2026, theo phản hồi N203):
//   - KÍCH THƯỚC CỐ ĐỊNH: tờ không tự nới. Bề rộng = rong (px sân khấu) hoặc co × chuẩn (hoá đơn 900, tờ khai 620); bề cao = cao (px sân khấu) hoặc co × chuẩn
//     (hoá đơn 660, tờ khai 820). Khoảng cách dòng co giãn cho vừa tờ. Chữ không vừa ô thì xuống dòng trong ô, quá số dòng thì cắt bớt kèm "…";
//     chữ 28 px không vừa bề rộng ô thì ô đó thành vạch giả lập chữ. Mọi trường hợp cắt, đổi vạch đều báo console.warn. Không thu chữ dưới 28 px.
//     Tờ quá thấp cho mọi chữ được truyền: chỉ giữ tiêu đề, kỳ khai, ô nêu trong to_sang, sai, so_chay; vẫn không đủ thì mọi ô thành vạch.
//   - KHUNG VẼ: khung: { x, y, rong, cao } (mặc định x 0–1920, y 0–950, chừa dải phụ đề y 960–1080). Tờ, bóng, nhãn "Mô phỏng", nhãn "Ví dụ giả định",
//     nhãn bên lề của sai, con dấu, các tờ trong 'chong' không vượt khung (lề 6 px): vượt thì tự thu cả tờ (hoặc cả nhóm) theo tỉ lệ, dời vào trong, báo console.warn.
//     Quãng trượt vào cũng bị giới hạn trong khung (không đủ chỗ thì chỉ hiện dần và phóng nhẹ).
//   - KHÔNG SỐ MẶC ĐỊNH: không tên, mã số thuế, số tiền, đơn giá, thành tiền, giá trị chỉ tiêu, tên chỉ tiêu mặc định; ô dữ liệu không truyền là vạch giả lập chữ.
//     Ô dữ liệu chỉ hiện chữ khi truyền vào (kể cả khi được tô, khoanh: khi đó vạch được tô, khoanh). Nhãn mẫu in sẵn của tờ ("Mã số thuế:", "Tiền thuế GTGT:")
//     hiện khi dòng được nêu trong to_sang, sai, so_chay. Tờ có số do video truyền thì hiện nhãn "Ví dụ giả định" (≥ 28 px, sát dưới tờ);
//     nhan_vi_du: false tắt, nhan_vi_du: 'chữ khác' đổi chữ. Trong 'chong' hai nhãn "Mô phỏng", "Ví dụ giả định" là nhãn chung của nhóm.
//   - Đổi so với 1.1: rong nay là px sân khấu (1.1: bề rộng ở co = 1); bỏ tự nới tờ và nới cột; truot mặc định vẫn 'duoi' nhưng không xoay, quãng trượt theo chỗ trống.
// 1.1 (03/11/2026, "ít chữ"): mặc định mọi dòng là vạch giả lập chữ; chữ hiện ra ≥ 28 px; kiểu 'toi_gian' và net; chu: false; nhãn "Mô phỏng" tắt bằng false.
// Gọi: KHO.bo_chung_tu_hoa_don({ loai, kieu, net, chu, mau, x, y, co, rong, cao, khung, gon, xoay, truot, nhan_mo_phong, nhan_vi_du, vao, moc_hien, tinh, hat,
//        to_sang, sai, dau, so_chay, ...nội dung }); bí danh KHO.chung_tu.
//   loai 'hoa_don_gtgt' (mặc định) | 'to_khai_gtgt' | 'chong' (nhiều tờ); x, y: góc trên trái của tờ trong sân khấu (mặc định giữa khung);
//   co: tỉ lệ so với kích thước chuẩn (mặc định 1; 'chong' 0,42); rong, cao: kích thước tờ bằng px sân khấu (rong thay co; cao đổi tỉ lệ cao/rộng);
//   khung: { x, y, rong, cao } vùng tờ được phép chiếm (px sân khấu); gon: true/false ép chế độ thu nhỏ (mặc định tự bật khi co < 0,8: chữ truyền vào
//        cũng thành vạch, trừ tiêu đề, kỳ khai và ô nêu trong to_sang, sai, so_chay); xoay: độ nghiêng tờ; truot: 'duoi' | 'tren' | 'trai' | 'phai' | false;
//   nhan_mo_phong: chữ nhãn "Mô phỏng" (false là bỏ); nhan_vi_du: chữ nhãn "Ví dụ giả định" (false là bỏ); vao: giây tờ xuất hiện (-1 hiện đủ);
//   moc_hien: mảng giây hiện từng dòng sau tiêu đề (giây tuyệt đối như vao; thiếu thì nối 0,12 giây); tinh: true hiện đủ;
//   kieu 'phang' | 'net_tay' | 'toi_gian' (giấy phẳng, vạch phẳng, ô bảng, không bóng, không khung trang trí); net (toi_gian): { day (0 = không viền), mau (khoá màu, 'chu') };
//   chu: false tắt mọi chữ (chỉ còn hình); hat: hạt giống nét tay.
//   Hiệu ứng (giây tuyệt đối): to_sang: [{ truong, moc, het }] vệt bút dạ màu canh_bao; sai: [{ truong, moc, het, nhan, ben: 'phai' | 'trai' }] vòng khoanh màu xau,
//        gạch chéo nhỏ, nhãn bên lề; dau: { chu (không truyền: dấu không chữ, có dấu tích), moc, khoa_mau ('xau'), truong, x, y (toạ độ trong tờ ở co = 1) };
//        so_chay: [{ truong, tu, den, moc, dai (0,9), thap_phan (0), dinh_dang (hàm số → chữ) }] số chạy từ tu tới den (tính là số do video truyền).
//   Nội dung hoá đơn (không truyền là vạch): tieu_de, ky_hieu, so, ngay, ma_cqt (false bỏ dòng), ben_ban: { ten, mst, dia_chi }, ben_mua: { ten, mst, dia_chi }
//        (trường false bỏ dòng), hang: [{ stt, ten, dvt, sl, don_gia, thanh_tien }] (mặc định một dòng trơn), tieu_de_cot (6 chữ đầu cột),
//        tien_hang, thue_suat, tien_thue, tong, nhan_tong: { tien_hang, thue_suat, tien_thue, tong } (chữ nhãn; false bỏ nhãn), chu_ky: { nhan, ky_boi, ngay_ky } hoặc false.
//   Nội dung tờ khai: tieu_de, ky, nhan_ky, ten, mst, chi_tieu: [{ ma, ten, gia_tri, nhom }] (mặc định sáu dòng trơn), tieu_de_cot (['Chỉ tiêu', 'Số tiền (đồng)']),
//        xac_nhan: { chu, ngay } hoặc false. Không ghi mã chỉ tiêu, số hiệu mẫu, số hiệu văn bản trừ khi truyền.
//   'chong': to: [opt từng tờ] (mỗi tờ nhận kieu, net, chu, mau, co, hat của nhóm nếu không tự ghi), xep 'hang' (mặc định) | 'chong', cot (số tờ mỗi hàng),
//        gian (px, 28), lech (px), moc_hien: mảng giây hiện từng tờ; nhan_mo_phong, nhan_vi_du của nhóm.
// Tên ô (truong) hoá đơn: tieu_de, so_hieu (dòng), ky_hieu, so, ngay, ma_cqt, ben_ban.ten, ben_ban.mst, ben_ban.dia_chi, ben_mua.ten, ben_mua.mst, ben_mua.dia_chi,
//        bang (dòng đầu cột; ô bang.<cột>), hang.<i> (dòng), hang.<i>.<stt|ten|dvt|sl|don_gia|thanh_tien>, tien_hang, thue_suat, tien_thue, tong, chu_ky;
//   tờ khai: tieu_de, ky, ten, mst, bang, chi_tieu.<i> (dòng), chi_tieu.<i>.ten, chi_tieu.<i>.gia_tri, xac_nhan. Thêm '.gia_tri' chỉ riêng ô số, '.nhan' chỉ riêng nhãn.
// el là phần tử HTML đặt tuyệt đối (hợp đồng mục 7); tờ giấy, khung bảng, vệt tô, vòng khoanh, dấu là SVG; tờ giấy và ô có viền gắn data-hop; chữ dấu gắn data-chong.
// Màu: giấy luôn sáng (m.giay; nét tay trộn m.da), mực luôn tối, kể cả bộ nền tối; chữ chính ≥ 7, chữ phụ ≥ 4,6 tương phản.
// Trả về { el, seek(t), moc }: moc { hop, truong: { tên ô: { x, y, w, h } }, dau, ghi_chu, nhan_mo_phong, nhan_vi_du, bao (hộp bao mọi phần tử), co, xong } theo toạ độ sân khấu;
//   'chong' thêm to: [moc từng tờ], truong gộp có tiền tố số tờ ('3.chi_tieu.4').
// Dựng mới 03/11/2026 (lô N196–N205). Kiểu dáng tờ giấy, vệt bút dạ, dấu nện theo ngan_hang/giay_to.js (không gọi hàm của nó).
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  let demId = 0;
  const LH = 1.25;           // hệ số cao dòng
  const CO_NHO = 20;         // chữ nhỏ nhất ở co = 1 (để quyết định chế độ gọn)
  const CO_MIN = 28;         // cỡ chữ tối thiểu trên màn hình của mọi chữ hiện ra
  const CHUAN = { hoa_don_gtgt: { W: 900, H: 660 }, to_khai_gtgt: { W: 620, H: 820 } };
  const KHUNG = { x: 0, y: 0, rong: 1920, cao: 950 };
  const LE = 6;              // lề an toàn trong khung (px sân khấu)
  const baoLoi = (ds) => { const da = new Set(); ds.forEach((s) => { if (!da.has(s)) { da.add(s); console.warn('[bo_chung_tu_hoa_don] ' + s); } }); };
  const gop = (ds) => { ds = ds.filter(Boolean); if (!ds.length) return null; const x = Math.min(...ds.map((r) => r.x)), y = Math.min(...ds.map((r) => r.y)); return { x, y, w: Math.max(...ds.map((r) => r.x + r.w)) - x, h: Math.max(...ds.map((r) => r.y + r.h)) - y }; };
  const trongKhung = (b, k) => b.x >= k.x + LE - 0.5 && b.y >= k.y + LE - 0.5 && b.x + b.w <= k.x + k.rong - LE + 0.5 && b.y + b.h <= k.y + k.cao - LE + 0.5;
  const coTruyen = (v) => v != null && v !== false && v !== '';

  function duTuongPhan(mau, nen, nguong) {
    if (K.tuongPhan(mau, nen) >= nguong) return mau;
    const dich = K.doSang(nen) > 0.4 ? '#000000' : '#FFFFFF';
    for (let p = 0.05; p <= 1.001; p += 0.05) { const c = K.tron(mau, dich, p); if (K.tuongPhan(c, nen) >= nguong) return c; }
    return dich;
  }
  // đường cong mượt qua dãy điểm (Catmull-Rom sang Bézier bậc ba)
  function duongMuot(pts) {
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    return d;
  }
  // điểm của hình chữ nhật bo góc (để vẽ nét tay)
  function diemBo(x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    const p = [], goc = [[x + w - r, y + r, -90], [x + w - r, y + h - r, 0], [x + r, y + h - r, 90], [x + r, y + r, 180]];
    for (const [cx, cy, a0] of goc) for (let i = 0; i <= 4; i++) { const a = ((a0 + i * 22.5) * Math.PI) / 180; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return p;
  }
  // "Ngày 15 tháng 3 năm 2026" → "15/03/2026"
  function ngaySo(s) {
    const k = /(\d{1,2})\D+(\d{1,2})\D+(\d{4})/.exec(String(s || ''));
    return k ? `${k[1].padStart(2, '0')}/${k[2].padStart(2, '0')}/${k[3]}` : '';
  }
  // ngày nộp mô phỏng: ngày 20 của tháng ngay sau kỳ ('Quý 1/2026' → 20/04/2026; 'Tháng 5/2026' → 20/06/2026)
  function ngayNop(ky) {
    const s = String(ky || '');
    let q = /qu[ýy]\s*(\d)\D+(\d{4})/i.exec(s), thang, nam;
    if (q) { thang = +q[1] * 3 + 1; nam = +q[2]; } else if ((q = /th[áa]ng\s*(\d{1,2})\D+(\d{4})/i.exec(s))) { thang = +q[1] + 1; nam = +q[2]; } else return '';
    if (thang > 12) { thang -= 12; nam += 1; }
    return `20/${String(thang).padStart(2, '0')}/${nam}`;
  }

  // Bộ vẽ hình khối trong một <svg>: phẳng nét sạch; nét tay hai nét chì lệch hạt giống, tô loang, gạch chéo.
  function boVe(tay, m, hatRef) {
    const gach = (svg, mau, mo, goc = 38, buoc = 9) => {
      const id = `kho-ct-g${++demId}`;
      const p = K.svg('pattern', { id, width: buoc, height: buoc, patternUnits: 'userSpaceOnUse', patternTransform: `rotate(${goc})` }, K.defs(svg));
      K.svg('line', { x1: 0, y1: 0, x2: 0, y2: buoc, stroke: mau, 'stroke-width': 1.7, opacity: mo }, p);
      return `url(#${id})`;
    };
    const cn = (cha, x, y, w, h, o = {}) => {
      const net = o.net === undefined ? m.vien : o.net, day = o.day || 2;
      if (!tay) return K.svg('rect', { x, y, width: w, height: h, rx: o.bo || 0, fill: o.to || 'none', stroke: net || 'none', 'stroke-width': day, 'stroke-dasharray': o.dut || null, opacity: o.mo != null ? o.mo : null }, cha);
      const pts = o.bo > 5 ? diemBo(x, y, w, h, o.bo) : [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], nh = K.svg('g', { opacity: o.mo != null ? o.mo : null }, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 0.8, dong: true }), fill: o.to }, nh);
      if (o.gach) K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 0.8, dong: true }), fill: gach(K.svgGoc(nh) || cha, o.gach[0], o.gach[1]) }, nh);
      if (net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 1.2, dong: true }), fill: 'none', stroke: net, 'stroke-width': day * 0.9, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', 'stroke-dasharray': o.dut || null }, nh);
        K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 1.9, dong: true }), fill: 'none', stroke: net, 'stroke-width': Math.max(1, day * 0.4), opacity: 0.45, 'stroke-linecap': 'round' }, nh);
      }
      return nh;
    };
    const vach = (cha, pts, o = {}) => {
      const mau = o.mau || m.vien, day = o.day || 2;
      if (!tay) return K.svg('path', { d: 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L'), fill: 'none', stroke: mau, 'stroke-width': day, 'stroke-linecap': 'round', 'stroke-dasharray': o.dut || null, opacity: o.mo != null ? o.mo : null }, cha);
      const nh = K.svg('g', { opacity: o.mo != null ? o.mo : null }, cha);
      K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 1 }), fill: 'none', stroke: mau, 'stroke-width': day * 0.95, 'stroke-linecap': 'round', 'stroke-dasharray': o.dut || null }, nh);
      K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 1.7 }), fill: 'none', stroke: mau, 'stroke-width': Math.max(1, day * 0.4), opacity: 0.5, 'stroke-linecap': 'round' }, nh);
      return nh;
    };
    const tron = (cha, cx, cy, r, o = {}) => {
      if (!tay) return K.svg('circle', { cx, cy, r, fill: o.to || 'none', stroke: o.net || 'none', 'stroke-width': o.day || 2 }, cha);
      const pts = [], n = Math.max(14, Math.round(r / 2.4));
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
      const nh = K.svg('g', null, cha);
      if (o.to && o.to !== 'none') K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 0.8, dong: true }), fill: o.to }, nh);
      if (o.net) {
        K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 1.2, dong: true }), fill: 'none', stroke: o.net, 'stroke-width': (o.day || 2) * 0.9, 'stroke-linecap': 'round' }, nh);
        K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 1.8, dong: true }), fill: 'none', stroke: o.net, 'stroke-width': Math.max(1, (o.day || 2) * 0.4), opacity: 0.45 }, nh);
      }
      return nh;
    };
    // dấu tích trong vòng tròn
    const tich = (cha, cx, cy, r, mau, nenTich) => {
      tron(cha, cx, cy, r, { to: mau, net: tay ? mau : null, day: 2 });
      vach(cha, [[cx - r * 0.45, cy + r * 0.02], [cx - r * 0.1, cy + r * 0.36], [cx + r * 0.48, cy - r * 0.34]], { mau: nenTich, day: Math.max(2.5, r * 0.2) });
    };
    return { cn, vach, tron, tich, gach };
  }

  // ======================================================================
  // MỘT TỜ (kích thước cố định; vị trí, cỡ đã chốt bởi hàm gọi)
  // ======================================================================
  function taoTo(opt) {
    const loai = opt.loai === 'to_khai_gtgt' ? 'to_khai_gtgt' : 'hoa_don_gtgt', CH = CHUAN[loai];
    const m = K.layMau(opt), tay = opt.kieu === 'net_tay', toiGian = opt.kieu === 'toi_gian';
    const W = CH.W, co = opt.__co || 1, H = opt.__H || CH.H, khung = opt.__khung || KHUNG;
    const gon = opt.gon != null ? !!opt.gon : CO_NHO * co < 16;
    const chuTat = opt.chu === false;
    const NET = Object.assign({ day: 0, mau: 'chu' }, opt.net || {}), mauNet = m[NET.mau] || m.chu;
    const fChu = (goc) => Math.max(goc, CO_MIN / co);
    const hatRef = { v: opt.hat || 131 };
    const B = boVe(tay, m, hatRef);
    const canh = [];

    // ----- màu: giấy sáng, mực tối -----
    const giay = tay ? K.tron(m.giay, m.da, 0.16) : m.giay;
    let muc = K.tuongPhan(giay, m.chu) >= 7 ? m.chu : (m.toi ? m.nen : m.chu);
    muc = duTuongPhan(muc, giay, 7);
    const mucPhu = duTuongPhan(K.tron(muc, giay, 0.38), giay, 4.6);
    const mauNhan = duTuongPhan(m.nhan, giay, 4.6);
    const mauXau = duTuongPhan(m.xau, giay, 3.2), chuXau = duTuongPhan(m.xau, giay, 4.6);
    const mauTot = duTuongPhan(m.tot, giay, 3.2), chuTot = duTuongPhan(m.tot, giay, 4.6);
    const mauLuoi = K.rgba(muc, tay ? 0.55 : 0.32), dayLuoi = toiGian && NET.day > 0 ? NET.day : 1.5;
    const nenDauBang = K.tron(giay, m.nhan, 0.1);
    const mauToSang = m.canh_bao;

    // ----- ô được nêu, số chạy -----
    const dsToSang = [].concat(opt.to_sang || []), dsSai = [].concat(opt.sai || []), dsChay = [].concat(opt.so_chay || []);
    const giu = new Set();
    [...dsToSang, ...dsSai, ...dsChay].forEach((e) => { if (e && e.truong) giu.add(String(e.truong)); });
    const tenOSo = (tr) => (/\.gia_tri$|^(ky_hieu|so|ngay|ma_cqt)$|^hang\.\d+\.\w+$/.test(tr) ? tr : /^hang\.\d+$/.test(tr) ? tr + '.thanh_tien' : tr + '.gia_tri');
    const chay = {};
    dsChay.forEach((e) => { if (e && e.truong) { chay[tenOSo(e.truong)] = e; giu.add(tenOSo(e.truong)); } });
    const laGiu = (ten) => {
      if (!ten) return false;
      for (const g of giu) {
        if (ten === g) return true;
        if (gon ? (ten === g + '.gia_tri' || ten === g + '.thanh_tien') : ten.startsWith(g + '.')) return true;
      }
      return false;
    };
    const dinhDang = (e, v) => (typeof e.dinh_dang === 'function' ? e.dinh_dang(v) : K.so(v, e.thap_phan || 0));

    // ----- ô có hiện chữ không -----
    // du_lieu: ô dữ liệu (tên, mã số thuế, số tiền...) chỉ hiện khi truyền; ô nhãn in sẵn hiện khi truyền hoặc khi dòng được nêu.
    // cap 1: đủ chữ; cap 2: chỉ ô được nêu và tiêu đề, kỳ khai; cap 3: mọi ô là vạch.
    const C = { k: 1, cap: 1, canh: [] };
    const se = (c) => {
      if (chuTat || !c.s || C.cap >= 3) return false;
      const neu = laGiu(c.ten), truyen = !!c.truyen || !!(c.ten && chay[c.ten]);
      if (c.du_lieu ? !truyen : !(truyen || neu)) return false;
      if ((gon || C.cap >= 2) && !neu && !c.ca_gon) return false;
      return true;
    };
    // ô chữ: spec { ten, s, truyen, du_lieu, ca_gon, x, w, co, dam, mau, can, nghieng, mot_dong, toi_da (số dòng), dy }
    const o = (sp) => {
      const c = Object.assign({ co: 24, dam: 600, mau: muc, can: 'left', dy: 0, toi_da: 3 }, sp);
      c.s = c.s == null || c.s === false ? '' : String(c.s);
      c.giu = se(c);
      const ce = c.ten && chay[c.ten];
      const goi = c.ten || c.s;
      if (c.giu) {
        const f = fChu(c.co);
        if (c.mot_dong || ce) {
          const ds = ce ? [dinhDang(ce, ce.tu || 0), dinhDang(ce, ce.den || 0)] : [c.s];
          const r = Math.max(...ds.map((x) => K.doChu(x, f, c.dam)));
          if (r > c.w + 0.5) { c.giu = false; C.canh.push(`ô ${goi}: chữ ${CO_MIN} px không vừa bề rộng ô, dùng vạch giả lập chữ`); }
          else { c.f = f; c.dong = [ds[0]]; c.rong = r; }
        } else {
          let dong = K.xuongDong(c.s, c.w, f, c.dam);
          if (dong.some((d) => K.doChu(d, f, c.dam) > c.w + 0.5)) { c.giu = false; C.canh.push(`ô ${goi}: có từ dài hơn bề rộng ô ở ${CO_MIN} px, dùng vạch giả lập chữ`); }
          else {
            if (dong.length > c.toi_da) {
              dong = dong.slice(0, c.toi_da);
              let cuoi = dong[c.toi_da - 1] + '…';
              while (cuoi.length > 2 && K.doChu(cuoi, f, c.dam) > c.w) cuoi = cuoi.slice(0, -2).trimEnd() + '…';
              dong[c.toi_da - 1] = cuoi;
              C.canh.push(`ô ${goi}: chữ dài quá ${c.toi_da} dòng, đã cắt bớt`);
            }
            c.f = f; c.dong = dong; c.rong = Math.max(...dong.map((d) => K.doChu(d, f, c.dam)));
          }
        }
      }
      if (!c.giu) { c.f = c.co; c.dong = c.s ? [c.s] : []; c.rong = c.s ? Math.min(c.w, K.doChu(c.s, c.co, c.dam)) : 0; c.lh = c.co * LH * C.k; }
      else c.lh = c.f * LH;
      c.h = c.dong.length * c.lh;
      return c;
    };
    const hang = (ten, y, os, tuy = {}) => {
      os.forEach((c) => { c.y = y + c.dy; });
      const h = tuy.h != null ? tuy.h : Math.max(0, ...os.map((c) => c.dy + c.h)) + (tuy.duoi || 0);
      return { ten, x: tuy.x != null ? tuy.x : 0, y, w: tuy.w != null ? tuy.w : 0, h, o: os, ve: tuy.ve || null, so: tuy.so || null, nen: tuy.nen || null };
    };
    // ô giả định có hiện không (để đo cột, nhãn trước khi tạo ô)
    const coDo = (sp, goc) => (se(Object.assign({ s: 'x' }, sp)) ? fChu(goc) : goc);
    Object.assign(C, { o, hang, B, gon, co, m, tay, toiGian, NET, mauNet, giay, muc, mucPhu, mauNhan, mauLuoi, dayLuoi, nenDauBang, mauTot, chuTot, coDo, fChu });

    // ----- dàn trang vừa bề cao cố định: tìm hệ số giãn dòng k -----
    const dung = loai === 'to_khai_gtgt' ? dungToKhai : dungHoaDon;
    const thu = (k, cap) => { C.k = k; C.cap = cap; C.canh = []; return dung(opt, C, W, H); };
    let L = null, capDung = 1;
    for (let cap = 1; cap <= 3 && !L; cap++) {
      const kMin = cap === 3 ? 0.05 : 0.5;
      if (cap < 3 && thu(kMin, cap).cao > H) continue;
      capDung = cap;
      if (thu(1.6, cap).cao <= H) { L = thu(1.6, cap); break; }
      let lo = kMin, hi = 1.6;
      for (let i = 0; i < 16; i++) { const g = (lo + hi) / 2; if (thu(g, cap).cao <= H) lo = g; else hi = g; }
      L = thu(lo, cap);
    }
    canh.push(...C.canh);
    if (capDung === 2) canh.push(`tờ ${loai} cao ${Math.round(H * co)} px không đủ cho mọi chữ được truyền: chỉ giữ tiêu đề, kỳ khai và ô nêu trong to_sang, sai, so_chay`);
    if (capDung === 3) canh.push(`tờ ${loai} cao ${Math.round(H * co)} px không đủ cho chữ ${CO_MIN} px: mọi ô thành vạch giả lập chữ`);
    if (L.cao > H + 1) canh.push(`tờ ${loai}: nội dung cao hơn tờ ngay cả khi thu hết khoảng cách dòng`);
    const timHop = (ten) => {
      for (const r of L.hang) {
        if (r.ten === ten) return { x: r.x, y: r.y, w: r.w, h: r.h };
        for (const c of r.o) if (c.ten === ten) return c.hop || { x: c.x, y: c.y, w: c.w, h: c.h };
      }
      return null;
    };

    // ----- con dấu: nằm gọn trong tờ -----
    const dau = opt.dau ? Object.assign({}, typeof opt.dau === 'object' ? opt.dau : (opt.dau === true ? {} : { chu: String(opt.dau) })) : null;
    let DAU = null;
    if (dau) {
      const fD = fChu(24);
      let coChu = !chuTat && typeof dau.chu === 'string' && dau.chu.trim() !== '';
      const chuD = coChu ? dau.chu.toUpperCase() : '';
      let dongD = coChu ? K.xuongDong(chuD, fD * 6.2, fD, 800) : [];
      if (dongD.length > 3) dongD = K.xuongDong(chuD, fD * 9, fD, 800);
      const rongD = dongD.length ? Math.max(...dongD.map((d) => K.doChu(d, fD, 800))) : 0;
      let R = coChu ? Math.max(fD * 2.7, Math.hypot(rongD / 2, (dongD.length * fD * 1.15) / 2) + fD * 0.9) : 66;
      const rMax = Math.min(W, H) * 0.3;
      if (R > rMax) { if (coChu) canh.push(`chữ con dấu "${dau.chu}" ${CO_MIN} px không vừa tờ, bỏ chữ trên dấu`); coChu = false; dongD = []; R = Math.min(66, rMax); }
      let cx, cy;
      if (dau.x != null && dau.y != null) { cx = dau.x; cy = dau.y; }
      else if (dau.truong && timHop(dau.truong)) { const r = timHop(dau.truong); cx = r.x + r.w / 2; cy = r.y + r.h / 2; }
      else { cx = L.dau_mac_dinh[0] - R; cy = L.dau_mac_dinh[1]; }
      cx = K.cl(cx, R + 10, W - R - 10); cy = K.cl(cy, R + 10, H - R - 10);
      const khoa = dau.khoa_mau && m[dau.khoa_mau] ? dau.khoa_mau : 'xau';
      DAU = { cx, cy, R, fD, dongD, mauNet: duTuongPhan(m[khoa], giay, 3.2), mauChu: duTuongPhan(m[khoa], giay, 4.6) };
    }

    // ----- vị trí trên sân khấu -----
    const X0 = opt.x != null ? opt.x : Math.round(khung.x + (khung.rong - W * co) / 2), Y0 = opt.y != null ? opt.y : Math.round(khung.y + (khung.cao - H * co) / 2);
    const goc = ((opt.xoay || 0) * Math.PI) / 180, cs = Math.cos(goc), sn = Math.sin(goc);
    const sanXY = (ix, iy) => { const dx = ix - W / 2, dy = iy - H / 2; return [X0 + co * (W / 2 + dx * cs - dy * sn), Y0 + co * (H / 2 + dx * sn + dy * cs)]; };
    const sanHop = (r) => {
      const p = [sanXY(r.x, r.y), sanXY(r.x + r.w, r.y), sanXY(r.x, r.y + r.h), sanXY(r.x + r.w, r.y + r.h)];
      const xs = p.map((q) => q[0]), ys = p.map((q) => q[1]), x = Math.min(...xs), y = Math.min(...ys);
      return { x: +x.toFixed(1), y: +y.toFixed(1), w: +(Math.max(...xs) - x).toFixed(1), h: +(Math.max(...ys) - y).toFixed(1) };
    };

    // ----- khung phần tử -----
    const el = K.html('div', { class: 'kho-chung-tu', style: `position:absolute;left:${X0}px;top:${Y0}px;width:${W}px;height:${H}px;font-family:${K.PHONG};transform-origin:0 0;` +
      `transform:scale(${co})${goc ? ` translate(${W / 2}px,${H / 2}px) rotate(${opt.xoay}deg) translate(${-W / 2}px,${-H / 2}px)` : ''};pointer-events:none;` });
    if (opt.duoi) el.setAttribute('data-chong', '1');
    const khoi = K.html('div', { style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:${W / 2}px ${H / 2}px;` }, el);
    const nay = K.html('div', { style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;` }, khoi);
    const lopSvg = (cha) => K.svg('svg', { width: W, height: H, style: 'position:absolute;left:0;top:0;overflow:visible;' }, cha);
    const svNen = lopSvg(nay), svTo = lopSvg(nay);
    const giayDiv = K.html('div', { 'data-hop': '1', style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;` }, nay);
    const svTren = lopSvg(nay);
    const lopDau = K.html('div', { 'data-chong': '1', style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;` }, nay);
    const lopLe = K.html('div', { style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;` }, nay);
    const vungThem = [];     // hộp các phần tử nằm ngoài tờ (toạ độ trong tờ), để tính hộp bao

    // ----- tờ giấy -----
    if (tay) { B.cn(svNen, 12, 14, W, H, { net: null, gach: [muc, 0.22] }); vungThem.push({ x: 12, y: 14, w: W, h: H }); }
    else if (!toiGian) { K.svg('rect', { x: 6, y: 12, width: W, height: H, rx: 6, fill: '#000', opacity: m.toi ? 0.34 : 0.13 }, svNen); vungThem.push({ x: 6, y: 12, w: W, h: H }); }
    if (toiGian) B.cn(svNen, 0, 0, W, H, { to: giay, net: NET.day > 0 ? mauNet : null, day: NET.day, bo: 4 });
    else B.cn(svNen, 0, 0, W, H, { to: giay, net: muc, day: 2.5, bo: 4 });
    L.trangTri(svNen, H);

    // ----- các dòng -----
    const truongTo = {};
    const vungChu = (c) => {
      const x = c.can === 'right' ? c.x + c.w - c.rong : c.can === 'center' ? c.x + (c.w - c.rong) / 2 : c.x;
      return { x, y: c.y, w: c.rong, h: c.h };
    };
    const dsDong = [];
    let coSo = dsChay.length > 0;
    L.hang.forEach((r) => {
      const rd = K.html('div', { style: `position:absolute;left:0;top:0;width:${W}px;height:${H}px;` }, giayDiv);
      const rs = lopSvg(rd);
      if (r.nen) B.cn(rs, r.nen.x, r.nen.y, r.nen.w, r.nen.h, { to: r.nen.to, net: null, gach: tay ? [muc, 0.18] : null });
      if (r.ve) r.ve(rs, r);
      const vung = [];
      r.o.forEach((c) => {
        if (!c.s) return;
        const v = vungChu(c);
        vung.push(v);
        if (c.ten) truongTo[c.ten] = { hop: c.hop || { x: c.x, y: c.y, w: c.w, h: c.h }, nhip: [v], c };
        if (!c.giu) {
          // vạch giả lập chữ
          c.dong.forEach((d, i) => {
            const bw = Math.min(c.w, K.doChu(d, c.co, c.dam)), bx = c.can === 'right' ? c.x + c.w - bw : c.can === 'center' ? c.x + (c.w - bw) / 2 : c.x;
            const bh = Math.min(c.co * 0.46, c.lh * 0.6), by = c.y + i * c.lh + (c.lh - bh) / 2;
            if (tay) B.vach(rs, [[bx + 2, by + bh / 2], [bx + bw - 2, by + bh / 2]], { mau: c.mau, day: bh * 0.75, mo: 0.42 });
            else if (toiGian) K.svg('rect', { x: bx, y: by, width: bw, height: bh, rx: bh / 2, fill: K.tron(giay, c.mau, 0.3) }, rs);
            else K.svg('rect', { x: bx, y: by, width: bw, height: bh, rx: bh / 2, fill: c.mau, opacity: 0.26 }, rs);
          });
          return;
        }
        if (c.du_lieu && /\d/.test(c.s) && !/\.stt$/.test(c.ten || '')) coSo = true;
        let cha = rd, ox = 0, oy = 0;
        if (c.hop) { cha = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${c.hop.x}px;top:${c.hop.y}px;width:${c.hop.w}px;height:${c.hop.h}px;` }, rd); ox = c.hop.x; oy = c.hop.y; }
        c.div = K.html('div', { style: `position:absolute;left:${(c.x - ox).toFixed(1)}px;top:${(c.y - oy).toFixed(1)}px;width:${c.w.toFixed(1)}px;height:${c.h.toFixed(1)}px;` +
          `font-size:${c.f.toFixed(2)}px;font-weight:${c.dam};line-height:${c.lh.toFixed(2)}px;color:${c.mau};text-align:${c.can};white-space:pre;${c.nghieng ? 'font-style:italic;' : ''}` +
          `transform-origin:${c.can === 'right' ? '100%' : c.can === 'center' ? '50%' : '0'} 50%;` }, cha, c.dong.join('\n'));
      });
      const ud = gop(vung);
      if (r.ten && !truongTo[r.ten]) truongTo[r.ten] = { hop: { x: r.x, y: r.y, w: r.w, h: r.h }, nhip: ud ? [ud] : [], o_so: r.so };
      else if (r.ten) truongTo[r.ten].o_so = truongTo[r.ten].o_so || r.so;
      dsDong.push({ r, rd });
    });
    const oSo = (ten) => { const t = truongTo[ten]; if (!t) return null; if (t.c && t.c.div) return t.c; const ts = t.o_so && truongTo[t.o_so]; return ts && ts.c && ts.c.div ? ts.c : null; };

    // ----- nhãn "Mô phỏng" vắt qua mép trên, nhãn "Ví dụ giả định" sát dưới tờ -----
    const nhanNho = (chu, x, y, nenKhoa) => {
      const f = fChu(CO_NHO), w = Math.ceil(K.doChu(chu, f, 700)) + f * 1.3, h = f * 1.6;
      const nen = K.tron(giay, m[nenKhoa], 0.45), mauChu = duTuongPhan(muc, nen, 7);
      const xx = typeof x === 'function' ? x(w) : x, yy = typeof y === 'function' ? y(h) : y;
      B.cn(svTren, xx, yy, w, h, { to: nen, net: toiGian ? (NET.day > 0 ? mauNet : null) : muc, day: toiGian ? NET.day : 1.5, bo: h / 2 });
      K.html('div', { 'data-hop': '1', style: `position:absolute;left:${xx}px;top:${yy}px;width:${w}px;height:${h}px;display:flex;align-items:center;justify-content:center;font-size:${f}px;font-weight:700;color:${mauChu};white-space:nowrap;` }, lopLe, chu);
      const r = { x: xx, y: yy, w, h };
      vungThem.push(r);
      return r;
    };
    const chuMP = opt.nhan_mo_phong === false || chuTat ? '' : (opt.nhan_mo_phong || 'Mô phỏng');
    const mocNhanMP = chuMP ? nhanNho(chuMP, (w) => Math.max(8, W - 40 - w), (h) => -h / 2, 'canh_bao') : null;
    const chuVD = coSo && opt.nhan_vi_du !== false && !chuTat ? (typeof opt.nhan_vi_du === 'string' && opt.nhan_vi_du ? opt.nhan_vi_du : 'Ví dụ giả định') : '';
    const mocNhanVD = chuVD ? nhanNho(chuVD, 30, H + 10, 'nhat') : null;

    // ----- vệt bút dạ -----
    const dsVet = [];
    dsToSang.forEach((e) => {
      const t = e && truongTo[e.truong];
      if (!t) { if (e && e.truong) canh.push(`to_sang: không có ô ${e.truong}`); return; }
      t.nhip.forEach((v) => {
        const g = K.svg('g', null, svTo), x = v.x - 8, y = v.y + v.h * 0.06, w = v.w + 16, h = v.h * 0.9;
        if (tay) B.cn(g, x, y, w, h, { to: K.rgba(mauToSang, 0.4), net: null, gach: [mauToSang, 0.55] });
        else if (toiGian) K.svg('rect', { x, y, width: w, height: h, rx: 4, fill: K.rgba(mauToSang, 0.45) }, g);
        else K.svg('path', { d: `M${x + 5} ${y} L${x + w + 5} ${y} L${x + w - 5} ${y + h} L${x - 5} ${y + h} Z`, fill: K.rgba(mauToSang, 0.42), 'stroke-linejoin': 'round', stroke: K.rgba(mauToSang, 0.42), 'stroke-width': 4 }, g);
        dsVet.push({ g, x, e });
      });
    });

    // ----- ô sai: vòng khoanh, gạch chéo, nhãn bên lề -----
    const dsKhoanh = [], ghiChu = [];
    const daDat = { phai: [], trai: [] };
    const kPhai = khung.x + khung.rong - LE, kTrai = khung.x + LE;
    dsSai.forEach((e, k) => {
      const t = e && truongTo[e.truong];
      if (!t) { if (e && e.truong) canh.push(`sai: không có ô ${e.truong}`); return; }
      const v = t.nhip[0] || t.hop;
      const xTrai = Math.max(v.x - 26, Math.min(v.x - 10, 8)), xPhai = Math.min(v.x + v.w + 26, Math.max(v.x + v.w + 10, W - 8));
      const cx = (xTrai + xPhai) / 2, cy = v.y + v.h / 2, rx = (xPhai - xTrai) / 2, ry = v.h / 2 + 7;
      const ng = K.ngauNhien(hatRef.v + 300 + k), pts = [], n = 30;
      for (let i = 0; i <= n; i++) {
        const a = -Math.PI * 0.62 + (i / n) * Math.PI * 2.16, r = 1 + (i / n) * 0.07 + (ng(i) - 0.5) * 0.03;
        pts.push([cx + rx * r * Math.cos(a), cy + ry * r * Math.sin(a)]);
      }
      const g = K.svg('g', null, svTren);
      const vong = [K.svg('path', { d: duongMuot(pts), fill: 'none', stroke: mauXau, 'stroke-width': tay ? 3.6 : 4, 'stroke-linecap': 'round', pathLength: 1 }, g)];
      if (tay) vong.push(K.svg('path', { d: K.duongTay(pts, { hat: hatRef.v++, lech: 2 }), fill: 'none', stroke: mauXau, 'stroke-width': 1.6, opacity: 0.55, 'stroke-linecap': 'round', pathLength: 1 }, g));
      // nhãn bên lề: chọn bên còn chỗ trong khung
      const f = fChu(22), pad = f * 0.7, cach = 40;
      const dongN = e.nhan && !chuTat ? K.xuongDong(String(e.nhan), Math.max(f * 9, 280 / co), f, 700) : [];
      const wN = dongN.length ? Math.ceil(Math.max(...dongN.map((d) => K.doChu(d, f, 700)))) + pad * 2 : 0, hN = dongN.length * f * 1.25 + pad * 1.3;
      let ben = e.ben === 'trai' || e.ben === 'phai' ? e.ben : null;
      if (!ben) {
        const phaiSan = X0 + (W + cach + wN) * co, traiSan = X0 - (cach + wN) * co;
        ben = phaiSan <= kPhai || traiSan < kTrai ? (phaiSan - kPhai <= kTrai - traiSan ? 'phai' : 'trai') : 'trai';
        if (phaiSan <= kPhai) ben = 'phai';
      }
      const s = 10, qx = ben === 'phai' ? cx + rx + 4 + s * 1.6 : cx - rx - 4 - s * 1.6, qy = cy - s - 10;
      const cheo = [K.svg('path', { d: `M${qx - s} ${qy - s} L${qx + s} ${qy + s}`, stroke: mauXau, 'stroke-width': 4.5, 'stroke-linecap': 'round', pathLength: 1 }, g),
        K.svg('path', { d: `M${qx + s} ${qy - s} L${qx - s} ${qy + s}`, stroke: mauXau, 'stroke-width': 4.5, 'stroke-linecap': 'round', pathLength: 1 }, g)];
      vungThem.push({ x: cx - rx - 6, y: cy - ry - 30, w: 2 * rx + 60, h: 2 * ry + 36 });
      let gc = null;
      if (dongN.length) {
        const xN = ben === 'phai' ? W + cach : -cach - wN;
        let yN = cy - hN / 2;
        for (const r of daDat[ben]) if (yN < r[1] + 12 && yN + hN > r[0] - 12) yN = r[1] + 12;
        daDat[ben].push([yN, yN + hN]);
        const gN = K.svg('g', null, svTren);
        B.cn(gN, xN, yN, wN, hN, { to: giay, net: mauXau, day: 3, bo: 10 });
        const x1 = ben === 'phai' ? cx + rx * 1.04 : cx - rx * 1.04, x2 = ben === 'phai' ? xN : xN + wN, y2 = yN + hN / 2;
        const noi = K.svg('path', { d: `M${x1.toFixed(1)} ${cy.toFixed(1)} C${((x1 + x2) / 2).toFixed(1)} ${cy.toFixed(1)} ${((x1 + x2) / 2).toFixed(1)} ${y2.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`,
          fill: 'none', stroke: mauXau, 'stroke-width': 3, 'stroke-linecap': 'round', pathLength: 1 }, svTren);
        const div = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${xN}px;top:${yN}px;width:${wN}px;height:${hN}px;box-sizing:border-box;padding:${(pad * 0.65).toFixed(1)}px ${pad.toFixed(1)}px;` +
          `font-size:${f.toFixed(1)}px;font-weight:700;line-height:${(f * 1.25).toFixed(1)}px;color:${chuXau};white-space:pre;` }, lopLe, dongN.join('\n'));
        gc = { gN, noi, div, hop: { x: xN, y: yN, w: wN, h: hN } };
        ghiChu.push(gc.hop); vungThem.push({ x: xN - 2, y: yN - 2, w: wN + 4, h: hN + 4 });
      }
      dsKhoanh.push({ e, vong, cheo, gc, g });
    });

    // ----- con dấu -----
    let dauG = null;
    if (DAU) {
      const { cx, cy, R, fD, dongD } = DAU;
      dauG = K.svg('g', { transform: `translate(${cx.toFixed(1)} ${cy.toFixed(1)})` }, svTren);
      const trong = K.svg('g', { transform: 'rotate(-12)', opacity: 0.9 }, dauG);
      B.tron(trong, 0, 0, R, { to: K.rgba(DAU.mauNet, tay ? 0.08 : 0.06), net: DAU.mauNet, day: 5 });
      B.tron(trong, 0, 0, R - 10, { net: DAU.mauNet, day: 1.8 });
      [-R + 22, R - 22].forEach((yy) => { for (let i = -1; i <= 1; i++) K.svg('circle', { cx: i * 14, cy: yy, r: i === 0 ? 4 : 2.6, fill: DAU.mauNet }, trong); });
      if (!dongD.length) B.vach(trong, [[-R * 0.36, R * 0.02], [-R * 0.08, R * 0.3], [R * 0.4, -R * 0.28]], { mau: DAU.mauNet, day: 7 });
      const cao = dongD.length * fD * 1.15;
      if (dongD.length) DAU.div = K.html('div', { style: `position:absolute;left:${(cx - R).toFixed(1)}px;top:${(cy - cao / 2).toFixed(1)}px;width:${(2 * R).toFixed(1)}px;height:${cao.toFixed(1)}px;` +
        `font-size:${fD.toFixed(1)}px;font-weight:800;line-height:${(fD * 1.15).toFixed(1)}px;color:${DAU.mauChu};text-align:center;white-space:pre;letter-spacing:0.02em;transform-origin:50% 50%;` }, lopDau, dongD.join('\n'));
    }

    // ----- hộp bao trên sân khấu -----
    const bao = gop([sanHop({ x: 0, y: 0, w: W, h: H + 4 }), ...vungThem.map(sanHop)]);

    // ----- lịch -----
    const tinh = !!(opt.tinh || (opt.vao != null && opt.vao < 0)), vao = opt.vao > 0 ? opt.vao : 0;
    const rel = (x) => (x == null ? null : x - vao);
    const tDong = [];
    let truoc = 0.45;
    dsDong.forEach((d, i) => {
      if (i === 0) { tDong.push(0.3); return; }
      const kk = i - 1, mh = opt.moc_hien && opt.moc_hien[kk] != null ? rel(opt.moc_hien[kk]) : null;
      const t = mh != null ? mh : truoc + 0.12;
      tDong.push(t); truoc = t;
    });
    const hetDong = Math.max(...tDong) + 0.42;
    const tVet = dsVet.map((v) => ({ a: v.e.moc != null ? rel(v.e.moc) : hetDong + 0.2, b: v.e.het != null ? rel(v.e.het) : null }));
    const tKhoanh = dsKhoanh.map((d, kk) => ({ a: d.e.moc != null ? rel(d.e.moc) : hetDong + 0.5 + kk * 0.6, b: d.e.het != null ? rel(d.e.het) : null }));
    const tDau = DAU ? (dau.moc != null ? rel(dau.moc) : Math.max(hetDong, ...tKhoanh.map((x) => x.a + 1.1), ...tVet.map((x) => x.a + 0.6)) + 0.3) : null;
    const dsChayO = dsChay.map((e) => ({ e, c: oSo(e.truong), a: e.moc != null ? rel(e.moc) : hetDong + 0.2, d: e.dai || 0.9 })).filter((x) => x.c);
    const xongTuongDoi = Math.max(hetDong, ...tVet.map((x) => x.a + 0.45), ...tKhoanh.map((x) => x.a + 1.2), tDau != null ? tDau + 0.8 : 0, ...dsChayO.map((x) => x.a + x.d));
    // quãng trượt vào: không vượt khung
    const huong = { trai: [-1, 0], phai: [1, 0], duoi: [0, 1], tren: [0, -1] }[opt.truot === undefined ? 'duoi' : opt.truot] || null;
    let quang = 0;
    if (huong) {
      const cho = huong[1] > 0 ? khung.y + khung.cao - LE - (bao.y + bao.h) : huong[1] < 0 ? bao.y - khung.y - LE : huong[0] > 0 ? khung.x + khung.rong - LE - (bao.x + bao.w) : bao.x - khung.x - LE;
      quang = Math.max(0, Math.min(huong[0] ? 260 : 220, cho / co));
    }

    // ----- điểm neo -----
    const truongSan = {};
    for (const kk in truongTo) truongSan[kk] = sanHop(truongTo[kk].hop);
    const moc = {
      hop: sanHop({ x: 0, y: 0, w: W, h: H }), truong: truongSan, dau: DAU ? sanXY(DAU.cx, DAU.cy).map((v) => +v.toFixed(1)) : null,
      ghi_chu: ghiChu.map(sanHop), nhan_mo_phong: mocNhanMP ? sanHop(mocNhanMP) : null, nhan_vi_du: mocNhanVD ? sanHop(mocNhanVD) : null, bao,
      tam: sanXY(W / 2, H / 2), xong: +(vao + xongTuongDoi).toFixed(2), rong: W * co, cao: H * co, co: +co.toFixed(4), gon,
    };

    const seek = (t) => {
      const s = tinh ? 1e6 : t - vao;
      const p = K.eo3(K.tienDo(s, 0, huong ? 0.6 : 0.35));
      const dx = huong ? (1 - p) * huong[0] * quang : 0, dy = huong ? (1 - p) * huong[1] * quang : 0;
      khoi.style.transform = `translate(${dx.toFixed(1)}px,${dy.toFixed(1)}px) scale(${(0.97 + 0.03 * p).toFixed(4)})`;
      khoi.style.opacity = K.cl(s / 0.18).toFixed(3);
      dsDong.forEach((d, i) => {
        const r = d.r, pr = K.eio(K.tienDo(s, tDong[i], i === 0 ? 0.4 : 0.42));
        if (pr >= 1) { d.rd.style.clipPath = 'none'; d.rd.style.opacity = '1'; return; }
        const x0 = Math.max(0, r.x - 14), x1 = r.x + r.w + 14;
        const phai = W - (x0 + (x1 - x0) * pr);
        d.rd.style.clipPath = `inset(${(r.y - 10).toFixed(1)}px ${Math.max(0, phai).toFixed(1)}px ${Math.max(0, H - r.y - r.h - 10).toFixed(1)}px ${x0.toFixed(1)}px)`;
        d.rd.style.opacity = pr > 0 ? '1' : '0';
      });
      dsVet.forEach((v, kk) => {
        const pv = K.eio(K.tienDo(s, tVet[kk].a, 0.45)), ra = tVet[kk].b != null ? K.eo3(K.tienDo(s, tVet[kk].b, 0.3)) : 0;
        v.g.setAttribute('transform', `translate(${v.x.toFixed(1)} 0) scale(${Math.max(0.0001, pv).toFixed(4)} 1) translate(${(-v.x).toFixed(1)} 0)`);
        v.g.style.opacity = (pv > 0 ? 1 - ra : 0).toFixed(3);
      });
      dsKhoanh.forEach((d, kk) => {
        const a = tKhoanh[kk].a, ra = tKhoanh[kk].b != null ? K.eo3(K.tienDo(s, tKhoanh[kk].b, 0.3)) : 0;
        const pv = K.eio(K.tienDo(s, a, 0.6));
        d.vong.forEach((e) => { e.style.strokeDasharray = '1 1'; e.style.strokeDashoffset = (1 - pv).toFixed(4); e.style.visibility = pv <= 0 ? 'hidden' : 'visible'; });
        d.cheo.forEach((e, j) => { const pc = K.eo3(K.tienDo(s, a + 0.55 + j * 0.1, 0.14)); e.style.strokeDasharray = '1 1'; e.style.strokeDashoffset = (1 - pc).toFixed(4); e.style.visibility = pc <= 0 ? 'hidden' : 'visible'; });
        d.g.style.opacity = (1 - ra).toFixed(3);
        if (d.gc) {
          const pn = K.eio(K.tienDo(s, a + 0.45, 0.35)), pg = K.eo3(K.tienDo(s, a + 0.7, 0.3));
          d.gc.noi.style.strokeDasharray = '1 1'; d.gc.noi.style.strokeDashoffset = (1 - pn).toFixed(4); d.gc.noi.style.visibility = pn <= 0 ? 'hidden' : 'visible';
          d.gc.noi.style.opacity = (1 - ra).toFixed(3);
          const mo = (pg * (1 - ra)).toFixed(3);
          d.gc.gN.style.opacity = mo; d.gc.div.style.opacity = mo;
        }
      });
      dsChayO.forEach((x) => {
        const pc = K.eio(K.tienDo(s, x.a, x.d)), tu = x.e.tu || 0, den = x.e.den || 0;
        x.c.div.textContent = s < x.a ? dinhDang(x.e, tu) : dinhDang(x.e, tu + (den - tu) * pc);
        x.c.div.style.transform = `scale(${(1 + 0.05 * Math.sin(Math.PI * K.cl(pc))).toFixed(4)})`;
      });
      if (DAU) {
        const pd = K.tienDo(s, tDau, 0.2), e = K.eo3(pd), tl = 1 + (1 - e) * 0.6;
        const mo = (pd <= 0 ? 0 : K.cl(pd * 2.2)).toFixed(3);
        dauG.setAttribute('transform', `translate(${DAU.cx.toFixed(1)} ${DAU.cy.toFixed(1)}) scale(${tl.toFixed(4)})`);
        dauG.style.opacity = mo;
        if (DAU.div) { DAU.div.style.transform = `scale(${tl.toFixed(4)}) rotate(-12deg)`; DAU.div.style.opacity = mo; }
        const tau = s - tDau - 0.2;
        const n = tau > 0 && tau < 0.6 ? Math.sin(tau * 26) * Math.exp(-tau * 9) * 3 : 0;
        nay.style.transform = `translateY(${n.toFixed(2)}px)`;
      }
    };
    return { el, seek, moc, W, H, bao, coSo, canh, X0, Y0, co };
  }

  // ======================================================================
  // HOÁ ĐƠN GIÁ TRỊ GIA TĂNG (rộng 900, cao H, hệ số giãn dòng k)
  // ======================================================================
  function dungHoaDon(op, C, W) {
    const { o, hang, B, muc, mucPhu, mauNhan, mauLuoi, dayLuoi, nenDauBang, tay, toiGian, NET, coDo, fChu, k } = C;
    const v = (n) => n * k, P = 40, RN = W - 2 * P, ds = [], vach = [];
    const ban = op.ben_ban || {}, mua = op.ben_mua || {};
    const dsHang = op.hang && op.hang.length ? op.hang : [{}];
    const MAU_HANG = { stt: '1', ten: 'Tên hàng hoá dịch vụ', dvt: 'cái', sl: '00', don_gia: '0.000.000', thanh_tien: '00.000.000' };   // chỉ để đo vạch
    let y = v(40);

    // tiêu đề
    const td = o({ ten: 'tieu_de', s: op.tieu_de === false ? '' : (op.tieu_de || 'HOÁ ĐƠN GIÁ TRỊ GIA TĂNG'), truyen: coTruyen(op.tieu_de), du_lieu: true, ca_gon: true,
      x: P, w: RN, co: 34, dam: 800, mau: mauNhan, can: 'center', toi_da: 2 });
    td.x = P + (RN - Math.max(td.rong, 1)) / 2 - 2; td.w = Math.max(td.rong, 1) + 4;
    ds.push(hang('tieu_de', y, [td], { x: td.x, w: td.w })); y += td.h + v(8);

    // cặp nhãn – giá trị trên một dòng, căn giữa
    const cap = (dsCap, ten, yy, fN, fG) => {
      const cs = [];
      let tong = 0;
      dsCap.forEach(([nhan, gt, tenO, truyen], i) => {
        const a = o({ ten: tenO + '.nhan', s: nhan, x: 0, w: RN, co: fN, dam: 500, mau: mucPhu, mot_dong: true });
        const b = o({ ten: tenO, s: gt, truyen, du_lieu: true, x: 0, w: RN, co: fG, dam: 700, mau: muc, mot_dong: true });
        a.w = a.rong + 2; b.w = b.rong + 2; a.dy = Math.max(0, (b.lh - a.lh) * 0.6);
        cs.push([a, b]); tong += a.w + 6 + b.w + (i ? 40 : 0);
      });
      const x0 = P + Math.max(0, (RN - tong) / 2);
      let x = x0;
      const phang = [];
      cs.forEach(([a, b], i) => { if (i) x += 40; a.x = x; x += a.w + 6; b.x = x; x += b.w; phang.push(a, b); });
      return hang(ten, yy, phang, { x: x0, w: Math.min(RN, tong) });
    };
    const r1 = cap([['Ký hiệu:', op.ky_hieu || '1C26TAA', 'ky_hieu', coTruyen(op.ky_hieu)], ['Số:', op.so || '00000000', 'so', coTruyen(op.so)]], 'so_hieu', y, 22, 24);
    ds.push(r1); y += r1.h + v(2);
    if (op.ngay !== false) {
      const c = o({ ten: 'ngay', s: coTruyen(op.ngay) ? op.ngay : 'Ngày 00 tháng 00 năm 0000', truyen: coTruyen(op.ngay), du_lieu: true, x: P, w: RN, co: 22, dam: 500, mau: mucPhu, can: 'center', nghieng: true, toi_da: 1 });
      c.x = P + (RN - c.rong) / 2 - 2; c.w = c.rong + 4;
      ds.push(hang('ngay', y, [c], { x: c.x, w: c.w })); y += c.h + v(2);
    }
    if (op.ma_cqt !== false) {
      const r = cap([['Mã của cơ quan thuế:', coTruyen(op.ma_cqt) ? String(op.ma_cqt) : '00A1B2C3D4E5F6A7B8C9', 'ma_cqt', coTruyen(op.ma_cqt)]], 'ma_cqt_dong', y, 20, 22);
      ds.push(r); y += r.h;
    }
    y += v(14); vach.push([y, false]); y += v(16);

    // bên bán, bên mua: nhãn in sẵn, giá trị là dữ liệu
    const MAU_BEN = { ten: 'Tên doanh nghiệp', mst: '0000000000', dia_chi: 'Địa chỉ doanh nghiệp' };
    const khoiBen = (tienTo, goc, dsDongBen) => {
      const lw = Math.ceil(Math.max(...dsDongBen.map(([kk, nh]) => K.doChu(nh, coDo({ ten: `${tienTo}.${kk}.nhan` }, 22), 500)))) + 14;
      dsDongBen.forEach(([kk, nh, luon]) => {
        const gt = goc[kk];
        if (gt === false || (!luon && !coTruyen(gt))) return;
        const ten = `${tienTo}.${kk}`;
        const a = o({ ten: ten + '.nhan', s: nh, x: P, w: lw, co: 22, dam: 500, mau: mucPhu, mot_dong: true });
        const b = o({ ten: ten + '.gia_tri', s: coTruyen(gt) ? gt : MAU_BEN[kk], truyen: coTruyen(gt), du_lieu: true, x: P + lw, w: RN - lw, co: 26, dam: kk === 'ten' ? 800 : 700, mau: muc, toi_da: 2 });
        a.dy = Math.max(0, (b.lh - a.lh) * 0.6);
        const r = hang(ten, y, [a, b], { x: P, w: lw + b.rong + 4, so: ten + '.gia_tri', duoi: v(4) });
        ds.push(r); y += r.h;
      });
    };
    const iBan = ds.length;
    khoiBen('ben_ban', ban, [['ten', 'Đơn vị bán hàng:', true], ['mst', 'Mã số thuế:', true], ['dia_chi', 'Địa chỉ:', true]]);
    y += v(10); vach.push([y, true]); y += v(14);
    khoiBen('ben_mua', mua, [['ten', 'Đơn vị mua hàng:', true], ['mst', 'Mã số thuế:', true], ['dia_chi', 'Địa chỉ:', false]]);
    const yBenDuoi = y;
    y += v(18);

    // bảng hàng hoá: cột cố định trong bề rộng tờ
    const KHOA = ['stt', 'ten', 'dvt', 'sl', 'don_gia', 'thanh_tien'];
    const tdCot = op.tieu_de_cot || ['STT', 'Tên hàng hoá, dịch vụ', 'Đơn vị tính', 'Số lượng', 'Đơn giá', 'Thành tiền'];
    const CAN = ['center', 'left', 'center', 'right', 'right', 'right'];
    const coHang = !!(op.hang && op.hang.length);
    const truyenO = (h, kk) => coHang && (coTruyen(h[kk]) || kk === 'stt');
    const giaTri = (h, kk, i) => (coTruyen(h[kk]) ? String(h[kk]) : kk === 'stt' ? String(i + 1) : MAU_HANG[kk]);
    let rongCot = KHOA.map((kk, j) => {
      if (kk === 'ten') return 0;
      const fc = coDo({ ten: `bang.${kk}`, truyen: !!op.tieu_de_cot }, 20);
      const tuDai = Math.max(...String(tdCot[j]).split(/\s+/).map((w) => K.doChu(w, fc, 700)));
      const gt = Math.max(0, ...dsHang.map((h, i) => K.doChu(giaTri(h, kk, i), coDo({ ten: `hang.${i}.${kk}`, truyen: truyenO(h, kk), du_lieu: true }, 24), kk === 'thanh_tien' ? 700 : 600)));
      return Math.ceil(Math.max(j === 0 ? 50 : 76, tuDai, gt) + 22);
    });
    const tongCo = rongCot.reduce((a, b) => a + b, 0);
    if (tongCo > RN - 150) rongCot = rongCot.map((w) => w * (RN - 150) / tongCo);
    rongCot[1] = RN - rongCot.reduce((a, b) => a + b, 0);
    const xCot = []; { let x = P; rongCot.forEach((w) => { xCot.push(x); x += w; }); }
    const ke = (rs, y0, h, dau) => {
      if (dau) B.cn(rs, P, y0, RN, h, { to: nenDauBang, net: mauLuoi, day: dayLuoi, gach: tay ? [muc, 0.16] : null });
      else {
        B.vach(rs, [[P, y0 + h], [P + RN, y0 + h]], { mau: mauLuoi, day: dayLuoi });
        B.vach(rs, [[P, y0], [P, y0 + h]], { mau: mauLuoi, day: dayLuoi });
        B.vach(rs, [[P + RN, y0], [P + RN, y0 + h]], { mau: mauLuoi, day: dayLuoi });
      }
      for (let j = 1; j < xCot.length; j++) B.vach(rs, [[xCot[j], y0], [xCot[j], y0 + h]], { mau: mauLuoi, day: dayLuoi * 0.8 });
    };
    {
      const os = KHOA.map((kk, j) => o({ ten: `bang.${kk}`, s: tdCot[j], truyen: !!op.tieu_de_cot, x: xCot[j] + 8, w: rongCot[j] - 16, co: 20, dam: 700, mau: muc, can: 'center', toi_da: 2 }));
      const h = Math.max(...os.map((c) => c.h)) + v(16);
      os.forEach((c) => { c.dy = (h - c.h) / 2; });
      const r = hang('bang', y, os, { x: P, w: RN, h, ve: (rs, rr) => ke(rs, rr.y, rr.h, true) });
      os.forEach((c, j) => { c.hop = { x: xCot[j], y, w: rongCot[j], h }; });
      ds.push(r); y += h;
    }
    dsHang.forEach((hh, i) => {
      const os = KHOA.map((kk, j) => o({ ten: `hang.${i}.${kk}`, s: giaTri(hh, kk, i), truyen: truyenO(hh, kk), du_lieu: true, x: xCot[j] + 10, w: rongCot[j] - 20, co: 24,
        dam: kk === 'thanh_tien' ? 700 : 600, mau: muc, can: CAN[j], toi_da: 2, mot_dong: kk !== 'ten' }));
      const h = Math.max(...os.map((c) => c.h)) + v(14);
      os.forEach((c, j) => { c.dy = (h - c.h) / 2; c.hop = { x: xCot[j], y, w: rongCot[j], h }; });
      const r = hang(`hang.${i}`, y, os, { x: P, w: RN, h, so: `hang.${i}.thanh_tien`, ve: (rs, rr) => ke(rs, rr.y, rr.h, false) });
      ds.push(r); y += h;
    });
    y += v(18);

    // chữ ký số (trái) và các dòng cộng (phải)
    const kyOp = op.chu_ky && typeof op.chu_ky === 'object' ? op.chu_ky : {};
    const ky = op.chu_ky === false ? null : { nhan: kyOp.nhan || 'Đã ký số', ky_boi: kyOp.ky_boi, ngay_ky: kyOp.ngay_ky };
    const SW = ky ? 262 : 0;
    const x0 = ky ? P + SW + 30 : P + RN * 0.36;
    const ntOp = op.nhan_tong || {};
    const nt = { tien_hang: 'Cộng tiền hàng:', thue_suat: 'Thuế suất GTGT:', tien_thue: 'Tiền thuế GTGT:', tong: 'Tổng cộng tiền thanh toán:' };
    const MAU_TONG = { tien_hang: '000.000.000', thue_suat: '00%', tien_thue: '00.000.000', tong: '000.000.000' };
    const dsTong = ['tien_hang', 'thue_suat', 'tien_thue', 'tong'];
    const oGT = dsTong.map((kk) => o({ ten: kk + '.gia_tri', s: coTruyen(op[kk]) ? op[kk] : MAU_TONG[kk], truyen: coTruyen(op[kk]), du_lieu: true, x: 0, w: W - P - x0 - 110,
      co: kk === 'tong' ? 28 : 26, dam: 800, mau: kk === 'tong' ? mauNhan : muc, can: 'right', mot_dong: true }));
    const vw = Math.ceil(Math.max(...oGT.map((c) => c.rong))) + 6;
    const yTong = y;
    dsTong.forEach((kk, i) => {
      const b = oGT[i];
      b.x = W - P - vw; b.w = vw;
      const a = o({ ten: kk + '.nhan', s: ntOp[kk] === false ? '' : (ntOp[kk] || nt[kk]), truyen: coTruyen(ntOp[kk]), x: x0, w: W - P - vw - 16 - x0, co: 22,
        dam: kk === 'tong' ? 700 : 500, mau: kk === 'tong' ? muc : mucPhu, toi_da: 2 });
      b.dy = v(5); a.dy = v(5) + Math.max(0, (b.lh - a.lh) * 0.6);
      const h = Math.max(a.dy + a.h, b.dy + b.h) + v(5);
      const r = hang(kk, y, [a, b], { x: x0, w: W - P - x0, h, so: kk + '.gia_tri', ve: kk === 'tong' ? (rs, rr) => B.vach(rs, [[x0, rr.y], [W - P, rr.y]], { mau: muc, day: 2 }) : null });
      ds.push(r); y += h;
    });
    let yCuoi = y;
    if (ky) {
      const xk = P + 66, xd = P + 22, wd = SW - 40;
      const os = [o({ ten: 'chu_ky.nhan', s: ky.nhan, truyen: coTruyen(kyOp.nhan), x: xk, w: SW - 80, co: 22, dam: 800, mau: C.chuTot, dy: v(16), toi_da: 2 })];
      let dyk = v(16) + Math.max(os[0].h, v(30)) + v(8);
      const c1 = o({ ten: 'chu_ky.ky_boi', s: coTruyen(ky.ky_boi) ? 'Ký bởi: ' + ky.ky_boi : 'Ký bởi: Tên doanh nghiệp', truyen: coTruyen(ky.ky_boi), du_lieu: true, x: xd, w: wd, co: 20, dam: 500, mau: mucPhu, dy: dyk, toi_da: 2 });
      os.push(c1); dyk += c1.h + v(2);
      const c2 = o({ ten: 'chu_ky.ngay_ky', s: coTruyen(ky.ngay_ky) ? 'Ngày ký: ' + ky.ngay_ky : 'Ngày ký: 00/00/0000', truyen: coTruyen(ky.ngay_ky), du_lieu: true, x: xd, w: wd, co: 20, dam: 500, mau: mucPhu, dy: dyk, toi_da: 1 });
      os.push(c2); dyk += c2.h;
      const h = Math.max(y - yTong, dyk + v(16)), lechK = Math.max(0, (h - dyk - v(16)) / 2);
      os.forEach((c) => { c.dy += lechK; });
      const r = hang('chu_ky', yTong, os, { x: P, w: SW, h, ve: (rs, rr) => {
        B.cn(rs, P, rr.y, SW, rr.h, { to: K.rgba(C.mauTot, 0.08), net: toiGian ? (NET.day > 0 ? C.mauTot : null) : C.mauTot, day: toiGian ? NET.day : 2.2, bo: 8, gach: tay ? [C.mauTot, 0.2] : null });
        B.tich(rs, P + 36, rr.y + os[0].dy + os[0].h / 2, 17, C.mauTot, C.giay);
      } });
      os.forEach((c) => { c.hop = { x: P, y: yTong, w: SW, h }; });
      ds.push(r); yCuoi = Math.max(yCuoi, yTong + h);
    }
    const hBan = ds[iBan] || ds[0];
    return {
      hang: ds, cao: yCuoi + v(30),
      dau_mac_dinh: [W - P - 10, (hBan.y + yBenDuoi) / 2],
      trangTri(sv, HH) {
        if (!toiGian) B.cn(sv, 14, 14, W - 28, HH - 28, { net: mauNhan, day: 1.5, mo: 0.55, bo: 2 });
        vach.forEach(([yy, dut]) => B.vach(sv, [[P, yy], [W - P, yy]], { mau: mauLuoi, day: dayLuoi, dut: dut ? '7 7' : null }));
      },
    };
  }

  // ======================================================================
  // TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG (rộng 620, cao H)
  // ======================================================================
  function dungToKhai(op, C, W) {
    const { o, hang, B, gon, muc, mucPhu, mauNhan, mauLuoi, dayLuoi, nenDauBang, tay, toiGian, NET, coDo, fChu, k } = C;
    const v = (n) => n * k, P = 36, RN = W - 2 * P, ds = [];
    const MAU_CT = ['Hàng hoá, dịch vụ bán ra', 'Thuế giá trị gia tăng đầu ra', 'Hàng hoá, dịch vụ mua vào', 'Thuế giá trị gia tăng đầu vào được khấu trừ', 'Thuế phải nộp', 'Thuế còn được khấu trừ chuyển kỳ sau'];
    const chiTieu = op.chi_tieu && op.chi_tieu.length ? op.chi_tieu : MAU_CT.map(() => ({}));
    const tenCT = (ct, i) => (coTruyen(ct.ten) ? String(ct.ten) : MAU_CT[i % MAU_CT.length]);
    const gtCT = (ct) => (coTruyen(ct.gia_tri) ? String(ct.gia_tri) : '000.000.000');
    const ky = coTruyen(op.ky) ? String(op.ky) : 'Quý 0/0000';

    // cột bảng chỉ tiêu: cột số rộng vừa số được hiện (tối đa 75% bề rộng)
    const cotTruyen = !!op.tieu_de_cot;
    const tdCot = op.tieu_de_cot || ['Chỉ tiêu', 'Số tiền (đồng)'];
    const coMa = chiTieu.some((c) => c && coTruyen(c.ma));
    const wMa = coMa ? Math.ceil(Math.max(...chiTieu.map((c, i) => (c && coTruyen(c.ma) ? K.doChu(String(c.ma), coDo({ ten: `chi_tieu.${i}.ma`, truyen: true, du_lieu: true }, 20), 700) : 0)),
      K.doChu('Mã', coDo({ ten: 'bang.ma', truyen: cotTruyen }, 20), 700))) + 20 : 0;
    const wCan = Math.ceil(Math.max(K.doChu(tdCot[1], coDo({ ten: 'bang.gia_tri', truyen: cotTruyen }, 20), 700) * 0.6,
      ...chiTieu.map((c, i) => K.doChu(gtCT(c || {}), coDo({ ten: `chi_tieu.${i}.gia_tri`, truyen: coTruyen((c || {}).gia_tri), du_lieu: true }, 24), 700)),
      ...((op.so_chay || []).map((e) => K.doChu(K.so(Math.max(Math.abs(e.tu || 0), Math.abs(e.den || 0)), e.thap_phan || 0), fChu(24), 700))))) + 26;
    const wGT = K.cl(wCan, RN * 0.3, RN * 0.75 - wMa);
    const wTen = RN - wMa - wGT;
    const xMa = P, xTen = P + wMa, xGT = P + wMa + wTen;

    let y = 64 + v(12);
    const td = o({ ten: 'tieu_de', s: op.tieu_de === false ? '' : (op.tieu_de || 'TỜ KHAI THUẾ GIÁ TRỊ GIA TĂNG'), truyen: coTruyen(op.tieu_de), du_lieu: true, ca_gon: true,
      x: P, w: RN, co: 30, dam: 800, mau: mauNhan, can: 'center', toi_da: 2 });
    const rTD = Math.max(1, td.rong);
    td.x = P + (RN - rTD) / 2 - 2; td.w = rTD + 4;
    ds.push(hang('tieu_de', y, [td], { x: td.x, w: td.w })); y += td.h + v(8);

    // kỳ tính thuế
    if (gon) {
      const c = o({ ten: 'ky.gia_tri', s: ky, truyen: coTruyen(op.ky), du_lieu: true, ca_gon: true, x: P, w: RN, co: 26, dam: 800, mau: mauNhan, can: 'center', mot_dong: true });
      c.x = P + (RN - c.rong) / 2 - 2; c.w = c.rong + 4;
      ds.push(hang('ky', y, [c], { x: c.x, w: c.w, so: 'ky.gia_tri' })); y += c.h + v(10);
    } else {
      const a = o({ ten: 'ky.nhan', s: op.nhan_ky || 'Kỳ tính thuế:', truyen: coTruyen(op.nhan_ky), x: 0, w: RN, co: 22, dam: 500, mau: mucPhu, mot_dong: true });
      const b = o({ ten: 'ky.gia_tri', s: ky, truyen: coTruyen(op.ky), du_lieu: true, ca_gon: true, x: 0, w: RN, co: 26, dam: 800, mau: mauNhan, mot_dong: true });
      a.dy = Math.max(0, (b.lh - a.lh) * 0.6);
      const tong = a.rong + 8 + b.rong, x = P + Math.max(0, (RN - tong) / 2);
      a.x = x; a.w = a.rong + 2; b.x = x + a.rong + 8; b.w = b.rong + 2;
      ds.push(hang('ky', y, [a, b], { x, w: tong + 4, so: 'ky.gia_tri' })); y += Math.max(a.dy + a.h, b.h) + v(10);
    }
    const yVach1 = y; y += v(16);

    // người nộp thuế
    const MAU_TT = { ten: 'Tên doanh nghiệp', mst: '0000000000' };
    const dsTT = [['ten', 'Tên người nộp thuế:'], ['mst', 'Mã số thuế:']].filter(([kk]) => op[kk] !== false);
    const lw = Math.ceil(Math.max(0, ...dsTT.map(([kk, nh]) => K.doChu(nh, coDo({ ten: kk + '.nhan' }, 20), 500)))) + 12;
    dsTT.forEach(([kk, nh]) => {
      const a = o({ ten: kk + '.nhan', s: nh, x: P, w: lw, co: 20, dam: 500, mau: mucPhu, mot_dong: true });
      const b = o({ ten: kk + '.gia_tri', s: coTruyen(op[kk]) ? op[kk] : MAU_TT[kk], truyen: coTruyen(op[kk]), du_lieu: true, x: P + lw, w: RN - lw, co: 24, dam: 700, mau: muc, toi_da: 2 });
      a.dy = Math.max(0, (b.lh - a.lh) * 0.6);
      const r = hang(kk, y, [a, b], { x: P, w: lw + b.rong + 4, so: kk + '.gia_tri', duoi: v(4) });
      ds.push(r); y += r.h;
    });
    y += v(14);

    // bảng chỉ tiêu
    const ke = (rs, y0, h, dau) => {
      if (dau) B.cn(rs, P, y0, RN, h, { to: nenDauBang, net: mauLuoi, day: dayLuoi, gach: tay ? [muc, 0.16] : null });
      else {
        B.vach(rs, [[P, y0 + h], [P + RN, y0 + h]], { mau: mauLuoi, day: dayLuoi });
        B.vach(rs, [[P, y0], [P, y0 + h]], { mau: mauLuoi, day: dayLuoi });
        B.vach(rs, [[P + RN, y0], [P + RN, y0 + h]], { mau: mauLuoi, day: dayLuoi });
      }
      if (coMa) B.vach(rs, [[xTen, y0], [xTen, y0 + h]], { mau: mauLuoi, day: dayLuoi * 0.8 });
      B.vach(rs, [[xGT, y0], [xGT, y0 + h]], { mau: mauLuoi, day: dayLuoi * 0.8 });
    };
    const hopX = coMa ? [[xMa, wMa], [xTen, wTen], [xGT, wGT]] : [[xTen, wTen], [xGT, wGT]];
    {
      const os = [];
      if (coMa) os.push(o({ ten: 'bang.ma', s: 'Mã', truyen: cotTruyen, x: xMa + 6, w: wMa - 12, co: 20, dam: 700, mau: muc, can: 'center', mot_dong: true }));
      os.push(o({ ten: 'bang.ten', s: tdCot[0], truyen: cotTruyen, x: xTen + 10, w: wTen - 20, co: 20, dam: 700, mau: muc, can: 'left', toi_da: 2 }));
      os.push(o({ ten: 'bang.gia_tri', s: tdCot[1], truyen: cotTruyen, x: xGT + 8, w: wGT - 16, co: 20, dam: 700, mau: muc, can: 'center', toi_da: 2 }));
      const h = Math.max(...os.map((c) => c.h)) + v(16);
      os.forEach((c, j) => { c.dy = (h - c.h) / 2; c.hop = { x: hopX[j][0], y, w: hopX[j][1], h }; });
      ds.push(hang('bang', y, os, { x: P, w: RN, h, ve: (rs, rr) => ke(rs, rr.y, rr.h, true) })); y += h;
    }
    chiTieu.forEach((ct, i) => {
      ct = ct || {};
      const ten = `chi_tieu.${i}`, os = [];
      if (ct.nhom) {
        const c = o({ ten: ten + '.ten', s: tenCT(ct, i), truyen: coTruyen(ct.ten), du_lieu: true, x: P + 12, w: RN - 24, co: 22, dam: 800, mau: muc, toi_da: 2 });
        const h = c.h + v(16);
        c.dy = (h - c.h) / 2; c.hop = { x: P, y, w: RN, h };
        ds.push(hang(ten, y, [c], { x: P, w: RN, h, nen: { x: P, y, w: RN, h, to: K.tron(C.giay, muc, 0.07) }, ve: (rs, rr) => {
          B.vach(rs, [[P, rr.y + rr.h], [P + RN, rr.y + rr.h]], { mau: mauLuoi, day: dayLuoi }); B.vach(rs, [[P, rr.y], [P, rr.y + rr.h]], { mau: mauLuoi, day: dayLuoi }); B.vach(rs, [[P + RN, rr.y], [P + RN, rr.y + rr.h]], { mau: mauLuoi, day: dayLuoi });
        } }));
        y += h; return;
      }
      if (coMa) os.push(o({ ten: ten + '.ma', s: coTruyen(ct.ma) ? String(ct.ma) : '', truyen: coTruyen(ct.ma), du_lieu: true, x: xMa + 6, w: wMa - 12, co: 20, dam: 700, mau: mucPhu, can: 'center', mot_dong: true }));
      const a = o({ ten: ten + '.ten', s: tenCT(ct, i), truyen: coTruyen(ct.ten), du_lieu: true, x: xTen + 10, w: wTen - 20, co: 22, dam: 500, mau: muc, toi_da: 3 });
      const b = o({ ten: ten + '.gia_tri', s: gtCT(ct), truyen: coTruyen(ct.gia_tri), du_lieu: true, x: xGT + 10, w: wGT - 20, co: 24, dam: 700, mau: muc, can: 'right', mot_dong: true });
      os.push(a, b);
      const h = Math.max(a.h, b.h) + v(14);
      os.forEach((c, j) => { c.dy = (h - c.h) / 2; c.hop = { x: hopX[j][0], y, w: hopX[j][1], h }; });
      ds.push(hang(ten, y, os, { x: P, w: RN, h, so: ten + '.gia_tri', ve: (rs, rr) => ke(rs, rr.y, rr.h, false) }));
      y += h;
    });
    y += v(20);

    // xác nhận nộp điện tử mô phỏng
    const xnOp = op.xac_nhan && typeof op.xac_nhan === 'object' ? op.xac_nhan : {};
    const xn = op.xac_nhan === false ? null : xnOp;
    let yCuoi = y;
    const wXN = Math.round(RN * 0.6);
    if (xn) {
      const xk = P + 60, os = [];
      const a = o({ ten: 'xac_nhan.chu', s: xn.chu || 'Đã nộp qua cổng thuế điện tử', truyen: coTruyen(xn.chu), x: xk, w: wXN - 74, co: 20, dam: 700, mau: C.chuTot, dy: v(12), toi_da: 2 });
      os.push(a);
      const b = o({ ten: 'xac_nhan.ngay', s: 'Ngày nộp: ' + (coTruyen(xn.ngay) ? xn.ngay : '00/00/0000'), truyen: coTruyen(xn.ngay), du_lieu: true, x: xk, w: wXN - 74, co: 20, dam: 500, mau: mucPhu, dy: v(12) + a.h + v(2), toi_da: 1 });
      os.push(b);
      const h = b.dy + b.h + v(12);
      os.forEach((c) => { c.hop = { x: P, y, w: wXN, h }; });
      ds.push(hang('xac_nhan', y, os, { x: P, w: wXN, h, ve: (rs, rr) => {
        B.cn(rs, P, rr.y, wXN, rr.h, { to: K.rgba(C.mauTot, 0.08), net: toiGian ? (NET.day > 0 ? C.mauTot : null) : C.mauTot, day: toiGian ? NET.day : 2, bo: 8, gach: tay ? [C.mauTot, 0.2] : null });
        B.tich(rs, P + 30, rr.y + rr.h / 2, 16, C.mauTot, C.giay);
      } }));
      yCuoi = y + h;
    }
    return {
      hang: ds, cao: yCuoi + v(28),
      dau_mac_dinh: [W - P, xn ? (y + yCuoi) / 2 : yCuoi - 80],
      trangTri(sv) {
        B.vach(sv, [[W / 2 - 130, 34], [W / 2 + 130, 34]], { mau: muc, day: 9, mo: 0.4 });
        B.vach(sv, [[W / 2 - 85, 54], [W / 2 + 85, 54]], { mau: muc, day: 7, mo: 0.25 });
        B.vach(sv, [[P, yVach1], [W - P, yVach1]], { mau: mauLuoi, day: dayLuoi });
      },
    };
  }

  // ======================================================================
  // GỌI CHUNG: chốt cỡ, vừa khung
  // ======================================================================
  const layKhung = (opt) => Object.assign({}, KHUNG, opt.khung || {});
  // tỉ lệ thu và vị trí mới để hộp bao b (neo tại X, Y) lọt khung
  function tinhThu(b, X, Y, khung) {
    const L = Math.max(0, X - b.x), R = Math.max(0, b.x + b.w - X), T = Math.max(0, Y - b.y), D = Math.max(0, b.y + b.h - Y);
    const kw = khung.rong - 2 * LE, kh = khung.cao - 2 * LE;
    const s = Math.min(1, kw / Math.max(1, L + R), kh / Math.max(1, T + D));
    const x = K.cl(X, khung.x + LE + L * s, khung.x + khung.rong - LE - R * s), y = K.cl(Y, khung.y + LE + T * s, khung.y + khung.cao - LE - D * s);
    return { s, x, y };
  }

  K.bo_chung_tu_hoa_don = function (opt) {
    opt = opt || {};
    const khung = layKhung(opt);
    if (opt.loai === 'chong') return taoChong(opt, khung);
    const CH = CHUAN[opt.loai === 'to_khai_gtgt' ? 'to_khai_gtgt' : 'hoa_don_gtgt'];
    const co0 = opt.rong ? opt.rong / CH.W : (opt.co || 1);
    const H = opt.cao ? opt.cao / co0 : CH.H;
    let co = co0, x = opt.x, y = opt.y, a = null;
    for (let i = 0; i < 8; i++) {
      a = taoTo(Object.assign({}, opt, { __co: co, __H: H, __khung: khung, x, y }));
      if (trongKhung(a.bao, khung)) break;
      const t = tinhThu(a.bao, a.X0, a.Y0, khung);
      co *= t.s < 1 ? t.s * 0.985 : 1; x = t.x; y = t.y;
    }
    const canh = a.canh.slice();
    if (co < co0 - 1e-6 || (opt.x != null && Math.abs(a.X0 - opt.x) > 0.5) || (opt.y != null && Math.abs(a.Y0 - opt.y) > 0.5))
      canh.push(`tờ vượt khung vẽ (x ${khung.x}–${khung.x + khung.rong}, y ${khung.y}–${khung.y + khung.cao}): ${co < co0 - 1e-6 ? `thu co từ ${co0.toFixed(3)} xuống ${co.toFixed(3)}, ` : ''}đặt tại x ${Math.round(a.X0)}, y ${Math.round(a.Y0)}`);
    if (!trongKhung(a.bao, khung)) canh.push('tờ vẫn vượt khung sau khi thu');
    baoLoi(canh);
    return { el: a.el, seek: a.seek, moc: a.moc };
  };
  K.chung_tu = K.bo_chung_tu_hoa_don;

  // ----- chồng nhiều tờ -----
  function dungChong(opt, khung, co, X, Y, gian, lech) {
    const ds = opt.to || [];
    const xep = opt.xep === 'chong' ? 'chong' : 'hang', cot = Math.max(1, opt.cot || ds.length || 1);
    const tinh = !!(opt.tinh || (opt.vao != null && opt.vao < 0)), vao = opt.vao > 0 ? opt.vao : 0;
    const el = K.html('div', { class: 'kho-chung-tu-chong', style: `position:absolute;left:0;top:0;width:0;height:0;overflow:visible;font-family:${K.PHONG};pointer-events:none;` });
    const dsTo = [], canh = [];
    let xHang = X, yHang = Y, caoHang = 0;
    ds.forEach((t0, i) => {
      const t = Object.assign({ loai: 'to_khai_gtgt' }, t0 || {});
      const CH = CHUAN[t.loai === 'hoa_don_gtgt' ? 'hoa_don_gtgt' : 'to_khai_gtgt'];
      const coTo = t.co ? t.co * (co / (opt.co || 0.42)) : co;
      const H = t.cao ? t.cao / coTo : CH.H;
      const rongTo = CH.W * coTo;
      let x, y, xoay = t.xoay || 0;
      if (xep === 'hang') {
        if (i && i % cot === 0) { xHang = X; yHang += caoHang + gian; caoHang = 0; }
        x = xHang; y = yHang + ((i % cot) % 2 ? lech : 0);
        xHang += rongTo + gian;
      } else {
        x = X + i * lech; y = Y + i * lech * 0.62;
        if (t.xoay == null) xoay = i === ds.length - 1 ? 0 : [-3.2, 2.4, -1.6, 1.4][i % 4];
      }
      const con = Object.assign({ kieu: opt.kieu, mau: opt.mau, net: opt.net, chu: opt.chu, hat: (opt.hat || 211) + i * 37, truot: opt.truot === undefined ? (xep === 'hang' ? 'duoi' : 'phai') : opt.truot, tinh },
        t, { __co: coTo, __H: H, __khung: khung, x, y, xoay, nhan_mo_phong: false, nhan_vi_du: false,
          vao: t.vao != null ? t.vao : (opt.moc_hien && opt.moc_hien[i] != null ? opt.moc_hien[i] : vao + i * 0.4), duoi: xep === 'chong' && i < ds.length - 1 });
      const a = taoTo(con);
      el.appendChild(a.el); dsTo.push(a); canh.push(...a.canh);
      if (xep === 'hang') caoHang = Math.max(caoHang, a.moc.hop.h + ((i % cot) % 2 ? lech : 0));
    });
    const hop = gop(dsTo.map((a) => a.moc.hop)) || { x: X, y: Y, w: 0, h: 0 };
    // nhãn chung của nhóm: "Mô phỏng" trên phải, "Ví dụ giả định" trên trái (không đủ chỗ phía trên thì xuống dưới)
    const m = K.layMau(opt), giay = opt.kieu === 'net_tay' ? K.tron(m.giay, m.da, 0.16) : m.giay;
    const nhanNhom = (chu, phai, nenKhoa) => {
      const f = CO_MIN, w = Math.ceil(K.doChu(chu, f, 700)) + 40, h = 46;
      const nen = K.tron(giay, m[nenKhoa], 0.45), mauChu = duTuongPhan(m.toi ? m.nen : m.chu, nen, 7);
      const x = phai ? hop.x + hop.w - w : hop.x, y = hop.y - h - 12 >= khung.y + LE ? hop.y - h - 12 : hop.y + hop.h + 12;
      const vien = opt.kieu === 'toi_gian' ? (opt.net && opt.net.day > 0 ? `${opt.net.day}px solid ${m[(opt.net && opt.net.mau) || 'chu'] || m.chu}` : 'none') : `1.5px solid ${duTuongPhan(m.chu, nen, 3)}`;
      const e = K.html('div', { 'data-hop': '1', style: `position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;box-sizing:border-box;border-radius:${h / 2}px;background:${nen};border:${vien};` +
        `display:flex;align-items:center;justify-content:center;font-size:${f}px;font-weight:700;color:${mauChu};white-space:nowrap;` }, el, chu);
      return { e, hop: { x, y, w, h } };
    };
    const chuMP = opt.nhan_mo_phong === false || opt.chu === false ? '' : (opt.nhan_mo_phong || 'Mô phỏng');
    const coSo = dsTo.some((a) => a.coSo);
    const chuVD = coSo && opt.nhan_vi_du !== false && opt.chu !== false ? (typeof opt.nhan_vi_du === 'string' && opt.nhan_vi_du ? opt.nhan_vi_du : 'Ví dụ giả định') : '';
    const nMP = chuMP ? nhanNhom(chuMP, true, 'canh_bao') : null, nVD = chuVD ? nhanNhom(chuVD, false, 'nhat') : null;
    if (nMP && nVD && nVD.hop.x + nVD.hop.w + 16 > nMP.hop.x) { nVD.hop.y = nMP.hop.y < hop.y ? nMP.hop.y - nVD.hop.h - 10 : nMP.hop.y + nMP.hop.h + 10; nVD.e.style.top = nVD.hop.y + 'px'; }
    const bao = gop([...dsTo.map((a) => a.bao), nMP && nMP.hop, nVD && nVD.hop]);
    const tNhan = opt.moc_hien && opt.moc_hien[0] != null ? opt.moc_hien[0] : vao;
    const truong = {};
    dsTo.forEach((a, i) => { for (const kk in a.moc.truong) truong[`${i}.${kk}`] = a.moc.truong[kk]; });
    return {
      el, bao, canh,
      seek(t) {
        dsTo.forEach((a) => a.seek(t));
        const mo = (tinh ? 1 : K.eo3(K.tienDo(t, tNhan + 0.2, 0.3))).toFixed(3);
        if (nMP) nMP.e.style.opacity = mo;
        if (nVD) nVD.e.style.opacity = mo;
      },
      moc: { hop, truong, to: dsTo.map((a) => a.moc), bao, co, xong: Math.max(0, ...dsTo.map((a) => a.moc.xong)), nhan_mo_phong: nMP ? nMP.hop : null, nhan_vi_du: nVD ? nVD.hop : null },
    };
  }
  function taoChong(opt, khung) {
    const xep = opt.xep === 'chong' ? 'chong' : 'hang';
    const co0 = opt.co || 0.42;
    let co = co0, X = opt.x != null ? opt.x : 120, Y = opt.y != null ? opt.y : 160;
    let gian = opt.gian != null ? opt.gian : 28, lech = opt.lech != null ? opt.lech : (xep === 'hang' ? 22 : 46);
    let g = null;
    for (let i = 0; i < 8; i++) {
      g = dungChong(opt, khung, co, X, Y, gian, lech);
      if (trongKhung(g.bao, khung)) break;
      const t = tinhThu(g.bao, X, Y, khung), s = t.s < 1 ? t.s * 0.985 : 1;
      co *= s; gian *= s; lech *= s; X = t.x; Y = t.y;
    }
    const canh = g.canh.slice();
    if (co < co0 - 1e-6 || (opt.x != null && Math.abs(X - opt.x) > 0.5) || (opt.y != null && Math.abs(Y - opt.y) > 0.5))
      canh.push(`chồng tờ vượt khung vẽ: ${co < co0 - 1e-6 ? `thu co từ ${co0.toFixed(3)} xuống ${co.toFixed(3)}, ` : ''}đặt tại x ${Math.round(X)}, y ${Math.round(Y)}`);
    if (!trongKhung(g.bao, khung)) canh.push('chồng tờ vẫn vượt khung sau khi thu');
    baoLoi(canh);
    return { el: g.el, seek: g.seek, moc: g.moc };
  }
})();
