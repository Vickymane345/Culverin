import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { escapeHtml, sendEmail, staffInbox } from "@/lib/email";
import { formatNGN } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

/**
 * Marks an order paid once Paystack confirms the charge. Safe to call twice
 * (callback page and webhook both do): only the first call changes anything.
 */
export async function markOrderPaid(reference: string, amountKobo: number, currency: string) {
  const db = createServiceClient();
  const { data: order } = await db
    .from("orders")
    .select("id, reference, total, status, email, full_name")
    .eq("reference", reference)
    .maybeSingle();

  if (!order) return { ok: false as const, reason: "not_found" };
  if (order.status !== "pending_payment") return { ok: true as const, order, alreadyPaid: true };
  if (currency !== "NGN" || amountKobo !== order.total * 100) {
    console.error("Amount mismatch on", reference, amountKobo, order.total);
    return { ok: false as const, reason: "amount_mismatch" };
  }

  const { data: updated } = await db
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", order.id)
    .eq("status", "pending_payment")
    .select("id")
    .maybeSingle();

  if (updated) await sendOrderEmails(order.id);
  return { ok: true as const, order, alreadyPaid: !updated };
}

async function sendOrderEmails(orderId: string) {
  const db = createServiceClient();
  const { data: order } = await db
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const rows = (order.order_items as Array<{ product_name: string; option: string | null; quantity: number; unit_price: number }>)
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.product_name)}${i.option ? ` (${escapeHtml(i.option)})` : ""} × ${i.quantity}</td><td align="right">${formatNGN(i.unit_price * i.quantity)}</td></tr>`
    )
    .join("");

  const body = `
    <p>Hi ${escapeHtml(order.full_name)},</p>
    <p>Thanks for your order. We have received your payment and will be in touch about delivery.</p>
    <p><strong>Order ${order.reference}</strong></p>
    <table cellpadding="6" style="border-collapse:collapse">${rows}
      <tr><td>Delivery</td><td align="right">${formatNGN(order.delivery_fee)}</td></tr>
      <tr><td><strong>Total</strong></td><td align="right"><strong>${formatNGN(order.total)}</strong></td></tr>
    </table>
    <p>Delivering to: ${escapeHtml(order.address)}, ${escapeHtml(order.city)}, ${escapeHtml(order.state)}</p>
    <p>Culverin Quantum Systems Limited</p>`;

  await sendEmail({ to: order.email, subject: `Order ${order.reference} confirmed`, html: body });

  const staff = staffInbox();
  if (staff) {
    await sendEmail({
      to: staff,
      subject: `New paid order ${order.reference}: ${formatNGN(order.total)}`,
      html: `${body}<p>Phone: ${escapeHtml(order.phone)}<br/>Email: ${escapeHtml(order.email)}</p><p><a href="${SITE_URL}/admin">Open admin</a></p>`,
      replyTo: order.email,
    });
  }
}
