// ve_khung.mjs — kết xuất một danh sách khung lẻ của một dự án Remotion trong MỘT lần đóng gói.
// Trình chạy pha máy (pha_may.mjs) dùng để chụp khung mẫu so bộ đệm chương và để thay khung hỏng WebGL
// (90_bai_hoc.md; sổ theo dõi lô điện gió, bài học 17). Cấu hình giống remotion.config.ts của mọi dự án:
// Chrome của máy, WebGL bằng "angle", ảnh jpeg.
//
// Chạy qua hàng đợi, chỗ dài (đóng gói dự án mất 20–80 giây nên không hợp chỗ nhanh, đo 28/10/2026):
//   node scripts/pha_may/ve_khung.mjs <thư mục dự án> <composition> <thư mục ra> <mẫu tên> <khung> [<khung> ...]
//   mẫu tên kiểu printf một số nguyên, ví dụ element-%04d.jpeg; chất lượng jpeg 95.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";

const [duAn, compId, thuMucRa, mau, ...dsKhung] = process.argv.slice(2);
if (!duAn || !compId || !thuMucRa || !mau || dsKhung.length === 0) {
  console.error("Cách dùng: node ve_khung.mjs <dự án> <composition> <thư mục ra> <mẫu tên> <khung> ...");
  process.exit(2);
}
const yeuCau = createRequire(path.join(path.resolve(duAn), "package.json"));
const { bundle } = yeuCau("@remotion/bundler");
const { renderStill, selectComposition } = yeuCau("@remotion/renderer");

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const chromiumOptions = { gl: "angle" };
const tenFile = (k) => mau.replace(/%0?(\d*)d/, (_, n) => String(k).padStart(+n || 0, "0"));

fs.mkdirSync(thuMucRa, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.join(path.resolve(duAn), "src/index.ts") });
const composition = await selectComposition({ serveUrl, id: compId, chromiumOptions, browserExecutable: CHROME });
for (const k of dsKhung.map(Number)) {
  await renderStill({
    serveUrl, composition, frame: k, output: path.join(thuMucRa, tenFile(k)),
    imageFormat: "jpeg", jpegQuality: 95, chromiumOptions, browserExecutable: CHROME,
  });
  console.log("xong", k);
}
