"use client";
/**
 * SpotWrap — wrapper component applied around every "spot" in the page layout.
 *
 * Always applies the margin-top nudge from spacingOverrides (this is the design
 * and must render in print too). When editMode is true, also adds the click
 * affordance class, data-spot-id attribute, and selected-outline class.
 * In print mode (editMode=false), renders a plain wrapper with only the margin.
 */

import type { CSSProperties } from "react";
import { spotMarginStyle } from "./spotSpacing";

interface Props {
  spotId: string;
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string) => void;
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
  editMode,
  selectedSpotId,
  onSelectSpot,
  as: Tag = "div",
  className,
  style,
  children,
}: Props) {
  const marginStyle = spotMarginStyle(overrides, spotId, categorySpacing);
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
          onSelectSpot?.(spotId);
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
