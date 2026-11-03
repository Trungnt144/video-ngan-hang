// N302: quét window.kiemTra(t) mỗi 0,5 giây trên cả video, in lỗi gộp theo nội dung và mọi pageerror.
// Chạy qua hàng đợi: scripts/hang_doi_ket_xuat.sh --nhanh n302 node xuong_html/n302_hoat_dong_huy_dong_von/n302_quet_kiem.mjs
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const GOC = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
let nLoi = 0;
page.on('pageerror', (e) => { nLoi++; console.log('pageerror:', e.message); });
await page.goto(pathToFileURL(path.join(GOC, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
const kq = await page.evaluate(() => {
  const gop = {}; const D = JSON.parse(document.getElementById('thoi_gian').textContent).thoi_luong_giay;
  for (let t = 0; t <= D; t += 0.5) {
    for (const l of window.kiemTra(t)) { const k = JSON.stringify(l); (gop[k] = gop[k] || []).push(+t.toFixed(1)); }
  }
  return gop;
});
const ds = Object.entries(kq);
for (const [k, ts] of ds) console.log(`${ts.length} lần, giây ${ts[0]}–${ts[ts.length - 1]}: ${k}`);
console.log(`xong: ${ds.length} loại lỗi kiemTra, ${nLoi} pageerror`);
await browser.close();
