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
// Spacing state (categorySpacing + spacingOverrides + customCategories +
// spotCategories) is owned here via useSpotSpacing. It is merged into menus
// for preview and read at save time via a ref in MenuEditor — never duplicated
// into MenuEditor's own state.
//
// Phase 2: CategorySpacingControl sidebar panel replaced by "Spacing ▾" button.
// Phase 3: Per-spot SpacingControl sidebar panel replaced by floating SpotNudgePopup.

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
import SpacingMenu from "./SpacingMenu";
import SpotNudgePopup from "./SpotNudgePopup";
import ZoomControl from "./ZoomControl";
import SheetPreviewSpread from "@/theme/SheetPreviewSpread";
import { useSpotSpacing } from "./useSpotSpacing";
import { usePreviewZoom } from "./usePreviewZoom";
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

  // Preview zoom (fit-width / fit-page / manual) + effective % for the toolbar.
  const { zoom, scalePercent, onScaleChange, zoomIn, zoomOut, fitPage, fitWidth } =
    usePreviewZoom();

  // Live preview state for both sides (sections/items/header — not spacing)
  const [liveFront, setLiveFront] = useState(frontData);
  const [liveBack, setLiveBack] = useState(backData);

  // Restaurant identity (shared across all pages — live-synced for preview)
  const [liveRestaurant, setLiveRestaurant] =
    useState<RestaurantIdentity>(initialRestaurant);

  // Track whether we are in a print-triggered full-spread momentarily
  const [printingSpread, setPrintingSpread] = useState(false);
  const printingRef = useRef(false);

  // Phase 3: selected spot + anchor rect for the floating popup
  const [selectedSpotId, setSelectedSpotId] = useState<string | undefined>(undefined);
  const [anchorRect, setAnchorRect] = useState<DOMRect | undefined>(undefined);

  // Spacing state owned here, merged into preview and save via ref
  const {
    spacingFor,
    handleSpacingChange,
    handleSpacingReset,
    handleCategoryChange,
    handleCategoryReset,
    handleCreateCategory,
    handleAssignSpot,
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
    setAnchorRect(undefined);
  }, []);

  // Phase 3: click handler from preview passes the viewport rect of the spot
  const handleSelectSpot = useCallback((id: string, rect?: DOMRect) => {
    setSelectedSpotId(id);
    setAnchorRect(rect);
  }, []);

  const focusSide: Face | undefined =
    printingSpread ? undefined : sidebarOpen ? activeFace : undefined;
  const isEditMode = !printingSpread;

  // Spacing for the active face
  const activeSpacing = spacingFor(activeFace);
  const activeSpacingValue = selectedSpotId !== undefined
    ? activeSpacing.spacingOverrides?.[selectedSpotId]
    : undefined;

  // Sections/items for the active face (for friendly spot labels)
  const activeSections = activeFace === "front" ? liveFront.sections : liveBack.sections;
  const activeItems = activeFace === "front" ? liveFront.items : liveBack.items;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* Top chrome bar */}
      <div className="pc-editor-chrome" style={tabBarStyle}>
        <a href="/" style={backLinkStyle}>← All Sheets</a>
        <SheetTitleEditor sheetId={sheet.id} initialTitle={sheetTitle} />
        <div style={{ flex: 1 }} />

        {/* Phase 2: Spacing ▾ dropdown */}
        <SpacingMenu
          categorySpacing={activeSpacing.categorySpacing}
          customCategories={activeSpacing.customCategories}
          onChange={(cat, val) => handleCategoryChange(activeFace, cat, val)}
          onReset={(cat) => handleCategoryReset(activeFace, cat)}
          onCreateCategory={(name) => handleCreateCategory(activeFace, name)}
        />

        <ZoomControl
          scalePercent={scalePercent}
          onZoomOut={zoomOut}
          onZoomIn={zoomIn}
          onFitPage={fitPage}
          onFitWidth={fitWidth}
        />

        <button
          className="pc-editor-chrome"
          onClick={() => setSidebarOpen((o) => !o)}
          style={{ ...collapseToggleStyle, marginLeft: 8 }}
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
            onSelectSpot={handleSelectSpot}
            zoom={zoom}
            onScaleChange={onScaleChange}
          />
        </div>
      </div>

      {/* Phase 3: floating SpotNudgePopup — rendered outside the scaled preview */}
      {isEditMode && selectedSpotId && (
        <SpotNudgePopup
          spotId={selectedSpotId}
          anchorRect={anchorRect}
          overrideValue={activeSpacingValue}
          categorySpacing={activeSpacing.categorySpacing}
          customCategories={activeSpacing.customCategories}
          spotCategories={activeSpacing.spotCategories}
          sections={activeSections}
          items={activeItems}
          onChange={(val) => handleSpacingChange(activeFace, selectedSpotId, val)}
          onReset={() => handleSpacingReset(activeFace, selectedSpotId)}
          onAssignCategory={(catId) => handleAssignSpot(activeFace, selectedSpotId, catId)}
          onCreateCategory={(name) => handleCreateCategory(activeFace, name)}
          onClose={() => {
            setSelectedSpotId(undefined);
            setAnchorRect(undefined);
          }}
        />
      )}
    </div>
  );
}
