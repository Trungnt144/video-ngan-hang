// Khối dựng cơ bản cho video BESS (thẻ D-09b), chép từ bản đã gỡ mã màu cứng xuong_dai/bang_mau_d09b/src/CoBan.tsx.
// Khối dựng cơ bản cho video máy biến áp (thẻ D-09b): bảng màu, vật liệu, hộp có viền, trụ nối hai điểm, mũi tên,
// hạt chạy dọc đường gấp khúc, ánh sáng môi trường. Lấy từ video buồng máy (xuong_dai/buong_may/src/MoHinh.tsx).
import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { getInputProps } from "remotion";
import { V3 } from "./ThongSo";
import { BANG_MAU } from "./BangMau";

// Bảng màu chọn khi kết xuất: --props='{"bang":"M3"}' (mặc định M0 = bảng gốc D-09b). Chín bảng ở BangMau.ts.
export const MA_BANG = (getInputProps() as { bang?: string }).bang ?? "M1"; // video n65 "Lợi ích của điện mặt trời mái nhà": MAU-10 Trời trong = bảng M1
export const MAU = BANG_MAU[MA_BANG] ?? BANG_MAU.M0;

export type VL = { mau: string; kl?: number; nham?: number; mo?: number; sang?: number; mauSang?: string };
// key đổi theo đục/trong: Three.js không dựng lại chương trình vẽ khi chỉ đổi cờ transparent, nên khi kết xuất cả video
// vỏ đã "trong" vẫn vẽ như khối đặc. Đổi key buộc tạo vật liệu mới (90_bai_hoc.md 26/10/2026).
export const VatLieu: React.FC<VL & { hai?: boolean }> = ({ mau, kl = 0, nham = 0.85, mo = 1, sang = 0, mauSang, hai }) => (
  <meshStandardMaterial key={mo < 1 ? "trong" : "duc"} color={mau} metalness={kl} roughness={nham} transparent={mo < 1} opacity={mo} depthWrite={mo >= 1}
    emissive={mauSang ?? mau} emissiveIntensity={sang} side={hai ? THREE.DoubleSide : THREE.FrontSide} />
);

// Lưới hình học dựng sẵn (một lần), vẽ với vật liệu theo trạng thái
export const Luoi: React.FC<{ g: THREE.BufferGeometry; vt?: V3; xoay?: V3; bong?: boolean; vien?: number } & VL & { hai?: boolean }> = ({ g, vt, xoay, bong = true, vien, ...v }) => {
  const e = useMemo(() => (vien !== undefined ? new THREE.EdgesGeometry(g, 25) : null), [g, vien !== undefined]);
  const mo = v.mo ?? 1;
  if (mo <= 0 && !vien) return null;
  return (
    <group position={vt} rotation={xoay}>
      {mo > 0 && (
        <mesh geometry={g} castShadow={bong && mo >= 1} receiveShadow>
          <VatLieu {...v} />
        </mesh>
      )}
      {e && vien! > 0 && (
        <lineSegments geometry={e}>
          <lineBasicMaterial color={MAU.vien} transparent opacity={vien} depthWrite={false} />
        </lineSegments>
      )}
    </group>
  );
};

const VienHop: React.FC<{ kt: V3; mo: number }> = ({ kt, mo }) => {
  const g = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...kt)), [kt[0], kt[1], kt[2]]);
  return (
    <lineSegments geometry={g}>
      <lineBasicMaterial color={MAU.vien} transparent opacity={mo} depthWrite={false} />
    </lineSegments>
  );
};

export const Hop: React.FC<{ kt: V3; vt: V3; xoay?: V3; vien?: boolean } & VL> = ({ kt, vt, xoay, vien, ...v }) =>
  v.mo === 0 && !vien ? null : (
    <group position={vt} rotation={xoay}>
      {(v.mo ?? 1) > 0 && (
        <mesh castShadow={(v.mo ?? 1) >= 1} receiveShadow>
          <boxGeometry args={kt} />
          <VatLieu {...v} />
        </mesh>
      )}
      {vien && <VienHop kt={kt} mo={0.55 + 0.45 * (1 - (v.mo ?? 1))} />}
    </group>
  );

// Trụ nối hai điểm
export const Tru: React.FC<{ a: V3; b: V3; r: number; r2?: number; doan?: number } & VL> = ({ a, b, r, r2, doan = 20, ...v }) => {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va);
    return { pos: va.clone().add(vb).multiplyScalar(0.5), quat: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()), len: d.length() };
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);
  if (v.mo === 0) return null;
  return (
    <mesh position={pos} quaternion={quat} castShadow={(v.mo ?? 1) >= 1}>
      <cylinderGeometry args={[r2 ?? r, r, len, doan]} />
      <VatLieu {...v} />
    </mesh>
  );
};

// Mũi tên: thân trụ + đầu nón
export const MuiTen: React.FC<{ goc: V3; huong: V3; dai: number; mau: string; r?: number; mo?: number }> = ({ goc, huong, dai, mau, r = 0.05, mo = 1 }) => {
  if (dai <= 0.01 || mo <= 0) return null;
  const d = new THREE.Vector3(...huong).normalize();
  const dau = Math.min(dai * 0.4, r * 5);
  const than = goc.map((g, i) => g + d.getComponent(i) * (dai - dau)) as V3;
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
  const vtDau = goc.map((g, i) => g + d.getComponent(i) * (dai - dau / 2)) as V3;
  return (
    <group>
      <Tru a={goc} b={than} r={r} mau={mau} sang={0.35} mo={mo} />
      <mesh position={vtDau} quaternion={quat}>
        <coneGeometry args={[r * 2.6, dau, 24]} />
        <VatLieu mau={mau} sang={0.35} mo={mo} />
      </mesh>
    </group>
  );
};

// Chiều dài tích luỹ của đường gấp khúc và điểm tại quãng đường s
export const doDai = (duong: V3[]) => {
  const d: number[] = [0];
  for (let i = 1; i < duong.length; i++) d.push(d[i - 1] + Math.hypot(duong[i][0] - duong[i - 1][0], duong[i][1] - duong[i - 1][1], duong[i][2] - duong[i - 1][2]));
  return d;
};
export const diemTren = (duong: V3[], doan: number[], s: number): V3 => {
  let i = 1;
  while (i < doan.length - 1 && doan[i] < s) i++;
  const u = (s - doan[i - 1]) / Math.max(1e-9, doan[i] - doan[i - 1]);
  return duong[i - 1].map((v, j) => v + (duong[i][j] - v) * u) as V3;
};

// Hạt chạy dọc một đường gấp khúc. viTri: quãng đường đã đi (đổi dấu thì hạt chạy lùi); khép: đường vòng kín.
export const Hat: React.FC<{ duong: V3[]; viTri: number; khoang: number; r?: number; mo?: number; mau?: string; khep?: boolean; mauTheo?: (s: number) => string }> = ({ duong, viTri, khoang, r = 0.05, mo = 1, mau = MAU.do, khep, mauTheo }) => {
  const doan = useMemo(() => doDai(duong), [duong]);
  if (mo <= 0) return null;
  const L = doan[doan.length - 1];
  const n = Math.floor(L / khoang);
  const hat = [];
  for (let k = 0; k < n; k++) {
    let s = (viTri + k * khoang) % L;
    if (s < 0) s += L;
    const m = mauTheo ? mauTheo(s / L) : mau;
    // đường hở: hạt mờ dần ở hai đầu
    const muc = khep ? 1 : Math.min(1, s / (khoang * 2), (L - s) / (khoang * 2));
    hat.push(
      <mesh key={k} position={diemTren(duong, doan, s)}>
        <sphereGeometry args={[r, 12, 8]} />
        <meshStandardMaterial key={mo * muc < 1 ? "trong" : "duc"} color={m} emissive={m} emissiveIntensity={0.6} transparent={mo * muc < 1} opacity={mo * muc} depthWrite={mo * muc >= 1} />
      </mesh>,
    );
  }
  return <group>{hat}</group>;
};

export const gop = (ds: THREE.BufferGeometry[]) => {
  const g = mergeGeometries(ds.map((x) => (x.index ? x.toNonIndexed() : x)), false)!;
  g.computeVertexNormals();
  return g;
};
export const hopG = (kt: V3, vt: V3, xoay?: V3) => {
  const g = new THREE.BoxGeometry(...kt);
  if (xoay) g.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...xoay)));
  g.translate(...vt);
  return g;
};
export const truG = (a: V3, b: V3, r: number, doan = 16, r2?: number) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const d = vb.clone().sub(va);
  const g = new THREE.CylinderGeometry(r2 ?? r, r, d.length(), doan);
  g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.clone().normalize()));
  const m = va.add(vb).multiplyScalar(0.5);
  g.translate(m.x, m.y, m.z);
  return g;
};
// Lò xo xoắn quanh trục Y: bán kính R, từ y0 tới y1, n vòng, dây bán kính r
export const xoanG = (R: number, y0: number, y1: number, n: number, r: number, doanVong = 40) => {
  const pts: THREE.Vector3[] = [];
  const N = Math.max(8, Math.round(n * doanVong));
  for (let i = 0; i <= N; i++) {
    const u = i / N, a = u * n * Math.PI * 2;
    pts.push(new THREE.Vector3(R * Math.cos(a), y0 + (y1 - y0) * u, -R * Math.sin(a)));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), N, r, 8, false);
};

// Ánh sáng môi trường cho kim loại
export const MoiTruong: React.FC = () => {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.45;
    return () => pm.dispose();
  }, [gl, scene]);
  return null;
};
