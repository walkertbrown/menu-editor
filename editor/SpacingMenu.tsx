"use client";
/**
 * SpacingMenu — "Spacing ▾" popover button.
 *
 * Lists every spacing category (4 built-ins + custom ones) as rows.
 * Each row = friendly label + NudgeSlider + Reset.
 * "+ New category" action prompts for a name and creates a custom category.
 * Closes on outside-click or Escape.
 * Tagged pc-editor-chrome so it never prints.
 */

import { useRef, useEffect, useState } from "react";
import NudgeSlider from "./NudgeSlider";

const BUILT_IN_CATEGORIES: Array<{ key: string; label: string }> = [
  { key: "header", label: "Section headers" },
  { key: "item", label: "Menu items" },
  { key: "masthead", label: "Masthead & intro" },
  { key: "footer", label: "Footer" },
];

interface Props {
  categorySpacing: Record<string, number> | undefined;
  customCategories: { id: string; name: string }[] | undefined;
  onChange: (category: string, value: number) => void;
  onReset: (category: string) => void;
  onCreateCategory: (name: string) => void;
}

const popoverStyle: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 4px)",
  left: 0,
  zIndex: 200,
  background: "#faf8f3",
  border: "1px solid #c5b99a",
  borderRadius: 6,
  padding: "10px 14px",
  minWidth: 280,
  boxShadow: "0 4px 16px rgba(0,0,0,0.14)",
};

const triggerBtnStyle: React.CSSProperties = {
  background: "#faf8f3",
  color: "#3a3020",
  border: "1px solid #c5b99a",
  borderRadius: 5,
  padding: "5px 11px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.04em",
  whiteSpace: "nowrap",
};

const headingStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "#5a5040",
  marginBottom: 8,
};

const rowStyle: React.CSSProperties = {
  marginBottom: 10,
};

const dividerStyle: React.CSSProperties = {
  borderTop: "1px solid rgba(90,80,64,0.15)",
  margin: "8px 0",
};

const newCatBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px dashed #c5b99a",
  borderRadius: 4,
  color: "#7a6a50",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.06em",
  padding: "4px 10px",
  cursor: "pointer",
  marginTop: 2,
  width: "100%",
};

export default function SpacingMenu({
  categorySpacing,
  customCategories,
  onChange,
  onReset,
  onCreateCategory,
}: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on outside-click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  function handleNewCategory() {
    const name = prompt("New category name:")?.trim();
    if (name) {
      onCreateCategory(name);
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="pc-editor-chrome"
      style={{ position: "relative", display: "inline-block" }}
    >
      <button
        style={triggerBtnStyle}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        Spacing {open ? "▴" : "▾"}
      </button>

      {open && (
        <div style={popoverStyle}>
          <div style={headingStyle}>Category spacing</div>

          {/* Built-in categories */}
          {BUILT_IN_CATEGORIES.map(({ key, label }) => (
            <div key={key} style={rowStyle}>
              <NudgeSlider
                label={label}
                value={categorySpacing?.[key]}
                onChange={(v) => onChange(key, v)}
                onReset={() => onReset(key)}
                resetLabel="Reset"
                autoLabel="auto"
              />
            </div>
          ))}

          {/* Custom categories */}
          {customCategories && customCategories.length > 0 && (
            <>
              <div style={dividerStyle} />
              <div style={{ ...headingStyle, marginTop: 4 }}>Custom</div>
              {customCategories.map(({ id, name }) => (
                <div key={id} style={rowStyle}>
                  <NudgeSlider
                    label={name}
                    value={categorySpacing?.[id]}
                    onChange={(v) => onChange(id, v)}
                    onReset={() => onReset(id)}
                    resetLabel="Reset"
                    autoLabel="auto"
                  />
                </div>
              ))}
            </>
          )}

          <div style={dividerStyle} />
          <button style={newCatBtnStyle} onClick={handleNewCategory}>
            + New category
          </button>
        </div>
      )}
    </div>
  );
}
