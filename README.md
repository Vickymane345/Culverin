# Culverin Quantum Systems — 3D Scroll E-Commerce Site

Next.js 16 (App Router) + TypeScript + Tailwind v4 + GSAP/ScrollTrigger + Lenis + React Three Fiber.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000 — the dashboard is at `/dashboard`.

## Structure

```
app/
  page.tsx                  landing page (composes all scroll sections)
  layout.tsx                fonts, metadata, global shell
  globals.css               theme tokens, glass/mesh/grain utilities
  dashboard/
    layout.tsx              sidebar shell
    page.tsx                overview (stats, recent orders, account, lab status)
    orders/page.tsx         full order history table
    wishlist/page.tsx       saved items grid
    devices/page.tsx        repair tracking with progress steps
    settings/page.tsx       profile + security form (UI only)
  shop/
    layout.tsx              navbar + sticky category bar + footer
    page.tsx                shop hub: category tiles, featured rails
    [category]/page.tsx     filterable grid (brand, price, search, sort)
    [category]/[slug]/page.tsx  product detail
  (auth)/
    signin/page.tsx         sign in (UI only)
    signup/page.tsx         sign up (UI only)
components/
  SmoothScroll.tsx          Lenis <-> GSAP ScrollTrigger sync
  Navbar.tsx                floating glass pill nav
  Hero.tsx                  full-viewport looping video hero
  QuantumScene.tsx          R3F particle field + wireframe core (sticky backdrop)
  Footer.tsx
  sections/
    IphoneShowcase.tsx      pinned title + scale/rotate scrubbed cards
    LaptopShowcase.tsx      pinned horizontal scroll track
    SolarShowcase.tsx       card stacking on scroll
    GamingShowcase.tsx      staggered rise-in grid + parallax glow
    About.tsx               word-by-word scrubbed text reveal
    Services.tsx            bento grid + infinite marquee
  ui/                       card, badge, button, input, table primitives
  dashboard/                Sidebar, StatusBadge
  shop/                     ProductCard, ProductRail, CategoryBrowser,
                            ProductBuyPanel, ShopNav
lib/
  catalog.ts                shop catalog: 91 products across 6 categories
  products.ts               landing page showcase data
  mock-data.ts              dashboard mock data (typed, swappable for API)
  utils.ts                  cn(), formatNGN()
public/
  videos/iphone-assembly.mp4
  images/                   supplied iPhone photography
  images/products/          generated SVG product artwork (81 files)
```

## Theme

Light retail palette, defined once as CSS custom properties in
`app/globals.css` and exposed to Tailwind through `@theme inline` — change a
value there and it propagates everywhere.

| Token | Value | Used for |
| --- | --- | --- |
| `background` | `#ffffff` | page |
| `surface` | `#f5f5f7` | cards, panels, table headers |
| `foreground` | `#1d1d1f` | body text |
| `muted` | `#6e6e73` | secondary text |
| `line` | `#d2d2d7` | hairline borders |
| `accent` | `#0066cc` | prices, links, primary buttons |
| `success` / `warning` / `danger` | `#187a45` / `#9a6b00` / `#c0392b` | statuses |
| `dark-bg` / `dark-fg` | `#0a0a0c` / `#f5f5f7` | video hero, auth panel |

Every foreground/background pair passes WCAG AA (4.5:1) — verified, lowest is
4.66:1. Use `text-muted` rather than opacity ramps like `text-foreground/60`, so
contrast stays predictable.

The landing hero and the auth split-panel stay deliberately dark so the product
video keeps its impact; the navbar detects this and swaps between `.glass` and
`.glass-dark` on scroll.

## Shop catalog

`lib/catalog.ts` holds 91 products:

| Category | Count | Covers |
| --- | --- | --- |
| Phones | 40 | iPhone 11 → 17 Pro Max, Galaxy S20 → S26 Ultra |
| Laptops | 17 | MacBook, Dell, HP, Lenovo, ASUS |
| Tablets & Accessories | 11 | iPad, Galaxy Tab, chargers, cables, cases |
| Audio & Wearables | 8 | AirPods, Galaxy Buds, Sony, Apple Watch |
| Gaming | 8 | PS5, Xbox, Switch 2, controllers, monitor |
| Solar & Power | 7 | Inverters, panels, lithium batteries, kits |

Every product page is statically generated via `generateStaticParams`, so the
build produces 109 pre-rendered routes.

## Swapping in real data

Dashboard content flows from typed objects in `lib/mock-data.ts` (`Order`,
`WishlistItem`, `Device`, `UserProfile`); shop content from `Product[]` in
`lib/catalog.ts`. Replace those exports with fetch calls returning the same
shapes and no component changes are needed.

## Product imagery

Ships with generated SVG artwork in `public/images/products/` — device
silhouettes on brand-tinted backgrounds. Nothing depends on an external CDN, so
no image can 404.

To replace it with real photography — **no API key or signup needed**:

```bash
pnpm images:preview     # show what each product would get, download nothing
pnpm images             # download real photos, rewrite lib/catalog.ts
pnpm images:revert      # restore the generated artwork exactly
```

That pulls all 91 products from **Wikimedia Commons**, which needs no key and
has photographs of *named models* — a Galaxy S22 Ultra actually looks like one,
which generic stock photography cannot do. Commons images are CC-licensed and
legally require attribution, so the script writes `lib/image-credits.ts`,
rendered at `/credits` and linked from the footer.

Optionally, add a free Unsplash key and the lifestyle categories (solar, gaming,
audio, accessories) prefer Unsplash's more polished photography instead, falling
back to Commons if it finds nothing. Key from <https://unsplash.com/developers>:

```bash
# PowerShell
$env:UNSPLASH_ACCESS_KEY="your_key"; pnpm images

# bash
UNSPLASH_ACCESS_KEY=your_key pnpm images
```

Per product the script tries: preferred provider → other provider → nearest
sibling (iPhone 17 Pro Max borrows iPhone 17 Pro) → keep existing artwork. So a
card is never empty. `--only=phones` limits it to one category. The first run
saves original paths to `lib/.image-backup.json`, which makes `--revert` exact.

Search terms live in `scripts/image-sources.mjs`, one entry per product — edit
any query if a result is not what you want, then re-run.

## Motion notes

- Animations are disabled under `prefers-reduced-motion: reduce` (Lenis, the R3F
  scene, and the marquee all opt out).
- Pinning and horizontal scroll are gated behind `gsap.matchMedia("(min-width: 768px)")`
  so mobile gets simple vertical flow.
- Laptop, solar and gaming imagery uses Unsplash placeholder URLs — swap for real
  product shots when available.
