"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { user } from "@/lib/mock-data";

const nav = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/orders", label: "Orders" },
  { href: "/dashboard/wishlist", label: "Wishlist" },
  { href: "/dashboard/devices", label: "My Devices" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = (
    <ul className="space-y-1">
      {nav.map((n) => {
        const active =
          n.href === "/dashboard"
            ? pathname === n.href
            : pathname.startsWith(n.href);
        return (
          <li key={n.href}>
            <Link
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block rounded-xl px-4 py-2.5 text-sm transition-colors",
                active
                  ? "bg-accent text-white font-medium"
                  : "text-muted hover:bg-surface hover:text-foreground"
              )}
            >
              {n.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-line p-6 gap-8">
        <Link href="/" className="font-semibold tracking-tight">
          Culverin<span className="text-accent"> Quantum</span>
        </Link>
        <nav aria-label="Dashboard">{items}</nav>
        <div className="mt-auto rounded-2xl border border-line p-4">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="truncate text-xs text-muted">{user.email}</p>
          <Link
            href="/signin"
            className="mt-3 block text-xs text-muted transition-colors hover:text-accent"
          >
            Sign out
          </Link>
        </div>
      </aside>

      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-line bg-background/80 px-4 py-3 backdrop-blur">
        <Link href="/" className="font-semibold tracking-tight text-sm">
          Culverin<span className="text-accent"> Quantum</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Close dashboard menu" : "Open dashboard menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-line p-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
        {open && (
          <div className="glass absolute top-full inset-x-3 mt-2 rounded-2xl p-3">
            {items}
          </div>
        )}
      </div>
    </>
  );
}
