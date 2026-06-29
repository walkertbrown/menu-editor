"use client";
// SideEditorPanel — wraps MenuEditor for one side of a sheet.
//
// When sectionFilter is provided (spirits pages), it filters the sections
// shown to the user and passed to MenuEditor.
//
// The SCOPE — the section ids this side originally owned — is captured ONCE
// at mount (via a lazy useState initializer) from the initially-filtered set.
// It must NOT drift as
// the user edits, because the server uses it to know which stored sections
// belong to this side and which belong to the other side. Passing a drifting
// scope would cause the server to over-preserve or under-preserve sections.

import { useMemo, useState } from "react";
import type { Menu, Section, Item, VersionSnapshot } from "@/content/types";
import MenuEditor from "./MenuEditor";

interface Props {
  menu: Menu;
  sections: Section[];
  items: Item[];
  snapshots: VersionSnapshot[];
  /** If set, only show sections whose name is in this set */
  sectionFilter?: Set<string>;
  /** Which spirits page slot this panel is for (for HeaderEditor context) */
  spiritsSlot?: "p1" | "p2";
  /** Called whenever in-memory state changes (for live preview sync) */
  onStateChange?: (menu: Menu, sections: Section[], items: Item[]) => void;
  /** Forwarded to MenuEditor — suppresses heading/back link, uses sidebar layout */
  embedded?: boolean;
  /** Current spacing for this side, merged at save time via ref in MenuEditor */
  spacing?: {
    categorySpacing?: Record<string, number>;
    spacingOverrides?: Record<string, number>;
    customCategories?: { id: string; name: string }[];
    spotCategories?: Record<string, string>;
    spacingBaseline?: Record<string, number>;
  };
}

export default function SideEditorPanel({
  menu,
  sections,
  items,
  snapshots,
  sectionFilter,
  spiritsSlot,
  onStateChange,
  embedded,
  spacing,
}: Props) {
  const filteredSections = useMemo(() => {
    if (!sectionFilter) return sections;
    return sections.filter((s) => sectionFilter.has(s.name));
  }, [sections, sectionFilter]);

  const filteredItems = useMemo(() => {
    if (!sectionFilter) return items;
    const sectionIds = new Set(filteredSections.map((s) => s.id));
    return items.filter((i) => sectionIds.has(i.sectionId));
  }, [items, filteredSections, sectionFilter]);

  // Capture the scope (ids of the initially-filtered sections) ONCE at mount via
  // a lazy useState initializer, so it never drifts as the user adds/removes
  // sections (the server uses it to know which sections this side owns) and is
  // read-safe during render. Only meaningful when sectionFilter is set (spirits).
  const [scopeSectionIds] = useState<string[] | undefined>(() =>
    sectionFilter
      ? sections.filter((s) => sectionFilter.has(s.name)).map((s) => s.id)
      : undefined
  );

  return (
    <MenuEditor
      menu={menu}
      sections={filteredSections}
      items={filteredItems}
      snapshots={snapshots}
      spiritsSlot={spiritsSlot}
      onStateChange={onStateChange}
      embedded={embedded}
      scopeSectionIds={scopeSectionIds}
      spacing={spacing}
    />
  );
}
