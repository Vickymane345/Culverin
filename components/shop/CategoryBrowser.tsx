"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";
import { cn, formatNGN } from "@/lib/utils";

type Sort = "featured" | "price-asc" | "price-desc" | "rating";

const sorts: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

export default function CategoryBrowser({
  products,
  brands,
}: {
  products: Product[];
  brands: string[];
}) {
  const bounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(bounds.max);
  const [sort, setSort] = useState<Sort>("featured");
  const [query, setQuery] = useState("");
  const [openFilters, setOpenFilters] = useState(false);

  const shown = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice);
    if (activeBrands.length) {
      list = list.filter((p) => activeBrands.includes(p.brand));
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q)
      );
    }
    const sorted = [...list];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "rating") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [products, activeBrands, maxPrice, sort, query]);

  function toggleBrand(b: string) {
    setActiveBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  }

  function reset() {
    setActiveBrands([]);
    setMaxPrice(bounds.max);
    setQuery("");
    setSort("featured");
  }

  const filtersActive =
    activeBrands.length > 0 || maxPrice < bounds.max || query.trim() !== "";

  const filterPanel = (
    <div className="space-y-8">
      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Brand
        </h3>
        <ul className="mt-4 space-y-2.5">
          {brands.map((b) => (
            <li key={b}>
              <label className="flex cursor-pointer items-center gap-3 py-1 text-sm text-foreground hover:text-accent">
                <input
                  type="checkbox"
                  checked={activeBrands.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="size-4 rounded border-line bg-background accent-[#0066cc]"
                />
                {b}
                <span className="ml-auto font-mono text-xs text-muted">
                  {products.filter((p) => p.brand === b).length}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Max price
        </h3>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={5000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price"
          className="mt-4 w-full accent-[#0066cc]"
        />
        <div className="mt-2 flex justify-between font-mono text-xs text-muted">
          <span>{formatNGN(bounds.min)}</span>
          <span className="text-accent">{formatNGN(maxPrice)}</span>
        </div>
      </div>

      {filtersActive && (
        <button
          type="button"
          onClick={reset}
          className="text-sm text-accent hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10 xl:grid-cols-[16rem_1fr] xl:gap-12">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{filterPanel}</div>
      </aside>

      <div>
        <div className="mb-6 flex flex-wrap items-center gap-2.5 sm:gap-3 md:mb-8">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this category"
            aria-label="Search products"
            className="min-w-0 flex-1 basis-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent sm:basis-auto"
          />

          <label className="sr-only" htmlFor="sort">
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="min-w-0 flex-1 rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent sm:flex-none sm:px-4"
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id} className="bg-surface">
                {s.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setOpenFilters((v) => !v)}
            aria-expanded={openFilters}
            className={cn(
              "shrink-0 rounded-xl border px-4 py-2.5 text-sm transition-colors lg:hidden",
              filtersActive
                ? "border-accent text-accent"
                : "border-line hover:border-accent/50"
            )}
          >
            Filters
          </button>
        </div>

        {openFilters && (
          <div className="mb-8 rounded-2xl border border-line bg-surface p-6 lg:hidden">
            {filterPanel}
          </div>
        )}

        <p className="mb-5 text-sm text-muted">
          {shown.length} {shown.length === 1 ? "product" : "products"}
        </p>

        {shown.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-12 text-center">
            <p className="text-muted">Nothing matches those filters.</p>
            <button
              type="button"
              onClick={reset}
              className="mt-3 text-sm text-accent hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {shown.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
