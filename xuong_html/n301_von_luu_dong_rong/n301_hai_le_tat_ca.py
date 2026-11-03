# N199 đợt B: nghe lại MỌI câu có chữ dễ sai (vay, lãi, dư nợ, kỳ hạn, trái phiếu, tái cấp vốn, ủy thác…) ở hai lề cắt 0,05 và 0,4 giây (kinh nghiệm cặp 1).
# In câu nào Whisper đếm thiếu chữ cần có ở một trong hai lề. Dùng (gốc Media/): .venv_vieneu/bin/python xuong_html/n199_hoat_dong_huy_dong_von/n199_hai_le_tat_ca.py [chương ...]
import sys, json, re, soundfile as sf, soxr, mlx_whisper
from pathlib import Path
G = Path(__file__).resolve().parent / "am_thanh"
CHU = ["vay", "lãi", "dư nợ", "kỳ hạn", "huy động", "trái phiếu", "liên ngân hàng", "tái cấp vốn", "ủy thác", "dự trữ", "bảo hiểm", "cấp hai", "chứng chỉ", "cổ đông", "thanh toán"]
chon = [int(x) for x in sys.argv[1:]] or list(range(1, 12))
tong = loi = 0
for c in chon:
    moc = json.loads((G / f"c{c}.moc_cau.json").read_text())["cau"]
    x, sr = sf.read(str(G / f"c{c}.wav"))
    if x.ndim > 1: x = x.mean(1)
    for i, m in enumerate(moc, 1):
        s = m["cau"].lower()
        can = {w: len(re.findall(r"(?<!\w)" + w + r"(?!\w)", s)) for w in CHU}
        can = {w: n for w, n in can.items() if n}
        if not can: continue
        tong += 1
        for le in (0.05, 0.4):
            seg = x[int(max(0, m["bd"] - le) * sr): int((m["kt"] + le) * sr)]
            h = mlx_whisper.transcribe(soxr.resample(seg, sr, 16000).astype("float32"), path_or_hf_repo="mlx-community/whisper-large-v3-turbo", language="vi")["text"].strip()
            hl = h.lower().replace("anh a,", "anh a ").replace("anh a.", "anh a ")
            thieu = {w: (n, len(re.findall(r"(?<!\w)" + w + r"(?!\w)", hl))) for w, n in can.items() if len(re.findall(r"(?<!\w)" + w + r"(?!\w)", hl)) < n}
            if thieu:
                loi += 1
                print(f"c{c} câu {i} lề {le}: thiếu {thieu} — {h}", flush=True)
print(f"đã nghe {tong} câu ở hai lề; {loi} lượt thiếu")
