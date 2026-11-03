import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { BoMau } from "../bo_mau";
import { LE, PHU_DE_TY_LE_CAO } from "../bo_mau";
import type { CumPhuDe } from "../kieu_du_lieu";

/**
 * Phụ đề chạy chữ theo nhịp giọng đọc.
 *
 * Theo ô "Cách làm phụ đề" thẻ D-01: cụm 3-4 từ, đổi cụm mỗi 0,4-0,6 giây,
 * trong mỗi cụm đúng MỘT từ tô đỏ, và từ đỏ dịch chuyển theo lời đọc.
 * Đây là biến thể karaoke KHÔNG phóng to chữ, chỉ đổi màu — phóng to làm
 * dòng chữ nhảy giật, mẫu gốc không làm vậy.
 *
 * Chế độ theo câu (`theoCau`, giọng VieNeu chỉ có mốc câu): cả cụm chữ trắng,
 * không tô đỏ — vị trí từ đỏ chỉ ước được theo số ký tự, lệch tiếng sẽ lộ.
 * Trung chọn cách này 26/10/2026.
 *
 * Thiếu thành phần này thì video trông như slide có tiếng (`01` mục 3).
 */
export const PhuDeChayChu: React.FC<{ bo: BoMau; cum: CumPhuDe[]; theoCau?: boolean }> = ({ bo, cum, theoCau }) => {
  const khung = useCurrentFrame();
  const { fps } = useVideoConfig();
  const giay = khung / fps;

  const hienTai = cum.find((c) => giay >= c.bat_dau && giay < c.ket_thuc);
  if (!hienTai) return null;

  // Từ đang được đọc. Nếu rơi vào khe giữa hai từ thì giữ nguyên từ vừa đọc
  // xong, để màu đỏ không nhấp nháy tắt bật.
  let dangDoc = hienTai.moc_tu.findIndex((m) => giay >= m.bat_dau && giay < m.ket_thuc);
  if (theoCau) {
    dangDoc = -1;
  } else if (dangDoc < 0) {
    const daQua = hienTai.moc_tu.filter((m) => m.ket_thuc <= giay).length;
    dangDoc = Math.max(0, daQua - 1);
  }

  return (
    <div
      style={{
        position: "absolute",
        top: `${PHU_DE_TY_LE_CAO * 100}%`,
        left: LE,
        right: LE,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 16px",
        fontSize: bo.co_chu.phu_de,
        fontWeight: 800,
        lineHeight: 1.28,
        textAlign: "center",
        // Viền tối mảnh để đọc được cả khi chữ nằm đè lên nền sáng
        textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 0 3px rgba(0,0,0,0.9)",
      }}
    >
      {hienTai.tu.map((t, i) => (
        <span key={i} style={{ color: i === dangDoc ? bo.nhan_chinh : bo.chu_chinh }}>
          {t}
        </span>
      ))}
    </div>
  );
};
