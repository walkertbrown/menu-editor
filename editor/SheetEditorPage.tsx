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
// All underlying data/save/history logic flows through the existing
// MenuEditor and useMenuPersist without modification.

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
import SheetPreviewSpread from "@/theme/SheetPreviewSpread";
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

  // Live preview state for both sides
  const [liveFront, setLiveFront] = useState(frontData);
  const [liveBack, setLiveBack] = useState(backData);

  // Restaurant identity (shared across all pages — live-synced for preview)
  const [liveRestaurant, setLiveRestaurant] =
    useState<RestaurantIdentity>(initialRestaurant);

  // Track whether we are in a print-triggered full-spread momentarily
  const [printingSpread, setPrintingSpread] = useState(false);

  // Ref so the print handler can access the latest state without stale closures
  const printingRef = useRef(false);

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

  // Print: briefly switch preview to full spread so both pages are in the DOM,
  // then call window.print(). Restore focus-side immediately after.
  //
  // flushSync forces React to commit the printingSpread=true state synchronously
  // before we call window.print(). React 19 schedules renders via microtasks /
  // MessageChannel — NOT rAF — so nested rAF callbacks can fire before the DOM
  // is updated. flushSync guarantees the full spread is painted first.
  // window.print() is blocking (returns after the dialog closes), so restoring
  // state after it is safe.
  const handlePrint = useCallback(() => {
    if (printingRef.current) return;
    printingRef.current = true;
    flushSync(() => setPrintingSpread(true));
    window.print();
    setPrintingSpread(false);
    printingRef.current = false;
  }, []);

  // focusSide: undefined = show full spread; "front"/"back" = enlarged single page
  const focusSide: Face | undefined =
    printingSpread ? undefined : sidebarOpen ? activeFace : undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
      {/* ── Top chrome bar ──────────────────────────────────────── */}
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

        <button
          className="pc-editor-chrome"
          onClick={handlePrint}
          style={printBtnStyle}
        >
          Print / Save PDF
        </button>
      </div>

      {/* ── Main body: sidebar + preview ────────────────────────── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT: collapsible sidebar */}
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
                onClick={() => setActiveFace("front")}
                style={activeFace === "front" ? activeTabStyle : inactiveTabStyle}
              >
                Front — {sheet.front.label}
              </button>
              <button
                onClick={() => setActiveFace("back")}
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
            focusSide={focusSide}
          />
        </div>
      </div>
    </div>
  );
}
