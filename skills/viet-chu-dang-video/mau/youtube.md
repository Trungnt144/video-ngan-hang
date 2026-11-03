# Chữ đăng YouTube: <tên video đời thường>

> Thư mục video `san_pham/<yyyy.mm.dd.chu_de>/` · viết <dd/mm/yyyy> · Trung duyệt <dd/mm/yyyy hoặc "chưa">
> Video: `<file ngoài cùng thư mục, không tên nền tảng hoặc _youtube_>` (<rộng>×<cao>, <giây> giây, <số> chương).
> Từ khoá chính: "<cụm từ>" (nguồn: <san-trend file / gợi ý tìm kiếm YouTube ngày …>).
> Bảng kiểm `kiem_chu_dang.py`: <n> lỗi, <n> nhắc (chạy <dd/mm/yyyy>).

Mỗi ô nằm trong một khung riêng: bấm nút chép của khung là chép đúng một ô. Không đổi dòng `#### khối · ô`, script đọc theo dòng này.

## Thông tin cho lệnh chuyển

`xuat_ke_khai.py` đọc khối này để sinh file kê khai cho skill `dang-youtube`. `ma_youtube` là mã video trong `du_lieu/dang_youtube/so_trang_thai.jsonl` (mã sổ nợ hoặc mã lô); `madeForKids` và `containsSyntheticMedia` là lời khai thay chủ kênh, Trung duyệt. `giong_may: true` khi video dùng giọng VieNeu, kéo theo `nhan_ai_facebook: true`.

#### thong_tin · json

```json
{
 "ma_youtube": "<mã>",
 "tu_khoa_chinh": "<cụm từ>",
 "madeForKids": false,
 "containsSyntheticMedia": false,
 "giong_may": true,
 "nhan_ai_tiktok": false,
 "nhan_ai_facebook": true,
 "playlistTitles": ["<tên danh sách phát>"]
}
```

#### youtube_dai · tieu_de

```text
<tiêu đề đang dùng, ≤ 100 ký tự, nên ≤ 70>
```

#### youtube_dai · mo_ta

```text
<MỘT đoạn văn 50–70 từ (không tính hashtag): câu đầu có từ khoá chính và nêu câu hỏi video trả lời; câu sau kể gọn các ý chính theo thứ tự trong video. Không nêu nghị định, thông tư, luật; không mốc chương, không link, không dòng cách làm video>

#chude1 #chude2 #chude3 #nangluongtaitao #chuyennghedien

<chân mô tả kênh, chép nguyên khối trong chan_mo_ta.md>
```

#### youtube_dai · the

```text
<thẻ 1>, <thẻ 2>, <thẻ không dấu cho từ hay gõ sai>
```

Ô cần chọn khi đăng (YouTube Studio, hoặc file kê khai đã có sẵn):
- AI use (mục Attributes): <Có/Không> và vì sao.
- Dành cho trẻ em: Không. Ngôn ngữ: Tiếng Việt. Danh mục: <Khoa học và công nghệ / Giáo dục>.

## Ba phương án tiêu đề

1. <phương án 1, kiểu câu hỏi> (đang dùng)
2. <phương án 2, kiểu nêu con số>
3. <phương án 3, kiểu liệt kê thành phần>
