import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import type { BoMau } from "../bo_mau";
import { LE } from "../bo_mau";

/**
 * Nền và bộ khung cố định suốt video — theo ô "Bảng màu" và "Bố cục" thẻ D-01.
 *
 * Ba thứ luôn có mặt: nền đen không phẳng tuyệt đối (có quầng sáng rất nhẹ tỏa
 * từ giữa ra), vệt gradient đỏ mảnh sát mép trên, và thanh đầu khung kiểu đầu
 * trang bản tin.
 *
 * Từ 26/10/2026 nền và khối nội dung chuyển động chậm liên tục để cảnh dài không đứng yên
 * (`thanh-phan/NhipLoi.tsx` ghi lý do): quầng sáng trôi ngang, khối nội dung trôi lên 3 px mỗi
 * giây và phóng rất nhẹ. Tốc độ cố định theo giây, không chia theo độ dài cảnh, để cảnh ngắn
 * và cảnh dài trôi cùng nhịp.
 */
export const KhungNen: React.FC<{
  bo: BoMau;
  soCanh: number;
  tongCanh: number;
  dinhDanh: string;
  children: React.ReactNode;
}> = ({ bo, soCanh, tongCanh, dinhDanh, children }) => {
  const hai = (n: number) => String(n).padStart(2, "0");
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  const giay = k / fps;
  const quangX = 50 + 8 * Math.sin(giay * 0.5 + soCanh);
  const quangY = 42 + 4 * Math.cos(giay * 0.37 + soCanh);

  return (
    <AbsoluteFill style={{ backgroundColor: bo.nen, fontFamily: bo.ho_phong }}>
      {/* Quầng sáng nhẹ giữa khung — nền phẳng tuyệt đối trông rẻ tiền */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at ${quangX}% ${quangY}%, ${bo.quang_nen} 0%, rgba(0,0,0,0) 70%)`,
        }}
      />

      {/* Vệt đỏ mảnh sát mép trên */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${bo.nhan_chinh} 28%, ${bo.nhan_chinh} 72%, rgba(0,0,0,0) 100%)`,
        }}
      />

      {/* Thanh đầu khung: trái là số màn, phải là dòng định danh loạt */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: LE,
          right: LE,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: bo.co_chu.kicker,
          letterSpacing: 3,
          fontWeight: 600,
          color: bo.chu_mo,
        }}
      >
        <span>
          <span style={{ color: bo.chu_chinh }}>{hai(soCanh)}</span>
          {` / ${hai(tongCanh)}`}
        </span>
        <span>{dinhDanh}</span>
      </div>

      <AbsoluteFill style={{ translate: `0px ${-3 * giay}px`, scale: String(1 + 0.002 * giay) }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
