// Spirits section name constants — shared between SpiritsPreview.tsx and sheetConfig.ts.
// No "use client" directive; safe to import from server-side config modules.

export const SPIRITS_P1_LEFT  = ["Whiskey & Bourbon", "Rye"];
export const SPIRITS_P1_RIGHT = ["Scotch", "Vodka", "Gin"];
export const SPIRITS_P1_ALL   = new Set([...SPIRITS_P1_LEFT, ...SPIRITS_P1_RIGHT]);

export const SPIRITS_P2_FULLWIDTH = ["Desserts"];
export const SPIRITS_P2_LEFT  = ["Rum", "Tequila & Mezcal", "Ports & Dessert Wines"];
export const SPIRITS_P2_RIGHT = ["XO Collection", "Digestifs", "Coffees"];
export const SPIRITS_P2_ALL   = new Set([
  ...SPIRITS_P2_FULLWIDTH,
  ...SPIRITS_P2_LEFT,
  ...SPIRITS_P2_RIGHT,
]);
