# chep_kho.py — chép tài sản từ kho hình dùng chung vào một dự án video HTML (skill ra-soat-dung-chung).
#
# Chép file của từng hình trong tai_san/kho_hinh_chung/danh_muc.json vào <dự án>/thu_vien/kho/, kèm file phụ thuộc
# (trường "can" của hình), rồi ghi <dự án>/thu_vien/kho/_phien_ban.json: tên hình, phiên bản, băm nội dung, ngày chép.
# Chép chứ không trỏ liên kết: bản trong dự án đứng yên khi kho đổi sau này, nên kết xuất lại một chương ở pha máy
# vẫn ra đúng hình đã duyệt. Muốn lấy bản mới của kho thì chạy lại lệnh với --cap-nhat.
#
# Chạy ở gốc Media/:
#   python3 skills/ra-soat-dung-chung/scripts/chep_kho.py xuong_html/n98_tin_chap toa_nha_ngan_hang nguoi_vay khung_trich_luat
#   python3 skills/ra-soat-dung-chung/scripts/chep_kho.py xuong_html/n98_tin_chap --kiem     (so bản trong dự án với kho)
import argparse, datetime, hashlib, json, os, shutil, sys

KHO = "tai_san/kho_hinh_chung"
p = argparse.ArgumentParser()
p.add_argument("du_an")
p.add_argument("hinh", nargs="*")
p.add_argument("--cap-nhat", action="store_true", help="ghi đè bản đã chép bằng bản mới của kho")
p.add_argument("--kiem", action="store_true", help="chỉ so bản trong dự án với kho, không chép")
a = p.parse_args()

dm = {x["ten"]: x for x in json.load(open(f"{KHO}/danh_muc.json", encoding="utf-8"))["hinh"]}
dich = os.path.join(a.du_an, "thu_vien", "kho")
pb_f = os.path.join(dich, "_phien_ban.json")
pb = json.load(open(pb_f, encoding="utf-8")) if os.path.exists(pb_f) else {}
bam = lambda f: hashlib.sha1(open(f, "rb").read()).hexdigest()[:10]

if a.kiem:
    for ten, v in sorted(pb.items()):
        moi = dm.get(ten, {}).get("phien_ban")
        print(f"{ten}: dự án {v['phien_ban']} · kho {moi}" + ("" if moi == v["phien_ban"] else "  <- kho đã có bản mới"))
    sys.exit(0)

# gom phụ thuộc
can, hang_doi = [], list(a.hinh)
while hang_doi:
    ten = hang_doi.pop(0)
    if ten not in dm:
        sys.exit(f"Không có hình '{ten}' trong {KHO}/danh_muc.json")
    if ten in can:
        continue
    can.append(ten)
    hang_doi += dm[ten].get("can", [])

os.makedirs(dich, exist_ok=True)
for ten in can:
    h = dm[ten]
    if h.get("trang_thai") not in ("da_duyet", "dang_dung"):
        print(f"CẢNH BÁO: {ten} đang ở trạng thái '{h.get('trang_thai')}', chưa duyệt")
    if ten in pb and not a.cap_nhat:
        print(f"bỏ qua {ten}: đã chép bản {pb[ten]['phien_ban']} (thêm --cap-nhat để lấy bản {h['phien_ban']})")
        continue
    for f in h["file"]:
        nguon = os.path.join(KHO, f)
        os.makedirs(os.path.dirname(os.path.join(dich, f)), exist_ok=True)
        shutil.copy2(nguon, os.path.join(dich, f))
    pb[ten] = {"phien_ban": h["phien_ban"], "bam": [bam(os.path.join(KHO, f)) for f in h["file"]],
               "ngay": datetime.date.today().isoformat()}
    print(f"đã chép {ten} {h['phien_ban']}: {', '.join(h['file'])}")
json.dump(pb, open(pb_f, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\nThêm vào trang.html, theo thứ tự này, sau thư viện gsap/three:")
for ten in reversed(can):
    for f in dm[ten]["file"]:
        if f.endswith(".js"):
            print(f'<script src="thu_vien/kho/{f}"></script>')
        elif f.endswith(".css"):
            print(f'<link rel="stylesheet" href="thu_vien/kho/{f}">')
