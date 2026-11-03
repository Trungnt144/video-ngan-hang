// canh.js — N301 Vốn lưu động ròng là gì
// KB-02 · CL-05 Sơ đồ bảng cân đối & đồ thị · CT1 · BC-06 Bảng số toàn khung · MAU-22 · NH09.
// Mọi giá trị trên màn hình là hàm thuần của t: window.seek(t).
(function () {
'use strict';
const K = window.KHO;
const N = (window.N = {});
const stage = document.getElementById('stage');
K.datMau('MAU-22');

const M = {
  nen: '#F4F7FB',
  nenPhu: '#EAEFF6',
  the: '#FFFFFF',
  theBorder: '#CBD5E1',
  chu: '#0B1017',
  chu2: '#475569',
  chuTrang: '#FFFFFF',
  xanhDuong: '#0B46A2',
  xanhLam: '#0284C7',
  xanhLa: '#10B981',
  xanhNgoc: '#059669',
  vang: '#D97706',
  do: '#DC2626',
  doNhat: '#FEE2E2',
  xanhNhat: '#E0F2FE',
  lucNhat: '#D1FAE5',
  xam: '#64748B',
  xamNhat: '#F1F5F9'
};

const TG = JSON.parse(document.getElementById('thoi_gian').textContent);
const CH = TG.chuong, DUR = TG.thoi_luong_giay, KT = TG.man_hinh_ket.t;
const C = (c, i) => CH[c - 1].cau[i - 1].t;
const E = (c, i) => CH[c - 1].cau[i - 1].den;
const eo = K.eo3, eio = K.eio, cl = K.cl, lerp = K.lerp;
const sv = (tag, a, cha) => K.svg(tag, a, cha);
const hm = (tag, a, cha, chu) => {
  const e = document.createElement(tag);
  if (a) for (const k in a) if (a[k] != null) e.setAttribute(k, a[k]);
  if (chu != null) {
    if (typeof chu === 'string' && chu.includes('<')) e.innerHTML = chu;
    else e.textContent = chu;
  }
  if (cha) cha.appendChild(e);
  return e;
};
let scaleNow = 1;

// ---------- tiện ích tạo cảnh ----------
N.canh = [];
function taoCanh(c) {
  const ch = CH[c - 1];
  const root = hm('div', { class: 'canh', 'data-chuong': c }, stage);
  const cv = hm('canvas', { class: 'lop', width: 1920, height: 1080 }, root);
  const gS = sv('svg', { class: 'lop', width: 1920, height: 1080, viewBox: '0 0 1920 1080' }, root);
  const gH = hm('div', { class: 'lop' }, root);
  const S = {
    c, root, cv, ctx: cv.getContext('2d'), svg: gS, html: gH,
    t0: ch.t, t1: c === CH.length ? KT : ch.den,
    items: [], ves: []
  };
  S.item = (el, a, b, o) => {
    o = o || {};
    S.items.push({
      el, a, b: b == null ? S.t1 - 0.05 : b,
      d: o.d == null ? 0.25 : o.d,
      dy: o.dy == null ? 0 : o.dy,
      svg: el instanceof SVGElement,
      base: o.base != null ? o.base : (el instanceof SVGElement ? (el.getAttribute('transform') || '') : '')
    });
    return el;
  };
  N.canh[c] = S;
  return S;
}

function veItem(it, S, t) {
  const b = it.b;
  const op = K.hienAn(t, it.a, b, it.d);
  const an = op <= 0.002;
  it.el.style.visibility = an ? 'hidden' : 'visible';
  if (an) return;
  const dy = it.dy * (1 - eo((t - it.a) / 0.4));
  if (it.svg) {
    it.el.setAttribute('opacity', op.toFixed(3));
    it.el.setAttribute('transform', `${it.base} translate(0,${dy.toFixed(1)})`.trim());
  } else {
    it.el.style.opacity = op.toFixed(3);
    it.el.style.transform = `translateY(${dy.toFixed(1)}px)`;
  }
}

// nhãn giả định
function nhanGD(S, vao, het) {
  const n = K.nhan_gia_dinh({ bien_the: 'goc', chu: 'ví dụ giả định', co: 26, cach_tren: 32, cach_phai: 50, vao, mau: { the: M.the, chu_phu: M.chu2, toi: false } });
  S.root.appendChild(n.el);
  const b = het != null ? het : S.t1 - 0.05;
  S.ves.push((t) => { n.seek(t); n.el.style.opacity = K.hienAn(t, vao, b, 0.25).toFixed(3); n.el.style.visibility = t >= vao && t < b ? 'visible' : 'hidden'; });
}

// Header & tiêu đề chương
function taoHeader(S, cId, tieuDe) {
  const bar = hm('div', { class: 'hv', style: 'left:80px;top:40px;width:1760px;height:50px;display:flex;align-items:center;justify-content:space-between;' }, S.html);
  const left = hm('div', { style: 'display:flex;align-items:center;gap:14px;' }, bar);
  hm('span', { style: `background:${M.xanhDuong};color:#FFF;padding:5px 14px;border-radius:6px;font-size:20px;font-weight:800;letter-spacing:0.5px;` }, left, `PHẦN ${cId}`);
  hm('span', { style: `color:${M.chu};font-size:32px;font-weight:800;` }, left, tieuDe);
  const right = hm('div', { style: `color:${M.chu2};font-size:20px;font-weight:600;display:flex;align-items:center;gap:8px;` }, bar);
  hm('span', { style: `display:inline-block;width:10px;height:10px;border-radius:50%;background:${M.xanhLam};` }, right);
  hm('span', {}, right, 'Chuyện nghề Ngân hàng · Phân tích BCTC');
  S.item(bar, S.t0, S.t1);
}

// helper tạo thẻ HTML
function taoThe(S, x, y, w, h, bg, border, o) {
  o = o || {};
  const el = hm('div', {
    class: 'hop',
    style: `left:${x}px;top:${y}px;width:${w}px;height:${h}px;background:${bg || M.the};border:${o.bw || 2}px solid ${border || M.theBorder};border-radius:${o.bo || 14}px;box-shadow:0 4px 14px rgba(0,0,0,0.04);flex-direction:${o.dir || 'column'};padding:${o.pad || 20}px;align-items:${o.align || 'center'};justify-content:${o.just || 'center'};text-align:${o.ta || 'center'};white-space:${o.ws || 'normal'};${o.css || ''}`
  }, S.html);
  return S.item(el, o.a || S.t0, o.b || S.t1, o);
}

// helper vẽ cột Bảng cân đối kế toán
function veCotBCTC(S, a) {
  // Cột Trái: TÀI SẢN 100 đồng (x=240, y=140, w=680, h=660)
  const cotTS = taoThe(S, 240, 140, 680, 660, '#FFFFFF', M.xanhDuong, { a, bw: 3, bo: 16, pad: 16 });
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.xanhDuong};margin-bottom:12px;letter-spacing:0.5px;` }, cotTS, 'TỔNG TÀI SẢN: 100 ĐỒNG');
  
  // Khối Tài sản ngắn hạn (60 đồng)
  const tsNg = hm('div', { style: `width:100%;height:320px;background:${M.xanhNhat};border:2px solid ${M.xanhLam};border-radius:12px;padding:12px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;` }, cotTS);
  hm('div', { style: `display:flex;justify-content:space-between;align-items:center;` }, tsNg, `
    <span style="font-size:24px;font-weight:800;color:${M.xanhDuong};">TÀI SẢN NGẮN HẠN (< 1 năm)</span>
    <span style="font-size:28px;font-weight:800;color:${M.xanhLam};">60 đồng</span>
  `);
  hm('div', { style: 'font-size:18px;color:#334155;text-align:left;line-height:1.4;' }, tsNg, `
    • Tiền mặt & Tiền gửi ngân hàng: <b>10 đồng</b><br>
    • Phải thu của khách hàng: <b>20 đồng</b><br>
    • Hàng tồn kho: <b>30 đồng</b>
  `);
  hm('div', { style: `background:#BAE6FD;color:${M.xanhDuong};font-size:16px;font-weight:700;padding:4px 8px;border-radius:6px;width:fit-content;` }, tsNg, 'Thu hồi thành tiền trong vòng 1 năm');

  // Khối Tài sản dài hạn (40 đồng)
  const tsDh = hm('div', { style: `width:100%;height:240px;background:#F8FAFC;border:2px solid #94A3B8;border-radius:12px;padding:12px;box-sizing:border-box;margin-top:12px;display:flex;flex-direction:column;justify-content:space-between;` }, cotTS);
  hm('div', { style: `display:flex;justify-content:space-between;align-items:center;` }, tsDh, `
    <span style="font-size:24px;font-weight:800;color:#334155;">TÀI SẢN DÀI HẠN (> 1 năm)</span>
    <span style="font-size:28px;font-weight:800;color:#334155;">40 đồng</span>
  `);
  hm('div', { style: 'font-size:18px;color:#475569;text-align:left;line-height:1.4;' }, tsDh, `
    • Nhà xưởng, văn phòng làm việc: <b>25 đồng</b><br>
    • Máy móc, dây chuyền thiết bị: <b>15 đồng</b>
  `);
  hm('div', { style: `background:#E2E8F0;color:#334155;font-size:16px;font-weight:700;padding:4px 8px;border-radius:6px;width:fit-content;` }, tsDh, 'Phục vụ sản xuất kinh doanh nhiều năm');

  // Cột Phải: NGUỒN VỐN 100 đồng (x=1000, y=140, w=680, h=660)
  const cotNV = taoThe(S, 1000, 140, 680, 660, '#FFFFFF', M.xanhDuong, { a, bw: 3, bo: 16, pad: 16 });
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.xanhDuong};margin-bottom:12px;letter-spacing:0.5px;` }, cotNV, 'TỔNG NGUỒN VỐN: 100 ĐỒNG');

  // Khối Nợ ngắn hạn (40 đồng)
  const noNg = hm('div', { style: `width:100%;height:240px;background:${M.doNhat};border:2px solid ${M.do};border-radius:12px;padding:12px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;` }, cotNV);
  hm('div', { style: `display:flex;justify-content:space-between;align-items:center;` }, noNg, `
    <span style="font-size:24px;font-weight:800;color:${M.do};">NỢ NGẮN HẠN (< 1 năm)</span>
    <span style="font-size:28px;font-weight:800;color:${M.do};">40 đồng</span>
  `);
  hm('div', { style: 'font-size:18px;color:#991B1B;text-align:left;line-height:1.4;' }, noNg, `
    • Phải trả người bán (chiếm dụng): <b>20 đồng</b><br>
    • Vay ngắn hạn ngân hàng: <b>20 đồng</b>
  `);
  hm('div', { style: `background:#FECACA;color:${M.do};font-size:16px;font-weight:700;padding:4px 8px;border-radius:6px;width:fit-content;` }, noNg, 'Áp lực phải trả dứt điểm trong 1 năm');

  // Khối Nguồn vốn dài hạn (60 đồng)
  const nvDh = hm('div', { style: `width:100%;height:320px;background:${M.lucNhat};border:2px solid ${M.xanhNgoc};border-radius:12px;padding:12px;box-sizing:border-box;margin-top:12px;display:flex;flex-direction:column;justify-content:space-between;` }, cotNV);
  hm('div', { style: `display:flex;justify-content:space-between;align-items:center;` }, nvDh, `
    <span style="font-size:24px;font-weight:800;color:${M.xanhNgoc};">NGUỒN VỐN DÀI HẠN (> 1 năm)</span>
    <span style="font-size:28px;font-weight:800;color:${M.xanhNgoc};">60 đồng</span>
  `);
  hm('div', { style: 'font-size:18px;color:#065F46;text-align:left;line-height:1.4;' }, nvDh, `
    • Vay dài hạn ngân hàng: <b>15 đồng</b><br>
    • Vốn chủ sở hữu (vốn góp + thặng dư): <b>45 đồng</b>
  `);
  hm('div', { style: `background:#A7F3D0;color:${M.xanhNgoc};font-size:16px;font-weight:700;padding:4px 8px;border-radius:6px;width:fit-content;` }, nvDh, 'Nguồn vốn thường xuyên, không bị đòi gấp');

  return { cotTS, cotNV };
}

// =========================================================================
// CẢNH 1: Nghịch lý có lãi nhưng cạn tiền (0.0 -> 31.785)
// =========================================================================
N.canh1 = function (S) {
  nhanGD(S, 0);
  taoHeader(S, 1, 'Nghịch lý có lãi nhưng cạn tiền');

  // Thẻ Báo cáo tài chính (Trái)
  const theBCTC = taoThe(S, 160, 160, 760, 640, '#FFFFFF', M.theBorder, { a: 0.5 });
  hm('div', { style: `font-size:28px;font-weight:800;color:${M.chu};margin-bottom:16px;border-bottom:2px solid ${M.nenPhu};padding-bottom:10px;width:100%;` }, theBCTC, 'BÁO CÁO KẾT QUẢ KINH DOANH');
  hm('div', { style: 'width:100%;font-size:22px;color:#334155;text-align:left;line-height:2.2;' }, theBCTC, `
    <div style="display:flex;justify-content:space-between;"><span>Doanh thu bán hàng:</span><b style="color:${M.xanhDuong};font-size:26px;">120 TỶ ĐỒNG</b></div>
    <div style="display:flex;justify-content:space-between;"><span>Giá vốn & Chi phí:</span><b>105 TỶ ĐỒNG</b></div>
    <div style="display:flex;justify-content:space-between;border-top:2px dashed #CBD5E1;padding-top:10px;margin-top:10px;">
      <span style="font-weight:800;color:${M.xanhNgoc};font-size:24px;">LỢI NHUẬN SAU THUẾ:</span>
      <b style="color:${M.xanhNgoc};font-size:32px;">+15 TỶ ĐỒNG</b>
    </div>
  `);
  hm('div', { style: `margin-top:30px;background:${M.lucNhat};color:${M.xanhNgoc};padding:12px 20px;border-radius:10px;font-size:20px;font-weight:800;` }, theBCTC, 'SỔ SÁCH KẾ TOÁN: BÁO CÁO CÓ LÃI RẤT LỚN!');

  // Thẻ Thực tế số dư ngân hàng (Phải - Xuất hiện ở câu 2)
  const theTK = taoThe(S, 1000, 160, 760, 640, '#FFFFFF', M.do, { a: C(1, 2), bw: 3 });
  hm('div', { style: `font-size:28px;font-weight:800;color:${M.do};margin-bottom:16px;border-bottom:2px solid ${M.doNhat};padding-bottom:10px;width:100%;` }, theTK, 'THỰC TẾ DÒNG TIỀN TẠI TÀI KHOẢN');
  hm('div', { style: 'width:100%;font-size:22px;color:#7F1D1D;text-align:left;line-height:2.0;' }, theTK, `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <span>Số dư tài khoản ngân hàng:</span>
      <b style="color:${M.do};font-size:36px;background:${M.doNhat};padding:4px 14px;border-radius:8px;">0 ĐỒNG</b>
    </div>
    <div style="margin-top:20px;background:#FEF2F2;border-left:5px solid ${M.do};padding:12px;border-radius:4px;">
      • Tiền lương nhân viên tháng này: <b>CHƯA CÓ TRẢ</b><br>
      • Nợ nhà cung cấp đến hạn: <b>BỊ ĐÒI RÁO RIẾT</b><br>
      • Tiền bán hàng: <b>KHÁCH VẪN ĐANG NỢ CHƯA TRẢ!</b>
    </div>
  `);
  hm('div', { style: `margin-top:20px;background:${M.do};color:#FFF;padding:14px 24px;border-radius:10px;font-size:22px;font-weight:800;` }, theTK, 'NGUY CƠ: VỠ TRẬN THANH KHOẢN!');

  // Dải câu hỏi cốt lõi ở câu 3 & 4
  const footerCard = taoThe(S, 200, 830, 1520, 80, M.xanhDuong, M.xanhDuong, { a: C(1, 3) });
  hm('div', { style: 'color:#FFFFFF;font-size:26px;font-weight:800;letter-spacing:0.5px;' }, footerCard,
    'VÌ SAO CÓ LÃI MÀ CẠN TIỀN? · VỐN LƯU ĐỘNG RÒNG (NWC) CHÍNH LÀ LỜI GIẢI ĐÁP'
  );
};

// =========================================================================
// CẢNH 2: Cắt đôi bảng cân đối kế toán (31.785 -> 73.402)
// =========================================================================
N.canh2 = function (S) {
  nhanGD(S, C(2, 1));
  taoHeader(S, 2, 'Cắt đôi bảng cân đối kế toán (Thông tư 200/2014/TT-BTC)');

  // Vẽ 2 cột BCTC
  veCotBCTC(S, C(2, 1));

  // Đường cắt ngang ranh giới 1 năm (ở giữa màn hình y=460)
  const lineCard = taoThe(S, 180, 470, 1560, 48, 'rgba(15, 23, 42, 0.9)', '#0F172A', { a: C(2, 2), bo: 8, pad: 4 });
  hm('div', { style: 'color:#F8FAFC;font-size:20px;font-weight:800;letter-spacing:1px;' }, lineCard,
    '◀ MỐC PHÂN ĐỊNH KỲ HẠN: 1 NĂM (NGẮN HẠN PHÍA TRÊN ▲ · DÀI HẠN PHÍA DƯỚI ▼) ▶'
  );

  // Thẻ ghi chú tóm tắt bên dưới
  const note = taoThe(S, 240, 825, 1440, 75, '#FFFFFF', M.xanhLam, { a: C(2, 3) });
  hm('div', { style: `color:${M.chu};font-size:22px;font-weight:700;line-height:1.4;` }, note,
    'Nguyên tắc vàng kế toán: <b>TỔNG TÀI SẢN (100 đồng) = TỔNG NGUỒN VỐN (100 đồng)</b><br>' +
    '<span style="color:#0284C7;">Tài sản ngắn hạn: 60đ</span> · <span style="color:#334155;">Dài hạn: 40đ</span> | <span style="color:#DC2626;">Nợ ngắn hạn: 40đ</span> · <span style="color:#059669;">Nguồn vốn dài hạn: 60đ</span>'
  );
};

// =========================================================================
// CẢNH 3: Vốn lưu động ròng là gì và hai cách tính (73.402 -> 112.027)
// =========================================================================
N.canh3 = function (S) {
  nhanGD(S, C(3, 1));
  taoHeader(S, 3, 'Vốn lưu động ròng là gì? Hai cách tính');

  // Thẻ Cách 1 (Trái)
  const c1 = taoThe(S, 160, 160, 760, 520, '#FFFFFF', M.xanhLam, { a: C(3, 1), bw: 3 });
  hm('div', { style: `background:${M.xanhLam};color:#FFF;padding:8px 18px;border-radius:8px;font-size:22px;font-weight:800;` }, c1, 'CÁCH 1: GÓC NHÌN TÀI SẢN LUÂN CHUYỂN');
  hm('div', { style: `margin-top:24px;font-size:24px;color:${M.chu};text-align:center;line-height:1.6;` }, c1, `
    <b>Vốn lưu động ròng (NWC)</b><br>
    = Tài sản ngắn hạn − Nợ ngắn hạn
  `);
  hm('div', { style: `margin-top:24px;background:${M.xanhNhat};border:2px dashed ${M.xanhLam};padding:18px;border-radius:12px;font-size:32px;font-weight:800;color:${M.xanhDuong};` }, c1, `
    60 − 40 = <span style="color:${M.xanhNgoc};">+20 ĐỒNG</span>
  `);
  hm('div', { style: 'margin-top:20px;font-size:19px;color:#475569;text-align:left;line-height:1.5;' }, c1, `
    • Tài sản ngắn hạn có 60 đồng<br>
    • Nợ ngắn hạn phải trả 40 đồng<br>
    • Dôi dư ra <b>20 đồng</b> vốn ngắn hạn không bị nợ đòi!
  `);

  // Thẻ Cách 2 (Phải - Xuất hiện ở câu 5)
  const c2 = taoThe(S, 1000, 160, 760, 520, '#FFFFFF', M.xanhNgoc, { a: C(3, 5), bw: 3 });
  hm('div', { style: `background:${M.xanhNgoc};color:#FFF;padding:8px 18px;border-radius:8px;font-size:22px;font-weight:800;` }, c2, 'CÁCH 2: GÓC NHÌN CÂN ĐỐI NGUỒN VỐN');
  hm('div', { style: `margin-top:24px;font-size:24px;color:${M.chu};text-align:center;line-height:1.6;` }, c2, `
    <b>Vốn lưu động ròng (NWC)</b><br>
    = Nguồn vốn dài hạn − Tài sản dài hạn
  `);
  hm('div', { style: `margin-top:24px;background:${M.lucNhat};border:2px dashed ${M.xanhNgoc};padding:18px;border-radius:12px;font-size:32px;font-weight:800;color:${M.xanhNgoc};` }, c2, `
    60 − 40 = <span style="color:${M.xanhNgoc};">+20 ĐỒNG</span>
  `);
  hm('div', { style: 'margin-top:20px;font-size:19px;color:#065F46;text-align:left;line-height:1.5;' }, c2, `
    • Nguồn vốn dài hạn có 60 đồng (vốn chủ + nợ dài)<br>
    • Nuôi đủ 40 đồng nhà xưởng máy móc dài hạn<br>
    • Còn thừa <b>20 đồng</b> vốn dài hạn tài trợ sang tài sản ngắn hạn!
  `);

  // Kết luận (Câu 6)
  const cBottom = taoThe(S, 240, 720, 1440, 140, M.nenPhu, M.xanhDuong, { a: C(3, 6) });
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.xanhDuong};` }, cBottom, 'HAI CÁCH TÍNH · MỘT KẾT QUẢ DUY NHẤT: NWC = +20 ĐỒNG');
  hm('div', { style: 'font-size:20px;color:#334155;margin-top:8px;line-height:1.4;' }, cBottom,
    'Bản chất của Vốn lưu động ròng chính là: <b>Phần nguồn vốn dài hạn thường xuyên dùng để tài trợ cho tài sản ngắn hạn.</b>'
  );
};

// =========================================================================
// CẢNH 4: Đệm an toàn thanh khoản (112.027 -> 149.137)
// =========================================================================
N.canh4 = function (S) {
  nhanGD(S, C(4, 1));
  taoHeader(S, 4, 'Ý nghĩa cốt lõi: Đệm an toàn thanh khoản');

  // Mô phỏng tình huống chủ nợ đòi tiền (Trái)
  const leftCard = taoThe(S, 160, 160, 760, 560, '#FFFFFF', M.theBorder, { a: C(4, 1) });
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.do};margin-bottom:14px;` }, leftCard, 'THỬ THÁCH: NỢ NGẮN HẠN ĐẾN HẠN');
  hm('div', { style: `background:${M.doNhat};border:2px solid ${M.do};padding:14px;border-radius:10px;width:90%;font-size:22px;color:${M.do};font-weight:800;` }, leftCard,
    'CHỦ NỢ ĐÒI ĐỦ 40 ĐỒNG NỢ NGẮN HẠN!'
  );
  hm('div', { style: 'font-size:20px;color:#334155;text-align:left;line-height:1.8;margin-top:20px;width:90%;' }, leftCard, `
    1. Doanh nghiệp lấy tài sản ngắn hạn thanh toán: <b>40 đồng</b><br>
    2. Tài sản ngắn hạn ban đầu: <b>60 đồng</b><br>
    3. Sau khi trả sạch nợ ngắn hạn: <b>VẪN DƯ 20 ĐỒNG!</b><br>
    <div style="margin-top:10px;padding:8px;background:${M.lucNhat};border-radius:6px;color:${M.xanhNgoc};font-weight:700;">
      ✓ Không bị gián đoạn sản xuất kinh doanh<br>
      ✓ Không bị áp lực phải bán tháo hàng tồn kho
    </div>
  `);

  // Chiếc khiên bảo vệ (Phải - Xuất hiện ở câu 3)
  const rightCard = taoThe(S, 1000, 160, 760, 560, '#FFFFFF', M.xanhNgoc, { a: C(4, 3), bw: 3 });
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.xanhNgoc};margin-bottom:14px;` }, rightCard, 'TẤM ĐỆM AN TOÀN (LIQUIDITY CUSHION)');
  hm('div', { style: `background:${M.lucNhat};border:2px solid ${M.xanhNgoc};padding:14px;border-radius:10px;width:90%;font-size:22px;color:${M.xanhNgoc};font-weight:800;` }, rightCard,
    'NWC > 0 : VỐN DÀI HẠN GÁNH ĐỠ CHO TÀI SẢN NGẮN HẠN'
  );
  hm('div', { style: 'font-size:20px;color:#065F46;text-align:left;line-height:1.8;margin-top:20px;width:90%;' }, rightCard, `
    • Hàng tồn kho 30đ cần thời gian để bán ra<br>
    • Tiền khách nợ 20đ cần thời gian để thu hồi<br>
    • Nhờ có <b>20đ vốn dài hạn ổn định</b> tài trợ đỡ lưng, doanh nghiệp thong thả xoay vòng vốn mà không sợ nghẽn dòng tiền.
  `);

  // Banner tổng kết
  const botCard = taoThe(S, 200, 760, 1520, 100, M.xanhDuong, M.xanhDuong, { a: C(4, 5) });
  hm('div', { style: 'color:#FFFFFF;font-size:24px;font-weight:800;' }, botCard,
    'NWC > 0 CÀNG LỚN · ĐỆM AN TOÀN CÀNG VỮNG · RỦI RO THANH KHOẢN CÀNG THẤP'
  );
};

// =========================================================================
// CẢNH 5: Căn bệnh nguy hiểm: Lấy ngắn nuôi dài (149.137 -> 195.167)
// =========================================================================
N.canh5 = function (S) {
  nhanGD(S, C(5, 1));
  taoHeader(S, 5, 'Căn bệnh nguy hiểm: Lấy ngắn nuôi dài (NWC < 0)');

  // Bảng cân đối biến động (Trái)
  const cotTrai = taoThe(S, 160, 160, 760, 680, '#FFFFFF', M.do, { a: C(5, 1), bw: 3 });
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.do};margin-bottom:12px;` }, cotTrai, 'SAI LẦM: DÙNG NỢ NGẮN ĐẦU TƯ DÀI HẠN');
  hm('div', { style: 'font-size:19px;color:#475569;text-align:left;line-height:1.6;width:90%;' }, cotTrai, `
    Doanh nghiệp mua thêm máy móc mới <b>30 đồng</b>.<br>
    Thay vì tăng vốn dài hạn, lại đi <b>vay ngắn hạn ngân hàng 30 đồng!</b>
  `);
  
  // So sánh trước vs sau
  hm('div', { style: `width:90%;margin-top:16px;background:${M.nenPhu};border-radius:10px;padding:12px;font-size:18px;color:#1E293B;` }, cotTrai, `
    <table style="width:100%;text-align:left;border-collapse:collapse;">
      <tr style="border-bottom:1px solid #CBD5E1;"><th>Chỉ tiêu</th><th>Trước</th><th>Sau khi mua</th></tr>
      <tr><td>Tài sản ngắn hạn</td><td>60đ</td><td><b>60đ</b></td></tr>
      <tr><td>Tài sản dài hạn</td><td>40đ</td><td style="color:${M.xanhDuong};"><b>70đ (+30)</b></td></tr>
      <tr style="border-top:1px solid #CBD5E1;"><td>Nợ ngắn hạn</td><td>40đ</td><td style="color:${M.do};"><b>70đ (+30)</b></td></tr>
      <tr><td>Vốn dài hạn</td><td>60đ</td><td><b>60đ</b></td></tr>
    </table>
  `);

  hm('div', { style: `margin-top:16px;background:${M.doNhat};border:2px dashed ${M.do};padding:14px;border-radius:10px;font-size:26px;font-weight:800;color:${M.do};width:90%;` }, cotTrai,
    'NWC MỚI = 60 − 70 = −10 ĐỒNG (ÂM)!'
  );

  // Phân tích rủi ro (Phải - Xuất hiện ở câu 6)
  const cotPhai = taoThe(S, 1000, 160, 760, 680, '#FFFFFF', M.do, { a: C(5, 6), bw: 3 });
  hm('div', { style: `background:${M.do};color:#FFF;padding:8px 18px;border-radius:8px;font-size:24px;font-weight:800;` }, cotPhai, 'CẢNH BÁO BÁO ĐỘNG ĐỎ');
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.do};margin-top:16px;` }, cotPhai, 'LỆCH PHA KỲ HẠN NGHIÊM TRỌNG');
  
  hm('div', { style: 'font-size:20px;color:#7F1D1D;text-align:left;line-height:1.7;margin-top:16px;width:90%;' }, cotPhai, `
    <div style="background:#FEF2F2;border-left:4px solid ${M.do};padding:10px;margin-bottom:10px;border-radius:4px;">
      <b>1. Dây chuyền máy móc mới (70đ):</b><br>
      Cần 5–10 năm mới sinh đủ dòng tiền thu hồi vốn.
    </div>
    <div style="background:#FEF2F2;border-left:4px solid ${M.do};padding:10px;margin-bottom:10px;border-radius:4px;">
      <b>2. Nợ vay ngắn hạn ngân hàng (70đ):</b><br>
      Chỉ vài tháng là đến hạn phải trả cả gốc lẫn lãi!
    </div>
    <div style="background:#FEF2F2;border-left:4px solid ${M.do};padding:10px;margin-bottom:10px;border-radius:4px;">
      <b>3. Nguy cơ vỡ nợ:</b><br>
      Khi ngân hàng không cho đảo nợ hoặc thị trường chững lại, doanh nghiệp lập tức cạn tiền dù trên sổ sách kế toán vẫn có lãi!
    </div>
  `);
};

// =========================================================================
// CẢNH 6: Phân biệt NWC và Nhu cầu vốn lưu động (195.167 -> 227.746)
// =========================================================================
N.canh6 = function (S) {
  nhanGD(S, C(6, 1));
  taoHeader(S, 6, 'Phân biệt Vốn lưu động ròng và Nhu cầu vốn lưu động');

  // Cột Trái: Nhu cầu vốn lưu động (WCR)
  const leftCard = taoThe(S, 160, 160, 760, 520, '#FFFFFF', M.xanhLam, { a: C(6, 1), bw: 3 });
  hm('div', { style: `background:${M.xanhLam};color:#FFF;padding:8px 18px;border-radius:8px;font-size:22px;font-weight:800;` }, leftCard, 'NHU CẦU VỐN LƯU ĐỘNG (WCR)');
  hm('div', { style: `margin-top:20px;font-size:24px;color:${M.chu};text-align:center;line-height:1.5;` }, leftCard, `
    <b>Số tiền bị giam trong chu kỳ kinh doanh</b><br>
    = (Hàng tồn kho + Phải thu) − Phải trả người bán
  `);
  hm('div', { style: `margin-top:20px;background:${M.xanhNhat};border:2px dashed ${M.xanhLam};padding:16px;border-radius:10px;font-size:28px;font-weight:800;color:${M.xanhDuong};` }, leftCard,
    '(30đ + 20đ) − 20đ = 30 ĐỒNG'
  );
  hm('div', { style: 'margin-top:16px;font-size:19px;color:#334155;text-align:left;line-height:1.6;' }, leftCard, `
    • Bản chất: <b>Doanh nghiệp cần bao nhiêu tiền</b> để duy trì hoạt động mua hàng, dự trữ và bán hàng liên tục.
  `);

  // Cột Phải: Vốn lưu động ròng (NWC)
  const rightCard = taoThe(S, 1000, 160, 760, 520, '#FFFFFF', M.xanhNgoc, { a: C(6, 1), bw: 3 });
  hm('div', { style: `background:${M.xanhNgoc};color:#FFF;padding:8px 18px;border-radius:8px;font-size:22px;font-weight:800;` }, rightCard, 'VỐN LƯU ĐỘNG RÒNG (NWC)');
  hm('div', { style: `margin-top:20px;font-size:24px;color:${M.chu};text-align:center;line-height:1.5;` }, rightCard, `
    <b>Nguồn vốn dài hạn sẵn có để tài trợ</b><br>
    = Nguồn vốn dài hạn − Tài sản dài hạn
  `);
  hm('div', { style: `margin-top:20px;background:${M.lucNhat};border:2px dashed ${M.xanhNgoc};padding:16px;border-radius:10px;font-size:28px;font-weight:800;color:${M.xanhNgoc};` }, rightCard,
    '60đ − 40đ = 20 ĐỒNG'
  );
  hm('div', { style: 'margin-top:16px;font-size:19px;color:#065F46;text-align:left;line-height:1.6;' }, rightCard, `
    • Bản chất: <b>Doanh nghiệp sẵn có bao nhiêu tiền vốn ổn định</b> để bù đắp cho nhu cầu kinh doanh hàng ngày.
  `);

  // Thẻ So sánh xuất hiện ở câu 5: Khoảng trống thiếu hụt tiền
  const gapCard = taoThe(S, 200, 715, 1520, 150, '#FFFFFF', M.vang, { a: C(6, 5), bw: 3 });
  hm('div', { style: `font-size:26px;font-weight:800;color:${M.vang};` }, gapCard,
    'KHOẢNG TRỐNG THIẾU HỤT VỐN = NHU CẦU VLĐ (30đ) − VỐN SẴN CÓ NWC (20đ) = 10 ĐỒNG'
  );
  hm('div', { style: 'font-size:20px;color:#334155;margin-top:10px;line-height:1.4;' }, gapCard,
    'Chính <b>10 đồng thiếu hụt</b> này tạo ra lý do doanh nghiệp phải gõ cửa ngân hàng để xin cấp <b>hạn mức tín dụng vay vốn lưu động!</b>'
  );
};

// =========================================================================
// CẢNH 7: Ngân hàng thẩm định vốn lưu động thế nào? (227.746 -> 272.949)
// =========================================================================
N.canh7 = function (S) {
  nhanGD(S, C(7, 1));
  taoHeader(S, 7, 'Góc nhìn thẩm định ngân hàng (Thông tư 39 & Thông tư 06)');

  // Khung công thức cấp hạn mức (Trên)
  const topCard = taoThe(S, 200, 150, 1520, 130, '#FFFFFF', M.xanhDuong, { a: C(7, 1), bw: 3 });
  hm('div', { style: `font-size:24px;font-weight:800;color:${M.xanhDuong};` }, topCard,
    'CÔNG THỨC XÁC ĐỊNH HẠN MỨC CHO VAY VỐN LƯU ĐỘNG CỦA NGÂN HÀNG'
  );
  hm('div', { style: `margin-top:10px;background:${M.nenPhu};padding:10px 24px;border-radius:8px;font-size:26px;font-weight:800;color:${M.chu};` }, topCard,
    'Hạn mức tín dụng tối đa = Nhu cầu VLĐ − Vốn lưu động ròng (NWC) − Vốn tự có tham gia'
  );

  // Khung Trái: Khi NWC > 0 (Dương lớn) - Câu 3
  const traicard = taoThe(S, 200, 310, 730, 480, '#FFFFFF', M.xanhNgoc, { a: C(7, 3), bw: 3 });
  hm('div', { style: `background:${M.lucNhat};color:${M.xanhNgoc};padding:8px 16px;border-radius:8px;font-size:22px;font-weight:800;` }, traicard,
    'TRƯỜNG HỢP NWC > 0 (DƯƠNG LỚN)'
  );
  hm('div', { style: 'font-size:20px;color:#065F46;text-align:left;line-height:1.7;margin-top:20px;width:90%;' }, traicard, `
    <b>Đánh giá của Cán bộ Tín dụng:</b><br>
    ✓ Cơ cấu tài chính an toàn, tự chủ vốn cao.<br>
    ✓ Khả năng thanh toán nợ ngắn hạn vững chắc.<br>
    ✓ Rủi ro vỡ nợ thấp.<br><br>
    <b>Quyết định phê duyệt:</b><br>
    • Duyệt cấp hạn mức nhanh chóng.<br>
    • Áp dụng lãi suất cho vay ưu đãi.<br>
    • Điều kiện giải ngân linh hoạt.
  `);

  // Khung Phải: Khi NWC < 0 (Âm) - Câu 4
  const phaiCard = taoThe(S, 990, 310, 730, 480, '#FFFFFF', M.do, { a: C(7, 4), bw: 3 });
  hm('div', { style: `background:${M.doNhat};color:${M.do};padding:8px 16px;border-radius:8px;font-size:22px;font-weight:800;` }, phaiCard,
    'TRƯỜNG HỢP NWC < 0 (BỊ ÂM)'
  );
  hm('div', { style: 'font-size:20px;color:#7F1D1D;text-align:left;line-height:1.7;margin-top:20px;width:90%;' }, phaiCard, `
    <b>Đánh giá của Cán bộ Tín dụng:</b><br>
    ⚠ Cảnh báo đỏ: Có dấu hiệu "lấy ngắn nuôi dài".<br>
    ⚠ Nguy cơ sử dụng vốn vay ngắn hạn sai mục đích theo Điều 102 Luật Các TCTD 2024.<br>
    ⚠ Rủi ro mất khả năng thanh toán cao.<br><br>
    <b>Hành động của ngân hàng:</b><br>
    • Kiểm soát dòng tiền qua tài khoản cực kỳ gắt gao.<br>
    • Yêu cầu bổ sung tài sản bảo đảm thanh khoản cao.<br>
    • Có thể từ chối phê duyệt hoặc ngừng giải ngân.
  `);

  // Chân bảng
  const footerLegal = taoThe(S, 200, 815, 1520, 65, M.nenPhu, M.theBorder, { a: C(7, 1) });
  hm('div', { style: 'font-size:18px;color:#475569;font-weight:700;' }, footerLegal,
    'Căn cứ pháp lý: Luật Các tổ chức tín dụng 2024 (Điều 102) · Thông tư 39/2016/TT-NHNN · Thông tư 06/2023/TT-NHNN'
  );
};

// =========================================================================
// CẢNH 8: Bài học quản trị dòng tiền và lời khuyên (272.949 -> 308.031)
// =========================================================================
N.canh8 = function (S) {
  nhanGD(S, C(8, 1));
  taoHeader(S, 8, '3 Nguyên tắc vàng quản trị vốn lưu động');

  // 3 Thẻ bài học
  const b1 = taoThe(S, 160, 160, 480, 500, '#FFFFFF', M.xanhDuong, { a: C(8, 1), bw: 3 });
  hm('div', { style: `width:60px;height:60px;border-radius:50%;background:${M.xanhDuong};color:#FFF;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;` }, b1, '1');
  hm('div', { style: `font-size:24px;font-weight:800;color:${M.xanhDuong};margin-top:16px;` }, b1, 'CÂN ĐỐI KỲ HẠN');
  hm('div', { style: 'font-size:19px;color:#334155;text-align:left;line-height:1.6;margin-top:16px;' }, b1, `
    Tài sản dài hạn bắt buộc phải được tài trợ bằng nguồn vốn dài hạn.<br><br>
    <b>Tuyệt đối không lấy nợ vay ngắn hạn để mua sắm máy móc hay mở rộng nhà xưởng.</b>
  `);

  const b2 = taoThe(S, 720, 160, 480, 500, '#FFFFFF', M.xanhNgoc, { a: C(8, 2), bw: 3 });
  hm('div', { style: `width:60px;height:60px;border-radius:50%;background:${M.xanhNgoc};color:#FFF;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;` }, b2, '2');
  hm('div', { style: `font-size:24px;font-weight:800;color:${M.xanhNgoc};margin-top:16px;` }, b2, 'GIỮ ĐỆM NWC DƯƠNG');
  hm('div', { style: 'font-size:19px;color:#065F46;text-align:left;line-height:1.6;margin-top:16px;' }, b2, `
    Luôn duy trì vốn lưu động ròng ở mức dương an toàn.<br><br>
    Đệm NWC giúp bảo vệ doanh nghiệp trước các cú sốc khách hàng chậm trả nợ hoặc hàng hoá chậm tiêu thụ.
  `);

  const b3 = taoThe(S, 1280, 160, 480, 500, '#FFFFFF', M.vang, { a: C(8, 3), bw: 3 });
  hm('div', { style: `width:60px;height:60px;border-radius:50%;background:${M.vang};color:#FFF;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:800;` }, b3, '3');
  hm('div', { style: `font-size:24px;font-weight:800;color:${M.vang};margin-top:16px;` }, b3, 'TỐI ƯU VÒNG QUAY');
  hm('div', { style: 'font-size:19px;color:#78350F;text-align:left;line-height:1.6;margin-top:16px;' }, b3, `
    Chủ động thu hồi công nợ khách hàng nhanh hơn.<br><br>
    Kiểm soát và giải phóng hàng tồn kho đọng vốn để giảm nhu cầu vốn lưu động thiếu hụt trước khi đi vay.
  `);

  // Banner tổng kết trước khi sang màn hình kết
  const finalSummary = taoThe(S, 200, 690, 1520, 90, M.xanhDuong, M.xanhDuong, { a: C(8, 1), b: KT });
  hm('div', { style: 'color:#FFFFFF;font-size:22px;font-weight:800;' }, finalSummary,
    'DOANH THU LÀ PHÙ HOA · LỢI NHUẬN LÀ Ý KIẾN · DÒNG TIỀN VÀ THANH KHOẢN MỚI LÀ SỰ THẬT!'
  );
};

// =========================================================================
// PHỤ ĐỀ, LOGO, MÀN HÌNH KẾT
// =========================================================================
let phuDe, logo, ket;
function taoPhuDe() {
  const chp = CH.map((c) => Object.assign({}, c, { cau: c.cau.slice() }));
  chp[chp.length - 1].cau.pop(); // câu kêu gọi cuối nằm dưới màn hình kết, không có phụ đề
  phuDe = K.phu_de_chay_chu({ chuong: chp, mau: { the: '#001627', chu: '#FFFFFF', nhan: '#7FC4F5' }, day: 1014, co: 38 });
  const hopPD = phuDe.el.querySelector('[data-hop]');
  if (hopPD) { hopPD.style.background = 'rgba(0,22,39,0.92)'; hopPD.style.border = 'none'; hopPD.style.borderRadius = '10px'; }
  stage.appendChild(phuDe.el);
}

function taoLogoKet() {
  logo = K.logo_goc({ kieu: 'phang', vao: 0, ra: 3.6 });
  stage.appendChild(logo.el); logo.el.setAttribute('data-kho-kenh', 'logo');

  const mk = TG.man_hinh_ket;
  ket = K.man_hinh_ket_kenh({ kieu: 'phang', vao: mk.t, dai: mk.den - mk.t });
  stage.appendChild(ket.el); ket.el.setAttribute('data-kho-kenh', 'ket');
}

// =========================================================================
// HÀM SEEK(T) — HỢP ĐỒNG KHUNG HÌNH THEO THỜI GIAN T
// =========================================================================
function seek(t) {
  t = Math.max(0, Math.min(t, DUR));
  
  // Duyệt qua 8 cảnh
  for (let c = 1; c <= CH.length; c++) {
    const S = N.canh[c];
    if (!S) continue;
    const trong = t >= S.t0 && t < S.t1;
    S.root.style.display = trong ? 'block' : 'none';
    if (trong) {
      for (const it of S.items) veItem(it, S, t);
      for (const f of S.ves) f(t);
    }
  }

  // Cập nhật phụ đề, logo và màn hình kết
  if (phuDe) {
    phuDe.seek(t);
    phuDe.el.style.visibility = t >= KT - 0.05 ? 'hidden' : 'visible';
  }
  if (logo) {
    logo.seek(t);
    logo.el.style.visibility = t >= KT - 0.05 ? 'hidden' : 'visible';
  }
  if (ket) {
    ket.seek(t);
    ket.el.style.visibility = t >= KT ? 'visible' : 'hidden';
  }
}

window.seek = seek;
N.seek = seek;

// =========================================================================
// TỰ KIỂM CHẤT LƯỢNG (kiemTra, demTu, chuHienThi)
// =========================================================================
function doMo(el) {
  let m = 1;
  for (let e = el; e && e !== stage.parentElement; e = e.parentElement) {
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none') return 0;
    m *= parseFloat(s.opacity || 1);
    if (e instanceof SVGElement && e.getAttribute('opacity') != null) m *= parseFloat(e.getAttribute('opacity'));
  }
  return m;
}

function chuNodes() {
  const out = [], w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = w.nextNode())) {
    const chu = n.textContent.trim();
    if (!chu || !n.parentElement) continue;
    if (doMo(n.parentElement) < 0.2) continue;
    const rg = document.createRange(); rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect();
    if (r.width === 0) continue;
    out.push({ n, chu, r });
  }
  return out;
}

window.kiemTra = function (t) {
  seek(t);
  const loi = [];
  for (const l of K.kiemChu(stage, { tl: scaleNow })) {
    if (l.loai !== 'chu_de_chu' && !(l.loai === 'tran_khung' && /^[₫$%?≠=><−+]$/.test(l.chu || ''))) loi.push(l);
  }
  const gr = stage.getBoundingClientRect();
  const ds = chuNodes();
  for (const { n, chu, r } of ds) {
    const el = n.parentElement;
    const co = parseFloat(getComputedStyle(el).fontSize);
    if (co < 15 && !el.closest('.kho-nhan-gia-dinh')) {
      loi.push({ loai: 'chu_nho', chu: chu.slice(0, 30), co });
    }
    const day = (r.bottom - gr.top) / scaleNow;
    if (!el.closest('.kho-phu-de') && !el.closest('[data-kho-kenh]') && day > 900) {
      loi.push({ loai: 'chu_vao_dai_phu_de', chu: chu.slice(0, 30), day: Math.round(day) });
    }
  }
  return loi;
};

// =========================================================================
// KHỞI ĐỘNG
// =========================================================================
function fit() {
  scaleNow = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `scale(${scaleNow})`;
}

const QS = new URLSearchParams(location.search);
const FIXED = QS.has('t') ? parseFloat(QS.get('t')) : null;
let t0 = 0;

function tick() {
  const t = FIXED != null ? FIXED : Math.min((performance.now() - t0) / 1000, DUR);
  seek(t);
  if (FIXED == null && t < DUR) requestAnimationFrame(tick);
}

N.start = async function () {
  await K.napPhong();
  await document.fonts.ready;
  fit();
  addEventListener('resize', fit);
  
  for (let c = 1; c <= CH.length; c++) {
    const S = taoCanh(c);
    if (N['canh' + c]) N['canh' + c](S);
  }
  taoPhuDe();
  taoLogoKet();
  
  t0 = performance.now();
  window.__san_sang = true;
  seek(FIXED != null ? FIXED : 0);
  if (FIXED == null) requestAnimationFrame(tick);
};

})();
