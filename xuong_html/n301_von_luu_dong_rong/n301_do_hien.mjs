// N199: đo thời gian mỗi đoạn chữ trên hình (chip, tiêu đề, chữ trên thẻ) hiện rõ (độ đục từ 0,95); báo đoạn hiện rõ dưới 1,0 giây
// (chữ vừa hiện đã mờ, người xem không kịp đọc, lỗi của vòng soát trước). Chụp bằng seek mỗi 0,1 giây, không dựng video.
// Dùng: node n199_do_hien.mjs [số giây tối thiểu, mặc định 1.0]
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const GOC = path.dirname(fileURLToPath(import.meta.url));
const toiThieu = parseFloat(process.argv[2] || '1.0');
const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--font-render-hinting=none'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(pathToFileURL(path.join(GOC, 'trang.html')).href + '?t=0', { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(100); }
const kq = await page.evaluate(() => {
  const stage = document.getElementById('stage');
  const D = JSON.parse(document.getElementById('thoi_gian').textContent).thoi_luong_giay;
  const doMo = (el) => { let m = 1; for (let e = el; e && e !== stage.parentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') return 0; m *= parseFloat(s.opacity || 1); if (e instanceof SVGElement && e.getAttribute('opacity') != null) m *= parseFloat(e.getAttribute('opacity')); } return m; };
  const els = new Map();
  const w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT);
  let n; while ((n = w.nextNode())) { const el = n.parentElement, c = n.textContent.trim(); if (!c || !/[\p{L}\p{N}]/u.test(c) || el.closest('.kho-phu-de') || el.closest('[data-kho-kenh]') || el.closest('.kho-nhan-gia-dinh') || el.classList.contains('dem')) continue; els.set(el, { chu: c.slice(0, 40), run: 0, best: 0, t0: null, bestT: 0, thay: 0 }); }
  for (let i = 0; i <= Math.round(D * 10); i++) {
    const t = i / 10; window.seek(t);
    for (const [el, r] of els) {
      const m = doMo(el);
      if (m >= 0.95) { if (r.run === 0) r.t0 = t; r.run += 0.1; if (r.run > r.best) { r.best = r.run; r.bestT = r.t0; } }
      else { if (r.run > 0 && r.run < 1) r.thay = r.thay + 1; r.run = 0; }
      if (m > 0.05) r.thay = r.thay; r.vis = (r.vis || 0) + (m > 0.05 ? 0.1 : 0);
    }
  }
  return Array.from(els.values()).map((r) => ({ chu: r.chu, best: +r.best.toFixed(1), bestT: +r.bestT.toFixed(1), vis: +(r.vis || 0).toFixed(1) }));
});
const ngan = kq.filter((r) => r.vis > 0 && r.best < toiThieu);
for (const r of ngan) console.log(`hiện rõ tối đa ${r.best} giây (từ ${r.bestT}), có mặt ${r.vis}: ${r.chu}`);
console.log(`xong: ${kq.length} đoạn chữ, ${ngan.length} đoạn hiện rõ dưới ${toiThieu} giây`);
await browser.close();
