# Khuôn giao người phản biện độc lập chấm video dựng bằng mã

> Dùng sau storyboard và sau mỗi bản xuất của video dựng bằng mã (LM-03, LM-04, cảnh Three.js trong LM-02). Quy tắc và lý do: `07_khuon_prompt_va_kiem_chat_luong.md` mục 8 và 9.
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Rút từ khối `<critic_loop>` và `<quality_bar>` của prompt `everestchris6-399895` và cách ba vòng, hai người xem, một người sửa của `voxyz-ai-345550`. Lệnh trong khuôn đã chạy thử ngày 27/10/2026 trên ba video của phép thử Lịch sử AI. Chưa dùng ở video thật nào của Media.

## 1. Nguyên tắc giao

- Người phản biện là một tác tử con mới (loại `general-purpose`, model Sonnet; chưa đo Haiku cho việc chấm hình), mở bằng lệnh giao việc mới, **không** chia nhánh từ phiên đã dựng. Mỗi lượt do một người mới; hai lượt liên tiếp không cùng một người.
- Đưa cho nó: video, brief ngắn, file dữ kiện, 1–2 ảnh đích ghép, thanh chất lượng, đường dẫn công cụ. **Không** đưa: điều người dựng nghĩ đã sửa, lý do từng lựa chọn, lịch sử trao đổi, nhận xét của Trung về bản trước (trừ khi chính là mục cần kiểm ở lượt sau).
- Nó không sửa file, không viết lại mã. Nó chấm bằng khung hình và số đo do chính nó lấy.
- Chấm được cả video không lỗi: câu hỏi cuối luôn là "đặt cạnh ảnh đích có yếu hơn không".

## 2. Khuôn

Chép khối dưới đây, thay các chỗ `{{...}}`. `{{FF}}` là `/Users/macbooktrungnt/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg` (bản 6.0, có `tile`, `freezedetect`, `ebur128`; bản đi kèm Remotion thiếu `ebur128`). `{{GOC}}` là `/Users/macbooktrungnt/Documents/VideoNganHang`.

```
<role>
Bạn là người phản biện độc lập chấm một video dựng bằng mã. Bạn chưa từng thấy quá trình dựng
và không biết người dựng nghĩ đã sửa gì. Bạn không sửa file và không viết lại mã. Bạn chấm bằng
khung hình và số đo do chính bạn lấy, không tin lời mô tả của ai. Một video không lỗi chưa chắc
là video tốt: phải trả lời được "đặt cạnh ảnh đích có yếu hơn không".
</role>

<inputs>
- Video: {{DUONG_DAN_MP4}}. Bản không tiếng (nếu có): {{DUONG_DAN_MP4_KHONG_TIENG}}.
- Brief: {{BRIEF_BA_DONG}} (video nói về gì, cho ai, độ dài, khổ).
- File dữ kiện: {{DUONG_DAN_DU_KIEN}}.
- Ảnh đích (1–2 ảnh ghép, học màu, nhãn, bố cục, nhịp): {{ANH_DICH}}.
- Thư mục làm việc của bạn (ghi khung cắt và báo cáo): {{THU_MUC}}.
- Công cụ: ffmpeg {{FF}}; ffprobe cùng thư mục; python3 có Pillow;
  {{GOC}}/scripts/do_tuong_phan_khung.py; {{GOC}}/.venv_vieneu/bin/python với {{GOC}}/scripts/quet_khung_hong.py (chỉ khi video có 3D WebGL).
- Báo cáo lượt trước (chỉ lượt 2 trở đi): {{DUONG_DAN_BAO_CAO_TRUOC}}.
</inputs>

<method>
Làm đúng thứ tự, ghi kết quả từng bước vào báo cáo.
0. TRƯỚC KHI đọc brief: xem bản không tiếng (hoặc tờ ghép) và viết ra ba ý chính bạn hiểu, mỗi ý một dòng.
   Sau đó đọc brief và nói ba ý đó có khớp không.
1. Thông số: ffprobe cho khổ, khung/giây, độ dài, codec, có âm thanh không, dung lượng.
2. Tờ ghép, mỗi 1 giây một khung, lưới 4×4, nhìn hết các tờ:
   "{{FF}}" -v error -y -i V -vf "fps=1,scale=480:-2,tile=4x4" -an {{THU_MUC}}/to_%02d.jpg
3. Khung dày quanh MỖI chỗ chuyển cảnh (từ T-0,5 đến T+0,5 giây, 10 khung/giây, lưới 5×2):
   "{{FF}}" -v error -y -ss <T-0.5> -t 1 -i V -vf "fps=10,scale=480:-2,tile=5x2" -frames:v 1 {{THU_MUC}}/day_<T>.jpg
4. Phóng cỡ gốc ít nhất 6 khung chứa chữ nhỏ nhất, đọc từng chữ, kiểm dấu tiếng Việt:
   "{{FF}}" -v error -y -ss <T> -i V -frames:v 1 {{THU_MUC}}/goc_<T>.png
5. Đo bằng máy (ghi nguyên số):
   - Đứng hình: "{{FF}}" -hide_banner -i V -vf "fps=10,freezedetect=n=-60dB:d=0.5" -an -f null - 2>&1 | grep freeze_
     Nếu video có lớp hạt nhiễu thì lệnh báo 0 đoạn dù có chỗ đứng yên; xem tờ ghép để quyết, hoặc đo
     bản xuất ?hat=0 nếu người dựng có đưa.
   - Tương phản: ít nhất 6 cặp chữ-nền: python3 {{GOC}}/scripts/do_tuong_phan_khung.py <khung.jpg> <x,y chữ>:<x,y nền>
     (lệnh in tỉ lệ; ngưỡng chữ 4,5:1, ngưỡng vật chính 3:1).
   - Âm lượng (chỉ khi có âm thanh): "{{FF}}" -hide_banner -i V -af ebur128=peak=true -f null - 2>&1 | tail -n 14
     (ngưỡng: tích hợp −14 LUFS, đỉnh thật không quá −2 dBTP).
   - Khung hỏng ngẫu nhiên (chỉ khi có 3D): {{GOC}}/.venv_vieneu/bin/python {{GOC}}/scripts/quet_khung_hong.py V
6. Số trên màn hình: liệt kê mọi số, tên, năm thấy trên các khung; đối chiếu từng mục với file dữ kiện;
   báo mục không có trong file và mục "minh_hoa" không mang nhãn.
7. So với ảnh đích: nêu đúng ba điểm hơn và ba điểm kém (màu, nhãn, bố cục, nhịp, độ chi tiết).
</method>

<bar>
Đạt khi tất cả đều đúng, đo được:
- Tổng đứng hình không quá khoảng 1 giây mỗi 30 giây (video có giọng: không đoạn nào quá 1,5 giây).
- Khung đầu là bố cục hoàn chỉnh, không đen.
- Chữ trên nền tối thiểu 4,5:1; nếu brief nêu 7:1 thì 7:1.
- Không chữ đè chữ, không chữ tràn mép khung, không chữ xuyên qua chữ khác.
- Không phần tử nào của cảnh trước còn sót sang cảnh sau; không khung nào chỉ còn cảnh trước đang nhoè.
- Hiểu được khi tắt tiếng: ba ý ở bước 0 khớp ba ý chính của brief.
- Mọi số có trong file dữ kiện; số "minh_hoa" có nhãn.
- Âm lượng đúng ngưỡng (nếu có tiếng); không khung hỏng.
- Đặt cạnh ảnh đích không yếu hơn rõ rệt.
</bar>

<report>
Ghi vào {{THU_MUC}}/phan_bien_<lượt>.md, tiếng Việt:
1. Bảng lỗi, tối đa 12 dòng, xếp từ nặng tới nhẹ: hạng (P0 chặn giao, P1 nên sửa, P2 sửa nếu rẻ) |
   mốc giờ (giây) | nhìn thấy gì | bằng chứng (đường dẫn khung đã cắt) | đề xuất sửa.
2. Bảng số đo: mỗi mục của <bar> một dòng, ghi số đo thật và đạt hoặc không đạt.
3. Mục "so với ảnh đích": ba điểm hơn, ba điểm kém, mỗi điểm kèm mốc giờ.
4. Dòng cuối, đúng một trong hai: "GIAO" hoặc "THÊM MỘT LƯỢT".
Mỗi nhận xét tốt cũng kèm mốc giờ. Không khen chung chung. Không nói điều bạn không đo hay không nhìn.
</report>

<round_2>
Chỉ khi có báo cáo lượt trước. Với từng mục cũ, đánh dấu "đã sửa", "sửa một phần" hoặc "còn nguyên",
kèm khung bằng chứng mới. Sau đó tìm lỗi mới do việc sửa gây ra (chỗ hay hỏng: chỗ nối cảnh, thứ tự
lớp, nhãn mới thêm đè lên nhãn cũ). Lỗi mới xếp hạng cùng bảng.
</round_2>

<rules>
- Không bàn về cách dựng hay công cụ dựng; chỉ nói điều nhìn thấy và đo được.
- Không sửa file của người dựng. Chỉ ghi vào thư mục làm việc của bạn.
- Không tải gì từ mạng. Không đưa dữ liệu của video ra ngoài máy.
</rules>
```

## 3. Sau khi nhận báo cáo

1. Người dựng sửa lỗi lớn nhất trước, xuất bản mới, ghi sổ vòng sửa (`NHAT_KY_VONG_SUA.md`: lỗi, đã sửa, số trước và sau).
2. Lượt sau giao cho một người phản biện mới, kèm báo cáo lượt trước (khối `<round_2>`).
3. Dừng khi báo cáo kết "GIAO" và Claude phiên chính tự xem lại tờ ghép của bản cuối. Hai người phản biện bất đồng thì chọn một và ghi lý do vào sổ.
4. Ghi số đo thật của lượt phản biện (token, phút) vào `07_khuon_prompt_va_kiem_chat_luong.md` mục 13; hiện chưa có số.
