import { createHash } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { CATALOG_TAG } from "@/lib/catalog";
import { migrateImageBatch } from "@/lib/migrate-images";
import { r2Configured } from "@/lib/r2";
import { createServiceClient } from "@/lib/supabase/server";

// Same job as Admin > Products > "Move photos to R2", callable with the
// CRON_SECRET so it can run without an admin login. Each call moves one batch.
// Temporary one-time token for the initial photo move (removed afterwards).
const ONE_TIME_HASH = "85fbbe27a52df0adac6ef9caa93541b3291ca4f66c23b121b64c5b783516b68b";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  if (createHash("sha256").update(token).digest("hex") !== ONE_TIME_HASH) {
    return new Response("Unauthorized", { status: 401 });
  }
  return run();
}

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  return run();
}

async function run() {
  if (!r2Configured()) return Response.json({ error: "R2 is not configured" }, { status: 503 });

  const result = await migrateImageBatch(createServiceClient());
  if (result.moved) {
    revalidateTag(CATALOG_TAG, { expire: 0 });
    revalidatePath("/", "layout");
  }
  return Response.json(result);
}
