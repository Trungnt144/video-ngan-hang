#!/usr/bin/env python3
"""Tải lại trang nguồn của khối số trong tieu_chi_nen_tang.md và tìm từng câu trích; liệt kê dòng quá 90 ngày
và dòng chưa có câu trích (phải mở trang bằng trình duyệt để kiểm số).

Chạy từ gốc Media:  python3 -I skills/toi-uu-phan-phoi/scripts/doi_chieu_nguon.py
Dùng lại cách chuẩn hoá trang của skills/viet-chu-dang-video/scripts/doi_chieu_quy_dinh.py.
Mã thoát 1 khi có câu trích không còn trên trang tải được.
"""
import datetime as dt
import hashlib
import subprocess
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "viet-chu-dang-video" / "scripts"))
from kiem_dang import doc_gioi_han  # noqa: E402
from doi_chieu_quy_dinh import chuan, MIEN_MO_TAY  # noqa: E402


def main():
    ds = doc_gioi_han()
    tam = Path(tempfile.gettempdir()) / "doi_chieu_toi_uu_phan_phoi"
    tam.mkdir(exist_ok=True)
    trang, mo_tay, mat, chua_trich = {}, set(), [], {}
    for g in ds:
        url = g.get("url")
        if not url:
            continue
        if not g.get("trich"):
            chua_trich.setdefault(url, []).append(g["khoa"])
            continue
        if url not in trang:
            f = tam / (hashlib.md5(url.encode()).hexdigest() + ".html")
            subprocess.run(["curl", "-sL", "--compressed", "--max-time", "30", "-A", "Mozilla/5.0", "-o", str(f), url])
            trang[url] = chuan(f.read_text(encoding="utf-8", errors="replace")) if f.exists() else ""
            if len(trang[url]) < 3000 or any(m in url.split("/")[2] for m in MIEN_MO_TAY):
                mo_tay.add(url)
        co = chuan(g["trich"]) in trang[url]
        if not co and url not in mo_tay:
            mat.append(g)
        print("%-6s %s" % ("CÓ" if co else ("MỞ TAY" if url in mo_tay else "MẤT"), g["khoa"]))
    hom_nay = dt.date.today()
    qua_han = [g["khoa"] for g in ds if (hom_nay - dt.date.fromisoformat(g["ngay_doc"])).days > 90]
    print("\n%d dòng có câu trích: %d mất trên trang tải được" % (sum(1 for g in ds if g.get("url") and g.get("trich")), len(mat)))
    for g in mat:
        print("MẤT  %s | %s | \"%s\"" % (g["khoa"], g["url"], g["trich"]))
    for u in sorted(mo_tay):
        print("MỞ TAY", u)
    print("\nDòng chưa có câu trích (mở trang, tìm câu chứa số rồi điền ô trich):")
    for u, k in chua_trich.items():
        print("  %s\n    %s" % (u, ", ".join(k)))
    print("\nQuá 90 ngày: %s" % (", ".join(qua_han) or "không có"))
    sys.exit(1 if mat else 0)


if __name__ == "__main__":
    main()
