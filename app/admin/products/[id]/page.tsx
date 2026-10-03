import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { requireAccount } from "@/lib/account";
import { supabaseConfigured } from "@/lib/supabase/config";
import { PRODUCT_SELECT, rowToProduct } from "@/lib/catalog";
import type { Category } from "@/lib/catalog-types";
import { r2Configured } from "@/lib/r2";
import ProductForm from "./ProductForm";
import ImageManager from "./ImageManager";
import { deleteProduct } from "../../catalog-actions";

export const metadata: Metadata = { title: "Edit product", robots: { index: false, follow: false } };

export default async function AdminProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  await connection();
  if (!supabaseConfigured) notFound();
  const { profile, supabase } = await requireAccount("/admin");
  if (!profile.is_admin) notFound();

  const { id } = await params;
  const { created } = await searchParams;
  const isNew = id === "new";

  const { data: cats } = await supabase.from("categories").select("id, name, blurb, image, position").order("position");
  const categories = (cats ?? []) as Category[];

  let product;
  let images: { id: string; image_url: string }[] = [];
  if (!isNew) {
    const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
    if (!data) notFound();
    product = rowToProduct(data as never);
    const { data: imgs } = await supabase
      .from("product_images")
      .select("id, image_url")
      .eq("product_id", id)
      .order("position");
    images = imgs ?? [];
  }

  return (
    <main className="mx-auto max-w-4xl space-y-10 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin?tab=products" className="text-sm text-accent hover:underline">← All products</Link>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {isNew ? "New product" : product!.name}
          </h1>
        </div>
        {product && (
          <Link
            href={`/shop/${product.category}/${product.slug}`}
            target="_blank"
            className="rounded-full border border-line px-4 py-2 text-sm hover:border-accent"
          >
            View in shop
          </Link>
        )}
      </div>

      {categories.length === 0 && (
        <p className="rounded-xl bg-surface px-4 py-3 text-sm">
          Add a category first under <Link href="/admin?tab=categories" className="text-accent">Categories</Link>.
        </p>
      )}

      <ProductForm
        product={product}
        categories={categories}
        notice={created ? "Product created. Now add its photos below." : undefined}
      />

      {product ? (
        <ImageManager productId={product.id} images={images} r2Ready={r2Configured()} />
      ) : (
        <p className="text-sm text-muted">Save the product first, then you can add photos.</p>
      )}

      {product && (
        <form action={deleteProduct} className="border-t border-line pt-6">
          <input type="hidden" name="id" value={product.id} />
          <p className="text-sm text-muted">
            To hide a product temporarily, untick &ldquo;Show this product in the shop&rdquo; instead.
          </p>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" required className="size-4" /> Yes, delete it and its photos
          </label>
          <button type="submit" className="mt-3 rounded-full border border-danger/40 px-4 py-2 text-sm text-danger hover:bg-danger/5">
            Delete product permanently
          </button>
        </form>
      )}
    </main>
  );
}
