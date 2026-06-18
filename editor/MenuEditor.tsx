"use client";
// Main menu editor screen.
// Manages local React state for all sections + items.
// Persists to store on "Save" via API route.
// Supports version history and restore.

import { useState, useCallback } from "react";
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

interface Props {
  menu: Menu;
  sections: Section[];
  items: Item[];
  snapshots: VersionSnapshot[];
}

export default function MenuEditor({
  menu: initialMenu,
  sections: initialSections,
  items: initialItems,
  snapshots: initialSnapshots,
}: Props) {
  const [menu, setMenu] = useState<Menu>(initialMenu);
  const [sections, setSections] = useState<Section[]>(
    [...initialSections].sort((a, b) => a.sortOrder - b.sortOrder)
  );
  const [items, setItems] = useState<Item[]>(initialItems);
  const [snapshots, setSnapshots] = useState<VersionSnapshot[]>(initialSnapshots);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  // ---- Section operations ----------------------------------------------

  const addSection = () => {
    const newSection: Section = {
      id: uuidv4(),
      menuId: menu.id,
      name: "New Section",
      sortOrder: sections.length,
    };
    setSections((prev) => [...prev, newSection]);
    setMenu((m) => ({ ...m, sectionOrder: [...m.sectionOrder, newSection.id] }));
  };

  const renameSection = useCallback((sectionId: string, name: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, name } : s))
    );
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    if (!confirm("Delete section and all its items?")) return;
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setItems((prev) => prev.filter((i) => i.sectionId !== sectionId));
    setMenu((m) => ({
      ...m,
      sectionOrder: m.sectionOrder.filter((id) => id !== sectionId),
    }));
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

  // ---- Item operations ------------------------------------------------

  const addItem = useCallback((sectionId: string, type: Item["type"]) => {
    const base = {
      id: uuidv4(),
      menuId: menu.id,
      sectionId,
      sortOrder: items.filter((i) => i.sectionId === sectionId).length,
    };
    let newItem: Item;
    if (type === "food") {
      newItem = { ...base, type, name: "NEW ITEM", price: "0", description: "" };
    } else if (type === "wine_by_glass") {
      newItem = { ...base, type, name: "New Wine", price: "0", group: "White & Rosé" };
    } else if (type === "beer_cider") {
      newItem = { ...base, type, name: "New Beer", price: "0" };
    } else if (type === "cocktail") {
      newItem = { ...base, type, name: "New Cocktail", price: "0", ingredients: "" };
    } else {
      newItem = { ...base, type: "spirit_list", name: "New Spirit", price: "0" };
    }
    setItems((prev) => [...prev, newItem]);
  }, [menu.id, items]);

  const updateItem = useCallback((updated: Item) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }, []);

  const deleteItem = useCallback((itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  // ---- Drag-and-drop --------------------------------------------------

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const activeItem = prev.find((i) => i.id === active.id);
      if (!activeItem) return prev;

      // Check if dropped on a section droppable (cross-section move)
      if (String(over.id).startsWith("section-")) {
        const targetSectionId = String(over.id).replace("section-", "");
        if (activeItem.sectionId === targetSectionId) return prev;
        const updated = { ...activeItem, sectionId: targetSectionId };
        return prev.map((i) => (i.id === active.id ? updated : i));
      }

      // Same-section reorder
      const overItem = prev.find((i) => i.id === over.id);
      if (!overItem || activeItem.sectionId !== overItem.sectionId) return prev;

      const sectionItems = prev.filter((i) => i.sectionId === activeItem.sectionId);
      const activeIdx = sectionItems.findIndex((i) => i.id === active.id);
      const overIdx = sectionItems.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(sectionItems, activeIdx, overIdx).map((item, idx) => ({
        ...item,
        sortOrder: idx,
      }));

      return [
        ...prev.filter((i) => i.sectionId !== activeItem.sectionId),
        ...reordered,
      ];
    });
  };

  // ---- Save & restore -------------------------------------------------

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/menus/${menu.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu, sections, items }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setSnapshots(data.snapshots ?? snapshots);
      setSaveMsg("Saved.");
    } catch (err) {
      setSaveMsg("Save failed — check console.");
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  const handleRestore = async (snapshotId: string) => {
    if (!confirm("Restore this version? Unsaved changes will be lost.")) return;
    try {
      const res = await fetch(`/api/menus/${menu.id}/snapshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshotId }),
      });
      if (!res.ok) throw new Error("Restore failed");
      const data = await res.json();
      setMenu(data.menu);
      setSections([...data.sections].sort((a: Section, b: Section) => a.sortOrder - b.sortOrder));
      setItems(data.items);
      setShowHistory(false);
      setSaveMsg("Version restored.");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      setSaveMsg("Restore failed — check console.");
      console.error(err);
    }
  };

  // ---- Render ---------------------------------------------------------

  const orderedSections = sections.sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 16px" }}>
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <a href="/" style={{ fontSize: "0.85em", color: "#666", textDecoration: "none" }}>
            ← All Menus
          </a>
          <h1 style={{ fontFamily: "serif", margin: "4px 0 0" }}>{menu.name}</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {saveMsg && (
            <span style={{ fontSize: "0.85em", color: saveMsg.includes("fail") ? "#c00" : "#060" }}>
              {saveMsg}
            </span>
          )}
          <button
            onClick={() => setShowHistory((s) => !s)}
            style={secondaryBtnStyle}
          >
            History ({snapshots.length})
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={primaryBtnStyle}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Furniture header */}
      <PageFurniture furniture={menu.furniture} position="header" />

      {/* Version history panel */}
      {showHistory && (
        <div
          style={{
            background: "#fffbe6",
            border: "1px solid #e8d800",
            borderRadius: 8,
            padding: 14,
            marginBottom: 20,
          }}
        >
          <h3 style={{ margin: "0 0 10px", fontSize: "0.95em" }}>Version History</h3>
          {snapshots.length === 0 && (
            <p style={{ color: "#888", fontSize: "0.85em" }}>No snapshots yet. Save to create one.</p>
          )}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {snapshots.map((snap) => (
              <li
                key={snap.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                  fontSize: "0.875em",
                }}
              >
                <span>{snap.label}</span>
                <button
                  onClick={() => handleRestore(snap.id)}
                  style={{ ...secondaryBtnStyle, fontSize: "0.8em", padding: "2px 8px" }}
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section editors wrapped in single DndContext */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {orderedSections.map((section, idx) => {
          const sectionItems = items
            .filter((i) => i.sectionId === section.id)
            .sort((a, b) => a.sortOrder - b.sortOrder);

          return (
            <SectionEditor
              key={section.id}
              section={section}
              items={sectionItems}
              isFirst={idx === 0}
              isLast={idx === orderedSections.length - 1}
              onRename={(name) => renameSection(section.id, name)}
              onDelete={() => deleteSection(section.id)}
              onMoveUp={() => moveSectionUp(section.id)}
              onMoveDown={() => moveSectionDown(section.id)}
              onAddItem={(type) => addItem(section.id, type)}
              onUpdateItem={updateItem}
              onDeleteItem={deleteItem}
            />
          );
        })}
      </DndContext>

      {/* Add section */}
      <button onClick={addSection} style={{ ...secondaryBtnStyle, marginTop: 8 }}>
        + Add Section
      </button>

      {/* Furniture footer */}
      <PageFurniture furniture={menu.furniture} position="footer" />
    </div>
  );
}

const primaryBtnStyle: React.CSSProperties = {
  background: "#1a1a1a",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "8px 18px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.9em",
};

const secondaryBtnStyle: React.CSSProperties = {
  background: "#fff",
  color: "#333",
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: "6px 14px",
  cursor: "pointer",
  fontSize: "0.875em",
};
