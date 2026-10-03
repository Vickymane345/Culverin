// Shapes of rows read from Supabase. Mirrors supabase/migrations/0001_init.sql.

export const ORDER_STATUSES = [
  "pending_payment",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const REPAIR_STATUSES = [
  "Received",
  "Diagnosing",
  "Awaiting Parts",
  "In Repair",
  "Ready for Pickup",
  "Collected",
] as const;
export type RepairStatus = (typeof REPAIR_STATUSES)[number];

export interface OrderItemRow {
  id: string;
  product_slug: string;
  product_name: string;
  category: string;
  option: string | null;
  colour: string | null;
  image: string | null;
  unit_price: number;
  quantity: number;
}

export interface OrderRow {
  id: string;
  reference: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  payment_method: "opay" | "paystack" | "bank_transfer";
  paid_at: string | null;
  created_at: string;
  order_items?: OrderItemRow[];
}

export interface RepairRow {
  id: string;
  reference: string;
  name: string;
  email: string;
  phone: string;
  device: string;
  serial: string | null;
  issue: string;
  status: RepairStatus;
  eta: string | null;
  created_at: string;
}

export interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  is_admin: boolean;
  created_at: string;
}

export interface EnquiryRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  handled: boolean;
  created_at: string;
}

export function orderSummary(o: OrderRow) {
  const items = o.order_items ?? [];
  if (items.length === 0) return "Order";
  const first = items[0].product_name + (items[0].option ? ` ${items[0].option}` : "");
  return items.length > 1 ? `${first} + ${items.length - 1} more` : first;
}
