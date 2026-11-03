# Tiêu chí nền tảng dùng để phân phối video: YouTube, Shorts, TikTok, Facebook Reels

> Lập 29/10/2026. Nguồn: tác tử con tra trang chính thức ngày 29/10/2026, cộng bảng quy định đã đối chiếu ngày 27/10/2026 của skill `viet-chu-dang-video` (`skills/viet-chu-dang-video/quy_dinh_nen_tang.md`). Ý chưa có trang chính thức đã giao Antigravity kiểm (phiếu `20261029_115500_kchung`, kết quả ở mục 5).
> **Mức tin:** **CT** nền tảng nói chính thức (có URL trang của nền tảng) · **KN** báo chí ngành, blog, người làm nội dung; chưa có trang chính thức · **SAI** lời đồn không có căn cứ hoặc đã bị nền tảng bác.
> **Đọc lại khi:** ngày đọc của một dòng trong khối số (mục 4) quá 90 ngày (`kiem_dang.py` tự nhắc); nền tảng báo lỗi lúc tải; Trung nghe tin nền tảng đổi cách đề xuất. Cách đọc lại và sửa: `SKILL.md` phần C.
> Giới hạn chữ đăng (tiêu đề, mô tả, thẻ, hashtag, mốc chương) KHÔNG chép lại ở đây: nguồn duy nhất là `skills/viet-chu-dang-video/quy_dinh_nen_tang.md`.

## 1. Cơ chế chung của cả bốn nơi đăng

Không nơi nào chấm video theo một danh sách tiêu chí cố định. Hệ thống đưa video thử tới một nhóm người xem nhỏ hợp chủ đề, đo phản ứng, rồi mở rộng hoặc dừng. YouTube: hệ thống "đi theo người xem" (CT, Rene Ritchie qua Tubefilter 26/08/2024). Chữ đăng, phụ đề, lời nói giúp hệ thống hiểu video nói về gì để chọn nhóm thử; người xem quyết định video có được đẩy tiếp hay không.

Hai loại tiêu chí:
- **Loại chặn**: làm sai thì bị gỡ, giảm phân phối hoặc mất kiếm tiền (nội dung không gốc, câu kéo, nhồi từ khoá, thiếu nhãn AI, sai khổ, vượt giới hạn file). Làm đúng chỉ để không bị chặn.
- **Loại đẩy**: làm tốt thì người xem bấm vào và xem lâu hơn (nội dung, câu mở đầu, hình thu nhỏ, độ dài vừa nội dung). Chỉ loại này làm video được ưu tiên.

Tín hiệu đo phản ứng mà nền tảng công bố:

| Nơi đăng | Tín hiệu (CT) | Nguồn |
|---|---|---|
| YouTube | Lịch sử xem và tìm, thích, không thích, đăng ký, khảo sát hài lòng, uy tín và chất lượng kênh; người đánh giá bên ngoài | https://www.youtube.com/howyoutubeworks/product-features/recommendations/ |
| YouTube tìm kiếm | Độ khớp (tiêu đề, thẻ, mô tả, nội dung video so với từ tìm), mức tương tác (thời lượng xem cho từ tìm đó), chất lượng (chuyên môn, uy tín, đáng tin) | https://support.google.com/youtube/answer/16090438 |
| Shorts | Studio có số liệu "Xem hay lướt qua" (tỉ lệ người chọn xem thay vì lướt). Dùng làm tín hiệu xếp hạng là KN; con số mục tiêu 75–80% là KN | https://support.google.com/youtube/answer/12942217 |
| TikTok | Thích, chia sẻ, bình luận, theo dõi, xem lại, xem hết video dài (tín hiệu mạnh); chú thích, âm thanh, hashtag; ngôn ngữ, quốc gia, thiết bị (yếu). Số người theo dõi và video từng nổi KHÔNG phải yếu tố trực tiếp. Video trùng, đã xem, rác không được đề xuất | https://newsroom.tiktok.com/en-us/how-tiktok-recommends-videos-for-you |
| Facebook Reels | Mô hình dự đoán thời lượng xem, xem hết, thích, xem hay bỏ qua, ẩn, "xem ít hơn", bấm toàn màn hình, xem Reels tiếp; đầu vào gồm độ dài Reels, tỉ lệ người khác xem hết, tác giả, độ khớp chủ đề (cập nhật 19/06/2026) | https://transparency.meta.com/features/explaining-ranking/fb-reels/ |
| Facebook Reels | Khảo sát "video này hợp sở thích bạn tới mức nào" (1–5) đưa vào mô hình xếp hạng (14/01/2026) | https://engineering.fb.com/2026/01/14/ml-applications/adapting-the-facebook-reels-recsys-ai-model-based-on-user-feedback/ |

## 2. Mười bảy tiêu chí

### 2.1 Nội dung

- YouTube (CT): chính sách kiếm tiền "nội dung không chân thực" (đổi tên từ "nội dung lặp lại" ngày 15/07/2025) áp cho cả kênh: video làm hàng loạt từ khuôn chung, video thay thế cho nhau được thì mất kiếm tiền. Dùng chung đoạn mở và kết được phép nếu phần lớn nội dung khác nhau. Người dẫn do AI đóng vai đưa lời khuyên tài chính không được kiếm tiền (trang trợ giúp CT; mốc làm rõ 07/2026 là KN qua TechCrunch 20/07/2026). https://support.google.com/youtube/answer/1311392
- YouTube (CT): chính sách rác cấm kênh dùng cùng nhạc nền, hình AI lặp lại trên nhiều video, mỗi video đọc kịch bản AI. https://support.google.com/youtube/answer/2801973
- Shorts (KN, hai bài báo ngành dẫn bài TeamYouTube; chưa mở được bài gốc): từ 01/10/2026 nguồn cấp Shorts giảm phạm vi của video tải lại từ người khác mà không thêm gì của mình; thuyết minh mô tả cảnh của người khác không tính là nội dung gốc. Bản dọc dựng lại từ video ngang của chính xưởng không thuộc diện này.
- TikTok (CT): nội dung tải lại không thêm gì mới không được lên trang Dành cho bạn (quy tắc cộng đồng hiệu lực 24/09/2026). Kiểm trước khi đăng bằng "Content Check Lite" trong TikTok Studio bản web (CT, 30/07/2025). https://www.tiktok.com/community-guidelines/en/integrity-authenticity
- Facebook (CT): dùng lại video người khác bị giảm phân phối toàn bộ tài khoản và mất kiếm tiền; thêm viền, đổi tốc độ, thêm phụ đề, ghép clip, thêm hình mờ không làm video thành nội dung gốc (14/07/2025, 13/03/2026). Reels gốc tăng khoảng gấp đôi lượt xem nửa cuối 2025 so với nửa cuối 2024. https://creators.facebook.com/blog/combating-unoriginal-content · https://about.fb.com/news/2026/03/rewarding-original-creators-on-facebook/
- Facebook (CT, 03/04/2024): tải nguyên video dài từ nền tảng khác không chỉnh sửa khó đạt kết quả tốt. https://creators.facebook.com/blog/how-to-continue-succeeding-with-facebook-on-video

**Áp cho xưởng:** mỗi video phải có kịch bản riêng, cảnh riêng (không chỉ thay chữ trên một khuôn); bản dọc dựng lại khổ 9:16, viết câu mở đầu và chú thích riêng từng nền tảng.

### 2.2 Độ dài

- Không nền tảng nào công bố độ dài tối ưu (CT: không có tuyên bố). Tín hiệu là tỉ lệ xem hết so với độ dài.
- YouTube video dài: màn hình kết thúc cần video từ 25 giây (CT, answer/57407). Mặc định xưởng 3–5 phút cho người xem phổ thông là quy ước, không phải quy định.
- Shorts: tối đa 3 phút, khung dọc hoặc vuông, tối đa 1080p (CT). https://support.google.com/youtube/answer/10059070. "Shorts 50–60 giây được xem nhiều nhất" là KN chưa kiểm.
- TikTok: qua API 3 phút, một số tài khoản 5 hoặc 10 phút, tối đa 4 GB (CT). Creator Rewards: video từ 1 phút, 1.000 lượt xem đủ điều kiện, lượt xem đủ điều kiện từ 5 giây (CT, điều khoản 04/2025). https://www.tiktok.com/legal/page/global/tiktok-creator-rewards-program-eea/en
- Facebook: trong ứng dụng không giới hạn độ dài và khung, mọi video là Reels (CT, 17/06/2025). Đăng qua Graph API (skill `dang-facebook`): 3–90 giây (CT). Nội dung dưới 10 giây không được kiếm tiền, lượt xem dưới 5 giây không tính (CT, 30/03/2026). https://developers.facebook.com/documentation/video-api/guides/reels-publishing · https://creators.facebook.com/blog/new-tips-to-help-you-earn-on-facebook-content-monetization/

### 2.3 Hình ảnh

- YouTube dài: ngang 16:9, xưởng xuất 1920×1080 (quy ước). Shorts: dọc hoặc vuông, tối đa 1080p (CT).
- TikTok (CT, tài liệu API): MP4 (cả WebM, MOV), H.264 khuyến nghị (cả H.265, VP8, VP9), 23–60 khung/giây, mỗi cạnh 360–4096 điểm ảnh, tối đa 4 GB. 1080×1920 là thực hành phổ biến (KN). https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide
- Facebook Reels (CT, tài liệu API): 9:16, tối thiểu 540×960, khuyến nghị 1080×1920, 24–60 khung/giây cố định, H.264 hoặc H.265, MP4, 4:2:0, tiếng AAC-LC 48 kHz stereo từ 128 kbps. Reels ngang hoặc có hình mờ logo ứng dụng khác ít được đề xuất (CT, answer/1708053352711643).
- Chung: bản đăng nơi nào xuất sạch cho nơi đó, không mang hình mờ của nơi khác.

### 2.4 Âm thanh

- Không nền tảng nào nói nhạc đang thịnh làm tăng phân phối (SAI nếu khẳng định chắc). TikTok liệt kê âm thanh là thông tin để hiểu video (CT).
- Thư viện nhạc của nền tảng chỉ được cấp phép trên nền tảng đó (KN). Bản dọc dùng chung nhiều nơi: dùng nhạc nền xưởng có giấy phép mọi nền tảng (`tai_san/nhac_nen/`).
- Facebook bắt khai âm thanh nghe như thật do máy tạo (CT), nên video có giọng VieNeu bật nhãn AI trên Facebook. YouTube, TikTok không bắt khai giọng đọc máy phổ thông (CT).
- Độ to: xưởng chuẩn −14 LUFS (trình chạy pha máy tự chỉnh). Không nền tảng nào trong bốn công bố mức độ to bắt buộc trong lần tra này.

### 2.5 Hình thu nhỏ và ảnh bìa

- YouTube dài (CT): tiêu đề, hình thu nhỏ, mô tả quan trọng hơn thẻ (answer/146402). Test & Compare thử tối đa 3 hình thu nhỏ hoặc tiêu đề, chọn bản thắng theo thời lượng xem (không theo tỉ lệ bấm), chỉ trên máy tính, khoảng 2 tuần; không dùng cho Shorts (answer/13861714). Khổ 16:9, khuyến nghị 3840×2160, rộng tối thiểu 640, tối đa 2 MB khi tải từ điện thoại, 50 MB từ máy tính (answer/72431). Hình gây hiểu sai nội dung bị cấm (answer/9229980).
- Shorts: hình thu nhỏ 9:16, 2160×3840, cao tối thiểu 640, 50 MB (CT, answer/72431). Tải hình riêng chỉ trên YouTube Studio bản máy tính, tài khoản phải xác minh (CT, answer/72431: "Custom thumbnails for Shorts are currently only available to add in YouTube Studio on a computer. Your account must be verified to use this feature."); mốc mở 24/07/2026 theo lời CEO Neal Mohan (KN). Không thử A/B được cho Shorts (CT, answer/16391400: "You are not able to A/B test Shorts"). Một số chỗ hiển thị cắt về khoảng 3:2: đặt chữ, vật chính ở giữa (KN).
- TikTok: không có hướng dẫn chính thức về ảnh bìa (phiếu kiểm 29/10/2026 không tìm thấy).
- Facebook: từng có thử A/B tối đa 4 chú thích hoặc hình thu nhỏ cho Reels (CT, 02/11/2023; chưa kiểm còn hay không).
- Chữ và ảnh trên hình thu nhỏ của xưởng: `tai_san/so_tay_gu/cong_thuc_hinh_thu_nho.md` (quy ước kênh, chưa đo).

### 2.6 Chữ trên hình và phụ đề

- YouTube: trang xếp hạng tìm kiếm không nhắc phụ đề, chữ trên hình (CT: không có tuyên bố). "Phụ đề giúp SEO" là KN. Phụ đề cứng vẫn nên có vì nhiều người xem tắt tiếng.
- TikTok (CT, Creator Academy đọc 27/10/2026): tìm kiếm dùng mô tả, lời nói, phụ đề, chữ trên hình; nhồi từ khoá thành chữ nhỏ trên hình có thể bị gắn cờ rác.
- Facebook: không có hướng dẫn chính thức.
- **Áp cho xưởng:** câu đầu lời đọc và dòng chữ lớn đầu tiên trên hình chứa từ khoá chính của video (cách người xem sẽ gõ tìm), không nhồi.

### 2.7 Tiêu đề · 2.8 Mô tả · 2.9 Hashtag · 2.10 Thẻ ẩn

Giới hạn và quy ước: `skills/viet-chu-dang-video/quy_dinh_nen_tang.md`. Bổ sung từ lần tra 29/10/2026:
- "YouTube bỏ qua hashtag khi quá 15" là quy định cũ 2018 (SAI cho hiện tại; ngưỡng hiện hành 60, CT).
- TikTok trong ứng dụng chỉ cho tối đa 5 hashtag từ giữa 2025 (KN, Social Media Today 17/08/2025: người dùng nhận thông báo trong ứng dụng, TikTok không ra thông cáo; giới hạn 4.000 ký tự chú thích chưa có nguồn). Quy ước xưởng 3 hashtag nằm trong mức này.
- Thêm quá nhiều thẻ vào mô tả là vi phạm chính sách rác của YouTube (CT, answer/146402).

### 2.11 Ghi chú, bình luận ghim

Không nền tảng nào nói bình luận ghim ảnh hưởng phân phối (CT: không có tuyên bố). Dùng để ghi nguồn số liệu, liên kết, câu hỏi gợi bình luận thật. Mồi tương tác ("bình luận 1 nếu đồng ý") bị Facebook giảm phân phối (CT, transparency.meta.com types-of-content-we-demote).

### 2.12 Trích dẫn nguồn

- Không có tuyên bố chính thức nào nói ghi nguồn làm tăng xếp hạng (SAI nếu khẳng định). Tìm kiếm YouTube có tính chuyên môn, uy tín, đáng tin (CT). YouTube tự gắn bảng thông tin dưới video thuộc chủ đề dễ bị thông tin sai (CT, answer/9004474).
- TikTok (CT): thông tin chưa kiểm chứng về khủng hoảng, sự kiện lớn không được lên trang Dành cho bạn.
- **Áp cho xưởng:** kênh tài chính, vĩ mô ghi nguồn số liệu ở cuối mô tả YouTube hoặc bình luận ghim; mọi số trên hình theo quy tắc cứng 3 của AGENTS.md.

### 2.13 Gắn link video liên quan

- Shorts (CT): ô "Video liên quan" trong YouTube Studio (Nội dung → chọn Shorts → Video liên quan) gắn một video dài, Shorts hoặc phát trực tiếp công khai hoặc không công khai; cần quyền tính năng nâng cao. https://support.google.com/youtube/answer/14075157. API không đặt được ô này (KN), phải đặt tay.
- YouTube khuyên (CT): nói bằng lời trong 5 giây cuối Shorts rằng video đầy đủ ở liên kết phía trên tiêu đề; Shorts phải xem riêng hiểu được; 5–10 giây đầu video dài trả lời đúng điều Shorts đã hứa. https://blog.youtube/creator-and-artist-stories/youtube-related-videos-traffic-guide/
- YouTube dài: màn hình kết thúc (video từ 25 giây), thẻ, danh sách phát. Không có tuyên bố chúng tăng xếp hạng; chúng giữ người xem ở lại kênh. Shorts có màn hình kết thúc không: chưa có trang nói thẳng (phiếu kiểm chỉ thấy điều kiện video từ 25 giây); với Shorts dùng "Video liên quan".
- Facebook: liên kết trong chú thích làm giảm hiệu quả (CT); đặt ở bình luận (KN).
- TikTok: không có cách chính thức.

### 2.14 Giờ đăng

- YouTube (CT, Rene Ritchie qua Search Engine Journal 12/11/2025): chờ 24–48 giờ sau khi tải lên không khác chờ 24–48 giây; đề xuất bắt đầu khi video công khai và có người xem. Hệ quả: giờ đăng không đổi cách chấm, nhưng đăng lúc người xem của kênh đang trực tuyến thì nhóm người xem đầu đến nhanh hơn. Xem giờ ở YouTube Studio → Số liệu phân tích → Khán giả → "Thời điểm người xem của bạn có mặt trên YouTube" (cần đủ lượt xem mới hiện).
- TikTok: không có công thức giờ đăng hay số video chính thức (phiếu kiểm 29/10/2026 không tìm thấy); xem giờ người theo dõi trực tuyến trong mục Phân tích của TikTok. Facebook: không có; Meta Business Suite có mục giờ người theo dõi trực tuyến.
- "Giờ vàng" trên blog là trung bình của tài khoản khác (KN).
- **Áp cho xưởng khi kênh chưa có số liệu:** đăng một giờ cố định cho mỗi kênh để sau đo được, ghi giờ vào sổ lần dùng; đủ dữ liệu thì đổi theo biểu đồ của Studio.

### 2.15 Số video mỗi ngày

- YouTube: không công bố giới hạn ngày; Studio tải 15 video một lần (CT, answer/57407); API giới hạn theo hạn mức đơn vị của dự án Google (skill `dang-youtube`).
- Facebook qua API: 30 Reels mỗi 24 giờ mỗi Trang; lên lịch hơn 10 phút và trong 29 ngày (CT).
- TikTok: không có số chính thức.
- "Đăng nhiều quá bị phạt" (SAI, không có căn cứ). Rủi ro thật: video cùng ngày tranh người xem của nhau; video na ná nhau rơi vào chính sách nội dung lặp lại.
- **Áp cho xưởng:** mỗi kênh 1 video dài mỗi ngày là đủ; lô 2–3 video thì hẹn giờ rải các ngày.

### 2.16 Tần suất đăng

- Không nền tảng nào nói đăng đều được cộng điểm (CT: không có tuyên bố). Nghỉ đăng không bị phạt, chất lượng hơn số lượng (KN, Rene Ritchie qua bài tóm tắt). Facebook từng thưởng "chuỗi Reels" theo tuần (CT, 2023, cũ).
- Đăng đều giúp người đăng ký quen lịch quay lại và kênh có đủ dữ liệu để hệ thống hiểu nhóm người xem.

### 2.17 Làm video cũ được xem lại

- Sửa tiêu đề, hình thu nhỏ thì video được đẩy lại: không có tuyên bố chính thức (SAI nếu khẳng định). Xoá rồi tải lại: mất số liệu, có thể bị coi là trùng lặp (SAI).
- Cách có căn cứ (CT): (a) tìm kiếm YouTube xếp theo thời lượng xem cho đúng từ tìm, nên video trả lời câu hỏi lâu dài tiếp tục có người xem; (b) Test & Compare thay hình thu nhỏ, tiêu đề cho video cũ; (c) Shorts mới gắn "Video liên quan" về video dài cũ; (d) danh sách phát, màn hình kết thúc của video mới trỏ về video cũ.
- Facebook (CT): video cũ vẫn được phân phối sau thay đổi 06/2025; đăng lại y nguyên là bản trùng, bị giảm phân phối.
- TikTok: không có tuyên bố.

### 2.18 Yếu tố khác

- Nhãn AI: YouTube bắt khai cảnh AI tả thực, khai không làm giảm người xem hay kiếm tiền (CT, answer/14328491). TikTok bắt khai cảnh hoặc người AI trông như thật (CT). Facebook bắt khai cả âm thanh máy tạo nghe như thật (CT). Cách bật cho từng loại video của xưởng: `skills/viet-chu-dang-video/quy_dinh_nen_tang.md` mục 1.
- Cách đếm lượt xem Shorts: từ 31/03/2025 tính khi phát hoặc phát lại; "lượt xem có tương tác" kiểu cũ dùng để xét kiếm tiền (CT, answer/10059070). Từ 24/08/2026 lượt xem mọi loại video (dài, Shorts, podcast, phát trực tiếp) tính từ khung đầu, định nghĩa cũ giữ dưới tên "engaged views" (CT, https://blog.youtube/inside-youtube/engaged-views-youtube-explained/). Khi so số giữa các video phải so cùng một cột.
- Tỉ lệ bấm xem và thời lượng xem trung bình không được YouTube công bố là tín hiệu riêng; "không chỉ số đơn lẻ nào nói lên giá trị video" (KN, Todd Beaupre qua OutlierKit).
- Ngưỡng Chương trình Đối tác: thay đổi trong năm 2026, hai trang trợ giúp ghi khác nhau (KN). Đọc trang trợ giúp hiện hành trước khi đặt mục tiêu.

## 3. Lời đồn đã bác (SAI)

| Lời đồn | Thực tế | Nguồn |
|---|---|---|
| Chờ 24–48 giờ rồi mới công khai thì được đề xuất tốt hơn | Không khác chờ vài giây | SEJ 12/11/2025 (lời Rene Ritchie) |
| Quá 15 hashtag YouTube bỏ qua | Ngưỡng hiện hành 60 | answer/6390658 |
| Thẻ ẩn quan trọng cho SEO YouTube | Thẻ có vai trò rất nhỏ, chủ yếu cho từ hay gõ sai | answer/146402 |
| Đăng nhiều mỗi ngày bị phạt; nghỉ đăng bị phạt | Không có căn cứ | — |
| Xoá rồi tải lại để "làm mới" video | Không có căn cứ; mất số liệu | — |
| Nhạc đang thịnh chắc chắn tăng phân phối | Không nền tảng nào nói vậy | — |
| TikTok ưu tiên tài khoản nhiều người theo dõi | Số người theo dõi không phải yếu tố trực tiếp | newsroom TikTok |
| Facebook "tăng tốc 12 giờ đầu", "bình luận 5 chữ nặng hơn", "giữ 70% ở giây thứ 7" | Không có nguồn Meta | — |

## 4. Khối số cho script

`scripts/kiem_dang.py` đọc khối JSON dưới đây để kiểm file video từng nơi đăng. Sửa số ở đây, không sửa trong script. `muc`: `loi` (vượt là nền tảng từ chối hoặc không xếp đúng loại) hoặc `nhac` (nên xem lại). Trường đo: `rong`, `cao`, `giay`, `khung_giay`, `ma_hinh`, `ma_tieng`, `tan_so_tieng`, `kbps_tieng`, `mb`, `kho` (`ngang`, `doc`, `vuong`), `ti_le` (cao chia rộng). `nen_tang`: `youtube_dai`, `youtube_shorts`, `tiktok`, `facebook`.

```json gioi_han_video
[
 {"khoa": "youtube_dai.kho", "nen_tang": "youtube_dai", "truong": "kho", "trong": ["ngang"], "muc": "loi", "y": "Bản YouTube video dài phải ngang; bản dọc hoặc vuông dưới 3 phút bị xếp vào Shorts", "url": "https://support.google.com/youtube/answer/10059070", "trich": "Up to 3 minutes", "ngay_doc": "2026-10-29"},
 {"khoa": "youtube_dai.cao", "nen_tang": "youtube_dai", "truong": "cao", "toi_thieu": 1080, "muc": "nhac", "y": "Quy ước xưởng xuất 1920x1080", "url": "", "trich": "", "ngay_doc": "2026-10-29"},
 {"khoa": "youtube_dai.giay_man_hinh_ket_thuc", "nen_tang": "youtube_dai", "truong": "giay", "toi_thieu": 25, "muc": "nhac", "y": "Màn hình kết thúc cần video từ 25 giây", "url": "https://support.google.com/youtube/answer/57407", "trich": "Your video must be 25 seconds or longer to add an end screen", "ngay_doc": "2026-10-29"},
 {"khoa": "youtube_shorts.kho", "nen_tang": "youtube_shorts", "truong": "kho", "trong": ["doc", "vuong"], "muc": "loi", "y": "Shorts phải dọc hoặc vuông", "url": "https://support.google.com/youtube/answer/12779649", "trich": "With a square or vertical aspect ratio", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube_shorts.giay", "nen_tang": "youtube_shorts", "truong": "giay", "toi_da": 180, "muc": "loi", "y": "Shorts tối đa 3 phút", "url": "https://support.google.com/youtube/answer/12779649", "trich": "Up to 3 minutes.", "ngay_doc": "2026-10-27"},
 {"khoa": "youtube_shorts.rong", "nen_tang": "youtube_shorts", "truong": "rong", "toi_da": 1080, "muc": "nhac", "y": "Shorts tối đa 1080p: cạnh ngắn trên 1080 bị hạ độ phân giải", "url": "https://support.google.com/youtube/answer/10059070", "trich": "You can upload Short videos with a maximum resolution of 1080p", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.kho", "nen_tang": "tiktok", "truong": "kho", "trong": ["doc"], "muc": "nhac", "y": "TikTok là nền tảng dọc; quy ước xưởng đăng bản 9:16", "url": "", "trich": "", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.khung_giay", "nen_tang": "tiktok", "truong": "khung_giay", "toi_thieu": 23, "toi_da": 60, "muc": "loi", "y": "TikTok nhận 23–60 khung/giây", "url": "https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide", "trich": "Minimum of 23 FPS Maximum of 60 FPS", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.rong", "nen_tang": "tiktok", "truong": "rong", "toi_thieu": 360, "toi_da": 4096, "muc": "loi", "y": "Mỗi cạnh 360–4096 điểm ảnh", "url": "https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide", "trich": "Minimum of 360 pixels for both height and width", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.cao", "nen_tang": "tiktok", "truong": "cao", "toi_thieu": 360, "toi_da": 4096, "muc": "loi", "y": "Mỗi cạnh 360–4096 điểm ảnh", "url": "https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide", "trich": "Maximum of 4096 pixels for both height and width", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.mb", "nen_tang": "tiktok", "truong": "mb", "toi_da": 4096, "muc": "loi", "y": "File tối đa 4 GB", "url": "https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide", "trich": "Maximum of 4GB", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.ma_hinh", "nen_tang": "tiktok", "truong": "ma_hinh", "trong": ["h264", "hevc", "vp8", "vp9"], "muc": "loi", "y": "Mã hoá hình H.264 (khuyến nghị), H.265, VP8, VP9", "url": "https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide", "trich": "H.264 (recommended) H.265 VP8 VP9", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.giay_api", "nen_tang": "tiktok", "truong": "giay", "toi_da": 180, "muc": "nhac", "y": "Đăng qua API mọi tài khoản được 3 phút; dài hơn thì kiểm quyền tài khoản hoặc đăng trong ứng dụng", "url": "https://developers.tiktok.com/doc/content-posting-api-media-transfer-guide", "trich": "All TikTok creators can post 3-minute videos, while some have access to post 5-minute or 10-minute videos.", "ngay_doc": "2026-10-29"},
 {"khoa": "tiktok.giay_creator_rewards", "nen_tang": "tiktok", "truong": "giay", "toi_thieu": 60, "muc": "nhac", "y": "Dưới 1 phút không đủ điều kiện Creator Rewards (chỉ ảnh hưởng tiền, không ảnh hưởng đề xuất)", "url": "https://www.tiktok.com/legal/page/global/tiktok-creator-rewards-program-eea/en", "trich": "", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.kho", "nen_tang": "facebook", "truong": "kho", "trong": ["doc"], "muc": "loi", "y": "Reels qua API phải 9:16; Reels ngang ít được đề xuất", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "9 x 16", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.ti_le", "nen_tang": "facebook", "truong": "ti_le", "toi_thieu": 1.76, "toi_da": 1.79, "muc": "loi", "y": "Tỉ lệ 9:16 (cao chia rộng khoảng 1,778)", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "9 x 16", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.giay", "nen_tang": "facebook", "truong": "giay", "toi_thieu": 3, "toi_da": 90, "muc": "loi", "y": "Reels qua API 3–90 giây; dài hơn thì đăng tay trong ứng dụng", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "3 đến 90 giây.", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.giay_kiem_tien", "nen_tang": "facebook", "truong": "giay", "toi_thieu": 10, "muc": "nhac", "y": "Dưới 10 giây không được kiếm tiền", "url": "https://creators.facebook.com/blog/new-tips-to-help-you-earn-on-facebook-content-monetization/", "trich": "", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.rong", "nen_tang": "facebook", "truong": "rong", "toi_thieu": 540, "muc": "loi", "y": "Tối thiểu 540x960, khuyến nghị 1080x1920", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "Độ phân giải tối thiểu là 540 x 960 pixel. Độ phân giải khuyên dùng là 1080 x 1920 pixel.", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.khung_giay", "nen_tang": "facebook", "truong": "khung_giay", "toi_thieu": 24, "toi_da": 60, "muc": "loi", "y": "24–60 khung/giây cố định", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "24 đến 60 khung hình/giây", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.ma_hinh", "nen_tang": "facebook", "truong": "ma_hinh", "trong": ["h264", "hevc", "vp9", "av1"], "muc": "loi", "y": "H.264 hoặc H.265 (cả VP9, AV1)", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "H.264, H.265 (VP9, AV1 cũng được hỗ trợ)", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.ma_tieng", "nen_tang": "facebook", "truong": "ma_tieng", "trong": ["aac"], "muc": "loi", "y": "Tiếng AAC", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "Codec - AAC Độ phức tạp thấp", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.tan_so_tieng", "nen_tang": "facebook", "truong": "tan_so_tieng", "toi_thieu": 48000, "muc": "nhac", "y": "Tiếng 48 kHz", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "Tốc độ lấy mẫu - 48 kHz", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.kbps_tieng", "nen_tang": "facebook", "truong": "kbps_tieng", "toi_thieu": 128, "muc": "nhac", "y": "Tiếng từ 128 kbps", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "Tốc độ bit âm thanh - 128 kb/giây trở lên", "ngay_doc": "2026-10-29"},
 {"khoa": "facebook.so_bai_24h", "nen_tang": "facebook", "truong": "", "muc": "nhac", "y": "Mỗi Trang đăng tối đa 30 Reels qua API trong 24 giờ liên tục (skill dang-facebook tự giữ giới hạn này)", "url": "https://developers.facebook.com/documentation/video-api/guides/reels-publishing", "trich": "Mỗi API Thước phim chỉ có thể đăng 30 bài viết qua API trong vòng 24 giờ liên tục.", "ngay_doc": "2026-10-29"}
]
```

## 5. Kết quả kiểm của Antigravity (phiếu 20261029_115500_kchung)

Kiểm 29/10/2026: agent ghi 17 khẳng định; script `kiem_trich_dan.py` do Claude chạy lại: 16 `dat`, 1 `dat_ban_luu`, 0 bị loại (tệp `/Users/macbooktrungnt/Documents/Antigravity/TraCuu/ket_qua/20261029_115500_kchung/bao_cao_claude.md`). Script chỉ chứng minh câu trích có trên trang; mức tin dưới đây do Claude đọc lại nguồn và câu trích.

| Khẳng định | Kết quả | Mức tin sau kiểm |
|---|---|---|
| TikTok tối đa 5 hashtag | Có, nguồn báo ngành | KN |
| Hình thu nhỏ Shorts, không A/B cho Shorts | Trang trợ giúp YouTube xác nhận; điều kiện là tài khoản đã xác minh, không phải kênh đối tác | CT |
| Shorts giảm phạm vi video tải lại (01/10/2026) | Chỉ có bài báo ngành dẫn lại | KN |
| Lượt xem tính từ khung đầu từ 24/08/2026 | Blog chính thức của YouTube | CT |
| Lượt xem Shorts từ 31/03/2025 | Đã có trang trợ giúp từ lần tra trước | CT |
| Đổi tên chính sách thành "inauthentic content" 15/07/2025 | Trang trợ giúp YouTube | CT |
| Người dẫn AI đưa lời khuyên tài chính không được kiếm tiền | Trang trợ giúp YouTube (mốc 07/2026 chưa xác nhận) | CT |
| Lời Rene Ritchie về chờ 24–48 giờ | Báo ngành dẫn nguyên văn lời người của YouTube | CT qua báo ngành |
| Meta "Rewarding Original Creators" 13/03/2026 | Trang tin chính thức của Meta | CT |
| Reels qua API 3–90 giây, 30 bài mỗi 24 giờ | Trang API của Meta (Claude đọc trực tiếp) | CT |
| Mọi video Facebook là Reels, không giới hạn độ dài | Trang tin chính thức của Meta | CT |
| TikTok Creator Rewards: video trên 1 phút; lượt xem từ 5 giây | Trang tin TikTok cho ý 1 phút; ý 5 giây theo điều khoản đã tra trước | CT |
| Facebook: dưới 10 giây không kiếm tiền, lượt xem dưới 5 giây không tính | Blog Meta (lần tra trước); phiếu này chỉ có blog bên thứ ba | CT |
| Ô "Video liên quan" cần quyền tính năng nâng cao | Trang trợ giúp YouTube | CT |
| TikTok có hướng dẫn chính thức về ảnh bìa, giờ đăng, tần suất | Không tìm thấy | Không có |
| Shorts có màn hình kết thúc, thẻ | Không có trang nói thẳng | Chưa rõ |
