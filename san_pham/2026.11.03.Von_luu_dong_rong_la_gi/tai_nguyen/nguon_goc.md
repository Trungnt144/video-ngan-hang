# Nguồn gốc: Vốn lưu động ròng là gì

- **Mã sổ nợ:** N301
- **Trạng thái:** Bản nháp chờ Trung duyệt (2026-11-03)
- **Kênh:** Chuyện nghề Ngân hàng
- **Thời lượng:** 308,1 giây (5 phút 08 giây) · 9.241 khung hình ở 30 fps · 1920×1080
- **Tệp xuất:** `san_pham/2026.11.03.Von_luu_dong_rong_la_gi/2026.11.03.von_luu_dong_rong_v1_nhap.mp4`

## Tổ hợp dựng
- **Cách làm:** LM-03 (Một trang HTML xuất MP4 qua Playwright và FFmpeg)
- **Mã dựng:** `xuong_html/n301_von_luu_dong_rong/`
- **Lối viết:** KB-02 (Giải ngố khái niệm)
- **Chất liệu:** CL-14 (Mô phỏng đồ họa và bề mặt toán tài chính)
- **Bố cục:** BC-06 (Bảng kẻ lưới & đồ thị thẻ nổi toàn khung)
- **Bộ màu:** MAU-22 (Thẻ sáng nền `#F0F6FA`, viền xanh navy `#0B46A2`, xanh lục an toàn `#059669`, cảnh báo đỏ `#DC2626`, chỉ màu không thương hiệu)
- **Âm nhạc:** NH09 (`tai_san/nhac_nen/NH09_lofi_nhe_nhang.mp3`) nối dài 320 giây, âm lượng -10 dB so với giọng đọc, độ to tích hợp -14.2 LUFS.
- **Giọng đọc:** VieNeu-TTS "Quốc Tuấn", tốc độ 5,06 âm tiết/giây, chuẩn hóa "NWC" -> "en đắp liu xi".

## Nguồn tài liệu & Pháp lý
- Thông tư 200/2014/TT-BTC (Điều 112 Bảng cân đối kế toán)
- Chuẩn mực kế toán Việt Nam VAS 21 (Trình bày Báo cáo tài chính)
- Luật Các tổ chức tín dụng số 32/2024/QH15 (Điều 102 - Chấm dứt cấp tín dụng, thu hồi nợ, chuyển nợ quá hạn do dùng vốn sai mục đích)
- Thông tư 39/2016/TT-NHNN, Thông tư 06/2023/TT-NHNN và Thông tư 12/2024/TT-NHNN về hoạt động cho vay của TCTD

## Lệnh dựng lại
```bash
# 1. Đồng bộ nhịp và thời gian
python3 -I xuong_html/n301_von_luu_dong_rong/n301_tao_nhip.py

# 2. Tạo phiếu và chạy pha máy
node scripts/pha_may/pha_may.mjs tao n301 xuong_html/n301_von_luu_dong_rong --san-pham "san_pham/2026.11.03.Von_luu_dong_rong_la_gi"
node scripts/pha_may/pha_may.mjs chay --chi n301 --khong-bao

# 3. Quét khung hỏng và sao chép bản nháp
.venv_vieneu/bin/python scripts/quet_khung_hong.py xuong_html/n301_von_luu_dong_rong/out/pha_may/n301_du.mp4
cp xuong_html/n301_von_luu_dong_rong/out/pha_may/n301_du.mp4 san_pham/2026.11.03.Von_luu_dong_rong_la_gi/2026.11.03.von_luu_dong_rong_v1_nhap.mp4
```

## Để Trung xét khi duyệt
1. Phát âm chữ viết tắt "NWC" ("en đắp liu xi") ở câu 1 chương 1 và xuyên suốt video nghe có tự nhiên và rõ ràng không.
2. Mô hình chuyển động của Bảng cân đối kế toán ở chương 2 và hai cách tiếp cận tính toán NWC ở chương 3 có truyền tải mạch lạc cho người mới không.
3. Phần minh họa cạm bẫy "lấy ngắn nuôi dài" ở chương 5 và quan điểm thẩm định của ngân hàng ở chương 7.
