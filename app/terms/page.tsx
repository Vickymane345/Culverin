import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { CONTACT, LEGAL_NAME, RC_NUMBER } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="October 2026">
      <p>
        These terms apply when you use this website or buy from {LEGAL_NAME} ({RC_NUMBER}), a company registered in
        Nigeria. By placing an order you agree to them.
      </p>
      <h2>Orders and prices</h2>
      <p>
        Prices are in Nigerian naira and include VAT where it applies. An order is confirmed once payment is
        received. If an item turns out to be unavailable or mispriced, we will contact you and refund any payment in
        full if you do not want to continue.
      </p>
      <h2>Payment</h2>
      <p>Payments are processed by Paystack. We never see or store your card details.</p>
      <h2>Delivery, returns and warranty</h2>
      <p>
        See our <Link href="/returns" className="text-accent hover:underline">delivery and returns policy</Link>.
      </p>
      <h2>Repairs</h2>
      <p>
        We diagnose before we repair and only start work after you approve the quote. Devices not collected within
        60 days of being marked ready may be disposed of after reasonable notice.
      </p>
      <h2>Accounts</h2>
      <p>Keep your password private. You are responsible for activity on your account.</p>
      <h2>Liability</h2>
      <p>
        Nothing here limits rights you have under the Federal Competition and Consumer Protection Act 2018. Beyond
        that, our liability for any order is limited to the amount you paid for it.
      </p>
      <h2>Contact</h2>
      <p>{CONTACT.email}</p>
    </LegalPage>
  );
}
