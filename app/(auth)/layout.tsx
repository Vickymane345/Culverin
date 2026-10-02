import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative flex min-h-svh flex-col lg:flex-row">
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-dark-bg p-12 text-white">
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          src="/videos/iphone-assembly.mp4"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40" />

        <Link href="/" className="relative font-semibold tracking-tight">
          Culverin<span className="text-white/60"> Quantum</span>
        </Link>

        <div className="relative max-w-md">
          <h2 className="text-balance font-semibold leading-[1.1] tracking-tight text-[clamp(2rem,3vw,3rem)]">
            Your orders and repairs, <span className="text-[#6cb8ff]">tracked</span>.
          </h2>
          <p className="mt-5 text-white/70">
            See order history, follow repairs from our lab, and save what you want
            next.
          </p>
        </div>

        <p className="relative font-mono text-xs uppercase tracking-[0.3em] text-white/45">
          Culverin Quantum Systems Limited
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-5 py-12 sm:px-6 sm:py-16 md:px-12">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-block font-semibold tracking-tight lg:hidden"
          >
            Culverin<span className="text-white/60"> Quantum</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
