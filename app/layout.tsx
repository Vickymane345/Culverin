import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/shop/CartProvider";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, SITE_NAME, LEGAL_NAME, CONTACT } from "@/lib/site";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Buy iPhones, Samsung Galaxy phones, MacBooks and laptops, PS5 and gaming gear, and solar inverters in Lagos, Nigeria. Phone and laptop repairs, solar installation, app development and design by Culverin Quantum Systems.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Culverin Quantum Systems | Phones, Laptops, Solar & Gaming in Nigeria",
    template: "%s | Culverin Quantum Systems",
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "buy iPhone in Lagos",
    "UK used iPhone Nigeria",
    "Samsung Galaxy price in Nigeria",
    "MacBook price in Nigeria",
    "laptops in Lagos",
    "PS5 price in Nigeria",
    "solar inverter Lagos",
    "phone repair Lagos",
    "laptop repair Lagos",
    "Culverin Quantum Systems",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: "Culverin Quantum Systems | Phones, Laptops, Solar & Gaming",
    description,
    images: [{ url: "/images/iphone-unboxing.jpg", alt: "Culverin Quantum Systems" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Culverin Quantum Systems",
    description,
    images: ["/images/iphone-unboxing.jpg"],
  },
  robots: { index: true, follow: true },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

const organization = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  legalName: LEGAL_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  image: `${SITE_URL}/images/iphone-unboxing.jpg`,
  email: CONTACT.email,
  ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
  address: {
    "@type": "PostalAddress",
    addressLocality: CONTACT.city,
    addressCountry: CONTACT.country,
  },
  areaServed: "NG",
  currenciesAccepted: "NGN",
  paymentAccepted: "Card, Bank transfer, USSD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col mesh-bg">
        <JsonLd data={organization} />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
