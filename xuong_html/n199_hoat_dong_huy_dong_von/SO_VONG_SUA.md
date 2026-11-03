# Sổ vòng sửa N199 (03/11/2026, đợt B)

Dựng bằng một trang HTML (LM-03): `trang.html`, `canh.js`. Khung chung (chữ, hộp, vật, mũi tên, phụ đề, logo, màn hình kết, `seek`, `kiemTra`, `demTu`, `chuHienThi`, chống đứng hình) chép từ `xuong_html/n198_hoat_dong_cho_vay/canh.js`, đổi sang nền sáng MAU-58 và bố cục BC-06: bảng kẻ lưới 60 px toàn khung, vùng mô phỏng y 110–800, dải dưới y 808–892 có bộ đếm trái, đồ thị nhỏ giữa (vẽ dần theo t), mười một chấm chương bên phải. Công cụ chép từ N198, đổi tiền tố: `n199_tao_nhip.py`, `n199_anh_tinh.mjs`, `n199_quet_kiem.mjs`, `n199_do_tu.mjs`, `n199_do_hien.mjs`, `n199_tuong_phan.mjs`, `n199_uoc_dung.mjs`, `n199_dung_hinh.mjs/.py`, `n199_tham.mjs`, `n199_luoi.sh`, `n199_bang.py`, `n199_noi_nhac.sh` (đổi sang NH09), `n199_hai_le*.py`, `n199_nghe_lai.py`, `n199_doc_lai.py`.

## Mô phỏng (CL-14)

Mỗi cảnh có hàm vẽ canvas `S.ve2d` gọi trong `seek(t)`, vẽ lên canvas nằm trên lớp SVG (bể, toà nhà) và dưới lớp chữ HTML. Hạt tính thuần theo t, không lưu trạng thái: `roi()` cho mỗi hạt giây sinh `a + i / nhip`, rơi theo trọng lực g = 2.400 px/s² từ miệng vòi tới đích (mặt chất lỏng của bể tại giây chạm, tính từ `mucTai` của kho `binh_chua_muc_nuoc`), chạm thì tan vào chất lỏng hoặc nảy tắt dần rồi nằm yên ở ô xếp; buồng tiền gửi không kỳ hạn dùng bước ngẫu nhiên (tổng các sóng sin theo hạt giống), 30% số hạt có chu kỳ đi qua cửa ra rồi quay lại; buồng có kỳ hạn có vòng đồng hồ 6 giây, hết vòng thì hạt lãi hiện. Bể chương 1 và 6 dâng mực theo số hạt đã rơi; chương 6 năm vòi rộng theo tỉ trọng (20, 50, 10, 10, 10), nhịp hạt tỉ lệ số đồng, màu theo chi phí.

## Kho đã chép (không sửa kho)

`chep_kho.py` 03/11/2026: `kho_nen` 1.0, `logo_ten_kenh` 1.1, `phu_de_chay_chu` 1.0, `nhan_gia_dinh` 1.0, `binh_chua_muc_nuoc` 1.0 (dùng: chương 1, 6, 8, 10, 11), `khuon_trung_gian_ba_khoi` 1.1 (dùng: chương 2, hai khối, kiểu `toi_gian`, chữ "Người gửi", "100", "5"), `toa_nha_ngan_hang` 1.0 (dùng: chương 5, 8, biển trống `nhan: ''`), kéo theo `khach_hang_ca_nhan`, `doanh_nghiep_nha_xuong`, `nha_o`, `xap_tien_dong_xu`. `man_hinh_ung_dung` chép nhưng không nạp: khuôn giao diện nhiều chữ, chương 10 vẽ điện thoại phẳng trên canvas.

## Màu (MAU-58, chỉ màu)

Nền #F0F6FA, lưới #DCE8F2 / #C7DDEE, chữ #001627, chữ phụ #3E5A75. Nguồn: vốn chủ sở hữu #001627, không kỳ hạn #6290B5, có kỳ hạn #0165B3, giấy tờ có giá #C9762B, đi vay #7A5BA6; lãi #D9912B; vạch quy định #C0392B; bảo hiểm, lợi nhuận #2E8B57. Chữ dùng bản đậm hơn của màu hình (`CHU_DAM`: #3C6A90, #015A9E, #8F4E12, #1E6B40) để đủ 4,5:1.

## Giọng: nghe lại bằng Whisper (large-v3-turbo) và đọc lại

- Lượt đầu (`n199_giong.log`): 3 câu báo sai trên 10% đều là câu có số (Whisper viết số bằng chữ số); nghe riêng (`n199_nghe_so.log`) đúng cả 6 câu có số.
- Hai lề cắt 0,05 và 0,4 giây mọi câu có chữ dễ sai (`n199_hai_le_1.log`, 38 câu): "huy động" đầu câu nghe "quy động" (2:1), "tiền lãi" nghe "tiền lại" (2:4), "lãi suất" nghe "lại suất" (4:3, 10:5), "tiền vay" nghe "tiền vai" (7:6); nghe riêng còn "mức chung" thành "mức trung" (8:3) và "tiền gửi" thành "tiền người" (10:4). Đổi lời 8:3 "mức chung" thành "mức thông thường" (text và doc). Đọc lại bảy câu (`n199_doc_lai_1.sh`): đúng ở lần 1. Nghe lại hai lề (`n199_hai_le_2.log`): còn 4:3 lề 0,4; đọc lại lần hai (`n199_doc_lai_2.log`): đúng cả hai lề. "cấp 2" ở 4:4 là Whisper viết chữ số, không phải lỗi.
- Tổng 248,9 giây (7.467 khung), màn hình kết 238,9–248,9 bắt đầu đúng câu "Đăng ký kênh…".

## Vòng 1 (`anh_tinh/v1`, hai ảnh mỗi chương)

Máy: chữ đè chữ chương 2 (hai nhãn cột trong dải dưới), chương 4 ("trái phiếu · vài năm" xuống hai dòng đè "vốn cấp 2"). Mắt: vòi chương 1, 6 trông như hình chữ nhật rời; tiêu đề chương 1 đè vòi; nhãn "trả lại" đè đường hạt; nhãn "tiền gửi lớn nhất" đè miệng bể; khay ra chương 6 trống khi nhãn ẩn; nhãn "6%" chương 7 bị cột đi vay rung lên đè; nhãn "tối đa 85%" chương 8 đè đỉnh cột. Đã sửa: vòi là ống từ mép trên khung xuống, ruột tô màu nhạt; tiêu đề và nhãn chương 1 sang bên phải bể; trục chương 2 lên y 690, nhãn dưới trục; khối chứng chỉ chương 4 lên y 350, nhãn trái phiếu trên khối, "vốn cấp 2" ở đầu phải; số vòi chương 6 hiện tại miệng vòi sau khi tên vòi ẩn; khay có hạt tích lại; nhãn "6%" đặt trên đỉnh cao nhất.

## Vòng 2 (`anh_tinh/v2`)

Máy: "6%" đè "theo thị trường"; "tối đa 85%" tràn mép phải. `n199_quet_kiem.mjs`: "10" đè "vốn chủ sở hữu" (chương 6), "Thông tư 22/2019 · Điều 20" xuống hai dòng vào dải phụ đề, "dự trữ" đè "thời hạn" (chương 11). `n199_do_hien.mjs`: 8 đoạn chữ dưới 1 giây (nhãn 90 chương 1 do `TU` không tìm thấy chữ "chín mươi" trong phụ đề "90"; tên vòi chương 6; tiêu đề chương 7; ba ô chương 10; "thời hạn" chương 11). `n199_tuong_phan.mjs`: 33 lần dưới 4,5:1 (chữ màu #6290B5, #2E8B57). Đã sửa tất cả: tên vòi hai hàng y 140 và 196, giữ 1,7 giây; dải dưới rộng 760; đồng hồ chương 11 sang trái bể; bảng màu chữ đậm.

## Vòng 3, 4, 5 (`anh_tinh/v3`–`v5`, mỗi câu một ảnh, 52 ảnh)

Vòng 3 thấy hạt trong bể chương 1, 8, 10 bị chất lỏng của bể (SVG) che vì canvas nằm dưới SVG: chuyển mọi hạt lên canvas trên lớp SVG. Nhãn dự trữ chương 8 đè miệng bể (dời sang phải); "cho vay dài" chương 9 bị thanh đè (dời xuống); "chi phí vốn" chương 10 đè đường hạt; tên vòi chương 11 chồng nhau (đặt ba vị trí cố định). Thêm đám hạt tụ lại ở câu 1 chương 3 (bảng trống 4 giây). Vòng 4: đường hạt "trả lại" chương 1 cắt qua nhãn 90 (đổi đường cong đi lên phía trên); 3 hạt dự trữ chương 8 đỏ trước khi rơi (chỉ đỏ khi bắt đầu rơi). Vòng 5 xem lại đạt.

Kết quả máy cuối:
- `n199_quet_kiem.mjs` mỗi 0,5 giây: 0 loại lỗi kiemTra, 0 pageerror.
- `n199_do_tu.mjs`: nhiều nhất 12 tiếng (chương 3 giây 51,5–52), 0 khung quá 12.
- `n199_do_hien.mjs`: 97 đoạn chữ, 0 đoạn hiện rõ dưới 1 giây.
- `n199_tuong_phan.mjs --moi 2`: 125 giây đo, 0 chữ dưới 4,5:1.
- `n199_uoc_dung.mjs` (so khung t và t + 1,5): thấp nhất 1,11 (0–64), 2,27 (62–126), 2,70 (124–188), 2,21 (186–239): 0 cặp dưới 0,6.

## Ảnh lưới

`san_pham/2026.11.02.Hoạt động huy động vốn của ngân hàng là gì/tai_nguyen/ban_nhap/2026.11.02.hoat_dong_huy_dong_von_v1_anh_luoi.jpg`: chương 1 câu 3 (bể 100 đồng, 90 nhận từ người khác, hạt trả lại), chương 6 câu 4 (năm vòi, bể, ba khay ra), chương 7 câu 3 (cột lãi suất, diện tích là tiền lãi, ≈ 5,0 đồng / năm), chương 9 câu 5 (khiên bảo hiểm tới 350 triệu).

## Điểm lệch bảng hình và tự chọn (đổi lại được)

- Chương 1: nhãn và tiêu đề đặt bên phải bể (vòi giữa trên cùng); câu 4 "huy động vốn?" bên phải, không ở giữa trên.
- Chương 2: thêm tiêu đề "nguồn vốn = 2 phần" ở câu 3 (bảng hai cột chưa có hạt); nhãn cột đặt dưới trục, không ở dải dưới.
- Chương 3: thêm đám hạt tụ lại ở câu 1.
- Chương 5: mặt trời, mặt trăng chạy vòng dưới nhãn liên ngân hàng; nước ngoài là quả cầu nét, ủy thác là hộp có khoá, cả hai vẽ canvas.
- Chương 6: tên vòi chỉ hiện lúc đọc tới (1,7 giây), sau đó còn số; ba khay ra "cho vay", "đầu tư", "chi trả" (lời: cho khách vay, mua giấy tờ có giá, giữ để trả).
- Chương 7: tên nguồn dưới cột chỉ hiện lúc đọc tới, sau đó cột giữ màu và nhãn lãi suất.
- Chương 8: ba hạt dự trữ rơi sang toà Ngân hàng Nhà nước nhỏ (không chữ), bộ đếm "3 / 100"; nhãn 85% đặt bên trái cột tiền gửi.
- Chương 9: không có nhãn "Thông tư 22/2019 · Điều 16" trên hình (giữ 12 tiếng).
- Chương 10: điện thoại phẳng tự vẽ thay kho `man_hinh_ung_dung`.
- Chương 11: ba dấu quy định là hai vạch đỏ trên bể (dự trữ, tỷ lệ cho vay) và đồng hồ bên trái (thời hạn).

## Đợt C (03/11/2026, theo soát độc lập: 0 nặng, 9 vừa, 13 nhẹ)

Giọng (`n199_doc_lai_3.sh` … `_6.log`): 6.3, 10.3 đọc lại đúng ở lần 1; 8.5 đổi "đặt mức" thành "quy định mức" (8 lượt "đặt" đều nghe "đạt"); 8.6 đổi thành "Thông tư số 50, ban hành năm 2026, …" (bản "Thông tư 50 năm 2026" nghe "55-2026" ở lề 0,05), đọc lại hai lượt mới ra "đổi cách tính"; 9.3, 9.4, 11.3 đổi lời theo soát, đúng ở lần 1. Nghe hai lề cả bảy câu: đúng. Nghe tiếng có nhạc tách từ MP4 mới (`scratchpad/n199_nghe_mp4.py`): 6.3 "Tiền từ mọi nguồn…", 10.3 "…trừ đi chi phí vốn… trích dự phòng…", 8.5, 8.6, 9.3, 9.4, 11.3 đúng. Tổng 254,7 giây (7.642 khung), màn hình kết từ 244,7 giây.

Hình:
- Chương 1 câu 4: ba mũi tên nét đứt từ ngoài khung chỉ vào bể (lỗi 21).
- Chương 2: dòng trả về ghi "100 + 5" (gốc và lãi); thêm nhãn "ví dụ giả định" từ câu 1; dải dưới có thanh 10 | 90 mọc theo hai cột (lỗi 4, 17). Màu hạt trên dòng tiền do khuôn kho vẽ, không đổi được khi không sửa kho: giữ.
- Chương 4: khối chứng chỉ tiền gửi tô cam nhạt, nhãn màu cam đậm (lỗi 16).
- Chương 6: bể bắt đầu gần rỗng, mực dâng từ lúc vòi đầu mở tới hết câu 2 (lỗi 15); hộp tên vòi vừa chữ, "vốn chủ sở hữu" đặt bên phải vòi đen, không đè vòi đi vay (lỗi 5).
- Chương 7: hàm tìm chữ cho tên cột đọc theo phụ đề ("không kỳ hạn", "có kỳ hạn", "giấy tờ", "đi vay"), cột mọc đúng lúc lời đọc tới; tên cột giữ tới hết câu 3, từ câu 4 chỉ còn tên cột đang nói; nhãn lãi suất hiện lúc đọc tới (1,9 giây) rồi ẩn để giữ 12 tiếng; "lãi suất năm" ẩn khi cột thứ ba mọc; bộ đếm còn "≈ 5,0 đồng" (lỗi 3).
- Chương 8: đồ thị dải dưới lùi sang x 900–1440, không cắt chữ "Thông tư 22/2019 · Điều 20" (lỗi 6); câu 6 nhãn "Thông tư 50/2026 · từ 01/12/2026: cách tính mới", nhãn hai cột ẩn ở câu 6 (giữ 12 tiếng); ba hạt dự trữ tới toà Ngân hàng Nhà nước thì ẩn, không còn hạt lơ lửng (lỗi 20).
- Chương 9: nhãn trục "1 năm", "10 năm", "20 năm" ở câu 1–2 (lỗi 18).
- Chương 10: nhãn "lãi từ khách vay" ở dòng vào (lỗi 22); câu 4 mười hạt đổi màu có quầng vàng nhấp nháy (lỗi 21).
- Chương 11: tên ba vòi lên y 238; nhãn "dự trữ", "tỷ lệ cho vay", "thời hạn" hiện cùng vạch và đồng hồ (lỗi 19).

Không sửa (nhẹ): lỗi 11 ("giả định" nghe "già định" 2/3 lượt ở 6.2, 7.2: nghĩa không đổi, không đọc lại hai câu này); lỗi 13 ("tiền gửi tiết kiệm" chung cho cả có kỳ hạn và không kỳ hạn: chỉ sửa khi đọc lại chương 3, chương 3 không có lỗi khác); lỗi 14 (chương 10 dài: để Trung xét).

Máy sau đợt C: `n199_quet_kiem.mjs` 0 lỗi, 0 pageerror; `n199_do_tu.mjs` 0 khung quá 12; `n199_do_hien.mjs` 104 đoạn, 0 dưới 1 giây; `n199_tuong_phan.mjs --moi 2` 0 chữ dưới 4,5:1; `n199_uoc_dung.mjs` thấp nhất 1,16 / 1,53 / 2,44 / 1,67, 0 cặp dưới 0,6. Ảnh tĩnh `anh_tinh/v6` xem lại đạt.

Kết xuất lần 3 (pha máy cả 9 chương vì mốc từ chương 2 dời; `n199_pha_may_dot_c.log`): `out/pha_may/n199_du.mp4` 254,8 giây, 7.642 khung, −14,2 LUFS, đỉnh −2,8 dBTP, 0 khung hỏng, đứng hình pha máy 1 đoạn 0,5 giây ở 246,9 giây (màn hình kết); freezedetect crop 1920×860 d = 1,5: 0 đoạn. Bản trước soát ở `tai_nguyen/ban_nhap/2026.11.02.hoat_dong_huy_dong_von_youtube_v1_nhap_truoc_soat.mp4`; bản mới chép thành bản nháp ngoài cùng thư mục sản phẩm (cmp trùng).
