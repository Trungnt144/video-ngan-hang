# Cấu trúc các file Claude viết trong một lượt săn trend

Script `ve_trang.py` đọc các file dưới đây (cùng tiền tố lượt, ví dụ `du_lieu/trend/2026-10-27/0930_`). File nào chưa có thì trang HTML ghi "chưa chạy" ở phần đó, không lỗi. Mọi số liệu chép đúng như trang hiện, không làm tròn lại, không bịa: ô không đọc được thì bỏ trống hoặc ghi `null`.

`trang_thai` dùng một trong bốn giá trị: `doc_duoc`, `chua_dang_nhap`, `dung_xac_minh` (gặp xác minh, CAPTCHA, cảnh báo dùng quá nhanh), `bo_qua` (Chrome không kết nối, hoặc Trung bảo bỏ).

## `<tien_to>_keyword_planner.json`

```json
{
  "thoi_diem": "2026-10-27 09:40",
  "trang_thai": "doc_duoc",
  "ghi_chu": "Vị trí Việt Nam, tất cả ngôn ngữ, 12 tháng gần nhất",
  "tu_khoa": [
    {"chu_de": "inverter", "tu_khoa": "inverter là gì", "luot_tim_thang": "1 N – 10 N",
     "doi_3_thang": "0%", "doi_cung_ky": "0%", "canh_tranh": "Thấp"}
  ]
}
```

`chu_de` là tên chủ đề đúng như trong danh sách; một chủ đề có thể có nhiều dòng `tu_khoa` (ví dụ "inverter", "inverter là gì").

## `<tien_to>_tiktok.json`

```json
{
  "thoi_diem": "2026-10-27 09:45",
  "trang_thai": "doc_duoc",
  "ghi_chu": "",
  "hashtag": [{"hang": 1, "hashtag": "#danhthucbanlinh", "nganh": null, "bai_dang": "199.8K", "luot_xem": "217.6M"}],
  "video": [{"hang": 1, "tai_khoan": "Tài Chelsea", "nganh": "Technology & Finance",
             "nguoi_theo_doi": "224.7K", "luot_xem": "18.1M"}],
  "chu_de": [{"chu_de": "điện mặt trời", "hashtag": "#dienmattroi", "bai_dang": "12K", "luot_xem": "45M",
              "ghi_chu": "7 ngày, Việt Nam"}]
}
```

## `<tien_to>_facebook.json`

```json
{
  "thoi_diem": "2026-10-27 09:50",
  "trang_thai": "doc_duoc",
  "ghi_chu": "",
  "bai": [{"tu_khoa": "điện mặt trời", "trang": "Thông tin Chính phủ", "ngay": "23/10",
           "noi_dung": "Các địa phương khẩn trương ban hành chính sách hỗ trợ ...",
           "cam_xuc": "39,6K", "cam_xuc_so": 39600, "binh_luan_chia_se": "2,5K"}]
}
```

`tu_khoa` là từ đã tìm (chủ đề Trung quy định, hoặc từ trong `facebook_tim`). `cam_xuc_so` là số để xếp thứ tự (39,6K → 39600).

## `<tien_to>_facebook_hub.json` (bước 2d, thêm 29/10/2026)

```json
{
  "thoi_diem": "2026-10-29 09:00",
  "trang_thai": "doc_duoc",
  "trang": "Chuyện nghề Điện",
  "danh_muc": "<danh mục Trang Inspiration Hub hiển thị>",
  "url": "<đường dẫn thật của trang Inspiration Hub>",
  "ghi_chu": "",
  "hashtag": [{"hashtag": "#dienmattroi", "ghi_chu": "<số liệu nếu trang có>"}],
  "reels": [{"trang": "<Trang đăng>", "noi_dung": "<câu đầu>", "luot_xem": "12K"}],
  "am_thanh": [{"ten": "<tên bài>", "ghi_chu": ""}]
}
```

`trang_thai`: `doc_duoc`, `can_trung_chuyen` (Facebook đang ở tài khoản cá nhân, Claude không tự chuyển sang Trang), `chi_co_nhac` (chỉ có âm thanh gợi ý), `dung_xac_minh`, `bo_qua`. Hashtag vào sổ trend ở nền tảng Facebook.

## `<tien_to>_reputa.json` (bước 2e, thêm 29/10/2026)

```json
{
  "thoi_diem": "2026-10-29 09:10",
  "trang_thai": "doc_duoc",
  "ky": "04/2026",
  "url": "https://www.brandsvietnam.com/<bài>",
  "ngay_dang": "<dd/mm/yyyy>",
  "tong_de_cap": 170374,
  "ghi_chu": "",
  "chu_de": [{"chu_de": "lãi suất tiết kiệm", "de_cap": 20000, "ghi_chu": ""}],
  "ngan_hang": [{"ten": "<tên ngân hàng>", "de_cap": 30000}]
}
```

`trang_thai`: `doc_duoc`, `khong_co_ban_moi` (bản mới nhất cũ hơn 6 tháng), `bo_qua` (lượt không có khung tháng hoặc quý, hoặc chủ đề ngoài ngân hàng, tài chính, bảo hiểm). `ky` là tháng của số liệu, không phải ngày đọc. Chủ đề vào sổ trend ở khung tháng, nguồn `reputa`; điểm độ nóng chưa tính `de_cap`.

## `<tien_to>_phan_tich.json`

```json
{
  "ket_luan": "Đoạn 1 ...\n\nĐoạn 2 ...",
  "y_tuong": [
    {"ten": "Inverter là gì", "chu_de": "inverter", "loai": "câu hỏi bền",
     "nen_tang": ["google", "youtube"], "so_lieu": "1.000–10.000 lượt tìm/tháng",
     "nguoi_nhanh": false, "bang_chung": "...", "goc": "...", "cau_mo_dau": "...", "rui_ro": "..."}
  ],
  "da_loai": "Một đoạn: bao nhiêu mục giải trí, thể thao bị loại, ví dụ, mục khớp nhầm."
}
```

`loai`: `câu hỏi bền`, `tin nóng` hoặc `giải trí`. `nen_tang`: các giá trị `google`, `youtube`, `tiktok`, `facebook`. `chu_de`: tên chủ đề nếu ý tưởng sinh từ một chủ đề Trung quy định, bỏ trống nếu không.

## Bản ghi sổ thói quen (`so_thoi_quen.py ghi --json '...'`)

```json
{
  "tien_to": "du_lieu/trend/2026-10-27/0930",
  "che_do": "tap_trung",
  "chu_de_go": ["pin natri"],
  "chu_de_co_dinh": ["inverter", "điện hạt nhân"],
  "y_tuong": [
    {"ten": "Pin natri là gì", "chu_de": "pin natri", "loai": "câu hỏi bền",
     "nen_tang": ["google", "tiktok"], "giu": true}
  ],
  "ghi_chu": "Trung hỏi thêm về giá pin"
}
```

`y_tuong` liệt kê mọi ý tưởng đã trình, `giu` là `true` nếu Trung chọn giữ, `false` nếu không chọn. `chu_de_go` là chủ đề Trung gõ khi gọi lượt này.

## Bản 3.0 (28/10/2026)

### Trường thêm vào các file Chrome

- `<tien_to>_keyword_planner.json`: dòng của từ ngách (bước 2a mục 4 của SKILL.md) ghi thêm `"loai": "ngach"`.
- `<tien_to>_tiktok.json`: mỗi dòng `hashtag` và `chu_de` ghi thêm `"ky": "7"`, `"30"` hoặc `"90"` (số ngày của bảng đã đọc). Thiếu trường này thì sổ trend coi là 7 ngày.

### `<tien_to>_antigravity.json`

Do `so_trend.py antigravity` sinh từ `ket_qua.json` và `kiem_tra_claude.json` của project TraCuu; Claude chỉ điền tay `tu_khoa` còn thiếu và đổi `kiem` sau khi tự đối chiếu.

```json
{
  "thoi_diem": "2026-10-28T10:20:00+07:00",
  "trang_thai": "doc_duoc",
  "ma_phieu": "20261028_093000_ncuu",
  "ghi_chu": "",
  "muc": [{"id": "K1", "tu_khoa": "ưu nhược điểm điện gió", "chu_de": "điện gió", "nen_tang": ["google", "youtube"],
           "khung": "quy", "mo_ta": "…", "kiem": "dat",
           "trich_dan": [{"url": "https://…", "nguyen_van": "…"}]}]
}
```

`trang_thai`: `doc_duoc`, `bo_qua` (app Antigravity không mở được), `het_gio` (quá 40 phút chưa có kết quả). `kiem`: `dat`, `dat_ban_luu`, `can_kiem_tay`, `da_kiem_tay`, `khong_dat`; sổ trend chỉ lấy `dat`, `dat_ban_luu`, `da_kiem_tay`.

### `<tien_to>_bao_cao_html.txt`

Một dòng: đường dẫn trang HTML của lượt, tính từ gốc Media. `ve_trang.py` tự ghi.

### `du_lieu/trend/so_trend.json` (sổ trend, `so_trend.py dung` sinh, ngoài git)

```json
{
  "cap_nhat_luc": "2026-10-28 09:30", "so_luot": 4,
  "luot": [{"tien_to": "du_lieu/trend/2026-10-28/0930", "thoi_diem": "…", "che_do": "tap_trung", "chu_de": ["điện gió"],
            "khung": ["tuan", "thang", "quy"], "nguon_dat": "5/5", "chrome": {"keyword_planner": "doc_duoc"},
            "antigravity": "doc_duoc", "co_phan_tich": true, "bao_cao_html": "san_pham/…/….html"}],
  "y_tuong": [{"ten": "…", "tien_to": "…", "thoi_diem": "…"}],
  "dong": [{"khoa": "ưu nhược điểm của điện gió", "hien_thi": "ưu nhược điểm của điện gió", "nhom": "chu_de",
            "loai": "câu hỏi bền", "chu_de_me": ["điện gió"], "nen_tang": ["google", "youtube"],
            "nguon": ["script", "chrome"],
            "khung": {"quy": {"gt_tang": "+650%", "gt_tang_so": 650, "gt_top": null, "yt_luot_xem": 91859}},
            "chi_so": {"kp_luot_tim": "1 N – 10 N", "kp_luot_so": 1000, "kp_doi_3_thang": "+900%", "ngach_so_lan": 3},
            "bang_chung": ["Google Trends 90 ngày: +650%"], "trich_dan": [],
            "lan_gap": 1, "lan_dau": "…", "lan_cuoi": "…", "lich_su": [["…", 48]],
            "diem_nong": 48, "thanh_phan": {"tang": 0.66, "quy_mo": 0.5, "lan_toa": 0.5, "lap_lai": 0.0}}]
}
```

`nhom`: `chu_de` (sinh từ chủ đề Trung chọn), `linh_vuc` (khớp lĩnh vực kênh), `dai_chung` (còn lại; không thành ý tưởng). `y_tuong` lấy từ lượt có `phan_tich.json` gần nhất. Trong `khung`: `gt_tang` là % tăng của truy vấn Google Trends, `gt_ti_le` là tỉ lệ mức quan tâm cuối kỳ / đầu kỳ của chính từ khoá, `gt_top` là mức quan tâm 0–100 trong danh sách truy vấn hàng đầu, `yt_luot_xem`, `tt_luot_xem` là lượt xem lớn nhất trong khung.

### `du_lieu/bang_video/trend_nhap.json` (Trung nhập trên thẻ Trend, trong git)

```json
{"ưu nhược điểm của điện gió": {"hien_thi": "ưu nhược điểm của điện gió", "trang_thai": "theo_doi",
  "ghi_chu": "Góc so sánh chi phí với điện mặt trời", "video": "2026.10.28.chi_phi_dau_tu_gio", "sua_luc": "2026-10-28T03:00:00Z"}}
```

Khoá là `khoa` của sổ trend. `trang_thai`: `moi`, `theo_doi`, `lam_video`, `bo`. Dòng trở về `moi`, ghi chú trống, chưa gắn video thì máy chủ xoá khỏi file. Chỉ máy chủ bảng video ghi file này; skill chỉ đọc.
