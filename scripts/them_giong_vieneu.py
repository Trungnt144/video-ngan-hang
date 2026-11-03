# them_giong_vieneu.py — đăng ký một giọng riêng cho VieNeu-TTS từ một file thu giọng (nhân bản giọng)
#
# VieNeu cắt khoảng lặng ở hai đầu file, lọc ồn, rồi CHỈ dùng 8 giây đầu để rút ra đặc trưng giọng
# (dãy số chất giọng speaker_emb và mã âm thanh mẫu codes). Hai thứ này được lưu vào file giọng riêng
# tai_san/giong_rieng/giong_rieng_vieneu.json (ngoài git), KHÔNG ghi vào thư mục cài đặt của gói vieneu
# (cài lại gói là mất). scripts/sinh_giong_vieneu.py tự đọc file này khi gọi --giong "<tên>".
#
# Chỉ nhân bản giọng của chính người đã đồng ý (trang mô hình VieNeu cấm nhân bản giọng người khác khi chưa được phép).
#
# Dùng (chạy bằng Python của .venv_vieneu ở gốc project):
#   .venv_vieneu/bin/python scripts/them_giong_vieneu.py --ten "Trung" --file ~/Downloads/thu_giong.m4a \
#       [--mo-ta "Giọng Trung, thu 26/10/2026"] [--gioi-tinh nam] [--khong-loc-on]
# File .m4a, .mp3, .aiff được đổi sang .wav bằng afconvert (có sẵn trên macOS). Bản gốc được chép vào
# tai_san/giong_rieng/goc/, kèm một file nghe thử tai_san/giong_rieng/nghe_thu/<tên>.wav đọc câu mẫu.
# Xoá một giọng: --xoa "Trung".

import argparse
import json
import shutil
import subprocess
import sys
import tempfile
import unicodedata
from datetime import date
from pathlib import Path

import numpy as np
import soundfile as sf

GOC = Path(__file__).resolve().parent.parent
THU_MUC = GOC / "tai_san" / "giong_rieng"
FILE_GIONG = THU_MUC / "giong_rieng_vieneu.json"
GIAY_DUNG = 8.0  # _MAX_REF_SECONDS của vieneu 3.8.3: chỉ 8 giây đầu sau khi cắt lặng được dùng
CAU_THU = ("Xin chào, đây là bản đọc thử bằng giọng nhân bản. Pin mặt trời biến ánh sáng thành dòng điện "
           "nhờ lớp tiếp giáp giữa hai loại bán dẫn.")


def doc_file_giong():
    if FILE_GIONG.exists():
        return json.loads(FILE_GIONG.read_text(encoding="utf-8"))
    return {"_ghi_chu": "Giọng riêng của xưởng cho VieNeu-TTS, sinh bằng scripts/them_giong_vieneu.py. "
                        "Dữ liệu giọng người thật: không đưa vào git, không đưa cho phiên Grok hoặc Hermes.",
            "giong": {}}


def nap_giong_rieng(ten):
    # Trả về dict {speaker_emb, codes} để truyền thẳng vào tts.infer(voice=...); None nếu không phải giọng riêng
    v = doc_file_giong()["giong"].get(ten)
    if v is None:
        return None
    return {"speaker_emb": np.asarray(v["speaker_emb"], dtype=np.float32),
            "codes": None if v["codes"] is None else np.asarray(v["codes"], dtype=np.int64)}


def khong_dau(s):
    s = unicodedata.normalize("NFD", s).replace("đ", "d").replace("Đ", "D")
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower().replace(" ", "_")


def ve_wav(src, tam):
    if src.suffix.lower() == ".wav":
        return src
    ra = Path(tam) / (src.stem + ".wav")
    subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16", str(src), str(ra)], check=True)
    return ra


def do_file(wav_path):
    import librosa
    x, sr = sf.read(str(wav_path), dtype="float32", always_2d=False)
    if x.ndim > 1:
        x = x.mean(axis=1)
    cat, _ = librosa.effects.trim(x, top_db=30)  # cùng ngưỡng với _preclean_reference_audio của vieneu
    dung = cat[: int(GIAY_DUNG * sr)]
    db = lambda y: round(float(20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-9)), 1)
    return {"tan_so_mau": sr, "giay_goc": round(len(x) / sr, 2), "giay_sau_cat_lang": round(len(cat) / sr, 2),
            "giay_duoc_dung": round(len(dung) / sr, 2), "am_luong_dbfs": db(dung),
            "dinh_dbfs": round(float(20 * np.log10(np.max(np.abs(dung)) + 1e-9)), 1),
            "so_mau_vo_tieng": int((np.abs(dung) >= 0.99).sum())}


def main():
    p = argparse.ArgumentParser(description="Đăng ký giọng riêng cho VieNeu-TTS từ một file thu giọng")
    p.add_argument("--ten", help="tên giọng, dùng lại ở --giong của sinh_giong_vieneu.py")
    p.add_argument("--file", help="file thu giọng (.wav, .m4a, .mp3, .aiff)")
    p.add_argument("--mo-ta", default="")
    p.add_argument("--gioi-tinh", default="")
    p.add_argument("--khong-loc-on", action="store_true", help="bỏ bước lọc ồn khi file đã thu sạch")
    p.add_argument("--xoa", help="xoá giọng riêng có tên này")
    a = p.parse_args()

    du_lieu = doc_file_giong()
    if a.xoa:
        if du_lieu["giong"].pop(a.xoa, None) is None:
            sys.exit(f"Không có giọng riêng tên {a.xoa}")
        FILE_GIONG.write_text(json.dumps(du_lieu, ensure_ascii=False), encoding="utf-8")
        print(f"Đã xoá giọng {a.xoa} khỏi {FILE_GIONG}")
        return
    if not a.ten or not a.file:
        p.error("cần --ten và --file")
    src = Path(a.file).expanduser()
    if not src.exists():
        sys.exit(f"Không thấy file {src}")

    from vieneu import Vieneu
    tts = Vieneu()
    if tts.resolve_voice_name(a.ten):
        sys.exit(f"Tên {a.ten} trùng giọng có sẵn của VieNeu, chọn tên khác")

    (THU_MUC / "goc").mkdir(parents=True, exist_ok=True)
    (THU_MUC / "nghe_thu").mkdir(parents=True, exist_ok=True)
    ban_goc = THU_MUC / "goc" / f"{khong_dau(a.ten)}{src.suffix.lower()}"
    if src.resolve() != ban_goc.resolve():
        shutil.copy2(src, ban_goc)

    with tempfile.TemporaryDirectory() as tam:
        wav = ve_wav(ban_goc, tam)
        do = do_file(wav)
        emb, codes = tts.encode_reference(str(wav), denoise=not a.khong_loc_on)

    du_lieu["giong"][a.ten] = {
        "mo_ta": a.mo_ta, "gioi_tinh": a.gioi_tinh, "ngay_dang_ky": date.today().isoformat(),
        "file_goc": str(ban_goc.relative_to(GOC)), "loc_on": not a.khong_loc_on, "do_file": do,
        "speaker_emb": [round(float(v), 6) for v in np.asarray(emb).reshape(-1)],
        "codes": None if codes is None else np.asarray(codes, dtype=int).tolist(),
    }
    FILE_GIONG.write_text(json.dumps(du_lieu, ensure_ascii=False), encoding="utf-8")

    x = np.asarray(tts.infer(CAU_THU, voice=nap_giong_rieng(a.ten)), dtype=np.float32).flatten()
    nghe = THU_MUC / "nghe_thu" / f"{khong_dau(a.ten)}.wav"
    sf.write(nghe, x, 48000, subtype="PCM_16")

    print(f"Đã đăng ký giọng {a.ten} vào {FILE_GIONG}")
    print(f"  file gốc {do['giay_goc']} giây, sau cắt lặng {do['giay_sau_cat_lang']} giây, "
          f"VieNeu dùng {do['giay_duoc_dung']} giây đầu; âm lượng {do['am_luong_dbfs']} dBFS, đỉnh {do['dinh_dbfs']} dBFS")
    if do["giay_sau_cat_lang"] < 6:
        print("  CẢNH BÁO: dưới 6 giây có tiếng, chất giọng nhân bản dễ kém. Nên thu lại 10–12 giây.")
    # đỉnh sát 0 dBFS chưa chắc vỡ tiếng (bản thu Trung 26/10/2026 đỉnh -0,2 dBFS mà 0 mẫu chạm 0,99); đếm mẫu bị xén
    if do["so_mau_vo_tieng"] > 10:
        print(f"  CẢNH BÁO: {do['so_mau_vo_tieng']} mẫu chạm trần (vỡ tiếng). Nên thu lại, nói nhỏ hơn hoặc lùi xa micro.")
    if do["am_luong_dbfs"] < -35:
        print("  CẢNH BÁO: tiếng quá nhỏ. Nên thu lại gần micro hơn.")
    print(f"  nghe thử: {nghe}")


if __name__ == "__main__":
    sys.exit(main())
