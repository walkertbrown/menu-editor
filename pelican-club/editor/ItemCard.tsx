"use client";
// Card shell for a single menu item.
// Dispatches to the correct field editor based on item.type.
// Also shows a stub read-only preview via the theme renderers.
// Drag handle is exposed for dnd-kit integration.

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Item } from "@/content/types";
import FoodFields from "./fields/FoodFields";
import WineFields from "./fields/WineFields";
import BeerCiderFields from "./fields/BeerCiderFields";
import CocktailFields from "./fields/CocktailFields";
import SpiritFields from "./fields/SpiritFields";
import type { FoodItem, WineByGlassItem, BeerCiderItem, CocktailItem, SpiritListItem } from "@/content/types";

interface Props {
  item: Item;
  onUpdate: (updated: Item) => void;
  onDelete: () => void;
}

export default function ItemCard({ item, onUpdate, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle + type badge + delete */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            {...attributes}
            {...listeners}
            style={{ cursor: "grab", color: "#aaa", fontSize: "1.2em", lineHeight: 1 }}
            title="Drag to reorder"
          >
            ⠿
          </span>
          <span
            style={{
              fontSize: "0.7em",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              background: typeColor(item.type),
              color: "#fff",
              borderRadius: 3,
              padding: "2px 6px",
            }}
          >
            {item.type.replace(/_/g, " ")}
          </span>
        </div>
        <button
          onClick={onDelete}
          style={{
            background: "none",
            border: "none",
            color: "#c00",
            cursor: "pointer",
            fontSize: "0.85em",
            padding: "2px 4px",
          }}
          title="Delete item"
        >
          Delete
        </button>
      </div>

      {/* Field editor — dispatched by type */}
      {item.type === "food" && (
        <FoodFields item={item as FoodItem} onChange={(u) => onUpdate(u)} />
      )}
      {item.type === "wine_by_glass" && (
        <WineFields item={item as WineByGlassItem} onChange={(u) => onUpdate(u)} />
      )}
      {item.type === "beer_cider" && (
        <BeerCiderFields item={item as BeerCiderItem} onChange={(u) => onUpdate(u)} />
      )}
      {item.type === "cocktail" && (
        <CocktailFields item={item as CocktailItem} onChange={(u) => onUpdate(u)} />
      )}
      {item.type === "spirit_list" && (
        <SpiritFields item={item as SpiritListItem} onChange={(u) => onUpdate(u)} />
      )}
    </div>
  );
}

function typeColor(type: Item["type"]): string {
  const colors: Record<Item["type"], string> = {
    food: "#5a7a5a",
    wine_by_glass: "#7a4a7a",
    beer_cider: "#7a6a3a",
    cocktail: "#4a6a8a",
    spirit_list: "#8a5a3a",
  };
  return colors[type] ?? "#666";
}
