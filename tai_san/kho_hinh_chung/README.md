# Kho hình dùng chung cho video HTML (LM-03)

**Phiên bản:** 1.2 · **Lập:** 2026-10-29 · 1.2: điều 9 ít chữ, điều 10 kiểu toi_gian, cờ kiểm của chup_mau 1.3 (03/11/2026) · 1.1: thêm nền móng, xem mẫu, chụp ảnh mẫu (29/10/2026) · Quy trình rà và dựng: skill `skills/ra-soat-dung-chung/SKILL.md`.

Kho chứa những hình được nhiều video cần: vật thể vẽ SVG, nhân vật, khuôn biểu đồ, giao diện, mô hình Three.js, khuôn bố cục của một loạt. Mỗi hình dựng một lần, Trung duyệt một lần, rồi các video chép vào dùng. Video Remotion (LM-02) không dùng kho này mà dùng `tai_san/khoi_dung_san/` (danh mục `danh_muc_mo_hinh_3d.md`, xếp hạng bằng `scripts/danh_gia_dung_lai.py`).

## Thư mục

```
tai_san/kho_hinh_chung/
├── README.md            file này: hợp đồng tài sản, cách thêm, cách dùng
├── danh_muc.json        mọi hình: tên, loại, file, phiên bản, tham số, trạng thái, video đã dùng
├── tu_khoa/<lĩnh vực>.json   từ điển từ khoá để script rà nhận ra hình trong sổ nợ và kịch bản
├── chung/               dùng cho mọi lĩnh vực: nền móng (kho_nen.js), khuôn bố cục, khuôn biểu đồ
├── ngan_hang/           hình riêng lĩnh vực ngân hàng, tài chính
├── dien/                (mở khi lô điện dùng HTML)
├── xem_mau.html         trang xem mẫu: nạp mọi hình đã có, mỗi hình một ô, chụp ảnh để duyệt
└── anh_mau/             ảnh chụp trang xem mẫu, để Trung duyệt (ngoài git)
```

## Hợp đồng một tài sản HTML

Một hình là một file `.js` (có thể kèm `.css`) tự đăng ký vào biến toàn cục `window.KHO`:

```js
// ngan_hang/toa_nha_ngan_hang.js — 1.0 — toà nhà ngân hàng không nhận diện thương hiệu
(function () {
  const K = (window.KHO = window.KHO || {});
  K.toa_nha_ngan_hang = function (opt) {
    // opt: { mau, kieu: 'phang' | 'net_tay', co, nhan }   mặc định lấy từ K.mau
    const g = K.svg('g');            // dựng SVG một lần
    ...
    return {
      el: g,                          // gắn vào cảnh của trang
      seek(t) { ... },                // t là giây tính từ lúc hình xuất hiện; không đọc trạng thái khung trước
      moc: { cua: [x, y], mai: [x, y] }   // điểm neo để trang nối mũi tên, nhãn
    };
  };
})();
```

Điều kiện bắt buộc:
1. **Không trạng thái giữa các khung.** `seek(t)` đặt hình về đúng giây `t` bất kể gọi theo thứ tự nào (hợp đồng trang của `skills/dung-video-html/`). Không `Math.random()` không hạt giống, không `Date`, không `requestAnimationFrame`.
2. **Mọi màu, nét, cỡ chữ lấy từ tham số**, mặc định từ `KHO.mau` trong `chung/kho_nen.js`. Trang của video đặt bảng màu riêng bằng `KHO.datMau({...})` trước khi gọi hình. Không ghi cứng mã màu trong hình.
3. **Có tham số kiểu vẽ** khi hình dùng ở nhiều chất liệu: ít nhất `phang` (CL-09) và `net_tay` (CL-10, nét run bằng bộ lọc SVG có hạt giống). Mô hình Three.js là một hình riêng (`..._3d`), dùng chung kích thước và tỉ lệ với bản 2D.
4. **Không tên, logo, màu nhận diện của ngân hàng hay doanh nghiệp thật** (`13_ban_quyen_va_bao_mat.md`). Chữ trên hình là tham số, không ghi cứng.
5. **Không tải gì từ mạng.** Phông chữ, thư viện nằm trong máy hoặc trong `thu_vien/` của dự án.
6. **Đầu file ghi tên, phiên bản, việc nó vẽ.** Sửa hình thì tăng phiên bản trong file và trong `danh_muc.json`; đổi hình dạng thấy được bằng mắt thì tăng số đầu (1.x → 2.0) và chụp lại ảnh mẫu.

Bổ sung 29/10/2026 khi dựng đợt 1:
7. **Loại phần tử `el`.** Vật thể, nhân vật, biểu đồ trả `<g>` SVG vẽ quanh gốc theo kích thước chuẩn ghi ở đầu file; trang video tự đặt `transform`. Khuôn bố cục và giao diện nhiều chữ trả phần tử HTML đặt tuyệt đối trong sân khấu 1920×1080, để chữ tiếng Việt xuống dòng tự nhiên. Ô có nền hoặc viền chứa chữ gắn `data-hop` (bộ kiểm chữ bắt chữ tràn hộp); chữ chồng cố ý gắn `data-chong`.
8. **Thời điểm vào là tham số** (`vao`, `moc_hien`) để trang khớp lời đọc; `tinh: true` hiện đủ ngay.

Bổ sung 03/11/2026 (lô N196–N205, sau phản hồi của phiên dựng N201, N198: ảnh mẫu nhiều chữ, biển tên mặc định trên toà nhà, kiểu vẽ không hợp giấy cắt và minh hoạ phẳng):
9. **Ít chữ.** Hình mới không có chữ mặc định trên vật; nhãn chỉ hiện khi trang truyền chữ, nhãn nào cũng tắt được bằng `false`, cờ `chu: false` tắt hết. Chữ tài sản tự vẽ tối thiểu 28 px trên màn hình. Ô mẫu tối đa 12 tiếng mỗi khung.
10. **Kiểu `toi_gian`** cho hình dùng ở nhiều chất liệu: chỉ khối phẳng và màu của bộ màu, không bóng, không chi tiết trang trí, nét theo `net: { day, mau }` (mặc định không viền); trang của từng chất liệu tự phủ phong cách.

## Nền móng `chung/kho_nen.js`

- **Phông:** một cách nạp duy nhất. `kho_nen.js` tự khai `@font-face` tên họ `BVP` trỏ tới `chung/phong/BeVietnamPro-*.ttf` đi kèm kho (năm độ đậm 400–800), `local()` làm dự phòng; chạy được khi mất mạng. Gọi `await KHO.napPhong()` trước khi chụp. Trang video không tự nạp Be Vietnam Pro theo cách khác.
- **Màu:** `KHO.BANG` có một bộ giá trị cho mỗi mã MAU-20…MAU-31 (theo `tai_san/so_tay_gu/he_truc_dung.md`), cùng các khoá ngữ nghĩa `nen, nen_phu, the, chu, chu_phu, vien, nhan, nhan_phu, nhat, tot, xau, canh_bao, giay, da`. Trang video gọi `KHO.datMau('MAU-23')` (có thể kèm ghi đè) trước khi tạo hình. Video cùng mã màu từ nay dùng đúng bộ này, không tự chép mã hex.
- **Hàm:** tạo phần tử (`svg`, `html`, `chu`, `chuNhieuDong`), dễ dàng hoá (`eo3`, `eio`, `eob`, `spr`, `tienDo`, `hienAn`), số có hạt giống (`ngauNhien`), màu (`tron`, `rgba`, `tuongPhan`, `chuTren`), nét tay (`locNetTay`, `duongTay`), vẽ dần (`veDan`), đo chữ (`doChu`, `xuongDong`, `coVua`), số kiểu Việt (`so`, `soTien`), tự kiểm chữ (`kiemChu`).

## Xem mẫu và chụp ảnh mẫu

Mỗi hình có `xem_mau/<ten>.js` khai cách dựng ô mẫu (`KHO_MAU.push({ ten, khung, moc, tao })`). Trang `xem_mau.html?hinh=<ten>&kieu=phang|net_tay` dựng một khung 1920×1080; kiểu `phang` mặc định MAU-22, `net_tay` mặc định MAU-23. Chụp qua chỗ nhanh của hàng đợi:

```bash
scripts/hang_doi_ket_xuat.sh --nhanh kho node tai_san/kho_hinh_chung/chup_mau.mjs <ten...>      # hoặc --tat-ca
```

Từ 1.3 script nhận `--kieu toi_gian,phang,net_tay` (mặc định `phang,net_tay`), `--toi-da-tieng 12` (đếm tiếng nhìn thấy mỗi khung, quá thì báo `qua_tieng`) và `--co-toi-thieu 28` (cỡ chữ trên màn hình, nhỏ hơn thì báo `chu_nho`); số tiếng mỗi ảnh ghi ở trường `so_tieng`. Script sinh `xem_mau/_ds.js` từ `danh_muc.json`, chụp 2 kiểu × 3 thời điểm vào `anh_mau/<ten>/`, ghi `ket_qua.json` (lỗi nạp, lỗi JavaScript, chữ tràn, chữ đè, hàm không thuần — chụp lại theo thứ tự ngược phải trùng từng byte) và ghép `<ten>_luoi.jpg` để duyệt.

## Trường của `danh_muc.json`

| Trường | Ý nghĩa |
|---|---|
| `ten` | tên không dấu, trùng tên hàm trong `KHO` |
| `loai` | `vat_the_2d`, `nhan_vat`, `bieu_do`, `giao_dien`, `mo_hinh_3d`, `canh_nen`, `khuon_bo_cuc`, `anh` |
| `linh_vuc` | `chung`, `ngan_hang`, `dien`… |
| `file` | đường dẫn trong kho, có thể nhiều file |
| `can` | tên các hình khác phải nạp trước (ví dụ `kho_nen`) |
| `phien_ban` | khớp dòng đầu file |
| `tham_so` | tham số và giá trị cho phép |
| `trang_thai` | `de_xuat` (mới có trong danh sách), `dang_dung` (đã dựng, chờ duyệt), `da_duyet` (Trung duyệt ảnh mẫu), `bo` |
| `nguon_gom` | bản đã vẽ riêng trong video nào được lấy làm gốc (file:dòng) |
| `dung_o` | mã video đã chép hình này |
| `ghi_chu` | biến thể còn thiếu, lỗi đã biết |

## Cách dùng trong một video

```bash
python3 skills/ra-soat-dung-chung/scripts/chep_kho.py xuong_html/<dự án> toa_nha_ngan_hang nguoi_vay
```

Lệnh chép file vào `xuong_html/<dự án>/thu_vien/kho/`, ghi phiên bản vào `thu_vien/kho/_phien_ban.json` và in các dòng `<script>` cần thêm vào `trang.html`. Phiên dựng video **không sửa bản đã chép**. Cần thêm biến thể thì báo phiên giữ kho thêm tham số, rồi chép lại bằng `--cap-nhat`. Sửa tạm trong dự án (khi phiên giữ kho chưa kịp) thì ghi vào `SO_VONG_SUA.md` để cuối lô gom về kho.

## Ảnh thật và mô hình 3D tải về

Ảnh chụp và mô hình tải về để trong `tai_san/` theo chỗ đã có (`mo_hinh_3d/`, `clip_ai/`), kê vào `danh_muc.json` với `loai: "anh"` hoặc `mo_hinh_3d`, ghi giấy phép và nguồn trong `ghi_chu`. Không đưa vào kho ảnh còn tên, mặt người hay thông tin của khách hàng thật.
