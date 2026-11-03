// Sinh index.html + compositions/*.html từ assets/du_lieu_video.json.
// Chạy: node tao_trang.mjs
import fs from "node:fs";

const D = JSON.parse(fs.readFileSync("assets/du_lieu_video.json", "utf8"));
const TONG = Math.round(D.thoi_luong_giay * 1000) / 1000; // 75.008
const CM = 0.25; // chuyển màn chồng mờ
const W = 1080, H = 1920, LE = 84;
const M = {
  nen: "#000000", quang: "rgba(255,255,255,0.055)", chu: "#FFFFFF", mo: "#8A8A8E",
  do: "#FF443D", vang: "#F0C73C",
};
const N = D.canh.length;
const pad = (n) => String(n).padStart(2, "0");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const r3 = (x) => Math.round(x * 1000) / 1000;

// Dòng thời gian từng từ (nội suy đều trong cụm) để canh lúc hình xuất hiện theo lời đọc.
const TU = [];
for (const g of D.phu_de) {
  const n = g.tu.length, d = (g.ket_thuc - g.bat_dau) / n;
  g.tu.forEach((t, i) => TU.push({ t: t.toLowerCase().replace(/[.,:;?!"]/g, ""), s: g.bat_dau + i * d }));
}
function moc(cum, tu0 = 0) {
  const a = cum.toLowerCase().split(/\s+/);
  for (let i = 0; i < TU.length; i++) {
    if (TU[i].s < tu0 - 0.01) continue;
    if (a.every((w, k) => TU[i + k] && TU[i + k].t === w)) return TU[i].s;
  }
  throw new Error("Không thấy cụm: " + cum);
}

const FONT = [
  [300, "Light"], [400, "Regular"], [500, "Medium"], [600, "SemiBold"], [700, "Bold"], [800, "ExtraBold"],
].map(([w, t]) => `@font-face{font-family:"Be Vietnam Pro";font-weight:${w};font-style:normal;src:local("Be Vietnam Pro ${t}"),local("BeVietnamPro-${t}");}`).join("\n");

const ICON = {
  nao: `<path d="M24 14c-6 0-10 4-10 9-4 1-6 5-5 9 1 3 3 5 6 5 0 4 3 7 7 7h2V14z M40 14c6 0 10 4 10 9 4 1 6 5 5 9-1 3-3 5-6 5 0 4-3 7-7 7h-2V14z"/><path d="M32 14v30"/>`,
  bieu_do: `<path d="M14 50h36"/><path d="M20 44V34M30 44V24M40 44V30M50 44V16"/>`,
  khien: `<path d="M32 12l16 6v12c0 11-7 18-16 22-9-4-16-11-16-22V18z"/>`,
  xac_nhan: `<path d="M18 33l9 9 19-20"/>`,
  can_bang: `<path d="M32 14v34M20 48h24M14 22h36"/><path d="M14 22l-6 14h12zM50 22l-6 14h12z"/>`,
  canh_bao: `<path d="M32 12l22 38H10z"/><path d="M32 26v12M32 43v1"/>`,
  muc_tieu: `<circle cx="32" cy="32" r="18"/><circle cx="32" cy="32" r="9"/><circle cx="32" cy="32" r="1.5"/>`,
  tien: `<circle cx="32" cy="32" r="19"/><path d="M38 24c-2-2-4-3-6-3-4 0-6 2-6 5 0 6 13 4 13 10 0 3-3 5-7 5-3 0-5-1-7-3M32 18v4M32 42v4"/>`,
  hoi: `<path d="M24 24c0-5 4-8 8-8s8 3 8 7c0 6-8 6-8 13"/><path d="M32 45v1"/>`,
};
function icon(id, ten, nhanManh) {
  if (!ten) return "";
  const mau = nhanManh ? M.do : M.chu;
  return `<div id="${id}" class="icon" style="border-color:${nhanManh ? M.do : "#3a3a3e"}"><svg viewBox="0 0 64 64" width="56" height="56" fill="none" stroke="${mau}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">${ICON[ten] || ""}</svg></div>`;
}
const tachTu = (s, cls, id) => s.split(/\s+/).map((w, i) => `<span id="${id}-${i}" class="${cls}">${esc(w)}</span>`).join(" ");

const CSS_CHUNG = `
${FONT}
#root{position:absolute;inset:0;font-family:"Be Vietnam Pro","Helvetica Neue",Arial,sans-serif;color:${M.chu};}
.vo{position:absolute;inset:0;}
.dau{position:absolute;left:${LE}px;right:${LE}px;top:190px;display:flex;justify-content:space-between;font-size:32px;font-weight:600;letter-spacing:0.08em;color:${M.mo};}
.dau b{color:${M.chu};font-weight:800;}
.than{position:absolute;left:${LE}px;right:${LE}px;}
.icon{width:84px;height:84px;border:2px solid #3a3a3e;border-radius:18px;display:flex;align-items:center;justify-content:center;margin-bottom:28px;}
.kicker{font-size:32px;font-weight:700;letter-spacing:0.1em;color:${M.do};margin-bottom:22px;}
.td{font-size:64px;font-weight:800;line-height:1.2;letter-spacing:-0.01em;}
.td-lon{font-size:82px;font-weight:800;line-height:1.16;letter-spacing:-0.015em;}
.doan{font-size:38px;font-weight:400;line-height:1.55;color:${M.mo};margin-top:36px;}
.w{display:inline-block;}
`;

function canhHTML(c, idx) {
  const m = D.moc_canh[idx];
  const id = `canh-${pad(c.so)}`, p = `c${pad(c.so)}`;
  const BD = m.bat_dau, KT = m.ket_thuc, DUR = KT - BD;
  const t = (abs) => r3(Math.max(0.1, abs - BD)); // giờ tuyệt đối -> giờ trong cảnh
  let than = "", css = "", js = "";
  const dau = `<div id="${p}-dau" class="dau"><span><b>${pad(c.so)}</b> / ${N}</span><span>${esc(D.dinh_danh)}</span></div>`;
  const ic = icon(`${p}-icon`, c.bieu_tuong, c.bieu_tuong_nhan_manh || c.loai === "diem_nhan" && c.so_lieu?.[0]?.nhan_manh);
  const kick = c.kicker ? `<div id="${p}-kicker" class="kicker">${esc(c.kicker)}</div>` : "";
  // hiện chung: icon, kicker, tiêu đề theo từng từ
  const o0 = idx === 0 ? 0.5 : 0;
  const vaoChung = (tdSel, t0 = idx === 0 ? 0 : 0.15) => `
  ${c.bieu_tuong ? "" : "//"} tl.fromTo("#${p}-icon",{opacity:${o0},scale:0.6},{opacity:1,scale:1,duration:0.4,ease:"back.out(2)"},${t0});
  ${c.kicker ? "" : "//"} tl.fromTo("#${p}-kicker",{opacity:${o0},y:16},{opacity:1,y:0,duration:0.35,ease:"power3.out"},${t0 + 0.08});
  tl.fromTo("${tdSel}",{opacity:${o0},y:34},{opacity:1,y:0,duration:0.45,ease:"power3.out",stagger:0.05},${t0 + 0.15});`;

  if (c.loai === "mo_dau" || (c.loai === "ket_luan")) {
    const cuoi = c.so === N;
    let td = esc(c.tieu_de);
    let tdHtml = tachTu(c.tieu_de, "w", `${p}-td`);
    if (cuoi) {
      tdHtml = tdHtml.replace(/(<span[^>]*>)biết<\/span> (<span[^>]*>)rộng,<\/span>/, `<span id="${p}-hl1" class="w" style="color:${M.do}">biết rộng,</span>`)
                     .replace(/(<span[^>]*>)giỏi<\/span> (<span[^>]*>)sâu\?<\/span>/, `<span id="${p}-hl2" class="w" style="color:${M.vang}">giỏi sâu?</span>`);
    }
    than = `<div id="${p}-than" class="than giua">${ic}${kick}<div id="${p}-td" class="td-lon">${tdHtml}</div>
      ${c.so === 2 ? `<svg id="${p}-gach" width="420" height="10" viewBox="0 0 420 10" style="margin-top:48px"><line x1="0" y1="5" x2="420" y2="5" stroke="${M.do}" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1.2" stroke-dashoffset="1.1"/></svg>` : ""}
      ${c.so === 13 ? `<div id="${p}-cham" class="cham"><span></span><span></span><span></span></div>` : ""}
    </div>`;
    css = `#${p}-than{top:380px;height:900px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;}
      #${p}-than .icon{margin-left:auto;margin-right:auto;}
      .cham{display:flex;gap:22px;margin-top:56px}.cham span{width:22px;height:22px;border-radius:50%;background:${M.do};display:block}`;
    js = vaoChung(`#${p}-td .w`);
    if (c.so === 2) js += `tl.to("#${p}-gach line",{strokeDashoffset:0,duration:0.8,ease:"power2.inOut"},${t(moc("chúng ta quên"))});`;
    if (c.so === 13) js += `tl.fromTo("#${p}-cham span",{opacity:0.15,y:0},{opacity:1,y:-14,duration:0.35,ease:"sine.inOut",stagger:{each:0.18,repeat:5,yoyo:true}},0.9);`;
    if (cuoi) js += `tl.fromTo("#${p}-hl1",{scale:1},{scale:1.08,duration:0.3,yoyo:true,repeat:1,ease:"sine.inOut"},${t(moc("biết rộng"))});
      tl.fromTo("#${p}-hl2",{scale:1},{scale:1.08,duration:0.3,yoyo:true,repeat:1,ease:"sine.inOut"},${t(moc("giỏi sâu"))});`;
    if (c.so === 1) js += `tl.fromTo("#${p}-td",{scale:1},{scale:1.04,duration:${r3(DUR)},ease:"none"},0);`;
  } else if (c.loai === "giai_thich" || c.loai === "he_qua") {
    const hq = c.loai === "he_qua";
    const doanHtml = c.doan ? `<div id="${p}-doan" class="doan${hq ? " doan-hq" : ""}">${tachTu(c.doan, "w dw", `${p}-d`)}</div>` : "";
    const ba = c.so === 8 ? `<div id="${p}-ba" class="ba">${["MỘT", "HAI", "BA"].map((x, i) => `<div id="${p}-ba-${i}" class="ba-o"><b>${pad(i + 1)}</b><span>${x}</span></div>`).join("")}</div>` : "";
    than = `<div id="${p}-than" class="than${hq ? "" : " co-vach"}">${hq ? "" : `<div id="${p}-vach" class="vach"></div>`}${ic}${kick}<div id="${p}-td" class="td${hq ? " td-hq" : ""}">${tachTu(c.tieu_de, "w", `${p}-td`)}</div>${doanHtml}${ba}</div>`;
    css = `#${p}-than{top:${c.doan && c.doan.length > 150 ? 400 : 470}px;}
      .co-vach{padding-left:44px;}
      .vach{position:absolute;left:0;top:0;bottom:0;width:6px;background:${M.do};border-radius:3px;transform-origin:top;}
      .td-hq{color:${M.mo};}
      .doan-hq{color:${M.chu};font-size:44px;font-weight:600;line-height:1.45;}
      .ba{display:flex;gap:28px;margin-top:70px}
      .ba-o{flex:1;border:2px solid #3a3a3e;border-radius:20px;padding:26px 24px;display:flex;flex-direction:column;gap:8px}
      .ba-o b{font-size:56px;font-weight:800;color:${M.do}}.ba-o span{font-size:32px;font-weight:700;letter-spacing:0.1em;color:${M.mo}}`;
    js = (hq ? "" : `tl.fromTo("#${p}-vach",{scaleY:0},{scaleY:1,duration:0.5,ease:"power3.out"},0.1);`) + vaoChung(`#${p}-td .w`);
    if (c.doan) {
      // đoạn chữ hiện mờ, sáng dần theo nhịp đọc
      const t0 = 1.0, t1 = Math.max(t0 + 1, DUR - 1.2);
      js += `tl.fromTo("#${p}-doan",{opacity:0,y:20},{opacity:1,y:0,duration:0.4,ease:"power2.out"},0.7);
        tl.fromTo("#${p}-doan .dw",{opacity:0.22},{opacity:1,duration:0.25,ease:"none",stagger:${r3((t1 - t0) / c.doan.split(/\s+/).length)}},${t0});`;
    }
    if (c.so === 8) js += `tl.fromTo("#${p}-ba .ba-o",{opacity:0,y:40},{opacity:1,y:0,duration:0.45,ease:"back.out(1.6)",stagger:0.45},1.0);`;
  } else if (c.loai === "so_do") {
    const [a, b] = c.so_do.nut;
    const nut = (n, i) => `<div id="${p}-nut-${n.id}" class="nut${n.nhan_manh ? " nm" : ""}" style="left:${Math.round(n.x * W - 190)}px;top:${Math.round(n.y * H - 120)}px"><b>${esc(n.nhan)}</b><div class="nut-td">${esc(n.tieu_de)}</div><div class="nut-phu">${esc(n.phu)}</div></div>`;
    than = `<div id="${p}-than" class="than" style="top:380px;text-align:center">${kick}<div id="${p}-td" class="td">${tachTu(c.tieu_de, "w", `${p}-td`)}</div></div>
      ${nut(a)}${nut(b)}<div id="${p}-khac" class="khac">≠</div>`;
    css = `.nut{position:absolute;width:380px;height:240px;border:2px solid #3a3a3e;border-radius:22px;padding:30px 30px;background:#0c0c0e}
      .nut b{font-size:32px;font-weight:700;color:${M.mo}}.nut-td{font-size:48px;font-weight:800;margin:8px 0 6px}.nut-phu{font-size:32px;color:${M.mo};line-height:1.3}
      .nut.nm{border-color:${M.do}}.nut.nm b,.nut.nm .nut-td{color:${M.do}}
      .khac{position:absolute;left:0;right:0;top:${Math.round(0.42 * H - 50)}px;text-align:center;font-size:88px;font-weight:300;color:${M.mo}}`;
    js = vaoChung(`#${p}-td .w`) + `
      tl.fromTo("#${p}-nut-a",{opacity:0,y:50},{opacity:1,y:0,duration:0.5,ease:"back.out(1.5)"},${t(moc("biết rộng")) - 0.2});
      tl.fromTo("#${p}-khac",{opacity:0,scale:0.4},{opacity:1,scale:1,duration:0.4,ease:"back.out(2)"},${t(moc("nó không đồng nghĩa"))});
      tl.fromTo("#${p}-nut-b",{opacity:0,y:50},{opacity:1,y:0,duration:0.5,ease:"back.out(1.5)"},${t(moc("giỏi sâu")) - 0.2});
      tl.fromTo("#${p}-nut-b",{boxShadow:"0 0 0px rgba(255,68,61,0)"},{boxShadow:"0 0 46px rgba(255,68,61,0.45)",duration:0.6,yoyo:true,repeat:1,ease:"sine.inOut"},${t(moc("giỏi sâu")) + 0.4});`;
  } else if (c.loai === "chuoi") {
    const mx = c.chuoi.mat_xich;
    const moct = [moc("thay vì", BD), moc("model nhỏ", BD), moc("model lớn chỉ", BD)];
    const Y0 = 620, HB = 150, GAP = 80;
    let s = "";
    mx.forEach((x, i) => {
      s += `<div id="${p}-mx-${i}" class="mx${x.nhan_manh ? " nm" : ""}" style="top:${Y0 + i * (HB + GAP)}px"><div class="mx-nhan">${esc(x.nhan)}</div><div class="mx-phu">${esc(x.phu)}</div></div>`;
      if (i < mx.length - 1) s += `<svg id="${p}-mt-${i}" class="mt" style="top:${Y0 + i * (HB + GAP) + HB + 6}px" width="40" height="68" viewBox="0 0 40 80" fill="none" stroke="${M.mo}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4V74M8 62l12 12 12-12" pathLength="1" stroke-dasharray="1 1.2" stroke-dashoffset="1.1"/></svg>`;
    });
    than = `<div id="${p}-than" class="than" style="top:300px">${ic}${kick}<div id="${p}-td" class="td">${tachTu(c.tieu_de, "w", `${p}-td`)}</div></div>${s}
      <div id="${p}-thanh" class="thanh"><div id="${p}-thanh-nho" class="thanh-nho"></div><div id="${p}-thanh-lon" class="thanh-lon"></div></div>`;
    css = `.mx{position:absolute;left:220px;width:640px;height:${HB}px;border:2px solid #3a3a3e;border-radius:22px;background:#0c0c0e;display:flex;flex-direction:column;align-items:center;justify-content:center}
      .mx-nhan{font-size:50px;font-weight:800}.mx-phu{font-size:34px;color:${M.mo};margin-top:6px}
      .mx.nm{border-color:${M.do}}.mx.nm .mx-nhan{color:${M.do}}
      .mt{position:absolute;left:520px}
      .thanh{position:absolute;left:220px;width:640px;top:${Y0 + 3 * HB + 2 * GAP + 28}px;height:16px;display:flex;gap:6px}
      .thanh-nho{width:90%;height:100%;background:${M.chu};border-radius:8px;transform-origin:left}.thanh-lon{width:10%;height:100%;background:${M.do};border-radius:8px;transform-origin:left}`;
    js = vaoChung(`#${p}-td .w`);
    mx.forEach((x, i) => {
      js += `tl.fromTo("#${p}-mx-${i}",{opacity:0,scale:0.85},{opacity:1,scale:1,duration:0.45,ease:"back.out(1.6)"},${r3(t(moct[i]) - 0.15)});`;
      if (i > 0) js += `tl.to("#${p}-mt-${i - 1} path",{strokeDashoffset:0,duration:0.4,ease:"power2.out"},${r3(t(moct[i]) - 0.45)});`;
    });
    js += `tl.fromTo("#${p}-thanh-nho",{scaleX:0},{scaleX:1,duration:1.0,ease:"power2.out"},${t(moc("gánh chín phần mười"))});
      tl.fromTo("#${p}-thanh-lon",{scaleX:0},{scaleX:1,duration:0.5,ease:"power2.out"},${t(moc("một phần mười khó"))});`;
  } else if (c.loai === "diem_nhan") {
    const sl = c.so_lieu[0], nm = !!sl.nhan_manh;
    const mau = nm ? M.do : M.chu;
    than = `<div id="${p}-than" class="than" style="top:560px">${ic}${kick}<div id="${p}-td" class="td-lon" style="color:${mau}">${tachTu(c.tieu_de, "w", `${p}-td`)}</div>
      <div class="sl-nhan">${esc(sl.nhan)}</div>
      <div class="sl-so" style="color:${mau}"><span id="${p}-so">0</span><small>${esc(sl.don_vi)}</small></div>
      <div class="sl-ray"><div id="${p}-thanh" class="sl-thanh" style="width:${sl.ty_le * 100}%;background:${nm ? M.do : M.mo}"></div></div></div>`;
    css = `.sl-nhan{font-size:32px;font-weight:600;color:${M.mo};margin-top:56px}
      .sl-so{font-size:140px;font-weight:800;line-height:1.05;margin-top:8px}.sl-so small{font-size:64px}
      .sl-ray{height:14px;background:#1c1c1f;border-radius:7px;margin-top:22px}.sl-thanh{height:100%;border-radius:7px;transform-origin:left}`;
    const tSo = c.so === 6 ? t(moc("gần chín mươi")) : t(moc("tám mươi ba"));
    js = vaoChung(`#${p}-td .w`) + `
      const dem = {v:0};
      tl.fromTo(dem,{v:0},{v:${sl.gia_tri},duration:1.4,ease:"power2.out",onUpdate:()=>{document.querySelector("#${p}-so").textContent=Math.round(dem.v);}},${r3(tSo)});
      tl.fromTo("#${p}-thanh",{scaleX:0},{scaleX:1,duration:1.4,ease:"power2.out"},${r3(tSo)});`;
    if (c.so === 7) js += `tl.fromTo("#${p}-so",{opacity:1},{opacity:0.45,duration:0.5,yoyo:true,repeat:1},${r3(t(moc("tám mươi sáu")))});`;
  }

  // trôi chậm liên tục để không có khung đứng yên; chồng mờ vào/ra 0,25 giây
  const laCuoi = idx === N - 1;
  js += `
  tl.fromTo("#${p}-vo",{opacity:${idx === 0 ? 1 : 0}},{opacity:1,duration:${CM},ease:"none"},0);
  tl.fromTo("#${p}-than",{y:0},{y:-18,duration:${r3(DUR)},ease:"none"},0);
  ${laCuoi ? "" : `tl.to("#${p}-vo",{opacity:0,duration:${CM},ease:"none"},${r3(DUR)});`}`;

  return {
    id, bat_dau: r3(BD), dur: r3(laCuoi ? TONG - BD : DUR + CM),
    html: `<template>
<style>
${CSS_CHUNG}
${css}
</style>
<div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}">
  <div id="${p}-vo" class="vo">
    ${dau}
    ${than}
  </div>
</div>
<script>
(function(){
  const tl = gsap.timeline({ paused: true });
  ${js}
  window.__timelines["${id}"] = tl;
})();
</script>
</template>
`,
  };
}

// Nền: quầng sáng giữa khung trôi chậm + thanh tiến độ đỏ
const nen = `<template>
<style>
#root{position:absolute;inset:0;background:${M.nen};}
#nen-quang{position:absolute;left:-240px;top:160px;width:1560px;height:1560px;border-radius:50%;background:radial-gradient(circle, ${M.quang} 0%, rgba(255,255,255,0.02) 40%, rgba(0,0,0,0) 70%);}
#nen-tien{position:absolute;left:0;top:0;height:6px;width:1080px;background:${M.do};transform-origin:left;}
</style>
<div id="root" data-composition-id="nen" data-width="${W}" data-height="${H}">
  <div id="nen-quang" data-layout-ignore></div>
  <div id="nen-tien" data-layout-ignore></div>
</div>
<script>
(function(){
  const tl = gsap.timeline({ paused: true });
  tl.fromTo("#nen-quang",{x:-60,y:-40,scale:1},{x:60,y:40,scale:1.08,duration:${TONG / 2},ease:"sine.inOut",yoyo:true,repeat:1},0);
  tl.fromTo("#nen-tien",{scaleX:0},{scaleX:1,duration:${TONG},ease:"none"},0);
  window.__timelines["nen"] = tl;
})();
</script>
</template>
`;

// Phụ đề: mỗi cụm một clip, chữ trắng, không tô từ đang đọc
const TOP_PD = Math.round(H * 0.72) - 36;
const cum = D.phu_de.map((g, i) => {
  const s = r3(g.bat_dau === 0 ? 0 : g.bat_dau), d = r3(g.ket_thuc - g.bat_dau);
  return `  <div id="pd-${i}" class="clip pd" data-start="${s}" data-duration="${d}" data-track-index="0"><span id="pd-${i}-c" class="pd-c">${esc(g.tu.join(" "))}</span></div>`;
}).join("\n");
const pdJs = D.phu_de.map((g, i) => `tl.fromTo("#pd-${i}-c",{opacity:0,y:10},{opacity:1,y:0,duration:0.12,ease:"power2.out"},${r3(g.bat_dau)});`).join("\n  ");
const phuDe = `<template>
<style>
${FONT}
#root{position:absolute;inset:0;font-family:"Be Vietnam Pro","Helvetica Neue",Arial,sans-serif;}
.pd{position:absolute;left:0;right:0;top:${TOP_PD}px;text-align:center;overflow:visible;}
.pd-c{display:inline-block;font-size:50px;font-weight:700;color:#FFFFFF;line-height:1.25;padding:0 ${LE}px;text-shadow:0 2px 12px rgba(0,0,0,0.6);}
</style>
<div id="root" data-composition-id="phu-de" data-width="${W}" data-height="${H}">
${cum}
</div>
<script>
(function(){
  const tl = gsap.timeline({ paused: true });
  ${pdJs}
  window.__timelines["phu-de"] = tl;
})();
</script>
</template>
`;

fs.mkdirSync("compositions", { recursive: true });
fs.writeFileSync("compositions/nen.html", nen);
fs.writeFileSync("compositions/phu-de.html", phuDe);
const hosts = [];
D.canh.forEach((c, i) => {
  const k = canhHTML(c, i);
  fs.writeFileSync(`compositions/${k.id}.html`, k.html);
  hosts.push(`      <div id="${k.id}" data-composition-id="${k.id}" data-composition-src="compositions/${k.id}.html" data-start="${k.bat_dau}" data-duration="${k.dur}" data-track-index="${1 + (i % 2)}" data-track-kind="graphics" data-width="${W}" data-height="${H}" style="z-index:${10 + i}"></div>`);
});

const index = `<!doctype html>
<html lang="vi" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: ${M.nen}; }
      #root { width: 100%; height: 100%; position: relative; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TONG}" data-width="${W}" data-height="${H}">
      <div id="nen" data-composition-id="nen" data-composition-src="compositions/nen.html" data-start="0" data-duration="${TONG}" data-track-index="0" data-track-kind="graphics" data-width="${W}" data-height="${H}" style="z-index:1"></div>
${hosts.join("\n")}
      <div id="phu-de" data-composition-id="phu-de" data-composition-src="compositions/phu-de.html" data-start="0" data-duration="${TONG}" data-track-index="3" data-track-kind="captions" data-width="${W}" data-height="${H}" style="z-index:100"></div>
      <audio id="giong" class="clip" src="assets/giong_doc.mp3" data-start="0" data-track-index="4" data-volume="1"></audio>
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
`;
fs.writeFileSync("index.html", index);
console.log("Đã sinh", D.canh.length, "cảnh,", D.phu_de.length, "cụm phụ đề, dài", TONG, "giây");
