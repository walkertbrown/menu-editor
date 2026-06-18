"use client";
// SideEditorPanel — wraps MenuEditor for one side of a sheet.
//
// When sectionFilter is provided (spirits pages), it filters the sections
// shown to the user and passed to MenuEditor. Saves are still scoped to the
// underlying menu (menu-spirits), so all its items persist correctly.

import { useMemo } from "react";
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
}

export default function SideEditorPanel({
  menu,
  sections,
  items,
  snapshots,
  sectionFilter,
  spiritsSlot,
  onStateChange,
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

  return (
    <MenuEditor
      menu={menu}
      sections={filteredSections}
      items={filteredItems}
      snapshots={snapshots}
      spiritsSlot={spiritsSlot}
      onStateChange={onStateChange}
    />
  );
}
