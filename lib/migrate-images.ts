import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { uploadToR2 } from "@/lib/r2";
import { SITE_URL } from "@/lib/site";

/**
 * Copies product photos still served from the site's own /images folder into
 * R2 and points product_images at the R2 URL. Works in small batches so each
 * call finishes well inside the function time limit.
 */
export async function migrateImageBatch(db: SupabaseClient, size = 12) {
  const { data: batch } = await db
    .from("product_images")
    .select("id, image_url")
    .like("image_url", "/%")
    .limit(size);

  let moved = 0;
  for (const img of batch ?? []) {
    try {
      const res = await fetch(`${SITE_URL}${img.image_url}`, { cache: "no-store" });
      if (!res.ok) continue;
      const type = res.headers.get("content-type")?.split(";")[0] || "image/jpeg";
      const name = img.image_url.split("/").pop() || `${img.id}.jpg`;
      const key = `products/${name}`;
      const url = await uploadToR2(key, new Uint8Array(await res.arrayBuffer()), type);
      await db.from("product_images").update({ image_url: url, storage_key: key }).eq("id", img.id);
      moved++;
    } catch (e) {
      console.error("migrate image failed", img.image_url, e);
    }
  }

  const { count } = await db
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .like("image_url", "/%");
  return { moved, remaining: count ?? 0 };
}
