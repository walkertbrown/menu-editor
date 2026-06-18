// Pelican Club themed renderer for wine-by-the-glass items.
// Phase 1: Della Respira ALL-CAPS name + dotted leader + Raleway price.
// Region/vintage renders in italic Cardo beneath the name row.

import type { WineByGlassItem } from "@/content/types";

interface Props {
  item: WineByGlassItem;
}

export default function WineByGlassItemRenderer({ item }: Props) {
  return (
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
  );
}
