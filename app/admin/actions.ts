"use server";

import { revalidatePath } from "next/cache";
import { requireAccount } from "@/lib/account";
import { ORDER_STATUSES, REPAIR_STATUSES, type OrderStatus, type RepairStatus } from "@/lib/types";

async function requireAdmin() {
  const ctx = await requireAccount("/admin");
  if (!ctx.profile.is_admin) throw new Error("Not allowed");
  return ctx;
}

export async function setOrderStatus(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return;
  const update: { status: OrderStatus; paid_at?: string } = { status };
  // Marking a bank-transfer order paid records when the money was confirmed.
  if (status === "paid") update.paid_at = new Date().toISOString();
  await supabase.from("orders").update(update).eq("id", id);
  revalidatePath("/admin");
}

export async function updateRepair(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as RepairStatus;
  const eta = String(formData.get("eta") ?? "") || null;
  if (!REPAIR_STATUSES.includes(status)) return;
  await supabase.from("repair_requests").update({ status, eta }).eq("id", id);
  revalidatePath("/admin");
}

export async function toggleEnquiry(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id"));
  const handled = formData.get("handled") === "true";
  await supabase.from("enquiries").update({ handled }).eq("id", id);
  revalidatePath("/admin");
}
