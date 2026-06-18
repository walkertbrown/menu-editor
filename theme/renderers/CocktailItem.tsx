// Pelican Club themed renderer for cocktail items.
// Phase 1: two-column grid layout (applied by parent), Della Respira name
// with ✦ marker if non-alcoholic version available, dotted leader, Raleway price.
// Ingredient line in italic Cardo beneath.
//
// Note: the two-column grid (.pc-cocktails-grid) is applied by the section
// container (MenuPreview / SectionBlock). This component renders a single card.

import type { CocktailItem } from "@/content/types";

interface Props {
  item: CocktailItem;
}

export default function CocktailItemRenderer({ item }: Props) {
  return (
    <div className="pc-cocktail">
      <div className="pc-cocktail-line">
        <span className="pc-cocktail-name">
          {item.name}
          {item.nonAlcoholicAvailable && (
            <span className="pc-cocktail-star" title="Non-alcoholic version available">
              ✦
            </span>
          )}
          <span className="pc-dots" />
        </span>
        <span className="pc-cocktail-price">${item.price}</span>
      </div>
      {item.ingredients && (
        <div className="pc-cocktail-desc">{item.ingredients}</div>
      )}
    </div>
  );
}
