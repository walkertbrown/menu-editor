// Spirits menu two-page preview components.
// Faithful reproduction of the Dessert Menu.html canonical layout:
//   Page 1 — "Spirits List" (airy): left col (Whiskey, Rye) / right col (Scotch, Vodka, Gin)
//   Page 2 — "After Dinner": Desserts full-width + band + two cols (Rum/Tequila/Ports | XO/Digestifs/Coffees)
//
// Section-level blocks (SpiritSectionBlock, DessertsBlock) live in SpiritsBlocks.tsx.
// Used by MenuPreview.tsx and SheetPreviewSpread.tsx.

"use client";

import type { Menu, Section, Item, RestaurantIdentity } from "@/content/types";

const DEFAULT_RESTAURANT: RestaurantIdentity = {
  houseName: "The Pelican Club",
  eyebrowLine: "New Orleans · Established 1990",
};

import PageFurniture from "./PageFurniture";
import SpotWrap from "./SpotWrap";
import { SpiritSectionBlock, DessertsBlock } from "./SpiritsBlocks";
import type { SpiritsEditProps } from "./SpiritsBlocks";
import {
  SPIRITS_P1_LEFT,
  SPIRITS_P1_RIGHT,
  SPIRITS_P1_ALL,
  SPIRITS_P2_FULLWIDTH,
  SPIRITS_P2_LEFT,
  SPIRITS_P2_RIGHT,
  SPIRITS_P2_ALL,
} from "./spiritsConstants";

// Re-export constants so existing importers (MenuPreview.tsx) don't break
export {
  SPIRITS_P1_LEFT,
  SPIRITS_P1_RIGHT,
  SPIRITS_P1_ALL,
  SPIRITS_P2_FULLWIDTH,
  SPIRITS_P2_LEFT,
  SPIRITS_P2_RIGHT,
  SPIRITS_P2_ALL,
};

// Re-export block components used by older call sites
export { SpiritSectionBlock };

// ── Helpers ───────────────────────────────────────────────────────────────

function getSectionItems(
  name: string,
  sectionMap: Map<string, Section>,
  allItems: Item[]
) {
  const sec = [...sectionMap.values()].find((s) => s.name === name);
  if (!sec) return [];
  return allItems
    .filter((i) => i.sectionId === sec.id)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

function getSection(name: string, sectionMap: Map<string, Section>) {
  return [...sectionMap.values()].find((s) => s.name === name);
}

// ── Page 1 — "Spirits List" ───────────────────────────────────────────────

export function SpiritsPage1({
  menu,
  sectionMap,
  allItems,
  restaurant,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: {
  menu: Menu;
  sectionMap: Map<string, Section>;
  allItems: Item[];
  restaurant?: RestaurantIdentity;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}) {
  const r = restaurant ?? DEFAULT_RESTAURANT;
  const ep: SpiritsEditProps = {
    overrides: menu.spacingOverrides,
    categorySpacing: menu.categorySpacing,
    spotCategories: menu.spotCategories,
    spacingBaseline: menu.spacingBaseline,
    editMode,
    selectedSpotId,
    onSelectSpot,
  };

  return (
    <div className="pc-page pc-page--air">
      <div className="pc-frame" aria-hidden="true" />
      <header className="pc-masthead">
        <SpotWrap spotId="p1:masthead-eyebrow" as="div" {...ep}>
          <div className="pc-eyebrow">{menu.eyebrowLine ?? r.eyebrowLine}</div>
        </SpotWrap>
        <div>
          <h1 className="pc-house-name">{r.houseName}</h1>
        </div>
        <SpotWrap spotId="p1:masthead-title" as="div" {...ep}>
          <p className="pc-menu-title">{menu.spiritsP1Title ?? "Spirits List"}</p>
        </SpotWrap>
      </header>
      <SpotWrap spotId="p1:fleuron" {...ep}>
        <div className="pc-rule-orn" aria-hidden="true"><span>❦</span></div>
      </SpotWrap>
      <PageFurniture furniture={menu.furniture} position="header" />

      <div className="pc-spirits-cols-grid">
        <div className="pc-spirits-col">
          {SPIRITS_P1_LEFT.map((name) => {
            const sec = getSection(name, sectionMap);
            if (!sec) return null;
            return (
              <SpiritSectionBlock
                key={sec.id}
                section={sec}
                items={getSectionItems(name, sectionMap, allItems)}
                editProps={ep}
              />
            );
          })}
        </div>
        <div className="pc-spirits-col">
          {SPIRITS_P1_RIGHT.map((name) => {
            const sec = getSection(name, sectionMap);
            if (!sec) return null;
            return (
              <SpiritSectionBlock
                key={sec.id}
                section={sec}
                items={getSectionItems(name, sectionMap, allItems)}
                editProps={ep}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Page 2 — "After Dinner" ───────────────────────────────────────────────

export function SpiritsPage2({
  menu,
  sectionMap,
  allItems,
  restaurant,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: {
  menu: Menu;
  sectionMap: Map<string, Section>;
  allItems: Item[];
  restaurant?: RestaurantIdentity;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}) {
  const r = restaurant ?? DEFAULT_RESTAURANT;
  const ep: SpiritsEditProps = {
    overrides: menu.spacingOverrides,
    categorySpacing: menu.categorySpacing,
    spotCategories: menu.spotCategories,
    spacingBaseline: menu.spacingBaseline,
    editMode,
    selectedSpotId,
    onSelectSpot,
  };
  const dessertSec = getSection("Desserts", sectionMap);
  const dessertItems = getSectionItems("Desserts", sectionMap, allItems);

  return (
    <div className="pc-page">
      <div className="pc-frame" aria-hidden="true" />
      <header className="pc-masthead">
        <SpotWrap spotId="p2:masthead-eyebrow" as="div" {...ep}>
          <div className="pc-eyebrow">{menu.eyebrowLine ?? r.eyebrowLine}</div>
        </SpotWrap>
        <div>
          <h1 className="pc-house-name">{r.houseName}</h1>
        </div>
        <SpotWrap spotId="p2:masthead-title" as="div" {...ep}>
          <p className="pc-menu-title">{menu.spiritsP2Title ?? "After Dinner"}</p>
        </SpotWrap>
      </header>
      <SpotWrap spotId="p2:fleuron" {...ep}>
        <div className="pc-rule-orn" aria-hidden="true"><span>❦</span></div>
      </SpotWrap>

      {dessertSec && dessertItems.length > 0 && (
        <DessertsBlock section={dessertSec} items={dessertItems} editProps={ep} />
      )}

      <div className="pc-band-rule" aria-hidden="true" />

      <div className="pc-spirits-cols-grid">
        <div className="pc-spirits-col">
          {SPIRITS_P2_LEFT.map((name) => {
            const sec = getSection(name, sectionMap);
            if (!sec) return null;
            return (
              <SpiritSectionBlock
                key={sec.id}
                section={sec}
                items={getSectionItems(name, sectionMap, allItems)}
                editProps={ep}
              />
            );
          })}
        </div>
        <div className="pc-spirits-col">
          {SPIRITS_P2_RIGHT.map((name) => {
            const sec = getSection(name, sectionMap);
            if (!sec) return null;
            return (
              <SpiritSectionBlock
                key={sec.id}
                section={sec}
                items={getSectionItems(name, sectionMap, allItems)}
                editProps={ep}
              />
            );
          })}
        </div>
      </div>

      <PageFurniture furniture={menu.furniture} position="footer" />
    </div>
  );
}
