// Dinner menu: sections and menu definition.
// Real Pelican Club content — Restaurant Week PDF, June 2026.
// Items are split into seed-dinner-starters.ts and seed-dinner-mains.ts.
import { v4 as uuidv4 } from "uuid";
import type { Menu, Section } from "./types";

const now = new Date().toISOString();

export const dinnerMenuId = "menu-dinner";

export const sToBegin: Section = {
  id: "sec-to-begin",
  menuId: dinnerMenuId,
  name: "To Begin",
  sortOrder: 0,
};
export const sAppsSalads: Section = {
  id: "sec-apps-salads",
  menuId: dinnerMenuId,
  name: "Appetizers & Salads",
  sortOrder: 1,
};
export const sEntrees: Section = {
  id: "sec-entrees",
  menuId: dinnerMenuId,
  name: "Entrées",
  sortOrder: 2,
};
export const sDesserts: Section = {
  id: "sec-desserts",
  menuId: dinnerMenuId,
  name: "Desserts",
  sortOrder: 3,
};
export const sBreadService: Section = {
  id: "sec-bread-service",
  menuId: dinnerMenuId,
  name: "Bread Service",
  sortOrder: 4,
};

/** Legacy alias — seed.ts imports sAppetizers */
export const sAppetizers = sAppsSalads;

export const dinnerMenu: Menu = {
  id: dinnerMenuId,
  name: "Dinner",
  sectionOrder: [
    sToBegin.id,
    sAppsSalads.id,
    sEntrees.id,
    sDesserts.id,
    sBreadService.id,
  ],
  furniture: {
    prixFixeHeader: "THREE COURSES $56 AND UP",
    introLines: [
      "(choice of appetizer or salad, main and dessert)",
      "à la carte prices listed next to each item",
      "add a soup $8",
    ],
    footerLine:
      "*gluten free available · menu subject to change · no separate checks · gratuity added to parties of 6 or more",
  },
  createdAt: now,
  updatedAt: now,
};
