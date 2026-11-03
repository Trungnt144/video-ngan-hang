// Cảnh 3D của video "Lợi ích của điện mặt trời mái nhà" (n65; lai CL-07 và CL-05, KB-05 Bóc cơ chế, MAU-10 Trời trong = bảng M1).
// Chép từ xuong_dai/dien_mat_troi_mai_nha/ (video mnh) rồi đổi màu theo bảng M1 và thêm cảnh "mat" (mái che nắng).
// Bốn cảnh dựng Three.js, mọi trạng thái là hàm của số khung (KichBan.ts):
//  "pho"   khu phố 4 × 3 ngôi nhà mái dốc, tấm pin đầy mái, hạt nắng rơi xuống mái;
//  "xuong" cụm nhà dân, công sở, nhà xưởng mái bằng (chương 6 chỉ quay vào nhà xưởng);
//  "nha"   một ngôi nhà, inverter, tủ công tơ hai chiều, cột điện, hạt điện: dùng ngay trong nhà, lưới bù phần thiếu, phần dư lên lưới;
//  "mat"   một ngôi nhà nhìn gần, tia nắng rơi vào mặt tấm pin, gió lùa qua khe giữa tấm và mái.
// Màu theo vai trò: điện mái cam #C2410C, lưới xanh dương đậm #1D4ED8, tiền tiết kiệm xanh lá #15803D, khí thải xám #475569.
import React from "react";
import * as THREE from "three";
import { Hat, Hop, MAU, Tru } from "./CoBan";
import { TAM, TamPin } from "./MoHinh";
import { V3 } from "./ThongSo";

export const C_MAI = "#C2410C";
export const C_LUOI = "#1D4ED8";
export const C_TIEN = "#15803D";
export const C_KHI = "#475569";
export const C_CANH = "#BE123C";
export const C_CHU = "#1C2A3B";
export const XAM = "#52606F";
// tên cũ giữ lại cho các khối chép từ video mnh
export const C_TIEMNANG = C_LUOI;
export const C_DALAP = C_MAI;
export const C_MUCTIEU = C_MAI;
export const C_DAN = C_MAI;
export const C_XUONG = "#7A5A22";
export const C_CONGSO = C_TIEN;
export const S = new THREE.Vector3(0.3, 0.8, 0.5).normalize(); // hướng từ gốc tới mặt trời (phía nam, cao)

// ================= ngôi nhà mái dốc =================
export const PITCH = (20 * Math.PI) / 180;
const W = 7.4, D = 9.8, YB = 3.2, LS = 5.5;
export const YR = YB + (D / 2) * Math.tan(PITCH);
const MAU_TUONG = "#E8BFA5", MAU_NGOI = "#C4694B", MAU_NGOI_TOI = "#9E4A33", MAU_CUA = "#8A5A44";
const GIA_X = [-2.7, -1.35, 0, 1.35, 2.7];
const GIA_Z = [1.39, 3.84];
export const diemTamMai = (vt: V3, i: number, j: number, du = 0): V3 => {
  const y = 0.14 + du, z = GIA_Z[j];
  return [vt[0] + GIA_X[i], vt[1] + YR + y * Math.cos(PITCH) - z * Math.sin(PITCH), vt[2] + y * Math.sin(PITCH) + z * Math.cos(PITCH)];
};
export const diemTuong = (vt: V3, x: number, y: number): V3 => [vt[0] + x, vt[1] + y, vt[2] + D / 2 + 0.05];

const toi = (mau: string, f: number) => `#${new THREE.Color(mau).multiplyScalar(f).getHexString()}`;
const nho = new Map<string, THREE.BufferGeometry>();
const nhoG = (khoa: string, tao: () => THREE.BufferGeometry) => {
  if (!nho.has(khoa)) nho.set(khoa, tao());
  return nho.get(khoa)!;
};

// Khung ma của một tấm pin: viền và mặt mờ, màu tím = chỗ còn lắp được
const maVienG = () => nhoG("maVien", () => new THREE.EdgesGeometry(new THREE.BoxGeometry(TAM.rong, TAM.dai, 0.03)));
export const TamMa: React.FC<{ mo: number; mau?: string }> = ({ mo, mau = C_TIEMNANG }) =>
  mo <= 0.01 ? null : (
    <group>
      <lineSegments geometry={maVienG()}><lineBasicMaterial color={mau} transparent opacity={Math.min(1, mo * 1.2)} /></lineSegments>
      <mesh position={[0, 0, 0.012]}>
        <planeGeometry args={[TAM.rong - 0.05, TAM.dai - 0.05]} />
        <meshBasicMaterial color={mau} transparent opacity={0.34 * mo} depthWrite={false} />
      </mesh>
    </group>
  );

// Mái xuống dốc: dùng cho cả ngôi nhà và các nhóm tấm; tamThat = số tấm pin thật (0..10, số lẻ là tấm đang hiện), tamMa = độ hiện khung ma của tấm chưa lắp
const gableG = () =>
  nhoG("gable", () => {
    const sh = new THREE.Shape([new THREE.Vector2(-D / 2, 0), new THREE.Vector2(D / 2, 0), new THREE.Vector2(0, YR - YB)]);
    return new THREE.ExtrudeGeometry(sh, { depth: W, bevelEnabled: false });
  });
const MatMai: React.FC<{ nam: boolean }> = ({ nam }) => (
  <group position={[0, YR, 0]} rotation={nam ? [PITCH, 0, 0] : [-PITCH, Math.PI, 0]}>
    <Hop kt={[8.1, 0.18, LS]} vt={[0, -0.06, LS / 2]} mau={MAU_NGOI} nham={0.8} />
    {Array.from({ length: 11 }, (_, k) => <Hop key={k} kt={[8.1, 0.03, 0.07]} vt={[0, 0.045, 0.25 + k * 0.5]} mau={MAU_NGOI_TOI} nham={0.85} />)}
  </group>
);
const cl = (v: number) => Math.min(1, Math.max(0, v));

export const NhaMai: React.FC<{ vt: V3; sang?: number; tamThat?: number; tamMa?: number; chiTiet?: boolean }> = ({ vt, sang = 0, tamThat = 10, tamMa = 0, chiTiet = true }) => (
  <group position={vt}>
    <Hop kt={[W + 1.4, 0.2, D + 1.4]} vt={[0, 0.1, 0]} mau="#CFD6CC" nham={0.9} />
    <Hop kt={[W, YB - 0.2, D]} vt={[0, 0.2 + (YB - 0.2) / 2, 0]} mau={MAU_TUONG} nham={0.85} />
    <mesh geometry={gableG()} position={[-W / 2, YB, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
      <meshStandardMaterial color={MAU_TUONG} roughness={0.85} />
    </mesh>
    <MatMai nam />
    <MatMai nam={false} />
    <Hop kt={[W + 0.9, 0.16, 0.34]} vt={[0, YR + 0.06, 0]} mau={MAU_NGOI_TOI} nham={0.8} />
    <Hop kt={[1.1, 2.2, 0.12]} vt={[0, 1.3, D / 2 + 0.04]} mau={MAU_CUA} nham={0.7} />
    {[-2.4, 2.4].map((x) => (
      <group key={x}>
        <Hop kt={[1.5, 1.3, 0.1]} vt={[x, 1.6, D / 2 + 0.03]} mau="#FFFFFF" nham={0.6} />
        <Hop kt={[1.3, 1.1, 0.06]} vt={[x, 1.6, D / 2 + 0.09]} mau="#B9C3E8" kl={0.3} nham={0.15} />
      </group>
    ))}
    {chiTiet && (
      <>
        <Hop kt={[0.55, 0.8, 0.22]} vt={[-3.0, 0.7, D / 2 + 0.16]} mau="#CFC6D4" kl={0.3} nham={0.5} />
        <Hop kt={[0.34, 0.16, 0.02]} vt={[-3.0, 0.9, D / 2 + 0.28]} mau={C_MUCTIEU} nham={0.5} sang={0.6 * sang} mauSang={C_MUCTIEU} />
      </>
    )}
    <group position={[0, YR, 0]} rotation={[PITCH, 0, 0]}>
      {GIA_Z.map((z) => [-0.7, 0.7].map((d) => <Hop key={`${z}${d}`} kt={[6.9, 0.05, 0.07]} vt={[0, 0.045, z + d]} mau="#8C96A1" kl={0.6} nham={0.4} />))}
      {GIA_Z.map((z, j) =>
        GIA_X.map((x, i) => {
          const k = j * 5 + i;
          const that = cl(tamThat - k);
          const ma = tamMa * (1 - that);
          if (that <= 0.001 && ma <= 0.01) return null;
          return (
            <group key={`${i}${j}`} position={[x, 0.1, z]} rotation={[-Math.PI / 2, 0, 0]}>
              {that > 0.001 && <group scale={that >= 1 ? 1 : [that, that, that]}><TamPin nghieng={0} noi={sang} /></group>}
              {ma > 0.01 && <TamMa mo={ma} />}
            </group>
          );
        }),
      )}
    </group>
  </group>
);

// ================= mặt đất và đường phố =================
export const Dat: React.FC<{ rong: number; sau: number; vt?: V3; duong?: V3[] }> = ({ rong, sau, vt = [0, 0, 0], duong = [] }) => (
  <group position={vt}>
    <Hop kt={[rong, 0.5, sau]} vt={[0, -0.25, 0]} mau="#AFC69A" nham={0.95} />
    <Hop kt={[rong + 0.02, 0.18, sau + 0.02]} vt={[0, -0.41, 0]} mau="#A9B89C" nham={0.95} />
    {duong.map((d, k) => <Hop key={k} kt={[d[0] * 2 || 3, 0.05, d[2] * 2 || 3]} vt={[0, 0.03, 0]} mau="#CCD3D6" nham={0.9} />)}
  </group>
);
export const Cay: React.FC<{ vt: V3; r?: number }> = ({ vt, r = 0.8 }) => (
  <group position={vt}>
    <mesh position={[0, r * 0.7, 0]} castShadow receiveShadow><sphereGeometry args={[r, 14, 10]} /><meshStandardMaterial color="#8FB08A" roughness={0.9} /></mesh>
    <mesh position={[r * 0.6, r * 0.45, r * 0.3]} castShadow><sphereGeometry args={[r * 0.6, 12, 8]} /><meshStandardMaterial color="#7BA076" roughness={0.9} /></mesh>
  </group>
);

// ================= khu phố 4 × 3 ngôi nhà =================
export const PHO_X = [-18.75, -6.25, 6.25, 18.75];
export const PHO_Z = [-14, 1, 16];
export const VT_PHO: V3[] = PHO_Z.flatMap((z) => PHO_X.map((x) => [x, 0, z] as V3)); // 12 nhà: hàng sau (z âm) trước, hàng gần máy quay cuối
export const KhuPho: React.FC<{ that: number[]; ma: number; sang: number; tia: number; g: number }> = ({ that, ma, sang, tia, g }) => (
  <group>
    <Dat rong={74} sau={62} vt={[0, 0, 2]} />
    {/* hai đường ngang giữa các hàng nhà và một đường dọc */}
    {[-6.5, 8.5].map((z) => <Hop key={z} kt={[74, 0.05, 3.6]} vt={[0, 0.03, z]} mau="#CCD3D6" nham={0.95} />)}
    {[0].map((x) => <Hop key={x} kt={[3.4, 0.05, 62]} vt={[x, 0.035, 2]} mau="#CCD3D6" nham={0.95} />)}
    {VT_PHO.map((vt, i) => <NhaMai key={i} vt={vt} sang={sang} tamThat={that[i] ?? 0} tamMa={ma} chiTiet={false} />)}
    {[[-30, -12], [30, -14], [-30, 18], [30, 20], [0, -24], [-12, 25], [12, 25]].map(([x, z], k) => <Cay key={k} vt={[x, 0, z]} r={1.1 + (k % 3) * 0.2} />)}
    {tia > 0.01 && VT_PHO.map((vt, i) => <Hat key={i} duong={[[vt[0] + S.x * 14, S.y * 14 + 5, vt[2] + S.z * 14], [vt[0], 5.4, vt[2] + 2]]} viTri={g * 0.1 + i * 0.37} khoang={2.6} r={0.09} mau={C_DALAP} mo={tia * cl((that[i] ?? 0) / 4)} />)}
  </group>
);

// ================= công sở ba tầng và nhà xưởng mái bằng =================
const dayTam = (vt: V3, x0: number, bx: number, nx: number, z0: number, bz: number, nz: number, beta: number, k0: number, that: number, ma: number, sang: number) => {
  const tam: React.ReactNode[] = [];
  let k = k0;
  for (let j = 0; j < nz; j++) {
    for (let i = 0; i < nx; i++, k++) {
      const t = cl(that - k);
      const m = ma * (1 - t);
      if (t <= 0.001 && m <= 0.01) continue;
      tam.push(
        <group key={`${i}_${j}`} position={[x0 + i * bx, 0.12, z0 + j * bz]} rotation={[beta, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            {t > 0.001 && <group scale={t >= 1 ? 1 : [t, t, t]}><TamPin nghieng={0} noi={sang} /></group>}
            {m > 0.01 && <TamMa mo={m} />}
          </group>
        </group>,
      );
    }
  }
  return <group position={vt}>{tam}</group>;
};
const BETA = (10 * Math.PI) / 180;

export const NhaXuong: React.FC<{ vt: V3; that: number; ma: number; sang: number }> = ({ vt, that, ma, sang }) => {
  const R = 34, Dz = 13, H = 8.5;
  return (
    <group position={vt}>
      <Hop kt={[R + 1.4, 0.2, Dz + 1.4]} vt={[0, 0.1, 0]} mau="#CFD6CC" nham={0.9} />
      <Hop kt={[R, H - 0.2, Dz]} vt={[0, 0.2 + (H - 0.2) / 2, 0]} mau="#D2B3A1" nham={0.85} />
      <Hop kt={[R + 0.5, 0.35, Dz + 0.5]} vt={[0, H + 0.05, 0]} mau="#9A8076" nham={0.8} />
      {/* ba cửa cuốn lớn và dải cửa sổ cao ở mặt tiền hướng nam */}
      {[-10, 0, 10].map((x) => (
        <group key={x}>
          <Hop kt={[5, 4.6, 0.14]} vt={[x, 2.5, Dz / 2 + 0.05]} mau="#8A5A44" nham={0.7} />
          {[0, 1, 2, 3, 4, 5].map((y) => <Hop key={y} kt={[4.8, 0.05, 0.05]} vt={[x, 0.6 + y * 0.75, Dz / 2 + 0.14]} mau="#6E4634" nham={0.7} />)}
        </group>
      ))}
      {Array.from({ length: 12 }, (_, i) => <Hop key={i} kt={[1.8, 0.9, 0.08]} vt={[-15.4 + i * 2.8, 6.6, Dz / 2 + 0.04]} mau="#B9C3E8" kl={0.3} nham={0.15} />)}
      <Hop kt={[R + 0.4, 0.14, 0.4]} vt={[0, 5.2, Dz / 2 + 0.12]} mau="#9C8379" nham={0.8} />
      {dayTam([0, H + 0.2, 0], -14.3, 1.36, 22, -3.9, 3.9, 3, BETA, 0, that, ma, sang)}
    </group>
  );
};

export const NhaCongSo: React.FC<{ vt: V3; that: number; ma: number; sang: number }> = ({ vt, that, ma, sang }) => {
  const R = 15, Dz = 10, H = 12;
  return (
    <group position={vt}>
      <Hop kt={[R + 1.4, 0.2, Dz + 1.4]} vt={[0, 0.1, 0]} mau="#CFD6CC" nham={0.9} />
      <Hop kt={[R, H - 0.2, Dz]} vt={[0, 0.2 + (H - 0.2) / 2, 0]} mau="#D8C2B5" nham={0.85} />
      <Hop kt={[R + 0.5, 0.35, Dz + 0.5]} vt={[0, H + 0.05, 0]} mau="#9A8076" nham={0.8} />
      {[0, 1, 2].flatMap((t) => [0, 1, 2, 3, 4, 5].map((c) => <Hop key={`${t}${c}`} kt={[1.6, 1.7, 0.1]} vt={[-6.25 + c * 2.5, 3.6 + t * 3.3, Dz / 2 + 0.04]} mau="#B9C3E8" kl={0.3} nham={0.15} />))}
      <Hop kt={[3.2, 2.8, 0.2]} vt={[0, 1.6, Dz / 2 + 0.08]} mau="#8A5A44" nham={0.7} />
      <Hop kt={[R + 0.3, 0.16, 0.5]} vt={[0, 2.35, Dz / 2 + 0.25]} mau="#9C8379" nham={0.8} />
      {dayTam([0, H + 0.2, 0], -9.5, 1.36, 8, -1.7, 3.9, 2, BETA, 0, that, ma, sang)}
    </group>
  );
};

export const VT_DAN: V3[] = [[-36, 0, -2], [-23.5, 0, -2], [-36, 0, 13], [-23.5, 0, 13]];
export const VT_CONGSO: V3 = [-3, 0, 2];
export const VT_XUONG: V3 = [26, 0, 4];
export const NhomMai: React.FC<{ dan: number; cs: number; xuong: number; ma: number; sang: number }> = ({ dan, cs, xuong, ma, sang }) => (
  <group>
    <Dat rong={90} sau={50} vt={[-2, 0, 6]} />
    {VT_DAN.map((vt, i) => <NhaMai key={i} vt={vt} sang={sang} tamThat={dan * 10} tamMa={ma} chiTiet={false} />)}
    <NhaCongSo vt={VT_CONGSO} that={cs * 16} ma={ma} sang={sang} />
    <NhaXuong vt={VT_XUONG} that={xuong * 66} ma={ma} sang={sang} />
    {[[-44, 22], [-12, 22], [8, 20], [46, 22], [-44, -16], [-30, -16]].map(([x, z], k) => <Cay key={k} vt={[x, 0, z]} r={1.2 + (k % 3) * 0.2} />)}
  </group>
);

// ================= nhà, inverter, công tơ hai chiều, cột điện =================
export const VT_NHA: V3 = [-6, 0, 0];
export const X_CONGTO = 4.6, Z_CONGTO = D / 2 + 1.6;
export const X_COT = 8, Z_COT = 3.5;
const Mui: React.FC<{ vt: V3; xoay: number; mau: string; s?: number }> = ({ vt, xoay, mau, s = 1 }) => (
  <group position={vt} rotation={[0, 0, xoay]} scale={[s, s, s]}>
    <Hop kt={[0.26, 0.07, 0.04]} vt={[-0.04, 0, 0]} mau={mau} nham={0.5} />
    <mesh position={[0.12, 0, 0]} rotation={[0, 0, -Math.PI / 2]}><coneGeometry args={[0.1, 0.16, 12]} /><meshBasicMaterial color={mau} /></mesh>
  </group>
);
// Tủ công tơ hai chiều: hộp có cửa kính, mặt đồng hồ, hai ô số (nhận / giao) và hai mũi tên ngược chiều
export const CongTo: React.FC<{ vt: V3; sang: number }> = ({ vt, sang }) => (
  <group position={vt}>
    <Hop kt={[0.16, 1.1, 0.16]} vt={[-0.5, 0.55, 0]} mau="#8C96A1" kl={0.6} nham={0.4} />
    <Hop kt={[0.16, 1.1, 0.16]} vt={[0.5, 0.55, 0]} mau="#8C96A1" kl={0.6} nham={0.4} />
    <Hop kt={[1.3, 1.5, 0.5]} vt={[0, 1.55, 0]} mau="#BFC6CE" kl={0.4} nham={0.5} />
    <Hop kt={[1.08, 1.0, 0.06]} vt={[0, 1.6, 0.27]} mau="#2C3A48" kl={0.2} nham={0.2} />
    <Hop kt={[0.92, 0.3, 0.02]} vt={[0, 1.82, 0.31]} mau="#E9F3E0" nham={0.3} sang={0.5 + 0.3 * sang} mauSang="#E9F3E0" />
    <Hop kt={[0.92, 0.3, 0.02]} vt={[0, 1.42, 0.31]} mau="#E9F3E0" nham={0.3} sang={0.5 + 0.3 * sang} mauSang="#E9F3E0" />
    <Mui vt={[0.62, 1.82, 0.33]} xoay={Math.PI} mau={C_LUOI} />
    <Mui vt={[-0.62, 1.42, 0.33]} xoay={0} mau={C_DALAP} />
  </group>
);

export const CotDien: React.FC<{ vt: V3; may?: boolean }> = ({ vt, may = true }) => (
  <group position={vt}>
    <mesh position={[0, 4.3, 0]} castShadow><cylinderGeometry args={[0.13, 0.19, 8.6, 12]} /><meshStandardMaterial color="#7A6E66" roughness={0.8} /></mesh>
    <Hop kt={[3.2, 0.16, 0.2]} vt={[0, 8.2, 0]} mau="#6F655F" nham={0.7} />
    {[-1.3, 0, 1.3].map((x) => <Hop key={x} kt={[0.12, 0.3, 0.12]} vt={[x, 8.45, 0]} mau="#D9D2CC" nham={0.4} />)}
    {may && (
      <group position={[0, 6.2, 0.6]}>
        <mesh castShadow><cylinderGeometry args={[0.55, 0.55, 1.3, 20]} /><meshStandardMaterial color="#9AA89F" roughness={0.5} metalness={0.3} /></mesh>
        <Hop kt={[0.5, 0.25, 0.2]} vt={[0, 0.78, 0]} mau="#6F655F" nham={0.6} />
      </group>
    )}
  </group>
);

export type TTNha = { dong: number; chia: number; sang: number; mo: number; vao?: number };
export const NhaDien: React.FC<{ t: TTNha; g: number }> = ({ t, g }) => {
  const vt = VT_NHA;
  const noc = diemTamMai(vt, 2, 0, 0.12);
  const mep: V3 = [vt[0] - 3.0, vt[1] + YB + 0.3, vt[2] + D / 2 + 0.3];
  const inv: V3 = [vt[0] - 3.0, 1.15, vt[2] + D / 2 + 0.32];
  const congTo: V3 = [vt[0] + X_CONGTO, 2.3, Z_CONGTO + 0.3];
  const cot1: V3 = [X_COT, 8.2, Z_COT];
  const dayVao: V3[] = [noc, [noc[0], noc[1] - 0.2, mep[2]], mep, [mep[0], 1.7, mep[2]], inv];
  const dungNgay: V3[] = [inv, [inv[0] + 0.4, 0.45, inv[2] + 0.3], [vt[0] - 0.6, 0.45, inv[2] + 0.35], [vt[0] - 0.6, 1.0, vt[2] + D / 2 + 0.2]];
  const daDu: V3[] = [inv, [inv[0] + 0.3, 0.3, inv[2] + 0.8], [vt[0] + X_CONGTO - 0.9, 0.3, Z_CONGTO], [vt[0] + X_CONGTO, 0.3, Z_CONGTO], [vt[0] + X_CONGTO, 2.3, Z_CONGTO], congTo, [congTo[0] + 1.4, 2.3, congTo[2]], [X_COT - 0.5, 4.2, Z_COT + 0.6], [X_COT, 6.9, Z_COT + 0.6], [X_COT + 14, 8.1, Z_COT]];
  const chay = g * 0.12;
  return (
    <group>
      <Dat rong={56} sau={34} vt={[8, 0, 3]} />
      <Hop kt={[40, 0.05, 3.2]} vt={[4, 0.03, 10]} mau="#CCD3D6" nham={0.95} />
      <NhaMai vt={vt} sang={t.sang} tamThat={10} tamMa={0} />
      <CongTo vt={[vt[0] + X_CONGTO, 0, Z_CONGTO]} sang={t.sang} />
      <CotDien vt={[X_COT, 0, Z_COT]} />
      <Tru a={[X_COT - 1.3, 8.45, Z_COT]} b={[X_COT + 22, 8.5, Z_COT]} r={0.03} mau="#4A4048" />
      <Tru a={[X_COT, 8.45, Z_COT]} b={[X_COT + 22, 8.5, Z_COT]} r={0.03} mau="#4A4048" />
      <Tru a={[X_COT + 1.3, 8.45, Z_COT]} b={[X_COT + 22, 8.5, Z_COT]} r={0.03} mau="#4A4048" />
      {/* hạt điện: từ mái xuống inverter, rồi chia hai đường */}
      <Hat duong={dayVao} viTri={chay} khoang={1.1} r={0.1} mau={C_DALAP} mo={t.dong} />
      <Hat duong={dungNgay} viTri={chay * 0.8} khoang={0.8} r={0.1} mau={C_DALAP} mo={t.dong * (1 - 0.55 * t.chia)} />
      <Hat duong={daDu} viTri={chay * 1.1} khoang={1.3} r={0.11} mau={C_LUOI} mo={t.dong * t.chia} />
      {/* lưới bù phần thiếu: hạt xanh chạy ngược từ cột điện qua công tơ vào nhà */}
      <Hat duong={[...daDu].reverse().concat([[vt[0] + 1.2, 0.3, Z_CONGTO], [vt[0] + 1.2, 1.0, vt[2] + D / 2 + 0.2]])} viTri={chay * 0.9} khoang={1.3} r={0.11} mau={C_LUOI} mo={t.vao ?? 0} />
    </group>
  );
};

// ================= mái che nắng: một nhà nhìn gần =================
export const VT_MAT: V3 = [0, 0, 0];
export type TTMat = { tia: number; gio: number; bong: number };
export const NhaMat: React.FC<{ t: TTMat; g: number }> = ({ t, g }) => {
  const vt = VT_MAT;
  const chay = g * 0.16;
  return (
    <group>
      <Dat rong={60} sau={44} vt={[0, 0, 4]} />
      <NhaMai vt={vt} sang={0.25} tamThat={10} tamMa={0} />
      <Cay vt={[-9, 0, 9]} r={1.3} />
      <Cay vt={[10, 0, -6]} r={1.5} />
      {/* tia nắng: hạt cam rơi từ phía mặt trời xuống mặt từng tấm pin */}
      {[0, 1, 2, 3, 4].flatMap((i) => [0, 1].map((j) => {
        const p = diemTamMai(vt, i, j, 0.12);
        const a: V3 = [p[0] + S.x * 9, p[1] + S.y * 9, p[2] + S.z * 9];
        return (
          <group key={`${i}${j}`}>
            {t.tia > 0.01 && <Tru a={a} b={p} r={0.035} mau="#FDBA74" mo={0.55 * t.tia} />}
            <Hat duong={[a, p]} viTri={chay + (i * 2 + j) * 0.53} khoang={3.2} r={0.07} mau={C_MAI} mo={t.tia} />
          </group>
        );
      }))}
      {/* gió lùa: hạt xanh nhạt chạy dọc khe giữa tấm pin và mái, từ mép dưới lên nóc */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = diemTamMai(vt, i, 1, -0.02), b = diemTamMai(vt, i, 0, -0.02);
        const duoi: V3 = [a[0], a[1] - 1.3 * Math.sin(PITCH), a[2] + 1.3 * Math.cos(PITCH)];
        const tren: V3 = [b[0], b[1] + 1.3 * Math.sin(PITCH), b[2] - 1.3 * Math.cos(PITCH)];
        return <Hat key={i} duong={[duoi, a, b, tren]} viTri={chay * 0.7 + i * 0.4} khoang={0.9} r={0.06} mau="#3B82F6" mo={t.gio} />;
      })}
    </group>
  );
};

// ================= trạng thái tổng =================
export type TT = {
  g: number;
  canh: "pho" | "xuong" | "nha" | "mat";
  mat: TTMat;
  that: number[]; // 12 nhà: số tấm pin thật 0..10
  ma: number; // độ hiện khung ma
  sang: number;
  tia: number;
  dan: number; cs: number; xuong: number; // phần tấm thật của từng nhóm 0..1
  nha: TTNha;
};
export const TT0: TT = { g: 0, canh: "pho", that: Array(12).fill(0), ma: 0, sang: 0, tia: 0, dan: 0, cs: 0, xuong: 0, nha: { dong: 0, chia: 0, sang: 0, mo: 1, vao: 0 }, mat: { tia: 0, gio: 0, bong: 0 } };

export const CanhDong: React.FC<{ t: TT }> = ({ t }) => {
  if (t.canh === "xuong") return <NhomMai dan={t.dan} cs={t.cs} xuong={t.xuong} ma={t.ma} sang={t.sang} />;
  if (t.canh === "nha") return <NhaDien t={t.nha} g={t.g} />;
  if (t.canh === "mat") return <NhaMat t={t.mat} g={t.g} />;
  return <KhuPho that={t.that} ma={t.ma} sang={t.sang} tia={t.tia} g={t.g} />;
};
