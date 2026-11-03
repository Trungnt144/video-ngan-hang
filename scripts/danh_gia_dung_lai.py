# danh_gia_dung_lai.py — tự đánh giá khối 3D dùng lại, chạy đầu mỗi lô video (sổ nợ N58 đợt 3, Trung chốt 28/10/2026).
#
# Chỉ đọc, không sửa file nào. Gộp ba nguồn rồi xếp hạng từng khối (component React xuất ra trong xuong_dai/*/src):
#   1. Đã dùng: bao nhiêu dự án có định nghĩa khối đó, bao nhiêu bản khác nhau (băm nội dung file định nghĩa),
#      khối có trong tai_san/khoi_dung_san/danh_muc_mo_hinh_3d.md không và file bản tốt nhất là file nào.
#   2. Sắp cần: trường "khoi" trong các chương của file .chuong.json ở video chưa có bản dựng (pha 1 ghi, ví dụ
#      "khoi": ["TuaBin", "CanCau"]), cộng tên khối hoặc từ khoá (tai_san/khoi_dung_san/tu_khoa_khoi.json) nhắc tới
#      trong kế hoạch lô (--ke-hoach) và trong các mục "Đang chờ" của so_no_cong_viec.md.
#   3. Giờ máy: bình quân giây kết xuất mỗi video theo du_lieu/hang_doi_ket_xuat/nhat_ky.tsv.
# Đề xuất cho từng khối: gom vào kho khối chung (nhiều bản lệch), dựng mới một lần rồi chép (cần ở nhiều video mà
# chưa có), cân nhắc kết xuất sẵn theo bảng màu (cảnh nền dùng nhiều), hoặc giữ cách chép mã như hiện nay.
#
# Chạy ở gốc Media/:
#   python3 scripts/danh_gia_dung_lai.py [--ke-hoach <file kế hoạch lô .md> ...] [--top 25] [--ra <file .md>]
import argparse, collections, glob, hashlib, json, os, re

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CANH_NEN = {"MatDat", "KhoiBien", "MoiTruong", "MatTroi", "NuocSong", "Troi", "Bien"}  # không gắn với nội dung chương

p = argparse.ArgumentParser()
p.add_argument("--ke-hoach", action="append", default=[], help="file kế hoạch lô (đọc chữ để tìm khối được nhắc)")
p.add_argument("--top", type=int, default=25)
p.add_argument("--ra", help="ghi bảng ra file .md (mặc định chỉ in)")
a = p.parse_args()
doc = lambda f: open(f, encoding="utf-8").read()

# 1. Khối đã có trong mã các video ngang
dinh_nghia = collections.defaultdict(dict)  # tên khối -> {dự án: băm file}
for f in glob.glob(os.path.join(GOC, "xuong_dai/*/src/**/*.tsx"), recursive=True):
    if "node_modules" in f:
        continue
    noi_dung = doc(f)
    du_an = os.path.relpath(f, os.path.join(GOC, "xuong_dai")).split(os.sep)[0]
    bam = hashlib.md5(noi_dung.encode()).hexdigest()[:8]
    # chỉ tên khối kiểu TuaBin, CanCau; bỏ hằng viết hoa (MAU, CL) và khung chung của dự án (Video, Root)
    for ten in re.findall(r"export (?:const|function) ([A-Z][a-z][A-Za-z0-9]*)", noi_dung):
        if ten not in ("Video", "Root"):
            dinh_nghia[ten][du_an] = bam

danh_muc = {}  # tên khối -> (mô tả, file bản tốt nhất); chỉ đọc mục 2 "Bảng chính" của danh mục
bang_chinh = doc(os.path.join(GOC, "tai_san/khoi_dung_san/danh_muc_mo_hinh_3d.md")).split("## 2.", 1)[-1].split("\n## 3.", 1)[0]
dong_bang = [[x.strip() for x in d.split("|")] for d in bang_chinh.splitlines()]
dong_bang = [o for o in dong_bang if len(o) >= 5 and o[2].startswith("`xuong_dai/")]
for chi_dau in (True, False):  # ưu tiên dòng mà khối là tên đầu tiên của cột component
    for o in dong_bang:
        tep = re.match(r"`([^`]+)`", o[2]).group(1)
        ds_ten = re.findall(r"`([A-Z][a-z][A-Za-z0-9]*)", o[3])
        for ten in ds_ten[:1] if chi_dau else ds_ten:
            danh_muc.setdefault(ten, (o[1].split(":")[0].split(",")[0][:60], tep))

tu_khoa = {k: v for k, v in json.load(open(os.path.join(GOC, "tai_san/khoi_dung_san/tu_khoa_khoi.json"), encoding="utf-8")).items() if not k.startswith("_")}

# 2. Nhu cầu sắp tới
can = collections.defaultdict(set)  # tên khối -> {nơi cần}
for f in glob.glob(os.path.join(GOC, "san_pham/*/tai_nguyen/kich_ban/*.chuong.json")):
    thu_muc = f.split(os.sep)[-4]
    # video ngoài cùng thư mục, kể cả bản đã đổi tên theo tiêu đề trên kênh (29/10/2026)
    da_dung = glob.glob(os.path.join(GOC, "san_pham", thu_muc, "*.mp4"))
    if da_dung:
        continue
    try:
        d = json.load(open(f, encoding="utf-8"))
    except Exception:
        continue
    for c in (d.get("chuong", []) if isinstance(d, dict) else d):
        for ten in c.get("khoi", []) if isinstance(c, dict) else []:
            can[ten].add(thu_muc)

def tim_trong_chu(chu, nhan):
    thuong = chu.lower()
    for ten in set(dinh_nghia) | set(tu_khoa):
        if re.search(r"\b%s\b" % re.escape(ten), chu) or any(k in thuong for k in tu_khoa.get(ten, [])):
            can[ten].add(nhan)

for f in a.ke_hoach:
    chu = doc(f)
    # mỗi dòng bảng của kế hoạch là một video: lấy mã N ở đầu dòng làm nhãn
    for dong in chu.splitlines():
        m = re.match(r"\|\s*\d+\s*\|\s*(N\d+)\s*\|", dong)
        if m:
            tim_trong_chu(dong, m.group(1))
so_no = doc(os.path.join(GOC, "so_no_cong_viec.md"))
dang_cho = so_no.split("## Đang chờ", 1)[-1].split("## Đã đóng", 1)[0]
for muc in re.split(r"\n(?=### )", dang_cho):
    m = re.match(r"### (N[\d–-]+) — (?:Video|Chuỗi)", muc)  # chỉ mục là video hoặc chuỗi video, bỏ mục việc khác
    if m:
        tim_trong_chu(muc, "sổ nợ " + m.group(1))

# 3. Giờ máy bình quân mỗi video
giay = collections.Counter()
try:
    for dong in open(os.path.join(GOC, "du_lieu/hang_doi_ket_xuat/nhat_ky.tsv"), encoding="utf-8"):
        o = dong.rstrip("\n").split("\t")
        if len(o) >= 4 and re.fullmatch(r"n\d+", o[0]):
            giay[o[0]] += int(o[3] or 0)
except FileNotFoundError:
    pass

# Xếp hạng và đề xuất. Các khối cùng một file bản tốt nhất (ví dụ khối nền Hop, Tru, MuiTen trong CoBan.tsx)
# gộp thành một dòng.
nhom = collections.defaultdict(list)
for ten in set(dinh_nghia) | set(can):
    nhom[danh_muc[ten][1] if ten in danh_muc else ten].append(ten)
hang = []
for khoa, ds_ten in nhom.items():
    ds_ten.sort(key=lambda t: (-len(can.get(t, ())), -len(dinh_nghia.get(t, {}))))
    ten = ds_ten[0]
    du_an = dinh_nghia.get(ten, {})
    so_ban = len(set(du_an.values()))
    noi_can = set().union(*(can.get(t, set()) for t in ds_ten))
    nhu_cau = len(noi_can)
    if not nhu_cau and (len(du_an) < 5 or ten not in danh_muc and ten not in tu_khoa):
        continue  # khối nhỏ dùng chung (hình hộp, mũi tên) hoặc chưa ai cần: bỏ cho bảng gọn
    if not du_an:
        de_xuat = "Chưa có: dựng mới một lần ở video đầu tiên cần, các video sau chép, rồi bổ sung danh mục"
    elif ten in CANH_NEN and nhu_cau >= 3:
        de_xuat = "Cân nhắc kết xuất sẵn theo từng bảng màu (cảnh nền, không đổi theo nội dung chương)"
    elif so_ban >= 3 and len(du_an) >= 5:
        de_xuat = f"Gom về kho khối chung có số phiên bản ({so_ban} bản lệch nhau)"
    else:
        de_xuat = "Giữ cách chép mã từ file bản tốt nhất"
    diem = nhu_cau * 3 + so_ban + len(du_an) / 5
    nhan = ten + (f" (cùng file: {', '.join(ds_ten[1:4])}{'…' if len(ds_ten) > 4 else ''})" if len(ds_ten) > 1 else "")
    hang.append((diem, ten, nhan, len(du_an), so_ban, nhu_cau, sorted(noi_can), de_xuat))
hang.sort(reverse=True)

ra = ["# Tự đánh giá khối dùng lại", ""]
if giay:
    ra.append(f"Giờ máy bình quân mỗi video theo nhật ký hàng đợi: {sum(giay.values()) / len(giay) / 60:.1f} phút ({len(giay)} video).")
ra.append(f"Nguồn nhu cầu: {len(a.ke_hoach)} kế hoạch lô, mục Đang chờ của sổ nợ, trường \"khoi\" trong file chia chương của video chưa dựng.")
ra += ["", "| Khối | Mô tả, file bản tốt nhất (danh mục) | Số dự án có | Số bản khác nhau | Video sắp cần | Đề xuất |", "|---|---|---|---|---|---|"]
for _, ten, nhan, n_du_an, so_ban, nhu_cau, noi, de_xuat in hang[: a.top]:
    mo_ta, tep = danh_muc.get(ten, ("chưa có trong danh mục", ""))
    noi_can = ", ".join(noi[:6]) + (f" (+{len(noi) - 6})" if len(noi) > 6 else "")
    ra.append(f"| `{nhan}` | {mo_ta}{f' · `{tep}`' if tep else ''} | {n_du_an} | {so_ban} | {nhu_cau}{f': {noi_can}' if noi_can else ''} | {de_xuat} |")
chu = "\n".join(ra) + "\n"
print(chu)
if a.ra:
    open(a.ra, "w", encoding="utf-8").write(chu)
