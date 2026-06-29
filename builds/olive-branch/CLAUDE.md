# builds/olive-branch — Olive Branch Café editor

The FIRST menu build, and the **template** every other build is copied from. Vite + React + TS,
client-only, localStorage + ServerMac backup. See the repo-root `CLAUDE.md` and `PLAYBOOK.md`.

## Run / build / package
- Dev (over Tailscale): `npm run dev` → http://100.107.152.109:5173 (host:true, allowedHosts:true).
- Production build: `npm run build` → `dist/`.
- Package single file: `node package-single.cjs "<id>" "<Name>" "https://servermac.tailaad45c.ts.net/menus"`
  → `package/<Name> Menu Editor.html` (inlines JS as base64 data: module + CSS + logo; injects
  `window.OB_CONFIG`). Deliverable zip in `package/`.
- Verify: the `_*.cjs` puppeteer scripts (structure/content only — trust Walker's browser for spacing/drag).

## What's here (reusable pieces for future builds)
- `src/Editable.tsx` — click-to-edit text (commits on blur/Enter).
- `src/App.tsx` — drag/add/remove machinery (`ItemRow`, `SectionBlock`, `PairBlock`, `ParkedSidebar`),
  the dine-in auto-fit (gap distribution) and per-page handlers. Trifold is its OWN dataset
  (un-synced from the dine-in menu) — see `state.trifold` in `src/store.ts`.
- `src/Trifold.tsx` — `TrifoldInside` (3-panel, font-scale `--fs` auto-fit) + `TrifoldOutside`
  (Visit/Cater/Cover) + `TriBuild` (compact Build-Your-Own grid).
- `src/StaticPages.tsx` — Cover/Back (drag-to-nudge blocks) + `Page3Extras` (Build-Your-Own grid).
- `src/config.ts` + `src/backup.ts` — read `window.OB_CONFIG`; push/pull to ServerMac. Save writes
  localStorage + server; offline → pending flag, retries on reconnect/load; new device → pulls.
- `src/data.ts` — Olive Branch content (SECTIONS, BUILD, COVER, BACK, TRIFOLD_OUTSIDE).
- `package-single.cjs` — the packager.

## Gotchas
- Trifold auto-fit scales font to fill the panel, so **raising base font does nothing** — shrink
  content height instead. Panel children need `flex-shrink:0` or they squish & overlap.
- `.tid` (description) must be `display:block` or it inherits a tall line-box strut (~10px gap).
- Pages: dine-in 816×1344 (legal); trifold sheet 1056×816 (landscape letter). Print uses dynamic
  `@page` via `printMenu()`.
