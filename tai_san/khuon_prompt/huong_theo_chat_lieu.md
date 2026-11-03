# Hướng viết sẵn theo chất liệu (CL-01 đến CL-16)

> Mỗi mục có đoạn "hướng" (dán vào khối `<direction>` của khuôn giao việc ở `khuon_dung_html_mot_trang.md`, chỗ `{{HUONG_CHAT_LIEU}}`), mẫu nguồn kèm link prompt gốc, cách làm hợp, và danh sách cấm theo chất liệu (chép vào `{{CAM_THEO_CHAT_LIEU}}`). Quy tắc: danh sách cấm phải khớp chất liệu, không chép từ chất liệu khác (`07_khuon_prompt_va_kiem_chat_luong.md` mục 11).
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Đoạn hướng tổng hợp từ trường `thu_phap_dang_hoc` và `phong_cach` của 100 mục đã chấm bằng hình, từ quét chữ 703 prompt (ngày 27/10/2026), và từ mô tả chất liệu ở `tai_san/so_tay_gu/he_truc_dung.md`. CL-09 đến CL-16 trạng thái nháp, chưa chạy lần nào trừ CL-09. Chưa hiệu chỉnh màu và số cho tông của Media: màu và phông lấy từ tông MAU đã chọn.
> Link prompt gốc dạng `https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/<slug>.md`. Prompt thuộc tác giả; Media chỉ lưu link và đoạn tóm tắt. Video mẫu: `https://media.skillry.dev/opus-5-5/<slug>/original.mp4`.

## Cách dùng

1. Chọn chất liệu ở cửa chọn dựng, chép đoạn hướng, thay màu và phông bằng tông MAU đã chọn.
2. Đoạn hướng chỉ nói video trông thế nào. Cách làm, số cứng, lỗi đã biết nằm ở các khối khác của khuôn.
3. Nhiều chất liệu trong một video thì ghép đoạn hướng từng cảnh vào storyboard, không trộn thành một đoạn.

## CL-01 — 2D chữ và khối (dọc 1080×1920)

**Hướng.** Chữ trắng rất đậm chiếm phần lớn khung dọc; mỗi màn một ý, khoảng 7 giây. Khối hình học và số đếm tăng kèm thanh chạy. Tiêu đề hai dòng: dòng đầu màu chữ chính, dòng hai màu nhấn. Số lớn đứng một mình kèm đơn vị nhỏ ngay dưới. Một đường nét đứt sáng chạy xuyên các cảnh, mỗi cảnh biến nó thành vật cần giải thích. Giữ nội dung quan trọng trong vùng giữa khung dọc, chữ cách mép dưới ít nhất 20% chiều cao để không đè nút của mạng xã hội. Cỡ chữ nhỏ nhất 32 px.

**Mẫu nguồn.** [`gautam-mer1-530003`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/gautam-mer1-530003.md), [`howdevelop-733090`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/howdevelop-733090.md), [`deedydas-252537`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/deedydas-252537.md)

**Cách làm hợp.** LM-01 (có sẵn, tông MAU-01); LM-04 (đã thử).

**Cấm theo chất liệu.** ảnh stock; chữ dưới 32 px; gradient cầu vồng.

## CL-02 — 2D thẻ kính mờ

**Hướng.** Một thẻ kính mờ mô phỏng giao diện giữ 8–13 giây, chi tiết bên trong hiện dần. Thẻ nền mờ có viền sáng mảnh và bóng mềm, đặt trong khung tối bo góc chiếm khoảng 80% bề ngang, mọi cảnh và mọi cú phóng to cắt gọn theo khung đó. Mỗi cảnh là biến hình của cảnh trước (khối đen tràn khung trong một nhịp rồi co lại thành cảnh sau), không mờ chéo. Một thanh mảnh ghim ở chân khung nối các cảnh. Phụ đề đổi cụm 1,5–2,5 giây.

**Mẫu nguồn.** [`twoclipping-496100`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/twoclipping-496100.md), [`brainextends-606193`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/brainextends-606193.md)

**Cách làm hợp.** LM-01 (phải dựng khối cảnh), LM-03, LM-04 (phải dựng).

**Cấm theo chất liệu.** giao diện giả mang tên hoặc logo thương hiệu thật (dễ gây hiểu nhầm); đặt độ mờ hoặc bộ lọc lên phần tử `preserve-3d`.

## CL-03 — 2D nét viền ăn khớp lời

**Hướng.** Hình chỉ có nét viền mảnh, không tô đặc. Mỗi chương một sơ đồ riêng; nút hoặc điểm đang nói tới phát sáng bằng màu nhấn. Tiêu đề bước ở góc trên trái cho người xem biết đang ở đâu; khung bao quanh phần đang nhấn kèm nhãn nhỏ khác màu giải thích từng phần. Mỗi cụm phụ đề (2–2,5 giây) ứng với đúng một chi tiết đổi trên hình; cảnh lớn 10–12 giây. Phụ đề một dòng ở đáy khớp giọng đọc.

**Mẫu nguồn.** [`kloss-xyz-067876`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/kloss-xyz-067876.md), [`linearuncle-971663`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/linearuncle-971663.md)

**Cách làm hợp.** LM-01 (phải dựng khối cảnh), LM-03, LM-04 (phải dựng).

**Cấm theo chất liệu.** tô đặc nhiều mảng; bóng đổ lớn; nhiều hơn một ý đổi trong một cụm phụ đề.

## CL-04 — 2D ảnh chụp màn hình và sơ đồ

**Hướng.** Ghép ảnh chụp giao diện thật với sơ đồ vector. Không phóng to ảnh thô: tách thành thành phần rồi chuyển động từng thành phần, hoặc dựng lại trung thực bằng mã từ hệ thiết kế thật. Số liệu bay ra khỏi màn hình thành nhãn bo viền rồi trượt về điểm tương ứng trên sơ đồ. Mọi số và nhãn lấy từ bản ghi hoặc file dữ kiện; mỗi nội dung giữ ít nhất 2,5 giây. Chuyển cảnh bằng vòng tròn khép dần.

**Mẫu nguồn.** [`bilimfili1-459762`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/bilimfili1-459762.md), [`ho-ba-761062`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/ho-ba-761062.md), [`tetsu-tetsu333-576886`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/tetsu-tetsu333-576886.md)

**Cách làm hợp.** LM-01 (phải dựng khối cảnh), LM-03, LM-04 (phải dựng).

**Cấm theo chất liệu.** màn hình giả; số bịa ngụ ý dữ liệu khách thật; ảnh chụp có dữ liệu khách hàng hoặc thông tin nội bộ chưa công bố.

## CL-05 — Đồ thị SVG

**Hướng.** Hệ trục và đường đồ thị nét mảnh tự vẽ ra theo lời đọc (nét dài ra trước, số hiện sau). Điểm trượt dọc đường kèm đường dọc nét đứt và hộp nhãn giá trị. Thanh ngang dài ra rồi mới hiện số ở đầu thanh. Bảng số điền từng ô đúng lúc đọc; công thức biến đổi tại chỗ. Gần như không cắt cảnh: mỗi câu đọc một bước biến đổi của hình. Phần tô dưới đường cong cắt theo vị trí đầu bút; nhãn và mũi tên chỉ hiện khi nét vẽ tới. Mọi giá trị từ file dữ kiện.

**Mẫu nguồn.** [`rammanq-034553`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/rammanq-034553.md), [`deedydas-252537`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/deedydas-252537.md), [`kloss-xyz-067876`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/kloss-xyz-067876.md)

**Cách làm hợp.** LM-02 (có sẵn), LM-03 (đã thử một phần).

**Cấm theo chất liệu.** số minh hoạ không gắn nhãn; sửa số liệu cho đường cong đẹp hơn.

## CL-06 — 3D đất sét và bản vẽ

**Hướng.** Mô hình 3D vật liệu đất sét: một màu xám trắng, nhám, không bóng, không vân; máy quay lượn chậm; mặt cắt và tách lớp; một cảnh 3D giữ 10–30 giây, gần như không chữ trên hình. Xen màn bản vẽ nền lưới ô cho công thức. Có thể đổi chuyển động thành dừng hình (mỗi hai khung đổi một lần). Ánh sáng ba điểm mềm; bóng đổ nhẹ trên nền cùng tông.

**Mẫu nguồn.** [`wikiwayne-486055`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/wikiwayne-486055.md), [`wikiwayne-080350`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/wikiwayne-080350.md)

**Cách làm hợp.** LM-02 (có sẵn: `xuong_dai/pin_mat_troi/`); LM-03 (phải dựng).

**Cấm theo chất liệu.** vật liệu bóng; nhiều hơn hai màu trên mô hình; chữ dày đặc trên hình 3D.

## CL-07 — 3D xuyên thấu

**Hướng.** Vỏ trắng chuyển dần sang trong suốt để thấy bên trong; mỗi bộ phận một màu theo chức năng, có bảng chú giải ở góc (ví dụ điện cam hoặc vàng, nhiệt đỏ hồng, làm mát xanh ngọc). Hạt chạy dọc đường ống hoặc dây theo chiều dòng. Nhãn có đường dẫn bám bộ phận, là HTML đặt theo toạ độ chiếu mỗi khung. Máy quay bay liên tục, 3–5 giây một góc, nhìn chếch xuống 30–40 độ. Bộ phận tách lớp về phía có chỗ trống, có dây đứt nét dẫn ra nhãn.

**Mẫu nguồn.** [`mdaman010-111079`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/mdaman010-111079.md), [`everestchris6-399895`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/everestchris6-399895.md), [`nft-chen-068069`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/nft-chen-068069.md)

**Cách làm hợp.** LM-02 (có sẵn: `xuong_dai/may_bien_ap/`).

**Cấm theo chất liệu.** vỏ trắng trên nền kem (đã đo 1,11:1); kính đen phẳng; bộ phận lơ lửng; máy quay trong vùng cánh quay quét.

## CL-08 — 3D tả thực Blender

**Hướng.** Vật liệu thật dựng từ mô hình tải về, máy quay bay liền mạch, độ sâu trường ảnh, bóng đổ mềm, nhoè chuyển động. Chữ, nhãn, viền sáng và phụ đề ghép ngoài Blender, trong Remotion, để sửa chữ không phải kết xuất lại 3D. Chỉ dùng cho cận cảnh vật thật 15–40 giây; phần giải thích còn lại dựng bằng Remotion. Lập bảng nguồn cho mô hình và từng dữ kiện (kích thước, vật liệu, mức tin cậy); script dựng đọc thẳng bảng đó. Đoạn này chỉ để tham khảo: cách làm theo skill `dung-hoat-canh-3d-blender`.

**Mẫu nguồn.** [`oab10don-457273`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/oab10don-457273.md), [`alexalbert-274839`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/alexalbert-274839.md), [`0xwast3-222104`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/0xwast3-222104.md)

**Cách làm hợp.** LM-05 (skill).

**Cấm theo chất liệu.** mô hình dựng từ khối cơ bản; mô hình không rõ giấy phép; cảnh dựng nhưng trông giống ảnh tư liệu thật (cần ghi rõ là dựng và nguồn).

## CL-09 — 2D minh hoạ phẳng có vật thể (bàn thao tác)

**Hướng.** Vật vẽ SVG phẳng ở giữa khung (ly, máy, thiết bị) được lấp dần theo từng bước. Một bên là danh sách bước: mục đang làm có mũi tên, mục xong có dấu tích, mục chưa tới mờ. Bên kia là thẻ số đo cỡ lớn kèm đơn vị nhỏ và thanh đo chạy từ 0 đến đủ lượng; vạch chia cạnh vật để thấy mức dâng. Thanh bước ở chân hoặc đỉnh khung: bước đang làm tô màu nhấn, bước xong có dấu tích. Tiêu đề hai dòng, dòng hai màu nhấn. Khổ ngang (BC-08).

**Mẫu nguồn.** [`ror-fly-880547`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/ror-fly-880547.md), [`sarut0bisasuke-069973`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/sarut0bisasuke-069973.md), [`alex-prompter-997524`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/alex-prompter-997524.md)

**Cách làm hợp.** LM-03 (đã thử: bản chạy thử cocktail 27/10/2026); LM-02 (phải dựng).

**Cấm theo chất liệu.** chuyển mờ chéo giữa cảnh; gradient trên giao diện; hạt; quầng sáng; easing nảy; khoảng đứng yên.

## CL-10 — 2D nét vẽ tay (bảng trắng, sổ giấy)

**Hướng.** Nét bút hiện dần theo lời đọc (đường SVG vẽ dài ra bằng `stroke-dashoffset`); cây bút hiển thị đi theo nét đang vẽ. Mỗi cảnh một tiêu đề viết tay ở góc trái trên, nội dung vẽ dần bên dưới, câu thuyết minh ở chân khung. Con dấu cao su đóng nghiêng nhấn con số lớn; dấu căn lề ở bốn góc và mã cảnh nhỏ tạo cảm giác sổ ghi chép. Cảnh cuối là bảng tóm tắt đánh số, mục chính tô màu nhấn dần theo lời. Phông viết tay phải có đủ dấu tiếng Việt: kiểm bằng chữ có dấu nặng, mũ, móc trước khi dựng.

**Mẫu nguồn.** [`tak3sh8-441895`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/tak3sh8-441895.md), [`groundcontrol-230877`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/groundcontrol-230877.md)

**Cách làm hợp.** LM-03, LM-04 (phải dựng).

**Cấm theo chất liệu.** nét đều như máy; phông viết tay thiếu dấu tiếng Việt; chữ gõ in lẫn chữ viết tay trong một tiêu đề.

## CL-11 — Chữ động khổng lồ

**Hướng.** Một ý mỗi nhịp, 1–2 giây; chữ chiếm gần hết khung; nền đổi màu theo ý (ví dụ kem, đen, cam đất). Chữ nhấn có bóng đổ lệch hai lớp để nổi khối mà vẫn phẳng. Có thể giữ khung câu cố định ở trên và đổi liên tục từ cuối. Đoạn chữ nhỏ cuộn mờ ở nền thể hiện hành động mà không cần giải thích. Mỗi dòng chữ hiện ít nhất 0,5 giây cộng 0,3 giây mỗi từ (ngưỡng đọc của công cụ kiểm HyperFrames). Bản dọc dùng BC-01 thêm CL-11.

**Mẫu nguồn.** [`0xfemyn-137833`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/0xfemyn-137833.md), [`souravbhar871-477361`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/souravbhar871-477361.md), [`chrisjdimarco-808196`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/chrisjdimarco-808196.md), [`zheke-622583`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/zheke-622583.md)

**Cách làm hợp.** LM-03, LM-04 (phải dựng).

**Cấm theo chất liệu.** chữ và khung ở góc khung (dấu hiệu của hình do máy làm); nền gradient viết trong mã; chữ hiện ngắn hơn ngưỡng đọc.

## CL-12 — Hạt và ánh sáng

**Hướng.** Hình sinh bằng hạt, quầng sáng, hoặc công thức toán. Chữ lớn dựng từ hạt tụ lại; chuyển cảnh bằng hạt tan rồi gom thành hình kế tiếp, hoặc phóng máy quay vào một tâm sáng thay vì cắt. Hạt dùng bộ sinh có hạt giống, vị trí tính theo mã hạt và số khung. Giới hạn số hạt theo máy (nguồn dùng hàng chục nghìn điểm, nặng GPU; đo trước khi chốt). Chữ nhỏ không làm bằng hạt. Thanh tiến trình mảnh ở chân khung chạy suốt video.

**Mẫu nguồn.** [`nolkeeg-635633`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/nolkeeg-635633.md), [`miaai-lab-774895`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/miaai-lab-774895.md), [`michaelzsguo-782312`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/michaelzsguo-782312.md), [`ishuagra02-678129`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/ishuagra02-678129.md)

**Cách làm hợp.** LM-03 (đã thử một phần); LM-02 (phải dựng).

**Cấm theo chất liệu.** hạt dày phủ trắng khung; chữ nhỏ bằng hạt; không giới hạn số hạt.

## CL-13 — 3D sa bàn bằng mã

**Hướng.** Mô hình đồ chơi hoặc đẳng cự bằng Three.js: một khối tròn đặt giữa khung (khổ dọc: tiêu đề phía trên, thẻ phía dưới, BC-12), máy quay đứng yên hoặc quay nhẹ, đồ vật xuất hiện lần lượt. Ánh sáng mềm, màu theo chức năng, bảng chú giải ở góc. Mỗi cảnh một tiêu đề hai dòng, số thứ tự cảnh nhỏ phía trên. Thẻ nhỏ hiện ở chân khung ngay sau khi nhãn nổi lên trong cảnh. Dùng khuôn `khuon_canh_threejs.md`.

**Mẫu nguồn.** [`felipemoller-936736`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/felipemoller-936736.md), [`mdaman010-111079`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/mdaman010-111079.md)

**Cách làm hợp.** LM-02 (phải dựng, dùng lại khung mã D-09b); LM-03 (đã thử một phần: bàn cờ Three.js).

**Cấm theo chất liệu.** bộ phận lơ lửng hoặc có khe hở; lật vật lớn bằng CSS 3D; vật chính nhỏ hơn 1/4 khung.

## CL-14 — Mô phỏng và bề mặt toán

**Hướng.** Mô phỏng tính thật, không vẽ giả: quả bóng lăn theo độ dốc thật trên bề mặt hàm số 3D, bước ngẫu nhiên là bước ngẫu nhiên thật. Bề mặt tô màu theo độ cao, hai nhãn bo viền có đường dẫn chỉ đỉnh và đáy. Bên dưới hiện số bước, giá trị đang tính và đồ thị nhỏ vẽ dần. So sánh nhiều tham số bằng nhiều quả bóng nhiều màu với chú giải ngắn. Hộp tối ở góc hiện bộ đếm chạy theo mô phỏng. Ghi hạt giống, số bước, tham số vào file dữ kiện; nói rõ độ bất định của ước lượng.

**Mẫu nguồn.** [`anirockshady-032809`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/anirockshady-032809.md), [`astrothewizard-618782`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/astrothewizard-618782.md)

**Cách làm hợp.** LM-03, LM-02 (phải dựng); LM-07 (chưa cài).

**Cấm theo chất liệu.** vẽ giả một quá trình mà không tính; số liệu minh hoạ không gắn nhãn.

## CL-15 — Minh hoạ kể chuyện có nhân vật, giấy cắt

**Hướng.** Nhân vật hình phẳng đơn giản kể một chuỗi mốc. Nhiều lớp đồi giấy xa gần cuộn với tốc độ khác nhau để có chiều sâu. Mỗi mốc một hình phẳng chỉ một ký hiệu; màu nền thẻ mã hoá giai đoạn; năm cỡ lớn mờ làm hình chìm phía sau tiêu đề. Cảnh cuối thu về một vật chốt ý. Biểu tượng khoa học nét mảnh thay cho chữ giải thích khi cần. Điểm hợp Media thấp: chỉ làm khi kịch bản cần nhân vật.

**Mẫu nguồn.** [`daniel-mac8-306214`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/daniel-mac8-306214.md), [`songkeys-384673`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/songkeys-384673.md), [`triglyceee-161719`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/triglyceee-161719.md)

**Cách làm hợp.** LM-03 (phải dựng); LM-06 (chưa thử).

**Cấm theo chất liệu.** nhân vật mô phỏng người thật; nhân vật có bản quyền; chữ nhỏ trong ảnh do AI sinh.

## CL-16 — Giao diện và thẻ nổi

**Hướng.** Thẻ giao diện nghiêng nhẹ trong không gian 3D, bóng mềm; mỗi cảnh một thẻ chính. Băng chuyền 10–18 thẻ dọc xếp trên một cung bằng phối cảnh, thẻ giữa lớn nhất, phản chiếu sàn là bản sao lật mờ dần. Con trỏ chuột chỉ chi tiết. Chuyển cảnh bằng biến hình của một hình duy nhất (đổi kích thước, bo góc, màu) với lò xo nghiệm kín. Nhãn nhỏ viết hoa kèm chấm màu ở đầu mỗi cảnh. Nhóm nguồn là quảng cáo phần mềm; hợp Media thấp, gần CL-04.

**Mẫu nguồn.** [`sachaarbonel-673648`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/sachaarbonel-673648.md), [`twoclipping-000267`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/twoclipping-000267.md), [`morse-369333`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/morse-369333.md), [`brainextends-606193`](https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/brainextends-606193.md)

**Cách làm hợp.** LM-03, LM-04 (phải dựng).

**Cấm theo chất liệu.** giao diện giả mang tên thật; độ mờ hoặc bộ lọc đặt lên phần tử `preserve-3d`; lật vật lớn bằng CSS 3D.

