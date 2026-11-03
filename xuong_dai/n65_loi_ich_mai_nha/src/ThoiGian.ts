// Hàm thời gian dùng chung cho dòng thời gian 3D (KichBan.ts) và màn bảng đen (BangDen.tsx).
// Mốc câu lấy từ src/thoi_gian.json (sinh bằng tao_thoi_gian.py sau mỗi lần tạo giọng).
import TG from "./thoi_gian.json";

export const FPS = TG.fps;
export const TONG = TG.tong;
export const CHUONG = TG.chuong;

export const cl = (v: number) => Math.min(1, Math.max(0, v));
export const em = (v: number) => (v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2);
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;
export const tien = (f: number, a: number, b: number) => em(cl((f - a) / Math.max(1, b - a)));
export const hien = (f: number, a: number, b = 1e9, vao = 10, ra = 8) => cl((f - a) / vao) * cl((b - f) / ra);
// tô sáng chuyển màu dần trong 12 khung, không bật tắt tức thì (bật tắt tức thì làm hình nháy, Trung báo 26/10/2026)
export const bat = (f: number, a: number, b = 1e9) => em(hien(f, a, b, 12, 12));

export const viTri = (g: number) => {
  let i = CHUONG.length - 1;
  while (i > 0 && CHUONG[i].bat_dau > g) i--;
  return { c: i + 1, f: g - CHUONG[i].bat_dau };
};
// khung bắt đầu câu i của chương c (tính trong chương)
export const s = (c: number, i: number) => CHUONG[c - 1].cau[Math.min(i, CHUONG[c - 1].cau.length - 1)].f;
export const het = (c: number) => CHUONG[c - 1].dai;
// khung (tính trong chương) bắt đầu từ thứ k của câu i, theo mốc từng từ; không có mốc từ thì dùng khung đầu câu
export const tu = (c: number, i: number, k: number) => {
  const cau = CHUONG[c - 1].cau[Math.min(i, CHUONG[c - 1].cau.length - 1)];
  return cau.tu_moc && cau.tu_moc[k] ? cau.tu_moc[k].f : cau.f;
};
