import { queryStatus, opayConfigured } from "@/lib/opay";
import { markOrderPaid } from "@/lib/orders";

// OPay posts here when a payment changes state (callbackUrl in lib/opay.ts).
// We don't trust the body: we re-check the payment with OPay's status API,
// which is signed with our secret key, and only then mark the order paid.
export async function POST(request: Request) {
  if (!opayConfigured()) return new Response("Not configured", { status: 503 });

  let reference = "";
  try {
    const event = await request.json();
    reference = String(event?.payload?.reference ?? "");
  } catch {}
  if (!reference) return new Response("ok");

  const tx = await queryStatus(reference);
  if (tx?.status === "SUCCESS") await markOrderPaid(tx.reference, tx.amountKobo, tx.currency);

  return new Response("ok");
}
