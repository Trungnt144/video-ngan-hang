# Bảng theo dõi video Media

> Lập 27/10/2026. Trung chốt qua bảng chọn ngày 27/10/2026: máy chủ nhỏ trên Mac, nút chuyển lệnh tự chạy Claude, đoạn xem nhanh ghép 8 giây, bật khi cần (không tự bật cùng máy; từ 27/10/2026 bật bằng biểu tượng trên màn hình nền, máy chủ chạy ngầm, tắt bằng nút trên trang), quyền chế độ auto, model Opus mặc định đổi được sang Sonnet, liệt kê video và cảnh thử (bỏ tài liệu).

## Bật, tắt

**Cách chính (từ 27/10/2026):** bấm đúp biểu tượng **Media Project** trên màn hình nền (tên cũ "Bảng video", đổi 28/10/2026). Máy chủ chưa chạy thì được bật ngầm (không hiện cửa sổ dòng lệnh), rồi trang `http://localhost:4580` mở trong trình duyệt; máy chủ đang chạy thì chỉ mở trang. Tắt: nút **Tắt máy chủ** ở góc phải dải đầu trang (hỏi xác nhận, báo trước nếu Claude đang làm lệnh hoặc còn lệnh chờ). Nhật ký máy chủ ghi vào `du_lieu/bang_video/may_chu.log` (ngoài git); bật không được thì ứng dụng hiện hộp báo kèm đường dẫn nhật ký.

Biểu tượng gọi `scripts/bang_video/mo_bang.sh`. Trang mở trong một cửa sổ Chrome riêng của bảng (hồ sơ `~/Library/Application Support/BangVideoChrome`, cửa sổ kiểu ứng dụng, không thanh địa chỉ), không mở bằng trình duyệt mặc định: máy thường có Chrome chạy ẩn do Puppeteer/Remotion bật khi kết xuất video, và `open <địa chỉ>` có lúc gửi trang vào bản ẩn đó nên Trung bấm biểu tượng mà không thấy gì (gặp 27/10/2026). Không có Chrome thì mở bằng Safari. Tạo lại ứng dụng (đổi hình, chuyển thư mục Media, lỡ xoá khỏi màn hình nền):

```bash
bash ~/Documents/VideoNganHang/scripts/bang_video/ung_dung/tao_ung_dung.sh
```

Script vẽ hình bằng `ung_dung/ve_bieu_tuong.py` (Pillow; bản 1024 điểm ảnh lưu `ung_dung/bieu_tuong_1024.png`), đóng gói bằng `osacompile` thành `~/Desktop/Media Project.app` và ký tạm trên máy. Khung ứng dụng tự viết với file chạy là script bash bị macOS từ chối mở (lỗi -10669), nên phải dùng `osacompile`.

**Cách phụ:** chạy trong cửa sổ dòng lệnh để thấy nhật ký trực tiếp, tắt bằng Ctrl+C:

```bash
bash ~/Documents/VideoNganHang/scripts/bang_video/chay.sh
```

Tắt máy chủ khi Claude đang làm lệnh thì lượt đó dừng giữa chừng và bị ghi "Lỗi" khi bật lại; lệnh đang chờ vẫn giữ và chạy khi bật lại. Trang chỉ mở được trên chính máy Mac (máy chủ chỉ nghe địa chỉ 127.0.0.1).

## Trang hiện gì

Mỗi thư mục trong `san_pham/` có file chia chương (`tai_nguyen/kich_ban/*.chuong.json`) hoặc có video ngoài cùng là một thẻ; thư mục tài liệu bị bỏ qua. Xếp theo ngày trong tên thư mục, mới nhất trên cùng; cùng ngày thì thư mục có file sửa gần nhất lên trước. Trang hỏi máy chủ 5 giây/lần.

| Ô | Lấy từ đâu |
|---|---|
| Tên video | Thứ tự (Trung chốt 01/11/2026): tên Trung sửa tay trên bảng (`du_lieu/bang_video/ghi_de.json`); ô `youtube_dai · tieu_de` trong `tai_nguyen/dang_bai/youtube.md`; dòng `# Tóm tắt:` của `.tom_tat.md`; rồi như trước: Dòng "Tiêu đề" trong khối trích dẫn đầu kịch bản, không có thì dòng `#` đầu kịch bản (bỏ chữ "Kịch bản:", mã N, phiên bản), không có thì dòng đầu `nguon_goc.md`. Trung sửa trên trang thì lưu vào `du_lieu/bang_video/ghi_de.json`; nút "Trả về tên gốc" xoá bản sửa. Tên sửa chỉ dùng trên bảng và trong lời nhắc gửi Claude, chưa đổi tên file hay kịch bản Trước 01/11/2026 bảng không đọc `youtube.md` nên video đã đổi tiêu đề vẫn hiện tên lúc viết kịch bản (52 video). Kiểm tên bảng khớp chữ đăng: `python3 -I scripts/bang_video/kiem_ten.py [thư mục…]` (máy chủ phải chạy, mã thoát 1 khi lệch) |
| Trạng thái | Từ file: có `_cuoi.mp4` ngoài cùng là "Đã duyệt bản cuối"; có `_nhap.mp4` ngoài cùng là "Bản nháp chờ duyệt"; chỉ có video trong `tai_nguyen/ban_nhap/` là "Đang làm bản mới" (thư mục mở trong 3 ngày) hoặc "Chỉ có bản thử"; không có video là "Có kịch bản, chưa dựng". Dòng chữ nhỏ dưới là ô "Trạng thái" trong `nguon_goc.md`. Thêm nhãn tím khi có lệnh đang chờ hoặc đang chạy, nhãn vàng khi Claude hỏi lại |
| Tóm tắt nội dung | Đoạn 4–5 câu đọc từ `tai_nguyen/kich_ban/<thư mục>.tom_tat.md` (Trung chốt 28/10/2026, thay danh sách cảnh đánh số); chưa có file thì hiện lời đọc cảnh mở đầu kèm chữ "Chưa có tóm tắt". Tên cảnh vẫn dùng cho ô tìm kiếm |
| Đoạn xem nhanh | 8 đoạn 1 giây rải đều khắp video, ghép thành clip 8 giây không tiếng rộng 480 điểm ảnh, tạo bằng ffmpeg trong `xuong_thu_hyperframes/bin/`, lưu `du_lieu/bang_video/xem_nhanh/`. Video đổi (thời điểm sửa hoặc dung lượng khác) thì tự tạo lại. Rê chuột để chạy; nút "Xem video đầy đủ" phát video gốc có tiếng |
| Ảnh mô tả | File `*hinh_thu_nho*.jpg/png/webp` ngoài cùng thư mục sản phẩm; chưa có thì hiện "Chưa tạo" (cấu phần làm sau) |
| Ý kiến chỉ đạo | Ô viết lệnh, chọn Opus hoặc Sonnet, nút "Chuyển lệnh", lịch sử lệnh của video kèm báo cáo của Claude |
| Nhãn "Trend: …" | Từ khoá trong sổ trend Trung gắn với video này ở thẻ Trend (`du_lieu/bang_video/trend_nhap.json`) |

## Nút "Chuyển lệnh" chạy thế nào

Từ 28/10/2026 (sổ nợ N58 đợt 2, Trung chốt qua bảng chọn): mỗi lệnh chạy thành một **phiên Claude Code chạy nền** Trung xem và trả lời được; tối đa **3 lệnh** làm cùng lúc.

1. Lệnh ghi vào `du_lieu/bang_video/so_lenh.json` với trạng thái "Chờ tới lượt". Máy chủ chạy ngay khi còn chỗ: tối đa 3 lệnh đang làm (lệnh đang chờ Trung trả lời không tính), một video chỉ một lệnh một lúc, tạo trend chỉ một lượt một lúc (cùng dùng Chrome). Kết xuất vẫn đi qua hàng đợi chung `scripts/hang_doi_ket_xuat.sh` (2 chỗ dài, 1 chỗ nhanh) nên 3 lệnh không làm quá RAM.
2. Máy chủ mở phiên nền: `claude --bg --session-id <mã> --name "Bảng video · <tên video>" --remote-control "<tên>" --model <opus|sonnet> --permission-mode auto "<lời nhắc>"` trong thư mục Media (tạo trend thêm `--chrome`). Lời nhắc gồm thư mục sản phẩm, trạng thái, đường dẫn video, kịch bản, `nguon_goc.md`, nguyên văn lệnh của Trung và 7 quy tắc; quy tắc 3 dặn phần nào cần Trung chọn thì hỏi bằng bảng hỏi tích chọn rồi chờ. Mẫu đầy đủ ở hàm `loiNhacLenh` trong `may_chu.mjs`.
3. Máy chủ đọc file hội thoại của phiên (`~/.claude/projects/-Users-macbooktrungnt-Documents-Grok-Media/<mã phiên>.jsonl`) 3 giây một lần: thẻ hiện bước gần nhất, số bước, thời gian, chi phí. Phiên hỏi bằng bảng chọn (hoặc `claude agents` báo phiên đang chặn) thì thẻ hiện nhãn vàng **"Đang chờ Trung"**. Trung trả lời ngay trong phiên bằng một trong ba nút dưới lệnh:
   - **Xem trong Terminal**: mở cửa sổ Terminal chạy `claude attach <mã ngắn>`, xem trực tiếp và gõ trả lời;
   - **Mở trong ứng dụng Claude**: chạy `script -q /dev/null claude --desktop --resume <mã phiên>` để đưa phiên vào thanh bên ứng dụng (lệnh `--desktop` cần cửa sổ dòng lệnh thật nên bọc bằng `script`). Lệnh `--desktop --resume` từ chối phiên nền còn sống, kể cả lúc phiên chỉ đang chờ Trung (báo "That session is running in the background", kiểm 28/10/2026), nên máy chủ dừng phiên nền bằng `claude stop` trước, chờ dừng hẳn, rồi mới đưa vào ứng dụng; hội thoại giữ nguyên, lệnh trên bảng thành "Xong" kèm ghi chú đã chuyển sang ứng dụng. Nút chỉ hiện khi Claude không đang làm; lúc phiên đang chờ Trung thì hỏi xác nhận trước vì câu Claude đang hỏi bị ngắt, Trung gõ câu trả lời vào phiên trong ứng dụng;
   - **Mở trên claude.ai**: địa chỉ claude.ai/code của phiên (Remote Control), mở được cả trên điện thoại.
4. Phiên ghi xong lượt (dòng `turn_duration` trong file hội thoại) thì lệnh thành "Xong", báo cáo cuối hiện dưới lệnh. Ô "Nối tiếp lượt trước" chạy tiếp đúng phiên đó bằng `claude --bg --resume <mã phiên>`. Quá 120 phút làm việc (không tính lúc chờ Trung) máy chủ dừng phiên bằng `claude stop`.
5. Tắt máy chủ không dừng phiên nền; bật lại bảng thì theo dõi tiếp các phiên còn đang làm hoặc đang chờ.

**Lùi về chạy ẩn.** `claude --bg` không mở được phiên thì máy chủ chạy lệnh đó bằng `claude -p ... --output-format stream-json` như trước 28/10 (không tương tác; câu hỏi ghi dưới dòng "CẦN TRUNG TRẢ LỜI:", lệnh mang nhãn "Cần Trung trả lời", trả lời bằng ô "Nối tiếp lượt trước"), và ghi lý do vào đầu báo cáo. Đặt `BANG_VIDEO_PHIEN=an` trước khi bật máy chủ thì luôn chạy ẩn.

**Việc Trung phải làm một lần** (kiểm 28/10/2026, Claude Code 2.1.310): `claude --bg` báo "Workspace not trusted" khi chính thư mục Media chưa có dòng tin cậy riêng trong `~/.claude.json`. Chạy `claude` trong Media KHÔNG sửa được: thư mục nhà `/Users/macbooktrungnt` đã được tin cậy nên phiên tương tác không hiện câu hỏi tin cậy và không ghi gì, còn `claude --bg` lại xét đúng thư mục Media. Trung tự chạy lệnh dưới trong Terminal (lệnh chép lưu `~/.claude.json` sang `~/.claude.json.truoc_tin_cay_media` rồi ghi `hasTrustDialogAccepted: true` cho riêng Media; Claude không tự sửa cấu hình bảo mật):

```bash
python3 -c "import json,os,shutil;p=os.path.expanduser('~/.claude.json');shutil.copy2(p,p+'.truoc_tin_cay_media');d=json.load(open(p));d.setdefault('projects',{}).setdefault('/Users/macbooktrungnt/Documents/VideoNganHang',{})['hasTrustDialogAccepted']=True;t=p+'.tam';json.dump(d,open(t,'w'),indent=2,ensure_ascii=False);os.chmod(t,0o600);os.replace(t,p);print('Da ghi tin cay cho Media')"
```

Chưa có dòng tin cậy thì mọi lệnh lùi về chạy ẩn (đã thử 28/10/2026: báo cáo mở đầu bằng lý do, câu hỏi dưới "CẦN TRUNG TRẢ LỜI", 0,16 USD cho một lệnh chỉ đọc bằng Sonnet).

**Đã thử 28/10/2026** (sau khi ghi dòng tin cậy, Claude ghi thay theo lựa chọn của Trung): một lệnh chỉ đọc mở thành phiên nền, thẻ cập nhật bước, nhãn "Đang chờ Trung" hiện khi phiên hỏi bằng bảng chọn, địa chỉ claude.ai lấy được từ `claude logs`; nút "Mở trong ứng dụng Claude" lúc phiên đang chờ Trung đưa phiên vào thanh bên ứng dụng (tên "Bảng video · <tên video>") sau khi dừng phiên nền. **Chưa thử:** nút xem trong Terminal (`claude attach`). Đặt `BANG_VIDEO_MO_APP=1` thì máy chủ tự đưa mỗi phiên mới vào ứng dụng ngay khi mở; không nên bật, vì việc đưa vào ứng dụng phải dừng phiên nền.

Điều kiện: lệnh `claude` trên máy phải đã đăng nhập (`claude auth login`). Đăng nhập của lệnh `claude` trong Terminal tách riêng với ứng dụng Claude: ứng dụng vẫn chạy bình thường trong khi lệnh `claude` đã hết hạn đăng nhập (gặp 28/10/2026, mọi lệnh từ bảng báo "OAuth session expired" và bị ghi "Lỗi"). Từ 28/10/2026 máy chủ kiểm `claude auth status` và dòng tin cậy của Media khi bật rồi định kỳ (20 giây một lần khi chưa đăng nhập, 2 phút khi đã đăng nhập), hiện dải đỏ "Chưa giao được lệnh" dưới đầu trang nêu việc Trung cần làm; khi chưa đăng nhập thì lệnh mới giữ ở "Chờ tới lượt" và tự chạy khi đăng nhập xong, lượt chạy ẩn hỏng vì hết hạn đăng nhập cũng được trả về hàng chờ. Mỗi lần bấm tốn hạn mức Claude của Trung. Chế độ auto chặn thao tác nguy hiểm (xoá hàng loạt, đẩy git, gửi dữ liệu ra ngoài); thao tác bị chặn thì Claude ghi lại trong báo cáo.

## Thẻ Pha máy (thêm 28/10/2026)

Hiện phiếu việc máy của trình chạy pha máy (`scripts/pha_may/HUONG_DAN.md`): mã phiếu, dự án dựng, trạng thái (Chờ chạy, Máy đang chạy, Máy xong chờ AI soát, Lỗi), giây từng bước, kết quả (chương kết xuất và dùng lại, độ to, đứng hình), cảnh báo; liên kết xem báo cáo, bản đủ, bảng ảnh soát. Nút **Chạy pha máy** bật trình chạy cho mọi phiếu đang chờ (hỏi xác nhận, chạy nền, nhật ký `du_lieu/pha_may/chay.log`); nút **Dừng trình chạy** gửi tín hiệu dừng, lượt kết xuất đang chạy bị tắt, chạy lại thì làm tiếp nhờ bộ đệm chương. Từ 29/10/2026 mỗi dòng phiếu có nút **Chạy riêng** (phiếu chờ) hoặc **Chạy lại** (phiếu đã xong hoặc lỗi, ví dụ pha 3 sửa xong chương), chạy song song được với trình chạy chính, nhật ký `du_lieu/pha_may/chay_<mã>.log` (liên kết "Nhật ký riêng"); phiếu đang chạy có nút **Dừng**, dừng trình chạy đang giữ phiếu đó (trình chạy ấy giữ nhiều phiếu thì các phiếu kia dừng theo, hộp xác nhận nói rõ). Dòng trạng thái liệt kê cả trình chạy riêng. Trang hỏi máy chủ 5 giây một lần khi đang mở thẻ này.

## Thẻ Trend (thêm 28/10/2026)

Trung chốt qua bảng chọn ngày 28/10/2026 (skill `san-trend` bản 3.0). Bấm "Trend" ở dải chọn dưới đầu trang, hoặc mở `http://localhost:4580/#trend`.

| Khối | Làm gì |
|---|---|
| Yêu cầu nghiên cứu trend | Ô chủ đề, từ khoá (để trống là rà chung theo lĩnh vực kênh), khung tuần/tháng/quý, nền tảng Google/YouTube/TikTok/Facebook, mục đích, model (mặc định Sonnet). Nút "Chạy tạo trend" hỏi xác nhận rồi xếp một lệnh vào cùng hàng lệnh với các video. Mỗi lần bấm luôn chạy đầy đủ (script, Claude đọc Chrome, Antigravity rà cùng): ước 30–60 phút, tốn hạn mức Claude và Gemini; Chrome và app Antigravity phải mở |
| Các lượt tạo trend | 4 lượt gần nhất từ bảng: trạng thái, bước đang làm, nút dừng, báo cáo của Claude; báo cáo có "CẦN TRUNG TRẢ LỜI:" thì hiện ô trả lời, gửi là Claude chạy tiếp đúng phiên cũ. Dưới là danh sách các lượt đã lưu (cả lượt gọi trong phiên Claude) kèm liên kết "Trang báo cáo" |
| Ý tưởng video | Ý tưởng của lượt có phân tích gần nhất, gập sẵn, bấm để mở |
| Sổ trend | Mọi từ khoá cộng dồn qua các lượt (`du_lieu/trend/so_trend.json`, `so_trend.py dung` sinh): điểm độ nóng 0–100 (rê chuột xem bốn thành phần), nhóm, nền tảng, số theo khung 7/30/90 ngày, lượt tìm/tháng của Keyword Planner, số lượt gặp. Lọc theo nhóm (mặc định ẩn nhóm đại chúng), trạng thái (mặc định ẩn "Bỏ"), khung, nền tảng; xếp theo điểm, số lượt gặp, lần gặp cuối, lượt tìm. Hiện 100 dòng một lần. Nút "Xuất CSV" lưu đúng các dòng đang lọc vào thư mục Tải về |

Bốn trường Trung nhập trên từng dòng sổ, lưu ngay vào `du_lieu/bang_video/trend_nhap.json` (trong git):
1. Trạng thái: Mới / Theo dõi / Làm video / Bỏ. Lượt tạo trend sau đọc file này: từ "Bỏ" không thành ý tưởng, từ "Theo dõi" được kiểm lại.
2. Ghi chú nghiên cứu: lưu khi rời ô.
3. Video đã làm: chọn thư mục video; thẻ video trên trang Video hiện nhãn "Trend: <từ khoá>".
4. Nút "Nghiên cứu sâu": chạy một lượt tạo trend đầy đủ tập trung vào đúng từ khoá đó (tìm ngách con), hỏi xác nhận trước.

Trang báo cáo HTML mở qua đường `/bao_cao/` của máy chủ, chỉ nhận file `.html` trong `san_pham/yyyy.mm.dd.bao_cao_trend/` và chặn chạy mã trong trang.

## Thẻ Project: việc đang dở (thêm 28/10/2026)

Thẻ Project (`http://localhost:4580/#project`) liệt kê việc đang làm trong các phiên Claude Code của project Media: tên ngắn của phiên, mô tả việc, thanh tiến độ, tình trạng, đề xuất bước tiếp. Việc chờ Trung đứng đầu, rồi việc đang dở, mới cập nhật đứng trước.

- **Tên ngắn** (5–10 ký tự, chữ thường không dấu, ví dụ `nh-no-xau`) chỉ hiện trên thẻ Project, không ghi vào tiêu đề phiên (Trung bỏ ngày 28/10/2026 vì rối mắt). Dưới tên việc có dòng "Phiên: <tiêu đề phiên>". Nút **Chép tên** chép tiêu đề phiên; dán vào ô tìm phiên của Claude Code là ra đúng phiên.
- Nút **Xong** chuyển việc sang trạng thái đã xong và ẩn đi; ô "Hiện việc đã xong" hiện lại, nút **Mở lại** trả về trạng thái cũ.
- Sổ nằm ở `du_lieu/bang_video/viec_do.json` (có trong git). Mỗi việc gồm `ten_ngan`, `session_id`, `tieu_de_phien`, `viec`, `mo_ta`, `tien_do` (0–100), `tinh_trang`, `de_xuat`, `trang_thai` (`dang_do`, `cho_trung`, `xong`), `cap_nhat`.
- Cách sổ được cập nhật: quy tắc trong `AGENTS.md` (mục "Quy ước chung", ý "Sổ việc dở") bắt mỗi phiên Claude mở việc mới thì thêm dòng, cuối mỗi lượt thì sửa dòng của mình. Phiên Grok, Hermes và lệnh nền `claude -p` không ghi sổ này.

## Thẻ chiến dịch Điện, Bank, Kinh tế, KCN (thêm 28/10/2026; KCN thêm 02/11/2026, kênh Chuyện làm dự án, chưa có khoá)

Trung chốt qua bảng chọn: video vẫn tập trung ở thẻ Video; ba thẻ chiến dịch dùng để báo cáo việc đẩy truyền thông, từ 30/10/2026 có thêm danh sách video của chiến dịch (xem dưới). Mỗi chiến dịch một kênh riêng: Chuyện nghề Điện, Chuyện nghề Ngân hàng, Chuyện vĩ mô.

**Xếp video vào chiến dịch.** Máy chủ so tên thư mục và tên video (đã bỏ dấu) với danh sách từ khoá trong `chien_dich.json`; chiến dịch đứng trước được xét trước, cảnh thử không thuộc chiến dịch nào. Video xếp sai thì chọn lại ở ô **Chiến dịch** trên thẻ video; lựa chọn lưu ở `du_lieu/bang_video/ghi_de.json`, chọn "Tự xếp" là bỏ lựa chọn tay. Loạt thuật ngữ ngân hàng (kể cả mục chính sách tiền tệ) thuộc Bank; Kinh tế để trống tới khi Trung mở loạt mới.

**Thẻ hiện gì.** Bảy ô tiến độ (video của chiến dịch, đã duyệt bản cuối, đang làm, đã tải lên YouTube, công khai, đã hẹn giờ, riêng tư); bảng chỉ số theo nền tảng (video đã đăng, lượt xem, tương tác = thích + bình luận + chia sẻ, tỉ lệ tương tác, người đăng ký, giờ xem); bảng từng video trên YouTube xếp theo lượt xem, bấm tên mở trang số liệu của video trong YouTube Studio.

**Danh sách video của chiến dịch** (thêm 30/10/2026, Trung chốt qua bảng chọn). Dưới ba khối số liệu là mọi video của chiến dịch, xếp cố định theo ngày mở việc (mới nhất trên cùng), cùng ngày theo tên thư mục; không xếp theo lần sửa file như thẻ Video, vì phiên Claude đang dựng ghi file liên tục làm khung nhảy chỗ và ô ý tưởng đang gõ mất con trỏ (Trung gặp 30/10/2026); ô tìm theo tên, nội dung, mô tả, ý tưởng. Mỗi video một khung, thứ tự: (1) đoạn xem nhanh 8 giây, nút xem video đầy đủ, mở thư mục; (2) hình thu nhỏ; (3) tên video, ngày, trạng thái, chế độ trên YouTube; (4) mô tả video: ô `youtube_dai · mo_ta` trong `tai_nguyen/dang_bai/youtube.md` và ô `facebook · chu_thich` trong `facebook.md`, mỗi ô có nút Chép; chưa có `youtube.md` mà kênh có mô tả thật thì hiện mô tả trên kênh, ghi rõ "chép từ kênh, chưa có trong máy"; (5) nội dung video: file `*.tom_tat.md` như thẻ Video; (6) ý tưởng triển khai tiếp theo: ô Trung gõ, tự lưu sau 1,5 giây ngừng gõ hoặc khi rời ô vào `tai_nguyen/dang_bai/y_tuong_tiep.md` (vào git; phiên Claude làm bản Shorts, Reels, TikTok hay video nối tiếp đọc file này trước). Không có ô ra lệnh cho Claude: ra lệnh ở thẻ Video, thẻ Video giữ bố cục cũ.

**Đồng bộ YouTube về máy** (thêm 30/10/2026). Lượt lấy số liệu lấy thêm tiêu đề, mô tả, thẻ của từng video (phần `snippet`, không tốn thêm hạn mức) rồi so với `youtube.md` và tên file mp4 ngoài cùng. Lệch thì khung video hiện ô vàng "Lệch với YouTube" nêu loại lệch: chưa có `youtube.md`, tiêu đề, mô tả, thẻ, tên file mp4 chưa theo tiêu đề (quy ước sản phẩm 2). Nút **Ghi về máy** (hỏi xác nhận) lấy lại bản trên kênh ngay lúc bấm, ghi ô tiêu đề, mô tả, thẻ vào `youtube.md` (chưa có thì tạo file tối giản, đầu file ghi rõ chưa qua skill `viet-chu-dang-video`), chạy `skills/viet-chu-dang-video/scripts/doi_ten_file.py <thư mục> --chay-that` để đổi tên mp4 và sửa tham chiếu, ghi một dòng vào `du_lieu/bang_video/so_dong_bo.jsonl` (kèm chữ cũ). Nút **Ghi về máy mọi video lệch** ở đầu danh sách làm lần lượt từng video. Không bấm khi một phiên Claude đang dựng hoặc đăng chính video đó.

Chữ mặc định "uploaded by youtubeuploader" (công cụ tải lên điền khi kê khai không có mô tả) coi như kênh chưa có mô tả: không bao giờ chép về máy, khung video báo cần viết chữ đăng bằng skill `viet-chu-dang-video`. Máy có mô tả hoặc thẻ mà kênh chưa có thì chỉ báo "chưa đẩy lên kênh", nút Ghi về máy không đè chữ trong máy; đẩy lên kênh bằng `cap_nhat_youtube.py` như bước 8b của skill. Kiểm 30/10/2026: 39/72 video kênh Điện đã tải lên còn mô tả mặc định, không có thẻ, chưa có `youtube.md`; 45 video còn tên file cũ.

Chiều ngược lại (Trung chốt 30/10/2026): khi Claude sửa tiêu đề trên kênh bằng `cap_nhat_youtube.py`, script không tự đổi tên file; Claude hỏi Trung bằng bảng chọn có đổi tên file không, hoặc để Trung bấm Ghi về máy trên thẻ chiến dịch. Bảng chỉ thấy thay đổi trên kênh sau lượt lấy số liệu kế tiếp (6 giờ một lần) hoặc sau khi bấm Cập nhật số liệu. Facebook: chưa đồng bộ, chờ nối `facebook-cli` (sổ nợ N136).

**Số liệu YouTube.** Máy chủ đọc mã video từ `du_lieu/dang_youtube/so_trang_thai.jsonl` (sổ của skill dang-youtube), làm mới khoá OAuth ghi ở `khoa_youtube` (chỉ giữ mã truy cập trong bộ nhớ, không ghi đè file khoá), gọi YouTube Data API (`channels`, `videos`, 1 đơn vị hạn mức mỗi lần gọi, 10.000 đơn vị miễn phí mỗi ngày) và YouTube Analytics API (giờ xem, chia sẻ, người đăng ký tăng giảm). Lấy lúc bật máy chủ nếu số cũ hơn 6 giờ, kiểm lại 30 phút một lần, hoặc bấm **Cập nhật số liệu**. Kết quả lưu `du_lieu/bang_video/so_lieu_youtube.json` (ngoài git). Kiểm khoá đúng kênh bằng `ma_kenh`; sai kênh thì thẻ báo lỗi, không lấy số.

**Bảng quy tắc chiến dịch** (thêm 02/11/2026, Trung yêu cầu; hiện có ở thẻ KCN). Giữa khối số liệu và danh sách video là bảng năm cột: Nhóm, quy tắc đã chốt ở chiến dịch gốc, ngày, cách áp cho chiến dịch này, ô "Trung điều chỉnh". Ô điều chỉnh tự lưu sau 1,5 giây ngừng gõ hoặc khi rời ô; dòng có chữ điều chỉnh tô vàng. Dưới bảng có ô thêm quy tắc mới (nhóm và nội dung, ghi `nguon: trung`). Dữ liệu ở `du_lieu/bang_video/quy_tac_chien_dich.json` (trong git), mỗi chiến dịch một khoá theo `ma`; chiến dịch chưa có khoá thì thẻ không hiện bảng. Ô điều chỉnh có chữ thì thắng cột cách áp và mọi file khác; phiên Claude làm video của chiến dịch đọc bảng này trước. Bảng chỉ vẽ lại khi đổi thẻ, không theo nhịp tải số liệu, để chữ đang gõ không mất; phiên Claude sửa file thì bấm sang thẻ khác rồi quay lại để thấy.

**Việc Trung phải làm.** (1) Bật YouTube Analytics API trong dự án Google Cloud của khoá (đường dẫn hiện trên thẻ Điện); chưa bật thì cột giờ xem, chia sẻ trống, các số khác vẫn có. (2) Tạo kênh Chuyện nghề Ngân hàng và Chuyện vĩ mô, cấp khoá theo `skills/dang-youtube/SKILL.md`, rồi điền `ma_kenh`, `khoa_youtube` trong `chien_dich.json` (mỗi kênh một file khoá riêng). Facebook, TikTok: chưa kết nối, sổ nợ N136.

## Bảo mật

Máy chủ chỉ nghe 127.0.0.1 và từ chối yêu cầu có tên máy khác `localhost:4580`/`127.0.0.1:4580`. Yêu cầu ghi (sửa tên, chuyển lệnh, dừng, mở thư mục, tắt máy chủ) phải mang mã phiên sinh ngẫu nhiên mỗi lần bật máy chủ và chỉ in trong trang, nên trang web khác mở trên cùng máy không gửi lệnh vào được. File phát qua máy chủ giới hạn trong `san_pham/` và `xem_nhanh/`, chỉ các đuôi video và ảnh; thẻ Pha máy chỉ phát đúng báo cáo, bản đủ và bảng ảnh soát mà phiếu ghi, nằm trong `out/pha_may/` của dự án dựng.

## Giới hạn hiện có

- Trang bảng không mở được từ điện thoại (Trung chọn chỉ chạy trên Mac); phiên nền thì xem được trên điện thoại qua claude.ai khi thư mục đã được tin cậy.
- Tên sửa chưa đổi tên file hay tiêu đề trong kịch bản; muốn đổi thật thì ra lệnh cho Claude trên chính thẻ đó.
- Lượt Claude của bảng và các phiên Claude khác có thể cùng làm trong Media; lời nhắc dặn không sửa file của video khác, nhưng không có khoá cứng.
