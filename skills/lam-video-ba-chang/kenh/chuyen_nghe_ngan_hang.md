# Khuôn kênh Chuyện nghề Ngân hàng

> Skill `lam-video-ba-chang`. Phần riêng của kênh; mọi tác tử đọc khi lời nhắn ghi kênh này. Gom từ lời giao chạy thử mục 0a, 0b, 2 (04/11/2026) và số đo lô 11 (05/11/2026). Quy tắc chung không riêng kênh ở `tham_chieu/quy_tac_chung.md`.

## Nội dung

- Kênh Chuyện nghề Ngân hàng, video ngang 1920×1080 có thuyết minh, LM-03 (trang HTML), loạt thuật ngữ ngân hàng, nhóm nhập môn: người mới, khách cá nhân.
- Độ dài 4–6 phút kể cả 10 giây màn hình kết, 8–12 chương, lối viết KB-02 (đổi được nếu có lý do, ghi lý do). Mở đầu 3 giây bằng tình huống đời thường hoặc câu hỏi có số (ví dụ giả định), không mở bằng định nghĩa. Mỗi thuật ngữ nói kèm một câu nghĩa đời thường. Khái niệm đã có video riêng (dòng "Trùng với video đã làm" của sổ nợ) chỉ nói một hai câu. Không trỏ sang video khác trong lời đọc, phụ đề, chữ trên hình.
- Giọng VieNeu Quốc Tuấn, 5,06 âm tiết mỗi giây. Câu cuối đúng nguyên văn ở cả `text` và `doc`: "Đăng ký kênh Chuyện nghề Ngân hàng để biết thêm nhiều nội dung thú vị về ngân hàng và đi vay." Màn hình kết 10 giây bắt đầu đúng lúc câu này bắt đầu.
- Nguồn: văn bản pháp luật công khai đang hiệu lực tới ngày làm, đọc nguyên văn điều khoản trên trang chính thức (vbpl.vn, thuvienphapluat.vn, sbv.gov.vn, congbao.chinhphu.vn, chinhphu.vn); kho `~/Documents/Grok/PhapLy/van_ban/` (chỉ mục `~/Documents/Grok/PhapLy/01_kho_van_ban.md`) đọc được trước. Văn bản sắp hết hiệu lực hoặc có bản thay thế đã ký: ghi ngày, nói đúng thì. Hai nguồn độc lập cho mỗi số trên hình: `tham_chieu/quy_tac_chung.md` mục 3. So sánh ngân hàng chỉ theo nhóm (nhà nước, cổ phần lớn, cổ phần vừa và nhỏ), dạng khoảng.
- Cách đọc: thuật ngữ, chữ viết tắt quốc tế đọc theo Cambridge giọng Mỹ, đọc nhanh, liền mạch, theo từ điển `tai_san/giong_doc/tu_dien_doc/ngan_hang.json` (chữ có W viết "đắp-liu", có R viết "ar"); năm trong số hiệu văn bản đọc gọn ("hai nghìn hai mươi tư"); số viết bằng chữ trong `doc`; chữ "nộp" không đứng đầu câu.
- Bộ màu `KHO.datMau('MAU-xx')` chỉ lấy màu, không tên ngân hàng. Nhạc: tránh bài đã dùng ở 6 video gần nhất của kênh (dòng NH ở đầu kịch bản hoặc `nguon_goc.md`; luật lô 11). Danh sách cố định cũ của lô N196–N205 (NH16, NH10, NH05, NH15, NH00, NH30, NH23, NH07, NH54, NH67, NH31, NH08, NH11, NH12, NH50, NH06, NH44, NH13, NH09, NH29, NH57, NH14) chỉ còn để tra; mười video ba chặng đã dùng NH37, NH19, NH62, NH59 và các bài lô 11 ghi trong `nguon_goc.md`. Chọn bằng `python3 scripts/goi_y_to_hop_dung.py --kho ngang --kb KB-02 --linh-vuc tai_chinh --do-dai 300 --cach-lam LM-03`; rè 16 kHz chấp nhận tới khoảng 7 (tiền lệ N203, N199), ghi lý do.
- Kiểm ẩn danh: chặng A chạy `python3 -I scripts/kiem_an_danh_kich_ban.py "<thư mục kich_ban>"` tới "Vi phạm: 0" (áp từ lô N206–N221; kênh nói về ngân hàng nên giữ cho mọi video). Không đọc file `_noi_bo`, `RM MB/khach_hang/`, quy chế, quy trình nội bộ.

## Khuôn kịch bản

Khuôn kịch bản N200: `san_pham/2026.11.02.Tờ khai VAT là gì, vai trò trong việc kiểm tra hồ sơ tài chính doanh nghiệp/tai_nguyen/kich_ban/2026.11.02.to_khai_vat_v1.*` (MK-14 "Mổ xẻ một tờ giấy", KB-02: mở bằng tình huống hồ sơ có số giả định; giấy tờ là gì, nghĩa đời thường; các phần chính; ngân hàng đọc, kiểm gì trong hồ sơ; lưu ý cho doanh nghiệp đi vay).

## Khuôn trang và tổ hợp

Hai khuôn trang đã dùng ở N207–N221, xen kẽ để hai video liền nhau khác nhau; CT1. Khuôn n210 không có `SO_VONG_SUA.md`: mục "khuôn trang", "logo", "phụ đề", "màn hình kết" đọc ở `xuong_html/n204_nghiep_vu_tin_dung_doanh_nghiep/SO_VONG_SUA.md` (khuôn gốc của n210); khuôn n200 có file riêng.

| CL · BC | Khuôn trang (chép `trang.html`, `<mã>_tao_nhip.py`, `<mã>_noi_nhac.sh`, `thu_vien/`) | Video đã dùng tổ hợp này |
|---|---|---|
| CL-05 · BC-10 (đồ thị SVG, tiêu đề hai dòng và một biểu đồ) | `xuong_html/n200_to_khai_vat/` | N207, N214, N217, N215, N221 |
| CL-16 · BC-07 (giao diện và thẻ nổi; chia đôi khung được, mẫu N213) | `xuong_html/n210_tham_dinh_phe_duyet_dtm_kcn/` | N210, N213, N216, N211, N212 |

## Bảng màu

Bảng màu ngân hàng MAU-62, MAU-63, MAU-65 tới MAU-69 đã dùng ở N207–N217; bỏ MAU-64 (màu một ngân hàng cùng tập đoàn với nơi Trung làm). MAU-36 (màu MB) được dùng: Trung chốt 29/10/2026 ("được dùng cả màu MB", ghi chú của `tai_san/so_tay_gu/mau_kich_ban.json`) và xác nhận 05/11/2026; phiên giữ lô 11 từng tự bỏ MAU-36, từ nay không bỏ. Chỉ lấy màu, không logo, không tên MB. Hết bảng màu ngân hàng thì phiên giữ lô chọn theo các mục `_ghi_chu_*` của `tai_san/so_tay_gu/mau_kich_ban.json` và ghi lý do (lô 11: N215 MAU-45, N212 MAU-54, N221 MAU-55), tránh màu của hai video liền trước.

## Danh sách phát

Kênh có 15 danh sách phát (Trung chốt 02/11/2026; skill `dang-youtube` mục "Danh sách phát"), cấu hình `du_lieu/dang_youtube/danh_sach_phat_ngan_hang.json`. Chặng C ghi mã danh sách đề nghị vào file chặng; không sửa file cấu hình (thêm lúc đăng).
