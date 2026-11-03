# N302 — Sổ vòng sửa hình EBITDA

## Phạm vi và khuôn

- Codex dựng theo chấp thuận riêng của Trung ngày 03/11/2026; vẫn giữ cổng máy, soát Antigravity mới và cửa duyệt.
- Đã mở cả hai lưới ảnh chuẩn n199 đạt và n301 không đạt.
- Đã đọc khuôn `khuon_vi_du_tinh_tien.js`: không dùng nguyên thẻ nhiều dòng vì cần một phép tính lớn tại một thời điểm. Dùng lại toán vẽ `hcn`, `cham`, `roi`, `be`, `soChay`, `mui`, khung phụ đề/logo và bộ tự kiểm từ n199; nhà xưởng từ kho. Đường vận chuyển giá trị viết riêng vì kho chưa có cầu EBITDA/EV/cash theo ví dụ này.
- Từng chương được viết và chụp 3 mốc trước khi sang chương tiếp theo (`anh_tinh/xay_c1`…`xay_c9`). Mốc dựng ban đầu là ước tính, vòng chính dùng giọng thật.
- Chụp dựng ban đầu thấy hạt trên các đường ngắn dính thành nét liền: giảm mật độ hạt để nhìn rõ chuyển động. C5 có 13 từ: rút nhãn thành “Không đo thời gian”. Không thay ngưỡng cổng.

## Vòng 1 — 27 ảnh, giọng thật

Đã xem từng ô của `anh_tinh/v1/luoi_01.jpg` (C1–C3), `luoi_02.jpg` (C4–C6), `luoi_03.jpg` (C7–C9), mỗi chương ba ảnh đầu/giữa/cuối.

| Chương | Lỗi tìm thấy / việc cần kiểm | Sửa cho vòng 2 |
|---|---|---|
| C1 | Hạt không dính nét như bản dựng; nhãn chi phí thay theo thời gian ước lệ, chưa theo lời | Gắn nhãn theo ý đang nói hoặc bỏ nhãn chi tiết trước chương 7 |
| C2 | Bốn nhãn đọc rõ, nhưng khối được sáng theo tứ phân chương thay vì lời đọc | Gắn khấu hao/phân bổ/lãi/thuế theo câu có từ khóa |
| C3 | Lưới giữa hiện phép cộng ngược trong lúc phụ đề còn trừ lãi/thuế: lệch chỉ số câu | Dời ba mốc pha sang câu 5,6,7; EBITDA chỉ xuất hiện khi đọc câu 4 |
| C4 | Hạt 20/100 và 20% đúng; bố cục nhiều khoảng trống phía trên nhưng chữ lớn | Giữ, kiểm máy chuyển động và cỡ chữ |
| C5 | Công thức 2,5 rồi 5 đúng; nhãn không còn 13 từ | Giữ, kiểm cổng |
| C6 | Năm khối 20 thành 100; tách đúng 50/50 sau nợ ròng | Giữ, kiểm chuyển động của hình chính |
| C7 | Giá trị âm 3 vẫn màu vàng; chưa có nhãn số cho từng khoản của thác tiền | Chuyển âm sang đỏ; thêm số từng khoản lớn ở hàng dưới, giữ ≤12 từ |
| C8 | Hai báo cáo trừu tượng và kính soi không dùng chữ nhỏ; không có số liệu giả làm thật | Giữ; kiểm máy chuyển động |
| C9 | Nhà xưởng không tên/logo thật; lời kết chưa xuất trong ba mốc ảnh | Vòng 3 chụp riêng lúc CTA bắt đầu và giữa màn hình kết |

Chưa kết luận đạt; chờ cổng máy và phiên soát mới.

## Vòng 2 — 27 ảnh

Đã xem từng ô ở `anh_tinh/v2/luoi_01.jpg` (C1–C3), `luoi_02.jpg` (C4–C6), `luoi_03.jpg` (C7–C9). C3 giữa chương đã đúng phép trừ lãi/thuế; C2 đổi sáng đúng nhóm ý; C7 số âm đã đỏ và có từng khoản. Máy quét mỗi 0,5 giây: 0 lỗi chữ đè/tràn/cỡ chữ/số từ và 0 pageerror.

Lỗi còn thấy: C3 ảnh đầu có cụm chi phí chưa gắn nhãn vì hạt hiện trước câu đọc chi phí. Sửa: dời cụm hạt chi phí sang đầu câu 2, nhãn EBITDA/hạt EBITDA vẫn chỉ từ câu 4. C1, C2, C4–C9 không thấy lỗi bố cục mới trong các ảnh này. Chưa kết luận hình đạt: chờ vòng 3 mỗi câu, máy đo cuối và phiên soát mới.

## Vòng 3 — 77 ảnh

Đã mở và nhìn từng ô của cả chín lưới `anh_tinh/v3/luoi_01.jpg`…`luoi_09.jpg`: 75 ảnh cuối mỗi câu và hai ảnh bổ sung lúc 314,4 / 319 giây. Đã đối chiếu C3 từng pha: doanh thu; chi phí; EBITDA; EBIT; lợi nhuận sau thuế; cộng ngược EBITDA. Các ảnh C7 lần lượt có số dư 20, 14, 4, −3 theo khoản chi đã đọc. Ảnh 314,4 giây có logo đang mọc đầu màn hình kết; 319 giây có logo, tên kênh và hai ô màn hình kết.

- Cổng cuối: `do_hinh_cuoi.json`, 9/9 chương; chuyển động 1,00 mỗi chương; trung vị 5–12 từ; chữ nhỏ 0–9%. Không đổi ngưỡng.
- Quét chữ mỗi 0,5 giây: 0 loại lỗi, 0 pageerror.
- Tương phản mỗi 2 giây (162 mốc): 0 chữ dưới 4,5:1.
- 15 đối chiếu số học/CTA/thời lượng đúng, chạy `n302_kiem_so_hoc.py`.
- Giọng: Quốc Tuấn, tốc độ đích 5,06; đã có bản nghe. Không ghi “đã nghe bằng tai”; đối chiếu máy và các câu cần nghe nằm ở `2026.11.03.ebitda_v1.kiem_giong.md`.
- Phiên soát độc lập Antigravity mới đang chạy. Chưa có quyền kết luận đạt pha máy cho đến khi có bản soát không còn mục nặng/vừa và Trung duyệt.

## Lệnh và lỗi môi trường trong phiên

- VieNeu/Whisper cần GPU Metal, phải chạy ngoài môi trường hạn chế sau khi công cụ phê duyệt.
- Chromium bị chặn MachPort trong môi trường hạn chế; các lệnh chụp/quét được công cụ phê duyệt chạy trên máy.
- `agy --print-timeout` cần đơn vị `900s` (ví dụ trong mẫu cũ ghi `900` báo lỗi).
- Chế độ plan của agy cần quyền `command(plan)` trong lần chạy không giao diện. Đã cấp riêng quyền này trong cấu hình tạm của phiên, không dùng `--dangerously-skip-permissions` hoặc sửa quyền toàn cục.
- 13 script chép từ n199 không dùng đã được xác nhận khớp bản khuôn và giữ nguyên trong `_ke_thua_khong_dung/` (ngoài git); không xóa dữ liệu.

## Soát độc lập — phiên Antigravity mới

Hai lần khởi tạo `--mode plan` không trả báo cáo do quyền RunCommand trong chế độ không giao diện. Không dùng bỏ qua quyền. Lần cuối bỏ chế độ plan, tắt mở rộng slash command, cung cấp chính xác mọi đường dẫn ảnh và yêu cầu chỉ dùng công cụ đọc tệp/xem ảnh; đã nhận được báo cáo đầy đủ 9 chương. Phiếu: `phieu_soat_chi_doc_anh.md`; bản soát: `soat_doc_lap.md` (bản gốc ở thư mục sản phẩm/ban_nhap).

Kết quả phiên mới: **0 nặng, 0 vừa, 2 nhẹ, 7 đạt; “ĐẠT để chạy pha máy”**. Hai góp ý nhẹ giữ lại để Trung xét: C3 có nhiều số ở pha giữa dù không quá 12 từ; C8 hình tượng trang giấy đứng, chuyển động tập trung ở kính soi/dải hạt. Không có yêu cầu sửa nặng/vừa. Kết quả máy cuối vẫn 9/9 chương. **Chưa chạy pha máy, chờ Trung duyệt ảnh.**
