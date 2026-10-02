# Going live: setup checklist

The code is complete. These steps connect it to real accounts. Do them in order;
each one takes a few minutes. Every key goes into `.env.local` for local testing
and into Vercel (Project → Settings → Environment Variables) for the live site.
Start from `.env.example`.

---

## 1. Supabase (database, sign-in, accounts)

1. Create a free project at https://supabase.com (region: closest to Nigeria, e.g. `eu-west`).
2. **SQL Editor → New query**, paste all of `supabase/migrations/0001_init.sql`, click **Run**.
3. **Project Settings → API**, copy into your env:
   - `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon / publishable key)
   - `SUPABASE_SERVICE_ROLE_KEY` (service_role / secret key, keep private)
4. **Authentication → URL Configuration**
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: add `https://yourdomain.com/auth/callback` and `http://localhost:3000/auth/callback`
5. **Authentication → Providers → Email**: leave "Confirm email" on.
6. Optional, for the "Continue with Google" button:
   - Google Cloud Console → APIs & Services → Credentials → Create OAuth client ID (Web application).
   - Authorised redirect URI: the callback shown in Supabase under **Providers → Google**
     (looks like `https://xxxx.supabase.co/auth/v1/callback`).
   - Paste the Client ID and Secret into Supabase **Providers → Google** and enable it.
7. Supabase's built-in email sender is rate limited (a few emails an hour). Before launch, set
   **Authentication → Emails → SMTP Settings** to use Resend (step 3 below) so sign-up and
   password-reset emails always arrive.

### Make yourself admin

Sign up on the site once, then in Supabase **SQL Editor** run:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

An **Admin** link appears in your dashboard sidebar. It shows paid orders, repair bookings and
contact messages, and lets you update order status and repair progress (customers see these
updates in their own dashboard).

---

## 2. Paystack (payments: card, bank transfer, USSD)

1. Sign up at https://paystack.com and complete business verification with the CAC documents
   for Culverin Quantum Systems Limited (RC 9083558). Test mode works before approval.
2. **Settings → API Keys & Webhooks**
   - Copy the **Secret key** into `PAYSTACK_SECRET_KEY` (`sk_test_…` while testing, `sk_live_…` for real money).
   - Webhook URL: `https://yourdomain.com/api/paystack/webhook`
3. Test with a Paystack test card (Paystack lists them in their docs) and check that the order
   shows as **Paid** in your admin page.

Prices are always recalculated on the server from `lib/catalog.ts`, so a customer cannot change
what they pay by editing the page. An order is only marked paid after Paystack confirms the exact
amount.

---

## 3. Email notifications (optional but recommended)

1. Create an account at https://resend.com, add and verify your domain (it gives you DNS records
   to add at your domain registrar).
2. Set `RESEND_API_KEY`, `EMAIL_FROM` (e.g. `Culverin Quantum <orders@yourdomain.com>`) and
   `STAFF_NOTIFY_EMAIL` (the inbox that should hear about new orders, repairs and messages).

Without these, everything still works; you just check the admin page instead of getting emails.

---

## 4. Deploy on Vercel

1. https://vercel.com → **Add New → Project** → import the `Culverin` GitHub repo.
2. Add every variable from `.env.example` under Environment Variables.
   **Set `NEXT_PUBLIC_SITE_URL` to your real domain before the first deploy**: it is baked into the
   sitemap, canonical links and Paystack return URL at build time.
3. Deploy. Then **Settings → Domains** → add your domain and follow the DNS instructions.
4. After changing any env var, redeploy so it takes effect.

---

## 5. Getting onto Google (and Bing)

The site is already built for search engines: every page has a proper title and description,
canonical URLs, Open Graph tags for WhatsApp/social previews, an XML sitemap listing all 91
products with images (`/sitemap.xml`), `robots.txt`, and structured data (your business as an
ElectronicsStore, every product with its naira price, breadcrumbs). Private pages (dashboard,
cart, checkout, admin) are kept out of search results.

What only you can do, because it needs ownership of the domain:

1. **Google Search Console** (https://search.google.com/search-console)
   - Add property → **URL prefix** → `https://yourdomain.com`.
   - Choose **HTML tag** verification, copy just the `content="…"` value into
     `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, redeploy, then click **Verify**.
     (Or use the **Domain** property with a DNS TXT record if you prefer.)
   - **Sitemaps** → submit `sitemap.xml`.
   - **URL Inspection** → paste your homepage → **Request indexing**. Repeat for /shop and your top
     category pages. First pages usually appear within a few days to two weeks.
2. **Google Business Profile** (https://business.google.com): this is what puts you on Google
   Maps and the "near me" results. Add the shop address, phone, hours, photos and website link.
   For a Nigerian electronics shop this often brings more customers than the website itself.
3. **Google Merchant Center** (https://merchants.google.com): free product listings in the
   Google Shopping tab. Verify the same domain, then add products by pointing it at your website
   (it reads the product structured data already on each page).
4. **Bing Webmaster Tools** (https://www.bing.com/webmasters): import straight from Search
   Console, or use the meta tag in `NEXT_PUBLIC_BING_SITE_VERIFICATION`.

Things that move rankings after that:
- Real product photos (run `pnpm images` or upload your own) and unique descriptions.
- Genuine customer reviews on your Google Business Profile.
- Links from other sites: Nigerian tech blogs, Jiji/Konga store pages, your social profiles.
- Keeping prices current, since people search for "<model> price in Nigeria".

---

## Things to fill in or review

- **Contact details**: `NEXT_PUBLIC_CONTACT_PHONE`, `NEXT_PUBLIC_WHATSAPP`, `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Delivery fees**: `DELIVERY` in `lib/pricing.ts` (₦5,000 Lagos, free above ₦250,000; ₦10,000 other states).
- **Legal pages** (`/terms`, `/privacy`, `/returns`): sensible starting text for a Nigerian online
  retailer, but have a lawyer read them before launch. Paystack asks for these during verification.
- **Prices**: in `lib/catalog.ts`. 60 products now match remzyconsult.com; see the commit
  message for which ones and which were left alone.
