"use client";
// Inline-edit fields for food items.
// Rendered inside ItemCard when item.type === "food".

import type { FoodItem } from "@/content/types";

interface Props {
  item: FoodItem;
  onChange: (updated: FoodItem) => void;
}

export default function FoodFields({ item, onChange }: Props) {
  const set = <K extends keyof FoodItem>(key: K, value: FoodItem[K]) =>
    onChange({ ...item, [key]: value });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={labelStyle}>
        Name (ALL-CAPS)
        <input
          style={inputStyle}
          value={item.name}
          onChange={(e) => set("name", e.target.value.toUpperCase())}
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
        Description (italic)
        <input
          style={inputStyle}
          value={item.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Short description…"
        />
      </label>

      <label style={labelStyle}>
        Surcharge token
        <input
          style={{ ...inputStyle, width: 100 }}
          value={item.surcharge ?? ""}
          onChange={(e) => set("surcharge", e.target.value || undefined)}
          placeholder="e.g. (+3)"
        />
      </label>

      <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={item.gf ?? false}
          onChange={(e) => set("gf", e.target.checked)}
        />
        Gluten-free (GF)
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
