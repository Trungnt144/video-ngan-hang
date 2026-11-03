// N199: đếm tiếng chữ trên hình (không tính phụ đề, nhãn giả định, màn hình kết) mỗi 0,25 giây; in 12 khung nhiều chữ nhất và số khung có chữ mờ.
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const GOC = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(pathToFileURL(path.join(GOC, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
const kq = await page.evaluate(() => {
  const D = JSON.parse(document.getElementById('thoi_gian').textContent).thoi_luong_giay, ds = [];
  for (let t = 0; t <= D; t += 0.25) { const r = window.demTu(t); ds.push({ t: +t.toFixed(2), so: r.so, chu: r.chu.join(' | ') }); }
  return ds;
});
kq.sort((a, b) => b.so - a.so);
for (const x of kq.slice(0, 12)) console.log(x.t, x.so, x.chu.slice(0, 150));
console.log('khung có > 12 tiếng:', kq.filter((x) => x.so > 12).map((x) => x.t).join(','));
await browser.close();
