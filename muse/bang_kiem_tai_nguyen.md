# Bảng kiểm tài nguyên Muse

> Bản 1.0 · 08/11/2026. Muse tự kiểm từng file trước khi đẩy lên `02_Muse_gui_Mac/<ma_video>/` và ghi kết quả vào trường `tu_kiem` của `bao_cao_tai_nguyen.json`. Claude dùng đúng bảng này khi nghiệm thu; trượt một mục ở nhóm A là trượt ảnh, ghi vào `phieu_sua.json`.

## A. Bắt buộc (trượt là làm lại)

| # | Mục | Cách kiểm | Khoá trong `tu_kiem` |
|---|---|---|---|
| A1 | Đúng kích thước | Tấm nền 1920×1080, hình thu nhỏ 1280×720, clip 1920×1080. Đo trên file thật, không tin thông số lúc tạo | `kich_thuoc_dung` |
| A2 | Không chữ, số, logo, hình đóng dấu | Phóng to từng góc và các bề mặt phẳng (nhãn, hộp nối, bao bì, màn hình). Chữ giả, chữ mờ cũng tính là có chữ | `khong_chu_logo` |
| A3 | Vùng sạch trống | Các ô `vung_sach` của phiếu chỉ có nền trơn của phong cách: không vật thể, không chi tiết sáng, không phản chiếu rõ | `vung_sach_trong` |
| A4 | Vùng neo trùng khung bố cục | Chồng ảnh lên `khung_bo_cuc/<id>.png` (độ mờ 50%): phần vật thể mang tên mỗi ô nằm trong ô, mép lệch tối đa 20 điểm ảnh. Ghi số lệch lớn nhất | `vung_neo_lech_lon_nhat_px` |
| A5 | Đúng cấu tạo | Đọc lại `mo_ta` và từng điều `kiem_cau_tao`: đủ bộ phận, đúng thứ tự, đúng hình dạng (lát mỏng là lát mỏng, không thành khối), không có bộ phận lạ | `dung_cau_tao` |
| A6 | Biến thể cùng góc máy | Chồng biến thể lên tấm gốc: viền vật thể lệch tối đa 8 điểm ảnh; nền, sàn, ánh sáng nền như nhau; chỉ vùng biến thể nêu đổi màu | `cung_goc_may_voi_tam_goc_lech_px` |
| A7 | Không vẽ cơ chế | Không hạt sáng, dòng điện, mũi tên, sóng, tia sáng vẽ sẵn; trừ hiệu ứng màu mà biến thể yêu cầu, và hiệu ứng đó nằm đúng vùng | `khong_ve_co_che` |

## B. Chất lượng (trượt thì ghi chú, Claude quyết)

| # | Mục | Cách kiểm | Khoá |
|---|---|---|---|
| B1 | Đúng phong cách | So với ảnh mẫu trong `muse/phong_cach/anh_mau/`: nền, sàn, ánh sáng, chất liệu | `phong_cach_dung` |
| B2 | Đủ tương phản cho lớp vẽ | Vùng neo không quá chói hay quá tối để hạt màu và nhãn chữ trắng đặt lên vẫn rõ | ghi ở `ghi_chu` |
| B3 | Không lỗi tạo ảnh | Không cạnh méo, vật thể chảy, chi tiết nhân đôi, mép mờ bất thường | ghi ở `ghi_chu` |
| B4 | Clip | 5–10 giây, chuyển động máy đều, không giật, không chữ, không người nhận diện được, khung đầu và khung cuối dùng làm ảnh tĩnh được | ghi ở `ghi_chu` |

## C. Gửi đi

- Tên file đúng `HUONG_DAN_MUSE.md` mục 6; bản sửa có `_v2`, `_v3`, giữ bản cũ.
- Chỉ đẩy `nen/`, `clip/`, `hinh_thu_nho/`, `bao_cao_tai_nguyen.json`. Không đẩy khung trung gian, ảnh thử, kịch bản đã sửa.
- Báo cáo có câu lệnh nguyên văn cho mọi file.
