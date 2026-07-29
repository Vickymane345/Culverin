"use client";

import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const AboutScene = dynamic(() => import("./AboutScene"));

export interface AboutSection {
  number: string;
  title: string;
  lead: string;
  body: string[];
  lines?: { heading: string; text: string }[];
  facts?: [string, string][];
}

export default function AboutStory({ sections }: { sections: AboutSection[] }) {
  const root = useRef<HTMLDivElement>(null);
  const active = useRef(0);
  const [current, setCurrent] = useState(0);

  useGSAP(
    () => {
      // Drive the 3D rig and the section marker from scroll position.
      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 38%",
          onToggle: (self) => {
            if (self.isActive) {
              active.current = i;
              setCurrent(i);
            }
          },
          onUpdate: (self) => {
            if (self.isActive) {
              active.current = i + (self.progress - 0.5) * 0.6;
            }
          },
        });

        gsap.from(el.querySelectorAll("[data-reveal]"), {
          y: 28,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 78%" },
        });
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="mx-auto max-w-7xl px-5 sm:px-6">
      <div className="lg:grid lg:grid-cols-[1fr_minmax(0,34rem)] lg:gap-16 xl:gap-24">
        {/* Pinned 3D column */}
        <div className="hidden lg:block">
          <div className="sticky top-0 flex h-svh flex-col justify-center">
            <div className="relative aspect-square w-full max-w-lg">
              <AboutScene active={active} />

              {/* Section index overlaid on the armature */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-center">
                <ol className="space-y-3">
                  {sections.map((s, i) => (
                    <li
                      key={s.number}
                      className={cn(
                        "flex items-center gap-4 transition-all duration-500",
                        i === current
                          ? "opacity-100"
                          : "opacity-35"
                      )}
                    >
                      <span
                        className={cn(
                          "h-px transition-all duration-500",
                          i === current ? "w-12 bg-accent" : "w-5 bg-line"
                        )}
                      />
                      <span
                        className={cn(
                          "font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-500",
                          i === current ? "text-accent" : "text-muted"
                        )}
                      >
                        {s.number} {s.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Scrolling narrative */}
        {/* Below lg the 3D column is hidden, so cap the measure here or
            paragraphs run to ~950px on tablets. */}
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none lg:py-[22vh]">
          {sections.map((s, i) => (
            <section
              key={s.number}
              data-section
              className={cn(
                "border-t border-line py-12 first:border-t-0 first:pt-0 md:py-16 lg:py-24",
                i === 0 && "lg:pt-0"
              )}
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-sm text-accent" data-reveal>
                  {s.number}
                </span>
                <h2
                  data-reveal
                  className="text-balance font-semibold tracking-tight text-[clamp(1.6rem,3vw,2.5rem)]"
                >
                  {s.title}
                </h2>
              </div>

              <p
                data-reveal
                className="mt-5 text-lg font-medium leading-relaxed text-foreground"
              >
                {s.lead}
              </p>

              {s.body.map((p) => (
                <p
                  key={p}
                  data-reveal
                  className="mt-4 text-base leading-relaxed text-muted"
                >
                  {p}
                </p>
              ))}

              {s.lines && (
                <ul className="mt-8 space-y-4">
                  {s.lines.map((l) => (
                    <li
                      key={l.heading}
                      data-reveal
                      className="rounded-2xl border border-line bg-surface p-5"
                    >
                      <h3 className="text-sm font-semibold">{l.heading}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {l.text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {s.facts && (
                <dl className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {s.facts.map(([k, v]) => (
                    <div
                      key={k}
                      data-reveal
                      className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-2.5"
                    >
                      <dt className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                        {k}
                      </dt>
                      <dd className="text-sm font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
