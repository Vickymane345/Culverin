"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export interface Promo {
  label: string;
  detail: string;
}

/**
 * Promises strip. Each panel hinges up from flat on a shared perspective, as
 * though the row is folding into place.
 */
export default function PromoStrip({ promos }: { promos: Promo[] }) {
  const root = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.from("[data-promo]", {
          rotateX: -72,
          y: 34,
          opacity: 0,
          transformOrigin: "50% 100% -20px",
          duration: 0.85,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 88%" },
        });
      });
      mm.add("(max-width: 767px)", () => {
        gsap.from("[data-promo]", {
          y: 20,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: { trigger: root.current, start: "top 92%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <ul
      ref={root}
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      style={{ perspective: "900px" }}
    >
      {promos.map((p) => (
        <li
          key={p.label}
          data-promo
          className="rounded-2xl border border-line bg-surface p-5 will-change-transform"
        >
          <p className="text-sm font-medium">{p.label}</p>
          <p className="mt-1 text-xs text-muted">{p.detail}</p>
        </li>
      ))}
    </ul>
  );
}
