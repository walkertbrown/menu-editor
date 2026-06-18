// Pelican Club menu preview — multi-page layout with per-menu rendering.
//
// Spirits menu: delegates to SpiritsPreview.tsx (two dedicated legal pages).
// Non-spirits menus (Dinner, Drinks): single-page rendering with all sections.
//
// All item rendering is delegated to theme/renderers/*.tsx.

"use client";

import type { Menu, Section, Item } from "@/content/types";
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
import {
  SpiritsPage1,
  SpiritsPage2,
  SPIRITS_P1_ALL,
  SPIRITS_P2_ALL,
} from "./SpiritsPreview";

interface Props {
  menu: Menu;
  sections: Section[];
  items: Item[];
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
}: {
  section: Section;
  items: Item[];
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
    <section className="pc-section">
      <h3 className="pc-section-header">{section.name}</h3>
      {section.subtitle && (
        <p className="pc-section-sub">{section.subtitle}</p>
      )}
      <hr className="pc-section-hr" />

      {isBeer && (
        <div className="pc-beer-grid">
          {(items as BeerCiderItem[]).map((item) => (
            <BeerCiderItemRenderer key={item.id} item={item} />
          ))}
        </div>
      )}

      {isCocktail && (
        <>
          <div className="pc-cocktails-grid">
            {(items as CocktailItem[]).map((item) => (
              <CocktailItemRenderer key={item.id} item={item} />
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
            <FoodItemRenderer key={item.id} item={item} />
          ))}
        </div>
      )}

      {isWineTwoCol && (
        <div className="pc-two-col-grid">
          {(items as WineByGlassItem[]).map((item) => (
            <WineByGlassItemRenderer key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isBeer && !isCocktail && !isFoodTwoCol && !isWineTwoCol &&
        items.map((item) => {
          if (item.type === "food")
            return <FoodItemRenderer key={item.id} item={item as FoodItem} />;
          if (item.type === "wine_by_glass")
            return (
              <WineByGlassItemRenderer
                key={item.id}
                item={item as WineByGlassItem}
              />
            );
          return null;
        })}
    </section>
  );
}

// ── Non-spirits single-page shell ─────────────────────────────────────────

export function SinglePageShell({
  menu,
  sections,
  isLastPage,
  allItems,
}: {
  menu: Menu;
  sections: Section[];
  isLastPage: boolean;
  allItems: Item[];
}) {
  return (
    <div className="pc-page">
      <div className="pc-frame" aria-hidden="true" />
      <header className="pc-masthead">
        <div className="pc-eyebrow">New Orleans · Established 1990</div>
        <h1 className="pc-house-name">The Pelican Club</h1>
        <p className="pc-menu-title">{menu.name}</p>
      </header>
      <div className="pc-rule-orn" aria-hidden="true">
        <span>❦</span>
      </div>
      <PageFurniture furniture={menu.furniture} position="header" />

      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          items={allItems
            .filter((i) => i.sectionId === section.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)}
        />
      ))}

      {isLastPage && (
        <PageFurniture furniture={menu.furniture} position="footer" />
      )}
    </div>
  );
}

// ── Main preview ──────────────────────────────────────────────────────────

export default function MenuPreview({ menu, sections, items }: Props) {
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
          <SpiritsPage1 menu={menu} sectionMap={sectionMap} allItems={items} />
        )}
        {p2Sections.length > 0 && (
          <SpiritsPage2 menu={menu} sectionMap={sectionMap} allItems={items} />
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
      />
    </div>
  );
}
