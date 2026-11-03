// Chụp từng <section class="tn"> trong trang mẫu thành PNG 1920×1080 (hệ số 1,5 trên khung 1280×720).
// Cách chạy (playwright-core lấy từ xuong_html/cong_cu/node_modules):
//   node chup.mjs <trang.html> <thư mục ra>
// Bản tải lên JPG dưới 2 MB do bước ffmpeg sau đó làm (xem nguon_goc.md của thư mục mẫu).
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { chromium } = createRequire(new URL('../cong_cu/package.json', import.meta.url))('playwright-core');

const [trang, thuMucRa] = process.argv.slice(2);
if (!trang || !thuMucRa) { console.error('Cần: <trang.html> <thư mục ra>'); process.exit(1); }
fs.mkdirSync(thuMucRa, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--allow-file-access-from-files'] });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1.5 });
await page.goto(pathToFileURL(path.resolve(trang)).href);
await page.evaluate(() => document.fonts.ready);
await page.waitForLoadState('networkidle');
// trang v2 trở đi tự đo màu ảnh để chọn màu chữ; chờ xong (trang v1 không có bước này)
if (await page.$('script')) {
  await page.waitForFunction(() => !document.querySelector('section.tn[data-vung]') || document.body.dataset.xong, null, { timeout: 30000 });
  const xong = await page.evaluate(() => document.body.dataset.xong);
  if (xong && xong !== '1') throw new Error(xong);
}

const ids = await page.$$eval('section.tn', (ds) => ds.map((d) => d.id));
for (const id of ids) {
  const ra = path.join(thuMucRa, `${id}.png`);
  await page.locator(`#${id}`).screenshot({ path: ra });
  const mau = await page.$eval(`#${id}`, (d) => d.dataset.mau ? `${d.dataset.mau} (sắc độ/bão hoà ${d.dataset.sac})` : '');
  console.log(ra, mau);
}
await browser.close();
