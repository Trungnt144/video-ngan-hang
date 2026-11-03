#!/usr/bin/env python3
"""Tìm từ khoá cho chữ đăng: trước hết tra dữ liệu san-trend có sẵn, rồi lấy gợi ý tìm kiếm Google và YouTube.

Chạy từ gốc Media:
  python3 -I skills/viet-chu-dang-video/scripts/goi_y_tu_khoa.py "<cụm từ>" [--luu <thư mục video>]
--luu ghi kết quả vào <thư mục video>/tai_nguyen/dang_bai/goi_y_tu_khoa_<yyyy.mm.dd>.json.
Không cần khoá. Lượt tìm hằng tháng (Keyword Planner) chỉ có khi Trung chạy san-trend chế độ tập trung.
"""
import argparse
import datetime as dt
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chung  # noqa: E402

URL_GOI_Y = "https://suggestqueries.google.com/complete/search"
HAU_TO = ["", "là gì", "hoạt động như thế nào", "cấu tạo", "tại sao"]


def tra_san_trend(cum_tu, toi_da=15):
    """Các chuỗi trong du_lieu/trend/**/*.json có chứa cụm từ, kèm file và số liệu đi kèm nếu có."""
    can = chung.nfc(cum_tu).lower()
    ra = []

    def duyet(nut, file):
        if isinstance(nut, dict):
            for gt in nut.values():
                if isinstance(gt, str) and can in chung.nfc(gt).lower():
                    ra.append({"file": file, "muc": {k: v for k, v in nut.items() if not isinstance(v, (dict, list))}})
                    break
            else:
                for gt in nut.values():
                    duyet(gt, file)
        elif isinstance(nut, list):
            for x in nut:
                if isinstance(x, str) and can in chung.nfc(x).lower():
                    ra.append({"file": file, "muc": x})
                else:
                    duyet(x, file)

    for f in sorted((chung.GOC_MEDIA / "du_lieu" / "trend").rglob("*.json"), reverse=True):
        try:
            duyet(json.loads(f.read_text(encoding="utf-8")), chung.tuong_doi(f))
        except (ValueError, OSError):
            continue
        if len(ra) >= toi_da:
            break
    return ra[:toi_da]


def goi_y(truy_van, youtube):
    tham_so = {"client": "firefox", "hl": "vi", "gl": "VN", "ie": "utf-8", "oe": "utf-8", "q": truy_van}
    if youtube:
        tham_so["ds"] = "yt"
    yeu_cau = urllib.request.Request(URL_GOI_Y + "?" + urllib.parse.urlencode(tham_so), headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(yeu_cau, timeout=20) as r:
        return json.loads(r.read().decode("utf-8"))[1]


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("cum_tu")
    ap.add_argument("--luu", help="thư mục video để lưu kết quả")
    a = ap.parse_args()
    kq = {"cum_tu": a.cum_tu, "ngay": dt.date.today().isoformat(), "san_trend": tra_san_trend(a.cum_tu),
          "google": {}, "youtube": {}, "loi": []}
    for hau_to in HAU_TO:
        q = ("%s %s" % (a.cum_tu, hau_to)).strip()
        for nguon, yt in (("google", False), ("youtube", True)):
            try:
                kq[nguon][q] = goi_y(q, yt)
            except Exception as e:  # noqa: BLE001
                kq["loi"].append("%s %s: %s" % (nguon, q, e))
            time.sleep(0.4)
    print("Dữ liệu san-trend có sẵn: %d mục" % len(kq["san_trend"]))
    for m in kq["san_trend"]:
        print("  ", m["file"], json.dumps(m["muc"], ensure_ascii=False)[:160])
    for nguon in ("youtube", "google"):
        print("\nGợi ý tìm kiếm %s:" % nguon)
        for q, ds in kq[nguon].items():
            print("  [%s] %s" % (q, " | ".join(ds[:8])))
    for x in kq["loi"]:
        print("LỖI", x)
    if a.luu:
        dich = chung.tuyet_doi(a.luu) / "tai_nguyen" / "dang_bai" / ("goi_y_tu_khoa_%s.json" % dt.date.today().strftime("%Y.%m.%d"))
        dich.parent.mkdir(parents=True, exist_ok=True)
        dich.write_text(json.dumps(kq, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print("\nĐã lưu", chung.tuong_doi(dich))


if __name__ == "__main__":
    main()
