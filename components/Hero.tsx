"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-line]", {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        delay: 0.2,
      }).from(
        "[data-hero-cta]",
        { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 },
        "-=0.5"
      );

      gsap.to("[data-hero-video]", {
        scale: 1.15,
        opacity: 0.35,
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
    <section
      id="home"
      ref={root}
      className="relative h-svh min-h-[600px] overflow-hidden bg-dark-bg text-dark-fg"
    >
      <video
        data-hero-video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/iphone-assembly.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-[radial-gradient(80rem_50rem_at_50%_110%,rgba(10,10,12,0.25),rgba(10,10,12,0.88))]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center sm:px-6">
        <h1 className="w-full max-w-6xl text-balance font-semibold leading-[1.02] tracking-tight text-[clamp(2rem,7vw,5.5rem)]">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              Phones, laptops, solar
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              and <span className="text-[#6cb8ff]">gaming gear</span>
            </span>
          </span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm text-white/75 sm:text-base md:text-lg">
          Genuine stock, twelve month warranty, and an in-house repair lab.
          Culverin Quantum Systems Limited, Nigeria.
        </p>

        <div className="mt-8 flex w-full max-w-sm flex-col items-stretch gap-3 sm:mt-10 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4">
          <Link
            data-hero-cta
            href="/shop"
            className="rounded-full bg-white px-8 py-3.5 text-center text-sm font-semibold text-[#1d1d1f] transition-colors hover:bg-white/90"
          >
            Shop now
          </Link>
          <Link
            data-hero-cta
            href="/signup"
            className="rounded-full border border-white/30 px-8 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Create account
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 inset-x-0 z-10 flex justify-center">
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/45">
          Scroll
        </div>
      </div>
    </section>
  );
}
