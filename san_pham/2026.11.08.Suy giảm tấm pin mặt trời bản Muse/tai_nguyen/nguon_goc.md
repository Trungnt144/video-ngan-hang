# Nguồn gốc: dựng lại video pin mặt trời bằng ảnh nền Muse (video thử luồng Claude–Muse)

> Lập 08/11/2026. **Trạng thái: chờ Muse tạo ảnh** (phiếu đặt hình đã gửi). Video thử đầu tiên của luồng Claude–Muse theo quyết định của Trung ngày 07/11/2026 (báo cáo `~/Documents/Grok/Su dung grok/san_pham/2026.11.07.luong_claude_muse_lam_video_v1.md`).

| Mục | Ở đâu |
|---|---|
| Video gốc | Media, `san_pham/2026.10.28.Những nguyên nhân nào làm suy giảm chất lượng tấm pin mặt trời/` (kênh Chuyện nghề Điện, bản Claude 28/10/2026, Remotion `xuong_dai/bon_kieu_suy_giam/`); YouTube https://youtu.be/MesdtBmUoKE |
| Kịch bản | `tai_nguyen/kich_ban/2026.10.28.bon_kieu_suy_giam_v2.chuong.json`, chép nguyên từ Media (commit Media `9f45f8cb5`), không sửa lời; nguồn kiểm chứng vẫn ở Media (`..._v2.nguon_kiem_chung.md`) |
| Thư mục dựng | `xuong_html/pin_mat_troi/`: `phieu_dat_hinh.json` (phiếu cho Muse), `phan_canh.md` (phân cảnh theo câu), `trang.html` + `canh.js` (khuôn trang ảnh nền, dòng thời gian thử 16 giây, chưa có giọng), `nen/` ảnh nền (ngoài git), `out/khung_bo_cuc/` khung xám (ngoài git, sinh lại bằng `node scripts/khung_bo_cuc.mjs xuong_html/pin_mat_troi`) |
| Ảnh Muse dùng lại | `hero.webp` (bộ 07/11/2026), cắt 1920×1080 từ y=40, cho chương 1 và 9 |
| Ảnh Muse cần làm | `nen_mat_cat`: một tấm gốc mặt cắt tấm pin và bốn biến thể cùng góc máy (nguyên vẹn, ngả nóng, mép khung xanh điện, kính ánh tím) |
| Drive | thư mục "Muse-Claude": `01_Mac_gui_Muse/pin_mat_troi/` (Claude gửi), `02_Muse_gui_Mac/pin_mat_troi/` (Muse gửi) |

Chưa chốt: giọng (Media dùng Hải Đăng cho video gốc; `AGENTS.md` của VideoNganHang chỉ cho Quốc Tuấn), kênh đăng bản dựng lại.
