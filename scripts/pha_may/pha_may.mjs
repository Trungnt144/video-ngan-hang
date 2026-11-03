#!/usr/bin/env node
// pha_may.mjs — trình chạy pha máy của luồng ba pha AI → máy → AI (sổ nợ N58, Trung chốt 28/10/2026).
//
// Pha 1 (AI) viết mã dựng, duyệt ảnh tĩnh rồi ghi PHIẾU VIỆC MÁY cho từng video. Pha 2 là file này: đọc
// phiếu, làm mọi việc máy tự làm được, không gọi AI: kết xuất đủ một lần theo chương (có bộ đệm chương),
// kết xuất tiếng, mã hoá, quét và thay khung hỏng WebGL, ghép tiếng, đo độ to, đo đứng hình, cắt bảng ảnh
// soát, viết báo cáo. Pha 3 (AI) đọc báo cáo, sửa chương lỗi, ghi lại phiếu với --chuong-sua rồi chạy lại.
// Hướng dẫn đầy đủ: scripts/pha_may/HUONG_DAN.md. Nhận dự án Remotion ngang (LM-02) có src/thoi_gian.json và dự án
// HTML một trang (LM-03) có nhip.json; dự án HTML chụp khung bằng chup_html.mjs và trộn giọng, nhạc bằng ffmpeg.
//
//   node scripts/pha_may/pha_may.mjs tao <mã> <thư mục dự án> [--san-pham <thư mục>] [--composition <id>]
//                                       [--trang trang.html] [--chuong-sua 3,5] [--ghi-chu "..."]
//   node scripts/pha_may/pha_may.mjs chay [--chi <mã>] [--song-song 2] [--khong-bao]
//   node scripts/pha_may/pha_may.mjs xem
//   node scripts/pha_may/pha_may.mjs don <mã> --chac      (chuyển bộ đệm vào Thùng rác, chỉ sau khi Trung duyệt)
import { spawn, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const GOC = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const DU_LIEU = path.join(GOC, "du_lieu/pha_may");
const THU_MUC_PHIEU = path.join(DU_LIEU, "phieu");
const THU_MUC_BAO_CAO = path.join(DU_LIEU, "bao_cao");
const THU_MUC_NHAT_KY = path.join(DU_LIEU, "nhat_ky");
const TEP_KHOA = path.join(DU_LIEU, "dang_chay.json");
const HANG_DOI = path.join(GOC, "scripts/hang_doi_ket_xuat.sh");
const VE_KHUNG = path.join(GOC, "scripts/pha_may/ve_khung.mjs");
const CHUP_HTML = path.join(GOC, "scripts/pha_may/chup_html.mjs");
const SO_KHUNG = path.join(GOC, "scripts/pha_may/so_khung.py");
const PYTHON = path.join(GOC, ".venv_vieneu/bin/python");
const FFMPEG = path.join(GOC, "xuong_thu_hyperframes/bin/ffmpeg"); // bản đủ bộ lọc (ebur128, freezedetect)
const FFPROBE = path.join(GOC, "xuong_thu_hyperframes/bin/ffprobe");
const BAO_TELEGRAM = path.join(GOC, "../Su dung grok/scripts/bao_telegram.sh");
const THU_MUC_AM_THANH = new Set(["giong", "giong_goc", "nhac"]);

const NGUONG_DIEM_LECH = 200;   // khung mẫu lệch quá số điểm ảnh này thì chương coi như đã đổi
const VIEN_CHUONG = 15;         // chương đổi thì kết xuất lại thêm 15 khung mỗi bên (chuyển cảnh, phụ đề vắt qua)
const SO_VONG_THAY_KHUNG = 3;
const DUNG_HINH_TOI_DA = 1.0;   // giây đứng hình cho mỗi 30 giây video (thanh chất lượng module 07 mục 9)
const DO_TO_DICH = -14;         // LUFS tích hợp, đỉnh thật -2 dBTP (module 07 mục 9); Trung chốt 28/10/2026 tự chỉnh cho video mới
const DINH_DICH = -2;

process.stdout.on("error", (e) => { if (e.code === "EPIPE") process.exit(0); }); // đầu ra nối vào head rồi bị đóng
// Ứng dụng mở từ Finder hoặc từ bảng video không nạp hồ sơ dòng lệnh
process.env.PATH = [path.join(os.homedir(), ".local/bin"), "/opt/homebrew/bin", "/usr/local/bin", process.env.PATH].join(":");

// ---------- tiện ích ----------

// Giờ máy (giờ Việt Nam), dạng 2026-10-28 08:03:04: báo cáo cho người đọc, sắp xếp theo chữ vẫn đúng thứ tự.
const bayGio = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 60e3).toISOString().slice(0, 19).replace("T", " "); };
const docJson = (tep, macDinh) => { try { return JSON.parse(fs.readFileSync(tep, "utf8")); } catch { return macDinh; } };
function ghiJson(tep, duLieu) {
  fs.mkdirSync(path.dirname(tep), { recursive: true });
  // File tạm riêng theo PID: hai trình chạy ghi cùng một file không giẫm file tạm của nhau.
  const tam = `${tep}.${process.pid}.tam`;
  fs.writeFileSync(tam, JSON.stringify(duLieu, null, 1));
  fs.renameSync(tam, tep);
}
const tepPhieu = (ma) => path.join(THU_MUC_PHIEU, ma + ".json");
const tuongDoi = (p) => path.relative(GOC, p);

function thamSo(ds) {
  const kq = { _: [] };
  for (let i = 0; i < ds.length; i++) {
    if (ds[i].startsWith("--")) {
      const ten = ds[i].slice(2);
      if (i + 1 < ds.length && !ds[i + 1].startsWith("--")) kq[ten] = ds[++i];
      else kq[ten] = true;
    } else kq._.push(ds[i]);
  }
  return kq;
}

// Chạy một lệnh, ghi đầu ra vào nhật ký của video, trả { ma, ra, loi }.
const tienTrinhCon = new Set(); // để tắt theo khi trình chạy bị dừng
// ffmpeg, ffprobe có thời hạn mặc định 60 phút: treo thì tắt và báo lỗi thay vì đứng im (n81, n72 đứng hơn 4 giờ
// ngày 29/10/2026). Lệnh khác (hàng đợi, Remotion) không đặt thời hạn ở đây.
const HAN_FFMPEG = 60 * 60 * 1000;
function chay(lenh, ts, { cwd = GOC, nhatKy, env, han = lenh === FFMPEG || lenh === FFPROBE ? HAN_FFMPEG : 0 } = {}) {
  return new Promise((xong) => {
    const ghi = nhatKy ? fs.createWriteStream(nhatKy, { flags: "a" }) : null;
    ghi?.write(`\n$ (${tuongDoi(cwd) || "."}) ${lenh} ${ts.join(" ")}\n`);
    const p = spawn(lenh, ts, { cwd, env: { ...process.env, ...env }, stdio: ["ignore", "pipe", "pipe"] });
    tienTrinhCon.add(p);
    let ra = "", loi = "";
    const hen = han ? setTimeout(() => { loi += `\nquá thời hạn ${Math.round(han / 60000)} phút, đã tắt tiến trình`; p.kill("SIGKILL"); }, han) : null;
    p.stdout.on("data", (b) => { ra += b; ghi?.write(b); });
    p.stderr.on("data", (b) => { loi += b; ghi?.write(b); });
    p.on("error", (e) => { loi += e.message; });
    p.on("close", (ma) => { clearTimeout(hen); tienTrinhCon.delete(p); ghi?.end(); xong({ ma: ma ?? 1, ra, loi }); });
  });
}

// Mọi lượt dùng Chrome (Remotion, trang HTML) đi qua hàng đợi chung (2 chỗ dài, 1 chỗ nhanh).
const quaHangDoi = (ma, lenh, o, nhanh) => chay("bash", [HANG_DOI, ...(nhanh ? ["--nhanh"] : []), ma, ...lenh], o);

function bamTep(bam, tep, goc) {
  bam.update(path.relative(goc, tep));
  bam.update(fs.readFileSync(tep));
}
function lietKeTep(thuMuc, boQua = () => false) {
  const kq = [];
  const di = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const p = path.join(d, e.name);
      if (boQua(p, e)) continue;
      if (e.isDirectory()) di(p); else kq.push(p);
    }
  };
  di(thuMuc);
  return kq;
}
const sha = (...phan) => { const h = crypto.createHash("sha256"); for (const x of phan) h.update(String(x)); return h.digest("hex").slice(0, 16); };

function thongBao(tieuDe, noiDung, guiTelegram) {
  spawnSync("osascript", ["-e", `display notification ${JSON.stringify(noiDung)} with title ${JSON.stringify(tieuDe)}`]);
  if (guiTelegram && fs.existsSync(BAO_TELEGRAM)) spawnSync("bash", [BAO_TELEGRAM, `${tieuDe}: ${noiDung}`], { timeout: 30e3 });
}

// ---------- dự án và bộ đệm chương ----------

function docDuAn(phieu) {
  if (phieu.loai === "html") return docDuAnHtml(phieu);
  const thuMuc = path.join(GOC, phieu.du_an);
  const tg = docJson(path.join(thuMuc, "src/thoi_gian.json"), null);
  if (!tg?.chuong?.length) throw new Error(`thiếu ${phieu.du_an}/src/thoi_gian.json hoặc file không có chương`);
  const fps = tg.fps || 30;
  const tong = tg.tong;
  // Dấu vân tay phần hình dùng chung: mã nguồn (trừ thoi_gian.json), cấu hình, tệp public không phải âm thanh,
  // cộng các số chung của thoi_gian.json. Phần riêng từng chương (lời, mốc) tính ở dấu vân tay chương.
  const bamMa = crypto.createHash("sha256");
  const tepMa = [
    ...lietKeTep(path.join(thuMuc, "src"), (p) => p.endsWith("thoi_gian.json")),
    ...["remotion.config.ts", "package.json"].map((t) => path.join(thuMuc, t)).filter((t) => fs.existsSync(t)),
    ...lietKeTep(path.join(thuMuc, "public"), (p, e) => e.isDirectory() && THU_MUC_AM_THANH.has(e.name)),
  ];
  for (const t of tepMa) bamTep(bamMa, t, thuMuc);
  bamMa.update(JSON.stringify({ fps, tong, toc_do: tg.toc_do, toc_canh: tg.toc_canh }));
  const hashMa = bamMa.digest("hex").slice(0, 16);
  const bamTieng = crypto.createHash("sha256");
  bamTieng.update(hashMa);
  bamTieng.update(JSON.stringify(tg));
  for (const d of THU_MUC_AM_THANH) for (const t of lietKeTep(path.join(thuMuc, "public", d))) bamTep(bamTieng, t, thuMuc);
  const chuong = tg.chuong.map((c) => ({
    id: String(c.id), ten: c.ten || "", bat_dau: c.bat_dau, dai: c.dai,
    hash_du_lieu: sha(JSON.stringify(c)),
  }));
  return { loai: "remotion", thuMuc, fps, tong, chuong, hashMa, hashTieng: bamTieng.digest("hex").slice(0, 16), dem: Math.max(4, String(tong - 1).length) };
}

// Dự án HTML (LM-03): một trang.html theo hợp đồng trang của skill dung-video-html, cộng nhip.json (thời lượng,
// fps, khổ, giọng, nhạc, chương). Quy cách: HUONG_DAN.md mục "Video HTML (LM-03)".
const DUOI_AM_THANH = /\.(wav|mp3|m4a|aac|flac|ogg)$/i;
const BO_QUA_HTML = new Set(["out", "ra", "xem_truoc", "node_modules", "am_thanh"]);

// Đường dẫn giọng, nhạc: tính từ thư mục dự án, không thấy thì từ gốc Media/ (chấp nhận tiền tố "Media/").
function timTep(thuMuc, p) {
  for (const t of [path.resolve(thuMuc, p), path.resolve(GOC, p), path.resolve(GOC, p.replace(/^Media\//, ""))]) if (fs.existsSync(t)) return t;
  throw new Error(`không thấy file âm thanh ${p} (tính từ ${tuongDoi(thuMuc)} hoặc gốc Media/)`);
}

function docDuAnHtml(phieu) {
  const thuMuc = path.join(GOC, phieu.du_an);
  const trang = path.join(thuMuc, phieu.trang || "trang.html");
  if (!fs.existsSync(trang)) throw new Error(`thiếu trang ${tuongDoi(trang)}`);
  const nhip = docJson(path.join(thuMuc, "nhip.json"), null);
  if (!nhip) throw new Error(`thiếu hoặc hỏng ${phieu.du_an}/nhip.json`);
  const giay = Number(nhip.thoi_luong_giay);
  if (!(giay > 0)) throw new Error("nhip.json thiếu thoi_luong_giay");
  const fps = Number(nhip.fps_cuoi) || 30;
  const [rong, cao] = String(nhip.kho || "1920x1080").split(/[xX×]/).map(Number);
  const tong = Math.round(giay * fps);
  // Chương: trường chuong, thiếu thì mỗi nhịp một chương. Dấu vân tay chương gồm cả các nhịp nằm trong chương.
  const dsNhip = Array.isArray(nhip.nhip) ? nhip.nhip : [];
  const nguon = nhip.chuong?.length ? nhip.chuong.map((c) => ({ ...c, id: String(c.id) })) : dsNhip.map((n, i) => ({ ...n, id: String(i + 1) }));
  if (!nguon.length) throw new Error("nhip.json không có chuong và không có nhip");
  const chuong = nguon.map((c) => {
    const a = Math.round(Number(c.t) * fps), b = Math.round(Number(c.den) * fps);
    const trong = nhip.chuong?.length ? dsNhip.filter((n) => n.t >= c.t && n.t < c.den) : [];
    return { id: c.id, ten: c.ten || "", bat_dau: a, dai: b - a, hash_du_lieu: sha(JSON.stringify(c), JSON.stringify(trong)) };
  }).sort((x, y) => x.bat_dau - y.bat_dau);
  let cuoi = 0;
  for (const c of chuong) {
    if (!(c.dai > 0) || c.bat_dau !== cuoi) throw new Error(`chương ${c.id} bắt đầu ở khung ${c.bat_dau}, cần ${cuoi}: các chương phải liền nhau từ giây 0, mỗi chương dài hơn 0`);
    cuoi = c.bat_dau + c.dai;
  }
  if (cuoi !== tong) throw new Error(`chương cuối kết thúc ở khung ${cuoi} (giây ${cuoi / fps}), cần ${tong} (thoi_luong_giay ${giay})`);
  const bamMa = crypto.createHash("sha256");
  const tepMa = lietKeTep(thuMuc, (p, e) => (e.isDirectory() ? BO_QUA_HTML.has(e.name) || e.name.startsWith(".")
    : e.name === "nhip.json" || e.name.startsWith(".") || /\.(mp4|md)$/i.test(e.name) || DUOI_AM_THANH.test(e.name)));
  for (const t of tepMa) bamTep(bamMa, t, thuMuc);
  bamMa.update(JSON.stringify({ fps, tong, rong, cao, trang: phieu.trang || "trang.html" }));
  // Tiếng: chỉ phụ thuộc file giọng, nhạc và tham số trộn, không phụ thuộc trang.
  const am = {
    giong: nhip.giong == null ? [] : (typeof nhip.giong === "string" ? [{ tep: nhip.giong, t: Number(nhip.giong_tre) || 0 }] : nhip.giong)
      .map((g) => ({ tep: timTep(thuMuc, g.tep), t: Number(g.t) || 0 })),
    nhac: nhip.nhac ? timTep(thuMuc, nhip.nhac) : null,
    nhac_db: nhip.nhac_db ?? -10, mo_dan: nhip.mo_dan ?? 2,
  };
  if (!am.giong.length && !am.nhac) throw new Error("nhip.json không có giong lẫn nhac (video không tiếng chưa nhận)");
  const bamTieng = crypto.createHash("sha256");
  bamTieng.update(JSON.stringify({ tong, fps, giong: am.giong.map((g) => [path.relative(GOC, g.tep), g.t]), nhac: am.nhac && path.relative(GOC, am.nhac), nhac_db: am.nhac_db, mo_dan: am.mo_dan }));
  for (const t of [...am.giong.map((g) => g.tep), am.nhac].filter(Boolean)) bamTieng.update(fs.readFileSync(t));
  return { loai: "html", thuMuc, trang, fps, tong, rong, cao, chuong, am, hashMa: bamMa.digest("hex").slice(0, 16), hashTieng: bamTieng.digest("hex").slice(0, 16), dem: Math.max(4, String(tong - 1).length) };
}

function timComposition(thuMuc) {
  const root = path.join(thuMuc, "src/Root.tsx");
  if (!fs.existsSync(root)) return [];
  return [...fs.readFileSync(root, "utf8").matchAll(/<Composition[^>]*\bid="([^"]+)"/g)].map((m) => m[1]);
}

// Gộp danh sách khung thành các đoạn liền [a, b].
function gopDoan(khung) {
  const ds = [...new Set(khung)].sort((a, b) => a - b);
  const doan = [];
  for (const k of ds) {
    const cuoi = doan[doan.length - 1];
    if (cuoi && k === cuoi[1] + 1) cuoi[1] = k; else doan.push([k, k]);
  }
  return doan;
}

// Trộn giọng và nhạc của dự án HTML thành tieng.wav đúng độ dài video. Cùng cách trộn với
// xuong_html/cong_cu/ghep_am_thanh.sh (nhạc lặp, hạ dB, mờ dần cuối, nén sidechain để nhạc nhỏ dưới giọng);
// khác ở chỗ nhận nhiều đoạn giọng đặt theo giây và để bước chuan_do_to chỉnh độ to như đường Remotion.
async function tronTiengHtml(da, ra, o, canhBao) {
  const D = da.tong / da.fps;
  const FMT = "aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo";
  const vao = [], loc = [];
  const doDai = async (t) => parseFloat((await chay(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", t], o)).ra);
  const giong = [];
  for (const g of da.am.giong) giong.push({ ...g, dai: await doDai(g.tep) });
  giong.sort((a, b) => a.t - b.t);
  giong.forEach((g, i) => {
    const ten = path.relative(da.thuMuc, g.tep);
    if (g.t + g.dai > D + 0.15) canhBao(`Giọng ${ten} (bắt đầu ${g.t} giây, dài ${g.dai.toFixed(2)} giây) vượt cuối video ${D.toFixed(2)} giây, phần dư bị cắt`);
    if (giong[i + 1] && g.t + g.dai > giong[i + 1].t + 0.05) canhBao(`Giọng ${ten} chưa đọc xong thì đoạn sau đã bắt đầu (${giong[i + 1].t} giây): hai câu đè lên nhau`);
    const ms = Math.round(g.t * 1000);
    vao.push("-i", g.tep);
    loc.push(`[${i}:a]${FMT},adelay=${ms}|${ms}[g${i}]`);
  });
  if (giong.length) {
    const nhom = giong.length === 1 ? "[g0]anull" : `${giong.map((_, i) => `[g${i}]`).join("")}amix=inputs=${giong.length}:duration=longest:normalize=0`;
    loc.push(`${nhom},apad=whole_dur=${D},atrim=0:${D},asetpts=PTS-STARTPTS[gv]`);
  }
  if (da.am.nhac) {
    const mo = Math.min(Number(da.am.mo_dan), D);
    // Không dùng `-stream_loop -1`: ffmpeg 6.0 ghi xong file nhưng không thoát khi nhạc chạm hết file đúng lúc
    // tiếng ra đủ độ dài (nhạc dài bằng video, n81 và n72 ngày 29/10/2026). Nhạc ngắn hơn video thì nạp lại
    // file nhiều lần rồi nối bằng concat.
    const daiNhac = await doDai(da.am.nhac);
    const soLan = daiNhac > 0 ? Math.min(50, Math.max(1, Math.ceil(D / daiNhac))) : 1;
    for (let k = 0; k < soLan; k++) vao.push("-i", da.am.nhac);
    const nhan = Array.from({ length: soLan }, (_, k) => `[${giong.length + k}:a]`).join("");
    loc.push(`${nhan}${soLan > 1 ? `concat=n=${soLan}:v=0:a=1,` : ""}${FMT},atrim=0:${D},asetpts=PTS-STARTPTS,volume=${da.am.nhac_db}dB,afade=t=out:st=${D - mo}:d=${mo}[nh]`);
  }
  if (giong.length && da.am.nhac) loc.push("[gv]asplit=2[v1][v2];[nh][v2]sidechaincompress=threshold=0.02:ratio=8:attack=20:release=500[nd];[v1][nd]amix=inputs=2:duration=longest:normalize=0[mix]");
  else loc.push(`${giong.length ? "[gv]" : "[nh]"}anull[mix]`);
  const r = await chay(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", ...vao, "-filter_complex", loc.join(";"),
    "-map", "[mix]", "-t", String(D), "-c:a", "pcm_s16le", "-ar", "48000", ra], { ...o, han: 10 * 60 * 1000 });
  if (r.ma !== 0) throw new Error("trộn giọng và nhạc lỗi: " + r.loi.slice(-400));
}

// ---------- các bước của một phiếu ----------

async function chayMotPhieu(ma) {
  const phieu = docJson(tepPhieu(ma));
  const nhatKy = path.join(THU_MUC_NHAT_KY, ma + ".log");
  fs.mkdirSync(THU_MUC_NHAT_KY, { recursive: true });
  const batDauPhieu = Date.now();
  phieu.trang_thai = "dang_chay";
  phieu.buoc = [];
  phieu.ket_qua = { canh_bao: [] };
  phieu.lan_chay_luc = bayGio();
  const luu = () => { phieu.cap_nhat_luc = bayGio(); ghiJson(tepPhieu(ma), phieu); };
  luu();
  const kq = phieu.ket_qua;
  const canhBao = (s) => { kq.canh_bao.push(s); };
  async function buoc(ten, viec) {
    const b = { ten, bat_dau: bayGio() };
    phieu.buoc.push(b);
    luu();
    const t0 = Date.now();
    try {
      b.ghi_chu = (await viec()) || "";
      b.trang_thai = "xong";
    } catch (e) {
      b.trang_thai = "loi";
      b.ghi_chu = e.message.slice(0, 600);
      throw e;
    } finally {
      b.giay = Math.round((Date.now() - t0) / 1000);
      luu();
    }
  }

  try {
    const da = docDuAn(phieu);
    const cwd = da.thuMuc;
    const ra = path.join(cwd, "out/pha_may");
    const seq = path.join(ra, "seq");
    const tenKhung = (k) => `element-${String(k).padStart(da.dem, "0")}.jpeg`;
    const mauGoc = path.join(ra, "mau_goc");
    const tenMau = (k) => `mau-${String(k).padStart(da.dem, "0")}.jpeg`;
    const khungMau = (c) => [c.bat_dau + Math.floor(c.dai * 0.3), c.bat_dau + Math.floor(c.dai * 0.75)];
    const tepBoDem = path.join(ra, "bo_dem.json");
    let boDem = docJson(tepBoDem, null);
    const cauHinh = { fps: da.fps, tong: da.tong, dem: da.dem, jpeg: 95 };
    if (!boDem || JSON.stringify(boDem.cau_hinh) !== JSON.stringify(cauHinh)) boDem = { cau_hinh: cauHinh, hash_tieng: null, chuong: {} };
    const luuBoDem = () => ghiJson(tepBoDem, boDem);
    const o = { cwd, nhatKy };
    let canKetXuat = [];
    const html = da.loai === "html";
    // Hai việc dùng Chrome khác nhau theo loại dự án: chụp vài khung lẻ, kết xuất một đoạn khung liền.
    // Khung lẻ của trang HTML mở trang trong vài giây nên đi chỗ nhanh; Remotion phải đóng gói dự án nên đi chỗ dài.
    const thamHtml = () => ["--fps", String(da.fps), "--kich-thuoc", `${da.rong}x${da.cao}`];
    const veKhung = (thuMucRa, mauTen, ks) => html
      ? quaHangDoi(ma, ["node", CHUP_HTML, da.trang, thuMucRa, mauTen, ...thamHtml(), "--song-song", "1", ...ks.map(String)], o, ks.length <= 60)
      : quaHangDoi(ma, ["node", VE_KHUNG, cwd, phieu.composition, thuMucRa, mauTen, ...ks.map(String)], o);
    const ketXuatDoan = (a, b, tam) => html
      ? quaHangDoi(ma, ["node", CHUP_HTML, da.trang, tam, `element-%0${da.dem}d.jpeg`, ...thamHtml(), "--song-song", "3", `${a}-${b}`], o)
      : quaHangDoi(ma, ["npx", "remotion", "render", "src/index.ts", phieu.composition, tam,
        "--sequence", "--image-format=jpeg", "--jpeg-quality=95", "--concurrency=3", "--timeout=180000", `--frames=${a}-${b}`], o);
    // ffmpeg, ffprobe cho script quét khung hỏng và cắt bảng soát: dự án HTML không có node_modules của Remotion.
    const thuMucFfmpeg = html ? path.dirname(FFMPEG) : path.join(cwd, "node_modules/@remotion/compositor-darwin-arm64");
    const tieng = path.join(ra, html ? "tieng.wav" : "tieng.aac");

    await buoc("xet_bo_dem", async () => {
      const coDu = (c) => { for (let k = c.bat_dau; k < c.bat_dau + c.dai; k++) if (!fs.existsSync(path.join(seq, tenKhung(k)))) return false; return true; };
      const cu = [], canSo = [];
      for (const c of da.chuong) {
        const b = boDem.chuong[c.id];
        if (!b || b.bat_dau !== c.bat_dau || b.dai !== c.dai || b.hash_du_lieu !== c.hash_du_lieu || !coDu(c)) canKetXuat.push(c);
        else if (b.hash_ma === da.hashMa) cu.push(c);
        else if (phieu.chuong_sua?.length) (phieu.chuong_sua.includes(c.id) ? canKetXuat : canSo).push(c);
        else canKetXuat.push(c); // mã đổi mà phiếu không ghi chương nào đã sửa: kết xuất lại hết cho chắc
      }
      // Chương không khai là đã sửa nhưng mã dùng chung đã đổi: chụp lại khung mẫu của chương bằng mã mới, so với
      // khung mẫu chụp lúc kết xuất chương (cùng cách chụp renderStill). Không so với khung trong chuỗi ảnh: đo
      // 28/10/2026 trên N49, khung tĩnh và khung kết xuất đủ cùng số, cùng mã vẫn lệch 123–4.146 điểm ảnh, còn hai
      // lần chụp khung tĩnh lệch 0.
      if (canSo.length) {
        const mau = path.join(ra, "mau");
        fs.rmSync(mau, { recursive: true, force: true });
        const coMau = canSo.filter((c) => khungMau(c).every((k) => fs.existsSync(path.join(mauGoc, tenMau(k)))));
        for (const c of canSo) if (!coMau.includes(c)) { canKetXuat.push(c); canhBao(`Chương ${c.id}: chưa có khung mẫu gốc để so, đã kết xuất lại`); }
        if (coMau.length) {
          const ks = coMau.flatMap(khungMau);
          const r = await veKhung(mau, `mau-%0${da.dem}d.jpeg`, ks);
          if (r.ma !== 0) throw new Error("chụp khung mẫu lỗi: " + r.loi.slice(-300));
          const s = await chay(PYTHON, [SO_KHUNG, ...ks.flatMap((k) => [path.join(mau, tenMau(k)), path.join(mauGoc, tenMau(k))])], o);
          const lech = new Map(s.ra.trim().split("\n").map((d) => { const [n, t] = d.split(" "); return [path.basename(t), +n]; }));
          for (const c of coMau) {
            const n = Math.max(...khungMau(c).map((k) => { const v = lech.get(tenMau(k)); return v === undefined || v < 0 ? Infinity : v; }));
            if (n > NGUONG_DIEM_LECH) { canKetXuat.push(c); canhBao(`Chương ${c.id} không khai là đã sửa nhưng khung mẫu lệch ${n === Infinity ? "(không so được)" : n + " điểm ảnh"}, đã kết xuất lại`); }
            else cu.push(c);
          }
        }
      }
      // Chương dùng lại sau khi so mẫu đạt: ghi nhận đã đúng với mã mới để lần sau khỏi so lại.
      for (const c of cu) boDem.chuong[c.id].hash_ma = da.hashMa;
      luuBoDem();
      canKetXuat.sort((a, b) => a.bat_dau - b.bat_dau);
      kq.chuong_ket_xuat = canKetXuat.map((c) => c.id);
      kq.chuong_dung_lai = cu.map((c) => c.id);
      return `kết xuất ${canKetXuat.length}/${da.chuong.length} chương, dùng lại ${cu.length}`;
    });

    await buoc("ket_xuat_hinh", async () => {
      fs.mkdirSync(seq, { recursive: true });
      // Video ngắn đi so với lần trước: bỏ ảnh thừa ở cuối để bước mã hoá không đọc lấn.
      for (const t of fs.readdirSync(seq)) { const k = parseInt(t.replace(/\D/g, ""), 10); if (k >= da.tong) fs.rmSync(path.join(seq, t)); }
      if (!canKetXuat.length) return "không chương nào phải kết xuất";
      boDem.video_cam_khop = false; // chuỗi ảnh sắp đổi: video_cam.mp4 cũ không còn khớp
      luuBoDem();
      const khung = canKetXuat.flatMap((c) => {
        const a = Math.max(0, c.bat_dau - (c.bat_dau > 0 ? VIEN_CHUONG : 0));
        const b = Math.min(da.tong - 1, c.bat_dau + c.dai - 1 + VIEN_CHUONG);
        return Array.from({ length: b - a + 1 }, (_, i) => a + i);
      });
      const doan = gopDoan(khung);
      let soKhung = 0;
      for (const [a, b] of doan) {
        const tam = path.join(ra, `seq_tam_${a}`);
        fs.rmSync(tam, { recursive: true, force: true });
        const r = await ketXuatDoan(a, b, tam);
        if (r.ma !== 0) throw new Error(`kết xuất khung ${a}-${b} lỗi: ` + r.loi.slice(-400));
        // Remotion đặt tên theo số khung; sắp theo tên rồi đặt lại tên theo số khung tuyệt đối cho chắc.
        const tep = fs.readdirSync(tam).filter((t) => t.endsWith(".jpeg")).sort();
        if (tep.length !== b - a + 1) throw new Error(`khung ${a}-${b}: ra ${tep.length} ảnh, cần ${b - a + 1}`);
        tep.forEach((t, i) => fs.renameSync(path.join(tam, t), path.join(seq, tenKhung(a + i))));
        fs.rmSync(tam, { recursive: true, force: true });
        soKhung += b - a + 1;
        for (const c of canKetXuat) if (c.bat_dau >= a && c.bat_dau + c.dai - 1 <= b) boDem.chuong[c.id] = { hash_du_lieu: c.hash_du_lieu, hash_ma: da.hashMa, bat_dau: c.bat_dau, dai: c.dai, luc: bayGio() };
        luuBoDem();
      }
      kq.so_khung_ket_xuat = soKhung;
      return `${soKhung} khung trong ${doan.length} đoạn`;
    });

    await buoc("khung_mau_goc", async () => {
      // Chương vừa kết xuất, hoặc chương cũ chưa có khung mẫu gốc: chụp 2 khung mẫu để lần sửa sau so được.
      const thieu = da.chuong.filter((c) => canKetXuat.includes(c) || !khungMau(c).every((k) => fs.existsSync(path.join(mauGoc, tenMau(k)))));
      if (!thieu.length) return "đủ khung mẫu gốc";
      const ks = thieu.flatMap(khungMau);
      const r = await veKhung(mauGoc, `mau-%0${da.dem}d.jpeg`, ks);
      if (r.ma !== 0) throw new Error("chụp khung mẫu gốc lỗi: " + r.loi.slice(-300));
      return `${ks.length} khung mẫu của ${thieu.length} chương`;
    });

    await buoc("ket_xuat_tieng", async () => {
      if (boDem.hash_tieng === da.hashTieng && fs.existsSync(tieng)) return "dùng lại tiếng cũ";
      if (html) {
        await tronTiengHtml(da, tieng, o, canhBao);
      } else {
        const r = await quaHangDoi(ma, ["npx", "remotion", "render", "src/index.ts", phieu.composition, tieng, "--codec=aac", "--timeout=180000"], o);
        if (r.ma !== 0) throw new Error("kết xuất tiếng lỗi: " + r.loi.slice(-400));
      }
      boDem.hash_tieng = da.hashTieng;
      luuBoDem();
      return html ? "đã trộn lại giọng và nhạc" : "đã kết xuất lại tiếng";
    });

    const tiengChuan = path.join(ra, "tieng_chuan.aac");
    await buoc("chuan_do_to", async () => {
      // Hai lượt loudnorm: lượt 1 đo, lượt 2 chỉnh theo số đo. Tiếng gốc của các video đã làm quanh -20 LUFS.
      const vao = tieng;
      if (boDem.hash_tieng_chuan === da.hashTieng && fs.existsSync(tiengChuan)) {
        kq.lufs_goc = boDem.lufs_goc;
        return "dùng lại tiếng đã chỉnh (tiếng không đổi)";
      }
      // Đặt đỉnh thấp hơn đích 1 dB: mã hoá AAC làm đỉnh thật nhích lên 0,3–0,5 dB (đo N62–N64 28/10/2026).
      const loc = `loudnorm=I=${DO_TO_DICH}:TP=${DINH_DICH - 1}:LRA=11`;
      const l1 = await chay(FFMPEG, ["-hide_banner", "-nostats", "-i", vao, "-af", loc + ":print_format=json", "-f", "null", "-"], o);
      const j = JSON.parse(l1.loi.slice(l1.loi.lastIndexOf("{"), l1.loi.lastIndexOf("}") + 1));
      const l2 = await chay(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-i", vao, "-af",
        `${loc}:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`,
        "-ar", "48000", "-c:a", "aac", "-b:a", "320k", tiengChuan], o);
      if (l2.ma !== 0) throw new Error("chỉnh độ to lỗi: " + l2.loi.slice(-300));
      kq.lufs_goc = parseFloat(j.input_i);
      boDem.hash_tieng_chuan = da.hashTieng;
      boDem.lufs_goc = kq.lufs_goc;
      luuBoDem();
      return `tiếng gốc ${j.input_i} LUFS, chỉnh về ${DO_TO_DICH} LUFS`;
    });

    const videoCam = path.join(ra, "video_cam.mp4");
    const maHoa = async () => {
      // Ảnh jpeg của Chrome là YCbCr BT.601 toàn dải: dự án HTML đổi sang BT.709 dải TV như xuat_mp4.mjs (hàm boLoc).
      const mau709 = html ? ["-vf", "scale=in_range=pc:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709:flags=bicubic,format=yuv420p",
        "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv"] : [];
      const r = await chay(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-framerate", String(da.fps),
        "-i", path.join(seq, `element-%0${da.dem}d.jpeg`), ...mau709, "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", videoCam], o);
      if (r.ma !== 0) throw new Error("mã hoá lỗi: " + r.loi.slice(-400));
      const p = await chay(FFPROBE, ["-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", videoCam], o);
      const n = parseInt(p.ra, 10);
      if (n !== da.tong) throw new Error(`video có ${n} khung, cần ${da.tong}`);
      return n;
    };
    await buoc("thay_khung_hong", async () => {
      // Quét thẳng chuỗi ảnh (không phải mã hoá trước mỗi vòng). quet_khung_hong.py thoát 1 khi có khung
      // nghi hỏng, nên xét dòng tổng kết thay cho mã thoát.
      const quet = async () => {
        const q = await chay(PYTHON, [path.join(GOC, "scripts/quet_khung_hong.py"), path.join(seq, `element-%0${da.dem}d.jpeg`), "--ffmpeg", thuMucFfmpeg], o);
        if (!/tổng khung nghi hỏng/.test(q.ra)) throw new Error("quét khung hỏng lỗi: " + (q.loi || q.ra).slice(-300));
        return [...q.ra.matchAll(/^khung nghi hỏng (\d+) \(giây/gm)].map((m) => +m[1]); // không khớp dòng "tổng khung nghi hỏng N"
      };
      // Chuỗi ảnh không đổi từ lần trước và lần trước quét sạch: khỏi quét lại.
      if (boDem.video_cam_khop && boDem.quet_sach && fs.existsSync(videoCam)) { kq.khung_hong_con_lai = 0; return "chuỗi ảnh không đổi, lần quét trước không có khung hỏng"; }
      let tongThay = 0;
      for (let vong = 1; vong <= SO_VONG_THAY_KHUNG; vong++) {
        const hong = await quet();
        if (vong === 1) kq.khung_hong_tim_thay = hong.length;
        if (!hong.length) { kq.khung_hong_con_lai = 0; boDem.quet_sach = true; luuBoDem(); return tongThay ? `đã thay ${tongThay} khung sau ${vong - 1} vòng` : "không có khung hỏng"; }
        // Khung hỏng hay đứng thành cụm liền (bài học 16): thay cả khung liền kề.
        const thay = [...new Set(hong.flatMap((k) => [k - 1, k, k + 1]).filter((k) => k >= 0 && k < da.tong))];
        const r = await veKhung(seq, `element-%0${da.dem}d.jpeg`, thay);
        if (r.ma !== 0) throw new Error("thay khung hỏng lỗi: " + r.loi.slice(-300));
        tongThay += thay.length;
        boDem.video_cam_khop = false;
        luuBoDem();
        if (vong === SO_VONG_THAY_KHUNG) {
          const con = await quet();
          kq.khung_hong_con_lai = con.length;
          boDem.quet_sach = !con.length;
          if (con.length) canhBao(`Còn ${con.length} khung nghi hỏng sau ${SO_VONG_THAY_KHUNG} vòng thay: ${con.slice(0, 12).join(", ")}`);
        }
      }
      kq.khung_hong_da_thay = tongThay;
      return `đã thay ${tongThay} khung`;
    });

    await buoc("ma_hoa", async () => {
      // Chuỗi ảnh không đổi từ lần mã hoá trước (không chương nào kết xuất, không thay khung) thì dùng lại video_cam.mp4.
      if (boDem.video_cam_khop && fs.existsSync(videoCam)) return "dùng lại video_cam.mp4 (chuỗi ảnh không đổi)";
      const n = await maHoa();
      boDem.video_cam_khop = true;
      luuBoDem();
      return `${n} khung`;
    });

    const tenDu = path.join(ra, `${ma}_du.mp4`);
    await buoc("ghep_tieng", async () => {
      const r = await chay(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-i", videoCam, "-i", tiengChuan,
        "-map", "0:v", "-map", "1:a", "-c", "copy", "-movflags", "+faststart", tenDu], o);
      if (r.ma !== 0) throw new Error("ghép tiếng lỗi: " + r.loi.slice(-400));
      const p = await chay(FFPROBE, ["-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", tenDu], o);
      if (parseInt(p.ra, 10) !== da.tong) throw new Error(`bản ghép có ${p.ra.trim()} khung, cần ${da.tong}`);
      const t = await chay(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", tenDu], o);
      kq.file_du = tuongDoi(tenDu);
      kq.thoi_luong = Math.round(parseFloat(t.ra) * 10) / 10;
      kq.so_khung = da.tong;
      return `${kq.thoi_luong} giây`;
    });

    await buoc("do_tieng_va_dung_hinh", async () => {
      const t = await chay(FFMPEG, ["-hide_banner", "-nostats", "-i", tenDu, "-af", "ebur128=peak=true", "-f", "null", "-"], o);
      const tomTat = t.loi.slice(t.loi.lastIndexOf("Summary:"));
      kq.lufs = parseFloat((tomTat.match(/I:\s+(-?[\d.]+) LUFS/) || [])[1]);
      kq.dinh_dbtp = parseFloat((tomTat.match(/True peak:\s+Peak:\s+(-?[\d.]+)/) || [])[1]);
      if (Math.abs(kq.lufs - DO_TO_DICH) > 1 || kq.dinh_dbtp > DINH_DICH) canhBao(`Độ to sau khi chỉnh ${kq.lufs} LUFS, đỉnh ${kq.dinh_dbtp} dBTP, lệch đích ${DO_TO_DICH} LUFS, ${DINH_DICH} dBTP`);
      const f = await chay(FFMPEG, ["-hide_banner", "-nostats", "-i", tenDu, "-vf", "fps=10,freezedetect=n=-60dB:d=0.5", "-map", "0:v", "-f", "null", "-"], o);
      const doan = [...f.loi.matchAll(/freeze_duration: ([\d.]+)/g)].map((m) => +m[1]);
      kq.dung_hinh = { so_doan: doan.length, tong_giay: Math.round(doan.reduce((a, b) => a + b, 0) * 10) / 10, dai_nhat: Math.max(0, ...doan) };
      const choPhep = DUNG_HINH_TOI_DA * (kq.thoi_luong || da.tong / da.fps) / 30;
      if (kq.dung_hinh.tong_giay > choPhep) canhBao(`Đứng hình ${kq.dung_hinh.tong_giay} giây (${doan.length} đoạn, dài nhất ${kq.dung_hinh.dai_nhat} giây), quá mức ${Math.round(choPhep * 10) / 10} giây`);
      return `${kq.lufs} LUFS, đỉnh ${kq.dinh_dbtp} dBTP; đứng hình ${kq.dung_hinh.tong_giay} giây`;
    });

    await buoc("bang_anh_soat", async () => {
      const soat = path.join(ra, "soat");
      fs.rmSync(soat, { recursive: true, force: true });
      const r = await chay(PYTHON, [path.join(GOC, "scripts/soat_khung_mp4.py"), thuMucFfmpeg, tenDu, soat, "3"], o);
      if (r.ma !== 0) throw new Error("cắt bảng ảnh soát lỗi: " + r.loi.slice(-300));
      kq.bang_soat = fs.readdirSync(soat).filter((t) => t.startsWith("bang_")).sort().map((t) => tuongDoi(path.join(soat, t)));
      return `${kq.bang_soat.length} bảng`;
    });

    kq.giay_may = phieu.buoc.reduce((a, b) => a + (b.giay || 0), 0);
    phieu.trang_thai = "cho_soat";
  } catch (e) {
    phieu.trang_thai = "loi";
    kq.loi = e.message.slice(0, 800);
  }
  kq.giay_tong = Math.round((Date.now() - batDauPhieu) / 1000);
  (phieu.lich_su ||= []).push({ luc: bayGio(), trang_thai: phieu.trang_thai, giay: kq.giay_tong, chuong_ket_xuat: kq.chuong_ket_xuat || [] });
  luu();
  vietBaoCao(phieu);
  return phieu;
}

function vietBaoCao(phieu) {
  const kq = phieu.ket_qua || {};
  const d = [];
  d.push(`# Báo cáo pha máy — ${phieu.ma}`, "");
  d.push(`- Dự án dựng: \`${phieu.du_an}\` · ${phieu.loai === "html" ? `trang HTML \`${phieu.trang}\`` : `composition \`${phieu.composition}\``}${phieu.san_pham ? ` · sản phẩm \`${phieu.san_pham}\`` : ""}`);
  d.push(`- Trạng thái: **${phieu.trang_thai === "cho_soat" ? "máy xong, chờ AI soát (pha 3)" : phieu.trang_thai}** · chạy lúc ${phieu.lan_chay_luc} · ${kq.giay_tong ?? "?"} giây`);
  if (phieu.chuong_sua?.length) d.push(`- Phiếu khai chương đã sửa: ${phieu.chuong_sua.join(", ")}`);
  if (kq.loi) d.push("", `**Lỗi:** ${kq.loi}`, "", `Nhật ký lệnh: \`${tuongDoi(path.join(THU_MUC_NHAT_KY, phieu.ma + ".log"))}\``);
  d.push("", "## Các bước", "", "| Bước | Trạng thái | Giây | Ghi chú |", "|---|---|---|---|");
  for (const b of phieu.buoc || []) d.push(`| ${b.ten} | ${b.trang_thai || "đang chạy"} | ${b.giay ?? ""} | ${(b.ghi_chu || "").replace(/\|/g, "/").replace(/\n/g, " ")} |`);
  if (phieu.trang_thai === "cho_soat") {
    d.push("", "## Kết quả", "");
    d.push(`- Bản đủ: \`${kq.file_du}\`, ${kq.thoi_luong} giây, ${kq.so_khung} khung`);
    d.push(`- Chương kết xuất: ${kq.chuong_ket_xuat?.join(", ") || "không"} · dùng lại từ bộ đệm: ${kq.chuong_dung_lai?.join(", ") || "không"}`);
    d.push(`- Khung hỏng WebGL: tìm thấy ${kq.khung_hong_tim_thay ?? 0}, đã thay ${kq.khung_hong_da_thay ?? 0}, còn ${kq.khung_hong_con_lai ?? 0}`);
    d.push(`- Độ to: ${kq.lufs} LUFS tích hợp, đỉnh thật ${kq.dinh_dbtp} dBTP sau khi chỉnh (tiếng gốc ${kq.lufs_goc ?? "?"} LUFS; đích ${DO_TO_DICH} LUFS, ${DINH_DICH} dBTP theo module 07 mục 9)`);
    d.push(`- Đứng hình (10 khung/giây, n=−60 dB, d=0,5 giây): ${kq.dung_hinh?.so_doan} đoạn, tổng ${kq.dung_hinh?.tong_giay} giây, dài nhất ${kq.dung_hinh?.dai_nhat} giây`);
    d.push(`- Bảng ảnh soát (3 giây một khung): ${(kq.bang_soat || []).map((t) => `\`${t}\``).join(", ")}`);
    d.push(`- Giờ máy các bước: ${kq.giay_may} giây`);
    d.push("", "## Cảnh báo", "", ...(kq.canh_bao?.length ? kq.canh_bao.map((c) => `- ${c}`) : ["- Không có"]));
    d.push("", "## Việc của pha 3", "",
      "Xem các bảng ảnh soát và cảnh báo trên. Sửa chương lỗi rồi ghi lại phiếu: " +
      `\`node scripts/pha_may/pha_may.mjs tao ${phieu.ma} ${phieu.du_an} --chuong-sua <các chương>\`, ` +
      "rồi chạy lại pha máy (chỉ chương đã sửa được kết xuất lại). Đạt thì chép bản đủ ra thư mục sản phẩm thành `_nhap` theo quy ước sản phẩm.");
  }
  fs.mkdirSync(THU_MUC_BAO_CAO, { recursive: true });
  fs.writeFileSync(path.join(THU_MUC_BAO_CAO, phieu.ma + ".md"), d.join("\n") + "\n");
}

// ---------- lệnh ----------

function lenhTao(ts) {
  const [ma, duAnVao] = ts._;
  if (!ma || !duAnVao) throw new Error("Cách dùng: tao <mã> <thư mục dự án> [--san-pham ...] [--composition ...] [--trang ...] [--chuong-sua 3,5] [--ghi-chu ...]");
  if (!/^[a-z0-9_]+$/i.test(ma)) throw new Error("mã chỉ gồm chữ không dấu, số, gạch dưới (ví dụ n52)");
  const thuMuc = path.resolve(GOC, duAnVao);
  const cu = docJson(tepPhieu(ma), {});
  // Tự nhận loại dự án: Remotion ngang có src/thoi_gian.json; HTML có nhip.json và trang.
  let rieng;
  if (fs.existsSync(path.join(thuMuc, "src/thoi_gian.json"))) {
    const dsComp = timComposition(thuMuc);
    const composition = ts.composition || (dsComp.length === 1 ? dsComp[0] : null);
    if (!composition) throw new Error(`không chọn được composition (tìm thấy: ${dsComp.join(", ") || "không có"}); thêm --composition`);
    rieng = { loai: "remotion", composition, trang: undefined };
  } else if (fs.existsSync(path.join(thuMuc, "nhip.json"))) {
    rieng = { loai: "html", composition: undefined, trang: ts.trang || (cu.loai === "html" && cu.trang) || "trang.html" };
  } else throw new Error(`${duAnVao} không có src/thoi_gian.json (Remotion ngang LM-02) hay nhip.json (HTML LM-03)`);
  const phieu = {
    ...cu, ma, du_an: tuongDoi(thuMuc), ...rieng,
    san_pham: ts["san-pham"] ? tuongDoi(path.resolve(GOC, ts["san-pham"])) : cu.san_pham || null,
    chuong_sua: ts["chuong-sua"] ? String(ts["chuong-sua"]).split(",").map((s) => s.trim()).filter(Boolean) : null,
    ghi_chu: ts["ghi-chu"] || cu.ghi_chu || "",
    trang_thai: "cho", tao_luc: cu.tao_luc || bayGio(), cap_nhat_luc: bayGio(),
  };
  // Đọc thử dự án ngay lúc ghi phiếu để lỗi quy cách (chương hở, thiếu file giọng) hiện ở pha 1, không đợi tới pha 2.
  const da = docDuAn(phieu);
  const la = (phieu.chuong_sua || []).filter((id) => !da.chuong.some((c) => c.id === id));
  if (la.length) throw new Error(`--chuong-sua có mã chương không tồn tại: ${la.join(", ")} (có: ${da.chuong.map((c) => c.id).join(", ")})`);
  ghiJson(tepPhieu(ma), phieu);
  const nhan = phieu.loai === "html" ? `trang ${phieu.trang}, ${da.tong} khung, ${da.chuong.length} chương` : `composition ${phieu.composition}`;
  console.log(`Đã ghi phiếu ${ma}: ${phieu.du_an}, ${nhan}${phieu.chuong_sua ? `, chương đã sửa ${phieu.chuong_sua.join(",")}` : ""}. Chạy: node scripts/pha_may/pha_may.mjs chay`);
}

function lenhXem() {
  const ds = fs.existsSync(THU_MUC_PHIEU) ? fs.readdirSync(THU_MUC_PHIEU).filter((t) => t.endsWith(".json")) : [];
  if (!ds.length) console.log("Chưa có phiếu nào.");
  for (const t of ds.sort()) {
    const p = docJson(path.join(THU_MUC_PHIEU, t), {});
    const k = p.ket_qua || {};
    const dangBuoc = p.trang_thai === "dang_chay" ? ` · đang: ${p.buoc?.[p.buoc.length - 1]?.ten}` : "";
    console.log(`${p.ma.padEnd(10)} ${String(p.trang_thai).padEnd(10)} ${p.du_an}${dangBuoc}` +
      (k.giay_tong ? ` · ${k.giay_tong} giây` : "") + (k.canh_bao?.length ? ` · ${k.canh_bao.length} cảnh báo` : "") + (k.loi ? ` · lỗi: ${k.loi.slice(0, 80)}` : ""));
  }
  for (const t of fs.existsSync(DU_LIEU) ? fs.readdirSync(DU_LIEU).filter((t) => /^dang_chay.*\.json$/.test(t)) : []) {
    const khoa = docJson(path.join(DU_LIEU, t), null);
    if (khoa && dangSong(khoa.pid)) console.log(`\nTrình chạy đang chạy (PID ${khoa.pid}, từ ${khoa.luc}): ${(khoa.phieu || []).join(", ")}.`);
  }
  console.log("\nHàng đợi kết xuất:");
  process.stdout.write(spawnSync("bash", [HANG_DOI, "--xem"], { encoding: "utf8" }).stdout);
}

const dangSong = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

// Giữ khoá trình chạy: tạo file khoá bằng liên kết cứng từ file tạm đã ghi đủ nội dung, nên chỉ một trình chạy
// tạo được và không ai đọc phải khoá ghi dở. Trả về null nếu đã lấy, hoặc nội dung khoá của trình chạy còn sống.
function layKhoa(tep, noiDung) {
  fs.mkdirSync(path.dirname(tep), { recursive: true });
  const tam = `${tep}.${process.pid}.tam`;
  fs.writeFileSync(tam, JSON.stringify(noiDung, null, 1));
  try {
    for (let lan = 0; lan < 3; lan++) {
      try { fs.linkSync(tam, tep); return null; } catch (e) { if (e.code !== "EEXIST") throw e; }
      const cu = docJson(tep, null);
      if (cu && dangSong(cu.pid)) return cu;
      fs.rmSync(tep, { force: true }); // khoá của trình chạy đã chết (bị tắt cứng)
    }
    throw new Error(`không lấy được khoá ${tuongDoi(tep)}`);
  } finally { fs.rmSync(tam, { force: true }); }
}

async function lenhChay(ts) {
  // Một trình chạy chính giữ dang_chay.json. Khi nó đang chạy, `--chi <mã>` vẫn chạy được với khoá riêng
  // dang_chay_<mã>.json nếu phiếu đó không thuộc lượt đang chạy (pha 3 chạy lại một video không phải chờ cả lô).
  const ds = (fs.existsSync(THU_MUC_PHIEU) ? fs.readdirSync(THU_MUC_PHIEU) : [])
    .filter((t) => t.endsWith(".json")).map((t) => docJson(path.join(THU_MUC_PHIEU, t), {}))
    .filter((p) => (ts.chi ? p.ma === ts.chi : p.trang_thai === "cho"))
    .sort((a, b) => String(a.cap_nhat_luc).localeCompare(String(b.cap_nhat_luc)));
  if (!ds.length) { console.log(ts.chi ? `Không có phiếu ${ts.chi}.` : "Không có phiếu nào đang chờ."); return; }
  const noiDungKhoa = { pid: process.pid, luc: bayGio(), phieu: ds.map((p) => p.ma) };
  const tepRieng = ts.chi ? path.join(DU_LIEU, `dang_chay_${ts.chi}.json`) : null;
  let tepKhoa = TEP_KHOA;
  const khoa = layKhoa(TEP_KHOA, noiDungKhoa);
  if (khoa) {
    if (!ts.chi) throw new Error(`trình chạy khác đang chạy (PID ${khoa.pid}, từ ${khoa.luc}); chạy riêng một phiếu thì thêm --chi <mã>`);
    if (khoa.phieu?.includes(ts.chi)) throw new Error(`phiếu ${ts.chi} thuộc lượt đang chạy (PID ${khoa.pid})`);
    tepKhoa = tepRieng;
    const rieng = layKhoa(tepRieng, noiDungKhoa);
    if (rieng) throw new Error(`phiếu ${ts.chi} đang chạy riêng (PID ${rieng.pid})`);
  } else if (ts.chi) {
    const rieng = docJson(tepRieng, null);
    if (rieng && dangSong(rieng.pid)) { fs.rmSync(TEP_KHOA, { force: true }); throw new Error(`phiếu ${ts.chi} đang chạy riêng (PID ${rieng.pid})`); }
  }
  // Giữ máy không ngủ khi không dùng trong lúc trình chạy còn sống (máy đặt ngủ sau 1 phút).
  spawn("caffeinate", ["-i", "-w", String(process.pid)], { detached: true, stdio: "ignore" }).unref();
  const hang = ds.map((p) => p.ma);
  const soLuong = Math.max(1, Math.min(+ts["song-song"] || 2, 3));
  console.log(`Pha máy: ${hang.length} phiếu (${hang.join(", ")}), ${soLuong} video cùng lúc. Theo dõi: node scripts/pha_may/pha_may.mjs xem`);
  const ketQua = [];
  const dung = () => {
    for (const ma of ds.map((p) => p.ma)) {
      const p = docJson(tepPhieu(ma), null);
      if (p?.trang_thai === "dang_chay") { p.trang_thai = "loi"; p.ket_qua = { ...p.ket_qua, loi: "trình chạy bị dừng giữa chừng" }; ghiJson(tepPhieu(ma), p); }
    }
    for (const p of tienTrinhCon) p.kill("SIGTERM"); // hàng đợi bắt TERM, tắt lượt kết xuất và trả chỗ
    fs.rmSync(tepKhoa, { force: true });
    process.exit(130);
  };
  process.on("SIGINT", dung);
  process.on("SIGTERM", dung);
  await Promise.all(Array.from({ length: soLuong }, async () => {
    while (hang.length) {
      const ma = hang.shift();
      const p = await chayMotPhieu(ma);
      const k = p.ket_qua || {};
      const dong = `${ma}: ${p.trang_thai === "cho_soat" ? `xong, ${k.giay_tong} giây, ${k.chuong_ket_xuat?.length ?? 0} chương kết xuất, ${k.canh_bao?.length || 0} cảnh báo` : "LỖI " + (k.loi || "").slice(0, 120)}`;
      console.log(dong);
      ketQua.push(dong);
    }
  }));
  fs.rmSync(tepKhoa, { force: true });
  console.log(`Báo cáo: ${tuongDoi(THU_MUC_BAO_CAO)}/<mã>.md`);
  if (!ts["khong-bao"]) thongBao("Pha máy Media xong", ketQua.join("; "), true);
}

function lenhDon(ts) {
  const [ma] = ts._;
  const p = docJson(tepPhieu(ma || ""), null);
  if (!p) throw new Error(`không có phiếu ${ma}`);
  if (!ts.chac) throw new Error("dọn bộ đệm xoá chuỗi ảnh đã kết xuất (sửa sau này phải kết xuất lại cả video); chỉ chạy sau khi Trung duyệt bản cuối, thêm --chac");
  const ra = path.join(GOC, p.du_an, "out/pha_may");
  if (!fs.existsSync(ra)) { console.log("Không còn bộ đệm."); return; }
  const kb = spawnSync("du", ["-sk", ra], { encoding: "utf8" }).stdout.split("\t")[0];
  const dich = path.join(os.homedir(), ".Trash", `pha_may_${ma}_${Date.now()}`);
  fs.renameSync(ra, dich);
  console.log(`Đã chuyển ${Math.round(kb / 1024)} MB bộ đệm của ${ma} vào Thùng rác: ${dich}`);
}

const [lenh, ...con] = process.argv.slice(2);
const ts = thamSo(con);
try {
  if (lenh === "tao") lenhTao(ts);
  else if (lenh === "chay") await lenhChay(ts);
  else if (lenh === "xem") lenhXem();
  else if (lenh === "don") lenhDon(ts);
  else { console.log("Lệnh: tao | chay | xem | don. Xem scripts/pha_may/HUONG_DAN.md"); process.exit(2); }
} catch (e) {
  console.error("Lỗi: " + e.message);
  process.exit(1);
}
