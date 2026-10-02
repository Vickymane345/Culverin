import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { DELIVERY } from "@/lib/pricing";
import { formatNGN } from "@/lib/utils";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Delivery & Returns",
  description: "Delivery fees, timelines, warranty and returns at Culverin Quantum Systems.",
  alternates: { canonical: "/returns" },
};

export default function ReturnsPage() {
  return (
    <LegalPage title="Delivery & Returns" updated="October 2026">
      <h2>Delivery</h2>
      <ul>
        <li>
          Lagos: free on orders above {formatNGN(DELIVERY.freeLagosAbove)}, otherwise {formatNGN(DELIVERY.lagos)}.
          Usually within 24 to 48 hours of payment.
        </li>
        <li>Other states: {formatNGN(DELIVERY.otherStates)}, usually 2 to 5 working days.</li>
        <li>Solar installations are scheduled with you after a site survey.</li>
      </ul>
      <h2>Inspecting your order</h2>
      <p>Please check your item when it arrives. If anything is damaged or not as described, tell us within 48 hours.</p>
      <h2>Returns and refunds</h2>
      <p>
        You can return a sealed, unused item within 7 days of delivery. Opened items can be returned if they are
        faulty. Refunds go back to the original payment method within 7 working days of us receiving the item.
      </p>
      <h2>Warranty</h2>
      <p>
        New devices carry a 12-month Culverin warranty unless the product page says otherwise. Repairs carry a
        90-day warranty on parts and labour. Physical and liquid damage are not covered.
      </p>
      <h2>Contact</h2>
      <p>Email {CONTACT.email} with your order reference to start a return.</p>
    </LegalPage>
  );
}
