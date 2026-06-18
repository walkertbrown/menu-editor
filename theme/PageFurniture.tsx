// Stub renderer for per-menu furniture (header, intro lines, footer text).
// Phase 0: functional, intentionally unstyled.

import type { MenuFurniture } from "@/content/types";

interface Props {
  furniture?: MenuFurniture;
  position: "header" | "footer";
}

export default function PageFurniture({ furniture, position }: Props) {
  if (!furniture) return null;

  if (position === "header") {
    return (
      <div style={{ marginBottom: 16 }}>
        {furniture.prixFixeHeader && (
          <div style={{ fontWeight: 600, fontSize: "1.1em", marginBottom: 4 }}>
            {furniture.prixFixeHeader}
          </div>
        )}
        {furniture.introLines?.map((line, i) => (
          <div key={i} style={{ fontStyle: "italic", fontSize: "0.9em", color: "#555" }}>
            {line}
          </div>
        ))}
        {furniture.ornamentText && (
          <div style={{ textAlign: "center", margin: "8px 0", color: "#888" }}>
            {furniture.ornamentText}
          </div>
        )}
      </div>
    );
  }

  // footer
  return (
    <div style={{ marginTop: 16 }}>
      {furniture.footerLine && (
        <div style={{ fontSize: "0.8em", color: "#888", fontStyle: "italic" }}>
          {furniture.footerLine}
        </div>
      )}
    </div>
  );
}
