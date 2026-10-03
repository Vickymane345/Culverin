"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Category } from "@/lib/catalog-types";

gsap.registerPlugin(ScrollTrigger);

export type Tile = Category & { count: number; from: string };

/**
 * Category tiles on a shared perspective plane. Each tile enters rotated back
 * in Z and settles flat as it scrolls into view, so the grid reads as physical
 * cards laid onto the page rather than flat rectangles fading in.
 */
export default function CategoryTiles({ tiles }: { tiles: Tile[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-tile]").forEach((tile, i) => {
          gsap.fromTo(
            tile,
            {
              rotateX: 26,
              rotateY: i % 2 === 0 ? -9 : 9,
              y: 70,
              scale: 0.92,
              opacity: 0,
            },
            {
              rotateX: 0,
              rotateY: 0,
              y: 0,
              scale: 1,
              opacity: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: tile,
                start: "top 92%",
                end: "top 55%",
                scrub: 0.8,
              },
            }
          );
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.from("[data-tile]", {
          y: 28,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <div
      ref={root}
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      style={{ perspective: "1200px" }}
    >
      {tiles.map((c) => (
        <Link
          key={c.id}
          data-tile
          href={`/shop/${c.id}`}
          className="group relative overflow-hidden rounded-3xl border border-line bg-surface will-change-transform"
          style={{ transformStyle: "preserve-3d" }}
        >
          <img
            src={c.image}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold">{c.name}</h3>
              <span className="font-mono text-xs text-white/70">
                {c.count} items
              </span>
            </div>
            <p className="mt-1.5 text-sm text-white/80">{c.blurb}</p>
            <p className="mt-3 font-mono text-sm text-white">From {c.from}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
