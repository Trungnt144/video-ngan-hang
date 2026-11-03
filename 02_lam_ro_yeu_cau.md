# 02 — Giao thức làm rõ yêu cầu

> Đọc trước khi bắt tay vào BẤT KỲ yêu cầu media nào của Trung — đây là **bước làm rõ yêu cầu** (bước đầu tiên) của luồng ở `01_quy_trinh_chung.md`, chạy trước cả cửa chọn phong cách kịch bản. Đây là file thi hành cho một yêu cầu Trung tự đặt ra: "Tôi không chuyên về media, mô tả của tôi nhiều khi khó hiểu, hãy hỏi lại thật kỹ để làm rõ yêu cầu."
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-10-27 · đổi tên từ `05_lam_ro_yeu_cau.md` khi dựng lại luồng Media (nội dung giữ nguyên; tên module trỏ chéo sửa theo `_bang_chuyen_module_2026.10.27.md`; chỗ lỗi thời đã nêu trong bản đồ quy trình được sửa bằng chữ).
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-07-28 (tối — nối vào hai cửa chọn phong cách, cập nhật đường dẫn thẻ sau khi kho tách hai ngăn)
> **v1.0** 2026-07-28 · Bản đầu.

## 1. Nguyên tắc nền

Khi Trung mô tả một sản phẩm media, mặc định coi mô tả đó là **chưa đủ để dựng** — không phải vì Trung diễn đạt kém, mà vì ngôn ngữ đời thường (kiểu "làm video về việc này", "cho nó chuyên nghiệp vào") không tự nhiên mang theo các thông số kỹ thuật mà khuôn dựng (Remotion) cần: nhịp cắt cảnh, tông màu, độ dài, kênh phát, mức trang trọng. Người không làm nghề media không có lý do gì phải biết trước những thông số này.

Vì vậy: **hỏi trước khi làm, không làm rồi sửa.** Dựng xong một bản nháp sai hướng tốn thời gian render (xem `09_video_doc_ngan.md` mục 5 — dù bản nháp render nhanh, sửa hướng sau khi đã ra hình luôn chậm hơn hỏi trước 3 câu). Quy trình 6 bước đã có hai cửa duyệt (kịch bản, bản nháp) — giao thức này xử lý *trước* cửa duyệt đầu tiên, để bản kịch bản mang ra duyệt đã đúng hướng ngay từ lần đầu, không phải vì hai cửa duyệt kia không đủ.

## 2. Bộ câu hỏi bắt buộc theo loại việc

Xác định trước tiên yêu cầu của Trung rơi vào loại nào trong bốn loại dưới đây, rồi dùng đúng bộ câu hỏi của loại đó. Không hỏi tràn cả bốn bộ.

### (a) Làm video mới

| Câu hỏi | Hỏi để làm gì |
|---|---|
| Chủ đề này Trung muốn video nói gì trong 1 câu — không phải chủ đề chung chung mà thông điệp cốt lõi? | Khuôn sáu chặng cần một câu "điều bất ngờ nhất" cho chặng mở đầu (mục 4, `03_kich_ban_va_loi_viet.md`). Thiếu câu này, Claude phải tự đoán trọng tâm — dễ lệch. |
| Ai xem video này — đồng nghiệp trong phòng, cả chi nhánh, hay người ngoài ngành? | Quyết mức thuật ngữ chuyên môn dùng được bao nhiêu và độ trang trọng của giọng đọc/chữ trong khung hình. |
| Video này phát ở đâu — Zalo nội bộ hay định đăng công khai sau này? | Quyết mức soát bản quyền/bảo mật áp dụng ngay từ đầu (xem `13_ban_quyen_va_bao_mat.md`) — đổi kênh sau khi đã dựng thì phải rà lại toàn bộ. |
| Có link, số liệu, hay tài liệu nguồn nào không, hay Claude tự soạn nội dung? | Tránh Claude bịa số liệu hoặc diễn giải sai nguồn; nếu có nguồn, kịch bản phải bám sát chứ không "văn vẻ hóa" tự do. |
| Có video nào Trung từng thấy (của mình hoặc người khác) mà muốn nhịp/tông giống vậy không? | Nếu có, chuyển sang hỏi thêm theo mục (c) bên dưới thay vì đoán từ đầu. |
| Thời điểm cần xong là khi nào? | Không ảnh hưởng nội dung dựng, nhưng quyết Claude có nên rút gọn số vòng duyệt hay báo trước rủi ro trễ.

### (b) Sửa video đã có

| Câu hỏi | Hỏi để làm gì |
|---|---|
| Sửa video nào — đưa tên file hoặc đường dẫn trong `san_pham/`? | Tránh Claude sửa nhầm bản, nhất là khi có cả `_nhap` và `_cuoi` cùng ngày. |
| Chỗ nào cần sửa cụ thể — cảnh nào, giây thứ mấy, hay toàn bộ? | Phân biệt "sửa nhỏ rõ ràng" (được phép làm luôn, xem mục 4) với "sửa mà chưa rõ phạm vi" (phải hỏi thêm). |
| Sửa vì sai (chính tả, số liệu, hình che chữ) hay vì muốn đổi phong cách? | Sai thì sửa thẳng; đổi phong cách thì phải áp quy tắc chống đoán bừa ở mục 5 — không tự suy diễn "đổi phong cách" nghĩa là gì. |
| Sửa xong có cần dựng lại từ kịch bản (đổi chữ) hay chỉ chỉnh khâu dựng (đổi màu, đổi nhịp)? | Đổi chữ nghĩa là quay lại cửa duyệt kịch bản; chỉ đổi khâu dựng thì có thể bỏ qua cửa đó — tránh vòng duyệt thừa hoặc thiếu. |

### (c) Học theo một mẫu Trung gửi

| Câu hỏi | Hỏi để làm gì |
|---|---|
| Trong mẫu này, Trung thích nhất điểm nào — nhịp cắt, màu sắc, cách chữ xuất hiện, hay giọng đọc? | Một mẫu tổng thể có 5-6 yếu tố khác nhau; không hỏi thì Claude dễ bắt chước sai yếu tố Trung thực ra không quan tâm. |
| Có điểm nào trong mẫu KHÔNG muốn giống không — ví dụ tốc độ quá nhanh, hoặc chủ đề nhạy cảm? | Học theo không có nghĩa là học theo 100%; tách rõ phần muốn và phần không muốn ngay từ đầu. |
| Mẫu này có bản quyền rõ ràng không, hay chỉ là video Trung tình cờ thấy? | Học cách tổ chức thì hợp lệ, chép lại nguyên khuôn/mã của sản phẩm đã mua thì không — xem `13_ban_quyen_va_bao_mat.md` mục 3. Cần biết nguồn để không phạm ranh giới này. |
| Video của mình sẽ dùng nội dung gì — vẫn là nội dung Trung đưa, chỉ mượn phong cách trình bày? | Xác nhận đây là học phong cách chứ không phải yêu cầu tạo nội dung giống hệt mẫu (khác về bản chất). |
| Có tiện chốt luôn thành một thẻ phong cách để dùng lại không, hay đây chỉ là thử một lần? | Nếu chốt, ghi vào `tai_san/so_tay_gu/` (mục 6) để lần sau không phải hỏi lại từ đầu. |

### (d) Việc chưa rõ thuộc loại nào

Khi Trung mô tả kiểu chung chung ("làm cho tôi cái gì đó về chuyện này", "có video nào hay ho không") mà chưa rõ là (a), (b) hay (c):

| Câu hỏi | Hỏi để làm gì |
|---|---|
| Đây là video hoàn toàn mới, hay sửa một video đã có rồi? | Câu phân loại đầu tiên — trả lời xong mới biết chuyển sang bộ câu hỏi nào ở trên. |
| Trung đang hình dung ra hình ảnh gì trong đầu chưa, hay muốn Claude đề xuất trước? | Nếu Trung chưa hình dung gì, Claude nên đề xuất 1-2 phương án cụ thể để Trung chọn, thay vì hỏi tiếp câu trừu tượng. |
| Việc này có gấp không, hay có thể làm nháp trước rồi tinh chỉnh? | Quyết mức đầu tư thời gian hỏi thêm — gấp thì rút xuống 2-3 câu quan trọng nhất thay vì hỏi đủ bộ. |

Sau khi trả lời xong 2-3 câu phân loại này, chuyển sang đúng bộ câu hỏi (a)/(b)/(c) tương ứng — không dừng ở đây, không tự đoán tiếp.

## 3. Kỹ thuật hỏi cho người không chuyên

Trung không có nghĩa vụ biết thuật ngữ media. Ba quy tắc khi đặt câu hỏi:

**Hỏi bằng ví dụ và lựa chọn, không hỏi thông số trần.** Đừng hỏi "muốn nhịp cắt bao nhiêu giây một cảnh" — hỏi "muốn nhanh gấp gáp như video tin tức thời sự, hay thong thả như video giải thích từng bước?". Đừng hỏi "tông màu HEX nào" — hỏi "muốn tông tối nghiêm túc kiểu tài chính, hay tông sáng gần gũi kiểu mạng xã hội?". Người trả lời chỉ cần chỉ vào cái mình thấy quen, không cần dịch ý mình sang ngôn ngữ kỹ thuật.

**Tối đa 3-4 câu mỗi lượt hỏi, chọn câu nào đoán sai thì hỏng nặng nhất.** Không dội hết bộ 5-6 câu trong bảng cùng lúc — Trung sẽ thấy rườm rà. Ưu tiên câu ảnh hưởng tới hướng dựng cả video (ví dụ: thông điệp cốt lõi, kênh phát) trước, câu ảnh hưởng tiểu tiết (ví dụ: chọn nhạc nền) hỏi sau hoặc để Claude tự đề xuất luôn.

**Luôn kèm phương án đề xuất để Trung chỉ cần gật.** Thay vì hỏi mở "Trung muốn tông màu gì", hỏi kèm đề xuất: "Chủ đề này có vẻ hợp tông tối nghiêm túc — Claude đề xuất vậy, có đồng ý không, hay Trung muốn tông khác?". Cách này giảm gánh nặng phải tự nghĩ câu trả lời từ đầu — Trung chỉ cần xác nhận hoặc sửa.

## 4. Khi nào ĐƯỢC phép không hỏi mà làm luôn

Ba trường hợp sau bỏ qua vòng hỏi, làm thẳng:

1. **Việc lặp lại y hệt lần trước** — cùng chủ đề dạng, cùng phong cách, chỉ đổi nội dung cụ thể (ví dụ: tuần nào cũng làm video điểm tin dạng giống nhau).
2. **Việc sửa nhỏ rõ ràng, phạm vi không mơ hồ** — ví dụ "sửa lỗi chính tả ở giây thứ 12", "đổi số liệu quý 2 thành quý 3". Không đụng tới phong cách hay hướng nội dung.
3. **Đã có thẻ phong cách chốt sẵn trong `tai_san/so_tay_gu/`** khớp với yêu cầu hiện tại — dùng thẳng thẻ đó, chỉ hỏi phần nội dung mới (thông điệp, nguồn số liệu) chứ không hỏi lại phần phong cách đã chốt.

Ngoài ba trường hợp này, mặc định quay lại mục 2.

**Vòng hỏi này KHÔNG thay thế hai cửa chọn phong cách** ở cửa chọn 1 và cửa chọn 2 của luồng (`01_quy_trinh_chung.md`). Hai việc khác nhau: mục 2 ở đây hỏi để biết *làm cái gì* (thông điệp, người xem, kênh phát, nguồn số liệu); cửa chọn hỏi để Trung quyết *làm theo lối nào*. Hỏi rõ xong mới có căn cứ lọc ra 2–3 phong cách hợp mà đề xuất — đó là lý do bước làm rõ yêu cầu chạy trước.

## 5. Quy tắc chống đoán bừa

Gặp từ mơ hồ kiểu "đẹp hơn", "chuyên nghiệp hơn", "giống video kia", "sinh động hơn" — **PHẢI hỏi cụ thể đẹp ở điểm nào**, không tự suy diễn rồi làm.

Đây là bài học thật, không phải quy tắc lý thuyết: đã từng có lần Claude nhận phản hồi "đẹp hơn" và hiểu thành đổi cả hướng dựng (đổi tông màu, đổi nhịp cắt, đổi cách chữ xuất hiện), trong khi Trung thực ra chỉ chê một chi tiết nhỏ (ví dụ một khung chữ bị lệch). Kết quả là dựng lại gần như từ đầu cho một việc lẽ ra sửa 5 phút là xong.

Cách hỏi lại đúng: đưa ra 2-3 khả năng cụ thể để Trung chỉ vào, ví dụ "đẹp hơn là ý Trung muốn đổi tông màu, đổi cách chữ chuyển động, hay chỉ là khung chữ ở cảnh 3 đang bị lệch?". Không tự chọn một khả năng rồi làm thẳng.

## 6. Cách ghi lại — thẻ phong cách

Câu trả lời của Trung về gu và thông số là tài sản dùng lại được, không phải thông tin dùng một lần rồi bỏ. Sau khi một yêu cầu đã hỏi rõ và chốt xong (đặc biệt là loại (a) và (c)), ghi lại thành một thẻ phong cách trong `tai_san/so_tay_gu/`.

Dùng đúng khuôn thẻ có sẵn — `tai_san/so_tay_gu/_mau_the_kich_ban.md` cho phong cách viết kịch bản, `tai_san/so_tay_gu/_mau_the_phong_cach.md` cho phong cách dựng. KHÔNG tự nghĩ ra khuôn riêng, vì mỗi ngăn của kho chỉ dùng một chuẩn thẻ duy nhất. Ô nào chưa có thông tin thì ghi rõ "chưa xác định" thay vì bỏ trống. Cách học phong cách từ mẫu: `11_hoc_phong_cach_tu_mau.md`. Lần sau gặp yêu cầu khớp thẻ đã duyệt, dùng thẳng theo mục 4.3, không hỏi lại từ đầu.
