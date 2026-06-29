// Drinks menu: sections and menu definition.
// Real Pelican Club content — Drink Menu.html pipe-delimited source, June 2026.
// Items split into seed-drinks-wine.ts and seed-drinks-beer-cocktails.ts.
import type { Menu, Section } from "./types";

const now = new Date().toISOString();

export const drinksMenuId = "menu-drinks";

export const sSparkling: Section = {
  id: "sec-sparkling",
  menuId: drinksMenuId,
  name: "Sparkling",
  sortOrder: 0,
};
export const sWhiteRose: Section = {
  id: "sec-white-rose",
  menuId: drinksMenuId,
  name: "White & Rosé",
  sortOrder: 1,
};
export const sRedWine: Section = {
  id: "sec-red-wine",
  menuId: drinksMenuId,
  name: "Red",
  sortOrder: 2,
};
export const sBeer: Section = {
  id: "sec-beer",
  menuId: drinksMenuId,
  name: "Beer & Cider",
  sortOrder: 3,
};
export const sCocktails: Section = {
  id: "sec-cocktails",
  menuId: drinksMenuId,
  name: "Cocktails",
  sortOrder: 4,
};

export const drinksMenu: Menu = {
  id: drinksMenuId,
  name: "Drinks",
  sectionOrder: [
    sSparkling.id,
    sWhiteRose.id,
    sRedWine.id,
    sBeer.id,
    sCocktails.id,
  ],
  createdAt: now,
  updatedAt: now,
};
