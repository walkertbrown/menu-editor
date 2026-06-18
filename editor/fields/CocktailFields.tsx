"use client";
// Inline-edit fields for cocktail items.

import type { CocktailItem } from "@/content/types";

interface Props {
  item: CocktailItem;
  onChange: (updated: CocktailItem) => void;
}

export default function CocktailFields({ item, onChange }: Props) {
  const set = <K extends keyof CocktailItem>(key: K, value: CocktailItem[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>
        Name
        <input
          style={inputStyle}
          value={item.name}
          onChange={(e) => set("name", e.target.value)}
        />
      </label>

      <label style={labelStyle}>
        Price
        <input
          style={{ ...inputStyle, width: 80 }}
          value={item.price}
          onChange={(e) => set("price", e.target.value)}
        />
      </label>

      <label style={labelStyle}>
        Ingredients (italic line)
        <input
          style={inputStyle}
          value={item.ingredients ?? ""}
          onChange={(e) => set("ingredients", e.target.value)}
          placeholder="e.g. bourbon, honey syrup, lemon"
        />
      </label>

      <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={item.nonAlcoholicAvailable ?? false}
          onChange={(e) => set("nonAlcoholicAvailable", e.target.checked)}
        />
        Non-alcoholic version available (✦)
      </label>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  fontSize: "0.8em",
  color: "#444",
  gap: 2,
};

const inputStyle: React.CSSProperties = {
  padding: "4px 6px",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: "0.95em",
  width: "100%",
};
