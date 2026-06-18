"use client";
// HeaderEditor — inline editable header/title/furniture fields for one menu side.
//
// Shown at the top of each SideEditorPanel, above the section list.
// Edits flow back via onMenuChange so MenuEditor's state stays the source of truth.
//
// Fields exposed:
//   - Page title (menu.pageTitle or, for spirits, spiritsP1Title / spiritsP2Title)
//   - Furniture: prixFixeHeader, introLines (one textarea, newline-separated), footerLine

import { useState } from "react";
import type { Menu } from "@/content/types";

interface Props {
  menu: Menu;
  /** Which spirits page slot this editor is for, if any */
  spiritsSlot?: "p1" | "p2";
  onMenuChange: (updated: Menu) => void;
}

export default function HeaderEditor({ menu, spiritsSlot, onMenuChange }: Props) {
  const [open, setOpen] = useState(false);

  // Determine the page title field and label based on context
  const isSpirits = menu.id === "menu-spirits";
  const pageTitleValue = isSpirits
    ? spiritsSlot === "p1"
      ? (menu.spiritsP1Title ?? "Spirits List")
      : (menu.spiritsP2Title ?? "After Dinner")
    : (menu.pageTitle ?? menu.name);

  const pageTitleLabel = isSpirits
    ? spiritsSlot === "p1"
      ? "Page title (Spirits List side)"
      : "Page title (After Dinner side)"
    : "Page title";

  const handlePageTitleChange = (val: string) => {
    if (isSpirits) {
      if (spiritsSlot === "p1") {
        onMenuChange({ ...menu, spiritsP1Title: val });
      } else {
        onMenuChange({ ...menu, spiritsP2Title: val });
      }
    } else {
      onMenuChange({ ...menu, pageTitle: val });
    }
  };

  const furniture = menu.furniture ?? {};

  const handleFurnitureChange = (patch: Partial<typeof furniture>) => {
    onMenuChange({ ...menu, furniture: { ...furniture, ...patch } });
  };

  const introLinesRaw = (furniture.introLines ?? []).join("\n");

  const handleIntroLinesChange = (raw: string) => {
    const lines = raw.split("\n").map((l) => l.trimEnd()).filter((l) => l.length > 0);
    handleFurnitureChange({ introLines: lines.length > 0 ? lines : undefined });
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={toggleBtnStyle}
        aria-expanded={open}
      >
        {open ? "▾" : "▸"} Header / Title / Furniture
      </button>

      {open && (
        <div style={panelStyle}>
          {/* Page title */}
          <label style={labelStyle}>{pageTitleLabel}</label>
          <input
            style={inputStyle}
            value={pageTitleValue}
            onChange={(e) => handlePageTitleChange(e.target.value)}
            placeholder="e.g. Dinner"
          />

          {/* Prix-fixe header (only for menus that use it) */}
          {!isSpirits && (
            <>
              <label style={labelStyle}>Prix-fixe header line</label>
              <input
                style={inputStyle}
                value={furniture.prixFixeHeader ?? ""}
                onChange={(e) =>
                  handleFurnitureChange({
                    prixFixeHeader: e.target.value || undefined,
                  })
                }
                placeholder="e.g. THREE COURSES $56 AND UP"
              />

              <label style={labelStyle}>
                Intro lines{" "}
                <span style={{ fontWeight: 400, color: "#888" }}>
                  (one per line)
                </span>
              </label>
              <textarea
                style={textareaStyle}
                value={introLinesRaw}
                onChange={(e) => handleIntroLinesChange(e.target.value)}
                rows={3}
                placeholder={"(choice of appetizer or salad, main and dessert)\nà la carte prices listed next to each item"}
              />
            </>
          )}

          {/* Footer line */}
          <label style={labelStyle}>Footer / disclaimer line</label>
          <input
            style={inputStyle}
            value={furniture.footerLine ?? ""}
            onChange={(e) =>
              handleFurnitureChange({
                footerLine: e.target.value || undefined,
              })
            }
            placeholder="e.g. *gluten free available · menu subject to change"
          />

          <p style={hintStyle}>
            Changes take effect immediately in Preview. Click Save to persist.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  border: "1px solid #d0c8b8",
  borderRadius: 6,
  marginBottom: 16,
  overflow: "hidden",
};

const toggleBtnStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  background: "#f7f4ef",
  border: "none",
  borderBottom: "1px solid #e0d8ca",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.88em",
  letterSpacing: "0.04em",
  color: "#4a3e2e",
};

const panelStyle: React.CSSProperties = {
  padding: "12px 14px",
  background: "#fdfaf5",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8em",
  fontWeight: 600,
  color: "#6b5e4a",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d0c8b8",
  borderRadius: 4,
  padding: "6px 10px",
  fontSize: "0.9em",
  fontFamily: "serif",
  color: "#222",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d0c8b8",
  borderRadius: 4,
  padding: "6px 10px",
  fontSize: "0.9em",
  fontFamily: "serif",
  color: "#222",
  resize: "vertical",
  boxSizing: "border-box",
};

const hintStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.78em",
  color: "#999",
  fontStyle: "italic",
};
