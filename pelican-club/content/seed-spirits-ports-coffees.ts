// Ports & Dessert Wines and Coffees items for the After-Dinner / Spirits menu.
// Real Pelican Club content — Spirits PDF, June 2026.
import { v4 as uuidv4 } from "uuid";
import type { SpiritListItem, CocktailItem } from "./types";
import { spiritsMenuId, sPort, sCoffees } from "./seed-spirits";

export const portItems: SpiritListItem[] = [
  // ---- Ports & Dessert Wines (2½ oz glass · full bottle) ------------------
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 0,
    name: "Warre's Warrior",
    binNumber: "61",
    glasPrice: "9",
    bottlePrice: "52",
    group: "Ports & Dessert Wines",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 1,
    name: "Croft Purple Velvet",
    binNumber: "119",
    glasPrice: "10",
    bottlePrice: "52",
    group: "Ports & Dessert Wines",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 2,
    name: "Warre's Otima 10 Year Tawny",
    binNumber: "115",
    glasPrice: "11",
    bottlePrice: "62",
    group: "Ports & Dessert Wines",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 3,
    name: "Warre's Late Bottled Vintage '08",
    binNumber: "121",
    glasPrice: "11",
    bottlePrice: "85",
    group: "Ports & Dessert Wines",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 4,
    name: "Barbadillo Pedro Ximénez Sherry",
    binNumber: "182",
    glasPrice: "16",
    bottlePrice: "64",
    group: "Ports & Dessert Wines",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 5,
    name: "Château Laribotte Sauternes, Bordeaux France '19",
    binNumber: "100",
    glasPrice: "12",
    bottlePrice: "58",
    group: "Ports & Dessert Wines",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 6,
    name: "Royal Tokaji 5 Puttonyos Aszú, Hungary '17",
    binNumber: "295",
    glasPrice: "16",
    bottlePrice: "118",
    group: "Ports & Dessert Wines",
  },
];

export const coffeeItems: CocktailItem[] = [
  // ---- Coffees ------------------------------------------------------------
  {
    id: uuidv4(),
    type: "cocktail",
    menuId: spiritsMenuId,
    sectionId: sCoffees.id,
    sortOrder: 0,
    name: "Irish Coffee",
    ingredients:
      "Tullamore D.E.W., brown sugar simple syrup, coffee, whipped cream",
    price: "13",
  },
  {
    id: uuidv4(),
    type: "cocktail",
    menuId: spiritsMenuId,
    sectionId: sCoffees.id,
    sortOrder: 1,
    name: "Nutella Coffee",
    ingredients:
      "Frangelico, Meletti chocolate liquor, coffee, whipped cream, cocoa powder",
    price: "13",
  },
];
