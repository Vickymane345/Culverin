import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { imageCredits } from "@/lib/image-credits";

export const metadata: Metadata = {
  title: "Image credits",
  description:
    "Photography attribution for product imagery used across the Culverin Quantum Systems store.",
};

export default function CreditsPage() {
  const byProvider = imageCredits.reduce<Record<string, typeof imageCredits>>(
    (acc, credit) => {
      (acc[credit.provider] ||= []).push(credit);
      return acc;
    },
    {}
  );

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-6 pb-24 pt-32">
        <h1 className="text-balance font-semibold leading-[1.05] tracking-tight text-[clamp(2rem,4vw,3.5rem)]">
          Image credits
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Product photography used across this store, with the photographer and
          licence for each image.
        </p>

        {imageCredits.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-line bg-surface p-8">
            <p className="text-muted">
              Product imagery is currently our own generated artwork, which needs
              no attribution.
            </p>
            <p className="mt-3 text-sm text-muted">
              Run{" "}
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                node scripts/fetch-images.mjs
              </code>{" "}
              to pull real photography. This page fills in automatically.
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-12">
            {Object.entries(byProvider).map(([provider, items]) => (
              <section key={provider}>
                <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  {provider}, {items.length}{" "}
                  {items.length === 1 ? "image" : "images"}
                </h2>
                <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-surface">
                  {items.map((credit) => (
                    <li
                      key={credit.slug}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4 text-sm"
                    >
                      <span className="font-medium">{credit.name}</span>
                      <span className="text-muted">
                        {credit.artist}
                        <span className="mx-2 text-line">·</span>
                        {credit.licence}
                      </span>
                      <a
                        href={credit.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        Source
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        <p className="mt-12 text-sm text-muted">
          Something credited incorrectly?{" "}
          <Link href="/#contact" className="text-accent hover:underline">
            Let us know
          </Link>{" "}
          and we will fix it.
        </p>
      </main>
      <Footer />
    </>
  );
}
