# ra_soat_lo.py — rà nhu cầu hình của một lô hoặc một loạt video trước khi dựng (skill ra-soat-dung-chung).
#
# Chỉ đọc, không sửa file nào. Với từng video trong danh sách mã, gom chữ từ:
#   1. mục "### Nxx — ..." của so_no_cong_viec.md;
#   2. file kịch bản (--kich-ban, nhận glob) có nhắc mã video đó nhiều nhất trong 40 dòng đầu;
# rồi đếm từ khoá của từng hình trong file từ điển (--tu-khoa, mặc định tai_san/kho_hinh_chung/tu_khoa/<lĩnh vực>.json).
# Đối chiếu thêm:
#   - danh mục kho tai_san/kho_hinh_chung/danh_muc.json: hình đã có trong kho chưa, trạng thái;
#   - mã đã dựng của các dự án trong loạt (--du-an; trang.html, canh/*.js, src/**/*.tsx): tên hàm khớp mẫu "dau_ma" của hình
#     (hình đang bị vẽ riêng ở dự án nào, để gom về kho thay vì vẽ lần nữa).
# Đề xuất: DUNG_CHUNG (>= nguong_lo video trong lô hiện tại, hoặc >= nguong_loat video cả danh sách),
#          GHI_CHO (2 video trở lên nhưng chưa tới ngưỡng: ghi danh mục, dựng khi lô sau cần), RIENG.
#
# Chạy ở gốc Media/:
#   python3 skills/ra-soat-dung-chung/scripts/ra_soat_lo.py --tu-khoa tai_san/kho_hinh_chung/tu_khoa/ngan_hang.json \
#       --ma N72-N135 --lo-hien-tai N81,N82,N72,N96,N97,N98,N99,N100,N108,N86,N87,N122 \
#       --kich-ban "san_pham/2026.10.28.*/tai_nguyen/kich_ban/*.md" --du-an "xuong_html/n*" --du-an xuong_dai/lai_13_thang \
#       --ra <file .md> [--json <file .json>]
import argparse, collections, glob, json, os, re

GOC = os.getcwd()
p = argparse.ArgumentParser()
p.add_argument("--tu-khoa", required=True, help="từ điển hình: {ten: {loai, mo_ta, tu_khoa: [...], dau_ma: [regex...]}}")
p.add_argument("--ma", required=True, help="danh sách mã: N72-N135 hoặc N81,N82,...")
p.add_argument("--lo-hien-tai", default="", help="mã của lô sắp dựng, phân cách bằng dấu phẩy")
p.add_argument("--kich-ban", action="append", default=[], help="glob file kịch bản")
p.add_argument("--du-an", action="append", default=[],
               help="thư mục dự án dựng của loạt (nhận glob); mặc định xuong_html/n<số>_* và xuong_dai/n<số>_* theo mã")
p.add_argument("--so-no", default="so_no_cong_viec.md")
p.add_argument("--nguong-lo", type=int, default=2)
p.add_argument("--nguong-loat", type=int, default=3)
p.add_argument("--ra", help="ghi bảng Markdown ra file (mặc định chỉ in)")
p.add_argument("--json", help="ghi ma trận JSON ra file")
a = p.parse_args()
doc = lambda f: open(f, encoding="utf-8", errors="ignore").read()


def tach_ma(s):
    ra = []
    for phan in filter(None, (x.strip().upper() for x in s.split(","))):
        m = re.fullmatch(r"N(\d+)-N?(\d+)", phan)
        ra += [f"N{i}" for i in range(int(m[1]), int(m[2]) + 1)] if m else [phan]
    return ra


DS_MA, LO = tach_ma(a.ma), set(tach_ma(a.lo_hien_tai))
TU = json.load(open(a.tu_khoa, encoding="utf-8"))
TU = {k: v for k, v in TU.items() if not k.startswith("_")}

# 1. Chữ của từng video: mục sổ nợ + kịch bản
chu = collections.defaultdict(str)
so_no = doc(a.so_no)
for m in re.finditer(r"^### (N\d+) — .*?(?=^### |^## |\Z)", so_no, re.M | re.S):
    if m[1] in DS_MA:
        chu[m[1]] += m[0]
nguon_kb = collections.defaultdict(list)
# Gán theo thư mục: mọi file trong một thư mục sản phẩm thuộc mã đứng đầu 6 dòng đầu của file nào nhắc mã trước;
# kịch bản hay trỏ sang video kề bên nên không đếm mã nhắc nhiều nhất. Bỏ file kế hoạch lô, loạt (nhắc mọi mã).
theo_thu_muc = collections.defaultdict(list)
for g in a.kich_ban:
    for f in sorted(glob.glob(g)):
        if "ke_hoach" not in os.path.basename(f):
            theo_thu_muc[os.path.dirname(f)].append(f)
for thu_muc, ds in theo_thu_muc.items():
    ma = None
    for f in sorted(ds, key=lambda x: (".tien_do" in x or "nguon_kiem_chung" in x, x)):
        tim = [x for x in re.findall(r"\bN\d{2,3}\b", "".join(doc(f).splitlines(True)[:6])) if x in DS_MA]
        if tim:
            ma = tim[0]
            break
    if ma:
        for f in ds:
            chu[ma] += "\n" + doc(f)
            nguon_kb[ma].append(os.path.relpath(f, GOC))

# 2. Đếm từ khoá
can = collections.defaultdict(dict)  # hình -> {mã: số lần nhắc}
for ten, v in TU.items():
    mau = [re.compile(r"(?<!\w)" + re.escape(k.lower()) + r"(?!\w)") for k in v.get("tu_khoa", [])]
    for ma in DS_MA:
        n = sum(len(m.findall(chu[ma].lower())) for m in mau)
        if n:
            can[ten][ma] = n

# 3. Kho và mã đã dựng
dm_f = os.path.join(GOC, "tai_san/kho_hinh_chung/danh_muc.json")
kho = {x["ten"]: x for x in json.load(open(dm_f, encoding="utf-8")).get("hinh", [])} if os.path.exists(dm_f) else {}
du_an = [d for g in a.du_an for d in glob.glob(g)] or \
    [d for ma in DS_MA for g in (f"xuong_html/{ma.lower()}_*", f"xuong_dai/{ma.lower()}_*") for d in glob.glob(g)]
file_ma = [f for d in du_an for f in glob.glob(f"{d}/trang.html") + glob.glob(f"{d}/canh/*.js") +
           glob.glob(f"{d}/src/**/*.tsx", recursive=True)]
noi_ma = {f: doc(f) for f in file_ma if "node_modules" not in f and ".bak" not in f}
da_ve = collections.defaultdict(set)
for ten, v in TU.items():
    for rx in v.get("dau_ma", []):
        r = re.compile(rx)
        for f, s in noi_ma.items():
            if r.search(s):
                da_ve[ten].add(f.split("/")[1])

# 4. Bảng
hang = []
for ten, v in TU.items():
    vids = sorted(can.get(ten, {}), key=lambda x: int(x[1:]))
    vlo = [x for x in vids if x in LO]
    if len(vlo) >= a.nguong_lo or len(vids) >= a.nguong_loat:
        de_xuat = "DUNG_CHUNG"
    elif len(vids) >= 2:
        de_xuat = "GHI_CHO"
    else:
        de_xuat = "RIENG"
    k = kho.get(ten)
    hang.append(dict(ten=ten, loai=v.get("loai", ""), lo=len(vlo), loat=len(vids), video_lo=vlo, video=vids,
                     kho=(k or {}).get("trang_thai", "chưa có"), da_ve=sorted(da_ve.get(ten, [])), de_xuat=de_xuat))
hang.sort(key=lambda h: (-h["lo"], -h["loat"], h["ten"]))

dong = [f"# Rà nhu cầu hình: {len(DS_MA)} video, lô hiện tại {len(LO)} video", "",
        f"Từ điển `{a.tu_khoa}`; ngưỡng dùng chung: >= {a.nguong_lo} video trong lô hoặc >= {a.nguong_loat} video cả danh sách.",
        f"Video không có chữ để rà (thiếu mục sổ nợ và kịch bản): {', '.join(m for m in DS_MA if not chu[m]) or 'không'}.", "",
        "| Hình | Loại | Lô | Cả danh sách | Video trong lô | Trong kho | Đã vẽ riêng ở | Đề xuất |",
        "|---|---|---|---|---|---|---|---|"]
for h in hang:
    if h["loat"] == 0 and not h["da_ve"]:
        continue
    dong.append(f"| {h['ten']} | {h['loai']} | {h['lo']} | {h['loat']} | {', '.join(h['video_lo'])} | {h['kho']} | "
                f"{', '.join(h['da_ve'])} | {h['de_xuat']} |")
khong = [h["ten"] for h in hang if h["loat"] == 0 and not h["da_ve"]]
if khong:
    dong += ["", "Từ điển có nhưng không video nào nhắc: " + ", ".join(khong)]
dong += ["", "Kịch bản đã đọc: " + ("; ".join(f"{m}: {', '.join(v)}" for m, v in sorted(nguon_kb.items())) or "không có")]
bang = "\n".join(dong) + "\n"
print(bang)
if a.ra:
    open(a.ra, "w", encoding="utf-8").write(bang)
if a.json:
    json.dump({"hinh": hang, "kich_ban": nguon_kb}, open(a.json, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
