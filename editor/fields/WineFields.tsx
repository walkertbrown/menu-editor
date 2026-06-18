"use client";
// Inline-edit fields for wine-by-the-glass items.

import type { WineByGlassItem, WineGroup } from "@/content/types";

const WINE_GROUPS: WineGroup[] = ["Sparkling", "White & Rosé", "Red"];

interface Props {
  item: WineByGlassItem;
  onChange: (updated: WineByGlassItem) => void;
}

export default function WineFields({ item, onChange }: Props) {
  const set = <K extends keyof WineByGlassItem>(key: K, value: WineByGlassItem[K]) =>
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
        Region / Vintage
        <input
          style={inputStyle}
          value={item.regionVintage ?? ""}
          onChange={(e) => set("regionVintage", e.target.value)}
          placeholder="e.g. Loire, France '24"
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
        Group
        <select
          style={inputStyle}
          value={item.group}
          onChange={(e) => set("group", e.target.value as WineGroup)}
        >
          {WINE_GROUPS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
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
