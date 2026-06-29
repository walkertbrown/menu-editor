"use client";
/**
 * usePreviewZoom — owns the preview zoom setting + effective scale for the toolbar.
 *
 * Default is fit-width (the long-standing auto behavior). The zoom in/out buttons
 * switch to a manual scale, stepped in 10% increments from the current effective
 * scale; "Fit page" fits the whole page (height included); "Fit width" returns
 * to the auto default.
 */

import { useState, useRef, useCallback } from "react";
import type { ZoomSetting } from "@/theme/SheetPreviewSpread";

const STEP = 0.1;
const MIN = 0.25;
const MAX = 1.5;
const clamp = (s: number) => Math.max(MIN, Math.min(MAX, s));

export function usePreviewZoom() {
  const [zoom, setZoom] = useState<ZoomSetting>({ mode: "fit-width" });
  const [scale, setScale] = useState(1);
  // Mirrors the live effective scale so rapid +/- clicks (before a re-render)
  // accumulate from the latest value rather than a stale one.
  const scaleRef = useRef(1);

  const onScaleChange = useCallback((s: number) => {
    setScale(s);
    scaleRef.current = s;
  }, []);

  // Snap the current effective scale to the nearest step, then move one step.
  const step = useCallback((dir: 1 | -1) => {
    const next = clamp(Math.round(scaleRef.current / STEP) * STEP + dir * STEP);
    scaleRef.current = next;
    setZoom({ mode: "manual", scale: next });
  }, []);

  const zoomIn = useCallback(() => step(1), [step]);
  const zoomOut = useCallback(() => step(-1), [step]);
  const fitPage = useCallback(() => setZoom({ mode: "fit-page" }), []);
  const fitWidth = useCallback(() => setZoom({ mode: "fit-width" }), []);

  return {
    zoom,
    scalePercent: Math.round(scale * 100),
    onScaleChange,
    zoomIn,
    zoomOut,
    fitPage,
    fitWidth,
  };
}
