# 12 — Bản đồ công cụ media AI

> Đọc khi Trung hỏi "công cụ nào tốt", "có nên đổi sang X", hoặc khi cân nhắc thay một mắt xích trong dây chuyền.
> **Phiên bản:** 1.5 · **Cập nhật:** 2026-10-27 · Dòng giọng đọc: chỉ dùng VieNeu, bỏ ElevenLabs (Trung chốt 27/10/2026).
> **Phiên bản:** 1.4 · **Cập nhật:** 2026-10-27 · đổi tên từ `03_cong_cu_media_ai.md` khi dựng lại luồng Media (nội dung giữ nguyên; tên module trỏ chéo sửa theo `_bang_chuyen_module_2026.10.27.md`).
> **Phiên bản:** 1.3 · **Cập nhật:** 2026-10-26 (đêm) · Thêm mục 3b: thử HyperFrames trên video ngắn dọc, so với Remotion, khuyến nghị. **1.2** · Mục 2 dòng giọng đọc: VieNeu thay Azure. **1.1** · Thêm mục 3a (Muse qua skill `giao-muse-video`, Flow làm tay). Cập nhật khi cần, KHÔNG gắn tác vụ định kỳ.

## 1. Nguyên tắc trước khi bàn công cụ cụ thể

Mảng này đổi nhanh tới mức mọi con số trong file đều có hạn dùng. Ba nguyên tắc để không bị cuốn theo:

**Dây chuyền hiện tại không phụ thuộc AI sinh video.** Video của xưởng là hình minh họa động dựng bằng mã — chữ, biểu tượng, hình khối, chuyển động do mã điều khiển. Đây là lựa chọn có chủ đích: kết quả giống hệt nhau mỗi lần chạy, sửa một chữ không phải sinh lại cả cảnh, không tốn tiền mỗi lần thử. Công cụ sinh video bằng AI chỉ đóng vai bổ trợ, chẳng hạn dựng vài giây cảnh nền. Đừng để trào lưu kéo cả dây chuyền sang hướng sinh bằng AI chỉ vì mẫu quảng cáo trông đẹp.

**Chỉ đổi công cụ khi có lý do cụ thể**, tức là mắt xích hiện tại đang cản việc thật — không đổi vì có cái mới ra.

**Đừng cột chặt vào một nhà cung cấp.** Sora là minh chứng: OpenAI đóng bản web và ứng dụng ngày 26/04/2026, cổng lập trình đóng ngày 24/09/2026. Ai xây quy trình quanh nó phải làm lại từ đầu. Mọi mắt xích nên có đường lui đã nghĩ sẵn.

## 2. Bốn nhóm công cụ và vị trí trong dây chuyền

| Nhóm | Xưởng đang dùng | Ghi chú |
|---|---|---|
| Khung dựng video bằng mã | **Remotion** (trong `xuong/`) | Mã nguồn mở, render trên máy, không phí. Đây là xương sống, ít lý do đổi. |
| Giọng đọc | **VieNeu-TTS, giọng Hải Đăng** (chạy trên máy, từ 25/10/2026) | Xem `08_giong_am_thanh_phu_de.md`. Chỉ dùng VieNeu từ 27/10/2026 (đã bỏ ElevenLabs); chưa có đường lui đã dựng, Azure và edge-tts chỉ còn ý nghĩa lịch sử. |
| Sinh video bằng AI | **Muse** của Meta (Claude giao qua web, skill `giao-muse-video`, từ 26/10/2026); **Flow** của Google (Trung làm tay, Veo 3.1 và Omni) | Chỉ dùng khi cần cảnh nền hoặc vài giây minh họa mà mã dựng không làm được. Xem mục 3a. |
| Sinh ảnh tĩnh, biểu tượng | chưa dùng, đang dùng thư viện biểu tượng có sẵn | Sẽ cần khi mở Giai đoạn 2 (ảnh, infographic). |

## 3. Nhóm sinh video bằng AI — trạng thái tháng 7/2026

Nếu có lúc cần vài giây cảnh sinh bằng AI, đây là mặt bằng thời điểm tra:

**Veo 3.1** (Google) hiện được đánh giá mạnh nhất về hiểu câu lệnh dựng cảnh điện ảnh và tự sinh cả âm thanh kèm hình, giá khoảng 0,15 đô la mỗi giây ở bậc nhanh. **Kling 3.0** (Kuaishou) là lựa chọn đáng tiền nhất, khoảng 0,10 đô la mỗi giây, mạnh ở cảnh nhiều chuyển động và giữ nhân vật nhất quán qua nhiều cảnh. **Runway** được xem là an toàn cho người làm truyền thông nhờ khả năng bám ảnh mẫu và có sẵn công cụ biên tập. **Sora** đang bị khai tử, không bắt đầu việc mới trên đó.

Quy đổi cho dễ hình dung: một đoạn 5 giây bằng Veo tốn khoảng 20.000đ, bằng Kling khoảng 13.000đ. So với chi phí giọng đọc khoảng 600đ một video thì đây là khoản đáng kể — thêm một lý do nữa để giữ dây chuyền dựng bằng mã.

## 3a. Hai công cụ đang dùng (cập nhật 26/10/2026)

**Muse (Meta).** Muse là agent AI của Meta, ra mắt ngày 08/09/2026, có app Mac từ 17/09/2026; hiện chỉ mở cho Mỹ và Canada. Muse tạo video bằng công cụ của Meta AI (Vibes). Model mới Muse Video mới được giới thiệu ngày 07/07/2026, tới giữa tháng 10/2026 chưa mở cho người dùng và chưa có API. Muse không có API, công cụ dòng lệnh hay cổng MCP để chương trình khác gửi việc vào, nên Claude giao việc qua trang web `muse.ai` trên Chrome của Trung (skill `.claude/skills/giao-muse-video/`). Lần thử ngày 26/10/2026: xin 1080×1920, nhận 720×1280; xin khoảng 8 giây, nhận 10 giây; chờ khoảng 2 phút; có kèm tiếng nền; không thấy hình đóng dấu. Quyết định 26/10/2026: phóng lên 1080p ở bước dựng.

**Flow (Google).** Trung tạo clip tay trên Flow trong gói Google AI Pro: 1.000 credit mỗi tháng, cộng 50 credit mỗi ngày; có các model Veo 3.1 (Lite, Fast, Quality) và Omni 1.1 Flash. Không gọi qua API (quyết định 26/10/2026). Dùng cho cảnh chính cần nét hơn Muse.

Nguồn: [TechCrunch 25/09/2026](https://techcrunch.com/2026/09/25/meta-is-putting-its-muscle-behind-muse-as-the-ai-app-takes-off), [Kingy AI về Muse Video](https://kingy.ai/news/muse-video-preview-meta-ai-native-audio/).

## 3b. HyperFrames: thử trên video ngắn dọc, so với Remotion (26/10/2026)

HyperFrames (HeyGen, giấy phép Apache-2.0, gói npm `hyperframes` 0.8.203) biến trang HTML + GSAP thành MP4, cùng cơ chế với Remotion: Chrome chạy ngầm chụp từng khung, FFmpeg ghép. Phép thử dựng lại video ngắn "Model nhỏ thắng model to" (14 cảnh, 75 giây, cùng giọng VieNeu, cùng cụm phụ đề, tông D-01) bằng HyperFrames từ đầu, giao cho một tác tử con làm không hỏi, rồi so với bản Remotion dựng bằng 7 khối cảnh có sẵn trong `xuong/`.

**Chỗ cài:** chỉ trong `xuong_thu_hyperframes/` (thư viện Node, kỹ năng HyperFrames cho Claude Code ở `xuong_thu_hyperframes/.claude/skills/`, cài bằng `npx skills add heygen-com/hyperframes -a claude-code -y`; kỹ năng toàn máy không đổi). Máy không có Homebrew nên không chạy được `brew install ffmpeg`; Trung chọn bản FFmpeg riêng: gói `ffmpeg-static` (FFmpeg 6.0) trong thư mục thử, `ffprobe` mượn của Remotion qua `xuong_thu_hyperframes/bin/ffprobe`. Mọi lệnh chạy với `PATH="<xuong_thu_hyperframes>/bin:$PATH"`. Đã tắt gửi số liệu sử dụng (`npx hyperframes telemetry disable`).

| Tiêu chí | Remotion (`xuong/`, khối cảnh có sẵn) | HyperFrames (dựng từ đầu) |
|---|---|---|
| Thời gian máy kết xuất 75 giây video | 32,9 giây | 32,7 giây (lần đầu 47,2 giây) |
| Thời gian dựng một video | Chỉ chạy lệnh (khối cảnh làm từ trước, công làm khối không đo được) | 7 phút 24 giây từ đọc kỹ năng tới bản cuối |
| Số lượt sửa · số lần kết xuất | 0 · 1 | 2 · 2 |
| Mã phải viết cho video này | 0 dòng (chỉ dữ liệu JSON) | 302 dòng script sinh 915 dòng HTML/CSS/JS |
| Ngữ cảnh Claude tiêu tốn | Không đo riêng (phiên chính chỉ chạy lệnh) | Tác tử con 154 nghìn token, 32 lần gọi công cụ |
| Chữ đè | Không thấy (31 khung cắt) | 1 lỗi ở bản đầu (tiêu đề cảnh 5 chạm hộp), đã sửa; bản cuối không thấy |
| Phông tiếng Việt khi kết xuất | Đủ dấu (Be Vietnam Pro) | Đủ dấu, `@font-face` trỏ `local('Be Vietnam Pro')` ăn ngay |
| Khoảng đứng yên trên 1,5 giây | Có: cảnh 3 khoảng 8 giây (giây 8–16), cảnh 5 và cảnh 12 mỗi cảnh khoảng 5 giây | Không có: khối nội dung trôi chậm, tiêu đề hiện dần từng từ theo lời, thanh tiến độ chạy suốt |
| Dung lượng file | 7,5 MB | 9,8 MB |

Hai lỗi đánh giá woshipm.com (06/06/2026) nêu (chữ đè nhân vật, lỗi phông khi kết xuất, chậm gấp đôi Remotion) không lặp lại ở phép thử này với video chữ và hình phẳng: tốc độ kết xuất ngang Remotion, phông đúng. Lệnh `npx hyperframes check` và `snapshot` có sẵn bắt được chữ đè và chữ hiện quá ngắn để đọc, Remotion không có công cụ tương đương trong xưởng.

**Khuyến nghị:** giữ Remotion làm dây chuyền chính cho cả video ngắn dọc và video ngang (13 dự án `xuong_dai/`, khối cảnh, kỹ năng Remotion, phụ đề chạy chữ đã nối sẵn). Không chuyển. Giữ `xuong_thu_hyperframes/` làm chỗ thử, dùng HyperFrames khi cần một video chữ và hình phẳng mà khối cảnh Remotion không có sẵn, vì dựng từ đầu chỉ mất khoảng 7 phút máy. Việc rút từ phép thử đã làm cùng ngày (Trung chọn qua bảng): 7 khối cảnh Remotion có chuyển động liên tục, cách làm và số đo ở `09_video_doc_ngan.md` mục 1. Thành phẩm thử (ngoài git): `san_pham/2026.07.28.model_nho_thang_model_to/tai_nguyen/ban_nhap/2026.10.26.model_nho_hyperframes_thu_v1.mp4`, bản Remotion để so `san_pham/2026.07.28.model_nho_thang_model_to/tai_nguyen/ban_nhap/2026.10.26.model_nho_remotion_so_sanh_v1.mp4`; nhật ký đo `xuong_thu_hyperframes/NHAT_KY_DO.md`; mã `xuong_thu_hyperframes/model_nho/tao_trang.mjs`.

## 4. Khi nào cập nhật file này

Cập nhật khi có một trong ba việc: một mắt xích đang dùng gặp trục trặc thật; Trung hỏi tới và số liệu trong file đã quá ba tháng; hoặc mở một giai đoạn mới cần nhóm công cụ chưa có ở đây. Không tự động rà theo lịch — mảng này rà định kỳ chỉ tốn công mà không đổi được quyết định gì.

## Nguồn số liệu (tra ngày 28/07/2026)

- [So sánh công cụ sinh video AI 2026 — AIViewer](https://aiviewer.ai/guides/best-ai-video-generator-2026-sora-runway-veo-pika-and-kling-compared/)
- [Xếp hạng mô hình sinh video tháng 7/2026 — BuildMVPFast](https://www.buildmvpfast.com/articles/best-llms-2026-guide/video-generation-ai)
