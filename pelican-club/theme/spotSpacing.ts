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

/**
 * Strips a leading page-scope prefix of the form `pN:` (e.g. "p1:", "p2:")
 * before matching. Spirits masthead/fleuron spots are prefixed to avoid
 * key collisions between page 1 and page 2 within the same menu.
 */
function stripPagePrefix(spotId: string): string {
  // Match "p" + one-or-more digits + ":" at the start of the string.
  return spotId.replace(/^p\d+:/, "");
}

/** Returns the spacing category for a spot id. */
export function categoryOfSpot(spotId: string): "header" | "item" | "masthead" | "footer" {
  const id = stripPagePrefix(spotId);
  if (id.startsWith("section-")) return "header";
  if (id.startsWith("item-")) return "item";
  if (id === "footer") return "footer";
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
 *
 * For spirits page-prefixed ids (e.g. "p1:masthead-eyebrow"), the prefix is
 * stripped for matching and optionally surfaced in the label (e.g. "Eyebrow (p1)").
 */
export function spotLabel(id: string, ctx?: SpotLabelContext): string {
  // Extract page prefix if present (e.g. "p1:", "p2:") for optional label suffix.
  const prefixMatch = id.match(/^(p\d+):/);
  const pageTag = prefixMatch ? prefixMatch[1] : undefined;
  const bare = stripPagePrefix(id);

  function withPage(label: string): string {
    return pageTag ? `${label} (${pageTag})` : label;
  }

  if (bare === SPOT.mastheadEyebrow) return withPage("Eyebrow");
  if (bare === SPOT.mastheadLogo)    return withPage("Logo");
  if (bare === SPOT.mastheadTitle)   return withPage("Menu title");
  if (bare === SPOT.fleuron)         return withPage("Divider");
  if (bare === SPOT.prixfixe)        return withPage("Prix-fixe header");
  if (bare === SPOT.ornament)        return withPage("Ornament");
  if (bare === SPOT.footer)          return withPage("Footer");

  if (bare.startsWith("intro-")) {
    const n = bare.slice("intro-".length);
    return withPage(`Intro line ${Number(n) + 1}`);
  }

  if (bare.startsWith("section-")) {
    const sectionId = bare.slice("section-".length);
    if (ctx?.sections) {
      const section = ctx.sections.find((s) => s.id === sectionId);
      if (section) return `${section.name} — header`;
    }
    return `Section — ${sectionId} (header)`;
  }

  if (bare.startsWith("item-")) {
    const itemId = bare.slice("item-".length);
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
 * Returns the effective category key for a spot, respecting spotCategories
 * assignment. Falls back to the built-in categoryOfSpot() when no assignment.
 *
 * @param spotId        The spot id to resolve.
 * @param spotCategories  Optional map of spotId → custom/built-in category id.
 */
export function assignedCategoryOf(
  spotId: string,
  spotCategories?: Record<string, string>
): string {
  return spotCategories?.[spotId] ?? categoryOfSpot(spotId);
}

/**
 * Returns the spot's "nudge" delta (the slider-driven value), or undefined when
 * none applies. This is the value shown in the spacing controls.
 *
 * Precedence (highest → lowest):
 *   1. spacingOverrides[spotId]   — per-spot explicit override
 *   2. categorySpacing[ spotCategories[spotId] ]  — assigned custom/built-in
 *   3. categorySpacing[ categoryOfSpot(spotId) ]  — default built-in category
 */
export function effectiveSpotDelta(
  id: string,
  overrides?: Record<string, number>,
  categorySpacing?: Record<string, number>,
  spotCategories?: Record<string, string>
): number | undefined {
  if (overrides?.[id] !== undefined) return overrides[id];
  if (spotCategories?.[id] !== undefined && categorySpacing?.[spotCategories[id]] !== undefined) {
    return categorySpacing[spotCategories[id]];
  }
  return categorySpacing?.[categoryOfSpot(id)];
}

/**
 * Returns { marginTop: N } for a spot's effective vertical gap, or undefined
 * when nothing applies (so no inline margin is emitted and CSS defaults stand).
 *
 * The gap is ADDITIVE:  spacingBaseline[id]  +  effectiveSpotDelta(id).
 * The baseline is the frozen "default" set by "Set current as default"; the
 * delta is the live slider nudge. With no baseline this is identical to the
 * original precedence-only behavior (delta alone).
 */
export function spotMarginStyle(
  overrides: Record<string, number> | undefined,
  id: string,
  categorySpacing?: Record<string, number>,
  spotCategories?: Record<string, string>,
  spacingBaseline?: Record<string, number>
): { marginTop: number } | undefined {
  const delta = effectiveSpotDelta(id, overrides, categorySpacing, spotCategories);
  const base = spacingBaseline?.[id];
  if (base === undefined && delta === undefined) return undefined;
  return { marginTop: (base ?? 0) + (delta ?? 0) };
}
