# 04 — Hệ trục dựng (cửa chọn 2) và chống nhàm chán

> Đọc trước khi chọn cách dựng một video (cửa chọn 2) và trước khi chọn biến tấu. Đây là file quy trình; dữ liệu năm trục nằm ở `tai_san/so_tay_gu/he_truc_dung.json` (bản đọc `he_truc_dung.md`), script gợi ý `scripts/goi_y_to_hop_dung.py`. Cửa chọn 1 (lối viết) ở `03_kich_ban_va_loi_viet.md`; luồng các bước ở `01_quy_trinh_chung.md`.
> **Phiên bản:** 1.3 · **Cập nhật:** 2026-10-29 (chiều) · Bảng mẫu kịch bản lên 1.1: thêm sáu mẫu MK-11…MK-16 (dòng thời gian, câu đố, nếu không có X, mổ xẻ tờ giấy, hai phía bàn đối đáp, lần ngược từ kết cục) theo lệnh Trung; 13 video chuyển sang mẫu mới, giữ tổ hợp năm trục.
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-10-29 · Thêm mục 8 trỏ tới bảng mẫu kịch bản loạt ngân hàng (`tai_san/so_tay_gu/mau_kich_ban.json`, 10 mẫu, quy tắc ít chữ C1–C8, tổ hợp đề xuất cho 45 video còn lại) theo lệnh Trung qua phiên điều phối.
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-27 · Áp quyết định Trung 27/10/2026: mục 6.3 thêm chỗ ghi kết quả dùng thử (mục "Kết quả dùng thử" ở cuối file kịch bản, không ghi vào thẻ D).
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · tách từ `12_kho_phong_cach.md` (bản 2.1) khi dựng lại luồng Media: mục 3b (cửa chọn 2 theo hệ trục), cách chạy lệnh ở bước chọn dựng, mục 5 (bản Excel), mục 7 (chống nhàm chán); thêm mục 7 "Cách làm và thủ pháp". Lịch sử phiên bản của 12 ở `99_nhat_ky.md`, mục "2026-10-27 — Lịch sử phiên bản chuyển từ đầu module khi đánh số lại".

## Mục lục

| Mục | Nội dung | Nguồn cũ |
|---|---|---|
| 1 | Vì sao cửa chọn 2 theo hệ trục, và vì sao đứng sau cửa duyệt 1 | `12_kho_phong_cach.md` mục 3b và mục 2 |
| 2 | Năm trục và ai chọn | `12_kho_phong_cach.md` mục 3b |
| 3 | Cách làm ở cửa chọn 2 (lệnh, đề xuất tổ hợp) | `12_kho_phong_cach.md` "LỐI VÀO NHANH" bước 4, mục 3b, mục 3 |
| 4 | Sửa hoặc thêm lựa chọn trục; video cũ | `12_kho_phong_cach.md` mục 3b |
| 5 | Bản Excel cho Trung | `12_kho_phong_cach.md` mục 5 |
| 6 | Chống nhàm chán khi làm nhiều video (6.1 nhắc ở hai cửa chọn, 6.2 biến tấu, 6.3 báo và ghi lại) | `12_kho_phong_cach.md` mục 7 |
| 7 | Cách làm và thủ pháp | mới |
| 8 | Mẫu kịch bản và tổ hợp cho loạt video ngân hàng; quy tắc ít chữ | mới (29/10/2026) |

Tra mục trong file: `grep -n "^### 6\.2" 04_he_truc_dung.md`.

## 1. Vì sao cửa chọn 2 theo hệ trục, và vì sao đứng sau cửa duyệt 1

**Vì sao đổi sang hệ trục.** Một mã D gói chung màu, bố cục, chất liệu hình, mức chi tiết, nhịp và nhạc, nên D-09 và D-09b phải là hai thẻ dù chỉ khác mức chi tiết, và không ghép được màu của thẻ này với chất liệu của thẻ khác. Trung chốt tách mỗi trục thành một lựa chọn độc lập; Claude sinh mọi tổ hợp, loại tổ hợp không hợp, rồi gợi ý.

**Vì sao cửa chọn 2 đặt sau cửa duyệt 1:** phải biết chữ chốt rồi mới biết tông nào hợp. Chọn tông trước rồi mới viết thì chữ phải chạy theo màu — ngược quy trình.

## 2. Năm trục và ai chọn

| Trục | Mã | Ai chọn | Ghi chú |
|---|---|---|---|
| Chất liệu hình | CL-01…CL-08 | Trung (trong tổ hợp) | Kéo theo nhịp hình và kiểu phụ đề, mã dựng, thời gian máy chạy |
| Mức chi tiết | CT1 sơ đồ, CT2 mô hình rút gọn, CT3 chi tiết kỹ thuật | Trung (trong tổ hợp) | Chất liệu 2D và đồ thị luôn là CT1 |
| Bố cục khung hình | BC-01…BC-07 | Trung (trong tổ hợp) | Khổ dọc hay ngang không phải lựa chọn: giai đoạn 1 là dọc, giai đoạn 3 là ngang |
| Tông màu | MAU-01…MAU-19 | Trung (trong tổ hợp) | Gộp tông của thẻ D cũ với bảng M0–M8 của D-09b (MAU-09 là M0, MAU-10…17 là M1…M8) |
| Nhạc nền | NH00…NH77 | Claude tự chọn, báo một dòng | Script đọc thẳng sổ nhạc `tai_san/nhac_nen/so_nhac.json`. Loại bài rè nặng (trên 10 kHz từ 7 dB hoặc trên 16 kHz từ 12 dB, luôn loại NH02) và bài máy đoán có giọng hát; còn 39 trên 78 bài (ngưỡng và cách đếm: `08_giong_am_thanh_phu_de.md` mục 7). Chọn theo nhóm nhạc hợp, tránh của tông màu, nhóm hợp lối viết, tiết tấu hợp chất liệu, độ dài video; mỗi tổ hợp một bài khác. Bài có cờ nghi rè dưới ngưỡng thì nghe lại trước khi dùng. NH01…NH15 là N01…N15 cũ |

## 3. Cách làm ở cửa chọn 2

Chạy `python3 scripts/goi_y_to_hop_dung.py --kho <doc|ngang> --kb <KB đã chốt> --chu-de <loại> --linh-vuc <lĩnh vực> --do-dai <giây>` và đưa Trung 2–3 tổ hợp script in ra theo cách dưới đây. Dữ liệu năm trục: `tai_san/so_tay_gu/he_truc_dung.json` (bản đọc `he_truc_dung.md`). Bảng tông dựng D (Bảng 2 ở `tai_san/so_tay_gu/00_muc_luc.md`) giữ để tra video cũ và vì script tra Bảng 3 (KB × D) qua thẻ D gốc của từng lựa chọn.

**Cách đề xuất.** Chạy script (lệnh ở đoạn trên; `--gap` khi cần video trong vài giờ; loại chủ đề và lĩnh vực xem trong file dữ liệu). Script đọc dòng "Biến tấu" của 3 kịch bản gần nhất cùng khổ để trừ điểm trục đã dùng, nên không cần chạy lệnh tra ở mục 6.1 riêng. Đưa Trung 2–3 tổ hợp, mỗi tổ hợp một khối ngắn: năm mã kèm tên, thời gian máy, mã dựng đã có hay phải làm thêm, video gần giống, một vế không hợp (công thức ba vế ở `03_kich_ban_va_loi_viet.md` mục 3 vẫn áp), "ghép mới, chưa dựng thật" nếu script ghi vậy. Kèm câu Claude nghiêng về tổ hợp nào. Trung chọn một tổ hợp, hoặc lấy một tổ hợp và đổi riêng một trục (ví dụ "tổ hợp 1 nhưng màu MAU-15").

**Khi ngăn nào chỉ còn một lựa chọn thì nói thẳng, đừng diễn.** Sau khi lọc theo khổ video và Bảng 3, có lúc chỉ còn một tông hợp (ví dụ video dọc: D-01 là tông dọc duy nhất đã duyệt). Câu đúng ở cửa chọn 2 lúc đó là: *"Kho chỉ có [mã, tên] hợp với kịch bản này ở mức [tra Bảng 3]. Dùng luôn, hay anh muốn em dựng thêm một phong cách mới trước đã?"* — dựng một cửa chọn giả với duy nhất một phương án là làm phiền Trung mà không cho anh thêm quyền gì.

(Từ 27/10/2026 "tông" nghĩa là tổ hợp năm trục; mã dựng của video dọc hiện chỉ có chất liệu CL-01 với tông màu MAU-01, `09_video_doc_ngan.md` mục 1.)

## 4. Sửa hoặc thêm lựa chọn trục; video cũ

**Sửa hoặc thêm lựa chọn.** Sửa `tai_san/so_tay_gu/he_truc_dung.json` rồi chạy `python3 scripts/goi_y_to_hop_dung.py --xuat-md` để sinh lại bản đọc. Mỗi lựa chọn ghi `d_nguon` (thẻ D gốc) để script tra Bảng 3; lựa chọn mới không có thẻ D gốc thì ghi thẻ gần nhất. Luật loại trừ và luật cộng điểm cũng nằm trong file đó.

**Video cũ** (mở việc trước 27/10/2026) giữ mã D, M, N trong kịch bản của nó; không làm bảng chuyển mã (Trung chốt).

Thêm thẻ D (tông dựng cũ) từ mẫu Trung gửi: `03_kich_ban_va_loi_viet.md` mục 6 và `11_hoc_phong_cach_tu_mau.md`.

## 5. Bản Excel cho Trung

`tai_san/kho_phong_cach.xlsx` — bốn trang: ba bảng của kho cộng một trang hướng dẫn đọc. Sinh tự động từ `00_muc_luc.md`, đi theo đúng mô hình đã dùng cho sổ đăng ký ở `18_so_dang_ky_prompt_skill.md`.

**Nguồn sự thật là file markdown, không phải Excel.** Sửa trên Excel thì lần chạy script kế tiếp sẽ ghi đè mất. File Excel để Trung đọc và đối chiếu khi chọn, không phải để sửa.

## 6. Chống nhàm chán khi làm nhiều video (Trung chốt 26/10/2026)

**Vì sao có mục này.** Tám video ngang làm ngày 25–26/10/2026 đều viết theo KB-05, sáu video dựng theo D-09b bảng màu M0, gần như video nào cũng 7 cảnh, dài khoảng 120 giây. Hai cửa chọn không ngăn được việc này vì mỗi lần Claude đề xuất lại đúng phương án vừa dùng và Trung gật. Video xem liền nhau vì vậy giống nhau.

Trung chốt bốn điểm: (1) không đặt luật bắt buộc đổi, chỉ nhắc ở hai cửa chọn; (2) biến tấu nhỏ bên trong một phong cách do Claude tự chọn và báo một dòng; (3) được biến tấu ở mức nhỏ và mức vừa (bảng dưới); (4) video trong cùng chuỗi đề tài giữ nhận diện chung, chỉ đổi chi tiết.

### 6.1. Nhắc ở hai cửa chọn

Trước khi đề xuất ở cửa chọn 1 (lối viết KB) và cửa chọn 2 (cách dựng), xem dòng "Biến tấu" và dòng mã phong cách ở đầu 3 kịch bản gần nhất cùng khổ trong `kich_ban/`:

```bash
ls -t san_pham/*/tai_nguyen/kich_ban/*_v[0-9].md | head -3 | xargs grep -H -m3 -E "Biến tấu|KB-[0-9]+|D-[0-9]+|CL-[0-9]+"
```

Mỗi phương án đề xuất ghi thêm một vế "đã dùng ở X/3 video gần nhất". Nếu Claude nghiêng về phương án đã dùng ở cả 3 video gần nhất thì câu "em nghiêng về…" phải nói rõ điều đó và nêu một phương án khác hợp với chủ đề. Không bắt buộc đổi: Trung quyết.

### 6.2. Biến tấu bên trong phong cách đã chốt (Claude tự chọn)

Sau khi Trung chốt KB và tổ hợp dựng, Claude tự chọn biến tấu trên các trục dưới đây, nhắm khác 3 video gần nhất ở ít nhất hai trục. Đây là mục tiêu, không phải luật.

| Mức | Trục | Các lựa chọn |
|---|---|---|
| Nhỏ | Nhạc nền | Mã NH do script chọn từ sổ nhạc theo màu, lối viết, chất liệu, độ dài video và 3 video gần nhất (mục 2 và 3 ở trên). Bảng màu từ 27/10/2026 nằm trong tổ hợp Trung chọn ở bước 4, không còn là biến tấu Claude tự chọn |
| Nhỏ | Nhịp máy quay | Xoay quanh vật thể; đẩy thẳng vào; trượt ngang dọc vật thể; cắt cận chi tiết rồi lùi ra toàn cảnh |
| Nhỏ | Chuyển cảnh | Cắt thẳng; mờ dần; máy quay đi xuyên qua vỏ vào bên trong; tách lớp bộ phận rồi ghép lại |
| Vừa | Cách vào chặng mở đầu | Tình huống đời thường; câu hỏi; một con số bất ngờ; so sánh với vật quen thuộc; cho xem kết quả trước rồi quay lại giải thích. Giữ vai trò chặng mở đầu của thẻ KB, chỉ đổi cách vào |
| Vừa | Số cảnh và độ dài | 5–9 cảnh, 60–150 giây, theo lượng nội dung. Không kéo nội dung cho đủ 120 giây. Thứ tự chặng của thẻ KB giữ nguyên; một chặng được tách thành nhiều cảnh hoặc gộp với chặng liền kề |
| Vừa | Cảnh mượn tông khác | Tối đa một cảnh mượn cách dựng của tổ hợp khác cùng khổ, ví dụ một cảnh đồ thị bảng đen (CL-05, trước gọi D-10) trong video CL-07 (trước gọi D-09b) để giải thích một con số |

**Không biến tấu:** những gì Trung đã chốt cho riêng video đó (độ dài, tổ hợp dựng, nhạc nói rõ mã); giọng đọc (Trung đã chốt giọng chuẩn và tốc độ); thứ tự chặng của thẻ KB.

**Chuỗi video cùng đề tài** (ví dụ tua-bin gió → buồng máy → hộp số): giữ chất liệu, bố cục và tông màu của video đầu chuỗi để người xem nhận ra là một bộ. Vẫn đổi cách vào chặng mở đầu, số cảnh, nhạc, nhịp máy quay so với video trước trong chuỗi.

### 6.3. Báo và ghi lại

Chọn xong thì báo Trung một dòng trước khi dựng, rồi ghi đúng dòng đó vào đầu file kịch bản (`san_pham/<thư mục video>/tai_nguyen/kich_ban/<ten>_v<n>.md`), ngay dưới dòng ghi lối viết và tông dựng. Mẫu:

> **Biến tấu:** Khổ ngang · KB-05 · CL-07 · CT3 · BC-05 · MAU-12 · NH07 · mở bằng con số · 6 cảnh, khoảng 95 giây · máy quay trượt ngang · chuyển cảnh xuyên vỏ · một cảnh đồ thị kiểu CL-05. Khác 3 video gần nhất ở: màu, nhạc, cách mở đầu, số cảnh.

Năm mã trục và chữ "Khổ dọc/ngang" đặt trước chữ "Khác": script tính độ đa dạng chỉ đọc phần trước chữ đó.

Dòng này là nguồn để lần đề xuất sau tra lại (lệnh ở mục 6.1); không lập sổ riêng.

**Kết quả dùng thử (Trung chốt 27/10/2026).** Video mới chọn tổ hợp năm trục, không chọn thẻ D, nên kết quả dùng thử của tổ hợp không ghi vào thẻ D. Ghi ở mục "Kết quả dùng thử" ở cuối file kịch bản, cho tổ hợp đã khai ở dòng Biến tấu: tổ hợp trục, cách làm, điều đạt, điều chưa đạt, nhận xét của Trung, số vòng sửa, thời gian máy. Script gợi ý tổ hợp đọc kịch bản gần nhất nên đây là chỗ duy nhất phải ghi cho tổ hợp trục. Lối viết (thẻ KB) vẫn điền thêm ô "Ghi chú khi dùng thử" của thẻ KB. Thẻ D cũ giữ nguyên để tra video mở trước 27/10/2026. Kịch bản làm trước 26/10/2026 chưa có dòng này: tra mã KB, D, M, N trong phần đầu file. Kịch bản từ 26/10 tới trước 27/10/2026 ghi dạng cũ `KB · D · M · N`; script tự suy ra trục qua trường `d_nguon`, `m_nguon`, `n_nguon` của file dữ liệu.

## 7. Cách làm và thủ pháp

Năm trục ở mục 2 chọn *tổ hợp* hình, bố cục, màu, nhạc của video. Hai thư viện nằm ngoài năm trục và không đổi cách chọn tổ hợp (không tạo thẻ D mới):
- **Cách làm** (mã LM-01 đến LM-07): dựng video bằng công cụ nào, khi nào dùng, các bước, chi phí đo thật, giới hạn: `05_cach_lam.md`.
- **Thủ pháp và hiệu ứng** (mã TP): chuyển động, chuyển cảnh, chữ, số liệu, hình 3D, hậu kỳ, âm thanh đồng bộ; lớp hoàn thiện bắt buộc; dữ liệu ở `tai_san/thu_phap/`: `06_thu_phap_va_hieu_ung.md`.

## 8. Mẫu kịch bản và tổ hợp cho loạt video ngân hàng (29/10/2026)

Phiên dựng một video của loạt thuật ngữ ngân hàng đọc `tai_san/so_tay_gu/mau_kich_ban.json` trước khi chạy cửa chọn 2: mục `xep_video` cho sẵn mẫu kịch bản (MK-01…MK-16), lối viết và tổ hợp năm trục của từng mã N, đã kiểm hai video liền nhau khác chất liệu, khác 3 video trước ở ít nhất hai trục, nhạc rè thấp. Mục `mau_kich_ban` cho dàn chương, thủ pháp, hình kho chung theo dạng nội dung; mục `it_chu` là quy tắc ít chữ Trung chốt 29/10/2026 (giữ phụ đề cứng, tối đa 12 tiếng mỗi khung ngoài phụ đề). Bản đọc `tai_san/so_tay_gu/mau_kich_ban.md`; trang có hình cho Trung `san_pham/2026.10.29.bang_phan_loai_mau_kich_ban/2026.10.29.bang_phan_loai_mau_kich_ban_v1.html`.

- Sửa JSON rồi chạy `python3 scripts/sinh_mau_kich_ban.py` (kiểm mã với hệ trục, sổ nhạc, thủ pháp, kho hình; sinh lại bản đọc và trang).
- Kiểm chữ trên bản nháp: `python3 scripts/dem_chu_trong_hinh.py <video.mp4> --loi <kịch bản>` (đọc chữ bằng Vision của macOS, bỏ dải phụ đề y 900–1080).
- Đổi tổ hợp của một video thì chạy lại lệnh ở mục 3 và ghi lý do ở dòng Biến tấu.
