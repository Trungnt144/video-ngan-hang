import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { layBoMau, CHUYEN_MAN_GIAY } from "./bo_mau";
import { KhoiCanh } from "./canh/CacKhoiCanh";
import { KhungNen } from "./thanh-phan/KhungNen";
import { PhuDeChayChu } from "./thanh-phan/PhuDeChayChu";
import { NhipLoi } from "./thanh-phan/NhipLoi";
import type { DuLieuVideo } from "./kieu_du_lieu";

/**
 * Video ngắn dọc 1080×1920 — ghép bảy khối cảnh với giọng đọc và phụ đề.
 *
 * Dữ liệu vào là `public/du_lieu_video.json`, do `scripts/chuan_bi_video.mjs`
 * sinh ra từ kịch bản và mốc thời gian giọng đọc. Không sửa file JSON đó bằng
 * tay — sửa `san_pham/<thư mục video>/tai_nguyen/kich_ban/<ten>.canh.json` rồi chạy lại.
 */

/**
 * Chuyển màn bằng chồng mờ trực tiếp ~0,25 giây, KHÔNG đi qua đen.
 * Hai màn cùng nhìn thấy trong vài khung. Ghi nhận "tối đen rồi hiện dần" ở
 * bản thẻ đầu là sai, đã đo lại và sửa — xem "Nhật ký sửa" thẻ D-01.
 */
const ChongMo: React.FC<{ daiKhung: number; children: React.ReactNode }> = ({ daiKhung, children }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mo = Math.round(fps * CHUYEN_MAN_GIAY);
  const opacity = interpolate(k, [0, mo, daiKhung - mo, daiKhung], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

/** Thanh tiến độ đỏ chạy suốt video ở mép trên (26/10/2026, `thanh-phan/NhipLoi.tsx` ghi lý do). */
const ThanhTienDo: React.FC<{ mau: string }> = ({ mau }) => {
  const k = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return <div style={{ position: "absolute", top: 0, left: 0, height: 5, width: `${(100 * k) / Math.max(1, durationInFrames - 1)}%`, background: mau }} />;
};

export const VideoNgan: React.FC<{ duLieu: DuLieuVideo }> = ({ duLieu }) => {
  const { fps } = useVideoConfig();
  const bo = layBoMau((duLieu as DuLieuVideo & { bo_mau?: string }).bo_mau);
  const tong = duLieu.canh.length;

  return (
    <AbsoluteFill style={{ backgroundColor: bo.nen }}>
      <Audio src={staticFile(duLieu.file_tieng)} />

      {duLieu.moc_canh.map((m) => {
        const canh = duLieu.canh.find((c) => c.so === m.so);
        if (!canh) return null;
        const tu = Math.round(m.bat_dau * fps);
        // Cộng thêm phần chồng mờ để màn cũ còn nhìn thấy khi màn mới đã hiện
        const dai = Math.round((m.ket_thuc - m.bat_dau) * fps) + Math.round(fps * CHUYEN_MAN_GIAY);
        // Khoảng lời đọc trong cảnh (khung tính từ đầu cảnh), từ các cụm phụ đề nằm trong cảnh
        const cum = duLieu.phu_de.filter((c) => c.bat_dau >= m.bat_dau - 0.05 && c.bat_dau < m.ket_thuc);
        const nhip = cum.length
          ? { tu: Math.round((cum[0].bat_dau - m.bat_dau) * fps), den: Math.round((cum[cum.length - 1].ket_thuc - m.bat_dau) * fps),
              kyTu: cum.reduce((n, c) => n + c.tu.reduce((x, w) => x + w.length + 1, 0), 0) }
          : { tu: 0, den: dai, kyTu: 1 };
        return (
          <Sequence key={m.so} from={tu} durationInFrames={dai}>
            <ChongMo daiKhung={dai}>
              <NhipLoi.Provider value={nhip}>
                <KhungNen bo={bo} soCanh={m.so} tongCanh={tong} dinhDanh={duLieu.dinh_danh}>
                  <KhoiCanh bo={bo} canh={canh} />
                </KhungNen>
              </NhipLoi.Provider>
            </ChongMo>
          </Sequence>
        );
      })}

      {/* Phụ đề nằm NGOÀI vòng lặp cảnh: nó chạy liên tục theo giọng đọc, không
          bị mờ đi mỗi lần chuyển màn. Đây chính là "hai nhịp chạy song song"
          của D-01 — hình đứng yên lâu, phụ đề đổi mỗi 0,4-0,6 giây. */}
      <PhuDeChayChu bo={bo} cum={duLieu.phu_de} theoCau={duLieu.phu_de_theo === "cau"} />
      <ThanhTienDo mau={bo.nhan_chinh} />
    </AbsoluteFill>
  );
};
