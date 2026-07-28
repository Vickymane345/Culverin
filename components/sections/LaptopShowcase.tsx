"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { laptops } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export default function LaptopShowcase() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section id="laptops" ref={root} className="relative overflow-hidden py-20 sm:py-24 md:py-0">
      <div className="md:h-screen md:flex md:flex-col md:justify-center">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-6 mb-8 md:mb-14">
          <h2 className="text-balance font-semibold tracking-tight leading-[1.05] text-[clamp(1.9rem,4vw,4rem)]">
            Laptops from <span className="text-accent">every major brand</span>.
          </h2>
        </div>

        <div
          ref={track}
          className="flex flex-col gap-6 px-5 sm:gap-8 sm:px-6 md:flex-row md:pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] md:pr-24 will-change-transform"
        >
          {laptops.map((p) => (
            <article
              key={p.name}
              className="group relative w-full md:w-[44vw] lg:w-[38vw] shrink-0 overflow-hidden rounded-3xl border border-line bg-surface"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="flex items-end justify-between gap-4 p-6">
                <div>
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted">{p.tagline}</p>
                </div>
                <span className="font-mono text-sm text-accent">{p.price}</span>
              </div>
            </article>
          ))}

          <div className="hidden md:flex w-[24vw] shrink-0 items-center">
            <p className="text-muted text-lg max-w-[16rem]">
              Every laptop is bench tested before it ships.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
