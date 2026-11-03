// Chụp ảnh bìa và ảnh đại diện kênh "Chuyện nghề Ngân hàng" từ khuôn HTML trong thư mục này.
//   node ngan_hang/xuat.mjs bia <ra.jpg> [--bt=A|B|C] [--guide] [--facebook]   ảnh bìa YouTube 2560×1440 (nền nen_2560x1440.png) hoặc Facebook 1640×624;
//                                                                            --bt: mẫu ảnh đại diện đặt cạnh chữ (cần dd_<mẫu>.png, sinh bằng lệnh dưới)
//   node ngan_hang/xuat.mjs dai_dien <ra.jpg> <A|B|C>                          ảnh đại diện 800×800; ghi thêm dd_<mẫu>.png cạnh khuôn cho ảnh bìa dùng
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(new URL('../../cong_cu/package.json', import.meta.url))('playwright-core');
const THU_MUC = path.dirname(fileURLToPath(import.meta.url));
const [loai, ra, ...them] = process.argv.slice(2);
if (!['bia', 'dai_dien'].includes(loai) || !ra) { console.error('Cần: node ngan_hang/xuat.mjs bia|dai_dien <ra.jpg> [...]'); process.exit(1); }
const fb = them.includes('--facebook');
let trang, q, kho, chon;
if (loai === 'bia') {
  trang = 'khuon_bia.html';
  q = { bieu_tuong: (them.find((a) => a.startsWith('--bt=')) || '--bt=A').slice(5), ...(them.includes('--guide') ? { guide: '1' } : {}), ...(fb ? { kho: 'facebook', nen: 'nen_facebook_1640x624.png' } : {}) };
  kho = fb ? [1640, 624] : [2560, 1440];
  chon = '#bia';
} else {
  trang = 'khuon_dai_dien.html';
  q = { mau: them[0] || 'A' };
  kho = [800, 800];
  chon = '#dd';
}
const browser = await chromium.launch({ headless: true, args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--allow-file-access-from-files'] });
const p = await browser.newPage({ viewport: { width: kho[0], height: kho[1] }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(path.join(THU_MUC, trang)).href + '?' + new URLSearchParams(q));
await p.waitForFunction(() => document.body.dataset.xong, null, { timeout: 60000 });
await p.locator(chon).screenshot({ path: path.resolve(ra), type: 'jpeg', quality: 95 });
if (loai === 'dai_dien') await p.locator(chon).screenshot({ path: path.join(THU_MUC, `dd_${q.mau}.png`) });
await browser.close();
console.log('đã ghi', path.resolve(ra));
