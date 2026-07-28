import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/dashboard/StatusBadge";
import { orders, orderStats, user, devices } from "@/lib/mock-data";
import { formatNGN } from "@/lib/utils";

export default function DashboardOverview() {
  const recent = orders.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">
          Welcome back, {user.name.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted">
          Your orders and devices at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total orders</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{orderStats.totalOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Lifetime spend</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl">{formatNGN(orderStats.totalSpend)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active orders</CardDescription>
            <CardTitle className="text-3xl text-accent">{orderStats.activeOrders}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Devices in service</CardDescription>
            <CardTitle className="text-3xl text-accent">{orderStats.devicesInService}</CardTitle>
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
                    <TableCell className="font-mono text-xs">{o.id}</TableCell>
                    <TableCell className="max-w-[10rem] truncate sm:max-w-[16rem]">{o.item}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatNGN(o.amount)}</TableCell>
                    <TableCell><OrderStatusBadge status={o.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Member since {new Date(user.memberSince).toLocaleDateString("en-NG", { year: "numeric", month: "long" })}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted">
              <p>{user.email}</p>
              <p>{user.phone}</p>
              <p>{user.address}, {user.city}</p>
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
              {devices.slice(0, 2).map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3">
                  <span className="truncate text-muted">{d.name}</span>
                  <span className="font-mono text-xs text-muted">{d.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
