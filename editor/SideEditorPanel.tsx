"use client";
// SideEditorPanel — wraps MenuEditor for one side of a sheet.
//
// When sectionFilter is provided (spirits pages), it filters the sections
// shown to the user and passed to MenuEditor.
//
// The SCOPE — the section ids this side originally owned — is captured ONCE
// at mount (via useRef) from the initially-filtered set. It must NOT drift as
// the user edits, because the server uses it to know which stored sections
// belong to this side and which belong to the other side. Passing a drifting
// scope would cause the server to over-preserve or under-preserve sections.

import { useMemo, useRef } from "react";
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
  /** Current spacing for this side (categorySpacing + spacingOverrides), merged at save time */
  spacing?: { categorySpacing?: Record<string, number>; spacingOverrides?: Record<string, number> };
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

  // Capture the scope (ids of the initially-filtered sections) ONCE at mount.
  // This is intentionally a ref so it never re-triggers effects or re-renders,
  // and so the scope remains stable even as the user adds/removes sections.
  // The scope is only meaningful when sectionFilter is set (spirits pages).
  const scopeRef = useRef<string[] | undefined>(undefined);
  if (scopeRef.current === undefined && sectionFilter) {
    // First render: record which section ids match this side's filter.
    scopeRef.current = sections
      .filter((s) => sectionFilter.has(s.name))
      .map((s) => s.id);
  }

  return (
    <MenuEditor
      menu={menu}
      sections={filteredSections}
      items={filteredItems}
      snapshots={snapshots}
      spiritsSlot={spiritsSlot}
      onStateChange={onStateChange}
      embedded={embedded}
      scopeSectionIds={scopeRef.current}
      spacing={spacing}
    />
  );
}
