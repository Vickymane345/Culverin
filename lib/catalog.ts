import "server-only";
import { unstable_cache } from "next/cache";
import { createClient as createSupabase } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/config";
import { seedCategories, seedProducts } from "@/lib/catalog-seed";

// The catalog lives in Supabase (categories, products, product_images).
// Images are hosted on Cloudflare R2; the database only stores their URLs.
// Reads are cached for a few minutes and refreshed immediately when an admin
// saves a change. If the database is unreachable, the built-in catalog in
// catalog-seed.ts is used so the shop never shows an empty page.

export type { CategoryId, Category, ProductOption, Product } from "@/lib/catalog-types";
import type { Category, Product, ProductOption } from "@/lib/catalog-types";

export const CATALOG_TAG = "catalog";

/** Same tier uplift the shop used before prices moved into the database. */
export function seedOptionPrices(base: number, labels: string[]): ProductOption[] {
  return labels.map((label, i) => ({ label, price: base + i * Math.round(base * 0.12) }));
}

function fallbackCatalog(): { categories: Category[]; products: Product[] } {
  return {
    categories: seedCategories.map((c, i) => ({ ...c, position: i })),
    products: seedProducts.map((p, i) => ({
      id: p.slug,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      tagline: p.tagline,
      image: p.image,
      images: [p.image],
      rating: p.rating,
      badge: p.badge,
      options: seedOptionPrices(p.price, p.options),
      colours: p.colours,
      specs: p.specs,
      position: i,
      active: true,
    })),
  };
}

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category_id: string;
  price: number;
  tagline: string;
  rating: number | string;
  badge: string | null;
  options: ProductOption[] | null;
  colours: string[] | null;
  specs: Record<string, string> | null;
  position: number;
  is_active: boolean;
  product_images: { image_url: string; position: number }[] | null;
};

export function rowToProduct(r: ProductRow): Product {
  const images = (r.product_images ?? [])
    .slice()
    .sort((a, b) => a.position - b.position)
    .map((i) => i.image_url);
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    brand: r.brand,
    category: r.category_id,
    price: r.price,
    tagline: r.tagline,
    image: images[0] ?? "/images/products/category-phones.jpg",
    images,
    rating: Number(r.rating),
    badge: r.badge ?? undefined,
    options: Array.isArray(r.options) ? r.options : [],
    colours: r.colours ?? [],
    specs: r.specs ?? {},
    position: r.position,
    active: r.is_active,
  };
}

export const PRODUCT_SELECT =
  "id, slug, name, brand, category_id, price, tagline, rating, badge, options, colours, specs, position, is_active, product_images(image_url, position)";

/** Public, cookie-free client so results can be cached and shared. */
function publicClient() {
  return createSupabase(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const loadCatalog = unstable_cache(
  async (): Promise<{ categories: Category[]; products: Product[] }> => {
    if (!supabaseConfigured) return fallbackCatalog();
    try {
      const db = publicClient();
      const [cats, prods] = await Promise.all([
        db.from("categories").select("id, name, blurb, image, position").order("position"),
        db.from("products").select(PRODUCT_SELECT).eq("is_active", true).order("position"),
      ]);
      if (cats.error || prods.error || !cats.data?.length) return fallbackCatalog();
      return {
        categories: cats.data as Category[],
        products: (prods.data as unknown as ProductRow[]).map(rowToProduct),
      };
    } catch {
      return fallbackCatalog();
    }
  },
  ["catalog-v1"],
  { tags: [CATALOG_TAG], revalidate: 300 }
);

export async function getCategories() {
  return (await loadCatalog()).categories;
}

export async function getProducts() {
  return (await loadCatalog()).products;
}

export async function getCategory(id: string) {
  return (await getCategories()).find((c) => c.id === id);
}

export async function getProductsByCategory(id: string) {
  return (await getProducts()).filter((p) => p.category === id);
}

export async function getProduct(category: string, slug: string) {
  return (await getProducts()).find((p) => p.category === category && p.slug === slug);
}

export function brandsIn(list: Product[]): string[] {
  return Array.from(new Set(list.map((p) => p.brand).filter(Boolean))).sort();
}

export function related(all: Product[], product: Product, limit = 4): Product[] {
  const sameBrand = all.filter(
    (p) => p.category === product.category && p.brand === product.brand && p.slug !== product.slug
  );
  const sameCat = all.filter((p) => p.category === product.category && p.brand !== product.brand);
  return [...sameBrand, ...sameCat].slice(0, limit);
}
