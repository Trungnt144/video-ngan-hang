---
name: dung-hoat-canh-3d-blender
description: "Dựng cảnh hoạt cảnh 3D tả thực bằng Blender Cycles từ mô hình 3D tải về, kiểu kênh Jared Owen (thẻ phong cách dựng D-11 Phòng chụp & viền sáng): bộ phận bay vào lắp thành máy, tách rời lộ bên trong rồi lắp lại, máy quay lướt nhanh, độ sâu trường ảnh, viền xanh ngọc và nhãn chữ ghép trong Remotion khớp giọng đọc. Là MỘT LỰA CHỌN cho video khoa học ngang (giai đoạn 3), không phải cách mặc định. Dùng khi Trung nói: dựng bằng Blender, hoạt cảnh 3D, làm kiểu Jared Owen, tông D-11, dùng mô hình 3D tải về, tách rời lắp lại, cảnh 3D tả thực, tìm mô hình 3D. KHÔNG dùng cho: sơ đồ 3D, bản đồ, mặt cắt khối đơn giản (dùng Three.js trong Remotion, module 10 mục 6 và thẻ D-09b); video ngắn dọc (module 09); khi chưa có mô hình chi tiết có giấy phép rõ."
version: 1.0.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-27
  related_skills: [remotion-render]
  du_an_mau: xuong_dai/d11_lrv
---

# Dựng hoạt cảnh 3D bằng Blender

Skill này gói cách làm của hai cảnh thử D-11 (26–27/10/2026): lần 1 buồng máy tua-bin gió (Trung chê: chưa đạt), lần 2 xe tự hành Mặt Trăng LRV (bản nháp `san_pham/2026.10.26.canh_thu_d11_lrv/2026.10.27.canh_thu_d11_lrv_v2_nhap.mp4`). Dự án mẫu chạy được: `xuong_dai/d11_lrv/`. Khuôn mã chép sẵn trong `khuon/` của skill này. Bài học đầy đủ: `bai_hoc.md`. Cách tìm mô hình: `tim_mo_hinh.md`.

## Khi nào chọn cách này

Blender Cycles mô phỏng đường đi của tia sáng, nên ra bóng đổ mềm, kim loại phản chiếu, ánh sáng dội, nhoè chuyển động và hậu cảnh nhoè giống ảnh chụp. Cái giá là thời gian: khoảng 13 giây mỗi khung ở bản nháp 960×540 trên Mac M5, gấp khoảng 4 lần ở 1920×1080.

| Tình huống | Chọn |
|---|---|
| Máy móc, xe, thiết bị thật; cần cận cảnh bề mặt; **có sẵn mô hình chi tiết hợp giấy phép** | Skill này |
| Sơ đồ 3D, bản đồ, mặt cắt khối đơn giản, mũi tên dòng điện; cần sửa nhiều lần | Three.js trong Remotion (D-09b) |
| Không có mô hình chi tiết, phải tự dựng bằng khối cơ bản | Three.js. Lần thử 1 cho thấy Cycles trên mô hình khối cơ bản không đẹp hơn Three.js |

**Ước thời gian trước khi hứa (bắt buộc nói với Trung):** 1 phút video = 1.800 khung. Bản nháp khoảng 6,5 giờ máy chạy, bản 1920×1080 khoảng 1 ngày. Vì vậy với video dài, đề xuất trộn: chỉ vài cảnh cận vật thật (tổng 15–40 giây) dựng bằng Blender, phần giải thích còn lại làm bằng Remotion.

## Điều kiện trước khi bắt tay

1. Video thuộc giai đoạn 3 (video khoa học ngang, đang bật). Video thật thì đã qua hai cửa chọn: lối viết kịch bản (KB-xx) và tổ hợp dựng CL-08 · MAU-19 (trước 27/10/2026 gọi D-11; `03_kich_ban_va_loi_viet.md` và `04_he_truc_dung.md`). Cảnh thử lẻ thì bỏ qua.
2. Có mô hình: Trung đã chọn từ bảng ứng viên (bước 1). **Không tự mua, không tự tải** khi Trung chưa đồng ý; khi xin phép tải nêu tên file, nguồn, dung lượng.
3. Ổ đĩa còn chỗ: mô hình 1–4 GB, ảnh kết xuất khoảng 2 GB cho 15 giây (ảnh màu và ảnh mặt nạ).

## Các bước

**1. Tìm và chọn mô hình** (`tim_mo_hinh.md`). Lập bảng 2–3 ứng viên: nguồn, giấy phép, số đa giác, định dạng, giá, có đủ bộ phận lời thoại nhắc tới không. Hỏi Trung bằng bảng chọn. Tải về `tai_san/mo_hinh_3d/<ten>/` (thư mục này bị loại khỏi git, chỉ `README.md` vào git). README ghi nguồn, giấy phép, các file vân phải thay trước khi đăng công khai.

**2. Kiểm cấu tạo.** Mở mô hình không giao diện, liệt kê nhóm vật (collection) và tên vật, đối chiếu với ảnh tư liệu và với kịch bản. Thiếu bộ phận lời thoại nhắc tới thì sửa lời hoặc đổi mô hình, không hứa hình không có.

```bash
~/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec "<mô hình>.blend" --python-expr "import bpy; [print(c.name, len(c.all_objects)) for c in bpy.data.collections]"
```

**3. Viết lời và kiểm chứng.** Kịch bản `san_pham/yyyy.mm.dd.<chủ_đề>/tai_nguyen/kich_ban/yyyy.mm.dd.<ten>_v<n>.md` và `.chuong.json` (mỗi video một thư mục, `AGENTS.md` mục Quy ước sản phẩm) (trường `text` chính tả, trường `doc` phiên âm cho giọng máy). Mỗi số liệu khớp hai nguồn, ghi `kich_ban/<ten>.nguon_kiem_chung.md`.

**4. Tạo dự án dựng.** Chép `xuong_dai/d11_lrv/` sang `xuong_dai/<ten>/`, không chép `node_modules/`, `public/blender_*`, `out/`; rồi `npm install`. Hoặc lấy bốn file trong `khuon/` của skill này. Đổi id thành phần trong `src/Root.tsx`.

**5. Giọng đọc và mốc thời gian.**

```bash
.venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban san_pham/<thư mục video>/tai_nguyen/kich_ban/<ten>.chuong.json --ra xuong_dai/<ten>/public/giong_goc
.venv_vieneu/bin/python scripts/moc_tung_tu.py --kich-ban san_pham/<thư mục video>/tai_nguyen/kich_ban/<ten>.chuong.json --giong xuong_dai/<ten>/public/giong_goc
cd xuong_dai/<ten> && python3 -I tao_thoi_gian.py
```

Trong `tao_thoi_gian.py` sửa: đường dẫn file `.chuong.json` và bảng `TU_KHOA` (tên mốc → câu thứ mấy, chữ đầu của từ). Kết quả `src/thoi_gian.json` là nguồn mốc chung: Blender đặt chuyển động theo nó, Remotion hiện viền và nhãn theo nó. Đọc lại giọng thì chạy lại lệnh này và kết xuất lại Blender.

**6. Viết hoạt cảnh** (`canh3d/dung_blender.py`). Các chỗ phải sửa theo mô hình mới:

| Khối trong script | Sửa gì |
|---|---|
| Dọn đèn, trời, ba đèn vùng, sàn bắt bóng | Vị trí đèn và độ cao sàn `SAN_Z` theo kích thước mô hình |
| `LAP` | Danh sách nhóm vật bay vào lắp ráp, hướng bay, khung bắt đầu |
| Nhóm tách rời (`BANH_TT`, `PIN`) và các mốc `F_...` | Bộ phận nào tách ra, nhấc lên, lúc nào, bao xa |
| `MOC_MQ` | Các vị trí máy quay: khung, vị trí, điểm nhìn, ống kính mm, f-stop, kiểu nối (`em` êm, `nhanh` lướt rồi hãm gấp) |
| `MAT_NA`, `MAU_NA` | Bộ phận nào được viền sáng, mỗi bộ phận một kênh màu đỏ, lục hoặc lam (tối đa 3 bộ phận mỗi cảnh) |

Mọi chuyển động của vật đặt bằng `delta_location` khoá từng khung, không đụng vị trí gốc. Chỉnh bố cục bằng vài khung lẻ trước:

```bash
~/Applications/Blender.app/Contents/MacOS/Blender -b --disable-autoexec "<mô hình>.blend" -P canh3d/dung_blender.py -- --luot mau --ti-le 25 --mau 8 --khung 0,150,300
```

Mở các ảnh vừa ra trong `public/blender_nhap/` để xem bố cục, chỉnh rồi chạy lại cho tới khi đạt.

**7. Kết xuất nháp.** Chạy nền (mất hàng giờ), mỗi lượt ghi nhật ký vào `out/`; script tự bỏ qua khung đã có, nên dừng giữa chừng thì chạy lại lệnh cũ.

```bash
B=~/Applications/Blender.app/Contents/MacOS/Blender; M="<mô hình>.blend"
$B -b --disable-autoexec "$M" -P canh3d/dung_blender.py -- --luot mau --ti-le 50 --mau 24 > out/ket_xuat_mau.txt 2>&1
$B -b --disable-autoexec "$M" -P canh3d/dung_blender.py -- --luot mat_na --ti-le 50 > out/ket_xuat_mat_na.txt 2>&1
```

**8. Ghép trong Remotion** (`src/Video.tsx`). Sửa `KENH` (tên bộ phận ↔ kênh màu mặt nạ), mảng `NHAN` (chữ, toạ độ, mũi tên, mốc hiện), mảng `VIEN`. Soát vài khung bằng `npx remotion still`, rồi kết xuất:

```bash
npx remotion render src/index.ts <IdThanhPhan> out/nhap.mp4 --codec=h264
```

**9. Soát và giao.** Cắt khung từ chính file mp4 (`scripts/soat_khung_mp4.py`), kiểm nhãn đè vật, tràn mép, viền lệch. Chép vào `san_pham/yyyy.mm.dd.<ten>_v<n>_nhap.mp4`, kèm lệnh `open`. Trung duyệt bản nháp rồi mới chạy 1920×1080 (`--ti-le 100 --thu-muc blender`, đổi `THU_MUC` trong `Video.tsx`): đây là lượt tốn cả ngày, phải hỏi trước.

**10. Ghi lại.** Số đo (giây mỗi khung, tổng thời gian) vào `tai_san/nhat_ky_video_ngang.md` mục 20; lỗi mới vào `bai_hoc.md` của skill này và `90_bai_hoc.md`; kết quả dùng thử vào mục "Kết quả dùng thử" ở cuối file kịch bản (`04_he_truc_dung.md` mục 6.3; từ 27/10/2026 không ghi vào thẻ D-11); nhật ký `99_nhat_ky.md`; commit đúng file mình sửa.

## Chỗ Trung phải quyết (hỏi bằng bảng chọn)

- Bước 1: chọn mô hình (giấy phép, giá, dung lượng).
- Trước bước 7: độ dài phần Blender trong video và thời gian máy chạy ước tính.
- Sau bước 9: duyệt bản nháp; có chạy bản 1920×1080 không.
- Trước khi đăng công khai: đã thay các file vân chưa rõ nguồn chưa (`13_ban_quyen_va_bao_mat.md`).
