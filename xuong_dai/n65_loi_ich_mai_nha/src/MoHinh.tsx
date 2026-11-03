// Mô hình 3D cho video "Nắng chiếu thẳng, nắng tán, nắng hắt" (N29, chép từ xuong_dai/mwp_mwac/): chỉ giữ tấm pin 132 nửa ô (TamPinLon)
// và hàm dựng lưới có bộ nhớ đệm. Cỡ thật 1,303 × 2,384 m. Ô tô #1D3561: đậm đủ để đạt 3:1 trên nền đào nhạt.
import React from "react";
import * as THREE from "three";
import { Hop, Luoi, MAU, gop, hopG } from "./CoBan";

const nho = new Map<string, THREE.BufferGeometry>();
const nhoG = (khoa: string, tao: () => THREE.BufferGeometry) => {
  if (!nho.has(khoa)) nho.set(khoa, tao());
  return nho.get(khoa)!;
};

// ================= tấm pin cận cảnh (video MWp và MWac) =================
// Tấm 132 nửa ô (6 cột × 22 hàng), cỡ thật 1,303 × 2,384 m như các tấm 700–740 W loại ô 210 mm; khung nhôm, khe trắng giữa ô,
// hai thanh dẫn bạc mỗi cột ô. Ô tô #1D3561 (đậm hơn dãy pin #2E4D7A): đo trên khung, #2E4D7A dưới ánh sáng bảng M5 chỉ đạt 3,08:1. Nằm trong mặt XY (mặt trước hướng +z), chân đế nghiêng do Canh3D đặt.
export const TAM = { rong: 1.303, dai: 2.384, cot: 6, hang: 22 };
const oTamG = nhoG("oTam", () => {
  const ds: THREE.BufferGeometry[] = [];
  const w = 0.205, h = 0.1;
  for (let c = 0; c < TAM.cot; c++) for (let r = 0; r < TAM.hang; r++) {
    const x = (c - (TAM.cot - 1) / 2) * 0.212, y = (r - (TAM.hang - 1) / 2) * 0.1065 + (r >= TAM.hang / 2 ? 0.012 : -0.012);
    ds.push(hopG([w, h, 0.004], [x, y, 0.012]));
  }
  return gop(ds);
});
const thanhDanG = nhoG("thanhDan", () => {
  const ds: THREE.BufferGeometry[] = [];
  for (let c = 0; c < TAM.cot; c++) for (const dx of [-0.05, 0, 0.05]) ds.push(hopG([0.004, TAM.dai - 0.1, 0.002], [(c - (TAM.cot - 1) / 2) * 0.212 + dx, 0, 0.0155]));
  return gop(ds);
});
const khungTamG = nhoG("khungTam", () => gop([
  hopG([TAM.rong + 0.04, 0.035, 0.035], [0, TAM.dai / 2, 0.01]), hopG([TAM.rong + 0.04, 0.035, 0.035], [0, -TAM.dai / 2, 0.01]),
  hopG([0.035, TAM.dai, 0.035], [TAM.rong / 2, 0, 0.01]), hopG([0.035, TAM.dai, 0.035], [-TAM.rong / 2, 0, 0.01]),
]));
// Mặt tấm pin nằm trong mặt XY (mặt trước hướng +z), quay quanh trục X một góc -nghieng; chân đế và vị trí do Canh3D đặt.
// nghieng = góc giữa mặt tấm và phương thẳng đứng (tấm đặt nghiêng β so với mặt ngang thì nghieng = π/2 − β).
export const TamPin: React.FC<{ nghieng: number; noi?: number }> = ({ nghieng, noi = 0 }) => (
  <group rotation={[-nghieng, 0, 0]}>
    <Hop kt={[TAM.rong, TAM.dai, 0.012]} vt={[0, 0, 0]} mau={MAU.vo} nham={0.6} />
    <Luoi g={oTamG} mau="#1D3561" kl={0.1} nham={0.45} sang={noi * 0.12} mauSang={"#FFB347"} />
    <Luoi g={thanhDanG} mau="#C9CED6" kl={0.7} nham={0.3} bong={false} />
    <Luoi g={khungTamG} mau={MAU.thep_toi} kl={0.7} nham={0.35} />
    <Hop kt={[0.16, 0.1, 0.03]} vt={[0, TAM.dai / 2 - 0.25, -0.025]} mau={MAU.chu} nham={0.6} />
  </group>
);
