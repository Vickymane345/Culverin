import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ShopNav from "@/components/shop/ShopNav";

export const metadata: Metadata = {
  title: "Shop | Culverin Quantum Systems",
  description:
    "Buy iPhone, Samsung Galaxy, MacBook, Dell, HP and Lenovo laptops, tablets, audio, gaming gear and solar inverters in Nigeria.",
};

export default function ShopLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      <div className="pt-24">
        <ShopNav />
        <main className="w-full max-w-full overflow-x-hidden">{children}</main>
      </div>
      <Footer />
    </>
  );
}
