// Pelican Club themed renderer for food items.
// Phase 1: Della Respira name in ALL-CAPS + dotted leader + Raleway price.
// GF flag renders as a small bordered "gf" badge.
// Surcharge renders as italic "(+$3)" in Cardo.
// Description renders in italic Cardo beneath.

import type { FoodItem } from "@/content/types";
import SpotWrap from "@/theme/SpotWrap";
import { itemSpotId } from "@/theme/spotSpacing";

interface Props {
  item: FoodItem;
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  spotCategories?: Record<string, string>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
  /** True when rendered inside a CSS multi-column grid (see SpotWrap.spacingAsPadding). */
  inColumn?: boolean;
}

export default function FoodItemRenderer({
  item,
  overrides,
  categorySpacing,
  spotCategories,
  editMode,
  selectedSpotId,
  onSelectSpot,
  inColumn,
}: Props) {
  return (
    <SpotWrap
      spotId={itemSpotId(item.id)}
      overrides={overrides}
      categorySpacing={categorySpacing}
      spotCategories={spotCategories}
      spacingAsPadding={inColumn}
      editMode={editMode}
      selectedSpotId={selectedSpotId}
      onSelectSpot={onSelectSpot}
    >
      <div className="pc-food">
        <div className="pc-food-line">
          <span className="pc-food-name">
            {item.name}
            {item.gf && <span className="pc-gf">gf</span>}
            {item.surcharge && (
              <span className="pc-surcharge">
                {item.surcharge.startsWith("(") ? item.surcharge : `(${item.surcharge})`}
              </span>
            )}
            <span className="pc-dots" />
          </span>
          <span className="pc-food-price">${item.price}</span>
        </div>
        {item.description && (
          <div className="pc-food-desc">{item.description}</div>
        )}
      </div>
    </SpotWrap>
  );
}
