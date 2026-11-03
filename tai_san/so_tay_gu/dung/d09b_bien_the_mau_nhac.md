# Phụ lục thẻ D-09b — Bộ biến thể 8 bảng màu × 10 bài nhạc

> **Từ 27/10/2026 (Trung chốt):** video mới không dùng mã M và N của phụ lục này. Bảng M0–M8 thành MAU-09…MAU-17, bài N01–N15 thành NH01–NH15 (Close Up là NH00, Infinity là NH16) trong `../he_truc_dung.json`; chữ N đổi sang NH để không trùng số việc trong sổ nợ. Phụ lục giữ nguyên để tra video cũ và vì ma trận màu × nhạc bên dưới đã được chép vào file dữ liệu.

> Lập ngày 26/10/2026 theo yêu cầu của Trung: "bên cạnh nhạc và màu sắc theo phong cách D-09b, tìm các form màu sắc và các bài nhạc tương tự để đa dạng phong cách… khoảng 08 chủ đề màu sắc, 10 bài nhạc mẫu để có 80 phong cách khác nhau".
> Thẻ chính: `d09b_kem_xuyen_thau_chi_tiet.md`. Phụ lục này KHÔNG đổi thẻ chính: mặc định vẫn là bảng gốc M0 (kem & ngọc) với nhạc "Close Up" hoặc "Infinity". Mọi ô khác của D-09b (mức chi tiết kỹ thuật, bố cục, nhịp máy quay, giọng 1,2 lần, phụ đề) giữ nguyên cho cả 80 tổ hợp.
> Trạng thái: **nháp** — số đo và khung hình 3D đã kiểm bằng máy; nhạc chưa ai nghe bằng tai để chấm ma trận.

## Trung chốt ngày 26/10/2026

| Nội dung đã chốt | Khác đề xuất ban đầu | Ảnh hưởng |
|---|---|---|
| Tải cả 10 bài Mixkit về `tai_san/nhac_nen/` | Không khác | Thêm khoảng 37 MB vào git; đo được nhịp, độ to từng bài |
| Ghi thành bộ biến thể trong D-09b (mã M1–M8, NH01–NH10), không tạo 80 thẻ | Không khác | Bảng 3 của `00_muc_luc.md` không thêm cột; một tổ hợp gọi là "D-09b · M3 · NH09" |
| 5 bảng nền sáng + 3 bảng nền tối; vật thể và nền phải tương phản để bộ phận trọng tâm nổi rõ | Claude đề xuất cả 8 nền sáng | Thẻ D-09b ghi "không dùng nền tối"; ba bảng M6–M8 là ngoại lệ Trung cho phép, chỉ dùng khi chọn rõ mã đó. Thêm bộ kiểm tương phản bắt buộc cho mọi bảng |
| Xem trước bằng trang HTML cộng khung hình 3D thật | Không khác | 27 ảnh (9 bảng × 3 khung) kết xuất từ bản sao mã video máy biến áp |

## Cách dùng trong mã dựng

1. Chép `xuong_dai/bang_mau_d09b/src/BangMau.ts` vào `src/` của video mới. Trong `CoBan.tsx` thay khối `MAU` cố định bằng:
   `export const MA_BANG = (getInputProps() as { bang?: string }).bang ?? "M0"; export const MAU = BANG_MAU[MA_BANG] ?? BANG_MAU.M0;`
2. Kết xuất chọn bảng bằng `--props='{"bang":"M6"}'`. Không truyền gì thì ra bảng gốc.
3. **Không viết mã màu cứng trong mã cảnh.** Bản sao đã gỡ hết các chỗ viết cứng của video máy biến áp: màu thanh số liệu (`MAU.do`, `MAU.nong`, `MAU.ngoc`, `MAU.dong`), sắc hồng nhạt khi tô sáng vỏ và lá thép (`MAU.do_nhat1..3`), dây cáp (`MAU.day`, `MAU.day_toi`), ánh sáng bán cầu (`MAU.troi`, `MAU.dat`), nền thẻ chữ (`MAU.theMo(độ đục)`), chữ trên thẻ (`MAU.chu_the`). Viết cứng một mã màu thì bảng tối sẽ lộ ra ô sáng lạc màu.
4. Nhạc: đặt `NHAC` là file bài đã chọn, **âm lượng lấy theo cột "Âm lượng" ở bảng nhạc**, không giữ 0,16 cho mọi bài (các bài mới to hơn "Close Up" tới 7 dB).
5. Sửa hoặc thêm bảng màu: sửa `bang_mau_goc.json` (thư mục `d09b_bien_the/`) và `BangMau.ts`, rồi chạy kiểm:

```bash
python3 scripts/kiem_tuong_phan_bang_mau.py tai_san/so_tay_gu/dung/d09b_bien_the/bang_mau_goc.json
```

## 8 bảng màu

Ngưỡng kiểm (bắt buộc với mọi bảng mới): chữ trên nền ≥ 7:1; chữ trên thẻ ≥ 7:1; màu nhấn (bộ phận đang nói, nhãn, gạch phụ đề) trên nền ≥ 3:1; độ khác màu CIEDE2000 (thang đo mắt người thấy hai màu khác nhau bao nhiêu, trên 20 là khác rõ) giữa màu bộ phận và nền ≥ 20, giữa màu nhấn và mọi màu bộ phận ≥ 15.

**Quy tắc tương phản vật chính (Trung chốt 26/10/2026, sau video che gió):** vật chính của cảnh, kể cả khi nó là vỏ trắng, phải đạt ≥ 3:1 với nền; vỏ trắng trên nền kem chỉ 1,13:1 nên chỉ được làm lớp ngoài trong suốt để nhìn vào bộ phận màu, không được làm vật chính. Vật chính cao ít nhất 1/4 khung hình ở mỗi cảnh; cảnh toàn cảnh mà giữ đúng tỉ lệ thì vật quá bé được vẽ to hơn tỉ lệ thật và ghi chú trên hình. Đo trên khung cắt từ mp4 bằng `scripts/do_tuong_phan_khung.py`. Bộ kiểm bảng màu ở trên chỉ đo các cặp màu khai trong bảng, không biết màu nào là vật chính của từng video, nên bước đo trên khung là bắt buộc.

Phát hiện khi kiểm: **chính bảng gốc M0 không đạt ngưỡng màu nhấn** — cam san hô `#FF6B4A` trên nền kem chỉ 2,5:1, và chỉ khác màu đồng cuộn dây 15 đơn vị. Tám bảng mới đều đạt; ở M0 vẫn dùng được vì nhãn nằm trên thẻ trắng và vật có viền, nhưng bộ phận trọng tâm kém nổi hơn các bảng mới.

| Mã | Tên | Nền | Màu ấm chính / phụ | Màu lạnh | Kim loại màu | Nhấn | Chữ | Chữ/nền | Nhấn/nền | Tính cách | Hợp chủ đề |
|---|---|---|---|---|---|---|---|---|---|---|---|
| M0 | Gốc: Kem & ngọc | `#F4F1EA` kem | `#FFC93C` / `#F2A91E` | `#1FB5A8` | `#D9894A` | `#FF6B4A` | `#2B2B2B` | 12,6 | 2,5 | Bảng Trung chốt cho D-09b | Mặc định |
| M1 | Trời trong | `#EAF2FA` xanh trời nhạt | `#FFC02E` / `#FF8C1A` | `#2F6FE4` xanh cô-ban | `#B9784A` | `#E83A5F` đỏ hồng | `#1C2A3B` | 12,9 | 3,6 | Sạch, tươi, công nghệ | Điện tử, viễn thông, máy văn phòng, hàng không |
| M2 | Lá non | `#F1F5E8` xanh lá rất nhạt | `#8CCB3F` / `#F5C33B` | `#1597B8` | `#C98545` | `#F0532D` cam đỏ | `#1F2B1C` | 13,4 | 3,2 | Tự nhiên, nhẹ | Năng lượng tái tạo, nông nghiệp, xử lý nước, sinh học |
| M3 | Đào & oải hương | `#FBF0EC` hồng đào nhạt | `#FFA06B` / `#FFCF5C` | `#7C6CE8` tím oải hương | `#B97852` | `#D6286A` hồng đậm | `#2C2133` | 13,7 | 4,3 | Mềm, ấm, trẻ | Đồ gia dụng, y tế, cơ thể người, đời sống |
| M4 | Biển cát | `#F5EDDF` cát | `#F2BE45` / `#E2795A` đất nung | `#1F6C9C` xanh biển | `#A86A3A` | `#D2394F` đỏ gạch | `#22303A` | 11,6 | 4,1 | Điềm tĩnh, đáng tin, cổ điển | Tàu biển, cảng, xây dựng, cơ khí truyền thống |
| M5 | Kẹo pop | `#F5F1FF` tím rất nhạt | `#FFD23F` / `#FF7BAC` hồng | `#3A7BFF` xanh điện | `#E08F55` | `#EF2D56` đỏ dâu | `#231B3A` | 14,7 | 3,7 | Rất trẻ, vui, mạng xã hội | Đồ chơi, điện thoại, chủ đề cho người trẻ |
| M6 | Đêm xanh neon (nền tối) | `#0E1A2B` xanh đêm | `#FFC93C` / `#FF9F1C` | `#22CCE6` xanh lơ sáng | `#E39A62` | `#FF4D8D` hồng neon | `#F2F6FB` | 16,1 | 5,6 | Công nghệ cao, tương lai | Bán dẫn, máy tính, điện, vệ tinh |
| M7 | Than chì & chanh (nền tối) | `#16181B` than chì | `#D6F03A` chanh / `#FFB020` | `#46B6F0` | `#D98C55` | `#FF3D7F` hồng đỏ | `#F3F3F0` | 16,0 | 5,3 | Công nghiệp, mạnh | Động cơ, máy công trình, nhà máy, ô tô |
| M8 | Tím đêm (nền tối) | `#1A1530` tím than | `#FFD166` / `#FF9257` | `#5EE0BC` bạc hà | `#E0A070` | `#FF4FA3` hồng | `#F6F1FF` | 15,9 | 5,8 | Không gian, bí ẩn | Thiên văn, vật lý hạt, laser, quang học |

Đủ 28 khoá màu của từng bảng (vỏ, viền, thép, giấy cách điện, sắc nhạt của màu nhấn…) ở `xuong_dai/bang_mau_d09b/src/BangMau.ts`. Ba bảng tối dùng vỏ xám xanh trong suốt với viền sáng, thẻ chữ nền tối chữ sáng.

**Khung hình 3D thật** ở `d09b_bien_the/anh/` (tên `<mã bảng>_k<khung>.jpeg`): khung 900 vỏ xuyên thấu, lõi thép, gông cam; khung 1260 cuộn dây trọng tâm tô màu nhấn, có nhãn; khung 1850 thẻ số liệu và phụ đề. Hạn chế: video máy biến áp chỉ dùng vài ô màu (thép xám, đồng, gông màu phụ, nhấn), nên màu ấm chính của M2 (xanh lá) và M7 (chanh) gần như không lộ trong ảnh — hai màu này chỉ hiện rõ ở video có nhiều bộ phận màu (bánh răng, cánh quạt).

## 10 bài nhạc

Nguồn: Mixkit, giấy phép Mixkit Stock Music Free License (đọc toàn văn ngày 26/10/2026, xem `tai_san/nhac_nen/README.md`). Chọn theo cùng nhóm với "Close Up" và "Infinity": nhạc doanh nghiệp, điện tử nhẹ, pop, nhịp vui, không trầm kiểu phim tài liệu.

Số đo bằng máy (`scripts/do_nhac_nen.py`, kết quả thô `tai_san/nhac_nen/so_do_nhac.jsonl`). Nhịp là ước tính, có thể lệch một nửa hoặc gấp đôi. "Âm lượng" là mức đặt trong Remotion để bài nghe to ngang "Close Up" ở 0,16. "Sáng âm" là trọng tâm phổ: số càng cao tiếng càng sáng, chói; số thấp là nhiều tiếng trầm, ít tranh chỗ với giọng đọc.

| Mã | Bài, tác giả | File | Dài | Nhịp ước | Độ to | Âm lượng | Sáng âm | Tính chất và lưu ý |
|---|---|---|---|---|---|---|---|---|
| (gốc) | Close Up, Michael Ramir C. | `mixkit-close-up-1167.mp3` | 1:35 | 103 | −18,2 dB | 0,16 | 1338 Hz | Bản thẻ D-09b đang dùng |
| (gốc) | Infinity, Arulo | `mixkit-infinity-440.mp3` | 1:43 | 112 | −18,3 dB | 0,16 | 1595 Hz | Bản dự phòng của thẻ |
| NH01 | Motivating Mornings, Ahjay Stelino | `mixkit-motivating-mornings-33.mp3` | 1:36 | 123 | −11,8 dB | 0,077 | 1634 Hz | Doanh nghiệp lạc quan, đúng chất "Close Up" nhưng nhanh hơn. 7,6 giây đầu nhỏ |
| NH02 | Your Breath, Eugenio Mininni | `mixkit-your-breath-634.mp3` | 3:56 | 117 | −12,4 dB | 0,082 | 1685 Hz | Bài dài duy nhất, cho video trên 2 phút khỏi phải phát chậm. Chênh độ to giữa các khúc tới 28 dB: có đoạn gần lặng, phải nghe và chọn đoạn liền mạch. **Từ khoảng giây 50 tới 80 và 90 tới 115 có lớp tiếng cao tần Trung nghe thành tiếng rè** (video monopile 26/10/2026, phần trên 10 kHz tăng 5 dB); tránh dùng đoạn này |
| NH03 | Stylz, Ahjay Stelino | `mixkit-stylz-102.mp3` | 1:40 | 136 | −12,4 dB | 0,082 | 1029 Hz | Doanh nghiệp điện tử, nhịp nhanh nhất, tiếng trầm |
| NH04 | Digital Clouds, Alejandro Magaña | `mixkit-digital-clouds-175.mp3` | 1:41 | 129 | −14,2 dB | 0,101 | 2464 Hz | Điện tử thư giãn, tiếng sáng, bay bổng |
| NH05 | Curiosity, Diego Nava | `mixkit-curiosity-480.mp3` | 1:40 | 161 (có thể 80) | −13,0 dB | 0,088 | 1864 Hz | Thư giãn, tò mò, hợp khoa học. **12 giây đầu rất nhỏ**: bắt đầu phát từ giây 12 (`trimBefore={360}` trên `<Audio>`; Remotion bản cũ gọi là `startFrom`) |
| NH06 | Pop Track 03, Lily J | `mixkit-pop-track-03-729.mp3` | 1:37 | 108 | −11,6 dB | 0,075 | 589 Hz | Pop điện tử, độ to đều nhất (khoảng động 4 dB), tiếng rất trầm nên ít át giọng |
| NH07 | Better Times are Coming, Alejandro Magaña | `mixkit-better-times-are-coming-173.mp3` | 1:40 | 117 | −14,7 dB | 0,107 | 2003 Hz | Synthpop (pop dùng đàn điện tử) tươi, đều |
| NH08 | Tech House vibes, Alejandro Magaña | `mixkit-tech-house-vibes-130.mp3` | 1:42 | 123 | −10,9 dB | 0,069 | 1393 Hz | Nhạc house, to nhất và nặng tiếng trầm nhất (82% năng lượng dưới 150 Hz), mạnh |
| NH09 | Coffee or Tea, Michael Ramir C. | `mixkit-coffee-or-tea-1168.mp3` | 2:05 | 103 | −19,3 dB | 0,18 | 1220 Hz | Cùng tác giả và cùng nhịp với "Close Up": thay thế gần nhất. Dài 2:05 |
| NH10 | Just Keep Walking, Michael Ramir C. | `mixkit-just-keep-walking-963.mp3` | 2:05 | 96 | −18,9 dB | 0,17 | 2509 Hz | Indie pop mộc, tiếng sáng, chậm nhất. Dài 2:05 |
| NH11 | Crying Sea, Michael Ramir C. | `mixkit-crying-sea-1023.mp3` | 2:20 | 108 | −19,3 dB | 0,18 | 1982 Hz | Chillout nhẹ, cùng tác giả với "Close Up" và NH09; độ to gần NH09. 3,6 giây đầu nhỏ. Rè: 2,4 / 4,6 dB (sạch). Thêm 27/10/2026 |
| NH12 | Finding Myself, Michael Ramir C. | `mixkit-finding-myself-993.mp3` | 2:14 | 144 (có thể 72) | −27,4 dB | 0,46 | 1462 Hz | Ambient rất nhỏ và gần như không có tiếng trầm (0,5% năng lượng dưới 150 Hz): mỏng, lắng, ít át giọng nhất. Bài nhỏ nên âm lượng đặt cao. Rè: 3,6 / 4,9 dB (sạch). Thêm 27/10/2026 |
| NH13 | Vastness, Andrew Ev | `mixkit-vastness-184.mp3` | 3:50 | 78 | −13,7 dB | 0,095 | 466 Hz | Ambient chậm nhất, trầm nhất, độ to đều nhất (chênh giữa các khúc 2,8 dB): nền rộng, tĩnh, hợp thiên văn, năng lượng. Rè: 1,4 / 6,8 dB (sạch). Thêm 27/10/2026 |
| NH14 | Forest Walk, Eugenio Mininni | `mixkit-forest-walk-607.mp3` | 2:54 | 117 | −13,8 dB | 0,096 | 1012 Hz | Electronica nhẹ, đều. **10 giây đầu và 25 giây cuối gần lặng**: đoạn dùng được khoảng giây 10 tới 150 (140 giây); bắt đầu phát từ giây 10 (`trimBefore={300}`). Rè: 4,6 / 2,4 dB (sạch, sát ngưỡng ở giây 15). Thêm 27/10/2026 |
| NH15 | No Turning Back, Alejandro Magaña (A. M.) | `mixkit-no-turning-back-118.mp3` | 3:46 | 112 | −10,8 dB | 0,068 | 1156 Hz | Electronica, to nhất bộ mới, nặng tiếng trầm; sôi hơn bốn bài kia, hợp đoạn cao trào. **23 giây đầu nhỏ dần lên**: bắt đầu từ giây 20 (`trimBefore={600}`). Rè: 3,1 / 2,1 dB (sạch). Thêm 27/10/2026 |

**Bộ 5 bài dài thêm 27/10/2026 (NH11–NH15).** Trung duyệt tải bài trên 125 giây, nhẹ, không lời, cho video khoa học. Đo rè bằng `scripts/do_re_cao_tan.py`, ngưỡng loại: trên 10 kHz tăng từ 5 dB hoặc trên 16 kHz tăng từ 8 dB (NH02 có rè cho 7,9 / 14,5; NH09 sạch cho 2,9 / 7,1). Đã đo 21 bài, giữ 5. Bài bị loại (mã Mixkit, mức tăng 10k / 16k dB): Discover 587 (8,8 / 16,2), Focus on Yourself 568 (8,7 / 8,6), Forest Mist Whispers 148 (8,3 / 11,3), Moon Walk 609 (13,5 / 25,4), River Flow 594 (17,0 / 14,8), Slow Rain 122 (22,8 / 22,7), Staring at the Night Sky 168 (7,4 / 8,3), Xceed Thru Johann 556 (6,4 / 9,2), Departure 110 (12,9 / 22,1), Valley Sunset 127 (8,3 / 14,1), Woodfire by the Lake 128 (32,6 / 42,8), A Blue Day 150 (9,1 / 17,9), Closer 189 (11,1 / 14,2), Atoms in Peace 107 (12,9 / 13,9), Down the River 111 (9,1 / 11,9), Lo-Fi 04 766 (6,1 / 5,6). Số vượt ngưỡng có thể do trống, chũm chọe vào giữa bài chứ không chắc là rè; bài bị loại vì nghi rè, chưa nghe lại. Bộ NH11–NH15 chưa xếp vào ma trận 8 × 10 bên dưới.

Video dài hơn bài nhạc: theo thứ tự duy nhất ở `08_giong_am_thanh_phu_de.md` mục 7 (chọn bài dài hơn video; không có bài hợp đủ dài thì phát chậm không thấp hơn 0,95 lần; vẫn thiếu thì nối lặp có mờ chéo). Số đo cũ: phát chậm dưới 0,85 lần thì tiếng nhạc bắt đầu nhão. Video trên 2 phút nên chọn NH09, NH10 hoặc bộ dài NH11–NH15 (NH02 bị loại vì rè giữa bài).

## Ma trận 8 × 10

**H** hợp · **C** cân nhắc · **K** không nên · ★ đề xuất đầu tiên cho bảng màu đó. Chấm theo tính cách bảng màu và số đo nhạc, **chưa nghe bằng tai**: Trung nghe thử rồi sửa ô nào thấy sai, ghi vào cột "Ghi chú khi dùng thử" của thẻ.

| Bảng \ Nhạc | NH01 | NH02 | NH03 | NH04 | NH05 | NH06 | NH07 | NH08 | NH09 | NH10 |
|---|---|---|---|---|---|---|---|---|---|---|
| M1 Trời trong | H ★ | H | H | H | H | H | H | C | H | H |
| M2 Lá non | H | H | C | H | H | C | H | K | H | H ★ |
| M3 Đào & oải hương | H | H | C | H | H | C | H | K | H ★ | H |
| M4 Biển cát | H | H | C | C | H ★ | C | C | K | H | H |
| M5 Kẹo pop | H | C | H | H | C | H | H ★ | H | H | H |
| M6 Đêm xanh neon | C | H | H ★ | H | H | H | H | H | C | K |
| M7 Than chì & chanh | C | C | H | C | C | H | C | H ★ | C | K |
| M8 Tím đêm | C | H | H | H ★ | H | H | H | C | C | K |

Tổng: 52 ô Hợp, 22 ô Cân nhắc, 6 ô Không nên. Lý do các ô C và K:

1. Bảng nền tối (M6, M7, M8) với NH10 (indie pop mộc, tiếng ghi-ta ban ngày): K — hình ban đêm, nhạc ngoài trời nắng.
2. Bảng nền tối với nhạc doanh nghiệp lạc quan sáng sủa (NH01, NH09): C.
3. Bảng mềm hoặc điềm tĩnh (M2, M3, M4) với NH08 (house to, nặng tiếng trầm): K; với NH03 (nhịp 136) và NH06 (trầm đều): C.
4. M4 Biển cát với điện tử sáng (NH04, NH07): C — điện tử hợp với bảng xanh, neon hơn bảng cổ điển.
5. M5 Kẹo pop với nhạc chậm có đoạn nhỏ (NH02, NH05): C — hình rất vui mà nhạc lắng.
6. M7 công nghiệp với nhạc nhẹ (NH01, NH02, NH04, NH05, NH07, NH09): C — hình mạnh, nhạc mỏng.
7. M1 và M8 với NH08: C — house nặng hơn mức tươi của M1 và mức bí ẩn của M8.

## Cách đề xuất ở cửa chọn dựng (bước 4)

Khi đã chốt D-09b, đề xuất tiếp **một bảng màu và một bài**, không đưa cả 80 tổ hợp: chọn bảng theo cột "Hợp chủ đề", lấy bài ★ của bảng đó, kèm một vế không hợp theo đúng công thức ba vế ở `03_kich_ban_va_loi_viet.md` mục 3. Trung không nói gì về màu thì dùng M0 như cũ.

## Ghi chú khi dùng thử

| Ngày | Tổ hợp | Video | Trung nhận xét |
|---|---|---|---|
| 2026-10-26 | M0 · NH09 Coffee or Tea | `san_pham/2026.10.26.Cấu tạo chi tiết của Inverter điện mặt trời/2026.10.26.inverter_d09b_v1_cuoi.mp4` (117,9 giây; bài 125 giây nên không phải phát chậm hay nối lặp; âm lượng 0,18) | Duyệt bản nháp không sửa; chưa nhận xét riêng về nhạc |
| 2026-10-26 | M0 · NH10 Just Keep Walking | `san_pham/2026.10.26.hop_so_tuabin/2026.10.26.hop_so_tuabin_d09b_v1_nhap.mp4` (152,6 giây; bài 125 giây nên nối lặp hai bản; âm lượng 0,17) | Chưa xem |
| 2026-10-26 | M0 · Infinity (bản dự phòng của thẻ gốc) | `san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/2026.10.26.bess_d09b_v2_cuoi.mp4` (118,6 giây; bài 102,9 giây nên nối lặp hai bản; âm lượng 0,16) | Duyệt bản v2; nhận xét ở v1 về hình và giọng, không nói về nhạc |
