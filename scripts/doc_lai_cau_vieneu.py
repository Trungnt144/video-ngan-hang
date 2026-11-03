# doc_lai_cau_vieneu.py — đọc lại riêng vài câu của một chương đã sinh bằng sinh_giong_vieneu.py, ghép vào chỗ cũ
#
# sinh_giong_vieneu.py chỉ đọc lại câu sai quá ngưỡng ký tự (10%), nên câu sai một dấu thanh vẫn lọt. Script này
# đọc lại câu được chỉ định tối đa --so-lan lần, cho Whisper nghe lại, đếm từ sai dấu (cùng chữ gốc, khác dấu),
# giữ lần đọc ít lỗi dấu nhất (hoà thì lấy lần sai ít ký tự hơn), rồi thay đúng đoạn câu đó trong c<id>.wav,
# dời mốc các câu sau trong c<id>.moc_cau.json và ghi kết quả vào c<id>.thongtin_vieneu.json.
#
# Dùng (cùng môi trường .venv_vieneu với sinh_giong_vieneu.py):
#   .venv_vieneu/bin/python scripts/doc_lai_cau_vieneu.py --ra xuong_dai/pin_mat_troi/public/giong_3d \
#       --chuong 3 --cau 3,4,5 [--so-lan 6]
# Số câu tính từ 1, theo cách cắt câu của trường "doc" (cùng quy tắc tach_cau). Chạy lại canh3d/moc_cau.mjs sau đó.

import argparse
import json
import sys
import unicodedata
from pathlib import Path

import jiwer
import mlx_whisper
import numpy as np
import soundfile as sf
import soxr
from vieneu import Vieneu

from sinh_giong_vieneu import GOC, SR, chuan, tach_cau
from toc_do_giong import keo_gian


def goc_chu(w):
    return unicodedata.normalize("NFD", w.replace("đ", "d")).encode("ascii", "ignore").decode()


def loi_dau(goc, nghe):
    # Từ cùng vị trí, cùng chữ gốc nhưng khác dấu thanh hoặc dấu chữ
    import difflib
    a, b = goc.split(), nghe.split()
    sm = difflib.SequenceMatcher(a=[goc_chu(x) for x in a], b=[goc_chu(x) for x in b], autojunk=False)
    out = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            out += [f"{a[i]}→{b[j]}" for i, j in zip(range(i1, i2), range(j1, j2)) if a[i] != b[j]]
    return out


def main():
    p = argparse.ArgumentParser(description="Đọc lại riêng vài câu bằng VieNeu, chọn lần không sai dấu, ghép vào chương")
    p.add_argument("--ra", required=True, help="thư mục có c<id>.wav, c<id>.moc_cau.json, c<id>.thongtin_vieneu.json")
    p.add_argument("--chuong", required=True, type=int)
    p.add_argument("--cau", required=True, help="số câu cần đọc lại, tính từ 1, ví dụ 3,4,5")
    p.add_argument("--so-lan", type=int, default=6, help="số lần đọc tối đa mỗi câu")
    a = p.parse_args()

    ch = json.loads((GOC / "tai_san" / "cau_hinh_giong.json").read_text(encoding="utf-8-sig"))["vieneu"]
    thay = [tuple(x) for x in ch["chuan_hoa_nghe_lai"]]
    ra = Path(a.ra)
    f_wav, f_moc, f_tt = (ra / f"c{a.chuong}{d}" for d in (".wav", ".moc_cau.json", ".thongtin_vieneu.json"))
    y, sr = sf.read(f_wav, dtype="float32")
    assert sr == SR, f"{f_wav} có tần số {sr}, cần {SR}"
    moc = json.loads(f_moc.read_text(encoding="utf-8"))
    tt = json.loads(f_tt.read_text(encoding="utf-8"))
    cau = tach_cau(moc["doc"])
    assert [m["cau"] for m in moc["cau"]] == cau, "mốc câu không khớp cách cắt câu của trường doc"
    giong = tt["giong"]

    tts = Vieneu()

    def nghe(x):
        r = mlx_whisper.transcribe(soxr.resample(x, SR, 16000), path_or_hf_repo=ch["mo_hinh_nghe_lai"], language="vi")
        return r["text"].strip()

    # Thay từ câu cuối lên đầu để vị trí các câu phía trước không đổi khi đang ghép
    for so in sorted({int(x) for x in a.cau.split(",")}, reverse=True):
        i = so - 1
        s = cau[i]
        tot = None
        for lan in range(1, a.so_lan + 1):
            x = np.asarray(tts.infer(s, voice=giong), dtype=np.float32).flatten()
            h = nghe(x)
            g, n = chuan(s), chuan(h, thay)
            ld, sai = loi_dau(g, n), jiwer.cer(g, n)
            print(f"  c{a.chuong} câu {so} lần {lan}: {len(ld)} lỗi dấu {ld}, sai {sai:.0%} — {h}", flush=True)
            if tot is None or (len(ld), sai) < (len(tot[0]), tot[1]):
                tot = (ld, sai, x, h, lan)
            if not ld and sai <= ch["nguong_sai_ky_tu"]:
                break
        ld, sai, x, h, lan_tot = tot
        # chương sinh từ 27/10/2026 đã kéo giãn tốc độ: câu đọc lại phải kéo cùng hệ số để khớp nhịp
        x = keo_gian(x, tt.get("he_so_keo", 1.0))
        bd, kt = int(round(moc["cau"][i]["bd"] * SR)), int(round(moc["cau"][i]["kt"] * SR))
        lech = (len(x) - (kt - bd)) / SR
        y = np.concatenate([y[:bd], x, y[kt:]])
        moc["cau"][i]["kt"] = round(moc["cau"][i]["bd"] + len(x) / SR, 3)
        for m in moc["cau"][i + 1:]:
            m["bd"], m["kt"] = round(m["bd"] + lech, 3), round(m["kt"] + lech, 3)
        tt["tung_cau"][i] = {"cau": s, "whisper": h, "ty_le_sai": round(sai, 3), "loi_dau": ld,
                             "so_lan_doc": lan, "lan_duoc_giu": lan_tot, "doc_lai_rieng": True}
        print(f"c{a.chuong} câu {so}: giữ lần {lan_tot}, {len(ld)} lỗi dấu, dài thêm {lech:+.2f} giây", flush=True)

    moc["giay"] = round(len(y) / SR, 3)
    tt["thoi_luong_giay"] = moc["giay"]
    sf.write(f_wav, y, SR, subtype="PCM_16")
    f_moc.write_text(json.dumps(moc, ensure_ascii=False, indent=1), encoding="utf-8")
    f_tt.write_text(json.dumps(tt, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Chương {a.chuong}: {moc['giay']:.1f} giây")


if __name__ == "__main__":
    sys.exit(main())
