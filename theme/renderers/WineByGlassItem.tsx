// Stub renderer for wine-by-the-glass items.
// Phase 0: functional, intentionally unstyled.

import type { WineByGlassItem } from "@/content/types";

interface Props {
  item: WineByGlassItem;
}

export default function WineByGlassItemRenderer({ item }: Props) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 500 }}>{item.name}</span>
        <span style={{ fontWeight: 500, marginLeft: 16 }}>{item.price}</span>
      </div>
      {item.regionVintage && (
        <div style={{ fontSize: "0.8em", color: "#666", marginTop: 2 }}>
          {item.regionVintage}
        </div>
      )}
    </div>
  );
}
