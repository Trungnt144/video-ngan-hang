#!/usr/bin/env python3
"""Ghép số liệu YouTube của video đã đăng với đặc điểm lúc làm (độ dài, công thức và bố cục hình thu nhỏ, ngày đăng)
để Claude rút bài học, rồi ghi một bản chụp vào sổ kết quả.

Chạy từ gốc Media:  python3 -I skills/toi-uu-phan-phoi/scripts/hoc_ket_qua.py [--json] [--khong-ghi]
Số liệu lấy từ du_lieu/bang_video/so_lieu_youtube.json (máy chủ bảng video làm mới 6 giờ một lần; muốn số mới thì
bấm "Cập nhật số liệu" trên thẻ chiến dịch). Ghép mã video với thư mục qua du_lieu/dang_youtube/so_trang_thai.jsonl.
"""
import argparse
import datetime as dt
import json
import re
import statistics
import sys
from pathlib import Path

GOC = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(GOC / "skills" / "viet-chu-dang-video" / "scripts"))
import chung  # noqa: E402  (đo thời lượng MP4 không cần ffprobe)
SO_LIEU = GOC / "du_lieu" / "bang_video" / "so_lieu_youtube.json"
SO_TAI = GOC / "du_lieu" / "dang_youtube" / "so_trang_thai.jsonl"
SO_LAN_DUNG = GOC / "du_lieu" / "toi_uu_phan_phoi" / "so_lan_dung.jsonl"
SO_KET_QUA = GOC / "du_lieu" / "toi_uu_phan_phoi" / "so_ket_qua.jsonl"
DU_TOI_THIEU = 10  # số video công khai tối thiểu trước khi rút bài học về một đặc điểm


def doc_jsonl(p):
    if not p.exists():
        return []
    return [json.loads(d) for d in p.read_text(encoding="utf-8").splitlines() if d.strip()]


CAU_HOI = re.compile(r"\?|\b(tại sao|vì sao|là gì|thế nào|ra sao|bao nhiêu|có nên|làm sao)\b", re.I)


def kieu_tieu_de(chu):
    """Ba kiểu tiêu đề của skill viet-chu-dang-video bước 5: câu hỏi, con số, liệt kê."""
    if CAU_HOI.search(chu):
        return "cau_hoi"
    if re.search(r"\d", chu):
        return "con_so"
    return "liet_ke"


def tieu_de_cua(thu_muc):
    """Tiêu đề đã chọn trong youtube.md, kiểu, số ký tự."""
    try:
        chu = chung.doc_chu_dang(thu_muc)["o"].get(("youtube_dai", "tieu_de"), "").strip()
    except (OSError, ValueError):
        chu = ""
    if not chu:
        return {}
    return {"tieu_de": chu, "ky_tu_tieu_de": len(chu), "kieu_tieu_de": kieu_tieu_de(chu)}


def thu_muc_cua(file):
    p = Path(file)
    try:
        return str(p.parent.relative_to(GOC))
    except ValueError:
        return str(p.parent)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--khong-ghi", action="store_true")
    a = ap.parse_args()
    if not SO_LIEU.exists():
        raise SystemExit("chưa có %s: bật bảng video (scripts/bang_video/mo_bang.sh) để lấy số liệu" % SO_LIEU)
    so_lieu = json.loads(SO_LIEU.read_text(encoding="utf-8"))
    chi_so = {}
    for ten, cd in so_lieu.get("chien_dich", {}).items():
        for ma, v in (cd.get("videos") or {}).items():
            chi_so[ma] = dict(v, chien_dich=ten)
    lan_dung = {}
    for d in doc_jsonl(SO_LAN_DUNG):
        lan_dung[d["thu_muc"]] = d
    hang = []
    for d in doc_jsonl(SO_TAI):
        ma = d.get("videoId")
        if not ma or ma not in chi_so:
            continue
        tm = thu_muc_cua(d["file"])
        h = {"thu_muc": tm, "videoId": ma, "ngay": d.get("publishAt") or d.get("thoi_gian")}
        h.update({k: v for k, v in chi_so[ma].items() if k not in ("len_lich",)})
        giay = ((lan_dung.get(tm) or {}).get("ban", {}).get("youtube_dai") or {}).get("giay")
        if giay is None and Path(d["file"]).exists():
            giay = round(chung.do_mp4(d["file"])["giay"])
        h["giay"] = giay
        hk = GOC / tm / "tai_nguyen" / "dang_bai" / "hinh_thu_nho.json"
        if hk.exists():
            k = json.loads(hk.read_text(encoding="utf-8"))
            # hinh_thu_nho.json: danh sách "hinh", bản đã chọn có id bằng "chon" (xuong_html/hinh_thu_nho/README.md)
            chon = next((x for x in k.get("hinh", []) if x.get("id") == k.get("chon")), k)
            h["cong_thuc"], h["bo_cuc"] = chon.get("cong_thuc"), chon.get("bo_cuc")
        h.update(tieu_de_cua(GOC / tm))
        hang.append(h)
    cong_khai = [h for h in hang if h.get("che_do") == "public"]
    ket = {"luc": dt.datetime.now().isoformat(timespec="seconds"), "so_lieu_luc": so_lieu.get("luc"),
           "tong": len(hang), "cong_khai": len(cong_khai), "hang": hang}
    if cong_khai:
        ket["trung_vi_luot_xem"] = statistics.median(h.get("luot_xem", 0) for h in cong_khai)
    if a.json:
        print(json.dumps(ket, ensure_ascii=False, indent=1))
    else:
        print("Số liệu lúc %s · %d video đã tải, %d công khai" % (ket["so_lieu_luc"], ket["tong"], ket["cong_khai"]))
        for h in sorted(hang, key=lambda x: -(x.get("luot_xem") or 0)):
            print("%-8s %-12s %-10s %6s xem %4s thích %4s bl · %s giây · %s · %s · tiêu đề %s %s ký tự · %s" % (
                h.get("che_do"), h["videoId"], (h.get("ngay") or "")[:10], h.get("luot_xem"), h.get("thich"),
                h.get("binh_luan"), h.get("giay") or "?", h.get("cong_thuc") or "-", h.get("bo_cuc") or "-",
                h.get("kieu_tieu_de") or "-", h.get("ky_tu_tieu_de") or "?", h["thu_muc"]))
        if len(cong_khai) < DU_TOI_THIEU:
            print("\nChưa đủ %d video công khai để rút bài học về một đặc điểm; chỉ ghi số, không sửa quy ước." % DU_TOI_THIEU)
    if not a.khong_ghi:
        SO_KET_QUA.parent.mkdir(parents=True, exist_ok=True)
        with SO_KET_QUA.open("a", encoding="utf-8") as f:
            f.write(json.dumps(ket, ensure_ascii=False) + "\n")


if __name__ == "__main__":
    sys.exit(main())
