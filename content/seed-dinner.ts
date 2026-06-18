// Sample data for the Dinner menu.
import { v4 as uuidv4 } from "uuid";
import type { Menu, Section, FoodItem } from "./types";

const now = new Date().toISOString();

export const dinnerMenuId = "menu-dinner";

export const sAppetizers: Section = {
  id: "sec-appetizers",
  menuId: dinnerMenuId,
  name: "Appetizers",
  sortOrder: 0,
};
export const sEntrees: Section = {
  id: "sec-entrees",
  menuId: dinnerMenuId,
  name: "Entrées",
  sortOrder: 1,
};
export const sDesserts: Section = {
  id: "sec-desserts",
  menuId: dinnerMenuId,
  name: "Desserts",
  sortOrder: 2,
};

export const dinnerItems: FoodItem[] = [
  // Appetizers
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sAppetizers.id,
    sortOrder: 0,
    name: "GULF SHRIMP REMOULADE",
    price: "18",
    gf: true,
    description: "chilled gulf shrimp, housemade creole remoulade, pickled celery",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sAppetizers.id,
    sortOrder: 1,
    name: "ROASTED BEET SALAD",
    price: "14",
    gf: true,
    description: "local beets, goat cheese, candied pecans, balsamic reduction",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sAppetizers.id,
    sortOrder: 2,
    name: "FRENCH ONION SOUP",
    price: "12",
    description: "caramelized onion broth, gruyère crouton",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sAppetizers.id,
    sortOrder: 3,
    name: "OYSTERS ON THE HALF SHELL",
    price: "21",
    gf: true,
    surcharge: "(+5)",
    description: "gulf oysters, mignonette, cocktail sauce, lemon",
  },
  // Entrées
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sEntrees.id,
    sortOrder: 0,
    name: "FILET MIGNON",
    price: "52",
    gf: true,
    description: "8oz center-cut filet, bordelaise, truffle potato gratin",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sEntrees.id,
    sortOrder: 1,
    name: "LOUISIANA DRUM",
    price: "38",
    gf: true,
    description: "pan-roasted black drum, crawfish étouffée, jasmine rice",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sEntrees.id,
    sortOrder: 2,
    name: "DUCK CONFIT",
    price: "34",
    description: "whole leg confit, dirty rice, andouille-red wine jus",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sEntrees.id,
    sortOrder: 3,
    name: "MUSHROOM RISOTTO",
    price: "28",
    gf: true,
    description: "wild mushroom blend, parmesan, truffle oil, herb oil",
  },
  // Desserts
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sDesserts.id,
    sortOrder: 0,
    name: "BANANAS FOSTER",
    price: "12",
    description: "tableside preparation, brown sugar, rum, vanilla ice cream",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sDesserts.id,
    sortOrder: 1,
    name: "CHOCOLATE LAVA CAKE",
    price: "10",
    description: "warm valrhona chocolate cake, salted caramel, chantilly",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: dinnerMenuId,
    sectionId: sDesserts.id,
    sortOrder: 2,
    name: "CRÈME BRÛLÉE",
    price: "9",
    gf: true,
    description: "classic vanilla custard, torched demerara",
  },
];

export const dinnerMenu: Menu = {
  id: dinnerMenuId,
  name: "Dinner",
  sectionOrder: [sAppetizers.id, sEntrees.id, sDesserts.id],
  furniture: {
    prixFixeHeader: "$56 & UP",
    introLines: ["Three courses · Chef's selection available"],
    footerLine:
      "Add a soup $8 · Consuming raw or undercooked foods may increase your risk of foodborne illness.",
  },
  createdAt: now,
  updatedAt: now,
};
