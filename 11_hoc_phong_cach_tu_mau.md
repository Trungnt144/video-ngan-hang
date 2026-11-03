# 11 — Học phong cách từ mẫu (quy trình, kỹ thuật cắt khung hình, học từ bộ sưu tập)

> Đọc trước khi Trung gửi một video hoặc ảnh mẫu và muốn xưởng "bắt chước" phong cách của nó; trước khi cần bóc tách kỹ thuật một video mẫu (tải về, đo thông số, cắt khung hình, đo màu, đo nhịp cắt); và trước khi học từ một bộ sưu tập nhiều video.
> Ba phần: mục 1 đến 5 là quy trình học phong cách từ một mẫu (từ `06_nghien_cuu_phong_cach.md`); mục 6 đến 14 là kỹ thuật bóc tách video mẫu (từ `07_phan_tich_video.md`, mục 0 đến 8 cũ, đã sửa theo máy Mac); mục 15 là cách học từ một bộ sưu tập video (mới).
> **Phiên bản:** 2.0 · **Cập nhật:** 2026-10-27 · gộp `06_nghien_cuu_phong_cach.md` (1.2) và `07_phan_tich_video.md` (1.1) thành một module khi dựng lại luồng Media; kỹ thuật cắt khung hình viết lại theo máy Mac (ffmpeg đầy đủ ở `xuong_thu_hyperframes/bin/`, PowerShell chỉ còn ở phụ lục cuối mục 14); thêm mục 15 học từ một bộ sưu tập video.
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-26 · Thêm cách cắt khung trên máy Mac (ffmpeg kèm Remotion, `soat_khung_mp4.py`); `cat_khung_hinh.ps1` chỉ chạy trên Windows. **1.0** · 2026-07-28
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-07-28 (chiều muộn — sửa ví dụ ở mục 1b cho khớp sự thật sau khi soát lại thẻ "Đêm & đỏ" bằng cắt khung dày; thêm cảnh báo về kết luận dạng "hoàn toàn không có X" và quy tắc bắt buộc cắt dày ở câu (6))

## Mục lục

| Mục | Nội dung | Nguồn cũ |
|---|---|---|
| 1, 1b | "Phong cách" gồm những gì (chín thành phần); thành phần "Hình ảnh" (sáu câu hỏi) | `06` mục 1, 1b |
| 2 | Quy trình 5 bước khi Trung gửi một mẫu | `06` mục 2 |
| 3 | Khi mẫu chỉ là ảnh tĩnh | `06` mục 3 |
| 4 | Ranh giới bắt chước: học nguyên tắc, không sao chép | `06` mục 4 |
| 5 | Từ thẻ phong cách sang tham số dựng video | `06` mục 5 |
| 6 đến 14 | Kỹ thuật bóc tách video mẫu: 6 công cụ (ffmpeg, yt-dlp, Python); 7 tải bằng yt-dlp (ràng buộc bản quyền); 8 đọc thông số bằng ffprobe; 9 cắt khung hình ((a) đều, (b) dày, (c) tại điểm đổi cảnh); 10 đo nhịp cắt; 11 bảng màu bằng Pillow; 12 dải khung hình; 13 nguyên tắc chi phí; 14 bảng tóm tắt và phụ lục PowerShell cho Windows | `07` mục 0 đến 8 |
| 15 | Học từ một bộ sưu tập video | mới |

Số mục 1 đến 5 giữ số của `06` cũ; mục 7 đến 14 là mục 1 đến 8 của `07` cũ cộng 6 (ví dụ "`07` mục 3b" nay là mục 9(b)). Tra mục trong file: `grep -n "^## 9\." 11_hoc_phong_cach_tu_mau.md`.

## 1. "Phong cách" gồm những gì

Khi Trung nói "thích cái video này, làm giống vậy" — cái Trung thích không phải là MỘT thứ, mà là tổng hòa của chín thành phần dưới đây. Mỗi thành phần kéo cảm giác video theo một hướng riêng; tách được thành phần nào Trung thích thì mới bắt chước đúng chỗ, không đúng nguyên cả video (kể cả phần Trung không để ý và có khi không thích).

| Thành phần | Là gì, nói dễ hiểu | Vì sao nó quyết định "cảm giác" |
|---|---|---|
| Bảng màu (color palette) | Vài mã màu cố định dùng xuyên suốt: màu nền, màu chữ, 1-2 màu nhấn cho từ khóa | Màu là thứ mắt nhận trong nửa giây đầu tiên, trước cả khi đọc chữ. Nền tối chữ trắng cho cảm giác nghiêm túc/công nghệ; nền sáng màu tươi cho cảm giác vui nhộn/gần gũi |
| Kiểu chữ và cách đặt chữ (typography) | Phông chữ, độ đậm (bold), cỡ chữ, có viết hoa hết không, chữ đứng hay nghiêng | Chữ dày và to gợi cảm giác chắc chắn, dứt khoát; chữ mảnh và nhỏ gợi cảm giác tinh tế nhưng khó đọc trên điện thoại. Đây là thứ quyết định video có "nhìn chuyên nghiệp" hay không nhiều hơn cả nội dung |
| Bố cục khung hình (frame layout) | Chữ nằm ở đâu trong khung (giữa, dưới, lệch trái), hình minh họa chiếm bao nhiêu phần khung, có để khoảng trống hay lấp kín | Bố cục dẫn mắt người xem nhìn vào đâu trước. Khung dọc 1080×1920 mà đặt chữ sai chỗ (ví dụ giữa khung, bị tay cầm điện thoại che khi xem full-screen) thì thông điệp mất tác dụng dù nội dung đúng |
| Nhịp cắt (cutting pace) | Bao nhiêu giây thì đổi sang cảnh/khung tiếp theo | Nhịp cắt nhanh (1-2 giây/cảnh) tạo cảm giác gấp gáp, nhiều thông tin, hợp tin nóng; nhịp chậm (4-5 giây/cảnh) tạo cảm giác thong thả, hợp nội dung cần suy ngẫm. Cắt sai nhịp so với nội dung là lý do phổ biến nhất khiến video "xem không vào" |
| Kiểu chuyển động (motion style) | Chữ và hình xuất hiện/biến mất thế nào: bay vào từ cạnh, phóng to dần (zoom), trượt ngang, hiện dần (fade) | Chuyển động là "năng lượng" của video. Chuyển động giật, nhanh, nảy (bounce) gợi cảm giác trẻ trung sôi động; chuyển động êm, chậm, mượt gợi cảm giác đáng tin cậy. Một video nội dung tài chính nghiêm túc mà chữ bay nảy như quảng cáo game sẽ lệch tông |
| Cách làm phụ đề (caption style) | Phụ đề hiện cả câu một lần hay chạy theo từng cụm từ đúng lúc giọng đọc tới đó; từ đang đọc có đổi màu/phóng to không | Phụ đề chạy chữ đúng nhịp giọng đọc là thứ phân biệt video "làm chuyên nghiệp" với video chỉ dán phụ đề tĩnh lên trên. Đây gần như là chuẩn bắt buộc với video ngắn dọc hiện nay (xem `09_video_doc_ngan.md` mục 3) |
| Tiết tấu giọng đọc và nhạc (voice & music pacing) | Giọng đọc nhanh/chậm, lên giọng ở đâu, nhạc nền to/nhỏ, nhạc có đổi nhịp theo nội dung không | Tai dẫn cảm xúc song song với mắt. Giọng đọc đều đều suốt video dù nội dung có cao trào vẫn làm người xem chán, bất kể hình đẹp thế nào |
| Mật độ thông tin trên mỗi khung (information density) | Mỗi khung hình chứa bao nhiêu chữ, bao nhiêu số liệu, bao nhiêu ý cùng lúc | Mật độ cao (nhiều chữ/số liệu dồn 1 khung) hợp nội dung cần dẫn chứng, đối tượng xem kỹ; mật độ thấp (1 khung 1 ý ngắn) hợp nội dung lướt nhanh trên mạng xã hội. Bắt chước phong cách của một kênh giải trí nhưng giữ mật độ thông tin kiểu báo cáo tài chính là công thức chắc chắn thất bại |
| **Hình ảnh (imagery)** — xem mục 1b | Hình trong khung làm bằng chất liệu gì, đóng vai trò gì, có nhất quán không | Với video minh họa động thì đây thường là thành phần LỚN NHẤT, không phải phụ. Nó quyết định phần lớn chi phí sản xuất (dựng đồ họa vs. lấy ảnh có sẵn) và là chỗ lộ "nghiệp dư" nhanh nhất khi hình chắp vá nhiều nguồn |

Chín thành phần này là khung để hỏi và để điền thẻ phong cách ở mục 4 — không phải danh sách phải phân tích đủ hết trong mọi mẫu (xem mục 3 khi mẫu chỉ là ảnh tĩnh).

## 1b. Thành phần "Hình ảnh" — sáu câu hỏi phải trả lời

Thành phần này nặng hơn tám thành phần kia nên tách riêng. Bảy dòng ở mục 1 gần như chỉ nói về CHỮ và NHỊP; hình bị lọt vào một vế nhỏ của "bố cục", trong khi sản phẩm chính của xưởng lại là video hình minh họa động. Sáu câu dưới đây là phần bù.

**(1) Chất liệu — hình đó làm bằng gì.** Câu hỏi quyết định nhất, vì nó kéo theo cả chi phí lẫn công cụ dựng:

| Chất liệu | Cảm giác mang lại | Hợp nội dung tài chính không |
|---|---|---|
| Quay thật (người, cảnh) | Chân thực, có hơi người | Hợp phỏng vấn, chia sẻ quan điểm — nhưng xưởng chưa làm mảng này |
| Ảnh chụp có sẵn (stock) | Nhanh, rẻ, nhưng dễ "nhìn là biết ảnh mạng" | Hạn chế — ảnh doanh nhân bắt tay cười là dấu hiệu nội dung rỗng |
| Đồ họa phẳng vector (biểu tượng, khối màu, mũi tên) | Sạch, gọn, nghiêm túc, dễ đồng bộ | Rất hợp — hướng mặc định nên chọn khi cần có hình |
| Hoạt hình 2D vẽ tay | Thân thiện, dễ gần, giảm cảm giác khô | Hợp nội dung giải thích khái niệm cho người ngoài ngành |
| 3D | Sang, hiện đại, nhưng tốn công và dễ lệch tông | Cân nhắc, thường quá đà |
| Ảnh do AI sinh | Nhanh, hình gì cũng có | Rủi ro: dễ lộ chi tiết sai (chữ méo, tay thừa ngón) và nhìn "nhựa" |
| Ảnh chụp màn hình, bảng số liệu | Có sức nặng dẫn chứng | Hợp — nhưng phải soát ẩn danh trước, xem `13_ban_quyen_va_bao_mat.md` |
| **Chữ thuần + hình khối hình học** (hình minh họa rất ít hoặc không có) | Tối giản, dồn hết sức vào câu chữ và chuyển động | Hợp bất ngờ. Nhiều kênh tài chính/công nghệ mạnh chọn hướng này — xem thẻ `tai_san/so_tay_gu/dung/d01_dem_va_do.md`: mẫu 165 giây gần như chỉ có chữ và khối hình học, **đúng một màn dùng emoji** và chính màn đó là chỗ lệch tông nhất của cả video |

Chất liệu "chữ thuần + khối hình học" dễ bị bỏ sót khi phân tích vì người xem không ý thức được là mình đang xem "hình". Nhưng thanh tiến trình, dấu chấm phân trang, số thứ tự khổng lồ, đường kẻ mảnh, khối chữ nhật nền mờ — đó chính là hệ hình ảnh của video, chỉ là làm bằng hình học thay vì tranh vẽ. **Nhận ra một mẫu thuộc loại này là phát hiện đáng giá: nó có nghĩa xưởng dựng lại được gần như hoàn toàn bằng Remotion, không cần kho biểu tượng, không vướng bản quyền hình.**

**Nhưng "gần như" mới đúng, và chỗ chênh lệch đó phải kiểm bằng mắt trên đủ số màn.** *(Ghi lại ngày 28/07/2026 sau một lần kết luận sai — chi tiết ở `99_nhat_ky.md` bổ sung lần 3.)* Thẻ "Đêm & đỏ" ban đầu ghi mẫu **không có lấy một hình minh họa nào**, câu đó nghe gọn và thuyết phục nên được chép thẳng vào chính file này làm ví dụ. Soát lại bằng cách xem đủ các màn thì ra màn 05/23 dùng hai emoji màu. Sai lệch nhỏ về số lượng nhưng đổi hẳn kết luận: từ "không cần bộ biểu tượng nào" thành "cần một bộ biểu tượng nhỏ, và phải là vector một màu chứ không phải emoji".

Hai điều rút ra, áp cho mọi lần phân tích sau:
- **Kết luận dạng "hoàn toàn không có X" là loại dễ sai nhất**, vì chỉ cần một màn phản ví dụ là đổ. Muốn khẳng định phải xem đủ số màn (mẫu chia 23 màn thì cắt ít nhất 23 khung, không phải 17), còn không thì viết "gần như không có" kèm số màn đã xem.
- **Càng là kết luận đắt giá càng phải kiểm kỹ trước khi đưa vào module.** Một khi câu đó nằm trong tài liệu chuẩn, các phiên sau sẽ đọc nó như sự thật đã kiểm chứng và không hỏi lại nữa.

**(2) Mức trừu tượng — tả thực hay ẩn dụ.** Nói "dòng tiền bị siết" thì trên hình là gì: vòi nước bị khóa (ẩn dụ), biểu đồ đường đi xuống (tả thực bằng số liệu), hay chính chữ "DÒNG TIỀN" bị bóp nhỏ lại (ẩn dụ bằng chữ)? Ẩn dụ dễ nhớ nhưng dễ sến; tả thực đáng tin nhưng khô.

**(3) Vai trò của hình trong khung.** Chọn một và giữ nhất quán cả video:

```
Hình là chính        Hình là nền           Hình là phụ kiện
┌──────────┐         ┌──────────┐          ┌──────────┐
│ ████████ │         │░░░░░░░░░░│          │          │
│ ██HÌNH██ │         │░░ CHỮ  ░░│          │  CHỮ TO  │
│ ████████ │         │░░ TO   ░░│          │   ⬤      │
│  chữ nhỏ │         │░░░░░░░░░░│          │          │
└──────────┘         └──────────┘          └──────────┘
hình kể chuyện       hình chỉ tạo            hình chỉ để
chữ chú thích        không khí               nhấn một ý
```

**(4) Phong cách xử lý hình.** Nét dày hay mảnh, có viền hay không, phẳng hoàn toàn hay có đổ bóng/chiều sâu, góc bo tròn hay vuông sắc, có lớp nhiễu hạt (grain) hay sạch trơn. Đây là thứ khiến hai bộ biểu tượng cùng nội dung nhìn hoàn toàn khác nhau.

**(5) Tính nhất quán — thành phần giết video nhanh nhất.** Một video dùng ba bộ hình từ ba nguồn khác nhau lộ ngay, kể cả người xem không biết vì sao thấy "nghiệp dư". Nguyên tắc cứng: **một video chỉ dùng một bộ hình**. Đây là lý do việc gom kho biểu tượng vào `tai_san/` được đặt thành đầu việc riêng ở `09_video_doc_ngan.md` mục 6.

**(6) Hình động thế nào.** Khác với "kiểu chuyển động" của chữ ở mục 1: hình tĩnh có được đẩy chậm/phóng nhẹ để đỡ chết khung không, hay hình thật sự có bộ phận cử động, hay hiện ra rồi đứng yên. Riêng số liệu còn một câu nữa: biểu đồ vẽ dần ra hay hiện sẵn, con số đếm tăng dần hay nhảy thẳng.

> **Bắt buộc: câu (6) không được trả lời bằng mắt thường.** Thanh chạy đầy dần trong nửa giây và thanh đã đầy sẵn — trên khung tĩnh trông y hệt nhau. Phải cắt dày **≥6 hình/giây** đúng đoạn có thanh/biểu đồ/số liệu rồi mới kết luận (mục 9(b) của file này). Thẻ "Đêm & đỏ" từng ghi sai ngược cả hai vế câu này vì suy từ khung thưa. Danh sách đầy đủ các ô phải cắt dày nằm ở `tai_san/so_tay_gu/_mau_the_phong_cach.md`, mục "ba ô KHÔNG được điền bằng mắt thường".

## 2. Quy trình 5 bước khi Trung gửi một mẫu

```
1. HỎI Trung thích ĐIỂM GÌ ở mẫu này
        │  (bắt buộc, làm TRƯỚC khi phân tích)
        ▼
2. THU THẬP mẫu về máy
        │  (link video → yt-dlp; ảnh/screenshot → lưu file)
        ▼
3. BÓC TÁCH bằng kỹ thuật
        │  (xem mục 6 đến 14 của file này — cắt khung hình, đo màu, đo nhịp)
        ▼
4. RÚT RA thẻ phong cách
        │  (điền khuôn tai_san/so_tay_gu/_mau_the_phong_cach.md)
        ▼
5. TRUNG DUYỆT thẻ
        │  (nháp → đã duyệt) — chỉ thẻ đã duyệt mới đem dựng video thật
        ▼
   Dùng thẻ để dựng (xem mục 5)
```

**Bước 1 — vì sao bắt buộc hỏi trước:** một video mẫu luôn có nhiều thứ đáng chú ý cùng lúc — có thể Trung chỉ thích cách phụ đề chạy chữ, nhưng nếu không hỏi mà cứ phân tích đủ cả chín thành phần, xưởng dễ bắt chước nhầm chỗ Trung không để ý (ví dụ bê nguyên bảng màu sặc sỡ trong khi Trung chỉ thích nhịp cắt nhanh). Câu hỏi gợi ý: "Anh thích tổng thể hay một điểm cụ thể — màu, cách chữ chuyển động, nhịp cắt, hay cách đọc phụ đề?" Trả lời mơ hồ ("thích vibe chung") thì vẫn phân tích đủ 9 thành phần nhưng ghi rõ trong thẻ là "học tổng thể", không riêng lẻ.

**Bước 2 — thu thập:** link TikTok/YouTube/Reels dùng `yt-dlp` tải về máy (đã kiểm chứng có sẵn trên máy ngày 28/07/2026); ảnh chụp màn hình hoặc ảnh tĩnh thì lưu trực tiếp. Nơi lưu: `tai_san/so_tay_gu/mau_tham_khao/<ten_phong_cach_khong_dau>/` — thư mục con này KHÁC với tài sản dùng để dựng video (biểu tượng, nhạc, phông ở `tai_san/` gốc, xem `13_ban_quyen_va_bao_mat.md` mục 2). Mẫu tham khảo chỉ để học, không có giấy phép sử dụng lại — xem ranh giới ở mục 4.

**Bước 3 — bóc tách kỹ thuật:** toàn bộ phần dùng ffmpeg/ffprobe cắt khung hình theo mốc thời gian, đo mã màu, đo độ dài mỗi cảnh nằm ở mục 6 đến 14 của file này. Các mục đó trả về số liệu thô (mã màu đo được, danh sách mốc đổi cảnh...); bước 4 dưới đây mới là lúc đọc số liệu thô đó và diễn giải thành nhận xét phong cách.

**Bước 4 — rút thẻ:** dùng số liệu thô từ bước 3 cộng với quan sát bằng mắt (kiểu chữ, kiểu chuyển động, cảm giác chung) để điền khuôn `tai_san/so_tay_gu/_mau_the_phong_cach.md`. Mỗi ô trong khuôn tương ứng một hàng ở bảng mục 1.

**Bước 5 — duyệt:** thẻ mới điền luôn ở trạng thái "nháp". Trình cho Trung xem, Trung góp ý/sửa, chuyển "đã duyệt" thì mới được đem ra dựng video thật (mục 5). Thẻ chưa duyệt dùng thử được cho video nháp nội bộ nhưng không đưa vào `san_pham/`.

## 3. Khi mẫu chỉ là ảnh tĩnh

Ảnh tĩnh (screenshot, ảnh chụp một khung hình, ảnh thiết kế) thiếu hẳn chiều thời gian, nên phân tích được 5/9 thành phần, còn 4 thành phần phải hỏi thêm hoặc suy đoán có ghi chú rõ là suy đoán:

| Phân tích được từ ảnh tĩnh | KHÔNG phân tích được từ ảnh tĩnh |
|---|---|
| Bảng màu | Nhịp cắt (không có nhiều khung để đo khoảng cách) |
| Kiểu chữ và cỡ chữ | Kiểu chuyển động (ảnh không có chuyển động) |
| Bố cục khung hình | Cách làm phụ đề chạy chữ (chỉ thấy phụ đề tĩnh nếu có) |
| Mật độ thông tin trên khung đó | Tiết tấu giọng đọc và nhạc (ảnh không có âm thanh) |
| **Hình ảnh** — 5/6 câu ở mục 1b (chất liệu, mức trừu tượng, vai trò, cách xử lý, nhất quán trong khung đó); riêng câu (6) "hình động thế nào" thì không | |

Ảnh tĩnh là nguồn tốt bất ngờ để đọc thành phần hình ảnh — một khung hình đủ thấy chất liệu, vai trò và cách xử lý hình. Chỉ hai thứ phải dè chừng: tính nhất quán chỉ kiểm được trong phạm vi một khung (cần vài ảnh mới biết cả video có dùng một bộ hình không), và câu (6) thì chịu.

Với 4 thành phần không phân tích được, nên hỏi thẳng Trung thay vì bịa: "Anh hình dung nhịp cắt nhanh hay chậm?", "Chữ nên bay vào hay hiện dần êm?", "Có giọng đọc không, tốc độ thế nào?". Câu trả lời của Trung ghi vào thẻ phong cách như phần "suy đoán theo mô tả của Trung", không lẫn với phần đo được từ ảnh, để lần sau có video mẫu thật thì biết chỗ nào cần kiểm lại.

## 4. Ranh giới bắt chước — học nguyên tắc, không sao chép

Xem đầy đủ ở `13_ban_quyen_va_bao_mat.md`; dưới đây là phần áp riêng cho việc học phong cách:

- **Hợp lệ:** rút ra NGUYÊN TẮC thị giác (ví dụ: "video này dùng nền tối, chữ vàng nhấn, cắt cảnh mỗi 2 giây") rồi áp nguyên tắc đó vào tham số của xưởng mình. Nguyên tắc thị giác không thuộc về ai.
- **Không hợp lệ:** sao chép nguyên khuôn thiết kế, đồ họa, nhạc nền, hoặc cắt trực tiếp cảnh quay của người khác ghép vào video của Trung.
- Video/ảnh mẫu tải về `tai_san/so_tay_gu/mau_tham_khao/` **chỉ dùng để học trong máy**: không đăng lại, không chia sẻ ra ngoài, không cắt khung hình của họ đưa vào bản dựng cuối. Coi như tài liệu tham khảo nội bộ, không phải tài sản sản xuất.
- Học xong một phong cách và đã điền thẻ, mẫu gốc có thể xóa để đỡ chiếm chỗ — thẻ phong cách mới là thứ cần giữ lại lâu dài, không phải file mẫu.

## 5. Từ thẻ phong cách sang tham số dựng video

Bảy khối cảnh dựng sẵn bằng Remotion đã có (xem `09_video_doc_ngan.md` mục 1), nhưng phần này vẫn nói ở mức khái niệm — đây là cách một thẻ phong cách nên "chảy" vào tham số:

| Ô trong thẻ phong cách | Tương ứng tham số nào khi dựng bằng Remotion |
|---|---|
| Bảng màu | Biến màu (màu nền, màu chữ, màu nhấn) truyền vào mỗi khối cảnh qua dữ liệu JSON — đổi bộ màu là đổi cả video không phải sửa từng cảnh |
| Kiểu chữ và cỡ chữ | Tham số phông, độ đậm, cỡ chữ của component — vẫn phải giữ sàn tối thiểu 32px đã chốt ở `09_video_doc_ngan.md` mục 3 dù phong cách mẫu dùng chữ nhỏ hơn |
| Bố cục | Cách sắp phần tử (chữ, hình, khoảng trống) bên trong khối cảnh — một khối cảnh có thể có vài biến thể bố cục chọn qua tham số |
| Nhịp cắt | Độ dài mỗi cảnh tính theo khung hình (30 hình/giây × số giây mong muốn) trong JSON kịch bản |
| Kiểu chuyển động | Chọn kiểu hoạt ảnh (hiệu ứng xuất hiện/biến mất) áp cho chữ và hình trong từng khối cảnh — kỹ thuật animation cụ thể bằng Remotion nằm trong các kỹ năng Remotion đã cài, không nhắc lại ở đây |
| Cách làm phụ đề | Tham số cách nhóm chữ (từng từ hay từng cụm), có tô màu/phóng to từ đang đọc hay không — phụ thuộc mốc thời gian giọng đọc trả về, xem `08_giong_am_thanh_phu_de.md` |
| Tiết tấu giọng đọc và nhạc | Nhịp chia câu của lời đọc (giọng mặc định VieNeu không có tham số tốc độ, xem `08_giong_am_thanh_phu_de.md` mục 0), và lựa chọn bản nhạc nền phù hợp nhịp trong `tai_san/` |
| Mật độ thông tin | Giới hạn số chữ/số liệu cho phép trong một khối cảnh JSON — thẻ phong cách "mật độ thấp" thì kịch bản phải tách ý ra nhiều cảnh hơn thay vì nhồi một cảnh |
| **Hình ảnh** | Quyết định ngay từ đầu: thẻ ghi chất liệu "chữ thuần + khối hình học" thì khối cảnh dựng thẳng bằng thành phần giao diện, KHÔNG cần kho biểu tượng và không vướng bản quyền hình. Thẻ ghi chất liệu "đồ họa vector" thì phải có bộ biểu tượng thống nhất trong `tai_san/` trước khi dựng — đây là điểm rẽ nhánh lớn nhất về khối lượng công việc, xem `09_video_doc_ngan.md` mục 6 việc số 4. Vai trò của hình (chính / nền / phụ kiện) quyết định biến thể bố cục của khối cảnh |

Phần này nên rà lại và có thể tách thành bảng tham số cụ thể hơn (tên biến thật trong mã `xuong/src/video-ngan/`) thay vì mô tả khái niệm như hiện tại.

## 6. Công cụ dùng cho kỹ thuật cắt khung hình

Ba công cụ dòng lệnh (command line — gõ lệnh thay vì bấm chuột) đã có sẵn trên máy, kiểm chứng ngày 28/07/2026:

- **yt-dlp** — tải video từ TikTok/YouTube/Facebook... về máy.
- **ffmpeg** và **ffprobe** — cặp công cụ xử lý video: `ffprobe` để ĐỌC thông số, `ffmpeg` để CẮT/CHUYỂN ĐỔI.
- **Python** (lệnh `python3` trên Mac, `py` trên Windows) kèm thư viện **Pillow** (xử lý ảnh) — dùng ở bước đo bảng màu.

**Đường chính trên máy Mac (ghi 26/10/2026, bổ sung 27/10/2026).** Máy không có PowerShell và không có ffmpeg hệ thống, nên script PowerShell `scripts/cat_khung_hinh.ps1` không chạy được. Hai cách thay:

1. **ffmpeg đầy đủ** ở `xuong_thu_hyperframes/bin/ffmpeg` (gói `ffmpeg-static`, bản 6.0; có bộ lọc `fps`, `select`, `tile`, `hstack`; kèm `xuong_thu_hyperframes/bin/ffprobe`). Đặt `FFMPEG="/Users/macbooktrungnt/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg"` rồi dùng các câu lệnh ghi ở mục 8 đến 12 (đã chạy thử ngày 27/10/2026 trên một video thử). Đây là bản đã dùng để cắt dải khung của 100 video ở mục 15.
2. **ffmpeg kèm Remotion**, ví dụ `DYLD_LIBRARY_PATH=xuong/node_modules/@remotion/compositor-darwin-arm64 xuong/node_modules/@remotion/compositor-darwin-arm64/ffmpeg -ss <giây> -i <video> -frames:v 1 <ảnh>.jpg`. Bản này rút gọn, thiếu bộ lọc `fps`, `select`, `tile`, nên cắt từng khung bằng `-ss` như `scripts/soat_khung_mp4.py` (cắt đều theo bước giây và ghép bảng 4×4); các câu lệnh dùng bộ lọc ở mục 9 và 12 không chạy được với bản này.

Bản PowerShell cho máy Windows: phụ lục cuối mục 14.


## 7. Tải video mẫu về máy bằng yt-dlp

**Ràng buộc bắt buộc đọc trước khi tải, không được lờ đi:**

> Video tải về theo hướng dẫn dưới đây **CHỈ để xem trong máy nhằm học phong cách dựng** (bảng màu, nhịp cắt, kiểu chuyển động...). KHÔNG đăng lại video hoặc bất kỳ đoạn cắt nào của nó ra kênh nào. KHÔNG cắt cảnh quay của họ ghép vào video của Trung — xem ranh giới "học nguyên tắc, không sao chép" ở mục 4 của file này và `13_ban_quyen_va_bao_mat.md`.
>
> Một số nền tảng (đáng chú ý nhất là TikTok và Instagram) **cấm tải video trong điều khoản sử dụng** của họ, dù công cụ kỹ thuật vẫn tải được. Đây là việc Trung tự cân nhắc và tự chịu trách nhiệm khi quyết định tải — Claude chỉ thực hiện lệnh khi Trung xác nhận muốn tải, không tự ý tải hộ, và nêu rõ ràng buộc này mỗi lần chứ không lờ đi.

Lệnh tải cơ bản:

```bash
yt-dlp "https://duong-dan-video" -o "%(title)s.%(ext)s"
```
Tải video ở chất lượng mặc định (thường là cao nhất có sẵn) và đặt tên file theo tiêu đề gốc.

Học phong cách không cần bản 4K nặng nề — chọn mức chất lượng vừa phải để tải nhanh và ít chiếm chỗ, ví dụ giới hạn chiều cao khung hình ở 720 hoặc 1080 pixel (điểm ảnh):

```bash
yt-dlp "https://duong-dan-video" -S "res:1080" -o "%(title)s.%(ext)s"
```
Tham số `-S "res:1080"` (sort — sắp xếp theo tiêu chí) yêu cầu yt-dlp chọn bản có độ phân giải gần 1080 pixel nhất thay vì bản nặng nhất.

Nơi lưu — theo đúng cấu trúc đã chốt ở mục 2 của file này, KHÔNG tạo thư mục riêng khác (bản PowerShell ở phụ lục cuối mục 14):

```bash
mkdir -p "tai_san/so_tay_gu/mau_tham_khao/<ten_phong_cach_khong_dau>"
```
Tạo thư mục con theo tên phong cách (không dấu, ví dụ `nghiem_tuc_toi_gian`) trước khi tải video mẫu vào đó bằng tham số `-o` trỏ vào đường dẫn này.

## 8. Đọc thông số video bằng ffprobe

Trước khi cắt khung hình, đọc nhanh 4 thông số nền để biết mình đang xem loại video gì:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration,bit_rate -of default=noprint_wrappers=1 "duong_dan_video.mp4"
```
In ra 5 dòng: `width`, `height` (độ phân giải), `r_frame_rate` (số hình mỗi giây), `duration` (độ dài), `bit_rate` (tốc độ dữ liệu).

| Thông số | Ý nghĩa | Nói lên điều gì về phong cách |
|---|---|---|
| `width` × `height` (độ phân giải) | Kích thước khung hình tính bằng pixel | 1080×1920 là khung dọc chuẩn TikTok/Reels/Zalo; 1920×1080 là khung ngang — lệch khung so với kế hoạch Giai đoạn 1 (dọc) thì phải cân nhắc lại trước khi bắt chước bố cục |
| `r_frame_rate` (số hình mỗi giây — frame rate) | Video hiển thị bao nhiêu khung hình trong 1 giây | 24-25 hình/giây cho cảm giác điện ảnh, hơi "chậm mượt"; 30 hình/giây là chuẩn phổ biến nhất cho video mạng xã hội; 60 hình/giây cho chuyển động mượt bất thường, thường gặp ở video có nhiều thao tác tay nhanh hoặc thể thao |
| `duration` (độ dài) | Tổng thời lượng video, đơn vị giây | So với độ dài này và số lần đổi cảnh đo được ở mục 10 sẽ ra nhịp cắt trung bình — một mình con số độ dài chưa nói lên gì |
| `bit_rate` (tốc độ dữ liệu — bitrate) | Lượng dữ liệu video dùng cho mỗi giây phát, đơn vị thường là bit/giây | Bitrate cao (trên ~8 Mbps ở 1080p) cho hình sắc nét, ít vỡ hạt khi có chuyển động nhanh — hợp phong cách nhiều hiệu ứng dồn dập; bitrate thấp thường do nền tảng nén lại sau khi tải lên, không phản ánh chất lượng gốc nên đừng dùng để đánh giá tay nghề dựng |

## 9. Cắt khung hình — ba cách cho ba mục đích

Ba cách dưới đây có sẵn dạng script PowerShell cho Windows (`scripts/cat_khung_hinh.ps1`, tham số `-CheDo`; câu lệnh gọi script ở phụ lục cuối mục 14). Trên máy Mac chạy câu lệnh ffmpeg ghi dưới mỗi cách (đã chạy thử 27/10/2026 với ffmpeg ở `xuong_thu_hyperframes/bin/`). Phần này giải thích ý tưởng và câu lệnh ffmpeg phía sau mỗi cách, để hiểu script đang làm gì và tự chỉnh khi cần.

### (a) Cắt đều theo nhịp — nhìn tổng thể mạch video

Lấy 1 khung hình sau mỗi khoảng thời gian cố định (ví dụ mỗi 0,5 giây), trải đều từ đầu đến cuối video. Dùng khi muốn lướt nhanh toàn bộ video mẫu mà không phải xem lại từng giây.

```bash
"$FFMPEG" -y -i "duong_dan_video.mp4" -vf "fps=1/0.5" -q:v 2 "thu_muc_ra/deu_%04d.jpg"
```
Cắt 1 khung mỗi 0,5 giây, lưu vào `thu_muc_ra` (tạo trước bằng `mkdir -p`), đặt tên `deu_0001.jpg`, `deu_0002.jpg`...

Câu lệnh ffmpeg thuần phía sau bản PowerShell (tham khảo):
```
ffmpeg -i video.mp4 -vf "fps=1/0.5" -q:v 2 deu_%04d.jpg
```

### (b) Cắt dày trong một đoạn ngắn — soi kỹ một hiệu ứng

Lấy nhiều khung hình mỗi giây (ví dụ 12 hình/giây) nhưng chỉ trong một đoạn thời gian ngắn (ví dụ 3 giây). Dùng khi đã thấy một hiệu ứng chuyển động đáng chú ý (chữ bay vào, hình phóng to...) qua cách (a) và muốn xem từng bước hiệu ứng đó diễn ra thế nào.

```bash
"$FFMPEG" -y -ss 5 -i "duong_dan_video.mp4" -t 3 -vf "fps=12" -q:v 2 "thu_muc_ra/day_%04d.jpg"
```
Cắt 12 hình/giây trong 3 giây, bắt đầu từ giây thứ 5 — ra khoảng 36 khung hình.

### (c) Cắt tại điểm đổi cảnh — biết nhịp cắt của video

Đây là cách quan trọng nhất để học phong cách, vì **nhịp cắt là thứ quyết định cảm giác gấp gáp hay thong thả của cả video** (xem mục 1 của file này, hàng "nhịp cắt"). Thay vì cắt theo thời gian cố định, ffmpeg tự dò những chỗ khung hình đổi khác nhiều (scene change — đổi cảnh) và chỉ cắt đúng những chỗ đó.

```bash
"$FFMPEG" -y -i "duong_dan_video.mp4" -vf "select='gt(scene,0.3)',showinfo" -vsync vfr "thu_muc_ra/doicanh_%04d.jpg" 2> thu_muc_ra/log.txt
grep -o "pts_time:[0-9.]*" thu_muc_ra/log.txt
```
Cắt tại mọi điểm đổi cảnh vượt ngưỡng nhạy 0,3; lệnh `grep` in ra danh sách mốc thời gian (`pts_time`) để tính nhịp cắt trung bình (xem mục 10). Script PowerShell tự tính bước này.

Ngưỡng (`0.3` trong `gt(scene,0.3)`, tham số `-NguongDoiCanh` của script PowerShell) nhận giá trị từ 0 đến 1: càng thấp càng bắt nhiều điểm (kể cả đổi cảnh nhẹ, ví dụ lia máy chậm), càng cao càng chỉ bắt đổi cảnh mạnh (cắt cứng sang khung hoàn toàn khác). Video không ra đủ mốc thì thử hạ ngưỡng xuống 0,2 hoặc 0,15.

## 10. Đo nhịp cắt từ danh sách mốc đổi cảnh

Chạy cách (c) ở mục 9 xong sẽ có một dãy mốc thời gian, ví dụ: `1.2, 2.9, 4.1, 7.5` (giây). Cách tính và đọc kết quả — script đã tự làm bước này, dưới đây là để hiểu con số đến từ đâu:

1. Tính khoảng cách giữa hai mốc liền nhau: `2.9-1.2=1.7`, `4.1-2.9=1.2`, `7.5-4.1=3.4`.
2. Lấy trung bình các khoảng cách đó: `(1.7+1.2+3.4)/3 ≈ 2.1` giây/lần đổi cảnh.
3. Đọc ý nghĩa con số trung bình:

| Nhịp cắt trung bình | Cảm giác | Thường hợp nội dung |
|---|---|---|
| Dưới 1,5 giây/lần | Nhanh, dồn dập | Tin nóng, review sản phẩm, nội dung nhiều thông tin dồn ép thời gian ngắn |
| 1,5 – 3 giây/lần | Vừa phải | Nội dung giải thích phổ thông, đa số video ngắn dọc hiện nay |
| Trên 3 giây/lần | Thong thả | Nội dung cần người xem suy ngẫm, phỏng vấn, giải thích khái niệm sâu |

Nhịp cắt đo được nên ghi thẳng vào ô "nhịp cắt" của thẻ phong cách (`tai_san/so_tay_gu/_mau_the_phong_cach.md`, xem mục 4 của file này).

## 11. Lấy bảng màu chủ đạo từ khung hình đã cắt

Ý tưởng: mở một khung hình đã cắt ở mục 9, thu nhỏ ảnh rồi gom các pixel (điểm ảnh) gần màu nhau lại thành một số nhóm màu giới hạn (color quantization — lượng tử hóa màu) bằng thư viện Pillow, từ đó suy ra vài mã màu đại diện nhất cho khung hình đó.

```python
from PIL import Image

def mau_chu_dao(duong_dan_anh, so_mau=5):
    anh = Image.open(duong_dan_anh).convert("RGB")
    anh_nho = anh.resize((150, 150))
    anh_luong_tu = anh_nho.quantize(colors=so_mau, method=Image.MAXCOVERAGE)
    bang_mau = anh_luong_tu.getpalette()
    so_luong = anh_luong_tu.getcolors()
    so_luong.sort(reverse=True)
    ket_qua = []
    for dem, chi_so in so_luong[:so_mau]:
        r, g, b = bang_mau[chi_so*3 : chi_so*3+3]
        ket_qua.append("#%02x%02x%02x" % (r, g, b))
    return ket_qua

print(mau_chu_dao("thu_muc_ra/deu_0001.jpg"))
```
Trả về danh sách mã màu hex (ví dụ `['#1a1a2e', '#e94560', '#ffffff', ...]`) xếp theo diện tích chiếm nhiều nhất trước — mã đầu tiên thường là màu nền, các mã sau là màu chữ/màu nhấn.

Chạy trên vài khung hình khác nhau (đầu, giữa, cuối video, hoặc mỗi khung ở cách (a) mục 9) rồi so mã màu lặp lại nhiều lần — đó chính là bảng màu chủ đạo của cả video, không phải màu của riêng một khung.

## 12. Dựng dải khung hình thành một ảnh để nhìn mạch video trong một liếc

Ghép nhiều khung hình đã cắt (từ cách (a) mục 9) cạnh nhau thành một ảnh lưới (contact sheet — dải ảnh xem nhanh), thay vì mở từng file riêng lẻ:

```bash
"$FFMPEG" -y -i "thu_muc_ra/deu_%04d.jpg" -vf "scale=180:-1,tile=3x2" -frames:v 1 "thu_muc_ra/dai_khung.jpg"
```
Thu nhỏ mỗi khung về chiều rộng 180 pixel rồi xếp thành lưới 3 cột × 2 hàng (đổi `3x2` thành số khác nếu số khung nhiều/ít hơn 6) — ra một file `dai_khung.jpg` duy nhất chứa cả 6 khung.

Ảnh dải này là thứ nên đưa cho Claude xem trước tiên (xem nguyên tắc chi phí ở mục 13) — nhìn một ảnh mà thấy được mạch cả video, thay vì tốn token mở từng khung riêng.

## 13. Nguyên tắc chi phí — quan trọng, đọc kỹ trước khi cắt

Mỗi ảnh Claude nhìn (đọc) tốn khoảng **1.500-2.000 token**. Cắt một video 30 giây ở nhịp dày 12 hình/giây ra tới 360 khung — nếu đưa hết cho Claude xem sẽ tốn ngót nửa triệu token chỉ để xem một video mẫu, trong khi phần lớn khung hình gần như giống hệt khung liền trước.

**Nguyên tắc bắt buộc:** cắt THƯA để nắm mạch tổng thể (cách (a), hoặc tốt hơn là ghép thành một ảnh dải theo mục 12), CHỈ cắt DÀY (cách (b)) ở đúng đoạn thật sự cần soi kỹ một hiệu ứng cụ thể — và khi soi dày, cũng chỉ cần xem vài khung đại diện trong đoạn đó (đầu, giữa, cuối hiệu ứng) chứ không cần xem hết 36 khung của 3 giây. Đừng cắt hàng trăm khung rồi đọc hết.

## 14. Bảng tóm tắt — muốn biết gì thì dùng cách nào

| Muốn biết | Dùng cách | Mục |
|---|---|---|
| Video này khung dọc hay ngang, mượt hay giật khi phát | Đọc thông số bằng ffprobe | 8 |
| Mạch video trải qua những gì từ đầu đến cuối | Cắt đều (a) + ghép dải ảnh | 9(a), 12 |
| Một hiệu ứng chuyển động cụ thể làm thế nào | Cắt dày (b) đúng đoạn đó | 9(b) |
| Nhịp cắt nhanh hay chậm, dồn dập hay thong thả | Cắt tại điểm đổi cảnh (c) + tính khoảng cách trung bình | 9(c), 10 |
| Bảng màu chủ đạo | Đo màu bằng Pillow trên vài khung đại diện | 11 |
| Xem nhanh toàn video mà không tốn nhiều token | Ghép dải ảnh, xem 1 ảnh thay vì nhiều ảnh rời | 12, 13 |

### Phụ lục: bản PowerShell cho máy Windows (giữ nguyên chữ cũ, chỉ chạy được trên Windows)

Kịch bản PowerShell đi kèm file này: `scripts\cat_khung_hinh.ps1` — gói sẵn 3 cách cắt khung hình ở mục 9, chạy trực tiếp không cần nhớ câu lệnh ffmpeg dài. Chạy `Get-Help .\scripts\cat_khung_hinh.ps1 -Full` hoặc mở file để xem chú thích và ví dụ.

**Trên máy Mac hiện tại (ghi 26/10/2026):** script `.ps1` không chạy được vì máy không có PowerShell, cũng không có ffmpeg hệ thống. Dùng ffmpeg đi kèm Remotion, ví dụ `DYLD_LIBRARY_PATH=xuong/node_modules/@remotion/compositor-darwin-arm64 xuong/node_modules/@remotion/compositor-darwin-arm64/ffmpeg -ss <giây> -i <video> -frames:v 1 <ảnh>.jpg`. Bản ffmpeg này rút gọn, thiếu bộ lọc `fps`, `select`, `tile`, nên cắt từng khung bằng `-ss` như `scripts/soat_khung_mp4.py` (cắt đều theo bước giây và ghép bảng 4×4). Câu lệnh ở mục 3 dùng bộ lọc đó chỉ chạy được với ffmpeg đầy đủ.

Tải video (mục 7) — đặt thư mục lưu:

```powershell
New-Item -ItemType Directory -Force -Path "tai_san\so_tay_gu\mau_tham_khao\<ten_phong_cach_khong_dau>"
```

Cắt khung (mục 9):

```powershell
.\scripts\cat_khung_hinh.ps1 -Video "duong_dan_video.mp4" -ThuMuc "thu_muc_ra" -CheDo deu -NhipGiay 0.5
```

```powershell
.\scripts\cat_khung_hinh.ps1 -Video "duong_dan_video.mp4" -ThuMuc "thu_muc_ra" -CheDo day -BatDau 5 -ThoiLuong 3 -FpsDay 12
```

```powershell
.\scripts\cat_khung_hinh.ps1 -Video "duong_dan_video.mp4" -ThuMuc "thu_muc_ra" -CheDo doicanh -NguongDoiCanh 0.3
```

Dải khung (mục 12):

```powershell
ffmpeg -i "thu_muc_ra\deu_%04d.jpg" -vf "scale=180:-1,tile=3x2" "thu_muc_ra\dai_khung.jpg"
```

## 15. Học từ một bộ sưu tập video (cách đã làm với repo awesome-opus5-5-videos, 27/10/2026)

Dùng khi Trung đưa một bộ sưu tập nhiều video (ví dụ một repo GitHub liệt kê hàng trăm video kèm prompt) và muốn ghi nhận kỹ thuật, phong cách, tông màu, hiệu ứng của cả bộ vào Media. Khác mục 2: mục 2 học một mẫu Trung thích rồi rút một thẻ; mục này duyệt hàng chục đến hàng trăm mẫu và gom thành giá trị cho các trục dựng, thư viện thủ pháp và cách làm, không rút thẻ riêng cho từng mẫu. Đã chạy với repo `yihui-dev/awesome-opus5-5-videos` (703 prompt, 100 mục nêu bật); dữ liệu và kết quả ở `tai_san/hoc_tu_repo/awesome_opus55/`.

**Các bước đã làm:**

1. **Chốt phạm vi với Trung** (27/10/2026, qua bảng chọn): chấm bằng hình 100 mục nêu bật và quét chữ toàn bộ 703 prompt; ghi nhận vào hệ năm trục dựng cộng hai thư viện ngoài trục (cách làm mã LM, thủ pháp và hiệu ứng mã TP), không tạo thẻ D mới.
2. **Tải video gốc và bản làm lại** của từng mục (`original.mp4`, `remake.mp4` ở `https://media.skillry.dev/opus-5-5/<slug>/`) bằng `curl` về thư mục tạm ngoài git; kiểm kích thước, khung hình mỗi giây và độ dài bằng ffprobe (mục 8). Chỉ tải khi Trung đã xác nhận (mục 7); video của tác giả không vào git, chỉ lưu link.
3. **Cắt 6 khung đều nhau** từ mỗi video bằng ffmpeg đầy đủ (`xuong_thu_hyperframes/bin/ffmpeg`, mục 6): khung thứ i (i từ 0 đến 5) lấy ở thời điểm (i + 0,5)/6 độ dài video, thu nhỏ về cao 270 điểm ảnh, ghép một hàng bằng bộ lọc `hstack` thành một dải `<slug>_original.jpg` (và `<slug>_remake.jpg`). Một ảnh dải thay cho sáu ảnh rời, theo nguyên tắc chi phí ở mục 13.
4. **Giao tác tử con chấm.** 74 mục đầu chia ba lô (24, 25, 25 mục), mỗi lô một tác tử con; 26 mục cảnh 3D và game chấm thành lô thứ tư. Mỗi tác tử xem dải khung và đọc prompt rồi điền 15 tiêu chí vào JSON: thành phẩm, phong cách, họ (nhóm), bản làm lại giống gốc đến đâu, đầu vào cần có, công cụ nhắc đến, đường xuất video, độ khó, ước số dòng mã, tải kết xuất, điểm hợp Media (0 đến 3), gần tông nào của Media, thủ pháp đáng học, rủi ro, có dùng làm mẫu được không. Kết quả gộp ở `tai_san/hoc_tu_repo/awesome_opus55/`.
5. **Quét chữ 703 prompt** theo sáu khoá: công cụ xuất, kỹ thuật hình, âm thanh, quy trình, cách viết prompt, phong cách tham chiếu.
6. **Phiên chính xem lại các mục chủ chốt** (mục điểm hợp Media cao, mục có kết luận lạ) trên chính dải khung, sửa kết quả của tác tử con khi lệch. Kết quả chấm bằng hình là nhận định của tác tử, không phải số đo.
7. **Gom thủ pháp.** Từ trường thủ pháp đáng học của 100 mục và hai khoá kỹ thuật hình, âm thanh của bản quét chữ, gom thành giá trị mới cho các trục (trạng thái nháp, mã cụ thể ở `tai_san/so_tay_gu/he_truc_dung.md`), thư viện thủ pháp TP (`06_thu_phap_va_hieu_ung.md`, `tai_san/thu_phap/`), cách làm LM (`05_cach_lam.md`) và khuôn prompt (`07_khuon_prompt_va_kiem_chat_luong.md`, `tai_san/khuon_prompt/`). Màu của tông mới đo bằng máy trên khung hình (Pillow, mục 11), ghi mã hex; không ước bằng mắt.

**Ràng buộc bản quyền** (mục 4 và `13_ban_quyen_va_bao_mat.md`): không chép nguyên văn prompt dài của tác giả vào Media; trích tối đa 20 chữ, phần còn lại trỏ link `https://github.com/yihui-dev/awesome-opus5-5-videos/blob/main/prompts/<slug>.md`. Video chỉ lưu link (`https://media.skillry.dev/opus-5-5/<slug>/original.mp4`, `remake.mp4`). Khung hình cắt chỉ để học trong máy, không đăng lại.
