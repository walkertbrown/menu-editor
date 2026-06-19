/**
 * mergeMenuSave — pure helper for the scoped-merge save strategy.
 *
 * PROBLEM IT SOLVES:
 * The spirits sheet has two editing panels (p1 / p2) both pointing at the
 * same underlying menu (`menu-spirits`), filtered to different named sections.
 * Without scoping, saving from p1 would full-replace ALL sections/items for
 * `menu-spirits`, wiping the p2 sections (and vice-versa).
 *
 * HOW IT WORKS:
 * When `scopeSectionIds` is supplied, the function:
 *   1. Keeps ("preserves") every stored section/item whose section id is NOT
 *      in the scope set (those belong to the other side).
 *   2. Replaces the in-scope sections/items with whatever the editor sends in
 *      (handles renames, additions, deletions within the scope).
 *   3. Renumbers `sortOrder` across the full merged set (no collisions).
 *   4. Reconciles `menu.sectionOrder`: starts from the STORED order, drops
 *      deleted ids, appends newly-added in-scope ids, producing a list that
 *      exactly matches the merged section set.
 *
 * When `scopeSectionIds` is NOT supplied (dinner / drinks — unfiltered menus),
 * the function behaves like the old full-replace: sections/items = incoming
 * as-is; sectionOrder = incoming menu.sectionOrder.
 *
 * EMPTY-SAVE GUARD:
 * If the incoming scoped set is empty (zero sections AND zero items for the
 * scope) but the store currently HAS content for that scope, `blockedEmpty`
 * is set to true. The caller decides whether to block or proceed.
 * For unscoped saves the guard applies to the whole menu.
 */

import type { Menu, Section, Item } from "./types";

export interface MergeMenuSaveResult {
  /** The full merged section list to persist. */
  sections: Section[];
  /** The full merged item list to persist. */
  items: Item[];
  /** The reconciled sectionOrder for the Menu record. */
  sectionOrder: string[];
  /**
   * True when the incoming side is EMPTY but the store currently has content
   * for that scope. Caller should block the save (or prompt + retry with
   * allowEmpty).
   */
  blockedEmpty: boolean;
}

/**
 * @param storedSections  All sections currently persisted for this menu.
 * @param storedItems     All items currently persisted for this menu.
 * @param storedMenu      The Menu record currently in the store (used for
 *                        existing sectionOrder when reconciling).
 * @param incomingSections  Sections from the editor (full side or filtered side).
 * @param incomingItems     Items from the editor (full side or filtered side).
 * @param incomingMenu      Menu object sent by the editor (may have a filtered
 *                          sectionOrder — do NOT trust it blindly when scoped).
 * @param scopeSectionIds   The canonical set of section ids this side owns.
 *                          When undefined → unscoped (full-replace) mode.
 */
export function mergeMenuSave(
  storedSections: Section[],
  storedItems: Item[],
  storedMenu: Menu,
  incomingSections: Section[],
  incomingItems: Item[],
  incomingMenu: Menu,
  scopeSectionIds?: Set<string> | string[]
): MergeMenuSaveResult {
  // ---- Unscoped (dinner / drinks): full replace --------------------------
  if (!scopeSectionIds) {
    const hasStoredContent =
      storedSections.length > 0 || storedItems.length > 0;
    const incomingIsEmpty =
      incomingSections.length === 0 && incomingItems.length === 0;
    return {
      sections: incomingSections,
      items: incomingItems,
      sectionOrder: incomingMenu.sectionOrder,
      blockedEmpty: incomingIsEmpty && hasStoredContent,
    };
  }

  // ---- Normalise scope to a Set -----------------------------------------
  const scopeSet: Set<string> =
    scopeSectionIds instanceof Set
      ? scopeSectionIds
      : new Set(scopeSectionIds);

  // ---- Check empty-save guard -------------------------------------------
  // "Content for that scope" means stored sections whose id is in scope.
  const storedInScope = storedSections.filter((s) => scopeSet.has(s.id));
  const storedItemsInScope = storedItems.filter((i) =>
    scopeSet.has(i.sectionId)
  );
  const hasStoredContent =
    storedInScope.length > 0 || storedItemsInScope.length > 0;
  const incomingIsEmpty =
    incomingSections.length === 0 && incomingItems.length === 0;
  const blockedEmpty = incomingIsEmpty && hasStoredContent;

  // ---- Merge sections ----------------------------------------------------
  // Preserved = stored sections that are NOT in this side's scope.
  const preservedSections = storedSections.filter((s) => !scopeSet.has(s.id));
  // Replaced = incoming sections (which are all within the scope).
  const replacedSections = incomingSections;

  // Merge and renumber sortOrder: preserved first (maintain their relative
  // order), then incoming (in the order the editor sent them).
  const mergedSections: Section[] = [
    ...preservedSections,
    ...replacedSections,
  ].map((s, idx) => ({ ...s, sortOrder: idx }));

  // ---- Merge items -------------------------------------------------------
  // Preserved = stored items whose sectionId is NOT in scope.
  const preservedItems = storedItems.filter(
    (i) => !scopeSet.has(i.sectionId)
  );
  // Replaced = incoming items.
  const replacedItems = incomingItems;

  // Renumber item sortOrder within each section so there are no collisions.
  const allItems = [...preservedItems, ...replacedItems];
  const sectionItemCounters: Record<string, number> = {};
  const mergedItems: Item[] = allItems.map((item) => {
    const counter = sectionItemCounters[item.sectionId] ?? 0;
    sectionItemCounters[item.sectionId] = counter + 1;
    return { ...item, sortOrder: counter };
  });

  // ---- Reconcile sectionOrder -------------------------------------------
  // Strategy:
  //   1. Start from the STORED menu's sectionOrder (stable base).
  //   2. Remove ids that are no longer in the merged section set
  //      (deleted on either side).
  //   3. Append any new in-scope ids from incoming that weren't in the stored
  //      order (newly-added sections on this side).
  const mergedSectionIdSet = new Set(mergedSections.map((s) => s.id));
  const incomingIdSet = new Set(incomingSections.map((s) => s.id));

  // Step 1 + 2: filter stored order to only ids still present.
  const reconciledOrder = storedMenu.sectionOrder.filter((id) =>
    mergedSectionIdSet.has(id)
  );

  // Step 3: append new incoming ids (not yet in the stored order).
  const reconciledOrderSet = new Set(reconciledOrder);
  for (const s of incomingSections) {
    if (!reconciledOrderSet.has(s.id) && incomingIdSet.has(s.id)) {
      reconciledOrder.push(s.id);
      reconciledOrderSet.add(s.id);
    }
  }

  // Sanity: every merged section id must appear exactly once.
  // (If a preserved section's id was somehow absent from storedMenu.sectionOrder
  //  — shouldn't happen but defensive — append it.)
  for (const s of mergedSections) {
    if (!reconciledOrderSet.has(s.id)) {
      reconciledOrder.push(s.id);
      reconciledOrderSet.add(s.id);
    }
  }

  return {
    sections: mergedSections,
    items: mergedItems,
    sectionOrder: reconciledOrder,
    blockedEmpty,
  };
}
