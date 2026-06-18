// Assembles all per-menu seed data into a single StoreShape.
// Dinner: seed-dinner.ts (sections/menu) + seed-dinner-starters.ts + seed-dinner-mains.ts
// Drinks: seed-drinks.ts (sections/menu) + seed-drinks-wine.ts + seed-drinks-beer-cocktails.ts
// Spirits: seed-spirits.ts (unchanged placeholder)
import type { StoreShape } from "./types";
import {
  dinnerMenu,
  sToBegin,
  sAppetizers,
  sEntrees,
  sDesserts,
  sBreadService,
} from "./seed-dinner";
import { dinnerStarterItems } from "./seed-dinner-starters";
import { dinnerMainItems } from "./seed-dinner-mains";
import {
  drinksMenu,
  sSparkling,
  sWhiteRose,
  sRedWine,
  sBeer,
  sCocktails,
} from "./seed-drinks";
import { wineItems } from "./seed-drinks-wine";
import { beerItems, cocktailItems } from "./seed-drinks-beer-cocktails";
import {
  spiritsMenu,
  sRum,
  sTequilaMezcal,
  sXO,
  sDigestifs,
  sPort,
  spiritItems,
} from "./seed-spirits";

export const seedData: StoreShape = {
  menus: [dinnerMenu, drinksMenu, spiritsMenu],
  sections: [
    sToBegin, sAppetizers, sEntrees, sDesserts, sBreadService,
    sSparkling, sWhiteRose, sRedWine, sBeer, sCocktails,
    sRum, sTequilaMezcal, sXO, sDigestifs, sPort,
  ],
  items: [
    ...dinnerStarterItems,
    ...dinnerMainItems,
    ...wineItems,
    ...beerItems,
    ...cocktailItems,
    ...spiritItems,
  ],
  snapshots: [],
};
