// Assembles all per-menu seed data into a single StoreShape.
// Dinner: seed-dinner.ts (sections/menu) + seed-dinner-starters.ts + seed-dinner-mains.ts
// Drinks: seed-drinks.ts (sections/menu) + seed-drinks-wine.ts + seed-drinks-beer-cocktails.ts
// Spirits: seed-spirits.ts (sections/menu) + seed-spirits-whiskey.ts + seed-spirits-scotch-vodka.ts
//          + seed-spirits-gin-rum-tequila.ts + seed-spirits-xo-digestifs.ts
//          + seed-spirits-ports-coffees.ts + seed-spirits-desserts.ts
import type { StoreShape } from "./types";
import {
  dinnerMenu,
  sToBegin,
  sAppetizers,
  sEntrees,
  sDesserts as sDinnerDesserts,
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
  sWhiskeyBourbon,
  sRye,
  sScotch,
  sVodka,
  sGin,
  sDesserts as sSpiritsDesSerts,
  sRum,
  sTequilaMezcal,
  sXO,
  sDigestifs,
  sPort,
  sCoffees,
} from "./seed-spirits";
import { whiskeyItems } from "./seed-spirits-whiskey";
import { scotchVodkaItems } from "./seed-spirits-scotch-vodka";
import { ginRumTequilaItems } from "./seed-spirits-gin-rum-tequila";
import { xoDigestifsItems } from "./seed-spirits-xo-digestifs";
import { portItems, coffeeItems } from "./seed-spirits-ports-coffees";
import { dessertItems } from "./seed-spirits-desserts";

export const seedData: StoreShape = {
  menus: [dinnerMenu, drinksMenu, spiritsMenu],
  sections: [
    sToBegin, sAppetizers, sEntrees, sDinnerDesserts, sBreadService,
    sSparkling, sWhiteRose, sRedWine, sBeer, sCocktails,
    sWhiskeyBourbon, sRye, sScotch, sVodka, sGin,
    sSpiritsDesSerts, sRum, sTequilaMezcal, sXO, sDigestifs, sPort, sCoffees,
  ],
  items: [
    ...dinnerStarterItems,
    ...dinnerMainItems,
    ...wineItems,
    ...beerItems,
    ...cocktailItems,
    ...whiskeyItems,
    ...scotchVodkaItems,
    ...ginRumTequilaItems,
    ...xoDigestifsItems,
    ...portItems,
    ...coffeeItems,
    ...dessertItems,
  ],
  snapshots: [],
};
