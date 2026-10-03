"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Product hero image on a 3D stage. The panel rotates gently on scroll and
 * tracks the pointer, so the product reads as an object sitting in space rather
 * than a flat photo in a box.
 */
export default function ProductStage({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const src = images[Math.min(active, images.length - 1)];
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const rotX = useRef<((v: number) => void) | null>(null);
  const rotY = useRef<((v: number) => void) | null>(null);
  const ready = useRef(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.from(panel.current, {
          rotateX: 20,
          rotateY: -14,
          z: -160,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
        });

        gsap.to(panel.current, {
          rotateY: 12,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top center",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    },
    { scope: root }
  );

  function init() {
    if (ready.current || !panel.current) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }
    const opts = { duration: 0.6, ease: "power3.out" };
    rotX.current = gsap.quickTo(panel.current, "rotationX", opts);
    rotY.current = gsap.quickTo(panel.current, "rotationY", opts);
    ready.current = true;
  }

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    init();
    if (!rotX.current || !rotY.current || !root.current) return;
    const r = root.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rotY.current(px * 16);
    rotX.current(-py * 10);
  }

  function onLeave() {
    rotX.current?.(0);
    rotY.current?.(0);
  }

  return (
    <div>
    <div
      ref={root}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ perspective: "1300px" }}
    >
      <div
        ref={panel}
        className="relative overflow-hidden rounded-3xl border border-line product-canvas card-shadow will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="depth-md">
          <img src={src} alt={alt} className="aspect-[4/5] w-full object-cover" />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 40% at 50% 8%, rgba(255,255,255,0.55), transparent 70%)",
          }}
        />
      </div>
    </div>
    {images.length > 1 && (
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1" role="tablist" aria-label="Product photos">
        {images.map((img, i) => (
          <button
            key={img + i}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Photo ${i + 1}`}
            onClick={() => setActive(i)}
            className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface transition-colors sm:size-20 ${
              i === active ? "border-accent" : "border-transparent hover:border-line"
            }`}
          >
            <img src={img} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    )}
    </div>
  );
}
