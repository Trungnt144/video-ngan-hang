/**
 * Kiểu dữ liệu cho video ngắn dọc — khuôn 7 cảnh.
 *
 * Nguồn sự thật của một video là file `san_pham/<thư mục video>/tai_nguyen/kich_ban/<ten>.canh.json`.
 * Từ đó sinh ra lời đọc, giọng đọc, mốc thời gian, rồi gộp lại thành
 * `du_lieu_video.json` mà các khối cảnh đọc vào.
 *
 * Xem quy trình ở `09_video_doc_ngan.md`, tông màu ở thẻ D-01.
 */

/** Bảy khối cảnh của khuôn. Phong cách kịch bản quyết định mỗi cảnh chứa gì,
 *  KHÔNG được đổi số cảnh — xem `09_video_doc_ngan.md` mục 2. */
export type LoaiCanh =
  | "mo_dau" // C1 — móc câu, chữ lớn nhất video
  | "giai_thich" // C2/C3 — căn trái, có vạch dọc đỏ, chứa đoạn văn dài
  | "so_lieu" // khối số đếm tăng + thanh chạy đầy (thay cho giai_thich khi cần số)
  | "diem_nhan" // C4 — một câu ngắn, đây là chỗ DUY NHẤT màu đỏ được dùng mạnh
  | "danh_sach" // C5 — 2-4 ý đánh số, dùng cho cảnh phản biện
  | "he_qua" // C6 — tiêu đề + đoạn, tông trầm
  | "ket_luan" // C7 — câu hỏi chốt, nhạc hạ, giọng nghỉ nửa giây
  | "so_do" // sơ đồ khối nối dây — quan hệ giữa nhiều thành phần
  | "chuoi" // chuỗi mũi tên A → B → C — một tiến trình có thứ tự
  | "luoi"; // lưới biểu tượng — liệt kê nhiều mục cùng loại

/** Một khối trong sơ đồ nối dây. Tọa độ 0–1 tính theo vùng vẽ, KHÔNG theo cả khung. */
export type NutSoDo = {
  id: string;
  nhan?: string; // nhãn nhỏ góc trên, ví dụ "01"
  tieu_de: string;
  phu?: string;
  x: number;
  y: number;
  nhan_manh?: boolean; // viền đỏ thay vì trắng — dùng cho ĐÚNG MỘT khối quan trọng nhất
};
export type NoiSoDo = { tu: string; den: string };
export type SoDo = { nut: NutSoDo[]; noi: NoiSoDo[] };

/** Một mắt xích trong chuỗi tiến trình A → B → C. */
export type MatXich = { nhan: string; phu?: string; nhan_manh?: boolean };
export type ChuoiMuiTen = { mat_xich: MatXich[] };

/** Một mục trong lưới biểu tượng. Dùng chữ viết tắt làm huy hiệu, KHÔNG dùng
 *  logo thương hiệu thật — tránh vướng bản quyền/nhận diện của bên khác. */
export type MucLuoi = { nhan: string; chu_viet_tat?: string; nhan_manh?: boolean };
export type LuoiBieuTuong = { muc: MucLuoi[] };

/**
 * Tên các biểu tượng vector có sẵn, vẽ ở `thanh-phan/BoBieuTuong.tsx`.
 * Thêm biểu tượng mới thì thêm tên ở đây VÀ vẽ đường nét tương ứng ở đó.
 */
export type TenBieuTuong =
  | "khoa" // bảo mật, giới hạn quyền
  | "nao" // AI, trí tuệ, model
  | "toc_do" // tốc độ, hiệu năng
  | "tien" // chi phí, tiền bạc
  | "bieu_do" // số liệu, xu hướng
  | "canh_bao" // rủi ro, cần thận trọng
  | "xac_nhan" // đã kiểm chứng, đạt
  | "can_bang" // cân bằng hai phía, đánh đổi
  | "mang_luoi" // hệ thống, kết nối nhiều thành phần
  | "khien" // bảo vệ, phòng thủ
  | "hoi" // câu hỏi, điều chưa chắc
  | "y_tuong" // ý tưởng, phát hiện mới
  | "dong_ho" // thời gian
  | "nguoi" // con người, người dùng
  | "muc_tieu" // mục tiêu, phạm vi hẹp
  | "co_hoi"; // cơ hội, tiềm năng

/** Một ý trong danh sách — có thể chỉ là chữ (như trước) hoặc kèm biểu tượng. */
export type YCoBieuTuong = string | { text: string; bieu_tuong?: TenBieuTuong; nhan_manh?: boolean };

/** Một dòng trong khối số liệu: số đếm tăng dần kèm thanh chạy đầy. */
export type DongSoLieu = {
  nhan: string;
  /** Giá trị đích. Số sẽ đếm từ 0 lên tới đây trong ~0,5 giây. */
  gia_tri: number;
  /** Chữ đứng sau số, ví dụ "%" hoặc " tỷ". */
  don_vi?: string;
  /** Độ dài thanh ngang, 0–1. Không truyền thì suy từ gia_tri/gia_tri lớn nhất. */
  ty_le?: number;
  /** Tô đỏ dòng này khi chạy xong. Mỗi khối số liệu chỉ nên có MỘT dòng đỏ. */
  nhan_manh?: boolean;
};

export type Canh = {
  /** Thứ tự 1–7, hiện ở thanh đầu khung dạng `03 / 07`. */
  so: number;
  loai: LoaiCanh;
  /** Nhãn nhỏ viết hoa phía trên tiêu đề. Bỏ trống thì không hiện. */
  kicker?: string;
  /** Tiêu đề màn — tối đa 2 dòng theo thẻ D-01. */
  tieu_de: string;
  /** Đoạn giải thích dưới tiêu đề, dùng ở `giai_thich` và `he_qua`. */
  doan?: string;
  /** Các ý đánh số, dùng ở `danh_sach`. Mỗi ý có thể kèm biểu tượng riêng. */
  y?: YCoBieuTuong[];
  /** Biểu tượng đại diện cho cả cảnh — dùng ở mo_dau/giai_thich/diem_nhan/he_qua/ket_luan. */
  bieu_tuong?: TenBieuTuong;
  /** Tô viền/nét biểu tượng cấp cảnh màu đỏ — dùng khi ý này quan trọng hơn các ý cùng loại. */
  bieu_tuong_nhan_manh?: boolean;
  /** Các dòng số, dùng ở `so_lieu`. */
  so_lieu?: DongSoLieu[];
  /** Sơ đồ khối nối dây, dùng ở `so_do`. */
  so_do?: SoDo;
  /** Chuỗi mũi tên, dùng ở `chuoi`. */
  chuoi?: ChuoiMuiTen;
  /** Lưới biểu tượng, dùng ở `luoi`. */
  luoi?: LuoiBieuTuong;
  /**
   * Lời đọc của cảnh này, mỗi phần tử là một đoạn.
   * Đây là nguồn duy nhất sinh ra file tiếng — sửa chữ thì sửa ở đây,
   * không sửa file `.loi_doc.txt` (file đó do máy sinh ra).
   */
  loi_doc: string[];
};

/** Một cụm phụ đề: tối đa 6 từ (`scripts/chuan_bi_video.mjs`, CUM_TOI_DA). */
export type CumPhuDe = {
  tu: string[];
  /** Mốc bắt đầu/kết thúc của TỪNG từ trong cụm, tính bằng giây.
   *  Rỗng khi phụ đề theo câu (giọng VieNeu chỉ có mốc câu). */
  moc_tu: { bat_dau: number; ket_thuc: number }[];
  bat_dau: number;
  ket_thuc: number;
};

/** Khoảng thời gian một cảnh chiếm trên trục video, tính bằng giây. */
export type MocCanh = {
  so: number;
  bat_dau: number;
  ket_thuc: number;
};

/** File `du_lieu_video.json` — thứ mà thành phần Remotion đọc vào. */
export type DuLieuVideo = {
  ten: string;
  /** Tên file tiếng trong `public/`, ví dụ "giong_doc.mp3". */
  file_tieng: string;
  /** Giọng đã gộp: "vieneu" (mặc định) hoặc "elevenlabs" (đường lui). */
  giong?: "vieneu" | "elevenlabs";
  thoi_luong_giay: number;
  /** Dòng định danh ở góc phải thanh đầu khung. */
  dinh_danh: string;
  canh: Canh[];
  moc_canh: MocCanh[];
  /** "tu": có mốc từng từ, tô đỏ từ đang đọc (ElevenLabs).
   *  "cau": chỉ có mốc câu, cụm chữ trắng không tô đỏ (VieNeu). Thiếu thì coi là "tu". */
  phu_de_theo?: "tu" | "cau";
  phu_de: CumPhuDe[];
};
