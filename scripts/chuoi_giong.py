# chuoi_giong.py — chuỗi giọng dùng chung cho video có giọng VieNeu, chạy nền (lập 04/11/2026, Trung chốt thử cách
# làm ba chặng sau báo cáo chi phí video ngân hàng N201–N205). Gộp logic của sinh_giong_vieneu.py, doc_lai_cau_vieneu.py
# và các script riêng n204_quet_giong.py, n204_doc_lai.py, n204_kiem_2le.py, n204_doc_lai_2le.py.
#
# Một lệnh làm hết phần giọng để tác tử dựng không phải ngồi chờ:
#   1. chờ chỗ: tổng tiến trình đọc giọng VieNeu toàn máy dưới 3 (quy định chạy lô);
#   2. đưa giọng về khớp .chuong.json: chương chưa có giọng hoặc số câu đổi thì sinh lại cả chương
#      (scripts/sinh_giong_vieneu.py; sinh vài chương của video đã có giọng thì giữ hệ số kéo của chương cũ);
#      câu đổi lời nhưng số câu giữ nguyên thì chỉ đọc lại câu đó;
#   3. quét Whisper mọi câu mới hoặc đã đổi ở hai lề cắt 0,05 và 0,4 giây, so từng từ với lời đọc, bỏ qua các cặp
#      "viết khác, đọc đúng" (DOC_DUNG), cặp chỉ khác phụ âm đầu giọng Bắc đọc như nhau (PHUONG_NGU: r/d/gi, s/x, tr/ch)
#      và cặp Whisper viết bằng chữ số;
#   4. đọc lại câu lệch tối đa --lan lần (mặc định 5); mỗi lần ghép tạm vào chương rồi nghe ở hai lề; chỉ nhận lần
#      đúng ở CẢ HAI lề; không lần nào đạt thì giữ lần ít lệch nhất và ghi câu vào danh sách "nghe tai";
#   5. chạy <mã>_tao_nhip.py của dự án nếu có (mốc trong video cho danh sách "nghe tai"), ghi báo cáo dưới 3 KB.
#
# Dùng (gốc Media/, Python của .venv_vieneu):
#   .venv_vieneu/bin/python scripts/chuoi_giong.py <thư mục dựng> <mã> --kich-ban <.chuong.json> --giong "Quốc Tuấn" --nen
#   --nen        chạy nền rồi trả lời ngay (tác tử kết thúc lượt, đọc báo cáo sau)
#   --chuong 3,5 chỉ xét các chương này     --cau 3.2,5.4 ép đọc lại các câu này (chương.câu, đếm từ 1)
#   --lan 5      số lần đọc lại tối đa mỗi câu     --quet-lai quét lại mọi câu kể cả câu đã đạt ở lượt trước
#   --bo-qua "gia/ra,trọn/chọn"  thêm cặp viết khác đọc đúng (lời đọc/Whisper viết) cho riêng video này
#   --khong-tao-nhip             không chạy <mã>_tao_nhip.py
#   --nghe-tron <file .mp4>      chỉ nghe lại mọi câu trên tiếng đã trộn nhạc của video (hai lề như bước 3, mốc theo
#                                thoi_gian.json), không sinh, không đọc lại; ghi out/may/nghe_tron.json. Chuỗi kết xuất gọi
#                                sau khi có bản nháp: bắt lỗi chỉ lộ khi có nhạc (N210: "tín dụng" nghe "tiến dụng")
# Cặp --bo-qua ghi vào giong.trang_thai.json và cộng dồn qua các lần chạy (lần sau không cần khai lại).
# Ra, trong <thư mục dựng>/out/may/ (pha máy không tính thư mục out/ vào dấu vân tay mã, git bỏ qua): giong.trang_thai.json (trạng thái, đọc được giữa chừng), giong.bao_cao.md (tóm tắt
# dưới 3 KB), giong.chi_tiet.json (mọi câu đã quét), giong.log. Âm thanh như sinh_giong_vieneu.py trong
# <thư mục dựng>/am_thanh/, kèm am_thanh/quet_giong.json (kết quả quét từng câu, để lần chạy sau chỉ quét câu đổi).

import argparse
import difflib
import fcntl
import hashlib
import json
import os
import re
import shutil
import signal
import subprocess
import sys
import time
import unicodedata
from datetime import datetime
from pathlib import Path

GOC = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(GOC / "scripts"))

LE = (0.05, 0.4)
TOI_DA_GIONG = 2  # tổng tiến trình đọc giọng toàn máy dưới 3
KHOA = GOC / "du_lieu/hang_doi_ket_xuat/giong"  # thư mục ngoài git, cùng chỗ với hàng đợi kết xuất
# Viết khác, đọc đúng (lời đọc, cách Whisper hay viết): tên nhân vật "doanh nghiệp C", "chị B" lô nào cũng dùng; giọng
# Bắc đọc x như s; hằng năm/hàng năm cùng nghĩa; thuật ngữ quốc tế Whisper viết theo chính tả gốc. Lô N201–N205 có
# 85/316 cặp lệch lượt đầu thuộc nhóm này (ra_soat_quy_trinh.md mục E2).
DOC_DUNG = [("xưởng", "sưởng"), ("xê", "c"), ("bê", "b"), ("hằng", "hàng"), ("ca sa", "casa"), ("ép ếch", "fx")]
DAU_THANH = {"̀", "́", "̃", "̉", "̣"}
# Phụ âm đầu giọng Bắc đọc như nhau: cặp chỉ khác ở đây (ranh/danh, sổ/xổ, trả/chả) người xem cũng nghe như nhau, đọc lại
# không sửa được; không tính là lệch (thêm 04/11/2026 sau lần thử N207, N210).
PHUONG_NGU = ((re.compile(r"^(gi|r)"), "d"), (re.compile(r"^s"), "x"), (re.compile(r"^tr"), "ch"))
# Chữ đọc số và đơn vị Whisper hay viết thành ký hiệu ("năm phần trăm" → "5%", "mười héc ta" → "10 ha")
CHU_SO = set("không một mốt hai ba bốn tư năm lăm sáu bảy tám chín mười mươi trăm nghìn ngàn triệu tỷ linh lẻ phẩy "
             "phần héc ta ha hecta hectare mét vuông ki lô".split())


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


def tach_cau(doc):
    # cùng quy tắc với sinh_giong_vieneu.tach_cau
    return [c.strip() for c in re.split(r"(?<=[.?!])\s+", doc.strip()) if c.strip()]


# ---------- so lời đọc với Whisper ----------

def chuan_thanh(w):
    # Dấu thanh dời về cuối âm tiết: "hoá" và "hóa" (hai cách bỏ dấu) thành một khoá so sánh
    d = unicodedata.normalize("NFD", w)
    return unicodedata.normalize("NFC", "".join(c for c in d if c not in DAU_THANH)) + "".join(c for c in d if c in DAU_THANH)


def tach_tu(s):
    s = unicodedata.normalize("NFC", s.lower()).replace("-", " ")
    return re.sub(r"[^\w\s]", " ", s).split()


class BoSo:
    def __init__(self, thay, them=()):
        self.thay = thay  # chuan_hoa_nghe_lai của cau_hinh_giong.json, áp lên chữ Whisper
        self.dong_nghia, self.cum = {}, []
        # Phía Whisper so không phân biệt đ/d: Whisper viết chữ viết tắt bằng D ("DTM" cho "đê-tê-em")
        for a, b in list(DOC_DUNG) + list(them):
            ta, tb = tach_tu(a), [x.replace("đ", "d") for x in tach_tu(b)]
            if len(ta) == 1 and len(tb) == 1:
                self.dong_nghia[chuan_thanh(tb[0])] = chuan_thanh(ta[0])
            else:
                self.cum.append((tb, ta))

    def khoa(self, t):
        c = chuan_thanh(t)
        return self.dong_nghia.get(c.replace("đ", "d"), self.dong_nghia.get(c, c))

    def nghe(self, h):
        s = " ".join(tach_tu(h))
        for mau, moi in self.thay:
            s = re.sub(mau, moi, s)
        tu = s.split()
        for tb, ta in self.cum:  # cụm nhiều tiếng Whisper viết liền ("casa") đổi về cách viết của lời đọc
            i, ra = 0, []
            while i < len(tu):
                if [x.replace("đ", "d") for x in tu[i:i + len(tb)]] == tb:
                    ra += ta
                    i += len(tb)
                else:
                    ra.append(tu[i])
                    i += 1
            tu = ra
        return tu

    def lech(self, doc, h):
        # Cặp (lời đọc, Whisper nghe) khác nhau; bỏ từ Whisper thêm vào (thường là tiếng câu bên cạnh lọt vào lề)
        # và cặp Whisper viết bằng chữ số (năm, số hiệu đọc thành chữ, Whisper viết số)
        a, b = tach_tu(doc), self.nghe(h)
        sm = difflib.SequenceMatcher(a=[self.khoa(x) for x in a], b=[self.khoa(x) for x in b], autojunk=False)
        out = []
        for op, i1, i2, j1, j2 in sm.get_opcodes():
            if op == "equal" or i1 == i2:
                continue
            if i2 - i1 == j2 - j1 and all(self.pn(x) == self.pn(y) for x, y in zip(a[i1:i2], b[j1:j2])):
                continue  # chỉ khác phụ âm đầu giọng Bắc đọc như nhau
            p = (" ".join(a[i1:i2]), " ".join(b[j1:j2]))
            if re.search(r"\d", p[1]):
                # Whisper viết số: bỏ qua khi phần lời đọc chỉ là chữ đọc số; chữ khác bị số "nuốt" vẫn tính lệch (soát
                # N214 04/11/2026: "Thông tư hai trăm không còn" nghe "200 còn", "vay vốn" nghe "vay 4" từng bị bỏ qua)
                du = [self.khoa(x) for k, x in enumerate(a[i1:i2], i1) if not self.la_so(a, k)]
                con = [self.khoa(x) for x in b[j1:j2] if not re.search(r"\d", x) and x not in CHU_SO]
                if du == con:
                    continue
            out.append(p)
        return out

    @staticmethod
    def la_so(a, k):
        # "không" chỉ là chữ số khi đứng trước một chữ đọc số ("không trăm", "không phẩy"); "hai trăm không còn" thì không
        if a[k] not in CHU_SO:
            return False
        return a[k] != "không" or (k + 1 < len(a) and a[k + 1] in CHU_SO and a[k + 1] != "không")

    def pn(self, t):
        t = self.khoa(t)
        for mau, moi in PHUONG_NGU:
            if mau.match(t):
                return mau.sub(moi, t, count=1)
        return t


# ---------- chỗ đọc giọng toàn máy ----------

def dang_song(pid):
    try:
        os.kill(pid, 0)
        return True
    except (ProcessLookupError, PermissionError):
        return False
    except Exception:
        return False


def dem_dang_doc(minh):
    # Tiến trình đang dùng VieNeu: chuỗi giọng đang giữ chỗ (file cho_<pid>.pid) và các script đọc giọng chạy lẻ
    # (sinh_giong_vieneu.py, *doc_lai*.py) không phải con của một chuỗi đang giữ chỗ.
    giu = set()
    for f in KHOA.glob("cho_*.pid"):
        try:
            pid = int(f.read_text().strip() or 0)
        except (OSError, ValueError):
            continue
        if pid and dang_song(pid):
            if pid != minh:
                giu.add(pid)
        else:
            f.unlink(missing_ok=True)
    le = 0
    ps = subprocess.run(["ps", "-axo", "pid=,ppid=,command="], capture_output=True, text=True).stdout
    for dong in ps.splitlines():
        p = dong.split(None, 2)
        if len(p) < 3:
            continue
        pid, ppid, lenh = int(p[0]), int(p[1]), p[2]
        if pid == minh or ppid == minh or ppid in giu or pid in giu:
            continue
        if re.search(r"[Pp]ython\S*\s+(-\S+\s+)*\S*(sinh_giong_vieneu|doc_lai\w*)\.py", lenh):
            le += 1
    return len(giu) + le


def giu_cho(trang_thai):
    KHOA.mkdir(parents=True, exist_ok=True)
    minh, lan = os.getpid(), 0
    while True:
        with open(KHOA / "quyet.lock", "w") as k:
            fcntl.flock(k, fcntl.LOCK_EX)
            n = dem_dang_doc(minh)
            if n < TOI_DA_GIONG:
                (KHOA / f"cho_{minh}.pid").write_text(str(minh))
                return
        if lan % 10 == 0:
            trang_thai(buoc="cho_cho", ghi_chu=f"máy đang có {n} lượt đọc giọng, chờ")
        lan += 1
        time.sleep(30)


def tra_cho():
    (KHOA / f"cho_{os.getpid()}.pid").unlink(missing_ok=True)


# ---------- chạy ----------

def chay_nen(a):
    may = Path(a.du_an).resolve() / "out" / "may"
    may.mkdir(parents=True, exist_ok=True)
    # Đọc cặp --bo-qua cũ TRƯỚC khi tách tiến trình con và ghi kèm vào trạng thái khởi động: trước 05/11/2026 trạng thái
    # khởi động ghi đè file không có bo_qua, tiến trình con đọc sau nên mất cặp đã khai (N221 chặng C: "năm mươi năm/50 năm").
    f_tt = may / "giong.trang_thai.json"
    try:
        cu = json.loads(f_tt.read_text(encoding="utf-8")) if f_tt.exists() else {}
    except ValueError:
        cu = {}
    bo_qua = ",".join(dict.fromkeys(x for x in cu.get("bo_qua", "").split(",") + (a.bo_qua or "").split(",") if "/" in x))
    lenh = [sys.executable, str(Path(__file__).resolve())] + [x for x in sys.argv[1:] if x != "--nen"]
    with open(may / "giong.log", "a") as log:
        log.write(f"\n===== {bay_gio()} {' '.join(lenh)}\n")
        log.flush()
        p = subprocess.Popen(lenh, cwd=GOC, stdout=log, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL,
                             start_new_session=True)
    ghi_json(f_tt, {"ma": a.ma, "pid": p.pid, "bo_qua": bo_qua, "trang_thai": "dang_chay", "buoc": "khoi_dong",
                    "bat_dau": bay_gio(), "cap_nhat": bay_gio()})
    print(f"Chuỗi giọng {a.ma} chạy nền, PID {p.pid}. Trạng thái: {may / 'giong.trang_thai.json'}; "
          f"báo cáo khi xong: {may / 'giong.bao_cao.md'}; nhật ký: {may / 'giong.log'}")


def main():
    p = argparse.ArgumentParser(description="Chuỗi giọng VieNeu: sinh, quét Whisper hai lề, đọc lại câu lệch, báo cáo")
    p.add_argument("du_an", help="thư mục dựng, ví dụ xuong_html/n222_ten")
    p.add_argument("ma", help="mã video, ví dụ n222")
    p.add_argument("--kich-ban", help="file .chuong.json (bắt buộc, trừ khi --nghe-tron)")
    p.add_argument("--giong", help="giọng VieNeu (mặc định giọng của chương đã có, rồi tới cau_hinh_giong.json)")
    p.add_argument("--chuong", help="chỉ xét các chương này, ví dụ 3,5")
    p.add_argument("--cau", help="ép đọc lại các câu này, dạng chương.câu, ví dụ 3.2,5.4")
    p.add_argument("--lan", type=int, default=5, help="số lần đọc lại tối đa mỗi câu")
    p.add_argument("--quet-lai", action="store_true", help="quét lại mọi câu, kể cả câu đã đạt ở lượt trước")
    p.add_argument("--bo-qua", default="", help='thêm cặp viết khác đọc đúng, dạng "lời đọc/Whisper,..."')
    p.add_argument("--khong-tao-nhip", action="store_true")
    p.add_argument("--nghe-tron", help="file .mp4: chỉ nghe lại các câu trên tiếng đã trộn nhạc")
    p.add_argument("--nen", action="store_true", help="chạy nền rồi trả lời ngay")
    a = p.parse_args()
    if not (a.kich_ban or a.nghe_tron):
        p.error("cần --kich-ban")
    if a.nen:
        return chay_nen(a)

    du_an = Path(a.du_an).resolve()
    am = du_an / "am_thanh"
    may = du_an / "out" / "may"
    may.mkdir(parents=True, exist_ok=True)
    am.mkdir(parents=True, exist_ok=True)
    f_tt = may / "giong.trang_thai.json"
    cu = json.loads(f_tt.read_text(encoding="utf-8")) if f_tt.exists() else {}
    a.bo_qua = ",".join(dict.fromkeys(x for x in cu.get("bo_qua", "").split(",") + a.bo_qua.split(",") if "/" in x))
    if a.nghe_tron:
        if cu and cu.get("bo_qua", "") != a.bo_qua:  # cặp mới khai ở lần nghe: giữ cho các lần chạy sau
            cu["bo_qua"] = a.bo_qua
            ghi_json(f_tt, cu)
        return nghe_tron(a, du_an, am, may)
    kb = Path(a.kich_ban).resolve()
    t0 = time.time()
    tt = {"ma": a.ma, "du_an": tuong_doi(du_an), "kich_ban": tuong_doi(kb), "pid": os.getpid(), "bo_qua": a.bo_qua,
          "trang_thai": "dang_chay", "buoc": "", "bat_dau": bay_gio(), "cap_nhat": bay_gio()}

    def trang_thai(**k):
        tt.update(k, cap_nhat=bay_gio())
        ghi_json(f_tt, tt)
        if "buoc" in k:
            print(f"[{bay_gio()[11:]}] {k['buoc']}{(': ' + k['ghi_chu']) if k.get('ghi_chu') else ''}", flush=True)

    def dung(*_):
        tra_cho()
        trang_thai(trang_thai="loi", loi="bị dừng giữa chừng (tín hiệu tắt)")
        sys.exit(130)

    signal.signal(signal.SIGTERM, dung)
    signal.signal(signal.SIGINT, dung)
    try:
        kq = lam(a, du_an, am, may, kb, trang_thai)
        trang_thai(trang_thai="xong", buoc="xong", ket_thuc=bay_gio(), giay=round(time.time() - t0), ket_qua=kq,
                   bao_cao=tuong_doi(may / "giong.bao_cao.md"))
    except Exception as e:
        import traceback
        traceback.print_exc()
        trang_thai(trang_thai="loi", loi=f"{type(e).__name__}: {e}"[:500], ket_thuc=bay_gio(), giay=round(time.time() - t0))
        (may / "giong.bao_cao.md").write_text(f"# Chuỗi giọng {a.ma}: LỖI\n\n- {bay_gio()}: {type(e).__name__}: {e}\n"
                                              f"- Nhật ký: `{tuong_doi(may / 'giong.log')}`\n", encoding="utf-8")
        return 1
    finally:
        tra_cho()


def lam(a, du_an, am, may, kb, trang_thai):
    import numpy as np
    import soundfile as sf
    from sinh_giong_vieneu import SR

    ch = json.loads((GOC / "tai_san/cau_hinh_giong.json").read_text(encoding="utf-8-sig"))["vieneu"]
    thay = [tuple(x) for x in ch["chuan_hoa_nghe_lai"]]
    them = [tuple(x.split("/", 1)) for x in a.bo_qua.split(",") if "/" in x]
    bs = BoSo(thay, them)
    chuong = json.loads(kb.read_text(encoding="utf-8-sig"))
    if a.chuong:
        chon = {int(x) for x in a.chuong.split(",")}
        chuong = [c for c in chuong if c["id"] in chon]
    ep = {}
    for x in filter(None, (a.cau or "").split(",")):
        c, s = x.split(".")
        ep.setdefault(int(c), set()).add(int(s) - 1)

    def doc_json(f, md=None):
        return json.loads(f.read_text(encoding="utf-8")) if f.exists() else md

    # --- bước 2: chương nào sinh lại cả chương, câu nào đổi lời ---
    sinh, doi_loi, he_so_cu, giong_cu = [], {}, None, None
    for c in chuong:
        f_wav, f_moc, f_tt = (am / f"c{c['id']}{d}" for d in (".wav", ".moc_cau.json", ".thongtin_vieneu.json"))
        moc, ttv = doc_json(f_moc), doc_json(f_tt)
        cau = tach_cau(c["doc"])
        if not (f_wav.exists() and moc and ttv) or len(moc["cau"]) != len(cau):
            sinh.append(c["id"])
            continue
        he_so_cu, giong_cu = ttv.get("he_so_keo", 1.0), ttv.get("giong")
        d = {i for i, (m, s) in enumerate(zip(moc["cau"], cau)) if m["cau"] != s}
        if d:
            doi_loi[c["id"]] = d
    if he_so_cu is None:  # chưa có chương nào: đo hệ số trên chính các chương sinh mới
        for f in sorted(am.glob("c*.thongtin_vieneu.json")):
            ttv = doc_json(f)
            he_so_cu, giong_cu = ttv.get("he_so_keo"), ttv.get("giong")
            break
    giong = a.giong or giong_cu or ch["giong"]
    trang_thai(buoc="cho_cho", ghi_chu=f"sinh mới {len(sinh)} chương, đổi lời {sum(map(len, doi_loi.values()))} câu")
    giu_cho(trang_thai)

    if sinh:
        trang_thai(buoc="dang_sinh", ghi_chu=f"chương {','.join(map(str, sinh))}, giọng {giong}")
        lenh = [sys.executable, str(GOC / "scripts/sinh_giong_vieneu.py"), "--kich-ban", str(kb), "--ra", str(am),
                "--chuong", ",".join(map(str, sinh)), "--giong", giong]
        if he_so_cu and len(sinh) < len(json.loads(kb.read_text(encoding="utf-8-sig"))):
            lenh += ["--he-so-keo", str(he_so_cu)]  # đọc vài chương của video đã có giọng: khớp nhịp chương cũ
        r = subprocess.run(lenh, cwd=GOC)
        if r.returncode:
            raise RuntimeError(f"sinh_giong_vieneu.py thoát mã {r.returncode}")

    # --- bước 3: quét hai lề ---
    import mlx_whisper
    import soxr
    mo_hinh = ch["mo_hinh_nghe_lai"]

    def nghe_doan(y, a0, b0):
        x = y[max(0, a0):min(len(y), b0)]
        return mlx_whisper.transcribe(soxr.resample(x, SR, 16000).astype("float32"), path_or_hf_repo=mo_hinh,
                                      language="vi")["text"].strip()

    def nghe_hai_le(y, bd, n, s):
        kq = []
        for le in LE:
            h = nghe_doan(y, bd - int(le * SR), bd + n + int(le * SR))
            kq.append((le, h, bs.lech(s, h)))
        return kq

    f_q = am / "quet_giong.json"
    quet = doc_json(f_q, {})
    can_doc, so_quet, lech_dau = [], 0, 0
    trang_thai(buoc="dang_quet")
    for c in chuong:
        cid = c["id"]
        moc = doc_json(am / f"c{cid}.moc_cau.json")
        y, sr = sf.read(am / f"c{cid}.wav", dtype="float32")
        if y.ndim > 1:
            y = y.mean(1)
        cau = tach_cau(c["doc"])
        bang = quet.get(str(cid), [])
        if len(bang) != len(cau):
            bang = [None] * len(cau)
        for i, s in enumerate(cau):
            m = moc["cau"][i]
            bd, kt = int(round(m["bd"] * SR)), int(round(m["kt"] * SR))
            bam = hashlib.sha1(y[bd:kt].tobytes()).hexdigest()[:12]
            if i in doi_loi.get(cid, ()):  # lời đổi: câu cũ trong file không còn đúng lời
                can_doc.append((cid, i, "doi_loi"))
                continue
            cu = bang[i]
            if not a.quet_lai and cu and cu.get("cau") == s and cu.get("bam") == bam and i not in ep.get(cid, ()):
                # Câu không đổi từ lần quét trước: không nghe lại, không đọc lại. Câu "nghe tai" thì xét lại chữ Whisper
                # đã nghe theo danh sách viết khác đọc đúng hiện tại (có thể vừa thêm bằng --bo-qua).
                if cu.get("ket_qua") != "dat" and cu.get("nghe"):
                    cu["lech"] = [bs.lech(s, h) for h in cu["nghe"]]
                    if not any(cu["lech"]):
                        cu.update(ket_qua="dat", xet_lai_bo_qua=True)
                continue
            kq = nghe_hai_le(y, bd, kt - bd, s)
            so_quet += 1
            dat = not any(x[2] for x in kq)
            lech_dau += not dat
            bang[i] = {"cau": s, "bam": bam, "ket_qua": "dat" if dat else "lech",
                       "nghe": [x[1] for x in kq], "lech": [x[2] for x in kq], "lan_doc_lai": 0}
            if not dat or i in ep.get(cid, ()):
                can_doc.append((cid, i, "ep" if dat else "lech"))
        quet[str(cid)] = bang
        ghi_json(f_q, quet)
        trang_thai(ghi_chu=f"đã quét tới chương {cid}: {so_quet} câu, {lech_dau} lệch")
    print(f"Quét {so_quet} câu, {lech_dau} câu lệch ở ít nhất một lề", flush=True)

    # --- bước 4: đọc lại câu lệch, chỉ nhận lần đúng ở cả hai lề ---
    so_luot = 0
    if can_doc:
        trang_thai(buoc="dang_doc_lai", ghi_chu=f"{len(can_doc)} câu")
        import jiwer
        from vieneu import Vieneu
        from moc_tung_tu import can_tu
        from sinh_giong_vieneu import chuan
        from them_giong_vieneu import nap_giong_rieng
        from toc_do_giong import keo_gian, tim_ffmpeg
        ffmpeg = tim_ffmpeg()
        tts = Vieneu()
        f_tu = am / "moc_tu.json"
        mt = doc_json(f_tu, {"chuong": {}})
        for cid in sorted({x[0] for x in can_doc}):
            c = next(x for x in chuong if x["id"] == cid)
            cau, cau_text = tach_cau(c["doc"]), tach_cau(c.get("text", ""))
            f_wav, f_moc, f_tt = (am / f"c{cid}{d}" for d in (".wav", ".moc_cau.json", ".thongtin_vieneu.json"))
            y, sr = sf.read(f_wav, dtype="float32")
            moc, ttv = doc_json(f_moc), doc_json(f_tt)
            he_so = ttv.get("he_so_keo", 1.0)
            giong_doc = nap_giong_rieng(ttv["giong"]) or ttv["giong"]
            tu_ch = {x["cau"]: x for x in mt["chuong"].get(str(cid), [])}
            bang = quet[str(cid)]
            for _, i, ly_do in sorted((x for x in can_doc if x[0] == cid), key=lambda x: -x[1]):
                s = cau[i]
                bd0, kt0 = int(round(moc["cau"][i]["bd"] * SR)), int(round(moc["cau"][i]["kt"] * SR))
                tot = None
                if ly_do == "lech":  # bản đang có cũng là một ứng viên (câu ép đọc lại, câu đổi lời thì không)
                    tot = (sum(map(len, bang[i]["lech"])), 1.0, None, bang[i]["nghe"], bang[i]["lech"], 0)
                for lan in range(1, a.lan + 1):
                    x0 = np.asarray(tts.infer(s, voice=giong_doc), dtype=np.float32).flatten()
                    xs = keo_gian(x0, he_so, ffmpeg)
                    kq = nghe_hai_le(np.concatenate([y[:bd0], xs, y[kt0:]]), bd0, len(xs), s)
                    so_luot += 1
                    nl = sum(len(z[2]) for z in kq)
                    sai = max(jiwer.cer(chuan(s), chuan(z[1], thay)) for z in kq)
                    print(f"  c{cid} câu {i + 1} lần {lan}: {'ĐẠT hai lề' if not nl else f'{nl} cặp lệch'}, sai {sai:.0%}"
                          f" — {kq[0][1]} || {kq[1][1]}", flush=True)
                    if tot is None or (nl, sai) < tot[:2]:
                        tot = (nl, sai, (x0, xs), [z[1] for z in kq], [z[2] for z in kq], lan)
                    if not nl:
                        break
                nl, sai, xx, nghe, lech, lan_giu = tot
                dat = nl == 0
                if xx is not None:
                    x0, x = xx
                    r = mlx_whisper.transcribe(soxr.resample(x0, SR, 16000), path_or_hf_repo=mo_hinh, language="vi",
                                               word_timestamps=True)
                    co = len(x) / len(x0)
                    tu0 = [{**w, "start": w["start"] * co, "end": w["end"] * co} for s_ in r["segments"]
                           for w in s_.get("words", [])]
                    lech_giay = (len(x) - (kt0 - bd0)) / SR
                    y = np.concatenate([y[:bd0], x, y[kt0:]])
                    moc["cau"][i] = {"cau": s, "bd": moc["cau"][i]["bd"], "kt": round(moc["cau"][i]["bd"] + len(x) / SR, 3)}
                    for m in moc["cau"][i + 1:]:
                        m["bd"], m["kt"] = round(m["bd"] + lech_giay, 3), round(m["kt"] + lech_giay, 3)
                    if len(cau_text) == len(cau):
                        b0 = moc["cau"][i]["bd"]
                        tu_ch[i] = {"cau": i, "tu": [{**w, "bd": round(b0 + w["bd"], 3), "kt": round(b0 + w["kt"], 3)}
                                                    for w in can_tu(tu0, s, cau_text[i], len(x) / SR, thay)]}
                        for j in tu_ch:
                            if j > i:
                                tu_ch[j]["tu"] = [{**w, "bd": round(w["bd"] + lech_giay, 3), "kt": round(w["kt"] + lech_giay, 3)}
                                                  for w in tu_ch[j]["tu"]]
                    ttv["tung_cau"][i] = {"cau": s, "whisper": r["text"].strip(), "ty_le_sai": round(sai, 3),
                                          "so_lan_doc": lan_giu, "lan_duoc_giu": lan_giu, "doc_lai_rieng": True,
                                          "dat_hai_le": dat}
                    bam = hashlib.sha1(x.tobytes()).hexdigest()[:12]
                else:
                    bam = bang[i]["bam"]
                bang[i] = {"cau": s, "bam": bam, "ket_qua": "dat" if dat else "nghe_tai", "nghe": nghe, "lech": lech,
                           "lan_doc_lai": (bang[i] or {}).get("lan_doc_lai", 0) + (lan_giu if dat else a.lan),
                           "ly_do": ly_do}
                print(f"c{cid} câu {i + 1}: {'đạt hai lề' if dat else 'NGHE TAI'}, giữ lần {lan_giu}", flush=True)
            moc["doc"] = c["doc"]
            moc["giay"] = round(len(y) / SR, 3)
            ttv["thoi_luong_giay"], ttv["so_ky_tu"] = moc["giay"], len(c["doc"])
            for i, m in enumerate(moc["cau"]):  # băm lại theo vị trí mới để lần chạy sau nhận ra câu không đổi
                if bang[i]:
                    bd, kt = int(round(m["bd"] * SR)), int(round(m["kt"] * SR))
                    bang[i]["bam"] = hashlib.sha1(y[bd:kt].tobytes()).hexdigest()[:12]
            sf.write(f_wav, y, SR, subtype="PCM_16")
            ghi_json(f_moc, moc)
            ghi_json(f_tt, ttv)
            if tu_ch:
                mt["chuong"][str(cid)] = [tu_ch[k] for k in sorted(tu_ch)]
                ghi_json(f_tu, mt)
            ghi_json(f_q, quet)
    tra_cho()

    # --- bước 5: mốc trong video, báo cáo ---
    nhip = sorted(du_an.glob(f"{a.ma}_tao_nhip.py"))
    tg = None
    if nhip and not a.khong_tao_nhip:
        trang_thai(buoc="tao_nhip", ghi_chu=nhip[0].name)
        r = subprocess.run([shutil.which("python3") or sys.executable, "-I", str(nhip[0])], cwd=du_an,
                           capture_output=True, text=True)
        print(r.stdout[-1500:], r.stderr[-1500:], flush=True)
        if r.returncode == 0 and (du_an / "thoi_gian.json").exists():
            tg = json.loads((du_an / "thoi_gian.json").read_text(encoding="utf-8"))
    tong_giay = 0.0
    for c in json.loads(kb.read_text(encoding="utf-8-sig")):
        moc = doc_json(am / f"c{c['id']}.moc_cau.json")
        tong_giay += moc["giay"] if moc else 0

    def moc_video(cid, i):
        if not tg:
            return None
        for c in tg.get("chuong", []):
            if c["id"] == cid and i < len(c.get("cau", [])):
                t = c["cau"][i]["t"]
                return f"{int(t // 60)}:{t % 60:04.1f}"
        return None

    nghe_tai, so_dat, tong_cau = [], 0, 0
    for c in chuong:
        for i, r in enumerate(quet.get(str(c["id"]), [])):
            if not r:
                continue
            tong_cau += 1
            if r["ket_qua"] == "dat":
                so_dat += 1
            else:
                nghe_tai.append({"chuong": c["id"], "cau": i + 1, "moc": moc_video(c["id"], i), "loi": r["cau"],
                                 "nghe": r["nghe"], "lech": r["lech"]})
    kq = {"chuong_sinh_moi": sinh, "cau_doi_loi": sum(map(len, doi_loi.values())), "cau_quet": so_quet,
          "cau_lech_luot_dau": lech_dau, "cau_doc_lai": len(can_doc), "luot_doc_lai": so_luot, "cau_xet": tong_cau,
          "cau_dat_hai_le": so_dat, "cau_nghe_tai": len(nghe_tai), "giay_giong": round(tong_giay, 1),
          "thoi_luong_video": tg.get("thoi_luong_giay") if tg else None, "giong": giong}
    ghi_json(may / "giong.chi_tiet.json", {"ket_qua": kq, "nghe_tai": nghe_tai, "quet": quet})
    ghi_bao_cao(a, may, kb, kq, nghe_tai, tt_tom=f"{len(chuong)} chương")
    return kq


def nghe_tron(a, du_an, am, may):
    # Nghe lại từng câu trên tiếng đã trộn nhạc của MP4, hai lề như bước 3, lời đọc lấy từ c<id>.moc_cau.json, đoạn câu
    # lấy từ thoi_gian.json (t → den). Không đọc lại: chỉ ghi danh sách để tác tử sửa lời và soát nghe. Câu có đoạn tiếng
    # và lời không đổi từ lần nghe trước (băm) thì không nghe lại, chỉ xét lại theo danh sách bỏ qua hiện tại.
    import numpy as np
    import mlx_whisper
    from toc_do_giong import tim_ffmpeg

    ch = json.loads((GOC / "tai_san/cau_hinh_giong.json").read_text(encoding="utf-8-sig"))["vieneu"]
    bs = BoSo([tuple(x) for x in ch["chuan_hoa_nghe_lai"]], [tuple(x.split("/", 1)) for x in a.bo_qua.split(",") if "/" in x])
    tg = json.loads((du_an / "thoi_gian.json").read_text(encoding="utf-8"))
    ff = GOC / "xuong_thu_hyperframes/bin/ffmpeg"  # bản chuỗi kết xuất dùng; ffmpeg của Remotion chết SIGABRT khi gọi ngoài
    r = subprocess.run([str(ff if ff.exists() else tim_ffmpeg()), "-v", "error", "-i", str(Path(a.nghe_tron).resolve()), "-map", "0:a:0",
                        "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True)
    y = np.frombuffer(r.stdout, dtype=np.float32)
    f_q = may / "nghe_tron.json"
    cu = {x["bam"]: x for x in (json.loads(f_q.read_text(encoding="utf-8"))["cau"] if f_q.exists() else [])}
    ds, moi, canh_bao, t0 = [], 0, [], time.time()
    for c in tg.get("chuong", []):
        f_moc = am / f"c{c['id']}.moc_cau.json"
        loi = [m["cau"] for m in json.loads(f_moc.read_text(encoding="utf-8"))["cau"]] if f_moc.exists() else []
        if len(loi) != len(c.get("cau", [])):
            canh_bao.append(f"chương {c['id']}: {len(loi)} câu giọng, {len(c.get('cau', []))} câu nhịp, không nghe")
            continue
        for i, x in enumerate(c["cau"]):
            a0, b0 = int(x["t"] * 16000), int(x["den"] * 16000)
            bam = hashlib.sha1(y[a0:b0].tobytes() + loi[i].encode()).hexdigest()[:12]
            if bam not in cu:
                cu[bam] = {"bam": bam, "nghe": [mlx_whisper.transcribe(
                    y[max(0, a0 - int(le * 16000)):b0 + int(le * 16000)].copy(), path_or_hf_repo=ch["mo_hinh_nghe_lai"],
                    language="vi")["text"].strip() for le in LE]}
                moi += 1
            lech = [bs.lech(loi[i], h) for h in cu[bam]["nghe"]]
            ds.append({"chuong": c["id"], "cau": i + 1, "moc": f"{int(x['t'] // 60)}:{x['t'] % 60:04.1f}", "loi": loi[i],
                       "bam": bam, "nghe": cu[bam]["nghe"], "lech": lech, "so_le_lech": sum(1 for L in lech if L)})
    kq = {"thoi_diem": bay_gio(), "mp4": tuong_doi(a.nghe_tron), "bo_qua": a.bo_qua, "cau_xet": len(ds),
          "cau_nghe_moi": moi, "lech_hai_le": sum(x["so_le_lech"] == 2 for x in ds),
          "lech_mot_le": sum(x["so_le_lech"] == 1 for x in ds), "giay": round(time.time() - t0), "canh_bao": canh_bao,
          "cau": ds}
    ghi_json(f_q, kq)
    print(f"Nghe trên tiếng có nhạc: {len(ds)} câu (nghe mới {moi}), lệch hai lề {kq['lech_hai_le']}, "
          f"một lề {kq['lech_mot_le']}", flush=True)
    return 0


def ghi_bao_cao(a, may, kb, kq, nghe_tai, tt_tom):
    d = [f"# Chuỗi giọng {a.ma}: xong {bay_gio()[:16]}", "",
         f"- Kịch bản `{kb.name}`, {tt_tom}, giọng {kq['giong']}; tổng giọng {kq['giay_giong']} giây"
         + (f", video {kq['thoi_luong_video']} giây (sau tạo nhịp)" if kq["thoi_luong_video"] else ""),
         f"- Sinh mới chương: {','.join(map(str, kq['chuong_sinh_moi'])) or 'không'}; câu đổi lời: {kq['cau_doi_loi']}",
         f"- Quét Whisper hai lề (0,05 và 0,4 giây): {kq['cau_quet']} câu, lệch lượt đầu {kq['cau_lech_luot_dau']}",
         f"- Đọc lại: {kq['cau_doc_lai']} câu, {kq['luot_doc_lai']} lượt; đạt hai lề {kq['cau_dat_hai_le']}/{kq['cau_xet']} câu",
         f"- **Còn lệch, cần nghe tai: {kq['cau_nghe_tai']} câu**", ""]
    if nghe_tai:
        d.append("## Câu nghe tai (mốc video · chương.câu · cặp lệch lời đọc→Whisper ở lề 0,05 | 0,4)")
    for x in nghe_tai:
        cap = lambda L: ", ".join(f"{p}→{q or '∅'}" for p, q in L) or "khớp"
        d.append(f"- {x['moc'] or '?'} · {x['chuong']}.{x['cau']} · {cap(x['lech'][0])} | {cap(x['lech'][1])}")
    d += ["", f"Chi tiết từng câu: `out/may/giong.chi_tiet.json`. Sửa lời câu nào thì sửa `.chuong.json` rồi chạy lại lệnh "
          "(chỉ câu đổi được đọc lại và quét lại)."]
    s = "\n".join(d) + "\n"
    while len(s.encode()) > 2900 and len(d) > 9:  # giữ dưới 3 KB: bớt dòng câu cuối danh sách, ghi số câu lược
        d.pop(-3)
        s = "\n".join(d) + f"\n(lược bớt; đủ danh sách trong giong.chi_tiet.json)\n"
    (may / "giong.bao_cao.md").write_text(s, encoding="utf-8")


if __name__ == "__main__":
    sys.exit(main())
