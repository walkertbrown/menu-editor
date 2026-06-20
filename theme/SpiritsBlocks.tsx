// SpiritsBlocks — section-level block renderers for the spirits pages.
// Exported: SpiritSectionBlock, DessertsBlock, SpiritsEditProps interface.
// Kept separate to stay within the ~300-line file limit.

"use client";

import type { Section, Item } from "@/content/types";
import type { FoodItem, CocktailItem, SpiritListItem } from "@/content/types";
import SpiritListItemRenderer from "./renderers/SpiritListItem";
import SpotWrap from "./SpotWrap";
import { sectionSpotId, itemSpotId } from "./spotSpacing";

// ── Edit props shared across spirits components ───────────────────────────

export interface SpiritsEditProps {
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  spotCategories?: Record<string, string>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}

// ── Spirit section block (single column, used inside explicit col grids) ──

export function SpiritSectionBlock({
  section,
  items,
  editProps,
}: {
  section: Section;
  items: Item[];
  editProps?: SpiritsEditProps;
}) {
  if (items.length === 0) return null;

  const isPortSection = section.name === "Ports & Dessert Wines";
  const isCoffeeSection = section.name === "Coffees";
  const type = items[0]?.type;
  const ep = editProps ?? {};

  return (
    <SpotWrap
      spotId={sectionSpotId(section.id)}
      overrides={ep.overrides}
      categorySpacing={ep.categorySpacing}
      spotCategories={ep.spotCategories}
      editMode={ep.editMode}
      selectedSpotId={ep.selectedSpotId}
      onSelectSpot={ep.onSelectSpot}
      as="section"
      className="pc-section"
    >
      <h3 className="pc-section-header">{section.name}</h3>
      {section.subtitle && (
        <p className="pc-section-sub">{section.subtitle}</p>
      )}
      <hr className="pc-section-hr" />

      {isPortSection && (
        <div className="pc-ports-head">
          <span>Bin</span>
          <span></span>
          <span>Glass</span>
          <span>Bottle</span>
        </div>
      )}

      {type === "spirit_list" && (
        <div className="pc-spirit-single-col">
          {(items as SpiritListItem[]).map((item) => (
            <SpotWrap
              key={item.id}
              spotId={itemSpotId(item.id)}
              overrides={ep.overrides}
              categorySpacing={ep.categorySpacing}
              spotCategories={ep.spotCategories}
              editMode={ep.editMode}
              selectedSpotId={ep.selectedSpotId}
              onSelectSpot={ep.onSelectSpot}
            >
              <SpiritListItemRenderer
                item={item}
                overrides={ep.overrides}
                categorySpacing={ep.categorySpacing}
                spotCategories={ep.spotCategories}
                editMode={ep.editMode}
                selectedSpotId={ep.selectedSpotId}
                onSelectSpot={ep.onSelectSpot}
              />
            </SpotWrap>
          ))}
        </div>
      )}

      {/* Coffees: centered name + price + italic description */}
      {type === "cocktail" && isCoffeeSection && (
        <>
          {(items as CocktailItem[]).map((item) => (
            <SpotWrap
              key={item.id}
              spotId={itemSpotId(item.id)}
              overrides={ep.overrides}
              categorySpacing={ep.categorySpacing}
              spotCategories={ep.spotCategories}
              editMode={ep.editMode}
              selectedSpotId={ep.selectedSpotId}
              onSelectSpot={ep.onSelectSpot}
            >
              <div className="pc-coffee">
                <div className="pc-coffee-line">
                  <span className="pc-coffee-name">{item.name}</span>
                  <span className="pc-dots" />
                  <span className="pc-coffee-price">${item.price}</span>
                </div>
                {item.ingredients && (
                  <div className="pc-coffee-desc">{item.ingredients}</div>
                )}
              </div>
            </SpotWrap>
          ))}
        </>
      )}
    </SpotWrap>
  );
}

// ── Desserts full-width feature block (page 2 top) ────────────────────────

export function DessertsBlock({
  section,
  items,
  editProps,
}: {
  section: Section;
  items: Item[];
  editProps?: SpiritsEditProps;
}) {
  const foodItems = items as FoodItem[];
  const hasGf = foodItems.some((i) => i.gf);
  const ep = editProps ?? {};

  return (
    <SpotWrap
      spotId={sectionSpotId(section.id)}
      overrides={ep.overrides}
      categorySpacing={ep.categorySpacing}
      spotCategories={ep.spotCategories}
      editMode={ep.editMode}
      selectedSpotId={ep.selectedSpotId}
      onSelectSpot={ep.onSelectSpot}
      as="section"
      className="pc-desserts"
    >
      <h3 className="pc-desserts-header">{section.name}</h3>
      <hr className="pc-section-hr" />
      <div className="pc-dessert-grid">
        {foodItems.map((item) => (
          <SpotWrap
            key={item.id}
            spotId={itemSpotId(item.id)}
            overrides={ep.overrides}
            categorySpacing={ep.categorySpacing}
            spotCategories={ep.spotCategories}
            editMode={ep.editMode}
            selectedSpotId={ep.selectedSpotId}
            onSelectSpot={ep.onSelectSpot}
          >
            <div className="pc-dessert">
              <div className="pc-dessert-line">
                <span className="pc-dessert-name">{item.name}</span>
                {item.gf && <span className="pc-dessert-gf">gf</span>}
                <span className="pc-dots" />
              </div>
              <span className="pc-dessert-price">${item.price}</span>
              {item.description && (
                <div className="pc-dessert-desc">{item.description}</div>
              )}
            </div>
          </SpotWrap>
        ))}
      </div>
      {hasGf && (
        <p className="pc-dessert-note">gf &nbsp; gluten-free available</p>
      )}
    </SpotWrap>
  );
}
