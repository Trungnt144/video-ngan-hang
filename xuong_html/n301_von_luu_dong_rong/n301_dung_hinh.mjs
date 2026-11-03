// N199: đo đứng hình trên ảnh tĩnh thay cho kết xuất video (lời giao cấm kết xuất). Chụp vùng 1920x860 (bỏ dải phụ đề) mỗi 0,1 giây,
// ghi JPEG vào thư mục --ra, rồi n199_dung_hinh.py so từng cặp khung liên tiếp theo cách của freezedetect (n = -60 dB).
// Dùng: node n199_dung_hinh.mjs --ra <thư mục> [--tu 0] [--den <giây>]
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const a = process.argv.slice(2);
let GOC = path.dirname(fileURLToPath(import.meta.url));
if (a.includes('--goc')) GOC = path.resolve(a[a.indexOf('--goc') + 1]);
let ra = path.join(GOC, 'n199_dung_hinh'), tu = 0, den = null;
for (let i = 0; i < a.length; i++) { if (a[i] === '--ra') ra = path.resolve(a[++i]); else if (a[i] === '--tu') tu = parseFloat(a[++i]); else if (a[i] === '--den') den = parseFloat(a[++i]); else if (a[i] === '--goc') i++; }
fs.mkdirSync(ra, { recursive: true });
const tg = JSON.parse(fs.readFileSync(path.join(GOC, 'thoi_gian.json'), 'utf8'));
if (den == null) den = tg.thoi_luong_giay;
const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(pathToFileURL(path.join(GOC, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
let n = 0;
for (let i = Math.round(tu * 10); i <= Math.round(den * 10); i++) {
  await page.evaluate((t) => window.seek(t), i / 10);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: 1920, height: 860 } });
  fs.writeFileSync(path.join(ra, `k${String(i).padStart(5, '0')}.jpg`), buf); n++;
}
await browser.close();
console.log(`đã chụp ${n} khung vào ${ra}`);
