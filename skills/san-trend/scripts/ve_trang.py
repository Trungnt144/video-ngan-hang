#!/usr/bin/env python3
"""Vẽ trang HTML báo cáo trend (skill san-trend) từ dữ liệu một lượt chạy.

Đầu vào, cùng tiền tố một lượt (ví dụ du_lieu/trend/2026-10-27/0930):
  <tien_to>_tong_hop.json + các file nguồn do lay_trend.py ghi
  <tien_to>_keyword_planner.json  lượt tìm hằng tháng, Claude đọc trên Chrome   (không bắt buộc)
  <tien_to>_tiktok.json           TikTok Creative Center, Claude đọc trên Chrome (không bắt buộc)
  <tien_to>_facebook.json         tìm kiếm bài viết Facebook, Claude đọc trên Chrome (không bắt buộc)
  <tien_to>_facebook_hub.json     Inspiration Hub của Trang Facebook, Claude đọc trên Chrome (không bắt buộc, 29/10/2026)
  <tien_to>_reputa.json           bản tin BFSI hằng tháng của Reputa trên brandsvietnam.com (không bắt buộc, 29/10/2026)
  <tien_to>_phan_tich.json        kết luận, ý tưởng, góc làm video do Claude viết (không bắt buộc)
  <tien_to>_antigravity.json      kết quả Antigravity rà cùng, đã đối chiếu trích dẫn (không bắt buộc, bản 3.0)
Cấu trúc các file Claude viết: skills/san-trend/cau_truc_du_lieu.md.

Ra: san_pham/yyyy.mm.dd.bao_cao_trend/yyyy.mm.dd.bao_cao_trend_v<n>.html (mỗi ngày một thư mục, tự tăng n trong ngày,
bản cũ hơn trong ngày chuyển vào tai_nguyen/phien_ban_cu/), một file tự chứa, không tải gì từ mạng. Đường dẫn trang
ghi thêm vào <tien_to>_bao_cao_html.txt để sổ trend và bảng video mở được trang của từng lượt.

Cách chạy (tại gốc project Media):
  python3 -I skills/san-trend/scripts/ve_trang.py --tien-to du_lieu/trend/2026-10-27/0930
"""
import argparse
import datetime as dt
import glob
import html
import json
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lay_trend import FILE_TU_KHOA, GOC_PROJECT, KHUNG, bo_khop_linh_vuc, chuan_hoa, la_tieng_viet  # noqa: E402

TEN_NEN_TANG = {"google": "Google", "youtube": "YouTube", "tiktok": "TikTok", "facebook": "Facebook"}
TEN_NGUON = {
    "google_trends": "Google Trends RSS", "goi_y_google": "Gợi ý tìm kiếm Google",
    "goi_y_youtube": "Gợi ý tìm kiếm YouTube", "playboard": "Playboard", "noxinfluencer": "NoxInfluencer",
    "chu_de": "Chủ đề (gợi ý, video tuần)", "ytdlp": "yt-dlp",
    "kham_pha": "Google Trends khám phá theo khung", "ngach": "Gợi ý tìm kiếm ngách",
    "youtube_khung": "YouTube theo khung",
}


def e(x):
    return html.escape("" if x is None else str(x))


def so(x):
    """Số nguyên có dấu chấm ngăn hàng nghìn; chuỗi giữ nguyên."""
    if isinstance(x, (int, float)):
        return "{:,}".format(int(x)).replace(",", ".")
    return e(x if x not in (None, "") else "—")


def doc(duong_dan):
    if not os.path.exists(duong_dan):
        return None
    with open(duong_dan, encoding="utf-8") as f:
        return json.load(f)


def bang(tieu_de_cot, dong, lop=""):
    if not dong:
        return '<p class="trong">Không có dữ liệu.</p>'
    d = ['<div class="cuon"><table class="%s"><thead><tr>' % lop]
    d += ["<th>%s</th>" % e(c) for c in tieu_de_cot]
    d.append("</tr></thead><tbody>")
    for r in dong:
        d.append("<tr>" + "".join("<td>%s</td>" % c for c in r) + "</tr>")
    d.append("</tbody></table></div>")
    return "".join(d)


def lien_ket(url, chu):
    return '<a href="%s" target="_blank" rel="noopener">%s</a>' % (e(url), e(chu)) if url else e(chu)


def nhan(chu, lop=""):
    return '<span class="nhan %s">%s</span>' % (lop, e(chu))


# ---------- các phần ----------

def phan_trang_thai(th, kp, tt, fb):
    dong = []
    for t in th.get("trang_thai_nguon", []):
        dong.append([e(TEN_NGUON.get(t["nguon"], t["nguon"])),
                     nhan("đạt", "tot") if t["dat"] else nhan("lỗi", "xau"), so(t["so_muc"]), e(t.get("ghi_chu"))])
    for ten, du, dem in (("Keyword Planner (Chrome)", kp, lambda x: len(x.get("tu_khoa", []))),
                         ("TikTok Creative Center (Chrome)", tt,
                          lambda x: len(x.get("hashtag", [])) + len(x.get("video", []))),
                         ("Facebook tìm bài (Chrome)", fb, lambda x: len(x.get("bai", [])))):
        if du is None:
            dong.append([e(ten), nhan("chưa chạy", "nhat"), "—", ""])
        else:
            ok = du.get("trang_thai") == "doc_duoc"
            dong.append([e(ten), nhan(du.get("trang_thai", "?"), "tot" if ok else "xau"), so(dem(du)),
                         e(du.get("ghi_chu"))])
    return bang(["Nguồn", "Kết quả", "Số mục", "Ghi chú"], dong)


def phan_chu_de(th, du, kp, tt, fb):
    ds = (du.get("chu_de") or {}).get("ket_qua", [])
    if not ds:
        return ""
    kp_theo = {}
    for r in (kp or {}).get("tu_khoa", []):
        kp_theo.setdefault(chuan_hoa(r.get("chu_de") or r.get("tu_khoa")), []).append(r)
    tt_theo = {chuan_hoa(r["chu_de"]): r for r in (tt or {}).get("chu_de", [])}
    fb_theo = {}
    for b in (fb or {}).get("bai", []):
        fb_theo.setdefault(chuan_hoa(b.get("tu_khoa")), []).append(b)

    dong, chi_tiet = [], []
    for cd in ds:
        k = chuan_hoa(cd["chu_de"])
        kp_r = kp_theo.get(k, [])
        luot = "<br>".join("%s: <b>%s</b>" % (e(r.get("tu_khoa")), e(r.get("luot_tim_thang"))) for r in kp_r) or "—"
        doi = "<br>".join("3 tháng %s · cùng kỳ %s" % (e(r.get("doi_3_thang", "—")), e(r.get("doi_cung_ky", "—")))
                          for r in kp_r) or "—"
        gt = ", ".join("%s (%s)" % (e(t["tu_khoa"]), e(t["luong_tim"])) for t in cd["trong_google_trends"])
        t = tt_theo.get(k)
        tiktok = ("%s · %s bài · %s lượt xem" % (e(t.get("hashtag")), so(t.get("bai_dang")), so(t.get("luot_xem")))
                  if t else "—")
        bai = sorted(fb_theo.get(k, []), key=lambda b: -(b.get("cam_xuc_so") or 0))
        face = ("%s: %s… (%s cảm xúc)" % (e(bai[0].get("trang")), e((bai[0].get("noi_dung") or "")[:80]),
                                           e(bai[0].get("cam_xuc"))) if bai else "—")
        vt = sorted(cd["video_tuan"], key=lambda v: (not la_tieng_viet(v["tieu_de"]), -(v.get("luot_xem") or 0)))
        video = ("%s (%s lượt xem)" % (lien_ket("https://youtu.be/%s" % vt[0]["video_id"], vt[0]["tieu_de"]),
                                       so(vt[0]["luot_xem"])) if vt else "—")
        ten = e(cd["chu_de"]) + (" " + nhan("lượt này", "nhat") if cd["nguon_chu_de"] == "lan_nay" else "")
        dong.append([ten, luot, doi, gt or "không", tiktok, face, video])
        chi_tiet.append(
            "<details><summary>%s: gợi ý tìm kiếm và video tuần</summary>"
            "<p><b>Google:</b> %s</p><p><b>YouTube:</b> %s</p>%s</details>" % (
                e(cd["chu_de"]), e("; ".join(cd["goi_y_google"])) or "—", e("; ".join(cd["goi_y_youtube"])) or "—",
                bang(["Video đăng trong tuần", "Kênh", "Lượt xem"],
                     [[lien_ket("https://youtu.be/%s" % v["video_id"], v["tieu_de"]), e(v["kenh"]), so(v["luot_xem"])]
                      for v in vt])))
    ghi_chu = ('<p class="ghi">Lượt tìm hằng tháng lấy từ Google Ads Keyword Planner, vị trí Việt Nam. Tài khoản chưa '
               'chạy quảng cáo chỉ thấy khoảng (ví dụ "1 N – 10 N" là 1.000–10.000 lượt mỗi tháng).</p>')
    return ('<section id="chu-de"><h2>Chủ đề theo dõi</h2>%s%s%s</section>' % (
        ghi_chu, bang(["Chủ đề", "Lượt tìm/tháng (Google)", "Thay đổi", "Trong Google Trends hôm nay",
                       "TikTok hashtag", "Facebook bài nổi bật", "YouTube video tuần nhiều lượt xem nhất"], dong),
        "".join(chi_tiet)))


def phan_y_tuong(pt, an_loai):
    if not pt:
        return ""
    the = []
    for i, y in enumerate([y for y in pt.get("y_tuong", []) if y.get("loai") not in an_loai], 1):
        nen = " ".join(nhan(n, "nen") for n in y.get("nen_tang", []))
        co = nhan("nguội nhanh", "xau") if y.get("nguoi_nhanh") else ""
        the.append(
            '<article class="the"><h3>%d. %s</h3><p>%s %s %s</p>'
            '<p class="mo">"%s"</p><dl><dt>Số liệu</dt><dd>%s</dd><dt>Bằng chứng</dt><dd>%s</dd>'
            '<dt>Góc làm video</dt><dd>%s</dd><dt>Rủi ro</dt><dd>%s</dd></dl></article>' % (
                i, e(y.get("ten")), nhan(y.get("loai", ""), "loai"), nen, co, e(y.get("cau_mo_dau")),
                e(y.get("so_lieu") or "—"), e(y.get("bang_chung")), e(y.get("goc")), e(y.get("rui_ro") or "không")))
    return '<section id="y-tuong"><h2>Ý tưởng đề xuất</h2><div class="luoi">%s</div></section>' % "".join(the)


def phan_google(du, cau_hinh):
    rss = du.get("google_trends") or []
    d = ["<h3>Google Trends Việt Nam: 10 từ khoá đang lên</h3>",
         bang(["Hạng", "Từ khoá", "Lượng tìm", "Bài báo đầu"],
              [[so(t["hang"]), e(t["tu_khoa"]), e(t["luong_tim"]),
                lien_ket(t["bai_bao"][0]["url"], "%s (%s)" % (t["bai_bao"][0]["tieu_de"], t["bai_bao"][0]["bao"]))
                if t["bai_bao"] else "—"] for t in rss])]
    for ten, nhan_ in (("goi_y_google", "Google"), ("goi_y_youtube", "YouTube")):
        ds = (du.get(ten) or {}).get("ket_qua", [])
        if not ds or ten == "goi_y_youtube":
            continue
        d.append("<details><summary>Gợi ý tìm kiếm %s theo từ lĩnh vực (%d truy vấn)</summary>%s</details>" % (
            nhan_, len(ds), bang(["Truy vấn", "Gợi ý"], [[e(k["truy_van"]), e("; ".join(k["goi_y"]))] for k in ds])))
    return "".join(d)


def phan_youtube(du, khop):
    yt = du.get("ytdlp") or {}
    ds = [v for v in yt.get("video_linh_vuc_trong_tuan", []) if v.get("tieu_de") and khop(v["tieu_de"])]
    da, dong = set(), []
    for v in sorted(ds, key=lambda x: (not la_tieng_viet(x["tieu_de"]), -(x.get("luot_xem") or 0))):
        if v["video_id"] in da or len(da) >= 30:
            continue
        da.add(v["video_id"])
        dong.append([e(v["tu_khoa"]), lien_ket("https://youtu.be/%s" % v["video_id"], v["tieu_de"]), e(v["kenh"]),
                     so(v["luot_xem"])])
    d = ["<h3>Video lĩnh vực kênh đăng trong tuần, nhiều lượt xem nhất</h3>",
         '<p class="ghi">Chỉ giữ video có từ lĩnh vực trong tiêu đề; video tiếng Việt xếp trước.</p>',
         bang(["Từ khoá tìm", "Video", "Kênh", "Lượt xem"], dong)]
    goi_y = (du.get("goi_y_youtube") or {}).get("ket_qua", [])
    if goi_y:
        d.append("<details><summary>Gợi ý tìm kiếm YouTube theo từ lĩnh vực (%d truy vấn)</summary>%s</details>" % (
            len(goi_y), bang(["Truy vấn", "Gợi ý"], [[e(k["truy_van"]), e("; ".join(k["goi_y"]))] for k in goi_y])))
    pb = (du.get("playboard") or {}).get("ket_qua", {})
    nox = du.get("noxinfluencer") or []
    if pb or nox:
        dong2 = [[e("Shorts" if loai == "short" else "Video"), so(v["hang"]),
                  lien_ket("https://youtu.be/%s" % v["video_id"], v["tieu_de"]), e(v["kenh"]),
                  so(v["luot_xem_trong_ngay"])] for loai, vs in pb.items() for v in vs[:10]]
        dong2 += [[e("Nox 24 giờ"), so(v["hang"]), lien_ket("https://youtu.be/%s" % v["video_id"], v["tieu_de"]),
                   e(v["kenh"]), so(v["luot_xem_24h"])] for v in nox]
        d.append("<details><summary>Video xem nhiều nhất Việt Nam trong ngày (giải trí đại chúng, %d mục)</summary>"
                 "%s</details>" % (len(dong2), bang(["Bảng", "Hạng", "Video", "Kênh", "Lượt xem"], dong2)))
    return "".join(d)


def phan_tiktok(tt):
    if tt is None:
        return '<p class="trong">Lượt này chưa đọc TikTok.</p>'
    if tt.get("trang_thai") != "doc_duoc":
        return '<p class="trong">TikTok: %s. %s</p>' % (e(tt.get("trang_thai")), e(tt.get("ghi_chu")))
    return ("<h3>Hashtag đang lên tại Việt Nam, 7 ngày</h3>" +
            bang(["Hạng", "Hashtag", "Ngành", "Bài đăng", "Lượt xem"],
                 [[so(h.get("hang")), e(h.get("hashtag")), e(h.get("nganh") or "—"), e(h.get("bai_dang")),
                   e(h.get("luot_xem"))] for h in tt.get("hashtag", [])]) +
            "<h3>Video nhiều lượt xem nhất, 7 ngày</h3>" +
            bang(["Hạng", "Tài khoản", "Ngành", "Người theo dõi", "Lượt xem"],
                 [[so(v.get("hang")), e(v.get("tai_khoan")), e(v.get("nganh") or "—"), e(v.get("nguoi_theo_doi")),
                   e(v.get("luot_xem"))] for v in tt.get("video", [])]))


def phan_facebook(fb, hub=None, rp=None):
    if fb is None:
        d = ['<p class="trong">Lượt này chưa đọc tìm kiếm bài viết Facebook.</p>']
    elif fb.get("trang_thai") != "doc_duoc":
        d = ['<p class="trong">Tìm kiếm bài viết Facebook: %s. %s</p>' % (e(fb.get("trang_thai")), e(fb.get("ghi_chu")))]
    else:
        d = ['<p class="ghi">Facebook không có bảng trend công khai: đây là bài đứng đầu kết quả tìm kiếm theo từng '
             'từ khoá, xếp theo lượt bày tỏ cảm xúc.</p>' +
             bang(["Từ khoá", "Trang / người đăng", "Ngày", "Nội dung", "Cảm xúc", "Bình luận / chia sẻ"],
                  [[e(b.get("tu_khoa")), e(b.get("trang")), e(b.get("ngay")), e(b.get("noi_dung")),
                    e(b.get("cam_xuc")), e(b.get("binh_luan_chia_se"))]
                   for b in sorted(fb.get("bai", []), key=lambda b: (b.get("tu_khoa") or "",
                                                                      -(b.get("cam_xuc_so") or 0)))])]
    # Inspiration Hub của Trang và bản tin Reputa (thêm 29/10/2026)
    if hub is not None:
        d.append("<h3>Inspiration Hub của Trang %s</h3>" % e(hub.get("trang")))
        if hub.get("trang_thai") != "doc_duoc":
            d.append('<p class="trong">%s. %s</p>' % (e(hub.get("trang_thai")), e(hub.get("ghi_chu"))))
        else:
            d.append('<p class="ghi">Danh mục %s. %s</p>' % (e(hub.get("danh_muc")), e(hub.get("ghi_chu"))))
            if hub.get("hashtag"):
                d.append(bang(["Hashtag", "Ghi chú"], [[e(h.get("hashtag")), e(h.get("ghi_chu"))]
                                                        for h in hub["hashtag"]]))
            if hub.get("reels"):
                d.append(bang(["Trang đăng", "Nội dung", "Lượt xem"],
                              [[e(r.get("trang")), e(r.get("noi_dung")), e(r.get("luot_xem"))] for r in hub["reels"]]))
    if rp is not None:
        d.append("<h3>Reputa: bản tin ngành BFSI %s</h3>" % e(rp.get("ky")))
        if rp.get("trang_thai") != "doc_duoc":
            d.append('<p class="trong">%s. %s</p>' % (e(rp.get("trang_thai")), e(rp.get("ghi_chu"))))
        else:
            d.append('<p class="ghi">%s · đăng %s · tổng %s lượt đề cập (gộp nhiều nền tảng mạng xã hội và báo). %s</p>' % (
                lien_ket(rp.get("url"), "brandsvietnam.com"), e(rp.get("ngay_dang")), e(rp.get("tong_de_cap")),
                e(rp.get("ghi_chu"))))
            if rp.get("chu_de"):
                d.append(bang(["Chủ đề", "Lượt đề cập", "Ghi chú"],
                              [[e(c.get("chu_de")), e(c.get("de_cap")), e(c.get("ghi_chu"))] for c in rp["chu_de"]]))
            if rp.get("ngan_hang"):
                d.append(bang(["Ngân hàng", "Lượt đề cập"],
                              [[e(n.get("ten")), e(n.get("de_cap"))] for n in rp["ngan_hang"]]))
    return "".join(d)


CSS = """
:root{--nen:#f7f7f5;--mat:#ffffff;--chu:#1d1d1b;--nhat:#6b6b66;--vien:#e3e2dc;--nhan:#eef0ff;--nhan-chu:#2b3a8f;
--tot:#e3f4e8;--tot-chu:#1e6b39;--xau:#fdecea;--xau-chu:#9a2a1f;--nhan2:#f1efe8;--lien:#2456c7}
@media (prefers-color-scheme:dark){:root{--nen:#151514;--mat:#1f1f1d;--chu:#ecebe6;--nhat:#a3a29b;--vien:#34332f;
--nhan:#252a4a;--nhan-chu:#c3cbff;--tot:#183323;--tot-chu:#9ad9ad;--xau:#3a1d1a;--xau-chu:#f3aaa1;--nhan2:#2a2926;
--lien:#8fb0ff}}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);
font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
header,main{max-width:1180px;margin:0 auto;padding:0 16px}header{padding-top:28px}
h1{font-size:26px;margin:0 0 4px}h2{font-size:20px;margin:36px 0 12px;padding-top:8px;border-top:1px solid var(--vien)}
h3{font-size:16px;margin:20px 0 8px}.phu{color:var(--nhat);margin:0}
nav{position:sticky;top:0;background:var(--nen);padding:10px 0;margin-top:14px;border-bottom:1px solid var(--vien);
display:flex;gap:6px;flex-wrap:wrap;z-index:2}nav a{padding:4px 10px;border-radius:14px;background:var(--mat);
border:1px solid var(--vien);color:var(--chu);text-decoration:none;font-size:13px}
a{color:var(--lien)}.ket-luan{background:var(--mat);border:1px solid var(--vien);border-radius:10px;padding:14px 18px}
.cuon{overflow-x:auto;background:var(--mat);border:1px solid var(--vien);border-radius:10px}
table{border-collapse:collapse;width:100%;font-size:14px}th,td{padding:7px 10px;text-align:left;vertical-align:top;
border-bottom:1px solid var(--vien)}th{font-weight:600;color:var(--nhat);font-size:12.5px;background:var(--nen)}
tr:last-child td{border-bottom:0}.nhan{display:inline-block;padding:1px 8px;border-radius:10px;font-size:12px;
background:var(--nhan2);color:var(--nhat)}.nhan.tot{background:var(--tot);color:var(--tot-chu)}
.nhan.xau{background:var(--xau);color:var(--xau-chu)}.nhan.nen,.nhan.loai{background:var(--nhan);color:var(--nhan-chu)}
.luoi{display:grid;grid-template-columns:repeat(auto-fill,minmax(330px,1fr));gap:12px}
.the{background:var(--mat);border:1px solid var(--vien);border-radius:10px;padding:14px 16px}
.the h3{margin:0 0 6px}.the .mo{font-size:16px;font-weight:600;margin:10px 0}.the dl{margin:0;font-size:14px}
.the dt{color:var(--nhat);font-size:12.5px;margin-top:8px}.the dd{margin:0}
details{margin:10px 0;background:var(--mat);border:1px solid var(--vien);border-radius:10px;padding:8px 12px}
summary{cursor:pointer;font-weight:600}.ghi{color:var(--nhat);font-size:13.5px}.trong{color:var(--nhat)}
footer{max-width:1180px;margin:40px auto;padding:0 16px;color:var(--nhat);font-size:13px}
"""


NHAN_KIEM = {"dat": "đạt", "dat_ban_luu": "đạt (bản lưu)", "da_kiem_tay": "Claude tự đối chiếu: khớp",
             "can_kiem_tay": "chưa kiểm, không dùng", "khong_dat": "không đạt"}
NHAN_TT_AG = {"doc_duoc": "đã gộp", "bo_qua": "bỏ qua", "het_gio": "hết giờ chờ"}


def phan_khung_ngach(du, ag):
    """Bản 3.0: truy vấn tăng mạnh theo khung 7/30/90 ngày, từ khoá ngách, kết quả Antigravity."""
    d = []
    kp = (du.get("kham_pha") or {}).get("ket_qua", [])
    if kp:
        dong = []
        for k in kp:
            c = k.get("chuoi") or {}
            dong.append([e(k["tu_khoa"]), e(KHUNG[k["khung"]]["nhan"]),
                         "%s → %s" % (so(c.get("dau_ky")), so(c.get("cuoi_ky"))) if c else "—",
                         "; ".join("%s %s" % (e(t["truy_van"]), nhan(t["tang"] or "", "tot"))
                                   for t in k["truy_van_tang"][:10]) or '<span class="trong">không có</span>'])
        d.append("<h3>Google Trends: truy vấn tăng mạnh theo khung</h3>")
        d.append('<p class="ghi">Mức quan tâm 0–100 là số tương đối trong khung, không phải lượt tìm. '
                 '"Đột phá" là tăng trên 5000%.</p>')
        d.append(bang(["Từ khoá", "Khung", "Mức quan tâm đầu → cuối kỳ", "Truy vấn tăng mạnh"], dong))
    for kq in (du.get("ngach") or {}).get("ket_qua", []):
        d.append("<h3>Từ khoá ngách: %s</h3>" % e(kq["chu_de"]))
        d.append('<p class="ghi">%d gợi ý; xếp theo số nền tảng có gợi ý rồi số hậu tố làm lộ ra.</p>' % kq["so_goi_y"])
        d.append("<p>%s</p>" % " · ".join("%s <span class=\"ghi\">(%s, %d)</span>" % (
            e(n["goi_y"]), "+".join(n["nen_tang"]), n["so_lan"]) for n in kq["ngach"][:30]))
    if ag:
        dong = [[e(a.get("tu_khoa")), e(", ".join(a.get("nen_tang") or [])), e(a.get("mo_ta")),
                 nhan(NHAN_KIEM.get(a.get("kiem"), a.get("kiem") or "?"),
                      "tot" if a.get("kiem") in ("dat", "dat_ban_luu", "da_kiem_tay") else "xau"),
                 "<br>".join(lien_ket(t.get("url"), (t.get("nguyen_van") or t.get("url") or "")[:90])
                             for t in a.get("trich_dan", [])[:2])]
                for a in ag.get("muc", [])]
        d.append("<h3>Antigravity rà cùng (%s)</h3>" % e(NHAN_TT_AG.get(ag.get("trang_thai"), ag.get("trang_thai"))))
        if ag.get("ghi_chu"):
            d.append('<p class="ghi">%s</p>' % e(ag["ghi_chu"]))
        d.append(bang(["Từ khoá", "Nền tảng", "Mô tả", "Đối chiếu", "Trích dẫn"], dong))
    return "".join(d)


def ve(tien_to, ra):
    th = doc(tien_to + "_tong_hop.json")
    if th is None:
        raise SystemExit("không thấy %s_tong_hop.json — chạy lay_trend.py trước" % tien_to)
    du = {}
    for ten in TEN_NGUON:
        x = doc("%s_%s.json" % (tien_to, ten))
        if x is not None:
            du[ten] = x
    kp, tt, fb, pt, ag, hub, rp = (doc("%s_%s.json" % (tien_to, t))
                                   for t in ("keyword_planner", "tiktok", "facebook", "phan_tich", "antigravity",
                                             "facebook_hub", "reputa"))
    with open(FILE_TU_KHOA, encoding="utf-8") as f:
        cau_hinh = json.load(f)
    khop = bo_khop_linh_vuc(cau_hinh)
    thu_tu = [n for n in cau_hinh.get("thu_tu_nen_tang", []) if n in TEN_NEN_TANG] or list(TEN_NEN_TANG)
    thu_tu += [n for n in TEN_NEN_TANG if n not in thu_tu]

    phan_nen = {"google": phan_google(du, cau_hinh), "youtube": phan_youtube(du, khop),
                "tiktok": phan_tiktok(tt), "facebook": phan_facebook(fb, hub, rp)}
    che_do = "Tập trung vào chủ đề" if th.get("che_do") == "tap_trung" else "Đầy đủ"
    chu_de = ", ".join(c["ten"] for c in th.get("chu_de", [])) or "không có"
    ngay = th["thoi_diem"]
    khung_ngach = phan_khung_ngach(du, ag)
    muc_luc = ([("chu-de", "Chủ đề")] if (du.get("chu_de") or {}).get("ket_qua") else []) + \
              ([("y-tuong", "Ý tưởng")] if pt else []) + \
              ([("khung", "Khung và ngách")] if khung_ngach else []) + [(n, TEN_NEN_TANG[n]) for n in thu_tu] + \
              [("nguon", "Trạng thái nguồn")]
    than = [
        "<header><h1>Báo cáo trend Việt Nam</h1>",
        '<p class="phu">Lượt chạy %s · chế độ %s · chủ đề: %s · lượt thứ %d được cộng dồn</p>' % (
            e(ngay), e(che_do), e(chu_de), th.get("so_luot_truoc", 0) + 1),
        "<nav>%s</nav></header><main>" % "".join('<a href="#%s">%s</a>' % (a, e(b)) for a, b in muc_luc),
    ]
    if pt and pt.get("ket_luan"):
        than.append('<h2>Kết luận</h2><div class="ket-luan">%s</div>' %
                    "".join("<p>%s</p>" % e(p) for p in re.split(r"\n\s*\n", pt["ket_luan"].strip())))
    than.append(phan_chu_de(th, du, kp, tt, fb))
    than.append(phan_y_tuong(pt, cau_hinh.get("an_loai", [])))
    if khung_ngach:
        than.append('<section id="khung"><h2>Khung tuần, tháng, quý và từ khoá ngách</h2>%s</section>' % khung_ngach)
    for n in thu_tu:
        than.append('<section id="%s"><h2>%s</h2>%s</section>' % (n, TEN_NEN_TANG[n], phan_nen[n]))
    if pt and pt.get("da_loai"):
        than.append("<h2>Đã loại</h2><p>%s</p>" % e(pt["da_loai"]))
    than.append('<section id="nguon"><h2>Trạng thái nguồn</h2>%s</section></main>' % phan_trang_thai(th, kp, tt, fb))
    than.append("<footer>Sinh bởi skill san-trend (project Media). Dữ liệu thô: %s_*. Lọc theo lĩnh vực kênh: "
                "khoa học năng lượng, AI cho dân ngân hàng.</footer>" % e(os.path.relpath(tien_to, GOC_PROJECT)))
    trang = ('<!doctype html><html lang="vi"><head><meta charset="utf-8">'
             '<meta name="viewport" content="width=device-width,initial-scale=1">'
             "<title>Báo cáo trend %s</title><style>%s</style></head><body>%s</body></html>" % (
                 e(ngay[:10]), CSS, "".join(than)))
    with open(ra, "w", encoding="utf-8") as f:
        f.write(trang)
    with open(tien_to + "_bao_cao_html.txt", "w", encoding="utf-8") as f:
        f.write(os.path.relpath(os.path.abspath(ra), GOC_PROJECT) + "\n")
    return ra


def ten_file_ra(tien_to):
    ngay = os.path.basename(os.path.dirname(os.path.abspath(tien_to)))  # yyyy-mm-dd
    try:
        d = dt.datetime.strptime(ngay, "%Y-%m-%d")
    except ValueError:
        d = dt.datetime.now()
    # Mỗi sản phẩm một thư mục (AGENTS.md mục Quy ước sản phẩm): bản mới nhất ngoài cùng, bản cũ vào tai_nguyen/phien_ban_cu/
    ten = d.strftime("%Y.%m.%d") + ".bao_cao_trend"
    thu_muc = os.path.join(GOC_PROJECT, "san_pham", ten)
    cu = os.path.join(thu_muc, "tai_nguyen", "phien_ban_cu")
    n = 1
    for f in glob.glob(os.path.join(thu_muc, ten + "_v*.*")) + glob.glob(os.path.join(cu, ten + "_v*.*")):
        m = re.match(re.escape(ten) + r"_v(\d+)\.", os.path.basename(f))
        if m:
            n = max(n, int(m.group(1)) + 1)
    for f in glob.glob(os.path.join(thu_muc, ten + "_v*.*")):
        os.makedirs(cu, exist_ok=True)
        os.replace(f, os.path.join(cu, os.path.basename(f)))
    os.makedirs(thu_muc, exist_ok=True)
    return os.path.join(thu_muc, "%s_v%d.html" % (ten, n))


def main():
    ap = argparse.ArgumentParser(description="Vẽ trang HTML báo cáo trend (skill san-trend)")
    ap.add_argument("--tien-to", required=True, help="tiền tố một lượt, ví dụ du_lieu/trend/2026-10-27/0930")
    ap.add_argument("--ra", help="đường dẫn file HTML ra (mặc định san_pham/yyyy.mm.dd.bao_cao_trend/yyyy.mm.dd.bao_cao_trend_v<n>.html)")
    a = ap.parse_args()
    tien_to = a.tien_to.rstrip("_")
    print(ve(tien_to, a.ra or ten_file_ra(tien_to)))


if __name__ == "__main__":
    main()
