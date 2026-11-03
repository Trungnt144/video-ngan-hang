# Khuôn giao dựng cảnh 3D bằng Three.js

> Dùng khi giao tác tử con dựng một cảnh 3D bằng Three.js (thư viện dựng 3D trong trình duyệt) ở hai chỗ: cảnh 3D trong dự án Remotion (LM-02) và cảnh 3D trong một trang HTML (LM-03). Quy tắc chung của khuôn giao việc: `07_khuon_prompt_va_kiem_chat_luong.md`. Cảnh 3D tả thực bằng Blender là cách khác (LM-05, skill `dung-hoat-canh-3d-blender`), không dùng khuôn này.
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Rút từ lỗi thật của Media (video máy biến áp, buồng máy, BESS, che gió, monopile; module `10_video_ngang_thuyet_minh.md`, `90_bai_hoc.md` ngày 26/10 và 27/10/2026), cảnh bàn cờ 3D của phép thử Lịch sử AI (27/10/2026) và các quy tắc 3D trong prompt `everestchris6-399895`, `op7418-814408`, `mdaman010-111079`, `anirockshady-032809`. Số có chữ "điểm xuất phát" chưa hiệu chỉnh cho Media.

## 1. Khi nào dùng 3D

Chỉ dùng 3D khi nó giải thích điều vật lý hoặc không gian: lớp, bộ phận, vị trí, tỉ lệ, mặt cắt (`everestchris6-399895`). Biểu đồ, sơ đồ, danh sách bước thì dùng 2D. Cảnh 3D mặc định dựng bằng Three.js (Trung chốt 25/10/2026); chỉ chuyển sang Blender khi có mô hình chi tiết tải về hoặc cần vật liệu thật (`05_cach_lam.md`, LM-05). Chất liệu dùng khuôn này: CL-06 (3D đất sét và bản vẽ), CL-07 (3D xuyên thấu), CL-13 (3D sa bàn bằng mã), CL-14 (mô phỏng và bề mặt toán). Hướng viết riêng cho từng chất liệu: `huong_theo_chat_lieu.md`.

## 2. Khuôn

Chép khối dưới đây, thay các chỗ `{{...}}`, ghép vào khuôn chung (`khuon_dung_html_mot_trang.md` cho LM-03) hoặc gửi riêng cho cảnh 3D của LM-02.

```
<role>
Bạn dựng một cảnh 3D bằng Three.js để giải thích {{DIEU_CAN_GIAI_THICH}} (điều vật lý hoặc không gian).
Mọi chuyển động của vật, máy quay, ánh sáng là hàm của thời gian t. Nhãn chữ là HTML, không vẽ chữ trong 3D.
</role>

<inputs>
- Vật cần dựng, kích thước thật và đơn vị: {{THONG_SO}} (nguồn: file dữ kiện {{DUONG_DAN_DU_KIEN}}).
- Khổ {{W}}×{{H}}, {{FPS}} khung/giây, độ dài {{GIAY}} giây; mốc thời gian: {{MOC}}.
- Tông màu: nền {{NEN}}, vật chính {{VAT}}, nhấn {{NHAN}} (mã hex); màu theo chức năng: {{BANG_MAU_CHUC_NANG}}.
- Vùng phụ đề: phần dưới của khung ({{TY_LE_PHU_DE}} chiều cao); không vật 3D nào đi vào vùng đó.
</inputs>

<direction>
Ánh sáng ba điểm: một đèn chính mềm từ một bên và hơi phía trước máy quay (không đặt ngay
trên đầu vật); một đèn trời hoặc đèn bù mờ phía đối diện; một đèn viền phía sau để tách vật khỏi nền.
Vật liệu: mỗi bộ phận một màu theo chức năng, có bảng chú giải; không kính đen phẳng; không vân lặp
lộ rõ; mặt ghép giữa hai bộ phận khít, không bộ phận lơ lửng, không khe hở. Mô hình rút gọn chỉ cần
khối chính; mô hình chi tiết thêm bu-lông, đường ghép, vát cạnh.
Máy quay: góc khoảng 35–55 độ so với mặt phẳng ngang (cách hiểu của nguồn; xuyên thấu nhìn bên trong từng tầng: chếch xuống 30–40 độ); không nhìn
thẳng xuống một mặt lớn; không kết thúc cận trên một mặt phẳng; vật chính cao ít nhất 1/4 khung ở mọi
cảnh; máy quay vào nhanh, đáp mềm; không đặt máy quay trong vùng vật đang quay quét.
Hậu kỳ: bật quầng sáng, hạt phim, nhoè chuyển động chỉ khi chất liệu cần và chỉ ở bản cuối.
Chuyển động của dòng (điện, nhiệt, chất lỏng, gió): hạt chạy dọc đường theo chiều dòng, vị trí
hạt tính thẳng từ số khung.
Cấm: {{CAM_THEO_CHAT_LIEU}}
</direction>

<build>
1. Dựng cảnh một lần (scene, camera, đèn, mô hình). Mô hình viết file riêng để video sau dùng lại.
2. Trong hàm vẽ theo t: đặt vị trí, góc, độ mờ, màu mọi vật; đặt máy quay; gọi render đúng một lần.
   Không dựa vào đồng hồ thật, không số ngẫu nhiên không có hạt giống.
3. Nhãn chữ là HTML đặt theo toạ độ chiếu của máy quay mỗi khung (chiếu điểm 3D ra điểm ảnh), có
   đường dẫn bám bộ phận. Không vẽ chữ trong 3D.
4. Máy quay có giới hạn gần (near) đủ lớn so với khoảng cách: cảnh nhìn xa đặt near = 1.
5. Vật liệu đổi độ mờ theo thời gian: đổi key theo trạng thái đục/trong (hoặc đặt needsUpdate).
6. Mặt đất: dùng vật liệu không nhận đèn, đúng màu nền, kèm một mặt chỉ nhận bóng đổ; nếu không
   tắt tone mapping thì mặt đất cháy trắng.
7. Tô sáng, bật tắt bộ phận: nhận số 0..1 và chuyển dần trong 12 khung, không đổi trong 1 khung.
8. Xuất khung thử: tám góc cố định (mô hình đứng yên) để soát mô hình trước khi viết dòng thời gian
   của máy quay.
9. Với LM-02 (Remotion): dùng lại khung mã của video D-09b gần nhất (xuong_dai/may_bien_ap/src/CoBan.tsx,
   KichBan.ts, Video.tsx); đóng gói một lần (npx remotion bundle) rồi npx remotion still từng khung.
   Với LM-03 (HTML): theo khuon_dung_html_mot_trang.md, Three.js r128 nạp từ thu_vien/.
</build>

<gotchas>
Xem bảng lỗi hay gặp; mỗi lỗi trong bảng phải được kiểm bằng khung cắt từ chính file mp4.
</gotchas>

<quality_bar>
Đo theo mục 9 của 07_khuon_prompt_va_kiem_chat_luong.md, cộng: vật chính trên nền tối thiểu 3:1 (đo
bằng scripts/do_tuong_phan_khung.py); màu nền đã kết xuất khớp mã hex (đo điểm ảnh); không vật 3D nào
đi vào vùng phụ đề; không nhãn nào tràn mép khung ở khung giữa và khung cuối mỗi đoạn máy quay di chuyển.
</quality_bar>
```

## 3. Lỗi hay gặp

| Lỗi | Nguyên nhân | Cách tránh | Nguồn |
|---|---|---|---|
| Bàn cờ màu xám xi măng, to, mép trước tràn xuống vùng phụ đề; quân cờ xếp vòng tròn không giống ván cờ thật | Màu nền bàn sáng; khung nhìn đặt thấp; vị trí quân tự bịa | Bàn gần đen, lưới mảnh; dời khung nhìn lên 125 điểm ảnh và lùi máy quay (bán kính 47 xuống 40 ở vòng 1, 52 xuống 43 ở vòng 2); vị trí quân lấy từ dữ liệu đã kiểm | Lịch sử AI vòng 1–2 (27/10/2026) |
| Quầng sáng thành đốm vàng trắng gắt | Quầng quá to, quá sáng | Nhỏ và dịu; chỉ nhấn bằng màu nhấn của tông | Lịch sử AI vòng 1–2 |
| Vật đã "trong suốt" vẫn vẽ như khối đặc khi kết xuất cả video; mất hình bên trong ở phần lớn các cảnh | Vật liệu đổi độ mờ không được tạo lại | `key` đổi theo trạng thái đục/trong, hoặc `needsUpdate` | `10_video_ngang_thuyet_minh.md` mục buồng máy (26/10/2026) |
| Mặt đất cháy thành trắng, lộ đường chân trời | Mặt đất nhận cả đèn bán cầu và đèn mặt trời, không tone mapping | Mặt đất không nhận đèn, đúng màu nền; bóng đổ vẽ trên mặt riêng | `10_video_ngang_thuyet_minh.md` mục che gió (26/10/2026) |
| Ô vuông và tia sáng ở cảnh nhìn xa (máy quay cách khoảng 900 đơn vị) | Hai mặt phẳng cách 0,2 đơn vị tranh nhau độ sâu vì near = 0,1 | near = 1; ảnh `still` ở góc gần không lộ lỗi, phải soát cả khung nhìn xa | như trên |
| Hình nháy: bộ phận đổi màu một khung rồi đổi lại; sáu cửa cùng tắt màu | Trạng thái tô sáng đúng/sai | Số 0..1 chuyển dần 12 khung; đo bằng chênh lệch điểm ảnh giữa khung n và n+1 (nháy là một khung vọt lên, lia máy là nhiều khung cao liên tiếp) | `10_video_ngang_thuyet_minh.md` mục BESS (26/10/2026) |
| Hạt chạy trong lõi đặc biến mất | Hạt đặt ở đường tâm, lõi đặc che | Đặt hạt ở mặt trước lõi (z bằng nửa bề dày cộng 0,07) | `10_video_ngang_thuyet_minh.md` mục máy biến áp |
| Nhãn tràn mép khung khi máy quay tiến gần; phụ đề che hàng dưới của mô hình | Nhãn đặt theo toạ độ 3D, mô hình quá lớn trong khung | Soát khung giữa và cuối mỗi đoạn máy quay di chuyển | `10_video_ngang_thuyet_minh.md` mục pin mặt trời 3D (25/10/2026) |
| Khung hỏng ngẫu nhiên: lớp chữ lặp thành lưới 3×3, mất hình 3D | Kết xuất WebGL | Quét mọi khung bằng `scripts/quet_khung_hong.py`; thay khung hỏng bằng `remotion still` | `90_bai_hoc.md` 27/10/2026 |
| Tua-bin trắng trên nền kem biến mất (tương phản 1,11:1); tua-bin quá bé | Vật chính và nền cùng sáng | Nền tối hoặc vật tối hơn nền; vẽ vật to hơn 1,5 lần; đo tương phản trên khung cắt | `10_video_ngang_thuyet_minh.md` mục che gió |
| Thẻ giao diện 3D bị phẳng, lộ cả hai mặt | Đặt opacity hoặc filter lên phần tử `preserve-3d` (CSS 3D, CL-16) | Áp độ mờ hoặc bộ lọc lên phần tử bọc ngoài, không lên phần tử `preserve-3d`; không lật vật lớn bằng CSS 3D | `twoclipping-000267`, `op7418-814408` |
| Viền hậu kỳ vẽ cả vật khác lên màn nền phía sau | Vật 3D phía sau vẫn hiện khi bật màn | Ẩn các vật 3D khác khi hiện màn | `op7418-814408` |
| WebGL không khởi tạo được trong Chromium ẩn | Không có GPU đồ hoạ cho chế độ ẩn | Thử cờ `--co-chromium=--use-angle=swiftshader` của `xuat_mp4.mjs` (cách của `notdwd-998633`; chưa thử ở Media) | `xuong_html/cong_cu/KET_QUA_DO.md` |

## 4. Số đo và giới hạn đã biết

- Three.js r128 trong trang HTML xuất đúng giờ ảo; một khối hộp quay: 1,39 giây máy mỗi giây video, chậm hơn Canvas 2D (0,96). Cảnh nhiều đa giác, shader nặng, hậu kỳ chưa đo (`xuong_html/cong_cu/KET_QUA_DO.md`, 27/10/2026).
- Three.js trong Remotion: 3.197 khung (106,6 giây) kết xuất 5 phút 2 giây, 116 MB (máy biến áp); 3.792 khung khoảng 6 phút, 37 MB (che gió). Ước "trọn một ngày" cho video máy móc dựng từ khối cơ bản là quá cao; vẫn có thể đúng với bánh răng ăn khớp hoặc mô hình tải về (`10_video_ngang_thuyet_minh.md`, 26/10/2026).
- Cycles trên mô hình khối cơ bản không đẹp hơn Three.js (Trung chê 26/10/2026): không chuyển cảnh khối cơ bản sang Blender.
