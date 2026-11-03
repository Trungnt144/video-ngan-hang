<#
    cat_khung_hinh.ps1 — cắt khung hình (frame) từ một video bằng ffmpeg
    ------------------------------------------------------------------
    Mục đích: hỗ trợ soi phong cách dựng của một video mẫu bằng cách cắt
    video ra thành các ảnh tĩnh, xem chi tiết quy trình phân tích ở
    Media\11_hoc_phong_cach_tu_mau.md (mục 1 đến 5 và mục 6 đến 14).

    CÁCH DÙNG:
      .\cat_khung_hinh.ps1 -Video <đường dẫn video> -ThuMuc <thư mục ra> -CheDo <deu|day|doicanh> [-NhipGiay <số>] [-BatDau <giây>] [-ThoiLuong <giây>] [-NguongDoiCanh <0..1>]

    THAM SỐ:
      -Video            Đường dẫn file video nguồn (bắt buộc).
      -ThuMuc           Thư mục chứa ảnh cắt ra, tự tạo nếu chưa có (bắt buộc).
      -CheDo            "deu"      = cắt đều theo nhịp thời gian, dùng để nhìn tổng thể mạch video.
                         "day"     = cắt dày (nhiều hình/giây) trong một đoạn ngắn, dùng để soi kỹ một hiệu ứng.
                         "doicanh" = cắt tại các điểm đổi cảnh (scene change) tự động, dùng để đo nhịp cắt.
      -NhipGiay         (chế độ "deu") khoảng cách giữa hai lần cắt, đơn vị giây. Mặc định 0.5.
      -BatDau           (chế độ "day") giây bắt đầu đoạn cần soi kỹ. Mặc định 0.
      -ThoiLuong        (chế độ "day") độ dài đoạn cần soi kỹ, đơn vị giây. Mặc định 3.
      -FpsDay           (chế độ "day") số hình cắt ra mỗi giây trong đoạn soi kỹ. Mặc định 12.
      -NguongDoiCanh    (chế độ "doicanh") ngưỡng nhạy phát hiện đổi cảnh, từ 0 đến 1 — càng thấp càng
                         bắt nhiều điểm đổi cảnh (kể cả đổi nhẹ), càng cao càng chỉ bắt đổi cảnh mạnh.
                         Mặc định 0.3 (mức trung bình, hợp với hầu hết video ngắn).

    VÍ DỤ:
      # 1) Cắt đều mỗi 0,5 giây để nhìn tổng thể mạch video mẫu
      .\cat_khung_hinh.ps1 -Video "..\tai_san\mau_video\mau1.mp4" -ThuMuc "..\tai_san\mau_video\deu" -CheDo deu -NhipGiay 0.5

      # 2) Cắt dày 12 hình/giây trong 3 giây từ giây thứ 5, soi kỹ một hiệu ứng chuyển động
      .\cat_khung_hinh.ps1 -Video "..\tai_san\mau_video\mau1.mp4" -ThuMuc "..\tai_san\mau_video\day" -CheDo day -BatDau 5 -ThoiLuong 3 -FpsDay 12

      # 3) Cắt tại các điểm đổi cảnh để đo nhịp cắt của video
      .\cat_khung_hinh.ps1 -Video "..\tai_san\mau_video\mau1.mp4" -ThuMuc "..\tai_san\mau_video\doicanh" -CheDo doicanh -NguongDoiCanh 0.3

    YÊU CẦU: ffmpeg và ffprobe phải có trong PATH (đã kiểm chứng có sẵn trên máy này).
    Viết cho PowerShell 5.1: không dùng && , không dùng toán tử ba ngôi, không dùng ??.

    GHI CHÚ KỸ THUẬT: script KHÔNG dùng toán tử ">" để chuyển hướng stderr của ffmpeg
    (kiểu "2>`$null" hay "2>file"). PowerShell 5.1 có tật: làm vậy sẽ bọc từng dòng
    stderr của lệnh ngoài (native command) thành ErrorRecord và có thể khiến script
    dừng giữa chừng dù ffmpeg chạy đúng. Thay vào đó dùng Start-Process với
    -RedirectStandardError để lấy log một cách an toàn.
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$Video,

    [Parameter(Mandatory = $true)]
    [string]$ThuMuc,

    [Parameter(Mandatory = $true)]
    [ValidateSet("deu", "day", "doicanh")]
    [string]$CheDo,

    [double]$NhipGiay = 0.5,
    [double]$BatDau = 0,
    [double]$ThoiLuong = 3,
    [double]$FpsDay = 12,
    [double]$NguongDoiCanh = 0.3
)

if (-not (Test-Path -LiteralPath $Video)) {
    Write-Error "Không tìm thấy file video: $Video"
    exit 1
}

if (-not (Test-Path -LiteralPath $ThuMuc)) {
    New-Item -ItemType Directory -Path $ThuMuc -Force | Out-Null
}

$VideoDayDu = (Resolve-Path -LiteralPath $Video).Path
$ThuMucDayDu = (Resolve-Path -LiteralPath $ThuMuc).Path

Write-Host "Video nguồn : $VideoDayDu"
Write-Host "Thư mục ra  : $ThuMucDayDu"
Write-Host "Chế độ      : $CheDo"
Write-Host ""

# Hàm chạy ffmpeg an toàn qua Start-Process, tránh tật chuyển hướng stderr của
# PowerShell 5.1 với lệnh ngoài (xem ghi chú kỹ thuật ở đầu file).
function Chay-Ffmpeg {
    param([string[]]$ThamSo)

    $logLoi = [System.IO.Path]::GetTempFileName()
    $logRa = [System.IO.Path]::GetTempFileName()

    $tienTrinh = Start-Process -FilePath "ffmpeg" -ArgumentList $ThamSo -NoNewWindow -Wait -PassThru `
        -RedirectStandardError $logLoi -RedirectStandardOutput $logRa

    $ketQua = New-Object PSObject -Property @{
        ExitCode = $tienTrinh.ExitCode
        LogLoi   = $logLoi
        LogRa    = $logRa
    }
    return $ketQua
}

if ($CheDo -eq "deu") {
    # Cắt đều theo nhịp thời gian: mỗi $NhipGiay giây lấy 1 khung hình.
    # fps = 1 / nhịp giây (ví dụ nhịp 0,5s -> fps = 2, tức 2 hình mỗi giây thực).
    $FpsBieuThuc = "1/$NhipGiay"
    $MauTen = Join-Path $ThuMucDayDu "deu_%04d.jpg"
    $ThamSo = @("-y", "-i", $VideoDayDu, "-vf", "fps=$FpsBieuThuc", "-q:v", "2", $MauTen)

    $ketQua = Chay-Ffmpeg -ThamSo $ThamSo

    if ($ketQua.ExitCode -ne 0) {
        Write-Error "ffmpeg lỗi (mã $($ketQua.ExitCode)). Chi tiết:"
        Get-Content -LiteralPath $ketQua.LogLoi | Write-Error
        Remove-Item $ketQua.LogLoi, $ketQua.LogRa -ErrorAction SilentlyContinue
        exit 1
    }
    Remove-Item $ketQua.LogLoi, $ketQua.LogRa -ErrorAction SilentlyContinue

    $SoKhung = (Get-ChildItem -LiteralPath $ThuMucDayDu -Filter "deu_*.jpg" | Measure-Object).Count
    Write-Host "Đã cắt đều mỗi $NhipGiay giây -> $SoKhung khung hình."
    Write-Host "Lưu tại: $ThuMucDayDu"
}
elseif ($CheDo -eq "day") {
    # Cắt dày trong một đoạn ngắn: bắt đầu từ $BatDau giây, kéo dài $ThoiLuong giây,
    # lấy $FpsDay hình mỗi giây để soi kỹ chuyển động/hiệu ứng.
    $MauTen = Join-Path $ThuMucDayDu "day_%04d.jpg"
    $ThamSo = @("-y", "-ss", "$BatDau", "-i", $VideoDayDu, "-t", "$ThoiLuong", "-vf", "fps=$FpsDay", "-q:v", "2", $MauTen)

    $ketQua = Chay-Ffmpeg -ThamSo $ThamSo

    if ($ketQua.ExitCode -ne 0) {
        Write-Error "ffmpeg lỗi (mã $($ketQua.ExitCode)). Chi tiết:"
        Get-Content -LiteralPath $ketQua.LogLoi | Write-Error
        Remove-Item $ketQua.LogLoi, $ketQua.LogRa -ErrorAction SilentlyContinue
        exit 1
    }
    Remove-Item $ketQua.LogLoi, $ketQua.LogRa -ErrorAction SilentlyContinue

    $SoKhung = (Get-ChildItem -LiteralPath $ThuMucDayDu -Filter "day_*.jpg" | Measure-Object).Count
    Write-Host "Đã cắt dày $FpsDay hình/giây trong $ThoiLuong giây (từ giây $BatDau) -> $SoKhung khung hình."
    Write-Host "Lưu tại: $ThuMucDayDu"
}
else {
    # Cắt tại điểm đổi cảnh: dùng bộ lọc select với biểu thức gt(scene,NguongDoiCanh) của ffmpeg,
    # đồng thời in ra thời điểm (pts_time) của mỗi khung được chọn qua showinfo để tính nhịp cắt.
    $MauTen = Join-Path $ThuMucDayDu "doicanh_%04d.jpg"
    $BieuThucLoc = "select='gt(scene,$NguongDoiCanh)',showinfo"
    $ThamSo = @("-y", "-i", $VideoDayDu, "-vf", $BieuThucLoc, "-vsync", "vfr", "-q:v", "2", $MauTen)

    $ketQua = Chay-Ffmpeg -ThamSo $ThamSo

    if ($ketQua.ExitCode -ne 0) {
        Write-Error "ffmpeg lỗi (mã $($ketQua.ExitCode)). Chi tiết:"
        Get-Content -LiteralPath $ketQua.LogLoi | Write-Error
        Remove-Item $ketQua.LogLoi, $ketQua.LogRa -ErrorAction SilentlyContinue
        exit 1
    }

    $SoKhung = (Get-ChildItem -LiteralPath $ThuMucDayDu -Filter "doicanh_*.jpg" | Measure-Object).Count

    # Lọc dòng showinfo trong log lỗi (ffmpeg in log ra stderr) để lấy mốc thời gian pts_time.
    $DongMoc = Select-String -Path $ketQua.LogLoi -Pattern "pts_time:(\d+\.?\d*)"
    $MocThoiGian = @()
    foreach ($dong in $DongMoc) {
        $MocThoiGian += [double]$dong.Matches[0].Groups[1].Value
    }

    Remove-Item $ketQua.LogLoi, $ketQua.LogRa -ErrorAction SilentlyContinue

    Write-Host "Đã cắt tại điểm đổi cảnh (ngưỡng $NguongDoiCanh) -> $SoKhung khung hình."
    Write-Host "Lưu tại: $ThuMucDayDu"
    Write-Host ""

    if ($MocThoiGian.Count -gt 0) {
        Write-Host "Mốc thời gian đổi cảnh (giây):"
        Write-Host ($MocThoiGian -join ", ")

        if ($MocThoiGian.Count -gt 1) {
            $KhoangCach = @()
            for ($i = 1; $i -lt $MocThoiGian.Count; $i++) {
                $KhoangCach += ($MocThoiGian[$i] - $MocThoiGian[$i - 1])
            }
            $TrungBinh = ($KhoangCach | Measure-Object -Average).Average
            $TrungBinhLamTron = [math]::Round($TrungBinh, 2)
            Write-Host ""
            Write-Host "Nhịp cắt trung bình: $TrungBinhLamTron giây/lần đổi cảnh."
            if ($TrungBinh -lt 1.5) {
                Write-Host "-> Nhịp NHANH, DỒN DẬP (đổi cảnh liên tục dưới 1,5 giây/lần)."
            }
            elseif ($TrungBinh -lt 3) {
                Write-Host "-> Nhịp VỪA PHẢI."
            }
            else {
                Write-Host "-> Nhịp THONG THẢ (mỗi cảnh giữ khá lâu, trên 3 giây)."
            }
        }
        else {
            Write-Host ""
            Write-Host "Chỉ có 1 mốc đổi cảnh, chưa đủ để tính khoảng cách trung bình."
        }
    }
    else {
        Write-Host "Không tìm thấy mốc đổi cảnh nào — thử giảm -NguongDoiCanh (ví dụ 0.2) để bắt nhạy hơn."
    }
}
