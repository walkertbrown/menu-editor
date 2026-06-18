"use client";
// SheetEditorPage — top-level page for one double-sided sheet.
//
// Edit tab: shows ONE side at a time with a Flip control that switches
//   between FRONT and BACK using a CSS 3D Y-axis flip animation.
// Preview tab: renders both sides side by side (SheetPreviewSpread).
//
// All underlying data/save/history logic flows through the existing
// MenuEditor and useMenuPersist without modification.

import { useState, useCallback, useRef } from "react";
import type { Menu, Section, Item, VersionSnapshot } from "@/content/types";
import type { SheetConfig } from "@/sheets/sheetConfig";
import SideEditorPanel from "./SideEditorPanel";
import SheetPreviewSpread from "@/theme/SheetPreviewSpread";

export interface SideData {
  menu: Menu;
  sections: Section[];
  items: Item[];
  snapshots: VersionSnapshot[];
}

interface Props {
  sheet: SheetConfig;
  frontData: SideData;
  backData: SideData;
}

type Tab = "edit" | "preview";
type Face = "front" | "back";

export default function SheetEditorPage({ sheet, frontData, backData }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("edit");
  const [activeFace, setActiveFace] = useState<Face>("front");
  const [flipping, setFlipping] = useState(false);

  // Live preview state for both sides
  const [liveFront, setLiveFront] = useState(frontData);
  const [liveBack, setLiveBack] = useState(backData);

  const handleFrontStateChange = useCallback(
    (menu: Menu, sections: Section[], items: Item[]) => {
      setLiveFront((prev) => ({ ...prev, menu, sections, items }));
    },
    []
  );

  const handleBackStateChange = useCallback(
    (menu: Menu, sections: Section[], items: Item[]) => {
      setLiveBack((prev) => ({ ...prev, menu, sections, items }));
    },
    []
  );

  const doFlip = () => {
    if (flipping) return;
    setFlipping(true);
    setTimeout(() => {
      setActiveFace((f) => (f === "front" ? "back" : "front"));
      setFlipping(false);
    }, 350);
  };

  const currentSide = activeFace === "front" ? sheet.front : sheet.back;
  const otherSide = activeFace === "front" ? sheet.back : sheet.front;
  const flipLabel = `Flip to ${otherSide.label} (${otherSide.position})`;
  const sideLabel = `${currentSide.label} — ${currentSide.position}`;

  return (
    <div>
      {/* ── Tab bar ──────────────────────────────────────────────────── */}
      <div className="pc-editor-chrome" style={tabBarStyle}>
        <a href="/" style={backLinkStyle}>← All Sheets</a>
        <div style={tabGroupStyle}>
          <button
            onClick={() => setActiveTab("edit")}
            style={activeTab === "edit" ? activeTabStyle : inactiveTabStyle}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            style={activeTab === "preview" ? activeTabStyle : inactiveTabStyle}
          >
            Preview
          </button>
        </div>
        {activeTab === "preview" && (
          <button onClick={() => window.print()} style={printBtnStyle}>
            Print / Save PDF
          </button>
        )}
      </div>

      {/* ── EDIT tab ─────────────────────────────────────────────────── */}
      {activeTab === "edit" && (
        <div>
          {/* Flip control bar */}
          <div style={flipBarStyle}>
            <span style={sideLabelStyle}>{sideLabel}</span>
            <button
              onClick={doFlip}
              disabled={flipping}
              style={flipBtnStyle}
              title={flipLabel}
            >
              {flipLabel} ⇄
            </button>
          </div>

          {/* Flip card container */}
          <div
            style={{
              perspective: "1200px",
            }}
          >
            <div
              style={{
                transformStyle: "preserve-3d",
                transition: flipping ? "transform 0.35s ease-in-out" : "none",
                transform: flipping ? "rotateY(90deg)" : "rotateY(0deg)",
              }}
            >
              {activeFace === "front" ? (
                <SideEditorPanel
                  key="front"
                  menu={frontData.menu}
                  sections={frontData.sections}
                  items={frontData.items}
                  snapshots={frontData.snapshots}
                  sectionFilter={sheet.front.sectionNames}
                  onStateChange={handleFrontStateChange}
                />
              ) : (
                <SideEditorPanel
                  key="back"
                  menu={backData.menu}
                  sections={backData.sections}
                  items={backData.items}
                  snapshots={backData.snapshots}
                  sectionFilter={sheet.back.sectionNames}
                  onStateChange={handleBackStateChange}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── PREVIEW tab ──────────────────────────────────────────────── */}
      {activeTab === "preview" && (
        <SheetPreviewSpread
          sheet={sheet}
          frontData={{
            menu: liveFront.menu,
            sections: liveFront.sections,
            items: liveFront.items,
          }}
          backData={{
            menu: liveBack.menu,
            sections: liveBack.sections,
            items: liveBack.items,
          }}
        />
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const tabBarStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 40,
  background: "#f5f5f5",
  borderBottom: "1px solid #e0e0e0",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const backLinkStyle: React.CSSProperties = {
  fontSize: "0.85em",
  color: "#666",
  textDecoration: "none",
  marginRight: 4,
};

const tabGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: 0,
  borderRadius: 6,
  overflow: "hidden",
  border: "1px solid #ccc",
};

const baseTabStyle: React.CSSProperties = {
  border: "none",
  padding: "7px 20px",
  cursor: "pointer",
  fontSize: "0.875em",
  fontWeight: 600,
  letterSpacing: "0.04em",
};

const activeTabStyle: React.CSSProperties = {
  ...baseTabStyle,
  background: "#1a1a1a",
  color: "#fff",
};

const inactiveTabStyle: React.CSSProperties = {
  ...baseTabStyle,
  background: "#fff",
  color: "#555",
};

const printBtnStyle: React.CSSProperties = {
  background: "#141210",
  color: "#f3ead7",
  border: "none",
  borderRadius: 4,
  padding: "7px 16px",
  cursor: "pointer",
  fontSize: "0.8em",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 600,
};

const flipBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 20px",
  background: "#fafafa",
  borderBottom: "1px solid #e8e8e8",
};

const sideLabelStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "0.95em",
  color: "#333",
  letterSpacing: "0.04em",
};

const flipBtnStyle: React.CSSProperties = {
  background: "#fff",
  border: "2px solid #1a1a1a",
  borderRadius: 6,
  padding: "7px 18px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.88em",
  letterSpacing: "0.04em",
  transition: "background 0.15s",
};
