"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/catalog-types";
import { cartLineFor, priceFor } from "@/lib/pricing";
import { cn, formatNGN } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/shop/CartProvider";
import WishlistButton from "@/components/shop/WishlistButton";

export default function ProductBuyPanel({ product }: { product: Product }) {
  const [option, setOption] = useState(0);
  const [colour, setColour] = useState(0);
  const [added, setAdded] = useState(false);
  const { add } = useCart();
  const router = useRouter();

  const line = cartLineFor(product, option, colour);

  const price = priceFor(product, option);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-2xl text-accent sm:text-3xl">{formatNGN(price)}</p>
        <p className="mt-1.5 text-sm text-muted">
          Or {formatNGN(Math.round(price / 6))}/month over 6 months
        </p>
      </div>

      {product.options.length > 1 && (
        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Choose your capacity
          </legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.options.map((o, i) => (
              <button
                key={o.label}
                type="button"
                onClick={() => setOption(i)}
                aria-pressed={option === i}
                className={cn(
                  "flex-1 rounded-xl border px-4 py-3 text-left transition-colors sm:flex-none sm:px-5",
                  option === i
                    ? "border-accent bg-accent/10"
                    : "border-line hover:border-accent/50"
                )}
              >
                <span className="block text-sm font-medium">{o.label}</span>
                <span className="block font-mono text-xs text-muted">
                  {formatNGN(priceFor(product, i))}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {product.colours.length > 0 && (
        <fieldset>
          <legend className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
            Finish: <span className="text-foreground">{product.colours[colour]}</span>
          </legend>
          <div className="mt-4 flex flex-wrap gap-3">
            {product.colours.map((c, i) => (
              <button
                key={c}
                type="button"
                onClick={() => setColour(i)}
                aria-pressed={colour === i}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  colour === i
                    ? "border-accent text-accent"
                    : "border-line text-muted hover:border-accent/50"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          onClick={() => {
            add(line);
            setAdded(true);
          }}
          className="w-full py-3.5"
        >
          {added ? "Added to bag" : "Add to bag"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full py-3.5"
          onClick={() => {
            add(line);
            router.push("/checkout");
          }}
        >
          Buy now
        </Button>
        {added && (
          <p className="text-center text-sm">
            <Link href="/cart" className="text-accent hover:underline">View bag and check out</Link>
          </p>
        )}
        <WishlistButton category={product.category} slug={product.slug} className="w-full" />
      </div>

      <ul className="space-y-2.5 border-t border-line pt-6 text-sm text-muted">
        <li>In stock, ships within 24 hours in Lagos</li>
        <li>12-month Culverin warranty included</li>
        <li>Trade-in your old device to offset the price</li>
      </ul>
    </div>
  );
}
