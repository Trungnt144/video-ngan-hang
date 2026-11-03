# 01 — Quy trình chung làm một video

> Đọc file này khi Trung nói "làm video về …", khi cần biết bước kế tiếp, hoặc khi không rõ việc đang làm thuộc module nào. Đây là bản duy nhất tả luồng tổng; các module khác chỉ tả phần riêng của mình và trỏ về đây.
> **Phiên bản:** 1.6 · **Cập nhật:** 2026-10-29 · 1.6: mục 7 thêm bước tra tài nguyên đã lưu trữ trên Drive trước khi sửa video đã giao (skill `luu-tru-drive`). 1.5: bước 8 gọi skill `viet-chu-dang-video` (chữ đăng `tai_nguyen/dang_bai/<nền tảng>.md`, kiểm bằng script, chuyển sang file kê khai `dang-youtube`). 1.4: bước 3 thêm file tóm tắt nội dung `<thư mục>.tom_tat.md` cho ô "Tóm tắt nội dung" của bảng video (Trung chốt qua bảng chọn 28/10/2026). 1.3: Gom bài học lô 18 video điện chung và điện mặt trời (Trung duyệt gom 28/10/2026): mục 7 thêm dòng một mã video chỉ giao cho một phiên, trỏ về bài học ghi ở `90_bai_hoc.md`, và dòng kiểm trước khi giao bản cuối để không giao trùng giữa bảng video và phiên (Trung chốt 28/10/2026). 1.2: video ngang Remotion (LM-02) bỏ kết xuất nháp nửa độ phân giải; bước 5 duyệt bằng ảnh tĩnh, bước 6 kết xuất đủ một lần bằng trình chạy pha máy `scripts/pha_may/` (có bộ đệm chương); lô nhiều video chạy ba pha AI → máy → AI (sổ nợ N58, Trung chốt qua bảng chọn). 1.1: bước 8 trỏ tới 5 bố cục hình thu nhỏ L1–L5 và khuôn `xuong_html/hinh_thu_nho/`. 1.0: Module mới khi dựng lại luồng Media. Gom ba bản tả luồng đang lệch nhau (8 bước ở `12_kho_phong_cach.md` cũ mục 2 và `01_khuon_video_ngan.md` cũ mục 4, 6 bước ở `14_khuon_video_dai_thuyet_minh.md` cũ mục 2, cùng "LỐI VÀO NHANH" của 12 cũ) thành một luồng 10 bước dùng chung cho video dọc và video ngang, chia nhánh theo cách làm. Áp các quyết định Trung chốt qua bảng chọn ngày 27/10/2026: ngoại lệ của hai cửa chọn, một mức xuất (riêng cách làm HTML có hai mức), chỗ ghi kết quả dùng thử, bước chuẩn bị đăng, quy tắc nhiều phiên cùng làm, chỉ dùng giọng VieNeu. Bảng chuyển tên module: `_bang_chuyen_module_2026.10.27.md`.

## Mục lục

1. Lối vào nhanh
2. Luồng 10 bước
3. Bảng bước → file hướng dẫn → đầu ra
4. Hai cửa chọn, hai cửa duyệt và hai ngoại lệ
5. Nhánh dựng theo cách làm
6. Luồng hiện chạy được tới đâu
7. Nhiều phiên cùng làm trong Media

## 1. Lối vào nhanh

Trung nói *"làm video về [chủ đề]"* → Claude làm đúng ba việc, theo thứ tự:

1. **Hỏi cho rõ** theo `02_lam_ro_yeu_cau.md` bộ câu (a): tối đa 3–4 câu, luôn kèm đề xuất để Trung chỉ cần gật. Chốt khổ trước tiên: video dọc 1080×1920 (giai đoạn 1) hay video ngang 1920×1080 có thuyết minh (giai đoạn 3). Khổ quyết định mọi bước sau.
2. **Đề xuất 2–3 lối viết kịch bản** (mã KB) theo công thức trong `03_kich_ban_va_loi_viet.md`, chờ Trung chốt mã.
3. **Viết kịch bản** theo thẻ KB đã chốt vào thư mục video, viết luôn file tóm tắt nội dung (mục 2, bước 3), rồi trình Trung duyệt chữ.

Trung nói "làm một mạch" hoặc giao một chuỗi nhiều video thì xem mục 4: được bỏ hai cửa chọn.

## 2. Luồng 10 bước

```
 0. Làm rõ yêu cầu, chốt khổ dọc hay ngang          (02)
 1. Nguồn và kiểm chứng kiến thức                     (03)
 2. Đề xuất 2–3 lối viết          ══► CỬA CHỌN 1: Trung chốt mã KB
 3. Tạo thư mục video, viết kịch bản 5–9 cảnh         (03, 04 mục chống nhàm chán)
    và file tóm tắt tai_nguyen/kich_ban/<thư mục>.tom_tat.md
                                   ──► CỬA DUYỆT 1: Trung chốt chữ, chưa dựng
 4. Chạy script gợi ý, đưa 2–3 tổ hợp dựng kèm cách làm
                                   ══► CỬA CHỌN 2: Trung chọn tổ hợp CL · CT · BC · MAU
                                       (nhạc NH Claude tự chọn, báo một dòng)   (04, 05)
 5. Dựng theo nhánh cách làm: dữ liệu cảnh → giọng VieNeu → căn mốc thời gian → hình
    → ảnh tĩnh mọi chương, tự soát (thủ pháp 06; giao tác tử con theo khuôn 07)
 6. Xuất bản nháp một lần (LM-02: trình chạy pha máy), tự soát (15, 07)
                                   ──► CỬA DUYỆT 2: Trung xem nhịp, bố cục, chữ
 7. Bản cuối: đổi tên _nhap → _cuoi (riêng cách làm HTML: xuất lại 60 khung/giây có nhoè)
 8. Chuẩn bị đăng: mô tả, thẻ chủ đề, hình thu nhỏ
 9. Ghi lại: "Kết quả dùng thử" cuối kịch bản, nhật ký, sổ nợ, bài học
```

**Tối ưu phân phối (thêm 29/10/2026).** Ở mỗi bước, Claude tự đọc phần tương ứng của `skills/toi-uu-phan-phoi/yeu_cau_khi_lam.md` (từ khoá chính ở bước 0–1; câu mở 3 giây, chương đứng riêng, đoạn dọc ở bước 3; nhạc, phụ đề, vùng an toàn ở bước 5; thông số xuất ở bước 6–7). Sau bản cuối và trước khi tải lên: `python3 -I skills/toi-uu-phan-phoi/scripts/kiem_dang.py san_pham/<thư mục video>` ra 0 lỗi.

**Bước 0.** Câu hỏi theo `02_lam_ro_yeu_cau.md`. Câu trả lời về gu và thông số ghi thành thẻ trong `tai_san/so_tay_gu/` để lần sau không hỏi lại.

**Bước 1.** Mỗi khẳng định khoa học, kinh tế có nguồn; khẳng định chưa có nguồn thì bỏ khỏi video hoặc ghi "cần đối chiếu". Bảng khẳng định, nguồn, trạng thái lưu ở `san_pham/<thư mục video>/tai_nguyen/kich_ban/<tên>.nguon_kiem_chung.md`. Mọi con số hiện trên màn hình chỉ lấy từ file này. Không đưa số liệu chỉ có một nguồn vào video; nguồn tiếng Trung hoặc nguồn Việt khó tìm thì dùng skill `giao-antigravity-tra-cuu` của META. Áp cho cả video dọc lẫn video ngang (trước 27/10/2026 chỉ luồng ngang có bước này). Cách làm chi tiết: `03_kich_ban_va_loi_viet.md`.

**Bước 2.** Mỗi lối viết đề xuất một dòng: mã và tên → tóm tắt một câu → một vế nói rõ chỗ không hợp → "đã dùng ở X/3 video gần nhất". Kho lối viết: `tai_san/so_tay_gu/00_muc_luc.md` Bảng 1.

**Bước 3.** Tạo `san_pham/yyyy.mm.dd.<chủ_đề>/tai_nguyen/kich_ban/` ngay khi bắt đầu viết (quy ước thư mục ở `san_pham/README.md`). Số cảnh 5–9, độ dài 60–150 giây với video ngang; không mặc định 7 cảnh, 120 giây. Chọn biến tấu và ghi dòng "Biến tấu" ở đầu kịch bản theo `04_he_truc_dung.md` mục chống nhàm chán. Lời đọc, phụ đề và chữ trên hình không nhắc tới video khác (quy tắc ở `03_kich_ban_va_loi_viet.md`). Định dạng file kịch bản theo khổ: video dọc ở `09_video_doc_ngan.md`, video ngang (`<tên>.chuong.json` kèm bản đọc `.md`) ở `10_video_ngang_thuyet_minh.md`.

**Bước 4.** Chạy `python3 scripts/goi_y_to_hop_dung.py --kho <doc|ngang> --kb <KB> --chu-de <loại> --linh-vuc <lĩnh vực> --do-dai <giây>` (thêm `--gap` khi cần video trong vài giờ). Script in hai phần:
- Danh sách tổ hợp đã chấm điểm từ các lựa chọn đã dùng thật, mỗi tổ hợp kèm cách làm đề xuất và thời gian máy.
- Mục "Lựa chọn mới, chưa chấm điểm": chất liệu, bố cục, màu học từ repo Opus 5.5 ngày 27/10/2026. Claude tự đánh giá lựa chọn mới có hợp nội dung và tính chất video này không (Trung chốt 27/10/2026: chưa chấm điểm vội), đề xuất khi hợp và ghi rõ là lựa chọn mới, chưa dựng thật.

Đưa Trung 2–3 tổ hợp theo cách trình bày ở `04_he_truc_dung.md`: năm mã kèm tên, cách làm (`05_cach_lam.md`), thời gian máy, mã dựng đã có hay phải làm thêm, một vế không hợp, câu Claude nghiêng về tổ hợp nào.

**Bước 5.** Dựng theo nhánh của cách làm đã chọn (mục 5). Claude tự chạy, không hỏi: dữ liệu cảnh → giọng đọc VieNeu (`08_giong_am_thanh_phu_de.md`) → căn mốc thời gian theo mốc câu hoặc mốc từng từ → hình. Mỗi cảnh áp thủ pháp hợp chất liệu và đủ lớp hoàn thiện bắt buộc (`06_thu_phap_va_hieu_ung.md`). Việc dựng hình giao tác tử con thì viết prompt theo `07_khuon_prompt_va_kiem_chat_luong.md`: bản đồ nhịp và storyboard trước khi viết mã, 1–2 ảnh đích ghép, vòng xem và sửa có sổ ghi. Nhạc nền giữ cách làm hiện có của từng khổ (Trung chốt 27/10/2026 không thêm bước nhạc riêng vào luồng chung): bài nhạc do script chọn ở bước 4, đặt trong mã dựng; quy tắc chọn bài, nhạc ngắn hơn video, độ to ở `08_giong_am_thanh_phu_de.md`. Video ngang Remotion (LM-02) soát hình bằng ảnh tĩnh mọi chương qua chỗ nhanh của hàng đợi (`scripts/hang_doi_ket_xuat.sh`), không kết xuất nháp nửa độ phân giải (Trung chốt 28/10/2026: bản nháp chiếm 68% giờ máy của hai lô 27–28/10 mà chậm hơn bản đủ, `07_khuon_prompt_va_kiem_chat_luong.md` mục 14). Màu và cỡ của nhãn, phụ đề chốt ở bước này.

**Bước 6.** Xuất **một lần** ở chất lượng giao (Trung chốt 27/10/2026; khoảng 30 video ngang đã làm theo cách này). Video ngang Remotion (LM-02): ghi phiếu rồi chạy trình chạy pha máy (`node scripts/pha_may/pha_may.mjs tao <mã> xuong_dai/<tên>`, rồi `chay`). Trình chạy kết xuất theo chương, tự thay khung hỏng, chỉnh độ to về −14 LUFS, đo đứng hình và cắt bảng ảnh soát, rồi ghi báo cáo. Sửa sau đó thì ghi lại phiếu kèm `--chuong-sua`, chỉ chương sửa được kết xuất lại (`scripts/pha_may/HUONG_DAN.md`). Video lẻ được chạy pha máy ngay; lô nhiều video thì chờ Trung ra lệnh (mục 4). Trước khi trình, Claude tự soát theo `15_bang_kiem_truoc_khi_giao.md`: khung cắt từ chính file MP4, chữ đè, tương phản vật chính tối thiểu 3:1, quét khung hỏng với cảnh WebGL, thanh chất lượng ở `07_khuon_prompt_va_kiem_chat_luong.md` (đứng hình, tương phản chữ, hiểu được khi tắt tiếng, phần tử sót cảnh). Lưu bản nháp ngoài cùng thư mục video với đuôi `_nhap`, kèm khối lệnh `open` để Trung mở.

**Bước 7.** Trung duyệt bản nháp thì đổi thành bản cuối:
- Remotion (LM-01, LM-02), HyperFrames (LM-04), Blender (LM-05), clip AI (LM-06): không xuất lại; bản nháp đã duyệt đổi tên thành `_cuoi`. Bản nháp trùng từng byte với bản cuối (kiểm bằng `cmp`) bỏ vào Thùng rác; bản nháp khác chuyển vào `tai_nguyen/ban_nhap/`.
- HTML một trang (LM-03): bản Trung duyệt là bản 30 khung/giây. Video có chuyển động nhanh thì xuất lại 60 khung/giây có nhoè chuyển động làm bản cuối, báo trước thời gian máy (đo 27/10/2026: khoảng 11,7 giây máy cho mỗi giây video, gấp khoảng 8,6 lần bản 30 khung/giây). Video không có chuyển động nhanh thì giữ bản đã duyệt.
- Tên file mới: `yyyy.mm.dd.<chủ đề>_v<n>_cuoi.mp4`, không ghi mã dựng (Trung chốt 27/10/2026). Tổ hợp trục và cách làm ghi trong kịch bản và `tai_nguyen/nguon_goc.md`. Video cũ giữ tên cũ.
- Khi giao: chép giọng và nhạc đã dùng sang `tai_nguyen/am_thanh/`, viết `tai_nguyen/nguon_goc.md` (thư mục mã dựng, cách làm, lệnh dựng lại).
- Sửa, dựng lại hoặc làm bản cho nền tảng khác của video đã giao (thêm 29/10/2026): tra `du_lieu/luu_tru_drive/MUC_LUC.md` trước. Video có trong đó thì tài nguyên dựng đang ở Drive: tải về theo bảng "Việc → Lệnh" ở mục "Lưu trữ trên Drive" cuối `nguon_goc.md` (skill `luu-tru-drive`), sửa xong lưu trữ lại.

**Bước 8.** Chuẩn bị đăng (Trung chốt 27/10/2026): chữ đăng viết bằng skill `skills/viet-chu-dang-video/` (Trung chốt 28/10/2026), mỗi nền tảng một file `tai_nguyen/dang_bai/<nền tảng>.md`: tiêu đề (Claude đưa 3 phương án, Trung chọn), mô tả có mốc chương, thẻ, hashtag không dấu, chú thích TikTok và Facebook, lời nhắc nhãn AI; script kiểm phải ra 0 lỗi trước khi trình; `youtube.md` chuyển sang file kê khai của skill `dang-youtube` bằng `xuat_ke_khai.py`, không chép dán; hình thu nhỏ theo `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md` mục 0 (5 bố cục L1–L5, Trung chốt 27/10/2026): viết kê khai `tai_nguyen/dang_bai/hinh_thu_nho.json`, dựng thử cả 5 bố cục bằng khuôn `xuong_html/hinh_thu_nho/` (`node xuat.mjs <kê khai> --thu`), Trung chọn một, rồi xuất thật (bản tải lên đặt ngoài cùng thư mục video, bản gốc vào `tai_nguyen/hinh_thu_nho_goc/`). Tải lên YouTube theo skill `dang-youtube`; TikTok và Facebook Trung tự chép từng ô và tự đăng.

**Bước 9.** Ghi lại, theo thứ tự:
1. Mục **"Kết quả dùng thử"** ở cuối file kịch bản, ngay dưới dòng Biến tấu (Trung chốt 27/10/2026): tổ hợp trục, cách làm, điều đạt, điều chưa đạt, nhận xét của Trung, số vòng sửa, thời gian máy. Script gợi ý tổ hợp đọc kịch bản gần nhất nên đây là chỗ duy nhất phải ghi. Lối viết KB vẫn điền thêm ô "Ghi chú khi dùng thử" của thẻ KB.
2. Video ngang: một mục trong `tai_san/nhat_ky_video_ngang.md` khi video có điều mới đáng giữ (cách tổ chức mã, lỗi lạ).
3. Việc để sau → `so_no_cong_viec.md`. Lỗi kỹ thuật và cách gỡ → `90_bai_hoc.md`. Đổi quy tắc → đúng module, tăng phiên bản, ghi `99_nhat_ky.md`.

**File tóm tắt nội dung (Trung chốt 28/10/2026).** Viết cùng lúc với kịch bản, sửa lại khi kịch bản đổi ý chính: `tai_nguyen/kich_ban/<thư mục video>.tom_tat.md`, dòng đầu `# Tóm tắt: <tên video>`, rồi một đoạn 4–5 câu, khoảng 100 từ: video trả lời câu hỏi gì, đi qua những ý chính nào, kết luận gì. Không ví von, không markdown trong đoạn; số liệu chỉ lấy từ kịch bản. Bảng video hiện đoạn này ở ô "Tóm tắt nội dung" của thẻ video; đoạn này cũng dùng làm gốc cho mô tả YouTube.

## 3. Bảng bước → file hướng dẫn → đầu ra

| Bước | Đọc | Script, skill | Đầu ra |
|---|---|---|---|
| 0 | `02_lam_ro_yeu_cau.md` | — | câu trả lời, thẻ gu trong `tai_san/so_tay_gu/` |
| 1 | `03_kich_ban_va_loi_viet.md` | skill `giao-antigravity-tra-cuu` (META) khi cần | `<tên>.nguon_kiem_chung.md` |
| 2–3 | `03_kich_ban_va_loi_viet.md`, `04_he_truc_dung.md` | — | kịch bản trong `tai_nguyen/kich_ban/` |
| 4 | `04_he_truc_dung.md`, `05_cach_lam.md` | `scripts/goi_y_to_hop_dung.py` | tổ hợp đã chốt, ghi vào đầu kịch bản |
| 5 | `05_cach_lam.md`, `06_thu_phap_va_hieu_ung.md`, `07_khuon_prompt_va_kiem_chat_luong.md`, `08_giong_am_thanh_phu_de.md`, module hoặc skill của nhánh (mục 5) | `scripts/sinh_giong_vieneu.py`, `scripts/moc_tung_tu.py`, mã dựng của nhánh | mã dựng trong `xuong/`, `xuong_dai/<tên>/`, `xuong_html/<tên>/` |
| 6 | `15_bang_kiem_truoc_khi_giao.md`, `07_khuon_prompt_va_kiem_chat_luong.md`, `scripts/pha_may/HUONG_DAN.md` | `scripts/pha_may/pha_may.mjs` (LM-02), `scripts/soat_khung_mp4.py`, `scripts/do_tuong_phan_khung.py`, `scripts/quet_khung_hong.py`, `xuong_html/cong_cu/cat_khung_xem.sh` | `<tên>_v<n>_nhap.mp4` |
| 7 | `san_pham/README.md` | `xuong_html/cong_cu/xuat_nhoe.sh` (chỉ LM-03) | `<tên>_v<n>_cuoi.mp4`, `nguon_goc.md`, `tai_nguyen/am_thanh/` |
| 8 | `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md` mục 0 | khuôn `xuong_html/hinh_thu_nho/`; skill `viet-chu-dang-video`; skill `dang-youtube` | `tai_nguyen/dang_bai/`, hình thu nhỏ |
| 9 | `04_he_truc_dung.md` | — | "Kết quả dùng thử" cuối kịch bản, nhật ký, sổ nợ |

## 4. Hai cửa chọn, hai cửa duyệt và hai ngoại lệ

Mặc định bốn chốt đều bắt buộc. **Cửa chọn quyết hướng đi, cửa duyệt nghiệm thu kết quả**; không thay thế được cho nhau. Cửa chọn 1 đặt trước khi viết vì các lối viết vào cùng một chủ đề ở những chỗ khác hẳn nhau (con số, câu hỏi, mâu thuẫn); chọn sau khi viết xong thì không còn là chọn mà là viết lại. Cửa chọn 2 đặt sau cửa duyệt 1 vì phải biết chữ đã chốt mới biết tổ hợp nào hợp. Bỏ cửa duyệt 1 mà dựng luôn thì sửa chữ về sau phải dựng lại toàn bộ.

**Hai ngoại lệ (Trung chốt 27/10/2026), chỉ áp khi Trung nói rõ:**
1. Trung nói **"làm một mạch"** cho một video: Claude tự chọn lối viết và tổ hợp, bỏ cửa duyệt 1, làm tới bản nháp. Trường hợp mẫu: video máy biến áp (`tai_san/nhat_ky_video_ngang.md`).
2. Trung **giao một chuỗi nhiều video**: Claude tự chọn lối viết và tổ hợp cho từng video. Trường hợp mẫu: chuỗi 15 video điện (`san_pham/2026.10.26.chuoi_15_video_dien/`).

Trong cả hai trường hợp: ghi mã KB, năm mã trục, cách làm và lý do chọn vào đầu kịch bản; vẫn áp quy tắc chống nhàm chán (`04_he_truc_dung.md`); cửa duyệt 2 (bản nháp) vẫn bắt buộc. Chuỗi nhiều video ngang chạy ba pha (Trung chốt 28/10/2026, `07_khuon_prompt_va_kiem_chat_luong.md` mục 14). Pha 1 là AI làm tới ảnh tĩnh và phiếu việc máy cho cả chuỗi, Trung duyệt ảnh tĩnh một lần. Pha 2 là máy chạy khi Trung ra lệnh "chạy pha máy". Pha 3 là AI đọc báo cáo, sửa chương lỗi rồi giao bản nháp. Ngoài hai trường hợp này, Claude tự chọn lối viết rồi đưa bản đã xong cho Trung duyệt là làm sai quy trình.

## 5. Nhánh dựng theo cách làm

Chi tiết từng cách làm, chi phí đo thật và giới hạn: `05_cach_lam.md`.

| Mã | Cách làm | Hướng dẫn dựng | Dùng chủ yếu cho |
|---|---|---|---|
| LM-01 | Remotion khối cảnh dọc, `xuong/` | `09_video_doc_ngan.md` | video dọc, chất liệu CL-01 |
| LM-02 | Remotion dự án ngang, `xuong_dai/<tên>/` | `10_video_ngang_thuyet_minh.md` | video ngang có thuyết minh, đồ thị SVG, 3D Three.js |
| LM-03 | HTML một trang, chụp khung theo đồng hồ ảo, `xuong_html/<tên>/` | skill `dung-video-html` | chất liệu mới CL-09 đến CL-16, dựng thử một phong cách, dựng một cảnh để ghép |
| LM-04 | HyperFrames, `xuong_thu_hyperframes/` | `12_cong_cu_media_ai.md` mục HyperFrames | video chữ và hình phẳng cần máy kiểm chữ đè |
| LM-05 | Blender Cycles ghép Remotion | skill `dung-hoat-canh-3d-blender` | 3D tả thực từ mô hình tải về (CL-08) |
| LM-06 | Clip AI ghép Remotion | skill `giao-muse-video`; Flow làm tay | cảnh nền, cảnh quay tả thực |
| LM-07 | Manim | chưa cài | ghi để biết |

Một video được ghép nhiều cách làm: dựng một cảnh bằng LM-03 hoặc LM-05, xuất MP4, rồi đặt vào video Remotion như một đoạn phim. Cách ghép: `05_cach_lam.md`.

## 6. Luồng hiện chạy được tới đâu

Nói trước với Trung để không hứa quá khả năng.

| Phần | Trạng thái 27/10/2026 | Ghi chú |
|---|---|---|
| Bước 0–4 | Chạy được | Kịch bản và cửa chọn dùng chung cho mọi cách làm |
| Video ngang, LM-02 | Chạy được | Khoảng 30 video đã giao hoặc chờ duyệt (`san_pham/README.md`) |
| Trình chạy pha máy, bộ đệm chương | Mới 28/10/2026, đã chạy thử trên một dự án có sẵn; chưa chạy lô thật | Chỉ dự án LM-02 có `src/thoi_gian.json`; chưa có nút trên bảng video (sổ nợ N58 đợt 2) |
| Video dọc, LM-01 | Chạy được, có giới hạn | Khối cảnh và phụ đề chạy chữ có sẵn; mã dựng mới có bộ màu MAU-01 (tông khác phải dựng thêm bộ màu); chưa có video dọc thành phẩm; mã chưa có chỗ chèn nhạc nền. Phụ đề chạy theo từng chữ lấy mốc từng từ bằng Whisper (`scripts/moc_tung_tu.py`) |
| LM-03 | Công cụ chạy được, chưa có video giao | Hai bản chạy thử 30 giây và một bản so sánh 60 giây (`san_pham/2026.10.27.duyet_phong_cach_opus55/`); lượt thử kỹ thuật có giọng và nhạc ngày 27/10/2026 |
| LM-04 | Đã thử một video | Giữ làm chỗ thử (`12_cong_cu_media_ai.md`) |
| LM-05 | Đã có cảnh thử | Cả ngày máy cho một phút ở 1920×1080 (ước); chỉ dùng khi Trung chấp nhận thời gian máy |
| LM-06 | Dùng làm cảnh nền | Muse qua web, Flow làm tay |
| Chất liệu mới CL-09 đến CL-16 | Chưa dựng thật | Mỗi chất liệu cần một video mẫu đầu tiên; hướng dựng viết sẵn ở `tai_san/khuon_prompt/huong_theo_chat_lieu.md` |

## 7. Nhiều phiên cùng làm trong Media

Trung chốt 27/10/2026, sau khi hai phiên cùng sửa kho phong cách trong một buổi:
- Nhiều phiên được làm video song song nếu mỗi phiên chỉ sửa thư mục video của mình (`san_pham/<thư mục video>/`, `xuong_dai/<tên>/`, `xuong_html/<tên>/`).
- Việc sửa file dùng chung (module, `AGENTS.md`, `tai_san/so_tay_gu/`, `he_truc_dung.json`, `tai_san/thu_phap/`, script trong `scripts/`, khối cảnh trong `xuong/`) thì một phiên một lúc, hoặc làm trên nhánh git riêng rồi gộp (như đợt dựng lại luồng ngày 27/10/2026).
- Trước khi commit chạy `git status` và chỉ `git add` đúng file của mình; thay đổi treo không phải của mình thì không gộp. Hook tự lưu cuối lượt có thể gộp thay đổi của phiên khác: khi đang chạy chuỗi video ở một phiên thì không mở phiên khác sửa file dùng chung.
- Một mã video chỉ giao cho một phiên (lô 18 video, N54, N33). Khi cuộc trò chuyện bị tách (fork) hoặc ngắt giữa chừng lúc lô đang chạy, nói rõ ngay phiên nào giữ lô; phiên còn lại chỉ làm việc ngoài lô. Trước khi bảo tác tử con "làm tiếp" thì kiểm ba dấu hiệu việc đó đang được làm ở nơi khác: `90_bai_hoc.md` mục "2026-10-27 — Hai bản tách của cùng một cuộc trò chuyện…".
- Kiểm trước khi giao bản cuối (Trung chốt 28/10/2026, sau khi N35 được duyệt cùng lúc trên bảng video và trong phiên giữ lô). Trung duyệt ở bảng video (nút "Duyệt bản này") hay trong phiên đều được. Phiên nào làm bước giao bản cuối (đổi `_nhap` thành `_cuoi`, chép âm thanh, sửa `nguon_goc.md`, sổ nợ, sổ lô) thì trước khi đổi file phải kiểm hai điều trong thư mục video `san_pham/<thư mục video>/`: đã có file `_cuoi` của đúng phiên bản đó chưa (`ls | grep _cuoi`), và có file nào bị sửa trong 10 phút gần đây không (`find . -mmin -10 -type f`). Có một trong hai thì dừng, không sửa gì, báo Trung là video đang được giao ở nơi khác.
