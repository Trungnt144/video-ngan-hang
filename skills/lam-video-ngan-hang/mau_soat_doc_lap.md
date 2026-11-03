# Phiếu soát độc lập hình video

Dùng ở bước 6 của skill `lam-video-ngan-hang`, sau khi đã qua cổng máy đo. Người soát phải là MỘT PHIÊN MỚI của Antigravity (Gemini 3.8 Flash) không dính ngữ cảnh lúc dựng video: phiên đã dựng sẽ khen hình của chính mình. Phiên soát không được sửa mã, chỉ đọc ảnh và ghi nhận xét.

**Bản 2 (03/11/2026, tối).** Bản 1 chỉ hỏi chuyển động, số chữ, cỡ chữ; người soát tả lại vật trên hình rồi tự gán nghĩa ("vầng hào quang báo động đỏ") và chấm đạt cả 8 chương của N301, dù hình không giải thích khái niệm. Bản 2 bắt người soát đoán khái niệm từ ảnh TRƯỚC khi đọc kịch bản (phép thử tắt tiếng, luật 2 của `chuan_hinh_video_ngang.md`), rồi mới so với câu cơ chế; đoán sai là mức nặng.

Cách mở phiên soát: trong app Antigravity, mở hội thoại MỚI trong project VideoNganHang và dán nội dung "Phiếu" bên dưới (thay `<…>`), hoặc chạy ở gốc project:

```bash
agy -p "$(cat <đường dẫn phiếu đã điền>)" --project VideoNganHang --model <model Gemini 3.8 Flash của tài khoản> --print-timeout 900 > <thư mục video>/tai_nguyen/ban_nhap/<tên>_soat_doc_lap.md
```

(Lệnh `agy -p` chưa thử trong project này; nếu không đọc được ảnh thì dùng hội thoại mới trong app.)

## Phiếu (dán nguyên văn)

Bạn là người soát độc lập hình của một video giải thích ngân hàng. KHÔNG sửa file nào. Chỉ đọc ảnh và viết nhận xét. Làm đúng thứ tự các bước; không mở kịch bản, `nhip.json`, `SO_VONG_SUA.md` trước bước 4.

Bước 1. Phép thử tắt tiếng. Mở các ảnh tĩnh của video trong `<thư mục ảnh tĩnh>` (mỗi chương ít nhất hai ảnh cách nhau vài giây). Che hoặc bỏ qua dải phụ đề dưới đáy ảnh, chỉ nhìn hình và nhãn trên hình. Với mỗi chương viết một câu: "Chỉ nhìn hình, chương này giải thích …". Liệt kê thêm mọi vật trên hình mà bạn không nói được nó là đại lượng nào (vòng sáng, chấm, đường nét đứt, vật lắc, hàng chấm dưới cột…). Viết xong bước này rồi mới sang bước 2; không sửa câu đoán sau đó.

Bước 2. Mở hai ảnh mẫu:
- `tai_san/anh_chuan_hinh/n199_chuan_dat_12_khung.jpg` (ĐẠT về độ thoáng, ít chữ, vật chính to). Đây không phải mẫu về hình nên vẽ: bể, vòi, hạt của n199 đúng với tiền gửi chảy vào ngân hàng, không đúng với khái niệm khác.
- `tai_san/anh_chuan_hinh/n301_khong_dat_12_khung.jpg` (KHÔNG ĐẠT: thẻ chữ dày, chữ nhỏ, như slide).

Bước 3. Đọc luật ở `skills/lam-video-ngan-hang/chuan_hinh_video_ngang.md` mục 2.

Bước 4. Mở `<thư mục dựng>/nhip.json` (mảng `nhip`, trường `co_che` của từng chương) và kịch bản `<thư mục video>/tai_nguyen/kich_ban/<tên>.chuong.json`. Nếu `nhip.json` không có `co_che` thì tự rút một câu cơ chế từ kịch bản chương đó và ghi rõ là tự rút.

Bước 5. Với MỖI chương, trả lời đúng bảng này (một dòng mỗi chương):

| Chương | Câu đoán ở bước 1 | Câu cơ chế (`co_che` hoặc tự rút) | Đoán có khớp cơ chế không | Hình chính là gì (vật gì đang làm gì) và có phải chỉ là biểu tượng nhân vật (nhà xưởng, toà nhà, người) không | Vật không mang nghĩa (từ bước 1) | Chuyển động giữa hai ảnh có phải là đại lượng đang đổi không | Số từ trên hình (đếm tay, không tính phụ đề) | Chữ nào khó đọc trên điện thoại | Mức: nặng / vừa / nhẹ / đạt |

Quy tắc chấm:
- Nặng: câu đoán ở bước 1 không khớp câu cơ chế; hình chính chỉ là biểu tượng nhân vật, không vẽ các đại lượng trong câu cơ chế; chuyển động duy nhất là vật trang trí (vòng sáng phập phồng, chấm chạy, vật lắc) chứ không phải đại lượng đang đổi; hình chính là thẻ chữ, bảng chữ, đoạn văn; chữ chồng lên nhau; có tên, logo ngân hàng thật.
- Vừa: có vật không mang nghĩa nằm cạnh một hình chính đúng; hơn 12 từ trên hình; có chữ nhỏ khó đọc; số trên hình khác file `du_kien.json`; nhãn thiếu tới mức phải đọc phụ đề mới biết khối nào là đại lượng nào.
- Nhẹ: lệch căn, khoảng cách, màu chưa đẹp.

Bước 6. Cuối cùng viết: số chương nặng, vừa, nhẹ, đạt; và kết luận một dòng "ĐẠT để chạy pha máy" khi không còn nặng và không quá 2 chương vừa, nếu không thì "KHÔNG ĐẠT, sửa các chương: …". Đừng khen chung chung; mỗi nhận xét phải trỏ tới một ảnh cụ thể. Không tự gán nghĩa cho một vật mà hình không nói rõ: vật nào phải đọc phụ đề mới hiểu thì ghi là vật không mang nghĩa.

## Sau khi nhận kết quả soát

Phiên dựng sửa mọi mục nặng và vừa, chụp lại ảnh tĩnh các chương đã sửa, chạy lại cổng máy đo, rồi mở phiên soát mới một lần nữa cho các chương đã sửa. Ghi cả hai vòng vào `SO_VONG_SUA.md` (như đợt C của n199). Không qua bước pha máy khi bản soát cuối còn mục nặng.
