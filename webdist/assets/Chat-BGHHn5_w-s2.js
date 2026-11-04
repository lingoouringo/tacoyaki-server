const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/popout-y3WmKa7H-s2.js","assets/index-DLwZOjxA-s2.js","assets/index-CJPXaEyi.css","assets/LibraryPanel-B-GUUgdq-s2.js","assets/image-CJqz1FOB.js","assets/FloatingWindow-CgcsEYUd-s2.js","assets/ProfilePanel-CcI09IwL-s2.js","assets/profileTheme-DACDRQUP.js","assets/FriendWindow-ecntrbhD-s2.js","assets/netImage-q1HBfP67-s2.js","assets/externalizeLogImages-BUW88OBY-s2.js","assets/sessionlogsServer-DDlJpFpY-s2.js"])))=>i.map(i=>d[i]);
import { aF as uploadAssetsDeep, N as getServerUrl, O as getAuthToken, aE as hydrateAssetsDeep, aB as useBgmStore, G as useNetStore, r as reactExports, bO as visibleTracks, j as jsxRuntimeExports, I as Icon, bP as MAX_BGM_TRACKS, R as HintTip, bQ as DEFAULT_TRACK_VOLUME, S as promptText, s as confirmDialog, d as useUIStore, aD as withBusy, U as alertDialog, Y as replaceAllTracks, u as useAuthStore, b as useLobbyStore, bR as expansionProfileActions, b5 as useExpansionRegistry, a as useDmStore, e as useFriendStore, g as fetchHome, bL as activeHeadshot, bS as parseMarkup, bs as isAssetRef, M as resolveAssetUrl, bT as safeImgUrl, bU as safeColor, bV as safeSize, bW as safeCssDecls, aC as useHandoutStore, bX as markupToHtml, bY as htmlToMarkup, bb as effectiveUiScale, bZ as useDeckStore, b_ as countDeckCards, b$ as blankDeckCard, c0 as deriveBuildAndDB, v as beginPanelDrag, c1 as SHEET_PRESETS, c2 as DEFAULT_SHEET_THEME, C as ColorField, aT as useCharacterStore, aU as activeCharacter, ac as useRulesetStore, c3 as resolveRuleset, c4 as rsCharacteristics, c5 as rsMadness, c6 as computeSheetVars, V as useChatStore, c7 as deriveStats, c8 as MAX_STANDINGS, c9 as charEdits, ca as coerceImportedCharacter, cb as rollCheck, cc as customRollOpts, cd as deriveSanMax, ce as rollSan, cf as sheetRollTarget, cg as rollSum, ch as sheetBagOf, ci as sheetCells, cj as sheetRows, ck as sheetGauge, cl as sheetNum, cm as sheetText, cn as findSheetField, co as characterSheetKind, ad as allRulesets, Q as create, cp as persist, cq as activeRuleset, cr as SUCCESS_LABEL, cs as EMPTY_FMT, ct as fmtActive, cu as applyFormatting, cv as reviveImeFocus, H as uploadAsset, cw as reactDomExports, bD as activeStanding, K as tabKeyOf, cx as register, cy as RUNTIME_CHAT_LIMIT, cz as isLiveRoll, cA as COMPOSE_H_DEFAULT, A as playSfx, z as enterSendsMessage, cB as touch, cC as COMPOSE_H_MIN, cD as COMPOSE_H_MAX, i as isMobile, _ as __vitePreload, cE as loadOlderChat, cF as loadOlderLocalChat, cG as findStandingByCommand, cH as extractPrompts, cI as expandMacro, T as confirmDismissDialog } from "./index-DLwZOjxA-s2.js";
import { F as FloatingWindow } from "./FloatingWindow-CgcsEYUd-s2.js";
import { presenceLabel } from "./FriendWindow-ecntrbhD-s2.js";
import { r as resolveTheme } from "./profileTheme-DACDRQUP.js";
import { L as LibraryPanel } from "./LibraryPanel-B-GUUgdq-s2.js";
import { j as fileToHandoutImage, l as fileToPortraitHeadshot, m as fileToPortraitStanding, b as fileToChatImage } from "./image-CJqz1FOB.js";
import { e as externalImageFetcher, i as inChatExportScope, f as filterForPdf, b as inChosenTabs, c as buildChatLogDoc, d as downloadHtml, g as downloadText, h as copyToClipboard, j as buildChatEmbedHtml } from "./netImage-q1HBfP67-s2.js";
async function publishBgmLibrary(tracks, opts) {
  try {
    const payload = await uploadAssetsDeep({ tracks });
    const failed = payload.tracks.filter((t) => t.kind === "file" && t.src.startsWith("data:"));
    if (failed.length > 0 && failed.length === payload.tracks.length) return false;
    const res = await fetch(getServerUrl() + "/bgm/library", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: getAuthToken(), tracks: payload.tracks, explicitEmpty: !!opts?.explicitEmpty })
    });
    if (!res.ok) return false;
    const r = await res.json();
    return !!r.ok;
  } catch {
    return false;
  }
}
async function fetchBgmLibrary() {
  try {
    const res = await fetch(getServerUrl() + "/bgm/library", {
      headers: { authorization: "Bearer " + getAuthToken() }
    });
    if (!res.ok) return null;
    const r = await res.json();
    if (!r.ok || !Array.isArray(r.tracks)) return null;
    const hydrated = await hydrateAssetsDeep({ tracks: r.tracks });
    return hydrated.tracks;
  } catch {
    return null;
  }
}
function fmtSize(n) {
  if (!n) return "";
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
function fmtTime$1(sec) {
  const t = Number.isFinite(sec) && sec > 0 ? sec : 0;
  const s = Math.floor(t % 60);
  const m = Math.floor(t / 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
function TrackSeekBar({ trackId, canSeek }) {
  const p = useBgmStore((s) => s.progress[trackId]);
  const requestSeek = useBgmStore((s) => s.requestSeek);
  const [drag, setDrag] = reactExports.useState(null);
  const duration = p?.duration ?? 0;
  const position = drag ?? p?.position ?? 0;
  const seekable = canSeek && duration > 0;
  const max = Math.max(1, Math.floor(duration));
  const commit = (v) => {
    requestSeek(trackId, v);
    setDrag(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgm-seek", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bgm-time", children: fmtTime$1(position) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "bgm-seekbar",
        type: "range",
        min: 0,
        max,
        step: 1,
        value: Math.min(Math.floor(position), max),
        disabled: !seekable,
        onChange: (e) => setDrag(Number(e.target.value)),
        onPointerUp: (e) => commit(Number(e.target.value)),
        onKeyUp: (e) => commit(Number(e.target.value)),
        title: canSeek ? "재생 위치 이동(GM)" : "재생 위치",
        "aria-label": "재생 위치"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bgm-time", children: duration > 0 ? fmtTime$1(duration) : "--:--" })
  ] });
}
function PersonalSound() {
  const bgmVolume = useUIStore((s) => s.bgmVolume);
  const bgmMuted = useUIStore((s) => s.bgmMuted);
  const setBgmVolume = useUIStore((s) => s.setBgmVolume);
  const toggleBgmMuted = useUIStore((s) => s.toggleBgmMuted);
  const soundOn = useUIStore((s) => s.soundOn);
  const volume = useUIStore((s) => s.volume);
  const toggleSound = useUIStore((s) => s.toggleSound);
  const setVolume = useUIStore((s) => s.setVolume);
  const cardVolume = useUIStore((s) => s.cardVolume);
  const cardMuted = useUIStore((s) => s.cardMuted);
  const setCardVolume = useUIStore((s) => s.setCardVolume);
  const toggleCardMuted = useUIStore((s) => s.toggleCardMuted);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgm-personal", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgm-personal-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "iconbtn",
          title: bgmMuted ? "BGM 음소거 해제" : "BGM 음소거",
          onClick: () => toggleBgmMuted(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: bgmMuted ? "volume_off" : "volume_up", size: 18 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bgm-personal-lbl", children: "배경음악" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "bgm-vol",
          type: "range",
          min: 0,
          max: 100,
          value: Math.round(bgmVolume * 100),
          onChange: (e) => setBgmVolume(Number(e.target.value) / 100),
          title: "내 BGM 마스터 볼륨(개인)",
          style: { flex: 1 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { width: 34, textAlign: "right" }, children: [
        Math.round(bgmVolume * 100),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgm-personal-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "iconbtn",
          title: soundOn ? "효과음 끄기" : "효과음 켜기",
          onClick: () => toggleSound(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: soundOn ? "notifications_active" : "notifications_off", size: 18 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bgm-personal-lbl", children: "효과음" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "bgm-vol",
          type: "range",
          min: 0,
          max: 100,
          value: Math.round(volume * 100),
          onChange: (e) => setVolume(Number(e.target.value) / 100),
          disabled: !soundOn,
          title: "내 효과음 볼륨(개인)",
          style: { flex: 1, opacity: soundOn ? 1 : 0.5 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { width: 34, textAlign: "right" }, children: [
        Math.round(volume * 100),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgm-personal-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "iconbtn",
          title: cardMuted ? "연출 음향 음소거 해제" : "연출 음향 음소거",
          onClick: () => toggleCardMuted(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: cardMuted ? "volume_off" : "movie", size: 18 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bgm-personal-lbl", children: "연출" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "bgm-vol",
          type: "range",
          min: 0,
          max: 100,
          value: Math.round(cardVolume * 100),
          onChange: (e) => setCardVolume(Number(e.target.value) / 100),
          title: "비주얼 카드 음향 볼륨(개인)",
          style: { flex: 1 }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { width: 34, textAlign: "right" }, children: [
        Math.round(cardVolume * 100),
        "%"
      ] })
    ] })
  ] });
}
function YtNotice() {
  const ytError = useBgmStore((s) => s.ytError);
  const setYtError = useBgmStore((s) => s.setYtError);
  if (!ytError) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 10px",
        borderRadius: 8,
        background: "color-mix(in srgb, var(--danger, #ef6f8e) 14%, transparent)",
        border: "1px solid color-mix(in srgb, var(--danger, #ef6f8e) 45%, transparent)",
        fontSize: 12,
        lineHeight: 1.45
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "error", size: 16, style: { flex: "none" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1 }, children: ytError }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "닫기", onClick: () => setYtError(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 }) })
      ]
    }
  );
}
function BgmPanel({ onClose }) {
  const library = useBgmStore((s) => s.library);
  const busy = useBgmStore((s) => s.busy);
  const tracks = useBgmStore((s) => s.tracks);
  const syncToRoom = useBgmStore((s) => s.syncToRoom);
  const load = useBgmStore((s) => s.load);
  const addFiles = useBgmStore((s) => s.addFiles);
  const addYouTube = useBgmStore((s) => s.addYouTube);
  const removeTrack = useBgmStore((s) => s.removeTrack);
  const renameTrack = useBgmStore((s) => s.renameTrack);
  const swapTracks = useBgmStore((s) => s.swapTracks);
  const claimTrack = useBgmStore((s) => s.claimTrack);
  const playTrack = useBgmStore((s) => s.playTrack);
  const toggleTrackPlay = useBgmStore((s) => s.toggleTrackPlay);
  const setTrackLoop = useBgmStore((s) => s.setTrackLoop);
  const setLibraryVolume = useBgmStore((s) => s.setLibraryVolume);
  const stopTrack = useBgmStore((s) => s.stopTrack);
  const stopAll = useBgmStore((s) => s.stopAll);
  const setSyncToRoom = useBgmStore((s) => s.setSyncToRoom);
  const isGM = useNetStore((s) => s.self?.role === "GM");
  const roomId = useNetStore((s) => s.roomId);
  const fileRef = reactExports.useRef(null);
  const [ytUrl, setYtUrl] = reactExports.useState("");
  const [showAll, setShowAll] = reactExports.useState(false);
  const [libSync, setLibSync] = reactExports.useState(false);
  const [libBusy, setLibBusy] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isGM) void load();
  }, [isGM, load]);
  async function pushLibrary() {
    const lib = useBgmStore.getState().library;
    if (!await confirmDialog({
      title: "이 기기 목록 올리기",
      message: `음원 ${lib.length}곡을 보관함에 올립니다.
서버 목록은 이 기기 것으로 덮어씁니다.`,
      okText: "올리기"
    }))
      return;
    setLibBusy(true);
    const ok = await publishBgmLibrary(
      lib.map(({ id: _id, ...rest }) => rest),
      { explicitEmpty: true }
    ).catch(() => false);
    const saved = ok ? await fetchBgmLibrary().catch(() => null) : null;
    setLibBusy(false);
    await alertDialog(
      ok ? {
        title: "올렸습니다",
        message: saved && saved.length < lib.length ? `${lib.length}곡 중 ${saved.length}곡만 담겼습니다(용량 한도).
「받아오기」 하면 담긴 곡만 옵니다.` : "다른 기기에서 「받아오기」를 누르면 같은 목록이 됩니다."
      } : { title: "올리지 못했습니다", message: "서버가 받지 않았습니다. 연결을 확인하고 잠시 뒤 다시 눌러 주세요." }
    );
  }
  async function pullLibrary() {
    if (!await confirmDialog({
      title: "받아오기",
      message: "이 기기 목록을 보관함 것으로 덮어씁니다.\n여기에만 있는 곡은 먼저 올려 두세요.",
      okText: "받아오기"
    }))
      return;
    setLibBusy(true);
    const got = await fetchBgmLibrary().catch(() => null);
    if (!got || got.length === 0) {
      setLibBusy(false);
      await alertDialog(
        got ? { title: "받아올 것이 없습니다", message: "보관함에 올려 둔 음원이 없습니다." } : { title: "받아오지 못했습니다", message: "서버에서 가져오지 못했습니다. 연결을 확인해 주세요." }
      );
      return;
    }
    const usable = got.filter((t) => t.kind === "youtube" || t.src.startsWith("data:"));
    if (usable.length < got.length) {
      setLibBusy(false);
      await alertDialog({
        title: "받아오지 못했습니다",
        message: `보관함 ${got.length}곡 중 ${got.length - usable.length}곡을 받지 못했습니다.
목록은 그대로입니다. 잠시 뒤 다시 시도해 주세요.`
      });
      return;
    }
    const playing = useBgmStore.getState().tracks;
    const taken = /* @__PURE__ */ new Set();
    const keyOf = (kind, src) => kind + "\0" + src;
    const byKey = /* @__PURE__ */ new Map();
    for (const p of playing) {
      const lib = useBgmStore.getState().library.find((x) => x.id === p.trackId);
      if (lib) byKey.set(keyOf(lib.kind, lib.src), p.trackId);
    }
    const now = Date.now();
    const next = usable.map((t, i) => {
      const reuse = byKey.get(keyOf(t.kind, t.src));
      if (reuse && !taken.has(reuse)) {
        taken.add(reuse);
        return { ...t, id: reuse };
      }
      return { ...t, id: "bg" + now.toString(36) + i.toString(36) };
    });
    await replaceAllTracks(next).catch(() => {
    });
    for (const p of playing) if (!taken.has(p.trackId)) stopTrack(p.trackId);
    useBgmStore.setState({ loaded: false });
    await load();
    setLibBusy(false);
    await alertDialog({ title: "받아왔습니다", message: `음원 ${next.length}곡을 이 기기 목록으로 맞췄습니다.` });
  }
  async function onPickFiles(e) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    const { errors } = await withBusy("음원 불러오는 중…", () => addFiles(files, roomId ?? void 0));
    if (errors.length) await alertDialog("일부 파일을 추가하지 못했습니다:\n" + errors.join("\n"));
  }
  function onAddYouTube() {
    const url = ytUrl.trim();
    if (!url) return;
    const r = addYouTube(url, void 0, roomId ?? void 0);
    if (r.ok) setYtUrl("");
    else void alertDialog(r.error ?? "유튜브 주소를 인식할 수 없습니다.");
  }
  const active = new Map(tracks.map((t) => [t.trackId, t]));
  const playingCount = tracks.length;
  const visible = showAll ? library : visibleTracks(library, roomId, new Set(active.keys()));
  if (!isGM) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloatingWindow,
      {
        winId: "bgm",
        title: "사운드",
        icon: "library_music",
        onClose,
        defaultW: 440,
        defaultH: 400,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { padding: 16, flex: 1, minHeight: 0, display: "flex", flexDirection: "column", gap: 12 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bgm-section-t", children: "내 사운드" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(PersonalSound, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(YtNotice, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bgm-section-t", style: { marginTop: 6 }, children: "현재 재생 중 (GM 제어)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6
                  },
                  children: tracks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { textAlign: "center", padding: "20px 8px" }, children: "재생 중인 배경음악이 없습니다." }) : tracks.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgm-row", style: { flexWrap: "wrap" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t.playing ? "graphic_eq" : "pause", size: 16, className: "muted" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t.kind === "youtube" ? "smart_display" : "audio_file", size: 15, className: "muted" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bgm-row-title", title: t.title, children: t.title }),
                    t.loop && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "repeat", size: 13, className: "muted" }),
                    t.kind !== "youtube" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrackSeekBar, { trackId: t.trackId, canSeek: false })
                  ] }, t.trackId))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "곡·볼륨은 GM이 정합니다. 내 볼륨만 조절돼요." })
            ]
          }
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: "bgm",
      title: "BGM",
      icon: "library_music",
      onClose,
      defaultW: 580,
      defaultH: 680,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 16, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bgm-section-t", children: "내 사운드" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(PersonalSound, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YtNotice, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, margin: "14px 0 10px" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
            showAll ? "전체" : "이 방",
            " ",
            visible.length,
            "곡 · 동시재생 ",
            playingCount,
            "/",
            MAX_BGM_TRACKS
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn sm" + (showAll ? " pri" : ""),
              "data-sfx": "button",
              onClick: () => setShowAll((v) => !v),
              title: showAll ? "이 방 목록만 표시" : "모든 방의 음원 표시(다른 방 곡은 가져오기 가능)",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: showAll ? "folder_open" : "folder", size: 14 }),
                " ",
                showAll ? "이 방 목록만" : "전체 보기"
              ]
            }
          ),
          playingCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", "data-sfx": "button", onClick: () => stopAll(), title: "모든 트랙 정지", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "stop", size: 14 }),
            " 전체 정지"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn sm" + (libSync ? " on" : ""),
              "data-sfx": "button",
              disabled: libBusy,
              onClick: () => setLibSync((v) => !v),
              title: "음원 목록을 기기 간에 맞춥니다",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cloud_sync", size: 14 }),
                " 기기 간 목록"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn pri",
              "data-sfx": "button",
              style: { marginLeft: "auto" },
              onClick: () => fileRef.current?.click(),
              disabled: busy,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 15 }),
                " ",
                busy ? "업로드 중…" : "음원 업로드"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "audio/*", multiple: true, hidden: true, onChange: onPickFiles })
        ] }),
        libSync && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgm-libsync", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { flex: "1 1 180px", minWidth: 0 }, children: "음원은 기기별로 저장됩니다. 한쪽에서 올리고 다른 쪽에서 받아오세요." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", "data-sfx": "button", disabled: libBusy, onClick: () => void pushLibrary(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cloud_upload", size: 14 }),
            " 이 기기 목록 올리기"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", "data-sfx": "button", disabled: libBusy, onClick: () => void pullLibrary(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "cloud_download", size: 14 }),
            " 받아오기"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "smart_display", size: 16, className: "muted", style: { flex: "none" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input",
              type: "text",
              placeholder: "유튜브 링크 또는 영상 ID 붙여넣기",
              value: ytUrl,
              onChange: (e) => setYtUrl(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") onAddYouTube();
              },
              style: { flex: 1 }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", "data-sfx": "button", onClick: onAddYouTube, disabled: !ytUrl.trim(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
            " 추가"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "toggle" + (syncToRoom ? "" : " off"), onClick: () => setSyncToRoom(!syncToRoom) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 700 }, children: syncToRoom ? "전체 동기화" : "나만 듣기" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            HintTip,
            {
              text: "켜면 재생·믹스가 전원에게 반영됩니다. 끄면 GM에게만 들려요(미리듣기).",
              label: "전체 동기화 설명"
            }
          )
        ] }),
        !syncToRoom && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              padding: "7px 10px",
              borderRadius: 8,
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)",
              fontSize: 11.5,
              lineHeight: 1.45
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "headphones", size: 15 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "지금 재생·정지는 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "나에게만" }),
                " 적용돼요. 참가자에게는 마지막으로 맞춘 상태가 들리고,",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "‘전체 동기화’" }),
                "로 돌아오면 지금 내 목록으로 방을 다시 맞춥니다."
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 6
            },
            children: visible.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "muted",
                style: { display: "grid", placeItems: "center", height: "100%", textAlign: "center" },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "library_music", size: 40, className: "muted" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: library.length === 0 ? "음원이 없습니다. 파일을 올리거나 유튜브 링크를 추가하세요." : "이 방 목록이 비었습니다. ‘전체 보기’에서 다른 방 곡을 가져오세요." })
                ] })
              }
            ) : visible.map((t, idx) => {
              const cur = active.get(t.id);
              const isActive = !!cur;
              const isPlaying = cur?.playing;
              const atCap = !isActive && playingCount >= MAX_BGM_TRACKS;
              const foreign = !!t.roomId && t.roomId !== roomId;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bgm-row",
                  style: {
                    flexWrap: "wrap",
                    background: isActive ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "rgba(255,255,255,0.03)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bgm-order", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          className: "iconbtn",
                          title: "위로",
                          disabled: idx === 0,
                          onClick: () => swapTracks(t.id, visible[idx - 1].id),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_upward", size: 13 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          className: "iconbtn",
                          title: "아래로",
                          disabled: idx === visible.length - 1,
                          onClick: () => swapTracks(t.id, visible[idx + 1].id),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_downward", size: 13 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "iconbtn",
                        title: atCap ? `동시재생은 최대 ${MAX_BGM_TRACKS}개` : isPlaying ? "일시정지" : isActive ? "재생" : "재생 시작",
                        disabled: atCap,
                        style: isActive ? { background: "var(--accent)", color: "#fff", border: 0 } : void 0,
                        onClick: () => isActive ? toggleTrackPlay(t.id) : playTrack(t),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: isPlaying ? "pause" : "play_arrow", size: 16 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Icon,
                      {
                        name: t.kind === "youtube" ? "smart_display" : "audio_file",
                        size: 14,
                        className: "muted",
                        style: { flex: "none" }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "bgm-row-title",
                        title: `${t.title}${t.size ? ` · ${fmtSize(t.size)}` : ""}`,
                        children: t.title
                      }
                    ),
                    foreign && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "muted",
                          style: { fontSize: 10, flex: "none" },
                          title: "다른 방(또는 삭제된 방) 목록의 음원입니다",
                          children: "다른 방"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          className: "iconbtn",
                          title: "이 방 목록으로 가져오기(소속 이동)",
                          onClick: () => roomId && claimTrack(t.id, roomId),
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "drive_file_move", size: 14 })
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        className: "bgm-vol",
                        type: "range",
                        min: 0,
                        max: 100,
                        value: Math.round((cur?.volume ?? t.volume ?? DEFAULT_TRACK_VOLUME) * 100),
                        onChange: (e) => setLibraryVolume(t.id, Number(e.target.value) / 100),
                        title: cur ? "이 트랙 믹스 볼륨" : "재생 시작 볼륨(미리 설정)",
                        style: { flex: "1 1 90px", minWidth: 80 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "muted",
                        style: { width: 26, textAlign: "right", fontSize: 10, flex: "none" },
                        children: [
                          Math.round((cur?.volume ?? t.volume ?? DEFAULT_TRACK_VOLUME) * 100),
                          "%"
                        ]
                      }
                    ),
                    cur && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "iconbtn" + (cur.loop ? " on" : ""),
                        title: cur.loop ? "반복 켜짐" : "반복 꺼짐",
                        onClick: () => setTrackLoop(t.id, !cur.loop),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "repeat", size: 14 })
                      }
                    ),
                    cur && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "이 트랙 정지", onClick: () => stopTrack(t.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "stop", size: 14 }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "iconbtn",
                        title: "이름 변경",
                        onClick: async () => {
                          const n = await promptText({ title: "곡 제목", defaultValue: t.title });
                          if (n != null) renameTrack(t.id, n);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 13 })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        className: "iconbtn",
                        title: "삭제",
                        style: { color: "var(--danger, #ef6f8e)" },
                        onClick: async () => {
                          if (await confirmDialog(`'${t.title}' 음원을 삭제할까요?`)) removeTrack(t.id);
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 13 })
                      }
                    ),
                    cur && t.kind !== "youtube" && /* @__PURE__ */ jsxRuntimeExports.jsx(TrackSeekBar, { trackId: t.id, canSeek: true })
                  ]
                },
                t.id
              );
            })
          }
        )
      ] })
    }
  );
}
function ProfileCard({ playerId, onClose }) {
  const roster = useNetStore((s) => s.roster);
  const participants = useNetStore((s) => s.participants);
  const self = useNetStore((s) => s.self);
  const account = useAuthStore((s) => s.account);
  const openWindow = useUIStore((s) => s.openWindow);
  const setVisiting = useLobbyStore((s) => s.setVisiting);
  const extActions = expansionProfileActions(useExpansionRegistry((s) => s.byId));
  const openDm = useDmStore((s) => s.openWith);
  const dmOnline = useDmStore((s) => s.online[playerId]);
  const dmStatus = useDmStore((s) => s.status[playerId]);
  const frFriends = useFriendStore((s) => s.friends);
  const frIncoming = useFriendStore((s) => s.incoming);
  const frOutgoing = useFriendStore((s) => s.outgoing);
  const frRequest = useFriendStore((s) => s.request);
  const frAccept = useFriendStore((s) => s.accept);
  const loadFriends = useFriendStore((s) => s.load);
  const p = participants.find((x) => x.playerId === playerId);
  const ch = roster[playerId];
  const isSelf = self?.playerId === playerId;
  const [home, setHome] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (isSelf) return;
    let cancelled = false;
    void fetchHome(playerId).then((h) => {
      if (!cancelled) setHome(h);
    });
    return () => {
      cancelled = true;
    };
  }, [playerId, isSelf, ch]);
  const hp = home?.account;
  reactExports.useEffect(() => {
    if (!isSelf) void loadFriends();
  }, [isSelf, loadFriends]);
  const isFriend = frFriends.some((f) => f.id === playerId);
  const isOutgoing = frOutgoing.some((f) => f.id === playerId);
  const isIncoming = frIncoming.some((f) => f.id === playerId);
  const [frBusy, setFrBusy] = reactExports.useState(false);
  const [frDone, setFrDone] = reactExports.useState(false);
  async function onAddFriend() {
    if (!hp?.username || frBusy) return;
    setFrBusy(true);
    const r = await frRequest(hp.username);
    setFrBusy(false);
    if (r.ok) setFrDone(true);
  }
  const ownerPresence = !ch?.charId || ch.charId === "owner";
  const name = (isSelf ? account?.nickname || account?.username : hp?.nickname || hp?.username || (ownerPresence ? ch?.name : void 0)) || p?.nick || "이름 없음";
  const fallbackColor = ch?.nameColor || ch?.color || p?.color || "#7c9cff";
  const avatar = isSelf ? account?.avatar : hp?.avatar ?? (ownerPresence && ch ? activeHeadshot(ch) : void 0);
  const [zoom, setZoom] = reactExports.useState(false);
  const banner = isSelf ? account?.banner : hp?.banner ?? ch?.banner;
  const bio = isSelf ? account?.bio : hp?.bio ?? ch?.bio;
  const links = (isSelf ? account?.links : hp?.links ?? ch?.links) ?? [];
  const roleLabel = p?.role === "GM" ? "게임 마스터" : "플레이어";
  const t = resolveTheme(isSelf ? account?.profileTheme : hp?.profileTheme ?? ch?.profileTheme);
  const cardStyle = {
    ["--prof-accent"]: t.accent,
    ["--prof-bg"]: t.bg ?? "var(--bg2)",
    ...t.hasBg ? { background: t.bg, color: t.fg } : {}
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prof-overlay", onClick: onClose, children: zoom && avatar ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "prof-zoom", src: avatar, alt: "", onClick: (e) => {
    e.stopPropagation();
    setZoom(false);
  } }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prof-card view", style: cardStyle, onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prof-strip" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "prof-banner" + (banner ? " has" : ""),
        style: banner ? { backgroundImage: `url(${banner})` } : { background: `linear-gradient(120deg, ${t.accent}, color-mix(in srgb, ${t.accent} 35%, #14141b))` }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "prof-close iconbtn", title: "닫기", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 16 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "prof-avatar",
        style: { background: avatar ? `center/cover url(${avatar})` : fallbackColor, cursor: avatar ? "zoom-in" : "default" },
        onClick: avatar ? () => setZoom(true) : void 0,
        title: avatar ? "크게 보기" : void 0,
        children: avatar ? "" : name[0] ?? "?"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prof-head", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prof-id", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prof-name", style: { color: t.nameColor }, children: [
          name,
          isSelf && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "prof-me", children: "(나)" }),
          !isSelf && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "dm-dot inline" + (dmOnline ? " on" : "") + (dmOnline && dmStatus && dmStatus !== "online" ? " " + dmStatus : ""),
              title: presenceLabel(!!dmOnline, dmStatus)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prof-handle", children: [
          roleLabel,
          p && p.nick && p.nick !== name ? ` · ${p.nick}` : ""
        ] })
      ] }),
      isSelf ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm prof-edit", onClick: () => {
        openWindow("profile");
        onClose();
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 13 }),
        " 편집"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prof-actions", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn sm pri",
            title: "이 사람에게 DM 보내기",
            onClick: () => {
              openDm(playerId, { name, avatar: avatar || void 0 });
              onClose();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "forum", size: 13 }),
              " DM"
            ]
          }
        ),
        hp && !isFriend && (isIncoming ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", title: "이 사람의 친구 신청 수락", disabled: frBusy, onClick: () => void frAccept(playerId), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "how_to_reg", size: 13 }),
          " 친구 수락"
        ] }) : isOutgoing || frDone ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", disabled: true, title: "친구 신청 대기 중", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "hourglass_top", size: 13 }),
          " 신청됨"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", title: "친구 신청 보내기", disabled: frBusy, onClick: () => void onAddFriend(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person_add", size: 13 }),
          " 친구 추가"
        ] })),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn sm",
            title: "이 사람의 로비를 방문(프로필·꾸밈 보기·방명록 남기기)",
            onClick: () => {
              setVisiting(playerId, { name });
              onClose();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "home", size: 13 }),
              " 로비 방문"
            ]
          }
        ),
        extActions.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn sm",
            title: a.title,
            onClick: () => {
              a.onSelect(playerId);
              onClose();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: a.icon, size: 13 }),
              " ",
              a.label
            ]
          },
          a.id
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prof-body", children: [
      bio ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prof-bio", style: { color: t.bioColor }, children: bio }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prof-bio empty", children: "소개가 아직 없어요." }),
      links.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "prof-links", children: links.map((l, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "prof-link", href: l.url, target: "_blank", rel: "noreferrer noopener", title: l.url, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "link", size: 13 }),
        " ",
        l.label || l.url
      ] }, i)) })
    ] })
  ] }) });
}
function ParticipantsPanel() {
  const participants = useNetStore((s) => s.participants);
  const roster = useNetStore((s) => s.roster);
  const self = useNetStore((s) => s.self);
  const code = useNetStore((s) => s.code);
  const kick = useNetStore((s) => s.kick);
  const requestSheet = useNetStore((s) => s.requestSheet);
  const roomOwnerId = useNetStore((s) => s.roomOwnerId);
  const setRoomGm = useNetStore((s) => s.setRoomGm);
  const transferRoomGm = useNetStore((s) => s.transferRoomGm);
  const closeWindow = useUIStore((s) => s.closeWindow);
  const openWindow = useUIStore((s) => s.openWindow);
  const isGM = self?.role === "GM";
  const isOwner = !!self && !!roomOwnerId && self.playerId === roomOwnerId;
  const online = participants.filter((p) => p.connected).length;
  const [profileOf, setProfileOf] = reactExports.useState(null);
  const [gmBusy, setGmBusy] = reactExports.useState(null);
  async function runGmAction(playerId, run) {
    if (gmBusy) return;
    setGmBusy(playerId);
    const r = await run();
    setGmBusy(null);
    if (!r.ok) await alertDialog({ title: "변경하지 못했어요", message: r.error ?? "알 수 없는 오류입니다." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingWindow, { winId: "participants", title: "참가자", icon: "groups", onClose: () => closeWindow("participants"), defaultW: 460, defaultH: 520, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 16, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
      online,
      "/",
      participants.length,
      " 접속"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6, overflowY: "auto" }, children: participants.map((p) => {
      const ch = roster[p.playerId];
      const name = ch?.name || p.nick;
      const isSelf = p.playerId === self?.playerId;
      const gm = p.role === "GM";
      const owner = !!roomOwnerId && p.playerId === roomOwnerId;
      const canManage = isOwner && !owner && !isSelf;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            padding: "6px 8px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            opacity: p.connected ? 1 : 0.5
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "av",
                title: "프로필·자기소개 보기",
                onClick: () => setProfileOf(p.playerId),
                style: {
                  width: 36,
                  height: 36,
                  flex: "0 0 auto",
                  cursor: "pointer",
                  background: ch?.headshot ? `center/cover url(${ch.headshot})` : p.color,
                  boxShadow: gm ? "0 0 0 2px var(--accent)" : void 0
                },
                children: ch?.headshot ? "" : name[0] ?? "?"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", lineHeight: 1.3, minWidth: 0 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  style: { fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: ch?.nameColor || void 0 },
                  children: [
                    name,
                    isSelf && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: " (나)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
                owner ? "방장 · 게임 마스터" : gm ? "게임 마스터" : "플레이어",
                " · ",
                p.nick,
                !p.connected && " · 접속 끊김"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "chip",
                title: owner ? "이 방을 만든 사람" : gm ? "방장이 지정한 공동 GM" : "플레이어",
                style: {
                  marginLeft: "auto",
                  flex: "0 0 auto",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: gm ? "var(--accent)" : "rgba(120,130,150,0.92)",
                  color: "#fff"
                },
                children: [
                  owner && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "workspace_premium", size: 12 }),
                  owner ? "방장" : p.role
                ]
              }
            ),
            isGM && !isSelf && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn",
                title: "이 참가자의 전체 캐릭터 시트 보기 (읽기전용)",
                onClick: () => {
                  requestSheet(p.playerId);
                  openWindow("sheetview");
                },
                style: { flex: "0 0 auto" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "description", size: 15 }),
                  " 시트"
                ]
              }
            ),
            canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn",
                disabled: gmBusy === p.playerId,
                title: gm ? "GM 권한을 거둡니다" : "GM 권한을 줍니다 (방장과 같은 기능을 씁니다)",
                onClick: () => void runGmAction(p.playerId, async () => {
                  const yes = await confirmDialog(
                    gm ? `${name} 님의 GM 권한을 거둘까요?` : `${name} 님에게 GM 권한을 줄까요?
맵·자료·덱·시트 같은 GM 기능을 똑같이 쓸 수 있게 됩니다.`
                  );
                  return yes ? setRoomGm(p.playerId, !gm) : { ok: true };
                }),
                style: { flex: "0 0 auto" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: gm ? "remove_moderator" : "add_moderator", size: 15 }),
                  " ",
                  gm ? "GM 해제" : "GM 지정"
                ]
              }
            ),
            canManage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn",
                disabled: gmBusy === p.playerId,
                title: "이 사람에게 방장을 넘깁니다",
                onClick: () => void runGmAction(p.playerId, async () => {
                  const yes = await confirmDialog(
                    `${name} 님에게 방장을 넘길까요?
세션 삭제·복사·이름 변경 권한이 그 사람에게 갑니다.
나는 공동 GM 으로 남습니다.`
                  );
                  return yes ? transferRoomGm(p.playerId) : { ok: true };
                }),
                style: { flex: "0 0 auto" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "swap_horiz", size: 15 }),
                  " 양도"
                ]
              }
            ),
            isGM && !isSelf && !owner && (!gm || isOwner) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn",
                title: "추방(초대 코드 재발급)",
                onClick: async () => {
                  if (await confirmDialog(`${name} 님을 추방할까요?
초대 코드가 재발급되어 기존 코드는 무효가 됩니다.`)) {
                    kick(p.playerId);
                  }
                },
                style: { flex: "0 0 auto", color: "var(--danger, #ef6f8e)", borderColor: "var(--danger, #ef6f8e)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person_remove", size: 15 }),
                  " 추방"
                ]
              }
            )
          ]
        },
        p.playerId
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { marginTop: 12, paddingTop: 10, borderTop: "1px solid var(--line2)" }, children: isGM ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      code && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "info", size: 12 }),
        " 이 방의 초대 코드는 ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: code }),
        "입니다."
      ] }),
      isOwner ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_moderator", size: 12 }),
        " GM 은 여러 명 둘 수 있습니다. 세션 삭제·복사·이름 변경만 방장 몫입니다."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shield", size: 12 }),
        " GM 지정·양도는 방을 만든 사람만 할 수 있습니다."
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shield", size: 12 }),
      " 참가자 추방은 GM만 할 수 있습니다."
    ] }) }),
    profileOf && /* @__PURE__ */ jsxRuntimeExports.jsx(ProfileCard, { playerId: profileOf, onClose: () => setProfileOf(null) }, profileOf)
  ] }) });
}
function cssTextToStyle(decls) {
  const out = {};
  for (const d of decls.split(";")) {
    const i = d.indexOf(":");
    if (i < 0) continue;
    const key = d.slice(0, i).trim().replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
    out[key] = d.slice(i + 1).trim();
  }
  return out;
}
function withBreaks(text, key) {
  const out = [];
  const parts = text.split("\n");
  parts.forEach((p, i) => {
    if (i > 0) out.push(/* @__PURE__ */ jsxRuntimeExports.jsx("br", {}, `${key}b${i}`));
    if (p) out.push(p);
  });
  return out;
}
function renderNodes(nodes, keyPrefix) {
  return nodes.map((n, i) => {
    const key = `${keyPrefix}.${i}`;
    if (n.type === "text") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: withBreaks(n.text, key) }, key);
    const kids = renderNodes(n.children, key);
    switch (n.tag) {
      case "b":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: kids }, key);
      case "i":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("em", { children: kids }, key);
      case "u":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: kids }, key);
      case "s":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("s", { children: kids }, key);
      case "dim":
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mk-dim", children: kids }, key);
      case "css": {
        const decls = safeCssDecls(n.value);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mk-css", style: decls ? cssTextToStyle(decls) : void 0, children: kids }, key);
      }
      case "color": {
        const c = safeColor(n.value);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: c ? { color: c } : void 0, children: kids }, key);
      }
      case "bg": {
        const c = safeColor(n.value);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mk-bg", style: c ? { background: c } : void 0, children: kids }, key);
      }
      case "size": {
        const s = safeSize(n.value);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: s ? { fontSize: s } : void 0, children: kids }, key);
      }
      case "ruby":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("ruby", { children: [
          kids,
          /* @__PURE__ */ jsxRuntimeExports.jsx("rt", { children: (n.value ?? "").slice(0, 50) })
        ] }, key);
      case "center":
      case "right":
      case "left": {
        const style = { textAlign: n.tag };
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style, children: kids }, key);
      }
      case "box": {
        const c = safeColor(n.value);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mk-box", style: c ? { background: c } : void 0, children: kids }, key);
      }
      case "bubble": {
        const c = safeColor(n.value);
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mk-bubble", style: c ? { background: c } : void 0, children: kids }, key);
      }
      case "bar":
        return null;
      case "img": {
        const raw = n.value;
        const u = raw && isAssetRef(raw) ? resolveAssetUrl(raw) : safeImgUrl(raw);
        return u ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            className: "mk-img",
            src: u,
            alt: "",
            loading: "lazy",
            referrerPolicy: "no-referrer",
            title: "클릭하면 크게 보기",
            onClick: () => useUIStore.getState().setLightbox(u)
          },
          key
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "[이미지 주소 오류]" }, key);
      }
      case "roll": {
        const [val, ...rest] = (n.value ?? "").split("|");
        const tip = rest.join("|");
        const brk = /→\s*(.+?)\s*=\s*[^=]*$/.exec(tip)?.[1];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-roll", title: tip, children: [
          val,
          brk && /* @__PURE__ */ jsxRuntimeExports.jsxs("i", { className: "inline-roll-brk", children: [
            "(",
            brk,
            ")"
          ] })
        ] }, key);
      }
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: kids }, key);
    }
  });
}
function MarkupText({ src, script = false }) {
  const dimOn = useUIStore((s) => s.chatDimParens);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderNodes(parseMarkup(src || "", { dimParens: !script && dimOn }), "mk") });
}
function halfOf(e) {
  const r = e.currentTarget.getBoundingClientRect();
  return e.clientY < r.top + r.height / 2 ? "above" : "below";
}
function imgAlignStyle(align) {
  if (align === "center") return { marginLeft: "auto", marginRight: "auto" };
  if (align === "right") return { marginLeft: "auto", marginRight: 0 };
  return { marginRight: "auto" };
}
const SCOPES = [
  { id: "private", label: "비공개", hint: "나(GM)만" },
  { id: "all", label: "전체 공개", hint: "모든 참가자" },
  { id: "targeted", label: "특정 유저", hint: "선택한 사람만(비밀)" }
];
function scopeChip(scope) {
  if (scope === "all") return { label: "전체", bg: "rgba(120,180,130,0.92)" };
  if (scope === "targeted") return { label: "비밀", bg: "rgba(220,160,70,0.92)" };
  return { label: "비공개", bg: "rgba(120,130,150,0.92)" };
}
function toDraft$1(h) {
  return {
    id: h.id,
    title: h.title,
    body: h.body,
    image: h.image,
    imageAlign: h.imageAlign,
    folder: h.folder ?? "",
    tags: h.tags.join(", "),
    scope: h.scope,
    targets: [...h.targets]
  };
}
function draftToReq(d) {
  return {
    id: d.id,
    title: d.title.trim(),
    body: d.body,
    image: d.image,
    imageAlign: d.imageAlign,
    folder: d.folder.trim(),
    // 빈 값이면 서버가 폴더 해제로 정규화
    tags: d.tags.split(",").map((t) => t.trim()).filter(Boolean),
    scope: d.scope,
    targets: d.scope === "targeted" ? d.targets : []
  };
}
function HandoutPanelBody() {
  const handouts = useHandoutStore((s) => s.handouts);
  const selectedId = useHandoutStore((s) => s.selectedId);
  const select = useHandoutStore((s) => s.select);
  const save = useHandoutStore((s) => s.save);
  const removeHandout = useHandoutStore((s) => s.remove);
  const focus = useHandoutStore((s) => s.focus);
  const reorder = useHandoutStore((s) => s.reorder);
  const self = useNetStore((s) => s.self);
  const participants = useNetStore((s) => s.participants);
  const roster = useNetStore((s) => s.roster);
  const isGM = self?.role === "GM";
  const [draft, setDraft] = reactExports.useState(null);
  const [picking, setPicking] = reactExports.useState(false);
  const [editing, setEditing] = reactExports.useState(false);
  const [previewAsPlayer, setPreviewAsPlayer] = reactExports.useState(false);
  const fileRef = reactExports.useRef(null);
  const [query, setQuery] = reactExports.useState("");
  const [tagFilter, setTagFilter] = reactExports.useState([]);
  const [closedFolders, setClosedFolders] = reactExports.useState({});
  const dragId = reactExports.useRef(null);
  const [dropAt, setDropAt] = reactExports.useState(null);
  const allTags = reactExports.useMemo(
    () => [...new Set(handouts.flatMap((h) => h.tags))].sort((a, b) => a.localeCompare(b)),
    [handouts]
  );
  const folderOptions = reactExports.useMemo(
    () => [...new Set(handouts.map((h) => h.folder).filter((f) => !!f))].sort(
      (a, b) => a.localeCompare(b)
    ),
    [handouts]
  );
  const visible = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    return handouts.filter((h) => {
      if (q && !h.title.toLowerCase().includes(q)) return false;
      if (tagFilter.length > 0 && !tagFilter.some((t) => h.tags.includes(t))) return false;
      return true;
    });
  }, [handouts, query, tagFilter]);
  const groups = reactExports.useMemo(() => {
    const none = [];
    const named = /* @__PURE__ */ new Map();
    for (const h of visible) {
      const f = h.folder;
      if (!f) none.push(h);
      else {
        const arr = named.get(f);
        if (arr) arr.push(h);
        else named.set(f, [h]);
      }
    }
    const out = [];
    if (none.length > 0) out.push({ name: "", items: none });
    for (const [name, items] of named) out.push({ name, items });
    return out;
  }, [visible]);
  const flatList = groups.length === 1 && groups[0].name === "";
  const selected = handouts.find((h) => h.id === selectedId) ?? null;
  const stored = handouts.find((h) => h.id === draft?.id) ?? null;
  const nameOf = (pid) => roster[pid]?.name || participants.find((p) => p.playerId === pid)?.nick || pid;
  reactExports.useEffect(() => {
    if (!isGM) return;
    if (!selectedId) {
      setDraft(null);
      return;
    }
    const h = handouts.find((x) => x.id === selectedId);
    if (h) setDraft(toDraft$1(h));
  }, [selectedId, isGM]);
  function newHandout() {
    const id = globalThis.crypto?.randomUUID?.() ?? `h${Date.now()}`;
    setDraft({
      id,
      title: "",
      body: "",
      image: void 0,
      folder: "",
      tags: "",
      scope: "private",
      targets: []
    });
    select(id);
    setEditing(true);
    setPreviewAsPlayer(false);
  }
  async function onPickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !draft) return;
    try {
      const big = file.size > 8 * 1024 * 1024;
      const img = await withBusy(
        big ? "큰 이미지 불러오는 중… 잠시만 기다려 주세요" : "이미지 불러오는 중…",
        () => fileToHandoutImage(file)
      );
      setDraft({ ...draft, image: img });
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  function onSave() {
    if (!draft) return;
    save(draftToReq(draft));
  }
  async function onDelete() {
    if (!draft) return;
    if (await confirmDialog("이 핸드아웃을 삭제할까요?")) {
      removeHandout(draft.id);
      setDraft(null);
      select(null);
      setPreviewAsPlayer(false);
    }
  }
  function onReveal() {
    if (!draft) return;
    const next = { ...draft, scope: "all" };
    setDraft(next);
    save(draftToReq(next));
  }
  function toggleTarget(pid) {
    if (!draft) return;
    const has = draft.targets.includes(pid);
    setDraft({ ...draft, targets: has ? draft.targets.filter((t) => t !== pid) : [...draft.targets, pid] });
  }
  const targetable = participants.filter((p) => p.role !== "GM");
  const canFocus = !!stored && stored.scope !== "private";
  function openRow(id) {
    select(id);
    setEditing(false);
    setPreviewAsPlayer(false);
  }
  function renderRow(h, siblings, idx) {
    const chip = scopeChip(h.scope);
    const on = h.id === selectedId;
    const hint = dropAt?.id === h.id ? dropAt.where : null;
    const sameGroup = (id) => siblings.some((x) => x.id === id);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "handout-row" + (hint === "above" ? " drop-above" : hint === "below" ? " drop-below" : ""),
        "data-sfx": "open",
        role: "button",
        tabIndex: 0,
        draggable: isGM,
        onDragStart: () => {
          dragId.current = h.id;
        },
        onDragOver: (e) => {
          const src = dragId.current;
          if (!src || src === h.id || !sameGroup(src)) return;
          e.preventDefault();
          const where = halfOf(e);
          setDropAt((p) => p?.id === h.id && p.where === where ? p : { id: h.id, where });
        },
        onDrop: (e) => {
          e.preventDefault();
          const src = dragId.current;
          dragId.current = null;
          setDropAt(null);
          if (!src || src === h.id || !sameGroup(src)) return;
          reorder(src, halfOf(e) === "above" ? h.id : siblings[idx + 1]?.id);
        },
        onDragEnd: () => {
          dragId.current = null;
          setDropAt(null);
        },
        onClick: () => openRow(h.id),
        onKeyDown: (e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openRow(h.id);
          }
        },
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 8px",
          borderRadius: 10,
          border: on ? "1px solid var(--accent)" : "1px solid var(--line2)",
          background: on ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "rgba(255,255,255,0.03)",
          cursor: "pointer",
          textAlign: "left",
          color: "inherit",
          userSelect: "none"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                width: 34,
                height: 34,
                flex: "0 0 auto",
                borderRadius: 7,
                background: h.image ? `center/cover url(${h.image})` : "rgba(120,130,150,0.18)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              },
              children: !h.image && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "description", size: 16, className: "muted" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                flex: 1,
                minWidth: 0,
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              },
              children: h.title || "(제목 없음)"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", style: { flex: "0 0 auto", background: chip.bg, color: "#fff" }, children: chip.label }),
          isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "handout-order", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "iconbtn",
                title: "위로",
                disabled: idx === 0,
                onClick: (e) => {
                  e.stopPropagation();
                  reorder(h.id, siblings[idx - 1].id);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_upward", size: 12 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "iconbtn",
                title: "아래로",
                disabled: idx === siblings.length - 1,
                onClick: (e) => {
                  e.stopPropagation();
                  reorder(h.id, siblings[idx + 2]?.id);
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_downward", size: 12 })
              }
            )
          ] })
        ]
      },
      h.id
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "handout-panel",
      style: { display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "article", size: 20 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { fontSize: 16 }, children: "핸드아웃" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
            handouts.length,
            "개"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "handout-split", style: { display: "flex", gap: 14, flex: 1, minHeight: 0 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "handout-list", style: { width: 240, flex: "0 0 auto", display: "flex", flexDirection: "column", minHeight: 0 }, children: [
            isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn sm",
                "data-sfx": "button",
                onClick: newHandout,
                style: { width: "100%", justifyContent: "center", marginBottom: 8, flex: "0 0 auto" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
                  " 새 핸드아웃"
                ]
              }
            ),
            handouts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input",
                placeholder: "제목 검색",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                style: { marginBottom: 6, flex: "0 0 auto", padding: "5px 8px", fontSize: 12.5 }
              }
            ),
            allTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: { display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 6, flex: "0 0 auto" },
                children: allTags.map((t) => {
                  const on = tagFilter.includes(t);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "chip",
                      title: on ? "이 태그 필터를 해제합니다" : "이 태그가 달린 것만 봅니다",
                      onClick: () => setTagFilter((prev) => on ? prev.filter((x) => x !== t) : [...prev, t]),
                      style: {
                        cursor: "pointer",
                        border: on ? "1px solid var(--accent)" : "1px solid transparent",
                        background: on ? "color-mix(in srgb, var(--accent) 22%, transparent)" : "rgba(120,130,150,0.2)",
                        color: "inherit"
                      },
                      children: [
                        "#",
                        t
                      ]
                    },
                    t
                  );
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  overflowY: "auto",
                  paddingRight: 4,
                  minHeight: 0
                },
                children: [
                  handouts.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { padding: "8px 4px" }, children: [
                    "아직 핸드아웃이 없습니다.",
                    isGM && " 「새 핸드아웃」으로 만들어 보세요."
                  ] }),
                  handouts.length > 0 && visible.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: "8px 4px" }, children: "조건에 맞는 핸드아웃이 없습니다." }),
                  flatList ? groups[0].items.map((h, i) => renderRow(h, groups[0].items, i)) : groups.map((g) => {
                    const closed = !!closedFolders[g.name];
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        style: { display: "flex", flexDirection: "column", gap: 6 },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "button",
                            {
                              className: "handout-folder-head",
                              title: closed ? "이 폴더를 펼칩니다" : "이 폴더를 접습니다",
                              onClick: () => setClosedFolders((c) => ({ ...c, [g.name]: !closed })),
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: closed ? "chevron_right" : "expand_more", size: 15 }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: g.name ? "folder" : "folder_open", size: 13, className: "muted" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "handout-folder-name", children: g.name || "분류 없음" }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
                                  g.items.length,
                                  "개"
                                ] })
                              ]
                            }
                          ),
                          !closed && g.items.map((h, i) => renderRow(h, g.items, i))
                        ]
                      },
                      "f:" + g.name
                    );
                  })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                flex: 1,
                minWidth: 0,
                overflowY: "auto",
                borderLeft: "1px solid var(--line2)",
                paddingLeft: 14
              },
              children: isGM && editing && draft && previewAsPlayer ? /* @__PURE__ */ jsxRuntimeExports.jsx(PlayerPreview, { draft, nameOf, onBack: () => setPreviewAsPlayer(false) }) : isGM && editing && draft ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                GMEditor,
                {
                  draft,
                  setDraft,
                  folderOptions,
                  targetable,
                  nameOf,
                  fileRef,
                  onPickImage,
                  onSave,
                  onDelete,
                  onReveal,
                  toggleTarget,
                  canFocus,
                  isStored: !!stored,
                  storedScope: stored?.scope,
                  onFocus: () => focus(draft.id),
                  onOpenLibrary: () => setPicking(true),
                  onPreviewAsPlayer: () => setPreviewAsPlayer(true)
                }
              ) : selected ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReadView,
                {
                  h: selected,
                  nameOf,
                  onEdit: isGM ? () => {
                    setDraft(toDraft$1(selected));
                    setEditing(true);
                    setPreviewAsPlayer(false);
                  } : void 0
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "muted",
                  style: { display: "grid", placeItems: "center", height: "100%", textAlign: "center" },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "description", size: 40, className: "muted" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: "왼쪽에서 핸드아웃을 선택하세요." })
                  ] })
                }
              )
            }
          )
        ] }),
        picking && /* @__PURE__ */ jsxRuntimeExports.jsx(
          LibraryPanel,
          {
            pickMode: true,
            onPick: (a) => setDraft((d) => d ? { ...d, image: a.dataUrl } : d),
            onClose: () => setPicking(false)
          }
        )
      ]
    }
  );
}
function HandoutPanel() {
  const closeWindow = useUIStore((s) => s.closeWindow);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: "handout",
      title: "핸드아웃",
      icon: "description",
      onClose: () => closeWindow("handout"),
      defaultW: 760,
      defaultH: 620,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { padding: 16, flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HandoutPanelBody, {}) })
    }
  );
}
function ReadView({
  h,
  nameOf,
  onEdit
}) {
  const chip = scopeChip(h.scope);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { style: { margin: 0, fontSize: 18 }, children: h.title || "(제목 없음)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", style: { background: chip.bg, color: "#fff" }, children: chip.label }),
      onEdit && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", style: { marginLeft: "auto" }, onClick: onEdit, title: "이 핸드아웃 편집", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 14 }),
        " 편집"
      ] })
    ] }),
    h.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: h.image,
        alt: "",
        title: "클릭하면 크게 보기",
        onClick: () => useUIStore.getState().setLightbox(h.image),
        style: {
          maxWidth: "100%",
          maxHeight: 320,
          width: "auto",
          height: "auto",
          objectFit: "contain",
          borderRadius: 8,
          display: "block",
          marginBottom: 10,
          cursor: "zoom-in",
          ...imgAlignStyle(h.imageAlign)
        }
      }
    ),
    h.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "txt", style: { lineHeight: 1.6, whiteSpace: "pre-wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkupText, { src: h.body }) }),
    h.scope === "targeted" && h.targets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { marginTop: 10 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 12 }),
      " 대상: ",
      h.targets.map(nameOf).join(", ")
    ] }),
    h.tags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }, children: h.tags.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "chip", style: { background: "rgba(120,130,150,0.25)" }, children: [
      "#",
      t
    ] }, t)) })
  ] });
}
function PlayerPreview({
  draft,
  nameOf,
  onBack
}) {
  const preview = { ...draftToReq(draft), createdAt: 0, updatedAt: 0 };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          paddingBottom: 8,
          borderBottom: "1px solid var(--line2)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "visibility", size: 15, className: "muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "플레이어 시점 미리보기" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", style: { marginLeft: "auto" }, onClick: onBack, title: "편집으로 돌아가기", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 14 }),
            " 편집으로"
          ] })
        ]
      }
    ),
    draft.scope === "private" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "muted",
        style: { display: "grid", placeItems: "center", padding: "28px 12px", textAlign: "center", gap: 8 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "visibility_off", size: 36, className: "muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "비공개 상태라 플레이어에게는 보이지 않습니다." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "small", children: "「전체 공개」나 「특정 유저」로 바꾸면 보여요." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ReadView, { h: preview, nameOf })
  ] });
}
function GMEditor(props) {
  const {
    draft,
    setDraft,
    folderOptions,
    targetable,
    nameOf,
    fileRef,
    onPickImage,
    onSave,
    onDelete,
    onReveal,
    toggleTarget,
    canFocus,
    isStored,
    storedScope,
    onFocus,
    onOpenLibrary,
    onPreviewAsPlayer
  } = props;
  const folderListId = reactExports.useId();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 10 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        className: "btn sm",
        onClick: onPreviewAsPlayer,
        title: "플레이어가 보는 그대로 미리보기",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "visibility", size: 14 }),
          " 보기"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "input",
        placeholder: "제목",
        value: draft.title,
        onChange: (e) => setDraft({ ...draft, title: e.target.value }),
        style: { fontSize: 15, fontWeight: 700 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => fileRef.current?.click(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 15 }),
        " 이미지 ",
        draft.image ? "교체" : "추가"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "PNG·GIF·APNG (움직이는 그림도 그대로)", label: "쓸 수 있는 이미지 형식" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: onOpenLibrary, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "photo_library", size: 15 }),
        " 라이브러리에서"
      ] }),
      draft.image && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => setDraft({ ...draft, image: void 0 }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }),
        " 이미지 제거"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: "image/*", hidden: true, onChange: onPickImage })
    ] }),
    draft.image && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginRight: 2 }, children: "이미지 정렬" }),
      [
        ["left", "format_align_left"],
        ["center", "format_align_center"],
        ["right", "format_align_right"]
      ].map(([al, icon]) => {
        const on = (draft.imageAlign ?? "left") === al;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "btn sm",
            title: al === "left" ? "왼쪽" : al === "center" ? "가운데" : "오른쪽",
            onClick: () => setDraft({ ...draft, imageAlign: al }),
            style: on ? { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" } : void 0,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: icon, size: 14 })
          },
          al
        );
      })
    ] }),
    draft.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: draft.image,
        alt: "",
        style: {
          maxWidth: "100%",
          maxHeight: 220,
          width: "auto",
          height: "auto",
          objectFit: "contain",
          alignSelf: draft.imageAlign === "center" ? "center" : draft.imageAlign === "right" ? "flex-end" : "flex-start",
          borderRadius: 8,
          display: "block"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RichEditor, { value: draft.body, onChange: (body) => setDraft({ ...draft, body }) }, draft.id),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "input",
        placeholder: "태그 (콤마로 구분)",
        value: draft.tags,
        onChange: (e) => setDraft({ ...draft, tags: e.target.value })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "input",
        list: folderListId,
        placeholder: "폴더 (비우면 분류 없음)",
        value: draft.folder,
        onChange: (e) => setDraft({ ...draft, folder: e.target.value })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: folderListId, children: folderOptions.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f }, f)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { marginBottom: 4 }, children: "공개 범위" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" }, children: SCOPES.map((s) => {
        const on = draft.scope === s.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "btn",
            "data-sfx": "button",
            onClick: () => setDraft({ ...draft, scope: s.id }),
            title: s.hint,
            style: on ? { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" } : void 0,
            children: s.label
          },
          s.id
        );
      }) }),
      draft.scope === "targeted" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "대상 선택" }),
        targetable.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "참가한 플레이어가 없습니다." }),
        targetable.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              opacity: p.connected ? 1 : 0.65
            },
            title: p.connected ? void 0 : "접속 끊김 · 다시 들어오면 볼 수 있습니다",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: draft.targets.includes(p.playerId),
                  onChange: () => toggleTarget(p.playerId)
                }
              ),
              nameOf(p.playerId),
              !p.connected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: " · 오프라인" })
            ]
          },
          p.playerId
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
          marginTop: 4,
          paddingTop: 10,
          borderTop: "1px solid var(--line2)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn pri", "data-sfx": "button", onClick: onSave, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "save", size: 15 }),
            " 저장"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn",
              "data-sfx": "button",
              onClick: onFocus,
              disabled: !canFocus,
              title: canFocus ? "대상 화면에 이 핸드아웃을 강제로 띄웁니다" : "저장된 공개/비밀 핸드아웃만 강제 표시할 수 있습니다",
              style: { opacity: canFocus ? 1 : 0.5 },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "present_to_all", size: 15 }),
                " 강제 표시"
              ]
            }
          ),
          isStored && storedScope === "targeted" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn",
              "data-sfx": "button",
              onClick: onReveal,
              title: "비밀 핸드아웃을 전체에게 공개합니다",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "public", size: 15 }),
                " 전체 공개로 전환"
              ]
            }
          ),
          isStored && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn",
              "data-sfx": "button",
              onClick: onDelete,
              style: {
                marginLeft: "auto",
                color: "var(--danger, #ef6f8e)",
                borderColor: "var(--danger, #ef6f8e)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }),
                " 삭제"
              ]
            }
          )
        ]
      }
    ),
    !isStored && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "info", size: 12 }),
      " 저장하면 공개 범위에 따라 대상에게 전달됩니다."
    ] })
  ] });
}
function RichEditor({ value, onChange }) {
  const ref = reactExports.useRef(null);
  const [mode, setMode] = reactExports.useState("rich");
  reactExports.useEffect(() => {
    if (mode === "rich" && ref.current) ref.current.innerHTML = markupToHtml(value);
  }, [mode]);
  const flush = () => {
    if (ref.current) onChange(htmlToMarkup(ref.current));
  };
  const onEditorKeyDown = (e) => {
    if (e.key !== "Enter" || e.nativeEvent.isComposing) return;
    const doc = ref.current?.ownerDocument ?? document;
    const view = doc.defaultView ?? window;
    e.preventDefault();
    if (doc.execCommand("insertLineBreak")) {
      flush();
      return;
    }
    if (doc.execCommand("insertHTML", false, "<br>")) {
      flush();
      return;
    }
    const sel = view.getSelection();
    const range = sel && sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
    if (range && ref.current?.contains(range.commonAncestorContainer)) {
      const brk = doc.createElement("br");
      range.deleteContents();
      range.insertNode(brk);
      range.setStartAfter(brk);
      range.collapse(true);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
    flush();
  };
  const savedRange = reactExports.useRef(null);
  const saveSel = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const r = sel.getRangeAt(0);
    if (ref.current?.contains(r.commonAncestorContainer)) savedRange.current = r.cloneRange();
  };
  const restoreSel = () => {
    const r = savedRange.current;
    if (!r || !ref.current?.contains(r.commonAncestorContainer)) return false;
    const sel = window.getSelection();
    if (!sel) return false;
    sel.removeAllRanges();
    sel.addRange(r);
    return true;
  };
  const exec = (cmd, arg) => {
    restoreSel();
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {
    }
    document.execCommand(cmd, false, arg);
    ref.current?.focus();
    flush();
  };
  const applySize = (px) => {
    const range = savedRange.current;
    if (!range || range.collapsed || !ref.current?.contains(range.commonAncestorContainer)) return;
    const span = document.createElement("span");
    span.style.fontSize = `${px}px`;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      savedRange.current = null;
      window.getSelection()?.removeAllRanges();
    } catch {
    }
    ref.current?.focus();
    flush();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "ho-rich-tb",
        onMouseDown: (e) => {
          if (e.target.closest("button,label")) e.preventDefault();
        },
        children: mode === "rich" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", title: "굵게", onClick: () => exec("bold"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "B" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", title: "기울임", onClick: () => exec("italic"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "I" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", title: "밑줄", onClick: () => exec("underline"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: "U" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", title: "취소선", onClick: () => exec("strikeThrough"), children: /* @__PURE__ */ jsxRuntimeExports.jsx("s", { children: "S" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "btn sm",
              title: "글자 크기",
              defaultValue: "",
              onChange: (e) => {
                const v = Number(e.target.value);
                if (v) applySize(v);
                e.currentTarget.value = "";
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "크기" }),
                [12, 14, 16, 20, 24, 32].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: n, children: [
                  n,
                  "px"
                ] }, n))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "btn sm",
              title: "글자색",
              style: { display: "inline-flex", alignItems: "center", gap: 4, cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_text", size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    defaultValue: "#e7a33e",
                    onChange: (e) => exec("foreColor", e.target.value),
                    style: { width: 18, height: 18, padding: 0, border: 0, background: "none" }
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", title: "왼쪽 정렬", onClick: () => exec("justifyLeft"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_align_left", size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn sm",
              title: "가운데 정렬",
              onClick: () => exec("justifyCenter"),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_align_center", size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", title: "오른쪽 정렬", onClick: () => exec("justifyRight"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_align_right", size: 14 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn sm",
              style: { marginLeft: "auto" },
              title: "원문 마크업 보기/편집",
              onClick: () => {
                flush();
                setMode("source");
              },
              children: "</> 소스"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "btn sm",
            style: { marginLeft: "auto" },
            title: "완성 화면으로",
            onClick: () => setMode("rich"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "visibility", size: 14 }),
              " 완성 보기"
            ]
          }
        )
      }
    ),
    mode === "rich" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        className: "input ho-rich",
        contentEditable: true,
        suppressContentEditableWarning: true,
        onInput: flush,
        onKeyDown: onEditorKeyDown,
        onMouseUp: saveSel,
        onKeyUp: saveSel,
        style: { minHeight: 120, maxHeight: 340, overflowY: "auto", lineHeight: 1.6 }
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: "input",
        value,
        onChange: (e) => onChange(e.target.value),
        rows: 6,
        placeholder: "[b]굵게[/b] [img=URL]",
        style: { resize: "vertical", lineHeight: 1.5, fontFamily: "inherit" }
      }
    )
  ] });
}
function HandoutPresentation() {
  const presentedIds = useHandoutStore((s) => s.presentedIds);
  const handouts = useHandoutStore((s) => s.handouts);
  const present = useHandoutStore((s) => s.present);
  const dismiss = useHandoutStore((s) => s.dismiss);
  const dismissAll = useHandoutStore((s) => s.dismissAll);
  reactExports.useEffect(() => {
    for (const id of presentedIds) {
      if (!handouts.some((x) => x.id === id)) dismiss(id);
    }
  }, [presentedIds, handouts, dismiss]);
  const items = presentedIds.map((id) => handouts.find((x) => x.id === id)).filter((x) => !!x);
  if (items.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "backdrop", style: { zIndex: 3e3 }, onClick: () => dismissAll() }),
    items.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      HandoutPresentWindow,
      {
        h,
        index: i,
        z: 3001 + i,
        onFocus: () => present(h.id),
        onClose: () => dismiss(h.id)
      },
      h.id
    ))
  ] });
}
function HandoutPresentWindow({
  h,
  index,
  z,
  onFocus,
  onClose
}) {
  const ref = reactExports.useRef(null);
  const [pos, setPos] = reactExports.useState(null);
  const [cascade] = reactExports.useState(index);
  function beginDrag(e) {
    e.preventDefault();
    onFocus();
    const el = ref.current;
    if (!el) return;
    const zoom = effectiveUiScale();
    const rect = el.getBoundingClientRect();
    const startX = pos?.x ?? rect.left / zoom;
    const startY = pos?.y ?? rect.top / zoom;
    const sx = e.clientX;
    const sy = e.clientY;
    const onMove = (ev) => {
      const nx = Math.max(0, startX + (ev.clientX - sx) / zoom);
      const ny = Math.max(0, startY + (ev.clientY - sy) / zoom);
      setPos({ x: Math.round(nx), y: Math.round(ny) });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }
  const style = pos ? { left: pos.x, top: pos.y, transform: "none", zIndex: z } : {
    left: "50%",
    top: "50%",
    transform: `translate(calc(-50% + ${cascade * 26}px), calc(-50% + ${cascade * 26}px))`,
    zIndex: z
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      className: "handout-present",
      role: "dialog",
      "aria-label": "핸드아웃",
      style,
      onPointerDown: onFocus,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "handout-present-head", onPointerDown: beginDrag, title: "드래그해 창 이동", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "drag_indicator", size: 16, className: "muted" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "handout-present-headtitle", children: h.title || "핸드아웃" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "iconbtn handout-present-x",
              title: "닫기",
              onPointerDown: (e) => e.stopPropagation(),
              onClick: onClose,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "handout-present-scroll", children: [
          h.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              className: "handout-present-img",
              src: h.image,
              alt: "",
              title: "클릭하면 크게 보기",
              onClick: () => useUIStore.getState().setLightbox(h.image),
              style: imgAlignStyle(h.imageAlign)
            }
          ),
          h.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "txt handout-present-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkupText, { src: h.body }) })
        ] })
      ]
    }
  );
}
const MAX_ENTRIES = 600;
const SMALL_SRC_CHARS = 24 * 1024;
const cache = /* @__PURE__ */ new Map();
const waiters = /* @__PURE__ */ new Map();
function settle(src, out) {
  cache.set(src, out);
  while (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest === void 0) break;
    cache.delete(oldest);
  }
  for (const fn of waiters.get(src) ?? []) fn(out);
  waiters.delete(src);
}
function useThumb(src, maxPx = 64) {
  const [url, setUrl] = reactExports.useState(() => src ? cache.get(src) : void 0);
  reactExports.useEffect(() => {
    if (!src) {
      setUrl(void 0);
      return;
    }
    const hit = cache.get(src);
    if (hit) {
      setUrl(hit);
      return;
    }
    if (!src.startsWith("data:") || src.length < SMALL_SRC_CHARS) {
      setUrl(src);
      return;
    }
    setUrl(void 0);
    let alive = true;
    const done = (u) => {
      if (alive) setUrl(u);
    };
    const pending = waiters.get(src);
    if (pending) {
      pending.add(done);
      return () => {
        alive = false;
        pending.delete(done);
      };
    }
    const mine = /* @__PURE__ */ new Set([done]);
    waiters.set(src, mine);
    const img = new Image();
    img.onload = () => {
      let out = src;
      try {
        const k = Math.min(1, maxPx / Math.max(img.naturalWidth || 1, img.naturalHeight || 1));
        const w = Math.max(1, Math.round((img.naturalWidth || 1) * k));
        const h = Math.max(1, Math.round((img.naturalHeight || 1) * k));
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        cv.getContext("2d")?.drawImage(img, 0, 0, w, h);
        out = cv.toDataURL("image/webp", 0.72);
      } catch {
      }
      settle(src, out);
    };
    img.onerror = () => settle(src, src);
    img.src = src;
    return () => {
      alive = false;
      mine.delete(done);
    };
  }, [src, maxPx]);
  return url;
}
const MAX_DECKS = 12;
const MAX_CARDS = 120;
const MAX_TOTAL = 400;
const DRAW_CHOICES = [1, 2, 3, 5];
function toDraft(d) {
  return {
    id: d.id,
    name: d.name,
    cards: d.cards.map((c) => ({ ...c })),
    announce: d.announce,
    reshuffle: d.reshuffle,
    revealCards: d.revealCards,
    who: d.who
  };
}
function blankDraft() {
  return {
    name: "",
    cards: [blankDeckCard()],
    announce: true,
    reshuffle: false,
    revealCards: true,
    who: "all"
  };
}
function CardThumb({ image, size = 34 }) {
  const thumb = useThumb(image ? resolveAssetUrl(image) : void 0, size * 2);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "deck-thumb",
      style: {
        width: size,
        height: size,
        backgroundImage: thumb ? `url(${thumb})` : void 0
      },
      children: !thumb && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "style", size: Math.round(size * 0.5) })
    }
  );
}
function DeckEditor({
  draft,
  setDraft,
  onSave,
  onCancel
}) {
  const [picking, setPicking] = reactExports.useState(null);
  const total = countDeckCards(draft.cards);
  const patchCard = (id, patch) => setDraft({ ...draft, cards: draft.cards.map((c) => c.id === id ? { ...c, ...patch } : c) });
  const addCard = () => {
    if (draft.cards.length >= MAX_CARDS) return;
    setDraft({ ...draft, cards: [...draft.cards, blankDeckCard()] });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-editor", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "input",
        value: draft.name,
        maxLength: 40,
        placeholder: "덱 이름 (예: 타로 22장)",
        onChange: (e) => setDraft({ ...draft, name: e.target.value })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-opts", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "deck-opt", title: "끄면 채팅에 남지 않습니다. 아래 ‘뽑은 카드’로는 방 전원이 봅니다.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: draft.announce,
            onChange: (e) => setDraft({ ...draft, announce: e.target.checked })
          }
        ),
        "뽑기 결과를 채팅에 출력"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "deck-opt", title: "끄면 참가자에게 덱 이름과 남은 장수만 보입니다.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: draft.revealCards,
            onChange: (e) => setDraft({ ...draft, revealCards: e.target.checked })
          }
        ),
        "카드 목록 공개"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "deck-opt", title: "다 떨어지면 버린 더미를 걷어 다시 섞습니다.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: draft.reshuffle,
            onChange: (e) => setDraft({ ...draft, reshuffle: e.target.checked })
          }
        ),
        "다 뽑으면 자동으로 다시 섞기"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "deck-opt", title: "GM만 뽑게 하려면 끄세요.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: draft.who === "all",
            onChange: (e) => setDraft({ ...draft, who: e.target.checked ? "all" : "gm" })
          }
        ),
        "참가자도 뽑기 가능"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-cards-h", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        "카드 ",
        draft.cards.length,
        "종"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
        "총 ",
        total,
        "장 ",
        total > MAX_TOTAL ? `(${MAX_TOTAL}장까지만 담깁니다)` : ""
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "mbtn",
          style: { marginLeft: "auto" },
          disabled: draft.cards.length >= MAX_CARDS,
          onClick: addCard,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
            " 카드 추가"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-cards", children: draft.cards.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-card-edit", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "deck-thumb-btn",
          title: c.image ? "그림 바꾸기" : "라이브러리에서 그림 고르기",
          onClick: () => setPicking(c.id),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardThumb, { image: c.image, size: 40 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-card-fields", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input sm",
              value: c.name,
              maxLength: 60,
              placeholder: `카드 ${i + 1} 이름`,
              onChange: (e) => patchCard(c.id, { name: e.target.value })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "deck-count", title: "같은 카드를 몇 장 넣을지", children: [
            "×",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input sm",
                type: "number",
                min: 1,
                max: 99,
                value: c.count ?? 1,
                onChange: (e) => patchCard(c.id, { count: Math.max(1, Math.min(99, Number(e.target.value) || 1)) })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input sm",
            value: c.text ?? "",
            maxLength: 300,
            placeholder: "설명 (뽑았을 때 함께 표시 · 선택)",
            onChange: (e) => patchCard(c.id, { text: e.target.value })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-card-acts", children: [
        c.image && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "그림 지우기", onClick: () => patchCard(c.id, { image: void 0 }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "hide_image", size: 15 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "이 카드 지우기",
            disabled: draft.cards.length <= 1,
            onClick: () => setDraft({ ...draft, cards: draft.cards.filter((x) => x.id !== c.id) }),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 })
          }
        )
      ] })
    ] }, c.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-editor-foot", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "카드 구성을 바꿔 저장하면 남은 더미가 다시 섞입니다. 이름·설정만 고치면 판은 그대로예요." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: onCancel, children: "취소" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm pri", onClick: onSave, disabled: !draft.name.trim(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "save", size: 14 }),
        " 저장"
      ] })
    ] }),
    picking && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LibraryPanel,
      {
        pickMode: true,
        onPick: (a) => {
          patchCard(picking, { image: a.dataUrl });
          setPicking(null);
        },
        onClose: () => setPicking(null)
      }
    )
  ] });
}
function DeckRow({ deck, isGM }) {
  const store = useDeckStore;
  const [secret, setSecret] = reactExports.useState(false);
  const canDraw = isGM || deck.who === "all";
  const byId = reactExports.useMemo(() => new Map(deck.cards.map((c) => [c.id, c])), [deck.cards]);
  const recent = reactExports.useMemo(() => deck.discard.slice(-12).reverse(), [deck.discard]);
  const empty = deck.remaining === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-card-h", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "deck-name", children: deck.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "deck-left" + (empty ? " out" : ""), children: [
        deck.remaining,
        " / ",
        deck.total,
        "장"
      ] }),
      deck.who === "gm" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", title: "이 덱은 GM만 뽑을 수 있습니다", children: "GM 전용" }),
      !deck.announce && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip", title: "뽑은 결과가 채팅에 남지 않습니다. 아래 ‘뽑은 카드’에는 그대로 쌓입니다.", children: "채팅 출력 꺼짐" }),
      isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-card-acts", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "다시 섞기 (버린 더미까지 걷어 새로)", onClick: () => store.getState().shuffle(deck.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "shuffle", size: 15 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "덱 고치기", onClick: () => store.getState().edit(deck.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 15 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "iconbtn",
            title: "덱 삭제",
            onClick: () => {
              void confirmDialog(`‘${deck.name}’ 덱을 삭제할까요?`).then((ok) => {
                if (ok) store.getState().remove(deck.id);
              });
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 })
          }
        )
      ] })
    ] }),
    canDraw ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-draw", children: [
      DRAW_CHOICES.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "btn sm" + (n === 1 ? " pri" : ""),
          disabled: empty && !deck.reshuffle,
          title: empty && !deck.reshuffle ? "남은 카드가 없습니다. GM이 다시 섞어야 해요." : `${n}장 뽑기`,
          onClick: () => store.getState().draw(deck.id, n, secret),
          children: [
            n,
            "장 뽑기"
          ]
        },
        n
      )),
      deck.announce && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "deck-opt", title: "뽑은 결과를 GM과 나만 봅니다", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: secret, onChange: (e) => setSecret(e.target.checked) }),
        "비밀로"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: "2px 2px 6px" }, children: "이 덱은 GM만 뽑을 수 있습니다." }),
    empty && !deck.reshuffle && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-empty", children: [
      "남은 카드가 없습니다. ",
      isGM ? "‘다시 섞기’로 한 벌을 새로 만드세요." : "GM이 다시 섞어야 이어서 뽑을 수 있어요."
    ] }),
    recent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-discard", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "deck-discard-h muted small",
          title: "방 전원이 봅니다. ‘비밀로’ 뽑은 카드는 GM과 뽑은 사람에게만 보입니다.",
          children: [
            "뽑은 카드 (최근 순 · ",
            deck.discard.length,
            "장)"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-discard-list", children: recent.map((id, i) => {
        const c = byId.get(id);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-chip", title: c?.text || c?.name || id, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardThumb, { image: c?.image, size: 26 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: c?.name ?? "카드" })
        ] }, id + i);
      }) })
    ] })
  ] });
}
function DeckPanelBody() {
  const decks = useDeckStore((s) => s.decks);
  const editingId = useDeckStore((s) => s.editingId);
  const transport = useDeckStore((s) => s.transport);
  const isGM = useNetStore((s) => s.self?.role === "GM");
  const [draft, setDraft] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!editingId) return;
    const d = useDeckStore.getState().decks.find((x) => x.id === editingId);
    if (d) setDraft(toDraft(d));
    else useDeckStore.getState().edit(null);
  }, [editingId]);
  const save = () => {
    if (!draft) return;
    const nameless = draft.cards.filter((c) => !c.name.trim());
    const cards = draft.cards.filter((c) => c.name.trim());
    if (!cards.length) {
      void alertDialog({ title: "카드가 없습니다", message: "카드 이름을 하나 이상 적어 주세요." });
      return;
    }
    if (nameless.length) {
      void alertDialog({
        title: "이름 없는 카드가 있습니다",
        message: `이름을 적지 않은 칸 ${nameless.length}개는 저장되지 않습니다. 이름을 적거나 그 칸을 지워 주세요.`
      });
      return;
    }
    if (!draft.id && decks.length >= MAX_DECKS) {
      void alertDialog({
        title: "덱을 더 만들 수 없습니다",
        message: `한 방에 담을 수 있는 덱은 ${MAX_DECKS}개까지입니다. 쓰지 않는 덱을 지운 뒤 다시 저장해 주세요.`
      });
      return;
    }
    useDeckStore.getState().save({ ...draft, cards });
    useDeckStore.getState().edit(null);
    setDraft(null);
  };
  if (!transport) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 14, lineHeight: 1.7 }, children: "덱은 서버에 접속한 세션방에서 씁니다." });
  }
  if (draft && (editingId ? draft.id === editingId : draft.id === void 0)) {
    const cancel = () => {
      useDeckStore.getState().edit(null);
      setDraft(null);
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DeckEditor, { draft, setDraft, onSave: save, onCancel: cancel });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-body", children: [
    isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-actions", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "mbtn", onClick: () => setDraft(blankDraft()), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
        " 새 덱 만들기"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "카드를 짜 두면 방 참가자가 뽑을 수 있어요.", label: "새 덱 만들기 설명" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-list", children: decks.length ? decks.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(DeckRow, { deck: d, isGM }, d.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 14, lineHeight: 1.7 }, children: isGM ? "아직 덱이 없습니다. ‘새 덱 만들기’로 카드를 짜 보세요." : "GM이 아직 덱을 만들지 않았습니다." }) })
  ] });
}
function DeckPanel() {
  const closeWindow = useUIStore((s) => s.closeWindow);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: "deck",
      title: "덱",
      icon: "style",
      onClose: () => closeWindow("deck"),
      defaultW: 520,
      defaultH: 560,
      minW: 380,
      minH: 280,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeckPanelBody, {})
    }
  );
}
function weaponSkillValue(skills, w) {
  if (w.skillRef) return skills.find((s) => s.name === w.skillRef)?.value ?? w.skill;
  return w.skill;
}
function resolveDamage(expr, db) {
  const raw = (expr || "").trim();
  if (!raw) return "0";
  if (!/\bdb\b/i.test(raw)) return raw;
  const dbNorm = (db || "").trim();
  const noBonus = !dbNorm || /^[+-]?0$/.test(dbNorm);
  if (noBonus) {
    const out = raw.replace(/\s*\+?\s*\bdb\b/gi, "").trim();
    return out || "0";
  }
  return raw.replace(/\bdb\b/gi, dbNorm).replace(/\+\s*-/g, "- ").replace(/\+\s*\+/g, "+ ");
}
const COC_CHARS = [
  { key: "STR", label: "근력" },
  { key: "CON", label: "건강" },
  { key: "SIZ", label: "크기" },
  { key: "DEX", label: "민첩" },
  { key: "APP", label: "외모" },
  { key: "INT", label: "지능" },
  { key: "POW", label: "정신력" },
  { key: "EDU", label: "교육" }
];
function stCalcSkills(c, ruleset) {
  const ins = c.extra?.insane ?? {};
  const nf = ruleset?.skillGrid?.fields?.length ?? 0, rows = ruleset?.skillGrid?.rows ?? 11;
  if (!nf) return [];
  const W = nf * 2 - 1, blocked = new Set(ins.blocked ?? []), acq = ins.acquired ?? [];
  const D = Array.from({ length: rows }, () => Array(W).fill(1e9)), q = [];
  for (const k of acq) {
    const [f, r] = k.split(":").map(Number);
    if (r < rows && f < nf) { D[r][2 * f] = 0; q.push([r, 2 * f]); }
  }
  for (let i = 0; i < q.length; i++) {
    const [r, cc] = q[i];
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr;
      let nc = cc + dc;
      if (nc > 0 && nc % 2 === 1 && blocked.has((nc - 1) / 2 + ":" + nr)) nc += dc;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= W) continue;
      if (D[nr][nc] > D[r][cc] + 1) { D[nr][nc] = D[r][cc] + 1; q.push([nr, nc]); }
    }
  }
  const out = [];
  for (let f = 0; f < nf; f++) for (let r = 0; r < rows; r++) {
    const name = ins.cells?.[f]?.[r] ?? ruleset?.skillGrid?.cells?.[f]?.[r] ?? "";
    if (name) out.push({ label: name, target: acq.length ? Math.min(12, 5 + D[r][2 * f]) : 12 });
  }
  return out;
}
function buildPalette(c, ruleset, sheetKind) {
  const kind = ruleset?.kind ?? sheetKind ?? "coc";
  const out = [];
  if (ruleset?.id === "stratoshout") {
    for (const s of stCalcSkills(c, ruleset)) out.push({ label: s.label, command: `${s.label} (2d6≥${s.target})`, strato: s.target });
  } else if (kind === "coc") {
    const chars = ruleset?.characteristics?.length ? ruleset.characteristics : COC_CHARS;
    const cs = c.characteristics;
    for (const { key, label } of chars) {
      const v = cs?.[key];
      if (typeof v === "number" && v > 0) out.push({ label, command: `CC<=${v} (${label})`, target: v });
    }
    const luck = c.status?.luck;
    if (typeof luck === "number" && luck > 0)
      out.push({ label: "행운", command: `CC<=${luck} (행운)`, target: luck });
    for (const s of c.skills ?? []) {
      if (!s.name || !(s.value > 0)) continue;
      out.push({ label: s.name, command: `CC<=${s.value} (${s.name})`, target: s.value });
    }
    const db = deriveBuildAndDB(c.characteristics?.STR ?? 0, c.characteristics?.SIZ ?? 0).db;
    for (const w of c.weapons ?? []) {
      if (!w.name) continue;
      const v = weaponSkillValue(c.skills ?? [], w);
      if (typeof v === "number" && v > 0) out.push({ label: w.name, command: `CC<=${v} (${w.name})`, target: v });
      const dmg = resolveDamage(w.damage, db);
      if (dmg && dmg !== "0") out.push({ label: `${w.name} 피해`, command: `${dmg} (${w.name} 피해)` });
    }
  } else if (kind === "basic") {
    for (const r of c.customRolls ?? []) {
      const expr = (r.expr || "").trim();
      if (!expr) continue;
      out.push({ label: r.label || expr, command: expr });
    }
  }
  return out;
}
function matchPalette(entries, input, max = 7) {
  const q = input.trim().toLowerCase();
  if (!q || q.length > 24) return [];
  const exact = [];
  const starts = [];
  const contains = [];
  for (const e of entries) {
    const name = e.label.toLowerCase();
    if (name === q) exact.push(e);
    else if (name.startsWith(q)) starts.push(e);
    else if (q.length >= 2 && name.includes(q)) contains.push(e);
  }
  return [...exact, ...starts, ...contains].slice(0, max);
}
function ccCommand(target, label, bonus) {
  const sign = bonus > 0 ? `+${bonus}` : bonus < 0 ? String(bonus) : "";
  return `CC${sign}<=${target} (${label})`;
}
function withCheckBonus(command, bonus) {
  if (!bonus) return command;
  if (/^\s*(?:밀어붙이기|push\s+)?\s*(?:CC|1d100)\s*[+-]\d/i.test(command)) return command;
  const sign = bonus > 0 ? `+${bonus}` : String(bonus);
  return command.replace(/^(\s*(?:밀어붙이기\s+|push\s+)?)(CC|1d100)(\s*)(<=|>=)/i, `$1$2${sign}$3$4`);
}
const SLOT_GROUPS = ["상단", "본문", "강조", "면적"];
const COLOR_SLOTS = [
  { key: "title", label: "상단 제목", def: "#ffffff", group: "상단" },
  { key: "eyebrowColor", label: "상단 라벨", def: "#caa14a", group: "상단" },
  { key: "headTop", label: "헤더 위", def: "#3a2230", group: "상단" },
  { key: "headBottom", label: "헤더 아래", def: "#161a26", group: "상단" },
  { key: "text", label: "본문 글자", def: "#e9ecf6", group: "본문" },
  { key: "accentText", label: "섹션 제목", def: "#c24d42", group: "본문" },
  { key: "num", label: "숫자", def: "#c24d42", group: "본문" },
  { key: "check", label: "체크박스", def: "#c24d42", group: "본문" },
  { key: "color", label: "강조색", def: "#c24d42", group: "강조" },
  { key: "orn", label: "오너먼트·빛", def: "#caa14a", group: "강조" },
  { key: "border", label: "테두리·라인", def: "#3a4670", group: "강조" },
  { key: "bar", label: "상태 바", def: "#ef6a6a", group: "강조" },
  { key: "bg", label: "배경", def: "#11141f", group: "면적" },
  { key: "tab", label: "탭 바", def: "#1a1f2e", group: "면적" },
  { key: "tabActive", label: "활성 탭", def: "#26304a", group: "면적" },
  { key: "field", label: "빈칸·셀", def: "#1a1f2e", group: "면적" },
  { key: "card", label: "내부 카드", def: "#161a26", group: "면적" },
  { key: "section", label: "섹션 띠", def: "#2a3350", group: "면적" }
];
function AreaGrad({
  label,
  value,
  onChange
}) {
  const on = !!value;
  const g = value ?? { from: "#8a90a0", to: "#1a1f2e", angle: 180 };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-grad" + (on ? " on" : ""), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "pal-grad-top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: on, onChange: (e) => onChange(e.target.checked ? g : void 0) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pal-grad-name", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "pal-grad-prev",
          "aria-hidden": true,
          style: { background: `linear-gradient(${g.angle ?? 180}deg, ${g.from}, ${g.to})`, opacity: on ? 1 : 0.35 }
        }
      )
    ] }),
    on && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-grad-ctl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ColorField, { value: g.from, def: "#8a90a0", title: "시작색", copy: false, onChange: (hex) => onChange({ ...g, from: hex || g.from }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ColorField, { value: g.to, def: "#1a1f2e", title: "끝색", copy: false, onChange: (hex) => onChange({ ...g, to: hex || g.to }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "pal-grad-dir", value: String(g.angle ?? 180), title: "그라데이션 방향", onChange: (e) => onChange({ ...g, angle: Number(e.target.value) }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "180", children: "↓ 아래로" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "0", children: "↑ 위로" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "90", children: "→ 오른쪽" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "270", children: "← 왼쪽" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "135", children: "↘ 우하향" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "45", children: "↗ 우상향" })
      ] })
    ] })
  ] });
}
function SheetPalette({
  ap,
  updateSheet,
  onExport,
  onImport
}) {
  const sheetPalettePos = useUIStore((s) => s.sheetPalettePos);
  const setSheetPalettePos = useUIStore((s) => s.setSheetPalettePos);
  const paletteRef = reactExports.useRef(null);
  const charFileInput = reactExports.useRef(null);
  const [palette, setPalette] = reactExports.useState(false);
  const [palTab, setPalTab] = reactExports.useState("theme");
  const [bgPicker, setBgPicker] = reactExports.useState(false);
  const sheetStyle = ap.style ?? "gradient";
  const sheetBgImage = ap.bgImage ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sheet-color", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "swatch", style: { background: "var(--sheet)" }, title: "시트 색·테마 변경", onClick: () => setPalette((p) => !p) }),
    palette && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "palette" + (sheetPalettePos ? " floating" : ""),
        ref: paletteRef,
        style: sheetPalettePos ? { position: "fixed", left: sheetPalettePos.x, top: sheetPalettePos.y, right: "auto" } : void 0,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "pal-head",
              onPointerDown: (e) => {
                if (e.target.closest("button")) return;
                const r = paletteRef.current?.getBoundingClientRect();
                if (r) beginPanelDrag(e, { x: r.left, y: r.top }, (x, y) => setSheetPalettePos({ x, y }));
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "palette", size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pal-head-t", children: "시트 색·테마" }),
                sheetPalettePos && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "pal-head-btn", title: "기본 위치로", onClick: () => setSheetPalettePos(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "filter_center_focus", size: 13 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "pal-head-btn", title: "닫기", onClick: () => setPalette(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-tabs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "pal-tab" + (palTab === "theme" ? " on" : ""), onClick: () => setPalTab("theme"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "palette", size: 13 }),
              " 테마"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "pal-tab" + (palTab === "custom" ? " on" : ""), onClick: () => setPalTab("custom"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "tune", size: 13 }),
              " 색 커스텀"
            ] })
          ] }),
          palTab === "theme" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pal-gallery", children: SHEET_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "pal-theme",
                title: `'${p.name}' 테마를 이 시트에 적용`,
                style: {
                  background: p.theme.bg || "#1b2030",
                  color: p.theme.text || (p.dark ? "#eef1f7" : "#14171e"),
                  borderColor: p.theme.border || p.theme.color || "var(--line2)"
                },
                onClick: () => updateSheet(p.theme),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "pal-theme-dots", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: p.theme.color || "#888" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: p.theme.num || p.theme.color || "#888" } }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { background: p.theme.orn || p.theme.eyebrowColor || "#888" } })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pal-theme-name", children: p.name })
                ]
              },
              p.name
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-slot-actions", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "pal-preset", title: "이 시트 외형을 기본값(흰 배경 무채색)으로 되돌립니다", onClick: () => updateSheet(DEFAULT_SHEET_THEME), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 13 }),
                " 기본값"
              ] }),
              onExport && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "pal-preset", title: "캐릭터 전체를 파일(.occhar.json)로 내보냅니다", onClick: onExport, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 13 }),
                " 내보내기"
              ] }),
              onImport && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "pal-preset", title: "저장한 캐릭터 파일(.occhar.json)을 새 캐릭터로 불러옵니다", onClick: () => charFileInput.current?.click(), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "upload", size: 13 }),
                  " 불러오기"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: charFileInput, type: "file", accept: ".json,application/json", hidden: true, onChange: onImport })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            SLOT_GROUPS.map((group) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-cat", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pal-cat-h", children: group }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pal-grid", children: COLOR_SLOTS.filter((s) => s.group === group).map((slot) => {
                const cv = ap[slot.key] ?? "";
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-slot", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ColorField, { value: cv, def: slot.def, title: slot.label, onChange: (hex) => updateSheet({ [slot.key]: hex }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pal-slot-lbl", children: slot.label }),
                  cv && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "pal-reset", title: "기본값으로", onClick: () => updateSheet({ [slot.key]: "" }), children: "↺" })
                ] }, slot.key);
              }) })
            ] }, group)),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-cat", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pal-cat-h", children: "면적 그라데이션" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AreaGrad, { label: "배경", value: ap.bgGrad, onChange: (g) => updateSheet({ bgGrad: g }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AreaGrad, { label: "상단 헤더", value: ap.headGrad, onChange: (g) => updateSheet({ headGrad: g }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AreaGrad, { label: "탭 바", value: ap.tabGrad, onChange: (g) => updateSheet({ tabGrad: g }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AreaGrad, { label: "섹션 카드", value: ap.cardGrad, onChange: (g) => updateSheet({ cardGrad: g }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AreaGrad, { label: "상태 바", value: ap.barGrad, onChange: (g) => updateSheet({ barGrad: g }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pal-lbl", children: "배경 이미지" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-inline", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "pal-chip", onClick: () => setBgPicker(true), children: sheetBgImage ? "변경" : "선택" }),
                sheetBgImage && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "pal-chip", onClick: () => updateSheet({ bgImage: "" }), children: "제거" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-row", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pal-lbl", children: "배경 채움" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pal-inline", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "pal-opt" + (sheetStyle === "gradient" ? " on" : ""), onClick: () => updateSheet({ style: "gradient" }), children: "그라데이션" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "pal-opt" + (sheetStyle === "solid" ? " on" : ""), onClick: () => updateSheet({ style: "solid" }), children: "단색" })
              ] })
            ] })
          ] })
        ]
      }
    ),
    bgPicker && /* @__PURE__ */ jsxRuntimeExports.jsx(
      LibraryPanel,
      {
        pickMode: true,
        onPick: (a) => {
          updateSheet({ bgImage: a.dataUrl });
          setBgPicker(false);
        },
        onClose: () => setBgPicker(false)
      }
    )
  ] });
}
const TABS$1 = [
  { id: "ability", label: "특성치" },
  { id: "skills", label: "기능치" },
  { id: "combat", label: "전투 · 무기" },
  { id: "background", label: "배경" },
  { id: "standing", label: "스탠딩 · 표정" },
  { id: "secret", label: "비밀 메모" }
];
const SCROLL_TABS = ["ability", "skills", "combat", "background"];
function pct$1(cur, max) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(cur / max * 100)));
}
function Info({
  label,
  v,
  edit,
  type
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: label }),
    edit ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "input sm",
        type,
        value: v,
        onChange: (e) => edit(e.target.value),
        style: { width: "100%" }
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "v", children: v })
  ] });
}
function Bgf({
  label,
  v,
  edit,
  rows = 2
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgf", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: label }),
    edit ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: "input",
        value: v,
        onChange: (e) => edit(e.target.value),
        rows,
        style: { resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 }
      }
    ) : (
      // 빈 칸은 테두리만 남아 '안 보이는 것'처럼 읽힌다 — 소지품·기본 시트와 같은 표시로 맞춘다.
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "txt", children: v || "없음" })
    )
  ] });
}
function Tracker$1({
  label,
  cur,
  max,
  kind,
  note,
  onEdit
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk-h", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "l", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trk-ctl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stp", title: "감소", onClick: () => onEdit(cur - 1), children: "−" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "trk-num",
            type: "number",
            value: cur,
            onChange: (e) => onEdit(parseInt(e.target.value, 10) || 0)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
          "/ ",
          max
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stp", title: "증가", onClick: () => onEdit(cur + 1), children: "+" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bar " + kind, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: pct$1(cur, max) + "%" } }) }),
    note && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "trk-chk", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: note }) })
  ] });
}
const STAT_LOG_KEYS = [
  ["hp", "체력"],
  ["mp", "마력"],
  ["san", "이성"]
];
const STAT_LOG_SETTLE_MS = 800;
function CharacterSheet({
  charId,
  winId,
  viewCharacter,
  readOnly,
  embed,
  onPatch
} = {}) {
  const closeWindow = useUIStore((s) => s.closeWindow);
  const openWindow = useUIStore((s) => s.openWindow);
  const nameColor = useUIStore((s) => s.nameColor);
  const secretMode = useUIStore((s) => s.secretMode);
  const sendStat = useNetStore((s) => s.sendStat);
  const inRoomForLog = useNetStore((s) => s.roomId !== null);
  const statLogOn = useUIStore((s) => s.statLog);
  const statLogRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const queueStatLog = (key, req) => {
    const pending = statLogRef.current;
    const prev = pending.get(key);
    if (prev) clearTimeout(prev.timer);
    const merged = prev ? { ...req, from: prev.req.from } : req;
    const timer = setTimeout(() => {
      pending.delete(key);
      if (merged.from !== merged.to) sendStat(merged);
    }, STAT_LOG_SETTLE_MS);
    pending.set(key, { req: merged, timer });
  };
  reactExports.useEffect(() => {
    const pending = statLogRef.current;
    return () => {
      for (const { req, timer } of pending.values()) {
        clearTimeout(timer);
        if (req.from !== req.to) sendStat(req);
      }
      pending.clear();
    };
  }, [sendStat]);
  const checkBonus = useUIStore((s) => s.checkBonus);
  const setCheckBonus = useUIStore((s) => s.setCheckBonus);
  const storeCharacter = useCharacterStore(activeCharacter);
  const charById = useCharacterStore((s) => charId ? s.characters[charId] : void 0);
  const selectCharacter = useCharacterStore((s) => s.selectCharacter);
  const upsertCharacter = useCharacterStore((s) => s.upsertCharacter);
  const character = viewCharacter ?? charById ?? storeCharacter;
  const ruleset = useRulesetStore((s) => resolveRuleset(s, character.rulesetId ?? "coc7e"));
  const CHARS = rsCharacteristics(ruleset);
  const madnessTables = rsMadness(ruleset);
  const rulesetMissing = CHARS.length === 0;
  const foreignEdit = !!onPatch;
  const ro = !!readOnly && !foreignEdit;
  const applyEx = (next) => onPatch?.(next);
  const ap = character.sheet ?? {};
  const sv = computeSheetVars(ap);
  const sheetEyebrow = ap.eyebrow ?? "";
  const sUpdateSheet = useCharacterStore((s) => s.updateSheet);
  const sToggleSkillCheck = useCharacterStore((s) => s.toggleSkillCheck);
  const sUpdateCharacteristic = useCharacterStore((s) => s.updateCharacteristic);
  const sUpdateStatus = useCharacterStore((s) => s.updateStatus);
  const sUpdateSkillValue = useCharacterStore((s) => s.updateSkillValue);
  const sUpdateInfo = useCharacterStore((s) => s.updateInfo);
  const sUpdateBackground = useCharacterStore((s) => s.updateBackground);
  const sUpdateSecret = useCharacterStore((s) => s.updateSecret);
  const sUpdateAssets = useCharacterStore((s) => s.updateAssets);
  const sAddSkill = useCharacterStore((s) => s.addSkill);
  const sRemoveSkill = useCharacterStore((s) => s.removeSkill);
  const sAddWeapon = useCharacterStore((s) => s.addWeapon);
  const sUpdateWeapon = useCharacterStore((s) => s.updateWeapon);
  const sRemoveWeapon = useCharacterStore((s) => s.removeWeapon);
  const sSetHeadshot = useCharacterStore((s) => s.setHeadshot);
  const sSetExpression = useCharacterStore((s) => s.setExpression);
  const sAddStanding = useCharacterStore((s) => s.addStanding);
  const sRemoveStanding = useCharacterStore((s) => s.removeStanding);
  const sSetStandingHeadshot = useCharacterStore((s) => s.setStandingHeadshot);
  const sSetStandingCommand = useCharacterStore((s) => s.setStandingCommand);
  const sSetStandingHeight = useCharacterStore((s) => s.setStandingHeight);
  const updateSheet = foreignEdit ? (patch) => applyEx(charEdits.updateSheet(character, patch)) : sUpdateSheet;
  const toggleSkillCheck = foreignEdit ? (name) => applyEx(charEdits.toggleSkillCheck(character, name)) : sToggleSkillCheck;
  const updateCharacteristic = foreignEdit ? (key, value) => applyEx(charEdits.updateCharacteristic(character, key, value)) : sUpdateCharacteristic;
  const applyStatus = foreignEdit ? (patch) => applyEx(charEdits.updateStatus(character, patch)) : sUpdateStatus;
  const updateStatus = (patch, roll2) => {
    const before = character.status;
    applyStatus(patch);
    if (!statLogOn || !inRoomForLog) return;
    for (const [key, label] of STAT_LOG_KEYS) {
      const to = patch[key];
      const from = before[key];
      if (typeof to !== "number" || typeof from !== "number" || to === from) continue;
      const max = key === "hp" ? d.hpMax : key === "mp" ? d.mpMax : before.sanStart;
      const rawName = character.info?.name?.trim() || "이름 없음";
      const who = rawName.length > 24 ? rawName.slice(0, 23) + "…" : rawName;
      const hush = roll2 ? roll2.secret : secretMode;
      queueStatLog(key, {
        channel: roll2?.channel ?? "main",
        groupId: roll2?.groupId,
        secret: hush ? true : void 0,
        open: hush ? void 0 : true,
        charId: character.id,
        label: `${who} · ${label}`,
        from,
        to,
        max
      });
    }
  };
  const applyNameColor = (color) => {
    const next = { ...character, nameColor: color };
    if (foreignEdit) applyEx(next);
    else upsertCharacter(next);
  };
  const updateSkillValue = foreignEdit ? (name, value) => applyEx(charEdits.updateSkillValue(character, name, value)) : sUpdateSkillValue;
  const updateInfo = foreignEdit ? (patch) => applyEx(charEdits.updateInfo(character, patch)) : sUpdateInfo;
  const updateBackground = foreignEdit ? (patch) => applyEx(charEdits.updateBackground(character, patch)) : sUpdateBackground;
  const updateSecret = foreignEdit ? (secret) => applyEx(charEdits.updateSecret(character, secret)) : sUpdateSecret;
  const updateAssets = foreignEdit ? (patch) => applyEx(charEdits.updateAssets(character, patch)) : sUpdateAssets;
  const addSkill = foreignEdit ? (name) => applyEx(charEdits.addSkill(character, name)) : sAddSkill;
  const removeSkill = foreignEdit ? (name) => applyEx(charEdits.removeSkill(character, name)) : sRemoveSkill;
  const addWeapon = foreignEdit ? () => applyEx(charEdits.addWeapon(character)) : sAddWeapon;
  const updateWeapon = foreignEdit ? (index, patch) => applyEx(charEdits.updateWeapon(character, index, patch)) : sUpdateWeapon;
  const removeWeapon = foreignEdit ? (index) => applyEx(charEdits.removeWeapon(character, index)) : sRemoveWeapon;
  const setHeadshot = foreignEdit ? (url) => applyEx(charEdits.setHeadshot(character, url)) : sSetHeadshot;
  const setExpression = foreignEdit ? (index) => applyEx(charEdits.setExpression(character, index)) : sSetExpression;
  const addStanding = foreignEdit ? (url) => applyEx(charEdits.addStanding(character, url)) : sAddStanding;
  const removeStanding = foreignEdit ? (index) => applyEx(charEdits.removeStanding(character, index)) : sRemoveStanding;
  const setStandingHeadshot = foreignEdit ? (index, url) => applyEx(charEdits.setStandingHeadshot(character, index, url)) : sSetStandingHeadshot;
  const setStandingCommand = foreignEdit ? (index, command) => applyEx(charEdits.setStandingCommand(character, index, command)) : sSetStandingCommand;
  const setStandingHeight = foreignEdit ? (h) => applyEx(charEdits.setStandingHeight(character, h)) : sSetStandingHeight;
  const [heightInput, setHeightInput] = reactExports.useState(
    character.portrait.standingHeight != null ? String(character.portrait.standingHeight) : ""
  );
  reactExports.useEffect(() => {
    setHeightInput(character.portrait.standingHeight != null ? String(character.portrait.standingHeight) : "");
  }, [character.id]);
  const chatRoll = useChatStore((s) => s.roll);
  const [query, setQuery] = reactExports.useState("");
  const [sanLoss, setSanLoss] = reactExports.useState("1/1d6");
  const [tab, setTab] = reactExports.useState("ability");
  const [editingState, setEditing] = reactExports.useState(false);
  const editing = editingState;
  const [newSkill, setNewSkill] = reactExports.useState("");
  const [headshotSlot, setHeadshotSlot] = reactExports.useState(null);
  const headshotInput = reactExports.useRef(null);
  const standingInput = reactExports.useRef(null);
  const slotHeadshotInput = reactExports.useRef(null);
  const mbodyRef = reactExports.useRef(null);
  const secRefs = {
    ability: reactExports.useRef(null),
    skills: reactExports.useRef(null),
    combat: reactExports.useRef(null),
    background: reactExports.useRef(null)
  };
  const scrollView = tab !== "secret" && tab !== "standing";
  function scrollToSec(id) {
    setTab(id);
    if (id === "secret" || id === "standing") return;
    requestAnimationFrame(() => {
      const el = secRefs[id].current;
      const mb = mbodyRef.current;
      if (el && mb)
        mb.scrollTo({
          top: mb.scrollTop + (el.getBoundingClientRect().top - mb.getBoundingClientRect().top) - 6
        });
    });
  }
  function onMbodyScroll() {
    if (tab === "secret" || tab === "standing") return;
    const mb = mbodyRef.current;
    if (!mb) return;
    const mbTop = mb.getBoundingClientRect().top;
    let active = SCROLL_TABS[0];
    for (const t of SCROLL_TABS) {
      const el = secRefs[t].current;
      if (el && el.getBoundingClientRect().top - mbTop <= 90) active = t;
    }
    if (active !== tab) setTab(active);
  }
  async function onPickHeadshot(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setHeadshot(await fileToPortraitHeadshot(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function onPickStanding(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (character.portrait.standings.length >= MAX_STANDINGS) {
      await alertDialog(`스탠딩은 최대 ${MAX_STANDINGS}개까지 등록할 수 있습니다.`);
      return;
    }
    try {
      addStanding(await fileToPortraitStanding(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function onPickSlotHeadshot(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || headshotSlot == null) {
      setHeadshotSlot(null);
      return;
    }
    try {
      setStandingHeadshot(headshotSlot, await fileToPortraitHeadshot(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    } finally {
      setHeadshotSlot(null);
    }
  }
  const c = character.characteristics;
  const age = typeof character.info.age === "number" ? character.info.age : parseInt(String(character.info.age), 10) || 30;
  const mythos = character.skills.find((s) => s.name === "크툴루 신화")?.value ?? 0;
  const d = deriveStats(c, { age });
  const sanMax = deriveSanMax(mythos);
  const sanStart = character.status.sanStart ?? d.sanStart;
  const headshot = character.portrait.headshots?.[0] || character.portrait.headshot;
  function roll(label, value) {
    if (editing || ro) return;
    const dice = rollCheck(value, { command: ccCommand(value, label, checkBonus), bonus: checkBonus, ...customRollOpts(character.rulesetId) });
    setCheckBonus(0);
    chatRoll(
      { kind: "dice", dice: { ...dice, name: label } },
      { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 },
      { secret: secretMode, charId: character.id }
    );
  }
  function exportCharacter() {
    const json = JSON.stringify({ __occharacter: 1, version: 1, character }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(character.info.name || "캐릭터").slice(0, 24)}.occhar.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function onImportCharacter(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const ch = coerceImportedCharacter(parsed);
      if (!ch) {
        await alertDialog("캐릭터 파일에서 시트 정보를 찾지 못했습니다.");
        return;
      }
      upsertCharacter(ch);
      selectCharacter(ch.id);
      openWindow("sheet:" + ch.id);
    } catch (err) {
      await alertDialog("캐릭터 파일을 불러오지 못했습니다: " + err.message);
    }
  }
  function weaponSkillValue$1(w) {
    return weaponSkillValue(character.skills, w);
  }
  function rollWeapon(w) {
    if (editing || ro) return;
    const value = weaponSkillValue$1(w);
    const dice = rollCheck(value, { command: ccCommand(value, w.name, checkBonus), bonus: checkBonus, ...customRollOpts(character.rulesetId) });
    setCheckBonus(0);
    chatRoll(
      { kind: "dice", dice: { ...dice, name: w.name } },
      { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 },
      { secret: secretMode, charId: character.id }
    );
  }
  function rollWeaponDamage(w) {
    if (editing || ro) return;
    const dice = rollSum(resolveDamage(w.damage, d.db), { command: `${w.name} 피해` });
    chatRoll(
      { kind: "dice", dice: { ...dice, name: `${w.name} 피해` } },
      { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 },
      { secret: secretMode, charId: character.id }
    );
  }
  function rollMadness(table) {
    if (editing || ro) return;
    const rm = useNetStore.getState().roomMadness;
    const custom = (rm?.[table] ?? []).map((s) => s.trim()).filter(Boolean);
    const eff = custom.length ? custom : madnessTables[table];
    const sides = eff.length;
    if (sides === 0) {
      void alertDialog("광기표가 비었습니다. 설정 → 룰셋에서 coc7e 를 불러오세요.");
      return;
    }
    const r = Math.floor(Math.random() * sides) + 1;
    const dur = Math.floor(Math.random() * 10) + 1;
    const mode = table === "summary" ? "summary" : "realtime";
    const insanity = table === "realtimeTemp" ? "temporary" : table === "realtimeIndef" ? "indefinite" : void 0;
    const unit = mode === "realtime" ? "라운드" : "시간";
    chatRoll(
      {
        kind: "madness",
        madness: { mode, insanity, roll: r, sides, duration: dur, unit, symptom: eff[r - 1] }
      },
      { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 },
      { secret: secretMode, charId: character.id }
    );
  }
  function rollSanCheck() {
    if (editing || ro) return;
    const expr = sanLoss.trim() || "1/1d6";
    const rollOpts = customRollOpts(character.rulesetId);
    const sanDie = rollOpts?.dice?.trim() || "1d100";
    const sanCmp = rollOpts?.compare === "gte" ? "≥" : "≤";
    const dice = rollSan(character.status.san, expr, { command: `이성 판정 (${sanDie}${sanCmp}${character.status.san})`, ...rollOpts });
    const target = sheetRollTarget();
    chatRoll(
      { kind: "dice", dice: { ...dice, name: "이성 판정" } },
      { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 },
      { secret: secretMode, charId: character.id, ...target }
    );
    if (dice.loss > 0)
      updateStatus(
        { san: Math.max(0, character.status.san - dice.loss) },
        { ...target, secret: secretMode }
      );
  }
  const filteredSkills = character.skills.filter((s) => !query || s.name.includes(query)).sort((a, b) => a.name.localeCompare(b.name, "ko"));
  const skillRows = query ? Math.max(1, Math.ceil(filteredSkills.length / 3)) : Math.max(18, Math.ceil(filteredSkills.length / 3));
  const sheetBody = /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "sheet" + (embed ? " embed" : "") + (sv.solid ? " solid" : "") + (sv.customText ? " customtext" : "") + (sv.customBar ? " custombar" : ""),
      style: sv.vars,
      onPointerDownCapture: charId ? () => selectCharacter(charId) : void 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { disabled: ro, className: "sheet-fs", children: [
        rulesetMissing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              margin: "0 0 10px",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid var(--accent)",
              background: "color-mix(in srgb, var(--accent) 10%, transparent)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "auto_stories", size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { flex: 1 }, children: [
                "이 캐릭터는 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "크툴루 룰셋" }),
                "이 필요합니다. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "coc7e.tkrule.json" }),
                "을 불러오면 특성치·기능·광기표가 표시됩니다."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => useUIStore.getState().setScreen("settings"), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings", size: 13 }),
                " 룰셋 불러오기"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sheet-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "hs",
              style: headshot ? { backgroundImage: `url(${headshot})` } : { background: character.color },
              title: ro ? void 0 : "두상 이미지 변경",
              onClick: ro ? void 0 : () => headshotInput.current?.click(),
              children: [
                headshot ? "" : character.info.name[0],
                !ro && (headshot ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "rm",
                    title: "두상 제거",
                    onClick: (e) => {
                      e.stopPropagation();
                      setHeadshot(void 0);
                    },
                    children: "✕"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cam", children: "📷" }))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: headshotInput, type: "file", accept: "image/*", hidden: true, onChange: onPickHeadshot }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hs-id", children: [
            editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input sm",
                value: sheetEyebrow,
                placeholder: "CALL OF CTHULHU · 7TH EDITION",
                onChange: (e) => updateSheet({ eyebrow: e.target.value }),
                title: "상단 문구 수정",
                style: { width: "100%", maxWidth: 360, marginBottom: 4 }
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-eyebrow", children: sheetEyebrow || "CALL OF CTHULHU · 7TH EDITION" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-name", children: character.info.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hs-meta", children: [
              character.info.occupation,
              " · ",
              character.info.age,
              " · ",
              character.info.gender,
              character.info.residence ? ` · ${character.info.residence}` : ""
            ] })
          ] }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              title: "이 캐릭터로 말할 때 쓸 채팅 이름색. 비우면 내 이름색을 따릅니다.",
              style: { display: "inline-flex", alignItems: "center", gap: 3, cursor: "pointer" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_text", size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: character.nameColor || "#7c9cff",
                    onChange: (e) => applyNameColor(e.target.value),
                    style: { width: 26, height: 22, padding: 0, border: 0, background: "none", cursor: "pointer" }
                  }
                ),
                character.nameColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn sm",
                    title: "이름색 지우기(내 이름색을 따름)",
                    onClick: (e) => {
                      e.preventDefault();
                      applyNameColor(void 0);
                    },
                    children: "✕"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn sm" + (editing ? " pri" : ""),
              title: "시트 편집(값·기능·무기)",
              onClick: () => setEditing((e) => !e),
              children: editing ? "완료" : "편집"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SheetPalette,
            {
              ap,
              updateSheet,
              onExport: exportCharacter,
              onImport: (e) => void onImportCharacter(e)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sheet-tabs", children: TABS$1.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "stab" + (tab === t.id ? " on" : ""),
            onClick: () => scrollToSec(t.id),
            children: t.label
          },
          t.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mbody", ref: mbodyRef, onScroll: onMbodyScroll, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "secgroup",
              ref: secRefs.ability,
              "data-sec": "ability",
              style: { display: scrollView ? void 0 : "none" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "탐사자 정보" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info-grid", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "이름",
                        v: character.info.name,
                        edit: editing ? (val) => updateInfo({ name: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "직업",
                        v: character.info.occupation,
                        edit: editing ? (val) => updateInfo({ occupation: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "나이",
                        v: String(character.info.age),
                        type: "number",
                        edit: editing ? (val) => updateInfo({ age: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "성별",
                        v: character.info.gender,
                        edit: editing ? (val) => updateInfo({ gender: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "플레이어",
                        v: character.info.player,
                        edit: editing ? (val) => updateInfo({ player: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "거주지",
                        v: character.info.residence,
                        edit: editing ? (val) => updateInfo({ residence: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "출생지",
                        v: character.info.birthplace,
                        edit: editing ? (val) => updateInfo({ birthplace: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Info,
                      {
                        label: "재력(CR)",
                        v: String(character.assets.creditRating),
                        type: "number",
                        edit: editing ? (val) => updateAssets({ creditRating: parseInt(val, 10) || 0 }) : void 0
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocrow stat-row", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec grow abil-sec", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
                      "특성치 ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "클릭하면 1d100 판정" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chargrid-official", children: [
                      CHARS.map((meta) => {
                        const v = c[meta.key] ?? 0;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "ostat",
                            title: `${meta.ko}(${meta.key}): 정상 ${v} / 어려운 ${Math.floor(
                              v / 2
                            )} / 극단 ${Math.floor(v / 5)}.`,
                            onClick: () => roll(meta.ko, v),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "roll", children: "🎲" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostat-h", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: meta.key }),
                                " ",
                                meta.ko
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ostat-v", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  className: "input sm",
                                  type: "number",
                                  value: v,
                                  onClick: (e) => e.stopPropagation(),
                                  onChange: (e) => updateCharacteristic(meta.key, parseInt(e.target.value, 10) || 0),
                                  style: { width: "100%", textAlign: "center", fontSize: 18, fontWeight: 800 }
                                }
                              ) : v }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostat-sub", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                  "어려운",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: Math.floor(v / 2) })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                  "극단",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: Math.floor(v / 5) })
                                ] })
                              ] })
                            ]
                          },
                          meta.key
                        );
                      }),
                      !rulesetMissing && (() => {
                        const luck = character.status.luck;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "ostat luck",
                            title: `행운: 정상 ${luck} / 어려운 ${Math.floor(luck / 2)} / 극단 ${Math.floor(luck / 5)}. 클릭하면 행운 굴림(1d100).`,
                            onClick: () => roll("행운", luck),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "roll", children: "🎲" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostat-h", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "LUK" }),
                                " 행운"
                              ] }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ostat-v", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  className: "input sm",
                                  type: "number",
                                  value: luck,
                                  onClick: (e) => e.stopPropagation(),
                                  onChange: (e) => updateStatus({ luck: parseInt(e.target.value, 10) || 0 }),
                                  style: { width: "100%", textAlign: "center", fontSize: 18, fontWeight: 800 }
                                }
                              ) : luck }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ostat-sub", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                  "어려운",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: Math.floor(luck / 2) })
                                ] }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                                  "극단",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: Math.floor(luck / 5) })
                                ] })
                              ] })
                            ]
                          }
                        );
                      })()
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec status-sec", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "상태" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Tracker$1,
                      {
                        label: "체력 HP",
                        cur: character.status.hp,
                        max: d.hpMax,
                        kind: "hp",
                        onEdit: (val) => updateStatus({ hp: val })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Tracker$1,
                      {
                        label: "마력 MP",
                        cur: character.status.mp,
                        max: d.mpMax,
                        kind: "mp",
                        onEdit: (val) => updateStatus({ mp: val })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk san-trk", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk-h", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "l", children: "이성 SAN" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trk-ctl", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              className: "stp",
                              title: "감소",
                              onClick: () => updateStatus({ san: character.status.san - 1 }),
                              children: "−"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              className: "trk-num",
                              type: "number",
                              value: character.status.san,
                              onChange: (e) => updateStatus({ san: parseInt(e.target.value, 10) || 0 })
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                            "/ ",
                            sanMax
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              className: "stp",
                              title: "증가",
                              onClick: () => updateStatus({ san: character.status.san + 1 }),
                              children: "+"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "san-meta", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "san-start",
                            title: "세션 시작 SAN. 현재 SAN과 별개로 직접 입력하세요.",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "l2", children: "시작 SAN" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  className: "stp",
                                  title: "감소",
                                  onClick: () => updateStatus({ sanStart: Math.max(0, sanStart - 1) }),
                                  children: "−"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "input",
                                {
                                  className: "trk-num",
                                  type: "number",
                                  value: sanStart,
                                  onChange: (e) => updateStatus({ sanStart: parseInt(e.target.value, 10) || 0 })
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  className: "stp",
                                  title: "증가",
                                  onClick: () => updateStatus({ sanStart: sanStart + 1 }),
                                  children: "+"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("small", { children: [
                                "/ ",
                                sanMax
                              ] })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { title: "하루에 시작 SAN의 1/5 이상 잃으면 장기적 광기", children: [
                          "장기적 광기 임계치 ",
                          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: Math.max(0, sanStart - Math.floor(sanStart / 5)) })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sancheck", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "l2", children: "이성 판정" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "text",
                            className: "san-loss",
                            value: sanLoss,
                            onChange: (e) => setSanLoss(e.target.value),
                            placeholder: "1/1d6",
                            title: "성공/실패 SAN 손실식 (예: 1/1d6, 0/1, 1/1d10)"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            className: "mad-btn",
                            disabled: ro || editing,
                            title: "1d100 ≤ 현재 SAN. 결과 손실을 SAN에 자동 반영합니다.",
                            onClick: rollSanCheck,
                            children: "🎲 이성 판정"
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "madness", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "madness-h", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "l", children: "광기의 발작" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "madness-btns", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "mad-btn",
                            title: "실시간 · 일시적 광기 발작 굴림 (라운드 지속)",
                            onClick: () => rollMadness("realtimeTemp"),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-cap", children: "실시간" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-main", children: "🎲 일시적" })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "mad-btn",
                            title: "실시간 · 장기적 광기 발작 굴림 (라운드 지속)",
                            onClick: () => rollMadness("realtimeIndef"),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-cap", children: "실시간" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-main", children: "🎲 장기적" })
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "button",
                          {
                            className: "mad-btn",
                            title: "요약 발작 굴림 (시간 지속)",
                            onClick: () => rollMadness("summary"),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-cap", children: "요약" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-main", children: "🎲 발작" })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "madness-checks", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "madchk", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: character.status.tempInsane,
                              onChange: (e) => updateStatus({ tempInsane: e.target.checked })
                            }
                          ),
                          "일시적 광기"
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "madchk", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: character.status.indefInsane,
                              onChange: (e) => updateStatus({ indefInsane: e.target.checked })
                            }
                          ),
                          "장기적 광기"
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "secgroup",
              ref: secRefs.skills,
              "data-sec": "skills",
              style: { display: scrollView ? void 0 : "none" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
                  "기능 ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "클릭 판정 · □ 성장 체크" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input sm grow",
                      style: { maxWidth: 200 },
                      placeholder: "기능 검색…",
                      value: query,
                      onChange: (e) => setQuery(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "skills-official",
                    style: { gridAutoFlow: "column", gridTemplateRows: `repeat(${skillRows}, auto)` },
                    children: filteredSkills.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "oskill" + (s.checked ? " grown" : ""),
                        title: `${s.name}
판정: 1d100 ≤ ${s.value} (어려운 ${Math.floor(
                          s.value / 2
                        )} · 극단 ${Math.floor(s.value / 5)})`,
                        onClick: () => roll(s.name, s.value),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "ck",
                              title: "성장 체크",
                              onClick: ro ? void 0 : (e) => {
                                e.stopPropagation();
                                toggleSkillCheck(s.name);
                              }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "nm", children: s.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "base", children: [
                            "(",
                            s.base,
                            ")"
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "val", children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              className: "input sm",
                              type: "number",
                              value: s.value,
                              onClick: (e) => e.stopPropagation(),
                              onChange: (e) => updateSkillValue(s.name, parseInt(e.target.value, 10) || 0),
                              style: { width: 46, textAlign: "right" }
                            }
                          ) : s.value }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hf", children: [
                            Math.floor(s.value / 2),
                            "/",
                            Math.floor(s.value / 5)
                          ] }),
                          editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "rl",
                              title: "기능 삭제",
                              onClick: (e) => {
                                e.stopPropagation();
                                removeSkill(s.name);
                              },
                              style: { opacity: 1, cursor: "pointer", color: "var(--danger, #ef6f8e)" },
                              children: "✕"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rl", children: "🎲" })
                        ]
                      },
                      s.name
                    ))
                  }
                ),
                editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginTop: 10 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input sm",
                      placeholder: "새 기능 이름 (예: 잠수, 컴퓨터 사용)",
                      value: newSkill,
                      onChange: (e) => setNewSkill(e.target.value),
                      onKeyDown: (e) => {
                        if (e.key === "Enter") {
                          addSkill(newSkill);
                          setNewSkill("");
                        }
                      },
                      style: { maxWidth: 260 }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      className: "btn sm pri",
                      onClick: () => {
                        addSkill(newSkill);
                        setNewSkill("");
                      },
                      children: "+ 기능 추가"
                    }
                  )
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "secgroup",
              ref: secRefs.combat,
              "data-sec": "combat",
              style: { display: scrollView ? void 0 : "none" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec combat", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
                    "전투 ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "특성치로 자동 계산" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "combat-grid", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dv", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "l", children: "이동력 MOV" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "n", children: d.mov })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dv", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "l", children: "피해 보너스" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "n", children: d.db })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dv", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "l", children: "체격 Build" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "n", children: d.build })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec combat", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "무기" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("table", { className: "wtable", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "무기" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "기능%" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "피해" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "사정" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "횟수" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "장탄" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "고장" })
                    ] }),
                    character.weapons.map(
                      (w, i) => editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: w.name,
                            onChange: (e) => updateWeapon(i, { name: e.target.value })
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "select",
                            {
                              className: "input sm",
                              value: w.skillRef ?? "",
                              onChange: (e) => updateWeapon(i, { skillRef: e.target.value || void 0 }),
                              title: "연동 기능(근접전·사격 등). 고르면 그 값으로 굴립니다",
                              style: { width: 104, display: "block", marginBottom: 3 },
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "직접 입력" }),
                                character.skills.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.name, children: s.name }, s.name))
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              className: "input sm",
                              type: "number",
                              value: w.skillRef ? weaponSkillValue$1(w) : w.skill,
                              disabled: !!w.skillRef,
                              title: w.skillRef ? "연동 기능 값(자동)" : "기능% 직접 입력",
                              onChange: (e) => updateWeapon(i, { skill: parseInt(e.target.value, 10) || 0 }),
                              style: { width: 56 }
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: w.damage,
                            onChange: (e) => updateWeapon(i, { damage: e.target.value }),
                            style: { width: 72 }
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: w.range,
                            onChange: (e) => updateWeapon(i, { range: e.target.value }),
                            style: { width: 56 }
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: w.attacks,
                            onChange: (e) => updateWeapon(i, { attacks: e.target.value }),
                            style: { width: 40 }
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: w.ammo,
                            onChange: (e) => updateWeapon(i, { ammo: e.target.value }),
                            style: { width: 40 }
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              className: "input sm",
                              value: w.malfunction,
                              onChange: (e) => updateWeapon(i, { malfunction: e.target.value }),
                              style: { width: 40 }
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "button",
                            {
                              className: "iconbtn x",
                              title: "무기 삭제",
                              onClick: () => removeWeapon(i),
                              style: { width: 24, height: 24, color: "var(--danger, #ef6f8e)" },
                              children: "✕"
                            }
                          )
                        ] })
                      ] }, i) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "tr",
                        {
                          className: "wrow",
                          title: "이름·기능% 칸=기능 판정 · 피해 칸=피해 굴림",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "wroll", style: { cursor: "pointer" }, onClick: () => rollWeapon(w), children: [
                              w.name,
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "wdie", children: "🎲" })
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "td",
                              {
                                className: "wroll",
                                title: w.skillRef ? `${w.skillRef} 연동 · 클릭 = 기능 판정` : "클릭 = 기능 판정",
                                style: { cursor: "pointer" },
                                onClick: () => rollWeapon(w),
                                children: weaponSkillValue$1(w)
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "td",
                              {
                                className: "wdmg",
                                title: "클릭 = 피해 굴림",
                                style: { cursor: "pointer" },
                                onClick: () => rollWeaponDamage(w),
                                children: [
                                  w.damage,
                                  " ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "wdie", children: "🎲" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: w.range }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: w.attacks }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: w.ammo }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: w.malfunction })
                          ]
                        },
                        i
                      )
                    )
                  ] }) }),
                  editing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm pri", style: { marginTop: 8 }, onClick: () => addWeapon(), children: "+ 무기 추가" })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "secgroup",
              ref: secRefs.background,
              "data-sec": "background",
              style: { display: scrollView ? void 0 : "none" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "배경 이야기" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-grid", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "개인 묘사",
                        v: character.background.personalDescription,
                        edit: editing ? (val) => updateBackground({ personalDescription: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "사상 / 신념",
                        v: character.background.ideology,
                        edit: editing ? (val) => updateBackground({ ideology: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "중요한 사람",
                        v: character.background.significantPeople,
                        edit: editing ? (val) => updateBackground({ significantPeople: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "의미 있는 장소",
                        v: character.background.meaningfulLocations,
                        edit: editing ? (val) => updateBackground({ meaningfulLocations: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "소중한 물건",
                        v: character.background.treasuredPossessions,
                        edit: editing ? (val) => updateBackground({ treasuredPossessions: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "특성",
                        v: character.background.traits,
                        edit: editing ? (val) => updateBackground({ traits: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "부상과 흉터",
                        v: character.background.injuriesScars,
                        edit: editing ? (val) => updateBackground({ injuriesScars: val }) : void 0
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Bgf,
                      {
                        label: "공포증 / 광기",
                        v: character.background.phobiasManias,
                        edit: editing ? (val) => updateBackground({ phobiasManias: val }) : void 0
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocrow", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec grow", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "소지품 · 장비" }),
                    editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        className: "input",
                        value: character.background.gear ?? "",
                        onChange: (e) => updateBackground({ gear: e.target.value }),
                        rows: 3,
                        style: { resize: "vertical", fontFamily: "inherit", lineHeight: 1.5, fontSize: "11.5px" }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "txt",
                        style: { fontSize: "11.5px", color: "var(--tx2)", whiteSpace: "pre-wrap" },
                        children: character.background.gear?.trim() || "없음"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "현금 및 자산" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "assets-grid", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dv", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "l", children: "소비 수준" }),
                        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: character.assets.spendingLevel,
                            onChange: (e) => updateAssets({ spendingLevel: e.target.value })
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "n", children: character.assets.spendingLevel })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dv", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "l", children: "현금" }),
                        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: character.assets.cash,
                            onChange: (e) => updateAssets({ cash: e.target.value })
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "n", children: character.assets.cash })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dv", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "l", children: "자산" }),
                        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            value: character.assets.assets,
                            onChange: (e) => updateAssets({ assets: e.target.value })
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "n", children: character.assets.assets })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dv", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "l", children: "재력 CR" }),
                        editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            className: "input sm",
                            type: "number",
                            value: character.assets.creditRating,
                            onChange: (e) => updateAssets({ creditRating: parseInt(e.target.value, 10) || 0 })
                          }
                        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "n", children: character.assets.creditRating })
                      ] })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "secgroup",
              "data-sec": "secret",
              style: { display: tab === "secret" ? void 0 : "none" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
                  "비밀 메모 ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "소유자·GM만 열람" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Bgf,
                  {
                    label: "비밀 메모",
                    v: character.secret ?? "",
                    edit: editing ? (val) => updateSecret(val) : void 0,
                    rows: 10
                  }
                )
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "secgroup",
              "data-sec": "standing",
              style: { display: tab === "standing" ? void 0 : "none" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
                  "스탠딩 · 표정",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted", children: [
                    "최대 ",
                    MAX_STANDINGS,
                    "칸 · /명령어로 전환 · 1슬롯 두상=채팅 아바타"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, margin: "6px 0 10px", flexWrap: "wrap" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "무대 크기" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "비우면 기본 크기로 보입니다.", label: "무대 크기 설명" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input sm",
                      type: "number",
                      min: 40,
                      max: 4e3,
                      step: 10,
                      style: { width: 96 },
                      value: heightInput,
                      placeholder: "기본",
                      spellCheck: false,
                      disabled: ro,
                      onChange: (e) => {
                        const v = e.target.value;
                        setHeightInput(v);
                        const t = v.trim();
                        setStandingHeight(t === "" ? void 0 : Number(t));
                      }
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "px" }),
                  character.portrait.standingHeight != null && !ro && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "btn xs",
                      onClick: () => {
                        setHeightInput("");
                        setStandingHeight(void 0);
                      },
                      children: "기본값"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-grid", children: [
                  character.portrait.standings.map((src, i) => {
                    const hs = character.portrait.headshots?.[i];
                    const cmd = character.portrait.commands?.[i] ?? "";
                    const cur = i === character.portrait.currentExpression;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-slot" + (cur ? " on" : ""), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "standing-thumb",
                          title: "클릭하면 이 표정으로 전환(미리보기)",
                          onClick: ro ? void 0 : () => setExpression(i),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "" }),
                            i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "standing-rep", children: "대표" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "button",
                              {
                                type: "button",
                                className: "standing-rm",
                                title: "스탠딩 삭제",
                                onClick: (e) => {
                                  e.stopPropagation();
                                  removeStanding(i);
                                },
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 13 })
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-row", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "standing-hs" + (hs ? " set" : ""),
                            title: hs ? "두상 변경(채팅 아바타)" : "두상 등록(채팅 아바타)",
                            style: hs ? { backgroundImage: `url(${hs})` } : void 0,
                            onClick: () => {
                              setHeadshotSlot(i);
                              slotHeadshotInput.current?.click();
                            },
                            children: !hs && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "photo_camera", size: 13 })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-cmd", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cmd-slash", children: "/" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "input",
                            {
                              className: "input sm",
                              value: cmd,
                              placeholder: "명령어",
                              spellCheck: false,
                              onChange: (e) => setStandingCommand(i, e.target.value)
                            }
                          )
                        ] })
                      ] })
                    ] }, i);
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "standing-add",
                      title: "스탠딩 슬롯 추가",
                      disabled: character.portrait.standings.length >= MAX_STANDINGS,
                      onClick: () => standingInput.current?.click(),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 24 }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "슬롯 추가" })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: standingInput,
                    type: "file",
                    accept: "image/*",
                    hidden: true,
                    onChange: (e) => void onPickStanding(e)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    ref: slotHeadshotInput,
                    type: "file",
                    accept: "image/*",
                    hidden: true,
                    onChange: (e) => void onPickSlotHeadshot(e)
                  }
                )
              ] })
            }
          )
        ] })
      ] })
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: embed ? sheetBody : /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: winId ?? "sheet",
      title: character.info.name || "캐릭터 시트",
      icon: "badge",
      onClose: () => closeWindow(winId ?? "sheet"),
      defaultW: 860,
      defaultH: 730,
      children: sheetBody
    }
  ) });
}
function StandingEditor({
  character,
  ro,
  onPatch
}) {
  const foreignEdit = !!onPatch;
  const apply = (c) => onPatch?.(c);
  const sAddStanding = useCharacterStore((s) => s.addStanding);
  const sRemoveStanding = useCharacterStore((s) => s.removeStanding);
  const sSetStandingHeadshot = useCharacterStore((s) => s.setStandingHeadshot);
  const sSetStandingCommand = useCharacterStore((s) => s.setStandingCommand);
  const sSetStandingHeight = useCharacterStore((s) => s.setStandingHeight);
  const sSetExpression = useCharacterStore((s) => s.setExpression);
  const addStanding = foreignEdit ? (url) => apply(charEdits.addStanding(character, url)) : sAddStanding;
  const removeStanding = foreignEdit ? (i) => apply(charEdits.removeStanding(character, i)) : sRemoveStanding;
  const setStandingHeadshot = foreignEdit ? (i, url) => apply(charEdits.setStandingHeadshot(character, i, url)) : sSetStandingHeadshot;
  const setStandingCommand = foreignEdit ? (i, cmd) => apply(charEdits.setStandingCommand(character, i, cmd)) : sSetStandingCommand;
  const setExpression = foreignEdit ? (i) => apply(charEdits.setExpression(character, i)) : sSetExpression;
  const setStandingHeight = foreignEdit ? (h) => apply(charEdits.setStandingHeight(character, h)) : sSetStandingHeight;
  const [heightInput, setHeightInput] = reactExports.useState("");
  reactExports.useEffect(() => {
    setHeightInput(character.portrait.standingHeight != null ? String(character.portrait.standingHeight) : "");
  }, [character.id]);
  function onHeightChange(v) {
    setHeightInput(v);
    const t = v.trim();
    setStandingHeight(t === "" ? void 0 : Number(t));
  }
  function clearHeight() {
    setHeightInput("");
    setStandingHeight(void 0);
  }
  const standingInput = reactExports.useRef(null);
  const slotHeadshotInput = reactExports.useRef(null);
  const slotRef = reactExports.useRef(null);
  async function onPickStanding(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (character.portrait.standings.length >= MAX_STANDINGS) {
      await alertDialog(`스탠딩은 최대 ${MAX_STANDINGS}개까지 등록할 수 있습니다.`);
      return;
    }
    try {
      addStanding(await fileToPortraitStanding(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function onPickSlotHeadshot(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    const i = slotRef.current;
    slotRef.current = null;
    if (!file || i == null) return;
    try {
      setStandingHeadshot(i, await fileToPortraitHeadshot(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { disabled: ro, style: { display: "contents" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { marginBottom: 8, lineHeight: 1.5 }, children: [
      "최대 ",
      MAX_STANDINGS,
      "칸 · /명령어로 전환 · 1슬롯 두상=채팅 아바타"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "무대 크기" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "비우면 기본 크기로 보입니다.", label: "무대 크기 설명" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input sm",
          type: "number",
          min: 40,
          max: 4e3,
          step: 10,
          style: { width: 96 },
          value: heightInput,
          placeholder: "기본",
          spellCheck: false,
          onChange: (e) => onHeightChange(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "px" }),
      character.portrait.standingHeight != null && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn xs", onClick: clearHeight, children: "기본값" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-grid", children: [
      character.portrait.standings.map((src, i) => {
        const hs = character.portrait.headshots?.[i];
        const cmd = character.portrait.commands?.[i] ?? "";
        const cur = i === character.portrait.currentExpression;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-slot" + (cur ? " on" : ""), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "standing-thumb",
              title: "클릭하면 이 표정으로 전환(미리보기)",
              onClick: ro ? void 0 : () => setExpression(i),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src, alt: "" }),
                i === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "standing-rep", children: "대표" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "standing-rm",
                    title: "스탠딩 삭제",
                    onClick: (e) => {
                      e.stopPropagation();
                      removeStanding(i);
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 13 })
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "standing-hs" + (hs ? " set" : ""),
                title: hs ? "두상 변경(채팅 아바타)" : "두상 등록(채팅 아바타)",
                style: hs ? { backgroundImage: `url(${hs})` } : void 0,
                onClick: () => {
                  slotRef.current = i;
                  slotHeadshotInput.current?.click();
                },
                children: !hs && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "photo_camera", size: 13 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "standing-cmd", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cmd-slash", children: "/" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "input sm",
                  value: cmd,
                  placeholder: "명령어",
                  spellCheck: false,
                  onChange: (e) => setStandingCommand(i, e.target.value)
                }
              )
            ] })
          ] })
        ] }, i);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "standing-add",
          title: "스탠딩 슬롯 추가",
          disabled: character.portrait.standings.length >= MAX_STANDINGS,
          onClick: () => standingInput.current?.click(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add_photo_alternate", size: 24 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "슬롯 추가" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: standingInput, type: "file", accept: "image/*", hidden: true, onChange: (e) => void onPickStanding(e) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: slotHeadshotInput, type: "file", accept: "image/*", hidden: true, onChange: (e) => void onPickSlotHeadshot(e) })
  ] });
}
function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return "b" + Math.random().toString(36).slice(2, 10);
  }
}
function pct(cur, max) {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round(cur / max * 100)));
}
function BasicSheet({
  charId,
  winId,
  viewCharacter,
  readOnly,
  embed,
  onPatch
} = {}) {
  const closeWindow = useUIStore((s) => s.closeWindow);
  const openWindow = useUIStore((s) => s.openWindow);
  const secretMode = useUIStore((s) => s.secretMode);
  const nameColor = useUIStore((s) => s.nameColor);
  const storeCharacter = useCharacterStore(activeCharacter);
  const charById = useCharacterStore((s) => charId ? s.characters[charId] : void 0);
  const selectCharacter = useCharacterStore((s) => s.selectCharacter);
  const upsertCharacter = useCharacterStore((s) => s.upsertCharacter);
  const character = viewCharacter ?? charById ?? storeCharacter;
  const foreignEdit = !!onPatch;
  const ro = !!readOnly && !foreignEdit;
  const applyEx = (next) => onPatch?.(next);
  const sUpdateInfo = useCharacterStore((s) => s.updateInfo);
  const sUpdateBackground = useCharacterStore((s) => s.updateBackground);
  const sUpdateSecret = useCharacterStore((s) => s.updateSecret);
  const sUpdateSheet = useCharacterStore((s) => s.updateSheet);
  const sSetHeadshot = useCharacterStore((s) => s.setHeadshot);
  const sAddCustomRoll = useCharacterStore((s) => s.addCustomRoll);
  const sUpdateCustomRoll = useCharacterStore((s) => s.updateCustomRoll);
  const sRemoveCustomRoll = useCharacterStore((s) => s.removeCustomRoll);
  const sUpdateExtra = useCharacterStore((s) => s.updateExtra);
  const updateInfo = foreignEdit ? (p) => applyEx(charEdits.updateInfo(character, p)) : sUpdateInfo;
  const updateBackground = foreignEdit ? (p) => applyEx(charEdits.updateBackground(character, p)) : sUpdateBackground;
  const updateSecret = foreignEdit ? (t) => applyEx(charEdits.updateSecret(character, t)) : sUpdateSecret;
  const updateSheet = foreignEdit ? (p) => applyEx(charEdits.updateSheet(character, p)) : sUpdateSheet;
  const setHeadshot = foreignEdit ? (u) => applyEx(charEdits.setHeadshot(character, u)) : sSetHeadshot;
  const addCustomRoll = foreignEdit ? () => applyEx(charEdits.addCustomRoll(character)) : sAddCustomRoll;
  const updateCustomRoll = foreignEdit ? (id, p) => applyEx(charEdits.updateCustomRoll(character, id, p)) : sUpdateCustomRoll;
  const removeCustomRoll = foreignEdit ? (id) => applyEx(charEdits.removeCustomRoll(character, id)) : sRemoveCustomRoll;
  const updateExtra = foreignEdit ? (patch) => applyEx(charEdits.updateExtra(character, patch)) : sUpdateExtra;
  const applyNameColor = (color) => {
    const next = { ...character, nameColor: color };
    if (foreignEdit) applyEx(next);
    else upsertCharacter(next);
  };
  const chatRoll = useChatStore((s) => s.roll);
  const [editing, setEditing] = reactExports.useState(false);
  const [tab, setTab] = reactExports.useState("main");
  const headshotInput = reactExports.useRef(null);
  const ap = character.sheet ?? {};
  const sv = computeSheetVars(ap);
  const headshot = character.portrait.headshots?.[0] || character.portrait.headshot;
  const eyebrow = ap.eyebrow ?? "";
  const rolls = character.customRolls ?? [];
  const bx = character.extra?.basic ?? {};
  const fields = bx.fields ?? [];
  const gauges = bx.gauges ?? [];
  const mutateBasic = (fn) => {
    const latest = foreignEdit ? character : useCharacterStore.getState().characters[character.id] ?? character;
    const curBx = latest.extra?.basic ?? {};
    updateExtra({ basic: { ...curBx, ...fn(curBx) } });
  };
  const addField = () => mutateBasic((b) => ({ fields: [...b.fields ?? [], { id: uid(), label: "항목", value: "" }] }));
  const updateField = (id, patch) => mutateBasic((b) => ({ fields: (b.fields ?? []).map((f) => f.id === id ? { ...f, ...patch } : f) }));
  const removeField = (id) => mutateBasic((b) => ({ fields: (b.fields ?? []).filter((f) => f.id !== id) }));
  const addGauge = () => mutateBasic((b) => ({ gauges: [...b.gauges ?? [], { id: uid(), label: "수치", cur: 0, max: 10 }] }));
  const updateGauge = (id, patch) => mutateBasic((b) => ({ gauges: (b.gauges ?? []).map((g) => g.id === id ? { ...g, ...patch } : g) }));
  const removeGauge = (id) => mutateBasic((b) => ({ gauges: (b.gauges ?? []).filter((g) => g.id !== id) }));
  function rollCustom(r) {
    if (editing || ro) return;
    const expr = (r.expr || "").trim() || "1d100";
    const dice = rollSum(expr, { command: r.label || expr });
    chatRoll(
      { kind: "dice", dice: { ...dice, name: r.label || expr } },
      { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 },
      { secret: secretMode, charId: character.id }
    );
  }
  async function onPickHeadshot(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setHeadshot(await fileToPortraitHeadshot(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  function exportCharacter() {
    const json = JSON.stringify({ __occharacter: 1, version: 1, character }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(character.info.name || "캐릭터").slice(0, 24)}.occhar.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function onImportCharacter(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const ch = coerceImportedCharacter(JSON.parse(await file.text()));
      if (!ch) {
        await alertDialog("캐릭터 파일에서 시트 정보를 찾지 못했습니다.");
        return;
      }
      upsertCharacter(ch);
      selectCharacter(ch.id);
      openWindow("sheet:" + ch.id);
    } catch (err) {
      await alertDialog("캐릭터 파일을 불러오지 못했습니다: " + err.message);
    }
  }
  const baseInfo = [
    { key: "name", label: "이름" },
    { key: "player", label: "플레이어" },
    { key: "occupation", label: "콘셉트·분류", placeholder: "예: 떠돌이 검사" }
  ];
  const bgFields = [
    { key: "personalDescription", label: "특징·외형" },
    { key: "ideology", label: "설정·배경" },
    { key: "gear", label: "소지품·장비" }
  ];
  const tabs = [
    { id: "main", label: "시트" },
    { id: "standing", label: "스탠딩 · 표정" },
    { id: "secret", label: "비밀 메모" }
  ];
  const body = /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "sheet basicsheet ruleframe" + (embed ? " embed" : "") + (sv.solid ? " solid" : "") + (sv.customText ? " customtext" : "") + (sv.customBar ? " custombar" : ""),
      style: sv.vars,
      onPointerDownCapture: charId ? () => selectCharacter(charId) : void 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { disabled: ro, className: "sheet-fs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sheet-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "hs",
              style: headshot ? { backgroundImage: `url(${headshot})` } : { background: character.color },
              title: ro ? void 0 : "두상 이미지 변경",
              onClick: ro ? void 0 : () => headshotInput.current?.click(),
              children: [
                headshot ? "" : character.info.name[0],
                !ro && (headshot ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rm", title: "두상 제거", onClick: (e) => {
                  e.stopPropagation();
                  setHeadshot(void 0);
                }, children: "✕" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cam", children: "📷" }))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: headshotInput, type: "file", accept: "image/*", hidden: true, onChange: onPickHeadshot }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-id", style: { flex: 1, minWidth: 0 }, children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input sm",
                value: eyebrow,
                placeholder: "상단 문구 (예: 자유 세션)",
                onChange: (e) => updateSheet({ eyebrow: e.target.value }),
                style: { width: "100%", maxWidth: 360, marginBottom: 4 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input",
                value: character.info.name,
                placeholder: "이름",
                onChange: (e) => updateInfo({ name: e.target.value }),
                style: { width: "100%", maxWidth: 360, fontWeight: 800, fontSize: 18 }
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-eyebrow", children: eyebrow }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-name", children: character.info.name || "이름 없는 캐릭터" }),
            character.info.occupation && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-meta", children: character.info.occupation })
          ] }) }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              title: "이 캐릭터로 말할 때 쓸 채팅 이름색. 비우면 내 이름색을 따릅니다.",
              style: { display: "inline-flex", alignItems: "center", gap: 3, cursor: "pointer", alignSelf: "flex-start" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_text", size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: character.nameColor || "#7c9cff",
                    onChange: (e) => applyNameColor(e.target.value),
                    style: { width: 26, height: 22, padding: 0, border: 0, background: "none", cursor: "pointer" }
                  }
                ),
                character.nameColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn sm",
                    title: "이름색 지우기(내 이름색을 따름)",
                    onClick: (e) => {
                      e.preventDefault();
                      applyNameColor(void 0);
                    },
                    children: "✕"
                  }
                )
              ]
            }
          ),
          !ro && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm" + (editing ? " pri" : ""), title: "편집/굴림 전환", onClick: () => setEditing((v) => !v), style: { alignSelf: "flex-start" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: editing ? "check" : "edit", size: 14 }),
            " ",
            editing ? "완료" : "편집"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetPalette, { ap, updateSheet, onExport: exportCharacter, onImport: onImportCharacter })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sheet-tabs", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stab" + (tab === t.id ? " on" : ""), onClick: () => setTab(t.id), children: t.label }, t.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mbody", children: [
          tab === "main" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "basic-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "기본 정보" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info-grid", children: [
                baseInfo.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: f.label }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      className: "input sm",
                      value: String(character.info[f.key] ?? ""),
                      placeholder: f.placeholder,
                      onChange: (e) => updateInfo({ [f.key]: e.target.value })
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "v", children: String(character.info[f.key] ?? "") || "없음" })
                ] }, f.key)),
                fields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info", children: [
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        className: "input sm",
                        value: f.label,
                        placeholder: "항목명",
                        onChange: (e) => updateField(f.id, { label: e.target.value }),
                        style: { flex: 1, minWidth: 0, fontWeight: 700 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "항목 삭제", onClick: () => removeField(f.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 }) })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: f.label || "항목" }),
                  editing ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: f.value, onChange: (e) => updateField(f.id, { value: e.target.value }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "v", children: f.value || "없음" })
                ] }, f.id))
              ] }),
              editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: addField, style: { marginTop: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
                " 항목 추가"
              ] })
            ] }),
            (gauges.length > 0 || editing) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
                "수치 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: "예: 체력 · 탄약 · 사기" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "basic-gauges", children: [
                gauges.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "수치가 없습니다." }),
                gauges.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk-h", children: [
                    editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        className: "input sm",
                        value: g.label,
                        placeholder: "수치명",
                        onChange: (e) => updateGauge(g.id, { label: e.target.value }),
                        style: { maxWidth: 140, fontWeight: 700 }
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "l", children: g.label || "수치" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trk-ctl", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stp", title: "감소", onClick: () => updateGauge(g.id, { cur: g.cur - 1 }), children: "−" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          className: "trk-num",
                          type: "number",
                          value: g.cur,
                          onChange: (e) => updateGauge(g.id, { cur: parseInt(e.target.value, 10) || 0 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "/" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          className: "trk-num",
                          type: "number",
                          value: g.max,
                          title: "최대치",
                          onChange: (e) => updateGauge(g.id, { max: parseInt(e.target.value, 10) || 0 })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stp", title: "증가", onClick: () => updateGauge(g.id, { cur: g.cur + 1 }), children: "+" }),
                      editing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "수치 삭제", onClick: () => removeGauge(g.id), style: { marginLeft: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 }) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: pct(g.cur, g.max) + "%", background: "var(--sheet)" } }) })
                ] }, g.id))
              ] }),
              editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: addGauge, style: { marginTop: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
                " 수치 추가"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
                "굴림 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted", children: editing ? "예: 3d6*5 · 1d100 · 2d6+3" : "클릭하면 굴립니다" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "basic-rolls", children: [
                rolls.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "아직 굴림 칸이 없습니다. 편집에서 추가하세요." }),
                rolls.map(
                  (r) => editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        className: "input sm",
                        value: r.label,
                        placeholder: "라벨",
                        onChange: (e) => updateCustomRoll(r.id, { label: e.target.value }),
                        style: { flex: 2, minWidth: 0 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        className: "input sm",
                        value: r.expr,
                        placeholder: "1d100",
                        onChange: (e) => updateCustomRoll(r.id, { expr: e.target.value }),
                        style: { flex: 1, minWidth: 0 }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "삭제", onClick: () => removeCustomRoll(r.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }) })
                  ] }, r.id) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      className: "btn roll-btn",
                      onClick: () => rollCustom(r),
                      title: `${r.expr} 굴리기`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "roll-label", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "casino", size: 15 }),
                          " ",
                          r.label || r.expr
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: r.expr })
                      ]
                    },
                    r.id
                  )
                ),
                editing && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => addCustomRoll(), style: { alignSelf: "flex-start" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
                  " 굴림 추가"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: "특징 · 기록" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: bgFields.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgf", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: f.label }),
                editing ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    className: "input",
                    rows: 2,
                    value: String(character.background[f.key] ?? ""),
                    onChange: (e) => updateBackground({ [f.key]: e.target.value }),
                    style: { resize: "vertical" }
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "txt", children: String(character.background[f.key] ?? "") || "없음" })
              ] }, f.key)) })
            ] })
          ] }),
          tab === "standing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "basic-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StandingEditor, { character, ro, onPatch: foreignEdit ? applyEx : void 0 }) }),
          tab === "secret" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "basic-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 13 }),
              " 소유자·GM만 볼 수 있는 메모입니다."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "input",
                rows: 10,
                value: character.secret ?? "",
                onChange: (e) => updateSecret(e.target.value),
                style: { width: "100%", resize: "vertical" }
              }
            )
          ] })
        ] })
      ] })
    }
  );
  return embed ? body : /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: winId ?? "sheet",
      title: character.info.name || "캐릭터 시트",
      icon: "badge",
      onClose: () => closeWindow(winId ?? "sheet"),
      defaultW: 600,
      defaultH: 680,
      children: body
    }
  );
}
const ST_CARD_KEY = { special: "스페셜", success: "성공", fail: "실패", fumble: "펌블" };
const CSS_LEVEL = { special: "critical", success: "regular", fail: "fail", fumble: "fumble" };
const KO_FALLBACK = { special: "Special", success: "Success", fail: "Fail", fumble: "Fumble" };
function Tracker({
  label,
  v,
  ro,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontWeight: 800, minWidth: 52 }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", disabled: ro, onClick: () => onChange({ ...v, cur: Math.max(0, v.cur - 1) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "remove", size: 15 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { minWidth: 22, textAlign: "center", fontSize: 16 }, children: v.cur }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", disabled: ro, onClick: () => onChange({ ...v, cur: Math.min(v.max, v.cur + 1) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 15 }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "/ 최대" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "input sm",
        type: "number",
        value: v.max,
        readOnly: ro,
        onChange: (e) => {
          const m = Math.max(0, parseInt(e.target.value, 10) || 0);
          onChange({ cur: Math.min(v.cur, m), max: m });
        },
        style: { width: 52, textAlign: "center" }
      }
    )
  ] });
}
const ST_BURSTS = [{"instrument": "보컬", "name": "천창 : 스트라토 샤우트", "effect": "대상에게 프레이즈 공격과 같은 대미지를 준다. 이 대미지는 현재 무력화된 굴레 1개당 2D6점 오른다."}, {"instrument": "기타", "name": "현어 : 코드 토커", "effect": "일반 공격의 대미지를 산출한다. 【지배력】이 이 대미지 이하인 굴레를 [현재 라운드]개까지 골라서 모두 무력화한다."}, {"instrument": "베이스", "name": "극살 : 모멘트 킬러", "effect": "대상에게 [【악기 위력】+【기량】+(이 판정에 소비한 【컨디션】D6]점의 대미지를 준다."}, {"instrument": "키보드", "name": "경계 : 스케일 댄스", "effect": "대상에게 프레이즈 공격과 같은 대미지를 준다. 이 판정에 소비한 【컨디션】의 절반(소수점 올림)을 자신 외의 모든 PC에게 준다."}, {"instrument": "드럼", "name": "추명 : 체이스 라운드", "effect": "다음 효과들을 모두 적용한다. ① 대상에게 프레이즈 공격과 같은 대미지를 준다. ② 이 프레이즈 버스트를 사용한 라운드 종료 직후, 추가 라운드가 발생한다. 단, 추가 라운드 동안 모든 PC는 【컨디션】과 【프레이즈】를 사용할 수 없다. 또한 이 프레이즈 버스트를 사용한 타이밍이 제3 라운드였다면, 모든 굴레는 무력화된다."}];
const STRAT_DICE = { "이모션": "2d6", "테크닉": "1d6" };
const ST_INSTRUMENTS = ["보컬", "기타", "드럼", "키보드", "베이스"];
const ST_STRATEGIES = [
  { name: "이모션", effect: "대상의 대미지 산출 직후 사용. 주는 대미지 2D6점 상승." },
  { name: "테크닉", effect: "라이브 페이즈에서 사용. 【컨디션】 1D6점 증가." },
  { name: "로직", effect: "대상의 판정 직후 사용. 판정 주사위 재굴림." }
];
function InsaneSheet({
  charId,
  winId,
  viewCharacter,
  readOnly,
  embed,
  onPatch
} = {}) {
  const closeWindow = useUIStore((s) => s.closeWindow);
  const openWindow = useUIStore((s) => s.openWindow);
  const secretMode = useUIStore((s) => s.secretMode);
  const nameColor = useUIStore((s) => s.nameColor);
  const storeCharacter = useCharacterStore(activeCharacter);
  const charById = useCharacterStore((s) => charId ? s.characters[charId] : void 0);
  const selectCharacter = useCharacterStore((s) => s.selectCharacter);
  const upsertCharacter = useCharacterStore((s) => s.upsertCharacter);
  const character = viewCharacter ?? charById ?? storeCharacter;
  const ruleset = useRulesetStore((s) => resolveRuleset(s, character.rulesetId ?? "insane"));
  const foreignEdit = !!onPatch;
  const ro = !!readOnly && !foreignEdit;
  const applyEx = (next) => onPatch?.(next);
  const stIsRoomGm = useNetStore((s) => !!s.self && !!s.roomOwnerId && s.self.playerId === s.roomOwnerId);
  const stOwnChar = useCharacterStore((s) => !!s.characters[character.id]);
  const stCanSecret = stOwnChar || stIsRoomGm;
  const sUpdateInfo = useCharacterStore((s) => s.updateInfo);
  const sUpdateSecret = useCharacterStore((s) => s.updateSecret);
  const sUpdateSheet = useCharacterStore((s) => s.updateSheet);
  const sSetHeadshot = useCharacterStore((s) => s.setHeadshot);
  const sUpdateExtra = useCharacterStore((s) => s.updateExtra);
  const updateInfo = foreignEdit ? (p) => applyEx(charEdits.updateInfo(character, p)) : sUpdateInfo;
  const updateSecret = foreignEdit ? (t) => applyEx(charEdits.updateSecret(character, t)) : sUpdateSecret;
  const updateSheet = foreignEdit ? (p) => applyEx(charEdits.updateSheet(character, p)) : sUpdateSheet;
  const updateExtra = foreignEdit ? (p) => applyEx(charEdits.updateExtra(character, p)) : sUpdateExtra;
  const setHeadshot = foreignEdit ? (u) => applyEx(charEdits.setHeadshot(character, u)) : sSetHeadshot;
  const applyNameColor = (color) => {
    const next = { ...character, nameColor: color };
    if (foreignEdit) applyEx(next);
    else upsertCharacter(next);
  };
  const chatRoll = useChatStore((s) => s.roll);
  const [editing, setEditing] = reactExports.useState(false);
  const [stTab, setStTab] = reactExports.useState("info");
  const stMbody = reactExports.useRef(null);
  const stRefs = { info: reactExports.useRef(null), spec: reactExports.useRef(null), bond: reactExports.useRef(null), combat: reactExports.useRef(null), skills: reactExports.useRef(null) };
  const [stCond, setStCond] = reactExports.useState(0);
  const [stGul, setStGul] = reactExports.useState(0);
  const [stSkillPick, setStSkillPick] = reactExports.useState("");
  const headshotInput = reactExports.useRef(null);
  const ap = character.sheet ?? {};
  const sv = computeSheetVars(ap);
  const headshot = character.portrait.headshots?.[0] || character.portrait.headshot;
  const eyebrow = ap.eyebrow ?? ruleset?.systemLabel ?? "";
  const ins = character.extra?.insane ?? {};
  const setIns = (patch) => updateExtra({ insane: { ...ins, ...patch } });
  const stStatRef = reactExports.useRef(/* @__PURE__ */ new Map());
  const stSetRes = (key, nv, label) => {
    const prev = ins[key] ?? { cur: 6, max: 6 };
    setIns({ [key]: nv });
    if (!useUIStore.getState().statLog || useNetStore.getState().roomId === null || prev.cur === nv.cur) return;
    const m = stStatRef.current, old = m.get(key);
    if (old) clearTimeout(old.timer);
    const from = old ? old.from : prev.cur;
    const nm = character.info?.name?.trim() || "이름 없음";
    const secret = useUIStore.getState().secretMode;
    const req = { channel: "main", secret: secret ? true : void 0, open: secret ? void 0 : true, charId: character.id, label: `${nm.length > 24 ? nm.slice(0, 23) + "…" : nm} · ${label}`, from, to: nv.cur, max: nv.max };
    const timer = setTimeout(() => {
      m.delete(key);
      if (req.from !== req.to) useNetStore.getState().sendStat(req);
    }, 800);
    m.set(key, { timer, from });
  };
  const fields = ruleset?.skillGrid?.fields ?? [];
  const rows = ruleset?.skillGrid?.rows ?? 11;
  const target = ins.target ?? 5;
  const stDir = "gte";
  const stBlocked = new Set(ins.blocked ?? []);
  const stGapOff = (g) => rows > 0 && Array.from({ length: rows }, (_, r) => stBlocked.has(g + ":" + r)).every(Boolean);
  function stDist() {
    const Wc = Math.max(1, fields.length * 2 - 1), INF = 1e9;
    const d = Array.from({ length: Math.max(1, rows) }, () => Array(Wc).fill(INF));
    const q = [];
    for (const k of ins.acquired ?? []) {
      const [f, r] = String(k).split(":").map(Number);
      if (d[r] && 2 * f < Wc) { d[r][2 * f] = 0; q.push([r, 2 * f]); }
    }
    for (let i = 0; i < q.length; i++) {
      const [r, c] = q[i];
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nr = r + dr;
        let nc = c + dc;
        if (nc > 0 && nc % 2 === 1 && stBlocked.has((nc - 1) / 2 + ":" + nr)) nc += dc;
        if (nr < 0 || nr >= d.length || nc < 0 || nc >= Wc) continue;
        if (d[nr][nc] > d[r][c] + 1) { d[nr][nc] = d[r][c] + 1; q.push([nr, nc]); }
      }
    }
    return d;
  }
  const stD = stDist();
  const stAny = (ins.acquired ?? []).length > 0;
  const stVal = (f, r) => stAny ? Math.min(12, 5 + (stD[r]?.[2 * f] ?? 1e9)) : 12;
  function stToggleGap(g) {
    const off = stGapOff(g);
    const keep = (ins.blocked ?? []).filter((k) => !String(k).startsWith(g + ":"));
    setIns({ blocked: off ? keep : [...keep, ...Array.from({ length: rows }, (_, r) => g + ":" + r)] });
  }
  const life = ins.life ?? { cur: 6, max: 6 };
  const spirit = ins.spirit ?? { cur: 6, max: 6 };
  const resLabel = (key, fallback) => ruleset?.resources?.find((r) => r.key === key)?.label || fallback;
  const lifeLabel = resLabel("life", "생명력");
  const spiritLabel = resLabel("spirit", "이성치");
  const cellAt = (f, r) => ins.cells?.[f]?.[r] ?? ruleset?.skillGrid?.cells?.[f]?.[r] ?? "";
  function setCell(f, r, val) {
    const cols = Math.max(fields.length, ins.cells?.length ?? 0, f + 1);
    const rowCount = Math.max(rows, r + 1, ...(ins.cells ?? []).map((c) => c?.length ?? 0));
    const cells = Array.from(
      { length: cols },
      (_, fi) => Array.from({ length: rowCount }, (_2, ri) => ins.cells?.[fi]?.[ri] ?? cellAt(fi, ri))
    );
    cells[f][r] = val;
    setIns({ cells });
  }
  const acqKey = (f, r) => `${f}:${r}`;
  const isAcq = (f, r) => (ins.acquired ?? []).includes(acqKey(f, r));
  function toggleAcq(f, r) {
    const k = acqKey(f, r);
    const cur = ins.acquired ?? [];
    setIns({ acquired: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] });
  }
  const namedSkills = [];
  for (let f = 0; f < fields.length; f++) for (let r = 0; r < rows; r++) {
    const nm = cellAt(f, r);
    if (nm) namedSkills.push(nm);
  }
  function rollSkill(name, tgt) {
    if (editing || ro || !name) return;
    const lte = stDir === "lte";
    const res = rollSum("2d6", { command: `${name} (2d6${lte ? "≤" : "≥"}${tgt})` });
    const raw = res.rolls.reduce((a, b) => a + b, 0);
    const id = raw === 12 ? lte ? "fumble" : "special" : raw === 2 ? lte ? "special" : "fumble" : (lte ? res.total <= tgt : res.total >= tgt) ? "success" : "fail";
    const ko = ruleset?.levels?.find((l) => l.id === id)?.ko ?? KO_FALLBACK[id];
    chatRoll(
      { kind: "dice", dice: { ...res, name, judge: { level: CSS_LEVEL[id], ko: ST_CARD_KEY[id], word: ko, target: tgt, eyebrow: ruleset?.systemLabel ?? "" } } },
      { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 },
      { secret: secretMode, charId: character.id }
    );
  }
  async function onPickHeadshot(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setHeadshot(await fileToPortraitHeadshot(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  function exportCharacter() {
    const json = JSON.stringify({ __occharacter: 1, version: 1, character }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(character.info.name || "캐릭터").slice(0, 24)}.occhar.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function onImportCharacter(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const ch = coerceImportedCharacter(JSON.parse(await file.text()));
      if (!ch) {
        await alertDialog("캐릭터 파일에서 시트 정보를 찾지 못했습니다.");
        return;
      }
      upsertCharacter(ch);
      selectCharacter(ch.id);
      openWindow("sheet:" + ch.id);
    } catch (err) {
      await alertDialog("캐릭터 파일을 불러오지 못했습니다: " + err.message);
    }
  }
  const secTitle = { fontWeight: 800, margin: "4px 0 6px" };
  const noGrid = fields.length === 0;
  const stGridEl = /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: Array.from({ length: fields.length * 2 - 1 }, (_, c) => c % 2 ? "14px" : "minmax(92px, 1fr)").join(" "), gap: 3, overflowX: "auto" }, children: Array.from({ length: rows + 1 }, (_, rr) => Array.from({ length: fields.length * 2 - 1 }, (_2, c) => {
              const f = c / 2, g = (c - 1) / 2;
              if (rr === 0) {
                if (c % 2) {
                  const off = stGapOff(g);
                  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: ro, title: off ? "이 사이 칸 전체 다시 넣기" : "이 사이 칸 전체 지우기", onClick: () => stToggleGap(g), style: { padding: 0, height: 22, alignSelf: "end", border: "1px solid " + (off ? "#000" : "var(--s-line)"), background: off ? "#000" : "transparent", color: "inherit", borderRadius: 4, cursor: ro ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center" }, children: off ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 10 }) }, rr + ":" + c);
                }
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", fontWeight: 800, fontSize: 12, padding: "3px 0", borderBottom: "2px solid var(--sheet)" }, children: fields[f] }, rr + ":" + c);
              }
              const r = rr - 1;
              if (c % 2) {
                const off = stBlocked.has(g + ":" + r);
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { borderRadius: 3, background: off ? "#000" : "transparent", border: "1px solid " + (off ? "#000" : "var(--s-line)"), opacity: off ? 1 : 0.5 } }, rr + ":" + c);
              }
              const nm = cellAt(f, r);
              const acq = isAcq(f, r);
              const val = stVal(f, r);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "ins-chk" + (acq ? " on" : ""),
                    title: acq ? "습득 해제" : "습득 표시",
                    disabled: ro,
                    onClick: () => toggleAcq(f, r),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 13 })
                  }
                ),
                editing ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: nm, placeholder: "·", onChange: (e) => setCell(f, r, e.target.value), style: { flex: 1, minWidth: 0, fontSize: 11, padding: "2px 4px" } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => rollSkill(nm, val),
                    disabled: !nm,
                    title: nm ? `${nm} 판정(2d6${stDir === "lte" ? "≤" : "≥"}${val})` : "",
                    style: { flex: 1, minWidth: 0, textAlign: "left", border: 0, cursor: nm ? "pointer" : "default", background: acq ? "color-mix(in srgb, var(--sheet) 16%, transparent)" : "transparent", color: "inherit", borderRadius: 4, padding: "3px 4px", fontSize: 11, fontWeight: acq ? 700 : 400, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" },
                    children: nm || "·"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { minWidth: 16, textAlign: "right", fontSize: 11, fontWeight: 800, fontVariantNumeric: "tabular-nums" }, children: val })
              ] }, rr + ":" + c);
            })).flat() });
  const isStrato = ruleset?.id === "stratoshout";
  const stProfile = !isStrato ? null : (() => {
    const h = jsxRuntimeExports.jsx, hs = jsxRuntimeExports.jsxs;
    const instList = Array.isArray(ruleset?.instruments) && ruleset.instruments.length ? ruleset.instruments : ST_INSTRUMENTS;
    const burstList = Array.isArray(ruleset?.bursts) && ruleset.bursts.length ? ruleset.bursts : ST_BURSTS;
    const curBurst = burstList.find((b) => b.instrument === ins.inst);
    const stratList = Array.isArray(ruleset?.strategies) && ruleset.strategies.length ? ruleset.strategies : ST_STRATEGIES;
    const BORDER = "1px solid var(--s-line)";
    const HEAD = { background: "color-mix(in srgb, var(--sheet) 12%, transparent)", fontWeight: 800, fontSize: 12, textAlign: "center", padding: "4px 6px", whiteSpace: "nowrap" };
    const bare = { boxSizing: "border-box", border: 0, background: "transparent", boxShadow: "none", width: "100%", minWidth: 0, textAlign: "center", fontSize: 13, padding: "5px 6px", borderRadius: 0 };
    const applyColor = (c) => {
      const next = { ...character, color: c };
      if (foreignEdit) applyEx(next);
      else upsertCharacter(next);
    };
    const txt = (value, onChange, placeholder, extra, list) => h("input", { className: "input sm", value: value ?? "", placeholder, readOnly: !editing, list, onChange: (e) => onChange(e.target.value), style: { ...bare, ...extra } });
    const num = (value, onChange) => h("input", { className: "input sm", type: "number", min: 0, value: value ?? "", readOnly: ro, onChange: (e) => onChange(e.target.value === "" ? "" : Math.max(0, parseInt(e.target.value, 10) || 0)), style: { ...bare, textAlign: "right" } });
    const row = (label, ctl, key, first, w) => hs("div", { style: { display: "grid", gridTemplateColumns: (w || 70) + "px 1fr", borderTop: first ? 0 : BORDER }, children: [
      h("div", { style: { ...HEAD, display: "flex", alignItems: "center", justifyContent: "center" }, children: label }),
      ctl
    ] }, key);
    const frame = (children, key, extra) => hs("div", { style: { border: BORDER, borderRadius: 4, overflow: "hidden", minWidth: 0, ...extra }, children }, key);
    const box = (title, body, key) => frame([h("div", { style: { ...HEAD, borderBottom: BORDER }, children: title }, "h"), body], key, { display: "flex", flexDirection: "column" });
    const area = (value, onChange, placeholder, rows) => h("textarea", { className: "input", rows, value: value ?? "", placeholder, readOnly: !editing, onChange: (e) => onChange(e.target.value), style: { ...bare, resize: "none", textAlign: "left", fontFamily: "inherit", letterSpacing: "normal", wordSpacing: "normal", fontSize: 12, lineHeight: 1.5, flex: 1 } });

    const quote = h("div", { style: { borderLeft: "4px solid var(--sheet)", background: "color-mix(in srgb, var(--sheet) 8%, transparent)", padding: "10px 14px", marginBottom: 12 }, children:
      h("input", { className: "input", value: ins.catchphrase ?? "", placeholder: "“캐릭터 한마디”", readOnly: !editing, onChange: (e) => setIns({ catchphrase: e.target.value }), style: { border: 0, background: "transparent", boxShadow: "none", width: "100%", fontSize: 18, fontWeight: 800, padding: 0 } }) });

    const colorRow = hs("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }, children: [
      h("input", { type: "color", value: /^#[0-9a-f]{6}$/i.test(character.color || "") ? character.color : "#888888", disabled: ro, onChange: (e) => applyColor(e.target.value), style: { width: 26, height: 22, padding: 0, border: BORDER, background: "none", cursor: ro ? "default" : "pointer" } }),
      h("span", { className: "muted small", children: character.color || "#컬러헥사코드" })
    ] });

    const img = hs("div", { title: ro ? void 0 : "캐릭터 이미지 변경", onClick: ro ? void 0 : () => headshotInput.current?.click(), style: { position: "relative", aspectRatio: "1 / 1.1", border: BORDER, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", opacity: 1, fontSize: 12, cursor: ro ? "default" : "pointer", backgroundImage: headshot ? `url(${headshot})` : void 0, backgroundSize: "cover", backgroundPosition: "center top" }, children: [
      headshot ? null : h("span", { className: "muted", children: "캐릭터 이미지" }),
      !ro && headshot ? h("span", { title: "이미지 제거", onClick: (e) => { e.stopPropagation(); setHeadshot(void 0); }, style: { position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,.55)", color: "#fff", borderRadius: 10, padding: "0 6px", fontSize: 11, cursor: "pointer" }, children: "✕" }) : null
    ] });
    const imgSrc = txt(ins.imgSrc, (v) => setIns({ imgSrc: v }), "이미지 출처", { textAlign: "right", fontSize: 11, opacity: 0.8 });

    const stats = frame([
      row("레벨", h("div", { title: "경험치에 따라 자동 계산됩니다", style: { ...bare, textAlign: "right", fontWeight: 800, cursor: "default" }, children: stLevelOf(ins.exp) }), "lv", true),
      row("기량", num(ins.skill ?? 1, (v) => setIns({ skill: v })), "sk"),
      row("악기 위력", num(ins.instPower ?? 0, (v) => setIns({ instPower: v })), "ip"),
      row("경험치", num(ins.exp ?? 0, (v) => setIns({ exp: v })), "xp")
    ], "stats", { marginTop: 8 });

    const nameBox = box("이름", hs("div", { children: [
      txt(character.info.name, (v) => updateInfo({ name: v }), "캐릭터 이름", { fontWeight: 700 })
    ] }), "name");
    const pick = (value, options, onChange, placeholder) => {
      const opts = value && !options.includes(value) ? [value, ...options] : options;
      return hs("select", { className: "input sm", value: value ?? "", disabled: ro, onChange: (e) => onChange(e.target.value), style: { ...bare, cursor: ro ? "default" : "pointer", fontWeight: 700 }, children: [h("option", { value: "", children: placeholder }, "_"), ...opts.map((o) => h("option", { value: o, children: o }, o))] });
    };
    const instBox = box("악기", pick(ins.inst, instList, (v) => setIns({ inst: v }), "악기 선택"), "inst");
    const ageGender = frame([
      row("나이", txt(String(character.info.age ?? ""), (v) => updateInfo({ age: v }), "나이", { textAlign: "left" }), "age", true, 44),
      row("성별", txt(character.info.gender ?? "", (v) => updateInfo({ gender: v }), "성별", { textAlign: "left" }), "gender", false, 44)
    ], "ag");
    const bandBox = box("밴드명", txt(ins.band, (v) => setIns({ band: v }), "밴드명"), "band");
    const stratBox = frame([
      hs("div", { style: { borderRight: BORDER, display: "flex", flexDirection: "column" }, children: [
        h("div", { style: { ...HEAD, borderBottom: BORDER }, children: "작전" }),
        hs("div", { style: { display: "flex", alignItems: "center", gap: 2 }, children: [pick(ins.strat, stratList.map((s) => s.name), (v) => {
          const f = stratList.find((s) => s.name === v);
          setIns(f ? { strat: v, stratEffect: f.effect } : { strat: v, stratEffect: "" });
        }, "작전 선택"),
        STRAT_DICE[ins.strat] ? h("button", { type: "button", className: "iconbtn", disabled: ro, title: `${ins.strat} ${STRAT_DICE[ins.strat]} 굴리기`, onClick: () => {
          const label = `작전 · ${ins.strat}`;
          const res = rollSum(STRAT_DICE[ins.strat], { command: `${label} (${STRAT_DICE[ins.strat]})` });
          chatRoll({ kind: "dice", dice: { ...res, name: label } }, { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 }, { secret: secretMode, charId: character.id });
        }, children: h(Icon, { name: "casino", size: 15 }) }) : null] })
      ] }, "a"),
      area(ins.stratEffect, (v) => setIns({ stratEffect: v }), "작전 효과", 2)
    ], "strat", { display: "grid", gridTemplateColumns: "104px 1fr" });
    const burst = frame([
      hs("div", { style: { display: "grid", gridTemplateColumns: "minmax(110px, 0.7fr) 1.3fr", borderBottom: BORDER }, children: [
        h("div", { style: { ...HEAD, borderRight: BORDER }, children: "프레이즈 버스트" }),
        h("div", { style: { ...bare, fontWeight: 700, minHeight: 28, display: "flex", alignItems: "center", justifyContent: "center" }, children: curBurst?.name ?? "" })
      ] }, "t"),
      h("div", { style: { ...bare, textAlign: "left", fontSize: 12, lineHeight: 1.5, minHeight: 64, whiteSpace: "pre-wrap" }, children: curBurst?.effect ?? "" })
    ], "burst", { display: "flex", flexDirection: "column" });

    const right = hs("div", { style: { display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }, children: [
      hs("div", { style: { display: "grid", gridTemplateColumns: "1.2fr 1.1fr 0.9fr", gap: 8, alignItems: "start" }, children: [nameBox, instBox, ageGender] }),
      hs("div", { style: { display: "grid", gridTemplateColumns: "0.9fr 2.1fr", gap: 8, alignItems: "stretch" }, children: [bandBox, stratBox] }),
      burst
    ] });
    return hs("section", { children: [
      hs("div", { style: { display: "grid", gridTemplateColumns: "minmax(140px, 180px) minmax(0, 1fr)", gap: 14, alignItems: "start" }, children: [
        hs("div", { children: [img, stats] }),
        right
      ] }),
      null
    ] });
  })();
  const stBodyEl = !isStrato ? null : (() => {
    const h = jsxRuntimeExports.jsx, hs = jsxRuntimeExports.jsxs;
    const TABS = [["info", "정보"], ["spec", "특기"], ["bond", "인연"], ["combat", "라이브"], ["skills", "스킬"], ["standing", "스탠딩 · 표정"], ...(stCanSecret ? [["secret", "비밀 메모"]] : [])];
    const SCROLL = ["info", "spec", "bond", "combat", "skills"];
    const scrollView = !(stTab === "secret" && stCanSecret) && stTab !== "standing";
    const go = (id) => {
      setStTab(id);
      if (id === "secret" || id === "standing") return;
      requestAnimationFrame(() => {
        const el = stRefs[id].current, mb = stMbody.current;
        if (el && mb) mb.scrollTo({ top: mb.scrollTop + (el.getBoundingClientRect().top - mb.getBoundingClientRect().top) - 6 });
      });
    };
    const onScroll = () => {
      if (!scrollView) return;
      const mb = stMbody.current;
      if (!mb) return;
      const top = mb.getBoundingClientRect().top;
      let active = SCROLL[0];
      for (const id of SCROLL) {
        const el = stRefs[id].current;
        if (el && el.getBoundingClientRect().top - top <= 90) active = id;
      }
      if (active !== stTab) setStTab(active);
    };
    const send = (label, expr) => {
      if (ro) return;
      const res = rollSum(expr, { command: `${label} (${expr})` });
      chatRoll({ kind: "dice", dice: { ...res, name: label } }, { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 }, { secret: secretMode, charId: character.id });
    };
    const cellTarget = (name) => {
      if (!name) return null;
      for (let f = 0; f < fields.length; f++) for (let r = 0; r < rows; r++) if (cellAt(f, r) === name) return stVal(f, r);
      return null;
    };
    const sec = (id, title, items) => h("div", { className: "secgroup", ref: stRefs[id], "data-sec": id, style: { display: scrollView ? void 0 : "none" }, children: hs("div", { className: "cocsec", children: [h("div", { className: "cocsec-t", children: title }, "t"), ...items] }) }, id);
    const page = (id, title, items) => h("div", { className: "secgroup", "data-sec": id, style: { display: stTab === id ? void 0 : "none" }, children: hs("div", { className: "cocsec", children: [h("div", { className: "cocsec-t", children: title }, "t"), ...items] }) }, id);

    const metaParts = [ins.inst, ins.band, character.info.age, character.info.gender].map((x) => String(x ?? "").trim()).filter(Boolean);
    const head = hs("div", { className: "sheet-head", children: [
      hs("div", { className: "hs", style: headshot ? { backgroundImage: `url(${headshot})` } : { background: character.color }, title: ro ? void 0 : "두상 이미지 변경", onClick: ro ? void 0 : () => headshotInput.current?.click(), children: [
        headshot ? "" : (character.info.name || "?")[0],
        !ro && (headshot ? h("span", { className: "rm", title: "두상 제거", onClick: (e) => { e.stopPropagation(); setHeadshot(void 0); }, children: "✕" }) : h("span", { className: "cam", children: "📷" }))
      ] }, "hs"),
      h("input", { ref: headshotInput, type: "file", accept: "image/*", hidden: true, onChange: onPickHeadshot }, "file"),
      hs("div", { className: "hs-id", children: [
        editing ? h("input", { className: "input sm", value: eyebrow, placeholder: "청춘 밴드 TRPG · 스트라토 샤우트", onChange: (e) => updateSheet({ eyebrow: e.target.value }), title: "상단 문구 수정", style: { width: "100%", maxWidth: 360, marginBottom: 4 } }, "eb") : h("div", { className: "hs-eyebrow", children: eyebrow || "STRATO SHOUT" }, "eb"),
        h("div", { className: "hs-name", children: character.info.name || "이름 없는 캐릭터" }, "nm"),
        h("div", { className: "hs-meta", children: metaParts.join(" · ") }, "meta")
      ] }, "id"),
      editing ? hs("label", { title: "이 캐릭터로 말할 때 쓸 채팅 이름색. 비우면 내 이름색을 따릅니다.", style: { display: "inline-flex", alignItems: "center", gap: 3, cursor: "pointer" }, children: [
        h(Icon, { name: "format_color_text", size: 14 }, "i"),
        h("input", { type: "color", value: character.nameColor || "#7c9cff", onChange: (e) => applyNameColor(e.target.value), style: { width: 26, height: 22, padding: 0, border: 0, background: "none", cursor: "pointer" } }, "c"),
        character.nameColor ? h("button", { type: "button", className: "btn sm", title: "이름색 지우기(내 이름색을 따름)", onClick: (e) => { e.preventDefault(); applyNameColor(void 0); }, children: "✕" }, "x") : null
      ] }, "nc") : null,
      !ro ? h("button", { className: "btn sm" + (editing ? " pri" : ""), title: "시트 편집", onClick: () => setEditing((v) => !v), children: editing ? "완료" : "편집" }, "edit") : null,
      h(SheetPalette, { ap, updateSheet, onExport: exportCharacter, onImport: onImportCharacter }, "pal")
    ] });
    const tabsEl = h("div", { className: "sheet-tabs", children: TABS.map(([id, label]) => h("button", { className: "stab" + (stTab === id ? " on" : ""), onClick: () => go(id), children: label }, id)) });

    // ── 정보
    const trackers = hs("div", { style: { display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center", marginTop: 14 }, children: [
      h(Tracker, { label: lifeLabel, v: life, ro, onChange: (nv) => stSetRes("life", nv, lifeLabel) }, "l"),
      h(Tracker, { label: spiritLabel, v: spirit, ro, onChange: (nv) => stSetRes("spirit", nv, spiritLabel) }, "s")
    ] });
    const notes = hs("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }, children: [["setting", "캐릭터 설정"], ["etc", "기타 사항"]].map(([k, label]) => hs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
      h("span", { className: "muted small", children: label }),
      h("textarea", { className: "input", rows: 2, value: ins[k] ?? "", readOnly: ro, onChange: (e) => setIns({ [k]: e.target.value }), style: { resize: "vertical" } })
    ] }, k)) });

    // ── 표(인연·스킬)
    const listEditor = (key, cols, blank, addLabel, extra) => {
      const rowsData = ins[key] ?? [];
      const set = (next) => setIns({ [key]: next });
      return hs("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [
        rowsData.length ? hs("div", { style: { display: "flex", gap: 4, padding: "0 2px" }, children: [
          ...cols.map(([k, label, flex]) => h("div", { className: "muted small", style: { flex: flex ?? 1, minWidth: 0, textAlign: "center" }, children: label }, k)),
          h("span", { style: { width: extra ? 64 : 28 } }, "sp")
        ] }, "hd") : h("div", { className: "muted small", children: "항목이 없습니다." }, "hd"),
        ...rowsData.map((row, i) => hs("div", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
          ...cols.map(([k, label, flex]) => h("input", { className: "input sm", value: row[k] ?? "", placeholder: label, readOnly: ro, onChange: (e) => set(rowsData.map((x, j) => j === i ? { ...x, [k]: e.target.value } : x)), style: { flex: flex ?? 1, minWidth: 0 } }, k)),
          extra ? extra(row, i) : null,
          !ro ? h("button", { className: "iconbtn", title: "삭제", onClick: () => set(rowsData.filter((_, j) => j !== i)), children: h(Icon, { name: "close", size: 13 }) }, "del") : null
        ] }, "r" + i)),
        !ro ? hs("button", { className: "btn sm", style: { alignSelf: "flex-start" }, onClick: () => set([...rowsData, { ...blank }]), children: [h(Icon, { name: "add", size: 13 }, "i"), " " + addLabel] }, "add") : null
      ] });
    };
    const bonds = listEditor("bonds", [["target", "대상", 1.2], ["attr", "속성", 0.8], ["strength", "강도", 0.6], ["desc", "설명", 2]], { target: "", attr: "", strength: "", desc: "" }, "인연 추가");
    const skillRows = listEditor("skillList", [["name", "이름", 1.4], ["timing", "타이밍", 1], ["skill", "지정 특기", 1], ["effect", "효과", 2]], { name: "", timing: "", skill: "", effect: "" }, "스킬 추가", (row, i) => {
      const tg = cellTarget(row.skill);
      return h("button", { className: "iconbtn", title: tg == null ? "지정 특기가 특기표에 있어야 판정할 수 있습니다" : `${row.skill} 판정(2d6≥${tg})`, disabled: ro || tg == null, onClick: () => rollSkill(`${row.skill} 【${row.name || "스킬"}】`, tg), children: h(Icon, { name: "casino", size: 15 }) }, "dice");
    });

    // ── 전투
    const skl = Number(ins.skill ?? 1) || 0, pow = Number(ins.instPower ?? 0) || 0, cond = Math.max(0, Number(stCond) || 0), gul = Math.max(0, Math.min(20, Number(stGul) || 0));
    const flat = skl + pow + cond;
    const tgt = cellTarget(stSkillPick);
    const bigBtn = (label, sub, onClick, disabled, key) => hs("button", { className: "btn", disabled: ro || disabled, onClick, style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2, padding: "7px 10px", textAlign: "left" }, children: [h("b", { style: { fontSize: 13 }, children: label }, "b"), h("span", { className: "muted small", children: sub }, "s")] }, key);
    const numField = (label, value, onChange, key) => hs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [h("span", { className: "muted small", children: label }, "l"), h("input", { className: "input sm", type: "number", min: 0, value, readOnly: ro, onChange: (e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0)), style: { width: 96 } }, "i")] }, key);
    const grid3 = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 };
    const subT = (txt) => h("div", { style: { fontWeight: 800, fontSize: 12, margin: "12px 0 6px" }, children: txt });
    const judge = (label, sub) => bigBtn(label, sub, () => rollSkill(`${stSkillPick} 「${label}」`, tgt), tgt == null, label);
    const stFlat = (Number(ins.skill ?? 1) || 0) + (Number(ins.instPower ?? 0) || 0) + Math.max(0, Number(stCond) || 0);
    const combatSkill = (ins.combat ?? {});
    const setCombatSkill = (k, v) => setIns({ combat: { ...combatSkill, [k]: v } });
    const combatRoll = async (k, title, effect, btn, dmgLabel, dmgExpr, askCond, skillOvr, plus, lyric, extra) => {
      if (ro || editing) return;
      const skill = (skillOvr ?? combatSkill[k] ?? "").trim();
      const tgt = cellTarget(skill);
      if (tgt == null) return;
      const v = await promptText({ title: `${title} · 소비할 【컨디션】`, label: "판정 전에 소비할 컨디션", defaultValue: "0" });
      if (v == null) return;
      const c1 = Math.max(0, parseInt(String(v).trim(), 10) || 0);
      const have = stCurRes(character.id, "life");
      if (c1 > have) {
        await alertDialog(`${lifeLabel}이 부족합니다 (현재 ${have})`);
        return;
      }
      const res = rollSum("2d6", { command: `${title} · ${skill} (2d6≥${tgt})` });
      const raw = res.rolls.reduce((x, y) => x + y, 0);
      const sum = res.total + c1;
      const id = raw === 12 ? "special" : raw === 2 ? "fumble" : sum >= tgt ? "success" : "fail";
      const ko = ruleset?.levels?.find((l) => l.id === id)?.ko ?? KO_FALLBACK[id];
      chatRoll({ kind: "dice", dice: { ...res, total: sum, name: `${title} · ${skill}`, judge: { level: CSS_LEVEL[id], ko: ST_CARD_KEY[id], word: ko, target: tgt, eyebrow: ruleset?.systemLabel ?? "" }, card: { charId: character.id, ownerName: character.info.name, title, skill, timing: "라이브", effect, btn, dmgLabel, dmgExpr, dmgPlus: plus, lyric, ...(extra ?? {}), skl: Number(ins.skill ?? 1) || 0, pow: Number(ins.instPower ?? 0) || 0, askCond, gain: k === "heal" || k.startsWith("pheal"), lifeLabel, cond: c1, base: (Number(ins.skill ?? 1) || 0) + (Number(ins.instPower ?? 0) || 0), secret: secretMode } } }, { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 }, { secret: secretMode, charId: character.id });
      if (c1 > 0) stApplyRes(character.id, "life", -c1, lifeLabel);
    };
    const chip = (children, style, key) => h("div", { style: { background: "color-mix(in srgb, var(--sheet) 10%, rgba(128,128,128,.18))", borderRadius: 6, padding: "7px 10px", fontSize: 13, display: "flex", alignItems: "center", minWidth: 0, ...style }, children }, key);
    const combatLine = (k, title, effect, btn, dmgLabel, dmgExpr, askCond) => {
      const tgt = cellTarget((combatSkill[k] ?? "").trim());
      return hs("div", { style: { display: "flex", gap: 8, alignItems: "stretch", border: "1px solid var(--s-line)", borderRadius: 10, padding: 8 }, children: [
        h("button", { type: "button", className: "btn", disabled: ro || tgt == null, title: tgt == null ? "지정 특기를 특기표에 있는 이름으로 입력하세요" : `${combatSkill[k]} 판정(2d6≥${tgt})`, onClick: () => combatRoll(k, title, effect, btn, dmgLabel, dmgExpr, askCond), style: { width: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }, children: h(Icon, { name: "casino", size: 22 }) }),
        chip(title, { fontWeight: 700, flex: "0 0 96px" }),
        chip("라이브", { flex: "0 0 80px" }),
        chip(effect, { flex: 1, fontSize: 12.5, lineHeight: 1.45 }),
        h("input", { className: "input sm", value: combatSkill[k] ?? "", placeholder: "지정특기", readOnly: ro, list: "st-skill-names", onChange: (e) => setCombatSkill(k, e.target.value), style: { flex: "0 0 110px", minWidth: 0, textAlign: "center", background: "color-mix(in srgb, var(--sheet) 10%, rgba(128,128,128,.18))", border: 0, borderRadius: 6 } })
      ] }, k);
    };
    const phraseN = Math.max(1, Math.min(12, Number(ins.phraseCount ?? 3) || 3));
    const getPhrase = (i) => ({ mode: "atk", lyric: "", skill: "", ...((ins.phrases ?? [])[i] ?? {}) });
    const setPhrase = (i, patch) => {
      const arr = Array.from({ length: Math.max((ins.phrases ?? []).length, i + 1) }, (_, j) => getPhrase(j));
      arr[i] = { ...arr[i], ...patch };
      setIns({ phrases: arr });
    };
    const burstListB = Array.isArray(ruleset?.bursts) && ruleset.bursts.length ? ruleset.bursts : ST_BURSTS;
    const curBurstB = burstListB.find((b) => b.instrument === ins.inst);
    const burstExtra = (inst) => ({
      "보컬": { askGul: true },
      "기타": {},
      "베이스": { bass: true },
      "키보드": {},
      "드럼": {}
    })[inst] ?? {};
    const phraseLine = (i) => {
      const p = getPhrase(i);
      const tgt = cellTarget((p.skill ?? "").trim());
      const atk = p.mode !== "heal";
      const grey = "color-mix(in srgb, var(--sheet) 10%, rgba(128,128,128,.18))";
      return hs("div", { style: { display: "flex", gap: 8, alignItems: "stretch", border: "1px solid var(--s-line)", borderRadius: 10, padding: 8 }, children: [
        h("button", { type: "button", className: "btn", disabled: ro || tgt == null, title: tgt == null ? "지정 특기를 특기표에 있는 이름으로 입력하세요" : `${p.skill} 판정(2d6≥${tgt})`, onClick: () => atk ? combatRoll("patk" + i, "프레이즈 공격", "", "대미지 주사위 결과", "프레이즈 공격 대미지", "0", true, p.skill, "2d6", p.lyric) : combatRoll("pheal" + i, "프레이즈 회복", "", "회복 주사위 결과", "프레이즈 회복 (컨디션 획득)", "2d6", false, p.skill, void 0, p.lyric), style: { width: 44, padding: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }, children: h(Icon, { name: "casino", size: 22 }) }),
        atk ? h("button", { type: "button", className: "btn", disabled: ro || tgt == null || !curBurstB, title: !curBurstB ? "정보란에서 악기를 먼저 선택하세요" : tgt == null ? "지정 특기를 특기표에 있는 이름으로 입력하세요" : `${curBurstB.name} 사용`, onClick: () => combatRoll("burst" + i, curBurstB.name, "", "대미지 주사위 결과", `${curBurstB.name} 대미지`, "0", true, p.skill, curBurstB.instrument === "기타" ? void 0 : curBurstB.instrument === "베이스" ? void 0 : "2d6", p.lyric, { ...burstExtra(curBurstB.instrument), burst: true }), style: { flex: "0 0 auto", padding: "0 10px", fontWeight: 800, fontSize: 12, borderRadius: 8 }, children: "버스트" }) : null,
        hs("select", { className: "input sm", value: atk ? "atk" : "heal", disabled: ro, onChange: (e) => setPhrase(i, { mode: e.target.value }), style: { flex: "0 0 84px", background: grey, border: 0, borderRadius: 6, fontWeight: 700 }, children: [h("option", { value: "atk", children: "공격" }), h("option", { value: "heal", children: "회복" })] }),
        h("input", { className: "input sm", value: p.lyric, placeholder: "프레이즈 가사", readOnly: ro, onChange: (e) => setPhrase(i, { lyric: e.target.value }), style: { flex: 1, minWidth: 0, background: grey, border: 0, borderRadius: 6 } }),
        h("input", { className: "input sm", value: p.skill, placeholder: "지정특기", readOnly: ro, list: "st-skill-names", onChange: (e) => setPhrase(i, { skill: e.target.value }), style: { flex: "0 0 110px", minWidth: 0, textAlign: "center", background: grey, border: 0, borderRadius: 6 } })
      ] }, "p" + i);
    };
    const combat = [
      h("div", { style: { fontWeight: 900, fontSize: 15, marginBottom: 8 }, children: "일반" }, "gh"),
      hs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
        combatLine("atk", "일반 공격", "「【악기 위력】 + 【기량】 + 판정으로 소비한 【컨디션】」의 대미지를 주고 그만큼 【지배력】 또는 DP를 감소", "대미지 주사위 결과", "일반 공격 대미지", "0", true),
        combatLine("heal", "일반 회복", "판정 성공시 【컨디션】을 1D6점 획득", "회복 주사위 결과", "일반 회복 (컨디션 획득)", "1d6", false)
      ] }, "rows"),
      hs("div", { style: { marginTop: 18 }, children: [
        hs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }, children: [
          h("div", { style: { fontWeight: 900, fontSize: 15 }, children: "프레이즈" }),
          hs("label", { style: { display: "inline-flex", alignItems: "center", gap: 6, background: "var(--sheet)", color: "#fff", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 800 }, children: ["프레이즈", h("input", { type: "number", min: 1, max: 12, value: phraseN, readOnly: ro, onChange: (e) => setIns({ phraseCount: Math.max(1, Math.min(12, parseInt(e.target.value, 10) || 1)) }), style: { width: 42, textAlign: "center", border: 0, borderRadius: 4, padding: "2px 0", color: "#14141a", background: "#fff" } }), "개 보기"] })
        ] }),
        h("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: Array.from({ length: phraseN }, (_, i) => phraseLine(i)) })
      ] }, "phr"),
      hs("datalist", { id: "st-skill-names", children: namedSkills.map((s) => h("option", { value: s }, s)) }, "dl")
    ];

    const secretArea = h("textarea", { className: "input", rows: 10, value: character.secret ?? "", readOnly: ro, onChange: (e) => updateSecret(e.target.value), style: { resize: "vertical", width: "100%" } }, "ta");
    const mbody = hs("div", { className: "mbody", ref: stMbody, onScroll, children: [
      sec("info", "정보", [stProfile, trackers]),
      sec("spec", "특기", [editing ? h("div", { className: "muted small", style: { marginBottom: 8 }, children: "칸에 특기명을 입력하고 ✓로 습득 표시" }, "hint") : null, stGridEl]),
      sec("bond", "인연", [bonds]),
      sec("combat", "라이브", combat),
      sec("skills", "스킬", [skillRows]),
      page("standing", "스탠딩 · 표정", [h(StandingEditor, { character, ro, onPatch: foreignEdit ? applyEx : void 0 }, "se")]),
      stCanSecret ? page("secret", "비밀 메모", [h("span", { className: "muted small" }, "m", "소유자·방장 GM만 열람"), secretArea]) : null
    ] });
    return h("div", { className: "sheet" + (embed ? " embed" : "") + (sv.solid ? " solid" : "") + (sv.customText ? " customtext" : "") + (sv.customBar ? " custombar" : ""), style: sv.vars, onPointerDownCapture: charId ? () => selectCharacter(charId) : void 0, children: hs("fieldset", { disabled: ro, className: "sheet-fs", children: [head, tabsEl, mbody] }) });
  })();
  const body = /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "sheet ruleframe" + (embed ? " embed" : "") + (sv.solid ? " solid" : "") + (sv.customText ? " customtext" : "") + (sv.customBar ? " custombar" : ""),
      style: sv.vars,
      onPointerDownCapture: charId ? () => selectCharacter(charId) : void 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { disabled: ro, className: "sheet-fs", children: [
        noGrid && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { margin: "0 0 10px", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--sheet)", background: "color-mix(in srgb, var(--sheet) 12%, transparent)", display: "flex", alignItems: "center", gap: 10, fontSize: 13 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "auto_stories", size: 18 }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { flex: 1 }, children: [
            "이 캐릭터는 ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "인세인 룰셋" }),
            "이 필요합니다. ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "insane.tkrule.json" }),
            "을 불러오면 특기표가 표시됩니다."
          ] }),
          !embed && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => useUIStore.getState().setScreen("settings"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "settings", size: 13 }),
            " 룰셋 불러오기"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sheet-head", children: [
          !isStrato && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "hs",
              style: headshot ? { backgroundImage: `url(${headshot})` } : { background: character.color },
              title: ro ? void 0 : "두상 이미지 변경",
              onClick: ro ? void 0 : () => headshotInput.current?.click(),
              children: [
                headshot ? "" : character.info.name[0],
                !ro && (headshot ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rm", title: "두상 제거", onClick: (e) => {
                  e.stopPropagation();
                  setHeadshot(void 0);
                }, children: "✕" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cam", children: "📷" }))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: headshotInput, type: "file", accept: "image/*", hidden: true, onChange: onPickHeadshot }),
          isStrato ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { flex: 1 } }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hs-id", style: { flex: 1, minWidth: 0 }, children: [
            eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { opacity: 0.7, fontSize: 11, letterSpacing: 1 }, children: eyebrow }),
            editing ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: character.info.name, placeholder: "이름", onChange: (e) => updateInfo({ name: e.target.value }), style: { width: "100%", maxWidth: 360, fontWeight: 800, fontSize: 18 } }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 800, fontSize: 20 }, children: character.info.name || "이름 없는 캐릭터" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { marginTop: 2 }, children: [
              character.info.occupation || "직업 미정",
              character.info.gender ? ` · ${character.info.gender}` : ""
            ] })
          ] }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              title: "이 캐릭터로 말할 때 쓸 채팅 이름색. 비우면 내 이름색을 따릅니다.",
              style: { display: "inline-flex", alignItems: "center", gap: 3, cursor: "pointer", alignSelf: "flex-start" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_text", size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: character.nameColor || "#7c9cff",
                    onChange: (e) => applyNameColor(e.target.value),
                    style: { width: 26, height: 22, padding: 0, border: 0, background: "none", cursor: "pointer" }
                  }
                ),
                character.nameColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn sm",
                    title: "이름색 지우기(내 이름색을 따름)",
                    onClick: (e) => {
                      e.preventDefault();
                      applyNameColor(void 0);
                    },
                    children: "✕"
                  }
                )
              ]
            }
          ),
          !ro && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", title: "편집/굴림 전환", onClick: () => setEditing((v) => !v), style: { alignSelf: "flex-start" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: editing ? "check" : "edit", size: 14 }),
            " ",
            editing ? "완료" : "편집"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetPalette, { ap, updateSheet, onExport: exportCharacter, onImport: onImportCharacter })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mbody", children: [
          stProfile,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { style: isStrato ? { display: "none" } : void 0, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "인적사항" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }, children: [
              [["player", "플레이어"], ["occupation", "직업"], ["gender", "성별"], ["age", "연령"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: String(character.info[k] ?? ""), readOnly: !editing, onChange: (e) => updateInfo({ [k]: e.target.value }) })
              ] }, k)),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "국적" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: ins.nationality ?? "", readOnly: !editing, onChange: (e) => setIns({ nationality: e.target.value }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "한마디" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: ins.catchphrase ?? "", placeholder: "캐릭터 한마디", readOnly: !editing, onChange: (e) => setIns({ catchphrase: e.target.value }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tracker, { label: lifeLabel, v: life, ro, onChange: (nv) => setIns({ life: nv }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Tracker, { label: spiritLabel, v: spirit, ro, onChange: (nv) => setIns({ spirit: nv }) })
          ] }),
          !noGrid && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "특기표" }),
              editing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "칸에 특기명을 입력하고 ✓로 습득 표시" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: "auto" }, children: "이하 Success · 초과 Fail · 2 Special · 12 Fumble" })
            ] }),
            stGridEl,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 14, marginTop: 8, flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 4 }, children: [
                "호기심",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input sm", value: ins.curiosity ?? "", disabled: ro, onChange: (e) => setIns({ curiosity: e.target.value }), style: { width: "auto" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "없음" }),
                  ins.curiosity && !namedSkills.includes(ins.curiosity) && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ins.curiosity, children: ins.curiosity }),
                  namedSkills.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, i))
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 4 }, children: [
                "공포심",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input sm", value: ins.fear ?? "", disabled: ro, onChange: (e) => setIns({ fear: e.target.value }), style: { width: "auto" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "없음" }),
                  ins.fear && !namedSkills.includes(ins.fear) && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: ins.fear, children: ins.fear }),
                  namedSkills.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, i))
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "아이템" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }, children: [["painkiller", "진통제"], ["weapon", "무기"], ["charm", "부적"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "input sm",
                  value: ins.items?.[k] ?? "",
                  readOnly: !editing,
                  onChange: (e) => setIns({ items: { painkiller: "", weapon: "", charm: "", ...ins.items, [k]: e.target.value } })
                }
              )
            ] }, k)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "메모" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input", rows: 2, value: ins.memo ?? "", readOnly: ro, onChange: (e) => setIns({ memo: e.target.value }), style: { resize: "vertical" } })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RowSection,
            {
              title: "인물",
              cols: [["name", "이름", 1], ["residence", "거처", 1], ["secret", "비밀", 1.4], ["emotion", "감정", 0.9]],
              rowsData: ins.persons ?? [],
              ro,
              onChange: (next) => setIns({ persons: next }),
              blank: { name: "", residence: "", secret: "", emotion: "" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RowSection,
            {
              title: "어빌리티",
              cols: [["name", "어빌리티명", 1.2], ["type", "타입", 0.8], ["skill", "지정특기", 1], ["effect", "효과", 1.6]],
              rowsData: ins.abilities ?? [],
              ro,
              onChange: (next) => setIns({ abilities: next }),
              blank: { name: "", type: "", skill: "", effect: "" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "광기" }),
              !ro && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", style: { marginLeft: "auto" }, onClick: () => setIns({ madness: [...ins.madness ?? [], { trigger: "", desc: "", manifest: false }] }), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 13 }),
                " 광기 추가"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
              (ins.madness ?? []).map((m, i) => {
                const upd = (patch) => setIns({ madness: (ins.madness ?? []).map((x, j) => j === i ? { ...x, ...patch } : x) });
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { border: "1px solid var(--s-line)", borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 4, background: m.manifest ? "color-mix(in srgb, var(--danger) 12%, transparent)" : "transparent" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, alignItems: "center" }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "small", style: { display: "inline-flex", alignItems: "center", gap: 5, cursor: ro ? "default" : "pointer" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "ins-chk" + (m.manifest ? " on" : ""), disabled: ro, onClick: () => upd({ manifest: !m.manifest }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 13 }) }),
                      "현재화"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input sm", value: m.trigger, placeholder: "트리거(조건)", readOnly: ro, onChange: (e) => upd({ trigger: e.target.value }), style: { flex: 1 } }),
                    !ro && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "삭제", onClick: () => setIns({ madness: (ins.madness ?? []).filter((_, j) => j !== i) }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input", rows: 2, value: m.desc, placeholder: "광기 내용(룰북 보고 입력)", readOnly: ro, onChange: (e) => upd({ desc: e.target.value }), style: { resize: "vertical" } })
                ] }, i);
              }),
              (ins.madness ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "광기 카드가 없습니다." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "핸드아웃" }),
            [["mission", "사명"], ["intro", "도입"], ["secret", "비밀"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input", rows: 2, value: ins[k] ?? "", readOnly: ro, onChange: (e) => setIns({ [k]: e.target.value }), style: { resize: "vertical" } })
            ] }, k))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RowSection,
            {
              title: "공적점",
              cols: [["date", "날짜", 0.7], ["scenario", "돌파 시나리오", 2], ["points", "공적점", 0.7], ["spent", "소비", 0.7]],
              rowsData: ins.records ?? [],
              ro,
              onChange: (next) => setIns({ records: next }),
              blank: { date: "", scenario: "", points: "", spent: "" },
              addLabel: "기록 추가"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "기록" }),
            [["setting", "캐릭터 설정"], ["etc", "기타 사항"]].map(([k, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input", rows: 2, value: ins[k] ?? "", readOnly: ro, onChange: (e) => setIns({ [k]: e.target.value }), style: { resize: "vertical" } })
            ] }, k))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: secTitle, children: "스탠딩 · 표정" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StandingEditor, { character, ro, onPatch: foreignEdit ? applyEx : void 0 })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("section", { style: { borderTop: "1px solid var(--s-line)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 8 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 12 }),
              " GM 비밀 메모 (소유자·GM만)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { className: "input", rows: 2, value: character.secret ?? "", readOnly: ro, onChange: (e) => updateSecret(e.target.value), style: { resize: "vertical" } })
          ] }) })
        ] })
      ] })
    }
  );
  return embed ? (isStrato ? stBodyEl : body) : /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingWindow, { winId: winId ?? "sheet", title: character.info.name || "인세인 시트", icon: "badge", onClose: () => closeWindow(winId ?? "sheet"), defaultW: 760, defaultH: 760, children: isStrato ? stBodyEl : body });
}
function RowSection({
  title,
  cols,
  rowsData,
  ro,
  onChange,
  blank,
  addLabel = "추가"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: 6 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 800 }, children: title }),
      !ro && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", style: { marginLeft: "auto" }, onClick: () => onChange([...rowsData, { ...blank }]), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 13 }),
        " ",
        addLabel
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [
      rowsData.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "항목이 없습니다." }),
      rowsData.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
        cols.map(([key, label, flex]) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input sm",
            value: row[key] ?? "",
            placeholder: label,
            readOnly: ro,
            onChange: (e) => onChange(rowsData.map((x, j) => j === i ? { ...x, [key]: e.target.value } : x)),
            style: { flex: flex ?? 1, minWidth: 0 }
          },
          key
        )),
        !ro && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "삭제", onClick: () => onChange(rowsData.filter((_, j) => j !== i)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }) })
      ] }, i))
    ] })
  ] });
}
const asText = sheetText;
function targetNum(v) {
  if (typeof v === "number") return Number.isFinite(v) ? v : NaN;
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : NaN;
  }
  if (v && typeof v === "object") {
    const cur = v.cur;
    return typeof cur === "number" && Number.isFinite(cur) ? cur : NaN;
  }
  return NaN;
}
function checkCommand(target, label, compare) {
  return `CC${compare === "gte" ? ">=" : "<="}${target} (${label})`;
}
function SheetFrame({
  title,
  winId,
  embed,
  children
}) {
  const closeWindow = useUIStore((s) => s.closeWindow);
  if (embed) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: winId ?? "sheet",
      title,
      icon: "badge",
      onClose: () => closeWindow(winId ?? "sheet"),
      defaultW: 640,
      defaultH: 720,
      children
    }
  );
}
function SchemaSheet({
  charId,
  winId,
  viewCharacter,
  ruleset: rulesetProp,
  readOnly,
  embed,
  onPatch
} = {}) {
  const openWindow = useUIStore((s) => s.openWindow);
  const secretMode = useUIStore((s) => s.secretMode);
  const nameColor = useUIStore((s) => s.nameColor);
  const storeCharacter = useCharacterStore(activeCharacter);
  const charById = useCharacterStore((s) => charId ? s.characters[charId] : void 0);
  const selectCharacter = useCharacterStore((s) => s.selectCharacter);
  const upsertCharacter = useCharacterStore((s) => s.upsertCharacter);
  const character = viewCharacter ?? charById ?? storeCharacter;
  const foreignEdit = !!onPatch;
  const ro = !!readOnly && !foreignEdit;
  const applyEx = (next) => onPatch?.(next);
  const sUpdateInfo = useCharacterStore((s) => s.updateInfo);
  const sUpdateSecret = useCharacterStore((s) => s.updateSecret);
  const sUpdateSheet = useCharacterStore((s) => s.updateSheet);
  const sSetHeadshot = useCharacterStore((s) => s.setHeadshot);
  const sUpdateExtra = useCharacterStore((s) => s.updateExtra);
  const updateInfo = foreignEdit ? (p) => applyEx(charEdits.updateInfo(character, p)) : sUpdateInfo;
  const updateSecret = foreignEdit ? (t) => applyEx(charEdits.updateSecret(character, t)) : sUpdateSecret;
  const updateSheet = foreignEdit ? (p) => applyEx(charEdits.updateSheet(character, p)) : sUpdateSheet;
  const setHeadshot = foreignEdit ? (u) => applyEx(charEdits.setHeadshot(character, u)) : sSetHeadshot;
  const updateExtra = foreignEdit ? (patch) => applyEx(charEdits.updateExtra(character, patch)) : sUpdateExtra;
  const applyNameColor = (color) => {
    const next = { ...character, nameColor: color };
    if (foreignEdit) applyEx(next);
    else upsertCharacter(next);
  };
  const storedRuleset = useRulesetStore((s) => resolveRuleset(s, character.rulesetId));
  const ruleset = rulesetProp ?? storedRuleset;
  const chatRoll = useChatStore((s) => s.roll);
  const [editing, setEditing] = reactExports.useState(false);
  const [tab, setTab] = reactExports.useState("main");
  const headshotInput = reactExports.useRef(null);
  const ap = character.sheet ?? {};
  const sv = computeSheetVars(ap);
  const headshot = character.portrait.headshots?.[0] || character.portrait.headshot;
  const eyebrow = ap.eyebrow ?? "";
  const schema = ruleset?.sheet;
  const rulesetId = character.rulesetId ?? "";
  const bag = sheetBagOf(character.extra, rulesetId);
  const setValue = (key, value) => {
    if (!rulesetId) return;
    const latest = foreignEdit ? character : useCharacterStore.getState().characters[character.id] ?? character;
    const cur = sheetBagOf(latest.extra, rulesetId);
    updateExtra({ [rulesetId]: { ...cur, [key]: value } });
  };
  function doRoll(label, field, target) {
    if (ro) return;
    const opts = customRollOpts(character.rulesetId) ?? {};
    const dice = field.roll?.expr ?? opts.dice;
    const compare = field.roll?.compare ?? opts.compare;
    const speaker = { name: character.info.name, color: character.color, nameColor: character.nameColor || nameColor || void 0 };
    const dr = target != null ? rollCheck(target, { command: checkCommand(target, label, compare), dice, compare, levels: opts.levels }) : rollSum(dice || "1d100", { command: label });
    chatRoll({ kind: "dice", dice: { ...dr, name: label } }, speaker, { secret: secretMode, charId: character.id });
  }
  async function onPickHeadshot(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setHeadshot(await fileToPortraitHeadshot(file));
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  function exportCharacter() {
    const json = JSON.stringify({ __occharacter: 1, version: 1, character }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(character.info.name || "캐릭터").slice(0, 24)}.occhar.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  async function onImportCharacter(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const ch = coerceImportedCharacter(JSON.parse(await file.text()));
      if (!ch) {
        await alertDialog("캐릭터 파일에서 시트 정보를 찾지 못했습니다.");
        return;
      }
      upsertCharacter(ch);
      selectCharacter(ch.id);
      openWindow("sheet:" + ch.id);
    } catch (err) {
      await alertDialog("캐릭터 파일을 불러오지 못했습니다: " + err.message);
    }
  }
  if (!schema) {
    const known = !!ruleset;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SheetFrame, { title: character.info.name || "캐릭터 시트", winId, embed, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sheet basicsheet ruleframe" + (embed ? " embed" : ""), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mbody", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", style: { margin: 12 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec-t", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "extension_off", size: 15 }),
        " 이 시트를 열 수 없습니다"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { display: "flex", flexDirection: "column", gap: 6 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: character.info.name || "이름 없는 캐릭터" }),
          " 는 커스텀 룰셋",
          rulesetId ? ` 「${rulesetId}」` : "",
          " 의 시트입니다."
        ] }),
        known ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "룰셋은 불러와 있지만 시트 구성(",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "sheet" }),
          ")이 비어 있습니다. 룰셋 파일에",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "sheet.sections" }),
          " 를 정의한 뒤 설정 → 룰셋에서 다시 불러오세요."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "이 기기에는 해당 룰셋 파일이 없습니다. 설정 → 룰셋에서 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: ".tkrule.json" }),
          " 을 불러오면 시트가 그대로 열립니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "내용은 보관됩니다. 룰셋을 불러오기 전까지 읽기 전용입니다." })
      ] })
    ] }) }) }) });
  }
  function targetOf(key) {
    if (!key) return NaN;
    const tf = findSheetField(schema, key);
    return tf?.type === "gauge" ? sheetGauge(bag, tf).cur : targetNum(bag[key]);
  }
  function renderField(f) {
    const raw = bag[f.key];
    const label = f.label || f.key;
    const cols = f.cols ?? [];
    switch (f.type) {
      case "longtext":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bgf", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              className: "input",
              rows: 3,
              value: asText(raw),
              placeholder: f.placeholder,
              readOnly: ro,
              onChange: (e) => setValue(f.key, e.target.value),
              style: { resize: "vertical" }
            }
          )
        ] });
      case "number":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input sm",
              type: "number",
              value: String(sheetNum(raw, 0)),
              placeholder: f.placeholder,
              readOnly: ro,
              min: f.min,
              max: f.max,
              onChange: (e) => setValue(f.key, parseInt(e.target.value, 10) || 0)
            }
          )
        ] });
      case "gauge": {
        const g = sheetGauge(bag, f);
        const setG = (next) => setValue(f.key, next);
        const pct2 = g.max > 0 ? Math.max(0, Math.min(100, Math.round(g.cur / g.max * 100))) : 0;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "trk-h", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "l", children: label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "trk-ctl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stp", title: "감소", disabled: ro, onClick: () => setG({ ...g, cur: Math.max(0, g.cur - 1) }), children: "−" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "trk-num",
                  type: "number",
                  value: g.cur,
                  readOnly: ro,
                  onChange: (e) => setG({ ...g, cur: parseInt(e.target.value, 10) || 0 })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("small", { children: "/" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "trk-num",
                  type: "number",
                  value: g.max,
                  title: "최대치",
                  readOnly: ro,
                  onChange: (e) => {
                    setG({ ...g, max: Math.max(0, parseInt(e.target.value, 10) || 0) });
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stp", title: "증가", disabled: ro, onClick: () => setG({ ...g, cur: Math.min(g.max, g.cur + 1) }), children: "+" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { style: { width: pct2 + "%", background: "var(--sheet)" } }) })
        ] });
      }
      case "check":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "info", style: { flexDirection: "row", alignItems: "center", gap: 6, cursor: ro ? "default" : "pointer" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: raw === true, disabled: ro, onChange: (e) => setValue(f.key, e.target.checked) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
        ] });
      case "select": {
        const cur = asText(raw);
        const options = f.options ?? [];
        const orphan = cur && !options.includes(cur);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "input sm", value: cur, disabled: ro, onChange: (e) => setValue(f.key, e.target.value), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "없음" }),
            orphan && /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: cur, children: [
              cur,
              " (목록에 없음)"
            ] }),
            options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o, children: o }, o))
          ] })
        ] });
      }
      case "roll": {
        const target = targetOf(f.roll?.target);
        const hasTarget = Number.isFinite(target);
        const expr = f.roll?.expr ?? customRollOpts(character.rulesetId)?.dice ?? "1d100";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn roll-btn",
            disabled: ro,
            onClick: () => doRoll(label, f, hasTarget ? target : null),
            title: hasTarget ? `${expr} 로 ${target} 판정` : `${expr} 굴리기`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "roll-label", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "casino", size: 15 }),
                " ",
                label
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: hasTarget ? `${expr} → ${target}` : expr })
            ]
          }
        );
      }
      case "rowtable": {
        if (!cols.length) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", children: [
          "「",
          label,
          "」 표에 열(cols) 정의가 없습니다."
        ] });
        const list = sheetRows(raw);
        const write = (next) => setValue(f.key, next);
        const targetKey = f.roll?.target;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: 6, gap: 6 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 800 }, children: label }),
            !ro && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "btn sm",
                style: { marginLeft: "auto" },
                onClick: () => write([...list, {}]),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 13 }),
                  " 추가"
                ]
              }
            )
          ] }),
          cols.length > 0 && list.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 4, marginBottom: 2 }, children: [
            cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { flex: c.flex ?? 1, minWidth: 0 }, children: c.label }, c.key)),
            f.roll && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 34 } }),
            !ro && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { width: 30 } })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 5 }, children: [
            list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "항목이 없습니다." }),
            list.map((row, i) => {
              const t = targetKey ? targetNum(row[targetKey]) : NaN;
              const rowLabel = asText(row[cols[0]?.key ?? ""]) || label;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 4, alignItems: "center" }, children: [
                cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    className: "input sm",
                    value: asText(row[c.key]),
                    placeholder: c.label,
                    readOnly: ro,
                    onChange: (e) => write(list.map((x, j) => j === i ? { ...x, [c.key]: e.target.value } : x)),
                    style: { flex: c.flex ?? 1, minWidth: 0 }
                  },
                  c.key
                )),
                f.roll && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    className: "iconbtn",
                    title: Number.isFinite(t) ? `${rowLabel} 판정 (${t})` : `${rowLabel} 굴리기`,
                    disabled: ro,
                    onClick: () => doRoll(rowLabel, f, Number.isFinite(t) ? t : null),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "casino", size: 15 })
                  }
                ),
                !ro && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "삭제", onClick: () => write(list.filter((_, j) => j !== i)), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }) })
              ] }, i);
            })
          ] })
        ] });
      }
      case "grid": {
        if (!cols.length) return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", children: [
          "「",
          label,
          "」 격자에 열(cols) 정의가 없습니다."
        ] });
        const colCount = Math.max(1, cols.length);
        const rowCount = Math.max(1, f.rows ?? 5);
        const cells = sheetCells(raw, rowCount, colCount);
        const setCell = (r, c, value) => setValue(f.key, cells.map((l, ri) => ri === r ? l.map((x, ci) => ci === c ? value : x) : l));
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { fontWeight: 800, marginBottom: 6 }, children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "grid", gridTemplateColumns: `repeat(${colCount}, 1fr)`, gap: 4, overflowX: "auto" }, children: [
            cols.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { textAlign: "center" }, children: c.label }, c.key)),
            cells.slice(0, rowCount).map(
              (line, r) => line.slice(0, colCount).map((cell, c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "input sm",
                  value: cell,
                  placeholder: "·",
                  readOnly: ro,
                  onChange: (e) => setCell(r, c, e.target.value),
                  style: { minWidth: 0, fontSize: 12, padding: "2px 4px" }
                },
                `${r}:${c}`
              ))
            )
          ] })
        ] });
      }
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "info", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input sm",
              value: asText(raw),
              placeholder: f.placeholder,
              readOnly: ro,
              onChange: (e) => setValue(f.key, e.target.value)
            }
          )
        ] });
    }
  }
  const tabs = [
    { id: "main", label: "시트" },
    { id: "standing", label: "스탠딩 · 표정" },
    { id: "secret", label: "비밀 메모" }
  ];
  const body = /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "sheet basicsheet ruleframe" + (embed ? " embed" : "") + (sv.solid ? " solid" : "") + (sv.customText ? " customtext" : "") + (sv.customBar ? " custombar" : ""),
      style: sv.vars,
      onPointerDownCapture: charId ? () => selectCharacter(charId) : void 0,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { disabled: ro, className: "sheet-fs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sheet-head", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "hs",
              style: headshot ? { backgroundImage: `url(${headshot})` } : { background: character.color },
              title: ro ? void 0 : "두상 이미지 변경",
              onClick: ro ? void 0 : () => headshotInput.current?.click(),
              children: [
                headshot ? "" : character.info.name[0],
                !ro && (headshot ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rm", title: "두상 제거", onClick: (e) => {
                  e.stopPropagation();
                  setHeadshot(void 0);
                }, children: "✕" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "cam", children: "📷" }))
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: headshotInput, type: "file", accept: "image/*", hidden: true, onChange: onPickHeadshot }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-id", style: { flex: 1, minWidth: 0 }, children: editing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input sm",
                value: eyebrow,
                placeholder: "상단 문구",
                onChange: (e) => updateSheet({ eyebrow: e.target.value }),
                style: { width: "100%", maxWidth: 360, marginBottom: 4 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input",
                value: character.info.name,
                placeholder: "이름",
                onChange: (e) => updateInfo({ name: e.target.value }),
                style: { width: "100%", maxWidth: 360, fontWeight: 800, fontSize: 18 }
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            (eyebrow || ruleset?.systemLabel) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-eyebrow", children: eyebrow || ruleset?.systemLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hs-name", children: character.info.name || "이름 없는 캐릭터" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { marginTop: 2 }, children: ruleset?.name ?? rulesetId })
          ] }) }),
          editing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              title: "이 캐릭터로 말할 때 쓸 채팅 이름색. 비우면 내 이름색을 따릅니다.",
              style: { display: "inline-flex", alignItems: "center", gap: 3, cursor: "pointer", alignSelf: "flex-start" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_text", size: 14 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: character.nameColor || "#7c9cff",
                    onChange: (e) => applyNameColor(e.target.value),
                    style: { width: 26, height: 22, padding: 0, border: 0, background: "none", cursor: "pointer" }
                  }
                ),
                character.nameColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn sm",
                    title: "이름색 지우기(내 이름색을 따름)",
                    onClick: (e) => {
                      e.preventDefault();
                      applyNameColor(void 0);
                    },
                    children: "✕"
                  }
                )
              ]
            }
          ),
          !ro && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn sm" + (editing ? " pri" : ""),
              title: "이름·상단 문구 편집",
              onClick: () => setEditing((v) => !v),
              style: { alignSelf: "flex-start" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: editing ? "check" : "edit", size: 14 }),
                " ",
                editing ? "완료" : "편집"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetPalette, { ap, updateSheet, onExport: exportCharacter, onImport: onImportCharacter })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sheet-tabs", children: tabs.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "stab" + (tab === t.id ? " on" : ""), onClick: () => setTab(t.id), children: t.label }, t.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mbody", children: [
          tab === "main" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "basic-body", children: schema.sections.map((sec) => {
            const cols = Math.max(1, sec.cols ?? 2);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cocsec", children: [
              sec.title && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "cocsec-t", children: sec.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: 8 }, children: sec.fields.map((f) => {
                const wide = f.type === "rowtable" || f.type === "grid" || f.type === "longtext";
                const span = Math.min(cols, Math.max(1, f.span ?? (wide ? cols : 1)));
                return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { gridColumn: `span ${span}`, minWidth: 0 }, children: renderField(f) }, f.key);
              }) })
            ] }, sec.id);
          }) }),
          tab === "standing" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "basic-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StandingEditor, { character, ro, onPatch: foreignEdit ? applyEx : void 0 }) }),
          tab === "secret" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "basic-body", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 13 }),
              " 소유자·GM만 볼 수 있는 메모입니다."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: "input",
                rows: 10,
                value: character.secret ?? "",
                onChange: (e) => updateSecret(e.target.value),
                style: { width: "100%", resize: "vertical" }
              }
            )
          ] })
        ] })
      ] })
    }
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SheetFrame, { title: character.info.name || "캐릭터 시트", winId, embed, children: body });
}
function isRenderable(c) {
  return !!c && !!c.info && !!c.characteristics && !!c.status && !!c.portrait && Array.isArray(c.skills) && Array.isArray(c.weapons);
}
function SheetViewer() {
  const viewingPlayerId = useNetStore((s) => s.viewingPlayerId);
  const sheetsRaw = useNetStore((s) => s.viewingPlayerId ? s.viewedSheets[s.viewingPlayerId] : void 0);
  const participants = useNetStore((s) => s.participants);
  const roster = useNetStore((s) => s.roster);
  const closeSheetViewer = useNetStore((s) => s.closeSheetViewer);
  const closeWindow = useUIStore((s) => s.closeWindow);
  const isGM = useNetStore((s) => s.self?.role === "GM");
  const revokeChar = useNetStore((s) => s.revokeChar);
  const editSheetOf = useNetStore((s) => s.editSheetOf);
  const imported = useRulesetStore((s) => s.imported);
  const [selId, setSelId] = reactExports.useState(null);
  if (!viewingPlayerId) return null;
  const sheets = sheetsRaw;
  const p = participants.find((x) => x.playerId === viewingPlayerId);
  const name = roster[viewingPlayerId]?.name || p?.nick || "참가자";
  const wornId = roster[viewingPlayerId]?.charId;
  const selected = sheets ? sheets.find((c) => c.id === selId) ?? sheets.find((c) => c.id === wornId) ?? sheets[0] : void 0;
  function close() {
    closeSheetViewer();
    closeWindow("sheetview");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    FloatingWindow,
    {
      winId: "sheetview",
      title: `${name} 시트`,
      icon: "visibility",
      onClose: close,
      defaultW: 880,
      defaultH: 820,
      children: [
        sheets && sheets.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 6, padding: "8px 10px 2px", flexWrap: "wrap" }, children: sheets.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "btn sm" + (c.id === selected?.id ? " pri" : ""),
            onClick: () => setSelId(c.id),
            children: c.info?.name || "이름 없음"
          },
          c.id
        )) }),
        isGM && selected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "8px 10px 0", flexWrap: "wrap" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            className: "btn sm",
            onClick: async () => {
              if (await confirmDialog(
                `「${selected.info?.name || "시트"}」 시트를 ${name} 에게서 회수할까요?
대상의 권한은 사라지고, 내 라이브러리로 옮겨집니다.`
              )) {
                revokeChar(viewingPlayerId, selected.id);
                setSelId(null);
              }
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "inventory_2", size: 14 }),
              " 이 시트 회수 (GM 라이브러리로)"
            ]
          }
        ) }),
        !sheets ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 20 }, children: "시트를 불러오는 중…" }) : sheets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 20 }, children: "저장된 캐릭터 시트가 없습니다." }) : isRenderable(selected) ? (() => {
          const kind = characterSheetKind({ imported }, selected);
          const onPatch = (next) => editSheetOf(viewingPlayerId, next);
          if (kind === "coc") return /* @__PURE__ */ jsxRuntimeExports.jsx(CharacterSheet, { viewCharacter: selected, embed: true, onPatch }, selected.id);
          if (kind === "insane") return /* @__PURE__ */ jsxRuntimeExports.jsx(InsaneSheet, { viewCharacter: selected, embed: true, onPatch }, selected.id);
          if (kind === "custom")
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              SchemaSheet,
              {
                viewCharacter: selected,
                ruleset: resolveRuleset({ imported }, selected.rulesetId),
                embed: true,
                onPatch
              },
              selected.id
            );
          return /* @__PURE__ */ jsxRuntimeExports.jsx(BasicSheet, { viewCharacter: selected, embed: true, onPatch }, selected.id);
        })() : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: 20 }, children: "시트 데이터를 표시할 수 없습니다." })
      ]
    }
  );
}
const TABS = [
  { id: "characters", label: "캐릭터 시트", icon: "recent_actors" },
  { id: "handouts", label: "핸드아웃", icon: "article" }
];
const tabStyle = (on) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  padding: "8px 12px",
  border: 0,
  background: "none",
  cursor: "pointer",
  borderBottom: on ? "2px solid var(--accent)" : "2px solid transparent",
  color: on ? "var(--text)" : "var(--muted)",
  fontWeight: on ? 800 : 600,
  fontSize: 13
});
const rep = (c) => c.portrait.headshots?.[0] || c.portrait.headshot;
function CharacterHub() {
  const openWindow = useUIStore((s) => s.openWindow);
  const closeWindow = useUIStore((s) => s.closeWindow);
  const characters = useCharacterStore((s) => s.characters);
  const activeId = useCharacterStore((s) => s.activeCharacterId);
  const addCharacter = useCharacterStore((s) => s.addCharacter);
  const selectCharacter = useCharacterStore((s) => s.selectCharacter);
  const removeCharacter = useCharacterStore((s) => s.removeCharacter);
  const self = useNetStore((s) => s.self);
  const roomCharIds = useNetStore((s) => s.roomCharIds);
  const addRoomChar = useNetStore((s) => s.addRoomChar);
  const removeRoomChar = useNetStore((s) => s.removeRoomChar);
  const grantChar = useNetStore((s) => s.grantChar);
  const participants = useNetStore((s) => s.participants);
  const roster = useNetStore((s) => s.roster);
  const requestSheet = useNetStore((s) => s.requestSheet);
  const isGM = self?.role === "GM";
  const inRoom = !!self;
  const ruleImported = useRulesetStore((s) => s.imported);
  const sheetTypes = [...allRulesets({ imported: ruleImported })].sort(
    (a, b) => a.id === "basic" ? -1 : b.id === "basic" ? 1 : 0
  );
  const [tab, setTab] = reactExports.useState("characters");
  const [importing, setImporting] = reactExports.useState(false);
  const [picking, setPicking] = reactExports.useState(false);
  const [grantFor, setGrantFor] = reactExports.useState(null);
  const all = Object.values(characters);
  const list = inRoom ? all.filter((c) => roomCharIds.includes(c.id)) : all;
  const importable = all.filter((c) => !roomCharIds.includes(c.id));
  const targets = participants.filter((p) => p.playerId !== self?.playerId);
  const openSheet = (id) => {
    selectCharacter(id);
    openWindow("sheet:" + id);
  };
  const onAdd = (rulesetId) => {
    const id = addCharacter(void 0, rulesetId);
    if (inRoom) addRoomChar(id);
    openWindow("sheet:" + id);
    setPicking(false);
  };
  const onRemoveRow = async (id, name) => {
    if (inRoom) {
      removeRoomChar(id);
      closeWindow("sheet:" + id);
      return;
    }
    if (all.length <= 1) return;
    if (await confirmDialog(`'${name || "이름 없는 탐사자"}' 캐릭터를 삭제할까요?
되돌릴 수 없습니다.`)) {
      removeCharacter(id);
      closeWindow("sheet:" + id);
    }
  };
  const onPermanentDelete = async (id, name) => {
    if (all.length <= 1) return;
    if (await confirmDialog(`'${name || "이름 없는 탐사자"}' 캐릭터를 라이브러리에서 영구 삭제할까요?
되돌릴 수 없습니다.`)) {
      removeRoomChar(id);
      removeCharacter(id);
      closeWindow("sheet:" + id);
    }
  };
  const onGrant = (targetPlayerId) => {
    if (grantFor) grantChar(targetPlayerId, grantFor);
    setGrantFor(null);
  };
  const wide = tab === "handouts";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingWindow, { winId: "characters", title: "관리", icon: "recent_actors", onClose: () => closeWindow("characters"), defaultW: wide ? 900 : 600, defaultH: 680, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", gap: 2, padding: "8px 12px 0", borderBottom: "1px solid var(--line2)" }, children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { style: tabStyle(tab === t.id), onClick: () => setTab(t.id), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: t.icon, size: 15 }),
      " ",
      t.label
    ] }, t.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: wide ? { flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: 16 } : { padding: 16, overflowY: "auto" },
        children: [
          tab === "characters" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: [
            list.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted", style: { textAlign: "center", padding: "20px 8px", lineHeight: 1.6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "recent_actors", size: 32, className: "muted" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { marginTop: 8 }, children: "이 방에는 아직 캐릭터 시트가 없습니다." })
            ] }),
            list.map((c) => {
              const isActive = c.id === activeId;
              const r = rep(c);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  onClick: () => openSheet(c.id),
                  title: "클릭하면 활성으로 전환하고 시트를 엽니다",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 12,
                    cursor: "pointer",
                    background: isActive ? "color-mix(in srgb, var(--accent) 14%, transparent)" : "rgba(255,255,255,0.03)",
                    boxShadow: isActive ? "0 0 0 1.5px var(--accent)" : "0 0 0 1px var(--line2)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av", style: { width: 44, height: 44, flex: "0 0 auto", background: r ? `center/cover url(${r})` : c.color }, children: r ? "" : c.info.name?.[0] ?? "?" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", flexDirection: "column", minWidth: 0, lineHeight: 1.35 }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: [
                        c.info.name || "이름 없는 탐사자",
                        isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip acc", style: { marginLeft: 6 }, children: "활성" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
                        c.info.occupation || "직업 미정",
                        c.info.age ? ` · ${c.info.age}세` : ""
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 6, flex: "0 0 auto" }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", title: "시트 열기", onClick: (e) => {
                        e.stopPropagation();
                        openSheet(c.id);
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_new", size: 14 }),
                        " 열기"
                      ] }),
                      isGM && targets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", title: "이 시트를 플레이어에게 복사 지급", onClick: (e) => {
                        e.stopPropagation();
                        setGrantFor(c);
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "redeem", size: 14 }),
                        " 지급"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          className: "iconbtn",
                          disabled: !inRoom && all.length <= 1,
                          title: inRoom ? "이 방에서 빼기 (라이브러리엔 남음)" : "삭제",
                          onClick: (e) => {
                            e.stopPropagation();
                            onRemoveRow(c.id, c.info.name);
                          },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: inRoom ? "remove_circle" : "delete", size: 16 })
                        }
                      )
                    ] })
                  ]
                },
                c.id
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 8, marginTop: 4 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => setPicking((v) => !v), style: { flex: 1, justifyContent: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 16 }),
                " 새 캐릭터"
              ] }),
              inRoom && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn", onClick: () => setImporting(true), style: { flex: 1, justifyContent: "center" }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "library_add", size: 16 }),
                " 라이브러리에서 가져오기",
                importable.length ? ` (${importable.length})` : ""
              ] })
            ] }),
            picking && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: 10, borderRadius: 10, border: "1px solid var(--line2)", background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column", gap: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { display: "flex", alignItems: "center", gap: 6 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "style", size: 13 }),
                " 시트 종류를 고르세요"
              ] }),
              sheetTypes.map((rs) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", style: { justifyContent: "flex-start" }, onClick: () => onAdd(rs.id), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: rs.kind === "basic" ? "book_ribbon" : "auto_stories", size: 14 }),
                " ",
                rs.name,
                rs.kind === "basic" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { marginLeft: 6 }, children: "룰 없음" })
              ] }, rs.id))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { marginTop: 6, display: "inline-flex", alignItems: "center", gap: 6 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "info", size: 12 }),
              " 활성 캐릭터가 채팅·굴림·미연시 무대에 반영됩니다. ",
              inRoom && "시트는 방마다 따로 보관됩니다."
            ] }),
            importing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8, padding: 10, borderRadius: 10, border: "1px solid var(--line2)", background: "rgba(255,255,255,0.02)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { style: { fontSize: 13 }, children: "라이브러리에서 가져오기" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", style: { marginLeft: "auto", width: 26, height: 26 }, title: "닫기", onClick: () => setImporting(false), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 }) })
              ] }),
              importable.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "가져올 다른 시트가 없습니다." }),
              importable.map((c) => {
                const r = rep(c);
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "6px 4px" }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "av", style: { width: 30, height: 30, flex: "0 0 auto", fontSize: 12, background: r ? `center/cover url(${r})` : c.color }, children: r ? "" : c.info.name?.[0] ?? "?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, minWidth: 0, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: c.info.name || "이름 없는 탐사자" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: () => addRoomChar(c.id), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 13 }),
                    " 가져오기"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", disabled: all.length <= 1, title: "라이브러리에서 영구 삭제", onClick: () => onPermanentDelete(c.id, c.info.name), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 15 }) })
                ] }, c.id);
              })
            ] }),
            grantFor && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 8, padding: 10, borderRadius: 10, border: "1px solid var(--accent)", background: "color-mix(in srgb, var(--accent) 8%, transparent)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", marginBottom: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { style: { fontSize: 13 }, children: [
                  "「",
                  grantFor.info.name || "시트",
                  "」 지급 대상"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", style: { marginLeft: "auto", width: 26, height: 26 }, title: "취소", onClick: () => setGrantFor(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { marginBottom: 6 }, children: "사본으로 복사되며, 이후 그 플레이어가 소유합니다." }),
              targets.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "지급할 다른 참가자가 없습니다." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 4 }, children: targets.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", style: { justifyContent: "flex-start" }, onClick: () => onGrant(p.playerId), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "person", size: 14 }),
                " ",
                p.nick,
                " 에게 지급"
              ] }, p.playerId)) })
            ] }),
            isGM && targets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--line2)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "visibility", size: 13 }),
                " 참가자 시트 (GM 열람·관리)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { display: "flex", flexDirection: "column", gap: 6 }, children: targets.map((p) => {
                const rc = roster[p.playerId];
                const r = rc ? activeHeadshot(rc) : void 0;
                const nm = rc?.name || p.nick;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    className: "btn",
                    style: { justifyContent: "flex-start", gap: 10 },
                    title: "이 참가자의 시트를 엽니다",
                    onClick: () => {
                      requestSheet(p.playerId);
                      openWindow("sheetview");
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "av",
                          style: { width: 28, height: 28, flex: "0 0 auto", fontSize: 12, background: r ? `center/cover url(${r})` : rc?.color || p.color },
                          children: r ? "" : nm[0] ?? "?"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { flex: 1, minWidth: 0, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: nm }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: p.role }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_new", size: 14 })
                    ]
                  },
                  p.playerId
                );
              }) })
            ] })
          ] }),
          tab === "handouts" && /* @__PURE__ */ jsxRuntimeExports.jsx(HandoutPanelBody, {})
        ]
      }
    )
  ] }) });
}
const emptyOpts = () => [
  { label: "", script: "" },
  { label: "", script: "" }
];
function toPayload(opts) {
  return opts.map((o, i) => ({ id: `o${i}`, label: o.label.trim(), script: o.script.trim() || void 0 })).filter((o) => o.label);
}
function ChoicePanel() {
  const closeWindow = useUIStore((s) => s.closeWindow);
  const presets = useUIStore((s) => s.choicePresets);
  const addChoicePreset = useUIStore((s) => s.addChoicePreset);
  const removeChoicePreset = useUIStore((s) => s.removeChoicePreset);
  const sendChoice = useNetStore((s) => s.sendChoice);
  const [prompt, setPrompt] = reactExports.useState("");
  const [opts, setOpts] = reactExports.useState(emptyOpts);
  const [bgColor, setBgColor] = reactExports.useState("");
  const [btnColor, setBtnColor] = reactExports.useState("");
  const [textColor, setTextColor] = reactExports.useState("");
  const [promptColor, setPromptColor] = reactExports.useState("");
  const choiceColors = () => ({
    bgColor: bgColor || void 0,
    btnColor: btnColor || void 0,
    textColor: textColor || void 0,
    promptColor: promptColor || void 0
  });
  function post() {
    const p = prompt.trim();
    const payload = toPayload(opts);
    if (!p || payload.length < 2) {
      void alertDialog("질문과 버튼(라벨)을 2개 이상 입력하세요.");
      return;
    }
    sendChoice(p, payload, choiceColors());
  }
  function reset() {
    setPrompt("");
    setOpts(emptyOpts());
    setBgColor("");
    setBtnColor("");
    setTextColor("");
    setPromptColor("");
  }
  function saveAsPreset() {
    const p = prompt.trim();
    const valid = opts.filter((o) => o.label.trim());
    if (!p || valid.length < 2) {
      void alertDialog("프리셋으로 저장하려면 질문과 버튼(라벨)이 2개 이상 필요합니다.");
      return;
    }
    addChoicePreset({ name: p.slice(0, 40), prompt: p, options: valid.map((o) => ({ label: o.label.trim(), script: o.script.trim() })), ...choiceColors() });
  }
  function loadPreset(preset) {
    setPrompt(preset.prompt);
    setOpts(preset.options.length ? preset.options.map((o) => ({ label: o.label, script: o.script })) : emptyOpts());
    setBgColor(preset.bgColor ?? "");
    setBtnColor(preset.btnColor ?? "");
    setTextColor(preset.textColor ?? "");
    setPromptColor(preset.promptColor ?? "");
  }
  function postPreset(preset) {
    const payload = toPayload(preset.options.map((o) => ({ label: o.label, script: o.script })));
    if (payload.length < 2) {
      void alertDialog("이 프리셋은 버튼이 2개 미만이라 게시할 수 없습니다.");
      return;
    }
    sendChoice(preset.prompt, payload, {
      bgColor: preset.bgColor || void 0,
      btnColor: preset.btnColor || void 0,
      textColor: preset.textColor || void 0,
      promptColor: preset.promptColor || void 0
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(FloatingWindow, { winId: "choice", title: "선택지 만들기 (GM)", icon: "quiz", onClose: () => closeWindow("choice"), defaultW: 480, defaultH: 580, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "choice-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        className: "input",
        placeholder: "질문 (예: 어느 문을 여시겠습니까?)",
        value: prompt,
        onChange: (e) => setPrompt(e.target.value),
        style: { marginBottom: 8 }
      }
    ),
    opts.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          placeholder: `버튼 ${i + 1}`,
          value: o.label,
          onChange: (e) => setOpts((arr) => arr.map((x, j) => j === i ? { ...x, label: e.target.value } : x)),
          style: { flex: "0 0 34%" }
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input",
          placeholder: "고른 사람에게만 보일 스크립트(선택)",
          value: o.script,
          onChange: (e) => setOpts((arr) => arr.map((x, j) => j === i ? { ...x, script: e.target.value } : x)),
          style: { flex: 1 }
        }
      ),
      opts.length > 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "iconbtn",
          style: { width: 26, height: 26 },
          title: "이 버튼 삭제",
          onClick: () => setOpts((arr) => arr.filter((_, j) => j !== i)),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 })
        }
      )
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 4 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "palette", size: 13 }),
        " 색"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 5 }, children: [
        "창",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: bgColor || "#1b2030", onChange: (e) => setBgColor(e.target.value), style: { width: 32, height: 24, padding: 0, border: 0, background: "none", cursor: "pointer" } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 5 }, children: [
        "버튼",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: btnColor || "#5566cc", onChange: (e) => setBtnColor(e.target.value), style: { width: 32, height: 24, padding: 0, border: 0, background: "none", cursor: "pointer" } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 5 }, title: "질문(상단 문구) 글씨색", children: [
        "질문 글씨",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: promptColor || "#e9ecf6", onChange: (e) => setPromptColor(e.target.value), style: { width: 32, height: 24, padding: 0, border: 0, background: "none", cursor: "pointer" } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "muted small", style: { display: "inline-flex", alignItems: "center", gap: 5 }, title: "선택지(버튼) 글씨색", children: [
        "선택지 글씨",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: textColor || "#e9ecf6", onChange: (e) => setTextColor(e.target.value), style: { width: 32, height: 24, padding: 0, border: 0, background: "none", cursor: "pointer" } })
      ] }),
      (bgColor || btnColor || textColor || promptColor) && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: () => {
        setBgColor("");
        setBtnColor("");
        setTextColor("");
        setPromptColor("");
      }, title: "색을 테마 기본값으로", children: "색 초기화" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 6, marginTop: 8 }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", disabled: opts.length >= 8, onClick: () => setOpts((arr) => [...arr, { label: "", script: "" }]), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 14 }),
        " 버튼 추가"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: reset, title: "폼 비우기", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 14 }),
        " 초기화"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm pri", style: { marginLeft: "auto" }, onClick: post, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "send", size: 14 }),
        " 게시"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "choice-presets", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "choice-presets-h", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "저장된 선택지 세트" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: saveAsPreset, title: "현재 작성한 선택지를 프리셋으로 저장", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark_add", size: 14 }),
          " 현재 저장"
        ] })
      ] }),
      presets.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", style: { padding: "6px 2px" }, children: "저장된 세트가 없습니다. 작성 후 「현재 저장」을 누르세요." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "choice-preset-list", children: presets.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "choice-preset", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "choice-preset-name", title: p.prompt, children: p.name || p.prompt }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "폼으로 불러오기", onClick: () => loadPreset(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "바로 게시", onClick: () => postPreset(p), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "send", size: 14 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "iconbtn", title: "프리셋 삭제", onClick: () => removeChoicePreset(p.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 }) })
      ] }, p.id)) })
    ] })
  ] }) });
}
function initTable(custom, base) {
  return custom && custom.length ? [...custom] : [...base];
}
function MadnessEditor() {
  const closeWindow = useUIStore((s) => s.closeWindow);
  const roomMadness = useNetStore((s) => s.roomMadness);
  const setRoomMadness = useNetStore((s) => s.setRoomMadness);
  const isGM = useNetStore((s) => s.self?.role === "GM");
  const base = rsMadness(useRulesetStore((s) => resolveRuleset(s, "coc7e")));
  const [rtTemp, setRtTemp] = reactExports.useState(() => initTable(roomMadness?.realtimeTemp, base.realtimeTemp));
  const [rtIndef, setRtIndef] = reactExports.useState(() => initTable(roomMadness?.realtimeIndef, base.realtimeIndef));
  const [summary, setSummary] = reactExports.useState(() => initTable(roomMadness?.summary, base.summary));
  const [saved, setSaved] = reactExports.useState(false);
  if (!isGM) return null;
  function apply() {
    const clean = (rows) => rows.map((r) => r.trim()).filter(Boolean);
    setRoomMadness({ realtimeTemp: clean(rtTemp), realtimeIndef: clean(rtIndef), summary: clean(summary) });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }
  function restoreDefault() {
    setRtTemp([...base.realtimeTemp]);
    setRtIndef([...base.realtimeIndef]);
    setSummary([...base.summary]);
    setRoomMadness({ realtimeTemp: [], realtimeIndef: [], summary: [] });
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }
  const column = (title, hint, table, setter) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mad-edit-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mad-edit-col-h", children: [
      title,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: hint })
    ] }),
    table.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mad-edit-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-edit-n", children: i + 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          className: "mad-edit-ta",
          rows: 2,
          value: v,
          placeholder: "(비우면 제외)",
          onChange: (e) => setter(table.map((x, j) => j === i ? e.target.value : x))
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "iconbtn",
          style: { width: 24, height: 24, flex: "none" },
          title: "이 항목 삭제",
          onClick: () => setter(table.filter((_, j) => j !== i)),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 13 })
        }
      )
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm mad-edit-addrow", onClick: () => setter([...table, ""]), title: "이 표에 항목 추가", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 13 }),
      " 항목 추가"
    ] })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    FloatingWindow,
    {
      winId: "madness",
      title: "광기 표 편집 (GM)",
      icon: "neurology",
      onClose: () => closeWindow("madness"),
      defaultW: 940,
      defaultH: 660,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mad-edit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mad-edit-note muted small", children: "「전원에 적용」하면 방 전체가 같은 표를 씁니다. 비운 표는 기본표를 씁니다." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mad-edit-cols", children: [
          column("실시간 · 일시적", "라운드", rtTemp, setRtTemp),
          column("실시간 · 장기적", "라운드", rtIndef, setRtIndef),
          column("요약", "시간", summary, setSummary)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mad-edit-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm", onClick: restoreDefault, title: "기본 7판 표로 되돌리고 동기화 해제", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "restart_alt", size: 14 }),
            " 기본값으로"
          ] }),
          saved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "small", style: { marginLeft: "auto", color: "var(--good)", fontWeight: 800 }, children: "적용됨 ✓" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn sm pri", style: { marginLeft: saved ? 8 : "auto" }, onClick: apply, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "check", size: 14 }),
            " 전원에 적용"
          ] })
        ] })
      ] })
    }
  );
}
function SheetWindow({ winId, charId }) {
  const character = useCharacterStore((s) => s.characters[charId]);
  const imported = useRulesetStore((s) => s.imported);
  const kind = character ? characterSheetKind({ imported }, character) : "basic";
  if (kind === "coc") return /* @__PURE__ */ jsxRuntimeExports.jsx(CharacterSheet, { winId, charId });
  if (kind === "insane") return /* @__PURE__ */ jsxRuntimeExports.jsx(InsaneSheet, { winId, charId });
  if (kind === "custom")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SchemaSheet, { winId, charId, ruleset: resolveRuleset({ imported }, character?.rulesetId) });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(BasicSheet, { winId, charId });
}
const useDiceStore = create()(
  persist(
    (set) => ({
      luckResolved: {},
      resolveLuck: (msgId) => set((s) => ({ luckResolved: { ...s.luckResolved, [msgId]: true } }))
    }),
    { name: "orpg-dice" }
  )
);
const DRAG_SLOP = 4;
const TOUCH_SLOP = 10;
function tabPressOutcome(p) {
  if (p.cancelled) return { kind: "ignore" };
  if (p.pointerType === "mouse") return p.moved < DRAG_SLOP ? { kind: "select" } : { kind: "drag" };
  return p.moved <= TOUCH_SLOP ? { kind: "select" } : { kind: "ignore" };
}
function tabDropAction(point, strip, overKey, fromKey) {
  if (!strip) return { kind: "detach" };
  const inStrip = point.clientX >= strip.left && point.clientX <= strip.right && point.clientY >= strip.top && point.clientY <= strip.bottom;
  if (!inStrip) return { kind: "detach" };
  if (!overKey || overKey === "main" || fromKey === "main" || overKey === fromKey) return { kind: "none" };
  return { kind: "reorder", to: overKey };
}
function onLocalDate(time, date) {
  if (!date) return true;
  const d = new Date(time);
  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  return key === date;
}
function searchMessages(messages, opts = {}) {
  const q = (opts.query ?? "").trim().toLowerCase();
  const author = opts.author ?? "";
  const channel = opts.channel ?? "";
  const date = opts.date ?? "";
  const includeSystem = opts.includeSystem ?? false;
  return messages.filter((m) => {
    if (!includeSystem && m.kind === "system") return false;
    if (channel && m.channel !== channel) return false;
    if (author && m.author !== author) return false;
    if (!onLocalDate(m.time, date)) return false;
    if (!q) return true;
    const hay = `${m.text ?? ""} ${m.author ?? ""} ${m.dice?.command ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}
const FALLBACK_LEVELS = {
  critical: { word: "CRITICAL", script: "Critical" },
  extreme: { word: "EXTREME", script: "Extreme" },
  hard: { word: "HARD", script: "Hard" },
  regular: { word: "SUCCESS", script: "Success" },
  success: { word: "SUCCESS", script: "Success" },
  special: { word: "SPECIAL", script: "Special" },
  fail: { word: "FAIL", script: "Fail" },
  fumble: { word: "FUMBLE", script: "Fumble" }
};
function findLevel(ruleset, levelId) {
  return ruleset?.levels?.find((l) => l.id === levelId);
}
function levelWord(ruleset, levelId, koFallback) {
  return findLevel(ruleset, levelId)?.word ?? FALLBACK_LEVELS[levelId]?.word ?? koFallback ?? levelId.toUpperCase();
}
function levelScript(ruleset, levelId, koFallback) {
  return findLevel(ruleset, levelId)?.script ?? FALLBACK_LEVELS[levelId]?.script ?? koFallback ?? levelId;
}
function systemEyebrow(ruleset) {
  return ruleset?.systemLabel ?? "";
}
function useTumble$1(target, max, live, ms = 600) {
  const [val, setVal] = reactExports.useState(target);
  reactExports.useEffect(() => {
    if (!live) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      if (now - start < ms) {
        setVal(1 + Math.floor(Math.random() * max));
        raf = requestAnimationFrame(tick);
      } else {
        setVal(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, max, live, ms]);
  return val;
}
function ThresholdTrack({ target, roll, levels }) {
  const hasThresh = !!levels?.some((l) => l.threshold);
  const divs = hasThresh ? (levels ?? []).map((l) => l.threshold?.div).filter((d) => !!d && d > 1).sort((a, b) => b - a) : [];
  const ex = Math.floor(target / (hasThresh ? divs[0] ?? 5 : 5));
  const hd = Math.floor(target / (hasThresh ? divs[1] ?? divs[0] ?? 2 : 2));
  const tg = Math.min(target, 100);
  const fumbleStart = hasThresh ? (levels ?? []).reduce((m, l) => l.threshold?.atLeast != null ? Math.min(m, l.threshold.atLeast) : m, 101) : target < 50 ? 96 : 100;
  const fb = Math.max(Math.min(fumbleStart, 100) - 1, tg);
  const grad = `linear-gradient(90deg, var(--trk-ex, #4fd6b0) 0 ${ex}%, var(--trk-hd, var(--good)) ${ex}% ${hd}%, var(--trk-rg, var(--accent)) ${hd}% ${tg}%, var(--trk-fl, var(--bad)) ${tg}% ${fb}%, var(--trk-fb, var(--fumble)) ${fb}% 100%)`;
  const pos = Math.max(0, Math.min(100, roll));
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dtrack", style: { background: grad }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "dmark", style: { left: `${pos}%` } }) });
}
function sumBreakdown(dice) {
  if (!dice.rolls.length) return null;
  const sum = dice.rolls.reduce((a, b) => a + b, 0);
  if (sum + dice.modifier !== dice.total) return `${dice.rolls.join(", ")} → ${dice.total}`;
  if (dice.rolls.length === 1 && !dice.modifier) return null;
  const mod = dice.modifier ? dice.modifier > 0 ? ` + ${dice.modifier}` : ` − ${-dice.modifier}` : "";
  return `${dice.rolls.join(" + ")}${mod} = ${dice.total}`;
}
function sanBreakdown(dice) {
  const parts = [];
  if (dice.rolls && dice.rolls.length > 1) {
    const sum = dice.rolls.reduce((a, b) => a + b, 0);
    parts.push(
      sum === dice.roll ? `판정 ${dice.rolls.join(" + ")} = ${dice.roll}` : `판정 ${dice.rolls.join(", ")} → ${dice.roll}`
    );
  }
  const lost = dice.lossRolls ?? [];
  if (lost.length) {
    const sum = lost.reduce((a, b) => a + b, 0);
    const mod = dice.loss - sum;
    if (lost.length > 1 || mod !== 0) {
      const additive = lost.length === 1 || sum + mod === dice.loss;
      parts.push(
        additive && Number.isInteger(mod) ? `이성 ${lost.join(" + ")}${mod ? mod > 0 ? ` + ${mod}` : ` − ${-mod}` : ""} = ${dice.loss}` : `이성 ${lost.join(", ")} → ${dice.loss}`
      );
    }
  }
  return parts.length ? parts.join(" · ") : null;
}
function CheckExtras({ dice }) {
  const luck = !dice.push && dice.level === "fail" && dice.roll > dice.target ? dice.roll - dice.target : 0;
  const bonus = dice.bonus ?? 0;
  const picked = bonus !== 0 && dice.rolls && dice.rolls.length > 1 ? dice.rolls : null;
  const eyes = bonus === 0 && dice.rolls && dice.rolls.length > 1 ? dice.rolls : null;
  if (!dice.push && luck <= 0 && !picked && !eyes) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dextra", children: [
    dice.push && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dpush", children: "밀어붙이기" }),
    eyes && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "deyes", children: [
      "주사위 눈 ·",
      " ",
      eyes.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: v }, i))
    ] }),
    picked && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dbonus" + (bonus > 0 ? " up" : " down"), children: [
      bonus > 0 ? `보너스 주사위 ${bonus}` : `페널티 주사위 ${-bonus}`,
      " · ",
      picked.map((v, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: v === dice.roll ? "on" : "", children: v }, i))
    ] }),
    luck > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dluck", children: [
      "운 ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
        "−",
        luck
      ] }),
      " 소비 시 성공"
    ] })
  ] });
}
function TicketCard({ dice, live }) {
  const target = dice.kind === "sum" ? dice.total : dice.roll;
  const max = dice.kind === "sum" ? Math.max(dice.total, 12) : 100;
  const shown = useTumble$1(target, max, live);
  const rs = useRulesetStore(activeRuleset);
  const eyebrow = systemEyebrow(rs);
  if (dice.kind === "sum" && dice.judge) {
    const j = dice.judge;
    const jeyebrow = j.eyebrow ?? eyebrow;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dcard dcard-tkt" + (live ? " live" : ""), "data-level": j.level, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-notch l" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-notch r" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-barcode" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-body", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-top", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "tkt-star", children: "✦" }),
          jeyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-eyebrow", children: jeyebrow })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-word", children: j.word ?? j.ko }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-script", children: "2d6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-meta", children: [
          dice.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "tkt-name", children: dice.name }),
            " ·",
            " "
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-roll", children: shown }),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("i", { children: [
            "/ ≥",
            j.target
          ] }),
          dice.rolls.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " · [",
            dice.rolls.join(" + "),
            "]"
          ] })
        ] })
      ] })
    ] });
  }
  if (dice.kind === "sum") {
    const label = dice.name || dice.command;
    const exprText = dice.expr && dice.expr !== label ? dice.expr : null;
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dcard dcard-tkt" + (live ? " live" : ""), "data-level": "sum", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-top", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "tkt-star", children: "✦" }),
        eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-eyebrow", children: eyebrow })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-word", children: shown }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-script", children: "roll" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-meta", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "tkt-name", children: label }),
        exprText && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tkt-expr", children: [
          " (",
          exprText,
          ")"
        ] })
      ] }),
      sumBreakdown(dice) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-eyes", children: sumBreakdown(dice) })
    ] }) });
  }
  const level = dice.level;
  const isSan = dice.kind === "san";
  const ko = dice.kind === "check" ? dice.label : void 0;
  const bakedWord = dice.kind === "check" || dice.kind === "san" ? dice.word : void 0;
  const bakedScript = dice.kind === "check" || dice.kind === "san" ? dice.script : void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dcard dcard-tkt" + (live ? " live" : ""), "data-level": level, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-notch l" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-notch r" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-barcode" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-top", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "tkt-star", children: "✦" }),
        eyebrow && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-eyebrow", children: eyebrow })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-word", children: bakedWord || levelWord(rs, level, ko) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-script", children: bakedScript || levelScript(rs, level, ko) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tkt-meta", children: [
        dice.name && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { className: "tkt-name", children: dice.name }),
          " ·",
          " "
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: isSan ? dice.success ? "성공" : "실패" : dice.label }),
        " · ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tkt-roll", children: shown }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("i", { children: [
          "/ ",
          dice.target
        ] }),
        isSan ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tkt-san", children: [
          " · 이성 −",
          dice.loss
        ] }) : null
      ] }),
      isSan && sanBreakdown(dice) && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tkt-eyes", children: sanBreakdown(dice) }),
      !isSan && /* @__PURE__ */ jsxRuntimeExports.jsx(ThresholdTrack, { target: dice.target, roll: dice.roll, levels: rs?.levels }),
      dice.kind === "check" && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckExtras, { dice })
    ] })
  ] });
}
const WINNER_LABEL = {
  a: "◀ 좌측 우세",
  b: "우측 우세 ▶",
  draw: "무승부"
};
function OpposedSideView({ side, win, live }) {
  const shown = useTumble$1(side.roll, 100, live);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dvs-side" + (win ? " win" : ""), "data-level": side.level, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dvs-num", children: shown }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "dvs-tgt", children: [
      "/ ",
      side.target
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dvs-lv", children: SUCCESS_LABEL[side.level] })
  ] });
}
function OpposedCard({ dice, live }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dcard dvs" + (live ? " live" : ""), "data-winner": dice.winner, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dvs-cmd", children: dice.command }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dvs-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OpposedSideView, { side: dice.a, win: dice.winner === "a", live }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "dvs-mid", children: "VS" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(OpposedSideView, { side: dice.b, win: dice.winner === "b", live })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dvs-result", children: WINNER_LABEL[dice.winner] })
  ] });
}
function stLevelOf(exp) {
  const x = Number(exp) || 0;
  const T = [[111, 10], [91, 9], [76, 8], [61, 7], [46, 6], [31, 5], [21, 4], [11, 3], [6, 2]];
  for (const [min, lv] of T) if (x >= min) return lv;
  return 1;
}
function stApplyRes(charId, key, delta, labelName) {
  const cs = useCharacterStore.getState();
  const ch = cs.characters[charId];
  if (!ch) return;
  const ins = ch.extra?.insane ?? {};
  const cur0 = ins[key] ?? { cur: 6, max: 6 };
  const to = Math.max(0, Math.min(cur0.max, cur0.cur + delta));
  if (to === cur0.cur) return;
  cs.upsertCharacter({ ...ch, extra: { ...ch.extra, insane: { ...ins, [key]: { ...cur0, cur: to } } } });
  const net = useNetStore.getState();
  if (useUIStore.getState().statLog && net.roomId !== null) {
    const nm = (ch.info?.name?.trim() || "이름 없음");
    const secret = useUIStore.getState().secretMode;
    net.sendStat({ channel: "main", secret: secret ? true : void 0, open: secret ? void 0 : true, charId, label: `${nm.length > 24 ? nm.slice(0, 23) + "…" : nm} · ${labelName}`, from: cur0.cur, to, max: cur0.max });
  }
}
function stCurRes(charId, key) {
  return (useCharacterStore.getState().characters[charId]?.extra?.insane?.[key] ?? { cur: 6, max: 6 }).cur;
}
function StSkillCard({ dice }) {
  const h = jsxRuntimeExports.jsx, hs = jsxRuntimeExports.jsxs;
  const c = dice.card;
  const chatRoll = useChatStore((s) => s.roll);
  const nameColor = useUIStore((s) => s.nameColor);
  const ch = useCharacterStore((s) => c.charId ? s.characters[c.charId] : void 0);
  const [done, setDone] = reactExports.useState(false);
  const top = (eb) => hs("div", { className: "tkt-top", children: [h("i", { className: "tkt-star", children: "✦" }), eb ? h("span", { className: "tkt-eyebrow", children: eb }) : null] });
  const B = !!c.burst;
  const bs = B ? { "--ink": "#fff", "--muted": "#cfcfd8", background: "linear-gradient(160deg, #050507, #17101a)", color: "#fff", border: "1px solid #e0457b", boxShadow: "0 0 14px rgba(224,69,123,.45)" } : {};
  const wordSt = B ? { color: "#fff", textShadow: "0 0 10px rgba(224,69,123,.9), 2px 2px 0 #e0457b" } : {};
  const whiteSt = B ? { color: "#fff" } : {};
  if (c.result) {
    return hs("div", { className: "dcard dcard-tkt", "data-level": "sum", style: { textAlign: "center", ...bs }, children: [
      h("span", { className: "tkt-notch l" }), h("span", { className: "tkt-notch r" }), h("div", { className: "tkt-barcode" }),
      hs("div", { className: "tkt-body", style: { alignItems: "center" }, children: [h("div", { className: "tkt-word", style: { textAlign: "center", ...wordSt }, children: dice.total }), c.note ? h("div", { style: { fontSize: 11, opacity: 0.7, ...whiteSt, textAlign: "center", marginTop: 2 }, children: c.note }) : null] })
    ] });
  }
  const j = dice.judge ?? {};
  const ok = j.level === "regular" || j.level === "critical";
  const press = async () => {
    if (done || !ch) return;
    let expr = c.dmgExpr;
    let spend = 0;
    let plusDice = c.dmgPlus;
    if (c.askCond || c.bass) {
      const v = await promptText({ title: `${c.title} 대미지 · 소비할 【컨디션】`, label: `대미지 판정에 추가로 소비할 컨디션 (판정 때 소비한 ${c.cond || 0}은 자동 포함)`, defaultValue: "0" });
      if (v == null) return;
      const c2 = Math.max(0, parseInt(String(v).trim(), 10) || 0);
      const have = stCurRes(c.charId, "life");
      if (c2 > have) {
        await alertDialog(`${c.lifeLabel || "컨디션"}이 부족합니다 (현재 ${have})`);
        return;
      }
      let gul = 0;
      if (c.askGul) {
        const g = await promptText({ title: `${c.title} · 무력화된 굴레`, label: "현재 무력화된 굴레 수 (1개당 2D6 추가)", defaultValue: "0" });
        if (g == null) return;
        gul = Math.max(0, parseInt(String(g).trim(), 10) || 0);
        plusDice = `${2 + gul * 2}d6`;
      }
      spend = c2;
      if (c.bass) {
        const n = (c.cond || 0) + c2;
        expr = n > 0 ? `${n}d6+${c.base || 0}` : String(c.base || 0);
      } else {
        const flatSum = (c.base || 0) + (c.cond || 0) + c2;
        expr = plusDice ? `${plusDice}+${flatSum}` : String(flatSum);
      }
    }
    const res = rollSum(expr, { command: c.dmgLabel });
    const note = c.bass ? [res.rolls && res.rolls.length ? `${res.rolls.length}D6 [${res.rolls.join(" + ")}]` : null, `기량 ${c.skl || 0}`, `악기 위력 ${c.pow || 0}`].filter(Boolean).join(" + ") : c.askCond ? [res.rolls && res.rolls.length ? `${res.rolls.length}D6 [${res.rolls.join(" + ")}]` : null, `기량 ${c.skl || 0}`, `악기 위력 ${c.pow || 0}`, `컨디션 ${(c.cond || 0) + spend}`].filter(Boolean).join(" + ") : "";
    chatRoll({ kind: "dice", dice: { ...res, name: c.dmgLabel, card: { result: true, label: c.dmgLabel, flat: c.dmgFlat || 0, eyebrow: j.eyebrow, note, burst: !!c.burst } } }, { name: ch.info.name, color: ch.color, nameColor: ch.nameColor || nameColor || void 0 }, { secret: !!c.secret, charId: c.charId });
    setDone(true);
    if (spend > 0) stApplyRes(c.charId, "life", -spend, c.lifeLabel || "컨디션");
    if (c.gain) stApplyRes(c.charId, "life", res.total, c.lifeLabel || "컨디션");
  };
  return hs("div", { className: "dcard dcard-tkt", "data-level": j.level, style: bs, children: [
    h("span", { className: "tkt-notch l" }), h("span", { className: "tkt-notch r" }), h("div", { className: "tkt-barcode" }),
    hs("div", { className: "tkt-body", children: [
      B ? hs("div", { className: "tkt-top", children: [h("i", { className: "tkt-star", style: { color: "#e0457b" }, children: "✦" }), j.eyebrow ? h("span", { className: "tkt-eyebrow", style: { color: "#ffd1e3" }, children: j.eyebrow }) : null] }) : top(j.eyebrow),
      h("div", { className: "tkt-word", style: { ...wordSt, ...(c.lyric || c.burst ? { textAlign: "center" } : {}) }, children: j.word ?? j.ko }),
      h("div", { className: "tkt-script", style: { ...(B ? { color: "#e0457b" } : {}), ...(c.lyric || c.burst ? { textAlign: "center" } : {}) }, children: "2d6" }),
      c.lyric ? h("div", { style: { marginTop: 6, fontWeight: 700, fontSize: 13, fontStyle: "italic", textAlign: "center" }, children: `“${c.lyric}”` }) : null,
      hs("div", { className: "tkt-meta", style: { ...whiteSt, textAlign: "left" }, children: [
        h("b", { className: "tkt-name", children: c.title }), " · ", c.skill, " · ",
        h("span", { className: "tkt-roll", children: dice.total }), " ",
        hs("i", { children: ["/ ≥", j.target] }),
        dice.rolls && dice.rolls.length ? ` · [${dice.rolls.join(" + ")}]` : "",
        c.cond > 0 ? ` +${c.cond}` : ""
      ] }),
      ok ? h("button", { type: "button", disabled: done || !ch, onClick: press, title: ch ? void 0 : "이 캐릭터의 주인만 굴릴 수 있습니다", style: { marginTop: 8, width: "100%", border: 0, borderRadius: 6, background: done || !ch ? "#9a9aa6" : "#e0457b", color: "#fff", fontWeight: 800, fontSize: 12.5, padding: "6px 10px", cursor: done || !ch ? "default" : "pointer" }, children: c.btn }) : null
    ] })
  ] });
}
function DiceCard({ dice, live }) {
  if (dice.card) return /* @__PURE__ */ jsxRuntimeExports.jsx(StSkillCard, { dice });
  if (dice.kind === "opposed") return /* @__PURE__ */ jsxRuntimeExports.jsx(OpposedCard, { dice, live });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TicketCard, { dice, live });
}
function DeckDrawCard({ deck }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-draw-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-draw-h", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "style", size: 13 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: deck.deckName }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
        "남은 ",
        deck.remaining,
        "장"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-draw-cards", children: deck.cards.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "deck-face", children: [
      c.image ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { className: "deck-face-img", src: resolveAssetUrl(c.image), alt: "", loading: "lazy" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-face-blank", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "playing_cards", size: 22 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-face-name", children: c.name }),
      c.text && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "deck-face-text", children: c.text })
    ] }, i)) })
  ] });
}
function useTumble(target, sides, live, ms = 600) {
  const [val, setVal] = reactExports.useState(target);
  reactExports.useEffect(() => {
    if (!live) {
      setVal(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      if (now - start < ms) {
        setVal(1 + Math.floor(Math.random() * Math.max(1, sides)));
        raf = requestAnimationFrame(tick);
      } else {
        setVal(target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, sides, live, ms]);
  return val;
}
function splitSymptom(s) {
  const cutAt = (i) => ({
    title: s.slice(0, i).trim(),
    desc: s.slice(i + 1).trim()
  });
  const dash = s.indexOf("—");
  if (dash >= 0) return cutAt(dash);
  const colon = s.indexOf(":");
  if (colon > 0 && colon <= 30) return cutAt(colon);
  return { title: s, desc: "" };
}
function MadnessCard({ madness, live }) {
  const sides = madness.sides ?? 10;
  const roll = useTumble(madness.roll, sides, live);
  const insanityLabel = madness.insanity === "temporary" ? " · 일시적" : madness.insanity === "indefinite" ? " · 장기적" : "";
  const modeLabel = madness.mode === "realtime" ? `실시간${insanityLabel}` : "요약";
  const { title, desc } = splitSymptom(madness.symptom);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "madcard" + (live ? " live" : ""), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-corner tl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-corner tr" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-corner bl" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mad-corner br" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "madcard-top", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "madcard-eyebrow", children: "광기의 발작 · Bout of Madness" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "madcard-mode", children: modeLabel })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "madcard-hero", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "madcard-die", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "madcard-roll", children: roll }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "madcard-d10", children: [
          "1d",
          sides
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "madcard-dur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("b", { children: [
          madness.duration,
          madness.unit
        ] }),
        "지속"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "madcard-symptom", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "madcard-sym-t", children: title }),
      desc && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "madcard-sym-d", children: desc })
    ] })
  ] });
}
const MACRO_SNAP_X = 16;
const MACRO_SNAP_Y = 32;
const MACRO_COLORS = [
  "#7c9cff",
  "#5ac8fa",
  "#4fd1a5",
  "#a3d977",
  "#ffd479",
  "#ff9f43",
  "#ff6b6b",
  "#ff7ac6",
  "#c084fc",
  "#9aa3b8"
];
let seq = 0;
const genId = () => `mac${Date.now()}_${seq++}`;
const useMacroStore = create()(
  persist(
    (set) => ({
      macros: [],
      add: (name, fmt, scriptMode, text) => set((s) => ({
        macros: [
          ...s.macros,
          { id: genId(), name: name.trim() || "매크로", fmt: { ...EMPTY_FMT, ...fmt }, scriptMode, text }
        ]
      })),
      remove: (id) => set((s) => ({ macros: s.macros.filter((m) => m.id !== id) })),
      reorder: (id, targetId) => set((s) => {
        if (id === targetId) return {};
        const arr = s.macros.filter((m) => m.id !== id);
        const moved = s.macros.find((m) => m.id === id);
        if (!moved) return {};
        const idx = arr.findIndex((m) => m.id === targetId);
        arr.splice(idx < 0 ? arr.length : idx, 0, moved);
        return { macros: arr };
      }),
      rename: (id, name) => set((s) => {
        const nm = name.trim();
        if (!nm) return {};
        return { macros: s.macros.map((m) => m.id === id ? { ...m, name: nm } : m) };
      }),
      setColor: (id, color) => set((s) => ({
        macros: s.macros.map((m) => m.id === id ? { ...m, color: color || void 0 } : m)
      })),
      setGrad: (id, grad) => set((s) => ({
        macros: s.macros.map((m) => m.id === id ? { ...m, grad: grad ?? void 0 } : m)
      })),
      setPos: (id, pos) => set((s) => ({
        macros: s.macros.map((m) => m.id === id ? { ...m, pos: pos ?? void 0 } : m)
      }))
    }),
    {
      name: "orpg-macros",
      version: 1,
      /**
       * 옛 저장분을 살릴 수 있는 만큼 살린다.
       *
       * 여기서 무조건 빈 목록을 돌려주면 안 된다 — 판이 한 번 올라가는 순간 사람들이 만들어 둔
       * 매크로가 전부 사라진다는 뜻이라, 새 칸을 더할 때마다 그 사고를 안고 가야 한다.
       * 모양이 맞는 항목만 골라 두면 칸이 늘어도 쓰던 것이 남는다.
       */
      migrate: (persisted) => {
        const raw = persisted?.macros;
        if (!Array.isArray(raw)) return { macros: [] };
        const macros = [];
        for (const item of raw) {
          const m = item;
          if (!m || typeof m.id !== "string" || typeof m.name !== "string") continue;
          macros.push({
            id: m.id,
            name: m.name,
            fmt: { ...EMPTY_FMT, ...m.fmt ?? {} },
            scriptMode: m.scriptMode === true,
            text: typeof m.text === "string" ? m.text : void 0,
            color: typeof m.color === "string" ? m.color : void 0,
            grad: m.grad,
            pos: m.pos
          });
        }
        return { macros };
      }
    }
  )
);
const SIZE_OPTS = [12, 14, 16, 20, 24, 32];
function DecorateBar({
  value,
  onChange,
  textareaRef,
  fmt,
  onFmt,
  scriptMode,
  onScriptMode,
  activeMacroId = null,
  onMacro,
  onMacroForget,
  pl = false,
  canImage = true
}) {
  const macros = useMacroStore((s) => s.macros);
  const addMacro = useMacroStore((s) => s.add);
  const removeMacro = useMacroStore((s) => s.remove);
  const [macroOpen, setMacroOpen] = reactExports.useState(false);
  const [insertOpen, setInsertOpen] = reactExports.useState(false);
  const [ruby, setRuby] = reactExports.useState(null);
  const [ask, setAsk] = reactExports.useState(null);
  const imgInputRef = reactExports.useRef(null);
  const [selColor, setSelColor] = reactExports.useState("#e7a33e");
  const [selBg, setSelBg] = reactExports.useState("#ffe14d");
  const palette = useUIStore((s) => s.chatPalette);
  const addPaletteColor = useUIStore((s) => s.addChatPaletteColor);
  const removePaletteColor = useUIStore((s) => s.removeChatPaletteColor);
  const [palTarget, setPalTarget] = reactExports.useState("color");
  const selSnap = reactExports.useRef(null);
  const set = (patch) => onFmt((prev) => ({ ...prev, ...patch }));
  const CHAT_INLINE_SAFE = 2e5;
  async function onPickImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const ref = await withBusy("이미지 준비 중…", async () => uploadAsset(await fileToChatImage(file)));
      if (ref.startsWith("data:") && ref.length > CHAT_INLINE_SAFE) {
        await alertDialog("이미지 전송에 실패했어요. 잠시 뒤 다시 시도해 주세요.");
        return;
      }
      insert(`[img=${ref}]`);
    } catch (err) {
      await alertDialog("이미지를 불러오지 못했습니다: " + err.message);
    }
  }
  async function addImageUrl() {
    const url = await promptText({
      title: "이미지 주소(URL)",
      label: "https:// 로 시작하는 이미지 링크",
      placeholder: "https://i.imgur.com/xxxx.png"
    });
    if (!url) return;
    const u = url.trim();
    if (!/^https?:\/\//i.test(u)) {
      await alertDialog("http:// 또는 https:// 로 시작해야 합니다.");
      return;
    }
    const fetchImage = externalImageFetcher();
    if (fetchImage) {
      try {
        const ref = await withBusy("이미지 가져오는 중…", async () => {
          const r = await fetchImage(u);
          if (!r.ok || !r.dataUrl) return null;
          const blob = await (await fetch(r.dataUrl)).blob();
          return uploadAsset(await fileToChatImage(new File([blob], "image", { type: blob.type })));
        });
        if (ref && ref.startsWith("asset:")) {
          insert(`[img=${ref}]`);
          return;
        }
      } catch {
      }
    }
    insert(`[img=${u}]`);
  }
  function insert(text) {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    onChange(value.slice(0, start) + text + value.slice(end));
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const pos = start + text.length;
      el.setSelectionRange(pos, pos);
    });
  }
  function wrapSelection(open, close) {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const inner = value.slice(start, end);
    onChange(value.slice(0, start) + open + inner + close + value.slice(end));
    requestAnimationFrame(() => {
      if (!el) return;
      el.focus();
      const innerStart = start + open.length;
      el.setSelectionRange(innerStart, innerStart + inner.length);
    });
  }
  function snapSelection() {
    const el = textareaRef.current;
    selSnap.current = {
      start: el?.selectionStart ?? value.length,
      end: el?.selectionEnd ?? value.length,
      src: value
    };
  }
  function wrapSnapshot(open, close) {
    const s = selSnap.current ?? { start: value.length, end: value.length, src: value };
    const inner = s.src.slice(s.start, s.end);
    onChange(s.src.slice(0, s.start) + open + inner + close + s.src.slice(s.end));
    const innerStart = s.start + open.length;
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) el.setSelectionRange(innerStart, innerStart + inner.length);
    });
  }
  async function pickSelEyedrop(kind) {
    const Eye = window.EyeDropper;
    if (!Eye) return;
    snapSelection();
    let hex;
    try {
      hex = (await new Eye().open()).sRGBHex;
    } catch {
      reviveImeFocus(textareaRef.current);
      return;
    }
    if (kind === "color") {
      setSelColor(hex);
      wrapSnapshot(`[color=${hex}]`, "[/color]");
    } else {
      setSelBg(hex);
      wrapSnapshot(`[bg=${hex}]`, "[/bg]");
    }
    requestAnimationFrame(() => reviveImeFocus(textareaRef.current));
  }
  const eyedropSupported = typeof window !== "undefined" && "EyeDropper" in window;
  function openRuby() {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setAsk(null);
    setRuby({ base: value.slice(start, end), reading: "", start, end });
  }
  function applyRuby() {
    if (!ruby) return;
    const base = ruby.base.trim();
    const reading = ruby.reading.trim();
    if (!base || !reading) {
      setRuby(null);
      return;
    }
    const md = `[ruby=${reading}]${base}[/ruby]`;
    onChange(value.slice(0, ruby.start) + md + value.slice(ruby.end));
    const pos = ruby.start + md.length;
    setRuby(null);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(pos, pos);
      }
    });
  }
  function openAsk() {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    setRuby(null);
    setAsk({ label: "", def: "", start, end });
  }
  const askBadChar = !!ask && /[|}]/.test(ask.label + ask.def);
  function applyAsk() {
    if (!ask) return;
    const label = ask.label.trim();
    const def = ask.def.trim();
    if (!label || askBadChar) return;
    const md = def ? `?{${label}|${def}}` : `?{${label}}`;
    onChange(value.slice(0, ask.start) + md + value.slice(ask.end));
    const pos = ask.start + md.length;
    setAsk(null);
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(pos, pos);
      }
    });
  }
  async function saveCurrent() {
    if (!fmtActive(fmt) && !scriptMode && !value.trim()) return;
    const name = await promptText({
      title: "매크로 저장",
      label: "지금 적용한 꾸미기를 이름 붙여 저장합니다\n본문의 ?{라벨|기본값} 은 적용할 때 값을 물어봅니다(반각 ? 만 동작)",
      defaultValue: "내 매크로"
    });
    if (name == null) return;
    addMacro(name, fmt, scriptMode, value.trim() || void 0);
    setMacroOpen(false);
  }
  function pickMacro(m) {
    if (onMacro) {
      onMacro(m);
      return;
    }
    onFmt(m.fmt);
    onScriptMode(m.scriptMode);
    if (m.text) onChange(m.text);
    setMacroOpen(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-bar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mk-tools",
        onMouseDown: (e) => {
          if (e.target.closest("button")) e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-row-lbl", title: "보낼 메시지 전체에 적용됩니다", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "subject", size: 13 }),
            " 메시지 전체"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t" + (fmt.b ? " on" : ""),
                title: "굵게",
                onClick: () => set({ b: !fmt.b }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "B" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t" + (fmt.i ? " on" : ""),
                title: "기울임",
                onClick: () => set({ i: !fmt.i }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "I" })
              }
            ),
            !pl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t" + (fmt.u ? " on" : ""),
                title: "밑줄",
                onClick: () => set({ u: !fmt.u }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: "U" })
              }
            ),
            !pl && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t" + (fmt.s ? " on" : ""),
                title: "취소선",
                onClick: () => set({ s: !fmt.s }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("s", { children: "S" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-color", title: "글자색", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_text", size: 15 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ColorField,
                {
                  value: fmt.color,
                  def: "#e7a33e",
                  onChange: (hex) => set({ color: hex }),
                  title: "글자색",
                  eyedrop: true
                }
              ),
              fmt.color && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "mk-x", title: "글자색 끄기", onClick: () => set({ color: "" }), children: "×" })
            ] }),
            !pl && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-color", title: "배경(스크립트=칸 전체)", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_fill", size: 15 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ColorField,
                {
                  value: fmt.bg,
                  def: "#333333",
                  onChange: (hex) => set({ bg: hex }),
                  title: "배경",
                  eyedrop: true
                }
              ),
              fmt.bg && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "mk-x", title: "배경 끄기", onClick: () => set({ bg: "" }), children: "×" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "mk-t mk-size",
                title: "글자 크기",
                value: fmt.size || "",
                onChange: (e) => set({ size: Number(e.target.value) || 0 }),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "크기" }),
                  SIZE_OPTS.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: n, children: [
                    n,
                    "px"
                  ] }, n))
                ]
              }
            )
          ] }),
          !pl && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t" + (fmt.align === "left" ? " on" : ""),
                title: "왼쪽 정렬",
                onClick: () => set({ align: fmt.align === "left" ? "" : "left" }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_align_left", size: 15 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t" + (fmt.align === "center" ? " on" : ""),
                title: "가운데 정렬",
                onClick: () => set({ align: fmt.align === "center" ? "" : "center" }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_align_center", size: 15 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t" + (fmt.align === "right" ? " on" : ""),
                title: "오른쪽 정렬",
                onClick: () => set({ align: fmt.align === "right" ? "" : "right" }),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_align_right", size: 15 })
              }
            )
          ] }),
          !pl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t" + (fmt.bubble ? " on" : ""),
              title: "말풍선(둥근 박스)",
              onClick: () => set({ bubble: !fmt.bubble }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chat_bubble", size: 15 }),
                " 말풍선"
              ]
            }
          ),
          !pl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t" + (scriptMode ? " on" : ""),
              title: "스크립트(/desc). 프로필 없이 전송",
              onClick: () => onScriptMode(!scriptMode),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "theater_comedy", size: 15 }),
                " 스크립트"
              ]
            }
          ),
          !pl && scriptMode && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t" + (fmt.plain ? " on" : ""),
              title: "스크립트의 옅은 배경 없애기",
              onClick: () => set({ plain: !fmt.plain }),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_reset", size: 15 }),
                " 투명 배경"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t" + (insertOpen ? " on" : ""),
              title: pl ? canImage ? "이미지·물음표 입력칸 삽입" : "물음표 입력칸 삽입" : "이미지·루비(후리가나)·여백·물음표 입력칸 삽입",
              onClick: () => setInsertOpen((v) => !v),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 15 }),
                " 넣기 ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_drop_down", size: 14 })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-trail", children: [
            (fmtActive(fmt) || scriptMode) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "mk-t",
                title: "꾸미기·스크립트 모드 모두 끄기",
                onClick: () => {
                  onFmt(EMPTY_FMT);
                  onScriptMode(false);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "ink_eraser", size: 15 }),
                  " 지우기"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "mk-t" + (macroOpen ? " on" : ""),
                title: "저장한 꾸미기 템플릿",
                onClick: () => setMacroOpen((v) => !v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark", size: 15 }),
                  " 매크로"
                ]
              }
            )
          ] })
        ]
      }
    ),
    !pl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mk-tools mk-sel",
        onMouseDown: (e) => {
          if (e.target.closest("button")) e.preventDefault();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "mk-row-lbl",
              title: "입력칸에서 글자를 드래그해 선택한 뒤 누르면 그 부분에만 적용됩니다",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "text_fields", size: 13 }),
                " 선택 글자"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t",
                title: "선택한 글자만 굵게 [b]",
                onClick: () => wrapSelection("[b]", "[/b]"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "B" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t",
                title: "선택한 글자만 기울임 [i]",
                onClick: () => wrapSelection("[i]", "[/i]"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("i", { children: "I" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t",
                title: "선택한 글자만 밑줄 [u]",
                onClick: () => wrapSelection("[u]", "[/u]"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("u", { children: "U" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t",
                title: "선택한 글자만 취소선 [s]",
                onClick: () => wrapSelection("[s]", "[/s]"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("s", { children: "S" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mk-t", title: "선택한 글자만 글자색", onMouseDown: snapSelection, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_text", size: 15 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  value: selColor,
                  onChange: (e) => {
                    setSelColor(e.target.value);
                    wrapSnapshot(`[color=${e.target.value}]`, "[/color]");
                  }
                }
              )
            ] }),
            eyedropSupported && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t",
                title: "스포이드로 찍은 색을 선택 글자에 적용",
                onClick: () => void pickSelEyedrop("color"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "colorize", size: 15 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mk-t", title: "선택한 글자만 배경(형광펜)", onMouseDown: snapSelection, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_fill", size: 15 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  value: selBg,
                  onChange: (e) => {
                    setSelBg(e.target.value);
                    wrapSnapshot(`[bg=${e.target.value}]`, "[/bg]");
                  }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-savedpal", onMouseDown: snapSelection, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "mk-savedpal-target",
                  value: palTarget,
                  title: "담아 둔 색을 어디에 넣을지",
                  onChange: (e) => setPalTarget(e.target.value),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "color", children: "글자" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "bg", children: "배경" })
                  ]
                }
              ),
              palette.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "mk-savedpal-dot",
                  style: { background: c },
                  title: `${c} · 누르면 적용 · 오른쪽 클릭하면 뺍니다`,
                  onClick: () => {
                    if (palTarget === "bg") {
                      setSelBg(c);
                      wrapSnapshot(`[bg=${c}]`, "[/bg]");
                    } else {
                      setSelColor(c);
                      wrapSnapshot(`[color=${c}]`, "[/color]");
                    }
                  },
                  onContextMenu: (e) => {
                    e.preventDefault();
                    removePaletteColor(c);
                  }
                },
                c
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: "mk-savedpal-add",
                  title: `지금 고른 ${palTarget === "bg" ? "배경" : "글자"}색을 담아 둡니다`,
                  onClick: () => addPaletteColor(palTarget === "bg" ? selBg : selColor),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "add", size: 13 })
                }
              )
            ] }),
            eyedropSupported && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "mk-t",
                title: "스포이드로 찍은 색을 선택 글자 배경에 적용",
                onClick: () => void pickSelEyedrop("bg"),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "colorize", size: 15 })
              }
            )
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: imgInputRef, type: "file", accept: "image/*", hidden: true, onChange: (e) => void onPickImage(e) }),
    insertOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mk-insert",
        onMouseDown: (e) => {
          if (e.target.closest("button")) e.preventDefault();
        },
        children: [
          canImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t",
              title: "파일에서 이미지 삽입",
              onClick: () => {
                imgInputRef.current?.click();
                setInsertOpen(false);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 15 }),
                " 이미지(파일)"
              ]
            }
          ),
          canImage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t",
              title: "https 이미지 주소(URL)로 삽입",
              onClick: () => {
                void addImageUrl();
                setInsertOpen(false);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "link", size: 15 }),
                " 이미지 주소"
              ]
            }
          ),
          !pl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "mk-t",
              title: "루비(후리가나) 삽입",
              onClick: () => {
                openRuby();
                setInsertOpen(false);
              },
              children: "루비"
            }
          ),
          !pl && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", className: "mk-t", title: "전각 공백 한 칸 삽입", onClick: () => insert("　"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "space_bar", size: 15 }),
            " 여백"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t",
              title: "보낼 때나 매크로를 적용할 때 값을 물어보는 자리 삽입",
              onClick: () => {
                openAsk();
                setInsertOpen(false);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "help", size: 15 }),
                " 물음표 입력칸"
              ]
            }
          ),
          !pl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "mk-t",
              title: "선택한 글자에 CSS 를 직접 적용",
              onClick: () => {
                setInsertOpen(false);
                void (async () => {
                  const decl = await promptText({
                    title: "CSS 로 꾸미기",
                    label: "속성:값 을 세미콜론(;)으로 잇습니다. 글자·배경·테두리·그림자·글꼴 등이 됩니다.",
                    placeholder: "text-shadow: 0 0 6px #ff9; letter-spacing: 2px"
                  });
                  if (decl?.trim()) wrapSelection(`[css=${decl.trim()}]`, "[/css]");
                })();
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "code", size: 15 }),
                " CSS"
              ]
            }
          )
        ]
      }
    ),
    value.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-preview", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mk-preview-label", children: "미리보기" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: scriptMode ? "msg-script" : "txt", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkupText, { src: applyFormatting(value, fmt, scriptMode), script: scriptMode }) })
    ] }),
    macroOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-macros", children: [
      macros.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "저장된 매크로가 없습니다. ‘현재 꾸미기 저장’을 누르세요." }),
      macros.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-macro", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "mk-macro-name" + (activeMacroId === m.id ? " on" : ""),
            title: onMacro ? "누르면 적용 · 한 번 더 누르면 해제" : "누르면 적용",
            onClick: () => pickMacro(m),
            children: m.name
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "iconbtn",
            style: { width: 24, height: 24 },
            title: "삭제",
            onClick: () => {
              removeMacro(m.id);
              onMacroForget?.(m.id);
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 })
          }
        )
      ] }, m.id)),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          className: "btn sm",
          onClick: () => void saveCurrent(),
          style: { marginTop: 4 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark_add", size: 14 }),
            " 현재 꾸미기 저장"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        HintTip,
        {
          text: "본문에 ?{라벨|기본값} 을 넣으면 보낼 때나 매크로를 적용할 때 값을 물어봅니다. 물음표는 반각(?)만 동작합니다. '넣기'의 '물음표 입력칸'으로도 넣을 수 있습니다.",
          label: "물음표 입력칸 설명"
        }
      )
    ] }),
    ruby && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-fill", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mk-fill-h", children: "루비(후리가나)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mk-fill-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "본문" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            value: ruby.base,
            placeholder: "아래 큰 글자",
            onChange: (e) => setRuby((r) => r ? { ...r, base: e.target.value } : r)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mk-fill-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "루비" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            value: ruby.reading,
            placeholder: "위에 붙는 작은 글자",
            onChange: (e) => setRuby((r) => r ? { ...r, reading: e.target.value } : r)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-fill-act", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", onClick: () => setRuby(null), children: "취소" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm pri", onClick: applyRuby, children: "삽입" })
      ] })
    ] }),
    ask && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-fill", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mk-fill-h", children: "물음표 입력칸" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "매크로로 저장하지 않아도, 보낼 때나 매크로를 적용할 때 이 자리의 값을 물어봅니다." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mk-fill-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "라벨" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            value: ask.label,
            placeholder: "무엇을 물어볼지(예: 상대 이름)",
            onChange: (e) => setAsk((a) => a ? { ...a, label: e.target.value } : a)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mk-fill-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "기본값" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            value: ask.def,
            placeholder: "비워 두면 기본값 없이 묻습니다",
            onChange: (e) => setAsk((a) => a ? { ...a, def: e.target.value } : a)
          }
        )
      ] }),
      askBadChar && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "small", style: { color: "var(--danger, #e05a5a)" }, children: [
        "| 와 ",
        "}",
        " 는 라벨·기본값에 쓸 수 없습니다. 빼고 적어 주세요."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-fill-act", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", onClick: () => setAsk(null), children: "취소" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: "btn sm pri",
            onClick: applyAsk,
            disabled: !ask.label.trim() || askBadChar,
            children: "삽입"
          }
        )
      ] })
    ] })
  ] });
}
const MARGIN = 8;
function ClampedMenu({
  x,
  y,
  className = "vn-menu",
  children
}) {
  const ref = reactExports.useRef(null);
  const [pos, setPos] = reactExports.useState({ x, y });
  const [maxH, setMaxH] = reactExports.useState(void 0);
  reactExports.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const clamp = () => {
      const z = effectiveUiScale();
      const vw = window.innerWidth / z;
      const vh = window.innerHeight / z;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      let nx = x;
      let ny = y;
      if (nx + w > vw - MARGIN) nx = Math.max(MARGIN, x - w);
      nx = Math.min(nx, Math.max(MARGIN, vw - w - MARGIN));
      if (ny + h > vh - MARGIN) ny = Math.max(MARGIN, vh - h - MARGIN);
      setPos({ x: nx, y: ny });
      setMaxH(vh - MARGIN * 2);
    };
    clamp();
    const ro = new ResizeObserver(clamp);
    ro.observe(el);
    return () => ro.disconnect();
  }, [x, y]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      className,
      style: { left: pos.x, top: pos.y, maxHeight: maxH, overflowY: "auto" },
      onContextMenu: (e) => e.preventDefault(),
      children
    }
  );
}
function FlyMenu({ children, onClose }) {
  const markRef = reactExports.useRef(null);
  const [pt, setPt] = reactExports.useState(null);
  reactExports.useLayoutEffect(() => {
    const host = markRef.current?.parentElement;
    if (!host) return;
    const r = host.getBoundingClientRect();
    setPt({ x: r.left, y: r.bottom + 6 });
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { ref: markRef, style: { display: "none" } }),
    pt && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "menu-veil", style: { zIndex: 1999 }, onClick: onClose }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClampedMenu, { x: pt.x, y: pt.y, className: "tokenmenu fly", children })
      ] }),
      document.getElementById("root") ?? document.body
    )
  ] });
}
const CHANNEL_LABELS = {
  main: "메인",
  ooc: "사담",
  whisper: "귓속말",
  group: "그룹"
};
const DICE_PRESETS = ["1d100", "1d3", "1d4", "1d6", "1d8", "1d10", "1d12", "1d20", "2d6", "3d6"];
const PNG_SLICE_HEIGHT = 4e3;
function chatPngExport() {
  try {
    const w = window;
    return w.api?.exportChatPng ?? null;
  } catch {
    return null;
  }
}
const RECENT_CHAT_LIMIT = 100;
const MAX_OLDER_ROUNDS = 2e3;
const olderLoadCap = () => isMobile() ? 2e4 : 6e4;
function fmtTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function msgPropsEqual(a, b) {
  return a.m === b.m && a.avatar === b.avatar && a.live === b.live && a.toName === b.toName && a.channelLabel === b.channelLabel && a.onlooking === b.onlooking && a.luckCost === b.luckCost && a.canEdit === b.canEdit && a.canDelete === b.canDelete;
}
const MessageItem = reactExports.memo(function MessageItem2({
  m,
  avatar,
  live,
  toName,
  channelLabel,
  onlooking,
  luckCost,
  onSpendLuck,
  canEdit,
  canDelete,
  onEdit,
  onDelete
}) {
  const [editing, setEditing] = reactExports.useState(false);
  const [draft, setDraft] = reactExports.useState("");
  const choiceLock = useNetStore((s) => s.choiceLocks[m.id]);
  const selectChoice = useNetStore((s) => s.selectChoice);
  const tab = m.kind === "system" ? "system" : tabKeyOf(m.channel, m.groupId);
  if (m.deleted) return null;
  const startEdit = () => {
    setDraft(m.text ?? "");
    setEditing(true);
  };
  const saveEdit = () => {
    const t = draft.trim();
    if (t) onEdit?.(t);
    setEditing(false);
  };
  const actions = !editing && (canEdit || canDelete) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msg-actions", children: [
    canEdit && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "msg-act", title: "수정", onClick: startEdit, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 13 }) }),
    canDelete && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        className: "msg-act",
        title: "삭제 (GM)",
        onClick: async () => {
          if (await confirmDialog("이 메시지를 삭제할까요?")) onDelete?.();
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 13 })
      }
    )
  ] }) : null;
  const editor = /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msg-edit", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: "input",
        value: draft,
        autoFocus: true,
        rows: 2,
        onChange: (e) => setDraft(e.target.value),
        enterKeyHint: enterSendsMessage() ? "send" : "enter",
        onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            if (!enterSendsMessage()) return;
            if (e.nativeEvent.isComposing || e.keyCode === 229) return;
            e.preventDefault();
            saveEdit();
          } else if (e.key === "Escape") setEditing(false);
        },
        style: { resize: "vertical", fontFamily: "inherit", width: "100%", lineHeight: 1.5 }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msg-edit-act", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm", onClick: () => setEditing(false), children: "취소" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "btn sm pri", onClick: saveEdit, children: "저장" })
    ] })
  ] });
  if (m.kind === "system") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sys", "data-tab": tab, children: m.text });
  }
  if (m.kind === "choice" && m.choice) {
    const answered = !!choiceLock;
    const c = m.choice;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msg-choice", "data-tab": tab, children: [
      actions,
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "choice-card",
          style: c.bgColor ? { background: c.bgColor, borderColor: c.bgColor } : void 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "choice-prompt",
                style: c.promptColor || c.textColor ? { color: c.promptColor || c.textColor } : void 0,
                children: c.prompt
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "choice-opts", children: c.options.map((o) => {
              const mine = choiceLock === o.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "choice-opt" + (mine ? " on" : ""),
                  style: !mine && (c.btnColor || c.textColor) ? {
                    background: c.btnColor || void 0,
                    color: c.textColor || void 0,
                    borderColor: c.btnColor || void 0
                  } : void 0,
                  disabled: answered,
                  title: answered ? "이미 선택했습니다" : "선택",
                  onClick: () => selectChoice(m.id, o.id),
                  children: [
                    o.label,
                    mine ? " ✓" : ""
                  ]
                },
                o.id
              );
            }) }),
            answered && (() => {
              const picked = c.options.find((o) => o.id === choiceLock)?.label;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "choice-note", children: [
                picked ? `「${picked}」 선택함. ` : "이미 선택했습니다. ",
                "하나만 고를 수 있어요."
              ] });
            })()
          ]
        }
      )
    ] });
  }
  if (m.kind === "script") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "msg-script" + (m.secret || m.to ? " priv" : ""), "data-tab": tab, children: [
      actions,
      channelLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mk-script-lock msg-chan", children: channelLabel }),
      (m.secret || m.to) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "mk-script-lock", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: onlooking ? "visibility" : "lock", size: 11 }),
        " ",
        m.secret ? "비밀" : onlooking ? `귓속말 열람 · ${m.author ?? ""} → ${toName ?? m.to}` : "귓속말"
      ] }),
      editing ? editor : /* @__PURE__ */ jsxRuntimeExports.jsx(MarkupText, { src: m.text ?? "", script: true })
    ] });
  }
  const initial = m.author?.[0] ?? "?";
  const priv = m.secret || !!m.to;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "msg" + (m.kind === "narration" ? " act" : "") + (priv ? " priv" : ""),
      "data-tab": tab,
      style: priv ? { background: "color-mix(in srgb, var(--accent) 9%, transparent)", borderRadius: 8 } : void 0,
      children: [
        actions,
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "pic" + (m.npc ? " npc" : ""),
            style: avatar ? { backgroundImage: `url(${avatar})`, cursor: "zoom-in" } : m.npc ? void 0 : { background: m.color ?? "#7c86a6" },
            onClick: avatar ? () => useUIStore.getState().setLightbox(avatar) : void 0,
            title: avatar ? "크게 보기" : void 0,
            children: avatar || m.npc ? "" : initial
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "body", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "who", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: m.nameColor ? { color: m.nameColor } : void 0, children: m.author }),
            channelLabel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "chip msg-chan", children: channelLabel }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: priv ? { color: "var(--accent)", fontWeight: 700 } : void 0, children: m.secret ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 11 }),
              " 비밀"
            ] }) : m.to ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: onlooking ? "visibility" : "lock", size: 11 }),
              " ",
              onlooking ? "귓속말 열람 → " : "귓속말 → ",
              toName ?? m.to
            ] }) : fmtTime(m.time) })
          ] }),
          editing ? editor : m.kind === "dice" && m.dice ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DiceCard, { dice: m.dice, live }),
            luckCost ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "luck-card",
                onClick: onSpendLuck,
                title: "실패한 판정을 성공으로 바꿉니다 (CoC7 운 소비)",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "luck-clover", "aria-hidden": true, children: "🍀" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "luck-card-body", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "luck-card-t", children: "행운으로 성공 전환" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "luck-card-sub", children: [
                      "행운 ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: luckCost }),
                      " 소비 → 판정 성공"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "luck-card-go", children: [
                    "전환 ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "arrow_forward", size: 13 })
                  ] })
                ]
              }
            ) : null
          ] }) : m.kind === "madness" && m.madness ? /* @__PURE__ */ jsxRuntimeExports.jsx(MadnessCard, { madness: m.madness, live }) : m.kind === "luck" && m.luck ? (
            // 행운 성공 전환 결과 카드 — 일반 메시지 행(두상 거터) 안에 렌더해 주사위 카드와 좌측 열 정렬.
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "luck-result", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "luck-clover", "aria-hidden": true, children: "🍀" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "luck-result-body", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "luck-result-t", children: "행운으로 성공 전환!" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "luck-result-sub", children: [
                  "「",
                  m.luck.command,
                  "」 판정 성공 · 행운 ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: m.luck.cost }),
                  " 소비 (남은 ",
                  m.luck.remaining,
                  ")"
                ] })
              ] })
            ] })
          ) : m.kind === "stat" && m.stat ? (
            // 상태 수치 변화 — 한 줄로 간결하게. 줄어들면 붉게, 늘면 푸르게.
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "stat-log" + (m.stat.to < m.stat.from ? " down" : " up"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-log-lbl", children: m.stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-log-v", children: [
                m.stat.from,
                " → ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: m.stat.to }),
                m.stat.max ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-log-max", children: [
                  " / ",
                  m.stat.max
                ] }) : null
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "stat-log-d", children: [
                "(",
                m.stat.to > m.stat.from ? "+" : "−",
                Math.abs(m.stat.to - m.stat.from),
                ")"
              ] })
            ] })
          ) : m.kind === "deck" && m.deck ? /* @__PURE__ */ jsxRuntimeExports.jsx(DeckDrawCard, { deck: m.deck }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "txt", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MarkupText, { src: m.text ?? "" }) })
        ] })
      ]
    }
  );
}, msgPropsEqual);
function Chat({
  detachedChannel,
  detachedGroupId
} = {}) {
  const detached = !!detachedChannel;
  const liveMessages = useChatStore((s) => s.messages);
  const olderMessages = useChatStore((s) => s.older);
  const messages = reactExports.useMemo(
    () => olderMessages.length ? [...olderMessages, ...liveMessages] : liveMessages,
    [olderMessages, liveMessages]
  );
  const hasArchive = useChatStore((s) => s.hasArchive);
  const serverArchive = useChatStore((s) => s.serverArchive);
  const olderDone = useChatStore((s) => s.olderDone);
  const historyEpoch = useChatStore((s) => s.historyEpoch);
  const transport = useChatStore((s) => s.transport);
  const storeChannel = useChatStore((s) => s.activeChannel);
  const activeChannel = detachedChannel ?? storeChannel;
  const setChannel = useChatStore((s) => s.setChannel);
  const unread = useChatStore((s) => s.unread);
  const send = useChatStore((s) => s.send);
  const roll = useChatStore((s) => s.roll);
  const channels = useChatStore((s) => s.channels);
  const channelOrder = useChatStore((s) => s.channelOrder);
  const setChannelOrder = useChatStore((s) => s.setChannelOrder);
  const storeGroupId = useChatStore((s) => s.activeGroupId);
  const activeGroupId = detached ? detachedGroupId ?? null : storeGroupId;
  const sendGroupId = activeChannel === "group" ? activeGroupId ?? void 0 : void 0;
  const detachedTabs = useChatStore((s) => s.detached);
  const setGroup = useChatStore((s) => s.setGroup);
  const createGroup = useChatStore((s) => s.createGroup);
  const removeGroup = useChatStore((s) => s.removeGroup);
  const [dragTab, setDragTab] = reactExports.useState(null);
  const tabsRef = reactExports.useRef(null);
  const tabsRowRef = reactExports.useRef(null);
  const orderableTabs = ["ooc", "whisper", ...channels.map((c) => c.id)].sort((a, b) => {
    const ia = channelOrder.indexOf(a);
    const ib = channelOrder.indexOf(b);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
  const detachTab = (key, isGroup, label, at) => {
    if (isMobile() && !detachedTabs[key]) return;
    void __vitePreload(() => import("./popout-y3WmKa7H-s2.js"), true ? __vite__mapDeps([0,1,2,3,4,5,6,7,8,9]) : void 0, import.meta.url).then(
      (m) => m.openPanelPopout(isGroup ? "chat:group:" + key : "chat:" + key, label, 420, 640, at)
    );
  };
  const moveTab = (from, targetKey) => {
    if (!from || from === targetKey) return;
    const arr = orderableTabs.filter((k) => k !== from);
    const idx = arr.indexOf(targetKey);
    arr.splice(idx < 0 ? arr.length : idx, 0, from);
    setChannelOrder(arr);
  };
  const onTabPointerDown = (e, key, isGroup, label) => {
    if (e.button !== 0) return;
    const byMouse = e.pointerType === "mouse";
    if (byMouse) e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const pid = e.pointerId;
    let moved = 0;
    let cancelled = false;
    const onKey = (ev) => {
      if (ev.key === "Escape") cancelled = true;
    };
    const onMove = (ev) => {
      if (ev.pointerId !== pid) return;
      moved = Math.max(moved, Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY));
      if (byMouse && moved >= DRAG_SLOP) setDragTab(key);
    };
    const selectTab = () => {
      if (detachedTabs[key]) detachTab(key, isGroup, label);
      else if (isGroup) setGroup(key);
      else setChannel(key);
    };
    const finish = (ev) => {
      if (ev.pointerId !== pid) return;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", abort);
      window.removeEventListener("keydown", onKey);
      setDragTab(null);
      const outcome = tabPressOutcome({ pointerType: e.pointerType, moved, cancelled });
      if (outcome.kind === "ignore") return;
      if (outcome.kind === "select") {
        selectTab();
        return;
      }
      const strip = (tabsRowRef.current ?? tabsRef.current)?.getBoundingClientRect() ?? null;
      const el = tabsRef.current?.ownerDocument.elementFromPoint(ev.clientX, ev.clientY);
      const overKey = el?.closest("[data-tab-key]")?.dataset.tabKey;
      const act = tabDropAction(ev, strip, overKey ?? null, key);
      if (act.kind === "reorder") moveTab(key, act.to);
      else if (act.kind === "detach")
        detachTab(key, isGroup, label, { screenX: ev.screenX, screenY: ev.screenY });
    };
    const abort = (ev) => {
      if (ev.pointerId !== pid) return;
      cancelled = true;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", abort);
      window.removeEventListener("keydown", onKey);
      setDragTab(null);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", abort);
    window.addEventListener("keydown", onKey);
  };
  const editMessage = useChatStore((s) => s.editMessage);
  const deleteMessage = useChatStore((s) => s.deleteMessage);
  const characters = useCharacterStore((s) => s.characters);
  const speakingAs = useCharacterStore((s) => s.speakingAs);
  const setIdentity = useNetStore((s) => s.setIdentity);
  const publishPoolChar = useNetStore((s) => s.publishPoolChar);
  const switchStanding = useNetStore((s) => s.switchStanding);
  const account = useAuthStore((s) => s.account);
  const [panelSpeaker, setPanelSpeaker] = reactExports.useState(null);
  const [panelNpcName, setPanelNpcName] = reactExports.useState("");
  const panelPinned = detached && panelSpeaker !== null;
  const panelCharId = panelPinned ? panelSpeaker.kind === "char" ? panelSpeaker.id : null : speakingAs;
  const speakingChar = panelCharId ? characters[panelCharId] : void 0;
  const ownerName = account?.nickname || account?.username || "오너";
  const identityName = speakingChar ? speakingChar.info.name : ownerName;
  const identityColor = speakingChar ? speakingChar.color : "#8b93a7";
  const myNameColor = useUIStore((s) => s.nameColor);
  const identityAvatar = speakingChar ? activeHeadshot(speakingChar.portrait) : account?.avatar || void 0;
  const identityStanding = speakingChar ? activeStanding({
    standings: speakingChar.portrait.standings,
    currentExpression: speakingChar.portrait.currentExpression,
    visibility: speakingChar.visibility
  }) : void 0;
  const identity = {
    name: identityName,
    color: identityColor,
    // 두상이 없으면 빈 문자열을 각인한다 — '없음'을 확정해 두지 않으면 나중에 인장을 넣는 순간
    // 과거 메시지가 렌더 폴백을 타고 소급해 바뀐다(서버 각인과 같은 규칙).
    avatar: identityAvatar ?? "",
    // 이름색은 캐릭터별 색이 계정 단위 '내 이름색'을 이긴다 — NPC 여럿을 색으로 구분하는 길.
    nameColor: speakingChar?.nameColor || myNameColor || void 0,
    standing: identityStanding,
    standingHeight: speakingChar?.portrait.standingHeight
  };
  const myChar = useCharacterStore(activeCharacter);
  const spendLuck = useCharacterStore((s) => s.spendLuck);
  const luckResolved = useDiceStore((s) => s.luckResolved);
  const resolveLuck = useDiceStore((s) => s.resolveLuck);
  const roster = useNetStore((s) => s.roster);
  const participants = useNetStore((s) => s.participants);
  const self = useNetStore((s) => s.self);
  const isGM = self?.role === "GM";
  const roomGmSeeWhispers = useNetStore((s) => s.roomGmSeeWhispers);
  const canChatImage = isGM || account?.role === "member" || account?.role === "admin";
  const roomCharIds = useNetStore((s) => s.roomCharIds);
  const inRoom = !!self;
  const speakableChars = inRoom ? Object.values(characters).filter((c) => roomCharIds.includes(c.id)) : Object.values(characters);
  reactExports.useEffect(() => {
    if (!panelSpeaker || panelSpeaker.kind !== "char") return;
    const id = panelSpeaker.id;
    if (!characters[id] || inRoom && !roomCharIds.includes(id)) setPanelSpeaker(null);
  }, [panelSpeaker, characters, inRoom, roomCharIds]);
  reactExports.useEffect(() => {
    if (!panelPinned || panelSpeaker.kind !== "char" || !speakingChar) return;
    const id = panelSpeaker.id;
    const t = setTimeout(() => publishPoolChar(id), 400);
    return () => clearTimeout(t);
  }, [panelPinned, panelSpeaker, speakingChar, publishPoolChar]);
  const roomLuckEnabled = useNetStore((s) => s.roomLuckEnabled);
  const sendLuck = useNetStore((s) => s.sendLuck);
  const offlineSolo = !self;
  const archivedIds = reactExports.useMemo(
    () => transport && olderMessages.length ? new Set(olderMessages.map((m) => m.id)) : null,
    [transport, olderMessages]
  );
  const canEditMsg = (msg) => !archivedIds?.has(msg.id) && !msg.deleted && (msg.kind === "speech" || msg.kind === "narration" || msg.kind === "script") && (offlineSolo || isGM || !!msg.playerId && msg.playerId === self?.playerId);
  const canDeleteMsg = (msg) => !archivedIds?.has(msg.id) && !detached && !msg.deleted && msg.kind !== "system" && (isGM || offlineSolo);
  const typingList = useNetStore((s) => s.typing);
  const sendTyping = useNetStore((s) => s.sendTyping);
  const setChatWidth = useUIStore((s) => s.setChatWidth);
  const chatFontScale = useUIStore((s) => s.chatFontScale);
  const setChatFontScale = useUIStore((s) => s.setChatFontScale);
  const secret = useUIStore((s) => s.secretMode);
  const setSecretMode = useUIStore((s) => s.setSecretMode);
  const checkBonus = useUIStore((s) => s.checkBonus);
  const setCheckBonus = useUIStore((s) => s.setCheckBonus);
  const bumpCheckBonus = useUIStore((s) => s.bumpCheckBonus);
  const closeWindow = useUIStore((s) => s.closeWindow);
  const macros = useMacroStore((s) => s.macros);
  const addMacro = useMacroStore((s) => s.add);
  const removeMacro = useMacroStore((s) => s.remove);
  const reorderMacro = useMacroStore((s) => s.reorder);
  const renameMacro = useMacroStore((s) => s.rename);
  const setMacroColor = useMacroStore((s) => s.setColor);
  const setMacroGrad = useMacroStore((s) => s.setGrad);
  const setMacroPos = useMacroStore((s) => s.setPos);
  const dragMacroRef = reactExports.useRef(null);
  const macroDragRef = reactExports.useRef(null);
  const [macroDrag, setMacroDrag] = reactExports.useState(null);
  const barRef = reactExports.useRef(null);
  const barMacros = macros.filter((m) => !m.pos);
  const floatMacros = macros.filter((m) => m.pos);
  const draggingFromBar = macroDrag ? barMacros.find((m) => m.id === macroDrag.id) : void 0;
  const floatShown = draggingFromBar ? [...floatMacros, draggingFromBar] : floatMacros;
  const macroBarOn = useUIStore((s) => s.macroBarOn);
  const toggleMacroBar = useUIStore((s) => s.toggleMacroBar);
  const composeH = useUIStore((s) => s.composeH);
  const setComposeH = useUIStore((s) => s.setComposeH);
  const composeResizeRef = reactExports.useRef(null);
  const [input, setInputRaw] = reactExports.useState("");
  const scriptMode = useChatStore((s) => s.scriptMode);
  const setScriptMode = useChatStore((s) => s.setScriptMode);
  const [paletteOff, setPaletteOff] = reactExports.useState(false);
  const storeNpcMode = useChatStore((s) => s.npcMode);
  const storeNpcName = useChatStore((s) => s.npcName);
  const setNpcMode = useChatStore((s) => s.setNpcMode);
  const setNpcName = useChatStore((s) => s.setNpcName);
  const npcMode = panelPinned ? panelSpeaker.kind === "npc" : storeNpcMode;
  const npcName = panelPinned ? panelNpcName : storeNpcName;
  const paletteRuleset = useRulesetStore(
    (s) => speakingChar ? resolveRuleset(s, speakingChar.rulesetId ?? "coc7e") : void 0
  );
  const paletteKind = useRulesetStore(
    (s) => speakingChar ? characterSheetKind({ imported: s.imported }, speakingChar) : void 0
  );
  const paletteEntries = reactExports.useMemo(
    () => speakingChar && !npcMode ? buildPalette(speakingChar, paletteRuleset, paletteKind) : [],
    [speakingChar, paletteRuleset, paletteKind, npcMode]
  );
  const paletteHits = reactExports.useMemo(
    () => paletteOff || !paletteEntries.length ? [] : matchPalette(paletteEntries, input),
    [paletteEntries, input, paletteOff]
  );
  function rollPalette(p) {
    if (noWhisperTarget()) return;
    const { who, charId } = speakAs();
    const to = activeChannel === "whisper" ? targetId : void 0;
    const isSecret = activeChannel === "main" || activeChannel === "ooc" ? secret : false;
    playSfx("send");
    if (p.strato != null) {
      const tgt = p.strato;
      const res = rollSum("2d6", { command: `${p.label} (2d6≥${tgt})` });
      const raw = res.rolls.reduce((a, b) => a + b, 0);
      const id = raw === 12 ? "special" : raw === 2 ? "fumble" : res.total >= tgt ? "success" : "fail";
      const ko = paletteRuleset?.levels?.find((l) => l.id === id)?.ko ?? KO_FALLBACK[id];
      roll({ kind: "dice", dice: { ...res, name: p.label, judge: { level: CSS_LEVEL[id], ko: ST_CARD_KEY[id], word: ko, target: tgt, eyebrow: paletteRuleset?.systemLabel ?? "" } } }, who, {
        channel: activeChannel,
        groupId: sendGroupId,
        to,
        secret: isSecret,
        charId
      });
    } else if (p.target != null) {
      const dice = rollCheck(p.target, {
        command: ccCommand(p.target, p.label, checkBonus),
        bonus: checkBonus,
        ...customRollOpts(speakingChar?.rulesetId)
      });
      setCheckBonus(0);
      roll({ kind: "dice", dice: { ...dice, name: p.label } }, who, {
        channel: activeChannel,
        groupId: sendGroupId,
        to,
        secret: isSecret,
        charId
      });
    } else {
      send(p.command, who, {
        channel: activeChannel,
        groupId: sendGroupId,
        to,
        secret: isSecret,
        charId,
        rulesetId: speakingChar?.rulesetId
      });
    }
    clearInput();
  }
  const fmt = useChatStore((s) => s.fmt);
  const setFmt = useChatStore((s) => s.setFmt);
  const activeMacroId = useChatStore((s) => s.activeMacroId);
  const applyMacroFmt = useChatStore((s) => s.applyMacroFmt);
  const noteMacroText = useChatStore((s) => s.noteMacroText);
  const noteInputText = useChatStore((s) => s.noteInputText);
  const forgetMacro = useChatStore((s) => s.forgetMacro);
  const [dicePanel, setDicePanel] = reactExports.useState(false);
  const [diceExpr, setDiceExpr] = reactExports.useState("");
  const [whisperTarget, setWhisperTarget] = reactExports.useState("");
  const [groupForm, setGroupForm] = reactExports.useState(false);
  const [groupName, setGroupName] = reactExports.useState("");
  const [groupMembers, setGroupMembers] = reactExports.useState([]);
  const [searching, setSearching] = reactExports.useState(false);
  const [pdfMenu, setPdfMenu] = reactExports.useState(false);
  const [fontMenu, setFontMenu] = reactExports.useState(false);
  const [colorPick, setColorPick] = reactExports.useState(null);
  const [exportTabs, setExportTabs] = reactExports.useState(() => /* @__PURE__ */ new Set(["main", "ooc"]));
  const [pngBusy, setPngBusy] = reactExports.useState(false);
  const [htmlBusy, setHtmlBusy] = reactExports.useState(false);
  const [backupBusy, setBackupBusy] = reactExports.useState(false);
  const [embedOpen, setEmbedOpen] = reactExports.useState(false);
  const [embedBusy, setEmbedBusy] = reactExports.useState(false);
  const [embedInline, setEmbedInline] = reactExports.useState(true);
  const embedStats = reactExports.useRef({ total: 0, failed: 0 });
  const [q, setQ] = reactExports.useState("");
  const [authorF, setAuthorF] = reactExports.useState("");
  const [channelF, setChannelF] = reactExports.useState(detachedChannel ?? "");
  const [dateF, setDateF] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const logRef = reactExports.useRef(null);
  const resizeRef = reactExports.useRef(null);
  const typingState = reactExports.useRef({ active: false, timer: null, channel: null, groupId: void 0 });
  function onTyping() {
    const t = typingState.current;
    const gid = sendGroupId;
    if (!t.active || t.channel !== activeChannel || t.groupId !== gid) {
      t.active = true;
      t.channel = activeChannel;
      t.groupId = gid;
      sendTyping(true, activeChannel, gid);
    }
    if (t.timer) clearTimeout(t.timer);
    t.timer = setTimeout(() => {
      t.active = false;
      t.timer = null;
      sendTyping(false, t.channel ?? activeChannel, t.groupId);
    }, 2500);
  }
  function stopTyping() {
    const t = typingState.current;
    if (t.timer) {
      clearTimeout(t.timer);
      t.timer = null;
    }
    if (t.active) {
      t.active = false;
      sendTyping(false, t.channel ?? activeChannel, t.groupId);
    }
  }
  reactExports.useEffect(() => () => stopTyping(), []);
  reactExports.useEffect(() => {
    if (!detached) noteInputText("");
  }, [detached, noteInputText]);
  const historyRef = reactExports.useRef({
    snaps: [{ v: "", s: 0, e: 0 }],
    idx: 0,
    at: 0
  });
  function resetHistory(v = "") {
    historyRef.current = { snaps: [{ v, s: v.length, e: v.length }], idx: 0, at: 0 };
  }
  function recordHistory(v, s, e) {
    const h = historyRef.current;
    const now = Date.now();
    if (h.idx < h.snaps.length - 1) h.snaps = h.snaps.slice(0, h.idx + 1);
    const top = h.snaps[h.idx];
    if (top && top.v === v) {
      top.s = s;
      top.e = e;
      h.at = now;
      return;
    }
    const coalesce = !!top && now - h.at < 400 && Math.abs(v.length - top.v.length) <= 1;
    if (coalesce) h.snaps[h.idx] = { v, s, e };
    else {
      h.snaps.push({ v, s, e });
      if (h.snaps.length > 300) h.snaps.shift();
      h.idx = h.snaps.length - 1;
    }
    h.at = now;
  }
  function setInput(v) {
    setInputRaw(v);
    if (!detached) noteInputText(v);
  }
  function clearInput() {
    setInput("");
    resetHistory();
    stopTyping();
  }
  function applyHistory(dir) {
    const h = historyRef.current;
    const next = h.idx + dir;
    if (next < 0 || next >= h.snaps.length) return;
    h.idx = next;
    h.at = 0;
    const snap = h.snaps[next];
    setInput(snap.v);
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (el) {
        el.focus();
        el.setSelectionRange(snap.s, snap.e);
      }
    });
  }
  const tabSwitchRef = reactExports.useRef(() => {
  });
  tabSwitchRef.current = (n) => {
    if (n === 1) {
      setChannel("main");
      return;
    }
    const key = orderableTabs[n - 2];
    if (!key) return;
    if (channels.some((c) => c.id === key)) setGroup(key);
    else setChannel(key);
  };
  reactExports.useEffect(() => {
    if (detached) return;
    function onKey(e) {
      const m = /^F([1-9]|10)$/.exec(e.key);
      if (!m) return;
      e.preventDefault();
      tabSwitchRef.current(Number(m[1]));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detached]);
  function luckCostFor(m) {
    if (!roomLuckEnabled) return 0;
    const d = m.dice;
    if (!d || d.kind !== "check" || d.level !== "fail" || d.push) return 0;
    if (m.secret || m.to || m.groupId) return 0;
    if (self && m.playerId !== self.playerId) return 0;
    if (m.charId && m.charId !== myChar?.id) return 0;
    if (luckResolved[m.id]) return 0;
    const cost = d.roll - d.target;
    return cost > 0 && cost <= (myChar?.status.luck ?? 0) ? cost : 0;
  }
  function spendLuckFor(m) {
    const d = m.dice;
    if (!d || d.kind !== "check") return;
    const cost = luckCostFor(m);
    if (cost <= 0) return;
    const luck = activeCharacter(useCharacterStore.getState())?.status.luck ?? 0;
    if (cost > luck) return;
    spendLuck(cost);
    resolveLuck(m.id);
    const remaining = luck - cost;
    if (self) {
      sendLuck({ channel: m.channel, groupId: m.groupId, cost, remaining, command: d.command });
    } else {
      useChatStore.getState().add({
        channel: m.channel,
        kind: "luck",
        author: identity.name,
        color: identity.color,
        avatar: identity.avatar,
        nameColor: identity.nameColor,
        luck: { cost, remaining, command: d.command }
      });
    }
  }
  const [exportAllChannels, setExportAllChannels] = reactExports.useState(false);
  const visible = reactExports.useMemo(
    () => messages.filter(
      (m) => inChatExportScope(m, {
        allChannels: exportAllChannels,
        channel: activeChannel,
        groupId: activeGroupId
      })
    ),
    [messages, activeChannel, activeGroupId, exportAllChannels]
  );
  const shown = reactExports.useMemo(() => {
    if (!searching) return visible;
    const found = searchMessages(messages, { query: q, author: authorF, channel: channelF, date: dateF });
    return detached ? found.filter(
      (m) => m.channel === activeChannel && (activeChannel !== "group" || m.groupId === activeGroupId)
    ) : found;
  }, [searching, messages, q, authorF, channelF, dateF, visible, detached, activeChannel, activeGroupId]);
  const [showAll, setShowAll] = reactExports.useState(false);
  const truncated = !searching && !showAll && shown.length > RECENT_CHAT_LIMIT;
  const rendered = truncated ? shown.slice(-RECENT_CHAT_LIMIT) : shown;
  const exportTabList = reactExports.useMemo(() => {
    if (detached)
      return [
        {
          key: tabKeyOf(activeChannel, activeGroupId ?? void 0),
          label: activeChannel === "group" ? channels.find((c) => c.id === activeGroupId)?.name ?? CHANNEL_LABELS.group : CHANNEL_LABELS[activeChannel]
        }
      ];
    return [
      { key: "main", label: CHANNEL_LABELS.main },
      ...orderableTabs.map((k) => {
        const g = channels.find((c) => c.id === k);
        return { key: k, label: g ? g.name : CHANNEL_LABELS[k] };
      })
    ];
  }, [detached, activeChannel, activeGroupId, channels, orderableTabs]);
  const chosenTabs = reactExports.useMemo(
    () => exportTabList.filter((t) => exportTabs.has(t.key)),
    [exportTabList, exportTabs]
  );
  const pdfPrivate = exportTabs.has("whisper");
  const privateTabsChosen = chosenTabs.filter(
    (t) => t.key === "whisper" || channels.some((c) => c.id === t.key)
  );
  const exportCount = reactExports.useMemo(() => {
    if (searching) return filterForPdf(shown, pdfPrivate).length;
    const keys = new Set(chosenTabs.map((t) => t.key));
    return filterForPdf(
      messages.filter((m) => inChosenTabs(m, keys)),
      pdfPrivate
    ).length;
  }, [searching, shown, messages, pdfPrivate, chosenTabs]);
  function expandAllChat() {
    const el = logRef.current;
    const prevH = el?.scrollHeight ?? 0;
    const prevTop = el?.scrollTop ?? 0;
    reactDomExports.flushSync(() => setShowAll(true));
    const after = logRef.current;
    if (after) after.scrollTop = after.scrollHeight - prevH + prevTop;
  }
  function collapseRecentChat() {
    setShowAll(false);
    stickRef.current = true;
    requestAnimationFrame(() => scrollToBottom());
  }
  const authors = reactExports.useMemo(
    () => [...new Set(messages.map((m) => m.author).filter((a) => !!a))],
    [messages]
  );
  const others = reactExports.useMemo(() => {
    const rest = participants.filter((p) => p.playerId !== self?.playerId);
    return [...rest.filter((p) => p.connected), ...rest.filter((p) => !p.connected)];
  }, [participants, self?.playerId]);
  const targetId = whisperTarget && others.some((o) => o.playerId === whisperTarget) ? whisperTarget : others[0]?.playerId ?? "";
  const nameOf = (pid) => roster[pid]?.name || participants.find((p) => p.playerId === pid)?.nick || pid;
  const channelChip = (m) => m.channel === "group" ? channels.find((c) => c.id === m.groupId)?.name ?? CHANNEL_LABELS.group : CHANNEL_LABELS[m.channel];
  const localHeadshotFor = (author) => {
    if (!author) return void 0;
    const c = Object.values(characters).find((ch) => ch.info.name === author);
    if (c) return activeHeadshot(c.portrait);
    if (author === ownerName) return account?.avatar || void 0;
    return void 0;
  };
  const rosterHeadshotFor = (m) => {
    const ch = m.playerId ? roster[m.playerId] : void 0;
    if (!ch) return void 0;
    const nick = participants.find((p) => p.playerId === m.playerId)?.nick;
    if (m.author && (ch.name || nick || "") !== m.author) return void 0;
    return activeHeadshot(ch);
  };
  const activeGroup = activeChannel === "group" && activeGroupId ? channels.find((c) => c.id === activeGroupId) : void 0;
  const memberLabel = (pid) => roster[pid]?.name || participants.find((p) => p.playerId === pid)?.nick || "(나간 참가자)";
  const activeTabKey = tabKeyOf(activeChannel, activeGroupId ?? void 0);
  reactExports.useEffect(() => {
    if (!detached) return;
    useChatStore.setState(
      (s) => s.unread[activeTabKey] ? { unread: { ...s.unread, [activeTabKey]: false } } : s
    );
  }, [detached, activeTabKey, messages]);
  const typers = typingList.filter((t) => t.key === activeTabKey && t.playerId !== self?.playerId).map((t) => nameOf(t.playerId));
  const stickRef = reactExports.useRef(true);
  const scrollToBottom = reactExports.useCallback(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);
  function onLogScroll() {
    const el = logRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }
  reactExports.useEffect(() => {
    if (stickRef.current) scrollToBottom();
  }, [messages, scrollToBottom]);
  const olderBusy = useChatStore((s) => s.olderBusy);
  const [olderNote, setOlderNote] = reactExports.useState(null);
  const canLoadOlder = hasArchive && !olderDone;
  const [bulkLoading, setBulkLoading] = reactExports.useState(false);
  const bulkCancelRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    setOlderNote(null);
  }, [historyEpoch]);
  async function fetchOlderChat() {
    const chat = useChatStore.getState();
    if (chat.olderBusy) return;
    chat.setOlderBusy(true);
    setOlderNote(null);
    const el = logRef.current;
    const anchor = el?.querySelector(".msg, .msg-script") ?? null;
    const anchorTop = anchor?.offsetTop ?? 0;
    const prevTop = el?.scrollTop ?? 0;
    const wasStuck = stickRef.current;
    try {
      const got = chat.transport ? await loadOlderChat() : await loadOlderLocalChat();
      if (got > 0 && !wasStuck)
        requestAnimationFrame(() => {
          const after = logRef.current;
          if (after && anchor && anchor.isConnected)
            after.scrollTop = prevTop + (anchor.offsetTop - anchorTop);
        });
      else if (got === 0)
        setOlderNote(
          useChatStore.getState().olderDone ? { kind: "info", text: "더 불러올 대화가 없습니다." } : {
            kind: "info",
            text: "이 구간에는 볼 수 있는 대화가 없습니다. 한 번 더 누르면 그 앞을 불러옵니다."
          }
        );
    } catch (e) {
      setOlderNote({
        kind: "error",
        text: e instanceof Error ? e.message : "보관된 대화를 불러오지 못했습니다."
      });
    } finally {
      useChatStore.getState().setOlderBusy(false);
    }
  }
  async function fetchAllOlderChat() {
    if (useChatStore.getState().olderBusy) return;
    setOlderNote(null);
    bulkCancelRef.current = false;
    setBulkLoading(true);
    try {
      const got = await loadWholeHistory();
      if (got === "capped")
        setOlderNote({
          kind: "info",
          text: `한 번에 올릴 수 있는 만큼(보관 대화 ${olderLoadCap().toLocaleString()}건)까지 불러왔습니다.`
        });
      else if (got === "cancelled")
        setOlderNote({
          kind: "info",
          text: `중단했습니다. 지금까지 ${useChatStore.getState().older.length.toLocaleString()}건을 올렸습니다.`
        });
      else if (got === "partial")
        setOlderNote({
          kind: "error",
          text: "보관된 대화를 끝까지 불러오지 못했습니다. 잠시 뒤 다시 시도해 주세요."
        });
    } catch (e) {
      setOlderNote({
        kind: "error",
        text: e instanceof Error ? e.message : "보관된 대화를 불러오지 못했습니다."
      });
    } finally {
      setBulkLoading(false);
    }
  }
  reactExports.useEffect(() => {
    stopTyping();
    setShowAll(false);
    setOlderNote(null);
    stickRef.current = true;
    scrollToBottom();
    const id = requestAnimationFrame(() => scrollToBottom());
    return () => cancelAnimationFrame(id);
  }, [activeChannel, activeGroupId, scrollToBottom]);
  reactExports.useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const onLoad = (e) => {
      if (e.target?.tagName === "IMG" && stickRef.current) scrollToBottom();
    };
    el.addEventListener("load", onLoad, true);
    return () => el.removeEventListener("load", onLoad, true);
  }, [scrollToBottom]);
  reactExports.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    const fit = () => {
      el.style.height = "auto";
      const bord = el.offsetHeight - el.clientHeight;
      const panel = el.closest(".chat");
      const roomCap = panel && panel.clientHeight ? Math.max(COMPOSE_H_MIN, Math.round(panel.clientHeight * 0.6)) : COMPOSE_H_MAX;
      el.style.height = Math.min(Math.max(el.scrollHeight + bord, composeH), COMPOSE_H_MAX, roomCap) + "px";
    };
    fit();
    const w = el.ownerDocument.defaultView ?? window;
    w.addEventListener("resize", fit);
    return () => w.removeEventListener("resize", fit);
  }, [input, composeH]);
  function noWhisperTarget() {
    if (activeChannel === "whisper" && !targetId) {
      useChatStore.getState().add({
        channel: "whisper",
        kind: "system",
        text: "귓속말 상대가 없습니다. 주사위는 「메인」 채널에서 굴리세요."
      });
      return true;
    }
    return false;
  }
  function speakAs() {
    const nm = isGM && npcMode ? npcName.trim() : "";
    if (nm)
      return {
        who: {
          name: nm,
          color: "#8b93a7",
          avatar: "",
          // NPC 는 투명 두상 — 렌더가 npc 표식을 먼저 보므로 빈 값이면 충분
          nameColor: void 0,
          standing: void 0,
          standingHeight: void 0
        },
        npc: nm
      };
    return { who: identity, charId: speakingChar?.id ?? (panelPinned ? "owner" : void 0) };
  }
  function submit(over) {
    const source = over ? over.text : input;
    const useFmt = over ? over.fmt : fmt;
    let text = source;
    let script = over ? over.script : scriptMode;
    const trimmed = source.trim();
    if (trimmed.toLowerCase().startsWith("/desc")) {
      text = trimmed.slice(5).replace(/^\s+/, "");
      script = true;
    } else if (speakingChar && !npcMode) {
      const applyStanding = (slot) => {
        if (panelPinned && panelSpeaker.kind === "char") {
          useCharacterStore.getState().setExpressionById(panelSpeaker.id, slot);
          publishPoolChar(panelSpeaker.id);
          return;
        }
        switchStanding(slot);
      };
      const head = /^\/([^\s/]+)\s*/.exec(trimmed);
      const headSlot = head ? findStandingByCommand(speakingChar.portrait, head[1]) : -1;
      if (head && headSlot >= 0) {
        applyStanding(headSlot);
        text = trimmed.slice(head[0].length);
      } else {
        const tail = /(^|\s)\/([^\s/]+)\s*$/.exec(trimmed);
        const tailSlot = tail ? findStandingByCommand(speakingChar.portrait, tail[2]) : -1;
        if (tail && tailSlot >= 0) {
          applyStanding(tailSlot);
          text = trimmed.slice(0, tail.index).replace(/\s+$/, "");
        }
      }
      if (text !== source && !text.trim()) {
        if (!over) clearInput();
        return;
      }
    }
    if (!text.trim()) return;
    if (noWhisperTarget()) return;
    if (!over) {
      const prompts = extractPrompts(text);
      if (prompts.length) {
        const askText = text;
        const askFmt = useFmt;
        const askScript = script;
        void (async () => {
          const values = {};
          for (const p of prompts) {
            const v = await promptText({ title: "값 입력", label: p.label, defaultValue: p.def });
            if (v === null) {
              inputRef.current?.focus();
              return;
            }
            values[p.label] = v;
          }
          submit({ text: expandMacro(askText, values), fmt: askFmt, script: askScript });
          clearInput();
        })();
        return;
      }
    }
    if (checkBonus) {
      const withBonus = withCheckBonus(text, checkBonus);
      if (withBonus !== text) {
        text = withBonus;
        setCheckBonus(0);
      }
    }
    const asScript = script;
    text = applyFormatting(text, useFmt, asScript);
    const { who, npc, charId } = speakAs();
    send(text, who, {
      channel: activeChannel,
      groupId: sendGroupId,
      to: activeChannel === "whisper" ? targetId : void 0,
      // 비밀은 메인·사담에서만 — 귓속말/그룹은 false 강제(그룹 비밀은 라우팅이 깨짐).
      secret: activeChannel === "main" || activeChannel === "ooc" ? secret : false,
      script: asScript,
      npcName: npc,
      charId,
      // 이 창의 화자 각인 — 다른 창이 장착을 갈아타도 이 말은 제 캐릭터로 남는다
      rulesetId: speakingChar?.rulesetId
      // 판정 명령은 발화 캐릭터의 룰로 굴린다(시트 클릭과 같은 결과)
    });
    if (!over) clearInput();
  }
  function rollDice(cmd) {
    let c = cmd.trim();
    if (!c) return;
    if (noWhisperTarget()) return;
    if (checkBonus) {
      const withBonus = withCheckBonus(c, checkBonus);
      if (withBonus !== c) {
        c = withBonus;
        setCheckBonus(0);
      }
    }
    playSfx("send");
    const { who, npc, charId } = speakAs();
    send(c, who, {
      channel: activeChannel,
      groupId: sendGroupId,
      to: activeChannel === "whisper" ? targetId : void 0,
      secret: activeChannel === "main" || activeChannel === "ooc" ? secret : false,
      npcName: npc,
      charId,
      rulesetId: speakingChar?.rulesetId
    });
  }
  function rollCustom() {
    if (!diceExpr.trim()) return;
    rollDice(diceExpr);
    setDiceExpr("");
    setDicePanel(false);
  }
  async function loadWholeHistory() {
    const store = useChatStore.getState();
    if (store.olderBusy) return "partial";
    const online = !!store.transport;
    const cap = olderLoadCap();
    store.setOlderBusy(true);
    const reExpand = showAll;
    if (reExpand) setShowAll(false);
    try {
      for (let round = 0; round < MAX_OLDER_ROUNDS; round++) {
        if (bulkCancelRef.current) return "cancelled";
        const s = useChatStore.getState();
        if (s.olderDone || !s.hasArchive) break;
        const mark = JSON.stringify(s.olderCursor);
        try {
          await (online ? loadOlderChat() : loadOlderLocalChat());
        } catch {
          return "partial";
        }
        const after = useChatStore.getState();
        setOlderNote({ kind: "info", text: `${after.older.length.toLocaleString()}건 불러왔습니다…` });
        if (after.olderDone) break;
        if (JSON.stringify(after.olderCursor) === mark) return "partial";
        if (after.older.length >= cap) return "capped";
      }
      const done = useChatStore.getState();
      return done.olderDone || !done.hasArchive ? "done" : "partial";
    } finally {
      useChatStore.getState().setOlderBusy(false);
      if (reExpand) expandAllChat();
    }
  }
  async function settleHistoryForExport() {
    const s = useChatStore.getState();
    if (!s.hasArchive || s.olderDone) return true;
    const where = s.transport ? "서버 보관소" : "이 기기의 기록장";
    const withAll = await confirmDismissDialog({
      title: "보관된 지난 대화",
      message: `아직 화면에 올리지 않은 지난 대화가 ${where}에 남아 있습니다.
저장에는 화면에 올라와 있는 대화만 담기므로, 함께 남기려면 먼저 불러와야 합니다.

대화가 많으면 시간이 걸릴 수 있습니다.`,
      okText: "전부 불러와 저장",
      cancelText: "지금 화면만 저장"
    });
    if (withAll === "dismissed") return false;
    if (!withAll) return true;
    let got = "partial";
    try {
      got = await withBusy("보관된 지난 대화를 불러오는 중…", loadWholeHistory);
    } catch {
      got = "partial";
    }
    if (got === "capped") {
      const now = useChatStore.getState();
      const n = now.older.length + now.messages.length;
      return await confirmDialog({
        title: "담을 수 있는 만큼 불러왔습니다",
        message: `한 번에 저장할 수 있는 상한에 닿아 최근 ${n.toLocaleString()}건까지만 화면에 올렸습니다.
그보다 앞선 대화는 이번 파일에 담기지 않습니다(${where}에는 그대로 남아 있습니다).

이대로 저장할까요?`,
        okText: "이대로 저장",
        cancelText: "저장 취소"
      });
    }
    if (got === "partial" || got === "cancelled")
      await alertDialog({
        title: "일부를 불러오지 못했습니다",
        message: "보관된 대화를 끝까지 불러오지 못했습니다. 지금까지 불러온 만큼만 저장에 담깁니다."
      });
    return true;
  }
  function buildLogDoc(tabs = chosenTabs, build = buildChatLogDoc, tabBar = true) {
    if (!logRef.current) return null;
    const includePrivate = tabs.some((t) => t.key === "whisper");
    const wasWindowed = !showAll;
    const widen = !detached && !searching;
    const prevTop = logRef.current.scrollTop;
    if (wasWindowed || widen)
      reactDomExports.flushSync(() => {
        if (wasWindowed) setShowAll(true);
        if (widen) setExportAllChannels(true);
      });
    const logEl = logRef.current;
    const html = logEl ? build(logEl, {
      // 상단 제목 = 세션방 이름(없으면 폴백). 룰 표기·코드·참가자 머리말은 표시하지 않음(보기 좋지 않아 제외).
      title: useNetStore.getState().roomTitle || "세션 로그",
      exportedAt: Date.now(),
      includePrivate,
      chatWidth: useUIStore.getState().chatWidth,
      // 검색 결과를 담을 때는 탭을 나누지 않는다 — 화면에 뜬 그 목록이 곧 담기는 것이라 나눌 기준이 없다.
      tabs: searching ? void 0 : tabs,
      tabBar
    }) : null;
    if (wasWindowed || widen) {
      reactDomExports.flushSync(() => {
        if (wasWindowed) setShowAll(false);
        if (widen) setExportAllChannels(false);
      });
      const el = logRef.current;
      if (el) el.scrollTop = stickRef.current ? el.scrollHeight : prevTop;
    }
    return html;
  }
  function sessionFileBase() {
    return (useNetStore.getState().roomTitle || "세션 로그").replace(/[\\/:*?"<>|]+/g, "_").slice(0, 40) || "세션 로그";
  }
  async function exportHtml() {
    if (htmlBusy) return;
    if (!await settleHistoryForExport()) return;
    const html = buildLogDoc();
    if (!html) return;
    setHtmlBusy(true);
    try {
      const { inlineLogAssetImages } = await __vitePreload(async () => {
        const { inlineLogAssetImages: inlineLogAssetImages2 } = await import("./externalizeLogImages-BUW88OBY-s2.js");
        return { inlineLogAssetImages: inlineLogAssetImages2 };
      }, true ? __vite__mapDeps([10,1,2,9]) : void 0, import.meta.url);
      const ext = { total: 0, failed: 0 };
      downloadHtml(await inlineLogAssetImages(html, ext), `${sessionFileBase()}.html`);
      setPdfMenu(false);
      if (ext.failed > 0) {
        await alertDialog({
          title: "일부 외부 이미지 미포함",
          message: `외부 이미지 ${ext.failed}개는 원본 링크로 남았어요.`
        });
      }
    } catch (e) {
      await alertDialog({ title: "채팅로그 저장 실패", message: e.message });
    } finally {
      setHtmlBusy(false);
    }
  }
  async function exportPng() {
    const send2 = chatPngExport();
    if (pngBusy || !send2) return;
    if (!await settleHistoryForExport()) return;
    const html = buildLogDoc(chosenTabs, buildChatLogDoc, false);
    if (!html) return;
    setPngBusy(true);
    try {
      const { inlineLogAssetImages } = await __vitePreload(async () => {
        const { inlineLogAssetImages: inlineLogAssetImages2 } = await import("./externalizeLogImages-BUW88OBY-s2.js");
        return { inlineLogAssetImages: inlineLogAssetImages2 };
      }, true ? __vite__mapDeps([10,1,2,9]) : void 0, import.meta.url);
      const ext = { total: 0, failed: 0 };
      const res = await send2({
        html: await inlineLogAssetImages(html, ext),
        baseName: sessionFileBase(),
        contentWidth: useUIStore.getState().chatWidth,
        maxSliceHeight: PNG_SLICE_HEIGHT
      });
      if (res?.ok) {
        await alertDialog({
          title: "이미지 저장 완료",
          message: `채팅 로그를 이미지 ${res.count ?? 0}장으로 저장했어요.` + (res.dir ? `

저장 위치:
${res.dir}` : "") + (ext.failed > 0 ? `

외부 링크 이미지 ${ext.failed}개는 받지 못해 빈칸으로 찍혔을 수 있어요.` : "")
        });
        setPdfMenu(false);
      } else if (!res?.canceled) {
        await alertDialog({
          title: "이미지 저장 실패",
          message: res?.error || "알 수 없는 오류로 저장하지 못했어요."
        });
      }
    } catch (e) {
      await alertDialog({ title: "이미지 저장 실패", message: e.message });
    } finally {
      setPngBusy(false);
    }
  }
  async function backupToLobby() {
    if (backupBusy) return;
    if (account?.role === "guest") {
      await alertDialog({
        title: "백업 불가",
        message: "손님 계정은 백업할 수 없습니다. 관리자 승인이 필요합니다."
      });
      return;
    }
    if (privateTabsChosen.length > 0) {
      const go = await confirmDialog({
        title: "이 탭까지 함께 올릴까요?",
        message: `${privateTabsChosen.map((t) => t.label).join("·")} 이(가) 함께 담깁니다.
여기에는 나 말고 다른 사람이 남긴 말도 들어 있습니다.

올린 글은 기본 비공개지만, 공개로 바꾸면 누구나 볼 수 있게 됩니다.`,
        okText: "이대로 올리기",
        cancelText: "취소"
      });
      if (!go) return;
    }
    if (!await settleHistoryForExport()) return;
    const raw = buildLogDoc();
    if (!raw) return;
    setBackupBusy(true);
    try {
      const title = useNetStore.getState().roomTitle || "세션 로그";
      const { externalizeLogImages } = await __vitePreload(async () => {
        const { externalizeLogImages: externalizeLogImages2 } = await import("./externalizeLogImages-BUW88OBY-s2.js");
        return { externalizeLogImages: externalizeLogImages2 };
      }, true ? __vite__mapDeps([10,1,2,9]) : void 0, import.meta.url);
      const { saveLog } = await __vitePreload(async () => {
        const { saveLog: saveLog2 } = await import("./sessionlogsServer-DDlJpFpY-s2.js").then((n) => n.m);
        return { saveLog: saveLog2 };
      }, true ? __vite__mapDeps([11,1,2]) : void 0, import.meta.url);
      const ext = { total: 0, failed: 0 };
      const html = await externalizeLogImages(raw, ext);
      if (html.length > 23e5) {
        throw new Error("로그가 너무 큽니다. 이미지가 많은 세션은 기간을 나눠 백업해 주세요.");
      }
      const r = await saveLog({ title, html });
      if (!r.ok) throw new Error(r.error);
      setPdfMenu(false);
      await alertDialog({
        title: "로비에 백업했어요",
        message: `'${title}' 로그를 로비 ‘세션 로그’에 저장했습니다(기본 비공개).` + (ext.failed > 0 ? `

외부 링크 이미지 ${ext.failed}개는 받지 못해 백업에 포함되지 않았어요.` : "")
      });
    } catch (e) {
      await alertDialog({ title: "백업 실패", message: e.message });
    } finally {
      setBackupBusy(false);
    }
  }
  async function buildEmbedCode(inlineImages) {
    if (!await settleHistoryForExport()) return null;
    const raw = buildLogDoc(chosenTabs, buildChatEmbedHtml);
    if (!raw) return null;
    if (!inlineImages) return raw;
    const { inlineLogAssetImages } = await __vitePreload(async () => {
      const { inlineLogAssetImages: inlineLogAssetImages2 } = await import("./externalizeLogImages-BUW88OBY-s2.js");
      return { inlineLogAssetImages: inlineLogAssetImages2 };
    }, true ? __vite__mapDeps([10,1,2,9]) : void 0, import.meta.url);
    return await inlineLogAssetImages(raw, embedStats.current);
  }
  async function copyEmbedCode() {
    if (embedBusy) return;
    setEmbedBusy(true);
    try {
      embedStats.current = { total: 0, failed: 0 };
      const code = await buildEmbedCode(embedInline);
      if (!code) return;
      const ok = await copyToClipboard(code);
      await alertDialog({
        title: ok ? "코드를 복사했어요" : "복사하지 못했어요",
        message: ok ? `${Math.max(1, Math.round(code.length / 1024)).toLocaleString()}KB 를 복사했습니다.
블로그 글쓰기에서 ‘HTML’ 모드로 바꾼 뒤 붙여 넣어 주세요.` + (embedStats.current.failed > 0 ? `

외부 링크 이미지 ${embedStats.current.failed}개는 원본 링크로 남았어요.` : "") : "클립보드를 쓸 수 없는 환경입니다. ‘파일로 저장’을 이용해 주세요."
      });
    } catch (e) {
      await alertDialog({ title: "코드를 만들지 못했어요", message: e.message });
    } finally {
      setEmbedBusy(false);
    }
  }
  async function saveEmbedCode() {
    if (embedBusy) return;
    setEmbedBusy(true);
    try {
      embedStats.current = { total: 0, failed: 0 };
      const code = await buildEmbedCode(embedInline);
      if (!code) return;
      downloadText(code, `${sessionFileBase()} (붙여넣기용).html`);
      setPdfMenu(false);
    } catch (e) {
      await alertDialog({ title: "코드를 만들지 못했어요", message: e.message });
    } finally {
      setEmbedBusy(false);
    }
  }
  function onResizeDown(e) {
    e.preventDefault();
    resizeRef.current = { x: e.clientX, w: useUIStore.getState().chatWidth };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onResizeMove(e) {
    const d = resizeRef.current;
    if (!d) return;
    setChatWidth(d.w + (d.x - e.clientX));
  }
  function onResizeUp(e) {
    resizeRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function onComposeResizeDown(e) {
    e.preventDefault();
    composeResizeRef.current = { y: e.clientY, h: useUIStore.getState().composeH };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onComposeResizeMove(e) {
    const d = composeResizeRef.current;
    if (!d) return;
    setComposeH(d.h + (d.y - e.clientY));
  }
  function onComposeResizeUp(e) {
    composeResizeRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }
  function clampMacroPos(p) {
    const z = effectiveUiScale();
    return {
      x: Math.max(0, Math.min(p.x, Math.max(0, window.innerWidth / z - 96))),
      y: Math.max(0, Math.min(p.y, Math.max(0, window.innerHeight / z - 34)))
    };
  }
  function snapMacroPos(x, y) {
    return clampMacroPos({
      x: Math.round(x / MACRO_SNAP_X) * MACRO_SNAP_X,
      y: Math.round(y / MACRO_SNAP_Y) * MACRO_SNAP_Y
    });
  }
  function nextFreeMacroSlot() {
    const taken = new Set(macros.filter((m) => m.pos).map((m) => `${m.pos.x},${m.pos.y}`));
    const rows = Math.max(1, Math.floor((window.innerHeight / effectiveUiScale() - 160) / MACRO_SNAP_Y));
    for (let col = 0; col < 12; col++) {
      for (let row = 0; row < rows; row++) {
        const p = snapMacroPos(120 + col * 112, 120 + row * MACRO_SNAP_Y);
        if (!taken.has(`${p.x},${p.y}`)) return p;
      }
    }
    return snapMacroPos(120, 120);
  }
  function placeMacroFromDragEnd(e, m) {
    if (e.dataTransfer.dropEffect !== "none") return;
    if (!e.clientX && !e.clientY) return;
    if (document.elementFromPoint(e.clientX, e.clientY)?.closest(".fwin")) return;
    const z = effectiveUiScale();
    setMacroPos(m.id, snapMacroPos(e.clientX / z - 36, e.clientY / z - 13));
  }
  function onMacroPointerDown(e, m) {
    if (e.button !== 0) return;
    e.preventDefault();
    const r = e.currentTarget.getBoundingClientRect();
    const z0 = effectiveUiScale();
    const d = {
      id: m.id,
      grabX: (e.clientX - r.left) / z0,
      grabY: (e.clientY - r.top) / z0,
      startX: e.clientX,
      startY: e.clientY,
      moved: false
    };
    macroDragRef.current = d;
    const onMove = (ev) => {
      if (!d.moved && Math.abs(ev.clientX - d.startX) + Math.abs(ev.clientY - d.startY) < DRAG_SLOP) return;
      d.moved = true;
      const z = effectiveUiScale();
      setMacroDrag({ id: d.id, x: ev.clientX / z - d.grabX, y: ev.clientY / z - d.grabY });
    };
    const finish = (ev, cancelled) => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
      macroDragRef.current = null;
      setMacroDrag(null);
      if (cancelled) return;
      if (!d.moved) {
        toggleMacro(m);
        return;
      }
      const bar = barRef.current?.getBoundingClientRect();
      if (bar && ev.clientX >= bar.left && ev.clientX <= bar.right && ev.clientY >= bar.top && ev.clientY <= bar.bottom) {
        if (!m.pos) {
          const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest(
            ".macro-chip"
          );
          const tid = target?.getAttribute("data-macro-id");
          if (tid && tid !== m.id) reorderMacro(m.id, tid);
          return;
        }
        setMacroPos(m.id, null);
        return;
      }
      const z = effectiveUiScale();
      setMacroPos(m.id, snapMacroPos(ev.clientX / z - d.grabX, ev.clientY / z - d.grabY));
    };
    const onUp = (ev) => finish(ev, false);
    const onCancel = (ev) => finish(ev, true);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
  }
  function onMacroKeyDown(e, m) {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (e.repeat) return;
    e.preventDefault();
    toggleMacro(m);
  }
  function macroChipStyle(m) {
    if (!m.color && !m.grad) return void 0;
    const base = m.grad?.from || m.color;
    const style = {};
    if (base) style["--macro-c"] = base;
    if (m.grad)
      style["--macro-bgimg"] = `linear-gradient(${m.grad.angle ?? 180}deg, ${m.grad.from}, ${m.grad.to})`;
    return style;
  }
  function applyMacro(m) {
    const cur = inputRef.current ? inputRef.current.value : input;
    if (m.text && cur.trim() && cur !== useChatStore.getState().activeMacroText) {
      void (async () => {
        const ok = await confirmDialog({
          title: m.name,
          message: "입력칸에 쓰던 글이 있어요. 매크로 문구로 바꿀까요?\n바꾼 뒤에도 Ctrl+Z 로 되돌릴 수 있어요.",
          okText: "바꾸기"
        });
        if (ok) putMacro(m);
        else inputRef.current?.focus();
      })();
      return;
    }
    putMacro(m);
  }
  function putMacro(m) {
    const prompts = m.text ? extractPrompts(m.text) : [];
    if (!prompts.length) {
      applyMacroFmt(m.id, m.fmt, m.scriptMode);
      if (!m.text) {
        inputRef.current?.focus();
        return;
      }
      putInput(m.text);
      noteMacroText(m.id, m.text);
      return;
    }
    void (async () => {
      const values = {};
      for (const p of prompts) {
        const v = await promptText({ title: m.name, label: p.label, defaultValue: p.def });
        if (v === null) return;
        values[p.label] = v;
      }
      const text = expandMacro(m.text, values);
      applyMacroFmt(m.id, m.fmt, m.scriptMode);
      putInput(text);
      noteMacroText(m.id, text);
    })();
  }
  function toggleMacro(m) {
    if (useChatStore.getState().activeMacroId === m.id) clearMacro();
    else applyMacro(m);
  }
  function clearMacro() {
    const s = useChatStore.getState();
    const put = s.activeMacroText;
    s.setFmt(EMPTY_FMT);
    s.setScriptMode(false);
    const cur = inputRef.current ? inputRef.current.value : input;
    if (put !== null && cur === put) putInput("");
    else inputRef.current?.focus();
  }
  function sendMacroNow(m) {
    if (!m.text) return;
    void (async () => {
      const values = {};
      for (const p of extractPrompts(m.text)) {
        const v = await promptText({ title: m.name, label: p.label, defaultValue: p.def });
        if (v === null) return;
        values[p.label] = v;
      }
      const text = expandMacro(m.text, values);
      submit({ text, fmt: m.fmt, script: m.scriptMode });
    })();
  }
  function putInput(text, focus = true) {
    setInput(text);
    recordHistory(text, text.length, text.length);
    if (focus) inputRef.current?.focus();
  }
  const composeHandle = reactExports.useRef({
    put: () => {
    },
    get: () => "",
    focus: () => {
    }
  });
  composeHandle.current = {
    put: (t) => putInput(t, false),
    get: () => input,
    focus: () => inputRef.current?.focus()
  };
  const composeWinId = detached ? `chat:${activeTabKey}` : "main";
  const composeLabel = activeChannel === "group" ? channels.find((c) => c.id === activeGroupId)?.name ?? CHANNEL_LABELS.group : CHANNEL_LABELS[activeChannel];
  reactExports.useEffect(() => {
    return register({
      winId: composeWinId,
      channel: activeChannel,
      label: composeLabel,
      put: (t) => composeHandle.current.put(t),
      get: () => composeHandle.current.get(),
      focus: () => composeHandle.current.focus()
    });
  }, [composeWinId, activeChannel, composeLabel]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chat", style: { ["--chat-font-scale"]: chatFontScale }, children: [
      !detached && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "chat-resizer",
          title: "드래그하여 채팅 폭 조절",
          onPointerDown: onResizeDown,
          onPointerMove: onResizeMove,
          onPointerUp: onResizeUp
        }
      ),
      !detached && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ctabs-row", ref: tabsRowRef, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ctabs", ref: tabsRef, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              "data-tab-key": "main",
              className: "ctab" + (activeChannel === "main" ? " on" : "") + (!!unread["main"] && activeChannel !== "main" ? " flash" : "") + (dragTab === "main" ? " ctab-dragging" : ""),
              title: "메인 채널 · 단축키 F1 · 탭 줄 밖으로 빼면 별도 창(우클릭으로도)",
              onPointerDown: (e) => onTabPointerDown(e, "main", false, CHANNEL_LABELS.main),
              onContextMenu: (e) => {
                e.preventDefault();
                detachTab("main", false, CHANNEL_LABELS.main, { screenX: e.screenX, screenY: e.screenY });
              },
              children: [
                CHANNEL_LABELS.main,
                detachedTabs["main"] && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_new", size: 12, className: "ctab-out-mark" }),
                !!unread["main"] && activeChannel !== "main" && /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "blink", "aria-hidden": true })
              ]
            },
            "main"
          ),
          orderableTabs.map((key, i) => {
            const grp = channels.find((c) => c.id === key);
            const isGroup = !!grp;
            const label = isGroup ? grp.name : CHANNEL_LABELS[key];
            const on = isGroup ? activeChannel === "group" && activeGroupId === key : activeChannel === key;
            const flashing = !!unread[key] && !on;
            const hotkey = i + 2 <= 10 ? ` · 단축키 F${i + 2}` : "";
            const isOut = !!detachedTabs[key];
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                "data-tab-key": key,
                className: "ctab" + (on ? " on" : "") + (flashing ? " flash" : "") + (isOut ? " ctab-out" : "") + (dragTab === key ? " ctab-dragging" : ""),
                onPointerDown: (e) => onTabPointerDown(e, key, isGroup, label),
                title: (isOut ? "별도 창으로 빠져 있습니다. 누르면 그 창을 앞으로" : isGroup ? isGM ? "그룹 채널 · 끌어서 순서 변경 · 우클릭 메뉴" : "그룹 채널 · 끌어서 순서 변경" : "끌어서 순서 변경 · 탭 줄 밖으로 빼면 별도 창") + hotkey,
                onContextMenu: async (e) => {
                  e.preventDefault();
                  const at = { screenX: e.screenX, screenY: e.screenY };
                  if (!isGroup || !isGM) {
                    detachTab(key, isGroup, label, at);
                    return;
                  }
                  const del = await confirmDialog({
                    title: `그룹 '${grp.name}'`,
                    message: "이 탭을 별도 창으로 뺄까요, 그룹을 삭제할까요?",
                    okText: "그룹 삭제",
                    cancelText: "별도 창으로 빼기"
                  });
                  if (del) removeGroup(key);
                  else detachTab(key, isGroup, label, at);
                },
                children: [
                  label,
                  isOut && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "open_in_new", size: 12, className: "ctab-out-mark" }),
                  flashing && /* @__PURE__ */ jsxRuntimeExports.jsx("i", { className: "blink", "aria-hidden": true })
                ]
              },
              key
            );
          }),
          isGM && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "ctab ctab-add",
              title: "그룹 채널 개설",
              onClick: () => setGroupForm((v) => !v),
              children: "+ 그룹"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ctabs-actions", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "iconbtn" + (pdfMenu ? " on" : ""),
              style: { width: 28, height: 28 },
              title: "채팅로그 저장 (HTML 파일)",
              onClick: () => setPdfMenu((v) => !v),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "description", size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "iconbtn",
              style: { width: 28, height: 28 },
              title: searching ? "검색 닫기" : "로그 검색",
              onClick: () => setSearching((s) => !s),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: searching ? "close" : "search", size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "iconbtn" + (fontMenu ? " on" : ""),
              style: { width: 28, height: 28 },
              title: "채팅 글자 크기 (나에게만 적용)",
              onClick: () => setFontMenu((v) => !v),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_size", size: 16 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "iconbtn" + (macroBarOn ? " on" : ""),
              style: { width: 28, height: 28 },
              title: "저장한 꾸미기를 입력칸 위에 한 줄로 꺼냅니다",
              onClick: toggleMacroBar,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmarks", size: 16 })
            }
          )
        ] })
      ] }),
      fontMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 10px",
            borderBottom: "1px solid var(--line2)",
            flexWrap: "wrap"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "muted small",
                style: { display: "inline-flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_size", size: 14 }),
                  " 채팅 글자 크기 (나에게만)"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: 80,
                max: 160,
                step: 5,
                value: Math.round(chatFontScale * 100),
                onChange: (e) => setChatFontScale(Number(e.target.value) / 100),
                style: { flex: "1 1 110px", minWidth: 90 }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { minWidth: 38, textAlign: "right" }, children: [
              Math.round(chatFontScale * 100),
              "%"
            ] }),
            Math.round(chatFontScale * 100) !== 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: () => setChatFontScale(1), children: "기본값" })
          ]
        }
      ),
      activeGroup && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group-mem-bar", title: "이 그룹의 대화는 아래 사람과 GM 에게만 보입니다", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "groups", size: 13 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gmb-name", children: activeGroup.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gmb-list", children: activeGroup.members.length === 0 ? "멤버 없음" : activeGroup.members.map(memberLabel).join(", ") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gmb-tail", children: "+ GM" })
      ] }),
      groupForm && isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group-form", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input",
            placeholder: "그룹 이름",
            value: groupName,
            onChange: (e) => setGroupName(e.target.value)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "group-members", children: participants.filter((p) => p.role !== "GM").length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "참가자(플레이어)가 없습니다" }) : participants.filter((p) => p.role !== "GM").map((p) => {
          const on = groupMembers.includes(p.playerId);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              className: "group-mem" + (on ? " on" : ""),
              style: p.connected ? void 0 : { opacity: 0.65 },
              title: p.connected ? void 0 : "접속 끊김. 재접속하면 그룹 멤버로 적용됩니다",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: on,
                    onChange: () => setGroupMembers(
                      (m) => on ? m.filter((x) => x !== p.playerId) : [...m, p.playerId]
                    )
                  }
                ),
                roster[p.playerId]?.name || p.nick,
                !p.connected && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: " · 오프라인" })
              ]
            },
            p.playerId
          );
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group-form-act", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "btn sm pri",
              disabled: !groupName.trim() || groupMembers.length === 0,
              onClick: () => {
                createGroup(groupName.trim(), groupMembers);
                setGroupName("");
                setGroupMembers([]);
                setGroupForm(false);
              },
              children: "개설"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm", onClick: () => setGroupForm(false), children: "취소" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { marginLeft: "auto" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HintTip, { text: "GM(나)은 이 그룹에 자동으로 들어갑니다", label: "그룹 멤버 설명" }) })
        ] })
      ] }),
      pdfMenu && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 8px",
            borderBottom: "1px solid var(--line2)",
            flexWrap: "wrap"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { flex: "0 0 auto" }, children: "담을 탭" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "clog-tabs",
                title: searching ? "검색 중에는 화면에 뜬 결과가 그대로 담깁니다." : void 0,
                children: exportTabList.map((t) => {
                  const on = exportTabs.has(t.key);
                  const isPrivate = t.key === "whisper" || channels.some((c) => c.id === t.key);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      type: "button",
                      className: "clog-tab" + (on ? " on" : "") + (isPrivate ? " priv" : ""),
                      title: isPrivate ? "남의 사생활이 섞인 탭입니다. 공개되는 곳에 올릴 때는 한 번 더 생각해 주세요." : void 0,
                      onClick: () => setExportTabs((prev) => {
                        const next = new Set(prev);
                        if (next.has(t.key)) next.delete(t.key);
                        else next.add(t.key);
                        return next;
                      }),
                      children: [
                        isPrivate && /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: on ? "lock_open" : "lock", size: 11 }),
                        t.label
                      ]
                    },
                    t.key
                  );
                })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
              exportCount,
              "건"
            ] }),
            chosenTabs.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "small", style: { color: "var(--warn, #f0b75b)" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "info", size: 13 }),
              " 담을 탭을 하나 이상 골라 주세요"
            ] }),
            privateTabsChosen.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "small",
                style: { color: "var(--warn, #f0b75b)" },
                title: isGM && roomGmSeeWhispers ? "귓속말 열람을 켠 뒤에 오간 남의 귓속말도 함께 담깁니다." : "고른 탭에는 나 말고 다른 사람이 남긴 말도 들어 있습니다.",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 13 }),
                  " ",
                  privateTabsChosen.map((t) => t.label).join("·"),
                  " 이(가) 함께 담깁니다"
                ]
              }
            ),
            (hasArchive || liveMessages.length >= RUNTIME_CHAT_LIMIT) && (transport && !serverArchive ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "small",
                style: { color: "var(--warn, #f0b75b)" },
                title: `한 방에 보관하는 대화는 ${RUNTIME_CHAT_LIMIT.toLocaleString()}건까지입니다. 이 서버는 예전 판이라 그보다 앞선 대화가 지워질 수 있으니 미리 저장해 두세요.`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "warning", size: 13 }),
                  " 보관 상한에 닿았습니다"
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "small",
                style: { color: "var(--tx2)" },
                title: `화면에는 최근 ${RUNTIME_CHAT_LIMIT.toLocaleString()}건만 올려 둡니다. 그보다 앞선 대화는 ${transport ? "서버 보관소" : "이 기기의 기록장"}에 남아 있고, 채팅 맨 위 '보관된 이전 대화 불러오기'로 올릴 수 있습니다. 저장에는 올라와 있는 대화만 담깁니다.`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "inventory_2", size: 13 }),
                  " 앞선 대화는 보관소에 있습니다"
                ]
              }
            )),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }, children: [
              account?.role !== "guest" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "btn sm",
                  onClick: () => void backupToLobby(),
                  disabled: backupBusy || chosenTabs.length === 0,
                  title: "왼쪽에서 고른 탭이 그대로 올라갑니다. 올린 글은 기본 비공개이며, 로비 「세션 로그」에서 공개로 바꿀 수 있습니다.",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark_add", size: 14 }),
                    " ",
                    backupBusy ? "백업 중…" : "로비에 백업"
                  ]
                }
              ),
              chatPngExport() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "btn sm",
                  onClick: () => void exportPng(),
                  disabled: pngBusy || chosenTabs.length === 0,
                  title: "화면 그대로 PNG 저장 (여러 장)",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "image", size: 14 }),
                    " ",
                    pngBusy ? "이미지 저장 중…" : "이미지로 저장"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "btn sm" + (embedOpen ? " pri" : ""),
                  onClick: () => setEmbedOpen((v) => !v),
                  title: "개인 홈페이지·블로그 본문에 붙여 넣을 코드를 만듭니다.",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "code", size: 14 }),
                    " 외부 사이트용"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  className: "btn sm pri",
                  onClick: () => void exportHtml(),
                  disabled: htmlBusy || chosenTabs.length === 0,
                  title: "HTML 파일로 저장됩니다.",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "description", size: 14 }),
                    " ",
                    htmlBusy ? "저장 중…" : "채팅로그 저장"
                  ]
                }
              )
            ] })
          ]
        }
      ),
      pdfMenu && embedOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "clog-embed", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "clog-embed-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "code", size: 14 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "외부 사이트에 붙여넣기" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", children: [
            "고른 탭 ",
            exportCount,
            "건"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "clog-embed-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", children: "이미지" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "clog-tab" + (embedInline ? " on" : ""),
              onClick: () => setEmbedInline(true),
              title: "그림을 코드 안에 담습니다. 서버가 꺼져도 계속 보이지만 코드가 길어집니다.",
              children: "코드에 포함"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "clog-tab" + (!embedInline ? " on" : ""),
              onClick: () => setEmbedInline(false),
              title: "그림을 내 서버 주소로 걸어 둡니다. 코드가 짧지만 서버가 살아 있어야 보입니다.",
              children: "서버 링크"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "clog-embed-hint", children: [
          "블로그 글쓰기에서 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "HTML 모드" }),
          "로 바꾼 뒤 붙여 넣으세요. 스타일까지 지우는 편집기에서는 글자만 남습니다."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "clog-embed-row", style: { justifyContent: "flex-end" }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn sm",
              onClick: () => void saveEmbedCode(),
              disabled: embedBusy || chosenTabs.length === 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "download", size: 14 }),
                " 파일로 저장"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              className: "btn sm pri",
              onClick: () => void copyEmbedCode(),
              disabled: embedBusy || chosenTabs.length === 0,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "content_copy", size: 14 }),
                " ",
                embedBusy ? "만드는 중…" : "코드 복사"
              ]
            }
          )
        ] })
      ] }),
      searching && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            padding: "6px 8px",
            borderBottom: "1px solid var(--line2)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input",
                placeholder: "키워드(본문·발화자·명령)",
                value: q,
                onChange: (e) => setQ(e.target.value),
                style: { flex: "1 1 130px", height: 32, padding: "0 10px" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "input",
                value: authorF,
                onChange: (e) => setAuthorF(e.target.value),
                style: { height: 32, padding: "0 8px", width: "auto", maxWidth: 150 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "발화자 전체" }),
                  authors.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: a, children: a }, a))
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "input",
                value: channelF,
                onChange: (e) => setChannelF(e.target.value),
                style: { height: 32, padding: "0 8px", width: "auto" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "채널 전체" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "main", children: "메인" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ooc", children: "사담" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "whisper", children: "귓속말" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "group", children: "그룹" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "date",
                className: "input",
                value: dateF,
                onChange: (e) => setDateF(e.target.value),
                style: { height: 32, padding: "0 8px", width: "auto" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { alignSelf: "center" }, children: [
              shown.length,
              "건"
            ] }),
            canLoadOlder && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "muted small", style: { flexBasis: "100%" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "inventory_2", size: 12 }),
              " 아직 불러오지 않은 보관 대화는 검색되지 않습니다. 검색을 닫고 「보관된 대화 전부 불러오기」를 누른 뒤 다시 찾아 주세요."
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "log" + // 여러 채널을 모아 담는 동안은 탭 색을 벗는다 — 한 탭의 배경색이 저장본 전체를 물들이지 않게.
          (exportAllChannels ? "" : activeChannel === "ooc" ? " log--ooc" : activeChannel === "whisper" ? " log--whisper" : ""),
          ref: logRef,
          onScroll: onLogScroll,
          children: [
            !searching && !truncated && canLoadOlder && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "log-more",
                onClick: () => void fetchOlderChat(),
                disabled: olderBusy,
                title: transport ? "세션 초반의 대화를 서버 보관소에서 불러옵니다" : "세션 초반의 대화를 이 기기의 기록장에서 불러옵니다",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: olderBusy ? "hourglass_top" : "inventory_2", size: 14 }),
                  " ",
                  olderBusy ? "보관된 대화를 불러오는 중…" : "보관된 이전 대화 불러오기"
                ]
              }
            ),
            !searching && bulkLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "log-more",
                onClick: () => {
                  bulkCancelRef.current = true;
                },
                title: "불러오기를 여기서 멈춥니다 (지금까지 올린 대화는 그대로 남습니다)",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "stop_circle", size: 14 }),
                  " 불러오기 중단"
                ]
              }
            ),
            !searching && !bulkLoading && !truncated && canLoadOlder && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "log-more",
                onClick: () => void fetchAllOlderChat(),
                disabled: olderBusy,
                title: "보관된 지난 대화를 남김없이 화면에 올립니다 (저장에도 그대로 담깁니다)",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "unfold_more", size: 14 }),
                  " 보관된 대화 전부 불러오기"
                ]
              }
            ),
            olderNote && !searching && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-more-err" + (olderNote.kind === "info" ? " info" : ""), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: olderNote.kind === "info" ? "info" : "error", size: 13 }),
              " ",
              olderNote.text
            ] }),
            truncated && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "log-more", onClick: expandAllChat, title: "지금까지의 모든 채팅을 불러옵니다", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "history", size: 14 }),
              " 이전 대화 ",
              shown.length - RECENT_CHAT_LIMIT,
              "개 더 보기"
            ] }),
            !searching && showAll && shown.length > RECENT_CHAT_LIMIT && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "log-more",
                onClick: collapseRecentChat,
                title: "최근 메시지만 표시해 채팅을 가볍게 유지합니다",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "vertical_align_bottom", size: 14 }),
                  " 최근 ",
                  RECENT_CHAT_LIMIT,
                  "개만 보기"
                ]
              }
            ),
            rendered.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              MessageItem,
              {
                m,
                live: isLiveRoll(m.id),
                toName: m.to ? nameOf(m.to) : void 0,
                channelLabel: searching || exportAllChannels && chosenTabs.length > 1 ? channelChip(m) : void 0,
                onlooking: (
                  // GM 권한으로 열린 남의 귓속말 — 주고받은 두 사람 어느 쪽도 내가 아닐 때만.
                  m.channel === "whisper" && m.gmVisible === true && !!self && m.playerId !== self.playerId && m.to !== self.playerId
                ),
                avatar: m.npc ? void 0 : m.avatar ?? // 발화 당시 동결 두상 우선 — 표정/캐릭터 전환에도 과거 채팅 불변
                (m.playerId && roster[m.playerId] ? rosterHeadshotFor(m) : localHeadshotFor(m.author)),
                luckCost: luckCostFor(m),
                onSpendLuck: () => spendLuckFor(m),
                canEdit: canEditMsg(m),
                canDelete: canDeleteMsg(m),
                onEdit: (text) => editMessage(m.id, text),
                onDelete: () => deleteMessage(m.id)
              },
              m.id
            ))
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "typing-ind",
          "data-on": typers.length > 0 ? "1" : void 0,
          title: typers.length > 0 ? "입력 중" : void 0,
          children: typers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "typing-dots", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("i", {})
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-who", children: typers.length <= 2 ? typers.join(", ") : `${typers.slice(0, 2).join(", ")} 외 ${typers.length - 2}명` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-tail", children: "입력 중…" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "compose", style: { ["--compose-h"]: `${composeH}px` }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "compose-resizer",
            title: "드래그하여 입력칸 높이 조절 (두 번 누르면 기본값)",
            onPointerDown: onComposeResizeDown,
            onPointerMove: onComposeResizeMove,
            onPointerUp: onComposeResizeUp,
            onPointerCancel: onComposeResizeUp,
            onLostPointerCapture: onComposeResizeUp,
            onDoubleClick: () => setComposeH(COMPOSE_H_DEFAULT)
          }
        ),
        macroBarOn && !detached && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "macro-bar", ref: barRef, children: [
          macros.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { padding: "2px 4px" }, children: "저장된 매크로가 없습니다. ‘꾸미기 북마크’에서 추가하세요." }) : barMacros.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "muted small", style: { padding: "2px 4px" }, children: "전부 화면에 꺼내 뒀어요. 여기로 끌어다 놓으면 되돌아옵니다." }) : barMacros.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "macro-chip" + (activeMacroId === m.id ? " on" : ""),
              "data-macro-id": m.id,
              style: macroChipStyle(m),
              title: `${m.name} (누르면 적용 · 한 번 더 누르면 해제 · 옆 칩 위로 끌면 자리 바꿈 · 밖으로 끌면 화면에 고정)`,
              draggable: false,
              onPointerDown: (e) => onMacroPointerDown(e, m),
              onKeyDown: (e) => onMacroKeyDown(e, m),
              children: m.name
            },
            m.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "iconbtn macro-bar-x",
              title: "매크로 바 숨기기",
              onClick: toggleMacroBar,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 13 })
            }
          )
        ] }),
        dicePanel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dice-panel", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dice-panel-h", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "casino", size: 14 }),
            " 주사위 굴림",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "iconbtn",
                style: { width: 24, height: 24, marginLeft: "auto" },
                title: "닫기",
                onClick: () => setDicePanel(false),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "close", size: 14 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "dice-grid", children: DICE_PRESETS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "dchip", "data-sfx": "none", onClick: () => rollDice(d), children: d }, d)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dice-custom", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input",
                placeholder: "예: CC<=50 · 1d3+1d6",
                value: diceExpr,
                onChange: (e) => setDiceExpr(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") rollCustom();
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "btn sm pri", "data-sfx": "none", onClick: rollCustom, children: "굴림" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "cin-opts",
            style: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", margin: "0 0 6px" },
            onMouseDown: (e) => {
              if (e.target.closest("button")) e.preventDefault();
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "muted",
                  style: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 },
                  title: "발화 정체성 (오너 프로필 또는 캐릭터)",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "record_voice_over", size: 13 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        className: "input",
                        value: npcMode ? "npc" : panelCharId ?? "owner",
                        onChange: (e) => {
                          const v = e.target.value;
                          if (detached) {
                            if (v === "npc") {
                              setPanelSpeaker({ kind: "npc" });
                              if (!panelNpcName) setPanelNpcName(storeNpcName);
                            } else if (v === "owner") {
                              setPanelSpeaker({ kind: "owner" });
                              publishPoolChar("owner");
                            } else {
                              setPanelSpeaker({ kind: "char", id: v });
                              publishPoolChar(v);
                            }
                            return;
                          }
                          if (v === "npc") {
                            setNpcMode(true);
                          } else {
                            setNpcMode(false);
                            setIdentity(v === "owner" ? null : v);
                          }
                        },
                        style: { height: 28, padding: "0 6px", width: "auto", maxWidth: 150 },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "owner", children: [
                            ownerName,
                            " (오너)"
                          ] }),
                          speakableChars.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: c.id, children: c.info.name || "이름 없는 탐사자" }, c.id)),
                          isGM && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "npc", children: "(1회성 캐릭터)" })
                        ]
                      }
                    )
                  ]
                }
              ),
              isGM && npcMode && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  className: "input",
                  placeholder: "NPC 이름",
                  value: npcName,
                  onChange: (e) => panelPinned ? setPanelNpcName(e.target.value) : setNpcName(e.target.value),
                  style: { height: 28, padding: "0 8px", width: 130, fontSize: 12 },
                  title: "이 이름으로 1회성 NPC 채팅"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "q" + (dicePanel ? " on" : ""),
                  onClick: () => setDicePanel((v) => !v),
                  title: "주사위 굴리기",
                  style: dicePanel ? { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" } : void 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "casino", size: 13 }),
                    " 주사위"
                  ]
                }
              ),
              (scriptMode || fmtActive(fmt)) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "q on",
                  onClick: () => {
                    setScriptMode(false);
                    setFmt(EMPTY_FMT);
                  },
                  title: "스크립트·꾸미기를 모두 해제하고 일반 채팅으로 전환",
                  style: { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "chevron_left", size: 13 }),
                    " 스크립트 해제"
                  ]
                }
              ),
              activeChannel === "whisper" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "label",
                {
                  className: "muted",
                  style: { display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "lock", size: 13 }),
                    " 대상",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "select",
                      {
                        className: "input",
                        value: targetId,
                        onChange: (e) => setWhisperTarget(e.target.value),
                        style: { height: 28, padding: "0 6px", width: "auto" },
                        children: [
                          others.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "(상대 없음)" }),
                          others.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: o.playerId, children: [
                            roster[o.playerId]?.name || o.nick,
                            o.connected ? "" : " · 자리 비움"
                          ] }, o.playerId))
                        ]
                      }
                    )
                  ]
                }
              ),
              activeChannel === "whisper" && roomGmSeeWhispers && !isGM && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "chip warn",
                  style: { fontSize: 11 },
                  title: "이 방은 GM이 귓속말을 볼 수 있습니다. 설정을 켠 뒤 보낸 말부터 해당됩니다.",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "visibility", size: 12 }),
                    " GM도 봅니다"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "q dice-bonus",
                  "data-on": checkBonus !== 0 ? checkBonus > 0 ? "bonus" : "penalty" : void 0,
                  title: "보너스·페널티 주사위. 한 번 굴리면 0으로 돌아갑니다",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => bumpCheckBonus(-1),
                        disabled: checkBonus <= -2,
                        "aria-label": "페널티 주사위 늘리기",
                        children: "−"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "b",
                      {
                        "aria-label": checkBonus > 0 ? `보너스 주사위 ${checkBonus}` : checkBonus < 0 ? `페널티 주사위 ${-checkBonus}` : "보정 없음",
                        children: checkBonus > 0 ? `+${checkBonus}` : checkBonus < 0 ? `−${-checkBonus}` : "±0"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => bumpCheckBonus(1),
                        disabled: checkBonus >= 2,
                        "aria-label": "보너스 주사위 늘리기",
                        children: "＋"
                      }
                    )
                  ]
                }
              ),
              (activeChannel === "main" || activeChannel === "ooc") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "q",
                  "data-sfx": "none",
                  onClick: () => {
                    setSecretMode(!secret);
                    playSfx("toggle");
                  },
                  title: "비밀 굴림/메시지 (GM과 나만 봅니다)",
                  style: secret ? { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" } : void 0,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: secret ? "lock" : "lock_open", size: 13 }),
                    " 비밀 ",
                    secret ? "ON" : "OFF"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "cin", children: [
          paletteHits.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "palette-pop", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "palette-pop-h", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "casino", size: 12 }),
              " 시트 판정 (클릭·Tab 으로 굴림)"
            ] }),
            paletteHits.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                className: "palette-pop-item",
                "data-sfx": "none",
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => rollPalette(p),
                children: [
                  p.command,
                  !p.command.includes(p.label) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "palette-pop-lbl", children: p.label })
                ]
              },
              p.command + i
            ))
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              ref: inputRef,
              "data-chat-input": true,
              className: "input",
              rows: 1,
              onFocus: () => touch(composeWinId),
              enterKeyHint: enterSendsMessage() ? "send" : "enter",
              value: input,
              onChange: (e) => {
                setInput(e.target.value);
                setPaletteOff(false);
                recordHistory(
                  e.target.value,
                  e.target.selectionStart ?? e.target.value.length,
                  e.target.selectionEnd ?? e.target.value.length
                );
                onTyping();
              },
              onBlur: stopTyping,
              onKeyDown: (e) => {
                const mod = e.ctrlKey || e.metaKey;
                if (mod && !e.shiftKey && (e.key === "z" || e.key === "Z")) {
                  if (e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  applyHistory(-1);
                  return;
                }
                if (mod && (e.key === "y" || e.key === "Y" || e.shiftKey && (e.key === "z" || e.key === "Z"))) {
                  e.preventDefault();
                  applyHistory(1);
                  return;
                }
                if (e.key === "Tab" && !e.shiftKey && paletteHits.length) {
                  e.preventDefault();
                  if (!e.nativeEvent.isComposing) rollPalette(paletteHits[0]);
                  return;
                }
                if (e.key === "Escape" && paletteHits.length) {
                  setPaletteOff(true);
                  return;
                }
                if (e.key === "Enter" && !e.shiftKey) {
                  if (!enterSendsMessage()) return;
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return;
                  e.preventDefault();
                  playSfx("send");
                  submit();
                }
              },
              placeholder: activeChannel === "whisper" ? "귓속말 입력…" : activeChannel === "group" ? "그룹 채널 입력…" : secret ? "비밀 메시지 또는 굴림…" : "메시지 또는 명령어 입력…"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "btn pri", "data-sfx": "send", onClick: () => submit(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "send", size: 16 }),
            " 전송"
          ] })
        ] })
      ] })
    ] }),
    floatShown.length > 0 && !detached && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "macro-float-layer", children: floatShown.map((m) => {
      const live = macroDrag?.id === m.id ? macroDrag : null;
      const at = live ?? clampMacroPos(m.pos);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          className: "macro-chip macro-float" + (live ? " dragging" : "") + (activeMacroId === m.id ? " on" : ""),
          style: {
            left: at.x,
            top: at.y,
            ...live ? { pointerEvents: "none" } : null,
            ...macroChipStyle(m)
          },
          title: `${m.name} (누르면 적용 · 한 번 더 누르면 해제 · 끌어서 이동 · 매크로 바에 떨구면 되돌림)`,
          draggable: false,
          onPointerDown: (e) => onMacroPointerDown(e, m),
          onKeyDown: (e) => onMacroKeyDown(e, m),
          children: m.name
        },
        m.id
      );
    }) }),
    inRoom && !detached && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloatingWindow,
      {
        winId: "decor",
        title: "채팅 꾸미기",
        icon: "palette",
        onClose: () => closeWindow("decor"),
        defaultW: 560,
        defaultH: 470,
        minW: 420,
        minH: 260,
        poppable: false,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "decor-win", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            DecorateBar,
            {
              value: input,
              onChange: (next) => {
                setInput(next);
                recordHistory(next, next.length, next.length);
                onTyping();
              },
              textareaRef: inputRef,
              fmt,
              onFmt: setFmt,
              scriptMode,
              onScriptMode: setScriptMode,
              activeMacroId,
              onMacro: toggleMacro,
              onMacroForget: forgetMacro,
              pl: !isGM,
              canImage: canChatImage
            }
          ),
          isGM && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "decor-float-hint", children: "선택한 글자에 적용돼요. 「스크립트」는 프로필 없이 전송됩니다." })
        ] })
      }
    ),
    !detached && /* @__PURE__ */ jsxRuntimeExports.jsx(
      FloatingWindow,
      {
        winId: "bookmarks",
        title: "꾸미기 북마크",
        icon: "bookmarks",
        onClose: () => closeWindow("bookmarks"),
        defaultW: 340,
        defaultH: 420,
        minW: 260,
        minH: 220,
        poppable: false,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-macros", style: { padding: 10 }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "muted small", style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }, children: [
            "누르면 저장한 꾸미기와 문구가 입력칸에 들어갑니다.",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HintTip,
              {
                label: "물음표 입력칸 설명",
                text: "본문에 ?{라벨|기본값} 을 넣어 두면 적용하거나 지금 보내기를 누를 때 값을 물어봅니다. 물음표는 반각(?)만 동작합니다."
              }
            )
          ] }),
          macros.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "muted small", children: "저장된 북마크가 없습니다. ‘현재 꾸미기 저장’을 누르세요." }),
          macros.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mk-macro",
              draggable: true,
              onDragStart: () => {
                dragMacroRef.current = m.id;
              },
              onDragOver: (e) => e.preventDefault(),
              onDrop: () => {
                const from = dragMacroRef.current;
                dragMacroRef.current = null;
                if (from) reorderMacro(from, m.id);
              },
              onDragEnd: (e) => {
                dragMacroRef.current = null;
                placeMacroFromDragEnd(e, m);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Icon,
                  {
                    name: "drag_indicator",
                    size: 15,
                    className: "mk-macro-grip",
                    title: "드래그하면 순서 변경, 창 밖으로 끌어내면 화면에 고정"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-macro-colorwrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "mk-macro-dot",
                      style: { background: m.color || "var(--tx3)" },
                      title: "표식 색 고르기",
                      "aria-label": "표식 색 고르기",
                      onClick: () => setColorPick((id) => id === m.id ? null : m.id)
                    }
                  ),
                  colorPick === m.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(FlyMenu, { onClose: () => setColorPick(null), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mk-palette", children: MACRO_COLORS.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        className: "mk-macro-color" + (m.color === c ? " on" : ""),
                        style: { background: c },
                        "aria-label": `색 ${c}`,
                        onClick: () => {
                          setMacroColor(m.id, c);
                          setColorPick(null);
                        }
                      },
                      c
                    )) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mk-gradrow", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "color",
                          value: m.grad?.from || m.color || "#7c9cff",
                          title: "시작 색",
                          onChange: (e) => setMacroGrad(m.id, { ...m.grad ?? { to: "#ffffff" }, from: e.target.value })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "input",
                        {
                          type: "color",
                          value: m.grad?.to || "#ffffff",
                          title: "끝 색",
                          onChange: (e) => setMacroGrad(m.id, {
                            ...m.grad ?? { from: m.color || "#7c9cff" },
                            to: e.target.value
                          })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "select",
                        {
                          value: String(m.grad?.angle ?? 180),
                          title: "방향",
                          onChange: (e) => setMacroGrad(m.id, {
                            from: m.grad?.from || m.color || "#7c9cff",
                            to: m.grad?.to || "#ffffff",
                            angle: Number(e.target.value)
                          }),
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "180", children: "↓" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "0", children: "↑" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "90", children: "→" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "270", children: "←" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "135", children: "↘" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "45", children: "↗" })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "tokenmenu-item",
                        onClick: () => {
                          setMacroColor(m.id, "");
                          setMacroGrad(m.id, null);
                          setColorPick(null);
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "format_color_reset", size: 14 }),
                          " 색 없음"
                        ]
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "mk-macro-name" + (activeMacroId === m.id ? " on" : ""),
                    style: m.color ? { borderLeft: `3px solid ${m.color}`, paddingLeft: 7 } : void 0,
                    title: "누르면 적용 · 한 번 더 누르면 해제",
                    onClick: () => toggleMacro(m),
                    children: m.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "iconbtn",
                    style: { width: 24, height: 24 },
                    title: "이름 바꾸기",
                    onClick: async () => {
                      const n = await promptText({ title: "매크로 이름", defaultValue: m.name });
                      if (n != null) renameMacro(m.id, n);
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "edit", size: 14 })
                  }
                ),
                m.text && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "iconbtn",
                    "data-sfx": "none",
                    style: { width: 24, height: 24 },
                    title: "이 문구를 지금 보내기",
                    onClick: () => sendMacroNow(m),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "send", size: 14 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "iconbtn",
                    style: { width: 24, height: 24 },
                    title: m.pos ? "매크로 바로 되돌리기" : "화면에 꺼내 두기 (끌어서 자리 옮김)",
                    onClick: () => setMacroPos(m.id, m.pos ? null : nextFreeMacroSlot()),
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: m.pos ? "keyboard_return" : "open_in_full", size: 14 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "iconbtn",
                    style: { width: 24, height: 24 },
                    title: "삭제",
                    onClick: () => {
                      removeMacro(m.id);
                      forgetMacro(m.id);
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "delete", size: 14 })
                  }
                )
              ]
            },
            m.id
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn sm",
              style: { marginTop: 4 },
              onClick: async () => {
                if (!fmtActive(fmt) && !scriptMode) {
                  await alertDialog("저장할 꾸미기가 없습니다. 글자색·굵게 등 효과를 먼저 켜세요.");
                  return;
                }
                const name = await promptText({
                  title: "북마크 저장",
                  label: "지금 적용한 꾸미기를 이름 붙여 저장합니다",
                  defaultValue: "내 효과"
                });
                if (name == null) return;
                addMacro(name, fmt, scriptMode, void 0);
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { name: "bookmark_add", size: 14 }),
                " 현재 꾸미기 저장"
              ]
            }
          )
        ] })
      }
    )
  ] });
}
export {
  BgmPanel as B,
  Chat as C,
  DeckPanel as D,
  FlyMenu as F,
  HandoutPanel as H,
  MadnessEditor as M,
  ParticipantsPanel as P,
  SheetWindow as S,
  ChoicePanel as a,
  CharacterHub as b,
  SheetViewer as c,
  MarkupText as d,
  ProfileCard as e,
  HandoutPresentation as f,
  ClampedMenu as g,
  useThumb as u
};
