import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RepairForm from "@/components/forms/RepairForm";

export const metadata: Metadata = {
  title: "Phone & Laptop Repairs in Lagos",
  description:
    "Book an iPhone, Samsung or laptop repair with Culverin Quantum Systems in Lagos. Screen and battery replacement, charging faults, water damage and keyboard repairs.",
  alternates: { canonical: "/repairs" },
};

export default function RepairsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-32 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">Repairs</p>
            <h1 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Phone and laptop repairs, tracked from drop-off to pickup
            </h1>
            <p className="mt-4 text-muted">
              Screens, batteries, charging ports, keyboards, water damage and controller stick drift.
              Book online, and if you have an account you can follow every step in your dashboard.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              <li>Free diagnosis before any work starts</li>
              <li>We quote first, you approve</li>
              <li>90-day warranty on parts and labour</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <RepairForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
