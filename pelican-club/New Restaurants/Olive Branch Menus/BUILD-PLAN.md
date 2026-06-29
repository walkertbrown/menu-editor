# Olive Branch — Editable Program · Build Plan

Turn the finished Olive Branch design into a **client-only, localStorage-backed editable
program** the restaurant runs themselves. The hard part is the auto-spacing; everything else
is plumbing.

## Requirements (locked)
- **Client-only, offline, no login.** Ships as a self-contained build (single HTML / static
  bundle) they open in any browser — Mac or Windows. No `.exe`, no code-signing.
- **Pre-seeded** with all their sections + items (data already extracted — see the
  `renderVals()` block in `Olive Branch Trifold (Kraft).dc.html`).
- **localStorage store.** Add an item → saved locally. Remove an item → it moves to a
  **sidebar parking lot**, draggable back onto the menu. Drag to reorder.
- **Auto-spacing** that self-balances on every change.
- **Initial render must match the screenshots exactly.**
- **Color / B&W toggle**, both exportable via `window.print()` → Save as PDF.
- **Optional backup to ServerMac** when online (tiny POST endpoint, per-restaurant key) —
  also the channel for pushing critical fixes. (Feature updates/redesigns are paid.)

## Architecture
- **New client-only app** built from the Olive Branch HTML design (do NOT fork the Next.js
  Pelican app — we want single-file/offline, and the design is already HTML/CSS).
- Store = localStorage (mirror the swappable-store interface: get/save/list). Seed on first run.
- Sidebar = the set of items not currently placed in a section. Drag between sidebar ↔ menu.
- Drag/reorder: a small lib (SortableJS) or the existing dnd approach.
- Print/PDF: `window.print()`; color/B&W = a CSS palette class on the root.

## The keystone: auto-spacing engine
Each page region (a page column / trifold panel) is a fixed-height container of sections
(each section = header + items). On first render AND on every add/remove/reorder:
1. Lay out at **base gaps**.
2. Measure content height `H` vs container height `C`.
3. If `H ≤ C`: distribute leftover `L = C − H` into the gaps, **weighted by type**
   (section↔section gap > item↔item gap > header↔first-item). `gap_i += L · w_i / Σw`.
4. If `H > C` (overflow): shrink to **min gaps**; if still over, reflow the last section(s)
   to the next page/column (multi-page) or apply a small region scale (fixed panel). Define
   per layout.
5. Re-run on every change so it always self-balances.

**Exact-match method:** tune the base gaps + weights so step 3's output for the SEED content
reproduces the screenshots. **Verify with Puppeteer** (already a devDependency): render →
screenshot → compare to the PNG designs → adjust weights → repeat until pixel-close. This is
how "auto-correct" and "looks exactly like the screenshot" coexist.

## Build sequence
1. **Static exact render** of one page (e.g. Page 2) from seed data — match screenshot pixel-close.
2. **localStorage store** + seed-on-first-run.
3. **Auto-spacing engine** + Puppeteer screenshot-diff loop until seed = screenshot.
4. **Drag / add / remove + sidebar parking lot.**
5. Color/B&W toggle + print/PDF for all pages + trifold.
6. Single-file build + optional ServerMac backup sync.

## Open decisions
- Reorder lib: SortableJS vs reuse dnd-kit pattern.
- Overflow behavior per layout (reflow vs scale).
- Single-file bundling tool (e.g. vite + singlefile plugin).

## Content fixes
Tracked separately in `MENU-FIXES.md` — do those AFTER the editor works.
