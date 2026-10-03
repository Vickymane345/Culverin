import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopNav from "@/components/shop/ShopNav";
import { getCategories } from "@/lib/catalog";

export const metadata: Metadata = {
  title: {
    default: "Shop Phones, Laptops, Gaming & Solar",
    template: "%s | Culverin Quantum Systems",
  },
  alternates: { canonical: "/shop" },
  description:
    "Buy iPhone, Samsung Galaxy, MacBook, Dell, HP and Lenovo laptops, tablets, audio, gaming gear and solar inverters in Nigeria.",
};

export default async function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();
  return (
    <>
      <Navbar />
      <div className="pt-24">
        <ShopNav categories={categories.map(({ id, name }) => ({ id, name }))} />
        <main className="w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
      <Footer />
    </>
  );
}
