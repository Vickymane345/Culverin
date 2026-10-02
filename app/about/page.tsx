import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutStory, { type AboutSection } from "@/components/about/AboutStory";

export const metadata: Metadata = {
  title: "About us",
  alternates: { canonical: "/about" },
  description:
    "Culverin Quantum Systems Limited is a Nigerian electronics retailer and engineering practice, registered under CAMA 2020. We sell phones, laptops and solar systems, and we repair and install them.",
};

const sections: AboutSection[] = [
  {
    number: "01",
    title: "The company",
    lead: "A private company limited by shares, registered in Nigeria under the Companies and Allied Matters Act 2020.",
    body: [
      "Our registered office is in Nigeria and our nominal share capital is ₦1,000,000.",
      "We trade as an electronics retailer and an engineering practice. That combination is deliberate. The people who sell you a device are the same people who can repair it, and the team that supplies your inverter is the team that installs and maintains it.",
    ],
    facts: [
      ["Incorporated under", "CAMA 2020"],
      ["Company type", "Private company limited by shares"],
      ["Share capital", "₦1,000,000"],
      ["Registered office", "Nigeria"],
    ],
  },
  {
    number: "02",
    title: "What we do",
    lead: "Our registered objects cover three lines of business, and we run all three.",
    body: [],
    lines: [
      {
        heading: "Retail and distribution",
        text: "Supply, sales and distribution of phones, laptops, tablets, audio, gaming hardware and general merchandise. We also act as commission agents, importers, exporters and general merchants.",
      },
      {
        heading: "Repairs, software and design",
        text: "Phone and laptop repair at board level, plus mobile and web application development, animation and graphic design.",
      },
      {
        heading: "Solar energy",
        text: "Import, export, supply, sales and servicing of solar equipment and inverters, with installation, maintenance and repair of complete solar energy systems.",
      },
    ],
  },
  {
    number: "03",
    title: "How we work",
    lead: "Every device we sell is checked before it ships.",
    body: [
      "Phones are IMEI verified, laptops are bench tested, and solar systems are sized against a site survey rather than a guess.",
      "Stock is genuine and warranted for twelve months. If something fails inside that window it comes back to our own lab, not to a third party, which is why we can commit to turnaround times at all.",
    ],
    facts: [
      ["Warranty", "12 months on new devices"],
      ["Verification", "IMEI checked, bench tested"],
      ["Repairs", "In-house lab, board level"],
      ["Solar", "Survey, install, maintain"],
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="w-full max-w-full overflow-x-hidden">
        <header className="mx-auto max-w-7xl px-5 pt-28 pb-10 sm:px-6 sm:pt-32 md:pt-40 md:pb-16">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            About us
          </p>
          <h1 className="mt-4 max-w-4xl text-balance font-semibold leading-[1.06] tracking-tight text-[clamp(2rem,5vw,4rem)]">
            An electronics company that also builds and repairs.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
            Culverin Quantum Systems sells the hardware people rely on, and
            keeps it running afterwards.
          </p>
        </header>

        <AboutStory sections={sections} />

        <div className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 md:pb-28">
          <div className="rounded-3xl border border-line bg-surface p-7 sm:p-10">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Work with us
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
              Buying hardware, booking a repair, or sizing a solar system for a
              home or office. Start in the shop or send us a message.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-accent px-7 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                Browse the shop
              </Link>
              <a
                href="mailto:hello@culverinquantum.com"
                className="rounded-full border border-line px-7 py-3.5 text-center text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                Contact the team
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
