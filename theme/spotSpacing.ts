/**
 * spotSpacing.ts — pure helpers for per-spot vertical spacing overrides.
 *
 * Spot ids are stable string keys that identify a specific element in the
 * page layout. They ride inside menu.spacingOverrides (Record<string,number>).
 *
 * ID scheme (dinner + drinks menus — single-page shell):
 *   masthead-eyebrow  — the italic eyebrow line above the logo
 *   masthead-logo     — the logo image or compact house-name element
 *   masthead-title    — the italic menu-title paragraph
 *   fleuron           — the rule + ❦ ornament divider
 *   prixfixe          — prix-fixe header element inside page furniture
 *   intro-<n>         — intro line at index n (0-based) in furniture
 *   ornament          — ornament text inside page furniture
 *   footer            — footer element inside page furniture
 *   section-<id>      — a section block (header + items), keyed by section id
 *   item-<id>         — a single item row, keyed by item id
 *
 * Future spirits scope can prefix ids, e.g. "p1:section-<id>".
 * The builder helpers below make it easy to add a scope prefix param later.
 */

import type { Section, Item } from "@/content/types";

// ── ID builders ──────────────────────────────────────────────────────────────

/** Fixed furniture/masthead spot ids (no dynamic segment needed). */
export const SPOT = {
  mastheadEyebrow: "masthead-eyebrow",
  mastheadLogo: "masthead-logo",
  mastheadTitle: "masthead-title",
  fleuron: "fleuron",
  prixfixe: "prixfixe",
  ornament: "ornament",
  footer: "footer",
} as const;

/** Returns the spot id for a section block. */
export function sectionSpotId(sectionId: string): string {
  return `section-${sectionId}`;
}

/** Returns the spot id for an item row. */
export function itemSpotId(itemId: string): string {
  return `item-${itemId}`;
}

/** Returns the spot id for an intro line at index n. */
export function introSpotId(index: number): string {
  return `intro-${index}`;
}

/** Returns the spacing category for a spot id. */
export function categoryOfSpot(spotId: string): "header" | "item" | "masthead" | "footer" {
  if (spotId.startsWith("section-")) return "header";
  if (spotId.startsWith("item-")) return "item";
  if (spotId === "footer") return "footer";
  // masthead-eyebrow, masthead-logo, masthead-title, fleuron, prixfixe, intro-*, ornament
  return "masthead";
}

// ── Friendly label ────────────────────────────────────────────────────────────

/** Optional context for resolving human names from live editor state. */
export interface SpotLabelContext {
  sections?: Section[];
  items?: Item[];
}

/**
 * Returns a human-readable label for the sidebar SpacingControl panel.
 * When ctx is supplied, item- and section- ids resolve to their actual names.
 * Falls back to the raw id for unknown spots.
 */
export function spotLabel(id: string, ctx?: SpotLabelContext): string {
  if (id === SPOT.mastheadEyebrow) return "Eyebrow";
  if (id === SPOT.mastheadLogo)    return "Logo";
  if (id === SPOT.mastheadTitle)   return "Menu title";
  if (id === SPOT.fleuron)         return "Divider";
  if (id === SPOT.prixfixe)        return "Prix-fixe header";
  if (id === SPOT.ornament)        return "Ornament";
  if (id === SPOT.footer)          return "Footer";

  if (id.startsWith("intro-")) {
    const n = id.slice("intro-".length);
    return `Intro line ${Number(n) + 1}`;
  }

  if (id.startsWith("section-")) {
    const sectionId = id.slice("section-".length);
    if (ctx?.sections) {
      const section = ctx.sections.find((s) => s.id === sectionId);
      if (section) return `${section.name} — header`;
    }
    return `Section — ${sectionId} (header)`;
  }

  if (id.startsWith("item-")) {
    const itemId = id.slice("item-".length);
    if (ctx?.items) {
      const item = ctx.items.find((i) => i.id === itemId);
      if (item) return item.name;
    }
    return `Item — ${itemId}`;
  }

  return id;
}

// ── Style helper ─────────────────────────────────────────────────────────────

/**
 * Returns { marginTop: N } when the spot has an override in the map,
 * or a category-level baseline, or undefined when neither applies.
 * Per-spot spacingOverrides take precedence over categorySpacing.
 */
export function spotMarginStyle(
  overrides: Record<string, number> | undefined,
  id: string,
  categorySpacing?: Record<string, number>
): { marginTop: number } | undefined {
  const val = overrides?.[id] ?? categorySpacing?.[categoryOfSpot(id)];
  if (val === undefined) return undefined;
  return { marginTop: val };
}
