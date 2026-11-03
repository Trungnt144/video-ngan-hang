import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import type { BoMau } from "../bo_mau";
import { LE } from "../bo_mau";
import type { ChuoiMuiTen, LuoiBieuTuong, SoDo } from "../kieu_du_lieu";
import { hienDanTruotLen } from "./chuyen_dong";

/**
 * Ba khối minh họa dạng sơ đồ — bổ sung cho khuôn 7 cảnh khi chữ thuần không
 * đủ dễ hình dung. Trung yêu cầu sau khi xem mẫu tham khảo từ một kênh khác
 * (28/07/2026, khuya) — đây là bản dựng THEO Ý, giữ nguyên tông D-01
 * (đen-trắng-đỏ), KHÔNG sao chép màu sắc của mẫu tham khảo (mẫu đó dùng
 * xanh tím phát sáng, thuộc phong cách khác chưa qua quy trình nghiên cứu
 * ở `11_hoc_phong_cach_tu_mau.md`).
 *
 * Cố ý KHÔNG dùng logo thương hiệu thật ở lưới biểu tượng — dùng huy hiệu
 * chữ viết tắt tự vẽ, tránh vướng bản quyền/nhận diện của bên khác
 * (`13_ban_quyen_va_bao_mat.md`).
 */

const VUNG_VE = { cao: 760 }; // chiều cao vùng vẽ, dưới kicker/tiêu đề

// ---------------------------------------------------------------------------
// Sơ đồ khối nối dây
// ---------------------------------------------------------------------------
export const SoDoKhoi: React.FC<{ bo: BoMau; du_lieu: SoDo }> = ({ bo, du_lieu }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rong = 1080 - LE * 2;
  const cao = VUNG_VE.cao;

  const viTri = (id: string) => du_lieu.nut.find((n) => n.id === id);
  const toaDo = (n: { x: number; y: number }) => ({ x: n.x * rong, y: n.y * cao });

  return (
    <div style={{ position: "relative", width: rong, height: cao }}>
      <svg width={rong} height={cao} style={{ position: "absolute", top: 0, left: 0 }}>
        {du_lieu.noi.map((n, i) => {
          const a = viTri(n.tu);
          const b = viTri(n.den);
          if (!a || !b) return null;
          const p1 = toaDo(a);
          const p2 = toaDo(b);
          const tre = Math.round(fps * (0.5 + i * 0.18));
          const mo = hienDanTruotLen(k, fps, tre).opacity;
          // Đường cong nhẹ, không phải đường thẳng cứng — mềm hơn cho mắt
          const giua = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 - 26 };
          return (
            <path
              key={i}
              d={`M ${p1.x} ${p1.y} Q ${giua.x} ${giua.y} ${p2.x} ${p2.y}`}
              stroke={bo.chu_mo}
              strokeWidth={2.5}
              fill="none"
              opacity={mo * 0.7}
            />
          );
        })}
      </svg>

      {du_lieu.nut.map((n, i) => {
        const tre = Math.round(fps * (0.15 + i * 0.18));
        const dong = hienDanTruotLen(k, fps, tre);
        const mau = n.nhan_manh ? bo.nhan_chinh : bo.chu_chinh;
        return (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: n.x * rong,
              top: n.y * cao,
              transform: "translate(-50%, -50%)",
              translate: dong.translate,
              opacity: dong.opacity,
              width: 300,
              padding: "22px 26px",
              borderRadius: 14,
              border: `2px solid ${n.nhan_manh ? bo.nhan_chinh : "rgba(255,255,255,0.22)"}`,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {n.nhan ? (
              <div style={{ fontSize: bo.co_chu.kicker * 0.75, fontWeight: 700, color: mau, marginBottom: 6 }}>
                {n.nhan}
              </div>
            ) : null}
            <div style={{ fontSize: bo.co_chu.doan, fontWeight: 800, color: bo.chu_chinh, lineHeight: 1.25 }}>
              {n.tieu_de}
            </div>
            {n.phu ? (
              <div style={{ fontSize: bo.co_chu.doan * 0.62, fontWeight: 500, color: bo.chu_mo, marginTop: 4 }}>
                {n.phu}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Chuỗi mũi tên A → B → C — một tiến trình có thứ tự
// ---------------------------------------------------------------------------
export const ChuoiMuiTenKhoi: React.FC<{ bo: BoMau; du_lieu: ChuoiMuiTen }> = ({ bo, du_lieu }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  const doc = du_lieu.mat_xich.length <= 3; // ít mắt xích thì xếp ngang, nhiều thì xếp dọc

  return (
    <div
      style={{
        display: "flex",
        flexDirection: doc ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: doc ? 0 : 8,
        flexWrap: "wrap",
      }}
    >
      {du_lieu.mat_xich.map((m, i) => {
        const tre = Math.round(fps * (0.2 + i * 0.4));
        const dong = hienDanTruotLen(k, fps, tre);
        const mau = m.nhan_manh ? bo.nhan_chinh : bo.chu_chinh;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                opacity: dong.opacity,
                translate: dong.translate,
                textAlign: "center",
                padding: "26px 22px",
                minWidth: 180,
                borderRadius: 14,
                border: `2px solid ${m.nhan_manh ? bo.nhan_chinh : "rgba(255,255,255,0.22)"}`,
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontSize: bo.co_chu.doan, fontWeight: 800, color: mau }}>{m.nhan}</div>
              {m.phu ? (
                <div style={{ fontSize: bo.co_chu.doan * 0.58, fontWeight: 500, color: bo.chu_mo, marginTop: 6 }}>
                  {m.phu}
                </div>
              ) : null}
            </div>
            {i < du_lieu.mat_xich.length - 1 ? (
              <div
                style={{
                  opacity: hienDanTruotLen(k, fps, tre + Math.round(fps * 0.2)).opacity,
                  fontSize: 40,
                  fontWeight: 300,
                  color: bo.chu_mo,
                  padding: doc ? "0 14px" : "6px 0",
                  transform: doc ? "none" : "rotate(90deg)",
                }}
              >
                →
              </div>
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Lưới biểu tượng — liệt kê nhiều mục cùng loại bằng huy hiệu chữ viết tắt
// ---------------------------------------------------------------------------
export const LuoiBieuTuongKhoi: React.FC<{ bo: BoMau; du_lieu: LuoiBieuTuong }> = ({ bo, du_lieu }) => {
  const k = useCurrentFrame();
  const { fps } = useVideoConfig();
  const soCot = du_lieu.muc.length <= 2 ? du_lieu.muc.length : 3;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${soCot}, 1fr)`,
        gap: 22,
        width: "100%",
      }}
    >
      {du_lieu.muc.map((m, i) => {
        const tre = Math.round(fps * (0.2 + i * 0.15));
        const dong = hienDanTruotLen(k, fps, tre);
        const vietTat = m.chu_viet_tat ?? m.nhan.slice(0, 2).toUpperCase();
        const mau = m.nhan_manh ? bo.nhan_chinh : bo.chu_chinh;
        return (
          <div
            key={i}
            style={{
              opacity: dong.opacity,
              translate: dong.translate,
              textAlign: "center",
              padding: "24px 12px",
              borderRadius: 16,
              border: `2px solid ${m.nhan_manh ? bo.nhan_chinh : "rgba(255,255,255,0.18)"}`,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            <div
              style={{
                width: 84,
                height: 84,
                margin: "0 auto 16px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                fontWeight: 800,
                color: bo.nen,
              }}
            >
              {vietTat}
            </div>
            <div style={{ fontSize: bo.co_chu.doan * 0.62, fontWeight: 700, color: mau }}>{m.nhan}</div>
          </div>
        );
      })}
    </div>
  );
};
