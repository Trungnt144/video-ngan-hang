// N303: đo tương phản chữ trên hình tại các giây chọn (cách đo: lấy hộp và màu từng đoạn chữ đang hiện, ẩn mọi chữ rồi chụp,
// lấy màu nền trung vị trong hộp, tính tỉ lệ tương phản WCAG; chữ nửa trong suốt được trộn với nền trước khi tính).
// Dùng: node n303_tuong_phan.mjs <giây> [giây ...]   hoặc   node n303_tuong_phan.mjs --moi 2   (mỗi 2 giây cả video)
// In các chữ có tỉ lệ dưới 4,5 và tỉ lệ thấp nhất mỗi giây; mã thoát 0.
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const GOC = path.dirname(fileURLToPath(import.meta.url));
const a = process.argv.slice(2);
let giay = [];
const tg = JSON.parse(fs.readFileSync(path.join(GOC, 'thoi_gian.json'), 'utf8'));
if (a[0] === '--moi') { const b = parseFloat(a[1] || '2'); for (let t = 0.5; t < tg.thoi_luong_giay; t += b) giay.push(+t.toFixed(2)); } else giay = a.map(parseFloat);
const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(pathToFileURL(path.join(GOC, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
await page.evaluate(() => document.fonts.ready);
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
    let mau = el instanceof SVGElement ? cs.fill : cs.color;
    out.push({ chu: chu.slice(0, 30), x: r.left, y: r.top, w: r.width, h: r.height, mau, m, co: parseFloat(cs.fontSize) });
  }
  return out;
}, t);
const anFor = () => page.addStyleTag({ content: '* { color: transparent !important; -webkit-text-fill-color: transparent !important; } text, tspan { fill: transparent !important; }' });
await anFor();
// tạm thời hiện lại chữ để lấy hộp: ta lấy hộp trước rồi bật kiểu ẩn bằng lớp riêng
await page.evaluate(() => { const st = document.head.querySelector('style:last-of-type'); st.id = 'an_chu'; st.disabled = true; });
const so = (x) => { const v = x / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const L = (c) => 0.2126 * so(c[0]) + 0.7152 * so(c[1]) + 0.0722 * so(c[2]);
let tong = 0, thap = [];
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
  let min = 99, minChu = '';
  ds.forEach((d, i) => {
    const m = d.mau.match(/[\d.]+/g).map(Number); let al = m.length > 3 ? m[3] : 1; if (m.length > 3 && m[3] === 0) return;
    if (d.m < 0.98) return;
    const bg = px[i], aa = al * Math.min(1, d.m);
    const fg = [0, 1, 2].map((k) => m[k] * aa + bg[k] * (1 - aa));
    const l1 = L(fg), l2 = L(bg), cr = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    if (cr < min) { min = cr; minChu = d.chu; }
    if (cr < 4.5) thap.push({ t, chu: d.chu, cr: +cr.toFixed(2), co: d.co, mau: d.mau, nen: bg.join(',') });
  });
  tong++;
  if (a[0] !== '--moi') console.log(`t=${t} thấp nhất ${min.toFixed(2)} (${minChu})`);
}
for (const x of thap) console.log('DƯỚI 4,5:', JSON.stringify(x));
console.log(`xong ${tong} giây, ${thap.length} chữ dưới 4,5`);
await browser.close();
