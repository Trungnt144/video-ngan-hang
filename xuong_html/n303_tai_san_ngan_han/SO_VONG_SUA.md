# Sổ vòng sửa hình — N303 Tài sản ngắn hạn là gì

## Dựng và thử từng chương (theo `chuan_hinh_video_ngang.md` mục 4)

### Chương 1 (`0.00 – 26.89s`)
- **Chụp thử lần 1 (`anh_tinh/thu_c1`: `4.50s`, `13.50s`, `24.50s`):**
  - Phát hiện lỗi:
    1. `4.50s`: Cột `Nợ đến hạn` mới chạy lên `1 tỷ` (do `p1b` bắt đầu muộn ở `4.2s`); tổng số từ `15 > 12` từ.
    2. `13.50s`: Dòng `Thông tư 99/2025 · VAS 21` ở dải dưới bị xuống 2 dòng tràn vào vùng phụ đề (`day = 912 > 895`); bên trái có khung rỗng chưa gắn nhãn `100 tỷ`; tổng số từ `14 > 12`.
    3. `24.50s`: Thanh dài hạn mới chạy tới `36 tỷ` thay vì `40 tỷ` lúc `24.50s`; tổng số từ `19 > 12`.
  - Đã sửa trong `N.canh1`:
    1. Đẩy nhịp dâng cột `60 tỷ` (`0.4–2.3s`) và `25 tỷ` (`1.8–3.6s`) để tại `4.50s` hiện đủ `60 tỷ` đối chiếu `25 tỷ`, tách phần đáy tiền mặt đặc và phần trên nét đứt, rút gọn nhãn còn 11 từ.
    2. Ở câu 2 (`7.31–17.56s`), mở rộng trục thời gian `12 tháng` giữa màn hình kèm vòng chu kỳ kinh doanh `≤ 12 tháng`, thu gọn chữ dải dưới thành `VAS 21 · TT99/2025` có `white-space:nowrap` (12 từ, `0 lỗi kiemTra`).
    3. Ở câu 3 (`17.81–26.89s`), tách cột `100 tỷ` bên trái thành 2 ngăn nối sang thanh `Ngắn hạn 60 tỷ` (trước mốc `12 tháng`) và `Dài hạn 40 tỷ` (vượt mốc `12 tháng`, hoàn tất ở `22.2s`), giữ đúng 12 từ.
- **Phép thử tắt tiếng Chương 1 (sau khi sửa):**
  - Nhìn 3 ảnh `4.50s`, `13.50s`, `24.50s` không nghe tiếng: thấy ngay nghịch lý `Tài sản ngắn hạn 60 tỷ` nhưng phần lớn bị đóng khung nét đứt khi đối diện `Nợ đến hạn 25 tỷ`; tiếp theo thấy ranh giới `Mốc 12 tháng` chia `100 tỷ` tổng tài sản thành `Ngắn hạn 60 tỷ` (thu hồi trong vòng `≤ 12 tháng`) và `Dài hạn 40 tỷ` (thu hồi `> 12 tháng`). Khớp câu cơ chế Chương 1 trong `nhip.json`.

### Chương 2 (`26.89 – 44.64s`)
- **Chụp thử lần 1 (`anh_tinh/thu_c2`: `30.00s`, `34.50s`, `42.50s`):**
  - Phát hiện lỗi:
    1. `30.00s`: Ba hộp bậc thang gợi ý ở câu 1 hơi mờ (`globalAlpha = 0.45`), mũi tên `Độ thanh khoản giảm dần` chưa chạy hết chiều ngang lúc `30.00s`.
    2. `34.50s` & `42.50s`: Đường nét đứt nối từ thanh `60 tỷ` trên cao xuống đỉnh cột đi xuyên qua chữ `Tiền` và `Tồn kho` ở `y = 260`.
  - Đã sửa trong `N.canh2`:
    1. Nâng thanh 3 đoạn lên `y = 140`, dừng đường nối nét đứt ở `y = 250` (trên nhãn cột `y = 258`), hạ đỉnh khung cột xuống `y = 320` để đường nối không cắt qua chữ.
    2. Đẩy nhanh mũi tên `Độ thanh khoản giảm dần` hoàn tất lúc `29.7s` và tăng độ đậm 3 khối bậc thang ở câu 1 (`globalAlpha = 0.85`).
- **Phép thử tắt tiếng Chương 2 (sau khi sửa):**
  - Nhìn 3 ảnh `30.00s`, `34.50s`, `42.50s` không nghe tiếng: thấy thanh `Tài sản ngắn hạn 60 tỷ` chia 3 đoạn tỉ lệ `10 : 20 : 30` nối xuống 3 cột bậc thang `Tiền 10 tỷ` (thanh tốc độ đầy 100%, `Trả ngay`), `Phải thu 20 tỷ` (thanh tốc độ 55%, `Chờ thu`), `Tồn kho 30 tỷ` (cột cao nhất nhưng thanh tốc độ chỉ 25%). Khớp câu cơ chế Chương 2 trong `nhip.json`.

### Chương 3 (`44.64 – 62.15s`)
- **Chụp thử lần 1 (`anh_tinh/thu_c3`: `48.00s`, `53.00s`, `59.50s`):**
  - Phát hiện lỗi:
    1. `48.00s`: Hai ngăn trên của cột `60 tỷ` chưa hiện số `30 tỷ` và `20 tỷ`.
    2. `53.00s`: Hai đường gạch chéo dấu `X` trên hộp `Tồn kho 30 tỷ` và `Phải thu 20 tỷ` đi xuyên qua chữ giữa hộp.
  - Đã sửa trong `N.canh3`:
    1. Hiển thị đủ `30 tỷ`, `20 tỷ`, `10 tỷ` trong cột `60 tỷ` ở câu 1 (giữ tổng 11 từ).
    2. Ở câu 2, đặt dấu `✕` đỏ gọn bên phải chữ `Tồn kho 30 tỷ` và `Phải thu 20 tỷ` (không cắt qua chữ), sang câu 3 mới gạch chéo toàn bộ hai hộp xám khi chữ bên trong đã ẩn.
- **Phép thử tắt tiếng Chương 3 (sau khi sửa):**
  - Nhìn 3 ảnh `48.00s`, `53.00s`, `59.50s` không nghe tiếng: thấy cột `60 tỷ` (`30 tỷ + 20 tỷ + 10 tỷ`) đứng cao hơn `Nợ 25 tỷ`; sau đó hai khối `Tồn kho 30 tỷ ✕` và `Phải thu 20 tỷ ✕` chuyển xám và trượt tách sang trái, làm phần thực trả tụt xuống chỉ còn `Tiền mặt 10 tỷ`, thấp hơn `Nợ 25 tỷ` và lộ khối đỏ `Thiếu hụt 15 tỷ` ở giữa. Khớp câu cơ chế Chương 3 trong `nhip.json`.

### Chương 4 (`62.15 – 75.54s`, màn hình kết `75.54 – 85.54s`)
- **Chụp thử lần 1 & 2 (`anh_tinh/thu_c4`: `66.00s`, `71.50s`, `74.50s`):**
  - Phát hiện lỗi:
    1. Lần 1 (`71.50s` & `74.50s`): Hộp bộ lọc ở giữa bị trống chữ khi sang câu 2 vì nhãn `Vòng quay · Tuổi nợ` tắt ở cuối câu 1.
    2. Lần 2 (`71.50s`): Hộp đỏ `Trừ hàng ế` mở rộng chiều cao từ trên xuống làm viền đáy cắt ngang chữ `Trừ hàng ế` lúc `71.50s`; vạch quét dọc trong hộp lọc đi qua chữ `Vòng quay, tuổi nợ`; chữ `Dòng tiền thực` ở `y = 490` bị viền trên của cột xanh đang dâng lên cắt ngang lúc `71.50s`.
  - Đã sửa trong `N.canh4`:
    1. Giữ nhãn `Vòng quay, tuổi nợ` trong hộp lọc suốt cả chương 4 (dùng dấu phẩy thay dấu chấm giữa để tổng từ câu 2 đúng 12 từ).
    2. Giới hạn vạch quét dọc chỉ chạy trong vùng 2 thanh đo (`y: 334..428`), dưới chữ `Vòng quay, tuổi nợ`.
    3. Giữ nguyên chiều cao `135px` của hộp `Trừ hàng ế` khi trượt xuống và đưa nhãn `Dòng tiền thực` lên đỉnh cột bên phải (`y = 182`, ngang hàng với `60 tỷ` bên trái) để cột xanh dâng lên bên dưới không cắt qua chữ.
- **Phép thử tắt tiếng Chương 4 (sau khi sửa):**
  - Nhìn 3 ảnh `66.00s`, `71.50s`, `74.50s` không nghe tiếng: thấy cột `Sổ sách 60 tỷ` (3 ngăn) đi vào bộ lọc thẩm định `Vòng quay, tuổi nợ` (theo `Luật 32/2024 · Điều 94`), phần `Trừ hàng ế` màu đỏ bị tách rơi xuống dưới, chỉ phần tiền thu hồi thực tế chảy sang phải tạo thành cột `Dòng tiền thực`. Khớp câu cơ chế Chương 4 trong `nhip.json`.

---

## Ba vòng soát ảnh tĩnh toàn bộ 4 chương (Bước 6)

### Vòng 1 (`anh_tinh/v1` — 21 ảnh `--moi-chuong --moi-cau`)
- **Kết quả quét tự động ở Vòng 1:**
  - `n303_quet_kiem.mjs`: `0 loại lỗi kiemTra, 0 pageerror`.
  - `do_chat_luong_hinh.mjs --buoc 2`: `4/4 chương đạt` (chuyển động C1 `0.67`, C2 `1.00`, C3 `0.63`, C4 `0.88`).
  - `n303_tuong_phan.mjs --moi 2`: phát hiện `17 chữ dưới 4,5` (do màu vàng `#A65B00` trên nền `#FDEBC8` đạt `4,35:1`, màu cam `#B84318` trên nền `#FCE0D5` đạt `4,35:1`, và màu đỏ `#B82820` trên nền bán trong suốt của hộp `Thiếu hụt 15 tỷ` đạt `3,86:1`).
- **Lỗi phát hiện khi nhìn 21 ảnh `v1`:**
  1. Tương phản chữ màu vàng, cam, đỏ trong các hộp màu nhạt còn sát ngưỡng (`3,86–4,35 < 4,5`).
  2. Ở `c04a` (`71.20s`), mũi tên xanh và cột `Dòng tiền thực` bên phải mới nhú thấp (~35%), chưa cân xứng với hộp `Trừ hàng ế` ở giữa.
  3. Tỉ lệ chuyển động Chương 1 (`0.67`) và Chương 3 (`0.63`) mới vừa qua ngưỡng `0.60`.
- **Đã sửa sau Vòng 1:**
  1. Tăng độ đậm chữ và làm sáng nền hộp trong bảng màu `M`: `vang: #7D4300` / `vangNen: #FFF4DE`, `cam: #8F2D09` / `camNen: #FFF0E8`, `do: #8E1912` / `doNen: #FFECEB`; đổi nền hộp `Thiếu hụt 15 tỷ` sang nền đặc `M.doNen` (tương phản vượt `> 6,5:1`).
  2. Đẩy nhịp dâng cột `Dòng tiền thực` ở Chương 4 (`t2 + 0.4 -> t2 + 2.4`) để tại `71.20s` (`c04a`) cột xanh đã dâng cao rõ rệt.
  3. Bổ sung dải quét tiến độ trong Chương 1 và Chương 3.

### Vòng 2 (`anh_tinh/v2` — 21 ảnh `--moi-chuong --moi-cau`)
- **Kết quả quét tự động ở Vòng 2:**
  - `n303_quet_kiem.mjs`: `0 loại lỗi kiemTra, 0 pageerror`.
  - `n303_tuong_phan.mjs --moi 2`: `xong 43 giây, 0 chữ dưới 4,5` (đạt 100%).
  - `do_chat_luong_hinh.mjs --buoc 2`: Chương 1 lên `0.92`, Chương 2 `0.88`, Chương 3 `0.63`, Chương 4 `0.88` (`4/4 chương đạt`).
- **Lỗi phát hiện khi nhìn 21 ảnh `v2`:**
  1. Ở `c01_03.png` (`25.89s`) và `c03_03.png` (`61.15s`), dải băng chữ nhật mờ chạy dọc bên trong thanh `Ngắn hạn 60 tỷ`, `Dài hạn 40 tỷ` và `Thiếu hụt 15 tỷ` đi ngang qua phía sau chữ, tạo vệt nền xám/nâu cắt chữ.
  2. Ở Chương 3 Câu 2 (`49.84–54.74s`), hai ngăn `Tồn kho 30 tỷ` và `Phải thu 20 tỷ` khóa cùng lúc ở đầu câu nên nửa sau câu 2 ít chuyển động lớn.
- **Đã sửa sau Vòng 2:**
  1. Thay dải băng chữ nhật đi qua sau chữ ở Chương 1 và Chương 3 bằng thanh tiến độ mảnh (`h = 8–10px`) chạy sát mép đáy hộp (nằm hẳn bên dưới chữ, không bao giờ chạm chữ).
  2. Tách nhịp khóa ở Chương 3 Câu 2 thành hai nhịp nối tiếp khớp lời đọc: khóa và trượt `Tồn kho 30 tỷ` trước (`49.84–52.04s`), khóa và trượt `Phải thu 20 tỷ` tiếp theo (`51.64–54.44s`), đồng thời kéo dài nhịp gióng ở Câu 1 (`46.3–49.4s`).

### Vòng 3 (`anh_tinh/v3` — 21 ảnh `--moi-chuong --moi-cau` + 2 ảnh lưới)
- **Lỗi phát hiện khi rà soát trước khi gửi soát độc lập và cách sửa dứt điểm:**
  1. Lược bỏ hoàn toàn dải đồ thị nhỏ không nhãn ở đáy (`DAI`/`doThiDai`), chấm tiến độ và các khung trắng rỗng phía trên các cột thấp ở Chương 1, 2, 3, 4 để trên màn hình tuyệt đối không còn bất kỳ vật nào không mang nhãn đại lượng.
  2. Đặt nhãn `Tài sản ngắn hạn ≤ 12 tháng` ở `y = 275` (trên thanh đang kéo ngang ở câu 2 Chương 1) và căn nhãn `Dài hạn 40 tỷ` ở `cx = 580` (câu 3 Chương 1) để cạnh phải của thanh khi kéo ngang không bao giờ cắt qua chữ.
  3. Hợp nhất 2 hộp xám ở câu 3 Chương 3 thành khối có nhãn rõ ràng `Khóa 50 tỷ` đối diện `Tiền 10 tỷ`, `Thiếu 15 tỷ` và `Nợ 25 tỷ` (đúng 12 từ).
  4. Chỉnh `n303_anh_tinh.mjs` để mốc cuối chương cuối (`c04b`) lấy `man_hinh_ket.t - 0.8s` (`74.74s`, trước màn hình kết) thay vì chụp vào màn hình kết (`79.45s`).
- **Kết quả kiểm tra từng ảnh `v3` và 3 cổng máy đo:**
  - Xem toàn bộ 21 ảnh `v3` và 2 ảnh lưới (`n303_luoi_4_chuong.jpg`, `n303_luoi_giua_chuong.jpg`): không còn bất kỳ vệt cắt chữ, khung trống không nhãn hay chồng lấn nào; bố cục thoáng, rõ cơ chế từng chương.
  - `node xuong_html/n303_tai_san_ngan_han/n303_quet_kiem.mjs`: `xong: 0 loại lỗi kiemTra, 0 pageerror`.
  - `node xuong_html/n303_tai_san_ngan_han/n303_tuong_phan.mjs --moi 2`: `xong 43 giây, 0 chữ dưới 4,5`.
  - `node scripts/do_chat_luong_hinh.mjs xuong_html/n303_tai_san_ngan_han --buoc 2`:
    - `chương 1 (0–26.9s): chuyển động 0.75 · từ 12 · chữ nhỏ 7% → đạt`
    - `chương 2 (26.9–44.6s): chuyển động 1 · từ 7 · chữ nhỏ 3% → đạt`
    - `chương 3 (44.6–62.1s): chuyển động 1 · từ 12 · chữ nhỏ 2% → đạt`
    - `chương 4 (62.1–80.2s): chuyển động 0.88 · từ 12 · chữ nhỏ 1% → đạt`
    - `Tổng: 4/4 chương đạt` (mã thoát `0`).

---

## Soát độc lập lần 1 (`tai_san_ngan_han_soat_doc_lap_v1.md`) và Vòng 4 (`anh_tinh/v4`)

### Nhận xét từ phiên soát độc lập lần 1 (xem `v3`):
- **Chương 1 (Vừa):**
  - Hai mảng nền mờ hai bên vạch 12 tháng không có nhãn; khung viền xanh ở `c01_02.png` trống chữ bên trong; số `100 tỷ` ở `c01_03.png` đứng rời ở góc trên trái chưa có ngoặc nối với hai thanh `60 tỷ` và `40 tỷ`; chuỗi `VAS 21, TT99/2025` khác `Thông tư 99/2025 · VAS 21` trong `du_kien.json`.
- **Chương 2 (Nặng):**
  - Ở `c02_01.png` ba khối `10 tỷ`, `20 tỷ`, `30 tỷ` chưa ghi tên khoản mục (`Tiền`, `Phải thu`, `Tồn kho`) và mũi tên `Thanh khoản` không ghi rõ chiều giảm dần.
  - Ở `c02_02.png`–`04.png` ba cột cao dần từ 10 tỷ lên 30 tỷ đặt trên mũi tên ngang không nhãn làm người xem không thấy cơ chế tốc độ đổi thành tiền giảm dần.
- **Chương 3 (Vừa):**
  - Ở `c03_01.png` ba ngăn `30 tỷ`, `20 tỷ`, `10 tỷ` thiếu tên khoản mục; ở `c03_02.png` ngăn `10 tỷ` mất chữ `Tiền` và cột `25 tỷ` mất chữ `Nợ`; ở `c03_03.png` xuất hiện số `50 tỷ` (`Khóa 50 tỷ`) nằm ngoài `du_kien.json`, mũi tên đỏ bên trái hộp `Thiếu 15 tỷ` xuất phát từ khoảng trống và hộp `Thiếu 15 tỷ` cao gần bằng cả hộp `Nợ 25 tỷ`.
- **Chương 4 (Nặng):**
  - Hình ở `c04_01.png` và `c04_02.png` giống sơ đồ các thẻ chữ đóng khung rỗng nối mũi tên; hộp `Dòng tiền thực` không có số liệu và cao gần bằng hộp `60 tỷ` dù đã trừ hàng ế.

### Cách sửa dứt điểm ở Vòng 4 (`anh_tinh/v4`):
1. **Chương 1 (`N.canh1`):**
   - Xoá hai mảng nền mờ không nhãn; đưa nhãn `Ngắn hạn ≤ 12 tháng` vào chính giữa thanh xanh ở `c01_02.png`; sửa chuỗi văn bản pháp luật khớp chính xác `Thông tư 99/2025 · VAS 21` trong `du_kien.json`.
   - Ở `c01_03.png`, vẽ khối `100 tỷ` bên trái nối bằng ngoặc nhọn chẻ nhánh trực tiếp sang hai thanh `Ngắn hạn 60 tỷ` (trước vạch `12 tháng`) và `Dài hạn 40 tỷ` (vượt vạch `12 tháng`), giữ đúng 12 từ.
2. **Chương 2 (`N.canh2`):**
   - Ở `c02_01.png`, ghi đủ tên 3 nhóm `Tiền`, `Phải thu`, `Tồn kho` trong thanh `60 tỷ` và vẽ mũi tên dốc xuống từ trái sang phải có nhãn rõ `Thanh khoản giảm dần` (11 từ).
   - Ở `c02_02.png`–`04.png`, thay 3 cột cao dần bằng **3 bậc thang hạ dần độ cao từ trái sang phải** (chiều cao bậc = độ thanh khoản giảm dần: `Tiền 10 tỷ` cao `420 px` → `Phải thu 20 tỷ` hạ xuống `280 px` → `Tồn kho 30 tỷ` thấp nhất `150 px`; bề rộng khối tỉ lệ đúng quy mô `10 : 20 : 30` là `300 px : 450 px : 600 px`) kèm mũi tên dốc xuống `Thanh khoản giảm dần` / `Chậm` (tối đa 12 từ).
3. **Chương 3 (`N.canh3`):**
   - Ở `c03_01.png`, đối chiếu trực tiếp hai cột thống nhất `Tài sản ngắn hạn 60 tỷ` (`480 px`) và `Nợ đến hạn 25 tỷ` (`200 px`) (11 từ, không có ngăn trống không nhãn).
   - Ở `c03_02.png`, tách cột 60 tỷ thành đủ 3 ngăn có cả tên lẫn số: `Tồn kho 30 tỷ` và `Phải thu 20 tỷ` chuyển xám trượt sang phải gom vào ngoặc đỏ `Khóa`, để lại `Tiền 10 tỷ` ở đáy (12 từ).
   - Ở `c03_03.png`, bỏ hẳn khối `50 tỷ` ngoài `du_kien.json` và bỏ mũi tên lơ lửng; vẽ theo tỉ lệ chính xác `1 tỷ = 14 px`: cột `Tiền mặt 10 tỷ` (`140 px`, `y: 560..700`) đối diện cột `Nợ đến hạn 25 tỷ` (`350 px`, `y: 350..700`), ở giữa là khối đỏ `Thiếu −15 tỷ` (`210 px`, `y: 350..560`) lấp khớp từng pixel khoảng chênh chiều cao giữa `10 tỷ` và `25 tỷ`, khớp chuỗi `−15 tỷ` trong `du_kien.json` (12 từ).
4. **Chương 4 (`N.canh4`):**
   - Thay hoàn toàn sơ đồ thẻ chữ nối mũi tên bằng **phép trừ chiều cao cột tỉ lệ thật**:
     - Ở `c04_01.png`, cột `Sổ sách 60 tỷ` (`480 px`) bị vạch cắt đỏ nối từ hộp `Vòng quay, tuổi nợ` quét dọc từ đỉnh xuống mức thực thu, kèm `Luật 32/2024 · Điều 94` (12 từ).
     - Ở `c04_02.png`, biểu diễn trực tiếp phép trừ hình học: cột `Sổ sách 60 tỷ` (`480 px`) `−` khối `Hàng ế, quá hạn` tách ra ở giữa (`360 px`) `=` cột xanh `Tiền thực 10 tỷ` ở bên phải (`120 px`, thấp bằng đúng phần đáy còn lại của cột 60 tỷ, nối bằng đường gióng ngang nét đứt) (12 từ).
- **Kết quả 3 cổng máy đo ở Vòng 4 (`anh_tinh/v4`):**
  - `n303_quet_kiem.mjs`: `xong: 0 loại lỗi kiemTra, 0 pageerror`.
  - `n303_tuong_phan.mjs --moi 2`: `xong 43 giây, 0 chữ dưới 4,5`.
  - `do_chat_luong_hinh.mjs --buoc 2`: `4/4 chương đạt` (C1 `0.75`, C2 `1.00`, C3 `0.88`, C4 `1.00`, mã thoát `0`).
- **Kết quả soát độc lập lần 2 (`tai_san_ngan_han_soat_doc_lap.md`, xem `v4`):**
  - Cả 4/4 chương đều đoán đúng câu cơ chế ở Bước 1 (phép thử tắt tiếng).
  - Mức chấm: **0 Nặng · 2 Vừa · 1 Nhẹ · 1 Đạt**.
  - Kết luận: **`ĐẠT để chạy pha máy`**.
