"use server";

import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";
import { getProduct } from "@/lib/catalog";

export type WishlistResult = { saved: boolean } | { error: "signin" | "failed" };

export async function toggleWishlist(category: string, slug: string): Promise<WishlistResult> {
  const user = await getUser();
  if (!user) return { error: "signin" };
  if (!(await getProduct(category, slug))) return { error: "failed" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("wishlist")
    .select("product_slug")
    .eq("user_id", user.id)
    .eq("product_slug", slug)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("wishlist").delete().eq("user_id", user.id).eq("product_slug", slug);
    if (error) return { error: "failed" };
    revalidatePath("/dashboard/wishlist");
    return { saved: false };
  }

  const { error } = await supabase
    .from("wishlist")
    .insert({ user_id: user.id, product_slug: slug, category });
  if (error) return { error: "failed" };
  revalidatePath("/dashboard/wishlist");
  return { saved: true };
}

export async function isInWishlist(slug: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("wishlist")
    .select("product_slug")
    .eq("user_id", user.id)
    .eq("product_slug", slug)
    .maybeSingle();
  return Boolean(data);
}
