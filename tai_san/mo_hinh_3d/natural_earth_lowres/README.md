# Natural Earth lowres (đường bờ và ranh giới quốc gia, tỉ lệ 1:110 triệu)

- **Nguồn:** Natural Earth (naturalearthdata.com), bộ "naturalearth_lowres" polygon theo quốc gia. Phạm vi công cộng (public domain), dùng tự do, không cần ghi nguồn (vẫn nên ghi).
- **Lấy từ:** file mẫu đi kèm gói Python `pyogrio` (`pyogrio/tests/fixtures/naturalearth_lowres/`), chép ngày 28/10/2026 từ một môi trường Python có sẵn trên máy. Không tải mạng.
- **Gồm:** `naturalearth_lowres.shp/.shx/.dbf/.prj/.cpg`, 177 quốc gia, toạ độ WGS84 kinh độ – vĩ độ. Không có Hoàng Sa, Trường Sa (đảo quá nhỏ ở tỉ lệ này); bản đồ Việt Nam có hai quần đảo dùng `ban_do.json` của các dự án gió mùa.
- **Dùng ở:** quả địa cầu video N62 (`xuong_dai/gio_mua_huong_gio/scripts/xuat_luc_dia.py` sinh `src/LucDia.ts`). Chỉ hợp cho hình nhìn cả châu lục; không dùng làm bản đồ ranh giới.
