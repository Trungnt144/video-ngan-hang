import { interpolate, Easing } from "remotion";

/**
 * Bốn kiểu chuyển động của D-01, không có kiểu thứ năm.
 * Ô "Kiểu chuyển động" thẻ D-01: rất tiết chế, KHÔNG nảy, KHÔNG bay giật.
 * Ngoài các kiểu dưới đây, khung hình đứng yên.
 */

/**
 * Kiểu (2) — hiện dần kèm trượt lên vài chục pixel rồi dừng hẳn.
 * @param khung khung hình hiện tại, tính từ đầu cảnh
 * @param tre   trễ bao nhiêu khung mới bắt đầu (dùng để các khối vào lần lượt)
 */
export const hienDanTruotLen = (khung: number, fps: number, tre = 0) => {
  const t = khung - tre;
  const dai = Math.round(fps * 0.42);
  const mo = interpolate(t, [0, dai], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const truot = interpolate(t, [0, dai], [34, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  // Dùng thuộc tính rút gọn `translate`, không dùng chuỗi `transform` — theo
  // khuyến nghị của skill remotion-markup: transform dạng chuỗi khó chỉnh lại
  // trong Remotion Studio hơn các thuộc tính scale/translate/rotate riêng.
  return { opacity: mo, translate: `0px ${truot}px` };
};

/**
 * Kiểu thứ sáu — dùng cho KHỐI CHỮ (kicker/tiêu đề/đoạn), khi cần chữ trông
 * sống động hơn `hienDanTruotLen`. Vẫn cùng họ dịu — không nảy, không bay
 * giật — nhưng thêm một chút phóng to nhẹ (0.94→1) để có cảm giác "đang tới"
 * thay vì chỉ trượt phẳng. Trung yêu cầu 28/07/2026 (khuya muộn, lần 3) sau khi
 * thấy các khối chữ đứng yên hơi tĩnh khi chuyển cảnh.
 *
 * Cách dùng đúng: gọi RIÊNG cho kicker và cho tiêu đề với `tre` lệch nhau một
 * chút (kicker trước, tiêu đề sau ~0.1 giây) để tạo cảm giác chữ đến theo tầng,
 * thay vì cả khối hiện cùng lúc.
 */
export const hienChuSongDong = (khung: number, fps: number, tre = 0) => {
  const t = khung - tre;
  const dai = Math.round(fps * 0.46);
  const mo = interpolate(t, [0, dai], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const truot = interpolate(t, [0, dai], [26, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(t, [0, dai], [0.94, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return { opacity: mo, translate: `0px ${truot}px`, scale };
};

/**
 * Kiểu thứ năm — CHỈ dùng cho biểu tượng minh họa, KHÔNG dùng cho chữ.
 * D-01 đo được bốn kiểu chuyển động tiết chế từ mẫu gốc (không nảy, không bay
 * giật) — nhưng mẫu gốc không có biểu tượng minh họa nào để đo. Trung yêu cầu
 * thêm sức sống cho phần hình minh họa (28/07/2026, khuya muộn), nên đây là
 * chuyển động MỚI, không có trong thẻ D-01: hiện dần kèm phóng to nảy nhẹ rồi
 * ổn định — vẫn tiết chế hơn nhiều so với hiệu ứng nảy giật thông thường.
 */
export const hienRaBieuTuong = (khung: number, fps: number, tre = 0) => {
  const t = khung - tre;
  const mo = interpolate(t, [0, Math.round(fps * 0.2)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(t, [0, Math.round(fps * 0.55)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
  const xoay = interpolate(t, [0, Math.round(fps * 0.55)], [-10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(1.6)),
  });
  return { opacity: mo, scale, rotate: `${xoay}deg` };
};

/**
 * Kiểu (4) — số đếm tăng dần và thanh chạy đầy dần, mỗi dòng ~0,5 giây,
 * các dòng chạy LẦN LƯỢT từ trên xuống chứ không cùng lúc.
 * Đây là chi tiết đã bị ghi sai một lần rồi sửa — xem "Nhật ký sửa" thẻ D-01.
 */
export const chayDayDan = (khung: number, fps: number, thuTuDong: number) => {
  const tre = Math.round(fps * 0.3) + thuTuDong * Math.round(fps * 0.55);
  const dai = Math.round(fps * 0.5);
  return interpolate(khung, [tre, tre + dai], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
};
