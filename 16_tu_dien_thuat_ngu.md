# 16 — Từ điển thuật ngữ

> **Phiên bản:** 1.4 · **Cập nhật:** 2026-11-01 · Thêm bảng i (thuật ngữ của tài liệu học nhập môn đồ hoạ, chương 1–9) và 10 dòng tra ngược; nguồn: `san_pham/2026.11.01.tai_lieu_nhap_mon_do_hoa/`.
> **Phiên bản:** 1.3 · **Cập nhật:** 2026-10-27 · Thêm bảng h (thủ pháp dựng bằng mã, hậu kỳ, đo âm thanh: stagger, bloom, độ sâu trường ảnh, nhoè chuyển động, khung phụ, shader, raymarching, parallax, seek(t), đồng hồ ảo, LUFS, sa bàn đẳng cự); dòng Easing ở bảng c ghi thêm mã thủ pháp; chỗ nhắc ElevenLabs bỏ theo quyết định 27/10/2026.
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-10-27 · đổi tên từ `11_tu_dien_thuat_ngu.md` khi dựng lại luồng Media (nội dung giữ nguyên; tên module trỏ chéo sửa theo `_bang_chuyen_module_2026.10.27.md`; chỗ lỗi thời đã nêu trong bản đồ quy trình được sửa bằng chữ).
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-26 · Mục "Render": lệnh đúng là `npx remotion render`. **1.0** · 2026-07-28

## Dùng khi nào

Hai tình huống: (1) Claude buột ra một từ lạ trong lúc trao đổi, và Trung muốn biết nó nghĩa là gì — tra thẳng ở **Phần chính**; (2) Trung có một ý trong đầu nhưng không biết gọi tên sao, kiểu "cái đoạn chữ nó chạy chạy theo giọng đọc ấy, gọi là gì?" — tra ở **Phần tra ngược**.

Không cần thuộc gì cả. Đây là project mà bên đặt hàng (Trung) không cần rành nghề — cứ mô tả bằng lời thường, tự nhiên nhất có thể, kể cả nói vòng vo hay chỉ đúng một nửa ý. Nhiệm vụ hỏi lại cho rõ là của Claude, không phải của Trung (xem `02_lam_ro_yeu_cau.md`). Từ điển này chỉ để tra cứu nhanh khi Trung *muốn* biết tên gọi, không phải điều kiện bắt buộc trước khi giao việc.

## Phần chính — bảng thuật ngữ theo chủ đề

### a. Khung hình và bố cục

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong video |
|---|---|---|---|
| Aspect ratio | Tỷ lệ khung hình | Tỷ lệ chiều ngang so với chiều dọc của màn hình video. | Video ngắn của mình luôn là khung dọc, không phải khung ngang như TV. |
| Vertical / Portrait | Khung dọc | Màn hình cao hơn rộng — kiểu cầm điện thoại đứng thẳng lên xem. | Toàn bộ video GĐ1 dựng khung dọc, vì xem trên điện thoại là chính (Zalo, TikTok, Reels). |
| Resolution | Độ phân giải | Số điểm ảnh (pixel) tạo nên khung hình — số càng lớn hình càng nét, cũng là kích thước khung tính bằng pixel. | Khuôn cố định của mình là 1080×1920: rộng 1080, cao 1920 điểm ảnh. |
| Safe area | Vùng an toàn | Vùng ở giữa khung hình chắc chắn không bị nút bấm hay logo của app (TikTok, Zalo) che mất khi đăng lên. | Chữ tiêu đề và phụ đề phải nằm trong vùng an toàn, không dán sát mép trên hay mép dưới. |
| Padding / Breathing room | Khoảng thở | Khoảng trống quanh chữ hoặc hình, để mắt người xem không bị dồn ép, đọc thoải mái hơn. | Dòng phụ đề cần khoảng thở hai bên, không kéo sát hết chiều ngang màn hình. |
| Layout | Bố cục | Cách sắp chữ, hình, biểu tượng trong một khung hình — cái gì ở đâu. | Cảnh "Điểm nhấn" dùng bố cục: số liệu to ở giữa, chữ giải thích nhỏ bên dưới. |

### b. Thời gian và nhịp

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong video |
|---|---|---|---|
| FPS (frames per second) | Số hình mỗi giây | Video thật ra là nhiều tấm hình tĩnh chiếu liên tiếp thật nhanh, tạo cảm giác chuyển động. Số này càng cao càng mượt. | Khuôn của mình cố định 30 hình mỗi giây. |
| Pacing | Nhịp cắt / nhịp video | Video chuyển cảnh nhanh hay chậm, dồn dập hay thong thả — cảm giác chung về tốc độ. | Chặng "Mở đầu gây chú ý" cần nhịp nhanh để giữ chân người xem; chặng "Giải thích" chậm lại một chút. |
| Transition | Chuyển cảnh | Cách một cảnh kết thúc và cảnh sau bắt đầu — có thể cắt phựt một cái, hoặc mờ dần sang cảnh mới. | Giữa cảnh "Điểm nhấn" và "Luồng ý kiến" dùng chuyển cảnh mờ dần cho mượt, không cắt giật. |
| Scene duration | Độ dài cảnh | Mỗi khối cảnh (trong các cảnh của video) kéo dài bao lâu, tính bằng giây. | Kịch bản 90 giây chia cho 7 cảnh (số cảnh thực tế 5–9), mỗi cảnh trung bình 10-15 giây tùy nội dung. |
| Cut | Cắt cảnh | Chuyển cảnh kiểu dứt khoát, không có hiệu ứng chuyển tiếp — cảnh trước biến mất, cảnh sau hiện ngay. | Cắt cảnh dùng khi muốn tạo cảm giác bất ngờ, ví dụ vào chặng "Hệ quả". |
| Total runtime | Tổng thời lượng | Video dài bao nhiêu từ đầu đến cuối. | Kịch bản chuẩn của mình dài khoảng 90 giây khi đọc hết. |

### c. Chuyển động và hoạt họa

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong video |
|---|---|---|---|
| Animation | Hoạt họa | Nói chung về mọi thứ chuyển động trong khung hình — chữ bay vào, hình phóng to, biểu tượng nhún nhảy. | Toàn bộ 7 khối cảnh đều có hoạt họa riêng, không phải hình tĩnh. |
| Enter / Exit animation | Hiệu ứng vào / hiệu ứng ra | Cách một chữ hoặc hình xuất hiện lúc đầu cảnh, và cách nó biến mất lúc cuối cảnh. | Tiêu đề ở cảnh mở đầu có hiệu ứng vào là trượt từ dưới lên. |
| Zoom in / Zoom out | Phóng to / thu nhỏ | Hình hoặc chữ to dần lên (phóng to) hoặc nhỏ dần đi (thu nhỏ) trong lúc cảnh đang chạy. | Số liệu ở cảnh "Điểm nhấn" phóng to chậm rãi để nhấn mạnh, không bật ra đột ngột. |
| Slide | Trượt | Chữ hoặc hình di chuyển vào khung theo một hướng (từ trái, phải, trên, dưới) rồi dừng lại đúng chỗ. | Từng dòng phụ đề trượt lên từ dưới khung hình. |
| Blur | Làm mờ | Hình hoặc chữ mất nét dần, thường dùng lúc chuyển cảnh hoặc lúc một thứ sắp biến mất. | Chuyển từ cảnh này sang cảnh sau bằng cách làm mờ dần cảnh cũ rồi hiện rõ cảnh mới. |
| Easing | Đường cong chuyển động (đường tăng giảm tốc) | Quy luật tăng tốc — giảm tốc của một chuyển động, để nó trông tự nhiên chứ không đều đều máy móc. | Chữ phóng to không chạy đều tốc độ từ đầu đến cuối, mà nhanh lúc đầu, chậm dần lúc gần tới — đây là do đường cong chuyển động quyết định. Thủ pháp trong thư viện: TP-CD01 (lò xo giải tích), TP-CD02 (đường tăng giảm tốc chuẩn). |
| Bounce / Spring | Nhấn nảy | Kiểu chuyển động có một chút nảy lên xuống ở cuối, giống lò xo, tạo cảm giác sống động thay vì cứng nhắc. | Biểu tượng ở cảnh "Kêu gọi hành động" xuất hiện kèm nhấn nảy nhẹ để bắt mắt. |

### d. Chữ và phụ đề

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong video |
|---|---|---|---|
| Font | Phông chữ / kiểu chữ | Kiểu dáng của chữ cái — chữ trông vuông vắn, tròn trịa hay mảnh mai là do phông quyết định. | Phông chốt dùng là Be Vietnam Pro (dự phòng Helvetica Neue), vì hiển thị đúng dấu tiếng Việt; Segoe UI đã bỏ ngày 26/10/2026. |
| Font size | Cỡ chữ | Chữ to hay nhỏ, tính bằng đơn vị điểm ảnh (px). | Cỡ chữ nhỏ nhất trong khung không được dưới 32px, để đọc được trên điện thoại. |
| Font weight / Bold | Độ đậm chữ | Nét chữ dày hay mảnh — chữ đậm (bold) nổi bật hơn chữ thường. | Chữ trong khuôn của mình mặc định trắng đậm trên nền tối, để nổi bật và dễ đọc. |
| Line height | Giãn dòng | Khoảng cách giữa dòng chữ này với dòng chữ kế tiếp. | Dòng phụ đề cần giãn dòng đủ rộng để không dính chữ khi có hai dòng cùng lúc. |
| Caption / Word-by-word caption | Phụ đề chạy chữ | Phụ đề hiện lên theo đúng nhịp giọng đọc — từng cụm từ nổi lên đúng lúc giọng đọc tới đó, không phải cả câu hiện một lượt. | Đây là phần gần như bắt buộc trong khuôn của mình — thiếu nó video trông như slide có tiếng, xem `09_video_doc_ngan.md` mục 3. |
| Highlight word | Cụm từ nhấn | Trong lúc phụ đề chạy chữ, cụm đang được đọc tới thì đổi màu hoặc phóng to để người xem biết đang nghe tới đâu. | Từ khóa quan trọng trong câu tô màu nhấn khi giọng đọc tới đúng từ đó. |

### e. Âm thanh

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong video |
|---|---|---|---|
| TTS (Text-to-Speech) | Giọng đọc máy / giọng đọc tự động | Công nghệ biến chữ viết thành giọng nói, không cần người thật thu âm. | Project chỉ dùng VieNeu-TTS giọng Hải Đăng chạy trên máy (từ 27/10/2026) — xem `08_giong_am_thanh_phu_de.md`. Azure Speech (giọng HoaiMy, NamMinh) là phương án cũ. |
| WordBoundary / Word timestamp | Mốc thời gian từng từ | Thông tin do bộ giọng đọc trả về, cho biết mỗi từ được đọc ra vào đúng giây/mili-giây nào. | Mốc thời gian từng từ là thứ quyết định phụ đề chạy chữ có khớp nhịp giọng đọc hay không. |
| Background music / BGM | Nhạc nền | Nhạc chạy xuyên suốt phía sau giọng đọc, tạo không khí cho video. | Nhạc nền lấy từ Pixabay Audio, chọn theo 3-4 tâm trạng: nghiêm túc, tò mò, dồn dập, nhẹ nhàng. |
| Sound effect (SFX) | Hiệu ứng tiếng | Tiếng động ngắn chèn vào đúng lúc, không phải nhạc nền — ví dụ tiếng "tách" khi chữ xuất hiện. | Cảnh "Điểm nhấn" có thể chèn hiệu ứng tiếng ngắn lúc số liệu bật ra. |
| Ducking | Giảm nhạc khi có giọng | Kỹ thuật tự động hạ âm lượng nhạc nền xuống mỗi khi giọng đọc đang nói, để giọng đọc luôn nghe rõ. | Nhạc nền phải để nhỏ hơn giọng đọc rõ rệt — nhạc át giọng là lỗi thường gặp nhất, xem `08_giong_am_thanh_phu_de.md` mục 5. |

### f. Màu sắc

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong video |
|---|---|---|---|
| Color palette | Bảng màu | Một bộ vài màu cố định dùng xuyên suốt một video, để nhìn đồng bộ chứ không lộn xộn. | Việc còn phải làm là dựng 3-4 bảng màu đổi được bằng tham số, xem `09_video_doc_ngan.md` mục 6. |
| Accent color | Màu nhấn | Màu riêng dùng để làm nổi bật từ khóa hoặc số liệu quan trọng, khác với màu chữ thường. | Từ khóa trong câu tô màu nhấn, ví dụ vàng hoặc cam trên nền tối. |
| Contrast | Độ tương phản | Mức chênh lệch sáng-tối giữa chữ và nền — tương phản cao thì chữ nổi rõ, dễ đọc. | Chữ trắng đậm trên nền tối là để giữ độ tương phản cao, đọc được cả khi lướt nhanh trên điện thoại. |
| Dark background | Nền tối | Màu nền của khung hình là màu tối (đen, xám đậm...) thay vì nền sáng. | Khuôn mặc định của mình dùng nền tối, chữ trắng — đây là lựa chọn cố định trong thông số kỹ thuật. |

### g. Quy trình sản xuất

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong video |
|---|---|---|---|
| Draft render | Bản nháp | Bản render nhanh, chất lượng thấp hơn, để xem thử nhịp và bố cục trước khi chốt. | Bước kết xuất bản nháp của luồng chung (`01_quy_trinh_chung.md`): render bản nháp để Trung duyệt nhịp, xem bố cục trước khi làm bản cuối. |
| Final render | Bản cuối / bản chất lượng cao | Bản render sau cùng, chất lượng đầy đủ, dùng để giao thật. | Sau khi Trung duyệt bản nháp, mới render bản chất lượng cao ở bước 5. |
| Render | Kết xuất / render | Quá trình máy tính "nấu" mã dựng thành file video xem được. | Lệnh `npx remotion render <MaThanhPhan> out/<tên>.mp4 --codec=h264` chạy trong `xuong/` (video ngắn) hoặc `xuong_dai/<tên>/` (video ngang). `npm run build` chỉ đóng gói, không ra file video. |
| Scene template | Khuôn cảnh | Một khối cảnh dựng sẵn, nhận dữ liệu (chữ, màu) đầu vào — đổi dữ liệu là ra cảnh mới mà không phải dựng lại từ đầu. | Sáu chặng nội dung cố định thứ tự: Mở đầu gây chú ý, Giải thích, Điểm nhấn, Luồng ý kiến, Hệ quả, Kêu gọi hành động; một chặng được tách thành nhiều cảnh hình (`03_kich_ban_va_loi_viet.md` mục 4). |
| Parameter / Props | Tham số | Các giá trị đưa vào một khuôn cảnh để nó hiển thị đúng nội dung mong muốn — như điền vào chỗ trống. | Cùng một khuôn cảnh "Điểm nhấn", đổi tham số chữ và số liệu là ra một video hoàn toàn khác. |

### h. Thủ pháp dựng bằng mã, hậu kỳ và đo âm thanh (thêm 27/10/2026)

Từ hay gặp khi đọc thư viện thủ pháp `tai_san/thu_phap/` (`06_thu_phap_va_hieu_ung.md`) và cách làm HTML một trang LM-03 (`05_cach_lam.md`). Easing (đường tăng giảm tốc) đã có ở bảng c. Thủ pháp trong thư viện đều ở trạng thái nháp: chưa dựng lại để kiểm trên video Media.

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Ví dụ trong Media | Mã TP liên quan |
|---|---|---|---|---|
| Stagger | Hiện lệch nhịp | Nhiều phần tử cùng nhóm (ký tự, thẻ, hàng) vào lần lượt, mỗi phần tử trễ một khoảng cố định so với phần tử trước, không vào cùng một khung hình. | Luật lớp hoàn thiện HT-CH-02: nhóm phần tử vào lệch nhịp; kiểm bằng ba khung liên tiếp lúc nhóm đang vào, các phần tử phải ở trạng thái khác nhau. Mức đề xuất khi không có nhạc: trễ 60–150 mili giây cho thẻ và hàng, 20–40 mili giây cho ký tự (chưa thử trên video đã giao) | TP-CD03 |
| Bloom | Quầng sáng | Vùng sáng mờ nở rộng quanh vật đang phát sáng, làm vật trông như tự phát ra ánh sáng. Phong cách tối giản cao cấp không dùng. | Chưa có video Media đã giao dùng riêng quầng sáng; chỗ hợp là vật phát sáng trong cảnh 3D (chất liệu CL-12 hạt và ánh sáng, CL-13 sa bàn) | TP-HK05 |
| Depth of field | Độ sâu trường ảnh | Chỉ vật ở khoảng cách đã chọn thì nét, vật gần hơn và xa hơn bị nhoè, như ảnh chụp bằng ống kính khẩu độ lớn; đổi tiêu điểm là chuyển vùng nét từ vật này sang vật khác. | Blender Cycles (LM-05) tính thật độ sâu trường ảnh; số đo của cảnh thử D-11 buồng máy tua-bin gió: 13 giây máy mỗi khung, 412 khung mất 89 phút (bản chỉ đạo 27/10/2026). Three.js làm bằng nhoè hậu kỳ nhẹ hơn | TP-3D05 (điểm sáng nhoè: TP-HK06) |
| Motion blur | Nhoè chuyển động | Vật chuyển động nhanh để lại vệt mờ như ảnh chụp bằng tốc độ màn trập chậm, làm chuyển động mượt hơn; chữ và hình đứng yên vẫn nét. | Mẫu lịch sử AI 60 giây xuất 60 khung/giây có nhoè mất 23,3 phút máy, gấp khoảng 8 lần bản không nhoè (`05_cach_lam.md`, LM-03) | TP-HK04 |
| Subframe | Khung phụ | Khung hình chụp thêm ở những thời điểm rất sát khung chính; trộn nhiều khung phụ thành một khung xuất ra thì có nhoè chuyển động thật. | `xuong_html/cong_cu/xuat_nhoe.sh` chụp 8 khung phụ cho mỗi khung xuất rồi lấy 4 khung đầu trộn bằng `tmix` (mặc định, độ mở màn trập 180 độ) | TP-HK04 |
| Shader | Shader | Chương trình nhỏ chạy trên card đồ hoạ, tính màu từng điểm ảnh của khung hình; dùng để sinh hình bằng toán thay vì vẽ từng vật. | Chưa có video Media dùng shader riêng; chi phí máy nặng; hợp CL-12 (hạt và ánh sáng) và CL-14 (mô phỏng, bề mặt toán) | TP-3D15 |
| Raymarching | Dò tia từng bước | Cách vẽ hình 3D bằng shader: với mỗi điểm ảnh bắn một tia vào cảnh và tiến từng bước tới khi chạm bề mặt; cho bóng mềm, phản chiếu, sương có tia sáng, hình fractal (hình lặp lại ở mọi cỡ). | Cùng ví dụ với Shader; chưa dựng thật ở Media | TP-3D15 |
| Parallax | Thị sai, nền trôi nhiều lớp | Các lớp nền cuộn với tốc độ khác nhau (lớp xa chậm, lớp gần nhanh) để có chiều sâu mà không cần 3D; bản 2.5D tách lớp theo bản đồ độ sâu của ảnh. | Nền trôi chậm 2–6 điểm ảnh mỗi giây là cách giữ cảnh không đứng hình theo luật HT-CH-03 (không phần tử nào đứng yên quá 1,5 giây); mức đề xuất lớp xa 0,2–0,4 lần, lớp gần 1,0–1,6 lần tốc độ lớp giữa | TP-CD08 (2D), TP-3D16 (2.5D) |
| seek(t) | Đặt thời gian rồi vẽ | Quy ước của cách làm HTML một trang: trang có hàm `seek(t)` nhận thời điểm t (giây) và vẽ đúng khung hình tại t; mọi giá trị trên màn hình là hàm thuần của t, không hẹn giờ, không số ngẫu nhiên không cố định. Nhờ đó công cụ tua tới khung nào cũng ra đúng hình. | LM-03: `xuong_html/cong_cu/xuat_mp4.mjs` gọi trang theo từng khung rồi chụp | Không có mã TP riêng; là cách làm LM-03. TP-CD01 giữ giá trị là hàm thuần của thời gian |
| Virtual clock | Đồng hồ ảo | Đồng hồ do công cụ chụp điều khiển thay cho giờ thật của trình duyệt: mỗi khung công cụ đặt thời gian rồi chụp, nên kết quả không đổi dù máy chụp nhanh hay chậm. Thứ vẫn chạy theo giờ thật (thẻ `<video>` nhúng, Web Audio, Web Worker) thì đồng hồ ảo không điều khiển được. | LM-03, giới hạn ghi ở `05_cach_lam.md` | Không có mã TP riêng; là cách làm LM-03 |
| LUFS | LUFS (đơn vị độ to) | Đơn vị đo độ to nghe được của cả đoạn âm thanh theo chuẩn phát trực tuyến. Media đặt mức tích hợp −14 LUFS cho video, đo lại sau khi mã hoá AAC. | `xuong_html/cong_cu/ghep_am_thanh.sh` chuẩn −14 LUFS hai lượt rồi đo lại file ra (`08_giong_am_thanh_phu_de.md` mục 9) | TP-AT03 |
| Isometric diorama | Sa bàn đẳng cự | Cảnh 3D thu nhỏ kiểu mô hình đồ chơi, nhìn bằng phép chiếu đẳng cự (các cạnh song song không co lại theo xa gần, không có điểm tụ), máy quay đứng yên, đồ vật xuất hiện lần lượt trên nền. | Chất liệu CL-13 "3D sa bàn bằng mã" (`tai_san/so_tay_gu/he_truc_dung.md`); chưa dựng thật | TP-3D03 |

### i. Thuật ngữ của tài liệu nhập môn đồ hoạ (thêm 01/11/2026)

Từ do tài liệu học `san_pham/2026.11.01.tai_lieu_nhap_mon_do_hoa/` giới thiệu, mỗi từ có hình đúng/sai và phần thử tay ở chương ghi ở cột cuối. Bản đầy đủ có ô tìm: chương 10, mục 10.7 của tài liệu. Từ đã có ở bảng a–h không lặp lại.

| Từ hay gặp | Cách gọi trong project | Giải thích ngắn | Chương tài liệu |
|---|---|---|---|
| Visual hierarchy | Thứ bậc thị giác | Thứ tự người xem nhìn thấy các phần tử, quyết định bởi kích thước, độ đậm, tương phản, màu, vị trí. | 1. Bố cục |
| Focal point | Điểm nhấn chính | Phần tử duy nhất trên khung mà mắt nhìn thấy đầu tiên. | 1. Bố cục |
| Squint test | Kiểm nheo mắt | Làm mờ khung hình để xem vùng nào còn nổi, so với điểm nhấn đã định. | 1. Bố cục |
| Z-pattern, F-pattern | Mẫu quét chữ Z, chữ F | Đường mắt đi trên khung ít chữ (Z) và trang nhiều chữ (F). | 1. Bố cục |
| Gestalt principles | Luật nhóm Gestalt | Quy luật mắt gom phần tử thành nhóm: gần nhau, giống nhau, khép kín, liên tục. | 1. Bố cục |
| Grid, gutter | Lưới, khe cột | Bộ cột dọc chia đều vùng nội dung để đặt phần tử; khe cột là khoảng cố định giữa hai cột. | 1. Bố cục |
| Alignment | Căn lề | Nhiều phần tử dùng chung một mép; mỗi mép khác nhau tạo một đường căn dọc. | 1. Bố cục |
| White space | Khoảng trắng | Phần khung không có chữ hay hình, dù nền màu gì. | 1. Bố cục |
| Safe margin | Lề an toàn | Dải trống ở bốn mép khung, không phần tử chính nào lấn vào. | 1. Bố cục |
| Rule of thirds | Quy tắc một phần ba | Đặt vật chính trên đường hoặc giao điểm chia khung thành chín ô. | 1. Bố cục |
| Visual weight, balance | Trọng lượng thị giác, cân bằng | Mức một phần tử thu hút mắt; cân bằng là tổng trọng lượng hai nửa khung xấp xỉ nhau. | 1. Bố cục |
| Cognitive load, information density | Tải nhận thức, mật độ thông tin | Lượng thông tin người xem phải giữ cùng lúc; số ý và số khối trên một khung. | 1. Bố cục |
| Spatial / temporal contiguity | Kề nhau không gian / thời gian | Nhãn đặt sát vật nó chú thích; phần tử hiện đúng lúc lời đọc nhắc tới. | 1. Bố cục |
| Master layout | Bố cục mẫu | Khuôn cố định cho cả bộ slide hoặc cả loạt cảnh. | 1. Bố cục |
| Dynamic layout, placeholder | Bố cục động, giữ chỗ | Thứ bậc đổi theo lời đọc; ô tính sẵn cho phần tử sắp hiện để phần tử cũ không phải dịch. | 1. Bố cục |
| Serif / Sans-serif / Monospace / Script | Phông có chân / không chân / đơn cách / viết tay | Có nét ngang nhỏ ở đầu nét / nét đều không chân / mọi ký tự rộng bằng nhau / mô phỏng nét bút. | 2. Chữ |
| Type hierarchy | Thứ bậc chữ | Tiêu đề, thân, chú thích phân biệt bằng cỡ và độ đậm, tối đa ba bậc. | 2. Chữ |
| Line length | Độ dài dòng | Số ký tự trên một dòng, kể cả dấu cách. | 2. Chữ |
| Font pairing, font fallback | Ghép phông, phông thay thế | Chọn tối đa hai họ phông; máy lấy chữ thiếu từ phông khác nên một từ lẫn hai phông. | 2. Chữ |
| Unicode NFC / NFD | Dạng dựng sẵn / dạng tổ hợp | Chữ có dấu lưu thành một ký tự / chữ cái và dấu lưu thành ký tự riêng. | 2. Chữ |
| Tracking, kerning | Giãn chữ, chỉnh cặp chữ | Cộng trừ đều khoảng cách mọi chữ cái; chỉnh riêng cặp như VA, AY. | 2. Chữ |
| Text alignment, justify | Căn lề chữ, căn đều hai bên | Dòng thẳng ở mép trái, giữa, phải; căn đều giãn khoảng trắng giữa từ. | 2. Chữ |
| Tabular / proportional figures | Chữ số cùng bề rộng / theo tỷ lệ | Cột số thẳng hàng / chữ 1 hẹp hơn 0, hợp cho số trong câu. | 2. Chữ |
| Cap height | Chiều cao chữ hoa | Từ đỉnh tới chân chữ in hoa không dấu, dùng để đo cỡ chữ trên khung hình. | 2. Chữ |
| Semantic line break | Ngắt dòng theo cụm nghĩa | Xuống dòng ở ranh giới cụm có nghĩa, không ngắt khi hết bề rộng. | 2. Chữ |
| Overlay, gradient overlay | Lớp phủ, chuyển sắc một phía | Lớp tối mờ phủ lên ảnh để chữ đủ tương phản; lớp tối đậm ở phía có chữ, nhạt dần. | 2. Chữ |
| Large-scale text | Chữ lớn (theo WCAG) | Từ 18 pt (24 px), hoặc từ 14 pt đậm; được dùng ngưỡng 3:1. | 2. Chữ |
| Hue / Saturation / Lightness | Sắc độ / độ bão hoà / độ sáng (HSL) | Vị trí trên vòng màu / mức đậm của sắc độ / mức pha trắng đen theo mô hình HSL. | 3. Màu |
| Relative luminance, contrast ratio | Độ chói tương đối, tỷ lệ tương phản | Độ sáng mắt cảm nhận theo công thức WCAG; (L sáng + 0,05)/(L tối + 0,05), từ 1:1 tới 21:1. | 3. Màu |
| Non-text contrast | Tương phản phi văn bản | Cột, đường, biểu tượng mang nghĩa phải đạt từ 3:1 so với màu liền kề. | 3. Màu |
| Monochromatic / analogous / complementary / triadic | Phối đơn sắc / tương đồng / bổ túc / bộ ba | Một sắc độ / sắc độ cạnh nhau / hai sắc độ đối nhau / ba sắc độ cách đều 120°. | 3. Màu |
| Categorical / sequential / diverging palette | Bảng màu phân loại / tuần tự / phân kỳ | Nhóm không thứ tự / dữ liệu có thứ tự, nhạt tới đậm / hai phía quanh một điểm giữa. | 3. Màu |
| Color vision deficiency | Thiếu hụt nhận màu (protan, deutan, tritan) | Mù màu theo loại tế bào cảm màu bị thiếu: đỏ, lục, lam. | 3. Màu |
| Gradient, banding, dithering | Chuyển sắc, vằn màu, hạt nhiễu | Màu đổi dần; chuyển sắc hiện thành dải phẳng do ít mức màu hoặc nén; rải điểm để che bậc. | 3. Màu |
| Color matching | Đồng điệu màu | Chỉnh nhiều ảnh cho độ sáng, độ tươi gần nhau mà giữ màu gốc từng ảnh. | 3. Màu |
| Color roles | Màu theo vai | Đặt tên màu theo việc nó làm (nền, chữ, nhấn), mọi phần tử gọi vai thay vì mã màu. | 3. Màu |
| Raster / Vector, SVG | Ảnh điểm / ảnh vector | Lưới điểm ảnh cố định, phóng to thì vỡ / lưu bằng lệnh vẽ, phóng cỡ nào cũng sắc. | 4. Hình ảnh, biểu đồ |
| Pixel density, ppi | Mật độ điểm ảnh | Số điểm ảnh trên mỗi inch khi in hoặc hiển thị. | 4. Hình ảnh, biểu đồ |
| Icon set, stroke width, corner radius | Bộ biểu tượng, độ dày nét, góc bo | Các biểu tượng cùng nét, cùng góc bo, cùng kiểu tô. | 4. Hình ảnh, biểu đồ |
| Crop, lead room | Cắt ảnh, khoảng trống hướng nhìn | Bỏ phần ngoài ảnh; chừa nhiều chỗ hơn ở phía người hoặc vật đang nhìn. | 4. Hình ảnh, biểu đồ |
| Reframe | Dựng lại bố cục | Xếp lại phần tử cho tỷ lệ khung mới thay vì cắt. | 4. Hình ảnh, biểu đồ |
| Lossy / lossless, compression artifact | Nén mất / không mất dữ liệu, nhiễu nén | JPEG bỏ chi tiết, PNG giữ đúng từng điểm; chấm bẩn, ô vuông lộ ra do nén. | 4. Hình ảnh, biểu đồ |
| Truncated axis | Trục cắt | Trục giá trị không bắt đầu từ 0, làm chênh lệch trông lớn hơn thật. | 4. Hình ảnh, biểu đồ |
| Legend / direct label | Chú giải rời / nhãn trực tiếp | Hộp ghi màu nào là gì / tên đặt ngay cạnh đường hoặc cột. | 4. Hình ảnh, biểu đồ |
| Histogram, scatter plot, 100% stacked bar | Biểu đồ tần suất, biểu đồ chấm, cột chồng 100% | Đếm theo khoảng giá trị; hai đại lượng trên hai trục; một thanh chia theo tỷ trọng. | 4. Hình ảnh, biểu đồ |
| Key / fill / rim light | Đèn chính / đèn phụ / đèn viền | Đèn mạnh nhất quyết định hướng sáng / đèn yếu giữ chi tiết vùng tối / đèn sau vật tạo viền sáng tách vật khỏi nền. | 5. Ánh sáng |
| Three-point lighting, lighting ratio | Ánh sáng ba điểm, tỷ lệ ánh sáng | Cách đặt ba đèn chính, phụ, viền; (chính + phụ) : phụ. | 5. Ánh sáng |
| Hard / soft light, penumbra | Ánh sáng cứng / mềm, vùng nửa tối | Nguồn nhỏ hay lớn so với vật quyết định mép bóng sắc hay nhoè. | 5. Ánh sáng |
| Cast shadow, contact shadow | Bóng đổ, bóng tiếp xúc | Vùng tối vật in lên sàn; dải tối hẹp chỗ vật chạm sàn, thiếu nó thì vật lơ lửng. | 5. Ánh sáng |
| Ambient occlusion | Che khuất ánh sáng môi trường | Bóng ở khe và góc trong cảnh 3D. | 5. Ánh sáng |
| Color temperature, white balance | Nhiệt độ màu, cân bằng trắng | Màu của ánh sáng trắng tính bằng Kelvin; chỉnh để vật trắng ra trắng. | 5. Ánh sáng |
| HDRI | Ảnh môi trường | Ảnh 360° lưu độ sáng thật, dùng chiếu sáng và cho vật phản chiếu. | 5. Ánh sáng |
| Fresnel effect, emissive | Hiệu ứng Fresnel, vật phát sáng | Mặt bóng phản chiếu mạnh hơn khi nhìn nghiêng; vật liệu tự có độ sáng. | 5. Ánh sáng |
| Golden hour, silhouette | Giờ vàng, bóng đen hình dáng | Lúc mặt trời thấp; vật tối trên nền sáng khi sáng từ sau. | 5. Ánh sáng |
| Polygon mesh, vertex, face, normal | Lưới đa giác, đỉnh, mặt, pháp tuyến | Mô hình lưu bằng đỉnh, cạnh, mặt; pháp tuyến là hướng vuông góc bề mặt. | 6. 3D cơ bản |
| Flat / smooth shading | Tô phẳng / tô mượt | Mỗi mặt một độ sáng / nội suy cho mặt cong trông tròn. | 6. 3D cơ bản |
| PBR: base color, roughness, metalness | Kết xuất theo vật lý: màu gốc, độ nhám, kim loại | Vật liệu mô tả bằng tính chất bề mặt; nhám 0 là gương, kim loại 1 là kim loại trần. | 6. 3D cơ bản |
| Focal length, field of view | Tiêu cự, góc nhìn | Tiêu cự quyết định phần cảnh lọt vào khung, quy ước theo cảm biến 36 mm. | 6. 3D cơ bản |
| Perspective distortion, dolly zoom | Méo phối cảnh, đẩy máy kèm đổi tiêu cự | Phần gần máy phình to khi đứng sát; lùi máy và tăng tiêu cự cùng lúc, vật giữ cỡ. | 6. 3D cơ bản |
| Perspective / orthographic projection, vanishing point | Phép chiếu phối cảnh / song song, điểm tụ | Có xa gần / vật giữ cỡ bất kể khoảng cách; điểm các đường song song chạy về. | 6. 3D cơ bản |
| Camera angle | Góc máy | Ngang tầm mắt, từ trên xuống, từ dưới lên. | 6. 3D cơ bản |
| Focus distance, f-stop, rack focus | Khoảng cách lấy nét, khẩu độ, đổi tiêu điểm | Vùng nét ở đâu; số f nhỏ cho nhoè mạnh; chuyển vùng nét giữa hai vật. | 6. 3D cơ bản |
| Rasterization / path tracing, sample | Kết xuất thời gian thực / dò tia, mẫu | Tô tam giác nhanh (Three.js) / bắn nhiều tia mỗi điểm ảnh (Blender Cycles); ít mẫu thì ảnh lấm tấm. | 6. 3D cơ bản |
| Cutaway, exploded view, layer separation, leader label | Mặt cắt, hình nổ, tách lớp, nhãn bám vật | Cắt bỏ một phần vỏ; bộ phận trượt ra theo hướng lắp; tầng tách theo một trục; nhãn có đường dẫn chạm bộ phận. | 6. 3D cơ bản |
| Ease-in / ease-out / ease-in-out / linear | Vào chậm / ra chậm / vào ra chậm / tuyến tính | Tăng tốc dần (vật rời khung) / giảm tốc tới đích (vật vào khung) / chậm hai đầu / tốc độ đều. | 7. Chuyển động |
| Anticipation, follow-through, overshoot, overlapping action | Chuẩn bị, theo đà, vượt đích, chồng nhịp | Động tác ngược chiều trước động tác chính; phần lỏng đi tiếp; đi quá đích rồi lùi; các phần dừng lệch nhau. | 7. Chuyển động |
| Micro-motion, hold | Vi chuyển động, dừng có chủ đích | Chuyển động rất nhỏ giữ cảnh không đứng hình; dừng hẳn trước câu kết. | 7. Chuyển động |
| Cross-fade, match cut, flood | Mờ dần, khớp bằng vật mang theo, khối màu tràn khung | Ba kiểu chuyển cảnh: chồng mờ; một vật giữ chỗ xuyên qua chuyển cảnh; khối màu tràn kín rồi co lại. | 7. Chuyển động |
| Virtual camera: push-in, punch-in, pan, orbit | Máy quay ảo: đẩy chậm, phóng tới vật, trượt, quỹ đạo | Phóng 1,00 lên 1,03–1,07 suốt cảnh; phóng nhanh cho vật chiếm nửa khung; dịch ngang dọc; đi vòng quanh vật. | 7. Chuyển động |
| Mask reveal, counter | Mặt nạ trượt, bộ đếm | Chữ trồi lên trong ô cắt đúng dòng chữ; số chạy từ giá trị cũ tới mới. | 7. Chuyển động |
| Animated on twos | Một nhịp hai khung | Đổi tư thế sau mỗi 2 hình ở 24 hình/giây. | 7. Chuyển động |
| dBFS, sample peak, true peak | dB so với mức tối đa, đỉnh mẫu, đỉnh thật | 0 là mức lớn nhất file chứa được; mẫu cao nhất; đỉnh của đường sóng liền khi phát (dBTP), có thể cao hơn đỉnh mẫu. | 8. Âm thanh |
| Integrated / short-term loudness, LRA | Độ lớn tích hợp / ngắn hạn, biên độ độ lớn | Độ to trung bình cả video; trong cửa sổ 3 giây; chênh giữa đoạn to và đoạn nhỏ (LU). | 8. Âm thanh |
| Clipping, distortion, hiss | Xén đỉnh, tiếng rè, tiếng xì | Tín hiệu vượt 0 bị cắt phẳng; tiếng lạo xạo; tiếng ồn đều ở dải cao. | 8. Âm thanh |
| Attack / release, sidechain compressor | Thời gian hạ / nâng, bộ nén điều khiển chéo | Nhạc xuống bao lâu khi giọng vào, lên lại bao lâu; giọng điều khiển bộ nén đặt trên nhạc. | 8. Âm thanh |
| Masking, EQ, spectrum | Che âm, bộ cân bằng tần số, phổ | Hai âm cùng dải tần tai không tách được; tăng giảm từng dải tần; năng lượng theo tần số. | 8. Âm thanh |
| Beat, bar, BPM | Phách, ô nhịp, số phách mỗi phút | Một phách dài 60 ÷ BPM giây; bốn phách là một ô nhịp. | 8. Âm thanh |
| Speech rate, intentional silence | Tốc độ nói, khoảng lặng có chủ đích | Số âm tiết mỗi giây trên phần có tiếng (Media 5,06); tắt một lớp tiếng trước hoặc sau ý quan trọng. | 8. Âm thanh |
| Storyboard, beat map | Bảng phân cảnh, bản đồ nhịp | Bảng kế hoạch từng cảnh trước khi dựng; danh sách trạng thái trên lưới thời gian theo mốc câu đọc. | 9. Nhịp dựng |
| Visual storytelling | Kể chuyện bằng hình | Hình mang phần thông tin lời không nói, không chép lại lời. | 9. Nhịp dựng |
| Hook, open loop | Câu mở 3 giây, câu hỏi treo | Câu đầu nói thẳng điều người xem sẽ biết; câu hỏi nêu ra chưa trả lời ngay. | 9. Nhịp dựng |
| Motif, pattern interrupt | Mô-típ lặp, điểm ngắt nhịp | Vật xuất hiện lại ở mọi cảnh; thay đổi khác hẳn (đổi nền) báo sang phần mới. | 9. Nhịp dựng |
| Progress bar, pacing curve | Thước tiến độ, đường cong nhịp | Thanh ở chân khung dài ra theo thời gian; số lần đổi hình mỗi phút theo thời gian. | 9. Nhịp dựng |
| Call to action | Lời kêu gọi | Việc người xem nên làm sau khi xem. | 9. Nhịp dựng |

## Phần tra ngược — muốn nói điều này thì gọi là gì

| Trung diễn đạt bằng lời thường | Tên gọi chuẩn |
|---|---|
| Chữ hiện lên từng chữ/cụm theo giọng đọc | Phụ đề chạy chữ (kèm mốc thời gian từng từ) |
| Cho hình/chữ to dần lên chậm chậm | Phóng to (zoom in), có đường cong chuyển động |
| Cảnh này chuyển sang cảnh kia mượt, đừng giật | Chuyển cảnh mờ dần (fade transition), không dùng cắt cảnh (cut) |
| Cảnh này chuyển sang cảnh kia, cắt cái rụp luôn cho gây chú ý | Cắt cảnh (cut) |
| Chữ/hình bay vào từ bên nào đó rồi dừng lại | Trượt (slide) — kèm hướng: từ trái/phải/trên/dưới |
| Cho nó nảy nảy một cái cho vui mắt, đừng cứng ngắc | Nhấn nảy (bounce/spring) |
| Video quay dọc, xem trên điện thoại | Khung dọc, tỷ lệ khung hình 1080×1920 |
| Đừng để chữ sát mép, lỡ bị nút của TikTok/Zalo che | Đặt trong vùng an toàn |
| Chữ nhìn chật chội quá, cho thoáng ra | Thêm khoảng thở |
| Chữ nhỏ quá đọc không ra trên điện thoại | Tăng cỡ chữ, không dưới 32px |
| Chữ dính sát dòng nhau khó đọc | Tăng giãn dòng |
| Cái từ quan trọng đó cho nó nổi bật lên lúc đọc tới | Cụm từ nhấn (đổi màu/phóng to đúng lúc phụ đề chạy chữ) |
| Video coi nhanh quá / chậm quá, chỉnh lại tốc độ | Chỉnh nhịp cắt (pacing) |
| Cảnh này dài quá/ngắn quá | Chỉnh độ dài cảnh |
| Giọng đọc nghe như máy đọc vô cảm quá | Cân nhắc đổi sang giọng VieNeu khác hoặc chỉnh khoảng nghỉ giữa câu và cách chia câu (`08_giong_am_thanh_phu_de.md` mục 0, 6); đổi giọng thì nghe thử lại bảng phiên âm |
| Nhạc nền nghe to hơn cả giọng đọc | Lỗi thiếu giảm nhạc khi có giọng (ducking) — cần hạ âm nhạc nền |
| Cho xem thử trước bản nhanh, chưa cần đẹp | Render bản nháp |
| Ok rồi, làm bản đẹp cuối cùng đi | Render bản cuối / bản chất lượng cao |
| Cùng một kiểu cảnh, đổi chữ/số liệu ra video khác | Đổi tham số của khuôn cảnh có sẵn |
| Màu sắc video này với video kia phải giống nhau, đồng bộ | Dùng chung một bảng màu |
| Chữ/số liệu quan trọng cho tô màu khác hẳn | Dùng màu nhấn |
| Nền đen chữ trắng dễ đọc hơn | Nền tối, độ tương phản cao |
| Phim gồm 30 tấm hình một giây, càng mượt càng tốt | Số hình mỗi giây (fps), khuôn cố định 30 |
| Slide, video nhìn "chưa chuyên nghiệp" mà không biết vì sao | Soát theo chín lớp và ba bảng kiểm của tài liệu nhập môn (chương 0, chương 10) |
| Mắt không biết nhìn vào đâu trước | Thiếu điểm nhấn chính, thứ bậc thị giác chưa rõ |
| Chữ đặt trên ảnh khó đọc | Thêm lớp phủ hoặc dải nền sau chữ, đo tương phản |
| Dấu của chữ in hoa bị cắt, chạm dòng trên | Giãn dòng quá nhỏ hoặc khung chữ quá sát |
| Cột số trong bảng không thẳng hàng | Dùng chữ số cùng bề rộng, canh phải |
| Người mù màu không phân biệt được lãi lỗ | Không dùng đỏ–lục làm cách phân biệt duy nhất; thêm dấu, mũi tên, khác độ sáng |
| Vật 3D trông như lơ lửng | Thiếu bóng tiếp xúc |
| Hình bay vào cứng, máy móc | Chuyển động tuyến tính; dùng đường cong ra chậm |
| Mọi thứ hiện ra cùng lúc, rối | Dùng hiện lệch nhịp (stagger) |
| Video này to, video kia nhỏ | Lệch độ lớn tích hợp; chuẩn về −14 LUFS |

## Ghi chú

Gặp từ chưa có trong bảng này thì cứ hỏi thẳng, không cần tra trước — Claude sẽ giải thích và đề xuất bổ sung vào đây nếu từ đó đáng giữ lại. Thêm/sửa mục nào thì ghi vào `99_nhat_ky.md` kèm ngày.
