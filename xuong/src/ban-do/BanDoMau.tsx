import * as turf from "@turf/turf";
import maplibregl, { type GeoJSONSource, type Map } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useDelayRender, useVideoConfig } from "remotion";
import tuyenTho from "./tuyen_hn_hp.json";

/**
 * Cảnh mẫu bản đồ: tuyến Hà Nội → Hải Phòng (đường lái xe lấy từ OSRM, đã rút gọn).
 * Nền OpenFreeMap (kiểu "liberty"), không cần khoá. Kỹ thuật theo
 * `.claude/skills/remotion-maps/techniques/maplibre/TECHNIQUE.md`.
 * Render: npx remotion render BanDoMau out/ban_do_mau.mp4 --gl=angle --concurrency=1
 */
const STYLE = "https://tiles.openfreemap.org/styles/liberty";
const tuyen = turf.lineString(tuyenTho as [number, number][]);
const doDai = turf.length(tuyen);
const diem = turf.featureCollection([
  turf.point(tuyenTho[0] as [number, number], { ten: "Hà Nội" }),
  turf.point(tuyenTho[tuyenTho.length - 1] as [number, number], { ten: "Hải Phòng" }),
]);

const cat = (tienDo: number) => turf.lineSliceAlong(tuyen, 0, Math.max(0.001, doDai * Math.min(1, Math.max(0, tienDo))));
const viTri = (tienDo: number) => turf.along(tuyen, Math.max(0.001, doDai * tienDo)).geometry.coordinates as [number, number];

export const BanDoMau: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useCurrentFrame();
  const { delayRender, continueRender } = useDelayRender();
  const { durationInFrames, height, width } = useVideoConfig();
  const [map, setMap] = useState<Map | null>(null);
  const [cho] = useState(() => delayRender("Tải bản đồ"));

  useEffect(() => {
    if (!ref.current) return;
    const m = new maplibregl.Map({
      container: ref.current,
      style: STYLE,
      center: viTri(0.5),
      zoom: 8.6,
      interactive: false,
      attributionControl: false,
      fadeDuration: 0,
      canvasContextAttributes: { preserveDrawingBuffer: true },
    });
    m.on("load", () => {
      m.addSource("vet", { type: "geojson", data: cat(0) });
      m.addLayer({ id: "vet-vien", type: "line", source: "vet", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffffff", "line-width": 16 } });
      m.addLayer({ id: "vet", type: "line", source: "vet", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#e63946", "line-width": 9 } });
      m.addSource("diem", { type: "geojson", data: diem });
      m.addLayer({ id: "diem", type: "circle", source: "diem", paint: { "circle-color": "#0b3d91", "circle-radius": 14, "circle-stroke-color": "#fff", "circle-stroke-width": 5 } });
      m.addLayer({
        id: "nhan",
        type: "symbol",
        source: "diem",
        layout: { "text-field": ["get", "ten"], "text-size": 40, "text-anchor": "top", "text-offset": [0, 0.9], "text-allow-overlap": true, "text-font": ["Noto Sans Bold"] },
        paint: { "text-color": "#111", "text-halo-color": "#fff", "text-halo-width": 4 },
      });
      m.jumpTo({ center: viTri(0.5), zoom: 8.6 });
      m.once("idle", () => {
        setMap(m);
        continueRender(cho);
      });
    });
  }, [continueRender, cho]);

  useEffect(() => {
    if (!map) return;
    const h = delayRender("Khung bản đồ");
    const t = interpolate(frame, [0, durationInFrames - 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const ease = Easing.bezier(0.645, 0.045, 0.355, 1);
    const di = interpolate(t, [0.15, 0.85], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    // toàn cảnh → bám theo điểm di chuyển → toàn cảnh
    const zoom = interpolate(t, [0, 0.15, 0.3, 0.7, 0.85, 1], [8.6, 8.6, 11, 11, 8.6, 8.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
    const k = (zoom - 8.6) / 2.4;
    const giua = viTri(0.5);
    const theo = viTri(di);
    const trungTam: [number, number] = [giua[0] + (theo[0] - giua[0]) * k, giua[1] + (theo[1] - giua[1]) * k];
    (map.getSource("vet") as GeoJSONSource).setData(cat(di));
    map.jumpTo({ center: trungTam, zoom });
    map.once("idle", () => continueRender(h));
    map.triggerRepaint();
  }, [continueRender, delayRender, durationInFrames, frame, map]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#e8eef3" }}>
      <div ref={ref} style={{ height, position: "absolute", width }} />
      <div style={{ position: "absolute", left: 48, bottom: 48, background: "#0b1f3aE6", color: "#fff", font: "600 40px system-ui", padding: "18px 28px", borderRadius: 12 }}>
        Hà Nội → Hải Phòng · 113 km
      </div>
      <div style={{ position: "absolute", right: 24, bottom: 12, font: "20px system-ui", color: "#333" }}>© OpenFreeMap © OpenMapTiles Data from OpenStreetMap</div>
    </AbsoluteFill>
  );
};
