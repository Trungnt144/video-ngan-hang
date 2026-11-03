import * as turf from "@turf/turf";
import maplibregl, { type Map, type StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { staticFile, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import tuyenTho from "./tuyen_hn_hp.json";

/**
 * Phần dùng chung của các cảnh bản đồ cho kênh Chuyện làm dự án (tiền tố Kcn).
 * Kỹ thuật theo `.claude/skills/remotion-maps/techniques/maplibre/TECHNIQUE.md`.
 * Toạ độ KCN, ranh giới, nhà xưởng đều là GIẢ ĐỊNH minh hoạ, không phải một khu có thật.
 */
export const NEN_LIBERTY = "https://tiles.openfreemap.org/styles/liberty";
export const NEN_VE_TINH: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    anh: {
      type: "raster",
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [{ id: "anh", type: "raster", source: "anh" }],
};
/** Nền Sentinel-2 đọc tile và phông nhãn đã tải sẵn trong public/ (xem public/tiles/s2_2016/README.md), không gọi mạng. */
const dauPublic = (duong: string) => window.location.origin + staticFile(duong + "/x").replace(/x$/, "");
export const nenSentinel2 = (): StyleSpecification => ({
  version: 8,
  glyphs: dauPublic("fonts") + "{fontstack}/{range}.pbf",
  sources: {
    anh: {
      type: "raster",
      tiles: [dauPublic("tiles/s2_2016") + "{z}/{x}/{y}.jpg"],
      tileSize: 256,
      maxzoom: 13,
    },
  },
  layers: [{ id: "anh", type: "raster", source: "anh" }],
});
export type Nen = "liberty" | "ve_tinh" | "sentinel2";
export const ghiCong = (nen: Nen) =>
  nen === "liberty"
    ? "© OpenFreeMap © OpenMapTiles Data from OpenStreetMap"
    : nen === "sentinel2"
      ? "EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016), CC BY 4.0"
      : "Imagery © Esri, Maxar, Earthstar Geographics";

// tuyến cao tốc Hà Nội → Hải Phòng (đường lái xe OSRM đã rút gọn), dùng làm trục kết nối
export const tuyen = turf.lineString(tuyenTho as [number, number][]);
export const doDaiTuyen = turf.length(tuyen);
export const cat = (tienDo: number) => turf.lineSliceAlong(tuyen, 0, Math.max(0.001, doDaiTuyen * Math.min(1, Math.max(0, tienDo))));

type Toa = [number, number];
const lech = (g: Toa, dxKm: number, dyKm: number): Toa => [g[0] + dxKm / (111.32 * Math.cos((g[1] * Math.PI) / 180)), g[1] + dyKm / 110.574];

// KCN mẫu: cách tuyến cao tốc 3 km về phía bắc, tại 55% chiều dài tuyến (giả định)
export const KCN: Toa = lech(turf.along(tuyen, doDaiTuyen * 0.55).geometry.coordinates as Toa, 0, 3);
export const SAN_BAY_NOI_BAI: Toa = [105.8067, 21.2187];
export const CANG_LACH_HUYEN: Toa = [106.83, 20.8];
export const HA_NOI: Toa = [105.834196, 21.027798];

const GOC = (20 * Math.PI) / 180;
/** Điểm trong hệ toạ độ khu (km) quay 20 độ, quanh tâm KCN. */
export const diemKhu = (dx: number, dy: number): Toa => lech(KCN, dx * Math.cos(GOC) - dy * Math.sin(GOC), dx * Math.sin(GOC) + dy * Math.cos(GOC));

/** Ranh giới hình chữ nhật 2,0 × 1,5 km = 300 ha. */
export const ranhGioi = (): Toa[] => [diemKhu(-1, -0.75), diemKhu(1, -0.75), diemKhu(1, 0.75), diemKhu(-1, 0.75), diemKhu(-1, -0.75)];

/** Nhà xưởng giả định: lưới 5 × 3 lô, mỗi lô một khối cao 12–32 m. */
export const nhaXuong = (): GeoJSON.FeatureCollection => {
  const cao = [14, 22, 18, 30, 12, 26, 16, 32, 20, 14, 28, 18, 24, 12, 22];
  const feats: GeoJSON.Feature[] = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      const cx = -0.8 + i * 0.4;
      const cy = -0.5 + j * 0.5;
      const w = 0.15;
      const h = 0.17;
      const ring = [diemKhu(cx - w, cy - h), diemKhu(cx + w, cy - h), diemKhu(cx + w, cy + h), diemKhu(cx - w, cy + h), diemKhu(cx - w, cy - h)];
      feats.push({ type: "Feature", properties: { cao: cao[i * 3 + j], mau: (i + j) % 3 }, geometry: { type: "Polygon", coordinates: [ring] } });
    }
  }
  return { type: "FeatureCollection", features: feats };
};

/** Đường nội khu giữa các lô. */
export const duongNoiKhu = (): GeoJSON.FeatureCollection => {
  const feats: GeoJSON.Feature[] = [];
  for (let i = 0; i <= 5; i++) feats.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [diemKhu(-1 + i * 0.4, -0.75), diemKhu(-1 + i * 0.4, 0.75)] } });
  for (let j = 0; j <= 3; j++) feats.push({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: [diemKhu(-1, -0.75 + j * 0.5), diemKhu(1, -0.75 + j * 0.5)] } });
  return { type: "FeatureCollection", features: feats };
};

type TuyChon = {
  nen: Nen;
  khoiTao: { center: Toa; zoom: number; pitch?: number; bearing?: number };
  setup: (m: Map) => void;
  capNhat: (m: Map, t: number) => void;
};

/** Dựng bản đồ MapLibre theo khung hình Remotion. t chạy 0 → 1 trong suốt cảnh. */
export const useBanDo = (tuyChon: TuyChon) => {
  const ref = useRef<HTMLDivElement>(null);
  const tc = useRef(tuyChon);
  tc.current = tuyChon;
  const frame = useCurrentFrame();
  const { delayRender, continueRender } = useDelayRender();
  const { durationInFrames } = useVideoConfig();
  const [map, setMap] = useState<Map | null>(null);
  const [cho] = useState(() => delayRender("Tải bản đồ"));

  useEffect(() => {
    if (!ref.current) return;
    const k = tc.current.khoiTao;
    const m = new maplibregl.Map({
      container: ref.current,
      style: tc.current.nen === "liberty" ? NEN_LIBERTY : tc.current.nen === "sentinel2" ? nenSentinel2() : NEN_VE_TINH,
      center: k.center,
      zoom: k.zoom,
      pitch: k.pitch ?? 0,
      bearing: k.bearing ?? 0,
      maxPitch: 85,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    m.on("load", () => {
      // ẩn mọi nhãn của nền (tên đơn vị hành chính cũ, tiếng Anh, số hiệu đường); chỉ giữ nhãn do cảnh tự thêm
      for (const l of m.getStyle().layers) if (l.type === "symbol") m.setLayoutProperty(l.id, "visibility", "none");
      tc.current.setup(m);
      tc.current.capNhat(m, 0);
      m.once("idle", () => {
        setMap(m);
        continueRender(cho);
      });
    });
  }, [continueRender, cho]);

  useEffect(() => {
    if (!map) return;
    const h = delayRender("Khung bản đồ");
    tc.current.capNhat(map, durationInFrames > 1 ? frame / (durationInFrames - 1) : 0);
    map.once("idle", () => continueRender(h));
    map.triggerRepaint();
  }, [continueRender, delayRender, durationInFrames, frame, map]);

  return ref;
};

export const nho = (v: number, a: number, b: number) => Math.min(1, Math.max(0, (v - a) / (b - a)));
export const mem = (x: number) => x * x * (3 - 2 * x);
