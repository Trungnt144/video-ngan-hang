# Phân cảnh theo câu — pin_mat_troi (dựng lại video pin mặt trời bằng ảnh nền Muse)

> Lập 08/11/2026. Kịch bản: `2026.10.28.bon_kieu_suy_giam_v2.chuong.json` (bản Claude 28/10/2026, không sửa lời). Cảnh nền và vùng neo: `phieu_dat_hinh.json`. Loại cảnh: `nen_muse` (Muse làm tấm nền, Claude vẽ lớp cơ chế), `ma_claude` (Claude vẽ hoàn toàn bằng mã). Video này không có `clip_muse`.
> Muse chỉ cần đọc cột "Cảnh nền" để biết ảnh nào dùng ở đâu; cột "Lớp cơ chế" là phần Claude vẽ bằng mã, Muse KHÔNG vẽ vào ảnh.

| Câu | Lời (rút gọn) | Người xem thấy | Cảnh nền · biến thể | Lớp cơ chế Claude vẽ |
|---|---|---|---|---|
| **Chương 1** | **Bốn kiểu mất công suất** | | | |
| 1.1 | Tấm pin mới không giữ mãi công suất ghi trên nhãn. | Tấm pin nguyên tấm | nen_hero | nhãn "công suất trên nhãn" chỉ vào mặt tấm |
| 1.2 | Có bốn cơ chế khác nhau làm nó yếu dần. | Công suất tụt dần | nen_hero | thanh công suất cạnh tấm pin hạ dần |
| 1.3 | Tên mỗi cơ chế chính là nguyên nhân gây ra nó. | Tên cơ chế là nguyên nhân | nen_hero | không thêm lớp; máy quay đẩy nhẹ |
| 1.4 | Đó là suy giảm do nắng đầu, do nắng và nhiệt, do điện áp cao, do tia cực tím. | Bốn tên, bốn màu | nen_hero | bốn thẻ tên hiện theo lời đọc, mỗi thẻ một màu của mau_co_che, đường dẫn vào mặt tấm |
| 1.5 | Mỗi cơ chế xảy ra ở một chỗ khác, vào lúc khác, và cách phòng cũng khác. | Bốn chỗ, bốn lúc | nen_hero | bốn thẻ dời về bốn góc |
| 1.6 | Video này đặt bốn cơ chế cạnh nhau, mỗi cơ chế giữ một màu. | Giữ bốn màu | nen_hero → nen_mat_cat · nguyen_ven | chuyển cảnh sang mặt cắt cuối câu |
| **Chương 2** | **Bốn chỗ trong một tấm pin** | | | |
| 2.1 | Để thấy chúng khác nhau ở đâu, hãy cắt ngang một tấm pin. | Cắt ngang tấm pin | nen_mat_cat · nguyen_ven | đường cắt quét ngang từ trái sang |
| 2.2 | Từ trên xuống có kính, lớp nhựa bao, lớp chống phản xạ, đế silicon, rồi lớp mặt sau. | Sáu lớp từ trên xuống | nen_mat_cat · nguyen_ven | nhãn lớp hiện lần lượt bên phải mỗi vùng neo kinh, eva_tren, lop_phu_be_mat, de_silicon, lop_mat_sau |
| 2.3 | Suy giảm do nắng đầu và suy giảm do nắng và nhiệt đều xảy ra trong đế silicon. | Hai cơ chế trong đế | nen_mat_cat · nguyen_ven | vùng de_silicon tô viền cô-ban và cam |
| 2.4 | Suy giảm do điện áp cao kéo ion từ kính và lớp bao xuống tế bào. | Điện áp cao: kính xuống tế bào | nen_mat_cat · nguyen_ven | mũi tên xanh điện từ kinh xuống de_silicon trong vùng mep_khung |
| 2.5 | Suy giảm do tia cực tím làm hỏng lớp phủ mỏng trên bề mặt tế bào. | Tia cực tím: lớp phủ | nen_mat_cat · nguyen_ven | lop_phu_be_mat tô viền tím |
| **Chương 3** | **Suy giảm do nắng đầu** | | | |
| 3.1 | Suy giảm do nắng đầu xảy ra ngay những giờ đầu tấm pin ra nắng. | Ngay giờ đầu ra nắng | nen_mat_cat · nguyen_ven, đẩy gần de_silicon 1,5 lần | photon vàng đi từ mat_tren xuống |
| 3.2 | Đế silicon loại p được pha bo, và trong đế còn có ô-xy. | Đế loại p có bo và ô-xy | nen_mat_cat · nguyen_ven (đẩy gần) | nguyên tử bo xanh lá, phân tử ô-xy hai quả đỏ rải trong de_silicon |
| 3.3 | Khi có ánh sáng, nguyên tử bo kết với phân tử ô-xy thành một cặp. | Bo kết với ô-xy | nen_mat_cat · nguyen_ven (đẩy gần) | bo và ô-xy chạy lại thành cặp, vòng cô-ban quanh cặp |
| 3.4 | Mỗi cặp bẫy electron, nên electron không ra được mạch ngoài. | Cặp bẫy electron | nen_mat_cat · nguyen_ven (đẩy gần) | electron đi qua bị cặp giữ lại, không tới lưới bạc ở lop_phu_be_mat |
| 3.5 | Công suất mất vài phần trăm trong vài giờ đến vài ngày đầu, rồi dừng ở một mức. | Mất vài phần trăm rồi dừng | nen_mat_cat · nguyen_ven (đẩy gần) | thẻ công suất: một bậc rơi rồi phẳng |
| 3.6 | Đế loại n, pha phốt pho, gần như không bị kiểu này, vì không có bo. | Đế loại n không bị | nen_mat_cat · nguyen_ven (đẩy gần) | bo thay bằng phốt pho, không còn cặp; nhãn "loại n" |
| **Chương 4** | **Suy giảm do nắng và nhiệt** | | | |
| 4.1 | Suy giảm do nắng và nhiệt cũng làm hỏng đế silicon, nhưng cần thêm nhiệt. | Cần thêm nhiệt | nen_mat_cat · nguyen_ven → nong_cam | biến thể hoà sang nong_cam |
| 4.2 | Khi tấm pin vừa có nắng vừa nóng quá khoảng 50 độ C, điểm bẫy mới hình thành. | Nóng quá khoảng 50 độ C | nen_mat_cat · nong_cam | nhiệt kế cạnh tấm dâng tới 50 độ C; điểm bẫy cam hiện trong de_silicon |
| 4.3 | Hydro trong tế bào có liên quan. | Hydro liên quan | nen_mat_cat · nong_cam | hạt hydro trôi từ lop_phu_be_mat xuống de_silicon |
| 4.4 | Cơ chế chi tiết vẫn đang được nghiên cứu. | Còn đang nghiên cứu | nen_mat_cat · nong_cam | dấu hỏi nhỏ cạnh hydro |
| 4.5 | Kiểu này chậm hơn kiểu do nắng đầu nhiều, kéo dài từ vài tháng đến vài năm. | Vài tháng đến vài năm | nen_mat_cat · nong_cam | thẻ thời gian: thanh tháng chạy tới năm |
| 4.6 | Tế bào PERC đời đầu từng mất tới khoảng 10%. | PERC đời đầu mất khoảng 10% | nen_mat_cat · nong_cam | thẻ đường công suất võng xuống, nhãn 10% |
| 4.7 | Sau đó công suất hồi lại một phần, có khi hồi cả phần. | Hồi lại một phần | nen_mat_cat · nong_cam → nguyen_ven | điểm bẫy mờ dần, biến thể hoà về nguyen_ven, đường công suất hồi |
| 4.8 | Sản phẩm mới đã tối ưu quy trình, nên mất ít hơn nhiều. | Sản phẩm mới mất ít hơn | nen_mat_cat · nguyen_ven | đường công suất thứ hai võng ít hơn |
| **Chương 5** | **Suy giảm do điện áp cao** | | | |
| 5.1 | Tiếp theo là suy giảm do điện áp cao. | Điện áp cao | nen_mat_cat · nguyen_ven | không thêm lớp |
| 5.2 | Trong dãy pin, tế bào ở điện áp rất cao so với khung nhôm nối đất. | Tế bào điện áp cao so với khung nối đất | nen_mat_cat · nguyen_ven → mep_khung_xanh_dien | ký hiệu nối đất dưới khung_nhom; nhãn điện áp cao trên de_silicon |
| 5.3 | Điện trường kéo ion natri từ kính và lớp bao xuống tế bào. | Điện trường kéo ion natri | nen_mat_cat · mep_khung_xanh_dien | mũi tên điện trường; ion natri đi từ kinh, eva_tren xuống de_silicon trong vùng mep_khung |
| 5.4 | Ion natri tạo đường rò điện, làm công suất tụt. | Đường rò điện | nen_mat_cat · mep_khung_xanh_dien | ion đọng thành đường rò đỏ trong de_silicon; thẻ công suất tụt |
| 5.5 | Trời nóng và ẩm làm kiểu do điện áp cao nặng hơn. | Nóng ẩm nặng hơn | nen_mat_cat · mep_khung_xanh_dien | giọt ẩm nhỏ trên mat_tren; số ion tăng |
| 5.6 | Ảnh phát quang điện cho thấy các tế bào tối đi, thường ở gần mép khung. | Ảnh phát quang: tế bào tối ở mép | ma_claude (ảnh phát quang điện minh hoạ, lưới tế bào tối dần từ mép) | thẻ ảnh phát quang điện vẽ bằng mã đặt trong cột chú thích |
| 5.7 | Nhiều trường hợp, đảo chiều điện áp vào ban đêm giúp công suất hồi lại. | Đảo chiều điện áp ban đêm thì hồi | nen_mat_cat · mep_khung_xanh_dien → nguyen_ven | mũi tên đảo, ion lùi lên, biến thể hoà về nguyen_ven |
| **Chương 6** | **Suy giảm do tia cực tím** | | | |
| 6.1 | Cuối cùng là suy giảm do tia cực tím. | Tia cực tím | nen_mat_cat · nguyen_ven → kinh_anh_tim | biến thể hoà sang kinh_anh_tim |
| 6.2 | Lớp thụ động là lớp phủ mỏng, giữ cho electron ở bề mặt tế bào không bị mất. | Lớp thụ động giữ electron bề mặt | nen_mat_cat · kinh_anh_tim, đẩy gần lop_phu_be_mat 1,6 lần | chuỗi liên kết silicon–hydro trắng dọc lop_phu_be_mat; electron nằm yên |
| 6.3 | Tia cực tím xuyên qua kính và lớp bao, làm đứt liên kết trong lớp này. | Tia cực tím đứt liên kết | nen_mat_cat · kinh_anh_tim (đẩy gần) | vạch tím đi qua kinh, eva_tren; liên kết đứt dần, electron mất |
| 6.4 | Kiểu này được báo cáo nhiều từ năm 2022 ở tế bào loại n như TOPCon và HJT. | Báo cáo nhiều từ 2022, TOPCon, HJT | nen_mat_cat · kinh_anh_tim | thẻ năm 2022 và hai nhãn TOPCon, HJT trong cột chú thích |
| 6.5 | Loại PERC cũng bị. | PERC cũng bị | nen_mat_cat · kinh_anh_tim | nhãn PERC thêm vào thẻ |
| 6.6 | Thí nghiệm tăng tốc cho thấy mất vài phần trăm, rất khác nhau giữa các sản phẩm. | Mất vài phần trăm, khác nhau nhiều | nen_mat_cat · kinh_anh_tim | dải chấm minh hoạ độ chênh giữa sản phẩm |
| 6.7 | Công suất hồi lại được một phần. | Hồi một phần | nen_mat_cat · kinh_anh_tim → nguyen_ven | một phần liên kết nối lại |
| **Chương 7** | **Bốn đường theo thời gian** | | | |
| 7.1 | Đặt bốn cơ chế lên cùng một trục thời gian. | Một trục thời gian | ma_claude · do_thi_bon_duong | trục thời gian thang logarit |
| 7.2 | Suy giảm do nắng đầu là một bậc rơi trong những ngày đầu, rồi phẳng. | Nắng đầu: bậc rơi rồi phẳng | ma_claude · do_thi_bon_duong | đường cô-ban vẽ dần, nhãn hiện khi đường vẽ tới |
| 7.3 | Suy giảm do nắng và nhiệt võng xuống chậm trong nhiều tháng, rồi hồi lên một phần. | Nắng và nhiệt: võng rồi hồi | ma_claude · do_thi_bon_duong | đường cam vẽ dần |
| 7.4 | Suy giảm do điện áp cao tụt dần khi điện áp còn cao, hồi lại khi đảo chiều điện áp. | Điện áp cao: tụt rồi hồi khi đảo chiều | ma_claude · do_thi_bon_duong | đường xanh điện vẽ dần |
| 7.5 | Suy giảm do tia cực tím tụt dần theo liều cộng dồn. | Tia cực tím: tụt theo liều | ma_claude · do_thi_bon_duong | đường tím vẽ dần |
| 7.6 | Hình vẽ chỉ cho thấy hình dạng, không phải số đo của một tấm pin cụ thể. | Chỉ là hình dạng | ma_claude · do_thi_bon_duong | nhãn "hình dạng minh hoạ" |
| **Chương 8** | **Bảng so sánh cạnh nhau** | | | |
| 8.1 | Bảng này gom bốn cơ chế lại. | Bảng gom bốn cơ chế | ma_claude · bang_so_sanh | khung bảng bốn cột năm hàng |
| 8.2 | Suy giảm do nắng đầu đến từ cặp bo và ô-xy. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.3 | Kiểu này xảy ra trong vài ngày đầu. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.4 | Tế bào loại p pha bo bị nặng hơn. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.5 | Mất xong thì dừng ở một mức. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.6 | Cách phòng là pha gali thay bo. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.7 | Suy giảm do nắng và nhiệt cần thêm nhiệt độ cao, có hydro liên quan. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.8 | Kiểu này kéo dài từ vài tháng đến vài năm. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.9 | Tế bào PERC bị nặng hơn. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.10 | Công suất hồi lại một phần. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.11 | Cách phòng là tối ưu quy trình nung. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.12 | Suy giảm do điện áp cao đến từ ion natri bị kéo vào tế bào. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.13 | Mức độ tuỳ điện áp và độ ẩm. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.14 | Nặng nhẹ còn tuỳ cấu trúc tế bào. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.15 | Nhiều trường hợp hồi lại được. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.16 | Cách phòng là lớp bao điện trở cao và nối đất. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.17 | Suy giảm do tia cực tím đến từ lớp thụ động bị phá. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.18 | Kiểu này cộng dồn theo liều. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.19 | Báo cáo nhiều ở TOPCon và HJT. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.20 | Công suất hồi một phần. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| 8.21 | Cách phòng là lớp bao chắn tia cực tím. | Ô bảng theo câu | ma_claude · bang_so_sanh | ô của cột đang đọc hiện đúng câu |
| **Chương 9** | **Không có một đáp án chung** | | | |
| 9.1 | Không kiểu nào áp dụng cho mọi tấm pin. | Không đáp án chung | nen_hero | bốn thẻ tên hai bên tấm pin |
| 9.2 | Mức mất phụ thuộc loại tế bào, vật liệu bao, khí hậu và cách lắp. | Bốn yếu tố | nen_hero | bốn thẻ: loại tế bào, vật liệu bao, khí hậu, cách lắp |
| 9.3 | Lần tới đọc báo cáo độ tin cậy của tấm pin, hãy hỏi: nó đã được thử bốn kiểu này chưa? | Câu hỏi khi đọc báo cáo | nen_hero | thẻ câu hỏi cuối |

Tổng: nen_hero ở chương 1 và 9; nen_mat_cat (một tấm gốc, bốn biến thể cùng góc máy) ở chương 2–6; ma_claude ở chương 7, 8 và câu 5.6 (ảnh phát quang điện vẽ bằng mã).
