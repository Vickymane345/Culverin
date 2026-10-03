import "server-only";
import { createServiceClient } from "@/lib/supabase/server";
import { escapeHtml, sendEmail, staffInbox } from "@/lib/email";
import { formatNGN } from "@/lib/utils";
import { BANK, SITE_URL } from "@/lib/site";

/**
 * Marks an order paid once OPay confirms the charge. Safe to call twice
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

  if (updated) await notifyOrder(order.id, "paid");
  return { ok: true as const, order, alreadyPaid: !updated };
}

/**
 * Emails the customer and the shop about an order.
 * "transfer": order placed, waiting for a bank transfer (includes bank details).
 * "paid": payment confirmed by OPay.
 */
export async function notifyOrder(orderId: string, mode: "paid" | "transfer") {
  const db = createServiceClient();
  const { data: order } = await db
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const rows = (order.order_items as Array<{ product_name: string; option: string | null; colour: string | null; quantity: number; unit_price: number }>)
    .map(
      (i) =>
        `<tr><td>${escapeHtml(i.product_name)}${i.option ? ` (${escapeHtml(i.option)})` : ""}${i.colour ? `, ${escapeHtml(i.colour)}` : ""} × ${i.quantity}</td><td align="right">${formatNGN(i.unit_price * i.quantity)}</td></tr>`
    )
    .join("");

  const table = `
    <table cellpadding="6" style="border-collapse:collapse">${rows}
      <tr><td>Delivery</td><td align="right">${formatNGN(order.delivery_fee)}</td></tr>
      <tr><td><strong>Total</strong></td><td align="right"><strong>${formatNGN(order.total)}</strong></td></tr>
    </table>
    <p>Delivering to: ${escapeHtml(order.address)}, ${escapeHtml(order.city)}, ${escapeHtml(order.state)}</p>`;

  const bankBlock = `
    <p><strong>Pay by bank transfer</strong><br/>
      Bank: ${BANK.bankName}<br/>
      Account number: ${BANK.accountNumber}<br/>
      ${BANK.accountName ? `Account name: ${escapeHtml(BANK.accountName)}<br/>` : ""}
      Amount: <strong>${formatNGN(order.total)}</strong><br/>
      Narration / reference: <strong>${order.reference}</strong></p>
    <p>Once you have paid, reply to this email with your transfer receipt and we will confirm your order.</p>`;

  const customerHtml =
    mode === "paid"
      ? `<p>Hi ${escapeHtml(order.full_name)},</p>
         <p>Thanks for your order. We have received your payment and will be in touch about delivery.</p>
         <p><strong>Order ${order.reference}</strong></p>${table}<p>Culverin Quantum Systems Limited</p>`
      : `<p>Hi ${escapeHtml(order.full_name)},</p>
         <p>Thanks for your order. We are holding it for you while you complete payment.</p>
         <p><strong>Order ${order.reference}</strong></p>${table}${bankBlock}<p>Culverin Quantum Systems Limited</p>`;

  await sendEmail({
    to: order.email,
    subject: mode === "paid" ? `Order ${order.reference} confirmed` : `Order ${order.reference}: payment details`,
    html: customerHtml,
    replyTo: staffInbox() || undefined,
  });

  const staff = staffInbox();
  if (staff) {
    const headline =
      mode === "paid"
        ? `New PAID order ${order.reference}: ${formatNGN(order.total)}`
        : `New order ${order.reference}: ${formatNGN(order.total)} (awaiting bank transfer)`;
    await sendEmail({
      to: staff,
      subject: headline,
      replyTo: order.email,
      html: `<p><strong>${headline}</strong></p>
        <p>${escapeHtml(order.full_name)}<br/>
          Phone: ${escapeHtml(order.phone)}<br/>
          Email: ${escapeHtml(order.email)}</p>
        ${table}
        ${order.notes ? `<p>Customer note: ${escapeHtml(order.notes)}</p>` : ""}
        ${mode === "transfer" ? `<p>Check your UBA account for a transfer of ${formatNGN(order.total)} with reference ${order.reference}, then mark the order Paid in admin.</p>` : ""}
        <p><a href="${SITE_URL}/admin">Open admin</a></p>`,
    });
  }
}
