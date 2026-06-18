"use client";
// SheetPreviewSpread — renders both sides of a sheet side by side.
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
}

// ── Single page renderer — no wrapper, just the .pc-page ─────────────────

function SidePage({
  menu,
  sections,
  items,
  spiritsPageSlot,
  restaurant,
}: {
  menu: Menu;
  sections: Section[];
  items: Item[];
  spiritsPageSlot?: "p1" | "p2";
  restaurant?: RestaurantIdentity;
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
    />
  );
}

// ── ScaledSpread ──────────────────────────────────────────────────────────

export default function SheetPreviewSpread({
  sheet,
  frontData,
  backData,
  restaurant,
}: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function computeScale() {
      if (!outerRef.current) return;
      // 32px padding inside the outer container
      const availW = outerRef.current.clientWidth - 32;
      const s = Math.min(1, availW / SPREAD_W);
      setScale(s);
    }
    computeScale();
    window.addEventListener("resize", computeScale);
    return () => window.removeEventListener("resize", computeScale);
  }, []);

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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
