# 14 — Rađa xu hướng & ý tưởng nội dung

> Đọc khi Trung nói "tìm ý tưởng đi", "có gì hot không", "dạo này người ta làm video kiểu gì", "kênh nào đáng xem", hoặc bất kỳ lúc nào mở một đợt làm mới sau thời gian nghỉ.
> **Phiên bản:** 1.4 · **Cập nhật:** 2026-10-29 · 1.4: thêm mục 8 bản đồ công cụ nghiên cứu kênh (san-trend 3.2, vidIQ, trendspyg). 1.3 · đổi tên từ `09_rada_xu_huong.md` khi dựng lại luồng Media (nội dung giữ nguyên; tên module trỏ chéo sửa theo `_bang_chuyen_module_2026.10.27.md`; chỗ lỗi thời đã nêu trong bản đồ quy trình được sửa bằng chữ).
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-10-26 · 1.2: mục 2 mô tả skill `san-trend` theo bản 2.0.0 (Facebook, chế độ tập trung theo chủ đề kèm lượt tìm hằng tháng, trang HTML thay báo cáo .md, sổ thói quen). 1.1: nối skill `san-trend` vào mục 2 (lấy trend Google, YouTube, TikTok tại Việt Nam bằng dữ liệu đo được).

## 0. Đây là công cụ chạy khi được gọi — không phải hệ theo dõi liên tục

Trung làm việc theo đợt, không đều, và project này chủ động **không dựng tác vụ định kỳ (scheduled task — tác vụ tự chạy theo lịch)**. Rađa xu hướng vì vậy phải hiểu đúng bản chất: đây KHÔNG phải một hệ thống canh tin 24/7, không có gì tự chạy nền, không có dữ liệu tích lũy âm thầm chờ sẵn. Nó là một **quy trình tra cứu** — mở ra khi Trung gõ lệnh, chạy một lượt, trả kết quả, rồi đóng lại.

Hệ quả khi thiết kế ba quy trình dưới đây: mỗi bước phải tự đứng được dù người gọi nó đã không đụng vào project vài tuần — không giả định "lần trước đã tra tới đâu rồi", không giả định có bộ nhớ về những gì đã xem hôm qua. Nguồn tra nêu ở mục 2–4 là nguồn ổn định (trang tin, kênh, hãng mô hình lớn), không phải một hàng đợi (queue) đang chờ xử lý.

## 1. Ba câu hỏi khác nhau — đừng trộn lẫn

"Tìm ý tưởng" nghe như một việc, nhưng thực ra trả lời ba câu hỏi khác hẳn nhau, mỗi câu cần cách săn riêng:

| Mảng | Câu hỏi trả lời | Kết quả dùng để làm gì |
|---|---|---|
| (a) Chủ đề nội dung | Nên làm video về **CHỦ ĐỀ** gì? | Chọn đề tài cho video kế tiếp |
| (b) Phong cách dựng | Video bây giờ **TRÔNG** như thế nào thì không bị cũ? | Cập nhật cách trình bày (màu, chữ, nhịp cắt...) mà không cần đổi nội dung |
| (c) Kênh/người đáng theo dõi | **AI nào, kênh nào** đang làm hay để học theo? | Có nguồn quan sát lâu dài, không phải tìm lại từ đầu mỗi lần |

Ba câu hỏi không loại trừ nhau — một lượt gọi rađa có thể tra cả ba — nhưng gộp chung thành "tìm ý tưởng chung chung" dễ khiến kết quả lẫn lộn: một chủ đề hay nhưng phong cách cũ, hoặc một kênh phong cách đẹp nhưng nội dung chẳng liên quan gì đến việc ngân hàng. Xem đúng mục 2/3/4 tương ứng.

## 2. Quy trình A — săn chủ đề nội dung

**Từ 26/10/2026 có skill `san-trend`** (`skills/san-trend/SKILL.md`): Trung nói "săn trend", "tìm trend", "đang hot gì" thì chạy skill đó. Skill lấy trend tìm kiếm Google, gợi ý tìm kiếm Google và YouTube, video xem nhiều tại Việt Nam (Playboard, NoxInfluencer, yt-dlp), TikTok Creative Center (kèm lọc ngành Tech & Electronics, Financial Services, Education) và bài viết Facebook tìm theo từ khoá, lọc theo lĩnh vực kênh. Từ bản 2.0.0 skill có hai chế độ: chế độ đầy đủ ("săn trend") lấy mọi nguồn; chế độ tập trung ("săn trend về <chủ đề>") bỏ trend đại chúng, chỉ đo các chủ đề Trung đặt, kèm lượt tìm kiếm hằng tháng đọc trên Google Ads Keyword Planner (chỉ có khoảng, ví dụ 1.000–10.000/tháng). Kết quả là trang HTML `san_pham/yyyy.mm.dd.bao_cao_trend_v<n>.html` chia bốn phần Google, YouTube, TikTok, Facebook, có ý tưởng kèm góc làm video và câu mở đầu 3 giây. Mỗi lượt ghi vào sổ thói quen `skills/san-trend/so_thoi_quen.jsonl`; script đề xuất thêm hoặc bỏ chủ đề theo dõi, đổi thứ tự nền tảng, ẩn loại ý tưởng Trung hay loại, Trung duyệt mới áp dụng. Skill dùng đúng ba tiêu chí sàng lọc và danh sách ý tưởng chờ làm (mục 6) của module này. Bảng "Nguồn nên tra" dưới đây vẫn dùng cho tin hãng mô hình AI, tin công nghệ và nội dung ngân hàng, là những thứ skill không lấy.

### Nguồn nên tra

| Loại nguồn | Ví dụ cụ thể | Tra để tìm gì |
|---|---|---|
| Thông báo chính thức của các hãng mô hình lớn | OpenAI News, Anthropic News, Google DeepMind Blog, Meta AI Blog | Tính năng/mô hình mới có khả năng đổi cách đồng nghiệp ngân hàng làm việc |
| Tin công nghệ tổng hợp | TechCrunch, The Verge (tiếng Anh); VnExpress mục Số hóa, Tinh tế (tiếng Việt) | Phản ứng thị trường, ứng dụng thực tế, tranh cãi đang được bàn tán |
| Diễn đàn nghề nghiệp | Hacker News, r/MachineLearning (Reddit), bài đăng của người làm AI/công nghệ tài chính trên LinkedIn | Góc nhìn người trong nghề, việc thật người ta đang thử — không phải tin PR |
| Nội dung ngân hàng/tài chính | Báo cáo ứng dụng AI trong ngân hàng của các hãng tư vấn lớn (McKinsey, BCG, Deloitte...), bản tin ngành ngân hàng, hội thảo chuyên đề | Góc áp dụng đúng bối cảnh ngân hàng đầu tư — thứ khiến đồng nghiệp thấy "liên quan tới mình" ngay |

Đây là danh mục NGUỒN để tra khi được gọi, không phải danh sách đã tra sẵn — mở rađa lần nào cũng bắt đầu lại từ việc ghé các nguồn này xem có gì mới, không có dữ liệu tồn kho chờ sẵn (xem mục 0).

### Sàng lọc — một tin có đáng làm video không

Mỗi tin tìm được, hỏi đủ ba câu sau trước khi đưa vào danh sách ý tưởng:

| Tiêu chí | Câu hỏi cụ thể | Không đạt thì sao |
|---|---|---|
| Liên quan công việc | Đồng nghiệp ngân hàng đầu tư có thấy liên quan tới việc của mình trong 5 giây đầu không? | Loại — đây là kênh lan tỏa AI cho dân ngân hàng, không phải kênh tin công nghệ nói chung |
| Làm được gì (actionable) | Người xem xong làm được một việc cụ thể — thử ngay một thao tác, đổi một thói quen — hay chỉ biết thêm một tin? | Loại hoặc hạ xuống dạng "biết cho vui", ưu tiên thấp hơn |
| Tuổi thọ | Chủ đề này còn đúng, còn liên quan sau một tuần không, hay chỉ đúng trong hôm nay? | Xem cảnh báo dưới đây trước khi quyết |

### Cảnh báo quan trọng nhất: tin công nghệ hot rất nhanh cũ

Đây là điểm phải nói thẳng vì nó chống lại bản năng "thấy tin hot thì làm ngay": tin công nghệ AI nóng hôm nay có thể nguội trong vài ngày, còn Trung làm theo đợt — dựng xong một video thường mất hơn một tuần tính từ lúc phát hiện ý tưởng tới lúc video sẵn sàng đăng. Nghĩa là **chạy theo tin nóng gần như chắc chắn cho ra video đã cũ khi phát hành**.

Vì vậy khi sàng lọc, **ưu tiên chủ đề có tuổi thọ dài hơn ưu tiên độ nóng**: một nguyên tắc dùng AI đúng cách, một thay đổi công cụ ảnh hưởng lâu dài tới cách làm việc, một câu hỏi mà nhiều đồng nghiệp cùng thắc mắc — những thứ này vẫn đúng sau một tháng. Một tin "hôm nay hãng X vừa ra mắt bản cập nhật Y" thì gần như chắc chắn cũ trước khi kịp render xong. Tin loại này chỉ đáng làm khi Trung chủ động muốn nhanh và chấp nhận rủi ro nguội.

### Quy trình từng bước

```
1. Ghé lần lượt các nguồn ở bảng "Nguồn nên tra"
        │
        ▼
2. Với mỗi tin/chủ đề thấy đáng chú ý → chấm 3 tiêu chí sàng lọc
        │
        ▼
3. Tin đạt cả 3 tiêu chí, ưu tiên tuổi thọ dài → giữ lại
   Tin chỉ nóng nhất thời → loại hoặc cảnh báo rõ rủi ro nguội nếu Trung vẫn muốn làm
        │
        ▼
4. Việc liên quan tới công việc ngân hàng cụ thể → đánh dấu cần soát theo 13_ban_quyen_va_bao_mat.md (mục 7)
        │
        ▼
   Ghi vào danh sách ý tưởng chờ làm (mục 6)
```

## 3. Quy trình B — săn phong cách dựng

Mảng này trả lời "video trông thế nào thì không cũ", KHÔNG phải "nội dung gì" — quan sát ở đây là quan sát bằng mắt (màu, chữ, chuyển động, nhịp cắt), không phải đọc tin.

**Quan sát mà không chạy theo mốt.** Một phong cách chỉ đáng cân nhắc khi nó **lặp lại qua nhiều nguồn khác nhau**, không phải vì một video tình cờ thấy đang viral. Khi lướt các kênh cùng lĩnh vực (xem mục 4) hoặc mạng xã hội, để ý xem có nhiều video độc lập cùng dùng một kiểu trình bày không — nhiều kênh cùng chuyển sang phụ đề chạy chữ theo cụm, nhiều video cùng dùng tông màu tối chữ nhấn màu neon... Một xu hướng thật là thứ **lặp lại**; một video đẹp đơn lẻ chỉ là một mẫu tham khảo, chưa phải xu hướng. Nhầm hai thứ này dễ khiến xưởng đổi phong cách liên tục theo từng video ngẫu nhiên gặp được, mất luôn cái nhất quán mà `11_hoc_phong_cach_tu_mau.md` mục 4 đang cố giữ (học nguyên tắc thị giác, không sao chép nguyên khuôn).

**Quy trình gửi mẫu tìm được sang `11_hoc_phong_cach_tu_mau.md`.** Rađa chỉ làm nhiệm vụ **phát hiện** — thấy một mẫu (video hoặc ảnh) đáng chú ý thì dừng ở đó, không tự ý bóc tách hay áp dụng luôn. Bóc tách thành thẻ phong cách dùng lại được là việc của module 11 (quy trình 5 bước ở đó: hỏi Trung thích điểm gì → thu thập mẫu → bóc tách kỹ thuật → rút thẻ → Trung duyệt). Vai trò của rađa trong chuỗi này chỉ là bước 0: mang mẫu về và hỏi Trung "cái này có đáng bóc tách không, thích điểm gì ở nó" — trả lời xong mới chuyển sang quy trình của 06.

## 4. Quy trình C — săn kênh/người đáng theo dõi

### Tiêu chí chọn kênh

| Tiêu chí | Vì sao quan trọng |
|---|---|
| Cùng lĩnh vực (AI, công nghệ, hoặc tài chính/ngân hàng ứng dụng AI) | Nội dung liên quan trực tiếp tới việc "lan tỏa AI cho dân ngân hàng" — không phải kênh giải trí nói chung |
| Chất lượng ổn định qua nhiều video, không phải một video ăn may | Một kênh đáng theo dõi lâu dài phải chứng minh được cách làm lặp lại được, không phải hên một lần |
| **Dựng bằng đồ họa động (motion graphics), không phải quay mặt người nói chuyện** | Đây là tiêu chí quan trọng nhất cho project này: dây chuyền của xưởng là dựng bằng mã (xem `12_cong_cu_media_ai.md` mục 1), nên chỉ kênh cùng kiểu dựng mới có phong cách **bắt chước được**. Kênh quay mặt người nói chuyện (talking head) có thể hay nhưng không giúp gì cho việc học cách dựng đồ họa |

### Nhịp xem lại hợp lý cho người làm theo đợt

Không cần xem hằng ngày hay theo dõi thông báo (subscribe/notification) của từng kênh — việc đó chính là kiểu "theo dõi liên tục" mà mục 0 đã nói rõ project này không làm. Nhịp hợp lý: **mỗi lần mở một đợt làm mới**, lướt qua toàn bộ danh sách một lượt (khoảng 15–20 phút), xem kênh nào có gì mới đáng chú ý, cập nhật cột "ngày xem lại gần nhất". Danh sách càng lâu không mở càng nên lướt kỹ hơn một chút vì khả năng có thay đổi phong cách tích lũy qua thời gian.

Danh sách kênh nằm ở `tai_san/danh_sach_kenh_theo_doi.md` — xem file đó để có bảng đầy đủ và cách cập nhật.

## 5. Quy trình gọi rađa gọn

Khi Trung nói kiểu "tìm ý tưởng đi", làm theo trình tự sau:

1. **Hỏi gọn trước khi tra** (tối đa 3 câu, theo đúng kiểu hỏi-kèm-đề-xuất ở `02_lam_ro_yeu_cau.md` mục 3, không hỏi dàn trải):
   - Mảng nào — chủ đề, phong cách, kênh, hay cả ba? (nếu Trung không nói rõ, đề xuất "cả ba, mỗi mảng vài ý" làm mặc định)
   - Cho kênh phát nào — nội bộ MB hay có thể công khai? (ảnh hưởng mức sàng lọc bảo mật cần soát sau này, xem mục 7)
   - Cần bao nhiêu ý tưởng? (đề xuất mặc định 3–5 ý tưởng mỗi mảng nếu không nói rõ)
2. **Tra theo đúng quy trình của mảng đã chọn** (mục 2/3/4 tương ứng).
3. **Trả kết quả dạng bảng ngắn**, mỗi ý tưởng một dòng: nội dung ý tưởng, nguồn, vì sao đáng làm (đối chiếu tiêu chí sàng lọc), và cờ cảnh báo nếu có (ví dụ "tin nóng, dễ cũ" hoặc "cần soát bảo mật").
4. **Hỏi Trung muốn giữ ý tưởng nào** — chỉ ý tưởng Trung xác nhận mới ghi vào danh sách chờ (mục 6); không tự động ghi hết mọi thứ tìm được.

## 6. Lưu kết quả — danh sách ý tưởng chờ làm

Ý tưởng đã chốt (Trung xác nhận muốn giữ) ghi vào **`kich_ban/_y_tuong_cho_lam.md`** — một file bảng duy nhất. Từ 27/10/2026 `kich_ban/` chỉ còn file này: ý tưởng thành video thì kịch bản viết vào thư mục video trong `san_pham/` (`AGENTS.md` mục Quy ước sản phẩm). Dấu gạch dưới đầu tên (`_y_tuong_cho_lam`) đánh dấu đây là danh sách quản lý chung, không phải một kịch bản, theo đúng quy ước gạch dưới đã dùng cho `_luu_tru/`, `_sao_luu_claude/` ở cấp project.

Cấu trúc bảng đề xuất:

| Ngày phát hiện | Mảng (chủ đề/phong cách/kênh) | Ý tưởng ngắn | Nguồn | Trạng thái | Đã soát 04 chưa |
|---|---|---|---|---|---|

Trạng thái gợi ý: `mới` → `đang cân nhắc` → `đã lên kịch bản` (kèm tên file kịch bản tương ứng) hoặc `loại` (kèm lý do ngắn, để lần sau không tốn công tra lại thứ đã loại). File này đã có (`kich_ban/_y_tuong_cho_lam.md`); thêm ý tưởng vào đó khi lượt gọi rađa có ý tưởng được Trung xác nhận giữ lại.

## 7. Bảo mật — bắt buộc trước khi biến ý tưởng thành video

Ý tưởng liên quan tới công việc ngân hàng cụ thể (số liệu, quy trình nội bộ, ví dụ khách hàng dù đã đổi tên) **phải soát theo `13_ban_quyen_va_bao_mat.md` trước khi biến thành kịch bản**, không phải chỉ soát ở khâu render cuối. Đặc biệt lưu ý câu hỏi cuối cùng ở file đó (mục 4): "có gì trong đây mà nếu người ngoài xem sẽ gây rắc rối cho Trung về nghề nghiệp không" — câu này áp dụng ngay từ lúc chọn ý tưởng, không đợi tới lúc video dựng xong mới hỏi.

## 8. Bản đồ công cụ nghiên cứu kênh (thêm 29/10/2026)

Đọc mục này khi Trung hỏi chung kiểu "tối ưu từ khoá", "SEO YouTube", "phát triển kênh", "đối thủ đang làm gì", "dùng công cụ gì để...", hoặc khi không chắc việc thuộc skill nào. Trung dùng nhiều project nên không nhớ hết công cụ: Claude chọn đúng dòng, nói một câu "việc này dùng X", rồi làm. Nguồn chọn công cụ: `~/Documents/Grok/Su dung grok/research/2026-10-29_cong-cu-nghien-cuu-kenh-video/99_final_report.md`.

| Việc Trung muốn | Dùng | Câu gọi mẫu | Chi phí, giới hạn |
|---|---|---|---|
| Chủ đề, từ khoá đang lên trên Google, YouTube, TikTok, Facebook (tuần, tháng, quý) | skill `san-trend` (chế độ đầy đủ) | "săn trend", "trend tháng này" | 30–60 phút; khoảng 1.800 đơn vị YouTube API |
| Từ khoá ngách của một chủ đề, lượt tìm Google hằng tháng | skill `san-trend` chế độ tập trung (Keyword Planner trên Chrome) | "tạo trend điện mặt trời áp mái", "từ khoá ngách của inverter" | Keyword Planner chỉ cho khoảng (1 N – 10 N) |
| Lượt tìm trên **YouTube** của một từ khoá, câu hỏi người xem hay gõ | vidIQ `vidiq_keyword_research` (`country: VN`; mode `questions` với `language: vi`) | "tra vidIQ lượt tìm của X" | 5 credit/lần. Từ rộng có số; từ ngách chỉ ra "<750" (kiểm 29/10/2026) |
| Đối thủ làm video nào hiệu quả theo chủ đề (video vượt trội so với chính kênh) | skill `san-trend`, bảng "Video vượt trội" (YouTube Data API) | "đối thủ làm gì hiệu quả về X", "video vượt trội về X" | Khoảng 230 đơn vị API mỗi chủ đề |
| Video tiếng Việt đang tăng lượt xem nhanh (lượt xem mỗi giờ) | vidIQ `vidiq_trending_videos` (`videoTitleLanguage: vi`, `channelCountry: VN`, `titleQuery` = chủ đề) | "video nào đang lên nhanh về X" | 5 credit/lần |
| Tìm kênh đối thủ cùng lĩnh vực | vidIQ `vidiq_similar_channels` (`niche`, `country: VN`, `language: vi`) | "tìm kênh đối thủ của Chuyện nghề Điện" | 5 credit/lần |
| Học cách làm hình thu nhỏ từ video vượt trội | skill `soi-hinh-thu-nho` | "soi thumbnail kênh X" | yt-dlp, không tốn API |
| Tiêu đề, mô tả, thẻ, hashtag có từ khoá đúng cho một video | skill `viet-chu-dang-video` (bước kiểm từ khoá) | "viết chữ đăng", "tối ưu từ khoá cho tiêu đề video X" | Tối đa 10 credit vidIQ mỗi video |
| Số liệu kênh của mình (lượt xem, người đăng ký) | thẻ chiến dịch của bảng video; YouTube Studio | "số liệu kênh" | YouTube Analytics API chưa gắn: chờ kênh đủ khoảng 20 video |
| Google Trends khi script săn trend báo lỗi phần Google | `trendspyg` (`~/.local/bin/trendspyg`) | tự dùng khi lỗi | `trendspyg rss --geo VN`; `trendspyg explore -k "<từ>" --geo VN --timeframe "today 3-m" --quiet` |
| Trend TikTok | TikTok Creative Center đọc trên Chrome (bước 2b của `san-trend`) | "trend TikTok" | TikTok không có API cho nhà sáng tạo; không dùng công cụ thu thập (trái điều khoản) |

**Quy tắc dùng vidIQ** (gói Free 150 credit/tháng, làm mới ngày 29 hằng tháng, 5 credit mỗi lần gọi; `vidiq_balance` không tốn credit):

- Công cụ `mcp__vidiq__*` chỉ có trong phiên mở sau 29/10/2026 (gắn bằng `claude mcp add --scope user`). Phiên không thấy công cụ thì chạy `claude -p "<việc>" --model sonnet --allowedTools "ToolSearch,mcp__vidiq__*"` trong thư mục tạm.
- Gọi `vidiq_balance` trước và sau; báo Trung số credit đã tốn. Một lượt quá 25 credit thì hỏi Trung trước.
- Không dùng `vidiq_outliers` (không nhận tiếng Việt) và phần Instagram, TikTok của vidIQ (vidIQ ghi dữ liệu lấy từ bên thứ ba và tự thu thập). Không dùng các công cụ tạo, đăng, sửa video, trả lời bình luận của vidIQ: đăng và sửa đi qua `dang-youtube`, `viet-chu-dang-video`.
- `vidiq_score_title` (chấm tiêu đề, 5 credit) chưa kiểm với tiêu đề tiếng Việt: chỉ dùng khi Trung yêu cầu, ghi kết quả vào `90_bai_hoc.md` lần đầu.
