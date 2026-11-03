---
name: san-trend
description: "Săn trend (tạo trend) và nghiên cứu từ khoá, đối thủ cho kênh: tìm kiếm Google, YouTube, TikTok và bài Facebook tại Việt Nam cho project Media theo khung tuần, tháng, quý (7/30/90 ngày), lọc theo lĩnh vực kênh (khoa học năng lượng, AI cho dân ngân hàng) hoặc tập trung vào chủ đề, từ khoá Trung chọn để tìm từ khoá ngách nóng nhất; Antigravity (Gemini) rà cùng độc lập có trích dẫn; kết quả gộp vào sổ trend có điểm độ nóng 0–100, hiện ở thẻ Trend của bảng video, kèm trang HTML có góc làm video và câu mở đầu 3 giây. YouTube lấy bằng YouTube Data API (video xem nhiều ở Việt Nam theo khung, độ vượt trội so với trung vị kênh để biết đối thủ làm video nào hiệu quả, video phổ biến Khoa học và Công nghệ); vidIQ (tuỳ chọn, tính credit) cho lượt tìm trên YouTube, video đang lên nhanh, kênh đối thủ; script lấy thêm nguồn không cần khoá (RSS và trang khám phá Google Trends, dự phòng trendspyg, gợi ý tìm kiếm Google và YouTube, Playboard, NoxInfluencer); Keyword Planner, TikTok Creative Center, tìm bài Facebook, Inspiration Hub của Trang Facebook đọc trên Chrome bằng phiên Trung đã đăng nhập; bản tin ngân hàng hằng tháng của Reputa (brandsvietnam.com) cho khung tháng. Dùng khi Trung nói: tạo trend, săn trend, tìm trend, săn trend về <chủ đề>, từ khoá ngách của <chủ đề>, trend tuần này, trend tháng, trend quý, lượt tìm kiếm của <chủ đề>, lượt tìm YouTube, tối ưu từ khoá kênh, nghiên cứu từ khoá, SEO YouTube, đối thủ làm video gì hiệu quả, video vượt trội về <chủ đề>, kênh đối thủ, vidIQ, Google Trends, đang hot gì, trend YouTube, trend TikTok, trend Facebook, sổ trend, người ta đang tìm gì, nên làm video về gì theo trend; và khi bảng video chuyển lệnh tạo trend. KHÔNG dùng cho: săn phong cách dựng hoặc kênh đáng theo dõi (module 14 mục 3, 4), tra công cụ media AI (module 12)."
version: 3.3.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-26
  de_xuat: san_pham/2026.10.26.de_xuat_skill_san_trend/2026.10.26.de_xuat_skill_san_trend_v1.md
  related_modules: [14_rada_xu_huong.md, 02_lam_ro_yeu_cau.md, 13_ban_quyen_va_bao_mat.md]
---

# Săn trend tìm kiếm và video tại Việt Nam

Skill này thay phần tra tay ở `14_rada_xu_huong.md` mục 2 (quy trình A, săn chủ đề nội dung) bằng dữ liệu đo được. Ba tiêu chí sàng lọc của module 14 (liên quan công việc, làm được gì, tuổi thọ) và danh sách `kich_ban/_y_tuong_cho_lam.md` giữ nguyên.

**Quyết định Trung đã chốt (26/10/2026)**, chi tiết ở `san_pham/2026.10.26.de_xuat_skill_san_trend/2026.10.26.de_xuat_skill_san_trend_v1.md` mục 4:

- Giữ lĩnh vực kênh hiện tại: khoa học năng lượng (pin mặt trời, điện gió, máy biến áp, inverter...) và AI cho dân ngân hàng. Trend đại chúng (giải trí, thể thao, người nổi tiếng) bị lọc khỏi phần đề xuất.
- Chỉ dùng nguồn không cần khoá API. Không có lượng tìm chính xác hay % tăng. (Ngoại lệ từ bản 3.2.0: YouTube Data API.)
- Chỉ chạy khi Trung gọi. KHÔNG cài lịch chạy tự động. Mỗi lượt lưu thêm một bản dữ liệu; script tự cộng dồn các lượt trước để biết từ nào lặp lại.
- TikTok: Claude chỉ đọc Creative Center trên Chrome bằng tài khoản Trung đã đăng nhập.
- Bản 2.0.0 (26/10/2026, Trung yêu cầu): kết quả là trang HTML bốn nền tảng (Google, YouTube, TikTok, Facebook), không còn file .md; có chủ đề Trung quy định (danh sách cố định cộng chủ đề gõ khi gọi) với lượt tìm hằng tháng lấy từ Keyword Planner trên Chrome; sổ thói quen ghi mỗi lượt, đề xuất chỉnh, Trung duyệt mới sửa.
- **Bản 3.0.0 (28/10/2026, Trung chốt qua bảng chọn)**: gọi bằng cả "săn trend" lẫn "tạo trend" (nâng cấp skill này, không tách skill mới). Khung tuần, tháng, quý lấy từ khung có sẵn của từng nguồn (Google Trends 7/30/90 ngày, TikTok 7/30/90 ngày, YouTube video đăng trong tuần/tháng/90 ngày, thay đổi 3 tháng của Keyword Planner); sổ trend cộng dồn các lượt. Antigravity rà độc lập có trích dẫn, Claude chạy script đối chiếu rồi mới gộp. Tìm ngách: script mở rộng từ khoá, Claude đưa 20–30 từ ngách tốt nhất vào Keyword Planner. Bảng video có thẻ Trend: ô nhập yêu cầu, sổ trend có bốn trường Trung nhập (trạng thái, ghi chú, nút nghiên cứu sâu, gắn video). Mỗi lần bấm trên bảng luôn chạy đầy đủ (Trung chọn, khác đề xuất hai mức), model mặc định Sonnet. Rà chung vẫn lọc theo lĩnh vực kênh; trend đại chúng vẫn ghi vào sổ ở nhóm riêng nhưng không thành ý tưởng.
- Facebook (thêm 26/10/2026 sau khi nghiên cứu, `san_pham/2026.10.26.de_xuat_skill_san_trend/2026.10.26.de_xuat_skill_san_trend_v1.md` mục 5): Facebook không có bảng trend công khai; Claude chỉ đọc kết quả tìm kiếm bài viết theo vài từ khoá lĩnh vực trên Chrome của Trung.
- **Bản 3.1.0 (29/10/2026, Trung chốt qua bảng chọn ở phiên META "Sử dụng Grok"; nghiên cứu `~/Documents/Grok/Su dung grok/research/2026-10-29_facebook-dang-bai-va-trend/99_final_report.md`)**: thêm hai nguồn Facebook miễn phí: Inspiration Hub trong bảng điều khiển chuyên nghiệp của Trang (bước 2d, đọc trên Chrome, chỉ đọc) và bản tin ngành BFSI (ngân hàng, tài chính, bảo hiểm) hằng tháng của Reputa, Trung tâm Dịch vụ dữ liệu và Trí tuệ nhân tạo Viettel, đăng trên brandsvietnam.com (bước 2e, cho khung tháng của kênh Chuyện nghề Ngân hàng). Giữ nguyên bước 2c đọc ô tìm kiếm bài viết. Không dùng dịch vụ thu thập Apify, Bright Data: Trung không chọn, trái điều khoản thu thập tự động của Meta.
- **Bản 3.2.0 (29/10/2026, Trung chốt qua bảng chọn ở phiên META; nghiên cứu `~/Documents/Grok/Su dung grok/research/2026-10-29_cong-cu-nghien-cuu-kenh-video/99_final_report.md`)**:
  - Nguồn `youtube_khung` gọi YouTube Data API (chỉ đọc) bằng khoá và token của skill `dang-youtube` (`~/.config/dang-youtube/client_secrets.json`, `request.token`; Claude không đọc nội dung hai file này). Không dùng yutu: yutu đăng nhập lỗi `redirect_uri_mismatch`. Mỗi từ khoá: `search.list` lọc Việt Nam, tiếng Việt, xếp theo lượt xem cho khung tuần và quý (khung tháng lọc từ kết quả quý); thêm độ vượt trội = lượt xem chia trung vị 30 video gần nhất của cùng kênh (20 kênh xuất hiện nhiều nhất), và 25 video phổ biến Việt Nam danh mục Khoa học và Công nghệ (danh mục Giáo dục trả 404 ở VN). Hạn mức 10.000 đơn vị/ngày dùng chung với việc tải video: một chủ đề khoảng 230 đơn vị (đo 29/10/2026), lượt đầy đủ 8 từ khoảng 1.800. API lỗi hoặc không có token thì script tự quay về đọc trang kết quả bằng yt-dlp; file ghi `nguon_du_lieu`.
  - Bước 3 phân tích: đọc bảng "Video vượt trội" trong `<tiền tố>_tong_hop.md`. Video từ 3 lần trung vị kênh trở lên là góc kể đã chứng minh có người xem; ưu tiên ý tưởng từ đây hơn trend tìm kiếm trong ngày.
  - vidIQ MCP gói Free (150 credit/tháng): gắn vào Claude Code phạm vi người dùng ngày 29/10/2026 (danh mục claude.ai bị tổ chức chặn); cách dùng ở bước 1c.
  - Google Trends dự phòng: `trendspyg` 1.9.0 (cài bằng uv, `~/.local/bin/trendspyg`, kiểm 29/10/2026 chạy được với VN). Khi phần Google Trends của `lay_trend.py` báo lỗi: `trendspyg rss --geo VN` (trend trong ngày) và `trendspyg explore -k "<từ khoá>" --geo VN --timeframe "today 3-m" --quiet` (độ quan tâm theo ngày, trả JSON; mở trình duyệt thật, 10–90 giây mỗi lần). Không sửa `lay_trend.py`.
  - Số liệu kênh của mình qua YouTube Analytics API (MCP `t4god/youtube-creator-mcp`): để sau khi kênh có khoảng 20 video.
- **Bản 3.3.0 (29/10/2026, Trung yêu cầu project tự nhận biết việc tối ưu từ khoá, săn trend)**: mô tả skill thêm tín hiệu tối ưu từ khoá, SEO YouTube, đối thủ, vidIQ; thêm bước 1c vidIQ (tuỳ chọn, tính credit; kiểm 29/10/2026: từ rộng có lượt tìm YouTube, từ ngách chỉ "<750", `vidiq_outliers` không nhận tiếng Việt); bước 3 đọc bảng video vượt trội. Bản đồ mọi công cụ nghiên cứu kênh: `14_rada_xu_huong.md` mục 8.

Bản đề xuất có ghi hai giới hạn cần nhắc Trung khi trình báo cáo. Thứ nhất, trend tìm kiếm trong ngày thường hết sau 1–3 ngày, còn một video của xưởng mất hơn một tuần từ ý tưởng tới lúc đăng. Thứ hai, bảng video xem nhiều tại Việt Nam phần lớn là giải trí, không khớp kênh.

## Hai chế độ gọi

| Trung nói | Chế độ | Script chạy gì |
|---|---|---|
| "săn trend", "tạo trend", "đang hot gì" (không kèm chủ đề) | Đầy đủ (rà chung) | Mọi nguồn, cộng các chủ đề trong danh sách cố định `chu_de_theo_doi`; trang khám phá Google Trends và YouTube theo khung dùng thêm `kham_pha_chung` |
| "tạo trend điện hạt nhân, pin natri", "tìm ngách của X", "tìm trend về X" | Tập trung | Google Trends RSS, phần riêng của từng chủ đề, trang khám phá theo khung, từ khoá ngách, YouTube theo khung; bỏ trend đại chúng (Playboard, NoxInfluencer, gợi ý từ gốc, gợi ý theo từ lĩnh vực) |

Danh sách chủ đề cố định nằm ở `chu_de_theo_doi` trong `tu_khoa_kenh.json`. Chủ đề Trung gõ khi gọi được theo dõi thêm ở lượt đó, cộng với danh sách cố định. Khung mặc định cả ba (tuần, tháng, quý); Trung nói rõ khung nào thì chỉ chạy khung đó (`--khung thang,quy`).

Một lượt đầy đủ gồm: bước 1 (script), bước 1b (Antigravity, chạy song song), bước 2 (Chrome, Reputa), bước 3 (phân tích), bước 4 (trang HTML và sổ trend), bước 5 (Trung chọn ý tưởng; bỏ khi chạy từ bảng video). Khi Trung gọi trong phiên, báo trước một dòng chi phí ước: 30–60 phút, tốn hạn mức Claude (ảnh chụp Chrome) và Gemini (Antigravity).

## Các bước một lượt

### Bước 1. Chạy script lấy dữ liệu

Tại gốc project Media, chạy nền (công cụ Bash với `run_in_background`):

```bash
python3 -I skills/san-trend/scripts/lay_trend.py --khung tuan,thang,quy                                  # rà chung, ước 8–10 phút
python3 -I skills/san-trend/scripts/lay_trend.py --chu-de "điện hạt nhân,pin natri" --khung tuan,thang,quy  # tập trung, ước 2–3 phút mỗi chủ đề
```

Đo 28/10/2026: một chủ đề, hai khung, các phần của chế độ tập trung mất 1 phút 55 giây (phần ngách 65 giây, khám phá 16 giây, YouTube theo khung 24 giây). Rà chung đủ ba khung chưa đo.

Script gọi lần lượt các phần, mỗi phần chịu lỗi riêng, giãn cách 1–2 giây giữa các lần gọi:

| Phần | Lấy gì | Ghi chú |
|---|---|---|
| `google_trends` | RSS `https://trends.google.com/trending/rss?geo=VN`: 10 từ khoá đang lên, lượng tìm dạng "200+", 3 bài báo mỗi từ | RSS bỏ qua mọi tham số lọc; chỉ có 10 mục mới nhất |
| `goi_y_google` | Gợi ý tìm kiếm Google (`suggestqueries`, `hl=vi&gl=VN`) cho bộ từ gốc ("cách làm", "là gì", "tại sao", "review") và từ lĩnh vực kênh | Chỉ chế độ đầy đủ |
| `goi_y_youtube` | Như trên với `ds=yt` | Chỉ chế độ đầy đủ |
| `playboard` | Video và Shorts xem nhiều nhất Việt Nam trong ngày, đọc từ khối `window.__NUXT__` | Chỉ chế độ đầy đủ. Đường dẫn là `viet-nam`, viết `vietnam` sẽ ra 404 |
| `noxinfluencer` | Video Việt Nam xem nhiều trong 24 giờ | Chỉ chế độ đầy đủ. Không đăng nhập chỉ có 5 mục |
| `chu_de` | Với từng chủ đề: gợi ý tìm kiếm Google và YouTube cho "<chủ đề>" và "<chủ đề> là gì", 8 video YouTube đăng trong tuần nhiều lượt xem nhất, chủ đề có nằm trong 10 từ khoá Google Trends không | Chỉ chạy khi có chủ đề |
| `ytdlp` | Thẻ của tối đa 8 video thịnh hành; mỗi từ lĩnh vực lấy 5 video đăng trong tuần nhiều lượt xem nhất | Chỉ chế độ đầy đủ. Cần yt-dlp (`~/.local/bin/yt-dlp`) |
| `kham_pha` (3.0) | Trang khám phá Google Trends cho từng từ khoá × khung: chuỗi mức quan tâm (đầu kỳ, cuối kỳ, tỉ lệ tăng), 25 truy vấn hàng đầu, 25 truy vấn tăng mạnh (% tăng; "Đột phá" là trên 5000%) | Từ khoá: chủ đề của lượt; chế độ đầy đủ thêm `kham_pha_chung`; tối đa 8 từ. Mở trang chủ lấy cookie trước; gặp 429 ba lần thì dừng cả phần |
| `ngach` (3.0) | Gợi ý tìm kiếm Google và YouTube cho "<chủ đề> + hậu tố" (10 từ hỏi như "là gì", "giá", "so sánh", cộng 17 chữ cái đầu từ); gợi ý có ở cả hai nền tảng hoặc lộ ra từ nhiều hậu tố xếp trước | Chỉ khi có chủ đề; khoảng 56 lần gọi mỗi chủ đề |
| `youtube_khung` (3.0, API từ 3.2) | Mỗi từ khoá × khung: 8 video đăng trong tuần / tháng / 90 ngày nhiều lượt xem nhất ở Việt Nam, kèm độ vượt trội so với trung vị kênh; 25 video phổ biến danh mục Khoa học và Công nghệ | YouTube Data API, khoảng 230 đơn vị mỗi từ khoá. Không có token hoặc API lỗi thì đọc trang kết quả bằng yt-dlp (không lọc nước, không có độ vượt trội) |

Tuỳ chọn: `--khung` chọn khung (mặc định `tuan,thang,quy`); `--chi`, `--bo` chọn phần; `--gian-cach 3` khi nghi bị chặn; `--gom-lai du_lieu/trend/<ngày>/<HHMM>` gom lại một lượt đã lưu mà không tải lại.

Kết quả ở `du_lieu/trend/yyyy-mm-dd/`, mỗi lượt có tiền tố giờ `HHMM_` (gọi là **tiền tố lượt**, script in ra ở trường `tien_to`): `HHMM_<phần>.json`, `HHMM_tong_hop.json`, `HHMM_tong_hop.md` (bản đọc cho Claude). `*_tho.html` chỉ có khi một trang đổi cấu trúc; khi đó mở `90_bai_hoc.md`, sửa hàm tách trong script, ghi bài học. Phần nào báo LỖI thì ghi rõ, không giấu.

### Bước 1b. Antigravity rà cùng (bản 3.0, chạy song song với bước 1 và 2)

Antigravity (agent Gemini, project TraCuu) tìm độc lập qua tin tức, bài viết và trang công khai, trả khẳng định kèm câu trích nguyên văn. Cách giao, mã thoát, điều kiện mở app: skill `giao-antigravity-tra-cuu` của META (đọc trước lần đầu trong phiên). Không đưa dữ liệu khách hàng vào phiếu.

```
A="/Users/macbooktrungnt/Documents/Grok/Su dung grok/scripts/giao_antigravity.sh"
T="/Users/macbooktrungnt/Documents/Antigravity/TraCuu"
K="/Users/macbooktrungnt/Documents/Antigravity/_chung/skills/kiem-trich-dan/scripts/kiem_trich_dan.py"
```

1. Ghi phiếu `"$T/dau_vao/<yyyymmdd_hhmmss>_ncuu.md"` theo khuôn `"$T/dau_vao/README.md"`: loại `nghien_cuu`, phạm vi `viet_nam`. Câu hỏi chính: "Từ khoá, chủ đề nào người Việt đang quan tâm tăng mạnh trên Google, YouTube, TikTok, Facebook trong <các khung của lượt>, thuộc <chủ đề của lượt; rà chung thì lĩnh vực kênh>?". Câu hỏi con: (1) theo từng khung, từ khoá hoặc chủ đề nào được báo chí, trang thống kê ghi nhận tăng mạnh, trên nền tảng nào, số liệu nếu có; (2) trong chủ đề, ngách hẹp nào (từ khoá con, câu hỏi cụ thể) được nhắc nhiều; (3) sự kiện nào (chính sách, dự án, giá) làm chủ đề nóng lên. Mốc thời gian: chỉ nhận nguồn đăng trong 90 ngày gần nhất. Số nguồn tối đa 15, hạn 35 phút. Phần ngữ cảnh ghi: mỗi khẳng định thêm ba trường `tu_khoa` (viết như người dùng gõ), `nen_tang` (danh sách trong google, youtube, tiktok, facebook), `khung` (tuan, thang hoặc quy); được mở bằng trình duyệt các trang công khai `trends.google.com/trends/explore?geo=VN`, `youtube.com`, `ads.tiktok.com/creative/creativeCenter` nhưng không đăng nhập, không điền biểu mẫu.
2. Giao ngay đầu lượt, chạy nền (Bash `run_in_background`): `"$A" "Làm phiếu dau_vao/<mã>.md" --project TraCuu --model flash --gio 2400 --im`. App Antigravity tắt thì mở app theo skill `giao-antigravity`; không mở được thì ghi `<tiền tố>_antigravity.json` với `"trang_thai": "bo_qua"` và làm tiếp.
3. Làm bước 1, 2 trong lúc chờ. Trước bước 3, chờ `"$T/ket_qua/<mã>/ket_qua.json"` xuất hiện bằng vòng Bash (`for i in $(seq 1 55); do [ -f "<file>" ] && break; sleep 10; done`, mỗi lệnh dưới 10 phút, tối đa 4 vòng). Không có sau 40 phút thì ghi `"trang_thai": "het_gio"` và làm tiếp. Mã thoát 4 thì đọc lại bằng `--doc`, không giao lại.
4. Kiểm lại độc lập rồi chuyển vào lượt:
   ```bash
   python3 -I "$K" kiem "$T/ket_qua/<mã>/ket_qua.json" --ra "$T/ket_qua/<mã>/kiem_tra_claude.json"
   python3 -I skills/san-trend/scripts/so_trend.py antigravity --ket-qua "$T/ket_qua/<mã>" --tien-to du_lieu/trend/<ngày>/<HHMM>
   ```
   Lệnh thứ hai báo các khẳng định thiếu `tu_khoa`: Claude điền tay vào `<tiền tố>_antigravity.json` (đọc trường `mo_ta`). Khẳng định `can_kiem_tay` thì Claude mở URL đối chiếu câu trích; khớp thì đổi `kiem` thành `da_kiem_tay`, không khớp thì `khong_dat`. Sổ trend chỉ lấy `dat`, `dat_ban_luu`, `da_kiem_tay`.

### Bước 1c. vidIQ (tuỳ chọn, tính credit; thêm 29/10/2026)

Chạy khi Trung nhắc vidIQ, lượt tìm YouTube, kênh đối thủ, hoặc chế độ tập trung có chủ đề rộng. Quy tắc credit và giới hạn đã kiểm ở `14_rada_xu_huong.md` mục 8 (gói Free 150 credit/tháng, 5 credit mỗi lần, quá 25 credit một lượt thì hỏi Trung). Gọi `vidiq_balance` trước và sau.

1. `vidiq_keyword_research` mode `research`, `country: "VN"`, mỗi chủ đề một lần: lấy `estimatedMonthlySearch`, `searchDemandGrowthPct`, `competition`. Từ ngách thường chỉ ra "<750"; khi đó dùng Keyword Planner (bước 2a).
2. `vidiq_trending_videos` cho chủ đề chính: `videoFormat` long (hoặc short khi làm video dọc), `titleQuery` = chủ đề, `videoTitleLanguage: "vi"`, `channelCountry: "VN"`, `sortBy: "vph"`.
3. Khi Trung hỏi kênh đối thủ: `vidiq_similar_channels` chế độ `niche` (lĩnh vực kênh), `country: "VN"`, `language: "vi"`.

Ghi `<tiền tố lượt>_vidiq.json` (`thoi_diem`, `credit_truoc`, `credit_sau`, `tu_khoa`, `video_dang_len`, `kenh_doi_thu`). Không dùng `vidiq_outliers` (không nhận tiếng Việt); độ vượt trội đã có ở bảng YouTube Data API của bước 1.

### Bước 2. Các nguồn đọc tay (chỉ đọc)

Nguồn 2a–2d cấm hoặc không có cách lấy bằng script, nên Claude mở trên Chrome của Trung bằng Claude in Chrome. Nguồn 2e là trang công khai, đọc bằng WebFetch. Nạp công cụ một lần: `ToolSearch` với `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__find,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__tabs_close_mcp`. Mỗi nguồn ghi một file JSON theo `skills/san-trend/cau_truc_du_lieu.md`, cùng tiền tố lượt. Xong nguồn nào đóng thẻ nguồn đó.

**Quy tắc dừng chung, không có ngoại lệ.** Gặp màn hình đăng nhập, xác minh danh tính, CAPTCHA, hộp hỏi đồng ý điều khoản, cảnh báo "hoạt động bất thường" hoặc "dùng tính năng này quá nhanh": dừng ngay, không bấm gì, ghi `trang_thai` là `dung_xac_minh`, báo Trung. Claude không tự đăng nhập, không điền mật khẩu, không giải CAPTCHA, không đổi cài đặt tài khoản, không chuyển giữa tài khoản cá nhân và Trang. Claude in Chrome không kết nối được thì ghi `bo_qua` và làm tiếp.

#### 2a. Lượt tìm hằng tháng: Google Ads Keyword Planner (chỉ khi có chủ đề)

Trung đã có tài khoản Google Ads (kiểm 26/10/2026). Tài khoản chưa chạy quảng cáo chỉ thấy khoảng ("1 N – 10 N" = 1.000–10.000 lượt/tháng); cột thay đổi 3 tháng và cùng kỳ thường là 0%.

1. `navigate` tới `https://ads.google.com/aw/keywordplanner/home`. Có hộp thông báo tính năng mới thì bấm "Tôi hiểu".
2. Bấm "Nhận thông tin dự đoán và lượng tìm kiếm". Gõ các chủ đề vào ô, cách nhau dấu phẩy; mỗi chủ đề gõ hai dạng: "<chủ đề>" và "<chủ đề> là gì". Bấm "Bắt đầu".
3. Chờ 8 giây, chụp màn hình (`scale` 0.6). Vị trí mặc định là Việt Nam. Đọc mỗi dòng: từ khoá, số lần tìm kiếm trung bình hằng tháng, thay đổi trong ba tháng, thay đổi so với cùng kỳ, cạnh tranh.
4. **Từ khoá ngách (bản 3.0, chế độ tập trung):** sau bước 1, chọn 20–30 từ ngách tốt nhất từ phần "Từ khoá ngách" và "Truy vấn tăng mạnh" trong `<tiền tố>_tong_hop.md` (ưu tiên câu hỏi bền, có ở cả Google lẫn YouTube, đúng chủ đề), gõ cùng chủ đề vào một lần tra (ô "Nhận thông tin dự đoán và lượng tìm kiếm" nhận 25 từ một lần, kiểm 28/10/2026). Dòng của từ ngách ghi thêm `"loai": "ngach"`, của chủ đề ghi `"loai": "chu_de"`. Bảng kết quả chỉ vẽ các dòng đang hiện: đọc bằng `javascript_tool` (lấy các phần tử `[role="row"]`, cuộn khung bảng từng đoạn rồi gom), `get_page_text` chỉ ra dải thông báo đầu trang. Có dải "Điều khoản và điều kiện được cập nhật" thì để nguyên, không bấm "Khắc phục vấn đề" (chấp nhận điều khoản là việc của Trung).
5. Ghi `<tiền tố lượt>_keyword_planner.json`. Không bấm "Tạo chiến dịch", không nhập gì về thanh toán. Mỗi lần tra, Google Ads tự lưu một "kế hoạch" nháp trong tài khoản; kế hoạch này không tốn tiền, Trung xoá tay khi muốn.

#### 2b. TikTok Creative Center (một lần mỗi lượt)

Điều khoản TikTok (01/12/2025, mục 5) cấm script tự động thu thập dữ liệu. Trung đã đăng nhập TikTok for Business (26/10/2026); chưa đăng nhập thì trang chỉ hiện 3 hashtag và 4 video, ghi `chua_dang_nhap`.

1. `navigate` tới `https://ads.tiktok.com/creative/creativeCenter/trends/hashtag?countryCode=VN&period=7&region=VN`, chờ 5 giây. Bản 3.0: đọc bảng ngành "All" theo từng khung của lượt, đổi `period=7` (tuần), `period=30` (tháng), `period=90` (quý; ô chọn của trang có 7, 30, 90 ngày, kiểm 28/10/2026; `period=120` bị trả về 7 ngày); mỗi dòng hashtag và mỗi dòng `chu_de` ghi thêm `"ky": "7"`, `"30"` hoặc `"90"`. Đọc theo ngành (bước 3 dưới đây) chỉ làm ở kỳ dài nhất của lượt.
2. Đọc bảng hashtag ngành "All": bảng chỉ giữ các dòng đang hiện. Cách đỡ tốn nhất (28/10/2026): `javascript_tool` cuộn `window.scrollBy(0, 500)` từng nhịp 0,7 giây, mỗi nhịp tách `main.innerText` theo mẫu "hạng / #hashtag / ngành / số bài Posts / lượt xem Views" rồi gom, trả JSON (không trả chuỗi dạng `khoá=giá trị`, công cụ chặn vì giống cookie). Cuộn bằng `computer` thì mỗi lần trả kèm ảnh chụp, tốn hạn mức. Đã đăng nhập thì bảng có hơn 20 dòng; lấy 20 dòng đầu.
3. Đọc thêm theo ngành (chế độ đầy đủ và tập trung đều làm): bấm ô chọn ngành (ô đầu tiên dưới ba ô Hashtag/Creator/Video), chọn lần lượt "Tech & Electronics", "Education" (ngành "Financial Services" không còn trong ô chọn từ 28/10/2026); mỗi ngành chỉ cần trả các dòng có từ thuộc chủ đề hoặc lĩnh vực kênh, cộng vài dòng đầu. Ngày 26/10/2026 ngành "Tech & Electronics" có #claude (636 bài, 5,1 triệu lượt xem), #aiagent.
4. Chủ đề: Creative Center không có ô tìm hashtag theo tên, và đường dẫn trang chi tiết hashtag ngoài danh sách ra 404. Với mỗi chủ đề, dò trong các bảng đã đọc hashtag chứa chủ đề (viết liền, không dấu, ví dụ "điện hạt nhân" → #dienhatnhan); thấy thì ghi vào `chu_de`, không thấy thì ghi `ghi_chu` "không có trong top hashtag các ngành đã đọc".
5. Chế độ đầy đủ đọc thêm tab video: `https://ads.tiktok.com/creative/creativeCenter/trends/video?countryCode=VN&period=7&region=VN`. Trang chỉ có tên tài khoản, người theo dõi, lượt xem, ngành; không có chữ mô tả. Không bấm "View details", "View more".
6. Ghi `<tiền tố lượt>_tiktok.json`; bảng hashtag theo ngành gộp vào `hashtag`, ghi ngành ở trường `nganh`.

#### 2c. Facebook: tìm bài viết theo từ khoá

Facebook không có bảng trend công khai (bỏ mục Trending từ 2018, đóng CrowdTangle 14/08/2024). Inspiration Hub đọc ở bước 2d. Điều khoản Meta (07/10/2024) cấm thu thập tự động khi chưa có văn bản cho phép, và đây là tài khoản cá nhân Trung dùng hằng ngày, nên tổng số trang tìm kiếm mở mỗi lượt **không quá 6**.

1. Từ khoá: chế độ tập trung dùng các chủ đề; chế độ đầy đủ dùng `facebook_tim` trong `tu_khoa_kenh.json`, cộng chủ đề cố định nếu còn chỗ trong giới hạn 6.
2. Mỗi từ: `navigate` tới `https://www.facebook.com/search/posts/?q=<từ khoá mã hoá URL>`, chờ 4–5 giây, chụp màn hình (`scale` 0.5) và `get_page_text`. Không cuộn, không bấm "Xem thêm", không bấm vào bài. Giữa hai từ chờ thêm 5–10 giây.
3. Ghi mỗi bài: trang hoặc người đăng, ngày, câu đầu nội dung, lượt cảm xúc, bình luận hoặc chia sẻ. Chữ từ `get_page_text` lẫn ký tự rác (chuỗi chữ cái rời, dòng "Facebook" lặp); ngày đăng thường chỉ đọc được trên ảnh chụp. Bỏ bài tuyển dụng, quảng cáo bán hàng.
4. Ghi `<tiền tố lượt>_facebook.json`.

Chrome đang dùng Facebook bằng Trang thì nhắc Trung chuyển về tài khoản cá nhân rồi mới đọc; Claude không tự chuyển. Đã gặp xác minh ở một lượt thì các lượt sau bỏ Facebook (`bo_qua`) cho tới khi Trung bảo làm lại; bỏ luôn cả bước 2d.

#### 2d. Facebook: Inspiration Hub của Trang (thêm 29/10/2026)

Inspiration Hub là mục trong bảng điều khiển chuyên nghiệp (professional dashboard) của Trang Facebook, gợi ý Reels, hashtag, âm thanh đang lên theo danh mục của Trang. Miễn phí, chỉ đọc. Dùng Trang của đúng kênh đang rà (rà chung: Trang Chuyện nghề Điện). Cùng giới hạn của bước 2c: tài khoản thật của Trung, nên chỉ mở trang Inspiration Hub và tối đa 2 thẻ con (hashtag, Reels); không bấm vào Reels, không bấm "Tạo", không lưu, không theo dõi.

1. Chạy sau bước 2c. Bảng điều khiển chuyên nghiệp chỉ mở được khi Facebook đang dùng bằng Trang. Chrome đang ở tài khoản cá nhân thì ghi `trang_thai` là `can_trung_chuyen`, nhắc Trung một dòng ("chuyển Facebook sang Trang <tên> nếu muốn đọc Inspiration Hub") rồi làm tiếp bước khác; Claude không tự chuyển giữa tài khoản cá nhân và Trang (quy tắc dừng chung). Lượt chạy từ bảng video không hỏi, ghi `can_trung_chuyen`.
2. Facebook đang dùng bằng Trang: `navigate` tới `https://www.facebook.com/professional_dashboard`, chờ 5 giây, `find` mục "Inspiration Hub" (bản tiếng Việt có thể là "Nguồn cảm hứng") rồi bấm. Gặp màn hình xác minh hay hộp đồng ý thì dừng theo quy tắc dừng chung.
3. Chụp màn hình (`scale` 0.5), `get_page_text`. Ghi: danh mục Trang trang hiển thị, hashtag đang lên (kèm số liệu nếu có), Reels gợi ý (Trang đăng, câu đầu nội dung, lượt xem). Âm thanh đang lên chỉ ghi khi liên quan lĩnh vực.
4. Ghi `<tiền tố lượt>_facebook_hub.json` (`cau_truc_du_lieu.md`). Hashtag vào sổ trend ở nền tảng Facebook, như hashtag TikTok.

**Kết quả kiểm** (ghi mỗi lần thay đổi): 26/10/2026, Trang "Đầu tư tài chính" của Trung: Inspiration Hub mở được nhưng chỉ có 5 bài nhạc gợi ý, không có hashtag, Reels. Chưa kiểm với Trang Chuyện nghề Điện; các nguồn nói về Inspiration Hub là tin ra mắt 2021–2023, chưa có nguồn xác nhận mục hashtag, Reels có ở Việt Nam. **Lần chạy đầu với Trang Chuyện nghề Điện ghi kết quả vào đây** (đường dẫn thật của trang, các thẻ con có gì). Nếu lại chỉ có nhạc: ghi ngày, đặt 2d mặc định `bo_qua`, báo Trung.

#### 2e. Reputa: bản tin ngành BFSI hằng tháng (thêm 29/10/2026)

Reputa (nền tảng lắng nghe mạng xã hội của Trung tâm Dịch vụ dữ liệu và Trí tuệ nhân tạo Viettel) đăng hằng tháng trên brandsvietnam.com bảng xếp hạng thương hiệu ngành BFSI (ngân hàng, tài chính, bảo hiểm): tổng lượt đề cập (ví dụ 170.374 lượt tháng 02/2026), ngân hàng được nhắc nhiều, nhóm chủ đề được bàn. Số gộp nhiều nền tảng mạng xã hội và báo, không riêng Facebook. Không có bản cho điện, bất động sản. Bản mới nhất tìm thấy ngày 29/10/2026 là bản 04/2026, nên số thường trễ vài tháng.

1. Chạy khi lượt có khung tháng hoặc quý, và lượt rà chung hoặc chủ đề thuộc kênh Chuyện nghề Ngân hàng (ngân hàng, tài chính, bảo hiểm). Lượt chỉ khung tuần bỏ qua.
2. WebSearch `Reputa BFSI site:brandsvietnam.com` (kèm tháng gần nhất), lấy bài mới nhất. WebFetch trang bài; trang chặn thì mở bằng Chrome (trang công khai, không đăng nhập).
3. Ghi: kỳ (tháng của số liệu), ngày đăng, tổng lượt đề cập, các nhóm chủ đề và lượt đề cập, 5–10 ngân hàng đứng đầu. Bài là của Brands Vietnam và Reputa: chỉ ghi số và tên chủ đề, không chép đoạn văn.
4. Ghi `<tiền tố lượt>_reputa.json`. Chủ đề vào sổ trend ở khung tháng, nguồn `reputa`, làm bằng chứng; điểm độ nóng chưa tính lượt đề cập Reputa (số trễ vài tháng).
5. Bước 3 dùng Reputa để biết chủ đề ngân hàng nào được bàn nhiều trong tháng, rồi đối chiếu với Google Trends, Keyword Planner của cùng chủ đề trước khi đề xuất ý tưởng. Đưa số Reputa lên video thì theo quy tắc cứng 3 của `AGENTS.md` (phải có nguồn thứ hai).

### Bước 3. Phân tích (Claude làm)

Đọc `<tiền tố lượt>_tong_hop.md`, các file bước 2 (Keyword Planner, TikTok, Facebook, Inspiration Hub, Reputa), `<tiền tố>_antigravity.json`, và `du_lieu/bang_video/trend_nhap.json` (trạng thái Trung đặt trên thẻ Trend: từ khoá `bo` không đưa vào ý tưởng, từ khoá `theo_doi` kiểm lại trong lượt này, từ khoá `lam_video` đã có video). Script đã gom trùng, gắn loại sơ bộ, đánh dấu khớp lĩnh vực, đếm số lượt trước đã gặp. Claude làm phần cần đọc hiểu:

1. **Phân loại lại** mỗi mục đáng chú ý: *câu hỏi bền* ("là gì", "cách...", "tại sao", so sánh, hướng dẫn; còn đúng sau một tháng), *tin nóng* (thời sự, thể thao, người nổi tiếng; cờ nguội nhanh), *giải trí* (cờ nguội nhanh).
2. **Lọc theo lĩnh vực kênh** (khoa học năng lượng, AI cho dân ngân hàng). Tin nóng ngoài lĩnh vực mà nối được sang lĩnh vực bằng một câu hỏi bền thì đề xuất câu hỏi bền đó.
3. **Bỏ khớp nhầm** (ví dụ "pin" của điện thoại, "AI" trong tên người, "Claude" trong tên diễn viên).
4. **Chấm ba tiêu chí của `14_rada_xu_huong.md` mục 2**: liên quan công việc, làm được gì, tuổi thọ. Chế độ tập trung: mỗi chủ đề Trung gõ phải có ít nhất một ý tưởng hoặc một câu nói rõ vì sao không có. Ưu tiên câu hỏi bền, chủ đề có lượt tìm cao hơn, mục xuất hiện ở từ hai nền tảng.
4b. **Đọc bảng "Video vượt trội"** (bản 3.2) trong `<tiền tố lượt>_tong_hop.md`: video từ 3 lần trung vị kênh trở lên là góc kể đã có người xem thật; mỗi ý tưởng nên có ít nhất một video vượt trội làm bằng chứng nếu bảng có. Có `<tiền tố>_vidiq.json` thì thêm lượt tìm YouTube và mức tăng vào bằng chứng.
5. **So khung (bản 3.0):** từ khoá nóng ở khung tuần mà nguội ở khung quý là tin nóng; nóng đều cả ba khung thường là câu hỏi bền, nên ưu tiên. Mục Antigravity xác nhận và script cũng thấy thì ghi rõ "hai nguồn độc lập".
6. Ghi `<tiền tố lượt>_phan_tich.json`: kết luận 3–5 câu (nêu cả nguồn nào lỗi hoặc thiếu), danh sách ý tưởng (mỗi ý có số liệu, bằng chứng, góc làm video, câu mở đầu 3 giây, rủi ro), đoạn "đã loại".

### Bước 4. Vẽ trang HTML, dựng lại sổ trend

```bash
python3 -I skills/san-trend/scripts/ve_trang.py --tien-to du_lieu/trend/<ngày>/<HHMM>
python3 -I skills/san-trend/scripts/so_trend.py dung --top 10
```

Lệnh thứ hai dựng lại `du_lieu/trend/so_trend.json` từ mọi lượt đã lưu (nguồn sự thật là dữ liệu thô, chạy lại bao nhiêu lần cũng ra cùng kết quả) và in 10 từ khoá điểm cao nhất. Điểm độ nóng 0–100 = 0,4 × tăng + 0,3 × quy mô + 0,2 × lan toả + 0,1 × lặp lại; công thức đầy đủ ở đầu `scripts/so_trend.py`. Đây là chỉ số xếp thứ tự trong sổ, không phải lượng tìm thật; khi báo Trung thì nói kèm bằng chứng (ví dụ "Google Trends 90 ngày +650%"). Bảng video đọc sổ này ở thẻ Trend.

Script ghi `san_pham/yyyy.mm.dd.bao_cao_trend/yyyy.mm.dd.bao_cao_trend_v<n>.html` (mỗi ngày một thư mục, tự tăng `v<n>` trong ngày, bản cũ hơn trong ngày tự chuyển vào `tai_nguyen/phien_ban_cu/`) và in đường dẫn. Trang tự chứa, không tải gì từ mạng, có các phần: kết luận, chủ đề theo dõi (lượt tìm/tháng, Google Trends, TikTok, Facebook, YouTube cho từng chủ đề), ý tưởng đề xuất, bốn phần nền tảng Google, YouTube, TikTok, Facebook theo thứ tự `thu_tu_nen_tang`, trạng thái nguồn. Báo xong thì kèm lệnh mở:

```bash
open "/Users/macbooktrungnt/Documents/VideoNganHang/san_pham/<yyyy.mm.dd>.bao_cao_trend/<tên file>.html"
```

### Bước 5. Trung chọn ý tưởng, ghi sổ thói quen

1. Hỏi Trung bằng bảng chọn (AskUserQuestion, chọn nhiều) giữ ý tưởng nào. Ý tưởng được giữ ghi vào `kich_ban/_y_tuong_cho_lam.md` theo bảng ở `14_rada_xu_huong.md` mục 6 (tạo file nếu chưa có); dính công việc ngân hàng cụ thể thì cột "Đã soát 04 chưa" ghi "cần soát".
2. Ghi một lượt vào sổ thói quen (cấu trúc ở `cau_truc_du_lieu.md`; ý tưởng không được chọn ghi `"giu": false`):
   ```bash
   python3 -I skills/san-trend/scripts/so_thoi_quen.py ghi --json '<bản ghi>'
   ```
3. Xem đề xuất:
   ```bash
   python3 -I skills/san-trend/scripts/so_thoi_quen.py de-xuat
   ```
   Có đề xuất thì hỏi Trung bằng bảng chọn (mỗi đề xuất một phương án, nói rõ lý do script đưa ra). Chỉ đề xuất Trung chọn mới áp dụng:
   ```bash
   python3 -I skills/san-trend/scripts/so_thoi_quen.py ap-dung --ma "<mã>,<mã>"
   ```
   Script đề xuất bốn loại: thêm chủ đề Trung đã gõ từ 2 lượt vào danh sách cố định; bỏ chủ đề cố định 4 lượt liền không sinh ý tưởng được giữ; xếp lại thứ tự nền tảng trên trang theo số ý tưởng được giữ (từ 5 ý tưởng); ẩn một loại ý tưởng bị loại hết trong 5 lượt có loại đó. Không có đề xuất thì không hỏi.
4. Commit `skills/san-trend/so_thoi_quen.jsonl` và `tu_khoa_kenh.json` nếu đổi.

## Chạy từ bảng video (bản 3.0)

Thẻ Trend của bảng video (`scripts/bang_video/`, trang `http://localhost:4580/#trend`) có ô nhập yêu cầu (chủ đề, khung, nền tảng, mục đích, model) và nút "Nghiên cứu sâu" trên từng dòng sổ. Bấm là máy chủ xếp một lệnh vào cùng hàng lệnh với các video rồi mở một phiên chạy nền `claude --bg --chrome` (chế độ quyền auto, Trung xem và trả lời được ngay trong phiên; từ 28/10/2026, sổ nợ N58 đợt 2). Không mở được phiên nền (ví dụ thư mục Media chưa được chấp nhận tin cậy) thì máy chủ lùi về `claude -p --chrome` không tương tác như trước. Lời nhắc ở hàm `loiNhacTrend` trong `scripts/bang_video/may_chu.mjs`, có hai bản theo hai kiểu chạy. Lượt đó làm đủ bước 1 tới 4 như trên, với các điểm khác:

- Chỉ chạy nguồn của nền tảng Trung tích. Google: RSS, gợi ý Google, khám phá, Keyword Planner. YouTube: gợi ý YouTube, Playboard, NoxInfluencer, YouTube theo khung, yt-dlp. TikTok, Facebook: phần Chrome tương ứng (Facebook gồm 2c, 2d, và 2e Reputa khi lượt có khung tháng hoặc quý). Dùng `--bo` của `lay_trend.py` để bỏ phần không cần.
- Bỏ bước 5: không hỏi bảng chọn ý tưởng, không ghi sổ thói quen, không sửa `tu_khoa_kenh.json`.
- Phần cần Trung quyết: phiên nền hỏi bằng bảng hỏi tích chọn rồi chờ, thẻ hiện nhãn "Đang chờ Trung"; lượt chạy ẩn ghi câu hỏi dưới dòng "CẦN TRUNG TRẢ LỜI:", Trung trả lời trên thẻ Trend, lượt sau chạy tiếp đúng phiên cũ.
- Tạo trend chỉ một lượt một lúc (cùng dùng Chrome), dù bảng cho tối đa 3 lệnh video chạy cùng lúc.
- Báo cáo cuối tối đa 12 dòng: nguồn đạt hoặc lỗi, số mục Antigravity đạt đối chiếu, 5 từ khoá điểm cao nhất thuộc nhóm chủ đề hoặc lĩnh vực kèm bằng chứng, đường dẫn trang HTML.

Trạng thái, ghi chú, video gắn với từng từ khoá do Trung nhập trên thẻ Trend nằm ở `du_lieu/bang_video/trend_nhap.json` (vào git); script không ghi vào file đó. Cấu trúc: `cau_truc_du_lieu.md`.

Làm video từ một ý tưởng đã giữ là việc khác: đi qua `02_lam_ro_yeu_cau.md` và hai cửa chọn phong cách ở `03_kich_ban_va_loi_viet.md` và `04_he_truc_dung.md` như mọi video.

## Giới hạn đã biết (kiểm 26/10/2026, bổ sung 28/10/2026)

- Trang khám phá Google Trends (bản 3.0) không có tài liệu chính thức; gọi nhanh sẽ bị 429. Mức quan tâm 0–100 là số tương đối trong từng khung và từng từ khoá, không so được giữa hai từ khoá khác lần gọi. Dữ liệu là mẫu: khung 7 ngày dao động giữa hai lần gọi cách nhau 15 phút (28/10/2026, thứ hạng tỉnh cho "điện gió" đổi từ Ninh Thuận 100 sang Điện Biên 100); khung 30 và 90 ngày ổn định hơn (khớp từng số). Không đưa số khung 7 ngày lên video. Khẳng định Google Trends của Antigravity (trang không tải được bằng script kiểm trích dẫn) thì Claude gọi lại API trang khám phá để đối chiếu.
- Khung quý không có sẵn ở mọi nguồn: YouTube lọc "năm nay" rồi cắt 90 ngày theo ngày đăng (chỉ trong 12 video đầu) (TikTok có sẵn 90 ngày), Keyword Planner dùng thay đổi 3 tháng.
- Antigravity dùng chung hạn mức Gemini với lô bố cáo; app phải mở. Phiếu trước 28/10/2026 không có trường `tu_khoa`.
- Lượt chạy ẩn từ bảng video (`claude -p --chrome --permission-mode auto`): kiểm 28/10/2026 bằng một lượt chỉ đọc, Claude in Chrome nối được (mở thẻ, đọc trang, đóng thẻ; 6 lượt, 17 giây, không bị chặn quyền). Phiên nền `claude --bg --chrome` chưa thử (chờ Trung chấp nhận tin cậy thư mục Media).

- Lượt tìm hằng tháng từ Keyword Planner chỉ là khoảng (tài khoản chưa chạy quảng cáo), nên nhiều chủ đề có thể cùng một khoảng. RSS Google Trends chỉ có 10 mục mới nhất. Muốn biết từ nào tăng dần thì phải có nhiều lượt; cột "lượt trước đã gặp" chỉ tính các lần Trung đã gọi.
- YouTube đã bỏ trang Trending từ 10/07/2025; không còn bảng thịnh hành tổng hợp chính thức. Playboard và NoxInfluencer là nguồn không chính thức, có thể đổi cấu trúc trang bất cứ lúc nào.
- Gợi ý tìm kiếm Google không có tài liệu chính thức; 30 lần gọi liền chưa bị chặn, nhưng không có bảo đảm.
- yt-dlp có thể hỏng khi YouTube đổi giao diện. Cập nhật bằng `yt-dlp -U` hoặc cách đã cài.
- Không dùng pytrends (ngừng phát triển từ 04/2023, trả lỗi 404).
- Facebook chỉ có bài theo từ khoá và Inspiration Hub (chưa xác nhận có hashtag, Reels ở Việt Nam), không biết bài nào đang tăng nhanh. Graph API không cho tìm bài công khai theo từ khoá. Dịch vụ thu thập Apify, Bright Data không dùng (Trung chốt 29/10/2026: trái điều khoản thu thập tự động của Meta). Meta Content Library chỉ cấp cho tổ chức học thuật, phi lợi nhuận (trang Meta cập nhật 30/04/2026).
- Reputa chỉ có ngành BFSI, số gộp nhiều nền tảng, trễ vài tháng; không có bản cho điện, bất động sản.
- Nguồn có khoá (YouTube Data API, SerpApi) chưa dùng theo quyết định 26/10/2026. Muốn thêm thì hỏi Trung trước, khoá đặt ở `khoa_api.txt` (đã nằm trong `.gitignore`), không chép khoá vào skill.
