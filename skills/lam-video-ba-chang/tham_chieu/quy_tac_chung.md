# Quy tắc chung cho mọi tác tử ba chặng

> Skill `lam-video-ba-chang`, lập 05/11/2026. Mọi tác tử ba chặng đọc file này trước, rồi file chặng của mình và file kênh mà lời nhắn ghi. Tác tử chạy với `omitClaudeMd: true` nên không nạp `AGENTS.md` của VideoNganHang và các file `CLAUDE.md`: quy tắc cần giữ từ các file đó chép ở mục 0 (chép 05/11/2026). Ai sửa các quy tắc này ở `AGENTS.md` hoặc `CLAUDE.md` thì sửa cả mục 0.

Thư mục gốc `/Users/macbooktrungnt/Documents/VideoNganHang` (gọi tắt `VideoNganHang/`); mọi lệnh chạy ở gốc này.

## 0. Quy tắc lấy từ AGENTS.md của VideoNganHang và hai file CLAUDE.md

**Năm quy tắc cứng của VideoNganHang** (`AGENTS.md` mục "Quy tắc cứng"; tác tử áp như sau):
1. Làm rõ trước khi làm: tác tử không hỏi Trung trực tiếp. **Làm một mạch**: không hỏi Trung; điểm đã có quy định hoặc tiền lệ thì tự chọn phương án khuyến nghị, ghi mục "Đã tự quyết" của `.tien_do.md`; điểm thật sự mới ghi mục "Câu hỏi cho Trung" rồi làm tiếp bằng phương án hợp lý nhất.
2. Hai cửa chọn, hai cửa duyệt: lô nhiều video được bỏ hai cửa chọn (Trung chốt 27/10/2026); ghi mã KB, năm mã trục, cách làm và lý do chọn vào đầu kịch bản; bản nháp vẫn qua cửa duyệt của Trung. Lời nhắn ghi "Dừng trước giọng" (video lẻ chờ Trung duyệt chữ) thì chặng A dừng trước khi sinh giọng.
3. Kiểm chứng trước khi đưa số lên hình. Mọi con số trên màn hình lấy từ file nguồn kiểm chứng của video; số chỉ có một nguồn không đưa vào video.
4. Chỉ dùng giọng VieNeu (Trung chốt 27/10/2026, bỏ ElevenLabs).
5. Báo chi phí trước khi chạy việc tốn: phiên giữ lô đã báo chi phí các lệnh máy trong file này. Tác tử không tự chạy việc tốn ngoài các bước của chặng (nhoè chuyển động 60 khung/giây, Blender, kết xuất thêm lượt).

**Cách viết** (`~/.claude/CLAUDE.md` mục "Ngôn ngữ và cách viết"; `AGENTS.md` quy ước chung 1): tiếng Việt rành mạch, ngắn gọn, đi thẳng vấn đề. Không ví von, ẩn dụ, hoán dụ, nhân hoá: gọi đúng tên sự vật, mô tả đúng cơ chế. Áp cho lời đọc, chữ trên hình, chữ đăng, file chặng, báo cáo. Giữ thuật ngữ tài chính quen dùng và tên riêng sản phẩm; từ kỹ thuật máy tính diễn đạt bằng tiếng Việt. Báo cáo không gọi file bằng số đầu tên.

**Bảo mật** (`~/.claude/CLAUDE.md` mục "Bảo mật", `~/Documents/Grok/CLAUDE.md` bảng kho dữ liệu nhạy cảm, `AGENTS.md` quy ước chung 2): không đọc, không xử lý dữ liệu khách hàng, thông tin cá nhân, thông tin nội bộ chưa công bố. Không đọc `.env`, khoá OAuth, khoá API, file `_noi_bo`, các kho nhạy cảm của cây Grok: `../RM MB/` (quy chế, quy trình tín dụng, hồ sơ khách hàng), `../To trinh tin dung/`, `../CRM-HNO/`, `../Dau tu chung khoan/`, `../Hoc CFA/giao_trinh_goc/`. Video công khai: không tên, logo ngân hàng, công ty, hãng thẻ thật trên hình; không dùng nhận diện thương hiệu MB (`13_ban_quyen_va_bao_mat.md`); riêng bảng màu MAU-36 được dùng, chỉ lấy màu (Trung chốt 05/11/2026, file kênh mục "Bảng màu").

**Nạp lười** (`AGENTS.md` mục "Nạp lười"): đọc file dài bằng `grep -n` rồi đọc đúng đoạn. Không quét `xuong/`, `xuong_dai/`, `xuong_thu_hyperframes/`, `node_modules/`, `_luu_tru/`, `.claude/worktrees/` (bản sao cả kho), thư mục dựng của video khác ngoài khuôn trang được chỉ; `grep -r` từ gốc VideoNganHang phải loại các thư mục này.

**Quy ước sản phẩm** (`AGENTS.md` mục "Quy ước sản phẩm" 2, 3, 7): mỗi video một thư mục `san_pham/<yyyy.mm.dd.chủ_đề>/`; bản nháp ngoài cùng tên `yyyy.mm.dd.<tên>_youtube_v1_nhap.mp4`; `tai_nguyen/kich_ban/` (kịch bản, nguồn kiểm chứng, tiến độ), `tai_nguyen/nguon_goc.md`, `tai_nguyen/ban_nhap/`, `tai_nguyen/dang_bai/` (chữ đăng `<nền tảng>.md`, `hinh_thu_nho.json`, `y_tuong_tiep.md`). Vào git: `tai_nguyen/kich_ban/`, `nguon_goc.md`, các file `.md` trong `dang_bai/`, file mã của thư mục dựng; video, ảnh, âm thanh nằm ngoài git. Tên thư mục có dấu cách hoặc dấu hỏi: đặt đường dẫn trong ngoặc kép. Thư mục con trống thì không tạo. `tai_nguyen/dang_bai/y_tuong_tiep.md` là chỗ Trung gõ ý tưởng trên bảng video: đọc trước khi làm, không ghi đè; xoá ý chỉ khi phiên giữ lô bảo. Dùng tài nguyên của video đã giao (khuôn trang, giọng, nhạc) mà thư mục thiếu file: tra `du_lieu/luu_tru_drive/MUC_LUC.md` (video đã lưu trữ lên Drive), ghi file chặng, báo phiên giữ lô; không tự tải.

Git, xoá file, tiến trình: mục 5.

## 1. Lệnh máy dùng chung (đọc `--help` hoặc đầu file khi cần)

**Chuỗi giọng** (Python của `.venv_vieneu`, gốc `VideoNganHang/`):

```bash
.venv_vieneu/bin/python scripts/chuoi_giong.py xuong_html/<mã>_<tên> <mã> --kich-ban "<đường dẫn .chuong.json>" --giong "Quốc Tuấn" --nen
```

Tự chờ tới khi tổng tiến trình đọc giọng toàn máy dưới 3. Đưa giọng về khớp `.chuong.json`: chương chưa có giọng hoặc đổi số câu thì sinh lại cả chương (giữ hệ số kéo của chương cũ); câu đổi lời mà số câu giữ nguyên thì chỉ đọc lại câu đó. Quét Whisper câu mới hoặc đã đổi ở hai lề cắt 0,05 và 0,4 giây, bỏ qua cặp "viết khác, đọc đúng" (xưởng/sưởng, xê/c, bê/b, hằng/hàng, ca-sa/casa, ép-ếch/FX; thêm cặp riêng bằng `--bo-qua "a/b"`). Cặp chỉ khác phụ âm đầu mà giọng Bắc đọc như nhau (r/d/gi, s/x, tr/ch, ví dụ "ranh" nghe "danh") lệnh tự bỏ qua. Câu lệch đọc lại tối đa 5 lần, chỉ nhận lần đúng ở CẢ HAI lề; không đạt thì giữ lần ít lệch nhất và đưa vào danh sách "nghe tai". Chạy `<mã>_tao_nhip.py` nếu đã có. Cặp `--bo-qua` so phía Whisper không phân biệt đ/d; thêm cặp ở lần chạy sau thì câu "nghe tai" cũ được xét lại theo chữ Whisper đã nghe. Cặp `--bo-qua` cộng dồn qua các lần chạy (ghi trong `out/may/giong.trang_thai.json`), chuỗi kết xuất cũng dùng, không cần khai lại. Báo cáo có mốc phút:giây khi dự án đã có `<mã>_tao_nhip.py`: chạy lại lệnh không đổi gì (vài giây) để lấy mốc. Tuỳ chọn: `--cau 3.2,5.4` ép đọc lại câu (chương.câu, đếm từ 1, dùng khi soát nghe sai mà Whisper không bắt); `--chuong 3,5`; `--quet-lai`. Bỏ `--nen` thì chạy tại chỗ (đọc lại vài câu mất 1–3 phút).

**Chuỗi kết xuất và đo** (python3 hệ thống):

```bash
python3 -I scripts/chuoi_ket_xuat.py xuong_html/<mã>_<tên> <mã> --san-pham "san_pham/<thư mục>" --ban-nhap "san_pham/<thư mục>/<ngày>.<tên>_youtube_v1_nhap.mp4" --nen
```

Chạy `<mã>_tao_nhip.py`; file nhạc trong `nhip.json` ngắn hơn video thì tự chạy lại `<mã>_noi_nhac.sh` của dự án với độ dài video cộng 6 giây (dòng "Nhạc nối lại" trong báo cáo; không cần nối nhạc tay khi giọng đổi độ dài); máy kiểm trang qua chỗ nhanh của hàng đợi (`quet_kiem` lỗi bố cục, `do_tu` khung quá 12 tiếng, `do_hien` chữ hiện rõ dưới 1 giây, `tuong_phan` dưới 4,5:1 mỗi 2 giây, `uoc_dung` cặp khung lệch sáng dưới 0,6); ổ từ 15 GB thì ghi phiếu và chạy pha máy (`scripts/pha_may/pha_may.mjs tao`, `chay --chi`); đo đứng hình cắt dải phụ đề (d=1,5 giây); chép bản đủ ra bản nháp (bản nháp cũ tự chuyển vào `tai_nguyen/ban_nhap/<tên>_truoc_soat.mp4`); nghe lại mọi câu trên tiếng đã trộn nhạc của bản đủ ở hai lề (`chuoi_giong.py --nghe-tron`, câu có đoạn tiếng không đổi thì không nghe lại; chi tiết `out/may/nghe_tron.json`), ghi mục "Nghe trên tiếng có nhạc" của báo cáo: **HAI LỀ** là Whisper nghe sai ở cả hai lề cắt, người nghe cũng dễ nhầm; "một lề" thường do nhạc hoặc lề cắt, xét nhẹ hơn. Tuỳ chọn: `--chuong-sua 3,5` (mã chương pha máy trong `nhip.json`); `--chi-kiem-trang` (chỉ tạo nhịp, nối lại nhạc nếu cần và kiểm trang, chạy tại chỗ 1–3 phút, dùng giữa các vòng ảnh tĩnh); `--bo-nghe-tron`.

**Lệnh chờ** (thêm 05/11/2026; dùng thay cho mọi vòng chờ tự viết):

```bash
python3 -I scripts/chuoi_ket_xuat.py xuong_html/<mã>_<tên> <mã> --cho          # chờ chuỗi kết xuất chạy nền
python3 -I scripts/chuoi_ket_xuat.py xuong_html/<mã>_<tên> <mã> --cho-giong    # chờ chuỗi giọng chạy nền
```

Đọc file trạng thái mỗi 10 giây, dừng sau tối đa 270 giây, in một dòng trạng thái. Mã thoát 0: xong, đọc báo cáo. Mã 1: lỗi hoặc tiến trình đã dừng mà trạng thái chưa cập nhật; đọc báo cáo và nhật ký `out/may/*.log`, ghi file chặng, báo. Mã 3: chưa xong, gọi lại ngay. Gọi qua công cụ Bash với `timeout: 300000` (mặc định 2 phút của Bash cắt lệnh giữa chừng). Tác tử không tăng `--cho-giay`.

**Ảnh tĩnh và từng máy kiểm** (thay `<mã>_anh_tinh.mjs`, `<mã>_do_tu.mjs`… mỗi video từng chép riêng; KHÔNG chép script đo vào thư mục dựng):

```bash
scripts/hang_doi_ket_xuat.sh --nhanh <mã> node scripts/kiem_trang.mjs anh_tinh xuong_html/<mã>_<tên> --moi-cau --dau-chuong --tam
scripts/hang_doi_ket_xuat.sh --nhanh <mã> node scripts/kiem_trang.mjs anh_tinh xuong_html/<mã>_<tên> 12.5 40.2 --tam
```

`--tam` ghép 12 ảnh một tấm xem nhanh (`out/anh_tinh/<mã>_tam_NN.jpg`, nhãn tên ảnh và giây): xem tấm, chỉ mở ảnh 1920×1080 khi cần soi chữ nhỏ, dấu thanh. Lệnh kiểm lẻ: `node scripts/kiem_trang.mjs <quet_kiem|do_tu|do_hien|tuong_phan|uoc_dung> xuong_html/<mã>_<tên>`.

## 2. Quãng chờ dưới 5 phút

Bộ nhớ đệm ngữ cảnh của tác tử con chỉ giữ 5 phút: giữa hai lần gọi model mà quá 5 phút thì lượt sau phải ghi lại cả ngữ cảnh (lô 11: khoảng 0,9 USD mỗi video, do lượt viết trang 10–12 phút ở chặng B và lệnh chờ kết xuất 5–8 phút ở chặng C). Vì vậy:
- Chờ máy bằng lệnh chờ ở mục 1 (tối đa 270 giây mỗi lần). Không `sleep` dài, không vòng chờ tự viết, không ngồi đọc nhật ký.
- Lệnh chạy tại chỗ (không `--nen`) chỉ dùng cho việc 1–3 phút như file chặng ghi; việc lâu hơn gọi `--nen` rồi chờ bằng lệnh chờ. Mọi lệnh chạy tại chỗ (chuỗi giọng không `--nen`, `--chi-kiem-trang`, ảnh tĩnh qua hàng đợi) gọi qua công cụ Bash với `timeout: 300000`: lệnh bị Bash cắt ở 2 phút thì chuỗi máy ghi trạng thái "bị dừng giữa chừng".
- Mỗi lượt ghi file dưới khoảng 20 nghìn token (khoảng 60 KB mã); trang dài ghi theo từng chương (`chang_b.md` bước 2).

## 3. Quy tắc nội dung chung (gom từ các lô N166, N168–N180, N196–N205; ưu tiên hơn file cũ)

Phần riêng của kênh (độ dài, câu cuối, nguồn, từ điển đọc, nhạc, màu) ở file kênh.

- Mỗi số trên hình có hai nguồn độc lập (kiểm nguồn gốc của số, không đếm bài báo chép lại); số chỉ một nguồn giao kiểm theo skill `giao-antigravity-tra-cuu` (tối đa 1 phiếu mỗi video), không xác minh được thì không lên hình. Tác tử không có công cụ gọi skill: đọc thẳng `/Users/macbooktrungnt/.claude/skills/giao-antigravity-tra-cuu/SKILL.md` và làm theo.
- Cấm: tên, logo ngân hàng, công ty, hãng thẻ thật trên hình; quy chế, quy trình nội bộ MB, thư mục `RM MB/`; kho dữ liệu nhạy cảm; ví von. Số tiền ví dụ có nhãn "ví dụ giả định" (kho `nhan_gia_dinh`). Nhân vật "anh A", "chị B", "doanh nghiệp C", "ngân hàng X".
- VieNeu đọc sai ổn định, tránh khi viết `doc` (đổi từ khác cùng nghĩa): "vay"→"vai", "trả"→"trà", "mảng"→"mạng", "chiết khấu"→"chuyết khấu", "ngoài lãi", "thu lãi"→"…lại", "trả dần"→"trả dân", "két"→"kết", "có thẻ"→"có thể", "chi nhánh" đầu câu→"chỉ nhánh", "rà soát"→"ra soát", "kiều hối"→"kiểu hối", "hoá đơn"→"hoa đơn", "chung"→"trung", "chênh lệch"→"tranh lệch", "chào giá"→"trao giá", "tín phiếu"→"tin phiếu", "tín dụng"→"tiến dụng", "thứ cấp"→"thư cấp", "nghề"→"nghế". Từ chủ đề không tránh được ("vay", "tín dụng"): đặt ở giữa câu, không đứng một mình cuối câu.
- Hình: mỗi chương một ý, một hình chính chuyển động; chữ trên hình tối đa 12 tiếng mỗi khung (không tính phụ đề), không chép lời đọc lên hình; chữ hiện rõ ít nhất 1 giây; tương phản từ 4,5:1; chữ của bước đã qua ẩn hẳn (độ đục 0), không để mờ; hình phải có vật cho điều lời đang nói; không để khung gần trống quá 3 giây. Chống đứng hình ngay khi dựng: lớp hình của cảnh (không áp cho phụ đề, logo, màn hình kết) nhận `translate(5·sin(2πt/13) px, 3·sin(2πt/17) px) scale(1 + 0,005·(1 − cos(2πt/11)))`, gốc biến đổi `960px 450px` (mẫu: hàm `seek` của trang N204). Logo kênh và màn hình kết: tài sản kho `logo_ten_kenh` (cách gắn như trang N204).

## 4. File trạng thái chặng (`out/may/chang_a.md`, `chang_b.md`, `chang_c.md`), dưới 3 KB

```
# Chặng <A|B|C> — <MÃ> <tên> · xong <yyyy-mm-dd hh:mm>
- Đầu ra: <đường dẫn file chính, mỗi file một dòng ngắn>
- Số đo: <A: số chương, số câu, giây ước · B: vòng ảnh tĩnh, lỗi máy kiểm còn lại · C: độ dài, LUFS, lỗi soát sửa/giữ>
- Tổ hợp: MK · KB · CL · CT · BC · MAU · NH
- Đã tự quyết: <tối đa 5 dòng>
- Câu hỏi cho Trung: <hoặc "không">
- Danh sách phát đề nghị (chặng C): <mã danh sách theo file kênh, hoặc "không">
- Bài học kỹ thuật mới: <lỗi mới và cách gỡ, một dòng; hoặc "không">
- Chặng sau cần biết: <tối đa 6 dòng: chỗ dễ sai, lỗi còn lại, tài sản kho đã chép, câu lời đã đổi>
- Lệnh máy đã gọi: <lệnh, giờ>
- Commit: <mã>
```

Không chép nội dung kịch bản, nhật ký vào file này; chỉ đường dẫn và số.

## 5. Giới hạn

Không tải lên YouTube, Facebook. Không đổi tên thư mục. Không sửa `so_no_cong_viec.md`, `du_lieu/bang_video/viec_do.json`, danh sách phát, module, `scripts/` (chỉ GỌI các lệnh dùng chung), `tai_san/` (trừ thêm mục từ điển như chặng A và chép kho bằng `chep_kho.py` vào dự án mình), dự án video khác. Commit mới, không amend, không `git add -A`: chỉ đúng file mình tạo hoặc sửa; dòng cuối `Co-Authored-By: Claude <Opus 5.5|Sonnet 5.5> <noreply@anthropic.com>` theo model của mình. Không xoá file: file thừa chuyển vào Thùng rác (`trash`). Chỉ dừng tiến trình do mình chạy, theo PID. Không đọc khoá OAuth. Ổ dưới 15 GB thì dừng, ghi file chặng, báo. Hết hạn mức thì dừng, ghi file chặng.

Thêm từ khối quy tắc cố định của `07_khuon_prompt_va_kiem_chat_luong.md` mục 14 và từ lô 11:
- Mọi file tạm, script tạm, file đầu ra mang tiền tố mã video của mình (ví dụ `n221_do.py`): thư mục tạm dùng chung, tên trùng bị ghi đè; lệnh tắt tiến trình lọc theo tên trùng từng tắt nhầm lượt của video khác (lô 18 video, N22, N33).
- Không `pkill -f`, `killall` theo tên chung (`remotion`, `node`, `chrome`, `python`); PID của lệnh máy ghi trong file trạng thái `out/may/*.trang_thai.json`.
- Đo âm lượng, đứng hình bằng `xuong_thu_hyperframes/bin/ffmpeg` (có `ebur128`, `freezedetect`); ffmpeg kèm Remotion thiếu hai bộ lọc này.
- Lệnh máy có vẻ treo (lệnh chờ trả "chưa xong" mà bước trong file trạng thái không đổi quá 15 phút): không tắt tiến trình của lệnh máy, của video khác hay của phiên giữ lô; ghi file chặng, báo phiên giữ lô.
- Hook tự lưu cuối lượt của phiên giữ lô có thể đã gộp một phần file của mình vào commit "Tu dong luu": vẫn commit phần còn lại bằng commit mới, không `--amend`.
- File thừa dùng `trash` thay cho cách chuyển vào `_luu_tru/` của `AGENTS.md` quy ước chung 7, vì file thừa của tác tử là file tạm (lời giao lô 11 Trung đã dùng).
