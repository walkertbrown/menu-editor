"use client";
// Top-level wrapper that adds Edit / Preview tabs around the menu editor.
// Phase 1: Edit tab = existing MenuEditor (unchanged); Preview tab = MenuPreview.
// The preview always reflects the current in-memory editor state via lifted
// state — MenuEditor exposes its live state via onStateChange callback.

import { useState, useCallback } from "react";
import type { Menu, Section, Item, VersionSnapshot } from "@/content/types";
import MenuEditor from "./MenuEditor";
import MenuPreview from "@/theme/MenuPreview";

interface Props {
  menu: Menu;
  sections: Section[];
  items: Item[];
  snapshots: VersionSnapshot[];
}

type Tab = "edit" | "preview";

export default function MenuEditorPage({
  menu: initialMenu,
  sections: initialSections,
  items: initialItems,
  snapshots,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("edit");

  // Live copies of editor state, updated by MenuEditor via onStateChange.
  const [liveMenu, setLiveMenu] = useState<Menu>(initialMenu);
  const [liveSections, setLiveSections] = useState<Section[]>(initialSections);
  const [liveItems, setLiveItems] = useState<Item[]>(initialItems);

  const handleStateChange = useCallback(
    (menu: Menu, sections: Section[], items: Item[]) => {
      setLiveMenu(menu);
      setLiveSections(sections);
      setLiveItems(items);
    },
    []
  );

  return (
    <div>
      {/* Tab bar */}
      <div className="pc-editor-chrome" style={tabBarStyle}>
        <div style={{ display: "flex", gap: 0, borderRadius: 6, overflow: "hidden", border: "1px solid #ccc" }}>
          <button
            onClick={() => setActiveTab("edit")}
            style={activeTab === "edit" ? activeTabStyle : inactiveTabStyle}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            style={activeTab === "preview" ? activeTabStyle : inactiveTabStyle}
          >
            Preview
          </button>
        </div>
        {activeTab === "preview" && (
          <button onClick={() => window.print()} style={printBtnStyle}>
            Print / Save PDF
          </button>
        )}
      </div>

      {/* Edit tab */}
      <div style={{ display: activeTab === "edit" ? "block" : "none" }}>
        <MenuEditor
          menu={initialMenu}
          sections={initialSections}
          items={initialItems}
          snapshots={snapshots}
          onStateChange={handleStateChange}
        />
      </div>

      {/* Preview tab */}
      {activeTab === "preview" && (
        <MenuPreview
          menu={liveMenu}
          sections={liveSections}
          items={liveItems}
        />
      )}
    </div>
  );
}

const tabBarStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 40,
  background: "#f5f5f5",
  borderBottom: "1px solid #e0e0e0",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const baseTabStyle: React.CSSProperties = {
  border: "none",
  padding: "7px 20px",
  cursor: "pointer",
  fontSize: "0.875em",
  fontWeight: 600,
  letterSpacing: "0.04em",
};

const activeTabStyle: React.CSSProperties = {
  ...baseTabStyle,
  background: "#1a1a1a",
  color: "#fff",
};

const inactiveTabStyle: React.CSSProperties = {
  ...baseTabStyle,
  background: "#fff",
  color: "#555",
};

const printBtnStyle: React.CSSProperties = {
  background: "#141210",
  color: "#f3ead7",
  border: "none",
  borderRadius: 4,
  padding: "7px 16px",
  cursor: "pointer",
  fontSize: "0.8em",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 600,
};
