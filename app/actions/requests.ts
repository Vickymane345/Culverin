"use server";

import { revalidatePath } from "next/cache";
import { createServiceClient, getUser } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { escapeHtml, sendEmail, staffInbox } from "@/lib/email";
import { makeReference } from "@/lib/reference";

export type RequestState = { error?: string; message?: string } | undefined;

const offline: RequestState = {
  error: "Online booking is not switched on yet. Please call or email us instead.",
};

function read(formData: FormData, name: string, max = 200) {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

// Simple bot trap: real people never fill the hidden "company" field.
function isBot(formData: FormData) {
  return read(formData, "company").length > 0;
}

export async function bookRepair(_: RequestState, formData: FormData): Promise<RequestState> {
  if (!supabaseConfigured) return offline;
  if (isBot(formData)) return { message: "Thanks, we have your booking." };

  const name = read(formData, "name");
  const email = read(formData, "email").toLowerCase();
  const phone = read(formData, "phone", 40);
  const device = read(formData, "device");
  const serial = read(formData, "serial", 80);
  const issue = read(formData, "issue", 2000);

  if (!name || !phone || !device || !issue) return { error: "Please fill in your name, phone, device and the problem." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Please enter a valid email address." };

  const user = await getUser();
  const reference = makeReference("RPR");
  const db = createServiceClient();
  const { error } = await db.from("repair_requests").insert({
    reference,
    user_id: user?.id ?? null,
    name,
    email,
    phone,
    device,
    serial: serial || null,
    issue,
  });
  if (error) return { error: "We could not save your booking. Please try again." };

  const staff = staffInbox();
  if (staff) {
    await sendEmail({
      to: staff,
      replyTo: email,
      subject: `Repair booking ${reference}: ${device}`,
      html: `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(phone)}, ${escapeHtml(email)})</p>
             <p>Device: ${escapeHtml(device)}${serial ? ` / SN ${escapeHtml(serial)}` : ""}</p>
             <p>${escapeHtml(issue)}</p>`,
    });
  }
  await sendEmail({
    to: email,
    subject: `We received your repair booking (${reference})`,
    html: `<p>Hi ${escapeHtml(name)},</p><p>Thanks for booking your ${escapeHtml(device)} in with us. Our technician will call you on ${escapeHtml(phone)} to arrange drop-off or pickup.</p><p>Reference: ${reference}</p>`,
  });

  revalidatePath("/dashboard/devices");
  return {
    message: `Booked. Your reference is ${reference}. We will call you shortly to arrange drop-off.${
      user ? " You can follow progress under My Devices." : ""
    }`,
  };
}

export async function sendEnquiry(_: RequestState, formData: FormData): Promise<RequestState> {
  if (!supabaseConfigured) return offline;
  if (isBot(formData)) return { message: "Thanks, your message is in." };

  const name = read(formData, "name");
  const email = read(formData, "email").toLowerCase();
  const phone = read(formData, "phone", 40);
  const topic = read(formData, "topic", 60) || "General";
  const message = read(formData, "message", 4000);

  if (!name || !message) return { error: "Please add your name and a message." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { error: "Please enter a valid email address." };

  const db = createServiceClient();
  const { error } = await db.from("enquiries").insert({ name, email, phone: phone || null, topic, message });
  if (error) return { error: "We could not send your message. Please try again." };

  const staff = staffInbox();
  if (staff) {
    await sendEmail({
      to: staff,
      replyTo: email,
      subject: `Website enquiry (${topic}) from ${name}`,
      html: `<p><strong>${escapeHtml(name)}</strong> ${escapeHtml(email)} ${escapeHtml(phone)}</p><p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    });
  }

  return { message: "Thanks, your message is in. We usually reply within one working day." };
}
