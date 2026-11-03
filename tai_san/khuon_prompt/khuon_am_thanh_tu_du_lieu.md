# Khuôn âm thanh từ dữ liệu: đo nhạc bằng số, đặt tiếng theo đỉnh đo được

> Dùng khi làm âm thanh cho video dựng bằng mã (LM-02, LM-03, LM-04): nhạc nền, tiếng hiệu ứng, trộn với giọng đọc. Claude không nghe được âm thanh; mọi quyết định dựa trên số đo và file sự kiện, Trung nghe kết luận cuối. Giọng đọc và phụ đề: `08_giong_am_thanh_phu_de.md`.
> **Phiên bản:** 1.0 · **Cập nhật:** 2026-10-27 · Rút từ quét chữ 703 prompt (nhóm âm thanh: 22 prompt dặn đồng bộ theo phách, 20 prompt dặn đo bài bằng số, 17 prompt đặt tiếng theo đỉnh đo được, 41 prompt về hiệu ứng ít mà đúng) và kho nhạc, script đo của Media. Đoạn mã và lệnh trong file đã chạy thử ngày 27/10/2026 trên tín hiệu tổng hợp; chưa chạy trên video thật của Media.

## 1. Nguyên tắc

1. **Claude không nghe được.** Một bài đăng trong repo nói thẳng: Claude phân tích dạng sóng bằng số và khớp hiệu ứng tại khoảnh khắc cần (`majin-appsheet-693327`). Ở Media đã có ví dụ: máy nhận dạng giọng nói nghe đúng chữ "lưu trữ" nhưng Trung nghe thấy chưa chuẩn (`10_video_ngang_thuyet_minh.md`, video BESS). Số đo loại được lỗi, không thay được lượt nghe cuối.
2. **Mốc thời gian có ba nguồn, đều là số:** mốc câu và mốc từ của giọng (`<tên>.moc_cau.json`, `moc_tu.json`), phách đo từ nhạc, sự kiện hình (file `su_kien.json`).
3. **Một file sự kiện điều khiển cả hình lẫn tiếng**, để mỗi tiếng ứng với một việc nhìn thấy. Ví dụ trong repo: mỗi lần photon nảy là một tiếng click đọc từ cùng dữ liệu nảy của hình (`apoorvjain25-945542`); mỗi nốt đến từ một va chạm thấy được (`kamstudiolabs-440893`); xi-lanh nháy theo thứ tự nổ thật (`dys-hay-749645`).
4. **Ít mà đúng:** một tiếng "vút" mềm cho mỗi lần đổi cảnh thật; click, pop nhỏ chỉ cho hành động thật trên màn hình; im lặng ngoài ra (`everestchris6-399895`, `aschapmann-724497`).
5. Video phải hiểu được khi tắt tiếng; âm thanh bổ sung cho hình, không mang ý chính.

## 2. Ba loại video và âm thanh của chúng

| Loại | Nhịp chính | Nhạc | Hiệu ứng |
|---|---|---|---|
| A. Có giọng đọc (mặc định của Media) | Mốc câu và mốc từ của giọng | Nhạc nền chọn từ kho, hạ dưới giọng | Rất ít |
| B. Không giọng, có nhạc (quảng cáo, showreel) | Lưới phách đo từ bài | Bài có phách rõ; video bắt đầu 8 hoặc 12 nhịp trước chỗ nhạc đổi mạnh (drop) để cảnh quan trọng rơi đúng drop | Đặt theo đỉnh trên lưới phách |
| C. Không nhạc | Sự kiện hình | Không | Tiếng giao diện tổng hợp bằng mã, đặt theo đỉnh (`annacher-433425`) |

## 3. Chọn nhạc và đo phách (loại B; loại A chỉ cần bước chọn)

- Nhạc chọn từ kho `tai_san/nhac_nen/` (78 bài, mã NH00–NH77; Mixkit giấy phép dùng miễn phí cho video, không được đăng ký lên dịch vụ bản quyền). Sổ phân loại: `tai_san/nhac_nen/so_nhac.json` có trường `bpm`, `khoi_am_moi_giay`, `dai_giay`, `am_luong`, `re`, `co_the_co_loi`. Không sinh nhạc bằng mô hình AI; không nêu tên hãng trong lời xin nhạc.
- BPM trong sổ là ước, có thể lệch nửa hoặc gấp đôi. Đo lại phách bằng librosa: `.venv_nhac/bin/python` (đã có librosa) với `librosa.beat.beat_track` và `librosa.onset.onset_detect`; ghi phách đầu, dãy thời điểm phách, thời điểm nhạc đổi mạnh.
- Kiểm lưới ổn định bằng số: độ lệch chuẩn của khoảng cách giữa các phách liên tiếp (đề xuất: dưới 20 mili giây thì lưới dùng được; chưa hiệu chỉnh). Lưới không ổn định thì hiệu chỉnh theo thời điểm khởi âm của tiếng trống mạnh.
- Cắt đoạn bắt đầu từ phách đầu tiên; bài ngắn hơn video thì theo thứ tự duy nhất ở `08_giong_am_thanh_phu_de.md` mục 7 (chọn bài dài hơn; không có thì phát chậm không thấp hơn 0,95 lần; vẫn thiếu thì nối lặp có mờ chéo).
- Kiểm bài: `scripts/do_nhac_nen.py` (độ to, khoảng động, nhịp ước), `scripts/do_re_cao_tan.py` (rè cao tần; ngưỡng nghi rè: `max10` từ 5 hoặc `max16` từ 8, vượt thì phải nghe lại), `scripts/cham_tam_trang_nhac.py` (gợi ý có lời hay không, phải nghe lại).

## 4. File sự kiện và đặt tiếng theo đỉnh đo được

**Lấy sự kiện từ hình.** LM-03: trang có hàm `window.suKien()` trả mảng `{t, loai, db}` (khuôn `khuon_dung_html_mot_trang.md`); chạy Playwright một lần để ghi ra `su_kien.json`. LM-02: lấy từ các mốc trong `KichBan.ts` hoặc `thoi_gian.json`. Mỗi sự kiện là một hành động nhìn thấy: đổi cảnh, vật chạm, số nhảy, nhấn.

**Đặt tiếng sao cho đỉnh biên độ rơi đúng khung hành động, không phải đầu file.** Đo thời điểm đỉnh của từng tiếng, trừ đi khi đặt. Đoạn mã dưới đây đã chạy thử (đỉnh rơi lệch dưới 0,3 mili giây so với `t` yêu cầu). Tiếng đầu vào là WAV 48 kHz 16 bit; đổi trước bằng `ffmpeg -i vao.mp3 -ar 48000 -ac 1 -c:a pcm_s16le ra.wav`. Dùng `.venv_vieneu/bin/python` hoặc `python3` có numpy.

```python
import json, sys, wave
import numpy as np
SR = 48000
def doc_wav(p):
    w = wave.open(p); assert w.getframerate() == SR
    x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return x.reshape(-1, w.getnchannels()).mean(1)
def giay_dinh(x, ms=5):                      # thời điểm đỉnh biên độ làm mịn 5 ms
    k = max(1, int(SR * ms / 1000))
    return int(np.argmax(np.convolve(np.abs(x), np.ones(k) / k, "same"))) / SR
def tron(su_kien, tieng, do_dai_giay, ra):   # su_kien: [{"t","loai","db"}]; tieng: {"loai": "file.wav"}
    mix, cache = np.zeros(int(do_dai_giay * SR) + SR, np.float32), {}
    for e in su_kien:
        if e["loai"] not in cache:
            x = doc_wav(tieng[e["loai"]]); cache[e["loai"]] = (x, giay_dinh(x))
        x, d = cache[e["loai"]]
        bd = int(round((e["t"] - d) * SR))   # đặt để ĐỈNH rơi đúng t
        a, b = max(0, bd), min(len(mix), bd + len(x))
        if b > a: mix[a:b] += x[a - bd:b - bd] * 10 ** (e.get("db", 0) / 20)
    w = wave.open(ra, "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes()); w.close()
```

**Kiểm độ khớp bằng số.** Với từng sự kiện, tìm đỉnh biên độ của bản trộn trong cửa sổ ±100 mili giây quanh `t`, tính chênh lệch; yêu cầu không quá nửa khung hình (nguồn: `oab10don-457273` đạt ±0,5 khung giữa cú nhún và tiếng trống).

**Tiếng tổng hợp bằng mã.** Click, pop, vút: sóng sin hoặc nhiễu nhân với đường bao biên độ (tấn công nhanh, tắt dần); dây: mô hình Karplus-Strong (`demitiyageekzen-818523`). Đỉnh của tiếng tổng hợp biết trước (đầu giai đoạn tấn công), không cần đo. Web Audio chỉ để xem thử trong trình duyệt: công cụ `xuat_mp4.mjs` không điều khiển Web Audio, nên âm thanh của MP4 luôn làm ngoài trang rồi ghép (`05_cach_lam.md`, LM-03). Thử độ dài và dải tần của từng hiệu ứng (tiếng "ùng", "xì") trước khi đặt vào video (`everestchris6-399895`).

**Tiếng sinh từ vật lý của hình** (hợp CL-12, CL-14): tiếng "lách tách" của lửa lấy từ độ sáng của lửa mỗi khung (`nathanwilbanks-981110`); mỗi tiếng "clink" của một viên bi khớp một va chạm của mô phỏng (`rneayan-417829`). Điều kiện: mô phỏng chạy thật và ghi va chạm vào file sự kiện.

## 5. Trộn giọng, nhạc, hiệu ứng

- **Hạ nhạc dưới giọng.** Nguồn: giọng cao hơn nhạc 10–15 dB, nhạc hạ về −18 dB lúc đang nói, hình không được dừng khi người dẫn ngừng nói (`notdwd-998633`). Đo ở Media: phần có tiếng của giọng VieNeu −17 dBFS (25/10/2026); video làm trước ngày đó chỉnh nhạc nền theo giọng cũ nhỏ hơn khoảng 5 dB nên có thể nhỏ hơn mong muốn (`08_giong_am_thanh_phu_de.md`).
- Cách hạ: ghép bằng bộ lọc `sidechaincompress` của FFmpeg, hoặc dựng đường bao âm lượng nhạc từ mốc câu rồi nhân vào. Lệnh sau chạy được (đã kiểm cú pháp 27/10/2026); ngưỡng và tỉ lệ nén chưa hiệu chỉnh trên giọng VieNeu:

```
FF=/Users/macbooktrungnt/Documents/VideoNganHang/xuong_thu_hyperframes/bin/ffmpeg
"$FF" -y -i nhac.wav -i giong.wav -filter_complex "[0:a][1:a]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=300[nh];[nh][1:a]amix=inputs=2:normalize=0[ra]" -map "[ra]" nhac_giong.wav
```

- **Hiệu ứng so với nhạc.** Nguồn nêu hai ý: mỗi hiệu ứng đặt cao hơn nhạc một chút trong dải tần riêng của nó; và hiệu ứng không to hơn nhạc về tổng thể, có giới hạn mức để không gắt (`everestchris6-399895`). Hiệu ứng không bao giờ làm đỉnh bản trộn vượt −2 dBTP.
- **Nhạc phản ứng theo hình** (nhạc đọc cùng file phách với hình, `apoorvjain25-309680`) chỉ dùng cho loại C và showreel; không dùng cho video khoa học có giọng.
- **Xuất hai bản:** bản có đủ giọng, nhạc, hiệu ứng; bản không lời (nhạc và hiệu ứng) để đổi giọng sau mà không dựng lại. Giọng giữ riêng ở `tai_nguyen/am_thanh/`.

## 6. Chuẩn hoá và đo lại

Mức đích: tích hợp −14 LUFS (đơn vị độ to theo chuẩn phát trực tuyến), đỉnh thật −2 dBTP (`ik-builds-585923`: đo lại sau khi mã hoá AAC; `0xnicc0-516612`). Một số prompt chọn −16 LUFS (`tanabe-fragm-322001`, `zhu185178-255661`); Media dùng −14.

```
# đo (xem dòng "I:" và "Peak:" cuối kết quả)
"$FF" -hide_banner -i video.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -n 14
# chuẩn hoá hai lượt: lượt 1 in số đo dạng json
"$FF" -hide_banner -i tron.wav -af loudnorm=I=-14:TP=-2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/{/,/}/p'
# lượt 2: điền số lượt 1 vào measured_*, offset = target_offset
"$FF" -y -i tron.wav -af "loudnorm=I=-14:TP=-2:LRA=11:measured_I=<input_i>:measured_TP=<input_tp>:measured_LRA=<input_lra>:measured_thresh=<input_thresh>:offset=<target_offset>:linear=true" -ar 48000 am_thanh.wav
# ghép vào hình, mã hoá AAC, rồi đo lại bằng lệnh đo ở trên
"$FF" -y -i hinh.mp4 -i am_thanh.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k video_co_tieng.mp4
```

Dùng bản FFmpeg của `xuong_thu_hyperframes/bin/ffmpeg` (6.0, có `loudnorm`, `ebur128`, `sidechaincompress`); bản đi kèm Remotion không có `ebur128` và chỉ xuất được WAV.

## 7. Danh sách kiểm bằng số

| Mục | Ngưỡng | Công cụ |
|---|---|---|
| Độ to tích hợp, đỉnh thật | −14 LUFS, không quá −2 dBTP, đo lại sau AAC | `ebur128` |
| Độ lệch đỉnh tiếng so với khung hành động | Không quá nửa khung hình | Đoạn mã mục 4 |
| Lưới phách của nhạc | Độ lệch chuẩn khoảng cách phách nhỏ (đề xuất dưới 20 mili giây) | librosa |
| Nhạc không rè cao tần, không có giọng hát | Dưới ngưỡng `do_re_cao_tan.py`; `co_the_co_loi` sai | script, rồi Trung nghe lại |
| Nhạc hạ dưới giọng | Giọng cao hơn nhạc 10–15 dB khi đang nói | Đo mức theo đoạn có giọng |
| Hiểu được khi tắt tiếng | Người phản biện hiểu đúng ý chính từ bản không tiếng | `khuon_phan_bien.md` |

Chưa có số đo của khuôn này trên video thật: ghi lại lượt đầu tiên (thời gian máy, độ lệch đỉnh thật) vào mục này.
