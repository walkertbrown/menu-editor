// Pelican Club themed renderer for spirit list items.
// Phase 1: Della Respira ALL-CAPS name + optional Bin number + dotted leader
// + Raleway price. Supports both single-price and two-price (glass + bottle).
// Origin/varietal in italic Cardo beneath.

import type { SpiritListItem } from "@/content/types";

interface Props {
  item: SpiritListItem;
}

const isTwoPrice = (item: SpiritListItem) =>
  Boolean(item.glasPrice || item.bottlePrice);

export default function SpiritListItemRenderer({ item }: Props) {
  const twoPrice = isTwoPrice(item);

  return (
    <div className="pc-spirit">
      <div className="pc-spirit-line">
        <span className="pc-spirit-name">
          {item.name}
          {item.binNumber && (
            <span className="pc-spirit-bin">Bin {item.binNumber}</span>
          )}
          <span className="pc-dots" />
        </span>
        {twoPrice ? (
          <span className="pc-spirit-two-price">
            {item.glasPrice && <span>Glass ${item.glasPrice}</span>}
            {item.bottlePrice && <span>Btl ${item.bottlePrice}</span>}
          </span>
        ) : (
          <span className="pc-spirit-price">${item.price}</span>
        )}
      </div>
      {item.originVarietal && (
        <div className="pc-spirit-origin">{item.originVarietal}</div>
      )}
    </div>
  );
}
