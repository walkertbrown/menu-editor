"use client";
/**
 * SheetToolbar — the top chrome bar for SheetEditorPage:
 * back link, sheet title, Spacing ▾, zoom control, show/hide editor, print.
 *
 * Pure layout + wiring; all behavior is owned by SheetEditorPage and passed in.
 * Extracted to keep SheetEditorPage within the ~300-line file limit.
 */

import SheetTitleEditor from "./SheetTitleEditor";
import SpacingMenu from "./SpacingMenu";
import ZoomControl from "./ZoomControl";
import {
  tabBarStyle,
  backLinkStyle,
  printBtnStyle,
  collapseToggleStyle,
} from "./sheetEditorStyles";

interface Props {
  sheetId: string;
  sheetTitle: string;

  // Spacing menu (bound to the active face)
  categorySpacing: Record<string, number> | undefined;
  customCategories: { id: string; name: string }[] | undefined;
  onCategoryChange: (category: string, value: number) => void;
  onCategoryReset: (category: string) => void;
  onCreateCategory: (name: string) => void;
  onSetAsDefault: () => void;

  // Zoom control
  scalePercent: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onFitPage: () => void;
  onFitWidth: () => void;

  // Sidebar + print
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onPrint: () => void;
}

export default function SheetToolbar({
  sheetId,
  sheetTitle,
  categorySpacing,
  customCategories,
  onCategoryChange,
  onCategoryReset,
  onCreateCategory,
  onSetAsDefault,
  scalePercent,
  onZoomOut,
  onZoomIn,
  onFitPage,
  onFitWidth,
  sidebarOpen,
  onToggleSidebar,
  onPrint,
}: Props) {
  return (
    <div className="pc-editor-chrome" style={tabBarStyle}>
      <a href="/" style={backLinkStyle}>← All Sheets</a>
      <SheetTitleEditor sheetId={sheetId} initialTitle={sheetTitle} />
      <div style={{ flex: 1 }} />

      <SpacingMenu
        categorySpacing={categorySpacing}
        customCategories={customCategories}
        onChange={onCategoryChange}
        onReset={onCategoryReset}
        onCreateCategory={onCreateCategory}
        onSetAsDefault={onSetAsDefault}
      />

      <ZoomControl
        scalePercent={scalePercent}
        onZoomOut={onZoomOut}
        onZoomIn={onZoomIn}
        onFitPage={onFitPage}
        onFitWidth={onFitWidth}
      />

      <button
        className="pc-editor-chrome"
        onClick={onToggleSidebar}
        style={{ ...collapseToggleStyle, marginLeft: 8 }}
      >
        {sidebarOpen ? "Hide editor" : "Show editor"}
      </button>
      <button className="pc-editor-chrome" onClick={onPrint} style={printBtnStyle}>
        Print / Save PDF
      </button>
    </div>
  );
}
