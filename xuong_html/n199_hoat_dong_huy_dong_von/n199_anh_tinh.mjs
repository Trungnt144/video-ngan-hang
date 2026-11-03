// N199: chụp ảnh tĩnh của trang.html ở các giây chọn trước (pha 1: ảnh tĩnh thay bản nháp, module 07 mục 14).
// Mở trang một lần với ?t=0, rồi gọi window.seek(t) cho từng giây và chụp 1920x1080 PNG.
// Dùng:  node n199_anh_tinh.mjs --moi-chuong            hai ảnh mỗi chương: giữa chương và 0,8 giây trước khi hết chương
//        node n199_anh_tinh.mjs --moi-cau              mỗi câu một ảnh, 0,3 giây trước khi hết câu (tên c<chương>_<câu>)
//        node n199_anh_tinh.mjs 12.5 40 61.2            đúng các giây này
//        thêm --ra <thư mục> (mặc định anh_tinh/), --tien-to <tên> (mặc định n199)
// Chạy qua hàng đợi:  scripts/hang_doi_ket_xuat.sh --nhanh n199 node xuong_html/n199_hoat_dong_huy_dong_von/n199_anh_tinh.mjs --moi-chuong
// Lỗi JavaScript của trang in ra màn hình (pageerror). Kèm kết quả window.kiemTra(t) nếu trang có hàm này.
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const GOC = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
let ra = path.join(GOC, 'anh_tinh'), tienTo = 'n199', moiChuong = false, moiCau = false;
const giay = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--ra') ra = path.resolve(args[++i]);
  else if (args[i] === '--tien-to') tienTo = args[++i];
  else if (args[i] === '--moi-chuong') moiChuong = true;
  else if (args[i] === '--moi-cau') moiCau = true;
  else giay.push(parseFloat(args[i]));
}
const moc = [];
if (moiChuong) {
  const tg = JSON.parse(fs.readFileSync(path.join(GOC, 'thoi_gian.json'), 'utf8'));
  for (const c of tg.chuong) {
    moc.push({ t: +((c.t + c.den) / 2).toFixed(2), nhan: `c${String(c.id).padStart(2, '0')}a` });
    moc.push({ t: +(c.den - 0.8).toFixed(2), nhan: `c${String(c.id).padStart(2, '0')}b` });
  }
}
if (moiCau) {
  const tg = JSON.parse(fs.readFileSync(path.join(GOC, 'thoi_gian.json'), 'utf8'));
  for (const c of tg.chuong) c.cau.forEach((x, i) => moc.push({ t: +(x.den - 0.3).toFixed(2), nhan: `c${String(c.id).padStart(2, '0')}_${String(i + 1).padStart(2, '0')}` }));
}
for (const t of giay) moc.push({ t, nhan: 't' + t.toFixed(2).padStart(7, '0') });
fs.mkdirSync(ra, { recursive: true });

const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('console.error:', m.text()); });
await page.goto(pathToFileURL(path.join(GOC, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
await page.evaluate(() => document.fonts.ready);
const ketQua = [];
for (const m of moc) {
  await page.evaluate((t) => window.seek(t), m.t);
  await page.waitForTimeout(60);
  const f = path.join(ra, `${tienTo}_${m.nhan}.png`);
  await page.screenshot({ path: f });
  const kiem = await page.evaluate((t) => (typeof window.kiemTra === 'function' ? window.kiemTra(t) : null), m.t);
  ketQua.push({ ...m, file: path.basename(f), kiem });
  if (kiem && (Array.isArray(kiem) ? kiem.length : Object.keys(kiem).length)) console.log(m.nhan, m.t, 'kiemTra:', JSON.stringify(kiem));
}
await browser.close();
fs.writeFileSync(path.join(ra, `${tienTo}_danh_sach.json`), JSON.stringify(ketQua, null, 1));
console.log(`đã chụp ${moc.length} ảnh vào ${ra}`);
