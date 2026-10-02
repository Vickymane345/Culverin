import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/forms/ContactForm";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Talk to Culverin Quantum Systems about gadgets, solar installation, repairs, app and web development, or design. Based in Lagos, Nigeria.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-32 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Contact</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Talk to our team</h1>
            <p className="mt-4 text-muted">
              Questions about a product, a solar quote, or a software project. Send a message and we
              will get back to you.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="text-accent hover:underline">{CONTACT.email}</a>
              </li>
              {CONTACT.phone && <li><a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="hover:text-accent">{CONTACT.phone}</a></li>}
              {CONTACT.whatsapp && (
                <li>
                  <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`} className="hover:text-accent">
                    Chat on WhatsApp
                  </a>
                </li>
              )}
              <li className="text-muted">{CONTACT.city}, Nigeria</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <ContactForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
