// N199: ước lượng đứng hình trên ảnh chụp trang (không kết xuất video). Chụp mỗi 0,5 giây trong [a, b], thu nhỏ 480×220 (bỏ dải phụ đề y ≥ 880),
// tính độ lệch sáng trung bình mỗi điểm ảnh giữa khung t và khung t + 1,5 giây (thang 0–255). Dưới ngưỡng (mặc định 0,6) thì báo: khung gần như đứng yên 1,5 giây.
// Dùng: node n199_dung_hinh.mjs <a> <b> [ngưỡng]   (qua hàng đợi --nhanh, mỗi lượt khoảng 60 giây video)
import { chromium } from '../cong_cu/node_modules/playwright-core/index.mjs';
import path from 'node:path'; import { pathToFileURL, fileURLToPath } from 'node:url';
const G = path.dirname(fileURLToPath(import.meta.url));
const [a, b] = [parseFloat(process.argv[2]), parseFloat(process.argv[3])]; const NG = parseFloat(process.argv[4] || '0.6');
const br = await chromium.launch({ headless: true, args: ['--hide-scrollbars'] });
const ctx = await br.newContext({ viewport: { width: 1920, height: 1080 } });
const p = await ctx.newPage(), q = await ctx.newPage();
await p.goto(pathToFileURL(path.join(G, 'trang.html')).href + '?t=0');
for (let i = 0; i < 300; i++) { if (await p.evaluate(() => window.__san_sang)) break; await p.waitForTimeout(100); }
await q.setContent('<canvas id="c" width="480" height="220"></canvas>');
await q.evaluate(() => { window.F = {}; window.cx = document.getElementById('c').getContext('2d', { willReadFrequently: true }); });
const ts = []; for (let t = a; t <= b + 1.5 + 1e-6; t += 0.5) ts.push(+t.toFixed(2));
for (const t of ts) {
  await p.evaluate((t) => window.seek(t), t); await p.waitForTimeout(30);
  const buf = await p.screenshot({ type: 'jpeg', quality: 60, clip: { x: 0, y: 0, width: 1920, height: 880 } });
  await q.evaluate(async ([t, b64]) => {
    const img = new Image(); img.src = 'data:image/jpeg;base64,' + b64; await img.decode();
    cx.drawImage(img, 0, 0, 480, 220); const d = cx.getImageData(0, 0, 480, 220).data; const L = new Float32Array(480 * 220);
    for (let i = 0; i < L.length; i++) L[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    F[t] = L;
  }, [t, buf.toString('base64')]);
}
const kq = await q.evaluate(([ts, NG]) => {
  const out = [];
  for (const t of ts) { const u = +(t + 1.5).toFixed(2); if (!F[u]) continue; const A = F[t], B = F[u]; let s = 0; for (let i = 0; i < A.length; i++) s += Math.abs(A[i] - B[i]); out.push([t, s / A.length]); }
  return out;
}, [ts, NG]);
const thap = kq.filter(([, d]) => d < NG);
console.log(`đo ${kq.length} cặp khung trong ${a}–${b} giây; nhỏ nhất ${Math.min(...kq.map((x) => x[1])).toFixed(2)}; dưới ngưỡng ${NG}: ${thap.length}`);
for (const [t, d] of thap) console.log('  đứng gần yên', t, '→', (t + 1.5).toFixed(1), 'lệch', d.toFixed(2));
console.log('  10 cặp thấp nhất:', kq.slice().sort((x, y) => x[1] - y[1]).slice(0, 10).map(([t, d]) => `${t}:${d.toFixed(2)}`).join(' '));
await br.close();
