// After-Dinner / Spirits menu: sections and menu definition.
// Real Pelican Club content — Spirits PDF, June 2026.
// Items are split across seed-spirits-whiskey.ts, seed-spirits-scotch-vodka.ts,
// seed-spirits-gin-rum-tequila.ts, seed-spirits-xo-digestifs.ts,
// seed-spirits-ports-coffees.ts, and seed-spirits-desserts.ts.
import type { Menu, Section } from "./types";

const now = new Date().toISOString();

export const spiritsMenuId = "menu-spirits";

// ---- Sections (in display order, sortOrder matches render sequence) ------
// Page 1 — Spirits List: Whiskey & Bourbon (0), Rye (1), Scotch (2), Vodka (3), Gin (4)
// Page 2 — After Dinner: Desserts (5) [full-width], Rum (6), Tequila (7),
//           Ports (8) [left col], XO (9), Digestifs (10), Coffees (11) [right col]

export const sWhiskeyBourbon: Section = {
  id: "sec-whiskey-bourbon",
  menuId: spiritsMenuId,
  name: "Whiskey & Bourbon",
  sortOrder: 0,
};

export const sRye: Section = {
  id: "sec-rye",
  menuId: spiritsMenuId,
  name: "Rye",
  sortOrder: 1,
};

export const sScotch: Section = {
  id: "sec-scotch",
  menuId: spiritsMenuId,
  name: "Scotch",
  sortOrder: 2,
};

export const sVodka: Section = {
  id: "sec-vodka",
  menuId: spiritsMenuId,
  name: "Vodka",
  sortOrder: 3,
};

export const sGin: Section = {
  id: "sec-gin",
  menuId: spiritsMenuId,
  name: "Gin",
  sortOrder: 4,
};

// Page 2 ---------------------------------------------------------------

export const sDesserts: Section = {
  id: "sec-spirits-desserts",
  menuId: spiritsMenuId,
  name: "Desserts",
  sortOrder: 5,
};

export const sRum: Section = {
  id: "sec-rum",
  menuId: spiritsMenuId,
  name: "Rum",
  sortOrder: 6,
};

export const sTequilaMezcal: Section = {
  id: "sec-tequila-mezcal",
  menuId: spiritsMenuId,
  name: "Tequila & Mezcal",
  sortOrder: 7,
};

export const sPort: Section = {
  id: "sec-port",
  menuId: spiritsMenuId,
  name: "Ports & Dessert Wines",
  sortOrder: 8,
  subtitle: "2½ oz glass · full bottle",
};

export const sXO: Section = {
  id: "sec-xo",
  menuId: spiritsMenuId,
  name: "XO Collection",
  sortOrder: 9,
  subtitle: "two-ounce pours",
};

export const sDigestifs: Section = {
  id: "sec-digestifs",
  menuId: spiritsMenuId,
  name: "Digestifs",
  sortOrder: 10,
  subtitle: "two-ounce pours",
};

export const sCoffees: Section = {
  id: "sec-coffees",
  menuId: spiritsMenuId,
  name: "Coffees",
  sortOrder: 11,
};

// ---- Menu definition ----------------------------------------------------

export const spiritsMenu: Menu = {
  id: spiritsMenuId,
  name: "After-Dinner / Spirits",
  sectionOrder: [
    sWhiskeyBourbon.id,
    sRye.id,
    sScotch.id,
    sVodka.id,
    sGin.id,
    sDesserts.id,
    sRum.id,
    sTequilaMezcal.id,
    sPort.id,
    sXO.id,
    sDigestifs.id,
    sCoffees.id,
  ],
  createdAt: now,
  updatedAt: now,
};
