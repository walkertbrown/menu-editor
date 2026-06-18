// Stub renderer for beer and cider items.
// Phase 0: functional, intentionally unstyled.

import type { BeerCiderItem } from "@/content/types";

interface Props {
  item: BeerCiderItem;
}

export default function BeerCiderItemRenderer({ item }: Props) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 500 }}>
          {item.name}
          {item.nonAlcoholic && (
            <span style={{ marginLeft: 8, fontSize: "0.75em", color: "#888", fontWeight: 400 }}>
              N/A
            </span>
          )}
        </span>
        <span style={{ fontWeight: 500, marginLeft: 16 }}>{item.price}</span>
      </div>
    </div>
  );
}
