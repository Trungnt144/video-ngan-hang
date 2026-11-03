# -*- coding: utf-8 -*-
"""
Gợi ý tổ hợp phong cách dựng cho cửa chọn bước 4 (Trung chốt 27/10/2026).

Từ video mới, phong cách dựng không còn là một mã D gộp mà là năm trục chọn độc lập:
    CL  chất liệu hình (kèm nhịp hình và kiểu phụ đề)
    CT  mức chi tiết (CT1 sơ đồ, CT2 mô hình rút gọn, CT3 chi tiết kỹ thuật)
    BC  bố cục khung hình (khổ dọc hay ngang do giai đoạn quyết, là đầu vào)
    MAU tông màu và phối màu (gộp tông của thẻ D cũ với bảng M0–M8 của D-09b, thêm 12 tông học từ repo mẫu 27/10/2026)
    NH  nhạc nền (Claude tự chọn, không hỏi Trung), đọc thẳng từ sổ nhạc tai_san/nhac_nen/so_nhac.json

Ngoài năm trục có thêm khái niệm cách làm (mã LM-01…LM-07, khoá cach_lam trong he_truc_dung.json): mỗi chất liệu
ghi các cách làm ra được nó, cách nào đã có mã dựng sẵn. Mỗi tổ hợp in thêm cách làm đề xuất (cách có mã dựng sẵn
và nhanh nhất cho khổ đó), thời gian máy theo cách làm, và cờ "chưa có mã dựng" cùng luật trừ 2 điểm như trước.
Giá trị mới học từ repo mẫu (trường gia_tri_moi: CL-09…CL-16, BC-08…BC-13, MAU-20…MAU-31) CHƯA CHẤM ĐIỂM
(Trung chốt 27/10/2026): tổ hợp chứa một giá trị mới không vào bảng xếp hạng và không bị trừ điểm nào; script in
ở mục riêng "Lựa chọn mới, chưa chấm điểm" mỗi chất liệu mới một mục (cách làm, thời gian máy, mẫu nguồn, một bố cục,
hai màu, kèm goi_y_dung_khi và khong_hop_khi) để Claude tự đánh giá theo nội dung và tính chất video.
Luật loại trừ cứng (khổ, danh sách đi kèm, luat_loai_tru) vẫn áp cho lựa chọn mới.

Script đọc:
    tai_san/so_tay_gu/he_truc_dung.json   lựa chọn từng trục, luật loại trừ, luật cộng điểm
    tai_san/so_tay_gu/00_muc_luc.md       Bảng 3 (KB × D): độ hợp của lối viết với thẻ D gốc
    tai_san/nhac_nen/so_nhac.json         78 bài nhạc kèm nhóm tính chất, tiết tấu, độ dài, chỉ số rè
    dòng "Biến tấu" của 3 kịch bản gần nhất cùng khổ trong san_pham/*/tai_nguyen/kich_ban/

rồi sinh mọi tổ hợp, loại tổ hợp không hợp, chấm điểm, in 2–3 tổ hợp khác nhau ít nhất hai trục.

Cách chạy (tại gốc Media):
    python3 scripts/goi_y_to_hop_dung.py --kho ngang --kb KB-05 --chu-de may_moc --linh-vuc nang_luong --do-dai 120
    python3 scripts/goi_y_to_hop_dung.py --kho doc --kb KB-01 --chu-de so_lieu_danh_sach
    python3 scripts/goi_y_to_hop_dung.py --kho ngang --chu-de dinh_luong --cach-lam LM-03   chỉ chất liệu làm được bằng LM-03
    python3 scripts/goi_y_to_hop_dung.py --liet-ke --kho ngang      đếm tổ hợp hợp lệ
    python3 scripts/goi_y_to_hop_dung.py --xuat-md                  sinh lại he_truc_dung.md để đọc
    python3 scripts/goi_y_to_hop_dung.py --kiem                     kiểm dữ liệu he_truc_dung.json (mã tham chiếu, ma_dung khớp cach_lam)

Cách dùng bảng này trong quy trình: 04_he_truc_dung.md (cửa chọn 2) và 05_cach_lam.md (bảy cách làm).
"""

import argparse
import itertools
import json
import re
import sys
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent
FILE_TRUC = GOC / "tai_san/so_tay_gu/he_truc_dung.json"
FILE_MUC_LUC = GOC / "tai_san/so_tay_gu/00_muc_luc.md"
FILE_MD = GOC / "tai_san/so_tay_gu/he_truc_dung.md"

DIEM_BANG3 = {"Rất hợp": 3, "Hợp": 2, "Cân nhắc": 1, "Không nên": None}
TEN_KHO = {"doc": "dọc 1080×1920", "ngang": "ngang 1920×1080"}
TEN_MUC_LM = {
    "san": "có mã dựng sẵn cho chất liệu này",
    "cong_cu": "chưa có mã riêng cho chất liệu này, công cụ chung có",
    "chua": "chưa có cả công cụ",
}
THU_TU_MUC = {"san": 0, "cong_cu": 1, "chua": 2}


def doc_truc():
    return json.loads(FILE_TRUC.read_text(encoding="utf-8"))


def doc_bang3():
    """Trả về {KB: {D: (mức, câu giải thích)}} từ Bảng 3 của mục lục."""
    bang = {}
    cot = []
    trong_bang3 = False
    for dong in FILE_MUC_LUC.read_text(encoding="utf-8").splitlines():
        if dong.startswith("## Bảng 3"):
            trong_bang3 = True
            continue
        if trong_bang3 and dong.startswith("## "):
            break
        if not trong_bang3 or not dong.startswith("|"):
            continue
        o = [x.strip() for x in dong.strip().strip("|").split("|")]
        if o[0].startswith("Kịch bản"):
            cot = [(re.search(r"D-\d+b?", x) or [None])[0] for x in o[1:]]
            continue
        kb = re.search(r"KB-\d+", o[0])
        if not kb or not cot:
            continue
        hang = {}
        for d, chu in zip(cot, o[1:]):
            m = re.match(r"\*\*(Rất hợp|Hợp|Cân nhắc|Không nên)", chu)
            if d and m:
                hang[d] = (m.group(1), re.sub(r"\*\*", "", chu)[:220])
        bang[kb.group(0)] = hang
    return bang


def theo_ma(ds):
    return {x["ma"]: x for x in ds}


# ---------- cách làm (LM) ----------

def xep_hang_toc_do(lm):
    """Điểm xếp hạng tốc độ của một cách làm: trung bình khoảng thời gian máy; chưa đo thì xếp cuối."""
    t = lm["thoi_gian_may"]
    if t.get("min") is None or t.get("max") is None:
        return 1e6
    return (t["min"] + t["max"]) / 2


def cac_cach_lam(truc, cl, kho, bat_buoc=None):
    """Các cách làm ra được chất liệu cl ở khổ kho: [(lm, muc, ghi_chu)], xếp có mã dựng sẵn trước,
    rồi nhanh nhất. bat_buoc: mã LM, chỉ giữ cách làm đó."""
    lms = theo_ma(truc["cach_lam"])
    kq = []
    for e in cl.get("cach_lam", []):
        lm = lms.get(e["ma"])
        if not lm or kho not in lm["kho"]:
            continue
        if bat_buoc and e["ma"] != bat_buoc:
            continue
        kq.append((lm, e["muc"], e.get("ghi_chu", "")))
    kq.sort(key=lambda x: (THU_TU_MUC[x[1]], xep_hang_toc_do(x[0]), x[0]["ma"]))
    return kq


def so_vn(x):
    return ("%g" % x).replace(".", ",")


def khoang_lm(t):
    """Khoảng thời gian máy của một cách làm, ví dụ '1,2–1,5'; hai đầu bằng nhau thì chỉ một số."""
    return so_vn(t["min"]) if t["min"] == t["max"] else "%s–%s" % (so_vn(t["min"]), so_vn(t["max"]))


def thoi_gian_ngan(lm, do_dai):
    """Thời gian máy theo cách làm, không kèm nguồn; có độ dài video thì kèm ước tính cho độ dài đó."""
    t = lm["thoi_gian_may"]
    if t.get("min") is None or t.get("max") is None:
        return t["ghi"]
    chu = "%s %s%s" % (khoang_lm(t), t["don_vi"], " (ước)" if t.get("uoc") else "")
    if do_dai:
        lo, hi = t["min"] * do_dai, t["max"] * do_dai
        if hi < 300:
            chu += "; với %d giây video: ước %d–%d giây máy" % (do_dai, round(lo), round(hi))
        else:
            chu += "; với %d giây video: ước %d–%d phút máy" % (do_dai, round(lo / 60), round(hi / 60))
    return chu


def dong_thoi_gian_lm(lm, do_dai):
    """Một dòng thời gian máy theo cách làm kèm nguồn đo."""
    t = lm["thoi_gian_may"]
    if t.get("min") is None or t.get("max") is None:
        return "%s (%s)" % (t["ghi"], t["nguon"])
    return "%s. Nguồn: %s" % (thoi_gian_ngan(lm, do_dai), t["nguon"])


def kiem_du_lieu(truc, bang3=None):
    """Kiểm dữ liệu he_truc_dung.json. Trả danh sách lỗi (rỗng là đạt)."""
    loi = []
    cl, ct, bc, mau = (theo_ma(truc[k]) for k in ("chat_lieu", "muc_chi_tiet", "bo_cuc", "mau"))
    lm = theo_ma(truc["cach_lam"])
    ma_d = {d for h in (bang3 or {}).values() for d in h}
    for x in truc["chat_lieu"]:
        m = x["ma"]
        for k in x["kho"]:
            if k not in TEN_KHO:
                loi.append("%s: khổ '%s' không có" % (m, k))
        for c in x["muc_chi_tiet"]:
            if c not in ct:
                loi.append("%s: mức chi tiết %s không có" % (m, c))
            if c not in x["thoi_gian"]:
                loi.append("%s: thiếu thoi_gian cho %s" % (m, c))
        for c in x["chu_de"]:
            if c not in truc["loai_chu_de"]:
                loi.append("%s: loại chủ đề %s không có" % (m, c))
        for d in x["d_nguon"]:
            if ma_d and d not in ma_d:
                loi.append("%s: thẻ D %s không có ở Bảng 3" % (m, d))
        if x.get("trang_thai", "duyet") not in ("duyet", "nhap"):
            loi.append("%s: trang_thai '%s' không có (duyet hoặc nhap)" % (m, x["trang_thai"]))
        if x.get("gia_tri_moi") and not (x.get("goi_y_dung_khi") and x.get("khong_hop_khi")):
            loi.append("%s: giá trị mới thiếu goi_y_dung_khi hoặc khong_hop_khi (Claude cần đọc để đánh giá, vì giá trị mới không chấm điểm)" % m)
        if not x.get("cach_lam"):
            loi.append("%s: thiếu cach_lam" % m)
            continue
        for e in x["cach_lam"]:
            if e["ma"] not in lm:
                loi.append("%s: cách làm %s không có" % (m, e["ma"]))
            if e["muc"] not in THU_TU_MUC:
                loi.append("%s: mức '%s' của cách làm %s không có" % (m, e["muc"], e["ma"]))
        co_san = any(e["muc"] == "san" for e in x["cach_lam"])
        if co_san != (x["ma_dung"] == "co"):
            loi.append("%s: ma_dung=%s không khớp cach_lam (có cách ở mức san: %s)" % (m, x["ma_dung"], co_san))
        for k in x["kho"]:
            if not any(k in lm[e["ma"]]["kho"] for e in x["cach_lam"] if e["ma"] in lm):
                loi.append("%s: không cách làm nào làm được khổ %s" % (m, k))
            if not any(k in b["kho"] and m in b["chat_lieu"] for b in truc["bo_cuc"]):
                loi.append("%s: khổ %s chưa có bố cục nào đi kèm" % (m, k))
        if not any(m in u["chat_lieu"] for u in truc["mau"]):
            loi.append("%s: chưa có tông màu nào đi kèm" % m)
    for x in truc["bo_cuc"]:
        for c in x["chat_lieu"]:
            if c not in cl:
                loi.append("%s: chất liệu %s không có" % (x["ma"], c))
            elif not set(cl[c]["kho"]) & set(x["kho"]):
                loi.append("%s: chất liệu %s không cùng khổ" % (x["ma"], c))
        for d in x["d_nguon"]:
            if ma_d and d not in ma_d:
                loi.append("%s: thẻ D %s không có ở Bảng 3" % (x["ma"], d))
        for c in x["chu_de"]:
            if c not in truc["loai_chu_de"]:
                loi.append("%s: loại chủ đề %s không có" % (x["ma"], c))
    for x in truc["mau"]:
        for c in x["chat_lieu"]:
            if c not in cl:
                loi.append("%s: chất liệu %s không có" % (x["ma"], c))
        for g in x["nhom_nhac_hop"] + x["nhom_nhac_tranh"]:
            if g not in truc["nhom_nhac"]:
                loi.append("%s: nhóm nhạc %s không có" % (x["ma"], g))
        for v in x.get("linh_vuc", []):
            if v not in truc["linh_vuc"]:
                loi.append("%s: lĩnh vực %s không có" % (x["ma"], v))
    tra = {"chat_lieu": cl, "bo_cuc": bc, "mau": mau, "muc_chi_tiet": ct}
    for ten_luat in ("luat_loai_tru", "luat_cong_diem"):
        for i, luat in enumerate(truc[ten_luat]):
            for k, gt in luat["dieu_kien"].items():
                for g in (gt if isinstance(gt, list) else [gt]):
                    if k in tra and g not in tra[k]:
                        loi.append("%s[%d]: %s=%s không có" % (ten_luat, i, k, g))
                    elif ten_luat == "luat_cong_diem" and k in tra and tra[k][g].get("gia_tri_moi"):
                        loi.append("luat_cong_diem[%d]: %s là giá trị mới, giá trị mới chưa chấm điểm nên luật này không bao giờ chạy" % (i, g))
                    elif k == "chu_de" and g not in truc["loai_chu_de"]:
                        loi.append("%s[%d]: chu_de=%s không có" % (ten_luat, i, g))
                    elif k == "linh_vuc" and g not in truc["linh_vuc"]:
                        loi.append("%s[%d]: linh_vuc=%s không có" % (ten_luat, i, g))
    return loi


def doc_nhac(truc):
    """Đọc sổ nhạc, trả (bài dùng được, {mã: lý do loại})."""
    so = json.loads((GOC / truc["nhac_nguon"]).read_text(encoding="utf-8"))
    loc = truc["nhac_loc"]
    dung, loai = [], {}
    for nh in so:
        re_ = nh.get("re") or {}
        if nh["ma"] in loc["luon_loai"]:
            loai[nh["ma"]] = "đã nghe thấy rè"
        elif re_.get("max10", 0) >= loc["re_tren_10khz_db"] or re_.get("max16", 0) >= loc["re_tren_16khz_db"]:
            loai[nh["ma"]] = "rè nặng (%.1f / %.1f dB)" % (re_.get("max10", 0), re_.get("max16", 0))
        elif loc["loai_giong_hat"] and nh.get("co_the_co_loi"):
            loai[nh["ma"]] = "có thể có giọng hát"
        elif not (GOC / "tai_san/nhac_nen" / nh["file"]).exists():
            loai[nh["ma"]] = "thiếu file, tải lại theo trường tai_tu"
        else:
            dung.append(nh)
    return dung, loai


# ---------- lịch sử 3 video gần nhất ----------

def doc_lich_su(truc, kho, so=3):
    cl, ct, bc, mau = (theo_ma(truc[k]) for k in ("chat_lieu", "muc_chi_tiet", "bo_cuc", "mau"))
    tep = []
    for mau_ten in ("*_v[0-9].md", "*_v[0-9][0-9].md"):
        tep += list(GOC.glob("san_pham/*/tai_nguyen/kich_ban/" + mau_ten))
    tep.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    da_xem, kq = set(), []
    for p in tep:
        thu_muc = p.parent.parent.parent
        if thu_muc in da_xem:
            continue
        da_xem.add(thu_muc)
        dong = p.read_text(encoding="utf-8", errors="replace").splitlines()[:40]
        bien_tau = next((x for x in dong if "Biến tấu" in x), "")
        # phần sau chữ "khác" so sánh với video trước, chứa mã của video khác: bỏ
        bien_tau = re.split(r"[Kk]hác ", bien_tau)[0]
        dau = " ".join(dong)
        ban_ghi = {"video": thu_muc.name, "CL": None, "CT": None, "BC": None, "MAU": None, "NH": None}
        # dạng mới
        for truong, mau_re in (("CL", r"CL-\d+"), ("CT", r"\bCT\d\b"), ("BC", r"BC-\d+"), ("MAU", r"MAU-\d+"), ("NH", r"\bNH\d+\b")):
            m = re.search(mau_re, bien_tau)
            if m:
                ban_ghi[truong] = m.group(0)
        m_kho = re.search(r"Khổ (dọc|ngang)", bien_tau)
        kho_tep = {"dọc": "doc", "ngang": "ngang"}[m_kho.group(1)] if m_kho else None
        # dạng cũ: suy từ trường d_nguon, m_nguon của file dữ liệu; N cũ giữ số khi đổi sang NH
        if not ban_ghi["CL"]:
            m = re.search(r"\bD-(\d+)(b?)\b", bien_tau) or re.search(r"\bD-(\d+)(b?)\b", dau)
            if not m:
                continue
            d = "D-%02d%s" % (int(m.group(1)), m.group(2))
            kho_tep = kho_tep or ("doc" if int(m.group(1)) <= 6 else "ngang")
            ban_ghi["CL"] = next((k for k, v in cl.items() if d in v["d_nguon"]), None)
            ban_ghi["CT"] = next((k for k, v in ct.items() if d in v["d_nguon"]), None)
            ban_ghi["BC"] = next((k for k, v in bc.items() if d in v["d_nguon"]), None)
            m_bang = re.search(r"\bM(\d)\b", bien_tau) if d in ("D-09", "D-09b") else None
            if m_bang:
                ban_ghi["MAU"] = next((k for k, v in mau.items() if v.get("m_nguon") == "M" + m_bang.group(1)), None)
            else:
                ban_ghi["MAU"] = next((k for k, v in mau.items() if d in v["d_nguon"] and v.get("m_nguon") in (None, "M0")), None)
            m_nhac = re.search(r"\bN(\d\d)\b", bien_tau)
            if m_nhac:
                ban_ghi["NH"] = "NH" + m_nhac.group(1)  # N01–N15 cũ giữ số khi đổi sang NH
        if not kho_tep and ban_ghi["CL"]:
            kho_tep = cl[ban_ghi["CL"]]["kho"][0]
        if kho_tep != kho:
            continue
        kq.append(ban_ghi)
        if len(kq) == so:
            break
    return kq


# ---------- luật ----------

def khop(dieu_kien, th):
    """th: dict mô tả tổ hợp. Khoá thiếu trong th (ví dụ nhạc chưa chọn) thì coi là chưa khớp."""
    for k, gt in dieu_kien.items():
        if k not in th or th[k] is None:
            return False
        can = gt if isinstance(gt, list) else [gt]
        co = th[k] if isinstance(th[k], (list, set, tuple)) else [th[k]]
        if not any(x in co for x in can):
            return False
    return True


def bi_loai(truc, th):
    for luat in truc["luat_loai_tru"]:
        if khop(luat["dieu_kien"], th):
            return luat["ly_do"]
    return None


# ---------- chấm điểm ----------

def cham_khung(truc, bang3, lich_su, args, cl, ct, bc, mau):
    """Chấm một khung (CL, CT, BC, MAU). Trả None nếu bị loại."""
    ly_do, tru = [], []
    th = {"chat_lieu": cl["ma"], "muc_chi_tiet": ct["ma"], "bo_cuc": bc["ma"], "mau": mau["ma"],
          "mau_nen": mau["nen"], "chu_de": args.chu_de, "gap": args.gap, "kho": args.kho,
          "linh_vuc": args.linh_vuc}
    if bi_loai(truc, th):
        return None
    diem = 0.0

    d_goc = set(cl["d_nguon"]) & set(ct["d_nguon"]) or set(cl["d_nguon"])
    bang3_txt = None
    if args.kb:
        hang = bang3.get(args.kb, {})
        cac = [(DIEM_BANG3[hang[d][0]], d, hang[d]) for d in d_goc if d in hang]
        if cac:
            if all(x[0] is None for x in cac):
                return None
            tot = max((x for x in cac if x[0] is not None), key=lambda x: x[0])
            diem += tot[0]
            bang3_txt = "%s × %s: %s" % (args.kb, tot[1], tot[2][1])
        else:
            diem += 1
            bang3_txt = "%s chưa được xét với %s ở Bảng 3" % (args.kb, ", ".join(sorted(d_goc)))

    if args.chu_de:
        hop_cl = sum(cl["chu_de"].get(c, 0) for c in args.chu_de)
        hop_bc = sum(bc["chu_de"].get(c, 0) for c in args.chu_de)
        diem += hop_cl + 0.5 * hop_bc
        if hop_cl == 0:
            diem -= 1
            tru.append("chất liệu không nhắm loại chủ đề này")
    if args.linh_vuc and args.linh_vuc in mau.get("linh_vuc", []):
        diem += 1
        ly_do.append("màu hợp lĩnh vực %s" % truc["linh_vuc"][args.linh_vuc])
    cach = cac_cach_lam(truc, cl, args.kho, args.cach_lam)
    co_ma = cl["ma_dung"] == "co"
    if args.cach_lam:  # lọc theo một cách làm: chỉ coi là có mã dựng khi chính cách đó ở mức san
        co_ma = bool(cach) and cach[0][1] == "san"
    if not co_ma:
        diem -= 2
        tru.append("chưa có mã dựng, phải làm thêm")
    elif "mau_co_san" in cl and mau["ma"] not in cl["mau_co_san"]:
        diem -= 0.5
        tru.append("mã dựng chưa có bộ màu %s, phải dựng thêm" % mau["ma"])
    if mau["trang_thai"] == "duyet":
        diem += 0.5
    chung = set(cl["d_nguon"]) & set(ct["d_nguon"]) & set(bc["d_nguon"]) & set(mau["d_nguon"])
    ghep_moi = not chung
    if ghep_moi:
        diem -= 0.3
    for luat in truc["luat_cong_diem"]:
        if khop(luat["dieu_kien"], th):
            diem += luat["diem"]
            (ly_do if luat["diem"] > 0 else tru).append(luat["ly_do"])

    da_dung = {}
    for truong, gt, he_so in (("CL", cl["ma"], 0.4), ("CT", ct["ma"], 0.2), ("BC", bc["ma"], 0.3), ("MAU", mau["ma"], 0.5)):
        k = sum(1 for v in lich_su if v[truong] == gt)
        da_dung[truong] = k
        diem -= he_so * k

    return {"cl": cl, "ct": ct, "bc": bc, "mau": mau, "diem": diem, "ly_do": ly_do, "tru": tru,
            "bang3": bang3_txt, "ghep_moi": ghep_moi, "d_chung": sorted(chung), "da_dung": da_dung, "th": th,
            "cach_lam": cach}


def cham_nhac(truc, lich_su, args, khung, nh):
    """Chấm một bài cho một khung. Trả None nếu bị loại."""
    mau, cl = khung["mau"], khung["cl"]
    th = dict(khung["th"], nhac=nh["ma"], nhac_nhom=nh["nhom"])
    if bi_loai(truc, th):
        return None
    mt = truc["ma_tran_mau_nhac"]
    ten_nhom = truc["nhom_nhac"].get(nh["nhom"], nh["nhom"])
    diem, ghi = 0.0, [ten_nhom]
    muc = mt[mau["ma"]][mt["cot"].index(nh["ma"])] if mau["ma"] in mt and nh["ma"] in mt["cot"] else None
    if muc == "K":
        return None
    if muc == "H":
        diem += 1
    elif muc is None:
        if nh["nhom"] in mau["nhom_nhac_tranh"]:
            return None
        if nh["nhom"] in mau["nhom_nhac_hop"]:
            diem += 1
    if nh["tiet_tau"] in cl.get("tiet_tau_nhac_hop", []):
        diem += 0.5
    if args.kb and nh["nhom"] in truc["nhom_nhac_theo_kb"].get(args.kb, []):
        diem += 0.5
    dai = nh["dai_giay"] - (nh.get("mo_dau_nho_giay") or 0)
    if args.do_dai:
        if dai >= args.do_dai:
            diem += 0.5
        else:
            ghi.append("dùng được %d giây, ngắn hơn video, phải nối lặp" % dai)
    if (nh.get("re") or {}).get("nghi_re"):
        diem -= 0.5
        ghi.append("có cờ nghi rè, nghe lại trước khi dùng")
    if nh.get("content_id"):
        diem -= 0.5
        ghi.append("có đăng ký Content ID")
    if str(nh.get("khop", "")).startswith("lệch") and not nh.get("duyet"):  # Trung duyệt nhãn thì nhóm coi là chắc
        diem -= 0.2
        ghi.append("nhóm chưa chắc (%s)" % nh["khop"])
    if (nh.get("mo_dau_nho_giay") or 0) >= 5:
        ghi.append("%d giây đầu rất nhỏ, phát từ giây đó" % nh["mo_dau_nho_giay"])
    if nh.get("ghi_chu"):
        ghi.append(nh["ghi_chu"])
    k = sum(1 for v in lich_su if v["NH"] == nh["ma"])
    diem -= 0.6 * k
    if k:
        ghi.append("đã dùng ở %d/3 video gần nhất" % k)
    return diem, ghi


def chon_nhac(truc, nhac, lich_su, args, khung, da_chon=()):
    """da_chon: bài đã gán cho tổ hợp trước trong cùng lượt gợi ý, trừ điểm để mỗi tổ hợp một bài khác."""
    ung_vien = []
    for nh in nhac:
        kq = cham_nhac(truc, lich_su, args, khung, nh)
        if kq:
            ung_vien.append((kq[0] - (0.8 if nh["ma"] in da_chon else 0), nh["ma"], nh, kq[1]))
    if not ung_vien:
        return None, []
    ung_vien.sort(key=lambda x: (-x[0], x[1]))
    return ung_vien[0][2], ung_vien[0][3]


def sinh_khung(truc, bang3, lich_su, args):
    ds = []
    for cl, ct, bc, mau in itertools.product(truc["chat_lieu"], truc["muc_chi_tiet"], truc["bo_cuc"], truc["mau"]):
        if args.kho not in cl["kho"] or args.kho not in bc["kho"]:
            continue
        if ct["ma"] not in cl["muc_chi_tiet"] or cl["ma"] not in bc["chat_lieu"] or cl["ma"] not in mau["chat_lieu"]:
            continue
        if args.cach_lam and not cac_cach_lam(truc, cl, args.kho, args.cach_lam):
            continue
        if cl.get("gia_tri_moi") or bc.get("gia_tri_moi") or mau.get("gia_tri_moi"):
            continue  # giá trị mới chưa chấm điểm: không xếp hạng, xem lua_chon_moi
        k = cham_khung(truc, bang3, lich_su, args, cl, ct, bc, mau)
        if k:
            ds.append(k)
    ds.sort(key=lambda x: (-x["diem"], x["cl"]["ma"], x["ct"]["ma"], x["bc"]["ma"], x["mau"]["ma"]))
    return ds


def chon_khac_nhau(ds, so):
    def so_truc_khac(a, b):
        return sum(a[k]["ma"] != b[k]["ma"] for k in ("cl", "ct", "bc", "mau"))
    for nguong in (2, 1):
        chon = []
        for k in ds:
            if all(so_truc_khac(k, c) >= nguong for c in chon):
                chon.append(k)
            if len(chon) == so:
                return chon
    return chon


# ---------- in kết quả ----------

def nhan_nhap(x):
    return " (nháp)" if x.get("trang_thai") == "nhap" else ""


def luat_cung_loai(truc, cl, ct, bc, mau, args):
    """True nếu bộ (chất liệu, mức chi tiết, bố cục, màu) không vi phạm luật loại trừ cứng trong dữ liệu."""
    th = {"chat_lieu": cl["ma"], "muc_chi_tiet": ct, "bo_cuc": bc["ma"], "mau": mau["ma"], "mau_nen": mau["nen"],
          "chu_de": args.chu_de, "gap": args.gap, "kho": args.kho, "linh_vuc": args.linh_vuc}
    return bi_loai(truc, th) is None


def lua_chon_moi(truc, bang3, args):
    """Lựa chọn mới (gia_tri_moi) hợp khổ, KHÔNG chấm điểm, KHÔNG xếp hạng (Trung chốt 27/10/2026).
    Trả (mục_chất_liệu, mục_bố_cục_màu_mới): mỗi chất liệu mới một mục gồm cách làm, một bố cục và hai màu
    hợp nhất theo trường đi kèm (bố cục: khớp loại chủ đề, rồi chất liệu đứng đầu danh sách; màu: khớp lĩnh vực, rồi
    chất liệu đứng đầu danh sách, rồi màu đã duyệt). Chỉ áp luật loại trừ cứng."""
    ct_theo_ma = theo_ma(truc["muc_chi_tiet"])
    cl_moi = []
    for cl in truc["chat_lieu"]:
        if not cl.get("gia_tri_moi") or args.kho not in cl["kho"]:
            continue
        cach = cac_cach_lam(truc, cl, args.kho, args.cach_lam)
        if args.cach_lam and not cach:
            continue
        cts = cl["muc_chi_tiet"]
        ds_bc = [(i, b) for i, b in enumerate(truc["bo_cuc"]) if args.kho in b["kho"] and cl["ma"] in b["chat_lieu"]]
        ds_mau = [(i, m) for i, m in enumerate(truc["mau"]) if cl["ma"] in m["chat_lieu"]]
        ds_bc.sort(key=lambda x: (-sum(x[1]["chu_de"].get(c, 0) for c in args.chu_de), x[1]["chat_lieu"].index(cl["ma"]), x[0]))
        ds_mau.sort(key=lambda x: (0 if args.linh_vuc and args.linh_vuc in x[1].get("linh_vuc", []) else 1,
                                   x[1]["chat_lieu"].index(cl["ma"]), 0 if x[1]["trang_thai"] == "duyet" else 1, x[0]))
        chon_bc, chon_mau = None, []
        for _, b in ds_bc:
            ok = [m for _, m in ds_mau if any(luat_cung_loai(truc, cl, c, b, m, args) for c in cts)]
            if ok:
                chon_bc, chon_mau = b, ok[:2]
                break
        if not chon_bc:
            continue
        bang3_txt = None
        if args.kb:
            hang = bang3.get(args.kb, {})
            d_goc = set()
            for c in cts:
                d_goc |= set(cl["d_nguon"]) & set(ct_theo_ma[c]["d_nguon"]) or set(cl["d_nguon"])
            cac = [(DIEM_BANG3[hang[d][0]], hang[d][0], d) for d in sorted(d_goc) if d in hang]
            if cac and all(x[0] is None for x in cac):
                bang3_txt = "Bảng 3 ghi Không nên giữa %s và thẻ D gần nhất %s: cân nhắc kỹ trước khi dùng" % (args.kb, ", ".join(x[2] for x in cac))
            elif cac:
                tot = max((x for x in cac if x[0] is not None), key=lambda x: x[0])
                bang3_txt = "Bảng 3 (thẻ D gần nhất %s): %s mức %s" % (tot[2], args.kb, tot[1])
            else:
                bang3_txt = "Bảng 3 chưa xét %s với thẻ D gần nhất %s" % (args.kb, ", ".join(sorted(d_goc)))
        cl_moi.append({"cl": cl, "cach": cach, "bc": chon_bc, "mau": chon_mau, "bang3": bang3_txt})
    # bố cục, màu mới đi với chất liệu cũ (chất liệu cũ có mã dựng, chưa chấm điểm riêng)
    cl_cu = [c for c in truc["chat_lieu"] if not c.get("gia_tri_moi") and args.kho in c["kho"]]
    cu_ma = {c["ma"]: c for c in cl_cu}
    phu = []
    for loai, ds in (("BC", truc["bo_cuc"]), ("MAU", truc["mau"])):
        for x in ds:
            if not x.get("gia_tri_moi"):
                continue
            if loai == "BC" and args.kho not in x["kho"]:
                continue
            cung = [c for c in x["chat_lieu"] if c in cu_ma and (args.cach_lam is None or cac_cach_lam(truc, cu_ma[c], args.kho, args.cach_lam))]
            if cung:
                phu.append((loai, x, cung))
    return cl_moi, phu


def in_lua_chon_moi(truc, args, cl_moi, phu):
    print("Lựa chọn mới, chưa chấm điểm — Claude đánh giá theo nội dung video")
    print("  Học từ repo mẫu ngày 27/10/2026, không xếp hạng, không bị trừ điểm nào. Đọc dòng Hợp khi và Không hợp khi rồi chọn theo nội dung và tính chất video; "
          "chọn lựa chọn mới thì nói với Trung đây là lựa chọn nháp chưa dựng thật. Chỉ áp luật loại trừ cứng (khổ, danh sách đi kèm, luật trong dữ liệu).")
    if not cl_moi:
        print("  Không có chất liệu mới hợp khổ %s%s." % (TEN_KHO[args.kho], " với cách làm " + args.cach_lam if args.cach_lam else ""))
    for m in cl_moi:
        cl, cach = m["cl"], m["cach"]
        if cach:
            lm, muc, _ = cach[0]
            cach_txt = "%s %s (%s)" % (lm["ma"], lm["ten"], TEN_MUC_LM[muc])
            gio = thoi_gian_ngan(lm, args.do_dai)
        else:
            cach_txt, gio = "chưa ghi cách làm", "chưa đo"
        print("  %s %s%s · %s · cách làm: %s · thời gian máy: %s · mẫu nguồn: %s · bố cục: %s %s%s · màu: %s" % (
            cl["ma"], cl["ten"], nhan_nhap(cl), ", ".join(cl["muc_chi_tiet"]), cach_txt, gio, ", ".join(cl["mau_nguon"]),
            m["bc"]["ma"], m["bc"]["ten"], nhan_nhap(m["bc"]),
            ", ".join("%s %s%s" % (u["ma"], u["ten"], nhan_nhap(u) if u["trang_thai"] == "nhap" else "") for u in m["mau"])))
        print("      Hợp khi: %s" % cl["goi_y_dung_khi"])
        print("      Không hợp khi: %s" % cl["khong_hop_khi"])
        if m["bang3"]:
            print("      %s" % m["bang3"])
    if phu:
        print("  Bố cục và tông màu mới đi được với chất liệu cũ (chưa chấm điểm):")
        for loai, x, cung in phu:
            phan = "nền %s" % ("tối" if x["nen"] == "toi" else "sáng") if loai == "MAU" else ", ".join(TEN_KHO[k] for k in x["kho"])
            print("    %s %s (nháp, %s): đi với %s" % (x["ma"], x["ten"], phan, ", ".join(cung)))
    print()


def in_cach_lam(args, k):
    """In cách làm đề xuất (cách có mã dựng sẵn và nhanh nhất cho khổ), thời gian máy theo cách làm, cách khác."""
    cach = k["cach_lam"]
    if not cach:
        print("  Cách làm: chưa có cách làm nào ghi cho chất liệu này ở khổ này")
        return
    lm, muc, ghi = cach[0]
    da_chay = "" if args.kho in lm["kho_da_chay"] else "; chưa chạy thật ở khổ %s" % TEN_KHO[args.kho]
    print("  Cách làm đề xuất: %s %s — chỗ: %s — %s%s%s" % (
        lm["ma"], lm["ten"], lm["cho"], TEN_MUC_LM[muc], (": " + ghi) if ghi else "", da_chay))
    print("  Thời gian máy theo cách làm: %s" % dong_thoi_gian_lm(lm, args.do_dai))
    if muc != "san":
        print("  Chi phí dựng mới: %s" % lm["chi_phi_dung_moi"])
    if len(cach) > 1:
        print("  Cách làm khác: %s" % "; ".join("%s %s (%s)" % (l["ma"], l["ten"], TEN_MUC_LM[m]) for l, m, _ in cach[1:]))


def in_goi_y(truc, args, lich_su, chon):
    print("Khổ %s · lối viết %s · chủ đề %s · lĩnh vực %s" % (
        TEN_KHO[args.kho], args.kb or "chưa chọn", ", ".join(args.chu_de) or "chưa nêu", args.linh_vuc or "chưa nêu"))
    if lich_su:
        print("3 video gần nhất cùng khổ: " + "; ".join(
            "%s (%s)" % (v["video"], " · ".join(x for x in (v["CL"], v["CT"], v["BC"], v["MAU"], v["NH"]) if x)) for v in lich_su))
    print()
    for i, k in enumerate(chon, 1):
        nh, ghi_nh = k["nhac"]
        print("Tổ hợp %d (điểm %.1f)%s" % (i, k["diem"], " — ghép mới, chưa dựng thật" if k["ghep_moi"] else " — giống thẻ %s" % ", ".join(k["d_chung"])))
        print("  Chất liệu  %s %s%s: %s" % (k["cl"]["ma"], k["cl"]["ten"], nhan_nhap(k["cl"]), k["cl"]["mo_ta"]))
        print("  Chi tiết   %s %s: %s" % (k["ct"]["ma"], k["ct"]["ten"], k["ct"]["mo_ta"]))
        print("  Bố cục     %s %s%s: %s" % (k["bc"]["ma"], k["bc"]["ten"], nhan_nhap(k["bc"]), k["bc"]["mo_ta"]))
        print("  Màu        %s %s%s: %s" % (k["mau"]["ma"], k["mau"]["ten"], "" if k["mau"]["trang_thai"] == "duyet" else " (nháp)", k["mau"]["mo_ta"]))
        if nh:
            print("  Nhạc       %s %s, âm lượng %.3f (%s)" % (nh["ma"], nh["ten"], nh["am_luong"], "; ".join(ghi_nh)))
        print("  Nhịp, phụ đề: %s" % k["cl"]["nhip_phu_de"])
        print("  Thời gian máy: %s" % k["cl"]["thoi_gian"].get(k["ct"]["ma"], "chưa đo"))
        print("  Mã dựng: %s" % k["cl"]["ma_dung_o"])
        in_cach_lam(args, k)
        print("  Video gần giống: %s" % k["cl"]["vi_du"])
        if k["bang3"]:
            print("  Bảng 3: %s" % k["bang3"])
        if k["ly_do"]:
            print("  Cộng điểm: %s" % "; ".join(k["ly_do"]))
        print("  Không hợp: %s%s" % (k["cl"]["khong_hop"], "; " + "; ".join(k["tru"]) if k["tru"] else ""))
        dd = ", ".join("%s %d/3" % (t, n) for t, n in k["da_dung"].items() if n)
        print("  Đã dùng ở video gần nhất: %s" % (dd or "không trục nào"))
        print("  Dòng Biến tấu: Khổ %s · %s · %s · %s · %s · %s%s" % (
            "dọc" if args.kho == "doc" else "ngang", args.kb or "KB-xx", k["cl"]["ma"], k["ct"]["ma"], k["bc"]["ma"], k["mau"]["ma"],
            " · " + nh["ma"] if nh else ""))
        print()


def ten_trang_thai(x):
    """Ô trạng thái của chất liệu, bố cục: đã duyệt, nháp, hoặc — khi chưa ghi."""
    return {"duyet": "đã duyệt", "nhap": "nháp"}.get(x.get("trang_thai"), "—")


def ghi_cach_lam_o(x):
    """Ô cách làm của một chất liệu: mã LM kèm mức."""
    nhan = {"san": "sẵn", "cong_cu": "công cụ", "chua": "chưa"}
    return "; ".join("%s (%s)" % (e["ma"], nhan[e["muc"]]) for e in x.get("cach_lam", []))


def xuat_md(truc):
    d = []
    d.append("# Hệ trục dựng (sinh tự động)\n")
    d.append("> File này sinh từ `he_truc_dung.json` bằng `python3 scripts/goi_y_to_hop_dung.py --xuat-md`. Không sửa tay. "
             "Phiên bản dữ liệu %s, cập nhật %s. Áp cho video mở việc từ 27/10/2026; video cũ giữ mã D trong kịch bản của nó. "
             "Cách dùng trong quy trình: `04_he_truc_dung.md` (cửa chọn 2) và `05_cach_lam.md` (bảy cách làm). "
             "Giá trị học từ repo mẫu ngày 27/10/2026 (CL-09…CL-16, BC-08…BC-13, MAU-20…MAU-31, ghi nháp ở cột Trạng thái) chưa chấm điểm: "
             "script không xếp hạng mà in ở mục \"Lựa chọn mới, chưa chấm điểm\" để Claude đánh giá theo nội dung video, đọc mục Gợi ý đánh giá chất liệu mới bên dưới (Trung chốt 27/10/2026).\n" % (truc["phien_ban"], truc["cap_nhat"]))
    d.append("## Chất liệu hình (CL)\n")
    d.append("| Mã | Tên | Mô tả | Khổ | Mức chi tiết | Nhịp, phụ đề | Mã dựng | Cách làm | Thời gian máy | Thẻ D gốc hoặc gần nhất | Trạng thái |")
    d.append("|---|---|---|---|---|---|---|---|---|---|---|")
    for x in truc["chat_lieu"]:
        tg = "; ".join("%s: %s" % (k, v) for k, v in x["thoi_gian"].items())
        d.append("| %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |" % (x["ma"], x["ten"], x["mo_ta"], ", ".join(TEN_KHO[k] for k in x["kho"]),
                 ", ".join(x["muc_chi_tiet"]), x["nhip_phu_de"], ("Có: " if x["ma_dung"] == "co" else "") + x["ma_dung_o"], ghi_cach_lam_o(x), tg,
                 ", ".join(x["d_nguon"]), ten_trang_thai(x)))
    mau_cl = [x for x in truc["chat_lieu"] if x.get("gia_tri_moi")]
    if mau_cl:
        d.append("\n### Gợi ý đánh giá chất liệu mới (chưa chấm điểm)\n")
        d.append("Đọc khi chọn lựa chọn mới cho một video. Hợp Media là điểm trung bình 0–3 trên bản chấm 100 mục ngày 27/10/2026. Liên kết mẫu: xem mục Cách làm.\n")
        for x in mau_cl:
            d.append("- **%s %s** (hợp Media %s; mẫu %s). Hợp khi: %s Không hợp khi: %s" % (
                x["ma"], x["ten"], so_vn(x["hop_media"]), ", ".join(x["mau_nguon"]), x["goi_y_dung_khi"], x["khong_hop_khi"]))
    d.append("\n## Cách làm (LM)\n")
    d.append("Cách làm là con đường kỹ thuật dựng ra chất liệu hình; một chất liệu có thể làm bằng nhiều cách, mỗi cách đã có mã dựng sẵn cho chất liệu đó (sẵn), "
             "mới có công cụ chung (công cụ) hoặc chưa có cả công cụ (chưa). Script đề xuất cách có mã dựng sẵn và nhanh nhất cho khổ; "
             "lọc bằng `--cach-lam LM-xx`.\n")
    d.append("| Mã | Tên | Chỗ | Trạng thái | Khổ làm được | Khổ đã chạy thật | Thời gian máy | Chi phí dựng mới | Ghi chú |")
    d.append("|---|---|---|---|---|---|---|---|---|")
    ten_tt = {"co": "có", "mot_phan": "một phần (làm tay)", "chua": "chưa cài"}
    for x in truc["cach_lam"]:
        t = x["thoi_gian_may"]
        if t.get("min") is None:
            gio = t["ghi"]
        else:
            gio = "%s %s%s. %s" % (khoang_lm(t), t["don_vi"], " (ước)" if t.get("uoc") else "", t["ghi"])
        d.append("| %s | %s | %s | %s | %s | %s | %s (nguồn: %s) | %s | %s |" % (
            x["ma"], x["ten"], x["cho"], ten_tt[x["trang_thai"]], ", ".join(TEN_KHO[k] for k in x["kho"]),
            ", ".join(TEN_KHO[k] for k in x["kho_da_chay"]) or "chưa", gio, t["nguon"], x["chi_phi_dung_moi"], x["ghi_chu"]))
    n = truc.get("nguon_mau")
    if n:
        d.append("\nNguồn mẫu: %s Liên kết mẫu: `%s` (prompt), `%s` (video gốc), `%s` (video làm lại). %s\n" % (
            n["repo"], n["link_prompt"], n["link_video_goc"], n["link_video_lam_lai"], n["ghi_chu"]))
    d.append("\n## Mức chi tiết (CT)\n")
    d.append("| Mã | Tên | Mô tả |")
    d.append("|---|---|---|")
    for x in truc["muc_chi_tiet"]:
        d.append("| %s | %s | %s |" % (x["ma"], x["ten"], x["mo_ta"]))
    d.append("\n## Bố cục khung hình (BC)\n")
    d.append("| Mã | Tên | Mô tả | Khổ | Đi với chất liệu | Thẻ D gốc hoặc gần nhất | Trạng thái |")
    d.append("|---|---|---|---|---|---|---|")
    for x in truc["bo_cuc"]:
        d.append("| %s | %s | %s | %s | %s | %s | %s |" % (x["ma"], x["ten"], x["mo_ta"], ", ".join(TEN_KHO[k] for k in x["kho"]), ", ".join(x["chat_lieu"]), ", ".join(x["d_nguon"]),
                 ten_trang_thai(x)))
    d.append("\n## Tông màu (MAU)\n")
    d.append("Cột Màu đo ghi mã hex đo bằng máy từ khung hình mẫu (độ lệch khoảng 3 mức trên thang 255; nét mảnh đo nhạt hơn màu thật chừng 10–20 mức). Tông cũ không ghi cột này.\n")
    d.append("| Mã | Tên | Nền | Mô tả | Màu đo (nền / chữ / nhấn / phụ) | Đi với chất liệu | Trạng thái | Thẻ D gốc hoặc gần nhất |")
    d.append("|---|---|---|---|---|---|---|---|")
    for x in truc["mau"]:
        hx = x.get("hex")
        hx_o = "%s / %s / %s / %s" % (hx["nen"], hx["chu"], ", ".join(hx["nhan"]), ", ".join(hx["phu"]) or "—") if hx else "—"
        d.append("| %s | %s | %s | %s | %s | %s | %s | %s |" % (x["ma"], x["ten"], "tối" if x["nen"] == "toi" else "sáng", x["mo_ta"], hx_o, ", ".join(x["chat_lieu"]),
                 "đã duyệt" if x["trang_thai"] == "duyet" else "nháp", ", ".join(x["d_nguon"]) + (" · " + x["m_nguon"] if x.get("m_nguon") else "")))
    nhac, loai = doc_nhac(truc)
    loc = truc["nhac_loc"]
    d.append("\n## Nhạc nền (NH, Claude tự chọn)\n")
    d.append("Đọc thẳng từ `%s` (bản đọc `so_nhac.md` cùng thư mục). Loại bài rè nặng (trên 10 kHz từ %g dB hoặc trên 16 kHz từ %g dB, luôn loại %s)%s. "
             "Còn %d bài dùng được, loại %d bài.\n" % (truc["nhac_nguon"], loc["re_tren_10khz_db"], loc["re_tren_16khz_db"], ", ".join(loc["luon_loai"]),
             ", loại bài máy đoán có giọng hát" if loc["loai_giong_hat"] else "", len(nhac), len(loai)))
    d.append("| Tông màu | Nhóm nhạc hợp | Nhóm nhạc tránh |")
    d.append("|---|---|---|")
    for x in truc["mau"]:
        d.append("| %s %s | %s | %s |" % (x["ma"], x["ten"], ", ".join(truc["nhom_nhac"][g] for g in x["nhom_nhac_hop"]),
                 ", ".join(truc["nhom_nhac"][g] for g in x["nhom_nhac_tranh"]) or "không"))
    d.append("\nBài bị loại: " + "; ".join("%s %s" % (k, v) for k, v in sorted(loai.items())) + ".")
    d.append("\n## Luật loại trừ\n")
    for x in truc["luat_loai_tru"]:
        d.append("- `%s` → loại. %s" % (json.dumps(x["dieu_kien"], ensure_ascii=False), x["ly_do"]))
    d.append("- Ngoài ra: chất liệu, bố cục phải đúng khổ; mức chi tiết, bố cục, màu phải nằm trong danh sách đi kèm chất liệu; ô K của ma trận màu × nhạc; thẻ D gốc chấm \"Không nên\" với lối viết ở Bảng 3; "
             "khi lọc bằng `--cach-lam`, chất liệu không làm được bằng cách đó (hoặc cách đó không làm được khổ) bị bỏ.")
    d.append("\n## Luật cộng, trừ điểm\n")
    for x in truc["luat_cong_diem"]:
        d.append("- `%s` → %+g. %s" % (json.dumps(x["dieu_kien"], ensure_ascii=False), x["diem"], x["ly_do"]))
    d.append("\nĐiểm còn gồm: độ hợp với lối viết theo Bảng 3 (Rất hợp 3, Hợp 2, Cân nhắc 1); độ hợp chất liệu và bố cục với loại chủ đề; "
             "màu hợp lĩnh vực +1; chưa có mã dựng −2 (chất liệu không có cách làm nào ở mức sẵn; khi lọc `--cach-lam` thì xét riêng cách đó); màu đã duyệt +0,5; "
             "tổ hợp ghép mới chưa dựng thật −0,3 (chỉ cho tổ hợp toàn giá trị cũ); "
             "trừ theo số lần mỗi trục đã dùng ở 3 video gần nhất cùng khổ. Cách làm đề xuất không cộng, trừ điểm riêng: chỉ in kèm. "
             "Tổ hợp chứa một giá trị học từ repo mẫu (gia_tri_moi) không vào bảng xếp hạng và không bị trừ điểm nào; "
             "script in mục \"Lựa chọn mới, chưa chấm điểm\" liệt kê mỗi chất liệu mới một mục (cách làm, thời gian máy, mẫu nguồn, một bố cục, hai màu hợp nhất theo danh sách đi kèm), "
             "chỉ áp luật loại trừ cứng; Claude đánh giá theo nội dung và tính chất video.\n")
    FILE_MD.write_text("\n".join(d) + "\n", encoding="utf-8")
    print("Đã ghi %s" % FILE_MD.relative_to(GOC))


def main():
    ap = argparse.ArgumentParser(description="Gợi ý tổ hợp phong cách dựng (CL · CT · BC · MAU · NH)")
    ap.add_argument("--kho", choices=["doc", "ngang"])
    ap.add_argument("--kb", help="Mã lối viết đã chốt, ví dụ KB-05")
    ap.add_argument("--chu-de", default="", help="Loại chủ đề, nhiều loại cách nhau dấu phẩy")
    ap.add_argument("--linh-vuc", help="Lĩnh vực của chủ đề")
    ap.add_argument("--do-dai", type=int, help="Độ dài video dự kiến (giây)")
    ap.add_argument("--gap", action="store_true", help="Cần video trong vài giờ")
    ap.add_argument("--cach-lam", help="Chỉ xét chất liệu làm được bằng cách làm này (mã LM-01…LM-07)")
    ap.add_argument("--so", type=int, default=3, help="Số tổ hợp đề xuất (mặc định 3)")
    ap.add_argument("--bo-qua-lich-su", action="store_true", help="Không trừ điểm theo 3 video gần nhất")
    ap.add_argument("--liet-ke", action="store_true", help="Đếm tổ hợp hợp lệ theo khổ")
    ap.add_argument("--xuat-md", action="store_true", help="Sinh lại he_truc_dung.md")
    ap.add_argument("--kiem", action="store_true", help="Kiểm dữ liệu he_truc_dung.json (mã tham chiếu, ma_dung khớp cach_lam)")
    args = ap.parse_args()
    args.chu_de = [x.strip() for x in args.chu_de.split(",") if x.strip()]

    truc = doc_truc()
    for c in args.chu_de:
        if c not in truc["loai_chu_de"]:
            sys.exit("Loại chủ đề '%s' không có. Chọn trong: %s" % (c, ", ".join(truc["loai_chu_de"])))
    if args.linh_vuc and args.linh_vuc not in truc["linh_vuc"]:
        sys.exit("Lĩnh vực '%s' không có. Chọn trong: %s" % (args.linh_vuc, ", ".join(truc["linh_vuc"])))
    if args.cach_lam and args.cach_lam not in theo_ma(truc["cach_lam"]):
        sys.exit("Cách làm '%s' không có. Chọn trong: %s" % (args.cach_lam, ", ".join(x["ma"] for x in truc["cach_lam"])))
    if args.kiem or args.xuat_md:
        loi = kiem_du_lieu(truc, doc_bang3())
        for x in loi:
            print("LỖI DỮ LIỆU: " + x, file=sys.stderr)
        if args.kiem:
            print("Dữ liệu he_truc_dung.json: %s" % ("đạt" if not loi else "%d lỗi" % len(loi)))
            sys.exit(1 if loi else 0)
    if args.xuat_md:
        xuat_md(truc)
        return
    if not args.kho:
        sys.exit("Thiếu --kho doc hoặc --kho ngang")

    bang3 = doc_bang3()
    if args.kb and args.kb not in bang3:
        sys.exit("Không thấy %s trong Bảng 3 của 00_muc_luc.md" % args.kb)
    lich_su = [] if args.bo_qua_lich_su else doc_lich_su(truc, args.kho)
    ds = sinh_khung(truc, bang3, lich_su, args)

    cl_moi, phu = lua_chon_moi(truc, bang3, args)
    if args.liet_ke:
        so_to_hop = 0
        nhac, loai = doc_nhac(truc)
        for k in ds:
            so_to_hop += sum(1 for nh in nhac if cham_nhac(truc, [], args, k, nh))
        print("Khổ %s%s: %d khung hợp lệ (chất liệu · chi tiết · bố cục · màu), %d tổ hợp tính cả nhạc; sổ nhạc %d bài dùng được, %d bài bị loại." % (
            TEN_KHO[args.kho], " với " + args.kb if args.kb else "", len(ds), so_to_hop, len(nhac), len(loai)))
        print("Lựa chọn mới chưa chấm điểm, không tính ở trên: %d chất liệu hợp khổ (%s)." % (
            len(cl_moi), ", ".join(m["cl"]["ma"] for m in cl_moi) or "không có"))
        return

    if not ds and not cl_moi:
        sys.exit("Không còn tổ hợp nào sau khi loại%s. Xem lại lối viết hoặc loại chủ đề." % (
            " (đang lọc theo cách làm %s: chưa chất liệu nào ghi cách làm này làm được khổ %s)" % (args.cach_lam, TEN_KHO[args.kho]) if args.cach_lam else ""))
    chon = chon_khac_nhau(ds, args.so) if ds else []
    nhac, _ = doc_nhac(truc)
    da_chon = set()
    for k in chon:
        k["nhac"] = chon_nhac(truc, nhac, lich_su, args, k, da_chon)
        if k["nhac"][0]:
            da_chon.add(k["nhac"][0]["ma"])
    in_goi_y(truc, args, lich_su, chon)
    if not chon:
        print("Không có tổ hợp xếp hạng (toàn giá trị đã dùng) với tham số này.\n")
    in_lua_chon_moi(truc, args, cl_moi, phu)


if __name__ == "__main__":
    main()
