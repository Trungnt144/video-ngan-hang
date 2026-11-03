# 15 — Bảng kiểm trước khi giao file

> Đọc và chạy đủ bảng kiểm này ở bước soát trước khi giao của luồng chung (`01_quy_trinh_chung.md`), ngay trước khi đưa file vào thư mục video trong `san_pham/`. Bắt buộc chạy mỗi lần, kể cả video giống hệt tuần trước — vì Trung làm theo đợt cách nhau vài tuần nên rất dễ quên bước nào đã kiểm, bước nào chưa.
> **Phiên bản:** 1.7 · **Cập nhật:** 2026-10-28 · Thêm nhóm "Kiểm chữ đăng" trỏ sang script của skill `viet-chu-dang-video`; dòng "Git đúng phần" thêm các file `.md` trong `tai_nguyen/dang_bai/`.
> **Phiên bản:** 1.6 · **Cập nhật:** 2026-10-28 · Dòng "Tài nguyên đủ" thêm file tóm tắt nội dung (Trung chốt 28/10/2026).
> **Phiên bản:** 1.5 · **Cập nhật:** 2026-10-28 · Gom bài học lô 18 video điện chung và điện mặt trời (Trung duyệt gom 28/10/2026): dòng đứng hình chốt ngưỡng 1,5 giây áp chung kể cả cảnh toàn đồ thị (Trung chốt 28/10/2026); thêm ba dòng kiểm (làm tròn số hiển thị so với phép tính, quét khung hỏng sau mọi lần kết xuất bằng giải mã tuần tự, đo tương phản vật có mặt sáng trên cả vùng vật và lọc nét chữ khi đo chiều cao vật).
> **Phiên bản:** 1.4 · **Cập nhật:** 2026-10-28 · Thêm ba dòng kiểm: độ dài luồng tiếng bằng luồng hình, số khung bằng số ảnh của chuỗi kết xuất, vật chính và nhãn và chữ thẻ của video ngang (lô 16 video điện gió, Trung duyệt gom 28/10/2026).
> **Phiên bản:** 1.3 · **Cập nhật:** 2026-10-27 · Thêm nhóm 6 "Lớp hoàn thiện và thanh chất lượng" (trỏ khoá `lop_hoan_thien` của `tai_san/thu_phap/thu_vien_thu_phap.json` và `07_khuon_prompt_va_kiem_chat_luong.md` mục 9); mục tên file đổi theo quy ước không ghi mã dựng (Trung chốt 27/10/2026).
> **Phiên bản:** 1.2 · **Cập nhật:** 2026-10-27 · đổi tên từ `10_bang_kiem_truoc_khi_giao.md` khi dựng lại luồng Media (nội dung giữ nguyên; tên module trỏ chéo sửa theo `_bang_chuyen_module_2026.10.27.md`; chỗ lỗi thời đã nêu trong bản đồ quy trình được sửa bằng chữ).
> **Phiên bản:** 1.1 · **Cập nhật:** 2026-10-27 · Thêm nhóm cuối "Xếp thư mục giao" theo quy tắc mỗi sản phẩm một thư mục; kịch bản đối chiếu nằm trong `tai_nguyen/kich_ban/`.
> **v1.0** 2026-07-28

## Cách dùng bảng này

Đi hết 6 nhóm theo thứ tự, mỗi mục ghi rõ **cách kiểm cụ thể** — không phải nhìn lướt qua rồi đoán "chắc ổn". Mục nào cần trích khung hình ra xem thì trích thật, không suy đoán bằng mắt thường từ đầu tới cuối video ở tốc độ thường. Kiểm xong hết 6 nhóm mới tới mục "câu hỏi cuối" — mục này không nhóm nào máy soát hộ được, chỉ Trung hoặc Claude tự cân nhắc.

## 1. Kiểm hình

| Mục | Cách kiểm cụ thể |
|---|---|
| Video ngang: vật chính, nhãn, thẻ (thêm 28/10/2026) | Cắt khung đúng lúc lời nói về từng vật: vật chính chiếm ít nhất 1/3 bề ngang khung; điểm nhãn gắn đúng vật được gọi tên; chữ phụ trong thẻ ≥ 20 px, tên và số ≥ 28 px ở 1920×1080; thẻ không che vật chính (`10_video_ngang_thuyet_minh.md` mục 25) |
| Chữ có bị che hoặc tràn khung không | Trích khung hình (frame) tại đúng giây đầu tiên và giây cuối cùng của mỗi khối cảnh — nơi chữ mới xuất hiện hoặc sắp biến mất là chỗ dễ tràn/che nhất. Xuất thành ảnh tĩnh rồi nhìn từng ảnh, không lướt video. |
| Chữ đủ lớn đọc trên điện thoại không | Theo `09_video_doc_ngan.md` mục 3: không cỡ chữ nào dưới 32px ở độ phân giải 1080×1920. Kiểm bằng cách mở đúng file JSON cảnh hoặc component, tìm mọi giá trị `fontSize`, đối chiếu ngưỡng 32px — không đoán bằng mắt trên màn hình máy tính lớn (màn hình to làm chữ nhỏ trông "vẫn đọc được"). |
| Khung hình đầu và cuối có đúng không | Xuất khung hình tại giây 0 (mở đầu gây chú ý) và khung hình cuối cùng (kêu gọi hành động) — đây là hai khung nhiều khả năng bị xem dù người xem lướt nhanh phần giữa. Kiểm đúng thông điệp, đúng logo/không logo theo đúng kênh phát (xem nhóm 4). |
| Bố cục các cảnh có liền mạch, không cảnh nào bị đứng yên bất thường (đơ hình) | Xem video ở tốc độ 0.5x một lượt, tập trung vào điểm chuyển giữa các cảnh — điểm nối cảnh là chỗ hay lộ lỗi dựng. |

## 2. Kiểm tiếng

| Mục | Cách kiểm cụ thể |
|---|---|
| Luồng tiếng có dài bằng luồng hình không (thêm 28/10/2026) | `ffprobe -v error -show_entries stream=codec_type,duration -of csv=p=0 <file>`: độ dài luồng tiếng và luồng hình lệch không quá 0,1 giây. Bản N40 từng mất tiếng từ giây 127 dù số khung đủ (`90_bai_hoc.md` mục 2026-10-28) |
| Giọng đọc có đều, không vấp, không đổi tông giữa chừng | Nghe toàn bộ giọng đọc tách riêng khỏi nhạc nền (tắt nhạc nền nếu công cụ dựng cho tắt riêng từng lớp âm thanh), chú ý các mốc nối giữa câu — chỗ dễ lộ giọng đọc máy bị giật hoặc đổi tốc độ. |
| Nhạc nền có át giọng đọc không | Nghe qua loa điện thoại thật (không phải tai nghe tốt hoặc loa máy tính) — đây là thiết bị người xem thực tế dùng, và loa điện thoại thường làm lộ vấn đề nhạc át giọng rõ hơn tai nghe. |
| Có đoạn im lặng bất thường không | Nhìn dải sóng âm thanh (waveform) của file xuất, tìm đoạn phẳng kéo dài không tương ứng với chỗ ngắt câu có chủ đích trong kịch bản. Đoạn im ngoài kế hoạch thường là lỗi ghép giọng đọc giữa hai cảnh. |
| Phụ đề chạy chữ có khớp mốc thời gian với giọng đọc không | Xem lại 2-3 câu có nhịp nói nhanh nhất trong kịch bản (thường ở cảnh Điểm nhấn) — đây là chỗ dễ lệch mốc thời gian nhất giữa chữ hiện lên và tiếng đọc ra. |

## 3. Kiểm nội dung

| Mục | Cách kiểm cụ thể |
|---|---|
| Đúng kịch bản đã duyệt ở bước 2 (cửa duyệt đầu) không | Mở file kịch bản đã duyệt trong `tai_nguyen/kich_ban/` của thư mục video, đối chiếu từng câu với phụ đề hiện trên khung hình — không đối chiếu bằng trí nhớ về nội dung kịch bản. |
| Số liệu trong khung hình có đúng và có khớp nguồn không | Với mọi con số xuất hiện trên hình, lần lại đúng nguồn Trung cung cấp (xem `02_lam_ro_yeu_cau.md` mục 2a) — không tự tin vì "lúc viết kịch bản đã kiểm rồi", vì bước dựng hình có thể đã gõ lại số liệu và gõ sai. |
| Số hiển thị đã làm tròn có khớp phép tính không (thêm 28/10/2026) | Với mọi phần trăm, tỉ lệ, số thập phân trên hình, tính lại từ số gốc rồi làm tròn đúng số chữ số hiển thị; không lấy số đã làm tròn ở bước trước để tính tiếp. Ví dụ 600 ÷ 2,58 = 23,26% thì hiển thị 23,3% (lô 18 video, N22) |
| Chính tả tiếng Việt có đủ dấu, đúng dấu không | Trích toàn bộ chữ hiển thị trên khung hình ra thành văn bản thuần (copy từ file JSON cảnh hoặc kịch bản gốc, không gõ lại tay), đọc qua một lượt độc lập với việc xem hình — tách riêng việc soát chữ khỏi việc xem hình để không bị phân tâm bởi hình ảnh mà bỏ sót lỗi dấu. |

## 4. Kiểm an toàn

| Mục | Cách kiểm cụ thể |
|---|---|
| Đã áp đúng bốn câu soát ở `13_ban_quyen_va_bao_mat.md` mục 4 chưa | Trỏ sang đọc và trả lời trực tiếp bốn câu ở file đó (khung hình có số liệu/tên riêng, nguồn nhạc/hình đã ghi giấy phép chưa, kênh phát đã đúng ràng buộc chưa, có gì gây rắc rối nghề nghiệp không) — không chép lại nội dung bốn câu vào đây, chỉ trỏ sang để tránh hai bản dễ lệch nhau khi một bản được cập nhật mà bản kia quên sửa. |
| Tài sản dùng trong video (nhạc, biểu tượng, hình) đã có dòng ghi nguồn trong `tai_san/` chưa | Với mỗi tài sản mới đưa vào video lần này, kiểm tồn tại một dòng ghi "tải từ đâu — ngày nào — giấy phép gì" cạnh file đó trong `tai_san/`, đúng yêu cầu ở `13_ban_quyen_va_bao_mat.md` mục 2. |

## 5. Kiểm kỹ thuật

| Mục | Cách kiểm cụ thể |
|---|---|
| Số khung của file giao bằng số ảnh của chuỗi kết xuất (thêm 28/10/2026) | `ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 <file>` bằng số file `element-*.jpeg`. Ghép hình và tiếng hai bước, không `-shortest` (bản N37 thiếu 61 khung, N41 thiếu 302 khung) |
| Khung hỏng WebGL: quét sau mọi lần kết xuất (thêm 28/10/2026) | `.venv_vieneu/bin/python scripts/quet_khung_hong.py <file.mp4>` sau MỌI lần kết xuất, vì khung hỏng có thể xuất hiện ở lần sau dù lần trước sạch (lô 18 video, N31). Phải giải mã tuần tự như script này làm; không dò bằng cách cắt khung với `-ss`, vì `-ss` nhảy về khung gần nhất nên không lộ khung hỏng (lưới 3×3) (N27). Khung cắt bằng `-ss` có thể lệch 1 khung so với số khung script báo (N25). Khi đưa danh sách khung vào `renderStill`, lọc bỏ dòng "tổng khung nghi hỏng" ở cuối danh sách (N27) |
| Đúng khung hình đã định (dọc 1080×1920, ngang 1920×1080) | Xem thông số file xuất bằng công cụ đọc metadata (ví dụ `ffprobe` nếu có sẵn trong môi trường dựng) — không suy đoán từ việc "video trông dọc là được", vì tỉ lệ sai lệch nhẹ vẫn có thể trông dọc bằng mắt thường. |
| Độ dài đúng khoảng đã định (video dọc khoảng 90 giây theo khuôn chuẩn; video ngang 60–150 giây, `04_he_truc_dung.md` mục 6.2) | Đối chiếu thời lượng file xuất với thời lượng dự kiến khi duyệt kịch bản — lệch quá 10-15 giây là dấu hiệu một cảnh bị dựng sai nhịp hoặc phụ đề chạy chữ tính sai mốc thời gian. |
| Dung lượng file hợp lý, không quá nặng để gửi qua Zalo | Kiểm dung lượng file thực tế; nếu vượt ngưỡng thường gửi được qua Zalo, báo cho Trung trước khi giao thay vì để Trung tự phát hiện lúc gửi không được. |
| Tên file video đúng quy ước `yyyy.mm.dd.<chủ đề>_v<n>[_nhap\|_cuoi].mp4`, không ghi mã dựng | Đối chiếu tên file thực tế với quy ước ở `AGENTS.md` mục "Quy ước sản phẩm" và `san_pham/README.md` — chú ý phần đuôi `_nhap`/`_cuoi` khi cùng ngày có cả bản nháp lẫn bản cuối. Tổ hợp trục và cách làm ghi trong kịch bản và `nguon_goc.md`, không đưa vào tên file. Video cũ giữ tên cũ. |

Video ngang (khổ 1920×1080) có thêm các kiểm riêng ngoài bảng này: quét mọi khung tìm khung hỏng, tương phản vật chính 3:1, vật chính cao ít nhất 1/4 khung, lời đọc không nhắc video khác, kiểm chứng nguồn; xem `10_video_ngang_thuyet_minh.md` mục 2 và `03_kich_ban_va_loi_viet.md` mục 5.

## 6. Lớp hoàn thiện và thanh chất lượng (thêm 27/10/2026)

Áp cho mọi video dựng bằng mã (Remotion, HTML một trang, HyperFrames, Blender ghép Remotion). Mức tối thiểu theo chất liệu nằm ở khoá `lop_hoan_thien` của `tai_san/thu_phap/thu_vien_thu_phap.json`: mười yêu cầu chung (mã HT-CH-01 đến HT-CH-10, mỗi yêu cầu kèm cách kiểm) cộng yêu cầu riêng theo nhóm chất liệu (2D phẳng, nét vẽ, đồ thị, 3D, chữ động). Thanh chất lượng đo được: `07_khuon_prompt_va_kiem_chat_luong.md` mục 9. Ngưỡng ghi "đề xuất" trong thư viện chưa thử trên video thật. Lệnh `ffmpeg` dùng bản `xuong_thu_hyperframes/bin/ffmpeg` (bản kèm Remotion thiếu `ebur128`).

| Mục | Ngưỡng | Cách kiểm cụ thể |
|---|---|---|
| Lớp hoàn thiện đủ | Đủ mười yêu cầu chung và yêu cầu của nhóm chất liệu video đang giao | Mở `lop_hoan_thien`, đi từng yêu cầu, chạy cách kiểm ghi kèm. Yêu cầu nào không đạt thì ghi mã và lý do vào mục "Kết quả dùng thử" của kịch bản |
| Đứng hình | Tổng không quá khoảng 1 giây mỗi 30 giây, không đoạn nào quá nửa giây; video khoa học có giọng: không đoạn nào quá 1,5 giây, áp chung cho mọi cảnh kể cả cảnh toàn đồ thị (Trung chốt 28/10/2026). Cảnh đồ thị đạt ngưỡng này bằng dải sáng quét nền bắt buộc (`10_video_ngang_thuyet_minh.md`, thành phần `tai_san/khoi_dung_san/DaiQuet.tsx`), không có ngưỡng riêng | `ffmpeg -i v.mp4 -vf "fps=10,freezedetect=n=-60dB:d=0.5" -an -f null - 2>&1 \| grep freeze_` (cách đo và số đo thử: `07` mục 9). Video có lớp hạt nhiễu thì xuất bản không hạt để đo, vì hạt làm lệnh báo 0 đoạn |
| Tương phản chữ | Chữ trên nền tối thiểu 4,5:1 (tông có bộ kiểm 7:1 thì giữ 7:1); vật chính trên nền 3:1 | `python3 scripts/do_tuong_phan_khung.py <khung.jpg> <x,y chữ>:<x,y nền>`; script cài ngưỡng 3:1 nên chữ so 4,5:1 bằng số in ra |
| Tương phản vật có mặt sáng; đo chiều cao vật (thêm 28/10/2026) | Như dòng trên: vật chính trên nền 3:1, cao ít nhất 1/4 khung | Vật có mặt sáng (mặt số, màn hình): đo trung bình cả vùng vật, không đo một điểm ở thân tối (thân tối 12:1 nhưng cả đồng hồ chỉ 2:1; lô 18 video, N21). Đo chiều cao vật trên khung bằng mặt nạ màu của vật, lọc nét chữ bằng MaxFilter 7 rồi MinFilter 15 (Pillow) để khung bao không ăn cả chữ (N25) |
| Hiểu được khi tắt tiếng | Người phản biện xem bản không tiếng và tờ ghép khung, nêu đúng ý chính của video | `07` mục 8 (người phản biện độc lập); đối chiếu với kịch bản |
| Không chữ đè | Không chữ đè chữ, đè vật chính, tràn mép | Tờ ghép khung; LM-03: hàm `window.kiemTra(t)` của trang; LM-04: `npx hyperframes check`; Remotion: khung cắt từ chính file mp4 (`scripts/soat_khung_mp4.py`) |
| Không phần tử sót cảnh | Không phần tử của cảnh trước còn lại ở cảnh sau | Khung dày ±0,5 giây quanh mỗi chuyển cảnh |

## Xếp thư mục giao (thêm 27/10/2026)

Làm sau khi qua 6 nhóm trên, theo `AGENTS.md` mục "Quy ước sản phẩm".

| Mục | Cách kiểm cụ thể |
|---|---|
| Đúng một video ngoài cùng thư mục | `ls san_pham/<thư mục video>/` chỉ thấy một file `.mp4` (`_cuoi`, hoặc `_nhap` khi chưa duyệt), hình thu nhỏ bản tải lên nếu có, và thư mục `tai_nguyen/`. |
| Bản nháp trùng đã bỏ | Với mỗi bản `_nhap` còn lại, `cmp` với bản `_cuoi`: giống hệt thì bỏ vào Thùng rác, khác thì để trong `tai_nguyen/ban_nhap/`. |
| Tài nguyên đủ | `tai_nguyen/kich_ban/` có kịch bản `.md`, file chương hoặc cảnh, nguồn kiểm chứng, file tóm tắt `<thư mục>.tom_tat.md` khớp bản cuối (`01_quy_trinh_chung.md` mục 2); `tai_nguyen/am_thanh/` có bản chép `giong/` và `nhac/` từ `public/` của dự án dựng; `tai_nguyen/nguon_goc.md` ghi đúng thư mục mã dựng và thành phần Remotion của bản cuối. |
| Git đúng phần | `git status` chỉ thấy file trong `tai_nguyen/kich_ban/`, các file `.md` trong `tai_nguyen/dang_bai/` và `nguon_goc.md` của thư mục này; không có `.mp4`, `.wav`, `.mp3` nào được thêm vào git. |

## Kiểm chữ đăng (thêm 28/10/2026)

Làm ở bước 8 (chuẩn bị đăng), sau khi xếp thư mục giao, theo skill `skills/viet-chu-dang-video/`.

| Mục | Cách kiểm cụ thể |
|---|---|
| Giới hạn nền tảng và quy ước xưởng | `python3 -I skills/viet-chu-dang-video/scripts/kiem_chu_dang.py san_pham/<thư mục video>` ra 0 lỗi: độ dài tiêu đề, mô tả (ký tự và byte), thẻ, chú thích TikTok; hashtag không dấu, tối đa 3 (YouTube, TikTok) hoặc 5 (Facebook); mốc chương; từ cấm; liên kết trong chú thích Facebook. Từng dòng NHẮC đã xem và sửa hoặc ghi lý do giữ. |
| Con số khớp kịch bản | Mọi con số trong tiêu đề, mô tả, chú thích có trong `tai_nguyen/kich_ban/` (script nhắc số lạ, nhưng không so đơn vị: tự đọc lại). |
| Nhãn AI | YouTube, TikTok khai khi có clip AI tả thực hoặc nhạc AI; Facebook bật cho mọi video có giọng VieNeu (`skills/viet-chu-dang-video/quy_dinh_nen_tang.md` mục 1). |
| Trung đã duyệt | Trung đã chọn 1 trong 3 tiêu đề và duyệt `madeForKids`, `containsSyntheticMedia`; ngày duyệt ghi ở đầu file. |

## Kiểm phân phối (thêm 29/10/2026)

Làm ở bước 8, sau kiểm chữ đăng, theo skill `skills/toi-uu-phan-phoi/`.

| Mục | Cách kiểm cụ thể |
|---|---|
| Thông số file từng nơi đăng | `python3 -I skills/toi-uu-phan-phoi/scripts/kiem_dang.py san_pham/<thư mục video>` ra 0 LỖI: khổ, độ dài (Shorts tối đa 180 giây, Facebook qua API 3–90 giây), khung/giây, mã hoá hình và tiếng, độ phân giải. |
| Nhãn AI | Đúng dòng "Nhãn AI" script in ra (đọc từ `nguon_goc.md` và kịch bản). |
| Việc làm tay | Danh sách "Việc làm tay" script in ra đã chép vào báo cáo cho Trung (Video liên quan cho Shorts, Content Check Lite của TikTok, nhãn AI Facebook). |

## Câu hỏi cuối — phần máy không soát hộ được

Sau khi qua đủ 6 nhóm trên, tự hỏi một câu mang tính phán đoán con người: **nếu một người ngoài cuộc xem video này lần đầu, không biết bối cảnh, họ có hiểu đúng thông điệp không — hay sẽ hiểu lệch, hiểu thiếu, hoặc hiểu theo hướng gây bất lợi cho Trung?**

Không có công cụ nào trả lời được câu này bằng cách đếm khung hình hay đo mốc thời gian — nó đòi hỏi hình dung ra phản ứng của một người xem thật, lần đầu, không có ngữ cảnh mà người dựng đang có sẵn trong đầu. Nghi ngờ ở câu này thì hỏi Trung trước khi giao, không tự tin cho qua.
