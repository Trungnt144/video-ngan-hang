# BÁO CÁO SOÁT ĐỘC LẬP CHẤT LƯỢNG HÌNH ẢNH (BẢN V3)
**Dự án:** `n302_ebitda` — EBITDA là gì?
**Phiên soát:** Antigravity (Gemini 3.8 Flash) — Chế độ soát độc lập, không chỉnh sửa file, chỉ đọc ảnh tĩnh và đối chiếu dữ kiện.

---

### Bước 1 & 2. Căn cứ đối chiếu
- **Ảnh chuẩn ĐẠT:** `tai_san/anh_chuan_hinh/n199_chuan_dat_12_khung.jpg` (vật thể chuyển động theo số liệu, ít chữ, thoáng đãng, số to rõ).
- **Ảnh chuẩn KHÔNG ĐẠT:** `tai_san/anh_chuan_hinh/n301_khong_dat_12_khung.jpg` (thẻ chữ dày đặc, bảng chữ nhỏ, liệt kê gạch đầu dòng, dạng slide tĩnh).
- **Luật cảnh:** `skills/lam-video-ngan-hang/chuan_hinh_video_ngang.md` mục 2 (tối đa 12 từ trên hình, một hình chính chuyển động theo số, không thẻ chữ dày, số liệu khớp file `du_kien.json`).

---

### Bước 3 & 4. Bảng đánh giá chi tiết 9 chương

| Chương | Hình chính là gì (một câu, nói vật gì đang làm gì) | Có chuyển động giữa hai ảnh không | Số từ trên hình (đếm tay, không tính phụ đề) | Chữ nào khó đọc trên điện thoại | Giống ảnh đạt hay ảnh không đạt | Mức: nặng / vừa / nhẹ / đạt |
|---|---|---|---|---|---|---|
| **C01** | Hai ngăn đối chiếu EBITDA (20 ô vuông xanh) và Tiền (hộp trống dấu ?) với dấu ≠ to ở giữa và dòng hạt chảy ngắt quãng biểu thị sức sinh lời không đồng nghĩa với tiền trong két. | Có (ở [n302_c01_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c01_01.png) và [n302_c01_06.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c01_06.png), dòng hạt vàng chảy uốn lượn liên tục, nhãn đáy đổi từ "Sức sinh lời" sang "Tiền thực tế"). | 11 từ (kể cả 4 từ nhãn góc "ví dụ giả định"; chữ chính chỉ 7 từ: "EBITDA 20 tỷ", "Tiền ?", "≠", "Tiền thực tế"). | Không có; số và chữ đều to trên 40px. | Giống ảnh đạt (n199) | **Đạt** |
| **C02** | Khung phân phối EBITDA với 4 ngăn hứng ("Lãi vay", "Thuế thu nhập", "Khấu hao", "Phân bổ") đón dòng hạt rót từ trên xuống và lần lượt phát sáng theo từng khoản được thuyết minh. | Có (ở [n302_c02_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c02_01.png) khối "Lãi vay" sáng, sang [n302_c02_09.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c02_09.png) khối "Thuế thu nhập" sáng cùng dòng hạt vàng rót xuống). | 10 từ ("EBITDA", "Lãi vay", "Thuế thu nhập", "Khấu hao", "Phân bổ"). | Không có; các nhãn ngắn gọn, chữ rõ nét trên nền xanh sẫm. | Giống ảnh đạt (n199) | **Đạt** |
| **C03** | Khối 100 chấm Doanh thu bóc tách sang Chi phí 80 chấm và EBITDA 20 chấm, sau đó chuyển thành các phép tính thanh khối trực quan và công thức tính ngược 6 + 2 + 4 + 8 = 20. | Có (từ khối 100 chấm ở [n302_c03_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c03_01.png) biến đổi sang biểu thức cộng ngược 4 thành phần thanh màu và hạt chạy ở [n302_c03_09.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c03_09.png)). | 7 từ ở c03_09 ("ví dụ giả định", "EBITDA", "tỷ đồng"); ở c03_04 có 11 từ chính. | Không có; con số và phép tính hiển thị cỡ cực đại (>50px). | Giống ảnh đạt (n199) | **Nhẹ** *(khung giữa c03_04 hơi nhiều số liệu đồng thời trước khi tách sang c03_05-c03_09)* |
| **C04** | Thanh ma trận 100 ô vuông doanh thu với 20 ô hàng trên sáng màu xanh ngọc biểu diễn tỷ số Biên EBITDA 20% cùng dải hạt lượn sóng bên dưới. | Có (dải hạt sóng nhấp nhô liên tục dưới ma trận từ [n302_c04_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c04_01.png) sang [n302_c04_09.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c04_09.png), xuất hiện thêm nhãn "Cùng ngành"). | 8 từ (kể cả nhãn góc: "ví dụ giả định", "Biên EBITDA", "Cùng ngành"). | Không có; số "20 / 100 = 20%" to nổi bật giữa màn hình. | Giống ảnh đạt (n199) | **Đạt** |
| **C05** | Thước đo tỷ số Nợ ròng/EBITDA chia vạch chạy hạt kết hợp 50 ô vuông nợ ròng, co giãn từ 2,5 đoạn (hạt xanh) sang 5 đoạn (hạt đỏ) khi EBITDA giảm từ 20 xuống 10 tỷ. | Có (từ [n302_c05_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c05_01.png) phép tính 50/20 = 2,5 lần đổi màu đỏ thành 50/10 = 5 lần ở [n302_c05_09.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c05_09.png), hạt đổi sang màu đỏ và trải dài gấp đôi). | 12 từ ở c05_09 ("ví dụ giả định", "Nợ ròng / EBITDA", "lần", "Không đo thời gian"). | Không có; chữ số và các vạch thước to bản, tương phản cao. | Giống ảnh đạt (n199) | **Đạt** |
| **C06** | 5 khối ma trận 20 tỷ (tổng 100 tỷ EV) biến đổi màu để bóc tách thành 50 tỷ nợ ròng (đỏ) và 50 tỷ vốn chủ sở hữu (xanh ngọc). | Có (từ 5 khối thuần vàng phép nhân 20×5 ở [n302_c06_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c06_01.png) chuyển sang phân nửa đỏ nửa xanh ngọc ở [n302_c06_07.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c06_07.png)). | 9 từ (kể cả nhãn góc: "ví dụ giả định", "Vốn chủ sở hữu", "tỷ"). | Không có; phép tính to, các ô ma trận rõ nét. | Giống ảnh đạt (n199) | **Đạt** |
| **C07** | Biểu đồ cầu nối tiền (waterfall) hạ dần từng bậc từ cột EBITDA +20 tỷ, trừ thuế -2, trừ lãi -4, trừ mua máy -10, trừ vốn lưu động -7 để rơi xuống mức âm 3 tỷ. | Có (cột tiền từ 20 tỷ ở [n302_c07_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c07_01.png) lần lượt giật từng nhịp thác nước hạ xuống vạch âm 3 tỷ ở [n302_c07_11.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c07_11.png), hạt tiền chảy trên các bậc). | 12 từ ở c07_11 ("ví dụ giả định", "EBITDA → tiền", "tỷ", "Trước trả gốc"). | Các số -2, -4, -10, -7 và nhãn "Trước trả gốc" cỡ khoảng 26px hơi nhỏ hơn tiêu đề nhưng vẫn đọc tốt trên nền tương phản. | Giống ảnh đạt (n199) | **Đạt** |
| **C08** | Hai văn bản trừu tượng nối với nhau bằng luồng hạt kiểm tra đối chiếu và kính lúp soi xét các khoản điều chỉnh bất thường. | Có (luồng hạt vàng và xanh ngọc võng xuống di chuyển qua lại giữa hai tài liệu từ [n302_c08_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c08_01.png) sang [n302_c08_08.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c08_08.png)). | 5 từ ("EBITDA điều chỉnh", "Đối chiếu"). | Không có chữ nhỏ; hoàn toàn không có bảng chữ hay đoạn văn gạch đầu dòng. | Giống ảnh đạt (tối giản, thoáng) | **Nhẹ** *(chuyển động chủ yếu là dải hạt và pha sóng, hình tượng trưng trang giấy đứng yên)* |
| **C09** | Ba trụ cột phân tích (biểu đồ cột Lợi nhuận, Nhà xưởng Dòng tiền nhả khói, và ma trận Nợ vay) đứng cạnh nhau liên kết bằng dải hạt tuần hoàn. | Có (khói từ ống khói nhà xưởng cuộn bốc lên, các hạt nối giữa 3 trụ cột di chuyển từ [n302_c09_01.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c09_01.png) sang [n302_c09_06.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c09_06.png)). | 9 từ ("Đọc cùng nhau", "Lợi nhuận", "Dòng tiền", "Nợ vay"). | Không có; chữ lớn rõ ràng. | Giống ảnh đạt (n199) | **Đạt** |

*(Ghi chú: Khung kết [n302_c09_07.png](/Users/macbooktrungnt/Documents/VideoNganHang/xuong_html/n302_ebitda/anh_tinh/v3/n302_c09_07.png) hiển thị đúng logo kênh Chuyện nghề Ngân hàng, nút Đăng ký kênh và 2 ô gợi ý xem tiếp đúng chuẩn YouTube).*

---

### Đối chiếu dữ kiện số học với `du_kien.json`:
- **Chương 1:** EBITDA 20 tỷ (khớp).
- **Chương 3:** Doanh thu 100, Chi phí 80, EBITDA 20, Khấu hao 8, EBIT 12, Lãi vay 4, Thuế 2, LNST 6 (khớp 100%).
- **Chương 4:** Biên EBITDA = 20 / 100 = 20% (khớp 100%).
- **Chương 5:** Nợ vay 60, Tiền 10 -> Nợ ròng 50; Nợ ròng / EBITDA = 50 / 20 = 2,5 lần; khi EBITDA giảm còn 10 thì 50 / 10 = 5 lần (khớp 100%).
- **Chương 6:** EV = 20 × 5 = 100 tỷ; Vốn chủ sở hữu = 100 - 50 = 50 tỷ (khớp 100%).
- **Chương 7:** Cầu nối tiền: 20 - 2 (thuế) - 4 (lãi) - 10 (mua máy) - 7 (tăng VLD) = -3 tỷ thiếu hụt tiền (khớp 100%).

---

### Bước 5. Tổng kết và Kết luận

- **Số chương Nặng:** 0
- **Số chương Vừa:** 0
- **Số chương Nhẹ:** 2 (Chương 3, Chương 8 — chỉ về mật độ hiển thị trung gian và tính chất tượng trưng của hình)
- **Số chương Đạt:** 7 (Chương 1, 2, 4, 5, 6, 7, 9)

**ĐẠT để chạy pha máy**


---
Bản do phiên Antigravity mới (Gemini 3.8 Flash High) trả ra qua agy ngày 03/11/2026. Chỉ chuyển định dạng liên kết file:// sang đường dẫn tuyệt đối để mở trong Codex; giữ nguyên nhận xét. Bản gốc ở `san_pham/2026.11.03.EBITDA_la_gi/tai_nguyen/ban_nhap/2026.11.03.ebitda_soat_doc_lap.md`.
