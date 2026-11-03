# xuong_html — dựng video bằng một trang HTML (cách làm LM-03)

**Phiên bản:** 1.0 · **Ngày:** 2026-10-27

Mỗi video là một file `trang.html` (SVG, CSS, Canvas, GSAP, Three.js) có cảnh 1920×1080. Mọi giá trị trên màn hình là hàm của thời gian `t`, và hàm `seek(t)` đặt cả trang về đúng giây `t`. Công cụ `cong_cu/xuat_mp4.mjs` mở trang trong Chromium, thay đồng hồ của trang bằng đồng hồ do công cụ điều khiển, chụp từng khung và mã hoá MP4 bằng FFmpeg. Kết quả không phụ thuộc máy chạy nhanh hay chậm. Quy trình đầy đủ (chọn trục, viết trang bằng Opus, xem trước, sửa, phản biện, xuất, ghép tiếng) nằm trong skill `dung-video-html` (`skills/dung-video-html/SKILL.md`).

## Cài một lần

```bash
export PATH="$HOME/.local/bin:$PATH"
cd xuong_html/cong_cu && npm install
```

Chỉ cài `playwright-core@1.62.0` (ghim đúng bản khớp với Chromium 1234 đã có trong `~/Library/Caches/ms-playwright/`; không tải thêm trình duyệt). Bản `playwright-core` mới hơn đòi Chromium khác và không chạy được. FFmpeg dùng bản của `xuong_thu_hyperframes/bin/ffmpeg` (công cụ tự tìm theo vị trí của chính nó; đặt biến `FFMPEG` để đổi).

## Cấu trúc

```
xuong_html/
├── README.md
├── cong_cu/                      công cụ dùng chung cho mọi video
└── <yyyy.mm.dd_ten>/             mỗi video một thư mục (ví dụ 2026.10.27_thu_ky_thuat/)
    ├── trang.html                trang dựng video (vào git)
    ├── nhip.json                 bản đồ nhịp: mốc giây, nội dung hiện, chuyển động, ảnh tĩnh cần kiểm (vào git)
    ├── SO_VONG_SUA.md            sổ vòng sửa: lỗi tìm thấy, đã sửa, bảng kiểm cuối (vào git)
    ├── xem_truoc/                bản xem trước và khung cắt, sinh lại được (ngoài git)
    └── ra/                       bản xuất thử (MP4 ngoài git)
```

Thành phẩm cuối không để ở đây. Chép MP4 cuối sang `san_pham/yyyy.mm.dd.<chu_de>/` theo quy ước của `san_pham/README.md` (tên `yyyy.mm.dd.<ten>_v<n>_cuoi.mp4`), và viết `tai_nguyen/nguon_goc.md` ghi trang nằm ở `xuong_html/<yyyy.mm.dd_ten>/trang.html` cùng lệnh dựng lại.

Git: `.gitignore` đã loại `xuong_html/**/node_modules/`, `xuong_html/**/*.mp4`, `xuong_html/**/xem_truoc/`. Vào git: công cụ, `trang.html`, `nhip.json`, `SO_VONG_SUA.md`, `KET_QUA_DO.md`.

## Công cụ trong `cong_cu/`

| File | Việc làm |
|---|---|
| `xuat_mp4.mjs` | Chụp từng khung theo đồng hồ ảo, ra MP4 H.264. Dùng cho cả bản xem trước (960×540, 10 khung/giây) lẫn bản cuối (30 khung/giây). `--help` in mọi tuỳ chọn |
| `xuat_nhoe.sh` | Bản cuối 60 khung/giây có nhoè chuyển động: chụp 480 khung/giây rồi trộn 4 trong 8 khung phụ cho mỗi khung ra. Chậm hơn bản thường khoảng 8–9 lần |
| `cat_khung_xem.sh` | Cắt N khung đều từ MP4 thành ảnh lẻ cỡ gốc và 1–2 ảnh lưới (3 cột, mỗi ô có nhãn giây) để Claude xem bằng một lần Read |
| `ghep_am_thanh.sh` | Ghép MP4 hình với giọng (WAV, MP3, AIFF) và nhạc nền: nhạc tự nhỏ đi dưới giọng, chuẩn −14 LUFS, cắt hoặc lặp nhạc vừa video, mờ dần 2 giây cuối, kiểm file ra |
| `quay_thoi_gian_thuc.mjs` | Quay màn hình theo giờ thật bằng `recordVideo` của Playwright. Chỉ 25 khung/giây, chất lượng thấp; không dùng cho thành phẩm |
| `thu_canvas.html`, `thu_gsap_svg.html` | Hai trang thử dùng để đo công cụ |
| `KET_QUA_DO.md` | Số đo thời gian máy, dung lượng, độ chính xác, giới hạn, lỗi đã gặp |

## Lệnh mẫu

Chạy trong thư mục của video (ví dụ `xuong_html/2026.10.27_thu_ky_thuat/`):

```bash
export PATH="$HOME/.local/bin:$PATH"
C=../cong_cu

# 1. Xem trước: 6 giây, 10 khung/giây, 960x540 (khoảng 0,3 giây máy mỗi giây video)
node $C/xuat_mp4.mjs trang.html 6 --fps 10 --kich-thuoc 960x540 --ra xem_truoc/v1.mp4 --chi-tiet

# 2. Cắt 12 khung đều, ghép một ảnh lưới: xem_truoc/v1/v1_luoi_1.jpg (24 khung thì ra 2 lưới)
bash $C/cat_khung_xem.sh xem_truoc/v1.mp4 xem_truoc/v1 12
bash $C/cat_khung_xem.sh xem_truoc/v1.mp4 xem_truoc/v1 --moc 3.2,3.28,4.5 --cot 2   # chỉ các giây cần soi

# 3a. Bản cuối thường: 30 khung/giây, 1920x1080 (khoảng 1,2–1,5 giây máy mỗi giây video)
node $C/xuat_mp4.mjs trang.html 6 --fps 30 --ra ra/cuoi_30.mp4
# 3b. Bản cuối 60 khung/giây có nhoè (khoảng 11–23 giây máy mỗi giây video, xem KET_QUA_DO.md mục 8)
sh $C/xuat_nhoe.sh trang.html 6 ra/cuoi_60.mp4

# 4. Ghép tiếng
bash $C/ghep_am_thanh.sh ra/cuoi_60.mp4 ra/cuoi_60_co_tieng.mp4 --giong giong.wav --giong-tre 0.5 --nhac ../../tai_san/nhac_nen/mixkit-close-up-1167.mp3
```

## Trang HTML phải thế nào để xuất đúng

Quy tắc ngắn: mọi giá trị là hàm của `t`; có `seek(t)`; không dùng `<video>`, Worker, đồng hồ thật; mọi phần tử vào cảnh phải ẩn từ đầu; phông nạp ngay đầu trang. Danh sách đầy đủ và khung mẫu: `skills/dung-video-html/tham_chieu/hop_dong_trang.md`. Trang sống làm mẫu: `2026.10.27_thu_ky_thuat/trang.html`.

## Giới hạn

Xem `cong_cu/KET_QUA_DO.md` mục 5. Tóm tắt: không điều khiển `<video>`, âm thanh, Web Worker; WebGL nặng chạy chậm vì Chromium không đầu dùng bộ dựng hình mềm; thư viện và phông từ mạng cần có internet lúc xuất; xuất song song nhiều trang chỉ nhanh hơn khoảng 20 % và đòi gấp đôi RAM.
