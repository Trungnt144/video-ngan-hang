// Xuất hình thu nhỏ từ một file kê khai JSON qua khuôn khuon.html (cách viết kê khai: README.md cùng thư mục).
//
//   node xuat.mjs <kê khai.json> --thu            chụp mọi hình vào xem_truoc/<chu_de>/ kèm bảng soát luoi.jpg (bản lưới toạ độ: thêm --luoi)
//   node xuat.mjs <kê khai.json>                  xuất thật vào san_pham/<video>/: bản gốc PNG mọi hình vào tai_nguyen/hinh_thu_nho_goc/,
//                                                 hình được chọn ("chon") thành JPG tải lên ngoài cùng thư mục video
//
// Bản gốc chụp 3840×2160 khi mọi ảnh trong hình đủ độ phân giải, nếu không thì 1920×1080 (không phóng to ảnh nhỏ).
// JPG tải lên theo bảng phong cách mục 4 quy tắc 1: 1920×1080, chất lượng cao nhất mà file dưới 2 MB (cong_cu.py jpg).
//
// Kê khai "kenh": "ngan_hang" (bảng phong cách mục 0b, Trung chốt 30/10/2026): bỏ hai kiểm của kênh Điện (trùng ảnh thật theo sổ ảnh,
// luân phiên bố cục L1–L5) và kiểm mã công thức; thêm kiểm đọc được: đo tương phản từng dòng chữ với nền (tối thiểu 4,5:1)
// và khi xem thử xuất thêm mỗi hình hai bản thu nhỏ 320×180 (laptop) và 168×94 (điện thoại), bảng soát luoi.jpg đặt ba cỡ cạnh nhau.
//
//   node xuat.mjs <kê khai.json> --doc [--thu]    bìa dọc 1080×1920 cho Reels, Shorts, TikTok (Trung chốt 30/10/2026) dựng lại hình đã chọn
//                                                 ("chon"): xem thử vào xem_truoc/<chu_de>_doc/ kèm luoi.jpg (cả khung, phần còn lại khi cắt
//                                                 4:5 và 1:1); xuất thật thành san_pham/<video>/yyyy.mm.dd.<chu_de>_hinh_thu_nho_doc_v<n>.jpg.
//                                                 Bỏ kiểm trùng ảnh và luân phiên bố cục vì bìa dọc dùng lại đúng hình bản ngang.
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const { chromium } = createRequire(new URL('../cong_cu/package.json', import.meta.url))('playwright-core');
const THU_MUC = path.dirname(fileURLToPath(import.meta.url));
const GOC_MEDIA = path.resolve(THU_MUC, '../..');
const CONG_CU = path.join(THU_MUC, 'cong_cu.py');

const doi = process.argv.slice(2);
const keKhai = doi.find((a) => !a.startsWith('--'));
const thu = doi.includes('--thu'), luoi = doi.includes('--luoi'), doc = doi.includes('--doc');
if (!keKhai) { console.error('Cần: node xuat.mjs <kê khai.json> [--thu] [--luoi]'); process.exit(1); }
const ke = JSON.parse(fs.readFileSync(keKhai, 'utf8'));
for (const k of ['chu_de', 'hinh']) if (!ke[k]) throw new Error(`Kê khai thiếu "${k}"`);
const kenh = ke.kenh || 'dien', nganHang = kenh === 'ngan_hang';
if (doc) {
  if (!ke.chon) throw new Error('Bìa dọc dựng lại hình đã chọn: kê khai cần "chon"');
  ke.hinh = ke.hinh.filter((h) => h.id === ke.chon);
}
const duoiDoc = doc ? '_doc' : '';

const homNay = () => { const d = new Date(); return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`; };
const ngay = ke.ngay || homNay(), pb = ke.phien_ban || 1;
let raGoc, raTaiLen;
if (thu) {
  raGoc = path.join(THU_MUC, 'xem_truoc', ke.chu_de + duoiDoc);
} else {
  if (!ke.video || !ke.chon) throw new Error('Xuất thật cần "video" (thư mục trong san_pham/) và "chon" (id hình tải lên); muốn xem thử thì thêm --thu');
  const tm = path.join(GOC_MEDIA, 'san_pham', ke.video);
  if (!fs.existsSync(tm)) throw new Error(`Không có thư mục san_pham/${ke.video}`);
  raGoc = path.join(tm, 'tai_nguyen', 'hinh_thu_nho_goc');
  raTaiLen = path.join(tm, `${ngay}.${ke.chu_de}_hinh_thu_nho${duoiDoc}_v${pb}.jpg`);
}
fs.mkdirSync(raGoc, { recursive: true });

// Mỗi file ảnh chỉ làm nền cho một video (Trung chốt 28/10/2026, bảng phong cách mục 0 quy tắc cứng 3).
// Quét kê khai của các video khác trong san_pham/: ảnh nền của hình đã chọn ("chon") coi như đã dùng.
// So theo mã ảnh gốc ghi ở cột 2 sổ ảnh (số Pexels, mã Unsplash, tên gốc Commons) để bắt cùng một ảnh lưu dưới hai tên file;
// file chưa có trong sổ thì so theo đường dẫn.
const maGoc = new Map();
const SO_ANH = path.join(GOC_MEDIA, 'tai_san', 'anh_that', 'so_anh.md');
if (fs.existsSync(SO_ANH)) for (const dong of fs.readFileSync(SO_ANH, 'utf8').split('\n')) {
  const m = dong.match(/^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|/);
  if (m) maGoc.set(path.resolve(GOC_MEDIA, 'tai_san', 'anh_that', m[1]), m[2]);
}
const khoa = (a) => { const p = path.resolve(GOC_MEDIA, a); return maGoc.get(p) || p; };
const anhNen = (h) => (h ? [h.anh, h.chia?.anh, ...(h.dai_anh || []).map((x) => x.anh)].filter(Boolean) : []);
const daDung = new Map();
const daXuat = []; // bố cục đã tải lên của các video khác, xếp theo giờ xuất JPG tải lên
for (const tm of fs.readdirSync(path.join(GOC_MEDIA, 'san_pham'))) {
  if (tm === ke.video) continue;
  const f = path.join(GOC_MEDIA, 'san_pham', tm, 'tai_nguyen', 'dang_bai', 'hinh_thu_nho.json');
  if (!fs.existsSync(f)) continue;
  const k = JSON.parse(fs.readFileSync(f, 'utf8'));
  if ((k.kenh || 'dien') !== kenh) continue; // trùng ảnh, nhịp bố cục chỉ tính trong cùng một kênh
  const h = (k.hinh || []).find((x) => x.id === k.chon);
  for (const a of anhNen(h)) daDung.set(khoa(a), tm);
  const jpg = fs.readdirSync(path.join(GOC_MEDIA, 'san_pham', tm)).filter((x) => /_hinh_thu_nho_v\d+\.jpg$/.test(x))
    .map((x) => fs.statSync(path.join(GOC_MEDIA, 'san_pham', tm, x)).mtimeMs);
  if (h?.bo_cuc && jpg.length) daXuat.push({ tm, bo_cuc: h.bo_cuc, cong_thuc: h.cong_thuc, t: Math.max(...jpg) });
}
// kênh Ngân hàng không dùng ảnh thật (mục 0b quy tắc 1) nên không kiểm trùng ảnh nền
const trung = (h) => (nganHang || doc ? undefined : anhNen(h).map((a) => daDung.get(khoa(a))).find(Boolean));

// Luân phiên bố cục (Trung chốt 28/10/2026, bảng phong cách mục 0 quy tắc cứng 4): không cùng bố cục với hình xuất ngay trước,
// và trong 6 hình gần nhất (kể cả hình này) L3 không quá 2.
daXuat.sort((a, b) => a.t - b.t);
const truoc = daXuat.at(-1), namTruoc = daXuat.slice(-5);
const lechNhip = (h) => nganHang || doc ? '' : [
  truoc && h.bo_cuc === truoc.bo_cuc && `cùng bố cục ${h.bo_cuc} với hình xuất ngay trước (${truoc.tm})`,
  h.bo_cuc === 'L3' && namTruoc.filter((x) => x.bo_cuc === 'L3').length >= 2 && `đã có ${namTruoc.filter((x) => x.bo_cuc === 'L3').length} hình L3 trong 5 hình gần nhất`,
].filter(Boolean).join('; ');

// Chống lặp kiểu chữ, kiểu ảnh (Trung chốt 28/10/2026, ../../tai_san/so_tay_gu/cong_thuc_hinh_thu_nho.md mục 3): trường "cong_thuc"
// dạng "C2-A6" hoặc "C8-A4+A6"; kiểu ảnh chính là mã A đầu tiên. Chỉ cảnh báo, không dừng xuất, vì câu chữ thường do Trung chỉ định.
const maC = (ct) => (ct || '').match(/C\d+/)?.[0], maA = (ct) => (ct || '').match(/A\d+/)?.[0];
const lapCongThuc = (h) => {
  if (nganHang || doc) return ''; // mã công thức C/A viết cho kênh Điện (ảnh thật); kênh Ngân hàng theo mục 0b
  if (!h.cong_thuc) return 'chưa ghi "cong_thuc" (mã kiểu chữ, kiểu ảnh)';
  const c = maC(h.cong_thuc), soC = [...namTruoc, h].filter((x) => maC(x.cong_thuc) === c).length;
  return [
    truoc?.cong_thuc && c === maC(truoc.cong_thuc) && maA(h.cong_thuc) === maA(truoc.cong_thuc) && `trùng cả kiểu chữ ${c} và kiểu ảnh ${maA(h.cong_thuc)} với hình xuất ngay trước (${truoc.tm})`,
    soC > 3 && `kiểu chữ ${c} đã có ${soC} lần trong 6 hình gần nhất (tối đa 3)`,
  ].filter(Boolean).join('; ');
};
if (!thu) {
  const hc = ke.hinh.find((h) => h.id === ke.chon);
  if (hc && trung(hc) && !doi.includes('--cho_trung')) throw new Error(`Ảnh nền ${anhNen(hc).find((a) => daDung.get(khoa(a)))} đã dùng cho video ${trung(hc)}; chọn ảnh khác (quy tắc mỗi video một ảnh)`);
  if (hc && lechNhip(hc) && !doi.includes('--cho_trung_bo_cuc')) throw new Error(`Hình ${hc.id}: ${lechNhip(hc)}; chọn bố cục khác (quy tắc luân phiên bố cục)`);
}
if (thu && daXuat.length && !nganHang && !doc) console.log(`Bố cục 5 hình xuất gần nhất: ${namTruoc.map((x) => x.bo_cuc).join(' → ')} · công thức: ${namTruoc.map((x) => x.cong_thuc || '?').join(' → ')}`);

const browser = await chromium.launch({ headless: true, args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--allow-file-access-from-files'] });
const url = pathToFileURL(path.join(THU_MUC, 'khuon.html')).href + (luoi ? '?luoi=1' : '');
async function moTrang(heSo) {
  const p = await browser.newPage({ viewport: { width: 1400, height: doc ? 1400 : 900 }, deviceScaleFactor: heSo });
  await p.addInitScript(([k, d]) => { window.__KE = k; window.__DOC = d; }, [ke, doc]);
  await p.goto(url);
  await p.waitForFunction(() => document.body.dataset.xong, null, { timeout: 60000 });
  const xong = await p.evaluate(() => document.body.dataset.xong);
  if (xong !== '1') throw new Error(xong);
  return p;
}
const p15 = await moTrang(1.5), p3 = await moTrang(3);

// Tương phản chữ với nền (mục 0b quy tắc 2): ẩn chữ của khối NH (giữ thẻ nền nếu có), chụp nền, đo từng dòng bằng cong_cu.py.
async function tuongPhan(h) {
  const dong = await p15.$eval(`#${h.id}`, (s) => s.dataset.dongChu || '');
  if (!dong) return '';
  const nen = path.join(raGoc, `.nen_${h.id}.png`);
  await p15.$eval(`#${h.id}`, (s) => s.querySelectorAll('.chu-nh').forEach((e) => (e.style.opacity = '0')));
  await p15.locator(`#${h.id}`).screenshot({ path: nen });
  await p15.$eval(`#${h.id}`, (s) => s.querySelectorAll('.chu-nh').forEach((e) => (e.style.opacity = '')));
  const kq = execFileSync('python3', [CONG_CU, 'tuong_phan', nen, '1.5', dong], { encoding: 'utf8' }).trim();
  fs.rmSync(nen);
  return kq;
}

const ket = [];
for (const h of ke.hinh) {
  const tt = await p15.$eval(`#${h.id}`, (s) => ({ goc: s.dataset.goc, mau: s.dataset.mau, sac: s.dataset.sac || 'kê khai', canh: s.dataset.canh, co: s.dataset.coChu, tl: s.dataset.tiLe }));
  const ten = thu ? `${h.id}.png` : `${ngay}.${ke.chu_de}_hinh_thu_nho${duoiDoc}_${h.id}_v${pb}.png`;
  const ra = path.join(raGoc, ten);
  await (tt.goc === '4k' && !luoi ? p3 : p15).locator(`#${h.id}`).screenshot({ path: ra });
  ket.push(ra);
  // tương phản: dòng in ra dạng "Dòng 1 «...» 7,8:1; ..."; dòng dưới 4,5:1 có chữ "THẤP"
  const tp = h.bo_cuc === 'NH' ? await tuongPhan(h) : '';
  const canh = [tt.canh, trung(h) && `ảnh nền đã dùng cho video ${trung(h)}`, lechNhip(h), lapCongThuc(h), tp.includes('THẤP') && 'tương phản chữ với nền dưới 4,5:1'].filter(Boolean).join('; ');
  const mo = h.bo_cuc === 'NH' ? `cỡ chữ ${tt.co} · ${tt.tl} · tương phản ${tp}` : `màu chữ ${tt.mau} (${tt.sac})`;
  console.log(`${h.id} [${h.bo_cuc}] bản gốc ${doc ? '1080×1920' : tt.goc === '4k' && !luoi ? '3840×2160' : '1920×1080'} · ${mo}${canh ? '\n   CẢNH BÁO: ' + canh : ''}`);
}
await browser.close();

if (thu) {
  const luoiJpg = path.join(raGoc, 'luoi.jpg');
  // kênh Ngân hàng: thêm bản 320×180 và 168×94 của từng hình, bảng soát đặt ba cỡ cạnh nhau (mục 0b quy tắc 2)
  if (nganHang) for (const f of ket) execFileSync('python3', [CONG_CU, 'co_nho', f], { stdio: 'inherit' });
  execFileSync('python3', [CONG_CU, doc ? 'luoi_doc' : nganHang ? 'luoi_nh' : 'luoi', luoiJpg, ke.thoi_luong || '10:00', ...ket], { stdio: 'inherit' });
} else {
  const chon = ket[ke.hinh.findIndex((h) => h.id === ke.chon)];
  if (!chon) throw new Error(`"chon": "${ke.chon}" không khớp id hình nào`);
  execFileSync('python3', [CONG_CU, doc ? 'jpg_doc' : 'jpg', chon, raTaiLen], { stdio: 'inherit' });
}
