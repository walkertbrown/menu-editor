// Data access layer for the menu editor.
// Implementation: local JSON file at data/menus.json.
// Swapping to Supabase: implement same interface in a new file, change the import.
//
// saveMenu(menu, sections, items, opts?)
//   opts.snapshotLabel     — human label for the snapshot
//   opts.scopeSectionIds   — sections outside this set are preserved (scoped-merge mode)
//   opts.allowEmpty        — bypass the empty-save guard after user confirmation
//
//   Empty-save guard: if incoming scoped set is empty but store has content,
//   saveMenu throws EmptyMenuSaveError ('EMPTY_MENU_SAVE'). API maps to HTTP 409.
//   Snapshots always store the FULL merged state so restore is safe.
//
// The future Supabase adapter must honour the same opts interface.

import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  Menu,
  Section,
  Item,
  VersionSnapshot,
  StoreShape,
  RestaurantIdentity,
} from "./types";
import { mergeMenuSave } from "./mergeMenuSave";
import { seedData } from "./seed";

// ---- Error types --------------------------------------------------------

/**
 * Thrown by saveMenu when the incoming scoped set is empty but the store has
 * content for that scope and opts.allowEmpty is not set.
 * The API route maps this to HTTP 409.
 */
export class EmptyMenuSaveError extends Error {
  readonly code = "EMPTY_MENU_SAVE" as const;
  constructor(message = "Refusing to save: would erase all content on this side") {
    super(message);
    this.name = "EmptyMenuSaveError";
  }
}

// ---- File path ----------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "menus.json");

// ---- Low-level read / write --------------------------------------------

function readStore(): StoreShape {
  if (!fs.existsSync(DATA_FILE)) {
    // Bootstrap from seed on first read
    writeStore(seedData);
    return seedData;
  }
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw) as StoreShape;
}

function writeStore(store: StoreShape): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), "utf-8");
}

// ---- Data Access Interface ----------------------------------------------
// These are the functions the API routes and editor screens consume.
// Keep signatures stable — the Supabase adapter must match.

/** Returns all menus (without sections/items — use getMenu for full detail). */
export async function getMenus(): Promise<Menu[]> {
  const store = readStore();
  return store.menus;
}

/** Returns a single menu with its sections and items. */
export async function getMenu(
  id: string
): Promise<{ menu: Menu; sections: Section[]; items: Item[] } | null> {
  const store = readStore();
  const menu = store.menus.find((m) => m.id === id) ?? null;
  if (!menu) return null;
  const sections = store.sections
    .filter((s) => s.menuId === id)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const items = store.items
    .filter((i) => i.menuId === id)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return { menu, sections, items };
}

export interface SaveMenuOpts {
  /** Human-readable label for the version snapshot. */
  snapshotLabel?: string;
  /**
   * The canonical set of section ids that belong to this editing side.
   * When provided, sections/items whose id is NOT in this set are preserved
   * from the store (scoped-merge mode). When absent, the whole menu is
   * replaced (unscoped / full-replace mode — dinner and drinks).
   */
  scopeSectionIds?: string[];
  /**
   * When true, bypasses the empty-save guard and allows saving an empty
   * scoped set even if the store currently has content there.
   * Use after confirming with the user.
   */
  allowEmpty?: boolean;
}

/**
 * Saves a menu and its sections + items back to the store.
 *
 * When opts.scopeSectionIds is provided, performs a scoped merge:
 *   - Preserves sections/items outside the scope (the other side).
 *   - Replaces only in-scope sections/items with the incoming set.
 *   - Renumbers sortOrder and reconciles sectionOrder.
 *   - Snapshots the FULL merged state so restore is always safe.
 *
 * When opts.scopeSectionIds is absent, behaves like the original full-replace
 * (correct for dinner and drinks which load the whole menu).
 *
 * Throws EmptyMenuSaveError when the incoming scoped set is empty but the
 * store has content there, unless opts.allowEmpty is true.
 */
export async function saveMenu(
  menu: Menu,
  sections: Section[],
  items: Item[],
  opts?: SaveMenuOpts
): Promise<void> {
  const store = readStore();

  // Retrieve the current stored data for this menu.
  const storedMenu = store.menus.find((m) => m.id === menu.id) ?? menu;
  const storedSections = store.sections.filter((s) => s.menuId === menu.id);
  const storedItems = store.items.filter((i) => i.menuId === menu.id);

  // Run the scoped merge (or full-replace if no scope provided).
  const scopeSet = opts?.scopeSectionIds
    ? new Set(opts.scopeSectionIds)
    : undefined;

  const {
    sections: mergedSections,
    items: mergedItems,
    sectionOrder,
    blockedEmpty,
    spacingOverrides,
    categorySpacing,
    customCategories,
    spotCategories,
    spacingBaseline,
  } = mergeMenuSave(
    storedSections,
    storedItems,
    storedMenu,
    sections,
    items,
    menu,
    scopeSet
  );

  // Empty-save guard.
  if (blockedEmpty && !opts?.allowEmpty) {
    throw new EmptyMenuSaveError();
  }

  // Build the updated Menu record.
  const updatedMenu: Menu = {
    ...menu,
    sectionOrder,
    spacingOverrides,
    categorySpacing,
    customCategories,
    spotCategories,
    spacingBaseline,
    updatedAt: new Date().toISOString(),
  };

  // Update or insert menu record.
  const menuIdx = store.menus.findIndex((m) => m.id === menu.id);
  if (menuIdx === -1) {
    store.menus.push(updatedMenu);
  } else {
    store.menus[menuIdx] = updatedMenu;
  }

  // Write merged sections/items (everything outside this menu is untouched).
  store.sections = [
    ...store.sections.filter((s) => s.menuId !== menu.id),
    ...mergedSections,
  ];
  store.items = [
    ...store.items.filter((i) => i.menuId !== menu.id),
    ...mergedItems,
  ];

  // Snapshot the FULL merged state (not just the filtered half), so a restore
  // never wipes the other side.
  const snapshotLabel = opts?.snapshotLabel ?? new Date().toLocaleString();
  const snapshot: VersionSnapshot = {
    id: uuidv4(),
    menuId: menu.id,
    label: snapshotLabel,
    createdAt: new Date().toISOString(),
    data: { menu: updatedMenu, sections: mergedSections, items: mergedItems },
  };
  store.snapshots.push(snapshot);

  writeStore(store);
}

/** Returns the last N snapshots for a menu, newest first. */
export async function listSnapshots(
  menuId: string,
  limit = 10
): Promise<VersionSnapshot[]> {
  const store = readStore();
  return store.snapshots
    .filter((s) => s.menuId === menuId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}

// ---- Restaurant identity ------------------------------------------------

const DEFAULT_RESTAURANT: RestaurantIdentity = {
  houseName: "The Pelican Club",
  eyebrowLine: "New Orleans · Established 1990",
};

/** Returns the shared restaurant identity record. */
export async function getRestaurant(): Promise<RestaurantIdentity> {
  const store = readStore();
  return store.restaurant ?? DEFAULT_RESTAURANT;
}

/** Persists the restaurant identity record. */
export async function saveRestaurant(
  identity: RestaurantIdentity
): Promise<void> {
  const store = readStore();
  store.restaurant = identity;
  writeStore(store);
}

// ---- Sheet titles -------------------------------------------------------

/** Returns the sheet titles map (sheetId → human label). */
export async function getSheetTitles(): Promise<Record<string, string>> {
  const store = readStore();
  return store.sheetTitles ?? {};
}

/** Persists a single sheet's title. */
export async function saveSheetTitle(
  sheetId: string,
  title: string
): Promise<void> {
  const store = readStore();
  store.sheetTitles = { ...(store.sheetTitles ?? {}), [sheetId]: title };
  writeStore(store);
}

/** Restores a snapshot: replaces the live menu/sections/items with snapshot data. */
export async function restoreSnapshot(snapshotId: string): Promise<void> {
  const store = readStore();
  const snap = store.snapshots.find((s) => s.id === snapshotId);
  if (!snap) throw new Error(`Snapshot ${snapshotId} not found`);

  const { menu, sections, items } = snap.data;
  const menuId = menu.id;

  const menuIdx = store.menus.findIndex((m) => m.id === menuId);
  if (menuIdx === -1) {
    store.menus.push(menu);
  } else {
    store.menus[menuIdx] = { ...menu, updatedAt: new Date().toISOString() };
  }

  store.sections = [
    ...store.sections.filter((s) => s.menuId !== menuId),
    ...sections,
  ];
  store.items = [
    ...store.items.filter((i) => i.menuId !== menuId),
    ...items,
  ];

  writeStore(store);
}
