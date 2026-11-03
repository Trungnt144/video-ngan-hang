#!/usr/bin/env python3
"""Tải lại trang nguồn của quy định và tìm từng câu trích (danh_sach_doi_chieu.json và khối số trong quy_dinh_nen_tang.md).

Chạy từ gốc Media:  python3 -I skills/viet-chu-dang-video/scripts/doi_chieu_quy_dinh.py [--nen-tang youtube|tiktok|facebook]
Trang tải về lưu tạm ở thư mục tạm của hệ thống. Trang Meta và một số trang TikTok chỉ hiện chữ khi chạy JavaScript:
script liệt kê các trang tải về quá ngắn ở cuối để Claude mở bằng trình duyệt và tìm câu trích bằng tay.
"""
import argparse
import hashlib
import html
import json
import re
import subprocess
import sys
import tempfile
import unicodedata
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chung  # noqa: E402

DANH_SACH = chung.THU_MUC_SKILL / "danh_sach_doi_chieu.json"


# Trang Meta trả về bản tiếng Việt hoặc trang chờ chạy JavaScript khi tải bằng curl (đo 27–28/10/2026):
# câu không thấy trên các trang này xếp vào nhóm mở bằng trình duyệt, không coi là mất.
MIEN_MO_TAY = ("facebook.com", "transparency.meta.com", "fb.com")


def chuan(s):
    s = s.replace("\\u003c", "<").replace("\\u003e", ">").replace("\\u0026", "&")
    s = html.unescape(s)
    s = re.sub(r"<[^>]+>", " ", s)
    for a, b in (("’", "'"), ("‘", "'"), ("“", '"'), ("”", '"'), ("\xa0", " "), ("\\u0027", "'"), ('\\"', '"')):
        s = s.replace(a, b)
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", s)).lower()


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--nen-tang")
    a = ap.parse_args()
    ds = json.loads(DANH_SACH.read_text(encoding="utf-8"))
    for m in chung.doc_quy_dinh().values():
        ds.append({"nen_tang": m["khoa"].split(".")[0], "ma": "khối số " + m["khoa"], "url": m["url"], "trich": m["trich"]})
    if a.nen_tang:
        ds = [x for x in ds if x["nen_tang"] == a.nen_tang]
    tam = Path(tempfile.gettempdir()) / "doi_chieu_quy_dinh"
    tam.mkdir(exist_ok=True)
    trang, ngan, mat = {}, set(), []
    for x in ds:
        url = x["url"]
        if url not in trang:
            f = tam / (hashlib.md5(url.encode()).hexdigest() + ".html")
            subprocess.run(["curl", "-sL", "--compressed", "--max-time", "30", "-A", "Mozilla/5.0", "-o", str(f), url])
            trang[url] = chuan(f.read_text(encoding="utf-8", errors="replace")) if f.exists() else ""
            if len(trang[url]) < 3000 or any(m in url.split("/")[2] for m in MIEN_MO_TAY):
                ngan.add(url)
        co = chuan(x["trich"]) in trang[url]
        if not co and url not in ngan:
            mat.append(x)
        print("%-6s %-9s %s" % ("CÓ" if co else ("MỞ TAY" if url in ngan else "MẤT"), x["nen_tang"], x["ma"]))
    print("\nTổng %d câu: %d mất trên trang tải được, %d trang phải mở bằng trình duyệt" % (len(ds), len(mat), len(ngan)))
    for x in mat:
        print("MẤT  %s | %s | \"%s\"" % (x["ma"], x["url"], x["trich"]))
    for u in sorted(ngan):
        print("MỞ TAY", u)
    sys.exit(1 if mat else 0)


if __name__ == "__main__":
    main()
