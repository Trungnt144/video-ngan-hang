# Báo cáo nhóm B (vật thể 2D, nhân vật, giao diện) — kho hình dùng chung đợt 1

Bắt đầu: 29/10/2026 04:53. Báo cáo trung gian, ghi thêm sau mỗi 2–3 hình.

## 1. bo_bieu_tuong_co_ban — XONG (05:10), lần chụp cuối 0 lỗi

```json
{ "ten": "bo_bieu_tuong_co_ban", "file": ["chung/bieu_tuong.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "loai": "tich | gach | hoi | cham_than | mui_ten | mui_ten_cong | vong_khoanh (bí danh KHO.dau_tich, dau_gach, dau_hoi, dau_cham_than, mui_ten, mui_ten_cong, vong_khoanh)",
    "co": "tỉ lệ, dấu chuẩn 100×100 quanh gốc", "khoa_mau": "khoá màu nét (mặc định tich→tot, gach→xau, hoi→nhan, cham_than→canh_bao, mũi tên→chu, vòng khoanh→nhan)",
    "nen": "dấu: true đĩa nhạt (mặc định) | 'dac' đĩa đặc dấu trắng | false", "nhan": "chữ kèm (dưới dấu, giữa mũi tên phía võng, trên vòng khoanh)", "co_chu": "cỡ chữ nhãn, mặc định 30",
    "tu, den": "mũi tên: điểm đầu, điểm cuối theo toạ độ cảnh", "cong": "độ võng / chiều dài (mui_ten_cong mặc định 0,28; âm võng phía kia)", "net_dut": "true nét đứt", "hai_dau": "true hai đầu", "day": "độ dày nét",
    "hop": "vòng khoanh: {x,y,w,h} hoặc [x,y,w,h] theo toạ độ cảnh", "le": "khoảng hở quanh hộp, mặc định 18",
    "vao": "giây bắt đầu vẽ (-1 hiện đủ)", "tinh": "true hiện đủ", "dai": "giây vẽ nét", "hat": "hạt giống nét tay" },
  "moc": "dấu: tam, dinh, day, trai, phai, nhan (đã nhân co); mũi tên: dau, cuoi, giua, nhan; vòng khoanh: tam, tren, duoi, trai, phai, nhan",
  "nguon_gom": "xuong_html/n87_chung_chi_tien_gui/trang.html:104-105 (check, cross); cách vẽ dần theo xuong_dai/n82_han_muc_quay_vong/src/Chung.tsx:184-203",
  "loi_con_lai": "",
  "ghi_chu": "Dấu nảy vào bằng lò xo rồi vẽ nét; chấm của dấu hỏi, chấm than nảy sau. Mũi tên và vòng khoanh đặt translate(0 0) vì đã theo toạ độ cảnh. Nét tay: nét đôi lệch hạt giống, đĩa tô loang và gạch chéo, vòng khoanh xoáy vượt quá điểm đầu. Vẽ dần dùng pathLength=1 nên tạo được khi phần tử chưa gắn vào trang." }
```

## Lượt 2 (bắt đầu 29/10/2026 14:15)

## 2. hop_dong_giay_to — XONG (14:25), lần chụp cuối 0 lỗi

```json
{ "ten": "hop_dong_giay_to", "file": ["ngan_hang/giay_to.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "loai": "hop_dong_tin_dung (480×660) | khe_uoc (480×600, dải đầu trang) | so_tiet_kiem (bìa sổ 380×520) | chung_chi_tien_gui (ngang 680×460, viền hoa văn) | giay_chung_nhan_nha_dat (480×660, nền hồng nhạt, sơ đồ thửa đất); bí danh KHO.giay_to",
    "tieu_de, phu_de": "chữ, mặc định theo loại; phu_de false thì bỏ; tiêu đề dài tự thu cỡ (tối thiểu 28) rồi xuống dòng",
    "dong": "mảng dòng nội dung: chuỗi là dòng chữ 28 px (phần trước dấu ':' in nhạt), null là vạch giả lập chữ; bỏ trống thì dùng vạch theo loại; tờ tự cao thêm khi nhiều dòng",
    "to_sang": "số thứ tự dòng hoặc mảng, tô như bút dạ (màu canh_bao)",
    "ben": "mảng { nhan, ten } các bên ký; [] là không ký; mặc định theo loại",
    "dau": "chữ trên vòng con dấu (mặc định 'NGÂN HÀNG A' / 'CƠ QUAN CẤP GIẤY'); false là không dấu",
    "chong": "0–4 tờ xếp chồng phía sau", "truot": "trai | phai | duoi (mặc định) | tren | false",
    "dien_tich": "chữ trong sơ đồ thửa đất (giấy chứng nhận), mặc định '80 m²'",
    "co": "tỉ lệ", "vao": "giây bắt đầu (-1 hiện đủ)", "moc_hien": "mảng giây hiện từng dòng",
    "moc_to_sang, moc_ky, moc_dau": "giây tô sáng, bắt đầu ký, đóng dấu (mặc định nối tiếp nhau)", "tinh": "true hiện đủ", "hat": "hạt giống nét tay và chữ ký" },
  "moc": "tam, tren, duoi, trai, phai, tieu_de, dong (mảng đầu mỗi dòng), to_sang (mép phải dòng tô sáng), ky (mảng tâm chữ ký), dau, rong, cao — đã nhân co; gốc ở tâm tờ",
  "nguon_gom": "xuong_html/n87_chung_chi_tien_gui/trang.html:112-153 (soBia, staple, hopDong, orn, guil, chungChi)",
  "loi_con_lai": "",
  "ghi_chu": "Giấy luôn sáng, mực luôn tối kể cả bảng nền tối (tự chọn mực theo tương phản). Con dấu màu xau, chữ vòng 18 px chạy trên cung 270° (trang trí, gắn data-chong), nện xuống làm tờ nảy nhẹ; chữ ký sinh từ hạt giống, vẽ dần bằng pathLength=1. Ô mẫu đặt sổ tiết kiệm co 0,7 và chứng chỉ co 0,62 để đủ năm loại trong một khung; trong video nên dùng co ≥ 0,9 khi cần đọc chữ. Chưa có: sổ tiết kiệm mở trang trong (bảng gửi, rút, số dư), con dấu tròn cho phép khác hình. Hàm nên gom vào nền móng: boVe (da, cn, tron, vach — cùng mẫu với toa_nha_ngan_hang.js, nhan_vat.js), duongMuot (Catmull-Rom sang Bézier), con dấu tròn có chữ vòng." }
```

## 3. man_hinh_ung_dung — XONG (14:32), lần chụp cuối 0 lỗi

```json
{ "ten": "man_hinh_ung_dung", "file": ["chung/man_hinh.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "khung": "dien_thoai (mặc định, thân 440 × ≥860) | trinh_duyet (1100 × ≥620, hai cột); bí danh KHO.man_hinh",
    "mau_san": "nội dung soạn sẵn: tai_khoan | sao_ke_the (N116: thẻ có chip, dư nợ sao kê, thanh toán tối thiểu, hạn thanh toán) | khoan_vay (dư nợ gốc, kỳ trả tiếp theo, các kỳ đã trả) | trong; các trường dưới ghi đè",
    "tieu_de": "chữ thanh tiêu đề (trình duyệt: tiêu đề lớn cột trái, tự xuống dòng)",
    "the": "{ ten, so } vẽ thẻ số dư thành thẻ tín dụng; false là thẻ thường",
    "so_du": "{ nhan, gia_tri, ghi_chu } — ghi_chu nên là 'Ví dụ giả định'; null là không thẻ",
    "chi_tiet": "mảng [nhãn, giá trị]", "nhan_dong": "tiêu đề danh sách",
    "dong": "mảng { trai, phu, phai, loai: thu | chi | tot | xau | canh_bao } — nhãn dài thì số tiền xuống dòng phụ",
    "nut": "chữ nút hoặc false", "thong_bao": "{ chu, loai: canh_bao | tot | xau | nhan } hoặc false",
    "dia_chi": "chữ thanh địa chỉ (trình duyệt)", "nhan_mo_phong": "chữ nhãn 'Giao diện mô phỏng' hoặc false",
    "x, y": "góc trên trái trong sân khấu 1920×1080", "co": "tỉ lệ",
    "vao": "giây bắt đầu (-1 hiện đủ)", "moc_hien": "mảng giây hiện từng mục theo thứ tự trên xuống",
    "moc_thong_bao": "giây thông báo trượt xuống", "giu_thong_bao": "giây giữ rồi trượt lên (bỏ trống là giữ mãi)",
    "moc_bam": "giây nút bị bấm (lún, vòng lan); bỏ trống thì nút sáng nhịp 2 giây", "tinh": "true hiện đủ", "hat": "hạt giống nét tay" },
  "moc": "toạ độ sân khấu: tam, tren, duoi, trai, phai, so_du, nut, thong_bao, dong (mép phải từng dòng), chi_tiet, rong, cao",
  "nguon_gom": "xuong_html/n87_chung_chi_tien_gui/trang.html:108 (phone) và xuong_html/2026.10.28_cic_la_gi/trang.html:311-322 (khung trình duyệt, nhãn giao diện mô phỏng)",
  "loi_con_lai": "",
  "ghi_chu": "el là phần tử HTML; hình khối vẽ ở lớp SVG phía sau (nét tay: nét chì đôi + bộ lọc run), chữ HTML phía trên không bị lọc; mỗi ô chữ có data-hop. Thông báo nằm trong lớp cắt theo màn hình, gắn data-chong vì cố ý che phần trên. Chữ đỏ, xanh của số tiền tự đậm lên tới tương phản 4,5. Chưa có: bàn phím, ô nhập, biểu đồ trong màn hình, màn hình đăng nhập (đợt 2 nếu cần). Hàm nên gom vào nền móng: diemBo (điểm hình chữ nhật bo góc cho nét tay), mauDoc (đậm màu tới tương phản 4,5), hộp bo góc hai kiểu." }
```

## 4. xap_tien_dong_xu — XONG (14:39), lần chụp cuối 0 lỗi

```json
{ "ten": "xap_tien_dong_xu", "file": ["ngan_hang/tien.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "loai": "chong_xu (mặc định) | xap_tien | to_tien | tui_tien; bí danh KHO.tien",
    "so": "số đồng xu (hoặc số xấp) mỗi chồng — một số hoặc mảng nhiều chồng cạnh nhau như cột biểu đồ (ví dụ [3, 6, 10, 15]); to_tien: số tờ xếp lệch 1–5",
    "nhan": "chữ 22 px dưới mỗi chồng (chuỗi hoặc mảng), hoặc dưới túi tiền / tờ tiền",
    "menh_gia": "chữ mệnh giá trên tờ tiền (mặc định '100.000'), hoặc ký hiệu trên túi tiền (mặc định 'đ')", "don_vi": "chữ đơn vị trên tờ tiền (mặc định 'đồng')",
    "khoa_mau": "khoá màu chính (mặc định: xu, túi → canh_bao; xấp, tờ → tot)",
    "co": "tỉ lệ", "vao": "giây bắt đầu (-1 hiện đủ)", "moc_hien": "mảng giây bắt đầu mọc của từng chồng",
    "nhip": "giây giữa hai đồng xu / hai xấp (mặc định 0,07 / 0,14)", "tre": "giây lệch giữa hai chồng (mặc định 0,25)", "tinh": "true hiện đủ", "hat": "hạt giống" },
  "moc": "day, dinh (đỉnh chồng cao nhất), dinh_chong (mảng đỉnh từng chồng), tam, trai, phai, rong, cao — đã nhân co; gốc ở giữa chân (tờ tiền: tâm tờ)",
  "nguon_gom": "dựng mới (bản 2D); chiều cao chồng theo xuong_html/n86_tien_gui_casa/trang.html:239 (chong(n))",
  "loi_con_lai": "",
  "ghi_chu": "Không chân dung, không mẫu tờ tiền thật: tờ tiền là hình chữ nhật có huy hiệu tròn ký hiệu đ và dải sóng. Xu và xấp rơi xuống nảy bằng lò xo theo nhịp; đồng trên cùng chồng cao nhất loé sáng 3,2 giây một lần; túi tiền nảy vào rồi lắc nhẹ. Cỡ chuẩn nhỏ (xu rộng 96): trong video nên đặt co 1,3–1,6. Chưa có: chồng xu nhìn từ trên, tiền chảy từ chồng này sang chồng khác (làm ở trang video bằng moc_hien hoặc đợt 2). Hàm nên gom vào nền móng: layDiem (lấy mẫu chuỗi Bézier bậc ba thành điểm để vẽ nét tay theo đường cong), elip (điểm elip, cung elip)." }
```

## 5. doanh_nghiep_nha_xuong — XONG (14:49), lần chụp cuối 0 lỗi

```json
{ "ten": "doanh_nghiep_nha_xuong", "file": ["ngan_hang/nha_xuong.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "loai": "nha_xuong (mặc định, rộng 520, cao 340 tính cả ống khói: mái răng cưa, ống khói, cửa cuốn, khối văn phòng, thùng hàng) | van_phong (rộng 340, cao 440: mặt kính 5 tầng, sảnh, bồn cây, biển trên nóc); bí danh KHO.nha_xuong",
    "nhan": "chữ biển tên, mặc định 'Công ty B'; dài thì thu cỡ (tối thiểu 22) rồi xuống hai dòng",
    "khoi": "true (mặc định) ống khói nhả khói", "mo_cua": "giây cửa cuốn kéo lên (bỏ trống là đóng)",
    "co": "tỉ lệ", "vao": "giây bắt đầu mọc (-1 hiện đủ)", "tinh": "true hiện đủ", "hat": "hạt giống nét tay" },
  "moc": "day, dinh, tam, trai, phai, cua, bien, ong_khoi — đã nhân co; gốc ở giữa chân công trình",
  "nguon_gom": "dựng mới; cách dựng khối và nét tay theo ngan_hang/toa_nha_ngan_hang.js (cùng tỉ lệ để đặt cạnh toà nhà ngân hàng)",
  "loi_con_lai": "",
  "ghi_chu": "Khói 4 cụm lặp chu kỳ 2,4 giây; văn phòng đứng yên sau khi mọc (vệt sáng trên kính để tĩnh). Bài học tính thuần (nên ghi vào README): (1) clip-path hoặc transform co giãn trên một nhóm con đang đổi làm Chrome kẻ lại vùng lân cận khác đi tuỳ khung trước, máy kiểm báo khong_thuan dù DOM trùng — cửa cuốn phải vẽ lại bằng hình học (đổi d, y), vệt sáng cắt đa giác bằng tính toán; (2) lò xo gần đứng yên nên chốt về 1 (|1−p| < 0,003) để khung sau không vẽ lại; (3) độ mờ 1 thì bỏ hẳn style.opacity. Công cụ dò: so innerHTML của #san giữa thứ tự xuôi và ngược trước, trùng thì là lỗi kẻ của Chrome. Hàm nên gom vào nền móng: catHCN (cắt đa giác lồi theo hình chữ nhật), chốt lò xo, đặt độ mờ có bỏ thuộc tính khi bằng 1." }
```

## 6. nha_o — XONG (14:55), lần chụp cuối 0 lỗi (chup_mau.mjs 1.2 có cờ --disable-partial-raster)

```json
{ "ten": "nha_o", "file": ["ngan_hang/nha_o.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "loai": "nha_pho (mặc định, rộng 200, cao 430: tầng trệt cửa kính, ba tầng ban công có chậu cây, tum) | can_ho (rộng 360, cao 520: 8 tầng × 4 căn, sảnh, bể nước) | dang_xay (rộng 360: tầng đã xây tường, tầng chỉ có khung, giàn giáo, cần cẩu tháp có móc lên xuống) | nha_don (rộng 300, cao 240: nhà mái dốc vẽ dần nét rồi tô)",
    "to_sang": "[tầng, cột] căn hộ được tô sáng (can_ho; tầng đếm từ 1 ở dưới, cột từ 1 bên trái), viền nhấp nháy nhẹ",
    "so_tang": "số tầng toà đang xây, 3–9 (mặc định 7)", "tang_xong": "số tầng đã xây tường (mặc định 3)",
    "nhan": "chữ 22 px dưới chân, không bắt buộc", "co": "tỉ lệ", "vao": "giây bắt đầu (-1 hiện đủ)",
    "nhip": "giây giữa hai tầng mọc (đang xây, mặc định 0,22)", "tinh": "true hiện đủ", "hat": "hạt giống nét tay" },
  "moc": "day, dinh, tam, trai, phai, cua, can (tâm căn tô sáng), moc_cau (móc cần cẩu ở giữa hành trình) — đã nhân co; gốc ở giữa chân nhà",
  "nguon_gom": "nhà mái dốc: xuong_html/2026.10.28_trich_lap_du_phong/trang.html:186-191 (c2_nha, vẽ dần bằng pathLength); các loại khác dựng mới theo cách của toa_nha_ngan_hang.js",
  "loi_con_lai": "",
  "ghi_chu": "Cùng tỉ lệ với toa_nha_ngan_hang và doanh_nghiep_nha_xuong để đặt chung một cảnh. Toà đang xây: các tầng được thả xuống lần lượt bằng lò xo, giàn giáo hiện sau ba tầng đầu, cần cẩu hiện cuối, móc lên xuống chu kỳ 4 giây (đổi hình học, không transform). Nhãn dưới chân nhỏ hơn 22 px khi co < 1. Chưa có: biệt thự, nhà liền kề nhiều căn, đất trống có cọc mốc (đợt 2 nếu lô cần)." }
```

## Tổng kết lượt 2

Bắt đầu 14:15, xong 14:55 (khoảng 40 phút). Xong 5 hình, mỗi hình lần chụp cuối 0 lỗi: hop_dong_giay_to, man_hinh_ung_dung, xap_tien_dong_xu, doanh_nghiep_nha_xuong, nha_o. Không còn hình dở.

Phát hiện chính: lỗi khong_thuan ngẫu nhiên khi DOM trùng là do Chrome tô lại từng phần (partial raster); thêm cờ --disable-partial-raster thì hết (phiên giữ kho đã đưa vào chup_mau.mjs 1.2). Nên cân nhắc thêm cờ này vào công cụ xuất MP4 của xuong_html nếu cần ảnh trùng từng điểm.

Hàm nên gom vào nền móng `kho_nen.js`: boVe (da, cn, tron, vach — bốn file nhóm B và toa_nha, nhan_vat đều có bản riêng gần giống nhau), duongMuot (Catmull-Rom sang Bézier), layDiem (lấy mẫu Bézier bậc ba thành điểm cho nét tay), diemBo (điểm hình chữ nhật bo góc), catHCN (cắt đa giác lồi theo hình chữ nhật), mauDoc (đậm màu tới tương phản 4,5), con dấu tròn có chữ chạy vòng, chốt lò xo gần đứng yên về 1, đặt độ mờ có bỏ thuộc tính khi bằng 1.
