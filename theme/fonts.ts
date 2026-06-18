// Centralized font roles for The Pelican Club menu.
// Phase 1: three font roles mapped to Google Fonts.
//
// Role       Font            Usage
// ------------------------------------------------------------------
// display    Della Respira   Masthead name, section headers, item names
// body       Raleway         Descriptions, prices, region/vintage, subtext
// italic     Cardo (italic)  Parentheticals, "available" lines, intro/footer italics
//
// CSS variables are injected via theme/menu-preview.css:
//   --font-display, --font-body, --font-italic
//
// next/font instances are exported for use in layout.tsx so Next.js
// handles self-hosting; the variable names match the CSS vars above.

import { Della_Respira, Raleway, Cardo } from "next/font/google";

export const fontDisplay = Della_Respira({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const fontBody = Raleway({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

// Cardo italic is used only in the italic role.
export const fontItalic = Cardo({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-italic",
});
