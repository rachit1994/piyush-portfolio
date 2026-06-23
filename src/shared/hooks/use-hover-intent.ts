"use client";

import { useEffect, useRef } from "react";

type HoverIntentActions = {
  onActivate: () => void;
  onDeactivate: () => void;
};

const INTENT_DELAY_MS = 150;

// Play on hover for devices that truly hover (desktop); tap/focus elsewhere
// (mobile, the primary audience). The short intent delay avoids spinning up a
// player while the pointer merely sweeps across the carousel.
export function useHoverIntent({
  onActivate,
  onDeactivate,
}: HoverIntentActions) {
  const canHover = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    canHover.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    return () => clearTimeout(timer.current);
  }, []);

  return {
    onPointerEnter: () => {
      if (!canHover.current) return;
      timer.current = setTimeout(onActivate, INTENT_DELAY_MS);
    },
    onPointerLeave: () => {
      clearTimeout(timer.current);
      if (canHover.current) onDeactivate();
    },
    onFocus: onActivate,
    onClick: onActivate,
  };
}
