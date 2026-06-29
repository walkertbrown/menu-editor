# Menu Editor — Build Playbook

The single reference for turning Walker's redesigned restaurant menus into editable,
backed-up, printable single-file apps. If a fresh Claude session reads only this file,
it should be able to run the whole loop.

---

## The deal (what we're doing, and what we're NOT)

Walker runs a service: he **redesigns** a restaurant's menu (the bespoke craft — his look,
their format) and hands the design to Claude Code as **HTML**. Claude makes it **editable**
(owner can change prices/items/text, drag to reorder, add/remove), **backed up** to ServerMac,
and **printable**, then packages it as one self-contained `.html` file to hand the restaurant.

- The **design stays Walker's** — every restaurant looks different and keeps their own format
  (two-sided sheet, book, trifold, whatever). We never template the look.
- We do **NOT** build a generic auto-engine or a theme picker. Each menu is assembled by hand
  from reusable parts. An afternoon per restaurant is fine.
- Claude's job is the **plumbing**: editing, drag, add/remove, save, backup, print, packaging.

## The loop

1. **Walker → Claude:** labeled HTML file(s), one per menu side/sheet, named plainly:
   `Dinner front.html`, `Dinner back.html`, `Brunch front.html`, … + the restaurant name +
   any notes (paper size, anything unusual).
2. **Claude builds** the editable app from those files (steps below).
3. **Tester agent** drives the built app and verifies it against the source HTML (checklist below),
   then calls out PASS/FAIL with specifics.
4. **Walker** gives it a final once-over in his browser.

---

## What Walker provides per restaurant

- One HTML file per **sheet/side**, each clearly labeled.
- Restaurant **name**.
- Notes: paper size if not letter, two menus vs one, any block that isn't just a list of items.

## Per-restaurant decisions to confirm before building

- **Format & sheets:** how many sheets/sides, and each sheet's paper size (→ print `@page`).
- **One file or several:** menus that print separately (e.g. Dinner + Brunch) → usually separate
  deliverables, each with its own backup id. One menu, multiple sheets → one file, one tab per sheet.
- **Special blocks present?** (see kit of parts) — tells us if it's a pure drop-in or needs one block wired.
- **Generate a unique `restaurantId`** and record it (see Backup & ship).

---

## How Claude builds it (mechanics)

Base project = this repo (`builds/olive-branch`, Vite + React + TS). Reuse it as the template.
The heavy, reusable machinery is already built — per restaurant you mostly **lift CSS + structure
the sheets + map the content**.

1. **Lift the design CSS verbatim** from Walker's HTML into a `*.css` (pixel-faithful by construction).
   Keep the design's classes; don't restyle.
2. **One "sheet" per labeled HTML file** → one page/tab in the editor. The tab label = the file's
   label ("Dinner · Front"). Sheet dimensions come from the design.
3. **Extract content into the data model** (`data.ts`): sections → items `{ id, n, p, d?, … }`.
   Items get stable ids (`crypto.randomUUID`).
4. **Wire the reusable editable pieces** (already exist — reuse, don't rewrite):
   - `Editable.tsx` — click-to-edit text (commits on blur/Enter).
   - Sortable item row + droppable section (see `App.tsx` `ItemRow`/`SectionBlock`/`TriItem`/`TriSection`)
     — drag-reorder, move between sections, the `× → parking lot`, `+ New item`.
   - `ParkedSidebar` — the per-menu parking lot.
5. **Print sizing:** `printMenu()` sets `@page` per the current sheet (landscape vs portrait, paper
   size). Add the restaurant's sizes there.
6. **Backup config:** packaging injects `window.OB_CONFIG = { backupUrl, restaurantId, restaurantName }`.
   `config.ts` reads it; `backup.ts` does push/pull. In dev (no OB_CONFIG) backup is off.
7. **Auto-fit (optional):** the "compress/expand to fill the sheet" engine is format-specific. Reuse
   if the format matches; otherwise tune it or leave it off and let Walker's spacing stand.

### Conventions the editable pieces key on
- `.section` (with `.sec-title`, optional `.sec-note`) = a draggable section + droppable container.
- `.item` (with `.item-name`, `.item-price`, `.item-desc`) = a draggable/removable item; its
  name/price/desc are editable.
- If Walker's design uses these class names, wiring is fast. If his markup differs, either rename in
  his HTML or adapt the components — the look is unaffected either way.

---

## Kit of parts (reusable blocks — grow this over time)

Most of a menu is plain sections of items. The extras below recur; build each once, reuse after.

- **Plain section of items** — name / price / description. (Automatic.)
- **Multi-price item** — Half/Dozen, Lg/Sm, by-size. Item holds more than one labeled price.
  (Olive Branch salads did Lg/Sm; Bacchus oysters do Half/Dozen.)
- **Item icons/tags** — spicy 🌶, "RAW", cooked-to-order ○, etc. Toggle per item; show/hide in print
  as the design dictates.
- **Section note** — e.g. "served with choice of side." (Already supported.)
- **Callout box** — a highlighted text block (e.g. "Endless Mimosas," a sourcing badge).
- **Label–value key** — e.g. Bacchus "Seafood Sourcing" (SHRIMP — Domestic …).
- **Build-Your-Own price grid** — size headers + per-size prices + topping/sauce lists.
  (Built for Olive Branch — see `StaticPages.tsx` `Page3Extras` and `Trifold.tsx` `TriBuild`.)

---

## Backup & ship (mechanical — already built)

- **Backup server:** `server/` (Node, no deps). Start (no sudo):
  `bash server/start.sh` (port 9120). Funnel mount (sudo, Walker runs once / after reboot):
  `sudo tailscale funnel --bg --set-path /menus 9120` → `https://servermac.tailaad45c.ts.net/menus`.
  Verify: `curl https://servermac.tailaad45c.ts.net/menus/api/health`. See `server/SETUP.md`.
- **Generate id + package:** from `builds/olive-branch` after `npm run build`:
  `node package-single.cjs "<unique-id>" "<Restaurant Name>" "https://servermac.tailaad45c.ts.net/menus"`
  → `package/<Name> Menu Editor.html` (JS/CSS/logo inlined; OB_CONFIG injected). Record the id
  (e.g. `server/<slug>.id`). Use a hard-to-guess id — it's the only key on that data.
- **Deliverable:** zip the `.html` + a restaurant-facing `READ ME FIRST.txt` (copy/adapt the
  Olive Branch one in `package/`).

---

## QA — the tester agent (run after every build)

Spawn a subagent (general-purpose / Explore) to drive the built app headless (puppeteer in this
project) and report PASS/FAIL with specifics. Checklist:

1. **Content fidelity:** every section and item from the source HTML is present — count sections/items,
   spot-check names, prices (incl. multi-price), descriptions. Flag anything missing or altered.
2. **Sheets/tabs:** correct number of tabs; each renders; labels match the files.
3. **Editing:** a text edit commits and persists.
4. **Structure controls:** drag grips present on items, `×`/parking lot present, `+ New item` works.
5. **Special blocks:** multi-price, icons, callouts, label-value keys render correctly.
6. **Print:** `@page` size correct per sheet; B&W toggle works; Save PDF produces the page.
7. **Backup:** OB_CONFIG present; if the server is up, a Save round-trips to it.
8. **Clean console:** no errors (ignore favicon 404).

### Hard caveats for the tester (and everyone)
- **Headless renders fonts TALL and CANNOT simulate dnd-kit pointer drags.** So the tester verifies
  *structure, content, presence of controls, console* — NOT pixel spacing and NOT that a drag visually
  reorders. **Walker's real browser is the source of truth for spacing and drag.**

---

## Then Walker reviews in his browser, and we ship.
