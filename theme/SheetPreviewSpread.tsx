"use client";
// SheetPreviewSpread — renders both sides of a sheet side by side,
// or a single enlarged side when focusSide is provided.
//
// Two legal pages (816×1344 each) + gap = 1656px wide at natural size.
// We CSS-transform scale the whole spread down to fit the viewport.
// Each side uses the existing legal-page renderers without the outer
// pc-preview-wrap wrapper so the pages sit flush inside the spread.

import { useEffect, useRef, useState } from "react";
import type { Menu, Section, Item, RestaurantIdentity } from "@/content/types";
import type { SheetConfig } from "@/sheets/sheetConfig";
import { SinglePageShell } from "./MenuPreview";
import { SpiritsPage1, SpiritsPage2 } from "./SpiritsPreview";

const PAGE_W = 816;
const PAGE_H = 1344;
const SPREAD_GAP = 24;
const SPREAD_W = PAGE_W * 2 + SPREAD_GAP;

interface SideData {
  menu: Menu;
  sections: Section[];
  items: Item[];
}

interface Props {
  sheet: SheetConfig;
  frontData: SideData;
  backData: SideData;
  restaurant?: RestaurantIdentity;
  /**
   * When set, show only that side at enlarged scale (sidebar open mode).
   * When unset, show the full two-page spread (sidebar collapsed mode).
   */
  focusSide?: "front" | "back";
  /** Whether the preview is in edit mode (affordances + click targets active). */
  editMode?: boolean;
  /** The currently selected spot id. */
  selectedSpotId?: string;
  /** Called when the user clicks a spot in the preview. */
  onSelectSpot?: (id: string) => void;
}

// ── Single page renderer — no wrapper, just the .pc-page ─────────────────

function SidePage({
  menu,
  sections,
  items,
  spiritsPageSlot,
  restaurant,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: {
  menu: Menu;
  sections: Section[];
  items: Item[];
  spiritsPageSlot?: "p1" | "p2";
  restaurant?: RestaurantIdentity;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string) => void;
}) {
  if (menu.id === "menu-spirits" && spiritsPageSlot) {
    const sectionMap = new Map(sections.map((s) => [s.id, s]));
    if (spiritsPageSlot === "p1") {
      return (
        <SpiritsPage1
          menu={menu}
          sectionMap={sectionMap}
          allItems={items}
          restaurant={restaurant}
        />
      );
    }
    return (
      <SpiritsPage2
        menu={menu}
        sectionMap={sectionMap}
        allItems={items}
        restaurant={restaurant}
      />
    );
  }
  // Dinner or Drinks: render the bare page shell (no pc-preview-wrap)
  const orderedSections = [...sections].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  return (
    <SinglePageShell
      menu={menu}
      sections={orderedSections}
      isLastPage={true}
      allItems={items}
      restaurant={restaurant}
      editMode={editMode}
      selectedSpotId={selectedSpotId}
      onSelectSpot={onSelectSpot}
    />
  );
}

// ── ScaledSpread ──────────────────────────────────────────────────────────

export default function SheetPreviewSpread({
  sheet,
  frontData,
  backData,
  restaurant,
  focusSide,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function computeScale() {
      if (!outerRef.current) return;
      // 32px padding inside the outer container
      const availW = outerRef.current.clientWidth - 32;
      // In single-side focus mode scale against one page width; in spread
      // mode scale against the full two-page spread width.
      const referenceW = focusSide ? PAGE_W : SPREAD_W;
      const s = Math.min(1, availW / referenceW);
      setScale(s);
    }
    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusSide]);

  // When focusSide changes the container width may change (sidebar
  // collapses/expands without firing a window resize). Force a recompute
  // after the DOM has settled using a requestAnimationFrame.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (!outerRef.current) return;
      const availW = outerRef.current.clientWidth - 32;
      const referenceW = focusSide ? PAGE_W : SPREAD_W;
      const s = Math.min(1, availW / referenceW);
      setScale(s);
    });
    return () => cancelAnimationFrame(raf);
  }, [focusSide]);

  if (focusSide) {
    // ── Single-side enlarged view ─────────────────────────────────────
    const data = focusSide === "front" ? frontData : backData;
    const side = focusSide === "front" ? sheet.front : sheet.back;
    const spiritsSlot =
      side.menuId === "menu-spirits"
        ? focusSide === "front"
          ? "p1"
          : "p2"
        : undefined;

    // Reserve vertical space so content below doesn't overlap
    const scaledH = Math.round(PAGE_H * scale + 32);

    return (
      <div
        ref={outerRef}
        className="pc-spread-outer"
        style={{ minHeight: scaledH }}
      >
        <div
          className="pc-spread-inner"
          style={{
            width: PAGE_W,
            transform: `scale(${scale})`,
            transformOrigin: "top center",
          }}
        >
          <div className="pc-spread-side">
            <div style={{ width: PAGE_W, height: PAGE_H, overflow: "hidden" }}>
              <SidePage
                menu={data.menu}
                sections={data.sections}
                items={data.items}
                spiritsPageSlot={spiritsSlot}
                restaurant={restaurant}
                editMode={editMode}
                selectedSpotId={selectedSpotId}
                onSelectSpot={onSelectSpot}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Full two-page spread ──────────────────────────────────────────────

  // Reserve vertical space so the page below doesn't overlap
  const scaledH = Math.round(PAGE_H * scale + 48); // 48 for labels

  return (
    <div
      ref={outerRef}
      className="pc-spread-outer"
      style={{ minHeight: scaledH }}
    >
      <div
        className="pc-spread-inner"
        style={{
          width: SPREAD_W,
          display: "flex",
          gap: SPREAD_GAP,
          alignItems: "flex-start",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* FRONT side */}
        <div className="pc-spread-side">
          <div className="pc-spread-side-label">
            Front — {sheet.front.label}
          </div>
          <div style={{ width: PAGE_W, height: PAGE_H, overflow: "hidden" }}>
            <SidePage
              menu={frontData.menu}
              sections={frontData.sections}
              items={frontData.items}
              spiritsPageSlot={
                sheet.front.menuId === "menu-spirits" ? "p1" : undefined
              }
              restaurant={restaurant}
              editMode={editMode}
              selectedSpotId={selectedSpotId}
              onSelectSpot={onSelectSpot}
            />
          </div>
        </div>

        {/* BACK side */}
        <div className="pc-spread-side">
          <div className="pc-spread-side-label">Back — {sheet.back.label}</div>
          <div style={{ width: PAGE_W, height: PAGE_H, overflow: "hidden" }}>
            <SidePage
              menu={backData.menu}
              sections={backData.sections}
              items={backData.items}
              spiritsPageSlot={
                sheet.back.menuId === "menu-spirits" ? "p2" : undefined
              }
              restaurant={restaurant}
              editMode={editMode}
              selectedSpotId={selectedSpotId}
              onSelectSpot={onSelectSpot}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
