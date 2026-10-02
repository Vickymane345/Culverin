"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/shop/CartProvider";
import { createClient } from "@/lib/supabase/client";

const links = [
  { href: "/#home", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About Us" },
  { href: "/repairs", label: "Repairs" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, []);

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
          "rounded-full pl-5 pr-2 py-2 flex items-center gap-6 w-full max-w-4xl justify-between transition-colors duration-300",
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
            "hidden lg:flex items-center gap-6 text-sm transition-colors",
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
            href="/cart"
            aria-label={`Bag, ${count} item${count === 1 ? "" : "s"}`}
            className={cn(
              "relative rounded-full p-2 transition-colors",
              overHero ? "text-white hover:bg-white/10" : "text-foreground hover:bg-surface"
            )}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                {count}
              </span>
            )}
          </Link>
          <Link
            href={signedIn ? "/dashboard" : "/signup"}
            className={cn(
              "rounded-full text-sm font-medium px-5 py-2 transition-colors whitespace-nowrap",
              overHero
                ? "bg-white text-[#1d1d1f] hover:bg-white/90"
                : "bg-accent text-white hover:bg-accent-hover"
            )}
          >
            {signedIn ? "My account" : "Get Started"}
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "lg:hidden rounded-full border p-2 transition-colors",
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
        <div className="glass absolute top-16 inset-x-4 rounded-2xl p-4 lg:hidden">
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
                href={signedIn ? "/dashboard" : "/signin"}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-foreground hover:text-accent"
              >
                {signedIn ? "My account" : "Sign in"}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
