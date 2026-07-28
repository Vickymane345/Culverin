import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/dashboard/StatusBadge";
import { orders } from "@/lib/mock-data";
import { formatNGN } from "@/lib/utils";

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">Order history</h1>
        <p className="mt-1 text-muted">All orders across every category.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>{orders.length} orders on record</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-mono text-xs">{o.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-muted">
                    {new Date(o.date).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                  </TableCell>
                  <TableCell className="max-w-[12rem] truncate sm:max-w-[20rem]">{o.item}</TableCell>
                  <TableCell><Badge variant="muted">{o.category}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap">{formatNGN(o.amount)}</TableCell>
                  <TableCell><OrderStatusBadge status={o.status} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
