"use client";
/**
 * SpotNudgePopup — floating, draggable popup for per-spot spacing.
 *
 * Shows for the currently selected spot:
 *   - Friendly spot name (via spotLabel)
 *   - Per-spot NudgeSlider (override slider + number + reset)
 *   - Category dropdown: assign this spot to built-in or custom category
 *   - "New category…" option inside the dropdown to create on-the-fly
 *
 * Positioned as position:fixed at anchorRect.right + 8, clamped to viewport.
 * Draggable by the header bar (useDraggablePopup).
 * Closes on Escape / outside-click.
 *
 * Tagged pc-editor-chrome so it never prints.
 */

import { useEffect, useRef } from "react";
import { spotLabel } from "@/theme/spotSpacing";
import type { Section, Item } from "@/content/types";
import NudgeSlider from "./NudgeSlider";
import { useDraggablePopup } from "./useDraggablePopup";
import { assignedCategoryOf } from "@/theme/spotSpacing";

const BUILT_IN_CATEGORIES: Array<{ key: string; label: string }> = [
  { key: "header", label: "Section headers" },
  { key: "item", label: "Menu items" },
  { key: "masthead", label: "Masthead & intro" },
  { key: "footer", label: "Footer" },
];

interface Props {
  spotId: string;
  anchorRect: DOMRect | undefined;
  /** Current per-spot override. undefined = no override. */
  overrideValue: number | undefined;
  /** Current category spacing map (to show effective baseline). */
  categorySpacing: Record<string, number> | undefined;
  /** Custom category definitions. */
  customCategories: { id: string; name: string }[] | undefined;
  /** Current spot→category assignments. */
  spotCategories: Record<string, string> | undefined;
  /** Sections + items for resolving friendly names. */
  sections?: Section[];
  items?: Item[];
  /** Callbacks */
  onChange: (value: number) => void;
  onReset: () => void;
  onAssignCategory: (categoryId: string | null) => void;
  onCreateCategory: (name: string) => string; // returns new id
  onClose: () => void;
}

const popupStyle: React.CSSProperties = {
  position: "fixed",
  zIndex: 500,
  background: "#faf8f3",
  border: "1px solid #c5b99a",
  borderRadius: 7,
  width: 268,
  boxShadow: "0 6px 24px rgba(0,0,0,0.18)",
  userSelect: "none",
};

const headerStyle: React.CSSProperties = {
  background: "#f0ead8",
  borderBottom: "1px solid #c5b99a",
  borderRadius: "7px 7px 0 0",
  padding: "7px 10px",
  display: "flex",
  alignItems: "center",
  gap: 8,
  cursor: "grab",
};

const dragHandleStyle: React.CSSProperties = {
  fontSize: 14,
  color: "#9a8a70",
  lineHeight: 1,
};

const spotNameStyle: React.CSSProperties = {
  flex: 1,
  fontSize: 12,
  fontWeight: 600,
  color: "#2a2016",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  fontSize: 16,
  color: "#7a6a50",
  cursor: "pointer",
  padding: "0 2px",
  lineHeight: 1,
};

const bodyStyle: React.CSSProperties = {
  padding: "10px 12px",
};

const sectionLabelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "#5a5040",
  marginBottom: 6,
};

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(90,80,64,0.15)",
  margin: "8px 0",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "4px 6px",
  fontSize: 12,
  border: "1px solid #c5b99a",
  borderRadius: 4,
  background: "#faf8f3",
  color: "#2a2016",
  cursor: "pointer",
};

const baselineHintStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#9a8a70",
  fontStyle: "italic",
  marginTop: 4,
};

export default function SpotNudgePopup({
  spotId,
  anchorRect,
  overrideValue,
  categorySpacing,
  customCategories,
  spotCategories,
  sections,
  items,
  onChange,
  onReset,
  onAssignCategory,
  onCreateCategory,
  onClose,
}: Props) {
  const { pos, handleDragStart } = useDraggablePopup(anchorRect);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on outside-click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const label = spotLabel(spotId, { sections, items });
  const assignedCat = assignedCategoryOf(spotId, spotCategories);
  // Is there an explicit assignment (differs from the default built-in)?
  const hasExplicitAssignment = spotCategories?.[spotId] !== undefined;

  // Compute baseline from the assigned category
  const categoryBaseline = categorySpacing?.[assignedCat];

  // Build the category options
  const builtInOptions = BUILT_IN_CATEGORIES.map(({ key, label: l }) => ({
    id: key,
    label: l,
    isDefault: !hasExplicitAssignment && key === assignedCat,
  }));
  const customOptions = (customCategories ?? []).map(({ id, name }) => ({
    id,
    label: name,
    isDefault: false,
  }));

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (val === "__new__") {
      const name = prompt("New category name:")?.trim();
      if (name) {
        const newId = onCreateCategory(name);
        onAssignCategory(newId);
      }
      return;
    }
    if (val === "__default__") {
      onAssignCategory(null);
    } else {
      onAssignCategory(val);
    }
  }

  // Determine select value
  const selectValue = hasExplicitAssignment ? (spotCategories![spotId]) : "__default__";

  return (
    <div
      ref={popupRef}
      className="pc-editor-chrome"
      style={{ ...popupStyle, left: pos.x, top: pos.y }}
    >
      {/* Drag handle header */}
      <div style={headerStyle} onPointerDown={handleDragStart}>
        <span style={dragHandleStyle} aria-hidden="true">⠿</span>
        <span style={spotNameStyle} title={label}>{label}</span>
        <button
          style={closeBtnStyle}
          onClick={onClose}
          aria-label="Close spacing popup"
          onPointerDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      </div>

      <div style={bodyStyle}>
        {/* Per-spot override */}
        <div style={sectionLabelStyle}>Spacing nudge</div>
        <NudgeSlider
          value={overrideValue}
          onChange={onChange}
          onReset={onReset}
          resetLabel={categoryBaseline !== undefined ? "Reset to category" : "Reset to auto"}
          autoLabel={categoryBaseline !== undefined ? `Category (${categoryBaseline}px)` : "auto"}
        />

        <div style={dividerStyle} />

        {/* Category assignment */}
        <div style={sectionLabelStyle}>Category</div>
        <select
          value={selectValue}
          onChange={handleCategoryChange}
          style={selectStyle}
        >
          <option value="__default__">Default (built-in)</option>
          <optgroup label="Built-in">
            {builtInOptions.map(({ id, label: l }) => (
              <option key={id} value={id}>{l}</option>
            ))}
          </optgroup>
          {customOptions.length > 0 && (
            <optgroup label="Custom">
              {customOptions.map(({ id, label: l }) => (
                <option key={id} value={id}>{l}</option>
              ))}
            </optgroup>
          )}
          <option value="__new__">+ New category…</option>
        </select>

        {categoryBaseline !== undefined && (
          <div style={baselineHintStyle}>
            Category baseline: {categoryBaseline}px
          </div>
        )}
      </div>
    </div>
  );
}
