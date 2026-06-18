// Pelican Club menu preview — multi-page layout with two-column dense sections.
// Renders the full styled menu across one or more 8.5×14 legal pages.
//
// Two-column dense sections:
//   - Food: Appetizers & Salads, Entrées, Desserts (full-width: To Begin, Bread Service)
//   - Spirits: ALL spirit_list sections
//   - Wines: full-width (wine_by_glass)
//   - Beer, Cocktails: already two-column (unchanged)
//
// Multi-page: content is grouped into pages by the getPages() helper.
//   - Dinner/Drinks: all sections on one page (compact with two-column food).
//   - Spirits: two pages — front (Whiskey/Rye | Scotch/Vodka/Gin/Rum) and
//     back (Tequila/XO | Digestifs/Ports/Coffees).
//
// All item rendering is delegated to theme/renderers/*.tsx.

"use client";

import type { Menu, Section, Item } from "@/content/types";
import FoodItemRenderer from "./renderers/FoodItem";
import WineByGlassItemRenderer from "./renderers/WineByGlassItem";
import BeerCiderItemRenderer from "./renderers/BeerCiderItem";
import CocktailItemRenderer from "./renderers/CocktailItem";
import SpiritListItemRenderer from "./renderers/SpiritListItem";
import type {
  FoodItem,
  WineByGlassItem,
  BeerCiderItem,
  CocktailItem,
  SpiritListItem,
} from "@/content/types";
import PageFurniture from "./PageFurniture";

interface Props {
  menu: Menu;
  sections: Section[];
  items: Item[];
}

// Food sections that use a two-column grid layout (dense enough to warrant it).
const FOOD_TWO_COL_NAMES = new Set([
  "Appetizers & Salads",
  "Entrées",
  "Desserts",
]);

// ---- Section block ---------------------------------------------------------

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
  const isSpirit = type === "spirit_list";
  const isFoodTwoCol = type === "food" && FOOD_TWO_COL_NAMES.has(section.name);
  const hasNonAlcCocktail =
    isCocktail &&
    (items as CocktailItem[]).some((i) => i.nonAlcoholicAvailable);

  return (
    <section className="pc-section">
      <h3 className="pc-section-header">{section.name}</h3>
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

      {isSpirit && (
        <div className="pc-two-col-grid">
          {(items as SpiritListItem[]).map((item) => (
            <SpiritListItemRenderer key={item.id} item={item} />
          ))}
        </div>
      )}

      {!isBeer && !isCocktail && !isFoodTwoCol && !isSpirit &&
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

// ---- Page grouping ---------------------------------------------------------

// Spirits menu section names in page order (matches the reference PDF layout).
// Front page: heavy hitters (Whiskey, Rye, Scotch, Vodka, Gin, Rum).
// Back page: rest (Tequila & Mezcal, XO Collection, Digestifs, Ports, Coffees).
const SPIRITS_PAGE_1 = new Set([
  "Whiskey & Bourbon",
  "Rye",
  "Scotch",
  "Vodka",
  "Gin",
  "Rum",
]);

interface PageGroup {
  sections: Section[];
  isFirstPage: boolean;
}

function getPages(
  menuId: string,
  orderedSections: Section[]
): PageGroup[] {
  if (menuId === "menu-spirits") {
    const page1Sections = orderedSections.filter((s) =>
      SPIRITS_PAGE_1.has(s.name)
    );
    const page2Sections = orderedSections.filter(
      (s) => !SPIRITS_PAGE_1.has(s.name)
    );
    const pages: PageGroup[] = [{ sections: page1Sections, isFirstPage: true }];
    if (page2Sections.length > 0) {
      pages.push({ sections: page2Sections, isFirstPage: false });
    }
    return pages;
  }

  // Dinner and Drinks: all sections on one page.
  return [{ sections: orderedSections, isFirstPage: true }];
}

// ---- Page shell ------------------------------------------------------------

function PageShell({
  menu,
  pageGroup,
  isLastPage,
  allItems,
}: {
  menu: Menu;
  pageGroup: PageGroup;
  isLastPage: boolean;
  allItems: Item[];
}) {
  const { sections, isFirstPage } = pageGroup;

  return (
    <div className="pc-page">
      {/* Double-rule border frame */}
      <div className="pc-frame" aria-hidden="true" />

      {/* Masthead — first page only */}
      {isFirstPage && (
        <>
          <header className="pc-masthead">
            <div className="pc-eyebrow">New Orleans · Established 1990</div>
            <h1 className="pc-house-name">The Pelican Club</h1>
            <p className="pc-menu-title">{menu.name}</p>
          </header>
          <div className="pc-rule-orn" aria-hidden="true">
            <span>❦</span>
          </div>
          <PageFurniture furniture={menu.furniture} position="header" />
        </>
      )}

      {/* Menu sections for this page */}
      {sections.map((section) => (
        <SectionBlock
          key={section.id}
          section={section}
          items={allItems
            .filter((i) => i.sectionId === section.id)
            .sort((a, b) => a.sortOrder - b.sortOrder)}
        />
      ))}

      {/* Footer — last page only */}
      {isLastPage && (
        <PageFurniture furniture={menu.furniture} position="footer" />
      )}
    </div>
  );
}

// ---- Main preview ----------------------------------------------------------

export default function MenuPreview({ menu, sections, items }: Props) {
  const orderedSections = [...sections].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const pages = getPages(menu.id, orderedSections);

  return (
    <div className="pc-preview-wrap">
      {pages.map((pageGroup, index) => (
        <PageShell
          key={index}
          menu={menu}
          pageGroup={pageGroup}
          isLastPage={index === pages.length - 1}
          allItems={items}
        />
      ))}
    </div>
  );
}
