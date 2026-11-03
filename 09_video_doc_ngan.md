# 09 — Video ngắn dọc (Giai đoạn 1): trạng thái xưởng, khối cảnh, lệnh dựng

> Module của giai đoạn ĐANG BẬT. Đọc trước mọi việc liên quan tới làm video, sửa kịch bản, dựng cảnh, render.
> Luồng các việc dùng chung cho hai khổ nằm ở `01_quy_trinh_chung.md`; file này giữ phần riêng của video dọc: trạng thái xưởng, khối cảnh dựng sẵn, thông số, lệnh dựng.
> **Phiên bản:** 2.1 · **Cập nhật:** 2026-10-27 · Áp quyết định Trung 27/10/2026: bỏ ElevenLabs, chỉ dùng VieNeu (mục 1, 2, 5, 6; lệnh `gop` không còn đường ElevenLabs); phụ đề chạy chữ video dọc "mặc định có khi có giọng đọc, bỏ trong ba trường hợp" (mục 3); tên file video mới không ghi mã dựng (mục 5).
> **Phiên bản:** 2.0 · **Cập nhật:** 2026-10-27 · đổi tên từ `01_khuon_video_ngan.md` khi dựng lại luồng Media: mục 4 (quy trình 8 bước) thay bằng câu trỏ `01_quy_trinh_chung.md`; khuôn sáu chặng nội dung chuyển sang `03_kich_ban_va_loi_viet.md` mục 4; mục 1, 3, 6 sửa chỗ lỗi thời (mã D thành hệ trục, phông Be Vietnam Pro).
> **Phiên bản:** 1.9 · **Cập nhật:** 2026-10-27 · Bước 4 chọn tổ hợp dựng theo hệ trục (`04_he_truc_dung.md` mục 2 và 3), không chọn mã D. Mã dựng `xuong/` hiện chỉ có chất liệu CL-01 với màu MAU-01.
> **v1.8** 2026-10-27 · Kịch bản và thành phẩm theo quy tắc mỗi video một thư mục (`AGENTS.md` mục Quy ước sản phẩm): bước 3 tạo thư mục video, bước 8 giao vào thư mục đó; lệnh sinh giọng đổi đường dẫn kịch bản.

## Mục lục

Số mục giữ số của `01_khuon_video_ngan.md` cũ.

| Mục | Nội dung | Ghi chú |
|---|---|---|
| 1 | Trạng thái thật của xưởng (đọc kỹ trước khi hứa với Trung) | file này |
| 2 | Cảnh hình, khối cảnh dựng sẵn, biểu tượng | file này; khuôn sáu chặng nội dung nay ở `03_kich_ban_va_loi_viet.md` mục 4 |
| 3 | Thông số kỹ thuật cố định | file này |
| 4 | Quy trình mỗi video | nay ở `01_quy_trinh_chung.md` |
| 5 | Chạy lệnh ở đâu (lệnh dựng, kết xuất, soát) | file này |
| 6 | Việc còn phải làm để dây chuyền chạy được | file này |
| 7 | Nguồn tri thức nền | file này |

## 1. Trạng thái thật của xưởng (đọc kỹ trước khi hứa với Trung)

| Hạng mục | Trạng thái |
|---|---|
| Dự án Remotion 4.0.496 trong `xuong/` | XONG — render kiểm chứng nhiều lần, video dọc 1080×1920 dài 4 giây render khoảng 30 giây |
| 11 kỹ năng Remotion chính thức | XONG — ba bản chép thật: `xuong/.claude/skills/` (Claude Code), `xuong/.grok/skills/`, `xuong/.agents/skills/` |
| Tiếng Việt đủ dấu trong khung hình | XONG — phông Be Vietnam Pro, dự phòng Helvetica Neue (đổi từ Segoe UI ngày 26/10/2026 vì Segoe UI là phông Windows); kiểm bằng khung cắt từ mp4 |
| Kho phong cách 2 ngăn + hai cửa chọn trong quy trình | XONG — trạng thái duyệt của lối viết và tông dựng ghi ở `tai_san/so_tay_gu/00_muc_luc.md` (không chép lại ở đây vì bản chép tay đã lệch). Cửa chọn 1: `03_kich_ban_va_loi_viet.md`; cửa chọn 2 theo hệ trục: `04_he_truc_dung.md`. Cho video dọc, mã dựng hiện chỉ có chất liệu CL-01 với tông màu MAU-01 (tách từ D-01) |
| **Giọng đọc tự động** | **XONG** — giọng duy nhất là VieNeu Hải Đăng (chạy trên máy, miễn phí; từ 25/10/2026 là mặc định, từ 27/10/2026 Trung bỏ ElevenLabs nên chỉ còn giọng này), có mốc theo câu; mốc từng từ lấy bằng Whisper. Xem `08_giong_am_thanh_phu_de.md` |
| **7 khối cảnh dựng sẵn** | **XONG** — `xuong/src/video-ngan/canh/CacKhoiCanh.tsx`. **Từ 26/10/2026 có chuyển động liên tục** để cảnh nhiều chữ không đứng yên (Trung chốt sau phép thử HyperFrames, `12_cong_cu_media_ai.md` mục 3b): khối nội dung trôi lên 3 px mỗi giây và phóng rất nhẹ, quầng sáng nền trôi (`thanh-phan/KhungNen.tsx`); đoạn chữ (`doan`) sáng dần từng từ theo khoảng lời của cảnh, khớp vào phần cuối lời đọc theo tỉ lệ ký tự (`thanh-phan/NhipLoi.tsx`); thanh tiến độ đỏ chạy suốt video ở mép trên (`VideoNgan.tsx`). Đo cùng điều kiện máy: render chậm hơn khoảng 19% (98–104 so với 87 giây khi máy bận), file 75 giây từ 7,5 MB lên 16 MB. Bản thử: `san_pham/2026.07.28.model_nho_thang_model_to/tai_nguyen/ban_nhap/2026.10.26.model_nho_remotion_chuyen_dong_v1.mp4`. Render thử trên Mac ngày 26/10/2026 (thư viện Node vừa cài): 2.510 khung hình, 83,7 giây video, 62 giây máy làm, file `xuong/out/kiem_mac/nhap_mac.mp4` |
| **Phụ đề theo giọng đọc** | **XONG chế độ theo câu; chế độ từng chữ chưa nối** — `thanh-phan/PhuDeChayChu.tsx`, dữ liệu do lệnh `gop` của `scripts/chuan_bi_video.mjs` sinh. Hiện `gop` chỉ có mốc câu: mỗi câu chia thành cụm tối đa 6 từ, thời gian của câu chia cho các cụm theo số ký tự, cụm chữ trắng, không tô đỏ từ đang đọc (Trung chọn 26/10/2026, vì từ đỏ ước theo ký tự sẽ lệch tiếng 0,2–0,5 giây). Từ đỏ chạy theo lời cần mốc từng từ bằng Whisper (`moc_tu.json`, `08_giong_am_thanh_phu_de.md` mục 5); nối vào `gop` là việc N57 của sổ nợ. Thành phần `PhuDeChayChu.tsx` đã có sẵn chế độ theo từ (`phu_de_theo` bằng `"tu"`, mỗi cụm có `moc_tu`), nên chỉ cần `gop` sinh đúng dữ liệu đó. Render thử VieNeu 26/10/2026: kịch bản "model nhỏ thắng model to", 14 cảnh, 75 giây video, 50 giây máy làm, file `xuong/out/vieneu_thu/model_nho_vieneu.mp4` |
| Bộ màu | Mã dựng chỉ có tông màu MAU-01 (tách từ D-01; `xuong/src/video-ngan/bo_mau.ts`); chọn tông dọc khác (MAU-02 đến MAU-06, tách từ D-02 đến D-06) thì phải dựng thêm bộ màu trước khi render |
| Kho biểu tượng, nhạc nền | Biểu tượng nằm trong mã (`thanh-phan/BoBieuTuong.tsx`); nhạc nền dùng chung `tai_san/nhac_nen/` với video ngang |

Nói cách khác: dây chuyền video dọc chạy được từ kịch bản tới file mp4 trên Mac, với tông MAU-01 (trước gọi D-01) và giọng VieNeu Hải Đăng. Chưa có video dọc thành phẩm nào; bản nháp duy nhất là video thử "model nhỏ thắng model to" (kịch bản ngày 28/07/2026).

**Hệ quả phải nói thẳng với Trung, không được lờ đi:** làm video dọc bây giờ thì (1) phụ đề hiện là cụm chữ trắng theo câu, không có từ đỏ chạy theo lời của tông MAU-01 (thẻ D-01 cũ); muốn có từ đỏ thì phải nối mốc từng từ bằng Whisper vào lệnh `gop` (chưa làm, N57); (2) tông khác MAU-01 phải dựng thêm bộ màu.

## 2. Cảnh hình, khối cảnh dựng sẵn và biểu tượng (video dọc)

Khuôn sáu chặng nội dung (cấu trúc kịch bản, không đổi thứ tự chặng): `03_kich_ban_va_loi_viet.md` mục 4. Dưới đây là phần dựng của video dọc.

Cách tách không tốn thêm giọng đọc: kịch bản đã viết thành nhiều đoạn `loi_doc` nhỏ (mỗi câu một đoạn) — mỗi đoạn nhỏ đó có thể đứng thành một cảnh hình riêng. Với VieNeu mỗi cảnh hình là một file tiếng riêng (`c<số cảnh>.wav`), nên tách hay gộp cảnh phải chạy lại bước `loi_doc` rồi sinh lại giọng (miễn phí, 14 cảnh mất khoảng 45 giây máy). Ví dụ video Microsoft 28/07 tách từ 7 lên 14 cảnh hình đúng theo cách này.

Mỗi khối cảnh là một thành phần giao diện nhận dữ liệu dạng JSON — cùng một khối, đổi chữ và đổi màu là ra video khác. Đây là lý do dựng khuôn một lần rồi dùng mãi.

**Ba khối dựng thêm ngoài chữ thuần** (từ 28/07 khuya muộn) — dùng khi một chặng hợp để MINH HỌA thay vì chỉ nói bằng chữ, xem chi tiết kỹ thuật ở `xuong/src/video-ngan/thanh-phan/SoDoMinhHoa.tsx`:

| Khối | Hợp với nội dung nào |
|---|---|
| Sơ đồ khối nối dây (`so_do`) | So sánh 2-3 khái niệm, có hoặc không có quan hệ nối tiếp giữa chúng |
| Chuỗi mũi tên (`chuoi`) | Một tiến trình có thứ tự: bước này dẫn tới bước kia |
| Lưới biểu tượng (`luoi`) | Liệt kê nhiều mục cùng loại |

Mỗi cảnh (kể cả cảnh chữ thuần) còn nhận được **một biểu tượng vector đại diện**, khớp với nội dung câu đó — vẽ ở `BoBieuTuong.tsx`, KHÔNG dùng logo thương hiệu thật.

## 3. Thông số kỹ thuật cố định

Khung hình dọc 1080×1920, 30 hình/giây. Nền tối, chữ trắng đậm, từ khóa tô màu nhấn. Chữ nhỏ nhất trong khung phải đủ lớn để đọc trên điện thoại — không dùng cỡ chữ dưới 32px ở độ phân giải này. Phông có dấu tiếng Việt đầy đủ: Be Vietnam Pro, dự phòng Helvetica Neue (Segoe UI là phông Windows, đã bỏ ngày 26/10/2026, xem mục 1).

Phụ đề chạy chữ: từng cụm từ nổi lên theo nhịp giọng đọc, cụm đang đọc đổi màu hoặc phóng to. **Quy tắc (Trung chốt 27/10/2026): mặc định có khi video có giọng đọc; bỏ khi video không có giọng đọc, khi chất liệu là chữ động khổng lồ (CL-11, chữ đã là hình), hoặc khi Trung nói bỏ.** Lý do để mặc định có: video có giọng đọc mà thiếu phụ đề trông như slide có tiếng. Mốc từng từ lấy bằng Whisper (`08_giong_am_thanh_phu_de.md` mục 5).

## 4. Quy trình mỗi video

Luồng làm một video (làm rõ yêu cầu, hai cửa chọn, hai cửa duyệt, kết xuất, soát, giao) dùng chung cho cả hai khổ nên nằm ở `01_quy_trinh_chung.md`. Phần riêng của video dọc: trạng thái xưởng ở mục 1, khối cảnh ở mục 2, lệnh dựng ở mục 5.

## 5. Chạy lệnh ở đâu

Mọi lệnh dựng và render chạy trong `xuong/` (lần đầu trên máy mới: `npm install`):

```bash
cd "/Users/macbooktrungnt/Documents/VideoNganHang/xuong" && npm run dev
```

`npm run dev` mở giao diện xem trước (Remotion Studio) trong trình duyệt để chỉnh mắt thường. Chuỗi lệnh từ kịch bản tới dữ liệu dựng, chạy ở gốc `Media/` (giọng VieNeu, giọng duy nhất; cách chạy ba bước ghi trong đầu file `scripts/chuan_bi_video.mjs`):

```bash
node scripts/chuan_bi_video.mjs loi_doc <tên>
```

```bash
.venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban san_pham/<thư mục video>/tai_nguyen/kich_ban/<tên>.chuong.json --ra tai_san/giong_doc/<tên>_vieneu
```

```bash
node scripts/chuan_bi_video.mjs gop <tên>
```

Script tự tìm `<tên>.canh.json` trong `san_pham/*/tai_nguyen/kich_ban/` (kịch bản cũ trước 27/10/2026 còn nằm ở `kich_ban/` thì tìm ở đó). Bước `loi_doc` ghi thêm `<tên>.chuong.json` cạnh `canh.json`, mỗi cảnh một chương. Bước `gop` đòi `tai_san/giong_doc/<tên>_vieneu/` có mốc của mọi cảnh, tăng tốc giọng 1,2 lần như video ngang, chèn 0,4 giây lặng giữa hai cảnh, ghi `xuong/public/giong_doc.mp3` và `xuong/public/du_lieu_video.json`. Sửa lời một cảnh thì sinh lại riêng cảnh đó bằng `--chuong <số cảnh>`; `gop` báo lỗi nếu lời trong `canh.json` khác bản VieNeu đã đọc. Máy nghe lại (Whisper) viết số bằng chữ số, nên câu có số hay bị báo "vẫn sai" dù VieNeu đọc đúng: nghe lại câu đó thay vì tin con số.

Render ra file: `npx remotion render VideoNgan out/<tên>.mp4 --codec=h264` (`npm run build` chỉ đóng gói, không ra mp4), rồi chép vào ngoài cùng thư mục video, tên `yyyy.mm.dd.<chủ đề>_v<n>[_nhap|_cuoi].mp4` (không ghi mã dựng; tổ hợp trục và cách làm ghi trong kịch bản và `tai_nguyen/nguon_goc.md`; video cũ giữ tên cũ; Trung chốt 27/10/2026); giọng (`tai_san/giong_doc/<tên>_vieneu/`) chép sang `tai_nguyen/am_thanh/`. Soát bằng khung cắt từ mp4, chạy ở gốc `Media/`: `python3 scripts/soat_khung_mp4.py xuong/node_modules/@remotion/compositor-darwin-arm64 <file.mp4> <thư mục ra> <số giây mỗi khung>`.

## 6. Việc còn phải làm để dây chuyền chạy được

Theo thứ tự phụ thuộc, không đảo:

1. ~~Chốt nhà cung cấp giọng đọc~~ — **XONG.** Chốt lần đầu 28/07/2026 (ElevenLabs), đổi sang VieNeu 25/10/2026, bỏ ElevenLabs 27/10/2026. Giọng duy nhất: VieNeu Hải Đăng. Xem `08_giong_am_thanh_phu_de.md`.
2. ~~Dựng 7 khối cảnh + thành phần phụ đề chạy chữ~~ — **XONG** (nhật ký 28/07/2026; render lại trên Mac 26/10/2026).
3. Dựng thêm bộ màu cho các tông dọc MAU-02 đến MAU-06 (trước gọi D-02 đến D-06) khi Trung chọn tông đó (mới có MAU-01).
4. ~~Nhạc nền~~ — có ở `tai_san/nhac_nen/`; biểu tượng nằm trong `thanh-phan/BoBieuTuong.tsx`.
5. ~~Cho chuỗi video ngắn dùng giọng VieNeu~~ — **XONG 26/10/2026.** Lệnh `gop` nhận mốc câu (`c<số cảnh>.moc_cau.json`); phụ đề theo câu. Cách chạy ở mục 5. Từ 27/10/2026 lệnh `gop` không còn đường ElevenLabs. Chưa làm: nối mốc từng từ bằng Whisper (`moc_tu.json`) vào `gop` để có từ đỏ chạy theo lời (sổ nợ N57) — Trung quyết khi xem video thật và thấy thiếu.
6. Làm thử 2–3 video thật. Chạy trơn rồi mới đóng gói thành kỹ năng riêng — đóng gói sớm là gói lại cái chưa ổn định.

## 7. Nguồn tri thức nền

Hai báo cáo nghiên cứu gốc nằm ở `san_pham/` của project META: `2026.07.19.phan_tich_ainius_huong_dan_lam_video_v1.md` và `2026.07.20.trend_video_minh_hoa_va_huong_dan_tu_lam_v1.md`. Module này là bản rút gọn để thi hành; cần lý lẽ đằng sau một lựa chọn thì mở báo cáo.
