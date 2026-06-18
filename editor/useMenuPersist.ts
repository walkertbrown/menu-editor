"use client";
// Hook that owns the save and restore API calls for the menu editor.
// Extracted to keep MenuEditor.tsx under the 300-line limit.

import { useState } from "react";
import type { Menu, Section, Item, VersionSnapshot } from "@/content/types";

interface UseMenuPersistProps {
  menuId: string;
  getState: () => { menu: Menu; sections: Section[]; items: Item[] };
  onRestored: (menu: Menu, sections: Section[], items: Item[]) => void;
  onSnapshotsUpdated: (snapshots: VersionSnapshot[]) => void;
}

export function useMenuPersist({
  menuId,
  getState,
  onRestored,
  onSnapshotsUpdated,
}: UseMenuPersistProps) {
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const flash = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const { menu, sections, items } = getState();
      const res = await fetch(`/api/menus/${menuId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menu, sections, items }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      if (data.snapshots) onSnapshotsUpdated(data.snapshots);
      flash("Saved.");
    } catch (err) {
      flash("Save failed — check console.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (snapshotId: string) => {
    if (!confirm("Restore this version? Unsaved changes will be lost.")) return;
    try {
      const res = await fetch(`/api/menus/${menuId}/snapshots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ snapshotId }),
      });
      if (!res.ok) throw new Error("Restore failed");
      const data = await res.json();
      onRestored(
        data.menu,
        [...data.sections].sort((a: Section, b: Section) => a.sortOrder - b.sortOrder),
        data.items
      );
      flash("Version restored.");
    } catch (err) {
      flash("Restore failed — check console.");
      console.error(err);
    }
  };

  return { saving, saveMsg, handleSave, handleRestore };
}
