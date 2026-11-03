# Thư viện thủ pháp và hiệu ứng (sinh tự động)

> File này sinh từ `thu_vien_thu_phap.json` bằng `python3 -I tai_san/thu_phap/sinh_ban_doc.py`. Không sửa tay: sửa JSON rồi chạy lại. Phiên bản dữ liệu 1.0, cập nhật 2026-10-27. Tổng 109 thủ pháp, tất cả ở trạng thái nháp. Cách dùng ở module `06_thu_phap_va_hieu_ung.md`.

Ghi chú nguồn: Thư viện thủ pháp và hiệu ứng của Media. Nguồn dữ liệu của bản đọc `thu_vien_thu_phap.md` (sinh bằng sinh_ban_doc.py, không sửa tay file đó). Gom từ trường thu_phap_dang_hoc của 100 mục đã chấm bằng hình (317 dòng) và khoá ky_thuat_hinh, am_thanh của bản quét chữ 703 prompt, ngày 27/10/2026; dòng trùng ý đã gộp, dòng chỉ là tên thương hiệu đã bỏ. Lỗi hay gặp lấy từ ghi chú trong prompt mẫu hoặc suy ra từ cơ chế (chưa đo khi dựng thật). Trường tham_so_tu: 'mẫu' là tham số lấy nguyên từ mẫu nguồn; 'đề xuất' là tham số Claude đề xuất, chưa đo; 'mẫu + đề xuất' là trộn hai loại, phần đề xuất ghi rõ trong cach_lam. Mọi thủ pháp ở trạng thái nháp: chưa dựng thử bằng cách làm nào của Media. Video và prompt gốc thuộc tác giả; link ở tai_san/hoc_tu_repo/awesome_opus55/muc_luc.md.

Quy ước chi phí máy:

- **nhẹ:** Tính trong một khung, không thêm lượt chụp hay xử lý ảnh nào; thời gian máy gần như không đổi.
- **vừa:** Thêm xử lý mỗi khung (hạt, quầng, shader nhỏ, cảnh 3D Three.js); thời gian máy tăng dưới khoảng 2 lần so với cảnh không có (ước, chưa đo riêng từng thủ pháp).
- **nặng:** Nhiều lượt chụp mỗi khung, hàng chục nghìn hạt hoặc shader toàn khung; đo của Media: nhoè 60 khung/giây gấp khoảng 8 lần.

## Bảng mã chất liệu (CL) và cách làm (LM)

| Mã | Tên |
|---|---|
| CL-01 | 2D chữ và khối |
| CL-02 | 2D thẻ kính mờ |
| CL-03 | 2D nét viền ăn khớp lời |
| CL-04 | 2D ảnh chụp màn hình và sơ đồ |
| CL-05 | Đồ thị SVG |
| CL-06 | 3D đất sét và bản vẽ |
| CL-07 | 3D xuyên thấu |
| CL-08 | 3D tả thực Blender |
| CL-09 | 2D minh hoạ phẳng có vật thể |
| CL-10 | 2D nét vẽ tay |
| CL-11 | Chữ động khổng lồ |
| CL-12 | Hạt và ánh sáng |
| CL-13 | 3D sa bàn bằng mã |
| CL-14 | Mô phỏng và bề mặt toán |
| CL-15 | Minh hoạ kể chuyện có nhân vật, giấy cắt |
| CL-16 | Giao diện và thẻ nổi |
| LM-01 | Remotion khối cảnh dọc |
| LM-02 | Remotion dự án ngang |
| LM-03 | HTML một trang, chụp khung theo đồng hồ ảo (seek(t)) |
| LM-04 | HyperFrames |
| LM-05 | Blender Cycles ghép Remotion |
| LM-06 | Clip AI ghép Remotion |
| LM-07 | Manim (chưa cài) |

## Tám nhóm

| Nhóm | Tên | Số thủ pháp | Nội dung |
|---|---|---|---|
| TP-CD | chuyển động | 11 | Đường tăng giảm tốc, lò xo, lệch nhịp, nảy, máy quay ảo 2D, nền trôi, con trỏ. |
| TP-CC | chuyển cảnh | 13 | Cách nối hai cảnh hoặc hai trạng thái: hình biến, vật mang theo, phóng máy quay, khối màu tràn khung, vòng lặp. |
| TP-CH | chữ | 21 | Chữ vào, chữ nhấn, phụ đề, nhãn góc, nhãn chương, chữ viết tay. |
| TP-SL | số liệu, đồ thị, bản đồ | 20 | Thanh, đường, bộ đếm, lưới ô, đồng hồ, bản đồ, sơ đồ, danh sách bước, chú thích. |
| TP-3D | hình 3D, máy quay, ánh sáng, vật liệu | 16 | Máy quay 3D, độ sâu trường ảnh, tách lớp, ánh sáng, vật liệu, mô phỏng, shader. |
| TP-HK | hậu kỳ, lớp hoàn thiện | 14 | Hạt nhiễu, vignette, tách RGB, nhoè chuyển động, quầng sáng, bokeh, nét bút, kính lỏng, pixel hoá. |
| TP-AT | âm thanh đồng bộ | 10 | Lưới nhịp, đặt tiếng theo đỉnh, chuẩn âm lượng, hạ nhạc, âm sinh từ dữ liệu, mốc từng từ. |
| TP-TT | tương tác (chỉ ghi để biết) | 4 | Hiệu ứng chỉ có nghĩa trong trang tương tác hoặc trò chơi; video không dùng. |

## TP-CD — chuyển động

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-CD01 | Lò xo giải tích thay cho đường tăng giảm tốc | Canvas, CSS, Remotion | nhẹ | CL-02, CL-04, CL-05, CL-09, CL-16 | LM-01, LM-02, LM-03, LM-04 | 6 |
| TP-CD02 | Đường tăng giảm tốc chuẩn và thời lượng chuyển động | GSAP, CSS, Canvas, Remotion | nhẹ | CL-01, CL-02, CL-04, CL-05, CL-09, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CD03 | Phần tử hiện lệch nhịp (stagger) | GSAP, CSS, Canvas, Remotion | nhẹ | CL-01, CL-04, CL-05, CL-09, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CD04 | Nội dung vào sau khi vật chứa biến dạng, ra trước khi biến dạng tiếp | CSS, Canvas, GSAP | nhẹ | CL-02, CL-04, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CD05 | Con trỏ chuột điều khiển mọi thay đổi (kèm nghiêng theo con trỏ) | Canvas, CSS, Remotion | nhẹ | CL-02, CL-04, CL-16 | LM-02, LM-03 | 7 |
| TP-CD06 | Phóng nhanh rồi thu nhỏ (pop) cho chữ sự kiện | GSAP, CSS, Canvas | nhẹ | CL-11, CL-12, CL-16 | LM-01, LM-02, LM-03, LM-04 | 2 |
| TP-CD07 | Máy quay ảo 2D: đẩy chậm liên tục và phóng cho vật đang xét lấp khung | CSS, Canvas, GSAP, Remotion | nhẹ | CL-02, CL-04, CL-09, CL-16 | LM-01, LM-02, LM-03, LM-04 | 6 |
| TP-CD08 | Nền nhiều lớp trôi khác tốc độ (parallax 2D) | Canvas, CSS, GSAP | nhẹ | CL-09, CL-12, CL-15 | LM-01, LM-02, LM-03, LM-04 | 2 |
| TP-CD09 | Vi chuyển động giữ cảnh tĩnh, và dừng có chủ đích trước đoạn kết | CSS, Canvas, GSAP | nhẹ | CL-01, CL-09, CL-11, CL-13, CL-15 | LM-01, LM-02, LM-03, LM-04 | 3 |
| TP-CD10 | Chuyển động lượng tử hoá (animated on twos) | Canvas, Three.js | nhẹ | CL-15, CL-09 | LM-02, LM-03 | 3 |
| TP-CD11 | Nhân vật hộp có đặc tả kích thước | Canvas, SVG | nhẹ | CL-15 | LM-02, LM-03 | 2 |

### TP-CD01 Lò xo giải tích thay cho đường tăng giảm tốc

- **Cách làm** (tham số từ: mẫu + đề xuất): Giá trị chạy từ đầu tới đích theo công thức đóng x(t) = 1 − (1 + ωt)·e^(−ωt), ω từ 12 đến 40 (ω lớn thì tới đích nhanh); không vượt đích. Thông số mẫu: hình damping 0,72, lắng sau 0,35 s; máy quay damping 1,0, lắng sau 0,6 s. Giá trị đổi đích giữa chừng thì cộng thêm một lò xo cho mỗi lần đổi, nên giá trị vẫn là hàm thuần của thời gian và tua tới khung nào cũng đúng. Thanh chỉ tab hoặc núm công tắc: hai mép chạy hai lò xo khác ω, mép dẫn đầu dùng ω lớn hơn nên tới trước, thanh giãn ra rồi co lại (giá trị ω từng mép là đề xuất).
- **Lỗi hay gặp:** Đổi đích mà không cộng thêm lò xo thì giá trị nhảy bậc. Dùng easing nảy (back, elastic) thay cho lò xo gần như không vượt đích làm hình trông rẻ; khoảng 13 prompt mẫu cấm easing nảy.
- **Mẫu nguồn:** `heyiamnick-119558`, `flxrnc-251921`, `0xnicc0-516612`, `morse-369333`, `verbove-268381`, `annacher-433425` (trạng thái: nháp)

### TP-CD02 Đường tăng giảm tốc chuẩn và thời lượng chuyển động

- **Cách làm** (tham số từ: mẫu): Mọi chuyển động có tăng tốc rồi giảm tốc, không chạy đều. Mẫu: biến hình 0,8 s theo cubic-bezier(.45, 0, .15, 1), máy quay phóng theo cùng đường cong. Máy quay đẩy, kéo, lia 1,5–3 s trên đường ease nhẹ, chậm bằng nửa mặc định; máy quay bắt đầu đúng nhịp và lắng chậm hơn hình. Quét băng chuyền: quay nhanh rồi giảm tốc trong khoảng 0,5 s, nhoè mạnh nhất lúc nhanh nhất, dừng ở thẻ chính. Chuyển động đều (tuyến tính) chỉ dùng cho thanh tiến độ, bộ đếm theo đồng hồ toàn phim và vòng lặp.
- **Lỗi hay gặp:** Chuyển động đều làm hình trông cứng. Máy quay lia xong cùng lúc với hình thì mắt không kịp đọc.
- **Mẫu nguồn:** `rossaxbt-312793`, `jake11moran-414633`, `flxrnc-251921`, `twoclipping-000267` (trạng thái: nháp)

### TP-CD03 Phần tử hiện lệch nhịp (stagger)

- **Cách làm** (tham số từ: mẫu + đề xuất): Nhiều phần tử cùng nhóm (ký tự, thẻ, hàng, thanh) vào lần lượt, mỗi phần tử trễ một khoảng cố định so với phần tử trước, không vào cùng khung. Mẫu: mỗi ký tự có lò xo riêng (dịch dọc, độ mờ, nhoè), trễ 125 ms (nốt 1/16 ở 120 BPM); lưới thẻ tính năng hiện lần lượt, mỗi thẻ một thông số; ba thẻ ngang hàng vào lần lượt. Đề xuất khi không có nhạc: trễ 60–150 ms cho thẻ và hàng, 20–40 ms cho ký tự, tổng thời gian vào của cả nhóm không quá 1,2 s.
- **Lỗi hay gặp:** Trễ cộng dồn quá lớn thì phần tử cuối vào sau khi lời đọc đã qua. Khoảng trễ đều tuyệt đối làm chuyển động có nhịp cơ học; thêm chênh lệch nhỏ giữa các phần tử (đề xuất ±15%).
- **Mẫu nguồn:** `techhalla-498547`, `sudo-kiran-254201`, `alex-prompter-997524`, `ratheejaisal-154698` (trạng thái: nháp)

### TP-CD04 Nội dung vào sau khi vật chứa biến dạng, ra trước khi biến dạng tiếp

- **Cách làm** (tham số từ: mẫu): Khi một vật chứa (thẻ, hình chữ nhật bo góc) đổi kích thước, bán kính, màu, nội dung bên trong chỉ vào sau khi vật chứa đã bắt đầu biến dạng và ra trước khi nó biến dạng tiếp. Nội dung đổi bằng nhoè ngắn khoảng 0,15 s (mẫu khác: mờ 12 px) với thời điểm vào và ra riêng, để chữ cũ và chữ mới không chồng nhau. Chữ nằm trong hình đang biến hình cần clip (cắt theo khung vật chứa) và thời gian vào, ra riêng.
- **Lỗi hay gặp:** Chữ cũ chưa rời đã vào chữ mới thì hai lớp chữ chồng nhau. Không clip nội dung thì chữ tràn ra ngoài vật chứa đang co.
- **Mẫu nguồn:** `verbove-268381`, `morse-369333`, `annacher-433425`, `brainextends-606193` (trạng thái: nháp)

### TP-CD05 Con trỏ chuột điều khiển mọi thay đổi (kèm nghiêng theo con trỏ)

- **Cách làm** (tham số từ: mẫu): Con trỏ nhấn hoặc kéo thật trước mỗi lần đổi trạng thái. Đầu mũi con trỏ khoá vào vật đang kéo; con trỏ nhắm vào vị trí đích sẽ ở khi đáp; tốc độ dưới 65 px mỗi khung; cuối video trả con trỏ về đúng vị trí và tốc độ ban đầu để lặp không giật. Giữ chuột thì giá trị tính từ vị trí con trỏ, thả ra thì lò xo bật về từ vị trí đó; kéo quá mức tối đa thì thanh giãn ra như cao su. Con trỏ phóng to theo máy quay. Biến thể: vật nghiêng theo vị trí con trỏ có độ trễ lò xo, không nảy, góc tối đa khoảng 12 độ.
- **Lỗi hay gặp:** Con trỏ tới đích chậm hơn hình đổi thì thao tác trông giả. Con trỏ không phóng theo máy quay thì nhỏ hơn giao diện đã phóng.
- **Mẫu nguồn:** `flxrnc-251921`, `0xnicc0-516612`, `diamai-157697`, `morse-369333`, `rossaxbt-312793`, `bthreeagency-827092`, `bilimfili1-459762` (trạng thái: nháp)

### TP-CD06 Phóng nhanh rồi thu nhỏ (pop) cho chữ sự kiện

- **Cách làm** (tham số từ: mẫu + đề xuất): Chữ hoặc vật sự kiện bật lên bằng phóng to nhanh rồi nhỏ lại về cỡ chuẩn, đứng tại điểm xảy ra sự kiện, tồn tại khoảng 1 s rồi mờ đi. Đề xuất: scale 0 → 1,15 trong 0,12 s, rồi 1,15 → 1,0 trong 0,12 s. Cú vọt chỉ dùng cho điểm nhấn một lần; chuyển động còn lại vượt đích rất nhỏ hoặc không vượt.
- **Lỗi hay gặp:** Dùng pop cho mọi phần tử làm cảnh rối và trái nguyên tắc cấm easing nảy của các mẫu cao cấp.
- **Mẫu nguồn:** `froessell-562325`, `verbove-268381` (trạng thái: nháp)

### TP-CD07 Máy quay ảo 2D: đẩy chậm liên tục và phóng cho vật đang xét lấp khung

- **Cách làm** (tham số từ: mẫu): Cả cảnh 2D đặt trong một lớp máy quay biến đổi theo [thời gian, zoom, x, y]; zoom nội suy trong không gian log. Đẩy chậm 1,03–1,07 ở mọi cảnh, không bao giờ đứng yên hẳn; punch-in (phóng nhanh vào) 1,0–1,08 và smash-pan (lia ngang gấp) chỉ theo nhịp, không trôi ngẫu nhiên; nổi tay cầm rất nhẹ nếu cần giả máy cầm tay. Phóng để thành phần đang xét chiếm khoảng 50% khung trở lên; con trỏ phóng theo cùng tỷ lệ.
- **Lỗi hay gặp:** Nội suy zoom tuyến tính (không phải log) làm tốc độ phóng nhìn như tăng dần. Phóng hình bitmap làm chữ vỡ nét; vẽ lại vector ở tỷ lệ mới.
- **Mẫu nguồn:** `twoclipping-551116`, `notdwd-766641`, `techhalla-498547`, `ultimaxbt-549714`, `flxrnc-251921`, `jake11moran-414633` (trạng thái: nháp)

### TP-CD08 Nền nhiều lớp trôi khác tốc độ (parallax 2D)

- **Cách làm** (tham số từ: đề xuất): Nền chia nhiều lớp (trời, đồi xa, đồi gần, tiền cảnh); mỗi lớp cuộn ngang với tốc độ khác nhau để có chiều sâu mà không cần 3D. Đề xuất: lớp xa 0,2–0,4 lần, lớp gần 1,0–1,6 lần tốc độ lớp giữa; không lớp nào đứng yên (nền trôi chậm 2–6 px mỗi giây). Chuyển ngày sang đêm xem TP-CC13.
- **Lỗi hay gặp:** Các lớp cùng tốc độ trông phẳng; lớp xa quá nhanh gây chóng mặt.
- **Mẫu nguồn:** `songkeys-384673`, `nolit64-347627` (trạng thái: nháp)

### TP-CD09 Vi chuyển động giữ cảnh tĩnh, và dừng có chủ đích trước đoạn kết

- **Cách làm** (tham số từ: mẫu + đề xuất): Cảnh tĩnh vẫn có chuyển động nhỏ liên tục: hơi nước bốc, ánh đèn nhấp nháy nhẹ, nền trôi chậm, máy quay đẩy chậm; không phần nào đứng yên quá 1,5 s (ngưỡng đề xuất). Ngoại lệ có chủ đích: dừng tuyệt đối tối thiểu 400 ms trước đoạn kết để đoạn kết nổi lên.
- **Lỗi hay gặp:** Cảnh đứng yên hoàn toàn làm người xem tưởng video bị đứng hình; ngược lại, chuyển động nhỏ ở mọi phần tử cùng lúc làm mắt khó chọn chỗ nhìn.
- **Mẫu nguồn:** `itsolelehmann-762215`, `notdwd-766641`, `gdgtify-130294` (trạng thái: nháp)

### TP-CD10 Chuyển động lượng tử hoá (animated on twos)

- **Cách làm** (tham số từ: mẫu): Mô phỏng tính ở 60 Hz nhưng tư thế lượng tử hoá để chuyển động trông như 8–12 khung mỗi giây (đổi tư thế sau mỗi 2 khung ở 24 khung mỗi giây, gọi là 'một nhịp hai khung'). Dùng cho pixel art, đất sét dừng hình, nhân vật 2.5D. Toạ độ pixel art làm tròn thành số nguyên.
- **Lỗi hay gặp:** Lượng tử hoá cả máy quay thì hình giật; chỉ nên lượng tử hoá nhân vật hoặc vật thể (đề xuất).
- **Mẫu nguồn:** `zacxbt-944604`, `zhu185178-255661`, `wikiwayne-486055` (trạng thái: nháp)

### TP-CD11 Nhân vật hộp có đặc tả kích thước

- **Cách làm** (tham số từ: mẫu): Nhân vật dựng từ các hộp có kích thước ghi bằng số (px): thân 76×54, tay 24×16, chân 11×33, mắt 8×14; vẽ cao khoảng 250 px; chạy sáu bước mỗi giây và nghiêng 7 độ. Biểu cảm đổi theo cảnh, không cử động miệng theo lời. Hợp Media thấp; ghi để đủ.
- **Lỗi hay gặp:** Không ghi kích thước bằng số thì mỗi lần dựng lại nhân vật ra tỷ lệ khác nhau.
- **Mẫu nguồn:** `heyiamnick-119558`, `doubleunplussed-181894` (trạng thái: nháp)

## TP-CC — chuyển cảnh

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-CC01 | Một hình duy nhất biến qua nhiều trạng thái, không cắt cảnh | Canvas, CSS, Remotion | nhẹ | CL-02, CL-04, CL-16 | LM-03 | 6 |
| TP-CC02 | Chuyển cảnh khớp bằng vật mang theo (shared element, match cut) | GSAP, Canvas, Remotion | nhẹ | CL-04, CL-05, CL-09, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CC03 | Phóng máy quay vào một tâm sáng hoặc vào màn hình trong cảnh | Canvas, Three.js, GSAP | vừa | CL-04, CL-12, CL-13 | LM-02, LM-03 | 4 |
| TP-CC04 | Phóng xuyên thang đo (từ mét xuống nguyên tử hoặc ra vũ trụ) | Three.js, Canvas, Remotion | vừa | CL-06, CL-07, CL-12, CL-13, CL-14 | LM-02, LM-03, LM-05 | 6 |
| TP-CC05 | Chuyển cảnh bằng khối màu tràn khung (flood) | Canvas, CSS, GSAP | nhẹ | CL-01, CL-09, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CC06 | Màn mống mắt 6 lá, goo và mặt nạ chạy qua nét chữ | Canvas, CSS, SVG | vừa | CL-01, CL-11, CL-16 | LM-02, LM-03 | 3 |
| TP-CC07 | Nhoè nét chữ khi chuyển cảnh thay vì cắt thẳng | CSS, GSAP, Canvas | nhẹ | CL-01, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CC08 | Cảnh sau hiện trước mốc cảnh trước ra hết 0,3–0,5 s | GSAP, Remotion, Canvas | nhẹ | CL-01, CL-02, CL-05, CL-09, CL-11 | LM-01, LM-02, LM-03, LM-04 | 3 |
| TP-CC09 | Mô-típ và đường dẫn lặp xuyên cảnh | Canvas, SVG, GSAP | nhẹ | CL-04, CL-09, CL-12, CL-16 | LM-01, LM-02, LM-03, LM-04 | 3 |
| TP-CC10 | Đổi nền xen tối, sáng, màu đặc làm điểm ngắt nhịp | CSS, Canvas, GSAP | nhẹ | CL-01, CL-04, CL-09, CL-11, CL-15 | LM-01, LM-02, LM-03, LM-04 | 7 |
| TP-CC11 | Hạt tan ra rồi gom thành hình kế tiếp | Canvas, Three.js | nặng | CL-09, CL-12 | LM-02, LM-03 | 4 |
| TP-CC12 | Khung cuối bằng khung đầu (vòng lặp liền mạch) | Canvas, CSS, FFmpeg | nhẹ | CL-02, CL-04, CL-16 | LM-03 | 7 |
| TP-CC13 | Chuyển trạng thái ngày sang đêm và kéo thanh trượt đổi ảnh | Three.js, Canvas, CSS | vừa | CL-12, CL-13, CL-15 | LM-02, LM-03 | 4 |

### TP-CC01 Một hình duy nhất biến qua nhiều trạng thái, không cắt cảnh

- **Cách làm** (tham số từ: mẫu): Một hình chữ nhật bo góc đổi kích thước, bán kính, màu qua các trạng thái (nút, vòng tải, dấu tick, thanh trượt, công tắc, thanh tab, biểu đồ, thông báo); mỗi lần biến hình 0,8 s, máy quay zoom theo cùng đường cong; mỗi trạng thái chiếm khoảng 50% khung; khung cuối bằng khung đầu. Cấm cross-fade, blur-in, cắt cứng giữa các trạng thái. Cấu hình mẫu phổ biến: 120 BPM, 7 phách, mỗi phách một việc.
- **Lỗi hay gặp:** Nội dung vào quá sớm khi vật chứa chưa đổi (xem TP-CD04). Khung cuối lệch khung đầu một điểm ảnh thì vòng lặp giật.
- **Mẫu nguồn:** `rossaxbt-312793`, `morse-369333`, `verbove-268381`, `0xnicc0-516612`, `flxrnc-251921`, `annacher-433425` (trạng thái: nháp)

### TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut)

- **Cách làm** (tham số từ: mẫu): Một vật giữ danh tính xuyên các cảnh và đáp đúng cùng điểm ảnh ở hai phía chỗ cắt; chỉ cắt khi kích thước, hướng, chủ thể khớp nhau. Ví dụ: bìa album ở ô nhỏ phóng lên thành bìa lớn rồi co lại thành ô; thẻ này thành thẻ sau; đường biểu đồ thành đường nối; biên lai thành bút toán. Cấm cross-fade toàn khung.
- **Lỗi hay gặp:** Hai vật không đáp cùng kích thước và vị trí thì chỗ cắt lộ ra.
- **Mẫu nguồn:** `brainextends-606193`, `everestchris6-399895`, `daniel-haida-636937`, `0xnicc0-516612` (trạng thái: nháp)

### TP-CC03 Phóng máy quay vào một tâm sáng hoặc vào màn hình trong cảnh

- **Cách làm** (tham số từ: mẫu): Chuyển cảnh bằng đẩy máy quay vào một điểm (tâm sáng, màn hình, khung trong cảnh) tới khi điểm đó lấp khung, rồi cảnh sau mở ra từ chính điểm đó. Mẫu: thu hệ thống nhỏ dần tới một điểm giữa sao rồi phóng vào thiết bị khác; chuyển lớp bằng thu nhỏ vào màn hình trong cảnh hiện tại và hiện bộ đếm độ sâu ở góc; đẩy máy quay từ khung điện thoại nhỏ tới toàn màn hình trong khoảng 1 s.
- **Lỗi hay gặp:** Điểm đích không nằm đúng giữa khung khi phóng thì cảnh sau mở lệch tâm.
- **Mẫu nguồn:** `miaai-lab-774895`, `dale-vaz-879074`, `emollick-019567`, `bthreeagency-827092` (trạng thái: nháp)

### TP-CC04 Phóng xuyên thang đo (từ mét xuống nguyên tử hoặc ra vũ trụ)

- **Cách làm** (tham số từ: mẫu): Một cú máy liên tục không cắt đi xuống hoặc đi ra, thước đo cố định bên phải cập nhật tỷ lệ (ví dụ từ khoảng 1 m xuống khoảng 2 nm). Chuỗi mẫu: bàn làm việc, thùng máy, tản nhiệt, CPU, lõi silicon, dây đồng, cổng transistor, một nguyên tử silicon nối bốn nguyên tử bên cạnh. Mỗi bậc quy mô có vật tham chiếu cho thấy tỷ lệ (toà nhà có cây thấp-poly, hàng giá máy ngang tầm mắt, một giá, một khay, một chip). Chuỗi điện thoại tới nguyên tử mẫu dài 20 s.
- **Lỗi hay gặp:** Thang đo nhảy bậc mà không có vật tham chiếu làm người xem mất tỷ lệ. Chi phí lớn khi chuỗi dài: một mẫu zoom từ Cabo da Roca tới vũ trụ quan sát được mất khoảng 3 giờ và 662.769 token xuất.
- **Mẫu nguồn:** `acoramaa-053577`, `irinatoxi-962937`, `curieuxexplorer-408141`, `mdaman010-111079`, `astrothewizard-618782`, `kgonia7-746268` (trạng thái: nháp)

### TP-CC05 Chuyển cảnh bằng khối màu tràn khung (flood)

- **Cách làm** (tham số từ: mẫu): Một khối (đen hoặc màu nhấn) tràn kín khung trong một nhịp, giữ kín một nhịp, rồi co về thành hình của cảnh sau; không dùng mờ dần. Khối phải tràn quá mép và mất khoảng 0,3 s, nếu không nửa màn đổi trong một khung. Biến thể: khối màu hình học trượt phủ khung; hoạ tiết lớn phủ kín khung (ví dụ bức tường gạch) trước cảnh kết.
- **Lỗi hay gặp:** Khối không tràn quá mép thì lộ một khung nửa cũ nửa mới.
- **Mẫu nguồn:** `twoclipping-496100`, `twoclipping-747965`, `bizibeast-505124`, `gouthamjay8-910269` (trạng thái: nháp)

### TP-CC06 Màn mống mắt 6 lá, goo và mặt nạ chạy qua nét chữ

- **Cách làm** (tham số từ: mẫu): Màn mống mắt: 6 cánh quanh khẩu độ lục giác, mỗi cánh quay quanh tâm khoảng 0,4 s, khép lại che nhãn rồi mở ra lộ ảnh mới. Goo: làm mờ rồi lấy ngưỡng alpha để các hình dính nhau. Mặt nạ qua nét chữ: từ mới hiện qua mặt nạ lấy từ nét chữ của từ cũ; chữ trồi lên qua một đường mặt nạ.
- **Lỗi hay gặp:** Mặt nạ lấy từ nét chữ cần vẽ lại ở độ phân giải khung xuất, nếu không mép mặt nạ răng cưa.
- **Mẫu nguồn:** `twoclipping-496100`, `techhalla-498547`, `thejohnnyhuy-282154` (trạng thái: nháp)

### TP-CC07 Nhoè nét chữ khi chuyển cảnh thay vì cắt thẳng

- **Cách làm** (tham số từ: mẫu + đề xuất): Thay cắt thẳng bằng mờ nét chữ khi chuyển: chữ cũ nhoè đi rồi chữ mới hiện từ nhoè về rõ nét; chữ tên chốt hiện từ nhoè về rõ ở cảnh cuối. Mẫu dùng mờ ngắn 12 px; đề xuất thời lượng 0,3–0,5 s.
- **Lỗi hay gặp:** Nhoè quá dài (trên 0,6 s) làm chữ khó đọc ở đoạn chuyển.
- **Mẫu nguồn:** `moritzkremb-466494`, `iammxfschr-955831`, `monokern-832979`, `morse-369333` (trạng thái: nháp)

### TP-CC08 Cảnh sau hiện trước mốc cảnh trước ra hết 0,3–0,5 s

- **Cách làm** (tham số từ: đề xuất): Cảnh sau bắt đầu vào trước khi cảnh trước ra hết, hai cảnh chồng nhau 0,3–0,5 s ở lớp nền và hình; ở lớp chữ thì chữ cũ rời hẳn trước khi chữ mới vào cùng chỗ. Chuyển cảnh flood mất khoảng 0,3 s và flood phải tràn quá mép. Ngưỡng 0,3–0,5 s là yêu cầu lớp hoàn thiện của Media (bản chỉ đạo 27/10/2026), chưa thử trên video thật.
- **Lỗi hay gặp:** Chồng cả lớp chữ thì hai câu đè lên nhau; không chồng lớp nào thì chỗ chuyển có một khoảng trống một hai khung.
- **Mẫu nguồn:** `verbove-268381`, `twoclipping-496100`, `rossaxbt-312793` (trạng thái: nháp)

### TP-CC09 Mô-típ và đường dẫn lặp xuyên cảnh

- **Cách làm** (tham số từ: mẫu): Một mô-típ lặp qua mọi cảnh với biến thể khác nhau (con mắt, đường hầm mắt, vòng xoáy mắt) để thống nhất cả đoạn. Hoặc một đường nét đứt sáng chạy ngang xuyên nhiều cảnh, mỗi cảnh biến đường đó thành đối tượng cần giải thích; thanh phát nhạc mảnh ghim ở chân khung suốt đoạn giữa nối các cảnh. Mỗi chuyển cảnh minh hoạ một tính năng thay vì cắt sang tiêu đề mới.
- **Lỗi hay gặp:** Mô-típ đổi hình quá nhiều giữa các cảnh thì mất tính thống nhất; đường dẫn đổi tốc độ giữa cảnh làm cảm giác bị cắt.
- **Mẫu nguồn:** `monokern-832979`, `howdevelop-733090`, `brainextends-606193` (trạng thái: nháp)

### TP-CC10 Đổi nền xen tối, sáng, màu đặc làm điểm ngắt nhịp

- **Cách làm** (tham số từ: mẫu): Nền đổi theo ý: kem, đen, cam đất đổi theo nhịp cắt khoảng 1,5 s; nền đen và nền trắng xen kẽ theo cảnh; một cảnh nền cam đặc ngăn các cảnh sáng và tối; một cảnh nền tối chen giữa chuỗi sáng; một khung nền sáng giữa chuỗi nền đen. Màu nền thẻ cũng mã hoá nhóm hoặc giai đoạn (đỏ, xanh lá, navy).
- **Lỗi hay gặp:** Đổi nền ở mọi cảnh thì không còn là điểm ngắt nhịp; đổi sang màu ngoài bộ màu đã chọn phá thống nhất.
- **Mẫu nguồn:** `souravbhar871-477361`, `gautam-mer1-530003`, `manuelogomigo-052364`, `ho-ba-761062`, `ajith-io-562538`, `triglyceee-161719`, `sudo-kiran-335993` (trạng thái: nháp)

### TP-CC11 Hạt tan ra rồi gom thành hình kế tiếp

- **Cách làm** (tham số từ: mẫu): Mỗi cảnh là một bóng đơn sắc vẽ sẵn bằng SVG; lấy mẫu 20–40 nghìn điểm trên bóng làm vị trí đích của hạt. Chuyển cảnh: hạt tan ra rồi rơi xuống trong 1–1,5 s, rồi bay lên gom thành hình kế tiếp. Biến thể nhẹ: biểu tượng dựng từ lưới chấm cam, chấm tụ lại rồi tan ra khi chuyển cảnh.
- **Lỗi hay gặp:** Hàng chục nghìn hạt vẽ trên Canvas 2D tốn thời gian máy mỗi khung (chưa có số đo của Media).
- **Mẫu nguồn:** `michaelzsguo-782312`, `manuelogomigo-052364`, `ajith-io-562538`, `mounnna-497266` (trạng thái: nháp)

### TP-CC12 Khung cuối bằng khung đầu (vòng lặp liền mạch)

- **Cách làm** (tham số từ: mẫu): Khung cuối trùng khung đầu, kể cả vị trí và tốc độ con trỏ; xuất đoạn [0, thời lượng) không lặp khung cuối. Kiểm điểm nối: đặt khung 0 cạnh khung ở cuối chu kỳ (mẫu dùng khung 720); lệch một điểm ảnh nghĩa là có chuyển động không tuần hoàn. Vật quay thì quay liên tục, không xoay một nấc mỗi nhịp, để cuối trùng đầu. Cảnh kết nhắc lại cảnh mở cũng khép lại. Hợp video dọc ngắn và nền lặp; video ngang thuyết minh không cần.
- **Lỗi hay gặp:** Phần tử có chu kỳ không chia hết thời lượng thì không khớp ở điểm nối.
- **Mẫu nguồn:** `0xkarmi-129839`, `0xnicc0-516612`, `flxrnc-251921`, `techhalla-498547`, `thegrootdev-966114`, `twoclipping-551116`, `gautam-mer1-530003` (trạng thái: nháp)

### TP-CC13 Chuyển trạng thái ngày sang đêm và kéo thanh trượt đổi ảnh

- **Cách làm** (tham số từ: mẫu): Công tắc ngày sang đêm: đổi màu trời và đèn hướng, bật đèn điểm vàng trong cửa sổ và đèn đá trong khoảng 1 s; hoặc đổi gradient trời xanh sang tím sang xanh đen, thêm trăng, đèn chuỗi bật dần. Kéo thanh trượt đổi ảnh từ ban ngày sang giờ vàng: hai ảnh khớp vị trí, độ mờ chéo đi theo vị trí núm.
- **Lỗi hay gặp:** Hai ảnh không khớp vị trí thì độ mờ chéo làm vật nhân đôi.
- **Mẫu nguồn:** `buildfastwithai-597035`, `nolit64-347627`, `ishuagra02-678129`, `twoclipping-496100` (trạng thái: nháp)

## TP-CH — chữ

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-CH01 | Chữ hiện bằng mặt nạ trượt, từng từ hoặc từng ký tự | GSAP, CSS, Remotion | nhẹ | CL-01, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CH02 | Gõ từng ký tự có con trỏ nhấp nháy | Canvas, CSS, GSAP | nhẹ | CL-04, CL-16 | LM-01, LM-02, LM-03, LM-04 | 7 |
| TP-CH03 | Chữ khổng lồ, mỗi ý một nhịp | GSAP, CSS, Canvas, Remotion | nhẹ | CL-01, CL-11 | LM-01, LM-02, LM-03, LM-04 | 7 |
| TP-CH04 | Tiêu đề hai dòng, dòng hai màu nhấn | CSS, SVG, GSAP, Remotion | nhẹ | CL-04, CL-05, CL-09, CL-13, CL-16 | LM-01, LM-02, LM-03, LM-04 | 9 |
| TP-CH05 | Từ nhấn bằng serif nghiêng màu nhấn; câu chốt serif nghiêng | CSS, SVG, Remotion | nhẹ | CL-01, CL-11, CL-12, CL-16 | LM-01, LM-02, LM-03, LM-04 | 8 |
| TP-CH06 | Từ khoá nền chip hoặc bóng đổ lệch hai lớp | CSS, Canvas | nhẹ | CL-01, CL-04, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CH07 | Gạch ngang chữ cũ rồi thay bằng chữ mới | CSS, SVG, GSAP | nhẹ | CL-01, CL-04, CL-09, CL-16 | LM-01, LM-02, LM-03, LM-04 | 3 |
| TP-CH08 | Gạch chân và vòng vẽ tay quanh từ khoá | SVG, GSAP, CSS | nhẹ | CL-09, CL-10, CL-15, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-CH09 | Thay từ cuối câu trong khung câu cố định | GSAP, CSS, Three.js | nhẹ | CL-11, CL-13 | LM-01, LM-02, LM-03, LM-04 | 2 |
| TP-CH10 | Chữ cắt lát ngang trượt lệch rồi khớp lại | Canvas, Three.js, CSS | vừa | CL-11, CL-12 | LM-02, LM-03 | 3 |
| TP-CH11 | Chữ viền rỗng chạy trên nền chất lỏng | Canvas, Three.js | vừa | CL-11, CL-12 | LM-02, LM-03 | 2 |
| TP-CH12 | Chữ hình thành từ hạt tụ lại | Canvas, Three.js | vừa | CL-11, CL-12 | LM-02, LM-03 | 3 |
| TP-CH13 | Kết cấu bên trong nét chữ | CSS, Canvas, Three.js | vừa | CL-11, CL-12, CL-16 | LM-02, LM-03 | 4 |
| TP-CH14 | Chữ có vai vật lý: mỗi từ là một hiện tượng của trường | Canvas, CSS | vừa | CL-11, CL-12, CL-14 | LM-03 | 4 |
| TP-CH15 | Phụ đề từng từ theo giọng, và vùng an toàn khổ dọc | Remotion, Canvas, CSS, FFmpeg | nhẹ | CL-03, CL-05, CL-10, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 8 |
| TP-CH16 | Nhãn đơn cách (monospace) ở bốn góc | CSS, Canvas, Remotion | nhẹ | CL-04, CL-05, CL-09, CL-12, CL-13, CL-16 | LM-01, LM-02, LM-03, LM-04 | 9 |
| TP-CH17 | Nhãn chương và thước tiến độ cố định | CSS, SVG, Canvas | nhẹ | CL-04, CL-05, CL-09, CL-13 | LM-01, LM-02, LM-03, LM-04 | 7 |
| TP-CH18 | Nhãn nhỏ viết hoa đánh số ý (eyebrow label) | CSS, SVG, GSAP | nhẹ | CL-04, CL-09, CL-16 | LM-01, LM-02, LM-03, LM-04 | 7 |
| TP-CH19 | Chữ viết tay vẽ dần theo lời | SVG, Canvas, GSAP | nhẹ | CL-03, CL-10 | LM-02, LM-03 | 4 |
| TP-CH20 | Băng chữ chạy ngang | CSS, Canvas | nhẹ | CL-01, CL-11 | LM-01, LM-02, LM-03, LM-04 | 3 |
| TP-CH21 | Chữ chìm cỡ lớn mờ phía sau tiêu đề | CSS, SVG | nhẹ | CL-15, CL-09 | LM-01, LM-02, LM-03, LM-04 | 1 |

### TP-CH01 Chữ hiện bằng mặt nạ trượt, từng từ hoặc từng ký tự

- **Cách làm** (tham số từ: mẫu): Chữ không hiện bằng mờ dần mà trồi lên qua một đường mặt nạ (clip) từ dưới lên, từng từ đúng nhịp; mỗi ký tự có lò xo riêng (dịch dọc, độ mờ, nhoè), trễ 125 ms ở 120 BPM; chỉ một từ khoá mang màu nhấn. Số liệu lớn vào bằng cắt đẩy kèm vệt mờ dọc.
- **Lỗi hay gặp:** Chữ trồi lên mà không có mặt nạ cắt thì thấy chữ chạy ngoài vùng chữ.
- **Mẫu nguồn:** `twoclipping-000267`, `techhalla-498547`, `0xnicc0-516612`, `heyiamnick-119558` (trạng thái: nháp)

### TP-CH02 Gõ từng ký tự có con trỏ nhấp nháy

- **Cách làm** (tham số từ: mẫu + đề xuất): Chữ gõ từng ký tự, con trỏ nhấp nháy. Đề xuất 25–40 ký tự mỗi giây và con trỏ nhấp một lần mỗi 0,5 s. Biến thể: ô nhập chữ có nhãn các lựa chọn phía trên; cửa sổ terminal giả gõ tin nhắn rồi hiện kết quả; mở bằng dòng lệnh với danh sách trạng thái '[ ok ]' hiện từng dòng; phụ đề gõ theo giọng sau con trỏ khối.
- **Lỗi hay gặp:** Gõ đều tuyệt đối làm chữ hiện có nhịp cơ học; thêm nghỉ ngắn ở dấu cách và dấu câu (đề xuất).
- **Mẫu nguồn:** `ho-ba-761062`, `majorbaguette-834228`, `ann-nnng-852885`, `robvjourney-237474`, `lester-tyy-480587`, `madhav-xo-524440`, `twoclipping-041659` (trạng thái: nháp)

### TP-CH03 Chữ khổng lồ, mỗi ý một nhịp

- **Cách làm** (tham số từ: mẫu): Một ý mỗi nhịp 1–2 s; chữ sans-serif cực đậm khít nhau chiếm gần hết khung; nền đổi màu theo ý; một từ khổng lồ mở đầu hoặc làm cảnh nhấn; câu kết bằng chấm tròn nổi khối; chữ xoay chồng lấn tràn khỏi khung ở cảnh cuối. Bản dọc: một chữ một ô, dùng bố cục chữ và số toàn khung.
- **Lỗi hay gặp:** Quá 2 s một ý thì người xem đọc xong và chờ; chữ khổng lồ bị cắt ở mép nếu không đo bằng phông thật.
- **Mẫu nguồn:** `0xfemyn-137833`, `melvynx-638493`, `souravbhar871-477361`, `ishaaqahamed-107563`, `pankajkumar-dev-718609`, `zheke-622583`, `kloss-xyz-941143` (trạng thái: nháp)

### TP-CH04 Tiêu đề hai dòng, dòng hai màu nhấn

- **Cách làm** (tham số từ: mẫu): Tiêu đề hai dòng: dòng đầu trắng hoặc đen đậm, dòng hai màu nhấn (xanh dương, cam, vàng, đỏ cho vấn đề và cyan cho giải pháp), hoặc xám nhạt, hoặc in nghiêng. Dòng hai thường là kết luận. Nhãn mục nhỏ phía trên.
- **Lỗi hay gặp:** Dùng nhiều hơn một màu nhấn trong cùng tiêu đề thì mất ý nghĩa của màu.
- **Mẫu nguồn:** `rammanq-034553`, `sachaarbonel-673648`, `gautam-mer1-530003`, `alex-prompter-997524`, `ezshine-750731`, `ceowinkz-683602`, `ratheejaisal-154698`, `kloss-xyz-067876`, `felipemoller-936736` (trạng thái: nháp)

### TP-CH05 Từ nhấn bằng serif nghiêng màu nhấn; câu chốt serif nghiêng

- **Cách làm** (tham số từ: mẫu): Trong dòng sans đậm, một từ đổi sang serif nghiêng màu nhấn (san hô, đất nung, cam, vàng); câu chốt cuối là một câu serif nghiêng trắng trên nền đen thay cho logo; dòng khẩu hiệu serif nghiêng nhỏ dưới tên in đậm.
- **Lỗi hay gặp:** Nhấn nhiều từ trong một cảnh thì không còn từ nào nổi.
- **Mẫu nguồn:** `kloss-xyz-941143`, `gouthamjay8-910269`, `amitsingha89-780553`, `1littlecoder-378066`, `spearwtf-029058`, `nolkeeg-635633`, `johnsavage-ai-427263`, `iammxfschr-955831` (trạng thái: nháp)

### TP-CH06 Từ khoá nền chip hoặc bóng đổ lệch hai lớp

- **Cách làm** (tham số từ: mẫu): Từ khoá nổi bằng nền chip màu (xanh chanh chữ đen như nét bút dạ quang; chip nền màu như đánh dấu bút trong tiêu đề) hoặc bóng đổ lệch hai lớp (đỏ rồi đen) để nổi khối mà vẫn phẳng; chip dạng pill chứa từ khoá dưới tiêu đề.
- **Lỗi hay gặp:** Chip che mất phần chữ khi chữ đổi cỡ giữa chừng.
- **Mẫu nguồn:** `majorbaguette-834228`, `bizibeast-505124`, `souravbhar871-477361`, `amitsingha89-780553` (trạng thái: nháp)

### TP-CH07 Gạch ngang chữ cũ rồi thay bằng chữ mới

- **Cách làm** (tham số từ: mẫu): Câu có chữ bị gạch ngang (vấn đề), chữ mới đặt ở dòng dưới hoặc lớn bên cạnh (dạng 'Not a week. About 6 minutes.'); lịch ô gạch X đỏ hiện dần dưới dòng 'Weeks of work' để thấy thời gian trôi.
- **Lỗi hay gặp:** Đường gạch vẽ xong sau khi chữ mới đã hiện thì mất ý đối chiếu.
- **Mẫu nguồn:** `sudo-kiran-335993`, `kmasiff-549880`, `ajith-io-208546` (trạng thái: nháp)

### TP-CH08 Gạch chân và vòng vẽ tay quanh từ khoá

- **Cách làm** (tham số từ: mẫu): Gạch chân nét cam vẽ lên khoảng 0,4 s dưới từ khoá; gạch chân lượn màu đỏ dưới thẻ chốt hai vế đối xứng; vòng tròn vẽ một nét quanh từ khái niệm serif lớn, có chữ Hán mờ phía sau.
- **Lỗi hay gặp:** Nét vẽ có độ dày đều và đường thẳng tuyệt đối trông như vector, không như nét tay; thêm lệch nhẹ.
- **Mẫu nguồn:** `redpersongpt-284430`, `sudo-kiran-254201`, `daniel-mac8-306214`, `deedydas-252537` (trạng thái: nháp)

### TP-CH09 Thay từ cuối câu trong khung câu cố định

- **Cách làm** (tham số từ: mẫu): Khung câu cố định ('I CAN' ở trên), từ cuối đổi liên tục kèm đổi nền cho mỗi từ; hoặc thay từ cuối bằng mờ nét rồi hiện từ mới, giữ nguyên phần câu còn lại. Từ khoá đặt ngay dưới khối 3D để chữ gắn với vật thể.
- **Lỗi hay gặp:** Từ mới dài hơn từ cũ làm phần câu cố định xê dịch; cố định chiều rộng vùng từ đổi.
- **Mẫu nguồn:** `zheke-622583`, `iammxfschr-955831` (trạng thái: nháp)

### TP-CH10 Chữ cắt lát ngang trượt lệch rồi khớp lại

- **Cách làm** (tham số từ: mẫu): Chữ cắt thành 5–6 dải ngang trượt lệch nhau rồi ghép lại đúng nhịp (ví dụ chữ 'SNAP'); chữ khổng lồ bị khe sáng cắt đôi rồi khép lại thành tên.
- **Lỗi hay gặp:** Dải cắt tính theo pixel làm sai khi đổi khổ khung; tính theo tỷ lệ chiều cao chữ.
- **Mẫu nguồn:** `lukasersil-726495`, `zheke-622583`, `prasenx-693512` (trạng thái: nháp)

### TP-CH11 Chữ viền rỗng chạy trên nền chất lỏng

- **Cách làm** (tham số từ: mẫu): Chữ viền rỗng (outline) chạy trên nền chất lỏng do shader tính để chữ nhẹ mà vẫn đọc được; chữ lớn có nhoè chuyển động kèm bản viền lặp phía sau.
- **Lỗi hay gặp:** Nền chất lỏng sáng quá làm viền rỗng mất độ tương phản.
- **Mẫu nguồn:** `prasenx-693512`, `0xvalure-331584` (trạng thái: nháp)

### TP-CH12 Chữ hình thành từ hạt tụ lại

- **Cách làm** (tham số từ: mẫu): Chữ hình thành từ hạt bụi tụ lại; hoặc chữ rơi thành hạt rồi tụ thành quả cầu có chữ chạy trên mặt; hoặc chữ từ nhiễu mờ chuyển sang rõ nét kèm quầng sáng.
- **Lỗi hay gặp:** Số hạt quá ít thì chữ cuối không đủ nét đọc; hạt đích lấy mẫu từ hình chữ ở độ phân giải khung xuất.
- **Mẫu nguồn:** `nolkeeg-635633`, `ajith-io-562538`, `johnsavage-ai-427263` (trạng thái: nháp)

### TP-CH13 Kết cấu bên trong nét chữ

- **Cách làm** (tham số từ: mẫu): Chữ lớn có kết cấu bên trong nét (thiên hà trong chữ); chữ gradient pastel mảnh trên nền đen; chữ gradient lớn trên tiêu đề lưới bento. Dòng nhỏ serif nghiêng phía trên chữ đậm để tạo nhịp đọc.
- **Lỗi hay gặp:** Kết cấu chuyển động mạnh bên trong chữ mảnh làm chữ khó đọc.
- **Mẫu nguồn:** `miaai-lab-774895`, `viktoroddy-402509`, `gautam-mer1-530003`, `sudo-kiran-254201` (trạng thái: nháp)

### TP-CH14 Chữ có vai vật lý: mỗi từ là một hiện tượng của trường

- **Cách làm** (tham số từ: mẫu): Mỗi từ là một hiện tượng của trường: WAIT là tấm đẩy làm chữ nghiêng tránh ra; WAITING là đường sức võng dưới tải; ROOM là điểm không; FLOOR là trường dẹt thành mặt phẳng. Vai vật lý nảy ra từ chính hình chữ phản ứng với trường, không phải từ minh hoạ thêm vào. Hạt bụi sắt xác định theo băm của id và thời gian; dừng tuyệt đối tối thiểu 400 ms trước đoạn kết. Cấu hình mẫu: 1080×1080, 20 s, 60 khung mỗi giây, một file HTML, hiểu được khi tắt tiếng.
- **Lỗi hay gặp:** Lời nguyên văn phải khoá cứng; thêm hoặc bớt chữ làm sai quy tắc vật lý gán cho từng từ (đã ghi trong prompt mẫu).
- **Mẫu nguồn:** `gdgtify-130294`, `gdgtify-929495`, `gdgtify-393073`, `gdgtify-989608` (trạng thái: nháp)

### TP-CH15 Phụ đề từng từ theo giọng, và vùng an toàn khổ dọc

- **Cách làm** (tham số từ: mẫu): Phụ đề một dòng ở đáy khớp giọng đọc; từ đang đọc tô màu nhấn (một từ tô vàng); mốc từng từ lấy từ Whisper (nguồn gốc còn dùng cách khác, Media chỉ dùng Whisper); phụ đề burn-in (vẽ cứng vào hình) vì phần lớn xem khi tắt tiếng. Khổ dọc: phụ đề cách mép dưới tối thiểu 20% chiều cao để tránh nút của mạng xã hội; đo bằng phông thật rồi co để vừa vùng an toàn 9:16. Mỗi ý có phụ đề giữ tối thiểu 2,5 s.
- **Lỗi hay gặp:** Mốc từng từ lệch so với giọng thì từ sáng sai chỗ; câu dài hơn vùng an toàn thì bị cắt ở mép.
- **Mẫu nguồn:** `notdwd-998633`, `linearuncle-971663`, `ajith-io-208546`, `doubleunplussed-181894`, `sab8a-475686`, `bilimfili1-459762`, `l3d1c-632524`, `tak3sh8-441895` (trạng thái: nháp)

### TP-CH16 Nhãn đơn cách (monospace) ở bốn góc

- **Cách làm** (tham số từ: mẫu + đề xuất): Nhãn chữ monospace rất nhỏ ở bốn cạnh khung (mã cảnh, timecode, trạng thái, tên dự án, 'BAR n / BPM'), cố định suốt video, chỉ đổi nhãn cảnh khi chuyển cảnh; không che nội dung chính. Đề xuất cỡ chữ khoảng 1,2% chiều cao khung. Biến thể: đồng hồ thời gian ở góc trên phải như khung phần mềm dựng; thanh trạng thái kiểu terminal ở đầu khung.
- **Lỗi hay gặp:** Cỡ quá nhỏ thì mờ hẳn khi nén video; quá lớn thì tranh chú ý với nội dung.
- **Mẫu nguồn:** `anabology-491441`, `pound75423-464968`, `monokern-832979`, `ann-nnng-852885`, `madhav-xo-524440`, `lukasersil-726495`, `heyiammallik-293397`, `pankajkumar-dev-718609`, `chatgptastra-807540` (trạng thái: nháp)

### TP-CH17 Nhãn chương và thước tiến độ cố định

- **Cách làm** (tham số từ: mẫu): Nhãn chương ở góc trên trái ('03 / 08' kèm tên mục) cùng thanh mốc thời gian mảnh ở góc trên phải; hoặc thanh mốc chương ở đáy khung, mốc đang chạy có nhãn tên; thanh tiến trình mảnh chạy suốt video ở chân khung; thanh tab cố định ở đầu khung, mục đang nói sáng lên; thanh nhãn liệt kê các lớp và đánh dấu lớp đang xem.
- **Lỗi hay gặp:** Thước tiến độ không khớp thời lượng thật thì người xem đoán sai độ dài còn lại.
- **Mẫu nguồn:** `kloss-xyz-067876`, `henkvaness-975279`, `chatgptastra-807540`, `nolkeeg-635633`, `sab8a-475686`, `kmasiff-549880`, `emollick-019567` (trạng thái: nháp)

### TP-CH18 Nhãn nhỏ viết hoa đánh số ý (eyebrow label)

- **Cách làm** (tham số từ: mẫu): Nhãn nhỏ viết hoa kèm chấm cam hoặc gạch ngang phía trên tiêu đề, đánh số hoặc gọi tên chủ đề của cảnh ('01 / COLLECT', 'WHY IT MATTERS'); số bước lớn '03' bằng chữ gradient pastel kèm tiêu đề ngắn bên cạnh; huy hiệu số tròn vàng ở góc thẻ.
- **Lỗi hay gặp:** Số nhãn không khớp thứ tự cảnh khi dựng lại hoặc đổi thứ tự cảnh.
- **Mẫu nguồn:** `sachaarbonel-673648`, `amitsingha89-780553`, `wani-shola-459278`, `gouthamjay8-910269`, `miskinho-956105`, `sudo-kiran-254201`, `alex-prompter-997524` (trạng thái: nháp)

### TP-CH19 Chữ viết tay vẽ dần theo lời

- **Cách làm** (tham số từ: mẫu + đề xuất): Chữ viết tay vẽ dần bằng stroke-dashoffset (phông Caveat): đường nét chữ có dash dài bằng tổng độ dài nét, dashoffset giảm về 0 theo thời gian; cây bút hiển thị đi theo nét đang vẽ. Mỗi cảnh một tiêu đề câu hoàn chỉnh viết tay ở trên, nội dung vẽ dần bên dưới, câu thuyết minh hiện ở chân khung.
- **Lỗi hay gặp:** Phông có nét giao nhau cần tách từng nét; nếu mọi nét chạy cùng tốc độ thì trông không giống viết (đề xuất đổi tốc độ theo độ dài nét).
- **Mẫu nguồn:** `ik-builds-585923`, `tak3sh8-441895`, `groundcontrol-230877`, `ajith-io-615243` (trạng thái: nháp)

### TP-CH20 Băng chữ chạy ngang

- **Cách làm** (tham số từ: mẫu): Băng chữ nhỏ chạy ngang ở đầu và chân khung lặp các từ khoá, cách nhau bằng chấm tròn; băng chéo kiểu băng cảnh báo cắt ngang khung, mỗi băng chứa một chuỗi khẩu hiệu ngắn.
- **Lỗi hay gặp:** Băng chạy liên tục tranh chú ý với nội dung chính; chỉ dùng ở cảnh nhấn.
- **Mẫu nguồn:** `ishaaqahamed-107563`, `0xvalure-331584`, `robvjourney-237474` (trạng thái: nháp)

### TP-CH21 Chữ chìm cỡ lớn mờ phía sau tiêu đề

- **Cách làm** (tham số từ: mẫu): Năm hoặc số cỡ lớn, mờ, làm hình chìm phía sau tiêu đề trên thẻ nền màu đặc; mỗi mốc một hình minh hoạ phẳng chỉ một ký hiệu. Hợp Media thấp, hợp video dòng thời gian.
- **Lỗi hay gặp:** Chữ chìm đậm quá thì lấn tiêu đề.
- **Mẫu nguồn:** `triglyceee-161719` (trạng thái: nháp)

## TP-SL — số liệu, đồ thị, bản đồ

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-SL01 | Thanh ngang dài ra trước, số hiện sau; xếp hạng đổi chỗ | SVG, GSAP, Canvas, Remotion | nhẹ | CL-04, CL-05, CL-16 | LM-01, LM-02, LM-03, LM-04 | 3 |
| TP-SL02 | Đường đồ thị tự vẽ, chấm kéo theo và hộp nhãn độ nhạy | SVG, GSAP, Canvas, Remotion | nhẹ | CL-05, CL-04 | LM-01, LM-02, LM-03, LM-04 | 6 |
| TP-SL03 | Bộ đếm số chạy | Canvas, GSAP, CSS, Remotion | nhẹ | CL-01, CL-04, CL-05, CL-11, CL-16 | LM-01, LM-02, LM-03, LM-04 | 8 |
| TP-SL04 | Con số lớn đơn độc kèm đơn vị và một dòng giải nghĩa | CSS, SVG, Remotion | nhẹ | CL-01, CL-09, CL-11 | LM-01, LM-02, LM-03, LM-04 | 5 |
| TP-SL05 | Con dấu cao su đóng nghiêng cạnh số lớn | SVG, Canvas, GSAP | nhẹ | CL-10, CL-09 | LM-02, LM-03 | 1 |
| TP-SL06 | Lưới ô sáng dần theo tỷ lệ và ma trận chấm | SVG, Canvas, Three.js | nhẹ | CL-05, CL-09, CL-14 | LM-01, LM-02, LM-03, LM-04 | 6 |
| TP-SL07 | Đồng hồ đo bán nguyệt có vùng màu và kim quay | SVG, Canvas, GSAP | nhẹ | CL-05, CL-09, CL-15 | LM-01, LM-02, LM-03, LM-04 | 2 |
| TP-SL08 | Hai số so sánh trên khung biên lai | SVG, CSS, GSAP | nhẹ | CL-04, CL-05, CL-09 | LM-01, LM-02, LM-03, LM-04 | 2 |
| TP-SL09 | Hai dải thời gian song song | Canvas, SVG | nhẹ | CL-05, CL-14, CL-15 | LM-02, LM-03 | 1 |
| TP-SL10 | Đồ thị vị trí theo thời gian cạnh dãy ô minh hoạ nhịp | SVG, Canvas, GSAP | nhẹ | CL-03, CL-05 | LM-02, LM-03, LM-07 | 2 |
| TP-SL11 | Bản đồ chấm, địa cầu chấm, bản đồ nét tay | SVG, Canvas, Three.js | nhẹ | CL-05, CL-10, CL-12 | LM-02, LM-03 | 6 |
| TP-SL12 | Sơ đồ Venn hai vòng với vùng giao tô màu | SVG, CSS | nhẹ | CL-09, CL-11 | LM-01, LM-02, LM-03, LM-04 | 1 |
| TP-SL13 | Quả bóng lăn theo gradient trên bề mặt hàm số | Three.js, Canvas | vừa | CL-14, CL-06 | LM-02, LM-03 | 1 |
| TP-SL14 | Số liệu từ mô phỏng tính thật | Canvas, Three.js | vừa | CL-14, CL-05 | LM-02, LM-03 | 4 |
| TP-SL15 | Sơ đồ nối nút bằng đường mảnh phát sáng | SVG, Canvas, GSAP | nhẹ | CL-04, CL-09 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-SL16 | Trang tóm tắt cuối | SVG, CSS, GSAP | nhẹ | CL-03, CL-05, CL-09, CL-10 | LM-02, LM-03, LM-07 | 4 |
| TP-SL17 | Danh sách bước ba trạng thái, thanh bước và thước đo cạnh vật (bàn thao tác) | Canvas, SVG, GSAP | nhẹ | CL-09, CL-03 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-SL18 | Chú thích: khung bao, nhãn khác màu và mũi tên cong | SVG, Canvas, GSAP | nhẹ | CL-03, CL-04, CL-07, CL-09, CL-10 | LM-02, LM-03, LM-07 | 5 |
| TP-SL19 | Dựng hình đọc thẳng bảng dữ liệu có nguồn | Three.js, Canvas, Remotion | nhẹ | CL-13, CL-14, CL-06 | LM-02, LM-03 | 2 |
| TP-SL20 | Thẻ chỉ số | CSS, SVG, GSAP | nhẹ | CL-04, CL-09, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |

### TP-SL01 Thanh ngang dài ra trước, số hiện sau; xếp hạng đổi chỗ

- **Cách làm** (tham số từ: mẫu): Biểu đồ thanh ngang: thanh dài ra trước, số hoặc phần trăm ở đầu thanh chỉ hiện sau khi thanh tới nơi; logo ở đầu thanh. Bản xếp hạng: cột đổi chỗ khi thứ hạng đổi và số chạy theo thời gian. Biến thể: bảng đua dọc, mỗi mục là ô bo góc đổi hạng theo số bước, mục chính viền sáng.
- **Lỗi hay gặp:** Số hiện cùng lúc với thanh thì người xem không thấy mối quan hệ dài ngắn và số; đổi chỗ cột không có chuyển động trung gian thì khó theo dõi.
- **Mẫu nguồn:** `rammanq-034553`, `ratheejaisal-154698`, `marklaunches-041046` (trạng thái: nháp)

### TP-SL02 Đường đồ thị tự vẽ, chấm kéo theo và hộp nhãn độ nhạy

- **Cách làm** (tham số từ: mẫu): Đường tự vẽ theo đáp ứng lò xo (hoặc stroke-dashoffset), vượt đích rất nhỏ rồi lắng cạnh nhãn (ví dụ '+22%'); đường tăng trưởng có thể phát sáng chạy lên góc phải. Chấm kéo theo đường dọc nét đứt và hộp nhãn độ nhạy ('Rates +0.80% / −4.29%'). Chú giải hiện theo con trỏ (video: con trỏ ảo chạy theo kịch bản).
- **Lỗi hay gặp:** Đường vẽ nhanh hơn lời đọc thì số liệu xuất hiện trước khi được nói tới.
- **Mẫu nguồn:** `rossaxbt-707651`, `morse-369333`, `viktoroddy-402509`, `rammanq-034553`, `twoclipping-747965`, `annacher-433425` (trạng thái: nháp)

### TP-SL03 Bộ đếm số chạy

- **Cách làm** (tham số từ: mẫu): Số lớn đếm lên hoặc xuống kèm đơn vị nhỏ. Bộ đếm chạy tuyến tính trên đồng hồ toàn phim nên vẫn chạy khi cắt cảnh; dùng chữ số độ rộng bằng nhau (tabular) để không rung; bộ đếm đọc thời gian của khung chính, không phải khung phụ, nếu không chữ số bị nhoè. Biến thể: thẻ giá số chạy giảm kèm nhãn phần trăm rồi đổi sang số chạy tăng ở cảnh giải pháp; thẻ giá nhỏ rơi vào khung cộng thành tổng đỏ lớn; đồng hồ đếm ngược có chip đỏ khi bị vượt.
- **Lỗi hay gặp:** Phông chữ số có độ rộng thay đổi làm số rung khi đếm; bộ đếm chạy theo khung phụ thì chữ số nhoè.
- **Mẫu nguồn:** `nolkeeg-635633`, `deedydas-252537`, `notdwd-998633`, `ceowinkz-683602`, `bizibeast-505124`, `kmasiff-549880`, `viktoroddy-402509`, `marklaunches-041046` (trạng thái: nháp)

### TP-SL04 Con số lớn đơn độc kèm đơn vị và một dòng giải nghĩa

- **Cách làm** (tham số từ: mẫu): Một con số lớn ở giữa khung, đơn vị nhỏ bên cạnh, một dòng nhỏ giải nghĩa ngay dưới; hoặc một câu serif nghiêng dưới số; hoặc số chiếm giữa khung trên nền màu đặc ('60x' nền đỏ).
- **Lỗi hay gặp:** Thêm nhiều chữ cạnh con số làm mất cảnh nhấn một con số.
- **Mẫu nguồn:** `nolkeeg-635633`, `alex-prompter-997524`, `deedydas-252537`, `henkvaness-975279`, `heyiammallik-293397` (trạng thái: nháp)

### TP-SL05 Con dấu cao su đóng nghiêng cạnh số lớn

- **Cách làm** (tham số từ: mẫu + đề xuất): Con số lớn kèm con dấu cao su xanh đóng nghiêng ('280% of normal') để nhấn mạnh so với bình thường. Đề xuất góc nghiêng 5–8 độ; dấu đóng xuống với scale 1,3 → 1,0 trong 0,15 s, kèm tiếng đóng dấu.
- **Lỗi hay gặp:** Dấu nghiêng quá nhiều làm chữ trong dấu khó đọc.
- **Mẫu nguồn:** `groundcontrol-230877` (trạng thái: nháp)

### TP-SL06 Lưới ô sáng dần theo tỷ lệ và ma trận chấm

- **Cách làm** (tham số từ: mẫu): Lưới ô trong đó 31% ô sáng, kèm nhãn chỉ vài ô đặc biệt; lưới ô vuông sáng dần theo giá trị để thể hiện lịch sử; ma trận chấm LED dựng con số lớn kèm thanh tiến trình ngay dưới; lưới chấm đen kín khung biểu diễn con số lớn. Biến thể: 8.144 viên bi, mỗi bi bằng 1 triệu người, dữ liệu dân số 2024.
- **Lỗi hay gặp:** Số ô sáng làm tròn lệch tỷ lệ thật (ví dụ 31% của 100 ô thì đủ 31 ô, không làm tròn thành 30).
- **Mẫu nguồn:** `deedydas-252537`, `ratheejaisal-154698`, `robvjourney-237474`, `melvynx-638493`, `rneayan-417829`, `sudo-kiran-335993` (trạng thái: nháp)

### TP-SL07 Đồng hồ đo bán nguyệt có vùng màu và kim quay

- **Cách làm** (tham số từ: mẫu): Đồng hồ bán nguyệt có vùng xanh, vàng, đỏ và kim quay thể hiện mức dùng so với giới hạn; biến thể đồng hồ 0–100 chạy theo thời gian thật 3,4 s, xi-lanh nháy đúng thứ tự nổ.
- **Lỗi hay gặp:** Kim vượt đích rồi nảy lại (kiểu lò xo vọt lớn) làm giá trị đọc sai; dùng lò xo gần như không vượt.
- **Mẫu nguồn:** `daniel-mac8-306214`, `dys-hay-749645` (trạng thái: nháp)

### TP-SL08 Hai số so sánh trên khung biên lai

- **Cách làm** (tham số từ: mẫu): Khung biên lai ở cuối: hai dòng số so sánh (26,000 s và 0.038 s); hoặc thanh ngang so sánh trước và sau; vòng tròn kiểm tra có tick quanh vòng.
- **Lỗi hay gặp:** Hai số khác đơn vị trên cùng một thang làm thanh so sánh sai tỷ lệ.
- **Mẫu nguồn:** `deedydas-252537`, `prasad-pilla-496049` (trạng thái: nháp)

### TP-SL09 Hai dải thời gian song song

- **Cách làm** (tham số từ: mẫu): Hai dải thời gian chạy song song: một bên hành trình photon, một bên sự kiện trên Trái Đất cùng thời kỳ; kèm cảnh thu phóng từ cảnh lớn xuống mặt cắt Mặt Trời có nhãn các lớp dọc cạnh trái.
- **Lỗi hay gặp:** Hai dải không chung thang thời gian thì so sánh sai.
- **Mẫu nguồn:** `astrothewizard-618782` (trạng thái: nháp)

### TP-SL10 Đồ thị vị trí theo thời gian cạnh dãy ô minh hoạ nhịp

- **Cách làm** (tham số từ: mẫu): Đồ thị vị trí–thời gian đặt cạnh dãy ô minh hoạ nhịp để so chuyển động tuyến tính với chuyển động làm mượt; hoặc đường easing vẽ trực tiếp với hai tay nắm và số timecode. Dùng khi chính video giải thích chuyển động hoặc đạo hàm.
- **Lỗi hay gặp:** Trục không ghi đơn vị thì người xem không đọc được độ dốc.
- **Mẫu nguồn:** `chatgptastra-807540`, `prasenx-693512` (trạng thái: nháp)

### TP-SL11 Bản đồ chấm, địa cầu chấm, bản đồ nét tay

- **Cách làm** (tham số từ: mẫu): Bản đồ chấm với nhãn ghim nhỏ; địa cầu bằng chấm trên nền đen kèm số đếm và nhãn mono nhỏ; bản đồ nét tay có vùng tô và nhãn chữ viết tay; tuyến đỏ vẽ một nét rồi đóng dấu trên giấy da. Với video lịch sử, bản đồ chỉ làm nền và niên đại phải đối chiếu trước khi giao.
- **Lỗi hay gặp:** Dùng tên địa danh hoặc ranh giới sai niên đại ở video lịch sử.
- **Mẫu nguồn:** `ratheejaisal-154698`, `manuelogomigo-052364`, `groundcontrol-230877`, `nft-chen-068069`, `milos-gis-317580`, `dotey-927166` (trạng thái: nháp)

### TP-SL12 Sơ đồ Venn hai vòng với vùng giao tô màu

- **Cách làm** (tham số từ: mẫu): Sơ đồ Venn hai vòng, vùng giao tô màu nhấn và ghi một từ, thay một đoạn giải thích dài; đặt trên thẻ nền kem xen với thẻ nền đen ghi trích dẫn.
- **Lỗi hay gặp:** Ghi quá một từ trong vùng giao thì không còn thay được đoạn giải thích.
- **Mẫu nguồn:** `chrisjdimarco-808196` (trạng thái: nháp)

### TP-SL13 Quả bóng lăn theo gradient trên bề mặt hàm số

- **Cách làm** (tham số từ: mẫu): Bề mặt hàm số 3D tô màu theo độ cao (cam ở đỉnh, xám ở sườn, xanh ngọc ở đáy); hai nhãn bo viền có đường dẫn chỉ đỉnh và đáy; quả bóng lăn theo gradient thật; bên dưới hiện 'Step n of N', giá trị mất mát và đồ thị mất mát nhỏ vẽ dần; so sánh ba tốc độ học bằng ba quả bóng ba màu (nhỏ thì bò, lớn thì zig-zag, vừa đúng); máy quay quỹ đạo chậm trong lúc công thức hiện dần.
- **Lỗi hay gặp:** Quả bóng đi theo đường vẽ tay thay vì tính gradient thật thì sai điểm kết luận của bài.
- **Mẫu nguồn:** `anirockshady-032809` (trạng thái: nháp)

### TP-SL14 Số liệu từ mô phỏng tính thật

- **Cách làm** (tham số từ: mẫu): Hiện tượng phải được tính, không vẽ: bước ngẫu nhiên là bước ngẫu nhiên thật, số liệu thật (nhiệt độ lõi, quãng đường, thời gian), nói thẳng độ bất định. Cách làm: chạy mô phỏng một lần, ghi mảng trạng thái theo thời gian, hình và bộ đếm cùng đọc mảng đó (hàm của t); bộ đếm số va chạm chạy theo mô phỏng hiện trong hộp tối ở góc trên; âm click phát từ cùng dữ liệu nảy.
- **Lỗi hay gặp:** Mô phỏng dùng hạt giống ngẫu nhiên không cố định thì chạy lại ra kết quả khác.
- **Mẫu nguồn:** `astrothewizard-618782`, `apoorvjain25-945542`, `cagrimbakirci-842869`, `cyrilxbt-149036` (trạng thái: nháp)

### TP-SL15 Sơ đồ nối nút bằng đường mảnh phát sáng

- **Cách làm** (tham số từ: mẫu): Sơ đồ hub: logo ở giữa, đường chấm đỏ toả tới bốn công cụ có nhãn; sơ đồ phân nhánh từ một khối mã sang danh sách sáu mô hình bằng đường mảnh phát sáng, ba dòng kiểm có tick bên dưới; sơ đồ một nút nối ba đích bằng đường cong có thanh tín hiệu; sơ đồ cơ chế nét mảnh có nút phát sáng cam, mỗi chương một sơ đồ.
- **Lỗi hay gặp:** Đường nối cắt ngang nhãn hoặc ô khác (cần kiểm ô chồng ô và mũi tên cắt ngang trước khi giao).
- **Mẫu nguồn:** `melvynx-638493`, `ezshine-750731`, `ceowinkz-683602`, `kloss-xyz-067876` (trạng thái: nháp)

### TP-SL16 Trang tóm tắt cuối

- **Cách làm** (tham số từ: mẫu): Trang tóm tắt cuối gồm bốn ý đánh số; hoặc bảng tóm tắt 'toàn bộ câu chuyện' đánh số, mục chính tô đỏ dần theo lời; hoặc lưới 3×3 ô cảnh nhỏ nối bằng đường nét đứt về ô giữa, ô xong có tick xanh; danh sách quy tắc có biểu tượng nét mảnh.
- **Lỗi hay gặp:** Tóm tắt thêm ý chưa nói trong video thì người xem không thấy nguồn.
- **Mẫu nguồn:** `linearuncle-971663`, `tak3sh8-441895`, `daniel-mac8-306214`, `henkvaness-975279` (trạng thái: nháp)

### TP-SL17 Danh sách bước ba trạng thái, thanh bước và thước đo cạnh vật (bàn thao tác)

- **Cách làm** (tham số từ: mẫu): Thanh tiến trình 5–6 bước ở đỉnh hoặc chân khung (bước đang làm tô màu, bước xong có dấu tích); danh sách thành phần ở cột trái: mục đang làm có mũi tên, mục xong có tick, mục chưa tới mờ; thẻ bước cạnh vật thể ghi lượng cỡ lớn kèm thanh đo chạy từ 0 đến đủ lượng; vạch chia (1-2-3 oz) bên cạnh vật để thấy mức dâng theo từng bước. Đây là phần lõi của bố cục bàn thao tác.
- **Lỗi hay gặp:** Thước đo và mức dâng không khớp nhau thì người xem đọc sai lượng.
- **Mẫu nguồn:** `sarut0bisasuke-069973`, `ror-fly-880547`, `ajith-io-208546`, `prasad-pilla-496049` (trạng thái: nháp)

### TP-SL18 Chú thích: khung bao, nhãn khác màu và mũi tên cong

- **Cách làm** (tham số từ: mẫu): Khung bao quanh phần công thức đang nhấn kèm nhãn nhỏ khác màu giải thích từng phần; chú thích viết tay màu xanh và đỏ có mũi tên cong chỉ đúng vào chuyển động cần xem; hình minh hoạ có nhãn viết tay nối bằng mũi tên cong vào từng bộ phận; khung chọn kiểu Figma có tay cầm và nhãn kích thước quanh từ khoá; nhãn bo viền có đường dẫn tới bộ phận.
- **Lỗi hay gặp:** Nhãn bám vật 3D không dùng phép chiếu máy quay thì lệch khi máy quay di chuyển.
- **Mẫu nguồn:** `linearuncle-971663`, `chatgptastra-807540`, `sudo-kiran-254201`, `ajith-io-615243`, `ann-nnng-852885` (trạng thái: nháp)

### TP-SL19 Dựng hình đọc thẳng bảng dữ liệu có nguồn

- **Cách làm** (tham số từ: mẫu): Lập bảng nguồn trước khi dựng: mỗi mục ghi kích thước, vật liệu, người sử dụng, nguồn và mức tin cậy; script dựng đọc thẳng bảng nên mọi chi tiết trên màn hình truy được về nguồn. Cùng nguyên tắc với quy tắc của Media: file dữ kiện là nguồn duy nhất cho số trên màn hình. Mẫu khác: đánh dấu 15 chỗ kích thước in không khớp tường vẽ thay vì đoán.
- **Lỗi hay gặp:** Gõ tay số vào mã dựng thì số trên màn hình và file dữ kiện lệch nhau.
- **Mẫu nguồn:** `alexalbert-274839`, `aayush4soni-644283` (trạng thái: nháp)

### TP-SL20 Thẻ chỉ số

- **Cách làm** (tham số từ: mẫu): Thẻ chỉ số xếp dọc: số lớn bên trái, mô tả nhỏ bên phải; ba thẻ trắng ngang hàng, mỗi thẻ một huy hiệu số tròn vàng ở góc trên trái; lưới thẻ bento bo góc có một ô nổi lớn bên dưới tiêu đề.
- **Lỗi hay gặp:** Mô tả dài hơn hai dòng làm thẻ mất cân đối.
- **Mẫu nguồn:** `wani-shola-459278`, `alex-prompter-997524`, `gautam-mer1-530003`, `sudo-kiran-254201` (trạng thái: nháp)

## TP-3D — hình 3D, máy quay, ánh sáng, vật liệu

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-3D01 | Máy quay đẩy thẳng hoặc bay chậm theo đường cong | Three.js, Remotion | vừa | CL-06, CL-08, CL-13 | LM-02, LM-03, LM-05 | 5 |
| TP-3D02 | Máy quay quỹ đạo chậm quanh vật, hoặc khoá chính diện | Three.js | vừa | CL-06, CL-07, CL-13, CL-14 | LM-02, LM-03, LM-05 | 3 |
| TP-3D03 | Camera đẳng cự đứng yên, đồ vật xuất hiện lần lượt | Three.js, GSAP | vừa | CL-13 | LM-02, LM-03 | 3 |
| TP-3D04 | Chuỗi góc máy mỗi góc khoảng 5 s, đổi tiêu cự mỗi lần cắt | Three.js, Remotion | vừa | CL-08, CL-13 | LM-02, LM-05 | 1 |
| TP-3D05 | Độ sâu trường ảnh và đổi tiêu điểm | Three.js, FFmpeg | vừa | CL-08, CL-13 | LM-02, LM-03, LM-05 | 4 |
| TP-3D06 | Tách lớp, hình nổ và thu nhỏ theo bậc quy mô | Three.js, GSAP | vừa | CL-06, CL-07, CL-08 | LM-02, LM-03, LM-05 | 5 |
| TP-3D07 | Khoá màu theo chức năng và hạt chạy dọc ống theo chiều dòng | Three.js, Canvas | vừa | CL-06, CL-07, CL-13, CL-14 | LM-02, LM-03 | 2 |
| TP-3D08 | Cảnh thiên nhiên: giờ vàng, sương khí quyển, mặt nước | Three.js, WebGL shader | vừa | CL-08, CL-12, CL-13 | LM-02, LM-03, LM-05 | 4 |
| TP-3D09 | Ba vật cơ bản trên sàn phản chiếu mờ dần | Three.js, CSS | vừa | CL-06, CL-13 | LM-02, LM-03 | 2 |
| TP-3D10 | Thẻ giao diện nghiêng nhẹ trong không gian 3D, băng chuyền thẻ | CSS, Three.js, GSAP | vừa | CL-02, CL-04, CL-16 | LM-02, LM-03 | 6 |
| TP-3D11 | Vật liệu Fresnel và vật phát sáng | Three.js, WebGL shader | vừa | CL-13, CL-12 | LM-02, LM-03 | 1 |
| TP-3D12 | Cảnh 3D thủ tục, không mô hình ngoài | Three.js | vừa | CL-06, CL-13 | LM-02, LM-03 | 5 |
| TP-3D13 | Viền hoạt hình (toon outline) bằng hậu kỳ pháp tuyến và độ sâu | Three.js, WebGL shader | vừa | CL-13 | LM-02, LM-03 | 3 |
| TP-3D14 | Mô phỏng vật lý tính thật | Three.js, WebGL shader | nặng | CL-14, CL-12 | LM-02, LM-03 | 5 |
| TP-3D15 | Shader tính từng điểm ảnh (raymarching, kính màu) | WebGL shader, Three.js | nặng | CL-12, CL-14 | LM-03 | 5 |
| TP-3D16 | Khung 2.5D ghép lớp theo bản đồ độ sâu | Three.js, Python/numpy | nặng | CL-12, CL-15 | LM-06 | 4 |

### TP-3D01 Máy quay đẩy thẳng hoặc bay chậm theo đường cong

- **Cách làm** (tham số từ: mẫu): Đẩy thẳng 8 s về một điểm tụ (một điểm tụ, bố cục đối xứng, vật chuyển động ở một bên để có chiều sâu); hoặc bay chậm theo đường cong với tiêu cự rộng, vật lớn ở tiền cảnh trượt qua đầu khung, hạ xuống để nhìn lên vật cao; hoặc đi ngang tầm mắt qua cổng, lên bậc, vào sảnh rồi nhìn ra qua lan can để đưa người xem vào bên trong công trình.
- **Lỗi hay gặp:** Máy quay đi với tốc độ đều làm chuyển động cứng; dùng đường cong tăng giảm tốc (TP-CD02).
- **Mẫu nguồn:** `alexalbert-274839`, `lexnlin-241739`, `buildfastwithai-597035`, `1littlecoder-378066`, `itsolelehmann-762215` (trạng thái: nháp)

### TP-3D02 Máy quay quỹ đạo chậm quanh vật, hoặc khoá chính diện

- **Cách làm** (tham số từ: mẫu): Quỹ đạo chậm quanh bề mặt hoặc vật thể trong lúc chữ và công thức hiện dần; hoặc khoá chính diện như bàn vẽ kỹ thuật, vật xoay còn máy quay đứng yên; vật thể ba chiều đơn giản đặt giữa khung để biểu thị một khái niệm.
- **Lỗi hay gặp:** Quỹ đạo quá nhanh làm nhãn bám vật chạy theo và khó đọc.
- **Mẫu nguồn:** `anirockshady-032809`, `heyiamnick-119558`, `spearwtf-029058` (trạng thái: nháp)

### TP-3D03 Camera đẳng cự đứng yên, đồ vật xuất hiện lần lượt

- **Cách làm** (tham số từ: mẫu): Mỗi cảnh một khối đẳng cự (isometric) tròn đặt giữa khung, camera đứng yên, đồ vật xuất hiện lần lượt; thẻ giao diện nhỏ hiện ở chân khung ngay sau khi nhãn giá nổi lên trong cảnh. Biến thể voxel có bóng mềm và che sáng môi trường (ambient occlusion).
- **Lỗi hay gặp:** Camera đứng yên nhưng đồ vật xuất hiện cùng lúc thì mất ý lần lượt.
- **Mẫu nguồn:** `felipemoller-936736`, `filicroval-168898`, `dreyk0o0-165270` (trạng thái: nháp)

### TP-3D04 Chuỗi góc máy mỗi góc khoảng 5 s, đổi tiêu cự mỗi lần cắt

- **Cách làm** (tham số từ: mẫu): Chuỗi 6 góc máy mỗi góc khoảng 5 s: toàn cảnh rộng, cận chi tiết cơ khí, cận mặt, góc thấp nhìn từ sau, đi theo từ trên cao; mỗi lần cắt đổi tiêu cự và hướng.
- **Lỗi hay gặp:** Cắt giữa hai góc cùng hướng và cùng tiêu cự trông như lỗi nhảy hình.
- **Mẫu nguồn:** `axtonliu-290566` (trạng thái: nháp)

### TP-3D05 Độ sâu trường ảnh và đổi tiêu điểm

- **Cách làm** (tham số từ: mẫu): Cận cảnh nông: một vật chiếm khoảng 70% khung, các vật khác nhoè; đổi tiêu điểm từ vật gần sang vật xa trong khoảng 0,5 s; nền nhoè chỉ vật chính nét. Trong Three.js dùng nhoè theo khoảng cách tới mặt phẳng nét (hậu kỳ); trong Blender Cycles tính thật, đo của Media là 13 s máy mỗi khung (412 khung mất 89 phút, bản chỉ đạo 27/10/2026).
- **Lỗi hay gặp:** Độ sâu trường ảnh tính thật trong Blender tốn thời gian máy mỗi khung; bật khi thật sự cần.
- **Mẫu nguồn:** `anilraok-009118`, `axtonliu-290566`, `chudry223-081860`, `daniel-haida-636937` (trạng thái: nháp)

### TP-3D06 Tách lớp, hình nổ và thu nhỏ theo bậc quy mô

- **Cách làm** (tham số từ: mẫu): Tách lớp: chip chia thành các tầng (nắp đồng, lớp bạc, khuôn chip) tách dần theo chiều đứng, nhãn có đường dẫn tới từng tầng. Hình nổ: mỗi bộ phận trượt ra kèm tên trên nhãn, bấm lại thì thu về; cắt dọc ống kính cho thấy tia sáng hội tụ trên cảm biến; bóc từng tầng động cơ kèm giải thích hút, nén, đốt, thổi. Thu nhỏ theo bậc quy mô: toàn nhà (có cây thấp-poly để thấy tỷ lệ), hàng giá máy ngang tầm, một giá, một khay, một chip.
- **Lỗi hay gặp:** Các tầng tách ra không có nhãn bám vật thì người xem không biết tầng nào là gì.
- **Mẫu nguồn:** `mdaman010-111079`, `konstantinsaifo-501736`, `aichrislee-408244`, `0xspikez-483865`, `mrkindey-267498` (trạng thái: nháp)

### TP-3D07 Khoá màu theo chức năng và hạt chạy dọc ống theo chiều dòng

- **Cách làm** (tham số từ: mẫu): Màu theo chức năng, hiện trong bảng chú giải ở góc trên phải: điện cam hoặc vàng, nhiệt đỏ hồng, làm mát xanh ngọc; mọi ống, mũi tên và hạt dùng đúng màu đó xuyên suốt video. Hạt nhỏ chạy dọc ống theo chiều dòng để thể hiện điện, nhiệt hoặc nước; nhiệt thoát ra là các đường lượn đỏ bay lên từ mặt trên toà nhà. Màu nền thẻ cũng có thể mã hoá nhóm hoặc giai đoạn.
- **Lỗi hay gặp:** Một màu dùng cho hai chức năng khác nhau trong cùng video thì chú giải mất nghĩa.
- **Mẫu nguồn:** `mdaman010-111079`, `triglyceee-161719` (trạng thái: nháp)

### TP-3D08 Cảnh thiên nhiên: giờ vàng, sương khí quyển, mặt nước

- **Cách làm** (tham số từ: mẫu): Giờ vàng: mặt trời thấp có bloom (quầng sáng), mây khối nhận ánh vàng cam từ bên, bóng dài nằm ngang. Phối cảnh khí quyển: sương mù màu cam nhạt tăng theo khoảng cách làm núi xa nhạt và xanh dần. Hoàng hôn sang đêm đổi gradient trời cam → tím → xanh đen. Mặt nước cộng 9 nhóm sóng ngang có biên độ và tần số khác nhau; phản chiếu bóng theo trục dọc, bóng kéo dài thẳng xuống.
- **Lỗi hay gặp:** Bloom quá mạnh làm mất chi tiết trong vùng sáng.
- **Mẫu nguồn:** `lexnlin-241739`, `axtonliu-290566`, `ishuagra02-678129`, `demitiyageekzen-818523` (trạng thái: nháp)

### TP-3D09 Ba vật cơ bản trên sàn phản chiếu mờ dần

- **Cách làm** (tham số từ: mẫu): Ba vật cơ bản (cầu xanh, lập phương đỏ cam, tấm vàng) đặt trên sàn bóng tối, đèn chính từ trên trái; sàn phản chiếu màu vật thể thành vệt mờ dần (bản sao lật mờ dần theo khoảng cách tới sàn).
- **Lỗi hay gặp:** Phản chiếu không mờ dần thì sàn phản chiếu đều ở mọi khoảng cách và không thể hiện được độ sâu.
- **Mẫu nguồn:** `lukasersil-726495`, `twoclipping-000267` (trạng thái: nháp)

### TP-3D10 Thẻ giao diện nghiêng nhẹ trong không gian 3D, băng chuyền thẻ

- **Cách làm** (tham số từ: mẫu): Thẻ giao diện nghiêng nhẹ trong không gian 3D với bóng mềm, cảnh nào cũng có một thẻ chính. Băng chuyền: 10–18 thẻ dọc xếp trên một vòng cung bằng perspective, thẻ giữa lớn nhất, sàn phản chiếu; cú quét theo TP-CD02. Biến thể: thẻ ảnh chụp nghiêng phối cảnh nhẹ trôi qua khung; ba điện thoại xếp cánh quạt; ảnh chụp trang thật đặt vào khung điện thoại hoặc trình duyệt thay cho dựng giao diện giả.
- **Lỗi hay gặp:** Dùng CSS 3D lật vật lớn thì viền răng cưa; lật 3D lớn nên để trong WebGL.
- **Mẫu nguồn:** `sachaarbonel-673648`, `ezshine-750731`, `twoclipping-000267`, `viktoroddy-402509`, `redpersongpt-284430`, `wani-shola-459278` (trạng thái: nháp)

### TP-3D11 Vật liệu Fresnel và vật phát sáng

- **Cách làm** (tham số từ: mẫu): Lá chắn: cầu bán trong có shader Fresnel (viền sáng khi nhìn nghiêng) cộng hoạ tiết lưới, hiện gợn tròn lan ra từ điểm trúng. Thân tàu: nhiều tấm hộp lặp, ô cửa là điểm sáng vàng xếp thẳng hàng phát qua emissive (vật liệu tự phát sáng) để giữ quy mô lớn mà không tốn mô hình. Hợp Media thấp.
- **Lỗi hay gặp:** Số vật phát sáng lớn làm bloom bao phủ cả cảnh.
- **Mẫu nguồn:** `0xchuckstock-879327` (trạng thái: nháp)

### TP-3D12 Cảnh 3D thủ tục, không mô hình ngoài

- **Cách làm** (tham số từ: mẫu): Vật thể 3D sinh hoàn toàn bằng mã. Cây hoa anh đào là cầu nhiều mặt nhẹ, thông là hình nón, rải ngẫu nhiên nhưng chừa lối đi để có chiều sâu mà không tốn mô hình; cột đèn là điểm sáng vàng lớn, cửa sổ là điểm sáng nhỏ. Khuôn câu lệnh mẫu: 'everything procedural, no imported 3D models'.
- **Lỗi hay gặp:** Rải ngẫu nhiên không có hạt giống cố định thì mỗi lần dựng ra cảnh khác.
- **Mẫu nguồn:** `buildfastwithai-597035`, `ved-cj-066575`, `thusatharan-640926`, `mdaman010-610173`, `rubenssoto-ai-802657` (trạng thái: nháp)

### TP-3D13 Viền hoạt hình (toon outline) bằng hậu kỳ pháp tuyến và độ sâu

- **Cách làm** (tham số từ: mẫu): Vật 3D tô 3–4 bậc (MeshToonMaterial) với ba đèn (chính, trời, viền). Viền vẽ bằng hậu kỳ: render bản đồ pháp tuyến và độ sâu rồi shader kẻ nét; viền ngoài dày, viền nối chi tiết mỏng, đồng đều; siêu lấy mẫu 1,5 lần.
- **Lỗi hay gặp:** Không dùng cách phóng to mặt sau màu đen vì nét không đều và gãy ở góc; ngưỡng độ sâu phải nới, mối nối dựa chủ yếu vào pháp tuyến.
- **Mẫu nguồn:** `op7418-814408`, `op7418-818226`, `op7418-021491` (trạng thái: nháp)

### TP-3D14 Mô phỏng vật lý tính thật

- **Cách làm** (tham số từ: mẫu): Mô phỏng thật chứ không giả hình: lửa là chất lưu 3D trên GPU, 96 khung mỗi giây ở 1080p, tự chấm hình 40 lần; 110.000 vật cứng bằng thuật toán AVBD trên WebGPU; 8.144 viên bi mà mỗi tiếng clink khớp một va chạm mô phỏng; 108.000 hạt cát, nước, dầu, lửa, dung nham ở 60 khung mỗi giây. Chạy mô phỏng một lần, ghi trạng thái, rồi dựng khung từ mảng đã ghi.
- **Lỗi hay gặp:** Mô phỏng chạy theo thời gian thật của trình duyệt thì dựng khung nào cũng ra kết quả khác; phải chạy theo bước cố định.
- **Mẫu nguồn:** `nathanwilbanks-981110`, `nybobs-680050`, `rneayan-417829`, `cyrilxbt-149036`, `pagustafsson-566609` (trạng thái: nháp)

### TP-3D15 Shader tính từng điểm ảnh (raymarching, kính màu)

- **Cách làm** (tham số từ: mẫu): Fragment shader raymarch (dò tia) với bóng mềm, che sáng môi trường, phản chiếu bóng, sương có tia sáng, độ sâu trường ảnh, nhoè chuyển động, bloom; Mandelbox thêm một cấp fractal mỗi cú kick; dựng 37 s 1080p60 offline. Cả bức tranh là một shader WebGL2. Kính màu: ánh sáng chiếu lên sàn tính từ cùng hoạ tiết, bóng sàn phản ánh chính xác lỗ nào đã mở.
- **Lỗi hay gặp:** Dựng thời gian thực thì rớt khung; phải dựng offline (chụp từng khung).
- **Mẫu nguồn:** `xanares-738984`, `demitiyageekzen-818523`, `agioyaz-397647`, `agioyaz-986461`, `juancarlos17626-382690` (trạng thái: nháp)

### TP-3D16 Khung 2.5D ghép lớp theo bản đồ độ sâu

- **Cách làm** (tham số từ: mẫu): Ảnh phẳng được ước lượng độ sâu (Depth Anything V2) rồi ghép lớp theo khoảng cách thật, máy quay lỗ kim theo tiêu cự thật, thị sai từng điểm ảnh, mưa 3D, ánh sáng thể tích; nhân vật biến dạng lưới để thở và bay tóc, tư thế đổi một nhịp hai khung; tái dựng video thành hạt có độ sâu.
- **Lỗi hay gặp:** Bản đồ độ sâu sai ở mép vật làm viền vật bị kéo giãn khi máy quay dịch.
- **Mẫu nguồn:** `zhu185178-255661`, `pluvio9yte-662953`, `mochi-agi-421448`, `tanabe-fragm-706979` (trạng thái: nháp)

## TP-HK — hậu kỳ, lớp hoàn thiện

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-HK01 | Hạt nhiễu phim, độ đục tối đa khoảng 6% | Canvas, FFmpeg, Python/numpy | vừa | CL-06, CL-08, CL-10, CL-12, CL-13 | LM-02, LM-03, LM-05 | 4 |
| TP-HK02 | Vignette, halation và sắc sai viền | Python/numpy, FFmpeg, Canvas | vừa | CL-06, CL-08, CL-13 | LM-02, LM-03, LM-05 | 3 |
| TP-HK03 | Tách RGB và glitch có kiểm soát | Canvas, CSS, FFmpeg | nhẹ | CL-01, CL-11, CL-12 | LM-01, LM-02, LM-03, LM-04 | 5 |
| TP-HK04 | Nhoè chuyển động thật bằng khung phụ | FFmpeg, Canvas, Remotion | nặng | CL-02, CL-05, CL-11, CL-13, CL-16 | LM-03 | 6 |
| TP-HK05 | Bloom và quầng sáng | Canvas, Three.js, CSS | vừa | CL-12, CL-13, CL-16 | LM-02, LM-03 | 6 |
| TP-HK06 | Bokeh bằng điểm tròn phát sáng | Canvas, Three.js | vừa | CL-12, CL-13 | LM-02, LM-03 | 3 |
| TP-HK07 | Hậu kỳ phim cũ | Python/numpy, FFmpeg | nhẹ | CL-13, CL-15 | LM-02, LM-03 | 1 |
| TP-HK08 | Nét bút chì, giấy và bút sáp | Canvas, SVG | vừa | CL-03, CL-10, CL-15 | LM-02, LM-03 | 4 |
| TP-HK09 | Kiểu bản vẽ kỹ thuật (blueprint) và hologram | Canvas, SVG | nhẹ | CL-03, CL-06 | LM-02, LM-03 | 1 |
| TP-HK10 | Kính lỏng (liquid glass) bằng SVG feImage và feDisplacementMap | SVG, CSS, Canvas | vừa | CL-02, CL-16 | LM-02, LM-03 | 4 |
| TP-HK11 | Pixel hoá: canvas ẩn phân giải thấp, phóng bội số nguyên | Canvas | nhẹ | CL-15 | LM-02, LM-03 | 4 |
| TP-HK12 | Hạt rải nền và hạt bung | Canvas, Three.js | vừa | CL-12, CL-13 | LM-02, LM-03 | 5 |
| TP-HK13 | Khung chứa bo góc cắt gọn mọi cú phóng | CSS, Canvas | nhẹ | CL-04, CL-16 | LM-01, LM-02, LM-03, LM-04 | 1 |
| TP-HK14 | Vụ nổ và sóng lan | Canvas, Three.js | nhẹ | CL-12, CL-13 | LM-02, LM-03 | 2 |

### TP-HK01 Hạt nhiễu phim, độ đục tối đa khoảng 6%

- **Cách làm** (tham số từ: mẫu + đề xuất): Hạt mới ở mỗi khung (không dùng một ảnh hạt cố định); độ đục tối đa khoảng 6%; dựng bằng numpy sau khi chụp khung hoặc bằng lớp canvas. Hạt nhẹ ở cuối khâu hoàn thiện; hạt phim kèm CRT cho phim phóng kiểu retro. Ngưỡng 6% rút từ bài học mẫu lịch sử AI 60 giây của Media: lớp hạt nhiễu làm file xuất 134 MB (bản chỉ đạo 27/10/2026).
- **Lỗi hay gặp:** Hạt dày hoặc độ đục cao làm file lớn và mất chữ nhỏ khi nén; hạt cố định (một ảnh) hiện rõ là lớp phủ không đổi giữa các khung.
- **Mẫu nguồn:** `notdwd-998633`, `jake11moran-414633`, `twoclipping-041659`, `johnsavage-ai-427263` (trạng thái: nháp)

### TP-HK02 Vignette, halation và sắc sai viền

- **Cách làm** (tham số từ: mẫu): Vignette (tối mép) khoảng 0,65 ở góc; halation (quầng đỏ cam quanh mép sáng); viền sắc sai 1 px kẹp ở mép; dựng bằng numpy sau khi chụp khung. Phối với viền tối ở góc của hậu kỳ phim cũ (TP-HK07).
- **Lỗi hay gặp:** Vignette mạnh làm tối nhãn ở góc (nhãn bốn góc của TP-CH16).
- **Mẫu nguồn:** `notdwd-998633`, `alexalbert-274839`, `twoclipping-041659` (trạng thái: nháp)

### TP-HK03 Tách RGB và glitch có kiểm soát

- **Cách làm** (tham số từ: mẫu): Lệch in magenta và xanh 2–4 px chỉ ở khung nhấn mạnh; glitch 1–2 khung, chỉ đặt trên cú cắt thật và luôn kèm tiếng click; chữ khổng lồ tách kênh RGB trên nền kem để ngắt nhịp giữa các câu. Dày đặc chỉ dùng trong MV: dải ngang lệch, tách RGB đúng lúc nhịp rơi, hồi lại trước nhịp sau. Nhóm 'tối giản cao cấp' cấm tách RGB.
- **Lỗi hay gặp:** Dùng glitch ở chỗ không có cú cắt thật làm người xem tưởng video lỗi; dùng ở phong cách tối giản bị coi là sai chuẩn.
- **Mẫu nguồn:** `techhalla-498547`, `notdwd-998633`, `pound75423-464968`, `kloss-xyz-941143`, `raphaelaubryy-687877` (trạng thái: nháp)

### TP-HK04 Nhoè chuyển động thật bằng khung phụ

- **Cách làm** (tham số từ: mẫu): Mỗi khung xuất ra là trung bình của 3–8 khung phụ: chụp tại t−1/240, t, t+1/240 s rồi FFmpeg trộn bằng tmix ở 60 khung mỗi giây. 4 khung phụ có thể bị bóng mờ ở cú quét nhanh thì dùng 8. Chữ và hình đứng yên giữ nét, chỉ phần chuyển động nhoè. Bộ đếm phải đọc thời gian của khung chính. Đo của Media: nhoè ở 60 khung mỗi giây gấp khoảng 8 lần chi phí; mẫu lịch sử AI 60 giây mất 23,3 phút máy (bản chỉ đạo 27/10/2026). Chỉ bật khi có chuyển động nhanh.
- **Lỗi hay gặp:** Bật nhoè ở cảnh gần như tĩnh chỉ tốn máy mà không đổi hình; chữ số của bộ đếm đọc theo khung phụ thì nhoè.
- **Mẫu nguồn:** `twoclipping-000267`, `twoclipping-551116`, `annacher-433425`, `brainextends-606193`, `demonugc-525162`, `diamai-157697` (trạng thái: nháp)

### TP-HK05 Bloom và quầng sáng

- **Cách làm** (tham số từ: mẫu): Quầng sáng mờ nở rộng phía sau biểu tượng khi ghép xong; quầng sáng tím mờ quanh logo; quầng cam sau điện thoại ở cảnh tối; bloom ở mặt trời thấp và ở vụ nổ; chữ có nhiễu màu và quầng sáng chuyển từ mờ nhiễu sang rõ. Mẫu giao diện cao cấp cấm quầng và lens flare, nên chọn theo phong cách.
- **Lỗi hay gặp:** Quầng sáng chồng lên chữ làm chữ mất tương phản.
- **Mẫu nguồn:** `mounnna-497266`, `gautam-mer1-530003`, `redpersongpt-284430`, `johnsavage-ai-427263`, `lexnlin-241739`, `xanares-738984` (trạng thái: nháp)

### TP-HK06 Bokeh bằng điểm tròn phát sáng

- **Cách làm** (tham số từ: mẫu): Bokeh bằng các điểm tròn phát sáng nhiều cỡ, trộn cộng sáng, độ mờ tăng theo khoảng cách tới tiêu điểm; xanh và cam xen kẽ ở nền; bokeh tròn tự viết với độ mở đóng dần.
- **Lỗi hay gặp:** Điểm bokeh quá đậm lấn chủ thể.
- **Mẫu nguồn:** `anilraok-009118`, `tanabe-fragm-322001`, `zhu185178-255661` (trạng thái: nháp)

### TP-HK07 Hậu kỳ phim cũ

- **Cách làm** (tham số từ: mẫu): Chuyển đơn sắc, thêm hạt, vết bụi ngẫu nhiên, nhấp nháy độ sáng 1–3%, viền tối ở góc; xuất ở 16 khung mỗi giây rồi nội suy lên 30.
- **Lỗi hay gặp:** Nội suy từ 16 lên 30 khung tạo vệt ảnh kép ở chuyển động nhanh.
- **Mẫu nguồn:** `alexalbert-274839` (trạng thái: nháp)

### TP-HK08 Nét bút chì, giấy và bút sáp

- **Cách làm** (tham số từ: mẫu): Chế độ PAPER: nét bút chì lấy mẫu lại và đẩy lệch bởi sóng sin đổi pha 8 lần mỗi giây, vẽ hai lượt (đủ bề rộng ở độ đục 90%, nửa bề rộng ở 40% với nhiều rung hơn), đục vân giấy khỏi nét, nhân lên nền giấy có lưới xanh. Bút sáp có vân hạt, viền rung. Lệch sắc chừng mực trên nét bút chì. Giấy kem làm nền, dấu căn lề ở bốn góc.
- **Lỗi hay gặp:** Nét rung quá mạnh làm chữ viết tay khó đọc; nét hoàn hảo thì không còn là nét tay.
- **Mẫu nguồn:** `heyiamnick-119558`, `0xcodez-474136`, `groundcontrol-230877`, `tak3sh8-441895` (trạng thái: nháp)

### TP-HK09 Kiểu bản vẽ kỹ thuật (blueprint) và hologram

- **Cách làm** (tham số từ: mẫu): BLUEPRINT: nét trắng 3–4 px, cạnh khuất nét đứt. HOLOGRAM: đường quét ngang bước 8 px, độ dày theo độ sáng, không quầng. Cả hai khoá chính diện như bàn vẽ kỹ thuật.
- **Lỗi hay gặp:** Đường quét quá dày làm chữ trong hologram khó đọc.
- **Mẫu nguồn:** `heyiamnick-119558` (trạng thái: nháp)

### TP-HK10 Kính lỏng (liquid glass) bằng SVG feImage và feDisplacementMap

- **Cách làm** (tham số từ: mẫu): Mỗi phần tử kính giữ bản sao cảnh phía sau, lọc bằng bản đồ dịch chuyển (trường khoảng cách hình chữ nhật bo góc) qua ba feDisplacementMap ở ba tỷ lệ hơi khác nhau để viền có sắc sai, thêm đèn viền. Chữ kính dựng từ trường khoảng cách vẽ trên canvas. Một số mẫu cấm hẳn glassmorphism (kính mờ).
- **Lỗi hay gặp:** backdrop-filter: url() đọc sai bản đồ dịch chuyển trong Chromium, nên phải sao chép cảnh thay vì dùng nó.
- **Mẫu nguồn:** `twoclipping-496100`, `twoclipping-747965`, `thejohnnyhuy-282154`, `techhalla-498547` (trạng thái: nháp)

### TP-HK11 Pixel hoá: canvas ẩn phân giải thấp, phóng bội số nguyên

- **Cách làm** (tham số từ: mẫu): Vẽ vào canvas ngoài màn hình ở độ phân giải cố định (128×96), phóng lên theo hệ số nguyên lớn nhất, image-rendering: pixelated; bảng màu cố định khoảng 24 màu; mọi toạ độ làm tròn thành số nguyên; hạt đổi chỉ số màu từ trắng sang màu phép sang tối trước khi biến mất. Phối với TP-CD10 để tư thế lượng tử hoá.
- **Lỗi hay gặp:** Phóng theo hệ số không nguyên làm pixel to nhỏ không đều.
- **Mẫu nguồn:** `zacxbt-944604`, `majidmanzarpour-927543`, `xodud-rkd-160324`, `twoclipping-041659` (trạng thái: nháp)

### TP-HK12 Hạt rải nền và hạt bung

- **Cách làm** (tham số từ: mẫu): Hạt sáng nhỏ rải như chòm sao ở cảnh số lớn và cảnh kết; hạt vàng bung từ tâm khi mở khoá rồi trôi chậm lên và mờ dần trong khoảng 2 s; dải hạt kiểu ruy-băng chạy sau vật chuyển động để chỉ hướng đi; hệ hạt Canvas 2D tự viết có trọng lực, lực cản, vòng đời, trộn cộng sáng, ba kiểu bay (hút vào, theo đường cong, quay quanh). Nhóm giao diện cao cấp cấm hạt.
- **Lỗi hay gặp:** Hạt dùng ở nền chữ làm chữ nhỏ khó đọc.
- **Mẫu nguồn:** `viktoroddy-402509`, `bthreeagency-827092`, `ishuagra02-678129`, `op7418-814408`, `lukasersil-726495` (trạng thái: nháp)

### TP-HK13 Khung chứa bo góc cắt gọn mọi cú phóng

- **Cách làm** (tham số từ: mẫu): Khung tối bo góc đặt trên nền gradient một màu; mọi cảnh và mọi cú phóng to cắt gọn theo khung.
- **Lỗi hay gặp:** Nội dung phóng tràn ra ngoài khung bo góc nếu không clip.
- **Mẫu nguồn:** `brainextends-606193` (trạng thái: nháp)

### TP-HK14 Vụ nổ và sóng lan

- **Cách làm** (tham số từ: mẫu): Vụ nổ: quả cầu cam phát sáng kèm vòng sóng trắng lan ra trong 0,5–1 s, hậu cảnh tối lại khi bloom lên; biến thể quả cầu sáng phóng to nhanh rồi mờ trong khoảng 1 s, khói đen theo sau; gợn tròn lan ra từ điểm trúng.
- **Lỗi hay gặp:** Vòng sóng lan ra với tốc độ đều thiếu cảm giác tắt dần; nên giảm tốc và mờ dần khi lan (đề xuất).
- **Mẫu nguồn:** `0xchuckstock-879327`, `ved-cj-066575` (trạng thái: nháp)

## TP-AT — âm thanh đồng bộ

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-AT01 | Lưới nhịp theo BPM và cường độ theo đoạn bài | Remotion, Canvas, Python/numpy | nhẹ | CL-01, CL-11, CL-12, CL-16 | LM-01, LM-02, LM-03, LM-04 | 5 |
| TP-AT02 | Đặt tiếng theo đỉnh biên độ đo được | FFmpeg, Python/numpy | nhẹ | CL-01, CL-04, CL-16 | LM-01, LM-02, LM-03, LM-04 | 5 |
| TP-AT03 | Chuẩn hoá âm lượng −14 LUFS | FFmpeg | nhẹ | mọi chất liệu | LM-01, LM-02, LM-03, LM-04 | 5 |
| TP-AT04 | Hạ nhạc khi có giọng | FFmpeg, Python/numpy | nhẹ | mọi chất liệu | LM-01, LM-02, LM-03, LM-04 | 3 |
| TP-AT05 | Tiếng ít mà đúng theo hành động | FFmpeg, Python/numpy | nhẹ | CL-04, CL-16 | LM-01, LM-02, LM-03, LM-04 | 4 |
| TP-AT06 | Âm và hình sinh từ cùng một dữ liệu | Python/numpy, Canvas, Web Audio | vừa | CL-12, CL-14 | LM-02, LM-03 | 8 |
| TP-AT07 | Tổng hợp tiếng và nhạc bằng mã | Python/numpy, Web Audio | nhẹ | mọi chất liệu | LM-01, LM-02, LM-03, LM-04 | 7 |
| TP-AT08 | Mốc thời gian từng từ để chữ khớp giọng | Python/numpy, FFmpeg | nhẹ | CL-03, CL-05, CL-11 | LM-01, LM-02, LM-03, LM-04 | 5 |
| TP-AT09 | Phim hiểu được khi tắt tiếng | Remotion, Canvas | nhẹ | CL-01, CL-11 | LM-01, LM-02, LM-03, LM-04 | 5 |
| TP-AT10 | Phân tích số bài nhạc khi AI không nghe được | Python/numpy, FFmpeg | nhẹ | mọi chất liệu | LM-01, LM-02, LM-03, LM-04 | 4 |

### TP-AT01 Lưới nhịp theo BPM và cường độ theo đoạn bài

- **Cách làm** (tham số từ: mẫu): Nêu BPM làm lưới thời gian (120 BPM chiếm 23 trong 31 prompt nêu BPM): 120 BPM, mỗi phách một việc; 60 phách là 15 ô nhịp dài 2 s, chuyển động bắt đầu sớm 0,05 s để đáp đúng phách; 128 BPM, 8 ô nhịp, mỗi cảnh một ô 1,875 s. Cường độ hiệu ứng theo đoạn bài: khoảng 40% đoạn mở đầu, 70% đoạn thường, 100% điệp khúc; không dùng cùng một tư thế ở hai nhịp liền kề; đoạn năng lượng thấp dùng cảnh tĩnh. Video thuyết minh của Media đi theo lời đọc, không dùng lưới BPM.
- **Lỗi hay gặp:** Hình bắt đầu đúng nhịp thay vì sớm 0,05 s thì thấy trễ so với âm.
- **Mẫu nguồn:** `0xnicc0-516612`, `heyiamnick-119558`, `ai9app-989009`, `pound75423-464968`, `koushikde-937635` (trạng thái: nháp)

### TP-AT02 Đặt tiếng theo đỉnh biên độ đo được

- **Cách làm** (tham số từ: mẫu): Đặt hiệu ứng tiếng sao cho đỉnh biên độ đo được (không phải đầu file) trùng khung hành động; tiếng nhỏ hơn nhạc.
- **Lỗi hay gặp:** Đặt theo đầu file thì tiếng lệch hình do phần mở đầu im lặng của file.
- **Mẫu nguồn:** `twoclipping-496100`, `twoclipping-551116`, `annacher-433425`, `ultimaxbt-549714`, `twoclipping-000267` (trạng thái: nháp)

### TP-AT03 Chuẩn hoá âm lượng −14 LUFS

- **Cách làm** (tham số từ: mẫu): Chuẩn hoá loudnorm −14 LUFS, −2 dBTP, đo lại sau khi mã hoá AAC (192 kbps); một nhóm chọn −16 LUFS; hiệu ứng không bao giờ to hơn nhạc, không méo.
- **Lỗi hay gặp:** Đo trước khi mã hoá AAC thì giá trị sau mã hoá lệch.
- **Mẫu nguồn:** `0xnicc0-516612`, `ik-builds-585923`, `tkz-aiart-864352`, `tanabe-fragm-322001`, `twoclipping-000267` (trạng thái: nháp)

### TP-AT04 Hạ nhạc khi có giọng

- **Cách làm** (tham số từ: mẫu + đề xuất): Giọng dẫn nhạc 10–15 dB; hạ nhạc −18 dB lúc đang nói; cú nhấn đặt đúng khung hành động; hình không dừng khi người dẫn ngừng nói.
- **Lỗi hay gặp:** Hạ nhạc theo đường thẳng cứng làm nghe thấy nhạc bị nén; dùng ducking có thời gian vào, ra.
- **Mẫu nguồn:** `notdwd-998633`, `tetsu-tetsu333-576886`, `astrothewizard-618782` (trạng thái: nháp)

### TP-AT05 Tiếng ít mà đúng theo hành động

- **Cách làm** (tham số từ: mẫu): Một tiếng whoosh ngắn mềm cho mỗi lần đổi cảnh thật; click và pop nhỏ chỉ cho hành động thật trên màn hình; một tiếng nhẹ cho mỗi phần tử hiện ra và im lặng ngoài ra; mỗi hiệu ứng đặt cao hơn nhạc một chút trong dải tần riêng; luôn xuất thêm bản chỉ có nhạc.
- **Lỗi hay gặp:** Tiếng ở mọi chuyển động làm người nghe mệt; whoosh quá dài che giọng.
- **Mẫu nguồn:** `everestchris6-399895`, `aschapmann-724497`, `cipherwrk-451155`, `ik-builds-585923` (trạng thái: nháp)

### TP-AT06 Âm và hình sinh từ cùng một dữ liệu

- **Cách làm** (tham số từ: mẫu): Một dòng thời gian hoặc một mảng dữ liệu điều khiển cả hình lẫn âm: mỗi lần photon nảy là một tiếng click; mỗi nốt đến từ một va chạm thấy được; xi-lanh nháy theo thứ tự nổ thật; mỗi tiếng clink của 8.144 viên bi khớp một va chạm; tiếng lửa lấy từ độ sáng của lửa ở từng khung. Biến thể phản ứng âm thanh: FFT (biến đổi Fourier nhanh) trên chính bản trộn, các thanh equalizer là bản nhạc thật; mỗi nhịp kick lật các tấm, bass đẩy thấu kính, treble thắp lõi.
- **Lỗi hay gặp:** Âm và hình đọc hai nguồn dữ liệu khác nhau thì lệch dần theo thời gian.
- **Mẫu nguồn:** `apoorvjain25-945542`, `apoorvjain25-309680`, `rneayan-417829`, `dys-hay-749645`, `nathanwilbanks-981110`, `ulyssexbt-205279`, `acoramaa-248467`, `kamstudiolabs-440893` (trạng thái: nháp)

### TP-AT07 Tổng hợp tiếng và nhạc bằng mã

- **Cách làm** (tham số từ: mẫu): Python và numpy: nhạc từng nốt từ sóng sin và nhiễu, tiếng giao diện đặt theo đỉnh đo được trên lưới phách. Web Audio: piano có hoà âm, tiếng click ngắn khi công tắc đổi. Karplus-Strong (mô hình dây gảy) cho đàn dây. Kèm cue sheet ghi nhạc và hiệu ứng nhấn ở đâu. Khoảng 28 prompt đòi âm tự sinh, thường kèm 'no samples, no audio files'.
- **Lỗi hay gặp:** Nhạc thuật toán cần nhiều vòng sửa: mẫu saltyaom-620933 ghi 13 lần sửa.
- **Mẫu nguồn:** `demitiyageekzen-818523`, `kopert0x-098349`, `daniel-haida-636937`, `annacher-433425`, `koushikde-937635`, `prasenx-693512`, `saltyaom-620933` (trạng thái: nháp)

### TP-AT08 Mốc thời gian từng từ để chữ khớp giọng

- **Cách làm** (tham số từ: mẫu): Whisper nhanh (faster-whisper) lấy mốc từng từ, từng đoạn ngắn; (nguồn gốc còn có cách khác, Media chỉ dùng Whisper); chia giọng thành cụm (32 cụm cho 52 s) để chữ hiện đúng lúc nói; tách giọng bằng Demucs, chép lời bằng mlx_whisper, căn với lời chính thức để mỗi dòng lời là một cảnh. Media đã dùng Whisper tạo moc_tu.json cho phụ đề (module 10).
- **Lỗi hay gặp:** Phiên âm thuật ngữ cho máy đọc khác chữ phụ đề thì mốc từ không khớp chữ trên màn hình.
- **Mẫu nguồn:** `twoclipping-041659`, `notdwd-998633`, `tetsu-tetsu333-576886`, `okazaky-084783`, `tarunyadav9761-053244` (trạng thái: nháp)

### TP-AT09 Phim hiểu được khi tắt tiếng

- **Cách làm** (tham số từ: mẫu + đề xuất): Hình tự đứng được khi tắt tiếng: phụ đề burn-in; 12 giây đầu hoàn toàn không tiếng rồi mới có tiếng đầu tiên; hoặc phim câm 45 giây trong đó âm thanh kể một nửa câu chuyện.
- **Lỗi hay gặp:** Chữ trên hình và phụ đề cùng nói một nội dung thì thừa; chỉ một trong hai là phụ đề, còn lại là nhãn.
- **Mẫu nguồn:** `adrianduta96-992248`, `everestchris6-399895`, `howdevelop-733090`, `astrothewizard-618782`, `kamstudiolabs-877996` (trạng thái: nháp)

### TP-AT10 Phân tích số bài nhạc khi AI không nghe được

- **Cách làm** (tham số từ: mẫu): Claude không nghe được nên phân tích bằng số: numpy tìm tempo, lưới nhịp, năng lượng từng ô nhạc, drop; hiệu chỉnh lưới theo cú kick thật; JSON bản đồ nhịp (hit, break, onset kick, snare, hat); video bắt đầu 8 hoặc 12 nhịp trước drop để cảnh quan trọng rơi đúng drop; cắt 30 s từ phách đầu tiên.
- **Lỗi hay gặp:** Lưới nhịp không hiệu chỉnh theo kick thật làm cảnh lệch drop vài chục mili giây.
- **Mẫu nguồn:** `raphaelaubryy-687877`, `xanares-738984`, `diamai-157697`, `majin-appsheet-693327` (trạng thái: nháp)

## TP-TT — tương tác (chỉ ghi để biết)

| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |
|---|---|---|---|---|---|---|
| TP-TT01 | Nút Explode, rê chuột hiện giải thích, kéo xoay | Three.js | nhẹ | CL-07, CL-13 | — | 4 |
| TP-TT02 | Thẻ phóng to khi trỏ chuột và làm tối nền hộp thoại | Canvas, CSS | nhẹ | CL-16 | — | 2 |
| TP-TT03 | Mũi tên chấm khi kéo và phản hồi khi tìm thấy | Canvas, Three.js | nhẹ | CL-16 | — | 2 |
| TP-TT04 | Phân tích nhạc để đồng bộ hiệu ứng trong trò chơi | Three.js, WebGL shader, Web Audio | nặng |  | — | 1 |

### TP-TT01 Nút Explode, rê chuột hiện giải thích, kéo xoay

- **Cách làm** (tham số từ: mẫu): Trang tương tác một file HTML với Three.js: kéo để xoay, cuộn để zoom, thanh trượt, nút Explode (mỗi bộ phận trượt ra kèm nhãn tên; bấm lại thì thu về; rê chuột lên một bộ phận thì nó sáng lên kèm một dòng giải thích). Không phải video; chỉ là nguồn ý cho cảnh khoa học có thể quay lại (xem TP-3D06).
- **Lỗi hay gặp:** Video không có con trỏ thật nên phải thay rê chuột bằng con trỏ ảo hoặc tô sáng theo kịch bản.
- **Mẫu nguồn:** `0xspikez-483865`, `aichrislee-378670`, `0xsolty-735200`, `adomicael-707503` (trạng thái: nháp)

### TP-TT02 Thẻ phóng to khi trỏ chuột và làm tối nền hộp thoại

- **Cách làm** (tham số từ: mẫu): Thẻ bài phóng to và hiện mô tả khi trỏ chuột, nền làm tối đi một chút; làm tối nền khi mở hộp thoại để tập trung vào hộp. Chỉ ghi để biết.
- **Lỗi hay gặp:** Không dùng được trong video không tương tác, trừ khi quay màn hình.
- **Mẫu nguồn:** `aisongman-461057`, `opener-ai-843891` (trạng thái: nháp)

### TP-TT03 Mũi tên chấm khi kéo và phản hồi khi tìm thấy

- **Cách làm** (tham số từ: mẫu): Mũi tên chấm nối từ quân đang chọn tới mục tiêu khi kéo. Phản hồi khi tìm thấy: tia vàng bung ra khoảng 0,5 s kèm cập nhật bộ đếm trên bảng. Chỉ ghi để biết.
- **Lỗi hay gặp:** Phản hồi chỉ có ý nghĩa khi người dùng thật thao tác.
- **Mẫu nguồn:** `aisongman-461057`, `mandelduck-768972` (trạng thái: nháp)

### TP-TT04 Phân tích nhạc để đồng bộ hiệu ứng trong trò chơi

- **Cách làm** (tham số từ: mẫu): Phân tích file nhạc để lấy thời điểm từng nốt rồi đồng bộ hiệu ứng; mỗi đoạn nhạc một cảnh khác tính cách; nốt nhạc là các khối neon trượt dọc bảy làn màu về phía máy quay, khối cao tương ứng cao độ. Điểm hợp Media 0; chỉ ghi để biết.
- **Lỗi hay gặp:** Dùng nhạc có bản quyền làm nguồn dữ liệu cần kiểm tra giấy phép.
- **Mẫu nguồn:** `gandamu-ml-220530` (trạng thái: nháp)

## Lớp hoàn thiện bắt buộc

Mức tối thiểu mỗi video phải có, theo nhóm chất liệu. Rút từ bài học đã đo của Media (bản chỉ đạo 27/10/2026: mẫu lịch sử AI 60 giây, bản 30 giây một lượt) và từ các mẫu đạt điểm hợp Media 3 trong 100 mục. Ngưỡng ghi 'đề xuất' chưa thử trên video thật. Cách kiểm đưa vào bảng kiểm trước khi giao (module 15) và thanh chất lượng (module 07).

Nhóm chất liệu và mã chất liệu thuộc nhóm:

- 2d_phang: CL-01, CL-02, CL-04, CL-09, CL-15, CL-16
- net_ve: CL-03, CL-10
- do_thi: CL-05, CL-14
- 3d: CL-06, CL-07, CL-08, CL-12, CL-13
- chu_dong: CL-11

### Chung cho mọi video

| Mã | Yêu cầu | Lý do | Mã TP | Cách kiểm |
|---|---|---|---|---|
| HT-CH-01 | Mọi chuyển động có tăng tốc rồi giảm tốc; chuyển động đều chỉ dùng cho thanh tiến độ, bộ đếm theo đồng hồ toàn phim và vòng lặp. | Mẫu cao cấp thay easing bằng lò xo hoặc cubic-bezier; chuyển động đều làm hình cứng. | TP-CD01, TP-CD02 | Vẽ đồ thị vị trí theo thời gian của 3 phần tử bất kỳ: không có đoạn thẳng, trừ ngoại lệ đã nêu. |
| HT-CH-02 | Nhóm phần tử (ký tự, thẻ, hàng, thanh) vào lệch nhịp, không vào cùng một khung. | Mẫu có lò xo riêng cho từng ký tự với khoảng trễ 125 ms; vào cùng một khung thì cả nhóm hiện như một khối, không thấy thứ tự. | TP-CD03 | Chụp 3 khung liên tiếp lúc nhóm đang vào: các phần tử phải ở trạng thái khác nhau. |
| HT-CH-03 | Không phần tử nào đứng yên quá 1,5 s (nền trôi chậm, máy quay ảo đẩy chậm, vi chuyển động); ngoại lệ có chủ đích là dừng tối thiểu 400 ms trước đoạn kết. | Mẫu cao cấp không đóng băng máy quay; cảnh đứng yên giữ lâu làm người xem tưởng video bị đứng hình. Ngưỡng 1,5 s là yêu cầu lớp hoàn thiện của Media (đề xuất). | TP-CD07, TP-CD08, TP-CD09 | So hai khung cách nhau 1,5 s trong cùng cảnh: phải có điểm ảnh khác nhau ở nền hoặc ở một phần tử. |
| HT-CH-04 | Chuyển cảnh: cảnh sau hiện trước mốc cảnh trước ra hết 0,3–0,5 s ở lớp nền và hình; chữ cũ rời hẳn trước khi chữ mới vào cùng chỗ. | Cắt cứng giữa hai cảnh để lại khoảng trống hoặc va chạm; flood mẫu mất khoảng 0,3 s. | TP-CC08, TP-CC05, TP-CD04 | Chụp khung ở mốc cảnh trước ra hết: phải thấy cảnh sau đã hiện, và không có hai lớp chữ chồng nhau. |
| HT-CH-05 | Khi xuất 60 khung/giây và có chuyển động nhanh (quét, lia, đếm số nhanh): bật nhoè chuyển động bằng khung phụ. Xuất 30 khung/giây thì không bật, vì chi phí máy gấp khoảng 8 lần. | Số đo của Media: mẫu lịch sử AI 60 giây ở 60 khung/giây có nhoè mất 23,3 phút máy, gấp khoảng 8 lần bản không nhoè. | TP-HK04 | Bảng kiểm ghi khung/giây và có hay không nhoè; nhoè chỉ trên phần chuyển động, chữ đứng yên giữ nét. |
| HT-CH-06 | Hạt nhiễu tối đa độ đục khoảng 6%, hạt mới mỗi khung; sau khi xuất kiểm kích thước file. | Mẫu lịch sử AI 60 giây: lớp hạt nhiễu làm file 134 MB. Độ đục cao cũng làm mất chữ nhỏ khi nén. | TP-HK01 | Kích thước file xuất chia thời lượng ra MB mỗi giây, so với video gần nhất cùng độ dài; lệch trên 2 lần thì mở lớp hạt ra xem. |
| HT-CH-07 | Mỗi ý có chữ giữ tối thiểu 1,4 s; ý có số liệu hoặc giải thích giữ tối thiểu 2,5 s; chữ khổng lồ một ý mỗi 1–2 s. | Mẫu: mỗi bố cục 1,4–3,5 s; mỗi tính năng tối thiểu 2,5 s; ý mới mỗi 1,5–2 s ở chữ động. | TP-CH03, TP-CH15 | Liệt kê thời lượng từng ý từ file chương: không ý nào ngắn hơn ngưỡng của loại ý đó. |
| HT-CH-08 | Hình đọc được khi tắt tiếng: phụ đề burn-in; khổ dọc có phụ đề cách mép dưới tối thiểu 20% chiều cao. | Phần lớn người xem tắt tiếng; nút của mạng xã hội che mép dưới khung dọc. | TP-AT09, TP-CH15 | Xem bản không tiếng: hiểu được ý chính; đo khoảng cách phụ đề tới mép dưới trên khung dọc. |
| HT-CH-09 | Âm lượng chuẩn −14 LUFS, −2 dBTP, đo lại sau khi mã hoá AAC; hạ nhạc −18 dB khi có giọng; tiếng hiệu ứng không to hơn nhạc. | Chuẩn trực tuyến mà nhiều mẫu dùng. | TP-AT03, TP-AT04 | Chạy ffmpeg loudnorm ở chế độ đo trên file đã mã hoá; ghi kết quả vào bảng kiểm. |
| HT-CH-10 | Xem lại bản dựng bằng khung tĩnh mỗi nhịp; tối thiểu 3 vòng xem và sửa; khi dùng ảnh đích để tác tử con đối chiếu thì gộp thành 1–2 ảnh ghép. | Số đo của Media: bản một lượt 30 giây còn 1–2 lỗi nhìn thấy; đưa quá nhiều ảnh đích làm tác tử con bị đẩy ảnh ra khỏi ngữ cảnh. | — | Sổ vòng sửa (module 07) ghi số vòng và lỗi còn lại của từng vòng. |

### Riêng nhóm 2D phẳng

| Mã | Yêu cầu | Lý do | Mã TP | Cách kiểm |
|---|---|---|---|---|
| HT-2D-01 | Phần tử vào theo thứ tự đọc: tiêu đề, rồi hình, rồi con số; mỗi bước lệch 60–150 ms (đề xuất). | Mẫu bàn thao tác và thẻ số liệu đọc được theo thứ tự tiêu đề, hình, con số. | TP-CD03, TP-SL17 | Xem 5 khung đầu của một cảnh: thứ tự xuất hiện đúng thứ tự đọc. |
| HT-2D-02 | Nội dung trong vật chứa đổi theo thứ tự: vào sau khi vật chứa bắt đầu biến dạng, ra trước khi biến dạng tiếp; chữ cũ rời trước chữ mới. | Mẫu một hình biến qua nhiều trạng thái tránh chữ chồng nhau. | TP-CD04, TP-CC01 | Chụp khung giữa lúc đổi: không có hai lớp chữ chồng nhau. |
| HT-2D-03 | Nền không đứng yên: nền trôi chậm hoặc nhiều lớp trôi khác tốc độ; chuyển cảnh có ít nhất một lần đổi nền (tối, sáng, màu đặc) để ngắt nhịp. | Mẫu đổi nền theo ý và xen tối sáng giữ nhịp. | TP-CD08, TP-CC10 | So nền ở hai thời điểm cách nhau 1,5 s: khác nhau; đếm số lần đổi nền trong video. |
| HT-2D-04 | Số chạy sau khi thanh hoặc vật tới nơi; chữ số độ rộng bằng nhau. | Mẫu thanh dài ra rồi mới hiện số; chữ số khác độ rộng làm số rung. | TP-SL01, TP-SL03 | Xem cảnh số liệu từng khung: số chỉ đổi sau khi thanh dừng, không rung ngang. |
| HT-2D-05 | Danh sách bước có ba trạng thái (đang làm, xong, chưa tới) và thanh bước luôn hiện. | Mẫu bàn thao tác cho người xem biết đang ở bước nào. | TP-SL17, TP-CH17 | Mỗi cảnh có đúng một bước đang làm. |
| HT-2D-06 | Một màu nhấn chỉ mang một nghĩa suốt video. | Mẫu đỏ cho vấn đề và cyan cho giải pháp; khoá màu theo chức năng. | TP-CH04, TP-3D07 | Liệt kê các màu nhấn và nghĩa từng màu; không màu nào hai nghĩa. |
| HT-2D-07 | Vật phẳng được lấp dần theo bước; không hiện cả vật một lúc rồi mới chú thích. | Mẫu mức chất lỏng dâng theo từng bước cạnh vạch chia. | TP-SL17, TP-CD01 | Xem khung đầu và cuối mỗi bước: vật khác nhau đúng phần của bước đó. |

### Riêng nhóm Nét vẽ

| Mã | Yêu cầu | Lý do | Mã TP | Cách kiểm |
|---|---|---|---|---|
| HT-NV-01 | Nét hiện dần theo lời, một nét hoặc một cụm nét cho mỗi cụm lời; bút hiển thị đi theo nét đang vẽ. | Mẫu whiteboard vẽ dần theo thuyết minh. | TP-CH19, TP-CD02 | So mốc lời đọc với mốc nét đầu tiên của cảnh: nét hiện trong vòng 0,3 s kể từ khi lời nhắc tới (đề xuất). |
| HT-NV-02 | Nét có rung nhẹ và hai lượt, có vân giấy; không dùng nét vector hoàn hảo. | Mẫu bút chì: sóng sin đổi pha 8 lần mỗi giây, hai lượt độ đục 90% và 40%. | TP-HK08 | Phóng một đoạn nét 400%: thấy vân giấy và độ dày không đều. |
| HT-NV-03 | Cảnh có tiêu đề câu hoàn chỉnh viết tay ở trên trái, hình vẽ dần bên dưới, câu thuyết minh ở chân khung. | Mẫu bảng trắng và sổ ghi chép đọc được theo thứ tự tiêu đề, hình, con số. | TP-CH19, TP-CH15 | Mỗi cảnh có đủ ba phần ở đúng vị trí. |
| HT-NV-04 | Cảnh cuối là bảng tóm tắt đánh số, mục chính tô màu nhấn dần theo lời. | Mẫu bảng tóm tắt toàn bộ câu chuyện. | TP-SL16 | Số mục tóm tắt khớp số ý đã nói trong video. |
| HT-NV-05 | Dấu căn lề ở bốn góc và mã cảnh nhỏ; màu nhấn đỏ chỉ ở điểm chính. | Mẫu tờ ghi chép dùng dấu căn lề và đỏ chỉ để nhấn. | TP-CH16, TP-HK08 | Đếm vùng đỏ trên một cảnh: chỉ ở điểm chính. |

### Riêng nhóm Đồ thị

| Mã | Yêu cầu | Lý do | Mã TP | Cách kiểm |
|---|---|---|---|---|
| HT-DT-01 | Đường tự vẽ theo lò xo, vượt đích rất nhỏ rồi lắng; nhãn hiện sau khi đường tới nơi. | Mẫu đường vẽ lò xo cạnh nhãn phần trăm. | TP-SL02, TP-CD01 | Chụp khung đường chưa tới nơi: chưa có nhãn. |
| HT-DT-02 | Thanh dài ra trước, số hiện sau. | Mẫu biểu đồ thanh ngang tài chính. | TP-SL01 | Như HT-2D-04. |
| HT-DT-03 | Mỗi đồ thị có chú thích bằng khung bao, nhãn và mũi tên cong chỉ đúng điểm cần xem. | Mẫu chú thích khung bao công thức; chú thích mũi tên cong. | TP-SL18 | Mỗi đồ thị có ít nhất một chú thích chỉ đúng điểm đang được nói. |
| HT-DT-04 | Số trên màn hình đọc từ file dữ kiện; hình và bộ đếm của mô phỏng đọc cùng một mảng dữ liệu. | Mẫu dựng hình đọc thẳng bảng nguồn; bộ đếm theo mô phỏng thật. | TP-SL14, TP-SL19 | Đối chiếu 5 số bất kỳ trên màn hình với file dữ kiện. |
| HT-DT-05 | Điểm đang xét có chấm kéo theo đường dọc nét đứt và hộp nhãn. | Mẫu đường giá trái phiếu có chấm và hộp nhãn độ nhạy. | TP-SL02 | Mỗi đồ thị đường có chấm và nhãn tại điểm đang xét. |
| HT-DT-06 | Đồ thị không đứng yên quá 1,5 s: điểm trượt, ô điền, vùng nhấn đổi. | Cùng nguyên tắc không đứng yên của nhóm chung. | TP-CD09 | Như HT-CH-03. |
| HT-DT-07 | Chữ trục và nhãn giữ nét: vẽ lại vector ở tỷ lệ phóng; nhoè chuyển động chỉ trên phần chuyển động. | Mẫu nhoè chỉ phần chuyển động, chữ và hình đứng yên giữ nét. | TP-HK04, TP-CD07 | Phóng 200% vào chữ trục ở khung sau khi phóng máy quay: không vỡ nét. |

### Riêng nhóm 3D

| Mã | Yêu cầu | Lý do | Mã TP | Cách kiểm |
|---|---|---|---|---|
| HT-3D-01 | Máy quay luôn chuyển động chậm (quỹ đạo, đẩy, bay), không đứng yên hẳn; ngoại lệ là cảnh đẳng cự có chủ đích, trong đó đồ vật xuất hiện lần lượt. | Mẫu quỹ đạo chậm và bay chậm; mẫu sa bàn đẳng cự giữ máy quay đứng yên. | TP-3D01, TP-3D02, TP-3D03 | So hai khung cách nhau 1,5 s: góc máy khác nhau, trừ cảnh đẳng cự. |
| HT-3D-02 | Có độ sâu trường ảnh hoặc sương khí quyển để tạo chiều sâu; đổi tiêu điểm khoảng 0,5 s. | Mẫu cận cảnh nông và phối cảnh khí quyển. | TP-3D05, TP-3D08 | Xem một cảnh 3D: tiền cảnh và hậu cảnh khác độ nét hoặc độ sáng. |
| HT-3D-03 | Ánh sáng có đèn chính và đèn phụ, bóng mềm, sàn phản chiếu mờ dần; bloom nhẹ ở điểm sáng. | Mẫu ba vật cơ bản trên sàn phản chiếu; giờ vàng có bloom. | TP-3D09, TP-HK05 | Xem khung tĩnh: có bóng đổ và hướng sáng nhất quán. |
| HT-3D-04 | Nhãn bám vật bằng phép chiếu máy quay, có đường dẫn; nhãn hiện sau khi bộ phận đã rõ. | Mẫu tách lớp có nhãn đường dẫn tới từng tầng. | TP-SL18, TP-3D06 | Quay máy quay: nhãn vẫn bám đúng bộ phận. |
| HT-3D-05 | Màu theo chức năng, có bảng chú giải cố định, dùng nhất quán suốt video. | Mẫu khoá màu điện, nhiệt, làm mát. | TP-3D07 | Liệt kê màu và chức năng: một màu một chức năng. |
| HT-3D-06 | Hạt chạy theo chiều dòng để chỉ hướng của điện, nhiệt hoặc chất lỏng. | Mẫu hạt chạy dọc ống. | TP-3D07, TP-HK12 | Chiều chạy của hạt khớp chiều mũi tên chú giải. |
| HT-3D-07 | Hậu kỳ nhẹ: vignette khoảng 0,65 ở góc, hạt nhiễu tối đa khoảng 6%. | Mẫu hậu kỳ phim bằng numpy; ngưỡng hạt từ bài học mẫu lịch sử AI. | TP-HK02, TP-HK01 | Xem khung tĩnh: góc tối hơn giữa khung, hạt chỉ thấy khi phóng. |
| HT-3D-08 | Thu phóng quy mô có vật tham chiếu cho thấy tỷ lệ ở mỗi bậc. | Mẫu thu nhỏ theo bậc quy mô có cây thấp-poly và thước đo. | TP-CC04, TP-3D06 | Mỗi bậc quy mô có một vật tham chiếu hoặc thước đo. |
| HT-3D-09 | Dựng thử 1–2 khung của cảnh nặng (shader, mô phỏng, Blender) và ghi thời gian máy mỗi khung trước khi dựng cả cảnh. | Số đo của Media: 13 s máy mỗi khung ở Blender Cycles. | TP-3D14, TP-3D15, TP-3D05 | Sổ vòng sửa ghi thời gian máy ước cho cả video trước khi chạy. |

### Riêng nhóm Chữ động

| Mã | Yêu cầu | Lý do | Mã TP | Cách kiểm |
|---|---|---|---|---|
| HT-CD-01 | Một ý mỗi nhịp 1–2 s; chữ chiếm gần hết khung (đề xuất từ 70% chiều rộng khung trở lên). | Mẫu chữ khổng lồ mỗi ý một nhịp. | TP-CH03 | Đo chiều rộng khối chữ trên một khung mỗi ý. |
| HT-CD-02 | Nền đổi màu theo ý; màu nền cùng bộ màu đã chọn. | Mẫu nền kem, đen, cam đất đổi theo nhịp cắt 1,5 s. | TP-CC10 | Mỗi ý một nền; màu nền thuộc bộ màu của video. |
| HT-CD-03 | Chữ vào bằng mặt nạ hoặc lò xo, lệch nhịp theo ký tự; không vào bằng mờ dần. | Mẫu chữ trồi qua mặt nạ với lò xo riêng từng ký tự. | TP-CH01, TP-CD03 | Chụp 3 khung lúc chữ vào: phần chữ chưa hiện bị cắt bởi mặt nạ, không mờ. |
| HT-CD-04 | Chữ cũ rời hẳn trước khi chữ mới vào cùng chỗ. | Mẫu dặn chữ cũ phải rời trước chữ mới. | TP-CD04, TP-CC08 | Chụp khung giữa hai ý: không có hai lớp chữ chồng nhau. |
| HT-CD-05 | Mỗi cảnh một từ nhấn, cùng một màu nhấn. | Mẫu một từ serif nghiêng màu nhấn. | TP-CH05, TP-CH06 | Mỗi cảnh có đúng một từ nhấn. |
| HT-CD-06 | Sau mỗi 3–4 ý có một cảnh nhấn bằng nền đặc hoặc một vật để ngắt nhịp (đề xuất). | Mẫu nền cam đặc ngăn các cảnh sáng và tối. | TP-CC10 | Đếm số ý giữa hai cảnh nhấn. |
| HT-CD-07 | Chữ khổng lồ đo bằng phông thật, không tràn mép; khổ dọc co vào vùng an toàn. | Mẫu đo phụ đề bằng phông thật rồi co cho vừa vùng an toàn 9:16. | TP-CH15 | Không chữ nào bị cắt ở mép khung xuất. |
| HT-CD-08 | Hạt và quầng sáng chỉ dùng ở chữ nhấn kết, không dùng ở chữ thường. | Hạt làm chữ nhỏ khó đọc. | TP-CH12, TP-HK05 | Xem chữ thường: không hạt, không quầng. |

