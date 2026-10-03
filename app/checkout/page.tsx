import { connection } from "next/server";
import { getUser, createClient } from "@/lib/supabase/server";
import CheckoutForm, { type Prefill } from "./CheckoutForm";
import { paystackConfigured } from "@/lib/paystack";

export default async function CheckoutPage() {
  await connection();
  const user = await getUser();
  let prefill: Prefill = {};

  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("full_name, phone, address, city, state")
      .eq("id", user.id)
      .maybeSingle();
    prefill = {
      fullName: data?.full_name ?? "",
      email: user.email ?? "",
      phone: data?.phone ?? "",
      address: data?.address ?? "",
      city: data?.city ?? "",
      state: data?.state ?? "",
    };
  }

  return <CheckoutForm prefill={prefill} signedIn={Boolean(user)} paystackEnabled={paystackConfigured()} />;
}
