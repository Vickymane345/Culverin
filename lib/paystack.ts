import "server-only";

const API = "https://api.paystack.co";

export const paystackConfigured = () => Boolean(process.env.PAYSTACK_SECRET_KEY);

function headers() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  };
}

/** Starts a payment. Amount is in naira; Paystack wants kobo. */
export async function initializeTransaction(input: {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}): Promise<{ authorizationUrl: string } | { error: string }> {
  try {
    const res = await fetch(`${API}/transaction/initialize`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        email: input.email,
        amount: input.amountNaira * 100,
        currency: "NGN",
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json.status) return { error: json.message || "Payment could not start." };
    return { authorizationUrl: json.data.authorization_url };
  } catch {
    return { error: "Could not reach the payment provider." };
  }
}

export interface VerifiedTransaction {
  status: string;
  amountKobo: number;
  currency: string;
  reference: string;
}

export async function verifyTransaction(reference: string): Promise<VerifiedTransaction | null> {
  try {
    const res = await fetch(`${API}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: headers(),
      cache: "no-store",
    });
    const json = await res.json();
    if (!res.ok || !json.status) return null;
    return {
      status: json.data.status,
      amountKobo: json.data.amount,
      currency: json.data.currency,
      reference: json.data.reference,
    };
  } catch {
    return null;
  }
}
