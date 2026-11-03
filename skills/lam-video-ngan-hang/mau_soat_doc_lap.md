# Phiếu soát độc lập hình video

Dùng ở bước 6 của skill `lam-video-ngan-hang`, sau khi đã qua cổng máy đo. Người soát phải là MỘT PHIÊN MỚI của Antigravity (Gemini 3.8 Flash) không dính ngữ cảnh lúc dựng video: phiên đã dựng sẽ khen hình của chính mình. Phiên soát không được sửa mã, chỉ đọc ảnh và ghi nhận xét.

Cách mở phiên soát: trong app Antigravity, mở hội thoại MỚI trong project VideoNganHang và dán nội dung "Phiếu" bên dưới (thay `<…>`), hoặc chạy ở gốc project:

```bash
agy -p "$(cat <đường dẫn phiếu đã điền>)" --project VideoNganHang --model <model Gemini 3.8 Flash của tài khoản> --print-timeout 900 > <thư mục video>/tai_nguyen/ban_nhap/<tên>_soat_doc_lap.md
```

(Lệnh `agy -p` chưa thử trong project này; nếu không đọc được ảnh thì dùng hội thoại mới trong app.)

## Phiếu (dán nguyên văn)

Bạn là người soát độc lập hình của một video giải thích ngân hàng. KHÔNG sửa file nào. Chỉ đọc ảnh và viết nhận xét.

Bước 1. Mở hai ảnh mẫu để biết thế nào là đạt và không đạt:
- `tai_san/anh_chuan_hinh/n199_chuan_dat_12_khung.jpg` (ĐẠT: hình chuyển động, ít chữ, vật chính to).
- `tai_san/anh_chuan_hinh/n301_khong_dat_12_khung.jpg` (KHÔNG ĐẠT: thẻ chữ dày, chữ nhỏ, như slide).

Bước 2. Đọc luật ở `skills/lam-video-ngan-hang/chuan_hinh_video_ngang.md` mục 2.

Bước 3. Mở các ảnh tĩnh của video cần soát trong `<thư mục ảnh tĩnh>` (mỗi chương ít nhất hai ảnh cách nhau vài giây).

Bước 4. Với MỖI chương, trả lời đúng bảng này (một dòng mỗi chương):

| Chương | Hình chính là gì (một câu, nói vật gì đang làm gì) | Có chuyển động giữa hai ảnh không | Số từ trên hình (đếm tay, không tính phụ đề) | Chữ nào khó đọc trên điện thoại | Giống ảnh đạt hay ảnh không đạt | Mức: nặng / vừa / nhẹ / đạt |

Quy tắc chấm:
- Nặng: hình chính là thẻ chữ, bảng chữ, đoạn văn; hoặc không có chuyển động; hoặc chữ chồng lên nhau; hoặc có tên, logo ngân hàng thật.
- Vừa: hơn 12 từ trên hình; có chữ nhỏ khó đọc; hình không khớp ý lời đọc; số trên hình khác file `du_kien.json`.
- Nhẹ: lệch căn, khoảng cách, màu chưa đẹp.

Bước 5. Cuối cùng viết: số chương nặng, vừa, nhẹ, đạt; và kết luận một dòng "ĐẠT để chạy pha máy" khi không còn nặng và không quá 2 chương vừa, nếu không thì "KHÔNG ĐẠT, sửa các chương: …". Đừng khen chung chung; mỗi nhận xét phải trỏ tới một ảnh cụ thể.

## Sau khi nhận kết quả soát

Phiên dựng sửa mọi mục nặng và vừa, chụp lại ảnh tĩnh các chương đã sửa, chạy lại cổng máy đo, rồi mở phiên soát mới một lần nữa cho các chương đã sửa. Ghi cả hai vòng vào `SO_VONG_SUA.md` (như đợt C của n199). Không qua bước pha máy khi bản soát cuối còn mục nặng.
