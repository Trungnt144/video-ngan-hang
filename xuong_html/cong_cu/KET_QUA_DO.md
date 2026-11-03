# Kết quả đo: biến trang HTML có hoạt ảnh thành MP4

Đo ngày 27/10/2026 trên Apple M5 (10 nhân), RAM 24 GB, macOS (Darwin 25.6). Thư mục công cụ:
`/private/tmp/claude-501/-Users-macbooktrungnt-Documents-Grok-Su-dung-grok/5b4667cb-49be-42d9-b955-ef5c7e14f2e6/scratchpad/cong_cu/chup_khung/`

## 1. Hai công cụ

| Công cụ | Cách làm | Đồng hồ của trang |
|---|---|---|
| `xuat_mp4.mjs` | Thay `performance.now`, `Date`, `requestAnimationFrame`, `setTimeout`, `setInterval`, `requestIdleCallback`, `Math.random` bằng đồng hồ do công cụ điều khiển. Mỗi khung: đẩy đồng hồ thêm 1/fps giây, chạy timer và rAF đến hạn, đặt `currentTime` cho mọi hoạt ảnh CSS / Web Animations / SVG SMIL, chụp ảnh JPEG chất lượng 95, đẩy vào FFmpeg qua stdin, mã hoá H.264 `yuv420p` CRF 18. | Ảo. Kết quả không đổi dù máy nhanh hay chậm. |
| `quay_thoi_gian_thuc.mjs` | Mở trang, dùng `recordVideo` của Playwright (WebM VP8, Playwright tự mã hoá), chờ đúng số giây theo đồng hồ thật, đổi sang MP4 H.264 bằng FFmpeg. | Thật. Máy chậm thì rơi khung. |

Phiên bản: `playwright-core` **1.62.0** (đúng bản khớp với Chromium `chromium-1234` và `ffmpeg-1011` đã có trong `~/Library/Caches/ms-playwright/`, Chrome for Testing 151.0.7922.34), FFmpeg 6.0 của `xuong_thu_hyperframes`. Không tải thêm trình duyệt nào. `xuat_mp4.mjs` dùng `chromium_headless_shell`, chạy với cờ `--disable-frame-rate-limit`.

## 2. Bảng số đo

Điều kiện chung: trang dài 10 giây, 1920×1080, 30 khung/giây, 300 khung. Mỗi cấu hình chạy 3 lần, chạy tuần tự. "Giây máy" là thời gian từ lúc gõ lệnh tới khi có file MP4 (đo bằng `/usr/bin/time -l`). CPU là tổng giây CPU của cả cây tiến trình (node, Chromium, FFmpeg). RAM là đỉnh tổng RSS của cả cây tiến trình, lấy mẫu 200 ms một lần.

| Trang thử | Cách | Giây máy (nhỏ nhất – trung bình – lớn nhất) | Giây máy / giây video | CPU (giây, số nhân trung bình) | RAM đỉnh | Dung lượng MP4 | Số khung thật trong MP4 (`ffprobe -count_frames`) |
|---|---|---|---|---|---|---|---|
| Canvas 3.000 hạt | `xuat_mp4`, 1 trang | 8,15 – 9,55 – 10,97 | 0,96 | 45,5 s, 4,8 nhân | 1,4 GB | 5,33 MB (4,27 Mbit/s) | 300 |
| Canvas 3.000 hạt | `xuat_mp4 --song-song 3` | 6,91 – 7,82 – 8,51 | 0,78 | 49,3 s, 6,3 nhân | 2,6 GB | 5,34 MB | 300 |
| Canvas 3.000 hạt | `quay_thoi_gian_thuc` | 15,05 – 15,61 – 16,24 | 1,56 | 51,9 s, 3,3 nhân | 1,0 GB | 5,28 MB (4,2 Mbit/s) | 300 (nhưng chỉ 250 khung khác nhau, xem mục 3) |
| SVG + GSAP + CSS | `xuat_mp4`, 1 trang | 8,47 – 9,74 – 11,25 | 0,97 | 32,0 s, 3,3 nhân | 1,4 GB | 1,11 MB (0,89 Mbit/s) | 300 |
| SVG + GSAP + CSS | `xuat_mp4 --song-song 3` | 6,55 – 7,90 – 8,78 | 0,79 | 36,7 s, 4,7 nhân | 3,2 GB | 1,14 MB | 300 |
| SVG + GSAP + CSS | `quay_thoi_gian_thuc` | 15,35 – 16,16 – 17,32 | 1,62 | 53,1 s, 3,3 nhân | 1,0 GB | 2,49 MB (1,99 Mbit/s) | 300 (250 khung khác nhau) |

Đo thêm, mỗi mục một lần:

| Mục | Kết quả |
|---|---|
| Canvas, `xuat_mp4 --anh png` (1 trang) | 11,23 giây máy, 5,56 MB (JPEG: 9,55 giây máy). PNG chậm hơn khoảng 15% và không cải thiện thấy được ở CRF 18. |
| Three.js r128 (WebGL, `thu_webgl.html`), `xuat_mp4` | 13,91 giây máy (1,39 giây máy / giây video), 1,19 MB, 300 khung; khối hộp quay đúng theo giờ ảo. |
| Three.js (WebGL), `quay_thoi_gian_thuc` | 15,59 giây máy, 1,53 MB, 300 khung. |
| Tắt giới hạn nhịp 60 Hz của Chromium (`--disable-frame-rate-limit`, mặc định bật trong `xuat_mp4`) | Đo xen kẽ ba cặp cùng điều kiện: 8,2 – 8,9 giây máy so với 10,4 – 10,7 giây máy khi giữ giới hạn (`--giu-nhip-60hz`). Đổi lại dùng thêm CPU (khoảng 41 so với 28 giây CPU). Ảnh chụp giống hệt từng điểm ảnh (PSNR vô hạn). |

Lưu ý khi đọc số: lúc đo, tải trung bình của máy là 6 – 7 (các ứng dụng khác của máy đang chạy), nên dao động giữa các lần lớn (cùng một lệnh 8,2 đến 11,0 giây). Một lượt quét riêng lúc máy rảnh hơn cho kết quả nhanh nhất là 5,8 giây máy (Canvas) và 6,7 giây máy (GSAP) với 1 trang. Dùng khoảng 1 giây máy cho mỗi giây video làm số dự phòng cho `xuat_mp4`, và 1,6 giây máy cho mỗi giây video cho `quay_thoi_gian_thuc`.

Chạy song song chỉ nhanh hơn khoảng 20% (3 trang) và tốn gấp đôi RAM; 6 và 8 trang chậm hơn 2 – 3 trang vì các trang tranh nhau một tiến trình đồ hoạ và bộ nhớ. Vì vậy mặc định là 1 trang.

## 3. Chất lượng và độ chính xác

**Tính xác định (`xuat_mp4`).** Ba lần chạy liên tiếp cho ba file MP4 trùng từng byte (`md5` giống hệt) ở cả hai trang thử, cả với 1 trang lẫn 3 trang. Bản 3 trang so với bản 1 trang: PSNR trung bình 54,2 dB (Canvas) và 52,7 dB (GSAP), thấp nhất 46,3 dB và 41,9 dB, không có gián đoạn ở chỗ nối giữa các đoạn; chênh lệch còn lại do bộ mã hoá bắt đầu lại ở mỗi đoạn.

**Đồng hồ ảo chạy đúng.** Khung thứ 30 của trang Canvas hiện `t = 1.000 s`, khung ở giây 5 hiện `5.000 s`, khung ở giây 9 hiện `9.000 s`. Trang GSAP ở giây 5: bộ đếm `setInterval` 100 ms hiện `Xung nhịp: 50`, `gsap.ticker.time` hiện `5.000 s`, bộ đếm điện áp 193 V, vòng CSS quay đúng 300 độ (5/6 vòng trong 6 giây).

**Chữ tiếng Việt.** "Điện áp tăng, dòng điện giảm" (Canvas) và "Truyền tải điện: giảm tổn thất đường dây" (SVG) đủ dấu ở cả bốn video. Đã xem khung giây 1, 5, 9 của từng video và ảnh cắt chữ cỡ gốc. Ảnh nằm ở `ra/khung/`.

**Màu.** Kiểm bằng ô màu chuẩn: `xuat_mp4` lệch tối đa 3 mức trên thang 255 (đỏ `ff0000` ra `fd0000`, `#ffd166` ra `fed165`, nền xám `808080` ra `7d7f7f`); `quay_thoi_gian_thuc` lệch tối đa 6 mức (trắng `ffffff` ra `fbfdfd`). Không có sai lệch ma trận màu (JPEG của Chrome là BT.601, đã đổi sang BT.709 dải TV và gắn thẻ).

**Quay thời gian thực: chất lượng và giật.**
- Bộ ghi của Playwright mã hoá VP8 khoảng 1 Mbit/s và tối đa 25 khung/giây. File WebM gốc: 25 khung/giây cố định, khoảng 294 – 295 khung cho 11,8 giây (gồm 0,5 giây trang mốc và 0,25 giây chờ thêm). Trong cả 7 file WebM đã đo, mọi gói tin trống (khung không có gì mới, khoảng 70 byte) nằm ở đoạn đầu, trước lúc trang thật xuất hiện (0,56 – 0,80 giây); từ đó tới hết có 0 gói trống và gói nhỏ nhất vẫn 874 byte trở lên, nghĩa là không bị rơi khung ở mức 25 khung/giây; chính trang cũng chạy 60 khung/giây (bộ đếm khung của trang Canvas ở giây 9 là khung 539).
- MP4 30 khung/giây thu được có đủ 300 khung nhưng chỉ có 250 khung khác nhau: 50 khung lặp lại (cứ 6 khung có 1 khung lặp), nên chuyển động giật nhẹ so với bản `xuat_mp4`. Muốn tránh thì xuất `--fps 25`.
- Chất lượng hình: nền gradient của trang GSAP bị chia khối thấy được bằng mắt; vùng nền tĩnh so với bản `xuat_mp4` có PSNR 36,7 dB và SSIM 0,990, vùng tiêu đề 32,1 dB và SSIM 0,947 (một phần chênh do nét đứt đang chuyển động). Chữ vẫn đọc được, đủ dấu.
- Đồng bộ đầu video: bộ ghi không báo khung đầu ứng với giờ nào. Công cụ chiếu một trang màu tím làm mốc trước khi tải trang thật, tìm khung tím đầu tiên trong WebM rồi tính điểm cắt. Kết quả lệch đồng hồ của trang trong khoảng ±42 ms (đo 5 lần). Cách đơn giản trước đó (không có mốc) lệch 0,1 – 0,6 giây tuỳ trang. Với trang tải thư viện từ mạng (như GSAP từ cdnjs), hoạt ảnh bắt đầu sau lúc điều hướng khoảng 0,1 – 0,2 giây nên bản MP4 hiện hoạt ảnh trễ chừng đó; chỉnh bằng `--lech-ms`.
- Thời gian máy gồm: 0,6 giây trang mốc, tải trang, chờ đúng số giây + 0,25 giây (khoảng 11,2 giây tính tới lúc ghi xong WebM), rồi giải mã tìm mốc và đổi sang H.264 (khoảng 4 giây).

## 4. Lệnh chạy mẫu

Cài đặt một lần (đã làm sẵn trong thư mục này): `~/.local/bin/npm install` (cài `playwright-core@1.62.0`, không tải trình duyệt).

```bash
export PATH="$HOME/.local/bin:$PATH"
cd "/private/tmp/claude-501/-Users-macbooktrungnt-Documents-Grok-Su-dung-grok/5b4667cb-49be-42d9-b955-ef5c7e14f2e6/scratchpad/cong_cu/chup_khung"

# 1) Chụp từng khung theo thời gian ảo (nên dùng): 10 giây, 30 khung/giây, 1920x1080
node xuat_mp4.mjs thu_canvas.html 10 --ra ra/canvas.mp4

# Khổ khác, fps khác, 3 trang song song (chỉ dùng khi trang xác định), ảnh PNG
node xuat_mp4.mjs trang.html 12 --fps 60 --kich-thuoc 1280x720 --song-song 3 --anh png --ra ra/trang.mp4

# Trang cần thêm thời gian chờ tài nguyên mạng sau khi tải, hoặc xem lỗi console của trang
node xuat_mp4.mjs trang.html 10 --cho-ms 1500 --chi-tiet --ra ra/trang.mp4

# 2) Quay màn hình thời gian thực bằng recordVideo của Playwright
node quay_thoi_gian_thuc.mjs thu_gsap_svg.html 10 --ra ra/gsap_quay.mp4
node quay_thoi_gian_thuc.mjs trang.html 10 --fps 25 --lech-ms 0 --giu-webm --ra ra/trang_quay.mp4

# 3) Đo lại: một lệnh dưới time -l + lấy mẫu RAM + ffprobe; hoặc cả lượt (khoảng 10 phút)
node do_hieu_nang.mjs "nhan" ra/canvas.mp4 -- node xuat_mp4.mjs thu_canvas.html 10 --ra ra/canvas.mp4
./chay_do.sh      # ghi nối vào ra/so_do.jsonl
```

Mỗi công cụ in một dòng JSON ở cuối (đường dẫn file ra, số khung, giây máy, dung lượng). `--help` in toàn bộ tuỳ chọn. Tuỳ chọn có giá trị bắt đầu bằng `--` phải viết dạng `--co-chromium=--ten-co`.

## 5. Giới hạn đã biết

`xuat_mp4.mjs`:
- **Video nhúng (`<video>`) và âm thanh:** không điều khiển. Thẻ `<video>` phát theo giờ thật nên không khớp giờ ảo; MP4 đầu ra không có âm thanh (ghép âm thanh sau bằng `ffmpeg -i video.mp4 -i am_thanh.wav -c:v copy -c:a aac`). `requestVideoFrameCallback` và Web Audio chưa xử lý.
- **WebGL / Three.js:** chạy được và đúng giờ ảo (Three.js r128 trong 4 giây thử và bản 10 giây ở mục 2), nhưng dùng bộ dựng hình mềm của Chromium headless nên chậm hơn Canvas 2D (1,39 giây máy mỗi giây video ở cảnh một khối hộp); cảnh nhiều đa giác, shader nặng, hậu kỳ sẽ chậm hơn nhiều. Chưa thử cảnh nặng.
- **Đồng hồ chỉ thay ở luồng chính của trang.** Web Worker, OffscreenCanvas trong worker, bộ lập lịch dựa trên `MessageChannel` (React scheduler) và `scheduler.postTask` vẫn dùng giờ thật.
- **Hoạt ảnh CSS / Web Animations:** hoạt ảnh được coi là bắt đầu ở khung mà công cụ thấy nó lần đầu. Hoạt ảnh tạo trong callback timer giữa hai khung bị trễ tối đa 1 khung. Hoạt ảnh đang ở trạng thái `paused` (ví dụ `animation-play-state: paused`) lúc thấy lần đầu thì bị bỏ qua; nếu sau đó được chạy tiếp thì chạy theo giờ thật. Hoạt ảnh gắn với cuộn trang (ScrollTimeline) bị bỏ qua.
- **Timer:** `setTimeout` lồng nhau bị kẹp tối thiểu 4 ms, `setInterval` tối thiểu 1 ms (giống trình duyệt). Chuỗi tới 200.000 timer trong một khung sẽ bị ngắt và báo lỗi.
- **Ngẫu nhiên:** `Math.random` được thay bằng bộ sinh cố định (`--hat-giong`, mặc định 1), nên nội dung ngẫu nhiên giống nhau mọi lần nhưng khác khi xem bằng trình duyệt thường. `crypto.getRandomValues` không bị thay. `Date` bắt đầu cố định ở 01/01/2026 00:00 UTC.
- **`--song-song N > 1`:** mỗi trang phải chạy lại từ giây 0 tới đoạn của mình, nên chỉ đúng khi trang xác định (không dùng nguồn ngẫu nhiên ngoài `Math.random`, không phụ thuộc mạng hay thời gian thật). Đã kiểm với hai trang thử. Chỉ nhanh hơn khoảng 20% và tốn gấp đôi RAM.
- **Tài nguyên mạng:** công cụ chờ sự kiện `load`, phông (`document.fonts.ready`) và ảnh `<img>`, không chờ tài nguyên tải muộn hơn (dùng `--cho-ms`). Trang nạp thư viện từ CDN (như GSAP từ cdnjs) cần có mạng; không có mạng thì trang lỗi. Nếu cần chạy offline, tải thư viện về cạnh file HTML.
- **Kích thước:** viewport bằng đúng kích thước đầu ra, hệ số điểm ảnh 1. Số lẻ được làm tròn lên số chẵn (H.264 `yuv420p` cần chẵn). Trang thiết kế cố định 1920×1080 mà xuất khổ khác sẽ bị cắt hoặc co theo CSS của trang.
- **Ảnh JPEG:** chất lượng 95 và chroma 4:2:0 giống đầu ra yuv420p nên chữ và nét mảnh không mất thêm; cần tuyệt đối thì dùng `--anh png`.

`quay_thoi_gian_thuc.mjs`:
- Tối đa 25 khung/giây và khoảng 1 Mbit/s (cố định trong Playwright, không đổi được bằng tuỳ chọn của `recordVideo`). Hình bị chia khối ở nền chuyển sắc và nét mảnh; không phù hợp cho video cần chất lượng cao.
- Chạy theo giờ thật nên kết quả phụ thuộc tải máy; phải mất 1,6 giây máy mỗi giây video.
- Cũng không có âm thanh. WebGL chạy được trong bản quay (đã xem khung giây 5 của cảnh Three.js).
- Điểm cắt đầu có sai số khoảng ±40 ms so với đồng hồ của trang; hoạt ảnh bắt đầu sau khi thư viện mạng tải xong sẽ có đoạn đầu chưa chuyển động.

## 6. Lỗi gặp và cách xử lý

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| `playwright-core` bản mới nhất (1.64.1) đòi Chromium 1248 và ffmpeg 1013, còn cache chỉ có 1234 và 1011 | Mỗi phiên bản Playwright gắn với đúng một bản trình duyệt | Cài `playwright-core@1.62.0` (kiểm trong `browsers.json` của từng bản: 1.62.0 đúng là chromium 1234, ffmpeg 1011) |
| Ghép các đoạn chụp song song bằng cách nối luồng H.264 thô làm mất 2 trong 60 khung | Bộ tách luồng H.264 thô bỏ khung ở chỗ nối | Mỗi đoạn mã hoá ra MP4 riêng rồi ghép bằng `concat` của FFmpeg, không mã hoá lại. Đã kiểm 60/60 và 300/300 khung |
| `quay_thoi_gian_thuc`: video lệch giờ của trang 0,1 – 0,6 giây tuỳ trang | Khung đầu của bộ ghi tới lúc trang vẽ lần đầu, không cố định | Chiếu trang màu tím làm mốc, tìm khung tím trong WebM, cắt theo mốc: lệch còn trong ±42 ms |
| Chụp khung chậm hơn cần thiết | Chromium giữ nhịp 60 Hz khi chụp ảnh | Cờ `--disable-frame-rate-limit` (nhanh hơn 20 – 30%, ảnh giống hệt) |
| `--co-chromium "--ten-co ..."` báo lỗi tuỳ chọn không hợp lệ | `parseArgs` coi giá trị bắt đầu bằng `--` là tuỳ chọn mới | Viết `--co-chromium=--ten-co` |
| Số đo dao động lớn giữa các lần | Máy có ứng dụng khác chạy (tải trung bình 6 – 7) | Đo xen kẽ khi so hai cách; báo khoảng nhỏ nhất – lớn nhất, không báo một số |

## 7. Tệp trong thư mục

- `xuat_mp4.mjs`, `quay_thoi_gian_thuc.mjs`: hai công cụ.
- `do_hieu_nang.mjs`, `chay_do.sh`: bộ đo; số đo thô ở `ra/so_do.jsonl` (lần cuối) và `ra/so_do_lan1_truoc_khi_tat_gioi_han_nhip.jsonl` (lần đầu, chưa tắt giới hạn nhịp).
- `thu_canvas.html`, `thu_gsap_svg.html`: hai trang thử bắt buộc; `thu_webgl.html`: trang thử Three.js để kiểm giới hạn.
- `ra/`: các MP4 đã xuất (tiền tố `xc`, `xg`, `xw`: xuất theo thời gian ảo; `qc`, `qg`, `qw`: quay thời gian thực), `ra/khung/`: ảnh khung giây 1, 5, 9 và ảnh cắt chữ.

## 8. Thử toàn luồng trong `xuong_html/` (27/10/2026, tác tử skill `dung-video-html`)

Mục 1–7 ở trên giữ nguyên lúc đo ở thư mục tạm; đường dẫn và lệnh trong mục 4 và 7 không còn dùng, lệnh hiện hành nằm ở `xuong_html/README.md`. Bộ đo `do_hieu_nang.mjs`, `chay_do.sh` và thư mục `ra/` của lần đo gốc không chép vào đây.

Máy: Apple M5, macOS (Darwin 25.6), `playwright-core` 1.62.0, FFmpeg 6.0 của `xuong_thu_hyperframes`, Node 26.7.0. Tải trung bình của máy lúc đo 2,9–3,6 (ít hơn lúc đo ở mục 2). Mỗi dòng ghi số lần chạy thật; không có dòng nào chạy nhiều hơn số đã ghi.

Trang thử: `xuong_html/2026.10.27_thu_ky_thuat/trang.html`, 6 giây, 1920×1080 khi xuất cuối. SVG, GSAP 3.12.5 từ cdnjs, phông Be Vietnam Pro và JetBrains Mono từ Google Fonts, hàm `seek(t)`, ba số đếm, một dải cam quét ngang khung trong 0,4 giây (để kiểm nhoè), chữ tiếng Việt có đủ dấu. Nhạc ghép thử: `tai_san/nhac_nen/mixkit-close-up-1167.mp3` (95 giây, cắt còn 6 giây). Giọng ghép thử: giọng `Linh` của lệnh `say` trên macOS (tiếng Việt, 3–6 giây).

| Bước | Lệnh | Giây máy | Kết quả |
|---|---|---|---|
| Cài một lần | `npm install` trong `cong_cu/` | 0,65 (đã có bộ nhớ đệm npm), 1 lần | 1 gói `playwright-core` 1.62.0, 0 lỗ hổng, không tải trình duyệt |
| Xem trước 960×540, 10 khung/giây, 60 khung | `xuat_mp4.mjs` | 1,71 – 1,46 – 1,67 (3 lần; 0,24–0,28 giây máy mỗi giây video) | 0,51–0,53 MB. Lần 2 và lần 3 cùng số byte và cùng mã băm hình: xuất lặp lại cho kết quả không đổi |
| Cắt 12 khung đều + 1 lưới (3 cột × 4 hàng) | `cat_khung_xem.sh` | 0,8 (1 lần) | 12 ảnh PNG 960×540, 1 lưới JPEG 1564×1180, khoảng 360 KB |
| Cắt 24 khung + 2 lưới | `cat_khung_xem.sh` | 1,38 (1 lần) | 2 lưới 12 ô |
| Bản cuối thường 30 khung/giây, 1920×1080, 180 khung | `xuat_mp4.mjs` | 8,12 (1 lần; 1,35 giây máy mỗi giây video) | 2,2 MB |
| Bản cuối 60 khung/giây có nhoè | `xuat_nhoe.sh` (N=8, M=4, 2 trang song song), 1 lần | Chụp 2.880 khung: 63,4. Cả lệnh: 70,1 thật (402,9 giây CPU người dùng, 22,3 giây CPU hệ thống) = 11,7 giây máy mỗi giây video | 3,17 MB, 360 khung, 60 khung/giây, đúng 6,00 giây. RSS lớn nhất của một tiến trình con 0,81 GB (số của `/usr/bin/time -l`, không phải tổng cả cây như mục 2) |
| Ghép chỉ nhạc | `ghep_am_thanh.sh` | 0,47 – 0,43 (2 lần) | 3,2 MB; −14,56 LUFS (đích −14), đỉnh thật −1,20 dBTP; luồng hình giữ nguyên, tiếng AAC 48 kHz stereo |
| Ghép giọng + nhạc (giọng dời 0,8 giây, nhạc hạ dưới giọng) | `ghep_am_thanh.sh` | 0,46 – 0,51 (2 lần) | 3,2 MB; −14,52 LUFS, đỉnh thật −1,46 dBTP |

So sánh: bản 60 khung/giây có nhoè mất 8,6 lần thời gian cả lệnh của bản 30 khung/giây thường (70,1 so với 8,12 giây máy; riêng giai đoạn chụp 7,8 lần), trên cùng trang, cùng máy. Mẫu lịch sử AI 60 giây ở lần dựng trước mất 23,3 phút (23,3 giây máy mỗi giây video) vì có Three.js và lớp hạt nhiễu: số này gấp đôi trang thử nhẹ, nên báo Trung khoảng 12–25 giây máy mỗi giây video cho bản 60 khung/giây có nhoè, tuỳ độ nặng của trang.

Kiểm chất lượng bằng mắt (đã xem ảnh khung, không chỉ số đo):
- Chữ tiếng Việt đủ dấu ở cả bản xem trước 960×540, lưới và khung giây 5,5 cỡ gốc 1920×1080 (Đ, ệ, ắ, ò, ả, ổ, ầ, ì; "TRUYỀN TẢI ĐIỆN", "TỔN THẤT I² × R").
- Nhoè chuyển động thấy rõ ở khung giây 3,28: dải quét cam có đuôi mờ, chữ số đang đếm chồng hai chữ số.
- Thử nhạc 2,5 giây ghép vào video 6 giây: nhạc lặp đủ 6 giây, không đứt tiếng ở chỗ lặp (mức trung bình các đoạn 1 giây bắt đầu ở giây 0, 2, 3: −15,3; −15,8; −14,9 dB, không tụt), rồi mờ dần trong 2 giây cuối (đoạn từ giây 4: −18,5 dB; 5–5,5: −20,7 dB; 5,5–6: −32,6 dB). Nhạc 95 giây được cắt đúng 6 giây (độ dài file ra 6,000 giây).
- Nhạc tự nhỏ dưới giọng: mức trung bình −23,4 dB khi chỉ có nhạc (0–0,7 giây), −15,8 dB khi có giọng (1–3,5 giây).

Lỗi gặp lần thử (đã sửa trong công cụ hoặc trang thử):

| Lỗi | Nguyên nhân | Cách xử lý |
|---|---|---|
| Xung điện hiện lúc dây chưa vẽ (khung 0,25 và 0,75 giây) | `fromTo` với `immediateRender: false` không ẩn phần tử trước lúc tween bắt đầu | Thêm `opacity="0"` cho nhóm trong HTML (vòng 1 của `SO_VONG_SUA.md`) |
| `ghep_am_thanh.sh` chết im lặng ngay dòng đầu | `set -e` cộng `pipefail` bắt mã thoát 1 của `ffmpeg -i file` khi chỉ đọc thông tin | Bọc bằng `{ ... \|\| true; }` |
| Ghép chỉ nhạc báo "Cannot select channel layout" | Sau `loudnorm` chuỗi lọc không còn khai bố cục kênh | Thêm `aformat=sample_fmts=fltp:channel_layouts=stereo` cuối chuỗi |
| `ffprobe` của `xuong_thu_hyperframes/bin/` không chạy trong bản sao làm việc | Bản bọc mượn ffprobe của `xuong/node_modules/@remotion/...`, không có trong bản sao | Các script mới đọc độ dài bằng `ffmpeg -i`, không dùng `ffprobe` |
| Lưới ảnh rộng 1582 điểm ảnh, vượt giới hạn đọc ảnh 1566 | Bộ lọc `tile` thêm lề 4 và khoảng cách 4 | Tính bề rộng ô sau khi trừ lề và khoảng cách: lưới 1564 điểm ảnh |

Thay đổi công cụ trong lần này: đường dẫn FFmpeg mặc định tính theo vị trí script (biến `FFMPEG`, rồi `xuong_thu_hyperframes/bin/ffmpeg` cạnh `xuong_html/`, rồi đường dẫn tuyệt đối cũ); thêm cờ `window.__san_sang` (trang đặt `false` đầu và `true` khi dựng xong, `xuat_mp4.mjs` chờ tối đa 30 giây; trang không đặt cờ thì không chờ thêm); thêm `ghep_am_thanh.sh`, `cat_khung_xem.sh`.
