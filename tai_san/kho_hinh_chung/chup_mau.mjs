// chup_mau.mjs — 1.3 (03/11/2026: --kieu chọn kiểu vẽ, --toi-da-tieng đếm tiếng mỗi khung, --co-toi-thieu kiểm cỡ chữ trên màn hình) · 1.2 (làm ấm, kiểm thuần chịu lệch 8 mức màu, tắt tô lại từng phần --disable-partial-raster, 29/10/2026) — chụp ảnh mẫu kho hình dùng chung (tai_san/kho_hinh_chung/README.md, skill ra-soat-dung-chung bước 5).
// Sinh xem_mau/_ds.js từ danh_muc.json (file của từng hình kèm phụ thuộc), mở xem_mau.html cho từng hình × kiểu vẽ,
// chụp ba thời điểm khai trong xem_mau/<ten>.js, kiểm chữ (tràn, đè), kiểm hàm thuần (chụp lại theo thứ tự ngược, so từng byte),
// rồi ghép ảnh lưới <ten>_luoi.jpg. Kết quả: anh_mau/<ten>/ và anh_mau/<ten>/ket_qua.json.
// Chạy ở gốc Media/, qua chỗ nhanh của hàng đợi:
//   scripts/hang_doi_ket_xuat.sh --nhanh kho node tai_san/kho_hinh_chung/chup_mau.mjs toa_nha_ngan_hang nha_o
//   scripts/hang_doi_ket_xuat.sh --nhanh kho node tai_san/kho_hinh_chung/chup_mau.mjs --tat-ca
//   ... chup_mau.mjs <ten> --kieu toi_gian,phang --toi-da-tieng 12 --co-toi-thieu 28   (mặc định --kieu phang,net_tay; hai cờ kiểm chỉ chạy khi khai)
//   node tai_san/kho_hinh_chung/chup_mau.mjs --chi-ds        (chỉ sinh lại xem_mau/_ds.js, không mở Chrome)
import { chromium } from '/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/cong_cu/node_modules/playwright-core/index.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const KHO = path.dirname(fileURLToPath(import.meta.url));
const args0 = process.argv.slice(2);
const layCo = (ten) => { const i = args0.indexOf(ten); return i >= 0 ? args0[i + 1] : null; };
const DS_KIEU = (layCo('--kieu') || 'phang,net_tay').split(',').map((s) => s.trim()).filter(Boolean);
const TOI_DA_TIENG = layCo('--toi-da-tieng') ? parseInt(layCo('--toi-da-tieng'), 10) : null;
const CO_TOI_THIEU = layCo('--co-toi-thieu') ? parseFloat(layCo('--co-toi-thieu')) : null;
const args = args0.filter((a, i) => !['--kieu', '--toi-da-tieng', '--co-toi-thieu'].includes(a) && !['--kieu', '--toi-da-tieng', '--co-toi-thieu'].includes(args0[i - 1]));
const dm = JSON.parse(fs.readFileSync(path.join(KHO, 'danh_muc.json'), 'utf8')).hinh;
const theoTen = Object.fromEntries(dm.map((h) => [h.ten, h]));

function fileKemPhuThuoc(ten, daCo = new Set(), ra = []) {
  const h = theoTen[ten];
  if (!h || daCo.has(ten)) return ra;
  daCo.add(ten);
  for (const c of h.can || []) fileKemPhuThuoc(c, daCo, ra);
  for (const f of h.file) if (!ra.includes(f)) ra.push(f);
  return ra;
}
function docKetQua(ten) {
  const f = path.join(KHO, 'anh_mau', ten, 'ket_qua.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}
function ghiDs() {
  const ds = {};
  for (const h of dm) {
    const kq = docKetQua(h.ten);
    ds[h.ten] = { file: fileKemPhuThuoc(h.ten), phien_ban: h.phien_ban, anh: kq ? kq.anh : [] };
  }
  fs.writeFileSync(path.join(KHO, 'xem_mau', '_ds.js'),
    '// Sinh tự động bởi chup_mau.mjs từ danh_muc.json. Không sửa tay.\nwindow.KHO_DS = ' + JSON.stringify(ds, null, 1) + ';\n');
}

fs.mkdirSync(path.join(KHO, 'xem_mau'), { recursive: true });
ghiDs();
if (args.includes('--chi-ds')) { console.log('đã sinh xem_mau/_ds.js'); process.exit(0); }

let ten = args.filter((a) => !a.startsWith('--'));
if (args.includes('--tat-ca')) ten = dm.map((h) => h.ten).filter((t) => fs.existsSync(path.join(KHO, 'xem_mau', t + '.js')));
if (!ten.length) { console.log('Cần tên hình hoặc --tat-ca'); process.exit(2); }

const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-partial-raster'] });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const tongKet = [];
let trangSo = null;
async function soDiemLech(a, b) {
  trangSo ??= await ctx.newPage();
  return trangSo.evaluate(async ([a, b]) => {
    const doc = async (s) => { const im = new Image(); im.src = 'data:image/png;base64,' + s; await im.decode();
      const c = new OffscreenCanvas(im.width, im.height), x = c.getContext('2d'); x.drawImage(im, 0, 0); return x.getImageData(0, 0, im.width, im.height); };
    const [p, q] = [await doc(a), await doc(b)], w = p.width;
    let so = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let i = 0; i < p.data.length; i += 4) {
      if (Math.max(Math.abs(p.data[i] - q.data[i]), Math.abs(p.data[i + 1] - q.data[i + 1]), Math.abs(p.data[i + 2] - q.data[i + 2])) <= 8) continue;
      so++; const x = (i / 4) % w, y = Math.floor(i / 4 / w);
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    return { so, vung: so ? `x ${x0}–${x1}, y ${y0}–${y1}` : '' };
  }, [a.toString('base64'), b.toString('base64')]);
}
for (const t of ten) {
  if (!fs.existsSync(path.join(KHO, 'xem_mau', t + '.js'))) { console.log(`${t}: chưa có xem_mau/${t}.js, bỏ qua`); continue; }
  const thuMuc = path.join(KHO, 'anh_mau', t);
  fs.rmSync(thuMuc, { recursive: true, force: true });
  fs.mkdirSync(thuMuc, { recursive: true });
  const kq = { ten: t, phien_ban: theoTen[t]?.phien_ban, luc: new Date().toISOString(), anh: [], loi: [] };
  for (const kieu of DS_KIEU) {
    const page = await ctx.newPage();
    page.on('pageerror', (e) => kq.loi.push({ loai: 'pageerror', kieu, chu: e.message }));
    page.on('console', (m) => { if (m.type() === 'error') kq.loi.push({ loai: 'console', kieu, chu: m.text() }); });
    await page.goto(pathToFileURL(path.join(KHO, 'xem_mau.html')).href + `?hinh=${t}&kieu=${kieu}`, { waitUntil: 'load' });
    for (let k = 0; k < 200; k++) { if (await page.evaluate(() => window.__san_sang === true)) break; await page.waitForTimeout(50); }
    const tt = await page.evaluate(() => ({ moc: window.__moc, loi: window.__loi_nap, phong: window.__coPhong, kieuCo: window.__kieu_co, ma: KHO.ma_mau }));
    if (tt.loi) { kq.loi.push({ loai: 'nap', kieu, chu: tt.loi }); await page.close(); continue; }
    if (!tt.phong) kq.loi.push({ loai: 'phong', kieu, chu: 'phông BVP chưa nạp' });
    // làm ấm: khung đầu tiên sau khi nạp có lúc vẽ khác (bộ lọc SVG, ảnh chưa giải mã) dù DOM trùng — chạy qua mọi mốc một lượt trước khi chụp
    for (const m of tt.moc) { await page.evaluate((x) => window.seek(x), m); await page.screenshot(); }
    await page.waitForTimeout(200);
    const buf = [];
    for (let i = 0; i < tt.moc.length; i++) {
      const m = tt.moc[i];
      await page.evaluate((x) => window.seek(x), m);
      await page.waitForTimeout(40);
      const file = `${t}_${kieu}_${i + 1}.png`;
      buf[i] = await page.screenshot({ path: path.join(thuMuc, file) });
      const kc = await page.evaluate(() => window.kiemTra());
      for (const l of kc) kq.loi.push({ loai: 'chu_' + l.loai, kieu, t: m, chu: l.chu || `${l.a} | ${l.b}` });
      const dem = await page.evaluate(() => {
        const goc = document.getElementById('san'), w = document.createTreeWalker(goc, NodeFilter.SHOW_TEXT);
        const doMo = (el) => { let mo = 1; for (let e = el; e && e !== goc.parentElement; e = e.parentElement) { const st = getComputedStyle(e); if (st.visibility === 'hidden' || st.display === 'none') return 0; mo *= parseFloat(st.opacity || 1); } return mo; };
        let tieng = 0, n; const nho = [];
        while ((n = w.nextNode())) {
          const chu = n.textContent.trim(), el = n.parentElement;
          if (!chu || !el || doMo(el) < 0.2) continue;
          const rg = document.createRange(); rg.selectNodeContents(n); const r = rg.getBoundingClientRect();
          if (r.width < 1 || r.right < 0 || r.left > 1920 || r.bottom < 0 || r.top > 1080) continue;
          tieng += chu.split(/\s+/).filter((x) => /[\p{L}\p{N}]/u.test(x)).length;
          let tl = 1;
          if (el instanceof SVGElement && el.getScreenCTM) { const c = el.getScreenCTM(); if (c) tl = Math.hypot(c.a, c.b); }
          else if (el.offsetWidth > 0) tl = el.getBoundingClientRect().width / el.offsetWidth;
          const co = parseFloat(getComputedStyle(el).fontSize) * tl;
          nho.push({ chu: chu.slice(0, 40), co: Math.round(co * 10) / 10 });
        }
        return { tieng, nho };
      });
      if (TOI_DA_TIENG != null && dem.tieng > TOI_DA_TIENG) kq.loi.push({ loai: 'qua_tieng', kieu, t: m, chu: `${dem.tieng} tiếng trong khung, quá ${TOI_DA_TIENG}` });
      if (CO_TOI_THIEU != null) for (const x of dem.nho) if (x.co < CO_TOI_THIEU - 0.5) kq.loi.push({ loai: 'chu_nho', kieu, t: m, chu: `${x.co} px: ${x.chu}` });
      kq.anh.push({ kieu, t: m, mau: tt.ma, file, so_tieng: dem.tieng });
    }
    // hàm thuần: chụp lại theo thứ tự ngược. Trùng từng byte thì đạt; khác byte thì so điểm ảnh, chỉ tính lỗi khi có điểm
    // lệch quá 8 mức màu (trình duyệt có lúc khử răng cưa khác 1 mức trên vài trăm điểm dù DOM trùng — đo 29/10/2026)
    for (let i = tt.moc.length - 1; i >= 0; i--) {
      await page.evaluate((x) => window.seek(x), tt.moc[i]);
      await page.waitForTimeout(40);
      const b2 = await page.screenshot();
      if (b2.equals(buf[i])) continue;
      const lech = await soDiemLech(buf[i], b2);
      if (lech.so > 0) kq.loi.push({ loai: 'khong_thuan', kieu, t: tt.moc[i], chu: `chụp lại theo thứ tự ngược ra ảnh khác: ${lech.so} điểm lệch quá 8 mức, vùng ${lech.vung}` });
    }
    await page.close();
  }
  fs.writeFileSync(path.join(thuMuc, 'ket_qua.json'), JSON.stringify(kq, null, 1));
  ghiDs();
  const pl = await ctx.newPage();
  await pl.setViewportSize({ width: 1920, height: 800 });
  await pl.goto(pathToFileURL(path.join(KHO, 'xem_mau.html')).href + `?luoi=${t}`, { waitUntil: 'load' });
  for (let k = 0; k < 200; k++) { if (await pl.evaluate(() => window.__san_sang === true)) break; await pl.waitForTimeout(50); }
  await pl.screenshot({ path: path.join(thuMuc, `${t}_luoi.jpg`), type: 'jpeg', quality: 85, fullPage: true });
  await pl.close();
  tongKet.push(`${t}: ${kq.anh.length} ảnh, ${kq.loi.length} lỗi${kq.loi.length ? ' → ' + [...new Set(kq.loi.map((l) => l.loai))].join(', ') : ''}`);
}
await browser.close();
console.log(tongKet.join('\n'));
