// Phụ đề chạy chữ theo từng từ (module 14 mục 19). Hiện cả câu như phụ đề theo câu; từ chưa đọc mờ, từ đang đọc
// tô màu nhấn, từ đã đọc đậm lại. Không đổi độ đậm nét chữ để dòng chữ không xô lệch khi tô. Mốc từ lấy từ trường
// "tu_moc" trong src/thoi_gian.json (tao_thoi_gian.py sinh từ public/giong_goc/moc_tu.json). Câu không có "tu_moc"
// thì hiện cả câu như cũ. Chép nguyên file này sang video D-09b mới.
import React from "react";

export type TuMoc = { chu: string; f: number; het: number };
export type CauMoc = { f: number; chu: string; tu_moc?: TuMoc[] };
export type MauPhuDe = { chu: string; nhan: string; nen: string };

const MO_CHUA_DOC = 0.68; // n65: 0,38 cho chữ xám 2,3:1, dưới ngưỡng 4,5:1 (soát ảnh 01/11/2026) // độ đậm của từ chưa đọc
const CHUYEN = 3; // số khung chuyển từ mờ sang đậm, tránh nháy

export const PhuDeChayChu: React.FC<{ cau: CauMoc[]; dai: number; f: number; mau: MauPhuDe }> = ({ cau, dai, f, mau }) => {
  let i = -1;
  for (let j = 0; j < cau.length; j++) if (cau[j].f <= f) i = j;
  if (i < 0) return null;
  const den = i + 1 < cau.length ? cau[i + 1].f : dai - 8;
  const mo = Math.min(1, (f - cau[i].f) / 4) * Math.min(1, (den - f) / 4);
  if (mo <= 0) return null;
  const tu = cau[i].tu_moc;
  return (
    <div style={{ position: "absolute", left: 100, right: 100, bottom: 54, textAlign: "center", opacity: mo }}>
      <span style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.5, color: mau.chu, background: mau.nen, padding: "8px 24px", borderRadius: 12, borderBottom: `4px solid ${mau.nhan}`, boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>
        {!tu
          ? cau[i].chu
          : tu.map((w, k) => {
              const dang = f >= w.f && (k + 1 >= tu.length ? f < w.het + 6 : f < tu[k + 1].f);
              const dam = MO_CHUA_DOC + (1 - MO_CHUA_DOC) * Math.max(0, Math.min(1, (f - w.f + 1) / CHUYEN));
              return (
                <span key={k} style={{ opacity: dam, color: dang ? mau.nhan : mau.chu }}>
                  {w.chu}
                  {k + 1 < tu.length ? " " : ""}
                </span>
              );
            })}
      </span>
    </div>
  );
};
