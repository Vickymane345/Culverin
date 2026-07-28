"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { gaming } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export default function GamingShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-gaming-card]").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 90 + i * 30, scale: 0.88, opacity: 0.2 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 92%",
              end: "top 45%",
              scrub: true,
            },
          }
        );
      });

      gsap.to("[data-gaming-glow]", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section id="gaming" ref={root} className="relative overflow-hidden py-20 sm:py-24 md:py-32 lg:py-40">
      <div
        data-gaming-glow
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/4 left-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]"
      />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-12 max-w-3xl md:mb-20">
          <h2 className="text-balance font-semibold tracking-tight leading-[1.05] text-[clamp(1.9rem,4vw,4rem)]">
            Consoles and <span className="text-accent">gaming hardware</span>.
          </h2>
          <p className="mt-5 text-base text-muted sm:text-lg">
            Consoles, controllers, headsets and monitors, delivered and set up
            ready to play.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
          {gaming.map((p, i) => (
            <article
              key={p.name}
              data-gaming-card
              className={`group relative overflow-hidden rounded-3xl border border-line bg-surface will-change-transform ${
                i === 1 ? "md:translate-y-16" : ""
              }`}
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 border-t border-line bg-surface p-6">
                <h3 className="text-xl font-semibold">{p.name}</h3>
                <p className="text-sm text-muted">{p.tagline}</p>
                <span className="mt-2 block font-mono text-sm text-accent">
                  {p.price}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
