// Stub renderer for cocktail items.
// Phase 0: functional, intentionally unstyled.

import type { CocktailItem } from "@/content/types";

interface Props {
  item: CocktailItem;
}

export default function CocktailItemRenderer({ item }: Props) {
  return (
    <div style={{ padding: "6px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontWeight: 500 }}>
          {item.name}
          {item.nonAlcoholicAvailable && (
            <span
              title="Non-alcoholic version available"
              style={{ marginLeft: 6, fontSize: "0.85em", color: "#666" }}
            >
              ✦
            </span>
          )}
        </span>
        <span style={{ fontWeight: 500, marginLeft: 16 }}>{item.price}</span>
      </div>
      {item.ingredients && (
        <div style={{ fontStyle: "italic", fontSize: "0.875em", color: "#555", marginTop: 2 }}>
          {item.ingredients}
        </div>
      )}
    </div>
  );
}
