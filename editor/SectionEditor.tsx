"use client";
// Renders a single section header with rename, delete, and move-up/move-down controls.
// Items within the section are rendered by the parent (MenuEditor) via DndContext.

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Item, Section } from "@/content/types";
import ItemCard from "./ItemCard";

interface Props {
  section: Section;
  items: Item[];
  isFirst: boolean;
  isLast: boolean;
  onRename: (name: string) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddItem: (type: Item["type"]) => void;
  onUpdateItem: (item: Item) => void;
  onDeleteItem: (itemId: string) => void;
}

const ITEM_TYPES: Item["type"][] = [
  "food",
  "wine_by_glass",
  "beer_cider",
  "cocktail",
  "spirit_list",
];

export default function SectionEditor({
  section,
  items,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
}: Props) {
  const { setNodeRef } = useDroppable({ id: `section-${section.id}` });

  return (
    <div
      style={{
        marginBottom: 24,
        border: "1px solid #bbb",
        borderRadius: 8,
        padding: 12,
        background: "#f8f8f8",
      }}
    >
      {/* Section header controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <input
          style={{
            fontWeight: 700,
            fontSize: "1em",
            border: "none",
            borderBottom: "1px solid #ccc",
            background: "transparent",
            padding: "2px 4px",
            flex: 1,
          }}
          value={section.name}
          onChange={(e) => onRename(e.target.value)}
          title="Rename section"
        />
        <button onClick={onMoveUp} disabled={isFirst} style={iconBtnStyle} title="Move section up">
          ↑
        </button>
        <button onClick={onMoveDown} disabled={isLast} style={iconBtnStyle} title="Move section down">
          ↓
        </button>
        <button
          onClick={onDelete}
          style={{ ...iconBtnStyle, color: "#c00" }}
          title="Delete section"
        >
          ✕
        </button>
      </div>

      {/* Items list — droppable + sortable */}
      <div ref={setNodeRef}>
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {items.length === 0 && (
            <div
              style={{
                padding: "12px",
                color: "#aaa",
                fontStyle: "italic",
                fontSize: "0.9em",
                border: "1px dashed #ccc",
                borderRadius: 4,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              No items yet — add one below.
            </div>
          )}
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onUpdate={onUpdateItem}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))}
        </SortableContext>
      </div>

      {/* Add item */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: "0.8em", color: "#666" }}>Add item:</span>
        {ITEM_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onAddItem(type)}
            style={addBtnStyle}
            title={`Add ${type.replace(/_/g, " ")}`}
          >
            + {type.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
}

const iconBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #ccc",
  borderRadius: 4,
  cursor: "pointer",
  padding: "2px 6px",
  fontSize: "0.85em",
};

const addBtnStyle: React.CSSProperties = {
  background: "#f0f0f0",
  border: "1px solid #ccc",
  borderRadius: 4,
  cursor: "pointer",
  padding: "3px 8px",
  fontSize: "0.75em",
};
