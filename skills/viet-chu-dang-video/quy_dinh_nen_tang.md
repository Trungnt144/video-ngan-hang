# Quy định đăng video của YouTube, TikTok, Facebook

> Đọc ngày 27/10/2026 trên trang chính thức của từng nền tảng. Mỗi dòng có số đều có URL và câu trích. Phiên lập skill đã mở lại từng trang và tìm thấy đúng câu trích (`san_pham/2026.10.27.de_xuat_skill_viet_chu_dang_video/tai_nguyen/tu_lieu/doi_chieu_nguon.md`).
> **Đọc lại khi:** (1) dòng có ngày đọc quá 90 ngày (`kiem_chu_dang.py` tự nhắc); (2) nền tảng báo lỗi lúc dán chữ; (3) giao diện đăng có ô mới; (4) trước khi dùng một tính năng chưa có trong file này. Đọc lại bằng `python3 -I skills/viet-chu-dang-video/scripts/doi_chieu_quy_dinh.py`; câu nào mất thì tìm câu thay trên trang chính thức, sửa bảng dưới và khối số ở cuối file, ghi ngày đọc mới.
> Không lấy blog SEO làm quy định. Kinh nghiệm chưa được nền tảng xác nhận chỉ ghi ở mục 3, kèm mức tin cậy.

## 1. Quy ước của xưởng (Trung chốt 27/10/2026)

| Quy ước | Nội dung | Lý do |
|---|---|---|
| Hashtag | Không dấu, chữ thường, viết liền: `#dienmattroi`. Tối đa 5 hashtag ở YouTube (Trung nâng từ 3 ngày 29/10/2026; mọi video kênh Chuyện nghề Điện có `#nangluongtaitao #chuyennghedien`, hashtag chủ đề đặt trước vì YouTube hiện 3 hashtag đầu trên tiêu đề), 3 ở TikTok, 5 ở Facebook; hashtag đặt ở dòng cuối mô tả hoặc chú thích | Không nền tảng nào nói hashtag có dấu được xử lý thế nào; Facebook ghi ký tự đặc biệt không hoạt động. TikTok khuyến nghị 2–3, Meta khuyến nghị không quá 5 |
| Nhãn AI YouTube | Bật ô "AI use" chỉ khi có clip AI tả thực (Veo, Omni, Muse) hoặc nhạc do AI tạo. Hoạt cảnh Remotion, Three.js, đồ thị, giọng VieNeu: không bật | Trang 14328491: chỉ cảnh tả thực và thay đổi đáng kể phải khai; giọng đọc máy không nằm trong danh sách |
| Nhãn AI TikTok | Bật công tắc "AI-generated content" chỉ khi có cảnh hoặc người AI trông như thật. Giọng VieNeu: không bật | TikTok miễn khai giọng đọc máy phổ thông |
| Nhãn AI Facebook | Bật cho MỌI video có giọng đọc máy (VieNeu) hoặc cảnh dựng máy tả thực (Blender Cycles), ngoài clip AI tả thực | Meta bắt khai cả "realistic-sounding audio that was digitally created or altered" |
| Mô tả YouTube | Một đoạn văn 50–70 từ (đếm theo khoảng trắng, không tính dòng hashtag) kể ngắn nội dung video, câu đầu có từ khoá chính; sau đó một dòng hashtag, rồi chân mô tả kênh trong `chan_mo_ta.md` (link YouTube, Facebook, TikTok của kênh; thêm 29/10/2026). Không nêu nghị định, thông tư, quyết định, luật hay quy định pháp lý; không mốc chương, không đoạn giới hạn con số, không link ngoài chân mô tả, không dòng cách làm video (Trung chốt 29/10/2026: lần đầu 150–200 từ, cùng ngày rút xuống 50–70 từ vì dài dòng) | Trung chê mô tả nhiều phần "chưa mượt mà", rồi chê nêu nghị định "quá dài dòng" |
| Từ khoá | Từ khoá chính ở đầu tiêu đề và trong câu đầu mô tả; mọi con số khớp kịch bản; không nhồi từ khoá | Cả ba nền tảng phạt nhồi từ khoá, hashtag không liên quan |
| Mô tả YouTube | Viết riêng cho từng video, không dùng một khuôn giống hệt nhau giữa các video | Chính sách spam "sản xuất hàng loạt bằng AI" |
| Facebook | Không chèn liên kết vào phần nội dung chú thích; riêng chân mô tả kênh (`chan_mo_ta.md`, link YouTube, Facebook, TikTok của kênh) đặt cuối chú thích Facebook như YouTube (Trung yêu cầu 29/10/2026, chấp nhận đánh đổi) | Meta: chú thích không liên kết hiệu quả nhất |
| Bản đăng từng nền tảng | Bản ngang lên YouTube video dài. Bản dọc (cùng thư mục, tên có nền tảng: `_shorts_`, `_tiktok_`, `_reels_`) lên Shorts, TikTok, Facebook | Reels ngang khó được đề xuất; TikTok là nền tảng dọc |

## 2. Bảng quy định từng nền tảng

### YouTube (video dài và Shorts)

| Mục | Giới hạn | Hậu quả khi vượt | URL nguồn | Câu trích | Ngày đọc | Trang cập nhật |
|---|---|---|---|---|---|---|
| Tiêu đề | 100 ký tự, không có ký tự không hợp lệ | Studio không cho lưu (trang không mô tả) | https://support.google.com/youtube/answer/57407 | "Video titles have a character limit of 100 characters and cannot include invalid characters." | 27/10/2026 | không ghi |
| Tiêu đề qua API | 100 ký tự, cấm `<` và `>` | API từ chối | https://developers.google.com/youtube/v3/docs/videos | "maximum length of 100 characters and may contain all valid UTF-8 characters except < and >" | 27/10/2026 | 15/10/2026 |
| Mô tả | 5.000 ký tự | Studio không cho lưu | https://support.google.com/youtube/answer/57407 | "Video descriptions have a character limit of 5,000 characters" | 27/10/2026 | không ghi |
| Mô tả qua API | 5.000 byte UTF-8 (chữ Việt có dấu tốn 2–3 byte) | API từ chối | https://developers.google.com/youtube/v3/docs/videos | "maximum length of 5000 bytes" | 27/10/2026 | 15/10/2026 |
| Phần mô tả hiện trước "xem thêm" | YouTube không công bố số ký tự | — | https://support.google.com/youtube/answer/12948449 | "Consider using the first few lines of your description to describe your video because it's what viewers will see first." | 27/10/2026 | không ghi |
| Thẻ ẩn (tags) | 500 ký tự cho cả danh sách; dấu phẩy tính vào; thẻ có dấu cách tính thêm 2 ký tự ngoặc kép | API từ chối | https://developers.google.com/youtube/v3/docs/videos | "maximum length of 500 characters" · "commas between items in the list count toward the limit" · "the tag Foo Baz contains nine characters" | 27/10/2026 | 15/10/2026 |
| Tác dụng của thẻ | Nhỏ, chủ yếu khi từ hay bị gõ sai | — | https://support.google.com/youtube/answer/57407 | "Otherwise, tags play a minimal role in your video's discovery." | 27/10/2026 | không ghi |
| Số hashtag | Trên 60 thì bỏ qua toàn bộ | Mọi hashtag bị bỏ qua; gắn quá nhiều có thể bị gỡ khỏi mục tải lên hoặc tìm kiếm | https://support.google.com/youtube/answer/6390658 | "more than 60 hashtags, we'll ignore each hashtag on that content" · "Over-tagging may result in the removal of your video from your uploads or from search." | 27/10/2026 | không ghi |
| Hashtag hiện trên tiêu đề | Tối đa 3, YouTube chọn trong số hashtag ở mô tả | — | https://support.google.com/youtube/answer/6390658 | "up to three hashtags that are considered most engaging will appear by your video title" | 27/10/2026 | không ghi |
| Định dạng hashtag | Không có dấu cách | Không thành hashtag | https://support.google.com/youtube/answer/6390658 | "Hashtags don't contain any spaces." | 27/10/2026 | không ghi |
| Hashtag sai chủ đề | Cấm | Có thể gỡ video | https://support.google.com/youtube/answer/6390658 | "Misleading or unrelated hashtags may result in the removal of your video or playlist." | 27/10/2026 | không ghi |
| Mốc chương | Mốc đầu 00:00; ít nhất 3 mốc tăng dần; mỗi chương từ 10 giây | Không hiện chương | https://support.google.com/youtube/answer/9884579 | "starts with 00:00" · "at least three timestamps listed in ascending order" · "The minimum length for video chapters is 10 seconds." | 27/10/2026 | không ghi |
| Shorts là gì | Khung vuông hoặc dọc, tối đa 3 phút | Video ngang luôn là video dài | https://support.google.com/youtube/answer/12779649 | "Up to 3 minutes." · "With a square or vertical aspect ratio" | 27/10/2026 | không ghi |
| Tiêu đề, mô tả câu kéo sai nội dung | Cấm | Gỡ video, cảnh cáo hoặc gậy; 3 gậy trong 90 ngày có thể bị chấm dứt kênh | https://support.google.com/youtube/answer/2801973 | "Using maliciously misleading titles, thumbnails, descriptions, or imagery..." · "If you get 3 strikes within 90 days, your channel may be terminated." | 27/10/2026 | không ghi |
| Sản xuất hàng loạt bằng AI | Cấm đăng tràn nội dung lặp lại | Theo chính sách spam (như dòng trên) | https://support.google.com/youtube/answer/2801973 | "Channels that use the exact same background music and repetitive AI generated imagery across many videos, with each video reading out an AI-generated script." | 27/10/2026 | không ghi |
| Nhãn AI | Bắt buộc khai cảnh AI tả thực, nhạc do AI tạo; ô "AI use" trong mục Attributes của Studio | Khai không giảm người xem hay kiếm tiền; không khai liên tục thì có thể bị gắn nhãn tay, gỡ nội dung, đình chỉ chương trình đối tác | https://support.google.com/youtube/answer/14328491 | "Realistic AI content and meaningful changes require disclosure, while non-realistic or minor edits don't." · "Disclosing AI content alone won't limit a video's audience or impact its eligibility to earn money." | 27/10/2026 | không ghi |
| Tải hàng loạt trong Studio | 15 video một lần | — | https://support.google.com/youtube/answer/57407 | "You can upload up to 15 videos at a time." | 27/10/2026 | không ghi |

### TikTok

| Mục | Giới hạn | Hậu quả khi vượt | URL nguồn | Câu trích | Ngày đọc | Trang cập nhật |
|---|---|---|---|---|---|---|
| Chú thích video qua API | 2.200 đơn vị UTF-16 | API báo `invalid_param` | https://developers.tiktok.com/doc/content-posting-api-reference-direct-post | "The maximum length is 2200 in UTF-16 runes." | 27/10/2026 | 24/08/2026 |
| Chú thích khi đăng trong ứng dụng, TikTok Studio | Chưa tìm được nguồn chính thức (blog ghi 4.000, độ tin thấp) | — | — | — | 27/10/2026 | — |
| Phần chú thích hiện trước "more" | TikTok không công bố | — | — | — | 27/10/2026 | — |
| Số hashtag | Không có giới hạn cứng; TikTok khuyến nghị 2 đến 3 | Nhồi hashtag ít liên quan "có thể phản tác dụng" | https://www.tiktok.com/creator-academy/en/article/elements-of-tiktok-video · https://www.tiktok.com/creator-academy/en/article/Getting-discovered-with-Search | "use 2 to 3 relevant hashtags on each video" · "can actually work against you" | 27/10/2026 | 18/08/2026 · 19/08/2026 |
| Thẻ ẩn, ô từ khoá, mốc chương | Không có | — | (bảng trường của API Direct Post, các bước đăng ở Help Center) | — | 27/10/2026 | — |
| Chữ dùng cho tìm kiếm | Mô tả, lời nói, phụ đề, chữ trên hình | — | https://www.tiktok.com/creator-academy/en/article/Getting-discovered-with-Search | "use things like your video's description, voiceovers, captions, and on-screen text" | 27/10/2026 | 19/08/2026 |
| Nhãn AI | Bắt buộc với cảnh hoặc người trông như thật; công tắc "AI-generated content" khi đăng; không gỡ được sau khi đăng | Không gắn thì có thể bị gỡ, hạn chế hoặc gắn nhãn; gắn nhãn không ảnh hưởng tương tác tự nhiên | https://www.tiktok.com/community-guidelines/en/integrity-authenticity · https://www.tiktok.com/creator-academy/en/article/ai-generated-content-label | "label AI-generated or significantly edited content that shows realistic-looking scenes or people" · "Unlabeled content may be removed, restricted, or labeled" · "Applying the label will not have an impact on organic engagement" | 27/10/2026 | hiệu lực 24/09/2026 · 26/09/2026 |
| Miễn khai | Chỉnh màu, cắt khung; phong cách nghệ thuật; giọng đọc máy phổ thông không phải giọng người nổi tiếng | — | https://www.tiktok.com/community-guidelines/en/integrity-authenticity (phần "More information") | "Using generic text-to-speech (TTS) narration, when the TTS isn't a recognizable voice of a known individual" | 27/10/2026 | hiệu lực 24/09/2026 |
| Lên lịch trên web | 15 phút đến 10 ngày (Help Center) hoặc 30 ngày (Creator Academy), hai trang nói khác nhau; chỉ tài khoản Business hoặc từ 10.000 người theo dõi | — | https://www.tiktok.com/support/faq_detail?id=7078299678101477893 · https://www.tiktok.com/creator-academy/en/article/tool-web-creation-intro | "a minimum of 15 minutes and a maximum of 10 days" · "10,000 followers or more" · "schedule your posts up to 30 days in advance" | 27/10/2026 | không ghi · 19/08/2026 |

### Facebook (Reels và bài video của Trang)

| Mục | Giới hạn | Hậu quả khi vượt | URL nguồn | Câu trích | Ngày đọc | Trang cập nhật |
|---|---|---|---|---|---|---|
| Mọi video là Reels | Từ 9/2025 mọi video tải lên Facebook là Reels, mọi độ dài và khung | — | https://www.facebook.com/help/166707406722029 | "All videos posted to Facebook will be shared as reels, regardless of length or orientation." | 27/10/2026 | không ghi |
| Ký tự chú thích, nội dung bài, tiêu đề video | Meta không công bố (tài liệu API chỉ ghi kiểu chuỗi UTF-8) | — | https://developers.facebook.com/docs/graph-api/reference/page/video_reels/ | "description UTF-8 string" (không kèm số tối đa) | 27/10/2026 | v26.0 |
| Phần hiện trước "Xem thêm" | Meta không công bố | — | — | — | 27/10/2026 | — |
| Hashtag | Một từ liền, không dấu cách; được có số; dấu câu và ký tự đặc biệt không hoạt động. Không có số tối đa | Không thành hashtag | https://www.facebook.com/help/587836257914341 | "A hashtag must be written as a single word, without any spaces." · "punctuation and special characters (such as $ and %) won't work" | 27/10/2026 | không ghi |
| Chú thích hiệu quả nhất | Không liên kết, ít chữ hoa, không quá 5 hashtag (khuyến nghị, không phải giới hạn) | — | https://creators.facebook.com/blog/combating-unoriginal-content | bản tiếng Việt: "các chú thích không có liên kết, dùng ít chữ viết hoa và chèn không quá 5 hashtag sẽ đạt hiệu quả cao nhất" | 27/10/2026 | 14/07/2025 |
| Thẻ video | Đăng video từ máy tính có ô "Add tags"; không có thẻ ẩn ảnh hưởng tìm kiếm được công bố; không có mốc chương | — | https://www.facebook.com/help/569371393126980 | "Add tags: To add tags related to the content of the video or your Page." | 27/10/2026 | không ghi |
| Mồi tương tác, liên kết câu kéo | Bị giảm phân phối | Giảm phân phối | https://transparency.meta.com/en-gb/features/approach-to-ranking/types-of-content-we-demote/ | mục "Engagement bait", "Clickbait links" | 27/10/2026 | 02/07/2025 |
| Nội dung không gốc | Phạt mất kiếm tiền thường 90 ngày | Mất kiếm tiền, không được đề xuất tới người chưa theo dõi | https://www.facebook.com/business/help/3382366608650437 | "In most cases, the limited originality of content violation carries a 90-day demonetisation penalty." | 27/10/2026 | không ghi |
| Reels ngang, có hình mờ | Ít được đề xuất | Khó được phát hiện | https://www.facebook.com/business/help/1708053352711643 | "Visibly recycled from other apps (i.e. contains watermarks)." · "Horizontal (this video format is typically not as easy to recreate)." | 27/10/2026 | không ghi |
| Nhãn AI | Bắt buộc khai video tả thực hoặc âm thanh nghe như thật được tạo, chỉnh bằng kỹ thuật số | "may apply penalties" | https://transparency.meta.com/en-gb/policies/community-standards/misinformation/ | "photorealistic video or realistic-sounding audio that was digitally created or altered, and we may apply penalties if they fail to do so" | 27/10/2026 | không ghi |
| Lên lịch trong Meta Business Suite | 20 phút đến 29 ngày | — | https://www.facebook.com/business/help/1252240869631062 | "You can schedule posts to publish between 20 minutes and 29 days away." | 27/10/2026 | không ghi |

## 3. Nền tảng dùng chữ đi kèm thế nào

| Nền tảng | Nền tảng nói chính thức | Kinh nghiệm người làm nội dung, chưa được nền tảng xác nhận (mức tin cậy) |
|---|---|---|
| YouTube video dài | Tiêu đề, hình thu nhỏ, mô tả quan trọng hơn thẻ; vài dòng đầu mô tả là chỗ người xem thấy trước (answer/12948449). Thẻ chỉ có ích với từ hay gõ sai. Ba hashtag hiện trên tiêu đề là cách người xem bấm sang trang hashtag | Tiêu đề nên dưới khoảng 60–70 ký tự để không bị cắt trên điện thoại; đặt từ khoá chính ở đầu tiêu đề và câu đầu mô tả; 3–5 hashtag là đủ (thấp đến vừa, blog SEO; trang chính thức chỉ nói ngưỡng 60) |
| YouTube Shorts | Shorts xuất hiện cả trong tìm kiếm. Không có trang nào so sánh cách dùng chữ giữa Shorts và video dài. Không trang chính thức nào còn nhắc hashtag #Shorts; video được xếp là Shorts theo khung hình và độ dài | Nhiều kênh vẫn thêm #Shorts (thấp; không có trong tài liệu hiện hành) |
| TikTok | Gợi ý dựa trên tương tác của người xem, thông tin nội dung (âm thanh, hashtag), thông tin người dùng. Tìm kiếm coi trọng độ khớp với từ người dùng gõ; mô tả, lời nói, phụ đề, chữ trên hình đều nên nói rõ chủ đề. Nhồi từ khoá thành chữ nhỏ trên hình bị gọi là "a myth" và có thể bị gắn cờ spam. 2–3 hashtag liên quan | Chỉ 100–150 ký tự đầu hiện trên nguồn cấp; nên có 3–5 từ khoá trong chú thích, từ chính ở đầu (thấp, blog bên thứ ba) |
| Facebook | Hệ thống Reels liệt kê tín hiệu độ khớp chủ đề với sở thích người xem, không liệt kê chú thích hay hashtag làm tín hiệu riêng. Tìm kiếm dùng tín hiệu "Predicted post language". Chú thích không liên kết, ít chữ hoa, tối đa 5 hashtag hiệu quả nhất. Reels ngang hoặc có hình mờ ít được đề xuất | Giới hạn chú thích 5.000 hoặc 63.206 ký tự (thấp, công cụ bên thứ ba) |

Hệ quả cho cách viết: chữ đăng chủ yếu giúp người xem và hệ thống tìm kiếm hiểu video nói về gì. Không có bằng chứng chính thức nào cho thấy nhồi thêm từ khoá hay hashtag làm tăng phân phối; cả ba nền tảng đều phạt hướng ngược lại. Skill vì vậy viết ít mà đúng: từ khoá chính trong tiêu đề và câu đầu, mọi con số khớp kịch bản, mô tả một đoạn 50–70 từ không nêu văn bản pháp lý, tối đa 5 hashtag ở YouTube.

## 4. Khối số cho script

`kiem_chu_dang.py` đọc khối JSON dưới đây. Sửa số ở đây là đủ, không sửa trong script. `toi_da` là giới hạn của nền tảng (vượt là lỗi); `quy_uoc` là quy ước của xưởng (vượt là nhắc). `don_vi`: `ky_tu`, `byte_utf8`, `utf16`, `ky_tu_the_api` (thẻ YouTube tính theo cách của API: dấu phẩy tính vào, thẻ có dấu cách cộng 2), `so_luong`.

```json gioi_han
[
 {"khoa": "youtube.tieu_de", "toi_da": 100, "don_vi": "ky_tu", "url": "https://support.google.com/youtube/answer/57407", "trich": "Video titles have a character limit of 100 characters", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube.mo_ta", "toi_da": 5000, "don_vi": "ky_tu", "url": "https://support.google.com/youtube/answer/57407", "trich": "Video descriptions have a character limit of 5,000 characters", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube.mo_ta_api", "toi_da": 5000, "don_vi": "byte_utf8", "url": "https://developers.google.com/youtube/v3/docs/videos", "trich": "maximum length of 5000 bytes", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube.the", "toi_da": 500, "don_vi": "ky_tu_the_api", "url": "https://developers.google.com/youtube/v3/docs/videos", "trich": "commas between items in the list count toward the limit", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube.hashtag", "toi_da": 60, "quy_uoc": 5, "don_vi": "so_luong", "url": "https://support.google.com/youtube/answer/6390658", "trich": "more than 60 hashtags, we'll ignore each hashtag on that content", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube.mo_ta_so_tu", "toi_thieu": 50, "toi_da": 70, "don_vi": "tu", "url": "", "trich": "Rule xưởng, Trung chốt 29/10/2026", "ngay_doc": "2026-10-29"},
 {"khoa": "youtube.chuong_so_moc", "toi_thieu": 3, "don_vi": "so_luong", "url": "https://support.google.com/youtube/answer/9884579", "trich": "at least three timestamps listed in ascending order", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube.chuong_do_dai", "toi_thieu": 10, "don_vi": "giay", "url": "https://support.google.com/youtube/answer/9884579", "trich": "The minimum length for video chapters is 10 seconds.", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube.shorts_thoi_luong", "toi_da": 180, "don_vi": "giay", "url": "https://support.google.com/youtube/answer/12779649", "trich": "Up to 3 minutes.", "ngay_doc": "2026-10-27"},
 {"khoa": "tiktok.chu_thich", "toi_da": 2200, "don_vi": "utf16", "url": "https://developers.tiktok.com/doc/content-posting-api-reference-direct-post", "trich": "The maximum length is 2200 in UTF-16 runes.", "ngay_doc": "2026-10-27"},
 {"khoa": "tiktok.hashtag", "quy_uoc": 3, "don_vi": "so_luong", "url": "https://www.tiktok.com/creator-academy/en/article/elements-of-tiktok-video", "trich": "use 2 to 3 relevant hashtags on each video", "ngay_doc": "2026-10-27"},
 {"khoa": "facebook.hashtag", "quy_uoc": 5, "don_vi": "so_luong", "url": "https://creators.facebook.com/blog/combating-unoriginal-content", "trich": "no more than five hashtags perform best", "ngay_doc": "2026-10-27"}
]
```
