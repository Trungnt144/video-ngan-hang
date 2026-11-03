---
name: dang-youtube
description: "Tải video của Media lên kênh YouTube theo lô bằng YouTube Data API (công cụ youtubeuploader chạy qua Bash, không qua Chrome): đọc file kê khai JSON (tiêu đề, mô tả có chương, thẻ, thumbnail, phụ đề, playlist, giờ đăng, nhãn trẻ em, nhãn nội dung AI), kiểm giới hạn của YouTube, tạo và xếp danh sách phát của kênh theo file cấu hình, tải từng video, ghi sổ trạng thái để chạy lại không tải trùng, dừng khi hết hạn mức. Sửa video đã tải bằng yutu. Dùng khi Trung nói: đăng YouTube, tải video lên YouTube, tải lô lên YouTube, chạy lô YouTube, lên lịch đăng YouTube, đẩy video lên kênh, danh sách phát, playlist, xếp video vào danh sách. KHÔNG dùng cho: viết tiêu đề, mô tả, hashtag (skill viet-chu-dang-video), săn trend (san-trend), đăng Reels lên Trang Facebook (skill dang-facebook), đăng TikTok (chưa có công cụ)."
version: 1.3.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-27
  nghien_cuu: "~/Documents/Grok/Su dung grok/research/2026-10-27_youtube-tai-len-theo-lo/99_final_report.md"
  related_modules: [13_ban_quyen_va_bao_mat.md, 15_bang_kiem_truoc_khi_giao.md]
---

# Tải video lên YouTube theo lô

Skill này tải video bản cuối của Media lên kênh YouTube "Chuyện nghề Điện" bằng API chính thức. Claude chạy công cụ dòng lệnh qua Bash. Mỗi lô là một file kê khai JSON; sổ trạng thái ghi mã video đã lên để chạy lại không tải trùng.

**Quyết định Trung đã chốt (27/10/2026):**

- Tải lô bằng API, không điều khiển Chrome. Claude in Chrome chỉ nhận file dưới 10 MB nên không tải được video, và mỗi lần chỉ làm được một video.
- Dựng mới theo báo cáo nghiên cứu: `youtubeuploader` (porjo, bản 1.25.5) để tải, `yutu` (eat-pray-ai, bản 0.11.0) để sửa và đọc trạng thái. Cả hai cài ở `~/.local/bin`.
- Skill đặt ở Media (Claude đề xuất Lan toa AI). Trước khi chuyển video sang công khai, đối chiếu danh sách an toàn 10 mục ở `Lan toa AI/02_kenh_truyen_thong.md`.
- Video bức xạ mặt trời (mã sổ nợ N29) đã tải tay qua Chrome, riêng tư, mã `-W2gdiObMiE`; sổ trạng thái ghi `da_co` để lô bỏ qua.

## Việc làm một lần: khoá OAuth (Trung làm, khoảng 15 phút)

Claude không làm thay được vì phải đăng nhập Google.

1. Xác minh kênh bằng số điện thoại ở youtube.com/verify, nếu chưa làm. Chưa xác minh thì không đặt được thumbnail tuỳ chỉnh và video bị giới hạn 15 phút.
2. Vào console.cloud.google.com, tạo dự án mới, ví dụ `chuyen-nghe-dien-upload`.
3. APIs & Services → Library → tìm "YouTube Data API v3" → Enable.
4. Google Auth Platform (OAuth consent screen) → loại người dùng External → điền tên ứng dụng và email → thêm chính tài khoản Google của kênh vào Test users.
5. Mục Audience → bấm **Publish app** để chuyển sang In production. Để ở Testing thì quyền hết hạn sau 7 ngày, lô tự động hỏng mỗi tuần. Ứng dụng dùng cá nhân không bắt buộc qua xác minh của Google, chỉ hiện cảnh báo "Google hasn't verified this app" lúc đăng nhập (bấm Advanced → Go to …).
6. Clients (Credentials) → Create credentials → OAuth client ID → loại **Web application** → Authorized redirect URIs thêm `http://localhost:8080/oauth2callback` → Create → tải file JSON.
7. Lưu file thành `~/.config/dang-youtube/client_secrets.json`, quyền 600. Không đặt trong thư mục project, không đưa cho Grok hay Hermes.

Một khoá này dùng chung cho cả `youtubeuploader` và `yutu`, vì yutu lấy địa chỉ chuyển hướng từ file khoá. Lần chạy thật đầu tiên trình duyệt mở trang đăng nhập Google: chọn tài khoản **trungnt.educare@gmail.com**, chủ kênh Chuyện nghề Điện (mã kênh `UCMo-VX6bf8_SNu8tUa5wiMw`). Chọn nguyenthanhtrung144@gmail.com thì quyền cấp cho kênh cá nhân Nguyễn Thành Trung: ngày 27–28/10/2026 đã có 6 video lên nhầm kênh đó. Từ 28/10 script kiểm kênh của token trước khi tải và dừng nếu sai (cờ `--kenh`). Token lưu ở `~/.config/dang-youtube/request.token`.

## Kênh thứ hai trở đi: mỗi kênh một thư mục khoá (thêm 30/10/2026)

| Kênh | Mã kênh | Thư mục khoá (`--khoa`) |
|---|---|---|
| Chuyện nghề Điện | `UCMo-VX6bf8_SNu8tUa5wiMw` (mặc định của `--kenh`) | `~/.config/dang-youtube/` |
| Chuyện nghề Ngân hàng | `UCPhmM6_u0fTr5mWcpJiNm-w` | `~/.config/dang-youtube/ngan_hang/` |

Cả hai kênh là kênh thương hiệu của trungnt.educare@gmail.com, dùng chung một dự án OAuth. Thêm kênh mới: tạo thư mục khoá, liên kết `client_secrets.json` về file chung (`ln -s ../client_secrets.json`), rồi `python3 -I skills/dang-youtube/scripts/dang_nhap.py --khoa <thư mục> --kenh <UC…>`. Script mở trang đăng nhập (Trung chọn tài khoản rồi chọn đúng kênh), không tải video nào, chỉ ghi `request.token` khi token đúng kênh, không ghi đè token có sẵn. Mã UC tra trước bằng `channels?forHandle=<tên @>` với token kênh cũ. `chay_lo.py` dừng nếu thư mục khoá chưa có token (trước 30/10 youtubeuploader sẽ tự đăng nhập và tải video đầu trước khi kiểm kênh). Lệnh tải, gắn hình cho kênh khác kênh Điện luôn kèm `--khoa` và `--kenh`. Cũng điền `ma_kenh`, `khoa_youtube` của chiến dịch trong `scripts/bang_video/chien_dich.json`.

Kênh mới (đo 30/10/2026, kênh Ngân hàng chưa xác minh số điện thoại): `uploadLimitExceeded` sau 10 video trong khoảng 3 phút; hình thu nhỏ tuỳ chỉnh bị từ chối (403 "doesn't have permissions to upload and set custom video thumbnails"). Giới hạn tính theo kênh, gộp cả web, điện thoại và API, nên đổi công cụ không vượt được. Trung xác minh số điện thoại cùng tối: hình thu nhỏ gắn được ngay và 27 video tải tiếp trong ngày không bị chặn (37 video một ngày). Kênh mới: xác minh số điện thoại ở youtube.com/verify (chọn đúng kênh) trước lô đầu.

## Quy trình mỗi lô

0. **Trước khi tải (thêm 29/10/2026):** mỗi video chạy `python3 -I skills/toi-uu-phan-phoi/scripts/kiem_dang.py san_pham/<thư mục>` ra 0 LỖI; việc làm tay script in ra (Video liên quan cho Shorts, Test & Compare) chép vào báo cáo cho Trung.
1. **Soạn file kê khai** ở `du_lieu/dang_youtube/lo_<yyyy.mm.dd>_<ten>.json`, theo khuôn `skills/dang-youtube/mau_ke_khai.json`. Từ 28/10/2026: tiêu đề, mô tả, thẻ, nhãn trẻ em, nhãn AI, danh sách phát viết bằng skill `viet-chu-dang-video` (file `tai_nguyen/dang_bai/youtube.md` của từng video), rồi `python3 -I skills/viet-chu-dang-video/scripts/xuat_ke_khai.py san_pham/<thư mục>... --ten <tên> --ghi` sinh file kê khai này; chỉ còn giờ đăng `publishAt` và thumbnail phải điền tay. Mỗi video một mã, dùng mã sổ nợ (N29, N21…).
2. **Trung duyệt file kê khai.** Ba nhóm trường là lời khai thay chủ kênh, Claude không tự quyết: `madeForKids`, `containsSyntheticMedia` (true khi video có cảnh AI trông như thật, ví dụ clip Veo, Omni, Muse; hoạt cảnh Remotion và đồ thị thì false), `privacyStatus` cùng `publishAt`. Script từ chối chạy nếu hai nhãn đầu không ghi rõ true hoặc false.
3. **Chạy thử:** `python3 -I skills/dang-youtube/scripts/chay_lo.py du_lieu/dang_youtube/lo_….json`. Script kiểm từng video (file có thật, tiêu đề ≤ 100 ký tự, mô tả ≤ 5.000 byte, thẻ ≤ 500 ký tự, không có ký tự < >, mốc chương bắt đầu 00:00 và ≥ 3 mốc, thumbnail JPG/PNG ≤ 50 MB, giờ đăng có múi giờ và sau lúc chạy ≥ 15 phút), in lệnh sẽ chạy, không tải gì.
4. **Chạy thật:** thêm `--chay-that`. Mặc định tối đa 5 video mỗi ngày (`--toi-da`); lô video riêng tư để Trung duyệt rồi hẹn giờ thì tăng `--toi-da`, đã chạy 60 video một ngày (xem bảng Giới hạn). Mỗi video lên xong, script ghi ngay mã video vào `du_lieu/dang_youtube/so_trang_thai.jsonl`, kể cả khi bước thumbnail hoặc phụ đề sau đó lỗi. Từ 01/11/2026 script cũng sửa dòng "Trạng thái" của mục cùng mã (N<số>) trong `so_no_cong_viec.md` thành "Đã tải lên" kèm link, vì sổ nợ ghi chậm từng làm phiên điều phối chia nhầm 36 video đã lên kênh. Danh sách video còn phải làm: `python3 scripts/hang_con_lai.py`.
5. **Báo Trung:** danh sách link `https://youtu.be/<mã>`, chế độ YouTube trả về, video nào hoãn.

**Gắn thumbnail cho video đã lên kênh** (thumbnail làm sau khi tải, 28/10/2026): `python3 -I skills/dang-youtube/scripts/gan_thumbnail.py` chạy thử, thêm `--chay-that` để gắn. Script lấy file `*hinh_thu_nho*.jpg` có số phiên bản lớn nhất trong thư mục sản phẩm, tìm mã video trong sổ trạng thái, gọi `thumbnails.set` (50 đơn vị hạn mức, ảnh ≤ 2 MB), ghi `du_lieu/dang_youtube/so_thumbnail.jsonl` để lần sau không gắn lại. Muốn thay ảnh đã gắn bằng bản mới thì xoá dòng tương ứng trong sổ hoặc đổi số phiên bản.

Đặt chế độ riêng tư kèm giờ đăng (`publishAt`) để rải video ra nhiều ngày. Trung xem lại trên Studio trước giờ đăng; tới giờ video tự công khai.

## Giới hạn (tính đến 27/10/2026, đo thực tế 30/10/2026)

| Giới hạn | Số | Ghi chú |
|---|---|---|
| Lượt tải mỗi ngày của dự án | 100 | Kho hạn mức riêng của `videos.insert`, 1 đơn vị mỗi lượt (từ 01/06/2026) |
| Kho chung các lệnh khác | 10.000 đơn vị/ngày | Thumbnail 50, playlist 50, phụ đề 400 đơn vị mỗi video. Lô kèm phụ đề và thumbnail (450 đơn vị/video) chỉ được khoảng 22 video/ngày; lô lớn thì tải video và thumbnail trước, gắn phụ đề ngày sau |
| Video mỗi ngày của kênh | không công bố; kênh này đã tải 60 video riêng tư trong một ngày hạn mức, chưa chạm giới hạn | Đo từ sổ trạng thái: 28/10/2026, 07:49–09:xx giờ Việt Nam, 60 video `private` lên hết, không có `uploadLimitExceeded`. Con số "khoảng 6–12" từ báo cáo người dùng khác (08–10/2026) không đúng với kênh này. Giới hạn thật chưa đo vì chưa chạm. `--toi-da` vẫn mặc định 5 để tránh tải nhầm cả lô |
| Giờ đặt lại hạn mức | 0 giờ giờ Thái Bình Dương | 14 giờ Việt Nam; từ 01/11/2026 là 15 giờ |

Đã kiểm 29/10/2026: dự án API KHÔNG bị khoá chế độ riêng tư. Video `jas2rPsf7Bk` tải lên bằng API, hẹn giờ công khai qua `cap_nhat_youtube.py` (publishAt), tự chuyển sang public đúng 14:00 và xem được từ ngoài. Phần dưới giữ để tham khảo nếu sau này dự án đổi trạng thái. Muốn biết, tải một video với `privacyStatus: "unlisted"`: script dừng lô nếu YouTube trả về `private`. Nếu bị khoá, nộp biểu mẫu "YouTube API Services – Audit and Quota Extension".

## Lỗi thường gặp

| Script báo | Nguyên nhân | Làm gì |
|---|---|---|
| hết hạn mức dự án (`quotaExceeded`) | Dùng hết 100 lượt hoặc 10.000 đơn vị trong ngày | Sổ ghi `hoan`; chạy lại sau giờ đặt lại |
| kênh chạm giới hạn (`uploadLimitExceeded`) | Giới hạn số video của kênh trong 24 giờ | Sổ ghi `hoan`; chạy lại sau 24 giờ, giảm `--toi-da` |
| token hết hạn (`invalid_grant`) | Ứng dụng còn ở chế độ Testing (7 ngày) hoặc Trung thu hồi quyền | Bấm Publish app; xoá `request.token`, chạy lại để đăng nhập |
| video đã lên nhưng bước sau lỗi | Thumbnail hoặc phụ đề bị từ chối (kênh chưa xác minh, file sai) | Video đã có trong sổ; đặt lại thumbnail bằng `yutu` hoặc Studio |

## Đặt ảnh bìa kênh (thêm 28/10/2026)

`python3 -I skills/dang-youtube/scripts/dat_anh_bia_kenh.py san_pham/<thư mục>/<ảnh>.jpg` chạy thử (kiểm file, kiểm token đúng kênh Chuyện nghề Điện, in ảnh bìa hiện tại, không ghi gì); thêm `--chay-that` khi Trung đã duyệt ảnh. Hai bước API: `channelBanners.insert` tải ảnh, `channels.update` (part `brandingSettings`) gắn ảnh; script đọc phần thương hiệu hiện có và gửi lại nguyên để tên, mô tả, từ khoá không bị xoá, lưu phần cũ và địa chỉ ảnh bìa cũ vào `du_lieu/dang_youtube/so_bia_kenh.jsonl`, rồi đọc lại để so. Ảnh JPG hoặc PNG, tối đa 6 MB, tối thiểu 2048×1152, tỉ lệ 16:9. Làm ảnh bìa: `xuong_html/anh_bia_kenh/`. Lần đầu: 28/10/2026, ảnh bìa v3 của kênh Chuyện nghề Điện (trước đó kênh chưa có ảnh bìa). Không dùng yutu cho việc này: yutu đăng nhập lỗi `redirect_uri_mismatch`.

## Màn hình kết thúc (thêm 30/10/2026)

YouTube Data API không có lệnh cho màn hình kết thúc và thẻ: làm trên YouTube Studio (Trình biên tập → Màn hình kết thúc). Kênh Ngân hàng có mẫu ở video N129 (`P0RBs_cbrlk`): ô trái là video chỉ định (video "Xem tiếp" đầu tiên trong mô tả), ô phải "Phù hợp nhất với người xem", nút đăng ký sát logo, đặt khớp khung chờ dựng sẵn cuối video (logo kênh và hai ô "Xem tiếp", "Xem thêm", dài khoảng 9 giây). Video khác: "Áp dụng mẫu" → "Nhập từ video" → chọn N129 → đổi video ô trái; video không có khung chờ thì đặt cả ba ô hiện 5 giây cuối (mức ngắn nhất YouTube cho phép). Lỗi hay gặp: ô trái tự trỏ vào chính video (Studio báo "không được quảng bá chính video") khi video đang sửa là video đích của mẫu. 30/10/2026 đã làm cho cả 37 video lô đầu (19 có khung chờ, 18 không). Video mới nên dựng sẵn khung chờ cuối video như N129.

## Danh sách phát (thêm 02/11/2026)

Kênh Chuyện nghề Ngân hàng có 15 danh sách phát Trung chốt 02/11/2026: 3 danh sách lối vào theo người xem (khách vay cá nhân, doanh nghiệp, ôn thi ngân hàng) và 12 danh sách nghiệp vụ, tất cả công khai. Nguồn duy nhất là `du_lieu/dang_youtube/danh_sach_phat_ngan_hang.json`: tên, mô tả hai câu (dành cho ai, xem theo thứ tự nào), chế độ hiển thị, thứ tự mã sổ nợ (kể cả bản nháp chưa lên kênh) và `playlistId` do script ghi khi tạo. Mỗi video đúng một danh sách loại `nghiep_vu`; danh sách `loi_vao` được trùng. Ô `playlistTitles` trong `youtube.md` của video kênh này không dùng nữa.

- `python3 -I skills/dang-youtube/scripts/danh_sach_phat.py` chạy thử: kiểm token đúng kênh, đọc danh sách trên kênh, in việc sẽ làm và số đơn vị hạn mức. Thêm `--chay-that` để tạo danh sách thiếu (`playlists.insert`), sửa tên, mô tả, chế độ hiển thị lệch cấu hình (`playlists.update`), chèn video thiếu đúng vị trí (`playlistItems.insert`) và dời video đứng sai (`playlistItems.update`); mỗi lệnh 50 đơn vị, ghi `du_lieu/dang_youtube/so_danh_sach_phat.jsonl`. Không gỡ video nào, chỉ báo video ngoài cấu hình. Luôn đọc lại danh sách trên kênh nên chạy lại không gắn trùng; hết hạn mức thì dừng, chạy lại sau 15 giờ là làm tiếp.
- **Video mới:** phiên làm video thêm mã vào đúng chỗ trong một danh sách nghiệp vụ (và danh sách lối vào nếu hợp) của file cấu hình trước khi chạy `xuat_ke_khai.py`; script này điền `playlistTitles` từ file cấu hình và nhắc nếu mã chưa có. youtubeuploader cho video vào danh sách theo tên khi tải (nối vào cuối; tên phải khớp từng ký tự, sai tên là nó tạo danh sách mới). Sau lô tải chạy `danh_sach_phat.py --chay-that` để dời video về đúng vị trí, rồi `them_xem_ca_loat.py` của skill `viet-chu-dang-video` để thêm dòng "Xem cả loạt" vào mô tả.
- **Đổi tên danh sách:** sửa `tieu_de` trong file cấu hình rồi chạy script; đừng đổi tên trên Studio mà không sửa file cấu hình.
- Chi phí lần đầu: 15 danh sách, 133 lượt gắn, khoảng 7.400 đơn vị. Lần chạy 02/11/2026 lúc 01 giờ hết hạn mức sau 9 danh sách và 99 lượt gắn (các phiên khác đã dùng khoảng 4.600 đơn vị trong ngày), phần còn lại chạy sau 15 giờ.
- **Hai giới hạn gặp ngày 02/11/2026.** (1) youtubeuploader không thấy danh sách đúng tên thì tự tạo danh sách **riêng tư, không mô tả**; `danh_sach_phat.py` dừng và báo mã danh sách đó, ghi `playlistId` vào cấu hình rồi chạy lại để script sửa thành công khai, có mô tả. Vì vậy chạy `danh_sach_phat.py` tạo đủ danh sách trước khi tải lô có video thuộc danh sách mới. (2) Tạo, sửa danh sách (`playlists.insert`, `playlists.update`) bị YouTube chặn bằng lỗi 429 `RATE_LIMIT_EXCEEDED` sau khoảng 15 lần tạo, sửa trong 24 giờ, dù hạn mức ngày còn; chèn, dời video không bị chặn. Script tự chờ 30, 60, 120, 240 giây rồi thử lại; lệnh sửa vẫn lỗi thì bỏ qua, gắn video tiếp, chạy lại hôm sau. Mỗi lần thử lỗi vẫn có thể tính hạn mức, nên đừng chạy lại liên tục trong ngày. (3) Lệnh tạo báo 429 vẫn có thể đã tạo danh sách (gặp 03/11/2026: "Nghề ngân hàng" xuất hiện riêng tư trên kênh): trước khi chạy lại, liệt kê danh sách của kênh, thấy đúng tên và chỉ một bản thì ghi `playlistId` vào cấu hình, không tạo thêm.
- **Làm tay trên YouTube Studio** (API không có lệnh): xếp mục trang chủ kênh ở Tuỳ chỉnh kênh → Bố cục (video giới thiệu, ba danh sách lối vào, video mới, rồi 12 danh sách nghiệp vụ); màn hình kết thúc trỏ về danh sách.
- Không dùng yutu cho việc này: yutu đăng nhập lỗi `redirect_uri_mismatch`.

## Sửa video đã tải bằng yutu

Sửa tiêu đề, mô tả, thẻ theo chữ đăng đã duyệt: `xuat_ke_khai.py` sinh `du_lieu/dang_youtube/cap_nhat_<ngày>_<tên>.json` cho video đã có trong sổ trạng thái, rồi `python3 -I skills/viet-chu-dang-video/scripts/cap_nhat_youtube.py <file> --chay-that`: gọi thẳng API bằng `request.token` của skill này, chỉ gửi phần snippet nên giữ nguyên chế độ riêng tư, ghi `so_cap_nhat.jsonl` (chạy thật lần đầu 28/10/2026 trên video `wwCUwgluEmo`). Phần dưới cho việc sửa lẻ bằng yutu; yutu chưa đăng nhập được vì địa chỉ quay về `http://localhost:8216` chưa khai trong OAuth client của dự án `chuyennghedien` (Google báo `redirect_uri_mismatch`), muốn dùng thì thêm địa chỉ đó ở Google Auth Platform → Clients.


Đăng nhập một lần: `cd ~/.config/dang-youtube && yutu auth --credential client_secrets.json --cacheToken youtube.token.json`. Phải đứng trong thư mục khoá: yutu chỉ đọc file trong thư mục đang đứng (biến `YUTU_ROOT`), đường dẫn ngoài đó bị hiểu là chuỗi base64 và báo "illegal base64 data" (gặp 28/10/2026). Đọc trạng thái: `yutu video list --ids <mã> --output json` (chạy trong thư mục khoá, cùng hai cờ khoá trên, hoặc đặt biến `YUTU_CREDENTIAL`, `YUTU_CACHE_TOKEN`). Lệnh sửa (`yutu video update`, `yutu thumbnail set`) hỏi xác nhận; chạy qua Claude thì thêm `--yes`, và chỉ chạy khi Trung đã duyệt giá trị mới. `videos.update` của API xoá các trường không gửi kèm (trừ nhãn trẻ em và nhãn AI), nên khi sửa phải gửi đủ tiêu đề, mô tả, thẻ.

## Chính sách phải nhớ

- Chính sách spam của YouTube có mục "Automated or synthetic mass-production" (từ khoảng 06/2026), nêu ví dụ kênh dùng hình AI lặp lại và kịch bản đọc bằng giọng máy. Mỗi video trong lô phải khác nhau thật về nội dung; dùng mục 6 "Chống nhàm chán khi làm nhiều video" ở `04_he_truc_dung.md`.
- Chủ kênh phải biết và đồng ý trước với từng việc tự động: không đổi chế độ riêng tư khác với file kê khai đã duyệt.
- Tải tay qua Chrome vẫn được cho từng video lẻ, nhưng mục "Sử dụng AI" trên Studio Trung phải tự chọn (bộ kiểm quyền chặn Claude chọn thay, 27/10/2026).
