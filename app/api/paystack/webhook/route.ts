import { createHmac, timingSafeEqual } from "node:crypto";
import { markOrderPaid } from "@/lib/orders";

// Paystack calls this after every charge. Set the URL in your Paystack
// dashboard: Settings > API Keys & Webhooks > Webhook URL.
export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return new Response("Not configured", { status: 503 });

  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(raw).digest("hex");

  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return new Response("Bad signature", { status: 401 });
  }

  const event = JSON.parse(raw);
  if (event.event === "charge.success") {
    const { reference, amount, currency } = event.data ?? {};
    if (typeof reference === "string") await markOrderPaid(reference, Number(amount), String(currency));
  }

  return new Response("ok");
}
