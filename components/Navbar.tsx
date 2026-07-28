"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Only the landing page opens on the dark video hero.
  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    if (pathname !== "/") {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <nav
        aria-label="Main"
        className={cn(
          "rounded-full pl-5 pr-2 py-2 flex items-center gap-6 w-full max-w-3xl justify-between transition-colors duration-300",
          overHero ? "glass-dark" : "glass"
        )}
      >
        <Link
          href="/"
          className={cn(
            "font-semibold tracking-tight text-sm md:text-base whitespace-nowrap transition-colors",
            overHero ? "text-white" : "text-foreground"
          )}
        >
          Culverin
          <span className={overHero ? "text-white/60" : "text-accent"}>
            {" "}
            Quantum
          </span>
        </Link>

        <ul
          className={cn(
            "hidden md:flex items-center gap-6 text-sm transition-colors",
            overHero ? "text-white/75" : "text-muted"
          )}
        >
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={cn(
                  "transition-colors",
                  overHero ? "hover:text-white" : "hover:text-foreground"
                )}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/signup"
            className={cn(
              "rounded-full text-sm font-medium px-5 py-2 transition-colors whitespace-nowrap",
              overHero
                ? "bg-white text-[#1d1d1f] hover:bg-white/90"
                : "bg-accent text-white hover:bg-accent-hover"
            )}
          >
            Get Started
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "md:hidden rounded-full border p-2 transition-colors",
              overHero ? "border-white/25 text-white" : "border-line text-foreground"
            )}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass absolute top-16 inset-x-4 rounded-2xl p-4 md:hidden">
          <ul className="flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-foreground hover:text-accent"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-line mt-2">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="block py-2.5 text-foreground hover:text-accent"
              >
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
