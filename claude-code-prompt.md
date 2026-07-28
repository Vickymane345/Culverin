# Claude Code Prompt — Culverin Quantum Systems E-Commerce Website

Copy everything below into Claude Code.

---

I want to build a 3D scroll-animation electronics e-commerce website for my company, **Culverin Quantum Systems Limited** (a Nigerian private company limited by shares, registered under CAMA 2020). Per our Memorandum of Association, the company's business covers:

- Phone and laptop repairs, mobile and web app development, animation and graphic design
- Import, export, supply, sales, and service of solar equipment and inverters — installation, maintenance, and repair of solar energy systems
- Supply, sales, and distribution of general goods and merchandise

Build the site to reflect this: an electronics store selling **iPhones, laptops, solar inverters, and gaming gear/consoles**, with a premium, futuristic "quantum systems" brand feel.

## Tech stack

Confirmed: Next.js (App Router), TypeScript, Tailwind CSS, GSAP (with ScrollTrigger) for scroll animations, pnpm as the package manager.

Before you start, tell me if you think other libraries are needed for the "3D scroll animation" effect I'm asking for (e.g. Three.js / React Three Fiber for real 3D product models, Lenis for smooth scrolling, Framer Motion, Zustand for mock dashboard state, shadcn/ui for dashboard components) — **ask me before installing or adding anything outside the confirmed stack.**

Also check whether any of your available skills, plugins, connectors, or MCP servers (e.g. a frontend-design skill, animation skill, Figma, or UI component tooling) would help build this well, and ask me before enabling/using any of them.

## Landing page

- Full-viewport hero section with a **looping video background** — I'll place my provided video (an iPhone-parts assembly clip) at `/public/videos/iphone-assembly.mp4`. Overlay the company name, a tagline, and a CTA on top of it with a dark gradient/scrim for text legibility.
- Scroll-driven 3D-feeling sections (GSAP ScrollTrigger: pinning, parallax, staggered reveals, scale/rotate transforms on product imagery) as the user scrolls down.
- Product showcase sections for four categories, each with its own scroll animation treatment:
  1. **iPhones** — use the product photos I've provided (unboxing shot, Pacific Blue back, natural titanium pair, space gray angle) as placeholders.
  2. **Laptops**
  3. **Solar inverters / solar equipment**
  4. **Gaming** (consoles/accessories)
  For laptop, inverter, and gaming imagery, use royalty-free stock-style placeholder images (via Unsplash/Pexels source URLs or generated placeholders) since I've only supplied iPhone photos.
- An "About / What We Do" section summarizing the company's registered business objects in plain marketing language.
- A services strip covering repairs, app/web development, graphic design, and solar installation/maintenance.
- Footer with company name, contact placeholders, and social links.

## User dashboard (UI only, mock data, no backend)

Design a customer dashboard with **entirely mock/hard-coded data** — no API routes, no database, no auth logic yet:

- Overview page (order stats, recent orders, account summary cards)
- Order history table with mock orders across all four product categories
- Wishlist/saved items grid
- Profile/account settings form (non-functional, UI only)
- A "My Devices" panel (for repair-service customers) showing mock device/repair status

Use realistic-looking placeholder data (names, order IDs, prices in NGN, dates, statuses) but make it obviously swappable for real data later — structure it through typed mock data files/objects, not hardcoded JSX strings.

## Process

1. First, confirm the additional tech stack / skills / plugins / MCP servers you want to use, and wait for my go-ahead.
2. Then scaffold the Next.js + TypeScript + Tailwind project.
3. Build the landing page with the video hero and GSAP scroll sections.
4. Build the product sections with the placeholder imagery.
5. Build the dashboard with mock data.
6. Keep everything responsive and accessible.
