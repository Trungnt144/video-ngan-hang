# 03 — Kịch bản và lối viết (cửa chọn 1, khuôn chặng, quy tắc lời đọc)

> Đọc trước khi viết kịch bản cho bất kỳ video nào (dọc hay ngang) và trước khi đề xuất lối viết cho Trung. Đây là file quy trình của ngăn kịch bản; dữ liệu thật của kho nằm ở `tai_san/so_tay_gu/00_muc_luc.md`. Cửa chọn 2 (dựng) ở `04_he_truc_dung.md`; luồng các bước ở `01_quy_trinh_chung.md`.
> **Phiên bản:** 1.5 · **Cập nhật:** 2026-10-29 · Mục 5.3 thêm cách đọc Trung chốt cho loạt ngân hàng: CIC "xi ai xi", OTP "ô tê pê" (không đọc "ô ti pê"), CVV "xê vê vê".
> **Phiên bản:** 1.4 · **Cập nhật:** 2026-10-28 · Gom bài học lô 18 video điện chung và điện mặt trời (Trung duyệt gom 28/10/2026): mục 5.2 thêm ba lỗi kiểm chứng (làm tròn số hiển thị, tóm tắt không khớp bảng trong bản đủ, sổ nợ ghi sai bản chất) và tiểu mục "Nguồn ban hành đã dùng, dùng lại được"; mục 5.3 thêm bảng cách đọc GHI, DNI, DHI, POA, Voc, Isc, Vmp, Imp, Pmax, kg, kWp, ki-ốt.
> **Phiên bản:** 1.3 · **Cập nhật:** 2026-10-28 · Mục 5.3 thêm bảng cách đọc tác tử tự đặt trong lô 16 video điện gió (LiDAR, Doppler, Weibull, SCADA, ADB, NREL, IEC…), chờ Trung nghe chốt.
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-10-27 · Bảng thuật ngữ điện thêm EVN đọc "i-vi-en"; thêm lỗi VieNeu nuốt chữ "pê" trước "hay" và cách sửa (Trung nghe ra khi duyệt video MWp/MWac).
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-27 · Mục 5.3: bỏ chỗ nhắc giọng ElevenLabs (Trung bỏ ElevenLabs ngày 27/10/2026, `08_giong_am_thanh_phu_de.md` mục 1).
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · tách từ `12_kho_phong_cach.md` (bản 2.1) khi dựng lại luồng Media: phần kịch bản của 12 (hai ngăn kho, cửa chọn 1, cách đề xuất phương án, quy tắc lời đọc, làm giàu kho), khuôn chặng nội dung của `01_khuon_video_ngan.md` mục 2, kiểm chứng và cách đọc thuật ngữ của `14_khuon_video_dai_thuyet_minh.md`. Lịch sử phiên bản của 12 ở `99_nhat_ky.md`, mục "2026-10-27 — Lịch sử phiên bản chuyển từ đầu module khi đánh số lại".
> Lập theo yêu cầu Trung nêu ngày 28/07/2026: *"Bước viết kịch bản thì Claude cần cho tôi các phong cách viết kịch bản khác nhau để chọn; bước dựng cũng vậy. Hiện chưa làm giàu các phong cách — cần một kho có bản Excel thống kê để tôi đọc và hiểu."*

## Mục lục

| Mục | Nội dung | Nguồn cũ |
|---|---|---|
| 1 | Vì sao có hai cửa chọn và hai ngăn kho | `12_kho_phong_cach.md` mục 1 |
| 2 | Cửa chọn 1: chọn lối viết (KB) | `12_kho_phong_cach.md` "LỐI VÀO NHANH" bước 1 và 2, mục 2 |
| 3 | Cách đề xuất phương án cho Trung (công thức ba vế) | `12_kho_phong_cach.md` mục 3 |
| 4 | Khuôn sáu chặng nội dung | `01_khuon_video_ngan.md` mục 2 |
| 5 | Viết kịch bản và quy tắc lời đọc: 5.1 viết theo thẻ, không nhắc video khác; 5.2 kiểm chứng kiến thức; 5.3 cách đọc thuật ngữ cho giọng máy | `12_kho_phong_cach.md` "LỐI VÀO NHANH" bước 3; `14_khuon_video_dai_thuyet_minh.md` mục 2 bước 2 và mục 3 |
| 6 | Cách làm giàu kho (ngăn kịch bản và thẻ dựng cũ) | `12_kho_phong_cach.md` mục 4 |
| 7 | Quan hệ với các module khác | `12_kho_phong_cach.md` mục 6 |

Tra mục trong file: `grep -n "^## 5\." 03_kich_ban_va_loi_viet.md`.

## 1. Vì sao có hai cửa chọn và hai ngăn kho (vấn đề file này giải quyết)

Quy trình trước 28/07/2026 (khi đó ghi ở `09_video_doc_ngan.md`, nay là luồng chung ở `01_quy_trinh_chung.md`) nhảy thẳng từ *"Trung đưa ý tưởng"* sang *"Claude viết kịch bản 7 cảnh"*. Không có chỗ nào Trung được chọn **viết theo lối nào**. Hệ quả: Claude tự chọn lối viết theo cảm tính của phiên đó, Trung chỉ được duyệt kết quả — mà duyệt một bản kịch bản đã viết xong thì chỉ còn hai lựa chọn "được" hoặc "viết lại", chứ không phải chọn hướng. Bước dựng cũng đúng lỗi đó.

Cách sửa: chèn **hai cửa chọn** vào trước hai cửa duyệt đã có, và dựng một **kho phong cách** để hai cửa đó có cái mà chọn.

Kho chia hai ngăn vì **một kịch bản dựng được theo nhiều tông, và một tông dùng được cho nhiều kịch bản** — gộp chung thì mỗi lần đổi màu lại phải chép lại toàn bộ phần chữ. Chi tiết hai ngăn và ba bảng dữ liệu: `tai_san/so_tay_gu/00_muc_luc.md`.

Kho phong cách chia hai ngăn ở `tai_san/so_tay_gu/`: ngăn `kich_ban/` (nói gì, theo đường nào) và ngăn `dung/` (nhìn và nghe ra sao). Tách vì một kịch bản dựng được theo nhiều tông. Bảng kết hợp cho biết cặp nào ghép được. Cách đề xuất phương án và cách làm giàu kho: các mục dưới đây của file này và `04_he_truc_dung.md`; khi Trung nói "làm video về…" thì đọc `01_quy_trinh_chung.md`, rồi mục 2 và mục 5 của file này.

## 2. Cửa chọn 1: chọn lối viết (Trung chốt mã KB-xx)

Luồng các bước chung cho hai khổ: `01_quy_trinh_chung.md`; mục này chỉ nói việc của cửa chọn 1. Khi Trung nói *"làm video về [chủ đề]"*, Claude làm hai việc đầu theo thứ tự (việc thứ ba, viết kịch bản, ở mục 5):

1. **Hỏi cho rõ** theo `02_lam_ro_yeu_cau.md` bộ (a) — tối đa 3–4 câu, luôn kèm đề xuất để Trung chỉ cần gật.
2. **Đề xuất 2–3 lối viết**, mỗi lối một dòng theo công thức ở mục 3 bên dưới: mã + tên → tóm tắt một câu → **một vế nói rõ chỗ không hợp** → vế "đã dùng ở X/3 video gần nhất" (`04_he_truc_dung.md` mục 6.1). Chờ Trung chốt mã KB-xx.

Danh sách lối viết (KB), trạng thái duyệt và bảng ghép cặp nằm ở `tai_san/so_tay_gu/00_muc_luc.md` (Bảng 1 lối viết, Bảng 2 tông dựng, Bảng 3 ghép cặp); không chép lại trạng thái duyệt ở đây vì bản chép tay trước đây đã lệch với mục lục kho. Khi đề xuất, ưu tiên thẻ đã duyệt; thẻ nháp đề xuất được nhưng phải ghi rõ là nháp.

**Vì sao cửa chọn 1 đặt trước khi viết, không phải sau:** ba phong cách hiện có vào cùng một chủ đề ở ba chỗ hoàn toàn khác nhau — KB-01 mở bằng con số, KB-02 mở bằng câu hỏi, KB-03 mở bằng mâu thuẫn. Chọn sau khi đã viết thì không phải chọn, mà là viết lại.

## 3. Cách đề xuất phương án cho Trung

**Trung đã chốt cách trình bày ngày 28/07: nêu tên và mô tả ngắn, không viết thử.** Làm đúng vậy, kèm ba ràng buộc để mô tả ngắn không thành đoán mò:

**(a) Mỗi phương án đúng một dòng, theo công thức ba vế:** mã + tên → ô *"Nói ngắn gọn là gì"* của thẻ → **một vế nói rõ chỗ không hợp**. Vế thứ ba là bắt buộc: mô tả chỉ toàn điểm mạnh thì Trung không có cơ sở nào để loại, và chọn kiểu đó chỉ là gật bừa.

**(b) Đề xuất 2–3 phương án, không phải cả kho.** Lọc theo cột *"Hợp với nội dung nào"* của Bảng 1. Mỗi phương án thêm vế "đã dùng ở X/3 video gần nhất" theo `04_he_truc_dung.md` mục 6.1. Kèm một câu nói rõ Claude nghiêng về phương án nào và vì sao — Trung chỉ cần gật, đúng nguyên tắc ở `02_lam_ro_yeu_cau.md` mục 3.

**(c) Luôn mở sẵn đường xem thử, không tự ý dùng.** Mỗi thẻ kịch bản có sẵn ô *"Ví dụ mở đầu thật"* — 3–4 câu viết bằng câu chữ thật. Trung phân vân giữa hai phương án thì chỉ cần nói *"cho xem ví dụ"*, Claude dán ví dụ có sẵn trong thẻ, không phải viết mới, mất vài giây. Nói rõ đường này tồn tại ở lần đề xuất đầu tiên, sau đó không nhắc lại nữa.

Mẫu một lượt đề xuất đạt yêu cầu:

> Chủ đề này em thấy hợp hai lối:
> - **KB-01 Bóc số liệu** — lấy một con số làm nhân vật chính rồi bóc dần từng tầng. Không hợp nếu số liệu còn tranh cãi cách tính, vì lối này không có chỗ nào để nói "khoảng chừng".
> - **KB-03 Ngược dòng** — nêu điều ai cũng tin rồi chỉ ra chỗ nó thiếu. Sắc hơn nhưng phơi người viết ra nhiều nhất, và với chủ đề chạm quan điểm chính thức thì phải hỏi trước khi làm.
>
> Em nghiêng về KB-01 vì anh đã có số liệu nguồn sẵn. Anh chọn mã nào, hoặc muốn xem thử vài câu mở đầu của lối nào thì em dán ra.

Cửa chọn 2 (dựng) cũng theo công thức ba vế này: `04_he_truc_dung.md` mục 3.

## 4. Khuôn sáu chặng nội dung — số cảnh hình không cố định

*(sửa 28/07/2026 khuya muộn — Trung yêu cầu tăng số cảnh hình lên gấp đôi để nhịp video đỡ thưa; xem lý do và cách làm ở `99_nhat_ky.md` lần 8)*

**Hai khái niệm tách nhau, đừng lẫn:**

- **Chặng nội dung** — cấu trúc kịch bản cố định, không để nội dung trôi tự do: **Mở đầu gây chú ý → Giải thích → Điểm nhấn → Luồng ý kiến → Hệ quả → Kêu gọi hành động**. Đây vẫn LUÔN LÀ SÁU CHẶNG, không đổi — phong cách kịch bản (KB-xx) đi theo đúng sáu chặng này, xem mục 2 và mục 3 của file này.
- **Cảnh hình** — mỗi lần màn hình đổi bố cục. Trước 28/07 mỗi chặng đúng một cảnh hình (bảy cảnh, vì "Giải thích" tách đôi). Từ nay **một chặng được phép tách thành nhiều cảnh hình** khi nội dung đủ dài hoặc có chỗ hợp để vẽ sơ đồ minh họa — miễn giữ đúng thứ tự sáu chặng, không thêm bớt chặng.

Kịch bản video dọc chuẩn dài khoảng 90 giây khi đọc (khổ ngang: 5–9 cảnh, 60–150 giây, `04_he_truc_dung.md` mục 6.2). Vài giây đầu quyết định người xem có lướt qua hay không, nên chặng mở đầu phải nêu thẳng điều bất ngờ nhất, không rào đón.

**Khuôn là khung xương chung, phong cách kịch bản quyết định mỗi chặng chứa gì.** Cùng khung này, KB-01 dùng chặng "Giải thích" để bóc con số thành ba phần, KB-02 dùng chặng đó để mở rộng một phép so sánh đời thường, KB-03 dùng chặng đó để đưa dữ kiện làm lung lay niềm tin cũ. Phong cách không được đổi THỨ TỰ chặng, chỉ đổi nội dung mỗi chặng và được tự do chia chặng đó thành bao nhiêu cảnh hình cho hợp — kho phong cách và cách chọn ở mục 2 và mục 3 của file này.

Cách tách một chặng thành nhiều cảnh hình và các khối cảnh dựng sẵn của video dọc: `09_video_doc_ngan.md` mục 2.

## 5. Viết kịch bản và quy tắc lời đọc

### 5.1. Viết kịch bản theo thẻ đã chốt

**Viết kịch bản** theo đúng thứ tự chặng trong ô *"Đường đi của bảy cảnh"* của thẻ đã chốt, chọn biến tấu theo `04_he_truc_dung.md` mục 6 (số cảnh 5–9, cách vào chặng mở đầu…), ghi dòng "Biến tấu" vào đầu kịch bản, rồi trình duyệt.
   **Không nhắc tới video khác** (quy tắc cứng, Trung chốt 27/10/2026, áp cho mọi video dọc và ngang): lời đọc, phụ đề và chữ trên hình không có câu kiểu "như video trước", "như trong video inverter", "video sau sẽ nói", "xem tập trước". Mỗi video tự đứng được một mình, vì người xem có thể chỉ gặp đúng video đó. Cần nhắc lại một ý đã giải thích ở video khác thì nói lại ý đó bằng một câu ngắn trong chính video này; phần để dành cho video khác thì bỏ hẳn, không hẹn. Ghi chú nội bộ trong file kịch bản (dòng "Nối chuỗi", phần "Đơn giản hoá có chủ ý") vẫn được nhắc tên video khác, vì người xem không thấy.

### 5.2. Kiểm chứng kiến thức

**Kiểm chứng kiến thức (khổ ngang).** Mỗi khẳng định khoa học có nguồn; khẳng định chưa có nguồn thì bỏ khỏi video hoặc ghi "cần đối chiếu". Ghi bảng khẳng định, nguồn, trạng thái vào `san_pham/<thư mục video>/tai_nguyen/kich_ban/<ten>.nguon_kiem_chung.md`. Mẫu: `san_pham/2026.10.25.Pin mặt trời hoạt động như thế nào mà không cần bộ phận quay?/tai_nguyen/kich_ban/2026.10.25.nguyen_ly_pin_mat_troi_v3.nguon_kiem_chung.md`. Không đưa số liệu một nguồn vào video; cần nguồn tiếng Trung hoặc nguồn Việt khó tìm thì xem skill `giao-antigravity-tra-cuu` của META.

**Ba lỗi kiểm chứng đã gặp ở lô 18 video điện chung và điện mặt trời (27–28/10/2026); rà cả ba trước khi giao kịch bản:**

- **Số hiển thị phải khớp phép tính sau khi làm tròn.** Tính lại từ số đầu vào rồi so với số in trên hình và trong lời đọc, và các cảnh cùng nói một đại lượng phải dùng cùng một số đã làm tròn. Ví dụ (N22): 600 W trên 2,58 m² là 232,56 W mỗi m², tức hiệu suất 23,26%, hiển thị 23,3% (lô 18 video, N22).
- **Đối chiếu số trong bản tóm tắt với bảng số liệu của bản đủ.** Bản tóm tắt điều hành có thể không khớp bảng bên trong. Ví dụ: tóm tắt điều hành của báo cáo IEA PVPS T13-22:2021 ghi 3 + 9 + 6 = 18 hệ, còn bảng 7 trong bản đủ là 5 + 8 + 6 = 19 hệ. Lấy số theo bảng và ghi bảng vào cột nguồn của file kiểm chứng (lô 18 video, N27).
- **Sổ nợ và kế hoạch lô có thể ghi sai bản chất; kiểm lại với nguồn trước khi chép vào kịch bản.** Ví dụ: sổ nợ ghi "năm con số là năm điểm" trên đường cong dòng–áp của tấm pin, nhưng Vmp, Imp, Pmax là cùng một điểm (điểm gối của đường cong, nơi công suất lớn nhất), nên năm con số chỉ ứng với ba điểm: hở mạch (Voc), ngắn mạch (Isc) và điểm gối (lô 18 video, N21).

#### Nguồn ban hành đã dùng, dùng lại được (lô 18 video, điện mặt trời)

Nguồn của lô điện gió (Thông tư 05/2025/TT-BCT, Quyết định 18/2021/QĐ-TTg, IRENA RPGC 2024, PVWatts, Bộ Năng lượng Mỹ…) ghi ở `10_video_ngang_thuyet_minh.md` mục 23 quy tắc 8. Nguồn dưới đây đã kiểm trong lô 18 video; dùng lại thì vẫn mở trang nguồn đối chiếu trước khi đưa số lên hình.

| Chủ đề | Nguồn và số đã kiểm | Lưu ý |
|---|---|---|
| Hiệu suất tế bào và tấm pin | Fraunhofer ISE, Photovoltaics Report, bản 14/07/2026, trang 4, 7, 33, 34: tế bào phòng thí nghiệm 28,1%, tấm phòng thí nghiệm 26,0%, tấm thương mại trung bình 22,7% (khoảng 18,9–24,8%). Green et al., Version 68 (N22) | Phân biệt tế bào, tấm phòng thí nghiệm và tấm thương mại; không trộn ba mức |
| Số nắng, bức xạ theo địa điểm (giao diện lập trình không cần khoá) | Global Solar Atlas: `api.globalsolaratlas.info/data/lta?loc=<vĩ độ>,<kinh độ>` (PVOUT_csi, GTI_opta, GHI theo năm và theo tháng); PVGIS v5.3 công cụ PVcalc; NASA POWER climatology (ALLSKY_KT). Số EVN 2026 theo tỉnh: bài VietnamNet 05/09/2026 (N35) | Ba nguồn đầu cho số khí tượng; số của EVN theo tỉnh đọc qua bài báo VietnamNet |
| Thử tải cơ học tấm pin | IEC 61215 yêu cầu thử tải cơ học tối thiểu 2.400 Pa (1.600 Pa × 1,5). Mức 5.400 Pa mặt trước và 2.400 Pa mặt sau là mức hãng chọn ghi trong bảng thông số, không phải yêu cầu của tiêu chuẩn (N25) | Kế hoạch lô và sổ nợ từng ghi lẫn hai thứ này; viết rõ "tiêu chuẩn yêu cầu" hay "hãng công bố" |
| Các kiểu suy giảm tấm pin | LID: "vài phần trăm" (không dùng 1–3%). LeTID: PERC đời đầu tới khoảng 10%, TOPCon dưới 0,3%. UVID: báo cáo nhiều từ 2022 ở TOPCon và HJT nhưng PERC cũng bị. PID kiểu phân cực là chế độ chính hiện nay (IEA PVPS 2025) (N28) | Số đã sửa theo nguồn học thuật; dùng thống nhất cho các video sau |

### 5.3. Cách đọc thuật ngữ cho giọng máy

Giọng máy đọc thuật ngữ vay mượn không ổn định. Cách làm: lời đọc (`doc`) viết lại theo cách phát âm tiếng Việt, phụ đề (`text`) giữ nguyên chính tả. Trung nghe thử các biến thể rồi chọn; bản chọn của ca thử (giọng HoaiMy):

| Phụ đề | Lời đọc |
|---|---|
| electron | ê-léc-trôn |
| photon | phô-tôn |
| silicon | xi-li-côn |
| 1,12 electron vôn | một phẩy mười hai ê-léc-trôn vôn |
| mối nối p n | mối nối pê en |
| lớp n, lớp p | lớp en, lớp pê |

Giọng mặc định hiện là **VieNeu Hải Đăng** (`08_giong_am_thanh_phu_de.md` mục 0): trường `doc` vẫn viết theo bảng phiên âm này; thuật ngữ máy nghe lại (Whisper) hay nhận nhầm được chuẩn hoá ở khối `vieneu` của `tai_san/cau_hinh_giong.json`. Bảng gốc chọn cho giọng HoaiMy của ca thử 2D. Ngày 25/10/2026 Trung nghe thử bản chính tả gốc so với bản phiên âm (`tai_san/giong_doc/mau_xuan_luong_2026.10.25/`, `mau_so_sanh_2026.10.25/`) và chọn **giữ nguyên bảng phiên âm**. Đổi sang giọng khác của VieNeu thì nghe thử lại.

**Thuật ngữ điện cho giọng Hải Đăng** (Trung chọn qua trang nghe thử 27/10/2026, `tai_san/giong_doc/nghe_thu_thuat_ngu_2026.10.27/`; đã ghi vào khối `vieneu` của `tai_san/cau_hinh_giong.json`, khoá `phien_am_trung_chot`, kèm cặp chuẩn hoá cho Whisper):

| Phụ đề | Lời đọc |
|---|---|
| MWp | mê-ga-oát pê |
| MWac | mê-ga-oát a-xê |
| tỷ lệ DC/AC | đê xê trên a xê |
| PR (hệ số hiệu suất) | pê-rờ |
| giới hạn Betz | Bét-xơ |
| bão Yagi | Ya-ghi |
| cấp T (cấp tua-bin IEC) | cấp tê |
| bão Faxai | Phắc-xai |
| capacity factor | ca-pắc-xi-ti phắc-tơ |
| cos phi | cô-sin phi |
| IRENA | Ai-rê-na |
| stato (phần đứng yên của máy điện) | sờ-ta-to (Trung chốt 27/10/2026 khi sửa video máy phát; giọng đọc "xta-tô" nghe lạ) |
| EVN | i-vi-en (Trung chốt 27/10/2026 khi sửa video MWp/MWac: tên riêng hay dùng, đánh vần kiểu tiếng Anh; không đọc "e vê en" hay "E V N") |
| CIC (Trung tâm Thông tin tín dụng) | xi ai xi (Trung chốt 29/10/2026 khi duyệt video thẻ tín dụng N116) |
| OTP (mã xác thực một lần) | ô tê pê (Trung chốt 29/10/2026, N116; KHÔNG đọc "ô ti pê") |
| CVV (ba số ở mặt sau thẻ) | xê vê vê (Trung chốt 29/10/2026, N116) |

**Cách đọc tác tử tự đặt trong lô 16 video điện gió (28/10/2026), Trung chưa nghe chốt** — dùng tạm, Trung nghe các video N38–N52 rồi chốt hoặc sửa:

| Phụ đề | Lời đọc |
|---|---|
| LiDAR | lai-đa |
| Doppler (hiệu ứng) | đốp-lơ |
| laser | laze |
| Weibull (phân bố) | vây-bun |
| SCADA | sờ ca đa |
| ADB | A-đê-bê, kèm "tổ chức phát triển châu Á" lần đầu |
| NREL | không đọc tên viết tắt; nói "Phòng thí nghiệm Năng lượng tái tạo quốc gia Mỹ" |
| IEC 61400-12-1 | i-e-xê sáu một bốn không không, mười hai, một |
| 35 °C | ba mươi lăm độ xê |
| HDPE (lô 18 video) | hát đê pê e |

**Cách đọc dùng trong lô 18 video điện chung và điện mặt trời (27–28/10/2026).** Các video này đã được Trung duyệt bản cuối nhưng Trung chưa nghe chốt riêng từng cách đọc dưới đây; dùng tiếp, Trung nghe thấy lạ thì đổi. Chữ cái đọc từng chữ viết cách bằng dấu cách (giê hát i), không nối bằng gạch ngang; từ vay đã Việt hoá viết có gạch ngang (công-te-nơ). Cặp chuẩn hoá cho Whisper ở khối `vieneu` của `tai_san/cau_hinh_giong.json`.

| Phụ đề | Lời đọc |
|---|---|
| container (BESS) | công-te-nơ |
| kios, ki-ốt (trạm biến áp hợp bộ) | ki-ốt (video máy biến áp hợp bộ viết "ki-ốt" cả ở `text` lẫn `doc`) |
| GHI (bức xạ toàn phần trên mặt phẳng ngang) | giê hát i |
| DNI (nắng thẳng) | đê en i |
| DHI (nắng tán) | đê hát i |
| POA (bức xạ trên mặt phẳng tấm pin) | pê ô a |
| Pmax | pê mắc xờ |
| Voc | vê ô xê |
| Isc | i ét xê |
| Vmp | vê em pê |
| Imp | i em pê |
| kWp | ki-lô-oát pê (một số câu VieNeu đọc ngắn mất âm tiết khi có dấu phẩy ngay sau từ này; đo độ dài từ trong `moc_tu.json` rồi bỏ dấu phẩy trong `doc`, `08_giong_am_thanh_phu_de.md` mục 5) |
| 1,225 kg/m³ | một phẩy hai trăm hai mươi lăm ki-lô-gam trên mét khối |

Các cách đọc trên lấy từ trường `doc` của các file `san_pham/2026.10.2*/tai_nguyen/kich_ban/*.chuong.json` (video BESS, bức xạ mặt trời, nhãn tấm pin, sản lượng riêng, gió lập phương, ba mốc tốc độ gió, máy biến áp hợp bộ). Muốn biết cách đọc đã dùng cho một thuật ngữ khác: `grep` trường `"doc"` trong các file đó.

Số đứng cuối câu (ví dụ "hai mê-ga-oát") Whisper hay nghe thành số khác: đưa số vào giữa câu (`08_giong_am_thanh_phu_de.md` mục 5b).

**Lỗi nuốt chữ khi chữ cái đứng sát từ nối.** VieNeu đọc "mê-ga-oát pê hay mê-ga-oát a-xê" bị mất chữ "pê" (Trung nghe ra, 27/10/2026). Sửa bằng cách thêm dấu phẩy và chữ đệm trong `doc`: "mê-ga-oát pê, hay là mê-ga-oát a-xê"; phụ đề giữ nguyên.

Khối `vieneu` cũng có thêm cặp chuẩn hoá đơn vị cho Whisper: W → oát, kW → ki-lô-oát, kWh → ki-lô-oát giờ, MW → mê-ga-oát, MWh, GW, GWh. Ký hiệu % chưa chuẩn hoá được bằng bảng này vì hàm `chuan` trong `scripts/sinh_giong_vieneu.py` bỏ dấu câu (kể cả %) trước khi áp bảng; câu có % vẫn bị báo sai dù đọc đủ.

## 6. Cách làm giàu kho

Trung đã nói sẽ tự làm giàu dần. Hai đường vào, cả hai đều kết thúc ở cùng một chỗ:

| Đường | Khi nào | Làm gì |
|---|---|---|
| **Từ mẫu Trung gửi** | Trung đưa link video hoặc ảnh thích | Theo `11_hoc_phong_cach_tu_mau.md` → ra thẻ **ngăn B** (dựng). Đây là đường đã đẻ ra D-01 |
| **Từ nhu cầu chưa ai nhận** | Gặp chủ đề mà không thẻ nào trong Bảng 1 nhận, hoặc mục *"Kho đang thiếu gì"* ở `00_muc_luc.md` chỉ ra chỗ trống | Soạn thẻ mới theo khuôn tương ứng, dựa trên khuôn chặng ở mục 4 của file này chứ không chép từ đâu |

Bốn việc bắt buộc khi thêm bất kỳ thẻ nào, thiếu một là kho lệch:

1. Điền thẻ theo đúng khuôn — `_mau_the_kich_ban.md` cho ngăn A, `_mau_the_phong_cach.md` cho ngăn B. Không tự nghĩ khuôn riêng.
2. Thêm dòng vào **Bảng 1** hoặc **Bảng 2** ở `00_muc_luc.md`.
3. Thêm **đủ ô vào Bảng 3** — thêm kịch bản thì thêm một hàng và điền hết các cột; thêm dựng thì thêm một cột và điền hết các hàng. Ô trống trong Bảng 3 nghĩa là chưa ai xét cặp đó, và cặp chưa xét thì không được đem ghép.
4. Chạy lại script xuất Excel:

```bash
python3 scripts/xuat_kho_phong_cach_excel.py   # chạy tại gốc Media trên Mac (đổi 25/10/2026 từ đường dẫn Windows cũ)
```

Thẻ mới luôn ở trạng thái **nháp** cho tới khi Trung duyệt. Thẻ nháp được đem ra đề xuất (có ghi rõ là nháp), nhưng thẻ nào đã đem dựng video giao thật thì **không sửa ngầm nữa** — muốn đổi thì đẻ biến thể mới (`D-01b`), vì video đã giao vẫn đang treo trên thẻ cũ.

Làm giàu trục dựng (thêm hoặc sửa lựa chọn chất liệu, bố cục, tông màu, nhạc): `04_he_truc_dung.md` mục 4.

## 7. Quan hệ với các module khác

| File | Quan hệ |
|---|---|
| `02_lam_ro_yeu_cau.md` | Chạy **trước** file này. Hỏi rõ yêu cầu xong mới có căn cứ lọc phong cách nào hợp. Mục 4.3 của `02_lam_ro_yeu_cau.md` cho phép bỏ vòng hỏi khi đã có thẻ chốt sẵn khớp yêu cầu |
| Mục 4 của file này | Khuôn chặng là **khung xương chung**, mọi phong cách kịch bản đều phải đi vừa khung đó. Phong cách quyết định mỗi chặng chứa gì, không được đổi thứ tự chặng; số cảnh hình đổi được theo `04_he_truc_dung.md` mục 6.2 |
| `10_video_ngang_thuyet_minh.md` | Video ngang giai đoạn 3 qua hai cửa chọn và chọn biến tấu theo `04_he_truc_dung.md` mục 6 |
| `11_hoc_phong_cach_tu_mau.md` | Đường sinh thẻ ngăn B từ mẫu Trung gửi (gồm cả kỹ thuật cắt khung hình) |
| `15_bang_kiem_truoc_khi_giao.md` | Bước soát trước khi giao. Riêng kịch bản viết theo KB-03 Ngược dòng phải soát thêm một lượt theo `13_ban_quyen_va_bao_mat.md` |
| `16_tu_dien_thuat_ngu.md` | Trung hỏi một từ trong mô tả phong cách nghĩa là gì thì tra ở đó |
| `01_quy_trinh_chung.md` | Luồng các bước dùng chung cho hai khổ; cửa chọn 1 ở mục 2 của file này, cửa chọn 2 ở `04_he_truc_dung.md` |
| `04_he_truc_dung.md` | Cửa chọn 2 (dựng theo hệ trục) và chống nhàm chán |
| `09_video_doc_ngan.md` | Khối cảnh dựng sẵn của video dọc, lệnh dựng video dọc |
