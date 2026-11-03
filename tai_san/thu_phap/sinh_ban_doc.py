#!/usr/bin/env python3
"""Sinh thu_vien_thu_phap.md từ thu_vien_thu_phap.json và kiểm dữ liệu.

Chạy: python3 -I tai_san/thu_phap/sinh_ban_doc.py   (từ thư mục gốc project Media)
Chỉ dùng thư viện chuẩn. Đường dẫn tính theo vị trí file này, không phụ thuộc thư mục đang đứng.
Thoát mã 1 nếu dữ liệu sai; khi đó không ghi file .md.

Kiểm:
- JSON hợp lệ, có đủ tám nhóm, đủ trường mỗi thủ pháp.
- Mã TP không trùng, tiền tố mã khớp nhóm.
- so_mau bằng số phần tử mau_nguon; mỗi thủ pháp có ít nhất một mẫu nguồn nằm trong
  muc_da_cham.json (100 mục) hoặc trong quet_chu_703.json (bản quét chữ); nguồn khác repo
  ghi tiền tố media: (video của Media) hoặc ngoai: (nguồn ngoài, ghi địa chỉ trong cach_lam).
- hop_chat_lieu và hop_cach_lam chỉ chứa mã có trong bang_ma.
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(HERE, "thu_vien_thu_phap.json")
MD_PATH = os.path.join(HERE, "thu_vien_thu_phap.md")
REPO = os.path.join(HERE, "..", "hoc_tu_repo", "awesome_opus55")

TRUONG = ["ma", "ten", "nhom", "cach_lam", "lam_bang", "chi_phi_may", "hop_chat_lieu",
          "hop_cach_lam", "loi_hay_gap", "mau_nguon", "so_mau", "tham_so_tu", "trang_thai"]
CHI_PHI = {"nhẹ", "vừa", "nặng"}
SLUG_RE = re.compile(r"[a-z0-9][a-z0-9_-]*-\d{5,6}")


def doc_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def tap_slug_hop_le():
    """Slug có trong 100 mục đã chấm hoặc xuất hiện trong bản quét chữ."""
    slugs = set()
    p100 = os.path.join(REPO, "muc_da_cham.json")
    pq = os.path.join(REPO, "quet_chu_703.json")
    if not (os.path.exists(p100) and os.path.exists(pq)):
        return None
    for m in doc_json(p100):
        slugs.add(m["slug"])
    q = doc_json(pq)
    for khoa, ds in q.items():
        if not isinstance(ds, list):
            continue
        for e in ds:
            for s in e.get("slug_vi_du", []):
                slugs.add(s)
            slugs.update(SLUG_RE.findall(e.get("mo_ta", "")))
            slugs.update(SLUG_RE.findall(e.get("trich_ngan", "")))
    return slugs


def kiem(d):
    loi = []
    nhom = {n["ma"]: n for n in d["nhom"]}
    if len(nhom) != 8:
        loi.append("cần đúng 8 nhóm, có %d" % len(nhom))
    ma_cl = set(d["bang_ma"]["chat_lieu"])
    ma_lm = set(d["bang_ma"]["cach_lam"])
    thay = set()
    slugs = tap_slug_hop_le()
    if slugs is None:
        print("CẢNH BÁO: không thấy muc_da_cham.json hoặc quet_chu_703.json, bỏ qua kiểm mẫu nguồn")
    for t in d["thu_phap"]:
        ma = t.get("ma", "?")
        for k in TRUONG:
            if k not in t:
                loi.append("%s thiếu trường %s" % (ma, k))
        if ma in thay:
            loi.append("mã trùng: %s" % ma)
        thay.add(ma)
        if not re.fullmatch(r"TP-(CD|CC|CH|SL|3D|HK|AT|TT)\d{2}", ma):
            loi.append("mã sai dạng: %s" % ma)
            continue
        if ma[:5] not in nhom:
            loi.append("%s: nhóm không có trong danh sách" % ma)
        elif nhom[ma[:5]]["ten"] != t.get("nhom"):
            loi.append("%s: tên nhóm '%s' không khớp '%s'" % (ma, t.get("nhom"), nhom[ma[:5]]["ten"]))
        if t.get("chi_phi_may") not in CHI_PHI:
            loi.append("%s: chi_phi_may không hợp lệ" % ma)
        if t.get("trang_thai") not in d["quy_uoc"]["trang_thai"]:
            loi.append("%s: trang_thai không hợp lệ" % ma)
        if t.get("tham_so_tu") not in d["quy_uoc"]["tham_so_tu"]:
            loi.append("%s: tham_so_tu không hợp lệ" % ma)
        if t.get("so_mau") != len(t.get("mau_nguon", [])):
            loi.append("%s: so_mau không bằng số mẫu nguồn" % ma)
        if not t.get("mau_nguon"):
            loi.append("%s: không có mẫu nguồn" % ma)
        elif slugs is not None:
            # slug của repo phải có trong dữ liệu nguồn; nguồn khác ghi tiền tố media: (video của Media)
            # hoặc ngoai: (nguồn ngoài repo, ghi địa chỉ trong cach_lam)
            ngoai = lambda s: s.startswith("media:") or s.startswith("ngoai:")
            if not any((s in slugs) or ngoai(s) for s in t["mau_nguon"]):
                loi.append("%s: không mẫu nguồn nào có trong 100 mục, bản quét chữ, hoặc tiền tố media:/ngoai:" % ma)
            for s in t["mau_nguon"]:
                if s not in slugs and not ngoai(s):
                    loi.append("%s: mẫu nguồn %s không có trong dữ liệu nguồn" % (ma, s))
        for c in t.get("hop_chat_lieu", []):
            if c not in ma_cl:
                loi.append("%s: mã chất liệu lạ %s" % (ma, c))
        for c in t.get("hop_cach_lam", []):
            if c not in ma_lm:
                loi.append("%s: mã cách làm lạ %s" % (ma, c))
        if len(t.get("cach_lam", "")) < 60:
            loi.append("%s: cach_lam quá ngắn" % ma)
    for n in d["nhom"]:
        dem = sum(1 for t in d["thu_phap"] if t["ma"].startswith(n["ma"]))
        if dem != n.get("so_thu_phap"):
            loi.append("%s: so_thu_phap ghi %s, thực tế %d" % (n["ma"], n.get("so_thu_phap"), dem))
        if dem == 0:
            loi.append("nhóm %s không có thủ pháp" % n["ma"])
    lop = d.get("lop_hoan_thien", {})
    ma_tp = thay
    ma_ht = set()
    muc_lop = list(lop.get("chung", []))
    for ds in lop.get("theo_nhom", {}).values():
        muc_lop += ds
    for m in muc_lop:
        if m["ma"] in ma_ht:
            loi.append("mã lớp hoàn thiện trùng: %s" % m["ma"])
        ma_ht.add(m["ma"])
        for tp in m.get("tp", []):
            if tp not in ma_tp:
                loi.append("%s trỏ tới mã TP không có: %s" % (m["ma"], tp))
    return loi


def cell(s):
    return str(s).replace("|", "/").replace("\n", " ")


def sinh_md(d):
    L = []
    L.append("# Thư viện thủ pháp và hiệu ứng (sinh tự động)\n")
    L.append("> File này sinh từ `thu_vien_thu_phap.json` bằng `python3 -I tai_san/thu_phap/sinh_ban_doc.py`. Không sửa tay: sửa JSON rồi chạy lại. Phiên bản dữ liệu %s, cập nhật %s. Tổng %d thủ pháp, tất cả ở trạng thái nháp. Cách dùng ở module `06_thu_phap_va_hieu_ung.md`.\n" % (d["phien_ban"], d["cap_nhat"], len(d["thu_phap"])))
    L.append("Ghi chú nguồn: " + d["_ghi_chu"] + "\n")
    q = d["quy_uoc"]
    L.append("Quy ước chi phí máy:\n")
    for k in ("nhẹ", "vừa", "nặng"):
        L.append("- **%s:** %s" % (k, q["chi_phi_may"][k]))
    L.append("")
    L.append("## Bảng mã chất liệu (CL) và cách làm (LM)\n")
    L.append("| Mã | Tên |")
    L.append("|---|---|")
    for k, v in d["bang_ma"]["chat_lieu"].items():
        L.append("| %s | %s |" % (k, v))
    for k, v in d["bang_ma"]["cach_lam"].items():
        L.append("| %s | %s |" % (k, v))
    L.append("")
    L.append("## Tám nhóm\n")
    L.append("| Nhóm | Tên | Số thủ pháp | Nội dung |")
    L.append("|---|---|---|---|")
    for n in d["nhom"]:
        L.append("| %s | %s | %d | %s |" % (n["ma"], n["ten"], n["so_thu_phap"], cell(n["mo_ta"])))
    L.append("")
    for n in d["nhom"]:
        L.append("## %s — %s\n" % (n["ma"], n["ten"]))
        L.append("| Mã | Tên | Làm bằng | Chi phí | Hợp chất liệu | Hợp cách làm | Số mẫu |")
        L.append("|---|---|---|---|---|---|---|")
        ds = [t for t in d["thu_phap"] if t["ma"].startswith(n["ma"])]
        for t in ds:
            cl = ", ".join(t["hop_chat_lieu"]) if len(t["hop_chat_lieu"]) < 16 else "mọi chất liệu"
            L.append("| %s | %s | %s | %s | %s | %s | %d |" % (t["ma"], cell(t["ten"]), ", ".join(t["lam_bang"]), t["chi_phi_may"], cl, ", ".join(t["hop_cach_lam"]) or "—", t["so_mau"]))
        L.append("")
        for t in ds:
            L.append("### %s %s\n" % (t["ma"], t["ten"]))
            L.append("- **Cách làm** (tham số từ: %s): %s" % (t["tham_so_tu"], t["cach_lam"]))
            L.append("- **Lỗi hay gặp:** %s" % t["loi_hay_gap"])
            L.append("- **Mẫu nguồn:** %s (trạng thái: %s)" % (", ".join("`%s`" % s for s in t["mau_nguon"]), t["trang_thai"]))
            L.append("")
    lop = d["lop_hoan_thien"]
    L.append("## Lớp hoàn thiện bắt buộc\n")
    L.append(lop["_ghi_chu"] + "\n")
    L.append("Nhóm chất liệu và mã chất liệu thuộc nhóm:\n")
    for k, v in lop["nhom_chat_lieu"].items():
        L.append("- %s: %s" % (k, ", ".join(v)))
    L.append("")

    def bang(ds):
        L.append("| Mã | Yêu cầu | Lý do | Mã TP | Cách kiểm |")
        L.append("|---|---|---|---|---|")
        for m in ds:
            L.append("| %s | %s | %s | %s | %s |" % (m["ma"], cell(m["yeu_cau"]), cell(m["ly_do"]), ", ".join(m["tp"]) or "—", cell(m["cach_kiem"])))
        L.append("")
    L.append("### Chung cho mọi video\n")
    bang(lop["chung"])
    ten_nhom = {"2d_phang": "2D phẳng", "net_ve": "Nét vẽ", "do_thi": "Đồ thị", "3d": "3D", "chu_dong": "Chữ động"}
    for k, ds in lop["theo_nhom"].items():
        L.append("### Riêng nhóm %s\n" % ten_nhom.get(k, k))
        bang(ds)
    return "\n".join(L) + "\n"


def main():
    d = doc_json(JSON_PATH)
    loi = kiem(d)
    if loi:
        print("LỖI dữ liệu (%d):" % len(loi))
        for x in loi:
            print(" -", x)
        sys.exit(1)
    md = sinh_md(d)
    with open(MD_PATH, "w", encoding="utf-8") as f:
        f.write(md)
    theo_nhom = {}
    for t in d["thu_phap"]:
        theo_nhom[t["ma"][:5]] = theo_nhom.get(t["ma"][:5], 0) + 1
    print("OK: %d thủ pháp, %s; đã ghi %s (%d byte)" % (len(d["thu_phap"]), ", ".join("%s %d" % kv for kv in theo_nhom.items()), os.path.relpath(MD_PATH), len(md.encode("utf-8"))))


if __name__ == "__main__":
    main()
