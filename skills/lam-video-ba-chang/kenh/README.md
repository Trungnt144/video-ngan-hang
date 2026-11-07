# Khuôn theo kênh

> Skill `lam-video-ba-chang`, lập 05/11/2026. Mỗi kênh một file `<tên kênh không dấu>.md` trong thư mục này; lời nhắn giao việc ghi đường dẫn file kênh, mọi tác tử đọc file đó. Quy tắc không riêng kênh để ở `tham_chieu/quy_tac_chung.md`, không chép sang đây.

| Kênh | File | Trạng thái |
|---|---|---|
| Chuyện nghề Ngân hàng | `chuyen_nghe_ngan_hang.md` | Dùng (lô N207–N221) |
| Chuyện nghề Điện | chưa có | Video kênh này dựng bằng Remotion (LM-02); cách ba chặng chưa có lệnh kết xuất Remotion, chưa áp |
| Chuyện vĩ mô, Chuyện làm dự án | chưa có | Chưa áp |

**Kênh chưa có file ở đây** (ví dụ video LM-03 có giọng của kênh Chuyện làm dự án, chiến dịch khu công nghiệp): phiên giữ lô hỏi Trung trước, rồi chọn một trong hai: (1) lập file kênh theo năm mục dưới, lấy từ video mẫu LM-03 có giọng đã làm của kênh (ví dụ `san_pham/2026.11.02.video_mau_kcn_phap_ly/`), rồi chạy ba chặng; (2) kênh chưa có video mẫu dựng xong thì dựng video mẫu đầu tiên bằng skill `dung-video-html` (hoặc LM-02), sau đó mới lập file kênh.

## Mục phải có trong file kênh mới

1. **Nội dung:** kênh, khổ, cách làm, nhóm người xem; độ dài, số chương, lối viết; giọng và tốc độ nói; câu cuối nguyên văn và lúc bắt đầu màn hình kết; nguồn được dùng; cách đọc thuật ngữ và file từ điển đọc của kênh; nhạc tránh và lệnh chọn nhạc; kiểm ẩn danh (có hay không).
2. **Khuôn kịch bản:** video mẫu, mã MK, KB, dàn ý.
3. **Khuôn trang và tổ hợp:** mỗi cặp CL · BC một khuôn trang đã dựng xong (thư mục `xuong_html/<mã>_<tên>/` có `trang.html` đúng hợp đồng của skill `dung-video-html`, `<mã>_tao_nhip.py`, `<mã>_noi_nhac.sh`, khuôn kiểm `window.kiemTra`, `window.demTu`); chưa có khuôn trang thì dựng một video mẫu bằng skill `dung-video-html` trước.
4. **Bảng màu:** mã MAU được dùng, mã bị loại, cách chọn khi hết.
5. **Danh sách phát:** file cấu hình danh sách phát của kênh.
