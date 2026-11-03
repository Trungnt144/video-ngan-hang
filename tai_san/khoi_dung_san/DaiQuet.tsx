// Dải sáng quét nền cho cảnh toàn đồ thị (CL-05) của video ngang Remotion.
// Trung chốt 28/10/2026: mọi cảnh đồ thị phải có chuyển động diện tích lớn chạy từ khung đầu,
// để qua ngưỡng đứng hình 1,5 giây (`15_bang_kiem_truoc_khi_giao.md`). Bộ đo
// `freezedetect=n=-60dB:d=0.5` coi chấm, nét mảnh, chữ hiện dần là đứng hình.
// Lấy từ `xuong_dai/san_luong_rieng/src/HinhVe.tsx` (N35, qua bộ đo). Cách dùng: chép file này vào
// `src/` của dự án dựng, đặt <DaiQuet> ngay sau nền, trước đồ thị, trong <svg> 1920×1080 của cảnh.
// Số đo đã qua: dải rộng 520 điểm ảnh (≥ 500), đậm 0,16 ở giữa (≥ 0,15), quét hết khung trong 110 khung.
import React from "react";

export const DaiQuet: React.FC<{
  f: number; // khung hiện tại
  f0: number; // khung bắt đầu cảnh (dải chạy từ khung đầu)
  mau: string; // màu dải: màu ấm của bảng màu đang dùng
  id: string; // id gradient, khác nhau giữa các cảnh
  rong?: number;
  dam?: number;
  chuKy?: number; // số khung để quét hết một lượt
}> = ({ f, f0, mau, id, rong = 520, dam = 0.16, chuKy = 110 }) => {
  const u = ((((f - f0) / chuKy) % 1) + 1) % 1;
  const x = -rong + u * (1920 + rong);
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={mau} stopOpacity={0} />
          <stop offset="0.5" stopColor={mau} stopOpacity={dam} />
          <stop offset="1" stopColor={mau} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x} y={0} width={rong} height={1080} fill={`url(#${id})`} />
    </g>
  );
};
