#!/usr/bin/env python3
"""Lấy trend tìm kiếm và video tại Việt Nam từ các nguồn không cần khoá (skill san-trend).

Nguồn (mỗi nguồn chịu lỗi riêng, nguồn hỏng không làm hỏng cả lượt):
  google_trends   RSS Google Trends "Trending now" geo=VN
  goi_y_google    gợi ý tìm kiếm Google (suggestqueries, client=firefox)
  goi_y_youtube   gợi ý tìm kiếm YouTube (như trên, ds=yt)
  playboard       video và Shorts xem nhiều nhất Việt Nam trong ngày (khối window.__NUXT__)
  noxinfluencer   video Việt Nam xem nhiều trong 24 giờ (HTML)
  ytdlp           thẻ (tags) của video thịnh hành + video lĩnh vực kênh đăng trong tuần, xếp theo lượt xem
  kham_pha        Google Trends trang khám phá theo khung 7/30/90 ngày: chuỗi mức quan tâm, truy vấn hàng đầu
                  và truy vấn tăng mạnh (bản 3.0, 28/10/2026)
  ngach           gợi ý tìm kiếm Google và YouTube cho "<chủ đề> + từ hỏi / chữ cái" để tìm từ khoá ngách (chỉ khi có chủ đề)
  youtube_khung   video đăng trong tuần / tháng / 90 ngày nhiều lượt xem nhất theo từng chủ đề. Từ 29/10/2026 gọi
                  YouTube Data API (search.list lọc Việt Nam, tiếng Việt) bằng khoá của skill dang-youtube, kèm độ vượt
                  trội (lượt xem chia trung vị 30 video gần nhất của cùng kênh) và bảng video phổ biến Việt Nam danh
                  mục Khoa học và Công nghệ; không có khoá hoặc API lỗi thì quay về cách đọc trang kết quả bằng yt-dlp

Kết quả lưu vào du_lieu/trend/yyyy-mm-dd/ của project Media, mỗi lượt một tiền tố giờ HHMM_:
  HHMM_<nguon>.json      dữ liệu đã tách của từng nguồn
  HHMM_google_trends.xml RSS thô
  HHMM_tong_hop.json     gom trùng, phân loại, khớp lĩnh vực, số lượt trước đã gặp
  HHMM_tong_hop.md       bản đọc cho Claude phân tích (bước 3 của SKILL.md)
Trang HTML thô chỉ lưu khi tách dữ liệu thất bại (để sửa bộ tách).

Chỉ dùng thư viện chuẩn Python 3.9. Không dùng pytrends (đã ngừng, trả 404). Dự phòng khi phần Google Trends hỏng:
trendspyg (~/.local/bin/trendspyg, xem SKILL.md).

Cách chạy (tại gốc project Media):
  python3 skills/san-trend/scripts/lay_trend.py
  python3 skills/san-trend/scripts/lay_trend.py --chi google_trends,goi_y_google
  python3 skills/san-trend/scripts/lay_trend.py --bo ytdlp
  python3 skills/san-trend/scripts/lay_trend.py --gom-lai du_lieu/trend/2026-10-26/1503
  python3 skills/san-trend/scripts/lay_trend.py --chu-de "điện gió" --khung thang,quy
"""
import argparse
import datetime as dt
import glob
import html as html_lib
import http.cookiejar
import json
import os
import re
import shutil
import subprocess
import sys
import time
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

THU_MUC_SKILL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GOC_PROJECT = os.path.dirname(os.path.dirname(THU_MUC_SKILL))
FILE_TU_KHOA = os.path.join(THU_MUC_SKILL, "tu_khoa_kenh.json")

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/130.0 Safari/537.36")
TAT_CA_NGUON = ["google_trends", "goi_y_google", "goi_y_youtube", "playboard", "noxinfluencer", "chu_de",
                "kham_pha", "ngach", "youtube_khung", "ytdlp"]
# Chế độ tập trung (có --chu-de): chỉ lấy RSS để biết chủ đề có đang nóng không, cộng phần riêng của từng chủ đề
NGUON_TAP_TRUNG = ["google_trends", "chu_de", "kham_pha", "ngach", "youtube_khung"]
# Nguồn chỉ chạy khi có chủ đề
NGUON_CAN_CHU_DE = ["chu_de", "ngach"]

# Khung thời gian (Trung chốt 28/10/2026: lấy khung có sẵn của từng nguồn, sổ trend cộng dồn các lượt).
# YouTube không có bộ lọc 90 ngày: khung quý lọc "năm nay" rồi giữ video đăng trong 90 ngày theo ngày đăng.
KHUNG = {
    "tuan": {"nhan": "7 ngày", "google": "now 7-d", "youtube_sp": "CAMSAggD", "so_ngay": 7},
    "thang": {"nhan": "30 ngày", "google": "today 1-m", "youtube_sp": "CAMSAggE", "so_ngay": 30},
    "quy": {"nhan": "90 ngày", "google": "today 3-m", "youtube_sp": "CAMSAggF", "so_ngay": 90},
}
URL_GT_API = "https://trends.google.com/trends/api/"
# Hậu tố ghép sau chủ đề để gợi ý tìm kiếm lộ ra từ khoá ngách. Chữ cái là các chữ đầu từ hay gặp trong tiếng Việt.
HAU_TO_NGACH = ["là gì", "tại sao", "cách", "có nên", "bao nhiêu", "so sánh", "ưu nhược điểm", "giá", "ở việt nam",
                "mới nhất"] + list("abcdghklmnpqstvx") + ["đ"]
SO_TU_KHAM_PHA_TOI_DA = 8

# YouTube Data API (Trung cho phép 29/10/2026, chỉ đọc). Khoá và token dùng chung với skill dang-youtube; hạn mức
# 10.000 đơn vị/ngày dùng chung với việc tải video: search.list 100 đơn vị, videos/channels/playlistItems 1 đơn vị.
KHOA_YT = os.path.join(os.path.expanduser("~"), ".config", "dang-youtube")
API_YT = "https://www.googleapis.com/youtube/v3/"
DANH_MUC_PHO_BIEN = {"28": "Khoa học và Công nghệ"}  # danh mục 27 Giáo dục trả 404 ở VN (kiểm 29/10/2026)
SO_KENH_VUOT_TROI_TOI_DA = 20
SO_VIDEO_TINH_TRUNG_VI = 30

URL_RSS = "https://trends.google.com/trending/rss?geo=VN"
URL_GOI_Y = "https://suggestqueries.google.com/complete/search"
URL_PLAYBOARD = {
    "video": "https://playboard.co/en/chart/video/most-viewed-all-videos-in-viet-nam-daily",
    "short": "https://playboard.co/en/chart/short/most-viewed-all-videos-in-viet-nam-daily",
}
URL_NOX = "https://www.noxinfluencer.com/youtube-video-rank/top-vn-all-video-day"
# Bộ lọc tìm kiếm YouTube: đăng trong tuần này, xếp theo lượt xem
SP_TUAN_THEO_LUOT_XEM = "CAMSAggD"

MAU_CAU_HOI = re.compile(
    r"(?<!\w)(là gì|là ai|cách|tại sao|vì sao|như thế nào|thế nào|có nên|bao nhiêu|"
    r"review|hướng dẫn|so sánh|có tốt không|ở đâu|khi nào)(?!\w)", re.IGNORECASE)


# ---------- tiện ích ----------

def tai(url, gian_cach, so_lan=2, timeout=25):
    """Tải một URL, thử lại một lần; giãn cách trước mỗi lần gọi."""
    loi = None
    for lan in range(so_lan):
        time.sleep(gian_cach if lan == 0 else gian_cach * 3)
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "vi,en;q=0.8"})
            with urllib.request.urlopen(req, timeout=timeout) as r:
                return r.read().decode("utf-8", errors="replace")
        except Exception as e:  # noqa: BLE001 — mọi lỗi mạng đều thử lại rồi báo lên
            loi = e
    raise RuntimeError("tải %s thất bại: %s" % (url, loi))


def chuan_hoa(chuoi):
    """Khoá so trùng: chữ thường, bỏ hashtag, biểu tượng, dấu câu; giữ dấu tiếng Việt."""
    s = unicodedata.normalize("NFC", chuoi or "").lower()
    s = re.sub(r"#\S+", " ", s)
    s = "".join(ch if (ch.isalnum() or ch.isspace()) else " " for ch in s)
    return re.sub(r"\s+", " ", s).strip()


def giai_chuoi_js(s):
    try:
        return json.loads('"' + s + '"')
    except ValueError:
        return s


def ghi_json(duong_dan, du_lieu):
    with open(duong_dan, "w", encoding="utf-8") as f:
        json.dump(du_lieu, f, ensure_ascii=False, indent=1)


# ---------- các nguồn ----------

def nguon_google_trends(ctx):
    xml = tai(URL_RSS, ctx["gian_cach"])
    with open(ctx["tien_to"] + "google_trends.xml", "w", encoding="utf-8") as f:
        f.write(xml)
    ns = {"ht": "https://trends.google.com/trending/rss"}
    goc = ET.fromstring(xml)
    ket_qua = []
    for i, item in enumerate(goc.iter("item"), 1):
        bai = []
        for n in item.findall("ht:news_item", ns):
            bai.append({
                "tieu_de": (n.findtext("ht:news_item_title", "", ns) or "").strip(),
                "bao": (n.findtext("ht:news_item_source", "", ns) or "").strip(),
                "url": (n.findtext("ht:news_item_url", "", ns) or "").strip(),
            })
        ket_qua.append({
            "hang": i,
            "tu_khoa": (item.findtext("title") or "").strip(),
            "luong_tim": (item.findtext("ht:approx_traffic", "", ns) or "").strip(),
            "thoi_diem": (item.findtext("pubDate") or "").strip(),
            "bai_bao": bai,
        })
    if not ket_qua:
        raise RuntimeError("RSS không có mục <item> nào — cấu trúc có thể đã đổi")
    return ket_qua


def danh_sach_truy_van(cau_hinh):
    truy_van = [(t, "tu_goc", None) for t in cau_hinh["tu_goc"]]
    for nhom, tu in cau_hinh["linh_vuc"].items():
        for kw in tu:
            for mau in cau_hinh["mau_ghep"]:
                truy_van.append((mau.format(kw=kw), "linh_vuc", nhom))
    return truy_van


def _goi_y(ctx, ds):
    ket_qua, loi = [], []
    for q, loai, nhom in danh_sach_truy_van(ctx["cau_hinh"]):
        tham_so = {"client": "firefox", "hl": "vi", "gl": "VN", "ie": "utf-8", "oe": "utf-8", "q": q}
        if ds:
            tham_so["ds"] = ds
        try:
            du = json.loads(tai(URL_GOI_Y + "?" + urllib.parse.urlencode(tham_so), ctx["gian_cach_goi_y"]))
            ket_qua.append({"truy_van": q, "loai_truy_van": loai, "nhom": nhom, "goi_y": du[1]})
        except Exception as e:  # noqa: BLE001
            loi.append("%s: %s" % (q, e))
    if not ket_qua:
        raise RuntimeError("không truy vấn nào thành công: " + "; ".join(loi[:3]))
    return {"ket_qua": ket_qua, "loi": loi}


def nguon_goi_y_google(ctx):
    return _goi_y(ctx, None)


def nguon_goi_y_youtube(ctx):
    return _goi_y(ctx, "yt")


def tach_playboard(html):
    i = html.find("window.__NUXT__")
    if i < 0:
        raise ValueError("không thấy window.__NUXT__")
    khoi = html[i:html.find("</script>", i)]
    ds = []
    for doan in khoi.split('{itemId:"')[1:]:
        v = re.search(r'video:\{videoId:"([^"]+)",title:"((?:[^"\\]|\\.)*)"', doan)
        if not v:
            continue
        hang = re.search(r"index:\{rank:(\d+)", doan)
        luot = re.search(r"playFluc:(\d+)", doan)
        kenh = re.search(r'channel:\{[^{}]*?name:"((?:[^"\\]|\\.)*)"', doan)
        ngay = re.search(r"publishedAt:(\d+)", doan)
        ds.append({
            "hang": int(hang.group(1)) if hang else len(ds) + 1,
            "video_id": v.group(1),
            "tieu_de": giai_chuoi_js(v.group(2)),
            "kenh": giai_chuoi_js(kenh.group(1)).strip() if kenh else "",
            "luot_xem_trong_ngay": int(luot.group(1)) if luot else None,
            "ngay_dang": dt.datetime.utcfromtimestamp(int(ngay.group(1))).strftime("%Y-%m-%d") if ngay else None,
        })
    if not ds:
        raise ValueError("khối __NUXT__ không có mục video nào")
    return ds


def nguon_playboard(ctx):
    ket_qua, loi = {}, []
    for loai, url in URL_PLAYBOARD.items():
        try:
            html = tai(url, ctx["gian_cach"])
        except Exception as e:  # noqa: BLE001
            loi.append("%s: %s" % (loai, e))
            continue
        try:
            ket_qua[loai] = tach_playboard(html)
        except ValueError as e:
            with open(ctx["tien_to"] + "playboard_%s_tho.html" % loai, "w", encoding="utf-8") as f:
                f.write(html)
            loi.append("%s: %s (đã lưu HTML thô)" % (loai, e))
    if not ket_qua:
        raise RuntimeError("; ".join(loi))
    return {"ket_qua": ket_qua, "loi": loi}


def nguon_noxinfluencer(ctx):
    html = tai(URL_NOX, ctx["gian_cach"])
    ds = []
    # Mỗi video có một thẻ <a href="/youtube/video-analytics/<id>" title="<tiêu đề>" ...> rồi tới khối lượt xem
    for m in re.finditer(r'<a href="/youtube/video-analytics/([\w-]{11})" title="([^"]*)"', html):
        sau = html[m.end():m.end() + 3000]
        kenh = re.search(r'<a href="/youtube/channel/[^"]+" title="([^"]*)"', sau)
        luot = re.search(r'detail-data view[^>]*>\s*([\d,]+)\s*Views', sau)
        ds.append({
            "hang": len(ds) + 1,
            "video_id": m.group(1),
            "tieu_de": unescape_html(m.group(2)),
            "kenh": unescape_html(kenh.group(1)) if kenh else "",
            "luot_xem_24h": int(luot.group(1).replace(",", "")) if luot else None,
        })
    if not ds:
        with open(ctx["tien_to"] + "noxinfluencer_tho.html", "w", encoding="utf-8") as f:
            f.write(html)
        raise RuntimeError("không tách được video nào (đã lưu HTML thô)")
    return ds


def unescape_html(s):
    return html_lib.unescape(s).strip()


def _ytdlp(args, timeout=90):
    lenh = ["yt-dlp", "--no-warnings", "--ignore-config", "--extractor-args", "youtube:lang=vi"] + args
    r = subprocess.run(lenh, capture_output=True, text=True, timeout=timeout)
    dong = [json.loads(l) for l in r.stdout.splitlines() if l.strip().startswith("{")]
    if r.returncode != 0 and not dong:
        dong_loi = (r.stderr or "").strip().splitlines()
        raise RuntimeError(dong_loi[-1] if dong_loi else "yt-dlp lỗi")
    return dong


def nguon_ytdlp(ctx):
    if not shutil.which("yt-dlp"):
        raise RuntimeError("máy chưa cài yt-dlp — bỏ qua nguồn này")
    ket_qua = {"the_video_thinh_hanh": [], "video_linh_vuc_trong_tuan": [], "loi": []}

    # (a) thẻ của các video thịnh hành đã lấy được ở Playboard / NoxInfluencer
    ung_vien = []
    pb = ctx["du_lieu"].get("playboard") or {}
    for loai in ("video", "short"):
        ung_vien += [v["video_id"] for v in (pb.get("ket_qua") or {}).get(loai, [])[:6]]
    ung_vien += [v["video_id"] for v in (ctx["du_lieu"].get("noxinfluencer") or [])[:5]]
    da_co = set()
    for vid in ung_vien:
        if vid in da_co or len(da_co) >= ctx["so_video_the"]:
            continue
        da_co.add(vid)
        time.sleep(ctx["gian_cach"])
        try:
            d = _ytdlp(["--skip-download", "-j", "https://www.youtube.com/watch?v=" + vid])[0]
            ket_qua["the_video_thinh_hanh"].append({
                "video_id": vid, "tieu_de": d.get("title"), "the": d.get("tags") or [],
                "the_loai": d.get("categories") or [], "luot_xem": d.get("view_count"),
                "ngay_dang": d.get("upload_date"),
            })
        except Exception as e:  # noqa: BLE001
            ket_qua["loi"].append("thẻ %s: %s" % (vid, e))

    # (b) video lĩnh vực kênh đăng trong tuần, xếp theo lượt xem
    for nhom, tu in ctx["cau_hinh"]["linh_vuc"].items():
        for kw in tu:
            time.sleep(ctx["gian_cach"])
            url = ("https://www.youtube.com/results?" +
                   urllib.parse.urlencode({"search_query": kw, "sp": SP_TUAN_THEO_LUOT_XEM}))
            try:
                for d in _ytdlp(["--flat-playlist", "-j", "--playlist-end", "5", url]):
                    ket_qua["video_linh_vuc_trong_tuan"].append({
                        "tu_khoa": kw, "nhom": nhom, "video_id": d.get("id"), "tieu_de": d.get("title"),
                        "kenh": d.get("channel"), "luot_xem": d.get("view_count"),
                        "thoi_luong_giay": d.get("duration"),
                    })
            except Exception as e:  # noqa: BLE001
                ket_qua["loi"].append("tìm %s: %s" % (kw, e))
    if not ket_qua["the_video_thinh_hanh"] and not ket_qua["video_linh_vuc_trong_tuan"]:
        raise RuntimeError("; ".join(ket_qua["loi"][:3]) or "không lấy được gì")
    return ket_qua


def nguon_chu_de(ctx):
    """Phần riêng của từng chủ đề Trung quy định: gợi ý tìm kiếm Google và YouTube, video YouTube trong tuần,
    và chủ đề có nằm trong 10 từ khoá Google Trends đang lên không. Lượt tìm hằng tháng (Keyword Planner),
    TikTok, Facebook theo chủ đề do Claude đọc trên Chrome, xem SKILL.md."""
    ds_chu_de = ctx["chu_de"]
    if not ds_chu_de:
        raise RuntimeError("không có chủ đề nào (chu_de_theo_doi trống và không có --chu-de)")
    rss = ctx["du_lieu"].get("google_trends") or []
    co_ytdlp = bool(shutil.which("yt-dlp"))
    ket_qua, loi = [], []
    for cd in ds_chu_de:
        muc = {"chu_de": cd["ten"], "nguon_chu_de": cd["nguon"], "goi_y_google": [], "goi_y_youtube": [],
               "video_tuan": [], "trong_google_trends": []}
        k = chuan_hoa(cd["ten"])
        for t in rss:
            if k and (k in chuan_hoa(t["tu_khoa"]) or chuan_hoa(t["tu_khoa"]) in k
                      or any(k in chuan_hoa(b["tieu_de"]) for b in t["bai_bao"])):
                muc["trong_google_trends"].append({"tu_khoa": t["tu_khoa"], "luong_tim": t["luong_tim"]})
        for q in (cd["ten"], cd["ten"] + " là gì"):
            for ds, truong in ((None, "goi_y_google"), ("yt", "goi_y_youtube")):
                tham_so = {"client": "firefox", "hl": "vi", "gl": "VN", "ie": "utf-8", "oe": "utf-8", "q": q}
                if ds:
                    tham_so["ds"] = ds
                try:
                    du = json.loads(tai(URL_GOI_Y + "?" + urllib.parse.urlencode(tham_so), ctx["gian_cach_goi_y"]))
                    for g in du[1]:
                        if g not in muc[truong] and chuan_hoa(g) != chuan_hoa(q):
                            muc[truong].append(g)
                except Exception as e:  # noqa: BLE001
                    loi.append("%s (%s): %s" % (q, truong, e))
        if co_ytdlp:
            time.sleep(ctx["gian_cach"])
            url = ("https://www.youtube.com/results?" +
                   urllib.parse.urlencode({"search_query": cd["ten"], "sp": SP_TUAN_THEO_LUOT_XEM}))
            try:
                for d in _ytdlp(["--flat-playlist", "-j", "--playlist-end", "8", url]):
                    if d.get("title"):
                        muc["video_tuan"].append({"video_id": d.get("id"), "tieu_de": d.get("title"),
                                                  "kenh": d.get("channel"), "luot_xem": d.get("view_count")})
            except Exception as e:  # noqa: BLE001
                loi.append("video tuần %s: %s" % (cd["ten"], e))
        ket_qua.append(muc)
    return {"ket_qua": ket_qua, "loi": loi}


class GoogleTrends:
    """Gọi các điểm truy cập của trang khám phá Google Trends (không tài liệu, không cần khoá; kiểm 28/10/2026).
    Phải mở trang chủ trước để có cookie, không thì trả 429. Gặp 429 liên tiếp thì dừng cả nguồn."""

    def __init__(self, gian_cach):
        self.gian_cach = gian_cach
        self.mo = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
        self.mo.addheaders = [("User-Agent", UA), ("Accept-Language", "vi-VN,vi;q=0.9")]
        self.da_mo_trang_chu = False
        self.bi_chan = False

    def _json(self, duong, tham_so):
        if self.bi_chan:
            raise RuntimeError("Google Trends đang chặn (429), bỏ các lần gọi còn lại")
        if not self.da_mo_trang_chu:
            self.mo.open("https://trends.google.com/trends/?geo=VN", timeout=25).read()
            self.da_mo_trang_chu = True
        url = URL_GT_API + duong + "?" + urllib.parse.urlencode(tham_so)
        for lan in range(3):
            time.sleep(self.gian_cach if lan == 0 else 20 * lan)
            try:
                tho = self.mo.open(url, timeout=25).read().decode("utf-8", errors="replace")
                return json.loads(tho[tho.find("{"):])
            except urllib.error.HTTPError as e:
                if e.code != 429:
                    raise
        self.bi_chan = True
        raise RuntimeError("Google Trends trả 429 ba lần liền")

    def _widget(self, duong, w):
        return self._json("widgetdata/" + duong, {"hl": "vi", "tz": "-420", "token": w["token"],
                                                   "req": json.dumps(w["request"], ensure_ascii=False)})

    def kham_pha(self, tu_khoa, khung):
        req = {"comparisonItem": [{"keyword": tu_khoa, "geo": "VN", "time": KHUNG[khung]["google"]}],
               "category": 0, "property": ""}
        d = self._json("explore", {"hl": "vi", "tz": "-420", "req": json.dumps(req, ensure_ascii=False)})
        w = {x["id"]: x for x in d.get("widgets", [])}
        kq = {"tu_khoa": tu_khoa, "khung": khung, "chuoi": None, "truy_van_top": [], "truy_van_tang": []}
        if "TIMESERIES" in w:
            ts = self._widget("multiline", w["TIMESERIES"])
            gt = [p["value"][0] for p in ts.get("default", {}).get("timelineData", []) if p.get("value")]
            if gt:
                ba = max(1, len(gt) // 3)
                dau, cuoi = sum(gt[:ba]) / ba, sum(gt[-ba:]) / ba
                kq["chuoi"] = {"so_diem": len(gt), "trung_binh": round(sum(gt) / len(gt), 1), "dinh": max(gt),
                               "dau_ky": round(dau, 1), "cuoi_ky": round(cuoi, 1),
                               "ti_le_tang": round(cuoi / dau, 2) if dau else None}
        if "RELATED_QUERIES" in w:
            rel = self._widget("relatedsearches", w["RELATED_QUERIES"])
            ds = rel.get("default", {}).get("rankedList", [])
            if ds:
                kq["truy_van_top"] = [{"truy_van": k["query"], "gia_tri": k.get("value")}
                                      for k in ds[0].get("rankedKeyword", [])[:25]]
            if len(ds) > 1:
                kq["truy_van_tang"] = [{"truy_van": k["query"], "tang": k.get("formattedValue"), "gia_tri": k.get("value")}
                                       for k in ds[1].get("rankedKeyword", [])[:25]]
        return kq


def tu_kham_pha(ctx):
    """Từ khoá đưa vào trang khám phá: chủ đề của lượt; chế độ đầy đủ thêm kham_pha_chung trong tu_khoa_kenh.json."""
    ds = [c["ten"] for c in ctx["chu_de"]]
    if ctx["che_do"] == "day_du":
        ds += ctx["cau_hinh"].get("kham_pha_chung", [])
    ket_qua, da_co = [], set()
    for t in ds:
        if chuan_hoa(t) not in da_co:
            da_co.add(chuan_hoa(t))
            ket_qua.append(t)
    return ket_qua[:SO_TU_KHAM_PHA_TOI_DA]


def nguon_kham_pha(ctx):
    tu = tu_kham_pha(ctx)
    if not tu:
        raise RuntimeError("không có từ khoá khám phá (chưa có chủ đề và kham_pha_chung trống)")
    gt = GoogleTrends(max(ctx["gian_cach"], 2.0))
    ket_qua, loi = [], []
    for kw in tu:
        for khung in ctx["khung"]:
            try:
                ket_qua.append(gt.kham_pha(kw, khung))
            except Exception as e:  # noqa: BLE001
                loi.append("%s (%s): %s" % (kw, KHUNG[khung]["nhan"], e))
    if not ket_qua:
        raise RuntimeError("; ".join(loi[:3]) or "không lấy được gì")
    return {"ket_qua": ket_qua, "loi": loi}


def nguon_ngach(ctx):
    """Từ khoá ngách: gợi ý tìm kiếm cho "<chủ đề> <hậu tố>". Gợi ý lộ ra từ nhiều hậu tố, hoặc có ở cả Google
    lẫn YouTube, xếp trước."""
    if not ctx["chu_de"]:
        raise RuntimeError("không có chủ đề nào")
    ket_qua, loi = [], []
    for cd in ctx["chu_de"]:
        goc = chuan_hoa(cd["ten"])
        dem = {}
        for hau_to in HAU_TO_NGACH:
            q = cd["ten"] + " " + hau_to
            for ds, nen in ((None, "google"), ("yt", "youtube")):
                tham_so = {"client": "firefox", "hl": "vi", "gl": "VN", "ie": "utf-8", "oe": "utf-8", "q": q}
                if ds:
                    tham_so["ds"] = ds
                try:
                    du = json.loads(tai(URL_GOI_Y + "?" + urllib.parse.urlencode(tham_so), ctx["gian_cach_goi_y"]))
                except Exception as e:  # noqa: BLE001
                    loi.append("%s (%s): %s" % (q, nen, e))
                    continue
                for g in du[1]:
                    k = chuan_hoa(g)
                    if not k or k in (goc, chuan_hoa(q)):
                        continue
                    m = dem.setdefault(k, {"goi_y": g, "nen_tang": [], "so_lan": 0, "hau_to": []})
                    m["so_lan"] += 1
                    if nen not in m["nen_tang"]:
                        m["nen_tang"].append(nen)
                    if hau_to not in m["hau_to"] and len(m["hau_to"]) < 4:
                        m["hau_to"].append(hau_to)
        ds_ngach = sorted(dem.values(), key=lambda m: (-len(m["nen_tang"]), -m["so_lan"], m["goi_y"]))
        ket_qua.append({"chu_de": cd["ten"], "so_goi_y": len(ds_ngach), "ngach": ds_ngach[:80]})
    if not any(k["ngach"] for k in ket_qua):
        raise RuntimeError("; ".join(loi[:3]) or "không có gợi ý nào")
    return {"ket_qua": ket_qua, "loi": loi}


def _yt_ma_truy_cap():
    with open(os.path.join(KHOA_YT, "client_secrets.json"), encoding="utf-8") as f:
        cs = json.load(f)
    cs = cs.get("web") or cs.get("installed") or cs
    with open(os.path.join(KHOA_YT, "request.token"), encoding="utf-8") as f:
        tk = json.load(f)
    du_lieu = urllib.parse.urlencode({"client_id": cs["client_id"], "client_secret": cs["client_secret"],
                                      "refresh_token": tk["refresh_token"], "grant_type": "refresh_token"}).encode()
    with urllib.request.urlopen(cs.get("token_uri", "https://oauth2.googleapis.com/token"), du_lieu, timeout=30) as r:
        return json.load(r)["access_token"]


def _yt_goi(ctx, duong, **q):
    ctx["yt_don_vi"] = ctx.get("yt_don_vi", 0) + (100 if duong == "search" else 1)
    req = urllib.request.Request(API_YT + duong + "?" + urllib.parse.urlencode(q),
                                 headers={"Authorization": "Bearer " + ctx["yt_ma"]})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise RuntimeError("API %s %s: %s" % (duong, e.code, e.read().decode("utf-8", "replace")[:200]))


def _yt_so_lieu(ctx, ids):
    """video_id -> {tieu_de, kenh, kenh_id, luot_xem, ngay_dang, thoi_luong_giay}"""
    kq = {}
    for i in range(0, len(ids), 50):
        d = _yt_goi(ctx, "videos", part="snippet,statistics,contentDetails", id=",".join(ids[i:i + 50]), maxResults=50)
        for v in d.get("items", []):
            m = re.match(r"P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", v["contentDetails"].get("duration", ""))
            giay = sum(int(x or 0) * k for x, k in zip(m.groups(), (86400, 3600, 60, 1))) if m else None
            kq[v["id"]] = {"tieu_de": v["snippet"]["title"], "kenh": v["snippet"]["channelTitle"],
                           "kenh_id": v["snippet"]["channelId"],
                           "luot_xem": int(v["statistics"].get("viewCount", 0)),
                           "ngay_dang": v["snippet"]["publishedAt"][:10].replace("-", ""), "thoi_luong_giay": giay}
    return kq


def _yt_trung_vi_kenh(ctx, kenh_ids):
    """kenh_id -> trung vị lượt xem của SO_VIDEO_TINH_TRUNG_VI video đăng gần nhất"""
    kq = {}
    for i in range(0, len(kenh_ids), 50):
        d = _yt_goi(ctx, "channels", part="contentDetails", id=",".join(kenh_ids[i:i + 50]), maxResults=50)
        for c in d.get("items", []):
            pl = c["contentDetails"]["relatedPlaylists"]["uploads"]
            ids = [x["contentDetails"]["videoId"] for x in
                   _yt_goi(ctx, "playlistItems", part="contentDetails", playlistId=pl,
                           maxResults=SO_VIDEO_TINH_TRUNG_VI).get("items", [])]
            xem = sorted(v["luot_xem"] for v in _yt_so_lieu(ctx, ids).values())
            if len(xem) >= 5:
                kq[c["id"]] = xem[len(xem) // 2] if len(xem) % 2 else (xem[len(xem) // 2 - 1] + xem[len(xem) // 2]) / 2
    return kq


def _youtube_khung_api(ctx):
    ctx["yt_ma"] = _yt_ma_truy_cap()
    tu = tu_kham_pha(ctx)
    bay_gio = dt.datetime.now(dt.timezone.utc)
    # Khung tháng nằm giữa: khi có cả tuần và quý thì lấy từ kết quả quý lọc theo ngày, đỡ 100 đơn vị mỗi từ
    goi_rieng = [k for k in ctx["khung"] if not (k == "thang" and {"tuan", "quy"} <= set(ctx["khung"]))]
    ket_qua, loi, tim = [], [], {}
    for kw in tu:
        for khung in goi_rieng:
            try:
                d = _yt_goi(ctx, "search", part="id", q=kw, type="video", order="viewCount", regionCode="VN",
                            relevanceLanguage="vi", maxResults=25 if khung == "tuan" else 50,
                            publishedAfter=(bay_gio - dt.timedelta(days=KHUNG[khung]["so_ngay"])).strftime("%Y-%m-%dT%H:%M:%SZ"))
                tim[(kw, khung)] = [x["id"]["videoId"] for x in d.get("items", []) if x["id"].get("videoId")]
            except Exception as e:  # noqa: BLE001
                loi.append("%s (%s): %s" % (kw, KHUNG[khung]["nhan"], e))
    so_lieu = _yt_so_lieu(ctx, sorted({i for ds in tim.values() for i in ds}))
    dem_kenh = {}
    for ds in tim.values():
        for i in ds[:10]:
            if i in so_lieu:
                dem_kenh[so_lieu[i]["kenh_id"]] = dem_kenh.get(so_lieu[i]["kenh_id"], 0) + 1
    kenh_xet = sorted(dem_kenh, key=lambda k: -dem_kenh[k])[:SO_KENH_VUOT_TROI_TOI_DA]
    try:
        trung_vi = _yt_trung_vi_kenh(ctx, kenh_xet)
    except Exception as e:  # noqa: BLE001
        trung_vi = {}
        loi.append("trung vị kênh: %s" % e)
    for kw in tu:
        for khung in ctx["khung"]:
            nguon_ids = tim.get((kw, khung)) or tim.get((kw, "quy")) or []
            moc = (bay_gio - dt.timedelta(days=KHUNG[khung]["so_ngay"])).strftime("%Y%m%d")
            ds = [dict(so_lieu[i], video_id=i) for i in nguon_ids if i in so_lieu and so_lieu[i]["ngay_dang"] >= moc]
            if not ds:
                continue
            for v in ds:
                tv = trung_vi.get(v["kenh_id"])
                v["trung_vi_kenh"] = tv
                v["vuot_troi"] = round(v["luot_xem"] / tv, 1) if tv else None
            ds.sort(key=lambda x: -x["luot_xem"])
            ket_qua.append({"tu_khoa": kw, "khung": khung, "video": ds[:8]})
    pho_bien = []
    for ma_dm, ten_dm in DANH_MUC_PHO_BIEN.items():
        try:
            d = _yt_goi(ctx, "videos", part="snippet,statistics", chart="mostPopular", regionCode="VN",
                        videoCategoryId=ma_dm, maxResults=25)
            pho_bien += [{"hang": n, "danh_muc": ten_dm, "video_id": v["id"], "tieu_de": v["snippet"]["title"],
                          "kenh": v["snippet"]["channelTitle"], "luot_xem": int(v["statistics"].get("viewCount", 0))}
                         for n, v in enumerate(d.get("items", []), 1)]
        except Exception as e:  # noqa: BLE001
            loi.append("phổ biến %s: %s" % (ten_dm, e))
    if not ket_qua and not pho_bien:
        raise RuntimeError("; ".join(loi[:3]) or "API không trả gì")
    return {"nguon_du_lieu": "youtube_data_api", "don_vi_han_muc": ctx["yt_don_vi"], "ket_qua": ket_qua,
            "pho_bien": pho_bien, "loi": loi}


def nguon_youtube_khung(ctx):
    """Video đăng trong khung, xếp theo lượt xem, cho từng từ khoá khám phá. API trước, yt-dlp khi API không dùng được."""
    if os.path.exists(os.path.join(KHOA_YT, "request.token")):
        try:
            return _youtube_khung_api(ctx)
        except Exception as e:  # noqa: BLE001
            print("[youtube_khung] API lỗi, chuyển sang yt-dlp: %s" % e, file=sys.stderr, flush=True)
            ctx["yt_loi_api"] = str(e)[:200]
    if not shutil.which("yt-dlp"):
        raise RuntimeError("máy chưa cài yt-dlp — bỏ qua nguồn này")
    tu = tu_kham_pha(ctx)
    hom_nay = dt.date.today()
    ket_qua, loi = [], []
    for kw in tu:
        for khung in ctx["khung"]:
            time.sleep(ctx["gian_cach"])
            url = ("https://www.youtube.com/results?" +
                   urllib.parse.urlencode({"search_query": kw, "sp": KHUNG[khung]["youtube_sp"]}))
            try:
                ds = [d for d in _ytdlp(["--flat-playlist", "-j", "--playlist-end", "12" if khung == "quy" else "8", url])
                      if d.get("title") and d.get("id")]
                if khung == "quy" and ds:
                    # bộ lọc "năm nay" rộng hơn 90 ngày: lấy ngày đăng từng video rồi cắt
                    ngay = {x.get("id"): x.get("upload_date") for x in
                            _ytdlp(["--skip-download", "-j"] + ["https://www.youtube.com/watch?v=" + d["id"] for d in ds],
                                   timeout=240)}
                    moc = (hom_nay - dt.timedelta(days=90)).strftime("%Y%m%d")
                    for d in ds:
                        d["upload_date"] = ngay.get(d["id"])
                    ds = [d for d in ds if (d.get("upload_date") or "") >= moc]
                ket_qua.append({"tu_khoa": kw, "khung": khung, "video": [
                    {"video_id": d["id"], "tieu_de": d.get("title"), "kenh": d.get("channel"),
                     "luot_xem": d.get("view_count"), "thoi_luong_giay": d.get("duration"),
                     "ngay_dang": d.get("upload_date")} for d in ds[:8]]})
            except Exception as e:  # noqa: BLE001
                loi.append("%s (%s): %s" % (kw, KHUNG[khung]["nhan"], e))
    if not ket_qua:
        raise RuntimeError("; ".join(loi[:3]) or "không lấy được gì")
    if ctx.get("yt_loi_api"):
        loi.insert(0, "API lỗi, đã dùng yt-dlp: " + ctx["yt_loi_api"])
    return {"nguon_du_lieu": "yt-dlp", "ket_qua": ket_qua, "loi": loi}


HAM_NGUON = {
    "google_trends": nguon_google_trends,
    "goi_y_google": nguon_goi_y_google,
    "goi_y_youtube": nguon_goi_y_youtube,
    "playboard": nguon_playboard,
    "noxinfluencer": nguon_noxinfluencer,
    "chu_de": nguon_chu_de,
    "kham_pha": nguon_kham_pha,
    "ngach": nguon_ngach,
    "youtube_khung": nguon_youtube_khung,
    "ytdlp": nguon_ytdlp,
}


# ---------- gom và phân loại ----------

def bo_khop_linh_vuc(cau_hinh):
    """Trả hàm tìm các từ lĩnh vực có trong một chuỗi. Từ viết hoa toàn bộ trong cấu hình (ví dụ "AI")
    so khớp phân biệt hoa thường, để không nhầm với chữ "ai" tiếng Việt ("ai ngờ", "là ai")."""
    hoa = sorted({t for t in cau_hinh["tu_loc_them"] if t.isupper()}, key=len, reverse=True)
    thuong = sorted({chuan_hoa(t) for t in cau_hinh["tu_loc_them"] if not t.isupper()}, key=len, reverse=True)
    mau_thuong = re.compile(r"(?<!\w)(" + "|".join(re.escape(t) for t in thuong if t) + r")(?!\w)")
    mau_hoa = re.compile(r"(?<!\w)(" + "|".join(re.escape(t) for t in hoa) + r")(?!\w)") if hoa else None

    def khop(chuoi):
        ket_qua = set(mau_thuong.findall(chuan_hoa(chuoi)))
        if mau_hoa:
            ket_qua.update(mau_hoa.findall(unicodedata.normalize("NFC", chuoi or "")))
        return sorted(ket_qua)
    return khop


# Bỏ â ê ô ă ĩ ũ vì tiếng Bồ Đào Nha, tiếng Pháp cũng có; tiêu đề tiếng Việt gần như luôn có một chữ dưới đây
CHU_VIET = re.compile(r"[đơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]", re.IGNORECASE)


def la_tieng_viet(chuoi):
    return bool(CHU_VIET.search(chuoi or ""))


def dem_lan_truoc(goc_trend, file_hien_tai):
    """Đếm mỗi khoá đã xuất hiện trong bao nhiêu lượt chạy trước (cộng dồn các lần Trung gọi)."""
    dem = {}
    so_luot = 0
    for f in sorted(glob.glob(os.path.join(goc_trend, "*", "*_tong_hop.json"))):
        if os.path.abspath(f) == os.path.abspath(file_hien_tai):
            continue
        try:
            with open(f, encoding="utf-8") as fh:
                cu = json.load(fh)
        except (OSError, ValueError):
            continue
        so_luot += 1
        for k in {m["khoa"] for m in cu.get("muc", [])}:
            dem[k] = dem.get(k, 0) + 1
    return dem, so_luot


def gom(du_lieu, cau_hinh, dem_cu):
    khop = bo_khop_linh_vuc(cau_hinh)
    muc = {}

    def them(text, nguon, loai, thong_tin, linh_vuc_tu_truy_van=None, chu_de=None, khung=None):
        k = chuan_hoa(text)
        if not k:
            return
        if linh_vuc_tu_truy_van and not khop(text) and chuan_hoa(linh_vuc_tu_truy_van).split(" là gì")[0] not in k:
            linh_vuc_tu_truy_van = None
        m = muc.setdefault(k, {"khoa": k, "hien_thi": text.strip(), "nguon": [], "loai": set(),
                               "khop_linh_vuc": set(), "chu_de_me": set(), "khung": set(), "chi_tiet": []})
        if nguon not in m["nguon"]:
            m["nguon"].append(nguon)
        m["loai"].add(loai)
        m["khop_linh_vuc"].update(khop(text))
        if linh_vuc_tu_truy_van:
            m["khop_linh_vuc"].add("truy vấn: " + linh_vuc_tu_truy_van)
        if chu_de:
            m["chu_de_me"].add(chu_de)
        if khung:
            m["khung"].add(khung)
        if MAU_CAU_HOI.search(text):
            m["loai"].add("câu hỏi bền")
        m["chi_tiet"].append(thong_tin)

    for t in du_lieu.get("google_trends") or []:
        them(t["tu_khoa"], "Google Trends", "tin nóng",
             {"luong_tim": t["luong_tim"], "bai_bao": [b["tieu_de"] + " (" + b["bao"] + ")" for b in t["bai_bao"]]})
    for ten, nguon in (("goi_y_google", "Gợi ý Google"), ("goi_y_youtube", "Gợi ý YouTube")):
        for kq in (du_lieu.get(ten) or {}).get("ket_qua", []):
            lv = kq["truy_van"] if kq["loai_truy_van"] == "linh_vuc" else None
            for i, g in enumerate(kq["goi_y"], 1):
                if chuan_hoa(g) == chuan_hoa(kq["truy_van"]):
                    continue
                them(g, nguon, "câu hỏi bền" if MAU_CAU_HOI.search(g) else "tìm kiếm",
                     {"truy_van": kq["truy_van"], "thu_tu": i}, lv)
    pb = (du_lieu.get("playboard") or {}).get("ket_qua", {})
    for loai, ds in pb.items():
        for v in ds:
            them(v["tieu_de"], "Playboard " + ("Shorts" if loai == "short" else "video"), "giải trí",
                 {"hang": v["hang"], "kenh": v["kenh"], "luot_xem_trong_ngay": v["luot_xem_trong_ngay"],
                  "url": "https://youtu.be/" + v["video_id"]})
    for v in du_lieu.get("noxinfluencer") or []:
        them(v["tieu_de"], "NoxInfluencer", "giải trí",
             {"hang": v["hang"], "kenh": v["kenh"], "luot_xem_24h": v["luot_xem_24h"],
              "url": "https://youtu.be/" + v["video_id"]})
    yt = du_lieu.get("ytdlp") or {}
    for v in yt.get("video_linh_vuc_trong_tuan", []):
        if v.get("tieu_de") and khop(v["tieu_de"]):
            them(v["tieu_de"], "YouTube tìm kiếm tuần", "video lĩnh vực",
                 {"tu_khoa": v["tu_khoa"], "kenh": v["kenh"], "luot_xem": v["luot_xem"],
                  "tieng_viet": la_tieng_viet(v["tieu_de"]), "url": "https://youtu.be/" + (v["video_id"] or "")})

    # Bản 3.0: khám phá Google Trends theo khung, từ ngách, video YouTube theo khung
    chu_de_lan = {chuan_hoa(c["ten"]): c["ten"] for c in (du_lieu.get("_chu_de") or [])}
    for kq in (du_lieu.get("kham_pha") or {}).get("ket_qua", []):
        cd = chu_de_lan.get(chuan_hoa(kq["tu_khoa"]))
        for t in kq["truy_van_tang"]:
            them(t["truy_van"], "Google Trends khám phá", "đang lên",
                 {"tu_khoa_goc": kq["tu_khoa"], "khung": kq["khung"], "tang": t["tang"], "gia_tri": t["gia_tri"]},
                 kq["tu_khoa"], cd, kq["khung"])
        for t in kq["truy_van_top"][:15]:
            them(t["truy_van"], "Google Trends khám phá", "tìm kiếm",
                 {"tu_khoa_goc": kq["tu_khoa"], "khung": kq["khung"], "muc_quan_tam": t["gia_tri"]},
                 kq["tu_khoa"], cd, kq["khung"])
    for kq in (du_lieu.get("ngach") or {}).get("ket_qua", []):
        for n in kq["ngach"][:40]:
            them(n["goi_y"], "Gợi ý ngách", "tìm kiếm",
                 {"chu_de": kq["chu_de"], "so_lan": n["so_lan"], "nen_tang": n["nen_tang"]}, kq["chu_de"], kq["chu_de"])
    for kq in (du_lieu.get("youtube_khung") or {}).get("ket_qua", []):
        cd = chu_de_lan.get(chuan_hoa(kq["tu_khoa"]))
        for v in kq["video"]:
            if v.get("tieu_de") and (khop(v["tieu_de"]) or chuan_hoa(kq["tu_khoa"]) in chuan_hoa(v["tieu_de"])):
                them(v["tieu_de"], "YouTube " + KHUNG[kq["khung"]]["nhan"], "video lĩnh vực",
                     {"tu_khoa": kq["tu_khoa"], "khung": kq["khung"], "kenh": v["kenh"], "luot_xem": v["luot_xem"],
                      "ngay_dang": v.get("ngay_dang"), "vuot_troi": v.get("vuot_troi"),
                      "url": "https://youtu.be/" + v["video_id"]},
                     kq["tu_khoa"], cd, kq["khung"])
    for v in (du_lieu.get("youtube_khung") or {}).get("pho_bien", []):
        them(v["tieu_de"], "YouTube phổ biến " + v["danh_muc"], "video lĩnh vực" if khop(v["tieu_de"]) else "giải trí",
             {"hang": v["hang"], "kenh": v["kenh"], "luot_xem": v["luot_xem"], "url": "https://youtu.be/" + v["video_id"]})

    # Khớp chéo: từ khoá Google Trends có nằm trong mục của nguồn khác không
    tat_ca = list(muc.values())
    for m in tat_ca:
        if "tin nóng" not in m["loai"] or len(m["khoa"]) < 3:
            continue
        mau = re.compile(r"(?<!\w)" + re.escape(m["khoa"]) + r"(?!\w)")
        for khac in tat_ca:
            if khac is m:
                continue
            if mau.search(khac["khoa"]):
                for n in khac["nguon"]:
                    if n not in m["nguon"]:
                        m["nguon"].append(n)

    ket_qua = []
    for m in tat_ca:
        loai = m["loai"]
        if "tin nóng" in loai:
            loai_chinh = "tin nóng"
        elif "câu hỏi bền" in loai:
            loai_chinh = "câu hỏi bền"
        elif "đang lên" in loai:
            loai_chinh = "đang lên"
        elif "giải trí" in loai:
            loai_chinh = "giải trí"
        elif "video lĩnh vực" in loai:
            loai_chinh = "video lĩnh vực"
        else:
            loai_chinh = "tìm kiếm"
        ket_qua.append({
            "khoa": m["khoa"],
            "hien_thi": m["hien_thi"],
            "loai": loai_chinh,
            "nguon": m["nguon"],
            "so_nguon": len(m["nguon"]),
            "khop_linh_vuc": sorted(m["khop_linh_vuc"]),
            "chu_de_me": sorted(m["chu_de_me"]),
            "khung": [k for k in KHUNG if k in m["khung"]],
            # tin nóng ngày và bảng xếp hạng ngày sống 1–3 ngày, video mất hơn 1 tuần mới dựng xong
            "nguoi_nhanh": loai_chinh in ("tin nóng", "giải trí"),
            "lan_truoc_da_gap": dem_cu.get(m["khoa"], 0),
            "chi_tiet": m["chi_tiet"][:5],
        })
    ket_qua.sort(key=lambda x: (0 if (x["khop_linh_vuc"] or x["chu_de_me"]) else 1, -x["so_nguon"],
                                -x["lan_truoc_da_gap"], x["khoa"]))
    return ket_qua


# ---------- bản đọc markdown ----------

def o(s):
    return str(s if s is not None else "").replace("|", "/").replace("\n", " ")


def viet_markdown(duong_dan, thoi_diem, trang_thai, muc, du_lieu, so_luot_cu, ham_khop):
    d = []
    d.append("# Tổng hợp trend thô — %s\n" % thoi_diem)
    d.append("> Sinh tự động bởi `skills/san-trend/scripts/lay_trend.py`. Đây là dữ liệu đầu vào, "
             "chưa phải báo cáo. Báo cáo là trang HTML do `ve_trang.py` vẽ.\n")
    d.append("Số lượt chạy trước được cộng dồn: %d.\n" % so_luot_cu)
    d.append("## 1. Trạng thái nguồn\n")
    d.append("| Nguồn | Kết quả | Số mục | Ghi chú |\n|---|---|---|---|")
    for t in trang_thai:
        d.append("| %s | %s | %s | %s |" % (t["nguon"], "đạt" if t["dat"] else "LỖI", o(t["so_muc"]), o(t["ghi_chu"])))

    khop = [m for m in muc if m["khop_linh_vuc"]]
    d.append("\n## 2. Mục khớp lĩnh vực kênh (%d mục)\n" % len(khop))
    d.append("| Mục | Loại | Nguồn | Từ khớp | Nguội nhanh | Lượt trước đã gặp | Chi tiết |\n|---|---|---|---|---|---|---|")
    for m in khop[:120]:
        ct = m["chi_tiet"][0] if m["chi_tiet"] else {}
        d.append("| %s | %s | %s | %s | %s | %d | %s |" % (
            o(m["hien_thi"]), m["loai"], o(", ".join(m["nguon"])), o(", ".join(m["khop_linh_vuc"])),
            "có" if m["nguoi_nhanh"] else "", m["lan_truoc_da_gap"], o(json.dumps(ct, ensure_ascii=False))[:160]))

    for cd in (du_lieu.get("chu_de") or {}).get("ket_qua", []):
        d.append("\n## Chủ đề: %s (%s)\n" % (cd["chu_de"], "Trung gõ lượt này" if cd["nguon_chu_de"] == "lan_nay"
                                                  else "danh sách cố định"))
        d.append("- Trong Google Trends hôm nay: %s" % (", ".join("%s (%s)" % (t["tu_khoa"], t["luong_tim"])
                                                                for t in cd["trong_google_trends"]) or "không"))
        d.append("- Gợi ý Google: %s" % "; ".join(cd["goi_y_google"]))
        d.append("- Gợi ý YouTube: %s" % "; ".join(cd["goi_y_youtube"]))
        for v in cd["video_tuan"]:
            d.append("- Video tuần: %s — %s (%s lượt xem)" % (o(v["tieu_de"]), o(v["kenh"]), o(v["luot_xem"])))

    kp = (du_lieu.get("kham_pha") or {}).get("ket_qua", [])
    if kp:
        d.append("\n## Google Trends khám phá theo khung (mức quan tâm 0–100 tương đối trong khung)\n")
        d.append("| Từ khoá | Khung | Đầu kỳ → cuối kỳ | Tỉ lệ tăng | Truy vấn tăng mạnh | Truy vấn hàng đầu |\n|---|---|---|---|---|---|")
        for k in kp:
            c = k["chuoi"] or {}
            d.append("| %s | %s | %s → %s | %s | %s | %s |" % (
                o(k["tu_khoa"]), KHUNG[k["khung"]]["nhan"], o(c.get("dau_ky")), o(c.get("cuoi_ky")), o(c.get("ti_le_tang")),
                o("; ".join("%s (%s)" % (t["truy_van"], t["tang"]) for t in k["truy_van_tang"][:10])),
                o("; ".join("%s (%s)" % (t["truy_van"], t["gia_tri"]) for t in k["truy_van_top"][:8]))))
    for kq in (du_lieu.get("ngach") or {}).get("ket_qua", []):
        d.append("\n## Từ khoá ngách: %s (%d gợi ý; xếp theo số nền tảng rồi số hậu tố lộ ra)\n" % (kq["chu_de"], kq["so_goi_y"]))
        d.append("; ".join("%s [%s, %d]" % (n["goi_y"], "+".join(n["nen_tang"]), n["so_lan"]) for n in kq["ngach"][:40]))
    ytk_du = du_lieu.get("youtube_khung") or {}
    ytk = ytk_du.get("ket_qua", [])
    if ytk:
        d.append("\n## Video YouTube theo khung, nhiều lượt xem nhất (nguồn: %s%s)\n" % (
            ytk_du.get("nguon_du_lieu", "yt-dlp"),
            ", %s đơn vị hạn mức API" % ytk_du["don_vi_han_muc"] if ytk_du.get("don_vi_han_muc") else ""))
        d.append("Vượt trội = lượt xem chia trung vị 30 video gần nhất của cùng kênh (chỉ có khi dùng API). "
                 "Từ 3 lần trở lên là video vượt trội: xem tiêu đề, hình thu nhỏ, góc kể.\n")
        d.append("| Từ khoá | Khung | Tiêu đề | Kênh | Lượt xem | Vượt trội | Ngày đăng |\n|---|---|---|---|---|---|---|")
        for k in ytk:
            for v in k["video"][:5]:
                d.append("| %s | %s | %s | %s | %s | %s | %s |" % (
                    o(k["tu_khoa"]), KHUNG[k["khung"]]["nhan"], o(v["tieu_de"]), o(v["kenh"]), o(v["luot_xem"]),
                    ("%s×" % v["vuot_troi"]) if v.get("vuot_troi") is not None else "", o(v.get("ngay_dang"))))
        vt = sorted({v["video_id"]: (v, k["tu_khoa"]) for k in ytk for v in k["video"]
                     if (v.get("vuot_troi") or 0) >= 3}.values(), key=lambda x: -x[0]["vuot_troi"])
        if vt:
            d.append("\n### Video vượt trội (từ 3 lần trung vị kênh trở lên)\n")
            d.append("| Vượt trội | Tiêu đề | Kênh | Lượt xem | Trung vị kênh | Từ khoá |\n|---|---|---|---|---|---|")
            for v, kw in vt[:20]:
                d.append("| %s× | %s | %s | %s | %s | %s |" % (v["vuot_troi"], o(v["tieu_de"]), o(v["kenh"]),
                                                            o(v["luot_xem"]), o(int(v["trung_vi_kenh"])), o(kw)))
    if ytk_du.get("pho_bien"):
        d.append("\n## YouTube phổ biến Việt Nam theo danh mục (API, bảng thịnh hành)\n")
        d.append("| Hạng | Danh mục | Tiêu đề | Kênh | Lượt xem |\n|---|---|---|---|---|")
        for v in ytk_du["pho_bien"][:25]:
            d.append("| %s | %s | %s | %s | %s |" % (v["hang"], v["danh_muc"], o(v["tieu_de"]), o(v["kenh"]), o(v["luot_xem"])))
    d.append("\n## 3. Google Trends Việt Nam (tin nóng, 10 mục mới nhất)\n")
    d.append("| Hạng | Từ khoá | Lượng tìm | Bài báo đầu |\n|---|---|---|---|")
    for t in du_lieu.get("google_trends") or []:
        bb = t["bai_bao"][0]["tieu_de"] + " (" + t["bai_bao"][0]["bao"] + ")" if t["bai_bao"] else ""
        d.append("| %d | %s | %s | %s |" % (t["hang"], o(t["tu_khoa"]), o(t["luong_tim"]), o(bb)))

    d.append("\n## 4. Gợi ý tìm kiếm theo từ gốc (câu hỏi đại chúng)\n")
    for ten, nhan in (("goi_y_google", "Google"), ("goi_y_youtube", "YouTube")):
        for kq in (du_lieu.get(ten) or {}).get("ket_qua", []):
            if kq["loai_truy_van"] == "tu_goc":
                d.append("- %s \"%s\": %s" % (nhan, kq["truy_van"], "; ".join(kq["goi_y"])))

    d.append("\n## 5. Gợi ý tìm kiếm theo từ lĩnh vực kênh\n")
    for ten, nhan in (("goi_y_google", "Google"), ("goi_y_youtube", "YouTube")):
        for kq in (du_lieu.get(ten) or {}).get("ket_qua", []):
            if kq["loai_truy_van"] == "linh_vuc":
                d.append("- %s \"%s\": %s" % (nhan, kq["truy_van"], "; ".join(kq["goi_y"])))

    yt = du_lieu.get("ytdlp") or {}
    d.append("\n## 6. Video lĩnh vực kênh đăng trong tuần, nhiều lượt xem nhất (YouTube)\n")
    d.append("Chỉ giữ video có từ lĩnh vực trong tiêu đề; video tiếng Việt xếp trước. "
             "Tìm kiếm YouTube không lọc theo nước, nên còn video nước ngoài.\n")
    d.append("| Từ khoá tìm | Tiêu đề | Kênh | Lượt xem | Tiếng Việt |\n|---|---|---|---|---|")
    da_in = set()
    ds6 = [v for v in yt.get("video_linh_vuc_trong_tuan", []) if v.get("tieu_de") and ham_khop(v["tieu_de"])]
    for v in sorted(ds6, key=lambda x: (not la_tieng_viet(x["tieu_de"]), -(x.get("luot_xem") or 0))):
        if v["video_id"] in da_in or len(da_in) >= 40:
            continue
        da_in.add(v["video_id"])
        d.append("| %s | %s | %s | %s | %s |" % (o(v["tu_khoa"]), o(v["tieu_de"]), o(v["kenh"]), o(v["luot_xem"]),
                                               "có" if la_tieng_viet(v["tieu_de"]) else ""))

    d.append("\n## 7. Video xem nhiều tại Việt Nam trong ngày (giải trí đại chúng)\n")
    pb = (du_lieu.get("playboard") or {}).get("ket_qua", {})
    for loai, nhan in (("video", "Playboard video"), ("short", "Playboard Shorts")):
        d.append("\n**%s**\n" % nhan)
        for v in pb.get(loai, [])[:20]:
            d.append("%d. %s — %s (%s lượt/ngày)" % (v["hang"], o(v["tieu_de"]), o(v["kenh"]), o(v["luot_xem_trong_ngay"])))
    d.append("\n**NoxInfluencer (24 giờ)**\n")
    for v in du_lieu.get("noxinfluencer") or []:
        d.append("%d. %s — %s (%s lượt)" % (v["hang"], o(v["tieu_de"]), o(v["kenh"]), o(v["luot_xem_24h"])))

    the = {}
    for v in yt.get("the_video_thinh_hanh", []):
        for t in v["the"]:
            k = chuan_hoa(t)
            if k:
                the[k] = the.get(k, 0) + 1
    d.append("\n## 8. Thẻ video phổ biến trong các video thịnh hành (yt-dlp)\n")
    d.append(", ".join("%s (%d)" % (k, n) for k, n in sorted(the.items(), key=lambda x: -x[1])[:40]) or "(không có)")

    with open(duong_dan, "w", encoding="utf-8") as f:
        f.write("\n".join(d) + "\n")


# ---------- chạy ----------

def gom_lai(a):
    tien_to = a.gom_lai.rstrip("_") + "_"
    with open(FILE_TU_KHOA, encoding="utf-8") as f:
        cau_hinh = json.load(f)
    file_tong_hop = tien_to + "tong_hop.json"
    with open(file_tong_hop, encoding="utf-8") as f:
        cu = json.load(f)
    du_lieu = {"_chu_de": cu.get("chu_de", [])}
    for ten in TAT_CA_NGUON:
        if os.path.exists(tien_to + ten + ".json"):
            with open(tien_to + ten + ".json", encoding="utf-8") as f:
                du_lieu[ten] = json.load(f)
    dem_cu, so_luot_cu = dem_lan_truoc(a.thu_muc, file_tong_hop)
    muc = gom(du_lieu, cau_hinh, dem_cu)
    ghi_json(file_tong_hop, {"thoi_diem": cu["thoi_diem"], "che_do": cu.get("che_do", "day_du"),
                             "chu_de": cu.get("chu_de", []), "khung": cu.get("khung", []),
                             "trang_thai_nguon": cu["trang_thai_nguon"],
                             "so_luot_truoc": so_luot_cu, "muc": muc})
    viet_markdown(tien_to + "tong_hop.md", cu["thoi_diem"], cu["trang_thai_nguon"], muc, du_lieu, so_luot_cu,
                  bo_khop_linh_vuc(cau_hinh))
    print(json.dumps({"tong_hop_md": tien_to + "tong_hop.md", "so_muc": len(muc),
                      "muc_khop_linh_vuc": sum(1 for m in muc if m["khop_linh_vuc"])}, ensure_ascii=False, indent=1))
    return 0


def main():
    ap = argparse.ArgumentParser(description="Lấy trend Việt Nam từ nguồn không khoá (skill san-trend)")
    ap.add_argument("--chi", help="chỉ chạy các nguồn này, cách nhau dấu phẩy: " + ",".join(TAT_CA_NGUON))
    ap.add_argument("--bo", help="bỏ các nguồn này, cách nhau dấu phẩy")
    ap.add_argument("--gian-cach", type=float, default=2.0, help="giây chờ trước mỗi lần gọi trang (mặc định 2)")
    ap.add_argument("--gian-cach-goi-y", type=float, default=1.0, help="giây chờ giữa các lần gọi gợi ý (mặc định 1)")
    ap.add_argument("--so-video-the", type=int, default=8, help="số video thịnh hành lấy thẻ bằng yt-dlp (mặc định 8)")
    ap.add_argument("--thu-muc", default=os.path.join(GOC_PROJECT, "du_lieu", "trend"), help="thư mục gốc lưu dữ liệu")
    ap.add_argument("--gom-lai", metavar="TIEN_TO",
                    help="không tải lại; gom lại từ dữ liệu một lượt đã lưu, ví dụ du_lieu/trend/2026-10-26/1503 "
                         "(dùng sau khi sửa tu_khoa_kenh.json)")
    ap.add_argument("--chu-de", help="chủ đề riêng cho lượt này, cách nhau dấu phẩy. Có tham số này là chế độ tập "
                                     "trung: chỉ lấy Google Trends và phần riêng của chủ đề, bỏ trend đại chúng")
    ap.add_argument("--khung", default="tuan,thang,quy",
                    help="khung thời gian cho phần khám phá và YouTube theo khung: tuan, thang, quy (mặc định cả ba)")
    a = ap.parse_args()
    if a.gom_lai:
        return gom_lai(a)
    khung = [k for k in KHUNG if k in (a.khung or "").split(",")]
    if not khung:
        ap.error("--khung phải có ít nhất một trong: tuan, thang, quy")

    with open(FILE_TU_KHOA, encoding="utf-8") as f:
        cau_hinh = json.load(f)
    chu_de = [{"ten": t.strip(), "nguon": "lan_nay"} for t in (a.chu_de or "").split(",") if t.strip()]
    da_co = {chuan_hoa(c["ten"]) for c in chu_de}
    for t in cau_hinh.get("chu_de_theo_doi", []):
        if t.strip() and chuan_hoa(t) not in da_co:
            chu_de.append({"ten": t.strip(), "nguon": "co_dinh"})
    che_do = "tap_trung" if a.chu_de else "day_du"

    nguon = list(NGUON_TAP_TRUNG if a.chu_de else TAT_CA_NGUON)
    if not chu_de:
        nguon = [n for n in nguon if n not in NGUON_CAN_CHU_DE]
    if a.chi:
        nguon = [n for n in TAT_CA_NGUON if n in a.chi.split(",")]
    if a.bo:
        nguon = [n for n in nguon if n not in a.bo.split(",")]

    bay_gio = dt.datetime.now()
    thu_muc_ngay = os.path.join(a.thu_muc, bay_gio.strftime("%Y-%m-%d"))
    os.makedirs(thu_muc_ngay, exist_ok=True)
    tien_to = os.path.join(thu_muc_ngay, bay_gio.strftime("%H%M") + "_")

    ctx = {"cau_hinh": cau_hinh, "gian_cach": a.gian_cach, "gian_cach_goi_y": a.gian_cach_goi_y,
           "so_video_the": a.so_video_the, "tien_to": tien_to, "du_lieu": {}, "chu_de": chu_de,
           "che_do": che_do, "khung": khung}
    trang_thai = []
    for ten in nguon:  # ytdlp đứng cuối vì dùng danh sách video của Playboard và NoxInfluencer
        bat_dau = time.time()
        print("[%s] đang lấy..." % ten, file=sys.stderr, flush=True)
        try:
            kq = HAM_NGUON[ten](ctx)
            ctx["du_lieu"][ten] = kq
            ghi_json(tien_to + ten + ".json", kq)
            if isinstance(kq, list):
                so_muc, loi = len(kq), []
            elif ten == "playboard":
                so_muc, loi = sum(len(v) for v in kq["ket_qua"].values()), kq["loi"]
            elif ten in ("chu_de", "kham_pha"):
                so_muc, loi = len(kq["ket_qua"]), kq["loi"]
            elif ten == "ngach":
                so_muc, loi = sum(len(x["ngach"]) for x in kq["ket_qua"]), kq["loi"]
            elif ten == "youtube_khung":
                so_muc, loi = sum(len(x["video"]) for x in kq["ket_qua"]), kq["loi"]
            elif ten == "ytdlp":
                so_muc = len(kq["the_video_thinh_hanh"]) + len(kq["video_linh_vuc_trong_tuan"])
                loi = kq["loi"]
            else:
                so_muc, loi = sum(len(x["goi_y"]) for x in kq["ket_qua"]), kq["loi"]
            trang_thai.append({"nguon": ten, "dat": True, "so_muc": so_muc,
                               "ghi_chu": ("%d lỗi lẻ: %s" % (len(loi), "; ".join(loi[:2]))) if loi else "",
                               "giay": round(time.time() - bat_dau, 1)})
        except Exception as e:  # noqa: BLE001 — một nguồn hỏng không dừng cả lượt
            trang_thai.append({"nguon": ten, "dat": False, "so_muc": 0, "ghi_chu": str(e)[:300],
                               "giay": round(time.time() - bat_dau, 1)})
        print("[%s] %s" % (ten, "đạt" if trang_thai[-1]["dat"] else "LỖI: " + trang_thai[-1]["ghi_chu"]),
              file=sys.stderr, flush=True)

    file_tong_hop = tien_to + "tong_hop.json"
    dem_cu, so_luot_cu = dem_lan_truoc(a.thu_muc, file_tong_hop)
    muc = gom(dict(ctx["du_lieu"], _chu_de=chu_de), cau_hinh, dem_cu)
    thoi_diem = bay_gio.strftime("%Y-%m-%d %H:%M")
    ghi_json(file_tong_hop, {"thoi_diem": thoi_diem, "che_do": che_do, "chu_de": chu_de, "khung": khung,
                             "trang_thai_nguon": trang_thai, "so_luot_truoc": so_luot_cu, "muc": muc})
    viet_markdown(tien_to + "tong_hop.md", thoi_diem, trang_thai, muc, ctx["du_lieu"], so_luot_cu,
                  bo_khop_linh_vuc(cau_hinh))

    dat = sum(1 for t in trang_thai if t["dat"])
    print(json.dumps({"thu_muc": thu_muc_ngay, "tien_to": tien_to.rstrip("_"), "che_do": che_do,
                      "chu_de": [c["ten"] for c in chu_de], "khung": khung, "tong_hop_md": tien_to + "tong_hop.md",
                      "nguon_dat": "%d/%d" % (dat, len(trang_thai)), "so_muc": len(muc),
                      "muc_khop_linh_vuc": sum(1 for m in muc if m["khop_linh_vuc"]),
                      "trang_thai": trang_thai}, ensure_ascii=False, indent=1))
    return 0 if dat else 1


if __name__ == "__main__":
    sys.exit(main())
