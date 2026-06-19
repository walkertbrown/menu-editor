"use client";
// SheetEditorPage — top-level page for one double-sided sheet.
//
// Layout: collapsible docked sidebar on the LEFT; live preview on the RIGHT.
//   Sidebar OPEN  → preview shows only the active side (enlarged).
//   Sidebar CLOSED → preview shows the full two-page spread.
//
// Front/Back toggle at the top of the sidebar selects the edited side and
// drives which single side the enlarged preview shows.
//
// Spacing state (categorySpacing + spacingOverrides) is owned here via
// useSpotSpacing. It is merged into menus for preview and read at save time
// via a ref in MenuEditor — never duplicated into MenuEditor's own state.

import { useState, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
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
import SpacingControl from "./SpacingControl";
import CategorySpacingControl from "./CategorySpacingControl";
import SheetPreviewSpread from "@/theme/SheetPreviewSpread";
import { useSpotSpacing } from "./useSpotSpacing";
import { categoryOfSpot } from "@/theme/spotSpacing";
import {
  tabBarStyle,
  backLinkStyle,
  printBtnStyle,
  activeTabStyle,
  inactiveTabStyle,
  collapseToggleStyle,
  sidebarContainerStyle,
  faceToggleGroupStyle,
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

type Face = "front" | "back";

export default function SheetEditorPage({
  sheet,
  frontData,
  backData,
  restaurant: initialRestaurant,
  sheetTitle,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeFace, setActiveFace] = useState<Face>("front");

  // Live preview state for both sides (sections/items/header — not spacing)
  const [liveFront, setLiveFront] = useState(frontData);
  const [liveBack, setLiveBack] = useState(backData);

  // Restaurant identity (shared across all pages — live-synced for preview)
  const [liveRestaurant, setLiveRestaurant] =
    useState<RestaurantIdentity>(initialRestaurant);

  // Track whether we are in a print-triggered full-spread momentarily
  const [printingSpread, setPrintingSpread] = useState(false);
  const printingRef = useRef(false);

  // Per-spot spacing: selected spot id (cleared when switching sides)
  const [selectedSpotId, setSelectedSpotId] = useState<string | undefined>(undefined);

  // Spacing state owned here, merged into preview and save via ref
  const {
    spacingFor,
    handleSpacingChange,
    handleSpacingReset,
    handleCategoryChange,
    handleCategoryReset,
    mergeSpacingIntoMenu,
  } = useSpotSpacing(frontData.menu, backData.menu);

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

  const handlePrint = useCallback(() => {
    if (printingRef.current) return;
    printingRef.current = true;
    flushSync(() => setPrintingSpread(true));
    window.print();
    setPrintingSpread(false);
    printingRef.current = false;
  }, []);

  const handleSetActiveFace = useCallback((face: Face) => {
    setActiveFace(face);
    setSelectedSpotId(undefined);
  }, []);

  const focusSide: Face | undefined =
    printingSpread ? undefined : sidebarOpen ? activeFace : undefined;
  const isEditMode = !printingSpread;

  // Spacing for the active face
  const activeSpacing = spacingFor(activeFace);
  const activeSpacingValue = selectedSpotId !== undefined
    ? activeSpacing.spacingOverrides?.[selectedSpotId]
    : undefined;
  const activeCategoryBaseline = selectedSpotId !== undefined
    ? activeSpacing.categorySpacing?.[categoryOfSpot(selectedSpotId)]
    : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Top chrome bar */}
      <div className="pc-editor-chrome" style={tabBarStyle}>
        <a href="/" style={backLinkStyle}>← All Sheets</a>
        <SheetTitleEditor sheetId={sheet.id} initialTitle={sheetTitle} />
        <div style={{ flex: 1 }} />
        <button
          className="pc-editor-chrome"
          onClick={() => setSidebarOpen((o) => !o)}
          style={collapseToggleStyle}
        >
          {sidebarOpen ? "Hide editor" : "Show editor"}
        </button>
        <button className="pc-editor-chrome" onClick={handlePrint} style={printBtnStyle}>
          Print / Save PDF
        </button>
      </div>

      {/* Main body: sidebar + preview */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {sidebarOpen && (
          <div className="pc-editor-chrome" style={sidebarContainerStyle}>
            {/* Restaurant identity */}
            <div style={{ padding: "10px 14px 0" }}>
              <RestaurantEditor
                restaurant={liveRestaurant}
                onRestaurantChange={setLiveRestaurant}
              />
            </div>

            {/* Category-level spacing (always visible) */}
            <CategorySpacingControl
              categorySpacing={activeSpacing.categorySpacing}
              onChange={(cat, val) => handleCategoryChange(activeFace, cat, val)}
              onReset={(cat) => handleCategoryReset(activeFace, cat)}
            />

            {/* Per-spot spacing control (visible when a spot is selected) */}
            <SpacingControl
              selectedSpotId={selectedSpotId}
              value={activeSpacingValue}
              categoryBaseline={activeCategoryBaseline}
              onChange={(val) => selectedSpotId && handleSpacingChange(activeFace, selectedSpotId, val)}
              onReset={() => selectedSpotId && handleSpacingReset(activeFace, selectedSpotId)}
            />

            {/* Front / Back toggle */}
            <div className="pc-editor-chrome" style={faceToggleGroupStyle}>
              <button
                onClick={() => handleSetActiveFace("front")}
                style={activeFace === "front" ? activeTabStyle : inactiveTabStyle}
              >
                Front — {sheet.front.label}
              </button>
              <button
                onClick={() => handleSetActiveFace("back")}
                style={activeFace === "back" ? activeTabStyle : inactiveTabStyle}
              >
                Back — {sheet.back.label}
              </button>
            </div>

            {/* Active side editor */}
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
                spacing={spacingFor("front")}
                embedded
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
                spacing={spacingFor("back")}
                embedded
              />
            )}
          </div>
        )}

        {/* RIGHT: live preview */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          <SheetPreviewSpread
            sheet={sheet}
            frontData={{
              menu: mergeSpacingIntoMenu("front", liveFront.menu),
              sections: liveFront.sections,
              items: liveFront.items,
            }}
            backData={{
              menu: mergeSpacingIntoMenu("back", liveBack.menu),
              sections: liveBack.sections,
              items: liveBack.items,
            }}
            restaurant={liveRestaurant}
            focusSide={focusSide}
            editMode={isEditMode}
            selectedSpotId={selectedSpotId}
            onSelectSpot={setSelectedSpotId}
          />
        </div>
      </div>
    </div>
  );
}
