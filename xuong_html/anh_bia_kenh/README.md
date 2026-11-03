# Ảnh bìa kênh YouTube

Dựng ảnh bìa (banner) 2560×1440 cho kênh YouTube từ ảnh thật: một ảnh làm nền cả khung, sáu ảnh nhà máy xếp ba tấm mỗi bên, mép nghiêng hoà mờ vào nhau, tên kênh đặt ở khoảng giữa. Giữ màu gốc từng ảnh: chỉ cân mức sáng chung, tăng độ tươi, thêm toả sáng và đường sáng mảnh ở các mép ghép.

Làm lần đầu 28/10/2026 cho kênh Chuyện nghề Điện (Trung chốt qua bảng chọn: tên lớn "CHUYỆN NGHỀ ĐIỆN" kèm tia sét; coi là phần chuẩn bị kênh, giai đoạn 2 vẫn tắt). Ba lượt chỉnh trong ngày, bản cũ ở `san_pham/2026.10.28.anh_bia_kenh_chuyen_nghe_dien/tai_nguyen/phien_ban_cu/`: v1 tông hoàng hôn xanh ngọc – cam và chữ "của tôi"; v2 phủ tông xanh dương, Trung chê xanh quá nhiều, lấn át màu ảnh gốc; v3 giữ màu gốc (bản hiện hành). Bài học: không ánh xạ màu cả khung sang một tông; muốn đồng điệu thì cân độ sáng và độ tươi, không thay màu.

Cùng thư mục còn có bộ dựng ảnh đại diện kênh 800×800 (`ghep_dai_dien.py`, `khuon_dai_dien.html`, `xuat_dai_dien.mjs`): `python3 ghep_dai_dien.py && node xuat_dai_dien.mjs <ra.jpg>`. Ảnh bìa đặt lên kênh bằng `skills/dang-youtube/scripts/dat_anh_bia_kenh.py`; ảnh đại diện phải tải tay qua YouTube Studio vì API không hỗ trợ.

Ảnh bìa Facebook (1640×624, Trang "Chuyện nghề Điện"): `python3 ghep_nen.py && python3 ghep_bia_facebook.py && node xuat_bia.mjs <ra.jpg> --facebook` (cắt từ nền YouTube, chữ thu 0,5 lần đặt nửa trên giữa khung). **Thiết kế cho app điện thoại trước** (Trung 29/10/2026: người dùng chủ yếu xem bằng điện thoại): app che ảnh bìa bằng ảnh đại diện tròn (x 619–1009, y từ 303), thanh trạng thái tới y≈115, nút chia sẻ, tìm kiếm, thêm ở x≈1012–1204, y 173–227, và phủ lớp tối mờ phía trên; chữ chỉ đặt trong x 440–975, y 120–300. Kiểm bằng `python3 mo_phong_facebook.py <ảnh bìa> <ảnh đại diện> <ra.jpg>` (mô phỏng app, đã so với ảnh chụp thật) và `node xuat_bia.mjs <ra.jpg> --facebook --guide` (vẽ khung các vùng). Ảnh đại diện Facebook dùng lại ảnh đại diện YouTube bằng liên kết cứng.

## Dựng lại

```bash
cd xuong_html/anh_bia_kenh
python3 ghep_nen.py                                   # nền: nen_2560x1440.png (ngoài git)
node xuat_bia.mjs ../../san_pham/<thư mục>/<tên>.jpg  # thêm chữ, chụp JPG 2560×1440
node xuat_bia.mjs <ra.jpg> --guide                    # bản kiểm có khung vùng an toàn, không dùng để đăng
```

Cần mạng để tải phông Anton, Nunito từ Google Fonts khi chụp. Chromium dùng chung với `../cong_cu/`.

## Muốn đổi gì thì sửa chỗ nào

| Việc | Chỗ sửa |
|---|---|
| Đổi ảnh, vị trí cắt ảnh, thứ tự các tấm | `TRAI`, `PHAI`, `NEN` ở đầu `ghep_nen.py` (`b0`, `b1` là biên tấm tại y=720; `fx`, `fy` điểm giữ lại trên ảnh gốc; `hh` chiều cao ảnh khi vẽ) |
| Đổi độ sáng, độ tươi, màu pha vùng tối | `DO_SANG`, `BONG`, `TOI` và hàm `chinh_mau` trong `ghep_nen.py` (nền truyền tải có thông số riêng ở `ve_nen`) |
| Đổi toả sáng, đường sáng ở mép ghép, nắng chân trời, độ tối viền | hàm `hoan_thien`, `duong_sang` trong `ghep_nen.py` |
| Đổi chữ, cỡ chữ, biểu tượng tia sét | `khuon_bia.html` |

## Quy tắc khổ YouTube (đã áp)

- Khổ 2560×1440, JPG dưới 6 MB (YouTube nhận tối thiểu 2048×1152).
- Vùng an toàn mọi thiết bị: 1546×423 ở giữa (x 507–2053, y 508–931). Chữ chính nằm trọn trong vùng này. Máy tính để bàn thấy dải 2560×423 giữa khung, TV thấy cả khung.
- Ảnh chỉ lấy từ `tai_san/anh_that/` loại "được dùng khi đăng" (Pexels, không cần ghi công); ghi mã ảnh ở `san_pham/<thư mục>/tai_nguyen/nguon_goc.md`.
