# Sổ vòng sửa N301 (03/11/2026, đợt Antigravity)

Dựng bằng một trang HTML (LM-03): `trang.html`, `canh.js`.
Chủ đề: Vốn lưu động ròng là gì (Net Working Capital - NWC).
Lối viết: KB-02 (Giải ngố khái niệm).
Tổ hợp dựng: CL-14 mô phỏng và bề mặt toán · CT1 · BC-06 bảng kẻ lưới & đồ thị thẻ nổi toàn khung · MAU-58 · NH09.

## Giọng đọc (VieNeu Quốc Tuấn)
- Tốc độ: 5,06 âm tiết/giây theo cấu hình `tai_san/cau_hinh_giong.json`.
- Thuật ngữ "NWC": chuẩn hóa đọc thành "en đắp liu xi" trong `tai_san/giong_doc/tu_dien_doc/ngan_hang.json`.
- `scripts/kiem_loi_doc.py`: 0 lỗi, 0 cảnh báo.
- Tổng thời lượng: 308,031 giây (~5 phút 08 giây, 9.241 khung hình ở 30 fps).
- Màn hình kết 10 giây (298,031 – 308,031 giây) khớp đúng câu kêu gọi đăng ký kênh cuối cùng.

## Vòng 1 (Bản đầu bị lỗi slide thẻ chữ dày, đứng yên)
- Phiên bản đầu dựng thẻ chữ HTML, bảng chữ nhỏ và bố cục tĩnh.
- Chạy máy đo chất lượng hình `scripts/do_chat_luong_hinh.mjs`:
  - Kết quả: **0/8 chương đạt** (chuyển động 0.13–0.25 < 0.60; số từ 62–196 > 26; chữ nhỏ <26px chiếm 65–88% > 25%).
  - Lỗi: hình thành slide trình chiếu, nhiều chữ, người xem bị ngợp và mệt mắt, không có hình ảnh chuyển động biểu đạt số liệu.

## Vòng 2 (Tái thiết kế theo chuẩn hình video ngang)
- Nạp các khuôn tài sản tài chính từ `tai_san/kho_hinh_chung/ngan_hang/`: `khuon_bang_can_doi.js`, `khuon_vi_du_tinh_tien.js`, `chuoi_gia_tri.js`.
- Viết lại toàn bộ `canh.js` theo chuẩn hình ngang `chuan_hinh_video_ngang.md` và mã mẫu `n199`:
  - Mỗi chương 1 hình chính chuyển động liên tục:
    - C1: Bể chứa chất lỏng rút cạn tiền mặt kèm vòi rót hạt lợi nhuận rơi tự do bị kẹt công nợ.
    - C2: Cắt đôi bảng cân đối kế toán với dòng hạt tiền di chuyển theo quỹ đạo và dây đứt nhịp nhàng.
    - C3: Cân đối NWC = +20 đồng với sóng hào quang tỏa nhịp và luồng tiền kết nối.
    - C4: Tấm đệm thanh toán với bể nước đệm an toàn và bệ đỡ dập dềnh.
    - C5: Bẫy lấy ngắn nuôi dài với nhà máy và vầng hào quang báo động đỏ NWC âm rực sáng.
    - C6: Phân biệt NWC và WCR với quỹ đạo elip chu kỳ kinh doanh luân chuyển hạt vốn.
    - C7: Thẩm định tín dụng ngân hàng với luồng hạt xanh duyệt vay và cảnh báo đỏ.
    - C8: Ba nguyên tắc vàng với cân bập bênh quả lắc dao động nhịp nhàng.
  - Sân khấu có hiệu ứng thở camera đa tần (`sin(2pi*t/13) + sin(2pi*t/4.7)`).
  - Dải thanh trạng thái dưới (DAI) tại `y = 808..892` với 8 chấm chương phát sáng nhấp nháy theo tiến độ.
  - Máy đo `do_chat_luong_hinh.mjs`: 8/8 chương đạt chỉ số chuyển động 1.0, từ 15-25, chữ nhỏ 1-4%.
  - Tuy nhiên, `n301_quet_kiem.mjs` phát hiện: 31 cảnh báo tràn hộp (`tran_hop`), tràn khung hình ("Công ty B" do scale toà nhà 260x), và số từ vượt 12 từ trên màn hình.

## Vòng 3 (Tinh chỉnh triệt để: <=12 từ, 0 lỗi kiemTra, 0 pageerror)
- Khắc phục `co: 260` thành `co: 0.8` và xóa nhãn văn phòng mặc định cho `nha_xuong` và `toa_nha_ngan_hang`, loại bỏ hoàn toàn lỗi `tran_khung`.
- Mở rộng kích thước hộp `data-hop` (w: 500-620px), dùng ký hiệu tiền tệ ngắn gọn (`đ`, `tỷ`) tránh tràn hộp `tran_hop`.
- Điều phối nhịp thời gian xuất hiện: tiêu đề biến mất sau 1.2–3.5s trước khi các khối thẻ nội dung chính bước vào; các thẻ cũ biến mất khi thẻ mới xuất hiện.
- Kết quả kiểm định tự động:
  - `node xuong_html/n301_von_luu_dong_rong/n301_quet_kiem.mjs`: **xong: 0 loại lỗi kiemTra, 0 pageerror**.
  - `node scripts/do_chat_luong_hinh.mjs xuong_html/n301_von_luu_dong_rong --buoc 2`: **8/8 chương đạt** (thoát mã 0):
    - C1: chuyển động 1.00 · từ 10 · chữ nhỏ 7% → đạt
    - C2: chuyển động 1.00 · từ 6 · chữ nhỏ 2% → đạt
    - C3: chuyển động 1.00 · từ 9 · chữ nhỏ 2% → đạt
    - C4: chuyển động 1.00 · từ 7 · chữ nhỏ 2% → đạt
    - C5: chuyển động 1.00 · từ 11 · chữ nhỏ 2% → đạt
    - C6: chuyển động 1.00 · từ 10 · chữ nhỏ 2% → đạt
    - C7: chuyển động 1.00 · từ 8 · chữ nhỏ 2% → đạt
    - C8: chuyển động 1.00 · từ 9 · chữ nhỏ 2% → đạt

## Ảnh tĩnh và Ảnh lưới nghiệm thu
- Chụp toàn bộ 41 câu bằng `n301_anh_tinh.mjs --moi-cau`.
- Ghép ảnh lưới trình duyệt:
  - Lưới 1: `xuong_html/n301_von_luu_dong_rong/anh_tinh/n301_luoi_1.jpg` (c01_02, c02_04, c03_03, c04_02)
  - Lưới 2: `xuong_html/n301_von_luu_dong_rong/anh_tinh/n301_luoi_2.jpg` (c05_03, c06_03, c07_03, c08_02)
