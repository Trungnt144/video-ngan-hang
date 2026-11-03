# Chân mô tả cố định

Đoạn chữ dán vào cuối mô tả YouTube video dài, sau dòng hashtag (Trung chốt 29/10/2026 theo mẫu một kênh đủ thông tin: đoạn văn, hashtag, rồi chân mô tả). Logo YouTube, Facebook cạnh link do YouTube tự hiện khi link trỏ tới các mạng xã hội đó; chỉ cần dán đúng địa chỉ. Link Facebook phải là `facebook.com/<tên hoặc số Trang>`: dạng `profile.php?id=` chỉ hiện chữ thường, không có logo (kiểm trên trang video ngày 29/10/2026). Tên Trang Trung đặt 29/10/2026: Chuyện nghề Điện `facebook.com/chuyennghedien1` (số 61596085044064), Chuyện nghề Ngân hàng `facebook.com/chuyennghenganhang` (số 61595777890962; khối chân mô tả trên là của kênh Điện). TikTok thêm khi kênh TikTok có địa chỉ: dòng `🔹 TikTok: https://www.tiktok.com/@<tên>`. Trung đưa nội dung ở lần chạy đầu; khi đoạn dưới còn trống, Claude hỏi Trung một lần bằng bảng chọn rồi ghi vào đây. Không đặt liên kết tới tài liệu nội bộ, không dùng tên hay nhận diện MB.

Mỗi kênh một khối: `chan_mo_ta` là kênh Điện, `chan_mo_ta_<kênh>` là kênh khác (mã kênh trùng trường `kenh` trong khối `thong_tin` của `youtube.md` hoặc trong `dang_bai/hinh_thu_nho.json`). Script chọn khối theo kênh của video.

Kênh: Chuyện nghề Điện (mã kênh `UCMo-VX6bf8_SNu8tUa5wiMw`).

```text chan_mo_ta
Xem thêm những thông tin thú vị về ngành điện tại:
🔹 YouTube: https://www.youtube.com/@chuyennghedien1
🔹 Facebook: https://www.facebook.com/chuyennghedien1
```

Kênh: Chuyện nghề Ngân hàng (mã `ngan_hang`; địa chỉ YouTube Trung đưa 30/10/2026, mã kênh chưa ghi). Dùng cho cả mô tả YouTube và chú thích Facebook của kênh này (`quy_tac_kenh_ngan_hang.md`).

```text chan_mo_ta_ngan_hang
Xem thêm những thông tin thú vị về ngân hàng và đi vay tại:
🔹 YouTube: https://www.youtube.com/@chuyennghenganhang
🔹 Facebook: https://www.facebook.com/chuyennghenganhang
```
