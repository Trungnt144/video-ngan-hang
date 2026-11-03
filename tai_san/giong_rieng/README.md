# Giọng riêng cho VieNeu-TTS

Thư mục này chứa giọng người thật đã nhân bản cho VieNeu. Mọi thứ ở đây, trừ file README này, nằm ngoài git
vì là dữ liệu sinh trắc học (đủ để giả giọng). Không đưa nội dung thư mục cho phiên Grok hoặc Hermes.
Cách làm đầy đủ: `08_giong_am_thanh_phu_de.md` mục 0b.

| File | Nội dung |
|---|---|
| `goc/<tên>.<đuôi>` | Bản thu gốc |
| `giong_rieng_vieneu.json` | Đặc trưng giọng (dãy số chất giọng, mã âm thanh mẫu) của mọi giọng riêng |
| `nghe_thu/<tên>.wav` | Câu đọc thử sinh ngay sau khi đăng ký |

## Đoạn văn để thu (khoảng 12 giây)

Đọc liền một hơi, giọng kể chuyện, tốc độ vừa. Bắt đầu nói ngay khi bấm thu: VieNeu chỉ dùng 8 giây đầu.
Đoạn văn có đủ sáu thanh của tiếng Việt để máy học cách anh lên xuống giọng.

> Chào các bạn, hôm nay chúng ta cùng tìm hiểu vì sao một tấm pin nhỏ lại có thể biến ánh nắng thành dòng điện.
> Câu trả lời nằm ở hai lớp bán dẫn mỏng, ghép sát vào nhau, và những hạt ê-léc-trôn luôn sẵn sàng chuyển động.

## Cách thu

1. Phòng nhỏ có rèm hoặc tủ quần áo, tắt quạt và điều hoà, đóng cửa sổ.
2. Dùng ứng dụng Ghi âm trên iPhone, hoặc QuickTime trên Mac (Tệp → Bản ghi âm mới). Micro cách miệng khoảng 20 cm.
3. Thu hai ba lần, chọn lần không vấp ở 8 giây đầu.
4. Đăng ký:

```bash
cd ~/Documents/VideoNganHang && .venv_vieneu/bin/python scripts/them_giong_vieneu.py --ten "Trung" --file "<đường dẫn file thu>" --gioi-tinh nam
```
