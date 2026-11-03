---
name: lam-video-ngan-hang
description: "Làm một video chiến dịch Chuyện nghề Ngân hàng từ chủ đề đến bản nháp và chữ đăng: nguồn kiểm chứng, kịch bản, giọng VieNeu Quốc Tuấn, dựng bằng một trang HTML, pha máy, hình thu nhỏ, chữ đăng. Dùng cho Antigravity (Gemini 3.8 Flash), Hermes, Claude Code. Kích hoạt khi Trung nói: làm video ngân hàng, làm video thuật ngữ, làm video N<mã> trong sổ nợ, chạy lô video ngân hàng, làm video chiến dịch Chuyện nghề Ngân hàng, video giải thích thuật ngữ. KHÔNG dùng cho: video kênh khác (điện, vĩ mô, khu công nghiệp), tải lên YouTube (skill dang-youtube), việc chỉ viết chữ đăng (viet-chu-dang-video)."
version: 1.0.0
platforms: [macos]
metadata:
  lap_ngay: 2026-11-03
  nguon: "Gom từ 01_quy_trinh_chung.md và nguon_goc.md của 13 video làm 29/10–02/11/2026 ở project Media (video mẫu: xuong_html/n199_hoat_dong_huy_dong_von)"
  related_skills: [dung-video-html, viet-chu-dang-video, toi-uu-phan-phoi, ra-soat-dung-chung, soi-hinh-thu-nho, dang-youtube]
---

# Làm một video Chuyện nghề Ngân hàng

Chạy ở gốc project `~/Documents/VideoNganHang`. Đọc trước `tai_san/chien_dich_ngan_hang/quy_tac_chien_dich.md`. Lệnh dưới đây đã chạy thật ở video mẫu `xuong_html/n199_hoat_dong_huy_dong_von/` (xem `SO_VONG_SUA.md` và `san_pham/` của video đó ở Media); khi lệnh lỗi, đọc `90_bai_hoc.md` trước khi đổi cách làm.

**Model:** toàn bộ việc, kể cả dựng hình và soát, chạy bằng Gemini 3.8 Flash qua Antigravity (Trung chốt 03/11/2026). Model này viết đúng chữ nhưng hay dựng "slide" (thẻ chữ dày, chữ nhỏ, hình đứng yên) và tự khen kết quả. Video N301 ngày 03/11/2026 là ví dụ không đạt: 0/8 chương qua máy đo. Vì vậy bước 5 và 6 có chuẩn hình (`chuan_hinh_video_ngang.md`), cổng máy đo và soát độc lập (`mau_soat_doc_lap.md`); không bỏ bước nào.

Quy ước dùng trong file này: `<mã>` là mã sổ nợ viết thường (ví dụ `n199`), `<tên>` là tên chủ đề không dấu nối gạch dưới, `<thư mục video>` là `san_pham/yyyy.mm.dd.<tiêu đề video>` (ngày mở việc), `<kịch bản>` là `<thư mục video>/tai_nguyen/kich_ban/yyyy.mm.dd.<tên>_v1.chuong.json`.

## Sơ đồ

```
Sổ nợ (mục N) ──► 1 Nguồn ──► 2 Kịch bản + tóm tắt ──► 3 Tổ hợp dựng
   PHA 1 (AI)                                                │
   ┌───────────────────────────────────────────────────────┘
   ▼
 4 Giọng Quốc Tuấn ► 5 Mốc thời gian + mã dựng từng chương ► 6 Ảnh tĩnh ≥3 vòng
                                   ► máy đo hình (cổng) ► soát độc lập (phiên mới)
                                                      │
                          Trung duyệt ảnh lưới ◄──────┘
   PHA 2 (máy) ► 7 Kết xuất theo chương
   PHA 3 (AI)  ► 8 Sửa chương lỗi ► bản nháp _nhap
               ► 9 Chữ đăng + hình thu nhỏ
                          Trung duyệt bản nháp ► đổi _cuoi ► Trung ra lệnh tải lên
```

## Bước 0 — Nhận việc

1. Tìm mục N trong `so_no_cong_viec.md`; chưa có thì ghi mục mới theo mẫu các mục có sẵn (Ngày ghi, Trung nói nguyên văn, Cách hiểu tạm, Trùng với video đã làm, Điều kiện bắt đầu, Trạng thái). Đổi Trạng thái thành "Đang làm (phiên <tên công cụ>, <ngày>)".
2. Chủ đề chưa rõ góc nhìn thì hỏi Trung theo `02_lam_ro_yeu_cau.md`, tối đa 3–4 câu, kèm đề xuất. Đã rõ thì không hỏi.
3. Báo chi phí một dòng: giờ máy ước 5–8 phút kết xuất mỗi video 4 phút (`scripts/pha_may/HUONG_DAN.md`), thời gian đọc giọng, số tác tử dùng.
4. Tạo thư mục video và `tai_nguyen/kich_ban/`. Không đưa video đã làm trước vào chung thư mục.

## Bước 1 — Nguồn và kiểm chứng

- Văn bản pháp luật công khai còn hiệu lực: Luật Các tổ chức tín dụng 32/2024/QH15, thông tư của Ngân hàng Nhà nước, nghị định liên quan. Tra bản mới nhất trên cổng văn bản chính thức; hai nguồn khớp cho mỗi quy định và mỗi số đưa lên hình.
- Một nguồn thì không đưa lên hình. Văn bản có thể đã bị thay, sửa (ví dụ Nghị định 69/2018 bị Nghị định 292/2026 thay từ 05/09/2026): kiểm ngày hiệu lực.
- Ghi vào `<thư mục video>/tai_nguyen/kich_ban/<…>_v1.nguon_kiem_chung.md` (bảng khẳng định, nguồn, trạng thái) và `<…>_v1.du_kien.json` (số hiện trên hình). Mọi số trên màn hình chỉ lấy từ file này.
- Không dùng `RM MB/tai_san/` hay tài liệu nội bộ nào. Tình huống thực tế của Trung (nếu có) phải ẩn danh trước khi vào kịch bản.

## Bước 2 — Kịch bản và tóm tắt

- Ngang 1920×1080, 4–6 phút, 5–9 chương, một thuật ngữ hoặc một cặp hay bị nhầm, một ví dụ giả định xuyên suốt có tính tiền, đoạn "ảnh hưởng tới lãi vay của bạn thế nào" khi video viết cho người đi vay.
- Chọn lối viết (mã KB) theo `03_kich_ban_va_loi_viet.md` và `tai_san/so_tay_gu/00_muc_luc.md`; ghi mã và lý do ở đầu kịch bản (làm một mạch). Dòng "Biến tấu" theo `04_he_truc_dung.md` mục chống nhàm chán.
- Định dạng `<tên>.chuong.json` kèm bản đọc `.md`: `10_video_ngang_thuyet_minh.md`. Trường `doc` là chữ đọc: viết chữ viết tắt và chữ tiếng Anh theo từ điển đọc, năm đọc gọn.
- Lời đọc không trỏ sang video khác. Chương cuối kết bằng câu kêu gọi đăng ký kênh đã ghi ở file quy tắc chiến dịch (mục "Câu kêu gọi cuối video").
- Viết `<…>.tom_tat.md` (dòng đầu `# Tóm tắt: <tên video>`, một đoạn 4–5 câu).

## Bước 3 — Tổ hợp dựng

```bash
python3 scripts/goi_y_to_hop_dung.py --kho ngang --kb <KB> --chu-de <loại> --linh-vuc tai_chinh --do-dai <giây>
```

`--linh-vuc` của video ngân hàng là `tai_chinh`. `--chu-de` chọn một trong: `co_che_quy_trinh` (thuật ngữ nói về cách vận hành), `so_sanh` (cặp hay bị nhầm), `dinh_luong` (có tính tiền), `so_lieu_danh_sach`, `vach_tran`, `san_pham_giao_dien`, `cong_cu_thao_tac`, `may_moc`, `hien_tuong`. Gợi ý chỉ là điểm xuất phát: bảng chấm điểm của script được tính từ video điện và khoa học. Các video ngân hàng ngày 29/10–02/11/2026 đều dùng lối viết KB-02 và dựng bằng HTML với nhiều chất liệu khác nhau (đã ghi trong dòng "Tổ hợp" của `nguon_goc.md` ở Media: CL-05, CL-06, CL-09, CL-10, CL-12, CL-13, CL-14, CL-15, CL-16; mã cách làm MK-01, MK-08, MK-10, MK-14), nên đọc thêm mục "Lựa chọn mới, chưa chấm điểm" của script và chọn theo tính chất video.

Chọn một tổ hợp: chất liệu (CL), bố cục (BC), màu (MAU), nhạc (NH). Điều kiện: khác 3 video gần nhất ở ít nhất hai trục, hai video liền nhau trong lô không cùng chất liệu; màu có thể lấy theo ngân hàng thật nhưng không tên, không logo; bộ màu không trùng màu một ngân hàng cụ thể khi video so sánh. Lô từ 3 video cùng chủ đề: chạy skill `ra-soat-dung-chung` trước.

## Bước 4 — Giọng

Tốc độ video mới: 5,06 âm tiết mỗi giây (script tự đọc `tai_san/cau_hinh_giong.json`).

```bash
python3 -I scripts/kiem_loi_doc.py <kịch bản>            # phải 0 lỗi; chữ mới chưa có trong từ điển thì thêm vào tai_san/giong_doc/tu_dien_doc/ngan_hang.json
.venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban <kịch bản> --ra xuong_html/<mã>_<tên>/am_thanh --giong "Quốc Tuấn"
```

Nghe lại và đọc lại riêng câu đọc sai bằng `<mã>_doc_lai.py` (mẫu `n199_doc_lai.py`). Đọc lại câu của video đã căn nhịp thì phải truyền `--he-so-keo` của chương cũ.

## Bước 5 — Mã dựng và nhịp

**Đọc trước, bắt buộc:** `skills/lam-video-ngan-hang/chuan_hinh_video_ngang.md` bản 2 (tám luật cảnh, bảng cơ chế → khuôn trong kho, câu cơ chế mẫu, số đo n199 và n301) và mở hai ảnh trong `tai_san/anh_chuan_hinh/`. Ghi nhịp trong mảng `nhip` của `nhip.json` trước (mỗi chương: `co_che` câu cơ chế, `hinh_chinh`, `chuyen_dong`, `khuon`), rồi dựng MỘT chương một lần: chụp ảnh tĩnh, làm phép thử tắt tiếng (chỉ nhìn ảnh, viết "hình này giải thích …" vào `SO_VONG_SUA.md`, so với `co_che`), đạt mới sang chương sau. Không viết cả video rồi mới chụp.

Chép khung trang từ video mẫu rồi đổi tiền tố:

```bash
cp -R xuong_html/n199_hoat_dong_huy_dong_von xuong_html/<mã>_<tên>
# đổi tên mọi file n199_* thành <mã>_*, rồi sửa nội dung: trang.html, canh.js, nhip.json, các script <mã>_*
```

Trong `canh.js` chép sang, giữ khung trang (`seek`, phụ đề, logo, màn hình kết, hàm đếm chữ) nhưng XOÁ các cảnh chương của n199 rồi viết lại theo câu cơ chế. Các hàm vẽ cảnh `be`, `voi`, `roi`, `cham`, `toa` vẽ tiền gửi chảy vào ngân hàng; chỉ dùng khi câu cơ chế của chương cũng là tiền chảy vào hoặc ra. Không giữ cảnh cũ rồi đổi nhãn (lỗi của N301, N302 ngày 03/11/2026).

Khuôn chung (khung, phụ đề chạy chữ, logo kênh, màn hình kết 10 giây) nằm trong `xuong_html/<mã>_<tên>/thu_vien/` và `tai_san/kho_hinh_chung/`. Cách viết trang và hợp đồng `seek(t)`: skill `dung-video-html` và `skills/dung-video-html/tham_chieu/hop_dong_trang.md`. Màn hình kết bắt đầu đúng lúc câu kêu gọi đăng ký kênh bắt đầu.

**Sửa đường dẫn cứng trong các script chép từ n199** (mỗi video có bản riêng, không dùng chung): trong `<mã>_tao_nhip.py` sửa `MA`, `SP` (thư mục `kich_ban` của video mới), `KICH_BAN`, `DU_KIEN`, `NHAC`; trong `<mã>_doc_giong.sh` sửa đường dẫn kịch bản và thư mục ra. Tìm sót bằng `grep -rn "n199\|huy_dong_von" xuong_html/<mã>_<tên> --include=*.py --include=*.sh --include=*.mjs --include=*.js --include=*.html --include=*.json`.

Nhịp từ giọng đọc (chạy lại sau mỗi lần đọc lại giọng; chưa có giọng thì thêm `--uoc` để lấy mốc ước tính, không ghi `nhip.json`):

```bash
python3 -I xuong_html/<mã>_<tên>/<mã>_tao_nhip.py
```

Script đọc `am_thanh/c<id>.wav` và `c<id>.moc_cau.json` do bước 4 sinh ra, ghi `thoi_gian.json` (kèm màn hình kết) và `nhip.json` (quy cách pha máy), rồi chèn mốc vào `trang.html`.

Nhạc: chọn bài theo `08_giong_am_thanh_phu_de.md` (nhạc ngắn hơn video thì nối mờ chéo; độ to nhạc nhỏ hơn giọng khoảng 15 dB) bằng `<mã>_noi_nhac.sh`.

## Bước 6 — Ảnh tĩnh, cổng máy đo, soát độc lập (kết thúc pha 1)

1. **Ảnh tĩnh ít nhất 3 vòng**, mỗi vòng vào thư mục riêng `anh_tinh/v1`, `v2`, `v3` (vòng cuối mỗi câu một ảnh như n199: `n<mã>_anh_tinh.mjs --moi-cau --ra anh_tinh/v3`). Mỗi vòng: nhìn từng ảnh, ghi lỗi tìm thấy và cách sửa vào `SO_VONG_SUA.md`, sửa rồi chụp lại. Ghép lưới bằng `<mã>_luoi.sh`.
2. **Cổng máy đo** (phải thoát 0, không đổi ngưỡng):

```bash
node scripts/do_chat_luong_hinh.mjs xuong_html/<mã>_<tên> --buoc 2
```

3. **Máy kiểm chữ đè, tràn khung, tương phản:** `node xuong_html/<mã>_<tên>/<mã>_quet_kiem.mjs` (0 lỗi) và `<mã>_tuong_phan.mjs --moi 2` (vật chính tối thiểu 3:1, `15_bang_kiem_truoc_khi_giao.md`).
4. **Soát độc lập** theo `skills/lam-video-ngan-hang/mau_soat_doc_lap.md`: mở phiên Antigravity MỚI, dán phiếu, lưu kết quả `tai_nguyen/ban_nhap/<tên>_soat_doc_lap.md`. Sửa mọi mục nặng và vừa, chụp lại, chạy lại cổng máy đo, soát lại các chương đã sửa. Còn mục nặng thì không sang bước 7.
5. Trình Trung ảnh lưới 3–4 khung mỗi video kèm kết quả máy đo và bản soát độc lập (chương nào đã sửa theo soát). Có chữ "duyệt" mới sang bước 7. Lô nhiều video: duyệt ảnh lưới cả lô một lần.

## Bước 7 — Pha máy (kết xuất)

Chỉ chạy sau khi Trung duyệt ảnh tĩnh hoặc khi lệnh của Trung cho tự chạy.

```bash
node scripts/pha_may/pha_may.mjs tao <mã> xuong_html/<mã>_<tên> --san-pham "<thư mục video>"
node scripts/pha_may/pha_may.mjs chay --chi <mã>
```

Máy kết xuất theo chương, thay khung hỏng, chỉnh âm lượng về −14 LUFS, đo đứng hình, ghi báo cáo `du_lieu/pha_may/bao_cao/<mã>.md`. Máy chạy tối đa 3 video cùng lúc ở bước đọc giọng và ảnh tĩnh (giới hạn RAM).

## Bước 8 — Sửa lỗi, bản nháp

Đọc báo cáo và bảng ảnh soát. Lỗi thì sửa mã, ghi lại phiếu với `--chuong-sua <các chương>`, chạy lại `chay --chi <mã>` (chỉ chương sửa được kết xuất lại). Quét khung hỏng bắt buộc:

```bash
.venv_vieneu/bin/python scripts/quet_khung_hong.py <file mp4>
```

Đạt thì chép bản đủ ra ngoài cùng thư mục video thành `yyyy.mm.dd.<tên>_youtube_v1_nhap.mp4` (kiểm `cmp` trùng byte với bản trong `out/pha_may/`). Nghe tai các câu đã đọc lại; chữ nào cần Trung nghe thì ghi vào `nguon_goc.md` mục "Để Trung xét khi duyệt".

## Bước 9 — Chữ đăng và hình thu nhỏ (làm ngay khi giao bản nháp)

- Chữ đăng theo skill `viet-chu-dang-video` và `quy_tac_kenh_ngan_hang.md`: `tai_nguyen/dang_bai/youtube.md`, `facebook.md`; tiêu đề đúng nguyên văn chữ Trung ghi nợ (không thêm dấu hỏi), một chính một dự phòng; mô tả 50–70 từ có 5–8 mốc chương; hashtag kết thúc `#nganhang #chuyennghenganhang`. Kiểm: `python3 -I skills/viet-chu-dang-video/scripts/kiem_chu_dang.py <thư mục video>` phải 0 lỗi.
- Hình thu nhỏ: mỗi video một hình, bố cục theo `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md` mục 0b, chữ dòng 1 là thuật ngữ đầu tiêu đề. Viết `tai_nguyen/dang_bai/hinh_thu_nho.json` rồi `cd xuong_html/hinh_thu_nho && node xuat.mjs <đường dẫn hinh_thu_nho.json>`.
- Kiểm phân phối: `python3 -I skills/toi-uu-phan-phoi/scripts/kiem_dang.py "<thư mục video>"` phải 0 lỗi.

## Bước 10 — Ghi lại và dừng ở cửa duyệt

1. `tai_nguyen/nguon_goc.md`: trạng thái, mã dựng, tổ hợp, giọng, nhạc, nguồn, lệnh dựng lại, các điều Trung cần xét khi duyệt.
2. Mục "Kết quả dùng thử" cuối kịch bản (tổ hợp, điều đạt, điều chưa đạt, giờ máy).
3. `so_no_cong_viec.md`: Trạng thái thành "Bản nháp chờ Trung duyệt (<ngày>)". Lỗi kỹ thuật mới → `90_bai_hoc.md` (thêm một dòng vào mục lục).
4. Commit: `git add` đúng file của video này rồi `git commit`.
5. Báo Trung: tên video, độ dài, đường dẫn bản nháp kèm khối lệnh `open "<đường dẫn tuyệt đối>"`, và danh sách điểm cần nghe, cần xem.
6. **Dừng.** Trung duyệt thì: đổi `_nhap` thành `<tiêu đề video>.mp4` (bản cuối), chép giọng và nhạc vào `tai_nguyen/am_thanh/`, viết `nguon_goc.md`. Tải lên YouTube chỉ khi Trung ra lệnh, bằng skill `dang-youtube`.

## Những chỗ hay sai

- Đọc giọng lại một chương của video đã có mốc thời gian mà quên `--he-so-keo`: lệch phụ đề.
- Khuôn CL-07 nạp phông hai đợt có thể làm trình chụp pha máy treo: nạp đủ năm độ đậm phông ngay sau `kho_nen.js` (ghi nhận 01/11/2026, chờ ghi `90_bai_hoc.md`).
- Whisper nghe thuật ngữ theo chính tả quốc tế: quy về cách viết của trường `doc` trước khi so (`chuan_hoa_nghe_lai` trong `tai_san/cau_hinh_giong.json`).
- Gemini 3.8 Flash dựng "slide" thay vì hình chuyển động và tự khen: chỉ tin cổng máy đo và phiên soát mới, không tin lời tự đánh giá của phiên dựng.
- Giữ cảnh bể, vòi, hạt, chấm của n199 rồi đổi nhãn, hoặc lấy nhà xưởng, toà nhà làm hình chính: máy đo vẫn đạt (lắc khung hình đủ tính là chuyển động) nhưng hình không giải thích khái niệm. N301 và N302 ngày 03/11/2026 mắc lỗi này. Chặn bằng câu cơ chế trong `nhip.json` và phép thử tắt tiếng.
- Ghi sai nhãn chất liệu (ví dụ ghi CL-14 mà dựng thẻ chữ): máy đo sẽ bắt vì không có chuyển động.
- Chữ trên hình lặp lại lời đọc: chữ chi tiết đã có ở phụ đề; hình chỉ giữ nhãn ngắn và số.
