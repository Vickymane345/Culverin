import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusBadge } from "@/components/dashboard/StatusBadge";
import { requireAccount } from "@/lib/account";
import type { OrderRow } from "@/lib/types";
import { formatNGN } from "@/lib/utils";

export default async function OrdersPage() {
  const { user, supabase } = await requireAccount("/dashboard/orders");
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const orders = (data ?? []) as OrderRow[];

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">Order history</h1>
        <p className="mt-1 text-muted">Every order placed while signed in.</p>
      </div>

      {orders.length === 0 && (
        <Card>
          <CardContent className="p-6 text-sm text-muted">
            No orders yet. <Link href="/shop" className="text-accent hover:underline">Start shopping</Link>.
          </CardContent>
        </Card>
      )}

      {orders.map((o) => (
        <Card key={o.id}>
          <CardHeader className="flex-row flex-wrap items-start justify-between gap-3">
            <div>
              <CardTitle className="font-mono text-base">{o.reference}</CardTitle>
              <CardDescription>
                {new Date(o.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                {" · "}
                {o.city}, {o.state}
              </CardDescription>
            </div>
            <OrderStatusBadge status={o.status} />
          </CardHeader>
          <CardContent>
            {o.status === "pending_payment" && o.payment_method === "bank_transfer" && (
              <p className="mb-3 rounded-xl bg-surface px-4 py-3 text-sm">
                Waiting for your transfer.{" "}
                <Link href={`/checkout/transfer?reference=${o.reference}`} className="text-accent hover:underline">
                  See payment details
                </Link>
              </p>
            )}
            <ul className="divide-y divide-line text-sm">
              {(o.order_items ?? []).map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-2.5">
                  <span>
                    {i.product_name}
                    {i.option && <span className="text-muted"> · {i.option}</span>}
                    {i.colour && <span className="text-muted"> · {i.colour}</span>}
                    <span className="text-muted"> × {i.quantity}</span>
                  </span>
                  <span className="whitespace-nowrap font-mono">{formatNGN(i.unit_price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm">
              <span className="text-muted">Delivery {formatNGN(o.delivery_fee)}</span>
              <span className="font-medium">Total {formatNGN(o.total)}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
