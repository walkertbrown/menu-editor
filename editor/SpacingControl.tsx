"use client";
/**
 * SpacingControl — sidebar panel for the per-spot vertical spacing editor.
 *
 * Renders when a spot is selected in the preview. Shows:
 *   - A friendly label for the selected spot (via spotLabel)
 *   - A slider (−40 to +80 px) bound to the current override value
 *   - A number input (same bounds), kept in sync with the slider
 *   - A Reset button that removes the override key entirely
 *
 * Pure UI — no persistence logic. Parent owns the state and wires
 * onChange / onReset into the live menu state.
 */

import { spotLabel } from "@/theme/spotSpacing";

const MIN = -40;
const MAX = 80;

interface Props {
  /** The currently selected spot id, or undefined if nothing is selected. */
  selectedSpotId: string | undefined;
  /** Current override value for that spot. undefined = no override (auto). */
  value: number | undefined;
  /** The category-level baseline value this spot would fall back to on reset. */
  categoryBaseline?: number;
  /** Called when slider or number-box changes. */
  onChange: (value: number) => void;
  /** Called when Reset is clicked — removes the override key. */
  onReset: () => void;
}

const containerStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid rgba(90,80,64,0.18)",
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "#5a5040",
  marginBottom: 6,
};

const spotNameStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#2a2016",
  marginBottom: 8,
  fontStyle: "italic",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 6,
};

const sliderStyle: React.CSSProperties = {
  flex: 1,
  accentColor: "#5a5040",
};

const numberStyle: React.CSSProperties = {
  width: 54,
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
  padding: "3px 8px",
  cursor: "pointer",
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#9a8a70",
  fontStyle: "italic",
  padding: "10px 14px",
  borderBottom: "1px solid rgba(90,80,64,0.18)",
};

export default function SpacingControl({
  selectedSpotId,
  value,
  categoryBaseline,
  onChange,
  onReset,
}: Props) {
  if (!selectedSpotId) {
    return (
      <div style={hintStyle}>
        Click any element in the preview to adjust its spacing.
      </div>
    );
  }

  const displayValue = value ?? 0;

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>Spacing nudge</div>
      <div style={spotNameStyle}>{spotLabel(selectedSpotId)}</div>
      {categoryBaseline !== undefined && (
        <div style={{ fontSize: 10, color: "#9a8a70", fontStyle: "italic", marginBottom: 6 }}>
          Category baseline: {categoryBaseline}px
        </div>
      )}
      <div style={rowStyle}>
        <input
          type="range"
          min={MIN}
          max={MAX}
          value={displayValue}
          style={sliderStyle}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          type="number"
          min={MIN}
          max={MAX}
          value={displayValue}
          style={numberStyle}
          onChange={(e) => {
            const v = Math.max(MIN, Math.min(MAX, Number(e.target.value)));
            if (!isNaN(v)) onChange(v);
          }}
        />
        <span style={{ fontSize: 11, color: "#7a6a50" }}>px</span>
      </div>
      {value !== undefined ? (
        <button style={resetBtnStyle} onClick={onReset}>
          {categoryBaseline !== undefined ? "Reset to category" : "Reset to auto"}
        </button>
      ) : (
        <span style={{ fontSize: 10, color: "#9a8a70", fontStyle: "italic" }}>
          {categoryBaseline !== undefined ? `Using category (${categoryBaseline}px)` : "Auto (no override)"}
        </span>
      )}
    </div>
  );
}
