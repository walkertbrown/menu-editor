// Pelican Club themed renderer for spirit list items.
// Supports three layouts:
//   1. Standard spirit: ALL-CAPS name + optional origin/varietal italic +
//      dotted leader + Raleway price
//   2. Port / dessert wine (has binNumber + glasPrice + bottlePrice):
//      bin | name | glass price | bottle price (4-column grid, right-aligned prices)
// Origin/varietal in italic Cardo beneath (standard only).

import type { SpiritListItem } from "@/content/types";

interface Props {
  item: SpiritListItem;
}

const isPort = (item: SpiritListItem) =>
  Boolean(item.binNumber || item.glasPrice || item.bottlePrice);

export default function SpiritListItemRenderer({ item }: Props) {
  if (isPort(item)) {
    // Port / dessert wine: 4-column grid matching .pc-ports-row
    return (
      <div className="pc-ports-row">
        <span className="pc-ports-bin">{item.binNumber ?? ""}</span>
        <span className="pc-ports-name">{item.name}</span>
        <span className="pc-ports-price">{item.glasPrice ? `$${item.glasPrice}` : ""}</span>
        <span className="pc-ports-price">{item.bottlePrice ? `$${item.bottlePrice}` : ""}</span>
      </div>
    );
  }

  return (
    <div className="pc-spirit">
      <div className="pc-spirit-line">
        <span className="pc-spirit-name">
          {item.name}
          <span className="pc-dots" />
        </span>
        <span className="pc-spirit-price">${item.price}</span>
      </div>
      {item.originVarietal && (
        <div className="pc-spirit-origin">{item.originVarietal}</div>
      )}
    </div>
  );
}
