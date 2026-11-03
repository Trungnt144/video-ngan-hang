# Tiến độ dựng kho hình chung đợt 1 (loạt thuật ngữ ngân hàng)

> XONG đợt 1 lúc khoảng 14:56 ngày 29/10/2026: đủ 23 hình, cộng 2 biểu đồ đưa lên, 25 mục `da_duyet` trong `danh_muc.json`. Làm tiếp theo lệnh Trung chiều 29/10 (chuyển qua phiên điều phối). Phần dưới dòng kẻ là bản ghi lúc dừng 05:10, giữ để tra.

## Lượt chiều 29/10/2026

Đã duyệt (9 hình, `da_duyet`): `kho_nen` 1.0, `bo_bieu_tuong_co_ban` 1.0, `toa_nha_ngan_hang` 1.0, `khach_hang_ca_nhan` 1.1, `phu_de_chay_chu` 1.0, `nhan_gia_dinh` 1.0, `truc_thoi_gian` 1.0, `thanh_ngang_chia_doan` 1.0, `khuon_canh_mo_dau_cau_hoi` 1.0. Khối danh mục của 7 hình mới: `_giao_viec_dot1/bao_cao_duyet_7_hinh.md`.

Sửa trong lượt này:
- `chup_mau.mjs` 1.1: chạy qua mọi mốc một lượt trước khi chụp; kiểm hàm thuần chỉ báo lỗi khi có điểm ảnh lệch quá 8 mức màu. Lý do: lỗi `khong_thuan` lúc có lúc không là do trình duyệt khử răng cưa lệch 1 mức màu trên 34–927 điểm ảnh, DOM trùng nhau (đo bằng ảnh chụp ngược thứ tự).
- `ngan_hang/nhan_vat.js` 1.1: vẽ đầu sau thân; bản 1.0 cổ đè lên mặt thành ô vuông như râu.
- `_giao_viec_dot1/gop_danh_muc.py`: thêm đối số thứ ba là lời ghi duyệt.

Nhóm C xong 14:40, duyệt 14:42 (5 hình, `da_duyet`): `bieu_do_cot_lich_tra_no`, `bieu_do_duong_lai_suat`, `binh_chua_muc_nuoc`, `net_tay_but_chi`, `thu_vien_3d_ngan_hang`. Tổng 14/23. Tác tử C đề xuất gom vào nền móng: `thoiGian`, `idMoi`, `buocDep`, `soLe`, `chiaNho`, `chuNhatTay`, `doDai`, `diemTai`, `dPhang` (chưa gom; xem `_giao_viec_dot1/bao_cao_nhom_C.md`).

Nhóm A xong 14:47, duyệt 14:55 (6 khuôn, `da_duyet`): `khuon_vi_du_tinh_tien_tung_buoc`, `khuon_trich_van_ban_phap_luat`, `khuon_canh_ket_tom_lai`, `khuon_so_sanh_hai_cot`, `khuon_checklist_dieu_can_luu_y`, `khuon_luong_cac_buoc`. Tổng 20/23. Tác tử A báo: `KHO.kiemChu` đo khung bao cả nút chữ nên nút chữ chạy hai dòng bị báo đè nhầm (cần sửa kiemChu đo từng dòng); đề xuất gom vào nền móng: `duTuongPhan`, `diemHop`, `gachHop`, `vongTay`, `veVienTay`, `lopSvg`, `khiDoiCo`, `datTu`, `hienTu`, `dauTrang`.

Nhóm B xong 14:55, duyệt 14:56 (5 hình, `da_duyet`): `hop_dong_giay_to`, `man_hinh_ung_dung`, `xap_tien_dong_xu`, `doanh_nghiep_nha_xuong`, `nha_o` (lên 1.1: nhãn dưới chân giữ tối thiểu 22 px khi co < 1). Tác tử B tìm ra nguyên nhân lỗi `khong_thuan` còn sót: Chrome tô lại từng phần khung; `chup_mau.mjs` 1.2 thêm cờ `--disable-partial-raster` (nên thêm cả vào công cụ xuất MP4 nếu cần khung trùng từng điểm). Đề xuất gom vào nền móng: `boVe`, `duongMuot`, `layDiem`, `diemBo`, `catHCN`, `mauDoc`, con dấu chữ vòng, chốt lò xo.

Việc còn lại cho lượt sau (chờ Trung): gom các hàm lặp ba nhóm đề xuất vào `kho_nen.js` (lên 1.1, chụp lại toàn bộ); sửa `KHO.kiemChu` đo từng dòng; biến thể nhóm B để đợt 2 (sổ tiết kiệm mở trang, ô nhập và bàn phím, biệt thự, nhà liền kề, đất có cọc mốc).

Đã giao (lịch sử, báo cáo ở `_giao_viec_dot1/bao_cao_nhom_<A|B|C>.md`):
- Nhóm C: `bieu_do_cot_lich_tra_no`, `bieu_do_duong_lai_suat`, `binh_chua_muc_nuoc`, `net_tay_but_chi`, `thu_vien_3d_ngan_hang`.
- Nhóm B: `hop_dong_giay_to`, `man_hinh_ung_dung`, `xap_tien_dong_xu`, `doanh_nghiep_nha_xuong`, `nha_o`.
- Nhóm A: `khuon_vi_du_tinh_tien_tung_buoc`, `khuon_trich_van_ban_phap_luat`, `khuon_canh_ket_tom_lai`, `khuon_so_sanh_hai_cot`, `khuon_checklist_dieu_can_luu_y`, `khuon_luong_cac_buoc`.

Ghi nhận khi duyệt: `truc_thoi_gian` có mốc chạy "Hôm nay" đè nhãn mốc đầu khi còn ở đầu trục (ghi trong `ghi_chu`); `toa_nha_ngan_hang` biển chi nhánh chữ khoảng 22 px ở co 1.

---

> Ghi lúc khoảng 05:10 ngày 29/10/2026. Lý do ghi: Trung ra lệnh dừng hẳn, phiên điều phối chuyển lệnh. Phiên giữ kho đã tắt ba tác tử con và bộ theo dõi báo cáo, không còn lượt chụp nào của kho chạy trong hàng đợi. Chỉ làm tiếp khi Trung ra lệnh.

## Đã có và đã duyệt (dùng được, `trang_thai: da_duyet` trong `danh_muc.json`)

| Hình | Phiên bản | Ghi chú |
|---|---|---|
| `kho_nen` | 1.0 | Nền móng: 12 bảng màu MAU-20…MAU-31, phông Be Vietnam Pro nạp từ `chung/phong/` (chạy được khi mất mạng), hàm tiện ích. Claude tự duyệt ảnh mẫu |
| `bo_bieu_tuong_co_ban` | 1.0 | Dấu tích, gạch, hỏi, chấm than, mũi tên thẳng và cong, vòng khoanh; hai kiểu vẽ. Claude tự duyệt ảnh mẫu |

Công cụ của kho đã xong: `xem_mau.html` (trang xem mẫu), `chup_mau.mjs` (chụp ảnh mẫu qua hàng đợi, tự kiểm chữ tràn, chữ đè, hàm thuần, ghép ảnh lưới). Cách dùng: `README.md` mục "Xem mẫu và chụp ảnh mẫu".

## Đang dở (`trang_thai: dang_dung`, CHƯA chép vào video)

Các hình dưới đây đã có file mã do tác tử viết. Tác tử bị dừng giữa chừng nên chưa tự soát xong, chưa gửi khối báo cáo, Claude chưa duyệt bằng mắt.

| Hình | Nhóm | File mã | Ảnh mẫu lần chụp cuối | Làm tiếp |
|---|---|---|---|---|
| `toa_nha_ngan_hang` | B | `ngan_hang/toa_nha_ngan_hang.js` | 6 ảnh, máy kiểm 0 lỗi | Xem `anh_mau/toa_nha_ngan_hang/*_luoi.jpg`, soát theo bảng kiểm, gộp vào danh mục |
| `khach_hang_ca_nhan` | B | `ngan_hang/nhan_vat.js` | 6 ảnh, máy kiểm 0 lỗi | Như trên |
| `phu_de_chay_chu` | A | `chung/phu_de_chay_chu.js` | 6 ảnh, máy kiểm 0 lỗi | Tác tử đang kiểm thêm tính thuần (có lượt gỡ lỗi riêng); chụp lại rồi soát |
| `nhan_gia_dinh` | A | `chung/nhan_gia_dinh.js` | 6 ảnh, máy kiểm 0 lỗi | Tác tử đang viết lại ô mẫu lúc dừng; chụp lại rồi soát |
| `truc_thoi_gian` | C | `chung/truc_thoi_gian.js` | 6 ảnh, máy kiểm 0 lỗi | Xem ảnh lưới, soát |
| `thanh_ngang_chia_doan` | C | `chung/thanh_chia_doan.js` | chưa có `ket_qua.json` (lượt chụp chưa xong) | Chụp lại rồi soát |
| `khuon_canh_mo_dau_cau_hoi` | A | `chung/khuon_canh_mo_dau.js` | chưa chụp | Đọc mã, chụp, soát |

## Chưa bắt đầu (`trang_thai: de_xuat`)

Nhóm A (khuôn bố cục): `khuon_canh_ket_tom_lai`, `khuon_trich_van_ban_phap_luat`, `khuon_vi_du_tinh_tien_tung_buoc`, `khuon_so_sanh_hai_cot`, `khuon_checklist_dieu_can_luu_y`, `khuon_luong_cac_buoc`.
Nhóm B (vật thể, nhân vật): `hop_dong_giay_to`, `xap_tien_dong_xu`, `doanh_nghiep_nha_xuong`, `man_hinh_ung_dung`, `nha_o`.
Nhóm C (biểu đồ, nét tay, 3D): `binh_chua_muc_nuoc`, `bieu_do_cot_lich_tra_no`, `bieu_do_duong_lai_suat` (hai biểu đồ này được đưa lên đợt 1 vì lô 2 có từ 2 video cần), `net_tay_but_chi`, `thu_vien_3d_ngan_hang` (file `chung/thu_vien/three.min.js` đã chép sẵn từ N96).

## Cách làm tiếp

1. Lời giao việc chung cho tác tử: `_giao_viec_dot1/giao_viec_chung.md` (hợp đồng, ô mẫu, chụp qua hàng đợi, bảng kiểm, ranh giới). Thứ tự trong từng nhóm theo danh sách trên: hình lô 2 dùng tới đi trước. Báo cáo trung gian của tác tử ghi vào `_giao_viec_dot1/bao_cao_nhom_<A|B|C>.md` (khối JSON mỗi hình).
2. Duyệt một hình: đọc `anh_mau/<ten>/<ten>_luoi.jpg` và ảnh PNG cỡ gốc, soát theo `07_khuon_prompt_va_kiem_chat_luong.md` mục 9, rồi gộp khối JSON vào danh mục bằng `python3 tai_san/kho_hinh_chung/_giao_viec_dot1/gop_danh_muc.py <file báo cáo> <ten,...>` (script đặt `da_duyet`). Việc tự duyệt thay Trung chỉ áp cho đêm 29/10/2026; lần làm tiếp phải hỏi lại Trung có cho tự duyệt không.
3. Xong một nhóm thì báo phiên điều phối danh sách hình và lệnh chép `python3 skills/ra-soat-dung-chung/scripts/chep_kho.py xuong_html/<dự án> <ten...>`.
4. Lô 2 lúc dừng: N105 đã có trang dựng riêng (`xuong_html/n105_lai_suat_tha_noi/`), không chờ kho. Các video lô 2 khác dùng kho được tới đâu thì dùng tới đó, hình chưa có thì vẽ riêng.

## Số đo đến lúc dừng

Nền móng và công cụ chụp: khoảng 35 phút phiên chính (00:00–00:35). Ba tác tử chạy từ 04:53 tới khoảng 05:08 (khoảng 15 phút mỗi tác tử, 45 phút tác tử tổng): xong 1 hình duyệt được, 7 hình dở. Thời gian 00:35–04:50 là lúc chờ hạn mức mở lại, không tính.
