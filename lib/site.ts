// Site-wide constants. Set NEXT_PUBLIC_SITE_URL to the live domain in production
// so canonical URLs, the sitemap and Paystack callbacks point to the right place.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const SITE_NAME = "Culverin Quantum Systems";
export const LEGAL_NAME = "Culverin Quantum Systems Limited";
export const RC_NUMBER = "RC 9083558";

// Where customers send bank transfers. Shown at checkout and in emails.
export const BANK = {
  bankName: "UBA (United Bank for Africa)",
  accountNumber: "2143392837",
  accountName: process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || "",
};

export const CONTACT = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@culverinquantum.com",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || "",
  city: "Lagos",
  country: "NG",
};
