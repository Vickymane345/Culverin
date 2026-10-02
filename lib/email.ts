import "server-only";

// Sends transactional email through Resend (https://resend.com) when
// RESEND_API_KEY is set. Without a key it does nothing, so orders still work.
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html, reply_to: replyTo }),
    });
  } catch (err) {
    console.error("Email failed", err);
  }
}

/** Where new orders, repair bookings and enquiries are announced. */
export function staffInbox() {
  return process.env.STAFF_NOTIFY_EMAIL || "";
}

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
