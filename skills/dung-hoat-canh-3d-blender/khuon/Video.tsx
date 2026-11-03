// Cảnh thử D-11 lần 2 (xe tự hành Mặt Trăng, mô hình chi tiết tải về): ghép ảnh Blender Cycles (nền trong suốt) lên nền xám phòng chụp,
// dựng viền xanh ngọc từ ảnh mặt nạ, nhãn chữ có chân màu trắng viền tối kèm mũi tên đỏ, phụ đề theo câu, giọng và nhạc.
// Mốc lấy từ thoi_gian.json (tao_thoi_gian.py) — cùng file Blender dùng để đặt máy quay.
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import TG from "./thoi_gian.json";

export const FPS = TG.fps;
export const TONG = TG.tong;
// "blender_nhap" = lượt nháp 960×540; đổi thành "blender" khi kết xuất bản 1920×1080
export const THU_MUC = "blender_nhap";
const TU = TG.tu;
// khớp các mốc trong canh3d/dung_blender.py
const F_BAY1 = TU.apollo + 40, F_PIN_VE = TU.lop - 14, F_BAY2 = TU.lop - 8;

// Bảng màu D-11 (đo trên video mẫu Jared Owen, 26/10/2026)
export const MAU = {
  nenGiua: "#82869a",
  nenRia: "#696d7b",
  vien: "#57D6CA",
  vienLoi: "#B9FFF6",
  muiTen: "#D82C43",
  chu: "#FFFFFF",
};
const CHU_CO_CHAN = "Georgia, 'Times New Roman', serif";
const CHU_KHONG_CHAN = "'Helvetica Neue', Arial, sans-serif";
const BONG_CHU = "0 0 2px #111, 0 0 2px #111, 1px 1px 0 #111, -1px -1px 0 #111, 1px -1px 0 #111, -1px 1px 0 #111, 0 3px 8px rgba(0,0,0,0.55)";

// độ hiện 0..1: mờ vào 7 khung, mờ ra 7 khung (video mẫu: khoảng 0,25 giây)
const hien = (f: number, vao: number, ra: number, mo = 7) =>
  interpolate(f, [vao, vao + mo, ra - mo, ra], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const so4 = (n: number) => String(n).padStart(4, "0");

// Viền xanh ngọc: lấy một kênh màu của mặt nạ làm hình bộ phận, nới rộng vài điểm ảnh, trừ đi hình gốc
// để còn lại đường viền, rồi làm nhoè thêm một lớp cho có quầng sáng.
const KENH = { banh: "1 0 0", dong_co: "0 1 0", pin: "0 0 1" } as const;
const BoLocVien: React.FC = () => (
  <defs>
    {Object.entries(KENH).map(([ten, k]) => (
      <filter key={ten} id={`vien_${ten}`} x="0" y="0" width="1920" height="1080" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values={`0 0 0 0 0.34  0 0 0 0 0.84  0 0 0 0 0.79  ${k} 0 0`} result="hinh" />
        <feComponentTransfer in="hinh" result="hinhRo"><feFuncA type="linear" slope="3" intercept="-0.6" /></feComponentTransfer>
        <feMorphology in="hinhRo" operator="dilate" radius="3.5" result="no" />
        <feComposite in="no" in2="hinhRo" operator="out" result="vien" />
        <feGaussianBlur in="vien" stdDeviation="5" result="quang" />
        <feMerge><feMergeNode in="quang" /><feMergeNode in="quang" /><feMergeNode in="vien" /></feMerge>
      </filter>
    ))}
  </defs>
);

const MuiTen: React.FC<{ tu: [number, number]; den: [number, number]; o: number }> = ({ tu, den, o }) => {
  const [x1, y1] = tu, [x2, y2] = den;
  const g = Math.atan2(y2 - y1, x2 - x1), d = 26;
  const dau = (a: number) => `${x2 - d * Math.cos(g + a)},${y2 - d * Math.sin(g + a)}`;
  return (
    <g opacity={o}>
      <line x1={x1} y1={y1} x2={x2 - 14 * Math.cos(g)} y2={y2 - 14 * Math.sin(g)} stroke="#3a0a10" strokeWidth={11} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${dau(0.45)} ${dau(-0.45)}`} fill="#3a0a10" stroke="#3a0a10" strokeWidth={4} strokeLinejoin="round" />
      <line x1={x1} y1={y1} x2={x2 - 14 * Math.cos(g)} y2={y2 - 14 * Math.sin(g)} stroke={MAU.muiTen} strokeWidth={7} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${dau(0.45)} ${dau(-0.45)}`} fill={MAU.muiTen} />
    </g>
  );
};

// Nhãn kiểu video mẫu: dòng chính chữ có chân đậm, dòng phụ chữ không chân nhỏ hơn, các dòng hiện lệch nhau
type Nhan = { x: number; y: number; chinh: string; phu?: string; phuVao?: number; phu2?: string; phu2Vao?: number; dong3?: string; dong3Vao?: number; trai?: boolean; vao: number; ra: number; muiTen?: [[number, number], [number, number]] };
const NhanChu: React.FC<{ n: Nhan; f: number }> = ({ n, f }) => {
  const o = hien(f, n.vao, n.ra);
  const oPhu = n.phu ? hien(f, n.phuVao ?? n.vao + 10, n.ra) : 0;
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: n.x, top: n.y, transform: n.trai ? undefined : "translateX(-50%)", textAlign: n.trai ? "left" : "center", whiteSpace: "nowrap" }}>
      <div style={{ opacity: o, fontFamily: CHU_CO_CHAN, fontWeight: 700, fontSize: 58, color: MAU.chu, textShadow: BONG_CHU, lineHeight: 1.15 }}>{n.chinh}</div>
      {n.phu ? (
        <div style={{ opacity: oPhu, fontFamily: CHU_KHONG_CHAN, fontWeight: 500, fontSize: 36, color: MAU.chu, textShadow: BONG_CHU, marginTop: 4 }}>
          {n.phu}
          {n.phu2 ? <span style={{ opacity: hien(f, n.phu2Vao ?? n.ra, n.ra) }}>{n.phu2}</span> : null}
        </div>
      ) : null}
      {n.dong3 ? (
        <div style={{ opacity: hien(f, n.dong3Vao ?? n.vao, n.ra), fontFamily: CHU_KHONG_CHAN, fontStyle: "italic", fontWeight: 500, fontSize: 32, color: MAU.chu, textShadow: BONG_CHU, marginTop: 4 }}>{n.dong3}</div>
      ) : null}
    </div>
  );
};

const NHAN: Nhan[] = [
  { x: 80, y: 70, trai: true, chinh: "Xe tự hành Mặt Trăng", phu: "Lunar Roving Vehicle (LRV)", dong3: "Apollo 15 · 16 · 17", dong3Vao: TU.apollo,
    vao: TU.xe, ra: F_BAY1 - 2 },
  { x: 380, y: 790, chinh: "Động cơ điện", phu: "mỗi bánh một động cơ riêng", vao: TU.dong_co, ra: TU.pin - 2, muiTen: [[560, 800], [890, 635]] },
  { x: 400, y: 110, chinh: "Hai bộ pin 36 vôn", vao: TU.pin, ra: F_PIN_VE + 6, muiTen: [[470, 200], [670, 325]] },
  { x: 1450, y: 110, chinh: "Lốp lưới thép", phu: "dây thép mạ kẽm đan lại", phuVao: TU.luoi, dong3: "vấu titan để bám đất", dong3Vao: TU.vau,
    vao: TU.lop + 4, ra: TONG + 10 },
];

const VIEN: { ten: keyof typeof KENH; vao: number; ra: number }[] = [
  { ten: "dong_co", vao: TU.dong_co, ra: TU.pin - 2 },
  { ten: "pin", vao: TU.pin, ra: F_PIN_VE + 6 },
  { ten: "banh", vao: TU.lop + 4, ra: TONG + 10 },
];

const PhuDe: React.FC<{ f: number }> = ({ f }) => {
  const c = TG.cau.find((x, i) => f >= x.f - 3 && f < (TG.cau[i + 1]?.f ?? TONG) - 3);
  if (!c) return null;
  const o = interpolate(f, [c.f - 3, c.f + 3, c.het + 6, c.het + 12], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 60, right: 60, bottom: 52, textAlign: "center", opacity: o,
      fontFamily: CHU_KHONG_CHAN, fontWeight: 500, fontSize: 36, color: MAU.chu, textShadow: BONG_CHU, lineHeight: 1.3 }}>
      {c.chu}
    </div>
  );
};

export const Video: React.FC = () => {
  const f = useCurrentFrame();
  const anh = Math.min(f, TONG - 1);
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse 75% 70% at 50% 42%, ${MAU.nenGiua}, ${MAU.nenRia})` }}>
      <Img src={staticFile(`${THU_MUC}/f_${so4(anh)}.png`)} style={{ position: "absolute", width: 1920, height: 1080 }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <BoLocVien />
        {VIEN.map((v) => {
          const o = hien(f, v.vao, v.ra);
          return o > 0 ? (
            <image key={v.ten} href={staticFile(`${THU_MUC}_mat_na/m_${so4(anh)}.png`)} width={1920} height={1080}
              filter={`url(#vien_${v.ten})`} opacity={o} preserveAspectRatio="none" />
          ) : null;
        })}
        {NHAN.filter((n) => n.muiTen).map((n) => (
          <MuiTen key={n.chinh} tu={n.muiTen![0]} den={n.muiTen![1]} o={hien(f, n.vao + 3, n.ra)} />
        ))}
      </svg>
      {NHAN.map((n) => <NhanChu key={n.chinh} n={n} f={f} />)}
      <PhuDe f={f} />
      {/* giọng bắt đầu ở câu đầu (câu 1 có mốc 0 giây trong file giọng) */}
      <Sequence from={TG.cau[0].f}><Audio src={staticFile("giong/c1.wav")} /></Sequence>
      <Audio src={staticFile("nhac/leberch-science-documentary-594955.mp3")}
        volume={(x) => interpolate(x, [0, 15, TONG - 30, TONG], [0, 0.13, 0.13, 0], { extrapolateRight: "clamp" })} />
    </AbsoluteFill>
  );
};
