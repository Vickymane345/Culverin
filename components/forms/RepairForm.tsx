"use client";

import { useActionState } from "react";
import { bookRepair } from "@/app/actions/requests";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";

export default function RepairForm({
  defaults = {},
}: {
  defaults?: { name?: string; email?: string; phone?: string };
}) {
  const [state, action, pending] = useActionState(bookRepair, undefined);

  return (
    <form action={action} className="space-y-4">
      <FormMessage error={state?.error} message={state?.message} />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="r-name">Your name</Label>
          <Input id="r-name" name="name" autoComplete="name" defaultValue={defaults.name} required />
        </div>
        <div>
          <Label htmlFor="r-phone">Phone</Label>
          <Input id="r-phone" name="phone" type="tel" autoComplete="tel" defaultValue={defaults.phone} required />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="r-email">Email</Label>
          <Input id="r-email" name="email" type="email" autoComplete="email" defaultValue={defaults.email} required />
        </div>
        <div>
          <Label htmlFor="r-device">Device</Label>
          <Input id="r-device" name="device" placeholder="e.g. iPhone 13 Pro, HP EliteBook 840" required />
        </div>
        <div>
          <Label htmlFor="r-serial">Serial / IMEI (optional)</Label>
          <Input id="r-serial" name="serial" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="r-issue">What is wrong?</Label>
          <Textarea id="r-issue" name="issue" rows={4} placeholder="Cracked screen, battery drains fast, won't charge…" required />
        </div>
      </div>
      <Button type="submit" disabled={pending} className="w-full py-3 sm:w-auto">
        {pending ? "Booking…" : "Book repair"}
      </Button>
    </form>
  );
}
