# Trình chạy pha máy

> Lập 28/10/2026 theo sổ nợ N58 (Trung chốt qua bảng chọn): chạy lô ba pha AI → máy → AI, bỏ kết xuất nháp nửa độ phân giải, máy kết xuất đủ một lần theo chương, sửa bằng cách kết xuất lại đúng chương. Luồng tổng: `01_quy_trinh_chung.md` mục 2; khuôn giao việc lô: `07_khuon_prompt_va_kiem_chat_luong.md` mục 14.

## Ai làm gì

| Pha | Ai | Làm gì | Ra gì |
|---|---|---|---|
| 1 | AI, khi còn hạn mức | Nguồn, kịch bản, giọng VieNeu, mã dựng; ảnh tĩnh mọi cảnh qua chỗ nhanh của hàng đợi; tự soát; Trung duyệt ảnh tĩnh cả lô một lần; ghi phiếu | `du_lieu/pha_may/phieu/<mã>.json` |
| 2 | Máy, không AI | `pha_may.mjs chay`: các bước ở mục dưới | `xuong_dai/<tên>/out/pha_may/<mã>_du.mp4` (video HTML: `xuong_html/<tên>/out/pha_may/`), báo cáo `du_lieu/pha_may/bao_cao/<mã>.md` |
| 3 | AI (Opus) | Đọc báo cáo, xem bảng ảnh soát; lỗi thì sửa mã, ghi lại phiếu với `--chuong-sua`, chạy lại pha 2; đạt thì chép bản đủ ra thư mục sản phẩm thành `_nhap` | bản nháp trình Trung (cửa duyệt 2) |

Pha 2 chỉ chạy khi Trung ra lệnh ("chạy pha máy"). Pha 1 xong thì Claude nhắc một dòng kèm số phiếu và ước giờ máy (khoảng 5–8 phút mỗi video 2 phút khi không phải kết xuất lại). Không đặt lịch tự chạy (quy tắc 6 của `AGENTS.md`).

## Lệnh

Chạy ở gốc `Media/`.

```bash
node scripts/pha_may/pha_may.mjs tao n52 xuong_dai/thi_cong_gio_gan_bo --san-pham san_pham/2026.10.28.thi_cong_gio_gan_bo
```

Ghi phiếu (hoặc ghi lại phiếu đã có, trạng thái về "cho"). Trình chạy tự nhận loại dự án: có `src/thoi_gian.json` là Remotion ngang, có `nhip.json` là video HTML (mục "Video HTML (LM-03)"). Lệnh `tao` đọc thử dự án ngay, nên lỗi quy cách (chương hở, thiếu file giọng, mã chương sai trong `--chuong-sua`) hiện lúc ghi phiếu. Composition tự đọc từ `src/Root.tsx`; dự án có nhiều composition thì thêm `--composition <id>`. Pha 3 sửa mã xong thì ghi lại phiếu kèm `--chuong-sua 3,5` (mã chương trong `src/thoi_gian.json`).

```bash
node scripts/pha_may/pha_may.mjs chay
```

Chạy mọi phiếu đang chờ, 2 video cùng lúc (`--song-song 1` đến `3`), `--chi <mã>` chạy một phiếu (kể cả phiếu đã chạy). Khi một trình chạy khác đang chạy, `--chi <mã>` vẫn chạy được nếu phiếu đó không thuộc lượt đang chạy (khoá riêng `dang_chay_<mã>.json`): pha 3 chạy lại một video không phải chờ cả lô. Khoá tạo bằng liên kết cứng từ file tạm riêng theo PID, nên hai lệnh khởi động cùng một giây không giẫm nhau: một lệnh giữ khoá, lệnh kia chạy với khoá riêng hoặc báo phiếu đang chạy (sửa 29/10/2026). Hai trình chạy dùng chung hàng đợi nên không vượt 2 lượt kết xuất cùng lúc. Trình chạy giữ máy không ngủ bằng `caffeinate` (máy đặt ngủ sau 1 phút không dùng), xong thì báo bằng thông báo macOS và Telegram (`Su dung grok/scripts/bao_telegram.sh`; thêm `--khong-bao` để tắt). Chạy lâu thì chạy nền: `nohup node scripts/pha_may/pha_may.mjs chay > du_lieu/pha_may/chay.log 2>&1 &`. Dừng: Ctrl+C hoặc `kill <PID>` (PID ở `du_lieu/pha_may/dang_chay.json`); lượt kết xuất đang chạy được tắt theo, phiếu đang dở ghi "loi", chạy lại thì làm tiếp nhờ bộ đệm. Trên bảng video (thẻ Pha máy, `http://localhost:4580/#pha_may`): nút trên cùng chạy mọi phiếu đang chờ hoặc dừng trình chạy chính; nút ở từng dòng chạy riêng, chạy lại hoặc dừng một phiếu (nhật ký `du_lieu/pha_may/chay_<mã>.log`).

```bash
node scripts/pha_may/pha_may.mjs xem
```

Liệt kê phiếu, trạng thái (`cho`, `dang_chay`, `cho_soat`, `loi`), bước đang làm, cùng tình trạng hàng đợi kết xuất.

```bash
node scripts/pha_may/pha_may.mjs don n52 --chac
```

Chuyển bộ đệm `out/pha_may/` của video vào Thùng rác (chuỗi ảnh khoảng 0,5–1,5 GB mỗi video). Chỉ chạy sau khi Trung duyệt bản cuối; dọn rồi mà phải sửa thì kết xuất lại cả video.

## Các bước pha 2

| Bước | Làm gì | Ghi chú |
|---|---|---|
| `xet_bo_dem` | Chia video theo chương của `src/thoi_gian.json`, quyết định chương nào kết xuất lại | Xem mục bộ đệm chương |
| `ket_xuat_hinh` | `remotion render --sequence --frames=a-b`, jpeg chất lượng 95, qua hàng đợi chỗ dài; mỗi đoạn kết xuất vào thư mục tạm rồi đặt tên theo số khung vào `out/pha_may/seq/`. Video HTML: `chup_html.mjs`, 3 trang Chromium chia nhau đoạn khung, nhảy thẳng tới khung đầu mỗi phần rồi chụp lần lượt | Chương đổi được kết xuất thêm 15 khung mỗi bên (chuyển cảnh, phụ đề vắt qua ranh chương) |
| `khung_mau_goc` | Chụp 2 khung tĩnh (30% và 75% độ dài chương) của mỗi chương vừa kết xuất hoặc chưa có, lưu ở `out/pha_may/mau_goc/`. Video HTML: `chup_html.mjs` qua chỗ nhanh | Dùng cho lần sửa sau (mục bộ đệm chương) |
| `ket_xuat_tieng` | `remotion render --codec=aac` ra `tieng.aac`. Video HTML: ffmpeg trộn các đoạn giọng (đặt theo giây) với nhạc nền lặp, hạ dB, mờ dần cuối, nén sidechain như `ghep_am_thanh.sh`, ra `tieng.wav`; cảnh báo khi giọng vượt cuối video hoặc hai đoạn giọng đè nhau | Remotion: bỏ qua khi mã, mốc thời gian và tệp âm thanh không đổi. HTML: bỏ qua khi file giọng, nhạc và trường âm thanh của `nhip.json` không đổi (sửa trang không trộn lại tiếng) |
| `chuan_do_to` | Hai lượt `loudnorm` chỉnh tiếng về −14 LUFS, đỉnh thật −2 dBTP, ra `tieng_chuan.aac` (Trung chốt 28/10/2026: chỉnh cho video mới, video cũ giữ) | Tiếng gốc các video đã làm quanh −20 LUFS; thử trên N49: −19,98 → −14,2 LUFS, đỉnh −1,7 dBTP, 18 giây |
| `ma_hoa` | ffmpeg đủ bộ lọc (`xuong_thu_hyperframes/bin/ffmpeg`) mã hoá chuỗi ảnh thành `video_cam.mp4`, libx264 crf 18, yuv420p; kiểm số khung bằng ffprobe. Video HTML thêm bộ lọc đổi màu BT.601 toàn dải sang BT.709 dải TV như `xuat_mp4.mjs` | Mã hoá hình riêng rồi ghép tiếng sau: ghép trong một lệnh làm mất khoảng 60 khung (bài học 44 lô điện gió) |
| `thay_khung_hong` | `scripts/quet_khung_hong.py`; khung nghi hỏng cùng khung liền trước, liền sau được kết xuất lại bằng `ve_khung.mjs` (video HTML: `chup_html.mjs`) vào chuỗi ảnh, mã hoá lại, quét lại; tối đa 3 vòng | Khung hỏng WebGL rơi ngẫu nhiên giữa các lần kết xuất (bài học 16, 21) |
| `ghep_tieng` | Ghép hình và tiếng đã chỉnh độ to, `-c copy`, thành `<mã>_du.mp4`, kiểm lại số khung | |
| `do_tieng_va_dung_hinh` | `ebur128` (độ to tích hợp, đỉnh thật); `freezedetect` 10 khung/giây, n=−60 dB, d=0,5 giây | Cảnh báo khi đứng hình quá 1 giây mỗi 30 giây (module 07 mục 9) |
| `bang_anh_soat` | `scripts/soat_khung_mp4.py`, 3 giây một khung, 16 khung một bảng | Cắt từ chính file mp4 (90_bai_hoc 26/10) |

Trạng thái `cho_soat` nghĩa là máy làm xong, chưa ai xem hình. Báo cáo ghi giây từng bước, chương kết xuất và chương dùng lại, khung hỏng, độ to, đứng hình, đường dẫn bảng ảnh soát, cảnh báo. Đầu ra lệnh nằm ở `du_lieu/pha_may/nhat_ky/<mã>.log`.

## Bộ đệm chương

Chuỗi ảnh `out/pha_may/seq/` là bộ đệm. `out/pha_may/bo_dem.json` ghi cho từng chương: vị trí khung, dấu vân tay nội dung chương (lời, mốc trong `thoi_gian.json`) và dấu vân tay mã dùng chung lúc kết xuất (mọi tệp `src/` trừ `thoi_gian.json`, `remotion.config.ts`, `package.json`, tệp `public/` không phải âm thanh, số khung tổng).

Một chương được kết xuất lại khi: chưa có trong bộ đệm, thiếu ảnh, đổi vị trí hoặc độ dài (đọc lại giọng làm các chương sau dời theo), hoặc nội dung chương đổi. Khi chỉ mã dùng chung đổi:
- phiếu có `--chuong-sua`: chương khai trong đó kết xuất lại; chương khác chụp lại 2 khung mẫu bằng mã mới, so với khung mẫu gốc chụp lúc kết xuất chương đó, bằng `so_khung.py`; lệch quá 200 điểm ảnh (một kênh màu chênh quá 24) thì kết xuất lại và ghi cảnh báo, lệch ít hơn thì dùng lại. So khung tĩnh với khung tĩnh, không so với khung trong chuỗi ảnh: đo 28/10/2026 trên N49, khung tĩnh và khung kết xuất đủ cùng số, cùng mã lệch 123–4.146 điểm ảnh, còn hai lần chụp khung tĩnh lệch 0;
- phiếu không có `--chuong-sua`: kết xuất lại cả video cho chắc.

Đổi một thành phần dùng chung (màu nhãn, phụ đề) sau khi đã kết xuất đủ thường kéo theo gần cả video (bài học 19 lô điện gió): chốt màu và cỡ chữ ở pha 1 qua ảnh tĩnh.

## Hàng đợi

Mọi lượt dùng Chrome (Remotion và trang HTML) đi qua `scripts/hang_doi_ket_xuat.sh`: 2 chỗ dài cho kết xuất, 1 chỗ nhanh cho lượt dưới 30 giây (ảnh tĩnh, ảnh soát). Lệnh chứa `remotion still`, `anh_soat`, `anh_luoi` tự vào chỗ nhanh; `ve_khung.mjs` của trình chạy đi chỗ dài vì đóng gói dự án mất 20–80 giây; `chup_html.mjs` đi chỗ dài khi kết xuất chương, chỗ nhanh khi chụp tối đa 60 khung lẻ (trình chạy tự thêm `--nhanh`); lệnh khác thêm `--nhanh` ngay sau tên script. Chỗ nhanh bận mà còn chỗ dài trống thì lượt nhanh lấy chỗ dài.

## Video HTML (LM-03)

Chốt 28/10/2026 cho loạt thuật ngữ ngân hàng. Quy cách bám chuẩn của skill `dung-video-html`: trang dựng đúng skill không phải sửa, chỉ thêm vài trường vào `nhip.json`.

**Dự án phải có** (trong `xuong_html/<tên>/`):

| Thứ | Quy cách |
|---|---|
| `trang.html` | Đúng hợp đồng trang `skills/dung-video-html/tham_chieu/hop_dong_trang.md`: `window.seek(t)` đặt cả trang về giây `t`, gọi theo thứ tự nào cũng ra cùng ảnh; `window.__san_sang` false đầu script, true khi dựng xong; `DUR` bằng `thoi_luong_giay`. Pha máy nhảy thẳng tới khung đầu mỗi chương (không chạy lần lượt từ giây 0), nên trang tích luỹ theo khung sẽ ra hình sai. Tên khác `trang.html` thì ghi phiếu thêm `--trang <file>` |
| `nhip.json` | Đúng mẫu của skill (`xuong_html/2026.10.27_thu_ky_thuat/nhip.json`). Pha máy đọc các trường ở bảng dưới |
| Giọng, nhạc | File nằm trong thư mục dự án (khuyến nghị `am_thanh/`), hoặc nhạc trong `tai_san/nhac_nen/`. Đường dẫn trong `nhip.json` tính từ thư mục dự án; không thấy thì tính từ gốc `Media/` (chấp nhận tiền tố `Media/` như mẫu) |
| Thư viện, phông | Khuyến nghị tải GSAP, Three.js về cạnh `trang.html` và nạp tại chỗ: pha máy có thể chạy lúc mất mạng (ca 01:00–03:04 ngày 28/10). Nạp từ mạng vẫn chạy khi có mạng |

**Trường của `nhip.json` mà pha máy đọc:**

| Trường | Bắt buộc | Nghĩa |
|---|---|---|
| `thoi_luong_giay` | có | Độ dài video, giây; số khung = làm tròn(`thoi_luong_giay` × `fps_cuoi`) |
| `fps_cuoi` | không (30) | 30 hoặc 60. Pha máy chụp thẳng, không làm nhoè chuyển động; cần nhoè thì xuất tay bằng `xuat_nhoe.sh` |
| `kho` | không (`1920x1080`) | Rộng x cao |
| `giong` | không | Một file (`"am_thanh/giong.wav"`), hoặc danh sách đoạn `[{"tep": "am_thanh/c1.wav", "t": 0.5}, ...]` với `t` là giây bắt đầu phát đoạn đó |
| `giong_tre` | không (0) | Dời giọng một file muộn đi N giây (như `--giong-tre` của `ghep_am_thanh.sh`) |
| `nhac`, `nhac_db`, `mo_dan` | không (−10 dB, 2 giây) | Nhạc nền, độ to nền, số giây mờ dần cuối; nhạc tự nhỏ dưới giọng như `ghep_am_thanh.sh` |
| `chuong` | khuyến nghị | `[{"id": "1", "ten": "Mở đầu", "t": 0, "den": 38.4}, ...]`, liền nhau, phủ đủ từ 0 tới `thoi_luong_giay`. Chương là đơn vị của bộ đệm: sửa một chương thì chỉ chương đó kết xuất lại. Nên 20–60 giây một chương, ranh chương đặt ở chỗ đổi cảnh. Thiếu trường này thì mỗi nhịp là một chương (mã chương là số thứ tự nhịp, từ 1) |

Phải có ít nhất giọng hoặc nhạc. Video không tiếng chưa nhận.

**Ghi phiếu và chạy:** như Remotion, trình chạy tự nhận ra dự án HTML (có `nhip.json` và trang, không có `src/thoi_gian.json`):

```bash
node scripts/pha_may/pha_may.mjs tao n81 xuong_html/n81_ten --san-pham san_pham/2026.10.28.ten
```

Pha 3 sửa trang xong thì ghi lại phiếu kèm `--chuong-sua 3,5` (mã chương trong trường `chuong` của `nhip.json`). Vì cả video nằm trong một `trang.html`, mọi lần sửa trang đều đổi dấu vân tay mã dùng chung; chương không khai được so 2 khung mẫu như mục bộ đệm chương, lệch thì tự kết xuất lại.

## Số đo chạy thử (28/10/2026)

Chạy trên một bản sao dự án N49 (128 giây, 3.853 khung, 9 chương), trong lúc lô điện gió kết xuất song song:

| Lần | Thay đổi | Chương kết xuất | Giây máy |
|---|---|---|---|
| 1 | Chưa có bộ đệm | 9/9; thay 22 khung hỏng | 776 (hình 487, tiếng 93, thay khung 114, mã hoá 63) |
| 2 | Không sửa gì | 0/9 | 124 (chụp 18 khung mẫu gốc 29, mã hoá 63) |
| 3 | Sửa máy quay chương 2, phiếu khai nhầm chương 5 | 2 và 5 (1.044 khung); chương 2 tự bắt được, lệch 451.426 điểm ảnh | 334 (hình 89, tiếng 104) |

Mọi lần sửa mã Remotion đều kết xuất lại tiếng (khoảng 100 giây), vì tiếng tính theo dấu vân tay của mã. Từ lần thử HTML dưới đây, chuỗi ảnh không đổi thì trình chạy dùng lại `video_cam.mp4` và bỏ quét khung hỏng; tiếng không đổi thì dùng lại tiếng đã chỉnh độ to (áp cho cả hai loại dự án). Lô Remotion `mnh` và `ccn2` chạy tối 28/10/2026 bằng bản mã này đạt (418 và 563 giây, −14,4 LUFS).

Video HTML: dự án thử `xuong_html/thu_html_pha_may/` (trang 60 giây có Three.js, 1.800 khung, 9 chương, mã `thu_html_a`):

| Lần | Thay đổi | Chương kết xuất | Giây máy |
|---|---|---|---|
| 1 | Chưa có bộ đệm | 9/9; không khung hỏng | 407 (hình 139, quét khung hỏng 26, mã hoá 172 vì máy tải 49 và trang nhiều hạt nhiễu, đo 33) |
| 2 | Không sửa gì, trước khi có ba điều kiện bỏ qua | 0/9 | 225 (mã hoá lại 140) |
| 3 | Không sửa gì, có ba điều kiện bỏ qua | 0/9 | 10 (đo độ to và đứng hình 5, bảng soát 4) |
| 4 | Đổi màu nét gióng trong chương 5, phiếu `--chuong-sua 5` | chương 5 (240 khung gồm 15 khung mỗi bên); 8 chương còn lại so khung mẫu đạt, không cảnh báo | 96 (so 16 khung mẫu 3, hình 12, quét 11, mã hoá 57, đo 7) |

Lần 4 ra đúng 1.800 khung, video 60,0 giây, tiếng 60,03 giây, dùng lại tiếng cũ; khung giây 31 có nét gióng màu mới. Chụp nhảy thẳng tới khung so với chụp lần lượt từ giây 0 lệch 0–70 điểm ảnh trên 518 nghìn, dưới ngưỡng 200.

## Giới hạn

- Nhận dự án Remotion ngang (LM-02) và video HTML (LM-03). Video dọc (LM-01) chưa có phiếu.
- Độ to của video HTML thử ra −15 LUFS, không tới −14: tiếng trộn có đỉnh −3 dBTP ở −23,3 LUFS (hai đoạn giọng ngắn trên 60 giây nhạc), cần nâng 9,3 dB thì đỉnh vượt mức cho phép, nên bộ lọc `loudnorm` chuyển sang chế độ nén động và nâng thiếu khoảng 1 dB. Vẫn trong ngưỡng ±1 nên chỉ cảnh báo khi lệch hơn. Video có giọng đọc liền (tiếng gốc quanh −20 LUFS như các video Remotion) không gặp.
- Từ 29/10/2026 mọi lệnh ffmpeg, ffprobe của trình chạy có thời hạn 60 phút (trộn tiếng video HTML 10 phút); quá hạn thì phiếu báo lỗi "quá thời hạn", không đứng im. Trộn tiếng không còn dùng `-stream_loop -1` vì ffmpeg 6.0 treo khi nhạc dài đúng bằng video (n81, n72 đứng hơn 4 giờ; `90_bai_hoc.md` ngày 29/10/2026). Lượt kết xuất Remotion và chụp trang HTML chưa có thời hạn.
- So khung mẫu chỉ bắt đổi hình tại 2 khung mỗi chương; đổi xảy ra giữa hai khung mẫu (ví dụ một nhãn chỉ hiện 1 giây) thì không bắt được. Pha 3 khai đủ chương đã sửa.
