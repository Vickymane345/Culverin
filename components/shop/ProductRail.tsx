"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

gsap.registerPlugin(ScrollTrigger);

/**
 * Product rail. On desktop the row arrives as a receding stack: each card
 * starts pushed back in Z and rotated off-axis, then squares up in sequence as
 * the rail scrolls into view.
 */
export default function ProductRail({
  title,
  blurb,
  products,
  href,
}: {
  title: string;
  blurb?: string;
  products: Product[];
  href?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        gsap.from("[data-rail-card]", {
          z: -260,
          rotateY: -22,
          x: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 84%" },
        });

        gsap.from("[data-rail-head]", {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 88%" },
        });
      });

      mm.add("(max-width: 767px)", () => {
        gsap.from("[data-rail-card]", {
          y: 24,
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

  if (!products.length) return null;

  return (
    <section ref={root} className="py-10 md:py-14">
      <div
        data-rail-head
        className="mb-7 flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
            {title}
          </h2>
          {blurb && <p className="mt-1.5 text-muted">{blurb}</p>}
        </div>
        {href && (
          <Link href={href} className="text-sm text-accent hover:underline">
            See all
          </Link>
        )}
      </div>

      <div
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 xl:grid-cols-4"
        style={{ perspective: "1500px" }}
      >
        {products.map((p) => (
          <div
            key={p.slug}
            data-rail-card
            className="w-[70vw] shrink-0 snap-start will-change-transform sm:w-[42vw] md:w-auto"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
