// Video "Lợi ích của điện mặt trời mái nhà" (n65; lai CL-07 · CL-05, KB-05 Bóc cơ chế, MAU-10 Trời trong = bảng M1). Khung chép từ xuong_dai/dien_mat_troi_mai_nha/.
// Chương 1, 2, 5, 6, 10, 11 dựng Three.js; chương 3, 4, 7, 8, 9 là SVG trên cùng nền xanh nhạt.
// Phụ đề chạy chữ theo từng từ, giọng VieNeu Hải Đăng (kéo về 5,06 âm tiết/giây), nhạc NH15 "No Turning Back".
import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MAU, MoiTruong } from "./CoBan";
import { C_MUCTIEU, CanhDong, S } from "./Canh3D";
import { HinhVe } from "./HinhVe";
import { PhuDeChayChu } from "./PhuDeChayChu";
import { CHUONG, Khung, TONG, khung } from "./KichBan";
import { V3 } from "./ThongSo";

const FONT = "Helvetica Neue, Arial, sans-serif";
// Nhạc nền NH15 "No Turning Back" (Alejandro Magaña, Mixkit Stock Music Free License), 225,9 giây, 23,2 giây đầu rất nhỏ: bỏ đoạn đó.
// Phần dùng được 202,7 giây ngắn hơn video, nên nối lặp: bản thứ hai (cũng bỏ 23,2 giây đầu) vào mờ dần 3 giây trước khi bản đầu hết
// (08_giong_am_thanh_phu_de.md mục 7, bước 3). Âm lượng theo sổ nhạc (0,068); pha máy chỉnh độ to cả bài về −14 LUFS.
export const NHAC = "nhac/mixkit-no-turning-back-118.mp3";
const AM = 0.068;
const NHAC_BO = Math.round(23.2 * 30);
const NHAC_KHUNG = Math.round(225.9 * 30) - NHAC_BO;
const CHEO = 90; // 3 giây mờ chéo
const NOI = NHAC_KHUNG - CHEO; // khung bắt đầu bản thứ hai

const MayQuay: React.FC<{ k: Khung }> = ({ k }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camera as THREE.PerspectiveCamera;
    c.fov = k.fov;
    c.near = 0.5;
    c.far = 1500;
    c.position.set(...k.cp);
    c.lookAt(...k.ct);
    c.updateProjectionMatrix();
  }, [camera, k]);
  return null;
};

const TheGioi: React.FC<{ k: Khung }> = ({ k }) => {
  const anh = useMemo(() => new THREE.Object3D(), []);
  anh.position.set(0, 0, 0);
  anh.updateMatrixWorld();
  const vung = 26;
  return (
    <>
      <MayQuay k={k} />
      <MoiTruong />
      <color attach="background" args={[MAU.nen]} />
      <hemisphereLight args={[MAU.troi, MAU.dat, 1.1]} />
      <directionalLight position={[S.x * 40, S.y * 40, S.z * 40]} target={anh} intensity={1.6} castShadow
        shadow-mapSize={[2048, 2048]} shadow-camera-left={-vung} shadow-camera-right={vung} shadow-camera-top={vung} shadow-camera-bottom={-vung}
        shadow-camera-near={1} shadow-camera-far={110} shadow-bias={-0.0015} shadow-normalBias={0.05} />
      <primitive object={anh} />
      <CanhDong t={k.t} />
    </>
  );
};

const chieu = (k: Khung, p: V3) => {
  const c = new THREE.PerspectiveCamera(k.fov, 1920 / 1080, 0.5, 1500);
  c.position.set(...k.cp);
  c.lookAt(...k.ct);
  c.updateMatrixWorld();
  c.updateProjectionMatrix();
  const v = new THREE.Vector3(...p).project(c);
  return [((v.x + 1) / 2) * 1920, ((1 - v.y) / 2) * 1080, v.z];
};

const Nhan: React.FC<{ k: Khung }> = ({ k }) => (
  <>
    {k.nhan.filter((n) => n.mo > 0).map((n, i) => {
      const [x, y, z] = chieu(k, n.p);
      if (z > 1) return null;
      const trai = n.ben === "trai";
      const mau = n.mau ?? MAU.do;
      return (
        <div key={i} style={{ position: "absolute", left: x, top: y, opacity: n.mo, display: "flex", alignItems: "center", flexDirection: trai ? "row-reverse" : "row", transform: trai ? "translate(-100%, -50%)" : "translateY(-50%)" }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: mau, border: `3px solid ${MAU.the}`, margin: trai ? "0 -7px 0 0" : "0 0 0 -7px" }} />
          <div style={{ width: 70 * Math.min(1, n.mo * 1.4), height: 3, background: mau }} />
          <div style={{ padding: "2px 14px 4px", textAlign: trai ? "right" : "left", background: MAU.theMo(0.9), borderRadius: 10 }}>
            <div style={{ fontSize: 42, fontWeight: 800, color: mau, whiteSpace: "nowrap" }}>{n.chu}</div>
            {n.nho && <div style={{ fontSize: 26, fontWeight: 500, color: MAU.chu_the, whiteSpace: "nowrap" }}>{n.nho}</div>}
          </div>
        </div>
      );
    })}
  </>
);

const Chips: React.FC<{ k: Khung }> = ({ k }) =>
  k.chip.length === 0 ? null : (
    <div style={{ position: "absolute", left: 0, right: 0, top: k.chipY ?? 54, display: "flex", justifyContent: "center", gap: 22 }}>
      {k.chip.map((c, i) => (
        <div key={i} style={{ opacity: c.mo, transform: `translateY(${(1 - c.mo) * -14}px)`, width: c.chu.length > 4 ? "auto" : 200, padding: c.chu.length > 4 ? "0 44px" : 0, height: 84, borderRadius: 42, background: c.mau, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: c.chu.length > 4 ? 40 : 52, fontWeight: 800, letterSpacing: c.chu.length > 4 ? 0 : 2, whiteSpace: "nowrap", boxShadow: "0 6px 20px rgba(60,30,60,0.18)" }}>
          {c.chu}
        </div>
      ))}
    </div>
  );

const So: React.FC<{ k: Khung }> = ({ k }) => {
  if (!k.so || k.so.mo <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: k.so.y, transform: "translateY(-50%)", textAlign: "center", opacity: k.so.mo }}>
      <div style={{ display: "inline-block", padding: "10px 46px 18px", borderRadius: 26, background: MAU.theMo(0.92) }}>
        <div style={{ fontSize: k.so.co, fontWeight: 800, color: k.so.mau ?? MAU.chu, letterSpacing: -2, lineHeight: 1.05 }}>{k.so.chu}</div>
        {k.so.phu && <div style={{ fontSize: Math.max(34, k.so.co * 0.24), fontWeight: 600, color: MAU.chu_the, marginTop: 6 }}>{k.so.phu}</div>}
      </div>
    </div>
  );
};

const TieuDe: React.FC<{ k: Khung }> = ({ k }) => {
  if (k.c === 1) return null;
  const ch = CHUONG[k.c - 1];
  const mo = Math.min(1, k.f / 10) * Math.min(1, (100 - k.f) / 12);
  if (mo <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 70, opacity: mo, display: "flex", alignItems: "center", gap: 14, fontSize: 30, fontWeight: 600, color: MAU.chu_the, background: MAU.theMo(0.9), padding: "8px 20px 8px 10px", borderRadius: 30 }}>
      <span style={{ width: 40, height: 40, borderRadius: "50%", background: C_MUCTIEU, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{ch.id}</span>
      {ch.ten}
    </div>
  );
};

const MatTroi: React.FC<{ mo: number; g: number; x?: number }> = ({ mo, g, x = 1640 }) =>
  mo <= 0 ? null : (
    <svg width={260} height={260} style={{ position: "absolute", left: x, top: 40, opacity: mo }} viewBox="-130 -130 260 260">
      <g transform={`rotate(${g * 0.35})`}>
        {Array.from({ length: 14 }, (_, i) => (
          <line key={i} x1={0} y1={-70 - (i % 2) * 4} x2={0} y2={-110 - (i % 2) * 14} stroke="#D9560A" strokeWidth={9} strokeLinecap="round" transform={`rotate(${(360 / 14) * i})`} />
        ))}
      </g>
      <circle r={56} fill="#FFA06B" stroke="#D9560A" strokeWidth={8} />
      <circle r={36} fill="#FFD0B4" opacity={0.8} />
    </svg>
  );

const The: React.FC<{ k: Khung }> = ({ k }) => {
  if (!k.the || k.the.mo <= 0) return null;
  return (
    <div style={{ position: "absolute", ...(k.the.x !== undefined ? { left: k.the.x } : k.the.trai ? { left: 60 } : { right: 70 }), top: k.the.y ?? 220, width: k.the.w ?? 760, padding: "26px 32px 14px", borderRadius: 18, background: MAU.theMo(0.95), boxShadow: "0 8px 30px rgba(60,30,60,0.18)", opacity: k.the.mo, color: MAU.chu_the }}>
      <div style={{ fontSize: 34, fontWeight: 800, marginBottom: 16 }}>{k.the.tieu}</div>
      {k.the.dong.map((d, i) => (
        <div key={i} style={{ marginBottom: 14, opacity: d.mo ?? 1 }}>
          <div style={{ fontSize: 32, lineHeight: 1.25, fontWeight: 700, color: d.mau ?? MAU.chu_the }}>{d.chu}</div>
          {d.gt && <div style={{ fontSize: 25, color: MAU.chu_the, opacity: 0.75 }}>{d.gt}</div>}
        </div>
      ))}
    </div>
  );
};

export const Video: React.FC = () => {
  const g = useCurrentFrame();
  const k = khung(g);
  const ve = k.studio === "ve";
  const ch = CHUONG[k.c - 1];
  return (
    <AbsoluteFill style={{ background: MAU.nen, fontFamily: FONT }}>
      {ve ? (
        <HinhVe c={k.c} f={k.f} />
      ) : (
        <>
          <ThreeCanvas width={1920} height={1080} shadows gl={{ toneMapping: THREE.NoToneMapping, antialias: true }} camera={{ fov: 42 }}>
            <TheGioi k={k} />
          </ThreeCanvas>
          <AbsoluteFill>
            <Nhan k={k} />
            <The k={k} />
            <So k={k} />
            <Chips k={k} />
            <MatTroi mo={k.matTroi} g={k.g} x={k.matTroiX} />
            <TieuDe k={k} />
          </AbsoluteFill>
        </>
      )}
      {k.man > 0 && <AbsoluteFill style={{ background: k.manMau, opacity: Math.min(1, k.man) }} />}
      <AbsoluteFill>
        <PhuDeChayChu cau={ch.cau} dai={ch.dai} f={k.f} mau={{ chu: MAU.chu_the, nhan: "#B91C45", nen: MAU.theMo(0.92) }} />
      </AbsoluteFill>
      {CHUONG.map((x) => (
        <Sequence key={x.id} from={x.bat_dau + x.cau[0].f_tieng - x.cau[0].tu}>
          <Audio src={staticFile(`giong/c${x.id}.wav`)} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={NHAC_KHUNG}>
        <Audio src={staticFile(NHAC)} trimBefore={NHAC_BO} volume={(f) => AM * Math.min(1, f / 30) * Math.max(0, Math.min(1, (NHAC_KHUNG - f) / CHEO)) * Math.max(0, Math.min(1, (TONG - f) / 60))} />
      </Sequence>
      {TONG > NOI && (
        <Sequence from={NOI}>
          <Audio src={staticFile(NHAC)} trimBefore={NHAC_BO} volume={(f) => AM * Math.min(1, f / CHEO) * Math.max(0, Math.min(1, (TONG - NOI - f) / 60))} />
        </Sequence>
      )}
    </AbsoluteFill>
  );
};
