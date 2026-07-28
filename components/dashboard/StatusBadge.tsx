import { Badge } from "@/components/ui/badge";
import type { OrderStatus, RepairStatus } from "@/lib/mock-data";

const orderMap: Record<OrderStatus, "info" | "success" | "warning" | "destructive"> = {
  Processing: "warning",
  Shipped: "info",
  Delivered: "success",
  Cancelled: "destructive",
};

const repairMap: Record<RepairStatus, "info" | "success" | "warning" | "muted"> = {
  Received: "muted",
  Diagnosing: "info",
  "Awaiting Parts": "warning",
  "In Repair": "info",
  "Ready for Pickup": "success",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={orderMap[status]}>{status}</Badge>;
}

export function RepairStatusBadge({ status }: { status: RepairStatus }) {
  return <Badge variant={repairMap[status]}>{status}</Badge>;
}
