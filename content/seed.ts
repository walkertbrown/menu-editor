// Sample data for the three Pelican Club menus.
// Used to bootstrap the local JSON store on first run.

import { v4 as uuidv4 } from "uuid";
import type {
  Menu,
  Section,
  Item,
  FoodItem,
  WineByGlassItem,
  BeerCiderItem,
  CocktailItem,
  SpiritListItem,
  StoreShape,
} from "./types";

// ---- ID helpers ---------------------------------------------------------

const now = new Date().toISOString();

// ---- Menu: Dinner -------------------------------------------------------

const dinnerMenuId = "menu-dinner";
const sAppetizers: Section = {
  id: "sec-appetizers",
  menuId: dinnerMenuId,
  name: "Appetizers",
  sortOrder: 0,
};
const sEntrees: Section = {
  id: "sec-entrees",
  menuId: dinnerMenuId,
  name: "Entrées",
  sortOrder: 1,
};
const sDesserts: Section = {
  id: "sec-desserts",
  menuId: dinnerMenuId,
  name: "Desserts",
  sortOrder: 2,
};

const dinnerItems: FoodItem[] = [
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

const dinnerMenu: Menu = {
  id: dinnerMenuId,
  name: "Dinner",
  sectionOrder: [sAppetizers.id, sEntrees.id, sDesserts.id],
  furniture: {
    prixFixeHeader: "$56 & UP",
    introLines: ["Three courses · Chef's selection available"],
    footerLine: "Add a soup $8 · Consuming raw or undercooked foods may increase your risk of foodborne illness.",
  },
  createdAt: now,
  updatedAt: now,
};

// ---- Menu: Drinks -------------------------------------------------------

const drinksMenuId = "menu-drinks";
const sSparkling: Section = {
  id: "sec-sparkling",
  menuId: drinksMenuId,
  name: "Sparkling",
  sortOrder: 0,
};
const sWhiteRose: Section = {
  id: "sec-white-rose",
  menuId: drinksMenuId,
  name: "White & Rosé",
  sortOrder: 1,
};
const sRedWine: Section = {
  id: "sec-red-wine",
  menuId: drinksMenuId,
  name: "Red",
  sortOrder: 2,
};
const sBeer: Section = {
  id: "sec-beer",
  menuId: drinksMenuId,
  name: "Beer & Cider",
  sortOrder: 3,
};
const sCocktails: Section = {
  id: "sec-cocktails",
  menuId: drinksMenuId,
  name: "Cocktails",
  sortOrder: 4,
};

const wineItems: WineByGlassItem[] = [
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

const beerItems: BeerCiderItem[] = [
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

const cocktailItems: CocktailItem[] = [
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

const drinksMenu: Menu = {
  id: drinksMenuId,
  name: "Drinks",
  sectionOrder: [sSparkling.id, sWhiteRose.id, sRedWine.id, sBeer.id, sCocktails.id],
  createdAt: now,
  updatedAt: now,
};

// ---- Menu: After-Dinner / Spirits ---------------------------------------

const spiritsMenuId = "menu-spirits";
const sRum: Section = {
  id: "sec-rum",
  menuId: spiritsMenuId,
  name: "Rum",
  sortOrder: 0,
};
const sTequilaMezcal: Section = {
  id: "sec-tequila-mezcal",
  menuId: spiritsMenuId,
  name: "Tequila & Mezcal",
  sortOrder: 1,
};
const sXO: Section = {
  id: "sec-xo",
  menuId: spiritsMenuId,
  name: "XO & Armagnac",
  sortOrder: 2,
};
const sDigestifs: Section = {
  id: "sec-digestifs",
  menuId: spiritsMenuId,
  name: "Digestifs",
  sortOrder: 3,
};
const sPort: Section = {
  id: "sec-port",
  menuId: spiritsMenuId,
  name: "Port & Dessert Wine",
  sortOrder: 4,
};

const spiritItems: SpiritListItem[] = [
  // Rum
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sRum.id,
    sortOrder: 0,
    name: "Appleton Estate 12yr",
    originVarietal: "Jamaica",
    price: "14",
    group: "Rum",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sRum.id,
    sortOrder: 1,
    name: "Mount Gay 1703",
    originVarietal: "Barbados",
    price: "18",
    group: "Rum",
  },
  // Tequila & Mezcal
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sTequilaMezcal.id,
    sortOrder: 0,
    name: "Fortaleza Añejo",
    originVarietal: "Tequila · Mexico",
    price: "18",
    group: "Tequila & Mezcal",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sTequilaMezcal.id,
    sortOrder: 1,
    name: "Del Maguey Vida",
    originVarietal: "Mezcal · Oaxaca, Mexico",
    price: "16",
    group: "Tequila & Mezcal",
  },
  // XO & Armagnac
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sXO.id,
    sortOrder: 0,
    name: "Rémy Martin XO",
    originVarietal: "Cognac · France",
    price: "28",
    group: "XO",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sXO.id,
    sortOrder: 1,
    name: "Château de Laubade XO",
    originVarietal: "Armagnac · Gascony, France",
    price: "26",
    group: "XO",
  },
  // Digestifs
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sDigestifs.id,
    sortOrder: 0,
    name: "Fernet-Branca",
    originVarietal: "Amaro · Italy",
    price: "10",
    group: "Digestifs",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sDigestifs.id,
    sortOrder: 1,
    name: "Amaro Montenegro",
    originVarietal: "Amaro · Italy",
    price: "11",
    group: "Digestifs",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sDigestifs.id,
    sortOrder: 2,
    name: "Green Chartreuse",
    originVarietal: "Liqueur · Voiron, France",
    price: "14",
    group: "Digestifs",
  },
  // Port & Dessert Wine (two-price variant)
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 0,
    name: "Graham's Six Grapes Reserve Port",
    originVarietal: "Port · Douro, Portugal",
    glasPrice: "12",
    bottlePrice: "48",
    binNumber: "B1",
    group: "Port & Dessert Wine",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 1,
    name: "Fonseca 10yr Tawny Port",
    originVarietal: "Port · Douro, Portugal",
    glasPrice: "14",
    bottlePrice: "58",
    binNumber: "B2",
    group: "Port & Dessert Wine",
  },
  {
    id: uuidv4(),
    type: "spirit_list",
    menuId: spiritsMenuId,
    sectionId: sPort.id,
    sortOrder: 2,
    name: "Château d'Yquem",
    originVarietal: "Sauternes · Bordeaux, France",
    glasPrice: "32",
    bottlePrice: "185",
    binNumber: "B3",
    group: "Port & Dessert Wine",
  },
];

const spiritsMenu: Menu = {
  id: spiritsMenuId,
  name: "After-Dinner / Spirits",
  sectionOrder: [sRum.id, sTequilaMezcal.id, sXO.id, sDigestifs.id, sPort.id],
  createdAt: now,
  updatedAt: now,
};

// ---- Assembled seed data ------------------------------------------------

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
