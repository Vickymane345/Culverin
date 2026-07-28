import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RepairStatusBadge } from "@/components/dashboard/StatusBadge";
import { devices, type RepairStatus } from "@/lib/mock-data";

const steps: RepairStatus[] = [
  "Received",
  "Diagnosing",
  "Awaiting Parts",
  "In Repair",
  "Ready for Pickup",
];

function Progress({ status }: { status: RepairStatus }) {
  const idx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1.5" aria-label={`Repair progress: ${status}`}>
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full ${
            i <= idx ? "bg-accent" : "bg-surface"
          }`}
        />
      ))}
    </div>
  );
}

export default function DevicesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">My devices</h1>
        <p className="mt-1 text-muted">
          Repairs currently in the Culverin lab.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {devices.map((d) => (
          <Card key={d.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle className="leading-snug">{d.name}</CardTitle>
                <RepairStatusBadge status={d.status} />
              </div>
              <CardDescription className="font-mono text-xs">
                {d.id} / SN {d.serial}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted">{d.service}</p>
              <Progress status={d.status} />
              <div className="flex justify-between text-xs text-muted">
                <span>
                  In:{" "}
                  {new Date(d.intake).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
                <span>
                  ETA:{" "}
                  {new Date(d.eta).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
