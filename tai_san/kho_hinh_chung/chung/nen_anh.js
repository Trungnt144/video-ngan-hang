// chung/nen_anh.js — 1.0 — lớp ảnh nền tả thực (Muse tạo) theo phiếu đặt hình: nạp ảnh nền và biến thể, toạ độ vùng neo,
// chuyển biến thể và chuyển động máy quay là hàm thuần của t, khung bố cục xám có ô vùng neo để xuất cho Muse.
// Lập 08/11/2026 (luồng Claude–Muse, quyết định của Trung 07/11/2026). Cần chung/kho_nen.js nạp trước.
// Hợp đồng phiếu: muse/mau_phieu_dat_hinh.json. Cách dùng trong trang và lệnh xuất khung: skills/lam-video-ba-chang/tham_chieu/muse.md.
//
// Trang dựng nhúng phiếu giữa hai dấu (lệnh `node scripts/khung_bo_cuc.mjs <thư mục dựng> --chi-nhung` tự chèn):
//   <!--PHIEU_BAT_DAU--><script type="application/json" id="phieu_dat_hinh">{...}</script><!--PHIEU_KET_THUC-->
// rồi trong N.start():
//   await KHO.nenAnh.nap();                                  // nạp mọi ảnh nen_muse, thiếu ảnh thì cảnh hiện khung xám
//   const S = KHO.nenAnh.canh('nen_mat_cat', root, {
//     lich: [{ t: 0, bien_the: 'nguyen_ven' }, { t: 41.2, bien_the: 'nong_cam', mo: 0.8 }],     // biến thể theo giây
//     may_quay: [{ t: 0, s: 1 }, { t: 6, s: 1.25, tam: 'de_silicon' }],                        // đẩy gần vào một vùng
//   });
//   S.svg  : lớp SVG vẽ cơ chế, toạ độ của ảnh nền (đi theo máy quay)
//   S.html : lớp HTML cùng toạ độ ảnh nền (đi theo máy quay)
//   S.ngoai: lớp HTML không đi theo máy quay (nhãn giữ cỡ chữ); đổi toạ độ bằng S.raManHinh([x, y], t)
//   S.vung('kinh') -> { x1, y1, x2, y2, x, y, w, h, cx, cy }   S.diem('kinh', 0.5, 1) -> [x, y]
//   S.seek(t)      : gọi trong seek(t) của trang, trước khi vẽ lớp cơ chế
// Xuất khung bố cục: KHO.nenAnh.chiKhung(id) vẽ đè khung xám của cảnh lên #stage; KHO.nenAnh.chiKhung(null) gỡ.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  const NA = (K.nenAnh = {});
  NA.phien_ban = '1.0';
  NA.thieu = [];               // đường dẫn ảnh không nạp được
  let PHIEU = null, THU_MUC = 'nen/';
  const ANH = {};              // khoá `${id}__${bien_the}` -> { img, ok, src }

  const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const eio = (p) => { p = cl(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  const NS = 'http://www.w3.org/2000/svg';
  const svgEl = (tag, a, cha) => { const e = document.createElementNS(NS, tag); for (const k in a || {}) if (a[k] != null) e.setAttribute(k, a[k]); if (cha) cha.appendChild(e); return e; };
  const htmlEl = (tag, a, cha) => { const e = document.createElement(tag); for (const k in a || {}) if (a[k] != null) e.setAttribute(k, a[k]); if (cha) cha.appendChild(e); return e; };

  NA.docPhieu = function () {
    const el = document.getElementById('phieu_dat_hinh');
    if (!el) throw new Error('nen_anh: trang chưa nhúng phiếu (#phieu_dat_hinh). Chạy node scripts/khung_bo_cuc.mjs <thư mục dựng> --chi-nhung');
    return JSON.parse(el.textContent);
  };
  NA.phieu = () => PHIEU || (PHIEU = NA.docPhieu());
  NA.layCanh = function (id) {
    const c = NA.phieu().canh.find((x) => x.id === id);
    if (!c) throw new Error(`nen_anh: phiếu không có cảnh '${id}'`);
    return c;
  };
  const kichThuoc = (c) => c.kich_thuoc || NA.phieu().kich_thuoc || [1920, 1080];
  const dsBienThe = (c) => (c.bien_the && c.bien_the.length ? c.bien_the.map((b) => b.ten) : ['']);
  // Đường dẫn ảnh: trường file_dung (bản đã nghiệm thu, ví dụ ..._v2.webp) > file_co_san (dùng lại) > tên chuẩn.
  NA.duongDan = function (c, bt) {
    if (c.file_dung && c.file_dung[bt || '_']) return c.file_dung[bt || '_'];
    if (c.file_co_san) return typeof c.file_co_san === 'string' ? c.file_co_san : c.file_co_san[bt || '_'];
    return THU_MUC + (bt ? `${c.id}__${bt}.webp` : `${c.id}.webp`);
  };

  function napMot(c, bt) {
    const src = NA.duongDan(c, bt);
    const img = new Image();
    const rec = (ANH[`${c.id}__${bt}`] = { img, ok: false, src });
    return new Promise((res) => {
      img.onload = () => { rec.ok = true; res(); };
      img.onerror = () => { NA.thieu.push(src); res(); };
      img.src = src;
    }).then(() => (rec.ok && img.decode ? img.decode().catch(() => {}) : null));
  }
  // Nạp ảnh của mọi cảnh nen_muse (và hinh_thu_nho nếu opt.ca_thu_nho). Không ném lỗi khi thiếu ảnh.
  NA.nap = async function (opt = {}) {
    if (opt.phieu) PHIEU = opt.phieu;
    if (opt.thuMuc != null) THU_MUC = opt.thuMuc;
    const viec = [];
    for (const c of NA.phieu().canh) {
      if (c.loai !== 'nen_muse' && !(opt.ca_thu_nho && c.loai === 'hinh_thu_nho')) continue;
      for (const bt of dsBienThe(c)) viec.push(napMot(c, bt));
    }
    await Promise.all(viec);
    return PHIEU;
  };

  // ---------- vùng neo ----------
  NA.vung = function (id, ten) {
    const c = NA.layCanh(id);
    const v = (c.vung_neo || {})[ten];
    if (!v) throw new Error(`nen_anh: cảnh '${id}' không có vùng neo '${ten}'`);
    const [x1, y1, x2, y2] = v;
    return { x1, y1, x2, y2, x: x1, y: y1, w: x2 - x1, h: y2 - y1, cx: (x1 + x2) / 2, cy: (y1 + y2) / 2 };
  };
  NA.diem = (id, ten, fx = 0.5, fy = 0.5) => { const v = NA.vung(id, ten); return [v.x1 + v.w * fx, v.y1 + v.h * fy]; };

  // ---------- vẽ ảnh lên canvas: phủ kín khung, cắt theo trường cat [x, y, w, h] của nguồn nếu có ----------
  function veAnh(ctx, rec, c, W, H) {
    const img = rec.img;
    let [sx, sy, sw, sh] = c.cat || [0, 0, img.naturalWidth, img.naturalHeight];
    const tl = W / H;
    if (!c.cat) { if (sw / sh > tl) { const w2 = sh * tl; sx += (sw - w2) / 2; sw = w2; } else { const h2 = sw / tl; sy += (sh - h2) / 2; sh = h2; } }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
  }

  // ---------- khung bố cục xám (SVG) ----------
  const XAM = { nen: '#8F979B', luoi: 'rgba(255,255,255,0.18)', o: '#E3E6E8', vien: '#22282B', chu: '#11171A', sach: '#B9C0C3', soc: 'rgba(34,40,43,0.35)' };
  NA.veKhung = function (id, cha) {
    const c = NA.layCanh(id), [W, H] = kichThuoc(c), P = NA.phieu();
    const s = svgEl('svg', { width: 1920, height: 1080, viewBox: `0 0 ${W} ${H}`, class: 'nen-anh-khung', style: 'position:absolute;left:0;top:0;' }, cha);
    const k = W / 1920; // chữ và nét theo khổ 1920
    const defs = svgEl('defs', {}, s);
    const pat = svgEl('pattern', { id: `soc_${id}`, width: 24 * k, height: 24 * k, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    svgEl('rect', { width: 10 * k, height: 24 * k, fill: XAM.soc }, pat);
    svgEl('rect', { x: 0, y: 0, width: W, height: H, fill: XAM.nen }, s);
    // lưới 100 điểm ảnh, số toạ độ ở mép trên và mép trái
    const fs = 16 * k;
    for (let x = 100; x < W; x += 100) {
      svgEl('line', { x1: x, y1: 0, x2: x, y2: H, stroke: XAM.luoi, 'stroke-width': x % 500 ? 1 * k : 2 * k }, s);
      const t = svgEl('text', { x: x + 3 * k, y: fs + 2 * k, 'font-size': fs, fill: '#F4F6F7', 'font-family': 'Arial, sans-serif' }, s); t.textContent = x;
    }
    for (let y = 100; y < H; y += 100) {
      svgEl('line', { x1: 0, y1: y, x2: W, y2: y, stroke: XAM.luoi, 'stroke-width': y % 500 ? 1 * k : 2 * k }, s);
      const t = svgEl('text', { x: 3 * k, y: y - 4 * k, 'font-size': fs, fill: '#F4F6F7', 'font-family': 'Arial, sans-serif' }, s); t.textContent = y;
    }
    // vùng sạch (gạch chéo)
    const sach = Object.assign({}, P.vung_sach || {}, c.vung_sach || {});
    const tenSach = { phu_de: 'vùng phụ đề — để nền trơn', chu_thich: 'cột chú thích — để nền trơn' };
    for (const [ten, r] of Object.entries(sach)) {
      if (!r) continue;
      const [x1, y1, x2, y2] = r;
      svgEl('rect', { x: x1, y: y1, width: x2 - x1, height: y2 - y1, fill: XAM.sach, opacity: 0.55 }, s);
      svgEl('rect', { x: x1, y: y1, width: x2 - x1, height: y2 - y1, fill: `url(#soc_${id})`, stroke: XAM.vien, 'stroke-width': 2 * k, 'stroke-dasharray': `${12 * k} ${8 * k}` }, s);
      const t = svgEl('text', { x: (x1 + x2) / 2, y: (y1 + y2) / 2, 'font-size': 30 * k, 'font-weight': 700, fill: XAM.chu, 'text-anchor': 'middle', 'dominant-baseline': 'middle', 'font-family': K.PHONG || 'Arial, sans-serif' }, s);
      t.textContent = tenSach[ten] || `${ten} — để nền trơn`;
    }
    // vùng neo: ô lớn vẽ trước; ô nằm trọn trong ô khác (vùng con) vẽ viền đứt, nền nhạt hơn
    const nhan = c.ten_vung || {};
    const ds = Object.entries(c.vung_neo || {}).sort((a, b) => (b[1][2] - b[1][0]) * (b[1][3] - b[1][1]) - (a[1][2] - a[1][0]) * (a[1][3] - a[1][1]));
    const trong = (a, b) => a !== b && a[0] >= b[0] && a[1] >= b[1] && a[2] <= b[2] && a[3] <= b[3];
    for (const [, r] of ds) {
      const [x1, y1, x2, y2] = r, con = ds.some(([, b]) => trong(r, b));
      svgEl('rect', { x: x1, y: y1, width: x2 - x1, height: y2 - y1, fill: con ? '#F4F6F7' : XAM.o, 'fill-opacity': con ? 0.55 : 0.82, stroke: XAM.vien, 'stroke-width': 3 * k, 'stroke-dasharray': con ? `${14 * k} ${8 * k}` : null }, s);
    }
    // nhãn: thử bốn góc trong ô, chọn chỗ không chồng nhãn đã đặt; ô cao hẹp thì viết dọc; ô quá mỏng thì đặt nhãn ngay trên/dưới ô
    const daDat = [];
    const chong = (a) => daDat.some((b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3]);
    const rongChu = (str, co) => str.length * co * 0.56;
    for (const [ten, [x1, y1, x2, y2]] of ds) {
      const w = x2 - x1, h = y2 - y1, chu = nhan[ten] ? `${ten} · ${nhan[ten]}` : ten;
      const kieu = { 'font-weight': 700, fill: XAM.chu, 'font-family': K.PHONG || 'Arial, sans-serif' };
      if (h > w * 1.8) { // viết dọc, đọc từ dưới lên
        const co = Math.max(12 * k, Math.min(26 * k, (h - 20 * k) / (chu.length * 0.56), w * 0.5));
        const t = svgEl('text', Object.assign({ x: 0, y: 0, 'font-size': co, transform: `translate(${x1 + w / 2 + co * 0.35},${y2 - 12 * k}) rotate(-90)` }, kieu), s);
        t.textContent = chu; daDat.push([x1, y1, x2, y2]); continue;
      }
      let co = Math.max(12 * k, Math.min(26 * k, h * 0.5, (w - 20 * k) / (chu.length * 0.56)));
      const cao = co * 1.25, rong = rongChu(chu, co);
      const ung = h >= cao + 6 * k
        ? [[x1 + 10 * k, y1 + 4 * k], [x2 - 10 * k - rong, y1 + 4 * k], [x1 + 10 * k, y2 - 4 * k - cao], [x2 - 10 * k - rong, y2 - 4 * k - cao]]
        : [[x1 + 10 * k, y1 - cao - 2 * k], [x1 + 10 * k, y2 + 2 * k], [x2 - 10 * k - rong, y1 - cao - 2 * k], [x2 - 10 * k - rong, y2 + 2 * k]];
      let chon = ung.find(([x, y]) => !chong([x, y, x + rong, y + cao])) || ung[0];
      const ngoai = h < cao + 6 * k;
      if (ngoai) svgEl('rect', { x: chon[0] - 4 * k, y: chon[1], width: rong + 8 * k, height: cao, rx: 4 * k, fill: '#F4F6F7', 'fill-opacity': 0.9 }, s);
      const t = svgEl('text', Object.assign({ x: chon[0], y: chon[1] + cao * 0.78, 'font-size': co }, kieu), s);
      t.textContent = chu; daDat.push([chon[0], chon[1], chon[0] + rong, chon[1] + cao]);
    }
    // toạ độ ở góc dưới phải mỗi ô, bỏ khi chồng nhãn
    for (const [, [x1, y1, x2, y2]] of ds) {
      const co = 14 * k, str = `${x1},${y1} → ${x2},${y2}`, r = rongChu(str, co) * 0.9;
      const hop = [x2 - 6 * k - r, y2 - co * 1.4, x2 - 6 * k, y2 - 2 * k];
      if (y2 - y1 < 40 * k || chong(hop)) continue;
      const t = svgEl('text', { x: x2 - 6 * k, y: y2 - 6 * k, 'font-size': co, fill: '#40494D', 'text-anchor': 'end', 'font-family': 'Arial, sans-serif' }, s);
      t.textContent = str; daDat.push(hop);
    }
    const tieuDe = svgEl('text', { x: W - 16 * k, y: 36 * k, 'font-size': 22 * k, 'font-weight': 700, fill: '#F4F6F7', 'text-anchor': 'end', 'font-family': K.PHONG || 'Arial, sans-serif' }, s);
    tieuDe.textContent = `${P.ma_video} · ${id} · khung bố cục ${W}×${H} · ô xám = vị trí bắt buộc của từng phần`;
    return s;
  };
  NA.dsCanhCanKhung = () => NA.phieu().canh.filter((c) => (c.loai === 'nen_muse' || c.loai === 'hinh_thu_nho' || c.loai === 'clip_muse') && c.trang_thai !== 'khong_can_muse' && Object.keys(c.vung_neo || {}).length + Object.keys(c.vung_sach || {}).length + Object.keys(NA.phieu().vung_sach || {}).length > 0).map((c) => c.id);
  // Vẽ đè khung bố cục của một cảnh lên toàn sân khấu (để chụp); null thì gỡ.
  NA.chiKhung = function (id) {
    const stage = document.getElementById('stage') || document.body;
    let lop = document.getElementById('nen-anh-chi-khung');
    if (lop) lop.remove();
    if (id == null) return;
    lop = htmlEl('div', { id: 'nen-anh-chi-khung', style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;z-index:9999;background:#8F979B;' }, stage);
    NA.veKhung(id, lop);
  };

  // ---------- một cảnh có ảnh nền ----------
  // opt.lich: [{ t, bien_the, mo }] — từ giây t chuyển sang biến thể, hoà trong mo giây (mặc định 0,6).
  // opt.may_quay: [{ t, s, tam }] — mốc máy quay; s là độ phóng (>= 1), tam là tên vùng neo hoặc [x, y] đưa dần về giữa khung.
  NA.canh = function (id, cha, opt = {}) {
    const c = NA.layCanh(id);
    const [W, H] = kichThuoc(c);
    const goc = htmlEl('div', { class: 'nen-anh', 'data-nen-canh': id, style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;overflow:hidden;' }, cha);
    const cam = htmlEl('div', { class: 'nen-anh-may', style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;will-change:transform;' }, goc);
    const bts = dsBienThe(c);
    const lop = {};
    let coThieu = false;
    for (const bt of bts) {
      const rec = ANH[`${id}__${bt}`];
      const cv = htmlEl('canvas', { width: W, height: H, 'data-bien-the': bt, style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;opacity:0;' }, cam);
      if (rec && rec.ok) veAnh(cv.getContext('2d'), rec, c, W, H); else coThieu = true;
      lop[bt] = cv;
    }
    if (coThieu) { // đường lui: thiếu ảnh thì hiện khung xám dưới cùng để vẫn dựng, kiểm được lớp cơ chế
      const k = htmlEl('div', { class: 'nen-anh-thieu', style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, cam);
      cam.insertBefore(k, cam.firstChild);
      NA.veKhung(id, k);
    }
    const svg = svgEl('svg', { class: 'nen-anh-co-che', width: 1920, height: 1080, viewBox: `0 0 ${W} ${H}`, style: 'position:absolute;left:0;top:0;overflow:visible;' }, cam);
    const html = htmlEl('div', { class: 'nen-anh-html', style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, cam);
    const ngoai = htmlEl('div', { class: 'nen-anh-ngoai', style: 'position:absolute;left:0;top:0;width:1920px;height:1080px;' }, goc);
    const lich = (opt.lich && opt.lich.length ? opt.lich : [{ t: 0, bien_the: bts[0] }]).slice().sort((a, b) => a.t - b.t);
    const mq = (opt.may_quay || []).slice().sort((a, b) => a.t - b.t);
    const kx = 1920 / W;
    const tamCua = (m) => (m.tam == null ? [W / 2, H / 2] : Array.isArray(m.tam) ? m.tam : (() => { const v = NA.vung(id, m.tam); return [v.cx, v.cy]; })());

    // trạng thái máy quay tại t: { s, px, py } — điểm (px, py) của ảnh nằm giữa khung, phóng s lần
    function mayQuay(t) {
      if (!mq.length) return { s: 1, px: W / 2, py: H / 2 };
      let a = mq[0], b = mq[0];
      for (let i = 0; i < mq.length; i++) { if (mq[i].t <= t) { a = mq[i]; b = mq[i + 1] || mq[i]; } }
      if (t < mq[0].t) { a = b = mq[0]; }
      const p = b === a ? 1 : eio((t - a.t) / (b.t - a.t));
      const ta = tamCua(a), tb = tamCua(b);
      const s = Math.max(1, (a.s || 1) + ((b.s || 1) - (a.s || 1)) * p);
      let px = ta[0] + (tb[0] - ta[0]) * p, py = ta[1] + (tb[1] - ta[1]) * p;
      const hw = W / (2 * s), hh = H / (2 * s); // giữ ảnh phủ kín khung
      px = cl(px, hw, W - hw); py = cl(py, hh, H - hh);
      return { s, px, py };
    }
    const S = {
      el: goc, svg, html, ngoai, canh: c,
      vung: (ten) => NA.vung(id, ten),
      diem: (ten, fx, fy) => NA.diem(id, ten, fx, fy),
      // toạ độ ảnh -> toạ độ màn hình 1920×1080 tại giây t
      raManHinh([x, y], t) { const m = mayQuay(t); return [(960 + (x - m.px) * m.s * kx), (540 + (y - m.py) * m.s * kx)]; },
      bienTheTai(t) { let cur = lich[0]; for (const l of lich) if (l.t <= t) cur = l; return cur.bien_the; },
      seek(t) {
        // độ đục từng biến thể: lớp sau hoà lên lớp trước
        const op = {}; for (const bt of bts) op[bt] = 0;
        op[lich[0].bien_the] = 1;
        for (let i = 1; i < lich.length; i++) {
          const l = lich[i], p = cl((t - l.t) / (l.mo != null ? l.mo : 0.6));
          if (p <= 0) break;
          for (const bt of bts) op[bt] *= 1 - p;
          op[l.bien_the] = (op[l.bien_the] || 0) + p;
        }
        for (const bt of bts) lop[bt].style.opacity = String(Math.round(op[bt] * 1000) / 1000);
        const m = mayQuay(t), sc = m.s;
        const tx = 960 - m.px * sc * kx, ty = 540 - m.py * sc * kx;
        cam.style.transform = `translate(${tx.toFixed(2)}px,${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`;
      },
    };
    return S;
  };
})();
