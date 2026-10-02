import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/dashboard/StatusBadge";
import { requireAccount } from "@/lib/account";
import { orderSummary, type OrderRow, type RepairRow } from "@/lib/types";
import { formatNGN } from "@/lib/utils";

export default async function DashboardOverview() {
  const { user, profile, supabase } = await requireAccount();

  const [{ data: orderData }, { data: repairData }] = await Promise.all([
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("repair_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const orders = (orderData ?? []) as OrderRow[];
  const repairs = (repairData ?? []) as RepairRow[];
  const placed = orders.filter((o) => o.status !== "pending_payment" && o.status !== "cancelled");
  const stats = {
    totalOrders: placed.length,
    totalSpend: placed.reduce((n, o) => n + o.total, 0),
    activeOrders: orders.filter((o) => ["paid", "processing", "shipped"].includes(o.status)).length,
    devicesInService: repairs.filter((r) => r.status !== "Ready for Pickup" && r.status !== "Collected").length,
  };
  const firstName = (profile.full_name || "").split(" ")[0];
  const recent = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1 text-muted">Your orders and devices at a glance.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total orders</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{stats.totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Lifetime spend</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{formatNGN(stats.totalSpend)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active orders</CardDescription>
            <CardTitle className="text-3xl text-accent">{stats.activeOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Devices in service</CardDescription>
            <CardTitle className="text-3xl text-accent">{stats.devicesInService}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent orders</CardTitle>
            <Link href="/dashboard/orders" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recent.length === 0 ? (
              <p className="text-sm text-muted">
                No orders yet. <Link href="/shop" className="text-accent hover:underline">Visit the shop</Link>.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell className="font-mono text-xs">{o.reference}</TableCell>
                      <TableCell className="max-w-[10rem] truncate sm:max-w-[16rem]">{orderSummary(o)}</TableCell>
                      <TableCell className="whitespace-nowrap">{formatNGN(o.total)}</TableCell>
                      <TableCell><OrderStatusBadge status={o.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>
                Member since{" "}
                {new Date(profile.created_at).toLocaleDateString("en-NG", { year: "numeric", month: "long" })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted">
              <p>{user.email}</p>
              {profile.phone && <p>{profile.phone}</p>}
              {profile.address ? (
                <p>{[profile.address, profile.city].filter(Boolean).join(", ")}</p>
              ) : (
                <Link href="/dashboard/settings" className="text-accent hover:underline">Add a delivery address</Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>In the lab</CardTitle>
              <Link href="/dashboard/devices" className="text-sm text-accent hover:underline">
                My devices
              </Link>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {repairs.length === 0 ? (
                <p className="text-muted">No repairs booked.</p>
              ) : (
                repairs.slice(0, 2).map((d) => (
                  <div key={d.id} className="flex items-center justify-between gap-3">
                    <span className="truncate text-muted">{d.device}</span>
                    <span className="font-mono text-xs text-muted">{d.status}</span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
