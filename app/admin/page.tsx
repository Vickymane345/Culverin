import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { requireAccount } from "@/lib/account";
import { supabaseConfigured } from "@/lib/supabase/config";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  REPAIR_STATUSES,
  type EnquiryRow,
  type OrderRow,
  type RepairRow,
} from "@/lib/types";
import { OrderStatusBadge, RepairStatusBadge } from "@/components/dashboard/StatusBadge";
import { formatNGN, cn } from "@/lib/utils";
import { setOrderStatus, toggleEnquiry, updateRepair } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const tabs = ["orders", "repairs", "enquiries"] as const;
type Tab = (typeof tabs)[number];

const when = (d: string) =>
  new Date(d).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const select =
  "rounded-lg border border-line bg-white px-2 py-1.5 text-sm outline-none focus:border-accent";

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  await connection();
  if (!supabaseConfigured) notFound();
  const { profile, supabase } = await requireAccount("/admin");
  if (!profile.is_admin) notFound();

  const sp = await searchParams;
  const tab: Tab = tabs.includes(sp.tab as Tab) ? (sp.tab as Tab) : "orders";

  return (
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Admin</h1>
          <p className="mt-1 text-sm text-muted">Orders, repairs and enquiries from the website.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-accent hover:underline">Back to dashboard</Link>
      </div>

      <nav className="mt-6 flex gap-2" aria-label="Admin sections">
        {tabs.map((t) => (
          <Link
            key={t}
            href={`/admin?tab=${t}`}
            className={cn(
              "rounded-full px-4 py-2 text-sm capitalize",
              tab === t ? "bg-accent text-white" : "text-muted hover:bg-surface"
            )}
          >
            {t}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "orders" && <Orders supabase={supabase} />}
        {tab === "repairs" && <Repairs supabase={supabase} />}
        {tab === "enquiries" && <Enquiries supabase={supabase} />}
      </div>
    </main>
  );
}

type Db = Awaited<ReturnType<typeof requireAccount>>["supabase"];

async function Orders({ supabase }: { supabase: Db }) {
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    // Unpaid Paystack orders are abandoned checkouts; unpaid transfers are real orders waiting for money.
    .or("status.neq.pending_payment,payment_method.eq.bank_transfer")
    .order("created_at", { ascending: false })
    .limit(200);
  const orders = (data ?? []) as OrderRow[];
  if (orders.length === 0) return <p className="text-muted">No orders yet.</p>;

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <article key={o.id} className="rounded-2xl border border-line p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm">{o.reference}</p>
              <p className="text-xs text-muted">
                {when(o.created_at)} · {o.payment_method === "bank_transfer" ? "Bank transfer" : "Paystack"}
              </p>
            </div>
            <OrderStatusBadge status={o.status} />
          </div>
          <div className="mt-3 grid gap-4 text-sm md:grid-cols-2">
            <div>
              <p className="font-medium">{o.full_name}</p>
              <p className="text-muted">
                <a href={`tel:${o.phone}`} className="hover:text-accent">{o.phone}</a> ·{" "}
                <a href={`mailto:${o.email}`} className="hover:text-accent">{o.email}</a>
              </p>
              <p className="text-muted">{o.address}, {o.city}, {o.state}</p>
              {o.notes && <p className="mt-1 text-muted">Note: {o.notes}</p>}
            </div>
            <ul className="space-y-1">
              {(o.order_items ?? []).map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span>
                    {i.product_name}
                    {i.option && <span className="text-muted"> · {i.option}</span>}
                    {i.colour && <span className="text-muted"> · {i.colour}</span>} × {i.quantity}
                  </span>
                  <span className="font-mono">{formatNGN(i.unit_price * i.quantity)}</span>
                </li>
              ))}
              <li className="flex justify-between border-t border-line pt-1 font-medium">
                <span>Total (incl. {formatNGN(o.delivery_fee)} delivery)</span>
                <span className="font-mono">{formatNGN(o.total)}</span>
              </li>
            </ul>
          </div>
          <form action={setOrderStatus} className="mt-4 flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={o.id} />
            <select name="status" defaultValue={o.status} className={select} aria-label="Order status">
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
              ))}
            </select>
            <button type="submit" className="rounded-full bg-accent px-4 py-1.5 text-sm text-white">Update</button>
            {o.status === "pending_payment" && o.payment_method === "bank_transfer" && (
              <span className="text-xs text-muted">
                Check UBA for {formatNGN(o.total)} with reference {o.reference}, then set Paid.
              </span>
            )}
          </form>
        </article>
      ))}
    </div>
  );
}

async function Repairs({ supabase }: { supabase: Db }) {
  const { data } = await supabase
    .from("repair_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const repairs = (data ?? []) as RepairRow[];
  if (repairs.length === 0) return <p className="text-muted">No repair bookings yet.</p>;

  return (
    <div className="space-y-4">
      {repairs.map((r) => (
        <article key={r.id} className="rounded-2xl border border-line p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{r.device}</p>
              <p className="font-mono text-xs text-muted">
                {r.reference}{r.serial ? ` · SN ${r.serial}` : ""} · {when(r.created_at)}
              </p>
            </div>
            <RepairStatusBadge status={r.status} />
          </div>
          <p className="mt-2 text-sm">{r.issue}</p>
          <p className="mt-2 text-sm text-muted">
            {r.name} · <a href={`tel:${r.phone}`} className="hover:text-accent">{r.phone}</a> ·{" "}
            <a href={`mailto:${r.email}`} className="hover:text-accent">{r.email}</a>
          </p>
          <form action={updateRepair} className="mt-4 flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={r.id} />
            <select name="status" defaultValue={r.status} className={select} aria-label="Repair status">
              {REPAIR_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <label className="text-sm text-muted">
              ETA{" "}
              <input type="date" name="eta" defaultValue={r.eta ?? ""} className={select} />
            </label>
            <button type="submit" className="rounded-full bg-accent px-4 py-1.5 text-sm text-white">Update</button>
          </form>
        </article>
      ))}
    </div>
  );
}

async function Enquiries({ supabase }: { supabase: Db }) {
  const { data } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const items = (data ?? []) as EnquiryRow[];
  if (items.length === 0) return <p className="text-muted">No enquiries yet.</p>;

  return (
    <div className="space-y-4">
      {items.map((e) => (
        <article key={e.id} className={cn("rounded-2xl border border-line p-4 sm:p-5", e.handled && "opacity-60")}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium">{e.name} <span className="text-sm font-normal text-muted">· {e.topic}</span></p>
              <p className="text-xs text-muted">
                <a href={`mailto:${e.email}`} className="hover:text-accent">{e.email}</a>
                {e.phone ? ` · ${e.phone}` : ""} · {when(e.created_at)}
              </p>
            </div>
            <form action={toggleEnquiry}>
              <input type="hidden" name="id" value={e.id} />
              <input type="hidden" name="handled" value={String(!e.handled)} />
              <button type="submit" className="rounded-full border border-line px-3 py-1 text-xs hover:border-accent">
                {e.handled ? "Mark as open" : "Mark handled"}
              </button>
            </form>
          </div>
          <p className="mt-3 whitespace-pre-line text-sm">{e.message}</p>
        </article>
      ))}
    </div>
  );
}
