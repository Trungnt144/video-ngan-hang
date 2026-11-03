// chup_html.mjs — chụp một danh sách khung của trang HTML dựng video (LM-03) thành ảnh jpeg đặt tên theo số khung.
// Trình chạy pha máy (pha_may.mjs) dùng để kết xuất từng chương, chụp khung mẫu so bộ đệm chương và thay khung
// nghi hỏng. Dùng lại đồng hồ ảo của xuong_html/cong_cu/xuat_mp4.mjs; khác ở chỗ NHẢY THẲNG tới khung đầu mỗi đoạn
// (đẩy đồng hồ ảo tới giây đó rồi gọi window.seek(t)) thay vì chạy lần lượt từ giây 0, nên trang phải đúng hợp
// đồng trang (skills/dung-video-html/tham_chieu/hop_dong_trang.md, mục 2: seek(t) không phụ thuộc khung trước).
//
// Chạy qua hàng đợi kết xuất (chỗ dài cho chương, --nhanh cho vài khung lẻ):
//   node scripts/pha_may/chup_html.mjs <trang.html> <thư mục ra> <mẫu tên> --fps 30 --kich-thuoc 1920x1080
//        [--song-song 3] <khung hoặc đoạn a-b> [...]
//   mẫu tên kiểu printf một số nguyên, ví dụ element-%04d.jpeg; jpeg chất lượng 95.
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const GOC = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const CONG_CU = path.join(GOC, "xuong_html/cong_cu");
const { chromium } = createRequire(path.join(CONG_CU, "package.json"))("playwright-core");
const { chenDongHoAo } = await import(pathToFileURL(path.join(CONG_CU, "xuat_mp4.mjs")).href);

const vao = process.argv.slice(2);
const tuyChon = { fps: "30", "kich-thuoc": "1920x1080", "song-song": "3" };
const vitri = [];
for (let i = 0; i < vao.length; i++) {
  if (vao[i].startsWith("--")) tuyChon[vao[i].slice(2)] = vao[++i];
  else vitri.push(vao[i]);
}
const [trang, thuMucRa, mau, ...dsKhung] = vitri;
if (!trang || !thuMucRa || !mau || !dsKhung.length) {
  console.error("Cách dùng: node chup_html.mjs <trang.html> <thư mục ra> <mẫu tên> --fps 30 --kich-thuoc 1920x1080 [--song-song 3] <khung|a-b> ...");
  process.exit(2);
}
const fps = Number(tuyChon.fps);
const [rong, cao] = tuyChon["kich-thuoc"].split(/[xX×]/).map(Number);
const khung = [...new Set(dsKhung.flatMap((s) => {
  const [a, b] = s.split("-").map(Number);
  return b === undefined ? [a] : Array.from({ length: b - a + 1 }, (_, i) => a + i);
}))].sort((x, y) => x - y);
const tenFile = (k) => mau.replace(/%0?(\d*)d/, (_, n) => String(k).padStart(+n || 0, "0"));
fs.mkdirSync(thuMucRa, { recursive: true });

// Chia đều danh sách khung cho các trang chạy song song, mỗi trang một khúc liền.
const soTrang = Math.max(1, Math.min(Number(tuyChon["song-song"]) || 1, khung.length));
const khuc = Array.from({ length: soTrang }, (_, k) => khung.slice(Math.floor((khung.length * k) / soTrang), Math.floor((khung.length * (k + 1)) / soTrang)));

const browser = await chromium.launch({
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none", "--disable-frame-rate-limit"],
});
let xong = 0;
try {
  await Promise.all(khuc.map(async (ds, k) => {
    const ctx = await browser.newContext({ viewport: { width: rong, height: cao }, deviceScaleFactor: 1 });
    await ctx.addInitScript(chenDongHoAo, { seed: 1, epoch: Date.UTC(2026, 0, 1) });
    const page = await ctx.newPage();
    let hong = null;
    page.on("crash", () => { hong = new Error("trang bị crash"); });
    page.on("pageerror", (e) => console.error(`[trang ${k}] pageerror: ${e.message}`));
    await page.goto(pathToFileURL(path.resolve(trang)).href, { waitUntil: "load" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
    });
    let sanSang = false;
    for (let lan = 0; lan < 600 && !sanSang; lan++) {
      sanSang = await page.evaluate(() => window.__san_sang !== false);
      if (!sanSang) await new Promise((r) => setTimeout(r, 50));
    }
    if (!sanSang) throw new Error("trang chưa đặt window.__san_sang = true sau 30 giây");
    if (!(await page.evaluate(() => typeof window.seek === "function"))) throw new Error("trang không có window.seek(t) (hợp đồng trang mục 2)");
    const cdp = await ctx.newCDPSession(page);
    for (const i of ds) {
      if (hong) throw hong;
      // Đẩy đồng hồ ảo (timer, rAF, hoạt ảnh CSS theo giờ ảo) rồi gọi seek(t) để trang đứng đúng giây t
      // dù vòng rAF của trang tính t theo mốc khác.
      await page.evaluate(([ms, t]) => { window.__vt.buoc(ms); window.seek(t); }, [(i * 1000) / fps, i / fps]);
      const r = await cdp.send("Page.captureScreenshot", { format: "jpeg", quality: 95, optimizeForSpeed: true });
      fs.writeFileSync(path.join(thuMucRa, tenFile(i)), Buffer.from(r.data, "base64"));
      if (++xong % 300 === 0) console.log(`khung ${xong}/${khung.length}`);
    }
    await ctx.close();
  }));
} finally {
  await browser.close().catch(() => {});
}
console.log(`xong ${khung.length} khung`);
