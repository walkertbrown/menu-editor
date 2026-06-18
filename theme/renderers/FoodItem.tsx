// Stub renderer for food items.
// Phase 0: functional, intentionally unstyled.
// Phase 1 will apply Pelican Club design tokens here.

import type { FoodItem } from "@/content/types";

interface Props {
  item: FoodItem;
}

export default function FoodItemRenderer({ item }: Props) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          {item.name}
          {item.gf && <sup style={{ marginLeft: 4, fontSize: "0.65em", color: "#666" }}>GF</sup>}
          {item.surcharge && (
            <span style={{ marginLeft: 6, fontWeight: 400, fontSize: "0.85em", color: "#555" }}>
              {item.surcharge}
            </span>
          )}
        </span>
        <span style={{ fontWeight: 500, marginLeft: 16 }}>{item.price}</span>
      </div>
      {item.description && (
        <div style={{ fontStyle: "italic", fontSize: "0.875em", color: "#555", marginTop: 2 }}>
          {item.description}
        </div>
      )}
    </div>
  );
}
