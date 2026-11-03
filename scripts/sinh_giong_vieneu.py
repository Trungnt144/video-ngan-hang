# sinh_giong_vieneu.py — sinh giọng đọc video dài bằng VieNeu-TTS v3 Turbo chạy trên máy (miễn phí, không cần khoá)
#
# Mỗi chương: tách trường "doc" thành câu, đọc từng câu, cho Whisper nghe lại và so với câu gốc. Câu sai quá
# ngưỡng ký tự thì đọc lại (tối đa so_lan_doc_toi_da lần), giữ bản sai ít nhất. Đọc xong mọi chương thì đo tốc độ
# nói trên toàn bộ câu vừa đọc và kéo giãn mọi câu về toc_do_dich_am_tiet_giay (scripts/toc_do_giong.py, từ
# 27/10/2026). Ghép các câu, chèn khoảng nghỉ.
#
# Dùng (chạy bằng Python của môi trường .venv_vieneu ở gốc project, cài theo 08_giong_am_thanh_phu_de.md mục 0):
#   .venv_vieneu/bin/python scripts/sinh_giong_vieneu.py \
#       --kich-ban san_pham/2026.10.25.Pin mặt trời hoạt động như thế nào mà không cần bộ phận quay?/tai_nguyen/kich_ban/2026.10.25.pin_mat_troi_3d_v1.chuong.json \
#       --ra xuong_dai/pin_mat_troi/public/giong_3d [--chuong 3,5] [--giong "Phạm Tuyên"]
# --giong nhận cả giọng có sẵn của VieNeu lẫn giọng riêng đã đăng ký bằng scripts/them_giong_vieneu.py.
#
# File kịch bản: mảng chương, mỗi chương có "id" và "doc" (lời đọc phiên âm). Xuất ra --ra, mỗi chương ba file:
#   c<id>.wav                   tiếng, 48 kHz một kênh
#   c<id>.moc_cau.json          mốc từng câu (bd, kt tính bằng giây) — canh3d/moc_cau.mjs đọc file này
#   c<id>.thongtin_vieneu.json  giọng, phiên bản gói, tỉ lệ sai ký tự và số lần đọc của từng câu
# và một file chung moc_tu.json: mốc từng từ cho phụ đề chạy chữ (thời gian từ Whisper, chữ từ trường "text"),
# cách ghép ở scripts/moc_tung_tu.py. Chương không có "text" hoặc số câu "text" khác "doc" thì không có mốc từ.
# Giọng và ngưỡng đặt ở khối "vieneu" của tai_san/cau_hinh_giong.json — đổi giọng thì sửa file đó, không sửa script.

import argparse
import json
import re
import sys
import time
import unicodedata
from importlib.metadata import version
from pathlib import Path

import jiwer
import mlx_whisper
import numpy as np
import soundfile as sf
import soxr
from vieneu import Vieneu

from moc_tung_tu import can_tu, ghi_moc_tu
from them_giong_vieneu import nap_giong_rieng
from toc_do_giong import do_toc_do, keo_gian, tim_ffmpeg

GOC = Path(__file__).resolve().parent.parent
SR = 48000  # tần số mẫu VieNeu v3 Turbo trả về

CHU_SO = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]


def so_thanh_chu(n):
    # Đọc số nguyên kiểu Việt: 21 hai mươi mốt, 105 một trăm linh năm. Đủ cho số Whisper viết ra trong lời đọc.
    if n < 10:
        return CHU_SO[n]
    if n < 100:
        chuc, dv = divmod(n, 10)
        dau = "mười" if chuc == 1 else CHU_SO[chuc] + " mươi"
        if dv == 0:
            return dau
        if dv == 5:
            return dau + " lăm"
        if dv == 1 and chuc > 1:
            return dau + " mốt"
        return dau + " " + CHU_SO[dv]
    if n < 1000:
        tram, du = divmod(n, 100)
        s = CHU_SO[tram] + " trăm"
        if du == 0:
            return s
        return s + (" linh " + CHU_SO[du] if du < 10 else " " + so_thanh_chu(du))
    for don_vi, ten in ((10**9, "tỷ"), (10**6, "triệu"), (1000, "nghìn")):
        if n >= don_vi:
            dau, du = divmod(n, don_vi)
            s = so_thanh_chu(dau) + " " + ten
            if du == 0:
                return s
            if du >= 100:
                return s + " " + so_thanh_chu(du)
            return s + " không trăm " + ("linh " + CHU_SO[du] if du < 10 else so_thanh_chu(du))
    return str(n)


def doi_so(s):
    # 1,12 thành "một phẩy mười hai"; 1.000 (dấu chấm phân nghìn) thành "một nghìn"
    s = re.sub(r"(?<=\d)\.(?=\d{3}\b)", "", s)
    s = re.sub(r"(\d+),(\d+)", lambda m: f"{m.group(1)} phẩy {m.group(2)}", s)
    return re.sub(r"\d+", lambda m: so_thanh_chu(int(m.group())), s)


def chuan(s, thay=()):
    s = unicodedata.normalize("NFC", s.lower())
    s = doi_so(s).replace("-", " ")
    s = re.sub(r"[^\w\s]", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    for mau, moi in thay:
        s = re.sub(mau, moi, s)
    return s


def tach_cau(doc):
    # Cắt tại . ? ! đứng trước khoảng trắng hoặc cuối chuỗi — cùng quy tắc với catCau trong canh3d/moc_cau.mjs
    return [c.strip() for c in re.split(r"(?<=[.?!])\s+", doc.strip()) if c.strip()]


def main():
    p = argparse.ArgumentParser(description="Sinh giọng đọc từng chương bằng VieNeu-TTS, có kiểm bằng Whisper")
    p.add_argument("--kich-ban", required=True, help="file .chuong.json (mảng chương có id, doc)")
    p.add_argument("--ra", required=True, help="thư mục ghi c<id>.wav, c<id>.moc_cau.json, c<id>.thongtin_vieneu.json")
    p.add_argument("--chuong", help="chỉ đọc các chương này, ví dụ 3,5")
    p.add_argument("--giong", help="đổi giọng cho riêng lần chạy này; mặc định lấy từ cau_hinh_giong.json")
    p.add_argument("--he-so-keo", type=float, help="ép hệ số kéo giãn thay vì đo (đọc lại vài chương cho khớp nhịp "
                   "các chương cũ: lấy he_so_keo trong c<id>.thongtin_vieneu.json của chương cũ); 1 là giữ tốc độ gốc")
    p.add_argument("--toc-do", type=float, help="tốc độ đích âm tiết mỗi giây cho riêng lần chạy này, thay "
                   "toc_do_dich_am_tiet_giay của cau_hinh_giong.json (kênh Chuyện làm dự án: 5,31, Trung chốt 02/11/2026)")
    a = p.parse_args()

    ch = json.loads((GOC / "tai_san" / "cau_hinh_giong.json").read_text(encoding="utf-8-sig"))["vieneu"]
    giong = a.giong or ch["giong"]
    thay = [tuple(x) for x in ch["chuan_hoa_nghe_lai"]]
    nghi = np.zeros(int(ch["khoang_nghi_cau_giay"] * SR), np.float32)
    ra = Path(a.ra)
    ra.mkdir(parents=True, exist_ok=True)

    chuong = json.loads(Path(a.kich_ban).read_text(encoding="utf-8-sig"))
    if a.chuong:
        chon = {int(x) for x in a.chuong.split(",")}
        chuong = [c for c in chuong if c["id"] in chon]

    def nghe(x):
        # word_timestamps: lấy luôn mốc từng từ của lần nghe này cho phụ đề chạy chữ
        r = mlx_whisper.transcribe(soxr.resample(x, SR, 16000), path_or_hf_repo=ch["mo_hinh_nghe_lai"], language="vi",
                                   word_timestamps=True)
        return r["text"].strip(), [w for s in r["segments"] for w in s.get("words", [])]

    t0 = time.time()
    tts = Vieneu()
    # giọng riêng (tai_san/giong_rieng/) truyền thẳng đặc trưng giọng; giọng có sẵn truyền tên
    giong_doc = nap_giong_rieng(giong) or giong
    print(f"Nạp mô hình {time.time() - t0:.1f} giây, giọng {giong}"
          f"{' (giọng riêng)' if isinstance(giong_doc, dict) else ''}", flush=True)
    phien_ban = {g: version(g) for g in ("vieneu", "onnxruntime", "mlx-whisper")}

    # Lượt 1: đọc và kiểm từng câu của mọi chương, chưa đổi tốc độ
    da_doc = []
    for c in chuong:
        cac = []
        for i, s in enumerate(tach_cau(c["doc"])):
            tot = None
            for lan in range(1, ch["so_lan_doc_toi_da"] + 1):
                x = np.asarray(tts.infer(s, voice=giong_doc), dtype=np.float32).flatten()
                h, tu = nghe(x)
                sai = jiwer.cer(chuan(s), chuan(h, thay))
                if tot is None or sai < tot[0]:
                    tot = (sai, x, h, lan, tu)
                if sai <= ch["nguong_sai_ky_tu"]:
                    break
            cac.append((s, lan, *tot))
            if tot[0] > ch["nguong_sai_ky_tu"]:
                print(f"  c{c['id']} câu {i + 1} vẫn sai {tot[0]:.0%} sau {lan} lần: {s}\n      Whisper nghe: {tot[2]}", flush=True)
        da_doc.append((c, cac))

    # Đo tốc độ trên mọi câu vừa đọc, kéo giãn về tốc độ đích (mục 0c của 08_giong_am_thanh_phu_de.md)
    toc_do_goc = do_toc_do([k[0] for _, cac in da_doc for k in cac], [k[3] for _, cac in da_doc for k in cac], chuan)
    dich = a.toc_do or ch.get("toc_do_dich_am_tiet_giay")
    he_so = a.he_so_keo or (dich / toc_do_goc if dich else 1.0)
    print(f"Tốc độ gốc {toc_do_goc:.2f} âm tiết/giây có tiếng, đích {dich}, kéo ×{he_so:.3f}", flush=True)
    ffmpeg = tim_ffmpeg() if abs(he_so - 1) >= 0.005 else None

    # Lượt 2: kéo giãn từng câu, ghép, ghi file
    for c, cac in da_doc:
        cau = [k[0] for k in cac]
        cau_text = tach_cau(c.get("text", ""))
        phan, moc, kiem, tu_chuong, vi_tri = [], [], [], [], 0.0
        for i, (s, lan, sai, x0, h, lan_tot, tu0) in enumerate(cac):
            x = keo_gian(x0, he_so, ffmpeg)
            # mốc từ Whisper đo trên bản chưa kéo; atempo co giãn đều nên nhân cùng tỉ lệ thời lượng
            co = len(x) / len(x0)
            tu = [{**w, "start": w["start"] * co, "end": w["end"] * co} for w in tu0]
            if i:
                phan.append(nghi)
                vi_tri += len(nghi) / SR
            moc.append({"cau": s, "bd": round(vi_tri, 3), "kt": round(vi_tri + len(x) / SR, 3)})
            if len(cau_text) == len(cau):
                tu_chuong.append({"cau": i, "tu": [{**t, "bd": round(vi_tri + t["bd"], 3), "kt": round(vi_tri + t["kt"], 3)}
                                                  for t in can_tu(tu, s, cau_text[i], len(x) / SR, thay)]})
            kiem.append({"cau": s, "whisper": h, "ty_le_sai": round(sai, 3), "so_lan_doc": lan, "lan_duoc_giu": lan_tot})
            phan.append(x)
            vi_tri += len(x) / SR

        y = np.concatenate(phan)
        sf.write(ra / f"c{c['id']}.wav", y, SR, subtype="PCM_16")
        (ra / f"c{c['id']}.moc_cau.json").write_text(json.dumps(
            {"doc": c["doc"], "giay": round(len(y) / SR, 3), "cau": moc}, ensure_ascii=False, indent=1), encoding="utf-8")
        (ra / f"c{c['id']}.thongtin_vieneu.json").write_text(json.dumps({
            "ten_file": f"c{c['id']}.wav",
            "giong": giong,
            "phien_ban_goi": phien_ban,
            "mo_hinh_nghe_lai": ch["mo_hinh_nghe_lai"],
            "nguong_sai_ky_tu": ch["nguong_sai_ky_tu"],
            "khoang_nghi_cau_giay": ch["khoang_nghi_cau_giay"],
            "toc_do_goc_am_tiet_giay": round(toc_do_goc, 2),
            "toc_do_dich_am_tiet_giay": dich,
            "he_so_keo": round(he_so, 4),
            "so_ky_tu": len(c["doc"]),
            "thoi_luong_giay": round(len(y) / SR, 3),
            "nguon_van_ban": str(Path(a.kich_ban).resolve()),
            "tung_cau": kiem,
        }, ensure_ascii=False, indent=1), encoding="utf-8")
        if tu_chuong:
            ghi_moc_tu(ra, c["id"], tu_chuong, str(Path(a.kich_ban).resolve()))
        else:
            print(f"  c{c['id']}: không có mốc từ (thiếu trường text hoặc số câu text khác doc)", flush=True)
        doc_lai = sum(k["so_lan_doc"] > 1 for k in kiem)
        print(f"Chương {c['id']}: {len(cau)} câu, {len(y) / SR:.1f} giây, {doc_lai} câu phải đọc lại", flush=True)
    print(f"Xong sau {time.time() - t0:.0f} giây")


if __name__ == "__main__":
    sys.exit(main())
