"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { solar } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export default function SolarShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-solar-card]");
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top top+=120",
          end: () => `+=${window.innerHeight * (cards.length - i) * 0.6}`,
          pin: true,
          pinSpacing: false,
        });
        if (i > 0) {
          gsap.from(card, {
            y: 80,
            scale: 0.96,
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "top top+=120",
              scrub: true,
            },
          });
        }
      });
    },
    { scope: root }
  );

  return (
    <section id="solar" ref={root} className="relative mx-auto max-w-6xl px-5 py-20 sm:px-6 md:py-32 lg:py-40">
      <div className="mb-12 max-w-3xl md:mb-20">
        <h2 className="text-balance font-semibold tracking-tight leading-[1.05] text-[clamp(1.9rem,4vw,4rem)]">
          Solar and <span className="text-accent">backup power</span>.
        </h2>
        <p className="mt-5 text-base text-muted sm:text-lg">
          Inverters, panels, lithium batteries and full installations, supplied
          and maintained by our energy team.
        </p>
      </div>

      <div className="relative flex flex-col gap-10 pb-[30vh]">
        {solar.map((p, i) => (
          <article
            key={p.name}
            data-solar-card
            className="group relative overflow-hidden rounded-3xl border border-line bg-surface card-shadow will-change-transform"
            style={{ zIndex: i + 1 }}
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="aspect-[16/8] w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 text-white">
              <h3 className="text-xl font-semibold sm:text-2xl md:text-3xl">{p.name}</h3>
              <p className="mt-2 text-white/80">{p.tagline}</p>
              <span className="mt-4 font-mono text-white">{p.price}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
