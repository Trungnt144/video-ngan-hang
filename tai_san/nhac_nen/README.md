# Nhạc nền

Nguồn: Pixabay, giấy phép Pixabay Content License (dùng miễn phí, không bắt ghi công, cấm bán lại riêng file nhạc). Bản nào cũng đăng ký Content ID: đăng YouTube/Facebook có thể bị gắn khiếu nại nhầm, khiếu nại lại bằng link trang nhạc.

| File | Tên bản, tác giả | Trang | Dài | Dùng cho |
|---|---|---|---|---|
| leberch-science-documentary-594955.mp3 | Science Documentary, leberch | https://pixabay.com/music/ (mã 594955) | 2:32 | Video tua-bin gió 3D (25/10/2026), Trung tự tải |

## Mixkit (thêm 26/10/2026)

Nguồn: Mixkit (Envato), giấy phép Mixkit Stock Music Free License (trang https://mixkit.co/license/#musicFree; trang tổng của Mixkit ghi dùng được cho dự án thương mại và cá nhân, không bắt ghi công). Tải thẳng bằng lệnh được, không bị chặn như Pixabay. Toàn văn giấy phép nhạc (đọc ngày 26/10/2026 qua trình duyệt, nội dung nằm trong cửa sổ bật lên ở trang giấy phép): **được** dùng cho dự án thương mại và phi thương mại, miễn phí; được tải, sao chép, chỉnh sửa, phân phối và phát công khai trên mọi nền tảng web, mạng xã hội, YouTube, video theo yêu cầu, podcast, quảng cáo trực tuyến. **Không được** dùng trên đĩa CD/DVD, trò chơi điện tử, truyền hình và phát thanh; không được phối lại thành bản nhạc riêng hoặc đưa vào sản phẩm chỉ có nhạc; không được nhận là của mình hay đăng ký lên dịch vụ quản lý bản quyền (như Content ID). Bị khiếu nại bản quyền trên YouTube thì gửi chi tiết tới địa chỉ hỗ trợ ghi trên trang giấy phép. Phát chậm lại hoặc cắt đoạn để làm nhạc nền video là chỉnh sửa, được phép.

| File | Tên bản, tác giả | Trang | Dài | Dùng cho |
|---|---|---|---|---|
| mixkit-close-up-1167.mp3 | Close Up, Michael Ramir C. (nhạc doanh nghiệp) | https://assets.mixkit.co/music/1167/1167.mp3 | 1:35 | Video buồng máy tua-bin D-09 (26/10/2026), bản đang dùng |
| mixkit-infinity-440.mp3 | Infinity, Arulo (nhạc doanh nghiệp) | https://assets.mixkit.co/music/440/440.mp3 | 1:43 | Bản dự phòng nếu Trung không ưng Close Up |

## Mixkit, bộ 10 bài cho biến thể D-09b (thêm 26/10/2026)

Tải ngày 26/10/2026 từ `https://assets.mixkit.co/music/<mã>/<mã>.mp3`, cùng giấy phép ở trên. Số đo từng bài (độ to, nhịp ước, âm lượng quy đổi) và ma trận ghép với 8 bảng màu: `tai_san/so_tay_gu/dung/d09b_bien_the_mau_nhac.md`. Số đo thô: `so_do_nhac.jsonl` (sinh bằng `scripts/do_nhac_nen.py`).

| Mã | File | Tên bản, tác giả | Thể loại theo Mixkit | Dài |
|---|---|---|---|---|
| NH01 | mixkit-motivating-mornings-33.mp3 | Motivating Mornings, Ahjay Stelino | Corporate Music | 1:36 |
| NH02 | mixkit-your-breath-634.mp3 | Your Breath, Eugenio Mininni | Corporate Music | 3:56 |
| NH03 | mixkit-stylz-102.mp3 | Stylz, Ahjay Stelino | Corporate Music | 1:40 |
| NH04 | mixkit-digital-clouds-175.mp3 | Digital Clouds, Alejandro Magaña (A. M.) | Chillout | 1:41 |
| NH05 | mixkit-curiosity-480.mp3 | Curiosity, Diego Nava | Chillout | 1:40 |
| NH06 | mixkit-pop-track-03-729.mp3 | Pop Track 03, Lily J | Electronic | 1:37 |
| NH07 | mixkit-better-times-are-coming-173.mp3 | Better Times are Coming, Alejandro Magaña (A. M.) | Synthpop | 1:40 |
| NH08 | mixkit-tech-house-vibes-130.mp3 | Tech House vibes, Alejandro Magaña (A. M.) | Electronica | 1:42 |
| NH09 | mixkit-coffee-or-tea-1168.mp3 | Coffee or Tea, Michael Ramir C. | Electronica | 2:05 |
| NH10 | mixkit-just-keep-walking-963.mp3 | Just Keep Walking, Michael Ramir C. | Indie Pop | 2:05 |

**Âm lượng:** các bài này to hơn "Close Up" tới 7 dB. Đặt âm lượng theo cột "Âm lượng" của phụ lục, không giữ 0,16 chung cho mọi bài.

## Mixkit, bộ 5 bài dài cho video khoa học (thêm 27/10/2026)

Trung duyệt ngày 27/10/2026: thêm bài dài trên 125 giây, nhẹ, không lời, không quá sôi động, để video trên 2 phút khỏi phải nối lặp hoặc phát chậm. Tải ngày 27/10/2026 từ `https://assets.mixkit.co/music/<mã>/<mã>.mp3`, cùng giấy phép Mixkit Stock Music Free License ở trên (dữ liệu trang Mixkit ghi giấy phép này cho từng bài, `isAccessibleForFree: true`). Tên, tác giả, thể loại lấy từ dữ liệu cấu trúc của trang danh sách Mixkit.

Đo tiếng rè cao tần bằng `scripts/do_re_cao_tan.py` (Fourier từng đoạn 5 giây, mức tăng năng lượng trên 10 kHz và trên 16 kHz so với trung vị cả bài). Ngưỡng loại: trên 10 kHz tăng từ 5 dB hoặc trên 16 kHz tăng từ 8 dB. Mốc: NH02 Your Breath (có rè) 7,9 / 14,5 dB; NH09 Coffee or Tea (không rè) 2,9 / 7,1 dB. Đã đo 21 bài, giữ 5 bài dưới ngưỡng; 16 bài vượt ngưỡng không tải vào kho (danh sách ở phụ lục D-09b). Ngưỡng này (5 dB và 8 dB) dùng để quyết định có tải bài vào kho hay không; ngưỡng loại bài khi chọn nhạc của script gợi ý là 7 dB và 12 dB, ghi ở `08_giong_am_thanh_phu_de.md` mục 7.

| Mã | File | Tên bản, tác giả | Thể loại theo Mixkit | Dài | Rè (10k / 16k) |
|---|---|---|---|---|---|
| NH11 | mixkit-crying-sea-1023.mp3 | Crying Sea, Michael Ramir C. | Chillout | 2:20 | 2,4 / 4,6 dB |
| NH12 | mixkit-finding-myself-993.mp3 | Finding Myself, Michael Ramir C. | Ambient | 2:14 | 3,6 / 4,9 dB |
| NH13 | mixkit-vastness-184.mp3 | Vastness, Andrew Ev | Ambient | 3:50 | 1,4 / 6,8 dB |
| NH14 | mixkit-forest-walk-607.mp3 | Forest Walk, Eugenio Mininni | Electronica | 2:54 | 4,6 / 2,4 dB |
| NH15 | mixkit-no-turning-back-118.mp3 | No Turning Back, Alejandro Magaña (A. M.) | Electronica | 3:46 | 3,1 / 2,1 dB |

Máy đo không xác nhận được bài có lời hay không; Trung nghe lại trước khi dùng.

## Kho mở rộng 60 bài và sổ nhạc phân loại (thêm 27/10/2026)

Trung yêu cầu ngày 27/10/2026: thêm nhiều bài, phân loại theo độ dài, tiết tấu và tính chất. Trung chốt qua bảng chọn: nguồn Mixkit cộng Pixabay, 60 bài, file nhạc nằm ngoài git, tính chất chấm bằng mô hình máy, mã số cố định NH (bài cũ NH00–NH16 theo `tai_san/so_tay_gu/he_truc_dung.json`, Science Documentary là NH17, bài mới NH18–NH77), nhóm ghi thành cột riêng.

**Trạng thái: Trung nghe kiểm và chốt ngày 27/10/2026**, giữ nguyên nhãn của cả 78 bài, đưa sổ vào dùng chính thức (`duyet.json`).

**Sổ nhạc là nguồn sự thật:** `so_nhac.json` (mọi trường) và `so_nhac.md` (bảng đọc), sinh bằng `python3 scripts/lap_so_nhac.py`. Không sửa tay hai file đó.

| Bài | Nguồn | Cách chọn | Giấy phép |
|---|---|---|---|
| NH18–NH57 (40 bài) | Mixkit, tải ngày 27/10/2026 từ `https://assets.mixkit.co/music/<mã>/<mã>.mp3` | Lấy từ 34 trang tâm trạng của Mixkit (dữ liệu trang ghi tên, tác giả, thể loại, độ dài, giấy phép từng bài), bỏ các thể loại dễ có giọng hát hoặc lệch tông (hip hop, nhạc thiếu nhi, trap, đồng quê, rock, funk…), chia theo nhóm tâm trạng và độ dài | Mixkit Stock Music Free License, như mục trên |
| NH58–NH77 (20 bài) | Pixabay, tải ngày 27/10/2026 từ máy chủ `cdn.pixabay.com` (đường dẫn ghi ở trường `tai_tu`) | Tìm theo 11 cụm từ (upbeat corporate, focus background, dark ambient, sad piano, suspense…), **chỉ lấy bài dữ liệu Pixabay ghi không đăng ký Content ID và không phải nhạc AI tạo** (277 bài tìm được, 41 bài không đăng ký Content ID, 20 bài được chọn) | Pixabay Content License, như mục đầu. Không đăng ký Content ID nên đăng YouTube không bị khiếu nại tự động |

**Ba lớp phân loại** (cách tính nằm ở đầu `scripts/lap_so_nhac.py`):

| Lớp | Các mức | Đo bằng gì | Độ tin |
|---|---|---|---|
| Độ dài | ngắn dưới 1:30 · vừa 1:30–2:30 · dài trên 2:30 | Thời lượng file | Chắc chắn |
| Tiết tấu | chậm · vừa · nhanh | Mật độ khởi âm (số nốt bắt đầu mỗi giây; dưới 2,5 là chậm, từ 4,5 kèm nhịp ước từ 108 là nhanh) | Khá; nhịp ước có thể lệch nửa hoặc gấp đôi |
| Tính chất | tươi vui · tập trung, nhẹ · trầm, nghiêm · buồn · hồi hộp · hùng tráng | Nhãn tâm trạng của trang nguồn đối chiếu với mô hình CLAP `laion/clap-htsat-unfused` (`scripts/cham_tam_trang_nhac.py`, môi trường `.venv_nhac/`) | Thấp tới vừa: chỉ 22/78 bài hai nguồn khớp, 18 bài gần khớp, 35 bài lệch. Cột "Độ tin nhóm" ghi rõ từng bài |

Khi hai nguồn lệch, nhóm lấy theo nhãn trang nguồn; nhóm máy chấm ghi ở trường `nhom_may`. Mô hình gốc nghiêng hẳn về "tươi vui" và "hồi hộp" cho mọi bài nên script chuẩn hoá điểm từng nhóm theo cả kho trước khi chọn.

**Nghe lại và sửa nhãn:** mở `nghe_thu.html` trong thư mục này bằng trình duyệt, nghe, đổi nhóm hoặc tiết tấu bài nào sai, bấm nút tải `nghe_lai.json`, chép file đó vào đây rồi chạy lại `scripts/lap_so_nhac.py`. Nhãn Trung đã nghe được ưu tiên hơn máy.

**Cảnh báo trong cột Lưu ý của sổ:** "nghi rè" dùng ngưỡng cũ của `scripts/do_re_cao_tan.py` (trên 10 kHz tăng từ 5 dB hoặc trên 16 kHz tăng từ 8 dB). Với nhạc nền không khí có đoạn rất nhỏ, chỉ số này vượt ngưỡng dù không rè, nên 51/78 bài bị gắn cờ: cờ nghĩa là "nghe lại trước khi dùng", không phải bài hỏng. "Có thể có giọng hát" lấy từ mô hình, chỉ là gợi ý (9 bài).

**Kho còn thiếu:** nhóm hùng tráng chỉ có 1 bài; nhóm trầm và hùng tráng chưa có bài ngắn dưới 1:30. Muốn bổ sung thì tìm Pixabay theo "epic cinematic", "trailer", lọc không đăng ký Content ID.

**Tải lại khi mất máy:** 60 file mới không có trong git và không có trong bản sao lưu tuần. Tải lại bằng trường `tai_tu` của `so_nhac.json`.

## Bài đã bỏ khỏi kho

| Mã | File | Ngày | Lý do | File cũ nằm ở |
|---|---|---|---|---|
| NH25 | `mixkit-knobs-636.mp3` (Knobs, Eugenio Mininni) | 29/10/2026 | Trung nghe bản nháp N108 (CIC là gì): nhạc đoạn đầu rè, đau tai. Chỉ số đo rè cao tần của bài thấp (2,4 / 3,9 dB) nên script đo không bắt được; đỉnh gần 0 dBFS. | `_luu_tru/nhac_nen_da_bo_2026.10.29/`; đã thêm vào `nhac_loc.luon_loai` trong `tai_san/so_tay_gu/he_truc_dung.json`, script gợi ý tổ hợp không chọn lại |

Video đã dùng NH25 lúc bỏ: N108 CIC là gì, N97 thế chấp cầm cố (lô ngân hàng); các dự án Remotion `co_cau_nguon_dien_hien_nay`, `gia_do_xoay`, `the_he_te_bao_pin`, `thi_cong_gio_ngoai_khoi` (bản sao nhạc trong `public/` của từng dự án vẫn còn).
