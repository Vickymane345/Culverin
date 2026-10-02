import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RepairStatusBadge } from "@/components/dashboard/StatusBadge";
import RepairForm from "@/components/forms/RepairForm";
import { requireAccount } from "@/lib/account";
import { REPAIR_STATUSES, type RepairRow, type RepairStatus } from "@/lib/types";

const steps = REPAIR_STATUSES.filter((s) => s !== "Collected");

function Progress({ status }: { status: RepairStatus }) {
  const idx = status === "Collected" ? steps.length - 1 : steps.indexOf(status);
  return (
    <div className="flex items-center gap-1.5" aria-label={`Repair progress: ${status}`}>
      {steps.map((s, i) => (
        <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= idx ? "bg-accent" : "bg-surface"}`} />
      ))}
    </div>
  );
}

const day = (d: string) => new Date(d).toLocaleDateString("en-NG", { day: "numeric", month: "short" });

export default async function DevicesPage() {
  const { user, profile, supabase } = await requireAccount("/dashboard/devices");
  const { data } = await supabase
    .from("repair_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  const repairs = (data ?? []) as RepairRow[];

  return (
    <div className="mx-auto max-w-6xl space-y-6 md:space-y-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">My devices</h1>
        <p className="mt-1 text-muted">Repairs booked with the Culverin lab.</p>
      </div>

      {repairs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {repairs.map((d) => (
            <Card key={d.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="leading-snug">{d.device}</CardTitle>
                  <RepairStatusBadge status={d.status} />
                </div>
                <CardDescription className="font-mono text-xs">
                  {d.reference}
                  {d.serial ? ` / SN ${d.serial}` : ""}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="line-clamp-3 text-sm text-muted">{d.issue}</p>
                <Progress status={d.status} />
                <div className="flex justify-between text-xs text-muted">
                  <span>In: {day(d.created_at)}</span>
                  <span>ETA: {d.eta ? day(d.eta) : "after diagnosis"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Book a repair</CardTitle>
          <CardDescription>We will call you to arrange drop-off or pickup.</CardDescription>
        </CardHeader>
        <CardContent>
          <RepairForm
            defaults={{
              name: profile.full_name ?? "",
              email: user.email ?? "",
              phone: profile.phone ?? "",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
