// Spirits menu two-page preview components.
// Faithful reproduction of the Dessert Menu.html canonical layout:
//   Page 1 — "Spirits List" (airy): left col (Whiskey, Rye) / right col (Scotch, Vodka, Gin)
//   Page 2 — "After Dinner": Desserts full-width + band + two cols (Rum/Tequila/Ports | XO/Digestifs/Coffees)
//
// Used exclusively by MenuPreview.tsx when menu.id === "menu-spirits".

"use client";

import type { Menu, Section, Item, RestaurantIdentity } from "@/content/types";
import type { FoodItem, CocktailItem, SpiritListItem } from "@/content/types";

const DEFAULT_RESTAURANT: RestaurantIdentity = {
  houseName: "The Pelican Club",
  eyebrowLine: "New Orleans · Established 1990",
};
import SpiritListItemRenderer from "./renderers/SpiritListItem";
import PageFurniture from "./PageFurniture";
import {
  SPIRITS_P1_LEFT,
  SPIRITS_P1_RIGHT,
  SPIRITS_P1_ALL,
  SPIRITS_P2_FULLWIDTH,
  SPIRITS_P2_LEFT,
  SPIRITS_P2_RIGHT,
  SPIRITS_P2_ALL,
} from "./spiritsConstants";

// Re-export so existing importers (MenuPreview.tsx) don't break
export {
  SPIRITS_P1_LEFT,
  SPIRITS_P1_RIGHT,
  SPIRITS_P1_ALL,
  SPIRITS_P2_FULLWIDTH,
  SPIRITS_P2_LEFT,
  SPIRITS_P2_RIGHT,
  SPIRITS_P2_ALL,
};

// ── Spirit section block (single column, used inside explicit col grids) ──

export function SpiritSectionBlock({
  section,
  items,
}: {
  section: Section;
  items: Item[];
}) {
  if (items.length === 0) return null;

  const isPortSection = section.name === "Ports & Dessert Wines";
  const isCoffeeSection = section.name === "Coffees";
  const type = items[0]?.type;

  return (
    <section className="pc-section">
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
            <SpiritListItemRenderer key={item.id} item={item} />
          ))}
        </div>
      )}

      {/* Coffees: centered name + price + italic description */}
      {type === "cocktail" && isCoffeeSection && (
        <>
          {(items as CocktailItem[]).map((item) => (
            <div key={item.id} className="pc-coffee">
              <div className="pc-coffee-line">
                <span className="pc-coffee-name">{item.name}</span>
                <span className="pc-dots" />
                <span className="pc-coffee-price">${item.price}</span>
              </div>
              {item.ingredients && (
                <div className="pc-coffee-desc">{item.ingredients}</div>
              )}
            </div>
          ))}
        </>
      )}
    </section>
  );
}

// ── Desserts full-width feature block (page 2 top) ────────────────────────

function DessertsBlock({
  section,
  items,
}: {
  section: Section;
  items: Item[];
}) {
  const foodItems = items as FoodItem[];
  const hasGf = foodItems.some((i) => i.gf);

  return (
    <section className="pc-desserts">
      <h3 className="pc-desserts-header">{section.name}</h3>
      <hr className="pc-section-hr" />
      <div className="pc-dessert-grid">
        {foodItems.map((item) => (
          <div key={item.id} className="pc-dessert">
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
        ))}
      </div>
      {hasGf && (
        <p className="pc-dessert-note">gf &nbsp; gluten-free available</p>
      )}
    </section>
  );
}

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
}: {
  menu: Menu;
  sectionMap: Map<string, Section>;
  allItems: Item[];
  restaurant?: RestaurantIdentity;
}) {
  const r = restaurant ?? DEFAULT_RESTAURANT;
  return (
    <div className="pc-page pc-page--air">
      <div className="pc-frame" aria-hidden="true" />
      <header className="pc-masthead">
        {r.logoUrl && (
          <img src={r.logoUrl} alt="" className="pc-masthead-logo" />
        )}
        <div className="pc-eyebrow">{r.eyebrowLine}</div>
        <h1 className="pc-house-name">{r.houseName}</h1>
        <p className="pc-menu-title">{menu.spiritsP1Title ?? "Spirits List"}</p>
      </header>
      <div className="pc-rule-orn" aria-hidden="true"><span>❦</span></div>
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
}: {
  menu: Menu;
  sectionMap: Map<string, Section>;
  allItems: Item[];
  restaurant?: RestaurantIdentity;
}) {
  const r = restaurant ?? DEFAULT_RESTAURANT;
  const dessertSec = getSection("Desserts", sectionMap);
  const dessertItems = getSectionItems("Desserts", sectionMap, allItems);

  return (
    <div className="pc-page">
      <div className="pc-frame" aria-hidden="true" />
      <header className="pc-masthead">
        {r.logoUrl && (
          <img src={r.logoUrl} alt="" className="pc-masthead-logo" />
        )}
        <div className="pc-eyebrow">{r.eyebrowLine}</div>
        <h1 className="pc-house-name">{r.houseName}</h1>
        <p className="pc-menu-title">{menu.spiritsP2Title ?? "After Dinner"}</p>
      </header>
      <div className="pc-rule-orn" aria-hidden="true"><span>❦</span></div>

      {dessertSec && dessertItems.length > 0 && (
        <DessertsBlock section={dessertSec} items={dessertItems} />
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
              />
            );
          })}
        </div>
      </div>

      <PageFurniture furniture={menu.furniture} position="footer" />
    </div>
  );
}
