import "server-only";
import { redirect } from "next/navigation";
import { createClient, getUser } from "@/lib/supabase/server";
import type { ProfileRow } from "@/lib/types";

/** Signed-in user plus profile. Redirects to sign in when there is none. */
export async function requireAccount(next = "/dashboard") {
  const user = await getUser();
  if (!user) redirect(`/signin?next=${encodeURIComponent(next)}`);
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const profile: ProfileRow = data ?? {
    id: user.id,
    full_name: (user.user_metadata?.full_name as string) ?? null,
    email: user.email ?? null,
    phone: null,
    address: null,
    city: null,
    state: null,
    is_admin: false,
    created_at: user.created_at,
  };
  return { user, profile, supabase };
}
