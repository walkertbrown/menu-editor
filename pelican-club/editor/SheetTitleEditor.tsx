"use client";
// SheetTitleEditor — inline editable sheet title in the tab bar.
// Click the title to enter edit mode; press Enter or ✓ to save via API.

import { useState } from "react";
import {
  activeTabStyle,
  inactiveTabStyle,
  sheetTitleBtnStyle,
  sheetTitleInputStyle,
} from "./sheetEditorStyles";

interface Props {
  sheetId: string;
  initialTitle: string;
}

export default function SheetTitleEditor({ sheetId, initialTitle }: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const flash = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/sheet-titles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sheetId, title: draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      setTitle(draft);
      setEditing(false);
      flash("Saved.");
    } catch {
      flash("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          style={sheetTitleInputStyle}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setDraft(title); setEditing(false); }
          }}
          autoFocus
        />
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ ...activeTabStyle, padding: "4px 10px", fontSize: "0.8em" }}
        >
          {saving ? "…" : "✓"}
        </button>
        <button
          onClick={() => { setDraft(title); setEditing(false); }}
          style={{ ...inactiveTabStyle, padding: "4px 10px", fontSize: "0.8em" }}
        >
          ✕
        </button>
        {msg && (
          <span style={{ fontSize: "0.8em", color: msg.includes("fail") ? "#c00" : "#060" }}>
            {msg}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => { setDraft(title); setEditing(true); }}
      style={sheetTitleBtnStyle}
      title="Click to rename this sheet"
    >
      {title} ✎
    </button>
  );
}
