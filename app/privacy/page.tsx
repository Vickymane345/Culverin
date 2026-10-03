import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { CONTACT, LEGAL_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 2026">
      <p>
        {LEGAL_NAME} handles your personal data in line with the Nigeria Data Protection Act 2023. This page explains
        what we collect and why.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details: name, email, phone and password (stored encrypted by our auth provider).</li>
        <li>Order details: delivery address, items bought and payment status.</li>
        <li>Repair bookings and messages you send through our forms.</li>
      </ul>
      <h2>Why</h2>
      <p>To deliver orders, carry out repairs, answer your questions and meet our legal and tax obligations.</p>
      <h2>Who we share it with</h2>
      <ul>
        <li>OPay, to take online payments. We never receive your full card number.</li>
        <li>Supabase, which hosts our database and sign-in.</li>
        <li>Delivery partners, only the details needed to deliver your order.</li>
      </ul>
      <p>We do not sell your data.</p>
      <h2>Your rights</h2>
      <p>
        You can ask to see, correct or delete your data at any time by emailing {CONTACT.email}. You can edit most
        details yourself in your dashboard.
      </p>
      <h2>Cookies</h2>
      <p>We use essential cookies to keep you signed in, and local storage to remember your bag.</p>
    </LegalPage>
  );
}
