#!/usr/bin/env node
// xuat_mp4.mjs — biến trang HTML có hoạt ảnh thành MP4 bằng cách chụp từng khung theo THỜI GIAN ẢO.
//
// Cơ chế: chèn một script chạy trước mọi script của trang, thay performance.now, Date.now,
// requestAnimationFrame, setTimeout, setInterval, requestIdleCallback bằng đồng hồ do công cụ điều khiển.
// Với mỗi khung: đẩy đồng hồ ảo tới i/fps giây, chạy các callback timer và rAF đến hạn, đặt currentTime
// cho mọi hoạt ảnh CSS / Web Animations (document.getAnimations) và SVG SMIL, rồi chụp ảnh khung và đẩy
// vào FFmpeg (image2pipe) mã hoá H.264 yuv420p. Kết quả không phụ thuộc máy chạy nhanh hay chậm.
//
// Dùng:  node xuat_mp4.mjs <trang.html> <so_giay> [--fps 30] [--kich-thuoc 1920x1080] [--ra file.mp4]
//        [--song-song N] [--anh jpeg|png] [--chat-luong 95] [--crf 18] [--preset medium] [--hat-giong 1]
//        [--cho-ms 0] [--ffmpeg duong_dan] [--trinh-duyet duong_dan] [--giu-tam] [--chi-tiet]
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { parseArgs } from 'node:util';
import { once } from 'node:events';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

// Thứ tự tìm FFmpeg: --ffmpeg, biến FFMPEG, rồi file ffmpeg của xuong_thu_hyperframes tính theo vị trí script
// (<thư mục chứa xuong_html>/xuong_thu_hyperframes/bin/ffmpeg), cuối cùng đường dẫn tuyệt đối cũ.
const FFMPEG_CUA_XUONG = fileURLToPath(new URL('../../xuong_thu_hyperframes/bin/ffmpeg', import.meta.url));
const FFMPEG_TUYET_DOI_CU = '/Users/macbooktrungnt/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg';
const FFMPEG_MAC_DINH = fs.existsSync(FFMPEG_CUA_XUONG) ? FFMPEG_CUA_XUONG : FFMPEG_TUYET_DOI_CU;

const HUONG_DAN = `Dùng: node xuat_mp4.mjs <trang.html> <so_giay> [tuỳ chọn]
  --fps N              số khung/giây (mặc định 30)
  --kich-thuoc RxC     rộng x cao, ví dụ 1920x1080 (mặc định 1920x1080)
  --ra FILE            file MP4 đầu ra (mặc định: cạnh file HTML, đuôi .mp4)
  --song-song N        số trang Chromium chụp song song (mặc định 1)
  --anh jpeg|png       định dạng khung đẩy vào FFmpeg (mặc định jpeg; png nhanh kém hơn, không nén mất chi tiết)
  --chat-luong N       chất lượng JPEG 1-100 (mặc định 95)
  --crf N              CRF của x264 (mặc định 18)
  --preset TEN         preset x264 (mặc định medium)
  --hat-giong N        hạt giống của Math.random cố định (mặc định 1)
  --cho-ms N           chờ thêm N ms thật sau khi trang tải xong, trước khi bắt đầu (mặc định 0)
                       (trang dựng bất đồng bộ nên đặt window.__san_sang = false đầu trang, true khi xong: công cụ tự chờ cờ này, tối đa 30 giây)
  --ffmpeg DUONG_DAN   file ffmpeg (mặc định: biến FFMPEG, rồi ffmpeg của xuong_thu_hyperframes)
  --trinh-duyet PATH   file chạy Chromium (mặc định: bản playwright-core tự tìm trong ~/Library/Caches/ms-playwright)
  --giu-nhip-60hz      không tắt giới hạn nhịp khung của Chromium (chậm hơn, dùng ít CPU hơn)
  --co-chromium "..."   thêm cờ cho Chromium, cách nhau bằng dấu cách (mặc định không thêm)
  --giu-tam            giữ thư mục tạm khi chạy song song
  --chi-tiet           in console và lỗi của trang`;

// ---------------------------------------------------------------------------------------------
// Script chạy TRONG trang, trước mọi script của trang. Toàn bộ đồng hồ nằm ở biến vt (mili giây).
// ---------------------------------------------------------------------------------------------
function chenDongHoAo({ seed, epoch }) {
  if (window.__vt) return;
  const RealDate = Date;
  let vt = 0, seq = 1, nextTimerId = 1, nextRafId = 1, trongTimer = 0;
  const timers = new Map();
  let hangRaf = [];
  const baoLoi = (e) => { try { console.error('[chup_khung] loi trong callback:', (e && e.stack) || e); } catch (_) {} };

  // Math.random xác định (mulberry32): mọi lần chạy và mọi trang song song cho cùng một dãy số
  let s = seed >>> 0;
  Math.random = function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  performance.now = () => vt;
  function VDate(...a) {
    if (!new.target) return new RealDate(epoch + vt).toString();
    return Reflect.construct(RealDate, a.length ? a : [epoch + vt], new.target);
  }
  VDate.prototype = RealDate.prototype;
  VDate.now = () => epoch + vt;
  VDate.UTC = RealDate.UTC;
  VDate.parse = RealDate.parse;
  window.Date = VDate;

  const taoTimer = (fn, delay, args, lap) => {
    if (typeof fn === 'string') { const code = fn; fn = () => (0, eval)(code); }
    if (typeof fn !== 'function') return 0;
    delay = Number(delay); if (!(delay >= 0)) delay = 0;
    const id = nextTimerId++;
    // setTimeout tạo trong callback của timer bị kẹp tối thiểu 4 ms (như trình duyệt), setInterval tối thiểu 1 ms;
    // nhờ vậy vòng lặp setTimeout(f, 0) không làm một khung chạy vô hạn
    const khoang = Math.max(delay, lap ? 1 : (trongTimer ? 4 : 0));
    timers.set(id, { id, due: vt + khoang, seq: seq++, fn, args, lap: lap ? khoang : null });
    return id;
  };
  window.setTimeout = (fn, delay, ...args) => taoTimer(fn, delay, args, false);
  window.setInterval = (fn, delay, ...args) => taoTimer(fn, delay, args, true);
  window.clearTimeout = window.clearInterval = (id) => { timers.delete(id); };
  window.requestAnimationFrame = (cb) => { const id = nextRafId++; hangRaf.push({ id, cb }); return id; };
  window.cancelAnimationFrame = (id) => { hangRaf = hangRaf.filter((r) => r.id !== id); };
  window.requestIdleCallback = (cb) => taoTimer(() => cb({ didTimeout: false, timeRemaining: () => 50 }), 1, [], false);
  window.cancelIdleCallback = (id) => { timers.delete(id); };

  try {
    const mota = Object.getOwnPropertyDescriptor(AnimationTimeline.prototype, 'currentTime');
    Object.defineProperty(AnimationTimeline.prototype, 'currentTime', {
      configurable: true,
      get() { return this === document.timeline ? vt : mota.get.call(this); },
    });
  } catch (_) {}

  // Hoạt ảnh CSS / Web Animations: tạm dừng và đặt currentTime = (vt - lúc thấy lần đầu) * tốc độ
  const trangThaiAnim = new WeakMap();
  function dongBoHoatAnh() {
    let ds;
    try { ds = document.getAnimations(); } catch (_) { return; }
    for (const a of ds) {
      if (a.timeline !== document.timeline) continue;
      let st = trangThaiAnim.get(a);
      if (!st) {
        st = { batDau: vt, bo: a.playState === 'paused' || a.playState === 'finished' };
        trangThaiAnim.set(a, st);
      }
      if (st.bo) continue;
      if (a.playState === 'running') a.pause();
      a.currentTime = (vt - st.batDau) * (a.playbackRate || 1);
    }
  }
  // SVG SMIL (<animate>, <animateTransform>, <set>)
  function dongBoSMIL() {
    if (!document.querySelector('animate,animateTransform,animateMotion,set')) return;
    for (const svg of document.querySelectorAll('svg')) {
      try { svg.pauseAnimations(); svg.setCurrentTime(vt / 1000); } catch (_) {}
    }
  }

  function buoc(dich) {
    let bao = 0;
    for (;;) {
      let t = null;
      for (const x of timers.values()) {
        if (x.due <= dich && (!t || x.due < t.due || (x.due === t.due && x.seq < t.seq))) t = x;
      }
      if (!t) break;
      if (++bao > 200000) { console.error('[chup_khung] qua nhieu timer trong mot khung'); break; }
      if (t.due > vt) vt = t.due;
      if (t.lap != null) { t.due += t.lap; t.seq = seq++; } else timers.delete(t.id);
      trongTimer++;
      try { t.fn(...t.args); } catch (e) { baoLoi(e); } finally { trongTimer--; }
    }
    if (dich > vt) vt = dich;
    const q = hangRaf; hangRaf = [];
    for (const r of q) { try { r.cb(vt); } catch (e) { baoLoi(e); } }
    dongBoHoatAnh();
    dongBoSMIL();
  }
  window.__vt = {
    buoc,
    // chạy các khung [tu, den) không chụp (dùng để "tua" tới khung bắt đầu của một đoạn)
    chay(tu, den, fps) { for (let i = tu; i < den; i++) buoc((i * 1000) / fps); },
    get bay_gio() { return vt; },
  };
  window.__chup_khung = true;
}

// ---------------------------------------------------------------------------------------------
function phanTich() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      fps: { type: 'string', default: '30' },
      'kich-thuoc': { type: 'string', default: '1920x1080' },
      ra: { type: 'string' },
      'song-song': { type: 'string', default: '1' },
      anh: { type: 'string', default: 'jpeg' },
      'chat-luong': { type: 'string', default: '95' },
      crf: { type: 'string', default: '18' },
      preset: { type: 'string', default: 'medium' },
      'hat-giong': { type: 'string', default: '1' },
      'cho-ms': { type: 'string', default: '0' },
      ffmpeg: { type: 'string' },
      'trinh-duyet': { type: 'string' },
      'giu-nhip-60hz': { type: 'boolean', default: false },
      'co-chromium': { type: 'string', default: '' },
      'giu-tam': { type: 'boolean', default: false },
      'chi-tiet': { type: 'boolean', default: false },
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
  let rong = +m[1], cao = +m[2];
  if (rong % 2) rong++; if (cao % 2) cao++;     // yuv420p cần kích thước chẵn
  const anh = values.anh === 'png' ? 'png' : 'jpeg';
  return {
    html, giay, fps, rong, cao, anh,
    ra: path.resolve(values.ra || html.replace(/\.html?$/i, '') + '.mp4'),
    songSong: Math.max(1, Math.floor(Number(values['song-song']))),
    chatLuong: Number(values['chat-luong']),
    crf: values.crf, preset: values.preset,
    hatGiong: Number(values['hat-giong']),
    choMs: Number(values['cho-ms']),
    ffmpeg: values.ffmpeg || process.env.FFMPEG || FFMPEG_MAC_DINH,
    trinhDuyet: values['trinh-duyet'] || process.env.CHROMIUM_PATH || undefined,
    giuNhip: values['giu-nhip-60hz'],
    coChromium: values['co-chromium'].split(/\s+/).filter(Boolean),
    giuTam: values['giu-tam'], chiTiet: values['chi-tiet'],
  };
}

// Bộ lọc đổi màu: JPEG của Chrome là YCbCr BT.601 toàn dải; đầu ra H.264 gắn thẻ BT.709 dải TV
function boLoc(anh) {
  return anh === 'jpeg'
    ? 'scale=in_range=pc:in_color_matrix=bt601:out_range=tv:out_color_matrix=bt709:flags=bicubic,format=yuv420p'
    : 'scale=out_range=tv:out_color_matrix=bt709:flags=bicubic,format=yuv420p';
}

function moFfmpeg(o, fileRa, kieu /* 'mp4' | 'h264' */) {
  const args = [
    '-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(o.fps), '-c:v', o.anh === 'jpeg' ? 'mjpeg' : 'png', '-i', '-',
    '-vf', boLoc(o.anh),
    '-c:v', 'libx264', '-preset', o.preset, '-crf', o.crf, '-pix_fmt', 'yuv420p',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-r', String(o.fps),
  ];
  if (kieu === 'mp4') args.push('-movflags', '+faststart');
  args.push(fileRa);
  const p = spawn(o.ffmpeg, args, { stdio: ['pipe', 'ignore', 'pipe'] });
  let loi = '';
  p.stderr.on('data', (d) => { loi += d; });
  const xong = new Promise((res, rej) => {
    p.on('error', rej);
    p.on('close', (code) => (code === 0 ? res() : rej(new Error('ffmpeg thoát mã ' + code + '\n' + loi))));
  });
  p.stdin.on('error', () => {});               // lỗi EPIPE sẽ hiện qua `xong`
  return { p, xong };
}

async function ghi(stdin, buf) {
  if (!stdin.write(buf)) await once(stdin, 'drain');
}

async function chupDoan(browser, o, k, tu, den, ff, tienDo) {
  const ctx = await browser.newContext({ viewport: { width: o.rong, height: o.cao }, deviceScaleFactor: 1 });
  await ctx.addInitScript(chenDongHoAo, { seed: o.hatGiong, epoch: Date.UTC(2026, 0, 1) });
  const page = await ctx.newPage();
  let hong = null;
  page.on('crash', () => { hong = new Error('Trang bị crash'); });
  if (o.chiTiet || k === 0) {
    page.on('console', (m) => { if (o.chiTiet || m.type() === 'error') console.error(`[trang ${k}] ${m.type()}: ${m.text()}`); });
    page.on('pageerror', (e) => console.error(`[trang ${k}] pageerror: ${e.message}`));
  }
  await page.goto(pathToFileURL(o.html).href, { waitUntil: 'load' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
  });
  // Trang dựng bất đồng bộ (nạp phông, tạo cảnh) có thể đặt window.__san_sang = false ngay đầu và true khi dựng xong;
  // công cụ chờ tối đa 30 giây. Trang không đặt cờ này thì không chờ gì thêm.
  for (let lan = 0; lan < 600; lan++) {
    if (await page.evaluate(() => window.__san_sang !== false)) break;
    await new Promise((r) => setTimeout(r, 50));
  }
  if (o.choMs > 0) await new Promise((r) => setTimeout(r, o.choMs));
  const cdp = await ctx.newCDPSession(page);
  const tham = o.anh === 'jpeg'
    ? { format: 'jpeg', quality: o.chatLuong, optimizeForSpeed: true }
    : { format: 'png', optimizeForSpeed: true };
  if (tu > 0) await page.evaluate(([a, b, f]) => window.__vt.chay(a, b, f), [0, tu, o.fps]);
  for (let i = tu; i < den; i++) {
    if (hong) throw hong;
    await page.evaluate(([t]) => window.__vt.buoc(t), [(i * 1000) / o.fps]);
    const r = await cdp.send('Page.captureScreenshot', tham);
    await ghi(ff.p.stdin, Buffer.from(r.data, 'base64'));
    tienDo(1);
  }
  ff.p.stdin.end();
  await ctx.close();
}

async function main() {
  const o = phanTich();
  const t0 = process.hrtime.bigint();
  const tong = Math.round(o.giay * o.fps);
  const soDoan = Math.min(o.songSong, tong);
  fs.mkdirSync(path.dirname(o.ra), { recursive: true });
  const thuTam = soDoan > 1 ? fs.mkdtempSync(path.join(path.dirname(o.ra), '.chup_khung_tam_')) : null;

  const browser = await chromium.launch({
    headless: true,
    executablePath: o.trinhDuyet,
    // --disable-frame-rate-limit: chụp ảnh không phải chờ nhịp 60 Hz của trình duyệt (nhanh hơn ~1,5 lần, ảnh giống hệt từng điểm ảnh)
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--disable-lcd-text', '--font-render-hinting=none',
      ...(o.giuNhip ? [] : ['--disable-frame-rate-limit']), ...o.coChromium],
  });
  let xong = 0, mocIn = Date.now();
  const tienDo = (n) => {
    xong += n;
    if (Date.now() - mocIn > 2000 || xong === tong) {
      mocIn = Date.now();
      const giayDa = Number(process.hrtime.bigint() - t0) / 1e9;
      process.stderr.write(`\r  khung ${xong}/${tong}  ${(xong / giayDa).toFixed(1)} khung/giây máy   `);
    }
  };

  try {
    const doan = [];
    for (let k = 0; k < soDoan; k++) {
      const tu = Math.floor((tong * k) / soDoan), den = Math.floor((tong * (k + 1)) / soDoan);
      const fileDoan = soDoan === 1 ? o.ra : path.join(thuTam, `doan_${k}.mp4`);
      const ff = moFfmpeg(o, fileDoan, soDoan === 1 ? 'mp4' : 'doan');
      doan.push({ k, tu, den, fileDoan, ff });
    }
    await Promise.all(doan.map(async (d) => {
      try { await Promise.all([chupDoan(browser, o, d.k, d.tu, d.den, d.ff, tienDo), d.ff.xong]); }
      catch (e) { try { d.ff.p.kill('SIGKILL'); } catch (_) {} throw e; }
    }));
    if (soDoan > 1) {
      // ghép các đoạn MP4 (mỗi đoạn bắt đầu bằng khung IDR, cùng tham số mã hoá) bằng concat demuxer, không mã hoá lại
      const ds = path.join(thuTam, 'ds.txt');
      fs.writeFileSync(ds, doan.map((d) => `file '${d.fileDoan.replace(/'/g, "'\\''")}'`).join('\n') + '\n');
      const mux = spawn(o.ffmpeg, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', ds,
        '-c', 'copy', '-movflags', '+faststart', o.ra], { stdio: ['ignore', 'ignore', 'pipe'] });
      let le = ''; mux.stderr.on('data', (d) => { le += d; });
      const [code] = await once(mux, 'close');
      if (code !== 0) throw new Error('ghép MP4 lỗi: ' + le);
    }
  } finally {
    await browser.close().catch(() => {});
    if (thuTam && !o.giuTam) fs.rmSync(thuTam, { recursive: true, force: true });
  }
  const giayMay = Number(process.hrtime.bigint() - t0) / 1e9;
  const kb = fs.statSync(o.ra).size;
  process.stderr.write('\n');
  console.log(JSON.stringify({
    ra: o.ra, khung: tong, giay_video: o.giay, fps: o.fps, kich_thuoc: `${o.rong}x${o.cao}`, song_song: soDoan, anh: o.anh,
    giay_may: +giayMay.toFixed(2), giay_may_moi_giay_video: +(giayMay / o.giay).toFixed(2), byte: kb,
  }));
}

// Chạy bằng `node xuat_mp4.mjs` thì xuất; được import thì không. Trình chạy pha máy (scripts/pha_may/chup_html.mjs)
// import để dùng lại đồng hồ ảo, khỏi giữ hai bản.
const thatPath = (p) => { try { return fs.realpathSync(p); } catch (_) { return p; } };
if (process.argv[1] && thatPath(path.resolve(process.argv[1])) === thatPath(fileURLToPath(import.meta.url))) {
  main().catch((e) => { console.error('\nLỖI: ' + (e && e.stack || e)); process.exit(1); });
}
export { chenDongHoAo };
