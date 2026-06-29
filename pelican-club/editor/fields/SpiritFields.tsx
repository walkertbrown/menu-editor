"use client";
// Inline-edit fields for spirit list items.
// Supports both single-price and two-price (glass + bottle) variants.

import type { SpiritListItem } from "@/content/types";

interface Props {
  item: SpiritListItem;
  onChange: (updated: SpiritListItem) => void;
}

export default function SpiritFields({ item, onChange }: Props) {
  const set = <K extends keyof SpiritListItem>(key: K, value: SpiritListItem[K]) =>
    onChange({ ...item, [key]: value });

  const isTwoPrice = Boolean(item.glasPrice || item.bottlePrice);

  const togglePriceMode = () => {
    if (isTwoPrice) {
      // Switch to single price
      onChange({ ...item, glasPrice: undefined, bottlePrice: undefined, binNumber: undefined, price: item.glasPrice ?? "" });
    } else {
      // Switch to two-price
      onChange({ ...item, price: undefined, glasPrice: item.price ?? "", bottlePrice: "" });
    }
  };

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
        Origin / Varietal
        <input
          style={inputStyle}
          value={item.originVarietal ?? ""}
          onChange={(e) => set("originVarietal", e.target.value)}
          placeholder="e.g. Cognac · France"
        />
      </label>

      <label style={labelStyle}>
        Group
        <input
          style={inputStyle}
          value={item.group ?? ""}
          onChange={(e) => set("group", e.target.value)}
          placeholder="e.g. Rum, Digestifs, Port & Dessert Wine"
        />
      </label>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
        <label style={{ ...labelStyle, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 0 }}>
          <input
            type="checkbox"
            checked={isTwoPrice}
            onChange={togglePriceMode}
          />
          Two-price (glass + bottle)
        </label>
      </div>

      {isTwoPrice ? (
        <>
          <div style={{ display: "flex", gap: 8 }}>
            <label style={labelStyle}>
              Glass price
              <input
                style={{ ...inputStyle, width: 80 }}
                value={item.glasPrice ?? ""}
                onChange={(e) => set("glasPrice", e.target.value)}
              />
            </label>
            <label style={labelStyle}>
              Bottle price
              <input
                style={{ ...inputStyle, width: 80 }}
                value={item.bottlePrice ?? ""}
                onChange={(e) => set("bottlePrice", e.target.value)}
              />
            </label>
          </div>
          <label style={labelStyle}>
            Bin number
            <input
              style={{ ...inputStyle, width: 80 }}
              value={item.binNumber ?? ""}
              onChange={(e) => set("binNumber", e.target.value)}
              placeholder="e.g. B1"
            />
          </label>
        </>
      ) : (
        <label style={labelStyle}>
          Price
          <input
            style={{ ...inputStyle, width: 80 }}
            value={item.price ?? ""}
            onChange={(e) => set("price", e.target.value)}
          />
        </label>
      )}
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
