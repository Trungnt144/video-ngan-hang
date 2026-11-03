#!/bin/zsh
# N301: đọc giọng cả video ở tốc độ 5,06; chờ khi máy đã có dưới 3 lượt đọc giọng
cd /Users/macbooktrungnt/Documents/VideoNganHang
until [ "$(pgrep -f 'sinh_giong_vieneu.py' | wc -l)" -lt 3 ]; do sleep 5; done
echo "n301 bat dau $(date +%H:%M:%S)"
mkdir -p xuong_html/n301_von_luu_dong_rong/am_thanh
.venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban san_pham/2026.11.03.Von_luu_dong_rong_la_gi/tai_nguyen/kich_ban/2026.11.03.von_luu_dong_rong_v1.chuong.json --ra xuong_html/n301_von_luu_dong_rong/am_thanh --giong "Quốc Tuấn" > xuong_html/n301_von_luu_dong_rong/n301_giong.log 2>&1
echo "n301 xong $(date +%H:%M:%S) ma $?"
