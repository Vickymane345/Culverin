import dynamic from "next/dynamic";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import IphoneShowcase from "@/components/sections/IphoneShowcase";
import LaptopShowcase from "@/components/sections/LaptopShowcase";
import SolarShowcase from "@/components/sections/SolarShowcase";
import GamingShowcase from "@/components/sections/GamingShowcase";
import WhyBuy from "@/components/sections/WhyBuy";
import Services from "@/components/sections/Services";
import Footer from "@/components/Footer";

const QuantumScene = dynamic(() => import("@/components/QuantumScene"));

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main className="w-full max-w-full overflow-x-hidden">
        <Hero />
        <div className="relative">
          <div className="pointer-events-none sticky top-0 h-screen -mb-[100vh]">
            <QuantumScene />
          </div>
          <div className="relative z-10">
            <IphoneShowcase />
            <LaptopShowcase />
          </div>
        </div>
        <SolarShowcase />
        <GamingShowcase />
        <WhyBuy />
        <Services />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
