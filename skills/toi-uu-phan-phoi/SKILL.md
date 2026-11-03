---
name: toi-uu-phan-phoi
description: "Tối ưu để YouTube (video dài và Shorts), TikTok, Facebook Reels ưu tiên hiển thị video của Media, theo bốn phần. (A) Tham gia khâu làm video: yêu cầu phân phối áp vào từng bước của quy trình 10 bước (từ khoá chính, câu mở 3 giây, chương đứng riêng để cắt bản dọc, nhạc có giấy phép mọi nền tảng, thông số xuất từng nơi đăng). (B) Kiểm khi đăng: script đo file từng bản bằng ffprobe so với giới hạn nền tảng (Facebook qua API 3–90 giây, Shorts tối đa 3 phút, TikTok 23–60 khung/giây…), kiểm chữ đăng, chỉ chỗ bật nhãn AI, in việc làm tay. (C) Tự cập nhật: đọc lại trang chính thức khi giới hạn quá 90 ngày hoặc nền tảng đổi, sửa khối số, giao Antigravity kiểm ý mới. (D) Học qua từng lần dùng: ghi sổ mỗi lần kiểm, ghép số liệu YouTube sau 7 và 28 ngày, rút bài học khi đủ 10 video công khai. Bảng 17 tiêu chí có mức tin cậy (chính thức, kinh nghiệm, lời đồn). Dùng khi Trung nói: tối ưu phân phối, tiêu chí YouTube ưu tiên, thuật toán YouTube, thuật toán TikTok, thuật toán Facebook, video được đề xuất, chuẩn đăng Facebook, chuẩn đăng TikTok, kiểm video trước khi đăng, video đã đúng chuẩn chưa, giờ đăng, mấy video một ngày, tần suất đăng, làm video cũ được xem lại, Shorts liên kết video dài, học từ số liệu kênh. KHÔNG dùng cho: viết tiêu đề, mô tả, hashtag (viet-chu-dang-video), tải lên (dang-youtube, dang-facebook), săn chủ đề và từ khoá (san-trend), hình thu nhỏ (cong_thuc_hinh_thu_nho.md)."
---

# Tối ưu phân phối video

Lập 29/10/2026 (Trung chốt qua bảng chọn: skill mới, cả bốn nơi đăng, có phần tham gia khâu làm video, kiểm khi đăng, tự cập nhật và học qua từng lần dùng).

## File trong skill

| File | Nội dung |
|---|---|
| `tieu_chi_nen_tang.md` | 17 tiêu chí, mỗi ý có mức tin (CT chính thức, KN kinh nghiệm, SAI lời đồn), URL, ngày đọc; mục 4 là khối số cho script |
| `yeu_cau_khi_lam.md` | Yêu cầu phân phối theo từng bước của `01_quy_trinh_chung.md` |
| `bai_hoc.md` | Bài học rút từ số liệu (chờ Trung duyệt) và nhật ký cập nhật nguồn |
| `scripts/kiem_dang.py` | Kiểm một thư mục video trước khi đăng; ghi sổ `du_lieu/toi_uu_phan_phoi/so_lan_dung.jsonl` |
| `scripts/doi_chieu_nguon.py` | Tải lại trang nguồn, tìm câu trích của khối số |
| `scripts/hoc_ket_qua.py` | Ghép số liệu YouTube với đặc điểm lúc làm; ghi `du_lieu/toi_uu_phan_phoi/so_ket_qua.jsonl` |

Giới hạn chữ đăng (tiêu đề, mô tả, thẻ, hashtag) chỉ nằm ở `skills/viet-chu-dang-video/quy_dinh_nen_tang.md`; skill này không chép lại.

## A. Tham gia khâu làm video

Áp tự động trong mọi phiên làm video, không chờ Trung nhắc. Ở mỗi bước của quy trình 10 bước, đọc đúng phần tương ứng trong `yeu_cau_khi_lam.md`:

| Bước quy trình | Phần cần đọc | Việc chính |
|---|---|---|
| 0–1 làm rõ, nguồn | "Bước 0–1" | Chốt nơi đăng; ghi `Từ khoá chính:` ở đầu kịch bản |
| 3 kịch bản | "Bước 3" | Câu mở 3 giây có từ khoá; chương đứng riêng; đoạn dọc 30–60 giây có câu cuối dẫn về video đầy đủ |
| 4–5 tổ hợp, dựng | "Bước 4–5" | Không lặp nhạc và kiểu hình; phụ đề cứng bản dọc; vùng an toàn; ghi loại cảnh vào `nguon_goc.md` |
| 6–7 xuất | "Bước 6–7" | Thông số từng nơi đăng; chạy `kiem_dang.py` sau bản cuối |
| 8 chuẩn bị đăng | "Bước 8" | `kiem_dang.py` lần cuối; giờ đăng; rải lô |
| 9 và sau đăng | "Sau khi đăng" | Video liên quan cho Shorts; Test & Compare; `hoc_ket_qua.py` |

Khi Trung hỏi chung ("YouTube ưu tiên gì", "giờ nào đăng"): trả lời từ `tieu_chi_nen_tang.md`, nói rõ mức tin của từng ý, không trình bày ý KN như quy định.

## B. Kiểm khi đăng

```bash
python3 -I skills/toi-uu-phan-phoi/scripts/kiem_dang.py san_pham/<thư mục video>
```

Script tìm bản từng nơi đăng theo tên file (`_shorts_`, `_tiktok_`, `_reels_`; bản dọc `_shorts_` dùng thay khi thiếu bản TikTok, Facebook), đo bằng ffprobe (`xuong_thu_hyperframes/bin/ffprobe` khi máy không có ffprobe chung), so với khối số, gọi `kiem_chu_dang.py` khi có file chữ đăng, đọc `nguon_goc.md` và kịch bản để chỉ chỗ bật nhãn AI, in danh sách việc làm tay. Mã thoát 1 khi có LỖI.

1. Hết LỖI mới chuyển sang skill tải lên. LỖI về độ dài Facebook (trên 90 giây): cắt bản dọc hoặc báo Trung đăng tay trong ứng dụng.
2. NHẮC: xử lý hoặc ghi lý do bỏ qua trong báo cáo cho Trung.
3. Việc làm tay: chép vào báo cáo cuối lượt để Trung làm trong YouTube Studio, TikTok Studio, Meta Business Suite.
4. Skill `dang-youtube`, `dang-facebook` gọi bước này trước khi tải (mục "Trước khi tải" của mỗi skill).

## C. Tự cập nhật theo nền tảng

**Khi nào chạy:** `kiem_dang.py` báo giới hạn quá 90 ngày; nền tảng từ chối file hoặc báo lỗi mới khi tải; Trung báo tin nền tảng đổi cách đề xuất; mỗi lần chạy `san-trend` khung quý.

1. `python3 -I skills/toi-uu-phan-phoi/scripts/doi_chieu_nguon.py`. Dòng MẤT: mở trang, tìm câu mới; dòng MỞ TAY: mở bằng trình duyệt trong app (`javascript_tool` đọc `document.body.innerText`), tìm câu chứa số.
2. **Claude tự sửa, không cần hỏi** khi nguồn là trang chính thức (CT): sửa số trong khối `gioi_han_video`, câu trích, ngày đọc, và ý tương ứng ở mục 2 của `tieu_chi_nen_tang.md`; ghi một dòng vào `bai_hoc.md` mục 2; báo Trung một dòng.
3. **Hỏi Trung bằng bảng chọn** khi thay đổi đụng quy ước của xưởng (số hashtag, độ dài mặc định, giờ đăng cố định) hoặc khi chỉ có nguồn KN.
4. Ý mới chỉ có nguồn KN mà sắp đưa vào yêu cầu bắt buộc: giao Antigravity kiểm theo skill `giao-antigravity-tra-cuu` (tối đa 3 phiếu tự giao mỗi phiên), dùng kết quả `dat` để nâng lên CT.
5. Nền tảng từ chối một file vì lý do chưa có trong khối số: thêm dòng giới hạn mới kèm URL, câu trích.
6. Commit `skills/toi-uu-phan-phoi/` sau mỗi lần sửa.

## D. Học qua từng lần dùng

1. Mỗi lần chạy `kiem_dang.py` ghi một dòng vào `so_lan_dung.jsonl` (thông số từng bản, số lỗi, nhãn AI).
2. Video đã công khai 7 ngày và 28 ngày: `python3 -I skills/toi-uu-phan-phoi/scripts/hoc_ket_qua.py`. Số liệu lấy từ file bảng video tự làm mới (`du_lieu/bang_video/so_lieu_youtube.json`); số cũ hơn 1 ngày thì bấm "Cập nhật số liệu" trên thẻ chiến dịch trước.
3. Dưới 10 video công khai: chỉ ghi số, không rút bài học (script tự in câu nhắc).
4. Từ 10 video công khai: so nhóm theo một đặc điểm mỗi lần (độ dài, công thức và bố cục hình thu nhỏ, kiểu tiêu đề câu hỏi / con số / liệt kê, số ký tự tiêu đề, ngày trong tuần, giờ đăng), dùng trung vị lượt xem và, khi có YouTube Analytics, thời lượng xem trung bình. Chênh lệch dưới 30% hoặc nhóm dưới 5 video thì ghi "chưa kết luận".
5. Bài học ghi vào `bai_hoc.md` mục 1 với trạng thái "đề xuất". Trung duyệt thì chuyển vào đúng chỗ (`yeu_cau_khi_lam.md`, `cong_thuc_hinh_thu_nho.md`, module liên quan), tăng phiên bản, đổi trạng thái thành "đã áp".
6. Lỗi gặp khi đăng (nền tảng từ chối, video bị hạn chế, nhãn AI bị gắn tay) ghi `bai_hoc.md` mục 1 ngay, kể cả khi chưa đủ 10 video.

## Giới hạn hiện có (29/10/2026)

- Chưa video nào công khai: phần D chưa có số để học.
- TikTok chưa có công cụ đăng; số liệu Facebook, TikTok chưa vào bảng video (sổ nợ N136). Phần D hiện chỉ học từ YouTube.
- TikTok chưa có hướng dẫn chính thức về ảnh bìa, giờ đăng, tần suất; các ý đó giữ mức KN.
- Ô "Video liên quan" của Shorts và Test & Compare không làm được qua API: luôn là việc tay.
