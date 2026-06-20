// Pelican Club themed renderer for beer and cider items.
// Phase 1: compact two-column row (handled by parent grid), Della Respira name,
// dotted leader, Raleway price. N/A tag in italic Cardo for non-alcoholic options.
//
// Note: the two-column grid (.pc-beer-grid) is applied by the section container
// (MenuPreview / SectionBlock), not here. This component renders a single row.

import type { BeerCiderItem } from "@/content/types";
import SpotWrap from "@/theme/SpotWrap";
import { itemSpotId } from "@/theme/spotSpacing";

interface Props {
  item: BeerCiderItem;
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  spotCategories?: Record<string, string>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}

export default function BeerCiderItemRenderer({
  item,
  overrides,
  categorySpacing,
  spotCategories,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: Props) {
  return (
    <SpotWrap
      spotId={itemSpotId(item.id)}
      overrides={overrides}
      categorySpacing={categorySpacing}
      spotCategories={spotCategories}
      editMode={editMode}
      selectedSpotId={selectedSpotId}
      onSelectSpot={onSelectSpot}
    >
      <div className="pc-beer">
        <span className="pc-beer-name">
          {item.name}
          {item.nonAlcoholic && (
            <span className="pc-beer-na">N/A</span>
          )}
          <span className="pc-dots" />
        </span>
        <span className="pc-beer-price">${item.price}</span>
      </div>
    </SpotWrap>
  );
}
