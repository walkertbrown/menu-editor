// Sample data for the After-Dinner / Spirits menu.
import { v4 as uuidv4 } from "uuid";
import type { Menu, Section, SpiritListItem } from "./types";

const now = new Date().toISOString();

export const spiritsMenuId = "menu-spirits";

export const sRum: Section = {
  id: "sec-rum",
  menuId: spiritsMenuId,
  name: "Rum",
  sortOrder: 0,
};
export const sTequilaMezcal: Section = {
  id: "sec-tequila-mezcal",
  menuId: spiritsMenuId,
  name: "Tequila & Mezcal",
  sortOrder: 1,
};
export const sXO: Section = {
  id: "sec-xo",
  menuId: spiritsMenuId,
  name: "XO & Armagnac",
  sortOrder: 2,
};
export const sDigestifs: Section = {
  id: "sec-digestifs",
  menuId: spiritsMenuId,
  name: "Digestifs",
  sortOrder: 3,
};
export const sPort: Section = {
  id: "sec-port",
  menuId: spiritsMenuId,
  name: "Port & Dessert Wine",
  sortOrder: 4,
};

export const spiritItems: SpiritListItem[] = [
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

export const spiritsMenu: Menu = {
  id: spiritsMenuId,
  name: "After-Dinner / Spirits",
  sectionOrder: [sRum.id, sTequilaMezcal.id, sXO.id, sDigestifs.id, sPort.id],
  createdAt: now,
  updatedAt: now,
};
