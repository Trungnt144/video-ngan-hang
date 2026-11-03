# Hợp đồng của trang HTML dựng video (cách làm LM-03)

**Phiên bản:** 1.0 · **Ngày:** 2026-10-27

Đây là danh sách điều kiện để một file `trang.html` xuất ra MP4 đúng bằng `xuong_html/cong_cu/xuat_mp4.mjs`. Đưa nguyên file này cho tác tử con viết trang, cùng khuôn prompt `tai_san/khuon_prompt/khuon_dung_html_mot_trang.md`. Nguồn các điều kiện: `xuong_html/cong_cu/KET_QUA_DO.md` (đo 27/10/2026), sổ vòng sửa mẫu lịch sử AI 60 giây (`san_pham/2026.10.27.duyet_phong_cach_opus55/tai_nguyen/ban_nhap/NHAT_KY_VONG_SUA.md`), trang thử `xuong_html/2026.10.27_thu_ky_thuat/trang.html`.

## Bắt buộc

1. **Một file `trang.html`**, cảnh `#stage` cố định 1920×1080 (video dọc: 1080×1920). Hàm `fit()` co cảnh theo cửa sổ (`scale = min(innerWidth / 1920, innerHeight / 1080)`), để bản xem trước 960×540 và bản cuối 1920×1080 ra cùng bố cục.
2. **Mọi giá trị hiển thị là hàm của thời gian `t` (giây).** Hàm toàn cục `window.seek(t)` đặt cả trang về giây `t`; gọi lại bao nhiêu lần, theo thứ tự nào, cũng ra cùng một ảnh. Không tích luỹ theo khung (`x += v`), không dựa vào trạng thái của khung trước.
3. **GSAP:** `gsap.timeline({ paused: true })`, `tl.set({}, {}, DUR)` để khoá độ dài timeline đúng bằng thời lượng video, `tl.totalTime(t, false)` trong `seek` (đối số `false` để các `onUpdate` vẫn chạy khi nhảy tới giây `t`), `gsap.ticker.lagSmoothing(0)`, `gsap.defaults({ lazy: false })`. Cảnh Canvas, Three.js và các giá trị không do GSAP điều khiển được vẽ lại từ `t` mỗi lần `seek`.
4. **Chạy trong trình duyệt thường được:** vòng `requestAnimationFrame` gọi `seek((performance.now() - t0) / 1000)` rồi đứng ở `DUR`; tham số `?t=3.2` đứng yên ở giây 3,2 để xem khung. Công cụ xuất thay `performance.now`, `Date`, `requestAnimationFrame`, `setTimeout`, `setInterval` bằng đồng hồ ảo nên cùng mã chạy được ở cả hai nơi.
5. **Cờ sẵn sàng:** đặt `window.__san_sang = false` ở dòng đầu của script và `true` khi dựng xong (sau khi nạp phông, tạo cảnh). Công cụ chờ cờ này tối đa 30 giây rồi mới chụp khung 0.
6. **Phông chữ:** nạp từ Google Fonts với `display=block`, và gọi `document.fonts.load('700 20px "Tên phông"', 'chuỗi ký tự có dấu')` ngay lúc script chạy, trước mọi việc khác (không đợi sự kiện nào) để công cụ biết còn phông đang nạp. Chọn phông có đủ dấu tiếng Việt (Be Vietnam Pro, Inter, JetBrains Mono, Anton); thử câu có đủ Đ đ ă â ê ô ơ ư và dấu hỏi, ngã, nặng ở bước xem trước.
7. **Thư viện từ mạng:** nạp từ `cdnjs.cloudflare.com`, ghim bản (`gsap/3.12.5` hoặc `3.13.0`, `three.js/r128`). Lúc xuất phải có internet. Cần chạy offline thì tải thư viện về cạnh `trang.html`.
8. **Phần tử vào cảnh phải ẩn từ đầu:** đặt trạng thái ẩn bằng `gsap.set(...)` hoặc thuộc tính `opacity="0"`, `visibility:hidden` ngay trong HTML. `fromTo(..., { immediateRender: false })` không ẩn phần tử trước lúc tween bắt đầu; quên bước này thì phần tử hiện sớm (lỗi gặp ở cả bản mẫu 60 giây và trang thử).
9. **Số ngẫu nhiên:** tự cài bộ sinh có hạt giống (ví dụ mulberry32) và dùng nó thay `Math.random`. Công cụ xuất thay `Math.random` bằng bộ cố định, nhưng trình duyệt thường thì không, nên nếu dùng thẳng `Math.random` thì bản xem trong trình duyệt khác bản xuất.

## Không dùng

- Thẻ `<video>`, `<audio>`, `requestVideoFrameCallback`, Web Audio: phát theo giờ thật, không khớp đồng hồ ảo. Âm thanh ghép sau bằng `ghep_am_thanh.sh`.
- Web Worker, OffscreenCanvas trong worker, `MessageChannel`, `scheduler.postTask`: vẫn chạy giờ thật.
- `crypto.getRandomValues`, hoạt ảnh gắn với cuộn trang (`ScrollTimeline`), hoạt ảnh CSS đang `paused` lúc xuất hiện lần đầu.
- Hoạt ảnh vô hạn của CSS (`animation: ... infinite`) vẫn chạy đúng giờ ảo, nhưng khó khớp nhịp với `nhip.json`; ưu tiên GSAP.

## Cách viết cho video đẹp (từ ba vòng sửa mẫu lịch sử AI)

- **Chuyển cảnh:** cảnh sau bắt đầu hiện trước mốc chuyển 0,3–0,45 giây, cảnh trước tắt xong trước mốc 0,1 giây, mọi hoạt ảnh bên trong cảnh dời sớm khoảng 0,5 giây (tiêu đề đã nhô lên khi tới mốc). Khung nào cũng phải có chữ hoặc hình ở cả nền lẫn tiêu đề; không để khung trống.
- **Luôn có chuyển động:** không cảnh nào đứng yên quá 1,5 giây (máy quay đẩy chậm 1 → 1,035, lưới nền trôi, hạt trôi, quầng sáng thở).
- **Hạt nhiễu nhẹ:** chấm sáng độ đục tối đa 6 %, chấm tối tối đa 15 %, hạt mịn; hạt không phủ lên chữ. Độ đục 27 % làm mất nền đen và làm MP4 xem trước nặng 89 MB (sau sửa còn 43 MB).
- **Thứ tự lớp:** phụ đề, nhãn chương, thước tiến độ nằm trên lớp tối mép khung và lớp tối chân khung; chỉ để lớp hạt nhiễu phủ trên cùng.
- **Màu nền:** so mã hex nền, chữ với ảnh đích bằng khung cắt; nền ngả nâu ấm so với ảnh đích gần đen trung tính là lỗi đã gặp.
- **Cảnh 3D (Three.js):** nền sàn tối, đèn yếu, máy quay lùi xa vừa khung; cảnh nhiều đa giác, shader nặng chậm hơn nhiều so với Canvas 2D (Three.js r128 một khối hộp: 1,39 giây máy mỗi giây video).
- **Mỗi phần tử vào cảnh theo nhịp của lời hoặc kịch bản** (`nhip.json`): nhãn, mũi tên, phần tô dưới đường cong chỉ hiện khi đường đã vẽ tới.

## Khung tối thiểu

```html
<script>
window.__san_sang = false;
(function () {
const DUR = 6, W = 1920, H = 1080;
const FIXED = new URLSearchParams(location.search).has('t') ? parseFloat(new URLSearchParams(location.search).get('t')) : null;
let tl, t0 = 0;
function fit() { /* scale cảnh #stage theo cửa sổ */ }
function seek(t) {
  t = Math.max(0, Math.min(DUR, t));
  tl.totalTime(t, false);
  // vẽ lại Canvas, Three.js, các giá trị không do GSAP điều khiển từ t
}
window.seek = seek;
function tick() {
  const t = FIXED != null ? FIXED : Math.min((performance.now() - t0) / 1000, DUR);
  seek(t);
  if (FIXED == null && t < DUR) requestAnimationFrame(tick);
}
async function start() {
  await Promise.all(['700 20px "Be Vietnam Pro"'].map((f) => document.fonts.load(f, 'ĐđăâêôơưẠẢ')));
  await document.fonts.ready;
  fit(); addEventListener('resize', fit);
  gsap.defaults({ lazy: false }); gsap.ticker.lagSmoothing(0);
  tl = gsap.timeline({ paused: true }); tl.set({}, {}, DUR);
  // dựng timeline ở đây
  t0 = performance.now();
  window.__san_sang = true;
  seek(FIXED != null ? FIXED : 0);
  requestAnimationFrame(tick);
}
start();
})();
</script>
```

Bản đầy đủ chạy được (SVG, GSAP, số đếm, quét ngang, phông tiếng Việt): `xuong_html/2026.10.27_thu_ky_thuat/trang.html`.
