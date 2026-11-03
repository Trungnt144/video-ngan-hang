import * as turf from "@turf/turf";
import type { Map } from "maplibre-gl";
import { AbsoluteFill, Easing, interpolate } from "remotion";
import { KCN, duongNoiKhu, ghiCong, mem, nhaXuong, nho, ranhGioi, useBanDo, type Nen } from "./MauChung";

/**
 * Cảnh bản đồ cho ba video mẫu KCN (02/11/2026). Không có hộp chữ: phụ đề ghép sau bằng ffmpeg.
 * Mọi khu, ranh giới, nhà xưởng là GIẢ ĐỊNH minh hoạ. Ghi công nền đặt góc trên phải.
 */
type P = { giay: number };

const GhiCong: React.FC<{ nen: Nen; mau: string; bong: string; phu?: string }> = ({ nen, mau, bong, phu }) => (
  <div style={{ position: "absolute", right: 28, top: 22, textAlign: "right", font: "500 21px 'Be Vietnam Pro', system-ui", color: mau, textShadow: bong, maxWidth: 1100 }}>
    {ghiCong(nen)}
    {phu && <div style={{ marginTop: 4, opacity: 0.9 }}>{phu}</div>}
  </div>
);

const nhanTen = (m: Map, diem: [number, number, string][], chu: string, vien: string, co = 34) => {
  m.addSource("ten", { type: "geojson", data: turf.featureCollection(diem.map(([x, y, n]) => turf.point([x, y], { nhan: n }))) });
  m.addLayer({ id: "ten-cham", type: "circle", source: "ten", paint: { "circle-color": chu, "circle-radius": 7, "circle-stroke-color": vien, "circle-stroke-width": 3, "circle-opacity": 0, "circle-stroke-opacity": 0 } });
  m.addLayer({
    id: "ten",
    type: "symbol",
    source: "ten",
    layout: { "text-field": ["get", "nhan"], "text-size": co, "text-anchor": "left", "text-offset": [0.7, 0], "text-allow-overlap": true, "text-font": ["Noto Sans Bold"] },
    paint: { "text-color": chu, "text-halo-color": vien, "text-halo-width": 3, "text-opacity": 0 },
  });
};
const hienTen = (m: Map, a: number) => {
  m.setPaintProperty("ten", "text-opacity", a);
  m.setPaintProperty("ten-cham", "circle-opacity", a);
  m.setPaintProperty("ten-cham", "circle-stroke-opacity", a);
};
const THANH_PHO: [number, number, string][] = [
  [105.834196, 21.027798, "Hà Nội"],
  [106.6881, 20.8449, "Hải Phòng"],
];

/** Nhãn chủ quyền ở khung toàn quốc: hiện đầu cảnh, tắt dần khi bay xuống. */
const QUAN_DAO: [number, number, string][] = [
  [112.0, 16.5, "Quần đảo Hoàng Sa (Việt Nam)"],
  [114.2, 10.0, "Quần đảo Trường Sa (Việt Nam)"],
];
const themQuanDao = (m: Map, chu: string, vien: string) => {
  m.addSource("qd", { type: "geojson", data: turf.featureCollection(QUAN_DAO.map(([x, y, n]) => turf.point([x, y], { nhan: n }))) });
  m.addLayer({
    id: "qd",
    type: "symbol",
    source: "qd",
    layout: { "text-field": ["get", "nhan"], "text-size": 26, "text-allow-overlap": true, "text-max-width": 40, "text-font": ["Noto Sans Bold"] },
    paint: { "text-color": chu, "text-halo-color": vien, "text-halo-width": 3, "text-opacity": 1 },
  });
};
const anQuanDao = (m: Map, t: number) => m.setPaintProperty("qd", "text-opacity", 1 - mem(nho(t, 0.08, 0.2)));

/** Video ảnh thật, cảnh 1a: bay từ toàn quốc xuống đồng bằng sông Hồng, nền vector. */
export const V1BayVung: React.FC<P> = () => {
  const ref = useBanDo({
    nen: "liberty",
    khoiTao: { center: [106.0, 16.3], zoom: 5.0 },
    setup: (m) => {
      nhanTen(m, THANH_PHO, "#090909", "#ECE9E2");
      themQuanDao(m, "#090909", "#ECE9E2");
    },
    capNhat: (m, t) => {
      anQuanDao(m, t);
      const e = Easing.bezier(0.45, 0, 0.2, 1)(nho(t, 0, 0.9));
      const w = Math.pow(e, 0.6);
      m.jumpTo({ center: [106.0 + (106.25 - 106.0) * w, 16.3 + (21.0 - 16.3) * w], zoom: 5.0 + (9.0 - 5.0) * e });
      hienTen(m, mem(nho(t, 0.75, 0.92)));
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#ECE9E2" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <GhiCong nen="liberty" mau="#090909" bong="0 0 6px #ECE9E2" />
    </AbsoluteFill>
  );
};

/** Video ảnh thật, cảnh 1b: cùng vùng trên ảnh vệ tinh EOX 2016, đẩy máy chậm. Không chỉ vào khu cụ thể. */
export const V1VungS2: React.FC<P> = () => {
  const ref = useBanDo({
    nen: "sentinel2",
    khoiTao: { center: [106.25, 21.0], zoom: 9.0 },
    setup: (m) => nhanTen(m, THANH_PHO, "#ECE9E2", "#090909"),
    capNhat: (m, t) => {
      const e = Easing.bezier(0.33, 0, 0.67, 1)(t);
      m.jumpTo({ center: [106.25 - 0.1 * e, 21.0 + 0.04 * e], zoom: 9.0 + 0.9 * e });
      hienTen(m, 1 - mem(nho(t, 0.7, 0.9)));
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#090909" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <GhiCong nen="sentinel2" mau="#ECE9E2" bong="0 0 5px #000" phu="Ảnh vệ tinh năm 2016, một số khu xây sau chưa hiện" />
    </AbsoluteFill>
  );
};

/** Video mô hình 3D, cảnh 1: bay từ toàn quốc xuống KCN mẫu 300 ha (giả định), kết ở góc nghiêng để nối sang mô hình Three.js. */
export const V3BayXuong: React.FC<P> = () => {
  const ref = useBanDo({
    nen: "liberty",
    khoiTao: { center: [106.0, 16.3], zoom: 5.0 },
    setup: (m) => {
      m.addSource("ranh", { type: "geojson", data: turf.polygon([ranhGioi()]) });
      m.addSource("xuong", { type: "geojson", data: nhaXuong() });
      m.addSource("duong", { type: "geojson", data: duongNoiKhu() });
      m.addLayer({ id: "ranh-nen", type: "fill", source: "ranh", paint: { "fill-color": "#E6D498", "fill-opacity": 0 } });
      m.addLayer({ id: "duong", type: "line", source: "duong", paint: { "line-color": "#ECEDED", "line-width": 4, "line-opacity": 0 } });
      m.addLayer({
        id: "xuong",
        type: "fill-extrusion",
        source: "xuong",
        paint: { "fill-extrusion-color": ["match", ["get", "mau"], 0, "#ECEDED", 1, "#D6DBDE", "#A47B57"], "fill-extrusion-height": 0, "fill-extrusion-opacity": 0.95 },
      });
      m.addLayer({ id: "ranh-vien", type: "line", source: "ranh", paint: { "line-color": "#242D32", "line-width": 5, "line-opacity": 0 } });
      themQuanDao(m, "#242D32", "#ECEDED");
      m.addSource("nhan", { type: "geojson", data: turf.point(KCN, { nhan: "KCN mẫu 300 ha · giả định" }) });
      m.addLayer({
        id: "nhan",
        type: "symbol",
        source: "nhan",
        layout: { "text-field": ["get", "nhan"], "text-size": 36, "text-allow-overlap": true, "text-max-width": 40, "text-font": ["Noto Sans Bold"], "text-offset": [0, -3] },
        paint: { "text-color": "#242D32", "text-halo-color": "#ECEDED", "text-halo-width": 4, "text-opacity": 0 },
      });
    },
    capNhat: (m, t) => {
      anQuanDao(m, t);
      const bay = Easing.bezier(0.45, 0, 0.2, 1)(nho(t, 0, 0.78));
      const w = Math.pow(bay, 0.6);
      const center: [number, number] = [106.0 + (KCN[0] - 106.0) * w, 16.3 + (KCN[1] - 16.3) * w];
      const nghieng = interpolate(bay, [0.35, 1], [0, 55], { extrapolateLeft: "clamp" });
      const xoay = interpolate(bay, [0.35, 1], [0, -20], { extrapolateLeft: "clamp" }) - 6 * nho(t, 0.78, 1);
      m.jumpTo({ center, zoom: 5.0 + (13.3 - 5.0) * bay + 0.15 * nho(t, 0.78, 1), pitch: nghieng, bearing: xoay });
      const hien = mem(nho(t, 0.62, 0.8));
      m.setPaintProperty("ranh-nen", "fill-opacity", 0.45 * hien);
      m.setPaintProperty("ranh-vien", "line-opacity", hien);
      m.setPaintProperty("duong", "line-opacity", hien);
      m.setPaintProperty("nhan", "text-opacity", mem(nho(t, 0.7, 0.85)));
      m.setPaintProperty("xuong", "fill-extrusion-height", ["*", ["get", "cao"], 1.5 * mem(nho(t, 0.75, 0.95))]);
    },
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#D6DBDE" }}>
      <div ref={ref} style={{ height: 1080, position: "absolute", width: 1920 }} />
      <GhiCong nen="liberty" mau="#242D32" bong="0 0 6px #ECEDED" phu="Vị trí, ranh giới, nhà xưởng là giả định minh hoạ" />
    </AbsoluteFill>
  );
};
