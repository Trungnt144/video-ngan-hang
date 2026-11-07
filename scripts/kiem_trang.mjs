// kiem_trang.mjs — máy kiểm trang dựng HTML (LM-03) dùng chung, lập 04/11/2026 (thử cách làm ba chặng, Trung chốt 04/11/2026).
// Gộp các script mỗi video từng chép riêng (bản gốc n204_*.mjs; bốn script đo giống hệt nhau ở N201–N205): đọc trang
// bằng Chromium qua window.seek(t), không kết xuất video.
//
//   node scripts/kiem_trang.mjs <lệnh> <thư mục dựng> [tuỳ chọn] [--trang trang.html] [--ra-json <file>]
//   quet_kiem                     window.kiemTra(t) mỗi 0,5 giây cả video, gộp lỗi theo nội dung, đếm pageerror
//   do_tu                         đếm tiếng chữ trên hình (window.demTu) mỗi 0,25 giây; báo khung quá 12 tiếng
//   do_hien [--toi-thieu 1.0]     đoạn chữ hiện rõ (độ đục ≥ 0,95) dưới 1 giây
//   tuong_phan [--moi 2 | giây…]  tương phản WCAG chữ với nền trung vị trong hộp chữ; báo dưới 4,5
//   uoc_dung [--tu a --den b] [--nguong 0.6]  lệch sáng trung bình khung t với t + 1,5 giây (thu nhỏ 480×220, bỏ dải
//                                 phụ đề y ≥ 880); dưới ngưỡng là gần đứng yên 1,5 giây
//   anh_tinh (--moi-cau | --moi-chuong | --dau-chuong | giây…) [--ra <thư mục>] [--tien-to <mã>] [--tam 12]   chụp ảnh tĩnh
//                                 1920×1080 PNG (mỗi câu 0,3 giây trước khi hết câu; mỗi chương giữa chương và 0,8 giây trước khi
//                                 hết; đầu chương: giây đầu + 0,6, chỗ chữ lớn mở chương); mặc định ghi vào out/anh_tinh/
//                                 (ảnh trong thư mục dựng ngoài out/ làm đổi dấu vân tay mã của pha máy);
//                                 --tam ghép thêm tấm xem nhanh <mã>_tam_NN.jpg, 12 ảnh mỗi tấm, có nhãn tên ảnh và giây
// Chạy qua hàng đợi chỗ nhanh: scripts/hang_doi_ket_xuat.sh --nhanh <mã> node scripts/kiem_trang.mjs do_tu <thư mục dựng>
// Trang phải theo hợp đồng của skill dung-video-html (window.seek, window.__san_sang, #stage, #thoi_gian) và khuôn kiểm
// của loạt ngân hàng (window.kiemTra, window.demTu, lớp .kho-phu-de, [data-kho-kenh], .kho-nhan-gia-dinh).
// Mã thoát 0 khi chạy xong (kể cả có lỗi bố cục); kết quả máy đọc ghi vào --ra-json.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import(pathToFileURL(path.join(GOC, 'xuong_html/cong_cu/node_modules/playwright-core/index.mjs')).href);

const [lenh, duAnVao, ...con] = process.argv.slice(2);
if (!lenh || !duAnVao) { console.log('Dùng: node scripts/kiem_trang.mjs <quet_kiem|do_tu|do_hien|tuong_phan|uoc_dung|anh_tinh> <thư mục dựng> [tuỳ chọn]'); process.exit(2); }
const DU_AN = path.resolve(duAnVao);
const ts = { _: [] };
for (let i = 0; i < con.length; i++) {
  if (con[i].startsWith('--')) { const k = con[i].slice(2); const v = con[i + 1]; if (v === undefined || v.startsWith('--')) ts[k] = true; else { ts[k] = v; i++; } }
  else ts._.push(con[i]);
}
const TRANG = path.join(DU_AN, ts.trang || 'trang.html');
const ARGS = ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'];

const browser = await chromium.launch({ headless: true, args: ARGS });
let nLoiTrang = 0;
async function moTrang() {
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
  page.on('pageerror', (e) => { nLoiTrang++; console.log('pageerror:', e.message); });
  await page.goto(pathToFileURL(TRANG).href + '?t=0', { waitUntil: 'load' });
  for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
  await page.evaluate(() => document.fonts.ready);
  return page;
}
const thoiLuong = (page) => page.evaluate(() => JSON.parse(document.getElementById('thoi_gian').textContent).thoi_luong_giay);

async function quetKiem() {
  const page = await moTrang();
  const co = await page.evaluate(() => typeof window.kiemTra === 'function');
  if (!co) return { so_loi: -1, dong: ['trang không có window.kiemTra'] };
  const gop = await page.evaluate(() => {
    const g = {}; const D = JSON.parse(document.getElementById('thoi_gian').textContent).thoi_luong_giay;
    for (let t = 0; t <= D; t += 0.5) for (const l of window.kiemTra(t)) { const k = JSON.stringify(l); (g[k] = g[k] || []).push(+t.toFixed(1)); }
    return g;
  });
  const ds = Object.entries(gop).map(([k, t]) => ({ loi: k, so_lan: t.length, tu: t[0], den: t[t.length - 1] }));
  return { so_loi: ds.length, loi_trang: nLoiTrang, chi_tiet: ds, dong: ds.map((x) => `${x.so_lan} lần, giây ${x.tu}–${x.den}: ${x.loi.slice(0, 160)}`) };
}

async function doTu() {
  const page = await moTrang();
  if (!(await page.evaluate(() => typeof window.demTu === 'function'))) return { so_loi: -1, dong: ['trang không có window.demTu'] };
  const kq = await page.evaluate(() => {
    const D = JSON.parse(document.getElementById('thoi_gian').textContent).thoi_luong_giay, ds = [];
    for (let t = 0; t <= D; t += 0.25) { const r = window.demTu(t); ds.push({ t: +t.toFixed(2), so: r.so, chu: r.chu.join(' | ') }); }
    return ds;
  });
  const qua = kq.filter((x) => x.so > 12);
  // gộp các khung quá 12 tiếng liền nhau thành đoạn
  const doan = [];
  for (const x of qua) { const d = doan[doan.length - 1]; if (d && x.t - d.den <= 0.26) { d.den = x.t; d.so = Math.max(d.so, x.so); } else doan.push({ tu: x.t, den: x.t, so: x.so, chu: x.chu.slice(0, 120) }); }
  const nhieu = kq.slice().sort((a, b) => b.so - a.so)[0];
  return { so_loi: doan.length, nhieu_nhat: nhieu?.so, chi_tiet: doan, dong: doan.map((d) => `giây ${d.tu}–${d.den}: ${d.so} tiếng: ${d.chu}`) };
}

async function doHien() {
  const toiThieu = parseFloat(ts['toi-thieu'] || '1.0');
  const page = await moTrang();
  const kq = await page.evaluate(() => {
    const stage = document.getElementById('stage');
    const D = JSON.parse(document.getElementById('thoi_gian').textContent).thoi_luong_giay;
    const doMo = (el) => { let m = 1; for (let e = el; e && e !== stage.parentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') return 0; m *= parseFloat(s.opacity || 1); if (e instanceof SVGElement && e.getAttribute('opacity') != null) m *= parseFloat(e.getAttribute('opacity')); } return m; };
    const els = new Map();
    const w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    let n; while ((n = w.nextNode())) { const el = n.parentElement, c = n.textContent.trim(); if (!c || !/[\p{L}\p{N}]/u.test(c) || el.closest('.kho-phu-de') || el.closest('[data-kho-kenh]') || el.closest('.kho-nhan-gia-dinh') || el.classList.contains('dem')) continue; els.set(el, { chu: c.slice(0, 40), run: 0, best: 0, t0: null, bestT: 0, vis: 0 }); }
    for (let i = 0; i <= Math.round(D * 10); i++) {
      const t = i / 10; window.seek(t);
      for (const [el, r] of els) {
        const m = doMo(el);
        if (m >= 0.95) { if (r.run === 0) r.t0 = t; r.run += 0.1; if (r.run > r.best) { r.best = r.run; r.bestT = r.t0; } } else r.run = 0;
        r.vis += m > 0.05 ? 0.1 : 0;
      }
    }
    return Array.from(els.values()).map((r) => ({ chu: r.chu, best: +r.best.toFixed(1), bestT: +r.bestT.toFixed(1), vis: +r.vis.toFixed(1) }));
  });
  const ngan = kq.filter((r) => r.vis > 0 && r.best < toiThieu);
  return { so_loi: ngan.length, so_doan_chu: kq.length, chi_tiet: ngan, dong: ngan.map((r) => `hiện rõ tối đa ${r.best} giây (từ ${r.bestT}), có mặt ${r.vis}: ${r.chu}`) };
}

async function tuongPhan() {
  const page = await moTrang();
  const D = await thoiLuong(page);
  let giay = ts._.map(parseFloat);
  if (!giay.length || ts.moi) { const b = parseFloat(ts.moi === true || !ts.moi ? '2' : ts.moi); giay = []; for (let t = 0.5; t < D; t += b) giay.push(+t.toFixed(2)); }
  const lop = (t) => page.evaluate((t) => {
    window.seek(t);
    const stage = document.getElementById('stage');
    const doMo = (el) => { let m = 1; for (let e = el; e && e !== stage.parentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') return 0; m *= parseFloat(s.opacity || 1); if (e instanceof SVGElement && e.getAttribute('opacity') != null) m *= parseFloat(e.getAttribute('opacity')); } return m; };
    const out = [], w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
      const chu = n.textContent.trim(), el = n.parentElement;
      if (!chu || !el || !/[\p{L}\p{N}]/u.test(chu)) continue;
      const m = doMo(el); if (m < 0.2) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      const r = rg.getBoundingClientRect(); if (r.width < 2) continue;
      const cs = getComputedStyle(el);
      out.push({ chu: chu.slice(0, 30), x: r.left, y: r.top, w: r.width, h: r.height, mau: el instanceof SVGElement ? cs.fill : cs.color, m, co: parseFloat(cs.fontSize) });
    }
    return out;
  }, t);
  await page.addStyleTag({ content: '* { color: transparent !important; -webkit-text-fill-color: transparent !important; } text, tspan { fill: transparent !important; }' });
  await page.evaluate(() => { const st = document.head.querySelector('style:last-of-type'); st.id = 'an_chu'; st.disabled = true; });
  const so = (x) => { const v = x / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = (c) => 0.2126 * so(c[0]) + 0.7152 * so(c[1]) + 0.0722 * so(c[2]);
  const thap = []; let minAll = 99;
  for (const t of giay) {
    await page.evaluate(() => { document.getElementById('an_chu').disabled = true; });
    const ds = await lop(t);
    await page.evaluate(() => { document.getElementById('an_chu').disabled = false; });
    const png = await page.screenshot({ type: 'png' });
    const px = await page.evaluate(async ({ b64, ds }) => {
      const im = await createImageBitmap(await (await fetch('data:image/png;base64,' + b64)).blob());
      const cv = document.createElement('canvas'); cv.width = 1920; cv.height = 1080; const cx = cv.getContext('2d'); cx.drawImage(im, 0, 0);
      return ds.map((d) => {
        const x = Math.max(0, Math.floor(d.x)), y = Math.max(0, Math.floor(d.y)), w = Math.max(1, Math.min(1920 - x, Math.ceil(d.w))), h = Math.max(1, Math.min(1080 - y, Math.ceil(d.h)));
        const dt = cx.getImageData(x, y, w, h).data, r = [], g = [], b = [];
        for (let i = 0; i < dt.length; i += 4) { r.push(dt[i]); g.push(dt[i + 1]); b.push(dt[i + 2]); }
        const md = (v) => { v.sort((p, q) => p - q); return v[v.length >> 1]; };
        return [md(r), md(g), md(b)];
      });
    }, { b64: png.toString('base64'), ds });
    ds.forEach((d, i) => {
      const m = d.mau.match(/[\d.]+/g).map(Number); const al = m.length > 3 ? m[3] : 1; if (m.length > 3 && m[3] === 0) return;
      if (d.m < 0.98) return;
      const bg = px[i], aa = al * Math.min(1, d.m);
      const fg = [0, 1, 2].map((k) => m[k] * aa + bg[k] * (1 - aa));
      const l1 = L(fg), l2 = L(bg), cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      if (cr < minAll) minAll = cr;
      if (cr < 4.5) thap.push({ t, chu: d.chu, cr: +cr.toFixed(2), co: d.co, mau: d.mau, nen: bg.join(',') });
    });
  }
  return { so_loi: thap.length, so_giay: giay.length, thap_nhat: +minAll.toFixed(2), chi_tiet: thap, dong: thap.map((x) => `giây ${x.t}: ${x.cr}:1 "${x.chu}" (chữ ${x.mau}, nền ${x.nen})`) };
}

async function uocDung() {
  const NG = parseFloat(ts.nguong || '0.6');
  const p = await moTrang();
  const D = await thoiLuong(p);
  const a = parseFloat(ts.tu ?? '0'), b = Math.min(parseFloat(ts.den ?? String(D)), D - 1.5);
  const q = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  await q.setContent('<canvas id="c" width="480" height="220"></canvas>');
  await q.evaluate(() => { window.F = {}; window.cx = document.getElementById('c').getContext('2d', { willReadFrequently: true }); });
  const tt = []; for (let t = a; t <= b + 1.5 + 1e-6; t += 0.5) tt.push(+t.toFixed(2));
  for (const t of tt) {
    await p.evaluate((t) => window.seek(t), t); await p.waitForTimeout(30);
    const buf = await p.screenshot({ type: 'jpeg', quality: 60, clip: { x: 0, y: 0, width: 1920, height: 880 } });
    await q.evaluate(async ([t, b64]) => {
      const img = new Image(); img.src = 'data:image/jpeg;base64,' + b64; await img.decode();
      cx.drawImage(img, 0, 0, 480, 220); const d = cx.getImageData(0, 0, 480, 220).data; const L = new Float32Array(480 * 220);
      for (let i = 0; i < L.length; i++) L[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
      F[t] = L; const cu = +(t - 2).toFixed(2); delete F[cu]; // chỉ giữ 4 khung gần nhất
      if (F[+(t - 1.5).toFixed(2)]) { const A = F[+(t - 1.5).toFixed(2)]; let s = 0; for (let i = 0; i < A.length; i++) s += Math.abs(A[i] - L[i]); (window.KQ = window.KQ || []).push([+(t - 1.5).toFixed(2), s / A.length]); }
    }, [t, buf.toString('base64')]);
  }
  const kq = (await q.evaluate(() => window.KQ || [])).filter(([t]) => t >= a - 1e-6 && t <= b + 1e-6);
  const thap = kq.filter(([, d]) => d < NG);
  const nho = kq.length ? Math.min(...kq.map((x) => x[1])) : null;
  return { so_loi: thap.length, so_cap: kq.length, tu: a, den: b, nho_nhat: nho == null ? null : +nho.toFixed(2), chi_tiet: thap.map(([t, d]) => ({ t, lech: +d.toFixed(2) })),
    dong: thap.map(([t, d]) => `đứng gần yên ${t} → ${(t + 1.5).toFixed(1)}, lệch ${d.toFixed(2)}`) };
}

async function anhTinh() {
  const tg = JSON.parse(fs.readFileSync(path.join(DU_AN, 'thoi_gian.json'), 'utf8'));
  // --ra tương đối tính từ thư mục dựng
  const ra = path.resolve(DU_AN, ts.ra || 'out/anh_tinh'), tienTo = ts['tien-to'] || path.basename(DU_AN).split('_')[0];
  const moc = [];
  const s2 = (x) => String(x).padStart(2, '0');
  if (ts['moi-chuong']) for (const c of tg.chuong) { moc.push({ t: +((c.t + c.den) / 2).toFixed(2), nhan: `c${s2(c.id)}a` }); moc.push({ t: +(c.den - 0.8).toFixed(2), nhan: `c${s2(c.id)}b` }); }
  if (ts['moi-cau']) for (const c of tg.chuong) c.cau.forEach((x, i) => moc.push({ t: +(x.den - 0.3).toFixed(2), nhan: `c${s2(c.id)}_${s2(i + 1)}` }));
  // giây đầu chương + 0,6: chữ lớn mở chương chỉ hiện ở đây (lỗi mất dấu N202 lọt vì ảnh tĩnh chỉ lấy cuối câu)
  if (ts['dau-chuong']) for (const c of tg.chuong) moc.push({ t: +(c.t + 0.6).toFixed(2), nhan: `c${s2(c.id)}_00` });
  moc.sort((p, q) => p.t - q.t);
  for (const t of ts._.map(parseFloat)) moc.push({ t, nhan: 't' + t.toFixed(2).padStart(7, '0') });
  fs.mkdirSync(ra, { recursive: true });
  const page = await moTrang();
  page.on('console', (m) => { if (m.type() === 'error') console.log('console.error:', m.text()); });
  const ds = [];
  for (const m of moc) {
    await page.evaluate((t) => window.seek(t), m.t); await page.waitForTimeout(60);
    const f = path.join(ra, `${tienTo}_${m.nhan}.png`);
    await page.screenshot({ path: f });
    const kiem = await page.evaluate((t) => (typeof window.kiemTra === 'function' ? window.kiemTra(t) : null), m.t);
    ds.push({ ...m, file: path.basename(f), kiem });
  }
  fs.writeFileSync(path.join(ra, `${tienTo}_danh_sach.json`), JSON.stringify(ds, null, 1));
  const tam = [];
  if (ts.tam) {
    // Tấm xem nhanh: 3 cột ô 640×360, nhãn tên ảnh và giây; tác tử mở một tấm thay vì 12 ảnh (bản chung của n204_tam.py)
    const n = ts.tam === true ? 12 : parseInt(ts.tam, 10);
    const q = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
    for (let k = 0; k < ds.length; k += n) {
      const nhom = ds.slice(k, k + n).map((x) => ({ nhan: `${x.nhan} · ${x.t}s`, b64: fs.readFileSync(path.join(ra, x.file)).toString('base64') }));
      const jpg = await q.evaluate(async (nhom) => {
        const hang = Math.ceil(nhom.length / 3), cv = document.createElement('canvas'); cv.width = 1920; cv.height = hang * 384;
        const cx = cv.getContext('2d'); cx.fillStyle = '#282828'; cx.fillRect(0, 0, cv.width, cv.height);
        for (let i = 0; i < nhom.length; i++) {
          const im = new Image(); im.src = 'data:image/png;base64,' + nhom[i].b64; await im.decode();
          const x = (i % 3) * 640, y = Math.floor(i / 3) * 384;
          cx.drawImage(im, x, y + 24, 640, 360); cx.fillStyle = '#ffeb3b'; cx.font = '18px sans-serif'; cx.fillText(nhom[i].nhan, x + 6, y + 18);
        }
        return cv.toDataURL('image/jpeg', 0.85).split(',')[1];
      }, nhom);
      const f = path.join(ra, `${tienTo}_tam_${String(k / n + 1).padStart(2, '0')}.jpg`);
      fs.writeFileSync(f, Buffer.from(jpg, 'base64')); tam.push(f);
    }
  }
  const coLoi = ds.filter((x) => x.kiem && (Array.isArray(x.kiem) ? x.kiem.length : Object.keys(x.kiem).length));
  return { so_loi: coLoi.length, so_anh: ds.length, thu_muc: ra, tam, dong: [`đã chụp ${ds.length} ảnh vào ${ra}` + (tam.length ? `, ${tam.length} tấm xem nhanh ${path.basename(tam[0])}…` : ''), ...coLoi.map((x) => `${x.nhan} ${x.t} kiemTra: ${JSON.stringify(x.kiem).slice(0, 160)}`)] };
}

const BANG = { quet_kiem: quetKiem, do_tu: doTu, do_hien: doHien, tuong_phan: tuongPhan, uoc_dung: uocDung, anh_tinh: anhTinh };
if (!BANG[lenh]) { console.log(`Lệnh không có: ${lenh}`); await browser.close(); process.exit(2); }
const t0 = Date.now();
let kq;
try { kq = await BANG[lenh](); } finally { await browser.close(); }
kq = { lenh, du_an: path.relative(GOC, DU_AN), giay_chay: Math.round((Date.now() - t0) / 100) / 10, loi_trang: nLoiTrang, ...kq };
for (const d of kq.dong || []) console.log(d);
console.log(`xong ${lenh}: ${kq.so_loi} lỗi, ${nLoiTrang} pageerror, ${kq.giay_chay} giây`);
if (ts['ra-json']) { fs.mkdirSync(path.dirname(path.resolve(ts['ra-json'])), { recursive: true }); fs.writeFileSync(path.resolve(ts['ra-json']), JSON.stringify(kq, null, 1)); }
