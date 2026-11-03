import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

/**
 * Chuyển động liên tục để cảnh dài không có khoảng hình đứng yên (Trung chốt 26/10/2026,
 * sau phép thử HyperFrames `12_cong_cu_media_ai.md` mục 3b: bản Remotion đứng yên 8 giây ở
 * cảnh nhiều chữ, bản HyperFrames không).
 *
 * `NhipLoi` mang khoảng lời đọc của cảnh đang chạy (khung tính từ đầu cảnh), do `VideoNgan`
 * tính từ các cụm phụ đề nằm trong cảnh. `ChuSangTheoLoi` cho đoạn chữ sáng dần từng từ theo
 * khoảng lời đó. Giọng VieNeu chưa có mốc từng từ cho video ngắn, nên tiến độ chia đều theo
 * số ký tự trong khoảng lời của cảnh — chữ sáng theo nhịp đọc, không khớp đúng từng từ.
 * Lời đọc thường dài hơn đoạn chữ (có câu dẫn trước đoạn), nên đoạn chữ khớp vào PHẦN CUỐI
 * khoảng lời theo tỉ lệ số ký tự; chia đều cả khoảng thì cuối cảnh vẫn còn từ mờ (đã vấp ở
 * cảnh 12 video "Model nhỏ thắng model to").
 */
export const NhipLoi = createContext<{ tu: number; den: number; kyTu: number }>({ tu: 0, den: 1, kyTu: 1 });

const MO_CHUA_DOC = 0.32; // độ đậm của từ chưa tới lượt

export const ChuSangTheoLoi: React.FC<{ chu: string }> = ({ chu }) => {
  const k = useCurrentFrame();
  const { tu, den, kyTu } = useContext(NhipLoi);
  const cacTu = chu.split(/\s+/).filter(Boolean);
  const tong = cacTu.reduce((s, w) => s + w.length + 1, 0);
  const batDau = den - (den - tu) * Math.min(1, tong / Math.max(1, kyTu));
  // Vị trí ký tự đang đọc tới, chia đều theo thời gian phần lời ứng với đoạn chữ
  const viTri = Math.max(0, Math.min(1, (k - batDau) / Math.max(1, den - batDau))) * tong;
  let daQua = 0;
  return (
    <>
      {cacTu.map((w, i) => {
        const dau = daQua;
        daQua += w.length + 1;
        // Mỗi từ sáng lên trong khoảng 6 ký tự đọc, tránh nháy bật tắt
        const sang = Math.max(0, Math.min(1, (viTri - dau) / 6));
        return (
          <span key={i} style={{ opacity: MO_CHUA_DOC + (1 - MO_CHUA_DOC) * sang }}>
            {w}
            {i + 1 < cacTu.length ? " " : ""}
          </span>
        );
      })}
    </>
  );
};
