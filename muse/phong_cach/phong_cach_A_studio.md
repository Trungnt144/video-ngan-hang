# Phong cách A — studio kỹ thuật sáng

> Bản 1.0 · 08/11/2026 · Chủ kênh chốt 07/11/2026 (chỉ dùng A trong ba hướng mẫu Muse làm: A studio sáng sạch, B thực địa điện ảnh, C macro kịch tính; mẫu đầu nền tối bị loại vì xấu, ít chi tiết).
> Lấy từ báo cáo làm việc của Muse ngày 07/11/2026 (`02_Muse_gui_Mac/Pin_mat_troi_2026.11.07/BAO_CAO_LAM_VIEC.md` trên Drive) và sáu ảnh của bộ đó. Mã trong phiếu: `"phong_cach": "A_studio"`.

## 1. Nhận diện

Ảnh chụp sản phẩm kỹ thuật trong phòng chụp: vật thể sạch, sắc nét, đặt trên nền gradient, có ánh sáng mềm và phản chiếu nhẹ dưới chân. Người xem thấy vật liệu thật (kính, nhôm xước mịn, silicon, nhựa) nhưng khung hình gọn, không có bối cảnh thừa.

| Yếu tố | Quy định |
|---|---|
| Nền | Gradient teal đậm ở góc trên trái (khoảng `#1E4A55`) sang bạc sáng ở bên phải (khoảng `#C9D6DA`). Không hoạ tiết, không vật thể nền |
| Sàn | Mặt sàn bóng mờ cùng tông, phản chiếu vật thể yếu và nhoè dần. Sàn có thể nằm trong dải phụ đề vì là nền trơn |
| Ánh sáng | Đèn chính mềm từ trên bên phải, đèn viền lạnh làm sáng mép kính và mép nhôm; không bóng đổ gắt; nhiệt độ màu lạnh trung tính |
| Vật liệu | Kính trong có cạnh xanh nhạt và phản xạ đốm; nhôm xước mịn màu bạc; tế bào silicon xanh đậm có lưới bạc mảnh; tấm nền mặt sau trắng sữa; nhựa bao EVA trong, hơi đục |
| Máy chụp | Góc nhìn ba phần tư hoặc nhìn chéo từ trên 20–30 độ; tiêu cự dài vừa (tương đương 85–100 mm), ít méo phối cảnh; độ sâu trường ảnh đủ để toàn bộ vật thể nét |
| Độ tương phản | Vừa phải, đủ để Claude đặt lớp hạt màu và nhãn chữ trắng hoặc đen lên mà vẫn đọc được |
| Hiệu ứng màu | Chỉ có ở biến thể phiếu yêu cầu (ánh nóng cam, xanh điện, tím). Tấm gốc không có tia sáng, đốm phát quang, sóng nhiệt |

Màu của hiệu ứng trong biến thể phải khớp màu lớp hoạt hình của Claude; mã màu ghi ở trường `mau_co_che` của từng phiếu.

## 2. Không dùng

- Nền tối, nền đen, khói, tia sáng thể tích kiểu phim (đó là hướng B, C đã loại).
- Bố cục tách lớp bay lơ lửng khi phiếu yêu cầu mặt cắt liền khối, và ngược lại.
- Hiệu ứng phát sáng, hạt sáng, dòng điện vẽ sẵn trong ảnh (Claude vẽ bằng mã).
- Chữ, logo, nhãn giả trên vật (hộp nối, tem tấm pin, bao bì).

## 3. Ảnh mẫu (`anh_mau/`)

| File | Lấy gì | Không lấy gì |
|---|---|---|
| `anh_mau/hero.webp` | Nền, sàn, ánh sáng, chất kính và nhôm, góc ba phần tư. Ảnh đạt nhất của bộ 07/11 | Khổ 1920×1280: phiếu mới yêu cầu 1920×1080 |
| `anh_mau/pin_a_mat_cat.webp` | Chất liệu từng lớp, ánh sáng khi có nhiều lớp mỏng | Cấu tạo: thiếu lớp EVA dưới tế bào, hộp nối gắn vào khung nhôm (thật ra gắn ở mặt sau tấm nền), các lớp tách rời thay vì mặt cắt liền khối |

Ảnh `lid.webp` (khối silicon dạng pha lê) và `pid.webp` (tế bào vẽ thành hộp rỗng, dòng sáng vẽ sẵn) **không** là mẫu: sai cấu tạo hoặc vẽ cơ chế vào ảnh.

## 4. Khuôn câu lệnh tạo ảnh

Báo cáo ngày 07/11 không chép câu lệnh Muse đã dùng. Khuôn dưới đây viết lại từ ảnh đạt; câu lệnh bằng tiếng Anh vì model tạo ảnh bám tiếng Anh tốt hơn. Muse thay phần trong ngoặc nhọn bằng nội dung của phiếu, gắn ảnh khung bố cục làm ảnh tham chiếu bố cục.

```
Photorealistic technical studio product shot, 16:9, 1920x1080.
Subject: {mo_ta của phiếu, dịch sang tiếng Anh}.
Composition: follow the attached layout reference exactly; each labeled gray box marks where that part must sit.
Keep the bottom 180 px and the right column {toạ độ vung_sach} empty: plain background only.
Camera: {goc_may}, long lens (~90 mm equivalent), minimal perspective distortion, everything in focus.
Lighting: soft key light from upper right, cool rim light on glass and aluminium edges, no harsh shadows.
Background: smooth gradient from deep teal (upper left) to light silver (right), glossy floor with faint fading reflection.
Materials: clear tempered glass with pale green edge, brushed aluminium, dark blue silicon cells with thin silver fingers, milky white backsheet.
No text, no numbers, no labels, no logos, no watermark, no glowing particles, no light rays.
```

Biến thể (chế độ chỉnh ảnh, đầu vào là tấm gốc):

```
Edit the attached image. Keep geometry, camera angle, framing, background and lighting identical.
Only change: {mo_ta của biến thể}. Do not add text, particles or new objects.
```

## 5. Câu lệnh đã đạt

Claude chép vào đây câu lệnh trong `bao_cao_tai_nguyen.json` của các ảnh qua nghiệm thu, ghi video và ngày.

| Video · ngày | Cảnh · biến thể | Câu lệnh | Ghi chú |
|---|---|---|---|
| (chưa có) | | | |
