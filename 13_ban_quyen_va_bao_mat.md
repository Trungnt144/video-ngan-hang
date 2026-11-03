# 13 — Bản quyền & bảo mật theo kênh phát

> Đọc trước khi đưa bất kỳ nhạc, phông chữ, hình ảnh, số liệu nào vào khung hình, và trước khi giao file cho Trung đăng.
> **Phiên bản:** 1.5 · **Cập nhật:** 2026-10-31 · Ngoại lệ logo cho riêng video N121 làm lại (sổ nợ N165, Trung chốt qua bảng chọn): được nêu tên và dùng logo Agribank, Vietcombank, BIDV, VietinBank, Techcombank, VPBank, ACB, MB (MB đứng nhóm cổ phần, Trung chấp nhận rủi ro logo MB trên kênh công khai); logo lấy từ trang chủ ngân hàng, ghi nguồn; các video khác của loạt vẫn cấm tên, logo.
> **Phiên bản:** 1.4 · **Cập nhật:** 2026-10-29 · Ngoại lệ màu ngân hàng cho loạt thuật ngữ ngân hàng (Trung chốt qua bảng chọn): được dùng màu thương hiệu của ngân hàng Việt Nam, kể cả MB; tên, logo vẫn cấm.
> **Phiên bản:** 1.3 · **Cập nhật:** 2026-10-28 · Mục 4 thêm đoạn chữ đăng: từ cấm, chỉ dẫn nguồn công khai, quy tắc nhãn AI ba nền tảng (skill `viet-chu-dang-video`).
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-10-27 · Thêm mục 5: bản quyền mẫu học từ tác giả khác (repo `awesome-opus5-5-videos`), giấy phép GSAP, Remotion, HyperFrames, Three.js (đọc giấy phép gốc của repo, GSAP và Remotion ngày 27/10/2026; HyperFrames và Three.js theo ghi chép cũ ở `12_cong_cu_media_ai.md`).
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-27 · đổi tên từ `04_ban_quyen_va_bao_mat.md` khi dựng lại luồng Media (nội dung giữ nguyên; tên module trỏ chéo sửa theo `_bang_chuyen_module_2026.10.27.md`; chỗ lỗi thời đã nêu trong bản đồ quy trình được sửa bằng chữ).
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-07-28

## 1. Ba kênh phát, ba mức ràng buộc

| Kênh | Rủi ro chính | Ràng buộc |
|---|---|---|
| Nội bộ MB (Zalo phòng ban) | Lộ thông tin nội bộ ra ngoài khi ai đó chuyển tiếp | Rà số liệu, ảnh chụp màn hình, tên khách hàng. Nhận diện thương hiệu MB dùng được trong phạm vi nội bộ. |
| Kênh công khai (TikTok/YouTube) | Bản quyền nhạc/hình + lộ thông tin + rủi ro danh tiếng nghề nghiệp | Chỉ dùng tài sản có giấy phép rõ ràng. KHÔNG dùng logo, màu, tên MB nếu chưa được phép. Ngoại lệ (Trung chốt 29/10/2026): loạt video thuật ngữ ngân hàng được dùng bộ màu thương hiệu của các ngân hàng Việt Nam, kể cả MB, làm màu chung của cả video (MAU-32 trở đi, `tai_san/so_tay_gu/mau_ngan_hang_nguon.json`); tên, logo ngân hàng vẫn cấm, trừ video N121 làm lại (sổ nợ N165, Trung chốt 31/10/2026: được tên và logo tám ngân hàng); video so sánh nhóm ngân hàng không gán màu một ngân hàng cho một nhóm. Không nói chuyện nội bộ ngân hàng dù đã ẩn danh. |
| Công việc chuyên môn (hồ sơ, thuyết trình) | Dữ liệu khách hàng và thông tin chưa công bố | Mức chặt nhất: mọi số liệu khách hàng phải ẩn danh trước khi vào khung hình. Nghi ngờ thì hỏi Trung, không tự quyết. |

Một video làm cho kênh nội bộ **không mặc nhiên** đăng công khai được. Đổi kênh là phải rà lại từ đầu theo cột ràng buộc của kênh mới.

## 2. Tài sản dùng được, đã chọn sẵn

| Loại | Nguồn chốt | Vì sao chọn |
|---|---|---|
| Biểu tượng | Tabler, Lucide, Heroicons (giấy phép MIT) | Miễn phí, dùng thương mại được, không bắt ghi công |
| Hình minh họa người/cảnh | unDraw | Đổi màu theo bộ màu video, giấy phép rộng |
| Nhạc nền và hiệu ứng tiếng | Pixabay Audio | Không cần đăng nhập, không bắt ghi công, dùng thương mại được |
| Phông chữ | Be Vietnam Pro (Google Fonts, giấy phép mở), dự phòng Helvetica Neue, cho cả bản nội bộ và bản công khai | Segoe UI thuộc Windows nên đã bỏ ngày 26/10/2026 (`09_video_doc_ngan.md` mục 1); video phát hành rộng chỉ dùng phông giấy phép mở |

Mỗi thứ tải về `tai_san/` phải kèm một dòng ghi: tải từ đâu, ngày nào, giấy phép gì. Không ghi thì vài tháng sau không ai chứng minh được nguồn gốc.

## 3. Ba điều tuyệt đối không làm

Không dùng nhạc thương mại hoặc trích đoạn phim/video của người khác dù chỉ vài giây cho video đăng công khai. Không sao chép khuôn hoặc mã nguồn của sản phẩm đã mua (như bộ khuôn Escbase) rồi đóng gói lại để bán hoặc phát cho người khác — học cách tổ chức thì hợp lệ, chép lại để phân phối thì không. Không đưa dữ liệu khách hàng, số liệu chưa công bố, hay ảnh chụp màn hình hệ thống nội bộ vào khung hình khi chưa ẩn danh.

## 4. Bước soát trước khi giao file

Trước khi đưa file vào `san_pham/`, xem lại toàn video một lượt và tự trả lời bốn câu: khung hình nào có số liệu hoặc tên riêng không? nhạc và hình lấy từ nguồn nào, đã ghi giấy phép chưa? video này sẽ đăng kênh nào, đã đúng ràng buộc kênh đó chưa? có gì trong đây mà nếu người ngoài xem sẽ gây rắc rối cho Trung về nghề nghiệp không?

Câu cuối là câu quan trọng nhất và không có công cụ nào soát hộ được.

**Chữ đăng (thêm 28/10/2026).** Tiêu đề, mô tả, thẻ, chú thích cũng là nội dung công khai: qua từ cấm của `skills/viet-chu-dang-video/scripts/kiem_chu_dang.py` (tên và nhận diện MB, "tờ trình", "nội bộ"; tên khách hàng thêm vào `skills/viet-chu-dang-video/tu_cam_rieng.txt`, file nằm ngoài git); mô tả chỉ dẫn nguồn công khai, không dẫn tài liệu RM MB hay tờ trình dù con số lấy từ đó. Nhãn AI: YouTube và TikTok khai khi có clip AI tả thực hoặc nhạc AI; Facebook khai cả giọng đọc máy nghe như thật nên bật cho mọi video có giọng VieNeu (Trung chốt 27/10/2026; câu trích và nguồn ở `skills/viet-chu-dang-video/quy_dinh_nen_tang.md`).

## 5. Mẫu học từ tác giả khác và giấy phép công cụ dựng (thêm 27/10/2026)

### 5.1. Học từ video và prompt của người khác

Ngày 27/10/2026 Media học từ repo `yihui-dev/awesome-opus5-5-videos` (703 prompt kèm video do người dùng làm bằng Claude Opus 5.5; dữ liệu học ở `tai_san/hoc_tu_repo/awesome_opus55/`). Giấy phép của repo là MIT (đọc file LICENSE gốc ngày 27/10/2026). Điều đó **không** làm cho từng prompt và từng video thành của Media: video và prompt thuộc tác giả từng bài. Quy tắc cho mọi mẫu học từ người khác, kể cả video mẫu Trung gửi:

- Học nguyên tắc (cách chia khối, tham số thủ pháp, tông màu đo được, cấu trúc prompt), không chép.
- Không chép nguyên văn prompt dài vào Media: trích tối đa 20 chữ, phần còn lại trỏ link `https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/<slug>.md`.
- Không tải video của tác giả vào git. Chỉ lưu link (`https://media.skillry.dev/opus-5-5/<slug>/original.mp4`, `remake.mp4`). Video tải tạm để cắt dải khung nằm ngoài git (thư mục tạm).
- Không dựng lại nguyên một video của họ để đăng công khai; mượn thủ pháp, bố cục, màu thì tự dựng bằng nội dung và số liệu của Media.
- Cách học từ một bộ sưu tập: `11_hoc_phong_cach_tu_mau.md`.

### 5.2. Giấy phép công cụ dựng video (GSAP và Remotion đọc giấy phép gốc ngày 27/10/2026)

| Công cụ | Điều kiện | Với Media | Nguồn |
|---|---|---|---|
| GSAP (thư viện hoạt hoạ JavaScript) | Giấy phép tiêu chuẩn của Webflow, hiệu lực 30/04/2025: miễn phí, dùng thương mại được, gồm cả plugin trước đây chỉ dành cho thành viên (SplitText, MorphSVG, DrawSVG). Cấm dùng GSAP trong công cụ cho người dùng dựng hoạt ảnh bằng kéo thả không cần mã mà cạnh tranh với khả năng dựng hoạt ảnh trực quan của Webflow | Dựng video bằng mã HTML và GSAP là hợp lệ. Phần hỏi đáp của giấy phép ghi rõ mã GSAP do công cụ AI viết không phải "Prohibited Use" (cách dùng bị cấm). Nếu sau này làm công cụ kéo thả dựng hoạt ảnh cho người khác dùng thì đọc lại giấy phép trước | `gsap.com/standard-license` |
| Remotion | Free License cho cá nhân, tổ chức vì lợi nhuận tới 3 nhân viên, tổ chức phi lợi nhuận. Tổ chức lớn hơn bắt buộc có Company License. Không được sao chép hoặc sửa mã Remotion để bán, cho thuê, cấp phép lại bản phái sinh. `LICENSE.md` ghi giấy phép sẽ đổi nhẹ ở Remotion 5.0 | Trung làm cá nhân: miễn phí. Nhân danh tổ chức trên 3 người (ví dụ MB): gói Creators 25 USD mỗi người mỗi tháng, tối thiểu 100 USD mỗi tháng (trang giá hiển thị ví dụ 3 chỗ 75 USD, tổng 100 USD mỗi tháng). Quyết trước khi dựng video nhân danh MB | `LICENSE.md` của `remotion-dev/remotion` trên GitHub; `remotion.pro/license` |
| HyperFrames (HeyGen) | Apache-2.0: dùng thương mại được, giữ thông báo giấy phép khi phân phối lại mã | Dùng được (`12_cong_cu_media_ai.md` mục 3b) | `12_cong_cu_media_ai.md` |
| Three.js | MIT | Dùng được | — |

Giấy phép đổi theo thời gian: trước khi nhận một dự án nhân danh tổ chức, mở lại hai trang nguồn của GSAP và Remotion.
