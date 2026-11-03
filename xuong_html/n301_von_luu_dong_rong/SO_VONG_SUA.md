# Sổ vòng sửa N301 (03/11/2026, đợt Antigravity)

Dựng bằng một trang HTML (LM-03): `trang.html`, `canh.js`.
Chủ đề: Vốn lưu động ròng là gì (Net Working Capital - NWC).
Lối viết: KB-02 (Giải ngố khái niệm).
Tổ hợp: CL-14 mô phỏng và bề mặt toán · CT1 · BC-06 bảng kẻ lưới & đồ thị thẻ nổi toàn khung · MAU-22 thẻ sáng viền xanh navy `#0B46A2`, xanh ngọc `#059669`, cảnh báo đỏ `#DC2626` (chỉ lấy màu, không tên, không logo ngân hàng) · NH09.

## Giọng đọc (VieNeu Quốc Tuấn)
- Tốc độ: 5,06 âm tiết/giây theo cấu hình `tai_san/cau_hinh_giong.json`.
- Thuật ngữ "NWC": chuẩn hóa đọc thành "en đắp liu xi" trong `tai_san/giong_doc/tu_dien_doc/ngan_hang.json`.
- `scripts/kiem_loi_doc.py`: 0 lỗi, 0 cảnh báo.
- Tổng thời lượng: 308,031 giây (~5 phút 08 giây, 9.241 khung hình ở 30 fps).
- Màn hình kết 10 giây (298,031 – 308,031 giây) khớp đúng câu kêu gọi đăng ký kênh cuối cùng.

## Vòng 1 (Khởi tạo mã và đồng bộ nhịp)
- Khởi tạo cấu trúc `canh.js` gồm 8 cảnh cho 8 chương kịch bản.
- Sửa lỗi hàm gọi logo kênh: chuyển sang `K.logo_goc` và `K.man_hinh_ket_kenh`.
- Khắc phục `textContent` trong hàm tạo thẻ `hm()`: tự động xử lý chuỗi mẫu HTML thành các thẻ con DOM và cập nhật `white-space: normal` cho các khối văn bản dài trong thẻ `.hop`.

## Vòng 2 (Tự soát tự động bằng công cụ)
- `node xuong_html/n301_von_luu_dong_rong/n301_quet_kiem.mjs`: quét toàn bộ timeline từ 0 đến 308 giây mỗi 0,5 giây. Kết quả: **0 loại lỗi kiemTra, 0 pageerror**.
- Không có lỗi chữ đè chữ, không tràn khung, không có chữ vi phạm dải phụ đề dưới (y > 900).
- `node xuong_html/n301_von_luu_dong_rong/n301_tuong_phan.mjs --moi 20`: kiểm tra độ tương phản vật chính và chữ, đạt tiêu chuẩn tương phản hiển thị tài chính rõ ràng trên nền sáng.

## Ảnh tĩnh và Ảnh lưới trình duyệt
- Chụp toàn bộ 41 câu bằng `n301_anh_tinh.mjs --moi-cau`.
- Ghép ảnh lưới trình Trung duyệt:
  - Lưới 1: `xuong_html/n301_von_luu_dong_rong/anh_tinh/n301_luoi_1.jpg` (c01_02, c02_04, c03_03, c04_04)
  - Lưới 2: `xuong_html/n301_von_luu_dong_rong/anh_tinh/n301_luoi_2.jpg` (c05_05, c06_03, c07_03, c08_03)
