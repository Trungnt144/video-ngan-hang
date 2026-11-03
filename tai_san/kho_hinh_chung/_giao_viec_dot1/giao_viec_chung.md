# Phần chung cho 3 tác tử dựng kho hình đợt 1 (29/10/2026, chạy qua đêm)

Thư mục làm việc: `/Users/macbooktrungnt/Documents/VideoNganHang` (project Media, xưởng video của Trung). Viết mọi chú thích, chữ trên hình, báo cáo bằng tiếng Việt có dấu đầy đủ, không ví von.

## Bối cảnh

Loạt 64 video giải thích thuật ngữ ngân hàng cho người mới vào nghề và người đi vay, video ngang 1920×1080 dựng bằng MỘT trang HTML (mọi giá trị trên màn hình là hàm của thời gian t, công cụ gọi `window.seek(t)` rồi chụp từng khung). Kho hình dùng chung `tai_san/kho_hinh_chung/` chứa những hình nhiều video cần; dựng một lần, các video chép vào bằng `skills/ra-soat-dung-chung/scripts/chep_kho.py`. Lô 2 (N74 hợp đồng tín dụng, N73 khế ước nhận nợ, N79 trả gốc trả lãi và lịch trả nợ, N80 ân hạn, N105 lãi suất thả nổi, N134 mục đích sử dụng vốn, N116 thẻ tín dụng) sẽ tới bước vẽ trang trong 1–3 giờ nữa, nên làm theo đúng thứ tự ưu tiên trong lời giao việc riêng.

## Đọc trước (bắt buộc)

1. `tai_san/kho_hinh_chung/README.md` — hợp đồng một hình.
2. `tai_san/kho_hinh_chung/chung/kho_nen.js` — nền móng ĐÃ DỰNG, dùng các hàm của nó (`KHO.svg`, `KHO.html`, `KHO.chu`, `KHO.chuNhieuDong`, `KHO.xuongDong`, `KHO.coVua`, `KHO.layMau`, `KHO.tienDo`, `KHO.eo3`, `KHO.eio`, `KHO.eob`, `KHO.spr`, `KHO.hienAn`, `KHO.veDan`, `KHO.locNetTay`, `KHO.duongTay`, `KHO.ngauNhien`, `KHO.tron`, `KHO.rgba`, `KHO.chuTren`, `KHO.so`, `KHO.soTien`, `KHO.PHONG`). KHÔNG sửa file này; thiếu hàm thì viết hàm nội bộ trong file hình của mình và ghi vào báo cáo để phiên giữ kho gom vào nền móng sau.
3. `tai_san/kho_hinh_chung/xem_mau.html`, `tai_san/kho_hinh_chung/chup_mau.mjs`, và mẫu ô xem `tai_san/kho_hinh_chung/xem_mau/kho_nen.js`.
4. Mục của hình mình trong `tai_san/kho_hinh_chung/danh_muc.json` (trường `file`, `can`, `nguon_gom`, `ghi_chu`). Dùng ĐÚNG đường dẫn trong trường `file` (trang xem mẫu nạp theo đó).

## Hợp đồng (tóm tắt, chi tiết ở README)

- Một hình = một file `.js` tự đăng ký `KHO.<ten>(opt)` trả về `{ el, seek(t), moc }`. `t` là giây tính từ lúc hình xuất hiện. Dòng đầu file: `// <đường dẫn> — 1.0 — <việc nó vẽ>`, kèm dòng ghi tham số và nguồn gom.
- Vật thể, nhân vật, biểu đồ: `el` là `<g>` SVG, vẽ quanh gốc toạ độ theo một kích thước chuẩn ghi ở đầu file (ví dụ toà nhà cao 400 đơn vị), trang video tự đặt `transform`. Khuôn bố cục và giao diện có nhiều chữ: `el` là phần tử HTML (`KHO.html`) đặt tuyệt đối trong sân khấu 1920×1080, chữ HTML xuống dòng tự nhiên; ô có nền hoặc viền chứa chữ gắn thuộc tính `data-hop` để bộ kiểm chữ bắt chữ tràn hộp.
- `seek(t)` thuần: cùng t cho cùng hình bất kể thứ tự gọi. Không `Math.random()` (dùng `KHO.ngauNhien(hat)`), không `Date`, không `requestAnimationFrame`, không gsap, không biến đếm khung. Tính sẵn được (đo chữ, dựng DOM) thì làm lúc tạo.
- Màu chỉ đọc từ `KHO.layMau(opt)` (các khoá ngữ nghĩa ghi trong `kho_nen.js`: nen, nen_phu, the, chu, chu_phu, vien, nhan, nhan_phu, nhat, tot, xau, canh_bao, giay, da). Không ghi cứng mã màu trong hình (trừ trắng, đen trong suốt dùng làm bóng).
- Tham số `kieu: 'phang' | 'net_tay'`. `phang` là CL-09 (khối phẳng, nét sạch, góc bo nhẹ). `net_tay` là CL-10 (bút chì trên giấy kem: nét than chì run nhẹ bằng `KHO.duongTay` hoặc `KHO.locNetTay(svgGoc,{hat})`, tô màu loang nhạt hoặc gạch chéo, chữ vẫn sắc để đọc được). Hai kiểu phải khác nhau thấy rõ bằng mắt, cùng hình dạng, tỉ lệ, điểm neo.
- Chữ trên hình là tham số, không ghi cứng. Không tên, logo, màu nhận diện của ngân hàng hay doanh nghiệp thật (dùng "Ngân hàng A", "Công ty B"). Số tiền ví dụ đi kèm nhãn "ví dụ giả định".
- Chuyển động vào: có hiệu ứng vào mặc định (vẽ dần, mọc lên bằng lò xo, hiện dần theo hàng) điều khiển bằng tham số thời gian (`opt.vao` giây bắt đầu, `opt.moc_hien` mảng giây cho từng mục) để video khớp lời đọc; `opt.vao = -1` hoặc `opt.tinh = true` thì hiện đủ ngay (dùng trong ảnh tĩnh). Sau khi vào xong vẫn có chuyển động nhẹ (thở, nhấp nháy nhỏ) nếu hợp, nhưng vẫn là hàm thuần của t.
- Chất lượng ở 1920×1080: chữ nội dung tối thiểu 28 px, nhãn phụ tối thiểu 22 px; tương phản chữ/nền ≥ 4,5 (dùng `KHO.chuTren`); không chữ đè chữ; nét không vỡ; không nhìn rẻ tiền (có độ dày nét thống nhất, bóng nhẹ hoặc mảng phụ tạo chiều sâu, khoảng thở đủ). Hình gom từ video lô 1 thì giữ phần đẹp của bản gốc, chỉ tách trạng thái toàn cục và đổi màu thành tham số.
- Phông: chỉ `KHO.PHONG` (Be Vietnam Pro nạp tại chỗ). Không tải gì từ mạng.

## Ô xem mẫu và ảnh mẫu

Mỗi hình viết thêm `tai_san/kho_hinh_chung/xem_mau/<ten>.js` theo mẫu `xem_mau/kho_nen.js`: `KHO_MAU.push({ ten, khung: 'svg'|'html', moc: [lúc đang vào, giữa, cuối], mau: { phang: 'MAU-..', net_tay: 'MAU-23' } (tuỳ chọn), tao({kieu, san, K}) { ...; return { seek(t) } } })`. Ô mẫu đặt hình ở cỡ thật như trong video và trình bày các biến thể chính (ví dụ ba trang phục nhân vật, năm loại giấy tờ) với dữ liệu mẫu thật như lô 2 sẽ dùng (chữ tiếng Việt có dấu, nhiều dấu chồng như "Ưu đãi", "Khế ước", "Lãi suất thả nổi"). Với khuôn bố cục đặt nhiều chữ, thử cả chữ dài để thấy xuống dòng.

Chụp ảnh mẫu (MỌI lượt Chrome phải qua hàng đợi vì 4 phiên khác đang kết xuất trên máy 24 GB RAM; không mở Chrome bằng cách khác, không dùng ô trình duyệt):

```bash
cd /Users/macbooktrungnt/Documents/VideoNganHang && scripts/hang_doi_ket_xuat.sh --nhanh kho node tai_san/kho_hinh_chung/chup_mau.mjs <ten1> <ten2>
```

Mỗi lượt chụp tối đa 2–3 hình (giữ lượt dưới 30 giây). Kết quả ở `tai_san/kho_hinh_chung/anh_mau/<ten>/`: 6 ảnh PNG (2 kiểu × 3 thời điểm), `ket_qua.json` (lỗi nạp, lỗi JavaScript, chữ tràn, chữ đè, hàm không thuần), và `<ten>_luoi.jpg`. Dùng công cụ Read mở `<ten>_luoi.jpg`, nghi chữ hoặc dấu thì mở PNG cỡ gốc. Sửa tới khi `ket_qua.json` không còn lỗi và hình đạt bảng kiểm dưới. Chữ đè chữ cố ý (ví dụ chữ trên con dấu) thì gắn `data-chong` lên phần tử cha.

Bảng kiểm tự soát (thanh chất lượng mục 9 của `07_khuon_prompt_va_kiem_chat_luong.md`, rút gọn): chữ đủ dấu tiếng Việt, đúng phông; không chữ đè chữ, không tràn hộp hay tràn khung; tương phản đủ; khung cuối đứng yên vẫn đẹp; hai kiểu vẽ khác nhau rõ; không tên, logo, màu nhận diện ngân hàng thật; trông như đồ hoạ của kênh giải thích chuyên nghiệp chứ không phải sơ đồ thô.

## Ranh giới

- Chỉ tạo và sửa file hình của mình (đường dẫn trong lời giao việc riêng) và `xem_mau/<ten>.js` tương ứng. KHÔNG sửa `danh_muc.json`, `kho_nen.js`, `xem_mau.html`, `chup_mau.mjs`, `README.md`, file của tác tử khác. Thấy lỗi ở các file đó thì ghi vào báo cáo.
- Thư mục dựng của video lô 1 (`xuong_html/n*`, `xuong_html/2026.10.28_*`, `xuong_dai/*`) CHỈ ĐỌC để gom. Không sửa `scripts/`, module, `.gitignore`. Không git commit (phiên giữ kho commit).
- Không xoá file. Hết hạn mức thì dừng; ghi lại hình nào xong, hình nào dở.

## Báo cáo cuối (trả về cho phiên giữ kho)

Ghi giờ bắt đầu và giờ xong (lệnh `date`). Với mỗi hình đã xong, một khối JSON để phiên giữ kho chép vào `danh_muc.json`:

```json
{ "ten": "...", "file": ["..."], "can": ["kho_nen"], "phien_ban": "1.0",
  "tham_so": { "kieu": "phang | net_tay", "...": "mô tả ngắn giá trị cho phép" },
  "moc": "điểm neo trả về", "nguon_gom": "file:dòng hoặc dựng mới", "loi_con_lai": "", "ghi_chu": "..." }
```

Kèm: số lỗi trong `ket_qua.json` lần chụp cuối (phải là 0), hàm tiện ích nên gom vào nền móng, hình chưa xong và lý do, tổng phút làm. Báo cáo ngắn, không dán mã.
