#!/usr/bin/env python3
"""Kiểm một thư mục video trước khi đăng lên YouTube, Shorts, TikTok, Facebook: thông số file từng bản,
chữ đăng có đủ chưa, nhãn AI bật ở đâu, việc phải làm tay; ghi sổ lần dùng.

Chạy từ gốc Media:
  python3 -I skills/toi-uu-phan-phoi/scripts/kiem_dang.py <thư mục video> [--json] [--khong-ghi] [--khong-kiem-chu]
Giới hạn đọc từ tieu_chi_nen_tang.md (khối ```json gioi_han_video). Mã thoát 1 khi có LỖI.
LỖI là nền tảng sẽ từ chối file hoặc xếp sai loại; NHẮC là chỗ nên xem lại.
"""
import argparse
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

THU_MUC_SKILL = Path(__file__).resolve().parents[1]
GOC_MEDIA = THU_MUC_SKILL.parents[1]
SCRIPT_CHU_DANG = GOC_MEDIA / "skills" / "viet-chu-dang-video" / "scripts"
sys.path.insert(0, str(SCRIPT_CHU_DANG))
import chung  # noqa: E402  (dùng chung cách tìm video theo tên nền tảng của skill viet-chu-dang-video)

FILE_TIEU_CHI = THU_MUC_SKILL / "tieu_chi_nen_tang.md"
SO_LAN_DUNG = GOC_MEDIA / "du_lieu" / "toi_uu_phan_phoi" / "so_lan_dung.jsonl"
KHOI = ["youtube_dai", "youtube_shorts", "tiktok", "facebook"]
TEN_KHOI = {"youtube_dai": "YouTube dài", "youtube_shorts": "Shorts", "tiktok": "TikTok", "facebook": "Facebook Reels"}
# Loại cảnh cần nhãn AI, đọc từ nguon_goc.md và kịch bản (tieu_chi_nen_tang.md 2.18)
AI_TA_THUC = re.compile(r"\b(veo|omni|muse|clip ai|sora)\b", re.I)
DUNG_MAY_TA_THUC = re.compile(r"blender|cycles", re.I)
GIONG_MAY = re.compile(r"vieneu", re.I)

VIEC_TAY = {
    "youtube_dai": ["Ô 'AI use' trong Studio: bật chỉ khi có clip AI tả thực hoặc nhạc AI",
                    "Màn hình kết thúc và danh sách phát trỏ sang video cùng chủ đề",
                    "Có 1 tuần số liệu: cân nhắc Test & Compare 2–3 hình thu nhỏ"],
    "youtube_shorts": ["Sau khi công khai: đặt 'Video liên quan' về bản ngang trong Studio (API không đặt được)",
                       "5 giây cuối có câu nói video đầy đủ ở liên kết phía trên tiêu đề"],
    "tiktok": ["Kiểm bằng Content Check Lite trong TikTok Studio bản web trước khi đăng",
               "Công tắc 'AI-generated content': bật chỉ khi có cảnh hoặc người AI trông như thật"],
    "facebook": ["Nhãn AI: bật khi có giọng VieNeu, cảnh Blender Cycles hoặc clip AI tả thực (Trung bật trong Meta Business Suite)",
                 "Không đặt liên kết trong chú thích; liên kết để ở bình luận"],
}


def doc_gioi_han():
    chu = FILE_TIEU_CHI.read_text(encoding="utf-8")
    m = re.search(r"```json gioi_han_video\n(.*?)\n```", chu, re.S)
    if not m:
        raise SystemExit("không thấy khối ```json gioi_han_video trong %s" % FILE_TIEU_CHI)
    return json.loads(m.group(1))


def tim_ffprobe():
    for p in (os.environ.get("FFPROBE"), shutil.which("ffprobe"), str(GOC_MEDIA / "xuong_thu_hyperframes" / "bin" / "ffprobe")):
        if p and Path(p).exists():
            return p
    raise SystemExit("không tìm thấy ffprobe (đặt biến FFPROBE hoặc dùng xuong_thu_hyperframes/bin/ffprobe)")


def phan_so(s):
    try:
        a, b = s.split("/")
        return round(float(a) / float(b), 3) if float(b) else 0.0
    except (ValueError, AttributeError):
        return 0.0


def do_file(ffprobe, p):
    kq = subprocess.run([ffprobe, "-v", "error", "-show_entries",
                         "stream=codec_type,codec_name,width,height,avg_frame_rate,sample_rate,bit_rate,pix_fmt:format=duration,size",
                         "-of", "json", str(p)], capture_output=True, text=True)
    if kq.returncode:
        raise SystemExit("ffprobe lỗi với %s: %s" % (p, kq.stderr.strip()[:300]))
    d = json.loads(kq.stdout)
    hinh = next((s for s in d["streams"] if s.get("codec_type") == "video"), {})
    tieng = next((s for s in d["streams"] if s.get("codec_type") == "audio"), {})
    rong, cao = int(hinh.get("width", 0)), int(hinh.get("height", 0))
    return {
        "file": chung.tuong_doi(p), "rong": rong, "cao": cao,
        "kho": "ngang" if rong > cao else ("doc" if cao > rong else "vuong"),
        "ti_le": round(cao / rong, 3) if rong else 0,
        "giay": round(float(d["format"].get("duration", 0)), 2),
        "khung_giay": phan_so(hinh.get("avg_frame_rate", "0/1")),
        "ma_hinh": hinh.get("codec_name", ""), "dinh_dang_diem_anh": hinh.get("pix_fmt", ""),
        "ma_tieng": tieng.get("codec_name", ""), "tan_so_tieng": int(tieng.get("sample_rate", 0) or 0),
        "kbps_tieng": round(int(tieng.get("bit_rate", 0) or 0) / 1000),
        "mb": round(int(d["format"].get("size", 0)) / 1048576, 1),
    }


def ap_gioi_han(gh, v):
    gt = v.get(gh["truong"])
    if gt is None or gt == "" or gt == 0 and gh["truong"] not in ("giay",):
        return None
    if "trong" in gh and gt not in gh["trong"]:
        return "%s = %s, cần một trong %s" % (gh["truong"], gt, "/".join(gh["trong"]))
    if "toi_thieu" in gh and gt < gh["toi_thieu"]:
        return "%s = %s, dưới %s" % (gh["truong"], gt, gh["toi_thieu"])
    if "toi_da" in gh and gt > gh["toi_da"]:
        return "%s = %s, quá %s" % (gh["truong"], gt, gh["toi_da"])
    return None


def nhan_ai(thu_muc):
    chu = ""
    for f in [thu_muc / "tai_nguyen" / "nguon_goc.md"] + sorted((thu_muc / "tai_nguyen" / "kich_ban").glob("*.md")):
        if f.is_file():
            chu += f.read_text(encoding="utf-8", errors="replace")
    ai, may, giong = bool(AI_TA_THUC.search(chu)), bool(DUNG_MAY_TA_THUC.search(chu)), bool(GIONG_MAY.search(chu))
    if not chu:
        return {"ghi_chu": "không có nguon_goc.md hay kịch bản để đọc loại cảnh: tự xác định nhãn AI"}
    return {"youtube": "bật" if ai else "không bật", "tiktok": "bật" if ai else "không bật",
            "facebook": "bật" if (ai or may or giong) else "không bật",
            "can_cu": ", ".join(t for t, c in (("clip AI tả thực", ai), ("Blender Cycles", may), ("giọng VieNeu", giong)) if c) or "không thấy cảnh AI, giọng máy"}


def kiem(thu_muc, kiem_chu=True):
    thu_muc = chung.tuyet_doi(thu_muc)
    if not thu_muc.is_dir():
        raise SystemExit("không thấy thư mục %s" % thu_muc)
    ds_gh = doc_gioi_han()
    ffprobe = tim_ffprobe()
    video = chung.tim_video(thu_muc)
    ra = {"thu_muc": chung.tuong_doi(thu_muc), "luc": dt.datetime.now().isoformat(timespec="seconds"),
          "ban": {}, "loi": [], "nhac": [], "viec_tay": []}
    da_do = {}
    for khoi in KHOI:
        nen, p = chung.video_cho_khoi(video, khoi)
        if not p:
            continue
        v = da_do.setdefault(p, do_file(ffprobe, p))
        ra["ban"][khoi] = v
        for gh in ds_gh:
            if gh["nen_tang"] != khoi:
                continue
            sai = ap_gioi_han(gh, v)
            if sai:
                ra[gh["muc"]].append("%s · %s: %s. %s" % (TEN_KHOI[khoi], Path(v["file"]).name, sai, gh["y"]))
        if v["dinh_dang_diem_anh"] and not v["dinh_dang_diem_anh"].startswith(("yuv420p", "yuvj420p")):
            ra["nhac"].append("%s: điểm ảnh %s, nên yuv420p (4:2:0)" % (TEN_KHOI[khoi], v["dinh_dang_diem_anh"]))
        file_chu = thu_muc / "tai_nguyen" / "dang_bai" / chung.KHOI_CHO_FILE[khoi]
        if not file_chu.is_file():
            ra["nhac"].append("%s: chưa có chữ đăng %s (skill viet-chu-dang-video)" % (TEN_KHOI[khoi], chung.tuong_doi(file_chu)))
        ra["viec_tay"] += ["%s: %s" % (TEN_KHOI[khoi], x) for x in VIEC_TAY[khoi]]
    if not ra["ban"]:
        ra["loi"].append("không có file video ngoài cùng thư mục")
    if not {"youtube_shorts", "tiktok", "facebook"} & set(ra["ban"]) and "youtube_dai" in ra["ban"]:
        ra["nhac"].append("chưa có bản dọc (_shorts_, _tiktok_, _reels_): chỉ đăng được YouTube video dài")
    ra["nhan_ai"] = nhan_ai(thu_muc)
    qua_han = [g["khoa"] for g in ds_gh if (dt.date.today() - dt.date.fromisoformat(g["ngay_doc"])).days > 90]
    if qua_han:
        ra["nhac"].append("%d giới hạn đọc quá 90 ngày: chạy doi_chieu_nguon.py (SKILL.md phần C)" % len(qua_han))
    if kiem_chu and any((thu_muc / "tai_nguyen" / "dang_bai" / f).is_file() for f in chung.FILE_CHO_KHOI):
        kq = subprocess.run([sys.executable, "-I", str(SCRIPT_CHU_DANG / "kiem_chu_dang.py"), str(thu_muc)],
                            capture_output=True, text=True, cwd=GOC_MEDIA)
        so_loi = sum(1 for d in kq.stdout.splitlines() if d.lstrip().startswith("LỖI"))
        ra["kiem_chu_dang"] = {"ma_thoat": kq.returncode, "so_loi": so_loi}
        if kq.returncode:
            ra["loi"].append("chữ đăng có %d lỗi: chạy kiem_chu_dang.py %s để xem" % (so_loi, ra["thu_muc"]))
    return ra


def ghi_so(ra):
    SO_LAN_DUNG.parent.mkdir(parents=True, exist_ok=True)
    dong = {"luc": ra["luc"], "thu_muc": ra["thu_muc"], "so_loi": len(ra["loi"]), "so_nhac": len(ra["nhac"]),
            "ban": {k: {t: v[t] for t in ("file", "rong", "cao", "giay", "khung_giay")} for k, v in ra["ban"].items()},
            "nhan_ai": ra["nhan_ai"]}
    with SO_LAN_DUNG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(dong, ensure_ascii=False) + "\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("thu_muc")
    ap.add_argument("--json", action="store_true", help="in JSON thay vì chữ")
    ap.add_argument("--khong-ghi", action="store_true", help="không ghi sổ lần dùng")
    ap.add_argument("--khong-kiem-chu", action="store_true", help="bỏ bước gọi kiem_chu_dang.py")
    a = ap.parse_args()
    ra = kiem(a.thu_muc, not a.khong_kiem_chu)
    if not a.khong_ghi:
        ghi_so(ra)
    if a.json:
        print(json.dumps(ra, ensure_ascii=False, indent=1))
    else:
        print("Thư mục:", ra["thu_muc"])
        for khoi, v in ra["ban"].items():
            print("%-15s %s · %dx%d · %.1f giây · %s khung/giây · %s/%s %s kbps · %s MB" % (
                TEN_KHOI[khoi], Path(v["file"]).name, v["rong"], v["cao"], v["giay"], v["khung_giay"],
                v["ma_hinh"], v["ma_tieng"], v["kbps_tieng"], v["mb"]))
        na = ra["nhan_ai"]
        if "ghi_chu" in na:
            print("Nhãn AI:", na["ghi_chu"])
        else:
            print("Nhãn AI (căn cứ: %s): YouTube %s · TikTok %s · Facebook %s" % (na["can_cu"], na["youtube"], na["tiktok"], na["facebook"]))
        for x in ra["loi"]:
            print("LỖI:", x)
        for x in ra["nhac"]:
            print("NHẮC:", x)
        if ra["viec_tay"]:
            print("\nViệc làm tay:")
            for x in ra["viec_tay"]:
                print("  [ ]", x)
    sys.exit(1 if ra["loi"] else 0)


if __name__ == "__main__":
    main()
