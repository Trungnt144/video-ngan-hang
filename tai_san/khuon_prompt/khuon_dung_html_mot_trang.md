# Khuôn giao Opus dựng video bằng một trang HTML (LM-03)

> Dùng khi Claude giao tác tử con Opus dựng một cảnh hoặc một video bằng một file HTML (LM-03, HTML một trang chụp khung theo đồng hồ ảo). Quy tắc và lý do: `07_khuon_prompt_va_kiem_chat_luong.md`. Cách làm và chi phí: `05_cach_lam.md` mục LM-03.
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Khuôn rút từ 703 prompt của repo `yihui-dev/awesome-opus5-5-videos` (cấu trúc của `0xnicc0-516612`, `annacher-433425`, `flxrnc-251921`, `everestchris6-399895`) và lỗi thật gặp ở phép thử "Lịch sử AI" 27/10/2026. Chưa chạy với giọng đọc VieNeu của Media.

## 1. Trước khi gửi khuôn

Kiểm đủ bảy điều; thiếu điều nào thì làm xong rồi mới gửi.

| # | Việc | Ở đâu |
|---|---|---|
| 1 | Đã có file dữ kiện: mọi số, tên, câu chữ sẽ hiện trên màn hình, mỗi mục ghi `da_kiem` hoặc `minh_hoa` | `san_pham/<thư mục video>/tai_nguyen/kich_ban/<tên>.du_kien.json` |
| 2 | Storyboard và bản đồ nhịp đã qua cửa duyệt | `07_khuon_prompt_va_kiem_chat_luong.md` mục 4 |
| 3 | Ảnh đích đã gộp thành 1–2 ảnh ghép, có mốc giây và 3–5 dòng nêu điều cần học | mục 6 module 07 |
| 4 | Đã chép đoạn "hướng" của chất liệu | `huong_theo_chat_lieu.md` |
| 5 | Danh sách cấm theo phong cách khớp chất liệu (không chép nguyên từ khuôn khác) | mục 11 module 07 |
| 6 | Không có dữ liệu khách hàng, logo thương hiệu thật, logo MB, ảnh mặt người thật trong đầu vào | `13_ban_quyen_va_bao_mat.md` |
| 7 | Thư viện (GSAP, Three.js) đã tải về `xuong_html/<tên>/thu_vien/`, ghi rõ phiên bản | mục 4 bên dưới |

Bảng các chỗ trống `{{...}}` trong khuôn:

| Chỗ trống | Điền |
|---|---|
| `{{TEN}}` | Tên không dấu, ví dụ `lich_su_ai` |
| `{{W}}`, `{{H}}`, `{{KHO}}` | 1920, 1080 (ngang) hoặc 1080, 1920 (dọc); `{{KHO}}` viết dạng `1920x1080` |
| `{{FPS}}`, `{{GIAY}}` | 30 (hoặc 60 cho bản cuối có nhoè) và độ dài đúng, tính bằng giây |
| `{{CL}}`, `{{BC}}`, `{{MAU}}` | Mã và tên chất liệu, bố cục, tông màu đã chốt ở cửa chọn dựng |
| `{{HUONG_CHAT_LIEU}}` | Đoạn của chất liệu trong `huong_theo_chat_lieu.md` |
| `{{CAM_THEO_CHAT_LIEU}}` | Danh sách cấm theo phong cách của chất liệu |
| `{{NEN}}`, `{{CHU}}`, `{{NHAN1}}`, `{{NHAN2}}` | Mã hex của tông màu |
| `{{HAT_GIONG}}` | Số nguyên cố định, ví dụ 1 |
| `{{VONG_LAP}}` | `co` nếu khung cuối phải bằng khung đầu, `khong` nếu không |

## 2. Khuôn

Chép nguyên khối dưới đây, thay các chỗ `{{...}}`, gửi cho tác tử con Opus (loại `general-purpose`).

```
<role>
Bạn dựng video hoạt hoạ bằng mã. Sản phẩm là MỘT file HTML mà mọi giá trị trên màn hình
là hàm thuần của thời gian t. Mọi quyết định thiết kế được so với ảnh đích; bạn chưa xong
khi đặt video cạnh ảnh đích mà video còn yếu hơn. Bạn làm một mình, không hỏi lại.
Thiếu đầu vào bắt buộc ở <inputs> thì ghi danh sách thiếu vào sổ vòng sửa rồi dừng, không tự bịa.
</role>

<inputs>
- Tên: {{TEN}}. Khổ: {{W}}×{{H}}. Khung/giây: {{FPS}}. Độ dài đúng: {{GIAY}} giây.
- Thư mục làm việc: xuong_html/{{TEN}}/ gồm {{TEN}}.html và thu_vien/ (thư viện để cạnh file).
- File dữ kiện, nguồn duy nhất cho mọi số, tên, câu chữ trên màn hình: {{DUONG_DAN_DU_KIEN}}.
- Mốc câu (nếu có giọng đọc): {{DUONG_DAN_MOC_CAU}}; nếu "không có giọng" thì nhịp lấy từ storyboard.
- Tổ hợp: chất liệu {{CL}}; bố cục {{BC}}; tông màu {{MAU}}.
- Ảnh đích (tối đa 2 ảnh ghép): {{ANH_DICH}}. Chỉ để học màu, nhãn, bố cục, nhịp. Không chép cảnh,
  logo, bố cục, nhạc.
- Storyboard đã duyệt: {{DUONG_DAN_STORYBOARD}}.
</inputs>

<direction>
{{HUONG_CHAT_LIEU}}

Màu (chỉ dùng các màu này): nền {{NEN}}, chữ {{CHU}}, nhấn 1 {{NHAN1}}, nhấn 2 {{NHAN2}}.
Phông: Be Vietnam Pro cho mọi chữ có dấu, khai bằng @font-face với src: local('Be Vietnam Pro'),
dự phòng Helvetica Neue. Phông khác chỉ khi hiển thị đủ dấu tiếng Việt (kiểm bằng khung cắt).
Cỡ chữ nhỏ nhất: 32 px ở khung dọc 1080×1920; 28 px ở khung ngang 1920×1080 (số đề xuất, chưa hiệu chỉnh).

Chuyển động, bằng số (điểm xuất phát, chỉnh được nếu ảnh đích đòi khác):
- Hình: lò xo nghiệm kín, giảm chấn 0,72, ổn định sau 0,35 giây, vượt đích rất nhẹ.
- Máy quay: giảm chấn 1,0, ổn định sau 0,6 giây; mỗi cảnh đẩy chậm 1,03–1,07 lần.
- Đổi nội dung: mờ dần 0,15 giây kèm nhoè 12 px.
- Không có chuyển động đều tốc độ: vào nhanh, đáp mềm. Chữ so le 2–4 khung.
- Không phần nào của khung đứng yên quá 1,5 giây: nền trôi, thanh tiến độ, chữ hiện dần theo lời.

Cấm cố định: logo thương hiệu thật và logo MB; ảnh mặt người thật; số bịa, kết quả bịa;
thanh tua, mã thời gian, số khung/giây, thuật ngữ hoạt hình hiện trên màn hình.
Cấm theo phong cách: {{CAM_THEO_CHAT_LIEU}}
</direction>

<structure>
Lập bảng, mỗi bố cục một dòng: thời gian | trên màn hình có gì | khoảnh khắc này để làm gì |
ra đi bằng cách nào | vật nào mang sang cảnh sau. Bám đúng storyboard đã duyệt; không thêm
bố cục. Khung đầu là một bố cục hoàn chỉnh (không đen, không chữ đang bay vào). Nêu ba khoảnh
khắc đặc trưng mô tả được mà không dùng tên hiệu ứng. Video phải hiểu được khi tắt tiếng.
</structure>

<facts>
Mọi số, tên, câu chữ trên màn hình lấy từ file dữ kiện. Nhúng nội dung file vào trang bằng thẻ
<script type="application/json" id="du_kien">, không nạp bằng fetch. Mục có trang_thai "minh_hoa"
phải mang nhãn "minh hoạ" trên màn hình hoặc bị bỏ. Số sinh từ mô phỏng thì mô phỏng chạy thật,
hạt giống và số bước ghi lại trong sổ.
</facts>

<build>
1. Một file HTML. Khung thiết kế cố định {{W}}×{{H}} (div#khung, overflow:hidden), co theo cửa sổ
   bằng transform: scale(min(innerWidth/{{W}}, innerHeight/{{H}})) với transform-origin 0 0, để bản
   xem trước 960×540 vẫn đủ khung.
2. Mọi giá trị tính trong window.renderAt(t) (t là giây), hàm thuần: cùng t cho cùng khung. Không
   đọc Date, performance.now để suy ra trạng thái (chỉ dùng để đổi sang t khi xem trong trình duyệt);
   không CSS transition hoặc animation tự chạy; không setTimeout, setInterval; không trạng thái
   mang từ khung này sang khung khác; không Web Worker, OffscreenCanvas trong worker.
3. Địa chỉ ?t=12.5 dừng ở giây 12,5, không chạy vòng lặp. Không có ?t thì chạy vòng lặp xem thử.
   Địa chỉ ?hat=0 tắt lớp hạt nhiễu (nếu có) để đo đứng hình bằng máy.
4. GSAP (nếu dùng): một timeline duy nhất, tl.pause(); trong renderAt(t) gọi tl.time(t). Mọi trạng
   thái đầu đặt tường minh ở t = 0; không gsap.from giữa timeline; không lặp vô hạn.
5. Ngẫu nhiên: không dùng Math.random. Dùng bộ sinh có hạt giống mulberry32({{HAT_GIONG}}) gọi theo
   chỉ số (mã hạt, số khung), không theo thứ tự lần gọi, để khung t ra cùng kết quả dù khung nào
   chạy trước (cần cho xuất song song).
6. Lò xo: nghiệm kín của phương trình lò xo (bước đáp ứng). Một giá trị đổi đích nhiều lần thì
   cộng một lò xo cho mỗi lần đổi.
7. Chữ hiện dần: số ký tự hiện = floor(tiến độ × độ dài); tiến độ tính từ mốc câu. Nhãn mang chữ
   cần đọc không dùng hiệu ứng xáo ký tự.
8. Canvas 2D: vẽ lại toàn bộ trong renderAt(t). DOM/SVG: đặt thuộc tính theo t. Three.js: dựng cảnh một
   lần, trong renderAt(t) đặt vị trí rồi gọi render một lần; nhãn chữ là HTML đặt theo toạ độ chiếu
   của máy quay mỗi khung, không vẽ chữ trong 3D (xem khuon_canh_threejs.md).
9. Thư viện nạp từ thu_vien/ bằng đường dẫn tương đối, không gọi CDN; ghi phiên bản
   (GSAP 3.13, Three.js r128 là bản đã chạy ở Media). Trang chạy được khi không có mạng.
10. Nếu {{VONG_LAP}} = co: khung cuối bằng khung đầu (vị trí, độ mờ, tốc độ con trỏ). Dùng
    t - {{GIAY}}*floor(t/{{GIAY}}) tại điểm nối để không giật.
11. Tự kiểm: window.kiemTra(t) trả danh sách cặp hộp chữ chồng nhau và hộp chữ vượt mép khung;
    window.chuHienThi(t) trả mảng chuỗi chữ đang hiện; window.suKien() trả mảng {t, loai} các sự
    kiện hình (làm âm thanh theo khuon_am_thanh_tu_du_lieu.md).
12. Xuất bản xem trước 10 khung/giây:
    node xuong_html/cong_cu/xuat_mp4.mjs "<trang>.html" {{GIAY}} --fps 10 --kich-thuoc 960x540 --ra "<xem_truoc>/v<n>.mp4"
    Bản cuối: --fps {{FPS}} --kich-thuoc {{KHO}}. Bản 60 khung/giây có nhoè (chỉ bản cuối):
    sh xuong_html/cong_cu/xuat_nhoe.sh "<trang>.html" {{GIAY}} "<ra>.mp4" 60 8 4 {{KHO}} 2
</build>

<gotchas>
- Lớp hạt nhiễu: độ đục chấm sáng tối đa 6%, chấm tối tối đa 15%; dày hơn sẽ phủ trắng khung và làm
  file nặng gấp nhiều lần (bản 60 giây có nhoè: 134 MB).
- Chữ đè chữ: nhãn trục, tên tác giả, nhãn năm là chỗ hay đè; kiểm bằng kiemTra(t) ở mọi nhịp.
- Chỗ nối cảnh: cảnh sau bắt đầu hiện trước mốc 0,45 giây, cảnh trước tắt xong trước mốc 0,1 giây;
  không để khung chỉ còn cảnh trước đang nhoè hoặc khung chỉ có tiêu đề.
- Nhãn, đầu mũi tên, phần tô dưới đường cong chỉ hiện khi nét vẽ bắt đầu tới; cắt phần tô theo đầu bút.
- Thứ tự lớp: phụ đề, nhãn chương, thước năm nằm trên lớp tối mép khung.
- Mỗi chương còn một vật chính lớn; nửa khung trống thì thêm phần tử vẽ từ đầu cảnh.
- Math.random trong trang bị công cụ xuất thay bằng bộ sinh cố định, nên xem bằng trình duyệt ra khác
  bản xuất: dùng bộ sinh riêng của trang.
- Nhiều trang chạy song song (--song-song) chỉ đúng khi trang xác định.
- Không dùng will-change trên phần tử mà máy quay phóng to. Chữ nằm trong hình đang biến dạng cần
  vùng cắt và thời điểm vào, ra riêng.
- Web Audio, thẻ <video>, Web Worker dùng giờ thật, không hợp với đồng hồ ảo; âm thanh ghép sau.
- Số liệu ngẫu nhiên "cho đẹp" bị cấm; mọi số theo <facts>.
</gotchas>

<quality_bar>
Chưa xong khi chưa đạt, đo được: tổng đứng hình không quá khoảng 1 giây mỗi 30 giây (video có giọng:
không đoạn nào quá 1,5 giây); khung đầu là bố cục hoàn chỉnh; tương phản chữ tối thiểu 4,5:1;
không chữ đè, không chữ tràn mép; không phần tử cảnh trước sót sang cảnh sau; hiểu được khi tắt
tiếng; mọi số có trong file dữ kiện. Đo theo mục 9 của 07_khuon_prompt_va_kiem_chat_luong.md.
</quality_bar>

<start>
1. Chưa viết mã. Trả lại: bảng storyboard, danh sách trạng thái trên lưới nhịp, danh sách đầu vào
   còn thiếu. Dừng chờ duyệt. (Nếu storyboard đã duyệt thì bỏ bước này.)
2. Sau khi duyệt: dựng, xuất bản xem trước, xuất một ảnh tĩnh ở mốc mỗi nhịp và tờ ghép khung
   (xuong_html/cong_cu hoặc scripts/soat_khung_mp4.py), tự xem từng ảnh.
3. Sửa lỗi lớn nhất trước. Tối đa 3 vòng. Mỗi vòng ghi vào NHAT_KY_VONG_SUA.md: bản xem, lỗi tìm thấy
   (đánh số, mốc giờ), đã sửa (cùng số), số đo trước và sau. Sao lưu mã trước mỗi vòng.
4. Hết vòng thì dừng và báo còn lỗi gì, không làm thêm.
</start>

<giao_nop>
Giao: {{TEN}}.html và thu_vien/; bản MP4 cuối; sổ vòng sửa; ảnh ghép khung của bản cuối; danh sách
số đo (đứng hình, tương phản, số khung); danh sách mục "minh_hoa" còn trong video (nếu có).
Không giao video khi chưa xuất lại sau lần sửa cuối.
</giao_nop>
```

## 3. Sau khi nhận kết quả

1. Không tin báo cáo của tác tử dựng: chạy người phản biện độc lập (`khuon_phan_bien.md`) trên file MP4.
2. Chạy các lệnh đo ở mục 9 module 07 (đứng hình, tương phản, âm lượng, quét khung hỏng).
3. Ghép giọng và nhạc (`khuon_am_thanh_tu_du_lieu.md`), rồi soát theo `15_bang_kiem_truoc_khi_giao.md`.
4. Ghi số đo thật (token, phút, giây máy) vào `05_cach_lam.md` mục LM-03.

## 4. Thư viện đã dùng ở Media

| Thư viện | Bản | Giấy phép | Ghi chú |
|---|---|---|---|
| GSAP | 3.13 (kèm SplitText, DrawSVG) | Miễn phí cả plugin (giấy phép Webflow); mã do AI viết không bị cấm | Nguồn: bản chỉ đạo 27/10/2026; đối chiếu `13_ban_quyen_va_bao_mat.md` |
| Three.js | r128 | MIT | WebGL xuất đúng giờ ảo, chậm hơn Canvas 2D (`xuong_html/cong_cu/KET_QUA_DO.md`) |
| Phông | Be Vietnam Pro (cài trên máy); Anton, JetBrains Mono, Inter (Google) | Phông Google miễn phí | Phông Google cần mạng lúc xuất nếu không lưu cạnh file |
