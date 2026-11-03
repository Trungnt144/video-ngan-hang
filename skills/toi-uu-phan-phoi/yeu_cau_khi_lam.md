# Yêu cầu phân phối áp vào từng bước làm video

> Lập 29/10/2026. Mỗi yêu cầu có lý do ở `tieu_chi_nen_tang.md` (số mục ghi trong ngoặc). Bước theo `01_quy_trinh_chung.md` mục 2 (luồng 10 bước).
> Đọc đúng phần của bước đang làm, không đọc cả file. Yêu cầu nào trùng với module khác thì module đó là nguồn, file này chỉ nhắc.

## Bước 0–1: làm rõ yêu cầu, nguồn

- Chốt nơi đăng ngay từ đầu: bản ngang YouTube là bản gốc; có làm bản dọc cho Shorts, TikTok, Facebook không. Có bản dọc thì kịch bản ngang phải có ít nhất một chương đứng riêng được (`00_tam_nhin_va_muc_tieu.md` mục 4).
- Chọn từ khoá chính bằng cách người xem sẽ gõ tìm (dùng `san-trend` hoặc vidIQ theo `14_rada_xu_huong.md` mục 8). Ghi vào đầu kịch bản dòng `Từ khoá chính: …`. Chủ đề nên trả lời một câu hỏi người xem tìm lâu dài, để video còn người xem từ tìm kiếm sau nhiều tháng (2.17).
- Kênh tài chính, vĩ mô: mọi số có nguồn (quy tắc cứng 3); không để giọng hoặc nhân vật AI đưa lời khuyên tài chính cá nhân (2.1, YouTube không cho kiếm tiền loại này).

## Bước 3: viết kịch bản

- **Câu đầu (3 giây đầu)** nói thẳng điều người xem sẽ biết, có từ khoá chính; không chào hỏi, không giới thiệu kênh (2.6, 1).
- Mỗi chương mở bằng câu nêu chủ đề chương, để cắt thành bản dọc không phải viết lại (2.13).
- Video dài 3–5 phút là quy ước xưởng; độ dài theo lượng nội dung thật, không kéo dài để đủ phút (2.2).
- Không dùng một khuôn câu chữ giống hệt giữa các video trong lô; biến tấu theo `04_he_truc_dung.md` mục chống nhàm chán (2.1).
- Có bản dọc: viết sẵn trong kịch bản đoạn dọc 30–60 giây gồm câu mở 3 giây riêng cho bản dọc và câu cuối "video đầy đủ ở liên kết phía trên tiêu đề" (2.13). Bản Facebook qua API tối đa 90 giây (2.2).

## Bước 4–5: chọn tổ hợp và dựng

- Không lặp cùng nhạc nền và cùng kiểu hình AI trên nhiều video liền nhau (2.1, chính sách rác YouTube).
- Chữ trên hình: dòng chữ lớn đầu tiên chứa từ khoá chính; không chèn hàng chữ nhỏ chỉ để nhồi từ khoá (2.6).
- Phụ đề cứng tiếng Việt cho bản dọc (người xem tắt tiếng). Bản ngang: phụ đề theo `08_giong_am_thanh_phu_de.md`.
- Bản dọc: chữ và vật chính nằm trong vùng giữa, chừa trên khoảng 250 điểm ảnh và dưới khoảng 400 điểm ảnh của khung 1080×1920 cho thanh nút của ứng dụng (KN, khoảng phổ biến; kiểm lại trên điện thoại khi có bản dọc đầu tiên). Hai bên: ứng dụng Facebook trên điện thoại màn hình cao phóng video cho đầy màn hình và cắt khoảng 60 điểm ảnh mỗi bên (đo 02/11/2026 trên ảnh chụp Reels của Trung), nên chữ và hình chính nằm trong x 90–990.
- Nhạc: chỉ dùng nhạc trong `tai_san/nhac_nen/` có giấy phép mọi nền tảng, không dùng thư viện nhạc của một nền tảng cho bản đăng nơi khác (2.4).
- Ghi vào `tai_nguyen/nguon_goc.md` loại cảnh có trong video: clip AI tả thực, Blender Cycles, giọng VieNeu. Bước đăng dựa vào đó để bật nhãn AI đúng nơi (2.18).

## Bước 6–7: xuất bản nháp, bản cuối

Thông số xuất theo nơi đăng (2.3); `kiem_dang.py` kiểm lại bằng máy:

| Bản | Khổ | Khung/giây | Mã hoá | Tiếng | Độ dài |
|---|---|---|---|---|---|
| YouTube dài | 1920×1080 | 30 hoặc 60 | H.264 | AAC 48 kHz | theo nội dung, quy ước 3–5 phút |
| Shorts, TikTok, Facebook (một file dọc dùng chung bằng `ln`) | 1080×1920 | 30 (24–60 đều được) | H.264, yuv420p | AAC 48 kHz, từ 128 kbps | 30–60 giây; Facebook qua API tối đa 90; Shorts tối đa 180 |

- Bản dọc không mang hình mờ, logo nơi khác (2.3).
- Sau khi xuất bản cuối: chạy `kiem_dang.py <thư mục video>` (SKILL.md phần B) trước khi chuyển sang viết chữ đăng.

## Bước 8: chuẩn bị đăng

- Chữ đăng: skill `viet-chu-dang-video`. Hình thu nhỏ: `tai_san/so_tay_gu/cong_thuc_hinh_thu_nho.md`.
- Chạy `kiem_dang.py` lần cuối; xử hết dòng LỖI; đọc bảng việc tay script in ra.
- Giờ đăng: theo `tieu_chi_nen_tang.md` 2.14 (kênh chưa có số liệu thì giữ một giờ cố định mỗi kênh). Lô nhiều video: rải mỗi kênh 1 video dài mỗi ngày (2.15).

## Sau khi đăng (bước 9 và các lần sau)

- Ngay sau khi Shorts công khai: đặt "Video liên quan" về bản ngang trong YouTube Studio (API không đặt được) (2.13).
- Video dài có từ 1 tuần số liệu: cân nhắc Test & Compare 2–3 hình thu nhỏ (2.5).
- Sau 7 ngày và 28 ngày: chạy `hoc_ket_qua.py` (SKILL.md phần D) để ghi kết quả và rút bài học.
