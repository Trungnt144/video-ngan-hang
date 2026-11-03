// Lấy hình vẽ cho hình thu nhỏ từ chính trang dựng của một video HTML (LM-03), kênh Chuyện nghề Ngân hàng
// (bảng phong cách mục 0b quy tắc 1: dựng lại từ mã của video, nét sạch, không phụ đề, không nhãn số).
// Mở trang.html của video ở ?t=<giây> (trang có vòng hoạt hoạ tự gọi lại seek theo tham số này), gọi window.seek(t), ẩn các phần tử theo bộ chọn CSS (phụ đề, thanh tiến độ, nhãn chương, nhãn chữ),
// chụp lại ở hệ số 2 (3840×2160) nên nét vẽ vẫn sắc khi phóng to trong hình thu nhỏ. Chỉ đọc trang, không sửa gì của video.
//
//   node lay_hinh.mjs <trang.html> <giây> <ảnh ra.png> [--an "<bộ chọn>,<bộ chọn>"] [--an_chu] [--he_so 2] [--cat x,y,w,h] [--nen '#màu']
//   node lay_hinh.mjs <trang.html> <giây> --liet_ke         in cây phần tử nhìn thấy (để chọn bộ chọn cần ẩn)
//
// --nen: đặt nền trang thành một màu phẳng (khi nền video có lưới ô, vệt sáng làm lộ mép vùng cắt); lớp nền SVG thì ẩn thêm bằng --an.
// --cat: chỉ chụp vùng x,y,w,h (toạ độ khung 1920×1080), ra ảnh w×h nhân hệ số.
// --an_chu: ẩn mọi chữ (thẻ text của SVG, phần tử HTML có chữ riêng) còn lại trong cảnh.
// Ảnh ra để trong khung/ (ngoài git); kê khai hình thu nhỏ trỏ tới đó, ghi lại lệnh để sinh lại.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const { chromium } = createRequire(new URL('../cong_cu/package.json', import.meta.url))('playwright-core');
const doi = process.argv.slice(2);
const lay = (k) => { const i = doi.indexOf(k); return i >= 0 ? doi[i + 1] : null; };
const [trang, giay, ra] = doi.filter((a, i) => !a.startsWith('--') && !['--an', '--he_so', '--cat', '--nen'].includes(doi[i - 1]));
const lietKe = doi.includes('--liet_ke'), anChu = doi.includes('--an_chu');
const an = (lay('--an') || '').split(',').map((s) => s.trim()).filter(Boolean);
const heSo = Number(lay('--he_so') || 2);
const nenPhang = lay('--nen'); // màu nền phẳng thay nền của trang (lưới ô, vệt sáng), dùng cùng --an để ẩn lớp nền vẽ bằng SVG
const cat = lay('--cat') ? lay('--cat').split(',').map(Number) : null; // vùng giữ lại x,y,w,h trên khung 1920×1080
if (!trang || giay == null || (!ra && !lietKe)) { console.error('Cần: node lay_hinh.mjs <trang.html> <giây> <ảnh ra.png> [--an ...] [--an_chu] | --liet_ke'); process.exit(1); }

const browser = await chromium.launch({ headless: true, args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none', '--allow-file-access-from-files'] });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: lietKe ? 1 : heSo })).newPage();
page.on('pageerror', (e) => console.log('lỗi trang:', e.message));
await page.goto(pathToFileURL(path.resolve(trang)).href + '?t=' + Number(giay), { waitUntil: 'load' });
for (let k = 0; k < 300; k++) { if (await page.evaluate(() => window.__san_sang !== false)) break; await page.waitForTimeout(100); }
await page.evaluate(() => document.fonts.ready);
await page.evaluate((t) => window.seek(t), Number(giay));
await page.waitForTimeout(80);

if (lietKe) {
  // cây phần tử nhìn thấy tới độ sâu 4: thẻ, id, lớp, hộp bao (toạ độ 1920×1080), chữ đầu
  const ds = await page.evaluate(() => {
    const kq = [];
    const di = (e, sau) => {
      if (sau > 4) return;
      for (const c of e.children) {
        const r = c.getBoundingClientRect(), cs = getComputedStyle(c);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) continue;
        if (!r.width || !r.height) { di(c, sau + 1); continue; } // lớp bọc cỡ 0 chứa phần tử định vị tuyệt đối
        const chu = (c.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40);
        const lop = typeof c.className === 'string' ? c.className : c.className?.baseVal || '';
        kq.push(`${'  '.repeat(sau)}${c.tagName.toLowerCase()}${c.id ? '#' + c.id : ''}${lop ? '.' + lop.trim().split(/\s+/).join('.') : ''} [${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}×${Math.round(r.height)}]${chu ? ' «' + chu + '»' : ''}`);
        di(c, sau + 1);
      }
    };
    di(document.body, 0);
    return kq;
  });
  console.log(ds.join('\n'));
} else {
  await page.evaluate(({ an, anChu, nenPhang }) => {
    for (const s of an) for (const e of document.querySelectorAll(s)) e.setAttribute('data-an-tn', '');
    if (anChu) {
      // ẩn cả thẻ nhãn chứa chữ (khung, nền viên thuốc) chứ không chỉ chữ.
      // Chữ SVG: đi ngược lên các nhóm chỉ chứa đúng chữ đó và rộng không quá 4 lần hộp chữ, nên vật vẽ lớn có chữ bên trong
      // (biển "NGÂN HÀNG" trên toà nhà) chỉ mất chữ. Chữ HTML (thẻ, bảng ghi chú phủ trên cảnh): đi ngược lên các khối
      // không chứa SVG và nhỏ hơn 15% khung hình.
      const dt = (e) => { const r = e.getBoundingClientRect(); return r.width * r.height; };
      const KHUNG = innerWidth * innerHeight;
      const dung = (e) => !e || e === document.body || ['svg', 'body'].includes(e.tagName.toLowerCase());
      for (const e of [...document.querySelectorAll('svg text')]) {
        const chu = e.textContent.trim(), a = dt(e);
        let x = e;
        while (!dung(x.parentElement) && x.parentElement.textContent.trim() === chu && dt(x.parentElement) <= 4 * a) x = x.parentElement;
        x.setAttribute('data-an-tn', '');
      }
      for (const e of [...document.querySelectorAll('body *')]) {
        if (e.closest('svg') || ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        let x = e;
        while (!dung(x.parentElement) && !x.parentElement.querySelector('svg') && dt(x.parentElement) <= 0.15 * KHUNG) x = x.parentElement;
        x.setAttribute('data-an-tn', '');
      }
    }
    // ẩn bằng bảng kiểu có !important chứ không đặt thẳng lên phần tử: nhiều trang tự gán lại style.opacity mỗi khung hình
    const st = document.createElement('style');
    st.textContent = '[data-an-tn] { opacity: 0 !important; }' + (nenPhang ? `html, body, #stage { background: ${nenPhang} !important; }` : '');
    document.head.appendChild(st);
  }, { an, anChu, nenPhang });
  await page.waitForTimeout(80);
  fs.mkdirSync(path.dirname(path.resolve(ra)), { recursive: true });
  await page.screenshot({ path: ra, ...(cat && { clip: { x: cat[0], y: cat[1], width: cat[2], height: cat[3] } }) });
  const [w, h] = cat ? [cat[2], cat[3]] : [1920, 1080];
  console.log(`Hình vẽ: ${ra} · ${w * heSo}×${h * heSo} · giây ${giay}`);
}
await browser.close();
