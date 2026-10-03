"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useCart } from "@/components/shop/CartProvider";
import { deliveryFee, lineTotal, NIGERIAN_STATES } from "@/lib/pricing";
import { formatNGN, cn } from "@/lib/utils";
import { BANK } from "@/lib/site";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { placeOrder } from "./actions";

export type Prefill = Partial<Record<"fullName" | "email" | "phone" | "address" | "city" | "state", string>>;

export default function CheckoutForm({
  prefill,
  signedIn,
  opayEnabled,
}: {
  prefill: Prefill;
  signedIn: boolean;
  opayEnabled: boolean;
}) {
  const { lines, ready, subtotal } = useCart();
  const [state, setState] = useState(prefill.state || "Lagos");
  const [result, action, pending] = useActionState(placeOrder, undefined);
  const [payment, setPayment] = useState<"bank_transfer" | "opay">("bank_transfer");

  const delivery = deliveryFee(state, subtotal);

  if (ready && lines.length === 0) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Nothing to check out</h1>
        <Link href="/shop" className="mt-6 inline-block text-accent hover:underline">Browse the shop</Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
      {!signedIn && (
        <p className="mt-2 text-sm text-muted">
          Have an account?{" "}
          <Link href="/signin?next=/checkout" className="text-accent hover:underline">Sign in</Link>{" "}
          to track this order in your dashboard.
        </p>
      )}

      <form action={action} className="mt-8 grid gap-8 lg:grid-cols-[1fr_22rem]">
        <input type="hidden" name="cart" value={JSON.stringify(lines)} />

        <div className="space-y-5">
          <FormMessage error={result?.error} />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" autoComplete="name" defaultValue={prefill.fullName} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" defaultValue={prefill.email} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={prefill.phone} placeholder="+234 800 000 0000" required />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Delivery address</Label>
              <Input id="address" name="address" autoComplete="street-address" defaultValue={prefill.address} required />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" autoComplete="address-level2" defaultValue={prefill.city} required />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="notes">Delivery notes (optional)</Label>
              <Textarea id="notes" name="notes" rows={3} maxLength={500} placeholder="Landmark, best time to call, etc." />
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-medium">Order summary</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-3">
                <span className="min-w-0">
                  {l.name}
                  <span className="text-muted"> × {l.quantity}</span>
                  {l.optionLabel && <span className="block text-xs text-muted">{l.optionLabel}</span>}
                </span>
                <span className="whitespace-nowrap font-mono">{formatNGN(lineTotal(l))}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Subtotal</dt><dd className="font-mono">{formatNGN(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Delivery</dt><dd className="font-mono">{delivery === 0 ? "Free" : formatNGN(delivery)}</dd></div>
            <div className="flex justify-between text-base font-medium"><dt>Total</dt><dd className="font-mono text-accent">{formatNGN(subtotal + delivery)}</dd></div>
          </dl>
          <fieldset className="mt-5 space-y-2 border-t border-line pt-4">
            <legend className="mb-2 text-sm font-medium">Payment</legend>
            {(
              [
                ["bank_transfer", "Bank transfer", `${BANK.bankName}, account ${BANK.accountNumber}. Details shown after you place the order.`],
                ...(opayEnabled ? [["opay", "Pay online with OPay", "Card, bank transfer, USSD or your OPay wallet. Confirmed instantly."]] : []),
              ] as Array<["bank_transfer" | "opay", string, string]>
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-xl border bg-white p-3 text-sm",
                  payment === value ? "border-accent" : "border-line"
                )}
              >
                <input
                  type="radio"
                  name="payment"
                  value={value}
                  checked={payment === value}
                  onChange={() => setPayment(value)}
                  className="mt-0.5 accent-[#0066cc]"
                />
                <span>
                  <span className="block font-medium">{label}</span>
                  <span className="block text-xs text-muted">{hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
          <Button type="submit" disabled={pending || !ready} className="mt-5 w-full py-3.5">
            {pending
              ? "Placing order…"
              : payment === "opay"
                ? "Pay with OPay"
                : "Place order"}
          </Button>
        </aside>
      </form>
    </div>
  );
}
