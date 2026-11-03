# Quy tắc chiến dịch Chuyện nghề Ngân hàng

> Trích nguyên văn từ project Media (Grok), trạng thái 03/11/2026, để project này làm được video cùng chuẩn với 13 video làm bằng Claude ngày 29/10–02/11/2026. Quy tắc nào Trung chốt thêm thì ghi tiếp ở mục 4, không sửa mục 1–3. Đường dẫn trong các khối trích đã đổi sang project này.

## 1. Khối quy ước loạt thuật ngữ ngân hàng (sổ nợ công việc, Trung chốt 28/10/2026)

> **Loạt video giải thích thuật ngữ ngân hàng (mở 28/10/2026, Trung chốt qua bảng chọn cùng ngày):** người xem là người mới vào nghề ngân hàng và người đi vay ngân hàng; mục tiêu hiểu chi tiết, cặn kẽ từng thuật ngữ. Loạt này là ngoại lệ của mặc định "bỏ nội dung tài chính, ngân hàng" ở khối trên. Những điểm đã chốt:
> 1. **Kênh đăng:** kênh YouTube mới riêng về tài chính, ngân hàng (Trung tự tạo); không đăng lên kênh Chuyện nghề Điện. Trước khi đăng phải cấp khoá OAuth mới cho skill `dang-youtube` đúng kênh mới.
> 2. **Danh sách thuật ngữ:** Trung gửi dần từng thuật ngữ; mỗi thuật ngữ ghi một mục N riêng dưới khối này, trạng thái "Đang chờ lệnh chạy". KHÔNG tự chạy khi đủ 2–3 mục (Trung đổi 28/10/2026): chỉ ghi nợ, chờ Trung ra lệnh rồi chạy một lượt mọi mục đang chờ của loạt này. Khi chạy, báo chi phí trước (quy tắc cứng 5) và chia lô 2–3 video theo nhóm thuật ngữ liên quan. Claude không tự lập danh mục. Thuật ngữ mới cần khái niệm của video trước thì ghi ở dòng "Trùng với video đã làm".
> 3. **Độ dài:** mỗi video một thuật ngữ hoặc một cặp hay bị nhầm, 4–6 phút, khổ ngang 1920×1080 có thuyết minh; có ví dụ tính tiền bằng số giả định. Làm một mạch như mặc định của phiên.
> 4. **Nguồn:** căn cứ văn bản pháp luật công khai (Luật Các tổ chức tín dụng 2024, thông tư của Ngân hàng Nhà nước còn hiệu lực, tra bản mới nhất và ghi số hiệu lên hình), ví dụ số giả định, cộng tình huống thực tế từ kinh nghiệm nghề của Trung. Tình huống Trung kể phải ẩn danh hoàn toàn trước khi vào kịch bản: không tên, mã số thuế, địa danh cụ thể, số tiền thật của khách hàng. Không dùng quy chế, quy trình nội bộ MB (`RM MB/tai_san/`) làm nguồn; không tên, không nhận diện thương hiệu MB hay ngân hàng nào trên hình (`13_ban_quyen_va_bao_mat.md`). Tình huống thực tế (đổi 28/10/2026): kịch bản viết trước bằng số giả định, không chờ; đầu mỗi lô gửi Trung một lần danh sách câu hỏi tình huống cho các video trong lô; Trung gửi lúc nào chèn lúc đó, chậm nhất trước bước đọc giọng.
>
> **Quy tắc triển khai loạt (Trung đặt 28/10/2026, chốt chi tiết qua bảng chọn cùng ngày; kế hoạch đầy đủ ở `san_pham/2026.10.28.loat_thuat_ngu_ngan_hang/tai_nguyen/kich_ban/2026.10.28.ke_hoach_loat_thuat_ngu_ngan_hang.md`):**
> 5. **Giọng:** cả loạt đọc bằng VieNeu giọng **Quốc Tuấn** (`--giong "Quốc Tuấn"`; nam miền Bắc, kéo ×1,26, sai 2,0% trên đoạn thử 27/10/2026), không dùng Hải Đăng. Tốc độ giữ 5,95 âm tiết mỗi giây.
> 6. **Phong cách:** chọn tổ hợp dựng theo tính chất từng video và đa dạng hoá: dùng cả 16 chất liệu hình (kể cả CL-09…CL-16 dựng bằng HTML), hai video liền nhau trong một lô không cùng chất liệu, mỗi video khác 3 video gần nhất ở ít nhất hai trục (`04_he_truc_dung.md` mục 6). Chất liệu tạm cho từng video ghi trong file kế hoạch; chốt bằng `scripts/goi_y_to_hop_dung.py` lúc chạy.
> 7. **AI trước, máy sau:** pha 1 (AI: nguồn, kịch bản, giọng, mã dựng, ảnh tĩnh, phiếu việc máy) làm xong cho cả lô rồi mới chạy pha 2 (máy kết xuất) khi Trung ra lệnh "chạy pha máy" (`07_khuon_prompt_va_kiem_chat_luong.md` mục 14). Trình chạy pha máy hiện chỉ nhận Remotion ngang: một phiên riêng mở rộng `scripts/pha_may/` cho video HTML (LM-03), chạy song song với pha 1.
> 8. **Song song:** phiên điều phối lập kế hoạch, giao mỗi phần cho một phiên mới đọc file kế hoạch (không dùng phiên Fork vì phiên ghi nợ quá dài), các phiên chạy song song; việc độc lập thì không chờ câu trả lời của Trung. Máy chỉ chạy tối đa 3 video cùng lúc ở các bước đọc giọng và ảnh tĩnh (giới hạn RAM).
> 9. **Quy mô:** lô đầu 12 video (cho vay, tài sản bảo đảm, nợ xấu, tiền gửi); Trung xem bản nháp lô đầu rồi mới mở các lô sau.
> 10. **Nội dung đã chốt:** mười video có so sánh ngân hàng (N89, N103, N104, N111, N114, N121, N123, N124, N131, N132) chỉ nói theo nhóm, số công khai dạng khoảng, không nêu tên; N115 và N116 chuyển vào loạt này; N93 giữ riêng, làm sau N94; N92 hiểu TTR là chuyển tiền bằng điện (T/T); N110 làm cuối loạt; N135 thêm bản giải ngân cho doanh nghiệp; N86 viết cho người gửi tiền và người vay phổ thông, N101, N118, N132, N133 viết cho người mới vào nghề, mỗi video có một đoạn "ảnh hưởng tới lãi vay của bạn thế nào".

## 2. Quy tắc chung cho mọi video của loạt (kế hoạch loạt 28/10/2026 và các chốt sau)

## 1. Quy tắc chung cho mọi phiên

| Điểm | Nội dung |
|---|---|
| Người xem | Người mới vào nghề ngân hàng và người đi vay. Video N86 viết cho người gửi tiền và người vay phổ thông; N101, N118, N132, N133 viết cho người mới vào nghề, mỗi video có một đoạn "điều này ảnh hưởng tới lãi vay của bạn thế nào" |
| Khổ, độ dài | Ngang 1920×1080 có thuyết minh, 4–6 phút, một thuật ngữ hoặc một cặp hay bị nhầm; có ví dụ tính tiền bằng số giả định |
| Giọng | VieNeu giọng **Quốc Tuấn** (`--giong "Quốc Tuấn"`), tốc độ 5,95 âm tiết mỗi giây (giữ nguyên khoá trong `tai_san/cau_hinh_giong.json`). Không dùng Hải Đăng |
| Cách đọc thuật ngữ | Trung chốt 30/10/2026 qua bảng chọn. Chữ viết tắt và chữ tiếng Anh trong lời đọc (trường `doc` của `.chuong.json`) đọc theo từ điển `tai_san/giong_doc/tu_dien_doc/ngan_hang.json` (ví dụ CIC xi-ai-xi, LTV eo-ti-vi, L/C eo-xi, COF cốt ợp phăn, CASA ca-sa, hedging hét-chinh); năm trong số hiệu văn bản đọc gọn "hai nghìn hai mươi tư". Trước khi đọc giọng chạy `python3 -I scripts/kiem_loi_doc.py <file .chuong.json>`, phải 0 lỗi. Chữ mới chưa có trong từ điển thì thêm vào từ điển trước (hỏi Trung nếu chưa rõ). Video đã có bản nháp, bản cuối: chỉ sửa chỗ đọc sai hẳn, cách đọc chỉ khác kiểu thì giữ. |
| Lối viết, tổ hợp dựng | Làm một mạch: Claude tự chọn, ghi mã và lý do ở đầu kịch bản. Chọn theo tính chất từng video, đa dạng hoá: hai video liền nhau trong một lô không cùng chất liệu hình; mỗi video khác 3 video gần nhất ở ít nhất hai trục (`04_he_truc_dung.md` mục 6). Chất liệu ở mục 4 là đề xuất tạm; chốt bằng `python3 scripts/goi_y_to_hop_dung.py --kho ngang --linh-vuc <...> --do-dai <giây>` |
| Nguồn | Văn bản pháp luật công khai còn hiệu lực (tra bản mới nhất, ghi số hiệu lên hình); số chỉ có một nguồn không đưa lên hình (quy tắc cứng 3) |
| Bảo mật | Không dùng `RM MB/tai_san/` hay bất kỳ quy chế, quy trình nội bộ MB nào. Không tên, logo của MB hay ngân hàng nào. Màu: được dùng bộ màu lấy theo ngân hàng thật, kể cả MB, làm màu nền chung (Trung chốt 29/10/2026, kế hoạch chạy đêm 29/10 mục 1). Video so sánh ngân hàng (N89, N103, N104, N111, N114, N121, N123, N124, N131, N132) chỉ nói theo nhóm: ngân hàng nhà nước nắm cổ phần chi phối, cổ phần lớn, cổ phần vừa và nhỏ; số công khai trình bày dạng khoảng của nhóm. Không dùng khẩu vị tín dụng, FTP, mô hình phê duyệt, khung chức danh, lương, hệ thống, vụ việc nội bộ chưa công bố của MB |
| Tình huống thực tế | Kịch bản viết trước bằng số giả định, không chờ. Đầu lô phiên điều phối gửi Trung một lần danh sách câu hỏi tình huống. Trung gửi lúc nào chèn lúc đó, chậm nhất trước bước đọc giọng. Tình huống phải ẩn danh hoàn toàn: không tên, mã số thuế, địa danh cụ thể, số tiền thật |
| Tránh lặp | Khái niệm đã có video riêng chỉ nhắc một câu. Lời đọc KHÔNG trỏ sang video khác (Trung chốt 29/10/2026, giữ module 03 mục 5.1); việc trỏ đặt ở mô tả YouTube, màn hình kết và thẻ gợi ý video. Dòng "Trùng với video đã làm" của từng mục sổ nợ ghi rõ trỏ đi đâu |
| Câu kêu gọi cuối video | Trung chốt 30/10/2026 qua bảng chọn, áp cho video **làm từ nay** (video chưa kết xuất pha máy; video đã có bản nháp hoặc bản cuối giữ nguyên). Câu cuối cùng của lời đọc là: "Đăng ký kênh Chuyện nghề Ngân hàng để biết thêm nhiều nội dung thú vị về ngân hàng và đi vay." Câu này đọc bằng giọng Quốc Tuấn như các câu khác, ghi vào chương cuối của kịch bản và `.chuong.json`. Màn hình kết 10 giây (`KHO.man_hinh_ket_kenh`, chữ mặc định "Đăng ký kênh") bắt đầu (`vao`) đúng lúc câu này bắt đầu, để giọng và chữ hiện cùng lúc. Câu kêu gọi không tính là trỏ sang video khác. |
| Tên, mô tả, hình thu nhỏ | Trung chốt 30/10/2026. **Video làm mới:** phiên làm video tự làm luôn ba thứ này ngay khi giao bản nháp, không chờ việc riêng: tiêu đề và mô tả theo quy tắc kênh Ngân hàng của skill `viet-chu-dang-video` (ghi `tai_nguyen/dang_bai/youtube.md`, `facebook.md`), rồi hình thu nhỏ theo `tai_san/so_tay_gu/bang_phong_cach_hinh_thu_nho.md` mục 0b với chữ trên hình khớp tiêu đề vừa viết; **mỗi video một hình, tự xuất vào thư mục video, không dựng hai phương án** (Trung chốt 30/10/2026 chiều). **Video đã có trước ngày này:** làm theo thứ tự, video nào xong tên và mô tả thì phiên điều phối giao làm hình thu nhỏ cho video đó. |
| Tiêu đề, mô tả, chữ đăng | Trung chốt 30/10/2026 qua bảng chọn: theo `skills/viet-chu-dang-video/quy_tac_kenh_ngan_hang.md` (thuật ngữ đầu câu theo 3 mẫu, chữ viết tắt đứng trước gạch nối, một tiêu đề chính và một dự phòng duyệt theo lô, mô tả 50–70 từ có 5–8 mốc chương, không nêu văn bản pháp luật, hashtag kết thúc `#nganhang #chuyennghenganhang`, chữ dòng 1 hình thu nhỏ là thuật ngữ đầu tiêu đề). Thứ tự: tiêu đề cả loạt trước, mô tả khi có bản cuối; chỉ làm khi Trung bảo |
| Kênh đăng | Kênh YouTube tài chính, ngân hàng mới Trung tự tạo. Trước khi đăng phải cấp khoá OAuth mới cho skill `dang-youtube` đúng kênh đó. Không đăng lên kênh Chuyện nghề Điện |
| Thư mục | Mỗi video một thư mục `san_pham/yyyy.mm.dd.<chủ_đề>/` theo `san_pham/README.md`; mã dựng ở `xuong_dai/<tên>/` (Remotion) hoặc `xuong_html/<tên>/` (HTML). Mã video dùng mã sổ nợ viết thường (`n81`) làm tiền tố mọi file tạm và file đầu ra |

## 2. Luồng: AI trước, máy sau

Mọi lô chạy theo `07_khuon_prompt_va_kiem_chat_luong.md` mục 14 (ba pha AI → máy → AI).

1. **Pha 1 — AI.** Nguồn và kiểm chứng, kịch bản, đọc giọng Quốc Tuấn, mã dựng, ảnh tĩnh mọi chương qua chỗ nhanh của hàng đợi (`scripts/hang_doi_ket_xuat.sh --nhanh`), tự soát theo thanh chất lượng mục 9, ảnh lưới 3–4 khung mỗi video. Không kết xuất video ở pha này.
2. **Cửa duyệt ảnh tĩnh.** Trung duyệt ảnh lưới của cả lô một lần. Có chữ "duyệt" mới ghi phiếu việc máy.
3. **Pha 2 — máy.** Chạy khi Trung ra lệnh "chạy pha máy": `node scripts/pha_may/pha_may.mjs chay`.
4. **Pha 3 — AI.** Đọc báo cáo pha máy, sửa đúng chương lỗi, chạy lại pha 2 cho chương đó; đạt thì ra bản `_nhap`, sang cửa duyệt bản nháp.

Trình chạy pha máy hiện chỉ nhận dự án Remotion ngang có `src/thoi_gian.json`. Video dựng bằng HTML (CL-09…CL-16) cần phiên công cụ ở mục 3 làm xong trước khi chạy pha 2; trong lúc chờ, video HTML vẫn làm hết pha 1.

## 3. Quy tắc chốt ngày 30/10/2026 (áp cho mọi video)

## 2. Quy tắc đã chốt trong ngày 30/10/2026 (áp cho mọi video)

| Quy tắc | Nội dung |
|---|---|
| Tự quyết theo luật cũ | Điểm đã có quy định hoặc tiền lệ thì tự chọn phương án khuyến nghị, ghi vào tiến độ (đã chọn gì, vì sao, đổi lại bằng cách nào). Chỉ hỏi Trung điểm thật sự mới (nội dung nhạy cảm, đổi hướng video). Đêm nay Trung ngủ: điểm thật sự mới thì ghi vào tiến độ, làm phần không phụ thuộc, sang video kế tiếp |
| Tốc độ nói | Video mới (chưa có giọng đủ hoặc chưa có mốc): 5,06 âm tiết mỗi giây, script tự đọc từ `tai_san/cau_hinh_giong.json`. Video đã căn nhịp: giữ 5,95; đọc lại câu, chương của video đó BẮT BUỘC truyền `--he-so-keo` của chương cũ |
| Giọng | VieNeu Quốc Tuấn (`--giong "Quốc Tuấn"`) |
| Kiểm chứng | Số và văn bản pháp luật phải có hai nguồn khớp; phiên tự tra (WebSearch, WebFetch, skill giao-antigravity-tra-cuu), không chuyển cho Trung. Văn bản ngoại hối, thanh toán cũ có thể đã bị thay (Nghị định 69/2018 bị Nghị định 292/2026 thay từ 05/09/2026) |
| Bảo mật | Không quy chế, quy trình nội bộ MB; không tên, logo ngân hàng thật trên hình; số tiền ghi "ví dụ giả định"; N102, N104, N111 chỉ kiến thức chung công khai. Video so sánh ngân hàng (N89, N103, N104, N111, N114, N121, N123, N124, N131, N132, N151) chỉ nói theo nhóm, không tô một nhóm bằng màu một ngân hàng |
| Thư mục đã đổi tên | Video đã đăng có thư mục theo tiêu đề YouTube (bảng `san_pham/_bang_doi_ten_thu_muc_2026.10.30.tsv`), đường dẫn đặt trong ngoặc kép; tài nguyên dựng đã lên Drive, cần dùng lại thì tra `du_lieu/luu_tru_drive/MUC_LUC.md` và tải bằng skill luu-tru-drive |
| Lô cùng chủ đề | Mở lô từ 3 video cùng chủ đề thì chạy skill ra-soat-dung-chung trước (kho `tai_san/kho_hinh_chung/`) |
| Ô ý tưởng | Trước khi làm một video đã có thư mục, đọc `tai_nguyen/dang_bai/y_tuong_tiep.md`; ý đã xử lý thì xoá khỏi ô trong cùng lượt |
| Sổ nợ | Bắt đầu một video: sửa dòng "Trạng thái" trong `so_no_cong_viec.md` thành "Đang làm (phiên X, 30/10/2026)"; có bản nháp: "Bản nháp chờ Trung duyệt (ngày)" |

## 4. Quy tắc chốt thêm tại project này

(chưa có)
