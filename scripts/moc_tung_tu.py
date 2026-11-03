# moc_tung_tu.py — mốc thời gian từng từ cho phụ đề chạy chữ của video dài (giọng VieNeu không tự trả mốc từ)
#
# Cách làm: Whisper nghe lại từng câu với word_timestamps (mốc từng từ), rồi ghép mốc đó vào chữ đúng chính tả
# của trường "text" trong kịch bản. Whisper nghe tiếng Việt có thể sai chữ ("giáp pin", "ELFP") nên chỉ lấy THỜI GIAN
# từ Whisper, chữ lấy từ kịch bản. Ghép hai lượt bằng difflib theo âm tiết đã chuẩn hoá:
#   lượt 1: âm tiết Whisper nghe  -> âm tiết lời đọc "doc" (phiên âm, gần với tiếng thật)
#   lượt 2: âm tiết lời đọc "doc" -> âm tiết phụ đề "text" (thuật ngữ, số viết đúng chính tả)
# Đoạn không khớp được (thuật ngữ phiên âm, số) chia thời gian theo độ dài chữ, kẹp giữa hai mốc khớp hai bên.
#
# Hai cách dùng:
#   1. sinh_giong_vieneu.py gọi can_tu() ngay khi đọc giọng mới, ghi luôn moc_tu.json.
#   2. Bổ sung cho giọng đã đọc từ trước (không đọc lại giọng), chạy bằng Python của .venv_vieneu:
#        .venv_vieneu/bin/python scripts/moc_tung_tu.py \
#            --kich-ban san_pham/2026.10.26.BESS là gì? Cấu tạo một trạm pin lưu trữ như thế nào?/tai_nguyen/kich_ban/2026.10.26.bess_v1.chuong.json --giong xuong_dai/bess/public/giong_goc [--chuong 3]
#      Cần c<id>.wav và c<id>.moc_cau.json trong thư mục giọng. Câu nào đã bị thay bằng file đọc riêng (ví dụ
#      THAY_CAU trong tao_thoi_gian.py của bess) thì mốc từ của câu đó không đúng, phải chạy riêng trên file thay.
#
# Ra: <thư mục giọng>/moc_tu.json, một file cho cả video:
#   {"chuong": {"3": [ {"cau": 0, "tu": [{"chu": "Sau", "bd": 0.08, "kt": 0.26}, ...]}, ... ]}}
#   bd, kt tính bằng giây trong file c<id>.wav đó (cùng thang với moc_cau.json, chưa chia tốc độ tăng tốc).

import argparse
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))

GOC = Path(__file__).resolve().parent.parent


def am_tiet(s, thay=()):
    # Một từ hoặc cả câu -> danh sách âm tiết đã chuẩn hoá (chữ thường, số đọc thành chữ, bỏ dấu câu)
    from sinh_giong_vieneu import chuan
    return chuan(s, thay).split()


def _chia(dai, bd, kt):
    # Chia khoảng [bd, kt] cho các phần tử theo độ dài chữ
    tong = sum(dai) or 1
    ra, t = [], bd
    for d in dai:
        u = t + (kt - bd) * d / tong
        ra.append((t, u))
        t = u
    return ra


def noi_moc(a, moc_a, b, bd0, kt0):
    # Gán mốc cho dãy âm tiết b dựa trên dãy a đã có mốc moc_a, qua đối chiếu difflib.
    # bd0, kt0: khung thời gian cả câu, dùng khi a rỗng hoặc đoạn chèn nằm ở hai đầu.
    if not a:
        return _chia([len(x) for x in b], bd0, kt0)
    ra = [None] * len(b)
    for op, i1, i2, j1, j2 in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes():
        if op == "equal":
            for k in range(j2 - j1):
                ra[j1 + k] = moc_a[i1 + k]
        elif op in ("replace", "insert"):
            if op == "replace":
                bd, kt = moc_a[i1][0], moc_a[i2 - 1][1]
            else:
                bd = moc_a[i1 - 1][1] if i1 > 0 else bd0
                kt = moc_a[i1][0] if i1 < len(a) else kt0
            ra[j1:j2] = _chia([len(x) for x in b[j1:j2]], bd, max(bd, kt))
    return ra


def can_tu(tu_whisper, cau_doc, cau_text, dai_cau, thay=()):
    # tu_whisper: [{"word", "start", "end"}] mốc tính từ đầu câu. cau_doc, cau_text: cùng một câu ở hai trường.
    # Trả [{"chu", "bd", "kt"}] cho từng từ hiển thị của cau_text (giữ dấu câu dính theo từ), mốc từ đầu câu.
    a, moc_a = [], []
    for w in tu_whisper:
        s = am_tiet(w["word"], thay)
        for x, m in zip(s, _chia([len(x) for x in s], float(w["start"]), float(w["end"]))):
            a.append(x)
            moc_a.append(m)
    d = am_tiet(cau_doc)
    moc_d = noi_moc(a, moc_a, d, 0.0, dai_cau)
    tu_hien = cau_text.split()
    nhom = [am_tiet(t) for t in tu_hien]
    t_syl = [x for g in nhom for x in g]
    moc_t = noi_moc(d, moc_d, t_syl, 0.0, dai_cau)
    ra, k, truoc = [], 0, 0.0
    for chu, g in zip(tu_hien, nhom):
        if g:
            bd, kt = moc_t[k][0], moc_t[k + len(g) - 1][1]
            k += len(g)
        else:  # từ chỉ có dấu câu (ví dụ "–") đi liền sau từ trước
            bd = kt = truoc
        bd = min(max(bd, truoc), dai_cau)  # giữ thứ tự tăng dần, không vượt khỏi câu
        kt = min(max(kt, bd), dai_cau)
        ra.append({"chu": chu, "bd": round(bd, 3), "kt": round(kt, 3)})
        truoc = bd
    return ra


def nghe_tu(x16k, mo_hinh):
    # Whisper nghe một câu (mảng 16 kHz), trả (văn bản, danh sách từ có mốc)
    import mlx_whisper
    r = mlx_whisper.transcribe(x16k, path_or_hf_repo=mo_hinh, language="vi", word_timestamps=True)
    tu = [w for s in r["segments"] for w in s.get("words", [])]
    return r["text"].strip(), tu


def ghi_moc_tu(thu_muc, id_chuong, cac_cau, nguon):
    # Gộp mốc từ của một chương vào <thu_muc>/moc_tu.json (giữ các chương khác)
    f = Path(thu_muc) / "moc_tu.json"
    d = json.loads(f.read_text(encoding="utf-8")) if f.exists() else {"chuong": {}}
    d["nguon_van_ban"] = nguon
    d["chuong"][str(id_chuong)] = cac_cau
    d["chuong"] = dict(sorted(d["chuong"].items(), key=lambda kv: int(kv[0])))
    f.write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")


def main():
    import soundfile as sf
    import soxr
    from sinh_giong_vieneu import tach_cau

    p = argparse.ArgumentParser(description="Bổ sung mốc từng từ cho giọng VieNeu đã đọc")
    p.add_argument("--kich-ban", required=True)
    p.add_argument("--giong", required=True, help="thư mục có c<id>.wav và c<id>.moc_cau.json")
    p.add_argument("--chuong", help="chỉ làm các chương này, ví dụ 3,5")
    a = p.parse_args()

    ch = json.loads((GOC / "tai_san" / "cau_hinh_giong.json").read_text(encoding="utf-8-sig"))["vieneu"]
    thay = [tuple(x) for x in ch["chuan_hoa_nghe_lai"]]
    chuong = json.loads(Path(a.kich_ban).read_text(encoding="utf-8-sig"))
    if a.chuong:
        chon = {int(x) for x in a.chuong.split(",")}
        chuong = [c for c in chuong if c["id"] in chon]
    for c in chuong:
        y, sr = sf.read(Path(a.giong) / f"c{c['id']}.wav", dtype="float32")
        moc = json.loads((Path(a.giong) / f"c{c['id']}.moc_cau.json").read_text(encoding="utf-8"))["cau"]
        cau_doc, cau_text = tach_cau(c["doc"]), tach_cau(c.get("text", ""))
        if not (len(moc) == len(cau_doc) == len(cau_text)):
            print(f"Chương {c['id']}: bỏ qua, số câu lệch (giọng {len(moc)}, doc {len(cau_doc)}, text {len(cau_text)})")
            continue
        ra = []
        for i, (m, sd, st) in enumerate(zip(moc, cau_doc, cau_text)):
            x = y[round(m["bd"] * sr):round(m["kt"] * sr)]
            _, tu = nghe_tu(soxr.resample(x, sr, 16000), ch["mo_hinh_nghe_lai"])
            dai = len(x) / sr
            ra.append({"cau": i, "tu": [{**t, "bd": round(m["bd"] + t["bd"], 3), "kt": round(m["bd"] + t["kt"], 3)}
                                        for t in can_tu(tu, sd, st, dai, thay)]})
        ghi_moc_tu(a.giong, c["id"], ra, str(Path(a.kich_ban).resolve()))
        print(f"Chương {c['id']}: {len(ra)} câu, {sum(len(r['tu']) for r in ra)} từ", flush=True)


if __name__ == "__main__":
    sys.exit(main())
