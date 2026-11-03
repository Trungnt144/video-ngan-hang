// Trạng thái từng khung của video "Lợi ích của điện mặt trời mái nhà" (n65; lai CL-07 và CL-05, KB-05 Bóc cơ chế, MAU-10 Trời trong = bảng M1).
// Chương 1, 2, 5, 6, 10, 11 dựng Three.js (khu phố, nhà có công tơ, mái che nắng, nhà xưởng); chương 3, 4, 7, 8, 9 là SVG (HinhVe.tsx), chỉ ghi studio "ve".
// Mốc đặt theo câu và theo từng từ của lời đọc (src/thoi_gian.json, sinh bằng tao_thoi_gian.py).
import { C_KHI, C_LUOI, C_MAI, C_TIEN, TT, TT0, VT_NHA, VT_XUONG, X_CONGTO, X_COT, Z_COT, Z_CONGTO } from "./Canh3D";
import { MAU } from "./CoBan";
import { V3 } from "./ThongSo";
import { CHUONG, TONG, bat, het, hien, lerp, s, tien, viTri } from "./ThoiGian";

export { FPS, TONG, CHUONG } from "./ThoiGian";

const lerp3 = (a: V3, b: V3, u: number): V3 => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];
const bo = (x: string) => x.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();
export const tuChu = (c: number, i: number, chu: string, thu = 0) => {
  const cau = CHUONG[c - 1].cau[Math.min(i, CHUONG[c - 1].cau.length - 1)];
  const ds = (cau.tu_moc ?? []).filter((w) => bo(w.chu) === bo(chu));
  return ds[thu]?.f ?? cau.f;
};

export type Nhan = { p: V3; chu: string; mo: number; ben?: "phai" | "trai"; nho?: string; mau?: string };
export type DongThe = { chu: string; gt?: string; mo?: number; mau?: string };
export type Studio = "3d" | "ve";
export type Chip = { chu: string; mau: string; mo: number };
export type Khung = {
  c: number; f: number; g: number;
  cp: V3; ct: V3; fov: number;
  studio: Studio;
  t: TT;
  nhan: Nhan[];
  chip: Chip[];
  so: { chu: string; phu?: string; mo: number; y: number; co: number; mau?: string } | null;
  the: { tieu: string; dong: DongThe[]; mo: number; y?: number; trai?: boolean; x?: number; w?: number } | null;
  man: number; manMau: string;
  matTroi: number;
  matTroiX?: number;
  chipY?: number;
};

type Canh = { tu: number; cp: [V3, V3]; ct: [V3, V3]; den?: number; fov?: number };
const chonCanh = (f: number, ds: Canh[], denMacDinh: number) => {
  let i = ds.length - 1;
  while (i > 0 && ds[i].tu > f) i--;
  const k = ds[i];
  const den = k.den ?? (ds[i + 1]?.tu ?? denMacDinh);
  const u = tien(f, k.tu, den);
  return { cp: lerp3(k.cp[0], k.cp[1], u), ct: lerp3(k.ct[0], k.ct[1], u), fov: k.fov ?? 40 };
};
export const so = (n: number) => Math.round(n).toLocaleString("vi-VN");

const khungGoc = (g: number): Khung => {
  const { c, f } = viTri(g);
  const k: Khung = {
    c, f, g, cp: [0, 40, 60], ct: [0, 0, 2], fov: 40, studio: CHUONG[c - 1].to === "ve" ? "ve" : "3d",
    t: { ...TT0, g, that: Array(12).fill(10) }, nhan: [], chip: [], so: null, the: null, man: 0, manMau: MAU.nen, matTroi: 0,
  };
  const dat = (ds: Canh[]) => Object.assign(k, chonCanh(f, ds, het(c)));
  const L = (chu: string, mau: string, mo: number): Chip => ({ chu, mau, mo });
  const H = het(c);

  // ---------- Chương 1: khu phố có tấm pin trên mọi mái; ba lớp lợi ích ----------
  if (c === 1) {
    const [s0, s1, s2, s3, s4, s5] = [0, 1, 2, 3, 4, 5].map((i) => s(1, i));
    dat([{ tu: 0, den: H, cp: [[0, 30, 46], [0, 40, 62]], ct: [[0, 2, 3], [0, 0, 2]], fov: 42 }]);
    k.t.canh = "pho";
    k.t.tia = hien(f, 4, 1e9, 20);
    k.t.sang = 0.3;
    k.matTroi = 1 - hien(f, s2 - 10, 1e9, 12);
    k.chipY = 60;
    k.chip = [
      L("1 · hộ gia đình, nhà xưởng", C_MAI, hien(f, s2, 1e9, 14)),
      L("2 · lưới điện", C_LUOI, hien(f, s3, 1e9, 14)),
      L("3 · môi trường", C_TIEN, hien(f, s4, 1e9, 14)),
    ].filter((x) => x.mo > 0);
    if (f < s2) k.so = { chu: "Mái nhà có tấm pin được gì?", mo: Math.min(1, (s2 - 4 - f) / 12), y: 190, co: 76, mau: MAU.chu };
    if (f >= s5) k.chip.push(L("+ giới hạn thật", XAM_CHIP, hien(f, tuChu(1, 5, "giới") - 4, 1e9, 14)));
  }

  // ---------- Chương 2: điện mái dùng ngay trong nhà, lưới bù phần thiếu ----------
  if (c === 2) {
    const [s0, s1, s2, s3, s4] = [0, 1, 2, 3, 4].map((i) => s(2, i));
    dat([
      { tu: 0, den: s1 + 10, cp: [[-4, 6.6, 23], [-3, 6.0, 21]], ct: [[-3, 3.0, 2], [-2.5, 2.8, 2]], fov: 46 },
      { tu: s1 + 10, den: s3, cp: [[-3, 6.0, 21], [0, 5.0, 18.5]], ct: [[-2.5, 2.8, 2], [-0.5, 2.4, 3]], fov: 46 },
      { tu: s3, den: H, cp: [[0, 5.0, 18.5], [-1.5, 5.6, 20.5]], ct: [[-0.5, 2.4, 3], [-1.5, 2.6, 2.5]], fov: 46 },
    ]);
    k.t.canh = "nha";
    // câu 2: điện mái không đủ (mây che) thì lưới bù: hạt cam mờ bớt, hạt xanh chạy vào nhà
    const thieu = hien(f, s2 + 6, s3 + 20, 16, 16);
    k.t.nha = { dong: hien(f, s0 + 14, 1e9, 24) * (1 - 0.6 * thieu), chia: 0, sang: 0.35, mo: 1, vao: thieu };
    k.matTroi = hien(f, 4, 1e9, 30) * (1 - 0.65 * thieu);
    k.matTroiX = 40;
    k.nhan = [
      { p: [VT_NHA[0] + 0.9, 2.2, VT_NHA[2] + 5.0], chu: "dùng ngay trong nhà", nho: "tủ lạnh, quạt, điều hoà", mo: hien(f, s1 + 6, s3 - 4, 14, 12), mau: C_MAI, ben: "phai" },
      { p: [VT_NHA[0] + X_CONGTO + 0.75, 2.0, Z_CONGTO + 0.3], chu: "công tơ", nho: "giờ nắng: đếm ít số hơn", mo: hien(f, s3, 1e9, 14), mau: C_LUOI, ben: "phai" },
      { p: [X_COT, 5.6, Z_COT], chu: "lưới bù phần thiếu", mo: hien(f, s2 + 6, s3 + 20, 14, 14), mau: C_LUOI, ben: "trai" },
    ];
    if (f >= s4) k.so = { chu: "1 số điện mái dùng ngay = 1 số không phải mua", mo: hien(f, s4 + 4, 1e9, 14), y: 150, co: 54, mau: C_TIEN };
  }

  // ---------- Chương 5: tấm pin che nắng cho mái ----------
  if (c === 5) {
    const [s0, s1, s2, s3, s4] = [0, 1, 2, 3, 4].map((i) => s(5, i));
    dat([
      { tu: 0, den: s1 + 20, cp: [[16, 10, 18], [13, 8.6, 15.5]], ct: [[0, 4.6, 2], [0, 4.6, 2]], fov: 44 },
      { tu: s1 + 20, den: s2 + 10, cp: [[13, 8.6, 15.5], [7.5, 6.6, 12.5]], ct: [[0, 4.6, 2], [0.5, 5.2, 2.4]], fov: 44 },
      { tu: s2 + 10, den: H, cp: [[7.5, 6.6, 12.5], [-6, 8.5, 19]], ct: [[0.5, 5.2, 2.4], [4.5, 3.4, 1]], fov: 44 },
    ]);
    k.t.canh = "mat";
    k.t.mat = { tia: hien(f, 6, 1e9, 20), gio: hien(f, tuChu(5, 1, "gió") - 6, 1e9, 16), bong: 1 };
    k.matTroi = hien(f, 2, tuChu(5, 2, "nhiệt") - 12, 30, 12);
    k.nhan = [
      { p: [2.7, 7.0, 3.4], chu: "tấm pin hứng nắng", mo: hien(f, s1 - 4, s2 + 6, 14, 12), mau: C_MAI, ben: "phai" },
      { p: [-3.9, 5.2, 4.4], chu: "mái trong bóng râm", mo: hien(f, tuChu(5, 1, "bóng") - 4, s2 + 6, 14, 12), mau: C_LUOI, ben: "trai" },
      { p: [3.9, 5.6, 4.8], chu: "khe gió lùa", mo: hien(f, tuChu(5, 1, "gió") - 4, s2 + 6, 14, 12), mau: "#2563EB", ben: "phai" },
    ];
    k.the = {
      tieu: "UC San Diego, công bố 2011: đo trên một toà nhà",
      dong: [
        { chu: "Nhiệt truyền tới mái: giảm khoảng 38%", mau: C_MAI, mo: hien(f, tuChu(5, 2, "nhiệt") - 4) },
        { chu: "Trần nhà ban ngày: mát hơn khoảng 2,8 °C", gt: "tức 5 °F; nhà ở Việt Nam khác tuỳ cách lắp, khí hậu", mau: C_LUOI, mo: hien(f, tuChu(5, 2, "trần") - 4) },
      ],
      mo: hien(f, tuChu(5, 2, "nhiệt") - 12, 1e9, 14), y: 150, x: 1080, w: 720,
    };
  }

  // ---------- Chương 6: nhà xưởng mái rộng ----------
  if (c === 6) {
    const [s0, s1, s2, s3, s4] = [0, 1, 2, 3, 4].map((i) => s(6, i));
    const X = VT_XUONG;
    dat([
      { tu: 0, den: s1 + 30, cp: [[X[0] + 30, 30, X[2] + 44], [X[0] + 22, 26, X[2] + 38]], ct: [[X[0], 6, X[2]], [X[0], 6, X[2]]], fov: 42 },
      { tu: s1 + 30, den: s3, cp: [[X[0] + 22, 26, X[2] + 38], [X[0] - 4, 30, X[2] + 40]], ct: [[X[0], 6, X[2]], [X[0], 7, X[2]]], fov: 42 },
      { tu: s3, den: H, cp: [[X[0] - 4, 30, X[2] + 40], [X[0] - 14, 24, X[2] + 34]], ct: [[X[0], 7, X[2]], [X[0], 6, X[2]]], fov: 42 },
    ]);
    k.t.canh = "xuong";
    k.t.ma = 1;
    k.t.dan = 1;
    k.t.cs = 1;
    k.t.xuong = tien(f, s1 - 6, s1 + 120);
    k.t.sang = 0.3 * hien(f, s2, 1e9, 20);
    k.matTroi = hien(f, 4, 1e9, 30);
    k.nhan = [
      { p: [X[0] - 4, 12.5, X[2] - 3], chu: "mái xưởng thường rộng", nho: "đặt được rất nhiều tấm", mo: hien(f, s1 + 10, s3 - 4, 14, 12), mau: C_MAI, ben: "trai" },
      { p: [X[0] + 12, 4, X[2] + 6.6], chu: "máy chạy giờ có nắng", nho: "phần lớn điện mái thường dùng ngay", mo: hien(f, s2 + 6, s3 - 4, 14, 12), mau: C_TIEN, ben: "phai" },
    ];
    if (f >= s3) k.so = { chu: "100 kWp ≈ 140.000 số điện/năm", phu: "ví dụ minh hoạ, Thành phố Hồ Chí Minh (≈ 1.400 số mỗi kWp)", mo: hien(f, s3 + 4, 1e9, 14), y: 200, co: 76, mau: C_MAI };
  }

  // ---------- Chương 10: quy định hiện hành ----------
  if (c === 10) {
    const [s0, s1, s2, s3, s4] = [0, 1, 2, 3, 4].map((i) => s(10, i));
    dat([
      { tu: 0, den: s2, cp: [[-4, 6.8, 24.5], [-2.5, 6.4, 23]], ct: [[-4, 2.8, 2], [-2.5, 2.8, 2]], fov: 46 },
      { tu: s2, den: H, cp: [[-2.5, 6.4, 23], [-1.2, 5.6, 21]], ct: [[-2.5, 2.8, 2], [-1.2, 2.4, 2.8]], fov: 46 },
    ]);
    k.t.canh = "nha";
    k.t.nha = { dong: hien(f, 8, 1e9, 24), chia: tien(f, s3 - 10, s3 + 40), sang: 0.3, mo: 1, vao: 0 };
    k.matTroi = hien(f, 6, s2 - 8, 30, 12);
    k.the = {
      tieu: "Nghị định 58/2025/NĐ-CP, sửa bởi Nghị định 243/2026/NĐ-CP",
      dong: [
        { chu: "Tự làm ra, tự dùng là chính", mau: C_MAI, mo: hien(f, s2) },
        { chu: "Bán phần dư: tối đa 50%", gt: "sản lượng phát ra, theo cách tính của nghị định; phải làm thủ tục", mau: C_LUOI, mo: hien(f, s3 + 6) },
        { chu: "Thông báo trước khi lắp", gt: "lưới hạ áp: UBND cấp xã, trước ít nhất 10 ngày làm việc", mau: C_TIEN, mo: hien(f, s4 + 6) },
      ],
      mo: hien(f, s2 - 8, 1e9, 14), y: 90, x: 1010, w: 820,
    };
  }

  // ---------- Chương 11: tóm lại ----------
  if (c === 11) {
    const [s0, s1, s2, s3, s4] = [0, 1, 2, 3, 4].map((i) => s(11, i));
    dat([{ tu: 0, den: H, cp: [[0, 40, 62], [0, 30, 46]], ct: [[0, 0, 2], [0, 2, 3]], fov: 42 }]);
    k.t.canh = "pho";
    k.t.tia = hien(f, 4, 1e9, 20);
    k.t.sang = 0.3;
    k.matTroi = 1 - hien(f, s1 - 10, 1e9, 12);
    k.chipY = 60;
    k.chip = [
      L("hoá đơn nhẹ đi, mái mát hơn", C_MAI, hien(f, s1, 1e9, 14)),
      L("lưới bớt tải trưa nắng", C_LUOI, hien(f, s2, 1e9, 14)),
      L("bớt khí thải", C_TIEN, hien(f, s3, 1e9, 14)),
    ].filter((x) => x.mo > 0);
    if (f >= s4) k.so = { chu: "dùng điện ban ngày · mái đủ nắng", mo: hien(f, s4 + 6, 1e9, 14), y: 230, co: 64, mau: MAU.chu };
  }

  return k;
};
const XAM_CHIP = "#52606F";

// Màn che khi đổi giữa cảnh 3D và cảnh đồ thị: cùng nền xanh nhạt nên chỉ mờ nhẹ, chuyển trong 12 khung mỗi bên.
// khoá cảnh: cảnh 3D đổi kiểu dựng thì che; cảnh đồ thị đổi chương thì che (chương 3 và 4 dùng chung một đồ thị nên coi là một)
const STUDIO: string[] = Array.from({ length: TONG + 1 }, (_, g) => {
  const x = khungGoc(g);
  return x.studio === "ve" ? `ve${x.c === 4 ? 3 : x.c}` : `3d${x.t.canh}`;
});
export const khung = (g: number): Khung => {
  const k = khungGoc(g);
  for (let d = 0; d <= 12; d++) {
    for (const g0 of [g - d, g + d + 1]) {
      if (g0 < 1 || g0 > TONG) continue;
      const A = STUDIO[g0 - 1], Bb = STUDIO[g0];
      if (A === Bb) continue;
      const rong = 12;
      const sau = g >= g0;
      const xa = sau ? g - g0 : g0 - 1 - g;
      if (xa > rong) continue;
      k.man = Math.min(1, (1 - xa / (rong + 1)) * 1.6);
      k.manMau = MAU.nen;
      return k;
    }
  }
  return k;
};
