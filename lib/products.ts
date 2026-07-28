export type ShowcaseItem = {
  name: string;
  tagline: string;
  price: string;
  image: string;
  local?: boolean;
};

export const iphones: ShowcaseItem[] = [
  {
    name: "iPhone 12",
    tagline: "Unboxed. Sealed. Yours.",
    price: "₦645,000",
    image: "/images/iphone-unboxing.jpg",
    local: true,
  },
  {
    name: "iPhone 12 Pro",
    tagline: "Pacific Blue. Pro camera system.",
    price: "₦890,000",
    image: "/images/iphone-pacific-blue.jpg",
    local: true,
  },
  {
    name: "iPhone 16 Pro",
    tagline: "Natural Titanium. A18 Pro.",
    price: "₦1,850,000",
    image: "/images/iphone-titanium.jpg",
    local: true,
  },
  {
    name: "iPhone 11 Pro",
    tagline: "Space Gray. Triple lens.",
    price: "₦520,000",
    image: "/images/iphone-space-gray.jpg",
    local: true,
  },
];

export const laptops: ShowcaseItem[] = [
  {
    name: "MacBook Pro 14\"",
    tagline: "M4 Pro. Liquid Retina XDR.",
    price: "₦3,200,000",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Ultrabook Slim 15",
    tagline: "Featherweight. All-day battery.",
    price: "₦1,150,000",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Creator Station 16",
    tagline: "RTX graphics. Studio-grade display.",
    price: "₦2,400,000",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1400&auto=format&fit=crop",
  },
];

export const solar: ShowcaseItem[] = [
  {
    name: "Quantum Hybrid Inverter 5kVA",
    tagline: "Pure sine wave. MPPT charging.",
    price: "₦1,480,000",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Rooftop Solar Array 6.6kW",
    tagline: "Full installation and maintenance.",
    price: "₦4,900,000",
    image:
      "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Home Backup Bundle",
    tagline: "Inverter, batteries and panels.",
    price: "₦2,750,000",
    image:
      "https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=1400&auto=format&fit=crop",
  },
];

export const gaming: ShowcaseItem[] = [
  {
    name: "PlayStation 5 + DualSense",
    tagline: "Haptics you can feel.",
    price: "₦980,000",
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Console Living Room Kit",
    tagline: "Console, pad and 4K setup.",
    price: "₦1,350,000",
    image:
      "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Arcade Retro Rig",
    tagline: "Neon nights, classic fights.",
    price: "₦640,000",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1400&auto=format&fit=crop",
  },
];
