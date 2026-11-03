#!/bin/bash
set -e
cd "$(dirname "$0")/../.."
.venv_vieneu/bin/python scripts/sinh_giong_vieneu.py --kich-ban "san_pham/2026.11.03.EBITDA_la_gi/tai_nguyen/kich_ban/2026.11.03.ebitda_v1.chuong.json" --ra xuong_html/n302_ebitda/am_thanh --giong "Quốc Tuấn"
