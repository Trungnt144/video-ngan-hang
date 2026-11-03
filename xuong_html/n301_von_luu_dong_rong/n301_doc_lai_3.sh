#!/bin/zsh
# N199 đợt C: đọc lại theo soát độc lập (6.3 "Tiền từ", 10.3 "trừ đi", "dự phòng"; câu đổi lời 8.5, 8.6, 9.3, 9.4, 11.3)
cd /Users/macbooktrungnt/Documents/VideoNganHang
P=.venv_vieneu/bin/python; L=xuong_html/n199_hoat_dong_huy_dong_von/n199_doc_lai.py
until [ "$(pgrep -f 'sinh_giong_vieneu.py|_doc_lai.py' | wc -l)" -lt 3 ]; do sleep 30; done
$P $L 6 3 3 '^\W*tiền từ mọi'
$P $L 10 3 3 '^\W*tiền lãi nhận.*trừ đi.*dự phòng'
$P $L 8 5 8 'mức tối đa.*đặt mức'
$P $L 8 6 8 'thông tư 50'
$P $L 9 3 8 'phần lớn ngân hàng'
$P $L 9 4 8 '^\W*người gửi tiền'
$P $L 11 3 8 'giữ đúng quy định'
echo XONG
