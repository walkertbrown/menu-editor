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

interface Props {
  furniture?: MenuFurniture;
  position: "header" | "footer";
}

export default function PageFurniture({ furniture, position }: Props) {
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
          <div className="pc-prix-fixe-header">{furniture.prixFixeHeader}</div>
        )}
        {furniture.introLines?.map((line, i) => (
          <div key={i} className="pc-intro-line">{line}</div>
        ))}
        {furniture.ornamentText && (
          <div className="pc-ornament">{furniture.ornamentText}</div>
        )}
      </div>
    );
  }

  // footer
  if (!furniture.footerLine) return null;

  const footerLines = furniture.footerLine.split('\n');

  return (
    <div className="pc-furniture-footer">
      {footerLines.map((line, i) => (
        <div key={i} className="pc-footer-line">{line}</div>
      ))}
    </div>
  );
}
