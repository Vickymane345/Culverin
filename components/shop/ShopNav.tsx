"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

export default function ShopNav({ categories }: { categories: Pick<Category, "id" | "name">[] }) {
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur">
      <nav
        aria-label="Shop categories"
        className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 text-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-6"
      >
        <Link
          href="/shop"
          className={cn(
            "shrink-0 rounded-full px-4 py-2 transition-colors",
            pathname === "/shop"
              ? "bg-accent text-white font-medium"
              : "text-muted hover:bg-surface hover:text-foreground"
          )}
        >
          All
        </Link>
        {categories.map((c) => {
          const active = pathname.startsWith(`/shop/${c.id}`);
          return (
            <Link
              key={c.id}
              href={`/shop/${c.id}`}
              className={cn(
                "shrink-0 rounded-full px-4 py-2 transition-colors",
                active
                  ? "bg-accent text-white font-medium"
                  : "text-muted hover:bg-surface hover:text-foreground"
              )}
            >
              {c.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
