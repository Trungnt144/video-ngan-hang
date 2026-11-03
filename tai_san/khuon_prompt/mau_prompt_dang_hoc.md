# Mẫu prompt gốc đáng học

> Danh sách 25 prompt trong repo `yihui-dev/awesome-opus5-5-videos` đáng học nhất cho việc viết khuôn giao việc dựng hình bằng mã. Mỗi mục: slug, link GitHub, tác giả, vì sao tốt, cấu trúc, một trích ngắn (tối đa 20 chữ), và dùng để học gì.
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Chọn từ quét chữ 703 prompt (hai nửa A và B) và 100 mục đã chấm bằng hình, ngày 27/10/2026. Prompt và video thuộc tác giả: Media chỉ lưu link, tóm tắt và trích ngắn; chỉ học, không chép cảnh, logo, bố cục, nhạc. Video mẫu: `https://media.skillry.dev/opus-5-5/<slug>/original.mp4` (bản gốc), `remake.mp4` (bản làm lại của Skillry), không tải vào git.
> Tên tác giả lấy theo slug (trước dấu gạch cuối) hoặc trường `author` của bản chấm.

## Cách đọc

- **Prompt dài, có cấu trúc** (mục 1–8, 14, 19, 20, 22, 23): học cách viết khuôn.
- **Prompt rất ngắn mà kết quả tốt** (mục 15, 16, 17, 18, 25): chỉ học từ hình ra. Chất lượng đến từ model, không từ prompt: không dùng làm khuôn (cùng một câu ngắn cho kết quả không lặp lại được).
- Số ký tự đếm trên văn bản prompt trong dữ liệu quét ngày 27/10/2026; một số prompt bị cắt giữa chừng trong dữ liệu. Nhóm (`3d`, `motion`, `explainer`, `interactive`) là nhãn của dữ liệu quét.

## Bảng tra nhanh

| Cần học | Mục |
|---|---|
| Khuôn spec nhiều khối, cửa duyệt, số cứng | `everestchris6-399895`, `0xnicc0-516612`, `annacher-433425`, `flxrnc-251921` |
| Người phản biện độc lập, thanh chất lượng | `everestchris6-399895`, `voxyz-ai-345550`, `0xkarmi-129839` |
| Âm thanh từ dữ liệu, đặt tiếng theo đỉnh | `apoorvjain25-945542`, `twoclipping-496100`, `notdwd-998633`, `okazaky-084783` |
| Chất liệu CL-09, CL-10, CL-11 | `ror-fly-880547`, `tak3sh8-441895`, `gdgtify-130294`, `techhalla-498547` |
| 3D bằng Three.js | `op7418-814408`, `mdaman010-111079`, `anirockshady-032809` |
| Video khoa học, mô phỏng thật | `astrothewizard-618782`, `anirockshady-032809` |
| Quy trình giao việc tự chủ | `astrothewizard-618782`, `thinkszyg-886066`, `pluvio9yte-662953`, `tanabe-fragm-706979` |

## 1. `everestchris6-399895`

- **Link:** [everestchris6-399895](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/everestchris6-399895.md)
- **Tác giả:** everestchris6 · 7.882 ký tự · nhóm `3d`
- **Vì sao tốt:** Prompt duy nhất có đủ ba thứ: người phản biện độc lập chưa thấy quá trình dựng, thanh chất lượng đo được (tối đa khoảng 1 giây đứng hình mỗi 30 giây, tương phản chữ 4,5:1, khung đầu hoàn chỉnh), và file dữ kiện là nguồn duy nhất cho số trên màn hình. Có phần phân tích video tham chiếu bằng số liệu trước khi lên kế hoạch.
- **Cấu trúc:** Khối `<role>`, `<brief>`, `<kit>`, `<setup>`, `<study_the_references>`, `<motion_principles>` (8 nguyên tắc), `<storyboard>`, `<build>`, `<3d>`, `<images_and_footage>`, `<audio>`, `<critic_loop>`, `<quality_bar>`.
- **Trích:** "the builder never judges its own work."
- **Dùng để học:** Nguồn chính của `khuon_phan_bien.md`, mục 9 và 10 của module 07, `khuon_canh_threejs.md` (ánh sáng ba điểm, nhãn là HTML).

## 2. `0xnicc0-516612`

- **Link:** [0xnicc0-516612](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/0xnicc0-516612.md)
- **Tác giả:** 0xnicc0 · 2.659 ký tự · nhóm `motion`
- **Vì sao tốt:** Một hình biến qua nhiều trạng thái trong một cú máy, 24 phách ở 120 BPM, mỗi phách một việc. Số cứng thay tính từ; có mục cấm; khung cuối bằng khung đầu; dặn hỏi lại ba đầu vào trước khi làm.
- **Cấu trúc:** `<inputs>` (hỏi: tên một chữ, màu nhấn, bài nhạc), `<direction>` (kèm `Banned:`), `<structure>` (chuỗi trạng thái bằng mũi tên), `<build>` (7 bước), `<gotchas>`.
- **Trích:** "Last frame = first frame."
- **Dùng để học:** Khuôn tổng quát cho LM-03; mẫu cho CL-09 và CL-16 (biến hình một vật).

## 3. `annacher-433425`

- **Link:** [annacher-433425](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/annacher-433425.md)
- **Tác giả:** annacher · 2.325 ký tự · nhóm `motion`
- **Vì sao tốt:** Cùng họ với `0xnicc0-516612` nhưng thiếu `<inputs>`, kèm yêu cầu duyệt trước khi viết mã. Chi tiết cơ học cụ thể: hai mép của chỉ báo tab chạy hai lò xo khác nhau nên mép dẫn đầu kéo dãn; kéo thả là thao tác trực tiếp.
- **Cấu trúc:** `<direction>`, `<structure>` (chuỗi trạng thái bằng mũi tên trên lưới 120 BPM, 7 ô nhịp), `<build>` (7 bước), `<gotchas>`, câu cuối là yêu cầu duyệt trước khi viết mã.
- **Trích:** "Show me the state list on the beat grid before writing any code."
- **Dùng để học:** Mẫu cho cửa duyệt storyboard (mục 4 module 07) và cho `<gotchas>`.

## 4. `flxrnc-251921`

- **Link:** [flxrnc-251921](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/flxrnc-251921.md)
- **Tác giả:** flxrnc · 1.973 ký tự · nhóm `motion`
- **Vì sao tốt:** Ngắn nhất trong nhóm spec mà đủ khối. Mọi thông số bằng số: giảm chấn 0,72 và ổn định 0,35 giây cho hình, giảm chấn 1,0 và 0,6 giây cho máy quay, lưới 0,5 giây, tốc độ con trỏ dưới 65 điểm ảnh mỗi khung. Dặn dùng mã hex, giây, hệ số giảm chấn, điểm ảnh thay tính từ.
- **Cấu trúc:** `<inputs>`, `<direction>`, `<structure>` (lưới 0,5 giây), `<build>` (hàm `renderAt(t)` thuần, `?t=` đóng băng), `<gotchas>`, `<start>`.
- **Trích:** "First show me the storyboard."
- **Dùng để học:** Nguồn số cho `<direction>` của khuôn LM-03; công thức vòng lặp `t - 14*floor(t/14)`.

## 5. `twoclipping-496100`

- **Link:** [twoclipping-496100](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/twoclipping-496100.md)
- **Tác giả:** twoclipping · 5.222 ký tự · nhóm `3d`
- **Vì sao tốt:** Phim ra mắt kiểu Apple, một cú máy 2D, 54 nhịp. Mỗi cảnh là biến hình của cảnh trước (khối đen tràn kín khung trong một nhịp rồi co thành cảnh sau), không mờ chéo. Đặt tiếng hiệu ứng theo đỉnh biên độ đo được.
- **Cấu trúc:** `<inputs>` (tên thương hiệu một chữ, 9–12 ảnh, bài khoảng 120 BPM có drop, clip tường có bóng cây), `<direction>`, `<structure>`, `<build>`…
- **Trích:** "An Apple-keynote launch film, 2D only, one continuous take."
- **Dùng để học:** Học chuyển cảnh bằng biến hình (CL-02, CL-16) và cách đặt tiếng theo đỉnh (`khuon_am_thanh_tu_du_lieu.md`). Độ khó 5, không dùng làm khuôn.

## 6. `notdwd-998633`

- **Link:** [notdwd-998633](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/notdwd-998633.md)
- **Tác giả:** notdwd · 4.205 ký tự · nhóm `motion`
- **Vì sao tốt:** Phim thương hiệu 55 giây bán một cảm giác và một ý, không bán tính năng. Chỉ tư liệu lưu trữ thật và trang web thật, không ảnh stock; một vật chủ đạo duy nhất có màu bão hoà. Giọng dẫn cao hơn nhạc 10–15 dB.
- **Cấu trúc:** `<inputs>` (thương hiệu, logo, một câu về năm năm sau, một từ tự đặt, clip lưu trữ, trang web cũ, bài nhạc, khoá giọng), `<direction>`, kết cấu phim (hạt, quầng, tối mép).
- **Trích:** "It sells one feeling and one idea, never features."
- **Dùng để học:** Học cách đặt một vật chủ đạo và quy tắc trộn giọng–nhạc (mục 5 của `khuon_am_thanh_tu_du_lieu.md`).

## 7. `techhalla-498547`

- **Link:** [techhalla-498547](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/techhalla-498547.md)
- **Tác giả:** techhalla · 3.878 ký tự · nhóm `motion`
- **Vì sao tốt:** Bumper nhận diện 20 giây với bảng màu chặt: bốn màu hex, không màu khác; ba hệ chữ có độ giãn chữ; lệch in magenta–xanh 2–4 điểm ảnh chỉ ở khung nhấn. Dặn hai ràng buộc cứng: đúng 20,00 giây, khung đầu bằng khung cuối.
- **Cấu trúc:** Dòng vai, rồi các mục chữ hoa: `DURATION`, `LOOPABLE`, `FORMAT`, `PALETTE (strict)`, chữ, lịch 20,00 giây theo từng khoảng, cấm.
- **Trích:** "frame 0 == frame last (position, opacity, cursor if any)"
- **Dùng để học:** Mẫu cho CL-11 (chữ động) và cho việc khoá bảng màu bằng mã hex.

## 8. `tanabe-fragm-706979`

- **Link:** [tanabe-fragm-706979](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/tanabe-fragm-706979.md)
- **Tác giả:** tanabe-fragm · 1.095 ký tự · nhóm `motion`
- **Vì sao tốt:** Quy trình bắt buộc theo thứ tự (chốt ý bằng một câu; tối đa 4 màu, 2 phông kèm lý do; bảng phân cảnh mỗi 0,5 giây; dựng; tự chấm) và "đường hợp cách" rất cụ thể: không chuyển động đều, chuyển động giữa cảnh chồng nhau, 0,3–0,5 giây gồng trước điểm nhấn, dừng ở khoảnh khắc nào cũng thành một ảnh đẹp.
- **Cấu trúc:** Tiêu đề: vai, sản phẩm, tiến hành (5 bước), cấu trúc theo giây, kỹ thuật bắt buộc (6), đường hợp cách, kết quả giao (file và bảng phân cảnh, giải thích tối đa 3 dòng). Tiếng Nhật.
- **Trích:** "等速の動きはゼロ。(Không có chuyển động đều tốc độ.)"
- **Dùng để học:** Nguồn của danh sách chấm trong `07_khuon_prompt_va_kiem_chat_luong.md`; mẫu cho mục "giao nộp" của khuôn.

## 9. `0xkarmi-129839`

- **Link:** [0xkarmi-129839](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/0xkarmi-129839.md)
- **Tác giả:** 0xkarmi · 1.383 ký tự · nhóm `motion`
- **Vì sao tốt:** Bài kể một dây chuyền: sân khấu cố định, động cơ không cửa sổ gọi `draw(f)` theo số khung, mã hoá, kiểm ba lượt. Có sáu mục kiểm có/không trước khi người xem (từ lỗi script tới chữ đè chữ) và kiểm điểm nối khung đầu với khung cuối. Tác giả nói mô hình chỉ viết phần vẽ, ba phần còn lại dùng lại.
- **Cấu trúc:** Không có thẻ khối; văn xuôi có bốn dòng STAGE, RENDER, ENCODE, CHECK.
- **Trích:** "Each picture depends on its number alone"
- **Dùng để học:** Cơ sở của hàm thuần của thời gian (khuôn LM-03) và của tự kiểm `window.kiemTra(t)`.

## 10. `voxyz-ai-345550`

- **Link:** [voxyz-ai-345550](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/voxyz-ai-345550.md)
- **Tác giả:** voxyz-ai · 935 ký tự · nhóm `explainer`
- **Vì sao tốt:** Bài đăng kể một quy trình: một prompt cho bản đầu, rồi ba vòng, mỗi vòng ba tác tử (hai người xem mỗi người chọn 9–10 lỗi xếp P0, P1, P2; một người sửa), sao lưu trước mỗi vòng, hoàn lại nếu không sửa được. Ghi chi phí: 5 giờ 28 phút, 90 USD theo giá API. Không phải prompt dựng video thuần (phòng thí nghiệm lỗ đen tương tác).
- **Cấu trúc:** Văn xuôi, liệt kê ba vòng và vai từng tác tử.
- **Trích:** "Every P0 got fixed, the rest only if worth it."
- **Dùng để học:** Cơ sở của mục 7 và 8 (vòng xem sửa, hạng P0–P2, sao lưu, bất đồng giữa hai người phản biện) và mức chi phí cao nhất.

## 11. `pluvio9yte-662953`

- **Link:** [pluvio9yte-662953](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/pluvio9yte-662953.md)
- **Tác giả:** pluvio9yte · 1.335 ký tự · nhóm `motion`
- **Vì sao tốt:** Công thức làm việc dạng bước: chọn tư liệu, tách tư liệu, định hạt và kiểu, tìm nhịp, biên bài, phản hồi ở khoảnh khắc then chốt. Quy tắc làm việc đáng chép: làm mẫu nhỏ trước, tham số chưa chắc thì xuất một dãy 5–6 mức đặt cạnh nhau để chọn, chỉnh đoạn nào dựng lại đoạn đó, bắt AI mở ảnh render xem rồi mới báo.
- **Cấu trúc:** Sáu bước đánh số, rồi mục "phương pháp làm việc xuyên suốt". Tiếng Trung. Lịch cảnh nằm trong một bảng riêng để đổi nhịp chỉ sửa một chỗ.
- **Trích:** "所有随机都固定"
- **Dùng để học:** Cơ sở của hạt giống cố định (`khuon_dung_html_mot_trang.md`) và của việc xuất dãy mức để Trung chọn.

## 12. `thinkszyg-886066`

- **Link:** [thinkszyg-886066](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/thinkszyg-886066.md)
- **Tác giả:** thinkszyg · 137 ký tự · nhóm `motion`
- **Vì sao tốt:** Bộ khung giao việc ngắn nhất mà đủ các cửa duyệt: ba khung phong cách, mẫu 10 giây, nhạc thử 30 giây rồi chờ chọn; chữ trên màn hình chỉ lấy từ bảng chữ đã đưa; chia chương cho tác tử con, mỗi người chỉ sửa file của mình; mỗi đoạn xuất tờ liên hệ và ảnh từng khung ở chỗ nối.
- **Cấu trúc:** Sáu mục đánh số. Tiếng Trung.
- **Trích:** "上屏文字只用我给的文案表 (Chữ trên màn hình chỉ dùng bảng chữ tôi đưa.)"
- **Dùng để học:** Cơ sở của quy tắc chia chương cho tác tử con và của file dữ kiện (module 07 mục 10 và 12).

## 13. `okazaky-084783`

- **Link:** [okazaky-084783](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/okazaky-084783.md)
- **Tác giả:** okazaky · 705 ký tự · nhóm `3d`
- **Vì sao tốt:** Dây chuyền 8 bước từ bài hát tới video: tạo bài, tách bè, chép lời và căn với lời chính thức để một dòng lời là một cảnh, viết storyboard, bốn tác tử con viết chương trình cảnh song song, xuất tờ liên hệ 16 khung, kết xuất, chuẩn âm lượng −14 LUFS. Phong cách chỉ ba màu.
- **Cấu trúc:** Một câu giao việc, tám bước đánh số, một dòng phong cách.
- **Trích:** "'1 lyric line = 1 scene'"
- **Dùng để học:** Mẫu ánh xạ mốc câu thành cảnh; tờ ghép khung 16 hình; chia việc song song.

## 14. `astrothewizard-618782`

- **Link:** [astrothewizard-618782](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/astrothewizard-618782.md)
- **Tác giả:** AstroTheWizard · 2.470 ký tự · nhóm `explainer`
- **Vì sao tốt:** Giao tự chủ trọn gói cho video giải thích 60 giây: chủ đề, phong cách, yêu cầu giao nộp (giọng đọc, phụ đề, nhạc theo cảnh, tiếng khớp hình, trộn chuẩn), và vòng kiểm tra. Đòi mô phỏng thật (bước ngẫu nhiên là bước ngẫu nhiên thật), số liệu thật và trung thực về độ bất định.
- **Cấu trúc:** Văn xuôi: chủ đề, phong cách, giao nộp (5 gạch đầu dòng), xây vòng kiểm, giao mã nguồn.
- **Trích:** "Don't hand me a first draft."
- **Dùng để học:** Mẫu giao việc cho CL-14; cách viết yêu cầu "độ chính xác khoa học" hợp video khoa học.

## 15. `anirockshady-032809`

- **Link:** [anirockshady-032809](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/anirockshady-032809.md)
- **Tác giả:** anirockshady · 278 ký tự · nhóm `3d`
- **Vì sao tốt:** Prompt ngắn cho bài giảng giảm dần độ dốc nhưng kết quả có bề mặt hàm số 3D tô màu theo độ cao, quả bóng lăn theo gradient thật, đồ thị mất mát nhỏ vẽ dần và so sánh ba tốc độ học. Học từ hình, không học từ prompt.
- **Cấu trúc:** Một đoạn văn xuôi, nêu bảng màu bằng tên (cam núi lửa, xanh lơ, xám).
- **Trích:** "ball reaching approximation from crest to trough"
- **Dùng để học:** Mẫu hình cho CL-14 (video đầu ra, không phải khuôn giao việc).

## 16. `mdaman010-111079`

- **Link:** [mdaman010-111079](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/mdaman010-111079.md)
- **Tác giả:** mdaman010 · 46 ký tự · nhóm `3d`
- **Vì sao tốt:** Prompt một câu, kết quả là 98 giây giải thích nhiều cảnh 3D: khoá màu theo chức năng có bảng chú giải, hạt chạy dọc ống theo chiều dòng, tiêu đề và số cảnh nhỏ ở góc dưới trái. Độ khó 5. Chứng tỏ model làm tốt khi chủ đề rõ; không đủ để học cách làm.
- **Cấu trúc:** Một câu.
- **Trích:** "Show me what goes on inside an AI data centre."
- **Dùng để học:** Mẫu hình cho CL-07 và CL-13 (đọc thủ pháp ở `huong_theo_chat_lieu.md`).

## 17. `ror-fly-880547`

- **Link:** [ror-fly-880547](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/ror-fly-880547.md)
- **Tác giả:** Ror_Fly · 367 ký tự · nhóm `explainer`
- **Vì sao tốt:** Mẫu hợp nhất của CL-09 (bàn thao tác): công thức cocktail từng bước, vật thể trung tâm lấp dần, thẻ số đo cỡ lớn, thanh 6 bước ở chân khung. Độ khó 1, tải máy nhẹ. Hai bản `sarut0bisasuke-069973` và `alex-prompter-997524` cùng họ.
- **Cấu trúc:** Một đoạn văn xuôi nêu thể loại (explainer), nội dung (nguyên liệu và lượng), độ dài (30 giây).
- **Trích:** "empty glass to completed cocktail"
- **Dùng để học:** Mẫu hình cho CL-09; đã chạy thử ở Media bằng LM-03 (bản chạy thử cocktail, 27/10/2026).

## 18. `tak3sh8-441895`

- **Link:** [tak3sh8-441895](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/tak3sh8-441895.md)
- **Tác giả:** tak3sh8 · 152 ký tự · nhóm `explainer`
- **Vì sao tốt:** Hai lượt: lượt 1 dựng hoạt hoạ bảng trắng vẽ tay, lượt 2 dựng bản MP4 có thuyết minh. Bản gốc dài 308 giây; cây bút hiển thị đi theo nét đang vẽ, tiêu đề viết tay mỗi cảnh, bảng tóm tắt cuối tô màu dần theo lời.
- **Cấu trúc:** Hai câu giao việc.
- **Trích:** "Prompt 2: build the mp4 version with narration"
- **Dùng để học:** Mẫu hình cho CL-10; cách tách lượt (xem trước, rồi mới thuyết minh).

## 19. `gdgtify-130294`

- **Link:** [gdgtify-130294](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/gdgtify-130294.md)
- **Tác giả:** gdgtify · 2.826 ký tự · nhóm `explainer`
- **Vì sao tốt:** Phim chữ 20 giây từ bài diễn văn tự soạn, không gán cho người thật; khoá lời nguyên văn (LOCKED COPY, EXACT DISPLAY TEXT); bảng màu bằng mã hex; chữ rõ nét, hạt chỉ làm không khí. Có ba bản anh em dùng cùng cấu trúc.
- **Cấu trúc:** Tiêu đề, mô tả ý đồ, giao nộp (một file HTML 1080×1080, 60 khung/giây), ART DIRECTION với mã hex, phần chữ khoá.
- **Trích:** "Treat this as an original miniature speech staged inside a typographic field."
- **Dùng để học:** Mẫu cho CL-11 và cho việc khoá lời nguyên văn (hợp video khoa học nơi chữ không được bịa).

## 20. `op7418-814408`

- **Link:** [op7418-814408](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/op7418-814408.md)
- **Tác giả:** op7418 · 2.528 ký tự · nhóm `interactive`
- **Vì sao tốt:** Mẫu xin hiệu ứng nhận thưởng của game, nhưng là mẫu tốt nhất về "lỗi đã gặp ghi thẳng": không dùng CSS 3D để lật vật lớn; viền hậu kỳ bằng pháp tuyến và độ sâu; ẩn các vật 3D khác khi hiện màn nền; ngưỡng độ sâu phải nới. Năm giai đoạn nhịp diễn bắt buộc. Tiếng Trung, có chỗ trống để điền.
- **Cấu trúc:** Mục 【世界观与风格】, 【主体物：做成真 3D】, 【演出节奏】 (5 giai đoạn), 【揭晓舞台】, 【光效】…
- **Trích:** "五个阶段，缺一不可 (Năm giai đoạn, thiếu một không được.)"
- **Dùng để học:** Nguồn của `khuon_canh_threejs.md` (viền hậu kỳ, vật liệu hoạt hình, ẩn vật khi hiện màn).

## 21. `apoorvjain25-945542`

- **Link:** [apoorvjain25-945542](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/apoorvjain25-945542.md)
- **Tác giả:** apoorvjain25 · 537 ký tự · nhóm `interactive`
- **Vì sao tốt:** Âm thanh và hình sinh từ cùng một dữ liệu: một script Node tổng hợp nhạc đọc đúng dữ liệu nảy của photon, nên mỗi lần nảy thấy là một tiếng click nghe. Dùng Remotion, không ảnh, không tư liệu.
- **Cấu trúc:** Một đoạn văn xuôi: chủ đề, số thật (170.000 năm, 8 phút 19 giây), công cụ, cách sinh nhạc.
- **Trích:** "every bounce you see is a click you hear"
- **Dùng để học:** Cơ sở của file sự kiện điều khiển cả hình và tiếng (`khuon_am_thanh_tu_du_lieu.md` mục 1).

## 22. `ik-builds-585923`

- **Link:** [ik-builds-585923](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/ik-builds-585923.md)
- **Tác giả:** ik-builds · 1.685 ký tự · nhóm `motion`
- **Vì sao tốt:** Mẫu có chỗ trống điền ({{PRODUCT}}, {{COLOR_CANVAS}}…) và hai mục RULES, CRAFT. Cấm: thanh tua, mã thời gian, thuật ngữ hoạt hình hiện trên màn hình; số bịa. Nêu −14 LUFS, −2 dBTP và đo lại sau mã hoá AAC. Kèm tiếng nền do mã tổng hợp, nguồn ghi sổ.
- **Cấu trúc:** Một câu giao việc, `COPY`, `RULES`, `CRAFT` (màu, phông, chuyển động, nhạc theo đoạn).
- **Trích:** "No invented results: no %, multipliers, customer names or figures."
- **Dùng để học:** Mẫu cho danh sách cấm cố định (module 07 mục 11) và ngưỡng âm lượng.

## 23. `egawa-ai-design-092323`

- **Link:** [egawa-ai-design-092323](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/egawa-ai-design-092323.md)
- **Tác giả:** egawa-ai-design · 725 ký tự · nhóm `motion`
- **Vì sao tốt:** Brief ngắn nhất cho LM-03 đúng như Media định làm: HTML + GSAP vẽ được tại mọi thời điểm bằng `seek(t)`, Playwright chụp từng khung, FFmpeg ghép, Python tổng hợp nhạc và tiếng khớp chỗ cắt, ảnh lấy từ thư mục. Cấu trúc năm ý đánh số và dòng tông.
- **Cấu trúc:** Yêu cầu kỹ thuật (5 gạch đầu dòng), Structure (5 ý), Tone.
- **Trích:** "Build with HTML + GSAP, allowing drawing at any time via seek(t)"
- **Dùng để học:** Mẫu rút gọn cho khuôn LM-03 khi video đơn giản.

## 24. `nft-chen-068069`

- **Link:** [nft-chen-068069](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/nft-chen-068069.md)
- **Tác giả:** nft-chen · 1.106 ký tự · nhóm `3d`
- **Vì sao tốt:** Bộ 15 mini-brief tiếng Trung: mỗi brief là thời lượng, phong cách có tên (bảng trắng, 3Blue1Brown, Kurzgesagt, truyện tranh chấm điểm, pixel 16 bit, cổ địa đồ…), chủ đề, chuỗi hình theo thứ tự, nhãn phụ. Có chỗ điền chủ đề trong ngoặc. Ngắn nhưng đủ để model dựng.
- **Cấu trúc:** 15 đoạn độc lập, mỗi đoạn một câu giao việc dài.
- **Trích:** "做一支 10 秒 3Blue1Brown 式数学可视化，讲【圆面积】。"
- **Dùng để học:** Kho ý tưởng chất liệu: mỗi đoạn gắn một chất liệu CL (ví dụ CL-10, CL-14, CL-07). Dùng để nảy ý, không dùng làm khuôn.

## 25. `kloss-xyz-067876`

- **Link:** [kloss-xyz-067876](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/kloss-xyz-067876.md)
- **Tác giả:** kloss_xyz · 59 ký tự · nhóm `explainer`
- **Vì sao tốt:** Prompt một câu cho ra video 172 giây về lịch sử AI: nhãn chương dạng đơn cách ở góc trên trái, thước năm màu cam ở góc phải, tiêu đề hai dòng chữ hẹp đậm (dòng hai màu cam), sơ đồ cơ chế riêng mỗi chương. Là video gốc của phép thử dựng lại ngày 27/10/2026.
- **Cấu trúc:** Một câu.
- **Trích:** "make a video highlighting key moments in the history of AI."
- **Dùng để học:** Mẫu hình cho CL-03 và tông Đen & cam; đích của phép thử Lịch sử AI (`05_cach_lam.md`, LM-03).

