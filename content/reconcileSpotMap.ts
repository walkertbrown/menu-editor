/**
 * reconcileSpotMap — shared helper for scoped per-spot map reconciliation.
 *
 * Used by mergeMenuSave.ts to reconcile both spacingOverrides (Record<string,number>)
 * and spotCategories (Record<string,string>) with the same three-pass strategy:
 *
 *   Pass 1: Keep stored keys that are NOT in scope (belong to the other side).
 *   Pass 2: Overlay incoming keys (add / update in-scope changes).
 *   Pass 3: Drop stale keys for section/item ids that no longer exist after merge.
 *
 * Rules for fixed (non-section, non-item) keys (furniture, masthead, etc.):
 *   They are page-global. Pass 1 keeps them unless incoming also has the key;
 *   Pass 2 then overlays the incoming value. Pass 3 always keeps fixed keys.
 *
 * @param storedMap      The map currently persisted on the stored menu.
 * @param incomingMap    The map sent in by the editor for this side.
 * @param scopeSet       Section ids owned by this editing side.
 * @param inScopeItemIds Item ids that belong to in-scope sections.
 * @param mergedSectionIds All section ids present after the merge.
 * @param mergedItemIds    All item ids present after the merge.
 * @returns The reconciled map, or undefined if empty.
 */
export function reconcileSpotMap<T extends string | number>(
  storedMap: Record<string, T>,
  incomingMap: Record<string, T>,
  scopeSet: Set<string>,
  inScopeItemIds: Set<string>,
  mergedSectionIds: Set<string>,
  mergedItemIds: Set<string>
): Record<string, T> | undefined {
  const reconciled: Record<string, T> = {};

  // Pass 1: preserve out-of-scope stored keys
  for (const [k, v] of Object.entries(storedMap) as [string, T][]) {
    if (k.startsWith("section-")) {
      const sId = k.slice("section-".length);
      if (!scopeSet.has(sId)) reconciled[k] = v;
    } else if (k.startsWith("item-")) {
      const iId = k.slice("item-".length);
      if (!inScopeItemIds.has(iId)) reconciled[k] = v;
    } else {
      // Fixed furniture key — page-global; incoming wins if present
      if (!(k in incomingMap)) reconciled[k] = v;
    }
  }

  // Pass 2: overlay incoming keys
  for (const [k, v] of Object.entries(incomingMap) as [string, T][]) {
    reconciled[k] = v;
  }

  // Pass 3: prune stale section/item keys
  const final: Record<string, T> = {};
  for (const [k, v] of Object.entries(reconciled) as [string, T][]) {
    if (k.startsWith("section-")) {
      const sId = k.slice("section-".length);
      if (mergedSectionIds.has(sId)) final[k] = v;
    } else if (k.startsWith("item-")) {
      const iId = k.slice("item-".length);
      if (mergedItemIds.has(iId)) final[k] = v;
    } else {
      final[k] = v;
    }
  }

  return Object.keys(final).length > 0 ? final : undefined;
}
