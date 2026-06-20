// Pelican Club menu preview — multi-page layout with per-menu rendering.
//
// Spirits menu: delegates to SpiritsPreview.tsx (two dedicated legal pages).
// Non-spirits menus (Dinner, Drinks): single-page rendering with all sections.
//
// All item rendering is delegated to theme/renderers/*.tsx.

"use client";

import type { Menu, Section, Item, RestaurantIdentity } from "@/content/types";
import type {
  FoodItem,
  WineByGlassItem,
  BeerCiderItem,
  CocktailItem,
} from "@/content/types";
import FoodItemRenderer from "./renderers/FoodItem";
import WineByGlassItemRenderer from "./renderers/WineByGlassItem";
import BeerCiderItemRenderer from "./renderers/BeerCiderItem";
import CocktailItemRenderer from "./renderers/CocktailItem";
import PageFurniture from "./PageFurniture";
import Masthead from "./Masthead";
import SpotWrap from "./SpotWrap";
import { SPOT, sectionSpotId } from "./spotSpacing";
import {
  SpiritsPage1,
  SpiritsPage2,
  SPIRITS_P1_ALL,
  SPIRITS_P2_ALL,
} from "./SpiritsPreview";

const DEFAULT_RESTAURANT: RestaurantIdentity = {
  houseName: "The Pelican Club",
  eyebrowLine: "New Orleans · Established 1990",
};

// Shared edit-mode props threaded through the tree.
interface EditProps {
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  /** Phase 3: spot → category assignment map. */
  spotCategories?: Record<string, string>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}

interface Props {
  menu: Menu;
  sections: Section[];
  items: Item[];
  restaurant?: RestaurantIdentity;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}

// Food sections that use a two-column grid layout.
const FOOD_TWO_COL_NAMES = new Set([
  "Appetizers & Salads",
  "Entrées",
  "Desserts",
]);

// Wine-by-glass sections rendered two-column.
const WINE_TWO_COL_NAMES = new Set(["Sparkling", "White & Rosé", "Red"]);

// ── SectionBlock — shared renderer for a single menu section ─────────────

function SectionBlock({
  section,
  items,
  editProps,
}: {
  section: Section;
  items: Item[];
  editProps: EditProps;
}) {
  if (items.length === 0) return null;

  const type = items[0]?.type;
  const isBeer = type === "beer_cider";
  const isCocktail = type === "cocktail";
  const isFoodTwoCol = type === "food" && FOOD_TWO_COL_NAMES.has(section.name);
  const isWineTwoCol =
    type === "wine_by_glass" && WINE_TWO_COL_NAMES.has(section.name);
  const hasNonAlcCocktail =
    isCocktail &&
    (items as CocktailItem[]).some((i) => i.nonAlcoholicAvailable);

  return (
    <SpotWrap
      spotId={sectionSpotId(section.id)}
      overrides={editProps.overrides}
      categorySpacing={editProps.categorySpacing}
      spotCategories={editProps.spotCategories}
      editMode={editProps.editMode}
      selectedSpotId={editProps.selectedSpotId}
      onSelectSpot={editProps.onSelectSpot}
      as="section"
      className="pc-section"
    >
      <h3 className="pc-section-header">{section.name}</h3>
      {section.subtitle && (
        <p className="pc-section-sub">{section.subtitle}</p>
      )}
      <hr className="pc-section-hr" />

      {isBeer && (
        <div className="pc-beer-grid">
          {(items as BeerCiderItem[]).map((item) => (
            <BeerCiderItemRenderer key={item.id} item={item} {...editProps} />
          ))}
        </div>
      )}

      {isCocktail && (
        <>
          <div className="pc-cocktails-grid">
            {(items as CocktailItem[]).map((item) => (
              <CocktailItemRenderer key={item.id} item={item} {...editProps} />
            ))}
          </div>
          {hasNonAlcCocktail && (
            <p className="pc-na-note">✦ non-alcoholic version available</p>
          )}
        </>
      )}

      {isFoodTwoCol && (
        <div className="pc-two-col-grid">
          {(items as FoodItem[]).map((item) => (
            <FoodItemRenderer key={item.id} item={item} {...editProps} />
          ))}
        </div>
      )}

      {isWineTwoCol && (
        <div className="pc-two-col-grid">
          {(items as WineByGlassItem[]).map((item) => (
            <WineByGlassItemRenderer key={item.id} item={item} {...editProps} />
          ))}
        </div>
      )}

      {!isBeer && !isCocktail && !isFoodTwoCol && !isWineTwoCol &&
        items.map((item) => {
          if (item.type === "food")
            return <FoodItemRenderer key={item.id} item={item as FoodItem} {...editProps} />;
          if (item.type === "wine_by_glass")
            return (
              <WineByGlassItemRenderer
                key={item.id}
                item={item as WineByGlassItem}
                {...editProps}
              />
            );
          return null;
        })}
    </SpotWrap>
  );
}

// ── Non-spirits single-page shell ─────────────────────────────────────────

export function SinglePageShell({
  menu,
  sections,
  isLastPage,
  allItems,
  restaurant,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: {
  menu: Menu;
  sections: Section[];
  isLastPage: boolean;
  allItems: Item[];
  restaurant?: RestaurantIdentity;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}) {
  const r = restaurant ?? DEFAULT_RESTAURANT;
  const overrides = menu.spacingOverrides;
  const categorySpacing = menu.categorySpacing;
  const spotCategories = menu.spotCategories;
  const editProps: EditProps = { overrides, categorySpacing, spotCategories, editMode, selectedSpotId, onSelectSpot };

  return (
    <div className="pc-page pc-page--fill">
      <div className="pc-frame" aria-hidden="true" />
      <Masthead
        menu={menu}
        restaurant={r}
        overrides={overrides}
        categorySpacing={categorySpacing}
        spotCategories={spotCategories}
        editMode={editMode}
        selectedSpotId={selectedSpotId}
        onSelectSpot={onSelectSpot}
      />
      {!menu.mastheadMinimal && (
        <SpotWrap spotId={SPOT.fleuron} {...editProps}>
          <div className="pc-rule-orn" aria-hidden="true">
            <span>❦</span>
          </div>
        </SpotWrap>
      )}
      <PageFurniture
        furniture={menu.furniture}
        position="header"
        overrides={overrides}
        categorySpacing={categorySpacing}
        spotCategories={spotCategories}
        editMode={editMode}
        selectedSpotId={selectedSpotId}
        onSelectSpot={onSelectSpot}
      />

      <div className="pc-sections">
        {sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            items={allItems
              .filter((i) => i.sectionId === section.id)
              .sort((a, b) => a.sortOrder - b.sortOrder)}
            editProps={editProps}
          />
        ))}
      </div>

      {isLastPage && (
        <PageFurniture
          furniture={menu.furniture}
          position="footer"
          overrides={overrides}
          categorySpacing={categorySpacing}
          spotCategories={spotCategories}
          editMode={editMode}
          selectedSpotId={selectedSpotId}
          onSelectSpot={onSelectSpot}
        />
      )}
    </div>
  );
}

// ── Main preview ──────────────────────────────────────────────────────────

export default function MenuPreview({
  menu,
  sections,
  items,
  restaurant,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: Props) {
  const orderedSections = [...sections].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  // Spirits menu: two dedicated page components
  if (menu.id === "menu-spirits") {
    const sectionMap = new Map(sections.map((s) => [s.id, s]));
    const p1Sections = orderedSections.filter((s) => SPIRITS_P1_ALL.has(s.name));
    const p2Sections = orderedSections.filter((s) => SPIRITS_P2_ALL.has(s.name));

    return (
      <div className="pc-preview-wrap">
        {p1Sections.length > 0 && (
          <SpiritsPage1
            menu={menu}
            sectionMap={sectionMap}
            allItems={items}
            restaurant={restaurant}
            editMode={editMode}
            selectedSpotId={selectedSpotId}
            onSelectSpot={onSelectSpot}
          />
        )}
        {p2Sections.length > 0 && (
          <SpiritsPage2
            menu={menu}
            sectionMap={sectionMap}
            allItems={items}
            restaurant={restaurant}
            editMode={editMode}
            selectedSpotId={selectedSpotId}
            onSelectSpot={onSelectSpot}
          />
        )}
      </div>
    );
  }

  // Dinner and Drinks: all sections on one page
  return (
    <div className="pc-preview-wrap">
      <SinglePageShell
        menu={menu}
        sections={orderedSections}
        isLastPage={true}
        allItems={items}
        restaurant={restaurant}
        editMode={editMode}
        selectedSpotId={selectedSpotId}
        onSelectSpot={onSelectSpot}
      />
    </div>
  );
}
