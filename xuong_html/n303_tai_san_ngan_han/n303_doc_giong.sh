#!/bin/zsh
# N303: đọc giọng cả video ở tốc độ 5,06; chờ khi máy đã có 3 lượt đọc giọng
cd /Users/macbooktrungnt/Documents/VideoNganHang
until [ "$(pgrep -f 'sinh_giong_vieneu.py' | wc -l)" -lt 3 ]; do sleep 60; done
echo "n303 bat dau $(date +%H:%M:%S)"
.venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban san_pham/2026.11.07.Tai_san_ngan_han_la_gi/tai_nguyen/kich_ban/2026.11.07.tai_san_ngan_han_v1.chuong.json --ra xuong_html/n303_tai_san_ngan_han/am_thanh --giong "Quốc Tuấn" > xuong_html/n303_tai_san_ngan_han/n303_giong.log 2>&1
echo "n303 xong $(date +%H:%M:%S) ma $?"
