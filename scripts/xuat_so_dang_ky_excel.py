# -*- coding: utf-8 -*-
"""
Xuất sổ đăng ký mẫu prompt (câu lệnh mẫu) và kỹ năng (skill) ra file Excel.

NGUỒN SỰ THẬT là file markdown (định dạng văn bản thuần, dễ đọc/sửa tay):
    Media\18_so_dang_ky_prompt_skill.md

Script này CHỈ ĐỌC file markdown đó, tách 2 bảng ("Bảng 1 — Mẫu prompt" và
"Bảng 2 — Kỹ năng"), rồi ghi ra file Excel để Trung mở xem cho quen mắt:
    Media\tai_san\so_dang_ky_prompt_skill.xlsx

KHÔNG sửa gì trên file Excel — mọi thay đổi phải sửa ở file markdown nguồn
rồi chạy lại script này để làm mới bản Excel.

Cách chạy (từ đâu cũng được, script tự tính đường dẫn theo vị trí của chính nó):
    python xuat_so_dang_ky_excel.py
"""

import re
import sys
from datetime import datetime
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

# Windows đôi khi mở cửa sổ dòng lệnh ở bảng mã cp1252 (không có dấu tiếng
# Việt) — ép thông báo in ra dùng UTF-8 để không vỡ chữ hoặc lỗi khi in.
try:
    sys.stdout.reconfigure(encoding="utf-8")
except AttributeError:
    pass  # Python cũ không có reconfigure() thì bỏ qua, vẫn chạy được

# ---------------------------------------------------------------------------
# Đường dẫn: script nằm ở Media\scripts\, nguồn markdown ở Media\ (thư mục cha)
# ---------------------------------------------------------------------------
THU_MUC_SCRIPT = Path(__file__).resolve().parent
THU_MUC_MEDIA = THU_MUC_SCRIPT.parent
FILE_NGUON_MD = THU_MUC_MEDIA / "18_so_dang_ky_prompt_skill.md"
FILE_DICH_XLSX = THU_MUC_MEDIA / "tai_san" / "so_dang_ky_prompt_skill.xlsx"

TIEU_DE_BANG_1 = "Bảng 1"  # mẫu prompt
TIEU_DE_BANG_2 = "Bảng 2"  # kỹ năng


def doc_bang_markdown_theo_tieu_de(noi_dung_md: str, tieu_de_can_tim: str):
    """Tìm heading (dòng bắt đầu bằng '## ') chứa tieu_de_can_tim, rồi đọc
    bảng markdown (định dạng bảng dùng ký tự '|') ĐẦU TIÊN xuất hiện sau
    heading đó. Trả về (danh_sach_cot, danh_sach_dong)."""

    dong = noi_dung_md.splitlines()

    # 1. Tìm vị trí dòng heading khớp tiêu đề
    vi_tri_heading = None
    for i, d in enumerate(dong):
        if d.strip().startswith("## ") and tieu_de_can_tim in d:
            vi_tri_heading = i
            break
    if vi_tri_heading is None:
        raise ValueError(f"Không tìm thấy heading chứa '{tieu_de_can_tim}' trong file markdown.")

    # 2. Từ sau heading, tìm dòng đầu tiên bắt đầu bằng '|' (dòng tiêu đề bảng)
    vi_tri_bat_dau_bang = None
    for i in range(vi_tri_heading + 1, len(dong)):
        if dong[i].strip().startswith("|"):
            vi_tri_bat_dau_bang = i
            break
    if vi_tri_bat_dau_bang is None:
        raise ValueError(f"Không tìm thấy bảng markdown nào sau heading '{tieu_de_can_tim}'.")

    # 3. Đọc liên tục các dòng bắt đầu bằng '|' cho tới khi hết bảng (dòng trống hoặc hết '|')
    dong_bang = []
    for i in range(vi_tri_bat_dau_bang, len(dong)):
        d = dong[i].strip()
        if not d.startswith("|"):
            break
        dong_bang.append(d)

    if len(dong_bang) < 2:
        raise ValueError(f"Bảng markdown sau heading '{tieu_de_can_tim}' quá ngắn, không đọc được.")

    def tach_dong_thanh_cot(dong_bang_1_dong: str):
        # Bỏ ký tự '|' đầu/cuối rồi tách theo '|', bỏ khoảng trắng thừa từng ô
        noi_dung = dong_bang_1_dong.strip()
        if noi_dung.startswith("|"):
            noi_dung = noi_dung[1:]
        if noi_dung.endswith("|"):
            noi_dung = noi_dung[:-1]
        return [o.strip() for o in noi_dung.split("|")]

    cot_tieu_de = tach_dong_thanh_cot(dong_bang[0])

    # Dòng thứ 2 là dòng gạch phân cách kiểu |---|---|... — bỏ qua
    dong_du_lieu_tho = dong_bang[2:]

    danh_sach_dong = []
    for d in dong_du_lieu_tho:
        cac_o = tach_dong_thanh_cot(d)
        # Phòng trường hợp lệch số cột (hiếm) — bù ô trống hoặc cắt bớt cho khớp
        if len(cac_o) < len(cot_tieu_de):
            cac_o += [""] * (len(cot_tieu_de) - len(cac_o))
        elif len(cac_o) > len(cot_tieu_de):
            cac_o = cac_o[: len(cot_tieu_de)]
        danh_sach_dong.append(cac_o)

    return cot_tieu_de, danh_sach_dong


def ghi_mot_trang_tinh(workbook: Workbook, ten_trang: str, cot_tieu_de, danh_sach_dong, ngay_xuat: str):
    trang = workbook.create_sheet(title=ten_trang)

    MAU_NEN_TIEU_DE = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
    CHU_TIEU_DE = Font(bold=True, color="FFFFFF", size=11)
    CAN_LE_TIEU_DE = Alignment(horizontal="center", vertical="center", wrap_text=True)
    CAN_LE_O_THUONG = Alignment(horizontal="left", vertical="top", wrap_text=True)

    # Dòng 1: ghi ngày xuất
    trang.cell(row=1, column=1, value=f"Ngày xuất: {ngay_xuat}")
    trang.cell(row=1, column=1).font = Font(italic=True, size=9, color="666666")

    # Dòng 2: dòng tiêu đề cột
    DONG_TIEU_DE = 2
    for idx_cot, ten_cot in enumerate(cot_tieu_de, start=1):
        o = trang.cell(row=DONG_TIEU_DE, column=idx_cot, value=ten_cot)
        o.font = CHU_TIEU_DE
        o.fill = MAU_NEN_TIEU_DE
        o.alignment = CAN_LE_TIEU_DE

    # Dòng dữ liệu
    for idx_dong, mot_dong in enumerate(danh_sach_dong, start=DONG_TIEU_DE + 1):
        for idx_cot, gia_tri in enumerate(mot_dong, start=1):
            o = trang.cell(row=idx_dong, column=idx_cot, value=gia_tri)
            o.alignment = CAN_LE_O_THUONG

    # Cố định dòng tiêu đề khi cuộn (đóng băng mọi dòng từ trên DONG_TIEU_DE trở lên)
    trang.freeze_panes = trang.cell(row=DONG_TIEU_DE + 1, column=1).coordinate

    # Độ rộng cột tự giãn theo nội dung (giới hạn 60 ký tự để khỏi tràn màn hình,
    # vì đã bật xuống dòng trong ô — wrap_text — nên cột quá rộng không cần thiết)
    so_cot = len(cot_tieu_de)
    for idx_cot in range(1, so_cot + 1):
        do_dai_lon_nhat = len(str(cot_tieu_de[idx_cot - 1]))
        for mot_dong in danh_sach_dong:
            gia_tri = mot_dong[idx_cot - 1] if idx_cot - 1 < len(mot_dong) else ""
            # Vì có wrap_text, ước lượng độ rộng theo đoạn chữ dài nhất giữa các dấu xuống dòng tự nhiên
            do_dai_dong_nay = max((len(p) for p in str(gia_tri).split("\n")), default=0)
            do_dai_lon_nhat = max(do_dai_lon_nhat, do_dai_dong_nay)
        do_rong = min(max(do_dai_lon_nhat + 2, 12), 60)
        trang.column_dimensions[get_column_letter(idx_cot)].width = do_rong

    # Chiều cao dòng tiêu đề nhỉnh hơn cho dễ đọc
    trang.row_dimensions[DONG_TIEU_DE].height = 30

    return len(danh_sach_dong)


def main():
    if not FILE_NGUON_MD.exists():
        print(f"LỖI: không tìm thấy file nguồn markdown: {FILE_NGUON_MD}")
        sys.exit(1)

    noi_dung_md = FILE_NGUON_MD.read_text(encoding="utf-8")

    cot_1, dong_1 = doc_bang_markdown_theo_tieu_de(noi_dung_md, TIEU_DE_BANG_1)
    cot_2, dong_2 = doc_bang_markdown_theo_tieu_de(noi_dung_md, TIEU_DE_BANG_2)

    ngay_xuat = datetime.now().strftime("%Y-%m-%d %H:%M")

    workbook = Workbook()
    # Xóa trang tính mặc định rỗng do openpyxl tự tạo
    workbook.remove(workbook.active)

    so_dong_prompt = ghi_mot_trang_tinh(workbook, "Mau prompt", cot_1, dong_1, ngay_xuat)
    so_dong_skill = ghi_mot_trang_tinh(workbook, "Ky nang", cot_2, dong_2, ngay_xuat)

    FILE_DICH_XLSX.parent.mkdir(parents=True, exist_ok=True)
    workbook.save(FILE_DICH_XLSX)

    print("Đã xuất file Excel thành công:", FILE_DICH_XLSX)
    print(f"- Trang 'Mau prompt': {so_dong_prompt} dòng dữ liệu")
    print(f"- Trang 'Ky nang': {so_dong_skill} dòng dữ liệu")


if __name__ == "__main__":
    main()
