import Link from "next/link";
import type { Product } from "@/lib/catalog";
import { formatNGN } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex items-center gap-1 text-xs text-[#b45309]"
      aria-label={`Rated ${rating} out of 5`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="m12 2 2.9 6.26 6.85.7-5.12 4.6 1.46 6.72L12 16.9 5.91 20.3l1.46-6.73L2.25 8.96l6.85-.7z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.category}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all duration-300 hover:border-accent/40 card-shadow hover:card-shadow-hover"
    >
      <div className="relative overflow-hidden product-canvas">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3">
            <Badge variant={product.badge === "New" ? "info" : "success"}>
              {product.badge}
            </Badge>
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          {product.brand}
        </p>
        <h3 className="font-medium leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-xs text-muted">{product.tagline}</p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <span className="font-mono text-sm text-accent">
            {formatNGN(product.price)}
          </span>
          <Stars rating={product.rating} />
        </div>
      </div>
    </Link>
  );
}
