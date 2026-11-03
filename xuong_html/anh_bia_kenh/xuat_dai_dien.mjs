// Chụp ảnh đại diện kênh từ khuon_dai_dien.html + nen_dai_dien_800.png.   node xuat_dai_dien.mjs <ra.jpg>
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(new URL('../cong_cu/package.json', import.meta.url))('playwright-core');
const THU_MUC = path.dirname(fileURLToPath(import.meta.url));
const ra = process.argv[2];
if (!ra) { console.error('Cần: node xuat_dai_dien.mjs <ra.jpg>'); process.exit(1); }

const browser = await chromium.launch({ headless: true, args: ['--force-color-profile=srgb', '--allow-file-access-from-files'] });
const p = await browser.newPage({ viewport: { width: 800, height: 800 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(THU_MUC, 'khuon_dai_dien.html')).href);
await p.waitForFunction(() => document.body.dataset.xong, null, { timeout: 60000 });
await p.locator('#dd').screenshot({ path: path.resolve(ra), type: 'jpeg', quality: 95 });
await browser.close();
console.log('đã ghi', path.resolve(ra));
