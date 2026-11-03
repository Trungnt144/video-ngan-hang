#!/usr/bin/env python3
"""Liệt kê video còn phải làm trong sổ nợ, đối chiếu với kênh YouTube và thư mục sản phẩm.

Sổ nợ có thể ghi chậm (ngày 01/11/2026 có 36 video đã lên kênh vẫn ghi "Đang chờ lệnh chạy"),
nên trạng thái từng video lấy từ ba nguồn thật, theo thứ tự:
  1. du_lieu/dang_youtube/so_trang_thai.jsonl: da_tai hoặc da_co → đã lên kênh
  2. thư mục sản phẩm (tìm qua du_lieu/pha_may/phieu/<mã>.json, rồi dòng tiêu đề "# ... N<mã> ..."
     của các file trong tai_nguyen/kich_ban/): video ngoài cùng có _cuoi hoặc tên theo tiêu đề
     → bản cuối chưa tải; có _nhap → bản nháp chờ duyệt; có giọng đọc → đang dở có giọng;
     chỉ có kịch bản → đang dở ở bước kịch bản
  3. không tìm thấy thư mục → chưa mở

Cách dùng (chạy ở gốc Media):
  python3 scripts/hang_con_lai.py                 # loạt ngân hàng, in bảng
  python3 scripts/hang_con_lai.py --loc "điện"    # lọc theo chữ trong tiêu đề hoặc dòng Loạt
  python3 scripts/hang_con_lai.py --json          # cho lịch kiểm của phiên điều phối đọc
Phiên điều phối giao việc từ nhóm "con_phai_lam" (chua_mo, do_kich_ban, do_co_giong).
"""
import argparse, json, re, sys
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent
NHOM_CON_LAM = ("do_co_giong", "do_kich_ban", "chua_mo")
TEN_NHOM = {
    "do_co_giong": "Đang dở, đã có giọng đọc",
    "do_kich_ban": "Đang dở, mới có kịch bản",
    "chua_mo": "Chưa mở",
    "ban_nhap": "Bản nháp chờ Trung duyệt",
    "ban_cuoi": "Bản cuối chưa tải lên",
    "da_len_kenh": "Đã lên kênh",
}


def doc_so_no(loc):
    """Các mục video trong phần "Đang chờ": [(mã, tiêu đề, dòng trạng thái)]."""
    muc, cur, phan = [], None, None
    for dong in (GOC / "so_no_cong_viec.md").read_text(encoding="utf-8").splitlines():
        if dong.startswith("## "):
            phan = dong
            continue
        if not phan or "Đang chờ" not in phan:
            continue
        m = re.match(r"^### (N\d+) — (.+)", dong)
        if m:
            cur = {"ma": m.group(1), "tieu_de": m.group(2), "loat": "", "trang_thai_so_no": ""}
            muc.append(cur)
        elif cur and dong.startswith("| Loạt"):
            cur["loat"] = dong
        elif cur and dong.startswith("| Trạng thái"):
            cur["trang_thai_so_no"] = dong.split("|")[2].strip()
    loc = loc.lower()
    return [m for m in muc if m["tieu_de"].lower().startswith(("video", "làm lại video"))
            and (loc in m["tieu_de"].lower() or loc in m["loat"].lower())]


def da_len_kenh():
    ma = {}
    p = GOC / "du_lieu/dang_youtube/so_trang_thai.jsonl"
    for dong in p.read_text(encoding="utf-8").splitlines():
        try:
            d = json.loads(dong)
        except ValueError:
            continue
        if d.get("trang_thai") in ("da_tai", "da_co") and d.get("videoId"):
            ma[str(d.get("ma", "")).upper()] = d["videoId"]
    return ma


def chi_muc_thu_muc():
    """Mã → thư mục sản phẩm, từ phiếu việc máy rồi từ dòng tiêu đề của file kịch bản."""
    ket = {}
    for kb in (GOC / "san_pham").glob("*/tai_nguyen/kich_ban/*.md"):
        try:
            dau = kb.open(encoding="utf-8").readline()
        except (OSError, UnicodeDecodeError):
            continue
        if dau.startswith("#"):
            for ma in re.findall(r"\bN\d+\b", dau)[:1]:
                ket.setdefault(ma, kb.parents[2])
    for ph in (GOC / "du_lieu/pha_may/phieu").glob("n*.json"):
        try:
            d = json.loads(ph.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            continue
        tm = GOC / str(d.get("san_pham", ""))
        if d.get("san_pham") and tm.is_dir():
            ket[str(d.get("ma", ph.stem)).upper()] = tm
    return ket


def trang_thai_thu_muc(tm, ma):
    video = [p.name for p in tm.glob("*.mp4")]
    if any("_cuoi" in v or not re.search(r"_v\d+", v) for v in video):
        return "ban_cuoi"
    if any("_nhap" in v for v in video):
        return "ban_nhap"
    # Giọng đọc nằm trong tai_nguyen/am_thanh/ khi đã giao, hoặc trong thư mục dựng xuong_html/n<số>_*/ khi đang dựng
    noi_giong = [tm / "tai_nguyen/am_thanh"] + list((GOC / "xuong_html").glob(ma.lower() + "_*"))
    if any(any(d.glob("**/*.wav")) or any(d.glob("**/*.mp3")) for d in noi_giong):
        return "do_co_giong"
    return "do_kich_ban"


def main():
    ap = argparse.ArgumentParser(description="Liệt kê video còn phải làm, đối chiếu kênh và thư mục sản phẩm.")
    ap.add_argument("--loc", default="ngân hàng", help='lọc theo chữ trong tiêu đề hoặc dòng Loạt (mặc định "ngân hàng")')
    ap.add_argument("--json", action="store_true", help="in JSON")
    a = ap.parse_args()

    kenh, thu_muc = da_len_kenh(), chi_muc_thu_muc()
    nhom = {k: [] for k in TEN_NHOM}
    for m in doc_so_no(a.loc):
        if m["ma"] in kenh:
            m["videoId"], tt = kenh[m["ma"]], "da_len_kenh"
        elif m["ma"] in thu_muc:
            m["thu_muc"] = str(thu_muc[m["ma"]].relative_to(GOC))
            tt = trang_thai_thu_muc(thu_muc[m["ma"]], m["ma"])
        elif re.search(r"bản nháp|bản cuối|xong", m["trang_thai_so_no"], re.I):
            tt = "ban_nhap"  # video làm trong thư mục của mã khác (ví dụ N165 làm lại N121), tin dòng Trạng thái
        else:
            tt = "chua_mo"
        nhom[tt].append(m)

    con_lam = [m for k in NHOM_CON_LAM for m in nhom[k]]
    if a.json:
        json.dump({"con_phai_lam": [{"ma": m["ma"], "nhom": k, "tieu_de": m["tieu_de"], "thu_muc": m.get("thu_muc")}
                                    for k in NHOM_CON_LAM for m in nhom[k]],
                   "dem": {k: len(v) for k, v in nhom.items()}}, sys.stdout, ensure_ascii=False, indent=1)
        print()
        return
    for k, ten in TEN_NHOM.items():
        print(f"\n{ten}: {len(nhom[k])}")
        if k == "da_len_kenh":
            continue
        for m in nhom[k]:
            print(f"  {m['ma']:5} {m['tieu_de'][:70]}" + (f"  [{m['thu_muc']}]" if m.get("thu_muc") else ""))
    print(f"\nCòn phải làm: {len(con_lam)} video" + (" → hết hàng" if not con_lam else ""))


if __name__ == "__main__":
    main()
