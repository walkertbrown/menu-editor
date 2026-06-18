// After-Dinner / Spirits menu: sections and menu definition.
// Real Pelican Club content — Spirits PDF, June 2026.
// Items are split across seed-spirits-whiskey.ts, seed-spirits-scotch-vodka.ts,
// seed-spirits-gin-rum-tequila.ts, seed-spirits-xo-digestifs.ts,
// and seed-spirits-ports-coffees.ts.
import type { Menu, Section } from "./types";

const now = new Date().toISOString();

export const spiritsMenuId = "menu-spirits";

// ---- Sections (in display order) ----------------------------------------

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

export const sRum: Section = {
  id: "sec-rum",
  menuId: spiritsMenuId,
  name: "Rum",
  sortOrder: 5,
};

export const sTequilaMezcal: Section = {
  id: "sec-tequila-mezcal",
  menuId: spiritsMenuId,
  name: "Tequila & Mezcal",
  sortOrder: 6,
};

export const sXO: Section = {
  id: "sec-xo",
  menuId: spiritsMenuId,
  name: "XO Collection",
  sortOrder: 7,
};

export const sDigestifs: Section = {
  id: "sec-digestifs",
  menuId: spiritsMenuId,
  name: "Digestifs",
  sortOrder: 8,
};

export const sPort: Section = {
  id: "sec-port",
  menuId: spiritsMenuId,
  name: "Ports & Dessert Wines",
  sortOrder: 9,
};

export const sCoffees: Section = {
  id: "sec-coffees",
  menuId: spiritsMenuId,
  name: "Coffees",
  sortOrder: 10,
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
    sRum.id,
    sTequilaMezcal.id,
    sXO.id,
    sDigestifs.id,
    sPort.id,
    sCoffees.id,
  ],
  createdAt: now,
  updatedAt: now,
};
