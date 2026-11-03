# Nhật ký đo HyperFrames — model_nho

- 19:58:49 Bắt đầu (đọc kỹ năng, bảng màu)
- 20:00:47 Xong khảo sát: init dự án model_nho (portrait), chép dữ liệu + giọng vào assets/, cắt 11 khung tham khảo Remotion. Bắt đầu viết mã. Cách làm: script node tao_trang.mjs đọc JSON, sinh index.html + 14 file cảnh + file phụ đề + file nền.
- 20:02:26 Bản dựng đầu sinh xong, lint 0 lỗi 2 cảnh báo (đầu nét tròn lộ chấm khi ẩn bằng dash; quá nhiều clip phụ đề trong một file). Sửa cảnh báo nét: dasharray '1 1.2'. Chạy check.
- 20:03:23 Lượt sửa 1 (sau check + snapshot 14 khung): check đạt (0 lỗi; 6 cảnh báo craft line_unread do lời đọc nhanh, không sửa được vì kịch bản cố định; 20 info chồng chữ chỉ trong 0,25 giây chồng mờ chuyển cảnh). Snapshot: cảnh 5 tiêu đề 'Một tiến trình hai tầng' chạm sát hộp 'Mã nguồn' (chữ đè hình) -> dời tiêu đề lên, thu chuỗi hộp; hộp 'Mã nguồn' hiện SAU hộp 'Model nhỏ' vì mốc lấy theo từ 'mã nguồn' đọc muộn -> đổi mốc sang 'thay vì'. Dấu tiếng Việt đúng ở mọi khung.
- 20:03:34 Bắt đầu render lần 1 (quality delivery, 30 fps)
- 20:04:29 Render lần 1 xong: thời gian thật 47,17 giây (/usr/bin/time real; công cụ tự báo 33,6 giây), 2251 khung, ffprobe thời lượng 75,05 giây (giọng 75,008), 9,7 MB (10.153.793 byte), H.264 1080x1920 30 fps + AAC. Không lỗi.
- 20:04:55 Lượt sửa 2 (sau xem 31 khung cắt mỗi 2,5 giây từ mp4): khung 0 giây đen hoàn toàn vì icon, kicker, tiêu đề cảnh 1 mờ dần từ 0 (trang bìa đen) -> cảnh 1 bắt đầu từ độ mờ 0,5 tại giây 0. Không thấy chữ đè, không lỗi dấu hay rơi phông trong file render; không khoảng đứng yên (thân cảnh trôi chậm, quầng nền trôi, thanh tiến độ chạy liên tục, phụ đề đổi 1 giây/lần). check lại: đạt.
- 20:04:55 Bắt đầu render lần 2
- 20:05:42 Render lần 2 xong: thời gian thật 32,73 giây (công cụ báo 31,9 giây), ffprobe 75,05 giây (luồng hình 75,033), 9,8 MB (10.230.419 byte). Khung 0 giây đã có chữ. Kiểm 6 khung (0; 0,5; 1,5; 30; 47,5; 73,5 giây): đạt.
- Lỗi công cụ: không có lỗi chặn. Cảnh báo lặp lại: craft line_unread (dòng chữ hiện ngắn hơn ngưỡng đọc 0,5 s + 0,3 s/từ) ở cảnh 1, 2, 3, 14 — do nhịp giọng cố định, không sửa; lint timeline_track_too_dense (68 cụm phụ đề trong một file). Lệnh render in dòng quảng cáo ứng dụng desktop (Framey), bỏ qua.
- Số dòng mã tự viết: tao_trang.mjs 302 dòng (node; sinh ra index.html + 16 file cảnh/nền/phụ đề, tổng mã HTML sinh ra 915 dòng).
- 20:05:42 Xong.
