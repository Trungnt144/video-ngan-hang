# Mẫu kịch bản và tổ hợp gợi ý cho loạt video thuật ngữ ngân hàng

> Bản đọc sinh từ `mau_kich_ban.json` bằng `python3 scripts/sinh_mau_kich_ban.py` — sửa file JSON, không sửa file này. Phiên bản 1.1 · 2026-10-29. Trang cho Trung xem: `san_pham/2026.10.29.bang_phan_loai_mau_kich_ban/2026.10.29.bang_phan_loai_mau_kich_ban_v1.html`.

## 1. Quy tắc ít chữ (Trung chốt 29/10/2026)

Trung chốt 29/10/2026: giữ phụ đề cứng ở đáy khung, chỉ giảm chữ TRONG hình. Quy tắc C1–C4 đếm được bằng máy: python3 scripts/dem_chu_trong_hinh.py; C5–C8 soát bằng mắt trên ảnh lưới.

| Mã | Quy tắc | Cách kiểm |
|---|---|---|
| C1 | Giữ phụ đề cứng ở dải y 900–1080 (kho phu_de_chay_chu). Hình và chữ của cảnh không đặt xuống dưới y 900. | máy: chữ đọc được trong dải 900–1080 không tính vào C2, C3 |
| C2 | Mỗi khung, ngoài dải phụ đề, tối đa 12 từ, đếm theo tiếng (chữ cách nhau bởi dấu cách: "tiền gửi" là 2), tính cả tiêu đề, nhãn, đơn vị; một con số tính một từ. Không tính nhãn bắt buộc "ví dụ giả định". Khung trích văn bản pháp luật được tới 20 từ, tối đa một cảnh mỗi video. | máy: tổng số tiếng ≤ 12 |
| C3 | Một dòng chữ liền tối đa 6 tiếng. Câu dài hơn là lời đọc, để giọng nói. | máy: mỗi dòng Vision đọc được ≤ 6 tiếng |
| C4 | Không chép lời đọc lên hình: không dòng chữ nào trên hình trùng nguyên văn 6 tiếng liên tiếp của lời đọc. Tên thuật ngữ (thường dưới 6 tiếng) được phép; tên dài hơn thì thêm vào --bo-qua. | máy khi có --loi <file lời đọc> |
| C5 | Một ý một cảnh: mỗi cảnh một hình chính chuyển động chiếm từ 40% vùng hình (y 0–900). Không có cảnh chỉ toàn chữ, trừ tối đa một cảnh mượn CL-11 dài ≤ 5 giây, ≤ 4 từ. | mắt, trên ảnh lưới |
| C6 | Nhãn thay bằng biểu tượng hoặc số khi được: nhãn dài hơn 3 từ phải xét đổi sang biểu tượng của bo_bieu_tuong_co_ban hoặc số. | mắt |
| C7 | Tiêu đề chương tối đa 5 từ, hoặc bỏ hẳn và dùng thanh chương dạng số "3/12" (TP-CH17). | máy gián tiếp qua C3 |
| C8 | Khung không đứng yên quá 2 giây: luôn có một chuyển động nhỏ (TP-CD09) hoặc một bước biến đổi theo câu đọc. | mắt, xem bản nháp |

Đo thử trên bản nháp N86 tiền gửi và CASA (29/10/2026, một khung mỗi 15 giây): trung bình 37,6 tiếng mỗi khung ngoài phụ đề, cao nhất 66; cả 16 khung phạm quy tắc C2. Video mới phải xuống dưới 12.

Lệnh kiểm: `python3 scripts/dem_chu_trong_hinh.py <video.mp4 | thư mục ảnh> [--moi 2] [--loi <file lời đọc .txt hoặc .md>]`

## 2. 16 mẫu kịch bản

### MK-01 Giải nghĩa một khái niệm

**Dấu hiệu:** Tên video có dạng "X là gì", "vì sao có X"; một thuật ngữ đơn, người xem nghe nhiều nhưng không giải thích lại được.

**Dàn chương mẫu:**

1. Mở: câu hỏi ngại hoặc tình huống đời thường có số (1 chương)
2. So sánh với vật quen: một vật chính trên bàn biến trạng thái (2 chương)
3. Đặt tên thuật ngữ, định nghĩa một câu do giọng đọc nói, hình chỉ hiện tên (1 chương)
4. Cách dùng thật trong nghề: ví dụ số nhỏ (2–3 chương)
5. Chỗ hay nhầm: một hình đúng, một hình sai đặt cạnh (1–2 chương)
6. Giới hạn hoặc ngoại lệ (1 chương)
7. Tóm lại: vật chính trở về trạng thái đầu, đã đủ nhãn biểu tượng (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-02, KB-05 |
| Chất liệu | CL-09 2D minh hoạ phẳng có vật thể, CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-13 3D sa bàn bằng mã, CL-16 Giao diện và thẻ nổi |
| Bố cục | BC-08 Bàn thao tác, BC-09 Khung chương hồi, BC-05 Vật thể giữa khung, nhãn bên, BC-11 Một ý toàn khung ngang |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-37 Màu Techcombank, MAU-36 Màu MB, MAU-35 Màu VietinBank |
| Nhạc | nhóm tập trung, nhẹ, tươi vui; vừa; 95–115 BPM; gợi ý NH00 Close Up, Michael Ramir C., NH16 Infinity, Arulo, NH10 Just Keep Walking, Michael Ramir C., NH05 Curiosity, Diego Nava |
| Nhịp cắt | Một cảnh 6–10 giây; giữ một vật chính suốt chương, đổi trạng thái thay vì cắt; chuyển chương bằng vật mang theo. |
| Thủ pháp | TP-CC01 Một hình duy nhất biến qua nhiều trạng thái, không cắt cảnh; TP-CD07 Máy quay ảo 2D: đẩy chậm liên tục và phóng cho vật đang xét lấp khung; TP-CD04 Nội dung vào sau khi vật chứa biến dạng, ra trước khi biến dạng tiếp; TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut); TP-SL18 Chú thích: khung bao, nhãn khác màu và mũi tên cong; TP-CD09 Vi chuyển động giữ cảnh tĩnh, và dừng có chủ đích trước đoạn kết; TP-CD03 Phần tử hiện lệch nhịp (stagger); TP-SL04 Con số lớn đơn độc kèm đơn vị và một dòng giải nghĩa |
| Kho hình chung | khuon_canh_mo_dau_cau_hoi, bo_bieu_tuong_co_ban, khach_hang_ca_nhan, toa_nha_ngan_hang, binh_chua_muc_nuoc, khuon_canh_ket_tom_lai |

**Lỗi hay gặp:**

- Đưa nguyên câu định nghĩa lên hình thành đoạn chữ: giọng đã đọc, hình chỉ hiện tên thuật ngữ.
- Mở bằng định nghĩa: người xem chưa có lý do để nghe.
- Mỗi chương một vật mới: người xem phải làm quen lại từ đầu; giữ một vật chính.

### MK-02 So sánh hai, ba thứ hay nhầm

**Dấu hiệu:** Tên video có "A và B", "các loại", "khác gì"; hai thứ trở lên cùng mục đích, khác điều kiện.

**Dàn chương mẫu:**

1. Mở: một người phải chọn giữa hai thứ, hai con số kết quả khác nhau (1 chương)
2. Đặt hai thứ cạnh nhau, chung một trục (1 chương)
3. Tiêu chí 1, 2, 3: mỗi tiêu chí một chương, hai nửa khung đổi cùng lúc (3–5 chương)
4. Trường hợp dễ chọn sai (1–2 chương)
5. Khi nào dùng cái nào: hai biểu tượng tình huống (1 chương)
6. Bảng chốt: tối đa 3 hàng biểu tượng, không câu chữ (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-07, KB-02 |
| Chất liệu | CL-05 Đồ thị SVG, CL-06 3D đất sét và bản vẽ, CL-10 2D nét vẽ tay, CL-16 Giao diện và thẻ nổi, CL-12 Hạt và ánh sáng |
| Bố cục | BC-07 Chia đôi khung, BC-13 Bảng trắng toàn khung, BC-10 Tiêu đề hai dòng và một biểu đồ, BC-09 Khung chương hồi |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-32 Màu Vietcombank, MAU-40 Màu TPBank, MAU-37 Màu Techcombank, MAU-36 Màu MB |
| Nhạc | nhóm tập trung, nhẹ; vừa đến nhanh; 103–123 BPM; gợi ý NH30 Hazy After Hours, Alejandro Magaña (A. M.), NH06 Pop Track 03, Lily J, NH31 Deep Techno Ambience, Alejandro Magaña (A. M.), NH08 Tech House vibes, Alejandro Magaña |
| Nhịp cắt | Chương 12–20 giây; hai nửa khung đổi đồng thời theo từng tiêu chí, cắt khi sang tiêu chí mới; mốc ngắt bằng đổi nền. |
| Thủ pháp | TP-SL09 Hai dải thời gian song song; TP-SL08 Hai số so sánh trên khung biên lai; TP-SL12 Sơ đồ Venn hai vòng với vùng giao tô màu; TP-SL01 Thanh ngang dài ra trước, số hiện sau; xếp hạng đổi chỗ; TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut); TP-CD03 Phần tử hiện lệch nhịp (stagger); TP-CC10 Đổi nền xen tối, sáng, màu đặc làm điểm ngắt nhịp; TP-SL16 Trang tóm tắt cuối |
| Kho hình chung | khuon_so_sanh_hai_cot, thanh_ngang_chia_doan, truc_thoi_gian, bieu_do_cot_lich_tra_no, khuon_canh_ket_tom_lai |

**Lỗi hay gặp:**

- Bảng so sánh nhiều hàng chữ (lỗi của N86): tối đa 3 hàng, mỗi ô một biểu tượng hoặc một số.
- Hai nửa khung khác màu nền: mắt phải đổi tông liên tục; giữ một nền, phân biệt bằng một màu nhấn mỗi bên.
- So sánh xong không chốt khi nào dùng cái nào.

### MK-03 Tính tiền từng bước

**Dấu hiệu:** Có công thức hoặc tỷ lệ (LTV, NIM, LDR, dự phòng, chiết khấu); video trả lời được bằng một con số cụ thể.

**Dàn chương mẫu:**

1. Mở: câu hỏi có số, ba đáp án đoán thử (1 chương)
2. Thử số lần 1, lần 2 bằng vật chính (2 chương)
3. Vấp chỗ bế tắc: hai cách tính cho hai đáp số (1 chương)
4. Đặt tên khái niệm, công thức dạng biểu tượng (1 chương)
5. Ví dụ hoàn chỉnh, từng bước một thẻ (3–4 chương)
6. Chỗ hay tính sai (1–2 chương)
7. Ngưỡng quy định và ý nghĩa với người vay (1 chương)
8. Tóm lại: một con số lớn và một dòng giải nghĩa (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-08, KB-01 |
| Chất liệu | CL-14 Mô phỏng và bề mặt toán, CL-05 Đồ thị SVG, CL-09 2D minh hoạ phẳng có vật thể, CL-10 2D nét vẽ tay |
| Bố cục | BC-08 Bàn thao tác, BC-10 Tiêu đề hai dòng và một biểu đồ, BC-06 Đồ thị và bảng số toàn khung, BC-13 Bảng trắng toàn khung |
| Mức chi tiết | CT1 |
| Bảng màu | MAU-34 Màu Agribank, MAU-37 Màu Techcombank, MAU-33 Màu BIDV, MAU-42 Màu LPBank |
| Nhạc | nhóm tập trung, nhẹ; vừa (Trung chuộng nhịp vừa cho video giảng công thức); 96–112 BPM; gợi ý NH00 Close Up, Michael Ramir C., NH16 Infinity, Arulo, NH12 Finding Myself, Michael Ramir C., NH10 Just Keep Walking, Michael Ramir C. |
| Nhịp cắt | Bàn thao tác cố định; mỗi bước tính 5–8 giây, số chạy tới đích theo lò xo; không cắt trong một phép tính, cắt khi sang ví dụ mới. |
| Thủ pháp | TP-SL03 Bộ đếm số chạy; TP-SL17 Danh sách bước ba trạng thái, thanh bước và thước đo cạnh vật (bàn thao tác); TP-SL14 Số liệu từ mô phỏng tính thật; TP-SL01 Thanh ngang dài ra trước, số hiện sau; xếp hạng đổi chỗ; TP-SL04 Con số lớn đơn độc kèm đơn vị và một dòng giải nghĩa; TP-CD01 Lò xo giải tích thay cho đường tăng giảm tốc; TP-SL07 Đồng hồ đo bán nguyệt có vùng màu và kim quay; TP-SL06 Lưới ô sáng dần theo tỷ lệ và ma trận chấm |
| Kho hình chung | khuon_vi_du_tinh_tien_tung_buoc, nhan_gia_dinh, xap_tien_dong_xu, binh_chua_muc_nuoc, can_dong_ho_ty_le, bieu_do_duong_lai_suat |

**Lỗi hay gặp:**

- Viết cả phép tính thành câu chữ: công thức dùng biểu tượng và số, toán tử tô màu nhấn.
- Một khung nhiều phép tính: một bước một thẻ, bước cũ thu nhỏ sang lề.
- Số trên hình chưa có nguồn kiểm chứng (quy tắc cứng 3); số giả định phải có nhãn "ví dụ giả định".

### MK-04 Quy trình các bước

**Dấu hiệu:** Tên video là một việc có trình tự: giải ngân, định giá, xử lý tài sản, mở L/C; trả lời câu "làm thế nào, mất bao lâu".

**Dàn chương mẫu:**

1. Mở: cho xem kết quả cuối trước (tiền đã tới tay, tài sản đã bán) (1 chương)
2. Bản đồ toàn trình: các trạm hiện lần lượt, chưa mở (1 chương)
3. Bước 1 … n: mỗi bước một chương, nhân vật hoặc hồ sơ đi qua trạm (4–7 chương)
4. Chỗ hay tắc và vì sao (1–2 chương)
5. Thời gian và giấy tờ cần có: biểu tượng, không danh sách chữ (1 chương)
6. Tóm lại: đi lại toàn trình nhanh trong 8 giây (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-05 |
| Chất liệu | CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-13 3D sa bàn bằng mã, CL-09 2D minh hoạ phẳng có vật thể, CL-16 Giao diện và thẻ nổi |
| Bố cục | BC-09 Khung chương hồi, BC-05 Vật thể giữa khung, nhãn bên, BC-08 Bàn thao tác |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-39 Màu ACB, MAU-36 Màu MB, MAU-38 Màu VPBank |
| Nhạc | nhóm tập trung, nhẹ, tươi vui; vừa đến nhanh; 96–123 BPM; gợi ý NH10 Just Keep Walking, Michael Ramir C., NH31 Deep Techno Ambience, Alejandro Magaña (A. M.), NH11 Crying Sea, Michael Ramir C., NH23 Solitude, Alejandro Magaña (A. M.) |
| Nhịp cắt | Mỗi bước 10–18 giây; một vật mang theo (hồ sơ, xấp tiền) đi xuyên các trạm làm chuyển cảnh; thanh bước ở chân vùng hình. |
| Thủ pháp | TP-SL17 Danh sách bước ba trạng thái, thanh bước và thước đo cạnh vật (bàn thao tác); TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut); TP-CD08 Nền nhiều lớp trôi khác tốc độ (parallax 2D); TP-CD07 Máy quay ảo 2D: đẩy chậm liên tục và phóng cho vật đang xét lấp khung; TP-CC09 Mô-típ và đường dẫn lặp xuyên cảnh; TP-3D03 Camera đẳng cự đứng yên, đồ vật xuất hiện lần lượt; TP-CC08 Cảnh sau hiện trước mốc cảnh trước ra hết 0,3–0,5 s; TP-SL05 Con dấu cao su đóng nghiêng cạnh số lớn |
| Kho hình chung | khuon_luong_cac_buoc, truc_thoi_gian, hop_dong_giay_to, khach_hang_ca_nhan, doanh_nghiep_nha_xuong, khuon_trich_van_ban_phap_luat |

**Lỗi hay gặp:**

- Liệt kê bước bằng chữ dài: mỗi trạm một biểu tượng và một số thứ tự, tên bước do giọng đọc.
- Không có vật mang theo: các bước rời nhau, người xem mất mạch.
- Trích điều luật nguyên đoạn: tối đa một cảnh trích, dùng khuôn trích văn bản pháp luật.

### MK-05 Cơ chế bên trong một hệ thống, dòng tiền

**Dấu hiệu:** Đối tượng là hệ thống hoặc mạng lưới không nhìn thấy: CITAD, NAPAS, SWIFT, hệ thống core, dòng vốn nội bộ; trả lời câu "tiền đi đường nào".

**Dàn chương mẫu:**

1. Mở: một lệnh chuyển tiền bấm trên điện thoại, phóng vào bên trong (1 chương)
2. Toàn cảnh hệ thống: các nút sáng lần lượt (1 chương)
3. Đi theo một đồng tiền qua từng nút (3–5 chương)
4. Khi nhiều lệnh cùng lúc: hàng đợi, bù trừ (1–2 chương)
5. Chỗ hệ thống dừng hoặc chậm (1 chương)
6. Phóng ra: người dùng thấy gì (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-05, KB-07 |
| Chất liệu | CL-12 Hạt và ánh sáng, CL-13 3D sa bàn bằng mã, CL-07 3D xuyên thấu, CL-14 Mô phỏng và bề mặt toán |
| Bố cục | BC-05 Vật thể giữa khung, nhãn bên, BC-11 Một ý toàn khung ngang, BC-09 Khung chương hồi |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-39 Màu ACB, MAU-32 Màu Vietcombank, MAU-38 Màu VPBank |
| Nhạc | nhóm tập trung, nhẹ, hồi hộp; nhanh hoặc vừa; 99–123 BPM; gợi ý NH31 Deep Techno Ambience, Alejandro Magaña (A. M.), NH11 Crying Sea, Michael Ramir C., NH06 Pop Track 03, Lily J, NH50 Night Patrol, Michael Ramir C. |
| Nhịp cắt | Máy quay bay liền mạch theo đồng tiền, 4–8 giây mỗi nút; gần như không cắt; phóng xuyên thang đo ở đầu và cuối. |
| Thủ pháp | TP-3D07 Khoá màu theo chức năng và hạt chạy dọc ống theo chiều dòng; TP-SL15 Sơ đồ nối nút bằng đường mảnh phát sáng; TP-3D03 Camera đẳng cự đứng yên, đồ vật xuất hiện lần lượt; TP-CC04 Phóng xuyên thang đo (từ mét xuống nguyên tử hoặc ra vũ trụ); TP-CC03 Phóng máy quay vào một tâm sáng hoặc vào màn hình trong cảnh; TP-3D06 Tách lớp, hình nổ và thu nhỏ theo bậc quy mô; TP-CC11 Hạt tan ra rồi gom thành hình kế tiếp; TP-3D02 Máy quay quỹ đạo chậm quanh vật, hoặc khoá chính diện |
| Kho hình chung | thu_vien_3d_ngan_hang, may_chu_he_thong_trung_tam, toa_nha_ngan_hang, xap_tien_dong_xu, man_hinh_ung_dung, ngan_hang_nha_nuoc |

**Lỗi hay gặp:**

- Gắn tên đầy đủ cho mọi nút: dùng biểu tượng và chữ viết tắt đã đọc lên (CITAD, NAPAS).
- Hạt chạy quá nhiều màu: khoá màu theo chức năng, tối đa 3 màu.
- Dùng tên, logo ngân hàng thật cho các nút: cấm, dùng ngân hàng A, B, C.

### MK-06 Ngược dòng niềm tin sai

**Dấu hiệu:** Chủ đề có một câu nói phổ biến đúng một nửa ("đáo hạn là cứu cánh", "chuyển khoản là tới ngay", "hết room là ngân hàng hết tiền").

**Dàn chương mẫu:**

1. Mở: câu niềm tin, tối đa 8 từ trên hình (1 chương)
2. Công nhận phần đúng (1–2 chương)
3. Dữ kiện làm lung lay, mỗi dữ kiện một hình (2–4 chương)
4. Cơ chế thật (2–3 chương)
5. Cách nghĩ đầy đủ hơn (1 chương)
6. Điều người xem nên làm (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-03 |
| Chất liệu | CL-10 2D nét vẽ tay, CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-14 Mô phỏng và bề mặt toán, CL-09 2D minh hoạ phẳng có vật thể |
| Bố cục | BC-13 Bảng trắng toàn khung, BC-09 Khung chương hồi, BC-11 Một ý toàn khung ngang, BC-08 Bàn thao tác |
| Mức chi tiết | CT1 |
| Bảng màu | MAU-40 Màu TPBank, MAU-42 Màu LPBank, MAU-34 Màu Agribank |
| Nhạc | nhóm trầm, nghiêm, hồi hộp; chậm đến vừa; 81–123 BPM; gợi ý NH67 Dark Ambient Emotions Music, Vlad Bakutov, NH08 Tech House vibes, Alejandro Magaña, NH54 Infectious Groove, Alejandro Magaña (A. M.) |
| Nhịp cắt | Nhịp chậm đầu video, có khoảng dừng có chủ đích trước câu lật; sau câu lật tăng nhịp 6–8 giây một cảnh. |
| Thủ pháp | TP-CH07 Gạch ngang chữ cũ rồi thay bằng chữ mới; TP-CH08 Gạch chân và vòng vẽ tay quanh từ khoá; TP-CC13 Chuyển trạng thái ngày sang đêm và kéo thanh trượt đổi ảnh; TP-CD09 Vi chuyển động giữ cảnh tĩnh, và dừng có chủ đích trước đoạn kết; TP-CC10 Đổi nền xen tối, sáng, màu đặc làm điểm ngắt nhịp; TP-SL05 Con dấu cao su đóng nghiêng cạnh số lớn; TP-HK08 Nét bút chì, giấy và bút sáp; TP-CC01 Một hình duy nhất biến qua nhiều trạng thái, không cắt cảnh |
| Kho hình chung | khuon_canh_mo_dau_cau_hoi, net_tay_but_chi, khuon_trich_van_ban_phap_luat, khuon_canh_ket_tom_lai, bo_bieu_tuong_co_ban |

**Lỗi hay gặp:**

- Câu niềm tin dài hai dòng: tối đa 8 từ, gạch ngang đúng một cụm.
- Đỏ nhấn dùng nhiều lần: chỉ dùng ở chỗ niềm tin sụp.
- Chê người tin: kịch bản KB-03 phải soát thêm theo 13_ban_quyen_va_bao_mat.md.

### MK-07 Kể chuyện nghề có nhân vật

**Dấu hiệu:** Chủ đề về con người trong ngân hàng: vị trí, kỹ năng, lộ trình, rủi ro nghề; người xem tự đặt mình vào nhân vật.

**Dàn chương mẫu:**

1. Mở: nhân vật trong một khoảnh khắc khó (1 chương)
2. Một ngày làm việc: các cảnh nối nhau như phim (2–3 chương)
3. Từng vai hoặc từng nấc: mỗi chương một bối cảnh (3–5 chương)
4. Khó khăn thật, có số (1–2 chương)
5. Điều giúp nhân vật vượt qua (1–2 chương)
6. Kết: nhân vật ở bối cảnh mới, khung cuối giống khung đầu (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-02, KB-05, KB-06 |
| Chất liệu | CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-13 3D sa bàn bằng mã, CL-10 2D nét vẽ tay |
| Bố cục | BC-09 Khung chương hồi, BC-11 Một ý toàn khung ngang, BC-05 Vật thể giữa khung, nhãn bên |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-40 Màu TPBank, MAU-38 Màu VPBank, MAU-42 Màu LPBank |
| Nhạc | nhóm tươi vui, tập trung, nhẹ; vừa; 96–117 BPM; gợi ý NH10 Just Keep Walking, Michael Ramir C., NH07 Better Times are Coming, Alejandro Magaña, NH23 Solitude, Alejandro Magaña (A. M.), NH05 Curiosity, Diego Nava |
| Nhịp cắt | Mỗi cảnh một khung cảnh nhiều lớp 8–15 giây; máy quay trượt ngang có parallax; cắt theo hành động của nhân vật. |
| Thủ pháp | TP-CD08 Nền nhiều lớp trôi khác tốc độ (parallax 2D); TP-CD11 Nhân vật hộp có đặc tả kích thước; TP-CD10 Chuyển động lượng tử hoá (animated on twos); TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut); TP-CD07 Máy quay ảo 2D: đẩy chậm liên tục và phóng cho vật đang xét lấp khung; TP-CC13 Chuyển trạng thái ngày sang đêm và kéo thanh trượt đổi ảnh; TP-3D16 Khung 2.5D ghép lớp theo bản đồ độ sâu; TP-CC12 Khung cuối bằng khung đầu (vòng lặp liền mạch) |
| Kho hình chung | khach_hang_ca_nhan, toa_nha_ngan_hang, doanh_nghiep_nha_xuong, nha_o, hop_dong_giay_to, man_hinh_ung_dung |

**Lỗi hay gặp:**

- Bóng thoại thay lời đọc: bóng thoại tối đa 6 từ, chỉ cho câu đắt nhất.
- Nhân vật đứng yên giữa khung: phải có hành động (đi, cầm, đưa, ký).
- Nhắc tên ngân hàng thật hoặc tài liệu nội bộ MB: cấm.

### MK-08 Tổng hợp, danh sách cần lưu ý

**Dấu hiệu:** Video gom nhiều mục ngang hàng: các điều kiện Incoterms, kiến thức cần có, những điều cần lưu ý khi vay; hoặc video tổng hợp cuối loạt.

**Dàn chương mẫu:**

1. Mở: hậu quả của việc quên một mục (1 chương)
2. Bản đồ các mục: biểu tượng hiện lệch nhịp (1 chương)
3. Mục 1 … n: mỗi mục một hình động, không câu chữ (5–9 chương)
4. Mục hay quên nhất (1 chương)
5. Trang tóm tắt cuối: lưới biểu tượng, mỗi ô trỏ tới video chi tiết (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-02, KB-07 |
| Chất liệu | CL-16 Giao diện và thẻ nổi, CL-13 3D sa bàn bằng mã, CL-09 2D minh hoạ phẳng có vật thể, CL-06 3D đất sét và bản vẽ |
| Bố cục | BC-10 Tiêu đề hai dòng và một biểu đồ, BC-05 Vật thể giữa khung, nhãn bên, BC-08 Bàn thao tác |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-35 Màu VietinBank, MAU-37 Màu Techcombank, MAU-42 Màu LPBank |
| Nhạc | nhóm tập trung, nhẹ, tươi vui; vừa; 103–112 BPM; gợi ý NH00 Close Up, Michael Ramir C., NH15 No Turning Back, Alejandro Magaña, NH16 Infinity, Arulo |
| Nhịp cắt | Mỗi mục 15–25 giây; thẻ mới nổi lên, thẻ cũ lùi thành ô nhỏ trong lưới; nhịp đều để người xem đếm được. |
| Thủ pháp | TP-SL17 Danh sách bước ba trạng thái, thanh bước và thước đo cạnh vật (bàn thao tác); TP-SL16 Trang tóm tắt cuối; TP-CD03 Phần tử hiện lệch nhịp (stagger); TP-CC09 Mô-típ và đường dẫn lặp xuyên cảnh; TP-SL20 Thẻ chỉ số; TP-3D10 Thẻ giao diện nghiêng nhẹ trong không gian 3D, băng chuyền thẻ; TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut); TP-CD06 Phóng nhanh rồi thu nhỏ (pop) cho chữ sự kiện |
| Kho hình chung | khuon_checklist_dieu_can_luu_y, khuon_canh_ket_tom_lai, bo_bieu_tuong_co_ban, khuon_luong_cac_buoc |

**Lỗi hay gặp:**

- Danh sách chữ dài trên một khung: một mục một khung, ô lưới chỉ có biểu tượng và số.
- Mục nào cũng dài như nhau: mục quan trọng được thời lượng gấp đôi.
- Quên trỏ sang video chi tiết của loạt.

### MK-09 Quan hệ nhiều bên, chứng từ đi lại

**Dấu hiệu:** Giao dịch có ba bên trở lên và giấy tờ chuyển giữa các bên: bảo lãnh, L/C, bao thanh toán, chiết khấu, LOI, cho vay bên liên quan.

**Dàn chương mẫu:**

1. Mở: người bán và người mua không tin nhau, có số tiền cụ thể (1 chương)
2. Đặt các bên lên khung, mỗi bên một biểu tượng cố định chỗ (1 chương)
3. Bộ chứng từ hoặc lời cam kết đi từ bên này sang bên kia, từng chặng (3–5 chương)
4. Khi một bên không làm đúng: tiền đi đường nào (1–2 chương)
5. Rủi ro còn lại và ai chịu (1 chương)
6. Tóm lại: toàn bộ đường đi trong một hình (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-02, KB-05 |
| Chất liệu | CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-13 3D sa bàn bằng mã, CL-06 3D đất sét và bản vẽ, CL-09 2D minh hoạ phẳng có vật thể, CL-16 Giao diện và thẻ nổi |
| Bố cục | BC-09 Khung chương hồi, BC-05 Vật thể giữa khung, nhãn bên, BC-07 Chia đôi khung, BC-11 Một ý toàn khung ngang |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-36 Màu MB, MAU-40 Màu TPBank, MAU-35 Màu VietinBank |
| Nhạc | nhóm tập trung, nhẹ, tươi vui; nhanh hoặc vừa; 108–123 BPM; gợi ý NH06 Pop Track 03, Lily J, NH07 Better Times are Coming, Alejandro Magaña, NH30 Hazy After Hours, Alejandro Magaña (A. M.) |
| Nhịp cắt | Các bên đứng yên chỗ suốt video; chỉ chứng từ và tiền di chuyển, mỗi chặng 6–10 giây; cảnh trước bàn giao vật cho cảnh sau. |
| Thủ pháp | TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut); TP-SL15 Sơ đồ nối nút bằng đường mảnh phát sáng; TP-SL11 Bản đồ chấm, địa cầu chấm, bản đồ nét tay; TP-CD08 Nền nhiều lớp trôi khác tốc độ (parallax 2D); TP-3D03 Camera đẳng cự đứng yên, đồ vật xuất hiện lần lượt; TP-SL05 Con dấu cao su đóng nghiêng cạnh số lớn; TP-CD05 Con trỏ chuột điều khiển mọi thay đổi (kèm nghiêng theo con trỏ); TP-CC09 Mô-típ và đường dẫn lặp xuyên cảnh |
| Kho hình chung | khuon_quan_he_ba_ben, bo_chung_tu_hoa_don, tau_container_hang_hoa, ban_do_the_gioi_tuyen_thuong_mai, doanh_nghiep_nha_xuong, toa_nha_ngan_hang |

**Lỗi hay gặp:**

- Các bên đổi chỗ giữa các chương: người xem mất phương hướng; giữ chỗ cố định.
- Ghi tên đầy đủ từng bên ("ngân hàng phát hành", "ngân hàng thông báo"): dùng biểu tượng ngân hàng A, B và giọng đọc tên.
- Mũi tên chéo nhau: tối đa 3 mũi tên trên khung cùng lúc.

### MK-10 Chính sách và tác động dây chuyền

**Dấu hiệu:** Chủ đề do Ngân hàng Nhà nước hoặc thị trường quyết định: dự trữ bắt buộc, lãi suất liên ngân hàng, room tín dụng, hedging, ngân hàng và bất động sản.

**Dàn chương mẫu:**

1. Mở: một con số chính sách vừa đổi và câu hỏi "việc đó tới tay tôi thế nào" (1 chương)
2. Công cụ chính sách là gì: một cái van hoặc cái núm (1–2 chương)
3. Vặn núm: mô phỏng dòng tiền đổi theo từng nấc (2–3 chương)
4. Kênh truyền dẫn tới ngân hàng, doanh nghiệp, người vay (2–3 chương)
5. Độ trễ và giới hạn (1 chương)
6. Tóm lại: một đồng hồ đo ba vùng (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-05, KB-01, KB-02, KB-08 |
| Chất liệu | CL-14 Mô phỏng và bề mặt toán, CL-12 Hạt và ánh sáng, CL-05 Đồ thị SVG, CL-13 3D sa bàn bằng mã, CL-06 3D đất sét và bản vẽ |
| Bố cục | BC-05 Vật thể giữa khung, nhãn bên, BC-08 Bàn thao tác, BC-11 Một ý toàn khung ngang, BC-07 Chia đôi khung |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-38 Màu VPBank, MAU-39 Màu ACB, MAU-36 Màu MB, MAU-33 Màu BIDV |
| Nhạc | nhóm hồi hộp, trầm, nghiêm, tập trung, nhẹ; vừa; 81–144 BPM; gợi ý NH50 Night Patrol, Michael Ramir C., NH54 Infectious Groove, Alejandro Magaña (A. M.), NH08 Tech House vibes, Alejandro Magaña, NH12 Finding Myself, Michael Ramir C. |
| Nhịp cắt | Mô phỏng chạy liên tục, mỗi nấc chính sách 6–10 giây; máy quay đứng yên để người xem thấy thay đổi; cắt khi chuyển kênh truyền dẫn. |
| Thủ pháp | TP-SL14 Số liệu từ mô phỏng tính thật; TP-SL07 Đồng hồ đo bán nguyệt có vùng màu và kim quay; TP-3D14 Mô phỏng vật lý tính thật; TP-SL02 Đường đồ thị tự vẽ, chấm kéo theo và hộp nhãn độ nhạy; TP-CC04 Phóng xuyên thang đo (từ mét xuống nguyên tử hoặc ra vũ trụ); TP-SL06 Lưới ô sáng dần theo tỷ lệ và ma trận chấm; TP-3D07 Khoá màu theo chức năng và hạt chạy dọc ống theo chiều dòng; TP-CD01 Lò xo giải tích thay cho đường tăng giảm tốc |
| Kho hình chung | ngan_hang_nha_nuoc, bieu_do_duong_lai_suat, can_dong_ho_ty_le, thanh_ngang_chia_doan, toa_nha_ngan_hang, khuon_so_sanh_nhom_ngan_hang_an_danh |

**Lỗi hay gặp:**

- Đưa số liệu vĩ mô một nguồn lên hình: phải có hai nguồn (quy tắc cứng 3).
- Mô phỏng chạy theo hoạt hoạ tay, không theo tính toán: số trên hình lệch số đọc.
- Nhận định chính sách: chỉ mô tả cơ chế, không khuyến nghị đầu tư.

### MK-11 Chuyện ra đời theo dòng thời gian

**Dấu hiệu:** Thuật ngữ ra đời sau một sự cố có thật và được sửa qua nhiều đời: Basel, SWIFT, Incoterms, thư tín dụng, bảo hiểm tiền gửi, trung tâm thông tin tín dụng.

**Dàn chương mẫu:**

1. Mở: sự cố của một năm cụ thể, không nêu tên ngân hàng (1 chương)
2. Thế giới trước khi có X: làm thế nào, vướng ở đâu (1–2 chương)
3. Sự cố làm lộ chỗ thiếu (1–2 chương)
4. X ra đời, bản đầu tiên làm gì (1 chương)
5. Các lần sửa: tối đa 3 mốc, mỗi mốc một thay đổi trên cùng một hình (2–3 chương)
6. X ở Việt Nam hôm nay (1–2 chương)
7. Tóm lại: dòng thời gian thu gọn còn 5 điểm sáng (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-09, KB-05 |
| Chất liệu | CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-10 2D nét vẽ tay, CL-12 Hạt và ánh sáng, CL-06 3D đất sét và bản vẽ |
| Bố cục | BC-09 Khung chương hồi, BC-11 Một ý toàn khung ngang, BC-13 Bảng trắng toàn khung, BC-05 Vật thể giữa khung, nhãn bên |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-36 Màu MB, MAU-33 Màu BIDV, MAU-35 Màu VietinBank |
| Nhạc | nhóm trầm, nghiêm, tập trung, nhẹ; chậm đến vừa; 89–123 BPM; gợi ý NH67 Dark Ambient Emotions Music, Vlad Bakutov, NH16 Infinity, Arulo, NH08 Tech House vibes, Alejandro Magaña, NH11 Crying Sea, Michael Ramir C. |
| Nhịp cắt | Mỗi mốc năm 12–20 giây; bộ đếm năm chạy giữa hai mốc làm chuyển cảnh; cùng một vật chính đổi trạng thái qua các đời, không thay vật. |
| Thủ pháp | TP-SL03 Bộ đếm số chạy; TP-CC09 Mô-típ và đường dẫn lặp xuyên cảnh; TP-CD08 Nền nhiều lớp trôi khác tốc độ (parallax 2D); TP-HK07 Hậu kỳ phim cũ; TP-CC13 Chuyển trạng thái ngày sang đêm và kéo thanh trượt đổi ảnh; TP-SL11 Bản đồ chấm, địa cầu chấm, bản đồ nét tay; TP-CC01 Một hình duy nhất biến qua nhiều trạng thái, không cắt cảnh; TP-CD07 Máy quay ảo 2D: đẩy chậm liên tục và phóng cho vật đang xét lấp khung |
| Kho hình chung | truc_thoi_gian, ban_do_the_gioi_tuyen_thuong_mai, toa_nha_ngan_hang, khuon_trich_van_ban_phap_luat, net_tay_but_chi |

**Lỗi hay gặp:**

- Kể quá nhiều năm: tối đa 5 mốc trên hình, năm là số, không kèm câu.
- Năm và sự kiện chỉ có một nguồn: không đưa lên hình (quy tắc cứng 3).
- Phần lịch sử dài hơn phần hôm nay: lịch sử tối đa một nửa thời lượng.

### MK-12 Câu đố ba tình huống

**Dấu hiệu:** Thuật ngữ có quy tắc phân loại rõ, người xem tự áp được sau một lần nghe: ai chịu rủi ro theo Incoterms, FOB hay CIF, nhóm nợ, ngân hàng nhận hay từ chối một hồ sơ.

**Dàn chương mẫu:**

1. Mở: quy tắc trong một câu đọc, rồi ngay câu đố 1 (1 chương)
2. Đồng hồ đếm 3 giây, lật đáp án, giải thích vì sao (2 chương)
3. Câu đố 2 khó hơn, đổi một chi tiết (2 chương)
4. Câu đố 3 có bẫy, chỗ ai cũng đoán sai (2 chương)
5. Rút ra quy tắc chung bằng một hình (1–2 chương)
6. Câu đố cuối để người xem trả lời ở phần bình luận (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-08, KB-02, KB-07 |
| Chất liệu | CL-16 Giao diện và thẻ nổi, CL-09 2D minh hoạ phẳng có vật thể, CL-14 Mô phỏng và bề mặt toán, CL-06 3D đất sét và bản vẽ, CL-10 2D nét vẽ tay |
| Bố cục | BC-10 Tiêu đề hai dòng và một biểu đồ, BC-08 Bàn thao tác, BC-05 Vật thể giữa khung, nhãn bên, BC-13 Bảng trắng toàn khung |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-42 Màu LPBank, MAU-34 Màu Agribank, MAU-40 Màu TPBank |
| Nhạc | nhóm tươi vui, tập trung, nhẹ; vừa đến nhanh; 108–161 BPM; gợi ý NH07 Better Times are Coming, Alejandro Magaña, NH23 Solitude, Alejandro Magaña (A. M.), NH06 Pop Track 03, Lily J, NH05 Curiosity, Diego Nava |
| Nhịp cắt | Nhịp ba đoạn lặp lại: đặt câu đố 6–8 giây, chờ đúng 3 giây có đồng hồ, lật đáp án 10–15 giây. Nhạc hạ khi đồng hồ chạy. |
| Thủ pháp | TP-SL07 Đồng hồ đo bán nguyệt có vùng màu và kim quay; TP-CD06 Phóng nhanh rồi thu nhỏ (pop) cho chữ sự kiện; TP-SL05 Con dấu cao su đóng nghiêng cạnh số lớn; TP-CC10 Đổi nền xen tối, sáng, màu đặc làm điểm ngắt nhịp; TP-CD03 Phần tử hiện lệch nhịp (stagger); TP-CC08 Cảnh sau hiện trước mốc cảnh trước ra hết 0,3–0,5 s; TP-CD01 Lò xo giải tích thay cho đường tăng giảm tốc; TP-AT05 Tiếng ít mà đúng theo hành động |
| Kho hình chung | khuon_canh_mo_dau_cau_hoi, bo_bieu_tuong_co_ban, khuon_canh_ket_tom_lai, man_hinh_ung_dung, tau_container_hang_hoa |

**Lỗi hay gặp:**

- Đáp án viết thành câu: dùng ba ô biểu tượng A, B, C, giọng đọc nói nội dung.
- Chờ quá 3 giây: người xem bỏ đi; đồng hồ đúng 3 giây.
- Câu đố cần kiến thức chưa giảng: quy tắc phải nói trước câu đố 1.

### MK-13 Nếu không có X

**Dấu hiệu:** X là một cơ chế bảo vệ hoặc hạ tầng mà người xem coi là hiển nhiên: sổ đăng ký giao dịch bảo đảm, Ngân hàng Nhà nước, trung tâm thông tin tín dụng, dự trữ bắt buộc, bảo lãnh, phòng ngừa rủi ro.

**Dàn chương mẫu:**

1. Mở: cùng một cảnh quen thuộc, rút X ra khỏi hình (1 chương)
2. Hậu quả 1, 2, 3 tăng dần, mỗi hậu quả một thay đổi trên cùng cảnh (3 chương)
3. Đặt X trở lại: từng hậu quả bị chặn thế nào (2–3 chương)
4. Cái giá của X: thủ tục, chi phí, độ chậm (1 chương)
5. Tóm lại: hai nửa khung có X và không có X (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-09, KB-06, KB-05 |
| Chất liệu | CL-13 3D sa bàn bằng mã, CL-14 Mô phỏng và bề mặt toán, CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-12 Hạt và ánh sáng, CL-16 Giao diện và thẻ nổi |
| Bố cục | BC-05 Vật thể giữa khung, nhãn bên, BC-11 Một ý toàn khung ngang, BC-09 Khung chương hồi, BC-08 Bàn thao tác |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-42 Màu LPBank, MAU-34 Màu Agribank, MAU-32 Màu Vietcombank |
| Nhạc | nhóm hồi hộp, trầm, nghiêm, tập trung, nhẹ; vừa; 81–123 BPM; gợi ý NH50 Night Patrol, Michael Ramir C., NH54 Infectious Groove, Alejandro Magaña (A. M.), NH08 Tech House vibes, Alejandro Magaña, NH31 Deep Techno Ambience, Alejandro Magaña (A. M.) |
| Nhịp cắt | Một cảnh xuyên suốt, không cắt sang cảnh khác; mỗi hậu quả 8–12 giây; điểm ngắt giữa phần không có X và có X bằng đổi nền. |
| Thủ pháp | TP-CC13 Chuyển trạng thái ngày sang đêm và kéo thanh trượt đổi ảnh; TP-CC01 Một hình duy nhất biến qua nhiều trạng thái, không cắt cảnh; TP-3D06 Tách lớp, hình nổ và thu nhỏ theo bậc quy mô; TP-HK14 Vụ nổ và sóng lan; TP-SL14 Số liệu từ mô phỏng tính thật; TP-CC10 Đổi nền xen tối, sáng, màu đặc làm điểm ngắt nhịp; TP-CD09 Vi chuyển động giữ cảnh tĩnh, và dừng có chủ đích trước đoạn kết; TP-3D03 Camera đẳng cự đứng yên, đồ vật xuất hiện lần lượt |
| Kho hình chung | toa_nha_ngan_hang, khach_hang_ca_nhan, nha_o, thu_vien_3d_ngan_hang, khuon_so_sanh_hai_cot, ngan_hang_nha_nuoc |

**Lỗi hay gặp:**

- Phóng đại hậu quả không có nguồn: số trên hình là số giả định có nhãn.
- Giọng doạ: chỉ mô tả cơ chế, không kết luận "rất nguy hiểm".
- Bỏ qua cái giá của X: người xem nghĩ X không có mặt trái.

### MK-14 Mổ xẻ một tờ giấy

**Dấu hiệu:** Thuật ngữ gắn với một văn bản người xem sẽ cầm hoặc ký: thư tín dụng, thư cam kết bồi hoàn, thư bảo lãnh, hợp đồng tín dụng, khế ước, báo cáo tín dụng, vận đơn.

**Dàn chương mẫu:**

1. Mở: cả tờ giấy mờ, câu hỏi "ô nào quyết định tiền của bạn" (1 chương)
2. Bản đồ tờ giấy: 4–6 vùng tô màu, đánh số (1 chương)
3. Phóng vào từng vùng, mỗi vùng một chương, đổi vùng thì hệ quả đổi (4–6 chương)
4. Ô hay bị bỏ qua (1–2 chương)
5. Phụ lục, mặt sau, giấy đi kèm (1 chương)
6. Tóm lại: tờ giấy thu nhỏ, các vùng đã đánh số sáng lần lượt (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-02, KB-05 |
| Chất liệu | CL-16 Giao diện và thẻ nổi, CL-09 2D minh hoạ phẳng có vật thể, CL-10 2D nét vẽ tay, CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt |
| Bố cục | BC-09 Khung chương hồi, BC-10 Tiêu đề hai dòng và một biểu đồ, BC-08 Bàn thao tác |
| Mức chi tiết | CT1 |
| Bảng màu | MAU-33 Màu BIDV, MAU-38 Màu VPBank, MAU-37 Màu Techcombank |
| Nhạc | nhóm tập trung, nhẹ; vừa; 103–144 BPM; gợi ý NH00 Close Up, Michael Ramir C., NH16 Infinity, Arulo, NH12 Finding Myself, Michael Ramir C. |
| Nhịp cắt | Máy quay ảo đẩy liên tục trên một tờ giấy, mỗi vùng 10–15 giây; chuyển vùng bằng lùi ra toàn tờ 1 giây rồi phóng vào vùng kế. |
| Thủ pháp | TP-CD07 Máy quay ảo 2D: đẩy chậm liên tục và phóng cho vật đang xét lấp khung; TP-SL18 Chú thích: khung bao, nhãn khác màu và mũi tên cong; TP-CH08 Gạch chân và vòng vẽ tay quanh từ khoá; TP-HK13 Khung chứa bo góc cắt gọn mọi cú phóng; TP-CC03 Phóng máy quay vào một tâm sáng hoặc vào màn hình trong cảnh; TP-CD05 Con trỏ chuột điều khiển mọi thay đổi (kèm nghiêng theo con trỏ); TP-3D10 Thẻ giao diện nghiêng nhẹ trong không gian 3D, băng chuyền thẻ; TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut) |
| Kho hình chung | hop_dong_giay_to, khuon_trich_van_ban_phap_luat, bo_chung_tu_hoa_don, bao_cao_tin_dung_mo_phong, nhan_gia_dinh |

**Lỗi hay gặp:**

- Chữ trên tờ giấy đọc được hết (phạm C2): chữ nền là vạch xám giả, chỉ vùng đang phóng có tối đa 6 tiếng.
- Dùng mẫu giấy tờ thật có tên, logo ngân hàng: cấm, tự dựng mẫu giả lập.
- Tờ giấy đứng yên: phải có máy quay đẩy hoặc con trỏ chỉ.

### MK-15 Hai phía bàn đối đáp

**Dấu hiệu:** Chủ đề có hai góc nhìn đều có lý, thường là người vay và ngân hàng, hoặc người mới và người làm lâu năm: đáo hạn, room tín dụng, khẩu vị, cơ cấu nợ, lộ trình nghề.

**Dàn chương mẫu:**

1. Mở: hai nhân vật hai phía bàn, câu hỏi gắt của một bên (1 chương)
2. Lượt 1: bên hỏi nêu điều khó chịu, bên kia nêu lý do (2 chương)
3. Lượt 2, 3: mỗi lượt một hình chứng minh đặt giữa bàn (3–4 chương)
4. Chỗ hai bên hiểu sai về nhau (1 chương)
5. Điểm gặp nhau: cách làm có lợi cho cả hai (1–2 chương)
6. Kết: hai nhân vật cùng nhìn một hình (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-07, KB-03, KB-02 |
| Chất liệu | CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-10 2D nét vẽ tay, CL-13 3D sa bàn bằng mã |
| Bố cục | BC-09 Khung chương hồi, BC-11 Một ý toàn khung ngang, BC-13 Bảng trắng toàn khung, BC-05 Vật thể giữa khung, nhãn bên |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-35 Màu VietinBank, MAU-42 Màu LPBank, MAU-37 Màu Techcombank |
| Nhạc | nhóm tập trung, nhẹ, tươi vui, trầm, nghiêm; vừa; 89–112 BPM; gợi ý NH10 Just Keep Walking, Michael Ramir C., NH16 Infinity, Arulo, NH05 Curiosity, Diego Nava, NH67 Dark Ambient Emotions Music, Vlad Bakutov |
| Nhịp cắt | Hai bên cố định chỗ; mỗi lượt 15–25 giây, máy quay trượt nhẹ sang bên đang được nói tới; hình chứng minh giữa bàn đổi theo lượt. |
| Thủ pháp | TP-CD11 Nhân vật hộp có đặc tả kích thước; TP-CD08 Nền nhiều lớp trôi khác tốc độ (parallax 2D); TP-CC02 Chuyển cảnh khớp bằng vật mang theo (shared element, match cut); TP-CD10 Chuyển động lượng tử hoá (animated on twos); TP-SL08 Hai số so sánh trên khung biên lai; TP-CC12 Khung cuối bằng khung đầu (vòng lặp liền mạch); TP-CD09 Vi chuyển động giữ cảnh tĩnh, và dừng có chủ đích trước đoạn kết; TP-CH06 Từ khoá nền chip hoặc bóng đổ lệch hai lớp |
| Kho hình chung | khach_hang_ca_nhan, toa_nha_ngan_hang, hop_dong_giay_to, doanh_nghiep_nha_xuong, khuon_so_sanh_hai_cot |

**Lỗi hay gặp:**

- Hai nhân vật đọc bằng hai giọng: chỉ có một giọng VieNeu, giọng dẫn thuật lại, bóng thoại tối đa 6 tiếng.
- Phía ngân hàng luôn đúng: phải công nhận phần đúng của người vay.
- Hai nhân vật đứng yên nói: mỗi lượt phải có hình đặt giữa bàn.

### MK-16 Lần ngược từ kết cục

**Dấu hiệu:** Chủ đề về hậu quả và rủi ro: cho vay bên liên quan, rủi ro nghề cán bộ tín dụng, sai mục đích vốn, tài sản bị xử lý, chứng từ giả.

**Dàn chương mẫu:**

1. Mở bằng kết cục: một ngày cụ thể, số tiền giả định, không tên người, không tên doanh nghiệp (1 chương)
2. Lùi 6 tháng: dấu hiệu thứ nhất, lúc đó trông bình thường (1–2 chương)
3. Lùi 1 năm: dấu hiệu thứ hai, nặng hơn (1–2 chương)
4. Về ngày ký: quyết định gốc (1–2 chương)
5. Nấc nặng nhất: quy định bị vượt, trích văn bản tối đa một cảnh (1 chương)
6. Quay về hiện tại: ba dấu hiệu đặt cạnh nhau trên trục ngày (1 chương)

| Trục | Gợi ý |
|---|---|
| Lối viết | KB-06, KB-03 |
| Chất liệu | CL-15 Minh hoạ kể chuyện có nhân vật, giấy cắt, CL-14 Mô phỏng và bề mặt toán, CL-10 2D nét vẽ tay, CL-13 3D sa bàn bằng mã, CL-16 Giao diện và thẻ nổi |
| Bố cục | BC-11 Một ý toàn khung ngang, BC-09 Khung chương hồi, BC-05 Vật thể giữa khung, nhãn bên, BC-10 Tiêu đề hai dòng và một biểu đồ |
| Mức chi tiết | CT1, CT2 |
| Bảng màu | MAU-32 Màu Vietcombank, MAU-34 Màu Agribank, MAU-38 Màu VPBank |
| Nhạc | nhóm hồi hộp, trầm, nghiêm; chậm đến vừa; 81–123 BPM; gợi ý NH54 Infectious Groove, Alejandro Magaña (A. M.), NH50 Night Patrol, Michael Ramir C., NH67 Dark Ambient Emotions Music, Vlad Bakutov, NH08 Tech House vibes, Alejandro Magaña |
| Nhịp cắt | Đồng hồ ngày quay lùi giữa các mốc 2–3 giây làm chuyển cảnh; mỗi mốc 20–30 giây; dừng có chủ đích trước nấc nặng nhất. |
| Thủ pháp | TP-SL03 Bộ đếm số chạy; TP-CC13 Chuyển trạng thái ngày sang đêm và kéo thanh trượt đổi ảnh; TP-HK07 Hậu kỳ phim cũ; TP-CD09 Vi chuyển động giữ cảnh tĩnh, và dừng có chủ đích trước đoạn kết; TP-SL05 Con dấu cao su đóng nghiêng cạnh số lớn; TP-CC10 Đổi nền xen tối, sáng, màu đặc làm điểm ngắt nhịp; TP-CH07 Gạch ngang chữ cũ rồi thay bằng chữ mới; TP-HK01 Hạt nhiễu phim, độ đục tối đa khoảng 6% |
| Kho hình chung | truc_thoi_gian, khach_hang_ca_nhan, doanh_nghiep_nha_xuong, hop_dong_giay_to, khuon_trich_van_ban_phap_luat |

**Lỗi hay gặp:**

- Tình huống trông như vụ thật: ghi nhãn "tình huống giả định", không tên người, doanh nghiệp, ngân hàng.
- Lùi quá nhiều mốc: tối đa 3 mốc, có đồng hồ ngày.
- Đổ lỗi cho một cá nhân: chỉ ra cơ chế, không kết tội.

## 3. Xếp mẫu và tổ hợp cho các video còn lại

Thứ tự theo mục 4 kế hoạch loạt. Luật: hai video liền nhau khác chất liệu; mỗi video khác 3 video trước ở ít nhất hai trục (CL, CT, BC, MAU, NH); nhạc dùng lại bài cũ rè thấp (max10 < 4, max16 < 6), không tải thêm, mỗi bài cách ít nhất 3 video (bảng nhắm 6), video giảng công thức nhịp vừa. Dòng Biến tấu chép thẳng vào đầu kịch bản rồi thêm phần sau chữ "Khác".

| # | Mã | Video | Lô | Phiên | Mẫu | Dòng Biến tấu | Lặp nhạc | Mở đầu | Hình chính |
|---|---|---|---|---|---|---|---|---|---|
| 1 | N129 | Giải ngân khoản vay cá nhân | 3 | A | MK-04 | Khổ ngang · KB-05 · CL-15 · CT1 · BC-09 · MAU-39 · NH10 | lần đầu trong loạt | kết quả trước: tiền đã vào tài khoản người bán nhà | nhân vật người vay cầm bộ hồ sơ đi qua bốn trạm, tiền đi thẳng tới người bán |
| 2 | N135 | Giải ngân khoản vay doanh nghiệp | 3 | A | MK-04 | Khổ ngang · KB-05 · CL-13 · CT2 · BC-05 · MAU-36 · NH31 | lần đầu trong loạt | so sánh với N129: cùng hợp đồng, tiền không qua tay doanh nghiệp | sa bàn nhà xưởng, nhà cung cấp, ngân hàng; dòng tiền chạy theo từng lần giải ngân |
| 3 | N117 | Đáo hạn khoản vay | 3 | C | MK-15 | Khổ ngang · KB-03 · CL-10 · CT1 · BC-13 · MAU-35 · NH67 | lần đầu trong loạt | người vay hỏi: khoản cũ đến hạn, sao không gia hạn luôn? | hai nhân vật vẽ tay hai phía bàn, giữa bàn là trục thời gian khoản cũ khép lại, khoản mới mở ra |
| 4 | N126 | Cơ cấu lại thời hạn trả nợ | 3 | C | MK-02 | Khổ ngang · KB-02 · CL-05 · CT1 · BC-07 · MAU-32 · NH16 | cách 9 video (sau N73) | câu hỏi: "trả chậm mà vẫn giữ nhóm nợ 1?" | hai nửa khung: lịch trả nợ cũ và lịch đã giãn, thang nhóm nợ bên cạnh đứng yên |
| 5 | N127 | Cho vay bù đắp | 3 | A | MK-01 | Khổ ngang · KB-02 · CL-09 · CT1 · BC-08 · MAU-37 · NH05 | lần đầu trong loạt | tình huống có số: doanh nghiệp đã tự trả 3 tỷ cho máy móc | bình chứa vốn tự có đã vơi được ngân hàng rót đầy lại |
| 6 | N109 | Cho vay và cho thuê tài chính | 3 | B | MK-02 | Khổ ngang · KB-07 · CL-06 · CT2 · BC-07 · MAU-40 · NH30 | cách 7 video (sau N134) | hai doanh nghiệp cùng cần một máy, hai con đường | hai nửa khung: một máy đất sét, giấy sở hữu nằm ở doanh nghiệp hoặc ở công ty cho thuê |
| 7 | N112 | Định giá tài sản bảo đảm | 4 | B | MK-03 | Khổ ngang · KB-01 · CL-14 · CT1 · BC-08 · MAU-34 · NH00 | cách 9 video (sau N105) | con số bất ngờ: nhà giá 5 tỷ chỉ được tính 3,5 tỷ | bàn thao tác: giá thị trường đi qua ba bộ lọc, mỗi bộ lọc trừ một phần |
| 8 | N95 | Tỷ lệ cho vay trên giá trị tài sản (LTV) | 4 | B | MK-03 | Khổ ngang · KB-08 · CL-05 · CT1 · BC-10 · MAU-33 · NH12 | cách 8 video (sau N116) | câu hỏi có số: nhà 5 tỷ vay được tối đa bao nhiêu | thanh giá trị tài sản và thanh khoản vay chạy cạnh nhau, tỷ lệ đếm số |
| 9 | N107 | Đăng ký giao dịch bảo đảm | 4 | B | MK-13 | Khổ ngang · KB-09 · CL-16 · CT1 · BC-09 · MAU-42 · NH23 | lần đầu trong loạt | rút sổ đăng ký chung ra: một ngôi nhà được thế chấp ở hai nơi | thẻ tra cứu đăng ký giả lập biến mất, hai chủ nợ cùng cầm giấy tờ một ngôi nhà; đặt sổ lại thì dấu thời gian xếp thứ tự |
| 10 | N113 | Xử lý tài sản bảo đảm | 4 | B | MK-04 | Khổ ngang · KB-05 · CL-13 · CT2 · BC-05 · MAU-38 · NH11 | lần đầu trong loạt | kết quả trước: tài sản đã bán, tiền chia ra ba phần | sa bàn tài sản đi qua các trạm thông báo, thu giữ, đấu giá, chia tiền |
| 11 | N75 | Bảo lãnh ngân hàng | 5.1 | D | MK-09 | Khổ ngang · KB-02 · CL-15 · CT1 · BC-11 · MAU-36 · NH07 | lần đầu trong loạt | chủ đầu tư không tin nhà thầu mới | ba nhân vật giấy cắt, lời cam kết của ngân hàng đi từ tay này sang tay kia |
| 12 | N78 | Thư tín dụng (L/C) | 5.1 | D | MK-09 | Khổ ngang · KB-05 · CL-13 · CT2 · BC-05 · MAU-40 · NH06 | lần đầu trong loạt | người bán ở xa, hàng đã lên tàu, tiền chưa về | sa bàn hai bờ biển, bộ chứng từ và tiền đi ngược chiều nhau qua hai ngân hàng |
| 13 | N83 | Các loại thư tín dụng | 5.1 | D | MK-14 | Khổ ngang · KB-02 · CL-16 · CT1 · BC-10 · MAU-33 · NH15 | lần đầu trong loạt | một tờ L/C có sáu ô quyết định người bán có được trả tiền | thẻ tờ L/C giả lập, chữ nền là vạch xám, máy quay phóng vào từng ô; ô đổi thì loại L/C đổi theo |
| 14 | N77 | Chiết khấu bộ chứng từ | 5.1 | D | MK-03 | Khổ ngang · KB-08 · CL-14 · CT1 · BC-10 · MAU-37 · NH54 | lần đầu trong loạt | con số: nhận 980 triệu hôm nay thay vì 1 tỷ sau 90 ngày | đồng hồ đếm ngày lùi, số tiền nhận trước lớn dần khi ngày về gần |
| 15 | N76 | Bao thanh toán | 5.1 | D | MK-09 | Khổ ngang · KB-02 · CL-09 · CT1 · BC-09 · MAU-35 · NH10 | cách 14 video (sau N129) | người bán hàng trả chậm hết tiền mua nguyên liệu | tờ hoá đơn phẳng trượt từ người bán sang ngân hàng, tiền trượt ngược lại |
| 16 | N92 | Chuyển tiền bằng điện và nhờ thu D/P | 5.2 | A | MK-02 | Khổ ngang · KB-07 · CL-05 · CT1 · BC-07 · MAU-32 · NH08 | lần đầu trong loạt | hai lô hàng giống nhau, hai cách trả tiền | hai dải thời gian song song: tiền đi trước hàng và hàng đi trước tiền |
| 17 | N94 | Incoterms | 5.2 | A | MK-12 | Khổ ngang · KB-08 · CL-06 · CT2 · BC-05 · MAU-42 · NH31 | cách 15 video (sau N135) | câu đố 1: thùng hàng rơi lúc cẩu lên tàu, ai chịu? | tàu, cảng, xe tải đất sét; người xem đoán 3 giây rồi vạch chuyển rủi ro trượt tới đáp án |
| 18 | N93 | FOB và CIF | 5.2 | A | MK-12 | Khổ ngang · KB-07 · CL-10 · CT1 · BC-13 · MAU-34 · NH00 | cách 11 video (sau N112) | hai báo giá cùng lô hàng chênh 6%: đoán vì sao | đường đi của hàng vẽ tay, ba câu đố về điểm chuyển rủi ro, đáp án khoanh tròn |
| 19 | N84 | Thư cam kết bồi hoàn (LOI) | 5.2 | A | MK-14 | Khổ ngang · KB-02 · CL-15 · CT1 · BC-09 · MAU-38 · NH05 | cách 14 video (sau N127) | lá thư một trang giúp lấy hàng khi chưa có vận đơn gốc | lá thư giấy cắt trên bàn thuyền trưởng, phóng vào từng đoạn: ai cam kết, cam kết gì, bồi hoàn tới đâu |
| 20 | N85 | Cho vay chuyển khẩu | 5.2 | A | MK-05 | Khổ ngang · KB-05 · CL-12 · CT1 · BC-11 · MAU-39 · NH50 | lần đầu trong loạt | hàng đi từ nước A sang nước C, không qua Việt Nam | bản đồ chấm: hàng đi một đường, tiền đi một đường khác, hai dòng hạt |
| 21 | N88 | CITAD và NAPAS | 6 | D | MK-05 | Khổ ngang · KB-07 · CL-13 · CT2 · BC-05 · MAU-32 · NH30 | cách 15 video (sau N109) | chuyển 50 triệu lúc 23 giờ: tiền đi đường nào | sa bàn hai đường ống tiền giữa các ngân hàng A, B, C, một ống lớn chậm, một ống nhỏ nhanh |
| 22 | N91 | SWIFT | 6 | D | MK-11 | Khổ ngang · KB-09 · CL-12 · CT1 · BC-09 · MAU-36 · NH11 | cách 12 video (sau N113) | trước khi có SWIFT, lệnh chuyển tiền quốc tế đi bằng điện tín gõ tay | bản đồ chấm, các nút sáng dần theo năm, điện tín gõ tay đổi thành gói tin chuẩn |
| 23 | N90 | Giờ chốt chuyển tiền | 6 | D | MK-06 | Khổ ngang · KB-03 · CL-14 · CT1 · BC-08 · MAU-40 · NH67 | cách 20 video (sau N117) | niềm tin: "chuyển khoản là tới ngay" | hàng đợi lệnh mô phỏng, đồng hồ chốt đóng cửa, lệnh sau giờ chốt dồn sang ngày sau |
| 24 | N89 | Hệ thống core ngân hàng | 6 | D | MK-05 | Khổ ngang · KB-05 · CL-07 · CT2 · BC-05 · MAU-38 · NH06 | cách 12 video (sau N78) | bấm chuyển tiền: 2 giây đó có gì xảy ra | máy chủ 3D xuyên thấu, mỗi phân hệ một màu sáng lên khi lệnh đi qua |
| 25 | N101 | Chi phí vốn của ngân hàng | 7 | C | MK-03 | Khổ ngang · KB-08 · CL-09 · CT1 · BC-08 · MAU-34 · NH16 | cách 21 video (sau N126) | câu hỏi có số: ngân hàng trả bao nhiêu cho mỗi 100 đồng nó cho vay | bình chứa vốn được rót từ ba vòi giá khác nhau, mực nước cho ra giá vốn bình quân |
| 26 | N102 | Định giá điều chuyển vốn nội bộ (FTP) | 7 | C | MK-05 | Khổ ngang · KB-05 · CL-13 · CT2 · BC-05 · MAU-39 · NH12 | cách 18 video (sau N95) | hai chi nhánh cùng huy động, chỉ một chi nhánh lời | sa bàn toà nhà ngân hàng, trung tâm vốn ở giữa mua bán vốn với các phòng |
| 27 | N103 | Biên lãi thuần (NIM) | 7 | C | MK-03 | Khổ ngang · KB-01 · CL-05 · CT1 · BC-06 · MAU-42 · NH00 | cách 9 video (sau N93) | con số trần: 3,5% | đồ thị hai đường lãi cho vay và lãi huy động, khoảng giữa tô màu thành NIM |
| 28 | N114 | Tỷ lệ CASA | 7 | C | MK-03 | Khổ ngang · KB-08 · CL-14 · CT1 · BC-10 · MAU-35 · NH10 | cách 13 video (sau N76) | hai nhóm ngân hàng cùng 100 đồng tiền gửi, giá vốn khác nhau | bể chứa hai vòi: vòi tiền không kỳ hạn rẻ, vòi có kỳ hạn đắt, tỷ lệ đếm số |
| 29 | N132 | Basel và an toàn vốn | 7 | C | MK-11 | Khổ ngang · KB-09 · CL-15 · CT1 · BC-11 · MAU-33 · NH07 | cách 18 video (sau N75) | năm 1974, một ngân hàng nhỏ ở Đức đóng cửa giữa ngày, tiền đã chuyển không về | dòng thời gian giấy cắt từ 1974 tới nay, toà nhà ngân hàng thêm một lớp đệm vốn sau mỗi mốc Basel |
| 30 | N131 | Tỷ lệ cho vay trên huy động (LDR) | 7 | C | MK-03 | Khổ ngang · KB-08 · CL-10 · CT1 · BC-13 · MAU-37 · NH05 | cách 11 video (sau N84) | câu hỏi có số: 100 đồng gửi vào, cho vay ra được bao nhiêu | bảng trắng vẽ tay: cột huy động, cột cho vay, vạch trần tỷ lệ |
| 31 | N115 | Cho vay bên liên quan | 7 | C | MK-16 | Khổ ngang · KB-06 · CL-16 · CT1 · BC-09 · MAU-32 · NH30 | cách 10 video (sau N88) | kết cục: khoản vay sạch trên giấy thành nợ xấu, ba công ty cùng một chủ | thẻ sơ đồ quan hệ lần ngược theo đồng hồ ngày (hôm nay, 6 tháng trước, ngày ký); mỗi mốc lộ thêm một đường nối |
| 32 | N120 | Vai trò Ngân hàng Nhà nước | 8 | E | MK-13 | Khổ ngang · KB-09 · CL-13 · CT2 · BC-05 · MAU-34 · NH23 | cách 23 video (sau N107) | một ngày không có Ngân hàng Nhà nước: ngân hàng thiếu tiền cuối ngày hỏi ai | sa bàn các ngân hàng A, B, C; bỏ toà nhà ở giữa thì dòng tiền rối, đặt lại thì bốn núm điều chỉnh trở về |
| 33 | N133 | Dự trữ bắt buộc | 8 | E | MK-10 | Khổ ngang · KB-08 · CL-14 · CT1 · BC-08 · MAU-38 · NH12 | cách 7 video (sau N102) | con số: 100 đồng gửi vào, vì sao không cho vay hết | van giữ lại một phần dòng chảy, vặn tỷ lệ thì lượng cho vay đổi theo mô phỏng |
| 34 | N118 | Lãi suất liên ngân hàng | 8 | E | MK-10 | Khổ ngang · KB-05 · CL-12 · CT1 · BC-11 · MAU-39 · NH50 | cách 14 video (sau N85) | cuối ngày ngân hàng A thừa tiền, B thiếu tiền | hạt vốn chảy qua đêm từ nút thừa sang nút thiếu, giá chảy hiện bằng độ sáng |
| 35 | N119 | Phòng ngừa rủi ro (hedging) | 8 | E | MK-10 | Khổ ngang · KB-02 · CL-05 · CT1 · BC-07 · MAU-36 · NH08 | cách 19 video (sau N92) | doanh nghiệp nhập khẩu sợ tỷ giá tăng | hai đường lãi lỗ ngược chiều, đường tổng nằm phẳng |
| 36 | N106 | Room tín dụng | 8 | E | MK-06 | Khổ ngang · KB-03 · CL-09 · CT1 · BC-08 · MAU-42 · NH67 | cách 13 video (sau N90) | niềm tin: "hết room là ngân hàng hết tiền" | bình chứa có vạch trần, tiền còn trong bình nhưng không rót được qua vạch |
| 37 | N121 | Ngân hàng nhà nước nắm cổ phần và ngân hàng cổ phần | 8 | E | MK-02 | Khổ ngang · KB-07 · CL-16 · CT1 · BC-10 · MAU-37 · NH06 | cách 13 video (sau N89) | hai nhóm ngân hàng ẩn danh, cổ đông khác nhau | hai thẻ cơ cấu cổ đông dạng vòng theo nhóm, khối nhà nước nổi rõ |
| 38 | N123 | Ngân hàng và bất động sản | 8 | E | MK-10 | Khổ ngang · KB-05 · CL-06 · CT2 · BC-07 · MAU-33 · NH11 | cách 16 video (sau N91) | giá nhà tăng, khoản vay tăng, vòng lặp bắt đầu | khu nhà đất sét bên trái, ngân hàng bên phải, dòng vay và tài sản bảo đảm quay vòng |
| 39 | N128 | Các vị trí trong ngân hàng | 9 | F | MK-07 | Khổ ngang · KB-02 · CL-15 · CT1 · BC-09 · MAU-40 · NH10 | cách 11 video (sau N114) | một hồ sơ vay đi qua bao nhiêu người | toà nhà giấy cắt cắt ngang, máy quay trượt qua từng phòng có nhân vật |
| 40 | N125 | Kiến thức cần có của cán bộ tín dụng | 9 | F | MK-08 | Khổ ngang · KB-02 · CL-13 · CT2 · BC-05 · MAU-35 · NH31 | cách 23 video (sau N94) | bàn làm việc trống, từng món đồ nghề hiện lên | sa bàn bàn làm việc, mỗi kiến thức là một vật, xuất hiện lần lượt |
| 41 | N130 | Lộ trình thăng tiến | 9 | F | MK-15 | Khổ ngang · KB-02 · CL-10 · CT1 · BC-09 · MAU-42 · NH07 | cách 12 video (sau N132) | nhân viên mới hỏi trưởng phòng: mấy năm để ngồi ghế này? | hai nhân vật que vẽ tay, con đường các nấc vẽ dần giữa hai người theo từng câu hỏi |
| 42 | N124 | Rủi ro nghề cán bộ tín dụng | 9 | F | MK-16 | Khổ ngang · KB-06 · CL-15 · CT1 · BC-11 · MAU-32 · NH54 | cách 28 video (sau N77) | kết cục: cán bộ tín dụng nhận quyết định kỷ luật dù khoản vay đúng quy trình | nhân vật giấy cắt, đồng hồ ngày quay lùi qua ba mốc, bối cảnh sáng dần khi lùi về ngày ký |
| 43 | N104 | Thẩm định tập trung và phân tán | 9 | F | MK-02 | Khổ ngang · KB-07 · CL-12 · CT1 · BC-09 · MAU-36 · NH15 | cách 30 video (sau N83) | cùng một hồ sơ, hai cách duyệt, hai thời gian chờ | hạt hồ sơ chảy về một trung tâm sáng hoặc tản về nhiều nút nhỏ |
| 44 | N111 | Khẩu vị tín dụng | 9 | F | MK-12 | Khổ ngang · KB-08 · CL-09 · CT1 · BC-08 · MAU-40 · NH16 | cách 19 video (sau N101) | ba hồ sơ vay: đoán ngân hàng nhận hồ sơ nào | khay ba hồ sơ (ngành, tài sản, dòng tiền), đáp án lật bằng con dấu nhận hoặc trả lại |
| 45 | N110 | Khi đi vay cần lưu ý những gì | cuối | F | MK-08 | Khổ ngang · KB-02 · CL-16 · CT1 · BC-10 · MAU-37 · NH00 | cách 18 video (sau N103) | hậu quả: một điều khoản bỏ sót, lãi tăng gấp đôi | lưới thẻ biểu tượng, mỗi thẻ trỏ tới một video chi tiết của loạt |

## 4. Đếm theo trục

- Mẫu: MK-01 ×1, MK-02 ×5, MK-03 ×7, MK-04 ×3, MK-05 ×4, MK-06 ×2, MK-07 ×1, MK-08 ×2, MK-09 ×3, MK-10 ×4, MK-11 ×2, MK-12 ×3, MK-13 ×2, MK-14 ×2, MK-15 ×2, MK-16 ×2
- Lối viết: KB-01 ×2, KB-02 ×11, KB-03 ×3, KB-05 ×9, KB-06 ×2, KB-07 ×6, KB-08 ×8, KB-09 ×4
- Chất liệu: CL-05 ×5, CL-06 ×3, CL-07 ×1, CL-09 ×5, CL-10 ×4, CL-12 ×4, CL-13 ×7, CL-14 ×5, CL-15 ×6, CL-16 ×5
- Bảng màu: MAU-32 ×5, MAU-33 ×4, MAU-34 ×4, MAU-35 ×4, MAU-36 ×5, MAU-37 ×5, MAU-38 ×4, MAU-39 ×4, MAU-40 ×5, MAU-42 ×5
- Nhạc: NH00 ×4, NH05 ×3, NH06 ×3, NH07 ×3, NH08 ×2, NH10 ×4, NH11 ×3, NH12 ×3, NH15 ×2, NH16 ×3, NH23 ×2, NH30 ×3, NH31 ×3, NH50 ×2, NH54 ×2, NH67 ×3
