---
name: lam-video-ba-chang
description: "Phiên giữ lô làm video ngang có giọng thuyết minh dựng bằng một trang HTML (cách làm LM-03, giọng VieNeu) theo cách ba chặng: mỗi video bốn tác tử con ngữ cảnh mới (ba-chang-kich-ban nguồn và kịch bản; ba-chang-dung dựng trang, ảnh tĩnh; ba-chang-soat soát độc lập; ba-chang-sua sửa, chữ đăng, hình thu nhỏ), bàn giao bằng file chặng dưới 3 KB, việc máy chạy nền bằng lệnh dùng chung (scripts/chuoi_giong.py, scripts/chuoi_ket_xuat.py, scripts/kiem_trang.mjs). Phiên giữ lô mở lô, rà trước, hỏi Trung một lượt, giao từng chặng, chờ máy, đọc file chặng, đo chi phí. Dùng khi Trung nói: làm lô video, làm video ba chặng, chạy lô video HTML, phiên giữ lô, chạy tiếp lô, làm tiếp N…, mở lô video mới, làm video Chuyện nghề Ngân hàng, làm video có giọng bằng HTML. KHÔNG dùng cho: dựng thử phong cách hoặc dựng một cảnh lẻ không giọng (skill dung-video-html); video Remotion LM-01, LM-02 (luồng ba pha ở 07_khuon_prompt_va_kiem_chat_luong.md mục 14); rà hình dùng chung trước lô (skill ra-soat-dung-chung, skill này gọi nó ở bước rà trước); chỉ viết chữ đăng (viet-chu-dang-video); tải lên YouTube, Facebook (dang-youtube, dang-facebook)."
version: 1.0.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-11-05
  related_skills: [dung-video-html, ra-soat-dung-chung, viet-chu-dang-video, toi-uu-phan-phoi]
  nguon: du_lieu/lo_giao_viec/vidmoi_thu_ba_chang_giao_viec.md (lời giao chạy thử 04/11/2026, mục 0 và 1–9 cũ)
---

# Làm video HTML có giọng theo cách ba chặng

Skill này dành cho **phiên giữ lô**: phiên Claude Code mở tại gốc `VideoNganHang/`, giữ một lô video (hoặc một video lẻ), giao từng chặng cho tác tử con, không tự dựng. Gói từ lời giao chạy thử ngày 04/11/2026 (`du_lieu/lo_giao_viec/vidmoi_thu_ba_chang_giao_viec.md`, nay chỉ còn phần riêng của lần thử và lô 11) và quyết định của Trung ngày 05/11/2026 (`~/Documents/Grok/Su dung grok/research/2026.11.04_chi_phi_video_ngan_hang/quyet_dinh_2026.11.05.md`).

**Vì sao làm cách này.** Cách cũ giao một tác tử Opus làm liền nguồn, kịch bản, giọng, dựng, sửa trong 140–220 lượt; ngữ cảnh lớn dần tới 540–780 nghìn token, mỗi lượt đọc lại cả ngữ cảnh đó: 52,6 USD quy đổi mỗi video (N201–N205). Cách ba chặng đo trên 10 video (N207, N210, N213, N214 và 6 video lô 11): 28,4 USD mỗi video ở lô 11, không video nào trượt soát. Bảng chi phí theo chặng: `05_cach_lam.md` mục 4.

## Mức suy luận, bộ nhớ đệm, file tác tử đọc

- Phiên giữ lô mở bằng **Opus 5.5 ở mức xhigh** (chọn trong app). Mức của tác tử đặt trong file tác tử `.claude/agents/ba-chang-*.md` (kịch bản xhigh, dựng high, soát xhigh, sửa high); không dùng max. Không đặt biến môi trường `CLAUDE_CODE_EFFORT_LEVEL`: biến này đè cả mức trong file tác tử. Định nghĩa tác tử chỉ nạp khi mở phiên: sửa file tác tử thì mở phiên giữ lô mới.
- Bộ nhớ đệm ngữ cảnh của tác tử con giữ 5 phút; của phiên giữ lô giữ 1 giờ. Mọi quãng chờ của tác tử con phải dưới 5 phút (`tham_chieu/quy_tac_chung.md` mục 2). Không bật bộ nhớ đệm 1 giờ cho tác tử con (`experimental.cacheTtl`): giá ghi 1 giờ gấp 1,6 lần giá ghi 5 phút, ở lô 11 sẽ đắt thêm khoảng 4,3 USD mỗi video để tránh 0,9 USD ghi lại.
- Bốn tác tử chạy với `omitClaudeMd: true`, không nạp AGENTS.md, CLAUDE.md; các quy tắc cần giữ đã chép vào `quy_tac_chung.md` mục 0. Không nạp skill này vào tác tử bằng trường `skills:` (ngữ cảnh mọi lượt sẽ lớn thêm). Mỗi tác tử chỉ đọc:

| File | Ai đọc | Nội dung |
|---|---|---|
| `tham_chieu/quy_tac_chung.md` | mọi tác tử | quy tắc lấy từ AGENTS.md và CLAUDE.md, lệnh máy dùng chung, lệnh chờ, quy tắc nội dung chung, file trạng thái chặng, giới hạn |
| `tham_chieu/chang_a.md` | `ba-chang-kich-ban` | nguồn, kịch bản, kiểm lời đọc, gọi chuỗi giọng |
| `tham_chieu/chang_b.md` | `ba-chang-dung` | sửa câu "nghe tai", dựng trang theo từng chương, ảnh tĩnh, máy kiểm, gọi chuỗi kết xuất |
| `tham_chieu/soat.md` | `ba-chang-soat` | soát chữ, hình, nhạc trên bản nháp |
| `tham_chieu/chang_c.md` | `ba-chang-sua` | sửa hết lời theo soát, giọng, máy kiểm, kết xuất một lần, chữ đăng, hình thu nhỏ |
| `kenh/<kênh>.md` | mọi tác tử, theo lời nhắn | khuôn kịch bản, khuôn trang, bảng màu, câu cuối, từ điển đọc, nhạc, danh sách phát. Hiện có `kenh/chuyen_nghe_ngan_hang.md`; kênh mới theo `kenh/README.md` |

## Luồng (phiên giữ lô làm theo)

| Bước | Ai | Việc | Kết thúc khi | Bàn giao |
|---|---|---|---|---|
| A | `ba-chang-kich-ban` (Opus 5.5), ngữ cảnh mới | nguồn, kịch bản, kiểm lời đọc, gọi chuỗi giọng chạy nền | đã gọi `chuoi_giong.py --nen` | `out/may/chang_a.md` |
| máy | `scripts/chuoi_giong.py` | sinh giọng, quét Whisper hai lề, đọc lại câu lệch | `out/may/giong.trang_thai.json` báo `xong` | `out/may/giong.bao_cao.md` |
| B | `ba-chang-dung` (Opus 5.5), ngữ cảnh mới | sửa lời câu "nghe tai", dựng trang, ảnh tĩnh, máy kiểm trang, gọi chuỗi kết xuất chạy nền | đã gọi `chuoi_ket_xuat.py --nen` | `out/may/chang_b.md` |
| máy | `scripts/chuoi_ket_xuat.py` | tạo nhịp, nối lại nhạc khi video dài hơn nhạc, kiểm trang, pha máy, đo, chép bản nháp, nghe mọi câu trên tiếng có nhạc | `out/may/ket_xuat.trang_thai.json` báo `xong` | `out/may/ket_xuat.bao_cao.md` |
| soát | `ba-chang-soat` (Opus 5.5), không dựng video này | soát chữ, hình (bảng ảnh pha máy, giây đầu chương), nhạc độc lập trên bản nháp; giọng do máy và chặng C | ghi xong file soát | `tai_nguyen/ban_nhap/<tên>_soat_doc_lap.md` |
| C | `ba-chang-sua` (Sonnet 5.5), ngữ cảnh mới | sửa hết lời theo danh sách soát, đọc lại giọng, máy kiểm, kết xuất một lần, chữ đăng, hình thu nhỏ, `nguon_goc.md`, danh sách mốc "nghe tai" | bản nháp mới, commit | `out/may/chang_c.md` |

`out/may/` là thư mục con của thư mục dựng `xuong_html/<mã>_<tên>/`, nằm ngoài git và ngoài dấu vân tay mã của pha máy (file máy ghi vào thư mục dựng ngoài `out/` làm pha máy kết xuất lại cả video; ảnh tĩnh cũng ghi vào `out/anh_tinh/`). Phiên giữ lô chỉ mở tác tử chặng sau khi file trạng thái máy báo `xong` (đọc file trạng thái, không đọc nhật ký). **Không soát lại sau khi sửa** (Trung chốt 04/11/2026): Trung tự nghe các mốc "nghe tai" trước khi duyệt. Lô chạy lần lượt từng video (Trung chốt 04/11/2026 tối): video sau chỉ mở chặng A khi video trước đã có bản nháp sau chặng C. Dừng ở bản nháp, không tải lên kênh.

Soát bằng Opus: ở lô 11, Sonnet sót lỗi vừa sai nội dung ở cả N216 và N217 (so song song, mục 5a của lời giao chạy thử). Muốn so lại thì giao thêm một tác tử `ba-chang-soat` với `model: sonnet`, ghi `<ngày>.<tên>_soat_doc_lap_sonnet.md`; chặng C chỉ dùng file của Opus.

## Các bước của phiên giữ lô

### 1. Mở lô

- Đọc file lô Trung chỉ (ví dụ `du_lieu/lo_giao_viec/vidmoi_thu_ba_chang_giao_viec.md` mục 0b cho lô 11) và sổ tiến độ lô (`du_lieu/lo_<…>_tien_do.md`). Lô mới chưa có file thì tạo `du_lieu/lo_giao_viec/<yyyy.mm.dd>.lo_<tên>.md`: danh sách video theo thứ tự (mã, thư mục sản phẩm, thư mục dựng `xuong_html/<mã>_<tên>/`, CL · CT · BC · MAU, khuôn kịch bản, khuôn trang, kênh) và các điểm Trung đã chốt. Phần riêng của lô nằm trong file lô, không ghi vào skill.
- Ghi một dòng vào sổ việc dở `du_lieu/bang_video/viec_do.json` (quy ước chung 8 của `AGENTS.md`), cập nhật sau mỗi video.
- Phiên giữ lô phải mở sau lần sửa file tác tử gần nhất. Không giao tiếp lô cho phiên giữ lô cũ: phiên đó còn giữ định nghĩa tác tử cũ.
- Kênh của lô chưa có file trong `kenh/`: làm theo `kenh/README.md` (lập file kênh, hỏi Trung trước khi chạy).
- Mỗi phiên giữ lô làm **tối đa 6 video**. Lô dài hơn: sau video thứ 6 ghi tiến độ vào sổ tiến độ lô, báo Trung mở phiên giữ lô mới với lệnh "dùng skill lam-video-ba-chang, chạy tiếp lô <tên> từ <mã>".
- Một phiên giữ lô một lúc (một mã video chỉ giao cho một phiên, `01_quy_trinh_chung.md` mục 7). Không chạy cùng lúc với lô Remotion ba pha (`07_khuon_prompt_va_kiem_chat_luong.md` mục 14): hai luồng dùng chung trình chạy `scripts/pha_may/` và hàng đợi kết xuất 2 chỗ dài. Chuỗi kết xuất báo "thuộc lượt đang chạy" thì chờ lượt đó xong rồi giao lại.

### 2. Rà trước, hỏi Trung một lượt

- Điều kiện máy: ổ còn từ 15 GB (`df -h ~`); không còn tiến trình `chuoi_giong`, `chuoi_ket_xuat`, `pha_may` của phiên khác (`ps`); `git status --porcelain` sạch hoặc chỉ có thay đổi đã biết chủ.
- Lô từ 3 video cùng chủ đề: chạy skill `ra-soat-dung-chung` trước khi giao chặng B của video đầu.
- Điểm phụ thuộc nguồn bên ngoài (tình trạng luật, văn bản sửa đổi, nguồn thứ hai) và các điểm "cần Trung quyết" của sổ nợ: gom vào một lượt bảng chọn, ghi kết quả và quyết định vào file rà trước của lô (mẫu: `du_lieu/lo_giao_viec/2026.11.04.ra_truoc_lo_11_video.md`). Lời nhắn giao chặng A chép dòng của video trong file đó.
- Báo chi phí trước khi chạy (quy tắc cứng 5 của `AGENTS.md`): ở lô 11 mỗi video khoảng 28,4 USD quy đổi, 1 giờ 45 phút tới 2 giờ từ chặng A tới bản nháp, máy chạy nền 10–15 phút.

### 3. Mỗi video

1. Giao `ba-chang-kich-ban` (chạy nền) bằng lời nhắn mẫu dưới.
2. Tác tử báo xong: đọc `out/may/chang_a.md`. Chờ chuỗi giọng bằng lệnh Bash chạy nền (`run_in_background`): `python3 -I scripts/chuoi_ket_xuat.py <thư mục dựng> <mã> --cho-giong --cho-giay 3300`; app gọi lại phiên khi lệnh xong. Mã thoát 3 thì chạy lại lệnh chờ; mã 1 thì đọc `out/may/giong.bao_cao.md` và nhật ký, báo Trung.
3. Giao `ba-chang-dung`. Xong: đọc `chang_b.md`, chờ chuỗi kết xuất bằng `--cho --cho-giay 3300` chạy nền như trên.
4. Giao `ba-chang-soat` (model Opus của file tác tử). Xong: đọc dòng kết luận và bảng lỗi nặng, vừa của file soát.
5. Giao `ba-chang-sua`. Xong: đọc `chang_c.md`; kiểm bản nháp có ở ngoài cùng thư mục sản phẩm.
6. Ghi tiến độ: sổ tiến độ lô, dòng sổ việc dở. Gom dòng "Bài học kỹ thuật mới" của ba file chặng; có bài học thì đề xuất Trung ghi vào `90_bai_hoc.md` (quy ước chung 5 của `AGENTS.md`: Trung duyệt mới ghi). Hook tự lưu cuối lượt của cây Grok (`git add -A`) chạy mỗi khi phiên giữ lô kết thúc lượt, kể cả lúc tác tử đang ghi, nên có thể có commit "Tu dong luu" chứa file dở của tác tử (ví dụ `360211cf6` ở N221); không mất dữ liệu. Liệt kê các commit đó trong báo cáo video (`git log --oneline <commit đầu chặng A>..HEAD`).
7. Ghi một dòng cho Trung: "Xong <mã>. Anh có thể gõ /compact lúc phiên đang chờ tác tử để nén ngữ cảnh phiên giữ lô; lô vẫn chạy tiếp, không cần nhắn thêm." Rồi mở video sau ngay, **không dừng lô** chờ Trung. Không bật ngưỡng tự nén (Trung chọn nén bằng tay ngày 20/09/2026). Trung nhắn "chạy tiếp" (sau khi nén hoặc khi phiên bị ngắt): đọc sổ tiến độ lô và file chặng của video đang làm trước; tác tử hoặc lệnh máy còn chạy thì chỉ chờ, không giao lại chặng đó.

Khi tác tử đang chạy, phiên giữ lô không sửa file trong VideoNganHang.

**Video lẻ có cửa duyệt** (quy tắc cứng 2 của `AGENTS.md`; không phải "làm một mạch", không phải chuỗi nhiều video): phiên giữ lô hỏi Trung lối viết (cửa chọn 1) trước chặng A; lời nhắn chặng A ghi "Dừng trước giọng", chặng A không gọi chuỗi giọng. Phiên giữ lô trình kịch bản cho Trung duyệt (cửa duyệt 1), hỏi tổ hợp dựng (cửa chọn 2); có chữ "duyệt" thì tự gọi chuỗi giọng (lệnh ở `quy_tac_chung.md` mục 1, có `--nen`), ghi tổ hợp vào lời nhắn chặng B rồi làm tiếp từ bước 2. Bản nháp vẫn qua cửa duyệt 2.

### Lời nhắn mẫu cho tác tử

```
Video <MÃ> <tên>. Kênh: skills/lam-video-ba-chang/kenh/chuyen_nghe_ngan_hang.md. File lô: du_lieu/lo_giao_viec/<file lô> (dòng <MÃ>).
Phần chung của lô: <mục của file lô mọi chặng A phải đọc, hoặc "không">
Thư mục sản phẩm: san_pham/<thư mục>/ · thư mục dựng: xuong_html/<mã>_<tên>/
Lối viết: KB-xx (video lẻ: mã Trung chọn ở cửa chọn 1) · Tổ hợp: CL-xx · CT1 · BC-xx · MAU-xx · khuôn kịch bản <mã mẫu> · khuôn trang xuong_html/<khuôn>/
Điểm Trung đã chốt: <chép dòng của video trong file rà trước, hoặc "không">
[chặng A, video lẻ có cửa duyệt: Dừng trước giọng.]
[soát: ghi file tai_nguyen/ban_nhap/<ngày>.<tên>_soat_doc_lap.md]
```

Tác tử tự đọc file của mình theo file tác tử; lời nhắn không chép quy tắc.

## Đo chi phí

Nhật ký: `~/.claude/projects/-Users-macbooktrungnt-Documents-VideoNganHang/<id phiên giữ lô>/subagents/agent-*.jsonl`, mỗi tác tử một chặng (loại tác tử ghi trong `agent-*.meta.json` giúp gán chặng). Ngữ cảnh khởi đầu mỗi loại tác tử là lượt gọi model đầu trong `agent-*.jsonl`; mức suy luận thật ở trường `effortValue` của `agent-*.prefix.json`. Quy đổi USD bằng `chi_phi.py`, `do_ba_chang.py` ở `~/Documents/Grok/Su dung grok/research/2026.11.04_chi_phi_video_ngan_hang/`; so với mốc lô 11 (28,4 USD mỗi video: A 5,5 · B 10,1 · soát 5,1 · C 5,1 · phần chung 2,7) và mốc cũ N201–N205 (52,6), số lượt và ngữ cảnh bình quân mỗi tác tử, số lỗi soát. Kết quả ghi `ket_qua_thu_ba_chang.md` cùng thư mục research.

## Ngoài phạm vi

- Kênh Chuyện nghề Điện dựng bằng Remotion: chưa áp cách này, chưa có lệnh kết xuất Remotion trong chuỗi; `kenh/README.md` để sẵn chỗ cho file khuôn kênh.
- Thư viện cảnh dựng sẵn có tham số cho chặng B: làm sau khi có số đo của bốn việc tối ưu ngày 05/11/2026.
- Tải lên YouTube, Facebook: skill `dang-youtube`, `dang-facebook`, sau khi Trung duyệt bản nháp.
