# Hướng dẫn cho Muse — tạo tài nguyên hình cho video của kênh

> Bản 1.0 · 08/11/2026 · Áp cho kênh Chuyện nghề Điện và Chuyện nghề Ngân hàng của Thành Trung Nguyễn.
> Căn cứ: quyết định của chủ kênh ngày 07/11/2026 sau bản dựng lại video pin mặt trời. Ảnh của Muse đẹp hơn và rẻ hơn, nhưng mỗi chương dùng một vật thể khác, cơ chế chỉ là gạch đầu dòng chồng lên ảnh tĩnh, một ảnh sai cấu tạo, giọng không có bước nghe lại. Từ nay việc chia như sau: **Muse tạo vật thể tả thực, Claude vẽ việc đang xảy ra trên vật thể đó.**
>
> Thư mục `muse/` này chỉ chứa quy tắc. Dữ liệu của từng video (kịch bản, phiếu đặt hình, khung bố cục) nằm trên Google Drive, thư mục "Muse-Claude". Repo này công khai: Muse không đẩy file nào lên GitHub.

## 1. Muse làm gì

Muse chỉ tạo bốn loại tài nguyên, và chỉ những cảnh có trong phiếu đặt hình:

| Loại (`loai` trong phiếu) | Là gì | Dùng ở đâu trong video |
|---|---|---|
| `nen_muse` | Tấm nền tả thực 1920×1080: vật thể, mặt cắt, nhà xưởng, quầy giao dịch… Không chữ. | Claude đặt lớp hoạt hình cơ chế (hạt, mũi tên, nhãn, đường cong) lên trên, đúng toạ độ vùng neo |
| biến thể của `nen_muse` | Cùng tấm gốc, cùng góc máy, chỉ đổi trạng thái vật liệu hoặc ánh sáng màu (ví dụ lớp silicon ngả nóng) | Người xem so nhiều trạng thái trên cùng một vật |
| `clip_muse` | Clip 5–10 giây cho cảnh mở đầu, chuyển chương, bối cảnh. Tối đa 3 clip mỗi video | Chỉ ở chỗ không cần đúng cơ chế |
| `hinh_thu_nho` | Ảnh nền cho hình thu nhỏ YouTube, chừa vùng chữ | Claude đặt chữ tiêu đề lên trên |

## 2. Muse không làm

1. **Không viết lại kịch bản**, không sửa lời, không thêm hay bớt câu. File `kich_ban.chuong.json` gửi kèm chỉ để Muse hiểu ngữ cảnh.
2. **Không làm giọng đọc.** Giọng làm trên máy Mac của chủ kênh, có bước máy nghe lại.
3. **Không dựng, không kết xuất video**, không ghép nhạc, không làm phụ đề.
4. **Không đặt chữ, số, nhãn, logo, hình đóng dấu** vào ảnh hay clip. Mọi chữ do Claude đặt bằng mã để sửa được và đúng chính tả tiếng Việt.
5. **Không vẽ cơ chế** (hạt di chuyển, dòng điện, mũi tên, đồ thị, bảng). Phần đó Claude vẽ bằng mã theo từng câu.
6. Không tạo cảnh ngoài phiếu, không đổi góc máy giữa các biến thể, không thêm vật thể phiếu không nhắc.
7. Không ghi vào `03_Cho_duyet/`, `04_Ban_cuoi/`; không đổi tên file `_nhap` thành `_cuoi`; không đăng lên YouTube hay mạng xã hội.
8. Không dùng tên, logo, màu nhận diện của ngân hàng, công ty, hãng thật; không vẽ người nhận diện được.

## 3. Đường Drive (thư mục "Muse-Claude")

```
Muse-Claude/
  01_Mac_gui_Muse/<ma_video>/    Claude gửi: phieu_dat_hinh.json, kich_ban.chuong.json, phan_canh.md,
                                 khung_bo_cuc/<id>.png, tham_chieu/*, phieu_sua.json (khi có vòng sửa)
  02_Muse_gui_Mac/<ma_video>/    Muse gửi: nen/*.webp, clip/*.mp4, hinh_thu_nho/*.png, bao_cao_tai_nguyen.json
  03_Cho_duyet/                  Claude đặt bản nháp video. Muse không ghi
  04_Ban_cuoi/                   bản chủ kênh đã duyệt. Muse không ghi
```

`<ma_video>` lấy đúng trường `ma_video` của phiếu (ví dụ `pin_mat_troi`). Muse chỉ đọc `01_…` và chỉ ghi `02_…/<ma_video>/`.

## 4. Trình tự làm một video

1. Đọc file này, file phong cách mà phiếu ghi (`muse/phong_cach/phong_cach_<mã>.md`), rồi `phieu_dat_hinh.json`.
2. Với mỗi cảnh có `loai` là `nen_muse`, `clip_muse` hoặc `hinh_thu_nho` và `trang_thai` là `dat_moi`:
   - Mở ảnh khung bố cục `khung_bo_cuc/<id>.png`. Đây là ảnh xám có các ô ghi tên vùng (ví dụ "kinh", "de_silicon") ở đúng toạ độ. Dùng ảnh này làm **ảnh tham chiếu bố cục** khi tạo ảnh: vật thể phải nằm đúng các ô đó.
   - Tạo **tấm gốc** (biến thể đầu tiên trong `bien_the`) theo `mo_ta`, `goc_may`, `anh_sang`.
   - Tạo từng biến thể còn lại **bằng cách sửa tấm gốc** (chế độ chỉnh ảnh từ ảnh có sẵn), không tạo lại từ đầu: chỉ đổi vùng và màu mà mục biến thể mô tả.
   - Tự kiểm theo `muse/bang_kiem_tai_nguyen.md` và mục `kiem_cau_tao` của cảnh. Trượt mục nào thì tạo lại trước khi gửi.
3. Cảnh có `trang_thai` là `dung_lai` (dùng lại ảnh Muse đã làm) hoặc `loai` là `ma_claude`: không làm gì.
4. Đặt file vào `02_Muse_gui_Mac/<ma_video>/` theo tên ở mục 6, viết `bao_cao_tai_nguyen.json` theo `muse/mau_bao_cao_tai_nguyen.json`.
5. Báo chủ kênh một dòng: đã gửi gì, cảnh nào chưa làm được và vì sao.

## 5. Quy tắc hình

- **Kích thước:** tấm nền đúng 1920×1080 (16:9). Không gửi 1920×1280 hay tỷ lệ khác. Hình thu nhỏ 1280×720.
- **Định dạng:** tấm nền WebP chất lượng 90 trở lên (hoặc PNG); clip MP4 H.264, 1920×1080, 24–30 khung/giây, không tiếng; hình thu nhỏ PNG.
- **Vùng neo:** mỗi vùng trong `vung_neo` là hình chữ nhật `[x1, y1, x2, y2]` tính bằng điểm ảnh trên khung 1920×1080, gốc toạ độ ở góc trên bên trái. Phần vật thể mang tên vùng đó phải nằm trong ô, mép lệch không quá 20 điểm ảnh. Claude vẽ hạt, mũi tên đúng vào ô này, nên lệch nhiều thì hạt bay ngoài vật thể.
- **Vùng sạch:** `vung_sach` của phiếu (thường là dải dưới cao 180 điểm ảnh cho phụ đề và một cột bên phải cho chú thích) chỉ có nền trơn của phong cách, không vật thể, không chi tiết sáng.
- **Đúng cấu tạo:** ảnh tả thực làm người xem tin hơn ảnh vẽ, nên ảnh sai cấu tạo có hại hơn ảnh vẽ đơn giản. Thứ tự lớp, hình dạng, tỷ lệ phải theo `mo_ta` và `kiem_cau_tao`. Ví dụ đã trượt: tế bào silicon vẽ thành khối pha lê có đốm sáng, trong khi tế bào thật là lát mỏng phẳng có lưới bạc.
- **Biến thể cùng góc máy:** hình học, góc máy, tiêu cự, bố cục, ánh sáng nền giữ nguyên; chồng biến thể lên tấm gốc thì viền vật thể lệch không quá 8 điểm ảnh. Chỉ vùng mà biến thể nêu được đổi màu hoặc phát sáng.
- **Không có chữ** ở bất kỳ đâu trong ảnh, kể cả chữ giả trên nhãn, hộp nối, bao bì.

## 6. Đặt tên file

| Loại | Tên | Ví dụ |
|---|---|---|
| Tấm nền có biến thể | `nen/<id>__<bien_the>.webp` | `nen/nen_mat_cat__nguyen_ven.webp`, `nen/nen_mat_cat__nong_cam.webp` |
| Tấm nền không biến thể | `nen/<id>.webp` | `nen/nha_xuong.webp` |
| Clip | `clip/<id>.mp4` | `clip/mo_dau_canh_dong.mp4` |
| Hình thu nhỏ | `hinh_thu_nho/<id>.png` | `hinh_thu_nho/thu_nho_a.png` |
| Bản sửa ở vòng sửa | thêm `_v2`, `_v3` trước đuôi, giữ bản cũ | `nen/nen_mat_cat__nong_cam_v2.webp` |

`<id>` và `<bien_the>` chép đúng từ phiếu: chữ thường không dấu, nối bằng gạch dưới.

## 7. Báo cáo `bao_cao_tai_nguyen.json`

Theo khuôn `muse/mau_bao_cao_tai_nguyen.json`: mỗi file một mục gồm cảnh, biến thể, tên file, kích thước, câu lệnh tạo ảnh đã dùng, tấm gốc mà biến thể sửa từ đó, kết quả tự kiểm từng mục của bảng kiểm, ghi chú. Cuối báo cáo ghi việc chưa xong và câu hỏi cho Claude. Câu lệnh tạo ảnh đã đạt được Claude chép vào file phong cách để video sau dùng lại.

## 8. Vòng sửa

Claude tải tài nguyên về, đọc từng ảnh, đối chiếu phiếu. Ảnh trượt thì Claude ghi `phieu_sua.json` vào `01_Mac_gui_Muse/<ma_video>/`: mỗi mục ghi cảnh, biến thể, lỗi thấy được, cách sửa. Muse chỉ làm lại đúng các mục đó, gửi bản `_v2`, cập nhật báo cáo (trường `vong` tăng 1). **Tối đa hai vòng sửa**; quá hai vòng thì Claude tự vẽ cảnh đó bằng mã, Muse không cần làm tiếp.

## 9. Các file trong thư mục này

| File | Nội dung |
|---|---|
| `HUONG_DAN_MUSE.md` | file này |
| `phong_cach/phong_cach_A_studio.md` | tông studio sáng, nền gradient teal–bạc (chủ kênh chốt 07/11/2026), khuôn câu lệnh tạo ảnh |
| `phong_cach/anh_mau/` | ảnh mẫu phong cách đã duyệt (chỉ lấy phong cách, cấu tạo theo phiếu) |
| `mau_phieu_dat_hinh.json` | khuôn phiếu đặt hình, mỗi trường có chú thích |
| `mau_bao_cao_tai_nguyen.json` | khuôn báo cáo Muse gửi lại |
| `bang_kiem_tai_nguyen.md` | bảng Muse tự kiểm trước khi gửi; Claude dùng cùng bảng này khi nghiệm thu |
