#!/usr/bin/env python3
"""Đăng nhập Google một lần để lấy token OAuth cho một kênh, KHÔNG tải video nào.

Dùng khi thêm kênh mới: mỗi kênh một thư mục khoá riêng (client_secrets.json dùng chung qua liên kết,
request.token riêng), để token kênh này không ghi đè token kênh khác. Token chỉ được ghi thành
request.token khi đúng kênh --kenh; sai kênh thì lưu thành request.token.sai_kenh_<giờ> và dừng.
Chạy:  python3 -I skills/dang-youtube/scripts/dang_nhap.py --khoa ~/.config/dang-youtube/ngan_hang --kenh UC…
Trung tự bấm đăng nhập trên trình duyệt; Claude không nhập mật khẩu.
"""
import argparse
import datetime as dt
import http.server
import json
import os
import secrets
import subprocess
import urllib.parse
import urllib.request
from pathlib import Path

PHAM_VI = ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube",
           "https://www.googleapis.com/auth/youtube.force-ssl"]
DIA_CHI_VE = "http://localhost:8080/oauth2callback"


def cho_ma(trang_thai, het_gio):
    """Mở máy chủ cục bộ cổng 8080, chờ Google chuyển về kèm mã cấp quyền."""
    ket_qua = {}

    class XuLy(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            u = urllib.parse.urlparse(self.path)
            q = urllib.parse.parse_qs(u.query)
            if u.path != "/oauth2callback":
                self.send_response(404)
                self.end_headers()
                return
            if q.get("state", [""])[0] != trang_thai:
                ket_qua["loi"] = "state không khớp"
            elif "error" in q:
                ket_qua["loi"] = q["error"][0]
            else:
                ket_qua["ma"] = q.get("code", [""])[0]
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.end_headers()
            self.wfile.write("Đã nhận. Đóng thẻ này và quay lại Claude.".encode("utf-8"))

        def log_message(self, *a):
            pass

    may = http.server.HTTPServer(("localhost", 8080), XuLy)
    han = dt.datetime.now() + dt.timedelta(seconds=het_gio)
    while not ket_qua:
        con = (han - dt.datetime.now()).total_seconds()
        if con <= 0:
            ket_qua["loi"] = "hết giờ chờ đăng nhập"
            break
        may.timeout = con
        may.handle_request()
    may.server_close()
    return ket_qua


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--khoa", required=True, help="thư mục khoá riêng của kênh")
    ap.add_argument("--kenh", required=True, help="mã kênh UC… mà token phải thuộc về")
    ap.add_argument("--cho", type=int, default=900, help="số giây chờ đăng nhập (mặc định 900)")
    a = ap.parse_args()

    khoa = Path(os.path.expanduser(a.khoa))
    if (khoa / "request.token").exists():
        print("DỪNG: %s đã có request.token. Script không ghi đè token có sẵn." % khoa)
        return 2
    cs_file = khoa / "client_secrets.json"
    if not cs_file.is_file():
        print("DỪNG: thiếu %s (tạo liên kết tới ../client_secrets.json)." % cs_file)
        return 2
    cs = json.loads(cs_file.read_text(encoding="utf-8"))
    cs = cs.get("web") or cs.get("installed")

    trang_thai = secrets.token_urlsafe(16)
    url = cs.get("auth_uri", "https://accounts.google.com/o/oauth2/auth") + "?" + urllib.parse.urlencode({
        "client_id": cs["client_id"], "redirect_uri": DIA_CHI_VE, "response_type": "code",
        "scope": " ".join(PHAM_VI), "access_type": "offline", "prompt": "consent select_account",
        "state": trang_thai})
    print("Mở trang đăng nhập Google (Trung chọn tài khoản rồi chọn đúng kênh):\n" + url, flush=True)
    subprocess.run(["open", url], check=False)

    kq = cho_ma(trang_thai, a.cho)
    if "ma" not in kq:
        print("DỪNG: " + kq.get("loi", "không nhận được mã"))
        return 1
    du_lieu = urllib.parse.urlencode({"code": kq["ma"], "client_id": cs["client_id"],
                                      "client_secret": cs["client_secret"], "redirect_uri": DIA_CHI_VE,
                                      "grant_type": "authorization_code"}).encode()
    tk = json.load(urllib.request.urlopen(cs.get("token_uri", "https://oauth2.googleapis.com/token"), du_lieu))
    if not tk.get("refresh_token"):
        print("DỪNG: Google không trả refresh_token.")
        return 1
    het_han = dt.datetime.now().astimezone() + dt.timedelta(seconds=int(tk.get("expires_in", 3600)))
    # Cùng định dạng oauth2.Token mà youtubeuploader đọc từ -cache.
    token = {"access_token": tk["access_token"], "token_type": tk.get("token_type", "Bearer"),
             "refresh_token": tk["refresh_token"], "expiry": het_han.isoformat(), "expires_in": tk.get("expires_in")}

    yc = urllib.request.Request("https://www.googleapis.com/youtube/v3/channels?part=snippet,status&mine=true",
                                headers={"Authorization": "Bearer " + tk["access_token"]})
    kenh = [(c["id"], c["snippet"]["title"], c.get("status", {}).get("longUploadsStatus"))
            for c in json.load(urllib.request.urlopen(yc)).get("items", [])]
    print("Token cấp quyền cho kênh: %s" % kenh)
    dich = khoa / "request.token"
    if not any(k[0] == a.kenh for k in kenh):
        dich = khoa / ("request.token.sai_kenh_" + dt.datetime.now().strftime("%Y%m%d_%H%M%S"))
    dich.write_text(json.dumps(token), encoding="utf-8")
    os.chmod(dich, 0o600)
    if dich.name != "request.token":
        print("DỪNG: token không thuộc kênh %s, đã lưu riêng ở %s. Chạy lại và chọn đúng kênh." % (a.kenh, dich))
        return 2
    print("Đã lưu %s" % dich)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
