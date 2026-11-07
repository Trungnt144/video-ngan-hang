# chuoi_ket_xuat.py — chuỗi kết xuất và đo dùng chung cho video HTML một trang (LM-03), chạy nền (lập 04/11/2026, Trung
# chốt thử cách làm ba chặng sau báo cáo chi phí video ngân hàng N201–N205). Thay chuỗi lệnh tác tử dựng từng gõ tay
# và ngồi chờ: <mã>_kiem_het.sh, pha_may tao/chay, đo đứng hình cắt dải phụ đề, chép bản nháp.
#
#   1. chạy <mã>_tao_nhip.py của dự án nếu có (mốc theo giọng mới nhất); file nhạc trong nhip.json ngắn hơn video thì
#      chạy lại *_noi_nhac.sh của dự án với độ dài video + 6 giây (thêm 05/11/2026: ở lô 11 chặng C phải kết xuất lại
#      2–3 lần vì giọng đổi làm video dài hơn nhạc đã nối);
#   2. máy kiểm trang qua chỗ nhanh của hàng đợi (scripts/kiem_trang.mjs): quet_kiem, do_tu, do_hien, tuong_phan mỗi
#      2 giây, uoc_dung từng đoạn 90 giây;
#   3. ổ còn từ 15 GB thì ghi phiếu và chạy pha máy (scripts/pha_may/pha_may.mjs tao, chay --chi): kết xuất theo chương
#      có bộ đệm, chuẩn −14 LUFS, thay khung hỏng, đo độ to, đứng hình, bảng ảnh soát;
#   4. đo đứng hình cắt dải phụ đề (crop 1920×860, 10 khung/giây, n=−60 dB, d=1,5 giây; bài học N118 30/10/2026);
#   5. chép bản đủ ra bản nháp (--ban-nhap), bản nháp cũ chuyển vào tai_nguyen/ban_nhap/;
#   6. nghe lại mọi câu trên tiếng đã trộn nhạc của bản đủ (chuoi_giong.py --nghe-tron, Python của .venv_vieneu; thêm
#      04/11/2026 sau lần thử N207, N210: hai lỗi giọng N210 chỉ lộ khi có nhạc); câu đoạn tiếng không đổi không nghe lại;
#   7. ghi trạng thái và báo cáo dưới 3 KB.
#
# Dùng (gốc Media/, python3 hệ thống):
#   python3 -I scripts/chuoi_ket_xuat.py <thư mục dựng> <mã> --san-pham <thư mục sản phẩm> --ban-nhap <file .mp4> --nen
#   --chuong-sua 3,5   chương pha máy đã sửa (mã chương trong nhip.json), chỉ các chương này kết xuất lại
#   --chi-kiem-trang   chỉ chạy bước 1–2 (không kết xuất)      --bo-kiem-trang   bỏ bước 2
#   --khong-tao-nhip   không chạy <mã>_tao_nhip.py             --trang <file>    trang khác trang.html
#   --bo-nghe-tron     bỏ bước 6
# Chờ (thêm 05/11/2026, Trung chốt: mọi quãng chờ của tác tử con dưới 5 phút vì bộ nhớ đệm của tác tử con chỉ giữ 5 phút):
#   python3 -I scripts/chuoi_ket_xuat.py <thư mục dựng> <mã> --cho          chờ ket_xuat.trang_thai.json
#   python3 -I scripts/chuoi_ket_xuat.py <thư mục dựng> <mã> --cho-giong    chờ giong.trang_thai.json (chuỗi giọng chạy nền)
#   đọc trạng thái mỗi 10 giây, dừng sau tối đa --cho-giay giây (mặc định 270; tác tử con giữ mặc định, gọi qua Bash với
#   timeout 300000); in một dòng trạng thái. Mã thoát 0 xong, 1 lỗi hoặc tiến trình đã chết, 3 chưa xong (gọi lại).
#   Phiên giữ lô chạy nền với --cho-giay 3300 (thay cho_may.sh của phiên giữ lô 11).
# Ra, trong <thư mục dựng>/out/may/ (ngoài dấu vân tay mã của pha máy và ngoài git; đặt trong thư mục dựng ngoài out/ thì
# mỗi lần chạy đổi dấu vân tay, pha máy kết xuất lại cả video): ket_xuat.trang_thai.json, ket_xuat.bao_cao.md (dưới 3 KB), ket_xuat.chi_tiet.json,
# ket_xuat.log, kiem_trang/<lệnh>.json, nghe_tron.json (bước 6, từng câu). Báo cáo đầy đủ của pha máy vẫn ở du_lieu/pha_may/bao_cao/<mã>.md.

import argparse
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent
FFMPEG = GOC / "xuong_thu_hyperframes/bin/ffmpeg"
FFPROBE = GOC / "xuong_thu_hyperframes/bin/ffprobe"
HANG_DOI = GOC / "scripts/hang_doi_ket_xuat.sh"
KIEM = GOC / "scripts/kiem_trang.mjs"
PHA_MAY = GOC / "scripts/pha_may/pha_may.mjs"
PY_GIONG = GOC / ".venv_vieneu/bin/python"
O_TOI_THIEU_GB = 15
DOAN_UOC_DUNG = 90
CHO_MAC_DINH = 270  # giây; dưới 5 phút bộ nhớ đệm của tác tử con
CHO_TRAN = 3500  # giây; phiên giữ lô có bộ nhớ đệm 1 giờ
NGUONG = {"quet_kiem": "lỗi bố cục kiemTra", "do_tu": "đoạn quá 12 tiếng", "do_hien": "chữ hiện rõ dưới 1 giây",
          "tuong_phan": "chữ tương phản dưới 4,5:1", "uoc_dung": "cặp khung ước đứng dưới 0,6"}


def bay_gio():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def ghi_json(f, d):
    tam = f.with_suffix(f".{os.getpid()}.tam")
    tam.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    tam.replace(f)


def tuong_doi(p):
    try:
        return str(Path(p).resolve().relative_to(GOC))
    except ValueError:
        return str(p)


def node():
    return shutil.which("node") or str(Path.home() / ".local/bin/node")


def chay(lenh, **k):
    print(f"[{bay_gio()[11:]}] $ {' '.join(map(str, lenh))}", flush=True)
    r = subprocess.run([str(x) for x in lenh], cwd=GOC, capture_output=True, text=True, **k)
    print((r.stdout or "")[-3000:], (r.stderr or "")[-2000:], sep="\n", flush=True)
    return r


def con_trong_gb():
    st = os.statvfs("/")
    return st.f_bavail * st.f_frsize / 1e9


def con_song(pid):
    try:
        os.kill(int(pid), 0)
    except ProcessLookupError:
        return False
    except (PermissionError, ValueError, TypeError):
        return True
    return True


def cho(a):
    ten = "giong" if a.cho_giong else "ket_xuat"
    f = Path(a.du_an).resolve() / "out" / "may" / f"{ten}.trang_thai.json"
    han = max(10, min(a.cho_giay, CHO_TRAN))
    t0 = time.time()
    da_xet_chet = False
    while True:
        if not f.exists():
            print(f"{ten}: chưa có {tuong_doi(f)} (chưa gọi lệnh chạy nền?)")
            return 1
        tt = json.loads(f.read_text(encoding="utf-8"))
        giay = round(time.time() - t0)
        dong = (f"{ten} {a.ma}: {tt.get('trang_thai')} · bước {tt.get('buoc') or '-'} · bắt đầu {tt.get('bat_dau')} · "
                f"đã chờ {giay} giây")
        if tt.get("trang_thai") in ("xong", "loi"):
            print(dong + f" · lỗi: {tt.get('loi') or 'không'} · báo cáo: {tt.get('bao_cao') or '-'} · "
                  f"ổ còn {con_trong_gb():.0f} GB")
            return 0 if tt["trang_thai"] == "xong" else 1
        if tt.get("pid") and not con_song(tt["pid"]):
            if da_xet_chet:
                print(dong + f" · tiến trình PID {tt['pid']} đã dừng mà trạng thái vẫn {tt.get('trang_thai')}: đọc nhật ký "
                      f"out/may/{ten}.log, báo phiên giữ lô")
                return 1
            da_xet_chet = True  # tiến trình vừa thoát có thể chưa kịp ghi trạng thái cuối
            time.sleep(15)
            continue
        if giay + 10 > han:
            print(dong + f" · chưa xong sau {han} giây: gọi lại lệnh này")
            return 3
        time.sleep(10)


def do_dai(f):
    r = subprocess.run([str(FFPROBE), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                       capture_output=True, text=True)
    try:
        return float(r.stdout.strip())
    except ValueError:
        return 0.0


def noi_lai_nhac(du_an, thoi_luong, trang_thai):
    # Nhạc nối theo ô nhịp bằng *_noi_nhac.sh của dự án; giọng đổi làm video dài ra thì nhạc hết trước video.
    f_nhip = du_an / "nhip.json"
    if not thoi_luong or not f_nhip.exists():
        return None
    nhac = json.loads(f_nhip.read_text(encoding="utf-8")).get("nhac")
    if not nhac:
        return None
    f = du_an / nhac
    dai = do_dai(f) if f.exists() else 0.0
    if dai >= thoi_luong + 1:
        return None
    sh = sorted(du_an.glob("*_noi_nhac.sh"))
    if not sh:
        return {"loi": f"nhạc {nhac} dài {dai:.1f} giây, video {thoi_luong} giây, không có *_noi_nhac.sh để nối lại"}
    dich = int(thoi_luong) + 6
    trang_thai(buoc="noi_nhac")
    r = chay(["bash", sh[0], str(dich)])
    if r.returncode:
        return {"loi": f"{sh[0].name} {dich} thoát mã {r.returncode}: {(r.stderr or r.stdout).strip()[-200:]}"}
    return {"script": sh[0].name, "truoc": round(dai, 1), "sau": round(do_dai(f), 1), "video": thoi_luong}


def chay_nen(a):
    may = Path(a.du_an).resolve() / "out" / "may"
    may.mkdir(parents=True, exist_ok=True)
    lenh = [sys.executable, "-I", str(Path(__file__).resolve())] + [x for x in sys.argv[1:] if x != "--nen"]
    with open(may / "ket_xuat.log", "a") as log:
        log.write(f"\n===== {bay_gio()} {' '.join(lenh)}\n")
        log.flush()
        p = subprocess.Popen(lenh, cwd=GOC, stdout=log, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL,
                             start_new_session=True)
    ghi_json(may / "ket_xuat.trang_thai.json", {"ma": a.ma, "pid": p.pid, "trang_thai": "dang_chay", "buoc": "khoi_dong",
                                                "bat_dau": bay_gio(), "cap_nhat": bay_gio()})
    print(f"Chuỗi kết xuất {a.ma} chạy nền, PID {p.pid}. Trạng thái: {may / 'ket_xuat.trang_thai.json'}; "
          f"báo cáo khi xong: {may / 'ket_xuat.bao_cao.md'}; nhật ký: {may / 'ket_xuat.log'}")


def main():
    p = argparse.ArgumentParser(description="Chuỗi kết xuất và đo video HTML: tạo nhịp, kiểm trang, pha máy, đo, bản nháp")
    p.add_argument("du_an", help="thư mục dựng, ví dụ xuong_html/n222_ten")
    p.add_argument("ma", help="mã video (mã phiếu pha máy), ví dụ n222")
    p.add_argument("--san-pham", help="thư mục sản phẩm")
    p.add_argument("--ban-nhap", help="đường dẫn bản nháp ngoài cùng thư mục sản phẩm")
    p.add_argument("--chuong-sua", help="chương pha máy đã sửa, ví dụ 3,5")
    p.add_argument("--trang", default="trang.html")
    p.add_argument("--chi-kiem-trang", action="store_true")
    p.add_argument("--bo-kiem-trang", action="store_true")
    p.add_argument("--khong-tao-nhip", action="store_true")
    p.add_argument("--bo-nghe-tron", action="store_true")
    p.add_argument("--nen", action="store_true", help="chạy nền rồi trả lời ngay")
    p.add_argument("--cho", action="store_true", help="chờ chuỗi kết xuất chạy nền, tối đa --cho-giay giây")
    p.add_argument("--cho-giong", action="store_true", help="chờ chuỗi giọng chạy nền, tối đa --cho-giay giây")
    p.add_argument("--cho-giay", type=int, default=CHO_MAC_DINH,
                   help=f"giây chờ tối đa (mặc định {CHO_MAC_DINH} cho tác tử con; phiên giữ lô chạy nền 3300)")
    a = p.parse_args()
    if a.cho or a.cho_giong:
        return cho(a)
    if a.nen:
        return chay_nen(a)
    du_an = Path(a.du_an).resolve()
    may = du_an / "out" / "may"
    (may / "kiem_trang").mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    tt = {"ma": a.ma, "du_an": tuong_doi(du_an), "pid": os.getpid(), "trang_thai": "dang_chay", "buoc": "",
          "bat_dau": bay_gio(), "cap_nhat": bay_gio()}

    def trang_thai(**k):
        tt.update(k, cap_nhat=bay_gio())
        ghi_json(may / "ket_xuat.trang_thai.json", tt)
        if "buoc" in k:
            print(f"[{bay_gio()[11:]}] bước {k['buoc']}", flush=True)

    def dung(*_):
        trang_thai(trang_thai="loi", loi="bị dừng giữa chừng (tín hiệu tắt)")
        sys.exit(130)

    signal.signal(signal.SIGTERM, dung)
    signal.signal(signal.SIGINT, dung)
    try:
        kq = lam(a, du_an, may, trang_thai)
        trang_thai(trang_thai="xong" if not kq.get("loi") else "loi", loi=kq.get("loi"), buoc="xong",
                   ket_thuc=bay_gio(), giay=round(time.time() - t0), bao_cao=tuong_doi(may / "ket_xuat.bao_cao.md"))
    except Exception as e:
        import traceback
        traceback.print_exc()
        trang_thai(trang_thai="loi", loi=f"{type(e).__name__}: {e}"[:500], ket_thuc=bay_gio(), giay=round(time.time() - t0))
        (may / "ket_xuat.bao_cao.md").write_text(f"# Chuỗi kết xuất {a.ma}: LỖI\n\n- {bay_gio()}: {type(e).__name__}: {e}\n"
                                                 f"- Nhật ký: `{tuong_doi(may / 'ket_xuat.log')}`\n", encoding="utf-8")
        return 1


def kiem_trang(a, du_an, may, trang_thai):
    tg = json.loads((du_an / "thoi_gian.json").read_text(encoding="utf-8"))
    D = float(tg["thoi_luong_giay"])
    viec = [(k, [k], f"{k}.json") for k in ("quet_kiem", "do_tu", "do_hien")]
    viec.append(("tuong_phan", ["tuong_phan", "--moi", "2"], "tuong_phan.json"))
    t, k = 0.0, 0
    while t < D - 1.5:
        den = min(t + DOAN_UOC_DUNG, D - 1.5)
        viec.append(("uoc_dung", ["uoc_dung", "--tu", f"{t:g}", "--den", f"{den:g}"], f"uoc_dung_{k}.json"))
        t, k = den + 0.5, k + 1
    for f in (may / "kiem_trang").glob("*.json"):
        f.unlink()
    gop = {}
    for ten, thams, tep in viec:
        trang_thai(buoc=f"kiem_trang:{ten}")
        ra = may / "kiem_trang" / tep
        lenh = ["bash", HANG_DOI, "--nhanh", a.ma, node(), KIEM, thams[0], du_an, *thams[1:], "--trang", a.trang, "--ra-json", ra]
        r = chay(lenh)
        if r.returncode or not ra.exists():
            g = gop.setdefault(ten, {"so_loi": 0, "dong": [], "loi_chay": []})
            g["loi_chay"].append(f"{' '.join(thams)}: mã thoát {r.returncode}")
            continue
        x = json.loads(ra.read_text(encoding="utf-8"))
        g = gop.setdefault(ten, {"so_loi": 0, "dong": [], "loi_trang": 0, "giay_chay": 0})
        if x.get("so_loi", 0) < 0:  # trang thiếu hàm kiểm (kiemTra, demTu)
            g.setdefault("loi_chay", []).append(x["dong"][0])
        else:
            g["so_loi"] += x.get("so_loi", 0)
            g["dong"] += x.get("dong", [])
        g["loi_trang"] = max(g.get("loi_trang", 0), x.get("loi_trang", 0))
        g["giay_chay"] = round(g.get("giay_chay", 0) + x.get("giay_chay", 0), 1)
        for khoa in ("nhieu_nhat", "thap_nhat", "nho_nhat"):
            if khoa in x and x[khoa] is not None:
                g[khoa] = x[khoa] if khoa not in g else (max if khoa == "nhieu_nhat" else min)(g[khoa], x[khoa])
    return gop


def lam(a, du_an, may, trang_thai):
    kq = {"ma": a.ma, "du_an": tuong_doi(du_an)}
    nhip = sorted(du_an.glob(f"{a.ma}_tao_nhip.py"))
    if nhip and not a.khong_tao_nhip:
        trang_thai(buoc="tao_nhip")
        r = chay([shutil.which("python3") or sys.executable, "-I", nhip[0]])
        if r.returncode:
            kq["loi"] = f"{nhip[0].name} thoát mã {r.returncode}"
            ghi_bao_cao(a, may, kq)
            return kq
        kq["tao_nhip"] = (r.stdout.strip().splitlines() or [""])[-1][:200]
    tg = json.loads((du_an / "thoi_gian.json").read_text(encoding="utf-8")) if (du_an / "thoi_gian.json").exists() else {}
    kq["thoi_luong_trang"] = tg.get("thoi_luong_giay")
    nn = noi_lai_nhac(du_an, tg.get("thoi_luong_giay"), trang_thai)
    if nn:
        kq["noi_nhac"] = nn
        if nn.get("loi"):
            kq["loi"] = "nối lại nhạc: " + nn["loi"]
            ghi_ket_qua(a, may, kq)
            return kq
    if not a.bo_kiem_trang:
        kq["kiem_trang"] = kiem_trang(a, du_an, may, trang_thai)
    if a.chi_kiem_trang:
        ghi_ket_qua(a, may, kq)
        return kq

    trang_thai(buoc="kiem_o")
    o = con_trong_gb()
    kq["o_trong_gb"] = round(o, 1)
    if o < O_TOI_THIEU_GB:
        kq["loi"] = f"ổ còn {o:.1f} GB, dưới {O_TOI_THIEU_GB} GB: không kết xuất"
        ghi_ket_qua(a, may, kq)
        return kq

    trang_thai(buoc="pha_may")
    tao = [node(), PHA_MAY, "tao", a.ma, du_an, "--trang", a.trang]
    if a.san_pham:
        tao += ["--san-pham", Path(a.san_pham).resolve()]
    if a.chuong_sua:
        tao += ["--chuong-sua", a.chuong_sua]
    r = chay(tao)
    if r.returncode:
        kq["loi"] = "pha_may tao: " + (r.stderr or r.stdout).strip()[-300:]
        ghi_ket_qua(a, may, kq)
        return kq
    r = chay([node(), PHA_MAY, "chay", "--chi", a.ma, "--khong-bao"])
    phieu = json.loads((GOC / "du_lieu/pha_may/phieu" / f"{a.ma}.json").read_text(encoding="utf-8"))
    pk = phieu.get("ket_qua", {})
    kq["pha_may"] = {k: pk.get(k) for k in ("file_du", "thoi_luong", "so_khung", "lufs", "dinh_dbtp", "lufs_goc",
                                             "khung_hong_tim_thay", "khung_hong_con_lai", "dung_hinh", "chuong_ket_xuat",
                                             "chuong_dung_lai", "giay_may", "giay_tong", "canh_bao", "loi")}
    kq["pha_may"]["trang_thai"] = phieu.get("trang_thai")
    kq["pha_may"]["bao_cao"] = f"du_lieu/pha_may/bao_cao/{a.ma}.md"
    if phieu.get("trang_thai") != "cho_soat":
        kq["loi"] = f"pha máy {phieu.get('trang_thai')}: {pk.get('loi') or (r.stderr or '')[-300:]}"
        ghi_ket_qua(a, may, kq)
        return kq
    du = GOC / pk["file_du"]
    soat = sorted((du.parent / "soat").glob("bang_*.jpg"), key=lambda f: int(re.sub(r"\D", "", f.stem) or 0))
    kq["pha_may"]["bang_soat"] = [tuong_doi(f) for f in soat]

    trang_thai(buoc="dung_hinh_cat_phu_de")
    r = subprocess.run([str(FFMPEG), "-hide_banner", "-nostats", "-i", str(du), "-vf",
                        "crop=1920:860:0:0,fps=10,freezedetect=n=-60dB:d=1.5", "-map", "0:v", "-f", "null", "-"],
                       capture_output=True, text=True, timeout=3600)
    bd = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", r.stderr)]
    dai = [float(x) for x in re.findall(r"freeze_duration: ([\d.]+)", r.stderr)]
    kq["dung_hinh_cat_phu_de"] = {"so_doan": len(bd), "doan": [[round(s, 1), round(d, 1)] for s, d in zip(bd, dai)]}

    if a.ban_nhap:
        trang_thai(buoc="ban_nhap")
        dich = Path(a.ban_nhap).resolve()
        if dich.exists():
            if subprocess.run(["cmp", "-s", str(dich), str(du)]).returncode == 0:
                kq["ban_nhap"] = {"file": tuong_doi(dich), "ghi_chu": "trùng byte với bản đủ, giữ nguyên"}
            else:
                cu = dich.parent / "tai_nguyen/ban_nhap" / f"{dich.stem}_truoc_soat.mp4"
                if cu.exists():
                    cu = cu.with_name(f"{dich.stem}_truoc_{datetime.now():%Y%m%d_%H%M}.mp4")
                cu.parent.mkdir(parents=True, exist_ok=True)
                dich.rename(cu)
                kq["ban_nhap_cu"] = tuong_doi(cu)
        if not dich.exists():
            dich.parent.mkdir(parents=True, exist_ok=True)
            subprocess.run(["cp", "-c", str(du), str(dich)], check=True)  # bản sao APFS, không tốn thêm ổ
            kq["ban_nhap"] = {"file": tuong_doi(dich)}

    if not a.bo_nghe_tron:
        trang_thai(buoc="nghe_tron")
        r = chay([PY_GIONG, GOC / "scripts/chuoi_giong.py", du_an, a.ma, "--nghe-tron", du], timeout=3600)
        f_nt = may / "nghe_tron.json"
        if r.returncode == 0 and f_nt.exists():
            nt = json.loads(f_nt.read_text(encoding="utf-8"))
            kq["nghe_tron"] = {k: nt[k] for k in ("cau_xet", "cau_nghe_moi", "lech_hai_le", "lech_mot_le", "giay",
                                                  "canh_bao")}
            kq["nghe_tron"]["lech"] = [{k: x[k] for k in ("moc", "chuong", "cau", "lech", "so_le_lech")}
                                       for x in nt["cau"] if x["so_le_lech"]]
        else:
            kq["nghe_tron"] = {"loi": (r.stderr or r.stdout or "").strip()[-300:]}
    ghi_ket_qua(a, may, kq)
    return kq


def ghi_ket_qua(a, may, kq):
    ghi_json(may / "ket_xuat.chi_tiet.json", kq)
    ghi_bao_cao(a, may, kq)


def ghi_bao_cao(a, may, kq):
    d = [f"# Chuỗi kết xuất {a.ma}: {'LỖI' if kq.get('loi') else 'xong'} {bay_gio()[:16]}", ""]
    if kq.get("loi"):
        d.append(f"- **Lỗi: {kq['loi']}**")
    if kq.get("thoi_luong_trang"):
        d.append(f"- Trang: {kq['thoi_luong_trang']} giây theo thoi_gian.json")
    nn = kq.get("noi_nhac")
    if nn and not nn.get("loi"):
        d.append(f"- Nhạc nối lại bằng `{nn['script']}`: {nn['truoc']} → {nn['sau']} giây (video {nn['video']} giây)")
    kt = kq.get("kiem_trang")
    if kt:
        d.append("## Máy kiểm trang")
        for ten, g in kt.items():
            them = "".join(f", {n} {g[k]}" for k, n in (("nhieu_nhat", "nhiều nhất"), ("thap_nhat", "thấp nhất"),
                                                         ("nho_nhat", "nhỏ nhất")) if k in g)
            d.append(f"- {ten}: **{g['so_loi']}** {NGUONG[ten]}{them}, {g.get('loi_trang', 0)} pageerror"
                     + (f"; chạy lỗi: {'; '.join(g['loi_chay'])}" if g.get("loi_chay") else ""))
            for x in g["dong"][:4]:
                d.append(f"  - {x[:150]}")
            if len(g["dong"]) > 4:
                d.append(f"  - … thêm {len(g['dong']) - 4} dòng trong `out/may/kiem_trang/{ten}*.json`")
    pm = kq.get("pha_may")
    if pm:
        dh = pm.get("dung_hinh") or {}
        d += ["## Pha máy",
              f"- {pm.get('trang_thai')}: `{pm.get('file_du')}`, {pm.get('thoi_luong')} giây, {pm.get('so_khung')} khung; "
              f"máy {pm.get('giay_tong')} giây; chương kết xuất {','.join(pm.get('chuong_ket_xuat') or []) or 'không'}, "
              f"dùng lại {len(pm.get('chuong_dung_lai') or [])}",
              f"- Độ to {pm.get('lufs')} LUFS, đỉnh {pm.get('dinh_dbtp')} dBTP (gốc {pm.get('lufs_goc')}); khung hỏng tìm thấy "
              f"{pm.get('khung_hong_tim_thay') or 0}, còn {pm.get('khung_hong_con_lai') or 0}",
              f"- Đứng hình cả khung (d=0,5): {dh.get('so_doan')} đoạn, tổng {dh.get('tong_giay')} giây, dài nhất {dh.get('dai_nhat')}",
              f"- Cảnh báo pha máy: {'; '.join(pm.get('canh_bao') or []) or 'không'}"]
        if pm.get("bang_soat"):
            d.append(f"- Bảng ảnh soát: {len(pm['bang_soat'])} bảng, `{pm['bang_soat'][0]}` … ; báo cáo `{pm['bao_cao']}`")
    dh = kq.get("dung_hinh_cat_phu_de")
    if dh:
        d.append(f"- **Đứng hình cắt dải phụ đề (d=1,5): {dh['so_doan']} đoạn**"
                 + (": " + ", ".join(f"{s}s ({l}s)" for s, l in dh["doan"][:8]) if dh["doan"] else ""))
    if kq.get("ban_nhap"):
        d.append(f"- Bản nháp: `{kq['ban_nhap']['file']}`" + (f" ({kq['ban_nhap']['ghi_chu']})" if kq["ban_nhap"].get("ghi_chu") else "")
                 + (f"; bản cũ chuyển vào `{kq['ban_nhap_cu']}`" if kq.get("ban_nhap_cu") else ""))
    nt = kq.get("nghe_tron")
    if nt:
        d.append("## Nghe trên tiếng có nhạc (mốc · chương.câu · lời đọc→Whisper ở lề 0,05 | 0,4)")
        if nt.get("loi"):
            d.append(f"- **Lỗi: {nt['loi']}**")
        else:
            d.append(f"- {nt['cau_xet']} câu (nghe mới {nt['cau_nghe_moi']}, {nt['giay']} giây): **lệch hai lề "
                     f"{nt['lech_hai_le']}**, lệch một lề {nt['lech_mot_le']}"
                     + (f"; {'; '.join(nt['canh_bao'])}" if nt["canh_bao"] else ""))
            cap = lambda L: ", ".join(f"{p}→{q or '∅'}" for p, q in L) or "khớp"
            for x in sorted(nt["lech"], key=lambda x: -x["so_le_lech"]):
                d.append(f"  - {'HAI LỀ' if x['so_le_lech'] == 2 else 'một lề'} {x['moc']} · {x['chuong']}.{x['cau']} · "
                         f"{cap(x['lech'][0])} | {cap(x['lech'][1])}"[:170])
    d += ["", "Chi tiết: `out/may/ket_xuat.chi_tiet.json`, `out/may/kiem_trang/`, `out/may/nghe_tron.json`; nhật ký "
          "`out/may/ket_xuat.log`."]
    s = "\n".join(d) + "\n"
    while len(s.encode()) > 2900:
        dong_phu = [i for i, x in enumerate(d) if x.startswith("  - ") and not x.startswith("  - …")]
        if not dong_phu:
            break
        d.pop(dong_phu[-1])
        s = "\n".join(d) + "\n"
    (may / "ket_xuat.bao_cao.md").write_text(s, encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
