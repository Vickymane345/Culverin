"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Phone & Laptop Repairs",
    body: "Board level diagnostics, screen and battery replacement, and water damage recovery, using genuine parts.",
    span: "md:col-span-2 md:row-span-1",
    accent: "text-accent",
  },
  {
    title: "App & Web Development",
    body: "Mobile and web applications built end to end.",
    span: "md:col-span-1 md:row-span-1",
    accent: "text-accent",
  },
  {
    title: "Animation & Graphic Design",
    body: "Brand identity, motion graphics and product visuals.",
    span: "md:col-span-1 md:row-span-1",
    accent: "text-accent",
  },
  {
    title: "Solar Installation & Maintenance",
    body: "Site survey, system sizing, installation and scheduled maintenance for homes and businesses.",
    span: "md:col-span-2 md:row-span-1",
    accent: "text-accent",
  },
];

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-service]", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 70%",
        },
      });
    },
    { scope: root }
  );

  return (
    <section id="services" ref={root} className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32 lg:py-40">
      <div className="mb-12 max-w-3xl md:mb-16">
        <h2 className="text-balance font-semibold tracking-tight leading-[1.05] text-[clamp(1.9rem,4vw,4rem)]">
          Services we <span className="text-accent">provide</span>.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 [grid-auto-flow:dense]">
        {services.map((s) => (
          <article
            key={s.title}
            data-service
            className={`group relative overflow-hidden rounded-3xl border border-line bg-surface p-6 sm:p-8 md:p-10 transition-colors hover:border-accent/50 ${s.span}`}
          >
            <h3 className={`text-2xl font-semibold ${s.accent}`}>{s.title}</h3>
            <p className="mt-4 text-muted leading-relaxed">{s.body}</p>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-surface blur-2xl transition-opacity duration-700 group-hover:opacity-0"
            />
          </article>
        ))}
      </div>

      <div className="mt-16 overflow-hidden border-y border-line py-5 md:mt-24 md:py-6" aria-hidden="true">
        <div className="animate-marquee flex w-max gap-12 font-mono text-sm uppercase tracking-[0.25em] text-muted">
          {Array.from({ length: 2 }).map((_, r) => (
            <div key={r} className="flex shrink-0 gap-12">
              {[
                "iPhones",
                "MacBooks",
                "Solar Inverters",
                "PlayStation",
                "Repairs",
                "App Development",
                "Graphic Design",
                "Installation",
              ].map((t) => (
                <span key={t} className="flex items-center gap-12">
                  {t} <span className="text-accent">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
