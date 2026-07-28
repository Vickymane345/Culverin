import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 md:py-24 lg:py-32">
        <div className="text-center">
          <h2 className="text-balance font-semibold tracking-tight leading-[1.02] text-[clamp(1.9rem,6vw,6rem)]">
            Talk to <span className="text-accent">our team</span>.
          </h2>
          <div className="mx-auto mt-8 flex w-full max-w-sm flex-col gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
            <a
              href="mailto:hello@culverinquantum.com"
              className="break-words rounded-full bg-accent px-6 py-3.5 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-hover sm:px-8"
            >
              hello@culverinquantum.com
            </a>
            <Link
              href="/signup"
              className="rounded-full border border-line px-6 py-3.5 text-center text-sm font-semibold transition-colors hover:border-accent hover:text-accent sm:px-8"
            >
              Create account
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-8 text-sm sm:grid-cols-2 md:mt-24 md:grid-cols-4 md:gap-10">
          <div className="md:col-span-2">
            <p className="font-semibold">Culverin Quantum Systems Limited</p>
            <p className="mt-2 max-w-sm text-muted">
              Electronics retail, repairs and solar energy. Registered in Nigeria as
              a private company limited by shares under CAMA 2020.
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Store
            </p>
            <ul className="mt-4 space-y-2 text-muted">
              <li><Link href="/shop/phones" className="hover:text-foreground">Phones</Link></li>
              <li><Link href="/shop/laptops" className="hover:text-foreground">Laptops</Link></li>
              <li><Link href="/shop/solar" className="hover:text-foreground">Solar &amp; Power</Link></li>
              <li><Link href="/shop/gaming" className="hover:text-foreground">Gaming</Link></li>
              <li><Link href="/shop" className="hover:text-foreground">All products</Link></li>
              <li><Link href="/about" className="hover:text-foreground">About us</Link></li>
              <li><Link href="/credits" className="hover:text-foreground">Image credits</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
              Contact
            </p>
            <ul className="mt-4 space-y-2 text-muted">
              <li>+234 (0) 000 000 0000</li>
              <li>Lagos, Nigeria</li>
              <li className="flex gap-4 pt-2">
                <a href="#" aria-label="Instagram" className="hover:text-accent">Instagram</a>
                <a href="#" aria-label="X" className="hover:text-accent">X</a>
                <a href="#" aria-label="WhatsApp" className="hover:text-accent">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-center font-mono text-xs text-muted md:mt-16">
          © {new Date().getFullYear()} Culverin Quantum Systems Limited. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
