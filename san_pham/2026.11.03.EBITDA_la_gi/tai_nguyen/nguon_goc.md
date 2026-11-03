# N302 — EBITDA là gì và ý nghĩa trong đánh giá tài chính doanh nghiệp

## Trạng thái

Pha 1: đã có nguồn, kịch bản, giọng, hình chuyển động và 3 vòng ảnh tĩnh. Đã có bản soát độc lập Antigravity mới, kết quả 0 nặng, 0 vừa, 2 nhẹ; chờ Trung duyệt hình. Chưa có MP4 bản nháp; chưa tạo phiếu pha máy; chưa đăng hoặc đổi tên bản cuối.

Trung đồng ý riêng cho Codex trực tiếp làm video này ngày 03/11/2026; giữ mọi cổng hình, soát Antigravity mới và hai cửa duyệt.

## Thành phần

- Mã dựng: `xuong_html/n302_ebitda/`, HTML với `seek(t)` thuần theo thời gian.
- Tổ hợp: KB-02 · CL-14 mô phỏng hạt/khối giá trị · CT1 · BC-08 · MAU-21 navy/vàng · NH00 Close Up, Michael Ramir C. (Mixkit 1167).
- Nhạc không có lời; sổ kho không có cờ rè nặng; bài dài 95,1 giây, nối bốn lần với mờ chéo 4 giây. Nhạc chờ ghép khi pha máy, giảm 15 dB trong phiếu nhịp; còn phải kiểm bản ghép.
- Giọng VieNeu Quốc Tuấn, tốc độ đích 5,06 âm tiết/giây; 9 WAV, 75 câu và mốc từng từ. Sinh và nghe lại máy trong 189 giây.
- Thời lượng theo giọng: 324,269 giây (5:24), 1920×1080, dự kiến 30 khung/giây. Màn hình kết từ 314,269 giây, đúng lúc bắt đầu CTA, dài 10 giây.
- Khung/phụ đề/logo và toán vẽ kế thừa video mẫu n199; nhà xưởng từ kho. Mọi số là giả định, nguồn công thức tại `kich_ban/2026.11.03.ebitda_v1.nguon_kiem_chung.md`.

## Kiểm đã thực hiện

- 27 ảnh vòng 1, 27 ảnh vòng 2, 77 ảnh vòng 3; đã mở từng ô ở các lưới và ghi lỗi/sửa trong `SO_VONG_SUA.md`.
- Cổng máy: 9/9 chương, chuyển động 1,00, trung vị 5–12 từ, chữ nhỏ 0–9%; giữ nguyên ngưỡng.
- Quét 0,5 giây: 0 loại lỗi chữ đè, tràn, cỡ chữ, số từ; 0 lỗi JavaScript.
- Tương phản mỗi 2 giây, 162 mốc: 0 chữ dưới 4,5:1.
- 15 đối chiếu số học, CTA và thời lượng đúng; kiểm lời đọc 0 lỗi, 0 cảnh báo.
- Trang duyệt đã kiểm nạp giọng 324,3 giây, chọn chương, phát đồng bộ và đúng công thức tại 1:24; 0 lỗi JavaScript.

## Soát độc lập

Phiên mới Antigravity (Gemini 3.8 Flash High): 0 nặng, 0 vừa, 2 nhẹ (C3 nhiều số trung gian; C8 hình giấy tượng trưng), 7 chương đạt; kết luận “ĐẠT để chạy pha máy”. Bản gốc trong `ban_nhap/2026.11.03.ebitda_soat_doc_lap.md`; bản dễ mở ở `xuong_html/n302_ebitda/soat_doc_lap.md`. Trung vẫn phải duyệt ảnh trước khi tạo phiếu pha máy.

## Mở bản duyệt

`san_pham/2026.11.03.EBITDA_la_gi/2026.11.03.ebitda_duyet.html` — chọn chương hoặc phát giọng để xem hình. Đây là bản duyệt hình/lời, không phải video MP4 đã kết xuất. Dữ liệu tệp nằm trên máy, không xuất bản lên mạng.

Bản nghe: `tai_nguyen/ban_nhap/2026.11.03.ebitda_giong_duyet.m4a`.

## Để Trung xét khi duyệt

Nghe cách đọc EBITDA và câu 6 chương 7 (phép trừ tiền). Đối chiếu Whisper còn 7 cờ thô; sau quy về cách viết EBITDA và dấu % còn 1 cờ. Đây là kiểm bằng máy, chưa xác nhận bằng tai; xem `kich_ban/2026.11.03.ebitda_v1.kiem_giong.md`. Nhạc chưa ghép vào bản nghe duyệt.

## Dựng lại

```bash
bash xuong_html/n302_ebitda/n302_doc_giong.sh
python3 -I xuong_html/n302_ebitda/n302_tao_nhip.py
bash xuong_html/n302_ebitda/n302_noi_nhac.sh 324.269
node xuong_html/n302_ebitda/n302_anh_tinh.mjs --moi-cau --ra xuong_html/n302_ebitda/anh_tinh/v3
node scripts/do_chat_luong_hinh.mjs xuong_html/n302_ebitda --buoc 2
python3 xuong_html/n302_ebitda/n302_chuan_bi_tieng.py
python3 -I xuong_html/n302_ebitda/n302_tao_trang_duyet.py
```

Không chạy pha máy trước khi hoàn tất soát độc lập và Trung duyệt ảnh.
