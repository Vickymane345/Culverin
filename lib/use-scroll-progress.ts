"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Scroll progress (0 to 1) through an element, written to a ref so that
 * animation frames can read it without triggering React re-renders.
 */
export function useScrollProgress(target: RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      const seen = window.innerHeight - rect.top;
      progress.current = Math.min(1, Math.max(0, seen / total));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return progress;
}
