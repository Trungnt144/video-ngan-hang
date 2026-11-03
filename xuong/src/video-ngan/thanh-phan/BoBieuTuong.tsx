import React from "react";
import type { BoMau } from "../bo_mau";
import type { TenBieuTuong } from "../kieu_du_lieu";

/**
 * Bộ biểu tượng vector tự vẽ — nét đơn giản, một màu, đúng tông D-01.
 *
 * CỐ Ý không dùng logo thương hiệu thật (Claude, OpenAI, GitHub...) — vẽ hình
 * học chung chung để tránh vướng bản quyền/nhận diện của bên khác
 * (`13_ban_quyen_va_bao_mat.md`). Muốn thêm biểu tượng mới thì thêm một khóa
 * vào `DUONG_VE` và vào `TenBieuTuong` ở `kieu_du_lieu.ts`.
 *
 * Mỗi hình vẽ trên lưới 24×24, nét dày 1.8, không tô đặc — khớp độ mảnh của
 * chữ trong khuôn D-01.
 */
const DUONG_VE: Record<TenBieuTuong, string> = {
  khoa: "M6 11V8a6 6 0 1 1 12 0v3M5 11h14v10H5z",
  nao: "M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5h1v2h8v-2h1a3 3 0 0 0 2-5 3 3 0 0 0-2-5 3 3 0 0 0-3-3 3 3 0 0 0-2 1 3 3 0 0 0-2-1z M12 4v15",
  toc_do: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 12l5-3M12 12V7",
  tien: "M12 2v20M17 6H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6",
  bieu_do: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  canh_bao: "M12 3l10 18H2L12 3zM12 10v4M12 17h.01",
  xac_nhan: "M20 6L9 17l-5-5",
  can_bang: "M12 3v18M12 6l-7 3 3.5 7a4 4 0 0 0 7 0L19 9l-7-3zM5 9h4M15 9h4",
  mang_luoi: "M4 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM16 6a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM10 18a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM6 8v3a3 3 0 0 0 3 3h.5M18 8v3a3 3 0 0 1-3 3h-.5",
  khien: "M12 2l8 3v6c0 5-3.4 8.4-8 11-4.6-2.6-8-6-8-11V5l8-3z",
  hoi: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 4M12 16.5v.01",
  y_tuong: "M9 18h6M10 22h4M12 2a6 6 0 0 0-3 11.2c.5.3.8.9.8 1.5v.3h4.4v-.3c0-.6.3-1.2.8-1.5A6 6 0 0 0 12 2z",
  dong_ho: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 7v5l3.5 2",
  nguoi: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-7 8-7s8 2.6 8 7",
  muc_tieu: "M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  co_hoi: "M12 3v3M12 18v3M4.2 4.2l2.2 2.2M17.6 17.6l2.2 2.2M3 12h3M18 12h3M4.2 19.8l2.2-2.2M17.6 6.4l2.2-2.2M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
};

export const BieuTuong: React.FC<{
  ten: TenBieuTuong;
  bo: BoMau;
  co?: number;
  nhan_manh?: boolean;
}> = ({ ten, bo, co = 56, nhan_manh }) => {
  const d = DUONG_VE[ten];
  if (!d) return null;
  return (
    <svg
      width={co}
      height={co}
      viewBox="0 0 24 24"
      fill="none"
      stroke={nhan_manh ? bo.nhan_chinh : bo.chu_chinh}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
};
