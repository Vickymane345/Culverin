import Link from "next/link";
import { queryStatus, opayConfigured } from "@/lib/opay";
import { markOrderPaid } from "@/lib/orders";
import ClearCart from "./ClearCart";

// OPay sends the customer back here (returnUrl) with ?reference=... after paying.
export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const sp = await searchParams;
  const reference = sp.reference ?? "";

  let paid = false;
  let processing = false;
  if (reference && opayConfigured()) {
    const tx = await queryStatus(reference);
    if (tx?.status === "SUCCESS") {
      const res = await markOrderPaid(tx.reference, tx.amountKobo, tx.currency);
      paid = res.ok;
    } else if (tx?.status === "PENDING") {
      processing = true;
    }
  }

  if (processing) {
    return (
      <div className="py-16 text-center">
        <ClearCart />
        <h1 className="text-3xl font-semibold tracking-tight">Payment processing</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          OPay is still confirming your payment for <span className="font-mono text-foreground">{reference}</span>.
          You will get an email as soon as it clears, usually within a few minutes.
        </p>
        <Link href="/dashboard/orders" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">
          View my orders
        </Link>
      </div>
    );
  }

  if (!paid) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Payment not completed</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          We could not confirm a payment{reference ? ` for ${reference}` : ""}. Nothing has been
          charged, or if it was, we will reconcile it automatically. Your bag is still saved.
        </p>
        <Link href="/checkout" className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">
          Try again
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 text-center">
      <ClearCart />
      <h1 className="text-3xl font-semibold tracking-tight">Thank you, order confirmed</h1>
      <p className="mt-4 text-muted">
        Order reference <span className="font-mono text-foreground">{reference}</span>. A receipt is on
        its way to your email and our team will call you about delivery.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
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
