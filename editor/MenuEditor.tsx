"use client";
// Main menu editor screen.
// Manages local React state for all sections + items.
// Save/restore logic lives in useMenuPersist.ts.

import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Menu, Section, Item, VersionSnapshot } from "@/content/types";
import SectionEditor from "./SectionEditor";
import PageFurniture from "@/theme/PageFurniture";
import HeaderEditor from "./HeaderEditor";
import { useMenuPersist } from "./useMenuPersist";

interface Props {
  menu: Menu;
  sections: Section[];
  items: Item[];
  snapshots: VersionSnapshot[];
  /** Which spirits page this panel is editing, if any */
  spiritsSlot?: "p1" | "p2";
  /** Phase 1: called whenever menu/sections/items state changes so the
   *  preview tab can stay in sync without a save. */
  onStateChange?: (menu: Menu, sections: Section[], items: Item[]) => void;
  /**
   * When true: suppress the back link and menu name heading, and switch to
   * full-width layout to fit inside the ~440px sidebar column.
   */
  embedded?: boolean;
  /**
   * The canonical section ids this side owns (stable for the component's
   * life — captured at mount from the initially-filtered set).
   * When provided, the save sends a scoped-merge request so the other
   * side's sections/items are preserved. Absent for unscoped menus.
   */
  scopeSectionIds?: string[];
  /**
   * Current spacing state owned by SheetEditorPage. Read at save time only
   * (via ref) — never synced into internal state to avoid update loops.
   */
  spacing?: { categorySpacing?: Record<string, number>; spacingOverrides?: Record<string, number> };
}

export default function MenuEditor({
  menu: initialMenu,
  sections: initialSections,
  items: initialItems,
  snapshots: initialSnapshots,
  spiritsSlot,
  onStateChange,
  embedded,
  scopeSectionIds,
  spacing,
}: Props) {
  const [menu, setMenu] = useState<Menu>(initialMenu);
  const [sections, setSections] = useState<Section[]>(
    [...initialSections].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [items, setItems] = useState<Item[]>(initialItems);
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>(initialSnapshots);
  const [showHistory, setShowHistory] = useState(false);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const sensors = useSensors(useSensor(PointerSensor));

  // Notify parent (MenuEditorPage) whenever state changes so the Preview tab
  // stays current. Runs after every render where menu/sections/items changed.
  useEffect(() => {
    onStateChange?.(menu, sections, items);
  }, [menu, sections, items, onStateChange]);

  // Stable ref so the hook can read current state without stale closures.
  const stateRef = useRef({ menu, sections, items });
  stateRef.current = { menu, sections, items };

  // Spacing ref: read at save time only, never drives re-renders.
  const spacingRef = useRef(spacing);
  spacingRef.current = spacing;

  const { saving, saveMsg, handleSave, handleRestore } = useMenuPersist({
    menuId: menu.id,
    getState: () => ({
      ...stateRef.current,
      menu: {
        ...stateRef.current.menu,
        categorySpacing: spacingRef.current?.categorySpacing,
        spacingOverrides: spacingRef.current?.spacingOverrides,
      },
    }),
    onRestored: (m, s, i) => { setMenu(m); setSections(s); setItems(i); setShowHistory(false); },
    onSnapshotsUpdated: setSnapshots,
    scopeSectionIds,
  });

  // ---- Section operations ------------------------------------------------

  const addSection = () => {
    const s: Section = { id: uuidv4(), menuId: menu.id, name: "New Section", sortOrder: sections.length };
    setSections((prev) => [...prev, s]);
    setMenu((m) => ({ ...m, sectionOrder: [...m.sectionOrder, s.id] }));
  };

  const renameSection = useCallback((sectionId: string, name: string) => {
    setSections((prev) => prev.map((s) => (s.id === sectionId ? { ...s, name } : s)));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    if (!confirm("Delete section and all its items?")) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setItems((prev) => prev.filter((i) => i.sectionId !== sectionId));
    setMenu((m) => ({ ...m, sectionOrder: m.sectionOrder.filter((id) => id !== sectionId) }));
  }, []);

  const moveSectionUp = useCallback((sectionId: string) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx <= 0) return prev;
      const next = arrayMove(prev, idx, idx - 1).map((s, i) => ({ ...s, sortOrder: i }));
      setMenu((m) => ({ ...m, sectionOrder: next.map((s) => s.id) }));
      return next;
    });
  }, []);

  const moveSectionDown = useCallback((sectionId: string) => {
    setSections((prev) => {
      const idx = prev.findIndex((s) => s.id === sectionId);
      if (idx >= prev.length - 1) return prev;
      const next = arrayMove(prev, idx, idx + 1).map((s, i) => ({ ...s, sortOrder: i }));
      setMenu((m) => ({ ...m, sectionOrder: next.map((s) => s.id) }));
      return next;
    });
  }, []);

  // ---- Item operations ---------------------------------------------------

  const addItem = useCallback((sectionId: string, type: Item["type"]) => {
    const base = { id: uuidv4(), menuId: menu.id, sectionId, sortOrder: items.filter((i) => i.sectionId === sectionId).length };
    let newItem: Item;
    if (type === "food") newItem = { ...base, type, name: "NEW ITEM", price: "0", description: "" };
    else if (type === "wine_by_glass") newItem = { ...base, type, name: "New Wine", price: "0", group: "White & Rosé" };
    else if (type === "beer_cider") newItem = { ...base, type, name: "New Beer", price: "0" };
    else if (type === "cocktail") newItem = { ...base, type, name: "New Cocktail", price: "0", ingredients: "" };
    else newItem = { ...base, type: "spirit_list", name: "New Spirit", price: "0" };
    setItems((prev) => [...prev, newItem]);
  }, [menu.id, items]);

  const updateItem = useCallback((updated: Item) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  // ---- Drag-and-drop -----------------------------------------------------

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setItems((prev) => {
      const activeItem = prev.find((i) => i.id === active.id);
      if (!activeItem) return prev;
      if (String(over.id).startsWith("section-")) {
        const targetSectionId = String(over.id).replace("section-", "");
        if (activeItem.sectionId === targetSectionId) return prev;
        return prev.map((i) => (i.id === active.id ? { ...i, sectionId: targetSectionId } : i));
      }
      const overItem = prev.find((i) => i.id === over.id);
      if (!overItem || activeItem.sectionId !== overItem.sectionId) return prev;
      const sectionItems = prev.filter((i) => i.sectionId === activeItem.sectionId);
      const reordered = arrayMove(
        sectionItems,
        sectionItems.findIndex((i) => i.id === active.id),
        sectionItems.findIndex((i) => i.id === over.id)
      ).map((item, idx) => ({ ...item, sortOrder: idx }));
      return [...prev.filter((i) => i.sectionId !== activeItem.sectionId), ...reordered];
    });
  };

  // ---- Collapse controls -------------------------------------------------

  const toggleCollapse = useCallback((sectionId: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  // ---- Render ------------------------------------------------------------

  const orderedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);
  const allCollapsed = orderedSections.length > 0 && orderedSections.every((s) => collapsedIds.has(s.id));

  const outerStyle: React.CSSProperties = embedded
    ? { padding: "12px 14px" }
    : { maxWidth: 800, margin: "0 auto", padding: "24px 16px" };

  return (
    <div style={outerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        {!embedded && (
          <div>
            <a href="/" style={{ fontSize: "0.85em", color: "#666", textDecoration: "none" }}>← All Menus</a>
            <h1 style={{ fontFamily: "serif", margin: "4px 0 0" }}>{menu.name}</h1>
          </div>
        )}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {saveMsg && <span style={{ fontSize: "0.85em", color: saveMsg.includes("fail") ? "#c00" : "#060" }}>{saveMsg}</span>}
          <button
            onClick={() => {
              if (allCollapsed) setCollapsedIds(new Set());
              else setCollapsedIds(new Set(orderedSections.map((s) => s.id)));
            }}
            style={secondaryBtnStyle}
            title={allCollapsed ? "Expand all sections" : "Collapse all sections"}
          >
            {allCollapsed ? "Expand all" : "Collapse all"}
          </button>
          <button onClick={() => setShowHistory((s) => !s)} style={secondaryBtnStyle}>
            History ({snapshots.length})
          </button>
          <button onClick={handleSave} disabled={saving} style={primaryBtnStyle}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <HeaderEditor
        menu={menu}
        spiritsSlot={spiritsSlot}
        onMenuChange={(updated) => setMenu(updated)}
      />

      <PageFurniture furniture={menu.furniture} position="header" />

      {showHistory && (
        <div style={{ background: "#fffbe6", border: "1px solid #e8d800", borderRadius: 8, padding: 14, marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 10px", fontSize: "0.95em" }}>Version History</h3>
          {snapshots.length === 0 && <p style={{ color: "#888", fontSize: "0.85em" }}>No snapshots yet. Save to create one.</p>}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {snapshots.map((snap) => (
              <li key={snap.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #eee", fontSize: "0.875em" }}>
                <span>{snap.label}</span>
                <button onClick={() => handleRestore(snap.id)} style={{ ...secondaryBtnStyle, fontSize: "0.8em", padding: "2px 8px" }}>Restore</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <DndContext id={`dnd-${menu.id}`} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {orderedSections.map((section, idx) => (
          <SectionEditor
            key={section.id}
            section={section}
            items={items.filter((i) => i.sectionId === section.id).sort((a, b) => a.sortOrder - b.sortOrder)}
            isFirst={idx === 0}
            isLast={idx === orderedSections.length - 1}
            collapsed={collapsedIds.has(section.id)}
            onToggleCollapse={() => toggleCollapse(section.id)}
            onRename={(name) => renameSection(section.id, name)}
            onDelete={() => deleteSection(section.id)}
            onMoveUp={() => moveSectionUp(section.id)}
            onMoveDown={() => moveSectionDown(section.id)}
            onAddItem={(type) => addItem(section.id, type)}
            onUpdateItem={updateItem}
            onDeleteItem={deleteItem}
          />
        ))}
      </DndContext>

      <button onClick={addSection} style={{ ...secondaryBtnStyle, marginTop: 8 }}>+ Add Section</button>
      <PageFurniture furniture={menu.furniture} position="footer" />
    </div>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  background: "#1a1a1a", color: "#fff", border: "none",
  borderRadius: 6, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: "0.9em",
};
const secondaryBtnStyle: React.CSSProperties = {
  background: "#fff", color: "#333", border: "1px solid #ccc",
  borderRadius: 6, padding: "6px 14px", cursor: "pointer", fontSize: "0.875em",
};
