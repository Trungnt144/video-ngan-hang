---
name: dang-facebook
description: "Đăng Reels dọc của Media lên Trang Facebook theo lô bằng Meta Graph API (công cụ facebook-cli của facebook-mcp-cli 0.4.0 chạy qua Bash, không qua Chrome): đọc chú thích từ tai_nguyen/dang_bai/facebook.md, lấy bản dọc _reels_, kiểm giới hạn Reels (9:16, 3–90 giây, 540x960 trở lên, 24–60 khung/giây, H.264/H.265, tiếng AAC, 30 Reels mỗi 24 giờ mỗi Trang, lên lịch hơn 10 phút và trong 29 ngày), chọn Trang theo kênh (Chuyện nghề Điện, Chuyện nghề Ngân hàng, Chuyện vĩ mô), đăng nháp, lên lịch hoặc đăng ngay, ghi sổ trạng thái để chạy lại không đăng trùng. Dùng khi Trung nói: đăng Facebook, đăng Reels, đăng lên Trang, tải Reels lên Facebook, lên lịch Facebook, chạy lô Facebook. KHÔNG dùng cho: viết chú thích, hashtag (viet-chu-dang-video), đăng YouTube (dang-youtube), đăng TikTok, video ngang dài (để YouTube), xoá bài, trả lời bình luận, săn trend Facebook (san-trend)."
version: 1.1.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-29
  nghien_cuu: "~/Documents/Grok/Su dung grok/research/2026-10-29_facebook-dang-bai-va-trend/99_final_report.md"
  related_modules: [00_tam_nhin_va_muc_tieu.md, 13_ban_quyen_va_bao_mat.md, 15_bang_kiem_truoc_khi_giao.md]
  related_skills: [viet-chu-dang-video, dang-youtube]
---

# Đăng Reels lên Trang Facebook theo lô

Skill này đăng bản dọc của video Media lên Trang Facebook của từng kênh bằng API chính thức của Meta. Claude chạy `facebook-cli` qua Bash, qua script `scripts/chay_lo.py`. Mỗi lô là một file kê khai JSON; chú thích lấy thẳng từ file chữ đăng `facebook.md` Trung đã duyệt; sổ trạng thái ghi mã video Facebook trả về để chạy lại không đăng trùng.

**Quyết định Trung đã chốt (29/10/2026, qua bảng chọn ở phiên META "Sử dụng Grok"):**

- Đăng bằng facebook-mcp-cli (thenavidm/facebook-mcp-cli, giấy phép MIT) gọi Meta Graph API bằng ứng dụng Meta của chính Trung. Không dùng dịch vụ đăng trả phí, không dùng công cụ Việt Nam không dùng API chính thức (rủi ro khoá tài khoản).
- Bản 0.4.0 dựng từ mã nguồn commit `4d8bfc2` vì bản npm 0.3.0 chưa có lệnh Reels. Mã: `~/.local/share/facebook-mcp-cli` (README ở đó tả đủ lệnh); lệnh: `~/.local/bin/facebook-cli`. Mã đã rà: chỉ gọi `graph.facebook.com` và `rupload.facebook.com`, mặc định chỉ đọc.
- Facebook chỉ đăng Reels dọc. Video ngang dài để YouTube (Reels ngang ít được đề xuất, `skills/viet-chu-dang-video/quy_dinh_nen_tang.md`).
- Lên lịch dùng bộ lên lịch của Facebook: Facebook giữ bài và tự đăng, máy không cần bật.
- **Bổ sung 30/10/2026 (Trung chốt qua bảng chọn):** cả khi đăng qua Chrome cũng chỉ đăng file dọc `<tiêu đề> (Facebook).mp4` (hoặc `_reels_`, `_facebook_`), không đăng bản ngang `<tiêu đề>.mp4` của YouTube; bìa là bìa dọc `*_hinh_thu_nho_doc_v<n>.jpg` (`xuong_html/hinh_thu_nho/xuat.mjs --doc`). Lý do: các bài 29–30/10 đăng bản ngang và hình thu nhỏ ngang nên Facebook cắt mất chữ trên bìa. Bản dọc dài hơn 90 giây thì đăng qua Chrome (lệnh `create-reel` chỉ nhận 3–90 giây). Các bài đã đăng bản ngang giữ nguyên, chỉ đã thay bìa.

## Việc làm một lần: ứng dụng Meta và khoá Trang (Trung làm)

Claude không làm thay được vì phải đăng nhập Facebook.

1. Tài khoản Facebook quản trị Trang đã xác thực số điện thoại Việt Nam (Nghị định 147/2024/NĐ-CP).
2. Vào developers.facebook.com → My Apps → Create App → trường hợp sử dụng "Manage everything on your Page". Thêm 5 quyền: `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `pages_manage_engagement`, `read_insights`. Standard Access cho Trang của chính mình, không cần App Review, không cần xác minh doanh nghiệp.
3. App settings → Basic: lấy App ID và App Secret. Không dán vào project, không đưa cho Grok hay Hermes.
4. Tools → Graph API Explorer: chọn ứng dụng vừa tạo, chọn "User Token", tích 5 quyền trên, Generate Access Token, chọn đủ các Trang của kênh.
5. Trong Terminal (Trung tự gõ, để khoá không đi qua phiên Claude):
   `FACEBOOK_APP_ID=<id> FACEBOOK_APP_SECRET=<secret> facebook-cli login <user token>`
   Có App ID và Secret thì `login` đổi ra khoá Trang không hết hạn và lưu ở `~/.facebook-mcp/pages.json`. **Claude không đọc, không chép file đó.**
6. Kiểm (chỉ đọc): `facebook-cli doctor`, rồi `python3 -I skills/dang-facebook/scripts/chay_lo.py --trang` in tên và mã Trang đã nối. Claude điền `id_trang` và `da_co_trang` vào `skills/dang-facebook/trang_theo_kenh.json`.

## Trang theo kênh

`trang_theo_kenh.json` nối mã kênh (trùng mã chiến dịch ở `scripts/bang_video/chien_dich.json`) với Trang:

| Mã | Kênh | Trang (29/10/2026) |
|---|---|---|
| `dien` | Chuyện nghề Điện | Đã có Trang, chưa nối `facebook-cli` |
| `bank` | Chuyện nghề Ngân hàng | Chưa xác nhận có Trang (`da_co_trang` false) |
| `kinh_te` | Chuyện vĩ mô | Chưa xác nhận có Trang (`da_co_trang` false) |

Script từ chối đăng lên kênh có `da_co_trang` false hoặc Trang chưa có trong `facebook-cli list-pages`.

## Nhãn AI: Trung bật tay

`13_ban_quyen_va_bao_mat.md` mục 4 và `quy_dinh_nen_tang.md` mục 1: Facebook bắt khai cả âm thanh máy tạo nghe như thật, nên mọi video có giọng VieNeu phải bật nhãn AI trên Facebook.

Kiểm ngày 29/10/2026: `facebook-cli` 0.4.0 không có cờ khai nhãn AI (`facebook-cli schema create-reel` chỉ có `file`, `url`, `caption`, `publish_at`, `draft`, `page`; mã `src/api/rupload.ts` chỉ gửi `description`, `video_state`, giờ đăng). Trang tham chiếu `page/video_reels` của Graph API cũng không thấy trường khai nhãn AI; Meta mới chỉ thêm `is_ai_generated` cho API đăng Instagram (changelog Instagram Platform, 22/06/2026).

Vì vậy:

1. Video có dòng "nhãn AI: bật" trong `facebook.md` chỉ được tải lên ở chế độ **nháp** (`che_do: "nhap"`). Script từ chối `len_lich` và `dang_ngay` cho video đó.
2. Trung mở Meta Business Suite → Nội dung → Nháp, mở từng Reel, bật nhãn AI (ô "AI info", bản tiếng Việt có thể là "Thông tin về AI"; tên ô ghi lại ở mục "Kết quả đăng thử"), rồi đăng hoặc đặt giờ ngay trong Business Suite (Business Suite cho đặt giờ từ 20 phút đến 29 ngày).
3. Lần đăng thử đầu kiểm hai điều, ghi kết quả vào mục "Kết quả đăng thử" dưới đây: (a) Reel nháp tải qua API có hiện ô bật nhãn AI trong Business Suite không; (b) Reel đã lên lịch qua API có mở ra sửa, bật nhãn AI trước giờ đăng được không. Nếu (b) được thì đổi `nhan_ai.len_lich_khi_can_nhan` thành `true` trong `trang_theo_kenh.json`, lô sau lên lịch thẳng bằng API rồi Trung chỉ bật nhãn.

Video không có giọng máy và không có cảnh tả thực do máy dựng (hiếm ở Media) ghi "nhãn AI: tắt" và được lên lịch thẳng.

## Quy trình mỗi lô

0. **Trước khi tải (thêm 29/10/2026):** mỗi video chạy `python3 -I skills/toi-uu-phan-phoi/scripts/kiem_dang.py san_pham/<thư mục>` ra 0 LỖI (Reels qua API 3–90 giây, 9:16, 24–60 khung/giây, tiếng AAC); dòng "Nhãn AI" của script là căn cứ ghi "nhãn AI: bật" trong `facebook.md`.
1. **Chữ đăng:** mỗi video có `san_pham/<thư mục>/tai_nguyen/dang_bai/facebook.md` viết bằng skill `viet-chu-dang-video`, dòng đầu ghi "Trung duyệt dd/mm/yyyy", cuối file ghi "nhãn AI: bật" hoặc "tắt". Script chỉ gửi ô `facebook · chu_thich`; ô `tieu_de` không gửi được (lệnh `create-reel` không có trường tiêu đề), Trung điền tay trong Business Suite nếu muốn.
2. **Video:** bản dọc ngoài cùng thư mục: `<tiêu đề> (Facebook).mp4` với video đã đổi tên theo tiêu đề YouTube, hoặc tên có `_reels_` (hoặc `_facebook_`), ưu tiên `_cuoi`; KHÔNG dùng bản ngang `<tiêu đề>.mp4`. Bìa: `*_hinh_thu_nho_doc_v<n>.jpg`, chưa có thì xuất bằng `node xuong_html/hinh_thu_nho/xuat.mjs <kê khai> --doc`. Một file dọc dùng chung cho Shorts, TikTok, Reels thì tạo tên `_reels_` bằng liên kết cứng `ln`, không chép.
3. **Soạn file kê khai** `du_lieu/dang_facebook/lo_<yyyy.mm.dd>_<ten>.json` theo khuôn `skills/dang-facebook/mau_ke_khai.json`: mỗi video một mã sổ nợ (`ma`), `thu_muc`, `kenh`, `che_do` (`nhap`, `len_lich`, `dang_ngay`), `publish_at` khi lên lịch (có múi giờ `+07:00`).
4. **Trung duyệt file kê khai**: Trang đăng, chế độ, giờ đăng là lời khai thay chủ Trang, Claude không tự quyết.
5. **Chạy thử:** `python3 -I skills/dang-facebook/scripts/chay_lo.py du_lieu/dang_facebook/lo_….json`. Script kiểm từng video, in lệnh sẽ chạy, không gọi lệnh ghi nào. Kiểm:
   - chữ đăng: có `facebook.md`, ô chú thích không còn chữ giữ chỗ, có ngày Trung duyệt, có dòng nhãn AI;
   - video: `.mp4`, tỉ lệ 9:16, từ 540x960 (nhắc khi khác 1080x1920), 3–90 giây, 24–60 khung/giây, hình H.264 hoặc H.265, tiếng AAC (đo bằng `ffprobe` mượn của Remotion ở `xuong_thu_hyperframes/bin/ffprobe`; không chạy được thì chỉ đo khổ và thời lượng, kèm lời nhắc);
   - giờ đăng: có múi giờ, cách lúc chạy ít nhất 15 phút (Facebook đòi hơn 10 phút, chừa 5 phút cho lúc tải), không quá 29 ngày;
   - Trang: kênh có Trang, Trang có trong `facebook-cli list-pages`;
   - nhãn AI: như mục trên;
   - sổ: video đã có trong sổ với trạng thái xong thì bỏ qua.
6. **Chạy thật:** thêm `--chay-that`. Còn một video lỗi thì không đăng video nào. Mặc định tối đa 10 Reels mỗi lần chạy (`--toi-da`); trước mỗi video script đếm số Reels đã đăng qua API lên Trang đó trong 24 giờ theo sổ, đủ 30 thì dừng. Mỗi video xong ghi ngay một dòng vào `du_lieu/dang_facebook/so_trang_thai.jsonl` (`da_nhap`, `da_len_lich`, `da_dang`, kèm `video_id`).
7. **Kiểm sau khi đăng (chỉ đọc):** `facebook-cli get-reel-status --video-id <mã> --page "<tên Trang>"` cho biết đang xử lý, đã đăng, đã lên lịch và giờ nào, hay lỗi gì. `facebook-cli list-scheduled-posts --page "<tên Trang>"` liệt kê bài đã lên lịch và nháp.
8. **Báo Trung:** danh sách mã video Facebook, chế độ, giờ đăng; video có nhãn AI nhắc Trung vào Business Suite bật nhãn.

## Quyền ghi và an toàn

- **Đóng thẻ Facebook khi xong việc** (Trung dặn 29/10/2026, nhắc lại 30/10/2026): xong mọi việc Facebook trên Chrome (đăng, sửa, thay bìa, xem số liệu) thì Claude tự đóng các thẻ Facebook đã mở rồi kiểm lại bằng `tabs_context_mcp`. Trang sửa bài luôn hỏi "Rời khỏi trang?" nên đóng thẻ khi nó đã rời trang sửa (sau khi Lưu, trang tự về Thư viện nội dung); kiểm bài bằng trang Reel, không mở lại trang sửa. Đóng không được thì báo Trung bấm "Rời khỏi".

- `facebook-cli` mặc định chỉ đọc. Script đặt `FACEBOOK_ALLOW_WRITE=true` **chỉ** cho lệnh `create-reel`, luôn đặt `FACEBOOK_ALLOW_DELETE=false` và `FACEBOOK_ALLOW_DESTRUCTIVE=0`; mọi lệnh đọc chạy với `FACEBOOK_READ_ONLY=1`. Skill không xoá bài, không sửa bài, không trả lời hay ẩn bình luận.
- Lệnh đăng Reels cần `--confirm`; script chỉ thêm cờ này khi chạy `--chay-that` trên file kê khai Trung đã duyệt.
- Mọi lần ghi được `facebook-cli` ghi vào `du_lieu/dang_facebook/nhat_ky_ghi.jsonl` (biến `FACEBOOK_AUDIT_LOG`; khoá Trang không bao giờ vào nhật ký này).
- `facebook-cli` không thử lại lệnh ghi khi lỗi (tránh đăng hai lần). Script cũng không tự thử lại.
- Không đọc, không chép `~/.facebook-mcp/pages.json`. Không đưa App Secret, khoá Trang cho Grok, Hermes.

## Mã thoát của facebook-cli và cách script xử lý

| Mã | Nghĩa | Script làm | Trung hoặc Claude làm gì |
|---|---|---|---|
| 0 | ổn | ghi sổ `da_nhap`, `da_len_lich` hoặc `da_dang` kèm `video_id` | kiểm bằng `get-reel-status` |
| 2 | sai cú pháp, hoặc lệnh ghi bị từ chối (chưa bật quyền ghi, thiếu `--confirm`, giờ đăng ngoài khoảng) | ghi `loi`, làm tiếp video sau | đọc lỗi trong sổ, sửa kê khai |
| 3 | không tìm thấy (Trang) | ghi `loi`, dừng lô | sửa `ten_trang` hoặc `id_trang` |
| 4 | Meta từ chối khoá Trang (hết hạn, thiếu quyền) | ghi `loi`, dừng lô | Trung chạy lại `login` có App ID và Secret; kiểm đủ 5 quyền |
| 5 | lỗi API hoặc quá thời gian chờ (gồm Facebook từ chối video vì khổ, độ dài) | ghi `loi`, làm tiếp video sau | đọc lỗi; trước khi chạy lại xem `list-scheduled-posts` để chắc video chưa lên |
| 7 | quá giới hạn tốc độ (giới hạn tính theo ứng dụng, không theo Trang) | ghi `hoan`, dừng lô | chạy lại sau vài giờ |
| 10 | chưa nối Trang nào | dừng ngay, chưa đăng gì | Trung làm mục "Việc làm một lần" |

Mã 1 (lỗi không lường trước) và mã khác: ghi `loi`, dừng lô.

## Giới hạn (đọc 29/10/2026)

| Giới hạn | Số | Nguồn |
|---|---|---|
| Khổ hình | 9:16; khuyến nghị 1080x1920, tối thiểu 540x960 | developers.facebook.com/docs/video-api/guides/reels-publishing |
| Độ dài Reels qua API | 3–90 giây | như trên |
| Khung hình | 24–60 khung/giây | như trên |
| File | `.mp4` khuyến nghị; Media xuất H.264, tiếng AAC | như trên |
| Số Reels | 30 Reels đăng qua API mỗi Trang trong 24 giờ trượt (tài liệu không nói nháp có tính không; script đếm cả nháp cho chắc) | như trên; README facebook-mcp-cli |
| Lên lịch qua API | hơn 10 phút, tối đa 29 ngày | như trên |
| Lên lịch trong Business Suite | 20 phút đến 29 ngày | facebook.com/business/help/1252240869631062 |

Video dọc dài hơn 90 giây không đăng được bằng skill này: cắt bản Reels ngắn hơn, hoặc Trung đăng tay trong Business Suite.

## Kết quả đăng thử

Chưa đăng thử bằng API (29/10/2026: chưa nối Trang nào). Lần đầu ghi vào đây:

- 29/10/2026, ngoại lệ Trung duyệt: đăng bản NGANG 4 phút 11 giây "Lắp điện mặt trời mái nhà: quy trình từ khảo sát tới nghiệm thu" lên Trang Chuyện nghề Điện bằng Chrome (Claude in Chrome), vì facebook-cli chưa nối và chỉ đăng Reels 3–90 giây: https://www.facebook.com/reel/1415632373569093. Cách làm: mở Trang (Chrome đang ở chế độ Quản lý trang), bấm ô "Bạn đang nghĩ gì?"; hộp Tạo bài viết có sẵn công tắc "Nhãn AI", bật được trước khi đăng; Trung kéo file vào (công cụ tải file của Claude in Chrome chỉ nhận dưới 10 MB); bước "Chỉnh sửa thước phim" có ô Thêm thẻ (gõ rồi thêm dấu phẩy; phím Enter làm mất chữ); bước "Cài đặt thước phim" có Đăng ngay, Lưu, Đăng. Video ngang vẫn thành Reel. Sửa chú thích sau khi đăng: menu ba chấm của bài trên dòng thời gian, chọn Chỉnh sửa bài viết. Meta Business Suite báo "nội dung này hiện không khả dụng" với Trang này.
- 29/10/2026, lần 2 (video Lưu ý khi lắp đăng ngay, BESS hẹn 19:00), rút ra: (1) Facebook XOÁ nhãn AI đã bật trong hộp Tạo bài viết khi video được thêm vào, và sửa chú thích sau khi đăng cũng có thể làm mất nhãn: bật nhãn ở màn hình cuối "Cài đặt thước phim", sau khi video đã vào; sau mỗi lần sửa bài, mở trang Reel kiểm dòng "Nội dung do AI tạo". (2) Ảnh thu nhỏ: ở màn hình cuối bấm "Chỉnh sửa" trên ảnh xem trước (bài đã đăng: Chỉnh sửa bài viết, ô "Chọn hình thu nhỏ"), hộp có nút "Tải lên"; ô tệp của nút này nhận `.png,.jpg,.jpeg`, Claude đưa ảnh vào bằng `file_upload` (ảnh dưới 10 MB). Không dùng ô chỉ nhận `image/*` nằm ngoài hộp: đó là ô "Chỉnh sửa ảnh bìa" của Trang. (3) Lên lịch: "Lựa chọn lịch đăng" → chọn giờ trong danh sách (bước 5 phút) → "Lên lịch đăng sau" → nút cuối đổi thành "Lên lịch". Bài đã lên lịch xem ở Bảng điều khiển → Công cụ lập kế hoạch (`facebook.com/professional_dashboard/content_calendar/`). (4) Kiểm bài đã lên lịch ở Thư viện nội dung, thẻ "Đã lên lịch" (`facebook.com/professional_dashboard/content/content_library/?filter=SCHEDULED`): hiện chú thích, ảnh thu nhỏ và giờ mà không mở trang sửa. Bấm bài trên Công cụ lập kế hoạch là vào thẳng trang sửa; đóng trang sửa có thể làm lọt ký tự vào chú thích, nên không bấm Lưu và rời trang bằng "Rời khỏi".
- 29/10/2026, lần 3 (đợt 2: ba video lên lịch 30/10), rút ra: (1) Dán chú thích bằng sự kiện dán (`ClipboardEvent('paste')` có `DataTransfer` chứa văn bản) vào ô "Bạn đang nghĩ gì?" đang có con trỏ: giữ đúng dòng trống, hashtag và link, không bật ô gợi ý hashtag như khi gõ. (2) Cửa sổ Chrome đổi cỡ khi Trung kéo file, nên bấm theo mã phần tử (`find` rồi bấm `ref`), không bấm theo toạ độ ảnh chụp cũ: một lần bấm Lưu ảnh thu nhỏ theo toạ độ rơi ra ngoài hộp, hộp đăng thu thành bản nháp, mất thẻ và ảnh thu nhỏ (chú thích, nhãn AI còn); mở lại bằng ô soạn bài trên Trang rồi làm lại hai phần đó. (3) Sau khi bấm Lên lịch, Facebook hiện hộp "Trò chuyện trực tiếp với mọi người" (gợi ý thêm nút Gọi ngay): bấm "Lúc khác", không thêm nút. (4) Bài vừa lên lịch có thể chưa hiện trong Thư viện nội dung khoảng 30 giây; Công cụ lập kế hoạch hiện trước. (5) Ô Thời gian trong "Lựa chọn lịch đăng" mặc định khoảng 2 giờ sau giờ hiện tại, không phải giờ hiện tại. (6) Mở Finder và chọn sẵn đúng file bằng `open -R <file>` trước mỗi lần nhờ Trung kéo; xong việc Facebook thì đóng thẻ Chrome (Trung dặn 29/10/2026).
- 30/10/2026, thay bìa (Trung chốt qua bảng chọn): bìa 4 Reel đã đăng (giờ nắng, hệ thống điện mái nhà, BESS, thi công mái nhà) và bài inverter đã lên lịch bị Facebook cắt mất chữ vì ảnh tải lên là hình thu nhỏ YouTube 16:9, lưới Reels của Trang cắt lấy dải giữa 9:16. Cách làm từ nay: tải bìa dọc 1080×1920 do `xuong_html/hinh_thu_nho/xuat.mjs --doc` xuất (`<video>/yyyy.mm.dd.<chu_de>_hinh_thu_nho_doc_v<n>.jpg`), KHÔNG tải hình thu nhỏ ngang. Khối chữ của bìa dọc nằm trong dải 16:9 giữa khung nên hiện đủ cả khi bài là video ngang (bảng tin hiện dải 16:9 của bìa) lẫn trên lưới Reels. Rút ra: (1) các bài này đăng bằng bản video NGANG của YouTube chứ không phải bản `(Facebook).mp4` dọc; (2) muốn sửa bài thì Chrome phải ở danh tính Trang (ảnh đại diện góc phải trên → chọn Trang); (3) Thư viện nội dung → nút ba chấm của dòng → "Chỉnh sửa bài viết" → "Chọn hình thu nhỏ" → ô tệp trong hộp → Lưu; (4) sửa bìa làm mất nhãn AI ở 1/5 bài (BESS): bật lại bằng công tắc "Thêm nhãn AI" cuối trang sửa, rồi mở trang Reel kiểm dòng "Nội dung do AI tạo"; (5) trang sửa luôn báo "thay đổi chưa lưu" khi rời đi, kể cả khi chưa đổi gì.

- Bài đăng từ ứng dụng Meta ở chế độ Development có hiện công khai không: xem bằng một tài khoản Facebook **không có vai trò** trong ứng dụng (không phải quản trị, nhà phát triển, người thử của ứng dụng). Không hiện thì chuyển ứng dụng sang Live trong App Dashboard.
- Kết quả hai điều kiểm về nhãn AI ở mục "Nhãn AI: Trung bật tay".

## Thống kê Trang (cho bảng video)

Hai lệnh chỉ đọc dùng cho thẻ chiến dịch của bảng video (sổ nợ N136): `facebook-cli get-page-insights --since <ngày> --until <ngày> --page "<Trang>" --compact` (lượt hiển thị, người tiếp cận, người tương tác, thay đổi người theo dõi) và `facebook-cli get-post-insights --post-id <mã> --page "<Trang>" --compact` (từng bài). `list-posts --limit 100` lấy danh sách bài kèm số thích, bình luận, chia sẻ.

## Nâng cấp công cụ

Khi bản npm của `@thenavidm/facebook-mcp-cli` từ 0.4.0 trở lên: `npm install -g @thenavidm/facebook-mcp-cli`, xoá `~/.local/share/facebook-mcp-cli` và `~/.local/bin/facebook-cli`, chạy `facebook-cli --version` và `facebook-cli schema create-reel` để kiểm cờ còn như cũ (và xem đã có cờ nhãn AI chưa).
