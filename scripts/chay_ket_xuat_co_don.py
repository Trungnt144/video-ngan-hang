#!/usr/bin/env python3
"""Chạy một lệnh dựng và thu hồi đúng các tiến trình của lượt đó.

Chrome do Remotion mở tự tách nhóm tiến trình trên macOS. TMPDIR riêng
cho từng lượt giúp nhận diện cả Chrome đã mất tiến trình cha, kể cả khi
lỗi xảy ra trước khi Remotion kịp cài trình xử lý tín hiệu.
"""

import os
from pathlib import Path
import shutil
import signal
import subprocess
import sys
import tempfile
import time


def snapshot():
    result = subprocess.run(
        ["ps", "-ww", "-axo", "pid=,ppid=,pgid=,lstart=,args="],
        check=True, text=True, stdout=subprocess.PIPE,
    )
    records = {}
    for line in result.stdout.splitlines():
        parts = line.split(None, 8)
        if len(parts) != 9:
            continue
        pid, parent, group = map(int, parts[:3])
        records[pid] = (parent, group, " ".join(parts[3:8]), parts[8])
    return records


def owned_processes(records, group, temp_dir, remembered):
    owned = {
        pid: record for pid, record in records.items()
        if record[1] == group
        or (remembered.get(pid) == record[2])
        or ("--headless" in record[3]
            and "--user-data-dir=" + str(temp_dir) + "/" in record[3])
    }
    while True:
        children = {pid: r for pid, r in records.items() if r[0] in owned}
        before = len(owned)
        owned.update(children)
        if len(owned) == before:
            return owned


def cleanup(group, temp_dir, child):
    remembered = {}
    signalled = {}
    start = time.monotonic()
    while True:
        # poll() thu hồi tiến trình con đã thoát, tránh coi zombie là còn chạy.
        child.poll()
        records = snapshot()
        owned = owned_processes(records, group, temp_dir, remembered)
        if not owned:
            if remembered:
                print(f"[dọn kết xuất] Đã thu hồi {len(remembered)} tiến trình còn sót.",
                      file=sys.stderr)
            return True
        elapsed = time.monotonic() - start
        if elapsed > 7:
            print("[dọn kết xuất] Chưa dừng được PID: "
                  + ", ".join(map(str, sorted(owned))), file=sys.stderr)
            return False
        sig = signal.SIGKILL if elapsed >= 3 else signal.SIGTERM
        # Dọn con trước; lưu thời điểm sinh để tránh gửi lại vào PID được tái dùng.
        for pid, record in reversed(list(owned.items())):
            identity = (pid, record[2])
            remembered[pid] = record[2]
            if signalled.get(identity) == sig:
                continue
            fresh = snapshot().get(pid)
            if fresh is None or fresh[2] != record[2]:
                continue
            try:
                os.kill(pid, sig)
                signalled[identity] = sig
            except ProcessLookupError:
                pass
        time.sleep(0.1)


def main(argv):
    if not argv:
        print("Cách dùng: chay_ket_xuat_co_don.py <lệnh> [tham số ...]", file=sys.stderr)
        return 2
    temp_dir = Path(tempfile.mkdtemp(prefix="media-ket-xuat-"))
    environment = os.environ.copy()
    environment["TMPDIR"] = str(temp_dir) + "/"
    interrupted = 0

    def request_stop(signum, _frame):
        nonlocal interrupted
        interrupted = interrupted or signum

    previous = {s: signal.signal(s, request_stop)
                for s in (signal.SIGINT, signal.SIGTERM, signal.SIGHUP)}
    child = None
    cleaned = False
    try:
        child = subprocess.Popen(argv, env=environment, start_new_session=True)
        while child.poll() is None and not interrupted:
            time.sleep(0.1)
        code = 128 + interrupted if interrupted else child.returncode
        if code < 0:
            code = 128 - code
        cleaned = cleanup(child.pid, temp_dir, child)
        return code if code or cleaned else 70
    except FileNotFoundError as error:
        print(f"[dọn kết xuất] Không tìm thấy lệnh: {error.filename}", file=sys.stderr)
        cleaned = child is None
        return 127
    finally:
        try:
            if child is not None and not cleaned:
                cleaned = cleanup(child.pid, temp_dir, child)
            if child is None or cleaned:
                shutil.rmtree(temp_dir)
        finally:
            for signum, handler in previous.items():
                signal.signal(signum, handler)


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
