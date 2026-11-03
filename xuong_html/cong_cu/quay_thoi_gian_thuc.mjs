#!/usr/bin/env node
// quay_thoi_gian_thuc.mjs — cách "quay màn hình" đơn giản nhất: mở trang trong Chromium và dùng tính năng
// ghi video có sẵn của Playwright (recordVideo, WebM/VP8 do Playwright tự mã hoá), chờ đúng số giây
// theo đồng hồ thật, rồi đổi sang MP4 H.264 bằng FFmpeg.
//
// Khác với xuat_mp4.mjs: trang chạy theo đồng hồ THẬT. Máy chậm thì rơi khung; video luôn dài đúng số giây thật
// (mất hết 1 giây máy cho mỗi giây video); chất lượng bị giới hạn bởi bộ ghi của Playwright
// (VP8 ~1 Mbit/s, tối đa khoảng 25 khung/giây).
//
// Dùng:  node quay_thoi_gian_thuc.mjs <trang.html> <so_giay> [--fps 30] [--kich-thuoc 1920x1080] [--ra file.mp4]
//        [--crf 18] [--lech-ms 0] [--giu-webm] [--ffmpeg duong_dan] [--trinh-duyet duong_dan]
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { parseArgs } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

// Thứ tự tìm FFmpeg: --ffmpeg, biến FFMPEG, rồi file ffmpeg của xuong_thu_hyperframes tính theo vị trí script
// (<thư mục chứa xuong_html>/xuong_thu_hyperframes/bin/ffmpeg), cuối cùng đường dẫn tuyệt đối cũ.
const FFMPEG_CUA_XUONG = fileURLToPath(new URL('../../xuong_thu_hyperframes/bin/ffmpeg', import.meta.url));
const FFMPEG_TUYET_DOI_CU = '/Users/macbooktrungnt/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg';
const FFMPEG_MAC_DINH = fs.existsSync(FFMPEG_CUA_XUONG) ? FFMPEG_CUA_XUONG : FFMPEG_TUYET_DOI_CU;
const HUONG_DAN = `Dùng: node quay_thoi_gian_thuc.mjs <trang.html> <so_giay> [tuỳ chọn]
  --fps N            số khung/giây của MP4 đầu ra (mặc định 30; nguồn WebM chỉ có tối đa ~25)
  --kich-thuoc RxC   rộng x cao (mặc định 1920x1080)
  --ra FILE          MP4 đầu ra (mặc định: cạnh file HTML, đuôi .mp4)
  --crf N            CRF của x264 khi đổi sang MP4 (mặc định 18)
  --lech-ms N        dịch điểm cắt đầu video thêm N ms (dương = cắt thêm), để chỉnh lệch đồng bộ
  --giu-webm         giữ file WebM gốc cạnh MP4
  --ffmpeg PATH      file ffmpeg (mặc định biến FFMPEG, rồi ffmpeg của xuong_thu_hyperframes)
  --trinh-duyet PATH file chạy Chromium (mặc định: bản playwright-core tự tìm)`;

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    fps: { type: 'string', default: '30' },
    'kich-thuoc': { type: 'string', default: '1920x1080' },
    ra: { type: 'string' },
    crf: { type: 'string', default: '18' },
    'lech-ms': { type: 'string', default: '0' },
    'giu-webm': { type: 'boolean', default: false },
    ffmpeg: { type: 'string' },
    'trinh-duyet': { type: 'string' },
    help: { type: 'boolean', short: 'h', default: false },
  },
});
if (values.help || positionals.length < 2) { console.error(HUONG_DAN); process.exit(values.help ? 0 : 2); }
const html = path.resolve(positionals[0]);
if (!fs.existsSync(html)) { console.error('Không thấy file HTML: ' + html); process.exit(2); }
const giay = Number(positionals[1]);
const fps = Number(values.fps);
const m = /^(\d+)\s*[xX×]\s*(\d+)$/.exec(values['kich-thuoc']);
if (!(giay > 0) || !(fps > 0) || !m) { console.error(HUONG_DAN); process.exit(2); }
const rong = +m[1] + (+m[1] % 2), cao = +m[2] + (+m[2] % 2);
const ra = path.resolve(values.ra || html.replace(/\.html?$/i, '') + '_thoigianthuc.mp4');
const ffmpeg = values.ffmpeg || process.env.FFMPEG || FFMPEG_MAC_DINH;
const lechMs = Number(values['lech-ms']);
// Đồng bộ đầu video: bộ ghi của Playwright không cho biết khung đầu ứng với thời điểm nào, nên công cụ chiếu trước một
// trang màu tím làm mốc, tìm khung tím đầu tiên trong WebM, rồi suy ra vị trí "giây 0" của trang thật.
// Trang tím cần khoảng 82 ms từ lúc bắt đầu điều hướng tới khi khung đầu tiên xuất hiện (đo trên máy này).
const MAU_MOC = 'data:text/html,<body style="margin:0;background:%23ff00ff">';
const TRE_KHUNG_MOC_MS = 82;
const CHO_MOC_MS = 600;

function chay(cmd, args) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let o = '', e = '';
    p.stdout.on('data', (d) => { o += d; }); p.stderr.on('data', (d) => { e += d; });
    p.on('error', rej);
    p.on('close', (c) => (c === 0 ? res(o) : rej(new Error(`${cmd} thoát mã ${c}\n${e}`))));
  });
}

const now = () => Number(process.hrtime.bigint()) / 1e6;   // ms
const t0 = now();
fs.mkdirSync(path.dirname(ra), { recursive: true });
const thuTam = fs.mkdtempSync(path.join(path.dirname(ra), '.quay_tam_'));

const browser = await chromium.launch({
  headless: true,
  executablePath: values['trinh-duyet'] || process.env.CHROMIUM_PATH || undefined,
  args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none'],
});
let webm, tuMocMs;
try {
  const ctx = await browser.newContext({
    viewport: { width: rong, height: cao }, deviceScaleFactor: 1,
    recordVideo: { dir: thuTam, size: { width: rong, height: cao } },
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.error('pageerror: ' + e.message));
  const tDieuHuongMoc = now();
  await page.goto(MAU_MOC);
  await new Promise((r) => setTimeout(r, CHO_MOC_MS));
  await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  // Đồng hồ của trang (performance.now) tính từ lúc bắt đầu điều hướng: suy ra mốc "giây 0" của hoạt ảnh
  const tHoi = now();
  const perf = await page.evaluate(() => performance.now());
  const tGiay0 = tHoi - perf;                                    // mốc thật của giây 0 trong trang
  tuMocMs = tGiay0 - tDieuHuongMoc;                              // giây 0 của trang đến sau lúc điều hướng sang trang tím bao lâu
  const conLai = tGiay0 + giay * 1000 + 250 - now();             // dư 250 ms để cắt không thiếu cuối
  if (conLai > 0) await new Promise((r) => setTimeout(r, conLai));
  const video = page.video();
  await ctx.close();                                             // đóng context mới ghi xong file WebM
  webm = await video.path();
} finally {
  await browser.close().catch(() => {});
}

const tGhiXong = now();
// tìm khung tím đầu tiên trong WebM: thu mỗi khung về 2x2 điểm rồi đọc màu trung bình
const thoKhung = await new Promise((res, rej) => {
  const p = spawn(ffmpeg, ['-v', 'error', '-i', webm, '-vf', 'scale=1:1:flags=area,format=rgb24', '-frames:v', '150', '-f', 'rawvideo', '-'], { stdio: ['ignore', 'pipe', 'pipe'] });
  const bufs = []; p.stdout.on('data', (d) => bufs.push(d)); p.on('error', rej); p.on('close', () => res(Buffer.concat(bufs)));
});
const infoWebm = JSON.parse(await chay(ffmpeg.replace(/ffmpeg$/, 'ffprobe'), ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'json', webm]));
const [tu, mau] = infoWebm.streams[0].r_frame_rate.split('/').map(Number);
const fpsWebm = tu / mau;
let chiSoTim = -1;
for (let i = 0; i + 2 < thoKhung.length; i += 3) {
  if (thoKhung[i] > 180 && thoKhung[i + 1] < 90 && thoKhung[i + 2] > 180) { chiSoTim = i / 3; break; }
}
let ss, canhBao = null;
if (chiSoTim >= 0) {
  const vMoc = chiSoTim / fpsWebm;                              // giây trong video lúc trang tím hiện
  ss = Math.max(0, vMoc - TRE_KHUNG_MOC_MS / 1000 + tuMocMs / 1000 + lechMs / 1000);
} else {
  ss = 0.2 + lechMs / 1000; canhBao = 'khong thay khung moc, dung do lech mac dinh 0,2 giay';
  console.error('CẢNH BÁO: ' + canhBao);
}
const loc = `fps=${fps},scale=in_range=tv:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709:flags=bicubic,format=yuv420p`;
await chay(ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-i', webm, '-ss', ss.toFixed(3), '-t', String(giay),
  '-vf', loc, '-c:v', 'libx264', '-preset', 'medium', '-crf', values.crf, '-pix_fmt', 'yuv420p',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
  '-movflags', '+faststart', ra]);
const tXong = now();
const webmByte = fs.statSync(webm).size;
if (values['giu-webm']) fs.copyFileSync(webm, ra.replace(/\.mp4$/i, '') + '.webm');
fs.rmSync(thuTam, { recursive: true, force: true });

console.log(JSON.stringify({
  ra, giay_video: giay, fps, kich_thuoc: `${rong}x${cao}`,
  cat_dau_giay: +ss.toFixed(3), khung_moc: chiSoTim, canh_bao: canhBao, giay_ghi_xong_sau: +((tGhiXong - t0) / 1000).toFixed(2),
  giay_may: +((tXong - t0) / 1000).toFixed(2), giay_may_moi_giay_video: +(((tXong - t0) / 1000) / giay).toFixed(2),
  webm_byte: webmByte, byte: fs.statSync(ra).size,
}));
