#!/usr/bin/env python3
"""Đo video và in sẵn dữ liệu để viết chữ đăng: video từng nền tảng (khổ, thời lượng), mốc chương, kịch bản.

Chạy từ gốc Media:  python3 -I skills/viet-chu-dang-video/scripts/do_video.py <thư mục video> [--json]
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chung  # noqa: E402


def do(thu_muc):
    thu_muc = chung.tuyet_doi(thu_muc)
    if not thu_muc.is_dir():
        raise SystemExit("không thấy thư mục %s" % thu_muc)
    ra = {"thu_muc": chung.tuong_doi(thu_muc), "video": {}, "canh_bao": []}
    for nen, p in chung.tim_video(thu_muc).items():
        v = chung.do_mp4(p)
        ra["video"][nen] = v
        kho_dung = "ngang" if nen == "youtube" else "doc"
        if v["kho"] != kho_dung:
            ra["canh_bao"].append("%s là bản %s nhưng đo ra khổ %s (%dx%d)" % (p.name, nen, v["kho"], v["rong"], v["cao"]))
    if not ra["video"]:
        ra["canh_bao"].append("không có file video ngoài cùng thư mục")
    chuong, nguon = chung.tim_chuong(thu_muc)
    ra["chuong"] = [{"giay": g, "moc": chung.dinh_dang_moc(g), "ten": t} for g, t in chuong]
    ra["nguon_chuong"] = nguon
    files, _ = chung.tim_kich_ban(thu_muc)
    ra["kich_ban"] = [chung.tuong_doi(p) for p in files]
    ngang = ra["video"].get("youtube")
    if ngang and chuong:
        if chuong[-1][0] >= ngang["giay"]:
            ra["canh_bao"].append("mốc chương cuối vượt thời lượng video: thoi_gian.json có thể là của bản dựng khác")
        if ngang["giay"] - chuong[-1][0] < 10 or any(b[0] - a[0] < 10 for a, b in zip(chuong, chuong[1:])):
            ra["canh_bao"].append("có chương dưới 10 giây: YouTube sẽ không hiện chương, gộp chương ngắn vào chương liền kề")
    doc = ra["video"].get("shorts")
    if doc and doc["giay"] > 180:
        ra["canh_bao"].append("bản shorts dài %.0f giây, quá 3 phút nên YouTube không xếp vào Shorts" % doc["giay"])
    db = thu_muc / "tai_nguyen" / "dang_bai"
    ra["chu_dang_co_san"] = sorted(f.name for f in db.glob("*.md")) if db.is_dir() else []
    return ra


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("thu_muc")
    ap.add_argument("--json", action="store_true", help="in JSON thay vì chữ")
    a = ap.parse_args()
    ra = do(a.thu_muc)
    if a.json:
        print(json.dumps(ra, ensure_ascii=False, indent=1))
        return
    print("Thư mục:", ra["thu_muc"])
    for nen, v in ra["video"].items():
        print("Video %s: %s · %dx%d · %.1f giây" % (nen, v["file"], v["rong"], v["cao"], v["giay"]))
    print("Chữ đăng có sẵn trong tai_nguyen/dang_bai/:", ", ".join(ra["chu_dang_co_san"]) or "(chưa có)")
    print("Kịch bản:", ", ".join(ra["kich_ban"]) or "(không có)")
    if ra["chuong"]:
        print("\nMốc chương (nguồn %s):" % ra["nguon_chuong"])
        for c in ra["chuong"]:
            print("%s %s" % (c["moc"], c["ten"]))
    else:
        print("\nKhông lấy được mốc chương:", ra["nguon_chuong"])
    for c in ra["canh_bao"]:
        print("NHẮC:", c)


if __name__ == "__main__":
    main()
