# Thẻ phong cách dựng D-09b — Kem & xuyên thấu, chi tiết kỹ thuật

> Thẻ ngăn B, biến thể của D-09 Kem & xuyên thấu (`d09_kem_va_xuyen_thau.md`). Theo quy ước kho, D-09 đã dùng cho video giao thật nên không sửa ngầm; gu mới ghi thành biến thể này.
> Lập ngày 26/10/2026 theo yêu cầu của Trung sau khi duyệt video "Bên trong buồng máy tua-bin gió" bản cuối v3 và cảnh thử chi tiết hệ xoay cánh: "lưu các sửa đổi của tôi khi làm video này thành một phong cách".
> Mọi ô không ghi ở đây giữ nguyên như thẻ D-09 (nguồn mẫu, bố cục, cách nhãn, phụ đề, nhịp máy quay).

## Ba điểm Trung chốt (26/10/2026)

| Điểm | Trung nói | Thông số áp dụng |
|---|---|---|
| 1. Âm thanh | Nhạc tươi trẻ, nhịp nói 1,2 | Giọng VieNeu Hải Đăng tăng tốc **1,2 lần** bằng `atempo` (giữ cao độ). Trung đã nghe thử 1,2 / 1,3 / 1,4 và chọn 1,2; không dùng 1,4. Nhạc nền nhạc doanh nghiệp hoặc điện tử nhẹ, nhịp vui, không trầm kiểu phim tài liệu; âm lượng khoảng 0,16. Bản đang dùng: "Close Up" (Mixkit); dự phòng "Infinity" (Mixkit), `tai_san/nhac_nen/README.md` |
| 2. Hình kỹ thuật | Mô tả hình ảnh chi tiết đối với các chi tiết kỹ thuật | **Mọi bộ phận xuất hiện trong khung** dựng ở mức chi tiết của cảnh thử hệ xoay cánh (Trung chọn mức này, không chọn mức chỉ bộ phận chính). Cụ thể ở mục dưới |
| 3. Màu | Tông sáng, hấp dẫn, trẻ trung | Bảng màu A của D-09: nền kem `#F4F1EA`, vỏ trắng viền `#B8B0A2`, vàng nắng `#FFC93C`, cam vàng `#F2A91E`, xanh ngọc `#1FB5A8` / `#58D3C6`, đồng `#D9894A`, nhấn cam san hô `#FF6B4A`, chữ `#2B2B2B`. Không dùng nền tối |

## Mức chi tiết kỹ thuật (điểm 2)

Chuẩn là cảnh thử `san_pham/2026.10.26.buong_may_tuabin/tai_nguyen/ban_nhap/2026.10.26.chi_tiet_he_xoay_canh_d09_thu_v1.mp4`, mã `xuong_dai/buong_may/src/chi_tiet/`:

1. **Bánh răng có răng thật, đúng số răng, ăn khớp đúng pha.** Dựng bằng `HinhBanhRang.ts` (bánh răng ngoài, vòng răng trong theo mô-đun và số răng); góc từng bánh tính từ điều kiện ăn khớp, không đặt tay. Tỉ số răng ghi trên nhãn khi có ý nghĩa.
2. **Chi tiết lặp có đủ số lượng:** bu-lông, cánh tản nhiệt động cơ, cuộn dây, chốt.
3. **Vạch màu trên mặt mọi bộ phận quay** để thấy bộ phận nào quay, nhanh hay chậm.
4. **Tách lớp** (bộ phận nhiều tầng tách ra rồi khớp lại) theo hướng có chỗ trống; giá đỡ làm dạng tay đòn, không làm đĩa kín che bộ phận bên dưới.
5. **Vỏ xuyên thấu có viền** để thấy bên trong mà vẫn giữ hình khối.
6. **Máy quay nhìn chếch xuống 30–40 độ** khi cần thấy bên trong từng tầng; không đứng trong vòng quét của bộ phận quay.
7. Thứ không dựng được bằng mã (người, cáp mềm, chi tiết đúc phức tạp) thì tải mô hình có giấy phép rõ (Sketchfab, Mixamo), ghi nguồn vào `tai_san/`.

**Cái giá phải nói trước với Trung mỗi lần nhận việc:** dựng mọi bộ phận ở mức này tốn nhiều thời gian máy làm hơn D-09 thường. Ước (chưa đo trên video đầy đủ): một bộ phận chi tiết mới mất khoảng 1–2 giờ viết mã và soát; video 2 phút có 6–8 bộ phận mới có thể mất trọn một ngày. Bộ phận đã dựng thì dùng lại được (gom vào `src/chi_tiet/`). Ánh sáng vẫn là Three.js: khe răng chưa tối, kim loại chưa bóng như mẫu; muốn hơn thì kết xuất Blender (module 10 mục 6, 8).

## Bộ biến thể màu và nhạc (thêm 26/10/2026)

Ngoài bảng màu và nhạc ở điểm 1 và 3, D-09b có 8 bảng màu thay thế (M1–M5 nền sáng, M6–M8 nền tối, Trung cho phép ngoại lệ nền tối khi chọn rõ mã) và 10 bài nhạc cùng nhóm (NH01–NH10), ghép thành 80 tổ hợp có ma trận Hợp / Cân nhắc / Không nên: `d09b_bien_the_mau_nhac.md`. Gọi tổ hợp là "D-09b · M3 · NH09". Không nói mã nào thì vẫn là bảng gốc (M0) với "Close Up" hoặc "Infinity".

## THẺ PHONG CÁCH: Kem & xuyên thấu, chi tiết kỹ thuật

| Trường | Nội dung |
|---|---|
| **Mã** | D-09b |
| **Tên phong cách** | Kem & xuyên thấu, chi tiết kỹ thuật |
| **Ngày lập** | 2026-10-26 |
| **Nguồn mẫu** | Như D-09 (YouTube Anscience, "How Do Wind Turbines Really Work?"), cộng gu Trung chốt sau video buồng máy tua-bin |
| **Trung thích điểm gì** | Ba điểm ở bảng đầu thẻ |
| **Bảng màu** | Như D-09, xem điểm 3 |
| **Kiểu chữ và cỡ chữ** | Như D-09 |
| **Bố cục** | Như D-09, cộng góc nhìn chếch xuống cho bộ phận nhiều tầng |
| **Hình ảnh** | Như D-09, cộng mức chi tiết kỹ thuật ở mục trên cho mọi bộ phận xuất hiện |
| **Nhịp cắt (giây)** | Như D-09 (khoảng 3–5 giây một góc máy, máy quay trượt liên tục) |
| **Kiểu chuyển động** | Như D-09, cộng bánh răng quay đúng tỉ số và tách lớp rồi khớp lại |
| **Cách làm phụ đề** | Như D-09: phụ đề theo câu, nền trắng gạch cam |
| **Tiết tấu âm thanh** | Giọng Hải Đăng 1,2 lần; nhạc tươi, nhịp vui, âm lượng 0,16; nhạc ngắn hơn video thì theo thứ tự ở `08_giong_am_thanh_phu_de.md` mục 7 |
| **Mật độ thông tin** | Một bộ phận chính mỗi góc máy, tối đa 5 nhãn cùng lúc; nhãn có thể kèm số răng, tỉ số |
| **Hợp với loại nội dung nào** | Giải thích máy móc có cấu tạo cơ khí bên trong (hộp số, động cơ, tua-bin, bơm, máy nén), người xem muốn thấy rõ từng chi tiết; video ngang 1–3 phút, có thời gian dựng một đến vài ngày |
| **KHÔNG hợp với loại nào** | Cần ra video trong vài giờ (dùng D-09); nội dung không có cấu tạo cơ khí; khổ dọc ngắn; tài chính trừu tượng; chủ đề nghiêm trọng cần tông trầm |
| **Hợp với phong cách kịch bản nào** | KB-01 Hợp · KB-02 Hợp · KB-03 Cân nhắc · KB-04 Hợp · KB-05 Rất hợp · KB-06 Không nên · KB-07 Cân nhắc · KB-08 Cân nhắc (Bảng 3 của `00_muc_luc.md`) |
| **Trạng thái** | **đã duyệt** (26/10/2026, Trung đọc ra ba điểm và chọn phạm vi chi tiết, dạng lưu) |
| **Ghi chú khi dùng thử** | **Video monopile và các loại móng ngoài khơi (26/10/2026, Trung duyệt bản cuối v2):** lần đầu dùng bảng M4 Biển cát, hợp chủ đề biển; mô hình chính là khối biển mặt cắt hai lớp đất, đất trong dần để thấy cọc cắm sâu, nước là khối trong. Nhạc N02 bị Trung nghe thấy rè từ giây 60 (lớp tiếng cao tần của bài), đổi sang N06 nối lặp; xem phụ lục nhạc dòng N02. **Video hiệu ứng che gió (26/10/2026, Trung duyệt bản cuối v2):** video hiện tượng ngoài trời, vật chính là tua-bin trắng; bảng M0 nền kem không đạt tương phản, bảng M6 nền tối đạt 16,3:1; xem quy tắc tương phản vật chính ở ô Nhật ký sửa. Video đầy đủ đầu tiên: "Bên trong máy biến áp" (26/10/2026, Trung duyệt bản nháp thành bản cuối không sửa: `san_pham/2026.10.26.may_bien_ap/2026.10.26.may_bien_ap_d09b_v1_cuoi.mp4`, 106,6 giây, KB-05). Máy không có bộ phận quay nên quy tắc bánh răng và vạch quay chỉ dùng ở trục bộ đổi nấc; chi tiết dồn vào lá thép, vòng dây, tán sứ, lá tản nhiệt. Thời gian thật khoảng 25 phút máy làm, không phải một ngày như ước. Nhạc dùng bản dự phòng "Infinity" vì "Close Up" ngắn hơn video quá nhiều. Trước đó: video buồng máy bản cuối v3 (điểm 1, 3) và cảnh thử hệ xoay cánh (điểm 2, 3). Video thứ hai: làm lại "Pin mặt trời tạo điện thế nào" (26/10/2026, Trung duyệt bản nháp thành bản cuối không sửa: `san_pham/2026.10.25.Pin mặt trời hoạt động như thế nào mà không cần bộ phận quay?/2026.10.26.pin_mat_troi_d09b_v1_cuoi.mp4`, 131,9 giây, lời và giọng cũ); không có bộ phận quay trong pin nên chi tiết dồn vào ngón bạc, thanh cái, dải hàn, khung nhôm chữ C, mặt khắc nhám; vạch màu quay chỉ dùng ở tổ tua-bin đối chứng; nhạc "Infinity" nối lặp vì video dài hơn bài. Video thứ ba: "Bên trong inverter" (26/10/2026, tổ hợp M0 · N09, Trung duyệt bản nháp thành bản cuối không sửa: `san_pham/2026.10.26.Cấu tạo chi tiết của Inverter điện mặt trời/2026.10.26.inverter_d09b_v1_cuoi.mp4`, 117,9 giây, KB-05); thiết bị điện tử không có bộ phận quay, chi tiết dồn vào cuộn cảm xuyến quấn từng vòng, vỏ bán dẫn ba chân có vít, tụ có rãnh chữ K, lá tản nhiệt, linh kiện dán rải trên bo; cơ chế điện vẽ thêm bằng sơ đồ cầu H nổi trước bo mạch và thẻ đồ thị sóng SVG góc phải trên. Theo giờ tạo file: lời 15:30, mô hình 15:37, giọng 15:48, dòng thời gian 15:54, bản nháp sau hai lượt kết xuất (mỗi lượt 5,5 phút) 16:09, tức khoảng 40 phút máy làm, chưa tính thời gian chờ Trung trả lời. Video thứ tư: "Bên trong hộp số tua-bin gió" (26/10/2026, tổ hợp M0 · N10, bản nháp `san_pham/2026.10.26.hop_so_tuabin/2026.10.26.hop_so_tuabin_d09b_v1_nhap.mp4`, 152,6 giây, KB-05, chờ Trung duyệt); lần đầu dùng đủ quy tắc bánh răng của thẻ cho cả một video: bánh răng nghiêng ăn khớp đúng pha ở ba tầng, ổ lăn có con lăn, vạch đỏ trên mọi bộ phận quay; khoảng 55 phút máy làm, vẫn xa mức "trọn một ngày" vì bộ dựng bánh răng có sẵn từ cảnh thử hệ xoay cánh **Video BESS (26/10/2026, D-09b · M0 · Infinity, 118,6 giây, bản cuối `san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/2026.10.26.bess_d09b_v2_cuoi.mp4`):** chi tiết lặp đủ số lượng (52 tế bào mỗi mô-đun có cực, van xả, thanh nối theo thứ tự nối tiếp). Trung chê bản nháp v1 hình nháy giây 10–20 do tô sáng màu cam san hô bật tắt tức thì trong một khung. Quy tắc mới của thẻ: **tô sáng phải chuyển màu dần (khoảng 12 khung), không bật tắt tức thì**; cú lia máy quay quãng xa không ngắn hơn khoảng 2 giây. **Video cấu trúc nhà máy điện mặt trời (27/10/2026), M2 · N10 nối lặp, Trung duyệt bản nháp v2 làm bản cuối.** Một mô hình toàn nhà máy, máy quay bay liền một mạch từ toàn cảnh vào từng bộ phận rồi lùi ra, không đổi chỗ đặt mô hình. Ba lỗi đã vấp: khối tấm pin chép từ video nghẽn lưới quay mặt về phía xa máy quay nên phải lật góc nghiêng; cận cảnh inverter dưới gầm giá đỡ phải hạ máy quay thấp hơn mép tấm (dưới 1,1 m); hạt dòng điện phải nhỏ (bán kính 0,08–0,1) và không chạy qua chỗ máy quay đứng khi máy quay cách 2–5 m. Tương phản tấm pin trên nền M2 đạt 3,84:1; vật vỏ trắng (container, nhà điều hành) chỉ nổi lên nhờ viền. |
| **Nhật ký sửa** | 26/10/2026: thêm bộ biến thể 8 bảng màu × 10 bài nhạc (phụ lục `d09b_bien_the_mau_nhac.md`); các ô của thẻ không đổi. 26/10/2026 (đêm), sửa công khai, không sửa ngầm ô cũ: thêm **Quy tắc tương phản vật chính (Trung chốt 26/10/2026, sau video che gió):** vật chính của cảnh, kể cả khi nó là vỏ trắng, phải đạt ≥ 3:1 với nền; vỏ trắng trên nền kem chỉ 1,13:1 nên chỉ được làm lớp ngoài trong suốt để nhìn vào bộ phận màu, không được làm vật chính. Vật chính cao ít nhất 1/4 khung hình ở mỗi cảnh; cảnh toàn cảnh mà giữ đúng tỉ lệ thì vật quá bé được vẽ to hơn tỉ lệ thật và ghi chú trên hình. Đo trên khung cắt từ mp4 bằng `scripts/do_tuong_phan_khung.py`. Lý do: video hiệu ứng che gió bản v1 dùng tua-bin trắng trên nền kem, Trung chê không nổi, tua-bin quá bé; bản v2 chuyển M6 nền tối (16,3:1 đo trên khung) và vẽ tua-bin to hơn 1,5 lần ở cảnh toàn trang trại |
