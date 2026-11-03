# AGENTS — Project "VideoNganHang"

> Đọc file này ĐẦU TIÊN mỗi phiên, rồi chỉ mở đúng file cần cho việc đang làm (nạp lười). Dùng chung cho Hermes, Antigravity và Claude Code.
> **1.1** · 2026-11-03 · Toàn bộ việc chạy bằng Gemini 3.8 Flash qua Antigravity (Trung chốt); thêm chuẩn hình, máy đo hình làm cổng, soát độc lập bằng phiên mới (sau khi video N301 không đạt: 0/8 chương qua máy đo). **1.0** · 2026-11-03 · Dựng từ project Media (nằm trong `~/Documents/Grok/Media`) để làm video chiến dịch Chuyện nghề Ngân hàng theo đúng cách 13 video làm bằng Claude ngày 29/10–02/11/2026. Project này độc lập: có bản chép riêng của khuôn dựng, công cụ, skill và kho tài sản; sửa ở đây không ảnh hưởng Media và ngược lại.

## Vai trò

Xưởng làm video giải thích thuật ngữ và nghiệp vụ ngân hàng cho kênh YouTube **Chuyện nghề Ngân hàng** của Thành Trung Nguyễn (ngân hàng đầu tư). Người xem: người mới vào nghề ngân hàng và người đi vay. Mỗi video một thuật ngữ hoặc một cặp hay bị nhầm, ngang 1920×1080, có thuyết minh giọng VieNeu Quốc Tuấn, 4–6 phút, có ví dụ tính tiền bằng số giả định. Xưởng lo **dựng thế nào**; chủ đề do Trung đặt, mỗi chủ đề một mục N trong `so_no_cong_viec.md`.

## Việc đầu tiên khi nhận một video

0. Model làm việc là Gemini 3.8 Flash. Hình do model này dựng hay thành "slide" (thẻ chữ dày, chữ nhỏ, đứng yên) và tự khen; nên các cổng máy ở quy tắc 8 là bắt buộc, không tự bỏ.
1. Đọc skill `skills/lam-video-ngan-hang/SKILL.md` (luồng 10 bước từ nhận yêu cầu đến bản nháp và chữ đăng). Công cụ nào không nạp được skill tự động thì mở file này bằng đường dẫn.
2. Đọc `tai_san/chien_dich_ngan_hang/quy_tac_chien_dich.md` (giọng, độ dài, nguồn, bảo mật, câu kêu gọi cuối, chữ đăng).
3. Chạy `bash scripts/cai_dat.sh kiem` một lần mỗi máy hoặc khi thấy lỗi lạ: báo phần nào thiếu (Node, Chromium, ffmpeg, Python VieNeu).

## Bảng điều hướng — loại việc → file

| Yêu cầu | Đọc trước |
|---|---|
| Làm một video mới (chủ đề từ sổ nợ hoặc Trung vừa gửi) | skill `lam-video-ngan-hang` |
| Quy tắc chiến dịch ngân hàng | `tai_san/chien_dich_ngan_hang/quy_tac_chien_dich.md` |
| Hỏi lại cho rõ yêu cầu; câu hỏi mẫu | `02_lam_ro_yeu_cau.md` |
| Viết kịch bản, kiểm chứng nguồn, quy tắc lời đọc | `03_kich_ban_va_loi_viet.md` |
| Chọn tổ hợp dựng (chất liệu, bố cục, màu, nhạc), chống nhàm chán | `04_he_truc_dung.md`, rồi `python3 scripts/goi_y_to_hop_dung.py` |
| Chọn cách làm, chi phí, thời gian máy | `05_cach_lam.md` |
| Học phong cách, hoạt hoạ từ mẫu hoặc từ bộ sưu tập (repo awesome-opus5-5-videos: 703 mục, 100 mục đã chấm, 109 thủ pháp, chất liệu CL-09…CL-16) | `11_hoc_phong_cach_tu_mau.md`; dữ liệu `tai_san/hoc_tu_repo/awesome_opus55/` (mục lục `muc_luc.md`, hồ sơ `muc_da_cham.json`) và `tai_san/thu_phap/thu_vien_thu_phap.md` (tra bằng `grep`); nguồn gốc repo ghi ở README của thư mục đó |
| Skill Remotion (11 skill: best-practices, captions, create, docs, interactivity, maps, markup, multimedia, render, saas, upgrade) và mediabunny | `.agents/skills/remotion-*` (bản gốc `xuong/.agents/skills/`) |
| Skill HyperFrames (hyperframes, hyperframes-cli, hyperframes-registry, remotion-to-hyperframes, media-use, slideshow, figma) | `.agents/skills/hyperframes*` (bản gốc `xuong_thu_hyperframes/.claude/skills/`), `12_cong_cu_media_ai.md` mục HyperFrames |
| Thủ pháp chuyển động, chữ, số liệu, lớp hoàn thiện | `06_thu_phap_va_hieu_ung.md` |
| Prompt giao tác tử dựng hình, thanh chất lượng, chạy lô ba pha | `07_khuon_prompt_va_kiem_chat_luong.md` (mục 14 cho lô) |
| Giọng VieNeu, nhạc nền, phụ đề, mốc thời gian, đo âm thanh | `08_giong_am_thanh_phu_de.md` |
| **Chuẩn hình video ngang (đọc trước khi viết `canh.js`)**: luật cảnh, ý → khuôn trong kho, số đo chuẩn | `skills/lam-video-ngan-hang/chuan_hinh_video_ngang.md`, ảnh chuẩn `tai_san/anh_chuan_hinh/` |
| Soát độc lập hình bằng phiên mới; máy đo hình | `skills/lam-video-ngan-hang/mau_soat_doc_lap.md`; `node scripts/do_chat_luong_hinh.mjs xuong_html/<mã>_<tên>` |
| Dựng bằng một trang HTML (cách làm chính của 13 video gần nhất) | skill `dung-video-html`, công cụ `xuong_html/cong_cu/`, video mẫu `xuong_html/n199_hoat_dong_huy_dong_von/` |
| Chạy pha máy (kết xuất theo chương) | `scripts/pha_may/HUONG_DAN.md` |
| Dựng video dọc, Remotion | `09_video_doc_ngan.md` (`xuong/`) |
| Dựng video ngang Remotion | `10_video_ngang_thuyet_minh.md` (`xuong_dai/`, mẫu `n65_loi_ich_mai_nha`) |
| 3D Blender; clip AI từ Muse; HyperFrames | skill `dung-hoat-canh-3d-blender`; skill `giao-muse-video`; `12_cong_cu_media_ai.md` |
| Làm nhiều video cùng chủ đề: dựng một lần dùng chung | skill `ra-soat-dung-chung` (kho `tai_san/kho_hinh_chung/`, hợp đồng tài sản ở README của kho) |
| Chữ đăng: tiêu đề, mô tả, thẻ, hashtag | skill `viet-chu-dang-video` (quy tắc kênh `quy_tac_kenh_ngan_hang.md`) |
| Hình thu nhỏ | `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md` mục 0b, rồi `xuong_html/hinh_thu_nho/README.md`; skill `soi-hinh-thu-nho` |
| Kiểm trước khi đăng; tối ưu phân phối | skill `toi-uu-phan-phoi` (`scripts/kiem_dang.py`) |
| Tải lên YouTube; đăng Facebook | skill `dang-youtube`; skill `dang-facebook` (cần khoá riêng của Trung, xem mục "Khoá và tài khoản") |
| Săn trend, tìm chủ đề | skill `san-trend`, `14_rada_xu_huong.md` |
| Soát trước khi giao | `15_bang_kiem_truoc_khi_giao.md` |
| Bản quyền, bảo mật, dùng logo | `13_ban_quyen_va_bao_mat.md` |
| Từ chuyên môn nghĩa là gì | `16_tu_dien_thuat_ngu.md` |
| Thư mục nằm đâu, môi trường chạy | `17_ban_do_kho_va_ranh_gioi.md` |
| Lỗi kỹ thuật khi dựng, xuất | `90_bai_hoc.md` **trước khi thử cách mới** (đọc mục lục, `grep` theo từ khoá) |
| Ghi việc để sau, xem việc đang nợ | `so_no_cong_viec.md` |

Chưa khớp dòng nào → hỏi một lần.

## Quy tắc cứng

1. **Làm rõ trước khi làm.** Chủ đề đã có trong sổ nợ với ý rõ thì không hỏi lại; thiếu ý thì hỏi theo `02_lam_ro_yeu_cau.md`, tối đa 3–4 câu, kèm đề xuất.
2. **Cửa duyệt.** Mặc định của loạt này là "làm một mạch": tự chọn lối viết và tổ hợp dựng, ghi mã và lý do ở đầu kịch bản. Trung chỉ duyệt hai chỗ: ảnh tĩnh (hoặc soát độc lập) và bản nháp `_nhap`. **Không tự tải lên YouTube, không tự đổi `_nhap` thành `_cuoi`**: chờ Trung nói "duyệt".
3. **Kiểm chứng.** Mọi số và văn bản pháp luật trên hình có hai nguồn khớp, bản còn hiệu lực. Số chỉ có một nguồn không đưa lên hình. Số tiền là "ví dụ giả định".
4. **Chỉ dùng giọng VieNeu Quốc Tuấn** (`--giong "Quốc Tuấn"`). Cấu hình ở `tai_san/cau_hinh_giong.json`.
5. **Bảo mật.** Không có quy chế, quy trình, dữ liệu khách hàng của MB hay ngân hàng nào trong project này; không tên, không logo ngân hàng thật trên hình; tình huống thực tế Trung kể phải ẩn danh hoàn toàn (không tên, mã số thuế, địa danh, số tiền thật). Có dấu hiệu dữ liệu thật thì dừng và báo Trung.
6. **Báo chi phí trước khi chạy việc tốn:** token, giờ máy, kết xuất 60 khung/giây, cảnh Blender, lô nhiều video.
7. **Lời đọc không trỏ sang video khác** (việc trỏ đặt ở mô tả YouTube). Câu cuối cùng của lời đọc là câu kêu gọi đăng ký kênh ghi ở file quy tắc chiến dịch.

8. **Cổng chất lượng hình (trước khi ghi phiếu pha máy):** (a) ảnh tĩnh ít nhất 3 vòng, mỗi vòng nhìn từng ảnh và ghi lỗi vào `SO_VONG_SUA.md`; (b) `node scripts/do_chat_luong_hinh.mjs xuong_html/<mã>_<tên> --buoc 2` thoát 0 (mỗi chương: chuyển động thật, tối đa 26 từ trên hình, chữ nhỏ dưới 26 px không quá 25%); (c) bản soát độc lập do MỘT PHIÊN ANTIGRAVITY MỚI viết theo `mau_soat_doc_lap.md`, không còn mục nặng. Không tự khen hình; chỉ máy đo và phiên soát có giá trị. Không sửa ngưỡng để cho qua.
9. **Mỗi chương một hình chính chuyển động theo số liệu, tối đa 12 từ trên hình**; dùng khuôn trong `tai_san/kho_hinh_chung/` trước khi tự vẽ; không thẻ chữ dày, không bảng chữ nhỏ (chi tiết: `chuan_hinh_video_ngang.md`).

## Một công cụ một lúc

Chỉ MỘT công cụ (Hermes, Antigravity hoặc Claude Code) làm việc trong project tại một thời điểm. Hai công cụ cùng sửa sẽ ghi đè lên nhau. Nhiều video làm song song thì mỗi phiên chỉ sửa thư mục của video mình (`san_pham/<thư mục video>/`, `xuong_html/<tên>/`); file dùng chung (module, `scripts/`, `tai_san/`, skill) chỉ một phiên sửa một lúc.

**Lưu git cuối lượt:** `git status`, rồi `git add` đúng file của mình và `git commit`. Công cụ không có hook tự lưu (Hermes, Antigravity) phải commit tay. Thay đổi treo không phải của mình thì không gộp. Video, ảnh, âm thanh nằm ngoài git (xem `.gitignore`).

## Tên công cụ trong tài liệu và cách đọc cho Hermes, Antigravity

Các module và skill viết lại từ Media, nhiều chỗ ghi "Claude" hoặc tên công cụ của Claude Code. Đọc như sau:

| Tài liệu ghi | Hermes, Antigravity làm |
|---|---|
| "Claude" làm việc X | công cụ đang chạy làm việc X |
| tác tử con, `Agent`, Workflow | giao việc cho tác tử con của công cụ mình có; không có thì tự làm lần lượt |
| WebSearch, WebFetch | công cụ tìm kiếm, đọc trang của công cụ mình |
| hỏi bằng bảng chọn (AskUserQuestion) | hỏi Trung bằng câu hỏi ngắn có 2–4 phương án, phương án khuyến nghị đứng đầu |
| `.claude/skills/<tên>` | `skills/<tên>/SKILL.md` ở gốc project (bản gốc); Antigravity thấy qua `.agents/skills/` |
| skill `giao-antigravity-tra-cuu`, `giao-grok`, `giao-gemini` (nhắc trong tài liệu) | **không có trong project này**; việc kiểm chứng nguồn làm bằng công cụ tìm kiếm của Antigravity, hai nguồn khớp, ghi nguồn vào file kiểm chứng |
| skill `luu-tru-drive`, bảng video web (`scripts/bang_video/`) | không dùng ở project này (phụ thuộc cấu hình của Media) |

## Khoá và tài khoản (không nằm trong project)

- Khoá OAuth YouTube kênh Ngân hàng: `~/.config/dang-youtube/ngan_hang/request.token` (đã có trên máy của Trung). Không chép, không in, không đưa vào git.
- Khoá DeepSeek, xAI, OpenAI cho Hermes: do Trung cấu hình ở Hermes; không dán vào chat.
- Không có khoá API nào trong project này (file `khoa_api.txt` của Media đã không được chép).

## Nạp lười

Đầu phiên chỉ đọc file này. KHÔNG quét `xuong/`, `xuong_dai/`, `xuong_html/`, `xuong_thu_hyperframes/` (thư viện Node có hàng nghìn file). File dài (`10_…`, `90_bai_hoc.md`, `tai_san/nhat_ky_video_ngang.md`): đọc mục lục rồi `grep` đúng mục. `99_nhat_ky.md` chỉ ghi thêm.

## Bản đồ kho

`skills/` (bản gốc; `.agents/skills/` cho Antigravity và `.claude/skills/` cho Claude Code là lối tắt, gồm cả 19 skill Remotion, mediabunny, HyperFrames nằm trong `xuong/` và `xuong_thu_hyperframes/`) · `scripts/` (giọng, mốc thời gian, pha máy, kiểm) · `xuong_html/` (cách làm chính: `cong_cu/` xuất MP4, `hinh_thu_nho/` khuôn hình thu nhỏ, `n199_…` video mẫu chỉ có mã nguồn) · `xuong/` (Remotion dọc) · `xuong_dai/` (Remotion ngang, một dự án mẫu) · `xuong_thu_hyperframes/` (ffmpeg, HyperFrames) · `tai_san/` (`chien_dich_ngan_hang/`, `so_tay_gu/`, `giong_doc/`, `nhac_nen/`, `kho_hinh_chung/`, `anh_that/`, `thu_phap/`, `khuon_prompt/`…) · `san_pham/` (mỗi video một thư mục `yyyy.mm.dd.<tiêu đề>`, quy ước ở `san_pham/README.md`) · `du_lieu/` · `_luu_tru/` (không quét).

Video mẫu của người khác ở `tai_san/so_tay_gu/mau_tham_khao/` (642 MB, đã chép 03/11/2026, ngoài git, có bản quyền: chỉ để học phong cách, không dùng lại, xem README trong thư mục). Phần không chép từ Media (tải hoặc tạo lại khi cần): thư viện Node (`npm install`), môi trường Python VieNeu (`.venv_vieneu`), ô bản đồ `xuong/public/tiles` (`scripts/tai_tile_eox.py`), ảnh khu công nghiệp, clip AI. Cài đặt: `bash scripts/cai_dat.sh`.
