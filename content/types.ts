// Core data model for The Pelican Club menu editor.
// All item types share id, sectionId, menuId, and sortOrder.
// Use the Item union type for polymorphic handling.

export type ItemType =
  | "food"
  | "wine_by_glass"
  | "beer_cider"
  | "cocktail"
  | "spirit_list";

// ---- Base ---------------------------------------------------------------

export interface BaseItem {
  id: string;
  type: ItemType;
  sectionId: string;
  menuId: string;
  sortOrder: number;
}

// ---- Food ---------------------------------------------------------------

export interface FoodItem extends BaseItem {
  type: "food";
  /** ALL-CAPS name */
  name: string;
  /** Gluten-free flag */
  gf?: boolean;
  /** Surcharge token, e.g. "(+3)" or "(+10)" */
  surcharge?: string;
  /** Display price string, e.g. "26" or "market" */
  price: string;
  /** Italic description line */
  description?: string;
}

// ---- Wine by the Glass --------------------------------------------------

export type WineGroup = "Sparkling" | "White & Rosé" | "Red";

export interface WineByGlassItem extends BaseItem {
  type: "wine_by_glass";
  name: string;
  /** e.g. "Loire, France '24" */
  regionVintage?: string;
  price: string;
  group: WineGroup;
}

// ---- Beer & Cider -------------------------------------------------------

export interface BeerCiderItem extends BaseItem {
  type: "beer_cider";
  name: string;
  price: string;
  /** Show N/A marker for non-alcoholic options */
  nonAlcoholic?: boolean;
}

// ---- Cocktail -----------------------------------------------------------

export interface CocktailItem extends BaseItem {
  type: "cocktail";
  name: string;
  /** When true, render ✦ marker indicating a non-alcoholic version is available */
  nonAlcoholicAvailable?: boolean;
  price: string;
  /** Italic ingredient line, e.g. "bourbon, honey syrup, lemon, thyme" */
  ingredients?: string;
}

// ---- Spirit List --------------------------------------------------------

export interface SpiritListItem extends BaseItem {
  type: "spirit_list";
  name: string;
  /** e.g. "Cognac · France" */
  originVarietal?: string;
  /** Single price — most spirits */
  price?: string;
  /** For ports/dessert wines: price per glass */
  glasPrice?: string;
  /** For ports/dessert wines: price per bottle */
  bottlePrice?: string;
  /** Bin number for port/dessert wine entries */
  binNumber?: string;
  /** Grouping label, e.g. "Rum", "Tequila & Mezcal", "Digestifs", "Port & Dessert Wine" */
  group?: string;
}

// ---- Union --------------------------------------------------------------

export type Item =
  | FoodItem
  | WineByGlassItem
  | BeerCiderItem
  | CocktailItem
  | SpiritListItem;

// ---- Section ------------------------------------------------------------

export interface Section {
  id: string;
  menuId: string;
  name: string;
  sortOrder: number;
}

// ---- Menu Furniture -----------------------------------------------------

/** Editable header/intro/footer copy attached to a menu */
export interface MenuFurniture {
  /** e.g. "$56 & UP" prix-fixe header */
  prixFixeHeader?: string;
  /** Lines shown under the section title */
  introLines?: string[];
  /** Footer line, e.g. "add a soup $8" */
  footerLine?: string;
  /** Ornamental text shown between sections */
  ornamentText?: string;
}

// ---- Menu ---------------------------------------------------------------

export interface Menu {
  id: string;
  name: string;
  /** Ordered list of section ids */
  sectionOrder: string[];
  furniture?: MenuFurniture;
  createdAt: string;
  updatedAt: string;
}

// ---- Version Snapshot ---------------------------------------------------

export interface VersionSnapshot {
  id: string;
  menuId: string;
  label: string;
  createdAt: string;
  /** Full serialized state of the menu + its sections + items at save time */
  data: {
    menu: Menu;
    sections: Section[];
    items: Item[];
  };
}

// ---- Store shape (what the JSON file holds) -----------------------------

export interface StoreShape {
  menus: Menu[];
  sections: Section[];
  items: Item[];
  snapshots: VersionSnapshot[];
}
