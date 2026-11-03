# Nhật ký từng video khổ ngang (giai đoạn 3)

> Chuyển nguyên văn từ `14_khuon_video_dai_thuyet_minh.md` (bản 1.27, 2026-10-27) khi dựng lại luồng Media ngày 2026-10-27: các mục ghi việc của từng video cụ thể (mục 7, 8, 10 đến 18, 20 đến 22, 24). Chỉ ghi thêm ở cuối file, không sửa chữ cũ. Tên module trong nội dung đã đổi theo `_bang_chuyen_module_2026.10.27.md`; mã dựng D-07 đến D-11, bảng màu M0 đến M8 và mã nhạc N01 đến N15 trong các mục này là mã dùng trước 27/10/2026, giữ nguyên (tra sang hệ trục ở cột "Tách từ" của `tai_san/so_tay_gu/he_truc_dung.md`).
> **Số mục giữ nguyên số của module 14 cũ**, để các chú thích kiểu "module 14 mục 19" trong mã `xuong_dai/` tra được: mục 1 đến 6, 9, 19, 23 nằm ở `10_video_ngang_thuyet_minh.md` (mục 3 chuyển sang `03_kich_ban_va_loi_viet.md` mục 5.3); mục 7, 8, 10 đến 18, 20 đến 22, 24 nằm ở file này. Chữ "mục N" trong nội dung bên dưới chỉ mục của module 14 cũ, tra theo quy tắc đó.
> Cách tra: `grep -n "^## 16\." tai_san/nhat_ky_video_ngang.md` ra dòng đầu của mục 16; từ khoá ở cột cuối bảng mục lục.

## Mục lục

| Mục | Nội dung | Ngày | Thư mục mã (`xuong_dai/`) | Từ khoá để `grep` |
|---|---|---|---|---|
| 7 | Video 3D đầy đủ: cách tổ chức mã (video pin mặt trời bản 3D) | 25/10/2026 | `pin_mat_troi/` | chung.tsx, camTheo, moc_cau |
| 8 | Video 3D tả thực: tua-bin gió (Blender cộng Three.js) | 25–26/10/2026 | `tuabin_gio/` | ThongSo.ts, KichBan.ts, xep_giong_vieneu |
| 10 | Video D-09 Kem & xuyên thấu (buồng máy tua-bin) và cảnh thử chi tiết | 26/10/2026 | `buong_may/` | bánh răng ăn khớp, chèn câu, playbackRate |
| 11 | Video máy biến áp, lần đầu dùng D-09b cho video đầy đủ | 26/10/2026 | `may_bien_ap/` | CoBan.tsx, tác tử con kiểm chứng, số đo 25 phút |
| 12 | Làm lại video pin mặt trời theo D-09b | 26/10/2026 | `pin_d09b/` | dùng lại lời và giọng, nối lặp nhạc |
| 13 | Video inverter, thiết bị điện tử đầu tiên theo D-09b | 26/10/2026 | `inverter/` | cầu H, DoThi.tsx, thẻ đồ thị SVG |
| 14 | Video hộp số tua-bin gió: bánh răng nghiêng | 26/10/2026 | `hop_so/` | HinhBanhRang.ts, răng nghiêng, MuiTenCong |
| 15 | Video BESS: container pin lưu trữ, sửa hình nháy, thay một câu giọng | 26/10/2026 | `bess/` | toSang, bat, THAY_CAU, nghe_thu.html |
| 16 | Video tăng áp truyền tải: lai D-09b và D-10, lần đầu dựng bảng đen | 26/10/2026 | `tang_ap/` | BangDen.tsx, TOC_CANH, NGHI_CANH |
| 17 | Video hiệu ứng che gió: hiện tượng vận hành | 26/10/2026 | `che_gio/` | Jensen, HatGio, near = 1, tương phản M6 |
| 18 | Video monopile và các loại móng tua-bin ngoài khơi | 26/10/2026 | `monopile/` | KhoiBien, đổi nhạc không kết xuất lại |
| 20 | Cảnh thử D-11 Phòng chụp & viền sáng: Blender Cycles | 26–27/10/2026 | `d11_thu/, d11_lrv/` | Cycles, mặt nạ Workbench, delta_location |
| 21 | Video điện áp, dòng điện, điện trở: toàn bộ D-10 | 26/10/2026 | `dien_ap/` | BangDen.tsx, khung chia đôi |
| 22 | Video máy xạ trị proton Mevion S250-FIT | 26/10/2026 | `proton/` | tương phản M1, kiểm chứng sau giọng |
| 24 | Video proton viết lại thành hai video theo KB-02 | 27/10/2026 | `proton_bragg/, proton_may/` | DamDong.tsx, đọc 1,1 lần |
| 26 | Lô 18 video điện chung và điện mặt trời: ghi chú theo dự án dựng | 27–28/10/2026 | `buc_xa_mat_troi/, neo_dien_noi/, phao_noi/` | bat, tien, TamPinLon, DaoPhao, x0 |

## Bảng các thư mục trong `xuong_dai/` và mục ghi cách làm

**Các thư mục trong `xuong_dai/`** (kiểm 26/10/2026; mỗi thư mục là một dự án Remotion riêng, có `node_modules/` riêng, mở phiên ở gốc `Media/` rồi chạy lệnh trong thư mục):

| Thư mục | Là gì | Ghi ở |
|---|---|---|
| `pin_mat_troi/` | Ca thử 2D đầu tiên và video pin mặt trời bản 3D (Three.js, Blender) | mục 1, 6, 7 |
| `tuabin_gio/` | Video tua-bin gió tả thực (Blender, D-08) | mục 8 |
| `buong_may/` | Video bên trong buồng máy tua-bin (D-09) và cảnh thử hệ xoay cánh | mục 10 |
| `may_bien_ap/` | Video máy biến áp, video D-09b đầu tiên; khung mã dùng lại cho các video D-09b sau | mục 11 |
| `pin_d09b/` | Video pin mặt trời làm lại theo D-09b | mục 12 |
| `inverter/` | Video inverter (D-09b) | mục 13 |
| `hop_so/` | Video hộp số tua-bin gió (D-09b) | mục 14 |
| `bess/` | Video BESS, container pin lưu trữ (D-09b) | mục 15 |
| `khong_hop_so/` | Video tua-bin không hộp số (D-09b): đã có kịch bản `san_pham/2026.10.26.tuabin_khong_hop_so/tai_nguyen/kich_ban/2026.10.26.tuabin_khong_hop_so_v1.*` và bản nháp `san_pham/2026.10.26.tuabin_khong_hop_so/2026.10.26.tuabin_khong_hop_so_d09b_v1_nhap.mp4`, chưa có mục ghi cách làm | chưa có |
| `bang_mau_d09b/` | Bản sao mã máy biến áp để áp thử các bảng màu của bộ biến thể D-09b, ra ảnh cho phụ lục `tai_san/so_tay_gu/dung/d09b_bien_the_mau_nhac.md` | `99_nhat_ky.md` |
| `tang_ap/` | Video trạm tăng áp và truyền tải (lai D-09b và D-10, KB-08; lúc ghi bảng này phiên khác còn đang dựng, nay đã xong) | mục 16 |
| `monopile/` | Video cọc đơn monopile và các loại móng tua-bin ngoài khơi (D-09b · M4, KB-07) | mục 18 |
| `dien_ap/` | Video điện áp, dòng điện, điện trở: video đầu tiên dựng toàn bộ theo D-10 (SVG, không 3D), KB-02 | mục 21 |
| `proton/` | Video máy xạ trị proton Mevion S250-FIT (D-09b · M1, KB-05), video y khoa đầu tiên | mục 22 |
| `proton_bragg/` | Video 1/2 "Vì sao proton dừng đúng chỗ" (KB-02, hành lang đám đông) | mục 24 |
| `proton_may/` | Video 2/2 "Bên trong máy proton Mevion S250-FIT" (KB-02, so sánh đường đua) | mục 24 |
| `kw_kwh/` | Video N06 kW, kWh, MW, GWh (D-10 toàn SVG), chuỗi 15 video điện | mục 23 |
| `he_so_cong_suat/` | Video N07 hệ số công suất (lai D-09b và D-10), chuỗi 15 video điện | mục 23 |
| `p50_p90/` | Video N08 P50, P90 (D-10 toàn SVG), chuỗi 15 video điện | mục 23 |
| `cat_giam/` | Video N03 cắt giảm công suất (lai D-09b và D-10), chuỗi 15 video điện | mục 23 |
| `nghen_luoi/` | Video N04 nghẽn lưới (D-09b toàn 3D), chuỗi 15 video điện | mục 23 |
| `may_phat/` | Video N05 máy phát điện xoay chiều (D-09b toàn 3D), chuỗi 15 video điện | mục 23 |
| `mwp_mwac/` | Video N09 MWp và MWac (lai D-09b và D-10), chuỗi 15 video điện | mục 23 |
| `gio_lap_phuong/` | Video N11 gió gấp đôi, điện gấp tám (D-10, cảnh 1 là 3D), chuỗi 15 video điện | mục 23 |
| `duong_cong_cs/` | Video N12 đường cong công suất (D-09b, một cảnh D-10), chuỗi 15 video điện | mục 23 |
| `gio_do_cao/` | Video N13 gió theo độ cao (D-09b toàn 3D), chuỗi 15 video điện | mục 23 |
| `pin_nong/` | Video N10 tấm pin nóng (D-09b toàn 3D), chuỗi 15 video điện | mục 23 |
| `ton_that/` | Video N14 chuỗi tổn thất và PR (D-10 toàn SVG), chuỗi 15 video điện | mục 23 |
| `gio_mua/` | Video N15 gió mùa và mùa vụ sản lượng (D-09b, bản đồ Việt Nam), chuỗi 15 video điện | mục 23 |
| `bao_iec/` | Video N16 bão và cấp tua-bin IEC (lai D-09b và D-10), chuỗi 15 video điện | mục 23 |
| `dien_noi_neo/` | Video N17 điện nổi: mực nước hồ và hệ neo (D-09b, mặt cắt hồ), chuỗi 15 video điện | mục 23 |
| `cau_truc_nmmt/` | Video "Một nhà máy điện mặt trời gồm những gì" (D-09b · M2, KB-05, một mô hình toàn nhà máy theo Hình 1.1 tài liệu RM MB) | thẻ D-09b, ghi chú 27/10/2026 |
| `che_gio/` | Video hiệu ứng che gió giữa các tua-bin (D-09b · M6, KB-03); khung mã chép từ `tang_ap/` | mục 17 |
| `d11_thu/` | Cảnh thử D-11 Phòng chụp & viền sáng, lần 1 (Blender Cycles, buồng máy tua-bin, mô hình tự dựng) | mục 20 |
| `d11_lrv/` | Cảnh thử D-11 lần 2: xe tự hành Mặt Trăng bằng mô hình tải về (Blender Cycles) | mục 20 |
| `scada/` | Video nhà điều hành SCADA (bản nháp v2 chờ Trung xem) | `san_pham/2026.10.27.nha_dieu_hanh_scada/` |

## 7. Video 3D đầy đủ: cách tổ chức mã (video pin mặt trời bản 3D, 25/10/2026)

Mã ở `xuong_dai/pin_mat_troi/src/video3d/`, thành phần dựng `PinMatTroi3D`. Dùng lại làm khuôn cho video 3D sau:

| File | Vai trò |
|---|---|
| `chung.tsx` | Hàm thời gian, máy quay theo mốc `camTheo`, phép chiếu `chieu` để nhãn chữ bám vật, khung cảnh 3D `Canh3D` (ánh sáng, bóng đổ, nền), khối hình cơ bản, nhãn, phụ đề, nền màn bản vẽ |
| `mo_hinh.tsx` | Mô hình dựng từ khối cơ bản: tua-bin, tấm pin, tấm pin tách lớp, ô pin, ô pin cắt lớp, mạng nguyên tử, ngôi nhà |
| `chuong.tsx` | Một thành phần cho mỗi chương; nhận khung bắt đầu từng câu `S` để canh mốc hình theo lời đọc |
| `PinMatTroi3D.tsx` | Ghép chương, gắn giọng, phụ đề. Độ dài chương = 15 khung đầu + thời lượng giọng + 24 khung cuối + khung giữ thêm cho máy quay |
| `../../canh3d/moc_cau.mjs` → `moc_cau.json` | Đọc file mốc câu VieNeu (`public/giong_3d/c*.moc_cau.json`, do `scripts/sinh_giong_vieneu.py` ghi cùng `c*.wav`); phụ đề lấy trường `text`, câu đọc lấy trường `doc`, hai trường phải cùng số câu. Chạy lại sau mỗi lần tạo lại giọng |
| `../../canh3d/moc_cau_elevenlabs.mjs` | Bản đường lui: tách mốc câu từ dữ liệu ký tự ElevenLabs (`c*.moc.json`, đi với `c*.mp3`). Quay lại giọng Xuân Lượng: chạy file này rồi đổi `DUOI_GIONG` trong `PinMatTroi3D.tsx` thành `"mp3"` |

Cách soát nhanh: `npx remotion bundle --out-dir <thư mục tạm>` một lần, rồi `npx remotion still <thư mục tạm> PinMatTroi3D <ảnh> --frame=<số> --scale=0.5` cho từng khung; mỗi khung vài giây vì không đóng gói lại. Lỗi hay gặp ở lượt này: nhãn tràn mép khung khi máy quay tiến gần, phụ đề che hàng dưới của mô hình — soát khung giữa và cuối mỗi đoạn máy quay di chuyển.

Số đo trên Mac (M5): 4.538 khung (2 phút 31) kết xuất trong 7 phút, file 69 MB. Giọng Xuân Lượng đọc khoảng 18–19 ký tự mỗi giây với lời phiên âm, chậm hơn mức 20 ký tự ghi ở module 08.

**Đổi sang giọng VieNeu Hải Đăng (25/10/2026, khuya):** chạy `scripts/sinh_giong_vieneu.py` (cách chạy ở `08_giong_am_thanh_phu_de.md` mục 0), rồi `node canh3d/moc_cau.mjs`, rồi đóng gói và kết xuất như trên. 8 chương ra 139 giây tiếng (17,4 ký tự mỗi giây kể cả khoảng nghỉ), video 4.724 khung (2 phút 37,5), ngắn hơn bản ElevenLabs v4 (2 phút 52). Phụ đề vẫn theo câu, lấy trường `text`; các chương canh mốc hình theo khung bắt đầu câu `S` nên không phải sửa `chuong.tsx`. Lỗi có sẵn từ bản ElevenLabs, chưa sửa: nhãn "Dải ion dương" ở chương 4 tràn mép phải khung hình (`chuong.tsx`, nhãn đặt tại toạ độ x 2,3).

**Model giọng cho tiếng Việt (25/10/2026):** `eleven_turbo_v2_5` đọc sai dấu sắc có hệ thống ("lỗ trống" thành "lỗ trồng", "mối nối" thành "mồi nối", "bật" thành "bắt"). Đo bằng máy nhận dạng giọng nói: 44 lỗi dấu ở 8 chương; `eleven_v4` còn 1 lỗi, `eleven_flash_v2_5` không đỡ. Video pin mặt trời 3D dùng v4 (truyền `--model eleven_v4` cho `scripts/sinh_giong_doc.py`); model mặc định trong `tai_san/cau_hinh_giong.json` chưa đổi, chờ Trung quyết sau bản cuối. Giọng v4 đọc chậm hơn, khoảng 16 ký tự mỗi giây.

**Soát lỗi phát âm bằng máy (không nghe được trong phiên Claude):** máy có sẵn mô hình nhận dạng `mlx-community/whisper-large-v3-turbo` và gói `mlx-whisper` trong bộ nhớ đệm của `uv` (`~/.hermes/bin/uv tool run --offline --from mlx-whisper python ...`). ffmpeg của Remotion (`node_modules/@remotion/compositor-darwin-arm64/`, cần `DYLD_LIBRARY_PATH` trỏ vào thư mục đó) không có định dạng xuất `s16le` mà mlx-whisper cần, nên đổi mp3 sang WAV 16 kHz trước rồi nạp bằng mô-đun `wave`. So bản chép với trường `doc`: từ cùng chữ gốc khác dấu là lỗi dấu. Máy nhận dạng cũng có thể nhầm với từ ngắn hiếm ("bo" thành "bò"), kết luận cuối vẫn do Trung nghe.

**Đọc lại riêng từng câu giọng VieNeu (25/10/2026):** `scripts/doc_lai_cau_vieneu.py --ra <thư mục giọng> --chuong <n> --cau 3,4,5` đọc lại câu chỉ định tối đa 6 lần, giữ lần ít lỗi dấu nhất, ghép vào đúng chỗ và dời mốc câu sau; chạy lại `canh3d/moc_cau.mjs` rồi kết xuất. Dùng khi Trung nghe thấy câu sai mà `sinh_giong_vieneu.py` không bắt (script đó chỉ đọc lại câu sai quá 10% ký tự). Máy nghe lại luôn nghe "bo" thành "bò" và "lợp" thành "lập" dù Trung nghe đúng — hai chữ này không cần đọc lại khi chỉ máy báo.

## 8. Video 3D tả thực: tua-bin gió (25–26/10/2026)

Bản cuối `san_pham/2026.10.25.tuabin_gio/2026.10.26.nguyen_ly_tuabin_gio_3d_v3_cuoi.mp4`: 8 chương, 2 phút 37, lối viết KB-05, dựng theo thẻ D-08 Tả thực & mặt cắt (cảnh có tua-bin) xen D-07 (màn bản vẽ, cảnh sơ đồ), giọng VieNeu Hải Đăng, nhạc "Science Documentary" (Pixabay). Mã ở `xuong_dai/tuabin_gio/`. Đi qua ba bản: đất sét (Three.js), tả thực (Blender, giọng Xuân Lượng), tả thực giọng Hải Đăng.

**Cách tổ chức để Blender và Three.js dựng cùng một video:**

| File | Vai trò |
|---|---|
| `src/ThongSo.ts` | Thông số hình học dùng chung (vị trí trục, bánh răng, máy phát, trạm, cột điện, địa hình). Không import three hay React để xuất được ra Node |
| `src/KichBan.ts` | Trạng thái từng khung theo mốc câu: máy quay, góc quay, phần cắt hở, nhãn, màn bản vẽ, và nguồn hình của khung (`thuc` ảnh Blender, `sodo` Three.js, `banve` màn bản vẽ che kín) |
| `canh3d/xuat_khung.ts` | `npx esbuild canh3d/xuat_khung.ts --bundle --platform=node --outfile=out/xuat_khung.cjs && node out/xuat_khung.cjs` ra `canh3d/khung.json` |
| `canh3d/dung_blender.py` | Dựng mô hình tả thực bằng Python, trời và cỏ Poly Haven (`tai_san/moi_truong_3d/`), kết xuất khung `thuc` vào `public/blender/` (ngoài git). `--khung 45,349` thử khung lẻ, `--het` chạy hết (bỏ qua khung đã có, chạy lại được khi bị ngắt) |
| `src/Video.tsx` | Khung `thuc` lấy ảnh Blender, khung `sodo` dựng Three.js; nhãn chữ chiếu theo cùng máy quay nên khớp cả hai |
| `xep_giong_vieneu.py` | Đặt từng câu giọng mới vào mốc câu cũ để đổi giọng không phải kết xuất lại hình |

**Số đo (Mac M5):** 2.540 khung tả thực, 1,2–4,8 giây mỗi khung (trung bình 2,6 giây), tổng 109,7 phút theo nhật ký kết xuất, ảnh JPEG 666 MB; Remotion ghép 4.708 khung trong 7 phút 20, file 160 MB. Giữ `public/blender/` cho tới khi chắc không sửa nữa: xoá đi thì sửa bất kỳ chỗ nào cũng phải kết xuất lại 2 giờ.

**Bài học:**
1. Mô hình tự dựng bằng mã đạt mức "đủ thật" với Trung khi có: vỏ cắt hở thấy độ dày, vật liệu kim loại và sơn, ánh sáng từ ảnh môi trường 360 độ cộng một đèn mặt trời, chi tiết phụ (lan can, sàn thép, bậc thang, khe thông gió). Chi tiết vẫn kém mô hình chuyên nghiệp; nói trước với Trung.
2. Hiện tượng vô hình (dòng khí, cực từ, điện áp) giữ dạng sơ đồ; Trung đồng ý cách xen này.
3. Giọng Xuân Lượng `eleven_turbo_v2_5` sai khoảng 45 chỗ dấu ở video này; dùng ngay giọng mặc định VieNeu Hải Đăng (module 08 mục 0). Whisper nghe giọng Bắc hay nhầm tr/ch, gi/d và đoán "điện từ" thành "điện tử"; câu Whisper báo sai phải để Trung nghe, Trung đã nghe và duyệt cả 9 câu nghi ngờ.
4. Lỗi kỹ thuật đã vấp ghi ở thẻ D-08 ô "Ghi chú khi dùng thử".

## 10. Video D-09 Kem & xuyên thấu và cảnh thử chi tiết (26/10/2026)

**Sản phẩm (Trung duyệt 26/10/2026).** `san_pham/2026.10.26.buong_may_tuabin/2026.10.26.buong_may_tuabin_d09_v3_cuoi.mp4`: "Bên trong buồng máy tua-bin gió", 7 cảnh, 99,3 giây (bản v2 93 giây thiếu ý tua-bin không hộp số; v3 thêm 7 giây ở cuối cảnh 4, giây 48–55, dùng mô hình dẫn động trực tiếp `TruyenDongTrucTiep`), lối viết KB-05, thẻ dựng D-09 (học bố cục từ mẫu YouTube Anscience, bảng màu sáng Trung chọn), giọng VieNeu Hải Đăng tăng tốc 1,2 lần, nhạc "Close Up" (Mixkit). `san_pham/2026.10.26.buong_may_tuabin/tai_nguyen/ban_nhap/2026.10.26.chi_tiet_he_xoay_canh_d09_thu_v1.mp4`: cảnh thử 15 giây không lời, vòng răng ổ xoay cánh có bu-lông, hộp số hành tinh ba tầng tách lớp, động cơ. Mã: `xuong_dai/buong_may/` (thành phần `BuongMay` và `ChiTietXoayCanh`). Kịch bản: `san_pham/2026.10.26.buong_may_tuabin/tai_nguyen/kich_ban/2026.10.26.buong_may_tuabin_v1.md`.

**Cách làm khác bản tua-bin 25/10:**

| Việc | Cách làm |
|---|---|
| Hình | Toàn bộ Three.js trong Remotion, không Blender. Video 93 giây kết xuất 4 phút 23; cảnh chi tiết 15 giây kết xuất 44 giây |
| Tăng tốc giọng | VieNeu không có tham số tốc độ. `tao_thoi_gian.py` tăng tốc bằng ffmpeg `atempo` (giữ cao độ), chia mốc câu cho hệ số tốc độ. Làm mẫu nghe thử: đặt `-t` TRƯỚC `-i` (đặt sau thì cắt theo độ dài đầu ra, mọi mẫu dài bằng nhau) |
| Bánh răng ăn khớp | `src/chi_tiet/HinhBanhRang.ts` dựng bánh răng ngoài và vòng răng trong theo mô-đun và số răng. Góc từng bánh tính từ điều kiện ăn khớp (`dongHoc` trong `CanhChiTiet.tsx`), nên răng không đâm vào nhau. Hộp số hành tinh cần (bánh trung tâm + vòng răng trong) chia hết cho số bánh hành tinh |
| Nhạc | Pixabay chặn tải bằng lệnh; Mixkit tải được (`tai_san/nhac_nen/README.md`). Video dài hơn bản nhạc thì phát chậm lại bằng `playbackRate` của `<Audio>` (Remotion giữ cao độ); v3 phát 0,96 lần, hằng `TOC_NHAC` trong `src/Video.tsx` tự tính theo độ dài video |
| Chèn câu vào video đã duyệt | Không đọc lại cả cảnh (giọng các câu cũ sẽ khác đi). Đọc riêng câu mới bằng `scripts/sinh_giong_vieneu.py` với một file kịch bản tạm chỉ chứa câu đó, nối vào cuối `public/giong_goc/c<id>.wav` (khoảng nghỉ 0,25 giây), cộng mốc câu mới vào `c<id>.moc_cau.json`, rồi chạy lại `tao_thoi_gian.py`. Các cảnh sau tự dời vì mốc trong `KichBan.ts` tính tương đối theo câu |

**Hai quy tắc kỹ thuật (chi tiết ở `90_bai_hoc.md` ngày 26/10/2026):**
1. Vật liệu nào đổi độ mờ theo thời gian phải có `key` đổi theo trạng thái đục/trong (hoặc đặt `needsUpdate`). Không thì khi kết xuất cả video, vật đã "trong suốt" vẫn vẽ như khối đặc. Bản nháp đầu của video buồng máy mất hình bên trong ở phần lớn các cảnh vì lỗi này.
2. Soát trước khi giao bằng khung cắt từ chính file mp4: `python3 scripts/soat_khung_mp4.py xuong_dai/<ten>/node_modules/@remotion/compositor-darwin-arm64 <file.mp4> <thu_muc_ra> 3` (3 giây một khung; đoạn nghi ngờ dùng 1). `still` chỉ để chỉnh bố cục.

**Bài học bố cục từ cảnh chi tiết:** vạch màu trên mặt bánh răng để thấy bánh nào quay; giá hành tinh dạng tay đòn, không làm đĩa kín (che bánh răng); tách lớp về phía có chỗ trống; máy quay nhìn chếch xuống 30–40 độ mới thấy bên trong từng tầng; máy quay không đứng trong vòng quét của cánh. Còn kém mẫu ở ánh sáng (khe răng chưa tối, kim loại chưa bóng); muốn bằng mẫu thì đưa mô hình sang Blender (mục 6, 8).

## 11. Video máy biến áp, lần đầu dùng thẻ D-09b cho video đầy đủ (26/10/2026)

**Sản phẩm (Trung duyệt 26/10/2026, không sửa).** `san_pham/2026.10.26.may_bien_ap/2026.10.26.may_bien_ap_d09b_v1_cuoi.mp4` (sao y bản nháp `_v1_nhap`): "Bên trong máy biến áp", 7 cảnh, 106,6 giây, lối viết KB-05, thẻ dựng D-09b, giọng VieNeu Hải Đăng 1,2 lần, nhạc "Infinity" (Mixkit, bản dự phòng của thẻ; "Close Up" quá ngắn, phải phát chậm 0,89 lần). Trung chọn làm một mạch tới bản nháp, bỏ cửa duyệt chữ. Kịch bản: `san_pham/2026.10.26.may_bien_ap/tai_nguyen/kich_ban/2026.10.26.may_bien_ap_v1.md`; nguồn: `san_pham/2026.10.26.may_bien_ap/tai_nguyen/kich_ban/2026.10.26.may_bien_ap_v1.nguon_kiem_chung.md`. Mã: `xuong_dai/may_bien_ap/` (thành phần `MayBienAp`; `ThuMoHinh` là tám góc máy cố định để soát mô hình trước khi viết dòng thời gian).

**Cách tổ chức mã (dùng lại cho video D-09b sau):**

| File | Vai trò |
|---|---|
| `src/CoBan.tsx` | Bảng màu, vật liệu có `key` đục/trong, `Luoi` (vẽ lưới dựng sẵn kèm viền), `Hop`, `Tru`, `MuiTen`, `Hat` (hạt chạy dọc đường gấp khúc, chạy lùi được, đổi màu theo vị trí), hàm dựng hình gộp `gop`, `hopG`, `truG`, `xoanG` (dây xoắn) |
| `src/MayBienAp.tsx` | Máy biến áp lực: lõi ghép từng lá (hai lưới gộp xen màu), gông trên nhấc được, cuộn dây tách lớp, thùng, sứ (LatheGeometry có tán), tản nhiệt, bình dầu phụ, bộ đổi nấc, dòng dầu |
| `src/MoHinhPhu.tsx` | Mô hình đặt riêng: cột thép và đường dây, lõi một pha, khối dòng xoáy, máy trên cột |
| `src/KichBan.ts` | Trạng thái từng khung theo mốc câu. Trường `studio` cho biết khung đang xem mô hình nào; khung đổi mô hình thì tự phủ màn kem 9 khung hai bên |
| `src/Video.tsx` | Chỉ vẽ mô hình của `studio` hiện tại (đỡ chi phí và bóng đổ), nhãn chiếu theo máy quay, thẻ chữ có thanh độ dài, phụ đề nằm trên màn kem |

**Số đo (Mac M5).** Từ lúc tạo lời thoại tới bản kết xuất đầu khoảng 25 phút máy làm: giọng 7 cảnh 49 giây, kiểm chứng 19 khẳng định do tác tử con làm song song (7,6 phút, không chặn việc dựng), dựng 4 mô hình và dòng thời gian, soát 28 khung `still` và 36 khung cắt từ mp4, kết xuất 3.197 khung trong 5 phút 2 giây (file 116 MB). Ước "trọn một ngày" ở thẻ D-09b là quá cao với máy móc dựng được từ khối cơ bản (thùng, sứ, cuộn dây, lá thép); ước đó vẫn có thể đúng với bộ phận cần bánh răng ăn khớp hoặc mô hình tải về.

**Cách làm khác video buồng máy:**
1. Kiểm chứng giao tác tử con (Sonnet) ngay sau khi viết lời, trong lúc tạo giọng và dựng mô hình. Tác tử con trả 3 khẳng định "cần đối chiếu" kèm câu thay thế; sửa 4 câu rồi đọc lại riêng hai cảnh bằng `--chuong 3,7`. Script `doc_lai_cau_vieneu.py` lấy lời từ file mốc câu cũ, nên khi đổi chữ phải đọc lại cả cảnh bằng `sinh_giong_vieneu.py --chuong`.
2. Máy biến áp không có bộ phận quay; mức chi tiết của D-09b dồn vào lá thép, vòng dây, tán sứ, lá tản nhiệt, tiếp điểm bộ đổi nấc. Hiện tượng vô hình (từ trường, dòng xoáy, dòng dầu, nhiệt) vẽ bằng hạt chạy vòng, mũi tên đổi hướng, vật đỏ lên.
3. Hạt chạy trong lõi phải đặt ở mặt trước lõi (z = nửa bề dày + 0,07); đặt ở đường tâm thì lõi đặc che mất.

**Lỗi lệnh đã vấp:** chi tiết ở `90_bai_hoc.md` ngày 26/10/2026 (chép thư mục mã bằng `rsync --exclude src` làm hỏng thư viện Node; biến chứa danh sách số khung không tách dòng trong zsh).

## 12. Làm lại video pin mặt trời theo thẻ D-09b (26/10/2026)

**Sản phẩm (Trung duyệt 26/10/2026, không sửa).** `san_pham/2026.10.25.Pin mặt trời hoạt động như thế nào mà không cần bộ phận quay?/2026.10.26.pin_mat_troi_d09b_v1_cuoi.mp4` (sao y bản nháp `_v1_nhap`): 8 chương, 131,9 giây, lời v3 ngày 25/10 (KB-05) giữ nguyên, giọng VieNeu Hải Đăng của bản v3 tăng tốc 1,2 lần, nhạc "Infinity" nối lặp. Trung chọn làm một mạch tới bản nháp. Kịch bản dựng: `san_pham/2026.10.25.Pin mặt trời hoạt động như thế nào mà không cần bộ phận quay?/tai_nguyen/kich_ban/2026.10.26.pin_mat_troi_d09b_v1.md`. Mã: `xuong_dai/pin_d09b/` (thành phần `PinMatTroi`; `ThuMoHinh` 12 góc máy soát mô hình).

**Dùng lại lời và giọng của video cũ khi chỉ đổi phong cách dựng:** chép `c*.wav` và `c*.moc_cau.json` của bản đã duyệt vào `public/giong_goc/`, sửa `KICH_BAN` trong `tao_thoi_gian.py` trỏ về file `.chuong.json` cũ, chạy `python3 -I tao_thoi_gian.py`. Không phải sinh giọng hay kiểm chứng lại; nhãn mới không có trong lời thì đối chiếu với file nguồn cũ và ghi vào kịch bản dựng.

**Cách tổ chức mã (khác video máy biến áp):**

| File | Vai trò |
|---|---|
| `src/TamPin.tsx` | Tấm pin 60 ô: ô vát góc, 36 ngón và 3 thanh cái mỗi ô, dải hàn nối tiếp qua khe, khung nhôm chữ C có ống rỗng, tách lớp theo chiều dày; giá đỡ, hộp nối dây, cáp, bóng đèn |
| `src/NgoaiTroi.tsx` | Tổ tua-bin hơi và máy phát, tua-bin gió, mặt trời, ngôi nhà lợp 8 tấm pin, mặt đất chỉ nhận bóng (`shadowMaterial`, không lộ đường chân trời) |
| `src/KhoiO.tsx` | Khối cắt ô pin phóng to: đế nhôm, lớp p, lớp n, 384 kim tự tháp, vạch bạc, mạch ngoài. `HatTrenKhoi` vẽ electron, lỗ trống, ion, photon, mũi tên trên mặt cắt |
| `src/MangTinhThe.tsx` | Mạng 9 × 6 nguyên tử, mỗi liên kết hai electron; phốt pho, bo; photon bật electron |
| `src/KichBan.ts` | Trạng thái từng khung. Dòng điện chạy vòng: mỗi cặp có đường đi riêng, electron tới đúng chỗ lỗ trống của nó thì cả hai biến mất |

**Nhạc ngắn hơn video, nối lặp thay vì phát chậm (Trung chọn):** bản 1 phát từ đầu, mờ dần 2 giây cuối; bản 2 vào cùng lúc bằng `startFrom`, chọn điểm vào sao cho bài kết đúng khung cuối video. Mã ở `src/Video.tsx` (`VAO_BAN2`, `TU_GIAY_BAN2`).

**Lỗi đã vấp:** hạt và photon tính toạ độ thế giới trong `KichBan.ts` (đã cộng vị trí khối) nhưng lại vẽ bên trong `<group position={vị trí khối}>`, nên bị dời hai lần và biến mất khỏi khung. Ảnh soát mô hình không lộ lỗi vì thử mô hình không có hạt. Quy tắc: thứ gì tính bằng toạ độ thế giới thì vẽ ngoài nhóm của mô hình.

**Số đo (Mac M5, theo giờ tạo file).** Tạo thư mục mã 13:41, bản kết xuất đầu xong 14:09 (khoảng 28 phút: 6 mô hình, dòng thời gian, 3 lượt soát ảnh `still`); soát 44 khung cắt từ mp4, sửa 4 chỗ nhãn, kết xuất lần hai thêm khoảng 10 phút. Một lượt kết xuất 3.956 khung khoảng 6 phút, file 161 MB.

## 13. Video inverter, thiết bị điện tử đầu tiên theo thẻ D-09b (26/10/2026)

**Sản phẩm (Trung duyệt 26/10/2026, không sửa).** `san_pham/2026.10.26.Cấu tạo chi tiết của Inverter điện mặt trời/2026.10.26.inverter_d09b_v1_cuoi.mp4` (sao y bản nháp `_v1_nhap`): "Bên trong inverter", inverter điện mặt trời loại chuỗi một pha, 7 cảnh, 117,9 giây, lối viết KB-05, tổ hợp D-09b · M0 · N09 "Coffee or Tea" (bài 125 giây, không phải phát chậm), giọng VieNeu Hải Đăng 1,2 lần, chữ "inverter" đọc "in vơ tơ" (Trung nghe 4 mẫu ở `tai_san/giong_doc/mau_inverter_2026.10.26/`). Việc nợ N01. Trung chọn Claude tự tìm tư liệu, không chờ video mẫu và ảnh thiết bị. Kịch bản: `san_pham/2026.10.26.Cấu tạo chi tiết của Inverter điện mặt trời/tai_nguyen/kich_ban/2026.10.26.inverter_v1.md`; nguồn: `san_pham/2026.10.26.Cấu tạo chi tiết của Inverter điện mặt trời/tai_nguyen/kich_ban/2026.10.26.inverter_v1.nguon_kiem_chung.md` (24 khẳng định, 6 câu sửa). Mã: `xuong_dai/inverter/` (thành phần `Inverter`; `ThuMoHinh` 10 góc máy soát mô hình).

**Cách tổ chức mã (dùng lại cho video thiết bị điện tử sau, gồm BESS):**

| File | Vai trò |
|---|---|
| `src/InverterChuoi.tsx` | Mô hình inverter tách riêng, đơn vị đề-xi-mét: vỏ, tản nhiệt 23 lá, đầu nối một chiều, công tắc xoay, cổng xoay chiều; bo mạch có ba khối (cuộn cảm xuyến quấn dây, vỏ bán dẫn TO-247, tụ có rãnh chữ K, cuộn cảm lõi chữ E, tụ màng, rơ-le có tiếp điểm), bo điều khiển, linh kiện dán rải giả ngẫu nhiên. Trạng thái `TrangThaiInv` (độ đục vỏ, khối đang tô, khoá đang dẫn, rơ-le, nhiệt, hạt điện) |
| `src/SoDoCauH.tsx` | Sơ đồ cầu H nổi: thanh dương, thanh âm, bốn khoá có lưỡi gạt, tải, hạt chạy theo cặp chéo |
| `src/DoThi.tsx` | Thẻ đồ thị SVG góc phải trên: một chiều và xoay chiều, đường cong công suất có điểm dò, sóng vuông, xung điều chế, lọc, khớp nhịp |
| `src/NhaInv.tsx` | Khu nhà đơn vị mét: ngôi nhà lợp pin (chép từ video pin mặt trời), inverter thu nhỏ 0,1 treo tường hông, cáp, công tơ, cột hạ thế, thợ trên cột, máy biến áp trên cột |
| `src/KichBan.ts` | Hai chỗ đặt mô hình (`inv`, `nha`), màn kem tự che khi đổi chỗ |

**Cách làm khác các video trước:**
1. Mô hình dựng trong lúc tác tử con kiểm chứng và lúc chờ Trung duyệt chữ. Mô hình không phụ thuộc phong cách dựng 3D nào, nên không phí nếu Trung chọn tông khác.
2. Hiện tượng điện tử không nhìn thấy (đóng ngắt, đảo chiều, dạng sóng) vẽ bằng sơ đồ cầu H nổi ra từ chính bốn khoá trên bo, cộng thẻ đồ thị SVG. Đồ thị vẽ bằng SVG theo khung nên sắc nét, không tốn kết xuất 3D.
3. Bức tường sau inverter che máy quay đi vòng ra mặt sau: phải làm mờ tường trước khi máy quay vượt qua mặt tường.
4. Nhãn ba khối trên bo mạch không đặt cùng một phía: khối 1 nhãn bên trái, khối 2 mép trên, khối 3 bên phải; cảnh tóm tắt dùng số 1, 2, 3 trên hình và thẻ chữ liệt kê tên.

**Số đo (Mac M5, theo giờ tạo file).** Lời 15:30, mô hình 15:37, giọng 15:48 (7 cảnh 53 giây), dòng thời gian 15:54, kết xuất 3.536 khung mỗi lượt 5 phút 32, hai lượt; bản nháp 16:09. Kiểm chứng do tác tử con làm song song 14 phút. Soát 30 khung `still` và 39 khung cắt từ mp4, sửa 9 chỗ (nhãn chồng, nhãn tràn mép, góc máy bị tường che, màu tô tụ, tấm nền sơ đồ nhìn xuyên, ghi chú bị phụ đề đè).

## 14. Video hộp số tua-bin gió: bánh răng nghiêng, hộp số ba tầng (26/10/2026)

**Sản phẩm (bản nháp, chờ Trung duyệt).** `san_pham/2026.10.26.hop_so_tuabin/2026.10.26.hop_so_tuabin_d09b_v1_nhap.mp4`: "Bên trong hộp số tua-bin gió", loại tua-bin dùng hộp số, 8 cảnh, 152,6 giây (Trung cho kéo dài quá 120 giây), lối viết KB-05, tổ hợp D-09b · M0 · N10 "Just Keep Walking" (nối lặp hai bản), giọng VieNeu Hải Đăng 1,2 lần. Trung chọn làm một mạch tới bản nháp. Kịch bản: `san_pham/2026.10.26.hop_so_tuabin/tai_nguyen/kich_ban/2026.10.26.hop_so_tuabin_v1.md`; nguồn: `san_pham/2026.10.26.hop_so_tuabin/tai_nguyen/kich_ban/2026.10.26.hop_so_tuabin_v1.nguon_kiem_chung.md` (35 khẳng định, 5 câu sửa, một câu sai số: "hai tầng song song nâng tốc khoảng 100 lần" trong khi hai tầng chỉ khoảng 20 lần). Mã: `xuong_dai/hop_so/` (thành phần `HopSo`; `ThuMoHinh` 15 góc máy soát ba mô hình).

**Cách tổ chức mã (dùng lại cho video máy có bánh răng: hệ xoay cánh, hộp số xe, máy nén):**

| File | Vai trò |
|---|---|
| `src/HinhBanhRang.ts` | Bánh răng ngoài và vành răng trong có **răng nghiêng**: biên dạng xoay dần qua 8 lát (hàm `dunXoan`, tự đặt chiều mặt bên theo pháp tuyến cạnh). Góc xoắn mỗi bánh = ± bề rộng × tan(góc nghiêng) / bán kính chia: ăn khớp ngoài xoắn ngược nhau, ăn khớp trong xoắn cùng nhau. `gocAnKhop` tính góc bánh bị dẫn từ bánh dẫn và hướng đặt tâm. Có lỗ giảm nhẹ (`loNhe`) |
| `src/HopSo.tsx` | Hộp số: tầng hành tinh 18/27/72 răng ba bánh (giá dạng tay đòn, phía ra có lỗ rộng hơn bánh mặt trời để nhìn xuyên), hai tầng song song 90/20, ổ lăn có con lăn ở mọi gối trục và trong bánh hành tinh, vỏ trụ có nắp trước và vỏ hộp có gân, móc cẩu, tay đỡ đệm cao su, đĩa phanh, khớp nối mềm, máy phát, hệ dầu (bơm, lọc, làm mát có quạt, ống góp, vòi phun, hạt dầu), ba cảm biến, mũi tên cong lực xoắn (`MuiTenCong`), móc cẩu nâng hộp số (`nhac`). Trục nằm theo X: `ChoTrucX` xoay nhóm để trục Y cục bộ trùng X |
| `src/HaiBanhRang.tsx` | Cặp bánh 60/20 răng hướng về máy quay, bánh 2.000 răng và khung buồng máy so cỡ |
| `src/TuaBin.tsx` | Tua-bin đơn vị mét, chứa chính mô hình hộp số thu nhỏ 0,4 lần trong buồng máy |
| `src/KichBan.ts` | Ba chỗ đặt mô hình (`hop`, `cap`, `tb`); góc quay cộng dồn từ hàm tốc độ theo cảnh (`tocDo`), nên đổi tốc độ giữa cảnh không làm bánh răng giật |

**Cách làm khác các video trước:**
1. Lời viết xong thì giao tác tử con (Sonnet) kiểm chứng và tạo giọng ngay; khi có kết quả chỉ đọc lại ba chương có câu sửa (`--chuong 3,6,8`, 40 giây).
2. Hộp số quay chậm lại để mắt theo kịp (giá hành tinh 0,0045 rad mỗi khung, trục ra 0,46 rad mỗi khung) và ghi "Hình quay chậm lại để dễ nhìn"; cụm cánh ở cảnh ngoài trời quay đúng 15 vòng/phút.
3. Tên thuật ngữ của tầng hành tinh chỉ hiện trên nhãn từ câu đặt tên; trước đó nhãn ghi "bánh nhỏ ở giữa", "ba bánh quanh nó".
4. Đồ thị lực xoắn (SVG) và mũi tên lực xoắn dùng chung một hàm `lucXoan`, đoạn đổi chiều canh theo mốc câu "đổi cả chiều".

**Lỗi bố cục đã sửa khi soát (36 khung `still`, 51 khung cắt từ mp4):** máy quay đứng trước mặt phẳng quay của cánh nên cánh quét ngang khung (chuyển máy quay ra sau mặt phẳng quay); khung buồng máy so cỡ đặt sau bánh 2.000 răng nên bị che; nhãn rơi xuống dưới phụ đề khi máy quay nhìn chếch xuống; nhãn nằm dưới thẻ chữ góc phải (đổi sang bên trái hoặc dịch điểm nhìn để mô hình lệch trái); máy phát che khung khi nhìn hệ dầu từ phía +X (đổi sang phía −X).

**Số đo (Mac M5, theo giờ tạo file).** Lời 16:23, mô hình 16:25–16:46, giọng 8 chương 79 giây, kiểm chứng tác tử con 18 phút chạy song song, dòng thời gian 16:43; một lượt kết xuất 4.578 khung 7 phút 9 giây, file 117 MB; hai lượt. Khoảng 55 phút máy làm từ lúc Trung trả lời bảng hỏi tới bản nháp.

## 15. Video BESS: container pin lưu trữ, sửa hình nháy, thay một câu giọng (26/10/2026)

**Sản phẩm (Trung duyệt bản nháp v2 thành bản cuối).** `san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/2026.10.26.bess_d09b_v2_cuoi.mp4`: "Bên trong hệ thống pin lưu trữ BESS", 7 cảnh, 118,6 giây, KB-05, D-09b · M0, nhạc "Infinity" nối lặp, giọng Hải Đăng 1,2 lần. Việc nợ N02. Kịch bản và bảng duyệt: `san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/tai_nguyen/kich_ban/2026.10.26.bess_v1.md`; nguồn (38 khẳng định): `san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/tai_nguyen/kich_ban/2026.10.26.bess_v1.nguon_kiem_chung.md`. Mã: `xuong_dai/bess/` (thành phần `Bess`, `ThuMoHinh`).

**Cách tổ chức mã:**

| File | Vai trò |
|---|---|
| `src/ThongSo.ts` | Kích thước theo tư liệu: container 6,06 x 2,44 x 2,90 m, một hàng 6 giá, giá 8 mô-đun, mô-đun 1P52S (4 dãy x 13 tế bào), thứ tự nối tiếp hình rắn |
| `src/MoDun.tsx` | Mô-đun chi tiết: tế bào có hai cực và van xả, thanh nối, dải dây đo, mạch đo, tấm làm mát có rãnh uốn khúc, thanh điện áp từng tế bào, tế bào nóng lan, lưỡi ngắt mạch. Hàm `toSang` tô sáng chuyển màu dần |
| `src/Container.tsx` | Vỏ tôn sóng, 6 cửa có bản lề, khoang máy làm mát và tủ điều khiển, giá, ống chất lỏng, chữa cháy (cảm biến, ống phun, quạt hút, tấm xả áp), khối PCS + máy biến áp + tủ trung thế, cột điện, hạt điện một chiều và xoay chiều |
| `src/TeBaoCat.tsx` | Tế bào phóng to tách lớp điện cực; khối mặt cắt có ion chạy giữa sắt phosphate và than chì, electron đi mạch ngoài |
| `src/NgoaiTroi.tsx` | Cánh đồng pin, dãy container, khu nhà, mặt trời lặn; ngôi nhà có tủ pin |
| `src/Video.tsx` | Ngoài nhãn và thẻ chữ: ba biểu đồ SVG góc trái (`vit` một ngày điện, `song` một chiều và xoay chiều, `chai` dung lượng theo số vòng) |
| `tao_thoi_gian.py` | Thêm `THAY_CAU`: thay câu cuối một chương bằng file đã tăng tốc, ghép sau bước tăng tốc |

**Hình nháy (Trung báo ở bản nháp v1, giây 10–20).** Nguyên nhân: trạng thái tô sáng (`noi`) là kiểu đúng/sai, bộ phận đổi sang màu cam san hô trong đúng một khung rồi đổi về trong một khung; sáu cửa cùng tắt màu ở giây 17,77 làm chênh lệch giữa hai khung liền nhau gấp gần 7 lần mức trung bình. Cách đo: cắt các khung liên tiếp từ mp4 (ffmpeg của Remotion nhận `-s`, không nhận bộ lọc `fps=`), tính chênh lệch điểm ảnh trung bình giữa khung n và n+1 bằng PIL; nháy là chỗ vọt lên ở một khung, còn máy quay lia là chênh lệch cao kéo dài nhiều khung. Sửa: tô sáng nhận số 0..1, hàm `bat(f, a, b)` trong `KichBan.ts` chuyển dần trong 12 khung; cú lia dài kéo từ 40 lên 75 khung; ray và góc đúc nhô ra vài mm khỏi mặt vỏ (hai mặt trùng một mặt phẳng cũng làm hình lấp lóa khi máy quay chạy). Các video D-09b trước cũng dùng tô sáng bật tắt tức thì; video mới nên dùng `toSang` và `bat`.

**Một câu giọng chưa chuẩn mà máy nghe lại không bắt được.** Whisper nghe đúng chữ "lưu trữ" nhưng Trung nghe thấy chưa chuẩn. Cách làm: sinh 5 bản đọc mới (3 bản cùng câu, 2 bản thêm dấu phẩy để ngắt nhịp) bằng `tts.infer` gọi thẳng, tăng tốc 1,2 lần, cộng bản đang dùng cắt theo mốc câu; nhúng cả 6 vào một file HTML (âm thanh base64, khoảng 2,2 MB) để Trung nghe và chọn: `tai_san/giong_doc/mau_bess_luu_tru_2026.10.26/nghe_thu.html`. Bản được chọn đưa vào video nguyên trạng qua `THAY_CAU`, không tăng tốc lần hai.

**Số đo (Mac M5).** Giọng 7 cảnh 68 giây; kiểm chứng tác tử con 23 phút chạy song song với việc viết lời; dựng mô hình và dòng thời gian khoảng 45 phút; mỗi lượt kết xuất 3.559 khung khoảng 5 phút 30, file 126 MB. Bốn lượt kết xuất đầy đủ (nháp, hai lần sửa nhãn, v2) và một đoạn kiểm tra hình nháy.

## 16. Video tăng áp truyền tải: lai D-09b và D-10, lần đầu dựng bảng đen (26/10/2026)

**Sản phẩm (Trung duyệt bản nháp v3 làm bản cuối, 26/10/2026).** `san_pham/2026.10.26.tang_ap_truyen_tai/2026.10.26.tang_ap_truyen_tai_lai_d09b_d10_v3_cuoi.mp4` (sao y `_v3_nhap`, 8 cảnh, 170,7 giây, kịch bản v2; đi qua ba bản nháp, xem hai đoạn "Bản nháp v2", "Bản nháp v3" bên dưới). Bản nháp đầu `san_pham/2026.10.26.tang_ap_truyen_tai/tai_nguyen/ban_nhap/2026.10.26.tang_ap_truyen_tai_lai_d09b_d10_v1_nhap.mp4`: "Vì sao phải tăng điện áp khi truyền tải điện lên lưới", 9 cảnh, 151,6 giây, lối viết KB-08 (lần đầu dùng cho video giao), tông lai D-09b · M0 (cảnh 1, 6, 7, 8, 9) và D-10 (cảnh 2–5), nhạc "Infinity" nối lặp, giọng Hải Đăng 1,2 lần. Trung chọn qua bảng hỏi: làm một mạch tới bản nháp, cho kéo tới 150 giây, chia tông theo cảnh và chuyển bằng màn che. Kịch bản: `san_pham/2026.10.26.tang_ap_truyen_tai/tai_nguyen/kich_ban/2026.10.26.tang_ap_truyen_tai_v1.md`; nguồn: `san_pham/2026.10.26.tang_ap_truyen_tai/tai_nguyen/kich_ban/2026.10.26.tang_ap_truyen_tai_v1.nguon_kiem_chung.md` (33 khẳng định, đọc QCVN 26:2025/BCT). Mã: `xuong_dai/tang_ap/` (thành phần `TangAp`, `ThuMoHinh`).

**Cách tổ chức mã:**

| File | Vai trò |
|---|---|
| `src/ThoiGian.ts` | Hàm thời gian dùng chung (`s`, `hien`, `bat`, `tien`), tách khỏi `KichBan.ts` để màn bảng đen dùng được mà không nhập vòng |
| `src/MoHinh.tsx` | Cột thép giàn tham số theo `CotSpec` (110, 220, 500 kV; bó 4 dây cho 500 kV), chuỗi sứ có bát, dây võng parabol qua các điểm treo (`duongNoi`), cột bê tông 22 kV, máy biến áp lực, cổng trạm, nhà máy nhiệt điện có máy phát, cánh đồng pin, inverter, máy biến áp hợp bộ, máy biến áp trên cột, dãy nhà, phố, người so cỡ. Hình học dựng một lần, lưu theo khoá (`nhoG`) |
| `src/Canh3D.tsx` | Bốn chỗ đặt mô hình: `s1` nhà máy → đường dây 220 kV → thành phố; `s6` dây 22 kV phình tới đường kính gấp 5 (hình học dựng lại theo bước 0,1, có lưu đệm); `s7` chuỗi cấp điện áp dài khoảng 540 m; `s8` hai tuyến song song nhìn dọc tuyến, vầng quang |
| `src/BangDen.tsx` | Bảng đen SVG theo thẻ D-10: bảng số điền từng ô, thanh so sánh, vòng khoanh vàng vẽ dần (`strokeDashoffset`), công thức chữ nghiêng có số mũ (`tspan dy`), khung chia đôi, đồ thị tự vẽ |
| `src/KichBan.ts` | Trường `to` trong file chương (`3d` hoặc `bang`) quyết định cảnh dựng theo tông nào; màn che đổi màu dần kem ↔ đen trong 12 khung mỗi bên khi qua lại giữa hai tông |
| `src/Video.tsx` | Cảnh bảng đen không dựng `ThreeCanvas`; phụ đề đổi kiểu theo tông (nền đen, gạch xanh lá); thang "Các nấc điện áp" bên trái ở cảnh 7 |

**Khớp thời lượng.** Lời viết lần đầu (3.756 ký tự lời đọc) ước ra 180 giây; số đọc thành chữ ("một trăm mười mê-ga-oát") làm lời đọc dài hơn phụ đề khoảng 20%. Video nhiều số thì ước thời lượng theo trường `doc`, không theo `text`: giọng Hải Đăng 1,2 lần ra khoảng 22 ký tự `doc` mỗi giây. Ba lượt cắt: bỏ số không cần đọc (số vẫn hiện trên bảng), bỏ hai câu, giảm khung trống đầu và cuối cảnh (`DAU` 15 → 10, `CUOI` 24 → 14). Mỗi lượt đọc lại giọng, độ dài cảnh lệch vài giây so với lượt trước dù chữ gần như không đổi.

**Bài học:**
1. D-10 dựng bằng SVG nhanh hơn dự kiến ở thẻ: bốn cảnh bảng đen viết trong một file khoảng 300 dòng, không cần thư viện công thức. Công thức "đổi tại chỗ" làm đơn giản bằng cách thay một phần (`I²` thành `(P/U)²`) tại một khung, chưa làm hiệu ứng chuyển từng ký hiệu.
2. Máy nghe lại (Whisper) viết số bằng chữ số ("110 kV") nên mọi câu có số đều bị báo "sai 13–34%" dù có thể đọc đúng. Video nhiều số phải đưa Trung nghe các câu có số, không dựa vào tỉ lệ sai của script.
3. Tác tử con kiểm chứng bắt được ba lỗi diễn đạt mà phép tính không bắt: "nhiệt tỏa ra" phải là "công suất tỏa nhiệt"; "điện áp gấp đôi thì tổn thất còn một phần tư" phải kèm "cùng công suất"; "điện áp gấp năm, giảm 25 lần" chỉ đúng cho cặp 22 → 110 kV. Và một chữ trái quy ước viết của Trung ("dây nuốt mất").
4. Soát bằng `remotion still` phải đóng gói lại sau mỗi lần sửa lời hoặc tạo lại giọng; dùng gói cũ thì phụ đề và số khung lệch, ảnh soát không dùng được.

**Bản nháp v2: đọc chậm riêng phần công thức (Trung yêu cầu sau bản v1).** `tao_thoi_gian.py` thêm `TOC_CANH` (hệ số tăng tốc riêng từng cảnh; cảnh 2–5 dùng 1,05 thay 1,2) và `NGHI_CANH` + `NGHI` (chèn 0,7 giây lặng vào giữa quãng nghỉ sẵn có sau mỗi câu có chữ số hoặc từ "công thức", "bình phương", "nhân", "chia"; câu cuối cảnh không chèn). Mốc câu dời theo khoảng lặng nên hình trên bảng đen tự giãn theo. Không đọc lại giọng; video từ 151,6 lên 170,4 giây. Cách này dùng lại được cho mọi video có đoạn công thức: đọc chậm ở đúng đoạn đó thay vì giảm tốc cả video.

**Bản nháp v3: nêu công thức trước (Trung yêu cầu sau bản v2).** Trung muốn đầu phần bảng đen nêu và giải thích công thức trước, rồi mới thử số. Kịch bản v2 (`san_pham/2026.10.26.tang_ap_truyen_tai/tai_nguyen/kich_ban/2026.10.26.tang_ap_truyen_tai_v2.md`): cảnh "Ba công thức" mới (ba hàng đánh số, hàng đang nói sáng, hàng trước mờ), gộp hai cảnh thử số, bỏ cảnh "Đặt tên"; video còn 8 cảnh, 170,7 giây. Chỉ đọc giọng hai cảnh mới (56 giây máy); giọng cảnh cũ dùng lại bằng cách đổi số file `c<n>.*` theo thứ tự cảnh mới (chép cả phần đuôi `.moc_cau.json`, `.thongtin_vieneu.json`: lệnh đổi tên dùng `${f##*.}` làm mất phần đuôi kép, phải dùng `${b#c<cũ>}`). Bài học về lối viết: với người xem phổ thông, Trung thích nêu công thức trước rồi kiểm bằng số hơn lối "thử số rồi mới đặt tên" của KB-08; đề xuất KB-08 lần sau thì nói trước điểm này.

**Số đo (Mac M5).** Lời 17:20, kiểm chứng tác tử con 15 phút chạy song song, giọng 9 cảnh 104 giây (đọc lại 4 cảnh 50 giây), mô hình và bảng đen khoảng 60 phút, một lượt kết xuất 4.548 khung 7 phút 24, file 99 MB; hai lượt.

## 17. Video hiệu ứng che gió: hiện tượng vận hành, không phải cấu tạo thiết bị (26/10/2026)

**Bản v2 (Trung duyệt thành bản cuối 26/10/2026, không sửa).** `san_pham/2026.10.26.che_gio_tuabin/2026.10.26.che_gio_tuabin_m6_v2_cuoi.mp4` (sao y bản nháp `_m6_v2_nhap`), 52 MB. Trung chê bản v1: tua-bin trắng trên nền kem không nổi (đo 1,11:1 trên khung cắt), nhiều cảnh tua-bin quá bé, vi phạm yêu cầu tương phản đã ghi ở phụ lục bảng màu D-09b. Trung chọn: bảng M6 nền tối, tua-bin giữ trắng (đo 16,3:1); vẽ tua-bin to hơn 1,5 lần ở cảnh toàn trang trại (hằng `PHONG` trong `KichBan.ts`, ô phần trăm và vạch dưới cụm cánh theo cùng hệ số), giữ đúng tỉ lệ ở cảnh đường kích thước 7D, 4D; máy quay gần hơn ở cảnh 1, 2, 5, 7. Mã đổi: `CoBan.tsx` mặc định M6; `TuaBin.tsx` màu vỏ riêng `VO_TB` (bảng tối có màu vỏ là màu tối); `Gio.tsx` màu vệt gió theo bảng (nền tối: vệt càng mạnh càng sáng); mặt biển, bóng đổ theo bảng. Ghi quy tắc tương phản vật chính vào thẻ D-09b và phụ lục; thêm `scripts/do_tuong_phan_khung.py`. Một lượt kết xuất 6 phút.

**Bản v1 (Trung chê, giữ để so).** `san_pham/2026.10.26.che_gio_tuabin/tai_nguyen/ban_nhap/2026.10.26.che_gio_tuabin_d09b_v1_nhap.mp4`: "Hiệu ứng che gió giữa các tua-bin điện gió" (còn gọi hiệu ứng vệt gió, wake effect), 7 cảnh, 126,4 giây, lối viết KB-03 Ngược dòng (lần đầu), D-09b · M0 · N07 "Better Times are Coming" nối lặp, một cảnh bảng đen kiểu D-10, giọng Hải Đăng 1,2 lần. Trung chọn làm một mạch tới bản nháp. Kịch bản: `san_pham/2026.10.26.che_gio_tuabin/tai_nguyen/kich_ban/2026.10.26.che_gio_tuabin_v1.md`; nguồn (29 khẳng định, 8 câu sửa): `san_pham/2026.10.26.che_gio_tuabin/tai_nguyen/kich_ban/2026.10.26.che_gio_tuabin_v1.nguon_kiem_chung.md`. Mã: `xuong_dai/che_gio/` (thành phần `CheGio`; `ThuMoHinh` 10 góc máy). Thư mục mã chép từ `xuong_dai/tang_ap/` (thư viện bằng `cp -Rc`), giữ `CoBan.tsx`, `BangMau.ts`, `ThoiGian.ts`, khung `Video.tsx` và màn chuyển kem ↔ đen; mô hình cũ chuyển vào `xuong_dai/che_gio/_cu/`.

**Cách tổ chức mã (dùng lại cho video hiện tượng có dòng chảy: cắt giảm công suất, nghẽn lưới, dòng khí làm mát):**

| File | Vai trò |
|---|---|
| `src/ThongSo.ts` | Mô hình vệt gió Jensen (`thieuHut`, `thieuHutTong` cộng căn tổng bình phương, `congSuat` theo lập phương có trần định mức), các bố trí tua-bin. D = 10 đơn vị |
| `src/TuaBin.tsx` | Một tua-bin vừa chi tiết cho cả trang trại: cánh NACA xoắn có sọc cam, chụp mũi, buồng máy có tản nhiệt, tháp có mặt bích. Xoay theo hướng gió bằng `yaw = −θ` |
| `src/Gio.tsx` | `HatGio`: hạt gió kéo dài theo tốc độ; mỗi dòng có bảng thời gian T(x) = ∫dx/u tính một lần, vị trí hạt tính thẳng từ số khung nên kết xuất khung nào cũng đúng. `XoayDauCanh`: ba dải xoắn ốc. `BaoVet`: mặt bao loe R + k·x, vòng 3D/7D/10D. `BanDoVet`: ảnh DataTexture vẽ thiếu hụt tốc độ nhìn từ trên xuống, tính lại khi hướng gió đổi |
| `src/Canh3D.tsx` | Một chỗ đặt chung `CanhDong`; các cảnh chỉ khác nhau ở danh sách tua-bin, hướng gió, hạt, bản đồ, mũi tên, đường kích thước, vạch sẫm dưới cụm cánh |
| `src/Video.tsx` | Ô phần trăm công suất trên đầu từng tua-bin (chiếu theo máy quay), la bàn hướng gió góc trái dưới |
| `src/BangDen.tsx` | Cảnh 4: đồ thị Jensen tự vẽ, P ∼ v³, sơ đồ hai tua-bin, tên gọi |

**Hai lỗi hình đã sửa (đã chép sang `90_bai_hoc.md` ngày 26/10/2026, Trung duyệt):**
1. Mặt đất `meshStandardMaterial` nhận đèn bán cầu cộng đèn mặt trời, với `NoToneMapping` thì cháy thành trắng và lộ đường chân trời. Sửa: mặt đất `meshBasicMaterial` đúng màu nền, bóng đổ vẽ trên một mặt `shadowMaterial` riêng; ngoài khơi bỏ mặt bóng đổ.
2. Cảnh nhìn xa (máy quay cách khoảng 900 đơn vị) lộ ô vuông và tia sáng ở bản đồ vệt gió: hai mặt phẳng cách nhau 0,2 đơn vị tranh nhau độ sâu vì giới hạn gần của máy quay `near = 0,1`. Sửa: `near = 1`. Ảnh `still` ở góc gần không lộ lỗi này; phải soát cả khung nhìn xa.

**Bài học bố cục:** nhìn từ trên xuống, tua-bin trắng trên nền kem gần như biến mất; thêm vạch sẫm dưới cụm cánh (như ký hiệu tua-bin trên bản vẽ mặt bằng) và ô phần trăm trên đầu. Đường kích thước phải nhìn gần thẳng từ trên xuống, nhìn chếch thì bị co ngắn. Ô phần trăm từng tua-bin ở trang trại ngoài khơi (38–46% khi gió thổi dọc hàng) dễ bị hiểu nhầm là tổn thất cả năm nên đã bỏ, chỉ giữ thẻ "có thể trên 20%". Máy nghe lại báo "tua-bin" thành "tui bin", "đường kính" thành "đường kinh" ở cảnh 4 câu 1: chờ Trung nghe.

**Số đo (Mac M5).** Giọng 7 cảnh 85 giây, đọc lại 5 cảnh có câu sửa 66 giây; kiểm chứng tác tử con 6,8 phút chạy song song với viết mã; một lượt kết xuất 3.792 khung khoảng 6 phút, file 37 MB. Hai lượt kết xuất đầy đủ, bốn lượt ảnh soát `still`, hai lượt 42 khung cắt từ mp4.

## 18. Video monopile và các loại móng tua-bin ngoài khơi (26/10/2026)

**Sản phẩm (Trung duyệt bản nháp v2 thành bản cuối, 26/10/2026).** `san_pham/2026.10.26.monopile/2026.10.26.monopile_d09b_v2_cuoi.mp4` (sao y `_v2_nhap`; v1 cùng hình, nhạc cũ): "Cọc đơn monopile và các loại móng tua-bin gió ngoài khơi", 9 cảnh, 165 giây (Trung cho tối đa 170 giây), lối viết KB-07 So sánh chọn tối ưu (thẻ nháp, lần đầu dùng cho video thật), tổ hợp D-09b · M4 Biển cát · N06 "Pop Track 03" nối lặp hai bản, giọng Hải Đăng 1,2 lần. Trung chọn qua hai lượt bảng hỏi: khổ ngang, so với năm loại móng ngoài khơi cộng móng gần bờ Việt Nam, người xem là dân tài chính, làm một mạch tới bản nháp, chưa đăng. Kịch bản: `san_pham/2026.10.26.monopile/tai_nguyen/kich_ban/2026.10.26.monopile_v1.md`; nguồn: `san_pham/2026.10.26.monopile/tai_nguyen/kich_ban/2026.10.26.monopile_v1.nguon_kiem_chung.md` (51 khẳng định, 10 câu sửa). Mã: `xuong_dai/monopile/` (thành phần `Monopile`; `ThuMoHinh` 14 góc máy).

**Cách tổ chức mã:**

| File | Vai trò |
|---|---|
| `src/MoHinh.tsx` | `KhoiBien`: khối biển mặt cắt dựng từ các điểm đáy biển [x, y] đùn theo z, hai lớp đất (cát, sét) có `datMo` để trong dần, khối nước trong; dùng chung cho đáy phẳng, đáy có rãnh và dốc từ bờ ra khơi. Tua-bin 15 MW, monopile (`OngCoc` có đường hàn chu vi và dọc, `DoanChuyenTiep` có sàn, cầu cập tàu, ống luồn cáp, `BichNoi` cho kiểu bỏ đoạn chuyển tiếp, anốt, đá chống xói), giàn thép, chân ba, móng trọng lực có vật liệu dằn, móng hút lún dần có hạt nước bị bơm ra, tua-bin nổi bán chìm có dây neo, cọc nhóm có đài, tàu tự nâng, cần cẩu, búa, màn bọt khí, vòng tiếng ồn |
| `src/Canh3D.tsx` | Bốn chỗ đặt mô hình: `bien` (một tua-bin, thi công), `trai` (67 tua-bin), `hang` (năm loại móng xếp hàng, tua-bin nổi ở rãnh 90 m), `doc` (dốc đáy từ bờ ra khơi). `MAU_MONG`: mỗi loại móng một màu cố định suốt video, theo yêu cầu của thẻ KB-07 |
| `src/KichBan.ts` | Trạng thái từng khung theo mốc câu; nhãn có thêm trường `mau` (ô màu loại móng), thẻ chữ có dòng `nguon` ghi nguồn số liệu |

**Cách làm khác các video trước:**
1. Tác tử con tra số liệu trước khi viết lời (8 phút), tác tử con thứ hai kiểm chứng sau khi viết (9 phút) trong lúc dựng mô hình. Kiểm chứng bắt 10 câu nói mạnh hơn nguồn (ví dụ "nhiều dự án mới bỏ đoạn chuyển tiếp" thành "một số"; "búa tới 4.000 kJ" thành "cỡ 4.000 đến 6.000 kJ" vì búa Menck 2024 tới 6.250 kJ; Trà Vinh cũng đã có monopile nên câu về gần bờ Việt Nam đổi thành "một số dự án"). Đọc lại sáu chương có câu sửa mất 89 giây.
2. Cọc trong đất không vẽ mặt cắt nửa ống: đất đục che mọi thứ phía sau mặt cắt, nên dùng cách D-09b quen thuộc là cho cả khối đất trong dần (`datMo`) để thấy cọc cắm sâu.
3. Đá chống xói co giãn theo chiều cao phải lấy mặt đáy biển làm gốc, không lấy mặt nước (y = 0): lấy y = 0 thì đá đang hiện dần lơ lửng giữa nước.
4. Vòng tiếng ồn vẽ bằng vỏ trụ trong suốt nhìn như khối đỏ; đổi sang bốn vòng xuyến ở bốn độ sâu mỗi đợt thì đọc ra là sóng lan.

**Lỗi kết xuất treo ngẫu nhiên.** Lượt kết xuất thứ hai dừng ở khung 1532 vì quá thời gian chờ (`Timeout ... rendering the component at frame 1532`), lệnh `still` trước đó cũng treo một lần ở khung 1572; chụp riêng từng khung đó thì được. Kết xuất lại với `--concurrency=4 --timeout=180000`.

**Đổi nhạc mà không kết xuất lại hình.** Bản v1 dùng N02 "Your Breath"; Trung nghe thấy tiếng rè từ giây 60. Đo bằng biến đổi Fourier từng đoạn 5 giây: từ khoảng giây 50 tới 80 và từ 90 tới 115 bài có thêm một lớp tiếng cao tần (năng lượng trên 10 kHz tăng 5 dB, trên 16 kHz tăng 14 dB), tiếng trộn không bị cắt đỉnh. Đổi sang N06 rồi chỉ xuất phần tiếng: `npx remotion render src/index.ts Monopile out/tieng.wav --codec=wav` (1,5 phút), ghép vào hình cũ bằng ffmpeg đi kèm Remotion (`-map 0:v -map 1:a -c:v copy`). Nhanh hơn kết xuất lại cả video khoảng 5 lần.

**Số đo (Mac M5).** Tra số liệu tác tử con 8 phút chạy song song với đọc khuôn mã; giọng 9 cảnh 113 giây; mô hình và dòng thời gian khoảng 45 phút; soát 14 góc mô hình, 72 khung `still`, 55 khung cắt từ mp4; lượt kết xuất 4.949 khung với 4 luồng 7 phút 27 giây, file 64 MB.

## 20. Cảnh thử D-11 Phòng chụp & viền sáng: Blender Cycles, viền sáng từ ảnh mặt nạ (26/10/2026)

Học từ video "How did the Lunar Roving Vehicle work?" của kênh Jared Owen (thẻ `tai_san/so_tay_gu/dung/d11_phong_chup_vien_sang.md`). Cảnh thử 12,4 giây về buồng máy tua-bin gió, 3 câu lấy từ kịch bản buồng máy đã kiểm chứng (`san_pham/2026.10.26.canh_thu_d11_buong_may/tai_nguyen/kich_ban/2026.10.26.canh_thu_d11_v1.md`). Bản nháp: `san_pham/2026.10.26.canh_thu_d11_buong_may/2026.10.26.canh_thu_d11_buong_may_v1_nhap.mp4`. Mã: `xuong_dai/d11_thu/`.

**Vì sao dùng Blender Cycles (ngoại lệ của quy tắc mục 6):** mẫu dựng bằng Blender 4.5 Cycles; vật liệu kim loại và bóng đổ mềm trên nền phòng chụp cần dò tia. Mô hình buồng máy chép từ `xuong_dai/tuabin_gio/canh3d/dung_blender.py` (bỏ tháp, cánh dài, máy biến áp, cánh đồng; thay cánh bằng ba đoạn gốc cánh).

**Cách tổ chức:**

| File trong `xuong_dai/d11_thu/` | Vai trò |
|---|---|
| `tao_thoi_gian.py` | Tăng tốc giọng 1,2 lần, ghi `src/thoi_gian.json`: mốc câu và mốc 5 từ khoá (lấy từ `moc_tu.json` của VieNeu). Blender và Remotion cùng đọc file này |
| `canh3d/dung_blender.py` | Hai lượt cùng một máy quay. `--luot mau`: Cycles trên GPU Metal, nền trong suốt, sàn bắt bóng (shadow catcher), nhòe chuyển động màn trập 0,5 khung, ra PNG có kênh trong suốt. `--luot mat_na`: Workbench màu phẳng theo vật, đỏ trục chính, lục hộp số, lam máy phát, vật khác đen để che khuất. `--ti-le 50 --thu-muc blender_nhap` cho lượt nháp. Khoá chuyển động đặt từng khung (máy quay, bánh răng quay đúng tỉ số răng, độ trong của vỏ) để Cycles tính được nhòe |
| `src/Video.tsx` | Nền xám gradient tròn đặt sau ảnh Blender; viền xanh ngọc dựng bằng bộ lọc SVG trên ảnh mặt nạ (lấy một kênh màu, nới rộng 3,5 điểm ảnh, trừ hình gốc, làm nhoè thêm lớp quầng); nhãn chữ có chân, mũi tên đỏ, phụ đề theo câu |

Viền dựng trong Remotion chứ không vẽ trong Blender (Freestyle) để đổi lúc hiện, độ dày, màu viền mà không kết xuất lại 3D. Lượt mặt nạ rất rẻ: 372 khung trong 8,9 giây.

**Số đo lượt nháp (Mac M5, 960×540, Cycles 32 mẫu, khử nhiễu, nhòe chuyển động):** 344 khung chạy liền 79 phút, trung bình 13,8 giây mỗi khung, tăng dần theo cảnh: khung 0–99 (vỏ còn kín) 6,8 giây; 100–199: 10,1; 200–299 (thấy bánh răng qua nắp mờ): 14,9; 300–371 (máy phát qua ba lớp vỏ trong suốt): 24,7 giây; khung chậm nhất 109 giây. Lần đầu chạy Cycles mất thêm khoảng 80 giây biên dịch nhân GPU. Remotion ghép 372 khung trong 77 giây. Đây là số đo đầu tiên cho đề xuất "kết xuất nháp" ở mục 9.

**Ước bản 1920×1080 (chưa chạy):** gấp 4 lần số điểm ảnh, ước 40–55 giây mỗi khung ở 32 mẫu, khoảng 4–5 giờ cho 12,4 giây. Video D-11 dài 2 phút sẽ mất cả ngày máy chạy nếu giữ cách này. Hướng giảm trước khi làm video thật: thay độ trong của vỏ bằng ẩn hẳn sau khi mờ (vật trong suốt là phần tốn nhất), giảm lượt xuyên trong suốt, hoặc dùng EEVEE cho cảnh không cần dò tia (D-08 đo 2,6 giây mỗi khung 1080p).

**Lỗi đã vấp:** (1) vỏ mờ dần hiện thành mảng đen kịt: vỏ dày hai mặt nhiều lớp làm hết lượt xuyên trong suốt mặc định (8); sửa bằng `transparent_max_bounces = 64`. (2) Đèn chính đặt cao phía trên bị nóc buồng máy che, bên trong tối; chuyển đèn chính chếch về phía máy quay (+Z). (3) Chuyển màu "Standard" làm vỏ trắng cháy sáng; dùng AgX. (4) Lượt chạy đầu tiên dừng sau 20 khung không để lại lỗi vì lệnh lọc mất thông báo; chạy lại bằng vòng lặp tự bỏ qua khung đã có và ghi đủ nhật ký (`out/ket_xuat_mau_<n>.txt`).

**Trung xem bản nháp (26/10/2026): chưa đạt.** Trung nhận xét hình Blender không đẹp hơn các video Remotion + Three.js đã làm, chưa thấy thế mạnh của Blender, chưa có hoạt cảnh. Ba nguyên nhân: mô hình tự dựng bằng khối cơ bản (cạnh không vát, thiếu bu-lông, cáp, đường ghép tấm); vật liệu màu phẳng không vân; hoạt cảnh chỉ có máy quay lượn, vỏ mờ dần, bánh răng quay. **Quy tắc rút ra:** chỉ dùng Cycles khi có mô hình chi tiết (tải về hoặc làm tay) và vật liệu có vân; mô hình khối cơ bản thì dùng Three.js như mục 6. Lần thử 2 dùng mô hình chi tiết tải về, hoạt cảnh tách rời rồi lắp lại, mặt cắt mở ra, độ sâu trường ảnh.

**Lần thử 2 (27/10/2026): xe tự hành Mặt Trăng bằng mô hình tải về.** Mã `xuong_dai/d11_lrv/`, kịch bản `san_pham/2026.10.26.canh_thu_d11_lrv/tai_nguyen/kich_ban/2026.10.26.canh_thu_d11_lrv_v2.md` (lời kiểm chứng bằng NASA NSSDCA và Wikipedia). Khác lần 1: Blender mở thẳng file `.blend` của mô hình (`Blender -b --disable-autoexec <mô hình> -P canh3d/dung_blender.py`); script xoá đèn và máy quay của tác giả, thay trời xám, thêm sàn bắt bóng. Hoạt cảnh làm bằng `delta_location` đặt khoá từng khung (không đụng vị trí gốc của vật), nên lắp ráp, tách bánh, nhấc pin đều có nhòe chuyển động. Độ sâu trường ảnh dùng một vật rỗng làm điểm nét, đi theo điểm nhìn của máy quay. File mô hình để sẵn kiểu xuất EXR nhiều lớp, phải đặt `image_settings.media_type = "IMAGE"` trước khi đổi sang PNG. Mô hình chỉ khoảng 1/5 kích thước thật, nên khoảng cách máy quay, công suất đèn và f-stop phải chỉnh theo (cùng f-stop thì nhòe hậu cảnh mạnh hơn). Tìm mô hình buồng máy tua-bin: Sketchfab không có mô hình miễn phí đúng cấu tạo; hai mô hình buồng máy cắt hở trên TurboSquid (89 và 149 USD) đều là loại không hộp số; mô hình 19 USD (TurboSquid 2589815, file Blender, có hộp số) là phương án nếu làm lại tua-bin.

**Số đo (Mac M5, 960×540, Cycles 24 mẫu, khử nhiễu, nhòe chuyển động, độ sâu trường ảnh):** 412 khung trong 89 phút, trung bình 13,0 giây mỗi khung (7,6–100 giây; lần đầu nạp mô hình và vân 4K mất khoảng 45 giây). Mặt nạ 412 khung mất 234 giây (Workbench chậm hơn lần 1 vì 3,1 triệu đa giác). Remotion ghép trong 41 giây.

**Cách làm đã đóng gói (27/10/2026):** skill `skills/dung-hoat-canh-3d-blender/` gom quy trình 10 bước, khuôn mã, bài học và nguồn mô hình của hai cảnh thử này. Là một lựa chọn cho video giai đoạn 3, không thay khung mã D-09b.

## 21. Video điện áp, dòng điện, điện trở: toàn bộ D-10, khung chia đôi (26/10/2026)

**Sản phẩm (Trung duyệt 26/10/2026, không sửa).** `san_pham/2026.10.26.dien_ap_dong_dien_dien_tro/2026.10.26.dien_ap_dong_dien_dien_tro_d10_v1_cuoi.mp4` (sao y bản nháp `_v1_nhap`): 9 cảnh, 176,9 giây, lối viết KB-02 (lần đầu dùng cho video thật), tông D-10 toàn bộ, nhạc N05 "Curiosity" nối lặp, giọng Hải Đăng 1,2 lần (cảnh 6 định luật Ôm 1,05 lần, nghỉ thêm 0,7 giây sau câu có số), phụ đề chạy chữ theo từng từ. Trung chọn qua bảng hỏi: khổ ngang, có định luật Ôm và ví dụ số, mạch điện thật cạnh mô hình nước, người xem không học kỹ thuật, kênh công khai, làm một mạch tới bản nháp. Kịch bản: `san_pham/2026.10.26.dien_ap_dong_dien_dien_tro/tai_nguyen/kich_ban/2026.10.26.dien_ap_dong_dien_dien_tro_v1.md`; nguồn: `...v1.nguon_kiem_chung.md` (35 khẳng định, tác tử con Sonnet kiểm trong lúc đọc giọng; 4 câu sửa cách diễn đạt). Mã: `xuong_dai/dien_ap/` (thành phần `DienAp`).

**Cách tổ chức mã:** chỉ bốn file nguồn. `src/BangDen.tsx` chứa mọi hình (khoảng 600 dòng): thành phần dùng chung (pin, bóng đèn, điện trở, đồng hồ đo, bồn nước, hạt chạy dọc đường gấp khúc, ngoặc đo khoảng chênh, đường dây trên cột, con chim, người) và một thành phần mỗi cảnh. `src/Video.tsx` chỉ ghép bảng đen, phụ đề chạy chữ, giọng và nhạc. `src/ThoiGian.ts` và `src/PhuDeChayChu.tsx` chép nguyên từ `tang_ap/` và `may_bien_ap/`. `tao_thoi_gian.py` gộp tốc độ riêng từng cảnh và khoảng lặng của video tăng áp với mốc từng từ của video BESS; mốc từ cộng thêm khoảng lặng đã chèn trước câu đó. Thư viện Node chép cả thư mục `node_modules` của `tang_ap/` (gói Three.js thừa nhưng vô hại).

**Màu gắn vai trò cả video:** cam = điện áp, xanh lá = dòng điện, đỏ hồng = điện trở, xanh dương = nước, vàng = vòng khoanh. Khác thẻ D-10 gốc (xanh lá = thứ đang tính, xanh dương = kết quả) vì video giải thích ba đại lượng chứ không phải một phép tính.

**Bài học:**
1. Video D-10 toàn SVG làm nhanh: từ lúc viết xong lời tới bản kết xuất đầu khoảng 1 giờ máy làm, phần lớn là giọng (398 giây lượt đầu, 164 giây đọc lại 6 cảnh). Không có lỗi trạng thái nhiều khung như vật liệu 3D, nên ảnh `still` gần như khớp file mp4.
2. Soát 16 khung `still` bắt được 6 lỗi bố cục: chữ chồng chữ ở chỗ vạch chia đôi dài quá vùng chữ dưới, lớp hình cũ mờ 20% vẫn làm rối khi lớp mới đè lên (cho mờ hẳn về 0), nhãn "MÔ HÌNH NƯỚC / MẠCH ĐIỆN" đè chữ khi cảnh đổi chỗ hai nửa, dây tóc bóng đèn vẽ răng cưa trông giống ký hiệu điện trở (đổi thành cuộn vòng), vòng khoanh vàng đè mũi tên.
3. Kiểm chứng bắt lỗi diễn đạt chứ không bắt lỗi số: "chính là" đồng nhất mô hình nước với mạch điện (mô hình hai bồn cạn dần, pin thì giữ điện áp không đổi); "điện áp tụt khi qua đèn" mâu thuẫn với câu "điện áp luôn đo giữa hai điểm"; số 2 A trên cục sạc là dòng tối đa, không phải dòng luôn chạy. Cảnh có mũi tên dòng điện phải nói chiều quy ước ngược chiều electron.

## 22. Video máy xạ trị proton Mevion S250-FIT: video y khoa đầu tiên (26/10/2026)

**Sản phẩm (bản nháp, chờ Trung duyệt).** `san_pham/2026.10.26.may_xa_tri_proton/2026.10.26.may_xa_tri_proton_d09b_v2_nhap.mp4`: 8 cảnh, 165,6 giây, KB-05, D-09b · bảng M1 Trời trong (tông xanh y tế, khác chuỗi video điện), nhạc "Infinity" nối lặp, giọng Hải Đăng 1,2 lần, phụ đề chạy chữ theo từng từ (thành phần `ProtonChayChu`). Trung chọn qua bảng hỏi: gộp hai ý (đỉnh Bragg, vì sao máy gọn), đăng kênh khoa học công khai (không logo, không ảnh Tâm Anh hay Mevion, chỉ nói cơ chế), Claude tự soạn từ nguồn công khai, giữ cửa duyệt chữ. Kịch bản: `san_pham/2026.10.26.may_xa_tri_proton/tai_nguyen/kich_ban/2026.10.26.proton_mevion_v2.md` (bản 1 là bản Trung duyệt chữ trước kiểm chứng); nguồn: `san_pham/2026.10.26.may_xa_tri_proton/tai_nguyen/kich_ban/2026.10.26.proton_mevion_v1.nguon_kiem_chung.md` (37 khẳng định). Mã: `xuong_dai/proton/`.

**Cách tổ chức mã:**

| File | Vai trò |
|---|---|
| `src/ThongSo.ts` | Trục chùm tia, tâm điều trị, kích thước máy và phòng (11,5 × 8,5 × 3,5 m theo bài nghiệm thu Stanford) |
| `src/MayProton.tsx` | Synchrocyclotron trục z: vỏ, gông, cực, cuộn siêu dẫn, buồng, hai điện cực chữ D, vệt xoắn ốc (ống dựng lại mỗi 8 điểm), khe lóe sáng mỗi nửa vòng, 12 tấm chọn năng lượng có mô-tơ, nam châm quét, đầu ra rút vào được, lá chuẩn trực (`LaChuanTruc` dùng lại ở `KhoiU`), hàm `toSang` |
| `src/Phong.tsx` | Phòng, ghế robot xoay và nâng hạ, hình nộm ngồi không mặt, máy CT hình vòng trục đứng, hai chùm X-quang kiểm tra |
| `src/CoThe.tsx` | Đầu cổ cắt lớp với khối u sát tủy sống; hai làn mô cho đỉnh Bragg; hàm liều `lieuX`, `lieuP` dùng chung với biểu đồ SVG |
| `src/TrungTamCu.tsx` | Trung tâm proton kiểu cũ: hầm máy gia tốc, đường ống, nam châm uốn, khung quay đường kính 11 m, người đứng so tỉ lệ |
| `src/KhoiU.tsx` | Khối u chia 6 lát, chùm tia đặt liều ziczac từng điểm, lá chuẩn trực khép theo hình lát |

**Kiểm chứng sau khi giọng đã đọc.** Tác tử con (Sonnet, 12 phút, chạy song song lúc dựng mô hình) bắt hai câu sai nội dung mà Claude viết từ trí nhớ: proton "nhả gần hết năng lượng ở vài mm cuối" (thật ra vài mm cuối chỉ chứa khoảng 9% năng lượng; chỗ đỉnh là chỗ nhả dày nhất trên mỗi mm) và "nam châm siêu dẫn gia tốc proton" (nam châm chỉ bẻ đường đi). Bốn thông số chỉ có trong bản thảo nghiệm thu Stanford bị bỏ khỏi lời theo quy tắc "không đưa số một nguồn vào video". Phải đọc lại giọng cả 8 cảnh (132 giây máy chạy) và kết xuất lại. Bài học: với thiết bị mới ra, giao kiểm chứng trước khi trình duyệt chữ, không phải sau; nguồn chính duy nhất của thiết bị thường là bài có tác giả của hãng.

**Tương phản trên bảng M1 (nền xanh rất nhạt #EAF2FA).** Lượt đo đầu sau bản nháp: vỏ máy trắng 1,09:1, hình nộm 1,99:1, tia X cam sáng 1,5:1, dải proton xanh 2,4:1, khối u 1,8:1 — đều dưới ngưỡng 3:1. Nguyên nhân: ánh sáng bán cầu, ánh sáng môi trường và phát sáng (emissive) làm màu lên hình sáng hơn màu gốc khoảng 1,3–1,5 lần, cộng lớp da hoặc hộp trong suốt phủ lên làm nhạt thêm. Sửa: vỏ máy, ghế, CT dùng `VO_MAY` #5A6D82 (đo 3,81:1), hình nộm #3F4D5E (6,1:1), tia X #933F10, proton #173E8F, khối u #B5173B, tủy sống #2B343E; bỏ phát sáng ở dải liều, da đầu mờ 0,06, hộp làn 0,08. Bài học: với bảng màu nền sáng, chọn màu gốc tối hơn màu muốn thấy trên hình, và đo ngay ở lượt soát `still` đầu tiên chứ không đợi bản nháp.

**Số đo (Mac M5).** Giọng 8 cảnh 132 giây mỗi lượt; dựng 6 mô hình và dòng thời gian khoảng 70 phút; soát khoảng 60 khung `still` qua năm lượt; kết xuất 4.969 khung khoảng 8 phút (file khoảng 50 MB); bốn lượt kết xuất đầy đủ (lời cũ, bản 2, hai lượt sửa tiêu đề và tương phản).

## 24. Video proton viết lại thành hai video theo KB-02 (27/10/2026)

**Vì sao làm lại.** Trung xem bản nháp mục 22 và chê khó hiểu ở bốn chỗ (chọn qua bảng hỏi): nhiều thuật ngữ, nhịp nhanh, thiếu ví dụ đời thường, mạch nhảy. Trung chọn: lối viết KB-02 Giải ngố, tách thành hai video, hình "chi tiết hơn trên bộ phận đã có" (không tháo rời từng lớp), giữ D-09b · M1, đọc 1,1 lần có nghỉ dài hơn.

**Sản phẩm (bản nháp, chờ Trung duyệt).** `san_pham/2026.10.27.proton_dinh_bragg/2026.10.27.proton_dinh_bragg_d09b_v1_nhap.mp4` (7 cảnh, 123,8 giây; thuật ngữ chính "đỉnh Bragg"; so sánh người chạy qua đám đông) và `san_pham/2026.10.27.proton_ben_trong_may/2026.10.27.proton_ben_trong_may_d09b_v1_nhap.mp4` (9 cảnh, 140,1 giây; thuật ngữ chính "máy gia tốc"; so sánh đường đua). Kịch bản: `san_pham/2026.10.27.proton_dinh_bragg/tai_nguyen/kich_ban/2026.10.27.proton_dinh_bragg_v1.md`, `san_pham/2026.10.27.proton_ben_trong_may/tai_nguyen/kich_ban/2026.10.27.proton_ben_trong_may_v1.md`; nguồn: `san_pham/2026.10.27.proton_dinh_bragg/tai_nguyen/kich_ban/2026.10.27.proton_hai_video_v1.nguon_kiem_chung.md` (39 khẳng định, 7 câu chỉnh trước khi trình Trung duyệt chữ). Mã: `xuong_dai/proton_bragg/`, `xuong_dai/proton_may/` (chép từ `proton/`).

**Cách làm khác mục 22:**
1. Kiểm chứng giao tác tử con ngay sau khi viết nháp, áp câu thay thế rồi mới trình duyệt chữ, nên giọng chỉ đọc một lần. Kiểm chứng bắt thêm một lỗi hình: máy Mevion có một điện cực chữ D mang điện và một mặt nối đất (sáng chế US8952634), không phải hai chữ D như mô hình mục 22.
2. `tao_thoi_gian.py` mới: đọc 1,1 lần, chèn 0,5 giây lặng giữa hai câu (cắt ở điểm giữa khoảng lặng sẵn có, cách của `dien_ap/`), cộng dồn vào mốc câu và mốc từng từ.
3. `DamDong.tsx` (video 1): 14 hàng hình nộm xám nhạt #9AA6B4, người chạy xanh đậm phóng 1,25 lần; người bị va nghiêng và chuyển vàng; dải năng lượng dưới hành lang vẽ bằng đúng hàm `lieuP`, `lieuX`, mọc theo bước chạy. Lượt soát đầu: đám đông màu tối làm người chạy lẫn vào, dải năng lượng chỉ hiện ở cuối.
4. Chi tiết thêm ở `MayProton.tsx` (video 2): cuộn dây 4 lớp × 5 vòng quấn, 24 bu lông gông, hai đầu làm lạnh có ống, nguồn ion và ống khí ở tâm (hạt khí chạy vào), thân điện cực chữ D ra ngoài, thanh dẫn hướng tấm chắn, vạch vòng dây trên cuộn nam châm quét, bể nước có thước 5 cm; `Phong.tsx`: vòng bi đế ghế, xi lanh nâng, đai ngực, tựa tay.
5. Lớp chữ mới: `chuLon` (chữ lớn giữa màn cho câu chốt), biểu đồ `cot` (so sánh định tính năng lượng trước, trong, sau khối u) và `xoan` (vòng xoắn nam châm yếu và mạnh).

## 25. Video máy phát (N05) bản v3: vẽ lại ba cuộn dây và tỉ lệ máy (27/10/2026)

**Trung chê bản v2_cuoi.** Hình ba cuộn dây sai, thiếu chi tiết, sai tỉ lệ. Cụ thể trong mã: mỗi pha chỉ là hai thanh hộp ở bán kính 2,4 không nằm trong rãnh; đầu cuộn là nửa vòng xuyến cùng bán kính cho cả ba pha, chỉ lệch độ sâu, nên nhìn chính diện thành ba vòng cung đè nhau; không thấy vòng dây; rôto nhỏ, khe hở rộng; 36 rãnh không đều; dây ra là ba thanh thẳng.

**Sửa (`xuong_dai/may_phat/src/MoHinh.tsx`, `KichBan.ts`, `Video.tsx`, `ThongSo.ts`).** Stato 12 rãnh thành song song, lỗ bán kính 2,0. Mỗi pha một cuộn khung 6 vòng dây tròn (2 lớp × 3 cột) nằm trong hai rãnh đối nhau 180°; đầu cuộn ra khỏi rãnh bẻ ngang sát mặt stato rồi vòng nửa vòng ở bán kính riêng của pha (A 2,66, B 2,95, C 3,24), ba đầu cuộn lồng nhau không đè. Rôto trụ tròn 2 cực (nửa đỏ cực bắc, nửa xanh cực nam, hai dải thép giữa cực có thanh đồng kích từ), bán kính 1,92, khe hở 4 %. Chữ N, S là nhãn HTML đặt giữa mặt trước hai cực, quay theo rôto. Nhãn rãnh A, A', B, B', C, C' đặt ở mép lỗ stato. Dây ra: mỗi pha một dây từ đầu cuộn trước, ra ngoài đầu cuộn, gom lên đỉnh rồi thẳng lên hộp đấu dây; vỏ dài 5,4 để chứa đầu cuộn, vòng trượt dời ra sau. Cảnh 4: mở bằng góc chéo khoảng 30° nhìn hơi từ trên, stato trong dần (độ đục 0,26) để thấy khung cuộn chạy suốt rãnh; tới chữ "120" (mốc từ, hàm `tuMoc` trong `ThoiGian.ts`) máy quay xoay về chính diện trong 2 giây, stato đặc lại, nhãn rãnh hiện. Giọng chương 3, 4, 7 đọc lại "sờ-ta-to" (`--he-so-keo 1`), video 118,5 giây.

**Soát.** 20 khung `still` qua bốn lượt; quét 3.554 khung không có khung hỏng; tương phản cuộn dây so nền từ 3,15:1 (pha A, góc chéo) tới 5,46:1.

**Bài học.** Dựng máy điện nhiều cuộn phải nhìn thử chính diện theo trục máy: các phần cùng bán kính sẽ chồng thành vòng kín, tách bằng bán kính chứ không bằng độ sâu (chi tiết `90_bai_hoc.md` 27/10/2026). Nhãn chỉ rãnh đặt ngoài vỏ thì nhìn chéo bị phối cảnh kéo xa khỏi rãnh, đặt ở mép lỗ stato thì đúng chỗ ở mọi góc; ở góc chéo nhãn rãnh lại nằm đè lên mặt rôto nên chỉ cho hiện khi máy quay đã về chính diện.

## 26. Lô 18 video điện chung và điện mặt trời: ghi chú theo dự án dựng (27–28/10/2026)

Quy tắc dựng dùng chung rút ra từ lô này nằm ở `10_video_ngang_thuyet_minh.md` mục 25 (ghi nguồn "lô 18 video, N.."). Mục này chỉ giữ chi tiết gắn với từng dự án dựng. Sổ theo dõi lô: `san_pham/2026.10.27.lo_video_dien_chung_va_mat_troi/tai_nguyen/kich_ban/2026.10.27.so_theo_doi_lo.md`. Mã N ở đây là mã việc của lô 18 video, không trùng mã N03 đến N17 của chuỗi 15 video (mục 23 của file 10).

**`xuong_dai/buc_xa_mat_troi/` (N29, bức xạ mặt trời, lai CL-07 + CL-05).**
1. Hàm `bat(f, a, b)` trong `src/ThoiGian.ts` là cửa sổ bật rồi tắt tại b, không phải dốc lên rồi giữ; muốn dốc lên rồi giữ dùng `tien(f, a, b)` (kiểm 28/10/2026: `bat` gọi `hien(f, a, b, 12, 12)`; `tien` dốc từ 0 tới 1 rồi giữ ở 1).
2. `TamPinLon` (chép từ `xuong_dai/mwp_mwac/src/MoHinh.tsx`) đặt tấm gần đứng. Tấm nghiêng thật dùng `TamPin` (`src/MoHinh.tsx` của chính dự án) với `nghieng = π/2 − β`.
3. `scripts/goi_y_to_hop_dung.py` chỉ đọc mã đầu tiên của mỗi trục ở dòng Biến tấu, nên mã thứ hai của video lai không được tính. Video lai ghi "CL-07 + CL-05" bằng chữ.

**`xuong_dai/neo_dien_noi/` (N31, neo giữ nhà máy điện nổi), dùng `PhaoNoi.tsx` v2 của `xuong_dai/phao_noi/` (N33).**
1. `DaoPhao` cần tham số `x0` khi đảo dịch ngang, để phao nhấp nhô khớp sóng. Bản `xuong_dai/phao_noi/src/PhaoNoi.tsx` chưa có `x0`; bản chép sang `xuong_dai/neo_dien_noi/src/PhaoNoi.tsx` đã thêm `x0 = 0` (kiểm 28/10/2026). Video dùng đảo phao dịch ngang chép bản của `neo_dien_noi/`.

