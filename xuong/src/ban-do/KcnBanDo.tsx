import * as turf from "@turf/turf";
import type { GeoJSONSource, Map } from "maplibre-gl";
import { AbsoluteFill, Easing, interpolate, useVideoConfig } from "remotion";
import {
  CANG_LACH_HUYEN, HA_NOI, KCN, SAN_BAY_NOI_BAI, cat, diemKhu, duongNoiKhu, ghiCong, mem, nhaXuong, nho, ranhGioi, useBanDo, type Nen,
} from "./KcnChung";

/**
 * Bốn cảnh bản đồ mẫu cho kênh Chuyện làm dự án. Mọi khu, ranh giới, nhà xưởng, số liệu là GIẢ ĐỊNH minh hoạ.
 * Render (trong xuong/): npx remotion render src/ban-do/KcnIndex.ts KcnKetNoi out/kcn/ket_noi.mp4 --gl=angle --concurrency=1
 */
type P = { nen?: Nen };

const Khung: React.FC<{ tieuDe: string; phu?: string; nen: Nen }> = ({ tieuDe, phu, nen }) => {
  const { height, width } = useVideoConfig();
  return (
    <>
      <div style={{ position: "absolute", left: 48, bottom: 48, background: "#0b1f3aE6", color: "#fff", font: "600 40px system-ui", padding: "18px 28px", borderRadius: 12, maxWidth: width - 96 }}>
        {tieuDe}
        {phu && <div style={{ font: "400 26px system-ui", opacity: 0.85, marginTop: 4 }}>{phu}</div>}
      </div>
      <div style={{ position: "absolute", right: 24, top: 18, font: "20px system-ui", color: nen === "liberty" ? "#333" : "#fff", textShadow: nen === "liberty" ? "none" : "0 0 4px #000" }}>
        Vị trí và số liệu minh hoạ (giả định)
      </div>
      <div style={{ position: "absolute", right: 24, bottom: 12, font: "20px system-ui", color: nen === "liberty" ? "#333" : "#fff", textShadow: nen === "liberty" ? "none" : "0 0 4px #000", maxWidth: width - 120, textAlign: "right" }}>{ghiCong(nen)}</div>
      <div style={{ display: "none" }}>{height}</div>
    </>
  );
};

const nhanLop = (m: Map, id: string, src: string, co = 34) =>
  m.addLayer({
    id,
    type: "symbol",
    source: src,
    layout: { "text-field": ["get", "nhan"], "text-size": co, "text-anchor": "top", "text-offset": [0, 0.9], "text-max-width": 30, "text-allow-overlap": true, "text-font": ["Noto Sans Bold"] },
    paint: { "text-color": "#111", "text-halo-color": "#fff", "text-halo-width": 4 },
  });

const kmChim = (a: [number, number], b: [number, number]) => Math.round(turf.distance(a, b));
const duongThang = (a: [number, number], b: [number, number], tienDo: number) => {
  const d = turf.lineString([a, b]);
  const L = turf.length(d);
  return turf.lineSliceAlong(d, 0, Math.max(0.001, L * Math.min(1, Math.max(0, tienDo))));
};

/** 1. Kết nối hạ tầng: từ KCN tới sân bay, cảng, cao tốc, kèm khoảng cách. */
export const KcnKetNoi: React.FC<P> = ({ nen = "liberty" }) => {
  const kNB = kmChim(KCN, SAN_BAY_NOI_BAI);
  const kCang = kmChim(KCN, CANG_LACH_HUYEN);
  const ref = useBanDo({
    nen,
    khoiTao: { center: [106.3, 21.0], zoom: 9.6 },
    setup: (m) => {
      m.addSource("noi1", { type: "geojson", data: duongThang(KCN, SAN_BAY_NOI_BAI, 0) });
      m.addSource("noi2", { type: "geojson", data: duongThang(KCN, CANG_LACH_HUYEN, 0) });
      m.addSource("tuyen", { type: "geojson", data: cat(0) });
      m.addLayer({ id: "tuyen-vien", type: "line", source: "tuyen", layout: { "line-cap": "round" }, paint: { "line-color": "#fff", "line-width": 14 } });
      m.addLayer({ id: "tuyen", type: "line", source: "tuyen", layout: { "line-cap": "round" }, paint: { "line-color": "#e63946", "line-width": 8 } });
      for (const [id, mau] of [["noi1", "#0b3d91"], ["noi2", "#0b3d91"]] as const) {
        m.addLayer({ id: id + "-vien", type: "line", source: id, paint: { "line-color": "#fff", "line-width": 11 } });
        m.addLayer({ id, type: "line", source: id, paint: { "line-color": mau, "line-width": 6, "line-dasharray": [2, 1.2] } });
      }
      m.addSource("diem", {
        type: "geojson",
        data: turf.featureCollection([
          turf.point(KCN, { nhan: "KCN mẫu", mau: "#e8590c" }),
          turf.point(SAN_BAY_NOI_BAI, { nhan: `Sân bay Nội Bài · ${kNB} km`, mau: "#0b3d91" }),
          turf.point(CANG_LACH_HUYEN, { nhan: `Cảng Lạch Huyện · ${kCang} km`, mau: "#0b3d91" }),
          turf.point(HA_NOI, { nhan: "Hà Nội", mau: "#555" }),
        ]),
      });
      m.addLayer({ id: "diem", type: "circle", source: "diem", paint: { "circle-color": ["get", "mau"], "circle-radius": 14, "circle-stroke-color": "#fff", "circle-stroke-width": 5 } });
      nhanLop(m, "nhan", "diem");
    },
    capNhat: (m, t) => {
      const e = Easing.bezier(0.645, 0.045, 0.355, 1);
      (m.getSource("noi1") as GeoJSONSource).setData(duongThang(KCN, SAN_BAY_NOI_BAI, e(nho(t, 0.1, 0.35))));
      (m.getSource("noi2") as GeoJSONSource).setData(duongThang(KCN, CANG_LACH_HUYEN, e(nho(t, 0.35, 0.6))));
      (m.getSource("tuyen") as GeoJSONSource).setData(cat(e(nho(t, 0.6, 0.9))));
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#e8eef3" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <Khung nen={nen} tieuDe={`KCN mẫu: ${kNB} km tới sân bay, ${kCang} km tới cảng`} phu="Đường chim bay (nét đứt) và cao tốc Hà Nội – Hải Phòng (nét đỏ)" />
    </AbsoluteFill>
  );
};

/** 2. Bay từ toàn quốc xuống một khu, nghiêng 3D, nhà xưởng nổi khối. */
export const KcnBayXuong: React.FC<P> = ({ nen = "liberty" }) => {
  const ref = useBanDo({
    nen,
    khoiTao: { center: [106.0, 16.3], zoom: 5.2 },
    setup: (m) => {
      m.addSource("ranh", { type: "geojson", data: turf.polygon([ranhGioi()]) });
      m.addSource("xuong", { type: "geojson", data: nhaXuong() });
      m.addSource("duong", { type: "geojson", data: duongNoiKhu() });
      m.addLayer({ id: "ranh-nen", type: "fill", source: "ranh", paint: { "fill-color": "#ffb703", "fill-opacity": 0 } });
      m.addLayer({ id: "duong", type: "line", source: "duong", paint: { "line-color": "#fff", "line-width": 4, "line-opacity": 0 } });
      m.addLayer({
        id: "xuong",
        type: "fill-extrusion",
        source: "xuong",
        paint: {
          "fill-extrusion-color": ["match", ["get", "mau"], 0, "#e9ecef", 1, "#4dabf7", "#f4a261"],
          "fill-extrusion-height": ["*", ["get", "cao"], 0],
          "fill-extrusion-opacity": 0.95,
        },
      });
      m.addLayer({ id: "ranh-vien", type: "line", source: "ranh", paint: { "line-color": "#e8590c", "line-width": 6, "line-opacity": 0 } });
    },
    capNhat: (m, t) => {
      const e = Easing.bezier(0.45, 0, 0.2, 1);
      const bay = e(nho(t, 0, 0.8));
      // zoom nội suy theo logarit để tốc độ nhìn đều; tâm dịch nhanh hơn zoom nên khu luôn nằm gần giữa khung
      const zoom = 5.2 + (13.4 - 5.2) * bay;
      const wTam = Math.pow(bay, 0.6);
      const center: [number, number] = [106.0 + (KCN[0] - 106.0) * wTam, 16.3 + (KCN[1] - 16.3) * wTam];
      const nghieng = interpolate(bay, [0.35, 1], [0, 58], { extrapolateLeft: "clamp" });
      const xoay = interpolate(bay, [0.35, 1], [0, -28], { extrapolateLeft: "clamp" });
      m.jumpTo({ center, zoom, pitch: nghieng, bearing: xoay });
      const hien = mem(nho(t, 0.7, 0.88));
      const noi = mem(nho(t, 0.82, 1));
      m.setPaintProperty("ranh-nen", "fill-opacity", 0.3 * hien);
      m.setPaintProperty("ranh-vien", "line-opacity", hien);
      m.setPaintProperty("duong", "line-opacity", hien);
      m.setPaintProperty("xuong", "fill-extrusion-height", ["*", ["get", "cao"], 1.5 * noi]);
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#e8eef3" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <Khung nen={nen} tieuDe="Từ toàn quốc xuống một khu công nghiệp" phu="Khối nổi là nhà xưởng giả định, chiều cao phóng đại 1,5 lần" />
    </AbsoluteFill>
  );
};

/** 3. Ranh giới khu: vẽ viền, tô vùng, đường nội khu, diện tích. */
export const KcnRanhGioi: React.FC<P> = ({ nen = "ve_tinh" }) => {
  const ref = useBanDo({
    nen,
    khoiTao: { center: KCN, zoom: 13.5, bearing: 0 },
    setup: (m) => {
      const vong = turf.lineString(ranhGioi());
      m.addSource("vien", { type: "geojson", data: turf.lineSliceAlong(vong, 0, 0.001) });
      m.addSource("nen", { type: "geojson", data: turf.polygon([ranhGioi()]) });
      m.addSource("duong", { type: "geojson", data: duongNoiKhu() });
      m.addSource("nhan", { type: "geojson", data: turf.point(diemKhu(0, 0), { nhan: "300 ha (giả định)" }) });
      m.addLayer({ id: "nen", type: "fill", source: "nen", paint: { "fill-color": "#ffb703", "fill-opacity": 0 } });
      m.addLayer({ id: "duong", type: "line", source: "duong", paint: { "line-color": "#fff", "line-width": 3, "line-opacity": 0 } });
      m.addLayer({ id: "vien-bong", type: "line", source: "vien", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#000", "line-opacity": 0.5, "line-width": 14 } });
      m.addLayer({ id: "vien", type: "line", source: "vien", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffb703", "line-width": 8 } });
      m.addLayer({
        id: "nhan",
        type: "symbol",
        source: "nhan",
        layout: { "text-field": ["get", "nhan"], "text-size": 56, "text-allow-overlap": true, "text-font": ["Noto Sans Bold"] },
        paint: { "text-color": "#fff", "text-halo-color": "#0b1f3a", "text-halo-width": 5, "text-opacity": 0 },
      });
    },
    capNhat: (m, t) => {
      const vong = turf.lineString(ranhGioi());
      const L = turf.length(vong);
      const e = Easing.bezier(0.45, 0, 0.2, 1);
      (m.getSource("vien") as GeoJSONSource).setData(turf.lineSliceAlong(vong, 0, Math.max(0.001, L * e(nho(t, 0.1, 0.6)))));
      m.setPaintProperty("nen", "fill-opacity", 0.28 * mem(nho(t, 0.6, 0.75)));
      m.setPaintProperty("duong", "line-opacity", mem(nho(t, 0.7, 0.85)));
      m.setPaintProperty("nhan", "text-opacity", mem(nho(t, 0.8, 0.95)));
      m.setZoom(13.5 + 0.35 * t);
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#222" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <Khung nen={nen} tieuDe="Ranh giới khu công nghiệp" phu="Hình chữ nhật 2,0 × 1,5 km, 15 lô, đường nội khu theo lưới" />
    </AbsoluteFill>
  );
};

/** 4. So sánh nhiều KCN trên bản đồ: vòng tròn theo diện tích. */
export const KcnSoSanh: React.FC<P> = ({ nen = "liberty" }) => {
  const dsKhu = [
    { ten: "KCN A", ha: 320, lap: 85, p: KCN },
    { ten: "KCN B", ha: 180, lap: 62, p: [105.95, 21.05] as [number, number] },
    { ten: "KCN C", ha: 450, lap: 40, p: [106.62, 21.02] as [number, number] },
    { ten: "KCN D", ha: 240, lap: 93, p: [106.5, 20.7] as [number, number] },
  ];
  const ref = useBanDo({
    nen,
    khoiTao: { center: [106.3, 20.9], zoom: 9.2 },
    setup: (m) => {
      m.addSource("khu", {
        type: "geojson",
        data: turf.featureCollection(dsKhu.map((k) => turf.point(k.p, { nhan: `${k.ten}\n${k.ha} ha · lấp đầy ${k.lap}%`, ha: k.ha, lap: k.lap, hien: 0 }))),
      });
      m.addLayer({
        id: "khu",
        type: "circle",
        source: "khu",
        paint: {
          "circle-radius": ["*", ["sqrt", ["get", "ha"]], ["get", "hien"]],
          "circle-color": ["interpolate", ["linear"], ["get", "lap"], 40, "#e63946", 70, "#f4a261", 95, "#2a9d8f"],
          "circle-opacity": 0.72,
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 4,
        },
      });
      m.addLayer({
        id: "nhan",
        type: "symbol",
        source: "khu",
        layout: { "text-field": ["get", "nhan"], "text-size": 32, "text-anchor": "top", "text-offset": [0, 2.9], "text-max-width": 30, "text-allow-overlap": true, "text-font": ["Noto Sans Bold"] },
        paint: { "text-color": "#111", "text-halo-color": "#fff", "text-halo-width": 4, "text-opacity": 0 },
      });
    },
    capNhat: (m, t) => {
      const src = m.getSource("khu") as GeoJSONSource;
      src.setData(
        turf.featureCollection(dsKhu.map((k, i) => turf.point(k.p, { nhan: `${k.ten}\n${k.ha} ha · lấp đầy ${k.lap}%`, ha: k.ha, lap: k.lap, hien: 3.4 * mem(nho(t, 0.1 + i * 0.15, 0.3 + i * 0.15)) }))),
      );
      m.setPaintProperty("nhan", "text-opacity", mem(nho(t, 0.65, 0.8)));
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#e8eef3" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <Khung nen={nen} tieuDe="So sánh bốn khu công nghiệp trong vùng" phu="Diện tích vòng tròn theo ha; màu theo tỷ lệ lấp đầy (đỏ thấp, xanh cao)" />
    </AbsoluteFill>
  );
};

/** 5. Cảnh vùng Bắc Ninh – Hải Phòng: nền Sentinel-2 hoặc nền vector, cùng một chuyển động để so sánh. */
export const KcnVung: React.FC<P> = ({ nen = "sentinel2" }) => {
  const kNB = kmChim(KCN, SAN_BAY_NOI_BAI);
  const kCang = kmChim(KCN, CANG_LACH_HUYEN);
  const sang = nen !== "liberty";
  const ref = useBanDo({
    nen,
    khoiTao: { center: [106.3, 21.0], zoom: 8.6 },
    setup: (m) => {
      m.addSource("tuyen", { type: "geojson", data: cat(0) });
      m.addLayer({ id: "tuyen-vien", type: "line", source: "tuyen", layout: { "line-cap": "round" }, paint: { "line-color": sang ? "#000" : "#fff", "line-opacity": sang ? 0.5 : 1, "line-width": 14 } });
      m.addLayer({ id: "tuyen", type: "line", source: "tuyen", layout: { "line-cap": "round" }, paint: { "line-color": "#ffb703", "line-width": 8 } });
      m.addSource("diem", {
        type: "geojson",
        data: turf.featureCollection([
          turf.point(KCN, { nhan: "KCN mẫu" }),
          turf.point(SAN_BAY_NOI_BAI, { nhan: `Sân bay Nội Bài · ${kNB} km` }),
          turf.point(CANG_LACH_HUYEN, { nhan: `Cảng Lạch Huyện · ${kCang} km` }),
          turf.point(HA_NOI, { nhan: "Hà Nội" }),
        ]),
      });
      m.addLayer({ id: "diem", type: "circle", source: "diem", paint: { "circle-color": "#e8590c", "circle-radius": 13, "circle-stroke-color": "#fff", "circle-stroke-width": 5 } });
      m.addLayer({
        id: "nhan",
        type: "symbol",
        source: "diem",
        layout: { "text-field": ["get", "nhan"], "text-size": 34, "text-anchor": "top", "text-offset": [0, 0.9], "text-max-width": 30, "text-allow-overlap": true, "text-font": ["Noto Sans Bold"] },
        paint: { "text-color": sang ? "#fff" : "#111", "text-halo-color": sang ? "#0b1f3a" : "#fff", "text-halo-width": 4 },
      });
    },
    capNhat: (m, t) => {
      const e = Easing.bezier(0.645, 0.045, 0.355, 1);
      (m.getSource("tuyen") as GeoJSONSource).setData(cat(e(nho(t, 0.15, 0.7))));
      const z = e(nho(t, 0.1, 1));
      m.jumpTo({ center: [106.3 + (KCN[0] - 106.3) * z, 21.0 + (KCN[1] - 21.0) * z], zoom: 8.6 + 2.4 * z });
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#222" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <Khung nen={nen} tieuDe="Vùng Hà Nội – Bắc Ninh – Hải Phòng" phu={sang ? "Nền ảnh Sentinel-2 năm 2016 (10 m mỗi điểm ảnh)" : "Nền bản đồ vector OpenFreeMap"} />
    </AbsoluteFill>
  );
};
