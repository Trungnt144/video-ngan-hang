---
name: viet-chu-dang-video
description: "Viết chữ đăng cho một video đã xong của project Media: tiêu đề (3 phương án để Trung chọn), mô tả YouTube một đoạn 50–70 từ, thẻ YouTube, hashtag không dấu, chú thích TikTok và Facebook, lời nhắc gắn nhãn AI; chia khối YouTube video dài (bản ngang), YouTube Shorts, TikTok, Facebook (bản dọc); kiểm bằng script (số ký tự, byte, thẻ, hashtag, số từ của đoạn mô tả, từ cấm, con số so với kịch bản); chuyển khối YouTube sang file kê khai của skill dang-youtube, hoặc sửa mô tả, thẻ của video đã lên kênh qua YouTube Data API. Dùng khi Trung nói: viết chữ đăng, tối ưu từ khoá cho tiêu đề, SEO video, chấm tiêu đề, viết tiêu đề YouTube, mô tả video, hashtag cho video, thẻ YouTube, caption TikTok, chú thích Facebook, chuẩn bị đăng video, mốc chương, điền mô tả cho video đã tải lên. KHÔNG dùng cho: chọn chủ đề video (san-trend), viết kịch bản hay lời đọc (03_kich_ban_va_loi_viet.md), chữ trên hình hoặc phụ đề trong video, hình thu nhỏ (bang_phong_cach_hinh_thu_nho.md), tải video lên YouTube (dang-youtube)."
version: 1.3.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-28
  de_xuat: "san_pham/2026.10.27.de_xuat_skill_viet_chu_dang_video/2026.10.27.de_xuat_skill_viet_chu_dang_video_v1.md"
  related_modules: [01_quy_trinh_chung.md, 13_ban_quyen_va_bao_mat.md, 15_bang_kiem_truoc_khi_giao.md]
  related_skills: [dang-youtube, san-trend]
---

# Viết chữ đăng video

Skill viết toàn bộ chữ đi kèm khi đăng một video: tiêu đề, mô tả, mốc chương, thẻ, hashtag, chú thích, kèm các ô phải chọn khi đăng (nhãn AI, dành cho trẻ em). Chữ nằm trong `tai_nguyen/dang_bai/` của thư mục video, mỗi nền tảng một file (`youtube.md`, `shorts.md`, `tiktok.md`, `facebook.md`), Trung duyệt ở đó. Script kiểm mọi giới hạn bằng máy; khối YouTube chuyển thẳng sang file kê khai của skill `dang-youtube`, nên Trung không phải chép dán lên YouTube. TikTok và Facebook Trung chép từng ô từ file.

**Video kênh Chuyện nghề Ngân hàng** (khối `thong_tin` có `"kenh": "ngan_hang"`, hoặc `dang_bai/hinh_thu_nho.json` có `"kenh": "ngan_hang"`): đọc `quy_tac_kenh_ngan_hang.md` TRƯỚC khi viết. File đó thay quy tắc chung ở các điểm: mẫu tiêu đề thuật ngữ đầu câu, một tiêu đề chính và một dự phòng, mốc chương 5–8 mốc trong mô tả, hashtag cố định `#nganhang #chuyennghenganhang`, chân mô tả riêng, viết sẵn `facebook.md` khi chưa có bản dọc, cặp tiêu đề với chữ trên hình thu nhỏ. `kiem_chu_dang.py` tự nhận kênh và kiểm theo bộ quy tắc đó.

Thiết kế và nghiên cứu quy định: bản đề xuất ghi ở `metadata.de_xuat` (có bản HTML cùng thư mục). Quy định có URL, câu trích, ngày đọc: `quy_dinh_nen_tang.md`.

## Quyết định Trung đã chốt

| Ngày | Quyết định |
|---|---|
| 27/10/2026 | Hashtag không dấu, chữ thường, liền; tối đa 3 (YouTube, TikTok), 5 (Facebook) |
| 29/10/2026 | Mô tả YouTube chỉ gồm MỘT đoạn văn 50–70 từ (không tính hashtag) kể ngắn nội dung video, rồi dòng hashtag; không nêu nghị định, thông tư, luật; bỏ mốc chương, đoạn giới hạn con số, link, dòng cách làm video (cùng ngày Trung đặt 150–200 từ rồi rút xuống). Hashtag YouTube tối đa 5, kênh Chuyện nghề Điện luôn có `#nangluongtaitao #chuyennghedien`. Bảng kiểm báo lỗi khi sai |
| 27/10/2026 | Nhãn AI Facebook bật cho mọi video có giọng đọc máy hoặc cảnh dựng máy tả thực. YouTube, TikTok chỉ khai khi có clip AI tả thực hoặc nhạc AI |
| 27/10/2026 | Không đăng tự động TikTok, Facebook: Trung chép dán, dùng lên lịch sẵn có (Meta Business Suite; TikTok đăng từ điện thoại). **Đổi 29/10/2026 cho Facebook:** Reels dọc đăng bằng skill `dang-facebook`, đọc ô `chu_thich`, dòng "Trung duyệt" và dòng "nhãn AI: bật/tắt" của `facebook.md`; TikTok giữ như cũ |
| 27/10/2026 | Chạy skill sau khi Trung duyệt bản cuối và xếp thư mục giao (bước 8 của `01_quy_trinh_chung.md`) |
| 27/10/2026 | Mỗi video Claude đưa 3 tiêu đề khác kiểu, Trung chọn bằng bảng chọn |
| 27/10/2026 | Từ khoá lấy từ dữ liệu `san-trend` có sẵn, thiếu thì lấy gợi ý tìm kiếm; không chạy san-trend cho từng video |
| 28/10/2026 | Chữ đăng ở `tai_nguyen/dang_bai/`, mỗi nền tảng một file `<nền tảng>.md` (quy tắc 4 mục 3 của `00_tam_nhin_va_muc_tieu.md`); các file `.md` trong `dang_bai/` vào git (ngoại lệ trong `.gitignore`), không đánh số phiên bản vì git giữ lịch sử |
| 28/10/2026 | Bản dọc của video ngang đặt ngoài cùng cùng thư mục, tên có nền tảng: `<tên>_shorts_v<n>_cuoi.mp4`, `_tiktok_`, `_reels_` (một file dọc dùng nhiều nơi thì liên kết cứng). File không có tên nền tảng là bản YouTube ngang. Bản ngang lên YouTube video dài; bản dọc lên Shorts, TikTok, Facebook |
| 30/10/2026 | Kênh Chuyện nghề Ngân hàng có bộ quy tắc riêng `quy_tac_kenh_ngan_hang.md` (16 điểm, Trung chốt qua bảng chọn); chân mô tả theo kênh (`chan_mo_ta_<kênh>`); script nhận kênh từ trường `kenh` |
| 28/10/2026 | `youtube.md` là bản gốc; `xuat_ke_khai.py` chuyển nó sang file kê khai lô (video chưa tải) hoặc file cập nhật (video đã lên kênh) |

## File trong skill

| File | Dùng làm gì |
|---|---|
| `quy_dinh_nen_tang.md` | Quy ước xưởng, bảng quy định ba nền tảng (URL, câu trích, ngày đọc), khối số cho script ở cuối |
| `danh_sach_doi_chieu.json` | 70 câu trích để đối chiếu lại trang nguồn |
| `mau/` | Khuôn bốn file chữ đăng: `youtube.md` (có khối thông tin cho lệnh chuyển và 3 phương án tiêu đề), `shorts.md`, `tiktok.md`, `facebook.md` |
| `chan_mo_ta.md` | Chân mô tả cố định, mỗi kênh một khối (`chan_mo_ta` kênh Điện, `chan_mo_ta_ngan_hang`) |
| `quy_tac_kenh_ngan_hang.md` | Quy tắc tiêu đề, mô tả, chú thích riêng kênh Chuyện nghề Ngân hàng (Trung chốt 30/10/2026), kèm biên bản quyết định |
| `tu_cam_rieng.txt` | Từ cấm riêng (tên khách hàng, dự án chưa công bố), mỗi dòng một từ; nằm ngoài git, tự tạo khi cần |
| `scripts/do_video.py` | Đo khổ, thời lượng video từng nền tảng (không cần ffprobe), in mốc chương từ `thoi_gian.json` (Remotion theo khung hình, video HTML theo giây; tìm thư mục dựng trong `nguon_goc.md`, thiếu thì trong kịch bản), liệt kê file kịch bản và chữ đăng có sẵn |
| `scripts/goi_y_tu_khoa.py` | Tra dữ liệu san-trend có sẵn, lấy gợi ý tìm kiếm Google và YouTube |
| `scripts/kiem_chu_dang.py` | Bảng kiểm bằng máy cho mọi file trong `dang_bai/`, mã thoát 1 khi có lỗi |
| `scripts/xuat_ke_khai.py` | Chuyển khối YouTube sang file của `dang-youtube` |
| `scripts/cap_nhat_youtube.py` | Sửa tiêu đề, mô tả, thẻ của video đã lên kênh qua YouTube Data API (token của `dang-youtube`), chỉ gửi phần snippet nên giữ nguyên chế độ riêng tư |
| `scripts/them_xem_ca_loat.py` | Thêm dòng "Xem cả loạt: <đường dẫn danh sách phát>" vào ô mô tả YouTube, lấy danh sách nghiệp vụ của video trong `du_lieu/dang_youtube/danh_sach_phat_<kênh>.json` (thêm 02/11/2026) |
| `scripts/doi_chieu_quy_dinh.py` | Tải lại trang nguồn, tìm lại từng câu trích |

Mọi script chạy từ gốc Media bằng `python3 -I`, chỉ dùng thư viện chuẩn.

## Quy trình mỗi video

1. **Đo video.** `python3 -I skills/viet-chu-dang-video/scripts/do_video.py san_pham/<thư mục>`: video từng nền tảng (nhận theo tên nền tảng trong tên file), mốc chương, file kịch bản, chữ đăng đã có. Thiếu `thoi_gian.json` (video dọc LM-01, video HTML) thì lấy mốc chương từ file `.canh.json` hoặc mã dựng; video dưới 1 phút không cần chương.
2. **Đọc kịch bản.** File `.tom_tat.md` (gốc của mô tả), kịch bản đã duyệt (dòng "Tiêu đề đời thường (Trung duyệt)", bảng thông số, dòng "Biến tấu" để biết có clip AI hay cảnh Blender), file nguồn kiểm chứng. Mọi con số trong chữ đăng phải có trong các file này.
3. **Hỏi Trung một lượt bằng bảng chọn**, chỉ phần chưa rõ: đăng nền tảng nào (đã có bản dọc chưa), video có cảnh AI tả thực không, từ khoá chính. Bỏ bước này khi video thuộc một chuỗi đã chốt sẵn (cùng nền tảng, cùng danh sách phát) theo `02_lam_ro_yeu_cau.md`.
4. **Lấy từ khoá.** `python3 -I skills/viet-chu-dang-video/scripts/goi_y_tu_khoa.py "<cụm từ>" --luu san_pham/<thư mục>`. Chọn một từ khoá chính là câu người ta gõ thật (gợi ý tìm kiếm YouTube ưu tiên hơn Google). Kiểm thêm (bổ sung 29/10/2026, bản đồ công cụ ở `14_rada_xu_huong.md` mục 8): (a) sổ trend `du_lieu/trend/so_trend.json` và file Keyword Planner gần nhất có từ đó chưa; (b) vidIQ `vidiq_keyword_research` mode `research`, `country: "VN"` cho 1–2 ứng viên từ khoá chính (5 credit mỗi từ, tối đa 10 credit mỗi video, gọi `vidiq_balance` trước và sau): chọn từ có `estimatedMonthlySearch` cao hơn khi nghĩa ngang nhau; từ chỉ ra "<750" thì quyết theo gợi ý tìm kiếm. `vidiq_score_title` chỉ dùng khi Trung yêu cầu (chưa kiểm với tiêu đề tiếng Việt).
5. **Viết chữ đăng**: chép khuôn trong `mau/` vào `san_pham/<thư mục>/tai_nguyen/dang_bai/`, mỗi nền tảng có video thì một file, theo quy ước ở mục 1 của `quy_dinh_nen_tang.md`:
   - Tiêu đề: từ khoá chính ở đầu, nên dưới khoảng 70 ký tự; viết 3 phương án khác kiểu (câu hỏi, con số, liệt kê thành phần).
   - Mô tả YouTube (rule 29/10/2026): MỘT đoạn văn 50–70 từ, không tính hashtag; câu đầu có từ khoá chính và nói video trả lời câu hỏi gì, câu sau kể gọn các ý chính theo thứ tự trong video. Sau đoạn văn là dòng hashtag, rồi chân mô tả kênh chép nguyên từ `chan_mo_ta.md` (bảng kiểm báo lỗi nếu thiếu). Không nêu nghị định, thông tư, luật hay quy định pháp lý; không mốc chương, không link ngoài chân mô tả, không dòng cách làm video.
   - Thẻ: từ khoá chính, các biến thể gợi ý tìm kiếm, một bản không dấu cho từ hay gõ sai; không thêm thẻ không liên quan.
   - Mỗi video viết riêng, không dùng một khuôn mô tả giống hệt nhau giữa các video (chính sách spam của YouTube).
   - `shorts.md`, `tiktok.md`, `facebook.md` chỉ viết khi đã có bản dọc tương ứng ngoài cùng thư mục. Chú thích TikTok, Facebook viết khác mô tả YouTube: ngắn, câu đầu có từ khoá, không mốc chương.
6. **Kiểm.** `python3 -I skills/viet-chu-dang-video/scripts/kiem_chu_dang.py san_pham/<thư mục>` (kiểm mọi file trong `dang_bai/`). Sửa tới khi 0 lỗi; xem từng dòng NHẮC (con số lạ, thiếu từ khoá, mốc chương khác `thoi_gian.json`) và sửa hoặc ghi lý do giữ. Ghi kết quả vào dòng "Bảng kiểm" đầu từng file.
7. **Trung duyệt (cửa duyệt).** Bảng chọn: 3 tiêu đề, và hai lời khai `madeForKids`, `containsSyntheticMedia`. Trung duyệt xong thì ghi ngày vào đầu file, commit các file trong `dang_bai/`.
8. **Chuyển sang YouTube.** `python3 -I skills/viet-chu-dang-video/scripts/xuat_ke_khai.py san_pham/<thư mục>... --ten <tên lô>` (chạy thử), rồi thêm `--ghi`:
   - Video chưa lên kênh → `du_lieu/dang_youtube/lo_<ngày>_<tên>.json`; tải theo skill `dang-youtube` (Trung chọn giờ đăng `publishAt`).
   - Video đã lên kênh (mã có trong `so_trang_thai.jsonl`) → `du_lieu/dang_youtube/cap_nhat_<ngày>_<tên>.json`; `cap_nhat_youtube.py <file>` chạy thử, Trung duyệt rồi thêm `--chay-that` (lần đầu cho một lô mới: `--chi <mã>` một video trước).
   - Danh sách phát (thêm 02/11/2026): kênh có file `du_lieu/dang_youtube/danh_sach_phat_<kênh>.json` (hiện có kênh Ngân hàng) thì `playlistTitles` lấy từ file này, không lấy ô trong `youtube.md`. Trước bước 8 thêm mã video vào đúng chỗ của một danh sách nghiệp vụ trong file đó (script nhắc nếu thiếu). Sau khi video lên kênh: `danh_sach_phat.py --chay-that` (skill `dang-youtube`) để xếp đúng vị trí, rồi `them_xem_ca_loat.py <thư mục> --ghi` để thêm dòng "Xem cả loạt" ngay trên dòng hashtag, rồi cập nhật mô tả lên kênh như trên. `kiem_chu_dang.py` nhắc khi video kênh Ngân hàng thiếu dòng này. File cập nhật của kênh Ngân hàng tự đặt danh mục 27.
8b. **Đổi tên hiển thị theo tiêu đề đã chốt** (Trung chốt 29/10/2026). Sau khi tiêu đề lên kênh, cập nhật tên video ở: dòng `# Tóm tắt: <tiêu đề>` của file `.tom_tat.md` nếu có (từ 01/11/2026 bảng video lấy tên từ ô `youtube_dai · tieu_de` của `youtube.md` trước, tên sửa tay trên bảng vẫn đứng đầu, nên sửa tiêu đề trong `youtube.md` là bảng đổi theo; xong chạy `python3 -I scripts/bang_video/kiem_ten.py <thư mục>` ra 0 lệch, theo quy tắc chung 9 của `AGENTS.md`: tiêu đề đúng nguyên văn Trung, không thêm bớt dấu câu); một dòng `> **Tiêu đề trên kênh (Trung chốt dd/mm/yyyy):** <tiêu đề>` ngay dưới tiêu đề đầu kịch bản (không sửa lời đã duyệt); dòng đầu `nguon_goc.md` kèm dòng link YouTube, Facebook và tên cũ; dòng đầu `youtube.md`, `facebook.md`; trường `title` trong file kê khai lô `du_lieu/dang_youtube/lo_*.json`. Thư mục đổi theo bước 8c và quy ước sản phẩm 2 của `AGENTS.md` (30/10/2026). Lần đầu áp cho ba video công khai đợt 1.
8c. **Đổi tên file video theo tiêu đề trên kênh** (Trung chốt 29/10/2026, AGENTS.md quy ước sản phẩm 2). Sau 8b: `python3 -I skills/viet-chu-dang-video/scripts/doi_ten_file.py <thư mục>...` (chạy thử), rồi thêm `--chay-that`. Script đổi video ngoài cùng thư mục thành `<tiêu đề>.mp4` và `<tiêu đề> (Facebook).mp4` (liên kết cứng giữ nguyên), sửa tên trong `nguon_goc.md`, `dang_bai/`, `kich_ban/`, `du_lieu/dang_youtube/lo_*.json`, `so_trang_thai.jsonl`, ghi bảng đối chiếu `san_pham/_bang_doi_ten_theo_kenh_2026.10.29.tsv`. Không chạy khi skill `luu-tru-drive` đang xử lý chính thư mục đó (hai bên cùng ghi `nguon_goc.md`). Đổi tiêu đề lần nữa thì chạy lại. Sửa tiêu đề trên kênh bằng `cap_nhat_youtube.py` (8b) thì KHÔNG tự chạy bước này: hỏi Trung bằng bảng chọn có đổi tên file không (Trung chốt 30/10/2026); Trung cũng có thể bấm "Ghi về máy" trên thẻ chiến dịch của bảng video (`scripts/bang_video/HUONG_DAN.md`, mục thẻ chiến dịch).
9. **TikTok:** Trung tự chép từng ô và đăng; Claude không đăng thay. **Facebook** (từ 29/10/2026): skill `dang-facebook` đọc thẳng `facebook.md` (ô `chu_thich`; ô `tieu_de` facebook-cli không gửi được, Trung điền tay nếu cần) và tải bản dọc `_reels_` lên Trang; giữ đúng dạng dòng "Trung duyệt dd/mm/yyyy" ở đầu file và "nhãn AI: bật" hoặc "tắt" ở cuối file vì script đọc hai dòng này.

Gom nhiều video một lượt (ví dụ điền mô tả cho cả lô đã tải riêng tư): làm bước 1–6 cho từng video, gom bước 7 thành một bảng chọn cho cả lô, rồi một lệnh `xuat_ke_khai.py` cho mọi thư mục. Lô trên 5 video thì giao tác tử con Sonnet viết nháp theo skill này (mỗi tác tử vài video), phiên chính chạy bảng kiểm và đọc lại từng file trước khi trình.

## Cập nhật video đã lên kênh

`cap_nhat_youtube.py` gọi thẳng YouTube Data API bằng khoá và token sẵn có của skill `dang-youtube` (`~/.config/dang-youtube/client_secrets.json`, `request.token`; token có phạm vi `youtube.force-ssl`, đủ để sửa video). Không cần đăng nhập thêm.

- Kiểm token thuộc kênh Chuyện nghề Điện (`UCMo-VX6bf8_SNu8tUa5wiMw`) và video thuộc kênh đó trước khi sửa; sai thì dừng.
- Hẹn giờ công khai (thêm 29/10/2026, Trung duyệt): thêm trường `"publishAt": "yyyy-mm-ddThh:mm:00+07:00"` vào từng video trong file `cap_nhat_*.json` sau khi `xuat_ke_khai.py` sinh file; script gửi thêm phần status (riêng tư kèm giờ đăng, giữ nguyên các trường status khác), từ chối giờ đã qua. Đọc lại ngay sau khi sửa có thể còn giá trị cũ, nên script chờ rồi đọc lại tới 4 lần. Lần dùng đầu: `cap_nhat_2026.10.29_cong_khai_dot1.json` (ba video công khai 29/10/2026).
- Chỉ gửi phần `snippet` (tiêu đề, mô tả, thẻ, danh mục, ngôn ngữ), nên chế độ riêng tư, giờ đăng, nhãn trẻ em, nhãn AI giữ nguyên. Đổi nhãn AI thì làm trên YouTube Studio.
- Đọc lại sau khi sửa và so từng trường (thẻ so không kể thứ tự vì YouTube tự xếp thẻ theo chữ cái); ghi `du_lieu/dang_youtube/so_cap_nhat.jsonl` kèm tiêu đề, mô tả, thẻ cũ để khôi phục khi cần.
- Mỗi lần sửa tốn 50 đơn vị hạn mức API (kho chung 10.000 đơn vị/ngày), đủ cho khoảng 190 video mỗi ngày.

Không dùng yutu cho việc này: yutu đăng nhập bằng địa chỉ quay về `http://localhost:8216` mà khoá OAuth chỉ khai `http://localhost:8080/oauth2callback`, Google báo `redirect_uri_mismatch` (28/10/2026, `90_bai_hoc.md`).

## Bảng kiểm làm gì

| Nhóm | Lỗi (mã thoát 1) | Nhắc |
|---|---|---|
| Độ dài | Tiêu đề YouTube > 100 ký tự; mô tả > 5.000 ký tự hoặc > 5.000 byte UTF-8; thẻ > 500 ký tự tính theo API; chú thích TikTok > 2.200 đơn vị UTF-16 | Chữ hoa > 30% |
| Ký tự | `<` `>` trong tiêu đề, mô tả YouTube; thẻ có `<` `>` `#` | |
| Hashtag | Có dấu, chữ hoa, ký tự đặc biệt; lặp; vượt quy ước 3 (YouTube, TikTok), 5 (Facebook); trên 60 ở YouTube | Hashtag trong tiêu đề; mô tả hoặc chú thích chưa có hashtag |
| Mô tả YouTube (từ 29/10/2026) | Không đúng một đoạn văn; đoạn văn ngoài 50–70 từ; còn mốc chương; nhắc nghị định, thông tư, quyết định, luật | |
| Nội dung | Từ cấm (MB, tài liệu nội bộ, `tu_cam_rieng.txt`); liên kết trong chú thích Facebook; giọng máy mà chưa bật nhãn AI Facebook | Con số không có trong kịch bản; thiếu từ khoá chính ở tiêu đề hoặc 200 ký tự đầu |
| Kênh Ngân hàng (từ 30/10/2026) | Mốc chương ngoài 5–8 hoặc sai luật YouTube; thiếu `#nganhang #chuyennghenganhang` ở cuối mô tả; chú thích Facebook, TikTok thiếu `#chuyennghenganhang` hoặc có mốc chương; link ngoài chân mô tả và khối "Xem tiếp:" | Tiêu đề > 70 ký tự hoặc có "...", "!!", "??"; tiêu đề Facebook khác YouTube; chú thích quá 3 câu; mốc không trùng đầu chương; chưa có tiêu đề dự phòng |
| Hồ sơ | `youtube.md` thiếu khối thông tin; nhãn trẻ em, nhãn AI không phải true/false; ô ngoài mẫu; ô nằm nhầm file nền tảng; video Shorts quá 3 phút | Có chữ đăng mà chưa có video nền tảng đó; video Shorts, TikTok, Facebook không phải khổ dọc; không đủ 3 phương án tiêu đề; quy định đọc quá 90 ngày |

Giới hạn của phép so con số: chỉ so từng con số, không so đơn vị. "300%" không bị bắt nếu kịch bản có "300 kW". Bước Trung duyệt chữ vẫn cần.

## Giữ quy định cập nhật

`python3 -I skills/viet-chu-dang-video/scripts/doi_chieu_quy_dinh.py` tải lại các trang nguồn và tìm từng câu trích. Câu "MẤT" thì tìm câu thay trên trang chính thức, sửa bảng và khối số trong `quy_dinh_nen_tang.md`, ghi ngày đọc mới. Trang "MỞ TAY" (Meta, một số trang TikTok, chỉ hiện chữ khi chạy JavaScript) mở bằng trình duyệt tích hợp và tìm câu bằng `get_page_text`. Chạy khi bảng kiểm nhắc quá 90 ngày, khi nền tảng báo lỗi lúc dán chữ, hoặc khi giao diện đăng có ô mới.

## Chính sách phải nhớ

- YouTube cấm "Automated or synthetic mass-production": kênh dùng cùng nhạc nền, hình AI lặp lại, đọc kịch bản do AI viết trên nhiều video. Rủi ro nằm ở video (dùng mục 6 "Chống nhàm chán" của `04_he_truc_dung.md`); chữ đăng không che được, nhưng ít nhất không được giống hệt nhau giữa các video.
- Tiêu đề, mô tả câu kéo sai nội dung bị gỡ và cảnh cáo; hashtag không liên quan có thể làm video bị gỡ khỏi tìm kiếm.
- Mô tả công khai chỉ dẫn nguồn công khai; không dẫn tài liệu RM MB, tờ trình, dữ liệu khách hàng (`13_ban_quyen_va_bao_mat.md`).
- Reels ngang và Reels có hình mờ của ứng dụng khác khó được Facebook đề xuất: không đăng bản ngang lên Facebook.
