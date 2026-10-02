"use client";

import Link from "next/link";
import { useCart } from "@/components/shop/CartProvider";
import { priceCart, DELIVERY, MAX_QTY } from "@/lib/pricing";
import { formatNGN } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { lines, ready, subtotal, setQuantity, remove } = useCart();
  const priced = priceCart(lines);

  if (!ready) return <p className="text-muted">Loading your bag…</p>;

  if (priced.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Your bag is empty</h1>
        <p className="mt-3 text-muted">Find something you like in the shop.</p>
        <Link href="/shop" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Your bag</h1>

      <ul className="mt-8 divide-y divide-line rounded-2xl border border-line">
        {priced.map((l, i) => (
          <li key={`${l.product.slug}-${i}`} className="flex gap-4 p-4 sm:p-5">
            <img src={l.product.image} alt="" className="size-20 shrink-0 rounded-xl bg-surface object-cover sm:size-24" />
            <div className="min-w-0 flex-1">
              <Link href={`/shop/${l.product.category}/${l.product.slug}`} className="font-medium hover:text-accent">
                {l.product.name}
              </Link>
              <p className="mt-0.5 text-sm text-muted">
                {[l.option, l.colour].filter(Boolean).join(" · ")}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="text-sm text-muted">
                  Qty{" "}
                  <select
                    value={l.quantity}
                    onChange={(e) => setQuantity(i, Number(e.target.value))}
                    className="ml-1 rounded-lg border border-line bg-white px-2 py-1 text-foreground"
                  >
                    {Array.from({ length: MAX_QTY }, (_, n) => n + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => remove(i)} className="text-sm text-muted hover:text-danger">
                  Remove
                </button>
              </div>
            </div>
            <p className="whitespace-nowrap font-mono text-sm text-accent">{formatNGN(l.lineTotal)}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <p className="max-w-sm text-sm text-muted">
          Delivery is free in Lagos on orders above {formatNGN(DELIVERY.freeLagosAbove)}, otherwise{" "}
          {formatNGN(DELIVERY.lagos)} in Lagos and {formatNGN(DELIVERY.otherStates)} to other states.
        </p>
        <div className="sm:w-72">
          <div className="flex justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-mono">{formatNGN(subtotal)}</span>
          </div>
          <Link href="/checkout" className="mt-4 block">
            <Button type="button" className="w-full py-3.5">Check out</Button>
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-sm text-muted hover:text-foreground">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
