# Khuôn mã dựng hoạt cảnh 3D

Bốn file chép nguyên từ dự án mẫu `xuong_dai/d11_lrv/` ngày 27/10/2026 (cảnh xe LRV, 13,7 giây). Dùng làm điểm xuất phát cho dự án mới; dự án mẫu đầy đủ (có `package.json`, `remotion.config.ts`, giọng, nhạc) vẫn ở `xuong_dai/d11_lrv/`.

| File | Đặt vào dự án mới tại | Phải sửa |
|---|---|---|
| `tao_thoi_gian.py` | `xuong_dai/<ten>/` | Đường dẫn `.chuong.json`; bảng `TU_KHOA` |
| `dung_blender.py` | `xuong_dai/<ten>/canh3d/` | Tên vật và nhóm vật theo mô hình mới: `LAP`, nhóm tách rời, mốc `F_...`, `MOC_MQ`, `MAT_NA`; vị trí đèn, `SAN_Z` |
| `Video.tsx` | `xuong_dai/<ten>/src/` | `KENH`, `NHAN`, `VIEN`; đường dẫn giọng và nhạc |
| `Root.tsx` | `xuong_dai/<ten>/src/` | Id thành phần |

Phần không phải sửa: dọn đèn và máy quay của tác giả, trời xám phòng chụp, sàn bắt bóng, hàm nối chuyển động (`muot`, `nhanh`, `ra_dan`), hàm `dat_khoa`, thiết lập Cycles và Workbench, vòng lặp kết xuất bỏ qua khung đã có; bên Remotion: bộ lọc viền xanh ngọc, mũi tên, nhãn, phụ đề. Bảng màu D-11 nằm ở hằng `MAU` trong `Video.tsx` và trời `#8a8f9e` trong `dung_blender.py`.
