---
name: giao-muse-video
description: "Giao agent Muse của Meta tạo clip video ngắn bằng AI cho project Media: Claude điều khiển trang web Muse (muse.ai) trên Chrome của Trung qua Claude in Chrome, gửi câu lệnh từng cảnh, chờ clip xong, đo thông số, tải về tai_san/clip_ai/muse/ và ghi sổ clip. Dùng khi Trung nói: giao Muse, nhờ Muse làm clip, Muse tạo video, làm cảnh này bằng Muse, tạo clip AI bằng Muse, Muse AI. KHÔNG dùng cho: video dựng bằng mã Remotion (quy trình 01 và 14), video Google Veo/Omni (làm tay trên Flow, quyết định 26/10/2026), dữ liệu khách hàng hoặc thông tin nội bộ chưa công bố."
version: 1.0.0
author: macbooktrungnt, Claude Code
platforms: [macos]
metadata:
  lap_ngay: 2026-10-26
  related_skills: [remotion-render]
---

# Giao Muse tạo clip video ngắn

Muse là agent AI của Meta (app Mac `/Applications/Muse.app`, bản web `https://muse.ai`, cùng tài khoản và cùng lịch sử trò chuyện). Muse **không có API, công cụ dòng lệnh hay cổng MCP** để chương trình khác gửi việc vào (kiểm 26/10/2026). Claude cũng không điều khiển được app trên Mac. Vì vậy skill này đi qua **bản web trên Chrome của Trung** bằng công cụ Claude in Chrome (`mcp__claude-in-chrome__*`).

Clip Muse làm ra là **nguyên liệu**: cảnh nền hoặc vài giây minh hoạ mà mã dựng không làm được (đúng vai trò "Sinh video bằng AI" ở `12_cong_cu_media_ai.md`). Ghép, lồng tiếng, phụ đề vẫn làm theo `09_video_doc_ngan.md` hoặc `10_video_ngang_thuyet_minh.md`.

## Điều kiện trước khi giao

1. **Câu lệnh lấy từ kịch bản đã qua cửa duyệt.** Trong một video của Media, chỉ giao Muse sau khi Trung đã chọn phong cách viết kịch bản (mã KB-xx) và tổ hợp dựng (năm trục) và đã duyệt chữ (`03_kich_ban_va_loi_viet.md` và `04_he_truc_dung.md`). Trung chỉ muốn thử một clip lẻ thì bỏ qua điều kiện này.
2. **Không có dữ liệu khách hàng, thông tin cá nhân, thông tin nội bộ chưa công bố, logo MB** trong câu lệnh hoặc ảnh gửi kèm. Muse chạy trên máy chủ của Meta.
3. **Muse phải đang đăng nhập trên Chrome.** Claude KHÔNG tự đăng nhập, kể cả khi trang hiện sẵn tài khoản để bấm "tiếp tục". Gặp trang đăng nhập thì dừng, nhờ Trung tự đăng nhập rồi làm tiếp.

## Các bước

**1. Mở đoạn chat riêng cho mỗi video.** Gọi `tabs_context_mcp` (tham số `createIfEmpty: true`), rồi `navigate` tới `https://muse.ai/thread/new`. Địa chỉ đó mở một "đoạn chat phụ" mới, nên clip không lẫn với việc khác Trung đang làm trong Muse. Nếu địa chỉ này không còn dùng được: vào `https://muse.ai`, bấm nút "Đoạn chat" góc trên bên trái, rồi bấm "Đoạn chat phụ mới". Không bấm nút "Mời" góc trên bên phải: nút đó mở bảng mời bạn, không tạo chat mới. Các cảnh của cùng một video gửi tiếp trong cùng đoạn chat, để Muse giữ màu và phong cách giữa các cảnh.

**2. Gửi câu lệnh.** Bấm vào ô "Nhắn tin" ở đáy trang, gõ câu lệnh, rồi bấm Return. Nên gộp bước bấm, gõ và gửi trong một lệnh `browser_batch`. Mẫu câu lệnh cho một cảnh:

```
Hãy tạo một video clip ngắn khung <dọc 9:16 | ngang 16:9>, dài khoảng <n> giây: <mô tả cảnh: chủ thể, bối cảnh, chuyển động máy quay, ánh sáng, phong cách hình>. Không có chữ, không có người<, không cần thuyết minh>. Tạo xong hãy cho tôi file MP4 để tải về, và ghi rõ: độ phân giải thật, độ dài thật, model nào đã dùng, có hình đóng dấu (watermark) không.
```

Mô tả cảnh lấy từ phần mô tả hình của kịch bản và từ thẻ phong cách dựng D-xx đã chọn. Muse hiểu tiếng Việt.

**3. Chờ clip.** Lần thử ngày 26/10/2026 mất khoảng 2 phút. Cứ 30–40 giây chờ (dùng lệnh `computer` với `action: wait`, mỗi lần tối đa 10 giây, gộp nhiều lần trong một `browser_batch`), rồi kiểm bằng `javascript_tool`:

```js
[...document.querySelectorAll('video')]
  .filter(x => !(x.videoWidth === 480 && x.videoHeight === 480))
  .map(x => ({w: x.videoWidth, h: x.videoHeight, d: x.duration}))
```

Video vuông 480×480 là hình động của nhân vật Muse ở khung bên phải, không phải clip, nên phải lọc ra. Mỗi lần gọi `javascript_tool` phải xong trong dưới 45 giây, nếu không công cụ báo lỗi hết giờ. Vì vậy không viết vòng lặp chờ dài bên trong lệnh JavaScript. Quá 10 phút chưa có clip thì chụp màn hình xem Muse đang hỏi lại gì. Muse có thể hiện nút gợi ý (ví dụ "Cắt đúng 8 giây và upscale lên 1080x1920"). Không bấm các nút đó trừ khi Trung đã chọn.

**4. Xin phép tải về.** Báo Trung tên file, nguồn (muse.ai) và dung lượng, rồi chờ Trung đồng ý. Nếu yêu cầu ban đầu của Trung đã nói rõ "tải về" cho các clip của video này thì không cần hỏi lại.

**5. Tải về.** Lấy file ngay từ trang bằng `javascript_tool`, rồi chuyển từ `~/Downloads` sang kho của Media:

```js
const v = [...document.querySelectorAll('video')].find(x => x.videoWidth && !(x.videoWidth === 480 && x.videoHeight === 480));
const b = await (await fetch(v.currentSrc || v.src)).blob();
const a = document.createElement('a'); a.href = URL.createObjectURL(b);
a.download = '<yyyy.mm.dd>.<ten_canh_khong_dau>.mp4'; document.body.appendChild(a); a.click(); a.remove();
({size: b.size, type: b.type})
```

Có nhiều clip trong cùng đoạn chat thì chọn clip mới nhất: phần tử cuối cùng trong danh sách đã lọc.

```bash
mv ~/Downloads/<ten_file>.mp4 "/Users/macbooktrungnt/Documents/VideoNganHang/tai_san/clip_ai/muse/"
```

**6. Đo và soát.** Máy Mac không cài sẵn ffmpeg. Dùng bản ffmpeg đi kèm Remotion trong `xuong_dai/<video bất kỳ>/node_modules/@remotion/compositor-darwin-arm64/`:

```bash
C=/Users/macbooktrungnt/Documents/VideoNganHang/xuong_dai/tuabin_gio/node_modules/@remotion/compositor-darwin-arm64
export DYLD_LIBRARY_PATH=$C
$C/ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,nb_frames:format=duration,size -of compact <file>
for t in 0.5 <giữa> <cuối-0.5>; do $C/ffmpeg -v error -y -ss $t -i <file> -frames:v 1 -vf scale=360:-1 <thư mục nháp>/khung_$t.png; done
```

Bản ffmpeg này rút gọn: không có bộ lọc `hstack`, `volumedetect`, không xuất được dạng `s16le`. Muốn đo âm thanh thì xuất WAV (`-vn -ac 1 -c:a pcm_s16le am.wav`) rồi đọc bằng module `wave` của Python. Xem ba khung hình để kiểm: nội dung đúng câu lệnh, không có chữ lạ, không có hình đóng dấu, không có người khi đã dặn không có người.

**7. Ghi sổ.** Thêm một dòng vào `tai_san/clip_ai/so_clip_ai.tsv`: ngày, tên file, công cụ, video hoặc cảnh dùng cho, câu lệnh rút gọn, địa chỉ đoạn chat Muse, thông số đo được, ghi chú. File MP4 không vào git (`.gitignore`), sổ và README thì có.

**8. Đóng tab** Claude đã mở (`tabs_close_mcp`), trừ khi Trung muốn xem tiếp.

## Thông số đã đo (lần thử 26/10/2026, clip tua-bin gió bình minh)

| Hạng mục | Kết quả |
|---|---|
| Thời gian chờ | khoảng 2 phút |
| Độ phân giải | xin 1080×1920, nhận **720×1280** (đúng tỉ lệ 9:16) |
| Độ dài | xin khoảng 8 giây, nhận **10,0 giây** |
| Mã hoá | H.264, 24 hình/giây, 8,6 MB |
| Âm thanh | **Có tiếng nền** (AAC, nhiều khả năng là tiếng gió) dù không xin. Khi ghép thì tắt tiếng hoặc bỏ đường âm thanh, trừ khi muốn giữ |
| Hình đóng dấu | Không thấy ở khung đầu, giữa, cuối. Siêu dữ liệu không có nhãn nội dung AI. Có thể vẫn có dấu ẩn không nhìn thấy được, chưa kiểm được |
| Model | Muse không cho biết (trong app ghi tạo video bằng "Meta AI and Vibes") |

**Độ phân giải (quyết định 26/10/2026):** giữ clip gốc 720p, phóng lên 1080×1920 (hoặc 1920×1080) ở bước dựng bằng Remotion hoặc ffmpeg. Không nhờ Muse phóng to. Cảnh chính cần thật nét thì cân nhắc dùng Flow (Veo 3.1 Quality).

## Bản quyền

Clip AI của Meta dùng được làm nguyên liệu trong máy. Trước khi đăng ra ngoài (TikTok, Reels), soát theo `13_ban_quyen_va_bao_mat.md` và điều khoản dùng nội dung tạo bằng AI của Meta. Nền tảng đăng có thể buộc gắn nhãn "nội dung tạo bằng AI". Ghi rõ trong sổ clip là clip nào do AI tạo.

## Lỗi đã gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `screenshot` báo "page navigated to a different domain" ngay sau khi mở `agent.meta.ai` | Trang tự chuyển sang `muse.ai`. Gọi lại `tabs_context_mcp` rồi chụp lại. Lần sau vào thẳng `https://muse.ai` |
| `javascript_tool` báo hết giờ sau 45 giây | Bỏ vòng lặp chờ trong JavaScript, chờ bằng lệnh `computer` với `action: wait` |
| `osascript` báo không có quyền trợ năng khi thử điều khiển app Muse | Không dùng app trên Mac, đi qua bản web |
