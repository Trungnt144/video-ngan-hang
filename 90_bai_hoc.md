# 90 — Bài học kỹ thuật của project Media

> Đọc TRƯỚC khi xử lý sự cố kỹ thuật hoặc thử một cách làm mới. Nối thêm, không xóa.
> Bài học chung toàn hệ (không riêng video) nằm ở `90_bai_hoc.md` của project META.

---

## 2026-07-28 — Liên kết thư mục kỹ năng gãy khi chuyển dự án, và cách kiểm SAI khiến suýt bỏ sót

**Bối cảnh:** chuyển `Documents\video-factory\` vào `Projects\Media\xuong\` khi lập project Media.

**Vấn đề:** thư mục `.claude\skills` là liên kết trỏ bằng đường dẫn tuyệt đối tới vị trí cũ, nên đứt sau khi chuyển — Claude Code không đọc được kỹ năng nào.

**Chỗ suýt sai — quan trọng hơn cả bản thân lỗi:** đã thử hai cách kiểm và **cả hai đều báo bình thường một cách sai lệch**:

| Cách kiểm | Kết quả | Thực tế |
|---|---|---|
| `Get-Item ... .LinkType` | trả về rỗng | vẫn là liên kết đã gãy |
| `cmd /c dir /AL` | "File Not Found" (không thấy liên kết nào) | vẫn là liên kết đã gãy |
| `Get-ChildItem` liệt kê tên | ra đủ 10 tên | vẫn là liên kết đã gãy |
| **`Test-Path <đường dẫn>\<tên kỹ năng>\SKILL.md`** | **False** | **đây mới là cách phát hiện đúng** |

Suýt kết luận "đây là thư mục thật, chuyển thoải mái". Cứu được là nhờ đọc `90_bai_hoc.md` của META trước khi viết tài liệu — bài học 23/07 đã ghi đúng dấu hiệu này.

**Cách sửa** (chạy tại thư mục dự án ở vị trí MỚI):

```bash
npx -y --loglevel=error skills@1.2.0 add remotion-dev/skills --agent claude-code -y
```

Xóa `.claude\skills` cũ trước khi chạy. Sau đó kiểm chứng bằng `Test-Path` vào `SKILL.md` của **từng** kỹ năng, rồi render thử một lần.

**Bài học chính:**
- Muốn biết liên kết thư mục còn sống hay không, chỉ có một cách đáng tin: **đọc thử một file nằm sâu bên trong**. Mọi cách kiểm từ bên ngoài — kiểu liên kết, liệt kê tên, lệnh dò liên kết của Windows — đều có thể báo bình thường trên một liên kết đã chết.
- `Get-ChildItem -Recurse` **không đi xuyên** liên kết thư mục, nên đếm ra 0 file không có nghĩa là hỏng. Đừng dùng phép đếm để kết luận.
- Quy luật đã lặp lại lần thứ hai (23/07 và 28/07): dự án cài kỹ năng qua công cụ `skills` mà đổi chỗ thư mục thì **luôn phải chạy lại lệnh cài**, không có ngoại lệ.

**Thu hoạch kèm theo:** lần cài lại này lấy về **11 kỹ năng** thay vì 10 của bản 22/07 — có thêm `remotion-captions` (đúng thứ cần cho phụ đề chạy chữ), `remotion-maps`, `remotion-multimedia`. Kỹ năng cũ `mediabunny` còn sót trong `.agents\skills\` nhưng không được liên kết sang nên không nạp; để lại chờ Trung quyết, không tự xóa.

---

## 2026-07-28 — Tên cảnh mặc định của dự án là `TestDoc`, không phải `HelloWorld`

Lệnh `npx remotion render HelloWorld ...` báo `Could not find composition with ID HelloWorld. Available compositions: TestDoc`. Dự án dựng từ mẫu trắng nên cảnh mặc định tên `TestDoc`.

Cách chắc ăn khi không nhớ tên cảnh: chạy `npx remotion compositions` để liệt kê, hoặc đọc `src/Root.tsx`. Khi dựng khuôn 7 cảnh sẽ đặt lại tên cảnh cho có nghĩa.

Ghi nhận thời gian render sau khi chuyển: 26 giây cho cảnh thử, ra file 0,29 MB — khớp với mức đo trước khi chuyển, tức việc di chuyển không ảnh hưởng tốc độ.

---

## 2026-07-28 — Hai cái bẫy khi viết script PowerShell gọi ffmpeg

Vấp khi dựng `scripts\cat_khung_hinh.ps1`. Cả hai đều khiến script chết trong khi lệnh bên trong thực ra chạy đúng — rất mất thời gian nếu không biết trước.

**Bẫy 1 — nén log bằng `2>$null` làm script tưởng là lỗi.** PowerShell 5.1 bọc từng dòng thông báo của chương trình ngoài (ffmpeg, ffprobe, yt-dlp...) thành bản ghi lỗi khi bị chuyển hướng kiểu này, nên script dừng dù ffmpeg trả về mã thành công. Cách đúng: dùng `Start-Process` với `-RedirectStandardError` ra file, hoặc để nguyên không nén log rồi lọc sau. Đừng dùng `2>$null` với lệnh ngoài trong PowerShell 5.1.

**Bẫy 2 — file `.ps1` có tiếng Việt phải lưu UTF-8 CÓ BOM.** PowerShell 5.1 đọc file không có dấu BOM theo bảng mã hệ thống, làm chuỗi tiếng Việt vỡ thành ký tự lạ và gây lỗi cú pháp ở những dòng hoàn toàn hợp lệ. Ghi bằng `UTF8Encoding($true)`. Đây là biến thể của bài học cũ ở META (02/05 và 20/07) nhưng lần này xảy ra với chính file `.ps1` chứ không phải file `.bat` gọi nó.

**Bẫy 3 (của người kiểm, không phải người viết) — đếm sai phần mở rộng file.** Khi nghiệm thu script, đếm `*.png` trong khi script xuất `.jpg` → ra 0 và suýt kết luận script hỏng. Kiểm đầu ra thì đếm mọi file hoặc đọc trong mã xem nó ghi đuôi gì, đừng đoán định dạng.

---

## 2026-07-28 (tối) — Sai giọng đọc mà API không báo lỗi: loại lỗi im lặng nguy hiểm nhất

**Bối cảnh:** lắp giọng đọc ElevenLabs, Trung chọn giọng Việt **Xuân Lượng**. Sinh ra file 93 giây, nghe rất bình thường. Trung nghe rồi hỏi: *"bạn đang không dùng giọng Xuân Lượng à? nghe giống giọng người nước ngoài"*.

**Vấn đề:** giọng nhân bản chuyên nghiệp chỉ tồn tại ở **những model nó được huấn luyện**. Xuân Lượng có ở `eleven_turbo_v2_5` / `eleven_v2_5_flash` / `eleven_flash_v2_5`, **không có** ở `eleven_multilingual_v2` — mà đó chính là model đã dùng.

**Chỗ nguy hiểm — quan trọng hơn bản thân lỗi:** API **không báo lỗi gì cả**. Nó trả về mp3 đúng nội dung, đúng độ dài, chất lượng tốt — chỉ là đọc bằng giọng gốc chung. Không có mã lỗi, không có cảnh báo, không có cách nào phát hiện bằng máy sau khi file đã sinh. Nếu Trung không nghe kỹ thì file sai đã đi thẳng vào video giao đi.

Đối chiếu với hai lỗi vấp trước đó cùng ngày, cả hai đều **báo lỗi rõ ràng** nên sửa trong một phút:

| Lỗi | Có báo không | Thời gian phát hiện |
|---|---|---|
| Khóa API thiếu quyền | Có, nói rõ thiếu quyền nào | ngay lập tức |
| `multilingual_v2` không nhận `language_code` | Có, `unsupported_language` | ngay lập tức |
| **Giọng không khớp model** | **Không** | **chỉ phát hiện bằng tai người** |

**Cách sửa:** `scripts\sinh_giong_doc.ps1` gọi `GET /v1/voices/{id}` trước khi sinh tiếng, đọc `verified_languages` và `high_quality_base_model_ids`, đối chiếu với model đang cấu hình. Lệch thì **dừng trước khi gọi API**. Giọng dựng sẵn (`premade`) không chặn vì chúng chạy được với mọi model. Đã thử cả hai chiều: chạy đúng ra file, chạy sai dừng ngay.

**Bài học chính — áp cho mọi việc, không riêng giọng đọc:**

1. **Lỗi im lặng nguy hiểm hơn lỗi ồn ào gấp nhiều lần.** Lỗi báo ra thì sửa ngay; lỗi trả về kết quả *trông có vẻ đúng* thì đi thẳng vào sản phẩm giao đi. Gặp API mới, câu hỏi cần đặt không phải "nó có chạy không" mà **"nếu tôi truyền tham số sai thì nó báo lỗi hay lặng lẽ thay bằng mặc định?"**
2. **Không tin danh sách chép tay — hỏi thẳng nguồn.** Bản vá đầu tiên chép danh sách model vào file cấu hình. Vẫn sai được, vì ElevenLabs đổi thì file cấu hình không tự biết. Bản vá thứ hai hỏi API, giữ danh sách chép tay chỉ để đối chiếu và cảnh báo khi lệch.
3. **Nghiệm thu bằng đúng giác quan mà sản phẩm nhắm tới.** File tiếng phải nghe, không phải xem kích thước file và độ dài giây. Cả hai chỉ số đó đều bình thường trong ca này.
4. Thời lượng đọc thay đổi theo giọng: cùng văn bản, model cũ ra 93,5 giây, Xuân Lượng ra 80 giây. **Đừng chốt thời lượng kịch bản trước khi sinh thử tiếng thật.** Giọng này đọc khoảng 20 ký tự/giây, muốn 90 giây cần khoảng 1.800 ký tự.

**Bẫy phụ vấp trong lúc sửa — dấu gạch dài trong chuỗi PowerShell.** Đặt `—` trong chuỗi làm gãy cả script: PowerShell 5.1 đọc file theo bảng mã hệ thống, byte cuối của dấu này trùng dấu nháy đóng nên trình phân tích cú pháp tưởng chuỗi đã kết thúc. Lỗi báo ở dòng khác hẳn dòng thật sự sai. Trong phần chú thích thì vô hại (chú thích hết ở cuối dòng). **Viết chuỗi trong `.ps1` thì dùng gạch thường.** Đây là bà con với bẫy 2 ngày 28/07 ở trên, nhưng khác ở chỗ file đã lưu UTF-8 đúng chuẩn rồi mà vẫn gãy.

---

## 2026-07-28 (khuya muộn) — Bộ nhớ đệm webpack hỏng lặp lại nhiều lần trong CÙNG một phiên

Ba lần render liên tiếp trong cùng một phiên làm việc, hai lần dính lỗi:

```
TypeError: Cannot read properties of undefined (reading 'length')
    at WasmHash._updateWithBuffer (...node_modules\webpack\lib\util\hash\wasm-hash.js:151
```

Lỗi này xảy ra ngay cả với cảnh trắng mặc định `TestDoc` — tức không liên quan gì tới mã dựng vừa sửa. Cả hai lần đều khỏi hẳn sau `rm -rf node_modules/.cache/webpack` (một lần phải xóa cả `node_modules/.cache`).

**Bài học:** đây không phải sự cố một lần rồi thôi như từng nghĩ — bộ nhớ đệm webpack trên máy này hỏng **lặp lại nhiều lần**, có vẻ liên quan tới việc sửa mã nguồn giữa các lượt render trong một phiên chạy `remotion studio`/`render` dài. Gặp đúng thông báo lỗi này thì xóa cache trước, không cần chẩn đoán lại từ đầu mỗi lần. Cân nhắc: nếu lặp lại quá 3 lần trong một dự án, có thể là dấu hiệu môi trường Windows này có xung đột sâu hơn (phiên bản Node, hoặc đĩa cứng) — nên báo Trung nếu vẫn tái diễn sau vài lần dùng thử.

---

## 2026-10-25 — Dựng cảnh 3D bằng Three.js và Blender từ cùng một thông số: sáu lỗi đã vấp

**Bối cảnh:** cảnh thử 3D pin mặt trời 12 giây, dựng bằng Remotion + Three.js và bằng Blender 5.2.3 (mã Python chạy không giao diện), dùng chung `canh3d/thong_so.json` và `canh3d/dong_thoi_gian.json` trong `xuong_dai/pin_mat_troi/`. Chi tiết cách tổ chức: `10_video_ngang_thuyet_minh.md` mục 6.

1. **Máy quay Blender xoay nghiêng 90 độ.** `Vector.to_track_quat("-Z", "Y")` luôn lấy trục Z của thế giới Blender làm phía trên, kể cả khi máy quay nằm dưới một vật gốc đã xoay để dùng toạ độ Three.js (trục Y lên). Cách sửa: tự tính ma trận hướng nhìn từ hướng nhìn và trục Y (hàm `huong_nhin` trong `canh3d/dung_blender.py`).
2. **Kim loại trong Three.js ra màu gần đen.** Vật liệu kim loại chỉ phản chiếu môi trường; cảnh không có ảnh môi trường thì không có gì để phản chiếu. Cách sửa: `scene.environment` lấy từ `RoomEnvironment` qua `PMREMGenerator`, `environmentIntensity` 0,45.
3. **Màu hai bản lệch nhau.** Muốn khớp phải đủ bốn điều: Three.js tắt nén dải sáng (`toneMapping: NoToneMapping`); Blender đặt chế độ hiển thị `Standard` (mặc định AgX làm nhạt màu); mã màu đổi từ sRGB sang giá trị tuyến tính trước khi đưa vào nút Principled BSDF; Blender kết xuất nền trong suốt để Remotion tô cùng một màu nền.
4. **Bóng đèn Blender cháy trắng.** Độ phát sáng 4 ở chế độ `Standard` vượt trần màu trắng; 1,6 thì gần bản Three.js.
5. **Blender 5.2 báo lệnh sắp bỏ.** `World.use_nodes` và `Material.use_nodes` sẽ bị bỏ ở Blender 6.0. Mã hiện vẫn chạy; nâng Blender lên bản 6 thì sửa hai chỗ này trước.
6. **Three.js trong Remotion cần card đồ hoạ.** Thêm `Config.setChromiumOpenGlRenderer("angle")` vào `remotion.config.ts`, không thì WebGL có thể chạy bằng phần mềm, chậm và sai hình.

**Bài học chung:** khi so hai công cụ, phải sửa lỗi dựng của từng bên trước (lỗi 2 và 4 ở trên) rồi mới so, không thì kết quả so sánh phản ánh tay dựng chứ không phản ánh công cụ.

---

## 2026-10-25 — VieNeu-TTS báo "External data path escapes model directory": phải ghim onnxruntime 1.22.1

**Bối cảnh:** cài VieNeu-TTS v3 Turbo (gói `vieneu` 3.8.3) trên Mac M5 để thay giọng ElevenLabs. Cài mặc định kéo theo onnxruntime 1.31; nạp mô hình thì báo lỗi `External data path escapes model directory`.

**Nguyên nhân:** bộ nhớ đệm Hugging Face (`~/.cache/huggingface/hub`) lưu file mô hình ở thư mục `blobs/` và đặt liên kết tắt (symlink — file chỉ trỏ sang file khác) trong thư mục `snapshots/`. Mô hình ONNX của VieNeu để trọng số ở file ngoài; onnxruntime 1.31 kiểm đường dẫn file ngoài, thấy liên kết tắt trỏ ra khỏi thư mục mô hình thì từ chối nạp.

**Cách gỡ:** cài kèm `onnxruntime==1.22.1` (bản chưa có phép kiểm này). Lệnh cài đầy đủ ở `08_giong_am_thanh_phu_de.md` mục 1. Khi nâng `vieneu` lên bản mới, thử bỏ ghim trước; vẫn lỗi thì giữ ghim.

**Bẫy phụ:** máy không có lệnh `uv` trên đường dẫn mặc định; dùng `~/.hermes/bin/uv`. ffmpeg của Remotion không có bộ lọc `volumedetect`, muốn đo độ to thì đo bằng Python (`soundfile` + `numpy`).

---

## 2026-10-26 — Vật liệu Three.js đổi từ đục sang trong suốt nhưng vẫn vẽ như khối đặc

**Bối cảnh:** video "Bên trong buồng máy tua-bin gió" (thẻ D-09, `xuong_dai/buong_may/`). Vỏ buồng máy mở đầu đục rồi chuyển trong suốt để lộ trục, hộp số, máy phát. Khung soát bằng `npx remotion still` thấy đủ bên trong; Trung xem file mp4 thì nhiều cảnh mất hình: vỏ là một khối trắng che kín, chỉ còn hộp số vàng (vốn trong suốt từ đầu) hiện lên.

**Nguyên nhân:** Three.js dựng chương trình vẽ (shader) của vật liệu theo cờ `transparent` lúc tạo vật liệu. Khi kết xuất cả video, React Three Fiber giữ nguyên vật liệu qua nhiều khung và chỉ cập nhật thuộc tính: `opacity` và `depthWrite` đổi, nhưng chương trình vẽ không dựng lại, nên vật vẫn vẽ không pha trộn màu, tức là đặc. `npx remotion still` tạo vật liệu mới cho mỗi khung nên vật liệu sinh ra đã đúng trạng thái trong suốt, lỗi không lộ.

**Cách gỡ:** cho vật liệu một `key` đổi theo trạng thái, ví dụ `<meshStandardMaterial key={mo < 1 ? "trong" : "duc"} ... />`. React tạo vật liệu mới mỗi khi chuyển giữa đục và trong. Cách khác là đặt `material.needsUpdate = true` khi đổi cờ. Áp cho mọi vật liệu đổi độ mờ theo thời gian (vỏ, hạt, vật hiện dần): `VatLieu` trong `src/MoHinh.tsx`, `VL` trong `src/chi_tiet/CanhChiTiet.tsx`.

---

## 2026-10-26 — Soát video 3D bằng khung cắt từ file mp4, không bằng khung kết xuất riêng lẻ

**Bối cảnh:** cùng sự cố trên. 16 khung `npx remotion still` soát trước khi kết xuất đều đúng, nhưng file mp4 giao cho Trung sai ở phần lớn các cảnh có vỏ trong suốt.

**Nguyên nhân:** `still` dựng mỗi khung từ trạng thái mới; kết xuất cả video giữ trạng thái qua các khung (vật liệu, bộ nhớ đệm hình khối, đối tượng tạo bằng `useMemo`). Lỗi nào chỉ sinh ra do trạng thái đi qua nhiều khung thì `still` không bao giờ thấy.

**Cách làm đúng:** `still` chỉ dùng để chỉnh bố cục nhanh trước khi kết xuất. Trước khi giao file, cắt khung từ chính file mp4 (3 giây một khung cho video 1–2 phút, 1 giây một khung cho đoạn nghi ngờ), ghép thành bảng ảnh rồi xem. ffmpeg kèm Remotion trên Mac thiếu bộ lọc `fps`, `select`, `tile`, `drawtext` và định dạng xuất `rawvideo`, nên cắt bằng `-ss <giây> -frames:v 1` từng khung, ghép bằng Python (Pillow). Kịch bản mẫu đã chạy được ghi ở `tai_san/nhat_ky_video_ngang.md` mục 10.

---

## 2026-10-26 — Chép thư mục mã dựng bằng rsync --exclude src làm hỏng thư viện Node

**Triệu chứng:** sau khi chép `xuong_dai/buong_may/` sang thư mục mới bằng `rsync -a --exclude out --exclude public --exclude src`, lệnh `npx remotion bundle` báo "Cannot find module .../node_modules/human-signals/build/src/main.js".
**Nguyên nhân:** `--exclude src` loại MỌI thư mục tên `src` ở mọi tầng, kể cả bên trong `node_modules`.
**Cách làm đúng:** chép thư viện riêng bằng `cp -Rc <cũ>/node_modules <mới>/node_modules` (APFS chép nhanh, không tốn đĩa), còn mã thì viết mới hoặc chép từng file. Nếu dùng rsync thì neo đường dẫn ở gốc: `--exclude /src`.

## 2026-10-26 — Danh sách số khung trong biến zsh không tách thành nhiều lần chạy

**Triệu chứng:** `DS=$(node khung_xem.mjs ...); for i in $DS; do npx remotion still ... --frame=$i` báo "Frame NaN is not finite".
**Nguyên nhân:** zsh không tách biến theo dấu xuống dòng như bash; vòng lặp chạy một lần với cả chuỗi.
**Cách làm đúng:** đặt lệnh trực tiếp trong vòng lặp: `for i in $(node khung_xem.mjs ... | awk '{print $2}')`.

## 2026-10-26 — Whisper lấy mốc từng từ: từ đầu câu bị đặt sớm, đo bằng Whisper cả đoạn thì từ sau chỗ nghỉ bị đặt muộn

**Bối cảnh:** làm phụ đề chạy chữ cho giọng VieNeu (module 10 mục 19). **Vấn đề 1:** Whisper nghe từng câu đặt từ đầu câu ở 0,00 giây, trong khi câu VieNeu có sẵn khoảng 0,1 giây lặng ở đầu, nên chữ đầu câu tô sớm hơn tiếng 55–110 ms. Chấp nhận được với phụ đề, giữ. **Vấn đề 2:** khi đo lại bằng Whisper nghe cả đoạn mp4, từ ngay sau chỗ nghỉ bị Whisper kéo mốc lùi về cuối từ trước, ra lệch giả 140–440 ms. **Cách gỡ:** đo đầu câu bằng năng lượng âm của file giọng (không dùng Whisper); chỉ dùng Whisper cả đoạn để đo từ giữa câu. **Thêm:** trường `tu` trong `thoi_gian.json` của khung D-09b đã có nghĩa (khung bắt đầu câu, dùng để đặt tiếng); đặt mốc từ vào trường mới `tu_moc`, ghi đè `tu` sẽ làm lệch tiếng cả video.

## 2026-10-26 — Cài HyperFrames trên máy không có Homebrew: FFmpeg riêng, ffprobe-static chỉ có bản Intel

**Bối cảnh:** thử HyperFrames (`12_cong_cu_media_ai.md` mục 3b). **Vấn đề:** (1) máy không có Homebrew, `brew install ffmpeg` không chạy được, cài Homebrew cần mật khẩu máy; (2) gói npm `ffprobe-static` 3.1.0 tải bản `darwin/arm64` nhưng thật ra là bản Intel, chạy báo `bad CPU type in executable` vì máy không có Rosetta; (3) npm của Node 26 báo chặn script cài đặt (`install-scripts`) của `ffmpeg-static` và `esbuild`, nhưng file FFmpeg vẫn có, chạy được. **Cách gỡ:** `ffmpeg-static` (FFmpeg 6.0, arm64 thật) cài trong thư mục thử; `ffprobe` là script bọc gọi ffprobe của Remotion (`xuong/node_modules/@remotion/compositor-darwin-arm64`, cần `DYLD_LIBRARY_PATH`); đặt cả hai trong `xuong_thu_hyperframes/bin/` rồi thêm vào đầu `PATH`. Kiểm bằng `npx hyperframes doctor`. **Thêm:** `npx hyperframes skills` không chỉ định chỗ cài sẽ cài cho mọi công cụ; muốn chỉ cài trong một thư mục thì dùng `npx skills add heygen-com/hyperframes -a claude-code -y` chạy trong thư mục đó, kiểm `~/.claude/skills/` trước và sau.

## 2026-10-26 — Mặt đất Three.js cháy thành trắng trên nền kem, lộ đường chân trời

**Bối cảnh:** video hiệu ứng che gió (`tai_san/nhat_ky_video_ngang.md` mục 17), cánh đồng tua-bin trên nền kem D-09b. **Triệu chứng:** mặt đất `meshStandardMaterial` màu `#EEE8DC` hiện ra trắng tinh, khác hẳn nền kem phía sau nên lộ một đường chân trời; mặt biển `#D6E8EA` cũng thành trắng. **Nguyên nhân:** mặt đất nằm ngang nhận trọn đèn bán cầu (cường độ 1,15) cộng đèn mặt trời (1,7) cộng ánh sáng môi trường; video đặt `NoToneMapping` nên màu vượt mức sáng tối đa bị cắt thành trắng. **Cách làm đúng:** mặt đất dùng `meshBasicMaterial` (không nhận ánh sáng) đúng màu nền, nên không lộ đường chân trời; bóng đổ vẽ trên một mặt phẳng riêng bằng `shadowMaterial` đặt cao hơn mặt đất một chút. Cảnh nhìn rất xa (ngoài khơi) thì bỏ mặt bóng đổ, vì vùng bóng đổ của đèn chỉ phủ vài trăm đơn vị, ra ngoài thì lộ ô vuông.

## 2026-10-26 — Ô vuông và tia sáng ở mặt phẳng nằm khi máy quay nhìn xa: giới hạn gần của máy quay quá nhỏ

**Bối cảnh:** cùng video, cảnh hai trang trại ngoài khơi, máy quay cách khoảng 900 đơn vị. **Triệu chứng:** bản đồ vệt gió (mặt phẳng trong suốt cao 0,15) chồng lên mặt biển (cao −0,05) hiện thành nhiều ô chữ nhật và tia sáng toả từ một điểm, đổi theo từng khung. Ảnh `remotion still` ở góc gần không có lỗi này. **Nguyên nhân:** máy quay đặt giới hạn gần `near = 0,1`; độ chính xác của bộ đệm độ sâu tỉ lệ với near chia khoảng cách, nên ở 900 đơn vị hai mặt cách nhau 0,2 đơn vị không phân biệt được trước sau và tranh nhau hiện (z-fighting). Đổi màu, đổi độ trong suốt hay bỏ bóng đổ đều không hết. **Cách làm đúng:** đặt `near = 1` (cả trong máy quay lẫn hàm chiếu nhãn chữ `chieu`), vì máy quay không bao giờ tới gần vật hơn 1 đơn vị. Quy tắc chung: near đặt lớn nhất có thể theo khoảng cách gần nhất của máy quay; soát cả khung nhìn xa nhất của video, không chỉ khung gần.

## 2026-10-26 — Phân tích video YouTube dài trên Mac và kết xuất Blender Cycles có vỏ trong suốt

1. **yt-dlp trên máy này không ghép được hình và tiếng** (không có ffmpeg hệ thống): `-S "res:720"` tải về hai file rời (`.f398.mp4` hình AV1, `.f140.m4a` tiếng). Để học phong cách thì dùng thẳng file hình; ffmpeg kèm Remotion giải mã được AV1.
2. **ffmpeg kèm Remotion không có định dạng xuất `rawvideo`.** Muốn đo nhịp cắt cả video thì xuất mọi khung thu nhỏ 96×54 thành JPEG (`-vf scale=96:54`, 16 phút mất 9 giây, 23.235 ảnh) rồi tính độ chênh giữa hai khung liền nhau bằng Pillow; cắt cứng là khung có độ chênh trên 15 và gấp 6 lần trung vị 24 khung quanh nó.
3. **`python3 -I` không thấy Pillow** vì Pillow cài ở thư mục người dùng mà chế độ cô lập bỏ qua. Script tự viết đọc ảnh tải về thì chạy `python3 <script>` từ thư mục nháp riêng, truyền đường dẫn ảnh làm tham số.
4. **Blender Cycles: vật đang mờ dần hiện thành mảng đen.** Vỏ có độ dày (modifier Solidify) và nhiều lớp chồng làm hết số lượt xuyên trong suốt mặc định (8). Sửa: `sc.cycles.transparent_max_bounces = 64`. Cái giá: khung có ba lớp vỏ trong suốt chậm gấp 3–4 lần khung vỏ kín (`tai_san/nhat_ky_video_ngang.md` mục 20).
5. **NASA không có mô hình 3D xe LRV chính thức** (kho NASA-3D-Resources chỉ có Lunar Module, kiểm 26/10/2026). Mô hình cộng đồng CC0 duy nhất ("NASA Lunar Rover for Blender" của OldSchool3D) nặng 2,1 GB. Trước khi hứa dựng một vật bằng "mô hình NASA" thì tra kho trước.

## 2026-10-27 — Chuỗi 15 video kiến thức điện chạy đêm bằng luồng công việc: mười ba lỗi đã vấp

**Bối cảnh:** đêm 26–27/10/2026, mỗi tác tử dựng một video (N03–N17), kế hoạch `san_pham/2026.10.26.chuoi_15_video_dien/tai_nguyen/kich_ban/2026.10.26.ke_hoach_chuoi_15_video_dien.md`, báo cáo tổng hợp `san_pham/2026.10.26.chuoi_15_video_dien/2026.10.27.duyet_chuoi_video_dien_v1.md` mục 5.1. Trung duyệt ghi ngày 27/10/2026. Quy tắc dựng rút ra cùng đợt ở module 10 mục 23.

1. **Khung hỏng ngẫu nhiên khi kết xuất WebGL.** Remotion với WebGL thỉnh thoảng ghi ra một khung có lớp chữ lặp thành lưới 3×3, mất hình 3D (N03: 4 khung trên 2.882; N05: 1 khung trên 3.562). Ảnh `still` không bị; bảng soát 3 giây một khung không bắt được. **Cách bắt:** `.venv_vieneu/bin/python scripts/quet_khung_hong.py <file.mp4>` quét mọi khung (rã thành ảnh 160×90 bằng ffmpeg kèm Remotion, đánh dấu khung lệch hẳn cả khung trước lẫn khung sau trong khi hai khung đó gần nhau); chạy khoảng 4–6 giây cho video 2 phút. Bắt buộc trước khi giao (module 10 mục 2). **Cách sửa không cần kết xuất lại:** rã video thành ảnh, thay khung hỏng bằng `npx remotion still --frame=N --jpeg-quality=95`, ghép lại bằng ffmpeg với `-map 1:a -c:a copy` để giữ tiếng cũ; lệnh đủ ở chú thích đầu script.
2. **ffmpeg đi kèm Remotion** không có đầu ra `rawvideo` và không có bộ lọc `overlay`; có `image2`, `scale`, `libx264`. Muốn xử lý từng điểm ảnh thì rã thành jpg rồi đọc bằng Pillow.
3. **Tạo hình học mới mỗi khung làm kết xuất chậm dần rồi dừng** (N17). `Tru` trong `CoBan.tsx` tạo `cylinderGeometry` mới mỗi khung khi đầu đoạn di chuyển. Vật nối hai điểm di chuyển liên tục phải dùng chung một hình đơn vị, mỗi khung chỉ đổi vị trí, hướng, tỉ lệ (mẫu: `DoanDay` trong `xuong_dai/dien_noi_neo/src/HoNeo.tsx`).
4. **`tao_thoi_gian.py` của `kw_kwh/` và `dien_ap/` không chép trường `to`** (tông của cảnh). Video lai 3D và bảng đen chép script này sẽ dựng mọi cảnh thành 3D mà không báo lỗi (N07). Chép từ video lai (`mwp_mwac/`, `bao_iec/`) hoặc kiểm trường `to` trong `src/thoi_gian.json` sau khi chạy.
5. **Hàm `tien(f, a, b)` trong `ThoiGian.ts` chặn độ dài khoảng tối thiểu 1 khung**, nên gọi với tiến độ thập phân 0–1 thay cho số khung thì hình không chạy tới đích (N08). Hàm này chỉ nhận số khung.
6. **Hàm `hien(f, a, …)` trả về 0 tại f = a.** Thẻ đi qua ranh cảnh mà cảnh sau gọi `hien(f, 0, …)` thì mất đúng một khung; dùng a = −1 (N15). Thẻ không sang cảnh sau phải có mờ dần cuối cảnh.
7. **`BangDen.tsx` khung D-10 không mờ đi cuối cảnh**, nên chuyển giữa hai cảnh bảng đen lộ một khung đen trống. Sửa: bọc nội dung trong nhóm có độ mờ giảm trong 10 khung cuối (N11).
8. **`CanhDongPin` nghiêng tấm về phía −z**: máy quay ở +z nhìn mặt sau, cánh đồng chỉ còn thanh khung (N07, N09). Bản trong `xuong_dai/mwp_mwac/` đã đổi thành +0,45 rad; chép từ bản này.
9. **Đo tương phản sai toạ độ và sai với vật mảnh.** `scripts/soat_khung_mp4.py` ghi khung 480×270, còn `do_tuong_phan_khung.py` nhận toạ độ theo điểm ảnh của chính ảnh đưa vào; toạ độ vật trong mã dựng (khung 1920×1080) phải chia 4 khi đo trên khung soát (N06, N14). Vật mảnh (dây, dãy pin xa, cột) phải đo trên khung 1920×1080 bằng phân vị 3% độ sáng trong vùng bao vật, vì ô 5×5 điểm ảnh lẫn nền nên báo tương phản thấp hơn thật (N04, N07).
10. **Chờ kết xuất bằng `until ! pgrep -f "<lệnh>"` không bao giờ dừng**, vì `pgrep -f` khớp cả chính dòng lệnh của vòng chờ. Chờ theo dòng kết thúc trong log, hoặc theo PID (`while kill -0 <PID>`) (N12).
11. **Lời đọc: tránh chữ "không" đứng sát trước số.** "nằm không 83%" bị nghe thành "0,83%" (N07). Viết lại câu để chữ khác đứng giữa.
12. **Hook tự lưu của Claude Code commit gộp cả thay đổi treo của phiên khác chạy song song**; bước "git add đúng file của mình" của từng tác tử không còn tác dụng khi nhiều tác tử và nhiều phiên cùng sửa một project (N07, N04). **Trung chốt 27/10/2026: giữ nguyên hook tự lưu.** Cảnh báo: khi chạy luồng công việc đêm thì không mở phiên khác sửa cùng project.
13. **Đọc tài liệu khi bị chặn tải hoặc công cụ không đọc được.** File .docx của EVN: rã `word/document.xml` bằng `zipfile` của Python. PDF mà WebFetch không đọc: lưu về máy rồi rã bằng `pypdf`. File .doc cũ: `textutil -convert txt` của macOS.

## 2026-10-27 — Dựng hoạt cảnh 3D bằng mô hình Blender tải về

Gom đầy đủ ở `skills/dung-hoat-canh-3d-blender/bai_hoc.md`. Những điểm chưa ghi ở mục 26/10 trên:

1. **File `.blend` tải về có thể chứa mã Python tự chạy.** Luôn mở bằng `Blender -b --disable-autoexec`.
2. **File mô hình để sẵn kiểu xuất EXR nhiều lớp.** Đặt `image_settings.media_type = "IMAGE"` trước khi đặt PNG, không thì ảnh ra là EXR.
3. **Mô hình tải về không theo tỉ lệ thật** (xe LRV khoảng 1/5): chỉnh khoảng cách máy quay, đèn, f-stop theo kích thước trong file.
4. **Ảnh kết xuất lọt vào git qua hook tự lưu** (250 MB, commit 10a753d, không viết lại lịch sử). Đã loại trừ `xuong_dai/**/public/blender_*/`, `xuong_dai/**/public/thu/`, `tai_san/mo_hinh_3d/*/*`.
5. **Blender không tự làm hình đẹp hơn Three.js.** Hình đẹp nhờ mô hình chi tiết có vân và có hoạt cảnh; mô hình khối cơ bản thì dùng Three.js.

## 2026-10-27 — Dựng video bằng một trang HTML và chụp khung theo đồng hồ ảo (cách làm LM-03)

**Bối cảnh:** học kỹ thuật từ repo awesome-opus5-5-videos, dựng công cụ `xuong_html/cong_cu/xuat_mp4.mjs` và chạy thử ba mẫu (cocktail, tăng áp, lịch sử AI) cùng một trang thử kỹ thuật 6 giây.

1. **`playwright-core` phải khớp đúng bản Chromium đã có trong `~/Library/Caches/ms-playwright`.** Bản mới nhất (1.64.1) đòi Chromium 1248 và ffmpeg 1013, máy chỉ có 1234 và 1011. Ghim `playwright-core` 1.62.0 trong `xuong_html/cong_cu/package.json`; không tải thêm trình duyệt.
2. **Quay thời gian thực (`recordVideo`) không dùng để giao:** tối đa 25 khung/giây, nền chuyển sắc bị chia khối, khoảng 1 Mbit/s. Chụp từng khung theo đồng hồ ảo cho file giống hệt từng byte qua ba lần chạy.
3. **Thẻ `<video>`, Worker và bộ lập lịch của React chạy theo giờ thật,** không theo đồng hồ ảo; trang dựng không dùng chúng. Thư viện nạp từ cdnjs cần có mạng lúc xuất.
4. **Nhoè chuyển động 60 khung/giây tốn máy gấp khoảng 8,6 lần bản 30 khung/giây** (đo 11,7 giây máy cho mỗi giây video). Chỉ xuất bản có nhoè sau khi Trung duyệt bản 30 khung/giây (`01_quy_trinh_chung.md` bước 7).
5. **Lớp hạt nhiễu làm file nặng và làm hỏng phép đo đứng hình.** Bản lịch sử AI 60 giây nặng 134 MB; `freezedetect` báo 0 đoạn đứng vì hạt làm mọi khung khác nhau. Giữ độ đục hạt sáng tối đa khoảng 6%, và cho trang tham số `?hat=0` để đo đứng hình.
6. **Đưa quá nhiều ảnh đích rời làm tác tử con bị đẩy ảnh khỏi ngữ cảnh.** Gộp thành 1–2 ảnh ghép (`xuong_html/cong_cu/cat_khung_xem.sh`).
7. **Ảnh lưới rộng quá 1566 điểm ảnh thì công cụ đọc ảnh không nhận.** Lưới khung của `cat_khung_xem.sh` giữ rộng 1564.
8. **Chuyển cảnh trống:** khung đúng mốc chương chỉ còn cảnh trước đang mờ. Cho cảnh sau hiện trước mốc 0,3–0,5 giây, cảnh trước tắt xong trước mốc 0,1 giây (nhật ký 3 vòng sửa ở `san_pham/2026.10.27.duyet_phong_cach_opus55/tai_nguyen/ban_nhap/NHAT_KY_VONG_SUA.md`).

## 2026-10-27 — Sửa cấu trúc project trên nhánh git riêng

**Bối cảnh:** dựng lại luồng Media (đánh số lại 18 module) trong lúc phiên khác vẫn làm video trên nhánh chính.

- Làm trên `git worktree` (bản sao làm việc của một nhánh riêng) ở `_luu_tru/` của cây Grok, xong gộp về nhánh chính. File bị `.gitignore` loại (thư viện Node, `.venv_vieneu`, video) không có trong bản sao: script nào mượn công cụ trong đó (ví dụ `xuong_thu_hyperframes/bin/ffprobe` mượn `xuong/node_modules`) sẽ không chạy trong bản sao.
- **Gỡ file khỏi git (`git rm --cached`) trên nhánh riêng rồi gộp về sẽ xoá luôn file đó trên đĩa của nhánh chính.** Việc gỡ thư mục lớn bị theo dõi nhầm phải làm thẳng trên nhánh chính và kiểm file còn trên đĩa sau đó (sổ nợ).
- Đổi tên module: sửa tham chiếu trong file hướng dẫn, skill, script; cố ý không sửa chú thích trong `xuong*/` và file lịch sử, dùng bảng chuyển `_bang_chuyen_module_2026.10.27.md` để tra.

## Bài học kế thừa từ META (không chép lại, chỉ trỏ)

Ba bài học sau nằm ở `90_bai_hoc.md` của project META, đọc khi gặp:
- 22/07 — `npx remotion skills add` chết với `spawn EINVAL` trên Windows với Node đời mới; cách gỡ là chạy thẳng lệnh đích.
- 23/07 — cửa sổ PowerShell Trung tự mở chặn `npm`/`npx` bằng chính sách thực thi mặc định; sửa một dòng bằng `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`. Lệnh chạy được qua công cụ của Claude Code **không** bảo đảm Trung tự gõ cũng chạy được.
- 23/07 — liên kết thư mục kỹ năng gãy khi đổi chỗ (bản gốc của bài học 28/07 ở trên).

## 2026-10-27 — Kéo giãn giọng bằng ffmpeg đi kèm Remotion

**Bối cảnh:** chỉnh tốc độ giọng VieNeu (VieNeu không có tham số tốc độ). Máy không có ffmpeg, sox, rubberband cài riêng; ffmpeg duy nhất là bản đi kèm Remotion ở `xuong/node_modules/@remotion/compositor-darwin-arm64/ffmpeg`, có bộ lọc `atempo`.

**Vấp 1:** gọi ffmpeg đó từ thư mục khác thì nó chết ngay (SIGABRT, `Library not loaded: libavdevice.dylib`), vì các thư viện `.dylib` nằm cạnh file chạy và được tìm theo thư mục hiện hành. **Cách gỡ:** chạy với thư mục hiện hành là thư mục chứa ffmpeg (`cwd=ffmpeg.parent`).

**Vấp 2:** bản này bị lược bớt, không có bộ ghi `pcm_f32le` (`Unknown encoder`). **Cách gỡ:** trao đổi bằng WAV 16 bit mặc định.

**Vấp 3 (cách đo):** đo tốc độ nói bằng ký tự mỗi giây làm đoạn nhiều thuật ngữ phiên âm bị coi là chậm và bị kéo quá tay; đo bằng âm tiết mỗi giây ổn định hơn. Hàm dùng chung ở `scripts/toc_do_giong.py`; cách dùng ở `08_giong_am_thanh_phu_de.md` mục 0c.

## 2026-10-27 — Cuộn dây máy điện ba pha: đầu cuộn cùng bán kính nhìn chính diện thành vòng cung đè nhau

**Bối cảnh:** video máy phát (N05, `xuong_dai/may_phat/`), Trung chê hình ba cuộn dây ở bản v2.

**Vấn đề:** mỗi pha dựng bằng hai thanh hộp ở bán kính 2,4 (không nằm trong rãnh) và hai nửa vòng xuyến cùng bán kính 2,4, ba pha chỉ khác độ sâu z. Nhìn chính diện, ba nửa vòng trùng bán kính nên chồng thành một vòng tròn kín nhiều màu, không đọc ra cuộn nào nằm ở đâu.

**Cách gỡ:** (1) cạnh cuộn nằm trong rãnh thật (stato 12 rãnh thành song song, `hinhStato` trong `MoHinh.tsx`); (2) mỗi pha một bán kính đầu cuộn riêng (2,66 · 2,95 · 3,24), dây ra khỏi rãnh bẻ ngang sát mặt stato tới bán kính của pha rồi mới vòng, nên ba đầu cuộn lồng nhau theo bán kính, đoạn bẻ ngang luôn nằm dưới các đầu cuộn khác nên không xuyên nhau; (3) bó dây là 6 ống tròn lệch nhau theo khung tịnh tiến song song của đường cong kín (`computeFrenetFrames(N, true)`, xoay cho trục thứ nhất trùng hướng bán kính ở giữa rãnh), không cần tự tính khung ở đoạn bẻ ngang (chỗ tiếp tuyến trùng hướng bán kính làm cách chiếu hướng bán kính bị suy biến).

**Bài học:** dựng thiết bị điện có nhiều cuộn, kiểm trước ở góc nhìn chính diện theo trục máy xem các phần cùng bán kính có chồng nhau không; tách theo bán kính, không tách theo độ sâu. Nhãn rãnh đặt ở mép lỗ stato (phía trong) thì không bị đầu cuộn che và không lệch do phối cảnh; đặt ngoài vỏ thì nhìn chéo lệch xa rãnh.

## 2026-10-27 — Chrome chạy ẩn của Puppeteer làm `open <địa chỉ>` không hiện trang

**Bối cảnh:** biểu tượng "Bảng video" trên màn hình nền (`scripts/bang_video/mo_bang.sh`) mở trang `http://localhost:4580` bằng `open "$URL"`; trình duyệt mặc định của máy là Chrome.

**Vấn đề:** Trung bấm đúp biểu tượng, máy chủ đã chạy, nhưng không thấy cửa sổ nào. Máy có ba bản Chrome chạy ẩn do Puppeteer (bộ điều khiển Chrome tự động mà Remotion dùng khi kết xuất) bật với `--headless=old` và hồ sơ tạm `puppeteer_dev_chrome_profile-*`; kết xuất xong chúng không tự tắt (tiến trình cha đã là `launchd`). macOS coi các bản này cũng là ứng dụng `com.google.chrome`, nên `open <địa chỉ>` có lúc gửi trang vào một bản ẩn: trang "mở" nhưng không có cửa sổ.

**Cách nhận ra:** `ps -axo pid,command | grep "Google Chrome" | grep -v Helper` thấy dòng có `--headless` và `puppeteer_dev_chrome_profile`; danh sách cửa sổ (Quartz `CGWindowListCopyWindowInfo`) không có cửa sổ nào mang tên trang.

**Cách gỡ:** không mở bằng trình duyệt mặc định; mở một bản Chrome mới với hồ sơ riêng:
`open -na "Google Chrome" --args --user-data-dir="$HOME/Library/Application Support/BangVideoChrome" --no-first-run --no-default-browser-check --app="$URL"`.
`-n` buộc Launch Services mở bản mới thay vì chọn bản đang chạy; hồ sơ riêng đã chạy thì Chrome chuyển yêu cầu sang cửa sổ đó; `--app` cho cửa sổ kiểu ứng dụng không thanh địa chỉ. Không có Chrome thì `open -a Safari "$URL"`.

**Bài học:** trên máy này, mọi script mở trang web cho Trung xem (bảng, báo cáo HTML) không dựa vào `open <địa chỉ>` khi Chrome là mặc định; chỉ định rõ bản Chrome có hồ sơ riêng hoặc dùng Safari. Không tự tắt các Chrome chạy ẩn của Puppeteer: có thể đang thuộc một lượt kết xuất của phiên khác; muốn dọn thì kiểm trước bằng `pgrep -f "remotion render"` rằng không còn lượt kết xuất nào.

## 2026-10-27 — Hai bản tách của cùng một cuộc trò chuyện cùng cho chạy tiếp một tác tử con, hai bên ghi đè thư mục video của nhau

**Bối cảnh:** lô 18 video kiến thức điện chung và điện mặt trời (kế hoạch `san_pham/2026.10.27.lo_video_dien_chung_va_mat_troi/tai_nguyen/kich_ban/2026.10.27.ke_hoach_lo_18_video.md`). Phiên gốc giao ba tác tử con dựng ba video đầu (N29 ánh nắng, N33 phao nổi, N54 hộp hợp bộ) thì bị ngắt, ba tác tử dừng giữa chừng. Trung đã tách (fork) cuộc trò chuyện thành hai phiên. Cả hai phiên đều giữ mã của ba tác tử trong lịch sử trò chuyện, và cả hai đều cho ba tác tử chạy tiếp. Kết quả: mỗi video có hai tác tử chạy cùng lúc, cùng ghi vào một thư mục mã dựng và một thư mục sản phẩm, không bên nào biết bên kia. Trung duyệt ghi bài học ngày 28/10/2026.

**Hậu quả:**
- N33 phao nổi: kịch bản 8 chương của phiên này bị bản 7 chương của phiên kia ghi đè; thư mục giọng đọc thành bản trộn gồm chương 1–7 của một bên và chương 8 của bên kia. Phải chọn lại một kịch bản rồi đọc lại giọng.
- N54 hộp hợp bộ: tác tử của một phiên thấy file trong thư mục đổi mà nó không ghi, nên tự dừng.
- N29 ánh nắng: một bên mới chép khung mã, chưa ghi đè gì.
- Hook tự lưu cuối lượt commit gộp file của cả hai bên (cùng hiện tượng mục 12 bài học chuỗi 15 video ở trên), nên lịch sử git không tách được bên nào ghi file nào.

**Cách gỡ đã làm:** dừng hẳn tác tử của một phiên; hai phiên thống nhất chỉ một phiên giữ trọn hàng chờ của lô; phiên dừng gửi cho phiên giữ lô danh sách file đã ghi, số liệu đã kiểm chứng và cách sửa N33. Phiên dừng không sửa sổ nợ, không dọn bản nháp trong thư mục của lô nữa.

**Bài học:**
1. **Trước khi bảo một tác tử con "làm tiếp" sau khi phiên bị ngắt, kiểm xem việc đó có đang được làm ở nơi khác không.** Ba bước:
   - Xem danh sách phiên liên kết (`list_sessions {"linked": true}`): có bản tách nào khác của cùng cuộc trò chuyện không.
   - Xem thư mục mã dựng và thư mục sản phẩm của video có file mới ghi trong 10 phút gần đây không: `find <thư mục> -mmin -10 -type f | head`.
   - Xem có lượt đọc giọng hoặc kết xuất nào đang chạy cho video đó không: `pgrep -fl "<tên thư mục mã dựng>"`.
   Có một trong ba dấu hiệu thì hỏi Trung trước, không cho chạy tiếp.
2. **Một lô việc chỉ một phiên giữ.** Tách cuộc trò chuyện khi lô đang chạy thì phải nói rõ ngay phiên nào giữ lô; phiên còn lại chỉ làm việc ngoài lô (với lô 18 video: phiên "Video project inventory table (fork)" giữ lô từ 27/10/2026).
3. **Phát hiện hai bên cùng ghi thì dừng một bên ngay**, không để hai tác tử tự sửa đè lên nhau. Bên dừng liệt kê file đã ghi cho bên giữ, bên giữ quyết định giữ bản nào.
4. Tác tử con thấy file trong thư mục của mình đổi mà nó không ghi thì phải dừng và báo, như tác tử N54 đã làm; đưa yêu cầu này vào lời giao việc của các lô sau.

## 2026-10-28 — Lô 16 video điện gió chạy qua đêm: lỗi kỹ thuật và cách gỡ

**Bối cảnh:** lô N36–N52 (16 video ngang, Remotion + three.js), hai video cùng lúc, kết xuất nháp nửa độ phân giải rồi bản đủ bằng chuỗi ảnh jpeg. Sổ theo dõi gốc: `san_pham/2026.10.27.lo_video_dien_gio/tai_nguyen/kich_ban/2026.10.27.so_theo_doi_lo_dien_gio.md` mục "Bài học chờ gom" (Trung duyệt gom 28/10/2026).

1. **Ghép chuỗi ảnh và tiếng trong một lệnh ffmpeg làm mất khung hoặc mất tiếng.** `ffmpeg -framerate 30 -i element-%04d.jpeg -i tieng.aac -shortest ...` cho file đúng thời lượng nhưng thiếu 61 khung (N37) và 302 khung (N41); một bản khác mất tiếng từ giây 127 (N40, Trung nghe ra). Cách đúng: mã hoá hình riêng (`-framerate 30 -c:v libx264 -crf 18 -pix_fmt yuv420p`), rồi ghép tiếng bằng `-c copy`, không `-shortest`. Kiểm sau ghép: `ffprobe -count_packets` số gói hình bằng số ảnh, và `ffprobe -show_entries stream=codec_type,duration` độ dài luồng tiếng bằng luồng hình (lệch ≤ 0,1 giây). Chỉ đếm khung là chưa đủ.
2. **Khung hỏng WebGL ngẫu nhiên.** Vị trí đổi mỗi lần kết xuất (N40: nháp 17 khung ở cảnh 8, bản đủ 27 khung ở cảnh 1); bản đủ thường nhiều hơn bản nháp nửa độ phân giải (N36: 4 so với 11), đứng thành cụm 3 khung liền. Quét `scripts/quet_khung_hong.py` sau MỌI lần kết xuất; thay cả khung kề bằng `remotion still` (hoặc `renderStill` trong một lần đóng gói, khoảng 10 khung mỗi 40 giây) rồi ghép một lần. ffmpeg kèm Remotion không có bộ lọc `select`: lấy khung theo số bằng `-ss <n/30 + 0,001>`.
3. **zsh không tách từ biến chưa trích dẫn** (`$F` chứa nhiều số khung truyền thành một đối số); `$(cat file)` và `$=F` thì tách. Truyền danh sách khung cho `anh_soat.mjs` bằng `$(cat ...)`.
4. **`ShapeGeometry` đặt phẳng bằng `rotateX(-π/2)` đảo trục y thành −z:** lỗ khoét trên mặt đất (hố móng) phải đảo dấu z.
5. **Hằng quên import trong `KichBan.ts` chỉ lộ khi chạy `remotion still` đúng khung dùng nó** ("Minified React error #130" hoặc khung trống): still đủ mọi cảnh trước khi kết xuất.
6. **`instancedMesh` cần `frustumCulled={false}`**, nếu không bị cắt nhầm khi `args` có tâm ở gốc toạ độ.
7. **Mặt đất ở xa (khoảng 1.500 m) bị z-fighting lớp phủ:** `near` của máy quay = khoảng cách × 0,004 (tối đa 12), lớp phủ cao 0,6 m, `polygonOffset`.
8. **Vật đặt trong nhóm có `scale`** phải tính độ cao theo hệ toạ độ cục bộ, nếu không lơ lửng (phao N51).
9. **Vật có độ mờ `mo` < 1 có thể biến mất hẳn** (thân sà lan đang mờ dần, N52): bật tắt hai trạng thái, chưa rõ nguyên nhân.
10. **Tắt lượt kết xuất của mình:** PID trong `du_lieu/hang_doi_ket_xuat/cho_<n>/thong_tin` là PID `npx`; tiến trình con (node, Chrome, ffmpeg) vẫn chạy, phải tắt cả cây con của PID đó.
11. **Máy không có `pdftotext`:** đọc PDF bằng PyMuPDF (`import fitz`, chạy `python3` không có `-I` vì `-I` bỏ thư viện cài ở thư mục người dùng). File GIZ dùng ký tự "Ɵ" thay "ti", thay trước khi grep.
12. **WebFetch đêm 27–28/10/2026:** máy chủ NREL (nrel.gov, docs.nrel.gov) lỗi phân giải tên miền suốt đêm; `emp.lbl.gov` trả 403, `eta-publications.lbl.gov` đọc được; justia trả 403. Số chỉ có trong báo cáo NREL phải kiểm lại hoặc lấy nguồn thay ở thư viện tài liệu quốc tế `RM MB/tai_san/tai_lieu_quoc_te/dien_gio/` (DEA, World Bank, GIZ, IRENA, ADB).
13. **Hook tự lưu cuối lượt commit cả file log** (`xuong_dai/<dự án>/n*_*.log`): đã thêm dòng `xuong_dai/**/n*_*.log` vào `.gitignore` ngày 28/10/2026.
14. **Hàng đợi kết xuất chung:** một lượt chụp ảnh 7 giây từng phải chờ 361 giây sau hai lượt kết xuất dài. Đã có cách gỡ từ 28/10/2026 (sổ nợ N58): cờ `--nhanh` của `scripts/hang_doi_ket_xuat.sh` cho lượt dưới 30 giây đi chỗ nhanh riêng.

## 2026-10-28 — Lô 18 video điện chung và điện mặt trời: lỗi kỹ thuật và cách gỡ

**Bối cảnh:** lô 18 video ngang kiến thức điện chung và điện mặt trời (Remotion + three.js, mỗi video một tác tử con, mã `N<số>`), chạy 27–28/10/2026. Sổ theo dõi gốc: `san_pham/2026.10.27.lo_video_dien_chung_va_mat_troi/tai_nguyen/kich_ban/2026.10.27.so_theo_doi_lo.md` mục "Bài học chờ gom" (Trung duyệt gom 28/10/2026). Những điều đã có ở hai mục ngay trên (khung hỏng WebGL phải quét sau mọi lần kết xuất, `remotion still` đủ cảnh trước khi kết xuất, zsh không tách từ, PyMuPDF và `-I`, hook tự lưu, hàng đợi) không chép lại; mục này chỉ ghi dữ kiện mới. Quy trình kết xuất, vá khung hỏng, hàng đợi nay do `scripts/pha_may/HUONG_DAN.md` lo.

**Khung hỏng WebGL**

1. **Số khung hỏng tăng theo tải máy.** N30 (cấu hình Chrome `gl: "angle"` không đổi) hỏng 5 khung lúc máy rảnh, 156 khung lúc nhiều video cùng kết xuất; N24 hỏng 0 khung lúc rảnh, 63 khung khi load average trên 90; N27 bản đủ 1080p lúc tải 80–105 hỏng 98/2.871 khung (3,4%), còn bản nháp nửa độ phân giải lúc tải 13–20 sạch. Kết xuất lại theo đoạn khung vẫn gặp lỗi lưới 3×3 (N32: 28/1.200 khung), nên quét lại sau mỗi đoạn. Tránh kết xuất khi tải rất cao. Cách vá nhanh (N30): kết xuất lại các khung hỏng bằng MỘT trình duyệt dùng chung trong một lần đóng gói: 156 khung trong 55 giây, so với khoảng 5 giây mỗi khung khi mở lại trình duyệt từng lần. Theo mã hiện tại, `scripts/pha_may/ve_khung.mjs` đóng gói một lần nhưng mỗi `renderStill` vẫn mở trình duyệt riêng (chưa truyền `puppeteerInstance`), tức chưa có mức 0,35 giây mỗi khung của N30. Bản nháp nửa độ phân giải đã bỏ từ 28/10/2026, nên lời dặn "quét cả bản nháp" của N24 không còn dùng.
2. **Thay khung hỏng bằng lớp phủ (`overlay`) của ffmpeg phải làm trong không gian RGB và giữ dải màu gốc.** Video Remotion có `yuvj420p`, `bt470bg`; đi qua `yuv420p` dải tv làm khung thay lệch khoảng 8 mức xám so với khung kề (N32). Ghép qua ống RGB, giữ `yuvj420p`, `bt470bg` và tiếng gốc (`-c:a copy`). `pha_may` thay khung trong chuỗi ảnh trước khi mã hoá một lần nên không gặp lỗi này.
3. **`quet_khung_hong.py` báo nhầm đỉnh chớp nháy ở chuyển cảnh** (khung màu phẳng, hai bên đối xứng) (N32). Khi đọc danh sách bỏ qua khung trong ±1 khung quanh mốc nháy; script chưa xử lý. Dòng tổng số khung nghi hỏng ở cuối danh sách phải lọc trước khi đưa số khung vào `renderStill` (N27).
4. **Khung cắt bằng `-ss` của ffmpeg nhảy về khung gần nhất nên không lộ khung hỏng** (N27): muốn thấy lưới 3×3 phải giải mã tuần tự như `quet_khung_hong.py`. `-ss` còn có thể lệch 1 khung so với số khung của `quet_khung_hong.py` (N25).

**Đo đứng hình, độ to, kích thước trên khung**

5. **ffmpeg kèm Remotion không có `ebur128`, `freezedetect` và đầu ra `null`**, nên không đo được độ to và đứng hình bằng nó (N29, N18). Dùng `xuong_thu_hyperframes/bin/ffmpeg` (có cả hai); lời giao việc cho tác tử con phải nhắc đường dẫn này (đã ghi ở `07_khuon_prompt_va_kiem_chat_luong.md` mục 9, `pha_may` dùng sẵn).
6. **Đo đứng hình bằng Pillow khi chỉ có ffmpeg kèm Remotion** (N33): rã video thành ảnh 192×108, tính độ chênh trung bình giữa hai khung liền nhau; đoạn độ chênh gần 0 kéo dài là đứng hình. Có `freezedetect` của ffmpeg đủ bộ lọc thì dùng nó, không dùng cách này.
7. **Đo chiều cao vật trên khung bằng mặt nạ màu:** phải lọc nét chữ (Pillow `MaxFilter` 7 rồi `MinFilter` 15) để khung bao không ăn cả chữ (N25).

**Thư mục tạm dùng chung, tắt nhầm lượt, tác tử con**

8. **Tắt nhầm lượt kết xuất của video khác.** Các tác tử con dùng chung thư mục tạm của phiên điều phối nên script trùng tên bị ghi đè; `pkill -f` theo tên chung tắt nhầm lượt kết xuất của video khác: N22 tắt nhầm N21 lúc 19:03; N33 lúc 18:54 tắt render của mình bằng lệnh lọc theo tên file đầu ra `video_v2.mp4`, trùng tên đầu ra của N21, nên tắt nhầm lượt N21 (N21 chạy lại). Cách gỡ: tên script tạm và tên file đầu ra đều có tiền tố mã video (đã thêm vào kế hoạch lô); tắt lượt của mình theo PID của chính lượt đó (tắt cả cây con, xem mục 10 của lô điện gió), không `pkill -f` theo tên chung. `scripts/hang_doi_ket_xuat.sh` đã ghi sẵn lời dặn không dùng `pkill` hay `killall` theo tên chung.
9. **Lượt kết xuất Remotion + three.js treo im lặng.** N34: PID 83246 dừng ở khung 388/3.669, 0% CPU, `--timeout` không kích hoạt. Tác tử con bị hệ thống quyền chặn lệnh `kill` ("Interfere With Workloads"); phiên điều phối không tắt thay, báo Trung tắt tay. Cần vòng giám sát: số khung không tăng trong 3 phút thì dừng và chạy lại với `--concurrency=2`. Tiến trình treo vẫn được đếm là lượt đang chạy: N23 chờ thừa 1.080 giây. Lệnh đếm cũ `pgrep -f "remotion render"` còn sai thêm vì đếm mỗi video thành 2 tiến trình và đếm cả vòng chờ; đã thay bằng `scripts/hang_doi_ket_xuat.sh` (số chỗ cố định) từ 28/10/2026. Theo mã hiện tại hàng đợi chỉ trả chỗ khi PID đã chết (kiểm `kill -0`), chưa phát hiện lượt treo: việc giám sát số khung vẫn còn mở.
10. **Lỗi mạng ngắt tác tử con.** 27/10/2026 khoảng 19:52–20:21 lỗi mạng ngắt cả ba tác tử N34, N31, N23; gọi lại bằng `SendMessage` tới mã tác tử thì chạy tiếp và giữ phần đã làm (khác với lần phiên khởi động lại, mất bản ghi). Lỗi mạng cũng làm lệch giờ trong file tiến độ của tác tử con (N28: các dòng sau 01:05 ghi "đồng hồ máy"): khi đọc lại tiến độ, lấy thứ tự dòng thay cho giờ.

**Lệnh shell và công cụ trên macOS**

11. **`rm` kèm glob.** Bộ kiểm an toàn chặn lệnh `rm` kèm glob đứng sau `cd` (N54): dựng thư mục mã bằng chép chọn lọc từng file, không chép cả rồi xoá. Trong zsh, `rm -f <mẫu>` mà mẫu không khớp tệp nào báo "no matches found" (nomatch) và làm gãy chuỗi `&&` (N27); tách lệnh dọn thành lệnh riêng hoặc thêm `|| true`. `remotion bundle` ghi vào `build/` trong thư mục dự án.
12. **`sed -i` trên macOS cần đối số rỗng** (`sed -i ''`); tác tử con hay viết kiểu GNU và lệnh sai (N33). Sửa file bằng Python hoặc công cụ Edit.
13. **macOS không có lệnh `timeout`** (N24): đừng dùng trong lệnh bọc hàng đợi.
14. **Đọc PDF lớn:** WebFetch không mở được PDF trên 10 MB (QCVN 02:2022/BXD, N24); tải về máy rồi đọc bằng `pypdf`. `python3 -I` không nạp `pypdf` (cài ở thư mục người dùng, giống Pillow và PyMuPDF): chạy `python3 -c` từ thư mục không chứa file `.py` (N22).
15. **Công cụ chụp khung soát** `khung_xem.mjs`, `anh_soat.mjs` (từ `xuong_dai/scada/`) kết xuất 12 khung soát trong khoảng 12 giây. Dòng "Encoded n/N" xuất hiện trước khi file ghi xong: chờ tiến trình thoát rồi mới đọc ảnh (N54).
16. **Máy không có `tsc`.** "Minified React error #130" thường do import thiếu, bắt bằng `remotion still` (mục 5 của lô điện gió). Script ghi file phải dùng đường dẫn tuyệt đối: file `.chuong.json` từng bị ghi lạc ra gốc `Media/` (N21).

**Shader, three.js, Remotion, mã hoá**

17. **Điều kiện ẩn vật khi độ mờ gần 0 viết `!(mo > 0.01)`, không viết `mo <= 0.01`**, vì `mo` có thể là `undefined` và mọi phép so sánh với `undefined` cho kết quả sai (N33). Mặt nền trùng độ cao với đáy khối nước gây nhấp nháy: hạ mặt nền 0,05.
18. **Shader tự viết trong three.js: `#include <...>` phải đứng dòng riêng**, nếu không hiệu ứng mất im lặng (chỉ báo `VALIDATE_STATUS false`). Tìm "Shader Error" trong nhật ký kết xuất (N33 v2).
19. **`TubeGeometry`:** dựng lò xo đúng chiều dài, không scale, để tiết diện không dẹt (N31).
20. **Máy quay `far` = 400 của khung mã cũ làm mất cảnh rộng** (bản đồ cách 450): đặt `far` = 1500 (N35). Cùng họ với mục 7 của lô điện gió (`near`).
21. **Nền đất có hạt làm file mp4 gấp đôi:** N34 từ 216 MB còn 105 MB với `--crf=23`. `pha_may` hiện cố định `crf` 18.
22. **Remotion `Audio` nhận cùng lúc `playbackRate` và `trimBefore`:** nhạc ngắn hơn video 7% thì bỏ bớt đầu và phát chậm 0,965 (N21 v2).

**Phụ đề và `moc_tu.json`**

23. **Phát hiện máy đọc nuốt chữ bằng độ dài từ trong `moc_tu.json`:** "kWp" chỉ 0,33 giây so với 0,47–0,59 giây ở chỗ khác. Gỡ: bỏ dấu phẩy ngay sau từ trong trường `doc` (N35).
24. **Phụ đề chạy chữ lấy từ `public/giong_goc/moc_tu.json` tạo lúc sinh giọng.** Sửa trường `text` sau khi sinh giọng thì phải sửa tay `moc_tu.json` (N30).

**Git và hook**

25. **Hook tự lưu cuối lượt commit dần cả file trung gian của tác tử con chạy nền** (N54). Hook của phiên điều phối gom file của các tác tử con đang chạy vào commit "Tu dong luu"; kiểm bằng `git diff HEAD`, không tin `git status` (N21 v2).
26. **Tác tử con `git commit --amend` nhầm lên commit tự lưu của hook, rồi khôi phục;** nội dung không đổi (N32). Kế hoạch lô nên cấm `--amend`.

## 2026-10-28 — yutu không đăng nhập được: đọc file ngoài thư mục đang đứng và địa chỉ quay về 8216

Hai lỗi nối nhau khi đăng nhập yutu 0.11.0 để sửa mô tả video đã tải:
1. `yutu auth --credential ~/.config/dang-youtube/client_secrets.json …` báo `failed to parse client secret … illegal base64 data at input byte 22`. yutu chỉ đọc file nằm trong `YUTU_ROOT` (mặc định là thư mục đang đứng); đường dẫn ra ngoài bị coi là chuỗi base64. Cách gỡ: `cd ~/.config/dang-youtube` rồi dùng tên file tương đối.
2. Qua được bước 1 thì Google báo `Lỗi 400: redirect_uri_mismatch`. yutu dùng địa chỉ quay về `http://localhost:8216` (chuỗi có trong tệp chạy của yutu), không lấy từ file khoá như ghi chú cũ trong skill `dang-youtube` nói; OAuth client của dự án `chuyennghedien` chỉ khai `http://localhost:8080/oauth2callback`. Trang lỗi còn cho thấy Chrome đang chọn tài khoản cá nhân, và tài khoản đang mở Cloud Console không có quyền xem dự án.
Cách đã dùng: bỏ yutu, gọi thẳng YouTube Data API bằng `request.token` của youtubeuploader (phạm vi `youtube`, `youtube.force-ssl`, `youtube.upload`, kiểm bằng tokeninfo), `videos.update` chỉ phần `snippet`. Lưu ý thêm: YouTube tự xếp thẻ theo chữ cái, so thẻ sau khi sửa phải không kể thứ tự. Script: `skills/viet-chu-dang-video/scripts/cap_nhat_youtube.py`.


## 2026-10-29 — ffmpeg 6.0 ghi xong tiếng nhưng không thoát khi nhạc lặp vô hạn chạm hết file đúng lúc kết thúc

Pha máy video HTML: phiếu n81 và n72 đứng ở bước trộn tiếng từ 00:28 tới 04:52, ffmpeg 0% CPU, `tieng.wav` đã ghi đủ và đã đóng file, tiến trình chỉ còn mở file nhạc. Hai video có nhạc dài đúng bằng video, và lệnh trộn nạp nhạc bằng `-stream_loop -1`. Chạy lại lệnh n81 bốn lần: treo cả bốn; bỏ `-stream_loop` thì xong trong 2 giây, tiếng ra trùng mã băm với bản cũ. n87 cùng tình huống lại qua được, nên đây là lỗi có lúc xảy ra, không phải lần nào cũng xảy ra; nhạc dài hơn video (n86, n96) hoặc ngắn hơn và lặp ở giữa video (n100) chưa gặp. Cách gỡ trong `scripts/pha_may/pha_may.mjs`: không dùng `-stream_loop -1`; nhạc ngắn hơn video thì nạp lại file nhiều lần rồi nối bằng bộ lọc `concat`; mọi lệnh ffmpeg, ffprobe của trình chạy có thời hạn 60 phút (riêng trộn tiếng 10 phút), quá hạn thì tắt và báo lỗi. `xuong_html/cong_cu/ghep_am_thanh.sh` sửa cùng cách ngày 29/10/2026 (thử nhạc dài đúng bằng video, nhạc 20 giây lặp cho video 50 giây: đều thoát bình thường).

## 2026-11-03 — Chromium không giao diện vẽ WebGL bằng CPU khi xuất video HTML có 3D: phải bật GPU bằng cờ `--use-angle=metal`

**Bối cảnh:** dựng bộ mô hình 3D khu công nghiệp dùng chung (`tai_san/kho_hinh_chung/khu_cong_nghiep/`, Three.js r170, khoảng 4,2 triệu tam giác, vẽ gấp 2 lần rồi thu nhỏ) và xuất bằng `xuong_html/cong_cu/xuat_mp4.mjs`.

**Vấn đề:** Chromium chạy không giao diện (headless) của Playwright mặc định vẽ WebGL bằng SwiftShader, tức là vẽ bằng CPU, không dùng GPU Apple M5. Trang 3D vẫn ra hình đúng, không báo lỗi gì, chỉ chậm; nên rất dễ tưởng chậm là do cảnh nặng. Kiểm bằng `gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)` trong trang: không có cờ thì ra chuỗi có chữ "SwiftShader"; có cờ thì ra "ANGLE (Apple, ANGLE Metal Renderer: Apple M5…)".

**Số đo** (1920×1080, 30 khung/giây):

| Trường hợp | Giây máy mỗi giây video |
|---|---|
| Video mẫu 3D KCN bản 1, cảnh đơn giản hơn nhiều, SwiftShader | 4,6–6,2 |
| Mô hình `kcn_dong_bang` đầy đủ, vẽ gấp 2 lần, có cờ GPU, video thử 30 giây | 1,1–1,8 (số lớn khi máy đang chạy phiên khác) |

**Lệnh mẫu:**

```bash
cd xuong_html/cong_cu && node xuat_mp4.mjs "<đường dẫn>/trang.html" 30 --fps 30 --kich-thuoc 1920x1080 --co-chromium=--use-angle=metal
```

**Chỗ dễ sai:** phải viết liền dấu `=` (`--co-chromium=--use-angle=metal`). Viết tách `--co-chromium "--use-angle=metal"` thì bộ đọc tham số `parseArgs` của Node coi giá trị bắt đầu bằng `--` là một cờ khác và báo lỗi. Script chụp ảnh bằng Playwright tự viết thì truyền `args: ['--use-angle=metal']` khi `chromium.launch` (xem `tai_san/kho_hinh_chung/khu_cong_nghiep/chup_anh_mau.mjs`).

**Bài học chính:** mọi trang HTML có WebGL (Three.js) xuất ra video trên máy này đều thêm cờ trên; trước khi kết luận cảnh quá nặng, kiểm chuỗi tên bộ vẽ trước.

## 2026-11-03 — Video N301 do Gemini 3.8 Flash dựng thành slide chữ: thêm máy đo hình làm cổng

**Bối cảnh:** project VideoNganHang, video N301 "Vốn lưu động ròng" dựng bằng Antigravity (Gemini 3.8 Flash) trong khoảng 40 phút, hai vòng sửa, chỉ chạy công cụ tự động kiểm chữ đè. Hình xấu hơn n199 (Claude dựng, năm vòng ảnh tĩnh, soát độc lập, đợt sửa C).

**Số đo** (`scripts/do_chat_luong_hinh.mjs --buoc 2`, mỗi chương): n199 chuyển động 1,00, 4–11 từ trên hình, chữ nhỏ dưới 26 px 0–15%; n301 chuyển động 0,15–0,36, 62–196 từ, chữ nhỏ 65–88%. Mã n301 có khoảng 90 chỗ tạo thẻ chữ (n199: 11) và không gọi khuôn nào trong kho (n199 gọi 3). Ghi nhãn CL-14 nhưng dựng thẻ chữ.

**Nguyên nhân:** (1) công cụ tự kiểm cũ (chữ đè, tràn khung, tương phản) không đo được "hình có đẹp, có chuyển động không"; (2) skill không có chuẩn hình và không có bước soát độc lập; (3) model rẻ tự khen kết quả.

**Cách xử lý:** máy đo hình làm cổng trước pha máy; `skills/lam-video-ngan-hang/chuan_hinh_video_ngang.md`; `mau_soat_doc_lap.md` (phiên mới soát); ảnh chuẩn `tai_san/anh_chuan_hinh/`; ít nhất 3 vòng ảnh tĩnh. N301 chưa được dựng lại.

**Cảnh báo:** máy đo chỉ bắt chuyển động, chữ dày, chữ nhỏ. Model có thể thêm chuyển động giả (hạt nền) để qua cổng: phiên soát độc lập và Trung xem vẫn cần. Ngưỡng đặt theo một video mẫu (n199), nên điều chỉnh khi có thêm video đạt.

## 2026-11-03 — N301 và N302 qua hết cổng nhưng hình minh hoạ không liên quan tới khái niệm

**Bối cảnh:** N301 "Vốn lưu động ròng" (Antigravity, Gemini 3.8 Flash) dựng lại theo chuẩn hình bản 1, N302 "EBITDA" (Codex). Cả hai: máy đo 8/8 và 9/9 chương đạt, soát độc lập 0 nặng 0 vừa. Trung xem thấy hình không liên quan nội dung: nhà xưởng bốc khói cho "lấy ngắn nuôi dài", cốc nước cho vốn lưu động ròng, đoạn thẳng hai chấm nghiêng qua lại cho "ba nguyên tắc", hàng chấm chạy dưới các cột EBITDA, bốn ô nối bằng đường chấm cho "EBITDA loại những khoản nào".

**Nguyên nhân (đã kiểm trong mã):** (1) chuẩn hình bản 1 dặn "lấy cảnh gần nhất trong n199 và đổi nội dung, không viết lại từ đầu"; `canh.js` của cả hai video giữ nguyên bộ hàm vẽ cảnh n199 (`be`, `voi`, `roi`, `cham`, `toa`), mảng `nhip` của N302 ghi `khuon` "roi, cham, be từ n199" cho cả chín chương; bể, hạt đúng nghĩa với tiền gửi (n199), sai nghĩa với vốn lưu động ròng và EBITDA; (2) bảng khuôn tra theo danh từ (doanh nghiệp → nhà xưởng, ngân hàng → toà nhà), N301 không gọi `khuon_bang_can_doi.js` dù chương 2 nói bảng cân đối; (3) mục 3b bản 1 đề xuất hình bể nước cho vốn lưu động ròng; (4) luật tối đa 12 từ và bắt chuyển động đẩy model vẽ hình trừu tượng không nhãn; (5) khung trang n199 lắc khung hình và cho nhãn nhấp nhô, đo N301 giây 170–190 (hình không đổi nội dung) chênh lệch khung 3,0–4,8 so với ngưỡng 0,35, nên máy đo chấm chuyển động 1,00; (6) phiếu soát chỉ hỏi chuyển động, số chữ, cỡ chữ; người soát tả lại vật trên hình rồi tự gán nghĩa.

**Cách xử lý:** `chuan_hinh_video_ngang.md` bản 2 (câu cơ chế trong `nhip.json`, phép thử tắt tiếng, biểu tượng nhân vật chỉ làm phụ, cấm chuyển động trang trí, bảng khuôn theo cơ chế, câu cơ chế mẫu cho vốn lưu động ròng và EBITDA, bỏ lời dặn chép cảnh n199); `mau_soat_doc_lap.md` bản 2 (đoán khái niệm từ ảnh trước khi đọc kịch bản, đoán sai là nặng); AGENTS.md quy tắc 9; skill bước 5. Chưa sửa máy đo (`do_chat_luong_hinh.mjs` vẫn tính lắc khung hình là chuyển động). N301 và N302 chưa dựng lại.

