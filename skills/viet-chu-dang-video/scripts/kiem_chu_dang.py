#!/usr/bin/env python3
"""Kiểm file chữ đăng bằng máy: số ký tự, byte, đơn vị UTF-16, thẻ, hashtag, mốc chương, từ cấm, con số so với kịch bản.

Chạy từ gốc Media:
  python3 -I skills/viet-chu-dang-video/scripts/kiem_chu_dang.py <thư mục video | tai_nguyen/dang_bai | một file trong đó> [--tu-cam <file>]
Đọc mọi file nền tảng trong tai_nguyen/dang_bai/: youtube.md, shorts.md, tiktok.md, facebook.md.
Giới hạn đọc từ quy_dinh_nen_tang.md (khối ```json gioi_han). Mã thoát 1 khi có lỗi.
LỖI là vượt giới hạn của nền tảng hoặc quy ước bắt buộc của xưởng; NHẮC là chỗ nên xem lại.
"""
import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chung  # noqa: E402

# Tên và nhận diện MB, dấu vết tài liệu nội bộ (13_ban_quyen_va_bao_mat.md). So không phân biệt hoa thường.
TU_CAM = ["MB Bank", "MBBank", "Ngân hàng Quân đội", "Military Bank", "Military Commercial", "RM MB",
          "tờ trình", "nội bộ", "khách hàng của chúng tôi"]
FILE_TU_CAM_RIENG = chung.THU_MUC_SKILL / "tu_cam_rieng.txt"
KHOI_HOP_LE = {"youtube_dai", "youtube_shorts", "tiktok", "facebook"}
O_HOP_LE = {"youtube_dai": {"tieu_de", "mo_ta", "the"}, "youtube_shorts": {"tieu_de", "mo_ta"},
            "tiktok": {"chu_thich"}, "facebook": {"tieu_de", "chu_thich"}}
NEN_TANG = {"youtube_dai": "youtube", "youtube_shorts": "youtube", "tiktok": "tiktok", "facebook": "facebook"}
MAU_SO = re.compile(r"(?<![\w.,])\d+(?:[.,]\d+)*(?![\w])")


def chuan_so(s):
    return s.replace(".", "").replace(",", "")


def so_trong(chu):
    """Các con số (bỏ mốc chương) dạng chuẩn hoá: 36.000 và 36000 coi là một."""
    chu = "\n".join(d for d in chu.splitlines() if not chung.MAU_MOC.match(d.strip()))
    return {chuan_so(m.group(0)) for m in MAU_SO.finditer(chu)}


def kiem(duong_dan, them_tu_cam=None):
    quy_dinh = chung.doc_quy_dinh()
    ds = chung.doc_chu_dang(duong_dan)
    o, thong_tin, phuong_an, thu_muc = ds["o"], ds["thong_tin"], ds["phuong_an"], ds["thu_muc"]
    loi, nhac, bao_cao = [], [], []
    if not ds["files"]:
        loi.append("không có file nền tảng nào (%s) trong %s" % (", ".join(chung.FILE_CHO_KHOI), chung.tuong_doi(ds["dang_bai"])))

    def gioi_han(khoa, truong="toi_da"):
        return quy_dinh.get(khoa, {}).get(truong)

    # --- thông tin chung ---
    if ("youtube_dai", "tieu_de") in o and not thong_tin:
        loi.append("youtube.md thiếu khối `#### thong_tin · json`")
    for khoa in ("madeForKids", "containsSyntheticMedia"):
        if khoa in thong_tin and not isinstance(thong_tin[khoa], bool):
            loi.append("thong_tin.%s phải là true hoặc false (Trung duyệt)" % khoa)
    if thong_tin and "nhan_ai_facebook" in thong_tin and thong_tin.get("giong_may") and thong_tin["nhan_ai_facebook"] is not True:
        loi.append("video có giọng đọc máy nên nhan_ai_facebook phải là true (Trung chốt 27/10/2026)")
    for khoa, ngay in chung.muc_qua_han(quy_dinh):
        nhac.append("quy định %s đọc ngày %s, quá 90 ngày: chạy doi_chieu_quy_dinh.py" % (khoa, ngay))

    video = chung.tim_video(thu_muc) if thu_muc.is_dir() else {}
    thong_so = {loai: chung.do_mp4(p) for loai, p in video.items()}
    files_kb, chu_kb = chung.tim_kich_ban(thu_muc)
    so_kb = so_trong(chu_kb) if chu_kb else set()
    if not files_kb:
        nhac.append("không thấy tai_nguyen/kich_ban/ nên không đối chiếu được con số")
    for khoi in sorted({k for k, _ in o}):
        nen, p = chung.video_cho_khoi(video, khoi)
        if not p:
            nhac.append("%s: chưa có video `_%s_v<n>` ngoài cùng thư mục" % (chung.KHOI_CHO_FILE.get(khoi, khoi), chung.VIDEO_CHO_KHOI.get(khoi, ["?"])[0]))
        elif khoi != "youtube_dai" and thong_so[nen]["kho"] != "doc":
            nhac.append("%s: video %s không phải khổ dọc (%dx%d)" % (chung.KHOI_CHO_FILE[khoi], p.name, thong_so[nen]["rong"], thong_so[nen]["cao"]))
        if khoi == "youtube_shorts" and p and thong_so[nen]["giay"] > gioi_han("youtube.shorts_thoi_luong"):
            loi.append("shorts.md: video %s dài %.0f giây, quá 3 phút nên không thành Shorts" % (p.name, thong_so[nen]["giay"]))
    tu_khoa = chung.nfc(thong_tin.get("tu_khoa_chinh", "")).lower()
    # Kênh quyết định chân mô tả và bộ quy tắc: kênh Ngân hàng theo quy_tac_kenh_ngan_hang.md (Trung chốt 30/10/2026)
    kenh = chung.kenh_video(thong_tin, thu_muc)
    nh = kenh == "ngan_hang"
    chan = chung.chan_mo_ta(kenh)
    if not chan:
        loi.append("chan_mo_ta.md chưa có khối chân mô tả của kênh \"%s\"" % kenh)
    chuong_video, _ = chung.tim_chuong(thu_muc) if nh else ([], "")

    tu_cam = list(TU_CAM)
    for f in [FILE_TU_CAM_RIENG] + ([Path(them_tu_cam)] if them_tu_cam else []):
        if f.exists():
            tu_cam += [d.strip() for d in f.read_text(encoding="utf-8").splitlines() if d.strip() and not d.startswith("#")]
    tu_cam = list(dict.fromkeys(chung.nfc(t).lower() for t in tu_cam))

    for (khoi, ten), chu in o.items():
        nhan = "%s · %s" % (khoi, ten)
        if khoi not in KHOI_HOP_LE or ten not in O_HOP_LE.get(khoi, set()):
            loi.append("%s: ô không thuộc mẫu (khối hợp lệ: %s)" % (nhan, ", ".join(sorted(KHOI_HOP_LE))))
            continue
        if ds["nguon"][(khoi, ten)] != chung.KHOI_CHO_FILE[khoi]:
            loi.append("%s nằm trong %s, phải nằm trong %s" % (nhan, ds["nguon"][(khoi, ten)], chung.KHOI_CHO_FILE[khoi]))
        nen = NEN_TANG[khoi]
        kt, b8, b16 = len(chu), len(chu.encode("utf-8")), chung.utf16(chu)
        ht = chung.hashtag(chu)
        dong = "%-26s %5d ký tự · %5d byte · %5d UTF-16 · %d hashtag" % (nhan, kt, b8, b16, len(ht))

        if not chu.strip():
            loi.append("%s: ô trống" % nhan)
        if nen == "youtube" and ten == "tieu_de" and kt > gioi_han("youtube.tieu_de"):
            loi.append("%s: %d ký tự, YouTube tối đa %d" % (nhan, kt, gioi_han("youtube.tieu_de")))
        if nen == "youtube" and ten == "mo_ta":
            if kt > gioi_han("youtube.mo_ta"):
                loi.append("%s: %d ký tự, YouTube tối đa %d" % (nhan, kt, gioi_han("youtube.mo_ta")))
            if b8 > gioi_han("youtube.mo_ta_api"):
                loi.append("%s: %d byte UTF-8, đăng qua API (dang-youtube) tối đa %d byte" % (nhan, b8, gioi_han("youtube.mo_ta_api")))
        if nen == "youtube" and ten in ("tieu_de", "mo_ta") and re.search(r"[<>]", chu):
            loi.append("%s: có ký tự < hoặc >, YouTube không nhận" % nhan)
        if khoi == "tiktok" and b16 > gioi_han("tiktok.chu_thich"):
            loi.append("%s: %d đơn vị UTF-16, TikTok tối đa %d" % (nhan, b16, gioi_han("tiktok.chu_thich")))

        if ten == "the":
            the = chung.tach_the(chu)
            dai = chung.do_dai_the_api(the)
            dong = "%-26s %5d thẻ · %d/%d ký tự tính theo API" % (nhan, len(the), dai, gioi_han("youtube.the"))
            if dai > gioi_han("youtube.the"):
                loi.append("%s: %d ký tự tính theo API, tối đa %d" % (nhan, dai, gioi_han("youtube.the")))
            if len({t.lower() for t in the}) < len(the):
                nhac.append("%s: có thẻ lặp" % nhan)
            if any(re.search(r"[<>#]", t) for t in the):
                loi.append("%s: thẻ có ký tự < > hoặc #" % nhan)

        if ht:
            sai = [h for h in ht if not re.fullmatch(r"[a-z0-9_]+", h)]
            if sai:
                loi.append("%s: hashtag phải không dấu, chữ thường, không ký tự đặc biệt: %s" % (nhan, " ".join("#" + h for h in sai)))
            if len({h.lower() for h in ht}) < len(ht):
                loi.append("%s: hashtag lặp" % nhan)
            toi_da = gioi_han(nen + ".hashtag")
            quy_uoc = gioi_han(nen + ".hashtag", "quy_uoc")
            if ten != "the" and toi_da and len(ht) > toi_da:
                loi.append("%s: %d hashtag, quá %d thì YouTube bỏ qua toàn bộ" % (nhan, len(ht), toi_da))
            elif ten != "the" and quy_uoc and len(ht) > quy_uoc:
                loi.append("%s: %d hashtag, quy ước xưởng tối đa %d" % (nhan, len(ht), quy_uoc))
            if ten == "tieu_de":
                nhac.append("%s: tiêu đề có hashtag; xưởng đặt hashtag ở dòng cuối mô tả" % nhan)
        elif ten in ("mo_ta", "chu_thich"):
            nhac.append("%s: chưa có hashtag nào" % nhan)

        if khoi == "facebook" and re.search(r"https?://|www\.", chu.replace(chan, "") if chan else chu):  # link trong chân mô tả kênh được phép (29/10/2026)
            loi.append("%s: chú thích Facebook có liên kết ngoài chân mô tả kênh (quy ước xưởng)" % nhan)
        hoa = sum(1 for c in chu if c.isupper())
        chu_cai = sum(1 for c in chu if c.isalpha())
        if chu_cai and hoa / chu_cai > 0.3:
            nhac.append("%s: chữ hoa chiếm %d%%" % (nhan, 100 * hoa // chu_cai))

        thap = chu.lower()
        for t in tu_cam:
            if t in thap:
                loi.append("%s: có từ cấm \"%s\"" % (nhan, t))

        if so_kb and ten != "the":
            la = sorted(so_trong(chu.replace(chan, "") if chan else chu) - so_kb, key=lambda s: (len(s), s))  # số trong link chân mô tả không tính
            if la:
                nhac.append("%s: con số không thấy trong kịch bản: %s" % (nhan, ", ".join(la)))

        if ten == "tieu_de" and tu_khoa and tu_khoa not in chu.lower():
            nhac.append("%s: tiêu đề không chứa từ khoá chính \"%s\"" % (nhan, tu_khoa))
        if ten in ("mo_ta", "chu_thich") and tu_khoa and tu_khoa not in chu.lower()[:200]:
            nhac.append("%s: 200 ký tự đầu không chứa từ khoá chính" % nhan)

        if khoi == "youtube_dai" and ten == "mo_ta":
            # Rule Trung chốt 29/10/2026: mô tả là MỘT đoạn văn 50–70 từ kể ngắn nội dung video, rồi dòng hashtag.
            # Không nêu văn bản pháp lý, không mốc chương, không đoạn giới hạn con số; link chỉ nằm trong chân mô tả kênh.
            if chan and not chu.strip().endswith(chan):
                loi.append("%s: thiếu chân mô tả kênh ở cuối (chan_mo_ta.md)" % nhan)
            phan_doan = chu.strip()[:-len(chan)] if chan and chu.strip().endswith(chan) else chu
            than = [d for d in phan_doan.strip().splitlines() if not re.fullmatch(r"\s*(#\S+\s*)+", d)]
            if nh:  # kênh Ngân hàng: mốc chương, khối "Xem tiếp:" và dòng "Xem cả loạt:" (link cùng kênh) nằm ngoài đoạn văn
                xem_tiep = re.search(r"^Xem (?:tiếp|cả loạt):.*", "\n".join(than), re.M | re.S)
                than = "\n".join(than)[:xem_tiep.start()].splitlines() if xem_tiep else than
                than = [d for d in than if not chung.MAU_MOC.match(d.strip())]
            doan = [p for p in re.split(r"\n\s*\n", "\n".join(than).strip()) if p.strip()]
            so_tu = len(" ".join(than).split())
            tu_min, tu_max = gioi_han("youtube.mo_ta_so_tu", "toi_thieu"), gioi_han("youtube.mo_ta_so_tu")
            dong += " · %d đoạn · %d từ" % (len(doan), so_tu)
            if len(doan) != 1:
                loi.append("%s: có %d đoạn, rule xưởng là một đoạn văn rồi dòng hashtag" % (nhan, len(doan)))
            if not tu_min <= so_tu <= tu_max:
                loi.append("%s: đoạn văn %d từ, rule xưởng %d–%d từ" % (nhan, so_tu, tu_min, tu_max))
            moc = chung.moc_chuong(chu)
            if moc and not nh:
                loi.append("%s: có mốc chương, rule xưởng bỏ mốc chương khỏi mô tả" % nhan)
            if nh:
                if not 5 <= len(moc) <= 8:
                    loi.append("%s: %d mốc chương, kênh Ngân hàng gộp còn 5–8 mốc" % (nhan, len(moc)))
                if moc and (moc[0][0] != 0 or any(b[0] - a[0] < 10 for a, b in zip(moc, moc[1:]))):
                    loi.append("%s: mốc chương phải bắt đầu 00:00, tăng dần, mỗi chương từ 10 giây" % nhan)
                bat_dau = [g for g, _ in chuong_video]
                lech = [d for g, d in moc if bat_dau and min(abs(g - b) for b in bat_dau) > 1]
                if lech:
                    nhac.append("%s: mốc không trùng đầu chương nào trong thoi_gian.json: %s" % (nhan, "; ".join(lech)))
                if not chuong_video:
                    nhac.append("%s: không đọc được mốc chương của video để đối chiếu" % nhan)
                if ht[-2:] != ["nganhang", "chuyennghenganhang"]:
                    loi.append("%s: hashtag kênh Ngân hàng phải kết thúc bằng #nganhang #chuyennghenganhang" % nhan)
                if re.search(r"https?://", phan_doan.replace(chan, "")) and not re.search(r"^Xem (?:tiếp|cả loạt):", chu, re.M):
                    loi.append("%s: có liên kết ngoài chân mô tả, khối \"Xem tiếp:\" và dòng \"Xem cả loạt:\"" % nhan)
                _, nghiep_vu = chung.danh_sach_phat(thong_tin.get("ma_youtube"), kenh)
                if nghiep_vu and nghiep_vu.get("playlistId") and nghiep_vu["playlistId"] not in chu:
                    nhac.append("%s: chưa có dòng \"Xem cả loạt:\" trỏ danh sách \"%s\" (chạy them_xem_ca_loat.py)" % (nhan, nghiep_vu["tieu_de"]))
            # kênh Ngân hàng: chữ "quyết định" là động từ thường gặp (quyết định cho vay), chỉ bắt "quyết định số"
            mau_pl = r"nghị định|thông tư|quyết định số|luật|NĐ-CP|QĐ-TTg|TT-NHNN" if nh else r"nghị định|thông tư|quyết định|luật|NĐ-CP|QĐ-TTg"
            phap_ly = re.findall(mau_pl, chu, re.I)
            if phap_ly:
                loi.append("%s: nhắc văn bản pháp lý (%s), rule xưởng không nêu trong mô tả" % (nhan, ", ".join(sorted(set(p.lower() for p in phap_ly)))))
        if nh and ten == "tieu_de":
            if kt > 70:
                nhac.append("%s: %d ký tự, kênh Ngân hàng nên ≤ 70 (tên Trung tự đặt thì giữ)" % (nhan, kt))
            if re.search(r"!!|\?\?|\.\.\.|…", chu):
                nhac.append("%s: có \"!!\", \"??\" hoặc \"...\" (quy tắc kênh Ngân hàng; tên Trung tự đặt thì giữ)" % nhan)
            yt = o.get(("youtube_dai", "tieu_de"))
            if khoi != "youtube_dai" and yt and chu.strip() != yt.strip():
                nhac.append("%s: khác tiêu đề YouTube; kênh Ngân hàng dùng cùng một tiêu đề" % nhan)
        if nh and khoi in ("facebook", "tiktok") and ten == "chu_thich":
            phan = chu.replace(chan, "") if chan else chu
            cau = [c for c in re.split(r"(?<=[.?!])\s+", " ".join(d for d in phan.splitlines() if d.strip() and not d.strip().startswith("#"))) if c.strip()]
            if len(cau) > 3:
                nhac.append("%s: %d câu, kênh Ngân hàng viết 1–3 câu" % (nhan, len(cau)))
            if "chuyennghenganhang" not in ht:
                loi.append("%s: thiếu #chuyennghenganhang" % nhan)
            if chung.moc_chuong(chu):
                loi.append("%s: chú thích không có mốc chương" % nhan)
        bao_cao.append(dong)

    if nh and "youtube_dai" in {k for k, _ in o} and not phuong_an:
        nhac.append("youtube.md: chưa có mục \"Phương án tiêu đề dự phòng\" (kênh Ngân hàng: một tiêu đề chính và một dự phòng)")
    elif not nh and "youtube_dai" in {k for k, _ in o} and len(phuong_an) != 3:
        nhac.append("youtube.md: mục \"Ba phương án tiêu đề\" có %d phương án, cần 3 để Trung chọn" % len(phuong_an))
    return {"thu_muc": chung.tuong_doi(thu_muc), "kenh": kenh, "video": thong_so, "files": [f.name for f in ds["files"]], "bao_cao": bao_cao, "loi": loi, "nhac": nhac,
            "kich_ban": [chung.tuong_doi(p) for p in files_kb]}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("duong_dan")
    ap.add_argument("--tu-cam", help="file từ cấm thêm, mỗi dòng một từ")
    a = ap.parse_args()
    kq = kiem(a.duong_dan, a.tu_cam)
    print("Thư mục video:", kq["thu_muc"], "· kênh", kq["kenh"])
    for loai, v in kq["video"].items():
        print("Video %s: %dx%d, %.1f giây" % (loai, v["rong"], v["cao"], v["giay"]))
    print("File chữ đăng:", ", ".join(kq["files"]) or "(không có)")
    print("Đối chiếu con số với %d file kịch bản\n" % len(kq["kich_ban"]))
    for d in kq["bao_cao"]:
        print(d)
    print()
    for x in kq["loi"]:
        print("LỖI ", x)
    for x in kq["nhac"]:
        print("NHẮC", x)
    print("\nTổng: %d lỗi, %d nhắc" % (len(kq["loi"]), len(kq["nhac"])))
    sys.exit(1 if kq["loi"] else 0)


if __name__ == "__main__":
    main()
