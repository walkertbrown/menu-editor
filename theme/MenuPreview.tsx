// Pelican Club menu preview — Phase 1 read-only view.
// Renders the full styled menu: double-rule frame, masthead, sections,
// item rows, and footer. All editing state is passed in as props; nothing
// is mutated here.
//
// Per-item-type rendering is delegated to theme/renderers/*.tsx.
// Beer and cocktail sections receive their two-column grid wrapper here.
// The footer note ("✦ non-alcoholic version available") is appended to
// cocktail sections if any item has nonAlcoholicAvailable = true.

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

      {!isBeer && !isCocktail &&
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
          if (item.type === "spirit_list")
            return (
              <SpiritListItemRenderer
                key={item.id}
                item={item as SpiritListItem}
              />
            );
          return null;
        })}
    </section>
  );
}

// ---- Main preview ----------------------------------------------------------

export default function MenuPreview({ menu, sections, items }: Props) {
  const orderedSections = [...sections].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <div className="pc-preview-wrap">
      <div className="pc-page">
        {/* Double-rule border frame */}
        <div className="pc-frame" aria-hidden="true" />

        {/* Masthead */}
        <header className="pc-masthead">
          <div className="pc-eyebrow">New Orleans · Established 1990</div>
          <h1 className="pc-house-name">The Pelican Club</h1>
          <p className="pc-menu-title">{menu.name}</p>
        </header>

        {/* Fleuron divider */}
        <div className="pc-rule-orn" aria-hidden="true">
          <span>❦</span>
        </div>

        {/* Prix-fixe header / intro lines */}
        <PageFurniture furniture={menu.furniture} position="header" />

        {/* Menu sections */}
        {orderedSections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            items={items
              .filter((i) => i.sectionId === section.id)
              .sort((a, b) => a.sortOrder - b.sortOrder)}
          />
        ))}

        {/* Footer */}
        <PageFurniture furniture={menu.furniture} position="footer" />
      </div>
    </div>
  );
}
