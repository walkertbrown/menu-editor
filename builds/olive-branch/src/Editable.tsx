// Click-to-edit inline text. Renders the exact element; edits commit on blur/Enter.
// Stops pointer-down propagation so editing inside a draggable doesn't start a drag.
import { type CSSProperties } from 'react';

export function Editable({
  value,
  onChange,
  className,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={(className ? className + ' ' : '') + 'editable'}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      data-empty={value ? undefined : 'true'}
      onPointerDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
      onBlur={(e) => {
        const t = (e.currentTarget.textContent || '').trim();
        if (t !== value) onChange(t);
      }}
      style={style}
    >
      {value}
    </span>
  );
}
