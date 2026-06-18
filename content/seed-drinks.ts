// Sample data for the Drinks menu.
import { v4 as uuidv4 } from "uuid";
import type { Menu, Section, WineByGlassItem, BeerCiderItem, CocktailItem } from "./types";

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

export const wineItems: WineByGlassItem[] = [
  {
    id: uuidv4(),
    type: "wine_by_glass",
    menuId: drinksMenuId,
    sectionId: sSparkling.id,
    sortOrder: 0,
    name: "Chandon Brut",
    regionVintage: "California NV",
    price: "14",
    group: "Sparkling",
  },
  {
    id: uuidv4(),
    type: "wine_by_glass",
    menuId: drinksMenuId,
    sectionId: sSparkling.id,
    sortOrder: 1,
    name: "Pol Roger Brut Réserve",
    regionVintage: "Champagne, France NV",
    price: "22",
    group: "Sparkling",
  },
  {
    id: uuidv4(),
    type: "wine_by_glass",
    menuId: drinksMenuId,
    sectionId: sWhiteRose.id,
    sortOrder: 0,
    name: "Muscadet Sèvre et Maine",
    regionVintage: "Loire, France '24",
    price: "13",
    group: "White & Rosé",
  },
  {
    id: uuidv4(),
    type: "wine_by_glass",
    menuId: drinksMenuId,
    sectionId: sWhiteRose.id,
    sortOrder: 1,
    name: "Sancerre Blanc",
    regionVintage: "Loire, France '23",
    price: "18",
    group: "White & Rosé",
  },
  {
    id: uuidv4(),
    type: "wine_by_glass",
    menuId: drinksMenuId,
    sectionId: sWhiteRose.id,
    sortOrder: 2,
    name: "Domaines Ott Rosé",
    regionVintage: "Provence, France '24",
    price: "16",
    group: "White & Rosé",
  },
  {
    id: uuidv4(),
    type: "wine_by_glass",
    menuId: drinksMenuId,
    sectionId: sRedWine.id,
    sortOrder: 0,
    name: "Côtes du Rhône Rouge",
    regionVintage: "Rhône, France '22",
    price: "13",
    group: "Red",
  },
  {
    id: uuidv4(),
    type: "wine_by_glass",
    menuId: drinksMenuId,
    sectionId: sRedWine.id,
    sortOrder: 1,
    name: "Caymus Cabernet Sauvignon",
    regionVintage: "Napa Valley '22",
    price: "22",
    group: "Red",
  },
];

export const beerItems: BeerCiderItem[] = [
  {
    id: uuidv4(),
    type: "beer_cider",
    menuId: drinksMenuId,
    sectionId: sBeer.id,
    sortOrder: 0,
    name: "Abita Amber",
    price: "7",
  },
  {
    id: uuidv4(),
    type: "beer_cider",
    menuId: drinksMenuId,
    sectionId: sBeer.id,
    sortOrder: 1,
    name: "NOLA Blonde",
    price: "7",
  },
  {
    id: uuidv4(),
    type: "beer_cider",
    menuId: drinksMenuId,
    sectionId: sBeer.id,
    sortOrder: 2,
    name: "Athletic Brewing Run Wild IPA",
    price: "8",
    nonAlcoholic: true,
  },
  {
    id: uuidv4(),
    type: "beer_cider",
    menuId: drinksMenuId,
    sectionId: sBeer.id,
    sortOrder: 3,
    name: "Angry Orchard Crisp Apple",
    price: "8",
  },
];

export const cocktailItems: CocktailItem[] = [
  {
    id: uuidv4(),
    type: "cocktail",
    menuId: drinksMenuId,
    sectionId: sCocktails.id,
    sortOrder: 0,
    name: "The Pelican Old Fashioned",
    price: "16",
    ingredients: "Buffalo Trace, demerara, orange bitters, smoked orange peel",
  },
  {
    id: uuidv4(),
    type: "cocktail",
    menuId: drinksMenuId,
    sectionId: sCocktails.id,
    sortOrder: 1,
    name: "Garden District",
    nonAlcoholicAvailable: true,
    price: "15",
    ingredients: "gin, St-Germain, cucumber, mint, lemon, soda",
  },
  {
    id: uuidv4(),
    type: "cocktail",
    menuId: drinksMenuId,
    sectionId: sCocktails.id,
    sortOrder: 2,
    name: "French Quarter Sling",
    price: "15",
    ingredients: "rum, Campari, pineapple, lime, Peychaud's",
  },
  {
    id: uuidv4(),
    type: "cocktail",
    menuId: drinksMenuId,
    sectionId: sCocktails.id,
    sortOrder: 3,
    name: "Espresso Martini",
    price: "16",
    ingredients: "vodka, cold brew, Kahlúa, vanilla, espresso foam",
  },
];

export const drinksMenu: Menu = {
  id: drinksMenuId,
  name: "Drinks",
  sectionOrder: [sSparkling.id, sWhiteRose.id, sRedWine.id, sBeer.id, sCocktails.id],
  createdAt: now,
  updatedAt: now,
};
