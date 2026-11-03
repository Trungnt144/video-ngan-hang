# Duyệt 7 hình dở của lượt đêm 29/10/2026 (phiên giữ kho, chiều 29/10/2026)

Bảy hình do tác tử viết trước lệnh dừng 05:10, chưa có khối báo cáo. Phiên giữ kho chụp lại ảnh mẫu bằng `chup_mau.mjs` 1.1, soát theo bảng kiểm mục 9 module 07, rồi viết khối dưới từ dòng đầu của từng file. Tham số chi tiết: đọc phần chú thích đầu file.

```json
{ "ten": "toa_nha_ngan_hang", "file": ["ngan_hang/toa_nha_ngan_hang.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "loai": "tru_so (440×400) | chi_nhanh (360×260) | hoi_so (440×640)", "nhan": "chữ trên biển, mặc định 'Ngân hàng A'", "co": "tỉ lệ", "vao": "giây bắt đầu mọc (-1 hiện đủ)", "tinh": "true hiện đủ", "hat": "hạt giống nét tay" },
  "moc": "day, dinh, tam, trai, phai, cua, bien (đã nhân co)", "nguon_gom": "xuong_html/n87_chung_chi_tien_gui/trang.html:103 (building)", "loi_con_lai": "",
  "ghi_chu": "Gốc ở giữa chân toà nhà. Hội sở có vệt sáng lướt mặt kính sau khi vào. Biển chi nhánh chữ nhỏ (khoảng 22 px ở co 1): chữ dài nên dùng co ≥ 1,2." }
```

```json
{ "ten": "khach_hang_ca_nhan", "file": ["ngan_hang/nhan_vat.js"], "can": ["kho_nen"], "phien_ban": "1.1",
  "tham_so": { "kieu": "phang | net_tay", "vai": "khach_hang | can_bo_tin_dung | giao_dich_vien | chu_doanh_nghiep", "tu_the": "dung | chi_tay | cam_giay | suy_nghi", "huong": "1 | -1", "toc": "ngan | dai", "nhan": "chữ dưới chân", "co": "tỉ lệ, cao chuẩn 362", "vao": "giây xuất hiện", "moc_tu_the": "giây chuyển tư thế", "tinh": "true hiện đủ", "hat": "hạt giống nét tay" },
  "moc": "day, dinh, dau, nguc, tay, dau_chi, giay, nhan, tren_dau (đã nhân co và hướng)", "nguon_gom": "xuong_html/n87_chung_chi_tien_gui/trang.html:102 (person)", "loi_con_lai": "",
  "ghi_chu": "Bí danh KHO.nhan_vat. 1.1 (29/10/2026, phiên giữ kho): vẽ đầu sau thân để cổ nằm dưới cằm; bản 1.0 cổ đè lên mặt thành ô vuông như râu. Thở nhẹ chu kỳ 3,2 giây; chi_tay chớp tay mỗi 2,4 giây." }
```

```json
{ "ten": "phu_de_chay_chu", "file": ["chung/phu_de_chay_chu.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "cau": "[{chu, t, den, tu:[{chu,t,den}]}] (nhận bd/kt)", "chuong": "[{cau:[...]}] theo thoi_gian.json", "co": "38, tự hạ tới co_toi_thieu 32", "rong": "1720", "rong_mot_dong": "1560", "day": "1040", "lech": "giây cộng vào t trước khi tra mốc" },
  "moc": "tren (900), day, trang", "nguon_gom": "xuong_html/2026.10.28_cic_la_gi/trang.html:1087-1146", "loi_con_lai": "",
  "ghi_chu": "Dải dưới 900–1080; hình của cảnh không đặt xuống dưới moc.tren." }
```

```json
{ "ten": "nhan_gia_dinh", "file": ["chung/nhan_gia_dinh.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "chu": "mặc định 'ví dụ giả định'", "bien_the": "nhan | goc | kem_so", "x, y": "góc trên trái", "co": "24", "so | gia_tri": "kem_so: chuỗi sẵn hoặc số đếm lên 0,9 s", "dang": "tien | so", "don_vi": "", "nhan_so": "dòng nhỏ trên con số", "co_so": "64", "mau_so": "khoá màu con số", "vao": "giây hiện", "tinh": "true hiện đủ" },
  "moc": "x, y, rong, cao, nhan", "nguon_gom": "chọn từ 7 bản lô 1 (N82 NhanMinhHoa, N122 NhanGiaDinh, N96, N108)", "loi_con_lai": "",
  "ghi_chu": "Viền đứt nét bo tròn, chữ thường cỡ 24 màu chu_phu." }
```

```json
{ "ten": "truc_thoi_gian", "file": ["chung/truc_thoi_gian.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "rong": "1400", "tu, den": "giá trị đầu, cuối trục", "vach": "{buoc, nhan, gia_tri}", "moc": "[{gia_tri, nhan, nhan_phu, manh, mau, vach_doc, hien}]", "doan": "[{tu, den, nhan, mau, tang, hien}]", "ngoac": "[{tu, den, nhan, vi_tri, tang, hien}]", "thanh": "{tu, khoa:[{t, gia_tri}], nhan, mau}", "vao": "giây bắt đầu", "tinh": "true hiện đủ" },
  "moc": "dau, cuoi, cac_moc, doan, dinh_thanh; hàm xCua(v)", "nguon_gom": "xuong_dai/no_nhom_1_den_5/src/Canh5678.tsx:57, Canh1234.tsx:64 và :146-170", "loi_con_lai": "",
  "ghi_chu": "Kèm KHO.lich_thang (lịch một tháng: ngày đến hạn, dải quá hạn, khoanh ngày). Mốc chạy 'Hôm nay' khi còn ở đầu trục có lúc đè nhãn mốc đầu: trang nên đặt nhãn mốc chạy ở tầng trên hoặc cho hiện sau khi rời mốc đầu." }
```

```json
{ "ten": "thanh_ngang_chia_doan", "file": ["chung/thanh_chia_doan.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "rong": "1200", "cao": "64", "tong": "giá trị ứng cả chiều dài", "doan": "[{gia_tri | khoa:[{t, gia_tri}], nhan, so, mau, to: dac|nhat, hien}]", "tran": "{gia_tri, nhan}", "tieu_de": "", "dinh_dang": "hàm định dạng số", "vao": "giây bắt đầu", "tinh": "true hiện đủ" },
  "moc": "dau, cuoi, doan, ranh, tran (cập nhật theo t)", "nguon_gom": "xuong_dai/n82_han_muc_quay_vong/src/Chung.tsx:264-273", "loi_con_lai": "",
  "ghi_chu": "Nhãn đoạn hẹp tự đưa ra ngoài, xếp tầng, có đường dẫn. Dùng cho hạn mức, gốc/lãi/phí, lãi cơ sở + biên độ." }
```

```json
{ "ten": "khuon_canh_mo_dau_cau_hoi", "file": ["chung/khuon_canh_mo_dau.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "bien_the": "cau_hoi | gach_nua_cau", "cau": "câu hỏi", "cau_dau, cau_sai, cau_dung": "biến thể gạch", "thuat_ngu": "", "ten_loat": "dòng nhỏ trên cùng", "nhan_sai": "'Hiểu lầm thường gặp'", "x, y, rong, cao": "0, 0, 1920, 900", "co": "84, tự hạ tới 56", "vao": "giây bắt đầu", "tinh": "true hiện đủ", "moc_hien": "{loat, thuat_ngu, cau, gach, dung}" },
  "moc": "cau [x,y,rong,cao], thuat_ngu [x,y], xong (giây mọi phần đã hiện)", "nguon_gom": "dựng mới", "loi_con_lai": "",
  "ghi_chu": "Chữ câu hỏi hiện theo từng từ; vòng tròn bên phải vẽ dấu hỏi. Chừa dải phụ đề 900–1080." }
```
