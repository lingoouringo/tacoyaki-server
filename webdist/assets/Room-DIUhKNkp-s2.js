import { cw as reactDomExports, a7 as unzipSync, a8 as strFromU8, a5 as strToU8, a6 as zipSync, bq as DEFAULT_BACKDROP_BLUR, br as MAX_TOKEN_CELLS, V as useChatStore, G as useNetStore, aT as useCharacterStore, aU as activeCharacter, aA as useMapStore, d as useUIStore, r as reactExports, j as jsxRuntimeExports, bs as isAssetRef, J as fetchAssetDataUrl, bb as effectiveUiScale, bt as DEFAULT_GRID, bu as isPhoneDevice, bv as markLiveDrag, bw as clearAllLiveDrag, S as promptText, bx as canEraseStroke, by as canControlToken, bz as canSeeToken, bA as charOfToken, bB as tokenVisibility, bC as canEditText, s as confirmDialog, bD as activeStanding, bE as playSound, bF as RestartImg, I as Icon, bG as charPoolKey, bH as sceneStack, M as resolveAssetUrl, aB as useBgmStore, bI as doomedImportTags, aD as withBusy, aE as hydrateAssetsDeep, U as alertDialog, o as useIsMobile, bJ as expansionRoomActions, b5 as useExpansionRegistry, ac as useRulesetStore, bK as BoxIcon, bL as activeHeadshot, v as beginPanelDrag, bM as VisualCardOverlay, bN as GLOBAL_MAP_ID } from "./index-DLwZOjxA-s2.js";
import { g as BACKDROP_MAX_DIM, h as forceGifInfiniteLoop, w as webpIsAnimated, p as pngIsAnimated, i as imageDims, a as fileToLibraryImage, j as fileToHandoutImage, k as fileToBackdropImage } from "./image-CJqz1FOB.js";
import { d as MarkupText, u as useThumb, F as FlyMenu, C as Chat, e as ProfileCard, S as SheetWindow, b as CharacterHub, P as ParticipantsPanel, c as SheetViewer, H as HandoutPanel, D as DeckPanel, f as HandoutPresentation, B as BgmPanel, a as ChoicePanel, M as MadnessEditor, g as ClampedMenu } from "./Chat-BGHHn5_w-s2.js";
import { L as LibraryPanel } from "./LibraryPanel-B-GUUgdq-s2.js";
import "./init-CT5Y4fl8-s2.js";
import { DOMAdapter, CanvasSource, path, Sprite, Ticker, UPDATE_PRIORITY, Application, Graphics, Text, BlurFilter, AnimatedSprite, Circle } from "./index-CrtSqM-7-s2.js";
import { h as Texture, E as ExtensionType, e as extensions, C as Container, R as Rectangle } from "./ParticleBuffer-CMB7L347-s2.js";
import { F as FloatingWindow } from "./FloatingWindow-CgcsEYUd-s2.js";
import { a as downloadBlob } from "./roomFile-DlI8vkns.js";
import "./FriendWindow-ecntrbhD-s2.js";
import "./profileTheme-DACDRQUP.js";
import "./netImage-q1HBfP67-s2.js";
const CELL$1 = 64;
const MAX_MAPS = 60;
const MAX_MARKERS = 2e3;
const MAX_MARKER_SCAN = 3e4;
const MAX_GLOBAL_ITEMS = 100;
const PANEL_NAME_MAX = 80;
const MAX_ZIP_ENTRIES = 4e3;
const MAX_ENTRY_BYTES = 88 * 1024 * 1024;
const MAX_TOTAL_BYTES = 256 * 1024 * 1024;
function genId() {
  return globalThis.crypto?.randomUUID?.() ?? `imp_${Math.random().toString(36).slice(2)}`;
}
function num(v, d = 0) {
  return typeof v === "number" && Number.isFinite(v) ? v : d;
}
function str(v) {
  return typeof v === "string" && v ? v : void 0;
}
function clickActionText(v) {
  if (typeof v === "string") return v || void 0;
  if (v && typeof v === "object") {
    const a = v;
    if (a.type === "message") return str(a.text);
    if (a.type === "link") return str(a.url);
  }
  return void 0;
}
function mimeFromName(name) {
  const ext = name.slice(name.lastIndexOf(".") + 1).toLowerCase();
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "gif") return "image/gif";
  if (ext === "webp") return "image/webp";
  if (ext === "apng") return "image/apng";
  return "application/octet-stream";
}
function bytesToB64(bytes) {
  let bin = "";
  const CH = 32768;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode(...bytes.subarray(i, i + CH));
  return btoa(bin);
}
const AUTO_FIELD_MIN = 20;
const AUTO_FIELD_MAX = 400;
function declaredField(block) {
  const fw = Math.round(num(block.fieldWidth));
  const fh = Math.round(num(block.fieldHeight));
  return { fw: fw >= 1 ? fw : 0, fh: fh >= 1 ? fh : 0 };
}
function axisAnchor(min, max) {
  if (!Number.isFinite(min) || !Number.isFinite(max))
    return { offset: AUTO_FIELD_MIN / 2, size: AUTO_FIELD_MIN };
  const lo = Math.floor(min);
  const extent = Math.max(1, Math.ceil(max) - lo);
  const size = Math.min(AUTO_FIELD_MAX, Math.max(AUTO_FIELD_MIN, extent));
  const pad = Math.max(0, Math.floor((size - extent) / 2));
  return { offset: -lo + pad, size };
}
function fieldOrigin(cells) {
  return Math.trunc(cells / 2);
}
function axisOf(cells, shared, kind) {
  if (!cells) return shared;
  return { offset: kind === "legacy" ? cells / 2 : fieldOrigin(cells), size: cells };
}
function accBounds(b, panels) {
  for (const m of panels) {
    b.minX = Math.min(b.minX, m.x);
    b.maxX = Math.max(b.maxX, m.x + m.w);
    b.minY = Math.min(b.minY, m.y);
    b.maxY = Math.max(b.maxY, m.y + m.h);
  }
}
function panelToToken(m, offX, offY, extras) {
  const k = Math.min(1, MAX_TOKEN_CELLS / Math.max(m.w, m.h));
  return applyExtra({
    id: genId(),
    // 정수 px 로 깎지 않는다. 외부 포맷의 칸 좌표는 소수가 예사인데(실측 마커 x = −5.6, 82.1 …)
    // 1px 격자에 맞춰 버리면 맞닿아 있던 그림 사이에 머리카락만 한 틈이 생기고, 그 틈은 다시
    // 내보낼 때 칸 좌표에 그대로 새겨진다. 서버도 좌표를 반올림하지 않고 그대로 받는다.
    x: (m.x + m.w / 2 + offX) * CELL$1,
    y: (m.y + m.h / 2 + offY) * CELL$1,
    // 긴 변(width·height 중 큰 값) 기준 — 서버 캡과 동일 상한으로 온라인/오프라인 결과 일치.
    size: Math.min(MAX_TOKEN_CELLS, Math.max(0.25, Math.max(m.w, m.h))),
    w: m.w * k,
    h: m.h * k,
    // 이미지 패널은 이미지로, 이미지 없는 텍스트 패널(안내판)은 라벨 색판으로(색은 렌더러 기본 판색).
    image: m.img,
    label: m.label,
    // 원본 포맷은 단일 z — z<0 은 무대(전경) 뒤, z≥0 은 앞. 부호로 레이어를 가른다.
    layer: m.z < 0 ? "behind" : "bg",
    z: m.z,
    rotation: m.rotation,
    lockPos: m.locked || void 0,
    lockSize: m.locked || void 0,
    hidden: m.hidden,
    backImage: m.backImg,
    memo: m.memo,
    clickAction: m.clickAction
  }, m.srcId ? extras?.[m.srcId] : void 0);
}
function collectMarkers(block, resolve, drop) {
  const markersObj = block.markers && typeof block.markers === "object" ? block.markers : {};
  const imgs = [];
  const texts = [];
  let scanned = 0;
  let dropped = 0;
  const entries = Object.entries(markersObj);
  for (const [srcId, raw] of entries) {
    if (scanned++ >= MAX_MARKER_SCAN) {
      dropped += entries.length - scanned + 1;
      break;
    }
    if (!raw || typeof raw !== "object") continue;
    const m = raw;
    const imgRef = str(m.imageUrl);
    const text = str(m.text);
    if (!imgRef && !text) continue;
    if (imgs.length >= MAX_MARKERS) {
      dropped++;
      continue;
    }
    const img = imgRef ? resolve(imgRef) : void 0;
    const name = str(m.name) ?? text?.slice(0, PANEL_NAME_MAX);
    if (!img && !text) continue;
    const deg = (num(m.angle) % 360 + 360) % 360;
    const base = {
      x: num(m.x),
      y: num(m.y),
      w: Math.max(0.25, num(m.width, 1)),
      h: Math.max(0.25, num(m.height, 1)),
      z: Math.round(num(m.z)),
      locked: m.locked === true || m.freezed === true,
      rotation: deg ? deg * Math.PI / 180 : void 0,
      memo: text,
      // 글은 호버 메모로(이미지 패널의 설명·안내판의 긴 원문)
      clickAction: clickActionText(m.clickAction),
      srcId
    };
    if (img) imgs.push({ ...base, img, label: name });
    else if (texts.length < MAX_MARKERS) texts.push({ ...base, label: text.slice(0, 200) });
    else dropped++;
  }
  const merged = imgs.concat(texts);
  const out = merged.slice(0, MAX_MARKERS);
  dropped += merged.length - out.length;
  if (drop) drop.markers += dropped;
  return out;
}
function collectItems(entities, resolve, drop) {
  const itemsObj = entities.items && typeof entities.items === "object" ? entities.items : {};
  const out = [];
  let scanned = 0;
  let dropped = 0;
  const entries = Object.entries(itemsObj);
  for (const [srcId, raw] of entries) {
    if (scanned++ >= MAX_MARKER_SCAN) {
      dropped += entries.length - scanned + 1;
      break;
    }
    if (!raw || typeof raw !== "object") continue;
    const it = raw;
    if (it.type !== "object") continue;
    const imgRef = str(it.imageUrl);
    if (!imgRef) continue;
    if (out.length >= MAX_GLOBAL_ITEMS) {
      dropped++;
      continue;
    }
    const img = resolve(imgRef);
    if (!img) continue;
    const coverRef = str(it.coverImageUrl);
    const memo = str(it.memo);
    const deg = (num(it.angle) % 360 + 360) % 360;
    out.push({
      x: num(it.x),
      y: num(it.y),
      w: Math.max(0.25, num(it.width, 1)),
      h: Math.max(0.25, num(it.height, 1)),
      z: Math.round(num(it.z)),
      locked: it.locked === true || it.freezed === true,
      img,
      backImg: coverRef ? resolve(coverRef) : void 0,
      // 카버 이미지 → 양면 이미지(뒷면)
      rotation: deg ? deg * Math.PI / 180 : void 0,
      // 꺼 둔 패널(교체용 예비 등) → 비공개(GM만) — 레이어 목록 창에서 눈 아이콘으로 재점등.
      hidden: it.active === false || it.visible === false || void 0,
      // 이름 — 전용 name 필드(본체 왕복) 우선, 없으면 memo 앞부분(원본 포맷은 memo 가 이름 역할).
      label: str(it.name) ?? memo?.slice(0, PANEL_NAME_MAX),
      memo,
      clickAction: clickActionText(it.clickAction),
      srcId
    });
  }
  if (drop) drop.items += dropped;
  return out;
}
const MAX_CUTINS = 60;
function collectCutins(data, resolve, drop) {
  if (!data || typeof data !== "object") return [];
  const ent = data.entities;
  if (!ent || typeof ent !== "object") return [];
  const fx = ent.effects;
  if (!fx || typeof fx !== "object") return [];
  const sorted = Object.values(fx).filter((e) => !!e && typeof e === "object").sort((a, b) => num(a.order) - num(b.order));
  const out = [];
  let scanned = 0;
  let dropped = 0;
  for (const e of sorted) {
    if (scanned++ >= 500) {
      dropped += sorted.length - scanned + 1;
      break;
    }
    const imgRef = str(e.imageUrl);
    const image = imgRef ? resolve(imgRef) : void 0;
    if (!image) continue;
    if (out.length >= MAX_CUTINS) {
      dropped++;
      continue;
    }
    const sec = num(e.playTime);
    out.push({
      name: str(e.name) ?? `컷인 ${out.length + 1}`,
      image,
      ...sec >= 1 && sec <= 600 ? { displaySec: Math.round(sec) } : {}
    });
  }
  if (drop) drop.cutins += dropped;
  return out;
}
function unscaleOf(d, mapExtra) {
  const f = mapExtra?.field;
  if (!f || !d.fw || !d.fh) return null;
  if (!Number.isFinite(f.w) || !Number.isFinite(f.h) || f.w <= 0 || f.h <= 0) return null;
  const sx = d.fw / f.w;
  const sy = d.fh / f.h;
  const sane = (k) => Number.isFinite(k) && k >= 0.5 && k <= 2;
  return sane(sx) && sane(sy) ? { sx, sy } : null;
}
function unscalePanel(m, un) {
  return { ...m, x: m.x / un.sx, y: m.y / un.sy, w: m.w / un.sx, h: m.h / un.sy };
}
function blockToMap(block, panels, shared, fallbackName, resolve, kind, extras, mapExtra) {
  const d = declaredField(block);
  const ax = axisOf(d.fw, shared.x, kind);
  const ay = axisOf(d.fh, shared.y, kind);
  const fg = d.fw && d.fh ? str(block.foregroundUrl) : void 0;
  const bg = str(block.backgroundUrl);
  const fgUrl = fg ? resolve(fg) : void 0;
  const bgUrl = bg ? resolve(bg) : void 0;
  const stageUrl = fgUrl ?? (kind === "external" && d.fw && d.fh ? bgUrl : void 0);
  const un = unscaleOf(d, mapExtra);
  const stage = { w: ax.size * CELL$1, h: ay.size * CELL$1 };
  if (un) {
    stage.w = mapExtra.field.w * CELL$1;
    stage.h = mapExtra.field.h * CELL$1;
  }
  const tokens = panels.map(
    (m) => panelToToken(un ? unscalePanel(m, un) : m, un ? ax.offset / un.sx : ax.offset, un ? ay.offset / un.sy : ay.offset, extras)
  );
  const fit = block.fieldObjectFit === "contain" || block.fieldObjectFit === "cover" ? block.fieldObjectFit : void 0;
  return {
    id: genId(),
    name: str(block.name) || fallbackName,
    // 무대 이미지가 없어도 필드 프레임(치수)은 유지 — 그리드 표시·초기 화면 맞춤·배치 기준이 살아 있게.
    background: stageUrl ? { image: stageUrl, w: stage.w, h: stage.h, ...fit ? { fit } : {} } : { w: stage.w, h: stage.h },
    // 외부 포맷은 배경을 항상 흐리게 렌더하는데 흐림 값을 담는 필드가 없다(실측 190블록 중 0개).
    // 0 으로 가져오면 그 방만 배경이 쨍하게 튀므로, 본체가 바탕에 주는 기본값과 같이 맞춘다.
    backdrop: bgUrl ? { image: bgUrl, blur: mapExtra?.backdropBlur ?? DEFAULT_BACKDROP_BLUR } : void 0,
    grid: { size: CELL$1, visible: block.displayGrid === true },
    tokens,
    drawings: [],
    texts: []
  };
}
const SIDECAR_NAME = "__tacoyaki.json";
function readSidecar(raw) {
  const empty = { extras: {}, maps: {}, kind: "external" };
  if (!raw) return empty;
  try {
    const s = JSON.parse(strFromU8(raw));
    if (!s || s.v !== 1 || !s.extras || typeof s.extras !== "object") return empty;
    return {
      extras: s.extras,
      maps: s.maps && typeof s.maps === "object" ? s.maps : {},
      kind: s.origin === "field" ? "current" : "legacy"
    };
  } catch {
    return empty;
  }
}
function applyExtra(t, e) {
  if (!e) return t;
  if (e.layer) t.layer = e.layer;
  if (typeof e.z === "number") t.z = e.z;
  if (typeof e.size === "number") t.size = e.size;
  if (typeof e.w === "number" && typeof e.h === "number") {
    t.w = e.w;
    t.h = e.h;
  }
  t.hidden = e.hidden || void 0;
  t.flipX = e.flipX || void 0;
  t.label = e.label;
  t.memo = e.memo;
  if (e.mapIds) t.mapIds = e.mapIds;
  if (e.clickCardId) t.clickCardId = e.clickCardId;
  return t;
}
function mapsFromData(data, resolve, baseName, extras, mapExtras, kind = "external", drop) {
  if (!data || typeof data !== "object") return { maps: [], globalTokens: [] };
  const ent = data.entities;
  if (!ent || typeof ent !== "object") return { maps: [], globalTokens: [] };
  const entities = ent;
  const room = entities.room && typeof entities.room === "object" ? entities.room : {};
  const bgColor = str(room.backgroundColor);
  const scenes = entities.scenes && typeof entities.scenes === "object" ? entities.scenes : null;
  const sortedScenes = (scenes ? Object.entries(scenes).filter(([, s]) => s && typeof s === "object") : []).slice().sort(([, a], [, b2]) => num(a.order) - num(b2.order));
  const sceneEntries = sortedScenes.slice(0, MAX_MAPS);
  const sceneBlocks = sceneEntries.map(([, b2]) => b2);
  if (drop && sortedScenes.length > MAX_MAPS) drop.maps += sortedScenes.length - MAX_MAPS;
  const scenePanels = sceneBlocks.map((s) => collectMarkers(s, resolve, drop));
  const roomPanels = sceneBlocks.length ? [] : collectMarkers(room, resolve, drop);
  const rawItems = collectItems(entities, resolve, drop);
  const b = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (let s = 0; s < sceneBlocks.length; s++) {
    const d = declaredField(sceneBlocks[s]);
    if (!d.fw || !d.fh) accBounds(b, scenePanels[s]);
  }
  if (roomPanels.length) {
    const d = declaredField(room);
    if (!d.fw || !d.fh) accBounds(b, roomPanels);
  }
  accBounds(b, rawItems);
  const shared = { x: axisAnchor(b.minX, b.maxX), y: axisAnchor(b.minY, b.maxY) };
  const importId = genId();
  const base = (baseName ?? "").trim().slice(0, 60);
  const out = [];
  if (sceneBlocks.length) {
    for (let s = 0; s < sceneBlocks.length; s++) {
      const fallback = base ? sceneBlocks.length > 1 ? `${base} ${s + 1}` : base : `가져온 맵 ${s + 1}`;
      const m = blockToMap(
        sceneBlocks[s],
        scenePanels[s],
        shared,
        fallback,
        resolve,
        kind,
        extras,
        mapExtras?.[sceneEntries[s][0]]
      );
      m.importId = importId;
      if (bgColor) m.bgColor = bgColor;
      out.push(m);
    }
  } else {
    const m = blockToMap(room, roomPanels, shared, base || "가져온 맵", resolve, kind, extras, mapExtras?.room);
    m.importId = importId;
    if (bgColor) m.bgColor = bgColor;
    out.push(m);
  }
  if (!rawItems.length) return { maps: out, globalTokens: [] };
  const originBlock = sceneBlocks.length ? sceneBlocks[0] : room;
  const od = declaredField(originBlock);
  const oun = unscaleOf(od, mapExtras?.[sceneBlocks.length ? sceneEntries[0][0] : "room"]);
  const ox = axisOf(od.fw, shared.x, kind).offset;
  const oy = axisOf(od.fh, shared.y, kind).offset;
  const globalTokens = rawItems.map((m) => ({
    ...panelToToken(
      oun ? unscalePanel(m, oun) : m,
      oun ? ox / oun.sx : ox,
      oun ? oy / oun.sy : oy,
      extras
    ),
    importId
  }));
  return { maps: out, globalTokens };
}
function parseMapsetZip(bytes, baseName) {
  let entries;
  let count = 0;
  let total = 0;
  let droppedEntries = 0;
  const metaSeen = /* @__PURE__ */ new Set();
  try {
    entries = unzipSync(bytes, {
      filter: (f) => {
        const meta = (f.name === "__data.json" || f.name === ".token" || f.name === SIDECAR_NAME) && !metaSeen.has(f.name);
        if (meta) metaSeen.add(f.name);
        else if (++count > MAX_ZIP_ENTRIES) {
          droppedEntries++;
          return false;
        }
        if (f.originalSize > MAX_ENTRY_BYTES) {
          if (!meta) droppedEntries++;
          return false;
        }
        total += f.originalSize;
        if (total > MAX_TOTAL_BYTES) {
          if (!meta) droppedEntries++;
          return false;
        }
        return true;
      }
    });
  } catch {
    return { ok: false, error: "zip 파일을 열지 못했습니다." };
  }
  const dataRaw = entries["__data.json"];
  if (!dataRaw) return { ok: false, error: "__data.json 이 없습니다(지원하지 않는 형식)." };
  let data;
  try {
    data = JSON.parse(strFromU8(dataRaw));
  } catch {
    return { ok: false, error: "__data.json 을 읽지 못했습니다." };
  }
  const resources = data?.resources && typeof data.resources === "object" ? data.resources : {};
  const cache = /* @__PURE__ */ new Map();
  const resolve = (ref) => {
    if (cache.has(ref)) return cache.get(ref);
    const raw = entries[ref];
    let url;
    if (raw) {
      const mime = str(resources[ref]?.type) || mimeFromName(ref);
      url = `data:${mime};base64,${bytesToB64(raw)}`;
    }
    cache.set(ref, url);
    return url;
  };
  const side = readSidecar(entries[SIDECAR_NAME]);
  const drop = { maps: 0, markers: 0, items: 0, cutins: 0, entries: droppedEntries };
  const { maps, globalTokens } = mapsFromData(data, resolve, baseName, side.extras, side.maps, side.kind, drop);
  const cutins = collectCutins(data, resolve, drop);
  if (!maps.length) return { ok: false, error: "가져올 맵을 찾지 못했습니다." };
  const anyDrop = drop.maps + drop.markers + drop.items + drop.cutins + drop.entries > 0;
  return { ok: true, maps, globalTokens, cutins, ...anyDrop ? { dropped: drop } : {} };
}
function outputMime(mime) {
  if (mime === "image/png" || mime === "image/apng") return { mime: "image/png", ext: "png" };
  if (mime === "image/jpeg" || mime === "image/jpg") return { mime: "image/jpeg", ext: "jpeg" };
  if (mime === "image/gif") return { mime: "image/gif", ext: "gif" };
  if (mime === "image/webp") return { mime: "image/webp", ext: "webp" };
  const sub = /^image\/([a-z0-9.+-]+)$/i.exec(mime)?.[1];
  const ext = sub ? sub.replace(/\+.*$/, "") : "bin";
  return { mime, ext };
}
function imageSize(b) {
  const be32 = (i) => b[i] << 24 | b[i + 1] << 16 | b[i + 2] << 8 | b[i + 3];
  const le16 = (i) => b[i] | b[i + 1] << 8;
  const le24 = (i) => b[i] | b[i + 1] << 8 | b[i + 2] << 16;
  if (b.length > 24 && b[0] === 137 && b[1] === 80) return { w: be32(16), h: be32(20) };
  if (b.length > 10 && b[0] === 71 && b[1] === 73) return { w: le16(6), h: le16(8) };
  if (b.length > 30 && b[8] === 87 && b[9] === 69) {
    const fourcc = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (fourcc === "VP8X") return { w: le24(24) + 1, h: le24(27) + 1 };
    if (fourcc === "VP8L") {
      const n = b[21] | b[22] << 8 | b[23] << 16 | b[24] << 24;
      return { w: (n & 16383) + 1, h: (n >> 14 & 16383) + 1 };
    }
    if (fourcc === "VP8 ") return { w: le16(26) & 16383, h: le16(28) & 16383 };
  }
  if (b.length > 4 && b[0] === 255 && b[1] === 216) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 255) {
        i++;
        continue;
      }
      const m = b[i + 1];
      if (m >= 192 && m <= 207 && m !== 196 && m !== 200 && m !== 204) {
        return { w: b[i + 7] << 8 | b[i + 8], h: b[i + 5] << 8 | b[i + 6] };
      }
      i += 2 + (b[i + 2] << 8 | b[i + 3]);
    }
  }
  return null;
}
function dataUrlToBytes(dataUrl) {
  const m = /^data:([^;,]+)(?:;[^,]*)?,(.*)$/s.exec(dataUrl);
  if (!m) return null;
  const mime = m[1] || "application/octet-stream";
  try {
    const bin = atob(m[2]);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return { bytes, mime };
  } catch {
    return null;
  }
}
function sha256Hex(msg) {
  const K = new Uint32Array([
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ]);
  const H = new Uint32Array([
    1779033703,
    3144134277,
    1013904242,
    2773480762,
    1359893119,
    2600822924,
    528734635,
    1541459225
  ]);
  const len = msg.length;
  const withPad = new Uint8Array((len + 8 >> 6) + 1 << 6);
  withPad.set(msg);
  withPad[len] = 128;
  const bits = len * 8;
  const dv = new DataView(withPad.buffer);
  dv.setUint32(withPad.length - 8, Math.floor(bits / 4294967296));
  dv.setUint32(withPad.length - 4, bits >>> 0);
  const w = new Uint32Array(64);
  const rr = (x, n) => x >>> n | x << 32 - n;
  for (let off = 0; off < withPad.length; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = rr(w[i - 15], 7) ^ rr(w[i - 15], 18) ^ w[i - 15] >>> 3;
      const s1 = rr(w[i - 2], 17) ^ rr(w[i - 2], 19) ^ w[i - 2] >>> 10;
      w[i] = w[i - 16] + s0 + w[i - 7] + s1 >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const S1 = rr(e, 6) ^ rr(e, 11) ^ rr(e, 25);
      const ch = e & f ^ ~e & g;
      const t1 = h + S1 + ch + K[i] + w[i] >>> 0;
      const S0 = rr(a, 2) ^ rr(a, 13) ^ rr(a, 22);
      const maj = a & b ^ a & c ^ b & c;
      const t2 = S0 + maj >>> 0;
      h = g;
      g = f;
      f = e;
      e = d + t1 >>> 0;
      d = c;
      c = b;
      b = a;
      a = t1 + t2 >>> 0;
    }
    const v = [a, b, c, d, e, f, g, h];
    for (let i = 0; i < 8; i++) H[i] = H[i] + v[i] >>> 0;
  }
  let out = "";
  for (const v of H) out += v.toString(16).padStart(8, "0");
  return out;
}
function hex64(s) {
  let out = "";
  for (let lane = 0; lane < 8; lane++) {
    let h = 2166136261 ^ lane * 2654435769;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    out += (h >>> 0).toString(16).padStart(8, "0");
  }
  return out;
}
function makeImageRegistry() {
  const files = {};
  const resources = {};
  const byUrl = /* @__PURE__ */ new Map();
  const dims = /* @__PURE__ */ new Map();
  const ref = (dataUrl) => {
    if (!dataUrl || !dataUrl.startsWith("data:")) return null;
    const hit = byUrl.get(dataUrl);
    if (hit) return hit;
    const dec = dataUrlToBytes(dataUrl);
    if (!dec) return null;
    const out = outputMime(dec.mime);
    const name = `${sha256Hex(dec.bytes)}.${out.ext}`;
    files[name] = dec.bytes;
    resources[name] = { type: out.mime };
    byUrl.set(dataUrl, name);
    const s = imageSize(dec.bytes);
    dims.set(dataUrl, s && s.w > 0 && s.h > 0 ? s : null);
    return name;
  };
  const sizeOf = (dataUrl) => {
    if (!dataUrl) return null;
    if (!dims.has(dataUrl)) ref(dataUrl);
    return dims.get(dataUrl) ?? null;
  };
  return { files, resources, ref, sizeOf };
}
function tokenImage(t) {
  const imgs = t.images;
  if (imgs && imgs.length) return imgs[t.currentIndex ?? 0] ?? t.image;
  return t.image;
}
function exportable(t) {
  return (!!tokenImage(t) || !!t.label) && !t.charPlayerId;
}
function cellOf(map) {
  const s = map.grid?.size;
  return typeof s === "number" && Number.isFinite(s) && s > 0 ? s : CELL$1;
}
function degOf(rotation) {
  if (!rotation) return 0;
  return Math.round(rotation * 180 / Math.PI * 1e6) / 1e6;
}
function exportField(map) {
  const cell = cellOf(map);
  const bg = map.background;
  if (bg && bg.w && bg.h) {
    const ew = bg.w / cell;
    const eh = bg.h / cell;
    const fw = Math.max(1, Math.round(ew));
    const fh = Math.max(1, Math.round(eh));
    const sx = fw / ew;
    const sy = fh / eh;
    const sane = (k) => Number.isFinite(k) && k >= 0.5 && k <= 2;
    if (!sane(sx) || !sane(sy)) return { fw, fh, sx: 1, sy: 1 };
    const snapped2 = fw !== ew || fh !== eh;
    return { fw, fh, sx, sy, ...snapped2 ? { exact: { w: ew, h: eh } } : {} };
  }
  return { fw: 40, fh: 30, sx: 1, sy: 1 };
}
const RANK_FRONT = { bg: 0, token: 1, standing: 2 };
const byBackFirst = (a, b) => (RANK_FRONT[a.layer ?? "token"] ?? 1) - (RANK_FRONT[b.layer ?? "token"] ?? 1) || (a.z ?? 0) - (b.z ?? 0);
function zGapFor(mapTokens) {
  let most = 0;
  for (const t of mapTokens) if (t.length > most) most = t.length;
  return Math.max(MAX_MARKERS, most) + 2;
}
function unifiedZ(globalTokens, mapTokens) {
  const zGap = zGapFor(mapTokens);
  const side = (pick) => {
    const gs = globalTokens.filter(pick).sort(byBackFirst);
    const g = /* @__PURE__ */ new Map();
    gs.forEach((t, i) => g.set(t.id, (i + 1) * zGap));
    const m = mapTokens.map((tokens) => {
      const out = /* @__PURE__ */ new Map();
      const merged = [...gs, ...tokens.filter(pick)].sort(byBackFirst);
      let base = 0;
      let step = 0;
      for (const t of merged) {
        const at = g.get(t.id);
        if (at !== void 0 && globalTokens.some((x) => x.id === t.id)) {
          base = at;
          step = 0;
        } else out.set(t.id, base + ++step);
      }
      return out;
    });
    return { g, m };
  };
  const front = side((t) => (t.layer ?? "token") !== "behind");
  const back = side((t) => (t.layer ?? "token") === "behind");
  let maxBack = 0;
  for (const v of back.g.values()) if (v > maxBack) maxBack = v;
  for (const one of back.m) for (const v of one.values()) if (v > maxBack) maxBack = v;
  const drop = maxBack + 1;
  const shift = (v) => v - drop;
  const global = /* @__PURE__ */ new Map();
  for (const [id, v] of front.g) global.set(id, v);
  for (const [id, v] of back.g) global.set(id, shift(v));
  const maps = front.m.map((f, i) => {
    const out = new Map(f);
    for (const [id, v] of back.m[i]) out.set(id, shift(v));
    return out;
  });
  return { global, maps };
}
function toCellRect(t, field, cell, nat) {
  const long = t.size ?? 1;
  let w = long;
  let h = long;
  if (t.w && t.h) {
    const mx = Math.max(t.w, t.h);
    w = long * t.w / mx;
    h = long * t.h / mx;
  } else if (nat) {
    const ratio = nat.h / nat.w;
    if (ratio > 1) w = long / ratio;
    else h = long * ratio;
  }
  w *= field.sx;
  h *= field.sy;
  return {
    x: t.x / cell * field.sx - w / 2 - fieldOrigin(field.fw),
    y: t.y / cell * field.sy - h / 2 - fieldOrigin(field.fh),
    w,
    h
  };
}
function dataFromMaps(maps, globalTokens) {
  const img = makeImageRegistry();
  const scenes = {};
  let firstSceneBlock = null;
  const extras = {};
  const mapExtras = {};
  let missingImages = 0;
  const noteExtra = (id, t) => {
    const e = {};
    if (t.layer) e.layer = t.layer;
    if (typeof t.z === "number") e.z = t.z;
    if (typeof t.size === "number") e.size = t.size;
    if (t.w && t.h) {
      e.w = t.w;
      e.h = t.h;
    }
    if (t.hidden) e.hidden = true;
    if (t.flipX) e.flipX = true;
    if (t.label) e.label = t.label;
    if (t.memo) e.memo = t.memo;
    if (t.mapIds?.length) e.mapIds = t.mapIds;
    if (t.clickCardId) e.clickCardId = t.clickCardId;
    if (Object.keys(e).length) extras[id] = e;
  };
  const refImage = (t) => {
    const src = tokenImage(t);
    const ref = img.ref(src);
    if (src && !ref) missingImages++;
    return ref;
  };
  const zAll = unifiedZ(
    globalTokens.filter(exportable),
    maps.map((m) => m.tokens.filter(exportable))
  );
  maps.forEach((map, idx) => {
    const field = exportField(map);
    const { fw, fh } = field;
    const cell = cellOf(map);
    const tokens = map.tokens.filter(exportable);
    const zmap = zAll.maps[idx] ?? /* @__PURE__ */ new Map();
    const markers = {};
    for (const t of tokens) {
      const r = toCellRect(t, field, cell, img.sizeOf(tokenImage(t)));
      const locked = t.lockPos || t.lockSize || false;
      const id = genId();
      markers[id] = {
        x: r.x,
        y: r.y,
        z: zmap.get(t.id) ?? 0,
        angle: degOf(t.rotation),
        width: r.w,
        height: r.h,
        locked,
        freezed: false,
        imageUrl: refImage(t),
        // name=표시 이름(본체 왕복 전용 — 재가져오기 시 label 복원). text 는 외부 호환 표시(메모 우선).
        name: t.label ?? "",
        text: t.memo ?? t.label ?? "",
        // 외부 포맷의 클릭 동작은 {type,text} 객체 — 문자열로 적으면 외부 도구가 버린다(가져오기는 양쪽 다 받음).
        clickAction: t.clickAction ? { type: "message", text: t.clickAction } : null
      };
      noteExtra(id, t);
    }
    const block = {
      name: map.name,
      backgroundUrl: img.ref(map.backdrop?.image),
      // 바탕 → 배경
      foregroundUrl: img.ref(map.background?.image),
      // 무대 → 전경
      fieldObjectFit: map.background?.fit ?? "fill",
      fieldWidth: fw,
      fieldHeight: fh,
      displayGrid: map.grid?.visible === true,
      gridSize: 1,
      markers,
      text: "",
      // 전환 문구 기능 제거 — 외부 포맷 필드는 빈 값으로 유지
      mediaRef: null,
      soundRef: null,
      locked: false,
      order: idx
    };
    const sceneId = genId();
    scenes[sceneId] = block;
    const blur = map.backdrop?.blur;
    const extra = {};
    if (map.backdrop?.image && typeof blur === "number") extra.backdropBlur = blur;
    if (field.exact) extra.field = field.exact;
    if (Object.keys(extra).length) mapExtras[sceneId] = extra;
    if (!firstSceneBlock) firstSceneBlock = block;
  });
  const items = {};
  const iField = maps.length ? exportField(maps[0]) : { fw: 40, fh: 30, sx: 1, sy: 1 };
  const iCell = maps.length ? cellOf(maps[0]) : CELL$1;
  const gz = zAll.global;
  let order = 1;
  for (const t of globalTokens) {
    if (!exportable(t)) continue;
    const r = toCellRect(t, iField, iCell, img.sizeOf(tokenImage(t)));
    const locked = t.lockPos || t.lockSize || false;
    const angle = degOf(t.rotation);
    const id = genId();
    items[id] = {
      x: r.x,
      y: r.y,
      z: gz.get(t.id) ?? 0,
      angle,
      width: r.w,
      height: r.h,
      deckId: null,
      locked,
      visible: true,
      closed: false,
      withoutOwner: false,
      freezed: false,
      type: "object",
      active: !t.hidden,
      // name=표시 이름(본체 왕복 전용). memo 는 외부 호환 표시(메모 우선).
      name: t.label ?? "",
      memo: t.memo ?? t.label ?? "",
      imageUrl: refImage(t),
      coverImageUrl: img.ref(t.backImage),
      clickAction: t.clickAction ? { type: "message", text: t.clickAction } : null,
      order: order++
    };
    noteExtra(id, t);
  }
  const room = {
    ...firstSceneBlock ?? { fieldWidth: 40, fieldHeight: 30, markers: {} },
    defaultAnonymousRole: null,
    backgroundColor: maps.find((m) => m.bgColor)?.bgColor ?? "",
    monitored: false,
    archived: false,
    underConstruction: false,
    hidden3dDice: false,
    variables: [],
    messageChannels: [],
    messageGroups: []
  };
  const data = {
    meta: { version: "1.1.0" },
    entities: { room, items, decks: {}, notes: {}, characters: {}, effects: {}, scenes, savedatas: {}, snapshots: {} },
    resources: img.resources
  };
  return { data, files: img.files, sidecar: { v: 1, origin: "field", extras, maps: mapExtras }, missingImages };
}
function buildMapsetZip(maps, globalTokens) {
  const { data, files, sidecar, missingImages } = dataFromMaps(maps, globalTokens);
  const json = JSON.stringify(data);
  const entries = {
    "__data.json": strToU8(json),
    // 원본 포맷의 식별 토큰 `0.<64자리 hex>`. **빈 파일이면 외부 서비스가 불러오기를 거부한다**
    // (실기기 확인: 이 한 가지만 빈 파일로 바꾼 zip 이 'failed' 로 떨어졌다).
    // 실측한 정상 방 64개가 전부 이 형식이다. 값 자체는 대조되지 않고(맞지 않으면 '외부 도구로
    // 만든 데이터' 안내만 뜬다) 형식만 지키면 되므로, 내용에서 결정론적으로 만든다.
    ".token": strToU8("0." + hex64(json)),
    [SIDECAR_NAME]: strToU8(JSON.stringify(sidecar))
  };
  for (const [name, bytes] of Object.entries(files)) entries[name] = [bytes, { level: 0 }];
  const markerMax = maps.reduce((n, m) => Math.max(n, m.tokens.filter(exportable).length), 0);
  const itemCount = globalTokens.filter(exportable).length;
  const overflow = {};
  if (maps.length > MAX_MAPS) overflow.maps = maps.length - MAX_MAPS;
  if (markerMax > MAX_MARKERS) overflow.markers = markerMax - MAX_MARKERS;
  if (itemCount > MAX_GLOBAL_ITEMS) overflow.items = itemCount - MAX_GLOBAL_ITEMS;
  return { bytes: zipSync(entries), missingImages, overflow };
}
const TYPE_MS = 65;
const HOLD_MS = 3e3;
const MAX_QUEUE = 3;
const FAST_TYPE_MS = 25;
const FAST_HOLD_MS = 800;
const STANDING_RETRY_MS$1 = 1e4;
function localAsShared(c) {
  return {
    playerId: "local",
    charId: c.id,
    name: c.info.name,
    color: c.color,
    headshot: c.portrait.headshot,
    standings: c.portrait.standings,
    headshots: c.portrait.headshots,
    currentExpression: c.portrait.currentExpression,
    standingHeight: c.portrait.standingHeight,
    visibility: c.visibility
  };
}
function VNView({ overlay = false } = {}) {
  const messages = useChatStore((s) => s.messages);
  const historyEpoch = useChatStore((s) => s.historyEpoch);
  const roster = useNetStore((s) => s.roster);
  const participants = useNetStore((s) => s.participants);
  const self = useNetStore((s) => s.self);
  const characters = useCharacterStore((s) => s.characters);
  const speakingAs = useCharacterStore((s) => s.speakingAs);
  const activeChar = useCharacterStore(activeCharacter);
  const vnBg = useMapStore((s) => s.maps[s.activeMapId]?.vnBackground);
  const vnBlur = useMapStore((s) => s.maps[s.activeMapId]?.vnBackgroundBlur);
  const vnLayers = useMapStore((s) => s.maps[s.activeMapId]?.vnLayers);
  const castMax = useUIStore((s) => s.vnCastMax);
  const mainMsgs = reactExports.useMemo(
    () => messages.filter(
      (m) => m.channel === "main" && (m.kind === "speech" || m.kind === "narration") && !m.secret && !m.to
    ),
    [messages]
  );
  const last = mainMsgs[mainMsgs.length - 1];
  const [queue, setQueue] = reactExports.useState([]);
  const [current, setCurrent] = reactExports.useState(null);
  const [shown, setShown] = reactExports.useState("");
  const seenIds = reactExports.useRef(null);
  const lastEpoch = reactExports.useRef(historyEpoch);
  const typeTimer = reactExports.useRef(void 0);
  const holdTimer = reactExports.useRef(void 0);
  reactExports.useEffect(() => {
    if (seenIds.current === null) {
      seenIds.current = new Set(mainMsgs.map((m) => m.id));
      lastEpoch.current = historyEpoch;
      return;
    }
    if (lastEpoch.current !== historyEpoch) {
      lastEpoch.current = historyEpoch;
      seenIds.current = new Set(mainMsgs.map((m) => m.id));
      setQueue([]);
      setCurrent(null);
      return;
    }
    const seen = seenIds.current;
    const fresh = mainMsgs.filter((m) => !seen.has(m.id));
    const live = new Set(mainMsgs.map((m) => m.id));
    const deleted = fresh.length + seen.size > live.size;
    seenIds.current = live;
    if (fresh.length || deleted) {
      setQueue((q) => {
        const kept = deleted ? q.filter((m) => live.has(m.id)) : q;
        const next = fresh.length ? [...kept, ...fresh] : kept;
        return next.length > MAX_QUEUE ? next.slice(next.length - MAX_QUEUE) : next;
      });
    }
  }, [mainMsgs, historyEpoch]);
  const queueLen = reactExports.useRef(0);
  queueLen.current = queue.length;
  reactExports.useEffect(() => {
    if (!current && queue.length) {
      setCurrent(queue[0]);
      setQueue((q) => q.slice(1));
    }
  }, [current, queue]);
  reactExports.useEffect(() => {
    window.clearInterval(typeTimer.current);
    window.clearTimeout(holdTimer.current);
    if (!current) {
      setShown("");
      return;
    }
    const full = current.text ?? "";
    let i = 0;
    setShown("");
    typeTimer.current = window.setInterval(() => {
      i += 1;
      setShown(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(typeTimer.current);
        const hold = queueLen.current > 0 ? FAST_HOLD_MS : HOLD_MS;
        holdTimer.current = window.setTimeout(() => setCurrent(null), hold);
      }
    }, queueLen.current > 0 ? FAST_TYPE_MS : TYPE_MS);
    return () => {
      window.clearInterval(typeTimer.current);
      window.clearTimeout(holdTimer.current);
    };
  }, [current]);
  const activeMsg = current ?? last;
  const pid = activeMsg?.playerId ?? void 0;
  const isNpcMsg = !!activeMsg?.npc;
  let stage;
  if (isNpcMsg) {
    stage = void 0;
  } else if (pid && roster[pid]) {
    stage = roster[pid];
  } else if (!self) {
    const byName = activeMsg?.author ? Object.values(characters).find((c) => c.info.name === activeMsg.author) : void 0;
    if (byName) stage = localAsShared(byName);
  }
  if (!activeMsg) {
    const defaultChar = (speakingAs ? characters[speakingAs] : void 0) ?? activeChar;
    if (defaultChar) stage = localAsShared(defaultChar);
  }
  const stageChar = stage && stage.visibility !== "hidden" ? stage : void 0;
  const standings = stageChar?.standings ?? [];
  const liveStanding = standings.length > 0 ? standings[Math.max(0, Math.min(stageChar?.currentExpression ?? 0, standings.length - 1))] : void 0;
  const stageNick = pid ? participants.find((p) => p.playerId === pid)?.nick : void 0;
  const liveMatchesAuthor = !activeMsg?.author || (stage?.name || stageNick || "") === activeMsg.author;
  const resolvedStanding = activeMsg?.standing ?? (liveMatchesAuthor ? liveStanding : void 0);
  const resolvedHeight = activeMsg?.standingHeight ?? (liveMatchesAuthor ? stageChar?.standingHeight : void 0);
  const frozenStanding = reactExports.useRef({
    id: void 0,
    src: void 0,
    height: void 0
  });
  if (activeMsg && frozenStanding.current.id !== activeMsg.id) {
    frozenStanding.current = { id: activeMsg.id, src: resolvedStanding, height: resolvedHeight };
  }
  const standingSrc = activeMsg ? frozenStanding.current.src : resolvedStanding;
  const standingH = activeMsg ? frozenStanding.current.height : resolvedHeight;
  const standingSizeStyle = (h) => h ? { height: `${h}px`, maxHeight: "98%" } : void 0;
  const standingStyle = standingSizeStyle(standingH);
  function actorOfMsg(m) {
    if (m.npc) return null;
    const mid = m.playerId;
    let ch;
    if (mid && roster[mid]) ch = roster[mid];
    else if (!self && m.author) {
      const byName = Object.values(characters).find((c) => c.info.name === m.author);
      if (byName) ch = localAsShared(byName);
    }
    if (ch && ch.visibility === "hidden") return null;
    const live = ch && ch.standings?.length ? ch.standings[Math.max(0, Math.min(ch.currentExpression ?? 0, ch.standings.length - 1))] : void 0;
    const nick = mid ? participants.find((p) => p.playerId === mid)?.nick : void 0;
    const matches = !m.author || (ch?.name || nick || "") === m.author;
    const src = m.standing ?? (matches ? live : void 0);
    if (!src) return null;
    const height = m.standingHeight ?? (matches ? ch?.standingHeight : void 0);
    return { key: mid || m.author || m.id, src, name: m.author || ch?.name || "", height };
  }
  const castOrder = reactExports.useRef([]);
  const cast = reactExports.useMemo(() => {
    if (castMax <= 1) return [];
    const picked = /* @__PURE__ */ new Map();
    for (let i = mainMsgs.length - 1; i >= 0 && picked.size < castMax; i--) {
      const m = mainMsgs[i];
      const key = m.playerId || m.author || "";
      if (!key || picked.has(key)) continue;
      const a = actorOfMsg(m);
      if (a) picked.set(key, a);
      else picked.set(key, null);
    }
    const kept = castOrder.current.filter((k) => picked.has(k));
    const fresh = [...picked.keys()].filter((k) => !kept.includes(k)).reverse();
    const order = [...kept, ...fresh];
    castOrder.current = order;
    return order.map((k) => picked.get(k)).filter((a) => !!a);
  }, [mainMsgs, roster, participants, characters, self, castMax]);
  const speakingKey = activeMsg ? activeMsg.playerId || activeMsg.author || activeMsg.id : void 0;
  const slotX = (i, n) => n <= 1 ? "5%" : `${Math.round((i + 1) / (n + 1) * 100)}%`;
  const name = activeMsg?.author || stage?.name || "";
  const fullText = current?.text ?? "";
  const displayedText = current ? shown : last?.text ?? "";
  const typing = !!current && shown.length < fullText.length;
  const [, setVnResolved] = reactExports.useState(0);
  const vnUrls = reactExports.useRef(/* @__PURE__ */ new Map());
  const vnFailAt = reactExports.useRef(/* @__PURE__ */ new Map());
  const vnRetryTimer = reactExports.useRef(void 0);
  reactExports.useEffect(() => () => window.clearTimeout(vnRetryTimer.current), []);
  function armVnRetry(delay) {
    if (vnRetryTimer.current !== void 0) return;
    vnRetryTimer.current = window.setTimeout(() => {
      vnRetryTimer.current = void 0;
      setVnResolved((n) => n + 1);
    }, delay);
  }
  function resolveVnSrc(src) {
    if (!src || !isAssetRef(src)) return src;
    const hit = vnUrls.current.get(src);
    if (hit) return hit;
    const failedAt = vnFailAt.current.get(src);
    if (failedAt !== void 0 && Date.now() - failedAt < STANDING_RETRY_MS$1) {
      armVnRetry(STANDING_RETRY_MS$1 - (Date.now() - failedAt) + 250);
      return void 0;
    }
    vnFailAt.current.delete(src);
    void fetchAssetDataUrl(src).then((u) => {
      if (u && u !== src) {
        vnUrls.current.set(src, u);
        setVnResolved((n) => n + 1);
      } else {
        vnFailAt.current.set(src, Date.now());
        armVnRetry(STANDING_RETRY_MS$1 + 250);
      }
    });
    return void 0;
  }
  const [exiting, setExiting] = reactExports.useState(null);
  const prevStandingRef = reactExports.useRef({
    src: void 0,
    height: void 0
  });
  const exitSeq = reactExports.useRef(0);
  reactExports.useEffect(() => {
    const prev = prevStandingRef.current;
    prevStandingRef.current = { src: standingSrc, height: standingH };
    if (!prev.src || prev.src === standingSrc) return;
    exitSeq.current += 1;
    const key = exitSeq.current;
    setExiting({ src: prev.src, height: prev.height, key });
    const t = window.setTimeout(() => setExiting((e) => e && e.key === key ? null : e), 420);
    return () => window.clearTimeout(t);
  }, [standingSrc, standingH]);
  const vnBoxRect = useUIStore((s) => s.vnBoxRect);
  const setVnBoxRect = useUIStore((s) => s.setVnBoxRect);
  const vnFontScale = useUIStore((s) => s.vnFontScale);
  const setVnFontScale = useUIStore((s) => s.setVnFontScale);
  const boxRef = reactExports.useRef(null);
  function beginBoxDrag(e, mode) {
    e.preventDefault();
    const el = boxRef.current;
    const parent = el?.offsetParent;
    if (!el || !parent) return;
    const z = effectiveUiScale();
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = vnBoxRect?.x ?? el.offsetLeft;
    const oy = vnBoxRect?.y ?? el.offsetTop;
    const ow = vnBoxRect?.w ?? el.offsetWidth;
    const oh = vnBoxRect?.h ?? el.offsetHeight;
    const pw = parent.clientWidth;
    const ph = parent.clientHeight;
    const SNAP = 20;
    const onMove = (ev) => {
      const dx = (ev.clientX - sx) / z;
      const dy = (ev.clientY - sy) / z;
      const snap = (v) => ev.altKey ? Math.round(v) : Math.round(v / SNAP) * SNAP;
      if (mode === "move") {
        const x = Math.max(0, Math.min(snap(ox + dx), pw - ow));
        const y = Math.max(0, Math.min(snap(oy + dy), ph - oh));
        setVnBoxRect({ x: Math.round(x), y: Math.round(y), w: Math.round(ow), h: Math.round(oh) });
      } else {
        const w = Math.max(240, Math.min(snap(ow + dx), pw - ox));
        const h = Math.max(96, Math.min(snap(oh + dy), ph - oy));
        setVnBoxRect({ x: Math.round(ox), y: Math.round(oy), w: Math.round(w), h: Math.round(h) });
      }
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }
  const vnOverlayRect = useUIStore((s) => s.vnOverlayRect);
  const setVnOverlayRect = useUIStore((s) => s.setVnOverlayRect);
  const ov = vnOverlayRect ?? { scale: 0.7, x: 0, y: 0 };
  function setOverlayScale(delta) {
    const scale = Math.max(0.3, Math.min(1.3, Math.round((ov.scale + delta) * 100) / 100));
    setVnOverlayRect({ scale, x: ov.x, y: ov.y });
  }
  function beginOverlayMove(e) {
    e.preventDefault();
    const z = effectiveUiScale();
    const sx = e.clientX;
    const sy = e.clientY;
    const ox = ov.x;
    const oy = ov.y;
    const onMove = (ev) => {
      const dx = (ev.clientX - sx) / z;
      const dy = (ev.clientY - sy) / z;
      setVnOverlayRect({ scale: ov.scale, x: Math.round(ox + dx), y: Math.round(oy + dy) });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }
  const sortedLayers = (vnLayers ?? []).slice().sort((a, b) => a.z - b.z);
  const layerStyle = (l) => {
    const tx = l.x ?? 0;
    const ty = l.y ?? 0;
    const sc = (l.scale ?? 100) / 100;
    return {
      backgroundImage: `url(${l.image})`,
      opacity: l.opacity ?? 1,
      backgroundSize: l.fit === "contain" ? "contain" : "cover",
      ...tx || ty || sc !== 1 ? { transform: `translate(${tx}%, ${ty}%) scale(${sc})` } : {}
    };
  };
  const shownStanding = resolveVnSrc(standingSrc);
  const exitSrc = exiting ? resolveVnSrc(exiting.src) : void 0;
  const castEls = cast.length > 1 ? cast.map((a, i) => {
    const src = resolveVnSrc(a.src);
    if (!src) return null;
    const speaking = a.key === speakingKey;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        className: "standing standing-img" + (speaking ? " speaking" : " idle"),
        src,
        alt: "",
        decoding: "async",
        draggable: false,
        style: {
          ...standingSizeStyle(a.height),
          ["--sx"]: slotX(i, cast.length),
          ["--sdx"]: "-50%"
        }
      },
      a.key
    );
  }) : null;
  const standingEls = /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !castEls && exiting && exitSrc && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        className: "standing standing-img standing-exit",
        src: exitSrc,
        alt: "",
        "aria-hidden": true,
        decoding: "async",
        draggable: false,
        style: standingSizeStyle(exiting.height)
      },
      "exit" + exiting.key
    ),
    castEls ?? // 스탠딩 미등록 시 더미 이미지 없이 아예 비움(빈 무대).
    (shownStanding && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        className: "standing standing-img",
        src: shownStanding,
        alt: "",
        decoding: "async",
        draggable: false,
        style: standingStyle
      },
      standingSrc
    ))
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "center-vn" + (overlay ? " overlay" : ""), children: [
    !overlay && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "vn-bg" + (vnBg ? " has-img" : ""),
        style: vnBg ? {
          backgroundImage: `url(${vnBg})`,
          // 흐림 — 가장자리 번짐이 프레임 안으로 비치지 않게 살짝 확대해 상쇄.
          ...vnBlur ? { filter: `blur(${vnBlur}px)`, transform: "scale(1.06)" } : {}
        } : void 0
      }
    ),
    !overlay && sortedLayers.filter((l) => !l.front).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "vn-layer", style: layerStyle(l) }, l.id)),
    overlay ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "vn-overlay-standings",
          style: { transform: `translate(${ov.x}px, ${ov.y}px) scale(${ov.scale})` },
          children: standingEls
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "vn-overlay-ctl", "aria-hidden": true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "voc-grip",
            onPointerDown: beginOverlayMove,
            title: "드래그해 스탠딩 위치 이동 (내 화면만)",
            children: "✥"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "voc-btn", onClick: () => setOverlayScale(-0.1), title: "스탠딩 작게", children: "−" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "voc-val", children: [
          Math.round(ov.scale * 100),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "voc-btn", onClick: () => setOverlayScale(0.1), title: "스탠딩 크게", children: "+" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "voc-btn",
            onClick: () => setVnOverlayRect(null),
            title: "기본 크기·위치로 되돌리기",
            children: "↺"
          }
        )
      ] })
    ] }) : standingEls,
    !overlay && sortedLayers.filter((l) => l.front).map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "vn-layer", style: layerStyle(l) }, l.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "vn-box" + (vnBoxRect ? " vn-box-custom" : ""),
        ref: boxRef,
        style: {
          // 대사창 안쪽(이름·본문·타자 커서)만 배율을 태운다 — 조정 칩까지 커지지 않도록 무대가 아닌 여기에 준다.
          ["--vn-font-scale"]: vnFontScale,
          ...vnBoxRect ? {
            left: vnBoxRect.x,
            top: vnBoxRect.y,
            width: vnBoxRect.w,
            height: vnBoxRect.h,
            right: "auto",
            bottom: "auto"
          } : {}
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "vn-name vn-name-drag",
              onPointerDown: (e) => beginBoxDrag(e, "move"),
              title: "드래그해 대사창 위치 이동 (격자에 맞춰 이동 · Alt=세밀 이동)",
              children: name || " "
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "vn-text", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MarkupText, { src: displayedText }),
            typing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "caret", children: " " })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "vn-font-ctl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "vfc-btn",
                onClick: () => setVnFontScale(useUIStore.getState().vnFontScale - 0.1),
                title: "대사 글자 작게 (내 화면만)",
                children: "−"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "vfc-val", children: [
              Math.round(vnFontScale * 100),
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "vfc-btn",
                onClick: () => setVnFontScale(useUIStore.getState().vnFontScale + 0.1),
                title: "대사 글자 크게 (내 화면만)",
                children: "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "vn-box-resize",
              onPointerDown: (e) => beginBoxDrag(e, "resize"),
              title: "드래그해 대사창 크기 조절 (격자에 맞춰 · Alt=세밀)"
            }
          )
        ]
      }
    )
  ] });
}
var lib$1 = {};
var gif = {};
var lib = {};
Object.defineProperty(lib, "__esModule", {
  value: true
});
lib.loop = lib.conditional = lib.parse = void 0;
var parse = function parse2(stream, schema) {
  var result = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  var parent = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : result;
  if (Array.isArray(schema)) {
    schema.forEach(function(partSchema) {
      return parse2(stream, partSchema, result, parent);
    });
  } else if (typeof schema === "function") {
    schema(stream, result, parent, parse2);
  } else {
    var key = Object.keys(schema)[0];
    if (Array.isArray(schema[key])) {
      parent[key] = {};
      parse2(stream, schema[key], result, parent[key]);
    } else {
      parent[key] = schema[key](stream, result, parent, parse2);
    }
  }
  return result;
};
lib.parse = parse;
var conditional = function conditional2(schema, conditionFunc) {
  return function(stream, result, parent, parse3) {
    if (conditionFunc(stream, result, parent)) {
      parse3(stream, schema, result, parent);
    }
  };
};
lib.conditional = conditional;
var loop = function loop2(schema, continueFunc) {
  return function(stream, result, parent, parse3) {
    var arr = [];
    var lastStreamPos = stream.pos;
    while (continueFunc(stream, result, parent)) {
      var newParent = {};
      parse3(stream, schema, result, newParent);
      if (stream.pos === lastStreamPos) {
        break;
      }
      lastStreamPos = stream.pos;
      arr.push(newParent);
    }
    return arr;
  };
};
lib.loop = loop;
var uint8 = {};
Object.defineProperty(uint8, "__esModule", {
  value: true
});
uint8.readBits = uint8.readArray = uint8.readUnsigned = uint8.readString = uint8.peekBytes = uint8.readBytes = uint8.peekByte = uint8.readByte = uint8.buildStream = void 0;
var buildStream = function buildStream2(uint8Data) {
  return {
    data: uint8Data,
    pos: 0
  };
};
uint8.buildStream = buildStream;
var readByte = function readByte2() {
  return function(stream) {
    return stream.data[stream.pos++];
  };
};
uint8.readByte = readByte;
var peekByte = function peekByte2() {
  var offset = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
  return function(stream) {
    return stream.data[stream.pos + offset];
  };
};
uint8.peekByte = peekByte;
var readBytes = function readBytes2(length) {
  return function(stream) {
    return stream.data.subarray(stream.pos, stream.pos += length);
  };
};
uint8.readBytes = readBytes;
var peekBytes = function peekBytes2(length) {
  return function(stream) {
    return stream.data.subarray(stream.pos, stream.pos + length);
  };
};
uint8.peekBytes = peekBytes;
var readString = function readString2(length) {
  return function(stream) {
    return Array.from(readBytes(length)(stream)).map(function(value) {
      return String.fromCharCode(value);
    }).join("");
  };
};
uint8.readString = readString;
var readUnsigned = function readUnsigned2(littleEndian) {
  return function(stream) {
    var bytes = readBytes(2)(stream);
    return littleEndian ? (bytes[1] << 8) + bytes[0] : (bytes[0] << 8) + bytes[1];
  };
};
uint8.readUnsigned = readUnsigned;
var readArray = function readArray2(byteSize, totalOrFunc) {
  return function(stream, result, parent) {
    var total = typeof totalOrFunc === "function" ? totalOrFunc(stream, result, parent) : totalOrFunc;
    var parser = readBytes(byteSize);
    var arr = new Array(total);
    for (var i = 0; i < total; i++) {
      arr[i] = parser(stream);
    }
    return arr;
  };
};
uint8.readArray = readArray;
var subBitsTotal = function subBitsTotal2(bits, startIndex, length) {
  var result = 0;
  for (var i = 0; i < length; i++) {
    result += bits[startIndex + i] && Math.pow(2, length - i - 1);
  }
  return result;
};
var readBits = function readBits2(schema) {
  return function(stream) {
    var _byte = readByte()(stream);
    var bits = new Array(8);
    for (var i = 0; i < 8; i++) {
      bits[7 - i] = !!(_byte & 1 << i);
    }
    return Object.keys(schema).reduce(function(res, key) {
      var def = schema[key];
      if (def.length) {
        res[key] = subBitsTotal(bits, def.index, def.length);
      } else {
        res[key] = bits[def.index];
      }
      return res;
    }, {});
  };
};
uint8.readBits = readBits;
(function(exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;
  var _ = lib;
  var _uint2 = uint8;
  var subBlocksSchema = {
    blocks: function blocks(stream) {
      var terminator = 0;
      var chunks = [];
      var streamSize = stream.data.length;
      var total = 0;
      for (var size = (0, _uint2.readByte)()(stream); size !== terminator; size = (0, _uint2.readByte)()(stream)) {
        if (!size) break;
        if (stream.pos + size >= streamSize) {
          var availableSize = streamSize - stream.pos;
          chunks.push((0, _uint2.readBytes)(availableSize)(stream));
          total += availableSize;
          break;
        }
        chunks.push((0, _uint2.readBytes)(size)(stream));
        total += size;
      }
      var result = new Uint8Array(total);
      var offset = 0;
      for (var i = 0; i < chunks.length; i++) {
        result.set(chunks[i], offset);
        offset += chunks[i].length;
      }
      return result;
    }
  };
  var gceSchema = (0, _.conditional)({
    gce: [{
      codes: (0, _uint2.readBytes)(2)
    }, {
      byteSize: (0, _uint2.readByte)()
    }, {
      extras: (0, _uint2.readBits)({
        future: {
          index: 0,
          length: 3
        },
        disposal: {
          index: 3,
          length: 3
        },
        userInput: {
          index: 6
        },
        transparentColorGiven: {
          index: 7
        }
      })
    }, {
      delay: (0, _uint2.readUnsigned)(true)
    }, {
      transparentColorIndex: (0, _uint2.readByte)()
    }, {
      terminator: (0, _uint2.readByte)()
    }]
  }, function(stream) {
    var codes = (0, _uint2.peekBytes)(2)(stream);
    return codes[0] === 33 && codes[1] === 249;
  });
  var imageSchema = (0, _.conditional)({
    image: [{
      code: (0, _uint2.readByte)()
    }, {
      descriptor: [{
        left: (0, _uint2.readUnsigned)(true)
      }, {
        top: (0, _uint2.readUnsigned)(true)
      }, {
        width: (0, _uint2.readUnsigned)(true)
      }, {
        height: (0, _uint2.readUnsigned)(true)
      }, {
        lct: (0, _uint2.readBits)({
          exists: {
            index: 0
          },
          interlaced: {
            index: 1
          },
          sort: {
            index: 2
          },
          future: {
            index: 3,
            length: 2
          },
          size: {
            index: 5,
            length: 3
          }
        })
      }]
    }, (0, _.conditional)({
      lct: (0, _uint2.readArray)(3, function(stream, result, parent) {
        return Math.pow(2, parent.descriptor.lct.size + 1);
      })
    }, function(stream, result, parent) {
      return parent.descriptor.lct.exists;
    }), {
      data: [{
        minCodeSize: (0, _uint2.readByte)()
      }, subBlocksSchema]
    }]
  }, function(stream) {
    return (0, _uint2.peekByte)()(stream) === 44;
  });
  var textSchema = (0, _.conditional)({
    text: [{
      codes: (0, _uint2.readBytes)(2)
    }, {
      blockSize: (0, _uint2.readByte)()
    }, {
      preData: function preData(stream, result, parent) {
        return (0, _uint2.readBytes)(parent.text.blockSize)(stream);
      }
    }, subBlocksSchema]
  }, function(stream) {
    var codes = (0, _uint2.peekBytes)(2)(stream);
    return codes[0] === 33 && codes[1] === 1;
  });
  var applicationSchema = (0, _.conditional)({
    application: [{
      codes: (0, _uint2.readBytes)(2)
    }, {
      blockSize: (0, _uint2.readByte)()
    }, {
      id: function id(stream, result, parent) {
        return (0, _uint2.readString)(parent.blockSize)(stream);
      }
    }, subBlocksSchema]
  }, function(stream) {
    var codes = (0, _uint2.peekBytes)(2)(stream);
    return codes[0] === 33 && codes[1] === 255;
  });
  var commentSchema = (0, _.conditional)({
    comment: [{
      codes: (0, _uint2.readBytes)(2)
    }, subBlocksSchema]
  }, function(stream) {
    var codes = (0, _uint2.peekBytes)(2)(stream);
    return codes[0] === 33 && codes[1] === 254;
  });
  var schema = [
    {
      header: [{
        signature: (0, _uint2.readString)(3)
      }, {
        version: (0, _uint2.readString)(3)
      }]
    },
    {
      lsd: [{
        width: (0, _uint2.readUnsigned)(true)
      }, {
        height: (0, _uint2.readUnsigned)(true)
      }, {
        gct: (0, _uint2.readBits)({
          exists: {
            index: 0
          },
          resolution: {
            index: 1,
            length: 3
          },
          sort: {
            index: 4
          },
          size: {
            index: 5,
            length: 3
          }
        })
      }, {
        backgroundColorIndex: (0, _uint2.readByte)()
      }, {
        pixelAspectRatio: (0, _uint2.readByte)()
      }]
    },
    (0, _.conditional)({
      gct: (0, _uint2.readArray)(3, function(stream, result) {
        return Math.pow(2, result.lsd.gct.size + 1);
      })
    }, function(stream, result) {
      return result.lsd.gct.exists;
    }),
    // content frames
    {
      frames: (0, _.loop)([gceSchema, applicationSchema, commentSchema, imageSchema, textSchema], function(stream) {
        var nextCode = (0, _uint2.peekByte)()(stream);
        return nextCode === 33 || nextCode === 44;
      })
    }
  ];
  var _default = schema;
  exports["default"] = _default;
})(gif);
var deinterlace$1 = {};
Object.defineProperty(deinterlace$1, "__esModule", {
  value: true
});
deinterlace$1.deinterlace = void 0;
var deinterlace = function deinterlace2(pixels, width) {
  var newPixels = new Array(pixels.length);
  var rows = pixels.length / width;
  var cpRow = function cpRow2(toRow2, fromRow2) {
    var fromPixels = pixels.slice(fromRow2 * width, (fromRow2 + 1) * width);
    newPixels.splice.apply(newPixels, [toRow2 * width, width].concat(fromPixels));
  };
  var offsets = [0, 4, 2, 1];
  var steps = [8, 8, 4, 2];
  var fromRow = 0;
  for (var pass = 0; pass < 4; pass++) {
    for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
      cpRow(toRow, fromRow);
      fromRow++;
    }
  }
  return newPixels;
};
deinterlace$1.deinterlace = deinterlace;
var lzw$1 = {};
Object.defineProperty(lzw$1, "__esModule", {
  value: true
});
lzw$1.lzw = void 0;
var lzw = function lzw2(minCodeSize, data, pixelCount) {
  var MAX_STACK_SIZE = 4096;
  var nullCode = -1;
  var npix = pixelCount;
  var available, clear, code_mask, code_size, end_of_information, in_code, old_code, bits, code, i, datum, data_size, first, top, bi, pi;
  var dstPixels = new Array(pixelCount);
  var prefix = new Array(MAX_STACK_SIZE);
  var suffix = new Array(MAX_STACK_SIZE);
  var pixelStack = new Array(MAX_STACK_SIZE + 1);
  data_size = minCodeSize;
  clear = 1 << data_size;
  end_of_information = clear + 1;
  available = clear + 2;
  old_code = nullCode;
  code_size = data_size + 1;
  code_mask = (1 << code_size) - 1;
  for (code = 0; code < clear; code++) {
    prefix[code] = 0;
    suffix[code] = code;
  }
  var datum, bits, first, top, pi, bi;
  datum = bits = first = top = pi = bi = 0;
  for (i = 0; i < npix; ) {
    if (top === 0) {
      if (bits < code_size) {
        datum += data[bi] << bits;
        bits += 8;
        bi++;
        continue;
      }
      code = datum & code_mask;
      datum >>= code_size;
      bits -= code_size;
      if (code > available || code == end_of_information) {
        break;
      }
      if (code == clear) {
        code_size = data_size + 1;
        code_mask = (1 << code_size) - 1;
        available = clear + 2;
        old_code = nullCode;
        continue;
      }
      if (old_code == nullCode) {
        pixelStack[top++] = suffix[code];
        old_code = code;
        first = code;
        continue;
      }
      in_code = code;
      if (code == available) {
        pixelStack[top++] = first;
        code = old_code;
      }
      while (code > clear) {
        pixelStack[top++] = suffix[code];
        code = prefix[code];
      }
      first = suffix[code] & 255;
      pixelStack[top++] = first;
      if (available < MAX_STACK_SIZE) {
        prefix[available] = old_code;
        suffix[available] = first;
        available++;
        if ((available & code_mask) === 0 && available < MAX_STACK_SIZE) {
          code_size++;
          code_mask += available;
        }
      }
      old_code = in_code;
    }
    top--;
    dstPixels[pi++] = pixelStack[top];
    i++;
  }
  for (i = pi; i < npix; i++) {
    dstPixels[i] = 0;
  }
  return dstPixels;
};
lzw$1.lzw = lzw;
Object.defineProperty(lib$1, "__esModule", {
  value: true
});
var decompressFrames_1 = lib$1.decompressFrames = lib$1.decompressFrame = parseGIF_1 = lib$1.parseGIF = void 0;
var _gif = _interopRequireDefault(gif);
var _jsBinarySchemaParser = lib;
var _uint = uint8;
var _deinterlace = deinterlace$1;
var _lzw = lzw$1;
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { "default": obj };
}
var parseGIF = function parseGIF2(arrayBuffer) {
  var byteData = new Uint8Array(arrayBuffer);
  return (0, _jsBinarySchemaParser.parse)((0, _uint.buildStream)(byteData), _gif["default"]);
};
var parseGIF_1 = lib$1.parseGIF = parseGIF;
var generatePatch = function generatePatch2(image) {
  var totalPixels = image.pixels.length;
  var patchData = new Uint8ClampedArray(totalPixels * 4);
  for (var i = 0; i < totalPixels; i++) {
    var pos = i * 4;
    var colorIndex = image.pixels[i];
    var color = image.colorTable[colorIndex] || [0, 0, 0];
    patchData[pos] = color[0];
    patchData[pos + 1] = color[1];
    patchData[pos + 2] = color[2];
    patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0;
  }
  return patchData;
};
var decompressFrame = function decompressFrame2(frame, gct, buildImagePatch) {
  if (!frame.image) {
    console.warn("gif frame does not have associated image.");
    return;
  }
  var image = frame.image;
  var totalPixels = image.descriptor.width * image.descriptor.height;
  var pixels = (0, _lzw.lzw)(image.data.minCodeSize, image.data.blocks, totalPixels);
  if (image.descriptor.lct.interlaced) {
    pixels = (0, _deinterlace.deinterlace)(pixels, image.descriptor.width);
  }
  var resultImage = {
    pixels,
    dims: {
      top: frame.image.descriptor.top,
      left: frame.image.descriptor.left,
      width: frame.image.descriptor.width,
      height: frame.image.descriptor.height
    }
  };
  if (image.descriptor.lct && image.descriptor.lct.exists) {
    resultImage.colorTable = image.lct;
  } else {
    resultImage.colorTable = gct;
  }
  if (frame.gce) {
    resultImage.delay = (frame.gce.delay || 10) * 10;
    resultImage.disposalType = frame.gce.extras.disposal;
    if (frame.gce.extras.transparentColorGiven) {
      resultImage.transparentIndex = frame.gce.transparentColorIndex;
    }
  }
  if (buildImagePatch) {
    resultImage.patch = generatePatch(resultImage);
  }
  return resultImage;
};
lib$1.decompressFrame = decompressFrame;
var decompressFrames = function decompressFrames2(parsedGif, buildImagePatches) {
  return parsedGif.frames.filter(function(f) {
    return f.image;
  }).map(function(f) {
    return decompressFrame(f, parsedGif.gct, buildImagePatches);
  });
};
decompressFrames_1 = lib$1.decompressFrames = decompressFrames;
class GifSource {
  /**
   * @param frames - Array of GifFrame instances.
   */
  constructor(frames) {
    if (!frames || !frames.length) throw new Error("Invalid frames");
    const [{ texture: { width, height } }] = frames;
    this.width = width;
    this.height = height;
    this.frames = frames;
    this.textures = this.frames.map((frame) => frame.texture);
    this.totalFrames = this.frames.length;
    this.duration = this.frames[this.totalFrames - 1].end;
  }
  /** Destroy animation data and don't use after this */
  destroy() {
    for (const texture of this.textures) {
      texture.destroy(true);
    }
    for (const frame of this.frames) {
      frame.texture = null;
    }
    this.frames.length = 0;
    this.textures.length = 0;
    Object.assign(this, {
      frames: null,
      textures: null,
      width: 0,
      height: 0,
      duration: 0,
      totalFrames: 0
    });
  }
  /**
   * Create an animated GIF animation from a GIF image's ArrayBuffer. The easiest way to get
   * the buffer is to use Assets.
   * @example
   * import { GifSource, GifSprite } from 'pixi.js/gif';
   *
   * const buffer = await fetch('./file.gif').then(res => res.arrayBuffer());
   * const source = GifSource.from(buffer);
   * const sprite = new GifSprite(source);
   * @param buffer - GIF image arraybuffer from Assets.
   * @param options - Optional options to use when building from buffer.
   */
  static from(buffer, options) {
    if (!buffer || buffer.byteLength === 0) {
      throw new Error("Invalid buffer");
    }
    const validateAndFix = (gif22) => {
      let currentGce = null;
      for (const frame of gif22.frames) {
        currentGce = frame.gce ?? currentGce;
        if ("image" in frame && !("gce" in frame)) {
          frame.gce = currentGce;
        }
      }
    };
    const gif2 = parseGIF_1(buffer);
    validateAndFix(gif2);
    const gifFrames = decompressFrames_1(gif2, true);
    const frames = [];
    const animWidth = gif2.lsd.width;
    const animHeight = gif2.lsd.height;
    const canvas = DOMAdapter.get().createCanvas(animWidth, animHeight);
    const context = canvas.getContext("2d", { willReadFrequently: true });
    const patchCanvas = DOMAdapter.get().createCanvas();
    const patchContext = patchCanvas.getContext("2d");
    let time = 0;
    let previousFrame = null;
    const { fps = 30, ...canvasSourceOptions } = options ?? {};
    const defaultDelay = 1e3 / fps;
    for (let i = 0; i < gifFrames.length; i++) {
      const {
        disposalType = 2,
        delay = defaultDelay,
        patch,
        dims: { width, height, left, top }
      } = gifFrames[i];
      patchCanvas.width = width;
      patchCanvas.height = height;
      patchContext.clearRect(0, 0, width, height);
      const patchData = patchContext.createImageData(width, height);
      patchData.data.set(patch);
      patchContext.putImageData(patchData, 0, 0);
      if (disposalType === 3) {
        previousFrame = context.getImageData(0, 0, animWidth, animHeight);
      }
      context.drawImage(patchCanvas, left, top);
      const imageData = context.getImageData(0, 0, animWidth, animHeight);
      if (disposalType === 2) {
        context.clearRect(0, 0, animWidth, animHeight);
      } else if (disposalType === 3) {
        context.putImageData(previousFrame, 0, 0);
      }
      const resource = DOMAdapter.get().createCanvas(
        imageData.width,
        imageData.height
      );
      const resourceContext = resource.getContext("2d");
      resourceContext.putImageData(imageData, 0, 0);
      frames.push({
        start: time,
        end: time + delay,
        texture: new Texture({
          source: new CanvasSource({
            resource,
            ...canvasSourceOptions
          })
        })
      });
      time += delay;
    }
    canvas.width = canvas.height = 0;
    patchCanvas.width = patchCanvas.height = 0;
    return new GifSource(frames);
  }
}
const GifAsset = {
  extension: ExtensionType.Asset,
  detection: {
    test: async () => true,
    add: async (formats) => [...formats, "gif"],
    remove: async (formats) => formats.filter((format) => format !== "gif")
  },
  loader: {
    /** used for deprecation purposes */
    name: "gifLoader",
    id: "gif",
    test: (url) => path.extname(url) === ".gif" || url.startsWith("data:image/gif"),
    load: async (url, asset) => {
      const response = await DOMAdapter.get().fetch(url);
      const buffer = await response.arrayBuffer();
      return GifSource.from(buffer, asset?.data);
    },
    unload: async (asset) => {
      asset.destroy();
    }
  }
};
const _GifSprite = class _GifSprite2 extends Sprite {
  constructor(...args) {
    const options = args[0] instanceof GifSource ? { source: args[0] } : args[0];
    const {
      source,
      fps,
      loop: loop3,
      animationSpeed,
      autoPlay,
      autoUpdate,
      onComplete,
      onFrameChange,
      onLoop,
      ...rest
    } = Object.assign(
      {},
      _GifSprite2.defaultOptions,
      options
    );
    super({ texture: Texture.EMPTY, ...rest });
    this.animationSpeed = 1;
    this.loop = true;
    this.duration = 0;
    this.autoPlay = true;
    this.dirty = false;
    this._currentFrame = 0;
    this._autoUpdate = false;
    this._isConnectedToTicker = false;
    this._playing = false;
    this._currentTime = 0;
    this.onRender = () => this._updateFrame();
    this.texture = source.textures[0];
    this.duration = source.frames[source.frames.length - 1].end;
    this._source = source;
    this._playing = false;
    this._currentTime = 0;
    this._isConnectedToTicker = false;
    Object.assign(this, {
      fps,
      loop: loop3,
      animationSpeed,
      autoPlay,
      autoUpdate,
      onComplete,
      onFrameChange,
      onLoop
    });
    this.currentFrame = 0;
    if (autoPlay) {
      this.play();
    }
  }
  /**
   * Stops the animation playback.
   * Halts at the current frame and disconnects from the ticker if auto-updating.
   * @example
   * ```ts
   * // Basic stop
   * const animation = new GifSprite({ source });
   * animation.stop();
   *
   * // Stop at specific frame
   * animation.currentFrame = 5;
   * animation.stop();
   *
   * // Stop and reset
   * animation.currentFrame = 0;
   * animation.stop();
   * ```
   * @remarks
   * - Does nothing if animation is already stopped
   * - Maintains current frame position
   * - Disconnects from shared ticker if auto-updating
   * - Can be resumed with play()
   * @see {@link GifSprite.play} For resuming playback
   * @see {@link GifSprite.currentFrame} For frame control
   */
  stop() {
    if (!this._playing) {
      return;
    }
    this._playing = false;
    if (this._autoUpdate && this._isConnectedToTicker) {
      Ticker.shared.remove(this.update, this);
      this._isConnectedToTicker = false;
    }
  }
  /**
   * Starts or resumes animation playback.
   * If animation is at the last frame and not looping, playback will restart from the beginning.
   * @example
   * ```ts
   * // Basic playback
   * const animation = new GifSprite({ source, autoPlay: false });
   * animation.play();
   *
   * // Play after stopping
   * animation.stop();
   * animation.play(); // Resumes from current frame
   *
   * // Play with auto-updating disabled
   * const animation = new GifSprite({
   *     source,
   *     autoPlay: false,
   *     autoUpdate: false
   * });
   * animation.play();
   * app.ticker.add((ticker) => {
   *     animation.update(ticker);
   * });
   * ```
   * @remarks
   * - Does nothing if animation is already playing
   * - Connects to shared ticker if autoUpdate is true
   * - Restarts from beginning if at last frame of non-looping animation
   * - Maintains current frame position otherwise
   * @see {@link GifSprite.stop} For stopping playback
   * @see {@link GifSprite.playing} For checking playback status
   * @see {@link GifSprite.autoUpdate} For controlling automatic updates
   */
  play() {
    if (this._playing) {
      return;
    }
    this._playing = true;
    if (this._autoUpdate && !this._isConnectedToTicker) {
      Ticker.shared.add(this.update, this, UPDATE_PRIORITY.HIGH);
      this._isConnectedToTicker = true;
    }
    if (!this.loop && this.currentFrame === this._source.frames.length - 1) {
      this._currentTime = 0;
    }
  }
  /**
   * Gets the current progress of the animation as a value between 0 and 1.
   * Useful for tracking animation completion and implementing progress bars.
   * @example
   * ```ts
   * // Basic progress tracking
   * const animation = new GifSprite({ source });
   * console.log('Progress:', Math.round(animation.progress * 100) + '%');
   *
   * // Update progress bar
   * app.ticker.add(() => {
   *     progressBar.width = animation.progress * 200; // 200px total width
   * });
   *
   * // Check if animation is near end
   * if (animation.progress > 0.9) {
   *     console.log('Animation almost complete!');
   * }
   * ```
   * @remarks
   * - Returns 0 at start
   * - Returns 1 when complete
   * - Updates continuously during playback
   * - Based on currentTime and total duration
   * @readonly
   * @see {@link GifSprite.duration} For total animation length
   */
  get progress() {
    return this._currentTime / this.duration;
  }
  /** `true` if the current animation is playing */
  get playing() {
    return this._playing;
  }
  /**
   * Updates the object transform for rendering.
   * This method is called automatically by the ticker if `autoUpdate` is enabled.
   * Only updates if the animation is currently playing.
   * > [!IMPORTANT] Call this manually when `autoUpdate` is set to `false` to control animation timing.
   * @param ticker - Ticker instance used to calculate frame timing
   * @example
   * ```ts
   * // Manual update with app ticker
   * const animation = new GifSprite({
   *     source,
   *     autoUpdate: false
   * });
   *
   * // Add to custom ticker
   * app.ticker.add(() => {
   *     animation.update(app.ticker);
   * });
   *
   * // Update with custom timing
   * const customTicker = new Ticker();
   * customTicker.add(() => {
   *     animation.update(customTicker);
   * });
   * ```
   * @see {@link GifSprite.autoUpdate} For automatic update control
   * @see {@link GifSprite.playing} For playback state
   * @see {@link Ticker} For timing system details
   */
  update(ticker) {
    if (!this._playing) {
      return;
    }
    const elapsed = this.animationSpeed * ticker.deltaTime / Ticker.targetFPMS;
    const currentTime = this._currentTime + elapsed;
    const localTime = currentTime % this.duration;
    const localFrame = this._source.frames.findIndex((frame) => frame.start <= localTime && frame.end > localTime);
    if (currentTime >= this.duration) {
      if (this.loop) {
        this._currentTime = localTime;
        this._updateFrameIndex(localFrame);
        this.onLoop?.();
      } else {
        this._currentTime = this.duration;
        this._updateFrameIndex(this.totalFrames - 1);
        this.onComplete?.();
        this.stop();
      }
    } else {
      this._currentTime = localTime;
      this._updateFrameIndex(localFrame);
    }
  }
  /** Redraw the current frame, is necessary for the animation to work when */
  _updateFrame() {
    if (!this.dirty) {
      return;
    }
    this.texture = this._source.frames[this._currentFrame].texture;
    this.dirty = false;
  }
  /**
   * Whether to use {@link Ticker.shared} to auto update animation time.
   * Controls if the animation updates automatically using the shared ticker.
   * @example
   * ```ts
   * // Using auto-update (default)
   * const animation = new GifSprite({
   *     source,
   *     autoUpdate: true
   * });
   *
   * // Manual updates
   * const animation = new GifSprite({
   *     source,
   *     autoUpdate: false
   * });
   *
   * // Custom update loop
   * app.ticker.add(() => {
   *     animation.update(app.ticker);
   * });
   *
   * // Switch update modes at runtime
   * animation.autoUpdate = false; // Disconnect from shared ticker
   * animation.autoUpdate = true;  // Reconnect if playing
   * ```
   * @default true
   * @see {@link GifSprite.update} For manual updating
   * @see {@link Ticker.shared} For the shared ticker instance
   */
  get autoUpdate() {
    return this._autoUpdate;
  }
  set autoUpdate(value) {
    if (value !== this._autoUpdate) {
      this._autoUpdate = value;
      if (!this._autoUpdate && this._isConnectedToTicker) {
        Ticker.shared.remove(this.update, this);
        this._isConnectedToTicker = false;
      } else if (this._autoUpdate && !this._isConnectedToTicker && this._playing) {
        Ticker.shared.add(this.update, this);
        this._isConnectedToTicker = true;
      }
    }
  }
  /**
   * Gets or sets the current frame number.
   * Controls which frame of the GIF animation is currently displayed.
   * @example
   * ```ts
   * // Get current frame
   * const animation = new GifSprite({ source });
   * console.log('Current frame:', animation.currentFrame);
   *
   * // Jump to specific frame
   * animation.currentFrame = 5;
   *
   * // Reset to first frame
   * animation.currentFrame = 0;
   *
   * // Get frame at specific progress
   * const frameAtProgress = Math.floor(animation.totalFrames * 0.5); // 50%
   * animation.currentFrame = frameAtProgress;
   * ```
   * @throws {Error} If frame index is out of range
   * @remarks
   * - Zero-based index (0 to totalFrames-1)
   * - Updates animation time to frame start
   * - Triggers frame change callback
   * - Marks sprite as dirty for redraw
   * @see {@link GifSprite.totalFrames} For frame count
   * @see {@link GifSprite.onFrameChange} For frame change events
   */
  get currentFrame() {
    return this._currentFrame;
  }
  set currentFrame(value) {
    this._updateFrameIndex(value);
    this._currentTime = this._source.frames[value].start;
  }
  /**
   * The source GIF data containing frame textures and timing information.
   * This represents the underlying animation data used by the sprite.
   * @example
   * ```ts
   * // Access source data
   * const animation = new GifSprite({ source });
   * const frameCount = animation.source.totalFrames;
   * const frameTexture = animation.source.textures[0];
   *
   * // Share source between sprites
   * const clone = new GifSprite({
   *     source: animation.source,
   *     autoPlay: false
   * });
   *
   * // Check source properties
   * console.log('Total frames:', animation.source.totalFrames);
   * console.log('Frame timing:', animation.source.frames);
   * ```
   * @remarks
   * - Contains all frame textures
   * - Manages frame timing data
   * - Can be shared between sprites
   * - Destroyed with sprite if destroyData=true
   * @readonly
   * @see {@link GifSource} For source data implementation
   * @see {@link GifSprite.clone} For creating independent instances
   */
  get source() {
    return this._source;
  }
  /**
   * Internally handle updating the frame index
   * @param value
   */
  _updateFrameIndex(value) {
    if (value < 0 || value >= this.totalFrames) {
      throw new Error(`Frame index out of range, expecting 0 to ${this.totalFrames}, got ${value}`);
    }
    if (this._currentFrame !== value) {
      this._currentFrame = value;
      this.dirty = true;
      this.onFrameChange?.(value);
    }
  }
  /**
   * Gets the total number of frames in the GIF animation.
   * @example
   * ```ts
   * // Get total frames
   * const animation = new GifSprite({ source });
   * console.log('Total frames:', animation.totalFrames);
   * ```
   * @readonly
   * @see {@link GifSprite.currentFrame} For current frame index
   * @see {@link GifSource.totalFrames} For source frame count
   */
  get totalFrames() {
    return this._source.totalFrames;
  }
  /**
   * Destroy and don't use after this.
   * @param destroyData - Destroy the data, cannot be used again.
   * @example
   * ```ts
   * const animation = new GifSprite({ source });
   * // Do something with animation...
   * animation.destroy(true); // Destroy the animation and its source data
   *
   * // If you want to keep the source data for reuse, use:
   * animation.destroy(false); // Destroy the animation but keep source data
   * ```
   */
  destroy(destroyData = false) {
    this.stop();
    super.destroy();
    if (destroyData) {
      this._source.destroy();
    }
    const forceClear = null;
    this._source = forceClear;
    this.onComplete = forceClear;
    this.onFrameChange = forceClear;
    this.onLoop = forceClear;
  }
  /**
   * Creates an independent copy of this GifSprite instance.
   * Useful for creating multiple animations that share the same source data
   * but can be controlled independently.
   * > [!IMPORTANT]
   * > The cloned sprite will have its own playback state, so you can play,
   * > pause, or seek it without affecting the original sprite.
   * @example
   * ```ts
   * // Create original animation
   * const animation = new GifSprite({ source });
   *
   * // Create independent clone
   * const clone = animation.clone();
   * clone.play();  // Plays independently
   * animation.stop(); // Original stops, clone continues
   *
   * // Clone with modified properties
   * const halfSpeed = animation.clone();
   * halfSpeed.animationSpeed = 0.5;
   * ```
   * @returns {GifSprite} A new GifSprite instance with the same properties
   * @see {@link GifSprite.source} For shared source data
   * @see {@link GifSprite.destroy} For cleanup
   */
  clone() {
    const clone = new _GifSprite2({
      source: this._source,
      autoUpdate: this._autoUpdate,
      loop: this.loop,
      autoPlay: this.autoPlay,
      animationSpeed: this.animationSpeed,
      onComplete: this.onComplete,
      onFrameChange: this.onFrameChange,
      onLoop: this.onLoop
    });
    clone.dirty = true;
    return clone;
  }
};
_GifSprite.defaultOptions = {
  fps: 30,
  loop: true,
  animationSpeed: 1,
  autoPlay: true,
  autoUpdate: true,
  onComplete: null,
  onFrameChange: null,
  onLoop: null
};
let GifSprite = _GifSprite;
extensions.add(GifAsset);
const MIN_TOKEN_CELLS = 0.25;
function snapTokenSize(raw, snap, max) {
  if (!Number.isFinite(raw)) return MIN_TOKEN_CELLS;
  const v = snap ? snapped(raw) : Math.round(raw * 100) / 100;
  return Math.max(MIN_TOKEN_CELLS, Math.min(max, v));
}
function snapped(v) {
  if (v < 0.375) return 0.25;
  if (v < 0.75) return 0.5;
  return Math.max(1, Math.round(v));
}
const KEY = "tacoyaki.mapCam.v1";
const MAX_ENTRIES = 300;
function loadAll() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const c = v;
      if (c && typeof c === "object" && Number.isFinite(c.cx) && Number.isFinite(c.cy) && Number.isFinite(c.scale))
        out[k] = c;
    }
    return out;
  } catch {
    return {};
  }
}
function persist(store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch {
  }
}
function camKey(roomId, mapId) {
  return (roomId || "local") + "/" + mapId;
}
function lastCamKey(roomId) {
  return "@last/" + (roomId || "local");
}
function loadMapCam(key) {
  const c = loadAll()[key];
  if (!c) return null;
  const ok = Number.isFinite(c.cx) && Number.isFinite(c.cy) && Number.isFinite(c.scale) && c.scale > 0;
  return ok ? c : null;
}
function saveMapCam(key, cam) {
  if (!Number.isFinite(cam.cx) || !Number.isFinite(cam.cy) || !(cam.scale > 0)) return;
  const store = loadAll();
  store[key] = {
    cx: cam.cx,
    cy: cam.cy,
    scale: cam.scale,
    at: Date.now(),
    ...cam.mapId ? { mapId: cam.mapId } : {}
  };
  const keys = Object.keys(store);
  if (keys.length > MAX_ENTRIES) {
    keys.sort((a, b) => (store[a].at ?? 0) - (store[b].at ?? 0)).slice(0, keys.length - MAX_ENTRIES).forEach((k) => delete store[k]);
  }
  persist(store);
}
const CELL = 64;
const MIN_SCALE = 0.15;
const MAX_SCALE = 4;
function scaleLimitsFor(cw, ch, vw, vh) {
  if (!(cw > 0) || !(ch > 0) || !(vw > 0) || !(vh > 0)) return { min: MIN_SCALE, max: MAX_SCALE };
  const fit = Math.min(vw / cw, vh / ch);
  return { min: Math.min(MIN_SCALE, fit / 2), max: Math.max(MAX_SCALE, fit * 8) };
}
function tokenBounds(tokens, cell) {
  if (!tokens.length) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const t of tokens) {
    const r = (t.size || 1) * cell / 2 + 40;
    x0 = Math.min(x0, t.x - r);
    y0 = Math.min(y0, t.y - r);
    x1 = Math.max(x1, t.x + r);
    y1 = Math.max(y1, t.y + r);
  }
  return { minX: x0, minY: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}
const DEFAULT_COLOR = 8166655;
const DEFAULT_HEX = "#7c9cff";
const STROKE_WIDTH = 4;
const PING_MS = 1100;
const STANDING_RETRY_MS = 1e4;
const STANDING_RETRY_MAX = 3;
const TEX_CACHE_BUDGET = 256 * 1024 * 1024;
const TEX_CACHE_BUDGET_MOBILE = 96 * 1024 * 1024;
const STATIC_TEX_MAX_DIM_MOBILE = 2048;
const ANIM_BUDGET_MOBILE = 64 * 1024 * 1024;
const texCacheBudget = () => isPhoneDevice() ? TEX_CACHE_BUDGET_MOBILE : TEX_CACHE_BUDGET;
const EMPTY_TOKENS$1 = [];
const EMPTY_HIDDEN = [];
const EMPTY_DRAWINGS = [];
const EMPTY_TEXTS = [];
function smoothTexture(src) {
  return Texture.from({
    resource: src,
    autoGenerateMipmaps: true,
    scaleMode: "linear",
    // 밉맵만으로는 비스듬히 줄어든 그림이 흐려진다. 지원하지 않는 기기에서는 조용히 무시된다.
    maxAnisotropy: TEX_ANISOTROPY
  });
}
const TEX_ANISOTROPY = 16;
const MIPMAP_BYTES_K = 4 / 3;
const ANIM_BYTES_K = 1 + MIPMAP_BYTES_K;
function penWidthNow() {
  const w = useUIStore.getState().penWidth;
  return typeof w === "number" && w > 0 ? w : STROKE_WIDTH;
}
const GIF_MAX_DIM = 1100;
const GIF_MAX_DIM_MOBILE = 640;
const gifMaxDim = () => isPhoneDevice() ? GIF_MAX_DIM_MOBILE : GIF_MAX_DIM;
function decodeGifScaled(buffer, maxDim) {
  const gif2 = parseGIF_1(buffer);
  const animW = gif2.lsd.width;
  const animH = gif2.lsd.height;
  const scale = Math.min(1, maxDim / Math.max(animW, animH));
  if (!(scale < 1)) return GifSource.from(buffer);
  const gifFrames = decompressFrames_1(gif2, true);
  if (!gifFrames.length) throw new Error("gif: no frames");
  const outW = Math.max(1, Math.round(animW * scale));
  const outH = Math.max(1, Math.round(animH * scale));
  const full = document.createElement("canvas");
  full.width = animW;
  full.height = animH;
  const fctx = full.getContext("2d", { willReadFrequently: true });
  const patch = document.createElement("canvas");
  const pctx = patch.getContext("2d");
  if (!fctx || !pctx) throw new Error("gif: no 2d context");
  const frames = [];
  let time = 0;
  let previous = null;
  for (const f of gifFrames) {
    const { width: pw, height: ph, left, top } = f.dims;
    patch.width = pw;
    patch.height = ph;
    pctx.clearRect(0, 0, pw, ph);
    const pdata = pctx.createImageData(pw, ph);
    pdata.data.set(f.patch);
    pctx.putImageData(pdata, 0, 0);
    if (f.disposalType === 3) previous = fctx.getImageData(0, 0, animW, animH);
    fctx.drawImage(patch, left, top);
    const out = document.createElement("canvas");
    out.width = outW;
    out.height = outH;
    const octx = out.getContext("2d");
    if (!octx) throw new Error("gif: no 2d context");
    octx.imageSmoothingQuality = "high";
    octx.drawImage(full, 0, 0, animW, animH, 0, 0, outW, outH);
    if (f.disposalType === 2) fctx.clearRect(0, 0, animW, animH);
    else if (f.disposalType === 3 && previous) fctx.putImageData(previous, 0, 0);
    const delay = f.delay > 0 ? f.delay : 100;
    frames.push({
      texture: new Texture({
        source: new CanvasSource({ resource: out, autoGenerateMipmaps: true, scaleMode: "linear", maxAnisotropy: TEX_ANISOTROPY })
      }),
      start: time,
      end: time + delay
    });
    time += delay;
  }
  full.width = full.height = 0;
  patch.width = patch.height = 0;
  return new GifSource(frames);
}
let animBusyCount = 0;
function animBusyStart() {
  if (++animBusyCount === 1) useUIStore.getState().setBusy("애니메이션 이미지 불러오는 중…");
}
function animBusyEnd() {
  animBusyCount = Math.max(0, animBusyCount - 1);
  if (animBusyCount === 0) useUIStore.getState().setBusy(null);
}
function hexToNum(hex, fallback = DEFAULT_COLOR) {
  if (!hex) return fallback;
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  return m ? parseInt(m[1], 16) : fallback;
}
function distToSeg(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 === 0) return Math.hypot(px - ax, py - ay);
  let t = ((px - ax) * dx + (py - ay) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
function strokeHit(s, px, py, thr) {
  const pts = s.points;
  if (pts.length === 2) return Math.hypot(px - pts[0], py - pts[1]) <= thr;
  for (let i = 0; i + 3 < pts.length; i += 2) {
    if (distToSeg(px, py, pts[i], pts[i + 1], pts[i + 2], pts[i + 3]) <= thr) return true;
  }
  return false;
}
let lastRotTapAt = 0;
let lastRotTapId = "";
const KEY_PAN_STEP = 64;
const KEY_PAN = {
  ArrowUp: [0, 1],
  ArrowDown: [0, -1],
  ArrowLeft: [1, 0],
  ArrowRight: [-1, 0],
  w: [0, 1],
  W: [0, 1],
  s: [0, -1],
  S: [0, -1],
  a: [1, 0],
  A: [1, 0],
  d: [-1, 0],
  D: [-1, 0]
};
function activeTokenImage(token) {
  const imgs = token.images;
  if (imgs && imgs.length) return imgs[token.currentIndex ?? 0] ?? token.image;
  return token.image;
}
function isButtonToken(t) {
  return !!(t.hoverImage || t.pressImage || t.sounds?.base || t.sounds?.hover || t.sounds?.press);
}
function MapStage({ onTokenContextMenu, onMapContextMenu }) {
  const elRef = reactExports.useRef(null);
  const appRef = reactExports.useRef(null);
  const worldRef = reactExports.useRef(null);
  const backdropRef = reactExports.useRef(null);
  const blurFilterRef = reactExports.useRef(null);
  const bgLayerRef = reactExports.useRef(null);
  const behindObjRef = reactExports.useRef(null);
  const bgObjRef = reactExports.useRef(null);
  const gridRef = reactExports.useRef(null);
  const tokenObjRef = reactExports.useRef(null);
  const standObjRef = reactExports.useRef(null);
  const barOverlayRef = reactExports.useRef(null);
  const barByTokenRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const drawGfxRef = reactExports.useRef(null);
  const scratchRef = reactExports.useRef(null);
  const measureRef = reactExports.useRef(null);
  const marqueeRef = reactExports.useRef(null);
  const measureTextRef = reactExports.useRef(null);
  const pingLayerRef = reactExports.useRef(null);
  const tooltipRef = reactExports.useRef(null);
  const tipTokenRef = reactExports.useRef(null);
  const dragHintRef = reactExports.useRef(null);
  const fadeRef = reactExports.useRef(null);
  const fadeTickRef = reactExports.useRef(null);
  const textObjRef = reactExports.useRef(null);
  const textVisRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const promptAddTextRef = reactExports.useRef(() => {
  });
  const promptEditTextRef = reactExports.useRef(() => {
  });
  const camRef = reactExports.useRef({ x: 60, y: 60, scale: 1 });
  const userMovedRef = reactExports.useRef(false);
  const lastBgImageRef = reactExports.useRef(void 0);
  const lastBgMapRef = reactExports.useRef("");
  const lastBgWHRef = reactExports.useRef({ w: 0, h: 0 });
  const dragRef = reactExports.useRef({ mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 });
  const pendingSyncRef = reactExports.useRef(false);
  const pingAnim = reactExports.useRef(/* @__PURE__ */ new Set());
  const texCache = reactExports.useRef(/* @__PURE__ */ new Map());
  const pendingTex = reactExports.useRef(/* @__PURE__ */ new Set());
  const evictHoldSize = reactExports.useRef(-1);
  const shrunkBackdrop = reactExports.useRef(null);
  const standingUrls = reactExports.useRef(/* @__PURE__ */ new Map());
  const pendingStanding = reactExports.useRef(/* @__PURE__ */ new Set());
  const standingFail = reactExports.useRef(/* @__PURE__ */ new Map());
  const standingRetryTimer = reactExports.useRef(void 0);
  const syncRaf = reactExports.useRef(void 0);
  const animBytesTotal = reactExports.useRef(0);
  const gifCache = reactExports.useRef(/* @__PURE__ */ new Map());
  const pendingGif = reactExports.useRef(/* @__PURE__ */ new Set());
  const badGif = reactExports.useRef(/* @__PURE__ */ new Set());
  const liveGifs = reactExports.useRef(/* @__PURE__ */ new Map());
  const animKind = reactExports.useRef(/* @__PURE__ */ new Map());
  const animCache = reactExports.useRef(/* @__PURE__ */ new Map());
  const pendingAnim = reactExports.useRef(/* @__PURE__ */ new Set());
  const badAnim = reactExports.useRef(/* @__PURE__ */ new Set());
  const liveAnims = reactExports.useRef(/* @__PURE__ */ new Map());
  const activeMapId = useMapStore((s) => s.activeMapId);
  const activeMap = useMapStore((s) => s.maps[s.activeMapId]);
  const globalTokens = useMapStore((s) => s.globalTokens);
  const snap = useMapStore((s) => s.snap);
  const tool = useMapStore((s) => s.tool);
  const selectedId = useMapStore((s) => s.selectedId);
  const selectedIds = useMapStore((s) => s.selectedIds);
  const resizingId = useMapStore((s) => s.resizingId);
  const pings = useMapStore((s) => s.pings);
  const fitNonce = useMapStore((s) => s.fitNonce);
  const focusReq = useMapStore((s) => s.focusReq);
  const roster = useNetStore((s) => s.roster);
  const charPool = useNetStore((s) => s.charPool);
  const self = useNetStore((s) => s.self);
  const roomId = useNetStore((s) => s.roomId);
  const netStatus = useNetStore((s) => s.status);
  const hiddenLayers = useMapStore((s) => s.maps[s.activeMapId]?.hiddenLayers) ?? EMPTY_HIDDEN;
  const tokens = reactExports.useMemo(() => {
    const shared = globalTokens.filter((t) => !t.mapIds || t.mapIds.includes(activeMapId));
    return shared.length ? [...shared, ...activeMap?.tokens ?? EMPTY_TOKENS$1] : activeMap?.tokens ?? EMPTY_TOKENS$1;
  }, [globalTokens, activeMap?.tokens, activeMapId]);
  const background = activeMap?.background ?? null;
  const grid = activeMap?.grid ?? DEFAULT_GRID;
  const drawings = activeMap?.drawings ?? EMPTY_DRAWINGS;
  const texts = activeMap?.texts ?? EMPTY_TEXTS;
  const bgColor = activeMap?.bgColor;
  const backdrop = activeMap?.backdrop ?? null;
  const crossfade = activeMap?.crossfade;
  const messages = useChatStore((s) => s.messages);
  const { spokenByChar, spokenSig } = reactExports.useMemo(() => {
    const byChar = /* @__PURE__ */ new Map();
    for (const m of messages) {
      if (!m.standing || m.channel !== "main" || m.secret || m.to) continue;
      if (m.kind !== "speech" && m.kind !== "narration") continue;
      if (m.playerId) byChar.set(m.playerId + " " + (m.author ?? ""), m.standing);
    }
    const tok = (v) => v.length + "~" + v.slice(0, 16) + v.slice(-16);
    const sig = [...byChar].map(([k, v]) => k + "~" + tok(v)).join("|");
    return { spokenByChar: byChar, spokenSig: sig };
  }, [messages]);
  const latest = reactExports.useRef({
    tokens,
    background,
    grid,
    drawings,
    texts,
    bgColor,
    backdrop,
    crossfade,
    snap,
    tool,
    selectedId,
    selectedIds,
    resizingId,
    roster,
    charPool,
    self,
    spokenByChar
  });
  latest.current = {
    tokens,
    background,
    grid,
    drawings,
    texts,
    bgColor,
    backdrop,
    crossfade,
    snap,
    tool,
    selectedId,
    selectedIds,
    resizingId,
    roster,
    charPool,
    self,
    spokenByChar
  };
  const onCtxRef = reactExports.useRef(onTokenContextMenu);
  onCtxRef.current = onTokenContextMenu;
  const onMapCtxRef = reactExports.useRef(onMapContextMenu);
  onMapCtxRef.current = onMapContextMenu;
  const camKeyRef = reactExports.useRef("");
  camKeyRef.current = camKey(roomId, activeMapId);
  const lastCamKeyRef = reactExports.useRef("");
  lastCamKeyRef.current = lastCamKey(roomId);
  const activeMapIdRef = reactExports.useRef(activeMapId);
  activeMapIdRef.current = activeMapId;
  const keepView = useUIStore((s) => s.mapKeepView);
  const keepViewRef = reactExports.useRef(keepView);
  keepViewRef.current = keepView;
  const camSavePending = reactExports.useRef(null);
  const carriedRef = reactExports.useRef(false);
  const uiZoom = () => effectiveUiScale();
  function fixGlobal(e) {
    const app = appRef.current;
    const canvas = app?.canvas;
    if (!app || !canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const z = uiZoom();
    e.global.x = (e.client.x / z - rect.left) / rect.width * app.screen.width;
    e.global.y = (e.client.y / z - rect.top) / rect.height * app.screen.height;
  }
  async function promptAddText(wx, wy) {
    const text = await promptText({
      title: "맵 텍스트",
      label: "맵에 표시할 글자(엔터로 추가)",
      placeholder: "텍스트 입력"
    });
    if (text == null) return;
    const t = text.trim();
    if (!t) return;
    const ui = useUIStore.getState();
    const me = latest.current.self;
    useMapStore.getState().addText({
      x: Math.round(wx),
      y: Math.round(wy),
      text: t,
      color: ui.mapTextColor,
      size: ui.mapTextSize,
      bold: ui.mapTextBold,
      playerId: me?.playerId ?? "local"
    });
  }
  promptAddTextRef.current = (wx, wy) => void promptAddText(wx, wy);
  async function promptEditText(existing) {
    const text = await promptText({
      title: "맵 텍스트 수정",
      label: "글자 (비우면 삭제)",
      defaultValue: existing.text
    });
    if (text == null) return;
    const t = text.trim();
    const st = useMapStore.getState();
    if (!t) {
      st.removeText(existing.id);
      return;
    }
    st.editText(existing.id, { text: t });
  }
  promptEditTextRef.current = (existing) => void promptEditText(existing);
  const handleVisRef = reactExports.useRef([]);
  const spaceHeldRef = reactExports.useRef(false);
  const rRotateRef = reactExports.useRef({
    active: false,
    tokenId: "",
    cx: 0,
    cy: 0,
    rot: 0
  });
  const tokenVisRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const fitFnRef = reactExports.useRef(null);
  const keyCleanupRef = reactExports.useRef(null);
  const pinchCleanupRef = reactExports.useRef(null);
  const pendingCamInitRef = reactExports.useRef(false);
  function handleScale() {
    return Math.max(0.7, Math.min(7, 1 / (camRef.current.scale || 1)));
  }
  function saveCamFor(key, lastKey, sceneToo, mapId) {
    const app = appRef.current;
    if (!app) return;
    const c = camRef.current;
    const vw = app.screen.width;
    const vh = app.screen.height;
    if (!vw || !vh || !(c.scale > 0)) return;
    const view = { cx: (vw / 2 - c.x) / c.scale, cy: (vh / 2 - c.y) / c.scale, scale: c.scale };
    if (sceneToo) saveMapCam(key, view);
    saveMapCam(lastKey, { ...view, mapId });
  }
  function scheduleCamSave() {
    const key = camKeyRef.current;
    const lastKey = lastCamKeyRef.current;
    const sceneToo = !carriedRef.current;
    const mapId = activeMapIdRef.current;
    if (camSavePending.current) clearTimeout(camSavePending.current.timer);
    camSavePending.current = {
      key,
      lastKey,
      sceneToo,
      mapId,
      timer: window.setTimeout(() => {
        camSavePending.current = null;
        saveCamFor(key, lastKey, sceneToo, mapId);
      }, 400)
    };
  }
  function flushCamSave() {
    const p = camSavePending.current;
    if (!p) return;
    clearTimeout(p.timer);
    camSavePending.current = null;
    saveCamFor(p.key, p.lastKey, p.sceneToo, p.mapId);
  }
  function markUserMoved() {
    userMovedRef.current = true;
    carriedRef.current = false;
  }
  function cancelCamSave() {
    const p = camSavePending.current;
    if (!p) return;
    clearTimeout(p.timer);
    camSavePending.current = null;
  }
  function applyCamera() {
    const w = worldRef.current;
    if (!w) return;
    const c = camRef.current;
    w.position.set(c.x, c.y);
    w.scale.set(c.scale);
    const f = handleScale();
    for (const h of handleVisRef.current) if (!h.destroyed) h.scale.set(f);
    if (userMovedRef.current) scheduleCamSave();
  }
  function applyBgColor() {
    const app = appRef.current;
    if (!app) return;
    const c = latest.current.bgColor;
    app.renderer.background.alpha = 1;
    app.renderer.background.color = c || "#000000";
  }
  function applyBackdrop() {
    const app = appRef.current;
    const sp = backdropRef.current;
    const bf = blurFilterRef.current;
    if (!app || !sp) return;
    const bd = latest.current.backdrop;
    const img = bd?.image;
    if (!img) {
      sp.visible = false;
      return;
    }
    const tex = getTex(img);
    if (!tex) {
      loadTexture(img);
      sp.visible = false;
      return;
    }
    let useTex = tex;
    const longSide = Math.max(tex.width || 1, tex.height || 1);
    if (longSide > BACKDROP_MAX_DIM) {
      const cur = shrunkBackdrop.current;
      if (cur && cur.img === img) useTex = cur.tex;
      else {
        try {
          const tmp = new Sprite(tex);
          tmp.scale.set(BACKDROP_MAX_DIM / longSide);
          const rt = isPhoneDevice() ? app.renderer.generateTexture({ target: tmp, resolution: 1, antialias: false }) : app.renderer.generateTexture(tmp);
          tmp.destroy();
          if (cur) {
            try {
              cur.tex.destroy(true);
            } catch {
            }
          }
          shrunkBackdrop.current = { img, tex: rt };
          useTex = rt;
        } catch {
        }
      }
    }
    sp.texture = useTex;
    sp.visible = true;
    const vw = app.screen.width;
    const vh = app.screen.height;
    const tw = useTex.width || 1;
    const th = useTex.height || 1;
    const blur = Math.max(0, bd.blur ?? 0);
    const pad = blur > 0 ? 1 + Math.min(0.25, blur / 100) : 1;
    const scale = Math.max(vw / tw, vh / th) * pad;
    sp.width = tw * scale;
    sp.height = th * scale;
    sp.position.set(vw / 2, vh / 2);
    if (bf) {
      bf.strength = blur;
      sp.filters = blur > 0 ? [bf] : [];
    }
  }
  function showTooltip(text, e) {
    const tip = tooltipRef.current;
    const app = appRef.current;
    if (!tip || !app || !text) return;
    fixGlobal(e);
    tip.text = text;
    const x = Math.min(e.global.x + 14, app.screen.width - tip.width - 6);
    const y = Math.min(e.global.y + 14, app.screen.height - tip.height - 6);
    tip.position.set(Math.max(6, x), Math.max(6, y));
    tip.visible = true;
  }
  function hideTooltip() {
    const tip = tooltipRef.current;
    if (tip) tip.visible = false;
  }
  function showDragHint(text, e) {
    const el = dragHintRef.current;
    const app = appRef.current;
    if (!el || !app) return;
    fixGlobal(e);
    if (el.textContent !== text) el.textContent = text;
    if (el.style.display !== "block") el.style.display = "block";
    el.style.left = `${Math.max(4, Math.min(e.global.x + 16, app.screen.width - 80))}px`;
    el.style.top = `${Math.max(4, Math.min(e.global.y + 18, app.screen.height - 30))}px`;
  }
  function hideDragHint() {
    const el = dragHintRef.current;
    if (el) el.style.display = "none";
  }
  function applyLayerVisibility() {
    const s = useMapStore.getState();
    const hl = s.maps[s.activeMapId]?.hiddenLayers ?? [];
    if (behindObjRef.current) behindObjRef.current.visible = !hl.includes("behind");
    if (bgObjRef.current) bgObjRef.current.visible = !hl.includes("bg");
    if (tokenObjRef.current) tokenObjRef.current.visible = !hl.includes("token");
    if (standObjRef.current) standObjRef.current.visible = !hl.includes("standing");
    if (barOverlayRef.current)
      for (const ch of barOverlayRef.current.children)
        ch.visible = !hl.includes(String(ch.label ?? ""));
  }
  function moveBarWith(tokenId, x, y) {
    const e = barByTokenRef.current.get(tokenId);
    if (e && !e.bar.destroyed) e.bar.position.set(x, y + e.dy);
  }
  function fireClickAction(text) {
    const me = latest.current.self;
    const t = text.trim();
    if (!t || !me) return;
    useChatStore.getState().send(t, { name: me.nick, color: me.color }, { channel: "main" });
  }
  function fireCardTrigger(tokenId) {
    useNetStore.getState().triggerCard(activeMapIdRef.current, tokenId);
  }
  function playCrossfade() {
    const app = appRef.current;
    const fade = fadeRef.current;
    if (!app || !fade) return;
    if (fadeTickRef.current) {
      app.ticker.remove(fadeTickRef.current);
      fadeTickRef.current = null;
    }
    fade.clear().rect(0, 0, app.screen.width, app.screen.height).fill({ color: 0 });
    fade.alpha = 1;
    fade.visible = true;
    let elapsed = 0;
    const durMs = 350;
    const tick = (ticker) => {
      elapsed += ticker.deltaMS;
      const t = Math.min(1, elapsed / durMs);
      fade.alpha = 1 - t;
      if (t >= 1) {
        fade.visible = false;
        app.ticker.remove(tick);
        if (fadeTickRef.current === tick) fadeTickRef.current = null;
      }
    };
    fadeTickRef.current = tick;
    app.ticker.add(tick);
  }
  function getTex(url) {
    const t = texCache.current.get(url);
    if (t !== void 0) {
      texCache.current.delete(url);
      texCache.current.set(url, t);
    }
    return t;
  }
  function evictTextures() {
    const app = appRef.current;
    if (!app) return;
    const bytesOf = (key, t) => key.length * 2 + (t.source?.pixelWidth || t.width || 1) * (t.source?.pixelHeight || t.height || 1) * 4 * (t.source?.autoGenerateMipmaps ? MIPMAP_BYTES_K : 1);
    const budget = texCacheBudget();
    let total = 0;
    for (const [k, t] of texCache.current) total += bytesOf(k, t);
    if (total <= budget) {
      evictHoldSize.current = -1;
      return;
    }
    if (texCache.current.size === evictHoldSize.current) return;
    const live = /* @__PURE__ */ new Set();
    const collect = (node) => {
      const tex = node.texture;
      if (tex) live.add(tex);
      for (const c of node.children) collect(c);
    };
    collect(app.stage);
    const keep = /* @__PURE__ */ new Set([latest.current.background?.image, latest.current.backdrop?.image]);
    let protectedBytes = 0;
    for (const [k, t] of texCache.current) if (live.has(t) || keep.has(k)) protectedBytes += bytesOf(k, t);
    if (protectedBytes > budget) {
      evictHoldSize.current = texCache.current.size;
      return;
    }
    evictHoldSize.current = -1;
    for (const [k, t] of texCache.current) {
      if (total <= budget) break;
      if (live.has(t) || keep.has(k)) continue;
      texCache.current.delete(k);
      total -= bytesOf(k, t);
      try {
        t.destroy(true);
      } catch {
      }
    }
  }
  function loadTexture(url) {
    if (getTex(url) !== void 0 || pendingTex.current.has(url)) return;
    pendingTex.current.add(url);
    const img = new Image();
    img.onload = () => {
      if (!pendingTex.current.has(url)) return;
      try {
        const nw = img.naturalWidth || 1;
        const nh = img.naturalHeight || 1;
        const long = Math.max(nw, nh);
        if (isPhoneDevice() && long > STATIC_TEX_MAX_DIM_MOBILE) {
          const s = STATIC_TEX_MAX_DIM_MOBILE / long;
          const c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(nw * s));
          c.height = Math.max(1, Math.round(nh * s));
          const ctx = c.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, c.width, c.height);
            texCache.current.set(url, smoothTexture(c));
          } else texCache.current.set(url, smoothTexture(img));
        } else texCache.current.set(url, smoothTexture(img));
      } catch {
      }
      pendingTex.current.delete(url);
      scheduleSync();
    };
    img.onerror = () => {
      pendingTex.current.delete(url);
    };
    img.src = url;
  }
  function isGif(url) {
    return !!url && (url.startsWith("data:image/gif") || /\.gif(\?|$)/i.test(url));
  }
  function armStandingRetry(delay) {
    if (standingRetryTimer.current !== void 0) return;
    standingRetryTimer.current = window.setTimeout(() => {
      standingRetryTimer.current = void 0;
      scheduleSync();
    }, delay);
  }
  function resolveStanding(ref) {
    if (!ref.startsWith("asset:")) return ref;
    const hit = standingUrls.current.get(ref);
    if (hit !== void 0) return hit || void 0;
    const fail = standingFail.current.get(ref);
    if (fail && Date.now() - fail.at < STANDING_RETRY_MS) {
      armStandingRetry(STANDING_RETRY_MS - (Date.now() - fail.at) + 250);
      return void 0;
    }
    if (!pendingStanding.current.has(ref)) {
      pendingStanding.current.add(ref);
      void fetchAssetDataUrl(ref).then((u) => {
        pendingStanding.current.delete(ref);
        const ok = !!u && u !== ref;
        if (ok) {
          standingUrls.current.set(ref, u);
          standingFail.current.delete(ref);
          scheduleSync();
        } else {
          const n = (standingFail.current.get(ref)?.n ?? 0) + 1;
          if (n >= STANDING_RETRY_MAX) {
            standingUrls.current.set(ref, "");
          } else {
            standingFail.current.set(ref, { at: Date.now(), n });
            armStandingRetry(STANDING_RETRY_MS + 250);
          }
        }
      });
    }
    return void 0;
  }
  function characterStandingRef(token, ch) {
    if (!token.charPlayerId) return void 0;
    const isStanding = (token.layer ?? "token") === "standing" || token.liveStanding;
    if (!isStanding) return void 0;
    const sameChar = token.charId ? ch?.charId === token.charId : (ch?.name ?? "") === (token.label ?? "");
    if (token.liveStanding && ch && sameChar) {
      const live = activeStanding(ch);
      if (live) return live;
    }
    const spoken = latest.current.spokenByChar.get(token.charPlayerId + " " + (token.label ?? ""));
    if (spoken) return spoken;
    return void 0;
  }
  function loadGif(url) {
    if (gifCache.current.has(url) || pendingGif.current.has(url) || badGif.current.has(url)) return;
    pendingGif.current.add(url);
    loadTexture(url);
    const done = () => {
      pendingGif.current.delete(url);
      scheduleSync();
    };
    fetch(url).then((r) => r.arrayBuffer()).then((buf) => {
      animBusyStart();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.setTimeout(() => {
            try {
              const ab = forceGifInfiniteLoop(new Uint8Array(buf)).buffer;
              if (isPhoneDevice()) {
                try {
                  const g = parseGIF_1(ab);
                  const sc = Math.min(1, gifMaxDim() / Math.max(g.lsd.width || 1, g.lsd.height || 1));
                  const fw = Math.max(1, Math.round((g.lsd.width || 1) * sc));
                  const fh = Math.max(1, Math.round((g.lsd.height || 1) * sc));
                  const est = Math.max(1, g.frames?.length || 1) * fw * fh * 4 * ANIM_BYTES_K;
                  if (animBytesTotal.current + est > ANIM_BUDGET_MOBILE) {
                    badGif.current.add(url);
                    animBusyEnd();
                    done();
                    return;
                  }
                } catch {
                }
              }
              let src = null;
              try {
                src = decodeGifScaled(ab, gifMaxDim());
              } catch {
                try {
                  src = GifSource.from(ab);
                } catch {
                  src = null;
                }
              }
              if (src && Array.isArray(src.textures) && src.textures.length > 0) {
                gifCache.current.set(url, src);
                animBytesTotal.current += src.textures.reduce(
                  (s, t) => s + (t.width || 1) * (t.height || 1) * 4 * ANIM_BYTES_K,
                  0
                );
              } else {
                try {
                  src?.destroy();
                } catch {
                }
                badGif.current.add(url);
              }
            } catch {
              badGif.current.add(url);
            }
            animBusyEnd();
            done();
          }, 0);
        });
      });
    }).catch(() => {
      badGif.current.add(url);
      done();
    });
  }
  function dataUrlHeadBytes(url, maxBytes) {
    const comma = url.indexOf(",");
    if (comma < 0) return new Uint8Array(0);
    const b64 = url.slice(comma + 1);
    const chars = Math.min(b64.length, Math.ceil(maxBytes / 3) * 4);
    const bin = atob(b64.slice(0, chars));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function isAnimImg(url) {
    const cached = animKind.current.get(url);
    if (cached !== void 0) return cached;
    let anim = false;
    try {
      const m = /^data:image\/(png|apng|webp)[;,]/i.exec(url);
      if (m) {
        const kind = m[1].toLowerCase();
        anim = kind === "webp" ? webpIsAnimated(dataUrlHeadBytes(url, 64)) : pngIsAnimated(dataUrlHeadBytes(url, 65536));
      }
    } catch {
      anim = false;
    }
    animKind.current.set(url, anim);
    return anim;
  }
  async function decodeAnimFrames(url, maxDim) {
    const Dec = globalThis.ImageDecoder;
    if (!Dec) throw new Error("ImageDecoder unavailable");
    const buf = await (await fetch(url)).arrayBuffer();
    const mime = /^data:([^;,]+)/.exec(url)?.[1]?.toLowerCase() || "image/png";
    const type = mime === "image/apng" ? "image/png" : mime;
    const dec = new Dec({ data: buf, type, preferAnimation: true });
    try {
      await dec.tracks.ready;
      await dec.completed;
      const count = dec.tracks.selectedTrack?.frameCount ?? 1;
      if (count <= 1) return [];
      const frames = [];
      const budgetLeft = isPhoneDevice() ? Math.max(0, ANIM_BUDGET_MOBILE - animBytesTotal.current) : Infinity;
      const dropAll = () => {
        for (const f of frames) {
          try {
            f.texture.destroy(true);
          } catch {
          }
        }
        return [];
      };
      let bytesSoFar = 0;
      for (let i = 0; i < count; i++) {
        const { image } = await dec.decode({ frameIndex: i });
        const w = image.displayWidth || image.codedWidth;
        const h = image.displayHeight || image.codedHeight;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        const ow = Math.max(1, Math.round(w * scale));
        const oh = Math.max(1, Math.round(h * scale));
        if (i === 0 && count * ow * oh * 4 * ANIM_BYTES_K > budgetLeft) {
          image.close();
          return dropAll();
        }
        bytesSoFar += ow * oh * 4 * ANIM_BYTES_K;
        if (bytesSoFar > budgetLeft) {
          image.close();
          return dropAll();
        }
        const cv = document.createElement("canvas");
        cv.width = ow;
        cv.height = oh;
        const ctx = cv.getContext("2d");
        if (!ctx) {
          image.close();
          throw new Error("no 2d context");
        }
        ctx.drawImage(image, 0, 0, ow, oh);
        const ms = (image.duration ?? 1e5) / 1e3;
        image.close();
        frames.push({
          texture: new Texture({
            source: new CanvasSource({ resource: cv, autoGenerateMipmaps: true, scaleMode: "linear", maxAnisotropy: TEX_ANISOTROPY })
          }),
          time: ms > 0 ? ms : 100
        });
      }
      return frames;
    } finally {
      dec.close();
    }
  }
  function releaseGifBytes(src) {
    try {
      const bytes = (src.textures ?? []).reduce((s, t) => s + (t.width || 1) * (t.height || 1) * 4 * ANIM_BYTES_K, 0);
      animBytesTotal.current = Math.max(0, animBytesTotal.current - bytes);
      src.destroy();
    } catch {
    }
  }
  function releaseAnimBytes(frames) {
    let bytes = 0;
    for (const f of frames) {
      bytes += (f.texture.width || 1) * (f.texture.height || 1) * 4 * ANIM_BYTES_K;
      try {
        f.texture.destroy(true);
      } catch {
      }
    }
    animBytesTotal.current = Math.max(0, animBytesTotal.current - bytes);
  }
  function loadAnim(url) {
    if (animCache.current.has(url) || pendingAnim.current.has(url) || badAnim.current.has(url)) return;
    pendingAnim.current.add(url);
    loadTexture(url);
    const done = () => {
      pendingAnim.current.delete(url);
      animBusyEnd();
      scheduleSync();
    };
    animBusyStart();
    decodeAnimFrames(url, gifMaxDim()).then((frames) => {
      const bytes = frames.reduce((s, f) => s + (f.texture.width || 1) * (f.texture.height || 1) * 4 * ANIM_BYTES_K, 0);
      if (isPhoneDevice() && animBytesTotal.current + bytes > ANIM_BUDGET_MOBILE) {
        for (const f of frames) {
          try {
            f.texture.destroy(true);
          } catch {
          }
        }
        badAnim.current.add(url);
        done();
        return;
      }
      if (frames.length > 1) {
        animCache.current.set(url, frames);
        animBytesTotal.current += bytes;
      } else badAnim.current.add(url);
      done();
    }).catch(() => {
      badAnim.current.add(url);
      done();
    });
  }
  function makeImageSprite(img, ownerId) {
    if (isGif(img) && !badGif.current.has(img)) {
      if (ownerId) {
        const cached = liveGifs.current.get(ownerId);
        if (cached) {
          if (cached.img === img && !cached.sprite.destroyed) {
            cached.sprite.parent?.removeChild(cached.sprite);
            return cached.sprite;
          }
          try {
            cached.sprite.destroy(false);
          } catch {
          }
          liveGifs.current.delete(ownerId);
        }
      }
      const src = gifCache.current.get(img);
      if (src) {
        try {
          const gs = new GifSprite({ source: src, loop: true });
          if (ownerId) liveGifs.current.set(ownerId, { sprite: gs, img });
          return gs;
        } catch {
          releaseGifBytes(src);
          badGif.current.add(img);
          gifCache.current.delete(img);
        }
      } else {
        loadGif(img);
      }
      const tex2 = getTex(img);
      if (tex2) return new Sprite(tex2);
      return null;
    }
    if (isAnimImg(img) && !badAnim.current.has(img)) {
      if (ownerId) {
        const cached = liveAnims.current.get(ownerId);
        if (cached) {
          if (cached.img === img && !cached.sprite.destroyed) {
            cached.sprite.parent?.removeChild(cached.sprite);
            return cached.sprite;
          }
          try {
            cached.sprite.destroy({ children: true });
          } catch {
          }
          liveAnims.current.delete(ownerId);
        }
      }
      const frames = animCache.current.get(img);
      if (frames) {
        try {
          const as = new AnimatedSprite(frames);
          as.loop = true;
          as.play();
          if (ownerId) liveAnims.current.set(ownerId, { sprite: as, img });
          return as;
        } catch {
          releaseAnimBytes(frames);
          badAnim.current.add(img);
          animCache.current.delete(img);
        }
      } else {
        loadAnim(img);
      }
      const tex2 = getTex(img);
      if (tex2) return new Sprite(tex2);
      return null;
    }
    const tex = getTex(img);
    if (tex) return new Sprite(tex);
    loadTexture(img);
    return null;
  }
  function disposeChild(child) {
    if (child instanceof GifSprite) child.destroy(false);
    else if (child instanceof AnimatedSprite)
      child.destroy({ children: true, texture: false });
    else child.destroy({ children: true });
  }
  function scheduleSync() {
    if (syncRaf.current != null) return;
    syncRaf.current = requestAnimationFrame(() => {
      syncRaf.current = void 0;
      syncBackground();
      syncTokens();
    });
  }
  function redrawGrid() {
    const g = gridRef.current;
    if (!g) return;
    g.clear();
    const { background: bg, grid: grid2 } = latest.current;
    if (!grid2.visible) return;
    const size = grid2.size || CELL;
    const w = bg?.w || 2400;
    const h = bg?.h || 2400;
    for (let x = 0; x <= w; x += size) g.moveTo(x, 0).lineTo(x, h);
    for (let y = 0; y <= h; y += size) g.moveTo(0, y).lineTo(w, y);
    g.stroke({ width: 1, color: 16777215, alpha: 0.08 });
  }
  function redrawDrawings() {
    const g = drawGfxRef.current;
    if (!g) return;
    g.clear();
    for (const s of latest.current.drawings) {
      const pts = s.points;
      if (pts.length < 2) continue;
      const color = hexToNum(s.color);
      if (pts.length === 2) {
        g.circle(pts[0], pts[1], Math.max(1, s.width / 2)).fill({ color, alpha: 0.92 });
        continue;
      }
      g.moveTo(pts[0], pts[1]);
      for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
      g.stroke({ width: s.width, color, alpha: 0.92, cap: "round", join: "round" });
    }
  }
  function syncTexts() {
    const layer = textObjRef.current;
    if (!layer) return;
    const self2 = latest.current.self;
    const tool2 = latest.current.tool;
    for (const c of layer.removeChildren()) c.destroy({ children: true });
    textVisRef.current.clear();
    for (const t of latest.current.texts) {
      const editable = canEditText(t, self2);
      const label = new Text({
        text: t.text,
        style: {
          fill: hexToNum(t.color),
          fontSize: t.size,
          fontWeight: t.bold ? "700" : "400",
          fontFamily: "sans-serif",
          align: "center",
          stroke: { color: 0, width: Math.max(2, Math.round(t.size / 9)) },
          // 검정 외곽선(가독성·기본 흰 글씨와 대비)
          wordWrap: true,
          wordWrapWidth: 1400
        }
      });
      label.anchor.set(0.5);
      label.position.set(t.x, t.y);
      const interactive = tool2 === "select" && editable || tool2 === "text";
      label.eventMode = interactive ? "static" : "none";
      label.cursor = tool2 === "text" ? "text" : editable ? "move" : "default";
      if (interactive) {
        label.on("pointerdown", (e) => {
          if (e.button === 2) {
            e.stopPropagation();
            if (canEditText(t, latest.current.self)) useMapStore.getState().removeText(t.id);
            return;
          }
          e.stopPropagation();
          fixGlobal(e);
          const tl = latest.current.tool;
          if (tl === "text") {
            if (canEditText(t, latest.current.self)) promptEditTextRef.current(t);
            return;
          }
          if (tl === "select" && canEditText(t, latest.current.self)) {
            const world = worldRef.current;
            if (!world) return;
            const p = world.toLocal(e.global);
            dragRef.current = {
              mode: "movetext",
              startX: e.global.x,
              startY: e.global.y,
              camX: 0,
              camY: 0,
              textId: t.id,
              container: label,
              offX: p.x - t.x,
              offY: p.y - t.y
            };
          }
          armTouchLongPress(e, () => {
            if (!canEditText(t, latest.current.self)) return;
            const d = dragRef.current;
            if (d.mode === "movetext" && d.textId === t.id) {
              dragRef.current = { mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 };
            }
            void confirmDialog(`텍스트 '${t.text.length > 20 ? t.text.slice(0, 20) + "…" : t.text}' 를 삭제할까요?`).then(
              (ok) => {
                if (ok) useMapStore.getState().removeText(t.id);
              }
            );
          });
        });
      }
      layer.addChild(label);
      textVisRef.current.set(t.id, label);
    }
  }
  function drawScratch() {
    const g = scratchRef.current;
    const d = dragRef.current;
    if (!g) return;
    g.clear();
    if (d.mode !== "draw" || !d.points || d.points.length < 2) return;
    const pts = d.points;
    const color = hexToNum(useUIStore.getState().drawColor || latest.current.self?.color);
    const w = penWidthNow();
    if (pts.length === 2) {
      g.circle(pts[0], pts[1], Math.max(1, w / 2)).fill({ color, alpha: 0.92 });
      return;
    }
    g.moveTo(pts[0], pts[1]);
    for (let i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]);
    g.stroke({ width: w, color, alpha: 0.92, cap: "round", join: "round" });
  }
  function eraseAt(wx, wy) {
    const d = dragRef.current;
    const me = latest.current.self;
    const sc = camRef.current.scale || 1;
    const thr = 10 / sc;
    for (const s of latest.current.drawings) {
      if (d.erased?.has(s.id)) continue;
      if (!canEraseStroke(s, me)) continue;
      if (strokeHit(s, wx, wy, thr + s.width / 2)) {
        d.erased?.add(s.id);
        useMapStore.getState().erase(s.id);
      }
    }
  }
  function doPing(wx, wy) {
    const nameColor = useUIStore.getState().nameColor;
    useMapStore.getState().ping(wx, wy, nameColor || latest.current.self?.color || "#ffd479");
  }
  function spawnPing(ping) {
    const app = appRef.current;
    const layer = pingLayerRef.current;
    if (!app || !layer) return;
    const g = new Graphics();
    g.position.set(ping.x, ping.y);
    layer.addChild(g);
    const color = hexToNum(ping.color, 16766073);
    let el = 0;
    const tick = (ticker) => {
      el += ticker.deltaMS;
      const t = Math.min(1, el / PING_MS);
      const sc = camRef.current.scale || 1;
      const fade = 1 - t;
      const baseR = (8 + t * 26) / sc;
      g.clear();
      g.circle(0, 0, baseR).stroke({ width: 3 / sc, color, alpha: fade * 0.9 });
      g.circle(0, 0, baseR * 0.55).stroke({ width: 2 / sc, color, alpha: fade * 0.6 });
      g.circle(0, 0, 3 / sc).fill({ color, alpha: fade });
      if (t >= 1) {
        app.ticker.remove(tick);
        g.destroy();
        pingAnim.current.delete(ping.id);
        useMapStore.getState().removePing(ping.id);
      }
    };
    app.ticker.add(tick);
  }
  function drawMeasure(ax, ay, bx, by) {
    const g = measureRef.current;
    const t = measureTextRef.current;
    if (!g || !t) return;
    const sc = camRef.current.scale || 1;
    const size = latest.current.grid.size || CELL;
    g.clear();
    g.moveTo(ax, ay).lineTo(bx, by).stroke({ width: 2 / sc, color: 16769146, alpha: 0.95 });
    g.circle(ax, ay, 4 / sc).fill({ color: 16769146 });
    g.circle(bx, by, 4 / sc).fill({ color: 16769146 });
    const dist = Math.hypot(bx - ax, by - ay);
    t.text = `${(dist / size).toFixed(1)}칸 · ${Math.round(dist)}px`;
    t.visible = true;
    t.scale.set(1 / sc);
    t.position.set((ax + bx) / 2, (ay + by) / 2 - 16 / sc);
  }
  function clearMeasure() {
    measureRef.current?.clear();
    if (measureTextRef.current) measureTextRef.current.visible = false;
  }
  function drawMarquee(ax, ay, bx, by) {
    const g = marqueeRef.current;
    if (!g) return;
    const sc = camRef.current.scale || 1;
    const x = Math.min(ax, bx);
    const y = Math.min(ay, by);
    const w = Math.abs(bx - ax);
    const h = Math.abs(by - ay);
    g.clear();
    g.rect(x, y, w, h).fill({ color: 7252223, alpha: 0.12 }).stroke({ width: 1.5 / sc, color: 7252223, alpha: 0.9 });
  }
  function finishMarquee(ax, ay, bx, by) {
    marqueeRef.current?.clear();
    const x0 = Math.min(ax, bx);
    const x1 = Math.max(ax, bx);
    const y0 = Math.min(ay, by);
    const y1 = Math.max(ay, by);
    const me = latest.current.self;
    const ids = latest.current.tokens.filter((t) => {
      if (!canSeeToken(t, me)) return false;
      if (!canControlToken(t, me)) return false;
      return t.x >= x0 && t.x <= x1 && t.y >= y0 && t.y <= y1;
    }).map((t) => t.id);
    useMapStore.getState().selectMany(ids);
  }
  function fitBounds(vw, vh) {
    const bg = latest.current.background;
    const shown = latest.current.tokens.filter((t) => !t.hidden);
    const b = tokenBounds(shown, latest.current.grid.size || CELL);
    if (!(bg && (bg.w || bg.image))) return b;
    const bw = bg.w || vw;
    const bh = bg.h || vh;
    if (!b) return { minX: 0, minY: 0, w: bw, h: bh };
    const x0 = Math.min(0, b.minX);
    const y0 = Math.min(0, b.minY);
    const x1 = Math.max(bw, b.minX + b.w);
    const y1 = Math.max(bh, b.minY + b.h);
    return { minX: x0, minY: y0, w: x1 - x0, h: y1 - y0 };
  }
  function fitBackground(bg) {
    const app = appRef.current;
    if (!app || !bg || userMovedRef.current) return;
    const vw = app.screen.width;
    const vh = app.screen.height;
    const r = fitBounds(vw, vh) ?? { minX: 0, minY: 0, w: bg.w || vw, h: bg.h || vh };
    const lim = scaleLimitsFor(r.w, r.h, vw, vh);
    const s = Math.max(lim.min, Math.min(lim.max, Math.min(vw / r.w, vh / r.h) * 0.95));
    camRef.current = { scale: s, x: (vw - r.w * s) / 2 - r.minX * s, y: (vh - r.h * s) / 2 - r.minY * s };
    applyCamera();
  }
  function viewCenterNow() {
    const app = appRef.current;
    if (!app) return null;
    const c = camRef.current;
    const vw = app.screen.width;
    const vh = app.screen.height;
    if (!vw || !vh || !(c.scale > 0)) return null;
    return { cx: (vw / 2 - c.x) / c.scale, cy: (vh / 2 - c.y) / c.scale, scale: c.scale };
  }
  function applyViewCenter(v) {
    const app = appRef.current;
    if (!app) return false;
    const vw = app.screen.width;
    const vh = app.screen.height;
    if (!vw || !vh) return false;
    const lim = currentScaleLimits(vw, vh);
    const s = Math.max(lim.min, Math.min(lim.max, v.scale));
    const r = fitBounds(vw, vh);
    let { cx, cy } = v;
    if (r) {
      const mx = vw / (2 * s);
      const my = vh / (2 * s);
      cx = Math.max(r.minX - mx, Math.min(r.minX + r.w + mx, cx));
      cy = Math.max(r.minY - my, Math.min(r.minY + r.h + my, cy));
    }
    camRef.current = { scale: s, x: vw / 2 - cx * s, y: vh / 2 - cy * s };
    userMovedRef.current = true;
    carriedRef.current = true;
    applyCamera();
    return true;
  }
  function applyViewCenterExact(v) {
    const app = appRef.current;
    if (!app) return false;
    const vw = app.screen.width;
    const vh = app.screen.height;
    if (!vw || !vh) return false;
    const lim = currentScaleLimits(vw, vh);
    const s = Math.max(lim.min, Math.min(lim.max, v.scale));
    camRef.current = { scale: s, x: vw / 2 - v.cx * s, y: vh / 2 - v.cy * s };
    userMovedRef.current = true;
    carriedRef.current = true;
    applyCamera();
    return true;
  }
  function restoreCamera() {
    const app = appRef.current;
    if (!app) return false;
    const saved = loadMapCam(camKeyRef.current);
    if (!saved) return false;
    const vw = app.screen.width;
    const vh = app.screen.height;
    if (!vw || !vh) return false;
    const lim = currentScaleLimits(vw, vh);
    const s = Math.max(lim.min, Math.min(lim.max, saved.scale));
    camRef.current = { scale: s, x: vw / 2 - saved.cx * s, y: vh / 2 - saved.cy * s };
    userMovedRef.current = true;
    carriedRef.current = false;
    applyCamera();
    return true;
  }
  function restoreSceneCamera(carry) {
    if (keepViewRef.current) {
      if (carry && applyViewCenter(carry)) return true;
      const shared = loadMapCam(lastCamKeyRef.current);
      if (shared) {
        if (shared.mapId === activeMapIdRef.current && applyViewCenterExact(shared)) return true;
        if (applyViewCenter(shared)) return true;
      }
    }
    return restoreCamera();
  }
  const limitsCacheRef = reactExports.useRef(null);
  function currentScaleLimits(vw, vh) {
    const bg = latest.current.background;
    const tks = latest.current.tokens;
    const cell = latest.current.grid.size || CELL;
    const c = limitsCacheRef.current;
    if (c && c.tokens === tks && c.cell === cell && c.vw === vw && c.vh === vh && c.bg === bg)
      return c.lim;
    const b = fitBounds(vw, vh);
    const lim = b ? scaleLimitsFor(b.w, b.h, vw, vh) : { min: MIN_SCALE, max: MAX_SCALE };
    limitsCacheRef.current = { tokens: tks, cell, vw, vh, bg, lim };
    return lim;
  }
  function syncBackground() {
    const layer = bgLayerRef.current;
    if (!layer) return;
    const bg = latest.current.background;
    for (const child of layer.removeChildren()) disposeChild(child);
    if (bg?.image) {
      const sp = makeImageSprite(bg.image);
      if (sp) {
        const bw = bg.w || sp.texture.width;
        const bh = bg.h || sp.texture.height;
        const fit = bg.fit;
        if ((fit === "contain" || fit === "cover") && sp.texture.width && sp.texture.height) {
          const tw = sp.texture.width;
          const th = sp.texture.height;
          const s = fit === "contain" ? Math.min(bw / tw, bh / th) : Math.max(bw / tw, bh / th);
          const dw = tw * s;
          const dh = th * s;
          sp.width = dw;
          sp.height = dh;
          sp.x = (bw - dw) / 2;
          sp.y = (bh - dh) / 2;
          layer.addChild(sp);
          if (fit === "cover") {
            const mask = new Graphics().rect(0, 0, bw, bh).fill({ color: 16777215 });
            layer.addChild(mask);
            sp.mask = mask;
          }
        } else {
          sp.width = bw;
          sp.height = bh;
          layer.addChild(sp);
        }
      }
    }
    redrawGrid();
    applyBackdrop();
  }
  function buildBars(stats, topY, scale) {
    const g = new Container();
    const W = 58 * scale;
    const H = 5 * scale;
    const GAP = 7 * scale;
    const rad = 2.5 * scale;
    const rows = [
      { cur: stats.hp, max: stats.hpMax, color: 15690346 },
      { cur: stats.mp, max: stats.mpMax, color: 5941744 },
      { cur: stats.san, max: stats.sanMax, color: 10518496 }
    ].filter((r) => r.max > 0);
    rows.forEach((r, i) => {
      const y = topY + i * (H + GAP);
      g.addChild(new Graphics().roundRect(-W / 2, y, W, H, rad).fill({ color: 658968, alpha: 0.82 }));
      const frac = r.max > 0 ? Math.max(0, Math.min(1, r.cur / r.max)) : 0;
      if (frac > 0) {
        g.addChild(
          new Graphics().roundRect(-W / 2, y, Math.max(2, W * frac), H, rad).fill({ color: r.color })
        );
      }
      const num2 = new Text({
        text: `${r.cur}/${r.max}`,
        style: {
          fill: 14673653,
          fontSize: 9 * scale,
          fontWeight: "700",
          fontFamily: "sans-serif",
          stroke: { color: 658968, width: 2 * scale }
        }
      });
      num2.anchor.set(0, 0.5);
      num2.position.set(W / 2 + 4 * scale, y + H / 2);
      g.addChild(num2);
    });
    return g;
  }
  function resolveBars(bars, ch) {
    const st = ch?.stats;
    if (!st) return bars;
    return bars.map((b) => {
      if (!b.link) return b;
      const cur = b.link === "hp" ? st.hp : b.link === "mp" ? st.mp : st.san;
      const max = b.link === "hp" ? st.hpMax : b.link === "mp" ? st.mpMax : st.sanMax;
      if (typeof cur !== "number" || typeof max !== "number" || max <= 0) return b;
      const auto = b.link === "hp" ? "체력" : b.link === "mp" ? "마력·정신력" : "이성";
      return { ...b, cur, max, label: b.label || auto };
    });
  }
  function buildCustomBars(bars, topY, scale) {
    const g = new Container();
    const W = 58 * scale;
    const H = 5 * scale;
    const GAP = 7 * scale;
    const rad = 2.5 * scale;
    const PALETTE = [7268279, 16498468, 6333946, 16020150, 10980346, 3462041, 16486972, 9741240];
    bars.slice(0, 8).forEach((b, i) => {
      const y = topY + i * (H + GAP);
      const max = b.max || 0;
      const frac = max > 0 ? Math.max(0, Math.min(1, b.cur / max)) : 0;
      const warn = frac < 0.8;
      const base = b.color ? hexToNum(b.color, PALETTE[i % 8]) : PALETTE[i % 8];
      const col = warn ? 15680580 : base;
      g.addChild(new Graphics().roundRect(-W / 2, y, W, H, rad).fill({ color: 658968, alpha: 0.82 }));
      if (frac > 0)
        g.addChild(new Graphics().roundRect(-W / 2, y, Math.max(2, W * frac), H, rad).fill({ color: col }));
      const num2 = new Text({
        text: (b.label ? b.label + " " : "") + `${b.cur}/${max}`,
        style: {
          fill: warn ? 16757940 : 14673653,
          fontSize: 9 * scale,
          fontWeight: "700",
          fontFamily: "sans-serif",
          stroke: { color: 658968, width: 2 * scale }
        }
      });
      num2.anchor.set(0, 0.5);
      num2.position.set(W / 2 + 4 * scale, y + H / 2);
      g.addChild(num2);
    });
    return g;
  }
  function buildMarkers(stats, R, scale) {
    const marks = [];
    if (stats.dying || stats.hp <= 0)
      marks.push({ label: "빈", color: 15680580 });
    else if (stats.majorWound) marks.push({ label: "중", color: 14711071 });
    if (stats.indefInsane || stats.sanMax > 0 && stats.san <= 0)
      marks.push({ label: "광", color: 9133302 });
    else if (stats.tempInsane) marks.push({ label: "혼", color: 10980346 });
    if (!marks.length) return null;
    const g = new Container();
    const CW = 16 * scale;
    const CH = 14 * scale;
    const GAP = 3 * scale;
    const totalW = marks.length * CW + (marks.length - 1) * GAP;
    marks.forEach((m, i) => {
      const x = -totalW / 2 + i * (CW + GAP);
      const y = -R - CH - 6 * scale;
      g.addChild(
        new Graphics().roundRect(x, y, CW, CH, 4 * scale).fill({ color: m.color }).stroke({ width: 1.5 * scale, color: 658968, alpha: 0.6 })
      );
      const t = new Text({
        text: m.label,
        style: { fill: 16777215, fontSize: 10 * scale, fontWeight: "800", fontFamily: "sans-serif" }
      });
      t.anchor.set(0.5);
      t.position.set(x + CW / 2, y + CH / 2);
      g.addChild(t);
    });
    return g;
  }
  function buildToken(token, ch, controllable, selected) {
    const c = new Container();
    c.position.set(token.x, token.y);
    c.eventMode = tokenInteractive(token, controllable) ? "static" : "none";
    c.cursor = controllable ? "grab" : token.clickAction || token.clickCardId ? "pointer" : "default";
    const cell = latest.current.grid.size || CELL;
    const R = (token.size || 1) * cell / 2 * 0.82;
    const color = hexToNum(ch?.color ?? token.color);
    const standingRef = characterStandingRef(token, ch);
    const liveStanding = standingRef ? resolveStanding(standingRef) : void 0;
    const rawImg = activeTokenImage(token);
    const cardImg = liveStanding ?? (rawImg && rawImg.startsWith("asset:") ? resolveStanding(rawImg) : rawImg);
    const img = cardImg ?? (rawImg ? void 0 : ch?.headshot);
    const isImageToken = !!(liveStanding ?? rawImg);
    let hitW = R * 2;
    let hitH = R * 2;
    const vis = new Container();
    vis.rotation = token.rotation ?? 0;
    if (token.flipX) vis.scale.x = -1;
    c.addChild(vis);
    tokenVisRef.current.set(token.id, vis);
    let btnSprite = null;
    if (isImageToken) {
      const sp = img ? makeImageSprite(img, token.id) : null;
      btnSprite = sp;
      if (sp) {
        sp.anchor.set(0.5);
        const ratio = sp.texture.height / sp.texture.width || 1;
        sp.width = ratio > 1 ? R * 2 / ratio : R * 2;
        sp.height = ratio > 1 ? R * 2 : R * 2 * ratio;
        hitW = sp.width;
        hitH = sp.height;
        vis.addChild(sp);
        if (selected) {
          vis.addChild(
            new Graphics().rect(-sp.width / 2, -sp.height / 2, sp.width, sp.height).stroke({ width: 2.5, color: 16777215, alpha: 0.95 })
          );
        }
      } else {
        vis.addChild(new Graphics().rect(-R, -R, R * 2, R * 2).fill({ color, alpha: 0.4 }));
      }
    } else {
      vis.addChild(new Graphics().circle(0, 0, R).fill({ color, alpha: 0.95 }));
      if (img) {
        const tex = getTex(img);
        if (tex) {
          const sp = new Sprite(tex);
          sp.anchor.set(0.5);
          sp.width = R * 2;
          sp.height = R * 2;
          const mask = new Graphics().circle(0, 0, R).fill(16777215);
          vis.addChild(sp, mask);
          sp.mask = mask;
        } else {
          loadTexture(img);
        }
      }
      if (!img || !texCache.current.has(img)) {
        const letter = (ch?.name ?? token.label ?? "?").trim()[0] ?? "?";
        const t = new Text({
          text: letter,
          style: { fill: 16777215, fontSize: R, fontWeight: "800", fontFamily: "sans-serif" }
        });
        t.anchor.set(0.5);
        vis.addChild(t);
      }
      vis.addChild(
        new Graphics().circle(0, 0, R).stroke({
          width: selected ? 4 : 2.5,
          color: selected ? 16777215 : color,
          alpha: selected ? 1 : 0.9
        })
      );
    }
    const uiScale = Math.max(0.7, Math.min(token.size || 1, 4));
    const name = (ch?.name ?? token.label ?? "").trim();
    let belowY = R + 5 * uiScale;
    if (name && !token.hideName) {
      const nameT = new Text({
        text: name,
        style: {
          fill: 16777215,
          fontSize: 13 * uiScale,
          fontWeight: "700",
          fontFamily: "sans-serif",
          stroke: { color: 658968, width: 3 * uiScale },
          align: "center"
        }
      });
      nameT.anchor.set(0.5, 0);
      nameT.position.set(0, belowY);
      nameT.eventMode = "none";
      c.addChild(nameT);
      belowY += 20 * uiScale;
    }
    const canStats = !token.statsPrivate || latest.current.self?.role === "GM" || token.charPlayerId === latest.current.self?.playerId;
    const showUI = !token.hideUI && canStats;
    if (ch?.stats && showUI) {
      const bars = buildBars(ch.stats, belowY, uiScale);
      bars.eventMode = "none";
      c.addChild(bars);
      const sheetRows = [ch.stats.hpMax, ch.stats.mpMax, ch.stats.sanMax].filter((m) => m > 0).length;
      belowY += sheetRows * (5 * uiScale + 7 * uiScale);
    }
    if (token.bars?.length && canStats) {
      const cbars = buildCustomBars(resolveBars(token.bars, ch), belowY, uiScale);
      cbars.eventMode = "none";
      c.addChild(cbars);
    }
    if (ch?.stats && showUI) {
      const markers = buildMarkers(ch.stats, R, uiScale);
      if (markers) {
        markers.eventMode = "none";
        c.addChild(markers);
      }
    }
    const bodyHit = new Graphics();
    bodyHit.eventMode = "static";
    const resizing = controllable && latest.current.self?.role === "GM" && latest.current.resizingId === token.id;
    bodyHit.cursor = resizing ? "nwse-resize" : controllable ? "grab" : "pointer";
    bodyHit.hitArea = isImageToken ? new Rectangle(-hitW / 2, -hitH / 2, hitW, hitH) : new Circle(0, 0, R);
    c.addChild(bodyHit);
    if (resizing) {
      const ring = isImageToken ? new Graphics().rect(-hitW / 2 - 4, -hitH / 2 - 4, hitW + 8, hitH + 8) : new Graphics().circle(0, 0, R + 5);
      ring.stroke({ width: 3, color: 16761421, alpha: 0.95 });
      ring.eventMode = "none";
      c.addChild(ring);
    } else if (selected && controllable && latest.current.selectedIds.length === 1) {
      addRotateHandle(vis, token, isImageToken ? hitH / 2 : R);
    }
    attachTokenInteractions(c, token, controllable, vis);
    attachButtonToken(c, token, btnSprite, hitW, hitH);
    return c;
  }
  function addRotateHandle(vis, token, R) {
    const f = handleScale();
    const HIT = 26;
    const hc = new Container();
    hc.position.set(0, -R);
    hc.scale.set(f);
    hc.addChild(
      new Graphics().moveTo(0, 0).lineTo(0, -40).stroke({ width: 2.5, color: 16777215, alpha: 0.7 })
    );
    const h = new Graphics().circle(0, -40, 12).fill({ color: 7252223 }).stroke({ width: 2.5, color: 16777215 });
    h.eventMode = "static";
    h.cursor = "grab";
    h.hitArea = new Circle(0, -40, HIT);
    h.on("pointerdown", (e) => {
      e.stopPropagation();
      fixGlobal(e);
      const t = Date.now();
      if (lastRotTapId === token.id && t - lastRotTapAt < 350) {
        lastRotTapAt = 0;
        lastRotTapId = "";
        useMapStore.getState().rotate(token.id, 0);
        return;
      }
      lastRotTapAt = t;
      lastRotTapId = token.id;
      dragRef.current = {
        mode: "rotate",
        startX: e.global.x,
        startY: e.global.y,
        camX: 0,
        camY: 0,
        tokenId: token.id,
        vis,
        cx: token.x,
        cy: token.y,
        rot: token.rotation ?? 0
      };
    });
    hc.addChild(h);
    vis.addChild(hc);
    handleVisRef.current.push(hc);
  }
  function tokenInteractive(token, controllable) {
    if (latest.current.tool !== "select") return !!token.memo;
    return controllable || !!token.clickAction || !!token.clickCardId || !!token.memo || isButtonToken(token);
  }
  function attachButtonToken(c, token, sp, boxW, boxH) {
    if (!isButtonToken(token)) return;
    const sounds = token.sounds;
    const hoverImg = token.hoverImage;
    const pressImg = token.pressImage;
    const swappable = !!sp && !(sp instanceof GifSprite) && !(sp instanceof AnimatedSprite);
    const baseTex = swappable && sp ? sp.texture : null;
    if (swappable && hoverImg) loadTexture(hoverImg);
    if (swappable && pressImg) loadTexture(pressImg);
    const setImg = (img) => {
      if (!swappable || !sp) return;
      const tex = img ? getTex(img) : baseTex ?? void 0;
      if (!tex) {
        if (img) loadTexture(img);
        return;
      }
      sp.texture = tex;
      sp.width = boxW;
      sp.height = boxH;
    };
    let over = false;
    c.on("pointerover", () => {
      if (latest.current.tool !== "select") return;
      over = true;
      if (hoverImg) setImg(hoverImg);
      playSound(sounds?.hover);
    });
    c.on("pointerout", () => {
      if (!over) return;
      over = false;
      setImg(void 0);
      playSound(sounds?.base);
    });
    c.on("pointerdown", (e) => {
      if (latest.current.tool !== "select") return;
      if (e.button === 2 || e.button === 1) return;
      if (pressImg) setImg(pressImg);
      playSound(sounds?.press);
    });
    const release = () => setImg(over && hoverImg ? hoverImg : void 0);
    c.on("pointerup", release);
    c.on("pointerupoutside", release);
  }
  function armTouchLongPress(e, fire) {
    if (e.pointerType !== "touch") return;
    const ne = e.nativeEvent;
    const pid = ne.pointerId;
    const rx = ne.clientX;
    const ry = ne.clientY;
    const z = uiZoom();
    const fx = e.client.x / z;
    const fy = e.client.y / z;
    let live = true;
    const cancel = () => {
      live = false;
      cleanup();
    };
    const onMv = (ev) => {
      if (ev.pointerId === pid && Math.hypot(ev.clientX - rx, ev.clientY - ry) > 10) cancel();
    };
    const onEnd = (ev) => {
      if (ev.pointerId === pid) cancel();
    };
    const onOtherDown = (ev) => {
      if (ev.pointerId !== pid) cancel();
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", onMv);
      window.removeEventListener("pointerup", onEnd, true);
      window.removeEventListener("pointercancel", onEnd, true);
      window.removeEventListener("pointerdown", onOtherDown, true);
    };
    window.addEventListener("pointermove", onMv);
    window.addEventListener("pointerup", onEnd, true);
    window.addEventListener("pointercancel", onEnd, true);
    window.addEventListener("pointerdown", onOtherDown, true);
    window.setTimeout(() => {
      cleanup();
      if (live) fire(fx, fy);
    }, 550);
  }
  function attachTokenInteractions(c, token, controllable, vis) {
    if (token.memo) {
      c.on("pointerover", (e) => {
        tipTokenRef.current = token.id;
        showTooltip(token.memo ?? "", e);
      });
      c.on("pointerout", () => {
        tipTokenRef.current = null;
        hideTooltip();
      });
    }
    c.on("pointerdown", (e) => {
      if (latest.current.tool !== "select") return;
      e.stopPropagation();
      fixGlobal(e);
      if (e.button === 2) {
        if (dragRef.current.mode !== "none") return;
        const z = uiZoom();
        const cam = camRef.current;
        dragRef.current = {
          mode: "pan",
          startX: e.global.x,
          startY: e.global.y,
          camX: cam.x,
          camY: cam.y,
          moved: false,
          ctx: { tokenId: token.id, x: e.client.x / z, y: e.client.y / z }
        };
        return;
      }
      if (e.button === 1) {
        if (dragRef.current.mode !== "none") return;
        const cam = camRef.current;
        dragRef.current = { mode: "pan", startX: e.global.x, startY: e.global.y, camX: cam.x, camY: cam.y };
        const appc = appRef.current;
        if (appc) {
          appc.renderer.events.cursorStyles.default = "grabbing";
          appc.canvas.style.cursor = "grabbing";
        }
        return;
      }
      if (token.terrain) {
        armTouchLongPress(e, (x, y) => onCtxRef.current?.({ id: token.id, x, y }));
        return;
      }
      const store = useMapStore.getState();
      if (e.shiftKey || e.ctrlKey || e.metaKey) {
        if (controllable) store.toggleSelect(token.id);
        return;
      }
      const preSel = latest.current.selectedIds;
      const inGroup = controllable && preSel.length > 1 && preSel.includes(token.id);
      if (controllable && !inGroup) store.select(token.id);
      const isGM = latest.current.self?.role === "GM";
      const canResize = controllable && !token.lockSize && isGM && latest.current.resizingId === token.id;
      const canMove = controllable && !token.lockPos;
      if (!canMove && !canResize && !token.clickAction && !token.clickCardId) {
        if (inGroup) store.select(token.id);
        return;
      }
      const world = worldRef.current;
      if (!world) return;
      const p = world.toLocal(e.global);
      if (canResize) {
        dragRef.current = {
          mode: "resize",
          startX: e.global.x,
          startY: e.global.y,
          camX: 0,
          camY: 0,
          tokenId: token.id,
          vis,
          cx: token.x,
          cy: token.y,
          baseSize: token.size || 1,
          size: token.size || 1,
          baseSignX: vis.scale.x < 0 ? -1 : 1,
          // 좌우 반전 부호 보존(리사이즈 미리보기가 flip 을 덮지 않게)
          grabDist: Math.max(8, Math.hypot(p.x - token.x, p.y - token.y))
        };
        return;
      }
      let group;
      if (canMove && inGroup) {
        const tksNow = latest.current.tokens;
        const g = [];
        for (const id of preSel) {
          const cc = tokenVisRef.current.get(id)?.parent;
          const tt = tksNow.find((t) => t.id === id);
          if (cc && tt && !tt.lockPos && canControlToken(tt, latest.current.self))
            g.push({ id, c: cc, sx: tt.x, sy: tt.y });
        }
        if (g.length >= 2) group = g;
      }
      dragRef.current = {
        mode: "token",
        startX: e.global.x,
        startY: e.global.y,
        camX: 0,
        camY: 0,
        tokenId: token.id,
        offX: p.x - token.x,
        offY: p.y - token.y,
        mx0: p.x,
        my0: p.y,
        container: c,
        locked: !canMove,
        action: token.clickAction,
        cardTokenId: token.clickCardId ? token.id : void 0,
        moved: false,
        group,
        collapseTo: inGroup ? token.id : void 0
      };
      if (canMove) c.cursor = "grabbing";
      armTouchLongPress(e, (x, y) => {
        const d = dragRef.current;
        if (d.mode !== "token" || d.tokenId !== token.id || d.moved) return;
        dragRef.current = { mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 };
        pendingSyncRef.current = false;
        syncTokens();
        onCtxRef.current?.({ id: token.id, x, y });
      });
    });
  }
  function buildImageObject(token, ch, controllable, selected) {
    const c = new Container();
    c.position.set(token.x, token.y);
    c.eventMode = tokenInteractive(token, controllable) ? "static" : "none";
    c.cursor = controllable ? "grab" : token.clickAction || token.clickCardId ? "pointer" : "default";
    const cell = latest.current.grid.size || CELL;
    const long = (token.size || 1) * cell;
    const standingRef = characterStandingRef(token, ch);
    const liveStanding = standingRef ? resolveStanding(standingRef) : void 0;
    const snap2 = activeTokenImage(token);
    const img = liveStanding ?? (snap2 && snap2.startsWith("asset:") ? resolveStanding(snap2) : snap2);
    const sp = img ? makeImageSprite(img, token.id) : null;
    const ratio = sp ? sp.texture.height / sp.texture.width || 1 : 1;
    const rw = token.w ?? 0;
    const rh = token.h ?? 0;
    const stretchK = rw > 0 && rh > 0 ? long / Math.max(rw, rh) : 0;
    const w = stretchK ? rw * stretchK : ratio > 1 ? long / ratio : long;
    const h = stretchK ? rh * stretchK : ratio > 1 ? long : long * ratio;
    const vis = new Container();
    vis.rotation = token.rotation ?? 0;
    if (token.flipX) vis.scale.x = -1;
    c.addChild(vis);
    tokenVisRef.current.set(token.id, vis);
    if (sp) {
      sp.anchor.set(0.5);
      sp.width = w;
      sp.height = h;
      vis.addChild(sp);
    } else {
      vis.addChild(
        new Graphics().rect(-w / 2, -h / 2, w, h).fill({ color: hexToNum(token.color, 2764602), alpha: 0.45 })
      );
      if (!img && token.label) {
        const cap = new Text({
          text: token.label,
          style: {
            fill: 16777215,
            fontSize: Math.max(11, Math.min(26, Math.round(h * 0.24))),
            fontFamily: "sans-serif",
            align: "center",
            stroke: { color: 0, width: 2 },
            wordWrap: true,
            wordWrapWidth: Math.max(40, w - 16)
          }
        });
        cap.anchor.set(0.5);
        vis.addChild(cap);
      }
    }
    const resizing = controllable && latest.current.self?.role === "GM" && latest.current.resizingId === token.id;
    if (selected && !resizing) {
      vis.addChild(
        new Graphics().rect(-w / 2, -h / 2, w, h).stroke({ width: 3, color: 16777215, alpha: 0.95 })
      );
    }
    if (resizing) {
      c.cursor = "nwse-resize";
      const ring = new Graphics().rect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8).stroke({ width: 3, color: 16761421, alpha: 0.95 });
      ring.eventMode = "none";
      vis.addChild(ring);
    } else if (selected && controllable && latest.current.selectedIds.length === 1) {
      addRotateHandle(vis, token, h / 2);
    }
    attachTokenInteractions(c, token, controllable, vis);
    attachButtonToken(c, token, sp, w, h);
    const canStats = !token.statsPrivate || latest.current.self?.role === "GM" || token.charPlayerId === latest.current.self?.playerId;
    if (token.bars?.length && canStats) {
      const uiScale = Math.max(0.7, Math.min(token.size || 1, 4));
      const bars = buildCustomBars(resolveBars(token.bars, ch), 0, uiScale);
      bars.eventMode = "none";
      bars.position.set(token.x, token.y + h / 2 + 5 * uiScale);
      bars.label = token.layer ?? "token";
      if (tokenVisibility(token) !== "all") bars.alpha = 0.4;
      barOverlayRef.current?.addChild(bars);
      barByTokenRef.current.set(token.id, { bar: bars, dy: h / 2 + 5 * uiScale });
    }
    return c;
  }
  function syncTokens() {
    const dm = dragRef.current.mode;
    if (dm === "token" || dm === "resize" || dm === "rotate") {
      pendingSyncRef.current = true;
      return;
    }
    const bgC = bgObjRef.current;
    const tokC = tokenObjRef.current;
    const stC = standObjRef.current;
    const bhC = behindObjRef.current;
    if (!bgC || !tokC || !stC || !bhC) return;
    const tipId = tipTokenRef.current;
    if (!tipId || !latest.current.tokens.some((t) => t.id === tipId && t.memo)) {
      tipTokenRef.current = null;
      hideTooltip();
    }
    for (const { sprite } of liveGifs.current.values()) sprite.parent?.removeChild(sprite);
    for (const { sprite } of liveAnims.current.values()) sprite.parent?.removeChild(sprite);
    const barC = barOverlayRef.current;
    for (const layer of [bhC, bgC, tokC, stC]) for (const child of layer.removeChildren()) disposeChild(child);
    if (barC) for (const child of barC.removeChildren()) disposeChild(child);
    barByTokenRef.current.clear();
    handleVisRef.current = [];
    tokenVisRef.current.clear();
    const { tokens: tks, roster: ros, self: me, selectedIds: selIds } = latest.current;
    const selSet = new Set(selIds);
    for (const token of tks) {
      if (!canSeeToken(token, me)) continue;
      const lyr = token.layer ?? "token";
      const target = lyr === "behind" ? bhC : lyr === "bg" ? bgC : lyr === "standing" ? stC : tokC;
      const selected = selSet.has(token.id);
      const controllable = canControlToken(token, me);
      const chOf = charOfToken(token, ros, latest.current.charPool);
      const obj = lyr === "token" ? buildToken(token, chOf, controllable, selected) : buildImageObject(token, chOf, controllable, selected);
      obj.zIndex = token.z ?? 0;
      if (tokenVisibility(token) !== "all") obj.alpha = 0.4;
      target.addChild(obj);
    }
    const fromCache = (raw) => raw && raw.startsWith("asset:") ? standingUrls.current.get(raw) || void 0 : raw;
    const liveImgOf = (tk) => {
      const ref = characterStandingRef(tk, charOfToken(tk, ros, latest.current.charPool));
      const live = ref ? fromCache(ref) : void 0;
      if (live) return live;
      const raw = activeTokenImage(tk);
      return fromCache(raw) ?? raw;
    };
    for (const [id, entry] of liveGifs.current) {
      const tk = tks.find((t) => t.id === id);
      if (!tk || liveImgOf(tk) !== entry.img) {
        try {
          entry.sprite.destroy(false);
        } catch {
        }
        liveGifs.current.delete(id);
      }
    }
    for (const [id, entry] of liveAnims.current) {
      const tk = tks.find((t) => t.id === id);
      if (!tk || liveImgOf(tk) !== entry.img) {
        try {
          entry.sprite.destroy({ children: true, texture: false });
        } catch {
        }
        liveAnims.current.delete(id);
      }
    }
    applyLayerVisibility();
    evictTextures();
  }
  reactExports.useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    let destroyed = false;
    let resizeObs = null;
    let removeCtxHandlers = null;
    const app = new Application();
    void app.init({
      resizeTo: el,
      backgroundAlpha: 0,
      // 모바일: MSAA 프레임버퍼(×4 샘플)와 DPR 3 배율이 GPU 메모리를 수십~수백 MB 잡아먹어
      // iOS 강제 리로드('튕김')의 주요 요인 — 폰은 AA 끄고 배율을 2 로 캡(시각 열화는 경미).
      antialias: !isPhoneDevice(),
      resolution: isPhoneDevice() ? Math.min(window.devicePixelRatio || 1, 2) : window.devicePixelRatio || 1,
      autoDensity: true,
      powerPreference: "high-performance"
      // 외장/고성능 GPU 우선 — 큰 움짤 렌더 부하 완화.
    }).then(() => {
      if (destroyed) {
        app.destroy(true, { children: true });
        return;
      }
      appRef.current = app;
      app.canvas.style.display = "block";
      el.appendChild(app.canvas);
      resizeObs = new ResizeObserver(() => {
        if (destroyed) return;
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (w > 0 && h > 0) {
          app.renderer.resize(w, h);
          applyBackdrop();
          if (pendingCamInitRef.current) {
            pendingCamInitRef.current = false;
            if (!restoreSceneCamera(null)) fitBackground(latest.current.background);
          }
        }
      });
      resizeObs.observe(el);
      app.canvas.addEventListener("contextmenu", (ev) => ev.preventDefault());
      const onCtxLost = (ev) => ev.preventDefault();
      const onCtxRestored = () => {
        if (destroyed) return;
        const sb = shrunkBackdrop.current;
        if (sb) {
          try {
            sb.tex.destroy(true);
          } catch {
          }
          shrunkBackdrop.current = null;
        }
        applyBgColor();
        syncBackground();
        syncTokens();
        redrawDrawings();
        syncTexts();
        try {
          app.render();
        } catch {
        }
      };
      app.canvas.addEventListener("webglcontextlost", onCtxLost, false);
      app.canvas.addEventListener("webglcontextrestored", onCtxRestored, false);
      removeCtxHandlers = () => {
        app.canvas.removeEventListener("webglcontextlost", onCtxLost);
        app.canvas.removeEventListener("webglcontextrestored", onCtxRestored);
      };
      const events = app.renderer.events;
      const nativeMapPosition = events.mapPositionToPoint.bind(events);
      events.mapPositionToPoint = (point, x, y) => {
        const z = effectiveUiScale();
        nativeMapPosition(point, x / z, y / z);
      };
      const world = new Container();
      const behindObj = new Container();
      const bgLayer = new Container();
      const bgObj = new Container();
      const grid2 = new Graphics();
      const tokenObj = new Container();
      const standObj = new Container();
      behindObj.sortableChildren = true;
      bgObj.sortableChildren = true;
      tokenObj.sortableChildren = true;
      standObj.sortableChildren = true;
      bgLayer.eventMode = "none";
      grid2.eventMode = "none";
      const drawGfx = new Graphics();
      const scratch = new Graphics();
      const measure = new Graphics();
      const marquee = new Graphics();
      marquee.eventMode = "none";
      const measureText = new Text({
        text: "",
        style: {
          fill: 16769146,
          fontSize: 13,
          fontWeight: "700",
          fontFamily: "sans-serif",
          stroke: { color: 658968, width: 3 }
        }
      });
      measureText.anchor.set(0.5, 1);
      measureText.visible = false;
      const pingLayer = new Container();
      pingLayer.eventMode = "none";
      const textObj = new Container();
      const barOverlay = new Container();
      barOverlay.eventMode = "none";
      world.addChild(
        behindObj,
        bgLayer,
        bgObj,
        grid2,
        tokenObj,
        standObj,
        barOverlay,
        drawGfx,
        scratch,
        textObj,
        measure,
        measureText,
        marquee,
        pingLayer
      );
      const backdrop2 = new Sprite();
      backdrop2.anchor.set(0.5);
      backdrop2.eventMode = "none";
      backdrop2.visible = false;
      const blurFilter = new BlurFilter();
      app.stage.addChild(backdrop2);
      app.stage.addChild(world);
      const tooltip = new Text({
        text: "",
        style: {
          fill: 16777215,
          fontSize: 13,
          fontFamily: "sans-serif",
          stroke: { color: 658968, width: 4 },
          wordWrap: true,
          wordWrapWidth: 260
        }
      });
      tooltip.visible = false;
      tooltip.eventMode = "none";
      app.stage.addChild(tooltip);
      const fade = new Graphics();
      fade.eventMode = "none";
      fade.visible = false;
      app.stage.addChild(fade);
      backdropRef.current = backdrop2;
      blurFilterRef.current = blurFilter;
      tooltipRef.current = tooltip;
      fadeRef.current = fade;
      worldRef.current = world;
      bgLayerRef.current = bgLayer;
      behindObjRef.current = behindObj;
      bgObjRef.current = bgObj;
      gridRef.current = grid2;
      tokenObjRef.current = tokenObj;
      standObjRef.current = standObj;
      barOverlayRef.current = barOverlay;
      drawGfxRef.current = drawGfx;
      scratchRef.current = scratch;
      measureRef.current = measure;
      marqueeRef.current = marquee;
      measureTextRef.current = measureText;
      pingLayerRef.current = pingLayer;
      textObjRef.current = textObj;
      app.stage.eventMode = "static";
      app.stage.hitArea = app.screen;
      app.stage.on("pointerdown", (e) => {
        const world2 = worldRef.current;
        if (!world2) return;
        if (e.button === 2) {
          if (dragRef.current.mode !== "none") return;
          fixGlobal(e);
          const z = uiZoom();
          const cam = camRef.current;
          dragRef.current = {
            mode: "pan",
            startX: e.global.x,
            startY: e.global.y,
            camX: cam.x,
            camY: cam.y,
            moved: false,
            ctx: { x: e.client.x / z, y: e.client.y / z }
          };
          return;
        }
        if (e.button === 1) {
          if (dragRef.current.mode !== "none") return;
          fixGlobal(e);
          const cam = camRef.current;
          dragRef.current = { mode: "pan", startX: e.global.x, startY: e.global.y, camX: cam.x, camY: cam.y };
          app.renderer.events.cursorStyles.default = "grabbing";
          app.canvas.style.cursor = "grabbing";
          return;
        }
        fixGlobal(e);
        const p = world2.toLocal(e.global);
        const tool2 = latest.current.tool;
        if (rRotateRef.current.active) return;
        if (tool2 === "pan" || spaceHeldRef.current) {
          const cam = camRef.current;
          dragRef.current = {
            mode: "pan",
            startX: e.global.x,
            startY: e.global.y,
            camX: cam.x,
            camY: cam.y
          };
          app.renderer.events.cursorStyles.default = "grabbing";
          app.canvas.style.cursor = "grabbing";
          return;
        }
        if (tool2 === "text") {
          promptAddTextRef.current(p.x, p.y);
          dragRef.current = { mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 };
          return;
        }
        if (tool2 === "measure") {
          dragRef.current = {
            mode: "measure",
            startX: e.global.x,
            startY: e.global.y,
            camX: 0,
            camY: 0,
            mx: p.x,
            my: p.y
          };
          drawMeasure(p.x, p.y, p.x, p.y);
          return;
        }
        if (tool2 === "draw") {
          dragRef.current = {
            mode: "draw",
            startX: e.global.x,
            startY: e.global.y,
            camX: 0,
            camY: 0,
            points: [p.x, p.y]
          };
          drawScratch();
          return;
        }
        if (tool2 === "erase") {
          dragRef.current = {
            mode: "erase",
            startX: e.global.x,
            startY: e.global.y,
            camX: 0,
            camY: 0,
            erased: /* @__PURE__ */ new Set()
          };
          eraseAt(p.x, p.y);
          return;
        }
        if (tool2 === "ping") {
          doPing(p.x, p.y);
          dragRef.current = { mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 };
          return;
        }
        dragRef.current = {
          mode: "marquee",
          startX: e.global.x,
          startY: e.global.y,
          camX: 0,
          camY: 0,
          mx0: p.x,
          my0: p.y,
          moved: false
        };
        armTouchLongPress(e, (x, y) => {
          const d = dragRef.current;
          if (d.mode !== "marquee" || d.moved) return;
          dragRef.current = { mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 };
          onMapCtxRef.current?.({ x, y });
        });
      });
      let lastLiveEmit = 0;
      const liveThrottle = () => {
        const t = Date.now();
        if (t - lastLiveEmit < 55) return false;
        lastLiveEmit = t;
        return true;
      };
      app.stage.on("pointermove", (e) => {
        const d = dragRef.current;
        fixGlobal(e);
        if (tipTokenRef.current) {
          const own = tokenVisRef.current.get(tipTokenRef.current)?.parent;
          let t = e.target;
          let overOwner = false;
          while (t) {
            if (t === own) {
              overOwner = true;
              break;
            }
            t = t.parent;
          }
          if (!overOwner) {
            tipTokenRef.current = null;
            hideTooltip();
          }
        }
        if (rRotateRef.current.active && d.mode === "none") {
          const world2 = worldRef.current;
          const r = rRotateRef.current;
          const vis = tokenVisRef.current.get(r.tokenId);
          if (world2 && vis && !vis.destroyed) {
            const p = world2.toLocal(e.global);
            r.rot = Math.atan2(p.y - r.cy, p.x - r.cx) + Math.PI / 2;
            vis.rotation = r.rot;
          }
          return;
        }
        if (d.mode === "pan") {
          if (d.ctx) {
            if (!d.moved && Math.hypot(e.global.x - d.startX, e.global.y - d.startY) <= 4) return;
            if (!d.moved) {
              d.moved = true;
              app.renderer.events.cursorStyles.default = "grabbing";
              app.canvas.style.cursor = "grabbing";
            }
          }
          markUserMoved();
          camRef.current.x = d.camX + (e.global.x - d.startX);
          camRef.current.y = d.camY + (e.global.y - d.startY);
          applyCamera();
        } else if ((d.mode === "token" || d.mode === "movetext") && d.container) {
          const world2 = worldRef.current;
          if (!world2) return;
          if (Math.hypot(e.global.x - d.startX, e.global.y - d.startY) > 4) d.moved = true;
          if (d.mode === "token" && d.locked) return;
          const p = world2.toLocal(e.global);
          if (d.mode === "token") {
            d.cx = p.x;
            d.cy = p.y;
          }
          if (d.mode === "token" && d.group) {
            const ddx = p.x - (d.mx0 ?? p.x);
            const ddy = p.y - (d.my0 ?? p.y);
            for (const g of d.group)
              if (!g.c.destroyed) {
                g.c.position.set(g.sx + ddx, g.sy + ddy);
                moveBarWith(g.id, g.sx + ddx, g.sy + ddy);
              }
            if (d.moved && liveThrottle()) {
              const st = useMapStore.getState();
              for (const g of d.group) {
                markLiveDrag(g.id, true);
                st.liveMove(g.id, g.sx + ddx, g.sy + ddy);
              }
            }
          } else {
            d.container.position.set(p.x - (d.offX ?? 0), p.y - (d.offY ?? 0));
            if (d.mode === "token" && d.tokenId)
              moveBarWith(d.tokenId, p.x - (d.offX ?? 0), p.y - (d.offY ?? 0));
            if (d.mode === "token" && d.tokenId && d.moved && !d.locked && liveThrottle()) {
              markLiveDrag(d.tokenId, true);
              useMapStore.getState().liveMove(d.tokenId, p.x - (d.offX ?? 0), p.y - (d.offY ?? 0));
            }
          }
        } else if (d.mode === "marquee") {
          const world2 = worldRef.current;
          if (!world2) return;
          if (Math.hypot(e.global.x - d.startX, e.global.y - d.startY) > 4) d.moved = true;
          const p = world2.toLocal(e.global);
          d.cx = p.x;
          d.cy = p.y;
          drawMarquee(d.mx0 ?? p.x, d.my0 ?? p.y, p.x, p.y);
        } else if (d.mode === "measure") {
          const world2 = worldRef.current;
          if (!world2) return;
          const p = world2.toLocal(e.global);
          drawMeasure(d.mx ?? p.x, d.my ?? p.y, p.x, p.y);
        } else if (d.mode === "draw" && d.points) {
          const world2 = worldRef.current;
          if (!world2) return;
          const p = world2.toLocal(e.global);
          const n = d.points.length;
          const minD = 2.5 / (camRef.current.scale || 1);
          if (Math.hypot(p.x - d.points[n - 2], p.y - d.points[n - 1]) >= minD) {
            d.points.push(p.x, p.y);
            drawScratch();
          }
        } else if (d.mode === "erase") {
          const world2 = worldRef.current;
          if (!world2) return;
          const p = world2.toLocal(e.global);
          eraseAt(p.x, p.y);
        } else if (d.mode === "rotate" && d.vis) {
          const world2 = worldRef.current;
          if (!world2) return;
          const p = world2.toLocal(e.global);
          const ang = Math.atan2(p.y - (d.cy ?? 0), p.x - (d.cx ?? 0)) + Math.PI / 2;
          d.vis.rotation = ang;
          d.rot = ang;
          if (d.tokenId && liveThrottle()) {
            markLiveDrag(d.tokenId, true);
            useMapStore.getState().liveRotate(d.tokenId, ang);
          }
          showDragHint(`${Math.round(ang * 180 / Math.PI % 360 + 360) % 360}°`, e);
        } else if (d.mode === "resize" && d.vis && d.baseSize) {
          const world2 = worldRef.current;
          if (!world2) return;
          const p = world2.toLocal(e.global);
          const dist = Math.hypot(p.x - (d.cx ?? 0), p.y - (d.cy ?? 0));
          const ratio = dist / (d.grabDist || dist || 1);
          const size = snapTokenSize(d.baseSize * ratio, latest.current.snap, MAX_TOKEN_CELLS);
          d.size = size;
          const k = size / d.baseSize;
          d.vis.scale.set(k * (d.baseSignX ?? 1), k);
          if (d.tokenId && liveThrottle()) {
            markLiveDrag(d.tokenId, true);
            useMapStore.getState().liveResize(d.tokenId, size);
          }
          showDragHint(`${size}칸`, e);
        }
      });
      const endDrag = () => {
        const d = dragRef.current;
        hideDragHint();
        if (d.tokenId) markLiveDrag(d.tokenId, false);
        if (d.group) for (const g of d.group) markLiveDrag(g.id, false);
        let committed = false;
        if (d.mode === "pan" && d.ctx && !d.moved) {
          if (d.ctx.tokenId) onCtxRef.current?.({ id: d.ctx.tokenId, x: d.ctx.x, y: d.ctx.y });
          else onMapCtxRef.current?.({ x: d.ctx.x, y: d.ctx.y });
        } else if (d.mode === "rotate" && d.tokenId && d.rot !== void 0) {
          useMapStore.getState().rotate(d.tokenId, d.rot);
          committed = true;
        } else if (d.mode === "resize" && d.tokenId && d.size) {
          const st = useMapStore.getState();
          const tk = st.maps[st.activeMapId]?.tokens.find((t) => t.id === d.tokenId) ?? st.globalTokens.find((t) => t.id === d.tokenId);
          if (tk) {
            st.place({
              id: tk.id,
              x: tk.x,
              y: tk.y,
              size: d.size,
              rotation: tk.rotation,
              layer: tk.layer,
              charPlayerId: tk.charPlayerId,
              charId: tk.charId,
              label: tk.label,
              color: tk.color,
              image: tk.image,
              flipX: tk.flipX,
              hideName: tk.hideName,
              hideUI: tk.hideUI
              // 크기조정이 반전·숨김 상태를 덮어쓰지 않게
            });
            committed = true;
          }
        } else if (d.mode === "token" && d.tokenId) {
          const snapPos = (px2, py2) => {
            if (!latest.current.snap) return [Math.round(px2), Math.round(py2)];
            const size = latest.current.grid.size || CELL;
            return [
              Math.round(Math.floor(px2 / size) * size + size / 2),
              Math.round(Math.floor(py2 / size) * size + size / 2)
            ];
          };
          const px = d.cx ?? d.mx0 ?? 0;
          const py = d.cy ?? d.my0 ?? 0;
          if ((d.action || d.cardTokenId) && !d.moved) {
            if (d.action) fireClickAction(d.action);
            if (d.cardTokenId) fireCardTrigger(d.cardTokenId);
          } else if (d.group && d.moved) {
            const st = useMapStore.getState();
            const ddx = px - (d.mx0 ?? px);
            const ddy = py - (d.my0 ?? py);
            for (const g of d.group) {
              const [nx, ny] = snapPos(g.sx + ddx, g.sy + ddy);
              st.move(g.id, nx, ny);
            }
            committed = true;
          } else if (!d.moved && d.collapseTo) {
            useMapStore.getState().select(d.collapseTo);
            committed = true;
          } else if (!d.locked && !d.group) {
            const [nx, ny] = snapPos(px - (d.offX ?? 0), py - (d.offY ?? 0));
            useMapStore.getState().move(d.tokenId, nx, ny);
            committed = true;
          }
          if (d.container && !d.container.destroyed) d.container.cursor = d.locked ? "default" : "grab";
        } else if (d.mode === "marquee") {
          if (d.moved && d.mx0 !== void 0 && d.cx !== void 0) {
            finishMarquee(d.mx0, d.my0 ?? 0, d.cx, d.cy ?? 0);
          } else {
            marqueeRef.current?.clear();
            useMapStore.getState().select(null);
          }
          committed = true;
        } else if (d.mode === "movetext" && d.textId && d.container) {
          useMapStore.getState().moveText(d.textId, Math.round(d.container.position.x), Math.round(d.container.position.y));
          committed = true;
        } else if (d.mode === "draw" && d.points && d.points.length >= 2) {
          const me = latest.current.self;
          useMapStore.getState().draw({
            points: d.points.slice(),
            width: penWidthNow(),
            color: useUIStore.getState().drawColor || me?.color || DEFAULT_HEX,
            playerId: me?.playerId ?? "local"
          });
          scratchRef.current?.clear();
        }
        dragRef.current = { mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 };
        if (pendingSyncRef.current) {
          pendingSyncRef.current = false;
          if (!committed) syncTokens();
        }
        applyToolCursor();
      };
      app.stage.on("pointerup", endDrag);
      app.stage.on("pointerupoutside", endDrag);
      app.canvas.addEventListener("pointerleave", () => {
        tipTokenRef.current = null;
        hideTooltip();
      });
      app.canvas.addEventListener(
        "wheel",
        (ev) => {
          ev.preventDefault();
          markUserMoved();
          if (ev.shiftKey) {
            camRef.current.x -= ev.deltaX || ev.deltaY;
            applyCamera();
            return;
          }
          const rect = app.canvas.getBoundingClientRect();
          const z = uiZoom();
          const px = rect.width ? (ev.clientX / z - rect.left) / rect.width * app.screen.width : 0;
          const py = rect.height ? (ev.clientY / z - rect.top) / rect.height * app.screen.height : 0;
          const cam = camRef.current;
          const old = cam.scale;
          const lim = currentScaleLimits(app.screen.width, app.screen.height);
          const next = Math.max(lim.min, Math.min(lim.max, old * (ev.deltaY < 0 ? 1.1 : 0.9)));
          cam.x = px - (px - cam.x) * (next / old);
          cam.y = py - (py - cam.y) * (next / old);
          cam.scale = next;
          applyCamera();
        },
        { passive: false }
      );
      const touchPts = /* @__PURE__ */ new Map();
      let pinch = null;
      const toLogical = (clientX, clientY) => {
        const rect = app.canvas.getBoundingClientRect();
        const z = uiZoom();
        return {
          x: rect.width ? (clientX / z - rect.left) / rect.width * app.screen.width : 0,
          y: rect.height ? (clientY / z - rect.top) / rect.height * app.screen.height : 0
        };
      };
      const abortStageDrag = () => {
        const d = dragRef.current;
        if (d.mode === "none") return;
        hideDragHint();
        const st = useMapStore.getState();
        const findTk = (id) => st.maps[st.activeMapId]?.tokens.find((t) => t.id === id) ?? st.globalTokens.find((t) => t.id === id);
        if (d.tokenId) {
          const tk = findTk(d.tokenId);
          if (tk) {
            if (d.mode === "token" && d.moved) st.liveMove(d.tokenId, tk.x, tk.y);
            else if (d.mode === "rotate") st.liveRotate(d.tokenId, tk.rotation ?? 0);
            else if (d.mode === "resize") st.liveResize(d.tokenId, tk.size || 1);
          }
          markLiveDrag(d.tokenId, false);
        }
        if (d.group) {
          for (const g of d.group) {
            const tk = findTk(g.id);
            if (tk) st.liveMove(g.id, tk.x, tk.y);
            markLiveDrag(g.id, false);
          }
        }
        scratchRef.current?.clear();
        marqueeRef.current?.clear();
        const wasText = d.mode === "movetext";
        dragRef.current = { mode: "none", startX: 0, startY: 0, camX: 0, camY: 0 };
        pendingSyncRef.current = false;
        if (wasText) syncTexts();
        else syncTokens();
        applyToolCursor();
      };
      const onTouchDown = (ev) => {
        if (ev.pointerType !== "touch") return;
        touchPts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        if (touchPts.size === 2) {
          abortStageDrag();
          const [a, b] = [...touchPts.values()];
          const am = toLogical(a.x, a.y);
          const bm = toLogical(b.x, b.y);
          pinch = {
            dist: Math.max(1, Math.hypot(bm.x - am.x, bm.y - am.y)),
            scale: camRef.current.scale,
            midX: (am.x + bm.x) / 2,
            midY: (am.y + bm.y) / 2,
            camX: camRef.current.x,
            camY: camRef.current.y
          };
          ev.stopPropagation();
        } else if (touchPts.size > 2) {
          pinch = null;
        }
      };
      const onTouchMove = (ev) => {
        if (ev.pointerType !== "touch" || !touchPts.has(ev.pointerId)) return;
        touchPts.set(ev.pointerId, { x: ev.clientX, y: ev.clientY });
        if (!pinch || touchPts.size !== 2) return;
        ev.stopPropagation();
        const [a, b] = [...touchPts.values()];
        const am = toLogical(a.x, a.y);
        const bm = toLogical(b.x, b.y);
        const dist = Math.max(1, Math.hypot(bm.x - am.x, bm.y - am.y));
        const midX = (am.x + bm.x) / 2;
        const midY = (am.y + bm.y) / 2;
        const lim = currentScaleLimits(app.screen.width, app.screen.height);
        const next = Math.max(lim.min, Math.min(lim.max, pinch.scale * (dist / pinch.dist)));
        const cam = camRef.current;
        markUserMoved();
        cam.x = midX - (pinch.midX - pinch.camX) / pinch.scale * next;
        cam.y = midY - (pinch.midY - pinch.camY) / pinch.scale * next;
        cam.scale = next;
        applyCamera();
      };
      const onTouchEnd = (ev) => {
        if (ev.pointerType !== "touch") return;
        if (pinch && touchPts.has(ev.pointerId)) ev.stopPropagation();
        touchPts.delete(ev.pointerId);
        if (touchPts.size < 2) pinch = null;
      };
      const touchHost = elRef.current ?? app.canvas;
      touchHost.addEventListener("pointerdown", onTouchDown, { capture: true });
      touchHost.addEventListener("pointermove", onTouchMove, { capture: true });
      touchHost.addEventListener("pointerup", onTouchEnd, { capture: true });
      touchHost.addEventListener("pointercancel", onTouchEnd, { capture: true });
      window.addEventListener("pointerup", onTouchEnd, true);
      window.addEventListener("pointercancel", onTouchEnd, true);
      pinchCleanupRef.current = () => {
        touchHost.removeEventListener("pointerdown", onTouchDown, { capture: true });
        touchHost.removeEventListener("pointermove", onTouchMove, { capture: true });
        touchHost.removeEventListener("pointerup", onTouchEnd, { capture: true });
        touchHost.removeEventListener("pointercancel", onTouchEnd, { capture: true });
        window.removeEventListener("pointerup", onTouchEnd, true);
        window.removeEventListener("pointercancel", onTouchEnd, true);
      };
      function toolCursor() {
        const t = latest.current.tool;
        return spaceHeldRef.current || t === "pan" ? "grab" : t === "measure" || t === "draw" || t === "erase" ? "crosshair" : t === "text" ? "text" : t === "ping" ? "pointer" : "default";
      }
      function applyToolCursor() {
        const c = toolCursor();
        app.renderer.events.cursorStyles.default = c;
        app.canvas.style.cursor = c;
      }
      function setPanReady(on) {
        const w = worldRef.current;
        if (w) w.eventMode = on ? "none" : "passive";
        applyToolCursor();
      }
      function isTyping() {
        const el2 = document.activeElement;
        if (!el2) return false;
        return el2.tagName === "INPUT" || el2.tagName === "TEXTAREA" || el2.tagName === "SELECT" || el2.isContentEditable;
      }
      function fitToView() {
        const vw = app.screen.width;
        const vh = app.screen.height;
        const r = fitBounds(vw, vh);
        if (!r) return;
        const lim = scaleLimitsFor(r.w, r.h, vw, vh);
        const s = Math.max(lim.min, Math.min(lim.max, Math.min(vw / r.w, vh / r.h) * 0.95));
        markUserMoved();
        camRef.current = {
          scale: s,
          x: (vw - r.w * s) / 2 - r.minX * s,
          y: (vh - r.h * s) / 2 - r.minY * s
        };
        applyCamera();
      }
      fitFnRef.current = fitToView;
      const onKeyDown = (ev) => {
        if (isTyping()) return;
        if (ev.code === "Space") {
          if (!spaceHeldRef.current) {
            spaceHeldRef.current = true;
            setPanReady(true);
          }
          ev.preventDefault();
          return;
        }
        if (!ev.ctrlKey && !ev.metaKey && !ev.altKey) {
          const dir = KEY_PAN[ev.key];
          if (dir) {
            ev.preventDefault();
            markUserMoved();
            camRef.current.x += dir[0] * KEY_PAN_STEP;
            camRef.current.y += dir[1] * KEY_PAN_STEP;
            applyCamera();
            return;
          }
          if (ev.key === "=" || ev.key === "+" || ev.key === "-" || ev.key === "_") {
            ev.preventDefault();
            markUserMoved();
            const cam = camRef.current;
            const px = app.screen.width / 2;
            const py = app.screen.height / 2;
            const lim = currentScaleLimits(app.screen.width, app.screen.height);
            const factor = ev.key === "-" || ev.key === "_" ? 0.9 : 1.1;
            const next = Math.max(lim.min, Math.min(lim.max, cam.scale * factor));
            cam.x = px - (px - cam.x) * (next / cam.scale);
            cam.y = py - (py - cam.y) * (next / cam.scale);
            cam.scale = next;
            applyCamera();
            return;
          }
        }
        if (ev.key === "Delete") {
          const ids = latest.current.selectedIds;
          if (!ids.length) return;
          const st = useMapStore.getState();
          for (const id of ids) {
            const tk = latest.current.tokens.find((t) => t.id === id);
            if (tk && canControlToken(tk, latest.current.self)) st.remove(id);
          }
          return;
        }
        if (ev.key === "Escape") {
          if (latest.current.selectedIds.length) useMapStore.getState().select(null);
          return;
        }
        if ((ev.key === "t" || ev.key === "T") && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault();
          const sel = latest.current.selectedId;
          if (!sel || latest.current.self?.role !== "GM") return;
          const st = useMapStore.getState();
          st.setResizing(st.resizingId === sel ? null : sel);
          return;
        }
        const canEditTokens = () => {
          const me = latest.current.self;
          if (!me || me.role === "GM") return true;
          const net = useNetStore.getState();
          return net.roomPlObjects && net.roomPlObjectsSupported;
        };
        if ((ev.key === "c" || ev.key === "C") && (ev.ctrlKey || ev.metaKey)) {
          const textSel = window.getSelection();
          if (textSel && !textSel.isCollapsed) return;
          const sel = latest.current.selectedId;
          if (!sel || !canEditTokens()) return;
          ev.preventDefault();
          useMapStore.getState().copyToken(sel);
          return;
        }
        if ((ev.key === "v" || ev.key === "V") && (ev.ctrlKey || ev.metaKey)) {
          const st = useMapStore.getState();
          if (!st.clipboard || !canEditTokens()) return;
          ev.preventDefault();
          const c = camRef.current;
          const wx = (app.screen.width / 2 - c.x) / c.scale;
          const wy = (app.screen.height / 2 - c.y) / c.scale;
          st.pasteToken({ x: wx, y: wy });
          return;
        }
        if ((ev.key === "r" || ev.key === "R") && !ev.ctrlKey && !ev.metaKey && !ev.altKey) {
          if (rRotateRef.current.active) return;
          const sel = latest.current.selectedId;
          if (!sel) return;
          const tk = latest.current.tokens.find((t) => t.id === sel);
          if (!tk || !canControlToken(tk, latest.current.self)) return;
          rRotateRef.current = { active: true, tokenId: sel, cx: tk.x, cy: tk.y, rot: tk.rotation ?? 0 };
          app.canvas.style.cursor = "crosshair";
        }
      };
      const onKeyUp = (ev) => {
        if (ev.code === "Space") {
          spaceHeldRef.current = false;
          setPanReady(false);
          return;
        }
        if (ev.key === "r" || ev.key === "R") {
          const r = rRotateRef.current;
          if (r.active) {
            useMapStore.getState().rotate(r.tokenId, r.rot);
            rRotateRef.current = { active: false, tokenId: "", cx: 0, cy: 0, rot: 0 };
            applyToolCursor();
          }
        }
      };
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      keyCleanupRef.current = () => {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
      applyCamera();
      applyBgColor();
      applyToolCursor();
      lastBgMapRef.current = activeMapIdRef.current;
      if (!app.screen.width || !app.screen.height) pendingCamInitRef.current = true;
      else if (!restoreSceneCamera(null)) fitBackground(latest.current.background);
      syncBackground();
      syncTokens();
      redrawDrawings();
      syncTexts();
      applyLayerVisibility();
    }).catch((e) => {
      console.error("[map] 무대를 세우지 못했다:", e);
      const host = elRef.current;
      if (!destroyed && host && !host.querySelector(".mapstage-dead")) {
        const note = document.createElement("div");
        note.className = "mapstage-dead";
        note.style.cssText = "position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#9aa3b0;font-size:13px;text-align:center;padding:20px;pointer-events:none;";
        note.textContent = "맵 화면을 그리지 못했습니다. 그래픽 드라이버·WebGL 설정을 확인해 주세요.";
        host.appendChild(note);
      }
      try {
        if (app.renderer) app.destroy(true, { children: true });
      } catch {
      }
    });
    return () => {
      destroyed = true;
      elRef.current?.querySelector(".mapstage-dead")?.remove();
      flushCamSave();
      resizeObs?.disconnect();
      resizeObs = null;
      removeCtxHandlers?.();
      removeCtxHandlers = null;
      keyCleanupRef.current?.();
      keyCleanupRef.current = null;
      pinchCleanupRef.current?.();
      pinchCleanupRef.current = null;
      fitFnRef.current = null;
      if (syncRaf.current != null) cancelAnimationFrame(syncRaf.current);
      window.clearTimeout(standingRetryTimer.current);
      for (const { sprite } of liveGifs.current.values()) {
        try {
          sprite.destroy(false);
        } catch {
        }
      }
      liveGifs.current.clear();
      for (const { sprite } of liveAnims.current.values()) {
        try {
          sprite.destroy({ children: true, texture: false });
        } catch {
        }
      }
      liveAnims.current.clear();
      clearAllLiveDrag();
      const a = appRef.current;
      if (a) a.destroy(true, { children: true });
      appRef.current = null;
      worldRef.current = null;
      bgLayerRef.current = null;
      behindObjRef.current = null;
      bgObjRef.current = null;
      gridRef.current = null;
      tokenObjRef.current = null;
      standObjRef.current = null;
      barOverlayRef.current = null;
      drawGfxRef.current = null;
      scratchRef.current = null;
      measureRef.current = null;
      marqueeRef.current = null;
      measureTextRef.current = null;
      pingLayerRef.current = null;
      textObjRef.current = null;
      textVisRef.current.clear();
      pingAnim.current.clear();
      for (const src of gifCache.current.values()) {
        try {
          src.destroy();
        } catch {
        }
      }
      gifCache.current.clear();
      pendingGif.current.clear();
      badGif.current.clear();
      for (const tex of texCache.current.values()) {
        try {
          tex.destroy(true);
        } catch {
        }
      }
      texCache.current.clear();
      pendingTex.current.clear();
      standingUrls.current.clear();
      standingFail.current.clear();
      pendingStanding.current.clear();
      for (const frames of animCache.current.values()) {
        for (const f of frames) {
          try {
            f.texture.destroy(true);
          } catch {
          }
        }
      }
      animCache.current.clear();
      pendingAnim.current.clear();
      badAnim.current.clear();
      animBytesTotal.current = 0;
      const sb = shrunkBackdrop.current;
      if (sb) {
        try {
          sb.tex.destroy(true);
        } catch {
        }
        shrunkBackdrop.current = null;
      }
      useUIStore.getState().setBusy(null);
    };
  }, []);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    const img = background?.image;
    const { w: prevW, h: prevH } = lastBgWHRef.current;
    const switched = lastBgMapRef.current !== activeMapId;
    lastBgMapRef.current = activeMapId;
    if (switched) {
      lastBgImageRef.current = img;
    } else if (img !== lastBgImageRef.current) {
      lastBgImageRef.current = img;
      fitBackground(background);
    } else if (background && prevW && prevH && (background.w !== prevW || background.h !== prevH)) {
      const s = camRef.current.scale;
      camRef.current.x -= (background.w - prevW) / 2 * s;
      camRef.current.y -= (background.h - prevH) / 2 * s;
      applyCamera();
    }
    lastBgWHRef.current = { w: background?.w ?? 0, h: background?.h ?? 0 };
    syncBackground();
  }, [background]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    applyBgColor();
  }, [bgColor]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    applyBackdrop();
  }, [backdrop]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    const carry = keepViewRef.current && userMovedRef.current ? viewCenterNow() : null;
    flushCamSave();
    lastBgMapRef.current = activeMapId;
    userMovedRef.current = false;
    if (restoreSceneCamera(carry)) ;
    else {
      const bgNow = latest.current.background;
      if (bgNow && (bgNow.image || bgNow.w)) {
        fitBackground(bgNow);
      } else {
        fitFnRef.current?.();
        userMovedRef.current = false;
        cancelCamSave();
      }
    }
    syncBackground();
    syncTokens();
    redrawDrawings();
    syncTexts();
    if (latest.current.crossfade) playCrossfade();
  }, [activeMapId]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    syncTokens();
  }, [tokens, roster, charPool, self, selectedId, selectedIds, resizingId, tool, spokenSig]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    applyLayerVisibility();
  }, [hiddenLayers]);
  reactExports.useEffect(() => {
    if (netStatus !== "connected" || !appRef.current) return;
    const latched = [...standingUrls.current].filter(([, v]) => v === "");
    if (standingFail.current.size === 0 && latched.length === 0) return;
    standingFail.current.clear();
    for (const [k] of latched) standingUrls.current.delete(k);
    scheduleSync();
  }, [netStatus]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    redrawGrid();
    syncTokens();
  }, [grid]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    redrawDrawings();
  }, [drawings]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    syncTexts();
  }, [texts, tool, self]);
  reactExports.useEffect(() => {
    if (!appRef.current) return;
    for (const ping of pings) {
      if (ping.mapId !== activeMapId || pingAnim.current.has(ping.id)) continue;
      pingAnim.current.add(ping.id);
      spawnPing(ping);
    }
  }, [pings, activeMapId]);
  reactExports.useEffect(() => {
    if (tool !== "measure") clearMeasure();
    const app = appRef.current;
    if (app) {
      const c = tool === "pan" ? "grab" : tool === "measure" || tool === "draw" || tool === "erase" ? "crosshair" : tool === "text" ? "text" : tool === "ping" ? "pointer" : "default";
      app.renderer.events.cursorStyles.default = c;
      app.canvas.style.cursor = c;
    }
  }, [tool]);
  reactExports.useEffect(() => {
    if (!appRef.current || fitNonce === 0) return;
    fitFnRef.current?.();
  }, [fitNonce]);
  const focusBase = reactExports.useRef(useMapStore.getState().focusReq?.nonce ?? 0);
  reactExports.useEffect(() => {
    const app = appRef.current;
    if (!app || !focusReq || focusReq.nonce <= focusBase.current) return;
    const t = latest.current.tokens.find((x) => x.id === focusReq.id);
    if (!t) return;
    const cam = camRef.current;
    markUserMoved();
    cam.x = app.screen.width / 2 - t.x * cam.scale;
    cam.y = app.screen.height / 2 - t.y * cam.scale;
    applyCamera();
  }, [focusReq?.nonce]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: elRef, className: "mapstage", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: dragHintRef, className: "map-drag-hint", style: { display: "none" } }) });
}
function messageLevel(m) {
  const d = m.dice;
  if (!d) return void 0;
  if (d.kind === "check" || d.kind === "san") return d.level;
  if (d.kind === "opposed") return d.winner === "a" ? d.a.level : d.winner === "b" ? d.b.level : void 0;
  return void 0;
}
function CutInOverlay() {
  const roomCutIn = useNetStore((s) => s.roomCutIn);
  const roomCutImages = useNetStore((s) => s.roomCutImages);
  const [trigger, setTrigger] = reactExports.useState(null);
  const lastIdRef = reactExports.useRef(null);
  const timerRef = reactExports.useRef(null);
  const cutInRef = reactExports.useRef(roomCutIn);
  cutInRef.current = roomCutIn;
  const cutImagesRef = reactExports.useRef(roomCutImages);
  cutImagesRef.current = roomCutImages;
  reactExports.useEffect(() => {
    const msgs = useChatStore.getState().messages;
    lastIdRef.current = msgs.length ? msgs[msgs.length - 1].id : null;
    const unsub = useChatStore.subscribe((s) => {
      const messages = s.messages;
      if (!messages.length) {
        lastIdRef.current = null;
        return;
      }
      const prevId = lastIdRef.current;
      const idx = prevId ? messages.findIndex((m) => m.id === prevId) : -1;
      lastIdRef.current = messages[messages.length - 1].id;
      if (idx < 0) return;
      for (let i = messages.length - 1; i > idx; i--) {
        const m = messages[i];
        if (m.kind === "dice" || m.kind === "madness") {
          const level = messageLevel(m);
          const src = level && cutImagesRef.current[level] || cutInRef.current;
          if (!src) break;
          setTrigger({ id: m.id, src });
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setTrigger(null), 1700);
          break;
        }
      }
    });
    return () => {
      unsub();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  if (!trigger) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fxcard-overlay dice", "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RestartImg, { className: "fxcard-img", src: trigger.src, playKey: trigger.id }) }, trigger.id);
}
const MAX_SPEAKERS = 16;
function collectChoices(roster, pool, nickOf) {
  const byKey = /* @__PURE__ */ new Map();
  for (const c of [...Object.values(roster), ...Object.values(pool)]) {
    const key = charPoolKey(c.playerId, c.charId);
    if (!key || byKey.has(key)) continue;
    byKey.set(key, {
      key,
      name: c.name || "이름 없음",
      owner: nickOf(c.playerId),
      color: c.color,
      headshot: c.headshot,
      self: c.charId === "owner"
    });
  }
  return [...byKey.values()].sort(
    (a, b) => a.owner.localeCompare(b.owner) || Number(b.self) - Number(a.self) || a.name.localeCompare(b.name)
  );
}
function CardSpeakerPicker({
  card,
  onClose,
  onSave
}) {
  const roster = useNetStore((s) => s.roster);
  const charPool = useNetStore((s) => s.charPool);
  const participants = useNetStore((s) => s.participants);
  const choices = reactExports.useMemo(() => {
    const nick = new Map(participants.map((p) => [p.playerId, p.nick]));
    return collectChoices(roster, charPool, (id) => nick.get(id) || "나간 사람");
  }, [roster, charPool, participants]);
  const [picked, setPicked] = reactExports.useState(() => card.for ?? []);
  const orphans = picked.filter((k) => !choices.some((c) => c.key === k));
  const full = picked.length >= MAX_SPEAKERS;
  const toggle = (key) => setPicked((p) => {
    if (p.includes(key)) return p.filter((k) => k !== key);
    if (p.length >= MAX_SPEAKERS) return p;
    return [...p, key];
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "backdrop", style: { zIndex: 8e3 }, onClick: onClose }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal cardspk", style: { zIndex: 8001 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cardspk-head", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "record_voice_over", size: 18 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
          "화자 지정: ",
          card.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small cardspk-intro", children: "고른 사람이 말할 때만 이 카드가 뜹니다. 아무도 안 고르면 지금까지처럼 전원에게 뜹니다." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "cardspk-row cardspk-all" + (picked.length === 0 ? " on" : ""),
          onClick: () => setPicked([]),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cardspk-check", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: picked.length === 0 ? "check_circle" : "radio_button_unchecked", size: 17 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cardspk-nm", children: "전원 공용" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "누가 말해도 뜸" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cardspk-list", children: [
        choices.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: "14px 4px", textAlign: "center" }, children: "아직 이 방에서 말한 캐릭터가 없습니다. 한 번이라도 발화하면 여기에 나타납니다." }),
        choices.map((c) => {
          const on = picked.includes(c.key);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "cardspk-row" + (on ? " on" : ""),
              disabled: !on && full,
              onClick: () => toggle(c.key),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cardspk-check", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: on ? "check_circle" : "radio_button_unchecked", size: 17 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cardspk-face", style: { borderColor: c.color }, children: c.headshot ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: c.headshot, alt: "" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: c.self ? "person" : "face", size: 15 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cardspk-nm", children: c.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small cardspk-owner", children: c.self ? `${c.owner} · 캐릭터 없이` : c.owner })
              ]
            },
            c.key
          );
        })
      ] }),
      orphans.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cardspk-orphan", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", children: [
          "지금 이 방에 없는 화자 ",
          orphans.length,
          "명도 매여 있습니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cardspk-orphan-list", children: orphans.map((k, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "cardspk-orphan-x", title: "이 화자 떼어 내기", onClick: () => toggle(k), children: [
          "화자 ",
          i + 1,
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 12 })
        ] }, k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cardspk-foot", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: picked.length ? `${picked.length}명 지정${full ? ` (최대 ${MAX_SPEAKERS}명)` : ""}` : "전원 공용" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: onClose, children: "취소" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm pri", onClick: () => onSave(picked), children: "저장" })
      ] })
    ] })
  ] });
}
function MobileRoomNav() {
  const pane = useUIStore((s) => s.mobilePane);
  const setPane = useUIStore((s) => s.setMobilePane);
  const msgs = useChatStore((s) => s.messages);
  const epoch = useChatStore((s) => s.historyEpoch);
  const [unread, setUnread] = reactExports.useState(false);
  const seenRef = reactExports.useRef(msgs.length);
  reactExports.useEffect(() => {
    seenRef.current = useChatStore.getState().messages.length;
    setUnread(false);
  }, [epoch]);
  reactExports.useEffect(() => {
    if (pane === "chat") {
      seenRef.current = msgs.length;
      setUnread(false);
      return;
    }
    if (msgs.length <= seenRef.current) {
      seenRef.current = msgs.length;
      return;
    }
    const fresh = msgs.slice(seenRef.current);
    seenRef.current = msgs.length;
    if (fresh.some((m) => m.kind !== "system")) setUnread(true);
  }, [msgs, pane]);
  function toChat() {
    setPane("chat");
    requestAnimationFrame(() => {
      const log = document.querySelector(".chat .log");
      if (log) log.scrollTop = log.scrollHeight;
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "mroom-nav", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mnav-btn" + (pane === "stage" ? " on" : ""), onClick: () => setPane("stage"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "map", size: 18 }),
      " 무대"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mnav-btn" + (pane === "chat" ? " on" : ""), onClick: toChat, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chat", size: 18 }),
      " 채팅",
      unread && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mnav-dot" })
    ] })
  ] });
}
const LAYER_RANK = { standing: 2, token: 1, bg: 0, behind: -1 };
const EMPTY_TOKENS = [];
const byFrontDesc = (a, b) => {
  const d = LAYER_RANK[b.layer ?? "token"] - LAYER_RANK[a.layer ?? "token"];
  return d !== 0 ? d : (b.z ?? 0) - (a.z ?? 0);
};
function tokenName(t, charName) {
  return t.label || charName || (t.image ? "이미지 오브젝트" : "토큰");
}
function halfOf(e) {
  const r = e.currentTarget.getBoundingClientRect();
  return e.clientY < r.top + r.height / 2 ? "above" : "below";
}
function LayerRow({
  t,
  name,
  selected,
  isGlobal,
  dropHint,
  patchToken,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd
}) {
  const thumb = useThumb(t.image ? resolveAssetUrl(t.image) : void 0, 60);
  const visible = (t.visibility ?? "all") === "all" && !t.hidden;
  const behind = (t.layer ?? "token") === "behind";
  const [editing, setEditing] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState("");
  const reorder = (op) => useMapStore.getState().reorder(t.id, { op });
  const commitName = () => {
    setEditing(false);
    const next = draft.trim().slice(0, 60);
    if (next !== (t.label ?? "")) patchToken(t.id, { label: next });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "llp-row" + (selected ? " on" : "") + (dropHint === "above" ? " drop-above" : dropHint === "below" ? " drop-below" : ""),
      title: "클릭 = 맵에서 선택 · 화면 중앙으로 이동",
      draggable: !editing,
      onDragStart,
      onDragOver,
      onDrop,
      onDragEnd,
      onClick: () => {
        if (editing) return;
        useMapStore.getState().select(t.id);
        useMapStore.getState().focusToken(t.id);
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "llp-grip", title: "끌어서 순서 바꾸기", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "drag_indicator", size: 15 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "llp-thumb",
            style: t.image ? thumb ? { backgroundImage: `url(${thumb})` } : void 0 : { background: t.color || "var(--line2)" }
          }
        ),
        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "llp-rename",
            autoFocus: true,
            value: draft,
            maxLength: 60,
            placeholder: "이름 (비우면 기본 이름)",
            onClick: (e) => e.stopPropagation(),
            onChange: (e) => setDraft(e.target.value),
            onBlur: commitName,
            onKeyDown: (e) => {
              if (e.key === "Enter") commitName();
              else if (e.key === "Escape") setEditing(false);
            }
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "llp-name",
            title: "두 번 누르면 이름 바꾸기",
            onDoubleClick: (e) => {
              e.stopPropagation();
              setDraft(t.label ?? "");
              setEditing(true);
            },
            children: [
              name,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "llp-meta", children: [
                t.size ?? 1,
                "칸",
                t.memo ? " · 메모" : ""
              ] })
            ]
          }
        ),
        isGlobal && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn" + (t.mapIds ? "" : " on"),
            title: t.mapIds ? "가져온 맵에서만 보입니다. 눌러서 모든 맵세트에 표시" : "모든 맵세트에 표시 중",
            onClick: (e) => {
              e.stopPropagation();
              if (t.mapIds) useMapStore.getState().setTokenMapIds(t.id, null);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t.mapIds ? "filter_alt" : "select_all", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "이름 바꾸기",
            onClick: (e) => {
              e.stopPropagation();
              setDraft(t.label ?? "");
              setEditing(true);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "맨 앞으로 (무대 같은 쪽에서 가장 앞)",
            onClick: (e) => {
              e.stopPropagation();
              reorder("front");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "vertical_align_top", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "앞으로 (위 레이어와 순서 교환)",
            onClick: (e) => {
              e.stopPropagation();
              reorder("forward");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_upward", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "뒤로 (아래 레이어와 순서 교환)",
            onClick: (e) => {
              e.stopPropagation();
              reorder("backward");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_downward", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "맨 뒤로 (무대 같은 쪽에서 가장 뒤)",
            onClick: (e) => {
              e.stopPropagation();
              reorder("back");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "vertical_align_bottom", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: behind ? "무대 앞으로 내보내기" : "무대 뒤로 보내기",
            onClick: (e) => {
              e.stopPropagation();
              useMapStore.getState().reorder(t.id, { layer: behind ? "bg" : "behind" });
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: behind ? "flip_to_front" : "flip_to_back", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: visible ? "전체 공개. 클릭하면 비공개(GM만)" : "공개 제한 중. 클릭하면 전체 공개",
            onClick: (e) => {
              e.stopPropagation();
              patchToken(t.id, { visibility: visible ? "private" : "all", hidden: false });
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: visible ? "visibility" : "visibility_off", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn llp-lock" + (t.lockPos ? " locked" : ""),
            title: t.lockPos ? "위치 잠금. 클릭하면 해제" : "위치 잠금 해제됨. 클릭하면 잠금",
            onClick: (e) => {
              e.stopPropagation();
              patchToken(t.id, { lockPos: !t.lockPos });
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t.lockPos ? "lock" : "lock_open", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: isGlobal ? "이 맵 전용으로 내리기" : "통합 레이어로 올리기 (모든 맵세트에 유지)",
            onClick: (e) => {
              e.stopPropagation();
              useMapStore.getState().toLayer(t.id, !isGlobal);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: isGlobal ? "public_off" : "public", size: 15 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "삭제",
            onClick: (e) => {
              e.stopPropagation();
              void confirmDialog(`‘${tokenName(t)}’ 을(를) 삭제할까요?`).then((ok) => {
                if (ok) useMapStore.getState().remove(t.id);
              });
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 })
          }
        )
      ]
    }
  );
}
function LayerListPanel({
  patchToken,
  onAddLayer
}) {
  const closeWindow = useUIStore((s) => s.closeWindow);
  const mapTokens = useMapStore((s) => s.maps[s.activeMapId]?.tokens) ?? EMPTY_TOKENS;
  const globalTokens = useMapStore((s) => s.globalTokens);
  const selectedId = useMapStore((s) => s.selectedId);
  const roster = useNetStore((s) => s.roster);
  const charPool = useNetStore((s) => s.charPool);
  const [tab, setTab] = reactExports.useState("all");
  const isGlobal = tab === "global";
  const activeMapId = useMapStore((s) => s.activeMapId);
  const globalIds = reactExports.useMemo(() => new Set(globalTokens.map((t) => t.id)), [globalTokens]);
  const tokens = reactExports.useMemo(
    () => tab === "all" ? [...globalTokens, ...mapTokens] : isGlobal ? globalTokens : mapTokens,
    [tab, isGlobal, globalTokens, mapTokens]
  );
  const dragId = reactExports.useRef(null);
  const [dropAt, setDropAt] = reactExports.useState(null);
  const [behindOver, setBehindOver] = reactExports.useState(false);
  const rowName = (t) => tokenName(t, charOfToken(t, roster, charPool)?.name);
  const { front, behind } = reactExports.useMemo(() => {
    const line = tab === "all" ? sceneStack(globalTokens, mapTokens, activeMapId).map((r) => r.token).reverse() : tokens.slice().sort(byFrontDesc);
    return {
      front: line.filter((t) => (t.layer ?? "token") !== "behind"),
      behind: line.filter((t) => (t.layer ?? "token") === "behind")
    };
  }, [tab, tokens, globalTokens, mapTokens, activeMapId]);
  const lockedCount = tokens.filter((t) => t.lockPos).length;
  const lockAll = (lock) => {
    for (const t of tokens) if (!!t.lockPos !== lock) patchToken(t.id, { lockPos: lock });
  };
  const moveTo = (id, targetId, where) => {
    if (id === targetId) return;
    useMapStore.getState().reorder(id, {
      op: "moveTo",
      targetId,
      side: where === "above" ? "front" : "back"
    });
  };
  const rowProps = (t) => ({
    t,
    name: rowName(t),
    selected: t.id === selectedId,
    isGlobal: globalIds.has(t.id),
    dropHint: dropAt?.id === t.id ? dropAt.where : null,
    patchToken,
    onDragStart: () => {
      dragId.current = t.id;
    },
    onDragOver: (e) => {
      if (!dragId.current || dragId.current === t.id) return;
      e.preventDefault();
      const where = halfOf(e);
      setDropAt((p) => p?.id === t.id && p.where === where ? p : { id: t.id, where });
    },
    onDrop: (e) => {
      e.preventDefault();
      const src = dragId.current;
      dragId.current = null;
      setDropAt(null);
      if (src) moveTo(src, t.id, halfOf(e));
    },
    onDragEnd: () => {
      dragId.current = null;
      setDropAt(null);
    }
  });
  const renderRow = (t) => /* @__PURE__ */ jsxRuntimeExports.jsx(LayerRow, { ...rowProps(t) }, t.id);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: "layers",
      title: "레이어 목록",
      icon: "layers",
      onClose: () => closeWindow("layers"),
      defaultW: 560,
      defaultH: 520,
      minW: 430,
      minH: 260,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp-tabs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mbtn" + (tab === "all" ? " on" : ""), onClick: () => setTab("all"), children: [
            "전체 (",
            globalTokens.length + mapTokens.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mbtn" + (tab === "map" ? " on" : ""), onClick: () => setTab("map"), children: [
            "이 맵 (",
            mapTokens.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mbtn" + (tab === "global" ? " on" : ""), onClick: () => setTab("global"), children: [
            "통합 레이어 (",
            globalTokens.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "llp-hint muted small", children: tab === "all" ? "화면에 겹치는 순서 그대로예요(다른 맵 전용 통합 레이어는 빠짐). 끌어서 끼워 넣을 수 있어요." : isGlobal ? "통합 레이어는 맵세트를 전환해도 모든 맵에 함께 유지됩니다." : "위 = 무대 앞 · 아래 = 무대 뒤 · 끌어서 순서 변경" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "mbtn",
              title: isGlobal ? "통합 레이어 추가 (라이브러리 이미지를 모든 맵에 상주)" : "단독 레이어 추가 (라이브러리 이미지를 이 맵에 배치)",
              onClick: () => onAddLayer(isGlobal ? "global" : "map"),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 14 }),
                " ",
                isGlobal ? "통합" : "단독",
                " 레이어 추가"
              ]
            }
          ),
          tokens.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "mbtn",
                title: "이 목록의 레이어를 전부 위치 잠금",
                disabled: lockedCount === tokens.length,
                onClick: () => lockAll(true),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 14 }),
                  " 전체 잠금"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "mbtn",
                title: "이 목록의 위치 잠금을 전부 해제",
                disabled: lockedCount === 0,
                onClick: () => lockAll(false),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock_open", size: 14 }),
                  " 전체 해제"
                ]
              }
            )
          ] }),
          isGlobal && globalTokens.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "mbtn danger",
              title: "통합 레이어 전부 삭제 (모든 맵에서 사라짐 · 되돌릴 수 없음)",
              onClick: () => {
                void confirmDialog(
                  `통합 레이어 ${globalTokens.length}개를 모두 삭제할까요? (모든 맵에서 사라짐 · 되돌릴 수 없음)`
                ).then((ok) => {
                  if (ok) useMapStore.getState().removeGlobalTokens();
                });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete_sweep", size: 14 }),
                " 모두 삭제"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "llp-list", onDragLeave: () => setDropAt(null), children: tokens.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          front.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp-group", children: [
            "무대 앞 · ",
            front.length
          ] }),
          front.map(renderRow),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp-stage-divider", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "wallpaper", size: 13 }),
            " 무대(전경 이미지)"
          ] }),
          behind.length ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp-group", children: [
              "무대 뒤 · ",
              behind.length
            ] }),
            behind.map(renderRow)
          ] }) : (
            /* 비어 있어도 끌어다 놓을 수 있어야 한다 — 놓을 행이 없다고 무대 뒤로 보내는 길이 막히면
               목록에서 할 수 있는 일이 버튼 하나로 줄어든다. */
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "llp-behind-drop" + (behindOver ? " over" : ""),
                onDragOver: (e) => {
                  if (!dragId.current) return;
                  e.preventDefault();
                  setBehindOver(true);
                },
                onDragLeave: () => setBehindOver(false),
                onDrop: (e) => {
                  e.preventDefault();
                  const src = dragId.current;
                  dragId.current = null;
                  setBehindOver(false);
                  setDropAt(null);
                  if (src) useMapStore.getState().reorder(src, { layer: "behind" });
                },
                children: "무대 뒤가 비었습니다. 여기로 끌어다 놓거나 행의 ‘무대 뒤로 보내기’를 누르세요."
              }
            )
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 12 }, children: isGlobal ? "통합 레이어가 없습니다. ‘통합 레이어 추가’로 올려 보세요." : "레이어·토큰이 없습니다. ‘단독 레이어 추가’로 올려 보세요." }) })
      ] })
    }
  );
}
function MapsetThumb({ image }) {
  const thumb = useThumb(image ? resolveAssetUrl(image) : void 0, 72);
  if (!image) return /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "map", size: 13 });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mapset-thumb-img", style: thumb ? { backgroundImage: `url(${thumb})` } : void 0 });
}
function MapsetPanel({ onImportFile }) {
  const closeWindow = useUIStore((s) => s.closeWindow);
  const maps = useMapStore((s) => s.maps);
  const activeMapId = useMapStore((s) => s.activeMapId);
  const participants = useNetStore((s) => s.participants);
  const forceView = useNetStore((s) => s.forceView);
  const [sel, setSel] = reactExports.useState([]);
  const [movRow, setMovRow] = reactExports.useState(null);
  const [movSel, setMovSel] = reactExports.useState([]);
  const [movVn, setMovVn] = reactExports.useState(false);
  async function purgeAllMaps() {
    const count = Object.keys(useMapStore.getState().maps).length;
    if (!await confirmDialog(
      `맵세트 ${count}개를 모두 지우고 초기화할까요? 되돌릴 수 없습니다. (저장 슬롯은 남습니다)`
    ))
      return;
    const s = useMapStore.getState();
    const ids = Object.keys(s.maps);
    s.createMap("맵 1");
    for (const id of [...ids].reverse()) s.deleteMap(id);
    useMapStore.getState().removeGlobalTokens();
    setSel([]);
  }
  function doomedGlobalCount(doomed) {
    if (!doomed.size) return 0;
    return useMapStore.getState().globalTokens.filter((t) => t.importId && doomed.has(t.importId)).length;
  }
  async function onExport() {
    try {
      await withBusy("맵세트를 내보내는 중…", async () => {
        const s = useMapStore.getState();
        const hydrated = await hydrateAssetsDeep({ maps: Object.values(s.maps), globalTokens: s.globalTokens });
        const res = buildMapsetZip(hydrated.maps, hydrated.globalTokens);
        downloadBlob("타코야키-맵세트.zip", new Blob([res.bytes.slice().buffer], { type: "application/zip" }));
        const warn = [];
        if (res.missingImages)
          warn.push(`이미지 ${res.missingImages}개를 담지 못했습니다(불러오지 못한 그림).`);
        const o = res.overflow;
        if (o.maps) warn.push(`맵이 상한을 ${o.maps}개 넘습니다. 다시 가져오면 잘립니다.`);
        if (o.markers) warn.push(`한 맵의 오브제가 상한을 ${o.markers}개 넘습니다. 다시 가져오면 잘립니다.`);
        if (o.items) warn.push(`통합 레이어가 상한을 ${o.items}개 넘습니다. 다시 가져오면 잘립니다.`);
        if (warn.length) await alertDialog(warn.join("\n"));
      });
    } catch (err) {
      await alertDialog("내보내기에 실패했습니다: " + err.message);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: "mapsets",
      title: "맵세트 목록",
      icon: "map",
      onClose: () => closeWindow("mapsets"),
      defaultW: 430,
      defaultH: 520,
      minW: 370,
      minH: 280,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mbtn", onClick: () => useMapStore.getState().createMap(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
            " 새 맵세트"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "mbtn",
              title: "현재 맵세트를 무대·바탕·토큰·설정 통째로 복사",
              onClick: () => {
                const s = useMapStore.getState();
                s.duplicateMap(s.activeMapId);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "content_copy", size: 14 }),
                " 복제"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mbtn", title: "맵세트 파일(zip) 가져오기", onClick: onImportFile, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file_open", size: 14 }),
            " 가져오기"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "mbtn",
              title: "모든 맵세트를 파일(zip)로 내보내기",
              onClick: () => void onExport(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "file_download", size: 14 }),
                " 내보내기"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "mapset-row mapset-all",
            title: "목록 전체 선택/해제",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: (
                    // 개수 비교가 아니라 '살아있는 전 맵이 선택됐는가' — 스테일 선택이 전체 선택으로 오표시되지 않게.
                    Object.keys(maps).length > 0 && Object.keys(maps).every((id) => sel.includes(id))
                  ),
                  onChange: (e) => setSel(e.target.checked ? Object.keys(maps) : [])
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "전체 선택" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "llp-list", children: Object.values(maps).map((m) => {
          const checked = sel.includes(m.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mapset-row" + (m.id === activeMapId ? " on" : ""), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                title: "선택 (아래 ‘선택 삭제’ 용)",
                checked,
                onChange: () => setSel((cur) => checked ? cur.filter((x) => x !== m.id) : [...cur, m.id])
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "mapset-thumb",
                title: "내 화면만 이 맵으로 전환 (전원 이동은 오른쪽 버튼)",
                onClick: () => useMapStore.getState().activateMap(m.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapsetThumb, { image: m.background?.image })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "mapset-name",
                title: "내 화면만 이 맵으로 전환 (전원 이동은 오른쪽 버튼)",
                onClick: () => useMapStore.getState().activateMap(m.id),
                children: [
                  m.id === activeMapId && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 13 }),
                  " ",
                  m.name,
                  m.bgm !== void 0 ? " ♪" : ""
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "mbtn sq" + (movRow === m.id ? " on" : ""),
                  title: "전원(또는 선택 인원)을 이 맵세트로 이동",
                  onClick: () => {
                    setMovSel([]);
                    setMovRow((cur) => cur === m.id ? null : m.id);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "campaign", size: 14 })
                }
              ),
              movRow === m.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setMovRow(null), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "이동 대상 (미선택 시 전원)" }),
                participants.filter((p) => p.role !== "GM").map((p) => {
                  const on = movSel.includes(p.playerId);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      className: "tokenmenu-item",
                      style: { cursor: "pointer" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: on,
                            onChange: () => setMovSel(
                              (arr) => on ? arr.filter((x) => x !== p.playerId) : [...arr, p.playerId]
                            )
                          }
                        ),
                        p.nick
                      ]
                    },
                    p.playerId
                  );
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "tokenmenu-item", style: { cursor: "pointer" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: movVn,
                      onChange: (e) => setMovVn(e.target.checked)
                    }
                  ),
                  "비주얼 노벨 화면으로"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "tokenmenu-item",
                    onClick: () => {
                      const targets = movSel.length ? movSel : void 0;
                      forceView(movVn ? "vn" : "map", m.id, targets);
                      if (!targets && m.bgm !== void 0) useBgmStore.getState().applyBundle(m.bgm);
                      setMovRow(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "campaign", size: 15 }),
                      " ",
                      movSel.length ? `선택 인원 ${movSel.length}명 이동` : "전원 이동"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "mbtn sq",
                title: "이름 변경",
                onClick: async () => {
                  const n = await promptText({ title: "맵세트 이름", defaultValue: m.name });
                  if (n != null && n.trim()) useMapStore.getState().renameMap(m.id, n.trim());
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 14 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "mbtn sq",
                title: "복제",
                onClick: () => useMapStore.getState().duplicateMap(m.id),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "content_copy", size: 14 })
              }
            ),
            Object.keys(maps).length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "mbtn sq",
                title: "삭제",
                onClick: async () => {
                  const n = doomedGlobalCount(doomedImportTags(useMapStore.getState().maps, [m.id]));
                  if (!await confirmDialog(
                    `‘${m.name}’ 맵세트를 삭제할까요? (토큰·무대 포함, 되돌릴 수 없음${n ? ` · 함께 들어온 통합 레이어 ${n}개도 정리` : ""})`
                  ))
                    return;
                  const live = useMapStore.getState();
                  if (!live.maps[m.id] || Object.keys(live.maps).length <= 1) return;
                  const doomed = doomedImportTags(live.maps, [m.id]);
                  live.deleteMap(m.id);
                  if (doomed.size)
                    useMapStore.getState().removeGlobalTokens((t) => !!t.importId && doomed.has(t.importId));
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 })
              }
            )
          ] }, m.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "llp-actions", children: [
          sel.some((id) => maps[id]) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "mbtn danger",
              title: "체크한 맵세트 삭제 (전부면 초기화)",
              onClick: async () => {
                const s = useMapStore.getState();
                const preview = sel.filter((id) => s.maps[id]);
                if (!preview.length) return;
                if (preview.length >= Object.keys(s.maps).length) {
                  await purgeAllMaps();
                  return;
                }
                const n = doomedGlobalCount(doomedImportTags(s.maps, preview));
                if (!await confirmDialog(
                  `선택한 맵세트 ${preview.length}개를 삭제할까요? (토큰·무대 포함, 되돌릴 수 없음${n ? ` · 함께 들어온 통합 레이어 ${n}개도 정리` : ""})`
                ))
                  return;
                const live = useMapStore.getState();
                const ids = sel.filter((id) => live.maps[id]);
                if (!ids.length) return;
                if (ids.length >= Object.keys(live.maps).length) {
                  await purgeAllMaps();
                  return;
                }
                const doomed = doomedImportTags(live.maps, ids);
                for (const id of ids) live.deleteMap(id);
                if (doomed.size)
                  useMapStore.getState().removeGlobalTokens((t) => !!t.importId && doomed.has(t.importId));
                setSel([]);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete_sweep", size: 14 }),
                " 선택한 ",
                sel.filter((id) => maps[id]).length,
                "개 삭제"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "mbtn danger",
              title: "모든 맵세트를 삭제하고 빈 맵세트 하나로 초기화 (통합 레이어 포함)",
              onClick: () => void purgeAllMaps(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete_forever", size: 14 }),
                " 모두 삭제(초기화)"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
const GRID_CELL_MIN = 16;
const GRID_CELL_MAX = 256;
const GRID_CELL_STEP = 8;
function clampCellPx(n) {
  return Math.max(GRID_CELL_MIN, Math.min(GRID_CELL_MAX, Math.round(n)));
}
const NAME_COLOR_PRESETS = [
  "#e7676b",
  "#e7943e",
  "#e7d24a",
  "#7bd88f",
  "#5fc7d8",
  "#7c9cff",
  "#b98cff",
  "#ff8fc7",
  "#e9ecf6",
  "#9aa3b8"
];
const RECONNECT_BANNER = {
  position: "fixed",
  top: 10,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "7px 14px",
  borderRadius: 8,
  background: "rgba(24,18,12,0.96)",
  border: "1px solid var(--bad, #ef6f6f)",
  color: "#ffdada",
  fontSize: 13,
  fontWeight: 700,
  boxShadow: "0 6px 20px rgba(0,0,0,0.45)"
};
const RECONNECT_RETRY_BTN = {
  fontSize: 12,
  fontWeight: 700,
  padding: "3px 9px",
  borderRadius: 6,
  cursor: "pointer",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.35)",
  background: "transparent"
};
const RECONNECTED_TOAST = {
  position: "fixed",
  top: 10,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 9999,
  padding: "7px 14px",
  borderRadius: 8,
  background: "rgba(12,22,16,0.96)",
  border: "1px solid var(--good, #4fd6b0)",
  color: "#cdebdd",
  fontSize: 13,
  fontWeight: 700,
  boxShadow: "0 6px 20px rgba(0,0,0,0.45)"
};
function BarRow({
  bar,
  onPatch,
  onRemove,
  linkable
}) {
  const [label, setLabel] = reactExports.useState(bar.label ?? "");
  const [cur, setCur] = reactExports.useState(String(bar.cur));
  const [max, setMax] = reactExports.useState(String(bar.max));
  const timer = reactExports.useRef(null);
  const patchRef = reactExports.useRef(onPatch);
  patchRef.current = onPatch;
  const pending = reactExports.useRef({});
  const flush = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const patch = pending.current;
    pending.current = {};
    if (Object.keys(patch).length) patchRef.current(patch);
  };
  const push = (patch) => {
    pending.current = { ...pending.current, ...patch };
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, 350);
  };
  reactExports.useEffect(() => () => flush(), []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 4, alignItems: "center", padding: "2px 10px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        value: label,
        placeholder: "이름",
        style: { flex: 1, minWidth: 0, width: 52 },
        onChange: (e) => {
          setLabel(e.target.value);
          push({ label: e.target.value });
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "number",
        value: cur,
        style: { width: 42 },
        disabled: !!bar.link,
        onChange: (e) => {
          setCur(e.target.value);
          push({ cur: Number(e.target.value) || 0 });
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: 0.6 }, children: "/" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "number",
        value: max,
        style: { width: 42 },
        disabled: !!bar.link,
        onChange: (e) => {
          setMax(e.target.value);
          push({ max: Number(e.target.value) || 0 });
        }
      }
    ),
    linkable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        value: bar.link ?? "",
        style: { width: 84 },
        title: "캐릭터 시트 수치와 연동합니다",
        onChange: (e) => onPatch({ link: e.target.value || void 0 }),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "직접" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "hp", children: "체력" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mp", children: "마력·정신력" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "san", children: "이성" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { title: "삭제", style: { padding: "0 6px" }, onClick: onRemove, children: "×" })
  ] });
}
function NowPlayingBadge() {
  const tracks = useBgmStore((s) => s.tracks);
  const [host, setHost] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const find = () => document.querySelector(".mapwrap");
    setHost(find());
    const id = setInterval(() => {
      const el = find();
      setHost((p) => p === el ? p : el);
    }, 2500);
    return () => clearInterval(id);
  }, []);
  const title = tracks.filter((t) => t.playing).map((t) => (t.title || "").trim()).filter(Boolean).join(" · ");
  const [phase, setPhase] = reactExports.useState("off");
  reactExports.useEffect(() => {
    if (!title) {
      setPhase("off");
      return;
    }
    setPhase("in");
    const a1 = setTimeout(() => setPhase("out"), 1e4);
    const a2 = setTimeout(() => setPhase("off"), 1e4 + 600);
    return () => {
      clearTimeout(a1);
      clearTimeout(a2);
    };
  }, [title]);
  if (!host || !title || phase === "off") return null;
  return reactDomExports.createPortal(
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { key: title, className: "np-badge", style: { position: "absolute", top: 12, right: 12, zIndex: 6, maxWidth: "min(70%, 420px)", pointerEvents: "none", display: "flex", alignItems: "center", gap: 8, padding: "6px 14px 6px 10px", borderRadius: 999, background: "rgba(10,10,16,.8)", willChange: "transform, opacity", contain: "layout paint", color: "#fff", fontSize: 13, lineHeight: 1.3, boxShadow: "0 2px 10px rgba(0,0,0,.35)", animation: phase === "out" ? "npOut .6s ease-in forwards" : "npIn .6s ease-out" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: "@keyframes npIn{from{opacity:0;transform:translateX(48px)}to{opacity:1;transform:none}}@keyframes npOut{from{opacity:1;transform:none}to{opacity:0;transform:translateX(48px)}}@keyframes npBar{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, style: { display: "inline-flex", alignItems: "flex-end", gap: 2, height: 14, flex: "none" }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: 3, height: "100%", background: "var(--accent)", borderRadius: 1, transformOrigin: "bottom", animation: `npBar ${0.8 + i * 0.25}s ease-in-out infinite` } }, i)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { letterSpacing: 0.3 }, children: "Now Playing" }),
        " - " + title
      ] })
    ] }),
    host
  );
}
function Room() {
  const roomView = useUIStore((s) => s.roomView);
  const setRoomView = useUIStore((s) => s.setRoomView);
  const chatWidth = useUIStore((s) => s.chatWidth);
  const mobilePane = useUIStore((s) => s.mobilePane);
  const isMobileView = useIsMobile();
  reactExports.useEffect(() => {
    useUIStore.getState().setMobilePane("stage");
  }, []);
  const setScreen = useUIStore((s) => s.setScreen);
  const extRoomActions = expansionRoomActions(useExpansionRegistry((s) => s.byId));
  const windows = useUIStore((s) => s.windows);
  const setModal = useUIStore((s) => s.setModal);
  const resetLayout = useUIStore((s) => s.resetLayout);
  const openWindow = useUIStore((s) => s.openWindow);
  const closeWindow = useUIStore((s) => s.closeWindow);
  const rosterPos = useUIStore((s) => s.rosterPos);
  const setRosterPos = useUIStore((s) => s.setRosterPos);
  const rosterHidden = useUIStore((s) => s.rosterHidden);
  const toggleRosterHidden = useUIStore((s) => s.toggleRosterHidden);
  const rosterRef = reactExports.useRef(null);
  function clampRosterPos(p) {
    return {
      x: Math.max(0, Math.min(p.x, window.innerWidth - 80)),
      y: Math.max(0, Math.min(p.y, window.innerHeight - 80))
    };
  }
  reactExports.useEffect(() => {
    const fix = () => {
      const p = useUIStore.getState().rosterPos;
      if (!p) return;
      const c = clampRosterPos(p);
      if (c.x !== p.x || c.y !== p.y) useUIStore.getState().setRosterPos(c);
    };
    window.addEventListener("resize", fix);
    window.addEventListener("orientationchange", fix);
    return () => {
      window.removeEventListener("resize", fix);
      window.removeEventListener("orientationchange", fix);
    };
  }, []);
  const participants = useNetStore((s) => s.participants);
  const roster = useNetStore((s) => s.roster);
  const code = useNetStore((s) => s.code);
  const roomTitle = useNetStore((s) => s.roomTitle);
  const status = useNetStore((s) => s.status);
  const netError = useNetStore((s) => s.error);
  const leave = useNetStore((s) => s.leave);
  const self = useNetStore((s) => s.self);
  const reconnectNow = useNetStore((s) => s.reconnectNow);
  const forceView = useNetStore((s) => s.forceView);
  const roomVnOverlay = useNetStore((s) => s.roomVnOverlay);
  const roomLocked = useNetStore((s) => s.roomLocked);
  const setRoomLocked = useNetStore((s) => s.setRoomLocked);
  const setRoomVnOverlay = useNetStore((s) => s.setRoomVnOverlay);
  const roomPlObjects = useNetStore((s) => s.roomPlObjects);
  const roomPlObjectsSupported = useNetStore((s) => s.roomPlObjectsSupported);
  const setRoomPlObjects = useNetStore((s) => s.setRoomPlObjects);
  const positions = useNetStore((s) => s.positions);
  const views = useNetStore((s) => s.views);
  const roomDimColor = useNetStore((s) => s.roomDimColor);
  const setNameColor = useNetStore((s) => s.setNameColor);
  const requestSheet = useNetStore((s) => s.requestSheet);
  const viewedSheets = useNetStore((s) => s.viewedSheets);
  const nameColor = useUIStore((s) => s.nameColor);
  const drawColor = useUIStore((s) => s.drawColor);
  const setDrawColor = useUIStore((s) => s.setDrawColor);
  const penWidth = useUIStore((s) => s.penWidth);
  const setPenWidth = useUIStore((s) => s.setPenWidth);
  const mapTextColor = useUIStore((s) => s.mapTextColor);
  const setMapTextColor = useUIStore((s) => s.setMapTextColor);
  const mapTextSize = useUIStore((s) => s.mapTextSize);
  const setMapTextSize = useUIStore((s) => s.setMapTextSize);
  const mapTextBold = useUIStore((s) => s.mapTextBold);
  const setMapTextBold = useUIStore((s) => s.setMapTextBold);
  const [reconnected, setReconnected] = reactExports.useState(false);
  const prevStatus = reactExports.useRef(status);
  reactExports.useEffect(() => {
    const was = prevStatus.current;
    prevStatus.current = status;
    if ((was === "reconnecting" || was === "error") && status === "connected") {
      setReconnected(true);
      const t = setTimeout(() => setReconnected(false), 2600);
      return () => clearTimeout(t);
    }
    return void 0;
  }, [status]);
  const isGM = self?.role === "GM";
  const plCanAdd = !isGM && roomPlObjects && roomPlObjectsSupported;
  const cocLoaded = useRulesetStore((s) => s.imported.some((r) => r.kind === "coc"));
  reactExports.useEffect(() => {
    const root = document.documentElement;
    if (roomDimColor) root.style.setProperty("--mk-dim-color", roomDimColor);
    else root.style.removeProperty("--mk-dim-color");
    return () => {
      root.style.removeProperty("--mk-dim-color");
    };
  }, [roomDimColor]);
  const selectedTokenId = useMapStore((s) => s.selectedId);
  const resizingId = useMapStore((s) => s.resizingId);
  const setResizing = useMapStore((s) => s.setResizing);
  const placeToken = useMapStore((s) => s.place);
  const copyToken = useMapStore((s) => s.copyToken);
  const pasteToken = useMapStore((s) => s.pasteToken);
  const clipboard = useMapStore((s) => s.clipboard);
  const removeToken = useMapStore((s) => s.remove);
  const reorderToken = useMapStore((s) => s.reorder);
  const hiddenLayers = useMapStore((s) => s.maps[s.activeMapId]?.hiddenLayers) ?? [];
  const setLayersHidden = useMapStore((s) => s.setLayersHidden);
  const mapKeepView = useUIStore((s) => s.mapKeepView);
  const setMapKeepView = useUIStore((s) => s.setMapKeepView);
  const setMapBackground = useMapStore((s) => s.setBackground);
  const setBgColor = useMapStore((s) => s.setBgColor);
  const mapBgColor = useMapStore((s) => s.maps[s.activeMapId]?.bgColor);
  const setBackdrop = useMapStore((s) => s.setBackdrop);
  const mapBackdrop = useMapStore((s) => s.maps[s.activeMapId]?.backdrop);
  const setVnBackground = useMapStore((s) => s.setVnBackground);
  const activeVnBg = useMapStore((s) => s.maps[s.activeMapId]?.vnBackground);
  const activeVnBlur = useMapStore((s) => s.maps[s.activeMapId]?.vnBackgroundBlur);
  const setVnBgBlur = useMapStore((s) => s.setVnBgBlur);
  const setVnLayers = useMapStore((s) => s.setVnLayers);
  const activeVnLayers = useMapStore((s) => s.maps[s.activeMapId]?.vnLayers);
  const maps = useMapStore((s) => s.maps);
  const activeMapId = useMapStore((s) => s.activeMapId);
  const grid = useMapStore((s) => s.maps[s.activeMapId]?.grid ?? DEFAULT_GRID);
  const setGrid = useMapStore((s) => s.setGrid);
  const snap = useMapStore((s) => s.snap);
  const setSnap = useMapStore((s) => s.setSnap);
  const tool = useMapStore((s) => s.tool);
  const setTool = useMapStore((s) => s.setTool);
  const fitView = useMapStore((s) => s.fitView);
  const clearDrawings = useMapStore((s) => s.clearDrawings);
  const clearTexts = useMapStore((s) => s.clearTexts);
  const hasDrawings = useMapStore((s) => (s.maps[s.activeMapId]?.drawings.length ?? 0) > 0);
  const hasTexts = useMapStore((s) => (s.maps[s.activeMapId]?.texts?.length ?? 0) > 0);
  const createMap = useMapStore((s) => s.createMap);
  const setMapMeta = useMapStore((s) => s.setMapMeta);
  const setMapBgm = useMapStore((s) => s.setMapBgm);
  const importMaps = useMapStore((s) => s.importMaps);
  const activateMap = useMapStore((s) => s.activateMap);
  const saveSlots = useMapStore((s) => s.saveSlots);
  const saveSlot = useMapStore((s) => s.saveSlot);
  const loadSlot = useMapStore((s) => s.loadSlot);
  const deleteSlot = useMapStore((s) => s.deleteSlot);
  const visualCards = useNetStore((s) => s.visualCards);
  const setCard = useNetStore((s) => s.setCard);
  const deleteCard = useNetStore((s) => s.deleteCard);
  const playCard = useNetStore((s) => s.playCard);
  const previewCard = useNetStore((s) => s.previewCard);
  const globalTokens = useMapStore((s) => s.globalTokens);
  const toLayer = useMapStore((s) => s.toLayer);
  const [bgPicker, setBgPicker] = reactExports.useState(false);
  const [bgMenu, setBgMenu] = reactExports.useState(false);
  const [slotMenu, setSlotMenu] = reactExports.useState(false);
  const [cardMenu, setCardMenu] = reactExports.useState(false);
  const [transMenu, setTransMenu] = reactExports.useState(false);
  const [viewMenu, setViewMenu] = reactExports.useState(false);
  const [cardPending, setCardPending] = reactExports.useState(null);
  const [cardSpeakerFor, setCardSpeakerFor] = reactExports.useState(null);
  const [backdropMenu, setBackdropMenu] = reactExports.useState(false);
  const [tokenMenu, setTokenMenu] = reactExports.useState(false);
  const [sceneMenu, setSceneMenu] = reactExports.useState(false);
  const [forceMenu, setForceMenu] = reactExports.useState(false);
  const [forceTargets, setForceTargets] = reactExports.useState([]);
  const [applyBgmOn, setApplyBgmOn] = reactExports.useState(true);
  const [applyVnOn, setApplyVnOn] = reactExports.useState(false);
  const [vnBgPicker, setVnBgPicker] = reactExports.useState(false);
  const [vnLayerPicker, setVnLayerPicker] = reactExports.useState(false);
  const [vnMenu, setVnMenu] = reactExports.useState(null);
  const [tokenCtx, setTokenCtx] = reactExports.useState(null);
  const [mapCtx, setMapCtx] = reactExports.useState(null);
  const [standingPickPid, setStandingPickPid] = reactExports.useState(null);
  const [absentList, setAbsentList] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!tokenMenu || !isGM) return;
    let alive = true;
    void useNetStore.getState().fetchAbsentMembers().then((list) => {
      if (alive) setAbsentList(list);
    });
    return () => {
      alive = false;
    };
  }, [tokenMenu, isGM]);
  const [layerMenu, setLayerMenu] = reactExports.useState(false);
  const [imgPicker, setImgPicker] = reactExports.useState(null);
  const [mapBarOpen, setMapBarOpen] = reactExports.useState(false);
  const [bgSizeDraft, setBgSizeDraft] = reactExports.useState(null);
  const [cellSizeDraft, setCellSizeDraft] = reactExports.useState(null);
  const sizeEscRef = reactExports.useRef(false);
  const [namePicker, setNamePicker] = reactExports.useState(null);
  const [profileView, setProfileView] = reactExports.useState(null);
  const [codeCopied, setCodeCopied] = reactExports.useState(false);
  const [tokenImgTarget, setTokenImgTarget] = reactExports.useState(null);
  const [tokenSoundTarget, setTokenSoundTarget] = reactExports.useState(null);
  const tokenImgInput = reactExports.useRef(null);
  const tokenSoundInput = reactExports.useRef(null);
  const cardImgInput = reactExports.useRef(null);
  const cardSndInput = reactExports.useRef(null);
  const bgUploadInput = reactExports.useRef(null);
  const backdropUploadInput = reactExports.useRef(null);
  const mapsetFileInput = reactExports.useRef(null);
  function charIdOf(ch) {
    const id = ch?.charId;
    return id && id !== "owner" ? id : void 0;
  }
  function placeTokenFor(p) {
    const map = useMapStore.getState();
    const am = map.maps[map.activeMapId];
    const bg = am?.background;
    const baseX = bg ? (bg.w || 800) / 2 : 420;
    const baseY = bg ? (bg.h || 600) / 2 : 300;
    const n = am?.tokens.length ?? 0;
    placeToken({
      charPlayerId: p.playerId,
      // 지금 그 사람이 장착한 캐릭터를 토큰에 각인 — 나중에 저널을 갈아입어도 이 토큰은 제 캐릭터를 본다.
      // ⚠ 'owner' 는 '아무 시트도 안 걸침'을 뜻하는 자리표시자다. 그것을 각인하면 나중에 시트를 걸쳐도
      //   토큰이 영영 그 빈 자리를 가리켜, 이름·색·두상·수치 바가 안 붙는다.
      charId: charIdOf(roster[p.playerId]),
      label: p.nick,
      color: p.color,
      x: baseX + n % 5 * 34,
      y: baseY + Math.floor(n / 5) * 34,
      size: 4
      // 신규 기본 4칸 — 1칸은 무대에서 너무 작아 바로 키우게 되므로 처음부터 키워 둔다
    });
    setTokenMenu(false);
  }
  function placeStandingToken(pid, opts) {
    const map = useMapStore.getState();
    const am = map.maps[map.activeMapId];
    const bg = am?.background;
    const n = am?.tokens.length ?? 0;
    placeToken({
      charPlayerId: pid,
      charId: opts.charId || void 0,
      label: opts.label,
      image: opts.image,
      // 배치 시점 스냅샷(라이브 소스가 사라져도 이 모습으로 계속 표시)
      liveStanding: opts.live === true,
      x: (bg ? (bg.w || 800) / 2 : 420) + n % 5 * 60,
      y: bg ? (bg.h || 600) / 2 : 300,
      size: 8,
      // 스탠딩은 세로로 긴 대형 이미지 — VN 느낌이 나는 기본 크기
      layer: "standing",
      hideName: true,
      hideUI: true
    });
    setTokenMenu(false);
    setStandingPickPid(null);
  }
  function placeStandingSheet(pid, sheet) {
    const rch = roster[pid];
    const label = sheet.info?.name || rch?.name || "스탠딩";
    const worn = !!rch && rch.charId === sheet.id;
    const snapshot = worn ? activeStanding(rch) : activeStanding(sheet.portrait);
    placeStandingToken(pid, { image: snapshot, label, live: worn, charId: sheet.id });
  }
  const requestSheetSilent = useNetStore((s) => s.requestSheetSilent);
  const backfillDone = reactExports.useRef(/* @__PURE__ */ new Set());
  const backfillSheetReq = reactExports.useRef(/* @__PURE__ */ new Set());
  const backfillFail = reactExports.useRef(/* @__PURE__ */ new Map());
  reactExports.useEffect(() => {
    if (!isGM) return;
    const rid = useNetStore.getState().roomId;
    const all = [
      ...globalTokens.map((t) => ({ t, mapId: void 0 })),
      // 통합 레이어 — place 가 id 로 GLOBAL 라우팅
      ...Object.entries(maps).flatMap(([mid, m]) => m.tokens.map((t) => ({ t, mapId: mid })))
    ];
    const byId = new Map(all.map(({ t }) => [t.id, t]));
    for (const id of [...backfillDone.current]) {
      const cur = byId.get(id);
      if (!cur || cur.image) backfillDone.current.delete(id);
    }
    const legacy = all.filter(
      ({ t }) => ((t.layer ?? "token") === "standing" || t.liveStanding) && !!t.charPlayerId && !t.image && !backfillDone.current.has(t.id)
    );
    for (const { t, mapId } of legacy) {
      const pid = t.charPlayerId;
      const rch = roster[pid];
      let img;
      if (rch && (rch.name ?? "") === (t.label ?? "")) {
        if (rch.visibility === "hidden") continue;
        img = activeStanding(rch);
      }
      if (!img) {
        const sheets = viewedSheets[pid];
        if (!sheets) {
          if (!backfillSheetReq.current.has(pid)) {
            backfillSheetReq.current.add(pid);
            requestSheetSilent(pid);
          }
          continue;
        }
        const sheet = sheets.find(
          (sh) => (sh.info?.name ?? "") === (t.label ?? "") && sh.visibility !== "hidden"
        );
        if (sheet) img = activeStanding(sheet.portrait ?? {});
      }
      if (!img) continue;
      backfillDone.current.add(t.id);
      const apply = (image) => {
        if (useNetStore.getState().roomId !== rid) return;
        const s = useMapStore.getState();
        const coll = mapId === void 0 ? s.globalTokens : s.maps[mapId]?.tokens ?? [];
        const cur = coll.find((k) => k.id === t.id);
        if (!cur) return;
        s.place({ id: t.id, x: cur.x, y: cur.y, image }, mapId);
      };
      if (isAssetRef(img)) {
        const ref = img;
        void fetchAssetDataUrl(ref).then((u) => {
          if (u && u !== ref) {
            apply(ref);
          } else {
            const n = (backfillFail.current.get(t.id) ?? 0) + 1;
            backfillFail.current.set(t.id, n);
            if (n < 3) backfillDone.current.delete(t.id);
          }
        });
      } else {
        apply(img);
      }
    }
  }, [isGM, globalTokens, maps, roster, viewedSheets, requestSheetSilent]);
  function onPickBackground(a) {
    setMapBackground({ image: a.dataUrl, w: a.w ?? 0, h: a.h ?? 0 });
    setBgPicker(false);
  }
  async function onUploadBackground(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const image = await fileToHandoutImage(file);
      const { w, h } = await imageDims(image);
      setMapBackground({ image, w, h });
    } catch (err) {
      await alertDialog("무대 이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function onUploadBackdrop(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const image = await fileToBackdropImage(file);
      const blur = maps[activeMapId]?.backdrop?.blur ?? DEFAULT_BACKDROP_BLUR;
      setBackdrop({ image, blur });
    } catch (err) {
      await alertDialog("바탕 이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function importMapsetZipFile(file) {
    if (file.size > 120 * 1024 * 1024) {
      await alertDialog("맵세트 파일이 너무 큽니다(최대 120MB).");
      return;
    }
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const res = parseMapsetZip(bytes, file.name.replace(/\.zip$/i, "").trim());
      if (!res.ok) {
        await alertDialog("가져오기 실패: " + res.error);
        return;
      }
      const sent = await withBusy("맵세트를 가져오는 중…", () => importMaps(res.maps, res.globalTokens));
      if (!sent) return;
      const extra = res.globalTokens.length ? ` 통합 레이어 ${res.globalTokens.length}개도 함께 추가됐습니다(관리: 레이어 목록 창).` : "";
      const d = res.dropped;
      const cutList = [];
      if (d?.maps) cutList.push(`맵 ${d.maps}개`);
      if (d?.markers) cutList.push(`오브제 ${d.markers}개`);
      if (d?.items) cutList.push(`통합 오브제 ${d.items}개`);
      if (d?.cutins) cutList.push(`컷인 ${d.cutins}개`);
      if (d?.entries) cutList.push(`파일 ${d.entries}개`);
      const cutMsg = cutList.length ? ` 상한을 넘은 ${cutList.join("·")}는 제외됐습니다.` : "";
      await alertDialog(`맵세트 ${res.maps.length}개를 가져왔습니다. 맵세트 목록에서 확인하세요.${extra}${cutMsg}`);
      if (res.cutins.length) await offerCutinImport(res.cutins);
    } catch (err) {
      await alertDialog("파일을 읽지 못했습니다: " + err.message);
    }
  }
  async function offerCutinImport(cutins) {
    if (!isGM) return;
    if (!useMapStore.getState().transport) {
      await alertDialog(`이 파일에는 컷인 ${cutins.length}개가 들어 있지만, 비주얼 카드는 온라인 방에서만 등록할 수 있습니다.`);
      return;
    }
    const freeNow = () => MAX_CARDS - useNetStore.getState().visualCards.length;
    if (freeNow() <= 0) {
      await alertDialog(
        `이 파일에는 컷인 ${cutins.length}개가 들어 있지만, 비주얼 카드가 방 상한(${MAX_CARDS}장)까지 차 있어 가져올 수 없습니다.`
      );
      return;
    }
    const capNote = freeNow() < cutins.length ? ` 빈 자리가 ${freeNow()}장뿐이라 앞에서부터 그만큼만 들어옵니다.` : "";
    const ok = await confirmDialog(
      `이 파일에는 컷인 ${cutins.length}개가 들어 있습니다. 비주얼 카드로도 가져올까요? 카드 이름이 채팅에 들어가면 전원에게 재생됩니다.${capNote}`
    );
    if (!ok) return;
    const free = freeNow();
    if (free <= 0) {
      await alertDialog(`비주얼 카드가 방 상한(${MAX_CARDS}장)까지 차서 가져오지 못했습니다.`);
      return;
    }
    for (const c of cutins.slice(0, free)) {
      setCard({ id: newCardId(), name: c.name, image: c.image, ...c.displaySec ? { displaySec: c.displaySec } : {} });
    }
  }
  async function onImportMapsetFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    await importMapsetZipFile(file);
  }
  function fileToDataUrl(file) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.onerror = () => rej(r.error ?? new Error("읽기 실패"));
      r.readAsDataURL(file);
    });
  }
  const newCardId = () => globalThis.crypto?.randomUUID?.() ?? `vc_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const MAX_CARDS = 60;
  async function cardSlotFree() {
    if (visualCards.length < MAX_CARDS) return true;
    await alertDialog(`비주얼 카드는 방마다 ${MAX_CARDS}장까지입니다. 쓰지 않는 카드를 지우고 다시 시도해 주세요.`);
    return false;
  }
  async function onPickCardImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const p = cardPending;
    setCardPending(null);
    if (!file || !p) return;
    try {
      const image = await fileToLibraryImage(file);
      if ("card" in p) setCard({ ...p.card, image });
      else if (await cardSlotFree()) setCard({ id: newCardId(), name: p.name, image });
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function onPickCardSound(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const p = cardPending;
    setCardPending(null);
    if (!file || !p) return;
    try {
      const sound = await fileToDataUrl(file);
      if ("card" in p) setCard({ ...p.card, sound });
      else if (await cardSlotFree()) setCard({ id: newCardId(), name: p.name, sound });
    } catch (err) {
      await alertDialog("음향을 불러오지 못했습니다: " + err.message);
    }
  }
  function patchToken(id, patch) {
    const t = globalTokens.find((x) => x.id === id) ?? maps[activeMapId]?.tokens.find((x) => x.id === id);
    if (!t) return;
    placeToken({
      id: t.id,
      x: t.x,
      y: t.y,
      size: t.size,
      rotation: t.rotation,
      charPlayerId: t.charPlayerId,
      label: t.label,
      color: t.color,
      layer: t.layer,
      image: t.image,
      flipX: t.flipX,
      hideName: t.hideName,
      hideUI: t.hideUI,
      allowedPlayers: t.allowedPlayers,
      images: t.images,
      currentIndex: t.currentIndex,
      lockPos: t.lockPos,
      lockSize: t.lockSize,
      terrain: t.terrain,
      memo: t.memo,
      clickAction: t.clickAction,
      clickCardId: t.clickCardId,
      hidden: t.hidden,
      visibility: t.visibility,
      backImage: t.backImage,
      bars: t.bars,
      statsPrivate: t.statsPrivate,
      hoverImage: t.hoverImage,
      pressImage: t.pressImage,
      sounds: t.sounds,
      ...patch
    });
  }
  function addBar(t) {
    const id = globalThis.crypto?.randomUUID?.() ?? `bar_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const bars = [...t.bars ?? [], { id, label: "", cur: 10, max: 10 }].slice(0, 8);
    patchToken(t.id, { bars });
  }
  function updateBar(t, id, patch) {
    patchToken(t.id, { bars: (t.bars ?? []).map((b) => b.id === id ? { ...b, ...patch } : b) });
  }
  function removeBar(t, id) {
    patchToken(t.id, { bars: (t.bars ?? []).filter((b) => b.id !== id) });
  }
  function scaleMapBackground(factor) {
    const bg = maps[activeMapId]?.background;
    if (!bg?.w || !bg.h) return;
    const w = Math.round(Math.max(100, Math.min(16e3, bg.w * factor)));
    const h = Math.round(Math.max(100, Math.min(16e3, bg.h * factor)));
    setMapBackground({ ...bg, w, h });
  }
  function setMapSizePx(px) {
    if (!Number.isFinite(px)) return;
    const bg = maps[activeMapId]?.background;
    if (!bg?.w || !bg.h) return;
    const w = Math.round(Math.max(100, Math.min(16e3, px)));
    const h = Math.round(Math.max(1, w * (bg.h / bg.w)));
    setMapBackground({ ...bg, w, h });
  }
  async function resetMapSizePx() {
    const mapId = activeMapId;
    const bg = maps[mapId]?.background;
    if (!bg?.image) return;
    const { w, h } = await imageDims(bg.image);
    if (!w || !h) return;
    if (useMapStore.getState().activeMapId !== mapId) return;
    setMapBackground({ ...bg, w: Math.round(w), h: Math.round(h) });
    setBgSizeDraft(null);
  }
  function onPlaceImage(a) {
    const pick = imgPicker;
    if (!pick) return;
    const map = useMapStore.getState();
    const am = map.maps[map.activeMapId];
    const bg = am?.background;
    const cell = am?.grid.size || 64;
    const cx = bg ? (bg.w || 800) / 2 : 480;
    const cy = bg ? (bg.h || 600) / 2 : 360;
    const size = a.w ? Math.min(40, Math.max(1, a.w / cell)) : 4;
    if (pick === "global")
      placeToken({ image: a.dataUrl, layer: "bg", x: cx, y: cy, size }, GLOBAL_MAP_ID);
    else placeToken({ image: a.dataUrl, layer: pick, x: cx, y: cy, size });
    setImgPicker(null);
  }
  async function onPickTokenImage(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const target = tokenImgTarget;
    setTokenImgTarget(null);
    if (files.length === 0 || !target) return;
    try {
      const map = useMapStore.getState();
      const am = map.maps[map.activeMapId];
      if (target.mode === "new") {
        const file = files[0];
        const image = await fileToLibraryImage(file);
        const bg = am?.background;
        const n = am?.tokens.length ?? 0;
        const cell = am?.grid.size || 64;
        let size = 4;
        try {
          const url = URL.createObjectURL(file);
          const dim = await imageDims(url);
          URL.revokeObjectURL(url);
          if (dim.w) size = Math.max(1, Math.min(40, dim.w / cell));
        } catch {
        }
        placeToken({
          image,
          x: (bg ? (bg.w || 800) / 2 : 420) + n % 5 * 34,
          y: (bg ? (bg.h || 600) / 2 : 300) + Math.floor(n / 5) * 34,
          size
        });
      } else {
        const t = am?.tokens.find((x) => x.id === target.id);
        if (!t) return;
        if (target.mode === "addimage") {
          const base = t.images && t.images.length ? t.images : t.image ? [t.image] : [];
          const added = await withBusy(
            files.length > 1 ? `이미지 ${files.length}장 불러오는 중…` : "이미지 불러오는 중…",
            async () => {
              const out = [];
              for (const f of files) out.push(await fileToLibraryImage(f));
              return out;
            }
          );
          const nextImages = [...base, ...added];
          placeToken({
            id: t.id,
            x: t.x,
            y: t.y,
            size: t.size,
            charPlayerId: t.charPlayerId,
            label: t.label,
            color: t.color,
            layer: t.layer,
            image: nextImages[0],
            flipX: t.flipX,
            hideName: t.hideName,
            hideUI: t.hideUI,
            allowedPlayers: t.allowedPlayers,
            images: nextImages,
            currentIndex: t.currentIndex ?? 0
          });
        } else if (target.mode === "backimage") {
          const image = await fileToLibraryImage(files[0]);
          patchToken(t.id, { backImage: image });
        } else if (target.mode === "hoverimage") {
          const image = await fileToLibraryImage(files[0]);
          patchToken(t.id, { hoverImage: image });
        } else if (target.mode === "pressimage") {
          const image = await fileToLibraryImage(files[0]);
          patchToken(t.id, { pressImage: image });
        } else {
          const image = await fileToLibraryImage(files[0]);
          placeToken({
            id: t.id,
            x: t.x,
            y: t.y,
            size: t.size,
            charPlayerId: t.charPlayerId,
            label: t.label,
            color: t.color,
            layer: t.layer,
            image
          });
        }
      }
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function onPickTokenSound(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const target = tokenSoundTarget;
    setTokenSoundTarget(null);
    if (!file || !target) return;
    if (file.size > 8 * 1024 * 1024) {
      await alertDialog("효과음이 너무 큽니다. 8MB 이하의 짧은 음원을 사용하세요.");
      return;
    }
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(r.error ?? new Error("파일 읽기 실패"));
        r.readAsDataURL(file);
      });
      const t = globalTokens.find((x) => x.id === target.id) ?? maps[activeMapId]?.tokens.find((x) => x.id === target.id);
      patchToken(target.id, { sounds: { ...t?.sounds ?? {}, [target.slot]: dataUrl } });
    } catch (err) {
      await alertDialog("효과음을 불러오지 못했습니다: " + err.message);
    }
  }
  function clearTokenSound(t, slot) {
    patchToken(t.id, { sounds: { ...t.sounds ?? {}, [slot]: "" } });
  }
  function removeCardImage(t, idx) {
    const imgs = t.images ?? [];
    const next = imgs.filter((_, i) => i !== idx);
    const common = {
      id: t.id,
      x: t.x,
      y: t.y,
      size: t.size,
      charPlayerId: t.charPlayerId,
      label: t.label,
      color: t.color,
      layer: t.layer,
      flipX: t.flipX,
      hideName: t.hideName,
      hideUI: t.hideUI,
      allowedPlayers: t.allowedPlayers
    };
    if (next.length <= 1) {
      placeToken({ ...common, image: next[0] ?? t.image, images: [], currentIndex: 0 });
    } else {
      let cur = t.currentIndex ?? 0;
      if (idx < cur) cur -= 1;
      cur = Math.max(0, Math.min(cur, next.length - 1));
      placeToken({ ...common, image: next[0], images: next, currentIndex: cur });
    }
  }
  function moveCardImage(t, idx, delta) {
    const imgs = t.images ?? [];
    const to = idx + delta;
    if (to < 0 || to >= imgs.length) return;
    const next = imgs.slice();
    [next[idx], next[to]] = [next[to], next[idx]];
    const cur = t.currentIndex ?? 0;
    const movedCur = cur === idx ? to : cur === to ? idx : cur;
    placeToken({
      id: t.id,
      x: t.x,
      y: t.y,
      size: t.size,
      charPlayerId: t.charPlayerId,
      label: t.label,
      color: t.color,
      layer: t.layer,
      flipX: t.flipX,
      hideName: t.hideName,
      hideUI: t.hideUI,
      allowedPlayers: t.allowedPlayers,
      image: next[0],
      images: next,
      currentIndex: movedCur
    });
  }
  function onPickVnBackground(a) {
    setVnBackground(a.dataUrl);
    setVnBgPicker(false);
  }
  const vnLayersSorted = (activeVnLayers ?? []).slice().sort((a, b) => a.z - b.z);
  function commitVnLayers(next) {
    setVnLayers(next.map((l, i) => ({ ...l, z: i })));
  }
  function onAddVnLayer(a) {
    const id = globalThis.crypto?.randomUUID?.() ?? `vnl_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    commitVnLayers([...vnLayersSorted, { id, image: a.dataUrl, z: vnLayersSorted.length, opacity: 1 }]);
    setVnLayerPicker(false);
  }
  function removeVnLayer(id) {
    commitVnLayers(vnLayersSorted.filter((l) => l.id !== id));
  }
  function moveVnLayer(id, dir) {
    const arr = vnLayersSorted.slice();
    const i = arr.findIndex((l) => l.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    commitVnLayers(arr);
  }
  function setVnLayerOpacity(id, opacity) {
    commitVnLayers(vnLayersSorted.map((l) => l.id === id ? { ...l, opacity } : l));
  }
  function toggleVnLayerFit(id) {
    commitVnLayers(
      vnLayersSorted.map((l) => l.id === id ? { ...l, fit: l.fit === "contain" ? "cover" : "contain" } : l)
    );
  }
  function toggleVnLayerFront(id) {
    commitVnLayers(vnLayersSorted.map((l) => l.id === id ? { ...l, front: !l.front } : l));
  }
  function previewVnLayerTransform(id, patch) {
    const s = useMapStore.getState();
    s.setVnLayersLocal(
      s.activeMapId,
      (s.maps[s.activeMapId]?.vnLayers ?? []).map((l) => l.id === id ? { ...l, ...patch } : l)
    );
  }
  function commitVnLayerTransforms() {
    const s = useMapStore.getState();
    const cur = (s.maps[s.activeMapId]?.vnLayers ?? []).slice().sort((a, b) => a.z - b.z);
    commitVnLayers(
      cur.map((l) => {
        const next = { ...l };
        if (!next.x) delete next.x;
        if (!next.y) delete next.y;
        if (next.scale === 100) delete next.scale;
        return next;
      })
    );
  }
  function resetVnLayerTransform(id) {
    const s = useMapStore.getState();
    const cur = (s.maps[s.activeMapId]?.vnLayers ?? []).slice().sort((a, b) => a.z - b.z);
    commitVnLayers(
      cur.map((l) => {
        if (l.id !== id) return l;
        const next = { ...l };
        delete next.x;
        delete next.y;
        delete next.scale;
        return next;
      })
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    (status === "reconnecting" || status === "error") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: RECONNECT_BANNER, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: status === "error" ? `⚠ ${netError || "재연결 실패. 호스트가 응답하지 않습니다"}` : "● 서버와 재연결 중…" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: reconnectNow, style: RECONNECT_RETRY_BTN, children: "다시 시도" })
    ] }),
    reconnected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: RECONNECTED_TOAST, children: "✓ 재연결되었습니다" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app", "data-mpane": mobilePane, style: { ["--chat-w"]: `${chatWidth}px` }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "topbar", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rn", title: roomTitle || "세션", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BoxIcon, { size: 17 }),
          roomTitle ? roomTitle.length > 12 ? roomTitle.slice(0, 12) + "…" : roomTitle : "세션"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sel-wrap", style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "sel" + (isGM ? "" : " static"),
              onClick: isGM ? () => setSceneMenu((v) => !v) : void 0,
              title: isGM ? "장면(맵) 전환 (내 화면만 · 전원 이동은 맵 도구에서)" : "현재 장면",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "map", size: 15 }),
                " ",
                maps[activeMapId]?.name ?? "장면",
                isGM && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 18, className: "muted" })
              ]
            }
          ),
          isGM && sceneMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-veil", onClick: () => setSceneMenu(false) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-menu", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "장면 전환" }),
              Object.values(maps).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (m.id === activeMapId ? " on" : ""),
                  onClick: () => {
                    activateMap(m.id);
                    setSceneMenu(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: m.id === activeMapId ? "check" : "map", size: 15 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "scene-nm", children: m.name })
                  ]
                },
                m.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item add",
                  onClick: () => {
                    createMap();
                    setSceneMenu(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 15 }),
                    " 새 장면 추가"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "viewseg", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "vbtn" + (roomView === "map" ? " on" : ""), onClick: () => setRoomView("map"), children: "일반" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "vbtn" + (roomView === "vn" ? " on" : ""), onClick: () => setRoomView("vn"), children: "비주얼 노벨" })
        ] }),
        isGM && roomView === "map" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "vbtn vn-overlay-toggle" + (roomVnOverlay ? " on" : ""),
            title: "맵 위에 대사창+발화자 스탠딩을 겹쳐 표시 (전원 동기화)",
            onClick: () => setRoomVnOverlay(!roomVnOverlay),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chat", size: 15, fill: roomVnOverlay }),
              " VN 오버레이"
            ]
          }
        ),
        isGM && roomView === "map" && roomPlObjectsSupported && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "vbtn" + (roomPlObjects ? " on" : ""),
            title: "켜면 참가자도 맵에 그림 토큰을 올려 스티커처럼 꾸밀 수 있습니다. 참가자는 자기가 올린 것만 옮기거나 지울 수 있습니다.",
            onClick: () => setRoomPlObjects(!roomPlObjects),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_reaction", size: 15, fill: roomPlObjects }),
              " 참가자 오브젝트"
            ]
          }
        ),
        isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { position: "relative" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "iconbtn",
              title: "이동",
              "data-sfx": "button",
              onClick: () => setForceMenu((v) => !v),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "campaign", size: 18 })
            }
          ),
          forceMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-veil", onClick: () => setForceMenu(false) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-menu", style: { minWidth: 232 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "이동" }),
              participants.filter((p) => p.role !== "GM").length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "2px 8px 6px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { margin: "2px 0 4px" }, children: "이동 대상 (미선택 시 전원)" }),
                participants.filter((p) => p.role !== "GM").map((p) => {
                  const here = positions[p.playerId];
                  const hereName = here ? maps[here]?.name ?? "다른 맵" : "미확인";
                  const viewLabel = views[p.playerId] === "vn" ? "비주얼노벨" : here ? "일반" : "";
                  const on = forceTargets.includes(p.playerId);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "label",
                    {
                      className: "force-target",
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "3px 2px",
                        fontSize: 12,
                        cursor: "pointer"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: on,
                            onChange: () => setForceTargets(
                              (arr) => on ? arr.filter((x) => x !== p.playerId) : [...arr, p.playerId]
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            style: {
                              flex: 1,
                              minWidth: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            },
                            children: roster[p.playerId]?.name || p.nick
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "muted small",
                            title: "현재 위치(맵·뷰)",
                            style: { display: "inline-flex", alignItems: "center", gap: 2 },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "location_on", size: 12 }),
                              " ",
                              hereName,
                              viewLabel ? " · " + viewLabel : ""
                            ]
                          }
                        )
                      ]
                    },
                    p.playerId
                  );
                })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "force-apply-opts muted small",
                  style: { display: "flex", gap: 12, padding: "2px 10px 6px", flexWrap: "wrap" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "label",
                      {
                        style: { display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" },
                        title: "반영 시 이 맵세트에 저장된 번들 BGM 으로 방 BGM 을 교체",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: applyBgmOn,
                              onChange: (e) => setApplyBgmOn(e.target.checked)
                            }
                          ),
                          "BGM 포함"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "label",
                      {
                        style: { display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" },
                        title: "켜면 맵세트를 바꿔도 비주얼 노벨 화면 그대로입니다",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: applyVnOn,
                              onChange: (e) => setApplyVnOn(e.target.checked)
                            }
                          ),
                          "비주얼 노벨로"
                        ]
                      }
                    )
                  ]
                }
              ),
              Object.values(maps).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (m.id === activeMapId && roomView === "map" ? " on" : ""),
                  title: `${forceTargets.length ? "선택 인원" : "전원"}을 ‘${m.name}’ 맵세트로 이동${applyVnOn ? " (비주얼 노벨 화면)" : ""}`,
                  onClick: () => {
                    const targets = forceTargets.length ? forceTargets : void 0;
                    forceView(applyVnOn ? "vn" : "map", m.id, targets);
                    if (applyBgmOn && m.bgm !== void 0) useBgmStore.getState().applyBundle(m.bgm);
                    setForceMenu(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: m.id === activeMapId && roomView === "map" ? "check" : "map", size: 15 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "scene-nm", children: m.name })
                  ]
                },
                m.id
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (roomView === "vn" ? " on" : ""),
                  title: `${forceTargets.length ? "선택 인원" : "전원"}을 비주얼 노벨 화면으로 이동(내가 보는 현재 장면)`,
                  onClick: () => {
                    forceView("vn", activeMapId, forceTargets.length ? forceTargets : void 0);
                    setForceMenu(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: roomView === "vn" ? "check" : "theaters", size: 15 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "scene-nm", children: "비주얼 노벨" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "parts", children: [
          participants.map((p) => {
            const ch = roster[p.playerId];
            const label = ch?.name || p.nick;
            const headshot = ch ? activeHeadshot(ch) : void 0;
            const isGM2 = p.role === "GM";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "av-wrap",
                style: { position: "relative", display: "inline-flex" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "av",
                      style: {
                        background: headshot ? `center/cover url(${headshot})` : p.color,
                        opacity: p.connected ? 1 : 0.35,
                        boxShadow: isGM2 ? "0 0 0 2px var(--accent)" : void 0,
                        cursor: "pointer"
                      },
                      onClick: () => setProfileView(p.playerId),
                      title: `${label} · ${p.role}${p.nick !== label ? ` (${p.nick})` : ""}${p.connected ? "" : " · 접속 끊김"} (클릭: 프로필)`,
                      children: headshot ? "" : label[0] ?? "?"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "role-badge",
                      title: isGM2 ? "게임 마스터" : "플레이어",
                      style: {
                        position: "absolute",
                        bottom: -4,
                        right: -4,
                        fontSize: 8,
                        lineHeight: 1,
                        fontWeight: 800,
                        letterSpacing: 0.2,
                        padding: "1px 3px",
                        borderRadius: 4,
                        background: isGM2 ? "var(--accent)" : "rgba(120,130,150,0.92)",
                        color: "#fff",
                        pointerEvents: "none"
                      },
                      children: p.role
                    }
                  )
                ]
              },
              p.playerId
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "chip",
              title: "참가자 관리",
              style: { marginLeft: 10, cursor: "pointer" },
              onClick: () => setModal("participants"),
              children: [
                "● ",
                participants.filter((p) => p.connected).length,
                "명 접속"
              ]
            }
          ),
          code && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "chip",
              title: "클릭하면 초대 코드 복사",
              style: {
                marginLeft: 8,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5
              },
              onClick: () => {
                const cb = navigator.clipboard;
                if (cb?.writeText) {
                  void cb.writeText(code).catch(() => {
                  });
                } else {
                  try {
                    const ta = document.createElement("textarea");
                    ta.value = code;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand("copy");
                    ta.remove();
                  } catch {
                  }
                }
                setCodeCopied(true);
                window.setTimeout(() => setCodeCopied(false), 1200);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: codeCopied ? "check" : "content_copy", size: 14 }),
                " ",
                codeCopied ? "복사됨!" : code
              ]
            }
          ),
          isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "chip" + (roomLocked ? " warn" : ""),
              title: roomLocked ? "지금은 준비 중이라 나 말고는 새로 들어올 수 없습니다. 누르면 엽니다." : "준비 중으로 잠급니다. 나 말고는 새로 못 들어옵니다(이미 있는 사람은 그대로).",
              style: { marginLeft: 6, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 },
              onClick: () => setRoomLocked(!roomLocked),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: roomLocked ? "lock" : "lock_open", size: 14 }),
                " ",
                roomLocked ? "준비 중" : "열림"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "화면 배치를 처음 상태로 되돌립니다",
            "data-sfx": "button",
            onClick: resetLayout,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings_backup_restore" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: rosterHidden ? "접속자 두상 카드 보이기" : "접속자 두상 카드 숨기기",
            "data-sfx": "button",
            onClick: toggleRosterHidden,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: rosterHidden ? "person_off" : "person_pin" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: isGM ? "BGM 관리 (음원 업로드·트랙별 볼륨·동시재생)" : "사운드 (배경음악·효과음 볼륨)",
            "data-sfx": "open",
            onClick: () => setModal("bgm"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "library_music" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "참가자", onClick: () => setModal("participants"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "groups" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "캐릭터 관리",
            "data-sfx": "open",
            onClick: () => setModal("characters"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "recent_actors" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "내 프로필 (닉네임·사진·소개)",
            onClick: () => setModal("profile"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "manage_accounts" })
          }
        ),
        extRoomActions.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: a.label, onClick: () => a.onSelect(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: a.icon }) }, a.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "설정", onClick: () => setScreen("settings"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "나가기",
            onClick: () => {
              leave();
              setScreen("lobby");
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "logout" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rail", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool" + (tool === "select" ? " on" : ""),
            title: "선택 / 조정 (맵의 오브제·토큰을 선택·이동·회전. 우클릭·휠클릭 드래그나 방향키·WASD로 시야 이동, Shift+휠 가로 이동, +/- 확대)",
            onClick: () => setTool("select"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "near_me", size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool" + (tool === "pan" ? " on" : ""),
            title: "화면 이동 (드래그로 맵 이동. 어느 도구에서든 우클릭·휠클릭 드래그와 방향키·WASD로도 움직입니다)",
            onClick: () => setTool("pan"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "pan_tool", size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool" + (snap ? " on" : ""),
            title: "스냅 정렬 (켜면 칸에 맞춰 움직이고 크기도 칸 단위로 잡힙니다)",
            onClick: () => setSnap(!snap),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "grid_on", size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sep" }),
        isGM && roomView === "map" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (windows.layers ? " on" : ""),
              title: "레이어 목록 창 열기/닫기",
              onClick: () => windows.layers ? closeWindow("layers") : openWindow("layers"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (windows.mapsets ? " on" : ""),
              title: "맵세트 목록 창 열기/닫기",
              onClick: () => windows.mapsets ? closeWindow("mapsets") : openWindow("mapsets"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "map", size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "tool" + (tokenMenu ? " on" : ""),
                title: "토큰 추가 (참가자 토큰 또는 이미지 토큰)",
                onClick: () => setTokenMenu((v) => !v),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_circle", size: 20 })
              }
            ),
            tokenMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              FlyMenu,
              {
                onClose: () => {
                  setTokenMenu(false);
                  setStandingPickPid(null);
                },
                children: [
                  participants.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 8 }, children: "참가자가 없습니다" }) : participants.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "tokenmenu-item",
                      onClick: () => placeTokenFor(p),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "dot",
                            style: { background: roster[p.playerId]?.color || p.color }
                          }
                        ),
                        roster[p.playerId]?.name || p.nick,
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: "auto" }, children: p.role })
                      ]
                    },
                    p.playerId
                  )),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "tokenmenu-item",
                      onClick: () => {
                        setTokenImgTarget({ mode: "new" });
                        setTokenMenu(false);
                        tokenImgInput.current?.click();
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 16 }),
                        " 이미지로 토큰 추가"
                      ]
                    }
                  ),
                  participants.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-sub", children: standingPickPid === null ? "스탠딩 추가 (참가자 선택)" : `스탠딩 추가 (${roster[standingPickPid]?.name || absentList.find((m) => m.playerId === standingPickPid)?.nick || "참가자"}의 시트 선택)` }),
                    standingPickPid === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      participants.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          title: "이 참가자의 캐릭터 시트를 골라 스탠딩을 맵에 배치",
                          onClick: () => {
                            setStandingPickPid(p.playerId);
                            requestSheet(p.playerId);
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person", size: 16 }),
                            " ",
                            roster[p.playerId]?.name || p.nick,
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chevron_right", size: 16, style: { marginLeft: "auto" } })
                          ]
                        },
                        "standing-" + p.playerId
                      )),
                      absentList.filter((m) => !participants.some((p) => p.playerId === m.playerId)).map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          title: "시트를 골라 스탠딩을 배치합니다 (배치 시점 모습으로 유지)",
                          onClick: () => {
                            setStandingPickPid(m.playerId);
                            requestSheet(m.playerId);
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person_off", size: 16 }),
                            " ",
                            m.nick,
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: 6 }, children: "부재" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chevron_right", size: 16, style: { marginLeft: "auto" } })
                          ]
                        },
                        "standing-absent-" + m.playerId
                      ))
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          onClick: () => setStandingPickPid(null),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_back", size: 16 }),
                            " 뒤로 (참가자 선택)"
                          ]
                        }
                      ),
                      (() => {
                        const sheets = viewedSheets[standingPickPid];
                        if (!sheets)
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { padding: 8 }, children: [
                            "시트를 불러오는 중…",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                className: "btn sm",
                                style: { marginLeft: 8 },
                                onClick: () => requestSheet(standingPickPid),
                                children: "다시 시도"
                              }
                            )
                          ] });
                        if (sheets.length === 0)
                          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 8 }, children: "저장된 캐릭터 시트가 없습니다" });
                        return sheets.map((sh) => {
                          const cnt = sh.portrait?.standings?.length ?? 0;
                          const worn = roster[standingPickPid]?.charId === sh.id;
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              className: "tokenmenu-item",
                              disabled: cnt === 0,
                              title: cnt === 0 ? "이 시트는 등록된 스탠딩이 없습니다(시트에서 등록)" : worn ? "착용 중 (표정을 바꾸면 즉시 교체)" : "이 시트의 대표 스탠딩을 맵에 배치합니다(정적)",
                              onClick: () => placeStandingSheet(standingPickPid, sh),
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person", size: 16 }),
                                " ",
                                sh.info?.name || "이름 없음",
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: "auto" }, children: cnt === 0 ? "스탠딩 없음" : worn ? "착용·라이브" : `${cnt}개` })
                              ]
                            },
                            "sheet-" + sh.id
                          );
                        });
                      })()
                    ] })
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "tool" + (layerMenu ? " on" : ""),
                title: "라이브러리 이미지를 레이어로 추가",
                onClick: () => setLayerMenu((v) => !v),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 20 })
              }
            ),
            layerMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setLayerMenu(false), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-sub", children: "라이브러리에서 이미지 선택" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "tokenmenu-item",
                  title: "이 맵에만 두는 레이어 (맵세트를 바꾸면 바뀜)",
                  onClick: () => {
                    setImgPicker("bg");
                    setLayerMenu(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 16 }),
                    " 단독 레이어(이 맵)…"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "tokenmenu-item",
                  title: "모든 맵세트에 남는 레이어",
                  onClick: () => {
                    setImgPicker("global");
                    setLayerMenu(false);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "public", size: 16 }),
                    " 통합 레이어(모든 맵)…"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sep" })
        ] }),
        plCanAdd && roomView === "map" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool",
              title: "이미지 토큰 추가 (내가 올린 것만 옮기거나 지울 수 있습니다)",
              onClick: () => {
                setTokenImgTarget({ mode: "new" });
                tokenImgInput.current?.click();
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_circle", size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sep" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool" + (tool === "draw" ? " on" : ""),
            title: "그리기 (맵에 자유롭게 · 다시 누르면 해제)",
            onClick: () => setTool(tool === "draw" ? "select" : "draw"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "draw", size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool" + (tool === "text" ? " on" : ""),
            title: "텍스트 (클릭=입력 · 우클릭=삭제)",
            onClick: () => setTool(tool === "text" ? "select" : "text"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "text_fields", size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            className: "tool",
            title: "그리기 색",
            style: { position: "relative", overflow: "hidden", cursor: "pointer" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: drawColor,
                    border: "1px solid var(--line2)"
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  value: drawColor,
                  onChange: (e) => setDrawColor(e.target.value),
                  style: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }
                }
              )
            ]
          }
        ),
        tool === "draw" && /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "tool pen-width-tool", title: `펜 두께 (${penWidth}px)`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            className: "pen-width",
            min: 1,
            max: 20,
            value: penWidth,
            onChange: (e) => setPenWidth(Number(e.target.value))
          }
        ) }),
        tool === "text" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "tool",
              title: "글자색",
              style: { position: "relative", overflow: "hidden", cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      width: 18,
                      height: 18,
                      borderRadius: 4,
                      background: mapTextColor,
                      border: "1px solid var(--line2)"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: mapTextColor,
                    onChange: (e) => setMapTextColor(e.target.value),
                    style: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "tool pen-width-tool", title: `글자 크기 (${mapTextSize}px)`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              className: "pen-width",
              min: 12,
              max: 120,
              value: mapTextSize,
              onChange: (e) => setMapTextSize(Number(e.target.value))
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (mapTextBold ? " on" : ""),
              title: "굵게",
              style: { fontWeight: 800 },
              onClick: () => setMapTextBold(!mapTextBold),
              children: "B"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool" + (tool === "erase" ? " on" : ""),
            title: "지우개 (내 획 · GM은 전체 획)",
            onClick: () => setTool(tool === "erase" ? "select" : "erase"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "ink_eraser", size: 20 })
          }
        ),
        isGM && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool",
            title: "드로잉·텍스트 전체 지우기 (GM)",
            disabled: !hasDrawings && !hasTexts,
            onClick: async () => {
              if ((hasDrawings || hasTexts) && await confirmDialog("이 맵의 모든 드로잉과 텍스트를 지울까요?")) {
                clearDrawings();
                clearTexts();
              }
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete_sweep", size: 20 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "tool" + (tool === "ping" ? " on" : ""),
            title: "핑 (클릭한 곳을 전원에게 잠깐 표시)",
            onClick: () => setTool(tool === "ping" ? "select" : "ping"),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "my_location", size: 20 })
          }
        ),
        isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sep" }),
          cocLoaded && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (windows.madness ? " on" : ""),
              title: "광기 표 편집 (전원 적용) · GM",
              onClick: () => windows.madness ? closeWindow("madness") : openWindow("madness"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "neurology", size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (windows.choice ? " on" : ""),
              title: "선택지 만들기 (결과는 GM만 봄)",
              onClick: () => windows.choice ? closeWindow("choice") : openWindow("choice"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "quiz", size: 20 })
            }
          )
        ] }),
        self && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rail-bottom", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (windows.deck ? " on" : ""),
              title: isGM ? "덱 (카드 뭉치를 짜고 뽑기)" : "덱 (카드 뽑기)",
              onClick: () => windows.deck ? closeWindow("deck") : openWindow("deck"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "style", size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (windows.decor ? " on" : ""),
              title: isGM ? "채팅 꾸미기 (글자색·배경·크기·루비·스크립트·매크로) · GM" : "채팅 꾸미기 (글자색·크기·기울임·굵기·이미지)",
              onClick: () => windows.decor ? closeWindow("decor") : openWindow("decor"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "palette", size: 20 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "tool" + (windows.bookmarks ? " on" : ""),
              title: "꾸미기 북마크 (저장한 효과·문구를 클릭 한 번으로 적용)",
              onClick: () => windows.bookmarks ? closeWindow("bookmarks") : openWindow("bookmarks"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmarks", size: 20 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(NowPlayingBadge, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "mapwrap",
          onContextMenu: (e) => {
            if (roomView === "map") return void e.preventDefault();
            if (roomView !== "vn" || !isGM) return;
            e.preventDefault();
            const z = effectiveUiScale();
            setVnMenu({ x: e.clientX / z, y: e.clientY / z });
          },
          onDragOver: isGM && roomView === "map" ? (e) => {
            if (e.dataTransfer.types.includes("Files")) e.preventDefault();
          } : void 0,
          onDrop: isGM && roomView === "map" ? (e) => {
            if (!e.dataTransfer.types.includes("Files")) return;
            e.preventDefault();
            const file = Array.from(e.dataTransfer.files).find(
              (f) => /\.zip$/i.test(f.name) || f.type === "application/zip"
            );
            if (!file) return;
            void confirmDialog(`‘${file.name}’ 을(를) 맵세트로 가져올까요?`).then((ok) => {
              if (ok) void importMapsetZipFile(file);
            });
          } : void 0,
          children: roomView === "map" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MapStage,
              {
                onTokenContextMenu: setTokenCtx,
                onMapContextMenu: isGM || plCanAdd ? setMapCtx : void 0
              }
            ),
            roomVnOverlay && /* @__PURE__ */ jsxRuntimeExports.jsx(VNView, { overlay: true }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-tools", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "map-tools-btn lbl",
                  title: "무대가 화면에 다 들어오게 맞춥니다",
                  onClick: () => fitView(),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "fit_screen", size: 18 }),
                    " 전체 보기"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "map-tools-btn lbl" + (mapKeepView ? " on" : ""),
                  title: mapKeepView ? "맵을 옮겨도 지금 보던 배율·위치를 그대로 씁니다 (내 화면에만 · 눌러서 끄기)" : "맵마다 따로 잡아 둔 화면으로 돌아갑니다 (내 화면에만 · 눌러서 켜기)",
                  "aria-pressed": mapKeepView,
                  onClick: () => setMapKeepView(!mapKeepView),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: mapKeepView ? "push_pin" : "my_location", size: 18 }),
                    " 화면 유지"
                  ]
                }
              ),
              clipboard && (isGM || plCanAdd) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "map-tools-btn lbl",
                  title: "복사한 토큰을 이 맵에 붙입니다 (Ctrl+V)",
                  onClick: () => pasteToken(),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "content_paste", size: 18 }),
                    " 붙여넣기"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "map-tools-btn lbl" + (viewMenu ? " on" : ""),
                    title: "무대 앞/뒤 레이어 표시 (GM 설정 · 전원 공유)",
                    onClick: () => setViewMenu((v) => !v),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "visibility", size: 18 }),
                      " 보기 ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 16 })
                    ]
                  }
                ),
                viewMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(FlyMenu, { onClose: () => setViewMenu(false), children: (() => {
                  const FRONT = ["bg", "token", "standing"];
                  const frontHidden = FRONT.some((l) => hiddenLayers.includes(l));
                  const behindHidden = hiddenLayers.includes("behind");
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    !isGM && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: "4px 10px 2px" }, children: "GM 설정에 따라 표시됩니다" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "tokenmenu-item",
                        disabled: !isGM,
                        onClick: isGM ? () => setLayersHidden(FRONT, !frontHidden) : void 0,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: frontHidden ? "visibility_off" : "visibility", size: 16 }),
                          " 무대 앞 레이어",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: "auto" }, children: frontHidden ? "숨김" : "표시 중" })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "tokenmenu-item",
                        disabled: !isGM,
                        onClick: isGM ? () => setLayersHidden(["behind"], !behindHidden) : void 0,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: behindHidden ? "visibility_off" : "visibility", size: 16 }),
                          " 무대 뒤 레이어",
                          " ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: "auto" }, children: behindHidden ? "숨김" : "표시 중" })
                        ]
                      }
                    )
                  ] });
                })() })
              ] }),
              isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "map-tools-btn lbl" + (mapBarOpen ? " on" : ""),
                    onClick: () => setMapBarOpen((v) => !v),
                    title: mapBarOpen ? "맵 도구 접기" : "맵 도구 (맵세트·무대·레이어·그리드)",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: mapBarOpen ? "close" : "tune", size: 18 }),
                      " ",
                      mapBarOpen ? "접기" : "맵 도구"
                    ]
                  }
                ),
                mapBarOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "map-gm-bar", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-tag muted small", children: "맵세트" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "mbtn" + (windows.mapsets ? " on" : ""),
                      "data-sfx": "open",
                      title: "맵세트 목록 창 열기/닫기",
                      onClick: () => windows.mapsets ? closeWindow("mapsets") : openWindow("mapsets"),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "map", size: 16 }),
                        " 맵 목록",
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { margin: "0 2px" }, children: [
                          "(",
                          Object.keys(maps).length,
                          ")"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_new", size: 14 })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "mbtn" + (windows.layers ? " on" : ""),
                      "data-sfx": "open",
                      title: "레이어 목록 창 열기/닫기",
                      onClick: () => windows.layers ? closeWindow("layers") : openWindow("layers"),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 16 }),
                        " 레이어 목록",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_new", size: 14 })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-cur muted small", title: `현재 맵: ${maps[activeMapId]?.name ?? ""}`, children: maps[activeMapId]?.name ?? "" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "mbtn" + (transMenu ? " on" : ""),
                        "data-sfx": "open",
                        title: "맵세트 반영(전원 이동) 시 연출 (크로스페이드·BGM 번들)",
                        onClick: () => setTransMenu((v) => !v),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "animation", size: 16 }),
                          " 전환 ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 16 })
                        ]
                      }
                    ),
                    transMenu && (() => {
                      const cur = maps[activeMapId];
                      if (!cur) return null;
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setTransMenu(false), children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "tokenmenu-item",
                            title: "이 맵으로 전환 시 페이드 연출",
                            onClick: () => setMapMeta(activeMapId, {
                              crossfade: !cur.crossfade
                            }),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "animation", size: 16 }),
                              " 크로스페이드",
                              cur.crossfade ? " (켜짐)" : ""
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "tokenmenu-item",
                            title: "현재 방 BGM 을 이 맵세트에 저장 (반영 시 함께 적용)",
                            onClick: () => {
                              setTransMenu(false);
                              setMapBgm(activeMapId, "save");
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "music_note", size: 16 }),
                              " 현재 BGM 을 번들로 저장",
                              cur.bgm !== void 0 ? " (저장됨)" : ""
                            ]
                          }
                        ),
                        cur.bgm !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "tokenmenu-item",
                            onClick: () => {
                              setTransMenu(false);
                              setMapBgm(activeMapId, "clear");
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "music_off", size: 16 }),
                              " BGM 번들 해제"
                            ]
                          }
                        )
                      ] });
                    })()
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "mbtn" + (slotMenu ? " on" : ""),
                        "data-sfx": "open",
                        title: "현재 맵 전체를 이름 붙여 저장·복원 (최대 3)",
                        onClick: () => setSlotMenu((v) => !v),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "save", size: 16 }),
                          " 저장 ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 16 })
                        ]
                      }
                    ),
                    slotMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setSlotMenu(false), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          disabled: saveSlots.length >= 3,
                          onClick: async () => {
                            setSlotMenu(false);
                            const name = await promptText({
                              title: "저장 슬롯 이름",
                              label: "현재 맵 전체를 이 이름으로 저장 (같은 이름은 덮어쓰기 · 최대 3)",
                              defaultValue: `저장 ${saveSlots.length + 1}`
                            });
                            if (name != null) saveSlot(name.trim() || void 0);
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "save", size: 16 }),
                            " 현재 맵 저장",
                            saveSlots.length >= 3 ? " (슬롯 꽉 참)" : ` (${saveSlots.length}/3)`
                          ]
                        }
                      ),
                      saveSlots.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                      saveSlots.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: 1 },
                            title: "이 슬롯으로 맵 복원 (전원 적용)",
                            onClick: async () => {
                              setSlotMenu(false);
                              if (await confirmDialog(
                                `‘${s.name}’ 슬롯을 불러올까요? 현재 맵·토큰이 교체됩니다.`
                              ))
                                loadSlot(s.id);
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restore", size: 16 }),
                              " ",
                              s.name
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: "0 0 auto" },
                            title: "슬롯 삭제",
                            onClick: () => deleteSlot(s.id),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 })
                          }
                        )
                      ] }, s.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-sep" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-tag muted small", children: "연출" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "mbtn" + (cardMenu ? " on" : ""),
                        "data-sfx": "open",
                        title: "이미지·음향 카드를 전원 화면에 재생합니다",
                        onClick: () => setCardMenu((v) => !v),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "movie", size: 16 }),
                          " 비주얼 카드 ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 16 })
                        ]
                      }
                    ),
                    cardMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setCardMenu(false), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          onClick: async () => {
                            setCardMenu(false);
                            const name = await promptText({
                              title: "비주얼 카드 (이미지)",
                              label: "카드 이름. 채팅에 이 이름이 들어가면 전원에게 재생됩니다(대성공·성공·실패 같은 판정 결과 이름도 됩니다)."
                            });
                            if (name?.trim()) {
                              setCardPending({ name: name.trim() });
                              cardImgInput.current?.click();
                            }
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 16 }),
                            " 이미지 카드 추가"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          onClick: async () => {
                            setCardMenu(false);
                            const name = await promptText({
                              title: "비주얼 카드 (음향만)",
                              label: "이미지 없이 음향만 재생하는 카드 이름"
                            });
                            if (name?.trim()) {
                              setCardPending({ name: name.trim() });
                              cardSndInput.current?.click();
                            }
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "music_note", size: 16 }),
                            " 음향만 카드 추가"
                          ]
                        }
                      ),
                      visualCards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                      visualCards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center" }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: 1 },
                            title: "지금 전원에게 재생",
                            onClick: () => {
                              playCard(c.id);
                              setCardMenu(false);
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "play_circle", size: 16 }),
                              " ",
                              c.name,
                              c.sound ? c.soundSec ? ` ♪ ${c.soundSec}초` : " ♪" : "",
                              c.displaySec ? ` · 표시 ${c.displaySec}초` : ""
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: "0 0 auto" },
                            title: "이 카드의 그림 지정/교체",
                            onClick: () => {
                              setCardPending({ card: c });
                              cardImgInput.current?.click();
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 15 })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: "0 0 auto" },
                            title: "이 카드에 음향 지정/교체",
                            onClick: () => {
                              setCardPending({ card: c });
                              cardSndInput.current?.click();
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "music_note", size: 15 })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item" + (c.for?.length ? " on" : ""),
                            style: { flex: "0 0 auto" },
                            title: c.for?.length ? `이 카드를 쓰는 화자 ${c.for.length}명 (클릭해 변경)` : "화자 지정 (특정 인물이 말할 때만 뜹니다)",
                            onClick: () => {
                              setCardMenu(false);
                              setCardSpeakerFor(c);
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "record_voice_over", size: 15 })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: "0 0 auto" },
                            title: "카드 이름 바꾸기",
                            onClick: async () => {
                              const name = await promptText({
                                title: "카드 이름",
                                label: "채팅에 이 이름이 들어가면 전원에게 재생됩니다(대성공·성공·실패 같은 판정 결과 이름도 됩니다).",
                                defaultValue: c.name
                              });
                              if (name?.trim()) setCard({ ...c, name: name.trim() });
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 15 })
                          }
                        ),
                        c.sound && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: "0 0 auto" },
                            title: c.soundSec ? `재생 길이 ${c.soundSec}초 (클릭해 변경)` : "재생 길이 설정 (기본: 음원 끝까지)",
                            onClick: async () => {
                              const v = await promptText({
                                title: "음향 재생 길이(초)",
                                label: "비우면 음원 끝까지 · 최대 600",
                                defaultValue: c.soundSec ? String(c.soundSec) : ""
                              });
                              if (v === null) return;
                              const n = Number(v.trim());
                              const soundSec = v.trim() && Number.isFinite(n) && n > 0 ? Math.min(Math.max(Math.round(n), 1), 600) : void 0;
                              setCard({ ...c, soundSec });
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "timer", size: 15 })
                          }
                        ),
                        c.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: "0 0 auto" },
                            title: c.displaySec ? `표시 시간 ${c.displaySec}초 (클릭해 변경)` : "표시 시간 설정 (기본: 클릭할 때까지 표시)",
                            onClick: async () => {
                              const v = await promptText({
                                title: "카드 표시 시간(초)",
                                label: "비우면 클릭할 때까지 · 최대 600",
                                defaultValue: c.displaySec ? String(c.displaySec) : ""
                              });
                              if (v === null) return;
                              const n = Number(v.trim());
                              const displaySec = v.trim() && Number.isFinite(n) && n > 0 ? Math.min(Math.max(Math.round(n), 1), 600) : void 0;
                              setCard({ ...c, displaySec });
                              if (displaySec) previewCard({ ...c, displaySec });
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "timelapse", size: 15 })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "tokenmenu-item",
                            style: { flex: "0 0 auto" },
                            title: "카드 삭제",
                            onClick: () => deleteCard(c.id),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 })
                          }
                        )
                      ] }, c.id))
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-sep" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-tag muted small", children: "무대" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "mbtn" + (bgMenu ? " on" : ""),
                        "data-sfx": "open",
                        onClick: () => setBgMenu((v) => !v),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "wallpaper", size: 16 }),
                          " 무대 ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 16 })
                        ]
                      }
                    ),
                    bgMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setBgMenu(false), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          onClick: () => {
                            setBgMenu(false);
                            bgUploadInput.current?.click();
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 16 }),
                            " 파일에서 업로드"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          onClick: () => {
                            setBgMenu(false);
                            setBgPicker(true);
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "photo_library", size: 16 }),
                            " 라이브러리에서 선택"
                          ]
                        }
                      ),
                      maps[activeMapId]?.background && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                        (() => {
                          const bg = maps[activeMapId]?.background;
                          if (!bg?.image || !bg.w || !bg.h) return null;
                          const fit = bg.fit ?? "fill";
                          const next = fit === "fill" ? "contain" : fit === "contain" ? "cover" : "fill";
                          const label = fit === "fill" ? "늘림" : fit === "contain" ? "비율유지" : "채우기";
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              className: "tokenmenu-item",
                              title: "누를 때마다 늘림 → 비율유지 → 채우기 (전원 공유)",
                              onClick: () => setMapBackground({ ...bg, fit: next === "fill" ? void 0 : next }),
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "aspect_ratio", size: 16 }),
                                " 이미지 맞춤: ",
                                label
                              ]
                            }
                          );
                        })(),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "tokenmenu-item",
                            onClick: () => {
                              setBgMenu(false);
                              setMapBackground(null);
                            },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "hide_image", size: 16 }),
                              " 무대 지우기"
                            ]
                          }
                        )
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tokenadd", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "mbtn" + (backdropMenu || mapBgColor || mapBackdrop?.image ? " on" : ""),
                        "data-sfx": "open",
                        title: "무대 뒤 화면 전체를 덮는 바탕 (색·이미지+블러)",
                        onClick: () => setBackdropMenu((v) => !v),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "blur_on", size: 16 }),
                          " 바탕 ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 16 })
                        ]
                      }
                    ),
                    backdropMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setBackdropMenu(false), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "label",
                        {
                          className: "tokenmenu-item",
                          title: "바탕색 (여백 전체 · 전원 공유)",
                          style: { position: "relative", cursor: "pointer" },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                style: {
                                  width: 15,
                                  height: 15,
                                  borderRadius: 4,
                                  background: mapBgColor || "transparent",
                                  border: "1px solid var(--line2)"
                                }
                              }
                            ),
                            "바탕색",
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "input",
                              {
                                type: "color",
                                value: mapBgColor || "#0a0e18",
                                onChange: (e) => setBgColor(e.target.value),
                                style: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }
                              }
                            )
                          ]
                        }
                      ),
                      mapBgColor && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "tokenmenu-item", onClick: () => setBgColor(void 0), children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_reset", size: 16 }),
                        " 바탕색 지우기 (투명)"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "button",
                        {
                          className: "tokenmenu-item",
                          onClick: () => {
                            setBackdropMenu(false);
                            backdropUploadInput.current?.click();
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 16 }),
                            " ",
                            mapBackdrop?.image ? "바탕 이미지 교체" : "바탕 이미지 업로드"
                          ]
                        }
                      ),
                      mapBackdrop?.image && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "label",
                          {
                            className: "tokenmenu-item",
                            title: "바탕 흐림 강도",
                            style: { cursor: "pointer" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "blur_linear", size: 16 }),
                              " 흐림",
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  type: "range",
                                  min: 0,
                                  max: 24,
                                  step: 1,
                                  value: mapBackdrop.blur ?? 0,
                                  onChange: (e) => setBackdrop({ image: mapBackdrop.image, blur: Number(e.target.value) }),
                                  style: { width: 80, marginLeft: 6 }
                                }
                              )
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "tokenmenu-item", onClick: () => setBackdrop(null), children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "hide_image", size: 16 }),
                          " 바탕 이미지 제거"
                        ] })
                      ] })
                    ] })
                  ] }),
                  (() => {
                    const bg = maps[activeMapId]?.background;
                    if (!bg?.w || !bg.h) return null;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "grid-ctl",
                        title: "무대(맵 영역) 크기를 키우거나 줄입니다 (전원 공유)",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid-size-tag muted small", children: "크기" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mbtn sq", onClick: () => scaleMapBackground(1 / 1.1), children: "−" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              className: "grid-size grid-size-input",
                              type: "number",
                              inputMode: "numeric",
                              value: bgSizeDraft ?? String(Math.round(bg.w)),
                              title: "무대 가로 크기(px). 입력 후 Enter",
                              onFocus: (e) => {
                                setBgSizeDraft(String(Math.round(bg.w)));
                                e.currentTarget.select();
                              },
                              onChange: (e) => setBgSizeDraft(e.target.value),
                              onBlur: () => {
                                if (sizeEscRef.current) {
                                  sizeEscRef.current = false;
                                  setBgSizeDraft(null);
                                  return;
                                }
                                if (bgSizeDraft != null && bgSizeDraft.trim() !== "") {
                                  const n = Number(bgSizeDraft);
                                  if (Number.isFinite(n)) setMapSizePx(n);
                                }
                                setBgSizeDraft(null);
                              },
                              onKeyDown: (e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                                else if (e.key === "Escape") {
                                  sizeEscRef.current = true;
                                  e.currentTarget.blur();
                                }
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid-size-unit", children: "px" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mbtn sq", onClick: () => scaleMapBackground(1.1), children: "+" }),
                          bg.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              className: "mbtn sq",
                              title: "무대 크기를 배경 이미지 원본 크기로 되돌리기",
                              onClick: () => void resetMapSizePx(),
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 14 })
                            }
                          )
                        ]
                      }
                    );
                  })(),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "grid-ctl",
                      title: "그리드 칸 크기 (토큰·스냅도 함께 조정 · 전원 공유)",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid-size-tag muted small", children: "칸" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "mbtn sq",
                            onClick: () => setGrid({ ...grid, size: clampCellPx(grid.size - GRID_CELL_STEP) }),
                            children: "−"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "grid-size grid-size-input",
                            type: "number",
                            inputMode: "numeric",
                            value: cellSizeDraft ?? String(grid.size),
                            title: "그리드 칸 크기(px). 입력 후 Enter",
                            onFocus: (e) => {
                              setCellSizeDraft(String(grid.size));
                              e.currentTarget.select();
                            },
                            onChange: (e) => setCellSizeDraft(e.target.value),
                            onBlur: () => {
                              if (sizeEscRef.current) {
                                sizeEscRef.current = false;
                                setCellSizeDraft(null);
                                return;
                              }
                              if (cellSizeDraft != null && cellSizeDraft.trim() !== "") {
                                const n = Number(cellSizeDraft);
                                if (Number.isFinite(n)) setGrid({ ...grid, size: clampCellPx(n) });
                              }
                              setCellSizeDraft(null);
                            },
                            onKeyDown: (e) => {
                              if (e.key === "Enter") e.currentTarget.blur();
                              else if (e.key === "Escape") {
                                sizeEscRef.current = true;
                                e.currentTarget.blur();
                              }
                            }
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid-size-unit", children: "px" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "mbtn sq",
                            onClick: () => setGrid({ ...grid, size: clampCellPx(grid.size + GRID_CELL_STEP) }),
                            children: "+"
                          }
                        ),
                        grid.size !== DEFAULT_GRID.size && /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "mbtn sq",
                            title: `칸 크기를 기본값(${DEFAULT_GRID.size}px)으로 되돌리기`,
                            onClick: () => {
                              setGrid({ ...grid, size: DEFAULT_GRID.size });
                              setCellSizeDraft(null);
                            },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 14 })
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-sep" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mbar-tag muted small", children: "보기" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "mbtn" + (grid.visible ? " on" : ""),
                      title: "그리드 선 표시/숨김 (전원 공유)",
                      onClick: () => setGrid({ ...grid, visible: !grid.visible }),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: grid.visible ? "grid_4x4" : "grid_off", size: 16 }),
                        " ",
                        grid.visible ? "그리드" : "그리드 숨김"
                      ]
                    }
                  ),
                  selectedTokenId && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mbtn danger", onClick: () => removeToken(selectedTokenId), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 16 }),
                    " 토큰 삭제"
                  ] })
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VNView, {})
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: tokenImgInput, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: onPickTokenImage }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: tokenSoundInput, type: "file", accept: "audio/*", hidden: true, onChange: onPickTokenSound }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: cardImgInput, type: "file", accept: "image/*", hidden: true, onChange: onPickCardImage }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: cardSndInput, type: "file", accept: "audio/*", hidden: true, onChange: onPickCardSound }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: bgUploadInput, type: "file", accept: "image/*", hidden: true, onChange: onUploadBackground }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: backdropUploadInput, type: "file", accept: "image/*", hidden: true, onChange: onUploadBackdrop }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: mapsetFileInput, type: "file", accept: ".zip,application/zip", hidden: true, onChange: onImportMapsetFile }),
      participants.length > 0 && !rosterHidden && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          ref: rosterRef,
          className: "roster-cards",
          "data-user-pos": rosterPos ? "1" : void 0,
          style: rosterPos ? { left: clampRosterPos(rosterPos).x, top: clampRosterPos(rosterPos).y, bottom: "auto" } : void 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "roster-drag",
                title: "드래그해서 접속자 카드 위치 옮기기 (VN 대사창과 겹치면 이동)",
                onPointerDown: (e) => {
                  const r = rosterRef.current?.getBoundingClientRect();
                  if (r) beginPanelDrag(e, { x: r.left, y: r.top }, (x, y) => setRosterPos({ x, y }));
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "drag_indicator", size: 14 })
              }
            ),
            participants.map((p) => {
              const ch = roster[p.playerId];
              const name = ch?.name || p.nick;
              const headshot = ch ? activeHeadshot(ch) : void 0;
              const gm = p.role === "GM";
              const isSelf = p.playerId === self?.playerId;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "roster-card" + (gm ? " gm" : "") + (p.connected ? "" : " off"),
                  title: `${name} · ${gm ? "게임 마스터" : "플레이어"}${p.nick !== name ? ` (${p.nick})` : ""}${p.connected ? "" : " · 접속 끊김"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "roster-card-av",
                        style: {
                          background: headshot ? `center/cover url(${headshot})` : p.color,
                          cursor: "pointer"
                        },
                        onClick: () => setProfileView(p.playerId),
                        title: "프로필 보기",
                        children: [
                          !headshot && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "roster-card-ph", children: name[0] ?? "?" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "roster-card-role", children: p.role })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "roster-card-name",
                        style: { color: ch?.nameColor || void 0, cursor: isSelf ? "pointer" : void 0 },
                        title: isSelf ? "클릭하면 내 이름색 변경" : void 0,
                        onClick: isSelf ? (e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          setNamePicker((cur) => cur ? null : { x: r.left, y: r.top });
                        } : void 0,
                        children: [
                          name,
                          isSelf && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: " (나)" })
                        ]
                      }
                    )
                  ]
                },
                p.playerId
              );
            })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Chat, {}),
      isMobileView && /* @__PURE__ */ jsxRuntimeExports.jsx(MobileRoomNav, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CutInOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(VisualCardOverlay, {}),
    cardSpeakerFor && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CardSpeakerPicker,
      {
        card: cardSpeakerFor,
        onClose: () => setCardSpeakerFor(null),
        onSave: (keys) => {
          const { for: _drop, ...rest } = cardSpeakerFor;
          setCard(keys.length ? { ...rest, for: keys } : rest);
          setCardSpeakerFor(null);
        }
      }
    ),
    namePicker && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { position: "fixed", inset: 0, zIndex: 6e3 }, onClick: () => setNamePicker(null) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            position: "fixed",
            left: Math.max(8, Math.min(namePicker.x, window.innerWidth - 248)),
            bottom: Math.max(8, window.innerHeight - namePicker.y + 8),
            zIndex: 6001,
            width: 240,
            background: "var(--bg2)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            padding: 12,
            boxShadow: "0 8px 28px rgba(0,0,0,0.45)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "muted small",
                style: { marginBottom: 8, display: "flex", alignItems: "center", gap: 6 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "palette", size: 13 }),
                  " 내 이름색"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 7, flexWrap: "wrap", alignItems: "center" }, children: [
              NAME_COLOR_PRESETS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  title: c,
                  onClick: () => setNameColor(c),
                  style: {
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: c,
                    cursor: "pointer",
                    border: (nameColor || "").toLowerCase() === c.toLowerCase() ? "2px solid var(--text)" : "1px solid var(--line2)"
                  }
                },
                c
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "iconbtn",
                  title: "직접 선택",
                  style: { width: 26, height: 26, position: "relative", overflow: "hidden" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "colorize", size: 15 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "color",
                        value: nameColor || "#9aa3b8",
                        onChange: (e) => setNameColor(e.target.value),
                        style: { position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }
                      }
                    )
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn sm",
                style: { marginTop: 10, width: "100%", justifyContent: "center" },
                onClick: () => setNameColor(""),
                children: "기본색으로"
              }
            )
          ]
        }
      )
    ] }),
    profileView && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileCard, { playerId: profileView, onClose: () => setProfileView(null) }, profileView),
    Object.keys(windows).filter((k) => k.startsWith("sheet:")).map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(SheetWindow, { winId: k, charId: k.slice(6) }, k)),
    windows.characters && /* @__PURE__ */ jsxRuntimeExports.jsx(CharacterHub, {}),
    windows.participants && /* @__PURE__ */ jsxRuntimeExports.jsx(ParticipantsPanel, {}),
    windows.sheetview && /* @__PURE__ */ jsxRuntimeExports.jsx(SheetViewer, {}),
    windows.handout && /* @__PURE__ */ jsxRuntimeExports.jsx(HandoutPanel, {}),
    windows.deck && /* @__PURE__ */ jsxRuntimeExports.jsx(DeckPanel, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HandoutPresentation, {}),
    windows.library && /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPanel, { onClose: () => closeWindow("library") }),
    windows.bgm && /* @__PURE__ */ jsxRuntimeExports.jsx(BgmPanel, { onClose: () => closeWindow("bgm") }),
    windows.choice && /* @__PURE__ */ jsxRuntimeExports.jsx(ChoicePanel, {}),
    windows.madness && /* @__PURE__ */ jsxRuntimeExports.jsx(MadnessEditor, {}),
    windows.layers && isGM && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LayerListPanel,
      {
        patchToken,
        onAddLayer: (target) => setImgPicker(target === "global" ? "global" : "bg")
      }
    ),
    windows.mapsets && isGM && /* @__PURE__ */ jsxRuntimeExports.jsx(MapsetPanel, { onImportFile: () => mapsetFileInput.current?.click() }),
    bgPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPanel, { pickMode: true, onPick: onPickBackground, onClose: () => setBgPicker(false) }),
    vnBgPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPanel, { pickMode: true, onPick: onPickVnBackground, onClose: () => setVnBgPicker(false) }),
    vnLayerPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPanel, { pickMode: true, onPick: onAddVnLayer, onClose: () => setVnLayerPicker(false) }),
    imgPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPanel, { pickMode: true, onPick: onPlaceImage, onClose: () => setImgPicker(null) }),
    vnMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "menu-veil",
          onClick: () => setVnMenu(null),
          onContextMenu: (e) => {
            e.preventDefault();
            setVnMenu(null);
          }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ClampedMenu, { x: vnMenu.x, y: vnMenu.y, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-menu-h", children: [
          "미연시 배경 · ",
          maps[activeMapId]?.name ?? "장면"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "scene-item",
            onClick: () => {
              setVnBgPicker(true);
              setVnMenu(null);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "wallpaper", size: 15 }),
              " 배경 사진 변경"
            ]
          }
        ),
        activeVnBg && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "scene-item", title: "배경 흐림 강도 (전원 공유 · 놓을 때 적용)", style: { cursor: "pointer" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "blur_linear", size: 15 }),
            " 흐림",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 24,
                step: 1,
                value: activeVnBlur ?? 0,
                onChange: (e) => useMapStore.getState().setVnBgBlurLocal(activeMapId, Number(e.target.value)),
                onPointerUp: (e) => setVnBgBlur(Number(e.target.value)),
                onKeyUp: (e) => setVnBgBlur(Number(e.target.value)),
                style: { flex: 1, minWidth: 70, marginLeft: 6 }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "scene-item",
              onClick: () => {
                setVnBackground(void 0);
                setVnMenu(null);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "hide_image", size: 15 }),
                " 배경 제거"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "레이어 (위 = 앞)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "scene-item",
            onClick: () => {
              setVnLayerPicker(true);
              setVnMenu(null);
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 15 }),
              " 레이어 추가"
            ]
          }
        ),
        vnLayersSorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: "2px 12px 6px" }, children: "레이어 없음" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              maxHeight: 220,
              overflowY: "auto",
              padding: "2px 8px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 6
            },
            children: vnLayersSorted.slice().reverse().map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      width: 30,
                      height: 40,
                      flex: "0 0 auto",
                      borderRadius: 4,
                      border: "1px solid var(--line2)",
                      background: `center/contain no-repeat #0a0e18 url(${l.image})`
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 0,
                    max: 100,
                    value: Math.round((l.opacity ?? 1) * 100),
                    title: "투명도",
                    onChange: (e) => setVnLayerOpacity(l.id, Number(e.target.value) / 100),
                    style: { flex: 1, minWidth: 56 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "mbtn sq" + (l.fit !== "contain" ? " on" : ""),
                    title: l.fit === "contain" ? "맞춤(여백). 누르면 꽉 채움" : "꽉 채움(배경처럼). 누르면 비율 맞춤",
                    onClick: () => toggleVnLayerFit(l.id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: l.fit === "contain" ? "crop_free" : "fit_screen", size: 14 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "mbtn sq" + (l.front ? " on" : ""),
                    title: l.front ? "스탠딩 앞(오버레이). 누르면 뒤로" : "스탠딩 뒤. 누르면 앞(오버레이)",
                    onClick: () => toggleVnLayerFront(l.id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "flip_to_front", size: 14 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mbtn sq", title: "앞으로", onClick: () => moveVnLayer(l.id, 1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_upward", size: 14 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mbtn sq", title: "뒤로", onClick: () => moveVnLayer(l.id, -1), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_downward", size: 14 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mbtn sq", title: "레이어 삭제", onClick: () => removeVnLayer(l.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 5, paddingLeft: 36 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_with", size: 13, className: "muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: -100,
                    max: 100,
                    step: 1,
                    value: l.x ?? 0,
                    title: `가로 이동 ${l.x ?? 0}% (놓을 때 적용)`,
                    onChange: (e) => previewVnLayerTransform(l.id, { x: Number(e.target.value) }),
                    onPointerUp: commitVnLayerTransforms,
                    onKeyUp: commitVnLayerTransforms,
                    style: { flex: 1, minWidth: 44 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: -100,
                    max: 100,
                    step: 1,
                    value: l.y ?? 0,
                    title: `세로 이동 ${l.y ?? 0}% (놓을 때 적용)`,
                    onChange: (e) => previewVnLayerTransform(l.id, { y: Number(e.target.value) }),
                    onPointerUp: commitVnLayerTransforms,
                    onKeyUp: commitVnLayerTransforms,
                    style: { flex: 1, minWidth: 44 }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "zoom_out_map", size: 13, className: "muted" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "range",
                    min: 20,
                    max: 300,
                    step: 5,
                    value: l.scale ?? 100,
                    title: `크기 ${l.scale ?? 100}% (놓을 때 적용)`,
                    onChange: (e) => previewVnLayerTransform(l.id, { scale: Number(e.target.value) }),
                    onPointerUp: commitVnLayerTransforms,
                    onKeyUp: commitVnLayerTransforms,
                    style: { flex: 1, minWidth: 44 }
                  }
                ),
                l.x || l.y || l.scale && l.scale !== 100 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "mbtn sq",
                    title: "이동·크기 초기화",
                    onClick: () => resetVnLayerTransform(l.id),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 13 })
                  }
                ) : null
              ] })
            ] }, l.id))
          }
        )
      ] })
    ] }),
    mapCtx && (isGM || plCanAdd) && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "menu-veil",
          onPointerDown: () => setMapCtx(null),
          onContextMenu: (e) => e.preventDefault()
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(ClampedMenu, { x: mapCtx.x, y: mapCtx.y, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-menu-h", children: [
          "맵 · ",
          maps[activeMapId]?.name ?? ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "scene-item",
            onClick: () => {
              setMapCtx(null);
              setTokenImgTarget({ mode: "new" });
              tokenImgInput.current?.click();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_circle", size: 15 }),
              " 이미지로 토큰 추가"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "scene-item",
            title: "이 맵에만 두는 레이어 (맵세트를 바꾸면 바뀜)",
            onClick: () => {
              setMapCtx(null);
              setImgPicker("bg");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 15 }),
              " 단독 레이어 이미지(이 맵)"
            ]
          }
        ),
        isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "scene-item",
            title: "모든 맵세트에 남는 레이어",
            onClick: () => {
              setMapCtx(null);
              setImgPicker("global");
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "public", size: 15 }),
              " 통합 레이어 이미지(모든 맵)"
            ]
          }
        ),
        clipboard && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "scene-item",
            onClick: () => {
              setMapCtx(null);
              pasteToken();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "content_paste", size: 15 }),
              " 붙여넣기"
            ]
          }
        ),
        isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "scene-item",
              onClick: () => {
                setMapCtx(null);
                bgUploadInput.current?.click();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "wallpaper", size: 15 }),
                " 무대 이미지 업로드"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "scene-item",
              onClick: () => {
                setMapCtx(null);
                setBgPicker(true);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "photo_library", size: 15 }),
                " 무대 이미지 (라이브러리)"
              ]
            }
          ),
          maps[activeMapId]?.background && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "scene-item",
              onClick: () => {
                setMapCtx(null);
                setMapBackground(null);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "hide_image", size: 15 }),
                " 무대 지우기"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "scene-item",
              onClick: () => {
                setMapCtx(null);
                backdropUploadInput.current?.click();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "blur_on", size: 15 }),
                " 바탕 이미지 업로드"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "scene-item",
              onClick: () => {
                setMapCtx(null);
                openWindow("layers");
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 15 }),
                " 레이어 목록"
              ]
            }
          )
        ] })
      ] })
    ] }),
    resizingId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "resize-done-bar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_full", size: 13 }),
        " 토큰을 드래그해 크기를 조절하세요"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm pri", onClick: () => setResizing(null), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 15 }),
        " 완료"
      ] })
    ] }),
    tokenCtx && (() => {
      const t0 = globalTokens.find((x) => x.id === tokenCtx.id) ?? maps[activeMapId]?.tokens.find((x) => x.id === tokenCtx.id);
      const cardImgs = t0?.images ?? [];
      const canSwitch = !!t0 && cardImgs.length > 1 && canControlToken(t0, self);
      if (!isGM && !canSwitch) return null;
      const curIdx = t0?.currentIndex ?? 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "menu-veil",
            onPointerDown: () => setTokenCtx(null),
            onContextMenu: (e) => e.preventDefault()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(ClampedMenu, { x: tokenCtx.x, y: tokenCtx.y, children: [
          canSwitch && t0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-menu-h", children: [
              "이미지 카드 전환",
              isGM ? " · 순서 · 제거" : ""
            ] }),
            cardImgs.map((_img, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "stretch", gap: 2 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (i === curIdx ? " on" : ""),
                  style: { flex: 1, minWidth: 0 },
                  onClick: () => {
                    useMapStore.getState().switchCardImage(t0.id, i);
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: i === curIdx ? "check" : "image", size: 15 }),
                    " 이미지 ",
                    i + 1,
                    i === curIdx ? " (현재)" : ""
                  ]
                }
              ),
              isGM && cardImgs.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "scene-item",
                    style: { flex: "0 0 auto", width: "auto", paddingInline: 8 },
                    title: `이미지 ${i + 1} 을(를) 앞으로`,
                    disabled: i === 0,
                    onClick: () => moveCardImage(t0, i, -1),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_upward", size: 14 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "scene-item",
                    style: { flex: "0 0 auto", width: "auto", paddingInline: 8 },
                    title: `이미지 ${i + 1} 을(를) 뒤로`,
                    disabled: i === cardImgs.length - 1,
                    onClick: () => moveCardImage(t0, i, 1),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_downward", size: 14 })
                  }
                )
              ] }),
              isGM && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "scene-item danger",
                  style: { flex: "0 0 auto", width: "auto", paddingInline: 10 },
                  title: `이미지 ${i + 1} 제거`,
                  onClick: () => {
                    removeCardImage(t0, i);
                    setTokenCtx(null);
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 })
                }
              )
            ] }, i)),
            isGM && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" })
          ] }),
          isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            maps[activeMapId]?.tokens.find((x) => x.id === tokenCtx.id)?.rotation ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  useMapStore.getState().rotate(tokenCtx.id, 0);
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 15 }),
                  " 회전 초기화"
                ]
              }
            ) : null,
            (() => {
              const bg = maps[activeMapId]?.background;
              const cell = maps[activeMapId]?.grid?.size || 0;
              if (!bg?.w || !bg?.h || !cell) return null;
              const cw = bg.w / cell;
              const ch = bg.h / cell;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item",
                  title: `무대 전체(${Math.round(cw * 100) / 100}×${Math.round(ch * 100) / 100}칸)를 덮도록 위치와 크기를 맞춥니다`,
                  onClick: () => {
                    placeToken({
                      id: tokenCtx.id,
                      x: bg.w / 2,
                      y: bg.h / 2,
                      size: Math.max(cw, ch),
                      w: cw,
                      h: ch
                    });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "fit_screen", size: 15 }),
                    " 무대에 맞추기"
                  ]
                }
              );
            })(),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  setTokenImgTarget({ mode: "replace", id: tokenCtx.id });
                  setTokenCtx(null);
                  tokenImgInput.current?.click();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 15 }),
                  " 이미지 변경"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                title: "여러 장 한 번에 추가 (우클릭으로 전환)",
                onClick: () => {
                  setTokenImgTarget({ mode: "addimage", id: tokenCtx.id });
                  setTokenCtx(null);
                  tokenImgInput.current?.click();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 15 }),
                  " 이미지 추가 (카드)",
                  (() => {
                    const t = maps[activeMapId]?.tokens.find((x) => x.id === tokenCtx.id);
                    const n = t?.images?.length ?? 0;
                    return n > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted", style: { fontSize: 10, marginLeft: 4 }, children: [
                      "· ",
                      n,
                      "장"
                    ] }) : null;
                  })()
                ]
              }
            ),
            (maps[activeMapId]?.tokens.find((x) => x.id === tokenCtx.id)?.images?.length ?? 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  const tk = maps[activeMapId]?.tokens.find((x) => x.id === tokenCtx.id);
                  if (tk)
                    placeToken({
                      id: tk.id,
                      x: tk.x,
                      y: tk.y,
                      size: tk.size,
                      charPlayerId: tk.charPlayerId,
                      label: tk.label,
                      color: tk.color,
                      layer: tk.layer,
                      image: tk.image ?? tk.images?.[0],
                      flipX: tk.flipX,
                      hideName: tk.hideName,
                      hideUI: tk.hideUI,
                      allowedPlayers: tk.allowedPlayers,
                      images: [],
                      currentIndex: 0
                    });
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "hide_image", size: 15 }),
                  " 카드 해제 (단일 이미지로)"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  setResizing(tokenCtx.id);
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_full", size: 15 }),
                  " 크기 조절 (드래그)"
                ]
              }
            ),
            t0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "잠금" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.lockPos ? " on" : ""),
                  title: "켜면 드래그로 이동 불가(크기 고정과 함께=배치 고정)",
                  onClick: () => {
                    patchToken(t0.id, { lockPos: !t0.lockPos });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t0.lockPos ? "lock" : "lock_open", size: 15 }),
                    " 위치 고정",
                    t0.lockPos ? " (켜짐)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.lockSize ? " on" : ""),
                  title: "켜면 크기 조정 불가",
                  onClick: () => {
                    patchToken(t0.id, { lockSize: !t0.lockSize });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "aspect_ratio", size: 15 }),
                    " 크기 고정",
                    t0.lockSize ? " (켜짐)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.terrain ? " on" : ""),
                  title: "켜면 클릭이 통과되어 실수로 선택/이동되지 않음(맵 바닥·배경 조각용)",
                  onClick: () => {
                    patchToken(t0.id, { terrain: !t0.terrain });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "foundation", size: 15 }),
                    " 클릭 통과",
                    t0.terrain ? " (켜짐)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (globalTokens.some((t) => t.id === t0.id) ? " on" : ""),
                  title: "켜면 이 토큰이 모든 맵세트에 남습니다",
                  onClick: () => {
                    toLayer(t0.id, !globalTokens.some((t) => t.id === t0.id));
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "layers", size: 15 }),
                    " 통합 레이어(모든 맵)",
                    globalTokens.some((t) => t.id === t0.id) ? " (켜짐)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "공개범위 (GM)" }),
              [
                ["all", "전체 공개", "visibility"],
                ["owner", "나만 (소유자+GM)", "visibility"],
                ["private", "비공개 (GM만)", "visibility_off"],
                ["others", "나 외 공개", "visibility"]
              ].map(([v, label, icon]) => {
                const cur = t0.visibility ?? (t0.hidden ? "private" : "all");
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "scene-item" + (cur === v ? " on" : ""),
                    title: v === "all" ? "전원에게 보임(기본)" : v === "owner" ? "소유자(캐릭터 주인)와 GM 만 봄" : v === "private" ? "GM만 봄(미리보기). PL 에겐 미전송" : "소유자만 못 봄, 나머지·GM 은 봄",
                    onClick: () => {
                      patchToken(t0.id, { visibility: v });
                      setTokenCtx(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: icon, size: 15 }),
                      " ",
                      label,
                      cur === v ? " ✓" : ""
                    ]
                  },
                  v
                );
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.backImage ? " on" : ""),
                  title: "앞면을 못 보는 사람에게 대신 보일 뒷면 이미지",
                  onClick: () => {
                    setTokenImgTarget({ mode: "backimage", id: t0.id });
                    tokenImgInput.current?.click();
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 15 }),
                    " 양면 이미지",
                    t0.backImage ? " (설정됨)" : ""
                  ]
                }
              ),
              t0.backImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item",
                  title: "양면 이미지 해제",
                  onClick: () => {
                    patchToken(t0.id, { backImage: "" });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 15 }),
                    " 양면 해제"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "scene-menu-h", children: [
                "상태바 (",
                t0.bars?.length ?? 0,
                "/8)"
              ] }),
              (t0.bars ?? []).map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                BarRow,
                {
                  bar: b,
                  linkable: !!t0.charPlayerId,
                  onPatch: (patch) => updateBar(t0, b.id, patch),
                  onRemove: () => removeBar(t0, b.id)
                },
                b.id
              )),
              (t0.bars?.length ?? 0) < 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "scene-item", onClick: () => addBar(t0), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 15 }),
                " 상태바 추가"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.statsPrivate ? " on" : ""),
                  title: "상태바·수치를 소유자·GM만 봄",
                  onClick: () => {
                    patchToken(t0.id, { statsPrivate: !t0.statsPrivate });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t0.statsPrivate ? "lock" : "lock_open", size: 15 }),
                    " 상태 비공개",
                    t0.statsPrivate ? " (켜짐)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.hideName ? " on" : ""),
                  title: "이름(닉네임) 라벨 숨김(전원)",
                  onClick: () => {
                    patchToken(t0.id, { hideName: !t0.hideName });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t0.hideName ? "visibility_off" : "visibility", size: 15 }),
                    " 이름 숨기기",
                    t0.hideName ? " (켜짐)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.hideUI ? " on" : ""),
                  title: "시트 체력·마력·정신력·마커를 전원에게 숨김",
                  onClick: () => {
                    patchToken(t0.id, { hideUI: !t0.hideUI });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t0.hideUI ? "visibility_off" : "visibility", size: 15 }),
                    " 시트 체력·상태 숨기기",
                    t0.hideUI ? " (켜짐)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "동작" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.flipX ? " on" : ""),
                  title: "좌우 반전",
                  onClick: () => {
                    patchToken(t0.id, { flipX: !t0.flipX });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "flip", size: 15 }),
                    " 좌우 반전",
                    t0.flipX ? " (켜짐)" : ""
                  ]
                }
              ),
              t0.w && t0.h ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item",
                  title: "늘림 비율을 지우고 원본 비율로",
                  onClick: () => {
                    patchToken(t0.id, { w: 0, h: 0 });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "crop_free", size: 15 }),
                    " 늘림 비율 해제 (",
                    t0.w,
                    "×",
                    t0.h,
                    "칸)"
                  ]
                }
              ) : null,
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.memo ? " on" : ""),
                  onClick: async () => {
                    const id = t0.id;
                    const v = await promptText({
                      title: "호버 메모",
                      label: "커서를 올리면 뜨는 설명(비우면 제거)",
                      defaultValue: t0.memo ?? "",
                      multiline: true
                    });
                    setTokenCtx(null);
                    if (v !== null) patchToken(id, { memo: v.trim() });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "sticky_note_2", size: 15 }),
                    " 메모",
                    t0.memo ? " ·" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item" + (t0.clickAction ? " on" : ""),
                  onClick: async () => {
                    const id = t0.id;
                    const v = await promptText({
                      title: "클릭 동작",
                      label: "클릭 시 채팅으로 보낼 내용(주사위 명령 가능 · 비우면 제거)",
                      defaultValue: t0.clickAction ?? ""
                    });
                    setTokenCtx(null);
                    if (v !== null) patchToken(id, { clickAction: v.trim() });
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "ads_click", size: 15 }),
                    " 클릭 동작",
                    t0.clickAction ? " ·" : ""
                  ]
                }
              ),
              visualCards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center", padding: "2px 10px 4px" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "movie", size: 15 }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    value: t0.clickCardId ?? "",
                    style: { flex: 1, minWidth: 0 },
                    title: "클릭하면 이 비주얼 카드를 전원 화면에 재생합니다(채팅 로그 없음 · 참가자도 클릭 가능)",
                    onChange: (e) => {
                      patchToken(t0.id, { clickCardId: e.target.value });
                      setTokenCtx(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "클릭 연출 카드 없음" }),
                      visualCards.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.name }, c.id))
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "버튼 토큰 (hover·클릭)" }),
              (t0.image || (t0.images?.length ?? 0) > 0) && !t0.liveStanding && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "scene-item" + (t0.hoverImage ? " on" : ""),
                    title: "마우스를 올리면 바뀔 이미지2 (정지 이미지 권장)",
                    onClick: () => {
                      setTokenImgTarget({ mode: "hoverimage", id: t0.id });
                      tokenImgInput.current?.click();
                      setTokenCtx(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 15 }),
                      " 이미지2 (hover)",
                      t0.hoverImage ? " ·설정됨" : ""
                    ]
                  }
                ),
                t0.hoverImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "scene-item",
                    title: "이미지2(hover) 해제",
                    onClick: () => {
                      patchToken(t0.id, { hoverImage: "" });
                      setTokenCtx(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 15 }),
                      " 이미지2 해제"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "scene-item" + (t0.pressImage ? " on" : ""),
                    title: "클릭하면 바뀔 이미지3 (정지 이미지 권장)",
                    onClick: () => {
                      setTokenImgTarget({ mode: "pressimage", id: t0.id });
                      tokenImgInput.current?.click();
                      setTokenCtx(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 15 }),
                      " 이미지3 (클릭)",
                      t0.pressImage ? " ·설정됨" : ""
                    ]
                  }
                ),
                t0.pressImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "scene-item",
                    title: "이미지3(클릭) 해제",
                    onClick: () => {
                      patchToken(t0.id, { pressImage: "" });
                      setTokenCtx(null);
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 15 }),
                      " 이미지3 해제"
                    ]
                  }
                )
              ] }),
              [
                ["hover", "hover 진입"],
                ["press", "클릭"],
                ["base", "기본 복귀"]
              ].map(([slot, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: { display: "flex", gap: 4, alignItems: "center", padding: "0 10px" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        className: "scene-item" + (t0.sounds?.[slot] ? " on" : ""),
                        style: { flex: 1 },
                        title: `${label} 시 재생할 효과음(8MB 이하)`,
                        onClick: () => {
                          setTokenSoundTarget({ id: t0.id, slot });
                          tokenSoundInput.current?.click();
                          setTokenCtx(null);
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "volume_up", size: 15 }),
                          " 효과음 · ",
                          label,
                          t0.sounds?.[slot] ? " ·설정됨" : ""
                        ]
                      }
                    ),
                    t0.sounds?.[slot] && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        title: "효과음 해제",
                        style: { padding: "0 6px" },
                        onClick: () => clearTokenSound(t0, slot),
                        children: "×"
                      }
                    )
                  ]
                },
                slot
              ))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  copyToken(tokenCtx.id);
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "content_copy", size: 15 }),
                  " 복사"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item danger",
                onClick: () => {
                  removeToken(tokenCtx.id);
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }),
                  " 삭제"
                ]
              }
            ),
            (() => {
              const t = maps[activeMapId]?.tokens.find((x) => x.id === tokenCtx.id);
              if (!t) return null;
              const allowed = t.allowedPlayers ?? [];
              const grantTargets = participants.filter(
                (p) => p.playerId !== self?.playerId && p.role !== "GM"
              );
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "이동·회전 권한" }),
                grantTargets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", style: { fontWeight: 400, opacity: 0.7 }, children: "다른 플레이어 없음" }) : grantTargets.map((p) => {
                  const on = allowed.includes(p.playerId);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "scene-item",
                      title: (on ? "권한 회수" : "이동·회전 권한 부여") + (p.connected ? "" : " · 접속 끊김(재접속 시 적용)"),
                      onClick: () => {
                        const cur = t.allowedPlayers ?? [];
                        const next = cur.includes(p.playerId) ? cur.filter((x) => x !== p.playerId) : [...cur, p.playerId];
                        placeToken({
                          id: t.id,
                          x: t.x,
                          y: t.y,
                          size: t.size,
                          rotation: t.rotation,
                          charPlayerId: t.charPlayerId,
                          label: t.label,
                          color: t.color,
                          layer: t.layer,
                          image: t.image,
                          flipX: t.flipX,
                          hideName: t.hideName,
                          hideUI: t.hideUI,
                          allowedPlayers: next
                        });
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: on ? "check_box" : "check_box_outline_blank", size: 15 }),
                        " ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { opacity: p.connected ? 1 : 0.6 }, children: roster[p.playerId]?.name || p.nick }),
                        !p.connected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", style: { fontSize: 10, marginLeft: 4 }, children: "· 오프라인" })
                      ]
                    },
                    p.playerId
                  );
                })
              ] });
            })(),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "정렬 · z순서" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  reorderToken(tokenCtx.id, { op: "front" });
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "flip_to_front", size: 15 }),
                  " 맨 앞으로"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  reorderToken(tokenCtx.id, { op: "forward" });
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_upward", size: 15 }),
                  " 앞으로"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  reorderToken(tokenCtx.id, { op: "backward" });
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_downward", size: 15 }),
                  " 뒤로"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "scene-item",
                onClick: () => {
                  reorderToken(tokenCtx.id, { op: "back" });
                  setTokenCtx(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "flip_to_back", size: 15 }),
                  " 맨 뒤로"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
            (() => {
              const behind = (t0?.layer ?? "token") === "behind";
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "scene-item",
                  onClick: () => {
                    reorderToken(tokenCtx.id, { layer: behind ? "bg" : "behind" });
                    setTokenCtx(null);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: behind ? "flip_to_front" : "flip_to_back", size: 15 }),
                    " ",
                    behind ? "무대 앞으로 내보내기" : "무대 뒤로 보내기"
                  ]
                }
              );
            })(),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-sep" }),
            (() => {
              const t = maps[activeMapId]?.tokens.find((x) => x.id === tokenCtx.id);
              if (!t) return null;
              const setSize = (mult) => {
                const ns = Math.max(0.25, Math.min(MAX_TOKEN_CELLS, Math.round(t.size * mult * 100) / 100));
                placeToken({
                  id: t.id,
                  x: t.x,
                  y: t.y,
                  size: ns,
                  rotation: t.rotation,
                  charPlayerId: t.charPlayerId,
                  label: t.label,
                  color: t.color,
                  layer: t.layer,
                  image: t.image
                });
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scene-menu-h", children: "크기 (GM)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: { display: "flex", alignItems: "center", gap: 8, padding: "2px 12px 6px" },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mbtn sq", title: "작게", onClick: () => setSize(0.8), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "remove", size: 15 }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { minWidth: 46, textAlign: "center" }, children: [
                        t.size.toFixed(2),
                        "칸"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mbtn sq", title: "크게", onClick: () => setSize(1.25), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 15 }) })
                    ]
                  }
                )
              ] });
            })()
          ] })
        ] })
      ] });
    })()
  ] });
}
export {
  Room as default
};
