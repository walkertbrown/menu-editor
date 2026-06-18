// Assembles all per-menu seed data into a single StoreShape.
// Each menu's data lives in its own file (seed-dinner, seed-drinks, seed-spirits).
import type { StoreShape } from "./types";
import { dinnerMenu, sAppetizers, sEntrees, sDesserts, dinnerItems } from "./seed-dinner";
import {
  drinksMenu,
  sSparkling,
  sWhiteRose,
  sRedWine,
  sBeer,
  sCocktails,
  wineItems,
  beerItems,
  cocktailItems,
} from "./seed-drinks";
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
    sAppetizers, sEntrees, sDesserts,
    sSparkling, sWhiteRose, sRedWine, sBeer, sCocktails,
    sRum, sTequilaMezcal, sXO, sDigestifs, sPort,
  ],
  items: [
    ...dinnerItems,
    ...wineItems,
    ...beerItems,
    ...cocktailItems,
    ...spiritItems,
  ],
  snapshots: [],
};
