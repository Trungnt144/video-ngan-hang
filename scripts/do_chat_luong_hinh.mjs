// Đo chất lượng hình của một video HTML (LM-03) bằng máy, theo từng chương: chuyển động, mật độ chữ, cỡ chữ.
// Dùng:  node scripts/do_chat_luong_hinh.mjs xuong_html/<mã>_<tên> [--buoc 1] [--json <file>]
// Trang phải có window.seek(t), thoi_gian.json (chương: id, t, den) và window.__san_sang như khuôn n199.
// Không đo dải phụ đề (y > 900) và màn hình kết. Ngưỡng NGUONG đặt theo số đo thật của video mẫu n199 (xem 90_bai_hoc.md).
// Thoát 0 nếu mọi chương đạt, 1 nếu có chương không đạt (để dùng làm cổng trước pha máy).
import { chromium } from '../xuong_html/cong_cu/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const NGUONG = {
  chuyen_dong_toi_thieu: 0.6,   // tỉ lệ khoảng 1 giây có chuyển động thật của hình (không tính phụ đề) tối thiểu mỗi chương
  tu_toi_da: 26,                // số từ nhiều nhất trên hình cùng lúc (không tính phụ đề), trung vị mỗi chương
  chu_nho_toi_da: 0.25,         // tỉ lệ ký tự trong chữ cỡ dưới CO_CHU_NHO px (đã quy ra khung 1920 px)
  co_chu_nho: 26,
};
const args = process.argv.slice(2);
const thuMuc = path.resolve(args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--buoc' && args[args.indexOf(a) - 1] !== '--json') || '');
const buoc = parseFloat(args[args.indexOf('--buoc') + 1]) || 1;
const fileJson = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
if (!fs.existsSync(path.join(thuMuc, 'trang.html'))) { console.error('Dùng: node scripts/do_chat_luong_hinh.mjs xuong_html/<mã>_<tên>'); process.exit(2); }
const tg = JSON.parse(fs.readFileSync(path.join(thuMuc, 'thoi_gian.json'), 'utf8'));

const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
const tien = await (await browser.newContext()).newPage();   // trang trống để giải mã ảnh
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(pathToFileURL(path.join(thuMuc, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }

async function xamNho(buf) {   // ảnh JPEG -> mảng xám 192x90 (dải hình, bỏ phụ đề)
  const b64 = buf.toString('base64');
  return tien.evaluate(async (s) => {
    const blob = await (await fetch('data:image/jpeg;base64,' + s)).blob();
    const bm = await createImageBitmap(blob);
    const c = new OffscreenCanvas(192, 90); const x = c.getContext('2d');
    x.drawImage(bm, 0, 0, 192, 90); const d = x.getImageData(0, 0, 192, 90).data; const g = new Float32Array(192 * 90);
    for (let i = 0; i < g.length; i++) g[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    return Array.from(g);
  }, b64);
}
function luongChuyenDong(a, b) { let s = 0; for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]); return s / a.length; }

const bang = [];
for (const c of tg.chuong) {
  const t0 = c.t + 0.5, t1 = c.den - 0.5;
  if (t1 <= t0) continue;
  const mau = [];
  for (let t = t0; t <= t1; t += buoc) mau.push(+t.toFixed(2));
  let truoc = null; let dong = 0, khoang = 0; const tu = []; let kyTuTong = 0, kyTuNho = 0;
  for (const t of mau) {
    await page.evaluate((s) => window.seek(s), t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 50, clip: { x: 0, y: 0, width: 1920, height: 900 } });
    const xam = await xamNho(buf);
    if (truoc) { khoang++; if (luongChuyenDong(truoc, xam) > 0.35) dong++; }
    truoc = xam;
    const r = await page.evaluate((CO_NHO) => {
      const hien = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) { o *= parseFloat(getComputedStyle(n).opacity); } return o > 0.5; };
      let kt = 0, kn = 0; const seen = new Set();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const s = n.nodeValue.trim(); const el = n.parentElement; if (!s || !el || seen.has(n)) continue; seen.add(n);
        if (['SCRIPT', 'STYLE', 'TITLE'].includes(el.tagName) || !hien(el)) continue;
        const rc = el.getBoundingClientRect(); if (rc.width === 0 || rc.top > 900 || rc.bottom < 0) continue;
        let px = parseFloat(getComputedStyle(el).fontSize);
        const svg = el.closest('svg'); if (svg && el instanceof SVGElement && el.getScreenCTM) { const m = el.getScreenCTM(); if (m) px *= Math.hypot(m.a, m.b); }
        kt += s.length; if (px < CO_NHO) kn += s.length;
      }
      return { kt, kn };
    }, NGUONG.co_chu_nho);
    kyTuTong += r.kt; kyTuNho += r.kn;
    // số từ: ưu tiên hàm demTu của khuôn (đã loại phụ đề, nhãn giả định); không có thì ước từ số ký tự
    const soTu = await page.evaluate((s) => (window.demTu ? window.demTu(s).so : null), t);
    tu.push(soTu ?? Math.round(r.kt / 5));
  }
  tu.sort((a, b) => a - b);
  bang.push({
    chuong: c.id, tu: +c.t.toFixed(1), den: +c.den.toFixed(1),
    chuyen_dong: khoang ? +(dong / khoang).toFixed(2) : 0,
    tu_trung_vi: tu[Math.floor(tu.length / 2)] ?? 0,
    chu_nho: kyTuTong ? +(kyTuNho / kyTuTong).toFixed(2) : 0,
  });
  const b = bang[bang.length - 1];
  const loi = [];
  if (b.chuyen_dong < NGUONG.chuyen_dong_toi_thieu) loi.push(`chuyển động ${b.chuyen_dong} < ${NGUONG.chuyen_dong_toi_thieu}`);
  if (b.tu_trung_vi > NGUONG.tu_toi_da) loi.push(`chữ dày ${b.tu_trung_vi} từ > ${NGUONG.tu_toi_da}`);
  if (b.chu_nho > NGUONG.chu_nho_toi_da) loi.push(`chữ nhỏ ${(b.chu_nho * 100) | 0}% > ${NGUONG.chu_nho_toi_da * 100}%`);
  b.loi = loi;
  console.log(`chương ${b.chuong} (${b.tu}–${b.den}s): chuyển động ${b.chuyen_dong} · từ ${b.tu_trung_vi} · chữ nhỏ ${(b.chu_nho * 100) | 0}% ${loi.length ? '→ KHÔNG ĐẠT: ' + loi.join('; ') : '→ đạt'}`);
}
await browser.close();
const hong = bang.filter((b) => b.loi.length);
console.log(`\nTổng: ${bang.length - hong.length}/${bang.length} chương đạt. Ngưỡng: ${JSON.stringify(NGUONG)}`);
if (fileJson) fs.writeFileSync(fileJson, JSON.stringify({ thu_muc: thuMuc, nguong: NGUONG, chuong: bang }, null, 1));
process.exit(hong.length ? 1 : 0);
