#!/usr/bin/env python3
"""Đăng một lô Reels lên Trang Facebook bằng facebook-cli theo file kê khai.

Mặc định chỉ chạy thử (kiểm chữ đăng, kiểm video theo giới hạn Reels, kiểm Trang, in lệnh sẽ chạy); thêm --chay-that mới đăng.
Chạy:  python3 -I skills/dang-facebook/scripts/chay_lo.py <file_ke_khai.json> [--chay-that] [--toi-da N]
       python3 -I skills/dang-facebook/scripts/chay_lo.py --trang     (liệt kê Trang đã nối, chỉ đọc)
Chạy từ gốc Media. Không đọc ~/.facebook-mcp/pages.json (chứa khoá Trang): mọi việc với Trang đi qua facebook-cli.
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

GOC_MEDIA = Path(__file__).resolve().parents[3]
THU_MUC_SKILL = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(GOC_MEDIA / "skills" / "viet-chu-dang-video" / "scripts"))
from chung import doc_chu_dang, tim_video, do_mp4, tuong_doi, nfc  # noqa: E402

SO_MAC_DINH = GOC_MEDIA / "du_lieu" / "dang_facebook" / "so_trang_thai.jsonl"
NHAT_KY_GHI = GOC_MEDIA / "du_lieu" / "dang_facebook" / "nhat_ky_ghi.jsonl"
FILE_TRANG = THU_MUC_SKILL / "trang_theo_kenh.json"
FACEBOOK_CLI = shutil.which("facebook-cli") or str(Path.home() / ".local" / "bin" / "facebook-cli")
# ffprobe của Remotion, bọc trong xuong_thu_hyperframes/bin (máy không có Homebrew, 90_bai_hoc.md 26/10/2026)
FFPROBE = shutil.which("ffprobe") or str(GOC_MEDIA / "xuong_thu_hyperframes" / "bin" / "ffprobe")

CHE_DO = {"nhap", "len_lich", "dang_ngay"}
TRANG_THAI_XONG = {"da_dang", "da_len_lich", "da_nhap", "da_co"}
# Giới hạn Reels của Graph API (developers.facebook.com/docs/video-api/guides/reels-publishing, README facebook-mcp-cli 0.4.0)
TI_LE_DOC = 9 / 16
RONG_TOI_THIEU, CAO_TOI_THIEU = 540, 960
GIAY_TOI_THIEU, GIAY_TOI_DA = 3, 90
FPS_TOI_THIEU, FPS_TOI_DA = 24, 60
MA_HINH = {"h264", "hevc"}
REELS_24_GIO = 30
PHUT_TOI_THIEU = 15   # Facebook đòi hơn 10 phút; chừa 5 phút cho lúc tải lên
NGAY_TOI_DA = 29
# Mã thoát facebook-cli: ý nghĩa, có dừng cả lô không, trạng thái ghi sổ
MA_THOAT = {
    2: ("bị từ chối (sai cú pháp hoặc chưa bật quyền ghi)", False, "loi"),
    3: ("không tìm thấy Trang", True, "loi"),
    4: ("Meta từ chối khoá Trang (hết hạn hoặc thiếu quyền)", True, "loi"),
    5: ("lỗi API hoặc quá thời gian chờ", False, "loi"),
    7: ("quá giới hạn tốc độ", True, "hoan"),
    10: ("chưa nối Trang nào (chưa chạy facebook-cli login)", True, "loi"),
}


def doc_so(duong_dan):
    muc = []
    if duong_dan.exists():
        for dong in duong_dan.read_text(encoding="utf-8").splitlines():
            if dong.strip():
                muc.append(json.loads(dong))
    return muc


def ghi_so(duong_dan, ban_ghi):
    duong_dan.parent.mkdir(parents=True, exist_ok=True)
    with duong_dan.open("a", encoding="utf-8") as f:
        f.write(json.dumps(ban_ghi, ensure_ascii=False) + "\n")


def tuyet_doi(p):
    p = Path(os.path.expanduser(p))
    return p if p.is_absolute() else GOC_MEDIA / p


def bay_gio():
    return dt.datetime.now(dt.timezone.utc).astimezone()


def doc_thoi_diem(chuoi):
    t = dt.datetime.fromisoformat(chuoi.replace("Z", "+00:00"))
    if t.tzinfo is None:
        raise ValueError("thiếu múi giờ (thêm +07:00)")
    return t


def goi_cli(doi_so, ghi=False):
    """Gọi facebook-cli. Chỉ lệnh đăng mới bật quyền ghi; quyền xoá luôn tắt."""
    env = dict(os.environ)
    for k in ("FACEBOOK_ALLOW_WRITE", "FACEBOOK_ALLOW_DELETE", "FACEBOOK_ALLOW_DESTRUCTIVE", "FACEBOOK_READ_ONLY"):
        env.pop(k, None)
    env["FACEBOOK_ALLOW_DELETE"] = "false"
    env["FACEBOOK_ALLOW_DESTRUCTIVE"] = "0"
    if ghi:
        env["FACEBOOK_ALLOW_WRITE"] = "true"
        env["FACEBOOK_AUDIT_LOG"] = str(NHAT_KY_GHI)
        NHAT_KY_GHI.parent.mkdir(parents=True, exist_ok=True)
    else:
        env["FACEBOOK_READ_ONLY"] = "1"
    kq = subprocess.run([FACEBOOK_CLI] + doi_so, capture_output=True, text=True, env=env)
    # Lỗi in ra stderr dạng JSON {"error", "code"}; kết quả in ra stdout
    chu = kq.stdout.strip() or kq.stderr.strip()
    try:
        du_lieu = json.loads(chu) if chu else {}
    except json.JSONDecodeError:
        du_lieu = {"_chu": chu}
    loi = du_lieu.get("error") if isinstance(du_lieu, dict) and du_lieu.get("error") else kq.stderr.strip()
    return kq.returncode, du_lieu, loi


def danh_sach_trang():
    ma, du_lieu, loi = goi_cli(["list-pages", "--compact"])
    if ma != 0:
        return ma, [], loi
    ds = du_lieu if isinstance(du_lieu, list) else du_lieu.get("pages") or du_lieu.get("data") or []
    return 0, [{"id": str(t.get("id")), "name": t.get("name")} for t in ds if isinstance(t, dict)], ""


def do_video(p):
    """Đo bằng ffprobe; không có ffprobe thì đo khổ và thời lượng từ hộp MP4 (không kiểm được fps, mã hoá)."""
    if Path(FFPROBE).exists():
        kq = subprocess.run([FFPROBE, "-v", "error", "-show_entries",
                             "stream=codec_type,codec_name,width,height,avg_frame_rate:format=duration",
                             "-of", "json", str(p)], capture_output=True, text=True)
        if kq.returncode == 0:
            d = json.loads(kq.stdout)
            hinh = next((s for s in d.get("streams", []) if s.get("codec_type") == "video"), {})
            tieng = [s.get("codec_name") for s in d.get("streams", []) if s.get("codec_type") == "audio"]
            tu, _, mau = (hinh.get("avg_frame_rate") or "0/1").partition("/")
            fps = float(tu) / float(mau or 1) if float(mau or 1) else 0.0
            return {"rong": hinh.get("width", 0), "cao": hinh.get("height", 0), "giay": float(d.get("format", {}).get("duration", 0)),
                    "fps": round(fps, 2), "ma_hinh": hinh.get("codec_name"), "ma_tieng": tieng, "do_du": True}
    d = do_mp4(p)
    return {"rong": d["rong"], "cao": d["cao"], "giay": d["giay"], "fps": None, "ma_hinh": None, "ma_tieng": None, "do_du": False}


def kiem_video(p):
    loi, nhac = [], []
    if p.suffix.lower() != ".mp4":
        loi.append("file không phải .mp4")
        return loi, nhac, {}
    d = do_video(p)
    if not d["rong"] or abs(d["rong"] / d["cao"] - TI_LE_DOC) > 0.01:
        loi.append("khổ %dx%d không phải 9:16" % (d["rong"], d["cao"]))
    if d["rong"] < RONG_TOI_THIEU or d["cao"] < CAO_TOI_THIEU:
        loi.append("nhỏ hơn 540x960")
    elif not loi and (d["rong"], d["cao"]) != (1080, 1920):
        nhac.append("khổ %dx%d, Facebook khuyến nghị 1080x1920" % (d["rong"], d["cao"]))
    if not GIAY_TOI_THIEU <= d["giay"] <= GIAY_TOI_DA:
        loi.append("dài %.1f giây, Reels qua API chỉ nhận 3–90 giây" % d["giay"])
    if d["do_du"]:
        if not FPS_TOI_THIEU <= d["fps"] <= FPS_TOI_DA:
            loi.append("%.2f khung/giây, cần 24–60" % d["fps"])
        if d["ma_hinh"] not in MA_HINH:
            loi.append("mã hoá hình %s, cần H.264 hoặc H.265" % d["ma_hinh"])
        if not d["ma_tieng"]:
            nhac.append("video không có tiếng")
        elif any(m != "aac" for m in d["ma_tieng"]):
            loi.append("mã hoá tiếng %s, cần AAC" % ",".join(d["ma_tieng"]))
    else:
        nhac.append("không chạy được ffprobe: chưa kiểm khung/giây và mã hoá")
    return loi, nhac, d


def doc_facebook_md(thu_muc):
    """Chú thích, tiêu đề, dòng duyệt, nhãn AI từ tai_nguyen/dang_bai/facebook.md."""
    f = thu_muc / "tai_nguyen" / "dang_bai" / "facebook.md"
    if not f.exists():
        return None, ["chưa có %s (viết bằng skill viet-chu-dang-video)" % tuong_doi(f)]
    chu = doc_chu_dang(thu_muc)
    toan_van = nfc(f.read_text(encoding="utf-8"))
    loi = []
    chu_thich = chu["o"].get(("facebook", "chu_thich"), "").strip()
    if not chu_thich or "<" in chu_thich:
        loi.append("facebook.md chưa có ô chu_thich hoặc còn chữ giữ chỗ < >")
    m = re.search(r"Trung duyệt\s+([^\n·]+)", toan_van)
    duyet = m.group(1).strip() if m else ""
    if not re.match(r"\d{1,2}/\d{1,2}/\d{4}", duyet):
        loi.append("facebook.md chưa ghi ngày Trung duyệt (đang là \"%s\")" % (duyet or "trống"))
    m = re.search(r"nhãn AI:\s*(bật|tắt)", toan_van, re.I)
    nhan_ai = m.group(1).lower() if m else None
    if nhan_ai is None:
        loi.append("facebook.md không ghi \"nhãn AI: bật\" hoặc \"nhãn AI: tắt\"")
    return {"file": tuong_doi(f), "chu_thich": chu_thich, "tieu_de": chu["o"].get(("facebook", "tieu_de"), "").strip(),
            "duyet": duyet, "nhan_ai": nhan_ai}, loi


def da_xong(so, ma, kenh):
    for r in reversed(so):
        if r.get("ma") == ma and r.get("kenh") == kenh and r.get("trang_thai") in TRANG_THAI_XONG:
            return r
    return None


def dem_24_gio(so, kenh):
    moc = bay_gio() - dt.timedelta(hours=24)
    return sum(1 for r in so if r.get("kenh") == kenh and r.get("video_id")
               and doc_thoi_diem(r["thoi_diem"]) > moc)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("ke_khai", nargs="?")
    ap.add_argument("--chay-that", action="store_true", help="đăng thật (mặc định chỉ chạy thử)")
    ap.add_argument("--toi-da", type=int, default=10, help="số Reels tối đa mỗi lần chạy (mặc định 10)")
    ap.add_argument("--so", default=str(SO_MAC_DINH))
    ap.add_argument("--trang", action="store_true", help="liệt kê Trang facebook-cli đã nối rồi thoát")
    a = ap.parse_args()

    cau_hinh = json.loads(FILE_TRANG.read_text(encoding="utf-8"))
    ma_trang, trang, loi_trang = danh_sach_trang()
    if a.trang:
        if ma_trang:
            print("facebook-cli list-pages thoát mã %d: %s" % (ma_trang, loi_trang))
            return ma_trang
        for t in trang:
            print("%s\t%s" % (t["id"], t["name"]))
        return 0
    if not a.ke_khai:
        ap.error("thiếu file kê khai")

    ke_khai = json.loads(tuyet_doi(a.ke_khai).read_text(encoding="utf-8"))
    mac_dinh = ke_khai.get("mac_dinh", {})
    so_path = Path(a.so)
    so = doc_so(so_path)
    gio = bay_gio()
    if ma_trang:
        print("! Trang: facebook-cli list-pages thoát mã %d (%s)%s" % (
            ma_trang, loi_trang, "" if a.chay_that else "; chạy thử vẫn kiểm phần còn lại"))
        if a.chay_that:
            return ma_trang

    viec, tong_loi = [], 0
    for v in ke_khai.get("video", []):
        ma = v.get("ma", "?")
        kenh = v.get("kenh", mac_dinh.get("kenh"))
        che_do = v.get("che_do", mac_dinh.get("che_do", "nhap"))
        loi, nhac = [], []
        tt_kenh = cau_hinh["kenh"].get(kenh)
        if not tt_kenh:
            loi.append("kênh \"%s\" không có trong trang_theo_kenh.json" % kenh)
        elif not tt_kenh.get("da_co_trang"):
            loi.append("kênh %s chưa có Trang Facebook (da_co_trang false)" % tt_kenh["ten_kenh"])
        elif not ma_trang and not any(t["name"] == tt_kenh["ten_trang"] or t["id"] == str(tt_kenh.get("id_trang"))
                                      for t in trang):
            loi.append("facebook-cli chưa nối Trang \"%s\"" % tt_kenh["ten_trang"])
        trang_dang = (tt_kenh or {}).get("id_trang") or (tt_kenh or {}).get("ten_trang")

        cu = da_xong(so, ma, kenh)
        if cu:
            print("= %s: đã có trong sổ (%s, video_id %s), bỏ qua" % (ma, cu["trang_thai"], cu.get("video_id")))
            continue

        thu_muc = tuyet_doi(v.get("thu_muc", ""))
        if not thu_muc.is_dir():
            print("✗ %s: không thấy thư mục %s" % (ma, v.get("thu_muc")))
            tong_loi += 1
            continue
        chu, loi_chu = doc_facebook_md(thu_muc)
        loi += loi_chu

        video = tim_video(thu_muc).get("facebook")
        if not video:
            loi.append("không có bản dọc ngoài cùng thư mục (<tiêu đề> (Facebook).mp4 hoặc tên có _reels_; bản dọc dùng chung thì tạo tên _reels_ bằng ln); không đăng bản ngang")
            do = {}
        else:
            loi_v, nhac_v, do = kiem_video(video)
            loi += loi_v
            nhac += nhac_v

        if che_do not in CHE_DO:
            loi.append("che_do \"%s\" không hợp lệ (nhap, len_lich, dang_ngay)" % che_do)
        publish_at = (v.get("publish_at") or "").strip()
        if che_do == "len_lich":
            try:
                t = doc_thoi_diem(publish_at)
                if t - gio < dt.timedelta(minutes=PHUT_TOI_THIEU):
                    loi.append("giờ đăng %s cách lúc chạy chưa tới %d phút" % (publish_at, PHUT_TOI_THIEU))
                if t - gio > dt.timedelta(days=NGAY_TOI_DA):
                    loi.append("giờ đăng %s quá %d ngày" % (publish_at, NGAY_TOI_DA))
            except ValueError as e:
                loi.append("publish_at \"%s\" sai: %s" % (publish_at, e))
        elif publish_at:
            nhac.append("có publish_at nhưng che_do là %s: bỏ qua giờ đăng" % che_do)
        if chu and chu["nhan_ai"] == "bật" and che_do != "nhap" and not cau_hinh["nhan_ai"]["len_lich_khi_can_nhan"]:
            loi.append("facebook.md ghi nhãn AI bật mà API không khai được nhãn: chỉ được che_do nhap, "
                       "Trung bật nhãn AI và đặt giờ đăng trong Meta Business Suite")
        if chu and chu["tieu_de"]:
            nhac.append("ô tieu_de không gửi được (facebook-cli chỉ gửi chú thích); Trung điền tay nếu cần")

        print("%s %s → %s, %s%s" % ("✗" if loi else "✓", ma, (tt_kenh or {}).get("ten_trang", kenh), che_do,
                                     " " + publish_at if che_do == "len_lich" else ""))
        if video:
            print("    video %s (%sx%s, %.1f giây, %s khung/giây)" % (
                tuong_doi(video), do.get("rong"), do.get("cao"), do.get("giay", 0), do.get("fps")))
        for x in loi:
            print("    lỗi: " + x)
        for x in nhac:
            print("    nhắc: " + x)
        if loi:
            tong_loi += 1
            continue
        lenh = ["create-reel", "--file", str(video), "--caption", chu["chu_thich"], "--page", str(trang_dang),
                "--confirm", "--wait", "--compact"]
        if che_do == "nhap":
            lenh.append("--draft")
        elif che_do == "len_lich":
            lenh += ["--publish-at", publish_at]
        viec.append({"ma": ma, "kenh": kenh, "che_do": che_do, "publish_at": publish_at if che_do == "len_lich" else "",
                     "file": tuong_doi(video), "chu_dang": chu["file"], "nhan_ai": chu["nhan_ai"], "lenh": lenh})

    print("\n%d video sẵn sàng, %d video có lỗi." % (len(viec), tong_loi))
    if not a.chay_that:
        for w in viec:
            print("  [chạy thử] FACEBOOK_ALLOW_WRITE=true facebook-cli " + " ".join(
                x if x != w["lenh"][4] else "<chú thích %d ký tự>" % len(x) for x in w["lenh"]))
        print("Chưa đăng gì. Thêm --chay-that để đăng.")
        return 0 if not tong_loi else 2
    if tong_loi:
        print("Còn lỗi: sửa rồi chạy lại. Không đăng video nào.")
        return 2

    so_lan = 0
    for w in viec:
        if so_lan >= a.toi_da:
            print("Đủ --toi-da %d, dừng. Chạy lại để đăng tiếp." % a.toi_da)
            break
        if dem_24_gio(doc_so(so_path), w["kenh"]) >= REELS_24_GIO:
            print("Trang của kênh %s đã có %d Reels qua API trong 24 giờ, dừng." % (w["kenh"], REELS_24_GIO))
            break
        print("→ %s: đang tải lên..." % w["ma"])
        ma, kq, loi = goi_cli(w["lenh"], ghi=True)
        ban_ghi = {k: w[k] for k in ("ma", "kenh", "che_do", "publish_at", "file", "chu_dang", "nhan_ai")}
        ban_ghi["thoi_diem"] = bay_gio().isoformat(timespec="seconds")
        if ma == 0:
            video_id = str(kq.get("video_id") or (kq.get("result") or {}).get("video_id") or "")
            ban_ghi.update({"trang_thai": {"nhap": "da_nhap", "len_lich": "da_len_lich", "dang_ngay": "da_dang"}[w["che_do"]],
                            "video_id": video_id, "ket_qua": kq})
            ghi_so(so_path, ban_ghi)
            so_lan += 1
            print("  ✓ video_id %s. Xem trạng thái: facebook-cli get-reel-status --video-id %s" % (video_id, video_id))
            continue
        y_nghia, dung_lo, trang_thai = MA_THOAT.get(ma, ("lỗi không lường trước", True, "loi"))
        ban_ghi.update({"trang_thai": trang_thai, "ma_thoat": ma, "loi": loi[:500]})
        ghi_so(so_path, ban_ghi)
        print("  ✗ mã thoát %d, %s: %s" % (ma, y_nghia, ban_ghi["loi"]))
        if dung_lo:
            print("Dừng lô.")
            return ma
    return 0


if __name__ == "__main__":
    sys.exit(main())
