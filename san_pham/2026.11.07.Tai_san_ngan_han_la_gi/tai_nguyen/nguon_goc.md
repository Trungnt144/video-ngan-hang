# N303 — Tài sản ngắn hạn là gì

## Trạng thái

Đã xong Pha 2 (bản nháp `_nhap` chờ Trung duyệt, ngày 07/11/2026): đã có nguồn kiểm chứng, kịch bản 4 chương, giọng VieNeu Quốc Tuấn, mã dựng HTML (`xuong_html/n303_tai_san_ngan_han/`), 4 vòng sửa ảnh tĩnh, qua cổng máy đo (`4/4 chương đạt`), qua cổng soát độc lập bằng phiên Antigravity mới (`0 Nặng · 2 Vừa · 1 Nhẹ · 1 Đạt`), kết xuất MP4 bản nháp bằng pha máy (`2566 khung`, `0 khung hỏng`, `-14.2 LUFS`), chữ đăng (`youtube.md`, `facebook.md`) và hình thu nhỏ (`hinh_thu_nho.json`). Chờ Trung duyệt bản nháp `_nhap` trước khi đổi thành bản cuối hoặc tải lên YouTube.

## Thành phần

- Mã dựng: `xuong_html/n303_tai_san_ngan_han/`, HTML với `seek(t)` thuần theo thời gian (`trang.html`, `canh.js`).
- Tổ hợp: `KB-02 · CL-05 · CT1 · BC-07 · MAU-33 · NH06` (nền sáng kem `#F4F7F5`, chữ đậm `#132620`, xanh ngọc đậm `#0F6E56`, cam đất `#C85A28`, đỏ cảnh báo `#A82828`).
- Nhạc nền: `NH06` — *Fluidity* (Tobylane, Pixabay `#100`, không lời), cắt `86,0 giây` có mờ vào `1,5s` và mờ ra `2,5s`, trộn ở `-16 dB`.
- Giọng đọc: VieNeu `Quốc Tuấn`, tốc độ đích `5,06` âm tiết/giây (`4 file WAV`, `13 câu`, đối chiếu Whisper sai chữ `2%`).
- Thời lượng bản nháp: `85,6 giây` (`1:26`, gồm `75,536 giây` nội dung 4 chương + `10 giây` màn hình kết kênh), khổ `1920×1080`, `30 khung/giây` (`2566 khung`).
- Bản nháp MP4 ngoài cùng thư mục sản phẩm: `san_pham/2026.11.07.Tai_san_ngan_han_la_gi/2026.11.07.tai_san_ngan_han_youtube_v1_nhap.mp4` (trùng byte với `xuong_html/n303_tai_san_ngan_han/out/pha_may/n303_du.mp4`).
- Mọi con số là ví dụ giả định (`100 tỷ`, `60 tỷ`, `40 tỷ`, `10 tỷ`, `20 tỷ`, `30 tỷ`, `25 tỷ`, `15 tỷ`), nguồn pháp lý hai nguồn khớp tại `tai_nguyen/kich_ban/2026.11.07.tai_san_ngan_han_v1.nguon_kiem_chung.md` (`Thông tư 99/2025/TT-BTC`, `VAS 21`, `Luật Các tổ chức tín dụng 32/2024/QH15` Điều 94).

## Kiểm đã thực hiện

- Kịch bản và lời đọc (`scripts/kiem_loi_doc.py`): `0 lỗi, 0 cảnh báo`.
- Ảnh tĩnh 4 vòng (`anh_tinh/v1` → `v4`, ghi chi tiết trong `xuong_html/n303_tai_san_ngan_han/SO_VONG_SUA.md`).
- Cổng máy đo hình (`node scripts/do_chat_luong_hinh.mjs xuong_html/n303_tai_san_ngan_han --buoc 2`): `4/4 chương đạt` (C1 `0,75`, C2 `1,00`, C3 `0,88`, C4 `1,00`; trung vị `5–8 từ`; chữ nhỏ `0%`).
- Máy quét chữ đè/tràn khung (`n303_quet_kiem.mjs`): `86 mốc (0–85s), 0 loại lỗi kiemTra, 0 pageerror`.
- Máy đo tương phản (`n303_tuong_phan.mjs --moi 2`): `43 mốc, 0 chữ dưới 4,5:1` (nhỏ nhất `4,78:1`).
- Soát độc lập bằng phiên Antigravity mới (`99ffbe0b-6985-4d93-a377-dc76055dd24f`, lưu tại `tai_nguyen/ban_nhap/tai_san_ngan_han_soat_doc_lap.md`): `0 Nặng · 2 Vừa · 1 Nhẹ · 1 Đạt` → `ĐẠT để chạy pha máy`.
- Báo cáo pha máy (`du_lieu/pha_may/bao_cao/n303.md`) & quét khung hỏng (`scripts/quet_khung_hong.py`): `2566 khung`, `0 khung hỏng`, độ to `-14,2 LUFS`, đỉnh `-2,9 dBTP`, `0 cảnh báo`.

## Để Trung xét khi duyệt

- Nghe kiểm tra câu 2 chương 1 (`Thông tư chín mươi chín năm hai nghìn không trăm hai mươi lăm`) và câu 1 chương 4 (`Luật Các tổ chức tín dụng năm hai nghìn không trăm hai mươi tư`). Đối chiếu Whisper chỉ có 1 từ lệch nhỏ ở chương 3 (`nổi` → `nội` trong cụm `không trả nổi hai mươi lăm tỷ đồng nợ đến hạn`), nghe thực tế rõ chữ.
- Xem bản nháp MP4 (`2026.11.07.tai_san_ngan_han_youtube_v1_nhap.mp4`), hình thu nhỏ (`2026.11.07.tai_san_ngan_han_hinh_thu_nho_v1.jpg`) và chữ đăng (`tai_nguyen/dang_bai/youtube.md`, `facebook.md`).

## Dựng lại

```bash
bash xuong_html/n303_tai_san_ngan_han/n303_doc_giong.sh
python3 -I xuong_html/n303_tai_san_ngan_han/n303_tao_nhip.py
bash xuong_html/n303_tai_san_ngan_han/n303_noi_nhac.sh
node xuong_html/n303_tai_san_ngan_han/n303_anh_tinh.mjs --moi-cau --ra xuong_html/n303_tai_san_ngan_han/anh_tinh/v4
node scripts/do_chat_luong_hinh.mjs xuong_html/n303_tai_san_ngan_han --buoc 2
node scripts/pha_may/pha_may.mjs tao n303 xuong_html/n303_tai_san_ngan_han --san-pham san_pham/2026.11.07.Tai_san_ngan_han_la_gi
node scripts/pha_may/pha_may.mjs chay --chi n303 --khong-bao
```
