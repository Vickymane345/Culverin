"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

/**
 * Pointer-tracked 3D tilt.
 *
 * Only the hovered card animates, so a grid of 40 of these costs nothing until
 * you touch one. gsap.quickTo keeps the pointer handler off the render path.
 * Disabled for coarse pointers and reduced-motion.
 */
export default function Card3D({
  children,
  className,
  intensity = 8,
  lift = 14,
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  intensity?: number;
  /** Z translation on hover, in px. */
  lift?: number;
}) {
  const el = useRef<HTMLDivElement>(null);
  const rotX = useRef<((v: number) => void) | null>(null);
  const rotY = useRef<((v: number) => void) | null>(null);
  const transZ = useRef<((v: number) => void) | null>(null);
  const ready = useRef(false);

  function init() {
    if (ready.current || !el.current) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }
    const opts = { duration: 0.5, ease: "power3.out" };
    rotX.current = gsap.quickTo(el.current, "rotationX", opts);
    rotY.current = gsap.quickTo(el.current, "rotationY", opts);
    transZ.current = gsap.quickTo(el.current, "z", opts);
    ready.current = true;
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    init();
    if (!rotX.current || !rotY.current || !el.current) return;
    const r = el.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotY.current(px * intensity * 2);
    rotX.current(-py * intensity * 2);
    transZ.current?.(lift);
  }

  function onLeave() {
    rotX.current?.(0);
    rotY.current?.(0);
    transZ.current?.(0);
  }

  return (
    <div style={{ perspective: "900px" }} className={cn("h-full", className)}>
      <div
        ref={el}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="h-full will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
}
