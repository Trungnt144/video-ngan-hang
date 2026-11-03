# Công thức chữ và ảnh cho hình thu nhỏ: làm hàng loạt

> **Phiên bản 1.0 · 2026-10-28 · Trung duyệt qua bảng chọn cùng ngày** (kèm: giới hạn 7 từ, dòng tô màu 4 từ; `xuat.mjs` cảnh báo lặp mã công thức; công cụ soi đóng gói thành skill `soi-hinh-thu-nho`). Rút từ 22 hình thu nhỏ kênh Chuyện nghề Điện đã xuất (27–28/10/2026), từ ba lượt soi hình thu nhỏ video vượt trội trên YouTube Việt Nam (ngành điện, ngân hàng, vĩ mô, skill `soi-hinh-thu-nho`, chạy 28/10/2026) và từ tra cứu nghiên cứu nước ngoài (mục 7).
> **Quan hệ với file khác:** đứng dưới bốn quy tắc cứng và năm bố cục L1–L5 của `bang_phong_cach_hinh_thu_nho.md` mục 0. File đó nói hình **dựng thế nào**; file này nói **chọn chữ gì, ảnh gì** cho từng video. Khuôn dựng: `xuong_html/hinh_thu_nho/`.
> **Mã:** `C1`–`C10` là kiểu chữ, `A1`–`A8` là kiểu ảnh, `N` là dấu nhấn. Một hình ghi mã công thức dạng `C2-A6-L5`.

## 0. Quy trình 5 bước cho mỗi video (làm hàng loạt)

1. **Đọc hai thứ:** tóm tắt kịch bản (`tai_nguyen/kich_ban/*.tom_tat.md`) và tiêu đề YouTube đã viết (`tai_nguyen/dang_bai/youtube.md`). Rút ra: câu hỏi lõi mà video trả lời; vật hoặc cảnh cụ thể nhất video nói tới; con số đã kiểm chứng (nếu có); chương nào trả lời câu hỏi.
2. **Chọn kiểu chữ** theo loại video (bảng 3), viết câu theo mẫu ở bảng 1.
3. **Chọn kiểu ảnh** có ảnh thật khớp nội dung (bảng 2), tìm ảnh theo thứ tự nguồn của bảng phong cách mục 0 quy tắc 1.
4. **Chọn bố cục** theo bảng 3 và quy tắc luân phiên (không trùng bố cục với hình xuất ngay trước, L3 tối đa 2 trong 6 hình). Dựng **2 tổ hợp khác nhau** (khác kiểu chữ hoặc khác kiểu ảnh, không chỉ khác bố cục) để Trung chọn. Khi Trung đã chỉ định chữ và ảnh thì chỉ thay đổi bố cục và dấu nhấn.
5. **Soát bảng kiểm 12 câu** (mục 5) rồi mới xuất thật.

## 1. Chữ trên hình

### 1.1 Nguyên tắc chung

1. **Chữ và tiêu đề là một cặp, chia việc với nhau.** Tiêu đề chứa từ khoá chính để YouTube tìm thấy; chữ trên hình nói điều gây tò mò. Không chép nguyên văn tiêu đề lên hình. Lưu ý: nghiên cứu 507.478 video (mục 7) không đo được khác biệt giữa chữ lặp và chữ bổ sung; đây là quy ước để tận dụng chỗ, không phải điều đã chứng minh.
2. **Lời hứa phải có trong video.** Câu hỏi trên hình phải được trả lời trong video. Ghi chương trả lời vào trường `ghi_chu` của kê khai, ví dụ "trả lời ở chương 4 (giây 95)". Không tìm được chương trả lời thì đổi câu. Đây là điều kiện để chữ "dẫn vào nội dung", và cũng là ranh giới với giật tít theo chính sách YouTube (mục 7).
3. **Độ dài.** Hai dòng. Dòng 2 là dòng tô màu, chứa phần nhấn, tối đa 4 từ. Cả câu nên 4–6 từ, tối đa 7 từ. Trên 7 từ chỉ khi Trung chỉ định. Số liệu: trong cả ba lượt soi, nhóm video vượt trội có ít chữ hơn nhóm thường (ngành điện trung vị 13 so với 18 từ đọc được trên hình, ngân hàng 20 so với 23, vĩ mô 16,5 so với 20; số đếm gồm cả logo, chữ nhỏ). Trong 22 hình đã làm, trung vị là 7 từ.
4. **Từ đời thường, không thuật ngữ khi có từ thay.** Viết "cánh quạt gió" khi người xem phổ thông nói thế; giữ "inverter" khi đó là tên người ta tìm.
5. **Dấu "???" và "!!!"** là giọng riêng của kênh, chưa có bằng chứng tăng lượt bấm. Tối đa một hình trong bốn hình liền nhau.
6. **Con số** chỉ đưa lên hình khi có trong file nguồn kiểm chứng của video và đủ hai nguồn (quy tắc cứng 3 của `AGENTS.md`). Con số đi kèm đơn vị: "20 năm", "48 GW", "4 kW".
7. **Không dùng tên, chữ ký, lời nói của người thật** (quan chức, người nổi tiếng) trên hình của ba kênh. Kênh vĩ mô thấy nhiều video vượt trội dùng ảnh quan chức; xưởng không làm theo vì rủi ro gán lời và quyền hình ảnh.

### 1.2 Bảng 1: mười kiểu chữ

| Mã | Kiểu | Mẫu câu (dòng 1 / dòng 2) | Hợp video | Ví dụ đã làm | Điều kiện trung thực |
|---|---|---|---|---|---|
| C1 | Bên trong có gì | "Bên trong [vật] / có gì?" | Cấu tạo, mặt cắt | Phía trong mũi tua-bin gió có gì?; Bên trong tua-bin điện gió có gì? | Video phải cho thấy bên trong bằng ảnh thật hoặc mô hình |
| C2 | Làm thế nào, từ đâu ra | "[Việc] / kiểu gì?"; "[Hiện tượng] / như thế nào?"; "[Vật] / có tác dụng gì?" | Nguyên lý, thi công, quy trình | Lắp tuabin trên núi kiểu gì?; Gió tạo ra điện như thế nào? | Video giải thích đủ các bước |
| C3 | Hỏi ngược điều người ta tưởng | "[Vật] có [điều tưởng đúng] / [chi tiết]?" | Sửa ngộ nhận | Tấm pin mặt trời có đứng "im" như bạn thấy?; Cánh quạt gió có luôn quay 1 hướng? | Video phải nói rõ đáp án, kể cả khi đáp án là "đúng" |
| C4 | Con số | Khẳng định: "[Vật] / [số + đơn vị]"; hoặc hỏi: "[Việc] / tốn bao nhiêu?" | Có một con số đắt, chi phí, tuổi thọ | Tuabin gió chỉ có tuổi thọ 20 năm???; Pin mặt trời dùng được bao nhiêu năm? | Số có hai nguồn; câu hỏi số thì video phải nêu số |
| C5 | Chọn A hay B | "[A] hay [B] / thì đúng?" | So sánh, lựa chọn mua | Chọn cánh quạt to hay nhỏ thì đúng??? | Video phải có kết luận hoặc nói rõ "tuỳ trường hợp nào" |
| C6 | Hỏi thẳng người xem | "[Thứ] bạn dùng / [câu hỏi]?"; "... đến nhà bạn" | Gắn với đời sống, hoá đơn, đồ dùng | Điện bạn dùng đến từ đâu?; Hành trình của điện từ nhà máy đến nhà bạn | Nội dung phải chạm tới người xem thật (nhà, tiền, đồ dùng) |
| C7 | Cụm từ đời thường lạ tai | "[Hành động] trên / "[cụm lạ]"" (cụm lạ trong ngoặc kép) | Có cảnh bất ngờ, trái chỗ | Cắm tuabin trên "bãi tắm" | Cụm lạ phải mô tả đúng cảnh thật trong video |
| C8 | Liệt kê, rủi ro, lưu ý | "[Vật] có quá nhiều / [thứ]?"; "Lưu ý gì khi / [việc]?"; "[Vật] phải chịu / những gì?" | Danh sách, rủi ro, kinh nghiệm | Tuabin có quá nhiều thứ để hỏng?; Lưu ý gì khi lắp pin mặt trời lên mái nhà? | Danh sách trong video đủ mục như hình gợi ý |
| C9 | Khẳng định mạnh | "[Chủ đề] / [đánh giá mạnh]!!!" | Triển vọng, quy mô lớn | Điện mặt trời mái nhà / Tiềm năng cực lớn!!! | Video có số kiểm chứng làm căn cứ cho đánh giá |
| C10 | Tương lai, Việt Nam | "[Thứ] nào cho / tương lai Việt Nam?" | Quy hoạch, chính sách, dự báo | Nguồn điện nào cho tương lai Việt Nam? | Dựa trên văn bản quy hoạch, ghi văn bản trong nguồn kiểm chứng |

**Chưa dùng, nên thử** (thấy ở video vượt trội khi soi 28/10/2026): C4 dạng khẳng định có đơn vị trên dòng nhấn ("Cao 300 mét", "Giá chỉ 20 triệu", "Lãi suất đã chạm 10%"); câu ngắn 3–4 từ không phải câu hỏi ("Cách nó hoạt động!", "Không hề có bình tích điện"). 18 trong 22 hình đã làm là câu hỏi, nên các hình liền nhau dễ giống nhau về giọng.

### 1.3 Áp cho kênh ngân hàng và vĩ mô (khi mở)

**Kênh Chuyện nghề Ngân hàng có quy tắc riêng từ 30/10/2026:** `bang_phong_cach_hinh_thu_nho.md` mục 0b (hình vẽ từ video, chữ là nội dung video rút gọn 4–8 từ, con số không bắt buộc). Đoạn dưới chỉ còn là số liệu tham khảo cho kênh vĩ mô.

Cùng mười kiểu. Hai kênh này dùng C4 nhiều hơn: 74% video vượt trội ngành ngân hàng và 70% ngành vĩ mô có con số trên hình, so với 48% ngành điện. Video vĩ mô vượt trội dùng dấu hỏi nhiều hơn nhóm thường (44% so với 25%).

## 2. Ảnh trên hình

### 2.1 Ba yêu cầu và cách đạt từng yêu cầu

**Đáng tin**
1. Ảnh chụp đúng vật, đúng cảnh mà video nói tới (quy tắc cứng 3). Video nói tua-bin trên núi thì ảnh tua-bin trên núi, không lấy ảnh tua-bin ngoài biển.
2. Ưu tiên ảnh chụp tại Việt Nam (trang ảnh ghi địa điểm). Ảnh nước ngoài thì không đặt chữ "Việt Nam" ngay trên ảnh đó, không ghi địa danh.
3. Xoá logo, tên hãng trên vật và quần áo (đã làm với tua-bin, mũ thợ).
4. Ghép ảnh chỉ để thể hiện cảm xúc của người xem (người rét, người kinh ngạc) hoặc quan hệ giữa các phần (vòng phóng, dải ảnh). Không ghép để tạo sự kiện chưa xảy ra (không ghép lửa vào một nhà máy có thật).
5. Ảnh sự cố, cháy nổ chỉ dùng khi video thật sự nói về sự cố đó. Video nói rủi ro hiếm thì không dùng ảnh cháy (đã áp với video lưu ý điện mặt trời mái nhà).
6. Người trong ảnh là người mẫu ảnh phổ thông, không phải người nổi tiếng hay quan chức.

**Gây chú ý**
1. Một vật chính, đọc được ở cỡ 320×180 (khung nhỏ trong bảng soát `luoi.jpg`). Tối đa ba nhóm yếu tố: chữ, vật chính, một nhóm dấu nhấn.
2. Mỗi hình có một "điều lạ" nhìn thấy được: vật khổng lồ có người đứng cạnh làm thước đo, vật hỏng, bên trong máy, người biểu cảm, cảnh trái chỗ, con số. Hình chỉ có vật toàn cảnh bình thường thì phải bù bằng chữ mạnh hoặc dấu nhấn.
3. Biểu cảm người vừa phải. Nhóm làm hình của MrBeast thử khoảng 30 video và thấy bản ngậm miệng cho thời lượng xem cao hơn bản há miệng (mục 7, chưa công bố số). Dùng biểu cảm rất mạnh (há hốc) tối đa một hình trong sáu.
4. Không bắt chước dải băng đỏ kiểu bản tin truyền hình có câu dài: trong lượt soi ngành điện, kiểu này nằm chủ yếu ở nhóm dưới trung vị kênh.
5. Khác hình xuất ngay trước ít nhất ở kiểu ảnh hoặc bố cục (quy tắc luân phiên).

**Liên quan nội dung**
1. Mỗi vòng phóng, mỗi ô dải ảnh, mỗi mũi tên ứng với một ý có trong video (vòng "sét" chỉ vào đầu cánh vì video nói sét đánh đầu cánh).
2. Vật chính trên hình xuất hiện trong video, tốt nhất ở 30 giây đầu (người bấm vào cần thấy ngay thứ hình đã hứa).
3. Nhãn chữ nhỏ trên ảnh (tên ô, nhãn vòng) dùng đúng từ video dùng.

### 2.2 Bảng 2: tám kiểu ảnh

| Mã | Kiểu ảnh | Đáng tin | Gây chú ý | Liên quan | Ví dụ đã làm | Lưu ý |
|---|---|---|---|---|---|---|
| A1 | Vật chính toàn cảnh, ảnh thật | Cao | Trung bình | Cao | Cánh đồng điện gió; máy biến áp | Thêm người nhỏ cạnh vật để thấy cỡ, hoặc thêm dấu nhấn |
| A2 | Cận cảnh bên trong, chi tiết kỹ thuật thật | Cao | Cao | Cao | Inverter mở vỏ; bầu cánh trong nhà máy | Nguồn: Commons của cơ quan nhà nước Mỹ khi Pexels không có |
| A3 | Người Việt biểu cảm cạnh vật | Trung bình | Cao | Trung bình | Người kinh ngạc trước mái pin; người bối rối giữa hai tua-bin | Biểu cảm phải khớp câu chữ; tách nền bằng `tach_nen.swift` và `lam_vien.py` |
| A4 | Hỏng, sự cố, cũ, ảnh thật | Cao | Cao | Cao khi video nói về hỏng | Tua-bin cháy cánh gãy; tua-bin cũ cạnh nhà hoang | Chỉ khi video nói về hỏng |
| A5 | Đối lập chia đôi | Cao | Cao | Cao | Người rét / người nóng; to / nhỏ; nhà dân / nhà xưởng | Hai nửa phải khác nhau rõ ở cỡ nhỏ |
| A6 | Toàn cảnh kèm vòng phóng chi tiết (1–6 vòng, có điểm chỉ) | Cao | Cao | Cao nhất | Sáu tác nhân chỉ vào điểm hỏng tua-bin; tay siết kẹp pin | Mỗi vòng là một ý trong video; không đặt vào góc nhãn kênh |
| A7 | Dải nhiều ảnh theo thứ tự | Cao | Trung bình | Cao | Sáu loại nhà máy điện | Ô hẹp, vật chính phải nằm nửa trên ô |
| A8 | Nhân vật hoạt hoạ trên nền ảnh thật | Thấp hơn | Cao | Trung bình | Tấm pin nhân hoá "Tôi khổ lắm!" | Chỉ khi Trung yêu cầu (quy tắc cứng 1, ngoại lệ) |

**Dấu nhấn N** (thêm vào kiểu ảnh, tối đa một loại mỗi hình): mũi tên đỏ viền trắng (một mũi tên, chỉ vào điểm quan trọng nhất, không đè chữ); vòng tròn đánh dấu; nhãn số nền vàng; bóng thoại; nhãn tên ô.

## 3. Bảng 3: tổ hợp theo loại video

Mỗi loại video có ba tổ hợp. Tổ hợp đầu là mặc định, hai tổ hợp sau dùng khi bố cục mặc định lệch nhịp luân phiên hoặc khi cần phương án thứ hai cho Trung chọn.

| Loại video | Tổ hợp 1 (mặc định) | Tổ hợp 2 | Tổ hợp 3 |
|---|---|---|---|
| Cấu tạo, bên trong máy | C1-A2-L3 | C1-A6-L5 | C3-A2-L2 |
| Nguyên lý hoạt động | C2-A6-L5 | C6-A3-L1 | C2-A2-L2 |
| Thi công, vận chuyển, quy trình | C2-A1-L3 (có người làm thước đo) | C2-A6-L5 | C7-A1+N mũi tên-L1 |
| Sửa ngộ nhận | C3-A1+N mũi tên-L1 | C3-A4-L1 | C3-A5-L2 |
| Tuổi thọ, hỏng hóc, sự cố | C8-A4+A6-L5 | C4-A4-L4 | C3-A4+N mũi tên-L1 |
| So sánh, lựa chọn | C5-A5+A3-L1 | C5-A5-L2 | C4-A5-L4 |
| Lưu ý, rủi ro, kinh nghiệm | C8-A6-L5 | C8-A3-L1 | C8-A7-L1 |
| Quy hoạch, chính sách, thị trường | C10-A7-L1 | C4-A1-L4 | C9-A5+A3-L1 |
| Gắn đời sống, hoá đơn, đồ dùng | C6-A3+A6-L3 | C6-A6-L5 | C4 (tiền)-A3-L4 |
| Tin cập nhật, sự kiện (kênh vĩ mô) | C4-A1-L4 | C9-A1-L1 | C3-A5-L2 |

**Chống lặp khi làm hàng loạt** (ngoài luân phiên bố cục): hình mới không trùng **cả** kiểu chữ **và** kiểu ảnh với hình xuất ngay trước; trong 6 hình gần nhất, một kiểu chữ tối đa 3 lần. Trong 22 hình đã làm, C2 chiếm 6 hình, A1 làm nền chính ở 7 hình.

```
Loại video ──► chọn hàng trong bảng 3 ──► thử tổ hợp 1
                                           │
                 bố cục lệch nhịp,         ▼
                 trùng C và A với   ──►  tổ hợp 2, rồi tổ hợp 3
                 hình trước
                                           │
                                           ▼
                 viết câu theo bảng 1, tìm ảnh theo bảng 2
                                           │
                                           ▼
                 dựng 2 tổ hợp ──► bảng kiểm mục 5 ──► Trung chọn ──► xuất thật
```

## 4. 22 hình đã làm, gắn mã công thức

| # | Video | Chữ | Mã |
|---|---|---|---|
| 1 | Cánh đồng gió | Bên trong một / cánh đồng điện gió | C1-A1-L3 |
| 2 | Giá đỡ xoay | Tấm pin mặt trời có / đứng "im" như bạn thấy? | C3-A1-L3 |
| 3 | Xoay hướng | Cánh quạt gió có / luôn quay 1 hướng? | C3-A2-L3 |
| 4 | Gió mùa | Gió mùa đông bắc, / gió Phơn từ đâu mà ra? | C2-A5+A3-L3 |
| 5 | Tuổi thọ tua-bin | Tuabin gió chỉ có / tuổi thọ 20 năm??? | C4-A4+N-L1 |
| 6 | Gió ngoài khơi | Giữa biển thì dựng / điện gió kiểu gì? | C2-A1-L3 |
| 7 | Gió trên bờ | Lắp tuabin / trên núi kiểu gì? | C2-A6-L5 |
| 8 | Hành trình của điện | Hành trình của điện / từ nhà máy đến nhà bạn | C6-A6-L5 |
| 9 | Gió gần bờ | Cắm tuabin trên / "bãi tắm" | C7-A1+N-L1 |
| 10 | Thử nghiệm tấm pin | Pin mặt trời phải chịu / những thử thách gì? | C8-A8-L3 |
| 11 | Inverter | Inverter / có tác dụng gì | C2-A2-L3 |
| 12 | Tấm pin già | Pin mặt trời dùng được / bao nhiêu năm? | C4-A4+A6-L5 |
| 13 | Máy biến áp | Nguyên lý hoạt động / của máy biến áp | C2-A1-L3 |
| 14 | Bầu cánh | Phía trong mũi / tua-bin gió có gì? | C1-A2-L3 |
| 15 | Tua-bin gió | Gió tạo ra điện / như thế nào? | C2-A1+A3-L3 |
| 16 | Buồng máy | Bên trong tua-bin / điện gió có gì? | C1-A6-L5 |
| 17 | Chọn tua-bin | Chọn cánh quạt to / hay nhỏ thì đúng??? | C5-A5+A3-L3 |
| 18 | Mái nhà | Điện mặt trời mái nhà / Tiềm năng cực lớn!!! | C9-A5+A3-L1 |
| 19 | Nguồn điện hiện nay | Điện bạn dùng / đến từ đâu? | C6-A3+A6-L3 |
| 20 | Hao mòn tua-bin | Tuabin có quá nhiều / thứ để hỏng? | C8-A4+A6-L5 |
| 21 | Nguồn điện 2030 | Nguồn điện nào cho / tương lai Việt Nam? | C10-A7-L1 |
| 22 | Lưu ý mái nhà | Lưu ý gì khi lắp pin mặt trời / lên mái nhà? | C8-A1+A6-L5 |

Điểm mạnh của loạt này: hình nào cũng bám đúng vật, đúng cảnh của video; ảnh thật, phần lớn chụp ở Việt Nam. Điểm cần đổi: chữ luôn ở góc dưới trái và gần như luôn là câu hỏi; chưa dùng kiểu con số khẳng định (C4 dạng có đơn vị) và bố cục L4; chưa có hình nào có người nhỏ đứng cạnh vật lớn để thấy cỡ, trong khi video vượt trội số 1 của lượt soi ngành điện dùng đúng cách này ("Cao 300 mét").

## 5. Bảng kiểm 12 câu trước khi xuất

1. Câu chữ được trả lời ở chương nào của video? (ghi vào `ghi_chu`)
2. Chữ có chép nguyên tiêu đề không? (không được)
3. Dòng nhấn tối đa 4 từ, cả câu tối đa 7 từ? (trừ khi Trung chỉ định)
4. Con số trên hình có trong nguồn kiểm chứng, đủ hai nguồn?
5. Ảnh có đúng vật, đúng cảnh video nói tới?
6. Ảnh nước ngoài có bị đặt cạnh chữ "Việt Nam" hoặc địa danh không?
7. Còn logo, tên hãng trên ảnh không?
8. Ghép ảnh có tạo ra sự kiện không có thật không?
9. Nhìn ở khung nhỏ của `luoi.jpg`: đọc được chữ và nhận ra vật chính trong một lần nhìn không?
10. Có một "điều lạ" nhìn thấy được không?
11. Mã công thức có trùng cả kiểu chữ và kiểu ảnh với hình xuất ngay trước không?
12. Bố cục có đúng nhịp luân phiên? (`xuat.mjs --thu` in nhịp)

## 6. Công cụ nghiên cứu trên YouTube

Skill `soi-hinh-thu-nho` (`skills/soi-hinh-thu-nho/`, dựng 28/10/2026, không cần khoá API; Trung nói "soi hình thu nhỏ"): script `scripts/soi.py`: tìm video theo từ khoá bằng yt-dlp, chỉ lấy video dài từ 120 giây, tính **độ vượt trội** (lượt xem chia trung vị lượt xem video thứ 31–100 của chính kênh đó), tải hình thu nhỏ, đọc chữ và đếm mặt người bằng Vision của macOS (`doc_hinh.swift`), so nhóm vượt trội (từ ×2) với nhóm dưới trung vị kênh.

```bash
python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten dien --nhom dien          # bộ từ khoá trong tu_khoa.json
python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten mai_nha --tu "điện mặt trời mái nhà" --so 50
python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten kenh_x --kenh https://www.youtube.com/@ten_kenh
```

Kết quả vào `du_lieu/soi_hinh_thu_nho/<ngày>_<tên>/` (ngoài git): `bang.md`, `luoi_vuot_troi.jpg`, `luoi_thuong.jpg`, `ket_qua.json`. Mỗi lượt khoảng 3–5 phút, không tốn tiền.

**Khi nào chạy:** trước một lô video về chủ đề mới (soi theo từ khoá của chủ đề đó); mỗi tháng một lượt theo ba nhóm kênh để cập nhật bảng 1 và bảng 2.

**Giới hạn:** kết quả tìm kiếm của YouTube đã nghiêng về video nhiều lượt xem; yt-dlp không trả ngày đăng ở chế độ nhanh nên video cũ có lợi thế; máy đọc chữ đếm cả logo và chữ nhỏ, nên số từ chỉ dùng để so hai nhóm với nhau; mẫu vài chục video chỉ cho gợi ý.

**Cách thử chắc hơn:** công cụ Test & Compare của YouTube Studio thử tối đa 3 hình thu nhỏ trên cùng một video, chọn hình thắng theo tổng thời lượng xem, xong trong 2 tuần, chỉ dùng trên máy tính. Khi kênh có lượt xem đều, dùng hai tổ hợp của bước 4 làm hai bản thử.

## 7. Bằng chứng từ nghiên cứu nước ngoài (tra 28/10/2026)

| Khẳng định | Nguồn | Mức tin |
|---|---|---|
| Số từ trên hình gần như không phân biệt video vượt trội và video kém (4–6 từ: 30,6% so với 26,5%); không chữ 13,4% so với 16,8% | Eden, 507.478 video, 21/08/2026, eden.so/blog/what-makes-a-good-youtube-thumbnail | Có số liệu đo, chênh nhỏ |
| Chữ lặp nguyên tiêu đề 6,3% (vượt trội) so với 6,8% (kém): không có khác biệt | Như trên | Có số liệu đo |
| 69% hình "bùng nổ" có mặt người; nhưng hai nghiên cứu khác thấy có mặt hay không mặt gần như như nhau | vidIQ, 500 hình, 30/06/2026; Eden; 1of10 qua Search Engine Journal | Số liệu mâu thuẫn |
| Mặt người không bắt buộc. Lượt soi ngành điện của xưởng: nhóm vượt trội có mặt người 25%, nhóm thường 50% | `soi.py`, 28/10/2026 | Mẫu nhỏ |
| Người xem phải hiểu hình ngay lần nhìn đầu; nhiều yếu tố gây rối; phải xem ở cỡ nhỏ | Người làm hình cho MrBeast, socialmediatoday.com, 08/03/2024 | Ý kiến chuyên gia |
| Bản ngậm miệng cho thời lượng xem cao hơn bản há miệng, thử khoảng 30 video | Như trên | Đo nội bộ, không công bố số |
| Hình và tiêu đề đặt kỳ vọng; người xem thấy lệch thì bỏ, giảm đề xuất | Tài liệu sản xuất MrBeast bị lộ 2024, simonwillison.net 15/09/2024 | Ý kiến chuyên gia |
| Cấm hình thu nhỏ làm người xem tưởng có thứ không có trong video; YouTube siết "giật tít nghiêm trọng" từ 12/2024, trọng tâm tin nóng | support.google.com/youtube/answer/9229980; blog.google 18/12/2024 | Chính thức |
| Test & Compare chọn hình thắng theo thời lượng xem, không theo tỉ lệ bấm | support.google.com/youtube/answer/13861714 | Chính thức |

Chưa có bằng chứng tốt cho: tác dụng riêng của "???", "!!!", chữ in hoa; câu hỏi so với con số; mũi tên tách riêng; cỡ chữ tối thiểu trên điện thoại. Các quy tắc liên quan trong file này là quy ước của kênh, không phải điều đã đo.
