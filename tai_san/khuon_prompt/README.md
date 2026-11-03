# Khuôn prompt dựng hình bằng mã

> Thư viện khuôn để Claude giao tác tử con dựng và chấm video bằng mã. Quy tắc và lý do nằm ở `07_khuon_prompt_va_kiem_chat_luong.md`; cách làm và chi phí nằm ở `05_cach_lam.md`. Thư mục này chứa khuôn đầy đủ và dữ liệu dài.
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Bản đầu, tạo cùng module 05 và 07 khi học phong cách từ repo `yihui-dev/awesome-opus5-5-videos`.

## Mục lục

| File | Dùng khi | Dùng với cách làm |
|---|---|---|
| `khuon_dung_html_mot_trang.md` | Giao Opus dựng một cảnh hoặc video bằng một trang HTML: khối đầu vào, hướng, cấu trúc nhịp, kỹ thuật `renderAt(t)`, khung cố định, hạt giống, lỗi hay gặp, cấm, cửa duyệt storyboard | LM-03; cũng dùng cho LM-04 (bỏ phần xuất bằng `xuat_mp4.mjs`) |
| `khuon_phan_bien.md` | Giao người phản biện độc lập chấm video theo thanh chất lượng: tờ ghép khung, số đo, danh sách lỗi xếp hạng, "GIAO" hoặc "THÊM MỘT LƯỢT" | LM-02, LM-03, LM-04 |
| `khuon_canh_threejs.md` | Dựng cảnh 3D bằng Three.js: ánh sáng ba điểm, vật liệu, máy quay, hậu kỳ, bảng lỗi hay gặp (bàn cờ tràn phụ đề, mặt đất cháy trắng, ô vuông ở cảnh nhìn xa, khung hỏng ngẫu nhiên) | LM-02, LM-03 |
| `khuon_am_thanh_tu_du_lieu.md` | Làm âm thanh khi Claude không nghe được: đo phách nhạc bằng số, đặt tiếng theo đỉnh đo được, hạ nhạc dưới giọng, chuẩn −14 LUFS, đoạn mã đặt tiếng | LM-02, LM-03, LM-04 |
| `huong_theo_chat_lieu.md` | Chép đoạn "hướng" viết sẵn cho từng chất liệu CL-01 đến CL-16 kèm mẫu nguồn, link prompt gốc, danh sách cấm theo chất liệu | Mọi cách làm có chọn chất liệu |
| `mau_prompt_dang_hoc.md` | Tra 25 prompt gốc đáng học: slug, link, tác giả, vì sao tốt, cấu trúc, trích ngắn | Học viết khuôn mới |

## Thứ tự dùng khi làm một video LM-03

1. `huong_theo_chat_lieu.md`: lấy đoạn hướng và danh sách cấm của chất liệu đã chọn.
2. `khuon_dung_html_mot_trang.md`: điền chỗ trống, kiểm 7 điều trước khi gửi; nếu có 3D thì ghép thêm `khuon_canh_threejs.md`.
3. Cửa duyệt storyboard, rồi dựng và xem trước (mục 4 đến 7 của module 07).
4. `khuon_phan_bien.md`: người phản biện độc lập chấm bản xuất.
5. `khuon_am_thanh_tu_du_lieu.md`: làm âm thanh và đo.
6. Soát theo `15_bang_kiem_truoc_khi_giao.md` rồi giao.

## Quy ước

- Chỗ trống trong khuôn viết `{{TEN_CHO_TRONG}}`.
- Tên khối `<role>`, `<inputs>`, `<direction>`, `<structure>`, `<build>`, `<gotchas>`, `<start>` giữ tiếng Anh (chỉ là dấu phân khối); nội dung tiếng Việt.
- Mọi khuôn có phiên bản và ngày ở đầu. Số đo thật ghi nguồn và ngày; số "đề xuất" là chưa hiệu chỉnh.
- Prompt gốc thuộc tác giả: không chép nguyên văn dài vào đây, chỉ link `https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/<slug>.md` và trích tối đa 20 chữ.
- Khi một khuôn được dùng cho video thật, ghi lại số đo (token, phút, lỗi còn lại) vào cuối file khuôn đó và vào `05_cach_lam.md`.
