# 05 — Bảy cách làm video (LM-01 đến LM-07)

> Đọc khi chọn cách dựng một video (cửa chọn dựng ở `04_he_truc_dung.md`), hoặc khi Trung hỏi "làm bằng gì, mất bao lâu, tốn gì".
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-27 · Giới hạn LM-01 bỏ nhắc ElevenLabs (trỏ mốc từng từ bằng Whisper); dòng giấy phép Remotion trỏ `13_ban_quyen_va_bao_mat.md` mục 5.2 sau khi đối chiếu giấy phép gốc.
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Bản đầu. Gom số đo từ module video ngắn dọc (nay `09_video_doc_ngan.md`), công cụ media AI (nay `12_cong_cu_media_ai.md`), video ngang (nay `10_video_ngang_thuyet_minh.md`), phép thử "Lịch sử AI" ngày 27/10/2026 và bộ đo `xuong_html/cong_cu/KET_QUA_DO.md`. Cập nhật khi có số đo mới; mỗi số ghi nguồn và ngày.

## 0. Cách đọc file này

**Cách làm (mã LM)** là cách tạo ra tệp video: công cụ nào, chạy ở đâu, sửa thế nào. Khác với năm trục dựng (chất liệu CL, mức chi tiết CT, bố cục BC, tông màu MAU, nhạc NH; xem `tai_san/so_tay_gu/he_truc_dung.md`) quyết định video trông ra sao. Một tổ hợp trục thường làm được bằng nhiều cách; bảng ở mục 1 nói tổ hợp nào có sẵn mã, tổ hợp nào phải dựng.

Ba mức trạng thái: **có sẵn** (có mã chạy được, đã ra thành phẩm), **đã thử** (chạy một lần, chưa thành khuôn dùng lại), **phải dựng** (chưa có mã). Số có chữ "ước" là chưa đo. Bốn khoản chi phí mỗi cách làm: token Claude (lượng chữ mô hình đọc và viết, trừ vào hạn mức), phần mềm và giấy phép, giờ máy đo trên Mac M5 (24 GB), công của Trung (số lần chọn, duyệt, làm tay).

Mã chất liệu CL-01 đến CL-16 và tên: xem bảng "Chất liệu và cách làm nên dùng" ở mục 1. CL-09 đến CL-16 mới thêm ngày 27/10/2026, trạng thái nháp (học từ repo `yihui-dev/awesome-opus5-5-videos`).

## 1. Bảng chọn nhanh

| Mã | Tên cách làm | Một dòng | Khổ | Giờ máy (đo) | Token Claude (đo) | Trạng thái |
|---|---|---|---|---|---|---|
| LM-01 | Remotion khối cảnh dọc | Điền dữ liệu JSON vào 7 khối cảnh dựng sẵn của Remotion (khung dựng video bằng React) | dọc 1080×1920 | 0,44 giây máy mỗi giây video | không đo riêng (chỉ chạy lệnh) | có sẵn |
| LM-02 | Remotion dự án ngang | Mỗi video một dự án React, có giọng đọc, sơ đồ hoặc 3D bằng Three.js (thư viện dựng 3D trong trình duyệt) | ngang 1920×1080 | 2,8 giây máy mỗi giây video (3D) | chưa đo | có sẵn |
| LM-03 | HTML một trang, chụp khung theo đồng hồ ảo | Opus viết một trang HTML, công cụ chụp từng khung rồi ghép MP4 | cả hai | 1,2–1,5 giây máy mỗi giây video (30 khung/giây); 23,3 phút cho 60 giây (60 khung/giây có nhoè) | 150 nghìn (30 giây, một lượt); 219 nghìn (60 giây, 3 vòng sửa) | đã thử |
| LM-04 | HyperFrames | Trang HTML + GSAP theo khuôn HeyGen, có lệnh kiểm chữ đè | cả hai | 0,44 giây máy mỗi giây video | 154 nghìn (75 giây, dựng từ đầu) | đã thử |
| LM-05 | Blender Cycles + ghép Remotion | Vật thật dò tia sáng, bóng mềm, nhoè chuyển động | ngang | 13 giây máy mỗi khung (bản nháp 960×540) | chưa đo | có sẵn (skill) |
| LM-06 | Clip AI ghép Remotion | Clip quay tả thực do AI sinh, dùng làm cảnh nền | cả hai | Muse khoảng 2 phút mỗi clip 10 giây | chưa đo | có sẵn (Muse), tay (Flow) |
| LM-07 | Manim | Thư viện hoạt hình toán Python | ngang | chưa có | chưa có | chưa cài |

Sơ đồ chọn, đi từ trên xuống, dừng ở dòng đầu tiên khớp:

```
Video cần gì?
│
├─ Dọc, tối đa 90 giây, chữ + khối + số, tông MAU-01 (Đêm & đỏ) ──► LM-01
├─ Ngang có giọng đọc, sơ đồ hoặc 3D dựng từ khối cơ bản ─────────► LM-02
├─ Chất liệu hoặc bố cục chưa có khối cảnh (CL-09 đến CL-16),
│  tối đa khoảng 60 giây, học từ video mẫu ───────────────────────► LM-03
│     └─ muốn máy tự kiểm chữ đè và chữ hiện quá ngắn khi dựng ──► LM-04
├─ Cận cảnh vật thật, đã có mô hình 3D chi tiết, giấy phép rõ ───► LM-05
├─ Cảnh nền tả thực vài giây mà mã không vẽ nổi ──────────────────► LM-06
└─ Hoạt cảnh toán kiểu 3Blue1Brown ───────────────────────────────► LM-07 chưa cài;
                                                                    tạm dùng CL-05 hoặc CL-14 bằng LM-02, LM-03
```

**Bảng chất liệu và cách làm nên dùng** (trạng thái ghi trong ngoặc là của cách làm cho chất liệu đó):

| Chất liệu | Cách làm nên dùng | Ghi chú |
|---|---|---|
| CL-01 2D chữ và khối (dọc) | LM-01 (có sẵn); LM-04 (đã thử) | Mã dựng `xuong/` chỉ có tông MAU-01 |
| CL-02 2D thẻ kính mờ; CL-03 2D nét viền ăn khớp lời; CL-04 2D ảnh chụp màn hình và sơ đồ | LM-01 (phải dựng thêm khối cảnh); LM-03, LM-04 (phải dựng) | Mẫu nguồn của nhóm quảng cáo phần mềm làm bằng Canvas và CSS |
| CL-05 Đồ thị SVG | LM-02 (có sẵn: `xuong_dai/dien_ap/`, `kw_kwh/`, `p50_p90/`, `ton_that/`); LM-03 (đã thử một phần: đường cong hai mùa đông AI) | |
| CL-06 3D đất sét và bản vẽ; CL-07 3D xuyên thấu | LM-02 (có sẵn: `xuong_dai/pin_mat_troi/`, `may_bien_ap/`) | LM-03 dựng được bằng Three.js trong trang, chưa thử |
| CL-08 3D tả thực Blender | LM-05 (có sẵn, skill `dung-hoat-canh-3d-blender`) | Cần mô hình chi tiết có giấy phép rõ |
| CL-09 2D minh hoạ phẳng có vật thể (bàn thao tác) | LM-03 (đã thử: bản chạy thử cocktail 27/10); LM-02 (phải dựng) | |
| CL-10 2D nét vẽ tay; CL-11 Chữ động khổng lồ; CL-16 Giao diện và thẻ nổi | LM-03, LM-04 (phải dựng) | Chưa chạy lần nào |
| CL-12 Hạt và ánh sáng | LM-03 (đã thử một phần: hạt nhiễu, đám hạt mở đầu, vòng hạt cảnh kết) | Hạt nhiều thì nặng, cần giới hạn số hạt |
| CL-13 3D sa bàn bằng mã | LM-02 (phải dựng, dùng lại ánh sáng, máy quay, nhãn chiếu của mã D-09b); LM-03 (đã thử một phần: bàn cờ Three.js) | |
| CL-14 Mô phỏng và bề mặt toán | LM-03, LM-02 (phải dựng); LM-07 (chưa cài) | |
| CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt | LM-03 (phải dựng); LM-06 (chưa thử) | Điểm hợp Media thấp, ghi để đủ |

Trước khi hứa với Trung: LM-03, LM-05 và LM-06 phải nói rõ giờ máy hoặc công làm tay trước khi chạy (LM-05 là một ngày máy cho 1 phút video ở 1920×1080).

## 2. LM-01 — Remotion khối cảnh dọc

**Là gì.** Remotion (khung dựng video bằng React, mỗi khung hình là hàm của số khung) với 7 khối cảnh viết sẵn trong `xuong/src/video-ngan/canh/CacKhoiCanh.tsx`. Mỗi video là một file dữ liệu JSON điền chữ, số, biểu tượng vào khối.

**Dùng khi.** Video dọc 1080×1920, tối đa khoảng 90 giây, chữ trắng đậm, khối hình học, số đếm tăng, sơ đồ khối; cần ra nhanh và lặp lại được. **Không dùng khi** cần tông khác MAU-01 mà chưa có bộ màu (phải dựng bộ màu trước), hoặc cần vật vẽ, nét tay, 3D (dùng LM-03 hoặc LM-02).

**Chất liệu làm được.** CL-01 có sẵn. CL-02, CL-03, CL-04 phải dựng thêm khối cảnh trong `xuong/`.

**Các bước và file.** Theo `01_quy_trinh_chung.md` và `09_video_doc_ngan.md`: kịch bản, giọng VieNeu (`scripts/sinh_giong_vieneu.py`), gộp mốc (`node scripts/chuan_bi_video.mjs gop <tên>`), kết xuất `npx remotion render VideoNgan out/<tên>.mp4 --codec=h264` trong `xuong/`, soát khung cắt từ mp4 (`scripts/soat_khung_mp4.py`). Mã chuyển động liên tục: `xuong/src/video-ngan/thanh-phan/` (`KhungNen.tsx`, `NhipLoi.tsx`, `PhuDeChayChu.tsx`).

| Khoản | Số |
|---|---|
| Token Claude | Không đo riêng: phiên chính chỉ chạy lệnh vì khối cảnh đã dựng (`12_cong_cu_media_ai.md`, 26/10/2026) |
| Phần mềm, giấy phép | Remotion miễn phí cho cá nhân; nhân danh tổ chức trên 3 người (ví dụ MB) thì gói Creators 25 USD mỗi người mỗi tháng, tối thiểu 100 USD mỗi tháng (đã đối chiếu giấy phép gốc ngày 27/10/2026, `13_ban_quyen_va_bao_mat.md` mục 5.2) |
| Giờ máy | 75 giây video: 33 giây máy khi máy rảnh (0,44 giây máy mỗi giây video, 26/10/2026). Máy bận: 87 giây (khối cũ), 98–104 giây (khối có chuyển động liên tục), file 7,5 MB lên 16 MB |
| Công của Trung | Hai cửa chọn (lối viết kịch bản, tổ hợp dựng) và hai cửa duyệt (chữ, bản nháp); chưa đo giờ |

**Giới hạn.** Giọng VieNeu chỉ có mốc theo câu nên phụ đề là cụm chữ trắng, không có từ đỏ chạy theo lời (muốn có thì dùng mốc từng từ bằng Whisper, `08_giong_am_thanh_phu_de.md` mục 5; lệnh `gop` chưa đọc mốc này, sổ nợ N57). Chưa có video dọc thành phẩm nào qua đủ quy trình.

**Thành phẩm mẫu.** `san_pham/2026.07.28.model_nho_thang_model_to/tai_nguyen/ban_nhap/2026.10.26.model_nho_remotion_chuyen_dong_v1.mp4` (14 cảnh, 75 giây). Các mp4 nằm ngoài git, có ở thư mục Media chính.

## 3. LM-02 — Remotion dự án ngang

**Là gì.** Mỗi video ngang có thuyết minh là một dự án Remotion riêng trong `xuong_dai/<tên>/`. Hình vẽ bằng React và SVG (2D) hoặc Three.js qua `@remotion/three` (3D). Giọng VieNeu, mốc câu gom vào `src/thoi_gian.json`. Khung mã dùng lại: video máy biến áp (`xuong_dai/may_bien_ap/src/CoBan.tsx`, `MayBienAp.tsx`, `KichBan.ts`, `Video.tsx`).

**Dùng khi.** Video ngang 1920×1080 giải thích khoa học, kỹ thuật, có giọng đọc 60–150 giây; nhiều video cùng loại nên khung mã dùng lại được; 3D dựng từ khối cơ bản. **Không dùng khi** cần vật liệu thật hoặc mô hình tải về (LM-05), video dọc ngắn chữ và khối (LM-01), hoặc thử nhanh một bố cục lạ trong dưới một giờ (LM-03).

**Chất liệu làm được.** CL-05, CL-06, CL-07 có sẵn. CL-09 (bàn thao tác bằng React và SVG), CL-13 (sa bàn Three.js), CL-14 (bề mặt toán 3D) phải dựng, dùng lại ánh sáng, máy quay, nhãn bám vật của mã D-09b.

**Các bước và file.** Sáu bước ở `10_video_ngang_thuyet_minh.md` (mục quy trình): làm rõ yêu cầu, kiểm chứng, kịch bản `<tên>.chuong.json`, dựng hoạt hoạ, giọng và mốc (`xuong_dai/<tên>/tao_thoi_gian.py`), kết xuất. Chép khuôn từ video D-09b gần nhất, không dùng `rsync --exclude src`. Soát: `npx remotion still` trước kết xuất; sau kết xuất cắt khung từ mp4, đo tương phản (`scripts/do_tuong_phan_khung.py`), quét khung hỏng (`scripts/quet_khung_hong.py`).

| Khoản | Số |
|---|---|
| Token Claude | Chưa đo. Máy biến áp: từ lời thoại tới bản kết xuất đầu khoảng 25 phút máy làm, trong đó kiểm chứng 19 khẳng định giao tác tử con Sonnet 7,6 phút chạy song song (`10_video_ngang_thuyet_minh.md`, mục máy biến áp, 26/10/2026) |
| Phần mềm, giấy phép | Remotion như LM-01 (cá nhân và công ty tối đa 3 nhân viên miễn phí). Three.js giấy phép MIT; gói Node `three`, `@react-three/fiber@8`, `@remotion/three` cùng số bản với `remotion` |
| Giờ máy | Máy biến áp: 3.197 khung (106,6 giây) kết xuất 5 phút 2 giây, file 116 MB. Pin mặt trời 3D: 4.538 khung (2 phút 31) trong 7 phút, file 69 MB. Cả hai khoảng 2,8 giây máy mỗi giây video (26/10/2026) |
| Công của Trung | Hai cửa chọn, duyệt chữ, duyệt bản nháp, nghe giọng. Máy biến áp: Trung chọn làm một mạch tới bản nháp, bỏ cửa duyệt chữ |

**Giới hạn.** Cảnh nặng (nhiều đa giác, bóng đổ nhiều) chưa đo giới hạn của Three.js. Kết xuất WebGL thỉnh thoảng ghi ra khung hỏng ngẫu nhiên; chạy nhiều luồng có lần treo (video monopile).

**Thành phẩm mẫu.** `san_pham/2026.10.26.may_bien_ap/2026.10.26.may_bien_ap_d09b_v1_cuoi.mp4` (CL-07, 106,6 giây); `san_pham/2026.10.26.dien_ap_dong_dien_dien_tro/2026.10.26.dien_ap_dong_dien_dien_tro_d10_v1_cuoi.mp4` (CL-05, 2D); `san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/2026.10.26.bess_d09b_v2_cuoi.mp4`.

## 4. LM-03 — HTML một trang, chụp khung theo đồng hồ ảo

**Là gì.** Opus viết một file HTML; mọi giá trị trên màn hình là hàm của thời gian t (`seek(t)` hoặc `renderAt(t)`: cho t giây thì vẽ đúng khung hình giây đó, không hẹn giờ, không số ngẫu nhiên thật). Công cụ `xuong_html/cong_cu/xuat_mp4.mjs` thay đồng hồ của trang bằng đồng hồ ảo (Playwright, công cụ điều khiển trình duyệt bằng mã), chụp từng khung, đẩy vào FFmpeg (công cụ xử lý video) ghép MP4; kết quả không đổi dù máy nhanh hay chậm. `xuat_nhoe.sh` chụp gấp 8 lần số khung rồi trộn 4 khung phụ thành một bằng bộ lọc `tmix` để có nhoè chuyển động.

**Dùng khi.** Cần thử nhanh một chất liệu hoặc bố cục học từ video mẫu; video không có giọng đọc dài hoặc giọng ghép sau; cảnh 3 đến 60 giây; muốn nhoè chuyển động và hạt kiểu phim; cảnh lẻ để ghép vào video Remotion (mục 9).
**Không dùng khi.** Video 5 phút có giọng đọc, mốc câu, phụ đề chạy chữ nối sẵn (LM-02 làm sẵn những phần đó); cần tuyệt đối không phụ thuộc mạng mà chưa lưu thư viện cạnh file; cảnh WebGL nặng (chưa đo).

**Chất liệu làm được.** CL-09 đã thử. CL-12, CL-13, CL-05 đã thử một phần trong video "Lịch sử AI". CL-10, CL-11, CL-14, CL-16 phải dựng, chưa chạy lần nào. Hướng viết sẵn cho từng chất liệu: `tai_san/khuon_prompt/huong_theo_chat_lieu.md`.

**Các bước** (chi tiết: `07_khuon_prompt_va_kiem_chat_luong.md`, khuôn ở `tai_san/khuon_prompt/`).
1. Chốt tổ hợp trục ở cửa chọn dựng; lấy đoạn hướng của chất liệu từ `huong_theo_chat_lieu.md`.
2. Viết file dữ kiện `<tên>.du_kien.json` (mục 10 module 07) và storyboard cùng bản đồ nhịp, qua cửa duyệt trước khi viết mã (mục 4).
3. Giao tác tử con Opus dựng theo `khuon_dung_html_mot_trang.md`; ra một file `xuong_html/<tên>/<tên>.html` kèm thư viện cạnh file.
4. Bản xem trước 10 khung/giây, 960×540, ảnh tĩnh mỗi nhịp, tối đa 3 vòng xem và sửa, ghi sổ.
5. Người phản biện độc lập chấm theo `khuon_phan_bien.md`; xuất bản cuối; ghép giọng và nhạc bằng FFmpeg (`khuon_am_thanh_tu_du_lieu.md`).
6. Soát theo `15_bang_kiem_truoc_khi_giao.md`, giao vào thư mục video.

**File và script.** `xuong_html/cong_cu/` (`xuat_mp4.mjs`, `xuat_nhoe.sh`, `quay_thoi_gian_thuc.mjs` là phương án dự phòng chất lượng thấp, tối đa 25 khung/giây và khoảng 1 Mbit/s; `KET_QUA_DO.md` ghi số đo và giới hạn); skill `dung-video-html` (`skills/dung-video-html/`). Cài một lần: `export PATH="$HOME/.local/bin:$PATH" && cd xuong_html/cong_cu && npm install` (cài `playwright-core@1.62.0`, không tải trình duyệt, dùng Chromium sẵn trong `~/Library/Caches/ms-playwright/`). FFmpeg dùng bản `xuong_thu_hyperframes/bin/ffmpeg` (6.0, có `tmix`, `tile`, `loudnorm`, `ebur128`, `freezedetect`; bản đi kèm Remotion không có `ebur128`).

```bash
node xuat_mp4.mjs "<trang>.html" 30 --fps 30 --kich-thuoc 1920x1080 --ra "<ra>.mp4"
sh xuat_nhoe.sh "<trang>.html" 60 "<ra>.mp4" 60 8 4 1920x1080 2
ffmpeg -i "<ra>.mp4" -i "<giong_va_nhac>.wav" -c:v copy -c:a aac "<ra_co_tieng>.mp4"
```

**Chi phí.**

| Khoản | Số |
|---|---|
| Token Claude | Một lượt, 30 giây: khoảng 150 nghìn token, 12 phút Opus (27/10/2026). Có sửa, 60 giây: 218.774 token, 31 phút Opus, 104 lần gọi công cụ, 1.324 dòng mã, gồm 3 vòng xem và sửa, 4 bản xem trước (`san_pham/2026.10.27.duyet_phong_cach_opus55/2026.10.27.so_sanh_lich_su_ai_v1.html`, 27/10/2026). Theo giá API tương đương khoảng 1,5–3 USD; với gói thuê bao thì trừ vào hạn mức |
| Phần mềm, giấy phép | Playwright, FFmpeg, Chromium sẵn. GSAP (thư viện hoạt hoạ JavaScript) miễn phí cả plugin (SplitText, DrawSVG; giấy phép Webflow), mã AI viết không bị cấm. Three.js MIT. Phông Google miễn phí nhưng cần mạng lúc xuất nếu không lưu cạnh file |
| Giờ máy | 30 khung/giây: 36–45 giây máy cho 30 giây video (1,2–1,5 giây máy mỗi giây video, bản một lượt); bộ đo 10 giây: Canvas 0,96, SVG và GSAP 0,97, WebGL (một khối hộp) 1,39 giây máy mỗi giây video (`KET_QUA_DO.md`, 27/10/2026). 60 khung/giây có nhoè, 60 giây: 23,3 phút máy (chụp 28.800 khung phụ 21,6 phút, trộn và mã hoá 1,7 phút), RAM 0,86 GB, file 134 MB do lớp hạt nhiễu. Nhoè làm máy chạy lâu gấp khoảng 8 lần; bỏ nhoè ước khoảng 3 phút cho 60 giây |
| Công của Trung | Phép thử 27/10: 3 lần chọn trong bảng hỏi, khoảng 5–10 phút xem so sánh. Video thật: thêm cửa duyệt storyboard |

**Giới hạn.** MP4 ra không có tiếng, ghép sau bằng FFmpeg hoặc trong Remotion. Thẻ `<video>` nhúng, Web Audio, Web Worker, `OffscreenCanvas` trong worker, bộ lập lịch `MessageChannel` vẫn dùng giờ thật nên không dùng trong trang. `Math.random` bị thay bằng bộ sinh cố định khi xuất, nên trang phải có bộ sinh riêng có hạt giống. `--song-song N` chỉ nhanh hơn khoảng 20% và tốn gấp đôi RAM, chỉ đúng khi trang xác định. Bản một lượt còn 1–2 lỗi nhìn thấy; mẫu lịch sử AI sau 3 vòng sửa đạt ngang bản Skillry làm lại nhưng còn kém bản gốc ở độ chi tiết từng chương và chất liệu 3D. Chưa có video LM-03 nào dùng giọng đọc và mốc câu VieNeu của Media.

**Thành phẩm mẫu.** `san_pham/2026.10.27.duyet_phong_cach_opus55/tai_nguyen/ban_nhap/2026.10.27.lich_su_ai_claude_v2.mp4` (60 giây, 60 khung/giây có nhoè), `2026.10.27.chay_thu_cocktail_v1.mp4`, `2026.10.27.chay_thu_tang_ap_v1.mp4` (hai bản chạy thử một lượt 30 giây); mã `kloss_claude_v2.html`; sổ 3 vòng sửa `NHAT_KY_VONG_SUA.md` cùng thư mục.

## 5. LM-04 — HyperFrames

**Là gì.** HyperFrames (HeyGen, giấy phép Apache-2.0, gói npm `hyperframes` 0.8.203) biến trang HTML + GSAP (thư viện hoạt hoạ JavaScript) thành MP4, cùng cơ chế với Remotion: Chrome chạy không hiện cửa sổ để chụp từng khung, FFmpeg ghép. Có sẵn registry (kho) thành phần dựng sẵn, lệnh `npx hyperframes check` và `snapshot`.

**Dùng khi.** Video chữ và hình phẳng mà khối cảnh Remotion không có sẵn; muốn máy kiểm chữ đè nhau và chữ hiện quá ngắn để đọc ngay khi dựng (Remotion trong xưởng không có công cụ tương đương).
**Không dùng khi.** Video đã có khối cảnh Remotion (LM-01 ổn định hơn); cần 3D nặng (chưa thử); video ngang có phụ đề chạy chữ nối sẵn (LM-02).

**Chất liệu làm được.** CL-01 đã thử (video dọc 14 cảnh). CL-09, CL-10, CL-11, CL-16 phải dựng (không có mã sẵn nhưng cơ chế hợp).

**Các bước.** Mở phiên trong `xuong_thu_hyperframes/`; giao tác tử con đọc kỹ năng HyperFrames (`xuong_thu_hyperframes/.claude/skills/`); viết script sinh trang từ JSON (mẫu `xuong_thu_hyperframes/model_nho/tao_trang.mjs`, 302 dòng sinh 915 dòng HTML); `npx hyperframes check`, `snapshot`; kết xuất; cắt khung từ mp4 để soát. Mọi lệnh chạy với `PATH="<xuong_thu_hyperframes>/bin:$PATH"`.

**File và script.** `xuong_thu_hyperframes/` (thư viện Node, `bin/ffmpeg` và `bin/ffprobe`, `NHAT_KY_DO.md`); đã tắt gửi số liệu sử dụng (`npx hyperframes telemetry disable`).

**Chi phí.**

| Khoản | Số |
|---|---|
| Token Claude | Tác tử con 154 nghìn token, 32 lần gọi công cụ, 7 phút 24 giây từ đọc kỹ năng tới bản cuối, 2 lượt sửa, 2 lần kết xuất (`xuong_thu_hyperframes/NHAT_KY_DO.md`, 26/10/2026) |
| Phần mềm, giấy phép | HyperFrames Apache-2.0; GSAP miễn phí; FFmpeg riêng gói `ffmpeg-static` 6.0 (máy không có Homebrew) |
| Giờ máy | 75 giây video: 32,7 giây máy (lần đầu 47,2 giây), 0,44 giây máy mỗi giây video; file 9,8 MB (26/10/2026) |
| Công của Trung | Chọn phương án qua bảng hỏi; chưa đo giờ |

**Giới hạn.** Lệnh `check` báo cảnh báo dòng chữ hiện ngắn hơn ngưỡng đọc (0,5 giây + 0,3 giây mỗi từ) khi giọng đọc nhanh, không sửa được nếu kịch bản cố định. Khung đầu có thể đen nếu mọi phần tử mờ dần từ độ mờ 0. Chỉ thử với video chữ và hình phẳng. Các điểm yếu mà một đánh giá bên ngoài nêu (woshipm.com, 06/06/2026: chữ đè nhân vật, lỗi phông khi kết xuất, chậm gấp đôi Remotion) không lặp lại ở phép thử này.

**Thành phẩm mẫu.** `san_pham/2026.07.28.model_nho_thang_model_to/tai_nguyen/ban_nhap/2026.10.26.model_nho_hyperframes_thu_v1.mp4`.

## 6. LM-05 — Blender Cycles + ghép Remotion

**Là gì.** Blender (phần mềm dựng 3D miễn phí) chạy bằng dòng lệnh, bộ dựng Cycles dò đường đi của tia sáng nên có bóng đổ mềm, kim loại phản chiếu, nhoè chuyển động, độ sâu trường ảnh. Ra chuỗi ảnh PNG nền trong suốt và chuỗi ảnh mặt nạ; chữ, nhãn, viền sáng, phụ đề ghép trong Remotion. Quy trình 10 bước: `skills/dung-hoat-canh-3d-blender/SKILL.md`.

**Dùng khi.** Máy móc, xe, thiết bị thật; cần cận cảnh bề mặt; đã có mô hình chi tiết hợp giấy phép.
**Không dùng khi.** Mô hình tự dựng bằng khối cơ bản (lần thử 26/10: Trung chê, không đẹp hơn Three.js); sơ đồ 3D, mặt cắt khối đơn giản; cần sửa nhiều lần.

**Chất liệu làm được.** CL-08 có sẵn (skill). Không dùng cho CL-13, CL-14.

**Các bước.** Chọn mô hình (hỏi Trung bằng bảng chọn, không tự tải), kiểm cấu tạo, kiểm chứng lời, chép khuôn `xuong_dai/d11_lrv/`, viết `canh3d/dung_blender.py`, kết xuất nháp 960×540, ghép Remotion, soát. Chi tiết: skill.

**File và script.** `skills/dung-hoat-canh-3d-blender/` (`SKILL.md`, `bai_hoc.md`, `tim_mo_hinh.md`, `khuon/`); `xuong_dai/d11_lrv/`; `tai_san/mo_hinh_3d/<tên>/` (ngoài git); Blender ở `~/Applications/Blender.app` (5.2.3).

**Chi phí.**

| Khoản | Số |
|---|---|
| Token Claude | Chưa đo |
| Phần mềm, giấy phép | Blender miễn phí (GPL). Mô hình tải về có giấy phép riêng, có thể mất tiền (ví dụ 19, 89, 149 USD ở TurboSquid; Sketchfab không có mô hình miễn phí đúng cấu tạo buồng máy). Đĩa: Blender 907 MB, mô hình 1–4 GB, ảnh kết xuất khoảng 2 GB cho 15 giây |
| Giờ máy | Cycles 960×540, 24 mẫu: 412 khung trong 89 phút, trung bình 13,0 giây mỗi khung (7,6–100); mặt nạ 234 giây; ghép Remotion 41 giây (27/10/2026). Ước 1920×1080 gấp khoảng 4 lần, 40–55 giây mỗi khung ở 32 mẫu. 1 phút video là 1.800 khung: bản nháp khoảng 6,5 giờ, bản 1920×1080 khoảng 1 ngày (cả hai là ước từ số đo trên). EEVEE (không dò tia) 2,6 giây mỗi khung ở 1080p (video tua-bin) |
| Công của Trung | Chọn mô hình từ bảng ứng viên; đồng ý khối lượng giờ máy trước kết xuất; duyệt bản nháp; kiểm giấy phép các file vân trước khi đăng |

**Giới hạn.** Khuyến nghị trộn: chỉ vài cảnh cận vật thật (15–40 giây) dùng Blender, phần giải thích dựng bằng Remotion. Vật trong suốt nhiều lớp là phần tốn nhất. Mô hình thật nhỏ hơn kích thước thật nên phải chỉnh khoảng cách máy quay, công suất đèn, f-stop.

**Thành phẩm mẫu.** `san_pham/2026.10.26.canh_thu_d11_lrv/2026.10.27.canh_thu_d11_lrv_v2_nhap.mp4`.

## 7. LM-06 — Clip AI ghép Remotion

**Là gì.** Clip video ngắn do AI sinh, dùng làm cảnh nền hoặc vài giây minh hoạ. Có hai cách: **Muse** của Meta (Claude giao qua trang web `muse.ai` trên Chrome của Trung, skill `skills/giao-muse-video/`) và **Flow** của Google (Trung tạo tay, Veo 3.1 và Omni, không gọi qua API, quyết định 26/10/2026).

**Dùng khi.** Cảnh quay tả thực mà mã không vẽ được; cần vài giây nền, không phải thân video.
**Không dùng khi.** Nội dung khoa học cần hình đúng số liệu; có dữ liệu khách hàng hoặc thông tin nội bộ chưa công bố (Muse chạy trên máy chủ của Meta); video cần kết quả giống hệt mỗi lần chạy.

**Chất liệu làm được.** Không có mã chất liệu riêng: clip là nguyên liệu xen vào mọi chất liệu khác. CL-15 (minh hoạ có nhân vật) chưa thử.

**Các bước (Muse).** Mở đoạn chat mới, gửi câu lệnh từ mô tả hình của kịch bản, chờ, xin phép tải, tải về `tai_san/clip_ai/muse/`, đo bằng ffprobe, ghi `tai_san/clip_ai/so_clip_ai.tsv`, ghép trong Remotion (phóng 720p lên 1080p ở bước dựng, tắt tiếng nền).

**Chi phí.**

| Khoản | Số |
|---|---|
| Token Claude | Chưa đo (Claude điều khiển Chrome bằng công cụ Claude in Chrome) |
| Phần mềm, giấy phép | Muse: không API, chỉ mở cho Mỹ và Canada khi tra (26/10/2026); điều khoản nội dung AI của Meta, nền tảng đăng có thể buộc gắn nhãn AI. Flow: gói Google AI Pro đã trả, 1.000 credit mỗi tháng cộng 50 credit mỗi ngày |
| Giờ máy | Muse: chờ khoảng 2 phút cho clip 10 giây, xin 1080×1920 nhận 720×1280, H.264 24 khung/giây, 8,6 MB, có tiếng nền (lần thử 26/10/2026). Flow: chưa đo |
| Công của Trung | Muse: tự đăng nhập, đồng ý tải. Flow: tạo từng clip bằng tay |

**Giới hạn.** Độ phân giải thật 720p, độ dài lệch so với xin (xin 8 giây nhận 10 giây). Có thể có dấu ẩn không nhìn thấy, chưa kiểm. Clip khác nhau phong cách nếu gửi sang đoạn chat khác.

**Thành phẩm mẫu.** Clip tua-bin gió bình minh của lần thử 26/10/2026 (ghi trong `tai_san/clip_ai/so_clip_ai.tsv`; mp4 ngoài git).

## 8. LM-07 — Manim

**Là gì.** Manim: thư viện Python vẽ hoạt hình toán kiểu kênh 3Blue1Brown. **Chưa cài trên máy này.** Ghi ở đây để biết: trong 703 prompt của repo mẫu, một prompt dùng Manim thật (`linearuncle-971663`, bài giảng đạo hàm 7 phút kèm giọng edge-tts) và một prompt dùng bản tự chế (`eleanorina-653042`, "FrankenManim").

**Chi phí.** Chưa đo, chưa có phép thử. Điều kiện biết trước, chưa kiểm trên Mac của Trung: cần Python và thư viện đồ hoạ; công thức toán thường cần LaTeX (Remotion thì không cần). Giấy phép chưa đối chiếu.

**Khi nào thử (đề xuất).** Chỉ khi CL-05 (đồ thị SVG) và CL-14 (mô phỏng và bề mặt toán) làm bằng LM-02 hoặc LM-03 không đạt ở ít nhất ba video toán liên tiếp.

## 9. Kết hợp các cách làm

Quy tắc chung: **thân video dựng bằng một cách làm; cảnh lẻ cần chất lượng khác dựng bằng cách làm khác rồi ghép vào thân.** Lý do: chi phí mỗi giây video khác nhau giữa các cách, nên chỉ dùng cách tốn kém cho đoạn thật sự cần.

| Kết hợp | Đã làm chưa | Cách ghép |
|---|---|---|
| LM-02 + LM-05 | Đã làm (D-11) | Blender ra ảnh PNG nền trong suốt và ảnh mặt nạ; Remotion ghép nền, viền sáng, nhãn chữ, phụ đề, giọng. Mốc chung `src/thoi_gian.json` |
| LM-02 + LM-03 | Chưa thử | Cảnh LM-03 xuất MP4 không tiếng; đặt vào `xuong_dai/<tên>/public/`; trong Remotion dùng thành phần `OffthreadVideo` (đọc khung từ file mp4 theo số khung) trong đúng đoạn cảnh; giọng và nhạc do Remotion phát |
| LM-01 + LM-06 | Chưa thử | Clip AI làm nền khối cảnh; phóng 720p lên 1080×1920, tắt tiếng nền |
| LM-04 + LM-03 | Chưa thử | Hai cách cùng cơ chế chụp khung; không có lý do ghép, chọn một |

Khi ghép cảnh LM-03 hoặc LM-05 vào Remotion, phải khớp bốn thứ: (1) số khung/giây (xuất cảnh LM-03 đúng 30 khung/giây để khớp Remotion, bản 60 khung/giây có nhoè dùng cho video 60 khung/giây hoặc hạ xuống 30); (2) độ dài cảnh bằng độ dài đoạn Remotion tính từ mốc câu (độ dài cảnh = giọng + 15 khung đầu + 24 khung cuối, `10_video_ngang_thuyet_minh.md`); (3) màu nền: đo điểm ảnh nền của cảnh ghép so với màu nền Remotion bằng `scripts/do_tuong_phan_khung.py`, chênh lệch thấy được thì đổi nền cảnh; (4) phông tiếng Việt: kiểm khung cắt từ file mp4 cuối.

Làm thử bằng một cảnh 5 giây trước khi ghép cảnh dài, và ghi số đo vào mục này.

## 10. Khi nào cập nhật file này

Cập nhật khi có số đo mới của một cách làm, khi một cách làm đổi trạng thái (từ chưa cài sang đã thử, từ đã thử sang có sẵn), hoặc khi thêm cách làm mới. Mỗi số mới ghi nguồn và ngày ngay trong ô. Đừng nâng trạng thái "có sẵn" khi mới chạy một lần.
