import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About us | Culverin Quantum Systems",
  description:
    "Culverin Quantum Systems Limited is a Nigerian electronics retailer and engineering practice, registered under CAMA 2020. We sell phones, laptops and solar systems, and we repair and install them.",
};

const sections = [
  {
    number: "01",
    title: "The company",
    body: [
      "Culverin Quantum Systems Limited is a private company limited by shares, registered in Nigeria under the Companies and Allied Matters Act 2020. Our registered office is in Nigeria and our nominal share capital is ₦1,000,000.",
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
    body: [
      "Our registered objects cover three lines of business, and we run all three.",
    ],
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
    body: [
      "Every device we sell is checked before it ships. Phones are IMEI verified, laptops are bench tested, and solar systems are sized against a site survey rather than a guess.",
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
        <header className="mx-auto max-w-6xl px-5 pt-28 pb-12 sm:px-6 sm:pt-32 md:pt-40 md:pb-16">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
            About us
          </p>
          <h1 className="mt-4 max-w-4xl text-balance font-semibold leading-[1.08] tracking-tight text-[clamp(2rem,5vw,4rem)]">
            An electronics company that also builds and repairs.
          </h1>
          <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg">
            Culverin Quantum Systems sells the hardware people rely on, and
            keeps it running afterwards.
          </p>
        </header>

        <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-6 md:pb-28">
          <div className="space-y-12 md:space-y-16">
            {sections.map((s) => (
              <article
                key={s.number}
                className="grid gap-6 border-t border-line pt-8 md:grid-cols-[9rem_1fr] md:gap-10 md:pt-10"
              >
                <div className="flex items-baseline gap-4 md:block">
                  <span className="font-mono text-sm text-accent">{s.number}</span>
                  <h2 className="text-xl font-semibold tracking-tight md:mt-3 md:text-2xl">
                    {s.title}
                  </h2>
                </div>

                <div>
                  {s.body.map((p) => (
                    <p
                      key={p}
                      className="mb-4 max-w-2xl text-base leading-relaxed text-muted last:mb-0"
                    >
                      {p}
                    </p>
                  ))}

                  {s.lines && (
                    <ul className="mt-7 grid gap-4 sm:grid-cols-3 sm:gap-5">
                      {s.lines.map((l) => (
                        <li
                          key={l.heading}
                          className="rounded-2xl border border-line bg-surface p-5"
                        >
                          <h3 className="text-sm font-semibold">{l.heading}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted">
                            {l.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {s.facts && (
                    <dl className="mt-7 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                      {s.facts.map(([k, v]) => (
                        <div
                          key={k}
                          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-2.5"
                        >
                          <dt className="font-mono text-xs uppercase tracking-[0.15em] text-muted">
                            {k}
                          </dt>
                          <dd className="text-sm font-medium">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-line bg-surface p-7 sm:p-10">
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
