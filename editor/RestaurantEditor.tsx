"use client";
// RestaurantEditor — editable fields for the shared restaurant identity.
//
// "House name", "eyebrow line", and optional logo appear on every page masthead.
// Changes are persisted immediately via PUT /api/restaurant and also
// surfaced to the parent via onRestaurantChange for live preview sync.

import { useState, useRef } from "react";
import type { RestaurantIdentity } from "@/content/types";

interface Props {
  restaurant: RestaurantIdentity;
  onRestaurantChange: (updated: RestaurantIdentity) => void;
}

export default function RestaurantEditor({ restaurant, onRestaurantChange }: Props) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [draft, setDraft] = useState<RestaurantIdentity>(restaurant);
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoMsg, setLogoMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const flashLogo = (msg: string) => {
    setLogoMsg(msg);
    setTimeout(() => setLogoMsg(""), 3000);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const form = new FormData();
      form.append("logo", file);
      const res = await fetch("/api/restaurant/logo", { method: "POST", body: form });
      if (!res.ok) throw new Error("Upload failed");
      const { logoUrl } = await res.json();
      const updated = { ...draft, logoUrl };
      setDraft(updated);
      onRestaurantChange(updated);
      flashLogo("Logo saved.");
    } catch {
      flashLogo("Upload failed.");
    } finally {
      setLogoUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLogoRemove = async () => {
    setLogoUploading(true);
    try {
      const res = await fetch("/api/restaurant/logo", { method: "DELETE" });
      if (!res.ok) throw new Error("Remove failed");
      const updated = { ...draft, logoUrl: undefined };
      setDraft(updated);
      onRestaurantChange(updated);
      flashLogo("Logo removed.");
    } catch {
      flashLogo("Remove failed.");
    } finally {
      setLogoUploading(false);
    }
  };

  const handleChange = (patch: Partial<RestaurantIdentity>) => {
    const updated = { ...draft, ...patch };
    setDraft(updated);
    onRestaurantChange(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/restaurant", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error("Save failed");
      flash("Saved.");
    } catch {
      flash("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={toggleBtnStyle}
        aria-expanded={open}
      >
        {open ? "▾" : "▸"} Restaurant Identity{" "}
        <span style={{ fontWeight: 400, color: "#888" }}>
          (applies to every page)
        </span>
      </button>

      {open && (
        <div style={panelStyle}>
          <label style={labelStyle}>House name</label>
          <input
            style={inputStyle}
            value={draft.houseName}
            onChange={(e) => handleChange({ houseName: e.target.value })}
            placeholder="e.g. The Pelican Club"
          />

          <label style={labelStyle}>Eyebrow line</label>
          <input
            style={inputStyle}
            value={draft.eyebrowLine}
            onChange={(e) => handleChange({ eyebrowLine: e.target.value })}
            placeholder="e.g. New Orleans · Established 1990"
          />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={saveBtnStyle}
            >
              {saving ? "Saving…" : "Save restaurant identity"}
            </button>
            {saveMsg && (
              <span style={{ fontSize: "0.82em", color: saveMsg.includes("fail") ? "#c00" : "#060" }}>
                {saveMsg}
              </span>
            )}
          </div>

          {/* ── Logo ─────────────────────────────────────────────────── */}
          <div style={{ borderTop: "1px solid #ddd", paddingTop: 10, marginTop: 4 }}>
            <label style={labelStyle}>Logo</label>
            {draft.logoUrl && (
              <div style={{ margin: "6px 0", padding: "8px", background: "#1a1a1a", borderRadius: 4, display: "inline-block" }}>
                {/* Dark background so light logos are visible */}
                <img src={draft.logoUrl} alt="restaurant logo" style={{ maxHeight: 48, maxWidth: 220, display: "block", objectFit: "contain" }} />
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                onChange={handleLogoUpload}
                disabled={logoUploading}
                style={{ fontSize: "0.82em", flex: 1, minWidth: 0 }}
              />
              {draft.logoUrl && (
                <button
                  onClick={handleLogoRemove}
                  disabled={logoUploading}
                  style={removeBtnStyle}
                >
                  Remove
                </button>
              )}
            </div>
            {logoMsg && (
              <span style={{ fontSize: "0.82em", color: logoMsg.includes("fail") ? "#c00" : "#060" }}>
                {logoMsg}
              </span>
            )}
            <p style={hintStyle}>Shown at the top of every page masthead. PNG, JPG, SVG, or WebP.</p>
          </div>

          <p style={hintStyle}>
            These fields update all pages at once — no per-menu save needed.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  border: "1px solid #b8c8d0",
  borderRadius: 6,
  marginBottom: 16,
  overflow: "hidden",
};

const toggleBtnStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  background: "#f0f5f7",
  border: "none",
  borderBottom: "1px solid #cad8dc",
  padding: "9px 14px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.88em",
  letterSpacing: "0.04em",
  color: "#2e3e4a",
};

const panelStyle: React.CSSProperties = {
  padding: "12px 14px",
  background: "#f7fbfd",
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8em",
  fontWeight: 600,
  color: "#4a5e6b",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #c0d0d8",
  borderRadius: 4,
  padding: "6px 10px",
  fontSize: "0.9em",
  fontFamily: "serif",
  color: "#222",
  boxSizing: "border-box",
};

const saveBtnStyle: React.CSSProperties = {
  background: "#2e3e4a",
  color: "#fff",
  border: "none",
  borderRadius: 4,
  padding: "6px 14px",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.82em",
  letterSpacing: "0.04em",
};

const hintStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "0.78em",
  color: "#999",
  fontStyle: "italic",
};

const removeBtnStyle: React.CSSProperties = {
  background: "#fff",
  color: "#c00",
  border: "1px solid #c00",
  borderRadius: 4,
  padding: "4px 10px",
  cursor: "pointer",
  fontSize: "0.8em",
  fontWeight: 600,
  whiteSpace: "nowrap",
};
