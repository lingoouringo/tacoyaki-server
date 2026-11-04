import { Y as replaceAllTracks, Z as replaceAllPortraits, $ as replaceAllLobbyMedia, b as useLobbyStore, a0 as getAllTracks, a1 as getAllPortraits, a2 as getAllLobbyImages, a3 as getAllLobbyTracks, a4 as getAllLobbyLogs, a5 as strToU8, a6 as zipSync, a7 as unzipSync, a8 as strFromU8, N as getServerUrl, O as getAuthToken, a9 as isRollableDice, aa as useAdminStore, c as useCommunityStore, r as reactExports, j as jsxRuntimeExports, I as Icon, R as HintTip, U as alertDialog, s as confirmDialog, S as promptText, ab as cmty, d as useUIStore, o as useIsMobile, G as useNetStore, u as useAuthStore, ac as useRulesetStore, ad as allRulesets, ae as extSupported, af as useExpansionIssues, ag as FONT_STACKS, ah as SFX_LIST, A as playSfx, ai as DEFAULT_CARD_PROFILE, aj as isElectron, ak as unavailableNote, al as fetchLobbyStamp, am as extApi, an as pullLobbyFromServer, ao as lobbyImagesMissing, ap as useLobbyMusicStore, aq as publishLobby, ar as lobbyImageRefCount, as as buildLobbySnapshot, at as musicForPublish, au as publishLobbyMusic, av as clearLobbyMusicShort, aw as markLobbyMusicSeen, ax as writePublishedMusicSig, ay as markLobbyServerSeen, az as pullLobbyMusicFromServer, aA as useMapStore, aB as useBgmStore, aC as useHandoutStore, aD as withBusy, aE as hydrateAssetsDeep, aF as uploadAssetsDeep, aG as installFromBytes, aH as loadExpansion, aI as unloadExpansion, aJ as deleteExpansion, aK as registerLoadedExpansion } from "./index-DLwZOjxA-s2.js";
import { d as downloadJson, r as readJsonFile, b as buildRoomFile, p as parseRoomFile, a as downloadBlob } from "./roomFile-DlI8vkns.js";
import { r as replaceAllAssets, g as getAllAssets, a as getAllFolders, b as LibraryPanelBody } from "./LibraryPanel-B-GUUgdq-s2.js";
import "./image-CJqz1FOB.js";
import "./FloatingWindow-CgcsEYUd-s2.js";
const AUTH_TOKEN_KEY = "orpg-auth-token";
const LOCAL_PREFIX = "orpg-";
const DEVICE_KEYS = /* @__PURE__ */ new Set(["orpg-player-id", "orpg-server-url", "orpg-lobby-swap"]);
function isExportableKey(k) {
  return !!k && k.startsWith(LOCAL_PREFIX) && k !== AUTH_TOKEN_KEY && !DEVICE_KEYS.has(k);
}
async function buildSettingsFile() {
  if (useLobbyStore.getState().switching) throw new Error("계정 전환 처리 중입니다. 잠시 후 다시 시도해 주세요.");
  const local = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!isExportableKey(k)) continue;
    const v = localStorage.getItem(k);
    if (v != null) local[k] = v;
  }
  if (typeof local["orpg-lobby"] === "string") {
    try {
      const parsed = JSON.parse(local["orpg-lobby"]);
      if (parsed && typeof parsed === "object" && parsed.state && typeof parsed.state === "object") {
        delete parsed.state.ownerId;
        delete parsed.state.recentVisits;
        local["orpg-lobby"] = JSON.stringify(parsed);
      }
    } catch {
    }
  }
  const [bgm, assets, folders, portraits, lobbyImages, lobbyTracks, lobbyLogs] = await Promise.all([
    getAllTracks(),
    getAllAssets(),
    getAllFolders(),
    getAllPortraits(),
    getAllLobbyImages(),
    getAllLobbyTracks(),
    getAllLobbyLogs()
  ]);
  return {
    type: "tacoyaki-settings",
    version: 1,
    exportedAt: Date.now(),
    local,
    idb: { bgm, assets, folders, portraits, lobbyImages, lobbyTracks, lobbyLogs }
  };
}
function parseSettingsFile(raw) {
  if (!raw || typeof raw !== "object") return { ok: false, error: "파일을 읽을 수 없습니다." };
  const o = raw;
  if (o.type !== "tacoyaki-settings") return { ok: false, error: "타코야키 박스 설정 파일이 아닙니다." };
  if (o.version !== 1) return { ok: false, error: "지원하지 않는 설정 파일 버전입니다." };
  if (!o.local || typeof o.local !== "object") return { ok: false, error: "설정 데이터가 손상되었습니다." };
  return { ok: true, data: raw };
}
async function applySettingsFile(data) {
  const idb = data.idb ?? {};
  await Promise.all([
    replaceAllTracks(idb.bgm ?? []),
    replaceAllAssets(idb.assets ?? [], idb.folders ?? []),
    replaceAllPortraits(idb.portraits ?? []),
    replaceAllLobbyMedia(idb.lobbyImages ?? [], idb.lobbyTracks ?? [], idb.lobbyLogs ?? [])
  ]);
  const remove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (isExportableKey(k)) remove.push(k);
  }
  for (const k of remove) localStorage.removeItem(k);
  for (const [k, v] of Object.entries(data.local)) {
    if (isExportableKey(k) && typeof v === "string") localStorage.setItem(k, v);
  }
}
async function buildMemberFile() {
  const settings = await buildSettingsFile();
  let server = null;
  try {
    const res = await fetch(getServerUrl() + "/me/export", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: getAuthToken() })
    });
    if (res.ok) {
      const s = await res.json();
      const hasData = Array.isArray(s?.blog?.posts) && s.blog.posts.length > 0 || Array.isArray(s?.sessionlogs?.logs) && s.sessionlogs.logs.length > 0 || Array.isArray(s?.rooms) && s.rooms.length > 0;
      server = hasData ? s : null;
    }
  } catch {
  }
  return { type: "tacoyaki-member-full", version: 1, exportedAt: Date.now(), settings, server };
}
const ZIP_MEMBER_TYPE = "tacoyaki-member-zip";
const TEXT_INLINE_MAX = 64 * 1024;
function bytesToB64(bytes) {
  let bin = "";
  const CH = 32768;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode(...bytes.subarray(i, i + CH));
  return btoa(bin);
}
function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function parseDataUrl(s) {
  if (!s.startsWith("data:")) return null;
  const comma = s.indexOf(",");
  if (comma < 0) return null;
  const meta = s.slice(5, comma);
  if (!/;base64$/i.test(meta)) return null;
  return { mt: meta.slice(0, meta.length - 7), b64: s.slice(comma + 1) };
}
async function sha256hex(bytes) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("보안 연결(https)에서만 쓸 수 있어요.");
  }
  const d = await crypto.subtle.digest("SHA-256", bytes);
  const a = new Uint8Array(d);
  let s = "";
  for (let i = 0; i < a.length; i++) s += a[i].toString(16).padStart(2, "0");
  return s;
}
async function stash(bytes, k, pool, mt) {
  const hash = await sha256hex(bytes);
  if (!pool.has(hash)) pool.set(hash, bytes);
  return mt !== void 0 ? { $blob: hash, k, mt } : { $blob: hash, k };
}
async function externalize(value, pool) {
  if (typeof value === "string") {
    if (value.length > 1024) {
      const du = parseDataUrl(value);
      if (du) return stash(b64ToBytes(du.b64), "d", pool, du.mt);
    }
    if (value.length > TEXT_INLINE_MAX) return stash(strToU8(value), "t", pool);
    return value;
  }
  if (Array.isArray(value)) {
    const out = [];
    for (const x of value) out.push(await externalize(x, pool));
    return out;
  }
  if (value && typeof value === "object") {
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = await externalize(v, pool);
    return out;
  }
  return value;
}
function internalize(value, pool) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const ref = value;
    if (typeof ref.$blob === "string") {
      const bytes = pool.get(ref.$blob);
      if (!bytes) return "";
      if (ref.k === "t") return strFromU8(bytes);
      if (ref.k === "b") return bytesToB64(bytes);
      return `data:${typeof ref.mt === "string" ? ref.mt : ""};base64,${bytesToB64(bytes)}`;
    }
    const out = {};
    for (const [k, v] of Object.entries(ref)) out[k] = internalize(v, pool);
    return out;
  }
  if (Array.isArray(value)) return value.map((x) => internalize(x, pool));
  return value;
}
async function buildMemberZip() {
  const mf = await buildMemberFile();
  const pool = /* @__PURE__ */ new Map();
  const server = mf.server;
  if (server && server.assets && typeof server.assets === "object") {
    const na = {};
    for (const [h, v] of Object.entries(server.assets)) {
      if (v && typeof v === "object" && typeof v.data === "string") {
        na[h] = { mime: v.mime, data: await stash(b64ToBytes(v.data), "b", pool) };
      } else na[h] = v;
    }
    server.assets = na;
  }
  const manifest = {
    type: ZIP_MEMBER_TYPE,
    version: 2,
    exportedAt: mf.exportedAt,
    settings: await externalize(mf.settings, pool),
    server: await externalize(mf.server, pool)
  };
  const files = {
    "manifest.json": strToU8(JSON.stringify(manifest))
  };
  for (const [hash, bytes] of pool) files["blobs/" + hash] = [bytes, { level: 0 }];
  return zipSync(files, { level: 0 });
}
function isMemberZip(bytes) {
  return bytes.length > 3 && bytes[0] === 80 && bytes[1] === 75 && (bytes[2] === 3 || bytes[2] === 5);
}
function parseMemberZip(bytes) {
  let entries;
  try {
    entries = unzipSync(bytes);
  } catch {
    return { ok: false, error: "압축 백업 파일을 읽을 수 없습니다." };
  }
  const mraw = entries["manifest.json"];
  if (!mraw) return { ok: false, error: "타코야키 내 데이터 백업(zip)이 아닙니다." };
  let manifest;
  try {
    manifest = JSON.parse(strFromU8(mraw));
  } catch {
    return { ok: false, error: "백업 매니페스트가 손상되었습니다." };
  }
  if (manifest.type !== ZIP_MEMBER_TYPE || manifest.version !== 2) {
    return { ok: false, error: "지원하지 않는 백업 형식입니다." };
  }
  const pool = /* @__PURE__ */ new Map();
  for (const [path, data] of Object.entries(entries)) if (path.startsWith("blobs/")) pool.set(path.slice(6), data);
  const settings = internalize(manifest.settings, pool);
  const sp = parseSettingsFile(settings);
  if (!sp.ok) return { ok: false, error: sp.error };
  return {
    ok: true,
    data: {
      type: "tacoyaki-member-full",
      version: 1,
      exportedAt: typeof manifest.exportedAt === "number" ? manifest.exportedAt : 0,
      settings: sp.data,
      server: internalize(manifest.server, pool) ?? null
    }
  };
}
function parseMemberFile(raw) {
  if (!raw || typeof raw !== "object") return { ok: false, error: "파일을 읽을 수 없습니다." };
  const o = raw;
  if (o.type !== "tacoyaki-member-full") return { ok: false, error: "타코야키 내 데이터 백업 파일이 아닙니다." };
  if (o.version !== 1) return { ok: false, error: "지원하지 않는 백업 파일 버전입니다." };
  const sp = parseSettingsFile(o.settings);
  if (!sp.ok) return { ok: false, error: sp.error };
  return {
    ok: true,
    data: {
      type: "tacoyaki-member-full",
      version: 1,
      exportedAt: typeof o.exportedAt === "number" ? o.exportedAt : 0,
      settings: sp.data,
      server: o.server ?? null
    }
  };
}
async function applyMemberFile(data) {
  let counts = { posts: 0, sessionlogs: 0, rooms: 0 };
  let serverSkipped = false;
  const server = data.server;
  if (server && server.type === "tacoyaki-member-server") {
    const res = await fetch(getServerUrl() + "/me/import", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: "Bearer " + getAuthToken() },
      body: JSON.stringify(server)
    });
    if (res.status === 403) {
      serverSkipped = true;
    } else {
      const r = await res.json().catch(() => ({ ok: false }));
      if (!r.ok) throw new Error(r.error || "서버 데이터를 가져오지 못했습니다.");
      counts = { posts: r.posts ?? 0, sessionlogs: r.sessionlogs ?? 0, rooms: r.rooms ?? 0 };
    }
  }
  await applySettingsFile(data.settings);
  return { ...counts, serverSkipped };
}
const KINDS = ["basic", "coc", "insane", "custom"];
const FIELD_TYPES = ["text", "longtext", "number", "gauge", "check", "select", "rowtable", "grid", "roll"];
const KEY_RE = /^[\p{L}\p{N}_-]+$/u;
const MAX_SECTIONS = 40;
const MAX_FIELDS = 60;
const MAX_COLS = 12;
const MAX_OPTIONS = 100;
const MAX_GRID_ROWS = 50;
function buildRulesetFile(ruleset) {
  return { format: "tacoyaki-ruleset", version: 1, app: "타코야키 박스", ruleset };
}
function str(v) {
  return typeof v === "string" ? v : void 0;
}
function arr(v, map) {
  if (!Array.isArray(v)) return void 0;
  return v.filter((x) => x && typeof x === "object").map((x) => map(x)).filter((x) => x != null);
}
function posNum(v) {
  return typeof v === "number" && isFinite(v) ? v : void 0;
}
function parseThreshold(v) {
  if (!v || typeof v !== "object") return void 0;
  const t = v;
  const out = {};
  if (posNum(t.div) != null) out.div = posNum(t.div);
  if (posNum(t.atLeast) != null) out.atLeast = posNum(t.atLeast);
  if (posNum(t.atMost) != null) out.atMost = posNum(t.atMost);
  if (t.fail === true) out.fail = true;
  if (t.rel === "lte" || t.rel === "lt" || t.rel === "gte" || t.rel === "gt") out.rel = t.rel;
  return Object.keys(out).length ? out : void 0;
}
function parseCheck(v) {
  if (!v || typeof v !== "object") return void 0;
  const c = v;
  const out = {};
  const dice = typeof c.dice === "string" ? c.dice.trim().slice(0, 40) : "";
  if (dice && isRollableDice(dice)) out.dice = dice;
  if (c.compare === "gte" || c.compare === "lte") out.compare = c.compare;
  return Object.keys(out).length ? out : void 0;
}
function clampInt(v, lo, hi) {
  const n = posNum(v);
  return n == null ? void 0 : Math.max(lo, Math.min(hi, Math.floor(n)));
}
function parseColumns(v) {
  const cols = arr(v, (c) => {
    const key = str(c.key);
    if (!key || !KEY_RE.test(key)) return null;
    const flex = posNum(c.flex);
    return { key, label: str(c.label) ?? key, flex: flex != null ? Math.max(0.2, Math.min(8, flex)) : void 0 };
  });
  if (!cols?.length) return void 0;
  const seen = /* @__PURE__ */ new Set();
  return cols.filter((c) => seen.has(c.key) ? false : (seen.add(c.key), true)).slice(0, MAX_COLS);
}
function parseSheetRoll(v) {
  if (!v || typeof v !== "object") return void 0;
  const r = v;
  const out = {};
  const expr = typeof r.expr === "string" ? r.expr.trim().slice(0, 40) : "";
  if (expr && isRollableDice(expr)) out.expr = expr;
  const target = str(r.target);
  if (target && KEY_RE.test(target)) out.target = target;
  if (r.compare === "lte" || r.compare === "gte") out.compare = r.compare;
  return Object.keys(out).length ? out : void 0;
}
function parseSheetSchema(v) {
  if (!v || typeof v !== "object") return void 0;
  const s = v;
  const usedKeys = /* @__PURE__ */ new Set();
  const sections = arr(s.sections, (sec) => {
    const id = str(sec.id);
    if (!id) return null;
    const fields = arr(sec.fields, (f) => {
      const key = str(f.key);
      if (!key || !KEY_RE.test(key) || usedKeys.has(key)) return null;
      usedKeys.add(key);
      const type = FIELD_TYPES.includes(String(f.type)) ? f.type : "text";
      const options = Array.isArray(f.options) ? f.options.map((o) => String(o ?? "")).slice(0, MAX_OPTIONS) : void 0;
      return {
        key,
        label: str(f.label) ?? key,
        type,
        placeholder: str(f.placeholder),
        min: posNum(f.min),
        max: posNum(f.max),
        options: options?.length ? options : void 0,
        cols: parseColumns(f.cols),
        rows: clampInt(f.rows, 1, MAX_GRID_ROWS),
        roll: parseSheetRoll(f.roll),
        span: clampInt(f.span, 1, 6)
      };
    });
    if (!fields?.length) return null;
    return { id, title: str(sec.title) ?? "", cols: clampInt(sec.cols, 1, 6), fields: fields.slice(0, MAX_FIELDS) };
  });
  if (!sections?.length) return void 0;
  const tsRaw = s.tokenStats && typeof s.tokenStats === "object" ? s.tokenStats : void 0;
  const tokenStats = tsRaw ? { hp: str(tsRaw.hp), mp: str(tsRaw.mp), san: str(tsRaw.san) } : void 0;
  const hasToken = tokenStats && (tokenStats.hp || tokenStats.mp || tokenStats.san);
  return { sections: sections.slice(0, MAX_SECTIONS), tokenStats: hasToken ? tokenStats : void 0 };
}
function parseRulesetFile(json) {
  if (!json || typeof json !== "object") return { ok: false, error: "파일 형식이 올바르지 않습니다." };
  const o = json;
  const raw = o.format === "tacoyaki-ruleset" && o.ruleset && typeof o.ruleset === "object" ? o.ruleset : o;
  const id = str(raw.id);
  const name = str(raw.name);
  if (!id) return { ok: false, error: "룰셋 파일이 아닙니다 (id 없음)." };
  if (id === "basic") return { ok: false, error: "'basic' 은 코어 기본 룰셋이라 덮어쓸 수 없습니다." };
  if (id === "custom") return { ok: false, error: "'custom' 은 이미 쓰이는 id 입니다. 다른 id 를 지어 주세요." };
  if (!name) return { ok: false, error: "룰셋 이름(name)이 없습니다." };
  const kind = KINDS.includes(String(raw.kind)) ? raw.kind : "basic";
  const characteristics = arr(
    raw.characteristics,
    (c) => str(c.key) && str(c.label) ? { key: String(c.key), label: String(c.label) } : null
  );
  const skills = arr(
    raw.skills,
    (s) => str(s.name) ? {
      name: String(s.name),
      base: typeof s.base === "number" ? s.base : 0,
      specialize: s.specialize === true || void 0,
      special: s.special === true || void 0,
      baseFormula: str(s.baseFormula)
    } : null
  );
  const levels = arr(
    raw.levels,
    (l) => str(l.id) && str(l.ko) ? { id: String(l.id), ko: String(l.ko), word: str(l.word), script: str(l.script), threshold: parseThreshold(l.threshold) } : null
  );
  const tables = arr(
    raw.tables,
    (t) => str(t.id) && str(t.label) ? {
      id: String(t.id),
      label: String(t.label),
      dice: str(t.dice) ?? "1d6",
      entries: Array.isArray(t.entries) ? t.entries.map((e) => String(e ?? "")) : []
    } : null
  );
  const resources = arr(
    raw.resources,
    (r) => str(r.key) && str(r.label) ? { key: String(r.key), label: String(r.label) } : null
  );
  const cf = raw.cardFeatures && typeof raw.cardFeatures === "object" ? raw.cardFeatures : {};
  let skillGrid;
  if (raw.skillGrid && typeof raw.skillGrid === "object") {
    const g = raw.skillGrid;
    const fields = Array.isArray(g.fields) ? g.fields.map((f) => String(f ?? "")) : [];
    if (fields.length) {
      const rows = typeof g.rows === "number" && g.rows > 0 ? Math.floor(g.rows) : 11;
      const cells = Array.isArray(g.cells) ? g.cells.map((col) => Array.isArray(col) ? col.map((c) => String(c ?? "")) : []) : void 0;
      skillGrid = { fields, rows, cells };
    }
  }
  const ruleset = {
    id,
    name,
    version: typeof raw.version === "number" ? raw.version : 1,
    kind,
    external: true,
    systemLabel: str(raw.systemLabel),
    characteristics,
    skills,
    levels,
    tables,
    resources,
    cardFeatures: {
      thresholdTrack: cf.thresholdTrack === true || void 0,
      san: cf.san === true || void 0,
      push: cf.push === true || void 0,
      luck: cf.luck === true || void 0
    },
    skillGrid,
    check: parseCheck(raw.check),
    sheet: parseSheetSchema(raw.sheet),
    instruments: Array.isArray(raw.instruments) ? raw.instruments.map((x) => String(x ?? "").trim().slice(0, 40)).filter(Boolean).slice(0, 60) : void 0,
    bursts: arr(raw.bursts, (x) => str(x.instrument) ? { instrument: String(x.instrument).trim().slice(0, 40), name: (str(x.name) ?? "").slice(0, 80), effect: (str(x.effect) ?? "").slice(0, 800) } : null)?.slice(0, 60),
    strategies: arr(raw.strategies, (x) => str(x.name) ? { name: String(x.name).trim().slice(0, 40), effect: (str(x.effect) ?? "").slice(0, 400) } : null)?.slice(0, 40)
  };
  return { ok: true, ruleset };
}
function fmtBytes(n) {
  if (!n || n < 1) return "0";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v >= 100 || i === 0 ? Math.round(v) : v.toFixed(1)} ${u[i]}`;
}
function fmtDate(ms) {
  try {
    return new Date(ms).toLocaleDateString("ko-KR", { year: "2-digit", month: "2-digit", day: "2-digit" });
  } catch {
    return "-";
  }
}
function fmtDateTime(ms) {
  try {
    return new Date(ms).toLocaleString("ko-KR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  } catch {
    return "-";
  }
}
async function confirmTyped(opts) {
  const ok1 = await confirmDialog({ title: opts.title, message: opts.message, okText: "계속", tone: "danger" });
  if (!ok1) return false;
  const typed = await promptText({
    title: "한 번 더 확인",
    label: `되돌릴 수 없습니다. 진행하려면 아래에 ‘${opts.word}’ 를 그대로 입력하세요.`,
    placeholder: opts.word,
    okText: opts.okText ?? "삭제"
  });
  if (typed === null) return false;
  if (typed.trim() !== opts.word) {
    await alertDialog("입력이 일치하지 않아 취소했습니다.");
    return false;
  }
  return true;
}
const ROLE_LABEL = { admin: "관리자", member: "멤버", guest: "손님" };
function RoleBadge({ role }) {
  const color = role === "admin" ? "#f0b75b" : role === "member" ? "#5bbd7a" : "#a7adbe";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        fontSize: 11,
        fontWeight: 700,
        padding: "1px 7px",
        borderRadius: 999,
        color,
        border: `1px solid ${color}66`,
        background: `${color}1a`
      },
      children: ROLE_LABEL[role] ?? role
    }
  );
}
function ServerAdmin() {
  const overview = useAdminStore((s) => s.overview);
  const loading = useAdminStore((s) => s.loading);
  const error = useAdminStore((s) => s.error);
  const busy = useAdminStore((s) => s.busy);
  const fetchOverview = useAdminStore((s) => s.fetchOverview);
  const setRole = useAdminStore((s) => s.setRole);
  const changeUsername = useAdminStore((s) => s.changeUsername);
  const transferAdmin = useAdminStore((s) => s.transferAdmin);
  const deleteRoom = useAdminStore((s) => s.deleteRoom);
  const clearLobby = useAdminStore((s) => s.clearLobby);
  const deleteChars = useAdminStore((s) => s.deleteChars);
  const deletePosts = useAdminStore((s) => s.deletePosts);
  const deleteSessionlogs = useAdminStore((s) => s.deleteSessionlogs);
  const purgeUser = useAdminStore((s) => s.purgeUser);
  const runGc = useAdminStore((s) => s.runGc);
  const setCommunityEnabled = useAdminStore((s) => s.setCommunityEnabled);
  const cmtyProbe = useCommunityStore((s) => s.probe);
  const cmtyRefresh = useCommunityStore((s) => s.refresh);
  const exportServer = useAdminStore((s) => s.exportServer);
  const importServer = useAdminStore((s) => s.importServer);
  const importRef = reactExports.useRef(null);
  const [sort, setSort] = reactExports.useState("total");
  const [asc, setAsc] = reactExports.useState(false);
  const [openId, setOpenId] = reactExports.useState(null);
  reactExports.useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);
  const pendingCount = (overview?.users ?? []).filter((u) => u.role === "guest").length;
  const users = [...overview?.users ?? []].sort((a, b) => {
    if (a.role === "guest" !== (b.role === "guest")) return a.role === "guest" ? -1 : 1;
    const dir = asc ? 1 : -1;
    switch (sort) {
      case "name":
        return dir * (a.nickname || a.username).localeCompare(b.nickname || b.username);
      case "created":
        return dir * (a.createdAt - b.createdAt);
      case "rooms":
        return dir * (a.rooms.bytes - b.rooms.bytes);
      case "characters":
        return dir * (a.characters.bytes - b.characters.bytes);
      case "posts":
        return dir * (a.posts.bytes - b.posts.bytes);
      case "sessionlogs":
        return dir * (a.sessionlogs.bytes - b.sessionlogs.bytes);
      case "lobby":
        return dir * (a.lobbyBytes - b.lobbyBytes);
      case "profile":
        return dir * (a.profileBytes - b.profileBytes);
      case "assetUnique":
        return dir * (a.assetBytesUnique - b.assetBytesUnique);
      default:
        return dir * (a.totalLogical - b.totalLogical);
    }
  });
  const clickSort = (k) => {
    if (sort === k) setAsc((v) => !v);
    else {
      setSort(k);
      setAsc(k === "name");
    }
  };
  const onGc = async () => {
    const ok = await confirmDialog({
      title: "미참조 자산 정리",
      message: "참조되지 않는 자산 파일을 삭제합니다.",
      okText: "정리",
      tone: "danger"
    });
    if (!ok) return;
    const r = await runGc();
    if (r.ok) {
      const parts = [`${r.removed ?? 0}개 · ${fmtBytes(r.freed ?? 0)} 확보`];
      if (r.deferred) parts.push(`방금 올라온 ${r.deferred}개는 잠시 뒤 회수`);
      if (r.failed) parts.push(`${r.failed}개는 지우지 못했습니다(파일이 사용 중일 수 있어요)`);
      await alertDialog("정리 완료. " + parts.join(" · "));
    } else await alertDialog("정리에 실패했습니다: " + (r.error ?? ""));
  };
  const onExport = async () => {
    const ok = await confirmDialog({
      title: "서버 백업 파일 내려받기",
      message: "서버 데이터 전부를 백업 파일 하나로 이 컴퓨터에 내려받습니다.\n⚠ 비밀번호 해시·전체 DM 이 들어 있으니 안전하게 보관하세요.",
      okText: "내려받기"
    });
    if (!ok) return;
    const r = await exportServer();
    if (!r.ok) await alertDialog("내려받기 실패: " + (r.error ?? ""));
  };
  const onImportFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const ok = await confirmTyped({
      title: "서버 데이터 가져오기",
      message: "서버 데이터를 이 파일로 덮어씁니다. 되돌릴 수 없습니다.\n새(빈) 서버에 복원한 뒤 서버를 재시작해 주세요.",
      word: "가져오기",
      okText: "가져오기"
    });
    if (!ok) return;
    const r = await importServer(file);
    if (r.ok)
      await alertDialog(
        `복원 완료. 파일 ${r.restored ?? 0}개.
반드시 서버를 재시작(또는 재배포)해야 새 데이터가 적용됩니다.`
      );
    else await alertDialog("가져오기 실패: " + (r.error ?? ""));
  };
  const sum = overview?.summary;
  const cmtyOn = overview?.communityEnabled !== false;
  const onToggleCommunity = async () => {
    if (cmtyOn) {
      const ok = await confirmDialog({
        title: "커뮤니티 기능(베타) 끄기",
        message: "모두가 커뮤니티를 열 수 없게 됩니다.\n글과 자료는 남아 있다가 다시 켜면 돌아옵니다.",
        okText: "끄기",
        tone: "danger"
      });
      if (!ok) return;
    }
    const r = await setCommunityEnabled(!cmtyOn);
    if (!r.ok) await alertDialog("바꾸지 못했습니다: " + (r.error ?? ""));
    else void cmtyProbe();
  };
  const onSwitchMode = async () => {
    const ok = await confirmDialog({
      title: "보통 커뮤니티로 전환",
      message: "게시판만 남는 구성으로 바꿉니다. 캐릭터·상점·퀘스트 화면이 닫힙니다.\n담긴 자료는 그대로 남습니다.",
      okText: "전환"
    });
    if (!ok) return;
    const r = await cmty.adminMode("basic");
    if (!r.ok) return void await alertDialog("바꾸지 못했습니다: " + r.error);
    await fetchOverview();
    void cmtyRefresh();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-pane", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "서버 관리" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: "호스팅 용량을 확인하고 회수합니다." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 10, flexWrap: "wrap", margin: "10px 0 14px" }, children: [
      { label: "자산 디스크", value: sum ? fmtBytes(sum.assetBytes) : "…", sub: sum ? `${sum.assetCount}개` : "" },
      { label: "사용 중", value: sum ? fmtBytes(sum.liveAssetBytes) : "…", sub: "참조됨" },
      {
        label: "회수 가능(고아)",
        value: sum ? fmtBytes(sum.orphanBytes) : "…",
        // 유예 중인 양을 함께 적는다 — 지금 눌러도 안 지워지는 이유가 화면에 있어야 한다.
        sub: sum?.deferredBytes ? `지금 정리 가능 · 유예 ${fmtBytes(sum.deferredBytes)}` : "GC 대상",
        warn: !!sum && sum.orphanBytes > 0
      },
      { label: "계정", value: sum ? String(sum.accountCount) : "…", sub: "명" },
      // 새로 가입한 사람은 손님으로 시작하는데, 관리자에게 알릴 길이 없으면 승인이 밀린다.
      {
        label: "승인 대기",
        value: String(pendingCount),
        sub: pendingCount ? "손님(승인하면 멤버)" : "없음",
        warn: pendingCount > 0
      },
      { label: "세션방", value: sum ? String(sum.roomCount) : "…", sub: "개" }
    ].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "card",
        style: { flex: "1 1 120px", minWidth: 120, padding: "10px 12px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: c.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontSize: 20, fontWeight: 800, color: c.warn ? "var(--danger, #ef6f8e)" : void 0 }, children: c.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted", style: { fontSize: 11 }, children: c.sub })
        ]
      },
      c.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginBottom: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => void fetchOverview(), disabled: loading, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "refresh", size: 14 }),
        " ",
        loading ? "불러오는 중…" : "새로고침"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => void onGc(), disabled: busy === "gc", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cleaning_services", size: 14 }),
        " ",
        busy === "gc" ? "정리 중…" : "지금 정리(GC)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "10px 12px", margin: "4px 0 14px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 0, flex: 1 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }, children: [
            "커뮤니티 기능 ",
            cmtyOn ? "켜짐" : "꺼짐",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HintTip,
              {
                label: cmtyOn ? "커뮤니티 기능 끄기 설명" : "커뮤니티 기능 켜기 설명",
                text: cmtyOn ? "끄면 모두가 커뮤니티를 열 수 없습니다. 글과 자료는 그대로 남습니다." : "켜면 모두가 커뮤니티를 열 수 있습니다. 껐던 글과 자료는 그대로 돌아옵니다."
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                style: {
                  fontSize: 10,
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  padding: "1px 6px",
                  borderRadius: 999,
                  color: "var(--accent, #7aa2ff)",
                  border: "1px solid currentColor"
                },
                children: "베타"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { lineHeight: 1.5 }, children: "검증 중인 기능입니다. 켜기 전에 서버 백업 파일을 내려받아 두세요." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm" + (cmtyOn ? "" : " pri"), disabled: busy === "cmty", onClick: () => void onToggleCommunity(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: cmtyOn ? "toggle_on" : "toggle_off", size: 14 }),
          " ",
          cmtyOn ? "끄기" : "켜기"
        ] })
      ] }),
      cmtyOn && overview?.communityMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid var(--line, rgba(255,255,255,.1))"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 0, flex: 1 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 700, marginBottom: 4 }, children: [
                "성격(",
                overview.communityMode === "oc" ? "자캐 커뮤니티" : "보통 커뮤니티",
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { lineHeight: 1.5 }, children: overview.communityMode === "oc" ? "캐릭터·상점·퀘스트까지 열린 옛 구성입니다." : "게시판만 여는 구성입니다." })
            ] }),
            overview.communityMode === "oc" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", disabled: busy === "cmty", onClick: () => void onSwitchMode(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "swap_horiz", size: 14 }),
              " 보통 커뮤니티로 전환"
            ] }) : (
              // 눌리기는 하되 안내만 띄운다 — 회색 단추만 두면 왜 못 쓰는지가 아무 데도 남지 않는다.
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "btn sm",
                  title: "자캐(캐릭터) 커뮤니티는 아직 개발 중입니다",
                  onClick: () => void alertDialog({
                    title: "자캐 커뮤니티 (개발 중)",
                    message: "준비가 끝나면 이 자리에서 전환할 수 있습니다."
                  }),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 14 }),
                    " 자캐 커뮤니티 (개발 중)"
                  ]
                }
              )
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "10px 12px", margin: "4px 0 14px" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, marginBottom: 4 }, children: "서버 데이터 이전" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { lineHeight: 1.5, marginBottom: 8 }, children: [
        "내려받기는 이 컴퓨터에 파일로 저장만 하고, 서버 내용은 바꾸지 않습니다. 가져온 뒤에는 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "서버를 재시작(또는 재배포)" }),
        "해야 적용됩니다."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => void onExport(), disabled: busy === "export", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 14 }),
          " ",
          busy === "export" ? "내려받는 중…" : "서버 백업 파일 내려받기"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => importRef.current?.click(), disabled: busy === "import", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 14 }),
          " ",
          busy === "import" ? "복원 중…" : "서버 데이터 가져오기"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: importRef,
            type: "file",
            accept: ".json,application/json",
            hidden: true,
            onChange: (e) => void onImportFile(e)
          }
        )
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint", style: { color: "var(--danger, #ef6f8e)" }, children: [
      "⚠ ",
      error
    ] }),
    (overview?.saveTroubles ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", style: { padding: "10px 12px", margin: "4px 0 14px", borderColor: "var(--danger, #ef6f8e)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 700, marginBottom: 4, color: "var(--danger, #ef6f8e)" }, children: "세션 저장이 막혀 있습니다" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { lineHeight: 1.5, marginBottom: 6 }, children: "아래 세션이 디스크에 저장되지 못합니다. 서버를 다시 시작하면 대화가 사라지니 로그를 먼저 백업해 주세요." }),
      (overview?.saveTroubles ?? []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "small", style: { lineHeight: 1.6 }, children: [
        "· ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: t.title || t.id }),
        " (",
        t.reason,
        ")"
      ] }, t.id))
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "admin-table-wrap", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "admin-table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "유저", k: "name", sort, asc, onClick: clickSort, align: "left" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "등급" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "방", k: "rooms", sort, asc, onClick: clickSort }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "캐릭터", k: "characters", sort, asc, onClick: clickSort }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "블로그", k: "posts", sort, asc, onClick: clickSort }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "세션로그", k: "sessionlogs", sort, asc, onClick: clickSort }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "로비", k: "lobby", sort, asc, onClick: clickSort }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "프로필", k: "profile", sort, asc, onClick: clickSort }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "회수가능", k: "assetUnique", sort, asc, onClick: clickSort }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { label: "합계", k: "total", sort, asc, onClick: clickSort })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: users.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        UserRows,
        {
          u,
          open: openId === u.id,
          busy,
          onToggle: () => setOpenId((id) => id === u.id ? null : u.id),
          onVisit: () => useLobbyStore.getState().setVisiting(u.id, { name: u.nickname || u.username }),
          onRenameId: async () => {
            const next = await promptText({
              title: "아이디 변경",
              label: `‘${u.nickname || u.username}’ 님의 로그인 아이디(@${u.username})를 바꿉니다. 새 아이디를 2자 이상으로 입력하세요.`,
              defaultValue: u.username,
              placeholder: "새 아이디",
              okText: "변경"
            });
            if (next === null) return;
            const name = next.trim();
            if (!name || name === u.username) return;
            const r = await changeUsername(u.id, name);
            if (!r.ok) await alertDialog("아이디 변경 실패: " + (r.error ?? ""));
          },
          onApprove: async () => {
            const r = await setRole(u.id, "member");
            if (!r.ok) await alertDialog("승인 실패: " + (r.error ?? "알 수 없는 이유"));
          },
          onTransfer: async () => {
            const label = u.nickname || u.username;
            const ok = await confirmTyped({
              title: "관리자 넘기기",
              message: `‘${label}’ 님에게 관리자를 넘기고 나는 멤버가 됩니다.
되돌리려면 새 관리자가 다시 넘겨 줘야 합니다.`,
              word: label
            });
            if (!ok) return;
            const r = await transferAdmin(u.id);
            if (r.ok) {
              await alertDialog(`관리자를 ‘${label}’ 님에게 넘겼습니다. 이제 나는 멤버입니다.`);
            } else {
              await alertDialog("관리자 넘기기 실패: " + (r.error ?? ""));
            }
          },
          onDemote: async () => {
            const ok = await confirmDialog({
              title: "멤버 강등",
              message: `‘${u.nickname || u.username}’ 님을 손님으로 강등합니다. 세션 개설·로비 꾸미기가 막힙니다.`,
              okText: "강등",
              tone: "danger"
            });
            if (ok) await setRole(u.id, "guest");
          },
          onDeleteRoom: async (roomId, label) => {
            if (await confirmTyped({ title: "세션방 삭제", message: `세션방 ‘${label}’ 를 영구 삭제합니다. 참가자는 즉시 퇴장됩니다.`, word: label }))
              await deleteRoom(roomId);
          },
          onClearLobby: async () => {
            if (await confirmTyped({ title: "로비 꾸밈 초기화", message: `‘${u.nickname || u.username}’ 님의 공개 로비 꾸밈(벽지·갤러리·위젯 등)을 초기화합니다.`, word: u.username, okText: "초기화" }))
              await clearLobby(u.id);
          },
          onDeleteChars: async () => {
            if (await confirmTyped({ title: "캐릭터 전체 삭제", message: `‘${u.nickname || u.username}’ 님의 캐릭터 시트 ${u.characters.count}개를 전부 삭제합니다.`, word: u.username }))
              await deleteChars(u.id);
          },
          onDeletePosts: async () => {
            if (await confirmTyped({ title: "블로그 전체 삭제", message: `‘${u.nickname || u.username}’ 님의 블로그 글 ${u.posts.count}개를 전부 삭제합니다.`, word: u.username }))
              await deletePosts(u.id);
          },
          onDeleteSessionlogs: async () => {
            if (await confirmTyped({ title: "세션 로그 전체 삭제", message: `‘${u.nickname || u.username}’ 님의 세션 로그 백업 ${u.sessionlogs.count}개를 전부 삭제합니다.`, word: u.username }))
              await deleteSessionlogs(u.id);
          },
          onPurge: async () => {
            if (await confirmTyped({ title: "계정 완전 삭제", message: `‘${u.nickname || u.username}’ 님의 계정과 모든 데이터를 영구 삭제합니다. 되돌릴 수 없습니다.`, word: u.username, okText: "완전 삭제" }))
              await purgeUser(u.id);
          }
        },
        u.id
      )) })
    ] }) }),
    !loading && users.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "표시할 계정이 없습니다." })
  ] });
}
function Th({
  label,
  k,
  sort,
  asc,
  onClick,
  align = "right"
}) {
  const active = sort === k;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "th",
    {
      style: { cursor: "pointer", textAlign: align, whiteSpace: "nowrap", userSelect: "none" },
      onClick: () => onClick(k),
      title: "클릭하여 정렬",
      children: [
        label,
        active ? asc ? " ▲" : " ▼" : ""
      ]
    }
  );
}
function UserRows({
  u,
  open,
  busy,
  onToggle,
  onVisit,
  onRenameId,
  onApprove,
  onDemote,
  onTransfer,
  onDeleteRoom,
  onClearLobby,
  onDeleteChars,
  onDeletePosts,
  onDeleteSessionlogs,
  onPurge
}) {
  const name = u.nickname || u.username;
  const isAdmin = u.role === "admin";
  const rowBusy = !!busy && (busy.endsWith(":" + u.id) || u.roomList.some((r) => busy === "room:" + r.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "admin-row" + (open ? " open" : ""), onClick: onToggle, style: { cursor: "pointer" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { style: { textAlign: "left" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "av",
            style: {
              width: 24,
              height: 24,
              fontSize: 11,
              background: u.avatar ? `center/cover url(${u.avatar})` : "#8b93a7"
            },
            children: u.avatar ? "" : name[0]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { minWidth: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }, children: [
            name,
            u.online && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "온라인", style: { width: 7, height: 7, borderRadius: 999, background: "#5bbd7a" } }),
            u.lobbyPrivate && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "chip",
                title: "로비를 친구에게만 엽니다. 블로그·세션 로그·방명록·마이룸도 함께 닫힙니다",
                style: { fontSize: 10 },
                children: "비공개"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted", style: { fontSize: 11 }, children: [
            "@",
            u.username,
            " · 가입 ",
            fmtDate(u.createdAt),
            " ·",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { title: "마지막 접속(로그인·접속 종료 기준)", children: u.online ? "접속 중" : u.lastSeenAt ? `접속 ${fmtDateTime(u.lastSeenAt)}` : "접속 기록 없음" })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RoleBadge, { role: u.role }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: u.rooms.count ? `${u.rooms.count} · ${fmtBytes(u.rooms.bytes)}` : "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: u.characters.count ? `${u.characters.count} · ${fmtBytes(u.characters.bytes)}` : "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: u.posts.count ? `${u.posts.count} · ${fmtBytes(u.posts.bytes)}` : "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", children: u.sessionlogs.count ? `${u.sessionlogs.count} · ${fmtBytes(u.sessionlogs.bytes)}` : "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", title: "공개 로비 꾸밈(‘로비 초기화’ 회수 범위)", children: u.lobbyBytes ? fmtBytes(u.lobbyBytes) : "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", title: "프로필 사진·배너·소개·방명록(계정 삭제로만 회수)", children: u.profileBytes ? fmtBytes(u.profileBytes) : "–" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", title: "이 유저만 참조하는 자산(삭제 시 실제 회수량)", children: fmtBytes(u.assetBytesUnique) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "num", style: { fontWeight: 700 }, children: fmtBytes(u.totalLogical) })
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "admin-detail", children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 10, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-detail-box", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-act-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "열람" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", onClick: onVisit, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "home", size: 13 }),
          " 프로필·로비 방문"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-act-row", style: { marginTop: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "등급" }),
        u.role === "guest" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs pri", disabled: rowBusy, onClick: onApprove, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "how_to_reg", size: 13 }),
          " 멤버로 승인"
        ] }),
        u.role === "member" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", disabled: rowBusy, onClick: onDemote, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person_off", size: 13 }),
          " 손님으로 강등"
        ] }),
        isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "관리자(등급 변경 불가)" }),
        !isAdmin && u.role === "member" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", disabled: rowBusy, onClick: onTransfer, title: "이 사람에게 관리자를 넘깁니다", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "admin_panel_settings", size: 13 }),
          " 관리자 넘기기"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", disabled: rowBusy, onClick: onRenameId, title: "로그인 아이디 변경", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "badge", size: 13 }),
          " 아이디 변경"
        ] })
      ] }),
      u.roomList.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
          "세션방 (",
          u.roomList.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }, children: u.roomList.map((r) => {
          const label = r.title?.trim() || r.code;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-room-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: [
              label,
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted", children: [
                "· ",
                fmtBytes(r.bytes)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn danger", title: "이 세션방 삭제", disabled: !!busy && busy === "room:" + r.id, onClick: () => onDeleteRoom(r.id, label), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 }) })
          ] }, r.id);
        }) })
      ] }),
      !isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "admin-act-row", style: { marginTop: 10, flexWrap: "wrap" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "회수" }),
        u.lobbyBytes > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", disabled: rowBusy, onClick: onClearLobby, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "wallpaper", size: 13 }),
          " 로비 초기화"
        ] }),
        u.characters.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", disabled: rowBusy, onClick: onDeleteChars, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "groups", size: 13 }),
          " 캐릭터 삭제"
        ] }),
        u.posts.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", disabled: rowBusy, onClick: onDeletePosts, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "article", size: 13 }),
          " 블로그 삭제"
        ] }),
        u.sessionlogs.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs", disabled: rowBusy, onClick: onDeleteSessionlogs, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "history_edu", size: 13 }),
          " 세션 로그 삭제"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn xs danger", disabled: rowBusy, onClick: onPurge, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person_remove", size: 13 }),
          " 계정 완전 삭제"
        ] })
      ] })
    ] }) }) })
  ] });
}
const accents = [
  { id: "indigo", color: "#7c9cff" },
  { id: "teal", color: "#3fc7bd" },
  { id: "purple", color: "#a682f0" },
  { id: "amber", color: "#e7a33e" },
  { id: "rose", color: "#ef6f8e" }
];
function fmtStamp(ts) {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}
const paneTitle = {
  theme: "테마",
  sfx: "효과음",
  ruleset: "룰셋",
  lib: "라이브러리",
  room: "방 · 권한",
  lobby: "로비",
  expansion: "확장팩",
  account: "계정 · 데이터",
  admin: "서버 관리"
};
const paneIcon = {
  theme: "palette",
  sfx: "notifications",
  ruleset: "auto_stories",
  lib: "collections",
  room: "groups",
  lobby: "desktop_windows",
  expansion: "extension",
  account: "shield_person",
  admin: "admin_panel_settings"
};
function Settings() {
  const [pane, setPane] = reactExports.useState("theme");
  const [scaleDraft, setScaleDraft] = reactExports.useState(null);
  const theme = useUIStore((s) => s.theme);
  const accent = useUIStore((s) => s.accent);
  const setTheme = useUIStore((s) => s.setTheme);
  const uiScale = useUIStore((s) => s.uiScale);
  const isMobileView = useIsMobile();
  const setUiScale = useUIStore((s) => s.setUiScale);
  const bodyFont = useUIStore((s) => s.bodyFont);
  const setBodyFont = useUIStore((s) => s.setBodyFont);
  const headingFont = useUIStore((s) => s.headingFont);
  const setHeadingFont = useUIStore((s) => s.setHeadingFont);
  const enterToSend = useUIStore((s) => s.enterToSend);
  const chatDimParens = useUIStore((s) => s.chatDimParens);
  const setChatDimParens = useUIStore((s) => s.setChatDimParens);
  const setEnterToSend = useUIStore((s) => s.setEnterToSend);
  const statLog = useUIStore((s) => s.statLog);
  const toggleStatLog = useUIStore((s) => s.toggleStatLog);
  const vnCastMax = useUIStore((s) => s.vnCastMax);
  const vnFontScale = useUIStore((s) => s.vnFontScale);
  const setVnFontScale = useUIStore((s) => s.setVnFontScale);
  const setVnCastMax = useUIStore((s) => s.setVnCastMax);
  const uiAccent = useUIStore((s) => s.uiAccent);
  const setUiAccent = useUIStore((s) => s.setUiAccent);
  const setScreen = useUIStore((s) => s.setScreen);
  const lobbyPlayMs = useLobbyStore((s) => s.playMs);
  const [lobbySyncBusy, setLobbySyncBusy] = reactExports.useState(false);
  const [lobbyStamp, setLobbyStamp] = reactExports.useState(null);
  const refreshLobbyStamp = async () => {
    const me = useAuthStore.getState().account;
    if (!me) return;
    setLobbyStamp(null);
    setLobbyStamp(await fetchLobbyStamp(me.id));
  };
  reactExports.useEffect(() => {
    if (pane === "lobby") void refreshLobbyStamp();
  }, [pane]);
  const pullLobbyNow = async () => {
    const me = useAuthStore.getState().account;
    if (!me) return;
    const yes = await confirmDialog({
      title: "서버에서 받아오기",
      message: "서버 로비를 이 기기로 받아옵니다. 이 기기에서 고친 부분은 덮어씁니다.",
      okText: "받아오기"
    });
    if (!yes) return;
    setLobbySyncBusy(true);
    const r = await pullLobbyFromServer(me.id);
    setLobbySyncBusy(false);
    await alertDialog(
      r === "restored" ? { title: "받아왔습니다", message: "남에게 보이던 로비를 이 기기로 받아왔습니다." } : r === "partial" ? {
        title: "받아왔습니다",
        message: "이 기기는 그림을 저장하지 못해, 창을 닫으면 다시 받아와야 합니다."
      } : r === "empty" ? {
        title: "받아올 것이 없습니다",
        message: "서버에 올려 둔 로비가 없습니다. 로비가 보이는 기기에서 먼저 보내 주세요."
      } : { title: "받아오지 못했습니다", message: "연결을 확인하고 잠시 뒤 다시 시도해 주세요." }
    );
  };
  const pullLobbyMusicNow = async () => {
    const me = useAuthStore.getState().account;
    if (!me) return;
    const yes = await confirmDialog({
      title: "음악만 받아오기",
      message: "서버 음악 목록을 받아옵니다. 이 기기 목록은 대체되니 여기만 있는 곡은 먼저 올려 두세요.",
      okText: "받아오기"
    });
    if (!yes) return;
    setLobbySyncBusy(true);
    const r = await pullLobbyMusicFromServer(me.id).catch(() => ({ status: "error" }));
    setLobbySyncBusy(false);
    await alertDialog(
      r.status === "ok" ? {
        title: "받아왔습니다",
        message: `음악 ${r.landed}곡을 이 기기로 받아왔습니다.` + (r.dropped > 0 ? `
${r.dropped}곡이 빠졌습니다. 이대로 올리면 서버에서도 사라지니 다시 받아와 주세요.` : "")
      } : r.status === "empty" ? {
        title: "받아올 것이 없습니다",
        message: "서버에 음악이 없습니다. 곡이 있는 기기에서 「이 기기 것으로 맞추기」를 눌러 주세요."
      } : {
        title: "받아오지 못했습니다",
        message: "이 기기 목록은 그대로입니다. 잠시 뒤 다시 시도해 주세요."
      }
    );
  };
  const pushLobbyNow = async () => {
    const st = useLobbyStore.getState();
    const me = useAuthStore.getState().account;
    if (!me || st.switching) return;
    if (!st.loaded) await useLobbyStore.getState().load();
    const s2 = useLobbyStore.getState();
    if (lobbyImagesMissing(s2)) {
      await alertDialog({
        title: "보낼 수 없습니다",
        message: "이 기기에 로비 그림 사본이 없습니다. 그림이 보이는 기기에서 보내 주세요."
      });
      return;
    }
    setLobbySyncBusy(true);
    const tracks = useLobbyMusicStore.getState().tracks;
    const pub = await publishLobby(
      buildLobbySnapshot(s2, musicForPublish(tracks.map((t) => ({ title: t.title, cover: t.cover })))),
      lobbyImageRefCount(s2),
      { explicitEmpty: true }
    );
    const ok = pub.ok;
    if (ok) {
      const musicOk = await publishLobbyMusic(
        tracks.map((t) => ({ title: t.title, cover: t.cover, src: t.src, volume: t.volume })),
        { explicitEmpty: true }
      );
      if (musicOk) {
        clearLobbyMusicShort(me.id);
        markLobbyMusicSeen(me.id);
        writePublishedMusicSig(
          me.id,
          JSON.stringify(tracks.map((t) => [t.id, t.title, t.src.length]))
        );
      }
    }
    if (ok && me.id) markLobbyServerSeen(me.id);
    setLobbySyncBusy(false);
    void refreshLobbyStamp();
    await alertDialog(
      ok ? {
        title: "맞췄습니다",
        message: "방문자에게 보이는 로비를 이 화면으로 맞췄습니다.\n친구는 프로필이나 친구 목록의 로비 방문으로 이 화면을 봅니다."
      } : {
        title: "보내지 못했습니다",
        message: pub.reason === "toolarge" ? "로비가 너무 커서(그림 포함 12MB 초과) 올라가지 못했습니다. 큰 그림을 줄이고 다시 보내 주세요." : pub.reason === "network" ? "서버와 연결이 되지 않았습니다. 연결을 확인하고 다시 시도해 주세요." : "서버가 받지 않았습니다. 그림이 제대로 보이는 기기에서 보내 주세요."
      }
    );
  };
  const soundOn = useUIStore((s) => s.soundOn);
  const notifSoundOn = useUIStore((s) => s.notifSoundOn);
  const toggleSound = useUIStore((s) => s.toggleSound);
  const toggleNotifSound = useUIStore((s) => s.toggleNotifSound);
  const sfxCustom = useUIStore((s) => s.sfxCustom);
  const sfxVolume = useUIStore((s) => s.sfxVolume);
  const setSfxCustom = useUIStore((s) => s.setSfxCustom);
  const setSfxVolume = useUIStore((s) => s.setSfxVolume);
  const isGM = useNetStore((s) => s.self?.role === "GM");
  const inRoom = useNetStore((s) => s.roomId !== null);
  const back = () => setScreen(inRoom ? "room" : "lobby");
  const loadRoom = useNetStore((s) => s.loadRoom);
  const roomLuckEnabled = useNetStore((s) => s.roomLuckEnabled);
  const setRoomLuckEnabled = useNetStore((s) => s.setRoomLuckEnabled);
  const roomGmSeeWhispers = useNetStore((s) => s.roomGmSeeWhispers);
  const setRoomGmSeeWhispers = useNetStore((s) => s.setRoomGmSeeWhispers);
  const roomFileInput = reactExports.useRef(null);
  const sfxInput = reactExports.useRef(null);
  const sfxTarget = reactExports.useRef(null);
  const account = useAuthStore((s) => s.account);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const isGuest = useAuthStore((s) => s.isGuest());
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const hardReset = useNetStore((s) => s.hardReset);
  const [delPw, setDelPw] = reactExports.useState("");
  const [deleting, setDeleting] = reactExports.useState(false);
  const changePassword = useAuthStore((s) => s.changePassword);
  const roomDimColor = useNetStore((s) => s.roomDimColor);
  const setRoomDimColor = useNetStore((s) => s.setRoomDimColor);
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const [privacyBusy, setPrivacyBusy] = reactExports.useState(false);
  const [pwCur, setPwCur] = reactExports.useState("");
  const [pwNew, setPwNew] = reactExports.useState("");
  const [pwNew2, setPwNew2] = reactExports.useState("");
  const [pwBusy, setPwBusy] = reactExports.useState(false);
  const dataFileInput = reactExports.useRef(null);
  const ruleImported = useRulesetStore((s) => s.imported);
  const activeRulesetId = useRulesetStore((s) => s.activeRulesetId);
  const addRuleset = useRulesetStore((s) => s.addRuleset);
  const removeRuleset = useRulesetStore((s) => s.removeRuleset);
  const setActiveRuleset = useRulesetStore((s) => s.setActiveRuleset);
  const cardProfile = useRulesetStore((s) => s.cardProfile);
  const setCardProfile = useRulesetStore((s) => s.setCardProfile);
  const rulesetFileInput = reactExports.useRef(null);
  const rulesets = allRulesets({ imported: ruleImported, cardProfile });
  const cocLoaded = useRulesetStore((s) => s.imported.some((r) => r.kind === "coc"));
  const extAvailable = extSupported();
  const [exts, setExts] = reactExports.useState([]);
  const extIssues = useExpansionIssues((s) => s.byId);
  const [extBusy, setExtBusy] = reactExports.useState(null);
  const extFileInput = reactExports.useRef(null);
  const reloadExts = async () => {
    try {
      setExts(await extApi().list());
    } catch {
      setExts([]);
    }
  };
  reactExports.useEffect(() => {
    if (pane === "expansion") void reloadExts();
  }, [pane]);
  async function toggleExt(m, on) {
    setExtBusy(m.id);
    try {
      const r = on ? await loadExpansion(m.id) : await unloadExpansion(m.id);
      if (!r.ok && r.error) await alertDialog(r.error);
      await reloadExts();
    } finally {
      setExtBusy(null);
    }
  }
  async function onDeleteExt(m) {
    const ok = await confirmDialog(
      `'${m.name}' 확장팩을 이 PC 에서 삭제할까요?
설치 파일이 지워집니다. 서버의 방·캐릭터는 그대로입니다.`
    );
    if (!ok) return;
    setExtBusy(m.id);
    try {
      const r = await deleteExpansion(m.id);
      if (!r.ok && r.error) await alertDialog(r.error);
      await reloadExts();
    } finally {
      setExtBusy(null);
    }
  }
  async function afterExtInstall(r) {
    if (r.canceled) return;
    if (!r.ok) {
      await alertDialog(r.error || "확장팩을 설치하지 못했습니다.");
      return;
    }
    try {
      if (r.id) await registerLoadedExpansion(r.id);
      await reloadExts();
      await alertDialog("확장팩을 불러왔어요. 로비 바탕화면에서 확인하세요.");
    } catch (e) {
      await reloadExts();
      await alertDialog(e.message || "확장팩을 불러오지 못했습니다.");
    }
  }
  async function onOpenExtFile() {
    if (!isElectron()) {
      extFileInput.current?.click();
      return;
    }
    setExtBusy("__file__");
    try {
      await afterExtInstall(await extApi().pickAndImport());
    } finally {
      setExtBusy(null);
    }
  }
  async function onPickExtFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setExtBusy("__file__");
    try {
      await afterExtInstall(await installFromBytes(new Uint8Array(await file.arrayBuffer())));
    } catch (err) {
      await alertDialog(err.message || "확장팩 파일을 읽지 못했습니다.");
    } finally {
      setExtBusy(null);
    }
  }
  async function onLoadRulesetFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = parseRulesetFile(await readJsonFile(file));
      if (!parsed.ok) {
        await alertDialog(parsed.error);
        return;
      }
      addRuleset(parsed.ruleset);
      setActiveRuleset(parsed.ruleset.id);
      await alertDialog(`'${parsed.ruleset.name}' 룰셋을 불러왔습니다. 새 캐릭터에서 이 시트를 선택할 수 있습니다.`);
    } catch (err) {
      await alertDialog("룰셋 파일을 불러오지 못했습니다: " + err.message);
    }
  }
  async function saveRoom() {
    const map = useMapStore.getState();
    const ui = useUIStore.getState();
    const appearance = ui.appearanceLock ?? { theme: ui.theme, accent: ui.accent, uiAccent: ui.uiAccent, diceStyle: ui.diceStyle };
    const rawScene = {
      maps: Object.values(map.maps),
      activeMapId: map.activeMapId,
      handouts: useHandoutStore.getState().handouts,
      appearance,
      bgm: useBgmStore.getState().tracks
      // 동시재생 트랙 배열(자산 참조일 수 있음)
    };
    const scene = await withBusy("장면 저장 준비 중…", () => hydrateAssetsDeep(rawScene));
    const d = /* @__PURE__ */ new Date();
    const p = (n) => String(n).padStart(2, "0");
    const name = `방-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}.orpg`;
    downloadJson(name, buildRoomFile(scene, d.getTime()));
  }
  async function onLoadRoomFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = parseRoomFile(await readJsonFile(file));
      if (!parsed.ok) {
        await alertDialog(parsed.error);
        return;
      }
      if (!await confirmDialog("현재 방의 맵·자료·외형·BGM을 덮어씁니다. 계속할까요?")) return;
      const scene = await withBusy("장면 불러오는 중…", () => uploadAssetsDeep(parsed.data));
      loadRoom(scene);
      back();
    } catch (err) {
      await alertDialog("불러오기 실패: " + err.message);
    }
  }
  async function onExportData() {
    try {
      const zip = await withBusy("내 데이터 내보내는 중…", () => buildMemberZip());
      const d = /* @__PURE__ */ new Date();
      const p = (n) => String(n).padStart(2, "0");
      const name = `타코야키-내데이터-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}.tkme.zip`;
      downloadBlob(name, new Blob([zip.slice()], { type: "application/zip" }));
    } catch (err) {
      await alertDialog("내보내기 실패: " + err.message);
    }
  }
  async function onImportData(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const u8 = new Uint8Array(await file.arrayBuffer());
      const zip = isMemberZip(u8);
      let raw = null;
      if (!zip) {
        try {
          raw = JSON.parse(new TextDecoder().decode(u8));
        } catch {
          raw = null;
        }
      }
      const m = zip ? await withBusy("백업 파일 읽는 중…", async () => parseMemberZip(u8)) : parseMemberFile(raw);
      if (m.ok) {
        const ok = await confirmDialog({
          title: "내 데이터를 불러올까요?",
          message: "이 PC 의 설정을 덮어쓰고 새로고침합니다. 되돌릴 수 없습니다.\n게시글·세션방은 지금 로그인한 계정으로 복원됩니다.",
          okText: "불러오기",
          tone: "danger"
        });
        if (!ok) return;
        const r = await withBusy("내 데이터 적용 중…", () => applyMemberFile(m.data));
        const note = r.serverSkipped ? "\n(게시글·세션로그·세션방은 멤버 승인 후 다시 불러오면 복원됩니다.)" : "";
        await alertDialog(`복원 완료. 게시글 ${r.posts}개 · 세션로그 ${r.sessionlogs}개 · 세션방 ${r.rooms}개. 새로고침합니다.${note}`);
        window.location.reload();
        return;
      }
      const s = parseSettingsFile(raw);
      if (s.ok) {
        const ok = await confirmDialog({
          title: "설정을 불러올까요?",
          message: "이 PC 의 설정을 파일 내용으로 모두 덮어씁니다.\n되돌릴 수 없으며 적용 후 새로고침됩니다.",
          okText: "불러오기",
          tone: "danger"
        });
        if (!ok) return;
        await withBusy("설정 적용 중…", () => applySettingsFile(s.data));
        window.location.reload();
        return;
      }
      await alertDialog(m.error);
    } catch (err) {
      await alertDialog("불러오기 실패: " + err.message + "\n기존 설정은 그대로 유지됩니다.");
    }
  }
  async function onDeleteAccount() {
    if (!delPw || deleting) return;
    const ok = await confirmDialog({
      title: "계정을 정말 탈퇴할까요?",
      message: "내 계정·캐릭터·DM·세션방이 모두 영구 삭제됩니다.\n되돌릴 수 없습니다.",
      okText: "탈퇴",
      tone: "danger"
    });
    if (!ok) return;
    setDeleting(true);
    const r = await deleteAccount(delPw);
    setDeleting(false);
    setDelPw("");
    if (r.ok) {
      await alertDialog("계정이 삭제되었습니다. 이용해 주셔서 감사합니다.");
      hardReset();
    } else {
      await alertDialog(r.error || "탈퇴에 실패했습니다.");
    }
  }
  async function onChangePassword() {
    if (pwBusy) return;
    if (pwNew.length < 4) {
      await alertDialog("새 비밀번호는 4자 이상이어야 합니다.");
      return;
    }
    if (pwNew !== pwNew2) {
      await alertDialog("새 비밀번호가 서로 다릅니다. 다시 입력해 주세요.");
      return;
    }
    setPwBusy(true);
    const r = await changePassword(pwCur, pwNew);
    setPwBusy(false);
    if (r.ok) {
      setPwCur("");
      setPwNew("");
      setPwNew2("");
      await alertDialog("비밀번호를 바꿨습니다. 다른 기기에서 로그인돼 있었다면 로그아웃됩니다.");
    } else {
      await alertDialog(r.error || "비밀번호를 바꾸지 못했습니다.");
    }
  }
  function pickSfx(key) {
    sfxTarget.current = key;
    sfxInput.current?.click();
  }
  async function onPickSfx(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const key = sfxTarget.current;
    sfxTarget.current = null;
    if (!file || !key) return;
    if (file.size > 1024 * 1024) {
      await alertDialog("1MB 이하의 짧은 효과음 파일을 사용하세요.");
      return;
    }
    try {
      const url = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(new Error("파일을 읽지 못했습니다."));
        r.readAsDataURL(file);
      });
      setSfxCustom(key, url);
      playSfx(key);
    } catch (err) {
      await alertDialog("불러오기 실패: " + err.message);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "snav", children: [
      Object.keys(paneTitle).filter((p) => p !== "admin" || isAdmin).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: pane === p ? "on" : "", onClick: () => setPane(p), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: paneIcon[p], size: 18 }),
        " ",
        paneTitle[p]
      ] }, p)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: back, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_back", size: 16 }),
        " ",
        inRoom ? "방으로" : "로비로"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "spane", children: [
      pane === "theme" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "테마" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "모드" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "theme-card" + (theme === "dark" ? " on" : ""), onClick: () => setTheme("dark"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prev", style: { background: "linear-gradient(135deg,#070707,#222222)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "dark_mode", size: 16 }),
              " 다크"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "theme-card" + (theme === "light" ? " on" : ""), onClick: () => setTheme("light"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prev", style: { background: "linear-gradient(135deg,#eef1f7,#fff)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "light_mode", size: 16 }),
              " 라이트"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "강조색" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { alignItems: "center", gap: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "color",
              value: uiAccent || accents.find((a) => a.id === accent)?.color || "#7c9cff",
              onChange: (e) => setUiAccent(e.target.value),
              title: "강조색 직접 지정",
              style: { width: 46, height: 32, padding: 0, border: 0, background: "none", cursor: "pointer" }
            }
          ),
          uiAccent && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: () => setUiAccent(""), children: "기본값" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "UI 크기" }),
        isMobileView && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hint", children: "UI 크기는 PC 에서만 적용돼요." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { alignItems: "center", gap: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 85,
              max: 130,
              step: 5,
              value: scaleDraft ?? Math.round(uiScale * 100),
              onChange: (e) => setScaleDraft(Number(e.target.value)),
              onPointerUp: () => {
                if (scaleDraft != null) {
                  setUiScale(scaleDraft / 100);
                  setScaleDraft(null);
                }
              },
              onKeyUp: () => {
                if (scaleDraft != null) {
                  setUiScale(scaleDraft / 100);
                  setScaleDraft(null);
                }
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
            scaleDraft ?? Math.round(uiScale * 100),
            "%"
          ] }),
          (scaleDraft ?? Math.round(uiScale * 100)) !== 100 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn sm",
              onClick: () => {
                setUiScale(1);
                setScaleDraft(null);
              },
              children: "기본값"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "폰트" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { alignItems: "center", gap: 14, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
            "본문",
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input sm", value: bodyFont, onChange: (e) => setBodyFont(e.target.value), style: { width: "auto" }, children: Object.entries(FONT_STACKS).map(([k, f]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: k, children: f.label }, k)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
            "헤더",
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input sm", value: headingFont, onChange: (e) => setHeadingFont(e.target.value), style: { width: "auto" }, children: Object.entries(FONT_STACKS).map(([k, f]) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: k, children: f.label }, k)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "채팅 Enter 키" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opt", style: { alignItems: "center", gap: 14, flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
          "Enter 를 누르면",
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "input sm",
              value: enterToSend,
              onChange: (e) => setEnterToSend(e.target.value),
              style: { width: "auto" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "auto", children: "기기에 맞춤 (휴대폰=줄바꿈, PC=전송)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "send", children: "항상 전송 (휴대폰에 키보드를 붙여 쓸 때)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "newline", children: "항상 줄바꿈" })
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "괄호 행동지문" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opt", style: { alignItems: "center", gap: 14, flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: chatDimParens, onChange: (e) => setChatDimParens(e.target.checked) }),
          "(괄호) 안을 옅은 기울임으로 보이기"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shint", children: "끄면 괄호를 그냥 괄호로 씁니다. 내 화면에만 적용됩니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opt", style: { alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 10 }, children: inRoom && isGM ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { color: roomDimColor || void 0, opacity: roomDimColor ? 1 : 0.82 }, children: "(행동 지문)" }),
            " 색"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "color",
              value: roomDimColor || "#9aa3b8",
              onChange: (e) => setRoomDimColor(e.target.value),
              title: "(괄호) 지문 색 고르기",
              style: { width: 46, height: 32, padding: 0, border: 0, background: "none", cursor: "pointer" }
            }
          ),
          roomDimColor && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: () => setRoomDimColor(void 0), title: "기본색(글자색)으로", children: "기본으로" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", style: { background: "color-mix(in srgb, var(--accent) 16%, transparent)" }, children: "방 전체" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "info", size: 13 }),
          " 지문 색은 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "방에 GM으로 들어와 있을 때" }),
          " 정할 수 있습니다."
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shint", children: "위 ‘옅은 기울임’은 내 화면 설정, 이 색은 방 설정입니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "비주얼 노벨 무대" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opt", style: { alignItems: "center", gap: 14, flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
          "동시에 세울 사람",
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "input sm",
              value: vnCastMax,
              onChange: (e) => setVnCastMax(Number(e.target.value)),
              style: { width: "auto" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 1, children: "1명 (말한 사람만)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 2, children: "2명" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 3, children: "3명" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 4, children: "4명" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: 5, children: "5명" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "최근에 말한 사람부터 이 인원까지 무대에 남습니다.", label: "동시에 세울 사람 설명" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { alignItems: "center", gap: 12, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "muted small",
              style: { display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_size", size: 14 }),
                " 대사창 글자 크기",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  HintTip,
                  {
                    text: "나에게만 적용됩니다. 직접 지정한 부분([size=…])은 그대로 둡니다.",
                    label: "대사창 글자 크기 설명"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "range",
              min: 80,
              max: 180,
              step: 5,
              value: Math.round(vnFontScale * 100),
              onChange: (e) => setVnFontScale(Number(e.target.value) / 100),
              style: { flex: "1 1 140px", minWidth: 110 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { minWidth: 38, textAlign: "right" }, children: [
            Math.round(vnFontScale * 100),
            "%"
          ] }),
          Math.round(vnFontScale * 100) !== 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: () => setVnFontScale(1), children: "기본값" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "상태 변화 기록" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toggle" + (statLog ? "" : " off"), onClick: () => toggleStatLog() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: statLog ? "기록 켜짐" : "기록 꺼짐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "시트에서 체력·마력·이성을 고치면 방 전체가 보는 기록에 한 줄 남습니다. 비밀 모드가 켜져 있으면 그 줄은 GM과 본인만 봅니다." })
        ] })
      ] }),
      pane === "lobby" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "로비" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "플레이시간" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "shint", children: [
          "지금까지 약 ",
          Math.floor(lobbyPlayMs / 36e5),
          "시간 함께했어요. (세션에 머문 시간 합 · 1시간 미만은 0)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn",
            onClick: () => {
              void (async () => {
                if (await confirmDialog("플레이시간을 0으로 초기화할까요?")) useLobbyStore.getState().resetPlaytime();
              })();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "schedule", size: 15 }),
              " 플레이시간 초기화"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "남에게 보이는 로비" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shint", children: "꾸민 내용은 몇 초 뒤 저절로 반영됩니다." }),
        account && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "shint", style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: lobbyStamp === null ? "서버 사본을 확인하는 중입니다." : lobbyStamp.status === "ok" ? "마지막 발행: " + fmtStamp(lobbyStamp.updatedAt) : lobbyStamp.status === "none" ? "아직 발행된 적이 없습니다." : "서버 사본을 확인하지 못했습니다. 연결을 확인해 주세요." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", disabled: lobbyStamp === null, onClick: () => void refreshLobbyStamp(), children: "다시 확인" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", disabled: lobbySyncBusy, onClick: () => void pullLobbyNow(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cloud_download", size: 15 }),
            " 서버에서 받아오기"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", disabled: lobbySyncBusy, onClick: () => void pushLobbyNow(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cloud_upload", size: 15 }),
            " 이 기기 것으로 맞추기"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", disabled: lobbySyncBusy, onClick: () => void pullLobbyMusicNow(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "library_music", size: 15 }),
            " 음악만 받아오기"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shint", children: "웹과 프로그램에서 곡 목록이 다를 때 씁니다. 목록이 통째로 바뀝니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "초기화" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shint", children: "로비 꾸밈과 배치(위젯·창 색·메모·캘린더 일정 등)를 모두 기본값으로 되돌립니다. 갤러리·벽지·아이콘·디데이·스티커 그림과 세션 로그는 서버에서도 지워지며 되돌릴 수 없습니다. (플레이시간은 유지)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn",
            onClick: () => {
              void (async () => {
                if (await confirmDialog(
                  "로비 설정을 모두 초기화할까요?\n갤러리·벽지·아이콘·디데이·스티커 그림과 세션 로그가 서버에서도 지워지고, 되돌릴 수 없습니다. (플레이시간은 유지)"
                ))
                  useLobbyStore.getState().reset();
              })();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 15 }),
              " 로비 설정 전체 초기화"
            ]
          }
        )
      ] }),
      pane === "sfx" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "효과음" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "lead", children: [
          "볼륨은 마스터 음량에 곱하는 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "배수" }),
          "입니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 12, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toggle" + (soundOn ? "" : " off"), onClick: () => toggleSound() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: soundOn ? "효과음 켜짐" : "효과음 꺼짐" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toggle" + (notifSoundOn ? "" : " off"), onClick: () => toggleNotifSound() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: notifSoundOn ? "알림 소리 켜짐" : "알림 소리 꺼짐" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "귓속말·DM·로비 알림·백그라운드 새 메시지 알림음", label: "알림 소리 설명" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sfx-list", children: SFX_LIST.map(({ key, label }) => {
          const custom = !!sfxCustom[key];
          const vol = sfxVolume[key] ?? 1;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sfx-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "sfx-nm", children: [
              label,
              custom && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", style: { marginLeft: 6 }, children: "커스텀" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", "data-sfx": "none", title: "미리듣기", onClick: () => playSfx(key, { force: true }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "play_arrow", size: 16 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 0,
                max: 100,
                value: Math.round(vol * 100),
                onChange: (e) => setSfxVolume(key, Number(e.target.value) / 100),
                title: "이 효과음 볼륨 (마스터에 곱해집니다)"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small sfx-vol", children: [
              Math.round(vol * 100),
              "%"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => pickSfx(key), title: "내 사운드 파일 등록 (1MB 이하)", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 13 }),
              " ",
              custom ? "변경" : "파일"
            ] }),
            custom && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "기본 효과음으로 되돌리기", onClick: () => setSfxCustom(key, void 0), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 15 }) })
          ] }, key);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: sfxInput, type: "file", accept: "audio/*", hidden: true, onChange: (e) => void onPickSfx(e) })
      ] }),
      pane === "ruleset" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-pane", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "룰셋" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "lead", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "룰셋 파일(.tkrule.json)" }),
          "을 불러오면 그 룰의 시트·판정 카드를 씁니다. 함께 노는 사람도 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "각자 불러와야" }),
          " 합니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "룰셋 불러오기" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn pri", onClick: () => rulesetFileInput.current?.click(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 15 }),
            " 룰셋 파일 불러오기 (.tkrule.json)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: rulesetFileInput, type: "file", accept: ".json,.tkrule,application/json", hidden: true, onChange: onLoadRulesetFile })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sec-t", children: [
            "판정 카드 문구가 따르는 룰",
            /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "고른 룰의 성공레벨 라벨·상단 문구가 판정 카드에 표시됩니다.", label: "판정 카드 문구 설명" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rule-field", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "input sm", value: activeRulesetId, onChange: (e) => setActiveRuleset(e.target.value), style: { width: "auto" }, children: rulesets.map((rs) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: rs.id, children: rs.name }, rs.id)) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "불러온 룰셋" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rule-list", children: rulesets.filter((rs) => rs.id !== "custom").map((rs) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-li" + (rs.id === activeRulesetId ? " on" : ""), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: rs.kind === "basic" ? "book_ribbon" : "auto_stories", size: 16 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rule-li-name", children: rs.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: rs.external ? "불러옴" : "내장" }),
            rs.id === activeRulesetId && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip acc", children: "활성" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rule-li-actions", children: rs.external && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", title: "이 룰셋을 파일로 내보내기(공유용)", onClick: () => downloadJson(`${rs.id}.tkrule.json`, buildRulesetFile(rs)), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 13 }),
                " 내보내기"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "iconbtn",
                  title: "이 룰셋 제거",
                  onClick: async () => {
                    if (await confirmDialog(`'${rs.name}' 룰셋을 제거할까요?
이 룰로 만든 캐릭터는 다시 불러올 때까지 읽기 전용입니다.`)) {
                      removeRuleset(rs.id);
                    }
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 })
                }
              )
            ] }) })
          ] }, rs.id)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", style: { marginTop: 10 }, children: "새 캐릭터의 시트 종류로 고를 수 있습니다." })
        ] }),
        cocLoaded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "하우스룰 · 크툴루의 부름 7판" }),
          inRoom && isGM ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-field", style: { alignItems: "center" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "toggle" + (roomLuckEnabled ? "" : " off"),
                  onClick: () => setRoomLuckEnabled(!roomLuckEnabled),
                  title: "행운 깎기 사용/끄기"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 700 }, children: [
                "행운 깎기 ",
                roomLuckEnabled ? "사용" : "꺼짐"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", style: { marginTop: 10 }, children: "실패한 판정에서 행운을 깎아 성공으로 바꿉니다(본인만 가능)." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint", children: [
            "‘행운 깎기’는 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "방에 GM으로 들어가야" }),
            " 켜고 끌 수 있어요."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "내 카드 문구 (룰 없이 커스텀)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "muted small", style: { margin: "0 0 10px" }, children: [
            "상단 문구·성공레벨 라벨을 정합니다. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "‘내 카드 문구’" }),
            "를 골라야 적용됩니다.",
            activeRulesetId !== "custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", style: { marginLeft: 8 }, onClick: () => setActiveRuleset("custom"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 12 }),
              " 지금 적용"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { minWidth: 92 }, children: "상단 문구" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input sm",
                value: cardProfile.systemLabel ?? "",
                placeholder: "(비우면 숨김 · 예: 우리 세션)",
                onChange: (e) => setCardProfile({ systemLabel: e.target.value }),
                style: { flex: 1, minWidth: 180 }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-field", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { minWidth: 92 }, children: "판정 주사위" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input sm",
                value: cardProfile.check?.dice ?? "",
                placeholder: "(비우면 1d100 · 예: 2d6)",
                onChange: (e) => setCardProfile({ check: { ...cardProfile.check, dice: e.target.value.trim() || void 0 } }),
                style: { width: 150 }
              }
            ),
            !!cardProfile.check?.dice && !isRollableDice(cardProfile.check.dice) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { color: "var(--danger, #d66)" }, children: "굴릴 수 없는 식입니다. 1d100 으로 굴러갑니다" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: 10 }, children: "성공 방향" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "input sm",
                value: cardProfile.check?.compare ?? "lte",
                onChange: (e) => setCardProfile({ check: { ...cardProfile.check, compare: e.target.value } }),
                style: { width: 130 },
                title: "카드에 적히는 표기(≤ / ≥)",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "lte", children: "목표 이하가 성공" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gte", children: "목표 이상이 성공" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "muted small", style: { margin: "0 0 8px" }, children: [
            "예) 2d6 으로 목표치 이상이 성공인 룰이라면, 판정 주사위 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "2d6" }),
            " · 성공 방향 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "목표 이상" }),
            "으로 두고 아래 표에서 단계마다 조건을 고릅니다."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-trow rule-thead", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "한글 라벨" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "영문" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "조건(어떤 출목)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "값" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
            ] }),
            (cardProfile.levels ?? []).map((l) => {
              const th = l.threshold;
              const tType = th?.rel ? th.rel === "gte" ? "gte" : th.rel === "lt" ? "lt" : th.rel === "gt" ? "fail" : "divOne" : th?.fail ? "fail" : th?.atLeast != null ? "atLeast" : th?.atMost != null ? "atMost" : th?.div === 1 ? "divOne" : th?.div != null ? "div" : "divOne";
              const tNum = th?.atMost ?? th?.atLeast ?? (th?.div && th.div !== 1 ? th.div : 5);
              const upd = (patch) => setCardProfile({ levels: (cardProfile.levels ?? []).map((x) => x.id === l.id ? { ...x, ...patch } : x) });
              const setType = (t) => {
                const n = tNum || 1;
                upd({
                  threshold: t === "fail" ? { fail: true } : t === "atLeast" ? { atLeast: n } : t === "atMost" ? { atMost: n } : t === "div" ? { div: n } : t === "gte" ? { rel: "gte", div: 1 } : t === "lt" ? { rel: "lt", div: 1 } : { div: 1 }
                });
              };
              const setNum = (n) => {
                upd({ threshold: tType === "atLeast" ? { atLeast: n } : tType === "atMost" ? { atMost: n } : tType === "div" ? { div: Math.max(1, n) } : th });
              };
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-trow", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: l.ko, placeholder: "한글", onChange: (e) => upd({ ko: e.target.value }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: l.word ?? "", placeholder: "ENG", onChange: (e) => upd({ word: e.target.value, script: e.target.value }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input sm", value: tType, onChange: (e) => setType(e.target.value), title: "이 단계가 되는 출목 조건", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "atMost", children: "출목 N 이하" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "div", children: "목표 1/N 이하" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "divOne", children: "목표 이하" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "fail", children: "목표 초과(실패)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gte", children: "목표 이상" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "lt", children: "목표 미만" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "atLeast", children: "출목 N 이상" })
                ] }),
                tType === "atMost" || tType === "div" || tType === "atLeast" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "input sm",
                    type: "number",
                    value: tNum,
                    onChange: (e) => setNum(parseInt(e.target.value, 10) || 0),
                    title: tType === "div" ? "분모 N (목표치의 1/N 이하)" : "출목 N"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "이 단계 삭제", onClick: () => setCardProfile({ levels: (cardProfile.levels ?? []).filter((x) => x.id !== l.id) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }) })
              ] }, l.id);
            })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rule-table-actions", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn sm",
                onClick: () => setCardProfile({ levels: [...cardProfile.levels ?? [], { id: "lv" + Date.now().toString(36), ko: "단계", word: "", script: "", threshold: { div: 1 } }] }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 13 }),
                  " 단계 추가"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => setCardProfile(DEFAULT_CARD_PROFILE), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 13 }),
              " 기본값"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint", style: { marginTop: 10 }, children: [
            "목표값 판정(예: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "CC<=50" }),
            ")에만 단계 라벨이 붙습니다. 조건은 위부터 차례로 봅니다."
          ] })
        ] })
      ] }),
      pane === "room" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "방 · 권한" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "lead", children: [
          "현재 방의 장면을 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: ".orpg" }),
          " 파일로 저장하고 불러옵니다. 채팅 로그는 빠집니다."
        ] }),
        inRoom && isGM ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "방 저장 · 불러오기 (.orpg)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { gap: 10, flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn pri", onClick: () => void saveRoom(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 15 }),
              " 방 저장 (.orpg 내보내기)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", "data-sfx": "button", onClick: () => roomFileInput.current?.click(), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 15 }),
              " 방 불러오기 (.orpg 가져오기)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: roomFileInput, type: "file", accept: ".orpg,application/json", hidden: true, onChange: onLoadRoomFile })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", children: "불러오면 지금 장면을 덮어쓰고 전원에게 반영됩니다. 되돌릴 수 없으니 먼저 저장하세요." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint", style: { marginTop: 8 }, children: [
            "‘행운 깎기’ 같은 하우스룰은 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "룰셋" }),
            " 탭에 있습니다."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", style: { marginTop: 22 }, children: "대화 열람" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { gap: 10, alignItems: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "toggle" + (roomGmSeeWhispers ? "" : " off"),
                onClick: () => setRoomGmSeeWhispers(!roomGmSeeWhispers),
                title: "참가자끼리 주고받는 귓속말을 GM도 보기"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 700 }, children: [
              "귓속말 열람 ",
              roomGmSeeWhispers ? "켜짐" : "꺼짐"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint", children: [
            "켜면 참가자끼리 주고받는 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "1:1 귓속말" }),
            "이 GM에게도 보입니다.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: " 켠 뒤에 오간 말만" }),
            " 열리고 지난 대화는 그대로 잠겨 있습니다."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint", style: { marginTop: 6 }, children: [
            "참가자에게는 귓속말 입력칸에 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "‘GM도 봅니다’" }),
            " 표시가 떠서, 몰래 보는 일은 생기지 않습니다."
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", children: "방에 GM으로 입장해야 저장·불러오기를 할 수 있습니다." })
      ] }),
      pane === "lib" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LibraryPanelBody, { embedded: true }) }) }),
      pane === "expansion" && !extAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "확장팩" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "lead", children: "이 브라우저에서는 확장팩을 둘 곳이 없어요(비공개 창 등). 일반 창에서 다시 열어 주세요." })
      ] }),
      pane === "expansion" && extAvailable && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "확장팩" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "lead", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "불러오면" }),
          " 바탕화면과 세션 방에 아이콘과 창이 나타나고 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "내리면" }),
          " 사라집니다. 서버에 저장된 방·캐릭터는 그대로입니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "확장팩 파일 열기" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn pri", disabled: extBusy === "__file__", onClick: () => void onOpenExtFile(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "folder_open", size: 15 }),
          " ",
          extBusy === "__file__" ? "설치 중…" : "확장팩 파일 열기 (.tkext)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: extFileInput, type: "file", accept: ".tkext,application/zip", hidden: true, onChange: (e) => void onPickExtFile(e) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "설치된 확장팩" }),
        exts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", children: "불러올 수 있는 확장팩이 없습니다." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ext-list", children: exts.map((m) => {
          const loaded = m.enabled && !!m.activatedByUser;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ext-card" + (loaded ? " on" : ""), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ext-ic", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "deployed_code", size: 22 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ext-meta", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: m.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
                "버전 ",
                m.version,
                " · ",
                loaded ? "불러옴" : "내려짐"
              ] }),
              extIssues[m.id] && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ext-issue", children: extIssues[m.id].message })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn" + (loaded ? "" : " pri"),
                disabled: extBusy === m.id,
                onClick: () => void toggleExt(m, !loaded),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: loaded ? "logout" : "download", size: 15 }),
                  " ",
                  extBusy === m.id ? "처리 중…" : loaded ? "내리기" : "불러오기"
                ]
              }
            ),
            m.installedAt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn danger sm",
                title: isElectron() ? "이 PC 에서 완전히 삭제(설치 파일 제거)" : "이 브라우저에서 완전히 삭제",
                disabled: extBusy === m.id,
                onClick: () => void onDeleteExt(m),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }),
                  " 삭제"
                ]
              }
            )
          ] }, m.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hint", style: { marginTop: 12 }, children: [
          isElectron() ? "이 PC 에서만" : "이 브라우저에서만",
          " 켜지고 꺼집니다. 함께 노는 사람도 각자 불러와야 합니다.",
          unavailableNote() && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 4 }, children: unavailableNote() })
        ] })
      ] }),
      pane === "account" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "계정 · 데이터" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "로비 공개 범위" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { gap: 10, alignItems: "center" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "toggle" + (account?.lobbyPrivate ? "" : " off"),
              onClick: () => {
                if (privacyBusy || !account) return;
                setPrivacyBusy(true);
                void updateProfile({ lobbyPrivate: !account.lobbyPrivate }).finally(() => setPrivacyBusy(false));
              },
              title: "내 로비를 친구에게만 열기"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 700 }, children: [
            "로비 비공개 ",
            account?.lobbyPrivate ? "켜짐 (친구만)" : "꺼짐 (전체 공개)"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "shint", children: [
          "켜면 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "친구만" }),
          " 내 로비에 들어올 수 있습니다. 블로그·세션 로그·방명록·마이룸도 함께 닫히고, 친구를 끊으면 바로 막힙니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shint", children: "프로필(이름·사진·소개)과 친구 신청은 그대로 열려 있습니다. 서버 관리자는 언제든 들어올 수 있습니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", style: { marginTop: 22 }, children: "내 데이터 내보내기 · 불러오기" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "shint", children: [
          "이 PC 의 모든 설정을 이미지·소리까지 한 파일로 저장하고 복원합니다.",
          !isGuest && " 게시글·세션방도 담깁니다."
        ] }),
        !isGuest && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "shint", children: [
          "옮길 서버에 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "가입·로그인한 뒤" }),
          " 불러오면 게시글·세션방이 복원됩니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { gap: 10, flexWrap: "wrap", marginTop: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn pri", onClick: () => void onExportData(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 15 }),
            " 내 데이터 내보내기"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => dataFileInput.current?.click(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 15 }),
            " 내 데이터 불러오기"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: dataFileInput,
              type: "file",
              accept: ".zip,.tkme,.tkbox,.json,application/zip,application/json",
              hidden: true,
              onChange: (e) => void onImportData(e)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", style: { marginTop: 8 }, children: "불러오면 현재 설정을 전부 덮어쓰고 새로고침합니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", children: "비밀번호 변경" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "shint", children: "바꾸면 다른 기기의 로그인이 모두 풀립니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              className: "input sm",
              placeholder: "현재 비밀번호",
              value: pwCur,
              autoComplete: "current-password",
              onChange: (e) => setPwCur(e.target.value),
              style: { width: 170 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              className: "input sm",
              placeholder: "새 비밀번호 (4자 이상)",
              value: pwNew,
              autoComplete: "new-password",
              onChange: (e) => setPwNew(e.target.value),
              style: { width: 190 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              className: "input sm",
              placeholder: "새 비밀번호 확인",
              value: pwNew2,
              autoComplete: "new-password",
              onChange: (e) => setPwNew2(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") void onChangePassword();
              },
              style: { width: 170 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn",
              disabled: !pwCur || !pwNew || !pwNew2 || pwBusy,
              onClick: () => void onChangePassword(),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock_reset", size: 15 }),
                " ",
                pwBusy ? "바꾸는 중…" : "비밀번호 변경"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sec-t", style: { color: "var(--danger, #e05a5a)" }, children: "계정 탈퇴" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "shint", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: account?.nickname || account?.username || "내" }),
          " 계정·캐릭터·DM·세션방이 모두 삭제됩니다. 되돌릴 수 없습니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "opt", style: { gap: 8, alignItems: "center", flexWrap: "wrap", marginTop: 6 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "password",
              className: "input sm",
              placeholder: "비밀번호 확인",
              value: delPw,
              autoComplete: "current-password",
              onChange: (e) => setDelPw(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && delPw) void onDeleteAccount();
              },
              style: { width: 200 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn danger", disabled: !delPw || deleting, onClick: () => void onDeleteAccount(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person_remove", size: 15 }),
            " ",
            deleting ? "탈퇴 처리 중…" : "계정 탈퇴"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hint", style: { marginTop: 8 }, children: "이 서버의 내 데이터만 지웁니다. 이 PC 의 설정은 남습니다." })
      ] }),
      pane === "admin" && isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(ServerAdmin, {})
    ] })
  ] });
}
export {
  Settings as default
};
