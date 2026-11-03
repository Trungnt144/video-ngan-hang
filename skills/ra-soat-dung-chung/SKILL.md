---
name: ra-soat-dung-chung
description: "Rà soát trước nội dung của cả một lô hoặc một loạt video cùng chủ đề (trước khi dựng hoặc khi lô đang chạy dở) để dự kiến các hình vẽ, nhân vật, biểu đồ, giao diện, mô hình 3D, ảnh, khuôn bố cục sẽ dùng đi dùng lại; thứ nào nhiều video cần thì dựng MỘT lần, Trung duyệt một lần, lưu kho dùng chung (tai_san/kho_hinh_chung/ cho video HTML, tai_san/khoi_dung_san/ cho Remotion) rồi các phiên dựng chép vào dùng. Có script đếm từ khoá hình trong sổ nợ và kịch bản, đối chiếu kho và mã đã dựng, script chép tài sản kho vào dự án video có ghi phiên bản. Dùng khi Trung nói: rà soát trước lô, làm nhiều video cùng chủ đề, hình dùng lại, dùng chung hình, kho hình chung, tránh vẽ lại, dựng một lần dùng nhiều lần, tài sản dùng chung, mô hình dùng lại cho cả loạt; và TỰ CHẠY không cần nhắc khi mở một lô từ 3 video cùng chủ đề hoặc một loạt có kế hoạch nhiều lô. KHÔNG dùng cho: một video lẻ; xếp hạng khối 3D Remotion đã có (chạy thẳng scripts/danh_gia_dung_lai.py); chọn phong cách, tổ hợp trục (04_he_truc_dung.md)."
version: 1.0.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-29
  related_modules: [07_khuon_prompt_va_kiem_chat_luong.md, 04_he_truc_dung.md, tai_san/kho_hinh_chung/README.md, tai_san/khoi_dung_san/danh_muc_mo_hinh_3d.md]
  related_skills: [dung-video-html, dieu-phoi]
---

# Rà soát dùng chung trước khi dựng một lô video

Trung yêu cầu ngày 29/10/2026: khi làm nhiều video cùng một chủ đề, project phải nhận ra trước những hình sẽ dùng lại nhiều lần, dựng một lần rồi lưu lại, thay vì mỗi video vẽ lại. Số đo cho thấy vì sao: ở lô 18 video điện ngày 27/10/2026, dựng mô hình 3D mới chiếm 45–70 phút trong 55–85 phút mỗi video (`07_khuon_prompt_va_kiem_chat_luong.md` mục 14); ở lô 1 loạt thuật ngữ ngân hàng, bốn phiên dựng song song mỗi phiên tự vẽ toà nhà, người vay, xấp tiền, giấy tờ riêng.

Skill này mở rộng bước "dùng lại mô hình trước khi dựng mới" của pha 1 (mục 14) từ khối 3D Remotion sang mọi loại hình và sang video HTML, và chuyển nó lên trước khi giao việc dựng.

## Khi nào chạy

| Lúc | Việc |
|---|---|
| Mở một loạt có kế hoạch nhiều lô | Rà cả loạt một lần; lập danh mục hình đề xuất cho cả loạt; dựng ngay phần lô đầu cần |
| Đầu mỗi lô (từ 3 video cùng chủ đề) | Rà lô đó; dựng phần còn thiếu trước khi giao việc dựng video |
| Lô đang chạy dở mà chưa rà | Rà ngay; video đã có ảnh tĩnh không làm lại (xem "Áp dụng nửa chừng"); video chưa dựng thì dùng kho |
| Cuối lô | Gom hình mới vẽ riêng mà từ 2 video trở lên dùng; cập nhật `dung_o` trong danh mục |

Người chạy là phiên giữ lô (phiên điều phối). Phiên giữ lô cũng là phiên giữ kho trong suốt lô: chỉ phiên này (hoặc một tác tử con nó giao) được sửa `tai_san/kho_hinh_chung/`, theo `01_quy_trinh_chung.md` mục 7 (file dùng chung một phiên một lúc).

## Nguyên tắc chọn

1. **Ngưỡng dùng chung:** hình cần ở từ 2 video trong lô sắp dựng, hoặc từ 3 video trong cả loạt → dựng chung. Cần ở 2 video thuộc hai lô khác nhau → ghi danh mục trạng thái `de_xuat`, dựng khi lô thứ hai mở. Cần ở 1 video → vẽ riêng trong video đó.
2. **Dùng chung phần khung, đổi phần phong cách.** Kế hoạch loạt bắt hai video liền nhau không cùng chất liệu và mỗi video khác 3 video gần nhất ở ít nhất hai trục (`04_he_truc_dung.md` mục 6). Dùng chung quá mức làm cả loạt trông giống nhau. Vì vậy hình dùng chung giữ hình dạng, tỉ lệ, điểm neo, còn màu, nét, kiểu vẽ là tham số (ít nhất `phang` và `net_tay`; bản 3D là hình riêng cùng tỉ lệ). Bảng màu do từng video đặt.
3. **Khuôn nhận diện loạt thì cố ý giống nhau:** cảnh mở đầu tên thuật ngữ, khung trích văn bản pháp luật có số hiệu, khung ví dụ tính tiền từng bước, cảnh kết trỏ sang video khác. Người xem nhận ra loạt nhờ các khuôn này.
4. **Gom trước, dựng mới sau.** Hình đã có bản vẽ tốt trong một video thì tách bản đó ra kho (ghi `nguon_gom`), không vẽ lại từ đầu.
5. **Không đổi video đã có ảnh tĩnh đạt** chỉ để dùng kho: kết xuất lại và duyệt lại tốn hơn phần tiết kiệm.

## Các bước

### Bước 1 — Gom nguồn

Kế hoạch lô hoặc kế hoạch loạt; mục sổ nợ của từng mã video (`so_no_cong_viec.md`); kịch bản đã viết (`san_pham/<video>/tai_nguyen/kich_ban/`); mã đã dựng (`xuong_html/<tên>/`, `xuong_dai/<tên>/src/`). Đọc qua tác tử con (skill `dieu-phoi`), phiên chính chỉ nhận bảng tóm tắt.

### Bước 2 — Script đếm từ khoá

Từ điển từ khoá của lĩnh vực ở `tai_san/kho_hinh_chung/tu_khoa/<lĩnh vực>.json` (mỗi hình: `loai`, `mo_ta`, `tu_khoa`, `dau_ma` là mẫu tên hàm để nhận ra hình đã vẽ trong mã). Lĩnh vực mới chưa có từ điển thì làm bước 3 trước rồi viết từ điển từ kết quả.

```bash
python3 skills/ra-soat-dung-chung/scripts/ra_soat_lo.py --tu-khoa tai_san/kho_hinh_chung/tu_khoa/ngan_hang.json \
  --ma N72-N135 --lo-hien-tai N81,N82,N72 \
  --kich-ban "san_pham/2026.10.28.*/tai_nguyen/kich_ban/*.md" \
  --ra san_pham/<thư mục loạt>/tai_nguyen/kich_ban/<ngày>.ra_soat_hinh_lo<n>.md
```

Script chỉ đọc. Bảng ra có: hình · loại · số video trong lô · số video cả danh sách · đã có trong kho chưa · đang bị vẽ riêng ở dự án nào · đề xuất `DUNG_CHUNG` / `GHI_CHO` / `RIENG`.

### Bước 3 — Tác tử đọc nội dung

Từ khoá không bắt được hình mà kịch bản chỉ tả bằng ý ("dòng tiền chảy từ người gửi vào ngân hàng"). Giao một tác tử con (Sonnet) đọc mục sổ nợ và phần mô tả cảnh của kịch bản, liệt kê thứ cần vẽ của từng video bằng tên chuẩn hoá, ghi JSON ma trận video × hình. Giao một tác tử con khác kiểm kê hình đã vẽ trong mã các video của lô (tên hàm, file:dòng, có tham số không, khó tách hay dễ), chọn bản làm gốc. Hai việc chạy song song. Gộp với bảng bước 2; tên mới thì thêm vào từ điển để lần sau script bắt được.

### Bước 4 — Lập danh sách dựng chung và báo chi phí

Viết file `<ngày>.ra_soat_hinh_lo<n>.md` trong `tai_nguyen/kich_ban/` của thư mục loạt, gồm:
- bảng hình dùng chung: tên · loại · video cần · gom từ đâu hay dựng mới · kiểu vẽ cần có · ước phút dựng;
- bảng khuôn nhận diện loạt;
- ước công: phút dựng kho so với phút các video tự vẽ (số đo gốc: dựng mô hình 3D mới 45–70 phút mỗi lần ở lô 18 video; hình SVG đơn giản chưa có số đo, ghi rõ là ước).

Thêm các hình vào `tai_san/kho_hinh_chung/danh_muc.json` trạng thái `de_xuat`. Báo Trung danh sách và ước công bằng bảng chọn (quy tắc cứng 5). Lô chạy "làm một mạch" thì phiên giữ lô tự quyết, ghi lý do vào file rà.

### Bước 5 — Dựng kho

1. Dựng nền móng trước: `chung/kho_nen.js` (biến `KHO`, hàm tạo phần tử SVG, bảng màu mặc định và `KHO.datMau`, hàm dễ dàng hoá chuyển động, bộ lọc nét tay có hạt giống). Mọi hình khác `can: ["kho_nen"]`.
2. Mỗi hình theo hợp đồng trong `tai_san/kho_hinh_chung/README.md`: không trạng thái giữa khung, màu là tham số, có kiểu `phang` và `net_tay`, không nhận diện thương hiệu thật, đầu file ghi phiên bản.
3. Giao tác tử con dựng song song theo nhóm (vật thể, nhân vật, biểu đồ, giao diện, 3D); mỗi tác tử chỉ ghi file hình của mình, phiên giữ kho tự sửa `danh_muc.json` (một người ghi).
4. Thêm hình vào `xem_mau.html`: mỗi hình một ô, cả hai kiểu vẽ, ba thời điểm (lúc vào, giữa, cuối). Chụp ảnh tĩnh qua chỗ nhanh của hàng đợi (`scripts/hang_doi_ket_xuat.sh --nhanh kho <lệnh>`), lưu `anh_mau/`.
5. Soát theo thanh chất lượng (`07_khuon_prompt_va_kiem_chat_luong.md` mục 9): tương phản chữ, nét không vỡ ở 1920×1080, không lộ nhận diện thương hiệu.
6. **Cửa duyệt kho:** Trung duyệt ảnh mẫu một lần, gộp vào cửa duyệt ảnh tĩnh của lô nếu trùng lúc. Có chữ "duyệt" thì đổi trạng thái `da_duyet`.

### Bước 6 — Giao việc dựng video

Lời giao việc từng video thêm khối "Tài sản dùng chung":

```
Tài sản dùng chung (skill ra-soat-dung-chung): <danh sách tên hình>.
Chép vào dự án: python3 skills/ra-soat-dung-chung/scripts/chep_kho.py xuong_html/<dự án> <tên hình...>
Không sửa file trong thu_vien/kho/. Thiếu biến thể thì báo phiên giữ lô; sửa tạm thì ghi SO_VONG_SUA.md.
Hình chỉ video này cần thì vẽ riêng trong trang. Thấy một hình riêng mà video khác trong lô cũng cần thì báo phiên giữ lô.
```

Video Remotion: chép khối từ `tai_san/khoi_dung_san/` theo `07_khuon_prompt_va_kiem_chat_luong.md` mục 14 bước 1; ghi trường `khoi` trong `.chuong.json`.

### Bước 7 — Cuối lô

Chạy lại script bước 2 với cờ lô vừa xong để thấy hình nào vẫn bị vẽ riêng ở từ 2 dự án; gom về kho. Cập nhật `dung_o`, ghi số đo thật (phút dựng kho, phút tiết kiệm ở video dùng kho) vào file rà của lô, để lô sau ước sát hơn.

## Áp dụng nửa chừng (lô đang chạy)

- Video đã có ảnh tĩnh đạt hoặc đã duyệt: giữ nguyên. Bản vẽ tốt trong video đó thành nguồn gom cho kho.
- Video đang dựng dở: phiên dựng tự quyết theo lượng việc còn lại; vật thể chưa vẽ thì lấy từ kho.
- Video chưa dựng trong lô và mọi lô sau: dùng kho.

## Chi phí

Script bước 2 chạy dưới 5 giây, không tốn token. Bước 3 là hai tác tử Sonnet, mỗi tác tử đọc khoảng 30–100 nghìn token tuỳ số kịch bản. Bước 5 tốn nhất; báo trước theo bước 4.

## File của skill

| File | Việc |
|---|---|
| `scripts/ra_soat_lo.py` | Đếm từ khoá hình trong sổ nợ và kịch bản theo mã video, đối chiếu kho và mã đã dựng, ra bảng đề xuất |
| `scripts/chep_kho.py` | Chép hình (kèm phụ thuộc) từ kho vào `thu_vien/kho/` của dự án video, ghi phiên bản, in dòng `<script>`; `--kiem` so bản dự án với kho |
| `tai_san/kho_hinh_chung/README.md` | Hợp đồng một tài sản HTML, trường danh mục, cách dùng |
