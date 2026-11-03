# 10 — Video ngang có thuyết minh (Giai đoạn 3: video khoa học ngang)

> Module của giai đoạn 3. Đọc trước mọi việc làm video giải thích khoa học, video bài giảng ngang 1920×1080 có giọng đọc.
> Luồng các việc dùng chung cho hai khổ nằm ở `01_quy_trinh_chung.md`; file này chỉ giữ phần riêng của khổ ngang. Nhật ký từng video: `tai_san/nhat_ky_video_ngang.md`.
> **Phiên bản:** 2.3 · **Cập nhật:** 2026-10-28 · Gom bài học lô 18 video điện chung và điện mặt trời (Trung duyệt gom 28/10/2026): cảnh toàn đồ thị bắt buộc có dải sáng quét nền `tai_san/khoi_dung_san/DaiQuet.tsx` (mục 25 quy tắc 6, Trung chốt 28/10/2026); `TOC_DO = 1.0` và khuôn "chậm X%" (mục 2, 23), bảng màu đo thêm trên MAU-10, MAU-12, MAU-13, MAU-16, màu tô nhấn `MeshBasic` (mục 25 quy tắc 1), cách đo tương phản vùng vật, nhãn và phụ đề (±70% nửa bề rộng, dải phụ đề từ 83% chiều cao, `setViewOffset`, cửa sổ nhãn ≥ 1 giây), máy quay trôi 2% và `far = 1500`, ánh sáng nền sáng, cảnh cắt mở, gộp hình học, hình phóng to giải thích cơ chế, dữ kiện đo `freezedetect`; ghi chú theo dự án dựng vào nhật ký mục 26.
> **Phiên bản:** 2.2 · **Cập nhật:** 2026-10-28 · Thêm mục 25: quy tắc dựng rút ra từ lô 16 video điện gió (bảng màu vật theo bảng màu, cỡ vật chính, nhãn, thẻ, chống đứng hình, cảnh cắt lớp nước; Trung duyệt gom 28/10/2026).
> **Phiên bản:** 2.1 · **Cập nhật:** 2026-10-27 · Áp quyết định Trung 27/10/2026: bỏ ElevenLabs (bảng mục 1); nhạc ngắn hơn video trỏ về một thứ tự duy nhất ở `08_giong_am_thanh_phu_de.md` mục 7 (mục 2 đoạn Nhạc, quy tắc 4 của mục 23); mã nhạc cũ N05 đổi NH05 trong quy tắc 4 (mã việc N03 đến N17 giữ nguyên); tên file video mới bỏ mã dựng (mục 2 đoạn Kết xuất).
> **Phiên bản:** 2.0 · **Cập nhật:** 2026-10-27 · đổi tên từ `14_khuon_video_dai_thuyet_minh.md` khi dựng lại luồng Media: nhật ký từng video (mục 7, 8, 10 đến 18, 20 đến 22, 24) chuyển nguyên văn sang `tai_san/nhat_ky_video_ngang.md`; mục 2 chỉ còn phần riêng của khổ ngang, luồng chung ở `01_quy_trinh_chung.md`; mục 3 (cách đọc thuật ngữ) sang `03_kich_ban_va_loi_viet.md` mục 5.3; video mới chọn dựng theo hệ trục thay mã D.
> **Phiên bản:** 1.27 · **Cập nhật:** 2026-10-27 · Mục 1 và mục 2 bước 1: cửa chọn phong cách dựng đổi sang tổ hợp năm trục (CL, CT, BC, MAU, NH) do `scripts/goi_y_to_hop_dung.py` gợi ý; ưu tiên D-09b cho video máy móc thành luật cộng điểm trong file dữ liệu.
> **v1.26** 2026-10-27 · Mục 2 bước 2, 3, 6 theo quy tắc mỗi video một thư mục: tạo `san_pham/yyyy.mm.dd.<chủ_đề>/` khi viết kịch bản, kịch bản và nguồn kiểm chứng vào `tai_nguyen/kich_ban/`, giao bản nháp và bản cuối vào thư mục đó kèm bản chép âm thanh và `nguon_goc.md`.

## Mục lục

Số mục giữ nguyên số của module 14 cũ, để các chú thích kiểu "module 14 mục 19" trong mã `xuong_dai/` tra được. Mục không còn ở file này nằm ở chỗ ghi ở cột cuối.

| Mục | Nội dung | Nằm ở |
|---|---|---|
| 1 | Phạm vi và trạng thái thật | file này |
| 2 | Phần riêng của khổ ngang trong luồng chung (kiểm chứng, dữ liệu chương, vẽ hoạt hoạ, giọng đọc và nhạc, kết xuất, soát) | file này |
| 3 | Cách đọc thuật ngữ cho giọng máy | `03_kich_ban_va_loi_viet.md` mục 5.3 |
| 4 | Lỗi đã vấp | file này |
| 5 | Rủi ro còn lại | file này |
| 6 | Dựng cảnh 3D: Three.js hay Blender, số đo, chi phí | file này |
| 7, 8 | Video 3D pin mặt trời; video tua-bin gió tả thực | `tai_san/nhat_ky_video_ngang.md` |
| 9 | Đề xuất kết xuất nháp độ phân giải thấp cho Blender | file này |
| 10 đến 18 | Nhật ký các video buồng máy, máy biến áp, pin làm lại, inverter, hộp số, BESS, tăng áp, che gió, monopile | `tai_san/nhat_ky_video_ngang.md` |
| 19 | Phụ đề chạy chữ theo từng từ cho giọng VieNeu | file này |
| 20, 21, 22 | Cảnh thử D-11 Blender Cycles; video điện áp dòng điện điện trở; video proton | `tai_san/nhat_ky_video_ngang.md` |
| 23 | Chuỗi 15 video kiến thức điện chạy đêm: cách chạy và chín quy tắc dựng | file này |
| 25 | Lô 16 video điện gió và lô 18 video điện chung, điện mặt trời: bảng màu vật theo bảng màu, cỡ vật chính, nhãn, thẻ, chống đứng hình, cảnh cắt lớp nước, ánh sáng nền sáng, máy quay, cảnh cắt mở, hình phóng to | file này |
| 26 | Lô 18 video điện chung, điện mặt trời: ghi chú theo dự án dựng (`bat` và `tien`, `TamPinLon`, `DaoPhao`, video lai) | `tai_san/nhat_ky_video_ngang.md` |
| 24 | Video proton viết lại thành hai video | `tai_san/nhat_ky_video_ngang.md` |
| Tra nhanh | Kỹ thuật dùng lại được, nằm trong nhật ký từng video | cuối file này |

Tra mục trong file: `grep -n "^## 19\." 10_video_ngang_thuyet_minh.md`.

## 1. Phạm vi và trạng thái thật

| Hạng mục | Trạng thái (cập nhật 2026-10-27) |
|---|---|
| Khổ hình | Ngang 1920×1080, 30 khung hình mỗi giây. Video ngắn dọc vẫn thuộc giai đoạn 1 (`09_video_doc_ngan.md`) |
| Ca thử đã làm | Video "Nguyên lý tạo điện của pin mặt trời", 6 cảnh, 79,9 giây. Mã dựng: `xuong_dai/pin_mat_troi/`. Bản xuất: `san_pham/2026.10.25.nguyen_ly_pin_mat_troi_v3_phat_am_chuan.mp4` (ngoài git) |
| Mã dựng chạy được | Có, trên máy Mac. Cần Node và Chrome; không cần LaTeX hay ffmpeg riêng (Remotion mang ffmpeg theo) |
| Giọng đọc chuẩn | **VieNeu-TTS v3 Turbo, giọng Hải Đăng** (Trung chọn 25/10/2026), chạy trên máy, miễn phí, không cần khoá. Script `scripts/sinh_giong_vieneu.py`: đọc từng câu, Whisper nghe lại, câu sai nhiều thì đọc lại. Cài đặt, cách chạy, giới hạn: `08_giong_am_thanh_phu_de.md` mục 0. Video pin mặt trời bản 3D đã chuyển sang giọng này |
| Giọng đọc khác | Không có: từ 27/10/2026 Trung bỏ ElevenLabs, chỉ dùng VieNeu (`08_giong_am_thanh_phu_de.md` mục 1). Microsoft HoaiMy qua `edge-tts` chỉ còn ý nghĩa lịch sử: ca thử 2D dùng giọng này, lý do không dùng nữa ở mục 4 |
| Hai cửa chọn phong cách (KB-xx viết kịch bản; dựng chọn tổ hợp năm trục từ 27/10/2026) | Ca thử 2D chưa qua. Video pin mặt trời bản 3D (25/10/2026, trước hệ trục) đã qua đủ: KB-05 Bóc cơ chế, D-07 Đất sét & bản vẽ |
| Phong cách dựng cho video khoa học | **Từ 27/10/2026 video mới chọn tổ hợp năm trục (chất liệu CL, mức chi tiết CT, bố cục BC, tông màu MAU, nhạc NH) theo `04_he_truc_dung.md`; dữ liệu `tai_san/so_tay_gu/he_truc_dung.json`; không chọn mã D.** Cột "Tách từ" của `tai_san/so_tay_gu/he_truc_dung.md` cho biết mỗi giá trị trục tách từ mã D nào (D-07 đến D-11) và bảng màu M0 đến M8 nào. Video mở trước 27/10/2026 giữ mã D trong kịch bản của nó; thẻ D vẫn nằm ở `tai_san/so_tay_gu/dung/`. Cho máy móc có bộ phận, tổ hợp đề xuất đầu tiên là CL-07 · CT3 (tách từ D-09b; nay là luật cộng điểm trong file dữ liệu; Trung chốt 26/10/2026): đặt lên đầu, ghi Khuyến nghị, vẫn đưa các tổ hợp khác để Trung chọn. Khi đề xuất CT3 phải nói trước thời gian dựng: mọi bộ phận xuất hiện đều dựng chi tiết, video 2 phút có thể mất trọn một ngày máy làm (số đo thật của video máy biến áp: `tai_san/nhat_ky_video_ngang.md` mục 11) |

Danh sách các thư mục trong `xuong_dai/` và mục ghi cách làm của từng video: bảng đầu `tai_san/nhat_ky_video_ngang.md`. Mỗi thư mục là một dự án Remotion riêng, có `node_modules/` riêng; mở phiên ở gốc `Media/` rồi chạy lệnh trong thư mục.

Hệ quả phải nói thẳng khi nhận việc: VieNeu không có tham số tốc độ đọc và không tự trả mốc từng từ. Từ 26/10/2026 phụ đề chạy chữ theo từng từ làm được với VieNeu: Whisper nghe lại để lấy mốc thời gian từng từ, chữ lấy từ trường `text` của kịch bản (mục 19). Lệch đo được: từ giữa câu trung vị 13 ms, 96% trong một khung hình; từ đầu câu hiện sớm hơn tiếng 55–110 ms. Video D-09b làm trước ngày đó vẫn đi theo câu cho tới khi chạy bổ sung mốc từ.

## 2. Phần riêng của khổ ngang trong luồng chung

Luồng các việc dùng chung cho cả hai khổ (làm rõ yêu cầu, hai cửa chọn, hai cửa duyệt, kết xuất, soát, giao): `01_quy_trinh_chung.md`. Mục này chỉ giữ phần riêng của khổ ngang. Chữ "nhật ký mục N" chỉ mục N của `tai_san/nhat_ky_video_ngang.md`; chữ "mục N" đứng riêng chỉ mục cùng số của file này (số mục giữ số của module 14 cũ, xem mục lục).

**Hai cửa chọn.** Ở hai cửa chọn ghi "đã dùng ở X/3 video gần nhất"; cửa chọn dựng chạy `python3 scripts/goi_y_to_hop_dung.py --kho ngang` (`04_he_truc_dung.md` mục 3). Chốt xong thì tự chọn biến tấu (nhạc, nhịp máy quay, cách mở đầu, 5–9 cảnh, 60–150 giây) và ghi dòng "Biến tấu" vào đầu kịch bản, theo `04_he_truc_dung.md` mục 6. Không mặc định 7 cảnh, 120 giây, màu MAU-09 (bảng M0 cũ).

**Kiểm chứng kiến thức.** Bắt buộc với khổ ngang; cách làm, file nguồn kiểm chứng và mẫu: `03_kich_ban_va_loi_viet.md` mục 5.2. Cách giao tác tử con kiểm chứng song song với việc dựng mô hình đã dùng ở nhật ký mục 11, 22, 24.

**Viết kịch bản (dữ liệu chương).** Viết kịch bản vào `san_pham/<thư mục video>/tai_nguyen/kich_ban/` (tạo thư mục video theo `AGENTS.md` mục Quy ước sản phẩm) thành `<tên>.chuong.json` (kèm bản đọc `<tên>.md`): mảng chương, mỗi chương có `id`, `ten`, `text` (phụ đề, viết đúng chính tả) và `doc` (lời đọc phiên âm cho máy, `03_kich_ban_va_loi_viet.md` mục 5.3). Một chương một ý, câu dưới 20 chữ. Ca thử 2D cũ dùng `scenes.json` với trường `caption`, `text`, `doc`.

**Vẽ hoạt hoạ bằng Remotion** trong `xuong_dai/<ten>/src/`. Video 3D xuyên thấu (chất liệu CL-07 bằng Three.js; trước 27/10/2026 gọi là D-09b): lấy khung mã của video cùng loại gần nhất (`CoBan.tsx`, `ThongSo.ts`, `KichBan.ts`, `Video.tsx`, `Root.tsx`, cách tổ chức ở nhật ký mục 11), mô hình thiết bị viết file riêng để video sau dùng lại; khung mã nào cho loại video nào: quy tắc 1 của mục 23. Khi chép thư mục mã, không dùng `rsync --exclude src` (làm hỏng thư viện Node, `90_bai_hoc.md` 26/10/2026). Video 2D (React và SVG) lấy `Video.tsx` của ca thử `xuong_dai/pin_mat_troi/` làm khuôn.

**Giọng đọc và thời gian.** Tạo giọng đọc từng cảnh (hoặc từng chương) bằng `scripts/sinh_giong_vieneu.py`; script ghi sẵn thời lượng và mốc câu (`c<n>.moc_cau.json`). Ca thử 2D cũ đo thời lượng bằng `remotion ffprobe`, ghi vào `src/durations.ts`. Độ dài mỗi cảnh = thời lượng giọng + 15 khung hình đầu + 24 khung hình cuối. Mốc hình trong cảnh (ví dụ lúc photon đập vào) canh theo mốc câu `c<n>.moc_cau.json`, không canh theo cảm tính. Video khung mã 3D (CL-07) gom độ dài cảnh và mốc câu vào `src/thoi_gian.json` bằng `tao_thoi_gian.py` trong thư mục video (script này cũng tăng tốc giọng, giữ cao độ, theo hằng `TOC_DO`; giọng sinh bằng `scripts/sinh_giong_vieneu.py` từ 27/10/2026 đã có hệ số kéo ngay lúc sinh, nên đặt `TOC_DO = 1.0`, không tăng tốc thêm; lô 18 video, N54); chạy lại sau mỗi lần đọc lại giọng.

**Nhạc.** Đặt tay trong `Video.tsx` của từng video (hằng số `NHAC`, `TOC_NHAC`, `AM`, `playbackRate`, `startFrom`); chọn mã NH theo `08_giong_am_thanh_phu_de.md` mục 7. Nhạc ngắn hơn video: theo thứ tự duy nhất ở `08_giong_am_thanh_phu_de.md` mục 7 (Trung chốt 27/10/2026). Các video làm trước ngày đó đã dùng cách khác nhau (nhật ký mục 10, 12, 22); không áp lại cho video mới.

**Kết xuất, soát, giao.** Kết xuất `npx remotion render <MaThanhPhan> out/video.mp4 --codec=h264`, kiểm file bằng `remotion ffprobe`, chép ra ngoài cùng thư mục video, tên `yyyy.mm.dd.<chủ đề>_v<n>[_nhap|_cuoi].mp4` (đuôi `_nhap` cho bản nháp, `_cuoi` khi Trung duyệt; không ghi mã dựng, tổ hợp trục và cách làm ghi trong kịch bản và `nguon_goc.md`; video cũ giữ tên cũ; Trung chốt 27/10/2026), soát theo `15_bang_kiem_truoc_khi_giao.md`. Khi giao bản cuối: chép `public/giong/` và `public/nhac/` sang `tai_nguyen/am_thanh/`, viết `tai_nguyen/nguon_goc.md` (thư mục mã dựng, thành phần Remotion, lệnh dựng lại), bản nháp trùng byte với bản cuối bỏ vào Thùng rác, bản nháp khác chuyển vào `tai_nguyen/ban_nhap/`.

Trước khi kết xuất cả video, kết xuất vài khung hình bằng `npx remotion still` để soát chữ đè lên hình. Ca thử phát hiện hai nhãn đè lên mép hình pin bằng cách này. **Sau khi kết xuất, trước khi giao, bắt buộc soát lại bằng khung cắt từ chính file mp4** (`scripts/soat_khung_mp4.py`, nhật ký mục 10): `still` không lộ lỗi do trạng thái đi qua nhiều khung. **Cùng lượt đó đo tương phản vật chính trên vài khung cắt** bằng `python3 scripts/do_tuong_phan_khung.py <khung.jpg> <x,y vật>:<x,y nền>` (ngưỡng 3:1) và kiểm vật chính cao ít nhất 1/4 khung ở mỗi cảnh (quy tắc Trung chốt 26/10/2026, nhật ký mục 17). Thiết bị có mặt sáng (mặt số, màn hình): đo trung bình cả vùng vật, không đo một điểm ở thân tối (thân tối 12:1, cả đồng hồ chỉ 2:1; lô 18 video, N21 v2). Đo chiều cao vật chính trên khung bằng cửa sổ quanh vật, không bằng mặt nạ màu cả khung (lô 18 video, N23). **Quét mọi khung bằng `.venv_vieneu/bin/python scripts/quet_khung_hong.py <file.mp4>` là bước bắt buộc trước khi giao** (bắt khung hỏng ngẫu nhiên khi kết xuất WebGL, khoảng 4–6 giây cho video 2 phút; cách thay khung ghi ở đầu script; `90_bai_hoc.md` 27/10/2026).

## 3. Cách đọc thuật ngữ cho giọng máy

Đã chuyển sang `03_kich_ban_va_loi_viet.md` mục 5.3 (bảng phiên âm của ca thử, thuật ngữ điện cho giọng Hải Đăng Trung chọn 27/10/2026, chuẩn hoá cho Whisper). Mục này giữ chỗ để giữ số mục cũ.

## 4. Lỗi đã vấp (chép sang `90_bai_hoc.md` khi Trung duyệt)

- Thay chuỗi "p n" bằng "pê en" khớp nhầm cả "lớp n" thành "lớpê en". Thay thế theo cụm đầy đủ ("mối nối p n"), rồi kiểm lại toàn bộ lời đọc trước khi tạo giọng.
- `edge-tts` thỉnh thoảng trả lỗi "không nhận được âm thanh" ngay lần gọi đầu. Gọi lại tối đa 5–6 lần, cách nhau vài giây; kiểm file không rỗng.
- `edge-tts` là cách gọi không chính thức vào dịch vụ của Microsoft, có thể bị chặn bất cứ lúc nào, và gửi lời đọc lên máy chủ Microsoft. Không dùng cho nội dung chưa công bố.
- Lệnh `say` của macOS ghi `.aiff` nén mà ffmpeg của Remotion không đọc được. Ghi thẳng WAV bằng `--data-format=LEI16@24000`.
- Gói `piper-tts` 1.8.0 trên Python 3.9 tìm dữ liệu phát âm sai thư mục; chạy được sau khi tạo liên kết các file trong `piper/espeak-ng-data/` ra thư mục `site-packages`. Chất lượng giọng Piper tiếng Việt chưa đạt (đọc nhanh bất thường).
- Không thể nghe âm thanh trong phiên Claude: chọn giọng và cách đọc là việc của Trung, không tự kết luận "đọc đúng".
- VieNeu cài mặc định kéo onnxruntime 1.31, nạp mô hình báo "External data path escapes model directory". Ghim `onnxruntime==1.22.1` (chi tiết ở `90_bai_hoc.md` 25/10/2026).
- Whisper (máy nghe lại để soát giọng VieNeu) hay nghe nhầm phụ âm giọng Bắc: "trục" thành "chụp", "dây" thành "giấy", "dư" thành "giữ". Câu script báo "vẫn sai" phải đưa Trung nghe bằng tai, không tự kết luận giọng đọc sai.

## 5. Rủi ro còn lại

- Máy dựng hiện là Mac, quy trình đã chạy cho các video từ 25/10/2026. Nếu quay lại máy Windows: `node_modules` của mỗi `xuong_dai/<ten>/` sâu tương tự `xuong/`, kiểm giới hạn 260 ký tự đường dẫn trước khi `npm install`.
- Hình vẽ khoa học là minh hoạ đơn giản hoá (vị trí hấp thụ photon, độ dày lớp n). Ghi rõ trong file nguồn kiểm chứng.

## 6. Dựng cảnh 3D (cảnh thử 25/10/2026)

Theo hướng video mẫu "Inside a Wind Turbine" (bản phân tích: `san_pham/2026.10.25.huong_dan_lam_video_khoa_hoc_kieu_first_gear/2026.10.25.huong_dan_lam_video_khoa_hoc_kieu_first_gear_v1.md`), xưởng thử dựng cùng một cảnh 3D 12 giây bằng hai công cụ: tấm pin trên giá → ô pin tách năm lớp có nhãn → photon bật electron, electron chạy qua dây làm sáng bóng đèn. Nội dung lấy từ kịch bản pin mặt trời đã kiểm chứng.

**Cách tổ chức để hai công cụ dựng ra cùng một cảnh** (dùng lại cho video 3D sau):

| File trong `xuong_dai/pin_mat_troi/` | Vai trò |
|---|---|
| `canh3d/thong_so.json` | Kích thước, màu, góc nhìn máy quay. Toạ độ theo Three.js (trục Y lên) |
| `canh3d/dong_thoi_gian.mjs` → `dong_thoi_gian.json` | Sinh trạng thái từng khung: vị trí máy quay, khe tách lớp, vị trí hạt, độ sáng bóng đèn. Chạy `node canh3d/dong_thoi_gian.mjs` sau mỗi lần sửa |
| `src/canh3d/CanhThu.tsx` | Bản Three.js, lớp chữ dùng chung (nhãn bám theo toạ độ 3D bằng phép chiếu của máy quay), bản ghép khung Blender, bản so sánh. Ba thành phần dựng: `CanhThuThree`, `CanhThuBlender`, `SoSanh3D` |
| `canh3d/dung_blender.py` | Dựng cùng cảnh trong Blender bằng Python, đặt khoá chuyển động mỗi khung theo `dong_thoi_gian.json`, kết xuất chuỗi ảnh nền trong suốt vào `public/blender/` (ngoài git). `--luu` ghi `canh3d/canh_thu.blend` để mở bằng giao diện Blender |

Chữ, nhãn, phụ đề luôn dựng ở Remotion, không dựng trong Blender: sửa chữ không phải kết xuất lại 3D, và hai bản dùng chung một lớp chữ.

**Số đo trên máy Mac (chip Apple M5, 24 GB), 360 khung 1920×1080:**

| | Remotion + Three.js | Blender 5.2.3 (EEVEE, 32 mẫu) |
|---|---|---|
| Thời gian ra file video | 35 giây (dựng hình, ghép chữ và mã hoá trong một lệnh) | 185 giây kết xuất 3D (0,51 giây/khung) + 35 giây ghép chữ trong Remotion |
| Cài thêm | Gói Node `three`, `@react-three/fiber@8`, `@remotion/three` (cùng số bản với `remotion`) | Ứng dụng Blender, khoảng 330 MB, đặt ở `~/Applications/Blender.app` (máy không có Homebrew; tải file cài chính thức từ download.blender.org, đã đối mã băm SHA-256) |
| Xem thử khi sửa | Remotion Studio hoặc `npx remotion still` | Kết xuất khung lẻ (`--khung 0,200`) hoặc mở file `.blend` |
| Chất lượng ở cảnh này | Ngang nhau, vì mô hình dựng từ khối cơ bản. Blender cho kim loại và bóng đổ mềm hơn một chút | |

**Quy tắc chọn công cụ (Trung chốt 25/10/2026):** cảnh 3D mặc định dựng bằng **Remotion + Three.js**. Chỉ chuyển sang Blender khi cần thứ Three.js làm khó: mô hình 3D tải về hoặc mua (định dạng `.blend`, `.fbx`), vật liệu thật (kính khúc xạ, kim loại xước), kết xuất dò tia Cycles, hoặc khi Trung muốn tự mở cảnh chỉnh bằng tay. Dùng Blender thì nói trước với Trung lý do. Hai cách dùng chung `thong_so.json` và `dong_thoi_gian.json` nên đổi công cụ giữa chừng không phải làm lại chuyển động. Cảnh thử chưa đo được giới hạn của Three.js với mô hình chi tiết; đo lại khi có cảnh nặng.

**So sánh chi phí (lý do chọn):**

| Khoản | Three.js | Blender |
|---|---|---|
| Tiền bản quyền | Miễn phí (MIT) | Miễn phí (GPL) |
| Remotion (cả hai cách đều dùng) | Miễn phí cho cá nhân và công ty tối đa 3 nhân viên; tổ chức lớn hơn phải mua giấy phép công ty (file `LICENSE.md` của gói `remotion`). Làm video nhân danh MB thì phải xét khoản này, chọn cách nào cũng vậy | như bên trái |
| Máy chạy, video 12 phút (suy từ cảnh thử đơn giản) | Khoảng nửa giờ | Khoảng 3,5 giờ |
| Đĩa | Thư viện khoảng 30 MB | Ứng dụng 907 MB; ảnh trung gian 320 MB cho 12 giây, khoảng 19 GB cho 12 phút, phải dọn sau khi xuất |
| Hạn mức Claude | Gần bằng nhau; xem thử một khung cần một lệnh | Xem thử một khung cần hai lệnh (dựng 3D rồi ghép chữ) |

Blender vẫn giữ trên máy (`~/Applications/Blender.app`). Lỗi đã vấp ở cảnh thử: `90_bai_hoc.md` mục ngày 25/10/2026.

Thành phẩm cảnh thử (ngoài git): `san_pham/2026.10.25.canh_thu_3d_pin_mat_troi_so_sanh_v1.mp4` (hai bản cạnh nhau), `..._threejs_v1.mp4`, `..._blender_v1.mp4`.

Ngoại lệ Blender Cycles (viền sáng, nền phòng chụp của kênh Jared Owen): chỉ dùng khi có mô hình chi tiết và vật liệu có vân; mô hình tự dựng từ khối cơ bản thì dùng Three.js như trên. Cảnh thử, số đo và quy trình: nhật ký mục 20 và skill `skills/dung-hoat-canh-3d-blender/`.

## 9. Đề xuất: kết xuất nháp độ phân giải thấp để duyệt hình trước (chưa thử, ghi 26/10/2026)

**Số đo thời gian video tua-bin gió** (đọc từ nhật ký phiên Claude Code, giờ Việt Nam). Từ lệnh đầu tiên 15:50 ngày 25/10 tới lúc chốt bản cuối 07:33 ngày 26/10 là 15 giờ 43 phút. Máy làm 3 giờ 22 phút; khoảng 12 giờ 20 phút còn lại là thời gian bản nháp đã xong và chờ Trung mở xem (hai quãng dài 6 giờ 36 và 5 giờ 18).

| Phần máy làm | Thời gian |
|---|---|
| Blender kết xuất 2.540 khung tả thực, 1920×1080, EEVEE 48 mẫu | 109,7 phút |
| Remotion ghép 4.708 khung, ba lần (v1, v2, v3), mỗi lần khoảng 7 phút 20 | 22 phút |
| Viết kịch bản, kiểm chứng nguồn, hỏi Trung, dựng mô hình, sửa mã, soát khung | khoảng 70 phút |

Theo từng bản: v1 đất sét (Three.js) 44 phút; v2 tả thực (Blender) 2 giờ 19 tính từ lúc Trung yêu cầu tới lúc giao; v3 đổi giọng 17 phút, vì dùng lại ảnh Blender của v2.

**Vấn đề.** Trung chỉ xem được hình tả thực sau khi Blender chạy hết gần 2 giờ ở chất lượng đầy đủ. Nếu lúc đó Trung muốn sửa hình (góc máy, vật liệu, chi tiết buồng máy) thì phải chạy lại phần lớn thời gian ấy. Với video tua-bin gió Trung duyệt hình ngay nên không mất thêm, nhưng với cảnh tả thực dựng lần đầu thì khả năng phải sửa hình cao.

**Đề xuất: chia kết xuất Blender thành hai lượt.**
1. Lượt nháp: 50% độ phân giải (960×540) và giảm mẫu khử răng cưa xuống `--mau 16` (mặc định 48). Ghép bằng Remotion thành bản nháp có giọng và nhãn chữ để Trung duyệt hình. Remotion phóng ảnh lên 1920×1080, hình mờ hơn nhưng đủ để duyệt bố cục, góc máy, vật liệu.
2. Lượt đầy đủ: chỉ chạy sau khi Trung duyệt hình bản nháp, ra `public/blender/` như hiện nay.

Cách nhẹ hơn khi chỉ cần duyệt bố cục: kết xuất đủ chất lượng nhưng mỗi giây một khung (khoảng 85 khung với video này) bằng `--khung`, Trung xem dạng chuỗi ảnh tĩnh. Nhanh nhất nhưng không thấy chuyển động.

**Phải sửa mã trước khi dùng.** `canh3d/dung_blender.py` chưa có tuỳ chọn đổi độ phân giải (dòng `resolution_percentage` đặt cố định 100). Cần thêm tuỳ chọn, ví dụ `--ti-le 50`, và cho lượt nháp ghi ra thư mục riêng, ví dụ `public/blender_nhap/`: chế độ `--het` bỏ qua khung đã có, nên nếu ghi chung thư mục thì lượt đầy đủ sẽ giữ nguyên ảnh nháp. `src/Video.tsx` cần chọn thư mục ảnh theo một biến.

**Chưa đo.** Thời gian lượt nháp chưa đo. EEVEE tốn thời gian theo số điểm ảnh và số mẫu, nên lượt nháp phải nhanh hơn rõ rệt, nhưng chưa biết bao nhiêu phần của 1,2–4,8 giây mỗi khung là phần cố định không giảm theo độ phân giải. Lần đầu dùng thì đo và ghi số vào mục này. Lượt nháp cộng thêm thời gian khi Trung duyệt hình ngay; nó chỉ có lợi khi phải sửa hình.

## 19. Phụ đề chạy chữ theo từng từ cho giọng VieNeu (26/10/2026)

Mục đích: phụ đề hiện cả câu, từ chưa đọc mờ, từ đang đọc tô màu nhấn (đỏ của bảng màu), từ đã đọc đậm lại. Trung chọn kiểu hiển thị này làm mặc định (bảng chọn 26/10/2026). Trước đó VieNeu chỉ có mốc câu nên phụ đề hiện nguyên câu.

**Cách lấy mốc từng từ.** Whisper (`mlx-community/whisper-large-v3-turbo`, mô hình đã dùng để kiểm giọng) nghe lại từng câu với tuỳ chọn `word_timestamps` (trả mốc đầu, cuối từng từ). Whisper nghe tiếng Việt hay sai chữ ("giáp pin", "ELFP", "mô đùn"), nên chỉ lấy THỜI GIAN từ Whisper, chữ lấy từ trường `text` của `kich_ban/<tên>.chuong.json`. Ghép hai lượt bằng thư viện difflib (so khớp hai dãy) theo âm tiết đã chuẩn hoá: âm tiết Whisper nghe → âm tiết lời đọc `doc` (phiên âm, gần tiếng thật), rồi âm tiết `doc` → âm tiết `text`. Đoạn không khớp (thuật ngữ phiên âm như "li-ti" ↔ "lithium", số "ba phẩy hai" ↔ "3,2") chia thời gian theo độ dài chữ, kẹp giữa hai mốc khớp hai bên. Điều kiện: `text` và `doc` có cùng số câu (cắt tại `. ? !`).

**File và lệnh.**

| Việc | Làm thế nào |
|---|---|
| Giọng đọc mới | `scripts/sinh_giong_vieneu.py` tự ghi thêm `moc_tu.json` vào thư mục giọng (một file cho cả video, theo chương, mốc tính bằng giây trong `c<id>.wav`) |
| Giọng đã đọc từ trước (không đọc lại) | `.venv_vieneu/bin/python scripts/moc_tung_tu.py --kich-ban san_pham/<thư mục video>/tai_nguyen/kich_ban/<tên>.chuong.json --giong xuong_dai/<tên>/public/giong_goc [--chuong 3]`. Khoảng 10 giây một chương |
| Đưa mốc vào video dùng khung mã 3D (CL-07; trước 27/10/2026 gọi D-09b) | `tao_thoi_gian.py` đọc `public/giong_goc/moc_tu.json`, chia tốc độ tăng tốc (1,2), thêm trường `tu_moc` vào từng câu của `src/thoi_gian.json`. Đặt tên `tu_moc` vì trường `tu` đã có sẵn (khung bắt đầu câu, `Video.tsx` dùng để đặt tiếng) |
| Hiển thị | `src/PhuDeChayChu.tsx` trong khung mã `xuong_dai/may_bien_ap/` (khung mã CL-07, trước gọi D-09b): chép nguyên file sang video mới, thay `PhuDe` trong `Video.tsx`, truyền màu chữ, màu nhấn, màu nền thẻ. Câu không có `tu_moc` thì hiện cả câu như cũ. Không đổi độ đậm nét chữ khi tô để dòng chữ không xô lệch |
| Đo độ lệch | `scripts/do_lech_phu_de.py` (viết cho đoạn thử BESS chương 3; sửa đường dẫn khi đo video khác) |

Câu đã thay bằng file đọc riêng (biến `THAY_CAU` trong `tao_thoi_gian.py` của BESS) không dùng được mốc từ của file gốc; `tao_thoi_gian.py` của BESS bỏ qua câu đó, câu ấy hiện cả câu.

**Ca thử: video BESS chương 3** (6 câu, 67 từ, nhiều thuật ngữ: lithium, phosphate, LFP, 3,2 vôn, mô-đun). Thêm thành phần `BessChayChu` vào `xuong_dai/bess/src/Root.tsx` (thành phần `Bess` cũ giữ phụ đề theo câu như bản đã giao). Kết xuất khung 736–1230 (16,5 giây) với 4 luồng: 47 giây. Thành phẩm thử: `san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/tai_nguyen/ban_nhap/2026.10.26.bess_phu_de_chay_chu_thu_v1.mp4`. Kiểm `thoi_gian.json` ngoài trường `tu_moc` và 7 file giọng không đổi sau khi chạy lại `tao_thoi_gian.py`.

**Số đo độ lệch** (dương là chữ tô muộn hơn tiếng):

| Cách đo | Kết quả |
|---|---|
| Đầu câu: so chữ tô đầu câu với lúc tiếng bắt đầu, đo bằng năng lượng âm của file giọng (không dùng Whisper) | Chữ sớm hơn tiếng 55–110 ms ở cả 6 câu (trung bình khoảng 80 ms). Lý do: Whisper đặt từ đầu câu ở 0,00, còn mỗi câu VieNeu có sẵn khoảng 0,1 giây lặng ở đầu. Sớm 2–3 khung hình là chấp nhận được với phụ đề, nên giữ |
| Từ giữa câu: Whisper nghe lại cả đoạn mp4 (có nhạc nền, một lượt, không cắt theo câu), so 49 từ | Trị tuyệt đối trung vị 13 ms, phân vị 90 là 21 ms, lớn nhất 53 ms; 96% trong một khung hình (33 ms), 100% dưới 100 ms |
| Từ ngay sau chỗ nghỉ (đầu câu, sau dấu phẩy) đo bằng Whisper cả đoạn | Lệch 140–440 ms, nhưng đây là sai số của cách đo: Whisper nghe cả đoạn kéo mốc từ đó lùi về cuối từ trước. Cách đo bằng năng lượng ở hàng đầu cho thấy thực tế chữ sớm, không muộn |
| Khung cắt từ mp4 tại 6 từ (kim, lithium, LFP, 3,2, mô-đun, nghìn), 2 khung sau mốc | 5/6 đúng từ đang tô; từ "kim" chỉ dài khoảng 2 khung nên khung cắt đã sang từ "loại" — đúng với tiếng |

Giới hạn của số đo: lượt đo từng từ dùng cùng mô hình Whisper với lượt lấy mốc (khác cách nghe: cả đoạn có nhạc so với từng câu sạch), nên chưa phải phép đo hoàn toàn độc lập. Máy chỉ có sẵn mô hình này; muốn đo độc lập hơn thì tải thêm một mô hình Whisper khác.

**Chưa làm:** khuôn video ngắn dọc (`xuong/`, `09_video_doc_ngan.md` mục 1) vẫn dùng phụ đề cụm chữ trắng chia theo ký tự cho giọng VieNeu; có thể dùng `moc_tu.json` để tô đỏ từ đang đọc như thẻ D-01. Các video D-09b đã giao (máy biến áp, pin, inverter, hộp số, BESS bản chính…) chưa chạy bổ sung mốc từ.

## 23. Chuỗi 15 video kiến thức điện chạy đêm bằng luồng công việc (26–27/10/2026)

*Mã dựng D-09b, D-10, bảng màu M0 đến M8 và mã việc N03 đến N17 trong mục này là mã dùng lúc chạy chuỗi (trước 27/10/2026), giữ nguyên vì là ghi chép đã chạy; video mới dùng hệ trục, tra cột "Tách từ" của `tai_san/so_tay_gu/he_truc_dung.md`.*

**Sản phẩm (bản nháp, chờ Trung duyệt).** 15 file `san_pham/2026.10.27.<tên>_<mã D>_v1_nhap.mp4`, 88–119 giây mỗi video, tổng khoảng 26 phút. Bảng từng video (KB, D, bảng màu, nhạc, câu cần nghe bằng tai, số đã bỏ vì một nguồn): `san_pham/2026.10.26.chuoi_15_video_dien/2026.10.27.duyet_chuoi_video_dien_v1.md`. Kịch bản: `kich_ban/2026.10.27.<tên>_v1.md` và `.chuong.json`, nguồn kiểm chứng `kich_ban/2026.10.27.<tên>_v1.nguon_kiem_chung.md`.

**Cách chạy.** Một luồng công việc (Workflow của Claude Code) giao mỗi video cho một tác tử, chạy tuần tự từng video một: tác tử làm trọn từ đọc tư liệu tới commit, giao một tác tử con (Sonnet) kiểm chứng song song lúc dựng mô hình. Bản giao việc chung cho mọi tác tử, bảng gán KB, D, khung mã cho từng video: `san_pham/2026.10.26.chuoi_15_video_dien/tai_nguyen/kich_ban/2026.10.26.ke_hoach_chuoi_15_video_dien.md`. Đây là ngoại lệ có chủ ý với hai cửa chọn phong cách: Trung giao Claude tự chọn KB và D, ghi lựa chọn và lý do vào đầu kịch bản. Thời gian: từ commit kế hoạch (22:55) tới commit video cuối (05:21) khoảng 6,5 giờ cho 15 video; cộng thời gian của từng tác tử (kể cả tác tử con chạy song song) khoảng 14 giờ. Một video từ đọc kế hoạch tới commit 25–80 phút. Trong lúc luồng chạy không mở phiên khác sửa cùng project, vì hook tự lưu gộp thay đổi của phiên khác vào commit (`90_bai_hoc.md` 27/10/2026 mục 12).

**15 thư mục mới trong `xuong_dai/`** (cũng ghi ở bảng mục 1):

| Mã | Thư mục | Chủ đề | Tông dựng |
|---|---|---|---|
| N03 | `cat_giam/` | Cắt giảm công suất | Lai D-09b và D-10 |
| N04 | `nghen_luoi/` | Nghẽn lưới | D-09b toàn 3D |
| N05 | `may_phat/` | Máy phát điện xoay chiều, ba pha, 50 Hz | D-09b toàn 3D |
| N06 | `kw_kwh/` | Công suất và điện năng | D-10 toàn SVG |
| N07 | `he_so_cong_suat/` | Hệ số công suất, số giờ phát tương đương | Lai D-09b và D-10 |
| N08 | `p50_p90/` | P50, P90 | D-10 toàn SVG |
| N09 | `mwp_mwac/` | MWp và MWac | Lai D-09b và D-10 |
| N10 | `pin_nong/` | Tấm pin nóng, điện nổi mát hơn | D-09b toàn 3D |
| N11 | `gio_lap_phuong/` | Gió gấp đôi, điện gấp tám | D-10, cảnh 1 là 3D |
| N12 | `duong_cong_cs/` | Đường cong công suất tua-bin | D-09b, cảnh 5 là D-10 |
| N13 | `gio_do_cao/` | Gió càng cao càng mạnh | D-09b toàn 3D |
| N14 | `ton_that/` | Chuỗi tổn thất và PR | D-10 toàn SVG |
| N15 | `gio_mua/` | Gió mùa và mùa vụ sản lượng | D-09b, bản đồ Việt Nam phẳng |
| N16 | `bao_iec/` | Bão và cấp tua-bin IEC | Lai D-09b và D-10 |
| N17 | `dien_noi_neo/` | Điện nổi: mực nước hồ và hệ neo | D-09b, mặt cắt hồ |

**Chín quy tắc dựng rút ra (Trung duyệt ghi 27/10/2026):**

1. **Khung mã nên chép.** Lấy bản mới nhất có phụ đề chạy chữ, trường `to`, `NGHI_RIENG`, hàm `tu()` và phép chiếu nhãn, không lấy khung cũ ghi trong kế hoạch. Video D-10 thuần chép `xuong_dai/ton_that/` hoặc `p50_p90/`; video lai chép `mwp_mwac/` hoặc `bao_iec/`; video 3D chép `pin_nong/` hoặc `dien_noi_neo/`; tua-bin có tham số `nghieng` và `thap` chép `gio_do_cao/src/TuaBin.tsx`. Khuôn video đọc chậm hơn chuẩn ("chậm X%"): hằng K và hàm `d(n)` trong `ThoiGian.ts` nhân mọi độ dài khung cố định, còn `TOC_DO` trong `tao_thoi_gian.py` nhân tốc độ giọng (giá trị mặc định 1.0: mục 2); `TOC_DO = 0.9` đo ra 5,32 âm tiết/giây (lô 18 video, N21 v2).
2. **Độ đặc tối thiểu của vùng tô trên nền đen D-10 để đạt 3:1:** xanh dương #6f98e0 khoảng 0,75; cam #f2a03c khoảng 0,5 (chữ trong vùng đổi sang trắng); đỏ hồng #e83050 khoảng 0,85; xám từ khoảng #64736d trở lên.
3. **Màu vật 3D đạt tương phản theo bảng màu:** tua-bin trên M1 vỏ #6F8399 (trắng chỉ đạt 1,1:1); thép cột trên M2 #5F6957; tua-bin trên M4, M0, M3 vỏ #5F7489, cánh #647A91; tấm pin cận cảnh #1D3561; vật đang nóng pha sang đỏ nâu (#7A1F14 hoặc #9E2F18) với độ phát sáng 0,12–0,35, không dùng độ phát sáng đầy đủ. Việc còn mở: đưa các màu này thành tham số theo bảng màu trong `MoHinh.tsx`, `TuaBin.tsx`. Màu đo thêm trên MAU-10, MAU-12, MAU-13, MAU-16, nước và đáy hồ: bảng ở mục 25 quy tắc 1; `#1D3561` cho tấm pin cận cảnh chỉ còn 2,4–3,4:1 trên MAU-10 ở cảnh chuỗi tấm pin, màu thay ở bảng đó (lô 18 video, N21).
4. **Nhạc ngắn hơn video:** theo thứ tự duy nhất ở `08_giong_am_thanh_phu_de.md` mục 7 (chọn bài dài hơn video; không có bài hợp đủ dài thì phát chậm không thấp hơn 0,95 lần bằng `playbackRate`; vẫn thiếu thì nối lặp có mờ chéo). Quy tắc 4 của chuỗi đêm (phát chậm 0,95–0,97 lần, không nối lặp, khi bài ngắn hơn video 1–5%) nằm trong thứ tự này; bài ngắn hơn video quá 5% thì xuống bước nối lặp. Bài Curiosity (NH05) bỏ 12 giây đầu chỉ còn khoảng 88 giây, không dùng cho video dài hơn 90 giây.
5. **Nhãn HTML bám vật 3D:** tạo `PerspectiveCamera` riêng cùng thông số với máy quay rồi `Vector3.project` ra toạ độ 1920×1080 (hàm `chieu` trong `xuong_dai/gio_do_cao/src/Video.tsx`). Hàm `tu(c, i, chuỗi)` cho mốc hình đúng lúc giọng đọc tới từ đó.
6. **Cách vẽ đã thử và rõ:** đơn vị tích (kWh) bằng diện tích hình chữ nhật; phân phối xác suất bằng cột rơi vào ô thành biểu đồ tần suất rồi đè đường chuông; tổn thất nhân dồn bằng biểu đồ thác nước; "chu kỳ lặp" bằng hàng 25 ô-năm và lưới 10 dự án × 25 năm; trường gió theo tháng trên bản đồ Việt Nam (`xuong_dai/gio_mua/src/BanDo.tsx`, dùng lại được).
7. **Chuẩn hoá cho Whisper** (khối vieneu của `tai_san/cau_hinh_giong.json`): cần thêm các cặp "oát ↔ W", "ki-lô-oát giờ ↔ kWh", "mê-ga-oát ↔ MW", "ghi-ga-oát giờ ↔ GWh", "phần trăm ↔ %", số thập phân ↔ chữ, cùng các cách đọc thuật ngữ Trung chốt. Khi đó chỉ câu mất từ thật mới bị báo. Chưa sửa file cấu hình: đang chờ Trung chọn cách đọc (`san_pham/2026.10.26.chuoi_15_video_dien/2026.10.27.duyet_chuoi_video_dien_v1.md` mục 2).
8. **Nguồn dùng lại được:** Thông tư 05/2025/TT-BCT thay Thông tư 25/2016 (tần số 50 Hz ±0,2 Hz); Quyết định 18/2021/QĐ-TTg (gió trong bản tin bão là gió trung bình 2 phút); bản tin EVN 3/7/2019 về nghẽn lưới; IRENA RPGC 2024 Bảng S1 (hệ số công suất); giá trị mặc định PVWatts trong tài liệu pvlib (chuỗi tổn thất); Bộ Năng lượng Mỹ (các mốc đường cong công suất).
9. **Số đo thời gian (Mac M5):** giọng 7 cảnh 44–224 giây máy; một lượt kết xuất 4–8 phút với 4 luồng; quét mọi khung bằng `scripts/quet_khung_hong.py` 4–6 giây (đo 27/10/2026: N05 3.562 khung 4,2 giây, N06 3.124 khung 3,0 giây; báo cáo đêm ghi 30–40 giây cho bản tạm); một video từ đọc kế hoạch tới commit 25–80 phút.

## 25. Lô 16 video điện gió và lô 18 video điện chung, điện mặt trời (27–28/10/2026): quy tắc dựng rút ra

Kế hoạch và sổ theo dõi: `san_pham/2026.10.27.lo_video_dien_gio/tai_nguyen/kich_ban/` (`2026.10.27.ke_hoach_lo_dien_gio.md`, `2026.10.27.so_theo_doi_lo_dien_gio.md`; bảng nguồn tài liệu quốc tế `2026.10.28.bang_nguon_tai_lieu_quoc_te_dien_gio.md`). Phiên điều phối tự soát ảnh lưới qua đêm; các lỗi dưới đây là lỗi nó bắt được nhiều lần (Trung duyệt gom 28/10/2026). Lỗi kỹ thuật (ghép ffmpeg, khung hỏng, z-fighting…): `90_bai_hoc.md` mục 2026-10-28.

Quy tắc từ lô 18 video điện chung và điện mặt trời (sổ theo dõi: `san_pham/2026.10.27.lo_video_dien_chung_va_mat_troi/tai_nguyen/kich_ban/2026.10.27.so_theo_doi_lo.md`; Trung duyệt gom 28/10/2026) được thêm vào đúng quy tắc liên quan bên dưới, ghi nguồn "(lô 18 video, N..)", hoặc thành quy tắc 12 trở đi. Mã N của lô 18 (N18 đến N35, N54) là mã việc của lô đó, không trùng mã N03 đến N17 của chuỗi 15 video ở mục 23.

1. **Màu vật 3D theo bảng màu (bổ sung quy tắc 3 mục 23), đo trên khung cắt từ mp4:**

| Bảng màu | Vật | Màu đạt | Màu không đạt |
|---|---|---|---|
| MAU-13 (M4) | vỏ tua-bin, cánh | #5F7489, #647A91 (3,4–3,6:1) | trắng 1,1:1 |
| MAU-09 (M0), đất sáng #CBBE95 | vỏ tua-bin, cánh | #3C5067, #44607C (khoảng 6,6:1) | #5F7489 (2–2,6:1) |
| MAU-09 | mặt đất, cỏ, nước, rừng | đất #CBBE95 hoặc #C4BEA3; cỏ #3F6B1F; nước #1A5580; rừng #2F5A24 | đất #E4DECB (chói trắng), cỏ #8DB255 (1,8:1) |
| MAU-10 (M1) | vỏ bầu cánh, chụp và cánh, vòng ổ | #34506B; #4B6A8A; ngoài #146069, trong #2457C5 | vỏ trong suốt 1,5–2,2:1 |
| MAU-10 | đất, đồi dưới tháp #3C5067 | ≥ #A8C67F | #7E9B58 (2,5:1) |
| MAU-10 | chuỗi tấm pin (lô 18 video, N21) | ô pin #0F2044 (bỏ ánh kim, độ nhám 0,75), khe #7C8BA0, lưng #34465E, khung #5D6B7C | ô pin #1D3561 (2,4–3,4:1) |
| MAU-10 | màu tô nhấn trên nền sáng (lô 18 video, N22) | vật liệu `MeshBasic` (3,6:1) | vật liệu PBR bị ánh sáng làm loé (khoảng 2:1) |
| MAU-12 | màu sơ đồ CL-05 trên nền sáng (lô 18 video, N29) | nắng thẳng #D9560A (3,6:1), nắng tán #6A58D8 (4,7:1), nắng hắt #8A6A2E (4,5:1), GHI #2C2133 (13,7:1), POA #D6286A (4,3:1), chữ phụ #6B5F73 (5,4:1) | không ghi |
| MAU-13 | nước dưới phao sáng màu (lô 18 video, N33 v2) | nước đáy #08324F, mặt #23729E, thêm viền bọt | nước nhạt (1,7–1,9:1) |
| MAU-13 | đáy hồ, bùn (lô 18 video, N31, N32) | đáy bùn nâu sẫm #5A4A35 thay cát sáng; #33281C khi có xích gỉ cam | cát sáng; #5A4A35 với xích gỉ cam (quá sáng) |
| MAU-13 | nhãn cam chữ trắng (lô 18 video, N32) | #B34F18 (4,6–5,2:1) | #C45A1C (4,4:1) |
| MAU-16 (M7, nền tối) | nền sa bàn, pin, thép giá (lô 18 video, N54) | nền sa bàn #202327; pin #5B8FD9; thép giá #9AA4AE | nền sa bàn #2B2F34 (chỉ 2,65:1) |
| MAU-11 (M2) | vật chính trên cỏ nhạt | đậm, ví dụ LiDAR #2E6266 (3,59:1) | vàng, hồng nhạt (1,6:1) |
| MAU-08 (M10) | cabin cẩu, tàu, búa trên trời | thép #4B5E70, #4E5967 (4,8:1); cam đậm #A85A08, #A35E27 | trắng #F2F5F9 (1,1–2,1:1) |
| nền sáng nói chung | cam, vàng, mũi tên xanh | #D4500F (cam), #BF7600 (vàng), #1D4FBF (xanh); máy xây dựng thép xanh sẫm (5–6:1) | #F26A1B (2,7:1), #FFC02E (1,5:1), #2F6FE4 trên cỏ (2,5:1), máy vàng (1,6:1) |
| mọi bảng | chữ nhãn | #B3360F (5,7:1), chữ phụ #3A2A1F | cam #F0532D (khoảng 2:1) |

Khoảnh đất, đồi trên nền sáng lên hình sáng hơn màu gốc: chọn tối hơn khoảng 40%. Vật 3D nói chung trên nền sáng cũng lên hình sáng hơn màu gốc, tương phản giảm 2–3 lần (đo trên khung cắt từ mp4; lô 18 video, N21). Chốt màu chữ nhãn và màu vật chính TRƯỚC khi kết xuất nháp; đổi thành phần dùng chung (như `Nhan`) sau khi đã kết xuất đủ buộc kết xuất lại gần cả video (N40).

2. **Vật chính phải lớn đúng lúc lời nói về nó:** ít nhất 1/3 bề ngang khung (cận cảnh thiết bị 2–2,5 m thì máy quay cách 5–6 m). Lỗi lặp: xe chở cánh, xe nâng cánh, cánh đang cẩu chỉ là nét mảnh (N50); máy LiDAR dưới 1/20 khung (N40); tua-bin cảnh cuối 1/4 khung, nửa khung là trời trống (N39, N52).
3. **Điểm nhãn gắn đúng vào vật được gọi tên**, không chỉ vào khoảng trống (N41) hay vật bên cạnh ("bầu cánh" chỉ vào thân buồng máy, N52). Nhãn sát mép phải đặt `ben: "trai"`. Vệt gió, mũi tên 3D không vẽ đè nhãn (bỏ vệt trong vùng nhãn, N42). Nhãn gắn vật 3D khi máy quay gần: giữ nhãn trong khoảng ±70% nửa bề rộng nhìn thấy và né dải phụ đề từ 83% chiều cao khung trở xuống (lô 18 video, N33). Nhãn con trỏ quét trên đồ thị dễ đè nhãn khác: đặt dưới trục hoặc làm mờ nhãn tĩnh khi con trỏ chạy (lô 18 video, N18).
4. **Thẻ dữ liệu:** chữ phụ ≥ 20 px, tên và số ≥ 28 px ở 1920×1080 (tác tử hay để 12–14 px, N48, N49); thẻ rộng tới 45% khung, cao ≤ 770 px (phụ đề hai dòng bắt đầu ở y khoảng 888); không trống nhiều giây (bật thẻ khi câu đầu dùng tới, hoặc hiện trục trước, N42, N45); hàng chưa hiện để `display: none`; số trên hình ghi rõ so với cái gì ("so với gió ở 10 m", N41; "phần trăm của tổng vốn xây dựng", N48); số tự tính ghi phép tính và chữ "minh hoạ". Nội dung đồ thị trong cảnh có phụ đề hai dòng nằm ở y ≤ khoảng 890 px (lô 18 video, N23). Thẻ HTML nhiều cột: ô số cần `whiteSpace: nowrap` và `flexShrink: 0` (lô 18 video, N21).
5. **Bố cục vật nửa trái, thẻ nửa phải:** dời tâm nhìn máy quay sang phải của vật (hàm `nhin` ở `xuong_dai/ba_moc_toc_do_gio/src/KichBan.ts`, dấu dx dễ nhầm); nội suy độ lệch giữa các đoạn máy quay, nếu không tâm nhìn nhảy (N48). Chừa chỗ phụ đề hai dòng bằng dời khung nhìn `camera.setViewOffset(1920,1080,0,90,1920,1080)`, áp cho cả camera chiếu nhãn (quy tắc 5 mục 23) (lô 18 video, N33 v2).
6. **Chống đứng hình:** máy quay đứng yên so với vật (bám xe, `tien` về vận tốc 0 cộng rôto dừng) bị freezedetect coi là đứng hình: trôi máy quay chậm theo khung, giữ rôto quay khoảng 4% (N37, N39). freezedetect ở nửa độ phân giải có thể không bắt chỗ bản đủ bắt (N44). Cảnh giữ máy quay đứng yên cũng bị coi là đứng hình dù có chữ hiện dần: cho máy quay trôi khoảng 2% khoảng cách hoặc cho vật nhấp nhô (lô 18 video, N33). `freezedetect n=-60dB d=0.5` coi hình chỉ có chuyển động nhỏ (chấm, nét mảnh, chữ hiện dần) là đứng hình; video N18 toàn đồ thị bị báo đứng yên 62% thời lượng. **Quy tắc bắt buộc cho mọi cảnh toàn đồ thị (CL-05), Trung chốt 28/10/2026:** đặt dải sáng quét nền chạy từ khung đầu tới cuối cảnh: chép `tai_san/khoi_dung_san/DaiQuet.tsx` vào `src/`, đặt `<DaiQuet>` ngay sau nền, trước đồ thị; dải rộng ≥ 500 điểm ảnh, đậm ≥ 0,15 ở giữa, màu ấm của bảng màu đang dùng. Không có ngưỡng đứng hình riêng cho cảnh đồ thị: ngưỡng 1,5 giây ở `15_bang_kiem_truoc_khi_giao.md` áp chung. Số đo đã qua: dải 520 điểm ảnh, đậm 0,16, quét hết khung trong 110 khung (N35); dải tô quét ngang khoảng 1,5% điểm ảnh mỗi 0,1 giây (N34).
7. **Cảnh cắt lớp nước, bùn:** mặt nước ≥ khoảng 0,6 độ đặc thì thân tàu trắng mới tách nền, nhưng vật dưới nước, dưới cát, trong bùn cần lớp đó trong ≤ 0,3–0,45 và vật màu đậm (cáp chôn #1C0804, cọc thép đậm) mới đạt ≥ 3:1 (N51, N52); chỉnh độ đặc riêng từng cảnh. Vật dưới nước nhìn qua mặt nước mờ bị nhuộm màu nước (xích vàng còn 1,6:1): vẽ vật sau lớp nước (`transparent`, `opacity` 1, `renderOrder` 8), thêm phát sáng nhẹ; ở mặt cắt máy quay cao hơn mặt nước 3–5 m để thấy viền bọt; màu đáy bùn và nước đậm: bảng quy tắc 1, hàng MAU-13 (lô 18 video, N31, N32, N33 v2).
8. **Tua-bin trong cảnh mặt cắt dọc trục x** quay mặt về +X: máy quay nhìn từ +Z thấy cánh nghiêng; xoay quanh trục đứng khoảng −0,85 rad (N36). Tỉ lệ `TuaBin.tsx` (khung `gio_do_cao`): 1 đơn vị = 6 m (N40). Nhìn thẳng từ trên xuống: lệch máy quay theo z để `lookAt` không suy biến (N39); với vật nằm ngang, tránh để mui hay thiết bị phía trên che vật (lô 18 video, N23). Mũi tên lực nhìn dọc trục thành khối trụ ngắn: máy quay lệch ngang khoảng 90° (N46).
9. **Ảnh lưới duyệt** chụp lúc nhãn, hàng bảng đã hiện đủ (chụp giữa lúc hiện dần làm phiên điều phối soát nhầm, N36, N46), luôn kèm khung cảnh cuối. Cửa sổ hiện nhãn trong `KichBan.ts` nên dài ≥ 1 giây để ảnh duyệt chụp được lúc nhãn hiện đủ (lô 18 video, N32: nhãn chỉ hiện 14 khung, ảnh duyệt chụp lúc nhãn còn mờ). Bản nháp nửa độ phân giải để trong `tai_nguyen/ban_nhap/`, không đặt ngoài cùng thư mục sản phẩm.
10. **Mật độ chữ:** giọng VieNeu đã kéo về 5,95 âm tiết mỗi giây ra khoảng 19 ký tự phụ đề mỗi giây (N40: 2.645 ký tự ra 138,6 giây); ước 17–19 ký tự/giây ở thẻ KB-05 hơi thấp.
11. **Nguồn số liệu:** trước khi tra web, tra thư viện tài liệu quốc tế công khai `RM MB/tai_san/tai_lieu_quoc_te/dien_gio/` và bảng nguồn của lô (DEA 2023 cẩm nang công nghệ sản xuất điện Việt Nam, World Bank lộ trình điện gió ngoài khơi 2021 và 2025, GIZ, IRENA, ADB). Chỉ đọc thư mục đó, không mở `RM MB/khach_hang/` hay kho thẩm định.
12. **Cảnh cắt mở vật:** mở mặt trước của vật và tô mặt cắt bằng màu riêng đọc rõ hơn vỏ trong suốt (lô 18 video, N33 v2).
13. **Mô hình lặp nhiều:** gộp hình học theo màu đỉnh (`mergeGeometries` kèm thuộc tính màu), ví dụ đảo 10×7 phao; kết xuất cả video khoảng 6 phút ở 3 luồng (lô 18 video, N33 v2).
14. **Ánh sáng cảnh nền sáng:** `scene.environmentIntensity` 0,3, tổng ánh trực tiếp cộng bán cầu khoảng 1,7; kính phản chiếu trên tấm pin giảm tương phản khoảng 1 điểm (lô 18 video, N34).
15. **Máy quay cảnh rộng:** `far = 400` của khung mã cũ làm mất vật ở xa (bản đồ cách 450); đặt `far = 1500` (lô 18 video, N35).
16. **Hình phóng to giải thích cơ chế:** máy quay thẳng mặt; thẻ trắng có viền và bóng nằm trọn trong khung; lớp mờ phẳng phía sau tách thẻ khỏi cảnh nền; nhãn bám vật phải cộng toạ độ z của vật (lô 18 video, N26).

## Tra nhanh: kỹ thuật dùng lại được, nằm trong nhật ký từng video

Các kỹ thuật dưới đây đã nằm trong nhật ký (`tai_san/nhat_ky_video_ngang.md`); bảng này chỉ chỉ chỗ, không lặp lại nội dung.

| Cần làm | Xem nhật ký mục |
|---|---|
| Cách tổ chức mã video 3D đầu tiên; soát nhanh bằng `remotion bundle` rồi `still`; đọc lại riêng từng câu giọng VieNeu | 7 |
| Ghép ảnh Blender với cảnh Three.js; đổi giọng không phải kết xuất lại hình | 8 |
| Chèn câu mới vào video đã duyệt mà giữ giọng cũ; bánh răng ăn khớp đúng góc | 10 |
| Hai quy tắc kỹ thuật Three.js (vật liệu trong suốt đổi theo trạng thái, soát bằng khung cắt từ mp4) | 10 |
| Khung mã máy móc 3D dùng lại (`CoBan.tsx`, `KichBan.ts`); giao tác tử con kiểm chứng song song | 11 |
| Dùng lại lời và giọng của video đã duyệt khi chỉ đổi phong cách dựng; nối lặp nhạc | 12 |
| Mô hình thiết bị điện tử tách file; thẻ đồ thị SVG | 13 |
| Bánh răng nghiêng, hộp số nhiều tầng | 14 |
| Sửa hình nháy do tô sáng bật tắt tức thì (đo chênh lệch giữa hai khung liền nhau); thay một câu giọng bằng trang nghe thử | 15 |
| Bảng đen SVG; đọc chậm riêng đoạn công thức; ước thời lượng theo trường `doc` khi nhiều số | 16 |
| Vật chính không nổi trên nền sáng (tương phản đo trên khung cắt); hai lỗi hình (mặt đất cháy trắng, ô vuông ở bản đồ) | 17 |
| Lỗi kết xuất treo ngẫu nhiên; đổi nhạc mà không kết xuất lại hình | 18 |
| Blender Cycles: viền sáng từ ảnh mặt nạ, hoạt cảnh bằng `delta_location`, số đo giây mỗi khung | 20 |
| Kiểm chứng bắt lỗi diễn đạt; màu gắn vai trò cả video | 21 |
| Kiểm chứng sau khi giọng đã đọc (bài học: kiểm chứng trước khi trình duyệt chữ); chọn màu gốc tối hơn màu muốn thấy trên bảng nền sáng | 22 |
| Đọc 1,1 lần có nghỉ dài; lớp chữ lớn giữa màn cho câu chốt | 24 |
| `bat` là cửa sổ bật rồi tắt, dốc dùng `tien`; tấm pin nghiêng thật dùng `TamPin`; `DaoPhao` cần x0 khi đảo dịch ngang; `goi_y_to_hop_dung.py` với video lai | 26 |
