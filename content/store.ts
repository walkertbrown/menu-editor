// Data access layer for the menu editor.
// Implementation: local JSON file at data/menus.json.
// Swapping to Supabase later means implementing the same interface
// in a new file and changing the import below — no other code changes.

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

// ---- File path ----------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "menus.json");

// ---- Low-level read / write --------------------------------------------

function readStore(): StoreShape {
  if (!fs.existsSync(DATA_FILE)) {
    // Bootstrap from seed on first read
    const { seedData } = require("./seed");
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

/**
 * Saves a menu and its sections + items back to the store.
 * Also creates a version snapshot.
 */
export async function saveMenu(
  menu: Menu,
  sections: Section[],
  items: Item[],
  snapshotLabel?: string
): Promise<void> {
  const store = readStore();

  // Update or insert menu
  const menuIdx = store.menus.findIndex((m) => m.id === menu.id);
  const updatedMenu: Menu = { ...menu, updatedAt: new Date().toISOString() };
  if (menuIdx === -1) {
    store.menus.push(updatedMenu);
  } else {
    store.menus[menuIdx] = updatedMenu;
  }

  // Replace sections for this menu
  store.sections = [
    ...store.sections.filter((s) => s.menuId !== menu.id),
    ...sections,
  ];

  // Replace items for this menu
  store.items = [
    ...store.items.filter((i) => i.menuId !== menu.id),
    ...items,
  ];

  // Create snapshot
  const snapshot: VersionSnapshot = {
    id: uuidv4(),
    menuId: menu.id,
    label: snapshotLabel ?? new Date().toLocaleString(),
    createdAt: new Date().toISOString(),
    data: { menu: updatedMenu, sections, items },
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
