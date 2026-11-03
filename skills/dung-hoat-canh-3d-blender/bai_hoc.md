# Bài học dựng hoạt cảnh 3D bằng Blender

> Gom từ hai cảnh thử D-11 (26–27/10/2026). Số đo và bối cảnh gốc: `tai_san/nhat_ky_video_ngang.md` mục 20; lỗi chung của Blender: `90_bai_hoc.md` mục 25/10 và 26/10. Thêm bài học mới vào cuối file, ghi ngày.

## Bài học về chất lượng hình

1. **Hình đẹp là nhờ mô hình và vân bề mặt, bộ kết xuất chỉ quyết định phần còn lại.** Lần 1 dựng buồng máy tua-bin bằng khối cơ bản, vật liệu màu phẳng, chạy Cycles 79 phút: Trung nhận xét không đẹp hơn Three.js. Lần 2 dùng mô hình 3,1 triệu đa giác có vân 4K thì đạt. Không có mô hình chi tiết thì đừng dùng Blender.
2. **Phải có hoạt cảnh, chỉ lượn máy quay là chưa đủ.** Video mẫu của Jared Owen luôn có bộ phận chuyển động: lắp ráp, tách rời lộ bên trong, nhấc lên, vỏ mở. Lần 1 chỉ có máy quay lượn, vỏ mờ dần, bánh răng quay nên bị chê.
3. **Kiểm cấu tạo mô hình trước khi hứa đề tài.** Hai mô hình buồng máy tua-bin trên TurboSquid (89 và 149 USD) là loại không hộp số, trong khi kịch bản nói về hộp số. NASA không có mô hình xe LRV, dù đề tài là xe của NASA.
4. **Viền sáng dựng trong Remotion, không dựng trong Blender.** Blender chỉ xuất ảnh mặt nạ màu phẳng: mỗi bộ phận một kênh màu, vật khác đen để che phần bị khuất. Remotion lấy ảnh mặt nạ dựng viền bằng bộ lọc SVG. Đổi lúc hiện, độ dày, màu viền không phải kết xuất lại 3D.
5. **Mô hình tải về không theo tỉ lệ thật.** Xe LRV trong file chỉ khoảng 1/5 kích thước thật, nên khoảng cách máy quay, công suất đèn, f-stop phải chỉnh lại. Cùng f-stop thì vật càng nhỏ, hậu cảnh càng nhoè.

## Lỗi kỹ thuật đã vấp và cách gỡ

| Lỗi | Nguyên nhân | Cách gỡ |
|---|---|---|
| File mô hình có thể chạy mã Python nhúng sẵn | File `.blend` tải về có thể chứa script tự chạy | Luôn chạy với `--disable-autoexec` |
| Ảnh ra là EXR nhiều lớp dù đã đặt PNG | File mô hình để sẵn kiểu xuất EXR nhiều lớp | Đặt `image_settings.media_type = "IMAGE"` trước khi đặt `file_format = "PNG"` |
| Vật đang mờ dần hiện thành mảng đen | Vỏ dày nhiều lớp làm hết số lượt xuyên trong suốt mặc định (8) | `sc.cycles.transparent_max_bounces = 64`; khung có ba lớp vỏ trong suốt chậm gấp 3–4 lần |
| Bên trong máy tối | Đèn đặt cao bị nóc che | Đặt đèn chính chếch về phía máy quay |
| Vỏ trắng cháy sáng | Chuyển màu `Standard` | Dùng `AgX` cho lượt màu; lượt mặt nạ dùng `Standard` |
| Không có nhòe chuyển động | Đặt vị trí bằng hàm tính tại lúc kết xuất | Khoá từng khung (`keyframe_insert`) cho máy quay và `delta_location` của vật |
| Máy quay giật khi đổi hướng | Hai quaternion liền nhau trái dấu | Đổi dấu khi tích vô hướng với khung trước âm (hàm `dat_khoa` trong khuôn) |
| Lượt kết xuất dừng giữa chừng không để lại lỗi | Lệnh lọc nhật ký làm mất thông báo | Ghi đủ nhật ký ra `out/`; script bỏ qua khung đã có nên chạy lại là đi tiếp |
| Xe bị cắt khỏi khung, nhãn đè vật | Máy quay quá gần; toạ độ nhãn đặt trước khi xem hình | Chạy vài khung `--ti-le 25 --mau 8` để xem bố cục trước lượt dài; đặt nhãn sau khi có ảnh |
| Hook tự lưu đưa 250 MB ảnh kết xuất vào git | Thiếu luật loại trừ | `.gitignore` đã có `xuong_dai/**/public/blender_*/`, `xuong_dai/**/public/thu/`, `tai_san/mo_hinh_3d/*/*`; dự án mới đặt ảnh đúng các thư mục này |
| Giọng máy nghe lại báo "lốp" thành "lúc", "vấu" thành "vào" | Whisper nghe giọng Bắc chưa chuẩn | Chưa kết luận; Trung nghe lại mới quyết đổi phiên âm |

## Số đo để ước thời gian (Mac M5, GPU Metal)

| Cảnh | Độ phân giải | Mẫu | Giây mỗi khung | Ghi chú |
|---|---|---|---|---|
| Buồng máy tự dựng, có vỏ trong suốt | 960×540 | 32 | 13,8 (6,8–24,7 theo số lớp vỏ trong suốt) | Lần đầu biên dịch nhân GPU thêm 80 giây |
| Xe LRV 3,1 triệu đa giác, vân 4K, độ sâu trường ảnh | 960×540 | 24 | 13,0 (7,6–100) | Nạp mô hình và vân lần đầu 45 giây |
| Lượt mặt nạ Workbench, xe LRV | 960×540 | — | 0,57 | Mô hình nhẹ thì nhanh hơn nhiều (lần 1: 0,02) |
| Ghép Remotion 412 khung | 1920×1080 | — | 0,1 | 41 giây cả cảnh |

Bản 1920×1080 ước gấp khoảng 4 lần lượt nháp (chưa chạy thật). Hướng giảm thời gian chưa thử: ẩn hẳn vỏ thay vì làm trong suốt, giảm lượt xuyên trong suốt, dùng EEVEE cho cảnh không cần dò tia (thẻ D-08 đo 2,6 giây mỗi khung 1080p).
