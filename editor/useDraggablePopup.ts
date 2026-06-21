"use client";
/**
 * useDraggablePopup — manages the {x,y} position of a draggable fixed popup.
 *
 * Initial position is derived from an anchor DOMRect (placed to the right of
 * the anchor). Pointer-down on the drag handle → pointer-move → pointer-up.
 * Position is clamped to the viewport so the popup never escapes off-screen.
 *
 * Usage:
 *   const { pos, handleDragStart } = useDraggablePopup(anchorRect, popupSize);
 *
 * Render:
 *   <div style={{ position: "fixed", left: pos.x, top: pos.y }}>
 *     <div onPointerDown={handleDragStart}>drag handle</div>
 *     …popup content…
 *   </div>
 */

import { useState, useCallback, useRef } from "react";

export interface PopupPos { x: number; y: number }

const POPUP_W = 280;
const POPUP_H = 300; // conservative estimate for clamping

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function anchorToPos(rect: DOMRect): PopupPos {
  const x = clamp(rect.right + 8, 0, window.innerWidth - POPUP_W - 4);
  const y = clamp(rect.top, 0, window.innerHeight - POPUP_H - 4);
  return { x, y };
}

export function useDraggablePopup(anchorRect: DOMRect | undefined) {
  const [pos, setPos] = useState<PopupPos>({ x: 100, y: 100 });
  // The anchor the current position was derived from. Selecting a new spot
  // (anchorRect identity changes) re-anchors the popup; dragging moves `pos`
  // within the current anchor. Adjusting state during render on a prop change
  // is the supported pattern and avoids a reposition flicker.
  const [posAnchor, setPosAnchor] = useState<DOMRect | undefined>(undefined);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  if (anchorRect !== posAnchor) {
    setPosAnchor(anchorRect);
    if (anchorRect) setPos(anchorToPos(anchorRect));
  }

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };

    function onMove(me: PointerEvent) {
      if (!dragStart.current) return;
      const dx = me.clientX - dragStart.current.mx;
      const dy = me.clientY - dragStart.current.my;
      const nx = clamp(dragStart.current.px + dx, 0, window.innerWidth - POPUP_W - 4);
      const ny = clamp(dragStart.current.py + dy, 0, window.innerHeight - POPUP_H - 4);
      setPos({ x: nx, y: ny });
    }
    function onUp() {
      dragStart.current = null;
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    }
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }, [pos.x, pos.y]);

  return { pos, handleDragStart };
}
