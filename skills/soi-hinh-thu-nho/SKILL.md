---
name: soi-hinh-thu-nho
description: "Soi hình thu nhỏ của các video vượt trội trên YouTube Việt Nam để rút cách ghi chữ và chọn ảnh cho hình thu nhỏ của ba kênh Chuyện nghề Điện, Chuyện nghề Ngân hàng, Chuyện vĩ mô: tìm video theo từ khoá hoặc theo kênh bằng yt-dlp (không cần khoá API), tính độ vượt trội (lượt xem chia trung vị lượt xem của chính kênh), tải hình thu nhỏ, đọc chữ và đếm mặt người bằng Vision của macOS, so nhóm vượt trội với nhóm thường, ghép bảng ảnh để Claude xem rồi đề xuất bổ sung cho bảng công thức chữ và ảnh. Dùng khi Trung nói: soi hình thu nhỏ, soi thumbnail, video vượt trội, outlier YouTube, kênh khác làm hình thu nhỏ thế nào, đối thủ làm thumbnail ra sao, học hình thu nhỏ từ kênh X, cập nhật công thức hình thu nhỏ. KHÔNG dùng cho: dựng hình thu nhỏ cho một video (bang_phong_cach_hinh_thu_nho.md và cong_thuc_hinh_thu_nho.md), săn trend chủ đề (san-trend), viết tiêu đề và mô tả (viet-chu-dang-video)."
version: 1.0.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-28
  related_modules: [tai_san/so_tay_gu/cong_thuc_hinh_thu_nho.md, tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md]
  related_skills: [san-trend, viet-chu-dang-video]
---

# Soi hình thu nhỏ video vượt trội

Trung chốt đóng gói skill này ngày 28/10/2026 (bảng chọn). Kết quả dùng để cập nhật `tai_san/so_tay_gu/cong_thuc_hinh_thu_nho.md` (bảng kiểu chữ C, bảng kiểu ảnh A), không dùng để chép hình của kênh khác.

## Khi nào chạy

- Trước một lô video về chủ đề mới: soi theo từ khoá của chủ đề đó.
- Mỗi tháng một lượt theo ba nhóm kênh (`dien`, `ngan_hang`, `vi_mo` trong `scripts/tu_khoa.json`).
- Khi Trung muốn học từ một kênh cụ thể: soi theo kênh.

Chi phí: không tốn tiền, mỗi lượt khoảng 3–5 phút máy (khoảng 30 kết quả mỗi từ khoá, đo trung vị cho 100–190 kênh).

## Các bước

1. Chạy script từ gốc `Media/` (chạy nền vì lâu hơn 2 phút):

   ```bash
   python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten dien --nhom dien
   python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten mai_nha --tu "điện mặt trời mái nhà" --tu "lắp điện mặt trời" --so 50
   python3 skills/soi-hinh-thu-nho/scripts/soi.py --ten kenh_x --kenh https://www.youtube.com/@ten_kenh
   ```

2. Đọc `du_lieu/soi_hinh_thu_nho/<ngày>_<tên>/bang.md` (bảng so sánh hai nhóm và 40 video vượt trội nhất), rồi xem hai bảng ảnh `luoi_vuot_troi.jpg`, `luoi_thuong.jpg`.
3. Rút nhận xét theo hai câu hỏi của bảng công thức: chữ nào kéo người bấm mà vẫn dẫn vào nội dung; ảnh nào vừa đáng tin vừa gây chú ý. So với nhóm thường để loại kiểu chung của cả ngành. Gắn mã C, A hiện có; kiểu chưa có thì đề xuất mã mới.
4. Báo Trung: 3–5 nhận xét kèm số liệu và số thứ tự hình minh hoạ, đề xuất sửa bảng công thức. Trung duyệt qua bảng chọn mới sửa `cong_thuc_hinh_thu_nho.md` (tăng phiên bản, ghi ngày lượt soi).

## Cách tính và giới hạn

- **Độ vượt trội** = lượt xem của video chia trung vị lượt xem video thứ 31–100 của kênh. Bỏ 30 video mới nhất vì kênh báo đăng hàng chục video mỗi ngày, lượt xem video mới chưa đủ ngày (lần chạy đầu 28/10/2026 dùng 30 video mới nhất cho ra tỉ lệ 182.000 lần, sai). Cột phụ: lượt xem trên người đăng ký.
- Bỏ video dưới 120 giây (Shorts), phát trực tiếp, kênh có trung vị dưới 100 lượt xem hoặc dưới 1.000 người đăng ký.
- Đọc kênh không truyền `lang=vi` cho yt-dlp: với giao diện tiếng Việt yt-dlp không đọc được số người đăng ký.
- Kết quả tìm kiếm của YouTube đã nghiêng về video nhiều lượt xem; yt-dlp không trả ngày đăng ở chế độ nhanh nên video cũ có lợi thế; máy đọc chữ đếm cả logo, chữ nhỏ, nên số từ chỉ dùng để so hai nhóm. Vài chục video chỉ cho gợi ý, không phải kết luận.
- Trung vị kênh lưu ở `du_lieu/soi_hinh_thu_nho/_kenh.json`, dùng lại trong 7 ngày.

## File

- `scripts/soi.py`: tìm, đo, tải hình, ghép bảng, viết `bang.md`, `ket_qua.json`.
- `scripts/doc_hinh.swift`: đọc chữ (tiếng Việt, tiếng Anh) và đếm mặt người bằng Vision của macOS.
- `scripts/tu_khoa.json`: bộ từ khoá theo nhóm kênh, sửa tay được.
- Kết quả: `du_lieu/soi_hinh_thu_nho/` (ngoài git).
