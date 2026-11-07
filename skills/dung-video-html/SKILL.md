---
name: dung-video-html
description: "Dựng video bằng MỘT trang HTML do Opus viết (cách làm LM-03 của Media): mọi giá trị trên màn hình là hàm của thời gian t (hàm seek(t)), công cụ chụp từng khung theo đồng hồ ảo rồi mã hoá MP4 bằng FFmpeg (30 khung/giây, hoặc 60 khung/giây có nhoè chuyển động), ghép giọng đọc và nhạc nền, soát bằng khung cắt từ chính file MP4. Dùng khi Trung nói: dựng video bằng HTML, một trang HTML ra video, làm theo mẫu repo Opus 5.5, dựng chất liệu CL-09 đến CL-14 khi chưa có khối cảnh Remotion, dựng thử một phong cách mới, dựng một cảnh để ghép vào Remotion, xuong_html, xuất MP4 từ HTML, nhoè chuyển động 60 khung/giây, cắt khung ghép ảnh lưới để xem, ghép nhạc và giọng vào MP4, LM-03. KHÔNG dùng cho: video ngang có giọng thuyết minh làm theo kịch bản của kênh đã có file khuôn, một video hay một lô (skill lam-video-ba-chang); video dọc dùng 7 khối cảnh Remotion có sẵn (LM-01), dự án ngang Remotion có thuyết minh (LM-02), HyperFrames (LM-04), cảnh 3D tả thực bằng Blender (LM-05), clip AI (LM-06); khi video cần phát âm thanh hoặc video nhúng ngay trong trang; khi Trung chưa duyệt tổ hợp trục và kịch bản (chỉ dựng thử thì ghi rõ là bản thử)."
version: 1.1.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-27
  related_skills: [dung-hoat-canh-3d-blender, giao-muse-video, lam-video-ba-chang]
  du_an_mau: xuong_html/2026.10.27_thu_ky_thuat
---

# Dựng video bằng một trang HTML (LM-03)

> **1.1.0** · 2026-11-05 · Video có giọng thuyết minh làm theo kịch bản chuyển sang skill `lam-video-ba-chang` (cách ba chặng, Trung chốt 05/11/2026); skill này giữ dựng thử phong cách và dựng một cảnh lẻ. **1.0.0** · 2026-10-27 · Bản đầu.

Skill này gói cách làm đã chạy thật ngày 27/10/2026: mẫu lịch sử AI 60 giây theo phong cách repo Opus 5.5 (ba vòng xem và sửa, 4 khung đích) và lần thử kỹ thuật 6 giây của `xuong_html/`. Công cụ, cài đặt và lệnh mẫu: `xuong_html/README.md`. Điều kiện để trang xuất đúng: `tham_chieu/hop_dong_trang.md`. Lỗi đã gặp: `tham_chieu/loi_hay_gap.md`. Trang sống làm mẫu: `xuong_html/2026.10.27_thu_ky_thuat/trang.html` (kèm `nhip.json` và `SO_VONG_SUA.md` mẫu).

## Khi nào chọn cách này

Tác tử Opus viết một file HTML (mẫu 60 giây: 1.324 dòng); công cụ chụp từng khung theo đồng hồ ảo nên kết quả không đổi dù máy nhanh hay chậm. Cái giá là token viết trang (mỗi video viết lại từ đầu, không có khối dùng lại) và thời gian máy của bản 60 khung/giây.

| Tình huống | Chọn |
|---|---|
| Video ngang có giọng thuyết minh làm theo kịch bản, một video hay một lô, của kênh đã có file khuôn trong `skills/lam-video-ba-chang/kenh/` (hiện: Chuyện nghề Ngân hàng) | skill `lam-video-ba-chang` (cách ba chặng: bốn tác tử ngữ cảnh mới, lệnh máy dùng chung); không làm theo các bước dưới đây. Kênh chưa có file khuôn: xem `kenh/README.md` của skill đó (video mẫu đầu tiên của kênh dựng bằng skill này) |
| Chất liệu CL-09 đến CL-14 chưa có khối cảnh Remotion; dựng thử một phong cách mới; một cảnh lạ ngắn | LM-03 (skill này) |
| Cần một cảnh làm bằng HTML rồi ghép vào video Remotion | LM-03 xuất MP4 một cảnh không tiếng, đưa vào Remotion như một clip (xem mục LM-06 của `05_cach_lam.md`) |
| Video dọc dùng 7 khối cảnh có sẵn | LM-01: rẻ hơn (0,44 giây máy mỗi giây video, không tốn token viết trang) |
| Video ngang có thuyết minh, nhiều chương, Three.js trong Remotion | LM-02 (`10_video_ngang_thuyet_minh.md`) |
| Cảnh tả thực từ mô hình 3D tải về | LM-05 (skill `dung-hoat-canh-3d-blender`) |

## Chi phí đo thật (báo Trung trước khi chạy)

| Việc | Số đo | Nguồn, ngày |
|---|---|---|
| Một lượt viết trang 30 giây (Opus) | khoảng 150 nghìn token, 12 phút; bản một lượt còn 1–2 lỗi nhìn thấy | `san_pham/2026.10.27.duyet_phong_cach_opus55/`, 27/10/2026 |
| Viết, kèm 3 vòng xem và sửa, mẫu 60 giây | 218.774 token, 31 phút Opus, 1.324 dòng (số token của riêng các vòng sửa chưa đo) | cùng nguồn |
| Xem trước 960×540, 10 khung/giây | 0,24–0,28 giây máy mỗi giây video (trang nhẹ); mẫu 60 giây: 15,8–16,5 giây máy | `xuong_html/cong_cu/KET_QUA_DO.md` mục 8, 27/10/2026; sổ vòng sửa mẫu |
| Cắt khung và ghép lưới | khoảng 1 giây máy | `KET_QUA_DO.md` mục 8 |
| Xuất 30 khung/giây, 1920×1080 | 1,2–1,5 giây máy mỗi giây video (trang nhẹ 1,35) | `KET_QUA_DO.md` mục 8 |
| Xuất 60 khung/giây có nhoè | trang nhẹ 11,7 giây máy mỗi giây video; mẫu 60 giây (Three.js, hạt nhiễu) 23,3 giây máy mỗi giây video, file 134 MB | `KET_QUA_DO.md` mục 8; sổ vòng sửa mẫu |
| Ghép giọng, nhạc | khoảng 0,5 giây máy cho video 6 giây (hình không mã hoá lại) | `KET_QUA_DO.md` mục 8 |

Ước cho video 30 giây (suy từ hai số đo 60 khung/giây ở trên, ghi là ước): bản 30 khung/giây khoảng 36–45 giây máy; bản 60 khung/giây có nhoè khoảng 6–12 phút máy. Nói rõ với Trung rằng 60 khung/giây có nhoè chỉ đáng làm khi có chuyển động nhanh; cảnh chậm thì 30 khung/giây đủ.

## Điều kiện trước khi bắt tay

1. Video thật đã qua hai cửa của `01_quy_trinh_chung.md`: cửa chọn (tổ hợp trục chất liệu CL, cấu trúc CT, bố cục BC, màu MAU, nhịp NH và cách làm LM-03, xem `04_he_truc_dung.md`) và cửa duyệt kịch bản. Bản dựng thử một phong cách thì bỏ qua hai cửa nhưng ghi "bản thử" ở tên file và báo cáo.
2. Cài một lần: `export PATH="$HOME/.local/bin:$PATH"; cd xuong_html/cong_cu && npm install`. Máy phải có internet khi xuất (thư viện GSAP, Three.js và phông tải từ mạng).
3. Có giọng đọc thì sinh giọng và lấy mốc giây (`08_giong_am_thanh_phu_de.md`, `scripts/moc_tung_tu.py`) trước khi lập nhịp; ghép tiếng vào MP4 là bước cuối.

## Các bước

**1. Nhận tổ hợp trục và kịch bản đã duyệt.** Ghi lại mã giá trị từng trục (ví dụ CL-11 chữ động khổng lồ, MAU đen và cam), mã hex màu, phông, bố cục; kịch bản và số liệu đã kiểm chứng (`03_kich_ban_va_loi_viet.md`: file dữ kiện là nguồn duy nhất cho số trên màn hình). Thủ pháp và hiệu ứng muốn dùng: tra thư viện `tai_san/thu_phap/` (cách dùng ở `06_thu_phap_va_hieu_ung.md`).

**2. Bản đồ nhịp và storyboard.** Tạo `xuong_html/<yyyy.mm.dd_ten>/nhip.json` (mẫu: `xuong_html/2026.10.27_thu_ky_thuat/nhip.json`): mỗi nhịp có mốc `t` và `den` (giây), `ten`, `hien` (cái gì có trên màn hình), `chuyen_dong`, `kiem_anh_tinh` (điều phải thấy ở ảnh tĩnh của nhịp này). Một nhịp là một đoạn có một ý trên màn hình. Có giọng đọc thì mốc lấy theo giọng. Storyboard là bản nhìn được của `nhip.json`: mỗi nhịp một dòng, trình Trung nếu video thật.

**3. Giao tác tử con Opus viết trang.** Dùng công cụ giao việc với model Opus (viết trang cần model mạnh; mẫu 60 giây viết bằng Opus). Đưa cho tác tử con: khuôn `tai_san/khuon_prompt/khuon_dung_html_mot_trang.md`, `tham_chieu/hop_dong_trang.md`, `nhip.json`, bảng giá trị trục đã chọn (mã hex, phông, bố cục) và **1–2 ảnh đích ghép** (khung cắt từ video mẫu của phong cách, gộp bằng `cat_khung_xem.sh`; đưa nhiều ảnh lẻ thì tác tử con bị đẩy ảnh cũ khỏi ngữ cảnh và không còn thấy ảnh đích). Ảnh đích lấy ở `tai_san/hoc_tu_repo/`; chưa có thì xin phép Trung rồi tải video mẫu về thư mục tạm ngoài git (link ở thư viện đó). Không chép nguyên văn prompt dài của tác giả mẫu (tối đa 20 chữ trích, còn lại trỏ link, `13_ban_quyen_va_bao_mat.md`). Kết quả ghi vào `xuong_html/<yyyy.mm.dd_ten>/trang.html`.

**4. Xem trước 960×540, 10 khung/giây.**

```bash
export PATH="$HOME/.local/bin:$PATH"
cd xuong_html/<yyyy.mm.dd_ten>
node ../cong_cu/xuat_mp4.mjs trang.html <so_giay> --fps 10 --kich-thuoc 960x540 --ra xem_truoc/v1.mp4 --chi-tiet
```

Đọc dòng cuối (số giây máy, dung lượng) và mọi dòng `pageerror` hoặc `error`. Có lỗi JavaScript thì sửa trước khi xem hình. Dung lượng xem trước quá nặng (mẫu lỗi 1,5 MB mỗi giây) là dấu hiệu lớp hạt nhiễu quá dày.

**5. Cắt khung, ghép ảnh lưới, xem.**

```bash
bash ../cong_cu/cat_khung_xem.sh xem_truoc/v1.mp4 xem_truoc/v1 12     # 12 khung đều, 1 lưới 3 cột × 4 hàng
bash ../cong_cu/cat_khung_xem.sh xem_truoc/v1.mp4 xem_truoc/v1 24     # 24 khung, 2 lưới
bash ../cong_cu/cat_khung_xem.sh xem_truoc/v1.mp4 xem_truoc/v1 --moc 12.0,19.0 --cot 2   # chỉ các giây cần soi
```

Dùng công cụ Read mở `xem_truoc/v1/v1_luoi_1.jpg` (và lưới 2), đối chiếu với ảnh đích và `kiem_anh_tinh` của từng nhịp. Nghi chữ hoặc dấu thì Read ảnh lẻ cỡ gốc `v1_<giây>.png`. Cắt thêm khung ở đúng mốc chuyển cảnh và ở các giây nhịp đổi (lỗi hay nằm ở đó).

**6. Sửa, tối đa 3 vòng.** Mỗi vòng: xuất bản xem trước mới (`v2.mp4`, `v3.mp4`), cắt khung, so với ảnh đích, sửa trang (tự sửa hoặc giao tác tử con kèm danh sách lỗi), rồi ghi vào `SO_VONG_SUA.md` hai khối "Lỗi tìm thấy" và "Đã sửa" (mẫu: `xuong_html/2026.10.27_thu_ky_thuat/SO_VONG_SUA.md`). Vòng cuối kiểm lại các lỗi vòng trước bằng một bản xem ngắn hơn. Hết 3 vòng còn lỗi thì ghi lỗi còn lại vào sổ và báo Trung, không sửa tiếp âm thầm.

**7. Phản biện độc lập.** Giao một tác tử con khác (không phải tác tử đã viết hoặc sửa trang) theo `tai_san/khuon_prompt/khuon_phan_bien.md`. Chỉ đưa: yêu cầu gốc (`nhip.json`, tổ hợp trục), lưới khung cắt của bản xem trước mới nhất và ảnh đích. Không đưa `SO_VONG_SUA.md` và lời giải thích của người sửa, để người phản biện không bị dẫn. Lỗi nặng (chữ sai, chữ đè nhau, tràn khung, khung trống) sửa rồi xuất bản xem ngắn kiểm lại; lỗi nhỏ ghi vào sổ và báo Trung. Thanh chất lượng đo được: `07_khuon_prompt_va_kiem_chat_luong.md`.

**8. Xuất bản cuối.** Báo Trung thời gian máy ước (bảng chi phí) rồi mới chạy; ước trên 10 phút thì chạy nền.

```bash
# 30 khung/giây, 1920x1080 (mặc định cho cảnh chậm và vừa)
node ../cong_cu/xuat_mp4.mjs trang.html <so_giay> --fps 30 --ra ra/cuoi_30.mp4
# 60 khung/giây có nhoè chuyển động (khi có chuyển động nhanh); chậm hơn khoảng 8–9 lần
sh ../cong_cu/xuat_nhoe.sh trang.html <so_giay> ra/cuoi_60.mp4
```

Kiểm: file có, số khung đúng (`so_giay` × fps), mở vài khung cỡ gốc xem chữ đủ dấu.

**9. Ghép giọng và nhạc.**

```bash
bash ../cong_cu/ghep_am_thanh.sh ra/cuoi_60.mp4 ra/cuoi_60_co_tieng.mp4 --giong <giong.wav> --giong-tre 0.5 --nhac <tai_san/nhac_nen/...mp3>
```

Nhạc tự nhỏ dưới giọng, chuẩn −14 LUFS, cắt hoặc lặp vừa video, mờ dần 2 giây cuối; script kiểm file ra và in độ to thực. Chọn nhạc theo `08_giong_am_thanh_phu_de.md` mục 7 và giấy phép ở `tai_san/nhac_nen/README.md`. Nhạc ngắn hơn video: thứ tự duy nhất ở mục 7 (chọn bài dài hơn; không có thì phát chậm không thấp hơn 0,95 lần; vẫn thiếu thì nối lặp có mờ chéo); công cụ này hiện chỉ lặp bài, chưa phát chậm và chưa mờ chéo, nên chọn bài dài hơn video. Chỉ có nhạc hoặc chỉ có giọng thì bỏ tuỳ chọn còn lại.

**10. Soát và giao.** Soát theo `15_bang_kiem_truoc_khi_giao.md` (mục lớp hoàn thiện và thanh chất lượng) và `13_ban_quyen_va_bao_mat.md` (GSAP, Three.js, mẫu của tác giả khác, nhạc). Đo tương phản chữ trên khung cắt khi nghi ngờ: `scripts/do_tuong_phan_khung.py`. Chép MP4 cuối vào `san_pham/yyyy.mm.dd.<chu_de>/` (tên `yyyy.mm.dd.<ten>_v<n>_cuoi.mp4`, quy ước `san_pham/README.md`), viết `tai_nguyen/nguon_goc.md` ghi trang nằm ở `xuong_html/<yyyy.mm.dd_ten>/trang.html` cùng lệnh dựng lại, `SO_VONG_SUA.md` chép vào `tai_nguyen/ban_nhap/`. Báo xong kèm khối lệnh `open "<đường dẫn tuyệt đối>"` theo `AGENTS.md` của Media.

**11. Ghi lại.** Số đo thật của lần chạy (giây máy, dung lượng, token) vào `xuong_html/cong_cu/KET_QUA_DO.md` (mục mới) và bảng chi phí ở trên nếu khác nhiều; lỗi mới vào `tham_chieu/loi_hay_gap.md` và `90_bai_hoc.md`; nhật ký `99_nhat_ky.md`; commit đúng file mình sửa.

## Chỗ Trung phải quyết (hỏi bằng bảng chọn)

- Cửa chọn và cửa duyệt: tổ hợp trục kèm LM-03, kịch bản (video thật).
- Trước bước 3: dùng LM-03 hay cách làm rẻ hơn có sẵn (LM-01, LM-02), kèm token và thời gian ước của bước 3 đến 8.
- Trước bước 3, nếu cần video mẫu làm ảnh đích mà chưa có: có tải không (nêu tên, nguồn, dung lượng).
- Trước bước 8: xuất 30 hay 60 khung/giây có nhoè, thời gian máy ước.
- Sau bước 7: duyệt bản; còn lỗi nhỏ nào chấp nhận.
