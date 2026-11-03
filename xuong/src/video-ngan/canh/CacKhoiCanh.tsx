import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { BoMau } from "../bo_mau";
import { LE } from "../bo_mau";
import type { Canh } from "../kieu_du_lieu";
import { chayDayDan, hienChuSongDong, hienRaBieuTuong } from "../thanh-phan/chuyen_dong";
import { ChuSangTheoLoi } from "../thanh-phan/NhipLoi";
import { ChuoiMuiTenKhoi, LuoiBieuTuongKhoi, SoDoKhoi } from "../thanh-phan/SoDoMinhHoa";
import { BieuTuong } from "../thanh-phan/BoBieuTuong";
import type { YCoBieuTuong } from "../kieu_du_lieu";

/**
 * Bảy khối cảnh của khuôn video ngắn dọc.
 *
 * Cùng một khối, đổi chữ và đổi bộ màu là ra video khác — đây là lý do dựng
 * khuôn một lần rồi dùng mãi (`09_video_doc_ngan.md` mục 2).
 *
 * Bố cục theo thẻ D-01: khối chữ chính đặt ở khoảng 1/4-1/3 chiều cao tính từ
 * trên (KHÔNG phải giữa khung), khoảng trống lớn cố ý ở giữa, phụ đề chạy chữ
 * nằm dưới ở 72% chiều cao do thành phần khác vẽ.
 */

const TREN = 0.245; // đỉnh khối chữ chính, tính theo chiều cao khung

/** Nhãn nhỏ viết hoa phía trên tiêu đề. */
const Kicker: React.FC<{ bo: BoMau; chu?: string; canhTrai?: boolean }> = ({ bo, chu, canhTrai }) =>
  chu ? (
    <div
      style={{
        fontSize: bo.co_chu.kicker,
        letterSpacing: 4,
        fontWeight: 700,
        color: bo.nhan_chinh,
        marginBottom: 26,
        textAlign: canhTrai ? "left" : "center",
      }}
    >
      {chu}
    </div>
  ) : null;

/** Khung chứa khối chữ chính, đặt cao chứ không giữa khung. */
const KhoiChu: React.FC<{ canhTrai?: boolean; children: React.ReactNode }> = ({ canhTrai, children }) => (
  <div
    style={{
      position: "absolute",
      top: `${TREN * 100}%`,
      left: LE,
      right: LE,
      textAlign: canhTrai ? "left" : "center",
    }}
  >
    {children}
  </div>
);

/**
 * Huy hiệu chứa biểu tượng — nền mờ, viền mảnh, khớp phong cách khung nút của
 * ba khối sơ đồ. Dùng hiệu ứng chuyển động RIÊNG (`hienRaBieuTuong`), tách
 * khỏi `hienDanTruotLen` của chữ xung quanh, để biểu tượng có sức sống hơn.
 */
const HuyHieuBieuTuong: React.FC<{
  bo: BoMau;
  ten: NonNullable<Canh["bieu_tuong"]>;
  co?: number;
  tre?: number;
  nhan_manh_mau?: boolean; // viền và nét biểu tượng tô đỏ — dùng ở nơi CẦN nhấn mạnh
}> = ({ bo, ten, co = 76, tre = 0, nhan_manh_mau }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        ...hienRaBieuTuong(k, fps, tre),
        width: co,
        height: co,
        borderRadius: co * 0.28,
        border: `2px solid ${nhan_manh_mau ? bo.nhan_chinh : "rgba(255,255,255,0.22)"}`,
        background: "rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <BieuTuong ten={ten} bo={bo} co={co * 0.52} nhan_manh={nhan_manh_mau} />
    </div>
  );
};

/** Chuẩn hóa một ý trong `danh_sach`: có thể chỉ là chữ, hoặc kèm biểu tượng/nhấn mạnh. */
const chuanHoaY = (y: YCoBieuTuong) => (typeof y === "string" ? { text: y } : y);

/** Đường kẻ đứt mảnh — thứ duy nhất nằm trong khoảng trống giữa khung. */
const DuongDut: React.FC<{ bo: BoMau }> = ({ bo }) => (
  <div
    style={{
      marginTop: 46,
      borderTop: `2px dashed ${bo.chu_mo}`,
      opacity: 0.45,
      width: 180,
      marginLeft: "auto",
      marginRight: "auto",
    }}
  />
);

// ---------------------------------------------------------------------------
// C1 — Mở đầu. Chữ lớn nhất video. Vài giây đầu quyết định người xem có lướt
// qua hay không, nên chặng này nêu thẳng điều bất ngờ nhất, không rào đón.
// ---------------------------------------------------------------------------
const CanhMoDau: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <KhoiChu>
      {canh.bieu_tuong ? (
        <div style={{ marginBottom: 28, display: "flex", justifyContent: "center" }}>
          <HuyHieuBieuTuong bo={bo} ten={canh.bieu_tuong} nhan_manh_mau={canh.bieu_tuong_nhan_manh} />
        </div>
      ) : null}
      <div style={hienChuSongDong(k, fps)}>
        <Kicker bo={bo} chu={canh.kicker} />
      </div>
      <div style={hienChuSongDong(k, fps, Math.round(fps * 0.12))}>
        <div style={{ fontSize: bo.co_chu.tieu_de_lon, fontWeight: 800, lineHeight: 1.16, color: bo.chu_chinh }}>
          {canh.tieu_de}
        </div>
      </div>
      {canh.doan ? (
        <div style={hienChuSongDong(k, fps, Math.round(fps * 1.1))}>
          <DuongDut bo={bo} />
          <div style={{ marginTop: 40, fontSize: bo.co_chu.doan, fontWeight: 600, lineHeight: 1.45, color: bo.chu_mo }}>
            <ChuSangTheoLoi chu={canh.doan} />
          </div>
        </div>
      ) : null}
    </KhoiChu>
  );
};

// ---------------------------------------------------------------------------
// C2/C3 — Giải thích. Biến thể (b) của thẻ D-01: căn trái, có vạch dọc đỏ
// mảnh chạy dọc mép trái khối chữ. Căn giữa mà chữ nhiều dòng thì rất khó đọc.
// ---------------------------------------------------------------------------
const CanhGiaiThich: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <KhoiChu canhTrai>
      <div style={{ ...hienChuSongDong(k, fps), display: "flex", gap: 34 }}>
        <div style={{ width: 5, background: bo.nhan_chinh, borderRadius: 3, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 4 }}>
            {canh.bieu_tuong ? <HuyHieuBieuTuong bo={bo} ten={canh.bieu_tuong} co={60} nhan_manh_mau={canh.bieu_tuong_nhan_manh} /> : null}
            <div style={{ flex: 1 }}>
              <Kicker bo={bo} chu={canh.kicker} canhTrai />
              <div style={{ fontSize: bo.co_chu.tieu_de, fontWeight: 800, lineHeight: 1.2, color: bo.chu_chinh }}>
                {canh.tieu_de}
              </div>
            </div>
          </div>
          {canh.doan ? (
            <div
              style={{
                ...hienChuSongDong(k, fps, Math.round(fps * 0.75)),
                marginTop: 34,
                fontSize: bo.co_chu.doan,
                fontWeight: 500,
                lineHeight: 1.5,
                color: bo.chu_mo,
              }}
            >
              <ChuSangTheoLoi chu={canh.doan} />
            </div>
          ) : null}
        </div>
      </div>
    </KhoiChu>
  );
};

// ---------------------------------------------------------------------------
// Khối số liệu — số đếm tăng dần + thanh chạy đầy dần, lần lượt từ trên xuống.
// Quy tắc mật độ của D-01: cần nhiều số thì gom hết vào ĐÚNG MỘT màn số liệu
// thay vì rải đều các cảnh.
// ---------------------------------------------------------------------------
const KhoiSoLieu: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  const dong = canh.so_lieu ?? [];
  const lonNhat = Math.max(...dong.map((d) => d.gia_tri), 1);

  return (
    <>
      {dong.map((d, i) => {
        const tien = chayDayDan(k, fps, i);
        const xong = tien >= 1;
        const mau = d.nhan_manh && xong ? bo.nhan_chinh : bo.chu_chinh;
        return (
          <div key={i} style={{ marginTop: i === 0 ? 52 : 44, opacity: tien > 0 ? 1 : 0 }}>
            <div style={{ fontSize: bo.co_chu.kicker, letterSpacing: 2, fontWeight: 600, color: bo.chu_mo }}>
              {d.nhan}
            </div>
            <div style={{ fontSize: bo.co_chu.so_lieu, fontWeight: 800, lineHeight: 1.1, color: mau, marginTop: 6 }}>
              {Math.round(d.gia_tri * tien)}
              <span style={{ fontSize: bo.co_chu.so_lieu * 0.6 }}>{d.don_vi ?? ""}</span>
            </div>
            {/* Thanh ngang dày 8px bo tròn hai đầu, chạy dài ra cùng lúc với số */}
            <div style={{ marginTop: 14, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.12)" }}>
              <div
                style={{
                  height: "100%",
                  borderRadius: 4,
                  background: d.nhan_manh ? bo.nhan_chinh : bo.chu_chinh,
                  width: `${(d.ty_le ?? d.gia_tri / lonNhat) * tien * 100}%`,
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

// ---------------------------------------------------------------------------
// C4 — Điểm nhấn. Chỉ đúng MỘT chỗ, nói thẳng và gọn. Đây là chỗ duy nhất
// màu đỏ được dùng mạnh; giữ đỏ hiếm thì tới đây nó mới đắt (điều kiện ghép
// KB-03 × D-01 ghi ở cả hai thẻ).
// ---------------------------------------------------------------------------
const CanhDiemNhan: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <KhoiChu canhTrai>
      {canh.bieu_tuong ? (
        <div style={{ marginBottom: 22 }}>
          <HuyHieuBieuTuong bo={bo} ten={canh.bieu_tuong} nhan_manh_mau co={64} />
        </div>
      ) : null}
      <div style={hienChuSongDong(k, fps)}>
        <Kicker bo={bo} chu={canh.kicker} canhTrai />
      </div>
      <div style={hienChuSongDong(k, fps, Math.round(fps * 0.12))}>
        <div style={{ fontSize: bo.co_chu.tieu_de_lon, fontWeight: 800, lineHeight: 1.14, color: bo.nhan_chinh }}>
          {canh.tieu_de}
        </div>
      </div>
      {canh.so_lieu?.length ? <KhoiSoLieu bo={bo} canh={canh} /> : null}
    </KhoiChu>
  );
};

// ---------------------------------------------------------------------------
// C5 — Luồng ý kiến. Nêu lý lẽ mạnh nhất của bên kia, không dựng bù nhìn.
// Đây là chỗ phong cách KB-03 ăn điểm tin cậy, nên cảnh này để chữ trắng,
// KHÔNG tô đỏ — đỏ ở đây sẽ biến phần nhường lời thành phần công kích.
// ---------------------------------------------------------------------------
const CanhDanhSach: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <KhoiChu canhTrai>
      <div style={hienChuSongDong(k, fps)}>
        <Kicker bo={bo} chu={canh.kicker} canhTrai />
        <div style={{ fontSize: bo.co_chu.tieu_de, fontWeight: 800, lineHeight: 1.2, color: bo.chu_chinh }}>
          {canh.tieu_de}
        </div>
      </div>
      {(canh.y ?? []).map((yRaw, i) => {
        const y = chuanHoaY(yRaw);
        const tre = Math.round(fps * (0.7 + i * 0.5));
        return (
          <div
            key={i}
            style={{
              ...hienChuSongDong(k, fps, tre),
              display: "flex",
              gap: 24,
              marginTop: i === 0 ? 48 : 30,
              alignItems: y.bieu_tuong ? "center" : "baseline",
            }}
          >
            {/* Nguyên tắc C5: chữ LUÔN trắng, không tô đỏ nội dung — đỏ ở đây sẽ
                biến phần nhường lời thành công kích. `nhan_manh` của từng ý chỉ
                đổi màu VIỀN biểu tượng (khi có), không đụng vào số hay chữ. */}
            {y.bieu_tuong ? (
              <HuyHieuBieuTuong bo={bo} ten={y.bieu_tuong} co={52} tre={tre} nhan_manh_mau={y.nhan_manh} />
            ) : (
              <span style={{ fontSize: bo.co_chu.doan, fontWeight: 800, color: bo.nhan_chinh, minWidth: 46 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            )}
            <span style={{ fontSize: bo.co_chu.doan, fontWeight: 500, lineHeight: 1.44, color: bo.chu_chinh }}>
              {y.text}
            </span>
          </div>
        );
      })}
    </KhoiChu>
  );
};

// ---------------------------------------------------------------------------
// C6 — Hệ quả. Tông trầm hơn: tiêu đề để màu xám sáng chứ không trắng gắt,
// nhường sức nặng cho đoạn văn bên dưới.
// ---------------------------------------------------------------------------
const CanhHeQua: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <KhoiChu canhTrai>
      {canh.bieu_tuong ? (
        <div style={{ marginBottom: 20 }}>
          <HuyHieuBieuTuong bo={bo} ten={canh.bieu_tuong} co={60} nhan_manh_mau={canh.bieu_tuong_nhan_manh} />
        </div>
      ) : null}
      <div style={hienChuSongDong(k, fps)}>
        <Kicker bo={bo} chu={canh.kicker} canhTrai />
      </div>
      <div style={hienChuSongDong(k, fps, Math.round(fps * 0.12))}>
        <div style={{ fontSize: bo.co_chu.tieu_de, fontWeight: 800, lineHeight: 1.2, color: bo.chu_mo }}>
          {canh.tieu_de}
        </div>
      </div>
      {canh.doan ? (
        <div
          style={{
            ...hienChuSongDong(k, fps, Math.round(fps * 0.7)),
            marginTop: 32,
            fontSize: bo.co_chu.tieu_de * 0.72,
            fontWeight: 600,
            lineHeight: 1.42,
            color: bo.chu_chinh,
          }}
        >
          <ChuSangTheoLoi chu={canh.doan} />
        </div>
      ) : null}
    </KhoiChu>
  );
};

// ---------------------------------------------------------------------------
// C7 — Kết. KB-03 kết bằng một CÂU HỎI cần hỏi thêm, không phải một kết luận
// mới. Cảnh này căn giữa và để trống nhiều nhất — chỗ trống là chỗ nghỉ, và
// giọng đọc cũng nghỉ nửa giây trước câu này (cải tiến so với mẫu, điểm (4)
// ô "Ghi chú khi dùng thử" thẻ D-01).
// ---------------------------------------------------------------------------
const CanhKetLuan: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <KhoiChu>
      {canh.bieu_tuong ? (
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
          <HuyHieuBieuTuong bo={bo} ten={canh.bieu_tuong} co={64} nhan_manh_mau={canh.bieu_tuong_nhan_manh} />
        </div>
      ) : null}
      <div style={hienChuSongDong(k, fps)}>
        <Kicker bo={bo} chu={canh.kicker} />
        <DuongDut bo={bo} />
      </div>
      <div style={hienChuSongDong(k, fps, Math.round(fps * 0.16))}>
        <div
          style={{
            marginTop: 54,
            fontSize: bo.co_chu.tieu_de_lon,
            fontWeight: 800,
            lineHeight: 1.18,
            color: bo.chu_chinh,
          }}
        >
          {canh.tieu_de}
        </div>
      </div>
    </KhoiChu>
  );
};

// ---------------------------------------------------------------------------
// Cảnh sơ đồ — kicker + tiêu đề ở trên, vùng vẽ chiếm phần còn lại.
// Dùng chung cho cả ba khối minh họa (so_do, chuoi, luoi).
// ---------------------------------------------------------------------------
const CanhSoDo: React.FC<{ bo: BoMau; canh: Canh; children: React.ReactNode }> = ({ bo, canh, children }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 150,
        left: LE,
        right: LE,
        bottom: 260,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {canh.bieu_tuong ? (
          <div style={{ marginBottom: 18 }}>
            <HuyHieuBieuTuong bo={bo} ten={canh.bieu_tuong} co={56} nhan_manh_mau={canh.bieu_tuong_nhan_manh} />
          </div>
        ) : null}
        <div style={hienChuSongDong(k, fps)}>
          <Kicker bo={bo} chu={canh.kicker} />
        </div>
        <div style={{ ...hienChuSongDong(k, fps, Math.round(fps * 0.12)), marginBottom: 40 }}>
          <div style={{ fontSize: bo.co_chu.tieu_de, fontWeight: 800, lineHeight: 1.18, color: bo.chu_chinh }}>
            {canh.tieu_de}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
};

/** Chọn khối cảnh theo `loai`. Thêm loại mới thì thêm ở cả đây và `kieu_du_lieu.ts`. */
export const KhoiCanh: React.FC<{ bo: BoMau; canh: Canh }> = ({ bo, canh }) => {
  switch (canh.loai) {
    case "mo_dau":
      return <CanhMoDau bo={bo} canh={canh} />;
    case "giai_thich":
      return <CanhGiaiThich bo={bo} canh={canh} />;
    case "so_lieu":
      return (
        <KhoiChu canhTrai>
          <Kicker bo={bo} chu={canh.kicker} canhTrai />
          <div style={{ fontSize: bo.co_chu.tieu_de, fontWeight: 800, color: bo.chu_chinh }}>{canh.tieu_de}</div>
          <KhoiSoLieu bo={bo} canh={canh} />
        </KhoiChu>
      );
    case "diem_nhan":
      return <CanhDiemNhan bo={bo} canh={canh} />;
    case "danh_sach":
      return <CanhDanhSach bo={bo} canh={canh} />;
    case "he_qua":
      return <CanhHeQua bo={bo} canh={canh} />;
    case "ket_luan":
      return <CanhKetLuan bo={bo} canh={canh} />;
    case "so_do":
      return canh.so_do ? (
        <CanhSoDo bo={bo} canh={canh}>
          <SoDoKhoi bo={bo} du_lieu={canh.so_do} />
        </CanhSoDo>
      ) : null;
    case "chuoi":
      return canh.chuoi ? (
        <CanhSoDo bo={bo} canh={canh}>
          <ChuoiMuiTenKhoi bo={bo} du_lieu={canh.chuoi} />
        </CanhSoDo>
      ) : null;
    case "luoi":
      return canh.luoi ? (
        <CanhSoDo bo={bo} canh={canh}>
          <LuoiBieuTuongKhoi bo={bo} du_lieu={canh.luoi} />
        </CanhSoDo>
      ) : null;
  }
};
