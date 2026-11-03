#!/bin/zsh
# N199 đợt B lượt 1: đọc lại các câu Whisper nghe thiếu chữ (huy động → quy động, lãi → lại, vay → vai, chung → trung, tiền gửi → tiền người)
cd /Users/macbooktrungnt/Documents/VideoNganHang
P=.venv_vieneu/bin/python; L=xuong_html/n199_hoat_dong_huy_dong_von/n199_doc_lai.py
until [ "$(pgrep -f 'sinh_giong_vieneu.py|_doc_lai.py' | wc -l)" -lt 3 ]; do sleep 30; done
$P $L 2 1 8 '^\W*huy động vốn'
$P $L 2 4 8 'trả tiền lãi'
$P $L 4 3 8 'trả lãi suất'
$P $L 7 6 8 'tiền vay ngân'
$P $L 8 3 8 'thông thường'
$P $L 10 4 8 'tiền gửi có kỳ'
$P $L 10 5 8 'tăng lãi suất'
echo XONG
