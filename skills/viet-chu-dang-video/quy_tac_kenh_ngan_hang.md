# Quy tắc chữ đăng kênh Chuyện nghề Ngân hàng

> Trung chốt 30/10/2026 qua bốn lượt bảng chọn (16 điểm), thêm điểm 17 (cách nối với hình thu nhỏ, mục 6) chuyển qua phiên điều phối loạt cùng ngày. Áp cho mọi video của kênh Chuyện nghề Ngân hàng (loạt 64 video thuật ngữ ngân hàng và video sau này của kênh). Điểm nào file này nói thì **thay** quy tắc chung trong `SKILL.md` và `quy_dinh_nen_tang.md` mục 1 (vốn viết cho kênh Chuyện nghề Điện); điểm nào file này không nói thì vẫn theo quy tắc chung.
> Video thuộc kênh này khi khối `thong_tin` của `youtube.md` có `"kenh": "ngan_hang"`, hoặc `tai_nguyen/dang_bai/hinh_thu_nho.json` có `"kenh": "ngan_hang"`. `kiem_chu_dang.py` đọc trường này và áp đúng bộ kiểm.
> Người xem: người mới vào nghề ngân hàng và người đi vay. Kênh giáo dục, cung cấp thông tin, không giật gân.

## 1. Tiêu đề YouTube

**Thuật ngữ đứng đầu câu**, chọn một trong ba mẫu theo nội dung video:

| Mẫu | Dùng cho | Ví dụ viết thật cho loạt |
|---|---|---|
| 1. `<Thuật ngữ> là gì? <ý phụ>` | Video giải thích một thuật ngữ | COF - Chi phí vốn của ngân hàng là gì? · Nhóm nợ là gì, phân biệt nợ nhóm 1, nợ nhóm 2 ... nợ xấu |
| 2. `Phân biệt <A> và <B>` hoặc `<A> và <B> khác nhau thế nào?` | Video một cặp hay bị nhầm | Phân biệt giữa cầm cố và thế chấp - không phải ai cũng biết · Phân biệt hạn mức quay vòng và hạn mức không quay vòng |
| 3. `<Thuật ngữ>: vì sao / bao nhiêu / khi nào …` | Video nghịch lý, con số, quy trình, nghề | Các vị trí trong ngân hàng: một hồ sơ vay đi qua những ai? |

- **Chữ viết tắt tiếng Anh đứng trước, gạch nối, rồi tên tiếng Việt**: `COF - Chi phí vốn …`, `LTV - Tỷ lệ cho vay trên giá trị tài sản là gì?`, `CASA - Tiền gửi không kỳ hạn là gì?`. Tên tiếng Việt vẫn phải có trong tiêu đề, vì gợi ý tìm kiếm 30/10/2026 cho thấy người ta gõ "chi phí vốn là gì", không gõ "COF" đứng riêng (Trung chọn kiểu này dù đề xuất ban đầu là tiếng Việt trước).
- **Không gắn tên kênh hay tên loạt** vào tiêu đề: tên kênh đã hiện dưới tiêu đề và trên hình thu nhỏ.
- **Viết hoa chữ đầu câu**, tên riêng và chữ viết tắt; không viết Hoa Mỗi Chữ, không IN HOA cụm từ. Hai vế ngăn bằng ` - ` hoặc `:`. Dấu hỏi khi tiêu đề là câu hỏi thật. Không dùng "!!", "??", "...".
- **Độ dài**: nên ≤ 70 ký tự (điện thoại cắt khoảng 60–70), tối đa 100 (giới hạn YouTube).
- **Từ khoá chính**: cụm người ta gõ thật, lấy từ gợi ý tìm kiếm YouTube rồi Google (`goi_y_tu_khoa.py`), nằm trong tiêu đề. Thuật ngữ ngân hàng tiếng Việt thường chỉ ra "<750" lượt mỗi tháng trên vidIQ (kiểm 30/10/2026: "cầm cố và thế chấp", "các vị trí trong ngân hàng"), nên với kênh này chỉ gọi vidIQ cho thuật ngữ rộng (ví dụ "lãi suất", "nợ xấu", "thẻ tín dụng") để giữ credit.
- **Một tiêu đề chính, một tiêu đề dự phòng** (thay quy tắc 3 phương án). Claude đặt tiêu đề chính theo mẫu, ghi dự phòng ở mục `## Phương án tiêu đề dự phòng` cuối `youtube.md`. Trung duyệt theo lô 6–8 video trên một danh sách, chỉ sửa tên không ưng.
- **Tên Trung tự đặt đứng trên quy tắc.** Năm tên Trung đặt 30/10/2026 (dòng "Tiêu đề (Trung đặt …)" đầu kịch bản) giữ nguyên kể cả khi lệch nhẹ: "Tại sao tiền gửi 13 tháng lại khác biệt nhiều so với gửi 12 tháng", "Nhóm nợ là gì, phân biệt nợ nhóm 1, nợ nhóm 2 ... nợ xấu", "Phân biệt hạn mức quay vòng và hạn mức không quay vòng", "Phân biệt giữa cầm cố và thế chấp - không phải ai cũng biết", "COF - Chi phí vốn của ngân hàng là gì?". Bảng kiểm chỉ NHẮC (không báo lỗi) với tên dài hơn 70 ký tự hoặc có "...".

## 2. Mô tả YouTube

Thứ tự khối, mỗi khối cách nhau một dòng trống:

1. **Một đoạn văn 50–70 từ** (như quy tắc chung): câu đầu mở bằng thuật ngữ và chứa từ khoá chính, nói video trả lời câu hỏi gì; câu sau kể gọn các ý chính theo thứ tự trong video.
2. **Mốc chương, gộp còn 5–8 mốc** (khác kênh Điện, kênh Điện bỏ mốc). Mốc đầu `00:00`, tăng dần, mỗi chương từ 10 giây; mỗi mốc trùng đầu một chương trong `thoi_gian.json` của mã dựng (gộp chương ngắn liền nhau); tên mốc 3–8 từ, có thuật ngữ, viết cho người xem đọc (không chép tên chương dựng nếu khó hiểu khi đứng riêng).
3. **Dòng hashtag**: 2–3 hashtag chủ đề rồi `#nganhang #chuyennghenganhang` (tổng ≤ 5, không dấu, chữ thường).
4. **Khối "Xem tiếp:"** (Trung chốt: có trỏ link, xử lý sau). Tối đa 2 video cùng kênh, lấy từ ghi chú "Nối loạt" đầu kịch bản. Chỉ thêm khi video được trỏ tới đã công khai; thêm bằng `cap_nhat_youtube.py` sau mỗi đợt đăng. Lúc viết chữ đăng lần đầu thì bỏ khối này.
5. **Chân mô tả kênh**: khối `chan_mo_ta_ngan_hang` trong `chan_mo_ta.md` (YouTube `@chuyennghenganhang`, Facebook `chuyennghenganhang`).

Nội dung:
- **Không nêu văn bản pháp luật** (nghị định, thông tư, luật, số hiệu), giống kênh Điện, dù video có ghi số hiệu trên hình (Trung chốt giữ quy tắc chung). Không đưa nguồn vào bình luận ghim.
- **Số giả định chỉ nêu khi đi liền chữ "ví dụ" hoặc "giả sử"** trong cùng câu; không thêm dòng ghi chú riêng.
- **Bảo mật của loạt**: không tên, logo, màu nhận diện của ngân hàng thật; video so sánh ngân hàng chỉ nói theo nhóm; không chữ "tờ trình", "nội bộ" (từ cấm của `kiem_chu_dang.py`).

Mẫu khối (video cầm cố và thế chấp):

```text
Cầm cố và thế chấp đều là cách dùng tài sản để bảo đảm khoản vay … (đoạn 50–70 từ)

00:00 Cầm sổ đỏ là thế chấp hay cầm cố?
00:15 Thế chấp là gì, cầm cố là gì
…

#thechap #camco #vaynganhang #nganhang #chuyennghenganhang

Xem thêm những thông tin thú vị về ngân hàng và đi vay tại:
🔹 YouTube: https://www.youtube.com/@chuyennghenganhang
🔹 Facebook: https://www.facebook.com/chuyennghenganhang
```

## 3. Thẻ YouTube

Như quy tắc chung: từ khoá chính, chữ viết tắt (nếu có), biến thể gợi ý tìm kiếm, một hai bản không dấu cho từ hay gõ sai; không thẻ không liên quan, không tên ngân hàng thật.

## 4. Facebook và TikTok

- **Tiêu đề giống hệt tiêu đề YouTube.** Bảng kiểm nhắc khi khác.
- **Chú thích viết riêng, 1–3 câu**: câu đầu mở bằng thuật ngữ; không mốc chương; không link trong phần nội dung; số giả định kèm "ví dụ". Hashtag Facebook ≤ 5, TikTok ≤ 3, luôn có `#chuyennghenganhang`. Chú thích Facebook có chân mô tả kênh ở cuối (như kênh Điện).
- **Video chỉ có bản ngang: vẫn viết sẵn `facebook.md`** cùng lượt với `youtube.md`, dòng đầu ghi "Chờ bản dọc `_reels_`: chưa đăng". Không đăng bản ngang lên Trang (giữ quy tắc chung). Khi có bản dọc 30–90 giây thì đọc lại chú thích, sửa nếu bản dọc chỉ lấy một chương. Bảng kiểm sẽ NHẮC "chưa có video nền tảng đó", không phải lỗi.

Mẫu (video cầm cố và thế chấp):

```text
facebook · tieu_de:  Phân biệt giữa cầm cố và thế chấp - không phải ai cũng biết
facebook · chu_thich:
Cầm cố và thế chấp khác nhau ở chỗ ai giữ tài sản: thế chấp thì tài sản ở lại với bạn, cầm cố thì tài sản đi sang bên cho vay. …
#thechap #camco #vaynganhang #nganhang #chuyennghenganhang
<chân mô tả kênh Ngân hàng>
```

## 5. Tiêu đề đi cặp với chữ trên hình thu nhỏ

Áp cùng mục 0b của `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md`:
- **Dòng 1 của hình là đúng thuật ngữ ở đầu tiêu đề**, in hoa. Tiêu đề mở bằng chữ viết tắt thì dòng 1 là chữ viết tắt (tiêu đề "COF - Chi phí vốn …" → dòng 1 "COF"). Tiêu đề mẫu 2 thì dòng 1 là cặp thuật ngữ ("CẦM CỐ ≠ THẾ CHẤP").
- **Dòng 2 bổ sung**, không chép nguyên phần còn lại của tiêu đề: ý chính hoặc câu hỏi ngắn ("khác nhau ở đâu?").
- Khi Trung đổi tiêu đề, kiểm lại dòng 1 của hình; lệch thì nhắn phiên làm hình thu nhỏ, phiên chữ đăng không tự sửa hình.

## 6. Thứ tự làm cho loạt

1. **Lượt 1, tiêu đề cả loạt**: đặt tiêu đề chính và dự phòng cho mọi video đã có kịch bản (khoảng 33 video ngày 30/10/2026), ghi vào `tai_nguyen/dang_bai/youtube.md` (chỉ ô `tieu_de`, khối `thong_tin`, mục dự phòng), Trung duyệt theo lô, phiên hình thu nhỏ dùng ngay.
2. **Lượt 2, mô tả, thẻ, chú thích**: video đã có bản cuối trước (8 video ngày 30/10/2026), rồi từng video khi có bản cuối (mốc chương lấy từ bản cuối).
3. **Sau mỗi đợt đăng**: thêm khối "Xem tiếp:" cho video đã có video đích công khai.

Chỉ làm khi Trung bảo (quyết định giao việc 30/10/2026: phiên lập quy tắc chỉ viết thử 2 video).

**Video làm mới** (Trung chốt 30/10/2026, kế hoạch loạt mục 1 dòng "Tên, mô tả, hình thu nhỏ"): phiên làm video tự viết tiêu đề, mô tả, chú thích theo file này ngay khi giao bản nháp (`youtube.md`, `facebook.md`, chạy `kiem_chu_dang.py` tới 0 lỗi), rồi làm hình thu nhỏ theo `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md` mục 0b với chữ khớp tiêu đề vừa viết (mục 5). Không chờ việc riêng. Mốc chương viết theo bản nháp; khi có bản cuối mà mốc lệch thì bảng kiểm nhắc, sửa lại.

**Video đã có trước 30/10/2026**: phiên chữ đăng viết xong `youtube.md`, `facebook.md` (đã qua bảng kiểm) của video nào thì nhắn phiên làm hình thu nhỏ một dòng (gom vài video một tin được): thư mục video, tiêu đề YouTube đã chốt, chữ đề xuất cho hai dòng của hình (mục 5). Video đã có hình mà tiêu đề mới làm dòng 1 lệch thì ghi rõ trong tin. Tám video đã có hình ngày 30/10/2026: N128, N97, N101, N112, N120, N95, N126, N129.

## 7. Khối `thong_tin` của `youtube.md`

```json
{
 "ma_youtube": "<mã sổ nợ viết thường, ví dụ n97>",
 "kenh": "ngan_hang",
 "tu_khoa_chinh": "<cụm từ>",
 "madeForKids": false,
 "containsSyntheticMedia": false,
 "giong_may": true,
 "nhan_ai_tiktok": false,
 "nhan_ai_facebook": true,
 "playlistTitles": []
}
```

Giọng Quốc Tuấn là VieNeu nên `giong_may: true`, `nhan_ai_facebook: true`; hình dựng bằng HTML, Remotion không phải cảnh AI tả thực nên `containsSyntheticMedia: false` (quy tắc chung 27/10/2026).

## 8. Việc còn mở (chưa chốt, không thuộc quy tắc)

- Danh sách phát: đã chốt 02/11/2026, xem mục 10. Ô `playlistTitles` trong khối `thong_tin` không dùng cho kênh này; nguồn là `du_lieu/dang_youtube/danh_sach_phat_ngan_hang.json`.
- Danh mục YouTube: `xuat_ke_khai.py` đặt cứng 28 (Khoa học và công nghệ) theo kênh Điện; kênh Ngân hàng có thể hợp 27 (Giáo dục). Hỏi Trung trước lần đăng đầu.
- `cap_nhat_youtube.py` sửa video kênh Ngân hàng bằng `--khoa ~/.config/dang-youtube/ngan_hang --kenh UCPhmM6_u0fTr5mWcpJiNm-w` (thêm 30/10/2026). `xuat_ke_khai.py` đặt cứng danh mục 28: đổi `categoryId` thành 27 trong file sinh ra trước khi chạy. Khối "Xem tiếp:" đợt đầu: 37 video, 30/10/2026, bảng ở `du_lieu/dang_youtube/cap_nhat_2026.10.30_xem_tiep_ngan_hang.json`.
- Mã kênh YouTube (`UC…`) của kênh Ngân hàng chưa ghi ở `chien_dich.json`.

## 9. Biên bản quyết định (30/10/2026)

| # | Nội dung đã chốt | Khác gì với đề xuất ban đầu | Ảnh hưởng tới đâu |
|---|---|---|---|
| 1 | Thuật ngữ đầu câu, 3 mẫu câu | Trùng đề xuất | Mọi tiêu đề kênh; `kiem_chu_dang.py` không kiểm mẫu, Trung duyệt |
| 2 | Viết tắt trước, gạch nối, tên tiếng Việt sau | Đề xuất là tiếng Việt trước, (viết tắt) sau | Tiêu đề video có chữ viết tắt (COF, LTV, CASA, LDR, NIM, CIC…); dòng 1 hình thu nhỏ là chữ viết tắt |
| 3 | Không gắn tên kênh, tên loạt | Trùng | Tiêu đề |
| 4 | Mô tả không nêu văn bản pháp luật | Đề xuất là thêm một dòng "Căn cứ" | Giữ kiểm pháp lý của script (riêng kênh này chỉ bắt "quyết định số", không bắt chữ "quyết định" thường) |
| 5 | Mốc chương gộp 5–8 mốc | Trùng đề xuất; khác quy tắc chung (bỏ mốc) | Script cho phép mốc với kênh này, báo lỗi ngoài 5–8 mốc, nhắc mốc không trùng đầu chương |
| 6 | Số giả định kèm chữ "ví dụ" | Trùng | Mô tả, chú thích |
| 7 | Có link video liên quan, xử lý sau | Đề xuất là thêm ngay khi video kia công khai; Trung để sau | Khối "Xem tiếp:" thêm sau đợt đăng; script cho phép link trong khối này |
| 8 | Hashtag: 2–3 chủ đề + `#nganhang #chuyennghenganhang` | Trùng | Script báo lỗi khi thiếu hai hashtag cuối |
| 9 | Viết sẵn `facebook.md`, ghi chờ bản dọc | Trùng | Không đăng bản ngang lên Trang |
| 10 | Facebook, TikTok cùng tiêu đề, chú thích riêng 1–3 câu | Trùng | Script nhắc khi tiêu đề khác, khi quá 3 câu; lỗi khi thiếu `#chuyennghenganhang` |
| 11 | Hình thu nhỏ: dòng 1 = thuật ngữ đầu tiêu đề, dòng 2 bổ sung | Trùng | Hình video COF bản 1 có dòng 1 "CHI PHÍ VỐN" lệch tiêu đề "COF - …": phiên hình thu nhỏ đã làm bản 2 "COF / Chi phí vốn là gì?" (30/10/2026) |
| 17 | Video làm mới: phiên làm video tự viết chữ đăng rồi làm hình ngay khi giao bản nháp; video cũ: phiên chữ đăng nhắn phiên hình thu nhỏ tiêu đề và chữ đề xuất | Trung chốt sau qua phiên điều phối | Mục 6 |
| 12 | Chân mô tả: YouTube `@chuyennghenganhang`, Facebook `chuyennghenganhang` | Đề xuất để trống dòng YouTube; Trung đưa địa chỉ | Khối `chan_mo_ta_ngan_hang` trong `chan_mo_ta.md` |
| 13 | Viết hoa chữ đầu câu, ≤ 70 ký tự | Trùng | Script nhắc khi > 70 |
| 14 | Giữ nguyên 5 tên Trung đặt | Trùng | Không sửa hình, kịch bản |
| 15 | Một tiêu đề chính + một dự phòng, duyệt theo lô | Trùng; khác quy tắc chung (3 phương án) | Mục `## Phương án tiêu đề dự phòng` trong `youtube.md` |
| 16 | Tiêu đề cả loạt trước, mô tả theo bản cuối | Trùng | Thứ tự mục 6 |

## 10. Danh sách phát (Trung chốt 02/11/2026)

Mười lăm danh sách, công khai, nguồn duy nhất `du_lieu/dang_youtube/danh_sach_phat_ngan_hang.json` (tên, mô tả, thứ tự mã video). Ba danh sách lối vào theo người xem: "Vay ngân hàng cho người mới: cần biết gì trước khi ký", "Doanh nghiệp làm việc với ngân hàng: vay vốn, bảo lãnh, thanh toán quốc tế", "Ôn thi ngân hàng: kiến thức nền và lộ trình nghề". Mười hai danh sách nghiệp vụ, mỗi video đúng một: khoản vay; quy trình vay vốn; tài sản bảo đảm; nợ xấu và tuân thủ; thanh toán quốc tế và tài trợ thương mại; bảo lãnh; ngoại hối và tỷ giá; tiền gửi và giấy tờ có giá; thẻ và thanh toán; chỉ số ngân hàng; Ngân hàng Nhà nước và chính sách tiền tệ; nghề ngân hàng. Mô tả video có dòng "Xem cả loạt: <đường dẫn danh sách nghiệp vụ>" ngay trên dòng hashtag (`them_xem_ca_loat.py`). Video mới: thêm mã vào file cấu hình trước khi xuất kê khai. Cách chạy: skill `dang-youtube` mục "Danh sách phát".

| # | Nội dung đã chốt | Khác gì với đề xuất ban đầu | Ảnh hưởng tới đâu |
|---|---|---|---|
| 1 | 3 danh sách lối vào (tách khách cá nhân và doanh nghiệp) + 12 danh sách nghiệp vụ | Trùng đề xuất | 15 danh sách trên kênh, khoảng 7.400 đơn vị hạn mức lần đầu |
| 2 | Tên và thứ tự video như bản Claude trình | Đề xuất của phiên điều phối chưa có tên cụ thể cho 12 danh sách nghiệp vụ và chưa xếp thứ tự trong từng danh sách | File cấu hình; đổi tên phải sửa file cấu hình rồi chạy script |
| 3 | Công khai ngay | Trùng đề xuất | 4 video riêng tư nằm trong danh sách nhưng người ngoài không thấy tới khi video công khai |
| 4 | Tự viết script `danh_sach_phat.py`, chạy ngay | Không dùng yutu (đăng nhập lỗi) | Script dùng lại cho mọi lô sau |
| 5 | Thêm dòng "Xem cả loạt" cho 80 video, đẩy lên kênh sau 15 giờ ngày 02/11 | Trùng đề xuất | Sửa ô mô tả trong 80 file `youtube.md`, khoảng 4.100 đơn vị hạn mức |
| 6 | Vẫn tạo đủ 15, kể cả danh sách 3 video (Nghề ngân hàng, Bảo lãnh, Thẻ) | Claude đề xuất bỏ danh sách Nghề vì trùng danh sách Ôn thi | Nghề ngân hàng là tập con của Ôn thi ngân hàng |
| 7 | Một file cấu hình chung là nguồn duy nhất | Trùng đề xuất | `xuat_ke_khai.py` đọc file này; ô `playlistTitles` của `youtube.md` bỏ không dùng cho kênh |
| 8 | Chưa ghi ý tưởng video riêng cho nhóm thi tuyển | Claude đề xuất ghi 4–5 ý vào sổ nợ | Danh sách Ôn thi vẫn chủ yếu là video kiến thức |
