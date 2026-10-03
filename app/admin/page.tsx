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
import { deleteCategory } from "./catalog-actions";
import { PRODUCT_SELECT, rowToProduct } from "@/lib/catalog";
import type { Category } from "@/lib/catalog-types";
import CategoryForm from "./CategoryForm";
import MigrateImagesButton from "./MigrateImagesButton";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const tabs = ["orders", "products", "categories", "repairs", "enquiries"] as const;
type Tab = (typeof tabs)[number];

const when = (d: string) =>
  new Date(d).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const select =
  "rounded-lg border border-line bg-white px-2 py-1.5 text-sm outline-none focus:border-accent";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; cat?: string; sort?: string }>;
}) {
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
          <p className="mt-1 text-sm text-muted">Orders, products, repairs and enquiries.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-accent hover:underline">Back to dashboard</Link>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto" aria-label="Admin sections">
        {tabs.map((t) => (
          <Link
            key={t}
            href={`/admin?tab=${t}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm capitalize",
              tab === t ? "bg-accent text-white" : "text-muted hover:bg-surface"
            )}
          >
            {t}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "orders" && <Orders supabase={supabase} />}
        {tab === "products" && <Products supabase={supabase} q={sp.q} cat={sp.cat} sort={sp.sort} />}
        {tab === "categories" && <Categories supabase={supabase} />}
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

async function Products({ supabase, q, cat, sort }: { supabase: Db; q?: string; cat?: string; sort?: string }) {
  const { data: cats } = await supabase.from("categories").select("id, name").order("position");
  let query = supabase.from("products").select(PRODUCT_SELECT);
  if (cat) query = query.eq("category_id", cat);
  if (q) query = query.ilike("name", `%${q}%`);
  const order =
    sort === "price-asc" ? { col: "price", asc: true }
    : sort === "price-desc" ? { col: "price", asc: false }
    : sort === "name" ? { col: "name", asc: true }
    : { col: "position", asc: true };
  const { data } = await query.order(order.col, { ascending: order.asc }).limit(500);
  const products = (data ?? []).map((r) => rowToProduct(r as never));
  const { count: localImages } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .like("image_url", "/%");

  return (
    <div className="space-y-5">
      <MigrateImagesButton remaining={localImages ?? 0} />

      <div className="flex flex-wrap items-end gap-3">
        <form className="flex flex-1 flex-wrap gap-2" action="/admin">
          <input type="hidden" name="tab" value="products" />
          <input name="q" defaultValue={q} placeholder="Search products" className={`${select} min-w-0 flex-1`} />
          <select name="cat" defaultValue={cat ?? ""} className={select} aria-label="Category">
            <option value="">All categories</option>
            {(cats ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select name="sort" defaultValue={sort ?? ""} className={select} aria-label="Sort">
            <option value="">Shop order</option>
            <option value="name">Name</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <button type="submit" className="rounded-full border border-line px-4 py-1.5 text-sm">Apply</button>
        </form>
        <Link href="/admin/products/new" className="rounded-full bg-accent px-4 py-2 text-sm text-white">+ New product</Link>
      </div>

      <p className="text-sm text-muted">{products.length} products</p>
      <ul className="divide-y divide-line rounded-2xl border border-line">
        {products.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/products/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-surface">
              <img src={p.image} alt="" className="size-12 shrink-0 rounded-lg bg-surface object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {p.name}
                  {!p.active && <span className="ml-2 rounded-full bg-surface px-2 py-0.5 text-xs text-muted">Hidden</span>}
                </p>
                <p className="truncate text-xs text-muted">
                  {(cats ?? []).find((c) => c.id === p.category)?.name ?? p.category}
                  {p.options.length > 1 ? ` · ${p.options.length} options` : ""}
                  {` · ${p.images.length} photo${p.images.length === 1 ? "" : "s"}`}
                </p>
              </div>
              <span className="whitespace-nowrap font-mono text-sm">{formatNGN(p.price)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Categories({ supabase }: { supabase: Db }) {
  const { data } = await supabase.from("categories").select("id, name, blurb, image, position").order("position");
  const categories = (data ?? []) as Category[];
  const { data: counts } = await supabase.from("products").select("category_id");
  const countFor = (id: string) => (counts ?? []).filter((r) => r.category_id === id).length;

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-line p-4 sm:p-5">
        <h2 className="mb-3 font-medium">Add a category</h2>
        <CategoryForm />
      </section>
      {categories.map((c) => (
        <section key={c.id} className="rounded-2xl border border-line p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-medium">
              {c.name} <span className="font-mono text-xs text-muted">/shop/{c.id} · {countFor(c.id)} products</span>
            </h2>
            {countFor(c.id) === 0 && (
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={c.id} />
                <button type="submit" className="text-sm text-danger hover:underline">Delete</button>
              </form>
            )}
          </div>
          <CategoryForm category={c} />
        </section>
      ))}
    </div>
  );
}
