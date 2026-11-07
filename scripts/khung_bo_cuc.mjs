// khung_bo_cuc.mjs — nhúng phiếu đặt hình vào trang dựng và xuất ảnh khung bố cục xám cho Muse (luồng Claude–Muse, lập 08/11/2026).
//
//   node scripts/khung_bo_cuc.mjs <thư mục dựng> [--phieu phieu_dat_hinh.json] [--trang trang.html] [--ra <thư mục>] [--chi-nhung] [--canh id1,id2]
//
// 1. Đọc <thư mục dựng>/phieu_dat_hinh.json, chèn vào trang giữa <!--PHIEU_BAT_DAU--> và <!--PHIEU_KET_THUC-->
//    dưới dạng <script type="application/json" id="phieu_dat_hinh">. Trang chưa có hai dấu thì báo lỗi.
// 2. Mở trang bằng Chromium 1920×1080 (?t=0), chờ window.__san_sang, gọi KHO.nenAnh.chiKhung(id) cho từng cảnh
//    nen_muse, clip_muse, hinh_thu_nho của phiếu, chụp <ra>/<id>.png (mặc định <thư mục dựng>/out/khung_bo_cuc/).
// Khung vẽ bằng chính thư viện chung/nen_anh.js mà trang dùng để đặt lớp cơ chế, nên ô xám trùng toạ độ lớp hoạt hình.
// Cũng báo ảnh nền còn thiếu trong nen/ (KHO.nenAnh.thieu). Mã thoát 0 khi xong, 1 khi lỗi.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const ts = { _: [] };
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) { const k = argv[i].slice(2); const v = argv[i + 1]; if (v === undefined || v.startsWith('--')) ts[k] = true; else { ts[k] = v; i++; } }
  else ts._.push(argv[i]);
}
if (!ts._[0]) { console.log('Dùng: node scripts/khung_bo_cuc.mjs <thư mục dựng> [--phieu f] [--trang f] [--ra thư_mục] [--chi-nhung] [--canh a,b]'); process.exit(2); }
const DU_AN = path.resolve(ts._[0]);
const F_PHIEU = path.resolve(DU_AN, ts.phieu || 'phieu_dat_hinh.json');
const F_TRANG = path.join(DU_AN, ts.trang || 'trang.html');
const RA = path.resolve(ts.ra || path.join(DU_AN, 'out', 'khung_bo_cuc'));

// ---- 1. nhúng phiếu ----
const phieu = JSON.parse(fs.readFileSync(F_PHIEU, 'utf8'));
for (const c of phieu.canh || []) for (const [ten, r] of Object.entries(c.vung_neo || {})) {
  const [W, H] = c.kich_thuoc || phieu.kich_thuoc || [1920, 1080];
  if (!Array.isArray(r) || r.length !== 4 || r[0] >= r[2] || r[1] >= r[3] || r[0] < 0 || r[1] < 0 || r[2] > W || r[3] > H)
    { console.error(`Lỗi phiếu: cảnh ${c.id}, vùng ${ten} = ${JSON.stringify(r)} không phải [x1, y1, x2, y2] trong khung ${W}×${H}`); process.exit(1); }
}
const html = fs.readFileSync(F_TRANG, 'utf8');
const A = '<!--PHIEU_BAT_DAU-->', B = '<!--PHIEU_KET_THUC-->';
const ia = html.indexOf(A), ib = html.indexOf(B);
if (ia < 0 || ib < ia) { console.error(`Trang ${F_TRANG} chưa có hai dấu ${A} ${B} (đặt trước các thẻ <script src=...>)`); process.exit(1); }
const json = JSON.stringify(phieu).replace(/<\//g, '<\\/');
const moi = html.slice(0, ia + A.length) + `<script type="application/json" id="phieu_dat_hinh">${json}</script>` + html.slice(ib);
if (moi !== html) { fs.writeFileSync(F_TRANG, moi); console.log(`Đã nhúng phiếu vào ${path.relative(GOC, F_TRANG)}`); }
else console.log('Phiếu trong trang đã khớp, không ghi lại');
if (ts['chi-nhung']) process.exit(0);

// ---- 2. chụp khung ----
const { chromium } = await import(pathToFileURL(path.join(GOC, 'xuong_html/cong_cu/node_modules/playwright-core/index.mjs')).href);
const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'] });
let loi = 0;
try {
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 })).newPage();
  page.on('pageerror', (e) => { loi++; console.log('pageerror:', e.message); });
  await page.goto(pathToFileURL(F_TRANG).href + '?t=0', { waitUntil: 'load' });
  for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
  await page.evaluate(() => document.fonts.ready);
  const coThuVien = await page.evaluate(() => !!(window.KHO && window.KHO.nenAnh));
  if (!coThuVien) throw new Error('trang không nạp thu_vien/kho/chung/nen_anh.js');
  let ds = await page.evaluate(() => window.KHO.nenAnh.dsCanhCanKhung());
  if (ts.canh) { const chon = String(ts.canh).split(','); ds = ds.filter((x) => chon.includes(x)); }
  fs.mkdirSync(RA, { recursive: true });
  for (const id of ds) {
    await page.evaluate((i) => window.KHO.nenAnh.chiKhung(i), id);
    const f = path.join(RA, `${id}.png`);
    await page.screenshot({ path: f, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
    console.log(`khung: ${path.relative(GOC, f)}`);
  }
  await page.evaluate(() => window.KHO.nenAnh.chiKhung(null));
  const thieu = await page.evaluate(() => window.KHO.nenAnh.thieu);
  if (thieu.length) console.log(`Ảnh nền chưa có (cảnh đó đang hiện khung xám): ${thieu.join(', ')}`);
} catch (e) { console.error('Lỗi:', e.message); loi++; }
await browser.close();
process.exit(loi ? 1 : 0);
