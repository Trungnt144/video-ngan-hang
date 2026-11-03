#!/usr/bin/env python3
"""Tạo danh sách phát trên kênh YouTube và xếp video vào đúng thứ tự theo file cấu hình danh sách phát.

File cấu hình (mặc định du_lieu/dang_youtube/danh_sach_phat_ngan_hang.json) là nguồn duy nhất: mỗi danh sách có
khoa, loai, tieu_de, mo_ta, hien_thi, video (thứ tự mã sổ nợ, kể cả bản nháp chưa lên kênh). Mã video tra theo
so_trang_thai.jsonl (trạng thái da_tai hoặc da_co); mã chưa lên kênh bị bỏ qua, lần chạy sau khi mã đã lên sẽ được
chèn đúng chỗ.

Với mỗi danh sách:
- chưa có playlistId trong cấu hình → playlists.insert (50 đơn vị), ghi playlistId ngược vào cấu hình;
- tên, mô tả, chế độ hiển thị trên kênh khác cấu hình → playlists.update (50 đơn vị);
- đọc các video đang có (playlistItems.list, 1 đơn vị mỗi 50 video), chèn video thiếu đúng vị trí
  (playlistItems.insert, 50 đơn vị), rồi sửa vị trí video đứng sai (playlistItems.update, 50 đơn vị).
Video có trên kênh mà không có trong cấu hình thì chỉ báo, không gỡ.

Mặc định chỉ chạy thử: đọc kênh, in việc sẽ làm và số đơn vị hạn mức, không ghi gì. Thêm --chay-that để làm.
Mỗi lệnh ghi một dòng vào du_lieu/dang_youtube/so_danh_sach_phat.jsonl. Hết hạn mức (quotaExceeded) thì dừng;
chạy lại sau 15 giờ Việt Nam là làm tiếp, không gắn trùng vì luôn đọc lại danh sách trên kênh.

Chạy từ gốc Media:
  python3 -I skills/dang-youtube/scripts/danh_sach_phat.py [--cau-hinh <file>] [--chi <khoa>] [--chay-that]
"""
import argparse
import datetime as dt
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

GOC_MEDIA = Path(__file__).resolve().parents[3]
THU_MUC = GOC_MEDIA / "du_lieu" / "dang_youtube"
SO_TRANG_THAI = THU_MUC / "so_trang_thai.jsonl"
SO_DANH_SACH = THU_MUC / "so_danh_sach_phat.jsonl"
CAU_HINH_MAC_DINH = THU_MUC / "danh_sach_phat_ngan_hang.json"
API = "https://www.googleapis.com/youtube/v3/"
GIA = {"tao": 50, "sua": 50, "chen": 50, "doi_cho": 50}


class HetHanMuc(Exception):
    pass


def doc_jsonl(duong_dan):
    if not duong_dan.exists():
        return []
    return [json.loads(d) for d in duong_dan.read_text(encoding="utf-8").splitlines() if d.strip()]


def ma_da_tai():
    """mã sổ nợ viết hoa → videoId, theo dòng mới nhất có trạng thái da_tai hoặc da_co."""
    ra = {}
    for d in doc_jsonl(SO_TRANG_THAI):
        if d.get("trang_thai") in ("da_tai", "da_co") and d.get("videoId"):
            ra[d["ma"].upper()] = d["videoId"]
    return ra


def lay_access_token(khoa):
    cs = json.loads((khoa / "client_secrets.json").read_text(encoding="utf-8"))
    cs = cs.get("web") or cs.get("installed")
    tk = json.loads((khoa / "request.token").read_text(encoding="utf-8"))
    du_lieu = urllib.parse.urlencode({"client_id": cs["client_id"], "client_secret": cs["client_secret"],
                                      "refresh_token": tk["refresh_token"], "grant_type": "refresh_token"}).encode()
    return json.load(urllib.request.urlopen(cs.get("token_uri", "https://oauth2.googleapis.com/token"), du_lieu, timeout=30))["access_token"]


def goi(ma, phuong_thuc, duong, du_lieu=None):
    yc = urllib.request.Request(API + duong, method=phuong_thuc, headers={"Authorization": "Bearer " + ma},
                                data=json.dumps(du_lieu).encode() if du_lieu is not None else None)
    if du_lieu is not None:
        yc.add_header("Content-Type", "application/json; charset=utf-8")
    # 429 RESOURCE_EXHAUSTED là giới hạn tốc độ (gửi dồn nhiều lệnh), không phải hết hạn mức ngày: chờ rồi thử lại.
    for cho in (30, 60, 120, 240, None):
        try:
            return json.load(urllib.request.urlopen(yc, timeout=60))
        except urllib.error.HTTPError as e:
            noi_dung = e.read().decode("utf-8", "replace")
            if "quotaExceeded" in noi_dung:
                raise HetHanMuc()
            if e.code == 429 and cho:
                print("  YouTube báo 429, chờ %d giây rồi thử lại" % cho, flush=True)
                time.sleep(cho)
                continue
            raise RuntimeError("HTTP %s: %s" % (e.code, noi_dung[:400]))


def doc_muc(ma, playlist_id):
    """Các video đang có trong danh sách, theo thứ tự: [(videoId, playlistItemId)]."""
    ra, trang = [], ""
    while True:
        kq = goi(ma, "GET", "playlistItems?part=snippet&maxResults=50&playlistId=%s%s" % (playlist_id, trang))
        for it in kq.get("items", []):
            ra.append((it["snippet"]["resourceId"]["videoId"], it["id"]))
        if not kq.get("nextPageToken"):
            return ra
        trang = "&pageToken=" + kq["nextPageToken"]


def ghi_so(dong):
    dong = dict(dong, thoi_gian=dt.datetime.now().isoformat(timespec="seconds"))
    with SO_DANH_SACH.open("a", encoding="utf-8") as f:
        f.write(json.dumps(dong, ensure_ascii=False) + "\n")


def kiem_cau_hinh(ch, da_tai):
    loi, nghiep_vu = [], {}
    khoa_da_gap = set()
    for ds in ch["danh_sach"]:
        if ds["khoa"] in khoa_da_gap:
            loi.append("trùng khoa %s" % ds["khoa"])
        khoa_da_gap.add(ds["khoa"])
        if len(ds["tieu_de"]) > 150 or "<" in ds["tieu_de"] + ds["mo_ta"] or ">" in ds["tieu_de"] + ds["mo_ta"]:
            loi.append("%s: tên quá 150 ký tự hoặc có ký tự < >" % ds["khoa"])
        if ds["hien_thi"] not in ("public", "unlisted", "private"):
            loi.append("%s: hien_thi phải là public, unlisted hoặc private" % ds["khoa"])
        ma = [m.upper() for m in ds["video"]]
        if len(set(ma)) != len(ma):
            loi.append("%s: một mã xuất hiện hai lần" % ds["khoa"])
        if ds["loai"] == "nghiep_vu":
            for m in ma:
                if m in nghiep_vu:
                    loi.append("%s nằm ở hai danh sách nghiệp vụ: %s và %s" % (m, nghiep_vu[m], ds["khoa"]))
                nghiep_vu[m] = ds["khoa"]
    return loi, nghiep_vu


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cau-hinh", default=str(CAU_HINH_MAC_DINH))
    ap.add_argument("--chi", action="append", help="chỉ làm danh sách có khoa này (lặp được)")
    ap.add_argument("--chay-that", action="store_true")
    a = ap.parse_args()

    duong_cau_hinh = Path(a.cau_hinh)
    ch = json.loads(duong_cau_hinh.read_text(encoding="utf-8"))
    khoa = Path(ch["khoa"]).expanduser()
    da_tai = ma_da_tai()
    loi, nghiep_vu = kiem_cau_hinh(ch, da_tai)
    if loi:
        raise SystemExit("CẤU HÌNH LỖI:\n  " + "\n  ".join(loi))

    ma = lay_access_token(khoa)
    kenh = goi(ma, "GET", "channels?part=id&mine=true")["items"][0]["id"]
    if kenh != ch["kenh"]:
        raise SystemExit("DỪNG: token thuộc kênh %s, không phải kênh %s" % (kenh, ch["kenh"]))
    tren_kenh = {}
    trang = ""
    while True:
        kq = goi(ma, "GET", "playlists?part=snippet,status&mine=true&maxResults=50" + trang)
        for p in kq.get("items", []):
            tren_kenh[p["id"]] = p
        if not kq.get("nextPageToken"):
            break
        trang = "&pageToken=" + kq["nextPageToken"]

    # Video của kênh này đã lên mà chưa nằm trong danh sách nghiệp vụ nào: chỉ báo.
    video_kenh = {d["ma"].upper() for d in doc_jsonl(SO_TRANG_THAI)
                  if d.get("trang_thai") in ("da_tai", "da_co") and "ngan_hang" in (d.get("lo") or "")}
    if "ngan_hang" in duong_cau_hinh.name:
        chua_xep = sorted(video_kenh - set(nghiep_vu), key=lambda m: int(m[1:]) if m[1:].isdigit() else 0)
        if chua_xep:
            print("NHẮC: video đã lên kênh nhưng chưa xếp danh sách nghiệp vụ: " + ", ".join(chua_xep))

    tong_don_vi, da_doi_cau_hinh = 0, False
    try:
        for ds in ch["danh_sach"]:
            if a.chi and ds["khoa"] not in a.chi:
                continue
            mong_muon = [da_tai[m.upper()] for m in ds["video"] if m.upper() in da_tai]
            chua_len = [m for m in ds["video"] if m.upper() not in da_tai]
            snippet = {"title": ds["tieu_de"], "description": ds["mo_ta"], "defaultLanguage": "vi"}
            pid = ds.get("playlistId")
            print("\n== %s · %s (%d video trên kênh%s)" % (ds["khoa"], ds["tieu_de"], len(mong_muon),
                                                         ", chờ lên kênh: " + " ".join(chua_len) if chua_len else ""))
            if pid and pid not in tren_kenh:
                raise SystemExit("DỪNG: playlistId %s của %s không còn trên kênh; xoá trường playlistId nếu muốn tạo lại" % (pid, ds["khoa"]))
            if not pid:
                trung = [p for p, v in tren_kenh.items() if v["snippet"]["title"] == ds["tieu_de"]]
                if trung:
                    raise SystemExit("DỪNG: kênh đã có danh sách tên \"%s\" (%s) mà cấu hình chưa ghi playlistId; ghi playlistId vào cấu hình rồi chạy lại" % (ds["tieu_de"], trung[0]))
                print("  tạo danh sách (%s)" % ds["hien_thi"])
                tong_don_vi += GIA["tao"]
                if not a.chay_that:
                    for i, v in enumerate(mong_muon):
                        print("  chèn %s vào vị trí %d" % (v, i))
                    tong_don_vi += GIA["chen"] * len(mong_muon)
                    continue
                kq = goi(ma, "POST", "playlists?part=snippet,status",
                         {"snippet": snippet, "status": {"privacyStatus": ds["hien_thi"]}})
                pid = ds["playlistId"] = kq["id"]
                da_doi_cau_hinh = True
                duong_cau_hinh.write_text(json.dumps(ch, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
                ghi_so({"viec": "tao", "khoa": ds["khoa"], "playlistId": pid, "tieu_de": ds["tieu_de"], "hien_thi": ds["hien_thi"]})
                print("  đã tạo https://www.youtube.com/playlist?list=%s" % pid)
                hien_co = []
            else:
                p = tren_kenh[pid]
                if (p["snippet"]["title"] != ds["tieu_de"] or p["snippet"].get("description", "") != ds["mo_ta"]
                        or p["status"]["privacyStatus"] != ds["hien_thi"]):
                    print("  sửa tên, mô tả, chế độ hiển thị (trên kênh: \"%s\", %s)" % (p["snippet"]["title"], p["status"]["privacyStatus"]))
                    tong_don_vi += GIA["sua"]
                    if a.chay_that:
                        try:
                            goi(ma, "PUT", "playlists?part=snippet,status",
                                {"id": pid, "snippet": snippet, "status": {"privacyStatus": ds["hien_thi"]}})
                        except RuntimeError as e:
                            # 02/11/2026: playlists.update báo 429 kéo dài với danh sách youtubeuploader vừa tạo;
                            # vẫn gắn video, lần chạy sau sửa lại tên, mô tả, chế độ hiển thị.
                            if "HTTP 429" not in str(e):
                                raise
                            print("  CHƯA SỬA ĐƯỢC (YouTube báo 429), vẫn gắn video; chạy lại script sau để sửa")
                        else:
                            ghi_so({"viec": "sua", "khoa": ds["khoa"], "playlistId": pid, "tieu_de_cu": p["snippet"]["title"],
                                    "mo_ta_cu": p["snippet"].get("description", ""),
                                    "hien_thi_cu": p["status"]["privacyStatus"]})
                hien_co = doc_muc(ma, pid)

            ngoai = [v for v, _ in hien_co if v not in mong_muon]
            if ngoai:
                print("  NHẮC: danh sách có video ngoài cấu hình (không gỡ): " + " ".join(ngoai))
            # Chèn video thiếu, theo thứ tự cấu hình; vị trí tính trên danh sách hiện tại.
            hien_co = [v for v, _ in hien_co]
            for i, v in enumerate(mong_muon):
                if v in hien_co:
                    continue
                vi_tri = min(i, len(hien_co))
                print("  chèn %s vào vị trí %d" % (v, vi_tri))
                tong_don_vi += GIA["chen"]
                hien_co.insert(vi_tri, v)
                if a.chay_that:
                    goi(ma, "POST", "playlistItems?part=snippet",
                        {"snippet": {"playlistId": pid, "position": vi_tri, "resourceId": {"kind": "youtube#video", "videoId": v}}})
                    ghi_so({"viec": "chen", "khoa": ds["khoa"], "playlistId": pid, "videoId": v, "vi_tri": vi_tri})
            # Sửa vị trí: đọc lại trên kênh rồi dời từng video đứng sai.
            muc = doc_muc(ma, pid) if a.chay_that else [(v, None) for v in hien_co]
            thu_tu = [v for v, _ in muc]
            ma_muc = dict(muc)
            for i, v in enumerate(mong_muon):
                if thu_tu.index(v) == i:
                    continue
                print("  dời %s về vị trí %d" % (v, i))
                tong_don_vi += GIA["doi_cho"]
                thu_tu.remove(v)
                thu_tu.insert(i, v)
                if a.chay_that:
                    goi(ma, "PUT", "playlistItems?part=snippet",
                        {"id": ma_muc[v], "snippet": {"playlistId": pid, "position": i,
                                                      "resourceId": {"kind": "youtube#video", "videoId": v}}})
                    ghi_so({"viec": "doi_cho", "khoa": ds["khoa"], "playlistId": pid, "videoId": v, "vi_tri": i})
    except HetHanMuc:
        print("\nHẾT HẠN MỨC (quotaExceeded): dừng. Chạy lại sau 15 giờ Việt Nam, script làm tiếp phần còn thiếu.")
        sys.exit(2)

    print("\n%s: khoảng %d đơn vị hạn mức cho lệnh ghi (chưa tính lệnh đọc, mỗi lệnh 1 đơn vị)."
          % ("Đã dùng" if a.chay_that else "Chạy thử, sẽ dùng", tong_don_vi))
    if da_doi_cau_hinh:
        print("Đã ghi playlistId vào %s" % duong_cau_hinh)
    if not a.chay_that:
        print("Chưa ghi gì. Thêm --chay-that để làm.")


if __name__ == "__main__":
    main()
