"use client";
/**
 * Masthead — the top section of a non-spirits (dinner/drinks) page.
 * Renders: eyebrow line, logo or house name, menu title.
 * Each element is wrapped in SpotWrap for per-spot spacing and click affordance.
 */

import type { Menu, RestaurantIdentity } from "@/content/types";
import SpotWrap from "./SpotWrap";
import { SPOT } from "./spotSpacing";

interface Props {
  menu: Menu;
  restaurant: RestaurantIdentity;
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  /** Phase 3: spot → category assignment map. */
  spotCategories?: Record<string, string>;
  spacingBaseline?: Record<string, number>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}

export default function Masthead({
  menu,
  restaurant,
  overrides,
  categorySpacing,
  spotCategories,
  spacingBaseline,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: Props) {
  const spotProps = { overrides, categorySpacing, spotCategories, spacingBaseline, editMode, selectedSpotId, onSelectSpot };

  // Minimal masthead (e.g. Drinks): just the title, no eyebrow/logo/wordmark.
  if (menu.mastheadMinimal) {
    return (
      <header className="pc-masthead pc-masthead--minimal">
        <SpotWrap spotId={SPOT.mastheadTitle} as="div" {...spotProps}>
          <h2 className="pc-masthead-minimal-title">{menu.pageTitle ?? menu.name}</h2>
        </SpotWrap>
      </header>
    );
  }

  return (
    <header className="pc-masthead">
      <SpotWrap spotId={SPOT.mastheadEyebrow} as="div" {...spotProps}>
        <div className="pc-eyebrow">{menu.eyebrowLine ?? restaurant.eyebrowLine}</div>
      </SpotWrap>

      <SpotWrap spotId={SPOT.mastheadLogo} as="div" {...spotProps}>
        {restaurant.logoUrl ? (
          // Plain <img> on purpose: this renders into the print/PDF menu, where
          // next/image's optimization, lazy-loading and wrappers hurt fidelity.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={restaurant.logoUrl} alt="" className="pc-masthead-logo" />
        ) : (
          <h1 className="pc-house-name pc-house-name--compact">
            {restaurant.houseName}
          </h1>
        )}
      </SpotWrap>

      <SpotWrap spotId={SPOT.mastheadTitle} as="div" {...spotProps}>
        <p className="pc-menu-title">{menu.pageTitle ?? menu.name}</p>
      </SpotWrap>
    </header>
  );
}
