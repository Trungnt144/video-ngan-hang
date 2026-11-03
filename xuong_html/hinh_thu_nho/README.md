# Khuôn hình thu nhỏ L1–L5 và NH

Khuôn dựng hình thu nhỏ YouTube của kênh Chuyện nghề Điện theo 5 bố cục Trung chốt 27/10/2026, và của kênh Chuyện nghề Ngân hàng theo bố cục NH (từ 30/10/2026, mục "Kênh Chuyện nghề Ngân hàng" dưới đây). Quy tắc phong cách (phông, màu, ảnh được dùng, giới hạn YouTube): `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md` mục 0 và mục 4 (kênh Điện), mục 0b (kênh Ngân hàng). Thư mục này chỉ là công cụ.

## Kênh Chuyện nghề Ngân hàng (bố cục NH)

Kê khai ghi `"kenh": "ngan_hang"`. Không ghi thì là kênh Điện và khuôn dựng y như trước (đã thử lại `vi_du/cat_giam.json`, `vi_du/tuabin_gio.json` ngày 30/10/2026: từng điểm ảnh giống bản khuôn cũ).

1. **Lấy hình vẽ từ video.** Nền video có lưới ô hoặc vệt sáng thì thêm `--nen '<màu nền>' --an '#stage > svg.lop'` (bộ chọn lớp nền dò bằng `--liet_ke`) để vùng cắt không lộ mép. Cắt gọn theo nét: `python3 cong_cu.py cat_net <ảnh chụp> khung/<mã>/<tên>.png x,y,w,h` (vùng thô trên khung 1920×1080). Bước chụp: Dựng lại từ mã: `node lay_hinh.mjs <xuong_html/<video>/trang.html> <giây> khung/<mã>/<tên>.png --an_chu --he_so 2 --cat x,y,w,h` mở trang dựng, gọi `seek(giây)`, ẩn mọi nhãn chữ cùng khung nền của nhãn (`--an_chu`), ẩn thêm phần tử theo bộ chọn CSS (`--an "#hud"`), chụp vùng `--cat` (toạ độ khung 1920×1080) ở hệ số 2–3. Chọn giây: xem ảnh tĩnh `anh_tinh/` của dự án dựng; dò phần tử cần ẩn: `--liet_ke`. Chỉ đọc trang, không sửa video. Video Remotion (`xuong_dai/`) không có công tắc ẩn chữ thì cũng cắt từ mp4, tránh vùng phụ đề, đặt `the_hinh`. Cắt từ mp4 (khi không còn mã dựng): `xuong_thu_hyperframes/bin/ffmpeg -ss <giây> -i <mp4> -frames:v 1 -vf crop=w:h:x:y khung/<mã>/<tên>.png`. Ghi lệnh vào `"nguon_hinh"` của kê khai để sinh lại (`khung/` ngoài git). Trước khi động vào video, tra `du_lieu/luu_tru_drive/MUC_LUC.md` xem mã dựng còn trên máy không.
2. **Kê khai** (mẫu `vi_du/nh_*.json`): mỗi hình `"bo_cuc": "NH"`, trường:

| Trường | Ý nghĩa | Mặc định |
|---|---|---|
| `nen` | màu nền phẳng, lấy màu nền của video | `#f4f1ec` |
| `anh`, `hop`, `vua`, `vi_tri` | hình vẽ; `hop` [x, y, w, h] trên khung 1280×720; `vua` `contain` (giữ trọn hình) hoặc `cover` (lấp kín hộp, cắt bớt); `vi_tri` như object-position | không hình; cả khung; `contain` |
| `phu_anh` | thêm hình vẽ khác (như kênh Điện) | không |
| `dong1`, `dong2` | hai dòng chữ, cả câu 4–8 từ; dòng 1 là thuật ngữ, chủ đề | bắt buộc `dong1` |
| `nhan_manh`, `mau_nhan` | (thêm 01/11/2026, Trung yêu cầu tô màu riêng chữ "chú ý") cụm chữ (hoặc mảng cụm) nằm trong `dong2` được tô `mau_nhan`; phần còn lại giữ `mau2`. `dong2` có `\n` thì chia nhiều hàng cùng cỡ chữ như `dong1` (khi câu dài mà không muốn thu dưới 76px) | không; `#ffd23f` |
| `co1`, `co2` | cỡ chữ (điểm ảnh trên khung 1280×720); dòng nào dài hơn hộp chữ tự thu, tối đa còn 80% | 128, 80 |
| `mau1`, `mau2` | màu chữ, lấy màu đậm trong bảng màu của video | `#1d1b26` |
| `chu` | hộp chữ `{x, y, w, canh}`, `canh` là `trai`, `giua`, `phai` | `{60, 120, 1160, trai}` |
| `the_chu` | thẻ nền sau khối chữ `{nen, bo}` khi chữ đặt lên hình | không |
| `nhan_kenh` | góc nhãn kênh: `tren_phai`, `tren_trai`, `duoi_trai`; mẫu đã chốt dùng `tren_trai` | `tren_phai` |
| `xep` | `chu_tren`: khuôn đặt chữ ngay dưới nhãn kênh rồi tự đặt hình vẽ vào phần còn lại phía dưới; `chu_duoi`: chữ sát lề dưới, hình vẽ lấp khoảng giữa nhãn kênh và chữ (dòng 2 phải ngắn để không lấn góc dưới phải). Cả hai bỏ qua `hop`, `chu.y` | không |
| `thu_min` | mức thu nhỏ nhất khi dòng dài hơn hộp chữ (khuôn vẫn báo khi dưới 76px); thuật ngữ dài giữ một hàng đặt 0.6 | 0.8 |
| `dong1` có `\n` | thuật ngữ dài chia hai hàng chữ cùng cỡ (hợp bố cục chữ cạnh hình, cột chữ ở phải) | một hàng |
| `the_hinh` | `true`: hình vẽ thành thẻ bo góc có bóng nhẹ, dùng khi vùng cắt có nền chuyển màu, nền 3D, khung cắt từ mp4 | không |
| `khoang` | đổi khoảng giãn cách cho riêng hình này, ví dụ `{"hinh": 56}` | luật giãn cách dưới đây |
| `le_duoi` | lề dưới của hình vẽ khi `xep` là `chu_tren` | 36 |

   **Luật giãn cách** (bảng phong cách mục 0b quy tắc 9, Trung yêu cầu 30/10/2026): khuôn đo mép thật của nét chữ kể cả dấu tiếng Việt (đo bằng canvas, không dùng hộp dòng), rồi giữ: nhãn kênh tới đỉnh dấu dòng 1 ≥ 36, giữa hai dòng đúng 22, chữ tới hình vẽ ≥ 44, nhãn tới hình vẽ ≥ 28, lề ngoài ≥ 44 (điểm ảnh trên khung 1280×720; hằng `KHOANG_NH` trong `khuon.html`). Mép hình vẽ tính trên phần có nét, bỏ nền trùng màu góc ảnh. Chữ sát nhãn thì khuôn tự dời xuống; chữ đè hoặc sát hình thì cảnh báo. Xem thử in tỉ lệ chiều cao chữ và hình (nên chữ 30–40%, hình ≥ 25%). Hình vẽ nên cắt gọn chỉ còn vật chính (`--cat` của `lay_hinh.mjs`).

   Nhãn kênh (logo đồng xu chữ "đ" từ `tai_san/kho_hinh_chung/chung/logo/logo_kenh_ngan_hang_anh.js` và chữ "Chuyện nghề Ngân hàng") khuôn tự vẽ. Phông Be Vietnam Pro (bản Black cài trên máy, bản ExtraBold trong kho hình chung).
3. **Xem thử** `node xuat.mjs <kê khai> --thu`. Với kênh Ngân hàng, `xuat.mjs` bỏ kiểm trùng ảnh thật theo sổ ảnh, kiểm luân phiên L1–L5 và kiểm mã công thức C/A; thêm: đo tương phản từng dòng chữ với nền (mức 95% điểm ảnh nền đạt, tối thiểu 4,5:1, in ra từng dòng), cảnh báo dòng nhỏ hơn 76 điểm ảnh (10 điểm ảnh ở cỡ điện thoại), câu ngoài 4–8 từ, chữ lấn góc dưới phải; xuất thêm `<id>_320.png`, `<id>_168.png`, bảng soát `luoi.jpg` đặt ba cỡ cạnh nhau.
4. **Trang so sánh** cho Trung chọn một lượt: viết cấu hình theo mẫu `vi_du/nh_trang_mau_2026.10.30.json` rồi `python3 trang_so_sanh.py <cấu hình> san_pham/<thư mục tài liệu>/<tên>.html` (mỗi hình ba cỡ 1280×720, 320×180, 168×94, ảnh nhúng sẵn trong trang).
5. **Xuất thật** như kênh Điện (bước 5 dưới đây), sau khi Trung chọn.

## Bìa dọc cho Reels, Shorts, TikTok (từ 30/10/2026)

Bìa của Reel Facebook là ảnh 9:16; tải hình thu nhỏ ngang 16:9 lên thì Facebook cắt lấy dải giữa và mất chữ (lỗi ở 4 Reel kênh Điện, Trung chốt sửa 30/10/2026). Lệnh `node xuat.mjs <kê khai> --doc --thu` dựng lại hình đã chọn (`"chon"`) trên khung 1080×1920 vào `xem_truoc/<chu_de>_doc/`, kèm `luoi.jpg` (cả khung, phần còn lại khi cắt 4:5 ở bảng tin và 1:1, cỡ lưới điện thoại); bỏ `--thu` thì xuất `san_pham/<video>/yyyy.mm.dd.<chu_de>_hinh_thu_nho_doc_v<n>.jpg`. Nhãn kênh trong dải 4:5 (y 190–1090 trên khung 720×1280); khối chữ trong dải 16:9 giữa khung (y 437–843) vì Reel đăng bằng video ngang thì bảng tin chỉ hiện dải đó của bìa; soát cảnh báo khi ra ngoài. `chia` thành nửa trên, nửa dưới; `dai_anh` thành các cột dọc; vòng phóng giữ vòng đầu, đặt giữa trên chữ; mũi tên, chip, ảnh ghép, nhãn số, bóng thoại bị bỏ vì toạ độ theo khung ngang. Chỉnh riêng bản dọc: ghi `"doc": {...}` trong hình, trường trong đó thay trường cùng tên. Chưa làm cho kênh Ngân hàng.

## Làm hình thu nhỏ cho một video mới

1. Chọn ảnh theo ba quy tắc cứng ở bảng phong cách mục 0: ảnh thật làm nền, mỗi video một file ảnh nền khác, bám đúng nội dung video. Chỉ dùng ảnh được đăng: Pexels, Unsplash (bản miễn phí, không phải Unsplash+), CC0, phạm vi công cộng; khung 3D của chính video chỉ vào vòng phóng L5. Claude tự tải ảnh mới không cần hỏi từng ảnh (Trung chốt 28/10/2026), lưu vào `tai_san/anh_that/`, ghi vào `tai_san/anh_that/so_anh.md` và báo danh sách khi giao. `xuat.mjs` so theo mã ảnh gốc ở cột 2 sổ ảnh (số Pexels, mã Unsplash, tên gốc Commons), nên mỗi ảnh tải về phải ghi một dòng sổ với cột 2 là mã gốc; công cụ báo khi ảnh nền đã dùng cho video khác, kể cả cùng ảnh gốc lưu dưới tên file khác, và dừng khi xuất thật (`--cho_trung` để bỏ qua, chỉ khi Trung đồng ý). Khung 3D không chữ của video Remotion: xem mục "Khung sạch" dưới đây.
   Chọn bố cục theo quy tắc cứng 4 (luân phiên, Trung chốt 28/10/2026): không trùng bố cục với hình xuất ngay trước, L3 tối đa 2 trong 6 hình gần nhất. `xuat.mjs --thu` in bố cục 5 hình gần nhất và báo khi lệch nhịp; xuất thật thì dừng (`--cho_trung_bo_cuc` để bỏ qua, chỉ khi Trung đồng ý).
2. Viết kê khai `san_pham/<video>/tai_nguyen/dang_bai/hinh_thu_nho.json`, chép từ `vi_du/tuabin_gio.json` hoặc `vi_du/cat_giam.json` rồi sửa. Nên viết đủ 5 bố cục để Trung chọn; số trên hình phải lấy từ file nguồn kiểm chứng của video.
3. Xem thử: `node xuat.mjs <kê khai> --thu` → `xem_truoc/<chu_de>/` (PNG từng hình và `luoi.jpg` có hàng cỡ điện thoại). Đọc kỹ các dòng CẢNH BÁO. Cần đặt mũi tên, vòng phóng thì thêm `--luoi` để phủ lưới toạ độ.
4. Gửi `luoi.jpg` cho Trung chọn. Ghi id hình được chọn vào `"chon"`.
5. Xuất thật: `node xuat.mjs <kê khai>` → bản gốc PNG mọi hình vào `san_pham/<video>/tai_nguyen/hinh_thu_nho_goc/`, hình được chọn thành `san_pham/<video>/yyyy.mm.dd.<chu_de>_hinh_thu_nho_v<n>.jpg` (1920×1080, dưới 2 MB).

Chạy trong thư mục này. Cần mạng để tải phông Google Fonts khi chụp.

## Cách viết kê khai

```json
{
  "video": "2026.10.27.cat_giam",      // thư mục trong san_pham/ (cần khi xuất thật)
  "chu_de": "cat_giam_cong_suat",      // dùng đặt tên file, không dấu
  "phien_ban": 1,
  "thoi_luong": "1:34",                // chỉ để vẽ nhãn thời lượng giả trong bảng soát
  "chon": "L1",                        // id hình tải lên (cần khi xuất thật)
  "hinh": [ { "id": "L1", "bo_cuc": "L1", ... } ]
}
```

Đường dẫn ảnh tính từ gốc thư mục Media. Toạ độ tính trên khung 1280×720. Trường chung cho mọi hình:

| Trường | Ý nghĩa | Mặc định |
|---|---|---|
| `id` | tên hình, không dấu cách | bắt buộc |
| `bo_cuc` | `L1` … `L5` | bắt buộc |
| `anh` | ảnh nền | bắt buộc |
| `vi_tri` | phần ảnh giữ lại khi cắt cho vừa khung, như `object-position` (`"50% 70%"` = giữ phần dưới) | `"50% 50%"` |
| `phong`, `goc_phong` | phóng to ảnh nền và tâm phóng | 1, `"50% 50%"` |
| `loc` | bộ lọc ảnh CSS; `"none"` để giữ nguyên ảnh (nên dùng cho khung 3D) | theo bố cục |
| `lop` | lớp tối phủ lên ảnh (CSS `background`) | theo bố cục |
| `phu_anh` | ảnh ghép chồng lên nền, dưới chữ (người, vật đã tách nền): mảng `{"anh", "x", "y", "w", "lat", "mo"}`; `lat: true` lật ngang; `mo` làm mờ dần hai mép trái phải theo phần trăm bề rộng, che viền thẳng khi ảnh gốc cắt ngang người ở mép khung. Tách nền: `swift tach_nen.swift <ảnh vào> <ảnh ra .png>` (Vision của macOS), lưu vào `tai_san/anh_that/tach_nen/` (ngoài git). Chọn ảnh người có đủ tay chân trong khung ảnh gốc: chỗ ảnh gốc cắt ngang người sẽ cụt lơ lửng khi ghép vào giữa khung (Trung báo "mất tay" 28/10/2026). Sau khi tách nền chạy `python3 lam_vien.py <ảnh gốc> <ảnh tách nền .png> <ảnh ra .png>` (ảnh phông trắng thêm `--nen_sang 222 --vung 0,0,1,<tỉ lệ tới cổ>` để bỏ phông lọt kẽ tay) để xoá viền sáng màu nền cũ, thu gọn mép mềm và làm nét (Trung chê viền người xấu 28/10/2026). `bong`: độ đậm bóng đổ quanh ảnh ghép 0–1 (0 là không bóng), người ghép lên tường sáng nên để khoảng 0,35 | không có |
| `bong_thoai` | bóng thoại cho nhân vật (nền trắng viền đen, chữ Nunito 900): mảng `{"chu", "x", "y", "duoi", "mui", "co"}`; `x`, `y` góc trái trên của bóng; `duoi` vị trí chân đuôi theo phần trăm bề rộng bóng (mặc định 30); `mui` mũi đuôi lệch trái (0) hay phải (100) (mặc định 20); `co` cỡ chữ (mặc định 46). Nhân vật hoạt hoạ vẽ bằng SVG để ở `tai_san/nhan_vat/`, ghép qua `phu_anh` | không có |
| `nhan` | nhãn số lớn nền vàng viền đen, chữ Anton: mảng `{"chu", "x", "y", "co"}` (`co` cỡ chữ, mặc định 92). Số trên nhãn phải lấy từ nguồn kiểm chứng của video, trừ khi Trung chỉ định và đã ghi vào `ghi_chu` | không có |
| `dai_anh` | thay ảnh nền bằng dải nhiều ảnh dọc xếp cạnh nhau, đường ngăn trắng nghiêng (Trung yêu cầu 28/10/2026, video kể nhiều thứ theo thứ tự, ví dụ sáu loại nhà máy điện): mảng `{"anh", "vi_tri", "phong", "nhan"}` theo thứ tự trái sang phải; `nhan` là tên ô (chữ Nunito trên dải tối), đặt ở độ cao `nhan_y` (mặc định 120, dưới nhãn kênh). Dùng được ở L1, L2, L3, L5. Ghi `mau` vì khuôn chỉ đo màu ô đầu. Ô hẹp và cao (6 ô thì mỗi ô khoảng 213×720), nên chọn ảnh có vật chính nằm ở nửa trên khi dùng L1, L3, L5 (nửa dưới bị chữ che); `xuat.mjs` kiểm trùng ảnh nền cho từng ô | không có |
| `chia` | chia đôi khung cho video so sánh hai thứ: `{"anh", "vi_tri", "phong", "goc_phong", "loc"}` là ảnh nửa phải; `anh` thành ảnh nửa trái; đường chéo trắng ở giữa; mỗi nửa rộng 700 nên ảnh dọc giữ được mặt người. Dùng với L1, L3, L5; nên ghi `mau` và `lop` (ví dụ lớp xanh nửa trái, cam nửa phải) vì khuôn chỉ đo màu ảnh trái | không chia |
| `cong_thuc` | mã kiểu chữ và kiểu ảnh của hình theo `tai_san/so_tay_gu/cong_thuc_hinh_thu_nho.md`, dạng `"C2-A6"` hoặc `"C8-A4+A6"` (mã A đầu là kiểu ảnh chính); `xuat.mjs` cảnh báo khi trùng cả kiểu chữ và kiểu ảnh chính với hình xuất ngay trước, hoặc một kiểu chữ quá 3 lần trong 6 hình gần nhất, và nhắc khi thiếu (chỉ cảnh báo, không dừng xuất) | không có |
| `mau` | màu chữ nhấn: `lua` (vàng-cam), `bang` (trắng-xanh lơ), `hong`; bỏ trống để khuôn tự chọn theo màu tương phản với ảnh | tự chọn |

Trường riêng từng bố cục:

| Bố cục | Trường |
|---|---|
| L1 Thời sự kịch tính | `dong1` (trắng), `dong2` (màu nhấn); `dia_danh` (nhãn ghim góc trái trên, chỉ ghi khi địa danh đã chắc); `mui_ten`: `{"d": "M x,y C ...", "day": "to"}` (đường cong SVG, đầu mũi tên ở điểm cuối; bỏ `day` là mũi tên vừa); `chip`: `{"chu", "x", "y"}` nhãn đỏ |
| L2 Thư thái tối giản | `chu_lon`, `chu_phu`, `the_may` (nhãn chữ máy đánh góc trái trên), `doc` (toạ độ dọc khối chữ, mặc định 330) |
| L3 Câu hỏi đặt dưới ảnh | `dong1`, `dong2` |
| L4 Con số lớn | `so`, `so_tren` (dòng nhỏ phía trên số, có thể bỏ), `don_vi`, `ghi_chu` (mảng các dòng chữ máy đánh, ghi nguồn số), `co_so` (cỡ số, mặc định 240), `nen` (màu nền nửa trái) |
| L5 Vòng phóng to | `dong1`, `dong2`; `vong`: `{"anh", "vi_tri", "phong", "x", "y", "d"}` (góc trái trên và đường kính vòng); `diem`: `[x, y]` điểm được phóng (vẽ hai đường nối); `chip` |
| Nhiều vòng nhỏ (L3, L5) | `vong` là mảng các vòng `{"anh", "vi_tri", "phong", "x", "y", "d", "nhan", "noi"}`: `nhan` là nhãn chữ dưới vòng (Nunito đậm trên dải tối), `noi`: `[x, y]` vẽ một đường đứt nét từ điểm đó tới mép vòng; mọi đường nối vẽ dưới các vòng. Ví dụ: hình video cơ cấu nguồn điện hiện nay (4 vòng nhiệt điện, thuỷ điện, gió, mặt trời nối về chiếc điều hoà) |

## Khuôn tự soát gì

Mỗi hình in ra bố cục, cỡ bản gốc, màu chữ đã chọn, và CẢNH BÁO khi: chữ quá 7 từ hoặc dòng tô màu quá 4 từ; khối chữ rộng hơn 900 điểm ảnh (khuôn tự thu cỡ chữ, tối đa còn 80%); chữ, nhãn, vòng lấn vào góc dưới phải 220×110 (nhãn thời lượng); ảnh không nạp được; ảnh không đủ 3840 điểm ảnh cho vùng nó chiếm (khi đó bản gốc chỉ 1920×1080, không phóng to ảnh nhỏ).

Khuôn không soát: số đã kiểm chứng chưa, ảnh có giấy phép đăng chưa, chữ có đúng nội dung video không, mũi tên có chỉ đúng vật không. Mấy việc này phải tự xem `luoi.jpg`.

## Khung sạch (khung 3D không chữ) từ video Remotion

- Video có cảnh Blender (như `xuong_dai/tuabin_gio/`): ảnh gốc từng khung ở `public/blender/f_NNNN.jpg` (số khung = giây × 30), chép sang `khung/`.
- Video Three.js: thêm công tắc `sach` vào `src/Video.tsx` như `xuong_dai/cat_giam/` (tắt nhãn, thẻ, phụ đề; mặc định tắt nên video không đổi), rồi `npx remotion still <Composition> <ra.png> --frame=N --scale=2 --props='{"sach":true}' --gl=angle` (3840×2160).
- `khung/` nằm ngoài git; sinh lại được theo hai cách trên.

## Các file

`khuon.html` (khuôn), `xuat.mjs` (chụp và xuất), `cong_cu.py` (làm JPG dưới 2 MB, bảng soát, bản thu nhỏ, đo tương phản), `lay_hinh.mjs` (chụp hình vẽ từ trang dựng của video HTML, kênh Ngân hàng), `trang_so_sanh.py` (trang so sánh để Trung chọn), `tach_nen.swift` (tách người, vật khỏi nền ảnh cho trường `phu_anh`), `vi_du/` (kê khai mẫu của hai video đầu), `chup.mjs` và `mau_v1.html`, `mau_v2.html`, `mau_v3.html` (các bản mẫu thử ngày 27/10/2026, giữ để tra; không dùng cho video mới).
