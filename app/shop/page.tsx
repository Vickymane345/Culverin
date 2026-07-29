import {
  categories,
  byCategory,
  newArrivals,
  bestValue,
  products,
} from "@/lib/catalog";
import ProductRail from "@/components/shop/ProductRail";
import ShopHero from "@/components/shop/ShopHero";
import CategoryTiles from "@/components/shop/CategoryTiles";
import PromoStrip from "@/components/shop/PromoStrip";
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
      <ShopHero
        productCount={products.length}
        fromPrice={formatNGN(cheapest.price)}
      />

      <PromoStrip promos={promos} />

      <section className="py-12 sm:py-16 md:py-20">
        <h2 className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl md:mb-8 md:text-3xl">
          Shop by category
        </h2>
        <CategoryTiles
          tiles={categories.map((c) => {
            const items = byCategory(c.id);
            return {
              ...c,
              count: items.length,
              from: formatNGN(items.reduce((min, p) => Math.min(min, p.price), Infinity)),
            };
          })}
        />
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
