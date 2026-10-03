"use server";

import { redirect } from "next/navigation";
import { getUser, createServiceClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { deliveryFee, NIGERIAN_STATES, type CartLine } from "@/lib/pricing";
import { priceCart } from "@/lib/pricing-server";
import { initializeTransaction, paystackConfigured } from "@/lib/paystack";
import { makeReference } from "@/lib/reference";
import { notifyOrder } from "@/lib/orders";
import { SITE_URL } from "@/lib/site";

export type CheckoutState = { error?: string } | undefined;

export async function placeOrder(_: CheckoutState, formData: FormData): Promise<CheckoutState> {
  if (!supabaseConfigured) {
    return { error: "Online ordering is not switched on yet. Please contact us to complete your order." };
  }

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const fullName = get("fullName");
  const email = get("email").toLowerCase();
  const phone = get("phone");
  const address = get("address");
  const city = get("city");
  const state = get("state");
  const notes = get("notes").slice(0, 500);
  // Bank transfer is always available; Paystack only once its key is set.
  const paymentMethod =
    get("payment") === "paystack" && paystackConfigured() ? "paystack" : "bank_transfer";

  if (!fullName || !phone || !address || !city) return { error: "Please fill in your name, phone and delivery address." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Please enter a valid email address." };
  if (!NIGERIAN_STATES.includes(state)) return { error: "Please choose your state." };

  let lines: CartLine[] = [];
  try {
    lines = JSON.parse(get("cart"));
  } catch {}
  if (!Array.isArray(lines)) lines = [];
  const priced = await priceCart(lines.slice(0, 50));
  if (priced.length === 0) return { error: "Your bag is empty." };

  // Prices come from the catalog on the server, never from the browser.
  const subtotal = priced.reduce((n, l) => n + l.lineTotal, 0);
  const delivery = deliveryFee(state, subtotal);
  const total = subtotal + delivery;

  const user = await getUser();
  const db = createServiceClient();
  const reference = makeReference("CQS");

  const { data: order, error } = await db
    .from("orders")
    .insert({
      reference,
      user_id: user?.id ?? null,
      email,
      full_name: fullName,
      phone,
      address,
      city,
      state,
      notes: notes || null,
      subtotal,
      delivery_fee: delivery,
      total,
      payment_method: paymentMethod,
    })
    .select("id")
    .single();
  if (error || !order) return { error: "We could not save your order. Please try again." };

  const { error: itemsError } = await db.from("order_items").insert(
    priced.map((l) => ({
      order_id: order.id,
      product_slug: l.product.slug,
      product_name: l.product.name,
      category: l.product.category,
      option: l.option,
      colour: l.colour,
      image: l.product.image,
      unit_price: l.unitPrice,
      quantity: l.quantity,
    }))
  );
  if (itemsError) {
    await db.from("orders").delete().eq("id", order.id);
    return { error: "We could not save your order. Please try again." };
  }

  // Keep the customer's delivery details for next time.
  if (user) {
    await db
      .from("profiles")
      .update({ phone, address, city, state, full_name: fullName })
      .eq("id", user.id);
  }

  if (paymentMethod === "bank_transfer") {
    await notifyOrder(order.id, "transfer");
    redirect(`/checkout/transfer?reference=${encodeURIComponent(reference)}`);
  }

  const payment = await initializeTransaction({
    email,
    amountNaira: total,
    reference,
    callbackUrl: `${SITE_URL}/checkout/complete`,
    metadata: { order_id: order.id, customer: fullName },
  });
  if ("error" in payment) {
    await db.from("orders").update({ status: "cancelled" }).eq("id", order.id);
    return { error: payment.error };
  }

  redirect(payment.authorizationUrl);
}
