# Lỗi hay gặp khi dựng video bằng trang HTML (LM-03) và cách sửa

**Phiên bản:** 1.0 · **Ngày:** 2026-10-27

Nguồn: `xuong_html/cong_cu/KET_QUA_DO.md` mục 6 và mục 8; sổ vòng sửa `san_pham/2026.10.27.duyet_phong_cach_opus55/tai_nguyen/ban_nhap/NHAT_KY_VONG_SUA.md` (3 vòng, mẫu lịch sử AI 60 giây); lần thử kỹ thuật 27/10/2026 (`xuong_html/2026.10.27_thu_ky_thuat/SO_VONG_SUA.md`). Lỗi mới thì thêm một dòng ở đây và một dòng vào `90_bai_hoc.md`.

## Công cụ và môi trường

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| `playwright-core` báo thiếu Chromium 1248, ffmpeg 1013 | `playwright-core` bản mới nhất gắn với trình duyệt khác bản đang có trong `~/Library/Caches/ms-playwright/` (chỉ có chromium 1234, ffmpeg 1011) | Dùng đúng `playwright-core@1.62.0` đã ghim trong `xuong_html/cong_cu/package.json`, chạy `npm install` trong thư mục đó. Không chạy `npm update` |
| Trang lỗi, khung đầu trắng hoặc thiếu chữ | Thư viện (GSAP, Three.js) và phông nạp từ mạng, máy đang không có internet | Kiểm mạng trước khi xuất; cần chạy offline thì tải thư viện về cạnh `trang.html` |
| Khung 0 chụp trước khi trang dựng xong | Phần dựng bất đồng bộ (nạp phông, tạo cảnh) chưa xong | Đặt `window.__san_sang = false` đầu script, `true` khi xong; công cụ chờ cờ này. Gọi `document.fonts.load` ngay lúc script chạy. Còn thiếu thì thêm `--cho-ms 1500` |
| Video nhúng đứng hình hoặc lệch, Worker chạy nhanh hơn trang | `<video>` và Web Worker chạy giờ thật, không theo đồng hồ ảo | Thay bằng ảnh hoặc Canvas vẽ từ `t`; không dùng Worker. Âm thanh ghép sau |
| `--co-chromium "--ten-co ..."` báo tuỳ chọn không hợp lệ | `parseArgs` coi giá trị bắt đầu bằng `--` là tuỳ chọn mới | Viết `--co-chromium=--ten-co` |
| Xuất song song (`--song-song N`) ra hình khác bản một trang | Trang không xác định: dùng `Math.random` ngoài hạt giống, nguồn mạng, giờ thật | Sửa trang cho xác định (hợp đồng điều 2, 9) hoặc để mặc định 1 trang. Song song chỉ nhanh hơn khoảng 20 % |
| Số đo mỗi lần chạy mỗi khác | Máy đang chạy ứng dụng khác | Báo khoảng nhỏ nhất đến lớn nhất; so hai cách thì chạy xen kẽ |
| `quay_thoi_gian_thuc.mjs` giật, chia khối ở nền chuyển sắc | Playwright ghi tối đa 25 khung/giây, VP8 khoảng 1 Mbit/s | Không dùng cho thành phẩm; dùng `xuat_mp4.mjs` |
| Script `.sh` mới chết im lặng ngay dòng đầu (tự viết thêm) | `set -e` cộng `pipefail` bắt mã thoát 1 của `ffmpeg -i file` (chạy không có đầu ra) | Bọc `{ ffmpeg -i ... 2>&1 \|\| true; }` khi chỉ đọc thông tin file |
| Ghép tiếng báo "Cannot select channel layout" khi chỉ có nhạc | Sau `loudnorm` không còn khai bố cục kênh | Thêm `aformat=sample_fmts=fltp:channel_layouts=stereo` cuối chuỗi lọc (đã sửa trong `ghep_am_thanh.sh`) |
| `ffprobe` của `xuong_thu_hyperframes/bin/` không chạy | Bản bọc mượn ffprobe của `xuong/node_modules/@remotion/...`, thư mục này không có | Đọc độ dài bằng dòng `Duration` của `ffmpeg -i` (các script trong `cong_cu/` đã làm vậy) |

## Nội dung trang

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| Phần tử hiện trước lúc được vẽ (nhãn tĩnh hiện ngay khi cảnh vào, phần tô dưới đường cong hiện cả hình, đầu mũi tên hiện sớm, xung điện hiện khi dây chưa vẽ) | `fromTo` với `immediateRender: false` không ẩn phần tử trước lúc tween bắt đầu | Ẩn từ đầu bằng `gsap.set` hoặc `opacity="0"` trong HTML; phần tô cắt theo vị trí đầu bút |
| Chuyển cảnh trống: cảnh sau chưa có phần tử nào, cảnh trước đang nhoè | Cảnh sau bắt đầu đúng mốc chuyển | Cảnh sau hiện trước mốc 0,3–0,45 giây, cảnh trước tắt xong trước mốc 0,1 giây, hoạt ảnh trong cảnh dời sớm 0,5 giây; cảnh Three.js chuyển bằng độ mờ, không nhoè |
| MP4 xem trước nặng (89 MB cho 60 giây 960×540), nền đen phủ trắng, chấm hạt lẫn vào nhiễu | Lớp hạt nhiễu độ đục tối đa 27 %, chấm nhỏ 0,4–1 điểm ảnh | Chấm sáng ≤ 6 %, chấm tối ≤ 15 %, lưới hạt mịn, chấm đám hạt to hơn. Bản 60 khung/giây có nhoè của mẫu 60 giây vẫn nặng 134 MB vì lớp hạt. Cách kiểm: chia dung lượng bản xem trước cho số giây; mẫu lỗi là 1,5 MB mỗi giây (89 MB / 60 giây), sau sửa 0,7 MB mỗi giây (43 MB / 60 giây) |
| Phụ đề, thước năm xám mờ | Nằm dưới lớp tối dần ở mép và lớp tối chân khung | Đưa nhãn chương, thước, phụ đề lên trên các lớp tối; chỉ để hạt nhiễu phủ trên cùng |
| Nền ngả nâu ấm, không giống ảnh đích gần đen | Màu nền khai theo cảm tính | So mã hex nền với ảnh đích; đổi `#15130f` thành `#121211`, giảm quầng cam nền khoảng 30 % |
| Chữ đè nhau (tên tác giả đè nhãn trục; hai nhãn phụ chồng nhau) | Toạ độ nhãn xếp tay không kiểm | Dời nhãn sang mép khác; kiểm bằng lưới khung cắt |
| Cảnh 3D: bàn cờ sáng màu xi măng, tràn xuống phụ đề, quầng sáng thành đốm gắt | Vật liệu sáng, máy quay gần, khung nhìn không dời | Sàn gần đen, đèn chính và đèn trời yếu, máy quay lùi xa, dời khung nhìn lên; quầng sáng nhỏ và dịu |
| Đường cong gãy nhọn, đồ thị trống nửa khung | Dữ liệu mẫu có điểm nhảy; bố cục lệch | Làm mềm dữ liệu quanh điểm gãy; thêm phần tử cân bố cục (khung nét đứt kích thước, nhãn) |
| Tác tử con không còn thấy ảnh đích khi viết trang | Đưa quá nhiều ảnh đích, ảnh bị đẩy khỏi ngữ cảnh | Gộp thành 1–2 ảnh ghép (`cat_khung_xem.sh`) |
