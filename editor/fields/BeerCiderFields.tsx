"use client";
// Inline-edit fields for beer and cider items.

import type { BeerCiderItem } from "@/content/types";

interface Props {
  item: BeerCiderItem;
  onChange: (updated: BeerCiderItem) => void;
}

export default function BeerCiderFields({ item, onChange }: Props) {
  const set = <K extends keyof BeerCiderItem>(key: K, value: BeerCiderItem[K]) =>
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

      <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <input
          type="checkbox"
          checked={item.nonAlcoholic ?? false}
          onChange={(e) => set("nonAlcoholic", e.target.checked)}
        />
        Non-alcoholic (N/A)
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
