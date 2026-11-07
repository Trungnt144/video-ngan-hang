# Video có ảnh nền Muse — phân cảnh, phiếu đặt hình, nghiệm thu ảnh

> Skill `lam-video-ba-chang`, lập 08/11/2026 theo quyết định của Trung ngày 07/11/2026 (báo cáo `~/Documents/Grok/Su dung grok/san_pham/2026.11.07.luong_claude_muse_lam_video_v1.md`). Chỉ áp cho video mà file lô hoặc lời nhắn ghi "có ảnh nền Muse". Video khác bỏ qua file này.
> Chia việc: **Muse tạo vật thể tả thực, Claude vẽ việc đang xảy ra trên vật thể đó.** Muse (agent tạo ảnh của Meta, không có API, làm qua web) chỉ tạo tấm nền, biến thể cùng góc máy, clip mở đầu, ảnh nền hình thu nhỏ theo phiếu; quy tắc cho Muse ở `muse/` gốc repo (`HUONG_DAN_MUSE.md`, `mau_phieu_dat_hinh.json`, `bang_kiem_tai_nguyen.md`). Claude giữ kịch bản, phân cảnh, giọng, lớp cơ chế, kết xuất, soát.

## 1. Chặng B0 — phân cảnh theo câu và phiếu đặt hình (tác tử `ba-chang-dung`, lời nhắn ghi "Chặng B0")

Chạy sau chặng A (đã có `.chuong.json`), song song với chuỗi giọng. Đọc: `.chuong.json`, bảng hình của kịch bản `.md`, `muse/mau_phieu_dat_hinh.json`, `muse/phong_cach/<phong cách lời nhắn ghi>.md`, `xuong_html/pin_mat_troi/` làm khuôn (`trang.html`, `canh.js`, `phieu_dat_hinh.json`).

1. **Phân cảnh theo câu** — `xuong_html/<mã>_<tên>/phan_canh.md`: bảng mỗi câu một dòng (chương.câu · lời rút gọn · người xem phải thấy gì · cảnh nền và biến thể · lớp cơ chế Claude vẽ). Mỗi cảnh gắn một loại:
   - `nen_muse`: tấm nền tả thực Muse làm, Claude vẽ cơ chế lên trên. Chọn khi khái niệm gắn với một vật thể có hình dạng thật (tấm pin, mặt cắt, nhà xưởng, quầy giao dịch, kho hàng).
   - `clip_muse`: clip 5–10 giây cho mở đầu, chuyển chương, bối cảnh; tối đa 3 mỗi video; không dùng cho cảnh cơ chế.
   - `ma_claude`: vẽ hoàn toàn bằng mã (đồ thị, bảng, công thức, sơ đồ trừu tượng, bảng cân đối). Kênh Ngân hàng phần lớn là loại này (ước 70–80% thời lượng).
   Quy tắc: nhiều chương so cùng một vật thì dùng **một tấm gốc và các biến thể cùng góc máy**, không mỗi chương một ảnh. Cơ chế (hạt, dòng, mũi tên, nhãn, số) luôn là lớp của Claude. Quy tắc cứng 9 của `AGENTS.md` (câu cơ chế, hình chính vẽ đúng đại lượng) vẫn áp: tấm nền là vật thể, lớp Claude là đại lượng đang đổi.
2. **Phiếu** — `xuong_html/<mã>_<tên>/phieu_dat_hinh.json` theo `muse/mau_phieu_dat_hinh.json` (bỏ khoá `_chu_thich`). Mỗi cảnh `nen_muse`: `mo_ta` kể vật thể theo thứ tự không gian, chỉ tả vật thể; `vung_neo` là các ô `[x1, y1, x2, y2]` trên khung 1920×1080 cho mọi phần mà lớp cơ chế sẽ bám; `bien_the` (mục đầu là tấm gốc); `kiem_cau_tao` viết thành điều kiện kiểm được bằng mắt; `cam`. Chừa `vung_sach`: dải dưới y ≥ 900 cho phụ đề, cột phải cho chú thích. Màu hiệu ứng của biến thể ghi ở `mau_co_che`, trùng màu lớp cơ chế. Dùng lại ảnh Muse đã có thì `trang_thai: "dung_lai"`, `file_co_san`, `cat` (cắt về 16:9) và ghi kết quả nghiệm thu vào `ghi_chu`.
3. **Trang khung** — chép `trang.html`, `canh.js` của `xuong_html/pin_mat_troi/` làm khung; chép thư viện `python3 skills/ra-soat-dung-chung/scripts/chep_kho.py xuong_html/<mã>_<tên> nen_anh`. Trang nạp `thu_vien/kho/chung/nen_anh.js` sau `kho_nen.js`, có hai dấu `<!--PHIEU_BAT_DAU--><!--PHIEU_KET_THUC-->`.
4. **Khung bố cục xám** — `node scripts/khung_bo_cuc.mjs xuong_html/<mã>_<tên>`: nhúng phiếu vào trang rồi chụp `out/khung_bo_cuc/<id>.png` cho mọi cảnh `nen_muse`, `clip_muse`, `hinh_thu_nho`. Khung vẽ bằng chính `nen_anh.js` nên ô xám trùng toạ độ lớp cơ chế. Mở từng ảnh khung: nhãn đọc được, ô không chồng sai, vùng sạch đúng.
5. **Đẩy lên Drive** bằng rclone (skill `drive-rclone`; thư mục "Muse-Claude", mã `1-q8cSUX6cw5Y8-_ff6dXMFEOi_e-iwnX`):
   ```bash
   F=--drive-root-folder-id=1-q8cSUX6cw5Y8-_ff6dXMFEOi_e-iwnX   # một từ, có dấu "=": zsh không tách biến theo dấu cách
   rclone copyto "<.chuong.json>" gdrive:01_Mac_gui_Muse/<ma_video>/kich_ban.chuong.json $F
   rclone copy xuong_html/<mã>_<tên> gdrive:01_Mac_gui_Muse/<ma_video>/ $F --include "/phieu_dat_hinh.json" --include "/phan_canh.md"
   rclone copy xuong_html/<mã>_<tên>/out/khung_bo_cuc gdrive:01_Mac_gui_Muse/<ma_video>/khung_bo_cuc $F
   ```
   Ảnh tham chiếu (cấu tạo, chất liệu) đặt `01_Mac_gui_Muse/<ma_video>/tham_chieu/`. Dữ liệu từng video chỉ lên Drive, không vào `muse/` (repo công khai, `muse/` chỉ chứa quy tắc chung).
6. Commit `phieu_dat_hinh.json`, `phan_canh.md`, `trang.html`, `canh.js`; ghi `out/may/chang_b0.md` (mẫu `quy_tac_chung.md` mục 4, thêm dòng "Đường Drive" và "Câu nhắn cho Muse"); kết thúc. Phiên giữ lô báo Trung câu nhắn để Trung dán cho Muse.

## 2. Nghiệm thu ảnh Muse (tác tử `ba-chang-soat`, lời nhắn ghi "Nghiệm thu ảnh Muse")

Chạy khi Trung báo Muse đã gửi. Bạn không tạo ảnh, không dựng.

1. Tải về: `rclone copy gdrive:02_Muse_gui_Mac/<ma_video> xuong_html/<mã>_<tên>/nen_muse_tai/ --drive-root-folder-id=1-q8cSUX6cw5Y8-_ff6dXMFEOi_e-iwnX`. Đọc `bao_cao_tai_nguyen.json`.
2. Mỗi file: đo kích thước thật (`xuong_thu_hyperframes/bin/ffmpeg -i <file>`); đọc ảnh (thu 960 rộng để xem); chồng ảnh lên khung bố cục 50% (`ffmpeg -i <ảnh> -i out/khung_bo_cuc/<id>.png -filter_complex "[1]format=rgba,colorchannelmixer=aa=0.5[k];[0][k]overlay" <ra>.jpg`) để đo lệch vùng neo; chồng biến thể lên tấm gốc (độ mờ 50% hoặc `blend=difference`) để đo lệch góc máy. Đối chiếu từng mục nhóm A của `muse/bang_kiem_tai_nguyen.md` và từng điều `kiem_cau_tao` của phiếu. **Đúng cấu tạo là mục nặng nhất**: ảnh tả thực sai cấu tạo có hại hơn ảnh vẽ đơn giản.
3. Ghi `xuong_html/<mã>_<tên>/nghiem_thu_muse.md`: bảng file · từng mục A1–A7 · kết luận ĐẠT / TRƯỢT · lỗi thấy được.
4. Ảnh đạt: chép vào `xuong_html/<mã>_<tên>/nen/` đúng tên của phiếu (bản `_v2` thì ghi `file_dung` trong phiếu). Ảnh trượt: viết `phieu_sua.json` (`{"ma_video", "vong", "muc": [{"id_canh", "bien_the", "file", "loi", "cach_sua"}]}`) và đẩy vào `01_Mac_gui_Muse/<ma_video>/`. **Tối đa hai vòng sửa**; cảnh trượt lần thứ ba đổi `loai` sang `ma_claude` trong phiếu, chặng B vẽ bằng mã (trang hiện khung xám khi thiếu ảnh, nên dựng tiếp được ngay).
5. Câu lệnh tạo ảnh của file đạt: chép vào `muse/phong_cach/<phong cách>.md` mục "Câu lệnh đã đạt" (file quy tắc chung, phiên giữ lô commit).
6. Báo dưới 10 dòng: số file đạt, trượt, vòng hiện tại, đường dẫn `nghiem_thu_muse.md`.

## 3. Chặng B với ảnh nền (bổ sung cho `chang_b.md`)

- Ảnh nền ở `nen/` (ngoài git). Trong `N.start()`: `await KHO.nenAnh.nap()` rồi mỗi cảnh `const S = KHO.nenAnh.canh('<id>', root, { lich, may_quay })`; trong `seek(t)` gọi `S.seek(t)` trước khi vẽ lớp cơ chế. Hướng dẫn hàm ở đầu `nen_anh.js`; ví dụ ở `xuong_html/pin_mat_troi/canh.js`.
- Mọi toạ độ của lớp cơ chế lấy từ `S.vung('<tên>')`, `S.diem(...)`, không ghi cứng điểm ảnh. Vẽ trong `S.svg` (đi theo máy quay); nhãn giữ cỡ chữ đặt trong `S.ngoai` bằng `S.raManHinh([x, y], t)`.
- Biến thể đổi theo câu bằng `lich` (hoà 0,6–0,8 giây); chuyển động máy quay nhẹ (`may_quay`, phóng tối đa 1,6 lần với ảnh 1920×1080) thay cho clip ở cảnh cơ chế.
- Máy đo hình (`do_chat_luong_hinh.mjs`) đo chuyển động trên cả ảnh nền: ảnh tĩnh cả chương không có lớp cơ chế chạy là trượt, đúng như yêu cầu.
- Đăng YouTube: bật nhãn nội dung tạo bằng AI (ảnh tả thực do Muse tạo).
