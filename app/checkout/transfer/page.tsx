import Link from "next/link";
import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { BANK, CONTACT } from "@/lib/site";
import { formatNGN } from "@/lib/utils";
import type { OrderRow } from "@/lib/types";
import ClearCart from "../complete/ClearCart";
import CopyButton from "./CopyButton";

// Shown right after a bank-transfer order is placed. The order reference is
// random and hard to guess, so it doubles as the key to this page.
export default async function TransferPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  if (!reference || !supabaseConfigured) notFound();

  const db = createServiceClient();
  const { data } = await db
    .from("orders")
    .select("*, order_items(*)")
    .eq("reference", reference)
    .eq("payment_method", "bank_transfer")
    .maybeSingle();
  if (!data) notFound();
  const order = data as OrderRow;
  const paid = order.status !== "pending_payment";

  const rows: Array<[string, string, boolean]> = [
    ["Bank", BANK.bankName, false],
    ["Account number", BANK.accountNumber, true],
    ...(BANK.accountName ? ([["Account name", BANK.accountName, false]] as Array<[string, string, boolean]>) : []),
    ["Amount", formatNGN(order.total), false],
    ["Narration / reference", order.reference, true],
  ];

  return (
    <div className="mx-auto max-w-xl py-10">
      <ClearCart />
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Order {order.reference}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">
        {paid ? "Payment received, thank you" : "Order placed. Complete payment by transfer"}
      </h1>

      {!paid && (
        <>
          <p className="mt-4 text-muted">
            Transfer the exact amount below and use your order reference as the narration so we can match it.
            We have also emailed these details to {order.email}.
          </p>

          <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-surface">
            {rows.map(([label, value, copy]) => (
              <div key={label} className="flex items-center justify-between gap-4 px-5 py-4">
                <dt className="text-sm text-muted">{label}</dt>
                <dd className="flex items-center gap-3 text-right font-mono text-base">
                  {value}
                  {copy && <CopyButton value={value} />}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 text-sm text-muted">
            After paying, send your receipt to{" "}
            <a href={`mailto:${CONTACT.email}?subject=Payment for ${order.reference}`} className="text-accent hover:underline">
              {CONTACT.email}
            </a>
            {CONTACT.whatsapp && (
              <>
                {" "}or{" "}
                <a
                  href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Payment for order ${order.reference}`)}`}
                  className="text-accent hover:underline"
                >
                  WhatsApp
                </a>
              </>
            )}
            . We confirm your order as soon as the money arrives.
          </p>
        </>
      )}

      <section className="mt-10">
        <h2 className="font-medium">Your order</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {(order.order_items ?? []).map((i) => (
            <li key={i.id} className="flex justify-between gap-4 py-2.5">
              <span>
                {i.product_name}
                {i.option && <span className="text-muted"> · {i.option}</span>}
                <span className="text-muted"> × {i.quantity}</span>
              </span>
              <span className="whitespace-nowrap font-mono">{formatNGN(i.unit_price * i.quantity)}</span>
            </li>
          ))}
          <li className="flex justify-between py-2.5 text-muted">
            <span>Delivery</span>
            <span className="font-mono">{order.delivery_fee === 0 ? "Free" : formatNGN(order.delivery_fee)}</span>
          </li>
          <li className="flex justify-between py-2.5 font-medium">
            <span>Total</span>
            <span className="font-mono text-accent">{formatNGN(order.total)}</span>
          </li>
        </ul>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/dashboard/orders" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">
          View my orders
        </Link>
        <Link href="/shop" className="rounded-full border border-line px-6 py-3 text-sm font-medium">
          Keep shopping
        </Link>
      </div>
    </div>
  );
}
