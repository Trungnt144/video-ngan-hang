// may_chu.mjs — máy chủ của bảng theo dõi video Media (Trung chốt 27/10/2026).
//
// Việc làm:
//   1. Đọc san_pham/ mỗi lần trang hỏi (trang hỏi 5 giây/lần): tên, trạng thái, nội dung vắn tắt,
//      video chính, hình thu nhỏ của từng video và cảnh thử.
//   2. Tạo đoạn xem nhanh 8 giây (8 đoạn 1 giây, không tiếng, rộng 480) bằng ffmpeg trong
//      xuong_thu_hyperframes/bin/, lưu ở du_lieu/bang_video/xem_nhanh/, tự làm lại khi video đổi.
//   3. Nhận "ý kiến chỉ đạo" từ trang, ghi vào du_lieu/bang_video/so_lenh.json rồi chạy tối đa 3 lệnh cùng lúc,
//      mỗi lệnh một phiên Claude Code chạy nền Trung xem và trả lời được (`claude --bg`, chế độ quyền auto,
//      từ 28/10/2026, sổ nợ N58); không mở được phiên nền thì chạy ẩn bằng `claude -p` như trước.
//   4. Lưu tên video Trung sửa trên trang vào du_lieu/bang_video/ghi_de.json.
//   5. Thẻ Trend (28/10/2026): đọc sổ trend du_lieu/trend/so_trend.json (skill san-trend 3.0), lưu trạng thái,
//      ghi chú, video gắn với từng từ khoá vào du_lieu/bang_video/trend_nhap.json, nhận yêu cầu tạo trend và chạy
//      như một lệnh trong cùng hàng lệnh (`--chrome`, luôn chạy đầy đủ theo quyết định của Trung).
//   6. Thẻ Pha máy (28/10/2026): đọc phiếu của trình chạy pha máy (scripts/pha_may/), bật hoặc dừng trình chạy;
//      từ 29/10/2026 chạy riêng hoặc dừng từng phiếu.
//   7. Thẻ chiến dịch Điện, Bank, Kinh tế (28/10/2026): xếp video vào chiến dịch theo từ khoá ở chien_dich.json
//      (Trung sửa tay được, lưu ở ghi_de.json); lấy số liệu kênh YouTube của từng chiến dịch qua YouTube Data API
//      và YouTube Analytics API 6 giờ một lần, lưu ở du_lieu/bang_video/so_lieu_youtube.json.
//
// Chỉ nghe ở 127.0.0.1. Mọi yêu cầu ghi phải mang mã phiên in sẵn trong trang (chặn trang web
// khác gửi lệnh vào máy chủ này). Bật bằng biểu tượng "Media Project" trên màn hình nền (scripts/bang_video/mo_bang.sh,
// chạy ngầm) hoặc scripts/bang_video/chay.sh (chạy trong cửa sổ dòng lệnh). Tắt bằng nút trên trang.

import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { StringDecoder } from 'node:string_decoder';

const THU_MUC_MA = path.dirname(fileURLToPath(import.meta.url));
const GOC = path.resolve(THU_MUC_MA, '../..');
const SAN_PHAM = path.join(GOC, 'san_pham');
const DU_LIEU = path.join(GOC, 'du_lieu/bang_video');
const XEM_NHANH = path.join(DU_LIEU, 'xem_nhanh');
const NHAT_KY_LENH = path.join(DU_LIEU, 'nhat_ky_lenh');
const TEP_GHI_DE = path.join(DU_LIEU, 'ghi_de.json');
const TEP_SO_LENH = path.join(DU_LIEU, 'so_lenh.json');
const TEP_TREND_NHAP = path.join(DU_LIEU, 'trend_nhap.json');
const TEP_SO_TREND = path.join(GOC, 'du_lieu/trend/so_trend.json');
const TEP_CHIEN_DICH = path.join(THU_MUC_MA, 'chien_dich.json');
const TEP_SO_LIEU_YT = path.join(DU_LIEU, 'so_lieu_youtube.json');
const TEP_VIEC_DO = path.join(DU_LIEU, 'viec_do.json');
const TEP_QUY_TAC = path.join(DU_LIEU, 'quy_tac_chien_dich.json'); // bảng quy tắc trên thẻ chiến dịch, Trung sửa ô điều chỉnh (02/11/2026)
const MAU_TEN_NGAN = /^[a-z0-9-]{3,12}$/;
const TEP_SO_DANG_YT = path.join(GOC, 'du_lieu/dang_youtube/so_trang_thai.jsonl');
const CHU_KY_YT = 6 * 3600e3;
const FFMPEG = path.join(GOC, 'xuong_thu_hyperframes/bin/ffmpeg');
const FFPROBE = path.join(GOC, 'xuong_thu_hyperframes/bin/ffprobe');
const CONG = Number(process.env.BANG_VIDEO_CONG || 4580);
const MA_PHIEN = crypto.randomBytes(16).toString('hex');
const HAN_LENH_PHUT = 120;
const SO_LENH_TOI_DA = 3; // Trung chốt 28/10/2026; lệnh đang chờ Trung trả lời không tính
const CHE_DO_PHIEN = process.env.BANG_VIDEO_PHIEN === 'an' ? 'an' : 'nen';
const MO_APP_TU_DONG = process.env.BANG_VIDEO_MO_APP === '1'; // chưa thử khi phiên đang chạy, mặc định tắt
const THU_MUC_HOI_THOAI = path.join(os.homedir(), '.claude/projects', GOC.replace(/[^A-Za-z0-9]/g, '-'));
const PHA_MAY = path.join(GOC, 'scripts/pha_may/pha_may.mjs');
const DU_LIEU_PHA_MAY = path.join(GOC, 'du_lieu/pha_may');
const MAU_MA_PHIEU = /^[A-Za-z0-9_]+$/;
const MODEL_HOP_LE = new Set(['opus', 'sonnet']);
const KHUNG_TREND = { tuan: 'tuần (7 ngày)', thang: 'tháng (30 ngày)', quy: 'quý (90 ngày)' };
const NEN_TANG_TREND = { google: 'Google', youtube: 'YouTube', tiktok: 'TikTok', facebook: 'Facebook' };
const TRANG_THAI_TREND = new Set(['moi', 'theo_doi', 'lam_video', 'bo']);

for (const d of [DU_LIEU, XEM_NHANH, NHAT_KY_LENH]) fs.mkdirSync(d, { recursive: true });

function timClaude() {
  if (process.env.CLAUDE_BIN) return process.env.CLAUDE_BIN;
  const r = spawnSync('/bin/zsh', ['-lc', 'command -v claude'], { encoding: 'utf8' });
  const p = (r.stdout || '').trim();
  return p || path.join(os.homedir(), '.local/bin/claude');
}
const CLAUDE = timClaude();

// ---------- đọc, ghi JSON ----------

function docJson(tep, macDinh) {
  try { return JSON.parse(fs.readFileSync(tep, 'utf8')); } catch { return macDinh; }
}
function ghiJson(tep, duLieu) {
  const tam = tep + '.tam';
  fs.writeFileSync(tam, JSON.stringify(duLieu, null, 1) + '\n');
  fs.renameSync(tam, tep);
}

let ghiDe = docJson(TEP_GHI_DE, {});
let trendNhap = docJson(TEP_TREND_NHAP, {});
let soLenh = docJson(TEP_SO_LENH, []);
// Máy chủ tắt giữa chừng thì lượt `claude -p` đang chạy đã mất theo; phiên nền vẫn chạy, bật lại thì theo dõi tiếp
for (const l of soLenh) {
  if (['dang_chay', 'cho_trung'].includes(l.trang_thai) && l.kieu_phien !== 'nen') {
    l.trang_thai = 'loi';
    l.ket_qua = (l.ket_qua || '') + '\n[Máy chủ bảng video tắt khi lệnh đang chạy; lượt Claude bị dừng giữa chừng. Xem git log để biết phần đã làm.]';
    l.ket_thuc = new Date().toISOString();
  }
}
ghiJson(TEP_SO_LENH, soLenh);

// ---------- quét san_pham ----------

const MAU_THU_MUC = /^(\d{4})\.(\d{2})\.(\d{2})\.(.+)$/;
const MAU_BO_KICH_BAN = /nguon_kiem_chung|kiem_chung|ke_hoach|so_theo_doi|duyet_|tom_tat/;

function lietKe(thuMuc) {
  try { return fs.readdirSync(thuMuc, { withFileTypes: true }); } catch { return []; }
}
function thongTinTep(p) {
  try { const s = fs.statSync(p); return { mtime: s.mtimeMs, size: s.size }; } catch { return null; }
}
function soPhienBan(ten) {
  const m = ten.match(/_v(\d+)/g);
  return m ? Number(m[m.length - 1].slice(2)) : 0;
}
function chonMoiNhat(dsTep, thuMuc) {
  // ưu tiên số phiên bản cao, rồi file sửa sau cùng
  return dsTep
    .map((ten) => ({ ten, v: soPhienBan(ten), t: thongTinTep(path.join(thuMuc, ten))?.mtime || 0 }))
    .sort((a, b) => b.v - a.v || b.t - a.t)[0]?.ten;
}
function boMarkdown(s) {
  return s.replace(/\*\*/g, '').replace(/`/g, '').replace(/\s+/g, ' ').trim();
}

function tenTuKichBan(txt) {
  for (const dong of txt.split('\n')) {
    if (!dong.startsWith('>') || !dong.includes('Tiêu đề')) continue;
    let m = dong.match(/\*\*Tiêu đề[^*]*\*\*\s*(.+)$/);
    if (m) return boMarkdown(m[1]).replace(/\s*[.;]$/, '');
    m = dong.match(/Tiêu đề[^*\n]*\*\*([^*\n]+)\*\*/);
    if (m) return boMarkdown(m[1]).replace(/\s*[.;]$/, '');
  }
  const h = txt.match(/^# (.+)$/m);
  if (!h) return null;
  let t = h[1];
  t = t.replace(/^Kịch bản\s*[:—–-]\s*/i, '');
  t = t.replace(/\s*[—–-]\s*kịch bản\b.*$/i, '');
  t = t.replace(/:\s*kịch bản\b.*$/i, '');
  for (let i = 0; i < 3; i++) t = t.replace(/\s*\((?:[^()]*\bv\d+[^()]*|N\d+)\)\s*$/, '');
  return boMarkdown(t) || null;
}

function trangThaiNguonGoc(txt) {
  const m = txt.match(/^\| Trạng thái \|\s*(.+?)\s*\|\s*$/m);
  if (!m) return null;
  const s = boMarkdown(m[1]);
  return s.length > 260 ? s.slice(0, 257) + '…' : s;
}

const NHAN_TRANG_THAI = {
  cuoi: 'Đã duyệt bản cuối',
  nhap: 'Bản nháp chờ duyệt',
  dang_lam: 'Đang làm bản mới',
  ban_thu: 'Chỉ có bản thử',
  kich_ban: 'Có kịch bản, chưa dựng',
};

const MAU_NEN_TANG_PHU = /_(shorts|reels|tiktok|facebook|zalo)\d*_|\((shorts|reels|tiktok|facebook|zalo)\d*\)\.mp4$/i;
// Video đã đổi tên theo tiêu đề trên kênh (Trung chốt 29/10/2026) không còn _v<n>: coi là bản cuối
const laBanCuoi = (f) => f.includes('_cuoi') || !/_v\d+/.test(f);

function quetMotThuMuc(ten) {
  const m = ten.match(MAU_THU_MUC);
  if (!m) return null;
  const thuMuc = path.join(SAN_PHAM, ten);
  const ngoai = lietKe(thuMuc).filter((d) => d.isFile()).map((d) => d.name);
  const thuMucKb = path.join(thuMuc, 'tai_nguyen/kich_ban');
  const kb = lietKe(thuMucKb).filter((d) => d.isFile()).map((d) => d.name);
  const coChuong = kb.some((f) => f.endsWith('.chuong.json'));
  const mp4Ngoai = ngoai.filter((f) => f.toLowerCase().endsWith('.mp4'));
  if (!coChuong && mp4Ngoai.length === 0) return null; // tài liệu, không phải video

  const thuMucNhap = path.join(thuMuc, 'tai_nguyen/ban_nhap');
  const mp4Nhap = lietKe(thuMucNhap).filter((d) => d.isFile() && d.name.endsWith('.mp4')).map((d) => d.name);

  let video = null;
  if (mp4Ngoai.length) {
    // nhiều nền tảng chung một thư mục (quy ước 28/10/2026): thẻ video hiện bản YouTube ngang
    const banChinh = mp4Ngoai.filter((f) => !MAU_NEN_TANG_PHU.test(f));
    const ungVien = banChinh.length ? banChinh : mp4Ngoai;
    const cuoi = ungVien.filter(laBanCuoi);
    video = chonMoiNhat(cuoi.length ? cuoi : ungVien, thuMuc);
  } else if (mp4Nhap.length) {
    video = 'tai_nguyen/ban_nhap/' + chonMoiNhat(mp4Nhap, thuMucNhap);
  }

  const kbMd = kb.filter((f) => f.endsWith('.md') && !MAU_BO_KICH_BAN.test(f));
  const tepKb = chonMoiNhat(kbMd, thuMucKb);
  const tepChuong = chonMoiNhat(kb.filter((f) => f.endsWith('.chuong.json')), thuMucKb);
  const tepNguonGoc = path.join(thuMuc, 'tai_nguyen/nguon_goc.md');

  let tenTuDong = null;
  if (tepKb) { try { tenTuDong = tenTuKichBan(fs.readFileSync(path.join(thuMucKb, tepKb), 'utf8')); } catch {} }
  let chiTiet = null;
  try {
    const ng = fs.readFileSync(tepNguonGoc, 'utf8');
    chiTiet = trangThaiNguonGoc(ng);
    if (!tenTuDong) { const h = ng.match(/^# Nguồn gốc:\s*(.+)$/m); if (h) tenTuDong = boMarkdown(h[1]); }
  } catch {}
  if (!tenTuDong) tenTuDong = m[4].replace(/_/g, ' ');

  let canh = [];
  if (tepChuong) {
    try {
      const ds = JSON.parse(fs.readFileSync(path.join(thuMucKb, tepChuong), 'utf8'));
      if (Array.isArray(ds)) canh = ds.map((c) => ({ ten: c.ten || '', loi: c.text || c.doc || '' }));
    } catch {}
  }

  // tóm tắt nội dung 2–3 câu cho ô "Tóm tắt nội dung" (Trung yêu cầu 28/10/2026): tai_nguyen/kich_ban/<…>.tom_tat.md
  let tomTat = null;
  const tepTomTat = kb.find((f) => f.endsWith('.tom_tat.md'));
  if (tepTomTat) {
    try {
      const txt = fs.readFileSync(path.join(thuMucKb, tepTomTat), 'utf8');
      tomTat = boMarkdown(txt.split('\n').filter((d) => d.trim() && !d.startsWith('#')).join(' ')) || null;
      // dòng đầu "# Tóm tắt: <tên video>" là tên thật, thay cho tên đọc nhầm từ file tiến độ
      const tieuDe = txt.match(/^# Tóm tắt:\s*(.+)$/m);
      if (tieuDe) tenTuDong = boMarkdown(tieuDe[1]);
    } catch {}
  }
  // tiêu đề YouTube trong dang_bai/youtube.md đứng trên tên đọc từ kịch bản và dòng "# Tóm tắt:" (Trung chốt
  // 01/11/2026): đổi tiêu đề chữ đăng là bảng đổi theo, không phải nhớ sửa tóm tắt; tên sửa tay ở ghi_de.json vẫn đứng đầu
  const tieuDeYoutube = docKhoi(docTep(path.join(thuMuc, 'tai_nguyen/dang_bai/youtube.md')), 'youtube_dai', 'tieu_de');
  if (tieuDeYoutube) tenTuDong = tieuDeYoutube;

  const anh = ngoai.find((f) => /hinh_thu_nho.*\.(jpe?g|png|webp)$/i.test(f)) || null;

  // mốc hoạt động gần nhất: video, kịch bản, nguồn gốc
  const cacMoc = [
    video && thongTinTep(path.join(thuMuc, video))?.mtime,
    tepKb && thongTinTep(path.join(thuMucKb, tepKb))?.mtime,
    thongTinTep(tepNguonGoc)?.mtime,
  ].filter(Boolean);
  const hoatDong = cacMoc.length ? Math.max(...cacMoc) : 0;

  let trangThai;
  if (mp4Ngoai.length) trangThai = laBanCuoi(video) ? 'cuoi' : 'nhap';
  else if (mp4Nhap.length) trangThai = Date.now() - new Date(`${m[1]}-${m[2]}-${m[3]}`).getTime() < 3 * 864e5 ? 'dang_lam' : 'ban_thu';
  else trangThai = 'kich_ban';

  const gd = ghiDe[ten] || {};
  const loai = ten.includes('canh_thu') ? 'canh_thu' : 'video';
  return {
    thu_muc: ten,
    ngay: `${m[1]}-${m[2]}-${m[3]}`,
    loai,
    chien_dich: gd.chien_dich ? (gd.chien_dich === 'khong' ? null : gd.chien_dich) : chienDichTuDong(m[4], `${tenTuDong} ${gd.ten || ''}`, loai),
    chien_dich_da_sua: Boolean(gd.chien_dich),
    ten: gd.ten || tenTuDong,
    ten_tu_dong: tenTuDong,
    ten_da_sua: Boolean(gd.ten),
    trang_thai: trangThai,
    nhan_trang_thai: NHAN_TRANG_THAI[trangThai],
    chi_tiet_trang_thai: chiTiet,
    canh: canh.map((c) => c.ten).filter(Boolean),
    so_canh: canh.length,
    loi_mo_dau: canh[0]?.loi ? canh[0].loi.slice(0, 280) : null,
    tom_tat: tomTat,
    video,
    kich_ban: tepKb ? `tai_nguyen/kich_ban/${tepKb}` : null,
    anh_thu_nho: anh,
    hoat_dong: hoatDong,
    trend: Object.values(trendNhap).filter((t) => t.video === ten).map((t) => t.hien_thi),
  };
}

let boNhoQuet = { luc: 0, ds: [] };
function quetSanPham() {
  if (Date.now() - boNhoQuet.luc < 1500) return boNhoQuet.ds;
  dsChienDich = docChienDich();
  const ds = [];
  for (const d of lietKe(SAN_PHAM)) {
    if (!d.isDirectory()) continue;
    try { const v = quetMotThuMuc(d.name); if (v) ds.push(v); } catch (e) { console.error('Lỗi quét', d.name, e.message); }
  }
  ds.sort((a, b) => b.ngay.localeCompare(a.ngay) || b.hoat_dong - a.hoat_dong);
  boNhoQuet = { luc: Date.now(), ds };
  for (const v of ds) yeuCauXemNhanh(v);
  return ds;
}

// ---------- chiến dịch truyền thông và số liệu YouTube ----------

function docChienDich() { return docJson(TEP_CHIEN_DICH, { chien_dich: [] }).chien_dich || []; }
let dsChienDich = docChienDich();

function boDau(s) {
  return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

// chiến dịch đứng trước trong chien_dich.json được xét trước; cảnh thử không thuộc chiến dịch nào
function chienDichTuDong(chuDe, ten, loai) {
  if (loai === 'canh_thu') return null;
  const chuoi = `_${boDau(chuDe)}_${boDau(ten)}_`;
  const c = dsChienDich.find((x) => (x.tu_khoa || []).some((k) => chuoi.includes(`_${k}_`)));
  return c ? c.ma : null;
}

// sổ của skill dang-youtube: mỗi thư mục sản phẩm lấy lượt tải sau cùng (bỏ lượt lỗi, lượt lên nhầm kênh)
function docSoDangYoutube() {
  const theoThuMuc = {};
  let txt = '';
  try { txt = fs.readFileSync(TEP_SO_DANG_YT, 'utf8'); } catch { return theoThuMuc; }
  for (const dong of txt.split('\n')) {
    let d;
    try { d = JSON.parse(dong); } catch { continue; }
    if (!d.videoId || !d.file || !['da_tai', 'da_co'].includes(d.trang_thai)) continue;
    const tuongDoi = path.relative(SAN_PHAM, d.file);
    if (tuongDoi.startsWith('..')) continue;
    theoThuMuc[tuongDoi.split(path.sep)[0]] = { video_id: d.videoId, publish_at: d.publishAt || null };
  }
  return theoThuMuc;
}

const boNhoKhoaYt = new Map(); // file khoá → { ma, het }
async function layMaTruyCap(tepKhoa) {
  const b = boNhoKhoaYt.get(tepKhoa);
  if (b && b.het > Date.now() + 60e3) return b.ma;
  const tep = tepKhoa.replace(/^~/, os.homedir());
  const khoa = JSON.parse(fs.readFileSync(tep, 'utf8'));
  const bm = JSON.parse(fs.readFileSync(path.join(path.dirname(tep), 'client_secrets.json'), 'utf8'));
  const c = bm.web || bm.installed;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token: khoa.refresh_token, grant_type: 'refresh_token' }),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error('Không làm mới được khoá YouTube: ' + (j.error_description || j.error || r.status));
  boNhoKhoaYt.set(tepKhoa, { ma: j.access_token, het: Date.now() + j.expires_in * 1000 });
  return j.access_token;
}

async function goiGoogle(url, ma) {
  const r = await fetch(url, { headers: { Authorization: 'Bearer ' + ma } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error?.message || 'Lỗi ' + r.status);
  return j;
}

// YouTube Analytics API: giờ xem, chia sẻ, người đăng ký tăng giảm; API chưa bật thì báo kèm đường dẫn bật
async function layAnalytics(ma) {
  const tham = (them) => 'https://youtubeanalytics.googleapis.com/v2/reports?' + new URLSearchParams({ ids: 'channel==MINE', startDate: '2020-01-01', endDate: new Date().toISOString().slice(0, 10), ...them });
  const thanhDoiTuong = (j) => {
    const cot = j.columnHeaders.map((h) => h.name);
    return (j.rows || []).map((r) => Object.fromEntries(cot.map((n, i) => [n, r[i]])));
  };
  const tong = thanhDoiTuong(await goiGoogle(tham({ metrics: 'views,estimatedMinutesWatched,likes,comments,shares,subscribersGained,subscribersLost' }), ma))[0] || {};
  const theoVideo = thanhDoiTuong(await goiGoogle(tham({ metrics: 'views,estimatedMinutesWatched,shares', dimensions: 'video', sort: '-views', maxResults: '200' }), ma));
  return { tong, theo_video: Object.fromEntries(theoVideo.map((x) => [x.video, x])) };
}

let soLieuYt = docJson(TEP_SO_LIEU_YT, { luc: null, chien_dich: {} });
let dangLayYt = null;
function capNhatYoutube() {
  if (dangLayYt) return dangLayYt;
  dangLayYt = (async () => {
    const dsVideo = quetSanPham();
    const dang = docSoDangYoutube();
    const ketQua = {};
    for (const c of dsChienDich) {
      if (!c.khoa_youtube) continue;
      const kq = { luc: new Date().toISOString(), kenh: null, videos: {}, analytics: null, loi: null, loi_analytics: null };
      try {
        const ma = await layMaTruyCap(c.khoa_youtube);
        const k = (await goiGoogle('https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true', ma)).items?.[0];
        if (!k) throw new Error('Khoá không gắn với kênh nào');
        if (c.ma_kenh && k.id !== c.ma_kenh) throw new Error(`Khoá đang gắn kênh "${k.snippet.title}", không phải kênh ${c.kenh_youtube}`);
        kq.kenh = {
          id: k.id, ten: k.snippet.title, so_video: +k.statistics.videoCount || 0, luot_xem: +k.statistics.viewCount || 0,
          nguoi_dang_ky: +k.statistics.subscriberCount || 0, an_nguoi_dang_ky: Boolean(k.statistics.hiddenSubscriberCount),
        };
        const ids = dsVideo.filter((v) => v.chien_dich === c.ma && dang[v.thu_muc]).map((v) => dang[v.thu_muc].video_id);
        for (let i = 0; i < ids.length; i += 50) {
          // thêm phần snippet (30/10/2026) để so tiêu đề, mô tả, thẻ với youtube.md; videos.list vẫn 1 đơn vị hạn mức
          const j = await goiGoogle('https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,status&id=' + ids.slice(i, i + 50).join(','), ma);
          for (const it of j.items || []) {
            kq.videos[it.id] = {
              che_do: it.status.privacyStatus, len_lich: it.status.publishAt || null,
              luot_xem: +it.statistics.viewCount || 0, thich: +it.statistics.likeCount || 0, binh_luan: +it.statistics.commentCount || 0,
              ...chuTrenKenh(it.snippet),
            };
          }
        }
        try { kq.analytics = await layAnalytics(ma); }
        catch (e) {
          const duong = e.message.match(/https:\/\/console\.developers\.google\.com\/\S+?(?=\s|$)/)?.[0] || null;
          kq.loi_analytics = { thong_bao: e.message, duong_bat: /has not been used|is disabled/.test(e.message) ? duong : null };
        }
      } catch (e) { kq.loi = e.message; }
      ketQua[c.ma] = kq;
    }
    soLieuYt = { luc: new Date().toISOString(), chien_dich: ketQua };
    ghiJson(TEP_SO_LIEU_YT, soLieuYt);
  })().finally(() => { dangLayYt = null; });
  return dangLayYt;
}

function capNhatYoutubeNeuCu() {
  if (soLieuYt.luc && Date.now() - new Date(soLieuYt.luc).getTime() < CHU_KY_YT) return;
  capNhatYoutube().catch((e) => console.error('Lỗi lấy số liệu YouTube', e.message));
}

// ---------- chữ đăng trong máy, ý tưởng tiếp theo, đồng bộ với YouTube (Trung chốt 30/10/2026) ----------
// Chữ đăng: tai_nguyen/dang_bai/youtube.md, facebook.md (skill viet-chu-dang-video), mỗi ô là "#### khối · ô" rồi một khối ```text.
// Ý tưởng triển khai tiếp theo: tai_nguyen/dang_bai/y_tuong_tiep.md, Trung gõ trên thẻ chiến dịch.
// YouTube khác youtube.md thì thẻ chiến dịch báo lệch; Trung bấm "Ghi về máy" mới ghi youtube.md và đổi tên file mp4.

// youtubeuploader điền chữ này khi kê khai không có mô tả: coi như kênh chưa có mô tả, không bao giờ chép về máy
const MO_TA_MAC_DINH = /^\s*(uploaded by youtubeuploader)?\s*$/i;
function chuTrenKenh(sn) {
  return { tieu_de: sn?.title ?? null, mo_ta: sn?.description ?? null, the: sn?.tags || [], kenh_id: sn?.channelId || null };
}
const chuanChu = (s) => String(s ?? '').normalize('NFC').replace(/\r\n/g, '\n').replace(/[ \t]+\n/g, '\n').trim();
const chuanThe = (ds) => [...new Set(ds.map((t) => chuanChu(t).toLowerCase()).filter(Boolean))].sort().join('|');
const tachThe = (s) => String(s || '').split(',').map((t) => t.trim()).filter(Boolean);
// cùng quy tắc với skills/viet-chu-dang-video/scripts/doi_ten_file.py
const tenAnToan = (t) => chuanChu(t).replace(/:/g, ' -').replace(/\//g, '-').replace(/\s+/g, ' ').trim().replace(/\.+$/, '');

function mauKhoi(khoi, o) { return new RegExp(`^#### ${khoi} · ${o}[ \\t]*\\n+\`\`\`[a-z]*\\n([\\s\\S]*?)\\n?\`\`\``, 'm'); }
function docKhoi(txt, khoi, o) { const m = txt?.match(mauKhoi(khoi, o)); return m ? m[1].trim() : null; }
function ghiKhoi(txt, khoi, o, giaTri) {
  const khoiMoi = `#### ${khoi} · ${o}\n\n\`\`\`text\n${giaTri}\n\`\`\``;
  if (mauKhoi(khoi, o).test(txt)) return txt.replace(mauKhoi(khoi, o), () => khoiMoi);
  return txt.replace(/\s*$/, '\n\n') + khoiMoi + '\n';
}
function docTep(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }

function docChuDang(thuMuc) {
  const g = path.join(SAN_PHAM, thuMuc, 'tai_nguyen/dang_bai');
  const yt = docTep(path.join(g, 'youtube.md'));
  const fb = docTep(path.join(g, 'facebook.md'));
  const yTuong = docTep(path.join(g, 'y_tuong_tiep.md'));
  return {
    youtube: yt == null ? null : { tieu_de: docKhoi(yt, 'youtube_dai', 'tieu_de'), mo_ta: docKhoi(yt, 'youtube_dai', 'mo_ta'), the: docKhoi(yt, 'youtube_dai', 'the') },
    facebook: fb == null ? null : { tieu_de: docKhoi(fb, 'facebook', 'tieu_de'), chu_thich: docKhoi(fb, 'facebook', 'chu_thich') },
    // bỏ dòng tiêu đề "#" và các dòng ghi chú ">" ở đầu file
    y_tuong: yTuong == null ? '' : yTuong.replace(/^(#[^\n]*\n|>[^\n]*\n|\s*\n)*/, '').trim(),
  };
}

// so bản trên kênh (s) với chữ đăng trong máy (cd.youtube) và tên file mp4 chính (v.video)
function soLech(v, cd, s) {
  if (!s || s.tieu_de == null) return null;
  const may = cd.youtube;
  const lech = [];
  const kenhChuaMoTa = MO_TA_MAC_DINH.test(s.mo_ta || '');
  if (!may) lech.push('chua_co_file');
  else {
    if (chuanChu(may.tieu_de) !== chuanChu(s.tieu_de)) lech.push('tieu_de');
    // kênh còn mô tả mặc định mà máy đã có mô tả: báo riêng, "Ghi về máy" không đè mô tả trong máy
    if (kenhChuaMoTa) { if (may.mo_ta) lech.push('mo_ta_chua_len_kenh'); }
    else if (chuanChu(may.mo_ta) !== chuanChu(s.mo_ta)) lech.push('mo_ta');
    if (s.the.length && chuanThe(tachThe(may.the)) !== chuanThe(s.the)) lech.push('the');
    else if (!s.the.length && may.the) lech.push('the_chua_len_kenh');
  }
  if (kenhChuaMoTa) lech.push('kenh_chua_mo_ta');
  if (v.video && !v.video.includes('/') && v.video.normalize('NFC') !== tenAnToan(s.tieu_de) + '.mp4') lech.push('ten_file');
  return lech.length ? lech : null;
}

function ghiYTuong(thuMuc, noiDung) {
  const g = path.join(SAN_PHAM, thuMuc, 'tai_nguyen/dang_bai');
  const tep = path.join(g, 'y_tuong_tiep.md');
  if (!noiDung && !fs.existsSync(tep)) return;
  const v = quetSanPham().find((x) => x.thu_muc === thuMuc);
  fs.mkdirSync(g, { recursive: true });
  const ngayNay = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  fs.writeFileSync(tep, `# Ý tưởng triển khai tiếp theo: ${v?.ten || thuMuc}\n\n> Trung ghi trên bảng video (thẻ chiến dịch), sửa lần cuối ${ngayNay}. Phiên Claude làm bản Shorts, Reels, TikTok hay video nối tiếp thì đọc file này trước.\n\n${noiDung}\n`);
}

// "Ghi về máy": lấy lại bản trên kênh ngay lúc bấm, ghi ba ô vào youtube.md, đổi tên mp4 bằng doi_ten_file.py, ghi sổ
const TEP_SO_DONG_BO = path.join(DU_LIEU, 'so_dong_bo.jsonl');
const DOI_TEN_FILE = path.join(GOC, 'skills/viet-chu-dang-video/scripts/doi_ten_file.py');
async function ghiVeMay(thuMuc) {
  const v = quetSanPham().find((x) => x.thu_muc === thuMuc);
  if (!v) throw new Error('Không thấy video');
  const c = dsChienDich.find((x) => x.ma === v.chien_dich);
  if (!c?.khoa_youtube) throw new Error('Kênh YouTube của chiến dịch chưa kết nối');
  const d = docSoDangYoutube()[thuMuc];
  if (!d?.video_id) throw new Error('Video chưa có trong sổ tải lên YouTube');
  const ma = await layMaTruyCap(c.khoa_youtube);
  const it = (await goiGoogle('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + d.video_id, ma)).items?.[0];
  if (!it) throw new Error('YouTube không trả về video ' + d.video_id);
  const s = chuTrenKenh(it.snippet);
  if (c.ma_kenh && s.kenh_id !== c.ma_kenh) throw new Error(`Video thuộc kênh khác, không phải ${c.kenh_youtube}`);

  const g = path.join(SAN_PHAM, thuMuc, 'tai_nguyen/dang_bai');
  const tep = path.join(g, 'youtube.md');
  const cu = docTep(tep);
  let txt = cu ?? `# Chữ đăng YouTube: ${s.tieu_de}\n\n> Thư mục video \`san_pham/${thuMuc}/\` · tạo ${new Date().toLocaleDateString('vi-VN')} bằng nút "Ghi về máy" của bảng video, chép từ bản đang có trên kênh ${c.kenh_youtube} (video ${d.video_id}). Chưa qua skill viet-chu-dang-video: chưa có ba phương án tiêu đề, chưa chạy kiem_chu_dang.py.${MO_TA_MAC_DINH.test(s.mo_ta || '') ? ' Kênh chưa có mô tả (còn chữ mặc định của youtubeuploader) nên file chưa có ô mo_ta.' : ''}${s.the.length ? '' : ' Kênh chưa có thẻ nên file chưa có ô the.'}\n\n## YouTube video dài (bản ngang)\n`;
  // chỉ ghi ô mà kênh có chữ thật: mô tả mặc định, thẻ trống thì giữ ô trong máy (hoặc để thiếu, chờ viet-chu-dang-video)
  txt = ghiKhoi(txt, 'youtube_dai', 'tieu_de', s.tieu_de);
  if (!MO_TA_MAC_DINH.test(s.mo_ta || '')) txt = ghiKhoi(txt, 'youtube_dai', 'mo_ta', s.mo_ta);
  if (s.the.length) txt = ghiKhoi(txt, 'youtube_dai', 'the', s.the.join(', '));
  fs.mkdirSync(g, { recursive: true });
  if (txt !== cu) fs.writeFileSync(tep, txt);

  const r = spawnSync('python3', ['-I', DOI_TEN_FILE, thuMuc, '--chay-that'], { cwd: GOC, encoding: 'utf8', timeout: 60e3 });
  const doiTen = (r.stdout || '').trim().split('\n').filter((x) => x.includes('→'));
  const loiDoiTen = r.status === 0 ? null : ((r.stderr || r.stdout || '').trim().split('\n').pop() || `mã thoát ${r.status}`);

  // cập nhật bản lưu để thẻ hết báo lệch ngay, không chờ lượt lấy số liệu sau
  const sv = soLieuYt.chien_dich?.[c.ma]?.videos?.[d.video_id];
  if (sv) { Object.assign(sv, s); ghiJson(TEP_SO_LIEU_YT, soLieuYt); }
  const cuYt = cu == null ? null : { tieu_de: docKhoi(cu, 'youtube_dai', 'tieu_de'), mo_ta: docKhoi(cu, 'youtube_dai', 'mo_ta'), the: docKhoi(cu, 'youtube_dai', 'the') };
  fs.appendFileSync(TEP_SO_DONG_BO, JSON.stringify({
    luc: new Date().toISOString(), thu_muc: thuMuc, video_id: d.video_id, nguon: 'youtube',
    tao_file_moi: cu == null, cu: cuYt, moi: { tieu_de: s.tieu_de, mo_ta: s.mo_ta, the: s.the.join(', ') }, doi_ten: doiTen, loi_doi_ten: loiDoiTen,
  }) + '\n');
  boNhoQuet.luc = 0;
  return { doi_ten: doiTen, loi_doi_ten: loiDoiTen, tao_file_moi: cu == null };
}

function baoCaoChienDich() {
  const ds = quetSanPham();
  const dang = docSoDangYoutube();
  return {
    luc_youtube: soLieuYt.luc,
    dang_lay: Boolean(dangLayYt),
    chu_ky_gio: CHU_KY_YT / 3600e3,
    chien_dich: dsChienDich.map((c) => {
      const yt = soLieuYt.chien_dich?.[c.ma] || null;
      const theoVideo = yt?.analytics?.theo_video || {};
      return {
        ma: c.ma, ten: c.ten, kenh_youtube: c.kenh_youtube, ket_noi: Boolean(c.khoa_youtube),
        youtube: yt && { luc: yt.luc, kenh: yt.kenh, loi: yt.loi, loi_analytics: yt.loi_analytics, tong: yt.analytics?.tong || null },
        videos: ds.filter((v) => v.chien_dich === c.ma).map((v) => {
          const d = dang[v.thu_muc];
          const s = d && yt?.videos?.[d.video_id];
          const a = d && theoVideo[d.video_id];
          const cd = docChuDang(v.thu_muc);
          return {
            thu_muc: v.thu_muc, ten: v.ten, ngay: v.ngay, trang_thai: v.trang_thai, nhan_trang_thai: v.nhan_trang_thai, chi_tiet_trang_thai: v.chi_tiet_trang_thai,
            video: v.video, hoat_dong: v.hoat_dong, xem_nhanh: trangThaiXemNhanh(v), anh_thu_nho: v.anh_thu_nho,
            tom_tat: v.tom_tat, loi_mo_dau: v.loi_mo_dau, chu_dang: cd,
            tren_kenh: s && s.tieu_de != null ? { tieu_de: s.tieu_de, mo_ta: s.mo_ta, the: s.the.join(', ') } : null,
            lech: soLech(v, cd, s),
            video_id: d?.video_id || null, che_do: s?.che_do || null, len_lich: s?.len_lich || d?.publish_at || null,
            luot_xem: s ? s.luot_xem : null, thich: s ? s.thich : null, binh_luan: s ? s.binh_luan : null,
            chia_se: a ? a.shares : null, phut_xem: a ? a.estimatedMinutesWatched : null,
          };
        }),
      };
    }),
  };
}

// ---------- thời lượng và đoạn xem nhanh ----------

const boNhoThoiLuong = new Map(); // khoá: đường dẫn|mtime|size
function thoiLuong(tep) {
  const tt = thongTinTep(tep);
  if (!tt) return null;
  const khoa = `${tep}|${tt.mtime}|${tt.size}`;
  if (boNhoThoiLuong.has(khoa)) return boNhoThoiLuong.get(khoa);
  const r = spawnSync(FFPROBE, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', tep], { encoding: 'utf8' });
  const giay = parseFloat(r.stdout);
  const kq = Number.isFinite(giay) ? giay : null;
  boNhoThoiLuong.set(khoa, kq);
  return kq;
}

const hangXemNhanh = [];
const dangCho = new Set();
let dangTaoXemNhanh = null;

function tepXemNhanh(thuMuc) { return path.join(XEM_NHANH, thuMuc + '.mp4'); }
function tepMetaXemNhanh(thuMuc) { return path.join(XEM_NHANH, thuMuc + '.json'); }

function trangThaiXemNhanh(v) {
  if (!v.video) return 'khong_co_video';
  const nguon = path.join(SAN_PHAM, v.thu_muc, v.video);
  const tt = thongTinTep(nguon);
  const meta = docJson(tepMetaXemNhanh(v.thu_muc), null);
  if (meta && tt && meta.nguon === v.video && meta.mtime === tt.mtime && meta.size === tt.size && fs.existsSync(tepXemNhanh(v.thu_muc))) {
    return meta.loi ? 'loi' : 'san_sang';
  }
  return 'dang_tao';
}

function yeuCauXemNhanh(v) {
  if (trangThaiXemNhanh(v) !== 'dang_tao' || dangCho.has(v.thu_muc)) return;
  dangCho.add(v.thu_muc);
  hangXemNhanh.push({ thu_muc: v.thu_muc, video: v.video });
  chayHangXemNhanh();
}

function chayHangXemNhanh() {
  if (dangTaoXemNhanh || !hangXemNhanh.length) return;
  const viec = hangXemNhanh.shift();
  dangTaoXemNhanh = viec.thu_muc;
  const nguon = path.join(SAN_PHAM, viec.thu_muc, viec.video);
  const tt = thongTinTep(nguon);
  const xong = (loi) => {
    if (tt) ghiJson(tepMetaXemNhanh(viec.thu_muc), { nguon: viec.video, mtime: tt.mtime, size: tt.size, loi: loi || null, luc: new Date().toISOString() });
    if (loi) console.error('Đoạn xem nhanh lỗi:', viec.thu_muc, loi);
    dangCho.delete(viec.thu_muc);
    dangTaoXemNhanh = null;
    boNhoQuet.luc = 0;
    setImmediate(chayHangXemNhanh);
  };
  const d = tt ? thoiLuong(nguon) : null;
  if (!d) return xong('không đọc được thời lượng video');

  const SO_DOAN = d < 12 ? 1 : 8;
  const vao = [];
  const loc = [];
  for (let i = 0; i < SO_DOAN; i++) {
    const t = SO_DOAN === 1 ? 0 : Math.max(0, d * (0.06 + (0.88 * i) / (SO_DOAN - 1)) - 0.5);
    vao.push('-ss', t.toFixed(2), '-t', SO_DOAN === 1 ? '8' : '1', '-i', nguon);
    loc.push(`[${i}:v]scale=480:480:force_original_aspect_ratio=decrease:force_divisible_by=2,fps=24,setsar=1,format=yuv420p[v${i}]`);
  }
  const noi = Array.from({ length: SO_DOAN }, (_, i) => `[v${i}]`).join('') + `concat=n=${SO_DOAN}:v=1:a=0[ra]`;
  const ra = tepXemNhanh(viec.thu_muc);
  const tam = ra.replace(/\.mp4$/, '.tam.mp4');
  const p = spawn(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...vao, '-filter_complex', loc.join(';') + ';' + noi,
    '-map', '[ra]', '-an', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '30', '-movflags', '+faststart', tam]);
  let loiRa = '';
  p.stderr.on('data', (b) => { loiRa += b; });
  p.on('close', (ma) => {
    if (ma === 0) { fs.renameSync(tam, ra); xong(null); }
    else { try { fs.unlinkSync(tam); } catch {} xong(loiRa.slice(-300) || `ffmpeg thoát mã ${ma}`); }
  });
}

// ---------- sổ lệnh và lượt claude ----------

const dangChay = new Map(); // mã lệnh → { dung() }

function luuSoLenh() { ghiJson(TEP_SO_LENH, soLenh); }

// Kiểm điều kiện giao lệnh (thêm 28/10/2026): lệnh `claude` đã đăng nhập chưa, thư mục Media đã được tin cậy chưa.
// Chưa đăng nhập thì không mở lượt nào (lệnh giữ "Chờ tới lượt", tự chạy khi đăng nhập xong) thay vì ghi "Lỗi"
// ngay; chưa tin cậy thì `claude --bg` không mở được phiên nên lệnh chạy ẩn, không hiện thành phiên trong ứng dụng.
const dieuKien = { dang_nhap: null, tin_cay: null, kiem_luc: 0 };
let dangKiemDieuKien = false;
async function kiemDieuKien() {
  if (dangKiemDieuKien) return;
  dangKiemDieuKien = true;
  try {
    const r = await chayClaudeNgan(['auth', 'status'], 20);
    let ts = null;
    try { ts = JSON.parse(r.ra); } catch {}
    dieuKien.dang_nhap = ts ? Boolean(ts.loggedIn) : null; // không đọc được thì không chặn
    const cauHinh = docJson(path.join(os.homedir(), '.claude.json'), {});
    dieuKien.tin_cay = Boolean(cauHinh.projects?.[GOC]?.hasTrustDialogAccepted);
    dieuKien.kiem_luc = Date.now();
  } finally { dangKiemDieuKien = false; }
  if (dieuKien.dang_nhap !== false) chayLenhTiepTheo();
  setTimeout(kiemDieuKien, dieuKien.dang_nhap === false ? 20e3 : 120e3);
}

function canhBaoDieuKien() {
  const cb = [];
  if (dieuKien.dang_nhap === false) cb.push('Lệnh claude trên máy chưa đăng nhập (phiên đăng nhập đã hết hạn), nên bảng không mở được phiên Claude nào. '
    + 'Mở Terminal, chạy: claude auth login — đăng nhập xong thì lệnh đang chờ tự chạy, không phải bấm lại.');
  if (CHE_DO_PHIEN === 'nen' && dieuKien.tin_cay === false) cb.push('Thư mục Media chưa được tin cậy nên lệnh chỉ chạy ẩn (claude -p), không hiện thành phiên trong ứng dụng Claude và không trả lời trực tiếp được. '
    + 'Chạy lệnh ghi tin cậy trong scripts/bang_video/HUONG_DAN.md, mục "Việc Trung phải làm một lần".');
  return cb;
}

function moTaBuoc(khoi) {
  const vao = khoi.input || {};
  const rutGon = (s, n = 90) => (s && s.length > n ? s.slice(0, n - 1) + '…' : s || '');
  const tuongDoi = (p) => (p ? p.replace(GOC + '/', '') : '');
  switch (khoi.name) {
    case 'Bash': return 'Chạy lệnh: ' + rutGon(vao.description || vao.command);
    case 'Read': return 'Đọc ' + tuongDoi(vao.file_path);
    case 'Edit': return 'Sửa ' + tuongDoi(vao.file_path);
    case 'Write': return 'Ghi ' + tuongDoi(vao.file_path);
    case 'Grep': return 'Tìm "' + rutGon(vao.pattern, 50) + '"';
    case 'Glob': return 'Tìm file ' + rutGon(vao.pattern, 50);
    case 'Agent': case 'Task': return 'Giao tác tử con: ' + rutGon(vao.description);
    case 'Skill': return 'Dùng skill ' + (vao.skill || '');
    default: return 'Dùng công cụ ' + khoi.name;
  }
}

function loiNhacLenh(lenh, v, cheDo) {
  const nen = cheDo === 'nen';
  const tieuDe = v ? v.ten : lenh.ten_video;
  if (lenh.noi_tiep_phien) {
    return [
      `Trung trả lời hoặc chỉ đạo tiếp trên bảng theo dõi video, cho video "${tieuDe}" (san_pham/${lenh.thu_muc}/):`,
      '"""', lenh.noi_dung, '"""',
      nen
        ? 'Làm tiếp theo đúng các quy tắc của lượt trước (phần cần Trung chọn thì hỏi bằng công cụ bảng hỏi tích chọn rồi chờ; commit đúng file đã sửa; báo cáo cuối tối đa 10 dòng tiếng Việt).'
        : 'Làm tiếp theo đúng các quy tắc của lượt trước (lượt không tương tác, không hỏi lại được; phần cần Trung chọn ghi dưới dòng "CẦN TRUNG TRẢ LỜI:"; commit đúng file đã sửa; báo cáo cuối tối đa 10 dòng tiếng Việt).',
    ].join('\n');
  }
  return [
    nen
      ? 'Bạn đang chạy một phiên Claude Code CHẠY NỀN, khởi động từ bảng theo dõi video của project Media (scripts/bang_video/). Trung xem được phiên này (ứng dụng Claude, claude.ai/code, điện thoại) và trả lời được ngay trong phiên. Trung vừa bấm nút "Chuyển lệnh" ở một video trên bảng.'
      : 'Bạn đang chạy một lượt Claude Code KHÔNG TƯƠNG TÁC, khởi động từ bảng theo dõi video của project Media (scripts/bang_video/). Trung vừa bấm nút "Chuyển lệnh" ở một video trên bảng.',
    '',
    `Video: ${tieuDe}`,
    `Thư mục sản phẩm: san_pham/${lenh.thu_muc}/`,
    v ? `Trạng thái hiện tại: ${v.nhan_trang_thai}${v.chi_tiet_trang_thai ? ' — ' + v.chi_tiet_trang_thai : ''}` : '',
    v?.video ? `Video chính: san_pham/${lenh.thu_muc}/${v.video}` : 'Chưa có file video.',
    v?.kich_ban ? `Kịch bản: san_pham/${lenh.thu_muc}/${v.kich_ban}` : '',
    `Nguồn gốc (mã dựng, lệnh dựng lại): san_pham/${lenh.thu_muc}/tai_nguyen/nguon_goc.md`,
    '',
    'Ý kiến chỉ đạo của Trung:',
    '"""', lenh.noi_dung, '"""',
    '',
    'Cách làm:',
    '1. Đọc AGENTS.md, rồi nguon_goc.md và kịch bản của video này; mở đúng module theo bảng điều hướng (nạp lười, không quét thư viện Node).',
    '2. Trung bấm nút là đã đồng ý cho chạy việc dựng, kết xuất của RIÊNG video này. Việc tốn hơn mức đó (cả chuỗi video, cảnh Blender, nhoè chuyển động 60 khung/giây, phần mềm trả phí) thì KHÔNG chạy, chỉ ghi ước tính chi phí vào phần câu hỏi.',
    nen
      ? '3. Phần nào của lệnh mơ hồ hoặc cần Trung chọn (lối viết, tổ hợp dựng, duyệt chữ, phương án sửa) thì không tự đoán: làm phần chắc chắn trước, rồi hỏi bằng công cụ bảng hỏi tích chọn (AskUserQuestion), mỗi câu 2–4 phương án, phương án khuyến nghị đứng đầu, nói rõ hệ quả từng phương án, rồi chờ Trung trả lời ngay trong phiên (bảng video hiện nhãn "Đang chờ Trung").'
      : '3. Lượt này không hỏi lại được. Phần nào của lệnh mơ hồ hoặc cần Trung chọn (lối viết, tổ hợp dựng, duyệt chữ, phương án sửa) thì không tự đoán: làm phần chắc chắn, rồi ghi câu hỏi ở cuối câu trả lời dưới một dòng đúng chữ "CẦN TRUNG TRẢ LỜI:", mỗi câu kèm 2–3 phương án, phương án khuyến nghị đứng đầu, nói rõ hệ quả từng phương án.',
    '4. Theo "Quy ước sản phẩm" trong AGENTS.md: ngoài cùng thư mục sản phẩm mỗi nền tảng một video, tên file có nền tảng (youtube, shorts, reels, tiktok, facebook, zalo); bản cũ chuyển vào tai_nguyen/ban_nhap/ hoặc tai_nguyen/phien_ban_cu/; cập nhật dòng "Trạng thái" trong nguon_goc.md khi trạng thái video đổi; kịch bản sửa thì ghi vào tai_nguyen/kich_ban/.',
    '5. Có phiên Claude khác có thể đang làm trong Media: trước khi kết xuất đếm tiến trình Remotion như nguon_goc.md hướng dẫn; không sửa file của video khác.',
    '6. Cuối lượt: git add đúng file đã sửa rồi git commit (không gộp thay đổi treo không phải của lượt này).',
    nen
      ? '7. Câu trả lời cuối cùng là báo cáo hiện trên bảng cho Trung đọc: tiếng Việt, không ví von, tối đa 10 dòng (đã làm gì, file nào đổi, còn gì dở). Câu hỏi đã hỏi bằng bảng hỏi trong phiên, không ghi lại ở đây.'
      : '7. Câu trả lời cuối cùng là báo cáo hiện trên bảng cho Trung đọc: tiếng Việt, không ví von, tối đa 10 dòng (đã làm gì, file nào đổi, còn gì dở), rồi phần câu hỏi nếu có.',
  ].filter((d) => d !== '').join('\n');
}

function loiNhacTrend(lenh, cheDo) {
  const nen = cheDo === 'nen';
  const t = lenh.trend || {};
  if (lenh.noi_tiep_phien) {
    return [
      'Trung trả lời hoặc chỉ đạo tiếp trên thẻ Trend của bảng theo dõi video, cho lượt tạo trend trước:',
      '"""', lenh.noi_dung, '"""',
      nen
        ? 'Làm tiếp theo đúng các quy tắc của lượt trước (phần cần Trung chọn thì hỏi bằng công cụ bảng hỏi tích chọn rồi chờ; dựng lại sổ bằng so_trend.py dung nếu dữ liệu đổi; commit đúng file đã sửa; báo cáo cuối tối đa 12 dòng tiếng Việt).'
        : 'Làm tiếp theo đúng các quy tắc của lượt trước (lượt không tương tác; phần cần Trung chọn ghi dưới dòng "CẦN TRUNG TRẢ LỜI:"; dựng lại sổ bằng so_trend.py dung nếu dữ liệu đổi; commit đúng file đã sửa; báo cáo cuối tối đa 12 dòng tiếng Việt).',
    ].join('\n');
  }
  return [
    nen
      ? 'Bạn đang chạy một phiên Claude Code CHẠY NỀN, khởi động từ thẻ Trend của bảng theo dõi video project Media (scripts/bang_video/). Trung xem và trả lời được ngay trong phiên. Trung vừa bấm "Chạy tạo trend".'
      : 'Bạn đang chạy một lượt Claude Code KHÔNG TƯƠNG TÁC, khởi động từ thẻ Trend của bảng theo dõi video project Media (scripts/bang_video/). Trung vừa bấm "Chạy tạo trend".',
    '',
    'Yêu cầu nghiên cứu:',
    `- Chủ đề, từ khoá: ${t.chu_de || '(trống: rà chung theo lĩnh vực kênh, chế độ đầy đủ)'}`,
    `- Khung thời gian: ${(t.khung || []).map((k) => KHUNG_TREND[k]).join(', ')} → tham số --khung ${(t.khung || []).join(',')}`,
    `- Nền tảng: ${(t.nen_tang || []).map((n) => NEN_TANG_TREND[n]).join(', ')}`,
    t.sau ? `- Nghiên cứu sâu một dòng của sổ trend: "${t.sau}" (tìm ngách con của đúng từ khoá này)` : '',
    t.muc_dich ? `- Mục đích, ghi chú của Trung:\n"""\n${t.muc_dich}\n"""` : '',
    '',
    'Cách làm:',
    '1. Đọc AGENTS.md rồi skills/san-trend/SKILL.md; làm một lượt ĐẦY ĐỦ theo mục "Chạy từ bảng video" của SKILL.md: script lay_trend.py đúng khung trên, Antigravity rà cùng, các nguồn Chrome thuộc nền tảng đã chọn, tìm ngách bằng Keyword Planner, phân tích, so_trend.py dung, ve_trang.py. Nền tảng không được chọn thì bỏ nguồn của nền tảng đó.',
    '2. Trung bấm nút là đã đồng ý chi phí một lượt đầy đủ (hạn mức Claude, hạn mức Gemini của Antigravity). Không làm việc gì khác ngoài lượt này.',
    nen
      ? '3. Bỏ bước 5 (bảng chọn ý tưởng, sổ thói quen), không sửa tu_khoa_kenh.json. Phần cần Trung quyết thì hỏi bằng công cụ bảng hỏi tích chọn (AskUserQuestion), mỗi câu 2–4 phương án, phương án khuyến nghị đứng đầu, rồi chờ Trung trả lời trong phiên.'
      : '3. Lượt không hỏi lại được: bỏ bước 5 (bảng chọn ý tưởng, sổ thói quen), không sửa tu_khoa_kenh.json. Phần cần Trung quyết ghi ở cuối câu trả lời dưới một dòng đúng chữ "CẦN TRUNG TRẢ LỜI:", mỗi câu kèm 2–3 phương án, phương án khuyến nghị đứng đầu.',
    '4. Giữ nguyên quy tắc dừng của bước Chrome: gặp đăng nhập, xác minh, CAPTCHA, cảnh báo dùng quá nhanh thì dừng nguồn đó, ghi trạng thái, làm tiếp nguồn khác. Chrome không kết nối được thì ghi bo_qua. App Antigravity tắt mà không mở được thì ghi antigravity.json trạng thái bo_qua.',
    '5. Đọc du_lieu/bang_video/trend_nhap.json: từ khoá Trung đánh "bo" không đưa vào ý tưởng; từ khoá "theo_doi" kiểm lại trong lượt này.',
    '6. Cuối lượt: git add đúng file đã sửa (nếu có) rồi git commit; du_lieu/trend/ nằm ngoài git, không thêm vào.',
    '7. Câu trả lời cuối là báo cáo hiện trên bảng cho Trung đọc: tiếng Việt, không ví von, tối đa 12 dòng: nguồn nào đạt hoặc lỗi, Antigravity được bao nhiêu mục đạt đối chiếu, 5 từ khoá điểm nóng cao nhất thuộc nhóm chủ đề hoặc lĩnh vực (kèm điểm và bằng chứng), đường dẫn trang HTML báo cáo; rồi phần câu hỏi nếu có.',
  ].filter((d) => d !== '').join('\n');
}

// Mỗi lượt chạy ở một trong hai kiểu (sổ nợ N58 đợt 2, Trung chốt 28/10/2026):
// - "nen" (mặc định): phiên Claude Code chạy nền có tên và Remote Control (`claude --bg`). Trung xem và trả lời ngay
//   trong phiên (ứng dụng Claude qua nút "Mở trong ứng dụng", claude.ai/code, điện thoại, `claude attach`). Máy chủ
//   đọc file hội thoại của phiên để cập nhật thẻ; phiên hỏi bằng bảng chọn thì thẻ hiện "Đang chờ Trung".
// - "an": `claude -p` không tương tác như trước 28/10. Dùng khi đặt BANG_VIDEO_PHIEN=an, hoặc tự lùi về khi
//   `claude --bg` không mở được phiên (ví dụ thư mục Media chưa được chấp nhận tin cậy).
// Tối đa SO_LENH_TOI_DA lượt đang làm cùng lúc; lượt đang chờ Trung không tính. Một video chỉ một lượt một lúc;
// tạo trend chỉ một lượt một lúc (cùng dùng Chrome).
function chayLenhTiepTheo() {
  if (dieuKien.dang_nhap === false) return; // chưa đăng nhập: giữ lệnh trong hàng chờ, kiemDieuKien gọi lại
  const dangLam = soLenh.filter((l) => l.trang_thai === 'dang_chay').length;
  if (dangLam >= SO_LENH_TOI_DA) return;
  const banThuMuc = new Set(soLenh.filter((l) => ['dang_chay', 'cho_trung'].includes(l.trang_thai)).map((l) => l.thu_muc));
  const lenh = soLenh.find((l) => l.trang_thai === 'cho' && !banThuMuc.has(l.thu_muc));
  if (!lenh) return;
  const laTrend = lenh.loai === 'trend';
  const v = laTrend ? null : quetSanPham().find((x) => x.thu_muc === lenh.thu_muc);
  lenh.trang_thai = 'dang_chay';
  lenh.bat_dau = new Date().toISOString();
  lenh.buoc_cuoi = 'Khởi động Claude…';
  lenh.so_buoc = 0;
  luuSoLenh();
  if (CHE_DO_PHIEN === 'nen' && lenh.kieu_phien !== 'an') chayPhienNen(lenh, v);
  else chayPhienAn(lenh, v);
  setImmediate(chayLenhTiepTheo); // còn chỗ thì chạy thêm lệnh
}

function xongLenh(lenh) {
  dangChay.delete(lenh.ma);
  lenh.buoc_cuoi = null;
  luuSoLenh();
  boNhoQuet.luc = 0;
  setImmediate(chayLenhTiepTheo);
}

function chayPhienAn(lenh, v) {
  const laTrend = lenh.loai === 'trend';
  lenh.kieu_phien = 'an';
  const thamSo = ['-p', laTrend ? loiNhacTrend(lenh, 'an') : loiNhacLenh(lenh, v, 'an'), '--model', lenh.model, '--permission-mode', 'auto',
    '--output-format', 'stream-json', '--verbose'];
  if (laTrend) thamSo.push('--chrome'); // Keyword Planner, TikTok, Facebook đọc bằng Claude in Chrome
  if (lenh.noi_tiep_phien) thamSo.push('--resume', lenh.noi_tiep_phien);

  const nhatKy = fs.createWriteStream(path.join(NHAT_KY_LENH, lenh.ma + '.jsonl'));
  const p = spawn(CLAUDE, thamSo, { cwd: GOC, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
  dangChay.set(lenh.ma, { dung: () => p.kill('SIGTERM') });
  const hanGio = setTimeout(() => {
    lenh.ghi_chu_dung = `Quá ${HAN_LENH_PHUT} phút, máy chủ dừng lượt.`;
    p.kill('SIGTERM');
  }, HAN_LENH_PHUT * 60e3);

  let du = '';
  let vanBanCuoi = '';
  let ketQua = null;
  let loiRa = '';
  p.stdout.on('data', (b) => {
    nhatKy.write(b);
    du += b.toString();
    let i;
    while ((i = du.indexOf('\n')) >= 0) {
      const dong = du.slice(0, i).trim();
      du = du.slice(i + 1);
      if (!dong) continue;
      let ev;
      try { ev = JSON.parse(dong); } catch { continue; }
      if (ev.type === 'system' && ev.subtype === 'init' && ev.session_id) {
        lenh.session_id = ev.session_id;
      } else if (ev.type === 'assistant' && Array.isArray(ev.message?.content)) {
        for (const k of ev.message.content) {
          if (k.type === 'tool_use') { lenh.buoc_cuoi = moTaBuoc(k); lenh.so_buoc = (lenh.so_buoc || 0) + 1; }
          else if (k.type === 'text' && k.text?.trim()) { vanBanCuoi = k.text.trim(); lenh.buoc_cuoi = 'Viết: ' + vanBanCuoi.slice(0, 90); }
        }
      } else if (ev.type === 'result') {
        ketQua = ev;
      }
    }
    luuSoLenhCham();
  });
  p.stderr.on('data', (b) => { loiRa += b.toString(); if (loiRa.length > 4000) loiRa = loiRa.slice(-4000); });
  p.on('error', (e) => { loiRa += '\n' + e.message; });
  p.on('close', (ma) => {
    clearTimeout(hanGio);
    nhatKy.end();
    lenh.ket_thuc = new Date().toISOString();
    lenh.ket_qua = [lenh.ghi_chu_phien, (ketQua?.result || vanBanCuoi || '').trim()].filter(Boolean).join('\n\n');
    if (ketQua?.session_id) lenh.session_id = ketQua.session_id;
    if (typeof ketQua?.total_cost_usd === 'number') lenh.chi_phi_usd = Math.round(ketQua.total_cost_usd * 100) / 100;
    if (ketQua?.num_turns) lenh.so_luot = ketQua.num_turns;
    if (lenh.trang_thai === 'da_dung') {
      // Trung bấm dừng
    } else if (ketQua && !ketQua.is_error && ma === 0) {
      lenh.trang_thai = /CẦN TRUNG TRẢ LỜI/i.test(lenh.ket_qua) ? 'can_tra_loi' : 'xong';
    } else if (/Failed to authenticate|Not logged in|OAuth session expired|Please run \/login/i.test(lenh.ket_qua + loiRa)) {
      // hết hạn đăng nhập giữa chừng: trả lệnh về hàng chờ, chạy lại khi đăng nhập xong
      dieuKien.dang_nhap = false;
      Object.assign(lenh, { trang_thai: 'cho', bat_dau: null, ket_thuc: null, ket_qua: null, ghi_chu_phien: null, kieu_phien: null, session_id: null, buoc_cuoi: 'Đợi đăng nhập lại lệnh claude' });
    } else {
      lenh.trang_thai = 'loi';
      const chiTiet = lenh.ghi_chu_dung || loiRa.trim().slice(-800) || `claude thoát mã ${ma}`;
      lenh.ket_qua = [lenh.ket_qua, '[Lỗi] ' + chiTiet].filter(Boolean).join('\n\n');
    }
    xongLenh(lenh);
  });
}

// Chạy một lệnh claude ngắn (không phải lượt làm việc), trả { ma, ra, loi }.
function chayClaudeNgan(thamSo, giayToiDa = 60) {
  return new Promise((xong) => {
    const p = spawn(CLAUDE, thamSo, { cwd: GOC, env: process.env, stdio: ['ignore', 'pipe', 'pipe'] });
    let ra = '', loi = '';
    const h = setTimeout(() => p.kill('SIGTERM'), giayToiDa * 1000);
    p.stdout.on('data', (b) => { ra += b; });
    p.stderr.on('data', (b) => { loi += b; });
    p.on('error', (e) => { loi += e.message; });
    p.on('close', (ma) => { clearTimeout(h); xong({ ma: ma ?? 1, ra, loi }); });
  });
}

async function docAgents() {
  const r = await chayClaudeNgan(['agents', '--json', '--all'], 30);
  try { return JSON.parse(r.ra); } catch { return []; }
}

async function chayPhienNen(lenh, v) {
  const laTrend = lenh.loai === 'trend';
  const ten = ('Bảng video · ' + (lenh.ten_video || lenh.thu_muc)).slice(0, 80);
  const thamSo = ['--bg', '--model', lenh.model, '--permission-mode', 'auto', '--remote-control', ten];
  let sid;
  if (lenh.noi_tiep_phien) { sid = lenh.noi_tiep_phien; thamSo.push('--resume', sid); }
  else { sid = crypto.randomUUID(); thamSo.push('--session-id', sid, '--name', ten); }
  if (laTrend) thamSo.push('--chrome');
  thamSo.push(laTrend ? loiNhacTrend(lenh, 'nen') : loiNhacLenh(lenh, v, 'nen'));
  const tepCu = path.join(THU_MUC_HOI_THOAI, sid + '.jsonl');
  lenh.vi_tri_dau = lenh.noi_tiep_phien && fs.existsSync(tepCu) ? fs.statSync(tepCu).size : 0;
  const r = await chayClaudeNgan(thamSo, 60);
  const ra = (r.ra + '\n' + r.loi).trim();
  fs.writeFileSync(path.join(NHAT_KY_LENH, lenh.ma + '.mo_phien.log'), ra + '\n');
  if (lenh.trang_thai === 'da_dung') return xongLenh(lenh);
  if (r.ma !== 0) {
    // Không mở được phiên nền: chạy ẩn như trước để lệnh không bị bỏ.
    lenh.ghi_chu_phien = `[Không mở được phiên nền nên chạy ẩn. Lý do: ${ra.slice(-300) || 'claude --bg thoát mã ' + r.ma}`
      + (/trust/i.test(ra) ? ' — Thư mục Media chưa có dòng tin cậy riêng trong ~/.claude.json; Trung chạy lệnh ghi tin cậy ở scripts/bang_video/HUONG_DAN.md, mục "Việc Trung phải làm một lần".' : '') + ']';
    return chayPhienAn(lenh, v);
  }
  // Mã ngắn của phiên nền là 8 ký tự đầu mã phiên; khi nối tiếp một phiên đang chạy, claude mở bản sao có mã khác.
  let maNgan = sid.slice(0, 8);
  const ds = await docAgents();
  const tim = ds.find((a) => a.kind === 'background' && a.id && ra.includes(a.id) && a.sessionId) || ds.find((a) => a.sessionId === sid);
  if (tim) { maNgan = tim.id; sid = tim.sessionId; }
  lenh.kieu_phien = 'nen';
  lenh.session_id = sid;
  lenh.ma_nen = maNgan;
  luuSoLenh();
  theoDoiPhienNen(lenh);
  if (MO_APP_TU_DONG) moPhienTrongApp(lenh);
  // Địa chỉ claude.ai/code của phiên (Remote Control) in trong nhật ký phiên nền
  setTimeout(async () => {
    const l = await chayClaudeNgan(['logs', maNgan], 20);
    const m = (l.ra + l.loi).match(/https:\/\/claude\.ai\/code\/[A-Za-z0-9_\-/]+/);
    if (m) { lenh.link_web = m[0]; luuSoLenhCham(); }
  }, 15000);
}

function theoDoiPhienNen(lenh) {
  const tep = path.join(THU_MUC_HOI_THOAI, lenh.session_id + '.jsonl');
  let viTri = lenh.vi_tri_dau || 0;
  const giaiMa = new StringDecoder('utf8');
  let du = '';
  let vanBanCuoi = '';
  let hoiCho = null;       // mã lời gọi AskUserQuestion chưa có câu trả lời
  let bacTac = false;      // claude agents báo phiên đang chặn (chờ câu hỏi hoặc chờ duyệt quyền)
  let lanDocAgents = 0;
  let giayLam = 0;         // chỉ tính lúc Claude đang làm, không tính lúc chờ Trung
  const batDau = Date.now();
  let daXong = false;
  let henKetThuc = false;
  dangChay.set(lenh.ma, { dung: () => chayClaudeNgan(['stop', lenh.ma_nen || lenh.session_id.slice(0, 8)], 30) });

  const ketThuc = (trangThai, ghi) => {
    if (daXong) return;
    daXong = true;
    clearInterval(nhip);
    lenh.ket_thuc = new Date().toISOString();
    lenh.ket_qua = [lenh.ghi_chu_phien, vanBanCuoi, ghi].filter(Boolean).join('\n\n');
    if (lenh.trang_thai !== 'da_dung') lenh.trang_thai = trangThai === 'xong' && /CẦN TRUNG TRẢ LỜI/i.test(vanBanCuoi) ? 'can_tra_loi' : trangThai;
    xongLenh(lenh);
  };

  const docDong = (dong) => {
    let d;
    try { d = JSON.parse(dong); } catch { return; }
    const nd = d.message?.content;
    if (d.type === 'assistant' && Array.isArray(nd)) {
      for (const k of nd) {
        if (k.type === 'tool_use') {
          lenh.buoc_cuoi = moTaBuoc(k);
          lenh.so_buoc = (lenh.so_buoc || 0) + 1;
          if (k.name === 'AskUserQuestion') hoiCho = k.id;
        } else if (k.type === 'text' && k.text?.trim()) { vanBanCuoi = k.text.trim(); lenh.buoc_cuoi = 'Viết: ' + vanBanCuoi.slice(0, 90); }
      }
    } else if (d.type === 'user' && Array.isArray(nd)) {
      if (nd.some((k) => k.type === 'tool_result' && k.tool_use_id === hoiCho)) hoiCho = null;
    } else if (d.type === 'cost-state' && typeof d.totalCostUSD === 'number') {
      lenh.chi_phi_usd = Math.round(d.totalCostUSD * 100) / 100;
    } else if (d.type === 'system' && d.subtype === 'turn_duration') {
      ketThuc('xong');
    }
  };

  const nhip = setInterval(async () => {
    if (daXong) return;
    let st = null;
    try { st = fs.statSync(tep); } catch {}
    if (!st) {
      if (Date.now() - batDau > 120e3) ketThuc('loi', `[Lỗi] Không thấy file hội thoại của phiên nền ${lenh.ma_nen} sau 2 phút.`);
      return;
    }
    if (st.size > viTri) {
      const fd = fs.openSync(tep, 'r');
      const buf = Buffer.alloc(st.size - viTri);
      fs.readSync(fd, buf, 0, buf.length, viTri);
      fs.closeSync(fd);
      viTri = st.size;
      du += giaiMa.write(buf);
      let i;
      while ((i = du.indexOf('\n')) >= 0) { const dong = du.slice(0, i).trim(); du = du.slice(i + 1); if (dong) docDong(dong); }
      if (daXong) return;
    }
    if (Date.now() - lanDocAgents > 10e3) {
      lanDocAgents = Date.now();
      const a = (await docAgents()).find((x) => x.sessionId === lenh.session_id || x.id === lenh.ma_nen);
      bacTac = a?.state === 'blocked';
      if (lenh.da_chuyen_app && a && ['stopped', 'done'].includes(a.state)) {
        return ketThuc('xong', `[Đã chuyển sang ứng dụng Claude: phiên “${('Bảng video · ' + (lenh.ten_video || lenh.thu_muc)).slice(0, 80)}” ở thanh bên ứng dụng, làm tiếp và trả lời trong đó.]`);
      }
      if (!henKetThuc && a && ['stopped', 'done'].includes(a.state) && Date.now() - batDau > 60e3) {
        henKetThuc = true;
        // phiên đã dừng mà chưa ghi hết lượt: đọc nốt lần sau, quá 30 giây nữa thì kết thúc
        setTimeout(() => ketThuc(a.state === 'stopped' ? (lenh.trang_thai === 'da_dung' ? 'da_dung' : 'loi') : 'xong',
          a.state === 'stopped' ? '[Phiên nền đã dừng.]' : ''), 30e3);
      }
    }
    if (daXong) return;
    const truoc = lenh.trang_thai;
    if (truoc !== 'da_dung') lenh.trang_thai = hoiCho || bacTac ? 'cho_trung' : 'dang_chay';
    if (lenh.trang_thai === 'dang_chay') giayLam += 3;
    if (giayLam > HAN_LENH_PHUT * 60) {
      chayClaudeNgan(['stop', lenh.ma_nen], 30);
      return ketThuc('loi', `[Lỗi] Quá ${HAN_LENH_PHUT} phút làm việc, máy chủ dừng phiên nền ${lenh.ma_nen}.`);
    }
    if (truoc !== lenh.trang_thai) { luuSoLenh(); if (lenh.trang_thai === 'cho_trung') setImmediate(chayLenhTiepTheo); }
    else luuSoLenhCham();
  }, 3000);
}

// Đưa phiên vào thanh bên ứng dụng Claude. `claude --desktop` cần cửa sổ dòng lệnh thật nên bọc bằng `script`
// (đo 28/10/2026, Claude Code 2.1.310). Chưa thử khi phiên nền đang chạy: có thể ngắt lượt đang làm.
// `claude --desktop --resume` từ chối phiên nền còn sống ("That session is running in the background", kiểm 28/10/2026),
// kể cả lúc phiên chỉ đang chờ Trung trả lời. Nên dừng phiên nền trước (file hội thoại giữ nguyên), chờ dừng hẳn, rồi mới
// đưa vào ứng dụng; lệnh ghi "Xong" kèm ghi chú đã chuyển sang ứng dụng.
async function moPhienTrongApp(lenh) {
  if (lenh.kieu_phien === 'nen') {
    const conSong = (ds) => ds.find((a) => (a.sessionId === lenh.session_id || a.id === lenh.ma_nen) && !['stopped', 'done'].includes(a.state));
    if (conSong(await docAgents())) {
      lenh.da_chuyen_app = true;
      await chayClaudeNgan(['stop', lenh.ma_nen || lenh.session_id.slice(0, 8)], 30);
      for (let i = 0; i < 15 && conSong(await docAgents()); i++) await new Promise((r) => setTimeout(r, 1000));
    }
  }
  const p = spawn('script', ['-q', '/dev/null', CLAUDE, '--desktop', '--resume', lenh.session_id],
    { cwd: GOC, env: process.env, stdio: 'ignore', detached: true });
  p.unref();
}

let henLuu = null;
function luuSoLenhCham() {
  if (henLuu) return;
  henLuu = setTimeout(() => { henLuu = null; luuSoLenh(); }, 2000);
}

// ---------- HTTP ----------

function guiJson(res, ma, duLieu) {
  res.writeHead(ma, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(duLieu));
}

// sổ trend: đọc lại khi file đổi
let boNhoSoTrend = { mtime: 0, du: null };
function docSoTrend() {
  const st = thongTinTep(TEP_SO_TREND);
  if (!st) return { so_luot: 0, luot: [], y_tuong: [], dong: [] };
  if (st.mtime !== boNhoSoTrend.mtime) boNhoSoTrend = { mtime: st.mtime, du: docJson(TEP_SO_TREND, { so_luot: 0, luot: [], y_tuong: [], dong: [] }) };
  return boNhoSoTrend.du;
}

function taoLenh(truong) {
  const lenh = {
    ma: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + '_' + crypto.randomBytes(2).toString('hex'),
    trang_thai: 'cho', tao_luc: new Date().toISOString(), noi_tiep_phien: null, ...truong,
  };
  soLenh.push(lenh);
  luuSoLenh();
  setImmediate(chayLenhTiepTheo);
  return lenh;
}

const KIEU = { '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };

function guiTep(req, res, tep) {
  let st;
  try { st = fs.statSync(tep); } catch { res.writeHead(404); return res.end('Không có file'); }
  if (!st.isFile()) { res.writeHead(404); return res.end(); }
  const kieu = KIEU[path.extname(tep).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range && req.headers.range.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    let dau = range[1] === '' ? st.size - Number(range[2]) : Number(range[1]);
    let cuoi = range[1] !== '' && range[2] !== '' ? Number(range[2]) : st.size - 1;
    if (dau < 0) dau = 0;
    if (cuoi >= st.size) cuoi = st.size - 1;
    if (dau > cuoi) { res.writeHead(416, { 'Content-Range': `bytes */${st.size}` }); return res.end(); }
    res.writeHead(206, { 'Content-Type': kieu, 'Content-Length': cuoi - dau + 1, 'Content-Range': `bytes ${dau}-${cuoi}/${st.size}`, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
    fs.createReadStream(tep, { start: dau, end: cuoi }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': kieu, 'Content-Length': st.size, 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' });
    fs.createReadStream(tep).pipe(res);
  }
}

// đường dẫn phải nằm trong thư mục gốc cho phép
function trongThuMuc(goc, tuongDoi) {
  const p = path.resolve(goc, tuongDoi);
  return p.startsWith(goc + path.sep) ? p : null;
}

async function docThan(req) {
  let s = '';
  for await (const b of req) { s += b; if (s.length > 100_000) throw new Error('quá dài'); }
  return JSON.parse(s || '{}');
}

// Thư mục video đã lên kênh mang tiêu đề YouTube có dấu, dấu cách, dấu hỏi (Trung chốt 30/10/2026); chỉ cấm ký tự tách đường dẫn.
const MAU_TEN_THU_MUC = /^\d{4}\.\d{2}\.\d{2}\.[^/\\\0]+$/;

const dangSong = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };

function duLieuPhaMay() {
  const thuMucPhieu = path.join(DU_LIEU_PHA_MAY, 'phieu');
  const phieu = (fs.existsSync(thuMucPhieu) ? fs.readdirSync(thuMucPhieu) : []).filter((t) => t.endsWith('.json'))
    .map((t) => docJson(path.join(thuMucPhieu, t), null)).filter(Boolean)
    .map((x) => ({
      ma: x.ma, du_an: x.du_an, san_pham: x.san_pham, trang_thai: x.trang_thai, chuong_sua: x.chuong_sua, cap_nhat_luc: x.cap_nhat_luc,
      buoc: (x.buoc || []).map((b) => ({ ten: b.ten, trang_thai: b.trang_thai, giay: b.giay, ghi_chu: b.ghi_chu })),
      ket_qua: x.ket_qua ? { ...x.ket_qua, bang_soat: (x.ket_qua.bang_soat || []).length } : null,
    }))
    .sort((a, b) => String(b.cap_nhat_luc).localeCompare(String(a.cap_nhat_luc)));
  const trinhChay = trinhChayPhaMay();
  for (const x of phieu) x.pid_chay = trinhChay.find((k) => k.phieu?.includes(x.ma))?.pid || null;
  let nhatKy = '';
  try { nhatKy = fs.readFileSync(path.join(DU_LIEU_PHA_MAY, 'chay.log'), 'utf8').split('\n').slice(-25).join('\n'); } catch {}
  return { phieu, dang_chay: trinhChay.find((k) => k.chinh) || null, trinh_chay: trinhChay, nhat_ky: nhatKy };
}

// Các trình chạy pha máy còn sống: trình chạy chính giữ dang_chay.json, lệnh `chay --chi <mã>` khởi động khi trình
// chạy chính đang chạy giữ dang_chay_<mã>.json. Chỉ nhận PID mà dòng lệnh đúng là pha_may.mjs (PID đã chết có thể
// được hệ điều hành cấp lại cho tiến trình khác).
function trinhChayPhaMay() {
  const ds = fs.existsSync(DU_LIEU_PHA_MAY) ? fs.readdirSync(DU_LIEU_PHA_MAY).filter((t) => /^dang_chay(_[A-Za-z0-9_]+)?\.json$/.test(t)) : [];
  return ds.map((t) => ({ ...docJson(path.join(DU_LIEU_PHA_MAY, t), {}), chinh: t === 'dang_chay.json' }))
    .filter((k) => Number.isInteger(k.pid) && dangSong(k.pid)
      && spawnSync('ps', ['-p', String(k.pid), '-o', 'command='], { encoding: 'utf8' }).stdout.includes('pha_may.mjs'));
}

function duLieuTrang() {
  const ds = quetSanPham().map((v) => ({ ...v, xem_nhanh: trangThaiXemNhanh(v) }));
  return {
    cap_nhat_luc: new Date().toISOString(),
    videos: ds,
    chien_dich: dsChienDich.map((c) => ({ ma: c.ma, ten: c.ten })),
    lenh: soLenh.slice(-300),
    so_lenh_toi_da: SO_LENH_TOI_DA,
    che_do_phien: CHE_DO_PHIEN,
    canh_bao: canhBaoDieuKien(),
    dang_tao_xem_nhanh: dangTaoXemNhanh,
    so_xem_nhanh_cho: hangXemNhanh.length,
  };
}

const may = http.createServer(async (req, res) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host !== `localhost:${CONG}` && host !== `127.0.0.1:${CONG}`) { res.writeHead(403); return res.end('Sai địa chỉ'); }
  const url = new URL(req.url, `http://${host}`);
  const p = decodeURIComponent(url.pathname);

  try {
    if (req.method === 'GET' && (p === '/' || p === '/index.html')) {
      const html = fs.readFileSync(path.join(THU_MUC_MA, 'trang.html'), 'utf8').replace('__MA_PHIEN__', MA_PHIEN);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      return res.end(html);
    }
    if (req.method === 'GET' && p === '/api/du_lieu') return guiJson(res, 200, duLieuTrang());
    if (req.method === 'GET' && p === '/api/trend') {
      return guiJson(res, 200, { so: docSoTrend(), nhap: trendNhap,
        video: quetSanPham().filter((v) => v.loai === 'video').map((v) => ({ thu_muc: v.thu_muc, ten: v.ten })) });
    }
    if (req.method === 'GET' && p.startsWith('/bao_cao/')) {
      // chỉ trang báo cáo trend do ve_trang.py sinh, không cho chạy mã trong trang
      const tuongDoi = p.slice(9);
      const tep = trongThuMuc(SAN_PHAM, tuongDoi);
      if (!tep || !/^\d{4}\.\d{2}\.\d{2}\.bao_cao_trend\//.test(tuongDoi) || !tep.endsWith('.html') || !fs.existsSync(tep)) {
        res.writeHead(404); return res.end('Không có trang báo cáo');
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:" });
      return fs.createReadStream(tep).pipe(res);
    }
    if (req.method === 'GET' && p === '/api/pha_may') return guiJson(res, 200, duLieuPhaMay());
    if (req.method === 'GET' && p === '/api/chien_dich') return guiJson(res, 200, baoCaoChienDich());
    // sổ việc dở: các phiên Claude tự ghi vào du_lieu/bang_video/viec_do.json, nên đọc lại mỗi lần
    if (req.method === 'GET' && p === '/api/viec_do') return guiJson(res, 200, docJson(TEP_VIEC_DO, { viec: [] }));
    // bảng quy tắc chiến dịch: phiên Claude cũng sửa file này, nên đọc lại mỗi lần
    if (req.method === 'GET' && p === '/api/quy_tac') {
      const cd = url.searchParams.get('cd') || '';
      return guiJson(res, 200, docJson(TEP_QUY_TAC, {})[cd] || null);
    }
    if (req.method === 'GET' && p.startsWith('/pha_may/')) {
      // báo cáo, bảng ảnh soát, bản đủ của một phiếu: chỉ đúng các file phiếu ghi, nằm trong out/pha_may/ của dự án
      const [, , loai, ma, so] = p.split('/');
      const phieu = MAU_MA_PHIEU.test(ma || '') ? docJson(path.join(DU_LIEU_PHA_MAY, 'phieu', ma + '.json'), null) : null;
      if (!phieu) { res.writeHead(404); return res.end('Không có phiếu'); }
      if (loai === 'bao_cao' || loai === 'nhat_ky') {
        const tep = loai === 'bao_cao' ? path.join(DU_LIEU_PHA_MAY, 'bao_cao', ma + '.md') : path.join(DU_LIEU_PHA_MAY, `chay_${ma}.log`);
        if (!fs.existsSync(tep)) { res.writeHead(404); return res.end(loai === 'bao_cao' ? 'Chưa có báo cáo' : 'Chưa có nhật ký chạy riêng'); }
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'Content-Security-Policy': "default-src 'none'" });
        return fs.createReadStream(tep).pipe(res);
      }
      const tuongDoi = loai === 'anh' ? phieu.ket_qua?.bang_soat?.[Number(so)] : loai === 'video' ? phieu.ket_qua?.file_du : null;
      const tep = tuongDoi ? path.resolve(GOC, tuongDoi) : null;
      if (!tep || !tep.includes(`${path.sep}out${path.sep}pha_may${path.sep}`) || !/\.(jpg|mp4)$/.test(tep)) { res.writeHead(404); return res.end(); }
      return guiTep(req, res, tep);
    }
    if (req.method === 'GET' && p.startsWith('/tep/')) {
      const tep = trongThuMuc(SAN_PHAM, p.slice(5));
      if (!tep || !KIEU[path.extname(tep).toLowerCase()]) { res.writeHead(403); return res.end(); }
      return guiTep(req, res, tep);
    }
    if (req.method === 'GET' && p.startsWith('/xem_nhanh/')) {
      const tep = trongThuMuc(XEM_NHANH, p.slice(11));
      if (!tep || !tep.endsWith('.mp4')) { res.writeHead(403); return res.end(); }
      return guiTep(req, res, tep);
    }

    if (req.method === 'POST') {
      if (req.headers['x-ma-phien'] !== MA_PHIEN) return guiJson(res, 403, { loi: 'Thiếu mã phiên. Tải lại trang.' });
      const than = await docThan(req);
      const thuMuc = String(than.thu_muc || '');
      const canThuMuc = !['/api/dung', '/api/tat', '/api/mo_phien', '/api/xem_phien'].includes(p) && !p.startsWith('/api/trend/') && !p.startsWith('/api/pha_may/') && p !== '/api/chien_dich/cap_nhat' && p !== '/api/viec_do/xong' && !p.startsWith('/api/quy_tac/');
      if (canThuMuc && !MAU_TEN_THU_MUC.test(thuMuc)) return guiJson(res, 400, { loi: 'Sai tên thư mục' });

      if (p === '/api/trend/chay') {
        const chuDe = String(than.chu_de || '').replace(/\s+/g, ' ').trim().slice(0, 500);
        const khung = Object.keys(KHUNG_TREND).filter((k) => (than.khung || []).includes(k));
        const nenTang = Object.keys(NEN_TANG_TREND).filter((k) => (than.nen_tang || []).includes(k));
        if (!khung.length) return guiJson(res, 400, { loi: 'Chọn ít nhất một khung thời gian' });
        if (!nenTang.length) return guiJson(res, 400, { loi: 'Chọn ít nhất một nền tảng' });
        const mucDich = String(than.muc_dich || '').trim().slice(0, 4000);
        const sau = String(than.sau || '').trim().slice(0, 200);
        const lenh = taoLenh({
          loai: 'trend', thu_muc: '_trend', ten_video: 'Tạo trend: ' + (chuDe || 'rà chung'),
          noi_dung: [chuDe ? 'Chủ đề: ' + chuDe : 'Rà chung theo lĩnh vực kênh',
            'Khung: ' + khung.map((k) => KHUNG_TREND[k]).join(', '),
            'Nền tảng: ' + nenTang.map((n) => NEN_TANG_TREND[n]).join(', '), mucDich ? 'Mục đích: ' + mucDich : ''].filter(Boolean).join('\n'),
          model: MODEL_HOP_LE.has(than.model) ? than.model : 'sonnet',
          trend: { chu_de: chuDe, khung, nen_tang: nenTang, muc_dich: mucDich, sau },
        });
        return guiJson(res, 200, { ok: true, ma: lenh.ma });
      }
      if (p === '/api/trend/tra_loi') {
        const noiDung = String(than.noi_dung || '').trim();
        if (!noiDung) return guiJson(res, 400, { loi: 'Câu trả lời trống' });
        const truoc = soLenh.find((l) => l.ma === than.ma && l.loai === 'trend');
        if (!truoc?.session_id) return guiJson(res, 404, { loi: 'Không thấy lượt trend có mã phiên' });
        const lenh = taoLenh({
          loai: 'trend', thu_muc: '_trend', ten_video: truoc.ten_video, noi_dung: noiDung.slice(0, 8000),
          model: MODEL_HOP_LE.has(than.model) ? than.model : truoc.model, noi_tiep_phien: truoc.session_id, trend: truoc.trend,
        });
        return guiJson(res, 200, { ok: true, ma: lenh.ma });
      }
      if (p === '/api/trend/nhap') {
        const khoa = String(than.khoa || '').trim().slice(0, 300);
        if (!khoa) return guiJson(res, 400, { loi: 'Thiếu từ khoá' });
        const dong = { ...(trendNhap[khoa] || {}), hien_thi: String(than.hien_thi || trendNhap[khoa]?.hien_thi || khoa).slice(0, 300) };
        if ('trang_thai' in than) {
          if (!TRANG_THAI_TREND.has(than.trang_thai)) return guiJson(res, 400, { loi: 'Sai trạng thái' });
          dong.trang_thai = than.trang_thai;
        }
        if ('ghi_chu' in than) dong.ghi_chu = String(than.ghi_chu || '').slice(0, 4000);
        if ('video' in than) {
          const vd = String(than.video || '');
          if (vd && !MAU_TEN_THU_MUC.test(vd)) return guiJson(res, 400, { loi: 'Sai tên thư mục video' });
          dong.video = vd;
        }
        dong.sua_luc = new Date().toISOString();
        const conGi = (dong.trang_thai && dong.trang_thai !== 'moi') || dong.ghi_chu || dong.video;
        if (conGi) trendNhap[khoa] = dong; else delete trendNhap[khoa];
        ghiJson(TEP_TREND_NHAP, trendNhap);
        boNhoQuet.luc = 0;
        return guiJson(res, 200, { ok: true });
      }

      if (p === '/api/mo_phien' || p === '/api/xem_phien') {
        const lenh = soLenh.find((l) => l.ma === than.ma);
        if (!lenh?.session_id) return guiJson(res, 404, { loi: 'Lệnh chưa có phiên' });
        if (p === '/api/mo_phien') { moPhienTrongApp(lenh); return guiJson(res, 200, { ok: true }); }
        // Xem trực tiếp trong Terminal: phiên nền dùng `claude attach`, phiên ẩn đã xong dùng `claude --resume`
        const lenhXem = lenh.kieu_phien === 'nen' && lenh.ma_nen ? `${CLAUDE} attach ${lenh.ma_nen}` : `${CLAUDE} --resume ${lenh.session_id}`;
        spawn('osascript', ['-e', `tell application "Terminal" to do script "cd '${GOC}' && ${lenhXem}"`, '-e', 'tell application "Terminal" to activate'], { stdio: 'ignore' });
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/pha_may/chay') {
        // Không có mã: chạy mọi phiếu đang chờ, cần trình chạy chính đang tắt. Có mã: chạy riêng phiếu đó (kể cả
        // phiếu đã xong hoặc lỗi, chạy lại thì dùng bộ đệm chương), được chạy song song với trình chạy chính.
        const chi = String(than.chi || '');
        if (chi && !(MAU_MA_PHIEU.test(chi) && fs.existsSync(path.join(DU_LIEU_PHA_MAY, 'phieu', chi + '.json')))) return guiJson(res, 400, { loi: 'Sai mã phiếu' });
        const trinhChay = trinhChayPhaMay();
        const chinh = trinhChay.find((k) => k.chinh);
        if (!chi && chinh) return guiJson(res, 409, { loi: `Trình chạy pha máy đang chạy (PID ${chinh.pid})` });
        const dangGiu = chi && trinhChay.find((k) => k.phieu?.includes(chi));
        if (dangGiu) return guiJson(res, 409, { loi: `Phiếu ${chi} đang chạy (PID ${dangGiu.pid})` });
        fs.mkdirSync(DU_LIEU_PHA_MAY, { recursive: true });
        const log = fs.openSync(path.join(DU_LIEU_PHA_MAY, chi ? `chay_${chi}.log` : 'chay.log'), 'a');
        fs.writeSync(log, `\n=== ${new Date().toLocaleString('vi-VN')} bật từ bảng video${chi ? ' (chỉ ' + chi + ')' : ''} ===\n`);
        spawn(process.execPath, [PHA_MAY, 'chay', ...(chi ? ['--chi', chi] : [])], { cwd: GOC, detached: true, stdio: ['ignore', log, log] }).unref();
        fs.closeSync(log);
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/pha_may/dung') {
        // Không có mã: dừng trình chạy chính. Có mã: dừng trình chạy đang giữ phiếu đó (mọi phiếu của trình chạy ấy dừng theo).
        const chi = String(than.chi || '');
        const trinhChay = trinhChayPhaMay();
        const k = chi ? trinhChay.find((x) => x.phieu?.includes(chi)) : trinhChay.find((x) => x.chinh);
        if (!k) return guiJson(res, 404, { loi: chi ? `Phiếu ${chi} không chạy` : 'Trình chạy pha máy không chạy' });
        process.kill(k.pid, 'SIGTERM');
        return guiJson(res, 200, { ok: true, phieu: k.phieu });
      }
      if (p === '/api/ten') {
        const ten = String(than.ten || '').trim().slice(0, 300);
        ghiDe[thuMuc] = { ...(ghiDe[thuMuc] || {}) };
        if (ten) { ghiDe[thuMuc].ten = ten; ghiDe[thuMuc].sua_luc = new Date().toISOString(); }
        else delete ghiDe[thuMuc].ten;
        if (!Object.keys(ghiDe[thuMuc]).some((k) => k !== 'sua_luc')) delete ghiDe[thuMuc];
        ghiJson(TEP_GHI_DE, ghiDe);
        boNhoQuet.luc = 0;
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/chien_dich') {
        const ma = String(than.chien_dich || '');
        if (ma && ma !== 'khong' && !dsChienDich.some((c) => c.ma === ma)) return guiJson(res, 400, { loi: 'Sai mã chiến dịch' });
        ghiDe[thuMuc] = { ...(ghiDe[thuMuc] || {}) };
        if (ma) { ghiDe[thuMuc].chien_dich = ma; ghiDe[thuMuc].sua_luc = new Date().toISOString(); }
        else delete ghiDe[thuMuc].chien_dich;
        if (!Object.keys(ghiDe[thuMuc]).some((k) => k !== 'sua_luc')) delete ghiDe[thuMuc];
        ghiJson(TEP_GHI_DE, ghiDe);
        boNhoQuet.luc = 0;
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/quy_tac/sua' || p === '/api/quy_tac/them') {
        const so = docJson(TEP_QUY_TAC, {});
        const bang = so[String(than.cd || '')];
        if (!bang || !Array.isArray(bang.dong)) return guiJson(res, 404, { loi: 'Chiến dịch chưa có bảng quy tắc' });
        const luc = new Date().toISOString();
        if (p === '/api/quy_tac/sua') {
          const dong = bang.dong.find((x) => x.id === than.id);
          if (!dong) return guiJson(res, 404, { loi: 'Không thấy dòng quy tắc' });
          dong.dieu_chinh = String(than.dieu_chinh || '').replace(/\r\n/g, '\n').trim().slice(0, 4000);
          dong.sua_luc = luc;
        } else {
          const nhom = String(than.nhom || '').trim().slice(0, 100);
          const dieuChinh = String(than.dieu_chinh || '').replace(/\r\n/g, '\n').trim().slice(0, 4000);
          if (!nhom || !dieuChinh) return guiJson(res, 400, { loi: 'Cần ghi cả nhóm và nội dung' });
          const so_ = Math.max(0, ...bang.dong.map((x) => Number(String(x.id).slice(1)) || 0)) + 1;
          bang.dong.push({ id: 'q' + String(so_).padStart(2, '0'), nhom, quy_tac: '', ngay: '', ap_dung: '', dieu_chinh: dieuChinh, nguon: 'trung', sua_luc: luc });
        }
        ghiJson(TEP_QUY_TAC, so);
        return guiJson(res, 200, { ok: true, bang });
      }
      if (p === '/api/y_tuong') {
        ghiYTuong(thuMuc, String(than.noi_dung || '').replace(/\r\n/g, '\n').trim().slice(0, 20000));
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/ghi_ve_may') {
        try { return guiJson(res, 200, { ok: true, ...(await ghiVeMay(thuMuc)) }); }
        catch (e) { return guiJson(res, 400, { loi: e.message }); }
      }
      if (p === '/api/viec_do/xong') {
        const tenNgan = String(than.ten_ngan || '');
        const so = docJson(TEP_VIEC_DO, { viec: [] });
        const muc = MAU_TEN_NGAN.test(tenNgan) && (so.viec || []).find((x) => x.ten_ngan === tenNgan);
        if (!muc) return guiJson(res, 404, { loi: 'Không thấy việc này trong sổ' });
        if (than.xong && muc.trang_thai !== 'xong') {
          muc.trang_thai_truoc = muc.trang_thai; muc.trang_thai = 'xong'; muc.xong_luc = new Date().toISOString();
        } else if (!than.xong && muc.trang_thai === 'xong') {
          muc.trang_thai = muc.trang_thai_truoc || 'dang_do'; delete muc.trang_thai_truoc; delete muc.xong_luc;
        }
        ghiJson(TEP_VIEC_DO, so);
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/chien_dich/cap_nhat') {
        capNhatYoutube().catch((e) => console.error('Lỗi lấy số liệu YouTube', e.message));
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/lenh') {
        const noiDung = String(than.noi_dung || '').trim();
        if (!noiDung) return guiJson(res, 400, { loi: 'Lệnh trống' });
        const model = MODEL_HOP_LE.has(than.model) ? than.model : 'opus';
        const v = quetSanPham().find((x) => x.thu_muc === thuMuc);
        if (!v) return guiJson(res, 404, { loi: 'Không thấy video' });
        let noiTiep = null;
        if (than.noi_tiep) {
          const truoc = [...soLenh].reverse().find((l) => l.thu_muc === thuMuc && l.session_id && !['cho', 'dang_chay', 'cho_trung'].includes(l.trang_thai));
          noiTiep = truoc?.session_id || null;
        }
        const lenh = {
          ma: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + '_' + crypto.randomBytes(2).toString('hex'),
          thu_muc: thuMuc, ten_video: v.ten, noi_dung: noiDung.slice(0, 8000), model,
          noi_tiep_phien: noiTiep, trang_thai: 'cho', tao_luc: new Date().toISOString(),
        };
        soLenh.push(lenh);
        luuSoLenh();
        setImmediate(chayLenhTiepTheo);
        return guiJson(res, 200, { ok: true, ma: lenh.ma });
      }
      if (p === '/api/dung') {
        const lenh = soLenh.find((l) => l.ma === than.ma);
        if (!lenh) return guiJson(res, 404, { loi: 'Không thấy lệnh' });
        if (lenh.trang_thai === 'cho') { lenh.trang_thai = 'da_dung'; lenh.ket_thuc = new Date().toISOString(); luuSoLenh(); }
        else if (['dang_chay', 'cho_trung'].includes(lenh.trang_thai) && dangChay.has(lenh.ma)) { lenh.trang_thai = 'da_dung'; luuSoLenh(); dangChay.get(lenh.ma).dung(); }
        return guiJson(res, 200, { ok: true });
      }
      if (p === '/api/tat') {
        guiJson(res, 200, { ok: true });
        console.log('Trung bấm tắt máy chủ trên trang.');
        return setTimeout(tat, 300);
      }
      if (p === '/api/mo') {
        const dich = than.tep ? trongThuMuc(path.join(SAN_PHAM, thuMuc), String(than.tep)) : path.join(SAN_PHAM, thuMuc);
        if (!dich || !fs.existsSync(dich)) return guiJson(res, 404, { loi: 'Không thấy' });
        spawn('open', than.tep ? ['-R', dich] : [dich], { stdio: 'ignore' });
        return guiJson(res, 200, { ok: true });
      }
    }
    res.writeHead(404); res.end('Không có');
  } catch (e) {
    console.error(e);
    guiJson(res, 500, { loi: e.message });
  }
});

may.listen(CONG, '127.0.0.1', () => {
  console.log(`Bảng theo dõi video: http://localhost:${CONG}/`);
  console.log(`Claude: ${CLAUDE}`);
  console.log('Dừng máy chủ: Ctrl+C. Lệnh đang chạy sẽ dừng theo.');
  console.log(`Kiểu phiên: ${CHE_DO_PHIEN === 'nen' ? 'chạy nền, Trung xem được' : 'chạy ẩn (claude -p)'}; tối đa ${SO_LENH_TOI_DA} lệnh cùng lúc.`);
  quetSanPham();
  // phiên nền còn đang làm hoặc đang chờ Trung từ lần bật trước: theo dõi tiếp
  for (const l of soLenh) if (['dang_chay', 'cho_trung'].includes(l.trang_thai) && l.kieu_phien === 'nen' && l.session_id) { l.so_buoc = 0; theoDoiPhienNen(l); }
  kiemDieuKien(); // kiểm xong thì gọi chayLenhTiepTheo
  capNhatYoutubeNeuCu();
  setInterval(capNhatYoutubeNeuCu, 30 * 60e3);
});

function tat() {
  // lượt chạy ẩn dừng theo máy chủ; phiên nền chạy tiếp, bật lại bảng thì theo dõi tiếp
  for (const l of soLenh) if (dangChay.has(l.ma) && l.kieu_phien !== 'nen') dangChay.get(l.ma).dung();
  luuSoLenh();
  process.exit(0);
}
process.on('SIGINT', tat);
process.on('SIGTERM', tat);
