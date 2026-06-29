"use client";
// Hook that owns the save and restore API calls for the menu editor.
// Extracted to keep MenuEditor.tsx under the 300-line limit.
//
// scopeSectionIds: when provided, included in the PUT body so the server
// performs a scoped-merge save (preserving the other side's content).
// On a 409 (empty-save guard), prompts the user and retries with allowEmpty.

import { useState } from "react";
import type { Menu, Section, Item, VersionSnapshot } from "@/content/types";

interface UseMenuPersistProps {
  menuId: string;
  getState: () => { menu: Menu; sections: Section[]; items: Item[] };
  onRestored: (menu: Menu, sections: Section[], items: Item[]) => void;
  onSnapshotsUpdated: (snapshots: VersionSnapshot[]) => void;
  /** The canonical section ids this side owns. Passed to the server for
   *  scoped-merge saves. Undefined for unscoped (dinner / drinks) menus. */
  scopeSectionIds?: string[];
}

export function useMenuPersist({
  menuId,
  getState,
  onRestored,
  onSnapshotsUpdated,
  scopeSectionIds,
}: UseMenuPersistProps) {
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  const flash = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  /**
   * Sends the PUT request. When allowEmpty is true the server will bypass the
   * empty-save guard (called only after the user confirms).
   */
  const doSave = async (allowEmpty?: boolean): Promise<boolean> => {
    const { menu, sections, items } = getState();
    const body: Record<string, unknown> = { menu, sections, items };
    if (scopeSectionIds !== undefined) body.scopeSectionIds = scopeSectionIds;
    if (allowEmpty) body.allowEmpty = true;

    const res = await fetch(`/api/menus/${menuId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.status === 409) {
      // Empty-save guard: the server refused because the incoming side is
      // empty but the store has content there.
      const confirmed = window.confirm(
        "This will erase all content on this side of the menu. Continue?"
      );
      if (confirmed) {
        // Retry with allowEmpty=true (recursive, one level deep).
        return doSave(true);
      }
      flash("Save cancelled.");
      return false;
    }

    if (!res.ok) throw new Error(`Save failed (${res.status})`);

    const data = await res.json();
    if (data.snapshots) onSnapshotsUpdated(data.snapshots);
    return true;
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const succeeded = await doSave();
      if (succeeded) flash("Saved.");
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
