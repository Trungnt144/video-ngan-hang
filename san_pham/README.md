# san_pham — thành phẩm của project Media

Từ 27/10/2026 mỗi sản phẩm một thư mục, xếp phẳng theo ngày, tên `yyyy.mm.dd.<chủ_đề>` (ngày mở việc). Quy tắc đầy đủ: `AGENTS.md` mục "Quy ước sản phẩm".

```
san_pham/2026.10.27.cat_giam/
├── 2026.10.27.cat_giam_youtube_v1_cuoi.mp4        bản gốc: video ngang YouTube
├── 2026.10.27.cat_giam_shorts_v1_cuoi.mp4         bản dọc 30–60 giây (nếu có)
├── 2026.10.27.cat_giam_tiktok_v1_cuoi.mp4         liên kết cứng tới bản shorts khi cùng nội dung
├── <...>_hinh_thu_nho_v1.jpg                       hình thu nhỏ YouTube, bản tải lên (nếu có)
└── tai_nguyen/
    ├── dang_bai/           chữ đăng bài từng nền tảng: youtube.md, shorts.md, tiktok.md, facebook.md (skill viet-chu-dang-video; vào git)
    ├── nguon_goc.md        mã dựng ở đâu, thành phần Remotion, lệnh dựng lại (vào git)
    ├── kich_ban/           kịch bản, file chia chương hoặc cảnh, nguồn kiểm chứng (vào git)
    ├── am_thanh/           bản chép giọng đọc và nhạc nền
    ├── ban_nhap/           bản nháp, cảnh thử khác bản cuối
    ├── phien_ban_cu/       bản cuối cũ đã được thay
    ├── tu_lieu/            nghiên cứu, câu lệnh giao công cụ AI, nguồn tham khảo
    └── hinh_thu_nho_goc/   bản gốc 4K PNG của hình thu nhỏ
```

Tên file video mới (Trung chốt 27/10/2026): `yyyy.mm.dd.<chủ đề>_v<n>[_nhap|_cuoi].mp4`, không ghi mã dựng. Tổ hợp năm trục và cách làm ghi trong kịch bản (dòng "Biến tấu") và `tai_nguyen/nguon_goc.md`, không đưa vào tên file. Video cũ giữ tên cũ (có mã dựng như `_d09b_`); đường dẫn cũ tra bảng chuyển.

Từ 28/10/2026 (Trung chốt): một nội dung có bản cho nhiều nền tảng vẫn chung một thư mục; tên file thêm nền tảng `yyyy.mm.dd.<chủ đề>_<nền tảng>_v<n>[_nhap|_cuoi].mp4` với nền tảng `youtube`, `shorts`, `reels`, `tiktok`, `facebook`, `zalo`. File không có tên nền tảng coi là bản YouTube ngang. Lý do và nguyên tắc: `00_tam_nhin_va_muc_tieu.md`.

Git: chỉ `tai_nguyen/kich_ban/`, `tai_nguyen/nguon_goc.md`, các file `.md` trong `tai_nguyen/dang_bai/` (từ 28/10/2026), file này, bảng chuyển và sơ đồ dự án vào git. Video, ảnh, âm thanh, tài liệu xuất ra nằm ngoài git (sao lưu tuần không chép chúng).

Ngoại lệ: sơ đồ dự án (`yyyy.mm.dd.so_do_du_an_media_*`) giữ nguyên ngoài cùng thư mục này.

Đường dẫn cũ trước 27/10/2026 (trong `99_nhat_ky.md`, kịch bản cũ) → đường dẫn mới: `_bang_chuyen_duong_dan_2026.10.27.tsv`. 25 bản nháp giống hệt từng byte với bản cuối đã bỏ vào Thùng rác ngày 27/10/2026.

## Mục lục lúc sắp xếp (27/10/2026)

Bảng dưới là danh sách lúc sắp xếp; phần "Bổ sung ngày 28/10/2026" ghi thêm các thư mục mở sau đó. Danh sách đang có luôn xem bằng `ls san_pham/`.

### Video (34)

| Thư mục | Video | Trạng thái |
|---|---|---|
| `2026.07.28.model_nho_thang_model_to/` | Model nhỏ thắng model to | Chỉ có bản thử |
| `2026.10.25.Pin mặt trời hoạt động như thế nào mà không cần bộ phận quay?/` | Pin mặt trời làm lại theo thẻ D-09b | Đã duyệt bản cuối |
| `2026.10.25.tuabin_gio/` | Nguyên lý tạo điện của tua-bin gió, bản 3D | Đã duyệt bản cuối |
| `2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/` | Bên trong hệ thống pin lưu trữ BESS | Đã duyệt bản cuối |
| `2026.10.26.buong_may_tuabin/` | Bên trong buồng máy tua-bin gió | Đã duyệt bản cuối |
| `2026.10.26.che_gio_tuabin/` | Hiệu ứng che gió giữa các tua-bin điện gió | Đã duyệt bản cuối |
| `2026.10.26.dien_ap_dong_dien_dien_tro/` | Điện áp, dòng điện, điện trở | Đã duyệt bản cuối |
| `2026.10.26.hop_so_tuabin/` | Bên trong hộp số tua-bin gió | Bản nháp chờ duyệt |
| `2026.10.26.Cấu tạo chi tiết của Inverter điện mặt trời/` | Bên trong inverter điện mặt trời | Đã duyệt bản cuối |
| `2026.10.26.may_bien_ap/` | Bên trong máy biến áp | Đã duyệt bản cuối |
| `2026.10.26.may_xa_tri_proton/` | Máy xạ trị proton Mevion S250-FIT hoạt động thế nào | Bản nháp chờ duyệt |
| `2026.10.26.monopile/` | Cọc đơn monopile và các loại móng tua-bin gió ngoài khơi | Đã duyệt bản cuối |
| `2026.10.26.tang_ap_truyen_tai/` | Vì sao phải tăng điện áp khi truyền tải điện lên lưới | Đã duyệt bản cuối |
| `2026.10.26.tuabin_khong_hop_so/` | Tua-bin gió không hộp số, nguyên lý tạo ra điện | Bản nháp chờ duyệt |
| `2026.10.27.bao_iec/` | Bão và cấp tua-bin IEC, chu kỳ lặp 50 năm | Đã duyệt bản cuối |
| `2026.10.27.cat_giam/` | Cắt giảm công suất (curtailment) tại nhà máy điện | Đã duyệt bản cuối |
| `2026.10.27.Cánh đồng pin mặt trời có những gì?/` | Một nhà máy điện mặt trời gồm những gì | Đã duyệt bản cuối |
| `2026.10.27.Điện mặt trời nổi và sự thay đổi thế nào khi nước lên xuống/` | Điện mặt trời nổi: mực nước hồ và hệ neo | Đã duyệt bản cuối |
| `2026.10.27.duong_cong_cs/` | Đường cong công suất tua-bin: bắt đầu phát, định mức, dừng | Đã duyệt bản cuối |
| `2026.10.27.gio_do_cao/` | Gió càng cao càng mạnh, vì sao tua-bin ngày càng cao | Đã duyệt bản cuối |
| `2026.10.27.gio_lap_phuong/` | Gió gấp đôi, điện gấp tám | Đã duyệt bản cuối |
| `2026.10.27.gio_mua/` | Gió mùa và mùa vụ sản lượng điện gió | Đã duyệt bản cuối |
| `2026.10.27.he_so_cong_suat/` | Hệ số công suất, số giờ phát tương đương | Đã duyệt bản cuối |
| `2026.10.27.kw_kwh/` | Công suất và điện năng: kW, kWh, MW, GWh | Đã duyệt bản cuối |
| `2026.10.27.may_bien_ap_hop_bo/` | Máy biến áp hợp bộ ở nhà máy điện gió, điện mặt trời | Kịch bản v1 chờ duyệt chữ (sổ nợ N54) |
| `2026.10.27.may_phat/` | Máy phát điện xoay chiều, ba pha, 50 Hz | Đã duyệt bản cuối |
| `2026.10.27.MWp là gì? Vì sao lắp 125 MW pin mà lưới chỉ nhận 100 MW/` | MWp và MWac: công suất nhãn so với ngoài trời | Đã duyệt bản cuối |
| `2026.10.27.nha_dieu_hanh_scada/` | Nhà điều hành và phòng SCADA của nhà máy điện gió, điện mặt trời | Bản nháp v2 chờ duyệt |
| `2026.10.27.nghen_luoi/` | Nghẽn lưới điện (grid congestion) tại Việt Nam | Đã duyệt bản cuối |
| `2026.10.27.p50_p90/` | P50, P90: vì sao một dự án có nhiều con số sản lượng | Đã duyệt bản cuối |
| `2026.10.27.Nhiệt độ ảnh hưởng đến pin mặt trời - tế bào 65 độ mất khoảng 12%/` | Tấm pin nóng thì phát ít điện; điện nổi mát hơn bao nhiêu | Đã duyệt bản cuối |
| `2026.10.27.proton_ben_trong_may/` | Bên trong máy proton Mevion S250-FIT | Bản cuối, Trung duyệt 28/10/2026 |
| `2026.10.27.proton_dinh_bragg/` | Vì sao proton dừng đúng chỗ | Bản nháp chờ duyệt |
| `2026.10.27.ton_that/` | Chuỗi tổn thất và hệ số hiệu suất PR | Đã duyệt bản cuối |

### Cảnh thử không thuộc video nào (2)

| Thư mục | Nội dung | Trạng thái |
|---|---|---|
| `2026.10.26.canh_thu_d11_buong_may/` | Cảnh thử D-11 "Phòng chụp & viền sáng" — buồng máy tua-bin gió | Bản nháp chờ duyệt |
| `2026.10.26.canh_thu_d11_lrv/` | Cảnh thử D-11 lần 2 — xe tự hành Mặt Trăng (LRV), mô hình chi tiết tải về | Bản nháp chờ duyệt |

### Tài liệu (7)

| Thư mục | Nội dung |
|---|---|
| `2026.10.25.huong_dan_lam_video_khoa_hoc_kieu_first_gear/` | Hướng dẫn làm video khoa học kiểu First Gear |
| `2026.10.26.bao_cao_trend/` | Báo cáo trend 26/10 (bản v3; v1, v2 trong phiên bản cũ) |
| `2026.10.26.bo_bien_the_d09b_mau_nhac/` | Bộ biến thể bảng màu và nhạc của tông dựng D-09b |
| `2026.10.26.chuoi_15_video_dien/` | Chuỗi 15 video điện: trang duyệt (ngoài cùng), kế hoạch và đề xuất chủ đề (tài nguyên) |
| `2026.10.26.de_xuat_skill_san_trend/` | Đề xuất skill săn trend, kèm ba file nguồn |
| `2026.10.26.phan_tich_quy_trinh_video_ai_tu_dong/` | Phân tích quy trình 3 video dựng bằng AI |
| `2026.10.26.video_mau_dung_bang_ai/` | Danh sách video mẫu dựng bằng AI (bản 2; bản 1 trong phiên bản cũ) |

## Bổ sung ngày 28/10/2026 (đối chiếu với ổ đĩa)

Đối chiếu `ls san_pham/` với mục lục thấy 65 thư mục mở từ 27/10 đến 28/10/2026 chưa có dòng. Trạng thái lấy từ file có trong thư mục (bản `_cuoi` có hay chưa), không phải từ việc Trung đã duyệt hay chưa; trạng thái duyệt xem sổ nợ `so_no_cong_viec.md` và `tai_san/nhat_ky_video_ngang.md`.

### Video điện (44)

| Thư mục | Video | Trạng thái |
|---|---|---|
| `2026.10.27.Trời râm pin mặt trời có hoạt động không? Ánh sáng tới tấm pin từ đâu/` | Nắng chiếu thẳng, nắng tán, nắng hắt: tấm pin hứng ánh sáng từ đâu? | Có bản cuối |
| `2026.10.27.canh_dong_gio/` | Một cánh đồng điện gió gồm những gì | Có bản cuối, có hình thu nhỏ |
| `2026.10.27.chon_tuabin_cong_suat/` | Tua-bin nhỏ hay lớn? Chọn cỡ máy theo gió, đường chở, cần cẩu và lưới | Có bản cuối, có hình thu nhỏ |
| `2026.10.27.dieu_do/` | Ai quyết định nhà máy nào được phát điện, phát lúc nào? | Có bản cuối |
| `2026.10.27.du_bao_san_luong/` | Một nhà máy điện phát bao nhiêu điện mỗi năm: dự báo chắc đến đâu? | Có bản cuối |
| `2026.10.27.Công suất tấm pin mặt trời ghi 600 W có thật sự đủ 600 W?/` | Tấm pin ghi 600 W có thật sự đủ 600 W? | Có bản cuối |
| `2026.10.27.Tấm pin xoay theo mặt trời có được nhiều điện hơn giá cố định không?/` | Tấm pin đứng yên hay xoay theo mặt trời: cách nào được nhiều điện hơn? | Có bản cuối, có hình thu nhỏ |
| `2026.10.27.gio_tren_bo_ngoai_khoi/` | Trên bờ, gần bờ, ngoài khơi: điện gió khác nhau ở đâu? | Có bản cuối |
| `2026.10.27.Hiệu suất tấm pin mặt trời - cùng 600 W thì tấm nào tốt hơn?/` | Cùng 600 W, tấm pin nào tốt hơn? | Có bản cuối |
| `2026.10.27.Điện mặt trời nổi được giữ trên mặt nước như thế nào?/` | Neo giữ nhà máy điện mặt trời nổi đứng yên trên mặt hồ ra sao? | Có bản cuối |
| `2026.10.27.Điện mặt trời nổi hay hỏng chỗ nào?/` | Dây neo nhà máy điện nổi có thể hỏng ở đâu, vì sao? | Có bản cuối |
| `2026.10.27.Thông số tấm pin mặt trời - những con số in sau lưng nghĩa là gì?/` | Những con số in sau lưng tấm pin mặt trời nghĩa là gì? | Có bản cuối |
| `2026.10.27.Phao điện mặt trời nổi - vì sao hàng nghìn tấm pin không chìm?/` | Nhà máy điện mặt trời nổi trên mặt hồ bằng cách nào? | Có bản cuối |
| `2026.10.27.1kWp điện mặt trời sản xuất bao nhiêu kWh mỗi năm?/` | Một tấm pin mặt trời làm ra bao nhiêu điện mỗi năm? | Có bản cuối |
| `2026.10.27.Tại sao tấm pin mặt trời phải chịu tải nặng hơn bạn nghĩ?/` | Tấm pin chịu được bao nhiêu sức đè và sức gió? | Có bản cuối |
| `2026.10.27.Tuổi thọ tấm pin mặt trời - sau 25 năm còn lại bao nhiêu công suất?/` | Tấm pin mặt trời già đi thế nào sau 25 năm? | Có bản cuối, có hình thu nhỏ |
| `2026.10.27.Kiểm định tấm pin năng lượng mặt trời - nóng lạnh, mưa đá, điện áp cao/` | Tấm pin bị thử thách những gì trước khi được bán? | Có bản cuối, có hình thu nhỏ |
| `2026.10.27.Điện áp tấm pin mặt trời có tăng khi trời lạnh không?/` | Trời càng lạnh, tấm pin càng cho điện áp cao | Có bản cuối |
| `2026.10.28.ba_moc_toc_do_gio/` | Ba mốc tốc độ gió: vì sao máy khởi động, đạt định mức và ngắt | Có bản cuối |
| `2026.10.28.bau_canh_hub/` | Bên trong bầu cánh tua-bin gió: giữ cánh mà vẫn cho cánh xoay | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.Những nguyên nhân nào làm suy giảm chất lượng tấm pin mặt trời/` | Bốn kiểu tấm pin yếu dần theo thời gian | Có bản cuối |
| `2026.10.28.chi_phi_dau_tu_gio/` | Tiền xây một dự án điện gió trên bờ đi đâu | Có bản cuối |
| `2026.10.28.chi_phi_van_hanh_gio/` | Mỗi năm, tiền vận hành một dự án điện gió đi vào đâu? | Có bản cuối |
| `2026.10.28.Quy hoạch điện 8 điều chỉnh - cơ cấu nguồn điện năm 2030 và 2050/` | Đến năm 2030 và 2050, điện của Việt Nam sẽ đến từ những nguồn nào theo quy hoạch? | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.Cơ cấu nguồn điện Việt Nam hiện nay - điện nhà bạn đến từ đâu?/` | Điện nhà bạn dùng đến từ nguồn nào? Than, thủy điện hay mặt trời? | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.cong_suat_rieng/` | Công suất riêng W/m² của tua-bin gió là gì? | Có bản cuối |
| `2026.10.28.cot_do_gio_lidar/` | Cột đo gió và LiDAR đo gió thế nào | Có bản cuối |
| `2026.10.28.Tiềm năng và thực tế lắp đặt điện mặt trời mái nhà tại Việt Nam/` | Điện mặt trời mái nhà: tiềm năng, đã lắp, mục tiêu | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.gio_do_cao_sau/` | Gió theo độ cao ngày và đêm, và tải lên cánh | Có bản cuối |
| `2026.10.28.Gió mùa ở Việt Nam - vì sao mỗi mùa một hướng, từ gió bấc tới gió Lào/` | Gió mùa, hướng gió và tốc độ gió ở Việt Nam | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.Số giờ nắng ở Việt Nam - vùng nào nắng nhiều nhất để làm điện mặt trời?/` | Giờ nắng và cường độ nắng ở các vùng Việt Nam | Có bản cuối |
| `2026.10.28.Hệ thống điện quốc gia hoạt động như thế nào - năm chặng tới ổ cắm/` | Điện từ nhà máy đến ổ cắm nhà bạn đi qua những chặng nào? | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.Tuabin điện gió hỏng như thế nào - sáu cơ chế hao mòn từ cánh tới tháp/` | Tua-bin gió hao mòn và hỏng theo những cách nào? | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.Hệ thống điện mặt trời mái nhà gồm những gì? Từ tấm pin tới công tơ/` | Hệ thống điện mặt trời mái nhà gồm những gì | Có bản cuối |
| `2026.10.28.Lắp điện mặt trời mái nhà - rủi ro không nằm ở tấm pin/` | Lưu ý khi làm điện mặt trời mái nhà | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.phan_bo_toc_do_gio/` | Vì sao tốc độ gió trung bình cao chưa chắc ra nhiều điện | Có bản cuối |
| `2026.10.28.Phụ tải điện là gì? Ai dùng điện nhiều nhất ở Việt Nam/` | Phụ tải điện là gì, phân bổ thế nào ở Việt Nam | Có bản cuối |
| `2026.10.28.4 công nghệ pin mặt trời phổ biến nhất hiện nay/` | Bốn thế hệ tế bào pin mặt trời khác nhau ở đâu? | Có bản cuối |
| `2026.10.28.Lắp điện mặt trời mái nhà - quy trình từ khảo sát tới nghiệm thu/` | Trình tự thi công điện mặt trời mái nhà | Có bản cuối |
| `2026.10.28.thi_cong_gio_gan_bo/` | Thi công điện gió gần bờ | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.thi_cong_gio_ngoai_khoi/` | Thi công điện gió ngoài khơi | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.thi_cong_gio_tren_bo/` | Thi công điện gió trên núi | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.tuoi_tho_kha_dung/` | Tua-bin gió thiết kế 20 năm có nghĩa là gì, và "khả dụng 97%" là gì? | Có bản cuối, có hình thu nhỏ |
| `2026.10.28.xoay_huong_goc_canh/` | Tua-bin gió xoay hướng và xoay góc cánh | Có bản cuối, có hình thu nhỏ |

### Video thuật ngữ ngân hàng (12)

| Thư mục | Video | Trạng thái |
|---|---|---|
| `2026.10.28.Chứng chỉ tiền gửi là gì? Khác gì sổ tiết kiệm, hợp đồng tiền gửi/` | Chứng chỉ tiền gửi khác gì hợp đồng tiền gửi và sổ tiết kiệm | Mới có kịch bản, chưa dựng |
| `2026.10.28.CIC - Trung tâm Thông tin tín dụng là gì? Nợ xấu có bị cấm vay?/` | Dính nợ xấu CIC là bị cấm vay? Câu này chỉ đúng một nửa | Mới có kịch bản, chưa dựng |
| `2026.10.28.Phân biệt hạn mức quay vòng và hạn mức không quay vòng/` | Hạn mức quay vòng và hạn mức không quay vòng | Mới có kịch bản, chưa dựng |
| `2026.10.28.Hạn mức tín dụng là gì? Có hạn mức chưa chắc rút được tiền/` | Hạn mức tín dụng là gì? | Mới có kịch bản, chưa dựng |
| `2026.10.28.Tại sao tiền gửi 13 tháng lại khác biệt nhiều so với gửi 12 tháng/` | Vì sao lãi gửi tiền 13 tháng cao hơn 12 tháng | Mới có kịch bản, chưa dựng |
| `2026.10.28.Nhóm nợ là gì, phân biệt nợ nhóm 1, nợ nhóm 2 ... nợ xấu/` | Nợ nhóm 2 là gì? Vì sao trễ hạn 5 triệu làm khó cả khoản vay tỷ đồng? | Mới có kịch bản, chưa dựng |
| `2026.10.28.Tài sản bảo đảm là gì? Điều cần hỏi rõ khi vay ngân hàng/` | Tài sản bảo đảm là gì? Cần lưu ý gì khi trao đổi với ngân hàng? | Mới có kịch bản, chưa dựng |
| `2026.10.28.Phân biệt giữa cầm cố và thế chấp - không phải ai cũng biết/` | Thế chấp và cầm cố | Mới có tóm tắt và chia chương, chưa viết kịch bản |
| `2026.10.28.CASA - Tiền gửi không kỳ hạn khác tiền gửi có kỳ hạn thế nào?/` | Tiền gửi có kỳ hạn và CASA khác nhau thế nào | Mới có kịch bản, chưa dựng |
| `2026.10.28.Vay tín chấp là gì? Không có tài sản thì tốn bao nhiêu/` | Vay tín chấp | Mới có tóm tắt và chia chương, chưa viết kịch bản |
| `2026.10.28.Trích lập dự phòng là gì? Ngân hàng phải để riêng bao nhiêu tiền/` | Trích lập dự phòng rủi ro là gì | Mới có kịch bản, chưa dựng |
| `2026.10.28.Vay ngắn hạn và dài hạn khác nhau thế nào? Không chỉ ở số năm/` | Cho vay ngắn hạn và cho vay dài hạn: khác nhau ở đâu | Mới có kịch bản, chưa dựng |

### Tài liệu, trang duyệt, kế hoạch lô (9)

| Thư mục | Nội dung |
|---|---|
| `2026.10.27.chon_giong_vieneu/` | Trang chọn giọng VieNeu (HTML) |
| `2026.10.27.danh_muc_video/` | Trang danh mục video (HTML) |
| `2026.10.27.de_xuat_skill_viet_chu_dang_video/` | Đề xuất skill viết chữ đăng video (HTML và Markdown) |
| `2026.10.27.duyet_phong_cach_opus55/` | Trang duyệt phong cách Opus 5.5 và trang so sánh lịch sử AI (HTML) |
| `2026.10.27.lo_video_dien_chung_va_mat_troi/` | Kế hoạch lô 18 video kiến thức chung về điện và điện mặt trời, sổ theo dõi lô |
| `2026.10.27.lo_video_dien_gio/` | Kế hoạch lô 16 video điện gió, sổ theo dõi lô, bảng nguồn tài liệu quốc tế |
| `2026.10.27.mau_hinh_thu_nho/` | Mẫu hình thu nhỏ: trang so sánh v3 và thư mục `mau_v3/` |
| `2026.10.28.bao_cao_trend/` | Báo cáo trend 28/10 (bản v3, HTML) |
| `2026.10.28.loat_thuat_ngu_ngan_hang/` | Kế hoạch loạt video thuật ngữ ngân hàng |

## Nguồn cũ

Nguồn Claude: `/Users/macbooktrungnt/Documents/Claude/Projects/`
Phiếu: `/Users/macbooktrungnt/Documents/Grok/2026.08.18.phieu_kho_nang_v1.md`
