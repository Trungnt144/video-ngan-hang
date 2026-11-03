"""Hàm dùng chung cho các script của skill viet-chu-dang-video. Chỉ dùng thư viện chuẩn.

Các script khác nhập module này; chạy bằng `python3 -I` nên phải tự thêm thư mục script vào sys.path.
"""
import datetime as dt
import json
import re
import struct
import unicodedata
from pathlib import Path

THU_MUC_SKILL = Path(__file__).resolve().parents[1]
GOC_MEDIA = Path(__file__).resolve().parents[3]
FILE_QUY_DINH = THU_MUC_SKILL / "quy_dinh_nen_tang.md"
SO_TRANG_THAI = GOC_MEDIA / "du_lieu" / "dang_youtube" / "so_trang_thai.jsonl"
DUOI_VIDEO = {".mp4", ".mov", ".m4v"}

# Ô chữ trong file chữ đăng: "#### <khoi> · <o>" rồi một khung ```text ... ```
MAU_O = re.compile(r"^####\s+(\S+)\s+·\s+(\S+)\s*\n+```(\w*)\n(.*?)\n```", re.M | re.S)
MAU_MOC = re.compile(r"^(?:(\d+):)?(\d{1,2}):(\d{2})\s+\S")


def nfc(s):
    return unicodedata.normalize("NFC", s)


def tuyet_doi(p):
    p = Path(str(p)).expanduser()
    return p if p.is_absolute() else GOC_MEDIA / p


def tuong_doi(p):
    try:
        return str(Path(p).resolve().relative_to(GOC_MEDIA))
    except ValueError:
        return str(p)


# ---------- quy định nền tảng ----------

def doc_quy_dinh():
    """Đọc khối ```json gioi_han ở cuối quy_dinh_nen_tang.md, trả về dict khoá → mục."""
    chu = FILE_QUY_DINH.read_text(encoding="utf-8")
    m = re.search(r"```json gioi_han\n(.*?)\n```", chu, re.S)
    if not m:
        raise SystemExit("không thấy khối ```json gioi_han trong %s" % FILE_QUY_DINH)
    return {muc["khoa"]: muc for muc in json.loads(m.group(1))}


def muc_qua_han(quy_dinh, so_ngay=90, hom_nay=None):
    hom_nay = hom_nay or dt.date.today()
    ra = []
    for muc in quy_dinh.values():
        ngay = dt.date.fromisoformat(muc["ngay_doc"])
        if (hom_nay - ngay).days > so_ngay:
            ra.append((muc["khoa"], muc["ngay_doc"]))
    return ra


# ---------- file chữ đăng ----------

# Mỗi nền tảng một file trong tai_nguyen/dang_bai/ (00_tam_nhin_va_muc_tieu.md mục 3, quy tắc 4; Trung chốt 28/10/2026)
FILE_CHO_KHOI = {"youtube.md": "youtube_dai", "shorts.md": "youtube_shorts", "tiktok.md": "tiktok", "facebook.md": "facebook"}
KHOI_CHO_FILE = {v: k for k, v in FILE_CHO_KHOI.items()}


def thu_muc_dang_bai(duong_dan):
    """Nhận thư mục video, thư mục dang_bai hoặc một file trong đó; trả về thư mục dang_bai."""
    p = tuyet_doi(duong_dan).resolve()
    if p.is_file():
        return p.parent
    if p.name == "dang_bai":
        return p
    return p / "tai_nguyen" / "dang_bai"


def doc_chu_dang(duong_dan):
    """Đọc mọi file nền tảng trong dang_bai/.

    Trả về dict: dang_bai, thu_muc (thư mục video), o {(khoi, o): chữ}, nguon {(khoi, o): tên file},
    thong_tin (gộp các khối thong_tin), phuong_an (Ba phương án tiêu đề của youtube.md), files.
    """
    db = thu_muc_dang_bai(duong_dan)
    ra = {"dang_bai": db, "thu_muc": db.parents[1], "o": {}, "nguon": {}, "thong_tin": {}, "phuong_an": [], "files": []}
    for f in sorted(db.glob("*.md")) if db.is_dir() else []:
        if f.name not in FILE_CHO_KHOI:
            continue
        ra["files"].append(f)
        chu = nfc(f.read_text(encoding="utf-8"))
        for m in MAU_O.finditer(chu):
            khoi, ten, loai, noi_dung = m.groups()
            if khoi == "thong_tin":
                ra["thong_tin"].update(json.loads(noi_dung))
            else:
                ra["o"][(khoi, ten)] = noi_dung
                ra["nguon"][(khoi, ten)] = f.name
        m = re.search(r"^## (?:Ba phương án tiêu đề|Phương án tiêu đề dự phòng)\s*\n(.*?)(?=^## |\Z)", chu, re.M | re.S)
        if m and f.name == "youtube.md":
            ra["phuong_an"] = [re.sub(r"^\d+\.\s*", "", d).strip() for d in m.group(1).splitlines() if re.match(r"^\d+\.", d)]
    if ra["thong_tin"].get("thu_muc"):
        ra["thu_muc"] = tuyet_doi(ra["thong_tin"]["thu_muc"])
    return ra


# ---------- đếm ----------

def utf16(s):
    return len(s.encode("utf-16-le")) // 2


def tach_the(chu):
    return [t.strip() for t in chu.replace("\n", ",").split(",") if t.strip()]


def do_dai_the_api(the):
    """Cách YouTube API tính 500 ký tự: dấu phẩy giữa các thẻ tính vào, thẻ có dấu cách cộng 2 (ngoặc kép)."""
    return sum(len(t) + (2 if " " in t else 0) for t in the) + max(len(the) - 1, 0)


def chan_mo_ta(kenh="dien"):
    """Chân mô tả cố định của kênh trong chan_mo_ta.md: khối ```text chan_mo_ta``` (kênh Điện) hoặc
    ```text chan_mo_ta_<kenh>``` (ví dụ chan_mo_ta_ngan_hang). Rỗng nếu chưa có."""
    f = Path(__file__).resolve().parent.parent / "chan_mo_ta.md"
    ten = "chan_mo_ta" if kenh == "dien" else "chan_mo_ta_" + kenh
    m = re.search(r"```text %s\n(.*?)```" % ten, f.read_text(encoding="utf-8"), re.S) if f.exists() else None
    return m.group(1).strip() if m else ""


def kenh_video(thong_tin, thu_muc):
    """Kênh của video: trường `kenh` trong khối thong_tin của youtube.md, rồi `kenh` trong dang_bai/hinh_thu_nho.json; mặc định "dien"."""
    if thong_tin.get("kenh"):
        return thong_tin["kenh"]
    htn = Path(thu_muc) / "tai_nguyen" / "dang_bai" / "hinh_thu_nho.json"
    try:
        return json.loads(htn.read_text(encoding="utf-8")).get("kenh") or "dien"
    except (OSError, ValueError):
        return "dien"


def hashtag(chu):
    return re.findall(r"(?<![\w&/])#([^\s#,.;:!?()\"']+)", chu)


def moc_chuong(mo_ta):
    """Các dòng mốc chương trong mô tả: [(giây, dòng)]."""
    ra = []
    for dong in mo_ta.splitlines():
        m = MAU_MOC.match(dong.strip())
        if m:
            giay = int(m.group(1) or 0) * 3600 + int(m.group(2)) * 60 + int(m.group(3))
            ra.append((giay, dong.strip()))
    return ra


# ---------- đo video ----------

def _hop(f, bat_dau, ket_thuc):
    """Duyệt các hộp (box) MP4 trong đoạn [bat_dau, ket_thuc): trả về (loại, vị trí dữ liệu, vị trí hết)."""
    vi_tri = bat_dau
    while vi_tri + 8 <= ket_thuc:
        f.seek(vi_tri)
        co, loai = struct.unpack(">I4s", f.read(8))
        dau = 8
        if co == 1:
            co = struct.unpack(">Q", f.read(8))[0]
            dau = 16
        elif co == 0:
            co = ket_thuc - vi_tri
        if co < dau:
            return
        yield loai.decode("latin-1"), vi_tri + dau, vi_tri + co
        vi_tri += co


def do_mp4(duong_dan):
    """Đọc khổ hình và thời lượng của file MP4 từ hộp mvhd và tkhd, không cần ffprobe."""
    p = Path(duong_dan)
    ra = {"file": tuong_doi(p), "rong": 0, "cao": 0, "giay": 0.0}
    with p.open("rb") as f:
        het = p.stat().st_size
        for loai, a, b in _hop(f, 0, het):
            if loai != "moov":
                continue
            for loai2, a2, b2 in _hop(f, a, b):
                if loai2 == "mvhd":
                    f.seek(a2)
                    phien_ban = f.read(1)[0]
                    f.read(3)
                    if phien_ban == 1:
                        f.read(16)
                        thang, dai = struct.unpack(">IQ", f.read(12))
                    else:
                        f.read(8)
                        thang, dai = struct.unpack(">II", f.read(8))
                    ra["giay"] = round(dai / thang, 3) if thang else 0.0
                elif loai2 == "trak":
                    for loai3, a3, b3 in _hop(f, a2, b2):
                        if loai3 == "tkhd":
                            f.seek(b3 - 8)
                            rong, cao = struct.unpack(">II", f.read(8))
                            rong, cao = rong >> 16, cao >> 16
                            if rong and cao and not ra["rong"]:
                                ra["rong"], ra["cao"] = rong, cao
    ra["kho"] = "ngang" if ra["rong"] > ra["cao"] else ("doc" if ra["cao"] > ra["rong"] else "vuong")
    return ra


MAU_NEN_TANG = re.compile(r"_(youtube|shorts|reels|tiktok|facebook|zalo)\d*_v\d+")
# Video đã đổi tên theo tiêu đề trên kênh (Trung chốt 29/10/2026): "<tiêu đề>.mp4" là bản YouTube,
# "<tiêu đề> (Facebook).mp4" là bản nền tảng khác; tên không còn _v<n> coi là bản cuối
MAU_NEN_TANG_TEN_KENH = re.compile(r"\((youtube|shorts|reels|tiktok|facebook|zalo)\d*\)$", re.I)
MAU_PHIEN_BAN = re.compile(r"_v\d+")
# Tên nền tảng trong tên file (00_tam_nhin_va_muc_tieu.md mục 3): reels và facebook là cùng một nơi đăng
GOP_NEN_TANG = {"reels": "facebook"}
# Khối chữ đăng → video dùng cho khối đó (danh sách theo thứ tự ưu tiên; bản dọc shorts dùng chung được)
VIDEO_CHO_KHOI = {"youtube_dai": ["youtube"], "youtube_shorts": ["shorts"], "tiktok": ["tiktok", "shorts"],
                  "facebook": ["facebook", "shorts"]}


def tim_video(thu_muc):
    """Video ngoài cùng thư mục theo nền tảng: {'youtube': file, 'shorts': file, ...}.
    File không có tên nền tảng là bản YouTube ngang. Ưu tiên bản _cuoi, rồi bản _nhap mới nhất."""
    ung_vien = {}
    for p in sorted(Path(thu_muc).iterdir()):
        if p.suffix.lower() not in DUOI_VIDEO or not p.is_file():
            continue
        m = MAU_NEN_TANG.search(p.stem) or MAU_NEN_TANG_TEN_KENH.search(p.stem)
        nen = m.group(1).lower() if m else "youtube"
        nen = GOP_NEN_TANG.get(nen, nen)
        ung_vien.setdefault(nen, []).append(p)
    ra = {}
    for nen, ds in ung_vien.items():
        cuoi = [p for p in ds if p.stem.endswith("_cuoi") or not MAU_PHIEN_BAN.search(p.stem)]
        chon = cuoi or sorted(ds, key=lambda p: p.stat().st_mtime)
        ra[nen] = chon[-1]
    return ra


def video_cho_khoi(video, khoi):
    for nen in VIDEO_CHO_KHOI.get(khoi, []):
        if nen in video:
            return nen, video[nen]
    return None, None


def tim_chuong(thu_muc):
    """Mốc chương từ thoi_gian.json của dự án dựng ghi trong tai_nguyen/nguon_goc.md (thiếu thì tìm trong kịch bản).
    Remotion ghi `bat_dau` theo khung hình; video HTML (LM-03) ghi `t` theo giây. Trả về (danh sách, nguồn) hoặc ([], lý do)."""
    nguon_goc = Path(thu_muc) / "tai_nguyen" / "nguon_goc.md"
    chu = nguon_goc.read_text(encoding="utf-8") if nguon_goc.exists() else tim_kich_ban(thu_muc)[1]
    noi = "nguon_goc.md" if nguon_goc.exists() else "nguon_goc.md (không có) và kịch bản"
    m = re.search(r"(xuong_dai|xuong_html)/([A-Za-z0-9_.\-]*[A-Za-z0-9_\-])/?", chu)  # tên thư mục dựng có thể có dấu chấm (2026.10.28_cic_la_gi)
    if not m:
        return [], "%s không ghi thư mục dựng xuong_dai/ hoặc xuong_html/" % noi
    for ten in ("src/thoi_gian.json", "thoi_gian.json"):
        tg = GOC_MEDIA / m.group(1) / m.group(2) / ten
        if tg.exists():
            d = json.loads(tg.read_text(encoding="utf-8"))
            fps = d.get("fps", 30)
            ds = [(int(c["bat_dau"] // fps) if "bat_dau" in c else int(c["t"]), c.get("ten", "Chương %s" % c.get("id", "")))
                  for c in d.get("chuong", [])]
            return ds, tuong_doi(tg)
    return [], "không thấy thoi_gian.json trong %s/%s" % (m.group(1), m.group(2))


def dinh_dang_moc(giay):
    return ("%d:%02d:%02d" % (giay // 3600, giay % 3600 // 60, giay % 60)) if giay >= 3600 else "%02d:%02d" % (giay // 60, giay % 60)


def tim_kich_ban(thu_muc):
    """Mọi file trong tai_nguyen/kich_ban/ (kịch bản, file chương, nguồn kiểm chứng, tóm tắt): chữ dùng để đối chiếu con số."""
    kb = Path(thu_muc) / "tai_nguyen" / "kich_ban"
    if not kb.is_dir():
        return [], ""
    files = sorted(p for p in kb.iterdir() if p.suffix in (".md", ".json"))
    return files, nfc("\n".join(p.read_text(encoding="utf-8", errors="replace") for p in files))


def ma_da_tai(ma):
    """Tra sổ trạng thái của dang-youtube: trả về videoId nếu mã đã lên kênh."""
    if not ma or not SO_TRANG_THAI.exists():
        return None
    video_id = None
    for dong in SO_TRANG_THAI.read_text(encoding="utf-8").splitlines():
        if dong.strip():
            r = json.loads(dong)
            if r.get("ma") == ma and r.get("trang_thai") in ("da_tai", "da_co") and r.get("videoId"):
                video_id = r["videoId"]
    return video_id


def danh_sach_phat(ma, kenh):
    """Danh sách phát của một video theo du_lieu/dang_youtube/danh_sach_phat_<kênh>.json (nguồn duy nhất, Trung chốt 02/11/2026).

    Trả về (tên các danh sách chứa mã, theo thứ tự trong file; danh sách nghiệp vụ của mã hoặc None).
    Kênh chưa có file cấu hình thì trả về (None, None): khi đó dùng ô playlistTitles của youtube.md như trước.
    """
    f = GOC_MEDIA / "du_lieu" / "dang_youtube" / ("danh_sach_phat_%s.json" % kenh)
    if not f.exists():
        return None, None
    ten, nghiep_vu = [], None
    for ds in json.loads(f.read_text(encoding="utf-8"))["danh_sach"]:
        if ma and ma.upper() in (m.upper() for m in ds["video"]):
            ten.append(ds["tieu_de"])
            if ds["loai"] == "nghiep_vu":
                nghiep_vu = ds
    return ten, nghiep_vu
