// Mock data for the customer dashboard.
// Swap these objects for real API responses later. Components consume only these types.

export type ProductCategory = "iPhone" | "Laptop" | "Solar" | "Gaming";

export type OrderStatus =
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  date: string; // ISO date
  item: string;
  category: ProductCategory;
  amount: number; // NGN
  status: OrderStatus;
}

export interface WishlistItem {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // NGN
  image: string;
  inStock: boolean;
}

export type RepairStatus =
  | "Received"
  | "Diagnosing"
  | "Awaiting Parts"
  | "In Repair"
  | "Ready for Pickup";

export interface Device {
  id: string;
  name: string;
  serial: string;
  service: string;
  status: RepairStatus;
  intake: string; // ISO date
  eta: string; // ISO date
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  memberSince: string;
}

export const user: UserProfile = {
  name: "Victor Chikwado",
  email: "victorchikwado122@gmail.com",
  phone: "+234 803 555 0122",
  address: "14 Admiralty Way, Lekki Phase 1",
  city: "Lagos",
  state: "Lagos",
  memberSince: "2024-03-18",
};

export const orders: Order[] = [
  { id: "CQS-2419", date: "2026-07-18", item: "iPhone 16 Pro, Natural Titanium 256GB", category: "iPhone", amount: 1850000, status: "Shipped" },
  { id: "CQS-2402", date: "2026-07-09", item: "Quantum Hybrid Inverter 5kVA", category: "Solar", amount: 1480000, status: "Processing" },
  { id: "CQS-2388", date: "2026-06-27", item: "PlayStation 5 + Extra DualSense", category: "Gaming", amount: 1075000, status: "Delivered" },
  { id: "CQS-2371", date: "2026-06-15", item: "MacBook Pro 14\" M4 Pro", category: "Laptop", amount: 3200000, status: "Delivered" },
  { id: "CQS-2344", date: "2026-05-30", item: "iPhone 12 Pro, Pacific Blue 128GB", category: "iPhone", amount: 890000, status: "Delivered" },
  { id: "CQS-2317", date: "2026-05-11", item: "Rooftop Solar Array 6.6kW (installation)", category: "Solar", amount: 4900000, status: "Delivered" },
  { id: "CQS-2290", date: "2026-04-22", item: "Gaming Headset + Controller Bundle", category: "Gaming", amount: 240000, status: "Cancelled" },
  { id: "CQS-2263", date: "2026-04-03", item: "Ultrabook Slim 15", category: "Laptop", amount: 1150000, status: "Delivered" },
];

export const wishlist: WishlistItem[] = [
  { id: "W-101", name: "iPhone 16 Pro Max, Desert Titanium", category: "iPhone", price: 2150000, image: "/images/iphone-titanium.jpg", inStock: true },
  { id: "W-102", name: "Creator Station 16 (RTX)", category: "Laptop", price: 2400000, image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=800&auto=format&fit=crop", inStock: true },
  { id: "W-103", name: "Home Backup Bundle", category: "Solar", price: 2750000, image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop", inStock: false },
  { id: "W-104", name: "Arcade Retro Rig", category: "Gaming", price: 640000, image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop", inStock: true },
  { id: "W-105", name: "iPhone 12, Black 64GB", category: "iPhone", price: 645000, image: "/images/iphone-unboxing.jpg", inStock: true },
  { id: "W-106", name: "Console Living Room Kit", category: "Gaming", price: 1350000, image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=800&auto=format&fit=crop", inStock: true },
];

export const devices: Device[] = [
  { id: "RPR-0871", name: "iPhone 11 Pro, Space Gray", serial: "F2LZK1XHN70F", service: "Screen + battery replacement", status: "In Repair", intake: "2026-07-20", eta: "2026-07-28" },
  { id: "RPR-0864", name: "MacBook Air M1", serial: "C02G81QJQ6L4", service: "Keyboard replacement", status: "Awaiting Parts", intake: "2026-07-14", eta: "2026-08-02" },
  { id: "RPR-0859", name: "PS5 DualSense Controller", serial: "DS5-99231", service: "Stick drift repair", status: "Ready for Pickup", intake: "2026-07-08", eta: "2026-07-24" },
];

export const orderStats = {
  totalOrders: orders.length,
  totalSpend: orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.amount, 0),
  activeOrders: orders.filter(
    (o) => o.status === "Processing" || o.status === "Shipped"
  ).length,
  devicesInService: devices.filter((d) => d.status !== "Ready for Pickup")
    .length,
};
