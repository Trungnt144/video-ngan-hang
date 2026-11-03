# Lập sổ nhạc nền từ các file số đo (27/10/2026). Không cần thư viện ngoài.
# Đọc trong tai_san/nhac_nen/: nguon_nhac.json (nguồn gốc, nhãn trang nguồn), cham_tam_trang.jsonl (mô hình CLAP),
#   so_do_nhac.jsonl (độ to, nhịp), do_re.jsonl (tiếng rè), nghe_lai.json (nhãn Trung sửa sau khi nghe, nếu có),
#   duyet.json (lần Trung chốt cả sổ, nếu có).
# Ghi: so_nhac.json (nguồn sự thật cho mã dựng và hệ trục), so_nhac.md (bảng đọc), nghe_thu.html (trang nghe và sửa nhãn).
# Chạy: python3 scripts/lap_so_nhac.py
import json, math, os, html

D = "tai_san/nhac_nen"
NHOM = {"VUI": "tươi vui", "TAP": "tập trung, nhẹ", "TRAM": "trầm, nghiêm", "BUON": "buồn", "HOI": "hồi hộp", "HUNG": "hùng tráng"}
TIET = {"CHAM": "chậm", "VUA": "vừa", "NHANH": "nhanh"}
DAI = {"NGAN": "ngắn (dưới 1:30)", "VUA": "vừa (1:30–2:30)", "DAI": "dài (trên 2:30)"}


def doc_jsonl(f):
    return {x["file"]: x for x in map(json.loads, open(os.path.join(D, f)))}


nguon = json.load(open(os.path.join(D, "nguon_nhac.json")))
cham, so, re_ = doc_jsonl("cham_tam_trang.jsonl"), doc_jsonl("so_do_nhac.jsonl"), doc_jsonl("do_re.jsonl")
duyet = json.load(open(os.path.join(D, "duyet.json"))) if os.path.exists(os.path.join(D, "duyet.json")) else None
nghe = json.load(open(os.path.join(D, "nghe_lai.json"))) if os.path.exists(os.path.join(D, "nghe_lai.json")) else {}

# Hiệu chỉnh mô hình: mô hình nghiêng về VUI và HOI cho mọi bài, nên chuẩn hoá log điểm từng nhóm theo cả kho
# (trừ trung bình, chia độ lệch chuẩn) rồi mới chọn nhóm cao nhất.
logp = {f: {k: math.log(max(v, 1e-6)) for k, v in c["diem"].items()} for f, c in cham.items()}
tb = {k: sum(l[k] for l in logp.values()) / len(logp) for k in NHOM}
dl = {k: math.sqrt(sum((l[k] - tb[k]) ** 2 for l in logp.values()) / len(logp)) or 1 for k in NHOM}

so_nhac = []
for x in nguon:
    f = x["file"]; c = cham[f]; s = so[f]; r = re_[f]
    z = {k: (logp[f][k] - tb[k]) / dl[k] for k in NHOM}
    may = sorted(z, key=z.get, reverse=True)
    src = x.get("nhom_nguon")
    if src is None:
        nhom, khop = may[0], "chỉ có máy chấm"
    elif src == may[0]:
        nhom, khop = src, "khớp"
    elif src in may[:2]:
        nhom, khop = src, "gần khớp"
    else:
        nhom, khop = src, f"lệch: máy chấm {NHOM[may[0]]}"
    # Tiết tấu: mật độ khởi âm là chính (bền với nhạc không trống), nhịp ước chỉ để tách nhanh và vừa.
    on, bpm = c["khoi_am_moi_giay"], s["bpm"]
    tiet = "CHAM" if on < 2.5 else ("NHANH" if on >= 4.5 and bpm >= 108 else "VUA")
    dai = "NGAN" if s["dur"] < 90 else ("VUA" if s["dur"] <= 150 else "DAI")
    re_nghi = r["max10"] >= 5 or r["max16"] >= 8
    tn = nghe.get(x["ma"], {})
    so_nhac.append(dict(
        ma=x["ma"], file=f, ten=x["ten"], nguon=x["nguon"], trang=x["trang"], tai_tu=x.get("tai_tu"), vao_git=x["vao_git"],
        content_id=x.get("content_id"), the_loai_nguon=x.get("the_loai_nguon"), nhan_nguon=x.get("nhan_nguon"),
        nhom=tn.get("nhom", nhom), nhom_may=may[0], nhom_nguon=src, khop=("Trung đã nghe" if "nhom" in tn else khop),
        tiet_tau=tn.get("tiet_tau", tiet), do_dai=dai, dai_giay=s["dur"], bpm=bpm, khoi_am_moi_giay=on,
        am_luong=round(0.16 * 10 ** ((-18.2 - s["rms"]) / 20), 3), mo_dau_nho_giay=s["intro"],
        re=dict(max10=r["max10"], max16=r["max16"], nghi_re=re_nghi),
        co_the_co_loi=c["co_loi"] >= 0.7, da_nghe=bool(tn), duyet=(duyet["ngay"] if duyet else None), ghi_chu=tn.get("ghi_chu") or x.get("luu_y")))

json.dump(so_nhac, open(os.path.join(D, "so_nhac.json"), "w"), ensure_ascii=False, indent=1)


def mmss(t):
    return f"{int(t // 60)}:{int(t % 60):02d}"


# Bảng đọc, xếp theo nhóm tính chất rồi độ dài.
dong = ["# Sổ nhạc nền", "", "> Sinh từ `scripts/lap_so_nhac.py`, không sửa tay. Sửa nhãn sau khi nghe: trang `nghe_thu.html` → file `nghe_lai.json` → chạy lại script.", ""]
if duyet: dong[-1:-1] = [f"> **Trạng thái: {duyet['nguoi']} chốt ngày {duyet['ngay']}.** {duyet['noi_dung']} Cột \"Độ tin nhóm\" giữ lại để biết nhãn nào do máy và trang nguồn cùng gán, nhãn nào hai bên lệch."]
dem = {}
for x in so_nhac: dem[(x["nhom"], x["do_dai"])] = dem.get((x["nhom"], x["do_dai"]), 0) + 1
dong += ["## Số bài theo nhóm tính chất và độ dài", "", "| Nhóm | " + " | ".join(DAI.values()) + " | Cộng |", "|---|---|---|---|---|"]
for k, v in NHOM.items():
    hang = [dem.get((k, d), 0) for d in DAI]
    dong.append(f"| {v} | " + " | ".join(map(str, hang)) + f" | {sum(hang)} |")
dong += ["", "## Danh sách", "", "| Mã | Bài, tác giả | Nguồn | Nhóm | Tiết tấu | Dài | Âm lượng | Độ tin nhóm | Lưu ý |", "|---|---|---|---|---|---|---|---|---|"]
for k in NHOM:
    for x in sorted([x for x in so_nhac if x["nhom"] == k], key=lambda x: x["dai_giay"]):
        lu = []
        if x["re"]["nghi_re"]: lu.append(f"nghi rè ({x['re']['max10']} / {x['re']['max16']} dB)")
        if x["co_the_co_loi"]: lu.append("có thể có giọng hát")
        if x["mo_dau_nho_giay"] >= 3: lu.append(f"{x['mo_dau_nho_giay']} giây đầu nhỏ")
        if x["content_id"]: lu.append("đăng ký Content ID")
        if x["ghi_chu"]: lu.append(x["ghi_chu"])
        dong.append(f"| {x['ma']} | {x['ten']} | {x['nguon']} | {NHOM[k]} | {TIET[x['tiet_tau']]} | {mmss(x['dai_giay'])} | {x['am_luong']} | {x['khop']} | {'; '.join(lu)} |")
open(os.path.join(D, "so_nhac.md"), "w").write("\n".join(dong) + "\n")

# Trang nghe thử: mở trực tiếp file này trong trình duyệt, nhạc phát từ cùng thư mục.
the = []
for x in sorted(so_nhac, key=lambda x: (list(NHOM).index(x["nhom"]), x["dai_giay"])):
    chon_nhom = "".join(f'<option value="{k}"{" selected" if k == x["nhom"] else ""}>{v}</option>' for k, v in NHOM.items())
    chon_tiet = "".join(f'<option value="{k}"{" selected" if k == x["tiet_tau"] else ""}>{v}</option>' for k, v in TIET.items())
    the.append(f'''<tr data-ma="{x['ma']}"><td>{x['ma']}</td><td>{html.escape(x['ten'])}<br><small>{x['nguon']} · {mmss(x['dai_giay'])} · {x['khop']}</small></td>
<td><audio controls preload="none" src="{html.escape(x['file'])}"></audio></td>
<td><select class="nhom">{chon_nhom}</select></td><td><select class="tiet">{chon_tiet}</select></td><td><input class="ghi" placeholder="ghi chú"></td></tr>''')
trang = f'''<!doctype html><html lang="vi"><meta charset="utf-8"><title>Nghe thử nhạc nền</title>
<style>body{{font:15px/1.5 -apple-system,sans-serif;margin:16px;background:#fff;color:#222}}table{{border-collapse:collapse;width:100%}}
td{{border-bottom:1px solid #ddd;padding:6px;vertical-align:middle}}small{{color:#666}}audio{{width:260px}}button{{font-size:15px;padding:6px 12px}}
@media (prefers-color-scheme:dark){{body{{background:#1b1b1b;color:#eee}}td{{border-color:#333}}small{{color:#aaa}}}}</style>
<p>Nghe từng bài, sửa nhóm hoặc tiết tấu nếu máy gán sai, rồi bấm nút tải về <b>nghe_lai.json</b> và chép file đó vào thư mục <code>tai_san/nhac_nen/</code>. Chỉ những bài anh đã đổi hoặc đã ghi chú mới vào file.</p>
<button onclick="luu()">Tải nghe_lai.json</button>
<table>{"".join(the)}</table>
<script>
const goc={{}};document.querySelectorAll('tr[data-ma]').forEach(t=>goc[t.dataset.ma]=[t.querySelector('.nhom').value,t.querySelector('.tiet').value]);
document.querySelectorAll('audio').forEach(a=>a.addEventListener('play',()=>document.querySelectorAll('audio').forEach(b=>{{if(b!==a)b.pause()}})));
function luu(){{const o={{}};document.querySelectorAll('tr[data-ma]').forEach(t=>{{const m=t.dataset.ma,n=t.querySelector('.nhom').value,ti=t.querySelector('.tiet').value,g=t.querySelector('.ghi').value.trim();
if(n!==goc[m][0]||ti!==goc[m][1]||g)o[m]={{nhom:n,tiet_tau:ti,...(g?{{ghi_chu:g}}:{{}})}}}});
const b=new Blob([JSON.stringify(o,null,1)],{{type:'application/json'}});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='nghe_lai.json';a.click()}}
</script></html>'''
open(os.path.join(D, "nghe_thu.html"), "w").write(trang)
print(len(so_nhac), "bài")
