// localStorage-backed store. The saved state IS the "starting point."
// Load renders it exactly; edits live in memory; Save commits a new baseline.

import {
  SECTIONS,
  BUILD,
  COVER,
  BACK,
  TRIFOLD_OUTSIDE,
  PAGE2_SECTION_IDS,
  PAGE3_SECTION_IDS,
  type BuildData,
  type CoverData,
  type BackData,
  type TrifoldOutsideData,
  type Item,
  type Section,
} from './data';

const KEY = 'olive-branch-menu-v1';

/** The To-Go trifold is INDEPENDENT of the dine-in menu — its own sections,
 *  parking lot, and Build block. Seeded as a copy, then edited separately. */
export type TrifoldData = {
  sections: Record<string, Section>;
  parked: Item[];
  build: BuildData;
  /** Outside sheet (Visit Us / We Cater / Cover) editable text. */
  outside: TrifoldOutsideData;
};

export type MenuState = {
  sections: Record<string, Section>;
  /** Section order per editable page: keys 'food' (page 2) and 'special' (page 3). */
  pageOrders: Record<string, string[]>;
  /** Removed items, waiting in the sidebar (draggable back onto the menu). */
  parked: Item[];
  /** Build Your Own block (editable prices / toppings). */
  build: BuildData;
  /** Cover & Back pages (editable text + reorderable blocks). */
  cover: CoverData;
  back: BackData;
  /** Independent To-Go trifold data (not synced with the dine-in menu above). */
  trifold: TrifoldData;
  /** Frozen per-block bottom gaps (px) from the auto-fill engine; committed on Save.
   *  Keyed by block id (section id, or 'build' / 'bevdess'). Absent → design default. */
  gaps?: Record<string, number>;
};

function uid(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return 'id-' + Math.random().toString(36).slice(2);
  }
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x)) as T;
}

function defaultOrders(): Record<string, string[]> {
  return { food: [...PAGE2_SECTION_IDS], special: [...PAGE3_SECTION_IDS] };
}

// Ensure every item has a stable id (needed for drag) and orders exist.
function normalize(s: MenuState): MenuState {
  if (!s.sections) s.sections = {};
  // ensure all default sections exist (migrates older saves that predate new sections)
  for (const [id, sec] of Object.entries(SECTIONS)) if (!s.sections[id]) s.sections[id] = clone(sec);
  for (const sec of Object.values(s.sections)) for (const it of sec.items) if (!it.id) it.id = uid();
  if (!s.parked) s.parked = [];
  for (const it of s.parked) if (!it.id) it.id = uid();
  if (!s.pageOrders) s.pageOrders = defaultOrders();
  if (!s.pageOrders.food?.length) s.pageOrders.food = [...PAGE2_SECTION_IDS];
  if (!s.pageOrders.special?.length) s.pageOrders.special = [...PAGE3_SECTION_IDS];
  // beverages & desserts render as one locked "bevpair" unit — drop any standalone entries
  s.pageOrders.special = s.pageOrders.special.filter((id) => id !== 'beverages' && id !== 'desserts');
  for (const id of PAGE3_SECTION_IDS) if (!s.pageOrders.special.includes(id)) s.pageOrders.special.push(id);
  if (!s.build) s.build = clone(BUILD);
  if (!s.cover) s.cover = clone(COVER);
  if (!s.cover.order?.length) s.cover.order = [...COVER.order];
  if (!s.cover.offsets) s.cover.offsets = {};
  if (!s.back) s.back = clone(BACK);
  if (!s.back.order?.length) s.back.order = [...BACK.order];
  if (!s.back.offsets) s.back.offsets = {};
  // Trifold: independent copy of the dine-in data. Seed once from the current
  // (already-normalized) sections/build, then it lives its own life. Its items
  // get FRESH ids so nothing it does can touch the dine-in menu, and vice versa.
  if (!s.trifold) {
    s.trifold = { sections: clone(s.sections), parked: [], build: clone(s.build), outside: clone(TRIFOLD_OUTSIDE) };
    for (const sec of Object.values(s.trifold.sections)) for (const it of sec.items) it.id = uid();
  }
  if (!s.trifold.sections) s.trifold.sections = clone(s.sections);
  for (const [id, sec] of Object.entries(SECTIONS))
    if (!s.trifold.sections[id]) { s.trifold.sections[id] = clone(sec); for (const it of s.trifold.sections[id].items) it.id = uid(); }
  for (const sec of Object.values(s.trifold.sections)) for (const it of sec.items) if (!it.id) it.id = uid();
  if (!s.trifold.parked) s.trifold.parked = [];
  for (const it of s.trifold.parked) if (!it.id) it.id = uid();
  if (!s.trifold.build) s.trifold.build = clone(s.build);
  if (!s.trifold.outside) s.trifold.outside = clone(TRIFOLD_OUTSIDE);
  return s;
}

export function seed(): MenuState {
  return normalize({
    sections: clone(SECTIONS),
    pageOrders: defaultOrders(),
    parked: [],
    build: clone(BUILD),
    cover: clone(COVER),
    back: clone(BACK),
  } as Partial<MenuState> as MenuState);
}

export function load(): MenuState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw) as MenuState);
  } catch {
    /* corrupt or unavailable — fall back to seed */
  }
  return seed();
}

export function save(state: MenuState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

/** True if this browser already holds a saved menu (don't clobber it with a pull). */
export function hasLocal(): boolean {
  try { return !!localStorage.getItem(KEY); } catch { return false; }
}

/** Adopt an externally-sourced state (server restore or loaded backup file):
 *  migrate it through normalize, persist it, and hand it back for setState. */
export function adopt(raw: MenuState): MenuState {
  const n = normalize(clone(raw));
  save(n);
  return n;
}
