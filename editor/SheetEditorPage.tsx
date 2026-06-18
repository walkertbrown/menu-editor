"use client";
// SheetEditorPage — top-level page for one double-sided sheet.
//
// Edit tab: shows ONE side at a time with a Flip control that switches
//   between FRONT and BACK using a CSS 3D Y-axis flip animation.
// Preview tab: renders both sides side by side (SheetPreviewSpread).
//
// All underlying data/save/history logic flows through the existing
// MenuEditor and useMenuPersist without modification.

import { useState, useCallback } from "react";
import type {
  Menu,
  Section,
  Item,
  VersionSnapshot,
  RestaurantIdentity,
} from "@/content/types";
import type { SheetConfig } from "@/sheets/sheetConfig";
import SideEditorPanel from "./SideEditorPanel";
import RestaurantEditor from "./RestaurantEditor";
import SheetTitleEditor from "./SheetTitleEditor";
import SheetPreviewSpread from "@/theme/SheetPreviewSpread";
import {
  tabBarStyle,
  backLinkStyle,
  tabGroupStyle,
  activeTabStyle,
  inactiveTabStyle,
  printBtnStyle,
  flipBarStyle,
  sideLabelStyle,
  flipBtnStyle,
} from "./sheetEditorStyles";

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
  restaurant: RestaurantIdentity;
  /** Current sheet title (from data/store, may differ from sheet.name) */
  sheetTitle: string;
}

type Tab = "edit" | "preview";
type Face = "front" | "back";

export default function SheetEditorPage({
  sheet,
  frontData,
  backData,
  restaurant: initialRestaurant,
  sheetTitle,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("edit");
  const [activeFace, setActiveFace] = useState<Face>("front");
  const [flipping, setFlipping] = useState(false);

  // Live preview state for both sides
  const [liveFront, setLiveFront] = useState(frontData);
  const [liveBack, setLiveBack] = useState(backData);

  // Restaurant identity (shared across all pages — live-synced for preview)
  const [liveRestaurant, setLiveRestaurant] =
    useState<RestaurantIdentity>(initialRestaurant);

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

        <SheetTitleEditor sheetId={sheet.id} initialTitle={sheetTitle} />

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
          {/* Restaurant identity (shared — shown once above the flip) */}
          <div style={{ maxWidth: 800, margin: "16px auto 0", padding: "0 16px" }}>
            <RestaurantEditor
              restaurant={liveRestaurant}
              onRestaurantChange={setLiveRestaurant}
            />
          </div>

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
          <div style={{ perspective: "1200px" }}>
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
                  spiritsSlot={sheet.front.menuId === "menu-spirits" ? "p1" : undefined}
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
                  spiritsSlot={sheet.back.menuId === "menu-spirits" ? "p2" : undefined}
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
          restaurant={liveRestaurant}
        />
      )}
    </div>
  );
}
