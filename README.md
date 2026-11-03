# VideoNganHang

Xưởng làm video chiến dịch **Chuyện nghề Ngân hàng**: video ngang 1920×1080 có thuyết minh giọng VieNeu Quốc Tuấn, giải thích một thuật ngữ hoặc nghiệp vụ ngân hàng trong 4–6 phút. Dựng từ bản chép độc lập của project Media (`~/Documents/Grok/Media`), nằm ngoài cây Grok.

Bộ não là `AGENTS.md`. Hermes, Antigravity và Claude Code đều đọc file này.

## Mở project

Hermes:

```bash
cd ~/Documents/VideoNganHang && hermes
```

Claude Code:

```bash
cd ~/Documents/VideoNganHang && claude
```

Antigravity: mở thư mục `~/Documents/VideoNganHang` trong app Antigravity một lần để app khai báo project (skill nằm ở `.agents/skills/`, quy tắc luôn bật ở `.agents/rules/`). Sau đó Claude hoặc Hermes giao việc bằng `giao_antigravity.sh --project VideoNganHang` nếu cần.

Chỉ một công cụ làm việc trong project tại một thời điểm.

## Cài đặt lần đầu trên máy

```bash
bash ~/Documents/VideoNganHang/scripts/cai_dat.sh kiem
```

In ra phần nào đã có, phần nào thiếu. Cài phần thiếu (thư viện Node, môi trường Python giọng VieNeu):

```bash
bash ~/Documents/VideoNganHang/scripts/cai_dat.sh cai
```

Cần trước: Node 20 trở lên, Python 3.11, `uv` (Hermes có sẵn ở `~/.hermes/bin/uv`), Chromium của Playwright bản 1234 ở `~/Library/Caches/ms-playwright/` (máy này đã có, dùng chung với Media).

## Làm một video

Nói với công cụ: "làm video <thuật ngữ> theo skill lam-video-ngan-hang". Luồng 10 bước ở `skills/lam-video-ngan-hang/SKILL.md`; Trung duyệt hai chỗ: ảnh tĩnh và bản nháp.

## Cấu trúc

```
VideoNganHang/
├── AGENTS.md                  bộ não, bảng điều hướng
├── 00…18_*.md, 90_bai_hoc.md  module hướng dẫn (chép từ Media)
├── skills/                    skill gốc (lam-video-ngan-hang + 10 skill của Media)
├── .agents/ .claude/          lối tắt skill cho Antigravity và Claude Code
├── scripts/                   giọng VieNeu, mốc thời gian, pha máy, kiểm, cài đặt
├── xuong_html/                cách làm chính (cong_cu, hinh_thu_nho, video mẫu n199)
├── xuong/ xuong_dai/ xuong_thu_hyperframes/   Remotion dọc, Remotion ngang, ffmpeg
├── tai_san/                   quy tắc chiến dịch, từ điển đọc, nhạc, kho hình, sổ tay gu
├── san_pham/                  mỗi video một thư mục (ngoài git trừ kịch bản và chữ đăng)
└── du_lieu/                   sổ trạng thái, báo cáo pha máy
```
