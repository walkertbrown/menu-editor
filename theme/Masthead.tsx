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
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string) => void;
}

export default function Masthead({
  menu,
  restaurant,
  overrides,
  categorySpacing,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: Props) {
  const spotProps = { overrides, categorySpacing, editMode, selectedSpotId, onSelectSpot };

  return (
    <header className="pc-masthead">
      <SpotWrap spotId={SPOT.mastheadEyebrow} as="div" {...spotProps}>
        <div className="pc-eyebrow">{restaurant.eyebrowLine}</div>
      </SpotWrap>

      <SpotWrap spotId={SPOT.mastheadLogo} as="div" {...spotProps}>
        {restaurant.logoUrl ? (
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
