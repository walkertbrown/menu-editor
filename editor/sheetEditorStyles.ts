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

export const tabGroupStyle: React.CSSProperties = {
  display: "flex",
  gap: 0,
  borderRadius: 6,
  overflow: "hidden",
  border: "1px solid #ccc",
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

export const flipBarStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "10px 20px",
  background: "#fafafa",
  borderBottom: "1px solid #e8e8e8",
};

export const sideLabelStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: "0.95em",
  color: "#333",
  letterSpacing: "0.04em",
};

export const flipBtnStyle: React.CSSProperties = {
  background: "#fff",
  border: "2px solid #1a1a1a",
  borderRadius: 6,
  padding: "7px 18px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "0.88em",
  letterSpacing: "0.04em",
  transition: "background 0.15s",
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
