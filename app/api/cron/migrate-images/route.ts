import { revalidatePath, revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";
import { migrateImageBatch } from "@/lib/migrate-images";
import { r2Configured } from "@/lib/r2";
import { createServiceClient } from "@/lib/supabase/server";

// Same job as Admin > Products > "Move photos to R2", callable with the
// CRON_SECRET so it can run without an admin login. Each call moves one batch.
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  if (!r2Configured()) return Response.json({ error: "R2 is not configured" }, { status: 503 });

  const result = await migrateImageBatch(createServiceClient());
  if (result.moved) {
    revalidateTag(CATALOG_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  }
  return Response.json(result);
}
