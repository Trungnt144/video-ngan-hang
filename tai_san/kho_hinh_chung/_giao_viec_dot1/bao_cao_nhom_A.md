# Báo cáo nhóm A (khuôn bố cục) — kho hình dùng chung đợt 1, chiều 29/10/2026

Bắt đầu: 29/10/2026 14:15. Báo cáo trung gian, ghi thêm sau mỗi hình.

## 1. khuon_vi_du_tinh_tien_tung_buoc — XONG (14:22), lần chụp cuối 0 lỗi

```json
{ "ten": "khuon_vi_du_tinh_tien_tung_buoc", "file": ["ngan_hang/khuon_vi_du_tinh_tien.js"], "can": ["kho_nen", "nhan_gia_dinh"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "buoc": "mảng { nhan, bieu_thuc (chuỗi tách theo dấu cách, toán tử × ÷ + − = % tự tô màu nhấn; hoặc mảng {t, nhan:true}), ket_qua (số, chạy tới), ket_qua_chu (chuỗi hiện sẵn), dang 'tien' (mặc định, KHO.soTien) | 'so' | 'phan_tram', don_vi, thap_phan, buoc_dem, dem:false }",
    "to_sang": "chỉ số bước tô sáng, mặc định bước cuối; -1 không tô",
    "tieu_de": "chữ lớn trên thẻ (800, 60 px)", "dong_nho": "dòng nhỏ có vạch nhấn như khuôn mở đầu", "gia_thiet": "dòng dữ kiện đầu thẻ, xuống dòng được",
    "chu_thich": "dòng chú thích cuối thẻ (26 px)", "chu_gia_dinh": "chữ nhãn giả định, mặc định 'ví dụ giả định' (luôn hiện)",
    "x, y, rong": "vùng đặt, mặc định 140, 90, 1640 (cùng lề khuôn mở đầu); cao tự theo nội dung",
    "co_bieu_thuc": "40", "co_ket_qua": "48 (dòng tô sáng ×1,25 = 60); tự hạ cỡ khi chuỗi quá dài",
    "vao": "giây bắt đầu (0)", "tinh": "true hiện đủ", "moc_hien": "mảng giây bắt đầu từng bước", "moc_ket": "giây tô sáng" },
  "moc": "{ x, y, rong, moc_buoc: [giây từng bước], to_sang: giây tô sáng, xong }",
  "nguon_gom": "dựng mới cho HTML; cách hiện dần từng mảnh theo xuong_dai/n82_han_muc_quay_vong/src/Chung.tsx:96-113 (PhepTinh)",
  "loi_con_lai": "",
  "ghi_chu": "Mỗi bước: số thứ tự tròn, nhãn 28 px, biểu thức 40 px hiện từng mảnh, dấu bằng, kết quả 48 px chạy số (bước làm tròn 3 chữ số có nghĩa) rồi dừng đúng chuỗi cuối. Dòng tô sáng: nền nhạt quét từ trái kèm vạch nhấn (phẳng) hoặc gạch chéo bút chì (nét tay); kết quả 60 px màu nhấn, gạch dưới (phẳng) hoặc vòng khoanh bút chì vẽ dần (nét tay); sau khi xong nền tô sáng thở nhẹ. Cột kết quả đo trước theo chuỗi dài nhất cộng chỗ hai chữ số cho số đang chạy. Khung trang trí nét tay đo kích thước sau khi gắn vào trang (lần seek đầu), vẽ lại khi kích thước đổi. Ô mẫu: lãi tháng đầu khoản vay 1,2 tỷ đồng lãi 9%/năm (9 triệu đồng); tổng lãi ân hạn 3 tháng (27 triệu đồng), nhãn bước và dữ kiện dài để thấy xuống dòng." }
```

## 2. khuon_trich_van_ban_phap_luat — XONG (14:28), lần chụp cuối 0 lỗi

```json
{ "ten": "khuon_trich_van_ban_phap_luat", "file": ["ngan_hang/khuon_trich_van_ban_phap_luat.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "so_hieu": "số hiệu văn bản, viên nhấn (ví dụ 'Thông tư 39/2016/TT-NHNN')", "hieu_luc": "chip ngày hiệu lực", "co_quan": "cơ quan ban hành",
    "ten": "tên văn bản, xuống dòng được", "dieu": "dòng điều khoản (màu nhấn)", "doan": "chuỗi hoặc mảng đoạn trích nguyên văn",
    "to_sang": "mảng cụm cần tô: chuỗi trùng nguyên văn trong doan, hoặc { chu, moc } với moc là giây bắt đầu tô", "moc_hien": "mảng giây tô từng cụm (thay moc trong to_sang)",
    "diu": "true (mặc định): chữ ngoài cụm tô dịu xuống khi bắt đầu tô", "nguon": "dòng ghi nguồn cuối thẻ (24 px)",
    "dong_nho, tieu_de": "đầu trang như khuôn mở đầu", "x, y, rong": "mặc định 140, 90, 1640; cao tự theo nội dung", "co_trich": "36",
    "vao": "giây bắt đầu (0)", "tinh": "true hiện đủ" },
  "moc": "{ x, y, rong, to_sang: [giây bắt đầu tô từng cụm], xong }",
  "nguon_gom": "xuong_html/n96_tai_san_bao_dam/trang.html:51-59 (.the-luat: thẻ tiêu đề, hàng khoản có nền tô khi đang đọc); dựng lại thành khuôn có tham số",
  "loi_con_lai": "",
  "ghi_chu": "Đầu thẻ: biểu tượng trang văn bản gấp góc (vẽ, không chữ, không biểu trưng cơ quan thật), viên số hiệu, chip hiệu lực, cơ quan, tên văn bản; vạch ngăn; điều khoản; đoạn trích có vạch dọc màu nhấn. Cụm tô: nền tô quét theo từng dòng (đo getClientRects sau khi gắn vào trang, đo khi đoạn chưa dịch), nét tay thêm gạch chân bút chì vẽ dần và mép nền run. Đoạn trích tách mỗi từ một span để bộ kiểm chữ không báo nhầm chữ đè khi nút chữ trải hai dòng. Ô mẫu dùng nguyên văn khoản 1 Điều 2 Thông tư 39/2016/TT-NHNN (đối chiếu thuvienphapluat.vn, luatvietnam.vn ngày 29/10/2026), khổ 1640 và khổ hẹp 1180 px. Phiên dựng video vẫn phải tự kiểm chứng nguyên văn và bản hợp nhất mới nhất (Thông tư 39 đã được sửa đổi)." }
```

## 3. khuon_canh_ket_tom_lai — XONG (14:32), lần chụp cuối 0 lỗi

```json
{ "ten": "khuon_canh_ket_tom_lai", "file": ["chung/khuon_canh_ket.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "y_chinh": "mảng 2–4 câu ý cần nhớ, mỗi ý một thẻ có số",
    "tieu_de": "mặc định 'Tóm lại' (800, 72 px)", "ten_loat": "dòng nhỏ có vạch nhấn ở trên cùng, như khuôn mở đầu",
    "tro_sang": "chuỗi tên video tiếp theo, hoặc { nhan: 'Xem tiếp', ten }",
    "x, y, rong, cao": "vùng đặt, mặc định 0, 0, 1920, 900 (chừa dải phụ đề)", "co_y": "36, tự hạ tới 30 khi một ý quá 5 dòng",
    "vao": "giây bắt đầu (0)", "tinh": "true hiện đủ", "moc_hien": "mảng giây hiện từng ý", "moc_tro": "giây hiện dòng trỏ" },
  "moc": "{ x, y, rong, cao, moc_y: [giây từng ý], tro: giây dòng trỏ, xong }",
  "nguon_gom": "dựng mới, cùng ngôn ngữ hình với chung/khuon_canh_mo_dau.js",
  "loi_con_lai": "",
  "ghi_chu": "Dòng tên loạt cố định ở 10% chiều cao như khuôn mở đầu; tiêu đề, hàng thẻ và dòng trỏ căn giữa theo chiều dọc phần còn lại. Thẻ mọc lên bằng lò xo, số nảy, chữ mọc từng từ. Dòng trỏ: nhãn nhỏ, mũi tên vẽ, viên tên video viền màu nhấn. Sau mốc xong: mũi tên nhích ngang, vòng quanh số lan ra rồi mờ (phẳng) hoặc nét vòng nhạt đi nhẹ (nét tay), lệch pha từng thẻ; đủ cho đoạn giữ khung cuối 2 giây. Ô mẫu: ba ý ngắn video ân hạn (khung 7,5 s là lúc giữ khung cuối) và bốn ý dài video khế ước nhận nợ, tên video tiếp theo dài." }
```

## 4. khuon_so_sanh_hai_cot — XONG (14:37), lần chụp cuối 0 lỗi

```json
{ "ten": "khuon_so_sanh_hai_cot", "file": ["chung/khuon_so_sanh_hai_cot.js"], "can": ["kho_nen", "bo_bieu_tuong_co_ban"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "cot": "mảng 2–4 đầu cột: chuỗi hoặc { ten, phu (dòng nhỏ dưới tên), khoa_mau (mặc định theo thứ tự nhan, chu, canh_bao, tot) }",
    "hang": "mảng hàng { nhan (nhãn hàng; có ở ít nhất một hàng thì thêm cột nhãn bên trái), o: [ô từng cột: chuỗi hoặc { chu, dau: 'tich' | 'gach' | 'hoi' | 'cham_than' }] }",
    "to_sang": "mảng chỉ số hàng được khung tô sáng", "rong_nhan": "bề ngang cột nhãn, mặc định 300",
    "dong_nho, tieu_de": "đầu trang như khuôn mở đầu", "x, y, rong": "mặc định 140, 90, 1640; cao tự theo nội dung",
    "co_o": "cỡ chữ ô, 32 (28 khi 4 cột)", "vao": "giây bắt đầu (0)", "tinh": "true hiện đủ",
    "moc_cot": "giây hiện đầu cột", "moc_hien": "mảng giây hiện từng hàng", "moc_to": "giây bắt đầu tô hàng" },
  "moc": "{ x, y, rong, cot: giây đầu cột, moc_hang: [giây từng hàng], xong }",
  "nguon_gom": "dựng mới",
  "loi_con_lai": "",
  "ghi_chu": "Lưới CSS (cột nhãn tuỳ chọn + 2–4 cột), hàng thẳng nhau giữa các cột. Phẳng: đầu cột nền màu, chữ trắng (nền tự làm đậm tới tương phản 4,5), thân cột là hình chữ nhật bo góc có bóng vẽ trong SVG sau lưới. Nét tay: thân cột viền bút chì, đầu cột gạch chéo nhạt màu cột, gạch chân bút chì vẽ dần, chữ đầu cột màu cột. Hàng hiện dần: chữ trượt vào từng ô lệch 0,12 s, dấu của bộ biểu tượng nảy vào; hàng to_sang có khung màu nhấn (phẳng: thở nhẹ sau khi xong; nét tay: vẽ dần). Ô mẫu: hai cột lãi suất cố định và thả nổi có dấu; bảng cột nhãn và ba cột hợp đồng tín dụng, khế ước nhận nợ, lịch trả nợ, ô chữ dài xuống dòng." }
```

## 5. khuon_checklist_dieu_can_luu_y — XONG (14:39), lần chụp cuối 0 lỗi

```json
{ "ten": "khuon_checklist_dieu_can_luu_y", "file": ["chung/khuon_checklist.js"], "can": ["kho_nen", "bo_bieu_tuong_co_ban"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "muc": "mảng dòng: chuỗi hoặc { chu, phu (dòng giải thích 28 px), dau: 'tich' (mặc định) | 'gach' | 'cham_than' | 'hoi', khoa_mau }",
    "cot": "1 hoặc 2 cột (mặc định 1; tự 2 khi hơn 5 dòng), xếp hết cột trái mới sang cột phải",
    "dong_nho, tieu_de": "đầu trang như khuôn mở đầu", "x, y, rong": "mặc định 140, 90, 1640; cao tự theo nội dung", "co_chu": "36",
    "vao": "giây bắt đầu (0)", "tinh": "true hiện đủ", "moc_hien": "mảng giây hiện từng dòng", "moc_dau": "mảng giây vẽ dấu từng dòng (mặc định 0,6 s sau khi dòng hiện)" },
  "moc": "{ x, y, rong, moc_dong: [giây từng dòng], moc_dau: [giây từng dấu], xong }",
  "nguon_gom": "dựng mới",
  "loi_con_lai": "",
  "ghi_chu": "Mỗi dòng: ô vuông bo góc (phẳng) hoặc ô bút chì nền loang (nét tay), dấu lấy từ KHO.bo_bieu_tuong_co_ban với nen false (dấu tích to vượt góc ô, các dấu khác nằm trong ô). Dòng trượt vào; khi dấu vẽ, ô tô màu dấu nhạt, viền ô nảy nhẹ (đổi kích thước hình chữ nhật, không phóng chữ), chữ dòng chuyển từ màu phụ sang màu chính. Ô mẫu: bốn dòng đủ bốn loại dấu có dòng giải thích; hai cột bảy dòng hồ sơ giải ngân, có dòng chữ dài xuống dòng." }
```

## 6. khuon_luong_cac_buoc — XONG (14:46), lần chụp cuối 0 lỗi

```json
{ "ten": "khuon_luong_cac_buoc", "file": ["chung/khuon_luong_buoc.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "buoc": "mảng bước: chuỗi hoặc { ten, mo_ta (dòng giải thích 28 px), vai (chip nhỏ: ai làm, ví dụ 'Khách hàng') }",
    "bo_cuc": "'ngang' (mặc định khi tới 5 bước) | 'doc'", "sang_het": "true: khi xong mọi ô cùng sáng (mặc định chỉ giữ sáng ô cuối)",
    "dong_nho, tieu_de": "đầu trang như khuôn mở đầu", "x, y, rong": "mặc định 140, 90, 1640; cao tự theo nội dung",
    "vao": "giây bắt đầu (0)", "tinh": "true hiện đủ, sáng ô cuối", "moc_hien": "mảng giây hiện và làm sáng từng bước" },
  "moc": "{ x, y, rong, moc_buoc: [giây từng bước], xong }",
  "nguon_gom": "dựng mới",
  "loi_con_lai": "",
  "ghi_chu": "Ô bước: số tròn, tên 800, dòng giải thích, chip vai. Thân ô và mũi tên vẽ trong SVG sau khi đo vị trí ô (sau khi gắn vào trang). Ô hiện bằng lò xo; ô đang nói sáng lên (viền màu nhấn, nền nhạt hoặc gạch chéo bút chì, nhấc 10 px), sáng tắt khi ô sau tới. Mũi tên vẽ dần ngay trước khi ô sau hiện; sau mốc xong nét thân thành gạch đứt trượt theo chiều luồng. Bố cục ngang 5 bước mỗi ô khoảng 270 px nên tên và giải thích xuống 2–4 dòng; giải thích dài hơn nên dùng bố cục dọc. Bố cục dọc 4 bước có đầu trang cao tới khoảng y 890, sát dải phụ đề: 5 bước dọc thì bỏ tiêu đề hoặc rút giải thích. Ô mẫu: 5 bước thủ tục giải ngân (ngang, có chip vai); 4 bước điều chỉnh lãi suất thả nổi (dọc, khổ 1300, sang_het)." }
```

## Tổng kết nhóm A

Giờ bắt đầu 14:15, giờ xong 14:47 (khoảng 32 phút). Sáu hình xong, lần chụp cuối mỗi hình 0 lỗi trong `ket_qua.json` (hình 1 và 2 được chụp lại lần cuối lúc 14:44 sau khi sửa hàm góc bo nét tay dùng chung). Không có hình dở.

Hàm nội bộ lặp lại trong cả sáu file, nên gom vào `kho_nen.js`: `duTuongPhan(mau, nen, nguong)` (đã có bản trùng trong khuon_canh_mo_dau.js và nhan_gia_dinh.js); `diemHop(x, y, w, h, r, buoc)` điểm viền hộp bo góc cho `duongTay`; `gachHop(x, y, w, h, buoc, hat)` gạch chéo bút chì tô kín hộp; `vongTay(cx, cy, rx, ry, hat)` vòng khoanh bút chì; `veVienTay(svg, w, h, r, m, nen, hat)` viền thẻ bút chì có bóng lệch và nền loang; `lopSvg(cha)` lớp SVG phủ kín phần tử; `khiDoiCo(el, fn)` vẽ lại trang trí khi kích thước phần tử đổi (đo sau khi gắn vào trang); `datTu`, `hienTu` chữ mọc từng từ (trùng khuôn mở đầu); `dauTrang(cha, m, nen, dongNho, tieuDe, co)` dòng tên loạt có vạch nhấn và tiêu đề lớn, để mọi khuôn cùng một đầu trang.

Ghi chú cho phiên giữ kho: bộ kiểm chữ `KHO.kiemChu` lấy khung bao của cả nút chữ; nút chữ nội dòng trải hai dòng có khung phủ cả hai dòng nên báo nhầm chữ đè với chữ bên cạnh. Khuôn trích văn bản tránh bằng cách tách mỗi từ một span; nên ghi điều này vào README hoặc cho kiemChu đo theo getClientRects từng dòng.
