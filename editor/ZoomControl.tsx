"use client";
/**
 * ZoomControl — toolbar zoom widget:  [ − ]  75%  [ + ]   [ Fit page ]
 *
 * The percentage is clickable and resets to fit-width (the auto default).
 * Tagged pc-editor-chrome so it never prints.
 */

interface Props {
  /** Current effective scale as a whole-number percentage. */
  scalePercent: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onFitPage: () => void;
  onFitWidth: () => void;
}

const groupStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
};

const btnStyle: React.CSSProperties = {
  background: "#faf8f3",
  color: "#3a3020",
  border: "1px solid #c5b99a",
  borderRadius: 5,
  padding: "5px 9px",
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  minWidth: 26,
};

const pctStyle: React.CSSProperties = {
  ...btnStyle,
  minWidth: 46,
  textAlign: "center",
  fontVariantNumeric: "tabular-nums",
};

const fitStyle: React.CSSProperties = {
  ...btnStyle,
  minWidth: 0,
  letterSpacing: "0.03em",
};

export default function ZoomControl({
  scalePercent,
  onZoomOut,
  onZoomIn,
  onFitPage,
  onFitWidth,
}: Props) {
  return (
    <div className="pc-editor-chrome" style={groupStyle}>
      <button style={btnStyle} onClick={onZoomOut} aria-label="Zoom out" title="Zoom out">
        −
      </button>
      <button
        style={pctStyle}
        onClick={onFitWidth}
        title="Reset to fit width"
      >
        {scalePercent}%
      </button>
      <button style={btnStyle} onClick={onZoomIn} aria-label="Zoom in" title="Zoom in">
        +
      </button>
      <button style={fitStyle} onClick={onFitPage} title="Fit the whole page in view">
        Fit page
      </button>
    </div>
  );
}
