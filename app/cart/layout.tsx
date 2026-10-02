import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Your bag", robots: { index: false } };

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-32 sm:px-6">{children}</main>
      <Footer />
    </>
  );
}
