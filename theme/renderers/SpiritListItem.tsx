// Stub renderer for spirit list items.
// Handles both single-price entries and two-price (glass + bottle) entries
// used for ports and dessert wines.
// Phase 0: functional, intentionally unstyled.

import type { SpiritListItem } from "@/content/types";

interface Props {
  item: SpiritListItem;
}

const isTwoPrice = (item: SpiritListItem) =>
  Boolean(item.glasPrice || item.bottlePrice);

export default function SpiritListItemRenderer({ item }: Props) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <span style={{ fontWeight: 500 }}>{item.name}</span>
          {item.binNumber && (
            <span style={{ marginLeft: 8, fontSize: "0.75em", color: "#888" }}>
              Bin {item.binNumber}
            </span>
          )}
        </div>
        {isTwoPrice(item) ? (
          <div style={{ display: "flex", gap: 12, marginLeft: 16, fontSize: "0.9em" }}>
            {item.glasPrice && <span>Glass {item.glasPrice}</span>}
            {item.bottlePrice && <span>Bottle {item.bottlePrice}</span>}
          </div>
        ) : (
          <span style={{ fontWeight: 500, marginLeft: 16 }}>{item.price}</span>
        )}
      </div>
      {item.originVarietal && (
        <div style={{ fontSize: "0.8em", color: "#666", marginTop: 2 }}>
          {item.originVarietal}
        </div>
      )}
    </div>
  );
}
