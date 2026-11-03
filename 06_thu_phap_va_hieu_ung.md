# 06 — Thủ pháp và hiệu ứng

> Đọc ở bước dựng (sau cửa chọn tổ hợp trục) và bước biến tấu; đọc khi Trung hỏi "làm hiệu ứng X thế nào", "video đã đủ lớp hoàn thiện chưa", "thủ pháp nào dùng cho video khoa học".
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-28 · Thêm mục 9: kỹ thuật cắt mở và mặt cắt cho video khoa học 3D (lô 16 video điện gió, Trung duyệt gom 28/10/2026).
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Module mới. Dữ liệu ở `tai_san/thu_phap/` (109 thủ pháp, tất cả ở trạng thái nháp). Nguồn học: repo `awesome-opus5-5-videos`, 100 mục chấm bằng hình và quét chữ 703 prompt, ngày 27/10/2026 (`tai_san/hoc_tu_repo/awesome_opus55/README.md`).

## 1. Thư viện là gì và nằm ở đâu

Thư viện thủ pháp ghi lại từng kỹ thuật hình và âm thanh nhỏ (đường tăng giảm tốc của một chuyển động, cách một chữ hiện ra, cách nối hai cảnh, lớp hạt nhiễu phủ lên hình) kèm tham số đủ để làm lại. Thư viện không phải một trục chọn phong cách: Trung không chọn thủ pháp ở cửa chọn, Claude chọn khi dựng (mục 2).

| File (trong `tai_san/thu_phap/`) | Vai trò |
|---|---|
| `thu_vien_thu_phap.json` | Nguồn dữ liệu duy nhất: 109 thủ pháp, lớp hoàn thiện bắt buộc, bảng tên mã chất liệu và cách làm |
| `thu_vien_thu_phap.md` | Bản đọc sinh tự động từ JSON. Không sửa tay |
| `sinh_ban_doc.py` | Sinh bản đọc và kiểm dữ liệu (mã không trùng, đủ trường, mẫu nguồn có thật) |

Nguồn của thủ pháp nằm ở `tai_san/hoc_tu_repo/awesome_opus55/` (`muc_luc.md` có link video và link prompt gốc của từng mục).

Mỗi thủ pháp có mã dạng `TP-<nhóm><hai chữ số>`, ví dụ TP-CD01 (lò xo giải tích). Tám nhóm:

| Nhóm | Nội dung | Số thủ pháp |
|---|---|---|
| TP-CD | chuyển động: tăng giảm tốc, lò xo, lệch nhịp, máy quay ảo 2D, con trỏ | 11 |
| TP-CC | chuyển cảnh: hình biến, vật mang theo, phóng máy quay, khối màu tràn khung, vòng lặp | 13 |
| TP-CH | chữ: chữ vào, chữ nhấn, phụ đề, nhãn góc, nhãn chương, chữ viết tay | 21 |
| TP-SL | số liệu, đồ thị, bản đồ, sơ đồ, danh sách bước, chú thích | 20 |
| TP-3D | máy quay 3D, độ sâu trường ảnh, tách lớp, ánh sáng, vật liệu, mô phỏng | 16 |
| TP-HK | hậu kỳ và lớp hoàn thiện: hạt nhiễu, nhoè chuyển động, quầng sáng, nét bút, kính lỏng | 14 |
| TP-AT | âm thanh đồng bộ: lưới nhịp, đặt tiếng, chuẩn âm lượng, mốc từng từ | 10 |
| TP-TT | tương tác (chỉ ghi để biết, video không dùng) | 4 |

Mỗi thủ pháp có 13 trường: mã, tên, nhóm, cách làm (tham số cụ thể), làm bằng gì, chi phí máy (nhẹ, vừa, nặng), hợp chất liệu nào (mã CL), hợp cách làm nào (mã LM), lỗi hay gặp, mẫu nguồn, số mẫu, tham số lấy từ đâu, trạng thái. Mã CL (chất liệu hình, 16 giá trị) giải ở `04_he_truc_dung.md`; mã LM (cách làm, 7 giá trị) giải ở `05_cach_lam.md`.

Hai trường cần đọc kỹ. Trạng thái "nháp" nghĩa là chưa dựng thử bằng cách làm nào của Media. Trường "tham số từ" cho biết tham số lấy nguyên từ mẫu ("mẫu"), do Claude đề xuất và chưa đo ("đề xuất"), hay trộn hai loại ("mẫu + đề xuất", phần đề xuất ghi rõ trong cách làm).

## 2. Dùng ở bước dựng

Làm sau khi Trung chốt tổ hợp trục ở cửa chọn 2 (`04_he_truc_dung.md`) và cách làm (`05_cach_lam.md`).

1. Lấy mã chất liệu (CL) và mã cách làm (LM) đã chốt.
2. Lọc thư viện theo hai mã đó (ví dụ CL-05 Đồ thị SVG và LM-02 Remotion dự án ngang):

```bash
python3 -I -c "import json;d=json.load(open('tai_san/thu_phap/thu_vien_thu_phap.json'));cl,lm='CL-05','LM-02';print('\n'.join(t['ma']+' '+t['ten']+' ['+t['chi_phi_may']+']' for t in d['thu_phap'] if cl in t['hop_chat_lieu'] and lm in t['hop_cach_lam']))"
```

3. Với mỗi cảnh chọn tối đa 2–3 thủ pháp nổi (chữ vào, chuyển cảnh, hiệu ứng số liệu; ngưỡng đề xuất) và luôn áp lớp hoàn thiện bắt buộc (mục 4). Không chồng nhiều hiệu ứng nổi vào một chỗ.
4. Ghi mã thủ pháp đã dùng vào dòng "Biến tấu" ở đầu kịch bản, cùng dòng ghi mã lối viết, chất liệu, mức chi tiết, bố cục, tông màu, nhạc.
5. Khi viết spec hoặc prompt cho Opus dựng hình, chép tham số của thủ pháp vào khối "thủ pháp" của khuôn ở `07_khuon_prompt_va_kiem_chat_luong.md` (mã, tên, tham số), không chỉ ghi tên: tên không đủ để làm lại đúng.
6. Thủ pháp chi phí nặng (TP-HK04 nhoè chuyển động, TP-CC11 hạt tan ra rồi gom, TP-3D14 mô phỏng vật lý, TP-3D15 shader, TP-3D16 khung 2.5D): dựng thử 1–2 khung, ghi thời gian máy mỗi khung, báo Trung ước tính cho cả video trước khi chạy (mục HT-3D-09 của lớp hoàn thiện).
7. Trước khi giao: chạy bảng kiểm ở `15_bang_kiem_truoc_khi_giao.md`, mục lớp hoàn thiện.

Chọn theo loại video:

- Video khoa học ngang có thuyết minh: nhịp theo lời đọc, không dùng lưới nhịp BPM (TP-AT01 dành cho video có nhạc theo nhịp). Mốc từng từ lấy từ Whisper (TP-AT08).
- Video dọc ngắn: hợp TP-CH03 (chữ khổng lồ), TP-CC12 (vòng lặp), TP-CC10 (đổi nền ngắt nhịp).
- Thủ pháp nhóm TP-TT chỉ ghi để biết; cần cảnh tương tác thì quay lại màn hình hoặc thay bằng con trỏ ảo theo kịch bản (TP-CD05).

## 3. Dùng ở bước biến tấu

Mục đích: video sau không lặp lại hình thức của ba video gần nhất cùng khổ.

- Đếm thủ pháp đã dùng trong các kịch bản (có kết quả khi kịch bản đã ghi mã TP, từ video làm sau 27/10/2026):

```bash
grep -rhoE "TP-(CD|CC|CH|SL|3D|HK|AT|TT)[0-9]{2}" san_pham/*/tai_nguyen/kich_ban/*.md | sort | uniq -c | sort -rn | head -20
```

- Mỗi video mới đổi ít nhất 2 thủ pháp nổi (nhóm TP-CH, TP-CC, TP-SL, TP-3D) so với ba video gần nhất (ngưỡng đề xuất). Đổi trước nhóm chuyển cảnh và chữ vào, vì ít ảnh hưởng nội dung; đổi nhóm số liệu theo loại đồ thị.
- Thủ pháp thuộc lớp hoàn thiện bắt buộc (mục 4) luôn áp, không tính vào số thủ pháp phải đổi.
- Gặp kỹ thuật mới đáng ghi (từ video khác hoặc tự dựng ra): thêm vào thư viện theo mục 6.

## 4. Lớp hoàn thiện bắt buộc

Lớp hoàn thiện là mức tối thiểu mỗi video phải có, theo nhóm chất liệu. Rút từ số đo của Media (mẫu lịch sử AI 60 giây, bản 30 giây một lượt, ngày 27/10/2026) và từ các mẫu điểm hợp Media 3. Chi tiết, lý do và cách kiểm của từng mục nằm ở khoá `lop_hoan_thien` của JSON (bản đọc: cuối `thu_vien_thu_phap.md`).

| Nhóm | Mã chất liệu | Số mục |
|---|---|---|
| Chung cho mọi video | tất cả | 10 (HT-CH-01 đến 10) |
| 2D phẳng | CL-01, 02, 04, 09, 15, 16 | 7 |
| Nét vẽ | CL-03, 10 | 5 |
| Đồ thị | CL-05, 14 | 7 |
| 3D | CL-06, 07, 08, 12, 13 | 9 |
| Chữ động | CL-11 | 8 |

Mười mục chung, tóm tắt:

- Mọi chuyển động có tăng tốc rồi giảm tốc (TP-CD01, TP-CD02).
- Nhóm phần tử vào lệch nhịp (TP-CD03).
- Không phần tử nào đứng yên quá 1,5 s; ngoại lệ dừng tối thiểu 400 ms trước đoạn kết (TP-CD07, 08, 09). Ngưỡng 1,5 s là đề xuất.
- Chuyển cảnh: cảnh sau hiện trước mốc cảnh trước ra hết 0,3–0,5 s (TP-CC08).
- Xuất 60 khung/giây có chuyển động nhanh thì bật nhoè chuyển động; xuất 30 khung/giây thì không bật (TP-HK04).
- Hạt nhiễu tối đa độ đục khoảng 6%, kiểm kích thước file sau khi xuất (TP-HK01).
- Mỗi ý có chữ giữ tối thiểu 1,4 s; ý có số liệu hoặc giải thích giữ tối thiểu 2,5 s (TP-CH03, TP-CH15).
- Hình đọc được khi tắt tiếng; khổ dọc có phụ đề cách mép dưới tối thiểu 20% (TP-AT09, TP-CH15).
- Âm lượng −14 LUFS, −2 dBTP đo sau khi mã hoá; hạ nhạc −18 dB khi có giọng (TP-AT03, TP-AT04).
- Xem lại bằng khung tĩnh mỗi nhịp, tối thiểu 3 vòng xem và sửa; ảnh đích cho tác tử con gộp thành 1–2 ảnh ghép.

Hai ngưỡng lấy từ số đo của Media: hạt nhiễu làm file 134 MB ở mẫu lịch sử AI 60 giây, và đưa quá nhiều ảnh đích làm tác tử con bị đẩy ảnh ra khỏi ngữ cảnh. Các ngưỡng còn lại đã ghi nguồn trong từng mục; ngưỡng ghi "đề xuất" chưa thử trên video thật.

## 5. Chi phí máy theo nhóm

Quy ước ước lượng: nhẹ là tính trong một khung, thời gian máy gần như không đổi; vừa là thêm xử lý mỗi khung, tăng dưới khoảng 2 lần (ước); nặng là nhiều lượt chụp mỗi khung hoặc hàng chục nghìn hạt, shader toàn khung. Số đo thật chỉ có ở các dòng ghi nguồn bên dưới.

| Nhóm | Chi phí điển hình | Ghi chú |
|---|---|---|
| TP-CD, TP-CH, TP-AT, TP-TT | nhẹ | Tính trong một khung, không thêm lượt chụp |
| TP-CC | nhẹ; TP-CC11 nặng; TP-CC03, 04, 06, 13 vừa | Hạt 20–40 nghìn điểm và phóng máy quay 3D tốn máy mỗi khung (chưa có số đo) |
| TP-SL | nhẹ; TP-SL13, 14 vừa | Bề mặt toán và mô phỏng tốn máy khi chạy mô phỏng |
| TP-3D | vừa; TP-3D14, 15, 16 nặng | Blender Cycles: 13 giây máy mỗi khung, 412 khung mất 89 phút |
| TP-HK | vừa; TP-HK04 nặng | Nhoè chuyển động ở 60 khung/giây gấp khoảng 8 lần: 23,3 phút máy cho mẫu 60 giây; lớp hạt nhiễu làm file 134 MB |

Số đo của Media dùng chung (nguồn: bản chỉ đạo thiết kế lại ngày 27/10/2026, từ `san_pham/2026.10.27.duyet_phong_cach_opus55/`, module 03 cũ và module 14 cũ):

- Cách làm HTML một trang (LM-03), một lượt viết 30 giây: khoảng 150 nghìn token, 12 phút Opus; xuất 30 khung/giây tốn 1,2–1,5 giây máy mỗi giây video; còn 1–2 lỗi nhìn thấy.
- LM-03 có cách sửa (khung đích, GSAP và Three.js, 3 vòng xem và sửa), mẫu lịch sử AI 60 giây: 218.774 token, 31 phút Opus, 1.324 dòng.
- Remotion khối cảnh dọc (LM-01) và HyperFrames (LM-04): 75 giây video mất khoảng 33 giây máy, tức 0,44 giây máy mỗi giây video.

## 6. Cách thêm thủ pháp mới

1. Mở `thu_vien_thu_phap.json`, thêm một phần tử vào danh sách `thu_phap`: mã tiếp theo của nhóm (ví dụ TP-CD12), đủ 13 trường, `trang_thai` là "nháp", `so_mau` bằng số mẫu nguồn.
2. Mẫu nguồn là slug của mục trong 100 mục hoặc bản quét chữ. Nguồn khác: video của Media ghi `media:<tên thư mục trong san_pham>`, nguồn ngoài repo ghi `ngoai:<tên>` và ghi địa chỉ trong cách làm.
3. Cập nhật `so_thu_phap` của nhóm trong danh sách `nhom`.
4. Chạy từ thư mục gốc project Media: `python3 -I tai_san/thu_phap/sinh_ban_doc.py`. Script phải in dòng bắt đầu bằng OK; nếu in LỖI thì sửa JSON theo từng dòng báo, script không ghi bản đọc khi dữ liệu sai.
5. Không sửa `thu_vien_thu_phap.md` bằng tay.
6. Chuyển trạng thái từ "nháp" sang "đã duyệt" khi thủ pháp đã dựng thành công trên video thật và Trung duyệt, theo cách duyệt thẻ phong cách ở `11_hoc_phong_cach_tu_mau.md`. Claude không tự đổi.
7. Ghi một dòng vào `99_nhat_ky.md`.

## 7. Mười lăm thủ pháp nên dùng trước cho video khoa học

Chọn theo video khoa học và kinh tế có thuyết minh. Đều ở trạng thái nháp; dựng thử trên video đầu tiên rồi đo.

| Mã | Tên | Lý do | Chi phí |
|---|---|---|---|
| TP-CD01 | Lò xo giải tích | Chuyển động không vượt đích, tua tới khung nào cũng đúng; nền của cách làm LM-03 | nhẹ |
| TP-CD02 | Đường tăng giảm tốc chuẩn | 0,8 s cho biến hình, 1,5–3 s cho máy quay; cơ sở của lớp hoàn thiện | nhẹ |
| TP-CD03 | Hiện lệch nhịp | Phần tử vào theo thứ tự đọc, hợp thuyết minh từng ý | nhẹ |
| TP-CH15 | Phụ đề từng từ theo giọng | Media đã có mốc từng từ từ Whisper; có vùng an toàn khổ dọc | nhẹ |
| TP-CH19 | Chữ viết tay vẽ dần | Hợp chất liệu nét vẽ tay (CL-10), vẽ theo lời | nhẹ |
| TP-SL01 | Thanh dài ra trước, số hiện sau | Cho người xem thấy quan hệ giữa độ dài và số | nhẹ |
| TP-SL02 | Đường đồ thị tự vẽ | Đồ thị theo lời đọc; chấm kéo theo và hộp nhãn độ nhạy | nhẹ |
| TP-SL17 | Danh sách bước ba trạng thái và thước đo | Lõi của bố cục bàn thao tác cho video quy trình | nhẹ |
| TP-SL18 | Chú thích khung bao và mũi tên cong | Chỉ đúng điểm đang nói trên công thức, đồ thị, hình | nhẹ |
| TP-CC04 | Phóng xuyên thang đo | Hợp video điện, vật lý, bậc quy mô (toà nhà, giá máy, chip) | vừa |
| TP-3D06 | Tách lớp, hình nổ, bậc quy mô | Giải thích cấu tạo thiết bị; có nhãn đường dẫn | vừa |
| TP-3D07 | Khoá màu theo chức năng | Điện, nhiệt, làm mát một màu một nghĩa suốt video | vừa |
| TP-HK04 | Nhoè chuyển động bằng khung phụ | Chỉ bật khi xuất 60 khung/giây có chuyển động nhanh | nặng |
| TP-HK01 | Hạt nhiễu độ đục tối đa 6% | Lớp hoàn thiện ở chất liệu 3D; kiểm kích thước file | vừa |
| TP-AT04 | Hạ nhạc khi có giọng | Video thuyết minh luôn có giọng đọc; kèm TP-AT03 chuẩn −14 LUFS | nhẹ |

## 8. Giới hạn và bản quyền

- Thư viện chỉ ghi kỹ thuật và tham số, không chép prompt của tác giả. Prompt và video thuộc tác giả; chỉ lưu link (`tai_san/hoc_tu_repo/awesome_opus55/muc_luc.md`), không tải video vào git. Quy tắc trích dẫn tối đa 20 chữ ở `13_ban_quyen_va_bao_mat.md`.
- Mẫu nguồn phần lớn là video quảng cáo và minh hoạ; khi dùng cho video khoa học phải dựng thử và đo trước khi coi là đạt.
- Giấy phép công cụ: GSAP miễn phí cả plugin (giấy phép Webflow), Three.js MIT; Remotion có điều kiện theo số người và tổ chức (xem `13_ban_quyen_va_bao_mat.md`).
- Thuật ngữ mới (easing, stagger, bloom, độ sâu trường ảnh, nhoè chuyển động, shader, parallax, seek(t)) giải ở `16_tu_dien_thuat_ngu.md`.

## 9. Kỹ thuật cắt mở và mặt cắt cho video khoa học 3D (thêm 28/10/2026, lô 16 video điện gió)

- **Cắt mở nửa vật bằng mặt phẳng cắt** thay cho vỏ trong suốt: `clippingPlanes` trên vật liệu, bật `gl.localClippingEnabled = true` qua `ThreeCanvas`; vỏ đục màu đậm đạt 4–5:1, vỏ trong suốt chỉ 1,5–2,2:1 (bầu cánh N38, `xuong_dai/bau_canh_hub/src/BauCanh3D.tsx`). Cắt theo mặt phẳng thế giới làm ruột rỗng trông như khối đặc: thêm hai đường mép cắt sáng (đỉnh tháp N39).
- **Hố đào cắt mở trong mặt đất:** mặt đất là `ShapeGeometry` có lỗ (đảo dấu z sau `rotateX(-π/2)`), ba vách đất, phía máy quay hở (móng N40).
- **Mặt cắt nước, đất, bùn:** chỉnh độ đặc riêng từng cảnh — mặt nước ≥ 0,6 khi cần thân tàu tách nền; lớp nước, cát, bùn ≤ 0,3–0,45 khi cần thấy vật bên trong; vật bên trong màu đậm (N51, N52). Mặt sóng lưới giảm biên độ về 0 ở mép để không lộ vách với mặt phẳng ngoài (N51).
- **Sọc trên cánh xoắn:** tô vertex color theo chỉ số cột của lưới, không theo toạ độ (theo toạ độ thì loang khi cánh xoắn, N38).
- **Tô màu theo nhóm hạng mục** trên mô hình toàn cảnh: `userData.nhom` và `xuong_dai/chi_phi_dau_tu_gio/src/Nhom.tsx` (làm xám mọi vật rồi trộn màu nhóm, N48).
- **Vệt gió theo quãng trôi tích luỹ** (không nhân thời gian với tốc độ) thì không giật khi tốc độ gió đổi (N45).

