// chung/kho_nen.js — 1.0 — nền móng kho hình dùng chung: biến KHO, phông Be Vietnam Pro tại chỗ, bảng màu theo mã MAU,
// hàm tạo phần tử, hàm dễ dàng hoá, số giả ngẫu nhiên có hạt giống, bộ lọc nét tay, vẽ dần đường, đo và xuống dòng chữ, tự kiểm chữ.
// Gom từ xuong_html/2026.10.28_cic_la_gi/trang.html (N108): dòng 642-670 (spr, mulberry32, NG, mixc), 1153-1185 (hopChu, kiemTra).
// Hợp đồng hình: tai_san/kho_hinh_chung/README.md. Mọi hàm ở đây thuần: cùng đầu vào cho cùng kết quả, không đọc giờ máy.
(function () {
  'use strict';
  const K = (window.KHO = window.KHO || {});
  K.phien_ban_nen = '1.0';

  // ---------- đường dẫn gốc kho (để nạp phông tại chỗ, chạy được khi mất mạng) ----------
  // Trong kho: tai_san/kho_hinh_chung/chung/kho_nen.js; trong dự án: thu_vien/kho/chung/kho_nen.js. Gốc là thư mục chứa chung/.
  const cs = document.currentScript;
  K.goc = cs && cs.src ? cs.src.replace(/chung\/kho_nen\.js(\?.*)?$/, '') : '';

  // ---------- phông Be Vietnam Pro: một cách nạp duy nhất ----------
  // Tên họ phông trong trang là "BVP". Ưu tiên file .ttf đi kèm kho (chung/phong/), máy nào đã cài phông thì local() làm dự phòng.
  // Giấy phép SIL Open Font License 1.1 (chung/phong/GIAY_PHEP.md).
  K.PHONG = '"BVP", "Be Vietnam Pro", "Helvetica Neue", Arial, sans-serif';
  const DO_DAM = [[400, 'Regular'], [500, 'Medium'], [600, 'SemiBold'], [700, 'Bold'], [800, 'ExtraBold']];
  if (!document.getElementById('kho-phong')) {
    const st = document.createElement('style');
    st.id = 'kho-phong';
    st.textContent = DO_DAM.map(([w, ten]) =>
      `@font-face{font-family:"BVP";font-weight:${w};font-style:normal;font-display:block;` +
      `src:url("${K.goc}chung/phong/BeVietnamPro-${ten}.ttf") format("truetype"),local("Be Vietnam Pro ${ten}"),local("BeVietnamPro-${ten}");}`
    ).join('\n');
    (document.head || document.documentElement).appendChild(st);
  }
  const MAU_CHU_VIET = 'ĐđăâêôơưẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲỴỶỸ0123456789%';
  // Gọi trước khi chụp: chờ đủ năm độ đậm. Trả về Promise.
  K.napPhong = function () {
    const ds = DO_DAM.map(([w]) => document.fonts.load(`${w} 40px "BVP"`, MAU_CHU_VIET).catch(() => []));
    return Promise.all(ds).then(() => document.fonts.ready);
  };
  // true khi phông BVP đã nạp được (từ file hoặc local).
  K.coPhong = () => document.fonts.check('700 40px "BVP"', 'Đ');

  // ---------- bảng màu theo mã MAU (một bộ giá trị cho mỗi mã; nguồn: tai_san/so_tay_gu/he_truc_dung.md) ----------
  // Khoá ngữ nghĩa, mọi hình chỉ đọc các khoá này:
  //   nen        nền khung              nen_phu   dải, vùng nền thứ hai     the     nền thẻ, hộp
  //   chu        chữ và nét chính       chu_phu   chữ phụ, nhãn nhỏ         vien    nét viền vật thể
  //   nhan       màu nhấn chính         nhan_phu  màu nhấn thứ hai          nhat    nhấn pha nhạt (tô nền vùng nhấn)
  //   tot        đúng, an toàn, tăng    xau       sai, rủi ro, giảm        canh_bao chú ý
  //   giay       nền giấy tờ           da        màu da nhân vật           toi     true nếu nền tối
  // Mã nào bảng gốc không có màu đúng/sai thì kho tự chọn, ghi ở ghi_chu của mã.
  K.BANG = {
    'MAU-20': { ten: 'Đen & cam', toi: true, nen: '#090909', nen_phu: '#151515', the: '#1C1C1C', chu: '#ECE9E2', chu_phu: '#9C988F', vien: '#ECE9E2',
      nhan: '#FC7B33', nhan_phu: '#E9732D', nhat: '#3A2416', tot: '#7DBE8A', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F3EFE6', da: '#D9A47E' },
    'MAU-21': { ten: 'Navy & vàng bài giảng', toi: true, nen: '#0C111E', nen_phu: '#141B2D', the: '#18213A', chu: '#FEFFFF', chu_phu: '#A9B4C8', vien: '#FEFFFF',
      nhan: '#F8DB78', nhan_phu: '#58C3DB', nhat: '#2E3140', tot: '#8AB877', xau: '#FB8836', canh_bao: '#F8DB78', giay: '#F4F1E8', da: '#D9A47E' },
    'MAU-22': { ten: 'Báo tài chính sáng', toi: false, nen: '#ECF0F5', nen_phu: '#DDE4EC', the: '#FFFFFF', chu: '#0B1017', chu_phu: '#56606C', vien: '#0B1017',
      nhan: '#2C84C1', nhan_phu: '#59A7DB', nhat: '#D3E6F4', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F',
      ghi_chu: 'Bảng gốc không có cam; N82 dùng cam #C8662B, N122 #C2500A làm nhấn phụ: nay thống nhất xau #C8452F, canh_bao #D9912B.' },
    'MAU-23': { ten: 'Giấy kem & bút chì', toi: false, nen: '#E6D9C4', nen_phu: '#D3CAB5', the: '#F1E7D6', chu: '#211D18', chu_phu: '#5E564B', vien: '#211D18',
      nhan: '#C34A34', nhan_phu: '#798695', nhat: '#E9C9B6', tot: '#4F7A4A', xau: '#C34A34', canh_bao: '#B8862F', giay: '#F4ECDD', da: '#E2B48E',
      ghi_chu: 'N87 dùng đỏ #C34A34, N72 #A63A28: thống nhất #C34A34 theo bảng gốc.' },
    'MAU-24': { ten: 'Bảng trắng & bút dạ', toi: false, nen: '#FAFBF6', nen_phu: '#EEF0E8', the: '#FFFFFF', chu: '#2D363C', chu_phu: '#6A747A', vien: '#2D363C',
      nhan: '#B42235', nhan_phu: '#2B4B93', nhat: '#F1D3D6', tot: '#397858', xau: '#B42235', canh_bao: '#C98A1E', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-25': { ten: 'Kem, đen & đỏ tạp chí', toi: true, nen: '#0A0A11', nen_phu: '#E8E4DB', the: '#16161F', chu: '#EAE5DC', chu_phu: '#A39E95', vien: '#EAE5DC',
      nhan: '#D73428', nhan_phu: '#EAE5DC', nhat: '#3A1715', tot: '#6FB08A', xau: '#D73428', canh_bao: '#E3B04B', giay: '#E8E4DB', da: '#D9A47E',
      ghi_chu: 'Nền phụ là kem giấy #E8E4DB: vùng đặt trên nen_phu dùng chữ #080A0E.' },
    'MAU-26': { ten: 'Tím nhạt đồ chơi', toi: false, nen: '#F4F3FB', nen_phu: '#EEEBF5', the: '#FFFFFF', chu: '#13121B', chu_phu: '#5C5A6B', vien: '#13121B',
      nhan: '#694CFE', nhan_phu: '#4723E4', nhat: '#DCD4FF', tot: '#5FA33B', xau: '#D9475A', canh_bao: '#E0A43A', giay: '#FFFFFF', da: '#EED3AE' },
    'MAU-27': { ten: 'Vũ trụ đen & cam', toi: true, nen: '#000000', nen_phu: '#0E0C0B', the: '#161311', chu: '#F2EDE5', chu_phu: '#A39B90', vien: '#F2EDE5',
      nhan: '#C06246', nhan_phu: '#D7684F', nhat: '#3A2119', tot: '#8FB98A', xau: '#D7684F', canh_bao: '#D9A65B', giay: '#F2EDE5', da: '#D9A47E' },
    'MAU-28': { ten: 'Trắng & tím công nghệ', toi: false, nen: '#FDFDFD', nen_phu: '#F2F3FA', the: '#FFFFFF', chu: '#09233D', chu_phu: '#52657A', vien: '#09233D',
      nhan: '#6657FC', nhan_phu: '#6E58B9', nhat: '#C8C4FB', tot: '#2E9A6B', xau: '#D9475A', canh_bao: '#E39A2D', giay: '#FFFFFF', da: '#FDDAC8',
      ghi_chu: 'Bảng của N108; thẻ pastel phụ #FDDAC8, #D3E4FD.' },
    'MAU-29': { ten: 'Trắng xám & màu chức năng', toi: false, nen: '#D6DBDE', nen_phu: '#ECEDED', the: '#F4F5F5', chu: '#242D32', chu_phu: '#5B666C', vien: '#242D32',
      nhan: '#A47B57', nhan_phu: '#65B5AD', nhat: '#E6D498', tot: '#65B5AD', xau: '#B8736A', canh_bao: '#E6D498', giay: '#F7F7F5', da: '#E2B896',
      ghi_chu: 'N86 và N96 cùng mã chỉ trùng nền và chữ; thống nhất theo bảng gốc.' },
    'MAU-30': { ten: 'Đất nung & kem', toi: true, nen: '#191812', nen_phu: '#EFEDE0', the: '#24221B', chu: '#EFEDE0', chu_phu: '#A8A493', vien: '#EFEDE0',
      nhan: '#C45A3C', nhan_phu: '#A74131', nhat: '#3B241B', tot: '#8DAF7E', xau: '#C45A3C', canh_bao: '#D9A65B', giay: '#EFEDE0', da: '#D9A47E' },
    'MAU-31': { ten: 'Navy & cam bàn thao tác', toi: true, nen: '#0C0B19', nen_phu: '#1A1636', the: '#16152A', chu: '#FFFFFF', chu_phu: '#A8A6C4', vien: '#FFFFFF',
      nhan: '#FFB347', nhan_phu: '#BFE6FF', nhat: '#2D2640', tot: '#7FD1A0', xau: '#E8445A', canh_bao: '#FFD36B', giay: '#F4F2EC', da: '#E8B48F' },
    // --- bảng màu ngân hàng: sinh bởi scripts/tao_bang_mau_ngan_hang.py, không sửa tay ---
    'MAU-32': { ten: 'Vietcombank', toi: true, nen: '#031D13', nen_phu: '#042A1B', the: '#053120', chu: '#FFFFFF', chu_phu: '#9CB7AD', vien: '#FFFFFF', nhan: '#A1C038', nhan_phu: '#5E8B79', nhat: '#063D27', tot: '#7FD1A0', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F4F2EC', da: '#E8B48F' },
    'MAU-33': { ten: 'BIDV', toi: false, nen: '#F0F5F5', nen_phu: '#DCE7E7', the: '#FFFFFF', chu: '#333333', chu_phu: '#6C6E6E', vien: '#333333', nhan: '#075652', nhan_phu: '#B28013', nhat: '#C8DAD9', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-34': { ten: 'Agribank', toi: false, nen: '#FAF0F3', nen_phu: '#F4DDE3', the: '#FFFFFF', chu: '#393939', chu_phu: '#706D6E', vien: '#393939', nhan: '#AF0B35', nhan_phu: '#00422B', nhat: '#EDC9D3', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-35': { ten: 'VietinBank', toi: false, nen: '#F0F5F9', nen_phu: '#DBE8F0', the: '#FFFFFF', chu: '#001420', chu_phu: '#54636C', vien: '#001420', nhan: '#005993', nhan_phu: '#DA2127', nhat: '#C7DAE7', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-36': { ten: 'MB', toi: true, nen: '#080B50', nen_phu: '#0B1074', the: '#0D1488', chu: '#FFFFFF', chu_phu: '#A1A5ED', vien: '#FFFFFF', nhan: '#EB2D4B', nhan_phu: '#666DE2', nhat: '#1018A8', tot: '#7FD1A0', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F4F2EC', da: '#E8B48F' },
    'MAU-37': { ten: 'Techcombank', toi: false, nen: '#FEF1F2', nen_phu: '#FCDFE0', the: '#FFFFFF', chu: '#333333', chu_phu: '#716D6D', vien: '#333333', nhan: '#ED1C24', nhan_phu: '#A08B56', nhat: '#FBCDCF', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-38': { ten: 'VPBank', toi: false, nen: '#F0FBF4', nen_phu: '#DBF5E6', the: '#FFFFFF', chu: '#2E3A5B', chu_phu: '#677182', vien: '#2E3A5B', nhan: '#00A547', nhan_phu: '#1D4289', nhat: '#C7EFD8', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-39': { ten: 'ACB', toi: true, nen: '#001540', nen_phu: '#001F5C', the: '#00246D', chu: '#FFFFFF', chu_phu: '#99AFDC', vien: '#FFFFFF', nhan: '#00AFFF', nhan_phu: '#597EC6', nhat: '#002D86', tot: '#7FD1A0', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F4F2EC', da: '#E8B48F' },
    'MAU-40': { ten: 'TPBank', toi: false, nen: '#F6F2F8', nen_phu: '#E9E2EE', the: '#FFFFFF', chu: '#343441', chu_phu: '#6F6D77', vien: '#343441', nhan: '#652D89', nhan_phu: '#DB6C20', nhat: '#DDD1E5', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-41': { ten: 'Sacombank', toi: false, nen: '#F0F5F9', nen_phu: '#DBE8F2', the: '#FFFFFF', chu: '#2E3337', chu_phu: '#696E72', vien: '#2E3337', nhan: '#0058A0', nhan_phu: '#2A81D0', nhat: '#C7DAEA', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-42': { ten: 'LPBank', toi: false, nen: '#F6F3F1', nen_phu: '#EBE3DF', the: '#FFFFFF', chu: '#28140C', chu_phu: '#70625C', vien: '#28140C', nhan: '#6D371A', nhan_phu: '#C17A16', nhat: '#DFD3CD', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-43': { ten: 'SeABank', toi: false, nen: '#FDF1F2', nen_phu: '#F9DFE0', the: '#FFFFFF', chu: '#2F0607', chu_phu: '#775859', vien: '#2F0607', nhan: '#D71920', nhan_phu: '#9E1E1F', nhat: '#F6CCCE', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-44': { ten: 'HDBank', toi: false, nen: '#FEF0F2', nen_phu: '#FDDBE0', the: '#FFFFFF', chu: '#350007', chu_phu: '#7B5459', vien: '#350007', nhan: '#F00020', nhan_phu: '#9F862A', nhat: '#FCC7CE', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-45': { ten: 'VIB', toi: false, nen: '#F0F6FA', nen_phu: '#DBEAF4', the: '#FFFFFF', chu: '#001627', chu_phu: '#546471', vien: '#001627', nhan: '#0066B3', nhan_phu: '#B1820D', nhat: '#C7DDEE', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-46': { ten: 'SHB', toi: false, nen: '#FEF8F2', nen_phu: '#FEEEE0', the: '#FFFFFF', chu: '#361D07', chu_phu: '#7C6A59', vien: '#361D07', nhan: '#DC751D', nhan_phu: '#2E2A78', nhat: '#FDE4CE', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-47': { ten: 'OCB', toi: false, nen: '#F0F8F4', nen_phu: '#DBEFE5', the: '#FFFFFF', chu: '#001F0F', chu_phu: '#546B5F', vien: '#001F0F', nhan: '#008C44', nhan_phu: '#C18014', nhat: '#C7E6D6', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-48': { ten: 'MSB', toi: false, nen: '#FEF1F2', nen_phu: '#FCDFE0', the: '#FFFFFF', chu: '#091E42', chu_phu: '#5F6880', vien: '#091E42', nhan: '#EC1C24', nhan_phu: '#EE5E0C', nhat: '#FBCDCF', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-49': { ten: 'Eximbank', toi: false, nen: '#F0F5F9', nen_phu: '#DBE8F1', the: '#FFFFFF', chu: '#001421', chu_phu: '#54636D', vien: '#001421', nhan: '#005D98', nhan_phu: '#2496C6', nhat: '#C7DBE8', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-50': { ten: 'Nam A Bank', toi: false, nen: '#F0F7FB', nen_phu: '#DCEBF5', the: '#FFFFFF', chu: '#021929', chu_phu: '#556772', vien: '#021929', nhan: '#0772BA', nhan_phu: '#9F8A00', nhat: '#C8E0F0', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-51': { ten: 'Bac A Bank', toi: false, nen: '#FCF8F1', nen_phu: '#F7EFDE', the: '#FFFFFF', chu: '#2C1E04', chu_phu: '#756A57', vien: '#2C1E04', nhan: '#BE8311', nhan_phu: '#B58500', nhat: '#F3E5CB', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-52': { ten: 'ABBANK', toi: false, nen: '#FEF7F2', nen_phu: '#FDECE0', the: '#FFFFFF', chu: '#361B07', chu_phu: '#7C6859', vien: '#361B07', nhan: '#E2701E', nhan_phu: '#00A193', nhat: '#FDE2CE', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-53': { ten: 'PVcomBank', toi: false, nen: '#F0F7FB', nen_phu: '#DCEBF5', the: '#FFFFFF', chu: '#0D2240', chu_phu: '#5C6D81', vien: '#0D2240', nhan: '#0772BA', nhan_phu: '#AC8605', nhat: '#C8E0F0', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-54': { ten: 'Kienlongbank', toi: false, nen: '#FEF4F2', nen_phu: '#FDE6E0', the: '#FFFFFF', chu: '#1E2452', chu_phu: '#6C6D8A', vien: '#1E2452', nhan: '#EF4D23', nhan_phu: '#2794CB', nhat: '#FBD8CF', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-55': { ten: 'NCB', toi: false, nen: '#F0F4F9', nen_phu: '#DBE6F0', the: '#FFFFFF', chu: '#001121', chu_phu: '#54606D', vien: '#001121', nhan: '#004E96', nhan_phu: '#A1874D', nhat: '#C7D8E8', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-56': { ten: 'VietABank', toi: false, nen: '#F1F4F8', nen_phu: '#DFE5EE', the: '#FFFFFF', chu: '#060F1D', chu_phu: '#585F6A', vien: '#060F1D', nhan: '#1B4486', nhan_phu: '#EC2028', nhat: '#CDD6E4', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-57': { ten: 'BVBank', toi: true, nen: '#071633', nen_phu: '#0A1F49', the: '#0C2556', chu: '#FFFFFF', chu_phu: '#A0B0CE', vien: '#FFFFFF', nhan: '#13C0F7', nhan_phu: '#657EB0', nhat: '#0E2E6A', tot: '#7FD1A0', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F4F2EC', da: '#E8B48F' },
    'MAU-58': { ten: 'Saigonbank', toi: false, nen: '#F0F6FA', nen_phu: '#DBE9F4', the: '#FFFFFF', chu: '#001627', chu_phu: '#546471', vien: '#001627', nhan: '#0165B3', nhan_phu: '#6290B5', nhat: '#C7DDEE', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-59': { ten: 'PGBank', toi: true, nen: '#10142C', nen_phu: '#171D40', the: '#1B224B', chu: '#FFFFFF', chu_phu: '#A9AEC7', vien: '#FFFFFF', nhan: '#33BBEC', nhan_phu: '#747BA5', nhat: '#212A5D', tot: '#7FD1A0', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F4F2EC', da: '#E8B48F' },
    'MAU-60': { ten: 'BAOVIET Bank', toi: false, nen: '#F0F7FB', nen_phu: '#DBECF6', the: '#FFFFFF', chu: '#001B2A', chu_phu: '#546873', vien: '#001B2A', nhan: '#0079C1', nhan_phu: '#B2860A', nhat: '#C7E2F1', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-61': { ten: 'Vietbank', toi: false, nen: '#F0F6FB', nen_phu: '#DBEBF5', the: '#FFFFFF', chu: '#001929', chu_phu: '#546672', vien: '#001929', nhan: '#0071BB', nhan_phu: '#AF8600', nhat: '#C7E0F0', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-62': { ten: 'SCB', toi: true, nen: '#090E41', nen_phu: '#0D145E', the: '#10186E', chu: '#FFFFFF', chu_phu: '#A3A8DD', vien: '#FFFFFF', nhan: '#EB0029', nhan_phu: '#6971C8', nhat: '#131E88', tot: '#7FD1A0', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F4F2EC', da: '#E8B48F' },
    'MAU-63': { ten: 'Vikki Bank', toi: false, nen: '#F0F0FF', nen_phu: '#DBDBFF', the: '#FFFFFF', chu: '#000038', chu_phu: '#54547E', vien: '#000038', nhan: '#0000FF', nhan_phu: '#D21686', nhat: '#C7C7FF', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-64': { ten: 'MBV', toi: false, nen: '#FBF1F2', nen_phu: '#F5DFE0', the: '#FFFFFF', chu: '#374151', chu_phu: '#6C6F78', vien: '#374151', nhan: '#B71D1F', nhan_phu: '#B61D22', nhat: '#EFCDCE', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-65': { ten: 'VCBNeo', toi: false, nen: '#F0F5F3', nen_phu: '#DBE7E2', the: '#FFFFFF', chu: '#00120B', chu_phu: '#54615C', vien: '#00120B', nhan: '#005130', nhan_phu: '#6C9831', nhat: '#C7D9D1', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-66': { ten: 'GPBank', toi: false, nen: '#FFF9F1', nen_phu: '#FEF0DF', the: '#FFFFFF', chu: '#2E3A5B', chu_phu: '#6B7082', vien: '#2E3A5B', nhan: '#CC7A18', nhan_phu: '#EF4130', nhat: '#FDE7CD', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-67': { ten: 'Co-opBank', toi: false, nen: '#F0F4F9', nen_phu: '#DBE6F2', the: '#FFFFFF', chu: '#0F172A', chu_phu: '#5E6472', vien: '#0F172A', nhan: '#004AA1', nhan_phu: '#E50019', nhat: '#C7D7EA', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-68': { ten: 'Ngân hàng Chính sách xã hội', toi: false, nen: '#FEF0F8', nen_phu: '#FCDBEF', the: '#FFFFFF', chu: '#34001F', chu_phu: '#7B546B', vien: '#34001F', nhan: '#EC008C', nhan_phu: '#016D3E', nhat: '#FBC7E6', tot: '#2E8B57', xau: '#C8452F', canh_bao: '#D9912B', giay: '#FFFFFF', da: '#E8B48F' },
    'MAU-69': { ten: 'Ngân hàng Phát triển Việt Nam', toi: true, nen: '#15112D', nen_phu: '#1F1841', the: '#241D4D', chu: '#FFFFFF', chu_phu: '#AFABC8', vien: '#FFFFFF', nhan: '#EE1D23', nhan_phu: '#7E76A6', nhat: '#2D235E', tot: '#7FD1A0', xau: '#F0604D', canh_bao: '#F2C14E', giay: '#F4F2EC', da: '#E8B48F' },
    // --- hết bảng màu ngân hàng ---
  };
  K.MA_MAC_DINH = 'MAU-22';
  K.ma_mau = K.MA_MAC_DINH;
  K.mau = Object.assign({}, K.BANG[K.MA_MAC_DINH]);
  // KHO.datMau('MAU-23') chọn bảng theo mã; KHO.datMau('MAU-23', { nhan: '#...' }) chọn rồi ghi đè; KHO.datMau({ nhan: '#...' }) chỉ ghi đè.
  // Gọi trước khi tạo hình. Hình đọc màu lúc tạo (tham số opt.mau ghi đè từng hình).
  K.datMau = function (ma, ghiDe) {
    if (typeof ma === 'string') {
      if (!K.BANG[ma]) throw new Error('KHO.datMau: không có mã màu ' + ma);
      K.ma_mau = ma; K.mau = Object.assign({}, K.BANG[ma], ghiDe || {});
    } else K.mau = Object.assign({}, K.mau, ma || {});
    return K.mau;
  };
  // Màu cho một hình: bảng chung đè bởi opt.mau.
  K.layMau = (opt) => Object.assign({}, K.mau, (opt && opt.mau) || {});

  // ---------- phần tử ----------
  const NS = 'http://www.w3.org/2000/svg';
  K.NS = NS;
  // KHO.svg('rect', { x: 0, width: 10 }, cha) — thuộc tính null bị bỏ qua.
  K.svg = function (tag, attrs, cha) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (cha) cha.appendChild(e);
    return e;
  };
  // KHO.html('div', { class: 'x', style: '...' }, cha, 'chữ')
  K.html = function (tag, attrs, cha, chu) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (chu != null) e.textContent = chu;
    if (cha) cha.appendChild(e);
    return e;
  };
  // Chữ SVG: KHO.chu(cha, 'Hợp đồng', { x, y, co: 32, dam: 700, mau, neo: 'middle', ... })
  K.chu = function (cha, noiDung, o) {
    o = o || {};
    const e = K.svg('text', {
      x: o.x || 0, y: o.y || 0, 'font-family': K.PHONG, 'font-size': o.co || 32, 'font-weight': o.dam || 600,
      fill: o.mau || K.mau.chu, 'text-anchor': o.neo || 'start', 'dominant-baseline': o.duong_nen || 'alphabetic',
      'letter-spacing': o.gian != null ? o.gian : null, opacity: o.mo != null ? o.mo : null,
    }, cha);
    e.textContent = noiDung;
    return e;
  };
  // Tìm <svg> gốc chứa một phần tử (để đặt bộ lọc vào <defs>).
  K.svgGoc = (el) => (el.ownerSVGElement || (el.tagName.toLowerCase() === 'svg' ? el : null));
  K.defs = function (svgGoc) {
    let d = svgGoc.querySelector(':scope > defs');
    if (!d) { d = K.svg('defs'); svgGoc.insertBefore(d, svgGoc.firstChild); }
    return d;
  };

  // ---------- số học và dễ dàng hoá ----------
  K.cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  K.lerp = (a, b, p) => a + (b - a) * p;
  // Tiến độ 0..1 của một đoạn: bắt đầu ở giây a, kéo dài d giây.
  K.tienDo = (t, a, d) => (d <= 0 ? (t >= a ? 1 : 0) : K.cl((t - a) / d));
  K.eo3 = (p) => 1 - Math.pow(1 - K.cl(p), 3);
  K.ei3 = (p) => Math.pow(K.cl(p), 3);
  K.eio = (p) => { p = K.cl(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  K.eob = (p, s = 1.6) => { p = K.cl(p); const c3 = s + 1; return 1 + c3 * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2); }; // vượt nhẹ rồi về
  // Lò xo: tau là giây tính từ lúc bắt đầu; trả về 0 → 1 có dao động tắt dần.
  K.spr = function (tau, settle = 0.35, z = 0.72) {
    if (tau <= 0) return 0;
    const w = 4 / (z * settle), wd = w * Math.sqrt(1 - z * z);
    return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + (z * w / wd) * Math.sin(wd * tau));
  };
  // Hiện rồi ẩn: độ mờ của phần tử có mặt từ giây a tới giây b, vào và ra trong d giây.
  K.hienAn = (t, a, b, d = 0.3) => Math.min(K.eo3((t - a) / d), b == null ? 1 : 1 - K.eo3((t - (b - d)) / d));

  // ---------- số giả ngẫu nhiên có hạt giống ----------
  K.mulberry32 = function (a) {
    return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  };
  // KHO.ngauNhien(hat) trả về hàm i => số 0..1, cùng (hat, i) luôn cùng số.
  const BANG_NG = {};
  K.ngauNhien = function (hat = 1) {
    if (!BANG_NG[hat]) { const r = K.mulberry32(hat), a = []; for (let i = 0; i < 1024; i++) a.push(r()); BANG_NG[hat] = a; }
    const a = BANG_NG[hat];
    return (i) => a[((Math.floor(i) % 1024) + 1024) % 1024];
  };
  K.NG = K.ngauNhien(1);

  // ---------- màu ----------
  K.hex = (h) => { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  K.tron = (a, b, p) => { const x = K.hex(a), y = K.hex(b); return '#' + x.map((v, i) => Math.round(K.lerp(v, y[i], K.cl(p))).toString(16).padStart(2, '0')).join(''); };
  K.rgba = (h, a) => { const [r, g, b] = K.hex(h); return `rgba(${r},${g},${b},${a})`; };
  // Độ sáng tương đối và tỉ lệ tương phản theo WCAG (soát chữ trên nền).
  K.doSang = (h) => { const c = K.hex(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
  K.tuongPhan = (a, b) => { const x = K.doSang(a), y = K.doSang(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  // Chọn màu chữ đọc được trên nền cho trước.
  K.chuTren = (nen, sang = '#FFFFFF', toi = K.mau.chu) => (K.tuongPhan(nen, sang) >= K.tuongPhan(nen, toi) ? sang : toi);

  // ---------- nét tay (chất liệu CL-10) ----------
  // Tạo bộ lọc làm run nét bằng feTurbulence + feDisplacementMap, hạt giống cố định nên khung nào cũng như nhau.
  // KHO.locNetTay(svgGoc, { hat: 3, do_run: 2.2, tan_so: 0.03 }) → 'url(#kho-nt-3-2.2)'. Gán vào thuộc tính filter của nhóm nét.
  // Muốn nét "sôi" (đổi hạt 8 lần mỗi giây như vẽ tay từng khung): KHO.locNetTay(svgGoc, {...}, t) với t là giây hiện tại,
  // hạt đổi theo Math.floor(t * 8), vẫn là hàm thuần của t.
  K.locNetTay = function (svgGoc, o, t) {
    o = o || {};
    const hat = (o.hat || 1) + (t != null && o.soi ? Math.floor(t * (o.nhip || 8)) % 4 : 0);
    const doRun = o.do_run != null ? o.do_run : 2.2, tanSo = o.tan_so || 0.035;
    const id = `kho-nt-${hat}-${doRun}-${tanSo}`.replace(/\./g, '_');
    if (!svgGoc.querySelector('#' + id)) {
      const f = K.svg('filter', { id, x: '-5%', y: '-5%', width: '110%', height: '110%', filterUnits: 'objectBoundingBox' }, K.defs(svgGoc));
      K.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: tanSo, numOctaves: 2, seed: hat, result: 'n' }, f);
      K.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: doRun * 2, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
    }
    return `url(#${id})`;
  };
  // Đường nét tay: biến một đa giác hoặc đường gấp khúc thành path hơi lệch, hai lượt chồng nhau như bút chì.
  // diem: [[x,y],...]; trả về chuỗi d. Hạt giống cố định → hình giống nhau mọi khung.
  K.duongTay = function (diem, o) {
    o = o || {};
    const ng = K.ngauNhien(o.hat || 7), lech = o.lech != null ? o.lech : 1.6, dong = !!o.dong;
    let d = '', k = 0;
    const pts = dong ? diem.concat([diem[0]]) : diem;
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      const dx = (ng(k++) - 0.5) * 2 * lech, dy = (ng(k++) - 0.5) * 2 * lech;
      if (i === 0) d += `M${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`;
      else {
        const [x0, y0] = pts[i - 1];
        const mx = (x0 + x) / 2 + (ng(k++) - 0.5) * 2 * lech, my = (y0 + y) / 2 + (ng(k++) - 0.5) * 2 * lech;
        d += ` Q${mx.toFixed(1)} ${my.toFixed(1)} ${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`;
      }
    }
    return d;
  };

  // ---------- vẽ dần đường ----------
  // KHO.veDan(path, p): p 0..1 phần đường đã vẽ. Đo chiều dài một lần rồi giữ trong phần tử (giá trị tính, không phải trạng thái khung).
  K.veDan = function (path, p) {
    if (path._kho_dai == null) { try { path._kho_dai = path.getTotalLength(); } catch (e) { path._kho_dai = 1000; } }
    const L = path._kho_dai + 1;
    path.style.strokeDasharray = `${L} ${L}`;
    path.style.strokeDashoffset = (L * (1 - K.cl(p))).toFixed(2);
  };

  // ---------- đo chữ, xuống dòng ----------
  const CV = document.createElement('canvas').getContext('2d');
  K.doChu = (s, co = 32, dam = 600) => { CV.font = `${dam} ${co}px ${K.PHONG}`; return CV.measureText(s).width; };
  // Chia chữ thành các dòng không rộng quá rongToiDa (px). Trả về mảng dòng.
  K.xuongDong = function (s, rongToiDa, co = 32, dam = 600) {
    const tu = String(s).split(/\s+/).filter(Boolean), dong = [];
    let hien = '';
    for (const w of tu) {
      const thu = hien ? hien + ' ' + w : w;
      if (K.doChu(thu, co, dam) <= rongToiDa || !hien) hien = thu;
      else { dong.push(hien); hien = w; }
    }
    if (hien) dong.push(hien);
    return dong;
  };
  // Cỡ chữ lớn nhất (không quá coToiDa) để chuỗi vừa rongToiDa trên một dòng.
  K.coVua = (s, rongToiDa, coToiDa = 64, dam = 700, coToiThieu = 18) => {
    const w = K.doChu(s, coToiDa, dam);
    return w <= rongToiDa ? coToiDa : Math.max(coToiThieu, Math.floor(coToiDa * rongToiDa / w));
  };
  // Chữ SVG nhiều dòng: trả về <text> có các <tspan>, kèm .so_dong và .cao.
  K.chuNhieuDong = function (cha, s, o) {
    o = o || {};
    const co = o.co || 32, dam = o.dam || 600, gianDong = o.gian_dong || 1.25;
    const dong = K.xuongDong(s, o.rong || 600, co, dam);
    const e = K.chu(cha, '', Object.assign({}, o, { co, dam }));
    dong.forEach((d, i) => { const ts = K.svg('tspan', { x: o.x || 0, dy: i === 0 ? 0 : co * gianDong }, e); ts.textContent = d; });
    e.so_dong = dong.length; e.cao = co * gianDong * dong.length;
    return e;
  };

  // ---------- định dạng số kiểu Việt Nam ----------
  // KHO.so(1234567.5, 1) → "1.234.567,5"
  K.so = function (n, thapPhan = 0) {
    const [nguyen, le] = Math.abs(n).toFixed(thapPhan).split('.');
    return (n < 0 ? '−' : '') + nguyen.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (le ? ',' + le : '');
  };
  // KHO.soTien(500000000) → "500 triệu đồng"; KHO.soTien(1.2e9) → "1,2 tỷ đồng"
  K.soTien = function (n, donVi = 'đồng') {
    const a = Math.abs(n);
    if (a >= 1e9) return K.so(n / 1e9, n % 1e9 === 0 ? 0 : (n % 1e8 === 0 ? 1 : 2)) + ' tỷ ' + donVi;
    if (a >= 1e6) return K.so(n / 1e6, n % 1e6 === 0 ? 0 : 1) + ' triệu ' + donVi;
    return K.so(n) + ' ' + donVi;
  };

  // ---------- tự kiểm chữ trong một vùng (dùng ở trang xem mẫu và trang video) ----------
  // KHO.kiemChu(vungGoc, { rong: 1920, cao: 1080, tl: 1 }) → danh sách lỗi: tràn khung, chữ đè chữ, chữ tràn hộp [data-hop].
  // Phần tử có data-chong được phép chồng (chữ chồng cố ý).
  K.kiemChu = function (goc, o) {
    o = o || {};
    const W = o.rong || 1920, H = o.cao || 1080, tl = o.tl || 1;
    const gr = goc.getBoundingClientRect();
    const out = [], w = document.createTreeWalker(goc, NodeFilter.SHOW_TEXT);
    let n;
    const doMo = (el) => { let m = 1; for (let e = el; e && e !== goc.parentElement; e = e.parentElement) { const s = getComputedStyle(e); if (s.visibility === 'hidden' || s.display === 'none') return 0; m *= parseFloat(s.opacity || 1); } return m; };
    while ((n = w.nextNode())) {
      const chu = n.textContent.trim();
      if (!chu || !n.parentElement || doMo(n.parentElement) < 0.2) continue;
      const rg = document.createRange(); rg.selectNodeContents(n);
      const r = rg.getBoundingClientRect();
      if (r.width === 0) continue;
      out.push({ n, chu, b: { x: (r.left - gr.left) / tl, y: (r.top - gr.top) / tl, w: r.width / tl, h: r.height / tl }, chong: !!n.parentElement.closest('[data-chong]') });
    }
    const loi = [];
    for (const a of out) {
      if (a.b.x < -1 || a.b.y < -1 || a.b.x + a.b.w > W + 1 || a.b.y + a.b.h > H + 1) loi.push({ loai: 'tran_khung', chu: a.chu });
      const hop = a.n.parentElement.closest('[data-hop]');
      if (hop) {
        const r = hop.getBoundingClientRect();
        const hx = (r.left - gr.left) / tl, hy = (r.top - gr.top) / tl, hw = r.width / tl, hh = r.height / tl;
        if (a.b.x < hx - 3 || a.b.x + a.b.w > hx + hw + 3 || a.b.y < hy - 3 || a.b.y + a.b.h > hy + hh + 3) loi.push({ loai: 'tran_hop', chu: a.chu });
      }
    }
    for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
      const a = out[i], b = out[j];
      if (a.chong || b.chong || a.n.parentElement === b.n.parentElement) continue;
      const ya = a.b.y + a.b.h * 0.15, yb = b.b.y + b.b.h * 0.15, ha = a.b.h * 0.7, hb = b.b.h * 0.7;
      const ox = Math.min(a.b.x + a.b.w, b.b.x + b.b.w) - Math.max(a.b.x, b.b.x), oy = Math.min(ya + ha, yb + hb) - Math.max(ya, yb);
      if (ox > 4 && oy > 6) loi.push({ loai: 'chu_de_chu', a: a.chu, b: b.chu });
    }
    return loi;
  };
})();
