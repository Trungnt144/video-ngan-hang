# Hệ trục dựng (sinh tự động)

> File này sinh từ `he_truc_dung.json` bằng `python3 scripts/goi_y_to_hop_dung.py --xuat-md`. Không sửa tay. Phiên bản dữ liệu 2.0, cập nhật 2026-10-27. Áp cho video mở việc từ 27/10/2026; video cũ giữ mã D trong kịch bản của nó. Cách dùng trong quy trình: `04_he_truc_dung.md` (cửa chọn 2) và `05_cach_lam.md` (bảy cách làm). Giá trị học từ repo mẫu ngày 27/10/2026 (CL-09…CL-16, BC-08…BC-13, MAU-20…MAU-31, ghi nháp ở cột Trạng thái) chưa chấm điểm: script không xếp hạng mà in ở mục "Lựa chọn mới, chưa chấm điểm" để Claude đánh giá theo nội dung video, đọc mục Gợi ý đánh giá chất liệu mới bên dưới (Trung chốt 27/10/2026).

## Chất liệu hình (CL)

| Mã | Tên | Mô tả | Khổ | Mức chi tiết | Nhịp, phụ đề | Mã dựng | Cách làm | Thời gian máy | Thẻ D gốc hoặc gần nhất | Trạng thái |
|---|---|---|---|---|---|---|---|---|---|---|
| CL-01 | 2D chữ và khối | Chữ trắng rất đậm, khối hình học, số đếm tăng kèm thanh chạy; 7 khối cảnh dựng sẵn | dọc 1080×1920 | CT1 | Khoảng 7 giây một màn; phụ đề đổi cụm 0,4–0,6 giây theo mốc từng từ lấy bằng Whisper từ giọng VieNeu (`scripts/moc_tung_tu.py`); chưa có mốc từng từ thì dùng cụm chữ trắng theo câu | Có: xuong/src/video-ngan/ (7 khối cảnh, chỉ có bộ màu D-01) | LM-01 (sẵn); LM-04 (công cụ); LM-03 (công cụ) | CT1: Nhanh: 84 giây video render 62 giây (26/10/2026); có chuyển động liên tục thì chậm hơn khoảng 19% | D-01, D-06 | — |
| CL-02 | 2D thẻ kính mờ | Thẻ kính mờ mô phỏng giao diện giữ 8–13 giây, chi tiết bên trong tiết lộ dần, chuyển cảnh mờ sang nét | dọc 1080×1920 | CT1 | Hai tầng: thẻ lớn 8–13 giây, phụ đề 1,5–2,5 giây một cụm | Chưa có, phải dựng thêm trong xuong/ | LM-01 (công cụ); LM-03 (công cụ) | CT1: Chưa đo (chưa có mã dựng) | D-02, D-04 | — |
| CL-03 | 2D nét viền ăn khớp lời | Hình chỉ có nét viền mảnh; mỗi cụm phụ đề ứng với đúng một chi tiết đổi trên hình | dọc 1080×1920 | CT1 | Cảnh lớn 10–12 giây, cụm phụ đề 2–2,5 giây, mỗi cụm một bước đổi hình | Chưa có, phải dựng thêm trong xuong/ | LM-01 (công cụ); LM-03 (công cụ) | CT1: Chưa đo (chưa có mã dựng) | D-03 | — |
| CL-04 | 2D ảnh chụp màn hình và sơ đồ | Ghép ảnh chụp màn hình thật với sơ đồ vector; số liệu đếm tăng; chuyển cảnh vòng tròn khép dần | dọc 1080×1920 | CT1 | Khối lớn 5–20 giây, chữ và số bên trong đổi 1,5–2,5 giây một lần | Chưa có, phải dựng thêm trong xuong/ | LM-01 (công cụ); LM-03 (công cụ) | CT1: Chưa đo (chưa có mã dựng) | D-05 | — |
| CL-05 | Đồ thị SVG | Đồ thị nét mảnh tự vẽ ra, điểm trượt, bảng số điền từng ô đúng lúc đọc, công thức biến đổi tại chỗ | ngang 1920×1080 | CT1 | Gần như không cắt: mỗi câu đọc một bước biến đổi hình; phụ đề chạy theo từng từ (`10_video_ngang_thuyet_minh.md` mục 19) | Có: xuong_dai/dien_ap/, kw_kwh/, p50_p90/, ton_that/ | LM-02 (sẵn); LM-03 (công cụ) | CT1: Nhanh (chỉ hình vẽ bằng mã, không 3D); chưa ghi số đo | D-10 | đã duyệt |
| CL-06 | 3D đất sét và bản vẽ | Mô hình 3D một màu trắng xám như đất sét, máy quay lượn chậm, mặt cắt và tách lớp; xen màn bản vẽ lưới ô cho công thức | ngang 1920×1080 | CT2, CT3 | Rất chậm: một cảnh 3D giữ 10–30 giây; gần như không chữ trên hình | Có: xuong_dai/pin_mat_troi/ (bản 3D, Three.js) | LM-02 (sẵn); LM-03 (công cụ) | CT2: Trung bình; chưa ghi số đo; CT3: Chậm; chưa dựng thật ở mức này | D-07 | đã duyệt |
| CL-07 | 3D xuyên thấu | Mô hình 3D (Three.js) vỏ trắng chuyển xuyên thấu như phim X-quang, mỗi bộ phận một màu, nhãn có đường dẫn bám bộ phận | ngang 1920×1080 | CT2, CT3 | Máy quay bay liên tục, 3–5 giây một góc máy; giọng tăng tốc 1,2 lần; phụ đề theo câu hoặc theo từng từ | Có: xuong_dai/may_bien_ap/ (khung mã dùng lại cho mọi video D-09b), xuong_dai/bang_mau_d09b/ (bảng màu) | LM-02 (sẵn) | CT2: Xong trong một buổi (thẻ D-09); CT3: Video 2 phút có thể mất trọn một ngày (`10_video_ngang_thuyet_minh.md` mục 1) | D-09, D-09b | đã duyệt |
| CL-08 | 3D tả thực Blender | Vật liệu thật kết xuất bằng Blender Cycles từ mô hình tải về, máy quay bay liền mạch, có độ sâu trường ảnh | ngang 1920×1080 | CT2, CT3 | Trung vị 4,7 giây giữa hai lần cắt, có đoạn bay liền tới 69 giây; nhãn chữ ghép trong Remotion | Có: xuong_dai/tuabin_gio/, xuong_dai/d11_lrv/ (skill dung-hoat-canh-3d-blender) | LM-05 (sẵn) | CT2: Nhiều giờ máy chạy (thẻ D-08); CT3: Cycles 6–14 giây mỗi khung ở 960×540 (thẻ D-11); cần mô hình chi tiết có giấy phép rõ | D-08, D-11 | đã duyệt |
| CL-09 | 2D minh hoạ phẳng có vật thể | Vật thể vẽ phẳng bằng SVG đặt giữa khung (ví dụ ly, chai, thiết bị) được lấp hoặc biến đổi dần theo từng bước; thẻ số đo cỡ lớn chạy từ 0 tới đủ lượng; thanh bước ở chân khung | ngang 1920×1080 | CT1 | Một cảnh cố định, mỗi bước khoảng 5 giây; 5–6 chấm bước ở chân khung (bước đang làm tô màu, bước xong có dấu tích); phụ đề chân khung theo câu (mẫu ror-fly-880547, sarut0bisasuke-069973) | Có: LM-03: công cụ xuong_html/cong_cu/, đã chạy thử trọn một video bàn thao tác công thức cocktail 27/10/2026 (trang mau1_cocktail.html, chưa lưu vào kho); LM-02: phải dựng bàn thao tác trong xuong_dai/ | LM-03 (sẵn); LM-02 (công cụ); LM-04 (công cụ) | CT1: LM-03: 1,2–1,5 giây máy mỗi giây video ở 30 khung/giây; bản chạy thử cocktail 27/10/2026: 30 giây video xuất 36,4 giây máy (1,21), nguồn nhật ký mau1_cocktail.time.txt. LM-02: chưa đo, phải dựng | D-03 | nháp |
| CL-10 | 2D nét vẽ tay | Nền bảng trắng hoặc giấy sổ; nét bút hiện dần theo đường bút đúng lúc lời đọc; tiêu đề viết tay ở góc; có thể có hình cây bút đang vẽ | ngang 1920×1080 | CT1 | Nhịp chậm đều; mỗi cảnh một tiêu đề viết tay ở góc trái trên, nội dung vẽ dần bên dưới theo lời; phụ đề một câu ở dải chân khung; có khoảng nghỉ trang trống giữa cảnh (mẫu tak3sh8-441895, groundcontrol-230877) | Chưa có trang mẫu riêng. LM-03 có công cụ chung (xuong_html/cong_cu/), viết trang mới; LM-04 xuong_thu_hyperframes/ | LM-03 (công cụ); LM-04 (công cụ) | CT1: LM-03: 1,2–1,5 giây máy mỗi giây video ở 30 khung/giây (số đo LM-03 27/10/2026); chưa đo trang nét vẽ tay thật | D-10 | nháp |
| CL-11 | Chữ động khổng lồ | Mỗi nhịp 1–2,5 giây một ý; chữ không chân rất đậm chiếm gần hết khung; nền đổi màu theo từng ý; vài từ khoá đổi màu nhấn | dọc 1080×1920, ngang 1920×1080 | CT1 | Một ý mỗi nhịp 1,5–2,5 giây, cắt dứt khoát; thường không có phụ đề riêng vì chữ trên hình là lời (mẫu souravbhar871-477361 1,5 giây, 0xfemyn-137833 2,5 giây) | Chưa có trang mẫu riêng. LM-03 có công cụ chung (xuong_html/cong_cu/); LM-04 xuong_thu_hyperframes/ | LM-03 (công cụ); LM-04 (công cụ) | CT1: LM-03: 1,2–1,5 giây máy mỗi giây video ở 30 khung/giây; xuất 60 khung/giây có nhoè chuyển động nặng gấp khoảng 8 lần (mẫu lịch sử AI 27/10/2026) | D-01 | nháp |
| CL-12 | Hạt và ánh sáng | Hạt (hàng nghìn tới hàng chục nghìn điểm), quầng sáng và hình sinh bằng toán hoặc shader (chương trình nhỏ chạy trên card đồ hoạ để tính màu từng điểm ảnh); nền tối; con số hoặc chữ hình thành từ hạt tụ lại | ngang 1920×1080 | CT1, CT2 | Nhịp chậm, mỗi con số hoặc mỗi hình một cảnh; chữ tụ từ hạt; thanh tiến trình mảnh chạy suốt chân khung; ít chữ thuyết minh (mẫu nolkeeg-635633 45 giây) | Chưa có trang mẫu riêng. LM-03 có công cụ chung (xuong_html/cong_cu/), đã đo trang Canvas 3.000 hạt; đám hạt và vòng hạt có trong mẫu lịch sử AI 27/10/2026 nhưng chưa tách thành mã dùng lại | LM-03 (công cụ) | CT1: LM-03: Canvas 3.000 hạt 0,96 giây máy mỗi giây video ở 30 khung/giây; hạt hàng chục nghìn điểm, 60 khung/giây, có nhoè chuyển động: khoảng 23 phút máy cho 60 giây video và file 134 MB do lớp hạt nhiễu (mẫu lịch sử AI 27/10/2026); CT2: Cảnh dựng từ điểm bằng Three.js: ước, chưa đo | D-01, D-05 | nháp |
| CL-13 | 3D sa bàn bằng mã | Mô hình 3D dựng bằng Three.js từ khối đơn giản kiểu đồ chơi hoặc phép chiếu đẳng cự (không có điểm tụ), ánh sáng mềm, màu theo chức năng (điện, nhiệt, nước); tiêu đề và thẻ phủ lên | dọc 1080×1920, ngang 1920×1080 | CT2, CT3 | Máy quay đứng yên hoặc quỹ đạo chậm; mỗi cảnh 6–15 giây; đồ vật xuất hiện lần lượt trên sa bàn; tiêu đề và thẻ đổi theo cảnh (mẫu felipemoller-936736 30 giây, mdaman010-111079 cảnh 10–15 giây) | Chưa có trang mẫu riêng. LM-03 có công cụ chung (xuong_html/cong_cu/, Three.js đã đo, bàn cờ Three.js trong video Lịch sử AI 27/10/2026); LM-02 có Three.js trong Remotion (xuong_dai/pin_mat_troi/) nhưng chưa có sa bàn | LM-03 (công cụ); LM-02 (công cụ) | CT2: LM-03: Three.js đơn giản 1,39 giây máy mỗi giây video (KET_QUA_DO 27/10/2026); sa bàn đủ vật thể và ánh sáng mềm: ước, chưa đo; CT3: Ước, chưa đo; mẫu mdaman010-111079 độ khó 5, tải máy vừa; chưa dựng thật ở mức này | D-07, D-11 | nháp |
| CL-14 | Mô phỏng và bề mặt toán | Vật chuyển động theo tính toán thật mỗi khung (quả bóng lăn theo độ dốc, bước ngẫu nhiên, hạt va chạm) hoặc bề mặt hàm số 3D tô màu theo độ cao; bộ đếm bước và đồ thị nhỏ vẽ dần dưới hình | dọc 1080×1920, ngang 1920×1080 | CT1, CT2 | Cảnh 6–10 giây; chữ và công thức hiện dần theo lời; bộ đếm bước (Step n of N), giá trị và đồ thị nhỏ vẽ dần dưới hình (mẫu anirockshady-032809, astrothewizard-618782) | Chưa có trang mẫu riêng. LM-03 có công cụ chung (xuong_html/cong_cu/, Canvas và Three.js đã đo); LM-02 xuong_dai/ | LM-03 (công cụ); LM-02 (công cụ) | CT1: LM-03: 1,2–1,5 giây máy mỗi giây video ở 30 khung/giây; mô phỏng tính mỗi khung với vài nghìn phần tử: ước, chưa đo; CT2: Bề mặt hàm số 3D bằng Three.js: ước, chưa đo; Three.js đơn giản đã đo 1,39 giây máy mỗi giây video (27/10/2026) | D-07, D-10 | nháp |
| CL-15 | Minh hoạ kể chuyện có nhân vật, giấy cắt | Nhân vật phẳng và cảnh nhiều lớp giấy cắt có chiều sâu (parallax: các lớp trượt với tốc độ khác nhau); kể bằng cảnh, ít chữ. Hợp Media thấp, ghi để đủ | ngang 1920×1080 | CT1 | Nhịp chậm theo lời kể hoặc không lời; mỗi cảnh một diorama (khung cảnh nhiều lớp); máy quay trượt ngang có parallax; chữ ít (mẫu songkeys-384673 108 giây, daniel-mac8-306214 mỗi cảnh một ý) | Chưa có trang mẫu riêng. LM-03 có công cụ chung (xuong_html/cong_cu/); LM-06 làm clip AI chưa thử | LM-03 (công cụ); LM-06 (công cụ) | CT1: LM-03: 1,2–1,5 giây máy mỗi giây video ở 30 khung/giây; nhiều lớp parallax và ánh sáng toả mềm nặng hơn: ước, chưa đo | D-03 | nháp |
| CL-16 | Giao diện và thẻ nổi | Thẻ giao diện có bóng nổi trên nền, con trỏ chuột chỉ vào chi tiết, ảnh chụp sản phẩm; nguồn từ nhóm quảng cáo phần mềm. Gần CL-04 (2D ảnh chụp màn hình và sơ đồ), hợp Media thấp | dọc 1080×1920, ngang 1920×1080 | CT1 | Thẻ giao diện nổi lên mỗi 3–6 giây; con trỏ chuột chỉ vào chi tiết; tiêu đề hai dòng; phụ đề ít (mẫu sachaarbonel-673648, gautam-mer1-530003) | Chưa có trang mẫu riêng. LM-03 có công cụ chung (xuong_html/cong_cu/, SVG + GSAP đã đo); LM-04 xuong_thu_hyperframes/ | LM-03 (công cụ); LM-04 (công cụ) | CT1: LM-03: 1,2–1,5 giây máy mỗi giây video ở 30 khung/giây (SVG + GSAP 0,97, KET_QUA_DO 27/10/2026) | D-02, D-05 | nháp |

### Gợi ý đánh giá chất liệu mới (chưa chấm điểm)

Đọc khi chọn lựa chọn mới cho một video. Hợp Media là điểm trung bình 0–3 trên bản chấm 100 mục ngày 27/10/2026. Liên kết mẫu: xem mục Cách làm.

- **CL-09 2D minh hoạ phẳng có vật thể** (hợp Media 2,7; mẫu ror-fly-880547, sarut0bisasuke-069973, alex-prompter-997524). Hợp khi: Chủ đề có vật thể cụ thể thao tác từng bước (công thức, cài đặt, quy trình), mỗi bước có số đo hoặc lượng; bản chạy thử cocktail 27/10/2026, mẫu nguồn hợp Media 2,7/3. Không hợp khi: Khái niệm trừu tượng không có vật thể để vẽ phẳng; vật thể cần nhìn bên trong như máy móc (xem CL-07, CL-13).
- **CL-10 2D nét vẽ tay** (hợp Media 3; mẫu tak3sh8-441895, groundcontrol-230877). Hợp khi: Khái niệm định lượng hoặc cơ chế cần vẽ dần theo lời đọc (công thức, đồ thị, sơ đồ nút); video dài, nhịp chậm đều (mẫu 3–5 phút); hợp Media 3,0/3. Không hợp khi: Nội dung cần trọng lượng, nghiêm trọng; số liệu lớn cần nổi; nội dung dày chữ (nét viết tay đọc chậm); nền tối (nét vẽ tay chỉ đọc được trên nền sáng, đã thành luật loại trừ).
- **CL-11 Chữ động khổng lồ** (hợp Media 2,75; mẫu 0xfemyn-137833, souravbhar871-477361, chrisjdimarco-808196, zheke-622583). Hợp khi: Ý ngắn mỗi nhịp 1–2,5 giây: vạch trần, số liệu ngắn, quảng cáo; video 10–60 giây; hợp Media 2,75/3. Không hợp khi: Nội dung cần hình minh hoạ vật thể hoặc cơ chế; ý dài hơn hai câu; xuất 60 khung/giây có nhoè nặng gấp khoảng 8 lần xuất 30 khung/giây.
- **CL-12 Hạt và ánh sáng** (hợp Media 1,75; mẫu nolkeeg-635633, miaai-lab-774895, michaelzsguo-782312, ishuagra02-678129). Hợp khi: Hiện tượng vật lý hoặc thiên văn diễn tả bằng hạt và ánh sáng; một con số lớn mỗi cảnh (mẫu nolkeeg-635633, một giây trong vũ trụ). Không hợp khi: Cần video gấp: hạt hàng chục nghìn điểm xuất 60 khung/giây có nhoè tốn khoảng 23 phút máy cho 60 giây (mẫu lịch sử AI 27/10/2026); cần số liệu chính xác đọc kỹ; nội dung không có hiện tượng để diễn tả bằng ánh sáng; hợp Media 1,75/3.
- **CL-13 3D sa bàn bằng mã** (hợp Media 3; mẫu felipemoller-936736, mdaman010-111079). Hợp khi: Chủ đề máy móc, hạ tầng có nhiều phần vận hành theo chức năng (điện, nhiệt, nước; mẫu mdaman010-111079); lĩnh vực tài chính cá nhân, ứng dụng (mẫu felipemoller-936736, dọc); hợp Media 3,0/3. Không hợp khi: Máy móc cần chi tiết kỹ thuật đúng số răng, bu-lông (xem CL-07); mức CT3 trong khung dọc BC-12 (khung hẹp, mỗi bộ phận quá nhỏ; ước 27/10/2026, chưa dựng thử); cần xuất gấp ở mức chi tiết kỹ thuật.
- **CL-14 Mô phỏng và bề mặt toán** (hợp Media 3; mẫu anirockshady-032809, astrothewizard-618782). Hợp khi: Khái niệm định lượng có công thức hoặc mô hình tính được (tối ưu, gradient, bước ngẫu nhiên, va chạm hạt); lĩnh vực tài chính định lượng (bề mặt tối ưu, bước ngẫu nhiên; ước 27/10/2026, chưa kiểm bằng video thật); hợp Media 3,0/3. Không hợp khi: Nội dung không có công thức hay mô hình tính được; cần cảm giác tả thực.
- **CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt** (hợp Media 1,7; mẫu daniel-mac8-306214, songkeys-384673, triglyceee-161719). Hợp khi: Kể chuyện văn minh, lịch sử, nghề nghiệp bằng cảnh, ít chữ; video dài, nhịp chậm. Không hợp khi: Video khoa học, kỹ thuật hoặc tài chính nghiêm túc (hợp Media thấp, 1,7/3 trên bản chấm 100 mục 27/10/2026); cần số liệu chính xác dày.
- **CL-16 Giao diện và thẻ nổi** (hợp Media 1,45; mẫu sachaarbonel-673648, gautam-mer1-530003, brainextends-606193). Hợp khi: Giới thiệu sản phẩm, ứng dụng có giao diện; mô phỏng thao tác công cụ. Không hợp khi: Video khoa học (hợp Media thấp, 1,45/3 trên 31 mẫu quảng cáo phần mềm); nội dung không có sản phẩm hay giao diện.

## Cách làm (LM)

Cách làm là con đường kỹ thuật dựng ra chất liệu hình; một chất liệu có thể làm bằng nhiều cách, mỗi cách đã có mã dựng sẵn cho chất liệu đó (sẵn), mới có công cụ chung (công cụ) hoặc chưa có cả công cụ (chưa). Script đề xuất cách có mã dựng sẵn và nhanh nhất cho khổ; lọc bằng `--cach-lam LM-xx`.

| Mã | Tên | Chỗ | Trạng thái | Khổ làm được | Khổ đã chạy thật | Thời gian máy | Chi phí dựng mới | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| LM-01 | Remotion khối cảnh dọc | xuong/ (src/video-ngan/, 7 khối cảnh) | có | dọc 1080×1920 | dọc 1080×1920 | 0,44–1,39 giây máy mỗi giây video. 75 giây video khoảng 33 giây máy khi máy rảnh (0,44); máy bận 87 giây (khối cũ, 1,16) đến 98–104 giây (khối có chuyển động liên tục, 1,31–1,39); lần thử khác 83,7 giây video 62 giây máy (0,74). (nguồn: `05_cach_lam.md` mục LM-01; bản chỉ đạo thiết kế Media 27/10/2026; đo 26/10/2026) | Dựng thêm khối cảnh Remotion cho chất liệu mới: chưa đo. | Remotion (khung dựng video bằng mã React). Bảy khối cảnh dựng sẵn cho video dọc giai đoạn 1; mã dựng chỉ có bộ màu MAU-01; phụ đề chạy theo từng từ dùng mốc từng từ lấy bằng Whisper từ giọng VieNeu (`scripts/moc_tung_tu.py`). |
| LM-02 | Remotion dự án ngang | xuong_dai/<tên>/ | có | ngang 1920×1080 | ngang 1920×1080 | 2,8 giây máy mỗi giây video (video 3D). Máy biến áp: 3.197 khung (106,6 giây) kết xuất 5 phút 2 giây; pin mặt trời 3D: 4.538 khung (2 phút 31) trong 7 phút; cả hai khoảng 2,8 giây máy mỗi giây video. Chuỗi video ngang chạy đêm: một lượt kết xuất 4–8 phút với 4 luồng. Cảnh 2D thuần SVG chưa ghi riêng. (nguồn: `05_cach_lam.md` mục LM-02 (đo 26/10/2026); `10_video_ngang_thuyet_minh.md` mục 23 điểm 9 (đo 27/10/2026)) | Dựng cảnh mới trong dự án ngang: chưa đo riêng; video 3D chi tiết kỹ thuật 2 phút có thể mất trọn một ngày (`10_video_ngang_thuyet_minh.md` mục 1). | Video ngang có thuyết minh; mỗi video một dự án Remotion; Three.js chạy trong Remotion (xuong_dai/pin_mat_troi 3D, xuong_dai/may_bien_ap). |
| LM-03 | HTML một trang, chụp khung theo đồng hồ ảo | xuong_html/<tên>/; công cụ xuong_html/cong_cu/: xuat_mp4.mjs, xuat_nhoe.sh; skill dung-video-html | có | dọc 1080×1920, ngang 1920×1080 | ngang 1920×1080 | 1,2–1,5 giây máy mỗi giây video ở 30 khung/giây. Xuất 30 khung/giây: 1,2–1,5 giây máy mỗi giây video. Xuất 60 khung/giây có nhoè chuyển động nặng gấp khoảng 8 lần: mẫu lịch sử AI 60 giây mất 23,3 phút máy và file 134 MB do lớp hạt nhiễu. Công cụ đo trên trang 10 giây 1920×1080 (Apple M5): Canvas 3.000 hạt 0,96, SVG + GSAP 0,97, Three.js đơn giản 1,39 giây máy mỗi giây video. (nguồn: bản chỉ đạo thiết kế Media 27/10/2026; xuong_html/cong_cu/KET_QUA_DO.md ngày 27/10/2026) | Viết trang mới: một lượt cho video 30 giây khoảng 150 nghìn token, 12 phút Opus, còn 1–2 lỗi nhìn thấy. Có cách sửa (khung đích, GSAP + Three.js, 3 vòng xem và sửa): mẫu lịch sử AI 60 giây tốn 218.774 token, 31 phút Opus, 1.324 dòng (27/10/2026). Đưa quá nhiều ảnh đích thì tác tử con đẩy ảnh khỏi ngữ cảnh: gộp thành 1–2 ảnh ghép. | Opus viết một trang HTML trong đó mọi giá trị là hàm của thời gian (seek(t): tính trạng thái của trang tại giây t); xuat_mp4.mjs chụp từng khung theo đồng hồ ảo rồi ghép bằng FFmpeg; xuat_nhoe.sh xuất 60 khung/giây có nhoè chuyển động; giọng và nhạc ghép bằng FFmpeg. Chạy thử trên khổ ngang 1920×1080; khổ dọc làm được nhưng chưa chạy. |
| LM-04 | HyperFrames | xuong_thu_hyperframes/ | có | dọc 1080×1920, ngang 1920×1080 | dọc 1080×1920 | 0,44–0,63 giây máy mỗi giây video. 75 giây video render 33,6 giây (công cụ tự báo) đến 47,2 giây (thời gian thật, lần 1); lần 2 32,7 giây. (nguồn: xuong_thu_hyperframes/NHAT_KY_DO.md, đo 26/10/2026) | Dựng từ đầu một video 75 giây: 154 nghìn token, 7 phút 24 giây (26/10/2026). | HTML + GSAP theo khuôn của HeyGen, giấy phép Apache-2.0, có bước kiểm chữ đè. Mới chạy thử một video dọc 1080×1920 75 giây (26/10/2026); khổ ngang làm được nhưng chưa chạy. |
| LM-05 | Blender Cycles và ghép Remotion | skill dung-hoat-canh-3d-blender; xuong_dai/tuabin_gio/, xuong_dai/d11_lrv/ | có | ngang 1920×1080 | ngang 1920×1080 | 78–390 giây máy mỗi giây video ở 30 khung/giây, quy đổi từ giây máy mỗi khung (ước). Tua-bin gió 1920×1080 (EEVEE, 48 mẫu): 2.540 khung trong 109,7 phút, 1,2–4,8 giây mỗi khung (trung bình 2,6); Remotion ghép 4.708 khung trong 7 phút 20. Cảnh buồng máy D-11, Cycles 960×540 24 mẫu: 412 khung trong 89 phút, 13,0 giây mỗi khung (7,6–100). Quy đổi ở 30 khung/giây: khoảng 78–390 giây máy mỗi giây video (ước). Bản Cycles 1920×1080 ước 40–55 giây mỗi khung, chưa chạy. (nguồn: `05_cach_lam.md` mục LM-05; `tai_san/nhat_ky_video_ngang.md` (số đo tua-bin gió và D-11, từ module 14 cũ), đo 26–27/10/2026) | Dựng cảnh Blender mới: nhiều giờ máy chạy (thẻ D-08, D-11), chưa đo riêng. | 3D tả thực: Blender Cycles kết xuất chuỗi ảnh nền trong suốt, Remotion ghép nhãn chữ và giọng. Cần mô hình tải về có giấy phép rõ. |
| LM-06 | Clip AI ghép Remotion | Flow (làm tay); skill giao-muse-video | một phần (làm tay) | dọc 1080×1920, ngang 1920×1080 | chưa | Muse: chờ khoảng 2 phút cho clip 10 giây (lần thử 26/10/2026). Flow: chưa đo thời gian, tính bằng credit (gói Google AI Pro 1.000 credit mỗi tháng cộng 50 credit mỗi ngày). Phần ghép trong Remotion theo LM-02. (nguồn: `05_cach_lam.md` mục LM-06 (lần thử 26/10/2026)) | Tạo clip: Muse chờ khoảng 2 phút mỗi clip 10 giây; Flow tạo tay, chưa đo. | Cảnh quay tả thực do AI sinh: Muse của Meta (Claude giao qua web muse.ai, skill giao-muse-video) hoặc Flow của Google (Trung tạo tay, Veo 3.1); ghép nhãn chữ và giọng trong Remotion theo LM-01 hoặc LM-02. Clip 720p phóng lên 1080p lúc dựng. Không có mã chất liệu riêng: clip là nguyên liệu xen vào mọi chất liệu khác. |
| LM-07 | Manim | chưa cài | chưa cài | ngang 1920×1080 | chưa | Chưa cài, chưa đo. (nguồn: bản chỉ đạo thiết kế Media 27/10/2026) | Chưa cài, chưa đo. | Thư viện Python vẽ hoạt hình toán học. Chưa cài; ghi để biết, 1 trên 703 prompt của repo mẫu dùng. |

Nguồn mẫu: https://github.com/yihui-dev/awesome-opus5-5-videos Liên kết mẫu: `https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/<slug>.md` (prompt), `https://media.skillry.dev/opus-5-5/<slug>/original.mp4` (video gốc), `https://media.skillry.dev/opus-5-5/<slug>/remake.mp4` (video làm lại). Trường mau_nguon của mỗi giá trị mới liệt kê slug mẫu; thay <slug> bằng giá trị đó để có liên kết. Chỉ lưu liên kết: không tải video và không chép prompt dài của tác giả vào kho (bản quyền thuộc tác giả). Trường hop_media là điểm hợp Media trung bình 0–3 của các mẫu trong bản chấm 100 mục ngày 27/10/2026 (dữ liệu chấm nằm ở tai_san/hoc_tu_repo/).


## Mức chi tiết (CT)

| Mã | Tên | Mô tả |
|---|---|---|
| CT1 | Sơ đồ | Biểu tượng, khối phẳng, chữ, đồ thị; không có mô hình 3D |
| CT2 | Mô hình rút gọn | Mô hình 3D chỉ có bộ phận chính, hình khối đơn giản |
| CT3 | Chi tiết kỹ thuật | Đủ bộ phận, bánh răng đúng số răng và ăn khớp đúng pha, đủ bu-lông và chi tiết lặp |

## Bố cục khung hình (BC)

| Mã | Tên | Mô tả | Khổ | Đi với chất liệu | Thẻ D gốc hoặc gần nhất | Trạng thái |
|---|---|---|---|---|---|---|
| BC-01 | Chữ và số toàn khung | Khung đánh số kiểu bản tin, khối chữ và số chiếm cả khung | dọc 1080×1920 | CL-01, CL-03, CL-11 | D-01 | đã duyệt |
| BC-02 | Thẻ giữa khung | Một thẻ hoặc khung mô phỏng giữa khung, phụ đề bên dưới | dọc 1080×1920 | CL-02, CL-03, CL-16 | D-02, D-03, D-04 | — |
| BC-03 | Ảnh chụp kèm sơ đồ | Ảnh chụp màn hình và sơ đồ đặt cạnh nhau, dấu kênh cố định | dọc 1080×1920 | CL-04, CL-16 | D-05 | — |
| BC-04 | Chỉ nửa trên | Nội dung dồn lên nửa trên khung, nửa dưới bỏ trống; chữ in hoa | dọc 1080×1920 | CL-01, CL-03 | D-06 | — |
| BC-05 | Vật thể giữa khung, nhãn bên | Vật thể 3D chiếm phần lớn khung, nhãn có đường dẫn bám bộ phận | ngang 1920×1080 | CL-06, CL-07, CL-08, CL-13, CL-14 | D-07, D-08, D-09, D-09b, D-11 | đã duyệt |
| BC-06 | Đồ thị và bảng số toàn khung | Hệ trục, đồ thị, bảng số chiếm cả khung như bảng đen | ngang 1920×1080 | CL-05 | D-10 | đã duyệt |
| BC-07 | Chia đôi khung | Hai nửa khung đặt hai thứ cạnh nhau để so sánh | ngang 1920×1080 | CL-05, CL-06, CL-07 | D-10 | đã duyệt |
| BC-08 | Bàn thao tác | Vật thể giữa khung, danh sách bước một bên, thẻ số đo bên kia, thanh bước ở chân khung | ngang 1920×1080 | CL-09, CL-14 | D-03 | nháp |
| BC-09 | Khung chương hồi | Nhãn chương và thước tiến độ ở góc trên, tiêu đề lớn ở góc trái dưới, phụ đề ở chân khung | ngang 1920×1080 | CL-09, CL-10, CL-12, CL-15, CL-16 | D-10 | nháp |
| BC-10 | Tiêu đề hai dòng và một biểu đồ | Tiêu đề hai dòng (dòng hai màu nhấn), nhãn mục kiểu "03 / 08" phía trên, một biểu đồ hoặc thẻ dưới tiêu đề | dọc 1080×1920, ngang 1920×1080 | CL-16, CL-05, CL-09, CL-14 | D-01, D-10 | nháp |
| BC-11 | Một ý toàn khung ngang | Chữ khổng lồ chiếm gần hết khung, một ý mỗi nhịp; bản dọc dùng BC-01 kèm CL-11 | ngang 1920×1080 | CL-11, CL-12, CL-15 | D-01 | nháp |
| BC-12 | Sa bàn giữa khung dọc | Sa bàn 3D hoặc bề mặt toán ở giữa khung, tiêu đề phía trên, thẻ nhỏ ở phía dưới | dọc 1080×1920 | CL-13, CL-14 | D-11 | nháp |
| BC-13 | Bảng trắng toàn khung | Bảng trắng chiếm toàn khung, tiêu đề viết tay ở góc trái trên, phụ đề ở dải chân khung | ngang 1920×1080 | CL-10, CL-05 | D-10 | nháp |
| BC-14 | Ba tầng dọc | Nền một màu (lấy màu nền của video ngang); tiêu đề hai dòng in hoa (vàng viền đen, đỏ viền trắng) đứng yên ở y 330–560; hình ngang rộng 900 điểm ảnh ở giữa (x 90–990, từ y 660); phụ đề 87 điểm ảnh có viền, từng chữ nảy lên khi được đọc, ngay dưới hình; chừa trống trên 320, dưới 420 và mỗi bên 90 điểm ảnh (ứng dụng Facebook cắt khoảng 60 điểm ảnh mỗi bên, đo 02/11/2026). Ghép từ video ngang YouTube đã xong bằng scripts/ghep_ba_tang.py, không dựng lại cảnh | dọc 1080×1920 | CL-01, CL-02, CL-03 |  | nháp |

## Tông màu (MAU)

Cột Màu đo ghi mã hex đo bằng máy từ khung hình mẫu (độ lệch khoảng 3 mức trên thang 255; nét mảnh đo nhạt hơn màu thật chừng 10–20 mức). Tông cũ không ghi cột này.

| Mã | Tên | Nền | Mô tả | Màu đo (nền / chữ / nhấn / phụ) | Đi với chất liệu | Trạng thái | Thẻ D gốc hoặc gần nhất |
|---|---|---|---|---|---|---|---|
| MAU-01 | Đêm & đỏ | tối | Nền đen, chữ trắng, nhấn đỏ cam #FF443D, nhấn phụ vàng | — | CL-01, CL-02, CL-03, CL-04, CL-11, CL-12 | đã duyệt | D-01 |
| MAU-02 | Đêm & kính | tối | Nền gần đen có sao, bốn màu nhấn xoay vòng theo ngữ cảnh | — | CL-01, CL-02, CL-03, CL-04 | nháp | D-02 |
| MAU-03 | Trắng & cam | sáng | Nền trắng, nét đen than, nhấn cam, nút xanh ngọc | — | CL-01, CL-03, CL-04, CL-09, CL-11, CL-15, CL-16 | nháp | D-03 |
| MAU-04 | Đêm, màu theo cảm xúc | tối | Nền đen; màu nhấn đổi từ trung tính sang cảnh báo theo mạch nội dung | — | CL-01, CL-02, CL-03, CL-04 | nháp | D-04 |
| MAU-05 | Đêm & tím than | tối | Nền đen phủ quầng tím chàm cố định; cam vàng cho số liệu, đỏ cho cảnh báo | — | CL-01, CL-02, CL-03, CL-04, CL-12 | nháp | D-05 |
| MAU-06 | Đêm, bốn màu theo khái niệm | tối | Nền đen; xanh ngọc = phương án tối ưu, đỏ hồng = truyền thống, vàng ô liu = trung tính | — | CL-01, CL-03 | nháp | D-06 |
| MAU-07 | Ô liu & đất sét | sáng | Nền ô liu #4a5048, mô hình trắng xám, bộ phận điện xanh dương, màn bản vẽ nền xanh | — | CL-06 | đã duyệt | D-07 |
| MAU-08 | Tả thực ngoài trời | sáng | Màu thật của vật liệu, trời xanh, đồng cỏ; ánh sáng từ ảnh môi trường ngoài trời | — | CL-08 | đã duyệt | D-08 |
| MAU-09 | Kem & ngọc | sáng | Nền kem #F4F1EA, vàng nắng, xanh ngọc, đồng, nhấn cam san hô (bảng M0 cũ) | — | CL-05, CL-07, CL-09 | đã duyệt | D-09, D-09b · M0 |
| MAU-10 | Trời trong | sáng | Nền xanh trời nhạt, xanh cô-ban, nhấn đỏ hồng (bảng M1 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M1 |
| MAU-11 | Lá non | sáng | Nền xanh lá rất nhạt, nhấn cam đỏ (bảng M2 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M2 |
| MAU-12 | Đào & oải hương | sáng | Nền hồng đào nhạt, tím oải hương, nhấn hồng đậm (bảng M3 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M3 |
| MAU-13 | Biển cát | sáng | Nền cát, xanh biển, đỏ gạch (bảng M4 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M4 |
| MAU-14 | Kẹo pop | sáng | Nền tím rất nhạt, vàng, hồng, xanh điện (bảng M5 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M5 |
| MAU-15 | Đêm xanh neon | tối | Nền xanh đêm, xanh lơ sáng, nhấn hồng neon (bảng M6 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M6 |
| MAU-16 | Than chì & chanh | tối | Nền than chì, vàng chanh, nhấn hồng đỏ (bảng M7 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M7 |
| MAU-17 | Tím đêm | tối | Nền tím than, vàng, bạc hà, nhấn hồng (bảng M8 cũ) | — | CL-05, CL-07 | nháp | D-09, D-09b · M8 |
| MAU-18 | Bảng đen | tối | Nền đen sáng dần xuống dưới, nét trắng xám; xanh lá = đang tính, xanh dương = lý thuyết, đỏ hồng = sai số | — | CL-05, CL-14 | đã duyệt | D-10 |
| MAU-19 | Phòng chụp & viền sáng | sáng | Nền xám ngả xanh như phòng chụp sản phẩm, viền phát sáng xanh ngọc ôm bộ phận, mũi tên đỏ | — | CL-08 | đã duyệt | D-11 |
| MAU-20 | Đen & cam | tối | Nền đen gần thuần #090909, chữ trắng ngả kem #ECE9E2, nhấn cam #FC7B33 (phụ #E9732D); nhãn nhỏ đơn cách ở góc, thanh tiến độ cam mảnh | #090909 / #ECE9E2 / #FC7B33 / #E9732D | CL-01, CL-05, CL-11, CL-12, CL-14 | nháp | D-01 |
| MAU-21 | Navy & vàng bài giảng | tối | Nền navy rất đậm #0C111E, chữ trắng #FEFFFF; tiêu đề và nhấn vàng #F8DB78, nhãn đồ thị xanh lơ #58C3DB, đường tiếp tuyến cam #FB8836, đồ thị đạo hàm xanh lá #8AB877 | #0C111E / #FEFFFF / #F8DB78, #58C3DB / #FB8836, #8AB877 | CL-05, CL-14 | nháp | D-10 |
| MAU-22 | Báo tài chính sáng | sáng | Nền trắng xám xanh #ECF0F5, chữ đen xanh #0B1017, nhấn xanh dương #2C84C1 (phụ #59A7DB); một mục đảo nền sang đen xanh #0B1017 chữ trắng | #ECF0F5 / #0B1017 / #2C84C1 / #59A7DB | CL-04, CL-05, CL-16 | nháp | D-03 |
| MAU-23 | Giấy kem & bút chì | sáng | Nền giấy kem #E6D9C4 (có vân, tối dần ở mép, vùng ám #D3CAB5), nét và chữ than chì #211D18, nhấn đỏ #C34A34, xanh chàm xám #798695 cho con dấu (ít điểm ảnh, kém chắc); dấu căn lề ở bốn góc | #E6D9C4 / #211D18 / #C34A34 / #798695 | CL-09, CL-10, CL-15 | nháp | D-07 |
| MAU-24 | Bảng trắng & bút dạ | sáng | Nền bảng trắng ngà #FAFBF6, viền khung và chữ xám xanh đậm #2D363C, nhấn đỏ #B42235 (đường nối), xanh dương #2B4B93 (công thức), xanh lá #397858 (đồ thị) | #FAFBF6 / #2D363C / #B42235, #2B4B93 / #397858 | CL-05, CL-10 | nháp | D-10 |
| MAU-25 | Kem, đen & đỏ tạp chí | tối | Hai nền xen nhau: đen #0A0A11 với chữ trắng kem #EAE5DC, và kem giấy #E8E4DB với chữ đen #080A0E; một nhấn đỏ #D73428 cho từ khoá (có một cảnh phủ mảng đỏ #D73428) | #0A0A11 / #EAE5DC / #D73428 / #E8E4DB | CL-01, CL-11 | nháp | D-01, D-03 |
| MAU-26 | Tím nhạt đồ chơi | sáng | Nền trắng tím nhạt #F4F3FB, nền ca rô #EEEBF5, chữ đen #13121B, nhấn tím #694CFE (đậm #4723E4); khối đồ chơi pastel: be cam #EED3AE, tím nhạt #A698D8, xanh lá nhạt #C6ECA7 | #F4F3FB / #13121B / #694CFE / #EED3AE, #A698D8, #C6ECA7 | CL-13, CL-16 | nháp | D-11 |
| MAU-27 | Vũ trụ đen & cam | tối | Nền đen thuần #000000, số lớn trắng kem #F2EDE5, nhấn cam đỏ #C06246 cho thanh tiến trình mảnh (sáng nhất #D7684F), quầng địa cầu cam nâu #A3744B; nhãn góc đơn cách | #000000 / #F2EDE5 / #C06246 / #D7684F, #A3744B | CL-11, CL-12, CL-14 | nháp | D-01 |
| MAU-28 | Trắng & tím công nghệ | sáng | Nền trắng #FDFDFD, chữ navy đậm #09233D, nhấn tím chàm #6657FC (nét mảnh đo #6E58B9); thẻ pastel: tím nhạt #C8C4FB, hồng đào #FDDAC8, xanh nhạt #D3E4FD | #FDFDFD / #09233D / #6657FC / #C8C4FB, #FDDAC8, #D3E4FD | CL-04, CL-16 | nháp | D-03 |
| MAU-29 | Trắng xám & màu chức năng | sáng | Nền xám nhạt xanh #D6DBDE (vùng sáng #ECEDED), mô hình trắng xám, chữ xám than #242D32; màu theo chức năng: điện cam nâu #A47B57, khay cáp vàng nhạt #E6D498, nhiệt đỏ hồng #B8736A, làm mát xanh ngọc #65B5AD; bảng chú giải ở góc trên phải | #D6DBDE / #242D32 / #A47B57, #B8736A, #65B5AD / #E6D498, #ECEDED | CL-07, CL-13 | nháp | D-11 |
| MAU-30 | Đất nung & kem | tối | Ba nền xoay theo ý: đen ấm #191812, kem #EFEDE0, cam đất nung #C45A3C; chữ trắng kem hoặc đen; chữ nhấn có bóng đổ lệch hai lớp đỏ #A74131 và đen | #191812 / #EFEDE0 / #C45A3C / #A74131 | CL-11, CL-15 | nháp | D-01 |
| MAU-31 | Navy & cam bàn thao tác | tối | Nền navy tím rất đậm #0C0B19 (nền chuyển dần lên #1A1636), chữ trắng #FFFFFF, nhãn bước cam vàng #FFB347, chữ nhấn xanh nhạt #BFE6FF, chất lỏng chuyển #FFD36B → #FF8A3D → #E8445A, đỏ #C8102E; thẻ trắng độ đục 6% viền trắng 14% | #0C0B19 / #FFFFFF / #FFB347, #BFE6FF / #FF8A3D, #E8445A, #C8102E | CL-05, CL-09, CL-14 | nháp | D-10 |
| MAU-32 | Màu Vietcombank | tối | Màu thương hiệu Vietcombank: nền #031D13, chữ #FFFFFF, nhấn #A1C038 (gốc #074C31), nhấn phụ #5E8B79. Chỉ dùng màu, không tên, logo. | #031D13 / #FFFFFF / #A1C038 / #5E8B79, #063D27 | CL-05, CL-06, CL-07, CL-09, CL-12, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-33 | Màu BIDV | sáng | Màu thương hiệu BIDV: nền #F0F5F5, chữ #333333, nhấn #075652 (gốc #075652), nhấn phụ #B28013. Chỉ dùng màu, không tên, logo. | #F0F5F5 / #333333 / #075652 / #B28013, #C8DAD9 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-34 | Màu Agribank | sáng | Màu thương hiệu Agribank: nền #FAF0F3, chữ #393939, nhấn #AF0B35 (gốc #AF0B35), nhấn phụ #00422B. Chỉ dùng màu, không tên, logo. | #FAF0F3 / #393939 / #AF0B35 / #00422B, #EDC9D3 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-35 | Màu VietinBank | sáng | Màu thương hiệu VietinBank: nền #F0F5F9, chữ #001420, nhấn #005993 (gốc #005993), nhấn phụ #DA2127. Chỉ dùng màu, không tên, logo. | #F0F5F9 / #001420 / #005993 / #DA2127, #C7DAE7 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-36 | Màu MB | tối | Màu thương hiệu MB: nền #080B50, chữ #FFFFFF, nhấn #EB2D4B (gốc #141ED2), nhấn phụ #666DE2. Chỉ dùng màu, không tên, logo. | #080B50 / #FFFFFF / #EB2D4B / #666DE2, #1018A8 | CL-05, CL-06, CL-07, CL-09, CL-12, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-37 | Màu Techcombank | sáng | Màu thương hiệu Techcombank: nền #FEF1F2, chữ #333333, nhấn #ED1C24 (gốc #ED1C24), nhấn phụ #A08B56. Chỉ dùng màu, không tên, logo. | #FEF1F2 / #333333 / #ED1C24 / #A08B56, #FBCDCF | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-38 | Màu VPBank | sáng | Màu thương hiệu VPBank: nền #F0FBF4, chữ #2E3A5B, nhấn #00A547 (gốc #00B74F), nhấn phụ #1D4289. Chỉ dùng màu, không tên, logo. | #F0FBF4 / #2E3A5B / #00A547 / #1D4289, #C7EFD8 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-39 | Màu ACB | tối | Màu thương hiệu ACB: nền #001540, chữ #FFFFFF, nhấn #00AFFF (gốc #0038A8), nhấn phụ #597EC6. Chỉ dùng màu, không tên, logo. | #001540 / #FFFFFF / #00AFFF / #597EC6, #002D86 | CL-05, CL-06, CL-07, CL-09, CL-12, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-40 | Màu TPBank | sáng | Màu thương hiệu TPBank: nền #F6F2F8, chữ #343441, nhấn #652D89 (gốc #652D89), nhấn phụ #DB6C20. Chỉ dùng màu, không tên, logo. | #F6F2F8 / #343441 / #652D89 / #DB6C20, #DDD1E5 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-41 | Màu Sacombank | sáng | Màu thương hiệu Sacombank: nền #F0F5F9, chữ #2E3337, nhấn #0058A0 (gốc #0058A0), nhấn phụ #2A81D0. Chỉ dùng màu, không tên, logo. | #F0F5F9 / #2E3337 / #0058A0 / #2A81D0, #C7DAEA | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-42 | Màu LPBank | sáng | Màu thương hiệu LPBank: nền #F6F3F1, chữ #28140C, nhấn #6D371A (gốc #6D371A), nhấn phụ #C17A16. Chỉ dùng màu, không tên, logo. | #F6F3F1 / #28140C / #6D371A / #C17A16, #DFD3CD | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-43 | Màu SeABank | sáng | Màu thương hiệu SeABank: nền #FDF1F2, chữ #2F0607, nhấn #D71920 (gốc #D71920), nhấn phụ #9E1E1F. Chỉ dùng màu, không tên, logo. | #FDF1F2 / #2F0607 / #D71920 / #9E1E1F, #F6CCCE | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-44 | Màu HDBank | sáng | Màu thương hiệu HDBank: nền #FEF0F2, chữ #350007, nhấn #F00020 (gốc #F00020), nhấn phụ #9F862A. Chỉ dùng màu, không tên, logo. | #FEF0F2 / #350007 / #F00020 / #9F862A, #FCC7CE | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-45 | Màu VIB | sáng | Màu thương hiệu VIB: nền #F0F6FA, chữ #001627, nhấn #0066B3 (gốc #0066B3), nhấn phụ #B1820D. Chỉ dùng màu, không tên, logo. | #F0F6FA / #001627 / #0066B3 / #B1820D, #C7DDEE | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-46 | Màu SHB | sáng | Màu thương hiệu SHB: nền #FEF8F2, chữ #361D07, nhấn #DC751D (gốc #F58220), nhấn phụ #2E2A78. Chỉ dùng màu, không tên, logo. | #FEF8F2 / #361D07 / #DC751D / #2E2A78, #FDE4CE | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-47 | Màu OCB | sáng | Màu thương hiệu OCB: nền #F0F8F4, chữ #001F0F, nhấn #008C44 (gốc #008C44), nhấn phụ #C18014. Chỉ dùng màu, không tên, logo. | #F0F8F4 / #001F0F / #008C44 / #C18014, #C7E6D6 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-48 | Màu MSB | sáng | Màu thương hiệu MSB: nền #FEF1F2, chữ #091E42, nhấn #EC1C24 (gốc #EC1C24), nhấn phụ #EE5E0C. Chỉ dùng màu, không tên, logo. | #FEF1F2 / #091E42 / #EC1C24 / #EE5E0C, #FBCDCF | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-49 | Màu Eximbank | sáng | Màu thương hiệu Eximbank: nền #F0F5F9, chữ #001421, nhấn #005D98 (gốc #005D98), nhấn phụ #2496C6. Chỉ dùng màu, không tên, logo. | #F0F5F9 / #001421 / #005D98 / #2496C6, #C7DBE8 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-50 | Màu Nam A Bank | sáng | Màu thương hiệu Nam A Bank: nền #F0F7FB, chữ #021929, nhấn #0772BA (gốc #0772BA), nhấn phụ #9F8A00. Chỉ dùng màu, không tên, logo. | #F0F7FB / #021929 / #0772BA / #9F8A00, #C8E0F0 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-51 | Màu Bac A Bank | sáng | Màu thương hiệu Bac A Bank: nền #FCF8F1, chữ #2C1E04, nhấn #BE8311 (gốc #C88A12), nhấn phụ #B58500. Chỉ dùng màu, không tên, logo. | #FCF8F1 / #2C1E04 / #BE8311 / #B58500, #F3E5CB | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-52 | Màu ABBANK | sáng | Màu thương hiệu ABBANK: nền #FEF7F2, chữ #361B07, nhấn #E2701E (gốc #F47920), nhấn phụ #00A193. Chỉ dùng màu, không tên, logo. | #FEF7F2 / #361B07 / #E2701E / #00A193, #FDE2CE | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-53 | Màu PVcomBank | sáng | Màu thương hiệu PVcomBank: nền #F0F7FB, chữ #0D2240, nhấn #0772BA (gốc #0772BA), nhấn phụ #AC8605. Chỉ dùng màu, không tên, logo. | #F0F7FB / #0D2240 / #0772BA / #AC8605, #C8E0F0 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-54 | Màu Kienlongbank | sáng | Màu thương hiệu Kienlongbank: nền #FEF4F2, chữ #1E2452, nhấn #EF4D23 (gốc #EF4D23), nhấn phụ #2794CB. Chỉ dùng màu, không tên, logo. | #FEF4F2 / #1E2452 / #EF4D23 / #2794CB, #FBD8CF | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-55 | Màu NCB | sáng | Màu thương hiệu NCB: nền #F0F4F9, chữ #001121, nhấn #004E96 (gốc #004E96), nhấn phụ #A1874D. Chỉ dùng màu, không tên, logo. | #F0F4F9 / #001121 / #004E96 / #A1874D, #C7D8E8 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-56 | Màu VietABank | sáng | Màu thương hiệu VietABank: nền #F1F4F8, chữ #060F1D, nhấn #1B4486 (gốc #1B4486), nhấn phụ #EC2028. Chỉ dùng màu, không tên, logo. | #F1F4F8 / #060F1D / #1B4486 / #EC2028, #CDD6E4 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-57 | Màu BVBank | tối | Màu thương hiệu BVBank: nền #071633, chữ #FFFFFF, nhấn #13C0F7 (gốc #123985), nhấn phụ #657EB0. Chỉ dùng màu, không tên, logo. | #071633 / #FFFFFF / #13C0F7 / #657EB0, #0E2E6A | CL-05, CL-06, CL-07, CL-09, CL-12, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-58 | Màu Saigonbank | sáng | Màu thương hiệu Saigonbank: nền #F0F6FA, chữ #001627, nhấn #0165B3 (gốc #0165B3), nhấn phụ #6290B5. Chỉ dùng màu, không tên, logo. | #F0F6FA / #001627 / #0165B3 / #6290B5, #C7DDEE | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-59 | Màu PGBank | tối | Màu thương hiệu PGBank: nền #10142C, chữ #FFFFFF, nhấn #33BBEC (gốc #293474), nhấn phụ #747BA5. Chỉ dùng màu, không tên, logo. | #10142C / #FFFFFF / #33BBEC / #747BA5, #212A5D | CL-05, CL-06, CL-07, CL-09, CL-12, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-60 | Màu BAOVIET Bank | sáng | Màu thương hiệu BAOVIET Bank: nền #F0F7FB, chữ #001B2A, nhấn #0079C1 (gốc #0079C1), nhấn phụ #B2860A. Chỉ dùng màu, không tên, logo. | #F0F7FB / #001B2A / #0079C1 / #B2860A, #C7E2F1 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-61 | Màu Vietbank | sáng | Màu thương hiệu Vietbank: nền #F0F6FB, chữ #001929, nhấn #0071BB (gốc #0071BB), nhấn phụ #AF8600. Chỉ dùng màu, không tên, logo. | #F0F6FB / #001929 / #0071BB / #AF8600, #C7E0F0 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-62 | Màu SCB | tối | Màu thương hiệu SCB: nền #090E41, chữ #FFFFFF, nhấn #EB0029 (gốc #1825AA), nhấn phụ #6971C8. Chỉ dùng màu, không tên, logo. | #090E41 / #FFFFFF / #EB0029 / #6971C8, #131E88 | CL-05, CL-06, CL-07, CL-09, CL-12, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-63 | Màu Vikki Bank | sáng | Màu thương hiệu Vikki Bank: nền #F0F0FF, chữ #000038, nhấn #0000FF (gốc #0000FF), nhấn phụ #D21686. Chỉ dùng màu, không tên, logo. | #F0F0FF / #000038 / #0000FF / #D21686, #C7C7FF | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-64 | Màu MBV | sáng | Màu thương hiệu MBV: nền #FBF1F2, chữ #374151, nhấn #B71D1F (gốc #B71D1F), nhấn phụ #B61D22. Chỉ dùng màu, không tên, logo. | #FBF1F2 / #374151 / #B71D1F / #B61D22, #EFCDCE | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-65 | Màu VCBNeo | sáng | Màu thương hiệu VCBNeo: nền #F0F5F3, chữ #00120B, nhấn #005130 (gốc #005130), nhấn phụ #6C9831. Chỉ dùng màu, không tên, logo. | #F0F5F3 / #00120B / #005130 / #6C9831, #C7D9D1 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-66 | Màu GPBank | sáng | Màu thương hiệu GPBank: nền #FFF9F1, chữ #2E3A5B, nhấn #CC7A18 (gốc #F7941D), nhấn phụ #EF4130. Chỉ dùng màu, không tên, logo. | #FFF9F1 / #2E3A5B / #CC7A18 / #EF4130, #FDE7CD | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-67 | Màu Co-opBank | sáng | Màu thương hiệu Co-opBank: nền #F0F4F9, chữ #0F172A, nhấn #004AA1 (gốc #004AA1), nhấn phụ #E50019. Chỉ dùng màu, không tên, logo. | #F0F4F9 / #0F172A / #004AA1 / #E50019, #C7D7EA | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-68 | Màu Ngân hàng Chính sách xã hội | sáng | Màu thương hiệu Ngân hàng Chính sách xã hội: nền #FEF0F8, chữ #34001F, nhấn #EC008C (gốc #EC008C), nhấn phụ #016D3E. Chỉ dùng màu, không tên, logo. | #FEF0F8 / #34001F / #EC008C / #016D3E, #FBC7E6 | CL-05, CL-06, CL-07, CL-09, CL-10, CL-13, CL-14, CL-15, CL-16 | nháp |  |
| MAU-69 | Màu Ngân hàng Phát triển Việt Nam | tối | Màu thương hiệu Ngân hàng Phát triển Việt Nam: nền #15112D, chữ #FFFFFF, nhấn #EE1D23 (gốc #382C76), nhấn phụ #7E76A6. Chỉ dùng màu, không tên, logo. | #15112D / #FFFFFF / #EE1D23 / #7E76A6, #2D235E | CL-05, CL-06, CL-07, CL-09, CL-12, CL-13, CL-14, CL-15, CL-16 | nháp |  |

## Nhạc nền (NH, Claude tự chọn)

Đọc thẳng từ `tai_san/nhac_nen/so_nhac.json` (bản đọc `so_nhac.md` cùng thư mục). Loại bài rè nặng (trên 10 kHz từ 7 dB hoặc trên 16 kHz từ 12 dB, luôn loại NH02, NH25), loại bài máy đoán có giọng hát. Còn 38 bài dùng được, loại 40 bài.

| Tông màu | Nhóm nhạc hợp | Nhóm nhạc tránh |
|---|---|---|
| MAU-01 Đêm & đỏ | tập trung, nhẹ, trầm, nghiêm, hồi hộp | tươi vui, buồn |
| MAU-02 Đêm & kính | tập trung, nhẹ, tươi vui | buồn |
| MAU-03 Trắng & cam | tươi vui, tập trung, nhẹ | trầm, nghiêm, buồn, hồi hộp |
| MAU-04 Đêm, màu theo cảm xúc | hồi hộp, trầm, nghiêm | tươi vui |
| MAU-05 Đêm & tím than | tập trung, nhẹ, hồi hộp | buồn |
| MAU-06 Đêm, bốn màu theo khái niệm | tập trung, nhẹ, trầm, nghiêm | tươi vui, buồn |
| MAU-07 Ô liu & đất sét | tập trung, nhẹ, trầm, nghiêm | hồi hộp, hùng tráng |
| MAU-08 Tả thực ngoài trời | tập trung, nhẹ, hùng tráng, tươi vui | buồn, hồi hộp |
| MAU-09 Kem & ngọc | tập trung, nhẹ, tươi vui | buồn, trầm, nghiêm, hồi hộp |
| MAU-10 Trời trong | tươi vui, tập trung, nhẹ | buồn, trầm, nghiêm |
| MAU-11 Lá non | tươi vui, tập trung, nhẹ | hồi hộp, trầm, nghiêm |
| MAU-12 Đào & oải hương | tươi vui, tập trung, nhẹ | hồi hộp, trầm, nghiêm |
| MAU-13 Biển cát | tập trung, nhẹ, trầm, nghiêm, hùng tráng | hồi hộp |
| MAU-14 Kẹo pop | tươi vui | trầm, nghiêm, buồn, hồi hộp |
| MAU-15 Đêm xanh neon | tập trung, nhẹ, hồi hộp, trầm, nghiêm | buồn |
| MAU-16 Than chì & chanh | hùng tráng, trầm, nghiêm, hồi hộp | buồn |
| MAU-17 Tím đêm | trầm, nghiêm, hồi hộp, tập trung, nhẹ | tươi vui |
| MAU-18 Bảng đen | tập trung, nhẹ, trầm, nghiêm | hồi hộp, hùng tráng |
| MAU-19 Phòng chụp & viền sáng | tập trung, nhẹ, trầm, nghiêm, hùng tráng | buồn |
| MAU-20 Đen & cam | tập trung, nhẹ, trầm, nghiêm, hồi hộp | tươi vui, buồn |
| MAU-21 Navy & vàng bài giảng | tập trung, nhẹ, trầm, nghiêm | hồi hộp, hùng tráng |
| MAU-22 Báo tài chính sáng | tập trung, nhẹ, tươi vui | buồn, hồi hộp |
| MAU-23 Giấy kem & bút chì | tập trung, nhẹ, trầm, nghiêm | hùng tráng, hồi hộp |
| MAU-24 Bảng trắng & bút dạ | tập trung, nhẹ, trầm, nghiêm | hồi hộp, hùng tráng, buồn |
| MAU-25 Kem, đen & đỏ tạp chí | trầm, nghiêm, hồi hộp, tập trung, nhẹ | tươi vui, buồn |
| MAU-26 Tím nhạt đồ chơi | tươi vui, tập trung, nhẹ | trầm, nghiêm, buồn, hồi hộp |
| MAU-27 Vũ trụ đen & cam | trầm, nghiêm, hồi hộp, tập trung, nhẹ | tươi vui, buồn |
| MAU-28 Trắng & tím công nghệ | tập trung, nhẹ, tươi vui | buồn, hồi hộp |
| MAU-29 Trắng xám & màu chức năng | tập trung, nhẹ, trầm, nghiêm | buồn |
| MAU-30 Đất nung & kem | tươi vui, tập trung, nhẹ, hùng tráng | buồn |
| MAU-31 Navy & cam bàn thao tác | tươi vui, tập trung, nhẹ | buồn, hồi hộp |
| MAU-32 Màu Vietcombank | tập trung, nhẹ, trầm, nghiêm, hồi hộp | buồn |
| MAU-33 Màu BIDV | tập trung, nhẹ, tươi vui | buồn |
| MAU-34 Màu Agribank | tập trung, nhẹ, tươi vui | buồn |
| MAU-35 Màu VietinBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-36 Màu MB | tập trung, nhẹ, trầm, nghiêm, hồi hộp | buồn |
| MAU-37 Màu Techcombank | tập trung, nhẹ, tươi vui | buồn |
| MAU-38 Màu VPBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-39 Màu ACB | tập trung, nhẹ, trầm, nghiêm, hồi hộp | buồn |
| MAU-40 Màu TPBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-41 Màu Sacombank | tập trung, nhẹ, tươi vui | buồn |
| MAU-42 Màu LPBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-43 Màu SeABank | tập trung, nhẹ, tươi vui | buồn |
| MAU-44 Màu HDBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-45 Màu VIB | tập trung, nhẹ, tươi vui | buồn |
| MAU-46 Màu SHB | tập trung, nhẹ, tươi vui | buồn |
| MAU-47 Màu OCB | tập trung, nhẹ, tươi vui | buồn |
| MAU-48 Màu MSB | tập trung, nhẹ, tươi vui | buồn |
| MAU-49 Màu Eximbank | tập trung, nhẹ, tươi vui | buồn |
| MAU-50 Màu Nam A Bank | tập trung, nhẹ, tươi vui | buồn |
| MAU-51 Màu Bac A Bank | tập trung, nhẹ, tươi vui | buồn |
| MAU-52 Màu ABBANK | tập trung, nhẹ, tươi vui | buồn |
| MAU-53 Màu PVcomBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-54 Màu Kienlongbank | tập trung, nhẹ, tươi vui | buồn |
| MAU-55 Màu NCB | tập trung, nhẹ, tươi vui | buồn |
| MAU-56 Màu VietABank | tập trung, nhẹ, tươi vui | buồn |
| MAU-57 Màu BVBank | tập trung, nhẹ, trầm, nghiêm, hồi hộp | buồn |
| MAU-58 Màu Saigonbank | tập trung, nhẹ, tươi vui | buồn |
| MAU-59 Màu PGBank | tập trung, nhẹ, trầm, nghiêm, hồi hộp | buồn |
| MAU-60 Màu BAOVIET Bank | tập trung, nhẹ, tươi vui | buồn |
| MAU-61 Màu Vietbank | tập trung, nhẹ, tươi vui | buồn |
| MAU-62 Màu SCB | tập trung, nhẹ, trầm, nghiêm, hồi hộp | buồn |
| MAU-63 Màu Vikki Bank | tập trung, nhẹ, tươi vui | buồn |
| MAU-64 Màu MBV | tập trung, nhẹ, tươi vui | buồn |
| MAU-65 Màu VCBNeo | tập trung, nhẹ, tươi vui | buồn |
| MAU-66 Màu GPBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-67 Màu Co-opBank | tập trung, nhẹ, tươi vui | buồn |
| MAU-68 Màu Ngân hàng Chính sách xã hội | tập trung, nhẹ, tươi vui | buồn |
| MAU-69 Màu Ngân hàng Phát triển Việt Nam | tập trung, nhẹ, trầm, nghiêm, hồi hộp | buồn |

Bài bị loại: NH02 đã nghe thấy rè; NH04 có thể có giọng hát; NH14 có thể có giọng hát; NH18 rè nặng (13.6 / 9.7 dB); NH21 rè nặng (6.1 / 12.3 dB); NH24 rè nặng (9.5 / 7.5 dB); NH25 đã nghe thấy rè; NH28 rè nặng (7.9 / 9.0 dB); NH32 rè nặng (8.0 / 9.3 dB); NH33 rè nặng (15.2 / 17.2 dB); NH34 rè nặng (22.9 / 11.0 dB); NH35 rè nặng (19.1 / 25.5 dB); NH36 rè nặng (7.6 / 14.0 dB); NH38 rè nặng (11.1 / 9.4 dB); NH39 rè nặng (7.1 / 10.0 dB); NH40 rè nặng (7.9 / 18.6 dB); NH41 rè nặng (7.8 / 11.6 dB); NH43 rè nặng (12.4 / 29.0 dB); NH45 rè nặng (8.6 / 20.6 dB); NH47 rè nặng (7.1 / 6.2 dB); NH48 rè nặng (7.3 / 17.2 dB); NH49 rè nặng (12.6 / 15.9 dB); NH51 rè nặng (12.1 / 23.1 dB); NH52 rè nặng (10.9 / 13.6 dB); NH55 rè nặng (13.1 / 15.0 dB); NH56 rè nặng (15.6 / 20.5 dB); NH59 rè nặng (9.3 / 6.8 dB); NH60 rè nặng (16.5 / 13.7 dB); NH64 rè nặng (20.6 / 16.8 dB); NH65 rè nặng (33.7 / 20.3 dB); NH66 rè nặng (33.2 / 37.8 dB); NH68 rè nặng (18.3 / 22.1 dB); NH70 rè nặng (5.9 / 24.9 dB); NH71 có thể có giọng hát; NH72 có thể có giọng hát; NH73 rè nặng (7.7 / 12.4 dB); NH74 rè nặng (14.9 / 15.1 dB); NH75 rè nặng (13.0 / 13.4 dB); NH76 rè nặng (22.6 / 14.0 dB); NH77 rè nặng (10.8 / 12.8 dB).

## Luật loại trừ

- `{"bo_cuc": "BC-07", "chat_lieu": ["CL-06", "CL-07"], "muc_chi_tiet": "CT3"}` → loại. Chia đôi khung với hai mô hình 3D chi tiết kỹ thuật thì mỗi nửa quá nhỏ để thấy chi tiết
- `{"bo_cuc": "BC-13", "mau_nen": "toi"}` → loại. Bảng trắng toàn khung cần nền sáng; nền tối làm mất hình bảng trắng
- `{"chat_lieu": "CL-10", "mau_nen": "toi"}` → loại. Nét vẽ tay trên giấy hoặc bảng trắng chỉ đọc được trên nền sáng
- Ngoài ra: chất liệu, bố cục phải đúng khổ; mức chi tiết, bố cục, màu phải nằm trong danh sách đi kèm chất liệu; ô K của ma trận màu × nhạc; thẻ D gốc chấm "Không nên" với lối viết ở Bảng 3; khi lọc bằng `--cach-lam`, chất liệu không làm được bằng cách đó (hoặc cách đó không làm được khổ) bị bỏ.

## Luật cộng, trừ điểm

- `{"chat_lieu": "CL-07", "muc_chi_tiet": "CT3", "chu_de": "may_moc"}` → +1.5. Trung chốt 26/10/2026: D-09b là đề xuất đầu tiên cho video máy móc
- `{"mau_nen": "toi", "chat_lieu": "CL-07"}` → -1. Thẻ D-09b chỉ cho nền tối khi Trung chọn rõ (phụ lục D-09b)
- `{"gap": true, "muc_chi_tiet": "CT3"}` → -2. Cần video gấp mà mức chi tiết kỹ thuật tốn trọn ngày máy chạy
- `{"gap": true, "chat_lieu": "CL-08"}` → -2. Cần video gấp mà Blender Cycles mất nhiều giờ kết xuất

Điểm còn gồm: độ hợp với lối viết theo Bảng 3 (Rất hợp 3, Hợp 2, Cân nhắc 1); độ hợp chất liệu và bố cục với loại chủ đề; màu hợp lĩnh vực +1; chưa có mã dựng −2 (chất liệu không có cách làm nào ở mức sẵn; khi lọc `--cach-lam` thì xét riêng cách đó); màu đã duyệt +0,5; tổ hợp ghép mới chưa dựng thật −0,3 (chỉ cho tổ hợp toàn giá trị cũ); trừ theo số lần mỗi trục đã dùng ở 3 video gần nhất cùng khổ. Cách làm đề xuất không cộng, trừ điểm riêng: chỉ in kèm. Tổ hợp chứa một giá trị học từ repo mẫu (gia_tri_moi) không vào bảng xếp hạng và không bị trừ điểm nào; script in mục "Lựa chọn mới, chưa chấm điểm" liệt kê mỗi chất liệu mới một mục (cách làm, thời gian máy, mẫu nguồn, một bố cục, hai màu hợp nhất theo danh sách đi kèm), chỉ áp luật loại trừ cứng; Claude đánh giá theo nội dung và tính chất video.

