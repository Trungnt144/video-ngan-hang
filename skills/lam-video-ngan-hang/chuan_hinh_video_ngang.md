# Chuẩn hình video ngang ngân hàng

Đọc file này TRƯỚC khi viết `canh.js` và TRƯỚC khi ghi nhịp (storyboard). Việc dựng hình chạy bằng Gemini 3.8 Flash qua Antigravity (Trung chốt 03/11/2026): model này viết đúng chữ nhưng hay làm hình thành "slide" (thẻ chữ, bảng chữ nhỏ, không chuyển động). Các luật dưới đây cho máy kiểm được, nên làm theo từng điều và chạy máy đo, không tự khen hình đẹp.

## 1. Số đo thật của hai video (máy đo `scripts/do_chat_luong_hinh.mjs`, 03/11/2026)

| Chỉ số mỗi chương | n199 huy động vốn (đạt, Trung đã duyệt bản cuối) | n301 vốn lưu động ròng (không đạt) | Ngưỡng cổng |
|---|---|---|---|
| Tỉ lệ khoảng 1 giây có chuyển động thật của hình | 1,00 ở cả 11 chương | 0,15–0,36 | ≥ 0,6 |
| Số từ trên hình cùng lúc (không tính phụ đề), trung vị | 4–11 | 62–196 | ≤ 26 |
| Tỉ lệ chữ cỡ dưới 26 px (quy ra khung 1920 px) | 0–15% | 65–88% | ≤ 25% |

Hai ảnh lưới để so mắt: `tai_san/anh_chuan_hinh/n199_chuan_dat_12_khung.jpg` (đạt) và `tai_san/anh_chuan_hinh/n301_khong_dat_12_khung.jpg` (không đạt). Mở cả hai trước khi dựng.

## 2. Sáu luật cảnh

1. **Một chương, một hình chính chuyển động theo số liệu.** Hình chính là thứ có số: bể đầy dần, hạt tiền rơi và dồn lại, cột cao dần, thanh trượt trên trục thời gian, số chạy. Không phải thẻ chữ.
2. **Chữ trên hình tối đa 12 từ cùng lúc**: nhãn một đến ba từ và con số. Câu giải thích đã nằm trong lời đọc và phụ đề; không chép lại lên hình. Ý nhiều thì tách thành nhiều cảnh nối nhau, mỗi cảnh một ý.
3. **Không thẻ có đoạn văn, danh sách gạch đầu dòng, bảng chữ nhỏ.** Cần liệt kê thì mỗi mục hiện lần lượt thành một vật có hình (hạt, khối, chấm) kèm nhãn ngắn.
4. **Cỡ chữ:** nhãn chính nên từ 32 px trở lên, số liệu 48 px trở lên (mục tiêu đặt theo cảm nhận, chưa đo ở n199); cổng máy chỉ chặn khi quá 25% ký tự nằm trong chữ dưới 26 px. Dải phụ đề (y > 900) giữ nguyên của khuôn.
5. **Dùng khuôn có sẵn trước khi tự vẽ** (mục 3). Tự vẽ chỉ khi không khuôn nào hợp, và ghi lý do vào `SO_VONG_SUA.md`.
6. **Chất liệu ghi trong kịch bản phải đúng thật.** CL-14 là mô phỏng hạt và bể chứa như n199, không phải thẻ chữ có viền. Ghi "CL-14" mà dựng thẻ chữ là sai nhãn.

## 3. Ý cần diễn đạt → khuôn trong kho (`tai_san/kho_hinh_chung/ngan_hang/` và `chung/`)

Trước khi gọi một khuôn, mở 10 dòng đầu file của nó để đọc cách gọi (`KHO.<tên>({...})`).

| Ý của chương | Khuôn |
|---|---|
| Bảng cân đối kế toán, tài sản và nguồn vốn, ngăn cao theo giá trị | `khuon_bang_can_doi.js` |
| Ví dụ tính tiền từng bước (nhãn, biểu thức, kết quả chạy số) | `khuon_vi_du_tinh_tien.js` |
| Ngân hàng làm trung gian giữa người gửi và người vay | `khuon_trung_gian.js` |
| Trích văn bản pháp luật (số hiệu, điều khoản, đoạn trích) | `khuon_trich_van_ban_phap_luat.js` |
| So sánh ba nhóm ngân hàng ẩn danh | `khuon_nhom_an_danh.js` |
| Lịch trả nợ, gốc và lãi theo kỳ | `lich_tra_no.js` |
| Chuỗi mua nguyên liệu, sản xuất, bán hàng, nhận tiền của doanh nghiệp (vốn lưu động) | `chuoi_gia_tri.js` |
| Hoá đơn, tờ khai, chồng chứng từ | `chung_tu.js` |
| Hợp đồng, khế ước, sổ tiết kiệm, giấy tờ nhà đất | `giay_to.js` |
| Nhà xưởng, doanh nghiệp | `nha_xuong.js` |
| Gia đình và nhu cầu vay | `ngoi_nha_gia_dinh.js`, `nhan_vat.js` |
| Tiền, xấp tiền, xu | `tien.js` |
| Thẻ ngân hàng (trơn) | `the_ngan_hang.js` |
| Toà nhà ngân hàng (không nhận diện thương hiệu) | `toa_nha_ngan_hang.js` |
| Bể chứa nước mức dâng, vòi đổ vào | `chung/binh_chua.js` |
| Nhãn "ví dụ giả định" | `chung/nhan_gia_dinh.js` (bắt buộc ở mọi cảnh có số giả định) |

Khái niệm chưa có khuôn: lấy cảnh gần nhất trong `xuong_html/n199_hoat_dong_huy_dong_von/canh.js` (hàm `roi` hạt rơi, `be` bể, `voi` vòi, `doThi` đồ thị, `soChay` số chạy, `mui` mũi tên, `toa` toà nhà) và đổi nội dung. Không viết lại từ đầu.

## 3b. Thuật ngữ → hình gợi ý (vốn lưu động, thanh khoản)

Hình nên có chuyển động theo dòng tiền: vốn lưu động là bể có vòi vào (thu tiền) và vòi ra (trả nhà cung cấp, trả nợ), mức nước là số dư; tài sản ngắn hạn và nợ ngắn hạn là hai bể nối nhau, chênh lệch là mức nước còn lại; "lấy ngắn nuôi dài" là bể nhỏ bị rút đáy để đổ vào cột to. Đừng vẽ bảng cân đối đầy chữ; dùng `khuon_bang_can_doi.js` với nhãn một đến ba từ.

## 4. Quy trình viết `canh.js` cho Flash (chia nhỏ để không làm cả video một lượt)

1. Viết nhịp (storyboard) trong `nhip.json` trước: mỗi chương ghi một dòng "hình chính = …, chuyển động = …, khuôn = …". Chương nào ghi "thẻ", "bảng chữ" thì viết lại.
2. Dựng MỘT chương một lần, chụp ảnh tĩnh ba mốc (đầu, giữa, cuối chương), nhìn bằng mắt, đạt rồi mới sang chương sau. Không viết cả 8–11 chương rồi chụp một lần.
3. Sau chương cuối, chạy cổng máy đo (mục 5) và soát độc lập (`mau_soat_doc_lap.md`).

## 5. Cổng máy đo

```bash
node scripts/do_chat_luong_hinh.mjs xuong_html/<mã>_<tên> --buoc 2
```

Phải ra "Tổng: N/N chương đạt" (thoát 0) trước khi ghi phiếu pha máy. Chương không đạt thì sửa chương đó, không đổi ngưỡng. Máy đo chỉ bắt được chuyển động, chữ dày, chữ nhỏ; hình có đẹp, có đúng ý hay không vẫn phải do soát độc lập và Trung xem.
