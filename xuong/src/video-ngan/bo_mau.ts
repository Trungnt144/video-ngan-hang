/**
 * Bộ màu và thông số chữ — đổi được bằng tham số.
 *
 * D-01 "Đêm & đỏ" là bộ mặc định, số đo lấy từ thẻ
 * `tai_san/so_tay_gu/dung/d01_dem_va_do.md`.
 *
 * Thêm tông mới thì thêm một bộ ở cuối file rồi khai báo ở `CAC_BO_MAU`.
 * KHÔNG sửa bộ D-01 tại chỗ nếu nó đã dùng cho video đã giao — đẻ biến thể
 * D-01b thay vì sửa ngầm (quy tắc ở `03_kich_ban_va_loi_viet.md` mục 6).
 */

export type BoMau = {
  ma: string;
  ten: string;
  nen: string;
  /** Màu vệt sáng rất nhẹ tỏa từ giữa khung ra (vignette ngược). */
  quang_nen: string;
  chu_chinh: string;
  chu_mo: string;
  nhan_chinh: string;
  nhan_phu: string;
  /** Cỡ chữ, tính theo khung 1080×1920. Sàn 32px theo `01` mục 3. */
  co_chu: {
    tieu_de_lon: number; // cảnh mở đầu
    tieu_de: number;
    doan: number;
    phu_de: number;
    kicker: number;
    so_lieu: number;
  };
  ho_phong: string;
};

/** D-01 Đêm & đỏ. */
export const D01: BoMau = {
  ma: "D-01",
  ten: "Đêm & đỏ",
  nen: "#000000",
  quang_nen: "rgba(255,255,255,0.055)",
  chu_chinh: "#FFFFFF",
  chu_mo: "#8A8A8E",
  nhan_chinh: "#FF443D",
  nhan_phu: "#F0C73C",
  co_chu: {
    tieu_de_lon: 82,
    tieu_de: 64,
    doan: 38,
    phu_de: 50,
    // Mẫu gốc dùng ~19px cho nhãn đầu khung. Xưởng chốt sàn 32px để đọc được
    // trên điện thoại (`01` mục 3) nên nâng lên 32 — đây là chỗ CỐ Ý lệch mẫu,
    // ghi ở ô "Ghi chú khi dùng thử" điểm (1) của thẻ D-01.
    kicker: 32,
    so_lieu: 92,
  },
  // Từ 26/10/2026 (máy Mac): Be Vietnam Pro, phông thiết kế riêng cho tiếng Việt, đã cài trên máy;
  // Helvetica Neue dự phòng (phông của video ngang). Segoe UI cũ là phông Windows, Mac không có.
  // Thẻ D-01 mô tả mẫu dùng phông bo tròn kiểu Poppins/Nunito; muốn giống hơn
  // thì nạp phông đó vào `tai_san/` rồi đổi dòng dưới - nhưng phải kiểm dấu
  // tiếng Việt trước, nhiều phông bo tròn thiếu dấu.
  ho_phong: '"Be Vietnam Pro", "Helvetica Neue", Arial, sans-serif',
};

export const CAC_BO_MAU: Record<string, BoMau> = {
  "D-01": D01,
};

export const layBoMau = (ma: string | undefined): BoMau =>
  (ma && CAC_BO_MAU[ma]) || D01;

/** Khung hình cố định của giai đoạn 1 — xem `09_video_doc_ngan.md` mục 3. */
export const KHUNG = {
  rong: 1080,
  cao: 1920,
  fps: 30,
} as const;

/**
 * Nhịp chuyển màn: chồng mờ trực tiếp ~0,25 giây, KHÔNG đi qua đen.
 * Con số này đo được từ mẫu và đã sửa một lần — xem ô "Nhật ký sửa" thẻ D-01.
 */
export const CHUYEN_MAN_GIAY = 0.25;

/** Lề an toàn hai bên khung. */
export const LE = 84;

/** Phụ đề đặt ở ~72% chiều cao để không bị thanh giao diện Shorts/TikTok che. */
export const PHU_DE_TY_LE_CAO = 0.72;
