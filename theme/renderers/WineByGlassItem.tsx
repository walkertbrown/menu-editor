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
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string) => void;
}

export default function WineByGlassItemRenderer({
  item,
  overrides,
  categorySpacing,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: Props) {
  return (
    <SpotWrap
      spotId={itemSpotId(item.id)}
      overrides={overrides}
      categorySpacing={categorySpacing}
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
