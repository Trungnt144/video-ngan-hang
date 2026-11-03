#!/usr/bin/env python3
"""Sổ thói quen của skill san-trend: ghi mỗi lượt Trung dùng, đề xuất chỉnh cấu hình, áp dụng khi Trung duyệt.

Sổ: skills/san-trend/so_thoi_quen.jsonl (mỗi dòng một lượt). Cấu hình bị sửa: skills/san-trend/tu_khoa_kenh.json.
Quy tắc project Media: Trung duyệt mới ghi, nên `de-xuat` chỉ in đề xuất; `ap-dung` chỉ chạy sau khi Trung chọn.

  ghi     --json '<bản ghi>'   thêm một lượt (cấu trúc ở skills/san-trend/cau_truc_du_lieu.md)
  de-xuat                       in danh sách đề xuất dạng JSON (rỗng nếu chưa đủ dữ liệu)
  ap-dung --ma <mã>[,<mã>]      áp dụng đề xuất đã được Trung chọn vào tu_khoa_kenh.json
"""
import argparse
import datetime as dt
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from lay_trend import FILE_TU_KHOA, chuan_hoa  # noqa: E402

FILE_SO = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "so_thoi_quen.jsonl")
NEN_TANG = ["google", "youtube", "tiktok", "facebook"]

# Ngưỡng: chủ đề gõ tay từ 2 lượt thì đề nghị đưa vào danh sách cố định; chủ đề cố định có mặt 4 lượt gần nhất
# mà không ý tưởng nào được giữ thì đề nghị bỏ; một loại ý tưởng bị loại hết trong 5 lượt có loại đó thì đề nghị ẩn.
NGUONG_THEM = 2
NGUONG_BO = 4
NGUONG_AN = 5


def doc_so():
    if not os.path.exists(FILE_SO):
        return []
    with open(FILE_SO, encoding="utf-8") as f:
        return [json.loads(l) for l in f if l.strip()]


def doc_cau_hinh():
    with open(FILE_TU_KHOA, encoding="utf-8") as f:
        return json.load(f)


def ghi(json_ban_ghi):
    b = json.loads(json_ban_ghi)
    b.setdefault("thoi_diem", dt.datetime.now().strftime("%Y-%m-%d %H:%M"))
    for truong in ("chu_de_go", "chu_de_co_dinh", "y_tuong"):
        b.setdefault(truong, [])
    with open(FILE_SO, "a", encoding="utf-8") as f:
        f.write(json.dumps(b, ensure_ascii=False) + "\n")
    print("đã ghi lượt %s vào %s (%d lượt)" % (b["thoi_diem"], FILE_SO, len(doc_so())))


def de_xuat():
    so = doc_so()
    ch = doc_cau_hinh()
    co_dinh = {chuan_hoa(t): t for t in ch.get("chu_de_theo_doi", [])}
    ds = []

    # 1. chủ đề Trung gõ tay nhiều lượt
    dem_go = {}
    for b in so:
        for t in {chuan_hoa(x): x for x in b["chu_de_go"]}.items():
            dem_go.setdefault(t[0], [t[1], 0])[1] += 1
    for k, (ten, n) in sorted(dem_go.items(), key=lambda x: -x[1][1]):
        if n >= NGUONG_THEM and k not in co_dinh:
            ds.append({"ma": "them:" + ten, "loai": "them_chu_de", "gia_tri": ten,
                       "noi_dung": "Thêm \"%s\" vào danh sách chủ đề cố định" % ten,
                       "ly_do": "Trung đã gõ chủ đề này ở %d lượt" % n})

    # 2. chủ đề cố định không sinh ý tưởng được giữ
    for k, ten in co_dinh.items():
        luot = [b for b in so if k in {chuan_hoa(x) for x in b["chu_de_co_dinh"] + b["chu_de_go"]}][-NGUONG_BO:]
        if len(luot) < NGUONG_BO:
            continue
        giu = sum(1 for b in luot for y in b["y_tuong"] if y.get("giu") and chuan_hoa(y.get("chu_de", "")) == k)
        if giu == 0:
            ds.append({"ma": "bo:" + ten, "loai": "bo_chu_de", "gia_tri": ten,
                       "noi_dung": "Bỏ \"%s\" khỏi danh sách chủ đề cố định" % ten,
                       "ly_do": "%d lượt gần nhất có chủ đề này nhưng Trung không giữ ý tưởng nào từ nó" % NGUONG_BO})

    # 3. thứ tự nền tảng theo số ý tưởng được giữ
    dem_nen = {n: 0 for n in NEN_TANG}
    for b in so:
        for y in b["y_tuong"]:
            if y.get("giu"):
                for n in y.get("nen_tang", []):
                    if n in dem_nen:
                        dem_nen[n] += 1
    if sum(dem_nen.values()) >= 5:
        hien = [n for n in ch.get("thu_tu_nen_tang", NEN_TANG) if n in NEN_TANG]
        moi = sorted(NEN_TANG, key=lambda n: (-dem_nen[n], hien.index(n) if n in hien else 9))
        if moi != hien:
            ds.append({"ma": "thu_tu", "loai": "thu_tu_nen_tang", "gia_tri": moi,
                       "noi_dung": "Xếp các phần nền tảng trên trang HTML theo thứ tự " + ", ".join(moi),
                       "ly_do": "Số ý tưởng Trung giữ theo nền tảng: " +
                                ", ".join("%s %d" % (n, dem_nen[n]) for n in moi)})

    # 4. loại ý tưởng luôn bị loại
    an = set(ch.get("an_loai", []))
    theo_loai = {}
    for b in so:
        for loai in {y.get("loai") for y in b["y_tuong"] if y.get("loai")}:
            theo_loai.setdefault(loai, []).append(b)
    for loai, luot in theo_loai.items():
        luot = luot[-NGUONG_AN:]
        if loai in an or len(luot) < NGUONG_AN:
            continue
        if not any(y.get("giu") and y.get("loai") == loai for b in luot for y in b["y_tuong"]):
            ds.append({"ma": "an:" + loai, "loai": "an_loai", "gia_tri": loai,
                       "noi_dung": "Không hiện ý tưởng loại \"%s\" trong phần đề xuất nữa" % loai,
                       "ly_do": "%d lượt gần nhất có ý tưởng loại này, Trung không giữ cái nào" % NGUONG_AN})

    print(json.dumps({"so_luot_da_ghi": len(so), "de_xuat": ds}, ensure_ascii=False, indent=1))


def ap_dung(ma):
    ch = doc_cau_hinh()
    can = set(m.strip() for m in ma.split(",") if m.strip())
    import io
    import contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        de_xuat()
    ds = [d for d in json.loads(buf.getvalue())["de_xuat"] if d["ma"] in can]
    if len(ds) != len(can):
        raise SystemExit("mã không có trong đề xuất hiện tại: %s" % ", ".join(can - {d["ma"] for d in ds}))
    for d in ds:
        if d["loai"] == "them_chu_de":
            ch.setdefault("chu_de_theo_doi", []).append(d["gia_tri"])
        elif d["loai"] == "bo_chu_de":
            ch["chu_de_theo_doi"] = [t for t in ch.get("chu_de_theo_doi", [])
                                     if chuan_hoa(t) != chuan_hoa(d["gia_tri"])]
        elif d["loai"] == "thu_tu_nen_tang":
            ch["thu_tu_nen_tang"] = d["gia_tri"]
        elif d["loai"] == "an_loai":
            ch.setdefault("an_loai", []).append(d["gia_tri"])
        print("đã áp dụng: " + d["noi_dung"])
    with open(FILE_TU_KHOA, "w", encoding="utf-8") as f:
        f.write(json.dumps(ch, ensure_ascii=False, indent=2) + "\n")
    with open(FILE_SO, "a", encoding="utf-8") as f:
        f.write(json.dumps({"thoi_diem": dt.datetime.now().strftime("%Y-%m-%d %H:%M"), "su_kien": "ap_dung",
                            "ma": sorted(can), "chu_de_go": [], "chu_de_co_dinh": [], "y_tuong": []},
                           ensure_ascii=False) + "\n")


def main():
    ap = argparse.ArgumentParser(description="Sổ thói quen của skill san-trend")
    sub = ap.add_subparsers(dest="lenh", required=True)
    g = sub.add_parser("ghi")
    g.add_argument("--json", required=True)
    sub.add_parser("de-xuat")
    a_ = sub.add_parser("ap-dung")
    a_.add_argument("--ma", required=True)
    a = ap.parse_args()
    if a.lenh == "ghi":
        ghi(a.json)
    elif a.lenh == "de-xuat":
        de_xuat()
    else:
        ap_dung(a.ma)


if __name__ == "__main__":
    main()
