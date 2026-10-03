import "server-only";
import { createHmac } from "node:crypto";

// OPay merchant checkout (Cashier API), Nigeria.
// Docs: https://doc.opaycheckout.com/cashier-create
// Needs OPAY_MERCHANT_ID, OPAY_PUBLIC_KEY and OPAY_SECRET_KEY from the OPay
// merchant dashboard. Set OPAY_ENV=sandbox while testing.

const API =
  process.env.OPAY_ENV === "sandbox"
    ? "https://testapi.opaycheckout.com"
    : "https://liveapi.opaycheckout.com";

export const opayConfigured = () =>
  Boolean(process.env.OPAY_MERCHANT_ID && process.env.OPAY_PUBLIC_KEY && process.env.OPAY_SECRET_KEY);

/** JSON with keys sorted alphabetically, as OPay signs it. */
function sortedJson(value: unknown): string {
  const sort = (v: unknown): unknown =>
    Array.isArray(v)
      ? v.map(sort)
      : v && typeof v === "object"
        ? Object.fromEntries(
            Object.keys(v as object)
              .sort()
              .map((k) => [k, sort((v as Record<string, unknown>)[k])])
          )
        : v;
  return JSON.stringify(sort(value));
}

/** Sends the customer to OPay's hosted checkout. Amount is in naira; OPay wants kobo. */
export async function createCheckout(input: {
  reference: string;
  amountNaira: number;
  email: string;
  name: string;
  phone: string;
  returnUrl: string;
  cancelUrl: string;
  callbackUrl: string;
  description: string;
}): Promise<{ cashierUrl: string } | { error: string }> {
  try {
    const res = await fetch(`${API}/api/v1/international/cashier/create`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPAY_PUBLIC_KEY}`,
        MerchantId: process.env.OPAY_MERCHANT_ID!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: "NG",
        reference: input.reference,
        amount: { total: input.amountNaira * 100, currency: "NGN" },
        returnUrl: input.returnUrl,
        cancelUrl: input.cancelUrl,
        callbackUrl: input.callbackUrl,
        expireAt: 30,
        userInfo: {
          userEmail: input.email,
          userName: input.name,
          userMobile: input.phone,
        },
        product: { name: "Culverin order", description: input.description.slice(0, 200) },
      }),
      cache: "no-store",
    });
    const json = await res.json();
    if (json.code !== "00000" || !json.data?.cashierUrl) {
      console.error("OPay create failed", json.code, json.message);
      return { error: "Online payment could not start. Please try again or pay by bank transfer." };
    }
    return { cashierUrl: json.data.cashierUrl };
  } catch (e) {
    console.error("OPay create error", e);
    return { error: "Could not reach OPay. Please try again or pay by bank transfer." };
  }
}

export interface OpayStatus {
  status: "INITIAL" | "PENDING" | "SUCCESS" | "FAIL" | "CLOSE" | string;
  amountKobo: number;
  currency: string;
  reference: string;
}

/**
 * Asks OPay directly whether a payment went through. This is the source of
 * truth: orders are only marked paid from this answer, never from the
 * browser redirect or the webhook body alone.
 */
export async function queryStatus(reference: string): Promise<OpayStatus | null> {
  const body = { country: "NG", reference };
  const payload = sortedJson(body);
  const signature = createHmac("sha512", process.env.OPAY_SECRET_KEY!).update(payload).digest("hex");
  try {
    const res = await fetch(`${API}/api/v1/international/cashier/status`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${signature}`,
        MerchantId: process.env.OPAY_MERCHANT_ID!,
        "Content-Type": "application/json",
      },
      body: payload,
      cache: "no-store",
    });
    const json = await res.json();
    if (json.code !== "00000" || !json.data) {
      console.error("OPay status failed", json.code, json.message);
      return null;
    }
    return {
      status: json.data.status,
      amountKobo: Number(json.data.amount?.total),
      currency: String(json.data.amount?.currency),
      reference: json.data.reference,
    };
  } catch (e) {
    console.error("OPay status error", e);
    return null;
  }
}
