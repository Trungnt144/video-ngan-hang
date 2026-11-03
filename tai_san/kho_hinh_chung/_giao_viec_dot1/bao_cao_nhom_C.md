# Báo cáo nhóm C (biểu đồ, bình chứa, nét tay, thư viện 3D) — kho hình dùng chung đợt 1

Bắt đầu: 29/10/2026 14:15. Xong: 14:40 (khoảng 25 phút theo lệnh date). Mỗi hình ghi ngay khi xong.

## 1. bieu_do_cot_lich_tra_no — XONG, lần chụp cuối 0 lỗi

```json
{ "ten": "bieu_do_cot_lich_tra_no", "file": ["ngan_hang/lich_tra_no.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay",
    "kieu_tra": "goc_cuoi_ky | goc_deu (lãi giảm dần) | nien_kim (tổng đều)", "an_han": "số kỳ đầu chỉ trả lãi, mặc định 0",
    "so_ky": "số kỳ, mặc định 12", "so_tien": "số tiền vay (đồng), mặc định 120e6", "lai_nam": "lãi suất năm, 12 hoặc 0,12 đều hiểu là 12 %", "ky_thang": "số tháng mỗi kỳ, mặc định 1",
    "lich": "mảng kỳ tự tính sẵn (bỏ qua tham số tính)", "rong, cao": "khung, mặc định 1300 × 620",
    "tieu_de": "dòng đầu đậm (tuỳ chọn)", "chu_thich": "dòng phụ, ghi kèm (ví dụ giả định)", "nhan_goc, nhan_lai": "mặc định Gốc, Lãi", "khoa_goc, khoa_lai": "khoá màu, mặc định nhan, canh_bao",
    "nhan_truc_x": "mặc định Kỳ", "don_vi, ten_don_vi": "mặc định 1e6, triệu đồng", "to_an_han": "tô vùng ân hạn (mặc định true khi an_han > 0)", "nhan_an_han": "mặc định Ân hạn gốc N kỳ",
    "hien_ky": "số thứ tự kỳ hiện thẻ số liệu gốc, lãi, tổng (các cột khác mờ đi)", "vao_hien_ky": "giây hiện thẻ, mặc định sau cột cuối",
    "vao": "giây bắt đầu (-1 hiện đủ)", "tinh": "true hiện đủ", "nhip": "giây giữa hai cột, mặc định 0,14", "moc_hien": "mảng giây mọc từng cột", "hat": "hạt giống nét tay" },
  "moc": "goc_truc [x,y]; dinh_cot [[x,y],...] đỉnh từng cột; chu_giai [x,y]; an_han {x,y,w,h} hoặc null; the [x,y] tâm thẻ số liệu hoặc null. Đối tượng trả về có thêm lich (bảng đã tính). Hàm tính dùng riêng: KHO.tinhLichTraNo({so_ky, so_tien, lai_nam, kieu_tra, an_han, ky_thang}) → [{ky, du_no_dau, goc, lai, tong, du_no_cuoi, an_han}]",
  "nguon_gom": "dựng mới",
  "loi_con_lai": "",
  "ghi_chu": "Gốc toạ độ ở góc trên trái khung. Cột mọc bằng lò xo từ trục ngang, gốc dưới lãi trên; trục vẽ dần, lưới và nhãn hiện sau. Thẻ số liệu đặt cạnh cột (phải, hoặc trái khi sát mép), có nét đứt nối đỉnh cột, cột được chọn nhấp nháy nhẹ. Nét tay: cột tô loang và gạch chéo, viền run. Nhãn trục kỳ thưa bớt khi trên 16 kỳ. Lãi kỳ = dư nợ đầu kỳ × lãi năm × số tháng kỳ / 12; kỳ cuối dồn phần lẻ." }
```

## 2. bieu_do_duong_lai_suat — XONG, lần chụp cuối 0 lỗi

```json
{ "ten": "bieu_do_duong_lai_suat", "file": ["chung/bieu_do_duong.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "rong, cao": "khung, mặc định 1400 × 620", "tieu_de, chu_thich": "dòng đầu và dòng phụ (tuỳ chọn)",
    "truc_x": "{ min, max, buoc, ten ('Tháng'), dinh_dang (hàm) }, thiếu thì tự tính", "truc_y": "{ min, max, buoc, don_vi ('%'), thap_phan (1), ten }, thiếu thì tự tính",
    "duong": "[{ ten, diem [[x,y],...], khoa_mau, bac_thang (bậc thang cho lãi thả nổi), net_dut, day (mặc định 6), cham (chấm mỗi điểm), nhan_cuoi ('ten_gia_tri' | 'ten' | 'gia_tri' | false), vao, dai }]",
    "dai_to": "[{ duoi, tren (chỉ số đường), tu, den, khoa_mau, nhan (ví dụ Biên độ 3,5%), x_nhan }] dải tô giữa hai đường",
    "vung": "[{ tu, den, nhan, khoa_mau, vao }] vùng tô dọc (thời gian ưu đãi cố định)",
    "moc_dieu_chinh": "[{ x, duong, nhan }] dấu thoi và vạch đứt ở kỳ điều chỉnh", "nhan_moc": "chú giải dấu mốc, mặc định Kỳ điều chỉnh lãi suất",
    "chu_giai": "true hiện chú giải các đường ở dòng đầu", "thap_phan_gia_tri": "số lẻ ở nhãn cuối đường, mặc định 1",
    "vao": "giây bắt đầu (-1 hiện đủ)", "tinh": "true hiện đủ", "dai_ve": "giây vẽ mỗi đường, mặc định 2,4", "nhip": "giây lệch giữa các đường, mặc định 0,35", "hat": "hạt giống nét tay" },
  "moc": "goc_truc [x,y]; diem(x,y) hàm đổi toạ độ dữ liệu sang toạ độ khung; cuoi [[x,y],...] điểm cuối từng đường; vung_ve {x,y,w,h}; t_xong giây vẽ xong. Hàm dựng dữ liệu: KHO.laiSuatThaNoi({ co_so [[tháng,%],...], bien_do, ky_dieu_chinh 3|6, tu, den, uu_dai {den, lai} }) → { co_so, tha_noi (điểm bậc thang), moc (tháng điều chỉnh), bang }",
  "nguon_gom": "xuong_dai/lai_13_thang/src/Chung.tsx:126-141 làm mẫu (lưới mảnh, toạ độ lãi theo kỳ hạn); dựng lại thành khuôn tham số",
  "loi_con_lai": "",
  "ghi_chu": "Gốc toạ độ ở góc trên trái khung. Đường vẽ dần từ trái sang phải bằng vùng cắt, có đầu bút chạy theo; vẽ xong đầu bút thành chấm cuối có vòng lan nhẹ theo nhịp 2,2 giây. Nhãn cuối đường tự đẩy cách nhau khi gần. Dấu mốc nảy ra khi đầu bút đi qua. Lãi kỳ thả nổi = lãi cơ sở tại ngày điều chỉnh + biên độ, giữ tới ngày điều chỉnh sau." }
```

## 3. binh_chua_muc_nuoc — XONG, lần chụp cuối 0 lỗi

```json
{ "ten": "binh_chua_muc_nuoc", "file": ["chung/binh_chua.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "rong, cao": "bình, mặc định 220 × 380", "khoa_mau": "màu chất lỏng, mặc định nhan",
    "muc": "mực sau khi đổ vào, 0..1", "muc_dau": "mực lúc bắt đầu, mặc định 0 (đổ đầy dần)", "dai_vao": "giây đổ vào, mặc định 1,2",
    "chuyen": "[{ luc (giây tính từ lúc hình xuất hiện), muc, dai }] các lần dâng, rút tiếp theo",
    "tran": "vạch trần 0..1 (tuỳ chọn)", "nhan_tran": "chữ vạch trần", "canh_bao_vuot": "mặc định true: vượt trần chất lỏng ngả màu xau, nhãn trần nhấp nháy",
    "gia_tri_toi_da": "giá trị ứng với mực 1", "dinh_dang": "hàm số → chữ, mặc định KHO.soTien bỏ chữ đồng", "nhan_muc": "mẫu chữ, {gt} giá trị, {pt} phần trăm; false để ẩn",
    "ten": "tên dưới đáy", "vach_chia": "vạch chia trên thành, mặc định true", "ben_nhan": "phai | trai",
    "vao": "giây bắt đầu (-1 hiện đủ)", "tinh": "true hiện đủ", "hat": "hạt giống nét tay" },
  "moc": "day [0,0]; mieng [0,-cao]; mat_nuoc(t) → [x,y] giữa mặt chất lỏng; tran [x,y] đầu vạch trần phía nhãn hoặc null; ten [x,y]. Đối tượng trả về có thêm mucTai(t) (mực 0..1 ở giây t)",
  "nguon_gom": "dựng mới",
  "loi_con_lai": "",
  "ghi_chu": "Gốc toạ độ ở giữa đáy bình. Mặt chất lỏng là sóng hai tần số, biên độ lớn lên khi mực đang đổi; bọt nổi lên theo t; vệt sáng kính ở kiểu phẳng; nét tay: viền run hai lượt, chất lỏng tô loang và gạch chéo. Nhãn mực đi theo mặt nước, tự né nhãn trần. Cần chừa bên nhãn khoảng 36 + độ rộng chữ (bình 220 rộng thì đặt các bình cách nhau từ 520 đơn vị). Với MAU-23 nhan trùng xau (cùng đỏ) nên muốn thấy đổi màu khi vượt trần thì dùng khoa_mau nhan_phu hoặc tot." }
```

## 4. net_tay_but_chi — XONG, lần chụp cuối 0 lỗi

```json
{ "ten": "net_tay_but_chi", "file": ["chung/net_tay.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "net_tay (CL-10: giấy kem có vân hạt, loang, sợi giấy; bút chì gỗ; nét than chì run hai lượt) | phang (giấy trắng có ô lưới mờ, bút dạ, nét sạch)",
    "KHO.net_tay_but_chi (nền)": "rong, cao (mặc định 1920 × 1080); van (vân giấy, mặc định true); toi_vien (tối nhẹ bốn mép, mặc định true); ke_dong (khoảng dòng kẻ, 0 là không); le_do (x đường lề màu nhấn); o_luoi (ô lưới kiểu phẳng, mặc định 48)",
    "KHO.but_chi_ve (nét)": "net [[[x,y],...],...] hoặc diem; dong (khép kín); khoa_mau ('chu'); day (5); dai (tổng giây, mặc định chiều dài / 900); but (hiện cây bút, mặc định true); co_but; lech (độ run, 1,8)",
    "KHO.chu_viet_dan (chữ)": "chu; x, y (chân chữ dòng đầu); co (44); dam (600); rong (bề rộng xuống dòng); gian_dong (1,3); neo start | middle; khoa_mau; toc_do (giây mỗi ký tự, 0,045); but",
    "KHO.dau_but (cây bút)": "kieu, co; đầu bút ở gốc toạ độ, thân chếch lên phải",
    "chung": "vao (giây bắt đầu, -1 hiện đủ), tinh, hat, mau" },
  "moc": "nền: { tam, rong, cao }; nét: { dau [x,y], cuoi [x,y] }; chữ: { hop {x,y,w,h}, cuoi [x,y] cuối dòng chót }. Nét và chữ trả thêm t_xong (giây vẽ xong, đã cộng vao) để xâu chuỗi nét sau",
  "nguon_gom": "dựng mới",
  "loi_con_lai": "",
  "ghi_chu": "Gốc toạ độ: nền ở góc trên trái; nét và chữ theo toạ độ cảnh (không dời gốc). Nét vẽ dần bằng pathLength=1; đầu bút đi theo đường gấp khúc gốc, rung nhẹ khi vẽ, nhấc lên và mờ trong 0,22 giây sau khi xong. Chữ viết dần bằng vùng cắt từng dòng, chữ giữ sắc. Mỗi lời gọi có một cây bút riêng: hai nét gối nhau thời gian sẽ thấy hai bút, nên xâu chuỗi bằng t_xong. Vân giấy dùng hai bộ lọc feTurbulence phủ cả khung nên chụp chậm (lượt chụp ô mẫu 41–67 giây khi máy đang tải nặng); video dài nên chụp nền một lần thành ảnh PNG rồi đặt làm nền, hoặc đặt van: false." }
```

## 5. thu_vien_3d_ngan_hang — XONG, lần chụp cuối 0 lỗi

```json
{ "ten": "thu_vien_3d_ngan_hang", "file": ["chung/thu_vien/three.min.js", "ngan_hang/thu_vien_3d.js"], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang (vật liệu mờ chuẩn, bóng mềm) | net_tay (vật liệu ba bậc sáng, mọi khối có viền màu chữ, cả khung qua bộ lọc nét run)",
    "mau3d": "ghi đè màu 3D theo khoá trang, xamNhat, bong, xamDam, than, xanh, cam, vang, vangVien, do, doDam, xamVua, xamCua, camNhat, bang, vangNhat, kinh, vien (mặc định tính từ bảng màu: trang = giay, xanh = nhan_phu, cam = nhan, vang = nhat, do = xau, than = chu)",
    "rong, cao": "cỡ canvas, mặc định 1920 × 1080", "x, y": "vị trí khối trong sân khấu", "de": "đế sa bàn tròn bán kính 6, mặc định true",
    "fov": "mặc định 24", "kc_he": "hệ số khoảng cách máy quay, mặc định 1,26", "vao": "giây bắt đầu (-1 hiện đủ)", "tinh": "true hiện đủ", "hat": "hạt giống bộ lọc nét run" },
  "moc": "Đối tượng trả về: el (khối HTML chứa canvas), seek(t), T, scene, cam, renderer, de, B (bộ dựng: hop, tru, cau3, mesh, langTru, vien, nhom, vl, datHat, datS, datDuoi, sang, MAU), MH (33 mô hình, tên ở KHO.MO_HINH_3D_NGAN_HANG), them(vật, x, y, z), themMay(t, {az, el, kc, tx, ty, tz, lx, ly, deY}, troi) như N96, capNhat(fn(s)), chieu(Vector3) → {x,y} toạ độ sân khấu, diem(vật, x, y, z); moc.tam_de(), moc.mep_truoc_de(). Hàm dùng riêng: KHO.mau3d(opt), KHO.boDung3D(THREE, MAU, kieu)",
  "nguon_gom": "xuong_html/n96_tai_san_bao_dam/canh/chung.js:118-465 (vật liệu, khối, thư viện MH chép nguyên hình dạng), 82-116 (dựng cảnh, đèn ba điểm, đế, mặt nhận bóng), 466-500 (máy quay khoá thời gian, mepDe)",
  "loi_con_lai": "",
  "ghi_chu": "Mỗi lời gọi tạo một cảnh riêng (không còn biến toàn cục N96): renderer, scene, danh sách khoá máy quay, bộ nhớ vật liệu. Bảy mã màu ghi cứng trong N96 (người, cửa két, xấp tiền, băng thùng, hoá đơn, kính lúp, viền) đổi thành khoá màu tính từ bảng. Thân thư viện MH giữ nguyên từng dòng nên các video N96 cũ đối chiếu được. Hàm cập nhật nhận s đã trừ vao, phải thuần theo s; ô mẫu dùng datDuoi + KHO.spr cho mọc lên, cân đòn dao động bằng userData.dat(góc), hạt chạy bằng datHat. Chụp cần cờ swiftshader (chup_mau.mjs đã có); lượt chụp ô mẫu 63–66 giây nên đã chạy qua hàng đợi lượt dài, không dùng --nhanh. Két có đồng hồ của N86 chưa thêm (ghi chú danh mục)." }
```

## Tổng kết

- Năm hình xong, cả năm lần chụp cuối 0 lỗi trong ket_qua.json (chup_mau.mjs 1.1, kể cả kiểm khong_thuan mới).
- Hàm nên gom vào kho_nen.js: thoiGian(opt) (dời t theo vao, tinh), idMoi (đếm id cho clipPath, pattern, filter), buocDep (bước chia trục 1, 2, 2,5, 5 × 10^k) và soLe, chiaNho (chia đoạn dài cho nét tay run đều), chuNhatTay (hình chữ nhật nét tay), diemTai và doDai (điểm trên đường gấp khúc theo tỉ lệ), chuanBiVe và veDan bằng pathLength=1 (giống nhóm B đã đề xuất), dPhang (mảng điểm → chuỗi d). Năm file đều viết lại thoiGian và idMoi giống nhau.
- Lưu ý cho lô 2: biểu đồ cột và biểu đồ đường đặt gốc ở góc trên trái khung; nét và chữ của net_tay.js theo toạ độ cảnh. Với MAU-23 nhan trùng xau nên bình chứa vượt trần muốn đổi màu thì dùng khoa_mau nhan_phu.
