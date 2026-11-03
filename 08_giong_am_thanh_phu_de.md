# 08 — Giọng đọc, âm thanh và phụ đề

> Đọc trước mọi việc liên quan tới lồng tiếng, nhạc nền, đo âm thanh và phụ đề chạy chữ theo nhịp giọng.
> **Phiên bản:** 5.4 · **Cập nhật:** 2026-10-30 · Mục 0c: Trung chốt giảm tốc độ nói 15% cho video mới, `toc_do_dich_am_tiet_giay` từ 5,95 xuống 5,06. Video đã có giọng đủ các chương và đã tạo mốc thời gian giữ nguyên tốc độ cũ; đọc lại chương của video đó phải truyền `--he-so-keo` của chương cũ.
> **Phiên bản:** 5.3 · **Cập nhật:** 2026-10-28 · Gom bài học lô 18 video điện chung và điện mặt trời (Trung duyệt gom 28/10/2026): `TOC_DO = 1.0` cho giọng sinh từ 27/10 (mục 0c), chèn chương giữa file `.chuong.json` (mục 0c), danh sách từ Whisper hay nghe nhầm (mục 0), phát hiện máy đọc nuốt chữ bằng độ dài từ và sửa phụ đề trong `moc_tu.json` (mục 5), tốc độ thực 23,5 ký tự mỗi giây (mục 6), nhạc có cả `playbackRate` và `trimBefore` (mục 7).
> **Phiên bản:** 5.2 · **Cập nhật:** 2026-10-28 · Thêm mục 5b: quy tắc phụ đề hai dòng và thành phần `PhuDeChayChu.tsx` bản đúng (lô 16 video điện gió, Trung duyệt gom 28/10/2026).
> **Phiên bản:** 5.1 · **Cập nhật:** 2026-10-27 · Gộp nhánh dựng lại luồng với hai thay đổi của nhánh chính cùng ngày: mục 0c (mọi giọng VieNeu kéo giãn về tốc độ đích 5,95 âm tiết mỗi giây, 10 giọng bổ sung) và mục 0b (bỏ giọng "Trung"). Câu giới hạn 1 ở mục giọng VieNeu lấy theo mục 0c.
> **Phiên bản:** 5.0 · **Cập nhật:** 2026-10-27 · Áp quyết định Trung ngày 27/10/2026: (1) bỏ ElevenLabs, chỉ dùng VieNeu (mục 1; hướng dẫn cũ nằm ở `_luu_tru/elevenlabs_da_bo_2026.10.27/huong_dan_cu.md`; mục 2 và 3 cũ bỏ, mục 5 và 6 viết lại cho VieNeu); (2) nhạc ngắn hơn video: một thứ tự duy nhất ở mục 7; (3) ghi ngưỡng lọc nhạc của script ở mục 7. Thêm mục 9 "Đo âm thanh bằng số".
> **Phiên bản:** 4.2 · **Cập nhật:** 2026-10-27 · Mục 0b: Trung nghe giọng "Trung" và "Trung ban 1" ở tốc độ 5,95 rồi bỏ cả hai khỏi VieNeu; file giọng riêng không còn giọng nào, bản thu gốc và bản nhân bản chuyển vào Thùng rác.
> **v4.1** 2026-10-27 · Mục 0c mới: mọi giọng VieNeu được kéo giãn về tốc độ đích 5,95 âm tiết mỗi giây (Hải Đăng × 1,2) cho mọi video mới; 10 giọng bổ sung Trung chọn qua trang nghe thử, Hải Đăng vẫn mặc định.
> **v3.9** 2026-10-27 · Mục 7 viết lại: kho nhạc nền 78 bài có sổ phân loại theo độ dài, tiết tấu, tính chất (`tai_san/nhac_nen/so_nhac.md`), cách chọn nhạc theo sổ; việc 1 ở mục 8 xong.

## 0. Giọng duy nhất của cả xưởng (video dài và video ngắn): VieNeu-TTS, giọng Hải Đăng (từ 25/10/2026; chỉ dùng VieNeu từ 27/10/2026)

Ngày 25/10/2026 phiên META thử VieNeu-TTS v3 Turbo, Trung nghe mẫu ba giọng và chọn **Hải Đăng** cho video dài (giai đoạn 3). Cuối ngày 25/10/2026 Trung chốt thêm: **Hải Đăng là giọng mặc định cho cả video ngắn** (giai đoạn 1). **Ngày 27/10/2026 Trung bỏ ElevenLabs: chỉ dùng VieNeu** (mục 1). VieNeu không trả mốc từng ký tự hay từng từ, nên phụ đề chạy chữ theo từng từ dùng mốc từng từ do Whisper nghe lại (mục 5).

| Hạng mục | Giá trị |
|---|---|
| Công cụ | VieNeu-TTS v3 Turbo, gói Python `vieneu` 3.8.3, chạy trên máy Mac, miễn phí, không cần khoá, không gửi lời đọc ra ngoài |
| Giấy phép | Mô hình và bộ mã hoá âm thanh MOSS đều Apache 2.0; giọng có sẵn dùng được trong nội dung kiếm tiền |
| Giọng | **Hải Đăng** (giọng mặc định của VieNeu). 10 giọng bổ sung chỉ dùng khi Trung gọi tên: mục 0c. Mẫu nghe: `tai_san/giong_doc/mau_vieneu_2026.10.25/`, `tai_san/giong_doc/mau_vieneu_2026.10.27/` (25 giọng, tốc độ gốc) |
| Cấm | Nhân bản giọng người thật khi chưa được phép (trang mô hình VieNeu cấm). Xuân Lượng là giọng người thật, không có trong VieNeu, **không nhân bản** |
| Lệnh chạy | `scripts/sinh_giong_vieneu.py` |
| Cấu hình | Khối `vieneu` trong `tai_san/cau_hinh_giong.json`: giọng, khoảng nghỉ giữa câu (0,25 giây), ngưỡng sai (10% ký tự), số lần đọc tối đa (3), bảng chuẩn hoá thuật ngữ cho máy nghe lại. Đổi giọng thì sửa file đó, không sửa script |
| Môi trường | `.venv_vieneu/` ở gốc project, Python 3.11, ngoài git |

**Cài lại môi trường (máy mới hoặc lỡ xoá).** Máy không có `uv` trên đường dẫn mặc định, dùng bản của Hermes. Phải ghim `onnxruntime==1.22.1`, bản mới hơn báo lỗi khi nạp mô hình (xem `90_bai_hoc.md` 25/10/2026):

```bash
cd ~/Documents/VideoNganHang && ~/.hermes/bin/uv venv --python 3.11 .venv_vieneu && ~/.hermes/bin/uv pip install --python .venv_vieneu/bin/python "vieneu==3.8.3" "onnxruntime==1.22.1" mlx-whisper soxr jiwer soundfile
```

Lần chạy đầu tải mô hình VieNeu và mô hình nghe `mlx-community/whisper-large-v3-turbo` về bộ nhớ đệm Hugging Face; máy này đã có sẵn cả hai.

**Chạy:**

```bash
cd ~/Documents/VideoNganHang && .venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban san_pham/<thư mục video>/tai_nguyen/kich_ban/<ten>.chuong.json --ra xuong_dai/<ten>/public/giong_3d
```

Thêm `--chuong 3,5` để đọc lại riêng vài chương, `--giong "Phạm Tuyên"` để thử giọng khác cho riêng lần chạy. File kịch bản là mảng chương, mỗi chương có `id` và `doc` (lời đọc phiên âm, xem mục 4). Mỗi chương ra ba file:

| File | Nội dung |
|---|---|
| `c<id>.wav` | Tiếng, 48 kHz một kênh |
| `c<id>.moc_cau.json` | Lời đọc cả chương, thời lượng, mốc đầu và cuối từng câu (giây) |
| `c<id>.thongtin_vieneu.json` | Giọng, phiên bản gói, và với từng câu: bản Whisper nghe được, tỉ lệ sai ký tự, số lần đọc |
| `moc_tu.json` (một file cho cả video) | Mốc đầu, cuối từng từ của phụ đề (giây trong `c<id>.wav`): thời gian từ Whisper nghe lại, chữ đúng chính tả lấy từ trường `text` của kịch bản. Chỉ có khi chương có `text` cùng số câu với `doc`. Giọng đã đọc từ trước thì bổ sung bằng `scripts/moc_tung_tu.py` (từ 26/10/2026) |

**Cách script kiểm giọng.** Đọc từng câu riêng (đọc cả chương một lượt từng làm giọng Minh Đức bỏ mất nguyên một vế câu). Mỗi câu cho Whisper nghe lại, chuẩn hoá cả hai bên (thuật ngữ Whisper viết kiểu quốc tế như silicon, electron, N, P quy về xi-li-côn, ê-léc-trôn, en, pê; chữ số đổi thành chữ), tính tỉ lệ sai ký tự. Sai quá 10% thì đọc lại, tối đa 3 lần, giữ bản sai ít nhất. Câu vẫn sai sau 3 lần thì script in ra; **đưa Trung nghe đúng câu đó**, không tự kết luận, vì Whisper hay nghe nhầm phụ âm giọng Bắc ("trục" thành "chụp", "dây" thành "giấy", "dư" thành "giữ"). Lô 18 video ghi thêm các từ Whisper hay nghe nhầm dù giọng đọc đúng: choán, chuộng, mạ, nâng, lõi, dải (lô 18 video, N33): câu báo sai mà chỉ lệch ở những từ này thì nghe riêng câu đó trước khi cho đọc lại. Cặp chuẩn hoá mới cho Whisper (công-te-nơ, ki-ốt, tua-bin, ki-lô-gam, hát đê pê e; các chữ GHI, DNI, DHI, POA; Voc, Isc, Vmp, Imp, Pmax) đã thêm vào khối `vieneu` của `tai_san/cau_hinh_giong.json`; riêng "ghi" của GHI không chuẩn hoá được vì trùng từ tiếng Việt "ghi", nên nếu Whisper viết đúng "ghi" cho GHI thì câu vẫn bị tính sai; đã gặp Whisper viết "ZHI" và "DNE", hai dạng này đã chuẩn hoá (lô 18 video, N29).

**Giới hạn phải biết trước khi hứa:**

1. VieNeu không có tham số tốc độ đọc. Từ 27/10/2026 script tự kéo giãn sau khi đọc (mục 0c). Muốn khoảng nghỉ dài hơn thì tăng `khoang_nghi_cau_giay`.
2. VieNeu không tự trả mốc từng ký tự hay từng từ. Script tự tính mốc câu khi ghép, và từ 26/10/2026 lấy thêm mốc từng từ bằng Whisper (`moc_tu.json`). Đo trên đoạn thử: từ giữa câu lệch trung vị 13 ms, từ đầu câu hiện sớm hơn tiếng 55–110 ms (`10_video_ngang_thuyet_minh.md` mục 19). Không còn nguồn mốc từng ký tự: hiệu ứng gõ chữ từng ký tự phải chia đều thời gian của từ cho các ký tự (ước), không đo được (mục 5).
3. Mỗi câu VieNeu tự có sẵn khoảng 0,1 giây lặng ở đầu và 0,15 giây ở cuối, nên khoảng nghỉ nghe thực tế giữa hai câu khoảng 0,5 giây.
4. Phần có tiếng của giọng VieNeu đo −17 dBFS, đỉnh −1,8 dBFS, không vỡ tiếng (đo 25/10/2026). Các video làm trước ngày đó chỉnh âm lượng nhạc nền theo giọng cũ nhỏ hơn khoảng 5 dB; video cũ dựng lại với giọng VieNeu thì nghe lại, nếu thấy nhạc quá nhỏ thì tăng.

**Số đo (video pin mặt trời bản 3D, 8 chương, 2.422 ký tự):** 54 câu, máy chạy 61 giây (gồm cả Whisper nghe lại) cho 139 giây tiếng, đọc khoảng 17,4 ký tự mỗi giây (tính cả khoảng nghỉ). 4 câu phải đọc lại; 1 câu vẫn báo sai sau 3 lần ("Tua-bin, cánh quạt, trục máy phát", Whisper nghe "chụp máy phát"). Lượt thử của phiên META với giọng Phạm Tuyên: tỉ lệ từ sai đo bằng Whisper 3,4%, Xuân Lượng 1,4%; số đo có nhiễu vì Whisper nghe nhầm giọng Bắc.

## 0c. Tốc độ đọc chung và 10 giọng bổ sung (Trung chốt 27/10/2026)

Trung nghe 25 giọng có sẵn của VieNeu v3 Turbo trên trang `san_pham/2026.10.27.chon_giong_vieneu/2026.10.27.chon_giong_vieneu_v1.html`, mọi giọng đã chỉnh về cùng tốc độ "Hải Đăng × 1,2", rồi chốt:

| Quyết định | Nội dung |
|---|---|
| Tốc độ (đổi 30/10/2026) | Trung chốt giảm 15% cho video mới: từ 30/10/2026 đọc ở **5,06 âm tiết mỗi giây có tiếng nói** (5,95 × 0,85). "Video mới" là video chưa có giọng đủ mọi chương hoặc chưa tạo mốc thời gian; video đã có cả hai thì giữ 5,95 tới khi giao. Đọc lại vài chương của video giữ 5,95 phải truyền `--he-so-keo` của chương cũ, không thì script kéo theo đích mới và chương đó chậm hơn các chương khác 15% |
| Tốc độ (27/10/2026, nay chỉ còn cho video đã căn nhịp) | Mọi video mới đọc ở **5,95 âm tiết mỗi giây có tiếng nói** (khoá `toc_do_dich_am_tiet_giay` trong khối `vieneu` của `tai_san/cau_hinh_giong.json`), áp cho mọi giọng VieNeu, kể cả giọng riêng nếu sau này đăng ký. Video đã render giữ nguyên; chỉ đổi khi đọc lại |
| Giọng mặc định | Vẫn Hải Đăng. Giọng khác chỉ dùng khi Trung gọi tên cho từng video (`--giong "<tên>"`) |
| 10 giọng bổ sung (`giong_bo_sung`) | Nam giọng Bắc: Adam bựa, Thiện Minh, Minh Đức, Phạm Tuyên, Xuân Vĩnh, Quốc Tuấn. Nữ giọng Bắc: Mai Anh, Ngọc Huyền, Ngọc Linh. Nam giọng Nam: Đức Trí. Dùng được cho cả video ngắn dọc và video khoa học ngang |

**Cách script làm.** `sinh_giong_vieneu.py` chạy hai lượt: lượt 1 đọc và cho Whisper kiểm mọi câu như trước, ở tốc độ gốc; lượt 2 đo tốc độ trên phần có tiếng của mọi câu vừa đọc (bỏ khoảng lặng hai đầu câu), tính hệ số kéo = đích ÷ tốc độ đo, rồi kéo giãn từng câu bằng bộ lọc `atempo` của ffmpeg (đổi thời lượng, giữ cao độ) trước khi ghép (`scripts/toc_do_giong.py`). Mốc từng từ Whisper đo trên bản chưa kéo được nhân cùng tỉ lệ thời lượng. Hệ số kéo, tốc độ gốc và tốc độ đích ghi trong `c<id>.thongtin_vieneu.json`. `doc_lai_cau_vieneu.py` đọc hệ số đó và kéo câu đọc lại cùng hệ số.

**Đọc lại vài chương của video cũ:** chạy `--chuong 3 --he-so-keo <he_so_keo của chương cũ>` để nhịp khớp các chương còn lại; không truyền thì script đo lại trên riêng các chương đó, lệch vài phần trăm. Video sinh trước 27/10/2026 không có `he_so_keo` (tức 1): muốn giữ tốc độ cũ thì truyền `--he-so-keo 1`.

**`TOC_DO` trong `tao_thoi_gian.py` của video ngang (lô 18 video, N54).** Giọng sinh bằng `sinh_giong_vieneu.py` từ 27/10/2026 đã được kéo về 5,95 âm tiết mỗi giây ngay khi sinh (hệ số kéo ghi ở `he_so_keo` trong `c<id>.thongtin_vieneu.json`), nên `TOC_DO = 1.0`: không tăng tốc thêm. `tao_thoi_gian.py` chạy `atempo=TOC_DO` trên `public/giong_goc/c<id>.wav` để ra `public/giong/c<id>.wav` và chia mốc từ cho cùng hệ số; để `TOC_DO = 1.2` như video trước 27/10/2026 thì tiếng đã kéo bị tăng tốc thêm một lần nữa (khoảng 7,1 âm tiết mỗi giây thay vì 5,95, tính 5,95 × 1,2). Video có giọng sinh trước 27/10/2026 (không có `he_so_keo`) giữ `TOC_DO = 1.2`. Kiểm bằng cách mở một `c<id>.thongtin_vieneu.json`: có `he_so_keo` thì đặt 1.0.

**Chèn thêm một chương vào giữa file `.chuong.json` (lô 18 video, N31).** Các file giọng đặt tên theo `id` chương (`c<id>.wav`, `c<id>.moc_cau.json`, `c<id>.thongtin_vieneu.json`) và `moc_tu.json` khoá theo `id`, nên chèn chương làm lệch id của mọi chương sau nó. Làm theo thứ tự: (1) đổi tên file giọng của các chương sau chỗ chèn sang id mới; (2) sửa khoá chương trong `moc_tu.json` cho khớp id mới; (3) chỉ đọc chương mới bằng `--chuong <id mới> --he-so-keo <he_so_keo của chương cũ liền kề>` để nhịp khớp các chương còn lại, rồi kiểm lại `moc_tu.json` có đủ chương mới.

**Vì sao đo bằng âm tiết, không bằng ký tự.** Thuật ngữ phiên âm (xi-li-côn, ê-léc-trôn) có ít chữ cái mỗi âm tiết. Hải Đăng đo trên đoạn thử được 16,2 ký tự hay 4,96 âm tiết mỗi giây; trên chương 3 và 4 video pin mặt trời được 14,4 ký tự hay 4,59 âm tiết. Tính theo ký tự thì đoạn nhiều thuật ngữ bị coi là chậm và bị kéo quá tay; tính theo âm tiết lệch ít hơn (7% so với 11%).

**Hệ quả cần biết:** đích là con số tuyệt đối, nên trên đoạn nhiều thuật ngữ Hải Đăng bị kéo khoảng ×1,30 chứ không đúng ×1,20 (Hải Đăng tự đọc chậm lại ở đoạn khó, còn sau khi kéo mọi đoạn đều cùng nhịp). Thấy nhanh quá thì hạ `toc_do_dich_am_tiet_giay` (khoảng 5,5 thì Hải Đăng đúng ×1,2 trên đoạn nhiều thuật ngữ). **Trung nghe chương 3 video pin mặt trời ở tốc độ này và giữ 5,95 (27/10/2026).** Bản nghe: `san_pham/2026.10.27.chon_giong_vieneu/tai_nguyen/am_thanh/thu_script_pin_mat_troi_c3_*.m4a`.

**Số đo (27/10/2026).** Tốc độ gốc 25 giọng trên đoạn thử 5 câu: 3,2 đến 5,0 âm tiết mỗi giây; hệ số kéo ×1,19 (Trúc Ly) đến ×1,85 (Đức Trí). Whisper nghe lại bản đã kéo: tỉ lệ ký tự sai gần như không đổi so với bản gốc (phần lớn giọng 1,3–4%), riêng Mỹ Duyên tăng từ 1,3% lên 4,4%. Chạy thử script trên chương 3 và 4 video pin mặt trời: Hải Đăng kéo ×1,30, Đức Trí ×1,88, cả hai ra đúng cùng thời lượng (16,1 và 11,8 giây). Mốc từ sau khi co giãn so với Whisper nghe thẳng bản đã kéo: lệch trung vị 7 ms, 90% số từ lệch dưới 37 ms. Kéo trên khoảng ×1,6 dễ nghe như tua nhanh (Đức Trí, Kim Thanh, Thiền Tâm Đức, Mỹ Duyên). Số liệu đầy đủ ở `san_pham/2026.10.27.chon_giong_vieneu/tai_nguyen/tu_lieu/ket_qua.json`.

## 0b. Giọng riêng: nhân bản giọng thật từ file thu (từ 26/10/2026; giọng "Trung" đã bỏ 27/10/2026)

Trung hỏi thu giọng của mình để thêm lựa chọn giọng trong VieNeu (26/10/2026). Gói `vieneu` 3.8.3 có sẵn hàm nhân bản giọng: nhận một file thu, cắt khoảng lặng hai đầu, lọc ồn, rồi **chỉ dùng 8 giây đầu** (`_MAX_REF_SECONDS = 8.0` trong gói) để rút ra dãy số chất giọng và mã âm thanh mẫu. Hai thứ này lưu thành một giọng có tên, gọi bằng `--giong "<tên>"` như Hải Đăng.

| Mục | Nội dung |
|---|---|
| Đăng ký giọng | `.venv_vieneu/bin/python scripts/them_giong_vieneu.py --ten "Trung" --file <file thu> [--mo-ta ...] [--gioi-tinh nam] [--khong-loc-on]`. Nhận `.wav`, `.m4a` (Ghi âm iPhone, QuickTime), `.mp3`, `.aiff`; file không phải `.wav` đổi bằng `afconvert` có sẵn trên macOS (máy này không có ffmpeg) |
| Kết quả | Bản gốc chép vào `tai_san/giong_rieng/goc/`, đặc trưng giọng vào `tai_san/giong_rieng/giong_rieng_vieneu.json`, một file đọc thử ở `tai_san/giong_rieng/nghe_thu/<tên>.wav`. Script in số đo: số giây có tiếng, âm lượng, đỉnh; cảnh báo khi dưới 6 giây, đỉnh sát 0 dBFS hoặc tiếng quá nhỏ |
| Dùng giọng | `scripts/sinh_giong_vieneu.py ... --giong "Trung"`; muốn thành mặc định thì sửa `giong` trong khối `vieneu` của `tai_san/cau_hinh_giong.json` |
| Xoá giọng | `scripts/them_giong_vieneu.py --xoa "Trung"` (file gốc trong `goc/` để nguyên) |
| Không ghi vào gói | Hàm `save_voices()` của gói mặc định ghi đè file giọng trong thư mục cài đặt; cài lại gói là mất. Vì vậy script tự ghi file riêng và truyền đặc trưng giọng thẳng vào `tts.infer(voice=...)` |
| Bảo mật | File thu và file đặc trưng giọng là dữ liệu sinh trắc học, đủ để giả giọng. Cả `tai_san/giong_rieng/` nằm ngoài git (trừ `README.md`), không đưa cho phiên Grok hoặc Hermes. Chỉ nhân bản giọng của người đã đồng ý |
| Dấu ẩn | VieNeu chèn dấu ẩn vào âm thanh (`apply_watermark=True`, tai không nghe thấy); giữ nguyên |

**Cách thu** (đoạn văn để đọc ở `tai_san/giong_rieng/README.md`): 10–12 giây, phòng nhỏ có rèm hoặc vải, tắt quạt và điều hoà, miệng cách micro khoảng 20 cm, đọc đúng giọng muốn dùng trong video. **Bắt đầu nói ngay**, vì chỉ 8 giây đầu sau khi cắt lặng được dùng; câu vấp ở 8 giây đầu thì thu lại cả file.

**Số đo chạy thử (26/10/2026, dùng 22 giây giọng máy Minh Đức đổi sang `.m4a` làm file mẫu giả lập):** đăng ký chạy hết, nạp mô hình 17 giây; đọc hai câu thử bằng giọng vừa đăng ký, Whisper nghe lại sai 0% ký tự, không câu nào phải đọc lại. **Giọng "Trung" (đăng ký 26/10/2026, khuya).** Bản thu `Bản ghi mới 11.m4a` từ ứng dụng Ghi âm trên Mac: 13,1 giây, sau cắt lặng 12,2 giây, âm lượng −19,2 dBFS, đỉnh −0,2 dBFS nhưng 0 mẫu chạm 0,99 (không vỡ tiếng), nhiễu nền −57 dB. Script ban đầu cảnh báo theo đỉnh −0,5 dBFS là quá chặt, đã đổi sang đếm mẫu chạm trần. Đọc thử chương 3 video pin mặt trời (8 câu), Whisper nghe lại:

| Giọng | Thời lượng | Sai ký tự trung bình | Câu phải đọc lại | Câu vẫn sai trên 10% |
|---|---|---|---|---|
| Trung | 23,1 giây | 6,2% | 1 | "Lớp thiếu là lớp pê." (32%, Whisper nghe "lớp yu là lớp b") |
| Hải Đăng | 19,8 giây | 1,7% | 0 | không |

Lỗi của giọng Trung chủ yếu là lệch thanh: "phốt pho" thành "phốt phò", "pha bo" thành "phà bò", "chỗ trống" thành "chỗ trong". Giọng Trung đọc chậm hơn Hải Đăng khoảng 17%. Hai bản để nghe so sánh ở `tai_san/giong_rieng/nghe_thu/so_sanh_c3_pin_mat_troi_2026.10.26/` (ngoài git).

**Đăng ký lại từ bản thu thứ hai (26/10/2026, khuya, sau).** Trung gửi `Bản ghi mới 8.m4a`: 14,9 giây, có tiếng 13,3 giây, nhiễu nền −61 dB, 0 mẫu chạm trần. Bản này thành giọng "Trung"; bản thu đầu giữ tên "Trung ban 1". Đọc chương 3, 4, 5 video pin mặt trời (19 câu). Cột "độ giống" là cosin giữa đặc trưng giọng (`encode_reference`) của file máy đọc và của bản thu thật thứ hai, đo từng chương:

| Giọng | Thời lượng | Sai ký tự TB | Câu đọc lại | Câu vẫn sai >10% | Độ giống giọng thật (c3, c4, c5) |
|---|---|---|---|---|---|
| Trung (bản thu 2, có lọc ồn) | 62,7 giây | 2,4% | 3 | 0 | 0,72 · 0,79 · 0,74 |
| Trung, bản thu 2, không lọc ồn | 63,7 giây | 2,7% | 3 | 1 | 0,73 · 0,70 · 0,83 |
| Trung ban 1 | 60,1 giây | 3,2% | 4 | 1 | 0,62 · 0,69 · 0,77 |
| Hải Đăng (đối chứng) | 52,1 giây | 2,1% | 0 | 0 | 0,33 · 0,29 · 0,31 |

Mốc trần để đọc cột độ giống: hai bản thu thật của Trung so với nhau được 0,89. Bỏ lọc ồn không tốt hơn rõ mà kém ổn định hơn, nên đã xoá biến thể đó khỏi file giọng. Các lỗi còn lại phần lớn là Whisper nghe nhầm giọng Bắc ("dải" thành "giải", "dư" thành "du") hoặc viết số bằng chữ số, không phải máy đọc sai. Giọng Trung đọc chậm hơn Hải Đăng khoảng 20%, đúng nhịp nói tự nhiên của Trung. Bản nghe so sánh ở `tai_san/giong_rieng/nghe_thu/so_sanh_ban2_2026.10.26/`.

**Quyết định (Trung chốt 26/10/2026, sau khi nghe ba bản chương 3):** Hải Đăng vẫn là giọng mặc định của xưởng. Giọng "Trung" là lựa chọn, chỉ dùng khi Trung yêu cầu cho từng video (`--giong "Trung"`). "Trung ban 1" đã xoá khỏi file giọng; bản thu gốc vẫn ở `tai_san/giong_rieng/goc/trung_ban_1.m4a`.

**Bỏ giọng Trung (Trung chốt 27/10/2026).** Trung nghe chương 3 video pin mặt trời bằng "Trung" (kéo ×1,67) và "Trung ban 1" (dựng tạm từ bản thu gốc, kéo ×1,56) ở tốc độ 5,95 âm tiết mỗi giây (mục 0c), rồi bỏ cả hai khỏi VieNeu. Đã chạy `them_giong_vieneu.py --xoa "Trung"`; `giong_rieng_vieneu.json` không còn giọng nào, `--giong "Trung"` không còn dùng được. Trung chọn bỏ luôn dữ liệu: hai bản thu gốc (`goc/trung.m4a`, `goc/trung_ban_1.m4a`) và mọi bản máy nhân bản trong `nghe_thu/` đã chuyển vào Thùng rác (thư mục `giong_rieng_trung_2026.10.27`), Trung tự dọn; muốn nhân bản lại phải thu âm lại. Các đường dẫn `goc/`, `nghe_thu/` nhắc ở trên không còn. Script và cách thu ở mục này giữ lại để đăng ký giọng khác khi cần.

**Thu thêm có giúp không.** Thu dài hơn không giúp, vì VieNeu chỉ dùng 8 giây đầu. Đổi bản thu chỉ thay đổi 8 giây mẫu đó: lần đổi này nâng độ giống trung bình từ 0,69 lên 0,75. Muốn gần mức 0,89 phải tinh chỉnh mô hình bằng LoRA (huấn luyện thêm một phần nhỏ của mô hình trên giọng Trung). README kho mã nguồn VieNeu mục 5 (đọc 26/10/2026) ghi cần 10–30 phút thu âm sạch của một người và một card đồ hoạ khoảng 6 GB; mô hình đã tinh chỉnh chạy bằng đường PyTorch/GPU. Chưa thử; chưa kiểm được việc huấn luyện có chạy trên chip Apple của máy này không.

## 1. ElevenLabs đã bỏ (27/10/2026)

**Ngày 27/10/2026 Trung bỏ ElevenLabs. Chỉ dùng VieNeu.** Giọng Xuân Lượng, script `sinh_giong_doc.py`, khoá API, model `eleven_v4` và `eleven_turbo_v2_5`, mốc từng ký tự không còn nằm trong đường làm. Không dùng ElevenLabs làm đường lui và không đề xuất lại khi chọn giọng. VieNeu hỏng hoặc đọc sai nhiều thì báo Trung quyết hướng khác; chưa có đường lui nào đã dựng.

Phần hướng dẫn cũ (mục 1 "ElevenLabs, giọng Xuân Lượng", mục 2 "Vì sao đổi từ Azure sang ElevenLabs", mục 3 "Bẫy chết người: sai giọng mà không có lỗi nào báo", mục 5 và 6 cũ, việc theo dõi hạn mức) chuyển nguyên văn sang `_luu_tru/elevenlabs_da_bo_2026.10.27/huong_dan_cu.md`. Cùng thư mục: `sinh_giong_doc.py`, `khoa_api.README.md`, `cau_hinh_elevenlabs_cu.json` (khối cấu hình ElevenLabs lấy khỏi `tai_san/cau_hinh_giong.json`), `chuan_bi_video_duong_elevenlabs.mjs.txt` (hàm đường ElevenLabs lấy khỏi `scripts/chuan_bi_video.mjs`). Azure Speech (giọng HoaiMy, NamMinh) và `edge-tts` chỉ còn ý nghĩa lịch sử, không có script trong project.

Số mục 2, 3 không còn nội dung ở file này. Số mục 4, 5, 7 giữ nguyên để các chỗ trỏ chéo "08 mục 4", "08 mục 5", "08 mục 7" không lệch. Mục 6 viết lại cho VieNeu.

Khoá ElevenLabs nằm ở `tai_san/khoa_api.txt` trên máy (ngoài git, không đọc, không in): không còn dùng, Trung tự xoá.

## 4. Bản chữ và bản đọc phải tách riêng

Mỗi kịch bản có hai file trong `tai_nguyen/kich_ban/` của thư mục video (`AGENTS.md` mục Quy ước sản phẩm):

| File | Dùng cho | Khác nhau ở đâu |
|---|---|---|
| `<ten>.md` | Trung đọc, duyệt, dựng hình | Có tiêu đề cảnh, chữ in đậm, ghi chú thời lượng, số viết dạng `96%` |
| `<ten>.loi_doc.txt` | Máy đọc | Chỉ lời thoại thuần. **Số viết ra chữ** (`chín mươi sáu phần trăm`), bỏ hết dấu nhấn và ghi chú |

Số viết dạng ký hiệu thì máy đọc hay sai — `96%` có khi thành "chín sáu phần trăm". Dấu in đậm thì máy đọc luôn cả dấu sao.

**Hệ quả bắt buộc: sửa chữ thì phải sửa cả hai file.** Sửa mỗi bản `.md` rồi sinh lại tiếng là ra file cũ mà không biết.

### 4a. Thuật ngữ quốc tế đọc chuẩn Cambridge (Trung chốt 02/11/2026)

Mọi thuật ngữ, tên riêng, chữ viết tắt quốc tế trong lời đọc (core banking, cut-off time, KYC, SWIFT, Incoterms, RWA…) đọc đúng phát âm của từ điển Cambridge (dictionary.cambridge.org), giọng Mỹ theo tiền lệ N89 bản nháp v2 (01/11/2026). Không Việt hoá kiểu "cát-ốp-thai", "co-bang-king". Chữ viết tắt đọc theo cách Cambridge ghi (đánh vần từng chữ cái hay đọc thành từ). Cách làm: tra Cambridge, ghi IPA giọng Mỹ vào trường `ipa_us` và cách viết cho VieNeu vào trường `doc` của từ điển kênh (`tai_san/giong_doc/tu_dien_doc/ngan_hang.json`) TRƯỚC khi đọc giọng, rồi chạy `python3 -I scripts/kiem_loi_doc.py <file .chuong.json>`; nghe lại đúng câu có thuật ngữ trong bản nháp. Cambridge không có từ đó thì lấy tài liệu chính thức của tổ chức sở hữu tên, ghi nguồn vào `ghi_chu`.

## 5. Mốc thời gian từng từ — nguyên liệu của phụ đề chạy chữ

VieNeu chỉ trả mốc theo câu (`c<id>.moc_cau.json`). Mốc từng từ lấy bằng cách cho Whisper nghe lại từng câu rồi ghép thời gian vào chữ đúng chính tả của trường `text` trong kịch bản; kết quả ghi vào `moc_tu.json` (một file cho cả video, theo chương, giây trong `c<id>.wav`). Cách ghép, lệnh, số đo độ lệch: `10_video_ngang_thuyet_minh.md` mục 19. Giọng đã đọc từ trước thì bổ sung bằng `scripts/moc_tung_tu.py` (mục 0).

Từ mốc từng từ gom lên thành cụm để làm phụ đề chạy chữ: phần dựng nằm ở `09_video_doc_ngan.md` (video dọc) và `10_video_ngang_thuyet_minh.md` mục 19 (video ngang). Lệnh `gop` của `scripts/chuan_bi_video.mjs` (video dọc) hiện chỉ đọc mốc câu và chia cụm theo ký tự; nối `moc_tu.json` vào lệnh này là việc còn mở trong `so_no_cong_viec.md`.

**Hai việc cần biết khi dùng `moc_tu.json` (lô 18 video).**

- **Phụ đề chỉ đọc chữ từ `moc_tu.json`.** Chữ hiện trên phụ đề lấy từ trường `chu` của từng từ trong `public/giong_goc/moc_tu.json` (cấu trúc `chuong` → id chương → từng câu → `tu` → `chu`, `bd`, `kt`), được ghi lúc sinh giọng. Sửa trường `text` trong `.chuong.json` sau khi đã sinh giọng thì phụ đề không đổi theo: phải sửa tay `chu` tương ứng trong `moc_tu.json` (N30). Sửa chữ mà muốn mốc đo lại thì chạy `scripts/moc_tung_tu.py` hoặc sinh lại giọng.
- **Phát hiện máy đọc nuốt chữ bằng độ dài từ.** Tách rời thuật ngữ viết tắt mà giọng đọc mất âm tiết thì Whisper vẫn có thể nghe khớp, nhưng từ đó ngắn bất thường trong `moc_tu.json` (`kt − bd`). Ví dụ "kWp" đo 0,33 giây trong khi các từ tương tự dài 0,47–0,59 giây (N35). Cách rà: lọc các từ có `kt − bd` ngắn hơn rõ rệt so với từ cùng loại. Cách sửa: bỏ dấu phẩy đứng ngay sau từ đó trong trường `doc`, rồi đọc lại câu (cùng họ lỗi với nuốt chữ "pê" ở `03_kich_ban_va_loi_viet.md` mục 5.3).

### 5b. Phụ đề hai dòng (Trung duyệt gom 28/10/2026, lô 16 video điện gió)

- Câu dài hơn một dòng (khoảng 78 ký tự) chia hai dòng gần bằng nhau, ưu tiên ngắt sau dấu phẩy; dòng cuối không dưới 3 chữ; không tách số khỏi đơn vị (khoảng trắng không ngắt giữa số và %, MW, m, tấn) và không tách "máy" khỏi số theo sau. Lỗi đã gặp: dòng hai chỉ còn "máy.", "79" / "m đã sát giới hạn" (N37).
- Tính ngắt dòng ngay trong thành phần, mỗi dòng `nowrap`, không để trình duyệt tự xuống dòng. Bản đúng: `xuong_dai/bau_canh_hub/src/PhuDeChayChu.tsx` (N38), thêm cụm không tách trong `CUM` ở `xuong_dai/cong_suat_rieng/src/PhuDeChayChu.tsx`: "công suất", "hệ số công suất", "diện tích quét", "nguồn dự phòng", "bầu cánh", "ổ đỡ cánh", "bộ truyền động" (N43). Khung mã mới chép một trong hai file này.
- Whisper nghe lại hay báo sai câu có "%" và số kèm "m" (lỗi chuẩn hoá, giọng vẫn đúng); riêng số đứng cuối câu như "hai mê-ga-oát" thì Whisper nghe thành "20 MW" thật sự (ba lần đọc lại không cứu được): đưa số vào giữa câu (N37).

## 6. Tốc độ đọc thực tế

Giọng Hải Đăng đọc khoảng 17,4 ký tự mỗi giây tính cả khoảng nghỉ giữa câu (mục 0, đo 25/10/2026 trên 2.422 ký tự). Video dài và video dọc tăng tốc 1,2 lần (Trung chốt 26/10/2026) nên tiếng ra khoảng 20,9 ký tự mỗi giây (ước, tính từ hai số trên). Muốn video khoảng 90 giây thì cần chừng 1.900 ký tự lời đọc (ước). Đừng tin con số "từ mỗi phút" tính tay: đọc thử một lần là biết thời lượng thật.

VieNeu không có tham số tốc độ. Muốn chậm hơn thì tăng `khoang_nghi_cau_giay` trong `tai_san/cau_hinh_giong.json` hoặc đổi hệ số tăng tốc (`TOC_DO` trong `scripts/chuan_bi_video.mjs`, `tao_thoi_gian.py` của từng video ngang). Với giọng sinh từ 27/10/2026, `TOC_DO` phải là 1.0 vì giọng đã được kéo sẵn (mục 0c).

**Số đo thực từ 27/10/2026 (lô 18 video, N30).** Video "Một nhà máy điện phát bao nhiêu điện mỗi năm" (9 chương, 49 câu): 3.740 ký tự lời đọc (`doc`), tổng thời lượng các file giọng 159,1 giây, video hoàn chỉnh 175,85 giây. Tức khoảng 23,5 ký tự mỗi giây giọng kể cả khoảng nghỉ giữa câu, và khoảng 21,3 ký tự mỗi giây nếu tính theo cả video (có đoạn đệm đầu cuối và giữa các chương). Dự trù độ dài video: lấy số ký tự `doc` chia 21 (ký tự mỗi giây tính theo video) thì ra thời lượng cả video; chia 23,5 thì ra thời lượng tiếng thuần. Con số "1.900 ký tự cho 90 giây" ở trên (khoảng 21,1 ký tự mỗi giây) khớp cách tính theo cả video, còn số 20,9 ở đầu mục là ước thấp hơn số đo thực này.

## 7. Nhạc nền và hiệu ứng tiếng

Kho nhạc nền ở `tai_san/nhac_nen/`: 78 bài (27/10/2026), nguồn Mixkit và Pixabay, mỗi bài một mã số cố định NH00–NH77. Sổ phân loại là `tai_san/nhac_nen/so_nhac.md` (bảng đọc) và `so_nhac.json` (cho script), sinh bằng `python3 scripts/lap_so_nhac.py`. Nguồn gốc, giấy phép, cách chọn và độ tin từng lớp phân loại: `tai_san/nhac_nen/README.md`.

Mỗi bài có ba lớp nhãn: độ dài (ngắn dưới 1:30, vừa 1:30–2:30, dài trên 2:30), tiết tấu (chậm, vừa, nhanh) và tính chất (tươi vui, tập trung nhẹ, trầm nghiêm, buồn, hồi hộp, hùng tráng). Khi viết, ghi mã kèm nhãn để người đọc không phải tra: `NH63 (tập trung, vừa, ngắn)`.

Chọn nhạc cho một video:

1. Lọc nhóm tính chất theo mạch kịch bản (video máy móc D-09b thường "tươi vui" hoặc "tập trung"; KB-06 vạch trần hợp "hồi hộp"; KB-03 ngược dòng hợp "trầm").
2. Lọc độ dài: chọn bài dài hơn video trong kho. Chỉ khi không có bài nào hợp đủ dài thì áp thứ tự ở đoạn "Nhạc ngắn hơn video" bên dưới.
3. Lọc chất lượng theo ngưỡng của script (đoạn "Ngưỡng lọc nhạc của script" bên dưới); bài nghi rè dưới ngưỡng thì nghe lại trước khi dùng.
4. Nhãn độ dài, tiết tấu, tính chất của cả 78 bài đã được Trung nghe kiểm và chốt ngày 27/10/2026, dùng thẳng được. Khi hai bài cùng hợp, ưu tiên bài có "Độ tin nhóm" là "khớp". Bài thêm sau ngày chốt chưa được duyệt cho tới khi Trung nghe.
5. Đặt âm lượng theo cột "Âm lượng" (quy về mức nghe ngang "Close Up" ở 0,16), không giữ một mức chung.
6. Đọc cột "Lưu ý": đoạn đầu nhỏ thì phát từ giây đó; "nghi rè" và "có thể có giọng hát" thì nghe lại.

**Ngưỡng lọc nhạc của script (Trung chốt 27/10/2026; khớp với `scripts/goi_y_to_hop_dung.py`, số ở `04_he_truc_dung.md` mục 2 và `tai_san/so_tay_gu/he_truc_dung.md`).** Script đọc `tai_san/nhac_nen/so_nhac.json` và loại:
- Bài rè nặng: năng lượng trên 10 kHz tăng từ 7 dB, hoặc trên 16 kHz tăng từ 12 dB, so với trung vị cả bài (`scripts/do_re_cao_tan.py`). Luôn loại NH02 "Your Breath" vì Trung đã nghe thấy rè (đo 7,9 và 14,5 dB).
- Bài máy đoán có giọng hát (cờ `co_the_co_loi` của sổ, 9 bài), vì giọng hát đè lên giọng đọc.
- Bài chưa có file nhạc trên máy (tải lại theo trường `tai_tu` của sổ).

Chưa tính điều kiện thứ ba, còn 39 trên 78 bài (đếm bằng `so_nhac.json` ngày 27/10/2026). Bản sao làm việc trên nhánh `hoc-phong-cach-opus55` chỉ có 18 file mp3 nên script ở đó đếm ít hơn; nhánh chính có đủ 78 file. Cờ "nghi rè" của sổ dùng ngưỡng cũ (5 dB và 8 dB) và gắn cho 51 trên 78 bài, báo nhầm nhiều, nên không dùng để loại: script chỉ trừ điểm và ghi "nghe lại". Bài nghi rè dưới ngưỡng loại thì đưa Trung nghe lại trước khi dùng.

**Nhạc ngắn hơn video (Trung chốt 27/10/2026; đây là chỗ duy nhất ghi quy tắc này, các module khác trỏ về đây).** Thứ tự duy nhất:

1. Chọn bài dài hơn video trong kho.
2. Không có bài hợp đủ dài thì phát chậm, tốc độ không thấp hơn 0,95 lần tốc độ gốc, giữ cao độ (bài chỉ ngắn hơn video khoảng 5%). Remotion: `playbackRate` của `<Audio>`; FFmpeg: `atempo`. `<Audio>` của Remotion nhận cùng lúc `playbackRate` và `trimBefore` (số khung bỏ ở đầu bài): video "cái nhãn tấm pin" bản 2 (lô 18 video, N21 v2) bỏ 12 giây đầu bài 226 giây (còn 214 giây, ngắn hơn video 221,7 giây khoảng 3,5%) rồi phát chậm 0,965 để vừa độ dài. Số khung nhạc sau khi chậm = (số khung bài − số khung bỏ đầu) ÷ `playbackRate`; đặt mờ cuối (`volume`) theo số khung này, không theo độ dài bài gốc. Mẫu: `xuong_dai/nhan_tam_pin/src/Video.tsx` (hằng `NHAC_BO`, `NHAC_TOC`, `NHAC_KHUNG`).
3. Vẫn thiếu thì nối lặp, có mờ chéo ở chỗ nối (bản sau vào mờ dần trước khi bản trước hết; mẫu ở `san_pham/2026.10.25.Pin mặt trời hoạt động như thế nào mà không cần bộ phận quay?/tai_nguyen/kich_ban/2026.10.26.pin_mat_troi_d09b_v1.md`).

Công cụ `xuong_html/cong_cu/ghep_am_thanh.sh` (cách làm HTML một trang) hiện lặp bài bằng `-stream_loop` và cắt đúng độ dài video, chưa phát chậm và chưa mờ chéo ở chỗ nối; tới khi sửa, video dựng bằng công cụ này nên chọn bài dài hơn video (bước 1). Video Remotion đặt nhạc tay trong `Video.tsx` (`10_video_ngang_thuyet_minh.md` mục 2).

Nhạc nền để nhỏ hơn giọng đọc rõ rệt — nhạc át giọng là lỗi thường gặp nhất và người xem sẽ tắt ngay.

Hiệu ứng tiếng (tiếng "vút", tiếng bấm…) chưa có kho riêng.

## 8. Việc còn phải làm

0. ~~Video ngắn dùng VieNeu~~ — **XONG 26/10/2026.** Lệnh `gop` của `scripts/chuan_bi_video.mjs` nhận mốc câu của VieNeu, tăng tốc 1,2 lần, chia mỗi câu thành cụm tối đa 6 từ theo tỷ lệ số ký tự; phụ đề cụm chữ trắng, không tô đỏ từ đang đọc (Trung chọn). Cách chạy: `09_video_doc_ngan.md` mục 5. Mốc từng từ bằng Whisper đã có từ 26/10/2026 (`moc_tu.json`, dùng ở video ngang); khuôn video ngắn chưa chuyển sang dùng nó để tô đỏ từ đang đọc.

1. ~~Gom nhạc nền~~ — **XONG 27/10/2026**, mục 7. Còn lại: Trung nghe lại nhãn tính chất trên `tai_san/nhac_nen/nghe_thu.html`; bổ sung bài hùng tráng.
2. ~~Viết phần gom mốc ký tự thành cụm từ để dựng phụ đề chạy chữ (thuộc việc dựng).~~ — **XONG**: `scripts/chuan_bi_video.mjs` (lệnh `gop`, video dọc) và `scripts/moc_tung_tu.py` (mốc từng từ bằng Whisper, video ngang).
3. ~~Theo dõi hạn mức 40.000 ký tự mỗi tháng của ElevenLabs~~ — bỏ ngày 27/10/2026 cùng ElevenLabs.
4. Nối `moc_tu.json` (mốc từng từ bằng Whisper) vào lệnh `gop` của `scripts/chuan_bi_video.mjs` để video dọc có phụ đề chạy từng chữ: việc mở trong `so_no_cong_viec.md` (mã N57). Hiện lệnh `gop` chỉ chia cụm theo câu; bước `loi_doc` cũng chưa ghi trường `text` vào `<tên>.chuong.json`, nên `sinh_giong_vieneu.py` chưa sinh được `moc_tu.json` cho video dọc.

## 9. Đo âm thanh bằng số

Claude không nghe được âm thanh. Mọi quyết định về nhạc, tiếng hiệu ứng và độ to dựa trên số đo và file sự kiện; Trung nghe kết luận cuối. Khuôn đầy đủ, đoạn mã đặt tiếng theo đỉnh, lệnh đo: `tai_san/khuon_prompt/khuon_am_thanh_tu_du_lieu.md` (bản 1.0, đoạn mã và lệnh chạy thử 27/10/2026 trên tín hiệu tổng hợp, chưa chạy trên video thật của Media).

| Việc | Cách đo hoặc làm | Ngưỡng |
|---|---|---|
| Nhịp của nhạc | `librosa.beat.beat_track` và `librosa.onset.onset_detect` trong `.venv_nhac/bin/python`; ghi phách đầu và dãy thời điểm phách. Nhịp (BPM) trong sổ nhạc là ước, có thể lệch nửa hoặc gấp đôi | Độ lệch chuẩn khoảng cách giữa các phách dưới 20 mili giây thì lưới phách dùng được (đề xuất, chưa hiệu chỉnh) |
| Đỉnh biên độ của tiếng hiệu ứng | Đo thời điểm đỉnh của từng tiếng (biên độ làm mịn 5 mili giây), đặt tiếng sao cho **đỉnh** rơi đúng khung hành động, không phải đầu file | Lệch không quá nửa khung hình |
| Độ to của cả video | `ebur128` hoặc `loudnorm` của FFmpeg, đo lại sau khi mã hoá AAC | −14 LUFS (độ to tích hợp theo chuẩn phát trực tuyến); đỉnh thật tối đa −1,5 dBTP theo `ghep_am_thanh.sh` (khuôn âm thanh ghi −2 dBTP, chưa thống nhất) |
| Nhạc hạ dưới giọng | Bộ nén `sidechaincompress` (giọng điều khiển bộ nén của nhạc) | Giọng cao hơn nhạc 10–15 dB khi đang nói |
| Nhạc rè, có giọng hát | `scripts/do_re_cao_tan.py`, cờ `co_the_co_loi` | Mục 7 |

**Âm thanh sinh từ cùng dữ liệu với hình.** Một file sự kiện (mảng `{t, loai, db}`: thời điểm, loại, mức) điều khiển cả hình lẫn tiếng, để mỗi tiếng ứng với một việc nhìn thấy được: một tiếng "vút" mềm cho mỗi lần đổi cảnh thật, tiếng click cho hành động thật trên màn hình, im lặng ngoài ra. Video khung mã Remotion lấy sự kiện từ `KichBan.ts` hoặc `thoi_gian.json`; video HTML một trang lấy từ hàm `window.suKien()` của trang. Tiếng tổng hợp bằng mã (sóng sin hoặc nhiễu nhân với đường bao biên độ) có đỉnh biết trước nên không cần đo. Video phải hiểu được khi tắt tiếng: âm thanh bổ sung cho hình, không mang ý chính.

**Công cụ.** `xuong_html/cong_cu/ghep_am_thanh.sh` ghép MP4 hình với giọng và nhạc: đổi giọng về 48 kHz, hạ nhạc dưới giọng bằng `sidechaincompress`, chuẩn −14 LUFS hai lượt (đo rồi chỉnh tuyến tính), mã hoá AAC 192 kbit/s, rồi đo lại độ to thực của file ra và cảnh báo khi lệch đích trên 1 LU. Dùng FFmpeg của `xuong_thu_hyperframes/bin/ffmpeg` (6.0, có `loudnorm`, `ebur128`, `sidechaincompress`); FFmpeg đi kèm Remotion không có `ebur128` và chỉ xuất được WAV.

## Nguồn số liệu

- [VieNeu-TTS v3 Turbo trên Hugging Face — giấy phép, điều cấm nhân bản giọng](https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo) (phiên META đọc ngày 25/10/2026); mã nguồn: [github.com/pnnbao97/VieNeu-TTS](https://github.com/pnnbao97/VieNeu-TTS)
- Nguồn cũ về ElevenLabs và Azure Speech: `_luu_tru/elevenlabs_da_bo_2026.10.27/huong_dan_cu.md`.
