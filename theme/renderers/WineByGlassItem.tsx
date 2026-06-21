// Pelican Club themed renderer for wine-by-the-glass items.
// Phase 1: Della Respira ALL-CAPS name + dotted leader + Raleway price.
// Region/vintage renders in italic Cardo beneath the name row.

import type { WineByGlassItem } from "@/content/types";
import SpotWrap from "@/theme/SpotWrap";
import { itemSpotId } from "@/theme/spotSpacing";

interface Props {
  item: WineByGlassItem;
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  spotCategories?: Record<string, string>;
  spacingBaseline?: Record<string, number>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
  /** True when rendered inside a CSS multi-column grid (see SpotWrap.spacingAsPadding). */
  inColumn?: boolean;
}

export default function WineByGlassItemRenderer({
  item,
  overrides,
  categorySpacing,
  spotCategories,
  spacingBaseline,
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
      spacingBaseline={spacingBaseline}
      spacingAsPadding={inColumn}
      editMode={editMode}
      selectedSpotId={selectedSpotId}
      onSelectSpot={onSelectSpot}
    >
      <div className="pc-wine">
        <div className="pc-wine-line">
          <span className="pc-wine-name">
            {item.name}
            <span className="pc-dots" />
          </span>
          <span className="pc-wine-price">${item.price}</span>
        </div>
        {item.regionVintage && (
          <div className="pc-wine-region">{item.regionVintage}</div>
        )}
      </div>
    </SpotWrap>
  );
}
