import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABEL, type OrderStatus, type RepairStatus } from "@/lib/types";

const orderMap: Record<OrderStatus, "info" | "success" | "warning" | "destructive" | "muted"> = {
  pending_payment: "muted",
  paid: "info",
  processing: "warning",
  shipped: "info",
  delivered: "success",
  cancelled: "destructive",
};

const repairMap: Record<RepairStatus, "info" | "success" | "warning" | "muted"> = {
  Received: "muted",
  Diagnosing: "info",
  "Awaiting Parts": "warning",
  "In Repair": "info",
  "Ready for Pickup": "success",
  Collected: "muted",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={orderMap[status]}>{ORDER_STATUS_LABEL[status]}</Badge>;
}

export function RepairStatusBadge({ status }: { status: RepairStatus }) {
  return <Badge variant={repairMap[status]}>{status}</Badge>;
}
