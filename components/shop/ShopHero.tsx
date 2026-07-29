"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useScrollProgress } from "@/lib/use-scroll-progress";

gsap.registerPlugin(ScrollTrigger);

const ShopScene = dynamic(() => import("./ShopScene"));

export default function ShopHero({
  productCount,
  fromPrice,
}: {
  productCount: number;
  fromPrice: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(root);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-shop-line]", {
        yPercent: 108,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
      })
        .from("[data-shop-sub]", { y: 20, opacity: 0, duration: 0.6 }, "-=0.45")
        .from("[data-shop-promo]", { y: 20, opacity: 0, duration: 0.5, stagger: 0.07 }, "-=0.3");

      // Headline drifts up and fades as the lattice takes over.
      gsap.to("[data-shop-head]", {
        yPercent: -18,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="relative">
      <ShopScene progress={progress} />

      <header
        data-shop-head
        className="relative py-14 sm:py-20 md:py-28 lg:py-32"
      >
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
          The store
        </p>

        <h1 className="mt-4 max-w-4xl font-semibold leading-[1.05] tracking-tight text-[clamp(1.9rem,5vw,4.5rem)]">
          <span className="block overflow-hidden">
            <span data-shop-line className="block">
              Shop all
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-shop-line className="block">
              <span className="text-accent">products</span>.
            </span>
          </span>
        </h1>

        <p
          data-shop-sub
          className="mt-5 max-w-2xl text-base text-muted sm:text-lg"
        >
          {productCount} products across phones, laptops, tablets, audio, gaming
          and solar, starting at {fromPrice}. Genuine stock, verified and
          warranted.
        </p>
      </header>
    </div>
  );
}
