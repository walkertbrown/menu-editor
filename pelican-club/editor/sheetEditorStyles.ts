// Shared style objects for SheetEditorPage and SheetTitleEditor.

export const tabBarStyle: React.CSSProperties = {
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

export const backLinkStyle: React.CSSProperties = {
  fontSize: "0.85em",
  color: "#666",
  textDecoration: "none",
  marginRight: 4,
};

const baseTabStyle: React.CSSProperties = {
  border: "none",
  padding: "7px 20px",
  cursor: "pointer",
  fontSize: "0.875em",
  fontWeight: 600,
  letterSpacing: "0.04em",
};

export const activeTabStyle: React.CSSProperties = {
  ...baseTabStyle,
  background: "#1a1a1a",
  color: "#fff",
};

export const inactiveTabStyle: React.CSSProperties = {
  ...baseTabStyle,
  background: "#fff",
  color: "#555",
};

export const printBtnStyle: React.CSSProperties = {
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

export const collapseToggleStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #ccc",
  borderRadius: 4,
  padding: "5px 12px",
  cursor: "pointer",
  fontSize: "0.78em",
  fontWeight: 600,
  letterSpacing: "0.05em",
  color: "#555",
};

export const sidebarContainerStyle: React.CSSProperties = {
  width: 440,
  flexShrink: 0,
  borderRight: "1px solid #e0e0e0",
  overflowY: "auto",
  background: "#fafafa",
};

export const faceToggleGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: 0,
  borderRadius: 6,
  overflow: "hidden",
  border: "1px solid #ccc",
  margin: "10px 14px",
};

export const sheetTitleBtnStyle: React.CSSProperties = {
  background: "none",
  border: "1px dashed #bbb",
  borderRadius: 4,
  padding: "4px 10px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.9em",
  color: "#333",
  letterSpacing: "0.02em",
};

export const sheetTitleInputStyle: React.CSSProperties = {
  border: "1px solid #999",
  borderRadius: 4,
  padding: "4px 8px",
  fontSize: "0.9em",
  fontWeight: 600,
  color: "#333",
  minWidth: 180,
};
