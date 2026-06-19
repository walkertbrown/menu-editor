"use client";
/**
 * CategorySpacingControl — sidebar panel for category-level baseline spacing.
 *
 * Always visible (not gated on a selected spot). Shows four rows:
 *   Section headers | Menu items | Masthead & intro | Footer
 * Each row has a slider (−40..+80) + number box + per-category Reset button.
 *
 * Pure UI — no persistence logic. Parent owns state via onChange/onReset.
 */

const MIN = -40;
const MAX = 80;

interface Props {
  categorySpacing: Record<string, number> | undefined;
  onChange: (category: string, value: number) => void;
  onReset: (category: string) => void;
}

const CATEGORIES: Array<{ key: string; label: string }> = [
  { key: "header", label: "Section headers" },
  { key: "item", label: "Menu items" },
  { key: "masthead", label: "Masthead & intro" },
  { key: "footer", label: "Footer" },
];

const containerStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid rgba(90,80,64,0.18)",
};

const headingStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "#5a5040",
  marginBottom: 8,
};

const rowStyle: React.CSSProperties = {
  marginBottom: 8,
};

const rowLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#2a2016",
  marginBottom: 3,
  fontWeight: 500,
};

const controlsRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const sliderStyle: React.CSSProperties = {
  flex: 1,
  accentColor: "#5a5040",
};

const numberStyle: React.CSSProperties = {
  width: 48,
  padding: "2px 4px",
  fontSize: 12,
  border: "1px solid #c5b99a",
  borderRadius: 3,
  textAlign: "right",
  background: "#faf8f3",
  color: "#2a2016",
};

const resetBtnStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#7a6a50",
  background: "none",
  border: "1px solid #c5b99a",
  borderRadius: 3,
  padding: "3px 6px",
  cursor: "pointer",
  whiteSpace: "nowrap",
};

const pxLabelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#7a6a50",
};

export default function CategorySpacingControl({ categorySpacing, onChange, onReset }: Props) {
  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Category spacing</div>
      {CATEGORIES.map(({ key, label }) => {
        const value = categorySpacing?.[key];
        const displayValue = value ?? 0;
        const hasOverride = value !== undefined;
        return (
          <div key={key} style={rowStyle}>
            <div style={rowLabelStyle}>{label}</div>
            <div style={controlsRowStyle}>
              <input
                type="range"
                min={MIN}
                max={MAX}
                value={displayValue}
                style={sliderStyle}
                onChange={(e) => onChange(key, Number(e.target.value))}
              />
              <input
                type="number"
                min={MIN}
                max={MAX}
                value={displayValue}
                style={numberStyle}
                onChange={(e) => {
                  const v = Math.max(MIN, Math.min(MAX, Number(e.target.value)));
                  if (!isNaN(v)) onChange(key, v);
                }}
              />
              <span style={pxLabelStyle}>px</span>
              {hasOverride ? (
                <button style={resetBtnStyle} onClick={() => onReset(key)}>
                  Reset
                </button>
              ) : (
                <span style={{ fontSize: 10, color: "#9a8a70", fontStyle: "italic", minWidth: 36 }}>
                  auto
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
