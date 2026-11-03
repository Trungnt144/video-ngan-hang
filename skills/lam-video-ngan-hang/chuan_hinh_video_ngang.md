# Chuẩn hình video ngang ngân hàng

Đọc file này TRƯỚC khi viết `canh.js` và TRƯỚC khi ghi nhịp (storyboard). Việc dựng hình chạy bằng Gemini 3.8 Flash qua Antigravity (Trung chốt 03/11/2026): model này viết đúng chữ nhưng hay làm hình thành "slide" (thẻ chữ, bảng chữ nhỏ, không chuyển động). Các luật dưới đây cho máy kiểm được, nên làm theo từng điều và chạy máy đo, không tự khen hình đẹp.

**Bản 2 (03/11/2026, tối).** Sau bản 1, video N301 (vốn lưu động ròng) và N302 (EBITDA) qua hết cổng máy đo và soát độc lập nhưng hình minh hoạ không liên quan tới khái niệm: nhà xưởng bốc khói cho "lấy ngắn nuôi dài", cốc nước cho vốn lưu động ròng, đoạn thẳng hai chấm nghiêng qua lại cho "ba nguyên tắc", hàng chấm chạy dưới các cột EBITDA. Nguyên nhân: bản 1 dặn chép cảnh của n199 (video huy động vốn, nơi bể, vòi, hạt mang đúng nghĩa tiền gửi) rồi đổi nhãn; bảng khuôn tra theo danh từ (doanh nghiệp → nhà xưởng); mục 3b đề xuất hình bể nước; không bước nào hỏi hình có giải thích được khái niệm không. Bản 2 thêm câu cơ chế (luật 1), phép thử tắt tiếng (luật 2), xếp bảng khuôn theo cơ chế (mục 3) và bỏ lời dặn chép cảnh n199.

## 1. Số đo thật của hai video (máy đo `scripts/do_chat_luong_hinh.mjs`, 03/11/2026)

| Chỉ số mỗi chương | n199 huy động vốn (đạt, Trung đã duyệt bản cuối) | n301 vốn lưu động ròng (không đạt) | Ngưỡng cổng |
|---|---|---|---|
| Tỉ lệ khoảng 1 giây có chuyển động thật của hình | 1,00 ở cả 11 chương | 0,15–0,36 | ≥ 0,6 |
| Số từ trên hình cùng lúc (không tính phụ đề), trung vị | 4–11 | 62–196 | ≤ 26 |
| Tỉ lệ chữ cỡ dưới 26 px (quy ra khung 1920 px) | 0–15% | 65–88% | ≤ 25% |

Hai ảnh lưới để so mắt: `tai_san/anh_chuan_hinh/n199_chuan_dat_12_khung.jpg` (đạt) và `tai_san/anh_chuan_hinh/n301_khong_dat_12_khung.jpg` (không đạt). Mở cả hai trước khi dựng. Ảnh n199 là mẫu về độ thoáng, cỡ chữ và lượng chữ; KHÔNG phải mẫu về hình nên vẽ: bể, vòi, hạt của n199 đúng với tiền gửi chảy vào ngân hàng, không đúng với khái niệm khác.

## 2. Tám luật cảnh

1. **Câu cơ chế trước, hình sau.** Trước khi chọn hình, mỗi chương viết một câu nói khái niệm của chương vận hành thế nào bằng các đại lượng cụ thể, ghi vào `nhip.json` (mục 4). Ví dụ: "vốn lưu động ròng là phần tài sản ngắn hạn còn lại sau khi đã đặt đủ nợ ngắn hạn đối diện: 60 − 40 = 20"; "lấy ngắn nuôi dài: khoản nợ phải trả trong 12 tháng được dùng mua máy móc 10 năm mới thu hồi vốn". Hình chính vẽ đúng các đại lượng trong câu đó và quan hệ giữa chúng. Không viết được câu cơ chế thì chưa dựng.
2. **Phép thử tắt tiếng.** Tắt tiếng, chỉ nhìn hình chính và nhãn của nó, người xem phải nói được chương đang giải thích điều gì. Hình chỉ cho biết đang nói về ai (một nhà xưởng, một toà nhà ngân hàng, một người) là không đạt.
3. **Biểu tượng nhân vật chỉ làm phụ.** Nhà xưởng, toà nhà ngân hàng, người, xấp tiền, giấy tờ được đặt cạnh hình cơ chế để nói "của ai", không được làm hình chính.
4. **Chuyển động là sự thay đổi của chính đại lượng đang nói:** cột cao lên hay thấp xuống, khối dời từ cột này sang cột kia, đoạn thanh mọc dần, số chạy, mốc thời gian đến hạn. Không thêm chuyển động trang trí: vòng sáng phập phồng, chấm chạy không mang giá trị, vật lắc qua lại, hàng chấm dưới cột, đường nét đứt không nối hai thứ có quan hệ. Mỗi vật trên hình phải trả lời được câu hỏi "vật này là đại lượng nào".
5. **Chữ trên hình tối đa 12 từ cùng lúc.** Mỗi nhãn một đến năm từ, gọi đúng tên phần đang vẽ ("nợ ngắn hạn", "máy móc 10 năm", "khấu hao") kèm con số. Câu giải thích đã nằm trong lời đọc và phụ đề; không chép lên hình. Bỏ nhãn tới mức hình mất nghĩa cũng sai như thẻ chữ dày.
6. **Không thẻ có đoạn văn, danh sách gạch đầu dòng, bảng chữ nhỏ.** Ý không có số (nguyên tắc, điều luật, điều cần nhớ) dùng khuôn danh sách hoặc khuôn trích luật ở mục 3: từng dòng ngắn hiện theo lời đọc, vẫn trong giới hạn 12 từ. Không thay bằng một hình trừu tượng không ai đọc ra nghĩa.
7. **Cỡ chữ:** nhãn chính nên từ 32 px trở lên, số liệu 48 px trở lên (mục tiêu đặt theo cảm nhận, chưa đo ở n199); cổng máy chỉ chặn khi quá 25% ký tự nằm trong chữ dưới 26 px. Dải phụ đề (y > 900) giữ nguyên của khuôn.
8. **Chất liệu ghi trong kịch bản phải đúng thật.** CL-14 là mô phỏng đồ hoạ theo số liệu, không phải thẻ chữ có viền. Ghi "CL-14" mà dựng thẻ chữ là sai nhãn.

## 3. Cơ chế cần cho thấy → khuôn trong kho (`tai_san/kho_hinh_chung/ngan_hang/` và `chung/`)

Tra theo cơ chế trong câu cơ chế, không tra theo danh từ có trong lời. Trước khi gọi một khuôn, mở 10 dòng đầu file của nó để đọc cách gọi (`KHO.<tên>({...})`).

| Cơ chế của chương | Khuôn | Ví dụ khái niệm |
|---|---|---|
| Hai vế cân nhau, phần chênh giữa hai ngăn đối diện | `ngan_hang/khuon_bang_can_doi.js` (ngăn cao theo giá trị, tô sáng ngăn, giá trị đổi theo thời gian) | vốn lưu động ròng, vốn chủ sở hữu = tài sản − nợ |
| Từ một con số cộng, trừ từng khoản ra con số khác | `ngan_hang/khuon_vi_du_tinh_tien.js`, `chung/khuon_cong_thuc.js` | EBITDA từ lợi nhuận sau thuế, EBITDA về tiền thực nhận |
| Một phần trên tổng; số lần một đại lượng chứa đại lượng khác | `chung/thanh_chia_doan.js` (thanh chia đoạn theo tỉ lệ) | biên EBITDA 20%: thanh doanh thu 100, đoạn 20 tô màu; nợ ròng / EBITDA 2,5 lần: thanh nợ ròng chia thành các đoạn dài bằng EBITDA |
| Hai thứ khác nhau về thời gian: kỳ hạn, ngày đến hạn | `chung/truc_thoi_gian.js`, `ngan_hang/lich_tra_no.js` | lấy ngắn nuôi dài, lịch trả gốc lãi |
| Tiền đi từ bên này sang bên kia | `chung/so_do_dong_tien.js`, `ngan_hang/khuon_trung_gian.js` | ngân hàng trung gian, thanh toán qua nhiều bên |
| Các bước nối tiếp | `chung/khuon_luong_buoc.js`, `ngan_hang/chuoi_gia_tri.js` | quy trình thẩm định; mua nguyên liệu → sản xuất → bán → thu tiền |
| Hai khái niệm hay bị nhầm | `chung/khuon_so_sanh_hai_cot.js` | vốn lưu động ròng và nhu cầu vốn lưu động |
| Danh sách điều cần nhớ, nguyên tắc | `chung/khuon_checklist.js` | ba nguyên tắc cuối video |
| Trích văn bản pháp luật | `ngan_hang/khuon_trich_van_ban_phap_luat.js` | điều luật về dùng vốn sai mục đích |
| Đại lượng đổi theo thời gian | `chung/bieu_do_duong.js` | lãi suất, biên lợi nhuận qua nhiều kỳ |
| So ba nhóm ngân hàng ẩn danh | `ngan_hang/khuon_nhom_an_danh.js` | tỉ trọng nguồn vốn theo nhóm |
| Lượng tiền chảy vào, chảy ra trong một kỳ (chỉ khi khái niệm thật sự là dòng vào, dòng ra) | `chung/binh_chua.js` | tiền gửi vào ngân hàng, quỹ dự phòng |
| Biểu tượng phụ "của ai" (luật 3) | `ngan_hang/nha_xuong.js`, `toa_nha_ngan_hang.js`, `nhan_vat.js`, `tien.js`, `giay_to.js`, `chung_tu.js`, `the_ngan_hang.js`, `ngoi_nha_gia_dinh.js` | đặt cạnh hình cơ chế, không làm hình chính |
| Nhãn "ví dụ giả định" | `chung/nhan_gia_dinh.js` | bắt buộc ở mọi cảnh có số giả định |

**Không chép cảnh của n199.** Phần chép được từ `xuong_html/n199_hoat_dong_huy_dong_von/` là khung trang: `seek(t)`, phụ đề, nhịp, logo, màn hình kết, hàm đếm chữ. Các hàm vẽ cảnh trong `canh.js` của n199 (`be` bể, `voi` vòi, `roi` hạt rơi, `cham` chấm, `toa` toà nhà) vẽ tiền gửi chảy vào ngân hàng; chỉ dùng lại khi câu cơ chế của chương cũng là tiền chảy vào hoặc ra. Không giữ cảnh cũ rồi đổi nhãn. Cơ chế không có khuôn nào hợp thì tự vẽ đúng các đại lượng trong câu cơ chế, ghi lý do vào `SO_VONG_SUA.md`.

## 3b. Câu cơ chế và hình mẫu cho hai nhóm khái niệm đã gặp

| Khái niệm | Câu cơ chế | Hình chính |
|---|---|---|
| Vốn lưu động ròng | Tài sản ngắn hạn 60 đặt đối diện nợ ngắn hạn 40, phần tài sản ngắn hạn còn lại 20 là vốn lưu động ròng | Bảng cân đối hai cột; ngăn tài sản ngắn hạn và ngăn nợ ngắn hạn tô cùng màu, phần chênh 20 tô màu khác và có nhãn |
| Vốn lưu động ròng âm, lấy ngắn nuôi dài | Nợ ngắn hạn tăng 30 để mua máy móc; nợ đến hạn trong 12 tháng, máy móc 10 năm mới thu hồi vốn | Ngăn nợ ngắn hạn cao lên 30, ngăn tài sản dài hạn cao lên 30; trục thời gian dưới hình: mốc trả nợ 12 tháng đến trước mốc thu hồi 10 năm |
| EBITDA | Lợi nhuận sau thuế 6, cộng lại thuế 2, lãi vay 4, khấu hao 8, ra EBITDA 20 | Một cột lợi nhuận 6, các khối thuế, lãi vay, khấu hao lần lượt chồng lên thành cột 20 |
| EBITDA khác tiền thực nhận | Từ EBITDA 20, trừ tiền nằm trong vốn lưu động, thuế đã nộp, lãi đã trả, tiền đầu tư, còn lại tiền thực nhận | Cột 20 bị trừ dần từng khối có nhãn, khối cuối là tiền thực nhận |
| Nợ ròng / EBITDA | Nợ ròng 50 bằng 2,5 lần EBITDA 20: cần khoảng 2,5 năm EBITDA để trả hết nợ | Thanh nợ ròng 50 chia thành hai đoạn dài bằng EBITDA và nửa đoạn |

## 4. Quy trình viết `canh.js` cho Flash (chia nhỏ để không làm cả video một lượt)

1. Viết nhịp (storyboard) trong mảng `nhip` của `nhip.json` trước (mảng viết tay; `<mã>_tao_nhip.py` giữ nguyên khi chạy lại). Mỗi chương một phần tử năm trường: `chuong`, `co_che` (câu cơ chế, luật 1), `hinh_chinh` (vẽ những đại lượng nào, đặt thế nào), `chuyen_dong` (đại lượng nào đổi, lúc câu nào), `khuon` (tên khuôn ở mục 3, hoặc "tự vẽ" kèm lý do). Chương nào ghi "thẻ", "bảng chữ", hình chính là một biểu tượng nhân vật, hoặc `khuon` là hàm vẽ cảnh của n199 (`be`, `roi`, `cham`, `voi`, `toa`) mà câu cơ chế không phải tiền chảy vào, chảy ra, thì viết lại. Ví dụ phải viết lại: nhịp N302 ngày 03/11/2026 ghi `khuon` "roi, cham, be từ n199" cho cả chương tính EBITDA và chương nợ ròng.
2. Dựng MỘT chương một lần, chụp ảnh tĩnh ba mốc (đầu, giữa, cuối chương), nhìn bằng mắt, đạt rồi mới sang chương sau. Không viết cả 8–11 chương rồi chụp một lần.
3. Với mỗi chương vừa dựng, làm phép thử tắt tiếng (luật 2): chỉ nhìn ảnh giữa chương, viết một câu "hình này giải thích …" vào `SO_VONG_SUA.md`, rồi so với `co_che`. Không khớp thì dựng lại chương đó.
4. Sau chương cuối, chạy cổng máy đo (mục 5) và soát độc lập (`mau_soat_doc_lap.md`).

## 5. Cổng máy đo

```bash
node scripts/do_chat_luong_hinh.mjs xuong_html/<mã>_<tên> --buoc 2
```

Phải ra "Tổng: N/N chương đạt" (thoát 0) trước khi ghi phiếu pha máy. Chương không đạt thì sửa chương đó, không đổi ngưỡng. Máy đo chỉ bắt được chuyển động, chữ dày, chữ nhỏ.

**Cờ đo hình (từ 03/11/2026).** Khung trang n199 lắc khung hình, cho nhãn nhấp nhô, nền trôi và chấm chương phập phồng; riêng phần đó đã đủ để máy chấm chuyển động 1,00 cho một cảnh không đổi nội dung (đo N301 giây 170–190: chênh lệch khung 3,0–4,8, ngưỡng 0,35). Vì vậy máy đo đặt `window.__do_hinh = true` trước khi nạp trang, và `canh.js` phải có hằng `DO_HINH` tắt bốn phần đó khi có cờ, kèm `window.__ho_tro_do_hinh = true` (mẫu: tìm "DO_HINH" trong `xuong_html/n199_hoat_dong_huy_dong_von/canh.js`). Trang thiếu cờ thì máy đo thoát 2. Không xoá, không đổi cờ này; xuất video không đặt cờ nên hình xuất ra không đổi.

Số đo trước và sau khi có cờ (03/11/2026, `--buoc 2`): n199 11/11 → 11/11 (chuyển động thấp nhất 0,63 ở chương 4); N301 8/8 → 2/8; N302 9/9 → 4/9. Máy vẫn tính chuyển động trang trí nằm trong cảnh (thanh bập bênh chương 8 N301, đường chấm chạy chương 2 N302 vẫn được 1,00). Vì vậy máy đo đạt không chứng tỏ hình có chuyển động theo số liệu hay có đúng khái niệm; hai việc đó do phép thử tắt tiếng, soát độc lập và Trung xem.
