// Sheet configuration — the ONE place that defines the two double-sided sheets.
//
// A "side" is either:
//   { menuId } — render all sections of that menu
//   { menuId, sectionNames } — render only the named sections of that menu
//
// Sheet "dinner-menu"   FRONT = menu-dinner (all),   BACK = menu-drinks (all)
// Sheet "after-dinner"  FRONT = menu-spirits p1,     BACK = menu-spirits p2
//
// Import SHEET_CONFIGS wherever you need to know the mapping.

import {
  SPIRITS_P1_LEFT,
  SPIRITS_P1_RIGHT,
  SPIRITS_P2_FULLWIDTH,
  SPIRITS_P2_LEFT,
  SPIRITS_P2_RIGHT,
} from "@/theme/spiritsConstants";

export interface SheetSide {
  /** Which menu's data to load */
  menuId: string;
  /**
   * If provided, only render sections whose name is in this set.
   * If omitted, render ALL sections of that menu.
   */
  sectionNames?: Set<string>;
  /** Human-readable label shown in the Flip control, e.g. "Dinner" */
  label: string;
  /** Short position label, e.g. "front" or "back" */
  position: "front" | "back";
}

export interface SheetConfig {
  id: string;
  name: string;
  front: SheetSide;
  back: SheetSide;
}

export const SHEET_CONFIGS: SheetConfig[] = [
  {
    id: "dinner-menu",
    name: "Dinner Menu",
    front: {
      menuId: "menu-dinner",
      label: "Dinner",
      position: "front",
    },
    back: {
      menuId: "menu-drinks",
      label: "Drinks",
      position: "back",
    },
  },
  {
    id: "after-dinner",
    name: "After-Dinner Menu",
    front: {
      menuId: "menu-spirits",
      sectionNames: new Set([
        ...SPIRITS_P1_LEFT,
        ...SPIRITS_P1_RIGHT,
      ]),
      label: "Spirits List",
      position: "front",
    },
    back: {
      menuId: "menu-spirits",
      sectionNames: new Set([
        ...SPIRITS_P2_FULLWIDTH,
        ...SPIRITS_P2_LEFT,
        ...SPIRITS_P2_RIGHT,
      ]),
      label: "After Dinner",
      position: "back",
    },
  },
];

/** Look up a sheet config by ID. Returns undefined if not found. */
export function getSheetConfig(id: string): SheetConfig | undefined {
  return SHEET_CONFIGS.find((s) => s.id === id);
}
