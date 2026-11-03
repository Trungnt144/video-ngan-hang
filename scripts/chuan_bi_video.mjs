/**
 * chuan_bi_video.mjs — nối kịch bản với giọng đọc thành dữ liệu cho Remotion (video dọc, `xuong/`).
 *
 * Chạy ba bước, bước giữa là sinh giọng đọc:
 *
 *   1) node scripts/chuan_bi_video.mjs loi_doc <ten>
 *        <kb>/<ten>.canh.json  ->  <kb>/<ten>.loi_doc.txt  (lời đọc thuần, để đọc và đối chiếu)
 *                              +  <kb>/<ten>.chuong.json   (cho VieNeu, mỗi cảnh một chương)
 *        <kb> = san_pham/<thư mục video>/tai_nguyen/kich_ban, script tự tìm theo <ten>
 *
 *   2) Sinh giọng VieNeu Hải Đăng, miễn phí, chạy trên máy (từ 27/10/2026 là giọng duy nhất, đã bỏ ElevenLabs):
 *         .venv_vieneu/bin/python scripts/sinh_giong_vieneu.py \
 *             --kich-ban <kb>/<ten>.chuong.json --ra tai_san/giong_doc/<ten>_vieneu
 *         -> c<so cảnh>.wav + c<so cảnh>.moc_cau.json (mốc từng CÂU)
 *
 *   3) node scripts/chuan_bi_video.mjs gop <ten>
 *        canh.json + mốc câu  ->  xuong/public/du_lieu_video.json + xuong/public/giong_doc.mp3
 *        Phụ đề hiện chia cụm theo câu. Phụ đề chạy từng chữ cần mốc từng từ bằng Whisper
 *        (`moc_tu.json`, `scripts/moc_tung_tu.py`); lệnh `gop` chưa đọc file này (việc còn mở trong so_no_cong_viec.md).
 *
 * Vì sao tách ba bước thay vì một lệnh: bước 2 tốn vài phút máy (VieNeu), nên phải cố ý gọi.
 * Sửa hình mà không sửa chữ thì chỉ chạy lại bước 3.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const GOC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// PowerShell 5.1 ghi file UTF-8 KÈM dấu BOM ở đầu, còn JSON.parse của Node thì
// coi dấu đó là ký tự lạ và ném lỗi khó hiểu ("Unexpected token"). Cắt bỏ ngay
// ở chỗ đọc — mọi file đi qua tay PowerShell đều dính. Đã vấp 28/07/2026.
const doc = (p) => fs.readFileSync(p, "utf8").replace(/^﻿/, "");
const ghi = (p, n) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, n, "utf8");
};

const [, , buoc, ten] = process.argv;
if (!buoc || !ten) {
  console.error("Dùng: node scripts/chuan_bi_video.mjs <loi_doc|gop> <ten>");
  process.exit(1);
}

// Kịch bản nằm trong thư mục video san_pham/<thư mục video>/tai_nguyen/kich_ban/ (AGENTS.md mục Quy ước
// sản phẩm, 27/10/2026). Tìm theo tên; không thấy thì dùng kich_ban/ ở gốc (chỗ cũ trước ngày đó).
function timThuMucKichBan() {
  const sp = path.join(GOC, "san_pham");
  const thay = fs
    .readdirSync(sp, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(sp, d.name, "tai_nguyen", "kich_ban"))
    .filter((d) => fs.existsSync(path.join(d, `${ten}.canh.json`)));
  if (thay.length > 1) throw new Error(`Có ${thay.length} thư mục video cùng chứa ${ten}.canh.json:\n  ${thay.join("\n  ")}`);
  return thay[0] ?? path.join(GOC, "kich_ban");
}
const thuMucKichBan = timThuMucKichBan();
const fileCanh = path.join(thuMucKichBan, `${ten}.canh.json`);
const fileLoiDoc = path.join(thuMucKichBan, `${ten}.loi_doc.txt`);
const fileChuong = path.join(thuMucKichBan, `${ten}.chuong.json`);
const thuMucVieneu = path.join(GOC, "tai_san", "giong_doc", `${ten}_vieneu`);
const thuMucCong = path.join(GOC, "xuong", "public");
// ffmpeg đi kèm Remotion — máy không cài ffmpeg riêng
const FF = path.join(GOC, "xuong", "node_modules", "@remotion", "compositor-darwin-arm64");

const kichBan = JSON.parse(doc(fileCanh));

// ---------------------------------------------------------------------------
// Bước 1 — sinh file lời đọc thuần để đưa cho máy đọc
// ---------------------------------------------------------------------------
// Quy tắc ở `08_giong_am_thanh_phu_de.md` mục 4: bản chữ và bản đọc tách riêng.
// Bản đọc bỏ hết dấu nhấn và ghi chú; số phải viết ra chữ NGAY TỪ trong
// canh.json (máy đọc "96%" hay sai), nên ở đây không tự chuyển đổi gì —
// chỉ nối các đoạn lại.
if (buoc === "loi_doc") {
  const doan = kichBan.canh.flatMap((c) => c.loi_doc);
  ghi(fileLoiDoc, doan.join("\n\n") + "\n");
  // VieNeu đọc từng chương thành một file tiếng riêng. Mỗi cảnh một chương thì
  // ranh giới cảnh rơi đúng chỗ ngắt file, không phải dò trong mốc câu — cảnh có
  // thể kết thúc giữa câu (ví dụ "hỏi thêm một câu:" rồi sang cảnh sau).
  ghi(fileChuong, JSON.stringify(kichBan.canh.map((c) => ({ id: c.so, doc: c.loi_doc.join(" ") })), null, 1) + "\n");
  const soKyTu = doan.join("\n\n").length;
  console.log(`Đã ghi ${fileLoiDoc}`);
  console.log(`Đã ghi ${fileChuong}`);
  console.log(`${kichBan.canh.length} cảnh · ${soKyTu} ký tự · ước ${Math.round(soKyTu / 20)} giây`);
  process.exit(0);
}

if (buoc !== "gop") {
  console.error(`Không hiểu bước "${buoc}". Chỉ nhận: loi_doc, gop`);
  process.exit(1);
}

const coVieneu = kichBan.canh.every((c) => fs.existsSync(path.join(thuMucVieneu, `c${c.so}.moc_cau.json`)));
const giong = "vieneu";
if (!coVieneu) {
  throw new Error(
    `${thuMucVieneu} chưa đủ c<số cảnh>.moc_cau.json cho mọi cảnh. Sinh giọng:\n` +
      `  .venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban ${path.relative(GOC, fileChuong)} --ra tai_san/giong_doc/${ten}_vieneu`,
  );
}

// Thẻ D-01 đo được: cụm 3-4 từ, đổi cụm mỗi 0,4-0,6 giây (nhịp của MẪU gốc).
// Trung xem bản nháp và báo tốc độ này nhanh hơn tốc độ đọc chữ của mình,
// yêu cầu tăng gấp đôi thời gian hiện mỗi cụm — đây là nơi CỐ Ý lệch khỏi
// nhịp thẻ D-01 để hợp với Trung, không phải sai số. Ghi ngày 28/07/2026 (khuya).
const CUM_TOI_DA = 6;

// ---------------------------------------------------------------------------
// Bước 3 — mốc từng câu, phụ đề chia cụm theo câu
// ---------------------------------------------------------------------------
// Cùng hệ số với mọi video ngang dùng Hải Đăng (Trung chốt 26/10/2026 sau khi
// nghe mẫu 1,2 / 1,3 / 1,4 ở tai_san/giong_doc/mau_toc_do_hai_dang_2026.10.26/).
// VieNeu không có tham số tốc độ, nên tăng tốc bằng ffmpeg atempo (giữ cao độ)
// rồi chia mọi mốc cho hệ số này.
const TOC_DO = 1.2;
// Khoảng lặng chèn giữa hai cảnh. Giữa hai câu trong cùng cảnh VieNeu đã tự
// chèn khoang_nghi_cau_giay (0,25 giây trước khi tăng tốc).
const NGHI_CANH_GIAY = 0.4;

function tuVieneu() {
  let viTri = 0;
  const mocCanh = [];
  const cau = [];
  kichBan.canh.forEach((canh, i) => {
    const moc = JSON.parse(doc(path.join(thuMucVieneu, `c${canh.so}.moc_cau.json`)));
    if (moc.doc.trim() !== canh.loi_doc.join(" ").trim()) {
      throw new Error(
        `Lời đọc cảnh ${canh.so} trong canh.json đã khác bản VieNeu đã đọc. ` +
          `Chạy lại bước loi_doc rồi sinh lại giọng cho cảnh này (--chuong ${canh.so}).`,
      );
    }
    const dai = moc.giay / TOC_DO;
    mocCanh.push({ so: canh.so, bat_dau: viTri, ket_thuc: viTri + dai });
    for (const m of moc.cau) cau.push({ chu: m.cau, bat_dau: viTri + m.bd / TOC_DO, ket_thuc: viTri + m.kt / TOC_DO });
    viTri += dai + (i < kichBan.canh.length - 1 ? NGHI_CANH_GIAY : 0);
  });

  // Ghép tiếng các cảnh thành một file: tăng tốc từng file, đệm khoảng lặng
  // sau mỗi cảnh trừ cảnh cuối, rồi nối liền.
  const n = kichBan.canh.length;
  const vao = kichBan.canh.flatMap((c) => ["-i", path.join(thuMucVieneu, `c${c.so}.wav`)]);
  const loc =
    kichBan.canh.map((_, i) => `[${i}:a]atempo=${TOC_DO}${i < n - 1 ? `,apad=pad_dur=${NGHI_CANH_GIAY}` : ""}[a${i}]`).join(";") +
    ";" +
    kichBan.canh.map((_, i) => `[a${i}]`).join("") +
    `concat=n=${n}:v=0:a=1[ra]`;
  fs.mkdirSync(thuMucCong, { recursive: true });
  execFileSync(
    path.join(FF, "ffmpeg"),
    ["-v", "error", "-y", ...vao, "-filter_complex", loc, "-map", "[ra]", "-c:a", "libmp3lame", "-b:a", "128k",
      path.join(thuMucCong, "giong_doc.mp3")],
    { env: { ...process.env, DYLD_LIBRARY_PATH: FF }, stdio: "inherit" },
  );

  // Không có mốc từng từ, nên chia mỗi câu thành cụm tối đa CUM_TOI_DA từ, độ
  // dài các cụm chia đều (26 từ thành 5-5-5-6-5, không 6-6-6-6-2), thời gian
  // của câu chia cho các cụm theo số ký tự. Chữ trắng, không tô đỏ từ đang đọc:
  // vị trí từ đỏ chỉ ước được, lệch tiếng 0,2-0,5 giây sẽ lộ (Trung chọn 26/10/2026).
  const phuDe = [];
  for (const c of cau) {
    const tu = c.chu.split(/\s+/).filter(Boolean);
    const soCum = Math.ceil(tu.length / CUM_TOI_DA);
    const tong = tu.join("").length;
    let daQua = 0;
    for (let k = 0; k < soCum; k++) {
      const nhom = tu.slice(Math.round((k * tu.length) / soCum), Math.round(((k + 1) * tu.length) / soCum));
      const bd = c.bat_dau + ((c.ket_thuc - c.bat_dau) * daQua) / tong;
      daQua += nhom.join("").length;
      const kt = c.bat_dau + ((c.ket_thuc - c.bat_dau) * daQua) / tong;
      phuDe.push({ tu: nhom, moc_tu: [], bat_dau: bd, ket_thuc: kt });
    }
  }

  return { mocCanh, phuDe, thoiLuong: viTri, phuDeTheo: "cau" };
}

// ---------------------------------------------------------------------------
// Xuất
// ---------------------------------------------------------------------------
const { mocCanh, phuDe, thoiLuong, phuDeTheo } = tuVieneu();

// Cảnh cuối kéo dài tới hết tiếng để không bị hụt hình ở đuôi video
mocCanh[mocCanh.length - 1].ket_thuc = thoiLuong;

// Nối liền các cảnh: cảnh sau bắt đầu ngay khi cảnh trước dứt, tránh khe hở đen
for (let i = 0; i < mocCanh.length - 1; i++) {
  mocCanh[i].ket_thuc = mocCanh[i + 1].bat_dau;
}
mocCanh[0].bat_dau = 0;

const duLieu = {
  ten: kichBan.ten ?? ten,
  file_tieng: "giong_doc.mp3",
  giong,
  thoi_luong_giay: thoiLuong,
  dinh_danh: kichBan.dinh_danh ?? "",
  bo_mau: kichBan.bo_mau ?? "D-01",
  canh: kichBan.canh,
  moc_canh: mocCanh.map(({ so, bat_dau, ket_thuc }) => ({ so, bat_dau, ket_thuc })),
  phu_de_theo: phuDeTheo,
  phu_de: phuDe,
};

ghi(path.join(thuMucCong, "du_lieu_video.json"), JSON.stringify(duLieu, null, 2));

console.log(`Đã ghi xuong/public/du_lieu_video.json + giong_doc.mp3 (giọng ${giong}, tăng tốc ${TOC_DO} lần)`);
console.log(`Thời lượng : ${thoiLuong.toFixed(2)} giây (${Math.ceil(thoiLuong * 30)} khung ở 30 hình/giây)`);
console.log(`Phụ đề     : ${phuDe.length} cụm theo ${phuDeTheo === "cau" ? "câu" : "từ"}, trung bình ${(thoiLuong / phuDe.length).toFixed(2)} giây/cụm`);
console.log("");
console.log("Thời lượng từng cảnh:");
for (const m of duLieu.moc_canh) {
  const c = kichBan.canh.find((x) => x.so === m.so);
  const dai = (m.ket_thuc - m.bat_dau).toFixed(1);
  console.log(`  C${m.so} ${String(c.loai).padEnd(11)} ${String(dai).padStart(5)}s  ${c.tieu_de.slice(0, 44)}`);
}
