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

import { useState, useCallback, useRef, useEffect } from "react";

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
  // Track whether user has manually dragged (so anchor updates don't reset it)
  const dragged = useRef(false);
  const dragStart = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);

  // Reset position when anchor changes and user has not dragged
  useEffect(() => {
    if (!anchorRect) return;
    if (!dragged.current) {
      setPos(anchorToPos(anchorRect));
    }
  }, [anchorRect]);

  // Reset drag state when anchor changes to a new spot
  const prevAnchorRef = useRef<DOMRect | undefined>(undefined);
  useEffect(() => {
    if (anchorRect !== prevAnchorRef.current) {
      dragged.current = false;
      prevAnchorRef.current = anchorRect;
      if (anchorRect) {
        setPos(anchorToPos(anchorRect));
      }
    }
  }, [anchorRect]);

  const handleDragStart = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    el.setPointerCapture(e.pointerId);
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };

    function onMove(me: PointerEvent) {
      if (!dragStart.current) return;
      dragged.current = true;
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
