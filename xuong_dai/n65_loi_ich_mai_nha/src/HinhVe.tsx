// Năm cảnh đồ thị (CL-05) của video "Lợi ích của điện mặt trời mái nhà" (n65), vẽ bằng SVG trên nền xanh nhạt bảng M1 (MAU-10):
// chương 3–4: hộ mẫu, biểu giá bậc thang năm bậc và hoá đơn trước, sau khi có điện mái (ước tính minh hoạ);
// chương 7: đường điện đi xa và hao trên đường, điện mái dùng tại chỗ; đường phụ tải ngày nắng nóng và đường điện mặt trời;
// chương 8: khí CO2 tránh được; chương 9: ngày và đêm, sản lượng theo vùng, giờ nắng tháng 3 và tháng 7 ở Hà Nội.
// Mọi số lấy từ san_pham/2026.11.01.loi_ich_dien_mat_troi_mai_nha/tai_nguyen/kich_ban/*.nguon_kiem_chung.md.
// Lưu ý: hàm tien(f, a, b) chỉ dùng với số khung, không dùng với tiến độ thập phân 0–1.
import React from "react";
import { MAU } from "./CoBan";
import { C_CANH, C_CHU, C_KHI, C_LUOI, C_MAI, C_TIEN, XAM } from "./Canh3D";
import { cl, hien, s, tien } from "./ThoiGian";
import { tuChu } from "./KichBan";

const CHU = "Helvetica Neue, Arial, sans-serif";
const LUOI = "#B9C9DA";
const NEN = MAU.nen;
const THE = MAU.theMo(0.96);
const so = (n: number) => Math.round(n).toLocaleString("vi-VN");

const Chu: React.FC<{ x: number; y: number; c: React.ReactNode; co?: number; mau?: string; mo?: number; giua?: boolean; phai?: boolean; dam?: boolean }> = ({ x, y, c, co = 30, mau = C_CHU, mo = 1, giua, phai, dam }) =>
  mo <= 0 ? null : (
    <text x={x} y={y} fontSize={co} fill={mau} opacity={mo} textAnchor={giua ? "middle" : phai ? "end" : "start"} fontWeight={dam ? 700 : 400} fontFamily={CHU}>{c}</text>
  );

// dải sáng quét ngang cả khung (chuyển động diện tích lớn để cảnh đồ thị không bị đo là đứng hình)
const DaiQuet: React.FC<{ f: number; mau: string; id: string }> = ({ f, mau, id }) => {
  const u = ((f / 110) % 1 + 1) % 1;
  const x = -520 + u * (1920 + 520);
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={mau} stopOpacity={0} />
          <stop offset="0.5" stopColor={mau} stopOpacity={0.13} />
          <stop offset="1" stopColor={mau} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x} y={0} width={520} height={1080} fill={`url(#${id})`} />
    </g>
  );
};

const The: React.FC<{ x: number; y: number; w: number; h: number; mau: string; mo: number }> = ({ x, y, w, h, mau, mo }) =>
  mo <= 0 ? null : <rect x={x} y={y} width={w} height={h} rx={20} fill={THE} stroke={mau} strokeWidth={4} opacity={mo} />;

const Tieu: React.FC<{ f: number; t1: string; t2: string }> = ({ f, t1, t2 }) => (
  <>
    <Chu x={150} y={104} c={t1} co={44} dam mo={hien(f, 2, 1e9, 14)} />
    <Chu x={150} y={144} c={t2} co={26} mau={XAM} mo={hien(f, 6, 1e9, 14)} />
  </>
);
const Khung: React.FC<{ children: React.ReactNode; f: number; id: string; mau: string }> = ({ children, f, id, mau }) => (
  <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}>
    <rect width={1920} height={1080} fill={NEN} />
    <DaiQuet f={f} mau={mau} id={id} />
    {children}
  </svg>
);
const Huy: React.FC<{ x: number; y: number; mo: number }> = ({ x, y, mo }) =>
  mo <= 0 ? null : (
    <g opacity={mo}>
      <rect x={x} y={y} width={300} height={46} rx={23} fill={C_CANH} />
      <Chu x={x + 150} y={y + 32} c="ƯỚC TÍNH MINH HOẠ" co={24} dam giua mau="#FFFFFF" />
    </g>
  );

// ======================= chương 3–4: hộ mẫu và biểu giá bậc thang =======================
const BAC = [
  { a: 0, b: 100, gia: 1901 },
  { a: 100, b: 200, gia: 2289 },
  { a: 200, b: 400, gia: 2894 },
  { a: 400, b: 700, gia: 3456 },
  { a: 700, b: 800, gia: 3844 },
];
const X3 = (kwh: number) => 170 + kwh * 1.15;
const Y3 = (gia: number) => 770 - gia * 0.11;

const Canh34: React.FC<{ c: number; f: number }> = ({ c, f }) => {
  const c3 = c === 3;
  const S = (i: number) => s(c, i);
  // mốc theo chương 3; sang chương 4 mọi thứ đã hiện đủ
  const m = (i: number, d = 0) => (c3 ? S(i) + d : -1e6);
  const uDung = c3 ? tien(f, m(1, 6), m(1, 70)) : 1; // thanh 400 số chạy đầy
  const moBac = c3 ? hien(f, m(2, 4), 1e9, 14) : 1;
  const moHD = c3 ? hien(f, tuChu(3, 2, "hoá") - 4, 1e9, 14) : 1;
  const moMai = c3 ? hien(f, m(3, 4), 1e9, 14) : 0;
  const moPhep = c3 ? hien(f, m(4, 10), 1e9, 14) : 0;
  const uPhu = c3 ? tien(f, m(5, 6), m(5, 60)) : 1; // điện mái phủ 200 số trên cùng
  const moSau = c3 ? hien(f, m(6, 10), 1e9, 14) : 1;
  // chương 4
  const S4 = (i: number) => (c3 ? 1e9 : s(4, i));
  const moGiam = c3 ? 0 : hien(f, 4, 1e9, 14);
  const toBac3 = c3 ? 0 : hien(f, S4(2) + 4, S4(3) + 4, 12, 12);
  const toBac12 = c3 ? 0 : hien(f, S4(3) + 4, S4(4), 12, 12);
  const moLen = c3 ? 0 : hien(f, S4(4) + 6, 1e9, 14);
  return (
    <Khung f={f} id={`q${c}`} mau={C_MAI}>
      <Tieu f={c3 ? f : 99} t1="Một hộ mẫu ở Thành phố Hồ Chí Minh" t2="biểu giá điện sinh hoạt năm bậc, áp dụng từ 1/11/2026 (Quyết định 2892/QĐ-BCT), chưa gồm thuế GTGT" />
      <Huy x={1490} y={70} mo={c3 ? hien(f, S(0) + 30, 1e9, 14) : 1} />
      {/* trục */}
      <g opacity={moBac}>
        <line x1={X3(0)} y1={Y3(0)} x2={X3(800) + 20} y2={Y3(0)} stroke={LUOI} strokeWidth={3} />
        {[0, 100, 200, 400, 700].map((v) => <Chu key={v} x={X3(v)} y={Y3(0) + 36} c={so(v)} co={24} mau={XAM} giua />)}
        <Chu x={X3(0)} y={Y3(4000) - 10} c="giá mỗi số (đồng)" co={22} mau={XAM} />
        {BAC.map((b, i) => {
          const trong = b.a < 400;
          const mau = trong ? (i === 2 ? C_MAI : "#E58A55") : "#C9D5E2";
          const sang = (i === 2 ? toBac3 : 0) + (i < 2 ? toBac12 : 0);
          return (
            <g key={i}>
              <rect x={X3(b.a) + 2} y={Y3(b.gia)} width={X3(b.b) - X3(b.a) - 4} height={Y3(0) - Y3(b.gia)} rx={6}
                fill={mau} opacity={i === 2 ? 1 : trong ? 0.82 + 0.18 * sang : 0.6} stroke={sang > 0 ? C_CHU : "none"} strokeWidth={5 * sang} />
              <Chu x={(X3(b.a) + X3(b.b)) / 2} y={Y3(b.gia) - 14} c={so(b.gia)} co={26} dam giua mau={trong ? C_CHU : XAM} />
              <Chu x={(X3(b.a) + X3(b.b)) / 2} y={Y3(0) - 16} c={`bậc ${i + 1}`} co={22} giua mau={i === 2 ? "#FFFFFF" : C_CHU} />
            </g>
          );
        })}
        {/* phần hộ không dùng tới: phủ mờ */}
      </g>
      {/* thanh 400 số */}
      <g opacity={c3 ? hien(f, m(1, 0), 1e9, 14) : 1}>
        <rect x={X3(0)} y={Y3(0) + 52} width={X3(400) - X3(0)} height={20} rx={10} fill="#D5E0EC" />
        <rect x={X3(0)} y={Y3(0) + 52} width={(X3(400) - X3(0)) * uDung} height={20} rx={10} fill={C_LUOI} />
        <Chu x={X3(400) + 14} y={Y3(0) + 71} c="hộ dùng 400 số/tháng" co={26} dam mau={C_LUOI} />
      </g>
      {/* điện mái phủ 200 số trên cùng (bậc 3) */}
      {uPhu > 0.001 && (
        <g>
          <defs>
            <pattern id="soc" width={18} height={18} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width={18} height={18} fill="#FFF4E8" />
              <rect width={8} height={18} fill={C_MAI} opacity={0.55} />
            </pattern>
          </defs>
          <rect x={X3(400) - (X3(400) - X3(200)) * uPhu + 2} y={Y3(2894)} width={(X3(400) - X3(200)) * uPhu - 4} height={Y3(0) - Y3(2894)} rx={6} fill="url(#soc)" stroke={C_MAI} strokeWidth={4} />
          <g opacity={cl((uPhu - 0.7) / 0.3)}>
            <rect x={X3(300) - 120} y={Y3(1450) - 34} width={240} height={88} rx={14} fill={THE} />
            <Chu x={X3(300)} y={Y3(1450)} c="điện mái" co={30} dam giua mau={C_MAI} />
            <Chu x={X3(300)} y={Y3(1450) + 36} c="dùng ngay 200 số" co={26} giua mau={C_MAI} />
          </g>
        </g>
      )}
      {/* thẻ hoá đơn */}
      <g opacity={moHD}>
        <The x={1180} y={250} w={620} h={moSau > 0 && !c3 ? 300 : 300} mau={C_LUOI} mo={1} />
        <Chu x={1210} y={300} c="Hoá đơn một tháng (đồng)" co={30} dam />
        <Chu x={1210} y={346} c="100 số × 1.901 = 190.100" co={27} mau={C_CHU} />
        <Chu x={1210} y={388} c="100 số × 2.289 = 228.900" co={27} mau={C_CHU} />
        <Chu x={1210} y={430} c="200 số × 2.894 = 578.800" co={27} mau={uPhu > 0.5 ? XAM : C_CHU} />
        {uPhu > 0.5 && <line x1={1206} y1={421} x2={1560} y2={421} stroke={C_MAI} strokeWidth={4} opacity={cl((uPhu - 0.5) / 0.3)} />}
        <line x1={1210} y1={452} x2={1770} y2={452} stroke={LUOI} strokeWidth={2} />
        <Chu x={1210} y={500} c={moSau > 0.5 ? "Sau: 190.100 + 228.900 = 419.000" : "Trước: tổng 997.800 ≈ 998 nghìn"} co={30} dam mau={moSau > 0.5 ? C_TIEN : C_LUOI} />
        {moSau > 0.5 && <Chu x={1210} y={536} c="Trước: 997.800" co={24} mau={XAM} />}
      </g>
      {/* thẻ mái nhà */}
      <g opacity={moMai}>
        <The x={1180} y={580} w={620} h={250} mau={C_MAI} mo={1} />
        <Chu x={1210} y={630} c="Mái 2 kWp" co={34} dam mau={C_MAI} />
        <Chu x={1210} y={676} c="mỗi kWp ≈ 1.400 số điện/năm" co={27} mau={C_CHU} />
        <Chu x={1210} y={720} c="2 × 1.400 ÷ 12 ≈ 230 số/tháng" co={30} dam mau={C_MAI} mo={moPhep} />
        <Chu x={1210} y={766} c="giả sử dùng ngay ban ngày ≈ 200 số" co={27} mau={C_CHU} mo={c3 ? hien(f, m(5, 4), 1e9, 14) : 0} />
        <Chu x={1210} y={806} c="phần còn lại lên lưới" co={24} mau={XAM} mo={c3 ? hien(f, m(5, 30), 1e9, 14) : 0} />
      </g>
      {/* chương 4: con số giảm, bậc càng cao càng đáng giá */}
      <g opacity={moGiam}>
        <The x={1180} y={580} w={620} h={250} mau={C_TIEN} mo={1} />
        <Chu x={1490} y={650} c="− 578.800 đồng/tháng" co={46} dam giua mau={C_TIEN} />
        <Chu x={1490} y={704} c="≈ 58% hoá đơn" co={36} dam giua mau={C_TIEN} />
        <Chu x={1490} y={760} c="trong khi số điện mua: 400 → 200" co={27} giua mau={C_CHU} />
        <Chu x={1490} y={798} c="(bớt 50%)" co={24} giua mau={XAM} />
      </g>
      <g opacity={moLen}>
        <path d={`M${X3(50)},${Y3(1901) - 80} L${X3(550)},${Y3(3456) - 80} L${X3(740)},${Y3(3844) - 80}`} stroke={C_CANH} strokeWidth={6} strokeDasharray="14 10" fill="none" />
        <path d={`M${X3(750)},${Y3(3844) - 82} l-30,-10 l6,26 z`} fill={C_CANH} />
        <rect x={X3(0) - 10} y={Y3(3844) - 150} width={720} height={56} rx={14} fill={THE} />
        <Chu x={X3(0) + 6} y={Y3(3844) - 112} c="dùng càng nhiều, bậc càng cao: mỗi số điện mái càng đáng giá" co={26} dam mau={C_CANH} />
      </g>
      <Chu x={150} y={1010} c="" />
    </Khung>
  );
};

// ======================= chương 7: lưới điện =======================
const X7 = (h: number) => 230 + h * 52;
const Y7 = (p: number) => 840 - p * 520;
const nhuCau = (h: number) => 0.56 + 0.1 * Math.sin(((h - 6) / 24) * 2 * Math.PI) + 0.3 * Math.exp(-(((h - 13.5) / 3.6) ** 2)) + 0.12 * Math.exp(-(((h - 19.5) / 2.2) ** 2));
const matTroi = (h: number) => (h <= 6 || h >= 18 ? 0 : 0.42 * Math.sin(((h - 6) / 12) * Math.PI) ** 1.5);
const duong = (fn: (h: number) => number) => Array.from({ length: 97 }, (_, i) => i / 4).map((h, i) => `${i ? "L" : "M"}${X7(h).toFixed(1)},${Y7(fn(h)).toFixed(1)}`).join(" ");
const D_NC = duong(nhuCau);
const D_MT = duong(matTroi);
const D_CL = duong((h) => nhuCau(h) - matTroi(h));
const V_MT = `${D_MT} L${X7(24)},${Y7(0)} L${X7(0)},${Y7(0)} Z`;

const NhaMay: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-60} y={-70} width={120} height={70} rx={6} fill="#C9D5E2" stroke={C_KHI} strokeWidth={3} />
    <rect x={20} y={-130} width={26} height={62} fill="#C9D5E2" stroke={C_KHI} strokeWidth={3} />
    <rect x={-40} y={-104} width={22} height={36} fill="#C9D5E2" stroke={C_KHI} strokeWidth={3} />
  </g>
);
const Cot: React.FC<{ x: number; y: number; h: number }> = ({ x, y, h }) => (
  <g transform={`translate(${x},${y})`} stroke={C_KHI} strokeWidth={4} fill="none">
    <path d={`M-18,0 L0,${-h} L18,0 M-26,${-h + 14} L26,${-h + 14}`} />
  </g>
);
const Nha: React.FC<{ x: number; y: number; pin?: boolean }> = ({ x, y, pin }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-46} y={-60} width={92} height={60} fill="#FFFFFF" stroke={C_KHI} strokeWidth={3} />
    <path d="M-60,-58 L0,-104 L60,-58 Z" fill="#C4694B" stroke={C_KHI} strokeWidth={3} />
    {pin && <path d="M-44,-66 L-6,-96 L28,-70 L-10,-40 Z" fill="#1E3A6E" stroke="#9DB2C8" strokeWidth={2} transform="translate(4,4) scale(0.95)" />}
    <rect x={-12} y={-34} width={24} height={34} fill="#8A5A44" />
  </g>
);

const Canh7: React.FC<{ f: number }> = ({ f }) => {
  const [s0, s1, s2, s3, s4, s5, s6] = [0, 1, 2, 3, 4, 5, 6].map((i) => s(7, i));
  const moA = hien(f, 0, s4 - 2, 12, 16);
  const moB = hien(f, s4 + 6, 1e9, 16);
  const yL = 470;
  const chain = [330, 610, 890, 1170, 1450];
  const doanL = chain[4] - chain[0];
  const chay = (f * 4.2) % 60;
  const uNC = tien(f, s4 + 10, s4 + 70), uMT = tien(f, s5 + 4, s5 + 60), uCL = tien(f, s6 + 6, s6 + 70);
  const xcl = (u: number) => X7(0) + u * (X7(24) - X7(0));
  return (
    <Khung f={f} id="q7" mau={C_LUOI}>
      <Tieu f={f} t1="Lợi ích cho lưới điện" t2={f < s4 ? "điện đi đường dài thì hao một phần thành nhiệt; điện mái dùng ngay dưới mái" : "phụ tải cả nước một ngày nắng nóng và điện mái nhà: dạng minh hoạ, không theo số đo"} />
      {/* phần A: đường đi xa và đường tại chỗ */}
      <g opacity={moA}>
        <g opacity={hien(f, s0 + 20, 1e9, 14)} transform="translate(890 400) scale(1.3) translate(-890 -400)">
          <line x1={chain[0]} y1={yL - 90} x2={chain[4]} y2={yL - 90} stroke={C_LUOI} strokeWidth={5} />
          {Array.from({ length: Math.floor(doanL / 60) + 1 }, (_, i) => {
            const x = chain[0] + ((i * 60 + chay) % doanL);
            return <circle key={i} cx={x} cy={yL - 90} r={9} fill={C_LUOI} />;
          })}
          {/* hao trên đường: chấm đỏ rơi xuống ở giữa mỗi đoạn */}
          {[0, 1, 2, 3].map((j) => {
            const x = (chain[j] + chain[j + 1]) / 2;
            const u = ((f + j * 17) % 50) / 50;
            return <circle key={j} cx={x} cy={yL - 80 + u * 70} r={11} fill={C_CANH} opacity={hien(f, s1 + 30, 1e9, 14) * (1 - u)} />;
          })}
          <NhaMay x={chain[0]} y={yL} />
          <Cot x={chain[1]} y={yL} h={120} />
          <g transform={`translate(${chain[2]},${yL})`}><rect x={-50} y={-70} width={100} height={70} rx={6} fill="#DCE5EF" stroke={C_KHI} strokeWidth={3} /><path d="M-30,-60 v50 M0,-60 v50 M30,-60 v50" stroke={C_KHI} strokeWidth={4} /></g>
          <Cot x={chain[3]} y={yL} h={90} />
          <Nha x={chain[4]} y={yL} />
          {["nhà máy lớn", "đường dây cao thế", "trạm biến áp", "đường dây phân phối", "nhà"].map((t, i) => <Chu key={i} x={chain[i]} y={yL + 40} c={t} co={24} giua mau={XAM} />)}
          <Chu x={(chain[0] + chain[4]) / 2} y={yL - 140} c="hao một phần thành nhiệt trên đường đi" co={28} dam giua mau={C_CANH} mo={hien(f, s1 + 40, 1e9, 14)} />
        </g>
        <g opacity={hien(f, s2 + 4, 1e9, 14)}>
          <Nha x={chain[4]} y={yL + 260} pin />
          {[0, 1, 2].map((i) => {
            const u = ((f + i * 12) % 36) / 36;
            return <circle key={i} cx={chain[4] - 6 + u * 4} cy={yL + 260 - 84 + u * 60} r={7} fill={C_MAI} opacity={1 - u * 0.6} />;
          })}
          <Chu x={chain[4] - 110} y={yL + 196} c="điện mái: dùng ngay dưới mái," co={30} dam phai mau={C_MAI} />
          <Chu x={chain[4] - 110} y={yL + 236} c="không phải đi xa" co={30} dam phai mau={C_MAI} />
        </g>
        <g opacity={hien(f, s3 + 4, 1e9, 14)}>
          <The x={150} y={720} w={980} h={110} mau={C_LUOI} mo={1} />
          <Chu x={180} y={766} c="Quy hoạch điện VIII điều chỉnh: giảm truyền tải điện đi xa giữa các miền" co={27} dam mau={C_LUOI} />
          <Chu x={180} y={806} c="Quyết định 768/QĐ-TTg ngày 15/4/2025" co={24} mau={XAM} />
        </g>
      </g>
      {/* phần B: đường phụ tải và điện mái */}
      <g opacity={moB}>
        <defs>
          <clipPath id="c7nc"><rect x={0} y={0} width={xcl(uNC)} height={1080} /></clipPath>
          <clipPath id="c7mt"><rect x={0} y={0} width={xcl(uMT)} height={1080} /></clipPath>
          <clipPath id="c7cl"><rect x={0} y={0} width={xcl(uCL)} height={1080} /></clipPath>
        </defs>
        <line x1={X7(0)} y1={Y7(0)} x2={X7(24)} y2={Y7(0)} stroke={LUOI} strokeWidth={3} />
        {[0, 3, 6, 9, 12, 15, 18, 21, 24].map((h) => <Chu key={h} x={X7(h)} y={Y7(0) + 38} c={`${h} giờ`} co={24} mau={XAM} giua />)}
        <g clipPath="url(#c7mt)">
          <path d={V_MT} fill={C_MAI} opacity={0.25} />
          <path d={D_MT} fill="none" stroke={C_MAI} strokeWidth={7} strokeLinecap="round" />
        </g>
        <g clipPath="url(#c7nc)"><path d={D_NC} fill="none" stroke={C_CHU} strokeWidth={8} strokeLinecap="round" /></g>
        <g clipPath="url(#c7cl)" opacity={hien(f, s6, 1e9, 14)}><path d={D_CL} fill="none" stroke={C_LUOI} strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" /></g>
        <line x1={X7(13.5)} y1={Y7(nhuCau(13.5)) - 20} x2={X7(13.5)} y2={Y7(0)} stroke={C_CANH} strokeWidth={3} strokeDasharray="8 8" opacity={hien(f, tuChu(7, 4, "đỉnh") - 4, 1e9, 14)} />
        <g opacity={hien(f, tuChu(7, 4, "đỉnh") - 4, 1e9, 14)}>
          <rect x={X7(13.5) - 190} y={Y7(nhuCau(13.5)) - 110} width={380} height={80} rx={14} fill={THE} />
          <Chu x={X7(13.5)} y={Y7(nhuCau(13.5)) - 74} c="đỉnh phụ tải ≈ 13 giờ 30" co={28} dam giua mau={C_CANH} />
          <Chu x={X7(13.5)} y={Y7(nhuCau(13.5)) - 42} c="những ngày nắng nóng" co={22} giua mau={XAM} />
        </g>
        <Chu x={X7(0.6)} y={Y7(0.62) - 30} c="phụ tải cả nước" co={28} dam mau={C_CHU} mo={hien(f, s4 + 40, 1e9, 14)} />
        <Chu x={X7(17.4)} y={Y7(0.1)} c="điện mái nhà" co={28} dam mau={C_MAI} mo={hien(f, s5 + 30, 1e9, 14)} />
        <g opacity={hien(f, s6 + 40, 1e9, 14)}>
          <The x={1500} y={330} w={300} h={170} mau={C_LUOI} mo={1} />
          <Chu x={1650} y={378} c="phần lưới có thể" co={26} dam giua mau={C_LUOI} />
          <Chu x={1650} y={414} c="phải gánh" co={28} dam giua mau={C_LUOI} />
          <Chu x={1650} y={452} c="(nét đứt) thấp hơn" co={24} giua mau={XAM} />
          <Chu x={1650} y={482} c="vào buổi trưa" co={24} giua mau={XAM} />
        </g>
      </g>
    </Khung>
  );
};

// ======================= chương 8: khí CO2 =======================
const Canh8: React.FC<{ f: number }> = ({ f }) => {
  const [s0, s1, s2, s3] = [0, 1, 2, 3].map((i) => s(8, i));
  const n = Math.floor(17 * tien(f, s3 + 10, s3 + 110) + 0.0001);
  return (
    <Khung f={f} id="q8" mau={C_TIEN}>
      <Tieu f={f} t1="Bớt khí thải" t2="hệ số phát thải lưới điện Việt Nam năm 2024: 0,6187 tấn CO2/MWh (Bộ Nông nghiệp và Môi trường, công văn ngày 30/9/2026)" />
      <g opacity={hien(f, s1 + 6, 1e9, 14)}>
        <The x={150} y={230} w={760} h={190} mau={C_KHI} mo={1} />
        <Chu x={530} y={300} c="1 số điện từ lưới (năm 2024)" co={30} giua mau={C_CHU} />
        <Chu x={530} y={378} c="≈ 0,62 kg CO2" co={66} dam giua mau={C_KHI} />
      </g>
      <g opacity={hien(f, s2 + 6, 1e9, 14)}>
        <The x={150} y={460} w={760} h={190} mau={C_MAI} mo={1} />
        <Chu x={530} y={530} c="Mái 2 kWp của hộ mẫu (2 × 1.400)" co={30} giua mau={C_CHU} />
        <Chu x={530} y={608} c="≈ 2.800 số điện/năm" co={60} dam giua mau={C_MAI} />
      </g>
      <g opacity={hien(f, s3 + 4, 1e9, 14)}>
        <The x={150} y={690} w={760} h={150} mau={C_TIEN} mo={1} />
        <Chu x={530} y={746} c="nếu thay hết cho điện lưới: 2.800 × 0,6187 kg ≈ 1.730 kg" co={26} giua mau={C_CHU} />
        <Chu x={530} y={810} c="≈ 1,7 tấn CO2 mỗi năm" co={50} dam giua mau={C_TIEN} />
      </g>
      {/* 17 khối, mỗi khối 100 kg CO2 không phải thải */}
      <g opacity={hien(f, s3, 1e9, 14)}>
        <Chu x={1000} y={250} c="mỗi ô = 100 kg CO2 không phải thải ra" co={26} mau={XAM} />
        {Array.from({ length: 17 }, (_, i) => {
          const x = 1010 + (i % 5) * 160, y = 290 + Math.floor(i / 5) * 140;
          const hien_ = i < n;
          return (
            <g key={i} opacity={hien_ ? 1 : 0.18}>
              <circle cx={x + 46} cy={y + 64} r={34} fill={hien_ ? C_TIEN : C_KHI} />
              <circle cx={x + 86} cy={y + 56} r={40} fill={hien_ ? C_TIEN : C_KHI} />
              <circle cx={x + 120} cy={y + 70} r={28} fill={hien_ ? C_TIEN : C_KHI} />
              <Chu x={x + 84} y={y + 76} c="CO2" co={26} dam giua mau="#FFFFFF" />
            </g>
          );
        })}
      </g>
    </Khung>
  );
};

// ======================= chương 9: giới hạn =======================
const Canh9: React.FC<{ f: number }> = ({ f }) => {
  const [s0, s1, s2, s3, s4, s5] = [0, 1, 2, 3, 4, 5].map((i) => s(9, i));
  const uV = tien(f, s3 + 6, s3 + 70), uT = tien(f, s4 + 6, s4 + 70);
  const kim = ((f / 60) % 24 + 24) % 24; // kim giờ chạy vòng ngày
  const ngay = kim >= 6 && kim < 18;
  return (
    <Khung f={f} id="q9" mau={C_LUOI}>
      <Tieu f={f} t1="Giới hạn: chỉ có nắng mới có điện" t2="sản lượng mỗi kWp: trung bình Global Solar Atlas và PVGIS; giờ nắng: QCVN 02:2022/BXD, trạm Hà Nội" />
      {/* khối 1: ngày và đêm */}
      <g opacity={hien(f, s1, 1e9, 14)}>
        <The x={150} y={220} w={520} h={620} mau={C_MAI} mo={1} />
        <Chu x={410} y={280} c="Một ngày" co={34} dam giua />
        <rect x={190} y={330} width={440} height={60} rx={10} fill="#1E3A6E" />
        <rect x={190 + 440 * 0.25} y={330} width={440 * 0.5} height={60} fill="#FDBA74" />
        <line x1={190 + (440 * kim) / 24} y1={316} x2={190 + (440 * kim) / 24} y2={404} stroke={C_CHU} strokeWidth={5} />
        {[0, 6, 12, 18, 24].map((h) => <Chu key={h} x={190 + (440 * h) / 24} y={432} c={`${h}h`} co={22} giua mau={XAM} />)}
        <Chu x={410} y={500} c="có nắng: mái làm ra điện" co={28} dam giua mau={C_MAI} />
        <Chu x={410} y={560} c="buổi tối: đèn, nấu cơm," co={28} giua mau={C_LUOI} mo={hien(f, s2, 1e9, 14)} />
        <Chu x={410} y={598} c="điều hoà vẫn lấy từ lưới" co={28} dam giua mau={C_LUOI} mo={hien(f, s2, 1e9, 14)} />
        <circle cx={410} cy={720} r={56} fill={ngay ? "#FDBA74" : "#1E3A6E"} />
        <Chu x={410} y={732} c={ngay ? "ngày" : "đêm"} co={30} dam giua mau={ngay ? C_CHU : "#FFFFFF"} />
      </g>
      {/* khối 2: theo vùng */}
      <g opacity={hien(f, s3, 1e9, 14)}>
        <The x={710} y={220} w={520} h={620} mau={C_LUOI} mo={1} />
        <Chu x={970} y={280} c="Cùng 1 kWp, mỗi năm" co={32} dam giua />
        {[{ t: "TP.HCM", v: 1400, x: 830 }, { t: "Hà Nội", v: 1100, x: 1110 }].map((b, i) => {
          const h = (b.v / 1400) * 380 * uV;
          return (
            <g key={i}>
              <rect x={b.x - 70} y={780 - h} width={140} height={h} rx={10} fill={i ? C_LUOI : C_MAI} />
              <Chu x={b.x} y={770 - h} c={`≈ ${so(b.v * uV)}`} co={34} dam giua mau={i ? C_LUOI : C_MAI} mo={uV > 0 ? 1 : 0} />
              <Chu x={b.x} y={818} c={b.t} co={28} giua mau={C_CHU} />
            </g>
          );
        })}
        <Chu x={970} y={330} c="số điện (kWh)" co={24} giua mau={XAM} />
      </g>
      {/* khối 3: mùa ở Hà Nội */}
      <g opacity={hien(f, s4, 1e9, 14)}>
        <The x={1270} y={220} w={520} h={620} mau={C_KHI} mo={1} />
        <Chu x={1530} y={280} c="Giờ nắng ở Hà Nội" co={32} dam giua />
        <Chu x={1530} y={330} c="trung bình nhiều năm, cả tháng" co={24} giua mau={XAM} />
        {[{ t: "tháng 3", v: 45, x: 1400, mau: C_KHI }, { t: "tháng 7", v: 180, x: 1660, mau: C_MAI }].map((b, i) => {
          const h = (b.v / 180) * 380 * uT;
          return (
            <g key={i}>
              <rect x={b.x - 70} y={780 - h} width={140} height={h} rx={10} fill={b.mau} />
              <Chu x={b.x} y={770 - h} c={`≈ ${Math.round(b.v * uT)} giờ`} co={32} dam giua mau={b.mau} mo={uT > 0 ? 1 : 0} />
              <Chu x={b.x} y={818} c={b.t} co={28} giua mau={C_CHU} />
            </g>
          );
        })}
      </g>
      <g opacity={0}>
        <rect x={510} y={866} width={900} height={56} rx={28} fill={C_LUOI} />
        <Chu x={960} y={904} c="tháng ít nắng: điện mái ít hơn, hoá đơn giảm ít hơn" co={28} dam giua mau="#FFFFFF" />
      </g>
    </Khung>
  );
};

export const HinhVe: React.FC<{ c: number; f: number }> = ({ c, f }) => {
  let noi: React.ReactNode = null;
  if (c === 3 || c === 4) noi = <Canh34 c={c} f={f} />;
  else if (c === 7) noi = <Canh7 f={f} />;
  else if (c === 8) noi = <Canh8 f={f} />;
  else if (c === 9) noi = <Canh9 f={f} />;
  else noi = <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><rect width={1920} height={1080} fill={NEN} /></svg>;
  return <>{noi}</>;
};
