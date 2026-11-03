#!/usr/bin/env python3
"""Sổ trend (skill san-trend bản 3.0, Trung chốt 28/10/2026).

Gộp mọi lượt săn trend đã lưu trong du_lieu/trend/<ngày>/ thành một sổ từ khoá duy nhất, cộng dồn qua các
lượt, chấm điểm độ nóng 0–100. Bảng video (thẻ Trend) đọc sổ này; ghi chú, trạng thái Trung nhập trên bảng
nằm riêng ở du_lieu/bang_video/trend_nhap.json, script này không ghi vào đó.

Sổ dựng lại từ đầu mỗi lần chạy (dữ liệu thô là nguồn sự thật), nên chạy lại bao nhiêu lần cũng ra cùng kết quả.

Cách chạy (tại gốc project Media):
  python3 -I skills/san-trend/scripts/so_trend.py dung            # dựng lại du_lieu/trend/so_trend.json
  python3 -I skills/san-trend/scripts/so_trend.py xem --top 10    # in 10 từ khoá điểm cao nhất
  python3 -I skills/san-trend/scripts/so_trend.py antigravity --ket-qua <thư mục ket_qua/<mã> của TraCuu> \
      --tien-to du_lieu/trend/<ngày>/<HHMM>                       # chuyển kết quả Antigravity thành <tiền tố>_antigravity.json

Điểm độ nóng = 100 × (0,4 tăng + 0,3 quy mô + 0,2 lan toả + 0,1 lặp lại), mỗi thành phần 0–1:
  tăng     lớn nhất trong: % tăng của truy vấn Google Trends (Đột phá tính bằng +5000%), tỉ lệ mức quan tâm
           cuối kỳ / đầu kỳ, thay đổi 3 tháng của Keyword Planner, có mặt trong Google Trends hôm nay (0,6)
  quy mô   lớn nhất trong: lượt tìm/tháng Keyword Planner, lượt xem YouTube, lượt xem TikTok, cảm xúc Facebook,
           lượng tìm RSS, mức quan tâm Google Trends (tương đối, tối đa 0,5), số lần lộ ra ở gợi ý ngách
  lan toả  số nền tảng có mặt / 4, cộng 0,25 nếu Antigravity xác nhận có trích dẫn đạt
  lặp lại  (số lượt đã gặp − 1) / 3
Đây là chỉ số xếp thứ tự trong sổ, không phải lượng tìm thật.
"""
import argparse
import glob
import json
import math
import os
import re
import sys
import unicodedata

THU_MUC_SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GOC_PROJECT = os.path.dirname(os.path.dirname(THU_MUC_SKILL))
GOC_TREND = os.path.join(GOC_PROJECT, "du_lieu", "trend")
KHUNG = ["tuan", "thang", "quy"]
KY_TIKTOK = {"7": "tuan", "30": "thang", "90": "quy", "120": "quy"}
LOAI_LAM_DONG = {"tin nóng", "đang lên", "câu hỏi bền", "tìm kiếm"}
KIEM_DAT = {"dat", "dat_ban_luu", "da_kiem_tay"}


def chuan_hoa(chuoi):
    """Như chuan_hoa của lay_trend.py, nhưng giữ chữ của hashtag (#dienmattroi → dienmattroi) để hashtag TikTok
    thành khoá của sổ."""
    s = unicodedata.normalize("NFC", chuoi or "").lower()
    s = re.sub(r"#\S+", lambda m: " " + m.group(0)[1:] + " ", s)
    s = "".join(ch if (ch.isalnum() or ch.isspace()) else " " for ch in s)
    return re.sub(r"\s+", " ", s).strip()


def bo_dau(s):
    s = unicodedata.normalize("NFD", s).replace("đ", "d").replace("Đ", "D")
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def bo_khop_linh_vuc():
    """Nhận ra từ khoá thuộc lĩnh vực kênh theo tu_loc_them của tu_khoa_kenh.json (cùng quy tắc với lay_trend.py:
    từ viết hoa toàn bộ như AI thì phân biệt hoa thường). Hashtag viết liền không dấu thì so phần không dấu."""
    tu = (doc(os.path.join(THU_MUC_SKILL, "tu_khoa_kenh.json"), {}) or {}).get("tu_loc_them", [])
    thuong = [re.compile(r"(?<!\w)" + re.escape(chuan_hoa(t)) + r"(?!\w)") for t in tu if not t.isupper() and chuan_hoa(t)]
    hoa = [re.compile(r"(?<!\w)" + re.escape(t) + r"(?!\w)") for t in tu if t.isupper()]
    lien = [bo_dau(chuan_hoa(t)).replace(" ", "") for t in tu if not t.isupper() and len(chuan_hoa(t)) >= 4]

    def khop(hien_thi, khoa):
        if any(m.search(khoa) for m in thuong) or any(m.search(hien_thi) for m in hoa):
            return True
        return hien_thi.strip().startswith("#") and any(t in bo_dau(khoa).replace(" ", "") for t in lien)
    return khop


def doc(duong_dan, mac_dinh=None):
    try:
        with open(duong_dan, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return mac_dinh


def phan_tram(s):
    """'+650%' → 650; 'Đột phá' / 'Breakout' → 5000; '-20%' → -20; không đọc được → None."""
    if s is None:
        return None
    t = str(s).strip().lower()
    if any(x in t for x in ("đột phá", "breakout", "tăng vọt")):
        return 5000.0
    m = re.search(r"([+\-−]?)\s*([\d.,]+)\s*%", t)
    if not m:
        return None
    so = float(m.group(2).replace(".", "").replace(",", "."))
    return -so if m.group(1) in ("-", "−") else so


def so_rut_gon(s):
    """'217.6M' → 217600000; '39,6K' → 39600; '1 N – 10 N' → 1000 (lấy cận dưới); '200+' → 200."""
    if s is None:
        return None
    if isinstance(s, (int, float)):
        return float(s)
    t = str(s).strip().replace(" ", " ")
    t = re.split(r"\s*[–-]\s*", t)[0]
    m = re.search(r"([\d.,]+)\s*(tr|triệu|n|nghìn|k|m|b|tỷ)?", t, re.IGNORECASE)
    if not m:
        return None
    so_chu, don_vi = m.group(1), (m.group(2) or "").lower()
    if don_vi:
        so = float(so_chu.replace(",", "."))
    else:
        so = float(so_chu.replace(".", "").replace(",", ""))
    he_so = {"k": 1e3, "n": 1e3, "nghìn": 1e3, "m": 1e6, "tr": 1e6, "triệu": 1e6, "b": 1e9, "tỷ": 1e9}.get(don_vi, 1)
    return so * he_so


def thang_log(x, mu):
    return min(1.0, max(0.0, math.log10(x) / mu)) if x and x > 1 else 0.0


def diem_tang(p):
    return min(1.0, max(0.0, math.log10(1 + p / 100) / math.log10(51))) if p is not None and p > 0 else 0.0


NEN_TANG_THEO_NGUON = [("YouTube", "youtube"), ("Playboard", "youtube"), ("NoxInfluencer", "youtube"),
                       ("Google", "google")]


def nen_tang_cua(nguon):
    for tien_to, nt in NEN_TANG_THEO_NGUON:
        if tien_to in nguon:
            return nt
    return None


# ---------- đọc một lượt ----------

def quan_sat_luot(tt):
    """Trả (thông tin lượt, {khoá: quan sát}) cho một tiền tố lượt."""
    tong = doc(tt + "tong_hop.json", {})
    chu_de = [c["ten"] if isinstance(c, dict) else c for c in tong.get("chu_de", [])]
    qs = {}

    def lay(text, hien_thi=None):
        k = chuan_hoa(text)
        if not k:
            return None
        return qs.setdefault(k, {"khoa": k, "hien_thi": (hien_thi or text).strip(), "chu_de_me": set(), "loai": set(),
                                 "khop_linh_vuc": False, "nen_tang": set(), "nguon": set(),
                                 "khung": {kh: {} for kh in KHUNG}, "chi_so": {}, "bang_chung": [], "trich_dan": []})

    def ghi_lon(d, khoa, gia_tri):
        if gia_tri is not None and (d.get(khoa) is None or gia_tri > d[khoa]):
            d[khoa] = gia_tri

    # (1) mục đã gom của script
    for m in tong.get("muc", []):
        if m["loai"] not in LOAI_LAM_DONG:
            continue
        if not (m.get("khop_linh_vuc") or m.get("chu_de_me") or m["loai"] in ("tin nóng", "đang lên")):
            continue
        q = lay(m["hien_thi"])
        q["loai"].add(m["loai"])
        q["khop_linh_vuc"] = q["khop_linh_vuc"] or bool(m.get("khop_linh_vuc"))
        q["chu_de_me"].update(m.get("chu_de_me") or [])
        q["nguon"].add("script")
        for n in m["nguon"]:
            nt = nen_tang_cua(n)
            if nt:
                q["nen_tang"].add(nt)
        for ct in m.get("chi_tiet", []):
            if "luong_tim" in ct:
                ghi_lon(q["chi_so"], "rss_luong_tim", so_rut_gon(ct["luong_tim"]))
                q["chi_so"]["rss_luong_tim_chu"] = ct["luong_tim"]
            if "nen_tang" in ct:  # gợi ý ngách
                q["nen_tang"].update(ct["nen_tang"])
                ghi_lon(q["chi_so"], "ngach_so_lan", ct.get("so_lan"))
        if m["loai"] == "tin nóng":
            q["bang_chung"].append("Google Trends hôm nay")

    # (2) khám phá Google Trends theo khung: số chính xác hơn phần chi tiết đã cắt của tổng hợp
    for kq in (doc(tt + "kham_pha.json", {}) or {}).get("ket_qua", []):
        kh = kq["khung"]
        goc = lay(kq["tu_khoa"])
        goc["nen_tang"].add("google")
        goc["nguon"].add("script")
        if kq["tu_khoa"] in chu_de:
            goc["chu_de_me"].add(kq["tu_khoa"])
        if kq.get("chuoi") and kq["chuoi"].get("ti_le_tang") is not None:
            goc["khung"][kh]["gt_ti_le"] = kq["chuoi"]["ti_le_tang"]
        for t in kq.get("truy_van_tang", []):
            q = qs.get(chuan_hoa(t["truy_van"]))
            if q:
                q["khung"][kh]["gt_tang"] = t["tang"]
                ghi_lon(q["khung"][kh], "gt_tang_so", phan_tram(t["tang"]))
                q["bang_chung"].append("Google Trends %s: %s" % ({"tuan": "7 ngày", "thang": "30 ngày", "quy": "90 ngày"}[kh], t["tang"]))
        for t in kq.get("truy_van_top", []):
            q = qs.get(chuan_hoa(t["truy_van"]))
            if q:
                ghi_lon(q["khung"][kh], "gt_top", t.get("gia_tri"))

    # (3) video YouTube theo khung: lượt xem lớn nhất gắn vào dòng của từ khoá tìm
    for kq in (doc(tt + "youtube_khung.json", {}) or {}).get("ket_qua", []):
        q = qs.get(chuan_hoa(kq["tu_khoa"])) or lay(kq["tu_khoa"])
        ds = [v for v in kq["video"] if v.get("luot_xem") and chuan_hoa(kq["tu_khoa"]) in chuan_hoa(v.get("tieu_de"))]
        if ds:
            q["nen_tang"].add("youtube")
            v = max(ds, key=lambda x: x["luot_xem"])
            ghi_lon(q["khung"][kq["khung"]], "yt_luot_xem", v["luot_xem"])

    # (4) Keyword Planner (Claude đọc trên Chrome)
    kp = doc(tt + "keyword_planner.json", {}) or {}
    if kp.get("trang_thai") == "doc_duoc":
        for r in kp.get("tu_khoa", []):
            q = lay(r["tu_khoa"])
            q["nguon"].add("chrome")
            q["nen_tang"].add("google")
            if r.get("chu_de"):
                q["chu_de_me"].add(r["chu_de"])
            q["chi_so"]["kp_luot_tim"] = r.get("luot_tim_thang")
            ghi_lon(q["chi_so"], "kp_luot_so", so_rut_gon(r.get("luot_tim_thang")))
            q["chi_so"]["kp_doi_3_thang"] = r.get("doi_3_thang")
            q["chi_so"]["kp_doi_cung_ky"] = r.get("doi_cung_ky")
            if r.get("loai") == "ngach":
                q["loai"].add("tìm kiếm")

    # (5) TikTok Creative Center
    tk = doc(tt + "tiktok.json", {}) or {}
    if tk.get("trang_thai") == "doc_duoc":
        for h in tk.get("hashtag", []):
            q = lay(h["hashtag"], h["hashtag"])
            q["nguon"].add("chrome")
            q["nen_tang"].add("tiktok")
            q["loai"].add("tin nóng")
            kh = KY_TIKTOK.get(str(h.get("ky") or "7"), "tuan")
            ghi_lon(q["khung"][kh], "tt_luot_xem", so_rut_gon(h.get("luot_xem")))
            if h.get("nganh"):
                q["bang_chung"].append("TikTok ngành " + h["nganh"])
        for c in tk.get("chu_de", []):
            if not c.get("hashtag"):
                continue
            q = lay(c["chu_de"])
            q["nguon"].add("chrome")
            q["nen_tang"].add("tiktok")
            q["chu_de_me"].add(c["chu_de"])
            kh = KY_TIKTOK.get(str(c.get("ky") or "7"), "tuan")
            ghi_lon(q["khung"][kh], "tt_luot_xem", so_rut_gon(c.get("luot_xem")))
            q["bang_chung"].append("TikTok %s: %s lượt xem" % (c["hashtag"], c.get("luot_xem")))

    # (6) Facebook: chỉ có bài theo từ khoá, cảm xúc lớn nhất gắn vào từ khoá đã tìm
    fb = doc(tt + "facebook.json", {}) or {}
    if fb.get("trang_thai") == "doc_duoc":
        for b in fb.get("bai", []):
            q = lay(b["tu_khoa"])
            q["nguon"].add("chrome")
            q["nen_tang"].add("facebook")
            ghi_lon(q["chi_so"], "fb_cam_xuc", b.get("cam_xuc_so"))

    # (6b) Inspiration Hub của Trang (Claude đọc trên Chrome, thêm 29/10/2026): hashtag, chủ đề Reels đang lên
    hub = doc(tt + "facebook_hub.json", {}) or {}
    if hub.get("trang_thai") == "doc_duoc":
        for h in hub.get("hashtag", []):
            q = lay(h["hashtag"], h["hashtag"])
            q["nguon"].add("chrome")
            q["nen_tang"].add("facebook")
            q["loai"].add("tin nóng")
            q["bang_chung"].append("Facebook Inspiration Hub, danh mục " + (hub.get("danh_muc") or "?"))

    # (6c) Bản tin BFSI hằng tháng của Reputa (Claude đọc trên brandsvietnam.com, thêm 29/10/2026): khung tháng
    rp = doc(tt + "reputa.json", {}) or {}
    if rp.get("trang_thai") == "doc_duoc":
        for c in rp.get("chu_de", []):
            q = lay(c["chu_de"])
            q["nguon"].add("reputa")
            ghi_lon(q["khung"]["thang"], "rp_de_cap", c.get("de_cap"))
            q["bang_chung"].append("Reputa BFSI %s: %s lượt đề cập" % (rp.get("ky"), c.get("de_cap")))

    # (7) Antigravity: chỉ lấy mục đã qua script đối chiếu trích dẫn
    ag = doc(tt + "antigravity.json", {}) or {}
    for a in ag.get("muc", []):
        if a.get("kiem") not in KIEM_DAT or not a.get("tu_khoa"):
            continue
        q = lay(a["tu_khoa"])
        q["nguon"].add("antigravity")
        q["nen_tang"].update(a.get("nen_tang") or [])
        if a.get("chu_de"):
            q["chu_de_me"].add(a["chu_de"])
        q["loai"].add("đang lên")
        q["trich_dan"] += [t for t in a.get("trich_dan", []) if t.get("url")][:3]
        if a.get("mo_ta"):
            q["bang_chung"].append("Antigravity: " + a["mo_ta"][:160])

    khop = bo_khop_linh_vuc()
    for q in qs.values():
        q["khop_linh_vuc"] = q["khop_linh_vuc"] or khop(q["hien_thi"], q["khoa"])
        for cd in chu_de:
            if chuan_hoa(cd) and chuan_hoa(cd) in q["khoa"]:
                q["chu_de_me"].add(cd)

    pt = doc(tt + "phan_tich.json")
    html = None
    try:
        with open(tt + "bao_cao_html.txt", encoding="utf-8") as f:
            html = f.read().strip() or None
    except OSError:
        pass
    if html and not os.path.exists(os.path.join(GOC_PROJECT, html)):
        # lượt sau cùng ngày đã chuyển trang này vào tai_nguyen/phien_ban_cu/
        cu = os.path.join(os.path.dirname(html), "tai_nguyen", "phien_ban_cu", os.path.basename(html))
        html = cu if os.path.exists(os.path.join(GOC_PROJECT, cu)) else None
    luot = {
        "tien_to": os.path.relpath(tt.rstrip("_"), GOC_PROJECT),
        "thoi_diem": tong.get("thoi_diem"),
        "che_do": tong.get("che_do"),
        "chu_de": chu_de,
        "khung": tong.get("khung") or ["tuan"],
        "nguon_dat": "%d/%d" % (sum(1 for t in tong.get("trang_thai_nguon", []) if t.get("dat")),
                                len(tong.get("trang_thai_nguon", []))),
        "chrome": {ten: (doc(tt + ten + ".json", {}) or {}).get("trang_thai")
                   for ten in ("keyword_planner", "tiktok", "facebook") if os.path.exists(tt + ten + ".json")},
        "antigravity": ag.get("trang_thai") if ag else None,
        "co_phan_tich": bool(pt),
        "bao_cao_html": html,
    }
    return luot, qs, pt


# ---------- chấm điểm ----------

def cham(d, so_luot_gap):
    tang, quy_mo = [0.0], [0.0]
    for kh in KHUNG:
        x = d["khung"][kh]
        tang.append(diem_tang(x.get("gt_tang_so")))
        if x.get("gt_ti_le"):
            tang.append(min(1.0, max(0.0, x["gt_ti_le"] - 1) / 2))
        quy_mo += [thang_log(x.get("yt_luot_xem"), 7), thang_log(x.get("tt_luot_xem"), 8),
                   0.5 * (x.get("gt_top") or 0) / 100]
    c = d["chi_so"]
    tang.append(diem_tang(phan_tram(c.get("kp_doi_3_thang"))))
    if "tin nóng" in d["loai"] and c.get("rss_luong_tim"):
        tang.append(0.6)  # tin nóng trong ngày thường nguội sau 1–3 ngày
    quy_mo += [thang_log(c.get("kp_luot_so"), 6), thang_log(c.get("fb_cam_xuc"), 5),
               thang_log(c.get("rss_luong_tim"), 5),
               min(0.5, 0.1 * (c.get("ngach_so_lan") or 0) + (0.1 if len(d["nen_tang"]) > 1 else 0))]
    lan_toa = min(1.0, len(d["nen_tang"]) / 4 + (0.25 if "antigravity" in d["nguon"] else 0))
    lap_lai = min(1.0, (so_luot_gap - 1) / 3)
    tp = {"tang": round(max(tang), 2), "quy_mo": round(max(quy_mo), 2), "lan_toa": round(lan_toa, 2),
          "lap_lai": round(lap_lai, 2)}
    return round(100 * (0.4 * tp["tang"] + 0.3 * tp["quy_mo"] + 0.2 * tp["lan_toa"] + 0.1 * tp["lap_lai"])), tp


def loai_chinh(loai):
    for l in ("tin nóng", "câu hỏi bền", "đang lên", "tìm kiếm"):
        if l in loai:
            return l
    return "tìm kiếm"


def dung(thu_muc, ra):
    ds_tt = sorted(f[:-len("tong_hop.json")] for f in glob.glob(os.path.join(thu_muc, "*", "*_tong_hop.json")))
    dong, cac_luot, y_tuong = {}, [], []
    for tt in ds_tt:
        luot, qs, pt = quan_sat_luot(tt)
        cac_luot.append(luot)
        if pt and pt.get("y_tuong"):
            y_tuong = [dict(y, tien_to=luot["tien_to"], thoi_diem=luot["thoi_diem"]) for y in pt["y_tuong"]]
        for k, q in qs.items():
            d = dong.setdefault(k, {"khoa": k, "hien_thi": q["hien_thi"], "chu_de_me": set(), "loai": set(),
                                    "khop_linh_vuc": False, "nen_tang": set(), "nguon": set(),
                                    "khung": {kh: {} for kh in KHUNG}, "chi_so": {}, "bang_chung": [],
                                    "trich_dan": [], "luot": [], "lich_su": []})
            d["hien_thi"] = q["hien_thi"]
            for truong in ("chu_de_me", "loai", "nen_tang", "nguon"):
                d[truong] |= q[truong]
            d["khop_linh_vuc"] = d["khop_linh_vuc"] or q["khop_linh_vuc"]
            for kh in KHUNG:  # số của lượt mới nhất đè lên số cũ, từng ô
                d["khung"][kh].update({a: b for a, b in q["khung"][kh].items() if b is not None})
            d["chi_so"].update({a: b for a, b in q["chi_so"].items() if b is not None})
            d["bang_chung"] = (q["bang_chung"] + [b for b in d["bang_chung"] if b not in q["bang_chung"]])[:6]
            d["trich_dan"] = (q["trich_dan"] + d["trich_dan"])[:4]
            d["luot"].append(luot["tien_to"])
            diem_luot, _ = cham(dict(q, nguon=q["nguon"]), len(d["luot"]))
            d["lich_su"].append([luot["thoi_diem"], diem_luot])

    ket_qua = []
    for d in dong.values():
        diem, tp = cham(d, len(d["luot"]))
        nhom = "chu_de" if d["chu_de_me"] else ("linh_vuc" if d["khop_linh_vuc"] else "dai_chung")
        ket_qua.append({
            "khoa": d["khoa"], "hien_thi": d["hien_thi"], "nhom": nhom, "loai": loai_chinh(d["loai"]),
            "chu_de_me": sorted(d["chu_de_me"]), "nen_tang": [n for n in ("google", "youtube", "tiktok", "facebook")
                                                             if n in d["nen_tang"]],
            "nguon": sorted(d["nguon"]), "khung": {kh: v for kh, v in d["khung"].items() if v},
            "chi_so": d["chi_so"], "bang_chung": d["bang_chung"], "trich_dan": d["trich_dan"],
            "lan_gap": len(d["luot"]), "lan_dau": d["lich_su"][0][0], "lan_cuoi": d["lich_su"][-1][0],
            "lich_su": d["lich_su"][-12:], "diem_nong": diem, "thanh_phan": tp,
        })
    ket_qua.sort(key=lambda x: (-x["diem_nong"], x["khoa"]))
    so = {"cap_nhat_luc": cac_luot[-1]["thoi_diem"] if cac_luot else None, "so_luot": len(cac_luot),
          "luot": cac_luot[::-1], "y_tuong": y_tuong, "dong": ket_qua}
    tam = ra + ".tam"
    with open(tam, "w", encoding="utf-8") as f:
        json.dump(so, f, ensure_ascii=False, indent=1)
    os.replace(tam, ra)
    return so


def nhap_antigravity(thu_muc_kq, tien_to):
    """ket_qua.json (agent ghi) + kiem_tra_claude.json (Claude chạy lại script đối chiếu) → <tiền tố>_antigravity.json.
    Khẳng định thiếu trường tu_khoa thì vẫn ghi, kèm cảnh báo để Claude điền tay; sổ trend bỏ qua mục chưa có tu_khoa."""
    kq = doc(os.path.join(thu_muc_kq, "ket_qua.json"))
    kiem = doc(os.path.join(thu_muc_kq, "kiem_tra_claude.json"))
    if not kq:
        raise SystemExit("không có ket_qua.json trong %s: agent chưa làm đúng quy trình" % thu_muc_kq)
    if not kiem:
        raise SystemExit("chưa có kiem_tra_claude.json: chạy kiem_trich_dan.py kiem trước (SKILL.md bước 1b)")
    url = {n["id"]: n.get("url") for n in kq.get("nguon", [])}
    trang_thai = {k["id"]: k.get("trang_thai") for k in kiem.get("khang_dinh", [])}
    muc, thieu = [], []
    for k in kq.get("khang_dinh", []):
        if not k.get("tu_khoa"):
            thieu.append(k.get("id"))
        muc.append({"id": k.get("id"), "tu_khoa": k.get("tu_khoa"), "chu_de": k.get("chu_de"),
                    "nen_tang": [n for n in (k.get("nen_tang") or []) if n in ("google", "youtube", "tiktok", "facebook")]
                    if isinstance(k.get("nen_tang"), list) else
                    [n for n in [k.get("nen_tang")] if n in ("google", "youtube", "tiktok", "facebook")],
                    "khung": k.get("khung"), "mo_ta": k.get("noi_dung"), "kiem": trang_thai.get(k.get("id"), "khong_dat"),
                    "trich_dan": [{"url": url.get(t.get("nguon")), "nguyen_van": t.get("nguyen_van")}
                                  for t in k.get("trich_dan", [])]})
    ra = tien_to.rstrip("_") + "_antigravity.json"
    with open(ra, "w", encoding="utf-8") as f:
        json.dump({"thoi_diem": kq.get("thoi_diem_tra"), "trang_thai": "doc_duoc", "ma_phieu": kq.get("ma_phieu"),
                   "ghi_chu": "; ".join(kq.get("khong_tim_thay") or [])[:500] if isinstance(kq.get("khong_tim_thay"), list) else "",
                   "muc": muc}, f, ensure_ascii=False, indent=1)
    dem = {}
    for m in muc:
        dem[m["kiem"]] = dem.get(m["kiem"], 0) + 1
    return {"ra": ra, "so_khang_dinh": len(muc), "theo_kiem": dem, "thieu_tu_khoa": thieu}


def main():
    ap = argparse.ArgumentParser(description="Sổ trend: gộp các lượt săn trend, chấm điểm độ nóng")
    ap.add_argument("viec", choices=["dung", "xem", "antigravity"],
                    help="dung: dựng lại sổ; xem: in các dòng điểm cao; antigravity: chuyển kết quả Antigravity của một lượt")
    ap.add_argument("--ket-qua", help="(antigravity) thư mục ket_qua/<mã phiếu> của project TraCuu")
    ap.add_argument("--tien-to", help="(antigravity) tiền tố lượt, ví dụ du_lieu/trend/2026-10-28/0930")
    ap.add_argument("--thu-muc", default=GOC_TREND, help="thư mục dữ liệu trend (mặc định du_lieu/trend)")
    ap.add_argument("--ra", help="file sổ (mặc định <thư mục>/so_trend.json)")
    ap.add_argument("--top", type=int, default=10, help="số dòng in ra với lệnh xem")
    a = ap.parse_args()
    if a.viec == "antigravity":
        if not (a.ket_qua and a.tien_to):
            ap.error("antigravity cần --ket-qua và --tien-to")
        print(json.dumps(nhap_antigravity(a.ket_qua, a.tien_to), ensure_ascii=False, indent=1))
        return 0
    ra = a.ra or os.path.join(a.thu_muc, "so_trend.json")
    so = dung(a.thu_muc, ra) if a.viec == "dung" else doc(ra, {"dong": [], "so_luot": 0})
    tom_tat = {"so_trend": ra, "so_luot": so["so_luot"], "so_dong": len(so["dong"]),
               "theo_nhom": {n: sum(1 for d in so["dong"] if d["nhom"] == n) for n in ("chu_de", "linh_vuc", "dai_chung")},
               "diem_cao_nhat": [{"tu_khoa": d["hien_thi"], "diem": d["diem_nong"], "nhom": d["nhom"],
                                  "nen_tang": d["nen_tang"], "bang_chung": d["bang_chung"][:2]}
                                 for d in so["dong"][:a.top]]}
    print(json.dumps(tom_tat, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
