import Link from "next/link";
import type { Product } from "@/lib/catalog";
import ProductCard from "./ProductCard";

export default function ProductRail({
  title,
  blurb,
  products,
  href,
}: {
  title: string;
  blurb?: string;
  products: Product[];
  href?: string;
}) {
  if (!products.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">{title}</h2>
          {blurb && <p className="mt-1.5 text-muted">{blurb}</p>}
        </div>
        {href && (
          <Link href={href} className="text-sm text-accent hover:underline">
            See all
          </Link>
        )}
      </div>

      <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 xl:grid-cols-4">
        {products.map((p) => (
          <div key={p.slug} className="w-[70vw] shrink-0 snap-start sm:w-[42vw] md:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
