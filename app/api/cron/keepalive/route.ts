import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL, supabaseConfigured } from "@/lib/supabase/config";

// Called once a day by Vercel Cron (see vercel.json). Free Supabase projects
// pause after a week without activity; one small query a day prevents that.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!supabaseConfigured) return Response.json({ ok: false, reason: "supabase not configured" });

  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false } });
  const { error, count } = await db.from("categories").select("id", { count: "exact", head: true });

  return Response.json({ ok: !error, categories: count ?? null, at: new Date().toISOString() });
}
