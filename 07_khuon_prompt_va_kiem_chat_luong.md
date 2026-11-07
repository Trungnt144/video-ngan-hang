# 07 — Khuôn prompt dựng hình và thanh chất lượng đo được

> Đọc khi Claude giao tác tử con dựng hình bằng mã (LM-03 HTML một trang, LM-04 HyperFrames, cảnh Three.js trong LM-02), hoặc khi chấm một video dựng bằng mã. Khuôn đầy đủ nằm ở `tai_san/khuon_prompt/` (mục lục `README.md`); file này giữ quy tắc và lý do.
> **Phiên bản:** 1.6 · **Cập nhật:** 2026-11-05 · Mục 14 ghi phạm vi: ba pha AI → máy → AI dành cho video Remotion (LM-02); video HTML có giọng (LM-03) chạy ba chặng theo skill `lam-video-ba-chang` (Trung chốt 05/11/2026).
> **Phiên bản:** 1.5 · **Cập nhật:** 2026-10-29 · Mục 14 bước 1 trỏ sang skill `ra-soat-dung-chung` (rà mọi loại hình dùng lại, cả video HTML, trước khi giao việc dựng). **1.4** · 2026-10-28 · Mục 14 bước 4: trình chạy pha máy nhận video HTML (LM-03), dự án cần `trang.html` đúng hợp đồng trang và `nhip.json`. **1.3** · 2026-10-28 · Gom bài học lô 18 video điện chung và điện mặt trời (Trung duyệt gom 28/10/2026): dòng đứng hình mục 9 chốt ngưỡng 1,5 giây áp chung kể cả cảnh toàn đồ thị (Trung chốt 28/10/2026); thêm ở mục 14 khối quy tắc cố định trong lời giao việc cho tác tử con (tiền tố mã video, chỉ tắt PID của mình, cấm `--amend`, ffmpeg đủ bộ lọc, dòng Co-Authored-By, kết xuất treo im lặng); mục 9 ghi ffmpeg kèm Remotion cũng thiếu `freezedetect`. **1.2** · 2026-10-28 · Mục 14 đổi sang luồng ba pha AI → máy → AI: bỏ kết xuất nháp nửa độ phân giải, ảnh tĩnh thay bản nháp, trình chạy pha máy `scripts/pha_may/` có bộ đệm chương, chỗ nhanh trong hàng đợi (sổ nợ N58, Trung chốt qua bảng chọn). **1.1** · 2026-10-27 · Thêm mục 14 luồng chạy nhiều video song song (dùng lại mô hình, kết xuất nháp nửa độ phân giải, cửa duyệt ảnh tĩnh, hàng đợi kết xuất, file tiến độ; Trung chốt qua bảng chọn). **1.0** · 2026-10-27 · Bản đầu. Rút từ quét chữ 703 prompt của repo `yihui-dev/awesome-opus5-5-videos` và phép thử dựng lại "Lịch sử AI" ngày 27/10/2026 (`san_pham/2026.10.27.duyet_phong_cach_opus55/`).

## 1. Nguồn và phạm vi

Trong 703 prompt, loại cho kết quả tốt nhất và cụ thể nhất là spec nhiều khối: 12 prompt ở nửa đầu và 22 prompt ở nửa sau có ít nhất một khối. Ở nửa sau: 21 có khối đầu vào (`<inputs>`), 19 có hướng (`<direction>`), 18 có cấu trúc (`<structure>`), 15 có kỹ thuật dựng (`<build>`), 13 có lỗi đã biết (`<gotchas>`), 12 có lệnh bắt đầu (`<start>`). Độ dài các prompt đáng học: 1.973 ký tự (`flxrnc-251921`), 2.325 (`annacher-433425`), 2.659 (`0xnicc0-516612`), 7.882 (`everestchris6-399895`, bản dài về quy trình). Ngược lại, 104 trên 351 prompt (nửa đầu, tối đa 140 ký tự) và 106 trên 352 (nửa sau, dưới 160 ký tự) là một dòng ngắn; 26 và 25 bản gần giống nhau của mẫu "showreel chung chung, go all out" không nêu khung, nhịp, phông, tiêu chí đạt, nên kết quả phụ thuộc hoàn toàn vào model. Danh sách prompt đáng học: `tai_san/khuon_prompt/mau_prompt_dang_hoc.md`.

Phạm vi: prompt Claude viết để giao một tác tử con dựng hình. Không áp cho kịch bản và lời đọc (`03_kich_ban_va_loi_viet.md`), video khối cảnh JSON (LM-01), Blender (LM-05, skill riêng).

Hai số đo ở Media làm cơ sở: một lượt viết 30 giây tốn khoảng 150 nghìn token, 12 phút Opus, còn 1–2 lỗi nhìn thấy; bản có khung đích và 3 vòng sửa, 60 giây, tốn 218.774 token, 31 phút Opus, 104 lần gọi công cụ (trang `2026.10.27.so_sanh_lich_su_ai_v1.html`, 27/10/2026).

## 2. Luồng giao việc

```
Trung duyệt kịch bản (chữ)
   │
[1] Claude viết file dữ kiện + storyboard + bản đồ nhịp
   │   (chưa có dòng mã nào)
   ▼
 CỬA DUYỆT STORYBOARD  (hỏi Trung hay người phản biện: do 01_quy_trinh_chung.md quyết)
   │
[2] Tác tử con Opus dựng theo khuôn (khuon_dung_html_mot_trang.md)
   │
[3] Bản xem trước 10 khung/giây, 960×540 + ảnh tĩnh mỗi nhịp
   │   tự xem, sửa, ghi sổ, tối đa 3 vòng
   ▼
[4] Người phản biện độc lập (chưa thấy quá trình dựng)
   │   xếp hạng lỗi → "GIAO" hoặc "THÊM MỘT LƯỢT"
   ▼
[5] Đo bằng máy theo thanh chất lượng (mục 9)
   ▼
[6] Bản cuối → soát theo 15_bang_kiem_truoc_khi_giao.md → giao vào thư mục video
```

Lời giao việc cho tác tử con nào cũng kèm khối "Quy tắc cố định trong lời giao việc" ở mục 14 (tên file, tắt tiến trình, commit, ffmpeg, kết xuất treo), vì tác tử con không đọc file này.

## 3. Spec nhiều khối

Prompt giao việc chia thành khối, mỗi khối một việc. Tên khối giữ tiếng Anh vì chỉ là dấu phân khối trong văn bản (như các mẫu nguồn); nội dung viết tiếng Việt.

| Khối | Chứa gì | Ghi chú |
|---|---|---|
| `<role>` | Một câu: dựng hình bằng mã; mọi quyết định so với ảnh đích; chưa xong khi đặt cạnh ảnh đích vẫn còn yếu hơn | `everestchris6-399895` |
| `<inputs>` | Tên video, khổ, khung/giây, độ dài, đường dẫn file dữ kiện, tổ hợp trục (CL, BC, MAU), ảnh đích, phông, mã màu | Khuôn tách ý muốn khỏi cách làm; có 9 prompt kèm giá trị mặc định khi thiếu |
| `<direction>` | Phong cách bằng mã hex và tên phông; quy tắc chuyển động bằng số; danh sách cấm | Dùng mã hex, giây, hệ số giảm chấn, điểm ảnh, không dùng tính từ |
| `<structure>` | Bảng nhịp: thời gian, trên màn hình có gì, để làm gì, ra đi bằng cách nào, vật mang sang | Mục 4 |
| `<build>` | 7–10 bước kỹ thuật đánh số | Hàm thuần của thời gian, xuất, kiểm trước |
| `<gotchas>` | Lỗi đã biết và cách tránh | Khuôn mang sẵn danh sách của Media |
| `<facts>` | File dữ kiện là nguồn duy nhất cho số, tên, câu chữ trên màn hình | Mục 10 (Media thêm) |
| `<quality_bar>` | Thanh chất lượng đo được | Mục 9 (Media thêm) |
| `<start>` | Thứ tự: đưa storyboard, chờ duyệt, rồi viết mã; sau lần xuất đầu kiểm 5 khung quanh mỗi nhịp | Mục 4 và 5 |

**Số cứng thay tính từ.** Mẫu nguồn cho số: lò xo giảm chấn 0,72, ổn định sau 0,35 giây cho hình; giảm chấn 1,0, 0,6 giây cho máy quay; đổi nội dung bằng nhoè 12 điểm ảnh và mờ dần trong 0,15 giây; đẩy máy quay chậm 1,03–1,07 lần trong mỗi cảnh; chữ so le 2–4 khung. Người đọc kiểm được bằng mắt hoặc bằng quét khung. Các số này là điểm xuất phát lấy từ mẫu nguồn, chưa hiệu chỉnh cho tông của Media.

**Rào chống bịa.** 20 prompt dặn: chỉ dùng sự thật và tư liệu đã đưa, thiếu thì dừng và báo, không dùng giả. Khuôn Media chép nguyên tắc này: thiếu đầu vào thì tác tử con ghi danh sách thiếu vào sổ rồi dừng, không tự bịa.

**Tách ý muốn khỏi cách làm.** Khối `<direction>` nói video phải trông thế nào; khối `<build>` nói làm bằng kỹ thuật gì. Trộn hai khối làm tác tử con chọn kỹ thuật theo lời tả hình và ngược lại.

## 4. Storyboard và bản đồ nhịp, duyệt trước khi viết mã

Storyboard là một bảng, mỗi bố cục một dòng: thời gian, trên màn hình có gì, khoảnh khắc này để làm gì, ra đi bằng cách nào, vật nào mang sang cảnh sau (`everestchris6-399895`). Nguồn đặt khoảng 12–15 bố cục mỗi 30 giây, mỗi bố cục 1,4–3,5 giây, vật chính chiếm phần lớn khung. Mức đó là của quảng cáo nhịp nhanh. Video khoa học của Media giữ mỗi bố cục theo độ dài câu đọc nhưng trong bố cục phải có chuyển động liên tục (nền trôi, thanh tiến độ, chữ hiện dần theo lời) để không đứng yên quá 1,5 giây (mức đã đo ở HyperFrames 26/10/2026, `12_cong_cu_media_ai.md`).

Bản đồ nhịp là danh sách trạng thái đặt trên lưới thời gian, lập trước khi viết mã (`annacher-433425`). Video có giọng đọc: lưới là mốc câu của `<tên>.chuong.json` và `src/thoi_gian.json`. Video không giọng có nhạc: lưới là phách đo từ bài (`tai_san/khuon_prompt/khuon_am_thanh_tu_du_lieu.md`). Mỗi storyboard còn phải có: khung đầu là một bố cục hoàn chỉnh; ba khoảnh khắc đặc trưng mô tả được mà không dùng tên hiệu ứng; video hiểu được khi tắt tiếng.

**Cửa duyệt.** Storyboard và bản đồ nhịp được duyệt trước khi viết mã: sửa bảng rẻ hơn sửa video đã xuất (18 prompt ở nửa sau và 6 prompt ở nửa đầu có bước này, ví dụ "cho tôi xem storyboard rồi mới viết mã"). Có hỏi Trung ở cửa này hay để người phản biện độc lập duyệt (mục 8) là quyết định của `01_quy_trinh_chung.md`; file này chỉ nêu nội dung bảng phải có.

## 5. Ảnh tĩnh mỗi nhịp và tờ ghép khung

Sau khi dựng và trước khi xuất đầy đủ: xuất một ảnh tĩnh ở đúng mốc mỗi nhịp, tự xem, sửa chỗ chật, lệch lưới, khó đọc (`0xnicc0-516612`); sau lần xuất đầu, kiểm 5 khung quanh mỗi nhịp (`flxrnc-251921`). Tờ ghép khung (nhiều khung nhỏ xếp thành một ảnh) 16–20 khung cho thấy cả bản dựng cùng lúc, đủ để thấy chữ đè và lỗi chính tả (`okazaky-084783`, `l3d1c-632524`).

Công cụ ở Media: bản xem trước 10 khung/giây, 960×540 bằng `xuong_html/cong_cu/xuat_mp4.mjs` (60 giây video mất 16,5 giây máy, 27/10/2026); tờ ghép 4×4 bằng `scripts/soat_khung_mp4.py` (góc trái có mốc giây) hoặc bộ lọc `tile` của `xuong_thu_hyperframes/bin/ffmpeg`. Quanh mỗi chuyển cảnh cắt khung dày, 10 khung/giây trong ±0,5 giây: lỗi ở chỗ nối giữa hai chương xuất hiện ở cả 3 vòng của Lịch sử AI (vòng 1 mục 8, vòng 2 mục 1, vòng 3 mục 4).

## 6. Ảnh đích: một đến hai ảnh ghép

Ảnh đích là khung hình của video mẫu hoặc khung Trung đã duyệt, đưa cho tác tử con để học màu, nhãn, bố cục, nhịp. Gộp 4–6 khung thành **1–2 ảnh ghép** (lưới 2×2 hoặc 2×3, có mốc giây), kèm 3–5 dòng chữ nêu điều cần học (mã hex đo bằng máy, tên phông, vị trí nhãn).

Lý do: ở phép thử 27/10/2026 đưa 12 ảnh rời, tác tử con báo các ảnh bị đẩy khỏi ngữ cảnh vì vượt giới hạn số ảnh; tới vòng 3 mới đọc lại 4 ảnh. Giới hạn số ảnh chưa đo; "1–2 ảnh ghép" là quy tắc an toàn rút từ một lần gặp lỗi. Ảnh đích chỉ để học, không chép cảnh, logo, bố cục, nhạc của tác giả (`13_ban_quyen_va_bao_mat.md`).

## 7. Vòng xem và sửa, có sổ ghi

Mỗi vòng: xuất bản xem trước, xem tờ ghép và ảnh tĩnh, lập danh sách lỗi (đánh số, kèm mốc giờ, xếp P0, P1, P2 theo mức nặng), sửa lỗi lớn nhất trước, ghi sổ. Sao lưu mã trước mỗi vòng, hoàn lại nếu sửa hỏng (`voxyz-ai-345550`). Tối đa 3 vòng; hết vòng thì dừng và báo còn lỗi gì. Mẫu sổ: `san_pham/2026.10.27.duyet_phong_cach_opus55/tai_nguyen/ban_nhap/NHAT_KY_VONG_SUA.md`. Mỗi vòng ghi: bản xem (tên file, khổ, khung/giây), lỗi tìm thấy (đánh số), đã sửa (cùng số), số đo trước và sau.

Lỗi điển hình tìm ra qua 3 vòng ở Lịch sử AI (27/10/2026), dùng làm danh sách kiểm cho các video sau:

| Lỗi | Cách sửa đã dùng |
|---|---|
| Lớp hạt nhiễu phủ trắng khung, che đám hạt | Độ đục chấm sáng tối đa 6%, chấm tối 15%; file giảm từ 89 MB xuống 43 MB ở bản xem |
| Chữ đè lên chữ (nhãn trục đè tên tác giả; hai nhãn năm đè nhau) | Dời nhãn sang mép khác, dời ô |
| Chỗ nối chương: khung chỉ còn cảnh trước đang nhoè, hoặc tiêu đề mới chưa hiện | Cảnh sau bắt đầu hiện trước mốc 0,45 giây, cảnh trước tắt trước mốc 0,1 giây, giảm nhoè chuyển cảnh |
| Nhãn, đầu mũi tên, phần tô dưới đường cong hiện trước khi nét vẽ tới | Ẩn tới lúc bắt đầu vẽ; cắt phần tô theo vị trí đầu bút |
| Phụ đề và thước năm bị lớp tối mép khung làm xám | Đặt chúng lên trên lớp tối (thứ tự lớp) |
| Cảnh 3D (bàn cờ) màu xám, tràn xuống phụ đề | `tai_san/khuon_prompt/khuon_canh_threejs.md` |
| Nhãn chương hiện ký tự ngẫu nhiên 0,65 giây đầu: khung cắt trúng trông như chữ lỗi (ghi ở trang so sánh, chưa sửa) | Đề xuất: bỏ hiệu ứng xáo ký tự với nhãn mang chữ cần đọc |
| Nửa phải khung gần trống (chương 7, giây 48–50) | Thêm khung nét đứt kích thước GPT-3 vẽ từ đầu cảnh |

## 8. Người phản biện độc lập

Người dựng không tự chấm. Sau storyboard và sau mỗi bản xuất, một tác tử con mới (loại `general-purpose`, model Sonnet; chưa đo Haiku cho việc chấm hình) nhận: video, brief ngắn, file dữ kiện, 1–2 ảnh đích, thanh chất lượng. Nó **không** nhận điều người dựng nghĩ đã sửa hay lý do từng lựa chọn. Nó tự cắt khung (tờ ghép mỗi 1 giây, khung dày 0,2 giây quanh chuyển cảnh), tự đo (đứng hình, tương phản, âm lượng), trả danh sách xếp hạng có mốc giờ, kết bằng "GIAO" hoặc "THÊM MỘT LƯỢT".

Lượt sau do một người phản biện mới: kiểm từng mục cũ là đã sửa, sửa một phần hay còn nguyên, và tìm lỗi mới do việc sửa gây ra. Hai người phản biện bất đồng thì chọn một và ghi lý do vào sổ. Một video không có lỗi chưa chắc là video tốt: người phản biện phải trả lời "đặt cạnh ảnh đích có yếu hơn không". Khuôn giao: `tai_san/khuon_prompt/khuon_phan_bien.md`. 9 prompt ở nửa đầu của 703 dùng cách này (ví dụ `everestchris6-399895`, `anabology-491441`, `anjmaxx-459455`, `astrothewizard-618782`, `daniel-haida-636937`). Chưa chạy lần nào ở Media.

## 9. Thanh chất lượng đo được

Mọi mục đo bằng máy hoặc bằng khung cắt, không bằng cảm giác. Lệnh dùng `xuong_thu_hyperframes/bin/ffmpeg` (6.0, có bộ lọc `freezedetect`, `ebur128`, `tile`; bản đi kèm Remotion thiếu `ebur128` và `freezedetect`, lô 18 video N18).

| Mục | Ngưỡng | Cách đo ở Media | Nguồn ngưỡng |
|---|---|---|---|
| Đứng hình | Tổng không quá khoảng 1 giây mỗi 30 giây; không đoạn nào quá nửa giây (quảng cáo nhịp nhanh). Video khoa học có giọng: không đoạn nào quá 1,5 giây, áp chung cả cảnh toàn đồ thị; cảnh đồ thị có dải sáng quét nền bắt buộc (Trung chốt 28/10/2026, `10_video_ngang_thuyet_minh.md`) | `ffmpeg -i v.mp4 -vf "fps=10,freezedetect=n=-60dB:d=0.5" -an -f null - 2>&1 \| grep freeze_`; số đo thử ở dưới bảng | `everestchris6-399895`; 1,5 giây: `12_cong_cu_media_ai.md` |
| Khung đầu | Là bố cục hoàn chỉnh, không đen, không chữ đang bay vào | Xem khung 0 và khung cuối. Lỗi đã gặp: khung 0 đen vì mọi phần tử mờ dần từ độ mờ 0 | `everestchris6-399895`; `NHAT_KY_DO.md` HyperFrames |
| Tương phản chữ | Chữ trên nền tối thiểu 4,5:1; tông MAU có bộ kiểm bảng màu đặt chữ 7:1 thì giữ 7:1; vật chính trên nền 3:1 và cao ít nhất 1/4 khung | `python3 scripts/do_tuong_phan_khung.py <khung.jpg> <x,y chữ>:<x,y nền>`: in tỉ lệ từng cặp; script cài ngưỡng 3:1 nên chữ so 4,5:1 bằng mắt | `everestchris6-399895`; `10_video_ngang_thuyet_minh.md` (quy tắc 26/10/2026) |
| Chữ đè, chữ xuyên qua chữ khác, chữ tràn mép | Không có | Tờ ghép; trang có hàm tự kiểm `window.kiemTra(t)` (khuôn yêu cầu); LM-04: `npx hyperframes check` | `0xkarmi-129839` (sáu mục kiểm có/không) |
| Phần tử cảnh trước sót sang cảnh sau | Không có | Khung dày ±0,5 giây quanh mỗi chuyển cảnh | Lịch sử AI vòng 2 và 3 |
| Hiểu được khi tắt tiếng | Người xem lần đầu nêu đúng ý chính | Giao người phản biện bản không tiếng và tờ ghép, hỏi "video nói về điều gì", đối chiếu kịch bản | `everestchris6-399895`, `howdevelop-733090` |
| Phông tiếng Việt | Đủ dấu ở mọi cỡ chữ | Khung cắt từ chính file mp4 | `09_video_doc_ngan.md` |
| Màu nền trong cảnh 3D | Khớp mã hex của tông | Đo điểm ảnh nền đã kết xuất, chỉnh tới khớp | `everestchris6-399895` |
| Âm lượng | Tích hợp −14 LUFS (đơn vị độ to theo chuẩn phát trực tuyến), đỉnh thật −2 dBTP, đo lại sau mã hoá AAC; hiệu ứng không to hơn nhạc | `ffmpeg -i v.mp4 -af ebur128=peak=true -f null - 2>&1` | `ik-builds-585923`, `0xnicc0-516612` |
| Khung hỏng ngẫu nhiên (WebGL) | Không có | `.venv_vieneu/bin/python scripts/quet_khung_hong.py <file.mp4>` | `90_bai_hoc.md` 27/10/2026 |
| Số trên màn hình | Mọi số có trong file dữ kiện | Mục 10 | Lịch sử AI; `everestchris6-399895` |
| Lớp hạt nhiễu | Độ đục chấm sáng không quá 6%, chấm tối không quá 15%; file không phình (134 MB cho 60 giây khi có nhoè) | Xem tờ ghép; `ls -l` | Giá trị cuối của Lịch sử AI v2, chỉ để tham khảo |

**Số đo thử của lệnh đứng hình** (ngày 27/10/2026, 10 khung/giây, `d=0.5`, ba video của phép thử Lịch sử AI; số đoạn, tổng giây, đoạn dài nhất):

| Video | `n=-60dB` | `n=-50dB` | `n=-40dB` |
|---|---|---|---|
| Chạy thử cocktail, 30 giây, một lượt | 6 đoạn, 6,0 giây, 1,3 giây | 12 đoạn, 13,4 giây, 2,6 giây | 19 đoạn, 25,0 giây, 3,5 giây |
| Chạy thử tăng áp, 30 giây, một lượt | 9 đoạn, 8,6 giây, 1,6 giây | 16 đoạn, 16,5 giây, 2,4 giây | 16 đoạn, 24,7 giây, 3,5 giây |
| Lịch sử AI v2, 60 giây, có hạt nhiễu | 0 | 0 | 31 đoạn, 18,7 giây, 1,2 giây |

Hai điều rút ra. (1) `n=-60dB` chỉ đếm đoạn mà khung gần như giống hệt nhau, nên đây là ngưỡng nên dùng; ở mức đó hai bản chạy thử một lượt không đạt thanh 1 giây mỗi 30 giây (6,0 và 8,6 giây). (2) Lớp hạt nhiễu thay đổi mỗi khung làm mọi khung khác nhau, nên lệnh báo 0 đoạn dù có chỗ đứng yên thật; muốn đo thì xuất một bản không hạt (trang có `?hat=0`, khuôn yêu cầu) rồi chạy lệnh trên bản đó. Chưa đối chiếu các số này với cảm nhận của người xem.

## 10. File dữ kiện là nguồn duy nhất cho số trên màn hình

Mọi số, tên, khẳng định xuất hiện trên màn hình lấy từ một file dữ kiện: `san_pham/<thư mục video>/tai_nguyen/kich_ban/<tên>.du_kien.json`, cạnh `<tên>.nguon_kiem_chung.md`. Mỗi mục có `id`, `gia_tri`, `don_vi`, `nguon`, `trang_thai` (`da_kiem` hoặc `minh_hoa`). Chỉ mục `da_kiem` được hiện như số thật; mục `minh_hoa` phải mang nhãn "minh hoạ" trên màn hình hoặc bị bỏ. Nhúng nội dung file vào trang bằng thẻ `<script type="application/json">`, không nạp bằng `fetch` (trang mở từ đĩa thường bị chặn nạp file khác; chưa thử trong xưởng).

Lý do: bản Claude dựng lại Lịch sử AI có số minh hoạ không phải dữ liệu thật (vị trí quân cờ trừ nước 37, trọng số perceptron, trọng số chú ý "0.58"); dùng cho Media phải thay bằng số đã kiểm nguồn. Số sinh từ mô phỏng thì mô phỏng phải chạy thật (bước ngẫu nhiên là bước ngẫu nhiên thật, `astrothewizard-618782`), và hạt giống, số bước ghi vào file dữ kiện. Trang có hàm `window.chuHienThi(t)` trả mảng chuỗi chữ đang hiện ở giây t, để người phản biện đối chiếu với file dữ kiện bằng lệnh.

## 11. Danh sách cấm

Hai nhóm, không trộn.

**Cấm cố định của Media (mọi khuôn):** logo thương hiệu thật và logo MB; ảnh mặt người thật; dữ liệu khách hàng và thông tin nội bộ chưa công bố; chép cảnh, bố cục, logo, nhạc của video mẫu (chỉ để học); số bịa, kết quả bịa, tính năng không có; nêu tên hãng trong prompt nhạc; thanh tua, mã thời gian, số khung/giây hiện trên màn hình và thuật ngữ hoạt hình trên màn hình (`ik-builds-585923`).

**Cấm theo phong cách (chọn khớp chất liệu):** mẫu "một hình biến hình qua nhiều trạng thái" (CL-09) cấm chuyển mờ chéo giữa cảnh, gradient trên giao diện, hạt, quầng sáng, easing nảy, khoảng đứng yên, "trông giống mẫu có sẵn" (18 prompt có mục `Banned`, ví dụ `0xnicc0-516612`, `annacher-433425`). Mẫu khác nêu: phóng vào rồi phóng ra liền; giữ dài hơn 1 giây; góc khung và chữ ở góc; ảnh stock, dashboard; neon, tím chung chung, gradient cầu vồng, tên lửa (`souravbhar871-477361`, `daniel-haida-636937`, `charumitradubey-328233`).

**Danh sách cấm phải khớp chất liệu.** Hạt và quầng sáng bị cấm ở CL-09 nhưng là thứ CL-12 (hạt và ánh sáng) cần. Không chép nguyên danh sách cấm của khuôn này sang khuôn khác.

## 12. Mức nỗ lực và chi phí

| Bậc | Dùng khi | Gồm | Số đo |
|---|---|---|---|
| 1. Một lượt | Cảnh lẻ, thử bố cục, tối đa 30 giây | Một prompt theo khuôn, không sửa | Khoảng 150 nghìn token, 12 phút Opus; còn 1–2 lỗi nhìn thấy (27/10/2026) |
| 2. Có sửa (mặc định) | Video thật tối đa 60 giây | Khuôn đầy đủ, storyboard, 1–2 ảnh đích ghép, 3 vòng xem và sửa, sổ | 218.774 token, 31 phút Opus, 104 lần gọi công cụ (27/10/2026) |
| 3. Có người phản biện độc lập | Video có 3D, hoặc đưa ra ngoài | Bậc 2 cộng người phản biện mỗi lượt | Chưa đo; đo ở video đầu tiên chạy bậc này |
| Mốc tham chiếu ngoài | Chỉ để biết mức cao nhất | 3 vòng, mỗi vòng 3 tác tử: 5 giờ 28 phút, 90 USD theo giá API (`voxyz-ai-345550`); khoảng 3 giờ, 662.769 token xuất, ước 54,52 USD (`kgonia7-746268`) | Không dùng làm mức thường |

Người dựng là tác tử con Opus; người phản biện là Sonnet; cắt khung và đo là lệnh chạy thẳng, không cần tác tử. Video tối đa 60 giây: một người dựng. Video dài hoặc nhiều cảnh nặng: chia theo chương, mỗi tác tử chỉ sửa file chương của mình, phần dùng chung (màu, phông, mô hình 3D, vị trí điểm ảnh tại mọi chỗ chuyển giao) làm trước (`everestchris6-399895`, `thinkszyg-886066`). Ảnh hưởng của mức nỗ lực tới chất lượng chưa đo; mẫu ngoài dùng mức cao nhất cho cảnh 3D khó (`dreyk0o0-165270`, 1 giờ 37 phút).

## 13. Chỗ chưa có số đo

- Chi phí một lượt người phản biện độc lập (token, phút).
- Đối chiếu ngưỡng `freezedetect` với cảm nhận của người xem (mục 9 mới có số đo của máy).
- Giới hạn số ảnh mà tác tử con giữ được trong ngữ cảnh.
- Cách làm LM-03 với giọng VieNeu và mốc câu của Media (chưa có video nào).
- Cửa duyệt storyboard có giảm số vòng sửa không: cần so hai video cùng loại, có và không có cửa.

## 14. Luồng chạy nhiều video: ba pha AI → máy → AI (Trung chốt 27/10/2026, đổi 28/10/2026)

**Phạm vi (Trung chốt 05/11/2026).** Ba pha dưới đây dành cho video Remotion (LM-02): Trung gõ "chạy pha máy", có cửa duyệt ảnh tĩnh cả lô. Video HTML có giọng (LM-03) chạy **ba chặng** theo skill `lam-video-ba-chang`: bốn tác tử con ngữ cảnh mới; `scripts/chuoi_ket_xuat.py` tự ghi phiếu và chạy pha máy riêng cho từng video (`chay --chi <mã>`), không chờ lệnh "chạy pha máy". Hai luồng dùng chung trình chạy `scripts/pha_may/` và hàng đợi kết xuất, nên không chạy lô ba pha và lô ba chặng cùng lúc. Khối quy tắc cố định cho tác tử con ở cuối mục này đã chép vào `skills/lam-video-ba-chang/tham_chieu/quy_tac_chung.md` mục 5.

Rút từ hai lô ngày 27–28/10/2026: lô 18 video (`san_pham/2026.10.27.lo_video_dien_chung_va_mat_troi/tai_nguyen/kich_ban/`) và lô 16 video điện gió (`san_pham/2026.10.27.lo_video_dien_gio/tai_nguyen/kich_ban/`).
- **Số đo lô 18:** một video khoảng 110 giây mất 55–85 phút tới bản nháp, trong đó dựng mô hình 3D mới mất 45–70 phút. Mỗi video kết xuất đủ 2–4 lần, mỗi lần 5–8 phút. Hai lần tác tử tắt nhầm lượt kết xuất của video khác, vì lệnh `pkill` lọc theo tên chung. Phiên điều phối khởi động lại làm bốn tác tử mất bản ghi.
- **Số đo hai lô** (nhật ký hàng đợi tới 28/10 07:00, 22 video, khoảng 8 giờ máy): kết xuất nháp nửa độ phân giải chiếm 68% giờ máy (63 lượt, khoảng 3 lượt mỗi video). Bản nháp không báo trước được khung hỏng WebGL, vì khung hỏng rơi ngẫu nhiên giữa các lần kết xuất. Mất mạng từ 01:00 tới 03:04 ngày 28/10 làm N37, đã có hình và tiếng, phải chờ 2 giờ chỉ để ghép.

Từ 28/10/2026 (sổ nợ N58), mọi lô video ngang Remotion (LM-02) chạy ba pha, để việc AI không chờ máy và việc máy không chờ AI. Lô điện gió mở từ 27/10 giữ luồng cũ tới hết lô.

**Pha 1 — AI, khi còn hạn mức.**
1. **Dùng lại mô hình trước khi dựng mới.** Đầu lô, phiên điều phối chạy `python3 scripts/danh_gia_dung_lai.py --ke-hoach <file kế hoạch lô>`. Script chỉ đọc, xếp hạng khối theo số video trong lô cần, số dự án đã có và số bản lệch nhau, rồi đề xuất: gom về kho chung, dựng mới một lần rồi chép, cân nhắc kết xuất sẵn cảnh nền theo bảng màu. Tác tử tra `tai_san/khoi_dung_san/danh_muc_mo_hinh_3d.md`, chép bản tốt nhất của khối đã có, chỉ dựng mới phần danh mục chưa có, rồi báo lại khối dựng mới để bổ sung danh mục. Khi viết `.chuong.json`, ghi trường `khoi` cho từng chương (tên component, ví dụ `"khoi": ["TuaBin", "CanCau"]`) để script đếm được nhu cầu. Từ khoá nhận ra khối trong kế hoạch và sổ nợ nằm ở `tai_san/khoi_dung_san/tu_khoa_khoi.json`. Từ 29/10/2026 bước này mở rộng thành skill `ra-soat-dung-chung`: rà mọi loại hình (vật thể SVG, nhân vật, biểu đồ, giao diện, mô hình 3D, khuôn bố cục) cho cả video HTML, chạy trước khi giao việc dựng; hình dùng chung của video HTML ở `tai_san/kho_hinh_chung/`.
2. **Ảnh tĩnh thay cho bản nháp.** Không kết xuất nháp nửa độ phân giải nữa. Kết xuất ảnh tĩnh mọi chương (ít nhất một khung mỗi chương, cộng khung lúc chữ và bảng đã hiện đủ) qua chỗ nhanh của hàng đợi. Soát chữ nhỏ ở 1920×1080 và đo tương phản trên ảnh tĩnh. Chốt màu và cỡ của thành phần dùng chung (nhãn, phụ đề) ngay ở bước này: đổi sau khi đã kết xuất thì phải kết xuất lại gần cả video.
3. **Cửa duyệt ảnh tĩnh.** Ghép 3–4 khung chính thành một ảnh lưới. Với một lô, Trung duyệt ảnh lưới của cả lô một lần. Chế độ qua đêm thì phiên điều phối tự soát theo thanh chất lượng mục 9. Chưa có chữ "duyệt" thì chưa ghi phiếu.
4. **Ghi phiếu việc máy:** `node scripts/pha_may/pha_may.mjs tao <mã> xuong_dai/<tên> --san-pham san_pham/<thư mục>`. Hết pha 1, Claude nhắc Trung một dòng gồm số phiếu và ước giờ máy. Video HTML (LM-03) ghi phiếu cùng lệnh với `xuong_html/<tên>`, dự án cần `trang.html` đúng hợp đồng trang (`seek(t)` không phụ thuộc khung trước, cờ `window.__san_sang`) và `nhip.json` có độ dài, giọng, nhạc, chương (`scripts/pha_may/HUONG_DAN.md` mục "Video HTML (LM-03)"; thử 28/10/2026: sửa một chương của video 60 giây chạy lại 96 giây máy).

**Pha 2 — máy, chạy khi Trung ra lệnh "chạy pha máy".** Lệnh `node scripts/pha_may/pha_may.mjs chay` làm lần lượt: kết xuất đủ một lần theo chương có bộ đệm chương, kết xuất tiếng, chỉnh độ to về −14 LUFS (Trung chốt 28/10/2026 cho video mới), mã hoá, quét và thay khung hỏng, ghép tiếng, đo độ to và đứng hình, cắt bảng ảnh soát, viết báo cáo `du_lieu/pha_may/bao_cao/<mã>.md`. Pha này không dùng AI, nên mất mạng hay hết hạn mức không làm nó dừng. Chi tiết: `scripts/pha_may/HUONG_DAN.md`.

**Pha 3 — AI (Opus, Trung chốt 28/10/2026).** Đọc báo cáo và xem bảng ảnh soát theo thanh chất lượng mục 9. Có lỗi thì sửa mã, ghi lại phiếu kèm `--chuong-sua <chương>`, rồi chạy lại pha 2: chỉ chương đã sửa được kết xuất lại. Không kết xuất đủ cả video lần hai. Đạt thì chép `<mã>_du.mp4` ra thư mục sản phẩm thành bản `_nhap`, sang cửa duyệt 2.

**Hàng đợi và tiến độ.**
- Mọi lượt dùng Chrome của Remotion chạy qua `scripts/hang_doi_ket_xuat.sh [--nhanh] <mã video> <lệnh>`. Hàng đợi có 2 chỗ dài cho kết xuất (giới hạn vì RAM 24 GB) và 1 chỗ nhanh cho lượt dưới 30 giây. Lệnh có `remotion still`, `anh_soat`, `anh_luoi` tự vào chỗ nhanh. Lý do thêm chỗ nhanh: ở lô điện gió, một lượt chụp ảnh 7 giây phải chờ 361 giây sau lượt kết xuất dài. Nhật ký chờ và chạy ở `du_lieu/hang_doi_ket_xuat/nhat_ky.tsv`.
- File đầu ra và file tạm đặt tên có mã video. Chỉ tắt PID của mình, đọc trong file chỗ của hàng đợi (chi tiết ở khối quy tắc cố định dưới đây).
- Mỗi tác tử ghi file tiến độ `tai_nguyen/kich_ban/<tên>.tien_do.md` sau từng bước và đọc nó trước khi bắt đầu, để tác tử mới làm tiếp được khi phiên điều phối khởi động lại.
- Pha 1 chạy tối đa 3 video cùng lúc, không lên 4: lúc chạy 4 video, vùng hoán đổi lên 3,5 GB.

**Quy tắc cố định trong lời giao việc cho tác tử con** (Trung duyệt gom 28/10/2026 từ lô 18 video; chép nguyên khối này vào mọi lời giao việc dựng hoặc kết xuất).
1. **Mọi tên có tiền tố mã video.** File tạm, script tạm và tên file đầu ra đều mang tiền tố mã video của mình (ví dụ `n21_do_mp4.py`, `n33_video_v2.mp4`). Thư mục tạm dùng chung nên script trùng tên bị ghi đè; tên file đầu ra trùng như `video_v2.mp4` làm lệnh tắt tiến trình lọc theo tên đó tắt nhầm lượt của video khác (lô 18 video, N22 tắt nhầm lượt kết xuất của N21 lúc 19:03; N33 lúc 18:54 tắt nhầm lượt của N21 bằng lệnh lọc theo tên file đầu ra).
2. **Chỉ tắt đúng PID của mình.** Không dùng `pkill -f`, `killall` theo tên chung (`remotion`, `node`, `chrome`) hay theo tên file đầu ra. Đọc PID của lượt mình trong file chỗ của hàng đợi và tắt đúng PID đó (lô 18 video, N22, N33).
3. **Cấm `git commit --amend`.** Hook tự lưu cuối lượt tạo commit "Tu dong luu"; một tác tử con đã `--amend` nhầm lên commit đó rồi phải khôi phục (nội dung không đổi). Muốn sửa thì tạo commit mới (lô 18 video, N32).
4. **Đo bằng ffmpeg đủ bộ lọc.** Đo âm lượng và đứng hình bằng `xuong_thu_hyperframes/bin/ffmpeg` (có `ebur128`, `freezedetect`); ffmpeg kèm Remotion không có hai bộ lọc này. Lệnh cụ thể ở mục 9 (lô 18 video, N18).
5. **Dòng Co-Authored-By của commit ghi đúng tên model của chính tác tử đang chạy.** Tác tử Sonnet ghi `Claude Sonnet 5.5`; tác tử Opus ghi tên model Opus của mình. Không chép nguyên dòng mẫu trong kế hoạch lô: lô 18 video có tác tử Sonnet ghi `Claude Sonnet 5.5` trong khi kế hoạch ghi "Opus 5.5", nên các commit không thống nhất (N29, N33).
6. **Kết xuất treo im lặng thì dừng và chạy lại với `--concurrency=2`.** Theo dõi số khung đã ra của lượt kết xuất mình khởi chạy (đếm file `element-*.jpeg` khi kết xuất chuỗi ảnh, hoặc đọc dòng tiến độ của Remotion khi kết xuất mp4); số khung không tăng trong 3 phút thì coi là treo, dừng đúng PID của mình rồi chạy lại với `--concurrency=2`. Ca đã gặp: kết xuất Remotion Three.js đứng ở khung 388/3.669, 0% CPU, và `--timeout` không kích hoạt (lô 18 video, N34). Tiến trình ngoài lượt của mình (của video khác, của phiên điều phối) thì tác tử con không tắt, kể cả khi nó trông bị treo: báo phiên chính. Ở N34 hệ thống quyền còn chặn lệnh `kill` của tác tử con và phiên điều phối không tắt thay, mà báo Trung tắt tay. Trình chạy pha máy (`scripts/pha_may/pha_may.mjs`) kiểm ngày 28/10/2026 mới truyền `--timeout=180000` cho Remotion, chưa có vòng giám sát số khung này; `HUONG_DAN.md` cũng chưa nhắc.

**Số đo chạy thử ngày 28/10/2026** (bản sao dự án N49, video 128 giây, 3.853 khung, 9 chương). Lúc đo, phiên lô điện gió đang kết xuất song song nên số này cao hơn lúc máy rảnh.
- Pha 2 lần đầu: 776 giây máy. Trong đó kết xuất hình 487 giây, tiếng 93 giây, thay 22 khung hỏng 114 giây, mã hoá 63 giây.
- Chạy lại khi không sửa gì: 124 giây, dùng lại cả 9 chương.
- Sửa máy quay chương 2 nhưng phiếu khai nhầm là chương 5: trình chạy tự bắt chương 2 qua khung mẫu, chỉ kết xuất 1.044 khung của chương 2 và chương 5. Tổng 334 giây.

**Phép đo đối chứng nháp và bản đủ** (cùng ngày, cùng video). Không lượt nào đo được lúc máy rảnh, vì lô điện gió kết xuất liên tục:
- nháp nửa độ phân giải ra mp4: 342 giây, có lượt khác chạy chồng khoảng 2 phút;
- chuỗi ảnh đủ độ phân giải: 294 giây, gần như suốt lượt có một lượt kết xuất đủ khác chạy chồng; cộng 88 giây mã hoá;
- mp4 đủ độ phân giải kết xuất thẳng: 468 giây.

Chiều hướng khớp nhật ký hai lô: bản nháp không rẻ hơn kết xuất đủ bằng chuỗi ảnh, và đường kết xuất thẳng ra mp4 là đắt nhất. Chưa có số đo lúc máy rảnh.
