"use client";
/**
 * useSpotSpacing — owns per-side spacing state for SheetEditorPage.
 *
 * State owned: categorySpacing, spacingOverrides, customCategories, spotCategories
 * (all per-side; both sides initialized from their respective menus at mount).
 *
 * SheetEditorPage is the OWNER of spacing. MenuEditor owns sections/items/header.
 * They are merged only at save time (via the spacing prop ref in MenuEditor) and
 * in the preview render (by merging into the menu passed to SheetPreviewSpread).
 *
 * Phase 3 additions:
 *   - customCategories: user-defined categories ({ id, name }[])
 *   - spotCategories: spotId → categoryId assignment map
 *   - createCategory(name) → id
 *   - assignSpot(spotId, categoryId|null)
 * These are included in mergeSpacingIntoMenu so they reach the live preview
 * and the save body.
 */

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type { Menu } from "@/content/types";

export interface SideSpacing {
  categorySpacing?: Record<string, number>;
  spacingOverrides?: Record<string, number>;
  customCategories?: { id: string; name: string }[];
  spotCategories?: Record<string, string>;
}

interface UseSpotSpacingResult {
  frontSpacing: SideSpacing;
  backSpacing: SideSpacing;
  /** Returns the spacing for the given face */
  spacingFor: (face: "front" | "back") => SideSpacing;
  /** Update a per-spot override for the given face */
  handleSpacingChange: (face: "front" | "back", spotId: string, value: number) => void;
  /** Remove a per-spot override for the given face */
  handleSpacingReset: (face: "front" | "back", spotId: string) => void;
  /** Update a category value for the given face */
  handleCategoryChange: (face: "front" | "back", category: string, value: number) => void;
  /** Remove a category entry for the given face */
  handleCategoryReset: (face: "front" | "back", category: string) => void;
  /** Create a new custom category; returns the new id */
  handleCreateCategory: (face: "front" | "back", name: string) => string;
  /** Assign a spot to a category (null removes the assignment) */
  handleAssignSpot: (face: "front" | "back", spotId: string, categoryId: string | null) => void;
  /** Returns a menu object with current spacing merged in (for preview) */
  mergeSpacingIntoMenu: (face: "front" | "back", menu: Menu) => Menu;
}

export function useSpotSpacing(
  initialFrontMenu: Menu,
  initialBackMenu: Menu
): UseSpotSpacingResult {
  const [frontSpacing, setFrontSpacing] = useState<SideSpacing>({
    categorySpacing: initialFrontMenu.categorySpacing,
    spacingOverrides: initialFrontMenu.spacingOverrides,
    customCategories: initialFrontMenu.customCategories,
    spotCategories: initialFrontMenu.spotCategories,
  });
  const [backSpacing, setBackSpacing] = useState<SideSpacing>({
    categorySpacing: initialBackMenu.categorySpacing,
    spacingOverrides: initialBackMenu.spacingOverrides,
    customCategories: initialBackMenu.customCategories,
    spotCategories: initialBackMenu.spotCategories,
  });

  const setSpacing = useCallback(
    (face: "front" | "back", updater: (prev: SideSpacing) => SideSpacing) => {
      if (face === "front") setFrontSpacing(updater);
      else setBackSpacing(updater);
    },
    []
  );

  const spacingFor = useCallback(
    (face: "front" | "back") => (face === "front" ? frontSpacing : backSpacing),
    [frontSpacing, backSpacing]
  );

  const handleSpacingChange = useCallback(
    (face: "front" | "back", spotId: string, value: number) => {
      setSpacing(face, (prev) => ({
        ...prev,
        spacingOverrides: { ...(prev.spacingOverrides ?? {}), [spotId]: value },
      }));
    },
    [setSpacing]
  );

  const handleSpacingReset = useCallback(
    (face: "front" | "back", spotId: string) => {
      setSpacing(face, (prev) => {
        const next = { ...(prev.spacingOverrides ?? {}) };
        delete next[spotId];
        return {
          ...prev,
          spacingOverrides: Object.keys(next).length > 0 ? next : undefined,
        };
      });
    },
    [setSpacing]
  );

  const handleCategoryChange = useCallback(
    (face: "front" | "back", category: string, value: number) => {
      setSpacing(face, (prev) => ({
        ...prev,
        categorySpacing: { ...(prev.categorySpacing ?? {}), [category]: value },
      }));
    },
    [setSpacing]
  );

  const handleCategoryReset = useCallback(
    (face: "front" | "back", category: string) => {
      setSpacing(face, (prev) => {
        const next = { ...(prev.categorySpacing ?? {}) };
        delete next[category];
        return {
          ...prev,
          categorySpacing: Object.keys(next).length > 0 ? next : undefined,
        };
      });
    },
    [setSpacing]
  );

  const handleCreateCategory = useCallback(
    (face: "front" | "back", name: string): string => {
      const id = uuidv4();
      setSpacing(face, (prev) => ({
        ...prev,
        customCategories: [...(prev.customCategories ?? []), { id, name }],
      }));
      return id;
    },
    [setSpacing]
  );

  const handleAssignSpot = useCallback(
    (face: "front" | "back", spotId: string, categoryId: string | null) => {
      setSpacing(face, (prev) => {
        const next = { ...(prev.spotCategories ?? {}) };
        if (categoryId === null) {
          delete next[spotId];
        } else {
          next[spotId] = categoryId;
        }
        return {
          ...prev,
          spotCategories: Object.keys(next).length > 0 ? next : undefined,
        };
      });
    },
    [setSpacing]
  );

  const mergeSpacingIntoMenu = useCallback(
    (face: "front" | "back", menu: Menu): Menu => {
      const spacing = face === "front" ? frontSpacing : backSpacing;
      return {
        ...menu,
        categorySpacing: spacing.categorySpacing,
        spacingOverrides: spacing.spacingOverrides,
        customCategories: spacing.customCategories,
        spotCategories: spacing.spotCategories,
      };
    },
    [frontSpacing, backSpacing]
  );

  return {
    frontSpacing,
    backSpacing,
    spacingFor,
    handleSpacingChange,
    handleSpacingReset,
    handleCategoryChange,
    handleCategoryReset,
    handleCreateCategory,
    handleAssignSpot,
    mergeSpacingIntoMenu,
  };
}
