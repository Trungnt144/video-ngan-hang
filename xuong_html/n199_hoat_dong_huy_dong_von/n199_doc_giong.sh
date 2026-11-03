#!/bin/zsh
# N199: đọc giọng cả video ở tốc độ 5,06; chờ khi máy đã có 3 lượt đọc giọng
cd /Users/macbooktrungnt/Documents/VideoNganHang
until [ "$(pgrep -f 'sinh_giong_vieneu.py' | wc -l)" -lt 3 ]; do sleep 60; done
echo "n199 bat dau $(date +%H:%M:%S)"
.venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban san_pham/2026.11.02.Hoạt động huy động vốn của ngân hàng là gì/tai_nguyen/kich_ban/2026.11.02.hoat_dong_huy_dong_von_v1.chuong.json --ra xuong_html/n199_hoat_dong_huy_dong_von/am_thanh --giong "Quốc Tuấn" > xuong_html/n199_hoat_dong_huy_dong_von/n199_giong.log 2>&1
echo "n199 xong $(date +%H:%M:%S) ma $?"
