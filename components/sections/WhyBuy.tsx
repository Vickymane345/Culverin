"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const guarantees = [
  {
    stat: "12",
    unit: "months",
    title: "Warranty on every new device",
    text: "Covered from the day you collect it. Claims are handled by us, not routed to a third party.",
  },
  {
    stat: "100",
    unit: "%",
    title: "Checked before it ships",
    text: "Phones are IMEI verified against the manufacturer record. Laptops are bench tested under load.",
  },
  {
    stat: "24",
    unit: "hours",
    title: "Lagos dispatch",
    text: "In-stock orders leave the same or next working day. Free delivery above ₦250,000.",
  },
  {
    stat: "7",
    unit: "day",
    title: "Return window",
    text: "Unopened and unused items can come back within seven days of delivery.",
  },
];

export default function WhyBuy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from("[data-guarantee]", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      className="relative border-y border-line bg-surface-2 py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            Buying from Culverin
          </p>
          <h2 className="mt-4 text-balance font-semibold leading-[1.08] tracking-tight text-[clamp(1.9rem,4vw,3.25rem)]">
            What you get with every order.
          </h2>
          <p className="mt-5 text-base text-muted sm:text-lg">
            The same team sells, services and installs. That is why we can put
            numbers on this instead of adjectives.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 lg:grid-cols-4 lg:gap-5">
          {guarantees.map((g) => (
            <li
              key={g.title}
              data-guarantee
              className="flex flex-col rounded-2xl border border-line bg-background p-6 sm:p-7"
            >
              <p className="flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight text-accent sm:text-5xl">
                  {g.stat}
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                  {g.unit}
                </span>
              </p>
              <h3 className="mt-5 text-base font-semibold leading-snug">
                {g.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">
                {g.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-start gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between md:mt-16">
          <p className="max-w-xl text-sm text-muted sm:text-base">
            Culverin Quantum Systems Limited is registered in Nigeria under CAMA
            2020 and runs its own repair lab and solar installation team.
          </p>
          <Link
            href="/about"
            className="shrink-0 rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            About the company
          </Link>
        </div>
      </div>
    </section>
  );
}
