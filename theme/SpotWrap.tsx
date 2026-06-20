"use client";
/**
 * SpotWrap — wrapper component applied around every "spot" in the page layout.
 *
 * Always applies the margin-top nudge from spacingOverrides (this is the design
 * and must render in print too). When editMode is true, also adds the click
 * affordance class, data-spot-id attribute, and selected-outline class.
 * In print mode (editMode=false), renders a plain wrapper with only the margin.
 *
 * Phase 3: onSelectSpot now receives a DOMRect (post-transform viewport coords)
 * so the floating popup can anchor near the clicked spot without manual scale math.
 * The signature is (id: string, rect?: DOMRect) — callers that do not need
 * positioning can continue passing a single-argument handler.
 */

import type { CSSProperties } from "react";
import { spotMarginStyle } from "./spotSpacing";

interface Props {
  spotId: string;
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  /** Phase 3: maps spotId → assigned category id (custom or built-in). */
  spotCategories?: Record<string, string>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
  /** HTML element to render as. Default: "div". */
  as?: "div" | "span" | "p" | "header" | "section" | "footer";
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export default function SpotWrap({
  spotId,
  overrides,
  categorySpacing,
  spotCategories,
  editMode,
  selectedSpotId,
  onSelectSpot,
  as: Tag = "div",
  className,
  style,
  children,
}: Props) {
  const marginStyle = spotMarginStyle(overrides, spotId, categorySpacing, spotCategories);
  const isSelected = editMode && selectedSpotId === spotId;

  const combinedStyle: CSSProperties = {
    ...(marginStyle ?? {}),
    ...(style ?? {}),
  };

  if (editMode) {
    const classes = [
      className,
      "pc-spot--clickable",
      isSelected ? "pc-spot--selected" : undefined,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Tag
        data-spot-id={spotId}
        className={classes || undefined}
        style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
        onClick={(e) => {
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          onSelectSpot?.(spotId, rect);
        }}
      >
        {children}
      </Tag>
    );
  }

  // Non-edit / print mode: plain wrapper with only the margin style.
  return (
    <Tag
      className={className || undefined}
      style={Object.keys(combinedStyle).length > 0 ? combinedStyle : undefined}
    >
      {children}
    </Tag>
  );
}
