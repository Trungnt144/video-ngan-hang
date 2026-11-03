# Học từ repo awesome-opus5-5-videos (27/10/2026)

> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Dữ liệu nguồn của thư viện thủ pháp (`tai_san/thu_phap/`) và của các giá trị mới trên hệ trục dựng (chất liệu CL-09 đến CL-16, bố cục BC-08 đến BC-13, tông màu từ MAU-20). Cách dùng ở `06_thu_phap_va_hieu_ung.md` và `11_hoc_phong_cach_tu_mau.md`.

## 1. Nguồn

- Repo: `yihui-dev/awesome-opus5-5-videos` trên GitHub (https://github.com/yihui-dev/awesome-opus5-5-videos), bộ sưu tập 703 prompt và video do người dùng làm bằng Claude Opus 5.5.
- Giấy phép: repo ghi giấy phép MIT (theo bản chỉ đạo thiết kế lại Media ngày 27/10/2026; chưa đọc lại file giấy phép gốc trong lần học này).
- Quyền sở hữu: video và prompt thuộc tác giả từng bài (cột tác giả trong `muc_da_cham.json`, trường `author`). Giấy phép MIT của repo không làm cho nội dung từng prompt hay video thành của Media.
- Link gốc theo mẫu (thay `<slug>` bằng mã mục):
  - prompt: `https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/<slug>.md`
  - video gốc: `https://media.skillry.dev/opus-5-5/<slug>/original.mp4`
  - bản làm lại: `https://media.skillry.dev/opus-5-5/<slug>/remake.mp4`
- Quy tắc của Media: không tải video của tác giả vào git, không chép nguyên văn prompt dài (trích tối đa 20 chữ, phần còn lại trỏ link). Thư mục này không chứa nội dung prompt và không chứa video.

## 2. Cách học đã làm (ngày 27/10/2026)

Trung chốt phạm vi học qua bảng chọn ngày 27/10/2026: ghi nhận toàn bộ tính năng, prompt, kỹ thuật, phong cách, tông màu, hoạt hoạ, hiệu ứng chuyển động và 3D; học 100 mục nêu bật chấm bằng hình cộng quét chữ toàn bộ 703 prompt. Các bước đã làm:

1. Chọn 100 mục nêu bật trong repo (58 nhóm motion, 16 giải thích, 14 ba chiều, 12 tương tác theo phân nhóm của repo).
2. Chấm bằng hình: lấy video gốc tạm ngoài git, cắt thành dải khung hình, tác tử con xem dải khung và đọc prompt rồi điền hồ sơ mỗi mục (thành phẩm, phong cách, họ, thủ pháp đáng học, đầu vào cần có, rủi ro, độ khó, tải máy, điểm hợp Media 0–3). Làm theo hai đợt: 74 mục đầu, rồi 26 mục ba chiều và trò chơi.
3. Quét chữ toàn bộ 703 prompt theo sáu khoá (công cụ xuất, kỹ thuật hình, âm thanh, quy trình, cách viết prompt, phong cách tham chiếu), do hai tác tử quét, mỗi tác tử một nửa số prompt (lô a và lô b).
4. Gom thủ pháp: 317 dòng `thu_phap_dang_hoc` của 100 mục cộng khoá `ky_thuat_hinh` và `am_thanh` của hai lô quét chữ, gộp dòng trùng ý, bỏ dòng chỉ là tên thương hiệu, ra 109 thủ pháp ở `tai_san/thu_phap/thu_vien_thu_phap.json`.

## 3. Số mục

| Dữ liệu | Số lượng |
|---|---|
| Prompt trong repo, được quét chữ | 703 |
| Mục đã chấm bằng hình (`muc_da_cham.json`) | 100 (tổng thời lượng video gốc khoảng 105 phút) |
| Điểm hợp Media | 3 điểm: 18 mục; 2 điểm: 34; 1 điểm: 44; 0 điểm: 4 |
| Mục tác tử con đánh giá dùng làm mẫu được | 70 trong 100 (trường `dung_lam_mau`) |
| Dòng thủ pháp thô trong 100 mục | 317 |
| Mục quét chữ (`quet_chu_703.json`, hai lô cộng lại, chưa khử trùng) | 205: công cụ xuất 28, kỹ thuật hình 56, âm thanh 25, quy trình 28, cách viết prompt 38, phong cách tham chiếu 30 |
| Thủ pháp sau khi gộp | 109 (tám nhóm) |

## 4. File trong thư mục này

| File | Nội dung |
|---|---|
| `muc_da_cham.json` | 100 mục, giữ nguyên các trường: slug, ten, thanh_pham, phong_cach, ho, ban_remake_giong_goc, dau_vao_can_co, cong_cu_nhac_den, duong_xuat_video, do_kho, do_kho_ly_do, uoc_so_dong_ma, tai_render, hop_media, hop_media_ly_do, gan_tong_media, thu_phap_dang_hoc, rui_ro, dung_lam_mau, dung_lam_mau_ly_do, nhom, author, tech_tags, post_url, poster, prompt_url, video_goc, video_lam_lai, w, h, fps, dur. Không chứa nội dung prompt |
| `quet_chu_703.json` | Gộp hai lô quét chữ, giữ nguyên các trường ten, mo_ta, so_prompt, slug_vi_du, trich_ngan; thêm trường `lo_quet` (a hoặc b). Trích dẫn tiếng Anh dài hơn 20 chữ trong mo_ta (5 chỗ) đã cắt còn 20 chữ |
| `muc_luc.md` | Bảng 100 mục xếp theo điểm hợp Media: tên, nhóm, họ, điểm, chất liệu gần, link video gốc, link prompt |

## 5. Cách dùng dữ liệu

- Tra một kỹ thuật hay phong cách: mở `muc_luc.md`, lấy link prompt và video gốc, xem trực tiếp ở nguồn.
- Học thủ pháp: dùng thư viện `tai_san/thu_phap/` (đã gộp), không đọc lại 317 dòng thô.
- Mượn tông màu, bố cục: các mẫu nêu trong bản chỉ đạo (kloss-xyz-067876, linearuncle-971663, rammanq-034553, groundcontrol-230877…) có dải khung hình lưu ở thư mục tạm của phiên học; muốn đo lại màu thì tải lại video theo link gốc, không dùng bản sao trong git.
- Tìm theo họ hoặc điểm: lọc trường `ho`, `hop_media`, `nhom` của `muc_da_cham.json`.

## 6. Giới hạn cần biết

- Điểm hợp Media và nhận xét do tác tử con chấm từ dải khung hình và prompt; Trung chưa duyệt từng mục.
- Tham số thủ pháp lấy từ mô tả khung hình và lời prompt; chưa dựng lại để kiểm. Thư viện thủ pháp đánh dấu mọi mục là nháp vì lý do này.
- Trường `gan_tong_media` dùng mã phong cách D cũ (D-01 đến D-11), đã thay bằng hệ năm trục từ 27/10/2026; mã D chỉ còn nghĩa lịch sử.
- Mỗi lô quét một nửa số prompt nên cùng một kỹ thuật có thể xuất hiện ở cả hai lô với số prompt hơi khác; số prompt trong mỗi mục là số tác tử quét đếm, coi là ước.
- Cột chất liệu gần trong `muc_luc.md` là ước theo họ video và thẻ công nghệ, chưa qua duyệt.
- Repo thay đổi theo thời gian; dữ liệu này chụp ngày 27/10/2026.
