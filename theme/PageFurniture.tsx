// Pelican Club themed PageFurniture renderer.
// Phase 1: styled masthead, prix-fixe header, intro lines, ornament, and footer.
//
// position="header" renders:
//   - prix-fixe header (e.g. "THREE COURSES $56 & UP") in Della Respira
//   - intro lines (choice / à-la-carte lines) in italic Cardo
//   - ornament text centered
//
// position="footer" renders footer line(s) in italic small-caps Raleway/Cardo.

import type { MenuFurniture } from "@/content/types";
import SpotWrap from "./SpotWrap";
import { SPOT, introSpotId } from "./spotSpacing";

interface Props {
  furniture?: MenuFurniture;
  position: "header" | "footer";
  overrides?: Record<string, number>;
  categorySpacing?: Record<string, number>;
  /** Phase 3: spot → category assignment map. */
  spotCategories?: Record<string, string>;
  spacingBaseline?: Record<string, number>;
  editMode?: boolean;
  selectedSpotId?: string;
  onSelectSpot?: (id: string, rect?: DOMRect) => void;
}

export default function PageFurniture({
  furniture,
  position,
  overrides,
  categorySpacing,
  spotCategories,
  spacingBaseline,
  editMode,
  selectedSpotId,
  onSelectSpot,
}: Props) {
  const spotProps = { overrides, categorySpacing, spotCategories, spacingBaseline, editMode, selectedSpotId, onSelectSpot };

  if (!furniture) return null;

  if (position === "header") {
    const hasContent =
      furniture.prixFixeHeader ||
      (furniture.introLines && furniture.introLines.length > 0) ||
      furniture.ornamentText;

    if (!hasContent) return null;

    return (
      <div className="pc-furniture-header">
        {furniture.prixFixeHeader && (
          <SpotWrap spotId={SPOT.prixfixe} {...spotProps}>
            <div className="pc-prix-fixe-header">{furniture.prixFixeHeader}</div>
          </SpotWrap>
        )}
        {furniture.introLines?.map((line, i) => (
          <SpotWrap key={i} spotId={introSpotId(i)} {...spotProps}>
            <div className="pc-intro-line">{line}</div>
          </SpotWrap>
        ))}
        {furniture.ornamentText && (
          <SpotWrap spotId={SPOT.ornament} {...spotProps}>
            <div className="pc-ornament">{furniture.ornamentText}</div>
          </SpotWrap>
        )}
      </div>
    );
  }

  // footer
  if (!furniture.footerLine) return null;

  const footerLines = furniture.footerLine.split('\n');

  return (
    <SpotWrap spotId={SPOT.footer} {...spotProps}>
      <div className="pc-furniture-footer">
        {footerLines.map((line, i) => (
          <div key={i} className="pc-footer-line">{line}</div>
        ))}
      </div>
    </SpotWrap>
  );
}
