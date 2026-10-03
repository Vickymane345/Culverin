"use server";

import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { requireAccount } from "@/lib/account";
import { CATALOG_TAG } from "@/lib/catalog";
import { deleteFromR2, r2Configured, uploadToR2 } from "@/lib/r2";
import { SITE_URL } from "@/lib/site";

async function requireAdmin() {
  const ctx = await requireAccount("/admin");
  if (!ctx.profile.is_admin) throw new Error("Not allowed");
  return ctx;
}

/** Refresh the shop straight away after any catalog change. */
function refreshShop() {
  updateTag(CATALOG_TAG);
  revalidatePath("/", "layout");
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export type FormState = { error?: string; message?: string } | undefined;

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

function parseOptions(text: string) {
  const out: { label: string; price: number }[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const [label, price] = line.split("|").map((x) => x.trim());
    const n = Number(String(price ?? "").replace(/[₦,\s]/g, ""));
    if (!label || !Number.isFinite(n) || n <= 0) {
      throw new Error(`Option line "${line}" needs a label and a price, like: 256GB | 1650000`);
    }
    out.push({ label, price: Math.round(n) });
  }
  return out;
}

function parseSpecs(text: string) {
  const out: Record<string, string> = {};
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const i = line.indexOf(":");
    if (i < 1) throw new Error(`Spec line "${line}" needs a colon, like: Chip: A18 Pro`);
    out[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return out;
}

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const get = (k: string) => String(formData.get(k) ?? "").trim();

  const id = get("id");
  const name = get("name");
  const category = get("category");
  if (!name) return { error: "Give the product a name." };
  if (!category) return { error: "Choose a category." };

  let options, specs;
  try {
    options = parseOptions(get("options"));
    specs = parseSpecs(get("specs"));
  } catch (e) {
    return { error: (e as Error).message };
  }

  const basePrice = Number(get("price").replace(/[₦,\s]/g, ""));
  const price = options.length ? Math.min(...options.map((o) => o.price)) : Math.round(basePrice);
  if (!Number.isFinite(price) || price <= 0) return { error: "Enter a price, or add options with prices." };

  const rating = Math.max(0, Math.min(5, Number(get("rating") || 4.5)));
  const row = {
    name,
    slug: slugify(get("slug") || name),
    brand: get("brand"),
    category_id: category,
    price,
    tagline: get("tagline"),
    rating,
    badge: get("badge") || null,
    options,
    colours: get("colours").split(",").map((c) => c.trim()).filter(Boolean),
    specs,
    position: Math.round(Number(get("position") || 0)),
    is_active: formData.get("is_active") === "on",
  };
  if (!row.slug) return { error: "The web address (slug) can't be empty." };

  let savedId = id;
  if (id) {
    const { error } = await supabase.from("products").update(row).eq("id", id);
    if (error) return { error: error.code === "23505" ? "Another product already uses that web address." : error.message };
  } else {
    const { data, error } = await supabase.from("products").insert(row).select("id").single();
    if (error) return { error: error.code === "23505" ? "Another product already uses that web address." : error.message };
    savedId = data.id;
  }

  refreshShop();
  if (!id) redirect(`/admin/products/${savedId}?created=1`);
  return { message: "Saved. The shop is updated." };
}

export async function deleteProduct(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { data: images } = await supabase.from("product_images").select("storage_key").eq("product_id", id);
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (!error) {
    await Promise.all((images ?? []).filter((i) => i.storage_key).map((i) => deleteFromR2(i.storage_key!)));
  }
  refreshShop();
  redirect("/admin?tab=products");
}

// ---------------------------------------------------------------------------
// Product images (stored in R2, URL saved in Supabase)
// ---------------------------------------------------------------------------

const EXT: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/avif": "avif" };

export async function uploadProductImage(formData: FormData): Promise<{ error?: string }> {
  const { supabase } = await requireAdmin();
  if (!r2Configured()) return { error: "Image storage (Cloudflare R2) isn't set up yet. Add the R2 keys in Vercel." };

  const productId = String(formData.get("productId") ?? "");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "No file received." };
  if (!EXT[file.type]) return { error: "Use a JPG, PNG, WebP or AVIF image." };
  if (file.size > 5 * 1024 * 1024) return { error: "That image is over 5 MB." };

  const { data: product } = await supabase.from("products").select("slug").eq("id", productId).maybeSingle();
  if (!product) return { error: "Product not found." };

  const key = `products/${product.slug}-${randomBytes(4).toString("hex")}.${EXT[file.type]}`;
  let url: string;
  try {
    url = await uploadToR2(key, new Uint8Array(await file.arrayBuffer()), file.type);
  } catch (e) {
    console.error(e);
    return { error: "Upload to R2 failed. Check the R2 keys and bucket name." };
  }

  const { data: last } = await supabase
    .from("product_images")
    .select("position")
    .eq("product_id", productId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("product_images").insert({
    product_id: productId,
    image_url: url,
    storage_key: key,
    position: (last?.position ?? -1) + 1,
  });
  if (error) {
    await deleteFromR2(key);
    return { error: error.message };
  }
  refreshShop();
  return {};
}

export async function deleteProductImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("imageId"));
  const { data: img } = await supabase.from("product_images").select("storage_key").eq("id", id).maybeSingle();
  await supabase.from("product_images").delete().eq("id", id);
  if (img?.storage_key) await deleteFromR2(img.storage_key);
  refreshShop();
}

export async function moveProductImage(formData: FormData) {
  const { supabase } = await requireAdmin();
  const productId = String(formData.get("productId"));
  const id = String(formData.get("imageId"));
  const dir = formData.get("dir") === "up" ? -1 : 1;

  const { data: imgs } = await supabase
    .from("product_images")
    .select("id, position")
    .eq("product_id", productId)
    .order("position");
  if (!imgs) return;
  const i = imgs.findIndex((x) => x.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= imgs.length) return;
  [imgs[i], imgs[j]] = [imgs[j], imgs[i]];
  await Promise.all(imgs.map((x, n) => supabase.from("product_images").update({ position: n }).eq("id", x.id)));
  refreshShop();
}

/**
 * Copies photos still served from the website's own /images folder into R2,
 * a batch at a time so each run finishes well inside the time limit.
 */
export async function migrateLocalImages(): Promise<{ moved: number; remaining: number; error?: string }> {
  const { supabase } = await requireAdmin();
  if (!r2Configured()) return { moved: 0, remaining: 0, error: "Set up Cloudflare R2 first." };

  const { data: batch } = await supabase
    .from("product_images")
    .select("id, image_url")
    .like("image_url", "/%")
    .limit(12);

  let moved = 0;
  for (const img of batch ?? []) {
    try {
      const res = await fetch(`${SITE_URL}${img.image_url}`, { cache: "no-store" });
      if (!res.ok) continue;
      const type = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
      const name = img.image_url.split("/").pop() || `${img.id}.jpg`;
      const key = `products/${name}`;
      const url = await uploadToR2(key, new Uint8Array(await res.arrayBuffer()), type);
      await supabase.from("product_images").update({ image_url: url, storage_key: key }).eq("id", img.id);
      moved++;
    } catch (e) {
      console.error("migrate image failed", img.image_url, e);
    }
  }

  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .like("image_url", "/%");
  if (moved) refreshShop();
  return { moved, remaining: count ?? 0 };
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function saveCategory(_: FormState, formData: FormData): Promise<FormState> {
  const { supabase } = await requireAdmin();
  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const existingId = get("existingId");
  const name = get("name");
  if (!name) return { error: "Give the category a name." };

  const row = {
    name,
    blurb: get("blurb"),
    image: get("image"),
    position: Math.round(Number(get("position") || 0)),
  };

  if (existingId) {
    const { error } = await supabase.from("categories").update(row).eq("id", existingId);
    if (error) return { error: error.message };
  } else {
    const id = slugify(get("id") || name);
    if (!id) return { error: "The category needs a web address." };
    const { error } = await supabase.from("categories").insert({ id, ...row });
    if (error) return { error: error.code === "23505" ? "That category already exists." : error.message };
  }
  refreshShop();
  return { message: "Category saved." };
}

export async function deleteCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const { count } = await supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", id);
  if ((count ?? 0) > 0) return;
  await supabase.from("categories").delete().eq("id", id);
  refreshShop();
}
