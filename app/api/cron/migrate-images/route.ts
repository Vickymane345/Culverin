import { revalidatePath, revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";
import { migrateImageBatch } from "@/lib/migrate-images";
import { r2Configured } from "@/lib/r2";
import { createServiceClient } from "@/lib/supabase/server";

// Same job as Admin > Products > "Move photos to R2", callable with the
// CRON_SECRET (Bearer header) so it can run without an admin login.
export const maxDuration = 300;

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  return run();
}

async function run() {
  if (!r2Configured()) return Response.json({ error: "R2 is not configured" }, { status: 503 });

  // Keep going batch after batch until everything is moved or time runs short.
  const db = createServiceClient();
  const started = Date.now();
  const result = { moved: 0, remaining: 0 };
  while (Date.now() - started < 240_000) {
    const batch = await migrateImageBatch(db);
    result.moved += batch.moved;
    result.remaining = batch.remaining;
    if (batch.moved === 0 || batch.remaining === 0) break;
  }
  if (result.moved) {
    revalidateTag(CATALOG_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  }
  return Response.json(result);
}
