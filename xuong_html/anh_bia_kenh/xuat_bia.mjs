// Chụp ảnh bìa kênh từ khuon_bia.html + nen_2560x1440.png.
//   node xuat_bia.mjs <ra.jpg> [--guide] [--facebook]   --guide: vẽ khung vùng an toàn (bản kiểm, không dùng để đăng)
//                                                       --facebook: ảnh bìa Facebook 1640×624 từ nen_facebook_1640x624.png (ghep_bia_facebook.py)
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(new URL('../cong_cu/package.json', import.meta.url))('playwright-core');
const THU_MUC = path.dirname(fileURLToPath(import.meta.url));
const doi = process.argv.slice(2);
const ra = doi.find((a) => !a.startsWith('--'));
if (!ra) { console.error('Cần: node xuat_bia.mjs <ra.jpg> [--guide]'); process.exit(1); }
const guide = doi.includes('--guide'), fb = doi.includes('--facebook');
const [rong, cao] = fb ? [1640, 624] : [2560, 1440];

const browser = await chromium.launch({ headless: true, args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--allow-file-access-from-files'] });
const p = await browser.newPage({ viewport: { width: rong, height: cao }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(THU_MUC, 'khuon_bia.html')).href + '?' + new URLSearchParams({ ...(guide ? { guide: '1' } : {}), ...(fb ? { kho: 'facebook', nen: 'nen_facebook_1640x624.png' } : {}) }));
await p.waitForFunction(() => document.body.dataset.xong, null, { timeout: 60000 });
await p.locator('#bia').screenshot({ path: path.resolve(ra), type: 'jpeg', quality: 95 });
await browser.close();
console.log('đã ghi', path.resolve(ra));
