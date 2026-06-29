// Desserts items for the After-Dinner menu (page 2, full-width feature).
// Real Pelican Club content — Dessert Menu.html, June 2026.
// Items are FoodItem (type: "food") so they carry name, description, price, gf.
import { v4 as uuidv4 } from "uuid";
import type { FoodItem } from "./types";
import { spiritsMenuId, sDesserts } from "./seed-spirits";

export const dessertItems: FoodItem[] = [
  {
    id: uuidv4(),
    type: "food",
    menuId: spiritsMenuId,
    sectionId: sDesserts.id,
    sortOrder: 0,
    name: "White Chocolate Bread Pudding",
    description: "white & dark chocolate sauces",
    price: "10",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: spiritsMenuId,
    sectionId: sDesserts.id,
    sortOrder: 1,
    name: "Coconut Cream Pie",
    description: "chocolate sauce, whipped cream",
    price: "10",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: spiritsMenuId,
    sectionId: sDesserts.id,
    sortOrder: 2,
    name: "Bourbon Pecan Pie",
    description: "chocolate sauce, ice cream",
    price: "10",
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: spiritsMenuId,
    sectionId: sDesserts.id,
    sortOrder: 3,
    name: "Flourless Chocolate Decadence Cake",
    description: "almonds",
    price: "10",
    gf: true,
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: spiritsMenuId,
    sectionId: sDesserts.id,
    sortOrder: 4,
    name: "Grand Marnier Crème Brûlée",
    description: "fresh fruit",
    price: "10",
    gf: true,
  },
  {
    id: uuidv4(),
    type: "food",
    menuId: spiritsMenuId,
    sectionId: sDesserts.id,
    sortOrder: 5,
    name: "Sorbet & Fresh Fruit",
    price: "10",
    gf: true,
  },
];
