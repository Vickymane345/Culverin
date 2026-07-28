"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { iphones } from "@/lib/products";

gsap.registerPlugin(ScrollTrigger);

export default function IphoneShowcase() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "bottom bottom",
          pin: "[data-pin-title]",
          pinSpacing: false,
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-iphone-card]").forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.85, opacity: 0.3, rotateZ: gsap.utils.random(-4, 4) },
          {
            scale: 1,
            opacity: 1,
            rotateZ: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 40%",
              scrub: true,
            },
          }
        );
        gsap.to(card, {
          opacity: 0.25,
          scale: 0.94,
          ease: "power1.in",
          scrollTrigger: {
            trigger: card,
            start: "bottom 35%",
            end: "bottom 5%",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      id="shop"
      ref={root}
      className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 md:py-32 lg:py-40"
    >
      <div className="md:grid md:grid-cols-2 md:gap-12 lg:gap-16">
        <div data-pin-title className="md:h-screen md:flex md:flex-col md:justify-center">
          <h2 className="text-balance font-semibold tracking-tight leading-[1.05] text-[clamp(1.9rem,4vw,4rem)]">
            iPhone, checked and <span className="text-accent">verified</span>.
          </h2>
          <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
            Every unit is IMEI verified and set up before you collect it. Backed by
            our own repair lab.
          </p>
          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Verified. Warranted. Trade-ins accepted.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-8 sm:gap-10 md:mt-0 md:gap-24 md:py-[20vh]">
          {iphones.map((p) => (
            <figure
              key={p.name}
              data-iphone-card
              className="group relative overflow-hidden rounded-3xl border border-line bg-surface will-change-transform"
            >
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 border-t border-line bg-surface p-6">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted">{p.tagline}</p>
                  </div>
                  <span className="font-mono text-sm text-accent">{p.price}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
