# Menu Editor — project memory (READ FIRST)

This repo is the home for Walker's **restaurant menu-redesign business**. Walker (GM of the
independent Pelican Club; AI-native builder) redesigns a restaurant's menu by hand, then has
Claude Code turn that design into an **editable, backed-up, printable** single-file app to hand
the restaurant. The bespoke design is his; Claude does the editing/saving/printing plumbing.

**The full build process is in [`PLAYBOOK.md`](./PLAYBOOK.md) — read it before doing a build.**

## Repo layout
```
/                     ← this file (main memory) + PLAYBOOK.md
pelican-club/         ← the original Next.js "menu-editor" app + design sources
                        (New Restaurants/… holds the .dc.html reference designs)
builds/               ← one folder per restaurant menu we make editable
  olive-branch/       ← FIRST build: the Vite+React editor app. This is the TEMPLATE
                        other builds are copied from. See builds/olive-branch/CLAUDE.md.
server/               ← menu-save-server: backs up each menu to ServerMac (Node, no deps)
site/                 ← marketing-site draft (brand placeholder "Fresh Sheet"; parked)
```

## The loop (per restaurant)
1. Walker redesigns the menu → hands over **labeled HTML files** (one per sheet: "Dinner front",
   "Dinner back", "Brunch front"…) + restaurant name + notes (paper size, anything unusual).
2. Claude builds the editable app under `builds/<name>/` (copy `builds/olive-branch` as the base;
   lift the design CSS, one sheet → one tab, reuse `Editable`, sortable item/section,
   `ParkedSidebar`, `backup.ts`, `package-single.cjs`).
3. A **tester subagent** drives the build headless and reports PASS/FAIL (content + controls +
   print + backup — NOT spacing/drag; headless renders fonts tall & can't sim dnd-kit drags).
4. Walker final-reviews in his real browser.

## Backup infrastructure (shared)
- Start server (no sudo): `bash server/start.sh` (port 9120, data in `server/data/`).
- Expose on Funnel (sudo, Walker runs once / after reboot — no domain needed):
  `sudo tailscale funnel --bg --set-path /menus 9120` → `https://servermac.tailaad45c.ts.net/menus`.
  Verify: `curl https://servermac.tailaad45c.ts.net/menus/api/health`.
- Per restaurant gets a unique `restaurantId` (the only key on its data) recorded in
  `server/<slug>.id`. See `server/SETUP.md`.

## Status
- **Olive Branch Café** — DONE. Deliverable: `builds/olive-branch/package/`. Backup id in
  `server/olive-branch.id`. Editor runs over Tailscale: `cd builds/olive-branch && npm run dev`
  → http://100.107.152.109:5173.
- **Bacchus** (Mississippi upscale seafood; Regular + Brunch, two-sided sheets) — NEXT. Walker
  will redesign it; current photos are content-source only. Likely two deliverables.

## Notes
- Headless puppeteer lies about spacing and can't drag — **Walker's browser is the source of truth**.
- localStorage on a `file://` deliverable is fragile (per-file/browser, Safari may not persist) —
  the ServerMac backup is the durable copy; the app also offers Download/Load backup + Restore.
- There is also a home-level Claude auto-memory (`~/.claude/projects/-home-elizabethcorley/memory/`)
  with Walker's broader profile/projects; `project_menu_business.md` there mirrors this.
