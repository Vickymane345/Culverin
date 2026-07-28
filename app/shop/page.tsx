import Link from "next/link";
import {
  categories,
  byCategory,
  newArrivals,
  bestValue,
  products,
} from "@/lib/catalog";
import ProductRail from "@/components/shop/ProductRail";
import { formatNGN } from "@/lib/utils";

const promos = [
  { label: "Free Lagos delivery", detail: "On orders above ₦250,000" },
  { label: "12-month warranty", detail: "On every new device" },
  { label: "Trade-ins accepted", detail: "Offset against your next phone" },
  { label: "In-house repair lab", detail: "Board level diagnostics" },
];

export default function ShopHub() {
  const iphones = byCategory("phones").filter((p) => p.brand === "Apple");
  const galaxies = byCategory("phones").filter((p) => p.brand === "Samsung");
  const laptops = byCategory("laptops");
  const cheapest = products.slice().sort((a, b) => a.price - b.price)[0];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 md:pb-24">
      <header className="py-12 sm:py-16 md:py-24">
        <h1 className="max-w-4xl text-balance font-semibold leading-[1.05] tracking-tight text-[clamp(1.9rem,5vw,4.5rem)]">
          Shop <span className="text-accent">all products</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
          {products.length} products across phones, laptops, tablets, audio,
          gaming and solar, starting at {formatNGN(cheapest.price)}. Genuine stock,
          verified and warranted.
        </p>
      </header>

      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {promos.map((p) => (
          <li key={p.label} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-sm font-medium">{p.label}</p>
            <p className="mt-1 text-xs text-muted">{p.detail}</p>
          </li>
        ))}
      </ul>

      <section className="py-12 sm:py-16 md:py-20">
        <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl md:mb-8 md:text-3xl">
          Shop by category
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const count = byCategory(c.id).length;
            const from = byCategory(c.id).reduce(
              (min, p) => Math.min(min, p.price),
              Infinity
            );
            return (
              <Link
                key={c.id}
                href={`/shop/${c.id}`}
                className="group relative overflow-hidden rounded-3xl border border-line bg-surface"
              >
                <img
                  src={c.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-xl font-semibold">{c.name}</h3>
                    <span className="font-mono text-xs text-white/70">
                      {count} items
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-white/80">{c.blurb}</p>
                  <p className="mt-3 font-mono text-sm text-white">
                    From {formatNGN(from)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <ProductRail
        title="New arrivals"
        blurb="The latest models from Apple and Samsung."
        products={newArrivals.slice(0, 4)}
        href="/shop/phones"
      />

      <ProductRail
        title="iPhone"
        blurb={`${iphones.length} models, iPhone 11 through iPhone 17 Pro Max.`}
        products={iphones.slice(-4).reverse()}
        href="/shop/phones"
      />

      <ProductRail
        title="Samsung Galaxy"
        blurb={`${galaxies.length} models, Galaxy S20 through S26 Ultra.`}
        products={galaxies.slice(-4).reverse()}
        href="/shop/phones"
      />

      <ProductRail
        title="Laptops"
        blurb="MacBook, Dell, HP, Lenovo and ASUS."
        products={laptops.slice().sort((a, b) => b.price - a.price).slice(0, 4)}
        href="/shop/laptops"
      />

      <ProductRail
        title="Under ₦350,000"
        blurb="Good hardware below flagship prices."
        products={bestValue.slice(0, 4)}
      />
    </div>
  );
}
