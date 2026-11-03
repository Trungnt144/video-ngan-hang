"""Đối chiếu các phép tính tài chính và CTA trước khi trình duyệt; dữ kiện nguồn duy nhất."""
from pathlib import Path
import json
D=Path(__file__).resolve().parent;SP=D.parent.parent/'san_pham/2026.11.03.EBITDA_la_gi/tai_nguyen/kich_ban'
v=json.loads((SP/'2026.11.03.ebitda_v1.du_kien.json').read_text())['gia_tri']
checks={
 'EBITDA từ doanh thu':v['doanh_thu']-v['chi_phi_chua_DA']==v['EBITDA'],
 'EBIT':v['EBITDA']-v['khau_hao_phan_bo']==v['EBIT'],
 'Lợi nhuận sau thuế':v['EBIT']-v['lai_vay']-v['thue_thu_nhap']==v['loi_nhuan_sau_thue'],
 'EBITDA cộng ngược':v['loi_nhuan_sau_thue']+v['lai_vay']+v['thue_thu_nhap']+v['khau_hao_phan_bo']==v['EBITDA'],
 'Biên EBITDA':v['EBITDA']/v['doanh_thu']*100==v['bien_EBITDA'],
 'Nợ ròng':v['no_vay']-v['tien']==v['no_rong'],
 'Nợ ròng/EBITDA':v['no_rong']/v['EBITDA']==v['no_rong_EBITDA'],
 'EBITDA giảm':v['no_rong']/v['EBITDA_giam']==v['ty_so_sau_giam'],
 'Giá trị doanh nghiệp':v['EBITDA']*v['boi_so_gia_dinh']==v['EV'],
 'Vốn chủ':v['EV']-v['no_rong']==v['von_chu_so_huu'],
 'Cầu tiền':v['EBITDA']-v['thue_thu_nhap']-v['lai_vay']-v['chi_mua_may']-v['tang_VLD_hoat_dong']==v['thieu_hut_tien'],
}
c=json.loads((SP/'2026.11.03.ebitda_v1.chuong.json').read_text());tg=json.loads((D/'thoi_gian.json').read_text())
CTA='Đăng ký kênh Chuyện nghề Ngân hàng để biết thêm nhiều nội dung thú vị về ngân hàng và đi vay.'
checks['CTA đúng cuối lời đọc']=c[-1]['text'].endswith(CTA) and c[-1]['doc'].endswith(CTA)
checks['Màn kết đúng đầu CTA']=tg['man_hinh_ket']['t']==tg['chuong'][-1]['cau'][-1]['t']
checks['Màn kết 10 giây']=abs(tg['man_hinh_ket']['den']-tg['man_hinh_ket']['t']-10)<0.001
checks['Thời lượng 4–6 phút']=240<=tg['thoi_luong_giay']<=360
for k,v in checks.items(): print(('ĐÚNG' if v else 'SAI')+': '+k)
raise SystemExit(0 if all(checks.values()) else 1)
