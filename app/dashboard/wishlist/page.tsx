import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireAccount } from "@/lib/account";
import { getCategory, getProduct } from "@/lib/catalog";
import { formatNGN } from "@/lib/utils";
import RemoveFromWishlist from "./RemoveFromWishlist";

export default async function WishlistPage() {
  const { user, supabase } = await requireAccount("/dashboard/wishlist");
  const { data } = await supabase
    .from("wishlist")
    .select("product_slug, category")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const items = (data ?? [])
    .map((w) => getProduct(w.category, w.product_slug))
    .filter((p) => p !== undefined);

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">Wishlist</h1>
        <p className="mt-1 text-muted">{items.length} saved item{items.length === 1 ? "" : "s"}.</p>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted">
          Tap “Save to wishlist” on any product to keep it here.{" "}
          <Link href="/shop" className="text-accent hover:underline">Browse the shop</Link>
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
        {items.map((p) => (
          <Card key={p.slug} className="group overflow-hidden">
            <Link href={`/shop/${p.category}/${p.slug}`} className="relative block overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="aspect-[4/3] w-full bg-surface object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute left-3 top-3">
                <Badge variant="muted">{getCategory(p.category)?.name}</Badge>
              </div>
            </Link>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium leading-snug">{p.name}</h3>
                <span className="whitespace-nowrap font-mono text-sm text-accent">{formatNGN(p.price)}</span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link href={`/shop/${p.category}/${p.slug}`} className="text-sm text-accent hover:underline">
                  View and buy
                </Link>
                <RemoveFromWishlist category={p.category} slug={p.slug} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
