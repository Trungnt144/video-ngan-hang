// N199: in chữ đang hiện, số tiếng và kiemTra ở các giây chọn (soát nhanh). Dùng: node n199_tham.mjs 12.5 40
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const GOC = path.dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('console.error:', m.text()); });
await page.goto(pathToFileURL(path.join(GOC, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
for (const a of process.argv.slice(2)) {
  const t = parseFloat(a);
  const r = await page.evaluate((t) => ({ chu: window.chuHienThi(t), dem: window.demTu(t).so, loi: window.kiemTra(t) }), t);
  console.log(t, '| tiếng', r.dem, '|', r.chu.join(' | '), r.loi.length ? '| LỖI ' + JSON.stringify(r.loi) : '');
}
await browser.close();
