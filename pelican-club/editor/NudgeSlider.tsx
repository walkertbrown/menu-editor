"use client";
/**
 * NudgeSlider — shared presentational control for a single spacing row.
 *
 * Renders: slider (−40..+80) + number input + "px" label + Reset/auto indicator.
 * Reused by SpacingMenu (per-category rows) and SpotNudgePopup (per-spot row).
 *
 * Pure UI — no state or persistence. Parent owns value and wires onChange/onReset.
 */

export const NUDGE_MIN = -40;
export const NUDGE_MAX = 80;

interface Props {
  /** Current value. undefined = no override (auto). */
  value: number | undefined;
  /** Called when slider or number box changes. */
  onChange: (value: number) => void;
  /** Called when Reset is clicked — removes the override. */
  onReset: () => void;
  /** Optional label shown above the controls. */
  label?: string;
  /** Text shown on the Reset button when there is a value. Default: "Reset". */
  resetLabel?: string;
  /** Text/element shown when value is undefined (no override). Default: "auto". */
  autoLabel?: string;
}

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

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#2a2016",
  marginBottom: 3,
  fontWeight: 500,
};

export default function NudgeSlider({
  value,
  onChange,
  onReset,
  label,
  resetLabel = "Reset",
  autoLabel = "auto",
}: Props) {
  const displayValue = value ?? 0;
  const hasValue = value !== undefined;

  return (
    <div>
      {label && <div style={labelStyle}>{label}</div>}
      <div style={rowStyle}>
        <input
          type="range"
          min={NUDGE_MIN}
          max={NUDGE_MAX}
          value={displayValue}
          style={sliderStyle}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <input
          type="number"
          min={NUDGE_MIN}
          max={NUDGE_MAX}
          value={displayValue}
          style={numberStyle}
          onChange={(e) => {
            const v = Math.max(NUDGE_MIN, Math.min(NUDGE_MAX, Number(e.target.value)));
            if (!isNaN(v)) onChange(v);
          }}
        />
        <span style={pxLabelStyle}>px</span>
        {hasValue ? (
          <button style={resetBtnStyle} onClick={onReset}>
            {resetLabel}
          </button>
        ) : (
          <span style={{ fontSize: 10, color: "#9a8a70", fontStyle: "italic", minWidth: 36 }}>
            {autoLabel}
          </span>
        )}
      </div>
    </div>
  );
}
