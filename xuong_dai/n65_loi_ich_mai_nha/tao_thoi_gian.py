# Video "Lợi ích của điện mặt trời mái nhà" (n65, khung chép từ dien_mat_troi_mai_nha). Giọng VieNeu (public/giong_goc/c*.wav) đã được sinh_giong_vieneu.py kéo về 5,06 âm tiết/giây (mặc định từ 30/10/2026), nên TOC_DO = 1.0: không tăng tốc thêm.
# Ghi public/giong/c*.wav, rồi sinh src/thoi_gian.json: độ dài từng cảnh, mốc từng câu và mốc từng từ (phụ đề chạy chữ, module 10 mục 19).
# Gộp hai cách đã có: tốc độ và khoảng lặng riêng từng cảnh của video tăng áp, mốc từng từ của video BESS.
# Chạy lại sau mỗi lần đọc lại giọng hoặc đổi tốc độ:  python3 -I tao_thoi_gian.py
import json
import math
import os
import re
import subprocess
import wave
from pathlib import Path

GOC = Path(__file__).resolve().parent
KICH_BAN = GOC.parent.parent / "san_pham" / "2026.11.01.loi_ich_dien_mat_troi_mai_nha" / "tai_nguyen" / "kich_ban" / "2026.11.01.loi_ich_dien_mat_troi_mai_nha_v1.chuong.json"
FF = GOC / "node_modules" / "@remotion" / "compositor-darwin-arm64"
TOC_DO = 1.0  # giọng đã kéo về 5,06 âm tiết/giây khi sinh (hệ số he_so_keo trong c*.thongtin_vieneu.json); 1.0 = không tăng thêm
FPS, DAU, CUOI = 30, 10, 15
DAU_CANH = {1: 6}  # chương 1: câu hỏi mở đầu vào gần như ngay (câu mở 3 giây)
CUOI_CANH = {11: 60, 4: 20, 9: 20}  # cảnh cuối giữ câu cần nhớ
# Nghỉ thêm sau câu có số (cách của video tăng áp, Trung chốt 26/10/2026). Cảnh 1: nửa nhịp lặng sau khi đọc trần con số (KB-01)
TOC_CANH = {}
NGHI_CANH = {3, 4, 8, 9}  # cảnh hoá đơn, khí thải, giới hạn: nghỉ thêm sau câu có con số để thanh và cột kịp chạy
NGHI = 0.45
CO_CONG_THUC = re.compile(r"\d|nhân|chia")


def cat_cau(s):
    return [c.strip() for c in re.split(r"(?<=[.!?])\s+", s.strip()) if c.strip()]


def do_dai(f):
    r = subprocess.run([str(FF / "ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                       capture_output=True, text=True, env={**os.environ, "DYLD_LIBRARY_PATH": str(FF)}, check=True)
    return float(r.stdout)


(GOC / "public" / "giong").mkdir(exist_ok=True)
chuong = json.loads(KICH_BAN.read_text(encoding="utf-8"))
f_tu = GOC / "public" / "giong_goc" / "moc_tu.json"
MOC_TU = json.loads(f_tu.read_text(encoding="utf-8"))["chuong"] if f_tu.exists() else {}
ra, bat_dau = [], 0
for c in chuong:
    vao = GOC / "public" / "giong_goc" / f"c{c['id']}.wav"
    ra_wav = GOC / "public" / "giong" / f"c{c['id']}.wav"
    toc = TOC_CANH.get(c["id"], TOC_DO)
    subprocess.run([str(FF / "ffmpeg"), "-v", "error", "-y", "-i", str(vao), "-af", f"atempo={toc}", str(ra_wav)],
                   env={**os.environ, "DYLD_LIBRARY_PATH": str(FF)}, check=True)
    moc = json.loads((GOC / "public" / "giong_goc" / f"c{c['id']}.moc_cau.json").read_text(encoding="utf-8"))["cau"]
    cau_chu = cat_cau(c["text"])
    assert len(moc) == len(cau_chu), f"cảnh {c['id']}: giọng {len(moc)} câu, phụ đề {len(cau_chu)} câu"
    bd = [m["bd"] / toc for m in moc]
    kt = [m["kt"] / toc for m in moc]
    them = [0.0] * len(moc)  # giây lặng cộng dồn trước câu i
    if c["id"] in NGHI_CANH:
        nghi = [NGHI if i < len(moc) - 1 and CO_CONG_THUC.search(cau_chu[i]) else 0 for i in range(len(moc))]
        with wave.open(str(ra_wav)) as w:
            tham, sr = w.getparams(), w.getframerate()
            du_lieu = w.readframes(w.getnframes())
        khung_mau = tham.sampwidth * tham.nchannels
        moi, truoc = b"", 0
        for i, p_ in enumerate(nghi):
            if p_ <= 0:
                continue
            cat = round((kt[i] + bd[i + 1]) / 2 * sr)
            moi += du_lieu[truoc * khung_mau: cat * khung_mau] + b"\x00" * (round(p_ * sr) * khung_mau)
            truoc = cat
        moi += du_lieu[truoc * khung_mau:]
        with wave.open(str(ra_wav), "wb") as w:
            w.setparams(tham)
            w.writeframes(moi)
        cong = 0.0
        for i in range(len(moc)):
            them[i] = cong
            cong += nghi[i]
    dau = DAU_CANH.get(c["id"], DAU)
    cau = []
    for i, (t, b_, k_) in enumerate(zip(cau_chu, bd, kt)):
        tu, den = round((b_ + them[i]) * FPS), round((k_ + them[i]) * FPS)
        cau.append({"f": dau + tu, "het": dau + den, "chu": t, "f_tieng": dau + tu, "tu": tu, "den": den})
    for x in MOC_TU.get(str(c["id"]), []):
        i = x["cau"]
        cau[i]["tu_moc"] = [{"chu": w["chu"], "f": dau + round((w["bd"] / toc + them[i]) * FPS), "het": dau + round((w["kt"] / toc + them[i]) * FPS)}
                            for w in x["tu"]]
    giay = do_dai(ra_wav)
    dai = dau + math.ceil(giay * FPS) + CUOI + CUOI_CANH.get(c["id"], 0)
    ra.append({"id": c["id"], "ten": c["ten"], "to": c.get("to", "bang"), "bat_dau": bat_dau, "dai": dai, "cau": cau})
    bat_dau += dai

(GOC / "src" / "thoi_gian.json").write_text(json.dumps({"fps": FPS, "tong": bat_dau, "toc_do": TOC_DO, "toc_canh": TOC_CANH, "chuong": ra}, ensure_ascii=False, indent=1), encoding="utf-8")
print(f"tổng {bat_dau} khung = {bat_dau / FPS:.1f} giây")
for c in ra:
    print(c["id"], c["dai"], [x["f"] for x in c["cau"]])
